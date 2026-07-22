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

## 采样策略配置

```yaml
# jaeger-sampling-config.yaml
sampling:
  default_strategy:
    type: probabilistic
    param: 0.1  # 10% 采样率
  service_strategies:
    - service: payment-service
      type: probabilistic
      param: 1.0  # 支付服务全量采样
    - service: gateway
      type: ratelimiting
      param: 100  # 限速 100 traces/s
  tail_sampling:
    policies:
      - name: errors-policy
        type: status_code
        status_code: {status_codes: [ERROR]}
      - name: slow-traces-policy
        type: latency
        latency: {threshold_ms: 500}
```

## 部署架构（K8s）

```yaml
# jaeger-production.yaml
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: jaeger-production
spec:
  strategy: production
  collector:
    maxReplicas: 5
    resources:
      requests:
        cpu: "1"
        memory: 2Gi
  storage:
    type: elasticsearch
    options:
      es:
        server-urls: https://es-cluster:9200
        index-prefix: jaeger
  agent:
    strategy: DaemonSet
  query:
    replicas: 2
```

## AI/LLM 场景追踪

| 场景 | 追踪内容 | 关键 Span |
|------|----------|----------|
| **RAG 流水线** | 检索→重排→生成全链路 | retrieval, rerank, generation |
| **Agent 调用链** | 多步工具调用 | planning, tool_call, reflection |
| **批量推理** | 批处理任务追踪 | batch_submit, inference, post_process |
| **模型服务** | 请求→推理→响应 | preprocess, model_forward, postprocess |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Trace 丢失 | 采样率过低/Agent 缓冲溢出 | 提高采样率、增大 Agent 队列 |
| UI 查询超时 | ES 索引膨胀 | 配置 ILM、缩短保留期 |
| Span 时间不准 | 服务间时钟不同步 | 部署 NTP/chrony |
| Collector OOM | 突发流量 | 设置 maxReplicas + HPA |
| 跨服务 Trace 断裂 | 未传播 Context | 检查 W3C TraceContext 头 |

## 版本兼容性

| 组件 | 推荐版本 | 说明 |
|------|----------|------|
| Jaeger | v2.x | 原生 OTel 架构 |
| OpenTelemetry SDK | 1.25+ | 统一采集 |
| Elasticsearch | 8.x | 存储后端 |
| Grafana | 10.x | 可视化集成 |
| Kubernetes | 1.28+ | 部署平台 |

## 生产检查清单

1. 配置尾部采样保留错误和慢请求 Trace
2. 设置 Trace 保留策略（通常 7-14 天）
3. Collector 启用 HPA 应对流量突增
4. 关键服务（支付、网关）全量采样
5. 与 Prometheus/Grafana 联动告警
6. 定期清理过期索引防止存储膨胀

## 总结

Jaeger 是云原生微服务可观测性的核心组件，通过分布式追踪帮助团队快速定位延迟瓶颈和故障根因。在 AI/LLM 场景中，Jaeger 可追踪 RAG 流水线、Agent 调用链等复杂异步流程，是保障 AI 系统可靠性的关键基础设施。

> 💡 Jaeger v2 全面拥抱 OpenTelemetry 架构，建议新项目直接使用 OTel SDK + Jaeger 后端，避免旧版 Jaeger Client 的维护负担。

## Jaeger AI 服务追踪示例

```python
# AI 推理服务追踪埋点
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter

tracer = trace.get_tracer("inference-service")

with tracer.start_as_current_span("rag_pipeline") as span:
    # 检索阶段
    with tracer.start_as_current_span("retrieval") as ret_span:
        ret_span.set_attribute("retrieval.top_k", 5)
        ret_span.set_attribute("retrieval.latency_ms", 45)
        docs = retrieve(query)
    
    # 生成阶段
    with tracer.start_as_current_span("generation") as gen_span:
        gen_span.set_attribute("model.name", "llama-3-70b")
        gen_span.set_attribute("generation.tokens", 256)
        response = generate(query, docs)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Trace 丢失 | 采样率过低 | 调整采样策略 |
| 查询慢 | 数据量大 | 配置数据保留期限 |
| 与 OTel 集成失败 | 版本不兼容 | 使用 Jaeger v2 + OTel SDK |
| 存储成本高 | 全量采集 | 尾部采样 + 分级存储 |

## 生产检查清单

1. ✅ 使用 OTel SDK + Jaeger v2 后端
2. ✅ AI 服务关键路径埋点
3. ✅ 配置合理采样率
4. ✅ 数据保留期限（7-30 天）
5. ✅ 与 Grafana Tempo 集成
6. ✅ 关键 Trace 告警规则
