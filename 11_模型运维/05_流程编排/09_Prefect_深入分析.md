---
title: "Prefect: ML 数据流水线编排"
category: "11-mlops-pipeline"
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: "> **一句话理解**: Prefect 是 Python 原生的数据流水线编排——任务调度、错误重试、可视化监控，ML 数据的 workflow 引擎。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Prefect Deep Dive"
  - Prefect_Deep_Dive
sources: []

name_zh: "Prefect: ML 数据流水线编排"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Prefect: ML 数据流水线编排

> 中文简称：Prefect: ML 数据流水线编排

> **一句话理解**: Prefect 是 Python 原生的数据流水线编排——任务调度、错误重试、可视化监控，ML 数据的 workflow 引擎。

> 📐 **概念与选型方法论**: 流水线编排的原理、Prefect vs Airflow vs Dagster 选型，见 [[11_模型运维/05_流程编排/Data_Pipeline_Orchestration]]。本文聚焦 Prefect 工具用法。

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
Prefect: ML 数据流水线编排
═══════════════════════════════════════════════════════════════════

定位: Python 原生的数据工作流编排平台，简化 ML 数据管道的构建和调度

核心理念:
───────────────────────────────────────────────────────────────────
• Python 优先: 纯 Python API
• 任务调度: cron/interval 调度
• 错误重试: 自动重试机制
• 可视化: 流程执行监控
• 云原生: 分布式执行
• 集成: Spark/Dask/Kubernetes
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Python API** | 纯 Python 定义流 |
| **任务调度** | Cron/Interval |
| **错误重试** | 自动重试 + 策略 |
| **缓存** | 基于 hash 的缓存 |
| **并行** | Dask/Spark 集成 |
| **监控** | 执行历史可视化 |

### 1.3 与 Airflow 对比

| 维度 | Prefect | Airflow |
|------|---------|---------|
| **学习曲线** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Python 原生** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **任务依赖** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **调度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **监控 UI** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 2. 核心概念

### 2.1 Flow 和 Task

```
Prefect 核心概念
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Flow 和 Task                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Flow (工作流):                                                  │
│  ├── 整个数据处理流程                                            │
│  ├── 定义任务之间的依赖                                          │
│  └── 整个流程的上下文                                            │
│                                                                   │
│  Task (任务):                                                    │
│  ├── 单一功能单元                                                │
│  ├── 可独立执行                                                  │
│  └── 可配置重试/缓存                                             │
│                                                                   │
│  示例:                                                           │
│  @flow(name="ml-pipeline")                                      │
│  def train_model():                                              │
│      data = fetch_data()        # Task                         │
│      features = preprocess(data) # Task                         │
│      model = train(features)     # Task                         │
│      evaluate(model)             # Task                         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 执行模式

| 模式 | 说明 |
|------|------|
| **Local** | 本地执行 |
| **Dask** | 分布式计算 |
| **Ray** | Ray 集群 |
| **K8s** | Kubernetes |
| **Cloud** | Prefect Cloud |

---

## 3. 架构设计

### 3.1 系统架构

```
Prefect 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Prefect 架构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Python SDK                                    │   │
│   │  • @flow, @task 装饰器                                 │   │
│   │  • Prefect Client                                       │   │
│   │  • Result Handler                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Prefect Server / Cloud                        │   │
│   │  • Flow Metadata                                         │   │
│   │  • Run Scheduler                                        │   │
│   │  • Execution Engine                                     │   │
│   │  • Result Storage                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Executor Layer                                │   │
│   │  • Local Process                                        │   │
│   │  • Dask/Distributed                                     │   │
│   │  • Ray                                                  │   │
│   │  • Kubernetes                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install prefect
```

### 4.2 基础使用

```python
from prefect import flow, task

@task
def fetch_data():
    """获取数据"""
    return {"users": 1000, "transactions": 50000}

@task
def preprocess(data):
    """数据预处理"""
    return {**data, "cleaned": True}

@task(retries=3)
def train_model(data):
    """模型训练"""
    if data.get("users", 0) < 100:
        raise ValueError("数据不足")
    return {"model_score": 0.95}

@flow(name="ml-training-pipeline")
def train_pipeline():
    """ML 训练流水线"""
    data = fetch_data()
    clean_data = preprocess(data)
    model = train_model(clean_data)
    return model

# 执行
if __name__ == "__main__":
    result = train_pipeline()
    print(f"训练完成: {result}")
```

### 4.3 调度

```python
from prefect.orion.schedules import CronSchedule

# 创建定时 flow
@flow(
    name="daily-training",
    schedule=CronSchedule(cron="0 2 * * *")  # 每天凌晨 2 点
)
def daily_pipeline():
    data = fetch_data()
    # ...
```

### 4.4 监控

```bash
# 启动 Prefect Server
prefect orion start

# 访问 UI
# http://localhost:4200

# 运行 flow
python train_pipeline.py
```

---

## 5. 高级特性

### 5.1 缓存

```python
from prefect.tasks import task

@task(cache_key_fn=lambda *args, **kwargs: kwargs.get("data_hash"))
def expensive_computation(data_hash: str):
    """带缓存的任务"""
    # 昂贵的计算
    return result
```

### 5.2 并行执行

```python
from prefect_dask import DaskTaskRunner

@flow(
    name="parallel-pipeline",
    task_runner=DaskTaskRunner()
)
def parallel_pipeline():
    # 并行执行独立任务
    results = fetch_data.map(range(10))
    # ...
```

### 5.3 错误处理

```python
@task(
    retries=2,
    retry_delay_seconds=60,
    on_failure=[send_alert]
)
def unstable_task():
    """可能失败的任务"""
    # ...
```

---

## 6. 对比与选择

### 6.1 工作流编排对比

| 维度 | Prefect | Airflow | Dagster |
|------|---------|---------|---------|
| **Python 原生** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **学习曲线** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **ML 集成** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **调度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **社区** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| Python ML 管道 | Prefect |
| 通用 ETL | Airflow |
| 数据平台 | Dagster |
| 快速上手 | Prefect |

---

## 参考资源

- [Prefect GitHub](https://github.com/PrefectHQ/prefect)
- [Prefect 文档](https://docs.prefect.io/)
- [Prefect Cloud](https://www.prefect.io/cloud/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[13_运维/01_AIOps基础/02_AIOps简明指南.md|AIOps-in-nutshell]]
- [[13_运维/02_SRE与可靠性/01_AI_故障应急_Playbook|AI_Incident_Response_Playbook]]
- [[13_运维/01_AIOps基础/AI_Ops_for_dummy.md|AI_Ops_for_dummy]]
- [[13_运维/README.md|运维 README]]
- [[13_运维/README|README_for_dummy]]
