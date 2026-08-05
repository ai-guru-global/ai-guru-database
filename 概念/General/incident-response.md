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
name_zh: "事故响应"
---

# Incident Response（事故响应）

> 中文简称：事故响应

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
- [[13_运维/03_故障应急/AI_Incident_Response_Framework|AI 事故响应框架]]

---

## 事故响应工具链

| 工具 | 职责 | 说明 |
|------|------|------|
| PagerDuty | 告警和 On-Call | 事故通知 |
| Opsgenie | 告警管理 | Atlassian 生态 |
| StatusPage | 状态页 | 用户通知 |
| Slack/钉钉 | 战时沟通 | 事故频道 |
| Jira | 事故跟踪 | 任务管理 |
| Notion/Confluence | 复盘文档 | 知识沉淀 |

## 复盘模板

| 章节 | 内容 |
|------|------|
| 事故概述 | 时间、影响、级别 |
| 时间线 | 检测→响应→修复全过程 |
| 根因分析 | 5 Whys / 鱼骨图 |
| 影响评估 | 用户数、时长、损失 |
| 改进措施 | 短期 + 长期 Action Items |
| 经验教训 | 可复用的经验 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 告警风暴 | 阈值不合理 | 告警收敛/分组 |
| 响应慢 | On-Call 流程不清 | 明确角色和职责 |
| 复盘流于形式 | 责备文化 | 无责备复盘 |
| 同样事故重复发生 | 改进未落地 | 跟踪 Action Items |

## 相关概念

- [[概念/sre|SRE]] — 站点可靠性工程
- [[概念/slo|SLO]] — 服务等级目标
- [[概念/General/error-budget|Error Budget]] — 错误预算
- [[概念/chaos-engineering|Chaos Engineering]] — 混沌工程

> 💡 事故响应的核心是“先止血再修”——不要试图在火场里找原因，先灭火再说。

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| PagerDuty | SaaS | GA |
| Opsgenie | SaaS | GA |
| StatusPage | SaaS | GA |
| Grafana OnCall | 1.0+ | GA |

## 生产检查清单

1. 建立事故分级标准和响应流程
2. 配置 On-Call 轮值和升级策略
3. 编写关键事故类型 Runbook
4. 配置状态页和用户通知
5. 建立无责备复盘文化
6. 跟踪改进措施落地
7. 定期进行事故演练
8. 建立事故知识库

## 总结

Incident Response 是系统发生故障时按预定流程进行检测、响应、止血、定位、修复和复盘的全过程。目标是最大化 MTTR，最小化用户影响。

> 💡 事故响应的终极目标不是“救火”，而是“防火”——通过复盘和混沌工程，让事故不再发生。

## 常用命令

| 命令 | 说明 |
|------|------|
| `kubectl rollout undo deployment/<name>` | 回滚部署 |
| `kubectl scale deployment/<name> --replicas=0` | 停止服务 |
| `kubectl logs <pod> --previous` | 查看崩溃前日志 |
| `kubectl get events --sort-by=.metadata.creationTimestamp` | 查看事件 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| Google SRE 书籍 | 书籍 | 事故响应最佳实践 |
| PagerDuty 文档 | 文档 | On-Call 指南 |
| Blameless 博客 | 博客 | 无责备复盘 |
| Chaos Mesh | 工具 | 混沌工程演练 |

## 事故响应成熟度

| 级别 | 说明 | 特征 |
|------|------|------|
| L1 被动 | 用户报告才知道 | 无监控、无流程 |
| L2 主动 | 告警自动触发 | 有监控、有 On-Call |
| L3 标准化 | 标准化 Runbook | 有流程、有复盘 |
| L4 自动化 | 自动止血和修复 | 自动回滚、自动扩容 |
| L5 预防 | 混沌工程主动验证 | 事故不再发生 |

## 总结

Incident Response 是系统发生故障时按预定流程进行检测、响应、止血、定位、修复和复盘的全过程。目标是最大化 MTTR，最小化用户影响。无责备复盘和混沌工程是持续改进的关键。

> 💡 事故响应的核心是“先止血再修”——不要试图在火场里找原因，先灭火再说。

## 总结

Incident Response 是 SRE 实践的核心环节。通过标准化流程、无责备复盘和混沌工程，将“被动救火”转变为“主动预防”，持续提升系统可靠性。

> 💡 事故响应的终极目标不是“救火”，而是“防火”——通过复盘和混沌工程，让事故不再发生。

## 相关概念

- [[概念/sre|SRE]] — 站点可靠性工程
- [[概念/slo|SLO]] — 服务等级目标
- [[概念/chaos-engineering|Chaos Engineering]] — 混沌工程
- [[概念/resilience|Resilience]] — 系统韧性
