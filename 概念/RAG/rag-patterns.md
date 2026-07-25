---
title: "RAG 模式分类（RAG Patterns）"
category: -concepts
tags: ["rag", "patterns", "naive-rag", "modular-rag", "agentic-rag", "graph-rag", "architecture"]
relationships:
  - target: "概念/rag-systems"
    type: classifies
  - target: "概念/agentic-rag"
    type: includes
  - target: "概念/long-context-vs-rag"
    type: compares_with
sources:
  - 14_RAG系统/README.md
  - 14_RAG系统/04_Advanced_RAG/RAG_Advanced_2026.md
summary: "RAG 模式分类把检索增强生成按架构复杂度分为四级：Naive RAG（检索-拼接）、Advanced/Modular RAG（查询改写+重排序）、Agentic RAG（自主检索迭代）、Graph RAG（知识图谱检索）。从简单到复杂，按任务难度选型。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-23
updated: 2026-07-21
tier: core
created: 2026-06-23
updated: 2026-06-23
aliases:
  - "Rag Patterns"
  - "rag patterns"

---
# RAG 模式分类（RAG Patterns）

## 核心要点

- **不是所有 RAG 都一样**：从"拼检索结果"到"知识图谱推理"，复杂度差几个量级。
- **四级演进**：Naive → Advanced/Modular → Agentic → Graph/Structured。
- **选型原则**：简单问答用 Naive，复杂推理用 Agentic，关系密集用 Graph。

## 一句话理解

Naive RAG 像"百度搜索+复制粘贴"；Agentic RAG 像"研究员多轮查证"；Graph RAG 像"侦探在关系网里推理"，按问题难度选对工具。

## 详细内容

### 四级 RAG 模式

```
Level 1: Naive RAG（朴素 RAG）
  用户提问 → embedding 检索 Top-K → 拼进 prompt → 生成
  组件：Embedding 模型 + 向量库 + LLM
  适合：简单事实问答（FAQ）
  问题：查询词与文档措辞不匹配时召回差

Level 2: Advanced / Modular RAG（模块化 RAG）
  + 查询改写（HyDE/多查询）
  + 重排序（Cross-encoder rerank）
  + 混合检索（向量 + BM25 关键词）
  + 引用追踪（标注来源）
  适合：企业知识库、文档问答
  提升：召回率与准确率显著提高

Level 3: Agentic RAG（智能体 RAG）
  + Agent 自主决定是否检索、检索什么
  + 多轮迭代检索（不够再查）
  + 跨源检索（向量库 + 搜索引擎 + 数据库）
  + 自我验证（结果可靠吗）
  适合：复杂分析、多跳推理
  详见 [[概念/agentic-rag|Agentic RAG]]

Level 4: Graph / Structured RAG（图结构 RAG）
  + 知识图谱（实体-关系）替代纯向量
  + 支持多跳关系推理
  + 结构化查询（Text-to-SQL/Text-to-Cypher）
  适合：关系密集领域（组织架构、供应链、刑侦）
  代表：Microsoft GraphRAG、Neo4j Vector+Graph
```

### 选型决策矩阵

| 任务特征 | 推荐 RAG | 理由 |
|----------|----------|------|
| 简单 FAQ | Naive | 够用，成本低 |
| 文档问答（措辞多变） | Modular | 查询改写+重排序解决召回 |
| 多跳推理（A 的领导的母校） | Agentic | 需多轮检索 |
| 关系推理（A 和 B 如何关联） | Graph | 向量无法表达关系 |
| 实时数据需求 | Agentic + 搜索引擎 | 需动态检索网页 |

### 2026 趋势

- **Graph RAG 兴起**：Microsoft GraphRAG 开源后，关系推理成为新维度
- **多模态 RAG**：检索图片/表格/音频，不止文本
- **RAG 与长上下文融合**：小上下文用 RAG，大上下文直接塞（成本权衡）
- **Agentic RAG 标准化**：LangGraph/LlamaIndex 提供开箱即用框架

## Related

- [[概念/rag-systems|RAG 系统]] — RAG 基础概念
- [[概念/agentic-rag|Agentic RAG]] — Level 3 详解
- [[概念/long-context-vs-rag|长上下文 vs RAG]] — 选型对比
- [[概念/vector-database|向量数据库]] — RAG 存储基础
- [[概念/reranker|Reranker]] — 重排序模型
- [[14_RAG系统/README|RAG 系统]] — 章节主页
- [[概念/rag-production-architecture|RAG 生产架构]] — 从模式到生产落地的工程体系

