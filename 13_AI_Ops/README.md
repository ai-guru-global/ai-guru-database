---
title: AI 运维与可观测性 (AI Ops)
category: 13-ai-ops
tags: ["ai-ops", "observability", "monitoring", "incident-response", "sre"]
summary: "> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、告警、事故响应、SRE、混沌工程等线上运营能力。"
created: 2026-05-31
updated: 2026-06-16
---

# AI 运维与可观测性 (AI Ops)

> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、告警、事故响应、SRE、混沌工程等线上运营能力。

---

## 📍 与 10_MLOps_Pipeline 的边界

> **本章专注「AI 系统运维」（Run-time），10 章 focus「ML 流水线建设」（Build-time，含工具实现）。**
> 2026-06-15 起，工具深度解析（DVC/Feast/MLflow/Kubeflow/LangSmith 等 16 篇）已迁入 [[11_MLOps_Pipeline/README]]。
> 完整边界声明见 [[11_MLOps_Pipeline/Boundary_with_16]]。

| 想了解 | 去哪 |
|--------|------|
| 工具怎么用（DVC/Feast/MLflow/LangSmith…） | [[11_MLOps_Pipeline/README]] — 工具深度解析已迁入 |
| 概念与方法论（特征存储/实验追踪/评估…） | [[11_MLOps_Pipeline/README]] — 概念页 |
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
| [SLO 与错误预算](./SLO_Error_Budget_AI_Deep_Dive.md) | 多维度 SLO（可用性+质量+成本）、发版门控 | SRE、架构师 |
| [成本优化](./Cost_Optimization_AI_Deep_Dive.md) | 推理降本六板斧（批处理/量化/缓存/路由/投机/KV）、FinOps | FinOps、平台工程师 |
| [Chaos_Engineering_AI](./Chaos_Engineering_AI.md) | AI 系统混沌工程：故障注入、韧性测试 | 可靠性工程师 |

## 保留在本章的工具页

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Prometheus + Grafana Deep Dive](./Prometheus_Grafana_Deep_Dive.md) | AI 系统监控与可视化基座：GPU/推理/训练指标 | SRE、平台工程师 |
| [Guardrails Deep Dive](./Guardrails_Deep_Dive.md) | LLM 输入/输出安全护栏 | 安全工程师 |
| [PromptLayer Deep Dive](./PromptLayer_Deep_Dive.md) | Prompt 版本管理与追踪 | Prompt 工程师 |

> 其余工具深度解析（DVC/LakeFS/Feast/MLflow/ClearML/Kubeflow/Prefect/LangSmith/Helicone/Phoenix/Braintrust + 3 篇 Observability + CI_CD_Pipeline + LLM_Production_Pipeline）已迁入 [[11_MLOps_Pipeline/README]]。

## AI Stack 运维工具

> 如果你正在使用阿里云 AI Stack 一体机，以下页面提供容器运行时、GPU 监控、K8s 编排与专属运维工具的生产级指南：

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI Stack 生产工具链总览](../12_Architecture_Infrastructure/AI_Stack_Production_Toolchain.md) | AI Stack 工具全景与生命周期 | 所有 AI Stack 用户 |
| [AI Stack 容器与运行时](../12_Architecture_Infrastructure/AI_Stack_Container_Runtime_Guide.md) | nerdctl / crictl / ctr / docker / podman | SRE、平台工程师 |
| [AI Stack GPU 监控](../12_Architecture_Infrastructure/AI_Stack_GPU_Monitoring_Guide.md) | nvidia-smi / ppu-smi / rocm-smi / pmon | 运维、SRE |
| [AI Stack K8s 编排](../12_Architecture_Infrastructure/AI_Stack_K8s_Operations_Guide.md) | kubectl / helm 排障与包管理 | K8s 工程师 |
| [AI Stack 专属工具](../12_Architecture_Infrastructure/AI_Stack_Exclusive_Tools_Guide.md) | stackops / aioController | AI Stack 运维 |

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

- [11_MLOps_Pipeline](../11_MLOps_Pipeline/) — ML 流水线建设（概念 + 工具实现，工具深度解析已迁入此章）
- [10_Deployment_Inference](../10_Deployment_Inference/) — 推理引擎 (vLLM, SGLang)
- [14_AI_Gateway](../14_AI_Gateway/) — AI 网关与路由
- [09_Testing](../09_Testing/) — AI 测试框架

> 边界声明详见 [[11_MLOps_Pipeline/Boundary_with_16]]。

---

*Last updated: 2026-06-15*

## Related

- [[11_MLOps_Pipeline/Boundary_with_16]] — 10 与 16 边界声明 📐
- [[13_AI_Ops/AI_Ops_2026]] — AI Ops 2026: 智能运维体系与实践
- [[13_AI_Ops/AI_Incident_Response_Playbook]] — AI 系统事故响应手册
- [[13_AI_Ops/Incident_Response_for_AI_Systems]] — AI 系统事件响应
- [[13_AI_Ops/SRE_for_AI_Systems]] — AI 系统的 SRE 实践指南
- [[13_AI_Ops/Chaos_Engineering_AI]] — AI 系统混沌工程实践
- [[13_AI_Ops/Guardrails_Deep_Dive]] — Guardrails AI: LLM 安全护栏
- [[13_AI_Ops/PromptLayer_Deep_Dive]] — PromptLayer: 提示词管理与追踪
- [[13_AI_Ops/AIOps-in-nutshell]] — AI Ops 速成指南
- [[13_AI_Ops/AI_Ops_for_dummy]] — AI Ops 入门指南
- [[13_AI_Ops/README_for_dummy]] — 16 AI Ops — 小白版 📡
- [[12_Architecture_Infrastructure/AI_Stack_Production_Toolchain]] — AI Stack 生产工具链总览
- [[12_Architecture_Infrastructure/AI_Stack_Container_Runtime_Guide]] — AI Stack 容器与运行时指南
- [[12_Architecture_Infrastructure/AI_Stack_GPU_Monitoring_Guide]] — AI Stack GPU 监控指南
- [[12_Architecture_Infrastructure/AI_Stack_K8s_Operations_Guide]] — AI Stack K8s 编排指南
- [[12_Architecture_Infrastructure/AI_Stack_Exclusive_Tools_Guide]] — AI Stack 专属运维工具指南
