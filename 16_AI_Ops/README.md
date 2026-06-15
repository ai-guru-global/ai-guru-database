---
title: AI 运维与可观测性 (AI Ops)
category: 16-ai-ops
tags: ["ai-ops", "observability", "monitoring", "incident-response", "sre"]
summary: "> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、告警、事故响应、SRE、混沌工程等线上运营能力。"
created: 2026-05-31
updated: 2026-06-15
---

# AI 运维与可观测性 (AI Ops)

> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、告警、事故响应、SRE、混沌工程等线上运营能力。

---

## 📍 与 10_MLOps_Pipeline 的边界

> **本章专注「AI 系统运维」（Run-time），10 章 focus「ML 流水线建设」（Build-time，含工具实现）。**
> 2026-06-15 起，工具深度解析（DVC/Feast/MLflow/Kubeflow/LangSmith 等 16 篇）已迁入 [[10_MLOps_Pipeline/README]]。
> 完整边界声明见 [[10_MLOps_Pipeline/Boundary_with_16]]。

| 想了解 | 去哪 |
|--------|------|
| 工具怎么用（DVC/Feast/MLflow/LangSmith…） | [[10_MLOps_Pipeline/README]] — 工具深度解析已迁入 |
| 概念与方法论（特征存储/实验追踪/评估…） | [[10_MLOps_Pipeline/README]] — 概念页 |
| 事故响应 / SRE / 混沌工程 | 本章（10 不涉及运维） |
| 线上监控 / 告警 / Runbook | 本章 |

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Ops_2026](./AI_Ops_2026.md) | AI 运维全栈指南：监控、日志、成本控制、灾难恢复 | 架构师、SRE |
| [AI_Ops_for_dummy](./AI_Ops_for_dummy.md) | AI 运维入门：基础概念与实践 | 初学者 |
| [AIOps-in-nutshell](./AIOps-in-nutshell.md) | AI 运维速查：核心概念快速掌握 | 快速入门 |

## 运维实践

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Incident_Response_Playbook](./AI_Incident_Response_Playbook.md) | AI 事故响应手册：分级、流程、Runbook | SRE、DevOps |
| [Incident_Response_for_AI_Systems](./Incident_Response_for_AI_Systems.md) | AI 系统事件响应实践 | SRE |
| [SRE_for_AI_Systems](./SRE_for_AI_Systems.md) | AI 系统 SRE 实践：SLI/SLO、错误预算 | SRE |
| [Chaos_Engineering_AI](./Chaos_Engineering_AI.md) | AI 系统混沌工程：故障注入、韧性测试 | 可靠性工程师 |

## 保留在本章的工具页

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Guardrails Deep Dive](./Guardrails_Deep_Dive.md) | LLM 输入/输出安全护栏 | 安全工程师 |
| [PromptLayer Deep Dive](./PromptLayer_Deep_Dive.md) | Prompt 版本管理与追踪 | Prompt 工程师 |

> 其余工具深度解析（DVC/LakeFS/Feast/MLflow/ClearML/Kubeflow/Prefect/LangSmith/Helicone/Phoenix/Braintrust + 3 篇 Observability + CI_CD_Pipeline + LLM_Production_Pipeline）已迁入 [[10_MLOps_Pipeline/README]]。

---

## 核心功能

| 功能 | 说明 |
|------|------|
| **事故响应** | 分级、流程、Runbook、复盘 |
| **SRE 实践** | SLI/SLO/SLA、错误预算、可用性 |
| **混沌工程** | 故障注入、韧性验证 |
| **安全护栏** | 输入验证、输出过滤、内容安全（Guardrails 工具） |

---

## 关联目录

- [10_MLOps_Pipeline](../10_MLOps_Pipeline/) — ML 流水线建设（概念 + 工具实现，工具深度解析已迁入此章）
- [09_Deployment_Inference](../09_Deployment_Inference/) — 推理引擎 (vLLM, SGLang)
- [14_AI_Gateway](../14_AI_Gateway/) — AI 网关与路由
- [15_Testing](../15_Testing/) — AI 测试框架

> 边界声明详见 [[10_MLOps_Pipeline/Boundary_with_16]]。

---

*Last updated: 2026-06-15*

## Related

- [[10_MLOps_Pipeline/Boundary_with_16]] — 10 与 16 边界声明 📐
- [[16_AI_Ops/AI_Ops_2026]] — AI Ops 2026: 智能运维体系与实践
- [[16_AI_Ops/AI_Incident_Response_Playbook]] — AI 系统事故响应手册
- [[16_AI_Ops/Incident_Response_for_AI_Systems]] — AI 系统事件响应
- [[16_AI_Ops/SRE_for_AI_Systems]] — AI 系统的 SRE 实践指南
- [[16_AI_Ops/Chaos_Engineering_AI]] — AI 系统混沌工程实践
- [[16_AI_Ops/Guardrails_Deep_Dive]] — Guardrails AI: LLM 安全护栏
- [[16_AI_Ops/PromptLayer_Deep_Dive]] — PromptLayer: 提示词管理与追踪
- [[16_AI_Ops/AIOps-in-nutshell]] — AI Ops 速成指南
- [[16_AI_Ops/AI_Ops_for_dummy]] — AI Ops 入门指南
- [[16_AI_Ops/README_for_dummy]] — 16 AI Ops — 小白版 📡
