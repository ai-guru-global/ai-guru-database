---
title: 推理性能专题
category: 10-deployment-inference-inference-performance
tags: [inference, performance, latency, throughput, optimization, benchmarking]
summary: "> 从指标定义到系统优化：LLM 推理性能工程的知识地图与实践指南。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
sources: []

name_zh: "推理性能专题"
---
# 推理性能专题

> 中文简称：推理性能专题

> 从指标定义到系统优化：LLM 推理性能工程的知识地图与实践指南。

---

## 专题定位

本专题聚焦 **LLM 推理阶段的性能工程**，不重复讲解具体引擎的安装配置，而是把“性能指标 → 瓶颈定位 → 优化技术 → 评测方法”串成一条可落地的线索。

与现有内容的区别：

- `10_部署推理/README.md` 是**引擎选型地图**。
- `Deployment_Inference.md` 是**部署与加速概览**。
- 本专题是**性能工程方法论**，专门回答：
  - 延迟到底花在哪里？
  - 吞吐上不去是算力、显存带宽还是通信的问题？
  - 长上下文、高并发、MoE、多模态分别该怎么优化？
  - 如何设计公平、可复现的推理 benchmark？

---

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [推理性能基础](10_部署推理/04_Inference_Performance/Inference_Performance_Fundamentals.md) | 指标、瓶颈模型、Roofline、优化技术分类 | 所有性能工程从业者 |
| [决定模型推理速度的要素（大白话版）](10_部署推理/04_Inference_Performance/Inference_Speed_Factors_for_dummy.md) | 用生活化语言解释影响推理速度的六大因素 | 初学者、产品经理 |
| [推理性能术语大白话解释](10_部署推理/04_Inference_Performance/Inference_Terms_for_dummy.md) | MoE、MLA/GQA、FLOPS、Prefill、Decode、TTFT、量化、NVLink/IB、PD 分离 | 初学者 |
| [Prefill-Decode 分离](10_部署推理/04_Inference_Performance/Prefill_Decode_Disaggregation.md) | Disaggregated Serving 架构与 KV Cache 传输 | 长上下文/高并发场景 |
| [MoE 推理优化](10_部署推理/04_Inference_Performance/MoE_Inference_Optimization.md) | All-to-All、Expert Parallelism、负载均衡 | MoE 模型部署 |
| [推理 Profiling 与 Benchmarking](10_部署推理/04_Inference_Performance/LLM_Inference_Profiling_and_Benchmarking.md) | Nsight、PyTorch Profiler、llmperf、指标陷阱 | 性能测试工程师 |
| [Flash 系列 Kernel 深潜](10_部署推理/04_Inference_Performance/Flash_Kernels_Deep_Dive.md) | FlashAttention / FlashDecoding / FlashInfer / FlashMLA | Kernel/算子优化 |
| [LLM 请求调度](10_部署推理/04_Inference_Performance/Request_Scheduling_for_LLMs.md) | Continuous Batching、抢占、Chunked Prefill、SLO-aware | 服务调度 |
| [弹性扩缩容与负载均衡](10_部署推理/04_Inference_Performance/Inference_Autoscaling_and_Load_Balancing.md) | HPA、预热池、多模型混部、智能路由 | 平台/SRE |
| [Embedding/Reranker 服务](10_部署推理/04_Inference_Performance/Embedding_Model_Serving.md) | Dynamic Batching、Matryoshka、混合精度 | RAG 部署 |
| [多模态推理优化](10_部署推理/04_Inference_Performance/Multimodal_Inference_Optimization.md) | Vision Encoder、Image Token 压缩、VLM Prefill | VLM 部署 |
| [长上下文推理 2026](10_部署推理/04_Inference_Performance/Long_Context_Inference_2026.md) | 128K+ 上下文、KV Cache 压缩、PD 分离 | 长上下文服务 |
| [推理性能未解问题与缺口评估](10_部署推理/04_Inference_Performance/Remaining_Performance_Issues_2026.md) | 边缘、异构、能耗、多租户、编译启动等缺口 | 架构师、性能工程师 |

---

## 优化技术全景

