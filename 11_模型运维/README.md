---
title: 'MLOps 流水线 (MLOps Pipeline)'
category: '11-mlops-pipeline'
tags: ["mlops", "llmops", "ci-cd", "pipeline", "feature-store"]
summary: '> **一句话理解**: MLOps 是 DevOps 的"AI 版"——如果说开发一个模型像造一辆车，MLOps 就是建造并运营整条汽车生产线，确保模型能持续、稳定、高效地在生产环境中运行。'
created: '2026-05-31'
updated: '2026-06-15'
tier: supporting
sources: []

name_zh: "MLOps 流水线"
---
# MLOps 流水线 (MLOps Pipeline)

> 中文简称：MLOps 流水线

> **一句话理解**: MLOps 是 DevOps 的"AI 版"——如果说开发一个模型像造一辆车，MLOps 就是建造并运营整条汽车生产线，确保模型能持续、稳定、高效地在生产环境中运行。

---

## 🎯 双主线阅读导航

本章按**两条主线**组织：传统 ML 的全生命周期管理 + LLM 时代的 LLMOps 升级。2026 年的实践必须两者兼顾——传统 ML 系统仍在运行，LLM 应用正在爆发。

```mermaid
graph LR
    subgraph "传统 MLOps 主线"
        T1[数据版本化] --> T2[实验追踪]
        T2 --> T3[特征存储]
        T3 --> T4[ML CI/CD]
        T4 --> T5[模型注册]
        T5 --> T6[漂移监控]
    end
    subgraph "LLMOps 主线（2026 新增）"
        L1[LLMOps 总览] --> L2[Prompt 工程化]
        L1 --> L3[LLM 评估流水线]
        L1 --> L4[RAG 流水线运维]
    end
```

### 📌 应该从哪条主线入手？

| 你的场景 | 推荐起点 |
|---------|---------|
| 我在做 LLM/RAG/Agent 应用 | **[[11_模型运维/10_LLMOps_大模型运维/05_LLMOps_2026.md]]** → 然后 Prompt/Eval/RAG 三专题 |
| 我在做传统 ML（推荐/分类/预测） | [[11_模型运维/01_MLOps基础/05_MLOps_流水线.md]] → 然后特征/CI-CD/监控 |
| 我想知道 MLOps 是什么 | [[11_模型运维/01_MLOps基础/06_MLOps_简明指南.md]]（30 分钟速览） |
| 我是纯初学者 | [[11_模型运维/01_MLOps基础/05_MLOps_流水线]] |
| 我想知道工具怎么用 | 见下方「🔧 工具深度解析」区（已从 16 迁入本章） |

---

## 📍 与 16_AI_Ops 的边界

> **本章是「ML 建设」（概念 + 工具实现，Build-time），16 是「AI 运维」（线上运营 + 应急，Run-time）。**
> 2026-06-15 起，16 个工具深度解析已从 16 迁入本章。16 仅保留 Incident Response / SRE / Chaos Engineering。
> 完整边界声明与归属矩阵见 [[11_模型运维/01_MLOps基础/01_Boundary_with_16.md]]。

| 想了解 | 去哪 |
|--------|------|
| 概念与方法论（什么是特征存储/为什么需要数据版本） | 本章上方「LLMOps 主线」/「传统 MLOps 主线」/「横切关注点」 |
| 工具怎么用（Feast/DVC/MLflow/LangSmith…） | 本章下方「🔧 工具深度解析」 |
| 事故响应 / SRE / 混沌工程 | [[13_运维/README]] — 运维专属 |

---

## 本章内容

