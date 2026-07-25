---
title: 推理性能基础
category: 10-deployment-inference-inference-performance
tags: [inference, performance, latency, throughput, roofline, benchmarking]
summary: "> LLM 推理性能的核心指标、瓶颈分析框架与优化技术分类。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Inference Performance Fundamentals"
  - Inference_Performance_Fundamentals
sources: []

---
# 推理性能基础

> 延迟花在哪里、吞吐上不去的根因是什么、优化手段又该从哪里下手。

---

## 1. 核心指标

LLM 推理服务的性能通常用下面四个指标刻画。

### 1.1 TTFT（Time To First Token）

从请求到达，到模型输出**第一个 token** 的时间。

- 主要消耗在 **Prefill 阶段**：把用户输入的所有 token 过一遍模型，算出一个 KV Cache。
- 输入越长，TTFT 越高。
- 优化方向：FlashAttention、 Prefix Caching、PD 分离、输入压缩。

### 1.2 TPOT（Time Per Output Token）

生成阶段，**每输出一个 token 的平均耗时**。

- 主要消耗在 **Decode 阶段**：每次只生成一个新 token，但要读取前面所有 KV Cache。
- 优化方向：KV Cache 压缩、量化、投机解码、算子融合、更大的 batch size。

### 1.3 Throughput（吞吐量）

单位时间内生成的 token 数或处理的请求数。

- **Token throughput**（tok/s）：衡量系统整体产能。
- **Request throughput**（req/s / QPS）：衡量在线服务能力。
- 优化方向：Continuous Batching、动态批处理、更大的 batch、更高效的 attention 算子。

### 1.4 端到端延迟（E2E Latency）

用户感知的总延迟：

```
E2E Latency ≈ TTFT + (输出 token 数 × TPOT)
```

> 注意：压缩 TPOT 对长输出更重要；压缩 TTFT 对短输入/首屏体验更重要。

---

## 2. 瓶颈分析框架

### 2.1 两阶段模型

一次 LLM 推理可以分成两个阶段：

| 阶段 | 计算特征 | 瓶颈 |
|------|----------|------|
| **Prefill** | 输入 token 并行计算，计算密集 | 算力（FLOPS） |
| **Decode** | 逐个 token 自回归，显存带宽密集 | 显存带宽、KV Cache 大小 |

因此，**同一个优化手段对不同阶段的收益不同**：

- 量化：对 decode 收益大（减少 KV Cache 带宽）。
- FlashAttention：对 prefill 收益大（减少冗余计算）。
- PD 分离：把两个阶段拆到不同资源上，分别优化。

### 2.2 Roofline 模型

Roofline 把性能上限表示为：

```
性能上限 = min(峰值算力, 显存带宽 × 运算强度)
```

- **运算强度高**（prefill、大批量）：受峰值算力限制。
- **运算强度低**（decode、小批量）：受显存带宽限制。

判断瓶颈：

| 现象 | 可能瓶颈 |
|------|----------|
| GPU 利用率高但吞吐低 | 显存带宽 bound（典型 decode） |
| GPU 利用率低 | 请求不足、通信/调度 overhead、CPU 预处理慢 |
| 长输入 TTFT 极高 | 算力 bound 或 attention 复杂度 |
| batch size 增大吞吐反而下降 | KV Cache 爆显存或调度 overhead |

### 2.3 常见瓶颈定位 checklist

1. **CPU/GPU 是否在忙？** `nvidia-smi dmon` 看 util、mem、温度。
2. **TTFT 高还是 TPOT 高？** 区分 prefill/decode 问题。
3. **batch size 是否足够？** 小 batch 下 GPU 利用率通常上不去。
4. **KV Cache 是否占满？** 长上下文容易显存先爆。
5. **通信占比多少？** 多卡/多节点注意 NCCL AllReduce 时间。
6. **预处理/后处理是否拖后腿？** tokenize、detokenize、采样有时占 10-30%。

---

## 3. 优化技术分类

### 3.1 计算优化

| 技术 | 作用 | 适用场景 |
|------|------|----------|
| 量化 | 降低权重和 KV Cache 精度，提升带宽 | 几乎所有部署场景 |
| FlashAttention / FlashDecoding | 减少 attention 显存访问 | prefill/decode 都受益 |
| 算子融合 | 减少 kernel launch 和中间结果 | 小 batch、低延迟 |
| 投机解码 | 用小模型/草稿并行生成多个 token | decode 阶段延迟敏感 |
| MoE 专家并行 | 减少激活参数、平衡负载 | MoE 大模型 |

### 3.2 显存与 KV Cache 优化

| 技术 | 作用 |
|------|------|
| GQA / MQA / MLA | 减少 KV Cache 头数或维度 |
| KV Cache 量化 | FP8/INT8 存储 KV |
| PagedAttention | 分页管理 KV Cache，减少碎片 |
| Prefix Caching | 复用共享 prompt 的 KV Cache |
| KV Cache Offloading | 把 KV 换到 CPU/SSD/远程内存 |

### 3.3 调度与并发优化

| 技术 | 作用 |
|------|------|
| Continuous Batching | 动态把新请求塞进正在运行的 batch |
| Prefill-Decode 分离 | 让 prefill 和 decode 用不同资源配置 |
| 优先级调度 / 抢占 | 保障高优先级请求、SLO 隔离 |
| 请求调度策略 | chunked prefill、max token 预测、负载均衡 |

