---
title: "SLI"
category: -concepts
tags: ["sre", "reliability", "sli", "observability", "metrics"]
summary: "SLI（Service Level Indicator）是用于衡量服务水平的具体指标，如可用性、延迟、错误率、吞吐量等。"
created: 2026-06-26
updated: 2026-07-21
tier: core
lifecycle: reviewed
aliases:
  - "Service Level Indicator"
  - "服务等级指标"
relationships:
  - target: "概念/slo"
    type: feeds
  - target: "概念/prometheus"
    type: measured_by
sources: []
---

# SLI（Service Level Indicator）

> **一句话理解**: SLI = 「你拿什么数字来衡量服务好不好」，比如可用性、延迟、错误率。

## 定义

SLI（Service Level Indicator）是衡量服务水平的具体可量化指标，反映用户实际体验。SLI 是 SLO 的基础：SLO = SLI + 目标值。

## AI 服务常见 SLI

| 指标类型 | SLI 定义 | 计算方式 | 典型目标 |
|----------|----------|----------|----------|
| **可用性** | 成功请求占比 | 成功数/总请求数 | > 99.9% |
| **延迟 (TTFT)** | 首 token 时间 | P95/P99 | < 500ms |
| **延迟 (TPS)** | 每 token 速度 | tokens/s | > 30 t/s |
| **错误率** | 5xx 占比 | 5xx/总响应 | < 0.1% |
| **吞吐量** | 每秒处理请求 | req/s | 视业务 |
| **质量** | 用户满意度 | 点赞/点踩比 | > 90% |

## SLI 采集架构

```
用户请求 → API Gateway → LLM 服务
              |                |
         Prometheus       自定义指标
              |                |
              └──── Grafana ────┘
                       |
                  SLO 计算引擎
```

## Prometheus 采集示例

```yaml
# SLI: 可用性
- record: sli:availability:ratio
  expr: |
    sum(rate(http_requests_total{status!~"5.."}[5m]))
    /
    sum(rate(http_requests_total[5m]))

# SLI: TTFT P95
- record: sli:ttft:p95
  expr: |
    histogram_quantile(0.95,
      rate(vllm:time_to_first_token_seconds_bucket[5m]))
```

## 生产最佳实践

1. **从用户视角定义**：不是 CPU 利用率，而是用户感知的延迟
2. **可聚合**：能跨实例、跨时间窗口聚合
3. **低延迟采集**：实时或准实时，不要 T+1
4. **区分业务线**：不同场景不同 SLI
5. **与告警联动**：SLI 异常 → 自动触发告警

## Related

- [[概念/slo|SLO]]
- [[概念/General/sla|SLA]]
- [[概念/error-budget|Error Budget]]
- [[概念/prometheus|Prometheus]]
- [[概念/Inference/ttft|TTFT]] — AI 服务核心 SLI
