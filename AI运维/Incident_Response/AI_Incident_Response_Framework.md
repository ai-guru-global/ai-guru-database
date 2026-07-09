---
title: "AI 事故响应框架"
category: 13-ai-ops
subcategory: incident-response
tags: ["incident-response", "sre", "reliability", "ai", "runbook", "alibaba-cloud"]
summary: "面向 AI 系统的事故响应框架：事件分级、响应流程、沟通机制、复盘方法，以及训练/推理/MLOps 场景的特殊考量。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# AI 事故响应框架

> **一句话理解**: AI 系统出问题时，不能只靠人手动排查，要有分级、有流程、有 Runbook、有复盘，才能把损失降下来。

## 目录

- [1. 事件分级](#1-事件分级)
- [2. 响应流程](#2-响应流程)
- [3. AI 特殊考量](#3-ai-特殊考量)
- [4. 沟通机制](#4-沟通机制)
- [5. 复盘模板](#5-复盘模板)
- [Related](#related)

---

## 1. 事件分级

| 级别 | 定义 | 响应时间 | 示例 |
|------|------|---------|------|
| **P0** | 服务完全不可用 / 数据泄露 / 安全事件 | 5 分钟 | 所有推理服务 500、模型被篡改 |
| **P1** | 核心功能严重受损 | 15 分钟 | 训练集群全部 hang、GPU OOM 大面积 |
| **P2** | 部分功能受影响 | 1 小时 | 单个模型延迟升高、某个 DLC 任务失败 |
| **P3** | 轻微问题 / 潜在风险 | 1 天 | 监控告警阈值微调、文档错误 |

## 2. 响应流程

```text
检测 → 响应 → 止血 → 定位 → 修复 → 验证 → 复盘
```

| 阶段 | 关键动作 |
|------|---------|
| 检测 | 监控告警、用户反馈、巡检发现 |
| 响应 | 成立战时群、指定 incident commander |
| 止血 | 回滚、限流、切换、扩容 |
| 定位 | 日志、指标、链路、K8s 事件 |
| 修复 | 应用修复、验证恢复 |
| 复盘 | 时间线、根因、改进项 |

## 3. AI 特殊考量

- **模型输出不可控**: 需要输出护栏、人工审核
- **数据漂移**: 可能不是代码 bug，而是数据分布变化
- **训练任务长**: 失败代价高，需 checkpoint 恢复
- **资源争抢**: GPU/显存问题比 CPU 复杂
- **多租户**: 一个用户任务影响其他用户

## 4. 沟通机制

- **内部**: 钉钉/飞书战时群，定时同步进展
- **外部**: 客户通知、status page 更新
- **升级**: 明确升级路径和负责人

## 5. 复盘模板

```markdown
# Incident-YYYY-MM-DD-XXX

## 基本信息
- 级别：
- 持续时间：
- 影响范围：

## 时间线
- XX:XX 告警触发
- XX:XX 开始响应
- ...

## 根因
...

## 改进项
- [ ]
```

---

## Related

- [[_concepts/incident-response|Incident Response]]
- [[_concepts/slo|SLO]]
- [[_concepts/error-budget|Error Budget]]
- [[13_AI_Ops/SRE_Reliability/AI_Incident_Response_Playbook|AI 事故响应 Playbook]]
- [[13_AI_Ops/SRE_Reliability/SRE_for_AI_Systems|SRE for AI Systems]]
