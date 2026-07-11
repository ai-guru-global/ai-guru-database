---
title: "ML 数据流水线"
category: 11-mlops-pipeline
subcategory: data-engineering
tags: ["mlops", "data-engineering", "pipeline", "etl", "feature-engineering", "alibaba-cloud"]
summary: "系统讲解机器学习数据流水线的构建：数据摄取、清洗、转换、特征工程、版本化，以及 K8s/Airflow 上的编排实践。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# ML 数据流水线

> **一句话理解**: ML 数据流水线就是把原始数据一步步变成模型能吃的「干净饭」，并且每一步都能复现、能回滚。

## 目录

- [1. 流水线阶段](#1-流水线阶段)
- [2. 技术选型](#2-技术选型)
- [3. 数据版本化](#3-数据版本化)
- [4. K8s 与 Airflow 编排](#4-k8s-与-airflow-编排)
- [5. 常见反模式](#5-常见反模式)
- [Related](#related)

---

## 1. 流水线阶段

```text
原始数据
  ↓ 摄取
数据湖（OSS/S3/HDFS）
  ↓ 清洗/去重/匿名化
干净数据
  ↓ 特征工程
特征数据集
  ↓ 切分
训练集 / 验证集 / 测试集
  ↓ 版本化
DVC / LakeFS / Git-LFS
```

## 2. 技术选型

| 工具 | 定位 |
|------|------|
| **Airflow** | 复杂依赖 DAG 编排 |
| **Dagster** | 数据资产优先的编排 |
| **Prefect** | 现代 Pythonic 编排 |
| **dbt** | 数据转换与文档化 |
| **Spark** | 大规模数据处理 |
| **DuckDB/Polars** | 本地/中小规模处理 |

## 3. 数据版本化

- **DVC**: 数据 + 代码一起版本化
- **LakeFS**: 数据湖 Git-like 版本控制
- **Delta Lake**: ACID + 时间旅行

## 4. K8s 与 Airflow 编排

```python
from airflow.providers.cncf.kubernetes.operators.pod import KubernetesPodOperator

clean_data = KubernetesPodOperator(
    task_id="clean-data",
    namespace="mlops",
    image="data-pipeline:latest",
    cmds=["python", "clean.py"],
)
```

## 5. 常见反模式

| 反模式 | 问题 | 解决 |
|--------|------|------|
| 数据与代码不同步 | 无法复现实验 | DVC / LakeFS |
| 训练集数据泄露 | 验证集结果虚高 | 严格时序切分 |
| 特征在训练/服务时不一致 | 线上效果差 | 特征平台 |
| 无数据质量门禁 | 脏数据进模型 | Great Expectations |

---

## Related

- [[概念/data-pipeline|Data Pipeline]]
- [[概念/dvc|DVC]]
- [[概念/lakefs|LakeFS]]
- [[概念/data-validation|Data Validation]]
- [[模型运维/Data_Engineering/Data_Validation_and_Quality|数据验证与质量]]

- [[模型运维/README|MLOps 流水线 (MLOps Pipeline)]]
