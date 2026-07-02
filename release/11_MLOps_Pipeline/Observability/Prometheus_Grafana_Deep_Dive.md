---
title: "Prometheus + Grafana 深度解析: AI 系统监控与可视化基座"
category: "13-ai-ops"
tags: ["prometheus", "grafana", "monitoring", "observability", "metrics", "alerting", "dashboard", "ai-ops", "cncf"]
summary: "> **一句话理解**: Prometheus 负责拉取、存储和告警时序指标；Grafana 负责把指标可视化成交互式大盘。二者是 AI 训练、推理和基础设施监控的事实标准组合。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Prometheus Grafana Deep Dive"
  - Prometheus_Grafana_Deep_Dive

---
# Prometheus + Grafana 深度解析：AI 系统监控与可视化基座

> **一句话理解**: Prometheus 负责拉取、存储和告警时序指标；Grafana 负责把指标可视化成交互式大盘。二者是 AI 训练、推理和基础设施监控的事实标准组合。

> **Prometheus**: https://prometheus.io（CNCF Graduated） | **Grafana**: https://grafana.com

---

## 目录

1. [项目背景与定位](#1-项目背景与定位)
2. [为什么 AI 系统特别需要 Prometheus + Grafana](#2-为什么-ai-系统特别需要-prometheus--grafana)
3. [Prometheus 架构与核心概念](#3-prometheus-架构与核心概念)
4. [Grafana 架构与核心概念](#4-grafana-架构与核心概念)
5. [AI 场景常用 Exporter 与指标](#5-ai-场景常用-exporter-与指标)
6. [部署方式](#6-部署方式)
7. [典型 Dashboard 与告警规则](#7-典型-dashboard-与告警规则)
8. [与 LLM 推理/训练框架的集成](#8-与-llm-推理训练框架的集成)
9. [与 HAMi / KServe / Ray 的集成](#9-与-hami--kserve--ray-的集成)
10. [生产最佳实践](#10-生产最佳实践)
11. [常见问题与排查](#11-常见问题与排查)
12. [官方资源](#12-官方资源)

---

## 1. 项目背景与定位

### 1.1 Prometheus

| 维度 | 信息 |
|------|------|
| **发起** | SoundCloud，2012 年开源 |
| **基金会** | CNCF Graduated（2018） |
| **核心** | 时序数据库 + 拉取采集 + PromQL + Alertmanager |

### 1.2 Grafana

| 维度 | 信息 |
|------|------|
| **公司** | Grafana Labs |
| **核心** | 可视化 + 告警 + 日志/追踪（Loki/Tempo） |
| **许可** | AGPL v3（Grafana）/ Apache 2.0（部分组件） |

---

## 2. 为什么 AI 系统特别需要 Prometheus + Grafana

### 2.1 AI 工作负载的特殊性

| 关注点 | 说明 |
|--------|------|
| **GPU 显存** | 训练/推理都高度依赖显存，OOM 是头号问题 |
| **利用率** | GPU 平均利用率常低于 30%，需要监控优化 |
| **训练稳定性** | loss 突跳、梯度爆炸需要实时发现 |
| **推理 SLO** | 延迟、吞吐、错误率直接影响用户体验 |
| **分布式复杂性** | 多机多卡训练故障定位困难 |

### 2.2 典型监控分层

```
业务层
  ├── 推理 QPS / P99 延迟 / 错误率
  └── 训练 loss / learning_rate / throughput

框架层
  ├── vLLM / TGI / Ray Serve 指标
  └── DeepSpeed / Ray Train 指标

资源层
  ├── GPU 利用率 / 显存 / 温度 / 功耗
  ├── HAMi vGPU 分配与隔离
  └── K8s Pod/Node CPU/内存/网络

基础设施层
  ├── 节点健康 / 网络 / 存储
  └── 调度器 / Device Plugin 状态
```

---

## 3. Prometheus 架构与核心概念

### 3.1 架构

```
┌─────────────────────────────────────────────────────────────┐
│                     Prometheus Server                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Service   │  │   Scrape    │  │        TSDB         │  │
│  │  Discovery  │──▶   Targets   │──▶  (Time Series DB)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│           │              ▲                    │              │
│           │              │                    ▼              │
│           │         Exporters              PromQL API        │
│           │         (node/gpu/app)            │              │
│           │                                   ▼              │
│           │                           ┌──────────────┐       │
│           └──────────────────────────▶│ Alertmanager │       │
│                                       └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 数据模型

```
metric_name{label1="value1", label2="value2"} value timestamp
```

### 3.3 四种指标类型

| 类型 | 说明 | AI 示例 |
|------|------|---------|
| **Counter** | 单调递增 | `inference_requests_total` |
| **Gauge** | 可增可减 | `gpu_memory_used_bytes` |
| **Histogram** | 分布统计 | `request_duration_seconds_bucket` |
| **Summary** | 分位数 | `request_duration_seconds{quantile="0.99"}` |

### 3.4 PromQL 常用示例

```promql
# 过去 5 分钟 GPU 平均利用率
avg(nvidia_gpu_utilization_gpu[5m])

# vLLM KV Cache 使用率
vllm:gpu_cache_usage_perc

# 每秒推理请求数
rate(inference_requests_total[1m])

# P99 延迟
histogram_quantile(0.99, rate(request_duration_seconds_bucket[5m]))

# HAMi vGPU 显存使用率
hami_vgpu_memory_used_bytes / hami_vgpu_memory_limit_bytes
```

---

## 4. Grafana 架构与核心概念

### 4.1 数据源

| 数据源 | 用途 |
|--------|------|
| **Prometheus** | 指标可视化 |
| **Loki** | 日志查询 |
| **Tempo** | 分布式追踪 |
| **Elasticsearch** | 日志/指标 |
| **InfluxDB** | 时序数据 |

### 4.2 Dashboard 组成

- **Panel**：单个图表/表格/统计数字
- **Row**：面板分组
- **Variable**：模板变量，支持动态切换模型/节点/Pod
- **Alert Rule**：基于查询结果触发告警

### 4.3 Explore 模式

用于临时查询，快速验证 PromQL/LogQL，调试问题时非常有用。

---

## 5. AI 场景常用 Exporter 与指标

### 5.1 GPU 监控

| Exporter | 指标 |
|----------|------|
| **DCGM Exporter** | GPU 利用率、显存、温度、功耗、NVLink 带宽 |
| **HAMi vGPUmonitor** | `hami_vgpu_*` 系列指标 |
| **node-exporter** | 节点 CPU/内存/磁盘/网络 |

### 5.2 K8s 监控

| Exporter | 指标 |
|----------|------|
| **kube-state-metrics** | Pod/Deployment/Node 状态 |
| **cadvisor** | 容器资源使用 |

### 5.3 LLM 推理框架

| 框架 | 指标端点 |
|------|---------|
| **vLLM** | `:8000/metrics` |
| **TGI** | `:80/metrics` |
| **Triton** | `:8002/metrics` |
| **KServe** | 通过 predictor 暴露 |

### 5.4 分布式训练

| 框架 | 指标 |
|------|------|
| **Ray** | Ray Dashboard + Prometheus 指标 |
| **DeepSpeed** | 自定义训练指标 |
| **PyTorch Lightning** | `lightning_logs` + Prometheus |

---

## 6. 部署方式

### 6.1 Helm 一键部署（kube-prometheus-stack）

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.retention=30d
```

包含：Prometheus、Grafana、Alertmanager、node-exporter、kube-state-metrics、Prometheus Operator。

### 6.2 访问 Grafana

```bash
kubectl port-forward svc/kube-prometheus-stack-grafana 3000:80 -n monitoring
# 默认账号 admin / prom-operator
```

### 6.3 添加 Prometheus 数据源

Grafana 中 Configuration → Data Sources → Add data source → Prometheus → URL 填 `http://kube-prometheus-stack-prometheus:9090`。

---

## 7. 典型 Dashboard 与告警规则

### 7.1 GPU 监控 Dashboard

| Panel | PromQL |
|-------|--------|
| GPU 利用率 | `avg(nvidia_gpu_utilization_gpu) by (instance)` |
| 显存使用 | `nvidia_gpu_memory_used_bytes / nvidia_gpu_memory_total_bytes` |
| GPU 温度 | `nvidia_gpu_temperature_celsius` |
| HAMi vGPU 分配 | `hami_node_gpu_allocated / hami_node_gpu_total` |

### 7.2 推理服务 Dashboard

| Panel | PromQL |
|-------|--------|
| QPS | `rate(inference_requests_total[1m])` |
| P99 延迟 | `histogram_quantile(0.99, rate(request_duration_seconds_bucket[5m]))` |
| 错误率 | `rate(inference_requests_failed_total[1m]) / rate(inference_requests_total[1m])` |
| KV Cache 使用 | `vllm:gpu_cache_usage_perc` |

### 7.3 推荐告警规则

```yaml
groups:
  - name: ai-systems
    rules:
      - alert: GPUHighTemperature
        expr: nvidia_gpu_temperature_celsius > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "GPU 温度过高"

      - alert: GPUOOMRisk
        expr: nvidia_gpu_memory_used_bytes / nvidia_gpu_memory_total_bytes > 0.95
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "GPU 显存即将耗尽"

      - alert: InferenceLatencyHigh
        expr: histogram_quantile(0.99, rate(request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "推理 P99 延迟超过 2 秒"

      - alert: TrainingLossSpike
        expr: abs(rate(training_loss[5m])) > 1
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "训练 loss 出现剧烈波动"
```

---

## 8. 与 LLM 推理/训练框架的集成

### 8.1 vLLM 指标

vLLM 默认暴露 `/metrics`，包含：

- `vllm:gpu_cache_usage_perc`
- `vllm:num_requests_running`
- `vllm:num_requests_waiting`
- `vllm:iteration_tokens_total`

### 8.2 TGI 指标

TGI 暴露 `/metrics`，包含：

- `tgi_request_count`
- `tgi_request_duration`
- `tgi_batch_current_size`

### 8.3 Ray 指标

Ray 支持 Prometheus 指标导出，需配置 `RAY_PROMETHEUS_HOST`。

### 8.4 DeepSpeed 训练指标

DeepSpeed 不原生暴露 Prometheus 指标，需在训练脚本中通过 `prometheus-client` 库自定义：

```python
from prometheus_client import Gauge
loss_gauge = Gauge('training_loss', 'Current training loss')
loss_gauge.set(loss.item())
```

---

## 9. 与 HAMi / KServe / Ray 的集成

### 9.1 HAMi

HAMi 的 vGPUmonitor 暴露 `hami_vgpu_*` 和 `hami_node_*` 系列指标，可直接被 Prometheus 抓取。

### 9.2 KServe

KServe Predictor 通过 ServiceMonitor 暴露指标，Prometheus Operator 自动发现。

### 9.3 Ray

KubeRay 可配置 Prometheus ServiceMonitor，Ray Dashboard 也内置指标页面。

---

## 10. 生产最佳实践

### 10.1 指标保留策略

- 高频指标保留 15-30 天
- 聚合后的长期指标保留 1 年
- 使用 Thanos / Cortex / Mimir 做长期存储和高可用

### 10.2 告警降噪

- 使用 `for` 延迟触发避免抖动
- 配置 Alertmanager 的 `group_by`、`inhibit_rules`
- 区分 warning/critical 级别

### 10.3 Dashboard 设计

- 按层级组织：集群 → 节点 → Pod → 应用
- 使用模板变量实现多模型/多环境切换
- 关键指标放在顶部，细节 drill-down

### 10.4 安全

- Grafana 开启认证和 RBAC
- Prometheus 不暴露公网
- 对敏感指标标签做脱敏

---

## 11. 常见问题与排查

### Q1: Prometheus 抓不到指标

**排查**：

```bash
kubectl get servicemonitor -n monitoring
kubectl logs -n monitoring prometheus-kube-prometheus-stack-prometheus-0
# 检查 target 是否 up: Status → Targets
```

### Q2: Grafana Dashboard 没有数据

**A**: 检查数据源 URL、时间范围、PromQL 查询、标签匹配。

### Q3: 告警不触发

**A**: 检查告警规则语法、阈值、for 持续时间、Alertmanager 路由配置。

### Q4: 指标 Cardinality 过高

**A**: 避免无界标签（如 user_id、request_id），使用 recording rules 预聚合。

### Q5: Prometheus 存储满了

**A**: 缩短 retention、增加磁盘、迁移到 Thanos/Cortex/Mimir。

### Q6: GPU 指标缺失

**A**: 检查 DCGM Exporter 是否运行、节点是否有 GPU、ServiceMonitor 选择器是否正确。

### Q7: 训练指标如何接入？

**A**: 在训练代码中通过 prometheus-client 暴露，或使用 MLflow/WandB 后再导出。

### Q8: 多集群监控怎么做？

**A**: 使用 Thanos Sidecar + Query 联邦查询，或 Grafana Cloud。

---

## 12. 官方资源

- **Prometheus**: https://prometheus.io
- **Prometheus GitHub**: https://github.com/prometheus/prometheus
- **Grafana**: https://grafana.com
- **Grafana GitHub**: https://github.com/grafana/grafana
- **kube-prometheus-stack**: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
- **DCGM Exporter**: https://github.com/NVIDIA/dcgm-exporter

---

## Related

- [[_concepts/prometheus]] — Prometheus 概念卡片
- [[_concepts/grafana]] — Grafana 概念卡片
- [[_concepts/observability]] — 可观测性
- [[13_AI_Ops/AI_Observability_Guide_2026]] — AI 可观测指南 2026
- [[11_MLOps_Pipeline/Observability/AI_Observability_Deep_Dive]] — AI 可观测深度解析
- [[12_Architecture_Infrastructure/AI_Stack/HAMi_Deep_Dive]] — HAMi（含 vGPUmonitor 指标）
- [[10_Deployment_Inference/Inference_Engines/KServe_Deep_Dive]] — KServe
- [[07_Model_Training/Distributed_Training/Ray_Deep_Dive]] — Ray
