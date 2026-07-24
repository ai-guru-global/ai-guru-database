---
title: "Data Pipeline 2.0 (Dagster / Airflow 3.0 / dbt + Spark / LLM 数据流水线)"
category: concepts
tags:
  - mlops
  - data-pipeline
  - dagster
  - airflow
  - dbt
  - spark
  - llm-data
  - dataops
aliases:
  - Data Pipeline 2.0
  - Dagster
  - Airflow 3.0
  - dbt + Spark
  - LLM Data Pipeline
  - DataOps
relationships:
  - target: "概念/data-pipeline"
    type: extends
  - target: "概念/data-versioning"
    type: related_to
  - target: "概念/data-cleaning-pipeline"
    type: related_to
  - target: "概念/synthetic-data"
    type: related_to
summary: "Data Pipeline 2.0 是 2024-2026 突破"数据工程分散"的关键——Dagster(数据资产原生)、Airflow 3.0(标准化编排)、dbt + Spark(ELT)、LLM Data Pipeline(数据生成/清洗/合成的端到端流水线)。是把"原始数据 → 训练数据 → 知识库"全链路自动化的核心。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# Data Pipeline 2.0

> **一句话理解**:Data Pipeline 2.0 把"原始数据 → 训练数据 → 知识库 → 监控数据"全链路用统一流水线管理——Dagster(数据资产原生,2024-2025 新标准)、Airflow 3.0(标准化 + 任务执行)、dbt + Spark(ELT 主流)、LLM Data Pipeline(LLM 生成 / 清洗 / 标注数据)。

---

## 一、为什么 Data Pipeline 2.0?

传统数据工程的痛点:
- **脚本化**:Python 脚本无版本、无监控
- **碎片化**:Ingest / Transform / Train / Serve 各一套
- **不可观测**:失败原因难定位
- **不可重放**:数据版本难追溯

Data Pipeline 2.0 解法:
- **数据资产(Asset)**:把数据作为一等公民
- **声明式**:Dagster / dbt / Airflow 3
- **可观测**:Lineage + Metrics 全程跟踪
- **可重放**:Iceberg / Delta 快照

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 数据流水线 | Data Pipeline | 数据流处理 |
| 数据资产 | Data Asset | Dagster 核心概念 |
| 数据编排 | Data Orchestration | 任务调度 |
| 数据血缘 | Data Lineage | 数据来源追溯 |
| 数据版本化 | Data Versioning | 快照 / 增量 |
| ELT | Extract-Load-Transform | 抽取加载转换 |
| ETL | Extract-Transform-Load | 抽取转换加载 |
| dbt | data build tool | SQL 转换 |
| Spark | Apache Spark | 大数据计算 |
| Dagster | Dagster | 数据资产原生 |
| Airflow | Apache Airflow | 任务编排 |
| 数据湖 | Data Lake | 原始数据 |
| 数据仓库 | Data Warehouse | 聚合数据 |
| Lakehouse | Lakehouse | 湖仓一体 |
| Iceberg | Apache Iceberg | 表格式 |
| Delta Lake | Delta Lake | 表格式 |
| 数据质量 | Data Quality | 准确/完整/及时 |
| 数据契约 | Data Contract | Schema 契约 |
| DataOps | DataOps | 数据工程文化 |
| 增量处理 | Incremental | 只处理新数据 |
| 批处理 | Batch | 离线批 |
| 流处理 | Stream | 实时流 |

---

## 三、主流平台对比(2026-02 快照)

| 平台 | 厂商 | 范式 | 优势 | 许可证 |
|---|---|---|---|---|
| **Dagster** | Dagster | Asset-Native | 数据资产一等公民 | Apache 2.0 |
| **Airflow 3.0** | Apache | Task-Based | 标准化、生态最广 | Apache 2.0 |
| **Prefect 3.0** | Prefect | Dynamic | 动态 DAG、Pythonic | Apache 2.0 |
| **Mage** | Mage | Notebook | 笔记本质感 | Apache 2.0 |
| **Kestra** | Kestra | Declarative | YAML 声明式 | Apache 2.0 |
| **dbt** | dbt Labs | SQL Transform | SQL 转换 SOTA | 商业 + Apache |
| **Apache Spark** | Apache | Compute | 大数据计算标准 | Apache 2.0 |
| **Apache Beam** | Apache | Unified | 统一批流 | Apache 2.0 |
| **Apache Flink** | Apache | Stream | 实时流 SOTA | Apache 2.0 |
| **Ray** | Anyscale | Distributed | ML 分布式 | Apache 2.0 |
| **Argo Workflows** | Argo | K8s Native | K8s 原生 | Apache 2.0 |

---

## 四、Dagster 实战(数据资产原生)

### 4.1 核心思想

把"数据"作为一等公民:
- 任务定义:产生/消费什么数据资产
- 资产版本:自动追踪数据快照
- 血缘:自动生成
- 监控:资产新鲜度、质量

### 4.2 实战

```python
# assets.py
from dagster import asset, Definitions
import pandas as pd

@asset
def raw_users() -> pd.DataFrame:
    return pd.read_csv("raw_users.csv")

@asset
def cleaned_users(raw_users: pd.DataFrame) -> pd.DataFrame:
    return raw_users.dropna()

@asset
def user_features(cleaned_users: pd.DataFrame) -> pd.DataFrame:
    return cleaned_users.assign(
        age_bucket=lambda x: pd.cut(x["age"], bins=[0, 18, 30, 50, 100])
    )

defs = Definitions(assets=[raw_users, cleaned_users, user_features])
```

### 4.3 优势

