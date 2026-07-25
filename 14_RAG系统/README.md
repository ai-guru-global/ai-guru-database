---
title: 'RAG 系统 (RAG Systems)'
category: '14-rag-systems'
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: '> **一句话理解**: RAG（检索增强生成）就像给大模型配备了一个"外接大脑"——让模型在回答问题时，先查阅专业知识库，再基于检索到的信息生成准确、可信的回答。'
created: '2026-05-31'
updated: '2026-06-15'
tier: supporting
sources: []

---
# RAG 系统 (RAG Systems)

> **一句话理解**: RAG（检索增强生成）就像给大模型配备了一个"外接大脑"——让模型在回答问题时，先查阅专业知识库，再基于检索到的信息生成准确、可信的回答。

---

## 本章内容

### 快速入门

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [RAG-in-nutshell](RAG系统/RAG_Fundamentals/RAG-in-nutshell.md) | 30 分钟速览：核心概念、架构流程、关键组件 | 快速入门 |
| [RAG Systems for Dummy](RAG系统/RAG_Fundamentals/RAG_Systems_for_dummy.md) | RAG 概念的简化版解释 | 初学者 |

### 系统学习

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [RAG Systems](RAG系统/RAG_Fundamentals/RAG_Systems.md) | RAG 完整技术体系：索引、检索、生成、评估 | 系统学习 |
| [RAG 生产架构深度解析](RAG系统/RAG_Production/RAG_Production_Architecture_Deep_Dive.md) | 经典/Advanced/Agentic RAG 演进、生产管线、检索/生成/评估/合规 | RAG 架构师 |
| [RAG Advanced 2026](RAG系统/Advanced_RAG/RAG_Advanced_2026.md) | 混合检索、重排序、Agentic RAG | 进阶学习 |
| [RAG 检索延迟优化](RAG系统/Advanced_RAG/RAG_Retrieval_Latency_Optimization.md) | HNSW/IVF、hybrid search、reranker 成本、向量索引调参 | RAG 性能工程师 |
| [RAG 调试速查表](RAG系统/Advanced_RAG/RAG_Debugging_Cheat_Sheet.md) | Query/检索/重排序/生成四环节诊断与评估指标 | RAG 工程师 |
| [Agentic RAG 应用大白话](RAG系统/RAG_Production/Agentic_RAG_Applications_for_dummy.md) | Agentic RAG、Text2SQL、代码生成工作流大白话 | 初学者 |
| [Multimodal RAG 2026](RAG系统/Advanced_RAG/Multimodal_RAG_Architecture_2026.md) | 多模态 RAG：复杂 PDF 解析、视频 RAG、ColPali 架构 | 进阶学习 |
| [Matryoshka Representation Learning Deep Dive](./Embeddings/Matryoshka_Representation_Learning_Deep_Dive.md) | MRL 可截断嵌入：精度与成本的动态平衡 | 进阶学习 |
| [Spring AI RAG Deep Dive](RAG系统/RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md) | Spring AI 生态中的 RAG 实现 | Java 开发者 |

### 向量数据库

| 文档 | 特点 | 适用场景 |
|------|------|----------|
| [Chroma Deep Dive](RAG系统/Vector_Databases/Chroma_Deep_Dive.md) | 轻量级、零配置、本地优先 | 原型开发、学习 |
| [Qdrant Deep Dive](RAG系统/Vector_Databases/Qdrant_Deep_Dive.md) | 高性能、混合检索、生产级 | 生产环境 |
| [Milvus Deep Dive](RAG系统/Vector_Databases/Milvus_Deep_Dive.md) | 超大规模、分布式、云原生 | 万亿向量场景 |
| [Weaviate Deep Dive](RAG系统/Vector_Databases/Weaviate_Deep_Dive.md) | GraphQL、原生多模态 | 多模态、生产级 |
| [Typesense Deep Dive](RAG系统/Vector_Databases/Typesense_Deep_Dive.md) | 毫秒级响应、模糊匹配 | 搜索优先 |