### 🆕 LLMOps 主线（LLM 时代·2026）

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| ⭐ **[LLMOps 2026](11_模型运维/10_LLMOps_大模型运维/05_LLMOps_2026.md)** | **LLM 时代主线**：传统 MLOps 失效的 7 大原因、Prompt/模型/RAG 三层架构、成本与延迟 SLO、可观测性、成熟度模型、3 个事故复盘 | 所有人必读 |
| [Prompt 工程化运维](11_模型运维/11_Prompt运维/02_Prompt工程_Ops.md) | Prompt 版本化、A/B 测试、回归门禁、Prompt Registry（Promptflow/LangSmith/Promptfoo） | LLM 应用工程师 |
| [LLM 评估流水线](11_模型运维/13_运维评估/03_LLM评估_Pipeline.md) | LLM-as-Judge、人审工作流、Eval 数据集版本化、CI 门禁、Ragas/DeepEval 实战 | LLM 应用工程师 |
| [RAG 流水线运维](11_模型运维/05_流程编排/11_RAG_流水线_Ops.md) | 切块版本化、Embedding 升级策略、索引重建、检索质量监控（侧重 Ops） | RAG 系统工程师 |
| [LLM 成本与延迟 SLO](11_模型运维/09_成本管理/03_LLM_成本_延迟_SLO.md) | 三层缓存、智能路由、级联、Token 预算熔断、FinOps | LLM 平台工程师 |
| [LLM 可观测性](11_模型运维/08_可观测性/09_LLM_可观测性.md) | 五层监控、Trace 分布式追踪、幻觉/毒性/PII 在线检测、Runbook | SRE / LLM 平台 |
| [LLM 护栏与安全运维 2026](11_模型运维/10_LLMOps_大模型运维/03_LLM_Guardrails_and_安全_Ops_2026.md) | Prompt Injection/PII/毒性检测、Guardrails 编排、审计合规 | AI 安全工程师 / MLOps |

### 传统 MLOps 主线

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [MLOps-in-nutshell](11_模型运维/01_MLOps基础/06_MLOps_简明指南.md) | 30 分钟速览：成熟度模型、生命周期、关键工具 | 快速入门 |
| [MLOps Pipeline](11_模型运维/01_MLOps基础/05_MLOps_流水线.md) | 完整流水线设计：数据版本化、特征存储、模型注册、持续部署 | 系统学习 |
| [MLOps Pipeline for Dummy](11_模型运维/01_MLOps基础/MLOps_Pipeline_for_dummy.md) | MLOps 概念的简化版解释 | 初学者 |
| [Feature Store 深度解析](11_模型运维/04_实验追踪/05_特征存储_深入分析.md) | Feast/Tecton/Hopsworks 对比，训练-服务偏差解决方案 | 进阶 |
| [实验追踪深度解析](11_模型运维/04_实验追踪/02_实验追踪_深入分析.md) | MLflow/W&B/Neptune 全面对比，实验管理与复现 | 进阶 |
| [ML CI/CD 流水线](11_模型运维/06_持续集成部署/04_ML_CI_CD.md) | 数据验证、模型测试、金丝雀部署、GitHub Actions for ML | 进阶 |
| [Model Monitoring & Drift Detection 2026](11_模型运维/08_可观测性/13_模型_监控_and_Drift_检测_2026.md) | 漂移检测理论、PSI/KS 统计、语义漂移、Evidently/WhyLabs 实战 | 进阶 |
| [数据流水线编排](11_模型运维/05_流程编排/02_数据工程_Pipeline_Orchestration.md) | Airflow/Dagster/Prefect 对比，DAG 设计最佳实践 | 进阶 |
| [MLOps 成熟度模型](11_模型运维/01_MLOps基础/04_MLOps_Maturity_模型.md) | Level 0-3 成熟度评估、团队建设、工具选型、ROI 衡量 | 管理者 |
| [Model Registry & Model Cards](11_模型运维/04_实验追踪/09_模型_注册中心_and_Cards_深入分析.md) | MLflow Registry、版本管理、阶段转换、Model Card 文档化 | 进阶 |

### 数据工程（MLOps 数据基础）

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [ML 数据流水线](11_模型运维/02_数据工程/01_数据_流水线_for_ML.md) | 数据摄取、清洗、特征工程、版本化、Airflow/K8s 编排 | 数据工程师 |
| [数据验证与质量](11_模型运维/02_数据工程/02_数据工程_Validation_and_Quality.md) | 四层验证、Great Expectations/Pandera/Evidently、漂移检测 | 数据/MLOps 工程师 |

### 特征平台

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [特征平台基础](11_模型运维/03_特征存储/02_特征存储_基础.md) | Feature Store 价值、架构、在线/离线一致性、工具对比 | MLOps 工程师 |

### 可复用模板

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Model Card 模板](11_模型运维/04_实验追踪/08_模型_Card_模板.md) | 记录模型用途、性能、局限性与伦理考量的标准模板 | ML 工程师 / 合规 |
| [实验跟踪记录模板](11_模型运维/04_实验追踪/03_实验追踪_模板.md) | 确保实验可追溯、可复现的标准记录模板 | ML 研究员 / 工程师 |
| [部署 Runbook 模板](11_模型运维/07_模型服务/02_部署_操作手册_模板.md) | ML 模型部署 checklist 与回滚流程模板 | MLOps / SRE |

