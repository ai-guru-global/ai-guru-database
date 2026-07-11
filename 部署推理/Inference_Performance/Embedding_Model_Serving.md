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
- [[RAG系统/README|RAG 系统]]
- [[部署推理/Inference_Performance/README|推理性能专题]]
- [[部署推理/Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[部署推理/Inference_Performance/Inference_Autoscaling_and_Load_Balancing|弹性扩缩容]]

- [[部署推理/README|模型部署与推理]]
