---
title: "Data Validation"
category: -concepts
tags: ["mlops", "data-quality", "pipeline", "alibaba-cloud"]
summary: "Data Validation 是在 ML/LLM 训练流水线中对输入数据进行自动化校验的过程，确保数据符合预期的 schema、统计分布和语义质量。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "数据验证"
relationships:
  - target: "_concepts/mlops"
    type: part_of
  - target: "_concepts/great-expectations"
    type: implemented_by
  - target: "_concepts/pandera"
    type: implemented_by
---

# Data Validation

> **一句话理解**: 数据验证就是训练流水线的「质检员」——在数据进模型之前，自动检查它有没有缺字段、类型对不对、分布有没有漂移。

## 核心要点

- **四层验证**:
  - L0 Schema: 字段存在、类型、非空
  - L1 Statistics: 均值、方差、分位数、类别分布
  - L2 Distribution: 训练/服务数据分布漂移
  - L3 Semantic: 文本质量、毒性、PII、重复
- **CI/CD 门禁**: 验证失败可阻断训练任务。
- **工具**: Great Expectations、Pandera、Evidently、WhyLabs、Deequ。

## 常见规则

| 规则 | 目的 |
|------|------|
| expect_column_to_exist | 防止上游删字段 |
| expect_column_values_to_not_be_null | 防止空值 |
| expect_column_mean_to_be_between | 防止分布漂移 |
| expect_table_row_count_to_be_between | 防止数据量异常 |

## 阿里云专有云关联

在阿里云专有云环境中，数据验证任务常作为 ACK Job 或 Airflow DAG 运行，数据源来自盘古 OSS / MaxCompute / DataWorks，失败告警接入 ASCM。

## Related

- [[_concepts/great-expectations|Great Expectations]]
- [[_concepts/pandera|Pandera]]
- [[_concepts/evidently|Evidently]]
- [[_concepts/mlops|MLOps]]
- [[11_MLOps_Pipeline/Troubleshooting/Data_Validation_Failure_Runbook|数据验证失败 Runbook]]
