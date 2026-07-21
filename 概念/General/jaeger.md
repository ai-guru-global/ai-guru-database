---
title: "Jaeger"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "tracing", "opentelemetry", "cloud-native", "alibaba-cloud"]
summary: "Jaeger 是 CNCF 孵化的分布式链路追踪系统，源自 Uber，用于可视化微服务请求在 K8s 集群中的完整调用路径。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Jaeger Tracing"
  - "分布式链路追踪"
relationships:
  - target: "概念/opentelemetry"
    type: related_to
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/prometheus"
    type: related_to
sources: []
---

# Jaeger

> **一句话理解**: Jaeger 是给微服务请求画「调用地图」的工具，能看清一次请求经过哪些服务、每段耗时、哪里出错。

## 核心要点

- **OpenTracing 实现**: Jaeger 是 OpenTracing 的原生实现，现全面兼容 OpenTelemetry。
- **四大组件**: Agent（接收 span）、Collector（聚合）、Query（查询 UI）、Storage（后端存储）。
- **调用链可视化**: 通过 Trace ID 串起一次请求的完整链路，展示服务依赖与耗时瀑布。
- **性能分析**: 可识别热点服务、长尾请求、错误传播路径。
- **多种采样策略**: 支持概率采样、限速采样、尾部采样。

## 典型架构

```text
App (OTel SDK) → Jaeger Agent → Jaeger Collector → Storage (Cassandra/ES/Badger)
                                      ↓
                                Jaeger Query UI
```

## 常用查询

```bash
# 通过 Trace ID 查询
http://jaeger-query:16686/trace/<trace-id>
```

## 选型对比

| 方案 | 存储 | 生态 | 适用场景 |
|------|------|------|---------|
| **Jaeger** | Cassandra/ES/Badger | OpenTracing/OpenTelemetry | 云原生微服务 |
| **Tempo** | Object Storage | Grafana 原生 | 低成本、Grafana 生态 |
| **SkyWalking** | H2/MySQL/ES | 自有探针 | Java 生态、APM |

## 阿里云专有云关联

在专有云 ACK 环境中，Jaeger 可与阿里云应用实时监控服务 ARMS 或自建的 Prometheus/Grafana 栈配合使用。工单中常用于追踪跨 Namespace 微服务调用的延迟尖刺、定位偶发 5xx 的根因服务。

## Related

- [[概念/opentelemetry|OpenTelemetry]] — 统一可观测性标准
- [[概念/prometheus|Prometheus]] — 指标监控
- [[概念/loki|Loki]] — 日志聚合
- [[概念/kubernetes|Kubernetes]] — 容器编排

---

## 2026 Jaeger 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Jaeger** | 分布式追踪系统 | GA |
| **OpenTelemetry** | 统一遥测标准 | GA |
| **Trace 分析** | 追踪数据分析 | GA |
| **与 Grafana 集成** | 追踪可视化 | GA |
| **与 Tempo 对比** | Jaeger vs Tempo | GA |

## 生产最佳实践

1. **分布式追踪**：微服务用 Jaeger 追踪
2. **OpenTelemetry**：用 OpenTelemetry 采集追踪
3. **与 Grafana 配合**：Jaeger + Grafana 可视化
4. **采样策略**：配置合适的采样策略
5. **与 Tempo 对比**：根据需求选择 Jaeger 或 Tempo
