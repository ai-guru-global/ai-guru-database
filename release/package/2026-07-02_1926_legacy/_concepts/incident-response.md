---
title: "Incident Response"
category: -concepts
tags: ["sre", "reliability", "incident-response", "on-call", "alibaba-cloud"]
summary: "Incident Response（事故响应）是指系统发生故障时，按照预定流程进行检测、响应、止血、定位、修复和复盘的全过程。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "事故响应"
  - "Incident Management"
relationships:
  - target: "_concepts/sre"
    type: part_of
  - target: "_concepts/slo"
    type: related_to
---

# Incident Response

> **一句话理解**: 事故响应就是系统出问题时，按流程「救火」：先止血再修，最后复盘避免再犯。

## 核心要点

- **事件分级**: P0/P1/P2/P3，按影响范围与紧急程度划分
- **响应流程**: 检测 → 响应 → 止血 → 定位 → 修复 → 验证 → 复盘
- **战时角色**: Incident Commander、Communications Lead、Engineering Lead
- **Runbook**: 标准化处置步骤
- **复盘**: 无责备复盘，关注系统改进

## 关键指标

| 指标 | 说明 |
|------|------|
| MTTD | Mean Time To Detect 平均检测时间 |
| MTTR | Mean Time To Repair 平均修复时间 |
| MTTF | Mean Time To Failure 平均无故障时间 |

## 阿里云专有云关联

在阿里云专有云环境中，事故响应需联动 ASCM 告警中心、天基运维平台、ACK 控制台与 PAI/EAS 控制台。

## Related

- [[_concepts/sre|SRE]]
- [[_concepts/slo|SLO]]
- [[_concepts/error-budget|Error Budget]]
- [[运维/Incident_Response/AI_Incident_Response_Framework|AI 事故响应框架]]
