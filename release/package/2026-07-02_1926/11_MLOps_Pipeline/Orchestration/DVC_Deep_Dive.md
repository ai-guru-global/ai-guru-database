---
title: "DVC: 数据版本控制"
category: "11-mlops-pipeline"
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: "> **一句话理解**: DVC 是数据版本控制工具——用 Git 的工作流管理数据和模型，追踪数据集变化、支持数据管道、连接云存储，ML 数据的 Git。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Dvc Deep Dive"
  - "DVC Deep Dive"
  - DVC_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# DVC: 数据版本控制

> **一句话理解**: DVC 是数据版本控制工具——用 Git 的工作流管理数据和模型，追踪数据集变化、支持数据管道、连接云存储，ML 数据的 Git。

> 📐 **概念与选型方法论**: 数据版本控制的原理、DVC vs LakeFS vs Delta Lake 对比，见 [[MLOps/Orchestration/Data_Versioning_DVC_LakeFS]]。本文聚焦 DVC 工具用法。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
DVC: 数据版本控制
═══════════════════════════════════════════════════════════════════

定位: 面向 ML 的数据版本控制工具，用 Git 工作流管理数据和模型

核心理念:
───────────────────────────────────────────────────────────────────
• 数据版本: 像代码一样版本化数据
• 数据管道: 定义可复现的数据处理流程
• 云存储: 连接 S3/GCS/Azure
• 实验追踪: 参数、指标、对比
• 可复现: 保证实验可复现
• Git 兼容: 与 Git 无缝集成
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **数据版本** | 大文件版本化、增量存储 |
| **数据管道** | DAG 定义数据处理 |
| **云存储** | S3/GCS/Azure/阿里云 |
| **实验对比** | 参数、指标对比 |
| **可复现** | 一键重现实验 |
| **CML** | CI/CD 机器学习 |

### 1.3 核心概念

| 概念 | 说明 |
|------|------|
| **DVC File** | `.dvc` 文件，指向数据 |
| **DVC Cache** | 本地缓存，节省空间 |
| **Remote** | 云端存储 |
| **Pipeline** | 数据处理 DAG |
| **Params** | 参数文件 |

---

## 2. 核心概念

### 2.1 数据版本化

```
DVC 数据版本化
═══════════════════════════════════════════════════════════════════

Git 工作流程:
───────────────────────────────────────────────────────────────────

本地修改 → git add → git commit → git push
    │                        │
    ▼                        ▼
  DVC                    DVC Remote
追踪变更                  存储数据

┌──────────────────────────────────────────────────────────────────┐
│                        .dvc 文件结构                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  outs:                                                          │
│  - md5: a1b2c3d4e5f6...  # 数据文件的 hash                      │
│    path: data/train.csv   # 相对路径                            │
│    nfiles: 1000          # 文件数量 (目录时)                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 数据管道

```
DVC Pipeline
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        DVC Pipeline DAG                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  prepare.dvc                                                    │
│       │                                                          │
│       ▼                                                          │
│  features.dvc ──┐                                                │
│       │         │                                                │
│       ▼         ▼                                                │
│  train.dvc ─────┘                                                │
│       │                                                          │
│       ▼                                                          │
│  evaluate.dvc                                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

dvc.yaml:
───────────────────────────────────────────────────────────────────
stages:
  prepare:
    cmd: python prepare.py
    deps: [data/raw]
    outs: [data/features]

  train:
    cmd: python train.py
    deps: [data/features, model.py]
    params: [train.epochs, train.lr]
    outs: [models/model.pkl]
```

---

## 3. 架构设计

### 3.1 系统架构

```
DVC 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        DVC 架构                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Git Repository                               │   │
│   │  ├── .git/ (代码版本)                                   │   │
│   │  └── .dvc/ (DVC 配置)                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              DVC Cache                                   │   │
│   │  ~/.cache/dvc/                                          │   │
│   │  ├── files/  (数据内容)                                 │   │
│   │  └── links/  (引用计数)                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Remote Storage                               │   │
│   │  ├── S3 / GCS / Azure Blob                             │   │
│   │  └── HDFS / SSH / Local                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 存储机制

