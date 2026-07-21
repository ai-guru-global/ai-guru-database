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
---

# DVC（Data Version Control）

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
