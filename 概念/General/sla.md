---
title: "SLA"
category: -concepts
tags: ["sre", "reliability", "sla", "business", "availability"]
summary: "SLA（Service Level Agreement）是服务提供方与客户之间的正式服务水平协议，通常包含 SLO 和未达标时的补偿条款。"
created: 2026-06-26
updated: 2026-07-21
tier: core
lifecycle: reviewed
aliases:
  - "Service Level Agreement"
  - "服务等级协议"
relationships:
  - target: "概念/slo"
    type: related_to
  - target: "概念/sli"
    type: related_to
sources: []
---

# SLA（Service Level Agreement）

> **一句话理解**: SLA 是写进合同里的服务承诺，做不到可能要赔钱。

## 定义

SLA（Service Level Agreement）是服务提供方与客户之间的正式服务水平协议，具有合同/法律效力，包含具体的服务指标承诺和未达标时的补偿条款。

## SLI / SLO / SLA 三者关系

```
SLI（指标）→ SLO（目标）→ SLA（协议）
  测量什么     目标多少     对外承诺+赔偿
```

| 维度 | SLI | SLO | SLA |
|------|-----|-----|-----|
| **定义** | 测量指标 | 内部目标 | 对外合同 |
| **示例** | 可用性=99.95% | 目标 99.9% | 承诺 99.9% |
| **约束力** | 无 | 内部 | 法律/合同 |
| **补偿** | 无 | 无 | 有 |
| **严格度** | 实际值 | 可激进 | 保守 |

## 常见 SLA 指标（AI 服务）

| 指标 | 典型承诺 | 补偿 |
|------|----------|------|
| **可用性** | 99.9% / 99.95% | 服务积分 |
| **API 延迟** | P99 < 2s | 折扣 |
| **故障恢复** | < 30min | 赔偿 |
| **数据持久性** | 99.999999999% | 赔偿 |

## 生产最佳实践

1. **SLA 比 SLO 保守**：内部目标 99.95%，对外承诺 99.9%
2. **用 Error Budget 管理**：SLO - 实际 = 可释放的变更空间
3. **自动化监控**：SLI 采集 → SLO 计算 → SLA 报告
4. **明确免责条款**：计划维护、不可抗力不计入
5. **定期审视**：每季度根据实际数据调整 SLA

## Related

- [[概念/slo|SLO]]
- [[概念/General/sli|SLI]]
- [[概念/error-budget|Error Budget]]
- [[概念/Inference/ttft|TTFT]] — AI 服务延迟 SLA 的核心指标
