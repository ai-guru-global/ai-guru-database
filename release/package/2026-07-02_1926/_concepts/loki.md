---
title: "Loki"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "logging", "grafana", "cloud-native", "alibaba-cloud"]
summary: "Loki 是 Grafana Labs 开源的轻量级日志聚合系统，采用类似 Prometheus 的标签索引模型，专为 Kubernetes 等云原生环境设计。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Grafana Loki"
  - "Loki 日志系统"
relationships:
  - target: "_concepts/prometheus"
    type: related_to
  - target: "_concepts/grafana"
    type: related_to
  - target: "_concepts/kubernetes"
    type: related_to
sources: []
---

# Loki

> **一句话理解**: Loki 是「像 Prometheus 一样给日志打标签」的日志系统，只索引标签不索引全文，因此成本低、易与 Grafana 集成。

## 核心要点

- **标签驱动索引**: 日志内容只压缩存储，索引按 stream（标签集合）构建，大幅降低存储成本。
- **三大组件**: Distributor（接收日志）、Ingester（写入缓存）、Querier（查询）。
- **与 Grafana 原生集成**: 在 Grafana 中可直接用 LogQL 查询 Loki 日志。
- **轻量 Agent**: Promtail、Fluent Bit、Grafana Agent 都可作为日志收集端。
- **适合 Kubernetes**: 自动注入 Pod 标签、Namespace 等元数据，方便按工作负载过滤。
- **日志分级**: 支持 `{app="api", level="error"} |= "timeout"` 这类 LogQL 过滤。

## 典型架构

```text
App Pod → Promtail/Fluent Bit → Loki Distributor → Ingester → Object Storage
                                    ↓
                                Grafana Querier
```

## 常用 LogQL 示例

```logql
# 查询所有 error 日志
{namespace="prod", app="order"} |= "error"

# 统计每分钟错误数
rate({namespace="prod", app="order"} |= "error" [1m])

# 查询某个 Pod 的日志
{pod=~"api-.*"} |= "timeout"
```

## 选型对比

| 方案 | 索引方式 | 存储成本 | 查询延迟 | 适合场景 |
|------|---------|---------|---------|---------|
| **Loki** | 标签索引 | 低 | 中 | K8s 日志聚合、Grafana 生态 |
| **EFK** | 全文索引（Elasticsearch） | 高 | 低 | 全文检索、复杂聚合 |
| **PLG** | Loki + Grafana | 低 | 中 | 中小规模 K8s 集群 |

## 阿里云专有云关联

在阿里云专有云环境中，Loki 常作为 ACK 敏捷版/专有版集群的轻量级日志方案部署，日志后端可对接盘古对象存储或 OSS。工单场景中，Loki 可用于快速定位应用容器崩溃、API 超时、Ingress 502 等问题的原始日志。

## Related

- [[_concepts/prometheus|Prometheus]] — 指标监控
- [[_concepts/grafana|Grafana]] — 可视化与告警
- [[_concepts/fluent-bit|Fluent Bit]] — 日志采集器
- [[_concepts/kubernetes|Kubernetes]] — 容器编排
- [[12_Architecture_Infrastructure/Kubernetes_Observability_Stack|Kubernetes 可观测性栈]]
