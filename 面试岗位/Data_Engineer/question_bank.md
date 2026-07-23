---
title: Data Engineer 题库
category: 21-interviews-data-engineer
tags: ["interviews", "career", "data-engineering", "etl", "data-warehouse", "streaming", "spark", "kafka", "feature-store"]
summary: "Data Engineer 题库，覆盖数据管道、ETL、数据仓库、流批一体、Spark/Kafka、数据质量与 Feature Store，含难度与频率标注。"
created: 2026-07-23
updated: 2026-07-23
tier: supporting
sources: []
---

# Data Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## 数据管道与 ETL (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 设计一个支撑 ML 训练的端到端数据管道（采集/清洗/存储/服务） | ⭐⭐⭐ | 🔴 |
| 2 | 批处理 vs 流处理的适用场景？Lambda vs Kappa 架构？ | ⭐⭐ | 🔴 |
| 3 | 数据抽取的增量 vs 全量策略，CDC（Change Data Capture）原理？ | ⭐⭐ | 🟡 |
| 4 | ETL 中的数据清洗常见问题（缺失/异常/重复/格式）的工程化处理？ | ⭐⭐ | 🟡 |
| 5 | 如何设计幂等的 ETL 任务（重跑不产生重复）？ | ⭐⭐⭐ | 🟡 |
| 6 | Airflow / Dagster / Prefect 的编排框架对比和选型？ | ⭐⭐ | 🟡 |
| 7 | 任务依赖和回填（Backfill）如何设计？ | ⭐⭐ | 🟡 |
| 8 | 数据管道的 SLA 管理（延迟/新鲜度）如何做？ | ⭐⭐ | 🟢 |
| 9 | Schema Evolution（schema 演进）对管道的影响和处理？ | ⭐⭐⭐ | 🟡 |
| 10 | 元数据管理（Data Catalog）的作用和实现？ | ⭐⭐ | 🟢 |

---

## 数据仓库与建模 (9 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 11 | Kimball 维度建模 vs Inmon 范式建模的区别和选型？ | ⭐⭐ | 🟡 |
| 12 | 星型 vs 雪花型 schema 的取舍？ | ⭐ | 🟡 |
| 13 | 缓慢变化维（SCD Type 1/2/3）的应用场景？ | ⭐⭐ | 🟡 |
| 14 | 数据湖（Data Lake）vs 数据仓库（Warehouse）vs Lakehouse？ | ⭐⭐ | 🔴 |
| 15 | Lakehouse（Iceberg/Hudi/Delta Lake）的核心特性（ACID/Time Travel）？ | ⭐⭐⭐ | 🔴 |
| 16 | 数据集市（Data Mart）和事实/维度表的设计实践？ | ⭐⭐ | 🟢 |
| 17 | ODS/DWD/DWS/ADS 分层的目的和设计原则？ | ⭐⭐ | 🟡 |
| 18 | 宽表 vs 星型模型在查询性能和可维护性的权衡？ | ⭐⭐ | 🟡 |
| 19 | 实时数仓（如基于 Flink + StarRocks）的架构？ | ⭐⭐⭐ | 🟡 |

---

## 大数据计算 (9 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 20 | Spark 的 RDD/DataFrame/Dataset 区别？惰性求值的意义？ | ⭐⭐ | 🔴 |
| 21 | Spark 的 Shuffle 为什么是性能瓶颈？如何优化？ | ⭐⭐⭐ | 🟡 |
| 22 | Spark 的 partition 数量如何选择？repartition vs coalesce？ | ⭐⭐ | 🟡 |
| 23 | Spark 广播变量和累加器的应用场景？ | ⭐⭐ | 🟢 |
| 24 | Spark SQL 的 Catalyst 优化器原理？ | ⭐⭐⭐ | 🟢 |
| 25 | Flink 的流处理模型（事件时间/水印/窗口）？ | ⭐⭐⭐ | 🟡 |
| 26 | Flink 的 State 管理和 Checkpoint 机制？ | ⭐⭐⭐ | 🟡 |
| 27 | Exactly-once 语义如何保证（Kafka + Flink/Spark）？ | ⭐⭐⭐ | 🟡 |
| 28 | SQL 引擎选型（Presto/Trino/Spark SQL/ClickHouse）？ | ⭐⭐ | 🟡 |

---

