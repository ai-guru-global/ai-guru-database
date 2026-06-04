---
title: 'MLOps 流水线 (MLOps Pipeline)'
category: '10-mlops-pipeline'
tags: ["mlops", "ci-cd", "pipeline", "feature-store"]
summary: '> **一句话理解**: MLOps 是 DevOps 的"AI 版"——如果说开发一个模型像造一辆车，MLOps 就是建造并运营整条汽车生产线，确保模型能持续、稳定、高效地在生产环境中运行。'
created: '2026-05-31'
updated: '2026-05-31'
---

# MLOps 流水线 (MLOps Pipeline)

> **一句话理解**: MLOps 是 DevOps 的"AI 版"——如果说开发一个模型像造一辆车，MLOps 就是建造并运营整条汽车生产线，确保模型能持续、稳定、高效地在生产环境中运行。

---

## 本章内容

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [MLOps-in-nutshell](./MLOps-in-nutshell.md) | 30 分钟速览：成熟度模型、生命周期、关键工具 | 快速入门 |
| [MLOps Pipeline](./MLOps_Pipeline.md) | 完整流水线设计：数据版本化、特征存储、模型注册、持续部署 | 系统学习 |
| [MLOps Pipeline for Dummy](./MLOps_Pipeline_for_dummy.md) | MLOps 概念的简化版解释 | 初学者 |
| [Feature Store 深度解析](./Feature_Store_Deep_Dive.md) | Feast/Tecton/Hopsworks 对比，训练-服务偏差解决方案 | 进阶 |
| [实验追踪深度解析](./Experiment_Tracking_Deep_Dive.md) | MLflow/W&B/Neptune 全面对比，实验管理与复现 | 进阶 |
| [ML CI/CD 流水线](./ML_CI_CD.md) | 数据验证、模型测试、金丝雀部署、GitHub Actions for ML | 进阶 |
| [数据流水线编排](./Data_Pipeline_Orchestration.md) | Airflow/Dagster/Prefect 对比，DAG 设计最佳实践 | 进阶 |
| [MLOps 成熟度模型](./MLOps_Maturity_Model.md) | Level 0-3 成熟度评估、团队建设、工具选型、ROI 衡量 | 管理者 |
| [Model Registry & Model Cards](./Model_Registry_and_Cards_Deep_Dive.md) | MLflow Registry、版本管理、阶段转换、Model Card 文档化 | 进阶 |

---

## 学习路径

- **快速入门** → [MLOps-in-nutshell](./MLOps-in-nutshell.md)（30 分钟）
- **系统学习** → [MLOps Pipeline](./MLOps_Pipeline.md)（2-3 小时）
- **简化版** → [MLOps Pipeline for Dummy](./MLOps_Pipeline_for_dummy.md)

---

## 与其他章节的关联

### 前置知识
- [模型训练](../07_Model_Training/) — 训练流程是 MLOps 的输入
- [模型评估](../08_Model_Evaluation/) — 评估是流水线中的质量门禁
- [部署推理](../09_Deployment_Inference/README.md) — MLOps 的最终交付环节

### 进阶方向
- [AI Ops](../16_AI_Ops/README.md) — 模型监控、告警、自动回滚
- [测试](../15_Testing/README.md) — AI 系统的测试策略
- [架构基础设施](../12_Architecture_Infrastructure/) — 底层基础设施支撑
- [RAG 系统](../11_RAG_Systems/) — 知识密集型应用的 MLOps 实践

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
- [[10_MLOps_Pipeline/Model_Registry_and_Cards_Deep_Dive|模型注册与模型卡片深度解析 (Model Registry & Model Cards Deep Dive)]]
- [[10_MLOps_Pipeline/MLOps_Pipeline|MLOps 流水线 (MLOps Pipeline)]]
- [[10_MLOps_Pipeline/README|MLOps 流水线 (MLOps Pipeline)]]
- [[10_MLOps_Pipeline/ML_CI_CD|ML CI/CD 流水线 (ML CI/CD Pipeline)]]
- [[10_MLOps_Pipeline/MLOps_Pipeline_for_dummy|MLOps 流水线 - 小白版]]
- [[10_MLOps_Pipeline/README_for_dummy|10 MLOps 流水线 — 小白版 🔄]]
- [[10_MLOps_Pipeline/Experiment_Tracking_Deep_Dive|实验追踪深度解析 (Experiment Tracking Deep Dive)]]
- [[10_MLOps_Pipeline/MLOps_Maturity_Model|MLOps 成熟度模型与最佳实践 (MLOps Maturity Model)]]
- [[10_MLOps_Pipeline/Feature_Store_Deep_Dive|Feature Store 深度解析 (Feature Store Deep Dive)]]

- [[concepts/mlops]] — MLOps
- [[concepts/model-deployment]] — 模型部署


