---
title: "Kubeflow"
category: -concepts
tags: ["kubeflow", "kubernetes", "mlops", "pipeline", "notebook", "training", "serving", "katib", "cncf"]
relationships:
  - target: "概念/mlops"
    type: extends
  - target: "概念/kubernetes"
    type: runs_on
  - target: "概念/pipeline"
    type: enables
  - target: "概念/kserve"
    type: related_to
  - target: "概念/volcano"
    type: related_to
sources:
  - 模型运维/Orchestration/Kubeflow_Deep_Dive.md
summary: "Kubeflow 是 CNCF 孵化的 Kubernetes 机器学习工具集，提供 Notebooks、Pipelines、Training、Katib（AutoML）、Serving 等组件，是 K8s 上端到端 MLOps 的主流开源方案。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Kubeflow

---
# Kubeflow

> Kubernetes 上的「机器学习全家桶」——从 Jupyter 到训练流水线再到模型服务的一站式 MLOps 平台。

---

## 1. 一句话定义

**Kubeflow** 是 CNCF 孵化的开源 MLOps 工具集，专为 Kubernetes 设计。它整合了 **Jupyter Notebooks、Pipelines（工作流）、Training Operator（分布式训练）、Katib（超参搜索）、KServe（模型服务）** 等组件，帮助企业构建端到端的机器学习平台。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Notebooks** | K8s 上的 Jupyter 开发环境 |
| **Pipelines** | 基于 Argo 的 DAG 工作流，可视化编排 |
| **Training Operator** | 支持 TFJob、PyTorchJob、MPIJob、XGBoostJob |
| **Katib** | 自动超参数优化与神经架构搜索 |
| **KServe** | 模型服务（可独立使用） |
| **Multi-tenancy** | 基于 K8s Namespace 的隔离 |

---

## 3. 架构组件

```
Kubeflow Platform
  ├── Central Dashboard
  ├── Notebooks (Jupyter)
  ├── Pipelines (Argo Workflows)
  ├── Training Operator
  ├── Katib
  └── KServe
```

---

## 4. 典型场景

1. **企业 MLOps 平台**：统一管理数据科学团队的工作流。
2. **分布式训练编排**：PyTorch/TensorFlow/MPI 分布式训练。
3. **自动化实验管理**：Katib 超参搜索 + Pipelines 自动化。
4. **模型全生命周期**：从开发到部署的一站式平台。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | 运行基座 |
| **KServe** | Kubeflow 生态的模型服务组件 |
| **Volcano / Kueue** | 可替代或增强 Training Operator 的调度能力 |
| **MLflow / W&B** | 实验跟踪，可与 Kubeflow 集成 |
| **Airflow / Argo** | Kubeflow Pipelines 基于 Argo |

---

## 6. 优势与局限

### 优势
- CNCF 背书，生态完整。
- 与 Kubernetes 深度集成。
- 组件可独立使用，灵活组合。

### 局限
- 组件多、部署复杂、学习曲线陡。
- 对 LLM 特定场景（如大模型预训练）需要额外定制。
- UI/UX 相比商业平台略显陈旧。

---

## Related

- [[模型运维/Orchestration/Kubeflow_Deep_Dive]] — Kubeflow 深度解析
- [[概念/mlops]] — MLOps
- [[概念/kubernetes]] — Kubernetes
- [[概念/kserve]] — KServe
- [[概念/volcano]] — Volcano
- [[概念/kueue]] — Kueue

---

## 2026 Kubeflow 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Kubeflow Pipelines** | ML 工作流编排 | GA |
| **Kubeflow Training** | 分布式训练 Operator | GA |
| **Kubeflow Notebooks** | Jupyter Notebook 服务 | GA |
| **KServe** | 模型推理服务 | GA |
| **Katib** | 超参数调优 | GA |

## 生产最佳实践

1. **K8s 原生**：K8s 环境优先选择 Kubeflow
2. **Pipeline 编排**：用 Kubeflow Pipelines 编排 ML 工作流
3. **分布式训练**：用 Training Operator 管理分布式训练
4. **与 KServe 配合**：Kubeflow + KServe 实现训练到部署
5. **资源管理**：用 Kueue/Volcano 管理 GPU 资源

## 2026 Kubeflow 生态

| 组件 | 说明 | 状态 |
|------|------|------|
| **Kubeflow Pipelines 2.0** | 工作流编排 | GA |
| **Training Operator** | 分布式训练 | GA |
| **Katib** | 超参数调优 | GA |
| **KServe** | 模型服务 | GA |
| **Notebooks** | Jupyter 环境 | GA |

## 架构：Kubeflow 组件

```
Kubeflow Dashboard
    ├── Notebooks (Jupyter)
    ├── Pipelines (工作流)
    ├── Training (分布式训练)
    ├── Katib (超参调优)
    └── KServe (模型服务)
```

## Pipeline 示例

```python
from kfp import dsl, compiler

@dsl.component(base_image="python:3.11")
def preprocess_data(input_path: str, output_path: str):
    import pandas as pd
    df = pd.read_csv(input_path)
    df.to_parquet(output_path)

@dsl.component(base_image="pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime")
def train_model(data_path: str, model_path: str, epochs: int = 10):
    import torch
    # 训练逻辑
    torch.save(model, model_path)

@dsl.pipeline(name="ml-training-pipeline")
def training_pipeline(
    input_data: str = "s3://bucket/data.csv",
    model_output: str = "s3://bucket/model.pt",
):
    preprocess_task = preprocess_data(input_path=input_data, output_path="/tmp/data.parquet")
    train_task = train_model(
        data_path=preprocess_task.outputs["output_path"],
        model_path=model_output,
    )

compiler.Compiler().compile(training_pipeline, "pipeline.yaml")
```

## 延伸阅读

- [[概念/MLOps/mlops|MLOps]] — MLOps 方法论
- [[概念/MLOps/experiment-tracking|Experiment Tracking]] — 实验跟踪
- [[概念/K8s/kubernetes|Kubernetes]] — 容器编排

> ℹ️ Kubeflow 是 K8s 上的 ML 工具集，提供从实验到部署的完整 ML 工作流支持。

## 生产最佳实践

1. **分布式训练**：用 Training Operator 管理分布式训练
2. **与 KServe 配合**：Kubeflow + KServe 实现训练到部署
3. **资源管理**：用 Kueue/Volcano 管理 GPU 资源
4. **管道版本控制**：Pipeline 定义纳入 Git
5. **实验跟踪**：集成 MLflow 跟踪实验
6. **超参调优**：用 Katib 进行超参搜索
7. **多租户**：配置多租户隔离
8. **监控告警**：监控 Pipeline 运行状态

## 检查清单

- [ ] Kubeflow 已部署
- [ ] Pipeline 已定义
- [ ] 分布式训练已配置
- [ ] 模型服务已配置
- [ ] 监控告警已配置
