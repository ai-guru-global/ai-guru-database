---
title: "Error Budget"
category: -concepts
tags: ["sre", "reliability", "slo", "error-budget", "release-management"]
summary: "Error Budget（错误预算）是 SLO 允许的不可用量化上限，用于平衡发布速度与稳定性。"
created: 2026-06-26
updated: 2026-07-21
tier: core
lifecycle: reviewed
aliases:
  - "错误预算"
relationships:
  - target: "概念/slo"
    type: derived_from
  - target: "概念/sli"
    type: related_to
sources: []
name_zh: "错误预算"
---

# Error Budget（错误预算）

> 中文简称：错误预算

> **一句话理解**: 错误预算 = 「你允许服务一个月出多久的错」——预算花光了，就先别发版，先把稳定性修好。

## 定义

Error Budget = 1 - SLO，是服务在给定时间窗口内允许的最大不可用量。它是 SRE 与开发团队之间平衡发布速度与稳定性的核心机制。

## 计算示例

| SLO | 月度错误预算 | 含义 |
|-----|-------------|------|
| 99.9% | 43.2 分钟 | 每月允许 43min 不可用 |
| 99.95% | 21.6 分钟 | 更严格 |
| 99.99% | 4.32 分钟 | 金融级 |
| 99.999% | 26 秒 | 电信级 |

## 预算消耗监控

```
剩余预算 = 总预算 - 已消耗

消耗速度 = 已消耗 / 已过时间
预计耗尽 = 剩余预算 / 消耗速度
```

| 状态 | 消耗比例 | 行动 |
|------|----------|------|
| 🟢 健康 | < 50% | 正常发布 |
| 🟡 警告 | 50-80% | 加强审查 |
| 🔴 危险 | > 80% | 冻结发布 |
| ⚫ 耗尽 | 100% | 强制复盘 + 修复 |

## 生产最佳实践

1. **自动化门控**：预算 < 20% 时 CI/CD 自动拦截发布
2. **多窗口监控**：1h/6h/24h/30d 多时间窗口
3. **与发布联动**：每次发布消耗预算，大发布消耗更多
4. **无责备文化**：预算耗尽不是惩罚，是系统改进信号
5. **AI 服务特殊考虑**：LLM 推理延迟波动大，建议用 P95 而非 P99

## Related

- [[概念/slo|SLO]]
- [[概念/General/sli|SLI]]
- [[概念/General/sla|SLA]]
- [[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南|LLM 推理 SLO 实践指南]]

---

## 2026 错误预算生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **多窗口燃烧率** | 1h/6h/24h/30d 多窗口告警 | GA |
| **自动化门控** | CI/CD 集成预算检查 | GA |
| **AI 服务 SLO** | LLM 推理专用 SLO 模板 | 社区 |
| **OpenSLO** | SLO 标准化规范 | Beta |

## 错误预算策略矩阵

| 预算剩余 | 发布策略 | 工程重点 | 管理层沟通 |
|----------|----------|----------|------------|
| > 80% | 自由发布 | 功能开发 | 无需特别关注 |
| 50-80% | 正常发布 | 功能 + 可靠性 | 周报提及 |
| 20-50% | 加强审查 | 可靠性优先 | 主动汇报 |
| < 20% | 冻结发布 | 专注修复 | 升级处理 |
| 0% | 禁止发布 | 全面复盘 | 事故报告 |

## 配置示例

```yaml
# Prometheus 错误预算告警规则
groups:
  - name: error-budget
    rules:
      # 快速燃烧: 1h 内消耗 > 2% 预算
      - alert: ErrorBudgetFastBurn
        expr: |
          (1 - slo:availability:ratio_rate1h) > (1 - slo_target) * 14.4
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "错误预算快速消耗 (1h 窗口)"
      # 慢速燃烧: 6h 内消耗 > 5% 预算
      - alert: ErrorBudgetSlowBurn
        expr: |
          (1 - slo:availability:ratio_rate6h) > (1 - slo_target) * 6
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "错误预算慢速消耗 (6h 窗口)"
```

