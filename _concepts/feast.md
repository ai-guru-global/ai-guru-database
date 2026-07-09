---
title: "Feast (开源特征存储平台)"
category: -concepts
tags: ["feature-store", "ml-infrastructure", "data-engineering", "real-time", "batch"]
relationships:
  - target: "_concepts/mlflow"
    type: related_to
  - target: "_concepts/whylogs"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Tecton 开源的特征存储（Feature Store）平台，统一管理 ML 模型的特征定义、计算、存储和服务，支持离线批量和在线实时两种模式。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
---

# Feast (Feature Store)

[Feast](https://github.com/feast-dev/feast)（Feature Store）是 [Tecton](https://www.tecton.ai/) 开源的**特征存储平台**，统一管理 ML 模型的特征定义、计算、存储和服务。它解决的核心问题是 **Training-Serving Skew**（训练与推理的数据不一致）——通过统一的特征定义和存储层，确保模型训练时使用的特征和在线推理时获取的特征**完全一致**。

## 核心架构

```
Feast 架构:

┌─────────────────────────────────┐
│        Feature Repository        │
│   (Git-based, 特征定义)          │
│   feature_store.yaml             │
│   features.py                    │
└──────────┬──────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐  ┌────────────┐
│ Offline │  │  Online    │
│ Store   │  │  Store     │
│(BigQuery│  │ (Redis/    │
│ Spark/  │  │  DynamoDB) │
│ Snowflake│ │            │
└────┬───┘  └─────┬──────┘
     │             │
     ▼             ▼
  Training     Serving
  (批量特征)    (实时特征)
```

## 核心特性

### 1. 特征定义

```python
from feast import Entity, FeatureView, Field
from feast.types import Float32, Int64, String
import pandas as pd

# 定义实体
driver = Entity(name="driver_id", join_keys=["driver_id"])

# 定义特征视图
driver_stats = FeatureView(
    name="driver_stats",
    entities=[driver],
    schema=[
        Field(name="conv_rate", dtype=Float32),
        Field(name="acc_rate", dtype=Float32),
        Field(name="avg_daily_trips", dtype=Int64),
    ],
    source=driver_stats_source,  # BigQuery/S3/...
    ttl=timedelta(days=1),
    online=True,
)
```

### 2. 离线特征获取（训练）

```python
from feast import FeatureStore

store = FeatureStore(repo_path=".")

# 获取训练特征
training_df = store.get_historical_features(
    entity_df=pd.DataFrame({
        "driver_id": [1001, 1002, 1003],
        "event_timestamp": [datetime.now()] * 3
    }),
    features=[
        "driver_stats:conv_rate",
        "driver_stats:acc_rate",
        "driver_stats:avg_daily_trips"
    ]
).to_df()

# training_df 可直接用于模型训练
model.fit(training_df[features], training_df[label])
```

### 3. 在线特征服务（推理）

```python
# 在线特征获取 (低延迟)
online_features = store.get_online_features(
    features=[
        "driver_stats:conv_rate",
        "driver_stats:acc_rate",
    ],
    entity_rows=[{"driver_id": 1001}]
)

# 毫秒级延迟返回特征
# → 传入模型进行在线推理
```

### 4. 特征注册表

```bash
# 应用特征定义到 Feast
feast apply

# 列出所有特征
feast features list

# 物化特征到在线存储
feast materialize-incremental $(date -u +"%Y-%m-%dT%H:%M:%S")
```

## 支持的存储后端

| 类型 | 离线存储 | 在线存储 |
|------|----------|----------|
| **云原生** | BigQuery, Snowflake, Redshift | Redis, DynamoDB |
| **开源** | Spark, PostgreSQL | Redis, Cassandra |
| **文件** | Parquet, Delta Lake | SQLite |

## 典型应用场景

- **推荐系统**: 用户特征 + 物品特征的实时服务
- **欺诈检测**: 实时交易特征计算
- **预测性维护**: 设备状态的批量+实时特征
- **个性化**: 用户偏好的在线特征服务

## 安装

```bash
pip install feast

# 初始化项目
feast init my_feature_store
cd my_feature_store
feast apply
```

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: feast-feature-server
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: feast
        image: feast-serve:latest
        ports:
        - containerPort: 6566
        env:
        - name: FEAST_REPO_PATH
          value: "/app/feature_repo"
        - name: REDIS_HOST
          value: "redis-svc"
```

## 参考资源

- [Feast GitHub](https://github.com/feast-dev/feast)
- [Feast 文档](https://docs.feast.dev/)
- [Tecton](https://www.tecton.ai/)

## 相关概念

- [[_concepts/mlflow]] — MLflow 实验追踪与模型管理
- [[_concepts/whylogs]] — whylogs 数据质量与 ML 可观测性
- [[_concepts/feature-store]] — Feature Store 特征存储概念
