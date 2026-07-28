---
title: "Grafana"
category: -concepts
tags: ["grafana", "observability", "visualization", "dashboard", "monitoring", "metrics", "logs", "traces"]
relationships:
  - target: "概念/prometheus"
    type: paired_with
  - target: "概念/observability"
    type: extends
  - target: "概念/loki"
    type: related_to
  - target: "概念/tempo"
    type: related_to
sources:
  - MLOps/Observability/Prometheus_Grafana_Deep_Dive.md
summary: "Grafana 是开源的可视化与监控平台，支持 Prometheus、Loki、Tempo、Elasticsearch 等多种数据源，广泛用于构建 AI 系统和云原生基础设施的监控大盘。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Grafana

name_zh: "可视化监控平台"
---
# Grafana

> 中文简称：可视化监控平台

> 监控数据的「仪表盘」——把时序指标变成一目了然的图表。

---

## 1. 一句话定义

**Grafana** 是开源的可视化与监控平台，支持对接 Prometheus、Loki、Tempo、Elasticsearch、InfluxDB 等多种数据源，通过 Dashboard、Alerting、Explore 帮助团队构建统一的 AI 系统和云原生基础设施可观测界面。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **多数据源** | Prometheus、Loki、Tempo、Elasticsearch、CloudWatch 等 |
| **Dashboard** | 拖拽式构建监控大盘 |
| **Alerting** | 基于查询结果触发告警 |
| **Explore** | 临时查询指标/日志/追踪 |
| **Grafana Loki** | 轻量级日志聚合 |
| **Grafana Tempo** | 分布式追踪后端 |
| **Grafana Cloud** | 托管可观测服务 |

---

## 3. AI 监控大盘常用面板

| 面板 | 数据源 | 用途 |
|------|--------|------|
| GPU 利用率 | Prometheus | 监控训练/推理 GPU 使用率 |
| 显存使用趋势 | Prometheus | 发现显存泄漏 |
| 推理 QPS/P99 延迟 | Prometheus | 服务 SLO 监控 |
| 训练 loss 曲线 | Prometheus/MLflow | 训练进度可视化 |
| 错误日志聚合 | Loki | 快速定位故障 |
| 请求追踪 | Tempo | 端到端延迟分析 |

---

## Related

- [[11_模型运维/08_Observability/Prometheus_Grafana_Deep_Dive]] — Prometheus + Grafana 深度解析
- [[概念/prometheus]] — Prometheus 监控系统
- [[概念/observability]] — 可观测性
- [[13_运维/AI_Observability_Guide_2026]] — AI 可观测指南 2026

---

## 2026 Grafana 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Grafana 11** | 可视化平台，支持 100+ 数据源 | GA |
| **Grafana Cloud** | 托管可观测性平台 | GA |
| **Grafana Loki** | 日志聚合系统 | GA |
| **Grafana Tempo** | 分布式追踪 | GA |
| **Grafana Mimir** | 长期指标存储 | GA |

## 生产最佳实践

1. **统一可视化**：用 Grafana 统一展示指标/日志/追踪
2. **告警配置**：配置关键指标告警
3. **仪表板即代码**：仪表板纳入版本控制
4. **与 Prometheus 配合**：Grafana + Prometheus 是标准组合
5. **权限控制**：配置仪表板访问权限

## 2026 Grafana 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Grafana 11+** | 新 UI、性能提升 | GA |
| **Grafana Cloud** | 托管 SaaS 平台 | GA |
| **Loki** | 日志聚合 | GA |
| **Tempo** | 分布式追踪 | GA |
| **Mimir** | 长期指标存储 | GA |
| **OnCall** | 告警管理 | GA |

## 架构：可观测性栈

```
应用/服务 → Prometheus (指标) → Grafana (可视化)
              ↓
        Loki (日志) → Grafana
              ↓
        Tempo (追踪) → Grafana
```

## 配置示例：Prometheus 数据源

```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
```

## 仪表板即代码示例

```json
{
  "dashboard": {
    "title": "ML Service Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "timeseries",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "P99 Latency",
        "type": "stat",
        "targets": [
          {
            "expr": "histogram_quantile(0.99, rate(http_duration_seconds_bucket[5m]))"
          }
        ]
      }
    ]
  }
}
```

## 告警规则示例

```yaml
apiVersion: 1
groups:
  - orgId: 1
    name: ml-alerts
    rules:
      - uid: high-error-rate
        title: High Error Rate
        condition: C
        data:
          - refId: A
            queryType: ""
            relativeTimeRange: { from: 300, to: 0 }
            datasourceUid: prometheus
            model:
              expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
```

## 延伸阅读

- [[概念/MLOps/prometheus|Prometheus]] — 指标监控
- [[概念/MLOps/observability|Observability]] — 可观测性
- [[概念/MLOps/evidently|Evidently]] — ML 监控

> ℹ️ Grafana 是开源可视化平台，支持指标、日志、追踪的统一可视化，是可观测性栈的核心组件。

## 生产最佳实践

1. **仪表板即代码**：仪表板纳入版本控制
2. **与 Prometheus 配合**：Grafana + Prometheus 是标准组合
3. **权限控制**：配置仪表板访问权限
4. **告警配置**：配置告警规则
5. **模板变量**：用模板变量实现动态仪表板
6. **数据源配置**：配置多数据源
7. **自动刷新**：配置自动刷新间隔
8. **导出分享**：仪表板导出和分享

## 检查清单

- [ ] 数据源已配置
- [ ] 仪表板已创建
- [ ] 告警规则已配置
- [ ] 权限控制已配置
- [ ] 仪表板已纳入版本控制
