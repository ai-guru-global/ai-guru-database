---
title: "特征平台基础"
category: 11-mlops-pipeline
subcategory: feature-store
tags: ["mlops", "feature-store", "feast", "tecton", "hopsworks", "alibaba-cloud"]
summary: "系统讲解特征平台（Feature Store）的价值、架构、在线/离线一致性，以及 Feast/Tecton/Hopsworks 的选型对比。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# 特征平台基础

> **一句话理解**: 特征平台就是模型的「中央厨房」——统一管理特征怎么做、怎么存、怎么给训练和服务用，避免训练和服务时用两套逻辑。

## 目录

- [1. 为什么需要特征平台](#1-为什么需要特征平台)
- [2. 核心概念](#2-核心概念)
- [3. 在线 vs 离线存储](#3-在线-vs-离线存储)
- [4. 主流工具对比](#4-主流工具对比)
- [5. 训练-服务一致性](#5-训练-服务一致性)
- [Related](#related)

---

## 1. 为什么需要特征平台

- **特征复用**: 不同模型共享特征
- **一致性**: 训练和推理用同一特征逻辑
- **低延迟**: 在线特征预计算与缓存
- **血缘追踪**: 知道特征从哪来、谁在用

## 2. 核心概念

| 概念 | 说明 |
|------|------|
| **Feature View** | 特征的抽象视图 |
| **Feature Service** | 对外提供特征查询的服务 |
| **Entity** | 特征关联的实体，如 user_id、item_id |
| **Feature Vector** | 一次推理所需的特征集合 |

## 3. 在线 vs 离线存储

| 类型 | 存储 | 用途 |
|------|------|------|
| **离线存储** | Delta Lake、Hive、BigQuery | 批量训练 |
| **在线存储** | Redis、DynamoDB、Aerospike | 低延迟推理 |

## 4. 主流工具对比

| 工具 | 定位 | 开源 |
|------|------|------|
| **Feast** | 开源特征平台，灵活 | 是 |
| **Tecton** | 企业级全托管 | 否 |
| **Hopsworks** | 数据湖屋 + 特征平台 | 是 |

## 5. 训练-服务一致性

- **统一特征定义**: Feature View 同时生成训练和在线特征
- **点-in-time 正确性**: 避免未来信息泄露
- **监控**: 在线/离线特征分布对比

---

## Related

- [[概念/feature-store|Feature Store]]
- [[概念/feast|Feast]]
- [[模型运维/Experiment_Tracking/Feature_Store_Deep_Dive|Feature Store 深度解析]]

- [[模型运维/README|MLOps 流水线 (MLOps Pipeline)]]
