---
title: "SLO"
category: -concepts
tags: ["sre", "reliability", "slo", "observability", "alibaba-cloud"]
summary: "SLO（Service Level Objective）是服务可靠性目标，用可量化的指标（如可用性、延迟）定义系统应该达到的服务水平。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "Service Level Objective"
  - "服务等级目标"
relationships:
  - target: "概念/sli"
    type: derived_from
  - target: "概念/error-budget"
    type: related_to
  - target: "概念/sla"
    type: related_to
sources: []
name_zh: "服务水平目标"
---

# SLO

> 中文简称：服务水平目标

> **一句话理解**: SLO 就是你对用户承诺的服务水平目标，比如「99.9% 可用」或「95% 请求延迟 < 200ms」。

## 核心要点

- **量化承诺**: 用具体数字定义服务应该达到什么水平。
- **基于 SLI**: SLO 是从 SLI（服务等级指标）推导出来的目标值。
- **错误预算**: 1 - SLO = 错误预算，用于决定发布节奏。
- **不要过度承诺**: SLO 应与业务需求和成本平衡。

## 示例

| SLI | SLO |
|-----|-----|
| 可用性 | 99.9% |
| 延迟 p99 | < 500ms |
| 错误率 | < 0.1% |

## 阿里云专有云关联

在阿里云专有云环境中，SLO 常用于 ACK 上的 AI 推理服务、PAI-EAS 服务等。ASCM 告警中心可基于 SLO 阈值配置告警。

## Related

- [[概念/sli|SLI]]
- [[概念/error-budget|Error Budget]]
- [[概念/sla|SLA]]
- [[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南|LLM 推理 SLO 实践指南]]

---

## 2026 SLO 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **SLO 定义** | 服务水平目标 | GA |
| **SLI 指标** | 服务水平指标 | GA |
| **Error Budget** | 错误预算 | GA |
| **SLO 监控** | SLO 达成率监控 | GA |
| **LLM SLO** | LLM 推理延迟/吞吐 SLO | GA |

## 生产最佳实践

1. **SLO 定义**：为关键服务定义明确 SLO
2. **SLI 测量**：准确测量 SLI 指标
3. **错误预算**：用错误预算平衡可靠性与迭代
4. **SLO 监控**：实时监控 SLO 达成率
5. **LLM SLO**：LLM 服务定义延迟/吞吐 SLO

## SLO 定义框架

| 步骤 | 内容 | 输出 |
|------|------|------|
| 1. 识别用户旅程 | 关键用户操作 | 用户旅程图 |
| 2. 定义 SLI | 可测量的指标 | SLI 列表 |
| 3. 设定 SLO | 目标值 + 窗口 | SLO 文档 |
| 4. 计算错误预算 | 1 - SLO | 错误预算 |
| 5. 配置告警 | 多窗口燃烧率 | 告警规则 |

## LLM 推理服务 SLO 模板

| SLI | SLO | 窗口 | 说明 |
|-----|-----|------|------|
| 可用性 | 99.9% | 30d | 服务可用时间比例 |
| TTFT P95 | < 500ms | 7d | 首 Token 延迟 |
| TPS P95 | < 2s | 7d | 每 Token 生成时间 |
| 错误率 | < 0.1% | 24h | 5xx + 超时 |
| 吞吐量 | > 100 QPS | 1h | 并发处理能力 |

## 配置示例

```yaml
# Sloth SLO 定义
apiVersion: sloth.slok.dev/v1
kind: PrometheusServiceLevel
metadata:
  name: llm-inference-slo
spec:
  service: llm-inference
  slos:
    - name: availability
      objective: 99.9
      description: "LLM 推理服务可用性"
      sli:
        events:
          error_query: sum(rate(http_requests_total{job="llm",code=~"5.."}[5m]))
          total_query: sum(rate(http_requests_total{job="llm"}[5m]))
    - name: latency
      objective: 95
      description: "P95 延迟 < 2s"
      sli:
        events:
          error_query: sum(rate(http_request_duration_seconds_bucket{job="llm",le="2"}[5m]))
          total_query: sum(rate(http_request_duration_seconds_count{job="llm"}[5m]))
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| SLO 过于激进 | 未基于实际数据 | 从 99% 开始逐步提高 |
| SLI 测量不准 | 采样点不对 | 在用户入口测量 |
| 无人关注 SLO | 缺乏自动化门控 | CI/CD 集成预算检查 |
| 多服务 SLO 冲突 | 依赖服务 SLO 不一致 | 统一 SLO 体系 |

## 相关概念

- [[概念/General/sli|SLI]] — 服务水平指标
- [[概念/error-budget|Error Budget]] — 错误预算
- [[概念/General/sla|SLA]] — 服务水平协议
- [[概念/General/sre|SRE]] — 站点可靠性工程

## 总结

SLO 是服务可靠性目标，用可量化的指标定义系统应该达到的服务水平。在 AI 推理场景中，需要特别关注 TTFT、TPS 和 GPU 利用率等指标。

---

> 💡 SLO 就是你对用户承诺的服务水平目标，比如「99.9% 可用」或「95% 请求延迟 < 200ms」。

## SLO 监控架构

```
SLI 采集 → SLO 计算 → 错误预算 → 告警/门控
   │            │            │            │
Prometheus   Sloth      Grafana    CI/CD 集成
OTel SDK     滑动窗口   Dashboard  ArgoCD
```

| 层级 | 工具 | 职责 |
|------|------|------|
| SLI 采集 | Prometheus / OTel | 采集原始指标 |
| SLO 计算 | Sloth / 自研 | 计算达成率 |
| 可视化 | Grafana | SLO Dashboard |
| 告警 | Alertmanager | 多窗口燃烧率告警 |
| 门控 | GitHub Actions | 预算耗尽拦截发布 |

## 工具对比

| 工具 | 定位 | 特点 | 适用场景 |
|------|------|------|----------|
| **Sloth** | K8s SLO | Prometheus 原生 | K8s 环境 |
| **OpenSLO** | 标准规范 | YAML 定义 | 标准化 |
| **Nobl9** | SLO 平台 | 专业 SLO 管理 | 企业级 |
| **Datadog SLO** | APM 集成 | 与 APM 无缝 | 已用 Datadog |
| **Grafana SLO** | 可视化 | 与 Grafana 集成 | 已用 Grafana |

## SLO 审视周期

| 周期 | 内容 | 参与者 |
|------|------|--------|
| 每周 | SLO 达成率回顾 | SRE + 开发 |
| 每月 | 错误预算消耗分析 | SRE + 产品 |
| 每季 | SLO 调整审视 | 全员 |
| 每年 | SLO 体系重构 | 管理层 + 工程 |

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| Sloth | v0.11+ | 稳定 |
| OpenSLO | v1.0 | Beta |
| Prometheus | 2.50+ | 稳定 |
| Grafana | 11+ | 稳定 |

## AI 服务 SLO 最佳实践

1. **用 P95 而非 P99**：LLM 推理延迟波动大，P99 容易误报
2. **短窗口**：用 7d 而非 30d 窗口，适应模型更新
3. **包含 GPU 故障**：GPU 故障算作服务不可用
4. **区分冷启动**：模型加载时间不计入 SLO
5. **批量 vs 实时**：分开定义 SLO

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| 《SRE: Google 运维之道》 | 书籍 | SLO 章节 |
| Sloth 文档 | 官方 | K8s SLO 工具 |
| OpenSLO 规范 | 文档 | SLO 标准化 |
