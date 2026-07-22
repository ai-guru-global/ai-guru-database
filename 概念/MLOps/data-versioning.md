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

## 2026 数据版本控制生态

| 工具 | 特点 | 适用 | 状态 |
|------|------|------|------|
| **DVC** | Git 扩展，大文件 | 通用 | GA |
| **LakeFS** | 数据湖版本控制 | 数据湖 | GA |
| **Delta Lake** | ACID 事务 | 数据湖 | GA |
| **Pachyderm** | 数据版本 + 管道 | 企业 | GA |
| **HuggingFace Datasets** | 数据集版本 | NLP | GA |

## 数据版本控制架构

```
数据版本控制:
┌─────────────────────────────────────────┐
│  Git: 代码版本控制                      │
├─────────────────────────────────────────┤
│  DVC/LakeFS: 数据版本控制              │
├─────────────────────────────────────────┤
│  MLflow/W&B: 实验版本控制              │
├─────────────────────────────────────────┤
│  模型仓库: 模型版本控制                │
└─────────────────────────────────────────┘
```

## DVC 使用示例

```bash
# 初始化 DVC
dvc init

# 添加数据文件到 DVC
dvc add data/train.csv

# 推送到远程存储
dvc push

# 拉取数据
dvc pull

# 查看数据历史
dvc metrics show
```

## 延伸阅读

- [[概念/MLOps/data-pipeline|数据管道]] — 数据流水线
- [[概念/MLOps/dvc|DVC]] — 数据版本工具
- [[概念/MLOps/experiment-tracking|实验追踪]] — 实验管理
- [[概念/MLOps/model-registry|模型仓库]] — 模型版本

> ℹ️ 数据版本控制是 MLOps 的基础，确保实验可复现和数据可追溯。

## 数据版本控制最佳实践

| 实践 | 说明 | 工具 |
|------|------|------|
| **代码 + 数据一起版本** | 代码和数据关联 | Git + DVC |
| **大文件用 DVC** | 避免 Git 膨胀 | DVC |
| **远程存储** | 数据不存本地 | S3/GCS |
| **数据血缘** | 追踪数据来源 | OpenLineage |
| **实验关联** | 数据版本与实验关联 | MLflow |

## 数据版本控制检查清单

- [ ] 数据文件已用 DVC/LakeFS 管理
- [ ] 远程存储已配置
- [ ] 数据变更有审计日志
- [ ] 数据血缘已记录
- [ ] 实验与数据版本关联
- [ ] 数据访问权限已控制
- [ ] 定期备份已配置

## 延伸阅读

- [[概念/MLOps/data-pipeline|数据管道]] — 数据流水线
- [[概念/MLOps/dvc|DVC]] — 数据版本工具
- [[概念/MLOps/experiment-tracking|实验追踪]] — 实验管理
- [[概念/MLOps/model-registry|模型仓库]] — 模型版本

> ℹ️ 数据版本控制是 MLOps 的基础，确保实验可复现和数据可追溯。

## LakeFS 使用示例

```bash
# 创建仓库
lakectl repo create lakefs://my-repo s3://my-bucket

# 创建分支
lakectl branch create lakefs://my-repo/dev --source main

# 提交变更
lakectl commit lakefs://my-repo/dev -m "Add new training data"

# 合并分支
lakectl merge lakefs://my-repo/dev lakefs://my-repo/main
```

## 数据版本控制工具对比

| 工具 | 优点 | 缺点 | 适用 |
|------|------|------|------|
| **DVC** | Git 集成，简单 | 需要远程存储 | 中小团队 |
| **LakeFS** | 数据湖原生，分支 | 需要部署服务 | 数据湖 |
| **Delta Lake** | ACID，时间旅行 | Spark 生态 | 数据湖 |
| **Pachyderm** | 管道集成 | 复杂 | 企业 |

## 延伸阅读

- [[概念/MLOps/data-pipeline|数据管道]] — 数据流水线
- [[概念/MLOps/dvc|DVC]] — 数据版本工具
- [[概念/MLOps/experiment-tracking|实验追踪]] — 实验管理
- [[概念/MLOps/model-registry|模型仓库]] — 模型版本

> ℹ️ 数据版本控制是 MLOps 的基础，确保实验可复现和数据可追溯。

## 数据版本控制常见场景

| 场景 | 解决方案 | 工具 |
|------|----------|------|
| **实验复现** | 数据 + 代码 + 环境版本 | DVC + Git |
| **数据回溯** | 时间旅行查询历史版本 | LakeFS/Delta |
| **协作开发** | 分支 + 合并 | LakeFS |
| **审计合规** | 变更日志 + 血缘 | OpenLineage |

> 生产环境建议所有训练数据都纳入版本控制，确保模型可追溯。
> 数据版本与实验版本关联，可快速定位问题数据。
> 定期清理旧版本数据，控制存储成本。