## AI 推理服务错误预算特殊考虑

| 维度 | 传统服务 | AI 推理服务 | 建议 |
|------|----------|------------|------|
| 延迟 SLO | P99 < 200ms | P95 < 2s | 用 P95 而非 P99 |
| 可用性 | 99.99% | 99.9% | 允许模型加载时间 |
| 错误定义 | 5xx 响应 | 5xx + 超时 + OOM | 包含推理失败 |
| 窗口 | 30d 滚动 | 7d 滚动 | 更短窗口适应波动 |
| GPU 故障 | N/A | 纳入预算 | GPU 故障算作服务不可用 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 预算消耗过快 | 发布频率高 | 加强发布前测试 |
| 团队不重视 | 缺乏自动化门控 | CI/CD 集成预算检查 |
| SLO 设置不合理 | 未基于用户体验 | 从用户旅程反推 SLO |
| 多服务依赖 | 下游故障消耗预算 | 设置依赖服务独立 SLO |

## 相关概念

- [[概念/slo|SLO]] — 服务水平目标
- [[概念/General/sli|SLI]] — 服务水平指标
- [[概念/General/sla|SLA]] — 服务水平协议
- [[概念/General/sre|SRE]] — 站点可靠性工程
- [[概念/General/resilience|Resilience]] — 系统韧性

## 总结

错误预算是 SRE 与开发团队之间平衡发布速度与稳定性的核心机制。通过量化允许的不可用时间，让团队在预算内自由发布，预算耗尽时专注修复。

---

> 💡 错误预算 = 1 - SLO，是平衡发布速度与稳定性的量化机制。预算花光了，就先别发版，先把稳定性修好。

## 实施工作流

```
1. 定义 SLI → 2. 设定 SLO → 3. 计算错误预算
       ↓                              ↓
4. 配置监控告警 → 5. 集成 CI/CD 门控 → 6. 定期复盘
```

| 步骤 | 工具 | 负责人 |
|------|------|--------|
| 定义 SLI | Prometheus + 业务指标 | SRE + 产品 |
| 设定 SLO | 基于用户体验 | 产品 + 工程 |
| 监控告警 | Grafana + Alertmanager | SRE |
| CI/CD 门控 | GitHub Actions / ArgoCD | 平台工程 |
| 复盘改进 | 事后报告模板 | SRE + 开发 |

## 工具对比

| 工具 | 定位 | 特点 | 适用场景 |
|------|------|------|----------|
| **Prometheus + Grafana** | 开源监控 | 灵活、可定制 | 自建监控 |
| **Nobl9** | SLO 平台 | 专业 SLO 管理 | 企业级 |
| **Datadog SLO** | APM 集成 | 与 APM 无缝集成 | 已用 Datadog |
| **OpenSLO** | 标准规范 | YAML 定义 SLO | 标准化 |
| **Sloth** | K8s SLO | Prometheus 原生 | K8s 环境 |

## 实践案例：LLM 推理服务

```yaml
# LLM 推理服务 SLO 定义
apiVersion: sloth.slok.dev/v1
kind: PrometheusServiceLevel
metadata:
  name: llm-inference-availability
spec:
  service: llm-inference
  labels:
    team: ai-platform
  slos:
    - name: availability
      objective: 99.9
      description: "LLM 推理服务可用性"
      sli:
        events:
          error_query: |
            sum(rate(http_requests_total{job="llm-inference",code=~"5.."}[5m]))
          total_query: |
            sum(rate(http_requests_total{job="llm-inference"}[5m]))
      alerting:
        name: LLMInferenceErrorBudget
        labels:
          category: ai-platform
        page_alert:
          labels:
            severity: critical
        ticket_alert:
          labels:
            severity: warning
```

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| Sloth | v0.11+ | 稳定 |
| OpenSLO | v1.0 | Beta |
| Nobl9 | SaaS | GA |
| Prometheus | 2.50+ | 稳定 |