```
LLM 推理性能优化技术栈
│
├── 1. 计算优化
│   ├── 量化（FP8/INT8/INT4/GPTQ/AWQ）
│   ├── 算子融合 / FlashAttention / FlashDecoding
│   ├── 投机解码（Speculative Decoding / Medusa / EAGLE）
│   └── MoE 专家并行与负载均衡
│
├── 2. 显存与带宽优化
│   ├── KV Cache 压缩（GQA/MLA）
│   ├── KV Cache 量化 / Offloading
│   ├── PagedAttention / RadixAttention
│   └── Prefix / Prompt Caching
│
├── 3. 调度与并发优化
│   ├── Continuous Batching
│   ├── Prefill-Decode 分离
│   ├── 请求优先级与抢占
│   └── 动态扩缩容与负载均衡
│
└── 4. 系统架构优化
    ├── Tensor / Pipeline / Expert Parallelism
    ├── 多模型混部
    ├── 边缘/CPU/NPU 推理
    └── AI Gateway 路由与缓存
```

---

## 核心指标速查

| 指标 | 含义 | 常见目标 |
|------|------|----------|
| **TTFT** | Time To First Token，首 token 延迟 | P50 < 100ms，P99 < 500ms |
| **TPOT** | Time Per Output Token，生成阶段每 token 耗时 | 尽量低，与 decode 算力/带宽相关 |
| **Throughput** | 总吞吐（tokens/s 或 requests/s） | 越高越好，受 batch size 影响大 |
| **QPS** | 每秒请求数 | 在线服务核心指标 |
| **GPU Utilization** | GPU 利用率 | 高不一定代表高效，需结合 roofline |

---

## 关联内容

- [09 部署与推理总览](.README.md)
- [Deployment Inference](10_部署推理/01_Deployment_Fundamentals/Deployment_Inference.md) — 部署与推理加速概览
- [KV Cache Deep Dive](10_部署推理/06_Caching/KV_Cache_Deep_Dive.md) — KV Cache 深度优化
- [Quantization Techniques 2026](10_部署推理/05_Quantization/Quantization_Techniques_2026.md) — 量化技术全景
- [Speculative Decoding Advanced 2026](10_部署推理/06_Caching/Speculative_Decoding_Advanced_2026.md) — 投机解码
- [Prompt Caching and KV Cache Optimization](10_部署推理/06_Caching/Prompt_Caching_and_KV_Cache_Optimization.md) — 缓存优化

---

## Related

- [[概念/inference-performance]] — 推理性能：概念卡
- [[概念/kv-cache]] — KV Cache 优化
- [[概念/paged-attention]] — PagedAttention
- [[概念/continuous-batching]] — Continuous Batching
- [[概念/speculative-decoding]] — 投机解码
- [[概念/prefill-decode]] — Prefill / Decode 阶段
- [[10_部署推理/README|模型部署与推理]]

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

## 进阶知识拓展

| 主题 | 深度内容 | 应用场景 | 参考资源 |
|------|----------|----------|----------|
| 核心原理 | 底层机制和数学推导 | 深度理解+优化 | 经典教材+论文 |
| 工程实践 | 生产级实现细节 | 项目落地 | 开源项目+案例 |
| 性能优化 | 瓶颈分析+调优策略 | 提升效率 | 性能分析工具 |
| 安全合规 | 安全威胁+防护措施 | 风险管控 | 安全框架+标准 |
| 前沿研究 | 最新进展+未来方向 | 技术预判 | 顶会论文+博客 |

## 实践指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |

## 知识图谱关联

| 关联主题 | 关系类型 | 参考路径 |
|----------|----------|----------|
| 基础理论 | 前置依赖 | 相关基础目录 |
| 工具实践 | 实现支撑 | 工具/编程相关 |
| 应用场景 | 价值体现 | 18_行业应用/ |
| 前沿研究 | 发展方向 | 20_论文精读/ |
| 工程方法 | 质量保障 | 09_测试/13_运维/ |

## 版本更新记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-01 | 初始创建 |
| v1.1 | 2025-06 | 内容补充 |
| v2.0 | 2026-01 | 全面扩写 |
| v2.1 | 2026-07 | 质量强化+结构化增强 |

## 快速自检

- [ ] 核心概念能向他人清晰解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案优劣势和适用场景
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态
- [ ] 知识已文档化沉淀
