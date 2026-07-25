---
title: 运维与可观测性 (AI Ops)
category: 13-ai-ops
tags: ["ai-ops", "observability", "monitoring", "incident-response", "sre"]
summary: "> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、告警、事故响应、SRE、混沌工程等线上运营能力。"
created: 2026-05-31
updated: 2026-06-16
tier: core
sources: []

---
# 运维与可观测性 (AI Ops)

> AI 运维是保障 LLM 应用稳定、高效、安全运行的关键，涵盖监控、告警、事故响应、SRE、混沌工程等线上运营能力。

---

## 📍 与 10_MLOps_Pipeline 的边界

> **本章专注「AI 系统运维」（Run-time），10 章 focus「ML 流水线建设」（Build-time，含工具实现）。**
> 2026-06-15 起，工具深度解析（DVC/Feast/MLflow/Kubeflow/LangSmith 等 16 篇）已迁入 [[11_模型运维/README]]。
> 完整边界声明见 [[11_模型运维/01_MLOps_Fundamentals/Boundary_with_16]]。

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
| [AI_Ops_2026](./01_AIOps_Fundamentals/AI_Ops_2026.md) | AI 运维全栈指南：监控、日志、成本控制、灾难恢复 | 架构师、SRE |
| [AI_Ops_for_dummy](./01_AIOps_Fundamentals/AI_Ops_for_dummy.md) | AI 运维入门：基础概念与实践 | 初学者 |
| [AIOps-in-nutshell](./01_AIOps_Fundamentals/AIOps-in-nutshell.md) | AI 运维速查：核心概念快速掌握 | 快速入门 |

## 运维实践

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Incident_Response_Playbook](./02_SRE_Reliability/AI_Incident_Response_Playbook.md) | AI 事故响应手册：分级、流程、Runbook | SRE、DevOps |
| [Kubernetes_Troubleshooting_Playbook](./04_Troubleshooting/Kubernetes_Troubleshooting_Playbook.md) | K8s 系统排障：Pod、节点、网络、存储、调度、控制平面 | K8s 工程师、SRE |
| [GPU_OOM_Troubleshooting_Guide](./02_SRE_Reliability/GPU_OOM_Troubleshooting_Guide.md) | 区分四类 GPU OOM 并给出修复阶梯 | AI 训练/推理 SRE |
| [LLM_Inference_Slow_Unavailable_Runbook](./02_SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook.md) | LLM 推理延迟/不可用分层排障 | 推理 SRE |
| [LLM_Inference_SLO_Guide](./02_SRE_Reliability/LLM_Inference_SLO_Guide.md) | LLM 推理 SLO、SLI、错误预算与发布门控 | SRE |
| [LLM_Inference_Observability_Stack](13_运维/06_Observability/LLM_Inference_Observability_Stack.md) | TTFT/TPOT/KV Cache 指标与 Prometheus/Grafana | 可观测性工程师 |

## 事故响应 (Incident Response)

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI 事故响应框架](./03_Incident_Response/AI_Incident_Response_Framework.md) | 事件分级、响应流程、沟通机制、复盘模板 | SRE、DevOps |
| [On-Call Runbook 模板](./03_Incident_Response/On_Call_Runbook_Template.md) | 值班交接、告警总线、升级路径、常见场景速查 | 值班工程师 |
| [AI_Incident_Response_Playbook](./02_SRE_Reliability/AI_Incident_Response_Playbook.md) | AI 事故响应手册：分级、流程、Runbook | SRE、DevOps |
| [Incident_Response_for_AI_Systems](./02_SRE_Reliability/Incident_Response_for_AI_Systems.md) | AI 系统事件响应实践 | SRE |

## SRE 与可靠性

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [SRE_for_AI_Systems](./02_SRE_Reliability/SRE_for_AI_Systems.md) | AI 系统 SRE 实践：SLI/SLO、错误预算 | SRE |
| [SLO 与错误预算](./02_SRE_Reliability/SLO_Error_Budget_AI_Deep_Dive.md) | 多维度 SLO（可用性+质量+成本）、发版门控 | SRE、架构师 |
| [GPU_OOM_Troubleshooting_Guide](./02_SRE_Reliability/GPU_OOM_Troubleshooting_Guide.md) | 区分四类 GPU OOM 并给出修复阶梯 | AI 训练/推理 SRE |
| [LLM_Inference_Slow_Unavailable_Runbook](./02_SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook.md) | LLM 推理延迟/不可用分层排障 | 推理 SRE |
| [LLM_Inference_SLO_Guide](./02_SRE_Reliability/LLM_Inference_SLO_Guide.md) | LLM 推理 SLO、SLI、错误预算与发布门控 | SRE |

