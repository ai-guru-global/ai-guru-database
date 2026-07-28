---
title: Prefill-Decode 分离（Disaggregated Serving）
category: 10-deployment-inference-inference-performance
tags: [inference, prefill, decode, disaggregated-serving, kv-cache, performance]
summary: "> 把 LLM 推理的 Prefill 和 Decode 阶段拆到不同资源上执行，是长上下文与高并发场景的关键优化。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Prefill Decode Disaggregation"
  - Prefill_Decode_Disaggregation
sources: []

name_zh: "Prefill-Decode 分离"
---
# Prefill-Decode 分离（Disaggregated Serving）

> 中文简称：Prefill-Decode 分离

> 把 prefill 和 decode 拆到不同的 GPU/实例上，让两个阶段各自用最合适的资源配置。

---

## 1. 为什么需要分离

LLM 推理有两个完全不同的阶段：

| 阶段 | 特点 | 资源瓶颈 |
|------|------|----------|
| **Prefill** | 一次性处理整个输入 prompt，计算密集 | 算力（FLOPS） |
| **Decode** | 逐个生成 token，显存带宽密集 | 显存带宽、KV Cache |

混在一起时会出现问题：

1. **资源错配**：prefill 需要高算力，decode 需要高带宽，同一批 GPU 无法同时满足。
2. **互相干扰**：一个长输入的 prefill 会阻塞 decode 的 token 生成，导致 TPOT 抖动。
3. **扩缩容粒度粗**：只能按“完整推理实例”扩缩，无法针对 prefill 峰值或 decode 峰值分别调整。

**Prefill-Decode 分离**就是把这两个阶段拆开：

- **Prefill Workers**：专门处理 prompt 计算，输出 KV Cache。
- **Decode Workers**：专门做自回归生成，读取 KV Cache 继续生成。

---

## 2. 架构原理

```
用户请求
   │
   ▼
[API Gateway / Router]
   │
   ├───► [Prefill Worker]  ─── computes KV Cache ───┐
   │                                                  │
   │◄────────────────── KV Cache transfer ────────────┘
   │
   └───► [Decode Worker]  ─── 逐 token 生成 ───► 返回给用户
```

典型流程：

1. 请求到达后，router 把 prompt 发给一个 prefill worker。
2. prefill worker 算完所有 token 的 KV Cache。
3. KV Cache 通过网络/RDMA 传输到 decode worker。
4. decode worker 加载 KV Cache，开始自回归生成，并把结果流式返回。

---

## 3. 核心技术挑战

### 3.1 KV Cache 传输

Prefill 产生的 KV Cache 可能非常大：

- 128K 上下文 × 大模型层数 × 多头维度 = 几十 GB。
- 传输延迟会吃掉分离的收益。

优化方向：

| 技术 | 作用 |
|------|------|
| **RDMA / InfiniBand** | 高带宽低延迟传输 |
| **KV Cache 量化传输** | FP8/INT8 减少传输量 |
| **Pipeline 重叠** | 边传边 decode，隐藏传输延迟 |
| **就近调度** | 把 prefill 和 decode 放在同一节点/机架 |
| **分层存储** | 热 KV 放显存，冷 KV 放 CPU/SSD |

### 3.2 调度与负载均衡

- Prefill worker 负载取决于输入长度，波动大。
- Decode worker 负载取决于输出长度和并发数。
- 需要独立的调度策略和扩缩容策略。

常见做法：

- **Prefill 侧**：按输入长度、当前队列长度做负载均衡。
- **Decode 侧**：按当前占用 KV Cache 大小、并发 token 数做调度。
- **全局**：根据 QPS、TTFT SLO、TPOT SLO 自动调整两类 worker 比例。

### 3.3 容错与一致性

- 如果 decode worker 故障，需要把 KV Cache 重新路由到另一个 worker。
- 多轮对话需要持续追加 KV Cache，而不是每次都重新 prefill。

---

## 4. 收益与代价

### 收益

| 收益 | 说明 |
|------|------|
| **降低 TTFT** | prefill worker 可以配置更高算力、更大 batch |
| **稳定 TPOT** | decode 不再被长输入 prefill 阻塞 |
| **独立扩缩容** | prefill 高峰和 decode 高峰分别处理 |
| **提高资源利用率** | prefill 用算力型 GPU，decode 用带宽型 GPU |
| **支持超长上下文** | prefill 可以用更多卡并行，decode 保持低延迟 |

### 代价

| 代价 | 说明 |
|------|------|
| **KV Cache 传输开销** | 网络/RDMA 延迟和带宽成本 |
| **系统复杂度** | 需要独立的 router、调度器、监控 |
| **额外显存占用** | 传输过程中可能双份缓存 |
| **调试更复杂** | 问题可能出现在 prefill、传输、decode 任意一环 |

---

## 5. 典型实现

| 框架/论文 | 特点 |
|-----------|------|
| **DistServe** | 最早的 PD 分离系统之一，论证了分离的收益上限 |
| **vLLM Disaggregated Serving** | 在 vLLM V1 中逐步支持，集成 PagedAttention |
| **SGLang PD 分离** | 与 RadixAttention 前缀缓存结合 |
| **Mooncake / Kimi K2** | 大规模生产实践，强调 KV Cache 传输与全局调度 |
| **DeepSeek Infra** | 在 MoE + 长上下文场景下的 PD 分离实践 |

---

## 6. 选型建议

| 场景 | 是否推荐 PD 分离 |
|------|------------------|
| 输入短、输出短 | 不推荐，传输 overhead 不划算 |
| 输入长（>8K）、输出中等 | 推荐，TTFT 收益明显 |
| 高并发在线服务 | 推荐，TPOT 更稳定 |
| 超长上下文（>128K） | 强烈推荐，往往是必选项 |
| 单卡/边缘部署 | 不推荐，资源不够拆 |

---

## 7. 一句话总结

> Prefill-Decode 分离就是“让算力型 GPU 去算 prompt，让带宽型 GPU 去生成 token”，用 KV Cache 传输换两阶段的独立优化。

---

## Related

- [[概念/prefill-decode]] — Prefill / Decode 阶段
- [[概念/kv-cache]] — KV Cache 优化
- [[10_部署推理/04_Inference_Performance/README|推理性能专题]]
- [[10_部署推理/04_Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive|vLLM Deep Dive]]
- [[10_部署推理/02_Inference_Engines/SGLang_Deep_Dive|SGLang Deep Dive]]

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
