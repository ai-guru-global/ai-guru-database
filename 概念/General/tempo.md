---
title: "Tempo"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "tracing", "grafana", "cloud-native", "alibaba-cloud"]
summary: "Tempo 是 Grafana Labs 开源的低成本分布式追踪后端，专为对象存储优化，可与 Grafana、Loki、Prometheus 组成完整可观测性栈。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Grafana Tempo"
relationships:
  - target: "概念/jaeger"
    type: related_to
  - target: "概念/grafana"
    type: related_to
  - target: "概念/opentelemetry"
    type: related_to
sources: []
---

# Tempo

> **一句话理解**: Tempo 是 Grafana 推出的「只按 Trace ID 查询」的轻量追踪后端，用对象存储降低成本，适合与 Grafana 原生集成。

## 核心要点

- **对象存储优先**: 后端支持 S3、GCS、Azure Blob、本地磁盘；推荐用对象存储降低成本。
- **Trace ID 查询**: 不建立昂贵的 span 索引，依赖 Trace ID 或日志中的 Trace ID 关联。
- **Grafana 原生集成**: 在 Grafana 中直接查询 Tempo，并与 Prometheus、Loki 联动。
- **多协议接收**: 支持 Jaeger、Zipkin、OpenTelemetry 协议。
- **多租户**: 支持基于 header 的租户隔离。

## 典型架构

```text
App (OTel SDK) → Tempo Distributor → Ingester → Object Storage
                                      ↓
                                Grafana Query
```

## 选型对比

| 方案 | 索引方式 | 存储后端 | 查询入口 |
|------|---------|---------|---------|
| **Tempo** | Trace ID | 对象存储 | Grafana |
| **Jaeger** | Span 索引 | Cassandra/ES | Jaeger UI |

## 阿里云专有云关联

在阿里云专有云环境中，Tempo 可对接盘古对象存储或 OSS 作为后端。适合在成本敏感场景下替代 Jaeger，与 Loki、Prometheus、Grafana 组成 PLG/PTG 可观测栈。

## Related

- [[概念/jaeger|Jaeger]] — 分布式链路追踪
- [[概念/grafana|Grafana]] — 可视化平台
- [[概念/opentelemetry|OpenTelemetry]] — 统一可观测性标准
- [[概念/loki|Loki]] — 日志聚合
