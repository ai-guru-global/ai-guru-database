---
title: "数据验证与质量"
category: 11-mlops-pipeline
subcategory: data-engineering
tags: ["mlops", "data-quality", "data-validation", "great-expectations", "pandera", "evidently", "alibaba-cloud"]
summary: "系统讲解 ML/LLM 数据验证的方法论、工具与流水线集成，确保训练数据符合 schema、分布与语义质量要求。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

# 数据验证与质量

> **一句话理解**: 数据验证就是训练前的「体检」，schema、统计分布、语义质量都得过关，否则模型会学到错误的东西。

## 目录

- [1. 四层验证](#1-四层验证)
- [2. 常用工具](#2-常用工具)
- [3. 集成到流水线](#3-集成到流水线)
- [4. 漂移检测](#4-漂移检测)
- [Related](#related)

---

## 1. 四层验证

| 层级 | 检查内容 |
|------|---------|
| L0 Schema | 字段存在、类型正确、非空约束 |
| L1 Statistics | 均值、方差、分位数、类别分布 |
| L2 Distribution | 训练/服务数据分布漂移 |
| L3 Semantic | 文本质量、毒性、PII、重复 |

## 2. 常用工具

| 工具 | 特点 |
|------|------|
| **Great Expectations** | 声明式 expectation suite、Data Docs |
| **Pandera** | DataFrame schema 校验，轻量 |
| **Evidently** | 漂移检测、模型质量监控 |
| **WhyLabs** | 大规模数据画像与监控 |
| **Deequ** | Spark 数据质量 |

## 3. 集成到流水线

```yaml
# CI 门禁示例
data_validation:
  stage: test
  script:
    - python validate.py
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

## 4. 漂移检测

- **PSI**: Population Stability Index
- **KS**: Kolmogorov-Smirnov
- **Wasserstein**: 连续分布距离
- **Jensen-Shannon**: 分布相似度

---

## Related

- [[_concepts/data-validation|Data Validation]]
- [[_concepts/great-expectations|Great Expectations]]
- [[_concepts/pandera|Pandera]]
- [[_concepts/evidently|Evidently]]
- [[MLOps/Troubleshooting/Data_Validation_Failure_Runbook|数据验证失败 Runbook]]
