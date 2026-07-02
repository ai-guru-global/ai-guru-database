---
title: "LakeFS"
category: -concepts
tags: ["mlops", "data-versioning", "data-lake", "data-engineering", "alibaba-cloud"]
summary: "LakeFS 是为对象存储和数据湖提供 Git-like 版本控制的开源工具，支持分支、提交、合并和回滚。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "LakeFS Data Versioning"
relationships:
  - target: "_concepts/data-versioning"
    type: implements
  - target: "_concepts/data-lake"
    type: works_with
sources: []
---

# LakeFS

> **一句话理解**: LakeFS 给数据湖加上了 Git 的能力——分支、提交、合并、回滚，让数据也能版本化管理。

## 核心要点

- **Git-like 接口**: 分支、提交、合并、回滚
- **对象存储兼容**: S3/OSS/GCS/Azure Blob
- **零拷贝分支**: 基于元数据的分支，不复制数据
- **数据质量门禁**: 合并前运行数据验证

## 常见用例

- 训练数据版本化
- A/B 测试数据集分支
- 数据回滚
- 数据血缘追踪

## 阿里云专有云关联

在阿里云专有云环境中，LakeFS 可部署在 ACK 上，底层使用 OSS 作为对象存储。

## Related

- [[_concepts/data-versioning|Data Versioning]]
- [[_concepts/dvc|DVC]]
- [[_concepts/data-pipeline|Data Pipeline]]
