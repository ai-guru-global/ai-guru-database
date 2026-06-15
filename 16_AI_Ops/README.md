---
title: AI 运维与可观测性 (AI Ops)
category: 16-ai-ops
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: "> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、日志、告警、灾难恢复等能力。"
created: 2026-05-31
updated: 2026-05-31
---

# AI 运维与可观测性 (AI Ops)

> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、日志、告警、灾难恢复等能力。

---

## 📍 与 10_MLOps_Pipeline 的边界

> **本章是「工具产品页 + 运维实践」（实现层），10 章是「建设方法论」（概念层）。**
> 本章讲 How/Tool/Run（用什么工具、怎么运维），概念与选型方法论在 [[10_MLOps_Pipeline/README]]。
> 完整边界声明与归属矩阵见 [[10_MLOps_Pipeline/_boundary-with-16]]。

| 想了解 | 去哪 |
|--------|------|
| Feast 怎么装、怎么配 | 本章 [[Feast_Deep_Dive]] |
| 什么是特征存储 / 为什么需要 | [[10_MLOps_Pipeline/Feature_Store_Deep_Dive]] |
| DVC/LakeFS 命令详解 | 本章 [[DVC_Deep_Dive]] / [[LakeFS_Deep_Dive]] |
| 数据版本控制的原理 | [[10_MLOps_Pipeline/Data_Versioning_DVC_LakeFS]] |
| MLflow / ClearML 用法 | 本章 [[MLflow_Deep_Dive]] / [[ClearML_Deep_Dive]] |
| 实验追踪的选型方法论 | [[10_MLOps_Pipeline/Experiment_Tracking_Deep_Dive]] |
| 事故响应 / SRE / 混沌工程 | 本章（10 不涉及运维） |

**工具页写作规范**：每个工具页开头应加「概念见 10」链接，聚焦命令/配置/部署/踩坑，不重复讲概念。

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Ops_2026](./AI_Ops_2026.md) | AI 运维全栈指南：监控、日志、成本控制、灾难恢复 | 架构师、SRE |
| [AI_Observability_Guide](./AI_Observability_Guide.md) | LLM 可观测性指南：追踪、指标、日志 | DevOps、SRE |
| [AI_Ops_for_dummy](./AI_Ops_for_dummy.md) | AI 运维入门：基础概念与实践 | 初学者 |
| [AIOps-in-nutshell](./AIOps-in-nutshell.md) | AI 运维速查：核心概念快速掌握 | 快速入门 |

## Deep Dive 文档

### 实验追踪与版本控制

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [MLflow Deep Dive](./MLflow_Deep_Dive.md) | 全流程开源 MLOps 平台 | 数据科学家、工程师 |
| [ClearML Deep Dive](./ClearML_Deep_Dive.md) | 一站式开源 MLOps | 团队协作 |
| [DVC Deep Dive](./DVC_Deep_Dive.md) | Git 工作流数据版本控制 | 数据工程师 |

### 流水线与编排

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Prefect Deep Dive](./Prefect_Deep_Dive.md) | Python 原生工作流编排 | 数据工程师 |
| [Kubeflow Deep Dive](./Kubeflow_Deep_Dive.md) | 云原生 ML 流水线 | 规模化部署 |

### 特征存储与数据管理

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Feast Deep Dive](./Feast_Deep_Dive.md) | 开源特征存储 | 数据工程师 |
| [LakeFS Deep Dive](./LakeFS_Deep_Dive.md) | 数据湖版本控制 | 数据平台工程师 |

### LLM 可观测性与追踪

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [LangSmith Deep Dive](./LangSmith_Deep_Dive.md) | LLM 调试与追踪 | 开发者 |
| [Helicone Deep Dive](./Helicone_Deep_Dive.md) | LLM 请求可观测性 | 开发者、DevOps |
| [PromptLayer Deep Dive](./PromptLayer_Deep_Dive.md) | Prompt 版本管理与追踪 | Prompt 工程师 |
| [Phoenix Deep Dive](./Phoenix_Deep_Dive.md) | 开源可观测性平台 | 团队协作 |

### 安全与护栏

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Guardrails Deep Dive](./Guardrails_Deep_Dive.md) | LLM 输入/输出护栏 | 安全工程师 |
| [Braintrust Deep Dive](./Braintrust_Deep_Dive.md) | 开源评估平台 | 开发者、QA |

