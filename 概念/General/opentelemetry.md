---
title: "OpenTelemetry"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "tracing", "metrics", "logging", "cloud-native", "alibaba-cloud"]
summary: "OpenTelemetry 是 CNCF 孵化的统一可观测性标准与工具集，提供 Metrics、Traces、Logs 的采集、转换和导出能力。"
created: 2026-06-26
updated: 2026-07-21
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

---

## 2026 OpenTelemetry 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **OpenTelemetry** | 统一遥测标准 | GA |
| **Traces/Metrics/Logs** | 三大支柱统一 | GA |
| **Collector** | 遥测数据收集器 | GA |
| **SDK** | 多语言 SDK | GA |
| **自动插桩** | 自动遥测插桩 | GA |

## 生产最佳实践

1. **统一遥测**：用 OpenTelemetry 统一遥测
2. **自动插桩**：用自动插桩减少代码侵入
3. **Collector 部署**：部署 OTel Collector
4. **与后端配合**：OTel + Prometheus/Loki/Tempo
5. **采样策略**：配置合适的采样策略

## AI/LLM 场景遥测

| 场景 | 采集内容 | 信号类型 |
|------|----------|----------|
| **LLM 推理** | token 数、延迟、模型版本 | Metrics + Traces |
| **RAG 流水线** | 检索分数、重排延迟、生成质量 | Traces + Logs |
| **Agent 执行** | 工具调用链、步骤耗时 | Traces |
| **训练任务** | loss、GPU 利用率、吞吐量 | Metrics |

## 自动插桩示例

```python
# Python 自动插桩
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# 初始化
provider = TracerProvider()
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(endpoint="http://otel-collector:4317"))
)
trace.set_tracer_provider(provider)

# LLM 调用追踪
tracer = trace.get_tracer("llm-service")
with tracer.start_as_current_span("llm_inference") as span:
    span.set_attribute("model", "gpt-4o")
    span.set_attribute("input_tokens", 150)
    span.set_attribute("output_tokens", 320)
    # ... LLM 调用
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 数据丢失 | Collector 缓冲溢出 | 增大 queue_size + 批处理 |
| 性能影响 | 同步导出 | 使用 BatchProcessor |
| 标签爆炸 | 动态属性过多 | 限制属性数量 |
| 版本不兼容 | SDK/Collector 版本不匹配 | 统一版本管理 |
| 采样不当 | 全量采集成本高 | 尾部采样保留异常 |

## 版本兼容性

| 组件 | 推荐版本 | 说明 |
|------|----------|------|
| OTel Collector | 0.105+ | 核心收集器 |
| Python SDK | 1.25+ | 自动插桩 |
| Go SDK | 1.28+ | 自动插桩 |
| Java Agent | 2.x | 零代码插桩 |
| OTLP 协议 | 1.x | 传输协议 |

## 生产检查清单

1. Collector 部署为 DaemonSet + Deployment 双层
2. 配置 BatchProcessor 减少网络开销
3. 启用尾部采样保留错误和慢请求
4. 统一服务命名规范 (service.name)
5. 监控 Collector 自身健康指标
6. 定期审查属性基数防止存储膨胀

## 总结

OpenTelemetry 是云原生可观测性的统一标准，一次埋点即可产出 Metrics、Traces、Logs 三大信号。在 AI/LLM 场景中，OTel 是追踪 RAG 流水线、Agent 调用链、推理服务性能的基础设施。

> 💡 OTel 的核心价值：消除可观测性厂商锁定——一次埋点，后端可自由切换 Prometheus/Jaeger/Loki/Tempo，是云原生可观测性的“普通话”。

## OTel AI 服务埋点示例

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# 初始化 Tracer
provider = TracerProvider()
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(endpoint="http://otel-collector:4317"))
)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("inference-service")

# 推理服务埋点
with tracer.start_as_current_span("llm_inference") as span:
    span.set_attribute("model.name", "llama-3-70b")
    span.set_attribute("model.tokens.input", len(input_tokens))
    span.set_attribute("model.tokens.output", len(output_tokens))
    span.set_attribute("inference.latency_ms", latency)
    span.set_attribute("inference.batch_size", batch_size)
    result = model.generate(prompt)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 数据丢失 | 导出端不可达 | 配置重试 + 本地缓冲 |
| 性能影响 | 同步导出 | 使用 BatchSpanProcessor |
| 标签基数高 | 动态值作标签 | 限制标签值范围 |
| 与框架集成难 | 版本不兼容 | 使用官方 instrumentation 库 |

## 生产检查清单

1. ✅ 使用 OTLP 标准协议导出
2. ✅ 异步批量导出避免性能影响
3. ✅ AI 服务关键指标埋点（延迟/token/批次）
4. ✅ 与 Grafana/Prometheus/Jaeger 集成
5. ✅ 控制标签基数避免存储爆炸
6. ✅ 定期审计埋点覆盖率
