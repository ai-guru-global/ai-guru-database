---
title: "Feast: 特征存储平台"
category: "16-ai-ops"
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: "> **一句话理解**: Feast 是开源特征存储——管理 ML 特征、在线/离线一致、特征复用、团队共享，ML 平台的特征工程基础设施。"
created: "2026-05-31"
updated: "2026-05-31"
---

# Feast: 特征存储平台

> **一句话理解**: Feast 是开源特征存储——管理 ML 特征、在线/离线一致、特征复用、团队共享，ML 平台的特征工程基础设施。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Feast: 特征存储平台
═══════════════════════════════════════════════════════════════════

定位: 开源特征存储平台，管理 ML 特征定义、存储和访问

核心理念:
───────────────────────────────────────────────────────────────────
• 特征定义: 声明式特征定义
• 在线/离线: 训练-生产一致性
• 低延迟: 毫秒级特征读取
• 特征复用: 团队共享特征
• 数据源: 多数据源支持
• 开源: Apache 2.0
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **特征定义** | YAML 声明 |
| **在线存储** | Redis/Facebook 加速 |
| **离线存储** | BigQuery/S3/Redshift |
| **训练-生产一致** | Point-in-time joins |
| **特征服务** | 低延迟 API |
| **特征血缘** | 完整追踪 |

### 1.3 支持数据源

| 类型 | 数据源 |
|------|--------|
| **云存储** | S3/GCS/Azure Blob |
| **数据仓库** | BigQuery/Redshift/Snowflake |
| **数据库** | PostgreSQL/MySQL/SQL Server |
| **流数据** | Kafka/Kinesis |

---

## 2. 核心概念

### 2.1 特征视图

```
Feast Feature View
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Feature View 结构                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  FeatureView:                                                    │
│  ├── name: "user_features"                                      │
│  ├── entities: ["user_id"]                                      │
│  ├── features: [                                                │
│  │     {name: "age", type: Float64},                           │
│  │     {name: "gender", type: String},                        │
│  │     {name: "last_login", type: Int64}                       │
│  │   ]                                                          │
│  ├── ttl: 7 days                                                │
│  └── source: "user_stats.parquet"                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 实体关系

```
Entity (实体)
═══════════════════════════════════════════════════════════════════

Entity 是特征的索引键，用于 Join

示例:
───────────────────────────────────────────────────────────────────
用户实体 (user_id)
    │
    ├── 特征视图: 用户基础信息 (年龄、性别)
    ├── 特征视图: 用户行为 (点击、购买)
    └── 特征视图: 用户偏好 (兴趣、标签)

实体的作用:
• 唯一标识特征
• 用于特征 Join
• 关联多个特征视图
```

---

## 3. 架构设计

### 3.1 系统架构

```
Feast 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Feast 架构                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Feast Python SDK                             │   │
│   │  • 特征定义 (YAML)                                      │   │
│   │  • 特征获取                                             │   │
│   │  • 训练数据生成                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐        │
│   │   在线    │       │   离线    │       │  注册表   │        │
│   │   存储    │       │   存储    │       │  (Registry)│        │
│   │  Redis    │       │  BigQuery │       │   SQLite   │        │
│   │  DynamoDB │       │  S3       │       │  PostgreSQL│        │
│   └───────────┘       └───────────┘       └───────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 训练-生产一致性

```
Point-in-Time Join
═══════════════════════════════════════════════════════════════════

问题: 训练时不能有数据泄露
───────────────────────────────────────────────────────────────────

训练数据生成:
┌──────────────────────────────────────────────────────────────────┐
│                                                                      │
│  训练样本时间点: 2026-04-01 10:00                                   │
│                                                                      │
│  获取特征: 2026-04-01 10:00 之前最新的特征值                        │
│  (不包含 10:00 之后的特征，防止泄露)                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────┘

在线特征服务:
┌──────────────────────────────────────────────────────────────────┐
│                                                                      │
│  请求时间: 2026-04-01 12:00                                        │
│                                                                      │
│  获取特征: 最新特征值                                                │
│                                                                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install feast
```

### 4.2 初始化项目