### 运维实践

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Incident_Response_Playbook](./AI_Incident_Response_Playbook.md) | AI 事故响应手册 | SRE、DevOps |
| [SRE_for_AI_Systems](./SRE_for_AI_Systems.md) | AI 系统 SRE 实践 | SRE |
| [Chaos_Engineering_AI](./Chaos_Engineering_AI.md) | AI 系统混沌工程 | 可靠性工程师 |

## 核心功能

| 功能 | 说明 |
|------|------|
| **实验追踪** | 参数、指标、输出统一管理 |
| **数据版本控制** | 数据集、模型的版本化 |
| **流水线编排** | 自动化训练、部署流程 |
| **可观测性** | 请求追踪、Token 监控、成本分析 |
| **安全护栏** | 输入验证、输出过滤、内容安全 |

## 工具对比

| 工具 | 实验追踪 | 数据版本 | 流水线 | 可观测性 | 安全护栏 |
|------|:--------:|:--------:|:-------:|:--------:|:--------:|
| **MLflow** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **ClearML** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **DVC** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **LangSmith** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Guardrails** | ❌ | ❌ | ❌ | ❌ | ✅ |

## 关联目录

- [10_MLOps_Pipeline](../10_MLOps_Pipeline/) -- MLOps 建设方法论（概念层，本章是其工具实现层）
- [09_Deployment_Inference](../09_Deployment_Inference/) -- 推理引擎 (vLLM, SGLang)
- [14_AI_Gateway](../14_AI_Gateway/) -- AI 网关与路由
- [15_Testing](../15_Testing/) -- AI 测试框架

> 边界声明详见 [[10_MLOps_Pipeline/_boundary-with-16]]。

---

*Last updated: 2026-04-26*

## Related
- [[16_AI_Ops/CI_CD_Pipeline_AI_2026|AI 系统 CI/CD 流水线 2026 (CI/CD Pipeline for AI)]]
- [[16_AI_Ops/Phoenix_Deep_Dive|Phoenix: Arize AI 可观测性平台]]
- [[16_AI_Ops/PromptLayer_Deep_Dive|PromptLayer: 提示词管理与追踪]]
- [[16_AI_Ops/Chaos_Engineering_AI|AI 系统混沌工程实践 (Chaos Engineering for AI Systems)]]
- [[16_AI_Ops/AI_Ops_2026|AI Ops 2026: 智能运维体系与实践]]
- [[16_AI_Ops/Feast_Deep_Dive|Feast: 特征存储平台]]
- [[16_AI_Ops/Helicone_Deep_Dive|Helicone: LLM 可观测性平台]]
- [[16_AI_Ops/MLflow_Deep_Dive|MLflow: 机器学习生命周期管理]]
- [[16_AI_Ops/LakeFS_Deep_Dive|LakeFS: 数据湖版本控制]]
- [[16_AI_Ops/Prefect_Deep_Dive|Prefect: ML 数据流水线编排]]
- [[16_AI_Ops/Braintrust_Deep_Dive|Braintrust: LLM 评估平台]]
- [[16_AI_Ops/Kubeflow_Deep_Dive|Kubeflow: 云原生 ML 平台]]
- [[16_AI_Ops/LangSmith_Deep_Dive|LangSmith: LLM 应用调试与监控]]
- [[16_AI_Ops/DVC_Deep_Dive|DVC: 数据版本控制]]
- [[16_AI_Ops/ClearML_Deep_Dive|ClearML: 开源 ML 平台]]
- [[16_AI_Ops/Guardrails_Deep_Dive|Guardrails AI: LLM 安全护栏]]
- [[16_AI_Ops/SRE_for_AI_Systems|AI 系统的 SRE 实践指南]]

- [[16_AI_Ops/AIOps-in-nutshell]] — AI Ops 速成指南 (共享: ai-ops, incident-response, monitoring, observability)
- [[16_AI_Ops/AI_Incident_Response_Playbook]] — AI 系统事故响应手册 (共享: ai-ops, incident-response, monitoring, observability)
- [[16_AI_Ops/AI_Ops_for_dummy]] — AI Ops 入门指南 (for Dummies) (共享: ai-ops, incident-response, monitoring, observability)
- [[16_AI_Ops/README_for_dummy]] — 16 AI Ops — 小白版 📡 (共享: ai-ops, incident-response, monitoring, observability)
- [[16_AI_Ops/CI_CD_Pipeline_AI_2026.md|CI_CD_Pipeline_AI_2026]]

## 新增页面

- [[16_AI_Ops/AI_Observability_Guide_2026|AI 可观测性指南]]
