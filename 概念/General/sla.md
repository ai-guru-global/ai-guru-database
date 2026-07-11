---
title: "SLA"
category: -concepts
tags: ["sre", "reliability", "sla", "business", "alibaba-cloud"]
summary: "SLA（Service Level Agreement）是服务提供方与客户之间的正式服务水平协议，通常包含 SLO 和未达标时的补偿条款。"
created: 2026-06-26
updated: 2026-06-26
tier: core
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

# SLA

> **一句话理解**: SLA 是写进合同里的服务承诺，如果做不到，可能要赔钱或补偿。

## 核心要点

- **商务协议**: SLA 通常具有法律或合同效力。
- **包含 SLO**: SLA 中的具体数字就是 SLO。
- **补偿条款**: 未达标时的赔偿、服务积分等。
- **面向外部客户**: 相比 SLO（内部目标），SLA 更偏外部承诺。

## 与 SLO 区别

| SLA | SLO |
|-----|-----|
| 对外合同 | 内部目标 |
| 有补偿条款 | 无补偿 |
| 更严格/保守 | 可更激进 |

## 阿里云专有云关联

在阿里云专有云环境中，SLA 通常用于客户与云服务商之间的服务承诺，涉及可用性、响应时间、故障恢复时间等。

## Related

- [[概念/slo|SLO]]
- [[概念/sli|SLI]]
- [[概念/error-budget|Error Budget]]
