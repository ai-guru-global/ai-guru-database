---
title: "Data Pipeline"
category: -concepts
tags: ["data-engineering", "mlops", "pipeline", "etl", "alibaba-cloud"]
summary: "Data Pipeline 是将数据从源系统摄取、转换、加载到目标系统的自动化流程，是 MLOps 的数据基础。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "数据流水线"
  - "ETL Pipeline"
relationships:
  - target: "概念/mlops"
    type: part_of
  - target: "概念/data-validation"
    type: related_to
sources: []
---

# Data Pipeline

> **一句话理解**: 数据流水线就是把原始数据自动清洗、转换、搬运到模型能用的形态的管道。

## 核心要点

- **摄取**: 批量、流式、CDC
- **转换**: 清洗、聚合、特征工程
- **加载**: 数据仓库、数据湖、特征平台
- **编排**: Airflow、Dagster、Prefect
- **可观测**: 数据质量、延迟、失败告警

## 常见工具

| 工具 | 定位 |
|------|------|
| Airflow | DAG 编排 |
| Spark | 大规模批处理 |
| Flink | 流处理 |
| dbt | 数据转换 |
| Kafka | 流数据摄取 |

## 阿里云专有云关联

在阿里云专有云环境中，数据流水线常基于 DataWorks、MaxCompute、OSS、Flink 构建，为 AI Stack 提供训练数据。

## Related

- [[概念/data-validation|Data Validation]]
- [[概念/feature-store|Feature Store]]
- [[概念/dvc|DVC]]
- [[模型运维/Data_Engineering/Data_Pipeline_for_ML|ML 数据流水线]]

---

## 2026 数据流水线生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Apache Airflow** | 工作流编排，DAG 定义 | GA |
| **Prefect** | 现代数据流水线，Python 原生 | GA |
| **Dagster** | 数据资产编排 | GA |
| **Kubeflow Pipelines** | K8s 原生 ML 流水线 | GA |
| **DVC** | 数据版本控制 | GA |

## 生产最佳实践

1. **幂等性设计**：流水线任务必须幂等，支持重跑
2. **数据版本控制**：用 DVC 管理数据版本
3. **监控告警**：监控流水线运行状态，失败告警
4. **增量处理**：大数集用增量处理，避免全量重跑
5. **血缘追踪**：记录数据血缘，支持影响分析
