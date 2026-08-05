---
title: "Feature Store (特征存储)"
category: "概念"
tags: ["feature-store", "mlops", "feature-engineering", "real-time", "offline", "feast"]
summary: "Feature Store 是 ML 系统中特征的统一管理平台——解决特征的复用、一致性、实时性和版本控制问题。"
created: "2026-06-25"
updated: "2026-07-21"
tier: core
aliases:
  - "Feature Store"
  - "特征存储"
  - "Feature Registry"
sources: []

name_zh: "特征存储"
---
# Feature Store (特征存储)

> 中文简称：特征存储

> **一句话定义**: Feature Store 是 ML 系统的"特征仓库"——将特征的定义、计算、存储和服务统一管理，确保训练和推理使用完全一致的特征（Training-Serving Consistency）。

---

## 核心问题

在没有 Feature Store 的团队中，常见三个痛点：

1. **特征重复计算**: 团队 A 和团队 B 各自计算了"用户 30 天消费总额"，逻辑略有不同
2. **训练-推理偏差 (Training-Serving Skew)**: 训练时用 T+1 批量特征，推理时需要实时特征，两者不一致
3. **特征不可复用**: 优秀的特征散落在各个 Jupyter Notebook 中，无法共享

---

## 架构

```
┌──────────────────────────────────────────┐
│            Feature Store                  │
│  ┌─────────────┐   ┌──────────────────┐  │
│  │ Offline Store│   │  Online Store    │  │
│  │ (S3/BigQuery)│   │ (Redis/DynamoDB) │  │
│  │ 批量特征      │   │  实时特征         │  │
│  └──────┬───────┘   └────────┬─────────┘  │
│         │                    │             │
│  ┌──────┴────────────────────┴──────────┐ │
│  │         Feature Registry              │ │
│  │    (特征元数据、定义、血缘、版本)        │ │
│  └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
     ↕ 训练时读取               ↕ 推理时读取
  [模型训练]              [推理服务]
```

### 双存储架构

| 存储 | 数据源 | 延迟 | 用途 |
|------|--------|------|------|
| **Offline Store** | S3 / BigQuery / Hive | 分钟-小时 | 训练数据回溯、批量特征计算 |
| **Online Store** | Redis / DynamoDB / Cassandra | 毫秒 | 推理时实时特征获取 |

---

## 核心概念

| 概念 | 说明 |
|------|------|
| **Entity** | 特征关联的实体（如 User、Product、Session） |
| **Feature View** | 一组特征的逻辑定义（包含数据源和变换逻辑） |
| **Feature Service** | 对外暴露的特征获取接口（推理时调用） |
| **Point-in-Time Join** | 按时间点精确获取特征（避免数据泄漏） |

---

## 主流工具

| 工具 | 开源 | 特点 |
|------|------|------|
| **Feast** | ✅ | 最成熟的开源方案，Python 原生 |
| **Tecton** | 商业 | 企业级，Databricks 团队创立 |
| **Hopsworks** | ✅ (部分) | 集成 Spark/Flink 流处理 |
| **AWS SageMaker FS** | 商业 | AWS 生态集成 |

---

## LLM 时代的 Feature Store

传统 Feature Store 主要服务于结构化特征的 ML 模型。在 LLM 时代，"特征"的概念扩展为：

- **Embedding Store**: 向量数据库（Milvus/Chroma）可视为"非结构化特征存储"
- **Prompt Context**: RAG 中检索到的上下文是 LLM 的"动态特征"
- **用户画像**: 长期记忆（如用户偏好 embedding）存储在向量库中

---

## Related

- [[11_模型运维/04_实验追踪/Feature_Store_Deep_Dive]] — Feature Store 深度解析
- [[11_模型运维/04_实验追踪/04_Feast_深入分析]] — Feast 框架深度解析
- [[概念/experiment-tracking]] — 实验追踪概念
- [[14_RAG系统/03_向量数据库/index]] — 向量数据库（非结构化特征存储）

---

## 2026 Feature Store 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Feast** | 开源 Feature Store | GA |
| **Tecton** | 企业级 Feature Store | GA |
| **Hopsworks** | 全功能 ML 平台 | GA |
| **在线/离线存储** | 双存储架构 | GA |
| **特征监控** | 特征漂移检测 | GA |

## 生产最佳实践

1. **特征复用**：用 Feature Store 实现特征复用
2. **在线/离线一致**：确保在线/离线特征一致性
3. **特征监控**：监控特征漂移，及时告警
4. **与训练集成**：Feature Store 与训练流水线集成
5. **权限控制**：特征访问权限控制

## 2026 Feature Store 生态

| 工具 | 说明 | 状态 |
|------|------|------|
| **Feast** | 开源 Feature Store | GA |
| **Tecton** | 企业级 Feature Store | GA |
| **Hopsworks** | 开源 + 企业版 | GA |
| **AWS SageMaker FS** | AWS 托管 | GA |
| **Databricks FS** | Databricks 集成 | GA |

## 架构：Feature Store 流程

```
数据源 → 特征计算 → Feature Store (离线/在线)
                          ↓
        训练: 离线特征 → 训练数据
        推理: 在线特征 → 实时预测
```

## Feast 示例

```python
from feast import FeatureStore, Entity, FeatureView, Field
from feast.types import Float32, Int64
from datetime import timedelta

# 定义实体
user = Entity(name="user_id", join_keys=["user_id"])

# 定义特征视图
user_features = FeatureView(
    name="user_features",
    entities=[user],
    ttl=timedelta(days=7),
    schema=[
        Field(name="age", dtype=Int64),
        Field(name="income", dtype=Float32),
        Field(name="click_rate", dtype=Float32),
    ],
    source=BigQuerySource(
        table="project.dataset.user_features",
        timestamp_field="event_timestamp",
    ),
)

# 获取训练数据
store = FeatureStore(repo_path=".")
training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["user_features:age", "user_features:income"],
).to_df()

# 获取在线特征
features = store.get_online_features(
    features=["user_features:age", "user_features:click_rate"],
    entity_rows=[{"user_id": 123}],
).to_dict()
```

## 延伸阅读

- [[概念/MLOps/data-pipeline|Data Pipeline]] — 数据管道
- [[概念/MLOps/experiment-tracking|Experiment Tracking]] — 实验跟踪
- [[概念/MLOps/model-registry|Model Registry]] — 模型注册

> ℹ️ Feature Store 是 ML 特征管理平台，实现特征复用、一致性保证和实时/离线特征服务。

## 生产最佳实践

1. **特征目录**：建立特征目录，方便发现和复用
2. **特征监控**：监控特征漂移，及时告警
3. **与训练集成**：Feature Store 与训练流水线集成
4. **权限控制**：特征访问权限控制
5. **特征版本**：特征定义版本控制
6. **在线/离线一致**：保证训练和推理特征一致
7. **特征血缘**：跟踪特征来源和转换
8. **性能优化**：在线特征低延迟服务

## 检查清单

- [ ] 特征目录已建立
- [ ] 特征监控已配置
- [ ] 在线/离线特征一致
- [ ] 权限控制已配置
- [ ] 特征版本控制已启用