### 横切关注点（跨 LLMOps 与 MLOps）

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [数据版本控制](11_模型运维/05_流程编排/04_数据_版本管理_DVC_LakeFS.md) | DVC/LakeFS/Delta Lake 对比，可复现性的基石 | 数据工程师 |
| [AI 文档自动化](11_模型运维/01_MLOps基础/02_Documentation_自动化.md) | Sphinx/MkDocs/Docusaurus/Vale 文档自动化工具链 | 技术写作者 / 工程师 |
| [Prompt 管理平台](11_模型运维/11_Prompt运维/03_Prompt管理_平台.md) | LangSmith/PromptLayer/Helicone/Langfuse 深度对比 | LLM 应用工程师 |
| [自动化再训练](11_模型运维/07_模型服务/01_Automated_Retraining.md) | 触发机制、数据回流、增量 vs 全量、自动门禁、灾难性遗忘 | ML 平台 |
| [ML 系统可观测与 SLO](11_模型运维/08_可观测性/11_ML_可观测性_SLO.md) | 三大支柱、SLI/SLO/SLA、错误预算、USE 方法、告警设计 | SRE |
| [MLOps 成本优化](11_模型运维/09_成本管理/01_成本优化_MLOps.md) | GPU 调度、Spot 实例、弹性伸缩、训练/推理优化、FinOps | 平台 / FinOps |
| [隐私与合规流水线](11_模型运维/05_流程编排/10_隐私_合规_流水线.md) | PII 检测、数据血源、模型卡强制化、公平性门禁、审计、GDPR/AI Act | 合规 / 风控 |

### 🔧 工具深度解析（2026-06-15 从 16_AI_Ops 迁入）

> 以下工具页聚焦**具体命令、配置、部署、踩坑**。概念与选型方法论见上方对应的概念页。

#### 数据与版本控制

| 文档 | 对应概念页 |
|------|-----------|
| [DVC Deep Dive](11_模型运维/05_流程编排/05_DVC_深入分析.md) | [[11_模型运维/05_流程编排/04_数据_版本管理_DVC_LakeFS.md]] |
| [LakeFS Deep Dive](11_模型运维/05_流程编排/08_LakeFS_深入分析.md) | [[11_模型运维/05_流程编排/04_数据_版本管理_DVC_LakeFS.md]] |

#### 特征与实验追踪

| 文档 | 对应概念页 |
|------|-----------|
| [Feast Deep Dive](11_模型运维/04_实验追踪/04_Feast_深入分析.md) | [[11_模型运维/04_实验追踪/05_特征存储_深入分析.md]] |
| [MLflow Deep Dive](11_模型运维/04_实验追踪/07_MLflow_深入分析.md) | [[11_模型运维/04_实验追踪/02_实验追踪_深入分析.md]] |
| [ClearML Deep Dive](11_模型运维/04_实验追踪/01_ClearML_深入分析.md) | [[11_模型运维/04_实验追踪/02_实验追踪_深入分析.md]] |

#### 流水线编排

| 文档 | 对应概念页 |
|------|-----------|
| [Kubeflow Deep Dive](11_模型运维/05_流程编排/07_Kubeflow_深入分析.md) | [[11_模型运维/05_流程编排/02_数据工程_Pipeline_Orchestration.md]] |
| [Prefect Deep Dive](11_模型运维/05_流程编排/09_Prefect_深入分析.md) | [[11_模型运维/05_流程编排/02_数据工程_Pipeline_Orchestration.md]] |

#### LLM 可观测与评估

| 文档 | 对应概念页 |
|------|-----------|
| [LangSmith Deep Dive](11_模型运维/08_可观测性/07_LangSmith_深入分析.md) | [[11_模型运维/13_运维评估/03_LLM评估_流水线]] / [[11_模型运维/08_可观测性/09_LLM_可观测性.md]] |
| [Helicone Deep Dive](11_模型运维/08_可观测性/05_Helicone_深入分析.md) | [[11_模型运维/08_可观测性/09_LLM_可观测性.md]] |
| [Phoenix Deep Dive](11_模型运维/08_可观测性/14_Phoenix_深入分析.md) | [[11_模型运维/08_可观测性/09_LLM_可观测性.md]] |
| [Braintrust Deep Dive](11_模型运维/08_可观测性/04_Braintrust_深入分析.md) | [[11_模型运维/13_运维评估/03_LLM评估_流水线]] |