- 资产 + 任务混合
- 自动 lineage
- 内置单元测试
- 调度 + 触发一体

### 4.4 仓库

- Dagster [github.com/dagster-io/dagster](https://github.com/dagster-io/dagster)
- 文档 [docs.dagster.io](https://docs.dagster.io/)

---

## 五、Airflow 3.0 实战

### 5.1 核心升级

- **TaskFlow API 2.0**:更 Pythonic
- **Edge Labels**:DAG 边可命名
- **Dataset Scheduling**:数据集触发(类似 Dagster Asset)
- **Edge Worker**:边缘部署
- **OpenLineage** 集成:血缘标准化

### 5.2 实战

```python
from airflow.decorators import dag, task
from airflow.models.dataset import Dataset
from datetime import datetime

raw_dataset = Dataset("s3://bucket/raw/users")
cleaned_dataset = Dataset("s3://bucket/cleaned/users")

@dag(schedule=[raw_dataset], start_date=datetime(2024, 1, 1))
def etl_dag():
    @task(outlets=[cleaned_dataset])
    def clean():
        return "cleaned data"

    @task
    def train(cleaned):
        return "trained model"

    clean() >> train()

etl_dag()
```

### 5.3 仓库

- Airflow [github.com/apache/airflow](https://github.com/apache/airflow)

---

## 六、dbt 实战(ELT 转换)

### 6.1 核心思想

SQL 优先的转换工具:
- 数据科学家熟悉 SQL
- 自动 lineage
- 自动测试
- 集成数据仓库

### 6.2 实战

```sql
-- models/cleaned_users.sql
{{ config(materialized='incremental') }}

SELECT
    id,
    name,
    email,
    age,
    signup_date
FROM {{ source('raw', 'users') }}
WHERE age IS NOT NULL
{% if is_incremental() %}
  AND signup_date > (SELECT MAX(signup_date) FROM {{ this }})
{% endif %}
```

### 6.3 仓库

- dbt [github.com/dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core)
- 文档 [docs.getdbt.com](https://docs.getdbt.com/)

---

## 七、LLM Data Pipeline

### 7.1 流水线

```
原始数据(Ingest)
   ↓
[LLM 数据生成](Magpie / Self-Instruct)
   ↓
[数据清洗](GPT-4o 评分 + 规则)
   ↓
[去重](Embedding + 阈值)
   ↓
[配比优化](DoReMi)
   ↓
[训练 / SFT / RAG 数据]
```

### 7.2 工具

- **DataPrep**:LLM 数据准备
- **Argilla**:开源数据标注
- **Label Studio**:数据标注
- **Scale AI / Surge**:商业数据

### 7.3 RAG 流水线

```
文档
  ↓
[Docling / Unstructured 解析]
  ↓
[分块]
  ↓
[Embedding + 向量库]
  ↓
[评估 + 监控]
```

---

## 八、生产最佳实践

1. **新项目用 Dagster**:资产原生,长期可维护。
2. **大数据用 Spark**:Dagster + Spark / Airflow + Spark。
3. **SQL 转换用 dbt**:ETL 转 ELT 标配。
4. **流处理用 Flink / Beam**:实时场景。
5. **Iceberg / Delta 选一种**:Lakehouse 标配。
6. **数据契约必备**:Schema 稳定性。
7. **Lineage 必做**:Dagster / OpenLineage 自动。
8. **监控资产新鲜度**:> 1 小时告警。
9. **LLM 流水线版本化**:数据 + Prompt + 模型。
10. **A/B 测试**:不同数据组合对比。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Dagster** | v1.10,资产原生 SOTA |
| **Airflow 3.0** | v3.0,2024-12 GA,TaskFlow + Dataset |
| **Prefect 3.0** | v3.0,Pythonic 动态 |
| **dbt** | v1.8,SQL Transform 标配 |
| **Spark** | v4.0,GPU 加速 |
| **Iceberg** | v1.5,事实标准 |
| **Delta Lake** | v4.0,Databricks 主推 |
| **OpenLineage** | v1.0,数据血缘标准 |
| **市场规模** | DataOps ARR $5B+ |
| **主要竞品** | Dagster / Airflow / Prefect / dbt / Spark / Flink / Beam |

---

## 十、See Also(官方源)

### Dagster

- 仓库 [github.com/dagster-io/dagster](https://github.com/dagster-io/dagster)
- 文档 [docs.dagster.io](https://docs.dagster.io/)

### Airflow

- 仓库 [github.com/apache/airflow](https://github.com/apache/airflow)
- 文档 [airflow.apache.org](https://airflow.apache.org/)

### 其他

- Prefect [github.com/PrefectHQ/prefect](https://github.com/PrefectHQ/prefect)
- dbt [github.com/dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core)
- Spark [github.com/apache/spark](https://github.com/apache/spark)
- Flink [github.com/apache/flink](https://github.com/apache/flink)
- Iceberg [iceberg.apache.org](https://iceberg.apache.org/)
- Delta Lake [delta.io](https://delta.io/)
- OpenLineage [github.com/OpenLineage/OpenLineage](https://github.com/OpenLineage/OpenLineage)

---

## 十一、相关概念卡

- [[概念/data-pipeline|Data Pipeline]]
- [[概念/data-versioning|Data Versioning]]
- [[概念/data-cleaning-pipeline|Data Cleaning Pipeline]]
- [[概念/synthetic-data|Synthetic Data]]
- [[概念/feature-store-2|Feature Store 2]]
- [[概念/argo-rollouts|Argo Rollouts]]
- [[概念/data-mixing|Data Mixing]]
- [[概念/dvc|Dvc]]
