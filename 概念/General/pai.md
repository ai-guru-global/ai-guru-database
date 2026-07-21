---
title: "PAI"
category: -concepts
tags: ["alibaba-cloud", "pai", "machine-learning", "llm", "training", "inference", "alibaba-cloud"]
summary: "PAI（Platform of Artificial Intelligence）是阿里云一站式人工智能平台，提供模型开发、训练、部署、推理全链路能力，包括 PAI-DSW、PAI-DLC、PAI-EAS 等核心产品。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "Platform of Artificial Intelligence"
  - "阿里云 PAI"
  - "阿里云人工智能平台"
relationships:
  - target: "概念/alibaba-cloud"
    type: part_of
  - target: "概念/ack"
    type: runs_on
  - target: "概念/mlops"
    type: related_to
sources: []
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

- [[概念/alibaba-cloud|Alibaba Cloud]]
- [[概念/ack|ACK]]
- [[概念/mlops|MLOps]]
- [[架构基建/Cloud_Providers/Alibaba_PAI_Deep_Dive|阿里云 PAI 深度解析]]
- [[架构基建/Alibaba_Cloud_Proprietary_K8s_Context|阿里云专有云 K8s 上下文]]

---

## 2026 PAI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **PAI-Designer** | 可视化建模 | GA |
| **PAI-DSW** | Notebook 开发 | GA |
| **PAI-DLC** | 分布式训练 | GA |
| **PAI-EAS** | 模型推理服务 | GA |
| **PAI-Blade** | 推理优化 | GA |

## 生产最佳实践

1. **可视化建模**：快速原型用 PAI-Designer
2. **Notebook 开发**：探索性分析用 PAI-DSW
3. **分布式训练**：大模型训练用 PAI-DLC
4. **推理服务**：模型部署用 PAI-EAS
5. **推理优化**：推理加速用 PAI-Blade
