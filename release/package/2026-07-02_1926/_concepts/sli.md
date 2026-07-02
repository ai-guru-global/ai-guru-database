---
title: "SLI"
category: -concepts
tags: ["sre", "reliability", "sli", "observability", "alibaba-cloud"]
summary: "SLI（Service Level Indicator）是用于衡量服务水平的具体指标，如可用性、延迟、错误率、吞吐量等。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "Service Level Indicator"
  - "服务等级指标"
relationships:
  - target: "_concepts/slo"
    type: feeds
  - target: "_concepts/prometheus"
    type: measured_by
sources: []
---

# SLI

> **一句话理解**: SLI 就是「你拿什么数字来衡量服务好不好」，比如可用性、延迟、错误率。

## 核心要点

- **可量化**: 必须是可测量、可聚合的指标。
- **用户视角**: 最好反映用户实际体验。
- **常见 SLI**: 可用性、延迟、错误率、吞吐量、 freshness。
- **与 SLO 关系**: SLO = SLI + 目标值。

## 示例

| 指标类型 | SLI |
|----------|-----|
| 可用性 | 成功请求数 / 总请求数 |
| 延迟 | 请求响应时间 |
| 错误率 | 5xx 响应数 / 总响应数 |

## 阿里云专有云关联

在阿里云专有云环境中，SLI 通常通过 ARMS、Prometheus、SLS 等可观测平台采集，用于支撑 SLO 和告警。

## Related

- [[_concepts/slo|SLO]]
- [[_concepts/error-budget|Error Budget]]
- [[_concepts/prometheus|Prometheus]]
