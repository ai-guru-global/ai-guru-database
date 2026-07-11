---
title: "On-Call Runbook 模板"
category: 13-ai-ops
subcategory: incident-response
tags: ["on-call", "runbook", "sre", "incident-response", "ai", "alibaba-cloud"]
summary: "一份可直接复用的 AI 平台 On-Call Runbook 模板，覆盖值班交接、告警响应、升级路径和常见场景处置。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# On-Call Runbook 模板

> **一句话理解**: On-Call Runbook 是值班人员的「急救手册」——先看什么、先执行什么、什么时候升级，都写清楚。

## 目录

- [1. 值班交接](#1-值班交接)
- [2. 告警响应总线](#2-告警响应总线)
- [3. 升级路径](#3-升级路径)
- [4. 常见场景速查](#4-常见场景速查)
- [5. 联系人](#5-联系人)

---

## 1. 值班交接

```markdown
## 值班人
- 本周值班：
- 备用值班：

## 遗留事项
- [ ]

## 已知风险
- [ ]

## 变更窗口
- [ ]
```

## 2. 告警响应总线

```text
收到告警
  ├── 是否 P0/P1？
  │     ├── 是 → 立即响应，启动战时群
  │     └── 否 → 记录并 30 分钟内处理
  ├── 是否有已知 Runbook？
  │     ├── 是 → 按 Runbook 执行
  │     └── 否 → 临时排查 + 事后补 Runbook
  └── 是否需要升级？
        ├── 是 → 按升级路径联系负责人
        └── 否 → 闭环并记录
```

## 3. 升级路径

| 级别 | 通知人 | 升级条件 |
|------|--------|---------|
| P2 | 值班负责人 | 30 分钟未定位 |
| P1 | 团队 TL | 15 分钟未止血 |
| P0 | 部门负责人 | 5 分钟未响应 |

## 4. 常见场景速查

| 场景 | 入口 Runbook |
|------|-------------|
| LLM 推理延迟高 | [[运维/SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook|LLM 推理延迟/不可用 Runbook]] |
| GPU OOM | [[运维/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]] |
| 训练任务失败 | [[模型训练/Monitoring/LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s|LLM 微调任务 K8s 失败排障]] |
| 分布式训练 Hang | [[模型训练/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]] |
| MLflow 不可达 | [[模型运维/Troubleshooting/MLflow_Tracking_Server_Unreachable|MLflow Tracking Server 不可达]] |

## 5. 联系人

| 角色 | 联系方式 |
|------|---------|
| AI Platform TL | ... |
| SRE | ... |
| 网络 | ... |
| 存储 | ... |

---

*请根据组织实际情况填写联系人。*

## Related

- [[运维/README|AI 运维与可观测性 (AI Ops)]]
