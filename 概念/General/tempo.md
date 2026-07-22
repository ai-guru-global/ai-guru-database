---
title: "Tempo"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "tracing", "grafana", "cloud-native", "alibaba-cloud"]
summary: "Tempo 是 Grafana Labs 开源的低成本分布式追踪后端，专为对象存储优化，可与 Grafana、Loki、Prometheus 组成完整可观测性栈。"
created: 2026-06-26
updated: 2026-07-21
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

---

## 2026 Tempo 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Grafana Tempo** | 分布式追踪后端 | GA |
| **OpenTelemetry** | 统一遥测标准 | GA |
| **Trace 存储** | 追踪数据存储 | GA |
| **与 Grafana 集成** | 追踪可视化 | GA |
| **与 Loki 关联** | 追踪-日志关联 | GA |

## 生产最佳实践

1. **分布式追踪**：微服务用 Tempo 追踪
2. **OpenTelemetry**：用 OpenTelemetry 采集追踪
3. **与 Grafana 配合**：Tempo + Grafana 可视化
4. **追踪-日志关联**：追踪与日志关联分析
5. **采样策略**：配置合适的采样策略

## 配置示例

```yaml
# Tempo 配置示例
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
        http:
          endpoint: 0.0.0.0:4318

ingester:
  trace_idle_period: 10s
  max_block_bytes: 1073741824

storage:
  trace:
    backend: s3
    s3:
      bucket: tempo-traces
      endpoint: oss-cn-hangzhou.aliyuncs.com

metrics_generator:
  storage:
    path: /tmp/tempo/generator/wal
    remote_write:
      - url: http://prometheus:9090/api/v1/write
```

## 与 Jaeger 对比

| 维度 | Tempo | Jaeger |
|------|------|------|
| 索引 | 仅 Trace ID | 全 Span 索引 |
| 存储 | 对象存储 | Cassandra/ES |
| 成本 | 低 | 高 |
| 查询 | Trace ID/日志关联 | 灵活查询 |
| 集成 | Grafana 原生 | 独立 UI |
| 适用 | 成本敏感 | 复杂查询 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Trace 丢失 | 采样率太低 | 调整采样策略 |
| 查询慢 | 对象存储延迟 | 使用本地缓存 |
| 数据丢失 | Ingester 崩溃 | 配置 WAL |
| 存储成本高 | 保留时间太长 | 调整 retention |

## 相关概念

- [[概念/jaeger|Jaeger]] — 分布式链路追踪
- [[概念/opentelemetry|OpenTelemetry]] — 统一可观测性标准
- [[概念/loki|Loki]] — 日志聚合
- [[概念/grafana|Grafana]] — 可视化平台

> 💡 Tempo 的核心价值是“低成本追踪”——用对象存储替代昂贵索引，让追踪数据不再是成本负担。

## 版本兼容性

| 组件 | 版本 | 状态 |
|------|------|------|
| Tempo | 2.4+ | GA |
| Grafana | 10.0+ | GA |
| OpenTelemetry | 1.0+ | GA |
| Loki | 3.0+ | GA |

## 生产检查清单

1. 配置对象存储后端（OSS/S3）
2. 设置合理的采样策略
3. 配置 Trace 保留时间
4. 启用 Metrics Generator
5. 配置 Grafana 数据源
6. 建立追踪-日志关联
7. 监控 Tempo 组件健康状态
8. 配置多租户隔离（如需要）

## 总结

Tempo 是 Grafana Labs 开源的低成本分布式追踪后端，专为对象存储优化。与 Grafana、Loki、Prometheus 组成完整的可观测性栈，适合成本敏感场景。

> 💡 选择 Tempo 的核心理由是成本——相比 Jaeger，Tempo 的存储成本可降低 10 倍以上。

## 采样策略对比

| 策略 | 说明 | 适用场景 |
|------|------|------|
| 头部采样 | 固定比例采样 | 通用 |
| 尾部采样 | 根据结果采样 | 错误追踪 |
| 速率限制 | 固定 QPS 采样 | 高流量 |
| 自适应 | 动态调整采样率 | 流量波动大 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `tempo --config.file=tempo.yaml` | 启动 Tempo |
| `tempo-query --backend=s3` | 查询追踪 |
| `curl http://tempo:3200/ready` | 健康检查 |
| `curl http://tempo:3200/metrics` | 查看指标 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| Tempo 官方文档 | 文档 | 配置和使用指南 |
| Grafana 可观测性 | 博客 | 最佳实践 |
| OpenTelemetry 文档 | 文档 | 遥测标准 |
| Grafana Labs 社区 | 社区 | 问答和讨论 |

## 总结

Tempo 是 Grafana Labs 开源的低成本分布式追踪后端，专为对象存储优化。与 Grafana、Loki、Prometheus 组成完整的可观测性栈，适合成本敏感场景。

> 💡 Tempo 的核心价值是“低成本追踪”——用对象存储替代昂贵索引，让追踪数据不再是成本负担。

## 相关概念

- [[概念/jaeger|Jaeger]] — 分布式链路追踪
- [[概念/opentelemetry|OpenTelemetry]] — 统一可观测性标准
- [[概念/loki|Loki]] — 日志聚合
- [[概念/grafana|Grafana]] — 可视化平台
