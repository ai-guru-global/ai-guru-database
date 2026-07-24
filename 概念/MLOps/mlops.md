---
title: MLOps 流水线
category: -concepts
tags: [mlops, llmops, ci-cd, feature-store, experiment-tracking]
relationships:
  - target: "[[概念/ai-architecture]]"
    type: related_to
  - target: "概念/llm-infrastructure"
    type: related_to
  - target: "概念/rag-systems"
    type: related_to
sources:
  - 10_MLOps_automl/MLOps_Pipeline.md
  - 模型运维/MLOps_Fundamentals/MLOps_Maturity_Model.md
  - 模型运维/Orchestration/Data_Pipeline_Orchestration.md
  - 模型运维/Experiment_Tracking/Experiment_Tracking_Deep_Dive.md
  - 模型运维/CI_CD/ML_CI_CD.md
  - MLOps/feature-engineering_Store_Deep_Dive.md
summary: MLOps是DevOps的AI升级版，将机器学习模型从实验环境稳定部署到生产环境的工程实践体系，涵盖数据版本化、实验追踪、特征存储、CI/CD流水线和模型监控等核心能力。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
aliases:
  - Mlops

---
# MLOps 流水线

## 核心要点

MLOps（Machine unsupervised-learning Operations）融合了机器学习、DevOps和数据工程的最佳实践，解决模型从笔记本到生产环境的"最后一公里"问题。2026年的MLOps已演进为LLMOps，新增提示词版本控制、语义缓存、智能路由和ai-agents编排等能力。

核心痛点包括：模型在笔记本上跑得好上线就崩、实验无法复现、模型逐渐变坏无人知晓、更新流程缺乏自动化。MLOps通过标准化流水线解决这些问题。

成熟度模型分为四个阶段：Level 0（全手动）→ Level 1（Pipeline自动化）→ Level 2（CI/CD for ML）→ Level 3（全自动闭环）。大多数团队应从Level 0开始，逐步升级。

## 详细内容

### ML生命周期管理

完整的ML生命周期形成闭环：数据收集 → 数据处理 → 特征工程 → 模型训练 → 模型评估 → 模型注册 → 模型部署 → 线上服务 → 模型监控 → 反馈闭环。每个环节都需要版本化和可追溯。^[inferred]

### 数据版本控制

DVC（Data Version Control）解决了大文件不适合Git管理的问题。核心原理是用`.dvc`元数据文件（入Git）替代实际数据文件（存于S3/GCS等远程存储），实现数据版本的精确追踪和复现。

### 实验追踪

实验追踪是MLOps的基础能力，自动记录每次训练的超参数、指标、工件和元数据。主流工具包括MLflow（开源自托管，功能完整）、W&B（可视化最强，SaaS服务）和Neptune（灵活部署，细粒度权限）。

MLflow提供实验跟踪+模型注册+项目打包的完整生命周期管理。W&B的Sweep功能支持贝叶斯超参数搜索，适合重度可视化需求的团队。

### 特征存储（Feature Store）

特征存储是统一管理离线训练和在线推理特征的中央平台，解决"训练-服务偏差"问题。核心架构采用双存储设计：离线存储（Parquet/Delta Lake，用于训练数据生成）和在线存储（Redis/DynamoDB，用于实时特征查询）。

Feast是开源Feature Store的代表，支持Entity、FeatureView、FeatureService等核心抽象。商业方案Tecton提供原生流式特征支持。选择决策：小团队用Feast+Redis，大团队用Tecton或自建。^[ambiguous]

### 数据流水线编排

主流编排工具包括Airflow（任务调度为核心，生态最成熟）、Dagster（数据资产为核心，内置血缘追踪）和Prefect（最易上手，动态工作流）。DAG设计原则强调幂等性、原子性和清晰命名。

### ML CI/CD

ML CI/CD与传统软件CI/CD的核心区别在于：构建产物是训练好的模型，测试对象包括数据质量和模型性能，部署单元是模型服务+特征Pipeline+配置。关键环节包括数据验证（Great Expectations/Pandera）、模型回归测试、金丝雀/蓝绿部署策略。

### 模型监控与漂移检测

漂移分为四类：数据漂移（输入特征分布变化）、概念漂移（输入-输出关系变化）、标签漂移（目标变量分布变化）和预测漂移（模型预测分布变化）。检测方法包括PSI、KS检验、KL散度。Evidently是开源漂移检测的代表性工具。

### LLMOps（2026演进）

LLMOps面临新挑战：评估从固定指标转向LLM-as-Judge，版本管理新增prompt-engineering和RAG配置，监控重点转为Token使用和幻觉率，反馈循环从标签收集转为Prompt优化。

三层缓存架构是LLMOps的核心优化：L1精确匹配缓存（<1ms）、L2语义缓存（5-10ms，向量相似度>0.95）、L3实际LLM调用（100-500ms）。组合使用可节省40-70%成本。

智能路由根据查询复杂度选择不同模型：简单问题路由到便宜模型节省90%成本，复杂问题升级到强力模型。级联路由先尝试便宜模型，质量不满足再升级。

### 工具选型指南

