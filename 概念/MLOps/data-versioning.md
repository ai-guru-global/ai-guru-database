---
title: "Data Versioning"
category: -concepts
tags: ["mlops", "data-engineering", "version-control", "reproducibility", "lineage"]
summary: "Data Versioning（数据版本化）是指对数据集、特征和模型 Artifact 进行版本管理，确保 ML 实验可复现。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "数据版本化"
  - "Data Version Control"
relationships:
  - target: "概念/mlops"
    type: part_of
  - target: "概念/dvc"
    type: implemented_by
  - target: "概念/lakefs"
    type: implemented_by
sources: []
---

# Data Versioning（数据版本化）

> **一句话理解**: 数据版本化 = 让数据集也能像代码一样「回到某个版本」，保证实验可复现、问题可追溯。

## 定义

Data Versioning 是对数据集、特征表、模型 Artifact 进行版本管理的实践，确保任何一次 ML 实验都能精确复现当时的数据状态。它是 MLOps 可复现性的基石。

## 为什么需要数据版本化

| 问题 | 没有版本化 | 有版本化 |
|------|------------|----------|
| 实验复现 | “上次用的哪个数据？” | 精确回溯到 commit |
| 数据回滚 | 重新采集/备份恢复 | 一键 checkout |
| 多人协作 | 文件复制冲突 | 分支/合并 |
| 审计追溯 | 无法确认数据来源 | 完整 lineage |

## 工具对比（2026）

| 工具 | 原理 | 适用场景 | 优势 |
|------|------|----------|------|
| **DVC** | .dvc 指针 + 远程存储 | 中小团队、文件级 | Git 原生集成 |
| **LakeFS** | 对象存储上的 Git | 数据湖、大规模 | 分支/合并/CI |
| **Delta Lake** | 事务日志 | Spark 生态 | ACID + 时间旅行 |
| **Git-LFS** | Git 大文件扩展 | 小数据集 | 零学习成本 |
| **HuggingFace Datasets** | Hub 托管 | NLP/LLM 数据集 | 社区生态 |
| **Pachyderm** | 内容寻址 + 管道 | 企业级 MLOps | 自动 lineage |

## 核心原则

1. **数据 + 代码 + 模型 三位一体**：同一 commit 包含三者
2. **不可变性**：版本化后的数据不应被修改
3. **Lineage 追溯**：从模型能追到原始数据
4. **存储分离**：元数据在 Git，实际数据在对象存储

## 生产最佳实践

1. **训练前必须打 tag**：`dvc tag v1.2` 或 LakeFS branch
2. **CI 中验证数据版本**：确保训练用的是正确版本
3. **大文件用对象存储**：S3/OSS/GCS，不要放 Git
4. **定期清理旧版本**：避免存储成本失控
5. **与实验跟踪联动**：MLflow/W&B 记录数据版本 hash

## Related

- [[概念/dvc|DVC]]
- [[概念/lakefs|LakeFS]]
- [[概念/data-pipeline|Data Pipeline]]
- [[概念/MLOps/evidently|Evidently]] — 数据质量监控