#### 可观测性与 CI/CD（综合）

| 文档 | 对应概念页 |
|------|-----------|
| [AI Observability Deep Dive](11_模型运维/08_可观测性/01_AI_可观测性_深入分析.md) | [[11_模型运维/08_可观测性/11_ML_可观测性_SLO.md]] |
| [AI Observability Guide](11_模型运维/08_可观测性/03_AI_可观测性_指南.md) | [[11_模型运维/08_可观测性/11_ML_可观测性_SLO.md]] |
| [AI Observability Guide 2026](11_模型运维/08_可观测性/02_AI_可观测性_指南_2026.md) | [[11_模型运维/08_可观测性/11_ML_可观测性_SLO.md]] |
| [CI/CD Pipeline AI 2026](11_模型运维/06_持续集成部署/01_CI_CD_流水线_AI_2026.md) | [[11_模型运维/06_持续集成部署/04_ML_CI_CD.md]] |
| [LLM Production Pipeline 2026](11_模型运维/10_LLMOps_大模型运维/04_LLM_生产_流水线_2026.md) | [[11_模型运维/10_LLMOps_大模型运维/05_LLMOps_2026.md]] |

### 🛠 MLOps / LLMOps 排障 Runbook

> 面向 K8s 上 ML/LLM 流水线的实战排障手册。

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [MLflow Tracking Server 不可达](11_模型运维/12_故障排查/03_MLflow_追踪_服务端_Unreachable.md) | 从客户端 URI 到 DB / Artifact Store 分层排查 | MLOps 工程师 |
| [数据验证失败](11_模型运维/12_故障排查/01_数据_Validation_Failure_操作手册.md) | Schema / 统计 / 语义层失败定位与处理 | 数据工程师 |
| [模型版本回滚](11_模型运维/12_故障排查/05_模型_版本_回滚_Playbook.md) | MLflow Registry + K8s/KServe 回滚流程 | MLOps / SRE |
| [MLOps on K8s 排查速查表](11_模型运维/12_故障排查/04_MLOps_K8s_Cheat_Sheet.md) | MLflow/Airflow/KServe/PostgreSQL/OSS 常用诊断命令 | MLOps / SRE |

> Guardrails / PromptLayer 仍留 [[13_运维/README]]（安全护栏与 Prompt 管理更贴近运维场景）。

---

## 学习路径

### LLM 应用开发者路径（2026 主流）
- **主线** → [LLMOps 2026](11_模型运维/10_LLMOps_大模型运维/05_LLMOps_2026.md)（1 小时，必读）
- **深扩** → [Prompt Ops](11_模型运维/11_Prompt运维/02_Prompt工程_Ops.md) → [LLM Eval](11_模型运维/13_运维评估/03_LLM评估_Pipeline.md) → [RAG Ops](11_模型运维/05_流程编排/11_RAG_流水线_Ops.md)
- **成本** → 跨章参考 [[10_部署推理/06_成本管理/01_LLM_成本优化]]

### 传统 ML 工程师路径
- **快速入门** → [MLOps-in-nutshell](11_模型运维/01_MLOps基础/06_MLOps_简明指南.md)（30 分钟）
- **系统学习** → [MLOps Pipeline](11_模型运维/01_MLOps基础/05_MLOps_流水线.md)（2-3 小时）
- **简化版** → [MLOps Pipeline for Dummy](11_模型运维/01_MLOps基础/MLOps_Pipeline_for_dummy.md)

---

## 与其他章节的关联

### 前置知识
- [模型训练](../07_模型训练/) — 训练流程是 MLOps 的输入
- [模型评估](../08_模型评估/) — 评估是流水线中的质量门禁
- [部署推理](./10_部署推理/README.md) — MLOps 的最终交付环节

### 进阶方向
- [AI Ops](../13_运维/README.md) — 模型监控、告警、自动回滚
- [测试](../09_测试/README.md) — AI 系统的测试策略
- [架构基础设施](../12_架构基建/) — 底层基础设施支撑
- [RAG 系统](../14_RAG系统/) — 知识密集型应用的 MLOps 实践

---

## 关键技术栈

