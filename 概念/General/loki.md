---
title: "Loki"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "logging", "grafana", "cloud-native", "alibaba-cloud"]
summary: "Loki 是 Grafana Labs 开源的轻量级日志聚合系统，采用类似 Prometheus 的标签索引模型，专为 Kubernetes 等云原生环境设计。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Grafana Loki"
  - "Loki 日志系统"
relationships:
  - target: "概念/prometheus"
    type: related_to
  - target: "概念/grafana"
    type: related_to
  - target: "概念/kubernetes"
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

- [[概念/prometheus|Prometheus]] — 指标监控
- [[概念/grafana|Grafana]] — 可视化与告警
- [[概念/fluent-bit|Fluent Bit]] — 日志采集器
- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[架构基建/Kubernetes_Observability_Stack|Kubernetes 可观测性栈]]

---

## 2026 Loki 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Grafana Loki** | 日志聚合系统 | GA |
| **LogQL** | 日志查询语言 | GA |
| **与 Grafana 集成** | 日志可视化 | GA |
| **与 Prometheus 关联** | 日志-指标关联 | GA |
| **对象存储** | 日志对象存储 | GA |

## 生产最佳实践

1. **日志聚合**：K8s 日志用 Loki 聚合
2. **LogQL 查询**：用 LogQL 查询日志
3. **与 Grafana 配合**：Loki + Grafana 可视化
4. **日志-指标关联**：日志与指标关联分析
5. **采样策略**：配置合适的日志采样

## Loki 部署架构（微服务模式）

```yaml
# loki-distributed.yaml
apiVersion: loki.grafana.com/v1
kind: LokiStack
metadata:
  name: loki-production
spec:
  size: 1x.extra.small
  storage:
    schemas:
      - version: v13
        effectiveDate: "2026-01-01"
    secret:
      name: loki-s3-secret
      type: s3
  tenants:
    mode: static
  limits:
    global:
      retention:
        days: 14
      ingestion:
        ingestionRate: 10MB
        ingestionBurstSize: 20MB
```

## AI/LLM 场景日志实践

| 场景 | 日志内容 | LogQL 示例 |
|------|----------|----------|
| **推理服务** | 请求延迟、token 数、错误 | `{app="vllm"} \|= "error"` |
| **RAG 流水线** | 检索结果、重排分数 | `{app="rag"} \| json \| score < 0.5` |
| **Agent 执行** | 工具调用、步骤日志 | `{app="agent"} \|= "tool_call"` |
| **训练任务** | loss、梯度、异常 | `{job="training"} \|= "nan"` |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 日志丢失 | Promtail 缓冲溢出 | 增大 batchwait/batchsize |
| 查询超时 | 时间范围太大 | 缩小查询范围、加标签过滤 |
| 存储膨胀 | 未配置保留策略 | 设置 retention 14天 |
| 标签基数爆炸 | 动态标签过多 | 避免用 trace_id 作标签 |
| Ingester OOM | 突发流量 | 设置 HPA + 资源限制 |

## 版本兼容性

| 组件 | 推荐版本 | 说明 |
|------|----------|------|
| Loki | 3.x | 微服务架构 |
| Grafana | 10.x | 可视化 |
| Promtail | 3.x | 日志采集 |
| Fluent Bit | 3.x | 替代采集器 |
| MinIO/S3 | 最新 | 对象存储 |

## 生产检查清单

1. 配置日志保留策略（14 天）
2. 避免高基数标签（不用 trace_id/pod_name 作标签）
3. 设置 ingestion rate limit 防止突发流量
4. 启用 WAL 防止 Ingester 崩溃丢数据
5. 对象存储启用生命周期策略自动清理
6. 配置 Grafana 告警规则监控日志异常

## 总结

Loki 是云原生日志聚合的轻量级首选，其“只索引标签”的设计使其存储成本仅为 Elasticsearch 的 1/10。与 Prometheus + Grafana 组合构成完整的 K8s 可观测性栈。

> 💡 Loki 的核心优势：用 Prometheus 的思路做日志——标签索引而非全文索引，大幅降低存储成本，同时通过 LogQL 保持强大的查询能力。

## LogQL 查询示例

```logql
# AI 推理服务错误日志
{app="inference-server", level="error"} |= "OOM" | json | duration > 1000

# 模型加载时间统计
{app="model-loader"} |= "loaded" | json | unwrap duration_ms | avg by (model_name)

# GPU 节点异常日志
{node=~"gpu-.*"} |= "ECC error" | line_format "{{.time}} {{.message}}"

# 推理延迟 P99
{app="inference-server"} | json | unwrap latency_ms | quantile(0.99) by (model)
```

## Loki vs ELK vs Fluentd 对比

| 维度 | Loki | ELK | Fluentd |
|------|------|-----|----------|
| 索引方式 | 标签 | 全文 | 无（转发） |
| 存储成本 | 低 | 高 | N/A |
| 查询能力 | LogQL | KQL/DSL | 无 |
| 学习曲线 | 低 | 高 | 中 |
| K8s 集成 | 原生 | 需配置 | 原生 |
| 适用规模 | 中-大 | 大 | 任意 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 查询慢 | 标签基数过高 | 减少标签数量 + 合理分级 |
| 日志丢失 | 采集端缓冲溢出 | 增大 Fluent Bit 缓冲 |
| 存储增长快 | 保留策略未配置 | 设置 retention 期限 |
| 与 Grafana 集成失败 | 数据源配置错误 | 检查 URL + 认证配置 |

## 生产检查清单

1. ✅ 标签设计合理（低基数、高区分度）
2. ✅ 配置日志保留策略（30-90 天）
3. ✅ 采集端配置缓冲和重试
4. ✅ 与 Grafana + Prometheus 统一可观测性
5. ✅ 关键日志配置告警规则
6. ✅ 定期审计标签基数和存储用量

## 总结

Loki 是云原生日志管理的最佳选择，其标签索引模式和 LogQL 查询语言使其与 Prometheus/Grafana 生态无缝集成。2026 年已成为 K8s 环境 AI 服务日志管理的事实标准。

> 💡 Loki 的核心哲学：“像指标一样对待日志”——用标签而非全文索引，用 LogQL 而非 DSL，保持简单和低成本。
