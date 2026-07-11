---
title: "Data Versioning"
category: -concepts
tags: ["mlops", "data-engineering", "version-control", "reproducibility", "alibaba-cloud"]
summary: "Data Versioning（数据版本化）是指对数据集、特征和模型 Artifact 进行版本管理，确保 ML 实验可复现。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "数据版本化"
relationships:
  - target: "概念/mlops"
    type: part_of
  - target: "概念/dvc"
    type: implemented_by
  - target: "概念/lakefs"
    type: implemented_by
sources: []
---

# Data Versioning

> **一句话理解**: 数据版本化就是让数据集也能像代码一样「回到某个版本」，保证实验可复现。

## 核心要点

- **可复现性**: 每次实验都能追溯到使用的数据版本
- **协作**: 多人共享数据集版本
- **回滚**: 数据出问题时能回退
- **工具**: DVC、LakeFS、Delta Lake、Git-LFS

## 与代码版本控制对比

| Git | 数据版本化 |
|-----|-----------|
| 追踪代码 | 追踪数据集 |
| 轻量 diff | 大文件 diff |
| 本地存储 | 通常依赖远程存储 |

## 阿里云专有云关联

在阿里云专有云环境中，数据版本化常与 OSS、MaxCompute、DataWorks 结合使用。

## Related

- [[概念/dvc|DVC]]
- [[概念/lakefs|LakeFS]]
- [[概念/data-pipeline|Data Pipeline]]