## 消息队列与存储 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 29 | Kafka 的架构（Topic/Partition/Replica/Consumer Group）？ | ⭐⭐ | 🔴 |
| 30 | Kafka 的高吞吐原理（顺序写/零拷贝/批处理）？ | ⭐⭐⭐ | 🟡 |
| 31 | Kafka 的 Exactly-once 语义如何实现（事务/幂等生产者）？ | ⭐⭐⭐ | 🟡 |
| 32 | Kafka vs Pulsar vs RocketMQ 的对比？ | ⭐⭐ | 🟢 |
| 33 | 列式存储（Parquet/ORC）相比行式的优势和适用场景？ | ⭐⭐ | 🟡 |
| 34 | 数据压缩（Snappy/ZSTD/Gzip）在数据管道的权衡？ | ⭐⭐ | 🟢 |
| 35 | Redis 在实时特征存储和缓存中的应用？ | ⭐⭐ | 🟡 |

---

## 数据质量与治理 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 36 | 数据质量维度（完整性/准确性/一致性/时效性/唯一性）如何度量？ | ⭐⭐ | 🔴 |
| 37 | Great Expectations / dbt test 的数据测试实践？ | ⭐⭐ | 🟡 |
| 38 | 数据血缘（Data Lineage）的作用和实现？ | ⭐⭐⭐ | 🟡 |
| 39 | 数据 SLA（新鲜度/延迟/可用性）如何定义和监控？ | ⭐⭐ | 🟡 |
| 40 | 数据重复/数据漂移（pipeline 层面）如何检测？ | ⭐⭐ | 🟡 |
| 41 | 数据治理框架（DAMA/DCMM）的核心领域？ | ⭐⭐ | 🟢 |
| 42 | GDPR/个人信息保护法对数据管道的影响（数据主体权利/遗忘）？ | ⭐⭐ | 🟡 |

---

## Feature Store 与 ML 支持 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 43 | Feature Store 的作用（在线/离线一致性）？Feast/Tecton 架构？ | ⭐⭐⭐ | 🔴 |
| 44 | Point-in-Time Correctness（时间点正确性）如何保证？ | ⭐⭐⭐ | 🟡 |
| 45 | 在线特征（低延迟）vs 离线特征（批）的工程实现？ | ⭐⭐ | 🟡 |
| 46 | 特征计算逻辑的复用（训练/推理一致性）如何保证？ | ⭐⭐⭐ | 🟡 |
| 47 | 大模型训练数据管道（万亿 token 清洗/去重/质量过滤）？ | ⭐⭐⭐ | 🟡 |

---

## 行为面试 (4 题)

| # | 问题 | 频率 |
|---|------|------|
| 48 | 描述一次你设计并落地的数据管道项目（规模/挑战/成果） | 🔴 |
| 49 | 数据质量问题导致下游错误，你如何排查和改进？ | 🔴 |
| 50 | 你如何与数据科学家/分析师协作（需求对齐/SLA）？ | 🟡 |
| 51 | 当数据管道延迟影响业务时，你的应急和长期方案？ | 🟡 |

---

## 编程与系统设计 (5 题)

| # | 方向 | 频率 | 示例 |
|---|------|------|------|
| 52 | SQL | 🔴 | 窗口函数/复杂 Join/去重 |
| 53 | Spark | 🔴 | 写一个聚合/Join 优化 |
| 54 | Python 数据处理 | 🟡 | Pandas/PySpark 清洗 |
| 55 | 系统设计 | 🔴 | 设计实时数仓 |
| 56 | 数据建模 | 🟡 | 为某业务设计星型模型 |

---

## 技术栈速查

| 类别 | 主流方案 |
|------|---------|
| 批处理 | Spark / Hive / Tez |
| 流处理 | Flink / Spark Streaming / Kafka Streams |
| 消息队列 | Kafka / Pulsar / RocketMQ / Pulsar |
| 数仓 | Snowflake / Redshift / BigQuery / StarRocks / Doris |
| Lakehouse | Iceberg / Hudi / Delta Lake |
| 编排 | Airflow / Dagster / Prefect / DolphinScheduler |
| OLAP | ClickHouse / Druid / Doris / StarRocks |
| 特征 | Feast / Tecton / 自建 Redis+Parquet |
| 元数据 | DataHub / OpenMetadata / Amundsen |

---

*Last updated: 2026-07-23*

## Related

- [[面试岗位/Data_Engineer/interview_answers|Data Engineer 面试题实例答案]]
- [[面试岗位/Data_Engineer/company_level_question_bank|Data Engineer 按公司/级别区分的题库]]
- [[面试岗位/Data_Engineer/index|Data Engineer 首页]]
- [[模型运维/index|模型运维]]
- [[模型运维/Data_Engineering/index|数据工程]]
- [[模型运维/Feature_Store/index|Feature Store]]
- [[面试岗位/Interview_Guide/System_Design_for_AI|AI 系统设计面试]]
- [[面试岗位/jobs|AI 相关岗位与工种清单]]
