---
title: "Evidently"
category: -concepts
tags: ["mlops", "data-quality", "drift-detection", "observability", "alibaba-cloud"]
summary: "Evidently 是开源的 ML/LLM 数据漂移与模型质量监测工具，支持数据漂移、目标漂移、模型性能退化和文本数据质量评估。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Evidently AI"
relationships:
  - target: "概念/data-validation"
    type: related_to
  - target: "概念/mlops"
    type: related_to
sources: []
---

# Evidently

> **一句话理解**: Evidently 是一个专门监控「模型输入数据和输出有没有变坏」的工具，能自动发现数据漂移和质量退化。

## 核心要点

- **漂移检测**: 数据漂移、特征漂移、目标漂移。
- **模型质量**: 分类/回归/NLP/推荐指标。
- **文本数据质量**: 重复、缺失、长度分布、毒性。
- **报告与监控**: 生成 HTML 报告，也可导出 Prometheus 指标。
- **集成**: Pandas、Spark、MLflow、Airflow。

## 常见指标

| 指标 | 用途 |
|------|------|
| PSI | 群体稳定性指数 |
| KS Statistic | 分布差异 |
| Wasserstein Distance | 连续特征漂移 |
| Jensen-Shannon Divergence | 分布相似度 |

## 阿里云专有云关联

在阿里云专有云 MLOps 流水线中，Evidently 可部署为 ACK CronJob 或 Airflow DAG，对生产流量与训练基线进行漂移监控，告警接入 ASCM。

## Related

- [[概念/data-validation|Data Validation]]
- [[概念/whylogs|WhyLabs / WhyLogs]]
- [[概念/mlops|MLOps]]
