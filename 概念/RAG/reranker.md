---
title: "重排序模型 Reranker (Cross-Encoder Reranking Model)"
category: -concepts
tags: ["reranker", "reranking", "cross-encoder", "bge", "rag", "retrieval", "ai-stack"]
relationships:
  - target: "概念/embedding-models"
    type: related_to
  - target: "概念/rag-systems"
    type: related_to
  - target: "概念/agentic-rag"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "Reranker（重排序模型）是 RAG 流水线的第二阶段——对检索返回的候选文档进行精排，显著提升最终答案质量。AI Stack 预置 BAAI bge-reranker-v2-m3。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
updated: 2026-07-21
name_zh: "重排序模型 Reranker"
---

# 重排序模型 Reranker

> 中文简称：重排序模型 Reranker

> **一句话理解**: Reranker 是 RAG 的"质量守门员"——检索模型粗筛 100 个候选，Reranker 精排 Top-10，准确率直接提升 10-30%。

---

## 1. 核心问题：两阶段检索

```
RAG 两阶段检索流水线
│
├── 第一阶段：粗筛（Retrieval）
│   ├── 双塔编码器（Bi-Encoder / Embedding）
│   ├── 向量相似度搜索（ANN）
│   ├── 返回 Top-100 候选
│   └── 速度：毫秒级，但精度有限
│
└── 第二阶段：精排（Reranking）← 本文
    ├── 交叉编码器（Cross-Encoder / Reranker）
    ├── 逐对精确打分
    ├── 返回 Top-10 最终结果
    └── 速度：较慢，但精度高
```

---

## 2. Bi-Encoder vs Cross-Encoder

| 维度 | Bi-Encoder (Embedding) | Cross-Encoder (Reranker) |
|------|----------------------|------------------------|
| **编码方式** | Query 和 Doc 分别编码 | Query 和 Doc 拼接后联合编码 |
| **交互深度** | 无交互（仅向量相似度） | 全层交互（注意力交叉） |
| **速度** | 毫秒级（可批量） | 百毫秒级（逐对） |
| **精度** | 中等 | 高 |
| **可扩展性** | 百万级文档 | 仅重排候选集 |
| **典型模型** | bge-m3, GTE, E5 | bge-reranker, Cohere Rerank |
| **角色** | 第一阶段粗筛 | 第二阶段精排 |

---

## 3. AI Stack 预置模型

AI Stack 知识库预置 **bge-reranker-v2-m3**：

| 模型 | 来源 | 参数量 | 多语言 | 特点 |
|------|------|--------|--------|------|
| **bge-reranker-v2-m3** | BAAI (智源) | 568M | 100+ 语言 | 多语言重排序，AI Stack 预置 |

### bge-reranker-v2-m3 详情

| 属性 | 值 |
|------|-----|
| **基座模型** | XLM-RoBERTa-large |
| **最大长度** | 8192 tokens |
| **训练数据** | 多语言平行语料 + 硬负例 |
| **支持语言** | 中文/英文/日文等 100+ 语言 |
| **许可** | Apache 2.0 |

---

## 4. 主流 Reranker 方案对比

| 模型 | 来源 | 参数量 | 多语言 | 特点 |
|------|------|--------|--------|------|
| **bge-reranker-v2-m3** | BAAI | 568M | ✅ | 开源多语言首选 |
| **bge-reranker-v2-gemma** | BAAI | 2B | ✅ | 基于 Gemma，更强 |
| **Cohere Rerank 3** | Cohere | 闭源 | ✅ | 商业 API |
| **Jina Reranker** | Jina AI | 278M | ✅ | 轻量级 |
| **ms-marco-MiniLM** | 微软 | 33M | ❌ 英文 | 经典小模型 |

---

## 5. 在 RAG 中的效果

| 策略 | Recall@10 | MRR | NDCG@10 | 延迟 |
|------|----------|-----|---------|------|
| 仅 Embedding | 0.72 | 0.58 | 0.65 | ~10ms |
| Embedding + Reranker | **0.85** | **0.71** | **0.78** | ~200ms |
| 提升 | **+18%** | **+22%** | **+20%** | +190ms |

> Reranker 以 ~200ms 额外延迟换取 **10-30% 的精度提升**，在高价值场景中性价比极高。

---

## 6. AI Stack 知识库架构

