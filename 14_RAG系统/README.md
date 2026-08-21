---
title: 'RAG 系统 (RAG Systems)'
category: '14-rag-systems'
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: '> **一句话理解**: RAG（检索增强生成）就像给大模型配备了一个"外接大脑"——让模型在回答问题时，先查阅专业知识库，再基于检索到的信息生成准确、可信的回答。'
created: '2026-05-31'
updated: '2026-06-15'
tier: supporting
sources: []

name_zh: "RAG 系统"
---
# RAG 系统 (RAG Systems)

> 中文简称：RAG 系统

> **一句话理解**: RAG（检索增强生成）就像给大模型配备了一个"外接大脑"——让模型在回答问题时，先查阅专业知识库，再基于检索到的信息生成准确、可信的回答。

---

## 本章内容

### 快速入门

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [RAG-in-nutshell](14_RAG系统/01_RAG基础/08_RAG_简明指南.md) | 30 分钟速览：核心概念、架构流程、关键组件 | 快速入门 |
| [RAG Systems for Dummy](14_RAG系统/README.md) | RAG 概念的简化版解释 | 初学者 |

### 系统学习

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [RAG Systems](14_RAG系统/01_RAG基础/07_RAG_系统.md) | RAG 完整技术体系：索引、检索、生成、评估 | 系统学习 |
| [RAG 生产架构深度解析](14_RAG系统/README.md) | 经典/Advanced/Agentic RAG 演进、生产管线、检索/生成/评估/合规 | RAG 架构师 |
| [RAG Advanced 2026](14_RAG系统/04_高级RAG/12_RAG_高级_2026.md) | 混合检索、重排序、Agentic RAG | 进阶学习 |
| [RAG 检索延迟优化](14_RAG系统/README.md) | HNSW/IVF、hybrid search、reranker 成本、向量索引调参 | RAG 性能工程师 |
| [RAG 调试速查表](14_RAG系统/04_高级RAG/13_RAG_调试_Cheat_Sheet.md) | Query/检索/重排序/生成四环节诊断与评估指标 | RAG 工程师 |
| [Agentic RAG 应用大白话](14_RAG系统/README.md) | Agentic RAG、Text2SQL、代码生成工作流大白话 | 初学者 |
| [Multimodal RAG 2026](14_RAG系统/04_高级RAG/10_多模态_RAG_架构_2026.md) | 多模态 RAG：复杂 PDF 解析、视频 RAG、ColPali 架构 | 进阶学习 |
| [Matryoshka Representation Learning Deep Dive](20_论文精读/04_效率优化/04_Matryoshka_Representation_学习_深入分析.md) | MRL 可截断嵌入：精度与成本的动态平衡 | 进阶学习 |
| [Spring AI RAG Deep Dive](14_RAG系统/06_RAG框架/07_Spring_AI_RAG_深入分析.md) | Spring AI 生态中的 RAG 实现 | Java 开发者 |

### 向量数据库

| 文档 | 特点 | 适用场景 |
|------|------|----------|
| [Chroma Deep Dive](14_RAG系统/03_向量数据库/01_Chroma_深入分析.md) | 轻量级、零配置、本地优先 | 原型开发、学习 |
| [Qdrant Deep Dive](14_RAG系统/03_向量数据库/04_Qdrant_深入分析.md) | 高性能、混合检索、生产级 | 生产环境 |
| [Milvus Deep Dive](14_RAG系统/03_向量数据库/03_Milvus_深入分析.md) | 超大规模、分布式、云原生 | 万亿向量场景 |
| [Weaviate Deep Dive](14_RAG系统/03_向量数据库/07_Weaviate_深入分析.md) | GraphQL、原生多模态 | 多模态、生产级 |
| [Typesense Deep Dive](14_RAG系统/03_向量数据库/06_Typesense_深入分析.md) | 毫秒级响应、模糊匹配 | 搜索优先 |

### RAG 框架与平台

| 文档 | 特点 | 适用场景 |
|------|------|----------|
| [Dify Deep Dive](14_RAG系统/06_RAG框架/01_Dify_深入分析.md) | 功能完整、可视化、自托管 | 企业内部平台 |
| [Haystack Deep Dive](14_RAG系统/06_RAG框架/03_Haystack_深入分析.md) | 模块化、Pipeline 架构、YAML 配置 | 企业级复杂 RAG |
| [LlamaIndex Deep Dive](14_RAG系统/06_RAG框架/06_LlamaIndex_深入分析.md) | 数据索引优先、查询优化 | 性能优先、数据密集 |
| [LangFlow Deep Dive](14_RAG系统/06_RAG框架/05_LangFlow_深入分析.md) | LangChain 可视化、代码导出 | 学习实验、快速原型 |
| [Flowise Deep Dive](14_RAG系统/06_RAG框架/02_Flowise_深入分析.md) | 低代码、极简体验 | 非技术用户 |

### Embedding 模型

| 文档 | 内容 |
|------|------|
| [Sentence Transformers Deep Dive](14_RAG系统/02_嵌入技术/06_Sentence_Transformers_深入分析.md) | 开源 Embedding 模型：多语言支持、100+ 模型 |
| [Matryoshka Representation Learning Deep Dive](20_论文精读/04_效率优化/04_Matryoshka_Representation_学习_深入分析.md) | MRL 可截断嵌入：同一向量按需取前缀 |

---

## 学习路径