### 3.4 系统架构优化

| 技术 | 作用 |
|------|------|
| Tensor / Pipeline Parallelism | 多卡并行大模型 |
| 多模型混部 | 提高 GPU 利用率 |
| AI Gateway | 路由、缓存、降级、限流 |
| 弹性扩缩容 | 根据 QPS/延迟自动调整副本 |

---

## 4. 性能优化决策树

```
开始优化
│
├─ 延迟高？
│   ├─ TTFT 高 → FlashAttention、Prefix Cache、PD 分离、输入压缩
│   └─ TPOT 高 → KV Cache 压缩、量化、投机解码、更大的 batch
│
├─ 吞吐低？
│   ├─ GPU 利用率低 → Continuous Batching、提高并发、减少 CPU 开销
│   └─ GPU 利用率高 → 量化、算子优化、通信优化、扩容
│
├─ 长上下文出问题？
│   → MLA、KV 量化、PagedAttention、滑动窗口、KV Offloading
│
└─ 高并发/SLO 要求严？
    → PD 分离、优先级调度、AI Gateway、弹性扩缩容
```

---

## 5. 评测原则

1. **固定负载模型**：用真实请求分布，而不是单一 prompt 长度。
2. **同时报 TTFT 和 TPOT**：单看吞吐会掩盖延迟问题。
3. **控制变量**：对比不同引擎时，固定模型、量化方式、硬件、并发数。
4. **关注尾延迟**：P99 比 P50 更能反映用户体验。
5. ** warm up 后再测**：避免第一次推理的编译/缓存冷启动影响。

---

## Related

- [[概念/inference-performance]] — 推理性能概念卡
- [[概念/prefill-decode]] — Prefill / Decode 阶段
- [[概念/kv-cache]] — KV Cache 优化
- [[概念/continuous-batching]] — Continuous Batching
- [[概念/speculative-decoding]] — 投机解码
- [[部署推理/Inference_Performance/README|推理性能专题]]
- [[部署推理/Caching/KV_Cache_Deep_Dive|KV Cache Deep Dive]]
- [[部署推理/Quantization/Quantization_Techniques_2026|Quantization Techniques 2026]]

## 核心知识体系

| 知识域 | 核心内容 | 重要程度 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/原理/方法论 | 最高 | P0 |
| 技术实践 | 工具/框架/最佳实践 | 高 | P0 |
| 工程方法 | 设计模式/架构/流程 | 高 | P1 |
| 前沿趋势 | 新技术/新方向/研究 | 中 | P2 |
| 行业应用 | 实际案例/落地经验 | 中 | P1 |

## 技术对比与选型

| 维度 | 方案A | 方案B | 方案C | 选型建议 |
|------|-------|-------|-------|----------|
| 性能 | 高吞吐 | 低延迟 | 均衡 | 按场景选择 |
| 复杂度 | 简单 | 中等 | 复杂 | 按团队能力 |
| 成本 | 低 | 中 | 高 | 按预算约束 |
| 生态 | 成熟 | 发展中 | 新兴 | 按稳定性需求 |
| 扩展性 | 有限 | 良好 | 优秀 | 按增长预期 |

## 最佳实践清单

| 实践 | 说明 | 优先级 | 预期收益 |
|------|------|--------|----------|
| 标准化流程 | 统一规范和流程 | P0 | 减少错误+提升效率 |
| 自动化 | 重复工作自动化 | P0 | 节省时间+降低风险 |
| 持续监控 | 关键指标实时监控 | P1 | 及时发现问题 |
| 定期回顾 | 周期性复盘改进 | P1 | 持续优化 |
| 知识沉淀 | 文档化经验教训 | P2 | 团队能力提升 |
| 安全优先 | 安全贯穿全流程 | P0 | 降低风险 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 | 预防措施 |
|------|----------|----------|----------|
| 效率低下 | 流程不规范/工具不当 | 优化流程+引入工具 | 标准化+培训 |
| 质量不稳定 | 缺乏检查机制 | 引入质量门禁 | 自动化测试 |
| 协作困难 | 职责不清/沟通不畅 | 明确分工+定期同步 | 文档化+工具 |
| 技术债务 | 赶工忽略质量 | 定期重构+代码审查 | 质量优先文化 |
| 安全风险 | 意识不足/措施缺失 | 安全培训+工具扫描 | 安全左移 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 理解基本框架 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立完成基础任务 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能处理复杂问题 |
| 实战 | 生产级应用+优化 | 4-6周 | 独立负责项目 |
| 精通 | 架构设计+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业公认的最佳做法 |
| Anti-pattern | 反模式(应避免的做法) |
| Technical Debt | 技术债务(为速度牺牲质量) |
| CI/CD | 持续集成/持续部署 |
| SLA | 服务等级协议 |
| KPI | 关键绩效指标 |
| ROI | 投资回报率 |
| TCO | 总拥有成本 |

## 检查清单

- [ ] 核心概念和原理已理解
- [ ] 主流工具和框架已掌握
- [ ] 最佳实践已应用到工作中
- [ ] 常见问题能独立解决
- [ ] 持续关注前沿趋势
- [ ] 知识已文档化沉淀
