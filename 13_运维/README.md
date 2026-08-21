---
title: 运维与可观测性 (AI Ops)
category: 13-ai-ops
tags: ["ai-ops", "observability", "monitoring", "incident-response", "sre"]
summary: "> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、告警、事故响应、SRE、混沌工程等线上运营能力。"
created: 2026-05-31
updated: 2026-06-16
tier: core
sources: []

name_zh: "运维与可观测性"
---
# 运维与可观测性 (AI Ops)

> 中文简称：运维与可观测性

> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、告警、事故响应、SRE、混沌工程等线上运营能力。

---

## 📍 与 10_MLOps_Pipeline 的边界

> **本章专注「AI 系统运维」（Run-time），10 章 focus「ML 流水线建设」（Build-time，含工具实现）。**
> 2026-06-15 起，工具深度解析（DVC/Feast/MLflow/Kubeflow/LangSmith 等 16 篇）已迁入 [[11_模型运维/README]]。
> 完整边界声明见 [[11_模型运维/01_MLOps基础/01_Boundary_with_16]]。

| 想了解 | 去哪 |
|--------|------|
| 工具怎么用（DVC/Feast/MLflow/LangSmith…） | [[11_模型运维/README]] — 工具深度解析已迁入 |
| 概念与方法论（特征存储/实验追踪/评估…） | [[11_模型运维/README]] — 概念页 |
| 事故响应 / SRE / 混沌工程 | 本章（10 不涉及运维） |
| 线上监控 / 告警 / Runbook | 本章 |

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Ops_2026](./01_AIOps基础/01_AI运维2026.md) | AI 运维全栈指南：监控、日志、成本控制、灾难恢复 | 架构师、SRE |
| AI_Ops_for_dummy | AI 运维入门：基础概念与实践 | 初学者 |
| [AIOps-in-nutshell](./01_AIOps基础/02_AIOps简明指南.md) | AI 运维速查：核心概念快速掌握 | 快速入门 |

## 运维实践

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Incident_Response_Playbook](./02_SRE与可靠性/01_AI_故障应急_Playbook.md) | AI 事故响应手册：分级、流程、Runbook | SRE、DevOps |
| [Kubernetes_Troubleshooting_Playbook](./04_问题排查/07_Kubernetes_故障排查_Playbook.md) | K8s 系统排障：Pod、节点、网络、存储、调度、控制平面 | K8s 工程师、SRE |
| [GPU_OOM_Troubleshooting_Guide](./02_SRE与可靠性/11_GPU_OOM_故障排查_指南.md) | 区分四类 GPU OOM 并给出修复阶梯 | AI 训练/推理 SRE |
| [LLM_Inference_Slow_Unavailable_Runbook](./02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册.md) | LLM 推理延迟/不可用分层排障 | 推理 SRE |
| [LLM_Inference_SLO_Guide](./02_SRE与可靠性/18_LLM推理_SLO_指南.md) | LLM 推理 SLO、SLI、错误预算与发布门控 | SRE |
| [LLM_Inference_Observability_Stack](13_运维/06_可观测性/02_LLM推理_可观测性_Stack.md) | TTFT/TPOT/KV Cache 指标与 Prometheus/Grafana | 可观测性工程师 |

## 事故响应 (Incident Response)

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI 事故响应框架](./03_故障应急/01_AI_故障应急_框架.md) | 事件分级、响应流程、沟通机制、复盘模板 | SRE、DevOps |
| [On-Call Runbook 模板](./03_故障应急/04_On_Call_操作手册_模板.md) | 值班交接、告警总线、升级路径、常见场景速查 | 值班工程师 |
| [AI_Incident_Response_Playbook](./02_SRE与可靠性/01_AI_故障应急_Playbook.md) | AI 事故响应手册：分级、流程、Runbook | SRE、DevOps |
| [Incident_Response_for_AI_Systems](./02_SRE与可靠性/15_故障应急_for_AI_系统.md) | AI 系统事件响应实践 | SRE |

## SRE 与可靠性

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [SRE_for_AI_Systems](./02_SRE与可靠性/22_SRE_for_AI_系统.md) | AI 系统 SRE 实践：SLI/SLO、错误预算 | SRE |
| [SLO 与错误预算](./02_SRE与可靠性/21_SLO_Error_预算_AI_深入分析.md) | 多维度 SLO（可用性+质量+成本）、发版门控 | SRE、架构师 |
| [GPU_OOM_Troubleshooting_Guide](./02_SRE与可靠性/11_GPU_OOM_故障排查_指南.md) | 区分四类 GPU OOM 并给出修复阶梯 | AI 训练/推理 SRE |
| [LLM_Inference_Slow_Unavailable_Runbook](./02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册.md) | LLM 推理延迟/不可用分层排障 | 推理 SRE |
| [LLM_Inference_SLO_Guide](./02_SRE与可靠性/18_LLM推理_SLO_指南.md) | LLM 推理 SLO、SLI、错误预算与发布门控 | SRE |

## 运维速查表

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [GPU 故障排查速查表](./02_SRE与可靠性/12_GPU_故障排查_Cheat_Sheet.md) | nvidia-smi、CUDA、驱动、显存、温度、NCCL 常用命令 | SRE、平台工程师 |
| [K8s for AI 排查速查表](./02_SRE与可靠性/17_K8s_AI_故障排查_Cheat_Sheet.md) | Pod/Job/节点/调度/网络/存储问题常用命令 | K8s 工程师、SRE |

