---
title: "PAI"
category: -concepts
tags: ["alibaba-cloud", "pai", "machine-learning", "llm", "training", "inference", "alibaba-cloud"]
summary: "PAI（Platform of Artificial Intelligence）是阿里云一站式人工智能平台，提供模型开发、训练、部署、推理全链路能力，包括 PAI-DSW、PAI-DLC、PAI-EAS 等核心产品。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "Platform of Artificial Intelligence"
  - "阿里云 PAI"
  - "阿里云人工智能平台"
relationships:
  - target: "_concepts/alibaba-cloud"
    type: part_of
  - target: "_concepts/ack"
    type: runs_on
  - target: "_concepts/mlops"
    type: related_to
---

# PAI

> **一句话理解**: PAI 是阿里云上一站式 AI 平台，从写代码的 Notebook（DSW）、跑训练任务（DLC）到部署推理服务（EAS），全链路覆盖。

## 核心要点

- **PAI-DSW**: 交互式开发环境（Notebook），支持 GPU/CPU 实例。
- **PAI-DLC**: 深度学习训练集群，支持分布式训练、超参调优。
- **PAI-EAS**: 弹性推理服务，支持模型在线部署、自动扩缩容、A/B 测试。
- **PAI-Designer**: 可视化建模与拖拽式流水线。
- **PAI-FeatureStore**: 特征平台。
- **与 ACK 集成**: PAI-DLC/EAS 底层可运行在 ACK 容器集群上。

## 产品矩阵

| 产品 | 能力 | 典型场景 |
|------|------|---------|
| PAI-DSW | Notebook 开发 | 模型调试、数据分析 |
| PAI-DLC | 分布式训练 | LLM 预训练、微调 |
| PAI-EAS | 在线推理 | LLM 服务、A/B 测试 |
| PAI-Designer | 可视化建模 | 传统 ML 建模 |
| PAI-FeatureStore | 特征管理 | 推荐系统 |

## 阿里云专有云关联

在阿里云专有云环境中，PAI 提供私有化部署版本，底层依赖 ACK 专有/敏捷版、飞天 Apsara、洛神 Luoshen、盘古 Pangu。工单中「PAI 任务失败」通常需要同时查看 PAI 控制台日志和底层 ACK Pod 事件。

## Related

- [[_concepts/alibaba-cloud|Alibaba Cloud]]
- [[_concepts/ack|ACK]]
- [[_concepts/mlops|MLOps]]
- [[12_Architecture_Infrastructure/Cloud_Providers/Alibaba_PAI_Deep_Dive|阿里云 PAI 深度解析]]
- [[12_Architecture_Infrastructure/Alibaba_Cloud_Proprietary_K8s_Context|阿里云专有云 K8s 上下文]]