---

## 2026 RAG 模式选型指南

| 模式 | 适用场景 | 复杂度 | 延迟 | 2026 代表实现 |
|------|---------|--------|------|----------------|
| **Naive RAG** | 简单 FAQ、知识库 | 低 | <1s | LangChain 基础链 |
| **Modular RAG** | 企业搜索、客服 | 中 | 1-3s | LlamaIndex Query Engine |
| **Agentic RAG** | 复杂推理、多步任务 | 高 | 3-10s | LangGraph/CrewAI |
| **Graph RAG** | 关系推理、知识图谱 | 高 | 2-5s | Microsoft GraphRAG |

## 生产最佳实践

1. **渐进式升级**：从 Naive RAG 开始，根据效果逐步引入 Rerank/Query Rewrite/Agentic
2. **模式组合**：生产系统常混合多种模式，如 Modular + Graph RAG
3. **评估先行**：建立评估基准（RAGAS/TruLens），量化每次升级的收益
4. **成本控制**：Agentic RAG Token 消耗高，设置迭代上限和成本预算
5. **延迟预算**：根据用户体验要求设定延迟 SLA，反推可选模式

## 2026 RAG 模式生态现状

| 模式 | 复杂度 | 质量 | 延迟 | 适用场景 |
|------|------|------|------|------|
| Naive RAG | 低 | 中 | 低 | 简单问答 |
| Advanced RAG | 中 | 高 | 中 | 生产级问答 |
| Modular RAG | 高 | 高 | 中 | 复杂流程 |
| Agentic RAG | 极高 | 极高 | 高 | 多步推理 |
| Graph RAG | 高 | 极高 | 高 | 知识图谱 |
| Self-RAG | 高 | 极高 | 高 | 自反思 |

## 模式选择指南

- **简单 FAQ**：Naive RAG
- **生产级问答**：Advanced RAG (Reranker + 混合检索)
- **多数据源**：Modular RAG
- **多步推理**：Agentic RAG
- **结构化知识**：Graph RAG
- **质量优先**：Self-RAG / CRAG

## 检查清单

- [ ] RAG 模式与场景匹配
- [ ] 延迟预算已设定
- [ ] 成本预算已设定
- [ ] 评估指标已确定
- [ ] 回退策略已配置
- [ ] 迭代上限已设置（Agentic）

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 质量不达标 | 模式太简单 | 升级至 Advanced/Modular |
| 延迟太高 | Agentic 迭代多 | 设置迭代上限 + 缓存 |
| 成本太高 | Token 消耗大 | 小模型路由 + 缓存 |
| 幻觉严重 | 检索不相关 | 添加 Reranker + 阈值 |

## 延伸阅读

- [[概念/RAG/rag-production-architecture|RAG 生产架构]] — 架构设计
- [[概念/RAG/reranker|Reranker]] — 重排序
- [[概念/RAG/hybrid-search|Hybrid Search]] — 混合检索
- [[概念/RAG/ragas|RAGAS]] — RAG 评估
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库

> ℹ️ RAG 模式选择需平衡质量、延迟和成本，2026年 Advanced RAG 是生产标配，Agentic RAG 和 Graph RAG 在复杂场景表现突出。

## 模式组合示例

| 场景 | 推荐组合 | 说明 |
|------|------|------|
| 企业知识库 | Advanced + Hybrid | BM25 + 向量 + Rerank |
| 客服问答 | Naive + 缓存 | 简单高效 |
| 研究报告 | Agentic + Graph | 多步推理 + 结构化 |
| 代码助手 | Modular + Self-RAG | 自反思 + 多数据源 |
| 医疗问答 | Advanced + CRAG | 质量优先 + 可信度 |

## 模式演进路线

```
Naive RAG → Advanced RAG → Modular RAG → Agentic RAG
   ↓              ↓              ↓              ↓
简单问答      生产级问答      复杂流程      多步推理
```

## 检查清单

- [ ] RAG 模式与场景匹配
- [ ] 延迟预算已设定
- [ ] 成本预算已设定
- [ ] 评估指标已确定
- [ ] 回退策略已配置
- [ ] 迭代上限已设置（Agentic）
- [ ] 模式演进路线已规划

> ℹ️ RAG 模式选择应遵循「简单优先」原则：Naive → Advanced → Modular → Agentic 逐步演进，避免过度工程化。