## 运维速查表

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [GPU 故障排查速查表](./02_SRE_Reliability/GPU_Troubleshooting_Cheat_Sheet.md) | nvidia-smi、CUDA、驱动、显存、温度、NCCL 常用命令 | SRE、平台工程师 |
| [K8s for AI 排查速查表](./02_SRE_Reliability/K8s_AI_Troubleshooting_Cheat_Sheet.md) | Pod/Job/节点/调度/网络/存储问题常用命令 | K8s 工程师、SRE |

## 混沌工程

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI 系统混沌工程](13_运维/02_SRE_Reliability/Chaos_Engineering_for_AI_Systems.md) | AI 平台故障注入实验设计与工具 | 可靠性工程师 |
| [Chaos_Engineering_AI](./02_SRE_Reliability/Chaos_Engineering_AI.md) | AI 系统混沌工程：故障注入、韧性测试 | 可靠性工程师 |

## 成本治理

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI 场景 FinOps](./05_Cost_Management/FinOps_for_AI.md) | 成本分摊、利用率监控、预算与告警 | FinOps、平台工程师 |
| [GPU 成本优化](./05_Cost_Management/GPU_Cost_Optimization.md) | 利用率提升、调度优化、弹性伸缩、模型压缩 | 平台/SRE |
| [成本优化](./02_SRE_Reliability/Cost_Optimization_AI_Deep_Dive.md) | 推理降本六板斧（批处理/量化/缓存/路由/投机/KV）、FinOps | FinOps、平台工程师 |

## 保留在本章的工具页

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Prometheus + Grafana Deep Dive](../11_模型运维/08_Observability/Prometheus_Grafana_Deep_Dive.md) | AI 系统监控与可视化基座：GPU/推理/训练指标 | SRE、平台工程师 |
| [Guardrails Deep Dive](./02_SRE_Reliability/Guardrails_Deep_Dive.md) | LLM 输入/输出安全护栏 | 安全工程师 |
| [PromptLayer Deep Dive](11_模型运维/08_Observability/PromptLayer_Deep_Dive.md) | Prompt 版本管理与追踪 | Prompt 工程师 |

> 其余工具深度解析（DVC/LakeFS/Feast/MLflow/ClearML/Kubeflow/Prefect/LangSmith/Helicone/Phoenix/Braintrust + 3 篇 Observability + CI_CD_Pipeline + LLM_Production_Pipeline）已迁入 [[11_模型运维/README]]。

## AI Stack 运维工具

> 如果你正在使用阿里云 AI Stack 一体机，以下页面提供容器运行时、GPU 监控、K8s 编排与专属运维工具的生产级指南：

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI Stack 生产工具链总览](12_架构基建/03_AI_Stack/AI_Stack_Production_Toolchain.md) | AI Stack 工具全景与生命周期 | 所有 AI Stack 用户 |
| [AI Stack 容器与运行时](12_架构基建/03_AI_Stack/AI_Stack_Container_Runtime_Guide.md) | nerdctl / crictl / ctr / docker / podman | SRE、平台工程师 |
| [AI Stack GPU 监控](12_架构基建/03_AI_Stack/AI_Stack_GPU_Monitoring_Guide.md) | nvidia-smi / ppu-smi / rocm-smi / pmon | 运维、SRE |
| [AI Stack K8s 编排](12_架构基建/03_AI_Stack/AI_Stack_K8s_Operations_Guide.md) | kubectl / helm 排障与包管理 | K8s 工程师 |
| [AI Stack 专属工具](12_架构基建/03_AI_Stack/AI_Stack_Exclusive_Tools_Guide.md) | stackops / aioController | AI Stack 运维 |

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
- [12_架构基建/11_AI_Gateway](../12_架构基建/11_AI_Gateway/) — AI 网关与路由
- [AI测试](../09_测试/) — AI 测试框架

