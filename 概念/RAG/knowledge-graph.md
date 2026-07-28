---
title: "知识图谱 (Knowledge Graph)"
category: -concepts
tags: ["knowledge-graph", "graph-rag", "entity-relation", "neo4j", "structured-knowledge"]
relationships:
  - target: "概念/RAG/graph-rag"
    type: complements
  - target: "概念/RAG/rag-systems"
    type: related_to
sources:
  - 14_RAG系统/04_Advanced_RAG/
summary: "知识图谱以实体-关系-实体三元组组织结构化知识，支持多跳推理与全局性问答，与向量检索互补构成 GraphRAG 的知识底座。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Knowledge Graph"
  - "KG"
  - "知识图谱"
name_zh: "知识图谱"
---
# 知识图谱 (Knowledge Graph)

> 中文简称：知识图谱

> 把知识从"一段段文本"变成"一张关系网"。

---

## 1. 定义

**知识图谱**（Knowledge Graph, KG）用**三元组** `(头实体, 关系, 尾实体)` 表示知识，如 `(DeepSeek-R1, 蒸馏产出, R1-Distill-7B)`。节点是实体/概念，边是语义关系，天然支持**多跳查询**（"A 的合作方的竞品是谁"）与**全局聚合**（"这个数据集里有几个研发团队"）。

---

## 2. KG vs 向量检索

| 维度 | 知识图谱 | 向量检索 |
|------|----------|----------|
| 知识形态 | 显式结构化三元组 | 隐式嵌入相似度 |
| 多跳推理 | 强（图遍历） | 弱（单跳相似） |
| 全局问题 | 强（社区摘要） | 弱（top-k 局部） |
| 构建成本 | 高（抽取+清洗+建模） | 低（切块+嵌入） |
| 更新 | 增量维护复杂 | 简单 |
| 可解释性 | 高（路径可追溯） | 低 |

---

## 3. LLM 时代的 KG 构建管线

1. **实体/关系抽取**：LLM 按 Schema 从文本抽三元组（替代传统 NER+RE 模型）
2. **实体消歧对齐**：同名合并、别名归一（embedding 聚类辅助）
3. **图谱入库**：Neo4j / NebulaGraph / 内存图（NetworkX）
4. **社区检测与摘要**：Leiden 聚类 + LLM 生成社区报告（Microsoft GraphRAG 做法）
5. **检索融合**：局部三元组检索 + 全局社区摘要 + 向量检索混合

---

## 4. 应用场景

| 场景 | 用法 |
|------|------|
| **GraphRAG** | 全局性/关系性问答的检索底座 |
| **企业主数据** | 客户-产品-供应链关系网络 |
| **金融风控** | 关联交易/担保环路检测 |
| **医疗** | 药物-疾病-基因关系推理 |
| **Agent 记忆** | 长期记忆的结构化组织（如 Graphiti/Zep） |

---

## Related

- [[概念/RAG/graph-rag]] — GraphRAG（KG + RAG 的融合范式）
- [[概念/RAG/rag-systems]] — RAG 系统总览
- [[概念/RAG/hybrid-search]] — 混合检索
- [[概念/RAG/vector-database]] — 向量数据库（互补路线）
- [[概念/Agent/agent-memory-systems]] — Agent 记忆系统

> ℹ️ 2026 年趋势：LLM 把 KG 构建成本从"人年"降到"小时"，KG 复兴为 GraphRAG 与 Agent 长期记忆的基础设施。