### RAG 框架与平台

| 文档 | 特点 | 适用场景 |
|------|------|----------|
| [Dify Deep Dive](RAG系统/RAG_Frameworks/Dify_Deep_Dive.md) | 功能完整、可视化、自托管 | 企业内部平台 |
| [Haystack Deep Dive](RAG系统/RAG_Frameworks/Haystack_Deep_Dive.md) | 模块化、Pipeline 架构、YAML 配置 | 企业级复杂 RAG |
| [LlamaIndex Deep Dive](RAG系统/RAG_Frameworks/LlamaIndex_Deep_Dive.md) | 数据索引优先、查询优化 | 性能优先、数据密集 |
| [LangFlow Deep Dive](RAG系统/RAG_Frameworks/LangFlow_Deep_Dive.md) | LangChain 可视化、代码导出 | 学习实验、快速原型 |
| [Flowise Deep Dive](RAG系统/RAG_Frameworks/Flowise_Deep_Dive.md) | 低代码、极简体验 | 非技术用户 |

### Embedding 模型

| 文档 | 内容 |
|------|------|
| [Sentence Transformers Deep Dive](RAG系统/Embeddings/Sentence_Transformers_Deep_Dive.md) | 开源 Embedding 模型：多语言支持、100+ 模型 |
| [Matryoshka Representation Learning Deep Dive](./Embeddings/Matryoshka_Representation_Learning_Deep_Dive.md) | MRL 可截断嵌入：同一向量按需取前缀 |

---

## 学习路径

- **快速入门** → [RAG-in-nutshell](RAG系统/RAG_Fundamentals/RAG-in-nutshell.md)（30 分钟）
- **系统学习** → [RAG Systems](RAG系统/RAG_Fundamentals/RAG_Systems.md)（2-3 小时）
- **进阶实践** → [RAG Advanced 2026](RAG系统/Advanced_RAG/RAG_Advanced_2026.md) + 向量数据库选型
- **简化版** → [RAG Systems for Dummy](RAG系统/RAG_Fundamentals/RAG_Systems_for_dummy.md)

---

## 与其他章节的关联

### 前置知识
- [大模型基础](../大模型/README.md) — Transformer、Prompt Engineering
- [部署推理](./部署推理/README.md) — 模型服务化部署
- [Java 生态](../数学基础/Java_Ecosystem_AI/) — Spring AI 集成

### RAG 推理引擎推荐

RAG 的生成阶段对 TTFT（首个 token 时间）和前缀缓存命中率非常敏感，推荐根据场景选择：

| 场景 | 推荐引擎 | 说明 |
|------|----------|------|
| 通用生产 RAG | [vLLM](部署推理/Inference_Engines/vLLM_Deep_Dive.md) | PagedAttention、成熟生态、OpenAI 兼容 |
| 多轮 / RAG 前缀缓存 | [SGLang](部署推理/Inference_Engines/SGLang_Deep_Dive.md) | RadixAttention、前缀缓存命中率高 |
| HuggingFace 原生 | [TGI](部署推理/Inference_Engines/TGI_Deep_Dive.md) | Rust+Python、监控完善 |
| 极致低延迟云 API | [Groq](部署推理/Inference_Engines/Groq_Deep_Dive.md) | LPU、毫秒级 TTFT |
| 推理引擎统一选型 | [LLM Inference Engine Selection Guide](部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide.md) | 决策树与场景速查 |

详见 [部署推理](./部署推理/README.md) 完整专题。

### 进阶方向
- [Agent 生产](../智能体/README.md) — Agentic RAG、记忆系统
- [AI Gateway](架构基建/CNCF_Cloud_Native_AI/README.md) — RAG 服务的流量治理
- [测试](../测试/README.md) — RAG 系统的评估（RAGAS）
- [MLOps](../模型运维/) — RAG 流水线的自动化

