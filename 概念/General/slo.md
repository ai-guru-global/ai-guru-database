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
---

# SLO

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
- [[运维/SRE_Reliability/LLM_Inference_SLO_Guide|LLM 推理 SLO 实践指南]]

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
