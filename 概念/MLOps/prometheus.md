---
title: "Prometheus"
category: -concepts
tags: ["prometheus", "monitoring", "observability", "metrics", "alerting", "cncf", "time-series"]
relationships:
  - target: "概念/grafana"
    type: paired_with
  - target: "概念/observability"
    type: extends
  - target: "概念/kubernetes"
    type: runs_on
sources:
  - MLOps/Observability/Prometheus_Grafana_Deep_Dive.md
summary: "Prometheus 是 CNCF Graduated 的开源监控与告警系统，以拉取模式采集时序指标，广泛应用于 Kubernetes、AI 训练和推理服务的可观测。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Prometheus

name_zh: "监控告警系统"
---
# Prometheus

> 中文简称：监控告警系统

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

- [[11_模型运维/08_可观测性/15_Prometheus_Grafana_深入分析]] — Prometheus + Grafana 深度解析
- [[概念/grafana]] — Grafana 可视化平台
- [[概念/observability]] — 可观测性
- [[13_运维/AI_Observability_Guide_2026]] — AI 可观测指南 2026

---

## 2026 Prometheus 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Prometheus 3.x** | 云原生监控系统 | GA |
| **PromQL** | 强大的查询语言 | GA |
| **Alertmanager** | 告警路由/分组/静默 | GA |
| **Thanos/Cortex** | 长期存储/多集群 | GA |
| **OpenTelemetry** | 统一遥测标准 | GA |

## 生产最佳实践

1. **指标命名**：遵循 Prometheus 指标命名规范
2. **告警规则**：配置关键指标告警规则
3. **长期存储**：用 Thanos/Cortex 实现长期存储
4. **与 Grafana 配合**：Prometheus + Grafana 是标准组合
5. **服务发现**：用 K8s 服务发现自动监控新服务

## 2026 Prometheus 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Prometheus 3.0** | 新架构、性能提升 | GA |
| **Thanos** | 长期存储 + 全局视图 | GA |
| **Cortex/Mimir** | 水平扩展 | GA |
| **Alertmanager** | 告警路由 | GA |
| **OTel 集成** | OpenTelemetry 兼容 | GA |

## 架构：监控流程

```
应用/服务 → /metrics 端点 → Prometheus 拉取 → 存储 (TSDB)
                                        ↓
                            Alertmanager → 告警通知
                                        ↓
                            Grafana → 可视化
```

## 配置示例

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
```

## 告警规则示例

```yaml
# alerts.yml
groups:
  - name: ml-service
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.instance }}"
      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(http_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
```

## 常用 PromQL

| 查询 | 说明 |
|------|------|
| `rate(http_requests_total[5m])` | 请求速率 |
| `histogram_quantile(0.99, ...)` | P99 延迟 |
| `sum by (job) (up)` | 服务健康状态 |
| `increase(http_requests_total[1h])` | 1小时请求增量 |

## 延伸阅读

- [[概念/MLOps/grafana|Grafana]] — 可视化仪表板
- [[概念/MLOps/observability|Observability]] — 可观测性
- [[概念/MLOps/argo-rollouts|Argo Rollouts]] — 渐进式发布

> ℹ️ Prometheus 是云原生监控标准，提供指标采集、存储、查询和告警能力，是 CNCF 毕业项目。