---

*详见 [RAG 高级实践导航](RAG系统/README_Advanced.md) 获取框架选型与关键技术速查。*

## Related
- [[RAG系统/RAG_Frameworks/Haystack_Deep_Dive.md|Haystack: 开源 RAG 框架]]
- [[RAG系统/RAG_Fundamentals/RAG_Systems_for_dummy.md|RAG 系统 - 小白版]]
- [[RAG系统/RAG_Frameworks/Dify_Deep_Dive.md|Dify: 开源 LLM 应用开发平台]]
- [[RAG系统/Vector_Databases/Milvus_Deep_Dive.md|Milvus: 超大规模向量数据库]]
- [[RAG系统/README|RAG 系统 (RAG Systems)]]
- [[RAG系统/Vector_Databases/Weaviate_Deep_Dive.md|Weaviate: 开源向量数据库]]
- [[RAG系统/Vector_Databases/Typesense_Deep_Dive.md|Typesense: 快速矢量搜索]]
- [[RAG系统/Vector_Databases/Chroma_Deep_Dive.md|Chroma: 轻量级向量数据库]]
- [[RAG系统/RAG_Frameworks/Flowise_Deep_Dive.md|Flowise: 低代码 LLM 应用平台]]
- [[RAG系统/README_for_dummy|11 RAG 系统 — 小白版 🔍]]
- [[RAG系统/RAG_Frameworks/LlamaIndex_Deep_Dive.md|LlamaIndex: 数据连接框架]]
- [[RAG系统/Vector_Databases/Qdrant_Deep_Dive.md|Qdrant: 高性能向量数据库]]
- [[RAG系统/RAG_Frameworks/LangFlow_Deep_Dive.md|LangFlow: 可视化 Agent/RAG 开发平台]]
- [[RAG系统/Embeddings/Sentence_Transformers_Deep_Dive.md|Sentence-Transformers: 嵌入模型框架]]
- [[RAG系统/Embeddings/Matryoshka_Representation_Learning_Deep_Dive|Matryoshka Representation Learning 深度解析]]

- [[概念/RAG/rag-systems.md]] — RAG 系统
- [[概念/RAG/vector-database.md]] — 向量数据库
- [[Alibaba_Cloud_AI_Stack_Deep_Dive|阿里云 AI Stack]] — 内置知识库 + RAG 应用构建
- [[部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide.md|LLM 推理引擎选型指南]]
- [[部署推理/Inference_Engines/vLLM_Deep_Dive.md|vLLM 深度解析]]
- [[部署推理/Inference_Engines/SGLang_Deep_Dive.md|SGLang 深度解析]]
- [[部署推理/Inference_Engines/Groq_Deep_Dive.md|Groq 深度解析]]
- [[概念/Agent/agentic-rag.md|Agentic RAG]]
- [[概念/RAG/text2sql.md|Text2SQL]]
- [[概念/General/code-generation-workflow.md|代码生成工作流]]
- [[RAG系统/RAG_Production/Agentic_RAG_Applications_for_dummy.md|Agentic RAG 应用大白话]]

- [[RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]
- [[RAG系统/HF_Datasets_Streaming|HuggingFace Datasets Streaming 模式实战指南]]

## 新增页面

- [[RAG系统/Advanced_RAG/Agentic_RAG_Guide.md|Agentic RAG]]
- [[RAG系统/Embeddings/Embedding_Models_Guide.md|Embedding 模型选型]]
- [[RAG系统/Embeddings/Matryoshka_Representation_Learning_Deep_Dive|Matryoshka Representation Learning 深度解析]]
- [[RAG系统/Embeddings/Matryoshka_Representation_Learning_for_dummy.md|Matryoshka Representation Learning — 小白版]]

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
| 应用场景 | 价值体现 | 行业应用/ |
| 前沿研究 | 发展方向 | 论文精读/ |
| 工程方法 | 质量保障 | 测试/运维/ |

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