```bash
feast init my_feature_repo
cd my_feature_repo
```

### 4.3 定义特征

```yaml
# features/features.py
from feast import Entity, Feature, FeatureView, FileSource
from datetime import timedelta

# 定义数据源
user_stats_source = FileSource(
    path="data/user_stats.parquet",
    timestamp_field="event_timestamp"
)

# 定义实体
user = Entity(
    name="user_id",
    description="用户 ID"
)

# 定义特征视图
user_features = FeatureView(
    name="user_features",
    entities=["user_id"],
    ttl=timedelta(days=7),
    schema=[
        Feature(name="age", dtype=Float64),
        Feature(name="gender", dtype=String),
        Feature(name="total_purchases", dtype=Int64),
        Feature(name="last_login_days_ago", dtype=Int64),
    ],
    source=user_stats_source
)
```

### 4.4 注册特征

```bash
# 应用特征定义
feast apply

# 查看特征
feast feature-views list
```

### 4.5 获取特征

```python
from feast import FeatureStore

# 创建 store
store = FeatureStore(repo_path=".")

# 获取训练数据
training_df = store.get_historical_features(
    entity_df=user_df,  # 包含 user_id 和 timestamp
    feature_refs=[
        "user_features:age",
        "user_features:gender",
        "user_features:total_purchases"
    ]
).to_df()

print(training_df)
```

### 4.6 在线服务

```python
# 启动在线特征服务
from feast import FeatureStore

store = FeatureStore(repo_path=".")

# 获取在线特征
feature_vector = store.get_online_features(
    feature_refs=[
        "user_features:age",
        "user_features:gender",
        "user_features:total_purchases"
    ],
    entity_rows=[{"user_id": "user_123"}]
).to_dict()

print(feature_vector)
```

---

## 5. 高级特性

### 5.1 流式特征

```yaml
# stream_features.py
from feast import StreamFeatureView, KinesisSource
from feast.data_format import JsonFormat
from feast.infra.materialization import LambdaMaterializationEngine

# Kinesis 流源
kinesis_source = KinesisSource(
    stream_name="user_events",
    json_format=JsonFormat(),
    timestamp_field="event_timestamp",
    watermark_field="event_timestamp"
)

# 流式特征视图
@stream_feature_view(
    entities=[user],
    ttl=timedelta(hours=1),
    schema=[
        Feature(name="click_count_last_hour", dtype=Int64),
        Feature(name="avg_session_duration", dtype=Float64),
    ],
    sources=[kinesis_source]
)
def user_stream_features(df: DataFrame):
    # 窗口聚合
    return df.groupBy("user_id").agg(
        count("event").alias("click_count_last_hour"),
        avg("session_duration").alias("avg_session_duration")
    )
```

### 5.2 特征复用

```python
# 注册到共享特征仓库
store.apply([user_features, user_entities])

# 其他团队获取特征
store = FeatureStore(repo_path="shared_repo")
features = store.get_online_features(...)
```

---

## 6. 对比与选择

### 6.1 特征存储对比

| 维度 | Feast | Tecton | Databricks |
|------|-------|--------|------------|
| **开源** | ⭐⭐⭐⭐⭐ | ❌ | ❌ |
| **云原生** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **在线性能** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **成本** | 免费 | 付费 | 付费 |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 开源方案 | Feast |
| 企业级 | Tecton |
| Databricks 生态 | Databricks Feature Store |

---

## 参考资源

- [Feast GitHub](https://github.com/feast-dev/feast)
- [Feast 文档](https://docs.feast.dev/)
- [Feast 教程](https://docs.feast.dev/tutorials)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[16_AI_Ops/AIOps-in-nutshell.md|AIOps-in-nutshell]]
- [[16_AI_Ops/AI_Incident_Response_Playbook.md|AI_Incident_Response_Playbook]]
- [[16_AI_Ops/AI_Ops_for_dummy.md|AI_Ops_for_dummy]]
- [[16_AI_Ops/README.md|16_AI_Ops README]]
- [[16_AI_Ops/README_for_dummy.md|README_for_dummy]]
