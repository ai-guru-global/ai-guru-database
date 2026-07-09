---
title: "RAG 调试速查表"
category: 14-rag-systems
subcategory: advanced-rag
tags: ["rag", "debugging", "retrieval", "vector-database", "cheat-sheet", "alibaba-cloud"]
summary: "面向 RAG 系统的调试速查表：覆盖检索、重排序、生成、评估四个环节的诊断命令、指标与修复方向。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# RAG 调试速查表

> **使用方式**: 根据 RAG 链路阶段定位问题，逐个环节验证。

---

## RAG 链路

```text
Query → 重写/扩展 → 检索 → 重排序 → 上下文构造 → LLM 生成 → Answer
```

---

## 1. Query 阶段

| 问题 | 检查 | 修复 |
|------|------|------|
|  query 太短/太模糊 | 日志分析 | Query 扩展、HyDE |
|  多轮对话丢失上下文 | 对话历史 | 上下文压缩、摘要 |
|  专业术语错误 | 用户画像 | Query 纠错、同义词扩展 |

---

## 2. 检索阶段

```bash
# 测试向量检索
python test_retrieval.py \
  --query "什么是 RAG" \
  --index_path /data/index.faiss \
  --top_k 10

# 查看向量库元数据
python -c "import faiss; index=faiss.read_index('index.faiss'); print(index.ntotal, index.d)"
```

| 问题 | 检查 | 修复 |
|------|------|------|
| 召回率低 | top_k、chunk size、embedding 模型 | 增大 top_k、调 chunk、换模型 |
| 召回结果不相关 | embedding 质量 | 微调 embedding、混合检索 |
| 检索延迟高 | 索引类型、数据量 | HNSW 参数调优、缓存 |
| 重复召回 | 去重 | 语义去重、MMR |

---

## 3. 重排序阶段

```bash
# 测试 cross-encoder
python test_rerank.py \
  --query "什么是 RAG" \
  --candidates "..." "..."
```

| 问题 | 检查 | 修复 |
|------|------|------|
| 重排序慢 | 模型大小、batch size | 小模型、量化、批处理 |
| 排序不准 | 训练数据 | 领域微调 |

---

## 4. 生成阶段

| 问题 | 检查 | 修复 |
|------|------|------|
| 答案幻觉 | 上下文是否包含答案 | 提高召回质量、增加引用 |
| 答案不完整 | 上下文长度 | 调整 top_k、上下文窗口 |
| 答案冗长 | prompt / max_tokens | 优化 prompt、限制长度 |
| 不遵循格式 | prompt 模板 | few-shot、JSON mode |

---

## 5. 评估指标

| 指标 | 用途 | 工具 |
|------|------|------|
| Context Precision | 检索结果中有用比例 | RAGAS |
| Context Recall | 正确答案是否被召回 | RAGAS |
| Faithfulness | 答案是否忠实于上下文 | RAGAS |
| Answer Relevance | 答案与问题相关度 | RAGAS |
| Latency | 端到端延迟 | 自定义 |

---

## Related

- [[RAG系统/Advanced_RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]
- RAG
- [[_concepts/vector-database|Vector Database]]
