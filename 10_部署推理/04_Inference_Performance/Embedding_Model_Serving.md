---
title: Embedding 与 Reranker 模型服务
category: 10-deployment-inference-inference-performance
tags: [inference, embedding, reranker, serving, dynamic-batching, performance]
summary: "> Embedding 和 Reranker 是 RAG 的关键路径，推理特征与 LLM 不同，需要专门的 batching 和部署策略。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Embedding Model Serving"
  - Embedding_Model_Serving
sources: []

---
# Embedding 与 Reranker 模型服务

> RAG 系统里，Embedding 和 Reranker 的吞吐直接决定检索延迟，而它们的服务方式和 LLM 完全不同。

---

## 1. 为什么 Embedding/Reranker 要单独讲

与自回归 LLM 不同：

| 特征 | LLM | Embedding / Reranker |
|------|-----|----------------------|
| 输出 | 逐个 token 生成 | 一次性输出向量/分数 |
| 阶段 | Prefill + Decode | 只有 Encoder 前向 |
| 延迟敏感点 | TTFT / TPOT | 单次前向延迟 |
| Batch 收益 | 高 | 极高（无 decode 串行） |
| 输入长度 | 变长 | 变长，但通常更短 |
| KV Cache | 有 | 无 |

因此优化重点完全不同。

---

## 2. Embedding 模型服务

### 2.1 核心任务

把文本/图像/代码变成向量：

```
text → [Tokenizer] → [Encoder] → vector (d-dim)
```

### 2.2 动态 Batching（Dynamic Batching）

Embedding 推理的 batch 收益非常高：

- 小 batch：GPU 算力利用率低。
- 大 batch：吞吐几乎线性增长，直到显存瓶颈。

**Dynamic Batching** 把同时到达的短请求打包成大 batch。

```
请求: [A:10 tokens] [B:20 tokens] [C:15 tokens] [D:8 tokens]
打包: batch=[A,B,C,D], padding 到 20 tokens
```

注意：

- Padding 会浪费计算，可以用 **padding-free / 变长 batching** 优化。
- 长请求会拖大 batch，可以单独处理或截断。

### 2.3 Matryoshka 表示学习

Matryoshka Embedding 支持输出不同维度的向量：

```
full_dim = 1024
short_dim = 256
```

- 检索时用 256 维，快速粗排。
- 精排时用 1024 维，更高质量。

服务时要根据业务需求选择维度，低维度吞吐更高。

### 2.4 混合精度

- FP16/BF16：速度与精度平衡。
- FP8/INT8：进一步提升吞吐，注意精度评估。

### 2.5 常用推理框架

| 框架 | 特点 |
|------|------|
| **Sentence Transformers** | 易用，适合原型 |
| **FlagEmbedding / BGE** | 中文优化 |
| **Infinity** | 专为 Embedding/Reranker 服务优化 |
| **Text Embeddings Inference (TEI)** | HuggingFace 出品，dynamic batching |
| **vLLM / SGLang** | 也能跑 Embedding，但不如专用框架极致 |
| **ONNX Runtime / TensorRT** | 极致延迟 |

---

## 3. Reranker 模型服务

### 3.1 核心任务

对 `(query, doc)` 对打分，判断相关性：

```
[query, doc] → [Cross-Encoder] → score
```

### 3.2 特点

- **输入长**：query + doc 拼接，常达 512/1024 tokens。
- **批处理难**：每个 query 对应不同 doc，组合爆炸。
- **计算量大**：Cross-Encoder 比双塔 Embedding 慢得多。

### 3.3 优化策略

| 策略 | 说明 |
|------|------|
| **粗排 + 精排** | Embedding 先召回 Top-K，Reranker 只精排 Top-K |
| **限制 Reranker 输入长度** | doc 截断到 256/512，平衡质量与速度 |
| **批量 rerank** | 同一 query 对多个 doc 打分可 batch |
| **缓存重排结果** | 热门 query-doc 对缓存分数 |

---

## 4. RAG 场景中的部署模式

```
用户请求
   │
   ├──► Embedding 服务 ──► 向量数据库检索 ──► Top-K 召回
   │                                           │
   └──► Reranker 服务 ◄────────────────────────┘
   │
   └──► LLM 生成最终答案
```

性能关键点：

- Embedding 延迟决定检索第一步。
- Reranker 延迟取决于 Top-K 大小。
- 三者通常需要独立扩缩容。

---

## 5. 一句话总结

> Embedding/Reranker 服务的关键是 **Dynamic Batching + 混合精度 + 合理的维度/截断策略**，它们和 LLM 推理应该分开优化、独立扩缩。

---

## Related

- [[概念/embedding-models]] — Embedding 模型
- [[14_RAG系统/README|RAG 系统]]
- [[10_部署推理/04_Inference_Performance/README|推理性能专题]]
- [[10_部署推理/04_Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[10_部署推理/04_Inference_Performance/Inference_Autoscaling_and_Load_Balancing|弹性扩缩容]]

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
