---
title: "Incident Response"
category: -concepts
tags: ["sre", "reliability", "incident-response", "on-call", "runbook"]
summary: "Incident Response（事故响应）是指系统发生故障时，按照预定流程进行检测、响应、止血、定位、修复和复盘的全过程。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "事故响应"
  - "Incident Management"
relationships:
  - target: "概念/sre"
    type: part_of
  - target: "概念/slo"
    type: related_to
sources: []
---

# Incident Response（事故响应）

> **一句话理解**: 事故响应 = 系统出问题时按流程「救火」：先止血再修，最后复盘避免再犯。

## 定义

Incident Response 是系统发生故障时，按预定流程进行检测、响应、止血、定位、修复和复盘的全过程。目标是最大化 MTTR（平均修复时间）。

## 响应流程

```
检测 → 响应 → 止血 → 定位 → 修复 → 验证 → 复盘
 |       |       |       |       |       |       |
告警   On-call  回滚   日志   热修   确认   无责备
```

## 事件分级

| 级别 | 影响 | 响应时间 | 示例 |
|------|------|----------|------|
| **P0** | 全站不可用 | 5min | API 全部 5xx |
| **P1** | 核心功能受损 | 15min | LLM 推理超时 |
| **P2** | 部分功能异常 | 30min | 某模型不可用 |
| **P3** | 体验降级 | 4h | 延迟升高 |

## 战时角色

| 角色 | 职责 |
|------|------|
| **Incident Commander** | 统一指挥、决策 |
| **Communications Lead** | 内外部沟通、状态页更新 |
| **Engineering Lead** | 技术定位、修复执行 |
| **Scribe** | 记录时间线、操作日志 |

## 关键指标

| 指标 | 说明 | AI 服务目标 |
|------|------|------------|
| **MTTD** | 平均检测时间 | < 1min |
| **MTTR** | 平均修复时间 | < 15min |
| **MTTF** | 平均无故障时间 | > 720h |

## AI 服务特有事故类型

| 事故 | 表现 | 止血方案 |
|------|------|----------|
| **GPU OOM** | 推理服务崩溃 | 重启 + 减小 batch |
| **模型幻觉爆发** | 输出质量驤降 | 回滚模型版本 |
| **KV Cache 溢出** | 延迟飙升 | 限制并发 + 扩容 |
| **依赖 API 故障** | 工具调用失败 | 降级 + 熔断 |

## 生产最佳实践

1. **Runbook 必备**：每种事故类型有标准化处置步骤
2. **无责备复盘**：关注系统改进，不追责个人
3. **自动化止血**：自动回滚、自动扩容、自动熔断
4. **定期演练**：Chaos Engineering、Game Day
5. **状态页透明**：实时向用户通报事故状态

## Related

- [[概念/sre|SRE]]
- [[概念/slo|SLO]]
- [[概念/General/error-budget|Error Budget]]
- [[运维/Incident_Response/AI_Incident_Response_Framework|AI 事故响应框架]]
