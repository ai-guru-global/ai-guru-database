---
title: "Error Budget"
category: -concepts
tags: ["sre", "reliability", "slo", "alibaba-cloud"]
summary: "Error Budget（错误预算）是 SLO 允许的不可用量化上限，用于平衡发布速度与稳定性。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "错误预算"
relationships:
  - target: "_concepts/slo"
    type: derived_from
  - target: "_concepts/sli"
    type: related_to
sources: []
---

# Error Budget

> **一句话理解**: 错误预算就是「你允许服务一个月出多久的错」——预算花光了，就先别发版，先把稳定性修好。

## 核心要点

- **计算**: Error Budget = 1 - SLO。
- **用途**: 决定是否可以发布、是否需要回滚、工程优先级。
- **消耗监控**: 需要实时跟踪错误预算消耗速度。
- **政策**: 明确预算耗尽时的行为（冻结发布、强制复盘）。

## 示例

| SLO | 月度错误预算 |
|-----|-------------|
| 99.9% | 43.2 分钟 |
| 99.99% | 4.32 分钟 |

## 阿里云专有云关联

在阿里云专有云环境中，错误预算可与 ASCM 告警、发布流水线联动，实现自动化发布门控。

## Related

- [[_concepts/slo|SLO]]
- [[_concepts/sli|SLI]]
- [[运维/SRE_Reliability/LLM_Inference_SLO_Guide|LLM 推理 SLO 实践指南]]