- **快速入门** → [RAG-in-nutshell](14_RAG系统/01_RAG基础/08_RAG_简明指南.md)（30 分钟）
- **系统学习** → [RAG Systems](14_RAG系统/01_RAG基础/07_RAG_系统.md)（2-3 小时）
- **进阶实践** → [RAG Advanced 2026](14_RAG系统/04_高级RAG/12_RAG_高级_2026.md) + 向量数据库选型
- **简化版** → [RAG Systems for Dummy](14_RAG系统/README.md)

---

## 与其他章节的关联

### 前置知识
- [大模型基础](../05_大模型/README.md) — Transformer、Prompt Engineering
- [部署推理](10_部署推理/README.md) — 模型服务化部署
- [Java 生态](../01_数学基础/11_Java生态与AI/) — Spring AI 集成

### RAG 推理引擎推荐

RAG 的生成阶段对 TTFT（首个 token 时间）和前缀缓存命中率非常敏感，推荐根据场景选择：

| 场景 | 推荐引擎 | 说明 |
|------|----------|------|
| 通用生产 RAG | [vLLM](10_部署推理/02_推理引擎/29_vLLM_深入分析.md) | PagedAttention、成熟生态、OpenAI 兼容 |
| 多轮 / RAG 前缀缓存 | [SGLang](10_部署推理/02_推理引擎/23_SGLang_深入分析.md) | RadixAttention、前缀缓存命中率高 |
| HuggingFace 原生 | [TGI](10_部署推理/02_推理引擎/26_TGI_深入分析.md) | Rust+Python、监控完善 |
| 极致低延迟云 API | [Groq](10_部署推理/02_推理引擎/07_Groq_深入分析.md) | LPU、毫秒级 TTFT |
| 推理引擎统一选型 | [LLM Inference Engine Selection Guide](10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南.md) | 决策树与场景速查 |

详见 [部署推理](10_部署推理/README.md) 完整专题。

### 进阶方向
- [Agent 生产](../15_智能体/README.md) — Agentic RAG、记忆系统
- [AI Gateway](12_架构基建/05_CNCF云原生AI/README.md) — RAG 服务的流量治理
- [测试](../09_测试/README.md) — RAG 系统的评估（RAGAS）
- [MLOps](../11_模型运维/) — RAG 流水线的自动化

---

*详见 [RAG 高级实践导航](14_RAG系统/04_高级RAG/15_README_高级.md) 获取框架选型与关键技术速查。*

## Related
- [[14_RAG系统/06_RAG框架/03_Haystack_深入分析.md|Haystack: 开源 RAG 框架]]
- [[14_RAG系统/01_RAG基础/07_RAG_系统|RAG 系统 - 小白版]]
- [[14_RAG系统/06_RAG框架/01_Dify_深入分析.md|Dify: 开源 LLM 应用开发平台]]
- [[14_RAG系统/03_向量数据库/03_Milvus_深入分析.md|Milvus: 超大规模向量数据库]]
- [[14_RAG系统/README|RAG 系统 (RAG Systems)]]
- [[14_RAG系统/03_向量数据库/07_Weaviate_深入分析.md|Weaviate: 开源向量数据库]]
- [[14_RAG系统/03_向量数据库/06_Typesense_深入分析.md|Typesense: 快速矢量搜索]]
- [[14_RAG系统/03_向量数据库/01_Chroma_深入分析.md|Chroma: 轻量级向量数据库]]
- [[14_RAG系统/06_RAG框架/02_Flowise_深入分析.md|Flowise: 低代码 LLM 应用平台]]
- [[14_RAG系统/README|11 RAG 系统 — 小白版 🔍]]
- [[14_RAG系统/06_RAG框架/06_LlamaIndex_深入分析.md|LlamaIndex: 数据连接框架]]
- [[14_RAG系统/03_向量数据库/04_Qdrant_深入分析.md|Qdrant: 高性能向量数据库]]
- [[14_RAG系统/06_RAG框架/05_LangFlow_深入分析.md|LangFlow: 可视化 Agent/RAG 开发平台]]
- [[14_RAG系统/02_嵌入技术/06_Sentence_Transformers_深入分析|Sentence-Transformers: 嵌入模型框架]]
- [[概念/RAG/matryoshka-representation-learning|Matryoshka Representation Learning 深度解析]]

- [[概念/RAG/rag-systems.md]] — RAG 系统
- [[概念/RAG/vector-database.md]] — 向量数据库
- [[概念/General/alibaba-cloud|阿里云 AI Stack]] — 内置知识库 + RAG 应用构建
- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南.md|LLM 推理引擎选型指南]]
- [[10_部署推理/02_推理引擎/29_vLLM_深入分析.md|vLLM 深度解析]]
- [[10_部署推理/02_推理引擎/23_SGLang_深入分析.md|SGLang 深度解析]]
- [[10_部署推理/02_推理引擎/07_Groq_深入分析.md|Groq 深度解析]]
- [[概念/Agent/agentic-rag.md|Agentic RAG]]
- [[概念/RAG/text2sql.md|Text2SQL]]
- [[概念/General/code-generation-workflow.md|代码生成工作流]]
- [[14_RAG系统/04_高级RAG/02_Agentic_RAG_指南|Agentic RAG 应用大白话]]

- [[RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]
- [[14_RAG系统/README.md|HuggingFace Datasets Streaming 模式实战指南]]

## 新增页面

- [[14_RAG系统/04_高级RAG/02_Agentic_RAG_指南.md|Agentic RAG]]
- [[14_RAG系统/02_嵌入技术/01_嵌入_模型_指南.md|Embedding 模型选型]]
- [[概念/RAG/matryoshka-representation-learning|Matryoshka Representation Learning 深度解析]]
- [[概念/RAG/matryoshka-representation-learning|Matryoshka Representation Learning — 小白版]]