## 混沌工程

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI 系统混沌工程](13_运维/02_SRE与可靠性/07_AI混沌工程_系统.md) | AI 平台故障注入实验设计与工具 | 可靠性工程师 |
| [Chaos_Engineering_AI](./02_SRE与可靠性/06_Chaos_工程_AI.md) | AI 系统混沌工程：故障注入、韧性测试 | 可靠性工程师 |

## 成本治理

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI 场景 FinOps](./05_成本管理/02_FinOps_for_AI.md) | 成本分摊、利用率监控、预算与告警 | FinOps、平台工程师 |
| GPU 成本优化 | 利用率提升、调度优化、弹性伸缩、模型压缩 | 平台/SRE |
| 成本优化 | 推理降本六板斧（批处理/量化/缓存/路由/投机/KV）、FinOps | FinOps、平台工程师 |

## 保留在本章的工具页

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Prometheus + Grafana Deep Dive](../11_模型运维/08_可观测性/15_Prometheus_Grafana_深入分析.md) | AI 系统监控与可视化基座：GPU/推理/训练指标 | SRE、平台工程师 |
| [Guardrails Deep Dive](./02_SRE与可靠性/13_Guardrails_深入分析.md) | LLM 输入/输出安全护栏 | 安全工程师 |
| [PromptLayer Deep Dive](11_模型运维/08_可观测性/16_PromptLayer_深入分析.md) | Prompt 版本管理与追踪 | Prompt 工程师 |

> 其余工具深度解析（DVC/LakeFS/Feast/MLflow/ClearML/Kubeflow/Prefect/LangSmith/Helicone/Phoenix/Braintrust + 3 篇 Observability + CI_CD_Pipeline + LLM_Production_Pipeline）已迁入 [[11_模型运维/README]]。

## AI Stack 运维工具

> 如果你正在使用阿里云 AI Stack 一体机，以下页面提供容器运行时、GPU 监控、K8s 编排与专属运维工具的生产级指南：

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI Stack 生产工具链总览](12_架构基建/03_AI技术栈/09_AI技术栈_生产_工具链.md) | AI Stack 工具全景与生命周期 | 所有 AI Stack 用户 |
| [AI Stack 容器与运行时](12_架构基建/03_AI技术栈/01_AI技术栈_容器_Runtime_指南.md) | nerdctl / crictl / ctr / docker / podman | SRE、平台工程师 |
| [AI Stack GPU 监控](12_架构基建/03_AI技术栈/04_AI技术栈_GPU_监控_指南.md) | nvidia-smi / ppu-smi / rocm-smi / pmon | 运维、SRE |
| [AI Stack K8s 编排](12_架构基建/03_AI技术栈/06_AI技术栈_K8s_Operations_指南.md) | kubectl / helm 排障与包管理 | K8s 工程师 |
| [AI Stack 专属工具](12_架构基建/README.md) | stackops / aioController | AI Stack 运维 |

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

- [MLOps](../11_模型运维/) — ML 流水线建设（概念 + 工具实现，工具深度解析已迁入此章）
- [部署推理](../10_部署推理/) — 推理引擎 (vLLM, SGLang)
- [12_架构基建/11_AI网关](../12_架构基建/11_AI网关/) — AI 网关与路由
- [AI测试](../09_测试/) — AI 测试框架

> 边界声明详见 [[11_模型运维/01_MLOps基础/01_Boundary_with_16]]。

---

*Last updated: 2026-06-15*

## Related

- [[11_模型运维/01_MLOps基础/01_Boundary_with_16]] — 10 与 16 边界声明 📐
- [[13_运维/01_AIOps基础/AI_Ops_2026]] — AI Ops 2026: 智能运维体系与实践
- [[13_运维/02_SRE与可靠性/01_AI_故障应急_Playbook]] — AI 系统事故响应手册
- [[13_运维/02_SRE与可靠性/15_故障应急_for_AI_系统]] — AI 系统事件响应
- [[13_运维/02_SRE与可靠性/22_SRE_for_AI_系统]] — AI 系统的 SRE 实践指南
- [[13_运维/02_SRE与可靠性/06_Chaos_工程_AI]] — AI 系统混沌工程实践
- [[13_运维/02_SRE与可靠性/13_Guardrails_深入分析]] — Guardrails AI: LLM 安全护栏
- [[11_模型运维/08_可观测性/16_PromptLayer_深入分析]] — PromptLayer: 提示词管理与追踪
- [[13_运维/01_AIOps基础/AIOps-in-nutshell]] — AI Ops 速成指南
- [[13_运维/README.md]] — AI Ops 入门指南
- [[13_运维/README]] — 16 AI Ops — 小白版 📡
- [[12_架构基建/AI_Stack_Production_Toolchain]] — AI Stack 生产工具链总览
- [[12_架构基建/AI_Stack_Container_Runtime_Guide]] — AI Stack 容器与运行时指南
- [[12_架构基建/03_AI技术栈/04_AI技术栈_GPU_监控_指南]] — AI Stack GPU 监控指南
- [[12_架构基建/03_AI技术栈/06_AI技术栈_K8s_Operations_指南]] — AI Stack K8s 编排指南
- [[12_架构基建/03_AI技术栈/03_AI技术栈_Exclusive_工具_指南]] — AI Stack 专属运维工具指南

- [[13_运维/02_SRE与可靠性/06_Chaos_工程_AI|AI 系统混沌工程]]
- [[13_运维/03_故障应急/04_On_Call_操作手册_模板|On-Call Runbook 模板]]
- [[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南|LLM 推理 SLO 实践指南]]

## 工单诊断入口

- [[13_运维/04_问题排查/05_diagnosis_work_order_hub]] — 工单智能体远程诊断知识枢纽（Pod/网络/存储/GPU 四大决策树）
