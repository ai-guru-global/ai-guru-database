---
title: "Kubeflow: 云原生 ML 平台"
category: "11-mlops-pipeline"
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: "> **一句话理解**: Kubeflow 是云原生机器学习平台——在 K8s 上运行 ML 工作流、分布式训练、超参数调优、模型服务，开源 ML Platform。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Kubeflow Deep Dive"
  - Kubeflow_Deep_Dive
sources: []

name_zh: "Kubeflow: 云原生 ML 平台"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Kubeflow: 云原生 ML 平台

> 中文简称：Kubeflow: 云原生 ML 平台

> **一句话理解**: Kubeflow 是云原生机器学习平台——在 K8s 上运行 ML 工作流、分布式训练、超参数调优、模型服务，开源 ML Platform。

> 📐 **概念与选型方法论**: 流水线编排的原理、Kubeflow vs Airflow vs Prefect 选型，见 [[11_模型运维/05_流程编排/Data_Pipeline_Orchestration]]。本文聚焦 Kubeflow 工具用法。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Kubeflow: 云原生 ML 平台
═══════════════════════════════════════════════════════════════════

定位: Kubernetes 原生的机器学习平台，运行大规模 ML 工作流

核心理念:
───────────────────────────────────────────────────────────────────
• 云原生: 充分利用 K8s 生态
• 可扩展: 分布式训练支持
• 自动化: AutoML、超参数调优
• 多框架: TensorFlow/PyTorch/JAX
• 端到端: 从训练到服务
• 开源: CDF 顶级项目
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Notebook** | 交互式开发环境 |
| **Pipeline** | ML 工作流编排 |
| **Training** | 分布式训练 |
| **Tuning** | 超参数调优 Katib |
| **Serving** | 模型服务 KServe |
| **Metadata** | 实验元数据追踪 |

### 1.3 组件

| 组件 | 功能 |
|------|------|
| **Kubeflow Pipelines** | 工作流编排 |
| **Katib** | 超参数调优 |
| **KServe** | 模型服务 |
| **Training Operator** | 分布式训练 |
| **Central Dashboard** | Web UI |

---

## 2. 核心概念

### 2.1 Pipeline 结构

```
Kubeflow Pipeline
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Pipeline DAG                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Component: 数据预处理                                            │
│       │                                                          │
│       ▼                                                          │
│  Component: 模型训练                                              │
│       │                                                          │
│       ├──▶ Component: 评估                                      │
│       │                                                          │
│       ▼                                                          │
│  Component: 模型注册                                              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

Pipeline 定义 (YAML):
───────────────────────────────────────────────────────────────────
apiVersion: kubeflow.org/v1alpha2
kind: Pipeline
metadata:
  name: ml-pipeline
spec:
  steps:
    - name: preprocess
      image: preprocessor:latest
    - name: train
      image: trainer:latest
      dependencies: [preprocess]
    - name: evaluate
      image: evaluator:latest
      dependencies: [train]
```

### 2.2 分布式训练

```
Kubeflow Training Operator
═══════════════════════════════════════════════════════════════════

PyTorch Job:
───────────────────────────────────────────────────────────────────
apiVersion: kubeflow.org/v1
kind: PyTorchJob
metadata:
  name: pytorch-distributed
spec:
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      template:
        spec:
          containers:
          - image: pytorch-trainer:latest
            name: pytorch
    Worker:
      replicas: 2
      template:
        spec:
          containers:
          - image: pytorch-trainer:latest
            name: pytorch
```

---

## 3. 架构设计

### 3.1 系统架构

```
Kubeflow 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Kubeflow 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Kubeflow Dashboard                            │   │
│   │  • Central UI                                            │   │
│   │  • Notebook Spawner                                      │   │
│   │  • Pipeline Dashboard                                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Kubeflow Pipelines                            │   │
│   │  • Pipeline SDK                                           │   │
│   │  • ARGO Workflow引擎                                     │   │
│   │  • Persistence Agent                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐        │
│   │ Training  │       │  Katib   │       │  KServe  │        │
│   │ Operator  │       │ Tuning   │       │ Serving  │        │
│   └───────────┘       └───────────┘       └───────────┘        │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Kubernetes Cluster                             │   │
│   │  • Master Node                                           │   │
│   │  • Worker Nodes (GPU)                                    │   │
│   │  • PVC (持久化存储)                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 使用 Kustomize 安装
git clone https://github.com/kubeflow/manifests.git
cd manifests
while ! kustomize build example | kubectl apply -f -; do echo "Retrying..."; done

# 或使用 Kind (本地开发)
kind create cluster
kubectl apply -k "github.com/kubeflow/pipeline?ref=${VERSION}&timeout=15m"
```