按团队规模：个人/小团队用MLflow+DVC+GitHub Actions（免费自托管）；中型团队用W&B+Airflow+Feast；大型企业用云平台全家桶+Kubeflow。

## 开放问题

- MLOps标准化程度不足，不同工具链之间集成困难
- LLMOps中Prompt版本控制的最佳实践仍在演进 ^[ambiguous]
- 小团队如何避免过度工程化，找到ROI最高的MLOps切入点
- Agent编排的可观测性和调试工具链尚未成熟

## 来源

- 模型运维/MLOps_Fundamentals/MLOps_Pipeline.md — 完整流水线设计、LLMOps 2026最佳实践
- 模型运维/MLOps_Fundamentals/MLOps_Maturity_Model.md — 成熟度模型Level 0-3、团队建设
- 模型运维/Orchestration/Data_Pipeline_Orchestration.md — Airflow/Dagster/Prefect对比
- 模型运维/Experiment_Tracking/Experiment_Tracking_Deep_Dive.md — MLflow/W&B/Neptune深度对比
- 模型运维/CI_CD/ML_CI_CD.md — 数据验证、模型测试、部署策略
- MLOps/Experiment_Tracking/Feature_Store_Deep_Dive.md — Feast/Tecton/Hopsworks对比

## Related

- [[模型运维/Orchestration/Data_Pipeline_Orchestration]] — 数据流水线编排 (Data Pipeline Orchestration) (共享: ci-cd, feature-store, mlops)
- [[模型运维/MLOps-in-nutshell]] — MLOps 速成指南 (共享: ci-cd, feature-store, mlops)
- [[概念/automl]] — 自动机器学习

---

## 2026 MLOps 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **MLflow** | 实验追踪/模型注册/部署 | GA |
| **Kubeflow** | K8s 原生 ML 平台 | GA |
| **Weights & Biases** | 实验追踪/可视化 | GA |
| **Feast** | Feature Store | GA |
| **Seldon/KServe** | 模型服务 | GA |

## 生产最佳实践

1. **实验追踪**：所有实验必须追踪，支持复现
2. **模型版本控制**：模型纳入版本控制
3. **CI/CD for ML**：ML 流水线集成 CI/CD
4. **监控告警**：监控模型性能，漂移告警
5. **特征存储**：用 Feature Store 实现特征复用

## 2026 MLOps 成熟度模型

| 级别 | 说明 | 特征 |
|------|------|------|
| **Level 0** | 手动流程 | 无自动化 |
| **Level 1** | ML 管道自动化 | 训练自动化 |
| **Level 2** | CI/CD 管道 | 完整自动化 |
| **Level 3** | 自动化运维 | 自愈系统 |

## MLOps 核心组件

```
数据管理 → 实验跟踪 → 模型注册 → 部署 → 监控
    ↓           ↓           ↓         ↓       ↓
DVC/LakeFS  MLflow/W&B  MLflow    KServe  Prometheus
```

## MLOps 工具链对比

| 组件 | 开源工具 | 商业工具 |
|------|------|------|
| **实验跟踪** | MLflow, W&B | Neptune, Comet |
| **模型注册** | MLflow | SageMaker |
| **部署** | KServe, Seldon | SageMaker, Vertex AI |
| **监控** | Evidently, Prometheus | Datadog, Fiddler |
| **编排** | Airflow, Kubeflow | SageMaker Pipelines |

## 延伸阅读

- [[概念/MLOps/experiment-tracking|Experiment Tracking]] — 实验跟踪
- [[概念/MLOps/model-registry|Model Registry]] — 模型注册
- [[概念/MLOps/ci-cd|CI/CD]] — 持续集成/交付
- [[概念/MLOps/observability|Observability]] — 可观测性

> ℹ️ MLOps 是将 DevOps 实践应用于 ML 系统的方法论，目标是实现 ML 系统的可靠、高效交付。

## 生产最佳实践

1. **实验跟踪**：所有实验必须记录参数/指标/代码
2. **模型版本控制**：模型纳入版本管理
3. **数据版本控制**：训练数据可追溯
4. **CI/CD 管道**：自动化测试和部署
5. **监控告警**：模型性能持续监控
6. **漂移检测**：数据/模型漂移自动检测
7. **特征存储**：特征复用和一致性
8. **A/B 测试**：新模型渐进式发布
9. **回滚机制**：快速回滚到稳定版本
10. **文档完善**：模型卡片和文档

## 检查清单

- [ ] 实验跟踪已配置
- [ ] 模型注册已配置
- [ ] CI/CD 管道已建立
- [ ] 监控告警已配置
- [ ] 漂移检测已配置
- [ ] 回滚机制已测试

## 工具对比

| 组件 | 开源 | 商业 |
|------|------|------|
| **实验跟踪** | MLflow, W&B | Neptune |
| **模型注册** | MLflow | SageMaker |
| **部署** | KServe | SageMaker |
| **监控** | Evidently | Datadog |

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 工具太多 | 从核心开始 |
| 团队抵触 | 渐进式引入 |
| 成本高 | 用开源工具 |
| 集成复杂 | 用托管服务 |
