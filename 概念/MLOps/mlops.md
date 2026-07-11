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
  - MLOps/MLOps_Maturity_Model.md
  - MLOps/Orchestration/Data_Pipeline_Orchestration.md
  - MLOps/Experiment_Tracking/Experiment_Tracking_Deep_Dive.md
  - MLOps/CI_CD/ML_CI_CD.md
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
updated: 2026-05-31T00:00:00Z
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

- MLOps/MLOps_Pipeline.md — 完整流水线设计、LLMOps 2026最佳实践
- MLOps/MLOps_Maturity_Model.md — 成熟度模型Level 0-3、团队建设
- MLOps/Orchestration/Data_Pipeline_Orchestration.md — Airflow/Dagster/Prefect对比
- MLOps/Experiment_Tracking/Experiment_Tracking_Deep_Dive.md — MLflow/W&B/Neptune深度对比
- MLOps/CI_CD/ML_CI_CD.md — 数据验证、模型测试、部署策略
- MLOps/Experiment_Tracking/Feature_Store_Deep_Dive.md — Feast/Tecton/Hopsworks对比

## Related

- [[模型运维/Orchestration/Data_Pipeline_Orchestration]] — 数据流水线编排 (Data Pipeline Orchestration) (共享: ci-cd, feature-store, mlops)
- [[模型运维/MLOps-in-nutshell]] — MLOps 速成指南 (共享: ci-cd, feature-store, mlops)
- [[概念/automl]] — 自动机器学习
