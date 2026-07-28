---
title: "Kubernetes 可观测性栈"
category: 12-architecture-infrastructure
tags: ["kubernetes", "k8s", "observability", "monitoring", "logging", "tracing", "metrics", "cloud-native", "alibaba-cloud"]
summary: "系统讲解 Kubernetes 环境下的指标、日志、链路三大支柱可观测性体系，以及与阿里云专有云环境的集成方式。"
created: 2026-06-26
updated: 2026-06-26
tier: core
sources: []
name_zh: "Kubernetes 可观测性栈"
---

# Kubernetes 可观测性栈

> 中文简称：Kubernetes 可观测性栈

> **一句话理解**: K8s 可观测性栈就是把 Metrics（指标）、Logs（日志）、Traces（链路）三类数据统一采集、存储、关联分析，让复杂分布式系统的故障定位有迹可循。

## 目录

- [1. 可观测性三大支柱](#1-可观测性三大支柱)
- [2. 指标：Metrics](#2-指标metrics)
- [3. 日志：Logs](#3-日志logs)
- [4. 链路：Traces](#4-链路traces)
- [5. 统一关联：三支柱联动](#5-统一关联三支柱联动)
- [6. 阿里云专有云可观测集成](#6-阿里云专有云可观测集成)
- [7. 典型部署架构](#7-典型部署架构)
- [8. 排障速查](#8-排障速查)
- [Related](#related)

---

## 1. 可观测性三大支柱

| 支柱 | 回答的问题 | 数据特征 |
|------|-----------|---------|
| **Metrics** | 系统现在是否正常？趋势如何？ | 数值、时间序列、聚合 |
| **Logs** | 发生了什么具体事件？ | 文本、离散、详细 |
| **Traces** | 请求经过了哪些服务？哪里慢/错？ | 请求级、跨服务、有依赖 |

三者结合才能完整回答「什么服务 → 哪个实例 → 什么时间 → 发生了什么」的问题。

---

## 2. 指标：Metrics

### 2.1 核心工具

- **Prometheus**: K8s 生态事实标准时序数据库，拉模式采集。
- **Grafana**: 可视化与告警面板。
- **Alertmanager**: Prometheus 告警路由与抑制。
- **Thanos / Cortex / VictoriaMetrics**: 长期存储与高可用扩展。
- **OpenTelemetry Collector**: 统一指标接收与转发。

### 2.2 K8s 关键指标

| 指标类型 | 示例 | 用途 |
|----------|------|------|
| 节点指标 | `node_cpu_seconds_total` | 节点 CPU 使用 |
| 容器指标 | `container_cpu_usage_seconds_total` | Pod CPU 使用 |
| K8s 对象指标 | `kube_pod_status_phase` | Pod 状态分布 |
| 应用指标 | `http_requests_total` | 应用请求量 |
| 自定义指标 | `gpu_utilization` | GPU 利用率 |

### 2.3 常见告警

- PodCrashLooping
- KubePodNotReady
- KubeNodeNotReady
- HighMemoryUsage
- DiskWillFillIn4Hours

---

## 3. 日志：Logs

### 3.1 日志栈选型

| 方案 | 索引 | 存储 | 适用 |
|------|------|------|------|
| **Loki + Fluent Bit** | 标签索引 | 对象存储 | 成本敏感、Grafana 生态 |
| **EFK/ELK** | 全文索引 | Elasticsearch | 全文检索、复杂聚合 |
| **OpenTelemetry + SLS** | 服务端索引 | 云端日志服务 | 阿里云环境 |

### 3.2 日志采集模式

```text
Node Fluent Bit DaemonSet → 读取 /var/log/containers/*.log → 注入 K8s 元数据 → 发送到后端
```

### 3.3 日志关键字段

- `kubernetes.pod_name`
- `kubernetes.namespace_name`
- `kubernetes.container_name`
- `level`
- `trace_id`

---

## 4. 链路：Traces

### 4.1 核心工具

- **Jaeger**: OpenTracing/OpenTelemetry 原生，功能全面。
- **Tempo**: Grafana 出品，低成本对象存储。
- **SkyWalking**: APM 风格，Java 生态强。

### 4.2 Trace 与日志/指标关联

```text
Trace ID → 链路瀑布图
   ↓
LogQL: {trace_id="xxx"} → 相关日志
   ↓
PromQL: rate(http_requests_total{trace_id="xxx"}[5m]) → 相关指标
```

---

## 5. 统一关联：三支柱联动

### 5.1 通过 Trace ID 串联

1. 告警触发（Metrics）
2. 查看异常时间段的 Trace 列表（Traces）
3. 找到慢/错 Trace ID
4. 用 Trace ID 检索相关日志（Logs）
5. 定位具体报错代码

### 5.2 通过时间与标签关联

- 在 Grafana 中同时展示 Prometheus 指标面板、Loki 日志面板、Jaeger 链路面板。
- 使用相同时间范围和 pod/namespace 标签过滤。

---

## 6. 阿里云专有云可观测集成

在阿里云专有云（Apsara Stack）环境中，ACK 集群的可观测性通常有以下组合：

| 层级 | 自建方案 | 阿里云组件 |
|------|---------|-----------|
| 指标 | Prometheus + Thanos/Cortex | ARMS Prometheus 私有化 |
| 日志 | Loki / EFK | SLS 私有化 / 盘古对象存储 |
| 链路 | Jaeger / Tempo | ARMS 链路追踪私有化 |
| 告警 | Alertmanager + Grafana | ASCM 告警中心 |

### 6.1 专有云注意事项

- **网络隔离**: 可观测组件通常部署在独立运维 VPC，需要配置到业务 VPC 的访问策略。
- **存储后端**: 日志/指标长期存储优先使用盘古对象存储或 OSS。
- **多租户**: 通过 Namespace、Tenant Header、Project 实现数据隔离。
- **合规要求**: 金融/政务专有云对日志留存时间、审计、脱敏有严格要求。

---

## 7. 典型部署架构

```text
┌─────────────────────────────────────────────────────────┐
│                      业务 ACK 集群                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Prometheus  │  │  Fluent Bit │  │ OTel Collector  │  │
│  │  Server     │  │  DaemonSet  │  │   Deployment    │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          ▼                ▼                  ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │   Thanos    │  │    Loki     │  │  Jaeger/    │
   │  Sidecar    │  │   Gateway   │  │   Tempo     │
   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
          │                │                  │
          └────────────────┼──────────────────┘
                           ▼
                    ┌─────────────┐
                    │  盘古对象存储  │
                    └─────────────┘
```

---

## 8. 排障速查

| 现象 | 优先排查 | 命令/入口 |
|------|---------|----------|
| 指标缺失 | Prometheus target 是否 up、ServiceMonitor 是否正确 | `kubectl get servicemonitor` |
| 日志未采集 | Fluent Bit Pod 状态、输出目标可达性 | `kubectl logs -n logging ds/fluent-bit` |
| 链路中断 | OTel SDK 配置、Collector 端口、采样率 | `kubectl get otelcol` |
| 告警未触发 | Alertmanager 路由、抑制规则 | `kubectl logs -n monitoring alertmanager-*` |
| Grafana 无数据 | 数据源配置、时间范围、权限 | Grafana UI → Data Sources |

---

## Related

- [[概念/prometheus|Prometheus]] — 指标监控
- [[概念/grafana|Grafana]] — 可视化
- [[概念/loki|Loki]] — 日志聚合
- [[概念/fluent-bit|Fluent Bit]] — 日志采集
- [[概念/jaeger|Jaeger]] — 链路追踪
- [[概念/tempo|Tempo]] — 低成本追踪
- [[概念/opentelemetry|OpenTelemetry]] — 统一可观测性
- [[13_运维/Kubernetes_Troubleshooting_Playbook|K8s 运维排障 Playbook]]

- [[12_架构基建/README|架构与基础设施 (Architecture & Infrastructure)]]
