---
title: "ClearML: 开源 ML 平台"
category: "11-mlops-pipeline"
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: "> **一句话理解**: ClearML 是开源 ML 平台——实验追踪、MLOps、自动化机器学习、模型服务，一站式 ML 解决方案。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Clearml Deep Dive"
  - "ClearML Deep Dive"
  - ClearML_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# ClearML: 开源 ML 平台

> **一句话理解**: ClearML 是开源 ML 平台——实验追踪、MLOps、自动化机器学习、模型服务，一站式 ML 解决方案。

> 📐 **概念与选型方法论**: 实验追踪的原理、ClearML vs MLflow vs W&B 选型，见 [[11_模型运维/04_Experiment_Tracking/Experiment_Tracking_Deep_Dive]]。本文聚焦 ClearML 工具用法。

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
ClearML: 开源 ML 平台
═══════════════════════════════════════════════════════════════════

定位: 开源一站式 ML 平台，覆盖实验追踪到模型服务的全流程

核心理念:
───────────────────────────────────────────────────────────────────
• 开源: Apache 2.0，完全免费
• 完整: 实验 + 流水线 + 部署
• 自动化: AutoML 支持
• 可扩展: 分布式训练
• 集成广: 主流框架支持
• 自托管: 完全私有部署
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **实验追踪** | 参数、指标、工件 |
| **MLOps** | 端到端编排 |
| **自动化** | AutoML/Pipeline |
| **模型服务** | 一键部署 |
| **数据管理** | 数据版本化 |
| **调度器** | 分布式任务 |

### 1.3 支持框架

| 框架 | 支持 |
|------|------|
| PyTorch | ⭐⭐⭐⭐⭐ |
| TensorFlow | ⭐⭐⭐⭐⭐ |
| Keras | ⭐⭐⭐⭐ |
| Scikit-learn | ⭐⭐⭐⭐ |
| HuggingFace | ⭐⭐⭐⭐⭐ |
| JAX | ⭐⭐⭐⭐ |

---

## 2. 核心概念

### 2.1 组件

```
ClearML 组件
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        ClearML 组件                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. ClearML Server                                              │
│  ───────────────────────────────────────────────────────────   │
│  • Web UI: 实验可视化                                          │
│  • API Server: REST API                                        │
│  • File Server: 工件存储                                       │
│                                                                   │
│  2. ClearML Agent                                              │
│  ───────────────────────────────────────────────────────────   │
│  • 执行远程任务                                                │
│  • 资源管理                                                    │
│  • 队列调度                                                    │
│                                                                   │
│  3. ClearML SDK                                                │
│  ───────────────────────────────────────────────────────────   │
│  • Python 客户端                                                │
│  • 自动追踪                                                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 实验结构

| 概念 | 说明 |
|------|------|
| **Project** | 项目组 |
| **Experiment** | 实验 |
| **Task** | 任务 |
| **Artifact** | 输出工件 |
| **Model** | 模型版本 |

---

## 3. 架构设计

### 3.1 系统架构

```
ClearML 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        ClearML 架构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              ClearML SDK                                    │   │
│   │  • clearml.init()                                     │   │
│   │  • 自动追踪                                              │   │
│   │  • 任务管理                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              ClearML Server                                │   │
│   │  • Web UI                                              │   │
│   │  • API Server                                          │   │
│   │  • File Server                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              ClearML Agent                                │   │
│   │  • 远程执行                                              │   │
│   │  • 队列调度                                              │   │
│   │  • GPU 管理                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install clearml
```

### 4.2 基础使用

```python
from clearml import Task

# 初始化
Task.init(
    project_name="my-project",
    task_name="experiment-001"
)

# 训练
for epoch in range(100):
    # 训练代码
    loss = train_step()

    # 记录指标
    Task.current_task().logger.report_scalar(
        title="training",
        series="loss",
        value=loss,
        iteration=epoch
    )
```

### 4.3 自动化训练

```python
from clearml.automation import TrainTask

# 注册训练任务
class MyTrainingTask(TrainTask):
    def __init__(self):
        super().__init__()
        self.train_config = None

    def training_main(self, config=None):
        # 训练逻辑
        model = build_model(config)
        train(model)
        return model

# 创建任务
task = MyTrainingTask()
task.start()
```

### 4.4 模型服务

```python
from clearml Serving

# 部署模型
clearml-serving add \
    --model_id model_id \
    --endpoint "predict" \
    --engine torch

# 推理
response = requests.post(
    "http://localhost:8080/predict",
    json={"input": data}
)
```

---

## 5. 高级特性

### 5.1 Pipeline

```python
from clearml.pipeline import PipelineStep

class PreprocessStep(PipelineStep):
    def execute(self, inputs):
        return preprocess(inputs)

class TrainStep(PipelineStep):
    def execute(self, inputs):
        return train(inputs)

# 定义 Pipeline
pipeline = Pipeline()
pipeline.add_step(PreprocessStep())
pipeline.add_step(TrainStep())
pipeline.execute()
```

### 5.2 AutoML

```python
from clearml.automation.auto import AutoML

automl = AutoML(
    project="automl-project",
    task_name="hpo"
)

automl.search(
    x_train=X_train,
    y_train=y_train,
    metric="accuracy",
    direction="maximize",
    trials=100
)
```

---

## 6. 对比与选择

### 6.1 ML 平台对比

| 维度 | ClearML | MLflow | Kubeflow |
|------|---------|--------|----------|
| **开源** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **功能完整** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **模型部署** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 一站式开源 | ClearML |
| 简单实验追踪 | MLflow |
| K8s 生产 | Kubeflow |

---

## 参考资源

- [ClearML GitHub](https://github.com/allegroai/clearml)
- [ClearML 文档](https://clear.ml/docs/)
- [ClearML Showcase](https://clear.ml/showcase)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[13_运维/01_AIOps_Fundamentals/AIOps-in-nutshell.md|AIOps-in-nutshell]]
- [[13_运维/02_SRE_Reliability/AI_Incident_Response_Playbook|AI_Incident_Response_Playbook]]
- [[13_运维/01_AIOps_Fundamentals/AI_Ops_for_dummy.md|AI_Ops_for_dummy]]
- [[13_运维/README.md|运维 README]]
- [[13_运维/README_for_dummy.md|README_for_dummy]]