```
AI Stack 知识库 RAG 流水线
│
├── 文档上传 → doc/docx/pdf/txt
├── 智能切分 → 自动分段
├── Embedding → 向量编码（Qwen3-Embedding-8B）
├── 向量检索 → 粗筛 Top-100
├── Reranker → bge-reranker-v2-m3 精排 Top-10 ← 本文
└── 生成 → 大模型基于 Top-10 回答
```

---

## Related

- [[概念/embedding-models]] — 嵌入模型
- [[概念/rag-systems]] — RAG 系统
- [[概念/agentic-rag]] — Agentic RAG
- [[概念/vector-database]] — 向量数据库
- [[概念/rag-production-architecture|RAG 生产架构]] — 生产级 RAG 设计
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析]] — AI Stack 深度解析

---

## 2026 Reranker 生态

| 模型 | 参数量 | 核心优势 | 适用场景 |
|------|--------|---------|----------|
| **bge-reranker-v2-m3** | 568M | 多语言、开源、效果好 | 通用生产 |
| **Cohere Rerank** | API | 零部署、效果顶级 | 快速集成 |
| **Jina Reranker v2** | 278M | 轻量、多语言 | 资源受限 |
| **mxbai-rerank** | 335M | 英文优化、开源 | 英文场景 |

## 生产最佳实践

1. **两阶段检索**：向量粗筛 Top-100 → Reranker 精排 Top-10，平衡延迟与质量
2. **模型选择**：多语言场景用 bge-reranker-v2-m3，英文场景可用轻量模型
3. **批量处理**：Reranker 支持批量输入，充分利用 GPU 并行
4. **阈值调优**：根据业务场景调整相关性阈值，过滤低质量结果
5. **延迟预算**：Reranker 增加 50-200ms 延迟，需在质量与延迟间权衡

## 2026 Reranker 生态现状

| 模型 | 参数量 | 精度 | 延迟 | 状态 |
|------|------|------|------|------|
| BGE-Reranker-v2 | 568M | 高 | 中 | ✅ 主流 |
| Cohere Rerank 3 | API | 极高 | 低 | ✅ 成熟 |
| Jina Reranker v2 | 278M | 高 | 低 | ✅ 成熟 |
| mxbai-rerank | 340M | 高 | 中 | ✅ 成熟 |
| RankGPT | LLM | 极高 | 高 | 🟡 发展中 |
| 轻量 Cross-Encoder | <100M | 中 | 极低 | ✅ 成熟 |

## 检查清单

- [ ] Reranker 模型已选择
- [ ] top-k 截断已配置（通常 20-50）
- [ ] 延迟预算已评估
- [ ] 精度提升已验证
- [ ] GPU 加速已配置（可选）
- [ ] 回退策略已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 延迟太高 | 模型太大 | 使用轻量模型或 GPU 加速 |
| 精度提升不明显 | top-k 太小 | 增大初始检索 top-k |
| 与检索结果不一致 | 模型不匹配 | 更换领域适配的 Reranker |
| 成本高 | API 调用多 | 自部署开源模型 |

## 延伸阅读

- [[概念/RAG/hybrid-search|Hybrid Search]] — 混合检索
- [[概念/RAG/embedding-models|Embedding Models]] — 嵌入模型
- [[概念/RAG/retrieval-latency|Retrieval Latency]] — 检索延迟
- [[概念/RAG/rag-patterns|RAG Patterns]] — RAG 模式
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库

> ℹ️ Reranker 是 RAG 质量提升的关键组件，2026年 BGE-Reranker-v2 和 Cohere Rerank 3 是主流选择，通常可提升 10-20% 检索精度。

## Reranker 配置示例

```python
from FlagEmbedding import FlagReranker
reranker = FlagReranker('BAAI/bge-reranker-v2-m3', use_fp16=True)
scores = reranker.compute_score([
    ['query', 'document1'],
    ['query', 'document2']
])
# 按分数排序，取 top-k
```

## 性能优化建议

| 优化项 | 效果 | 说明 |
|------|------|------|
| FP16 推理 | 2x 加速 | 精度损失 < 0.1% |
| 批量推理 | 3-5x 加速 | 增大 batch size |
| top-k 截断 | 减少计算 | 只 rerank top-20 |
| GPU 加速 | 5-10x 加速 | 生产必备 |
