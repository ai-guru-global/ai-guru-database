---
title: "SLI"
category: -concepts
tags: ["sre", "reliability", "sli", "observability", "metrics"]
summary: "SLI（Service Level Indicator）是用于衡量服务水平的具体指标，如可用性、延迟、错误率、吞吐量等。"
created: 2026-06-26
updated: 2026-07-21
tier: core
lifecycle: reviewed
aliases:
  - "Service Level Indicator"
  - "服务等级指标"
relationships:
  - target: "概念/slo"
    type: feeds
  - target: "概念/prometheus"
    type: measured_by
sources: []
---

# SLI（Service Level Indicator）

> **一句话理解**: SLI = 「你拿什么数字来衡量服务好不好」，比如可用性、延迟、错误率。

## 定义

SLI（Service Level Indicator）是衡量服务水平的具体可量化指标，反映用户实际体验。SLI 是 SLO 的基础：SLO = SLI + 目标值。

## AI 服务常见 SLI

| 指标类型 | SLI 定义 | 计算方式 | 典型目标 |
|----------|----------|----------|----------|
| **可用性** | 成功请求占比 | 成功数/总请求数 | > 99.9% |
| **延迟 (TTFT)** | 首 token 时间 | P95/P99 | < 500ms |
| **延迟 (TPS)** | 每 token 速度 | tokens/s | > 30 t/s |
| **错误率** | 5xx 占比 | 5xx/总响应 | < 0.1% |
| **吞吐量** | 每秒处理请求 | req/s | 视业务 |
| **质量** | 用户满意度 | 点赞/点踩比 | > 90% |

## SLI 采集架构

```
用户请求 → API Gateway → LLM 服务
              |                |
         Prometheus       自定义指标
              |                |
              └──── Grafana ────┘
                       |
                  SLO 计算引擎
```

## Prometheus 采集示例

```yaml
# SLI: 可用性
- record: sli:availability:ratio
  expr: |
    sum(rate(http_requests_total{status!~"5.."}[5m]))
    /
    sum(rate(http_requests_total[5m]))

# SLI: TTFT P95
- record: sli:ttft:p95
  expr: |
    histogram_quantile(0.95,
      rate(vllm:time_to_first_token_seconds_bucket[5m]))
```

## 生产最佳实践

1. **从用户视角定义**：不是 CPU 利用率，而是用户感知的延迟
2. **可聚合**：能跨实例、跨时间窗口聚合
3. **低延迟采集**：实时或准实时，不要 T+1
4. **区分业务线**：不同场景不同 SLI
5. **与告警联动**：SLI 异常 → 自动触发告警

## Related

- [[概念/slo|SLO]]
- [[概念/General/sla|SLA]]
- [[概念/error-budget|Error Budget]]
- [[概念/prometheus|Prometheus]]
- [[概念/Inference/ttft|TTFT]] — AI 服务核心 SLI

---

## SLI 分类体系

| 类别 | SLI 示例 | 采集方式 | 目标 |
|------|------|------|------|
| 可用性 | 成功请求占比 | HTTP 状态码 | > 99.9% |
| 延迟 | P50/P95/P99 响应时间 | Histogram | < 500ms |
| 错误率 | 5xx/总请求 | Counter | < 0.1% |
| 吞吐量 | 每秒请求数 | Rate | 视业务 |
| 质量 | 用户满意度 | 反馈/评分 | > 90% |
| 新鲜度 | 数据更新延迟 | Timestamp | < 5min |

## LLM 服务 SLI 模板

| SLI | 定义 | 计算 | 目标 |
|------|------|------|------|
| TTFT | 首 token 时间 | P95 | < 500ms |
| TPS | 每 token 速度 | 平均 | > 30 t/s |
| 完整性 | 完整响应占比 | 成功/总数 | > 99% |
| 相关性 | 答案相关度 | 评分 | > 85% |
| 安全性 | 有害输出占比 | 检测/总数 | < 0.01% |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| SLI 不可观测 | 缺少埋点 | 添加指标采集 |
| SLI 与用户体验不符 | 指标选择不当 | 从用户视角重新定义 |
| SLI 波动大 | 采样率不足 | 增加采样/平滑窗口 |
| SLI 无法聚合 | 维度不统一 | 统一标签和维度 |

