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

## 2026 Evidently 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Evidently 0.4+** | 新架构，性能提升 | GA |
| **LLM 评估** | LLM 输出质量监控 | GA |
| **数据漂移检测** | 自动检测数据分布变化 | GA |
| **模型性能监控** | 实时模型指标跟踪 | GA |
| **Evidently Cloud** | 托管监控平台 | GA |

## 架构：监控流程

```
数据/预测 → Evidently Report → 漂移检测 + 性能指标
                    ↓
        Dashboard / 告警 / 存储
```

## 代码示例：数据漂移检测

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset
import pandas as pd

# 准备数据
reference = pd.read_csv("reference_data.csv")  # 训练数据
current = pd.read_csv("current_data.csv")      # 生产数据

# 创建报告
report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=reference, current_data=current)

# 保存报告
report.save_html("drift_report.html")

# 获取结果
drift_summary = report.as_dict()
print(f"漂移特征数: {drift_summary['metrics'][0]['result']['number_of_drifted_columns']}")
```

## 代码示例：模型性能监控

```python
from evidently.metric_preset import RegressionPreset

# 回归模型监控
report = Report(metrics=[RegressionPreset()])
report.run(
    reference_data=reference,
    current_data=current,
    column_mapping=ColumnMapping(
        target="target",
        prediction="prediction",
        numerical_features=["age", "income"],
    )
)
```

## 监控指标

| 指标 | 说明 | 告警阈值 |
|------|------|------|
| **数据漂移** | 特征分布变化 | p-value < 0.05 |
| **目标漂移** | 目标变量分布变化 | p-value < 0.05 |
| **模型性能** | MAE/RMSE/R² | 下降 > 10% |
| **数据质量** | 缺失值/异常值 | 缺失 > 5% |

## 延伸阅读

- [[概念/MLOps/whylogs|WhyLogs]] — 数据日志监控
- [[概念/MLOps/grafana|Grafana]] — 可视化仪表板
- [[概念/MLOps/prometheus|Prometheus]] — 指标监控

> ℹ️ Evidently 是开源 ML 监控框架，提供数据漂移检测、模型性能监控和数据质量检查。

## 生产最佳实践

1. **基线建立**：用训练数据建立参考基线
2. **定期检测**：每日/每周运行漂移检测
3. **告警阈值**：设置合理的告警阈值
4. **多指标监控**：同时监控漂移和性能
5. **与 Grafana 集成**：可视化监控结果
6. **自动化报告**：定期生成监控报告
7. **LLM 监控**：LLM 输出质量监控
8. **数据质量**：监控缺失值/异常值
9. **模型重训触发**：漂移严重时触发重训
10. **历史趋势**：跟踪指标历史变化

## 检查清单

- [ ] 参考基线已建立
- [ ] 漂移检测已配置
- [ ] 模型性能监控已配置
- [ ] 告警机制已配置
- [ ] 监控结果可视化
- [ ] 定期生成报告

## 工具对比

| 工具 | 适用场景 | 特点 |
|------|------|------|
| **Evidently** | ML 监控 | 开源、全面 |
| **WhyLogs** | 数据日志 | 轻量 |
| **Fiddler** | 企业级 | 商业 |
| **Arize** | ML 可观测 | 商业 |

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 漂移误报 | 调整阈值 |
| 性能问题 | 采样检测 |
| 报告太大 | 精简指标 |
| 集成复杂 | 用 Evidently Cloud |