```
DVC 存储机制
═══════════════════════════════════════════════════════════════════

1. 添加数据:
   data.csv → 计算 MD5 → 存储到 cache → 创建 .dvc 文件

2. 推送远程:
   cache → 压缩 → 上传到 Remote

3. 检出:
   Remote → 下载到 cache → 链接到工作目录

4. 切换版本:
   git checkout <commit> → dvc checkout → 恢复数据
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install dvc

# 初始化
git init
dvc init
```

### 4.2 数据版本化

```bash
# 添加数据文件
dvc add data/train.csv

# 自动创建 data/train.csv.dvc
git add data/train.csv.dvc
git commit -m "Add training data v1"
git push

# 推送到远程存储
dvc push
```

### 4.3 Python 工作流

```python
import dvc.api
import pandas as pd

# 读取版本化数据
with dvc.api.open("data/train.csv", remote="myremote", version="v1") as f:
    df = pd.read_csv(f)

# 或使用 DVC Python API
from dvc.repo import Repo

repo = Repo(".")
with repo.open(
    "data/train.csv",
    rev="v1"  # 指定版本
) as f:
    df = pd.read_csv(f)
```

### 4.4 定义管道

```bash
# 创建 dvc.yaml
dvc stage add \
  -n prepare \
  -d data/raw \
  -o data/features \
  python prepare.py

dvc stage add \
  -n train \
  -d data/features \
  -d model.py \
  -o models/model.pkl \
  python train.py --lr 0.001
```

### 4.5 运行管道

```bash
# 执行整个管道
dvc repro

# 查看 DAG
dvc dag

# 只运行特定阶段
dvc repro train
```

---

## 5. 高级用法

### 5.1 参数管理

```yaml
# params.yaml
train:
  epochs: 100
  lr: 0.001
  batch_size: 32

model:
  hidden_size: 256
  num_layers: 4
```

```python
# 在代码中使用
from dvc import params

params.load("params.yaml")
print(params.train.lr)  # 0.001
```

```bash
# 运行并传递参数
dvc repro -S train.epochs=50
```

### 5.2 实验对比

```bash
# 运行实验
dvc exp run --name "baseline" -S train.lr=0.001
dvc exp run --name "high-lr" -S train.lr=0.01

# 对比实验
dvc exp show
dvc exp diff baseline high-lr
```

### 5.3 CML (CI/CD for ML)

```yaml
# .github/workflows/ml.yaml
name: ml-pipeline

on: [push]

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: iterative/setup-dvc@v1
      - uses: iterative/cml@v1
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Train model
        run: |
          dvc repro
          dvc push

      - name: Report metrics
        run: |
          cat metrics.txt | cml send-comment
```

---

## 6. 对比与选择

### 6.1 数据版本工具对比

| 维度 | DVC | LakeFS | Dolt |
|------|-----|--------|------|
| **Git 集成** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **数据规模** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **云存储** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **ML 管道** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| Git 团队工作流 | DVC |
| 数据湖管理 | LakeFS |
| 数据库版本化 | Dolt |
| ML 实验追踪 | DVC + MLflow |

---

## 参考资源

- [DVC GitHub](https://github.com/iterative/dvc)
- [DVC 文档](https://dvc.org/doc)
- [DVC Course](https://iterative.ai/courses/dvc-fundamentals/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[AI运维/AIOps-in-nutshell.md|AIOps-in-nutshell]]
- [[AI运维/SRE_Reliability/AI_Incident_Response_Playbook|AI_Incident_Response_Playbook]]
- [[AI运维/AI_Ops_for_dummy.md|AI_Ops_for_dummy]]
- [[AI运维/README.md|AI运维 README]]
- [[AI运维/README_for_dummy.md|README_for_dummy]]
