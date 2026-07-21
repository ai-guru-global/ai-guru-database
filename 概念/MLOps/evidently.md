---
title: "Evidently"
category: -concepts
tags: ["mlops", "data-quality", "drift-detection", "observability", "llm-evaluation"]
summary: "Evidently 是开源的 ML/LLM 数据漂移与模型质量监测工具，支持数据漂移、目标漂移、模型性能退化和文本数据质量评估。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
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

> **一句话理解**: Evidently 专门监控「模型输入数据和输出有没有变坏」，自动发现数据漂移和质量退化。

## 定义

Evidently 是开源的 ML/LLM 可观测性平台，提供数据漂移检测、模型质量监控、数据质量评估和 LLM 输出评估，支持从实验到生产的全生命周期监控。

## 核心能力

| 能力 | 说明 | 典型指标 |
|------|------|----------|
| **数据漂移** | 输入分布偏移 | PSI, KS, Wasserstein |
| **目标漂移** | 标签分布变化 | 分类/回归指标 |
| **模型性能** | 精度退化 | Accuracy, F1, RMSE |
| **数据质量** | 缺失/重复/异常 | 空值率、唯一值 |
| **LLM 评估** | 幻觉/毒性/相关性 | 自动评分 |
| **文本质量** | NLP 数据健康 | 长度分布、毒性 |

## 漂移检测指标详解

| 指标 | 原理 | 适用场景 |
|------|------|----------|
| **PSI** | 群体稳定性指数 | 分类特征漂移 |
| **KS Statistic** | 累积分布差异 | 连续特征漂移 |
| **Wasserstein** | 分布间距离 | 连续特征 |
| **Jensen-Shannon** | 分布相似度 | 通用 |
| **MMD** | 最大均值差异 | 高维特征 |

## 代码示例

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset
import pandas as pd

# 加载参考数据（训练集）和当前数据（生产）
reference = pd.read_csv("train_data.csv")
current = pd.read_csv("production_data.csv")

# 生成漂移报告
report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=reference, current_data=current)
report.save_html("drift_report.html")
```

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **当前版本** | Evidently 2.x |
| **LLM 监控** | 支持幻觉、毒性、相关性自动评估 |
| **集成** | Prometheus/Grafana/Airflow/MLflow |
| **部署模式** | Python SDK + 自托管服务 |
| **与 WhyLabs 对比** | Evidently 开源免费，WhyLabs 商业化 |

## 生产最佳实践

1. **定时运行**：CronJob/Airflow DAG 每日检查漂移
2. **设置告警阈值**：PSI > 0.2 触发告警
3. **与 Grafana 集成**：导出 Prometheus 指标可视化
4. **LLM 场景必用**：监控幻觉率、拒答率、毒性
5. **基线管理**：用训练集作为 reference，定期更新

## Related

- [[概念/data-validation|Data Validation]]
- [[概念/whylogs|WhyLabs / WhyLogs]]
- [[概念/mlops|MLOps]]
- [[概念/Safety/hallucination|Hallucination]] — LLM 幻觉监控