### 4.2 创建 Pipeline

```python
# pipeline.py
import kfp
from kfp import dsl
from kfp.components import load_component_from_file

@kfp.component
def preprocess(data_path: str) -> str:
    """数据预处理"""
    return f"processed_{data_path}"

@kfp.component
def train(data_path: str, epochs: int) -> str:
    """模型训练"""
    return "model.pkl"

@kfp.component
def evaluate(model_path: str, data_path: str) -> float:
    """模型评估"""
    return 0.95

@kfp.pipeline(name="ml-pipeline")
def ml_pipeline(data_path: str, epochs: int = 10):
    """ML Pipeline"""
    preprocessed = preprocess(data_path)
    model = train(preprocessed, epochs)
    metrics = evaluate(model, preprocessed)
```

### 4.3 运行 Pipeline

```bash
# 编译 Pipeline
dsl-compile --py pipeline.py --output pipeline.yaml

# 上传到 Kubeflow
kubectl port-forward svc/ml-pipeline-api 8888:8888

# 使用 SDK 提交
from kfp.client import Client

client = Client(host="http://localhost:8888")
run = client.create_run_from_pipeline_package(
    "pipeline.yaml",
    arguments={"data_path": "s3://data/train.csv", "epochs": 10},
    run_name="my-first-run"
)
```

---

## 5. 高级特性

### 5.1 超参数调优 (Katib)

```yaml
# katib-experiment.yaml
apiVersion: kubeflow.org/v1
kind: Experiment
metadata:
  name: tf-hparam-tuning
spec:
  objective:
    type: maximize
    goal: 0.99
    metricName: accuracy
  algorithm:
    algorithmName: random
  parallelTrialCount: 3
  maxTrialCount: 12
  parameters:
    - name: learningRate
      parameterType: double
      feasibleSpace:
        min: 0.01
        max: 0.1
    - name: batchSize
      parameterType: categorical
      feasibleSpace:
        list: [64, 128, 256]
  trialTemplate:
    trialSpec:
      apiVersion: "kubeflow.org/v1"
      kind: TFJob
      spec:
        tfReplicaSpecs:
          Chief:
            replicas: 1
            template:
              spec:
                containers:
                - image: trainer:latest
                  command: ["python", "train.py"]
```

### 5.2 模型服务 (KServe)

```yaml
# inference-service.yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: ml-model
spec:
  predictor:
    tensorflow:
      storageUri: s3://models/ml-model/
  transformer:
    - name: preprocessor
      image: preprocessor:latest
```

### 5.3 分布式训练

```python
# distributed_training.py
from torch.distributed.run import main

if __name__ == "__main__":
    main([
        "--nnodes", "2",
        "--node_rank", "0",
        "--nproc_per_node", "4",
        "--master_addr", "10.0.0.1",
        "--master_port", "29500",
        "train.py"
    ])
```

---

## 6. 对比与选择

### 6.1 ML 平台对比

| 维度 | Kubeflow | MLflow | Airflow |
|------|----------|--------|---------|
| **K8s 原生** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **ML 专用** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **易用性** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **分布式训练** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ |
| **实验追踪** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| K8s 环境 | Kubeflow |
| 快速原型 | MLflow |
| 数据管道 | Airflow |
| 企业级 | Kubeflow + MLflow |

---

## 参考资源

- [Kubeflow GitHub](https://github.com/kubeflow/kubeflow)
- [Kubeflow 文档](https://www.kubeflow.org/docs/)
- [KServe](https://kserve.github.io/website/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[13_运维/01_AIOps基础/02_AIOps简明指南.md|AIOps-in-nutshell]]
- [[13_运维/02_SRE与可靠性/01_AI_故障应急_Playbook|AI_Incident_Response_Playbook]]
- [[13_运维/README.md|AI_Ops_for_dummy]]
- [[13_运维/README.md|运维 README]]
- [[13_运维/README|README_for_dummy]]
