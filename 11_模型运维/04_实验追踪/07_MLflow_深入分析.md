---
title: "MLflow: 机器学习生命周期管理"
category: "11-mlops-pipeline"
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: "> **一句话理解**: MLflow 是 Databricks 的机器学习生命周期管理平台——实验追踪、模型注册、特征存储、模型服务，开源 ML 平台的事实标准。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Mlflow Deep Dive"
  - "MLflow Deep Dive"
  - MLflow_Deep_Dive
sources: []

name_zh: "MLflow: 机器学习生命周期管理"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# MLflow: 机器学习生命周期管理

> 中文简称：MLflow: 机器学习生命周期管理

> **一句话理解**: MLflow 是 Databricks 的机器学习生命周期管理平台——实验追踪、模型注册、特征存储、模型服务，开源 ML 平台的事实标准。

> 📐 **概念与选型方法论**: 实验追踪的原理、MLflow vs W&B vs Neptune 选型，见 [[11_模型运维/04_实验追踪/Experiment_Tracking_Deep_Dive]]；模型注册概念见 [[11_模型运维/04_实验追踪/09_模型_注册中心_and_Cards_深入分析]]。本文聚焦 MLflow 工具用法。

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
MLflow: 机器学习生命周期管理
═══════════════════════════════════════════════════════════════════

定位: 开源机器学习生命周期管理平台，覆盖实验到部署全流程

核心理念:
───────────────────────────────────────────────────────────────────
• 开放: Apache 2.0，完全开源
• 平台无关: 任意 ML 框架
• 可扩展: 插件生态丰富
• 企业级: Databricks 商业支持
• 全流程: 实验→注册→部署
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **实验追踪** | 参数、指标、工件 |
| **模型注册** | 版本管理、阶段转换 |
| **项目** | 可复现实验 |
| **模型服务** | REST API 部署 |
| **特征存储** | 特征复用、共享 |
| **提示词管理** | LLM 提示词版本 |

### 1.3 组件概览

| 组件 | 功能 |
|------|------|
| **MLflow Tracking** | 实验追踪 |
| **MLflow Models** | 模型打包 |
| **MLflow Model Registry** | 模型注册 |
| **MLflow Projects** | 可复现实验 |
| **MLflow Deployment** | 模型服务 |
| **MLflow Gateway** | LLMs 路由 |

---

## 2. 核心概念

### 2.1 实验追踪

```
MLflow 实验追踪
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        MLflow Tracking                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Run (一次实验运行)                                               │
│  ├── Parameters: {"learning_rate": 0.001, "epochs": 100}       │
│  ├── Metrics: {"accuracy": 0.95, "loss": 0.05}                  │
│  ├── Artifacts: "./models/model.pt", "./plots/confusion.png"    │
│  ├── Tags: {"env": "prod", "team": "ml"}                        │
│  └── Metadata: start_time, end_time, status                     │
│                                                                   │
│  Experiment (实验组)                                              │
│  └── Runs: [Run1, Run2, Run3, ...]                              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 模型注册表

```
Model Registry 生命周期
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                     Model Stage Lifecycle                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  None → Staging → Production → Archived                          │
│                                                                   │
│  Stage 说明:                                                     │
│  • None: 新注册                                                  │
│  • Staging: 测试环境                                             │
│  • Production: 生产环境                                          │
│  • Archived: 归档                                                │
│                                                                   │
│  版本管理:                                                        │
│  Model: "llm-sentiment"                                         │
│  ├── Version 1: Staging                                         │
│  ├── Version 2: Production ← 当前生产                           │
│  └── Version 3: None (新训练)                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. 架构设计

### 3.1 系统架构