> 边界声明详见 [[11_模型运维/01_MLOps_Fundamentals/Boundary_with_16]]。

---

*Last updated: 2026-06-15*

## Related

- [[11_模型运维/01_MLOps_Fundamentals/Boundary_with_16]] — 10 与 16 边界声明 📐
- [[13_运维/01_AIOps_Fundamentals/AI_Ops_2026]] — AI Ops 2026: 智能运维体系与实践
- [[13_运维/02_SRE_Reliability/AI_Incident_Response_Playbook]] — AI 系统事故响应手册
- [[13_运维/02_SRE_Reliability/Incident_Response_for_AI_Systems]] — AI 系统事件响应
- [[13_运维/02_SRE_Reliability/SRE_for_AI_Systems]] — AI 系统的 SRE 实践指南
- [[13_运维/02_SRE_Reliability/Chaos_Engineering_AI]] — AI 系统混沌工程实践
- [[13_运维/02_SRE_Reliability/Guardrails_Deep_Dive]] — Guardrails AI: LLM 安全护栏
- [[11_模型运维/08_Observability/PromptLayer_Deep_Dive]] — PromptLayer: 提示词管理与追踪
- [[13_运维/01_AIOps_Fundamentals/AIOps-in-nutshell]] — AI Ops 速成指南
- [[13_运维/01_AIOps_Fundamentals/AI_Ops_for_dummy]] — AI Ops 入门指南
- [[13_运维/README_for_dummy]] — 16 AI Ops — 小白版 📡
- [[12_架构基建/AI_Stack_Production_Toolchain]] — AI Stack 生产工具链总览
- [[12_架构基建/AI_Stack_Container_Runtime_Guide]] — AI Stack 容器与运行时指南
- [[12_架构基建/AI_Stack_GPU_Monitoring_Guide]] — AI Stack GPU 监控指南
- [[12_架构基建/AI_Stack_K8s_Operations_Guide]] — AI Stack K8s 编排指南
- [[12_架构基建/AI_Stack_Exclusive_Tools_Guide]] — AI Stack 专属运维工具指南

- [[13_运维/02_SRE_Reliability/Chaos_Engineering_for_AI_Systems|AI 系统混沌工程]]
- [[13_运维/03_Incident_Response/On_Call_Runbook_Template|On-Call Runbook 模板]]
- [[13_运维/02_SRE_Reliability/LLM_Inference_SLO_Guide|LLM 推理 SLO 实践指南]]

## 工单诊断入口

- [[13_运维/04_Troubleshooting/diagnosis-work-order-hub]] — 工单智能体远程诊断知识枢纽（Pod/网络/存储/GPU 四大决策树）

## 进阶知识拓展

| 主题 | 深度内容 | 应用场景 | 参考资源 |
|------|----------|----------|----------|
| 核心原理 | 底层机制和数学推导 | 深度理解+优化 | 经典教材+论文 |
| 工程实践 | 生产级实现细节 | 项目落地 | 开源项目+案例 |
| 性能优化 | 瓶颈分析+调优策略 | 提升效率 | 性能分析工具 |
| 安全合规 | 安全威胁+防护措施 | 风险管控 | 安全框架+标准 |
| 前沿研究 | 最新进展+未来方向 | 技术预判 | 顶会论文+博客 |

## 实践指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |

## 知识图谱关联

| 关联主题 | 关系类型 | 参考路径 |
|----------|----------|----------|
| 基础理论 | 前置依赖 | 相关基础目录 |
| 工具实践 | 实现支撑 | 工具/编程相关 |
| 应用场景 | 价值体现 | 18_行业应用/ |
| 前沿研究 | 发展方向 | 20_论文精读/ |
| 工程方法 | 质量保障 | 09_测试/13_运维/ |

## 版本更新记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-01 | 初始创建 |
| v1.1 | 2025-06 | 内容补充 |
| v2.0 | 2026-01 | 全面扩写 |
| v2.1 | 2026-07 | 质量强化+结构化增强 |

## 快速自检

- [ ] 核心概念能向他人清晰解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案优劣势和适用场景
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态
- [ ] 知识已文档化沉淀
