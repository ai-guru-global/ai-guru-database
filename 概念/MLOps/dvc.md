---
title: "DVC"
category: -concepts
tags: ["mlops", "data-versioning", "git", "data-engineering", "alibaba-cloud"]
summary: "DVC（Data Version Control）是面向 ML 项目的开源数据版本控制工具，与 Git 配合管理大型数据集、模型和实验。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Data Version Control"
relationships:
  - target: "概念/data-versioning"
    type: implements
  - target: "概念/git"
    type: works_with
sources: []
---

# DVC

> **一句话理解**: DVC 就是 Git 的「数据伴侣」，让大文件和数据集也能像代码一样版本化。

## 核心要点

- **Git 友好**: 用 `.dvc` 文件追踪大文件，实际数据存在远程存储
- **远程存储**: 支持 S3/OSS/GS/Azure/SSH/HDFS
- **流水线**: 定义数据 → 特征 → 模型的可复现流水线
- **实验追踪**: 与 Git 分支结合管理实验

## 常用命令

```bash
dvc init
dvc add data/train.csv
dvc remote add -d myremote oss://mybucket/dvc
dvc push
dvc pull
```

## 阿里云专有云关联

在阿里云专有云环境中，DVC 远程存储可配置为 OSS，实现训练数据与模型的版本化存储。

## Related

- [[概念/data-versioning|Data Versioning]]
- [[概念/lakefs|LakeFS]]
- [[概念/data-pipeline|Data Pipeline]]
