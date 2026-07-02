---
title: "SRE"
category: -concepts
tags: ["sre", "reliability", "devops", "alibaba-cloud"]
summary: "SRE（Site Reliability Engineering）是将软件工程方法应用于运维的实践，通过 SLO、自动化和错误预算保障系统可靠性。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Site Reliability Engineering"
  - "站点可靠性工程"
relationships:
  - target: "_concepts/devops"
    type: related_to
  - target: "_concepts/slo"
    type: uses
---

# SRE

> **一句话理解**: SRE 就是「用写代码的方式做运维」，用自动化、SLO、错误预算来让系统更可靠。

## 核心要点

- **SLO/SLI/SLA**: 定义和衡量可靠性
- **错误预算**: 平衡发布速度与稳定性
- **自动化**: 减少人工运维
- **可观测性**: 日志、指标、追踪
- **事故响应**: 流程化故障处理

## SRE 与 DevOps 区别

| SRE | DevOps |
|-----|--------|
| 更强调可靠性工程 | 更强调文化融合 |
| 有明确的 SLO | 更宽泛 |
| 通常有软件工程背景 | 强调开发与运维协作 |

## 阿里云专有云关联

在阿里云专有云环境中，SRE 团队负责 ACK、PAI、AI Stack 等平台的可靠性保障。

## Related

- [[_concepts/slo|SLO]]
- [[_concepts/sli|SLI]]
- [[_concepts/error-budget|Error Budget]]
- [[_concepts/incident-response|Incident Response]]