```mermaid
flowchart TB
    subgraph 数据层
        D1[数据版本化<br/>DVC / LakeFS]
        D2[特征存储<br/>Feast / Tecton]
    end
    
    subgraph 训练层
        T1[实验跟踪<br/>MLflow / W&B]
        T2[Pipeline 编排<br/>Kubeflow / Prefect]
    end
    
    subgraph 部署层
        P1[模型注册<br/>MLflow Model Registry]
        P2[持续部署<br/>ArgoCD / Jenkins]
    end
    
    subgraph 监控层
        M1[模型监控<br/>Evidently / WhyLabs]
        M2[可观测性<br/>Prometheus / Grafana]
    end
    
    D1 --> T1
    D2 --> T1
    T1 --> T2
    T2 --> P1
    P1 --> P2
    P2 --> M1
    M1 --> M2
    M2 -->|数据漂移| D1
```

---

*本章内容持续完善中。*

## Related
- [[11_模型运维/01_MLOps基础/01_Boundary_with_16.md|📍 10 与 16 边界声明]] 📐 治理
- [[11_模型运维/01_MLOps基础/01_Boundary_with_16|10 vs 16 边界声明]] ✅ 已完成
- [[11_模型运维/10_LLMOps_大模型运维/05_LLMOps_2026.md|LLMOps 2026：大模型时代的 MLOps 升级]] ⭐ LLM 时代主线
- [[11_模型运维/11_Prompt运维/02_Prompt工程_Ops.md|Prompt 工程化运维]]
- [[11_模型运维/13_运维评估/03_LLM评估_流水线|LLM 评估流水线]]
- [[11_模型运维/05_流程编排/11_RAG_流水线_Ops.md|RAG 流水线运维]]
- [[11_模型运维/09_成本管理/03_LLM_成本_延迟_SLO.md|LLM 成本与延迟 SLO]]
- [[11_模型运维/08_可观测性/09_LLM_可观测性.md|LLM 可观测性]]
- [[11_模型运维/05_流程编排/04_数据_版本管理_DVC_LakeFS.md|数据版本控制：DVC 与 LakeFS]]
- [[11_模型运维/07_模型服务/01_Automated_Retraining.md|自动化再训练]]
- [[11_模型运维/08_可观测性/11_ML_可观测性_SLO.md|ML 系统可观测与 SLO]]
- [[11_模型运维/09_成本管理/01_成本优化_MLOps.md|MLOps 成本优化]]
- [[11_模型运维/05_流程编排/10_隐私_合规_流水线.md|隐私与合规流水线]]
- [[11_模型运维/04_实验追踪/09_模型_注册中心_and_Cards_深入分析.md|模型注册与模型卡片深度解析 (Model Registry & Model Cards Deep Dive)]]
- [[11_模型运维/01_MLOps基础/05_MLOps_流水线.md|MLOps 流水线 (MLOps Pipeline)]]
- [[11_模型运维/06_持续集成部署/04_ML_CI_CD.md|ML CI/CD 流水线 (ML CI/CD Pipeline)]]
- [[11_模型运维/01_MLOps基础/05_MLOps_流水线|MLOps 流水线 - 小白版]]
- [[11_模型运维/README|10 MLOps 流水线 — 小白版 🔄]]
- [[11_模型运维/04_实验追踪/02_实验追踪_深入分析.md|实验追踪深度解析 (Experiment Tracking Deep Dive)]]
- [[11_模型运维/01_MLOps基础/04_MLOps_Maturity_模型.md|MLOps 成熟度模型与最佳实践 (MLOps Maturity Model)]]
- [[11_模型运维/04_实验追踪/05_特征存储_深入分析.md|Feature Store 深度解析 (Feature Store Deep Dive)]]

- [[概念/MLOps/mlops.md]] — MLOps
- [[概念/General/model-deployment.md]] — 模型部署



- [[Data_Pipeline_for_ML|ML 数据流水线]]
- [[Feature_Store_Fundamentals|特征平台基础]]
- [[概念/Inference/model-serving|模型服务模式 (Model Serving Patterns)]]
- [[11_模型运维/05_流程编排/01_Annotation_流水线|标注流水线 (Annotation Pipeline)]]
- [[Tutorial_LLMOps_End_to_End|LLMOps 端到端教程：Langfuse + Promptfoo + Ragas + LiteLLM]]
- [[Tutorial_MLOps_End_to_End|MLOps 端到端教程：DVC + MLflow + GitHub Actions + Evidently]]
