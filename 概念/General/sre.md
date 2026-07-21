---
title: "SRE"
category: -concepts
tags: ["sre", "reliability", "devops", "alibaba-cloud"]
summary: "SRE（Site Reliability Engineering）是将软件工程方法应用于运维的实践，通过 SLO、自动化和错误预算保障系统可靠性。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Site Reliability Engineering"
  - "站点可靠性工程"
relationships:
  - target: "概念/platform-engineering"
    type: related_to
  - target: "概念/slo"
    type: uses
sources: []
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

- [[概念/slo|SLO]]
- [[概念/sli|SLI]]
- [[概念/error-budget|Error Budget]]
- [[概念/incident-response|Incident Response]]

---

## 2026 SRE 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **SLO/SLI** | 服务水平目标/指标 | GA |
| **Error Budget** | 错误预算管理 | GA |
| **可观测性** | 指标/日志/追踪 | GA |
| **混沌工程** | 故障注入测试 | GA |
| **AIOps** | AI 驱动运维 | GA |

## 生产最佳实践

1. **SLO 定义**：为关键服务定义 SLO
2. **错误预算**：用错误预算平衡可靠性与迭代速度
3. **可观测性**：建立完整可观测性体系
4. **自动化**：自动化重复运维任务
5. **事后复盘**：事故后进行无责复盘
