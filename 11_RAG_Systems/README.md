---
title: 'RAG 系统 (RAG Systems)'
category: '11-rag-systems'
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: '> **一句话理解**: RAG（检索增强生成）就像给大模型配备了一个"外接大脑"——让模型在回答问题时，先查阅专业知识库，再基于检索到的信息生成准确、可信的回答。'
created: '2026-05-31'
updated: '2026-05-31'
---

# RAG 系统 (RAG Systems)

> **一句话理解**: RAG（检索增强生成）就像给大模型配备了一个"外接大脑"——让模型在回答问题时，先查阅专业知识库，再基于检索到的信息生成准确、可信的回答。

---

## 本章内容

### 快速入门

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [RAG-in-nutshell](./RAG-in-nutshell.md) | 30 分钟速览：核心概念、架构流程、关键组件 | 快速入门 |
| [RAG Systems for Dummy](./RAG_Systems_for_dummy.md) | RAG 概念的简化版解释 | 初学者 |

### 系统学习

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [RAG Systems](./RAG_Systems.md) | RAG 完整技术体系：索引、检索、生成、评估 | 系统学习 |
| [RAG Advanced 2026](./RAG_Advanced_2026.md) | 混合检索、重排序、Agentic RAG | 进阶学习 |
| [Multimodal RAG 2026](./Multimodal_RAG_Architecture_2026.md) | 多模态 RAG：复杂 PDF 解析、视频 RAG、ColPali 架构 | 进阶学习 |
| [Matryoshka Representation Learning Deep Dive](./Matryoshka_Representation_Learning_Deep_Dive.md) | MRL 可截断嵌入：精度与成本的动态平衡 | 进阶学习 |
| [Spring AI RAG Deep Dive](./Spring_AI_RAG_Deep_Dive.md) | Spring AI 生态中的 RAG 实现 | Java 开发者 |

### 向量数据库

| 文档 | 特点 | 适用场景 |
|------|------|----------|
| [Chroma Deep Dive](./Chroma_Deep_Dive.md) | 轻量级、零配置、本地优先 | 原型开发、学习 |
| [Qdrant Deep Dive](./Qdrant_Deep_Dive.md) | 高性能、混合检索、生产级 | 生产环境 |
| [Milvus Deep Dive](./Milvus_Deep_Dive.md) | 超大规模、分布式、云原生 | 万亿向量场景 |
| [Weaviate Deep Dive](./Weaviate_Deep_Dive.md) | GraphQL、原生多模态 | 多模态、生产级 |
| [Typesense Deep Dive](./Typesense_Deep_Dive.md) | 毫秒级响应、模糊匹配 | 搜索优先 |

### RAG 框架与平台

| 文档 | 特点 | 适用场景 |
|------|------|----------|
| [Dify Deep Dive](./Dify_Deep_Dive.md) | 功能完整、可视化、自托管 | 企业内部平台 |
| [Haystack Deep Dive](./Haystack_Deep_Dive.md) | 模块化、Pipeline 架构、YAML 配置 | 企业级复杂 RAG |
| [LlamaIndex Deep Dive](./LlamaIndex_Deep_Dive.md) | 数据索引优先、查询优化 | 性能优先、数据密集 |
| [LangFlow Deep Dive](./LangFlow_Deep_Dive.md) | LangChain 可视化、代码导出 | 学习实验、快速原型 |
| [Flowise Deep Dive](./Flowise_Deep_Dive.md) | 低代码、极简体验 | 非技术用户 |

### Embedding 模型

| 文档 | 内容 |
|------|------|
| [Sentence Transformers Deep Dive](./Sentence_Transformers_Deep_Dive.md) | 开源 Embedding 模型：多语言支持、100+ 模型 |
| [Matryoshka Representation Learning Deep Dive](./Matryoshka_Representation_Learning_Deep_Dive.md) | MRL 可截断嵌入：同一向量按需取前缀 |

---

## 学习路径

- **快速入门** → [RAG-in-nutshell](./RAG-in-nutshell.md)（30 分钟）
- **系统学习** → [RAG Systems](./RAG_Systems.md)（2-3 小时）
- **进阶实践** → [RAG Advanced 2026](./RAG_Advanced_2026.md) + 向量数据库选型
- **简化版** → [RAG Systems for Dummy](./RAG_Systems_for_dummy.md)

---

## 与其他章节的关联

### 前置知识
- [大模型基础](../04_NLP_LLMs/README.md) — Transformer、Prompt Engineering
- [部署推理](../09_Deployment_Inference/README.md) — 模型服务化部署
- [Java 生态](../01_Fundamentals/Java_Ecosystem_AI/) — Spring AI 集成

### 进阶方向
- [Agent 生产](../13_Agent_Production/README.md) — Agentic RAG、记忆系统
- [AI Gateway](../14_AI_Gateway/README.md) — RAG 服务的流量治理
- [测试](../15_Testing/README.md) — RAG 系统的评估（RAGAS）
- [MLOps](../10_MLOps_Pipeline/) — RAG 流水线的自动化

---

*详见 [RAG 高级实践导航](./README_Advanced.md) 获取框架选型与关键技术速查。*

## Related
- [[11_RAG_Systems/Haystack_Deep_Dive|Haystack: 开源 RAG 框架]]
- [[11_RAG_Systems/RAG_Systems_for_dummy|RAG 系统 - 小白版]]
- [[11_RAG_Systems/Dify_Deep_Dive|Dify: 开源 LLM 应用开发平台]]
- [[11_RAG_Systems/Milvus_Deep_Dive|Milvus: 超大规模向量数据库]]
- [[11_RAG_Systems/README|RAG 系统 (RAG Systems)]]
- [[11_RAG_Systems/Weaviate_Deep_Dive|Weaviate: 开源向量数据库]]
- [[11_RAG_Systems/Typesense_Deep_Dive|Typesense: 快速矢量搜索]]
- [[11_RAG_Systems/Chroma_Deep_Dive|Chroma: 轻量级向量数据库]]
- [[11_RAG_Systems/Flowise_Deep_Dive|Flowise: 低代码 LLM 应用平台]]
- [[11_RAG_Systems/README_for_dummy|11 RAG 系统 — 小白版 🔍]]
- [[11_RAG_Systems/LlamaIndex_Deep_Dive|LlamaIndex: 数据连接框架]]
- [[11_RAG_Systems/Qdrant_Deep_Dive|Qdrant: 高性能向量数据库]]
- [[11_RAG_Systems/LangFlow_Deep_Dive|LangFlow: 可视化 Agent/RAG 开发平台]]
- [[11_RAG_Systems/Sentence_Transformers_Deep_Dive|Sentence-Transformers: 嵌入模型框架]]
- [[11_RAG_Systems/Matryoshka_Representation_Learning_Deep_Dive|Matryoshka Representation Learning 深度解析]]

- [[concepts/rag-systems]] — RAG 系统
- [[concepts/vector-database]] — 向量数据库
- [[12_Architecture_Infrastructure/Alibaba_Cloud_AI_Stack_Deep_Dive|阿里云 AI Stack]] — 内置知识库 + RAG 应用构建

## 新增页面

- [[11_RAG_Systems/Agentic_RAG_Guide|Agentic RAG]]
- [[11_RAG_Systems/Embedding_Models_Guide|Embedding 模型选型]]
- [[11_RAG_Systems/Matryoshka_Representation_Learning_Deep_Dive|Matryoshka Representation Learning 深度解析]]
- [[11_RAG_Systems/Matryoshka_Representation_Learning_for_dummy|Matryoshka Representation Learning — 小白版]]
