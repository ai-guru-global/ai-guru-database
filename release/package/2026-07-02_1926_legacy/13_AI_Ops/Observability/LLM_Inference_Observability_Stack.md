---
title: "LLM 推理可观测性栈"
category: 13-ai-ops
subcategory: observability
tags: ["llm", "inference", "observability", "metrics", "tracing", "prometheus", "grafana", "alibaba-cloud"]
summary: "面向 LLM 推理服务的可观测性体系建设：定义 TTFT/TPOT/QPS/KV Cache 等关键指标，并给出 Prometheus/Grafana 采集与告警方案。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# LLM 推理可观测性栈

> **一句话理解**: LLM 推理可观测性就是盯着「首 token 多久回来、每个 token 多快、排队长不长、KV Cache 满没满」这几件事，及时发现和定位问题。

## 目录

- [1. 关键指标](#1-关键指标)
- [2. 指标采集](#2-指标采集)
- [3. 日志与链路](#3-日志与链路)
- [4. 告警规则](#4-告警规则)
- [5. Dashboard 设计](#5-dashboard-设计)
- [6. 阿里云专有云关联](#6-阿里云专有云关联)
- [Related](#related)

---

## 1. 关键指标

| 指标 | 说明 | 告警阈值参考 |
|------|------|-------------|
| **TTFT** | 首 token 返回时间 | p99 > 2s |
| **TPOT** | 每个输出 token 时间 | p99 > 100ms |
| **QPS** | 每秒请求数 | 按容量规划 |
| **Queue Depth** | 等待请求数 | 持续增长 |
| **KV Cache Usage** | KV Cache 显存占用 | > 85% |
| **GPU Utilization** | GPU 计算利用率 | 持续 > 95% |
| **GPU Memory Usage** | 显存占用 | > 90% |
| **Error Rate** | 错误率 | > 1% |

---

## 2. 指标采集

### 2.1 vLLM Metrics

vLLM 默认暴露 `/metrics`：

```bash
curl http://<vllm-pod>:8000/metrics
```

关键指标：
- `vllm:time_to_first_token_seconds`
- `vllm:time_per_output_token_seconds`
- `vllm:num_requests_running`
- `vllm:num_requests_waiting`
- `vllm:gpu_cache_usage_perc`

### 2.2 Prometheus ServiceMonitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: llm-inference-metrics
spec:
  selector:
    matchLabels:
      app: llm-inference
  endpoints:
    - port: metrics
      path: /metrics
      interval: 15s
```

---

## 3. 日志与链路

### 3.1 日志关键字段

- request_id
- model_name
- input_tokens
- output_tokens
- ttft_ms
- total_latency_ms
- error_code

### 3.2 链路追踪

使用 OpenTelemetry 或 Jaeger 追踪请求从网关到推理服务的完整链路。

---

## 4. 告警规则

```yaml
groups:
  - name: llm_inference
    rules:
      - alert: LLMHighTTFT
        expr: histogram_quantile(0.99, vllm:time_to_first_token_seconds_bucket) > 2
        for: 5m
        annotations:
          summary: "LLM TTFT p99 > 2s"

      - alert: LLMHighQueueDepth
        expr: vllm:num_requests_waiting > 10
        for: 2m
        annotations:
          summary: "LLM queue depth high"
```

---

## 5. Dashboard 设计

建议 Grafana Dashboard 包含：
- 延迟：TTFT/TPOT p50/p95/p99
- 吞吐：QPS、token/s
- 队列：running/waiting requests
- 资源：GPU 利用率、显存、KV Cache
- 错误：错误率、错误码分布

---

## 6. 阿里云专有云关联

在阿里云专有云环境中：
- 可对接 **ARMS 私有化版** 作为 Prometheus/Grafana 替代
- **SLS 私有化版** 收集推理日志
- **PAI-EAS** 自带推理监控看板
- **ASCM** 统一告警中心

---

## Related

- [[_concepts/vllm|vLLM]]
- [[_concepts/prometheus|Prometheus]]
- [[_concepts/grafana|Grafana]]
- [[_concepts/opentelemetry|OpenTelemetry]]
- [[_concepts/jaeger|Jaeger]]
- [[运维/SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook|LLM 推理延迟/不可用 Runbook]]
