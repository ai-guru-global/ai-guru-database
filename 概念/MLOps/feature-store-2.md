---
title: "Feature Store 2.0 (Tecton / Feast / Databricks / LLM 特征 / 实时特征)"
category: concepts
tags:
  - mlops
  - feature-store
  - tecton
  - feast
  - databricks
  - online-features
  - llm-features
aliases:
  - Feature Store 2.0
  - Tecton
  - Feast
  - Databricks Feature Store
  - Online Features
  - LLM Feature Store
relationships:
  - target: "概念/feature-store"
    type: extends
  - target: "概念/online-evaluation"
    type: related_to
  - target: "概念/mlops"
    type: related_to
  - target: "概念/rag"
    type: related_to
summary: "Feature Store 2.0 是 2024-2026 突破"特征管理碎片化"的关键——Tecton(企业级实时特征)、Feast(开源 2.0)、Databricks Feature Store、AWS SageMaker Feature Store、LLM Feature Store(RAG + Agent 特征)。从传统 ML 特征(用户画像)扩展到 LLM 特征(对话历史、工具结果、检索上下文)。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# Feature Store 2.0

> **一句话理解**:Feature Store 2.0 把 ML 特征管理与 LLM 上下文管理融合——Tecton(企业级实时特征)/ Feast(开源 2.0) / Databricks Feature Store 是传统 ML 标配,LLM Feature Store 把"对话历史 / 工具结果 / 检索上下文"作为特征管理。是 Agent / RAG / 个性化 LLM 的基础设施。

---

## 一、为什么需要 Feature Store 2.0?

传统 ML 特征管理的痛点:
- 训练 / 推理特征不一致(Offline/Online Skew)
- 实时特征难管理
- 跨团队共享难
- 特征监控缺失

LLM 时代的新需求:
- **对话历史**:作为特征给 LLM
- **检索上下文**:RAG 检索结果
- **工具调用结果**:Agent 工具历史
- **用户画像**:个性化 LLM 响应
- **实时上下文**:当前时间、位置、状态

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 特征存储 | Feature Store | ML 特征管理 |
| 训练-推理偏移 | Training-Serving Skew | Offline/Online 不一致 |
| 实时特征 | Online Features | 毫秒级获取 |
| 批特征 | Batch Features | 离线批处理 |
| 流式特征 | Streaming Features | Kafka/Flink 计算 |
| 特征视图 | Feature View | 一组相关特征 |
| 特征服务 | Feature Serving | API 暴露 |
| 特征注册 | Feature Registry | 特征元数据管理 |
| 特征工程 | Feature Engineering | 特征计算 |
| 特征版本化 | Feature Versioning | 特征可追溯 |
| 特征监控 | Feature Monitoring | 漂移检测 |
| 时间旅行 | Point-in-Time Join | 避免数据泄露 |
| 数据泄露 | Data Leakage | 未来数据泄露到训练 |
| 特征管线 | Feature Pipeline | 计算 + 存储 + 服务 |
| Iceberg | Apache Iceberg | 表格式 |
| 特征发现 | Feature Discovery | 找到已有特征 |
| 特征复用 | Feature Reuse | 跨模型复用 |
| 特征血缘 | Feature Lineage | 特征来源追溯 |
| 特征质量 | Feature Quality | 准确率/缺失率 |
| LLM 特征 | LLM Features | LLM 上下文特征 |

---

## 三、主流 Feature Store 对比(2026-02 快照)

| 平台 | 厂商 | 类型 | 实时 | 特色 | 许可证 |
|---|---|---|---|---|---|
| **Tecton** | Tecton | 企业 | 毫秒级 | Snowflake / Databricks 集成 | 商业 |
| **Feast** | Feast | 开源 | 亚秒级 | GitOps 风格 | Apache 2.0 |
| **Databricks Feature Store** | Databricks | 云 | 毫秒级 | Unity Catalog 集成 | 商业 |
| **AWS SageMaker Feature Store** | AWS | 云 | 毫秒级 | SageMaker 生态 | 商业 |
| **GCP Vertex AI Feature Store** | Google | 云 | 毫秒级 | BigQuery 集成 | 商业 |
| **阿里 PAI FeatureStore** | 阿里云 | 云 | 毫秒级 | PAI 生态 | 商业 |
| **Hopsworks** | Hopsworks | 开源 | 毫秒级 | Feature Store + MLOps | Apache 2.0 |
| **Feathr** | LinkedIn | 开源 | 亚秒级 | LinkedIn 内部 | Apache 2.0 |
| **Iguazio** | Iguazio | 企业 | 毫秒级 | 端到端 MLOps | 商业 |
| **LLM Feature Store** | 新兴 | 实验 | 毫秒级 | 对话/检索/工具特征 | 多种 |

---

## 四、Feast 2.0 实战(开源主流)

### 4.1 安装

```bash
pip install feast
feast init my_project
```

### 4.2 定义特征

```python
# feature_repo/features.py
from feast import FeatureView, Field, FileSource
from feast.types import Float64, Int64, String
from datetime import timedelta

driver_stats_source = FileSource(
    name="driver_stats_source",
    path="data/driver_stats.parquet",
    timestamp_field="event_timestamp",
)

driver_stats_fv = FeatureView(
    name="driver_stats",
    entities=["driver_id"],
    ttl=timedelta(days=1),
    schema=[
        Field(name="conv_rate", dtype=Float64),
        Field(name="acc_rate", dtype=Float64),
        Field(name="avg_daily_trips", dtype=Int64),
    ],
    source=driver_stats_source,
    online=True,  # 启用在线服务
)
```

