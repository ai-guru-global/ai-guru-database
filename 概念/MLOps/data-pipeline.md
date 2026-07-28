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
name_zh: "数据流水线"
---

# Data Pipeline

> 中文简称：数据流水线

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
- [[11_模型运维/02_Data_Engineering/Data_Pipeline_for_ML|ML 数据流水线]]

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

## 2026 数据管道生态

| 工具 | 类型 | 特点 | 状态 |
|------|------|------|------|
| **Airflow** | 编排 | 最流行 | GA |
| **Prefect** | 编排 | 现代替代 | GA |
| **Dagster** | 编排 | 数据资产 | GA |
| **Kubeflow Pipelines** | ML 管道 | K8s 原生 | GA |
| **dbt** | 转换 | SQL 优先 | GA |
| **Spark** | 处理 | 大规模 | GA |

## 数据管道架构

```
数据管道架构:
数据源 (API/DB/文件)
    │
    ▼
┌─────────────────┐
│  摄取 (Ingest)   │ → 原始数据
└────────┬────────┘
         │
    ▼
┌─────────────────┐
│  验证 (Validate) │ → 质量检查
└────────┬────────┘
         │
    ▼
┌─────────────────┐
│  转换 (Transform)│ → 特征工程
└────────┬────────┘
         │
    ▼
┌─────────────────┐
│  加载 (Load)     │ → 数据仓库/特征存储
└─────────────────┘
```

## Airflow DAG 示例

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

default_args = {'owner': 'ml-team', 'retries': 2}

with DAG('ml_data_pipeline',
         default_args=default_args,
         start_date=datetime(2026, 1, 1),
         schedule_interval='@daily',
         catchup=False) as dag:
    
    extract = PythonOperator(task_id='extract', python_callable=extract_data)
    validate = PythonOperator(task_id='validate', python_callable=validate_data)
    transform = PythonOperator(task_id='transform', python_callable=transform_data)
    load = PythonOperator(task_id='load', python_callable=load_data)
    
    extract >> validate >> transform >> load
```

## 延伸阅读

- [[概念/MLOps/data-versioning|数据版本]] — 数据版本控制
- [[概念/MLOps/great-expectations|Great Expectations]] — 数据质量
- [[概念/MLOps/feature-store|特征存储]] — 特征管理
- [[概念/K8s/kubeflow|Kubeflow]] — ML 平台

> ℹ️ 数据管道是 MLOps 的基础，可靠的管道是模型生产化的前提。

## 数据管道设计原则

| 原则 | 说明 | 实现 |
|------|------|------|
| **幂等性** | 重复执行结果一致 | 唯一 ID + 去重 |
| **可重放** | 失败后可重新执行 | 检查点 + 回溯 |
| **可观测** | 监控运行状态 | 日志 + 指标 |
| **增量处理** | 只处理新数据 | 时间戳 + 水位线 |
| **数据血缘** | 追踪数据来源 | OpenLineage |

## 数据管道监控指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| **延迟** | 数据到达时间 | > SLA |
| **吐吐量** | 处理速度 | < 预期 50% |
| **失败率** | 任务失败比例 | > 5% |
| **数据质量** | 质量检查通过率 | < 95% |
| **资源使用** | CPU/内存使用率 | > 80% |

## 延伸阅读

- [[概念/MLOps/data-versioning|数据版本]] — 数据版本控制
- [[概念/MLOps/great-expectations|Great Expectations]] — 数据质量
- [[概念/MLOps/feature-store|特征存储]] — 特征管理
- [[概念/K8s/kubeflow|Kubeflow]] — ML 平台

> ℹ️ 数据管道是 MLOps 的基础，可靠的管道是模型生产化的前提。

## 数据管道工具对比

| 工具 | 优点 | 缺点 | 适用 |
|------|------|------|------|
| **Airflow** | 生态成熟，插件丰富 | 重量级，学习曲线 | 企业级 |
| **Prefect** | 现代 API，易用 | 生态较新 | 中小团队 |
| **Dagster** | 数据资产，可测试 | 学习曲线 | 数据工程 |
| **Kubeflow** | K8s 原生，ML 优化 | 复杂 | ML 平台 |

## 数据管道最佳实践

1. **版本控制**：管道代码纳入 Git 版本控制
2. **测试**：管道逻辑必须有单元测试
3. **文档**：每个任务有清晰的文档说明
4. **告警**：失败时及时告警，不要静默失败
5. **回溯**：支持数据回溯和重处理

## 数据管道检查清单

- [ ] 管道代码已版本控制
- [ ] 任务有重试机制
- [ ] 失败有告警通知
- [ ] 数据质量检查已集成
- [ ] 增量处理已实现
- [ ] 数据血缘已记录
- [ ] 文档已完善
- [ ] 监控指标已配置

> 生产环境建议每日检查管道运行状态，确保数据及时性和质量。