## 相关概念

- [[概念/slo|SLO]] — 服务等级目标
- [[概念/General/sla|SLA]] — 服务等级协议
- [[概念/error-budget|Error Budget]] — 错误预算
- [[概念/prometheus|Prometheus]] — 指标采集

> 💡 SLI 的核心原则是“从用户视角定义”——不是 CPU 利用率，而是用户感知的延迟和可用性。

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| Prometheus | 2.50+ | GA |
| Grafana | 10.0+ | GA |
| OpenSLO | 1.0+ | GA |
| Sloth | 0.10+ | GA |

## 生产检查清单

1. 从用户视角定义 SLI
2. 确保 SLI 可观测和可聚合
3. 配置实时采集和低延迟存储
4. 区分不同业务线的 SLI
5. 建立 SLI 与告警的联动
6. 定期审视 SLI 有效性
7. 建立 SLI 历史基线
8. 配置 SLI 异常自动通知

## 总结

SLI 是衡量服务水平的具体可量化指标，是 SLO 的基础。对于 AI 服务，TTFT、TPS、完整性、相关性是核心 SLI。

> 💡 SLI 的核心价值是将“服务好不好”从主观感受变为客观数字——没有 SLI，SLO 和 SLA 都是空谈。

## 常用命令

| 命令 | 说明 |
|------|------|
| `promtool check rules rules.yml` | 检查规则语法 |
| `curl http://prometheus:9090/api/v1/query?query=...` | 查询指标 |
| `curl http://grafana:3000/api/dashboards` | 查看仪表板 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| Google SRE 书籍 | 书籍 | SLI/SLO 最佳实践 |
| OpenSLO | 规范 | SLO 定义标准 |
| Sloth | 工具 | SLO 生成器 |
| Prometheus 文档 | 文档 | 指标采集 |

## SLI vs SLO vs SLA

| 维度 | SLI | SLO | SLA |
|------|------|------|------|
| 定义 | 具体指标 | 指标 + 目标值 | 合同承诺 |
| 示例 | 可用性 99.95% | 可用性 ≥ 99.9% | 可用性 < 99.9% 赔偿 |
| 受众 | 工程团队 | 工程 + 产品 | 客户 + 法务 |
| 约束力 | 无 | 内部目标 | 法律约束 |
| 关系 | SLI 是基础 | SLO = SLI + 目标 | SLA = SLO + 赔偿 |

## 总结

SLI 是衡量服务水平的具体可量化指标，是 SLO 的基础。对于 AI 服务，TTFT、TPS、完整性、相关性是核心 SLI。从用户视角定义 SLI 是 SRE 实践的第一步。

> 💡 SLI 的核心原则是“从用户视角定义”——不是 CPU 利用率，而是用户感知的延迟和可用性。

## SLI 采集架构

| 组件 | 职责 | 工具 |
|------|------|------|
| 埋点 | 采集原始指标 | OTel SDK |
| 存储 | 时序数据存储 | Prometheus |
| 计算 | SLI 计算引擎 | Recording Rules |
| 可视化 | SLI 仪表板 | Grafana |
| 告警 | SLI 异常通知 | AlertManager |

## 总结

SLI 是衡量服务水平的具体可量化指标，是 SLO 的基础。对于 AI 服务，TTFT、TPS、完整性、相关性是核心 SLI。从用户视角定义 SLI 是 SRE 实践的第一步。

> 💡 SLI 的核心价值是将“服务好不好”从主观感受变为客观数字——没有 SLI，SLO 和 SLA 都是空谈。

## 相关概念

- [[概念/slo|SLO]] — 服务等级目标
- [[概念/General/sla|SLA]] — 服务等级协议
- [[概念/error-budget|Error Budget]] — 错误预算
- [[概念/prometheus|Prometheus]] — 指标采集