```
MLflow 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        MLflow 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              MLflow Client (Python/R/Java/REST)          │   │
│   │  • Tracking API                                         │   │
│   │  • Model Registry API                                   │   │
│   │  • Deployment API                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              MLflow Tracking Server                      │   │
│   │  • SQLite / PostgreSQL / Databricks                     │   │
│   │  • Artifact Store (S3/GCS/Azure Blob)                    │   │
│   │  • REST API                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Backend Store                               │   │
│   │  • Experiments                                          │   │
│   │  • Runs                                                │   │
│   │  • Params/Metrics                                      │   │
│   │  • Tags                                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 追踪流程

```
MLflow 追踪流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 初始化 Tracking Server                                       │
│ ───────────────────────────────────────────────────────────────  │
│ mlflow.set_tracking_uri("http://localhost:5000")                 │
│ mlflow.set_experiment("my_experiment")                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: 记录 Run                                                    │
│ ───────────────────────────────────────────────────────────────  │
│ with mlflow.start_run():                                          │
│     mlflow.log_param("lr", 0.001)                               │
│     mlflow.log_metric("acc", 0.95)                              │
│     mlflow.log_artifact("model.pt")                             │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 查看结果                                                     │
│ ───────────────────────────────────────────────────────────────  │
│ mlflow ui  # 启动 Web UI                                          │
│ http://localhost:5000                                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install mlflow
```

### 4.2 实验追踪

```python
import mlflow
import mlflow.sklearn
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# 设置追踪服务器
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("iris-classification")

# 训练并追踪
with mlflow.start_run(run_name="rf_baseline"):
    # 加载数据
    from sklearn.datasets import load_iris
    iris = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(
        iris.data, iris.target, test_size=0.2
    )

    # 记录参数
    mlflow.log_param("model_type", "RandomForest")
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 5)

    # 训练
    model = RandomForestClassifier(n_estimators=100, max_depth=5)
    model.fit(X_train, y_train)

    # 评估
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    # 记录指标
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("f1", accuracy)  # 简化

    # 记录模型
    mlflow.sklearn.log_model(model, "model")

print(f"Accuracy: {accuracy}")
```

### 4.3 模型注册

```python
# 注册模型
model_uri = "runs:/<run_id>/model"
model_name = "iris-classifier"

# 创建注册
mlflow.register_model(model_uri, model_name)

# 过渡到生产
client = mlflow.MlflowClient()
client.transition_model_version_stage(
    name=model_name,
    version=1,
    stage="Production"
)
```

### 4.4 模型服务

```bash
# 启动服务
mlflow models serve -m "models:/iris-classifier/Production" -p 5001

# 预测
curl -X POST -H "Content-Type: application/json" \
  -d '{"data": ``[ [5.1, 3.5, 1.4, 0.2] ]``}' \
  http://localhost:5001/invocations
```

---

## 5. 高级特性

### 5.1 自动日志

```python
# 使用 autolog 自动记录
mlflow.autolog()

with mlflow.start_run():
    # 自动记录所有参数、指标、模型
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    # mlflow 自动记录
```

### 5.2 提示词管理 (LLM)

```python
# MLflow AI Gateway - 提示词版本化
from mlflow.deployments import DeploymentClient

client = DeploymentClient("http://localhost:5000")

# 创建提示词
prompt = """
给定用户评论: {review}
判断情感: positive / negative / neutral
"""

# 版本化
client.create_endpoint(
    name="sentiment-analysis",
    prompt_template=prompt,
    llm="openai/gpt-4"
)
```

### 5.3 特征存储

```python
# MLflow Feature Engineering
from mlflow.models.feature import Feature

# 定义特征
features = [
    Feature(name="user_age", type="integer"),
    Feature(name="user_history", type="float"),
]

# 保存特征
mlflow.log_feature_store(
    name="user_features",
    features=features,
    source="features.csv"
)
```

---

## 6. 对比与选择

### 6.1 ML 平台对比

| 维度 | MLflow | Weights & Biases | Neptune | Kubeflow |
|------|---------|-------------------|---------|----------|
| **实验追踪** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **模型部署** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **自托管** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **成本** | 免费 | 按人收费 | 按团队 | 免费 |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 自托管 | MLflow |
| 快速原型 | Weights & Biases |
| 企业级 | MLflow + Kubeflow |
| 个人项目 | Weights & Biases / Neptune |

---

## 参考资源

- [MLflow GitHub](https://github.com/mlflow/mlflow)
- [MLflow 文档](https://mlflow.org/docs/latest/index.html)
- [MLflow Model Registry](https://mlflow.org/docs/latest/model-registry.html)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[13_运维/01_AIOps基础/02_AIOps简明指南.md|AIOps-in-nutshell]]
- [[13_运维/02_SRE与可靠性/01_AI_故障应急_Playbook|AI_Incident_Response_Playbook]]
- [[13_运维/README.md|AI_Ops_for_dummy]]
- [[13_运维/README.md|运维 README]]
- [[13_运维/README|README_for_dummy]]
