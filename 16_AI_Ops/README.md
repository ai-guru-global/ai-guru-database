# AI 运维与可观测性 (AI Ops)

> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、日志、告警、灾难恢复等能力。

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

- [09_Deployment_Inference](../09_Deployment_Inference/) -- 推理引擎 (vLLM, SGLang)
- [14_AI_Gateway](../14_AI_Gateway/) -- AI 网关与路由
- [15_Testing](../15_Testing/) -- AI 测试框架

---

*Last updated: 2026-04-26*
