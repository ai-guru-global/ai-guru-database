---
title: "Prometheus"
category: -concepts
tags: ["prometheus", "monitoring", "observability", "metrics", "alerting", "cncf", "time-series"]
relationships:
  - target: "_concepts/grafana"
    type: paired_with
  - target: "_concepts/observability"
    type: extends
  - target: "_concepts/kubernetes"
    type: runs_on
sources:
  - 11_MLOps_Pipeline/Observability/Prometheus_Grafana_Deep_Dive.md
summary: "Prometheus 是 CNCF Graduated 的开源监控与告警系统，以拉取模式采集时序指标，广泛应用于 Kubernetes、AI 训练和推理服务的可观测。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Prometheus

---
# Prometheus

> 云原生监控的「时间序列数据库」——拉取、存储、告警一体化。

---

## 1. 一句话定义

**Prometheus** 是 CNCF Graduated 的开源系统监控与告警工具包，采用**拉取（pull）模式**采集多维时序数据，提供 PromQL 查询语言和 Alertmanager 告警路由，是 Kubernetes 生态事实标准的监控基座。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **多维数据模型** | 指标由名称 + 标签（label）组成 |
| **PromQL** | 强大的时序查询语言 |
| **拉取采集** | 主动从 exporter 拉取指标 |
| **服务发现** | 自动发现 K8s Pod、Service、Node |
| **告警** | 通过 Alertmanager 路由、抑制、通知 |
| **本地存储** | 内置 TSDB，支持远程存储扩展 |
| **Exporter 生态** | node-exporter、kube-state-metrics、nvidia-dcgm-exporter 等 |

---

## 3. 架构组件

```
Prometheus Server
  ├── Retrieval: 按 job 拉取指标
  ├── TSDB: 时序数据存储
  ├── PromQL Engine: 查询处理
  ├── HTTP API: 对外暴露数据
  └── Alertmanager: 告警路由
```

---

## 4. 指标类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **Counter** | 单调递增计数器 | `requests_total` |
| **Gauge** | 可增可减的瞬时值 | `gpu_memory_used_bytes` |
| **Histogram** | 采样分布 | `request_duration_seconds_bucket` |
| **Summary** | 分位统计 | `request_duration_seconds{quantile="0.99"}` |

---

## 5. AI 场景常用指标

- `hami_vgpu_memory_used_bytes` — HAMi vGPU 显存使用
- `nvidia_gpu_temperature_celsius` — GPU 温度
- `tgi_request_duration` — TGI 请求延迟
- `vllm:gpu_cache_usage_perc` — vLLM KV Cache 使用率
- `ray_worker_cpu_utilization` — Ray Worker CPU 利用率

---

## Related

- [[11_MLOps_Pipeline/Observability/Prometheus_Grafana_Deep_Dive]] — Prometheus + Grafana 深度解析
- [[_concepts/grafana]] — Grafana 可视化平台
- [[_concepts/observability]] — 可观测性
- [[13_AI_Ops/AI_Observability_Guide_2026]] — AI 可观测指南 2026
