---
title: "Data Engineer 面试指南"
category: "21-interviews-data-engineer"
tags: ["interviews", "career", "experience", "practitioners", "data-engineering", "etl", "spark", "kafka", "data-warehouse", "airflow", "sql", "feature-store"]
summary: "Data Engineer 面试全流程指南，覆盖数据建模、ETL/ELT Pipeline、批处理与流处理（Spark/Flink/Kafka）、数据仓库与数据湖、SQL 优化、数据质量治理和系统设计。适用于 Google、Meta、Amazon、Netflix、Uber 等公司的 Data Engineer 岗位。"
created: 2026-05-31
updated: 2026-07-11
tier: supporting
aliases:
  - "Data_Engineer"
  - "Data Engineer 面试指南"
  - "Data_Engineer Interview Guide"
sources: []
---

# Data Engineer 面试指南

> **一句话理解**: Data Engineer 是数据驱动型组织的基础设施建设者——设计高性能的数据管道，构建可靠的数据仓库和数据湖，确保数据从采集到消费的全链路高效、准确、可扩展，为分析和 ML 团队提供坚实的数据基础。

---

## Table of Contents

- [1. 岗位定位与核心职责](#1-岗位定位与核心职责)
  - [1.1 岗位定位](#11-岗位定位)
  - [1.2 核心职责](#12-核心职责)
  - [1.3 核心技能栈](#13-核心技能栈)
  - [1.4 与相近岗位的区别](#14-与相近岗位的区别)
- [2. 技术能力要求](#2-技术能力要求)
- [3. 核心知识领域](#3-核心知识领域)
- [4. 高频面试问题](#4-高频面试问题)
- [5. 系统设计题](#5-系统设计题)
- [6. 编程与实操题](#6-编程与实操题)
- [7. 备考策略与学习路径](#7-备考策略与学习路径)
- [8. 行业薪资范围参考](#8-行业薪资范围参考)
- [9. 面试 Checklist](#9-面试-checklist)
- [Related](#related)

---

## 1. 岗位定位与核心职责

### 1.1 岗位定位

Data Engineer（数据工程师）是数据生态系统的架构师和建设者。在 AI 时代，Data Engineer 的角色更加关键——**没有高质量的数据，最先进的 AI 模型也无法发挥价值**。Data Engineer 负责构建和维护数据从产生到消费的完整生命周期管道。

Data Engineer 的核心使命是**让正确的数据在正确的时间以正确的格式到达正确的人/系统**，同时保证数据的可靠性、安全性和可扩展性。

典型工作场景包括：
- 设计 ETL/ELT 管道，处理每日 TB 级数据
- 构建实时数据流，支持毫秒级延迟的在线特征服务
- 优化数据仓库 schema，提升查询性能和降低成本
- 建立数据质量监控和治理框架
- 为 ML 团队构建 Feature Store 和训练数据管道
- 为分析团队提供可靠的报表和仪表盘数据源

### 1.2 核心职责

| 职责领域 | 具体内容 | 交付物 |
|---------|---------|--------|
| **数据管道** | 设计和实现 ETL/ELT 管道，批处理和流处理 | Pipeline DAG、数据流图 |
| **数据存储** | 设计数据仓库/数据湖架构，选择合适的存储引擎 | Schema 设计、存储方案文档 |
| **数据质量** | 建立数据质量校验、监控和告警机制 | 质量规则、监控仪表盘 |
| **性能优化** | 优化查询性能、管道吞吐和存储成本 | 优化报告、性能基准 |
| **数据治理** | 元数据管理、数据血缘、权限管理 | 数据目录、血缘图 |
| **Feature Store** | 为 ML 团队构建在线/离线特征服务 | Feature Store 架构 |
| **实时处理** | 构建低延迟的流式数据管道 | 流处理应用 |
| **数据 API** | 构建数据服务 API，支持下游消费 | API 文档、数据服务 |

### 1.3 核心技能栈

| 维度 | 关键技能 | 常见工具/框架 |
|------|---------|--------------|
| **SQL** | 复杂 SQL、窗口函数、查询优化 | PostgreSQL, MySQL, Snowflake, BigQuery |
| **批处理** | 大规模数据处理、分布式计算 | Apache Spark, Hadoop, Databricks |
| **流处理** | 实时数据处理、状态管理 | Apache Flink, Kafka Streams, Spark Streaming |
| **消息队列** | 分布式消息系统 | Apache Kafka, AWS Kinesis, Pulsar |
| **数据仓库** | 维度建模、列式存储、OLAP | Snowflake, BigQuery, Redshift, Databricks |
| **数据编排** | Pipeline 依赖管理、调度 | Apache Airflow, Dagster, Prefect, dbt |
| **编程** | Python、Scala、Java | Python (PySpark), Scala |
| **云计算** | 云数据服务、IaC | AWS, GCP, Azure, Terraform |

### 1.4 与相近岗位的区别

| 岗位 | 核心关注点 | 与 Data Engineer 的差异 |
|------|-----------|------------------------|
| **Data Scientist** | 数据分析、建模、洞察 | DE 建管道，DS 用管道产出的数据 |
| **ML Engineer** | 模型开发、训练、部署 | MLE 用数据训练模型，DE 提供数据 |
| **Data Analyst** | BI 报表、数据可视化 | DA 消费数据做分析，DE 保障数据供给 |
| **Analytics Engineer** | 数据转换、建模、dbt | AE 更偏 SQL 转换层，DE 更偏底层管道 |
| **Backend Engineer** | 应用后端、API | BE 做应用逻辑，DE 做数据基础设施 |

---

## 2. 技术能力要求

### 基础级 (初级 Data Engineer)

- **SQL 精通**: 能编写复杂 SQL（JOIN、子查询、窗口函数、CTE），理解执行计划
- **编程能力**: 熟练使用 Python 进行数据处理，理解基本的数据结构和算法
- **ETL 基础**: 能设计和实现基本的 ETL 管道，理解数据抽取、转换、加载的流程
- **数据建模**: 理解基本的维度建模（星型模型、雪花模型）
- **工具使用**: 能使用至少一个批处理框架（Spark 或类似）和一个调度工具（Airflow 或类似）
- **云平台基础**: 了解云平台的基本数据服务

### 进阶级 (中级 Data Engineer)

- **大规模处理**: 能使用 Spark 或 Flink 处理 TB 级数据，理解分布式计算原理
- **流处理**: 能设计和实现实时数据管道（Kafka + Flink/Spark Streaming）
- **性能优化**: 能优化 SQL 查询、Spark 作业和数据仓库性能
- **数据质量**: 能建立系统化的数据质量框架（校验、监控、告警）
- **架构设计**: 能设计端到端的数据架构（数据湖/仓库/Lakehouse）
- **Feature Store**: 理解 ML Feature Store 的设计和实现

### 专家级 (高级 Data Engineer)

- **系统架构**: 能为公司级数据平台设计整体架构，包括存储、处理、消费的全链路
- **技术战略**: 制定数据工程的技术路线图和标准
- **性能极致**: 能处理超大规模（PB 级）数据的性能优化和成本控制
- **数据治理**: 建立企业级的数据治理框架（血缘、目录、权限、合规）
- **团队领导**: 指导初级工程师，建立工程最佳实践

---

## 3. 核心知识领域

### 3.1 SQL 与数据建模

**核心主题**:
- **高级 SQL**: 窗口函数（ROW_NUMBER, RANK, LAG/LEAD, SUM OVER）、递归 CTE、PIVOT/UNPIVOT
- **查询优化**: 执行计划分析、索引策略、分区策略、物化视图
- **维度建模**: 事实表、维度表、星型/雪花模型、SCD（缓慢变化维）
- **Data Vault / One Big Table**: 现代数据仓库建模方法
- **反范式化**: 在分析场景中的 trade-off

### 3.2 批处理（Spark）

**核心主题**:
- **Spark 核心概念**: RDD、DataFrame、Dataset、Catalyst 优化器
- **Spark SQL**: 结构化 API、查询优化、自适应执行（AQE）
- **性能调优**: 分区策略、Shuffle 优化、Broadcast Join、内存管理
- **Spark Streaming**: 微批处理、Structured Streaming
- **PySpark vs Scala Spark**: 性能差异和适用场景

### 3.3 流处理（Flink / Kafka Streams）

**核心主题**:
- **Kafka**: Topic、Partition、Consumer Group、Exactly-Once 语义
- **Flink**: 窗口（Tumbling/Sliding/Session）、状态管理、Checkpoint
- **时间语义**: Event Time、Processing Time、Watermark
- **Exactly-Once**: 幂等写入、事务性 Sink
- **Lambda vs Kappa**: 批流分离 vs 批流统一

### 3.4 数据仓库与数据湖

**核心主题**:
- **现代数据仓库**: Snowflake、BigQuery、Redshift 的架构特点
- **数据湖**: HDFS、S3、GCS 上的数据湖架构
- **Lakehouse**: Databricks Delta Lake、Apache Iceberg、Apache Hudi
- **ACID 事务**: 在数据湖上实现 ACID（Delta/Iceberg/Hudi）
- **Time Travel**: 数据版本管理和时间旅行查询
- **数据格式**: Parquet、ORC、Avro 的特点和适用场景

### 3.5 数据编排（Airflow / dbt）

**核心主题**:
- **Airflow**: DAG 设计、Operator、Sensor、XCom、Hook
- **dbt**: SQL 转换层、模型依赖、测试、文档
- **调度策略**: 依赖管理、重试策略、SLA
- **数据流水线模式**: ELT vs ETL、CDC（Change Data Capture）

### 3.6 数据质量与治理

**核心主题**:
- **数据质量维度**: 完整性、一致性、准确性、及时性、唯一性
- **质量校验**: Great Expectations、Soda、dbt tests
- **数据血缘**: 列级血缘、影响分析
- **元数据管理**: Data Catalog、数据字典
- **数据安全**: 列级权限、行级权限、数据脱敏、加密
- **合规**: GDPR/CCPA 对数据工程的影响

### 3.7 Feature Store 与 ML 数据管道

**核心主题**:
- **Feature Store 架构**: 离线存储（训练用）+ 在线存储（推理用）+ 一致性保证
- **特征工程 Pipeline**: 批量特征计算 + 实时特征计算
- **Point-in-Time 正确性**: 防止训练时的数据泄露
- **工具**: Feast, Tecton, Databricks Feature Store

---

## 4. 高频面试问题

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

### 4.1 SQL 与数据建模 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 解释窗口函数的工作原理，举例说明 ROW_NUMBER 和 RANK 的区别 | ⭐ | 🔴 |
| 2 | 星型模型和雪花模型的区别？各自的适用场景？ | ⭐ | 🔴 |
| 3 | 如何优化一个慢 SQL 查询？你的排查流程是什么？ | ⭐⭐ | 🔴 |
| 4 | 什么是 SCD（缓慢变化维）？Type 1/2/3 的区别？ | ⭐⭐ | 🟡 |
| 5 | 给定一个大表 JOIN 一个小表，如何优化？ | ⭐ | 🔴 |
| 6 | 如何处理数据仓库中的数据延迟到达（Late Arriving Data）？ | ⭐⭐ | 🟡 |
| 7 | 列式存储（Parquet/ORC）为什么比行式存储更适合分析？ | ⭐ | 🟡 |
| 8 | 什么是物化视图？它和普通视图有什么区别？ | ⭐ | 🟡 |

### 4.2 Spark 与批处理 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 9 | Spark 的 RDD、DataFrame、Dataset 有什么区别？ | ⭐⭐ | 🔴 |
| 10 | Spark 的 Shuffle 是什么？如何优化 Shuffle？ | ⭐⭐ | 🔴 |
| 11 | 解释 Spark 的 Partition 和 Repartition | ⭐ | 🟡 |
| 12 | Broadcast Join 和 Sort-Merge Join 的区别和适用场景？ | ⭐⭐ | 🟡 |
| 13 | Spark 中的数据倾斜如何处理？ | ⭐⭐ | 🔴 |
| 14 | AQE（Adaptive Query Execution）的原理和好处？ | ⭐⭐⭐ | 🟢 |

### 4.3 流处理与 Kafka (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 15 | Kafka 的 Partition 和 Consumer Group 的关系？ | ⭐ | 🔴 |
| 16 | 如何实现 Exactly-Once 语义？Kafka + Sink 的方案 | ⭐⭐ | 🟡 |
| 17 | Event Time 和 Processing Time 的区别？为什么 Watermark 重要？ | ⭐⭐ | 🟡 |
| 18 | Lambda 架构和 Kappa 架构的区别？各自的优缺点？ | ⭐⭐ | 🟡 |
| 19 | 如何设计一个处理乱序事件的流处理系统？ | ⭐⭐⭐ | 🟢 |

### 4.4 数据仓库与 Lakehouse (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 20 | Delta Lake / Iceberg / Hudi 的核心区别？ | ⭐⭐ | 🔴 |
| 21 | 如何在数据湖上实现 ACID 事务？ | ⭐⭐ | 🟡 |
| 22 | Snowflake 的微分区（Micro-Partition）是什么？ | ⭐⭐ | 🟢 |
| 23 | 如何设计一个支持 Time Travel 的数据架构？ | ⭐⭐ | 🟢 |
| 24 | 如何选择数据仓库 vs 数据湖 vs Lakehouse？ | ⭐⭐ | 🟡 |

### 4.5 系统设计与行为 (4 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 25 | 设计一个实时用户行为分析系统 | ⭐⭐⭐ | 🔴 |
| 26 | 设计一个 Feature Store 支持在线/离线一致性 | ⭐⭐⭐ | 🟡 |
| 27 | 描述一个你设计的大规模数据管道，遇到的最大挑战是什么？ | ⭐⭐ | 🔴 |
| 28 | 你的数据管道出现数据质量问题，下游团队受影响，你如何处理？ | ⭐⭐ | 🟡 |

---

## 5. 系统设计题

### 5.1 设计实时用户行为分析系统

**题目**: 为一个日活 1 亿的 App 设计实时用户行为分析系统，支持实时仪表盘和告警。

**考察要点**:

1. **数据采集**:
   - SDK → Kafka（事件流）
   - 事件格式设计和 Schema Registry
   - 数据量和吞吐估算

2. **架构设计**:
   ```
   SDK → Kafka → Flink（实时处理）→ ClickHouse / Druid（实时OLAP）→ Dashboard
                    ↓
              Spark（批处理）→ S3 / BigQuery（数据仓库）→ 分析
   ```

3. **实时处理**:
   - 窗口聚合（1 分钟/5 分钟/1 小时）
   - 会话化（Session Window）
   - 异常检测和告警

4. **存储选型**:
   - 实时 OLAP: ClickHouse / Apache Druid / Apache Pinot
   - 数据仓库: BigQuery / Snowflake
   - 缓存: Redis

5. **数据质量**:
   - 事件丢失检测
   - 延迟监控
   - 数据一致性校验

### 5.2 设计 Feature Store

**考察要点**:
1. 在线/离线一致性: 如何保证训练和推理使用相同的特征定义
2. Point-in-Time 正确性: 防止训练时的特征泄露
3. 在线服务延迟: 低延迟的特征读取
4. 批量回填: 历史特征的批量计算
5. 特征版本管理
6. 工具选型: Feast / Tecton / 自建

### 5.3 设计 CDC（Change Data Capture）管道

**考察要点**:
1. CDC 方案: Debezium / Maxwell / 日志解析
2. 数据一致性: Exactly-Once 投递
3. Schema 演化: 表结构变更时的兼容性
4. 延迟监控: CDC Lag
5. 下游消费: 数据仓库、搜索引擎、缓存更新

---

## 6. 编程与实操题

### 6.1 复杂 SQL 查询

```sql
-- 场景: 给定用户交易表 transactions(user_id, amount, txn_date, category)
-- 找出每个类别中消费金额排名前 3 的用户，以及他们的排名

WITH ranked AS (
    SELECT 
        user_id,
        category,
        SUM(amount) AS total_amount,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY SUM(amount) DESC) AS rank
    FROM transactions
    WHERE txn_date >= '2026-01-01'
    GROUP BY user_id, category
)
SELECT category, user_id, total_amount, rank
FROM ranked
WHERE rank <= 3
ORDER BY category, rank;

-- 计算每个用户的月度消费环比增长率
WITH monthly AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', txn_date) AS month,
        SUM(amount) AS total
    FROM transactions
    GROUP BY user_id, DATE_TRUNC('month', txn_date)
),
with_prev AS (
    SELECT 
        *,
        LAG(total) OVER (PARTITION BY user_id ORDER BY month) AS prev_total
    FROM monthly
)
SELECT 
    user_id,
    month,
    total,
    prev_total,
    ROUND((total - prev_total) / NULLIF(prev_total, 0) * 100, 2) AS growth_rate_pct
FROM with_prev
WHERE prev_total IS NOT NULL
ORDER BY ABS(total - prev_total) / NULLIF(prev_total, 0) DESC;
```

### 6.2 PySpark 数据处理

```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("UserAnalytics").getOrCreate()

# 读取用户行为数据
events = spark.read.parquet("s3://data/user_events/")

# 1. 计算每个用户的会话（30 分钟无操作视为新会话）
w = Window.partitionBy("user_id").orderBy("event_timestamp")
events_with_prev = events.withColumn(
    "prev_ts", F.lag("event_timestamp").over(w)
)
events_with_session = events_with_prev.withColumn(
    "new_session", 
    F.when(
        F.unix_timestamp("event_timestamp") - F.unix_timestamp("prev_ts") > 1800,
        1
    ).otherwise(0)
).withColumn(
    "session_id",
    F.sum("new_session").over(w.rowsBetween(Window.unboundedPreceding, 0))
)

# 2. 计算会话统计
session_stats = events_with_session.groupBy("user_id", "session_id").agg(
    F.min("event_timestamp").alias("session_start"),
    F.max("event_timestamp").alias("session_end"),
    F.count("*").alias("events_count"),
    F.collect_set("event_type").alias("event_types")
)

# 3. 用户聚合
user_stats = session_stats.groupBy("user_id").agg(
    F.count("session_id").alias("total_sessions"),
    F.avg("events_count").alias("avg_events_per_session"),
    F.sum(F.unix_timestamp("session_end") - F.unix_timestamp("session_start")).alias("total_active_seconds")
)
```

### 6.3 数据质量校验框架

```python
from dataclasses import dataclass
from typing import List
import pandas as pd

@dataclass
class ValidationResult:
    rule_name: str
    passed: bool
    failed_records: int
    total_records: int
    error_sample: list = None

class DataValidator:
    """数据质量校验框架。"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.results: List[ValidationResult] = []
    
    def check_not_null(self, column):
        null_count = self.df[column].isnull().sum()
        result = ValidationResult(
            rule_name=f"not_null_{column}",
            passed=null_count == 0,
            failed_records=int(null_count),
            total_records=len(self.df)
        )
        self.results.append(result)
        return result
    
    def check_unique(self, column):
        dup_count = self.df.duplicated(subset=[column]).sum()
        result = ValidationResult(
            rule_name=f"unique_{column}",
            passed=dup_count == 0,
            failed_records=int(dup_count),
            total_records=len(self.df)
        )
        self.results.append(result)
        return result
    
    def check_range(self, column, min_val=None, max_val=None):
        mask = pd.Series([True] * len(self.df))
        if min_val is not None:
            mask &= (self.df[column] >= min_val)
        if max_val is not None:
            mask &= (self.df[column] <= max_val)
        failed = (~mask).sum()
        result = ValidationResult(
            rule_name=f"range_{column}",
            passed=failed == 0,
            failed_records=int(failed),
            total_records=len(self.df)
        )
        self.results.append(result)
        return result
    
    def report(self):
        return {
            r.rule_name: {
                'passed': r.passed,
                'failed_records': r.failed_records,
                'failure_rate': r.failed_records / r.total_records if r.total_records else 0
            } for r in self.results
        }
```

### 6.4 Airflow DAG 示例

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'daily_data_pipeline',
    default_args=default_args,
    description='Daily ETL pipeline for user analytics',
    schedule_interval='0 2 * * *',  # 每天凌晨 2 点
    start_date=datetime(2026, 1, 1),
    catchup=False,
) as dag:
    
    extract = SparkSubmitOperator(
        task_id='extract_raw_data',
        application='/jobs/extract.py',
        conn_id='spark_default',
    )
    
    transform = SparkSubmitOperator(
        task_id='transform_and_clean',
        application='/jobs/transform.py',
        conn_id='spark_default',
    )
    
    validate = PythonOperator(
        task_id='validate_data_quality',
        python_callable=run_data_validation,
    )
    
    load = SparkSubmitOperator(
        task_id='load_to_warehouse',
        application='/jobs/load.py',
        conn_id='spark_default',
    )
    
    extract >> transform >> validate >> load
```

### 6.5 Kafka 生产者/消费者

```python
from kafka import KafkaProducer, KafkaConsumer
import json

class EventStream:
    """Kafka 事件流的生产者和消费者封装。"""
    
    def __init__(self, bootstrap_servers, topic):
        self.topic = topic
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            acks='all',  # 等待所有副本确认
            retries=3,
            enable_idempotence=True,  # 幂等生产者
        )
    
    def send_event(self, event):
        """发送事件"""
        future = self.producer.send(self.topic, event)
        return future.get(timeout=10)  # 同步等待确认
    
    @staticmethod
    def create_consumer(bootstrap_servers, topic, group_id):
        """创建消费者"""
        return KafkaConsumer(
            topic,
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            value_deserializer=lambda v: json.loads(v.decode('utf-8')),
            auto_offset_reset='latest',
            enable_auto_commit=False,  # 手动提交
        )
```

---

## 7. 备考策略与学习路径

### 7.1 基础阶段（2-3 个月）

1. **SQL 精通**:
   - 每天练习 5-10 道复杂 SQL 题（LeetCode SQL / HackerRank）
   - 掌握窗口函数、CTE、递归查询
   - 学习查询执行计划和优化

2. **编程与 Spark**:
   - 精通 Python 数据处理（Pandas）
   - 学习 PySpark 基础和高级用法
   - 完成一个完整的 Spark ETL 项目

3. **数据仓库**:
   - 学习维度建模理论
   - 了解主流数据仓库的特点
   - 实践 SQL on Data Warehouse

### 7.2 进阶阶段（2-3 个月）

1. **流处理**:
   - 学习 Kafka 核心概念
   - 实践 Flink 或 Spark Streaming
   - 构建一个实时数据管道

2. **现代数据栈**:
   - 实践 dbt 进行数据转换
   - 使用 Airflow 编排 Pipeline
   - 了解 Delta Lake / Iceberg

3. **系统设计**:
   - 研究经典数据系统设计案例
   - 练习设计端到端数据架构
   - 学习数据治理和质量保障

### 7.3 面试冲刺阶段（1 个月）

1. **SQL 刷题**: 重点练习窗口函数和多表 JOIN
2. **Spark 调优**: 复习性能优化和数据倾斜处理
3. **系统设计**: 准备 3+ 个数据系统设计案例
4. **公司研究**: 了解目标公司的数据栈和数据规模

---

## 8. 行业薪资范围参考

> 以下数据基于 2025-2026 年美国市场，仅供参考。

| 级别 | 公司类型 | 年薪范围 (美元) | 说明 |
|------|---------|---------------|------|
| 初级 (0-2 年) | FAANG / 大型科技公司 | $130K - $200K | 包含 RSU |
| 中级 (2-5 年) | FAANG / 大型科技公司 | $180K - $300K | 能独立设计管道 |
| 高级 (5+ 年) | FAANG / 大型科技公司 | $270K - $450K+ | 数据平台架构师 |
| 所有级别 | 金融/量化 | $200K - $500K+ | 高频交易等 |

**中国市场** (人民币):
- 初级 (0-2 年): 25-50 万
- 中级 (2-5 年): 50-100 万
- 高级 (5+ 年): 100-200 万

---

## 9. 面试 Checklist

- [ ] 能手写复杂 SQL（窗口函数、多表 JOIN、递归 CTE）
- [ ] 能用 PySpark 处理大规模数据
- [ ] 理解 Spark 的 Shuffle 和数据倾斜处理
- [ ] 理解 Kafka 的核心概念和 Exactly-Once 语义
- [ ] 能设计 ETL/ELT 管道
- [ ] 能设计数据仓库 schema（维度建模）
- [ ] 了解 Delta Lake / Iceberg / Hudi
- [ ] 能使用 Airflow 编排 Pipeline
- [ ] 能设计 Feature Store
- [ ] 能进行 SQL 查询优化
- [ ] 准备了大规模数据系统设计案例
- [ ] 了解数据质量保障和治理方法

---

## Related

- [[21_面试岗位/README|AI 面试准备 (Interviews)]]
- [[21_面试岗位/jobs|AI 相关岗位与工种清单]]
- [[21_面试岗位/MLOps_Engineer/MLOps_Engineer|MLOps Engineer 面试指南]]
- [[21_面试岗位/AI_Infrastructure_Engineer/question_bank|AI Infrastructure Engineer 题库]]
- [[21_面试岗位/Data_Scientist/question_bank|Data Scientist 题库]]
- [[21_面试岗位/Machine_Learning_Engineer/question_bank|Machine Learning Engineer 题库]]
- [[21_面试岗位/AI_Solutions_Architect/AI_Solutions_Architect|AI Solutions Architect 面试指南]]

---

*Last updated: 2026-07-11*