### 4.3 部署

```bash
feast apply  # 注册特征
feast materialize-incremental $(date -u +"%Y-%m-%dT%H:%M:%S")  # 物化
```

### 4.4 在线推理

```python
from feast import FeatureStore

fs = FeatureStore(repo_path="feature_repo")

# 获取在线特征
features = fs.get_online_features(
    features=[
        "driver_stats:conv_rate",
        "driver_stats:acc_rate",
    ],
    entity_rows=[{"driver_id": 1001}],
).to_dict()
```

### 4.5 历史特征(训练)

```python
job = fs.get_historical_features(
    entity_df=entities_df,
    features=["driver_stats:conv_rate", ...],
)
```

---

## 五、Tecton 实战(企业级)

### 5.1 核心优势

- 完整功能(实时 + 批 + 流)
- Snowflake / Databricks / Spark 集成
- 强一致性 SLA
- 企业级 SLA(99.99%)

### 5.2 实时特征

- 毫秒级新鲜度
- 流式窗口(Tumbling / Sliding)
- 复杂事件处理

---

## 六、LLM Feature Store 新范式

### 6.1 特征类型

| 特征 | 来源 | 用途 |
|---|---|---|
| 对话历史 | 实时 | LLM 多轮对话 |
| 用户画像 | 批 | 个性化 LLM 响应 |
| 检索结果 | 实时 | RAG 上下文 |
| 工具调用结果 | 实时 | Agent 决策 |
| 知识图谱实体 | 批 | GraphRAG |
| 反馈评分 | 实时 | 优化 prompt / 模型 |
| 任务成功率 | 实时 | 路由决策 |
| 用户偏好 | 实时 | 个性化 |

### 6.2 实施模式

- **对话特征**:用 Mem0 / Zep 替代
- **检索特征**:用向量库(短期)+ Mem0(长期)
- **用户画像**:用 Feature Store(Feast / Tecton)
- **工具结果**:用 Agent 框架(AutoGen / LangGraph)

### 6.3 案例

- **Salesforce Einstein**:Feature Store + LLM 集成
- **Palantir Foundry**:LLM 特征 + Foundry Agent
- **Microsoft Fabric**:OneLake + LLM 特征

---

## 七、生产最佳实践

1. **首选 Feast(开源)**:小团队友好,GitOps 风格。
2. **企业级选 Tecton**:SLA 强,功能全。
3. **Databricks 生态选 Databricks Feature Store**:Unity Catalog 集成。
4. **LLM 特征分两类**:对话 / 检索(短期,用向量库) / 用户画像(长期,用 Feature Store)。
5. **Point-in-Time Join 必做**:避免数据泄露。
6. **特征监控**:漂移检测、缺失率、延迟。
7. **特征版本化**:特征可追溯,与模型版本对应。
8. **特征复用**:跨模型 / 跨团队复用,避免重复计算。
9. **A/B 测试**:新特征先小流量测试。
10. **离线/在线一致**:用同一份特征定义,部署两次。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Tecton** | v1.0,企业级 SOTA |
| **Feast** | v0.40,GitOps 风格 |
| **Databricks Feature Store** | Unity Catalog 集成 |
| **AWS SageMaker** | 与 Bedrock 集成 |
| **LLM Feature Store** | 新兴范式,2026 主旋律 |
| **Iceberg** | 特征存储标准格式 |
| **市场规模** | Feature Store ARR $500M+ |
| **主要竞品** | Tecton / Feast / Databricks / SageMaker / Hopsworks |

---

## 九、See Also(官方源)

### 开源

- Feast [github.com/feast-dev/feast](https://github.com/feast-dev/feast)
- Feast 文档 [docs.feast.dev](https://docs.feast.dev/)
- Hopsworks [github.com/logicalclocks/hopsworks](https://github.com/logicalclocks/hopsworks)
- Feathr [github.com/feathr-ai/feathr](https://github.com/feathr-ai/feathr)

### 商业

- Tecton [tecton.ai](https://www.tecton.ai/)
- Databricks Feature Store [docs.databricks.com/machine-learning/feature-store](https://docs.databricks.com/machine-learning/feature-store/index.html)
- SageMaker Feature Store [aws.amazon.com/sagemaker/feature-store](https://aws.amazon.com/sagemaker/feature-store/)
- Vertex AI Feature Store [cloud.google.com/vertex-ai](https://cloud.google.com/vertex-ai)

### LLM Feature Store

- Mem0 [github.com/mem0ai/mem0](https://github.com/mem0ai/mem0)
- Zep [github.com/getzep/zep](https://github.com/getzep/zep)
- Letta [github.com/letta-ai/letta](https://github.com/letta-ai/letta)

### 相关

- Apache Iceberg [iceberg.apache.org](https://iceberg.apache.org/)
- Unity Catalog [github.com/unitycatalog/unitycatalog](https://github.com/unitycatalog/unitycatalog)

---

## 十、相关概念卡

- [[概念/feature-store|Feature Store]]
- [[概念/online-evaluation|Online Evaluation]]
- [[概念/mlops|Mlops]]
- [[概念/rag|Rag]]
- [[概念/agent-memory-2|Agent Memory 2]]
- [[概念/llm-production-pipeline|Llm Production Pipeline]]
- [[概念/data-pipeline|Data Pipeline]]
- [[概念/experiment-tracking|Experiment Tracking]]
