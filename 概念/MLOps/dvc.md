---
title: "DVC"
category: -concepts
tags: ["mlops", "data-versioning", "git", "data-engineering", "pipeline", "experiment-tracking"]
summary: "DVC（Data Version Control）是面向 ML 项目的开源数据版本控制工具，与 Git 配合管理大型数据集、模型和实验。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Data Version Control"
relationships:
  - target: "概念/data-versioning"
    type: implements
  - target: "概念/git"
    type: works_with
sources: []
name_zh: "数据版本控制"
---

# DVC（Data Version Control）

> 中文简称：数据版本控制

> **一句话理解**: DVC 是 Git 的「数据伴侣」，让大文件和数据集也能像代码一样版本化。

## 定义

DVC 是开源的 ML 数据版本控制工具，通过 `.dvc` 指针文件追踪大文件，实际数据存储在远程（S3/OSS/GCS），与 Git 无缝集成实现数据+代码+模型的统一版本管理。

## 核心工作流

```bash
# 初始化
dvc init

# 追踪数据文件
dvc add data/train.parquet
# 生成 data/train.parquet.dvc（指针文件，提交到 Git）

# 配置远程存储
dvc remote add -d myremote s3://mybucket/dvc-store

# 推送/拉取数据
dvc push    # 上传到远程
dvc pull    # 下载到本地

# 切换版本
git checkout v1.0 -- data/train.parquet.dvc
dvc pull    # 拉取对应版本数据
```

## 核心功能

| 功能 | 说明 |
|------|------|
| **数据版本化** | .dvc 文件追踪，Git 管理元数据 |
| **Pipeline** | `dvc.yaml` 定义可复现流水线 |
| **实验追踪** | `dvc exp run` 管理超参实验 |
| **指标对比** | `dvc metrics diff` 对比实验结果 |
| **远程存储** | S3/OSS/GCS/Azure/SSH/HDFS |

## Pipeline 示例

```yaml
# dvc.yaml
stages:
  preprocess:
    cmd: python preprocess.py
    deps: [data/raw.csv, preprocess.py]
    outs: [data/processed.parquet]
  train:
    cmd: python train.py
    deps: [data/processed.parquet, train.py]
    outs: [models/model.pkl]
    metrics: [metrics/accuracy.json]
```

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **当前版本** | DVC 3.x |
| **云存储** | S3/GCS/Azure/OSS/HDFS 全支持 |
| **与 MLflow 对比** | DVC 偏数据版本，MLflow 偏实验跟踪 |
| **与 LakeFS 对比** | DVC 文件级，LakeFS 数据湖级 |
| **社区** | GitHub 14k+ stars，活跃维护 |

## 生产最佳实践

1. **`.gitignore` 排除数据文件**：DVC 自动处理
2. **CI 中 `dvc pull`**：确保训练环境数据一致
3. **用 Pipeline 而非手动执行**：保证可复现
4. **远程存储用对象存储**：S3/OSS，不要用本地磁盘
5. **定期 `dvc gc`**：清理未引用的旧版本数据

## Related

- [[概念/data-versioning|Data Versioning]]
- [[概念/lakefs|LakeFS]]
- [[概念/data-pipeline|Data Pipeline]]
- [[概念/MLOps/evidently|Evidently]] — 数据质量监控

## 2026 DVC 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **DVC 3.0+** | 新架构，性能提升 | GA |
| **DVC Studio** | 托管实验跟踪平台 | GA |
| **CML** | 持续机器学习 (CI/CD for ML) | GA |
| **MLEM** | 模型部署 | GA |
| **多后端存储** | S3/GCS/Azure/SSH | GA |

## 架构：数据版本控制流程

```
数据文件 → dvc add → .dvc 文件 (Git 跟踪) + 缓存
                          ↓
                    dvc push → 远程存储 (S3/GCS)
                          ↓
                    dvc pull → 恢复数据
```

## 命令示例

```bash
# 初始化 DVC
dvc init
dvc remote add -d myremote s3://my-bucket/dvc-store

# 跟踪数据文件
dvc add data/train.csv
git add data/train.csv.dvc .gitignore
git commit -m "Add training data v1"

# 推送到远程
dvc push

# 创建管道
dvc stage add -n preprocess \
  -d data/raw.csv \
  -o data/processed.csv \
  python preprocess.py

dvc stage add -n train \
  -d data/processed.csv \
  -o models/model.pkl \
  python train.py

# 运行管道
dvc repro

# 实验跟踪
dvc exp run --set-param lr=0.001
dvc exp show
```

## dvc.yaml 示例

```yaml
stages:
  preprocess:
    cmd: python preprocess.py
    deps:
      - data/raw.csv
      - preprocess.py
    outs:
      - data/processed.csv
  train:
    cmd: python train.py
    deps:
      - data/processed.csv
      - train.py
    params:
      - lr
      - epochs
    outs:
      - models/model.pkl
    metrics:
      - metrics.json:
          cache: false
```

## 延伸阅读

- [[概念/MLOps/data-versioning|Data Versioning]] — 数据版本控制概念
- [[概念/MLOps/experiment-tracking|Experiment Tracking]] — 实验跟踪
- [[概念/MLOps/model-registry|Model Registry]] — 模型注册

> ℹ️ DVC 是开源数据版本控制工具，将数据、模型、管道纳入 Git 工作流，实现 ML 项目的可复现性。

## 生产最佳实践

1. **远程存储**：配置 S3/GCS 远程存储
2. **管道定义**：用 dvc.yaml 定义管道
3. **实验跟踪**：用 dvc exp 跟踪实验
4. **与 Git 配合**：.dvc 文件纳入 Git
5. **缓存配置**：配置本地缓存加速
6. **团队协作**：共享远程存储
7. **CI 集成**：CI 中运行 dvc repro
8. **数据血缘**：跟踪数据转换历史

## 检查清单

- [ ] DVC 已初始化
- [ ] 远程存储已配置
- [ ] 数据文件已跟踪
- [ ] 管道已定义
- [ ] .dvc 文件已纳入 Git
