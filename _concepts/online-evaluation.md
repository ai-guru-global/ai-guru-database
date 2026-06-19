---
title: "在线评估"
category: concepts
tags: ["online-evaluation", "ab-testing", "model-evaluation", "deployment", "shadow-deployment"]
relationships:
  - target: "_concepts/model-evaluation"
    type: belongs_to
  - target: "_concepts/ab-testing-framework"
    type: implements
  - target: "_concepts/model-deployment"
    type: follows
sources:
  - 08_Model_Evaluation/Online_Evaluation.md
  - 11_MLOps_Pipeline/LLM_Evaluation_Pipeline.md
summary: "在线评估是在真实用户环境中验证模型效果的方法。相比离线基准，它直接测量业务指标（转化率、留存、满意度），常用 A/B 测试、影子部署、金丝雀发布等手段。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# 在线评估

## 核心要点

- **离线评估测的是“模型会不会答题”**。
- **在线评估测的是“用户买不买账”**。
- **核心方法**：A/B 测试、影子部署、金丝雀发布、交错实验。
- **核心指标**：转化率、留存、用户满意度、错误率、延迟、成本。

## 一句话理解

在线评估就像新菜上市后看顾客反应：不是问厨师觉得好不好吃，而是看顾客点不点、复购不复购。

## 详细内容

### 为什么需要在线评估？

离线指标的局限：
- 测试集不等于真实分布。
- 准确率不等于业务价值。
- 模型上线后用户行为可能变化。

### 主要方法

| 方法 | 说明 | 风险 |
|------|------|------|
| **A/B 测试** | 随机分流对比新旧版本 | 需要足够样本 |
| **影子部署** | 新模型并行处理但不返回结果 | 无用户风险 |
| **金丝雀发布** | 先暴露 5-10% 流量 | 可控 |
| **交错实验** | 用户同时看到多个候选 | 适合排序/推荐 |

## Related

- [[_concepts/model-evaluation]] — 模型评估
- [[_concepts/ab-testing-framework]] — A/B 测试框架
- [[_concepts/model-deployment]] — 模型部署
- [[08_Model_Evaluation/Online_Evaluation]] — 在线评估
