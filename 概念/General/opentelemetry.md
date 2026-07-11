---
title: "OpenTelemetry"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "tracing", "metrics", "logging", "cloud-native", "alibaba-cloud"]
summary: "OpenTelemetry 是 CNCF 孵化的统一可观测性标准与工具集，提供 Metrics、Traces、Logs 的采集、转换和导出能力。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "OTel"
  - "OpenTelemetry Collector"
relationships:
  - target: "概念/prometheus"
    type: related_to
  - target: "概念/jaeger"
    type: related_to
  - target: "概念/kubernetes"
    type: related_to
sources: []
---

# OpenTelemetry

> **一句话理解**: OpenTelemetry 是云原生可观测性的「通用语言」，一次埋点即可同时产出指标、链路、日志，并发送到 Prometheus/Jaeger/Loki 等后端。

## 核心要点

- **三大信号**: Metrics（指标）、Traces（链路）、Logs（日志）统一标准。
- **无厂商锁定**: 统一 API/SDK/Collector，后端可自由切换。
- **Collector 架构**: Receiver → Processor → Exporter，支持过滤、批处理、路由。
- **自动埋点**: 提供多种语言的自动 instrumentation（Java、Python、Go、.NET、Node.js）。
- **与 Prometheus 兼容**: OTLP 指标可转 Prometheus remote write。

## 典型部署模式

```text
App (OTel SDK) → OpenTelemetry Collector → [Prometheus | Jaeger | Loki | Tempo]
```

## Collector 配置示例

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  prometheusremotewrite:
    endpoint: http://prometheus:9090/api/v1/write
  otlp/jaeger:
    endpoint: jaeger-collector:4317
    tls:
      insecure: true

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheusremotewrite]
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
```

## 阿里云专有云关联

在阿里云专有云环境中，OpenTelemetry Collector 可作为 ACK 集群可观测性的统一接入层，将指标/链路/日志分别对接自建的 Prometheus、Jaeger/Tempo、Loki，或对接 ARMS 私有化版本。工单中常用于统一多语言微服务的可观测性埋点。

## Related

- [[概念/prometheus|Prometheus]] — 指标监控
- [[概念/jaeger|Jaeger]] — 链路追踪
- [[概念/loki|Loki]] — 日志聚合
- [[概念/tempo|Tempo]] — 低成本追踪后端
- [[概念/kubernetes|Kubernetes]] — 容器编排
