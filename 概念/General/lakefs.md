---
title: "LakeFS"
category: -concepts
tags: ["mlops", "data-versioning", "data-lake", "data-engineering", "alibaba-cloud"]
summary: "LakeFS 是为对象存储和数据湖提供 Git-like 版本控制的开源工具，支持分支、提交、合并和回滚。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "LakeFS Data Versioning"
relationships:
  - target: "概念/data-versioning"
    type: implements
  - target: "概念/data-lake"
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

- [[概念/data-versioning|Data Versioning]]
- [[概念/dvc|DVC]]
- [[概念/data-pipeline|Data Pipeline]]

---

## 2026 lakeFS 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **lakeFS** | 数据湖版本控制 | GA |
| **分支/合并** | Git 式数据分支管理 | GA |
| **原子操作** | 数据操作原子性保证 | GA |
| **S3 兼容** | 兼容 S3 API | GA |
| **CI/CD 集成** | 数据流水线集成 | GA |

## 生产最佳实践

1. **数据版本控制**：数据湖用 lakeFS 版本控制
2. **分支实验**：数据实验用分支隔离
3. **原子提交**：数据变更原子提交
4. **与 Airflow 配合**：lakeFS + Airflow 数据流水线
5. **回滚能力**：数据问题快速回滚
