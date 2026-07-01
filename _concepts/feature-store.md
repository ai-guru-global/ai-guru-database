---
title: "Feature Store (特征存储)"
category: "_concepts"
tags: ["feature-store", "mlops", "feature-engineering", "real-time", "offline", "feast"]
summary: "Feature Store 是 ML 系统中特征的统一管理平台——解决特征的复用、一致性、实时性和版本控制问题。"
created: "2026-06-25"
updated: "2026-06-25"
tier: core
aliases:
  - "Feature Store"
  - "特征存储"
  - "Feature Registry"

---
# Feature Store (特征存储)

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

- [[11_MLOps_Pipeline/Experiment_Tracking/Feature_Store_Deep_Dive]] — Feature Store 深度解析
- [[11_MLOps_Pipeline/Experiment_Tracking/Feast_Deep_Dive]] — Feast 框架深度解析
- [[_concepts/experiment-tracking]] — 实验追踪概念
- [[14_RAG_Systems/Vector_Databases]] — 向量数据库（非结构化特征存储）
