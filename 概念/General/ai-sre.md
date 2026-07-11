---
title: "AI SRE"
category: -concepts
tags: ["ai-sre", "sre", "reliability", "mlops", "llmops", "observability", "incident-response", "finops", "gpu"]
summary: "AI SRE 是将站点可靠性工程方法延伸至 AI 生产系统的实践，通过 SLO/SLI、容量规划、可观测性、事故响应和成本治理，保障大模型、Agent、RAG 等服务在高成本、高不确定性的环境下稳定运行。"
created: 2026-07-02
updated: 2026-07-02
tier: concept
aliases:
  - "AI 站点可靠性工程"
  - "AI Site Reliability Engineering"
  - "AI SRE"
relationships:
  - target: "概念/sre"
    type: extends
  - target: "概念/mlops"
    type: related_to
  - target: "概念/observability"
    type: uses
  - target: "概念/finops"
    type: collaborates_with
  - target: "概念/incident-response"
    type: uses
sources:
  - 架构基建/AI_SRE_Runbook.md
  - 行业应用/AI_Production_Architecture_2026.md
---

# AI SRE

## 一句话定义

> **AI SRE 是把传统 SRE 的工程化运维方法适配到 AI 生产系统，让模型、Agent、RAG  pipeline 在 GPU 故障、输入漂移、成本波动和幻觉风险下仍能满足 latency、可用性、质量与成本的联合 SLO。**

## 核心要点

- **四维可靠性空间**：AI 服务不再只是 "请求-响应"，而是 **模型 × 加速器 × 长上下文 × 成本** 的组合，单一维度优化会挤压其他维度。
- **AI 专属 SLI**：除传统 RED 指标外，必须追踪 **TTFT / TPOT / Tokens/s、$/1K Tokens、GPU 显存利用率、模型加载成功率、幻觉率 / 有害输出率**。
- **版本矩阵复杂**：同时管理代码、配置、模型权重、Prompt、LoRA、推理引擎、运行时，回滚策略必须支持**模型热切换**与**金丝雀发布**。
- **故障模式异化**：GPU ECC 错误、CUDA OOM、NCCL 超时、KV Cache 爆显存、模型幻觉导致业务异常，需要专门的 runbook 与自动止损。
- **成本即可靠性**：Token 级计费和 GPU 按秒计费让成本波动成为稳定性风险，SRE 必须与 FinOps 共建成本预算与容量规划。

## 生产环境意义

对 AI 产品而言，"模型效果好看" 与 "线上跑得稳" 是两件完全不同的事。AI SRE 解决的是后者：

1. **发布可控**：通过 SLO、错误预算和金丝雀，让新模型上线从"开盲盒"变成可量化风险的交易。
2. **故障可定位**：在日志、指标、追踪之外增加 Token trace、GPU 健康度、模型质量评分，缩短 MTTR。
3. **成本可预测**：把 Token 消耗、GPU 利用率、Spot 实例波动纳入容量模型，避免月初流量暴涨导致预算击穿。
4. **质量可兜底**：与安全护栏、LLM-as-Judge、人工反馈闭环配合，把幻觉、越权、有害输出等"软故障"纳入事故响应。

没有 AI SRE 的团队，往往在 POC 阶段惊艳，在生产阶段被长尾问题拖垮。

## 相关技术/框架

| 层级 | 关键技术/工具 | 作用 |
|------|--------------|------|
| **可观测性** | Prometheus + Grafana、OpenTelemetry、DCGM、vLLM/SGLang metrics | 采集 RED、Token、GPU 三维指标 |
| **容量规划** | Kubernetes + Karpenter / Cluster Autoscaler、Slurm、PAI-EAS | 弹性伸缩与队列管理 |
| **推理服务** | vLLM、TGI、SGLang、TensorRT-LLM、KServe | 高吞吐、低延迟模型服务 |
| **网关与路由** | LLM Gateway、BentoML、Ray Serve | 模型路由、限流、降级、A/B |
| **护栏与安全** | Guardrails、NeMo Guardrails、LLM Guard、Lakera | 输入/输出安全检查 |
| **FinOps** | Kubecost、OpenCost、云平台成本标签 | 成本分摊与预算告警 |
| **事故响应** | PagerDuty、Opsgenie、Slack Runbook、混沌工程 | On-call 与演练 |

## 典型误区

- **误区 1：把 AI SRE 当传统 SRE 用**。只看进程是否存活、QPS 是否掉，忽略 TTFT、模型质量和 Token 成本。
- **误区 2：以 GPU 利用率为唯一优化目标**。高利用率往往伴随排队恶化，真正重要的是**单位成本下的有效 Token 吞吐**。
- **误区 3：模型上线即结束**。缺少上线后的漂移监控、护栏拦截率监控和用户反馈闭环，模型会悄悄退化。
- **误区 4：安全护栏只归安全团队**。护栏误杀/漏杀直接影响可用性，SRE 需要参与 SLA 定义与演练。
- **误区 5：忽略长上下文和批大小的方差**。同一个模型在 1K 与 128K 上下文下的资源消耗可能相差十倍以上，容量模型不能按平均输入估算。

## 推荐阅读

### 核心 Runbook 与架构
- [[架构基建/AI_SRE_Runbook|AI 系统 SRE Runbook]] — SLO/SLI、GPU 容量规划、事故响应、模型回滚、灾备与可观测性完整手册
- [[行业应用/AI_Production_Architecture_2026|AI 生产架构 2026]] — 企业级 AI 生产部署的整体架构视角
- [[行业应用/AI_Platform_Selection_2026|AI 平台选型 2026]] — 自建与云服务平台的选型参考

### 各子系统生产部署
- [[大模型/LLM_Production_Deployment_Runbook|LLM 生产部署 Runbook]] — 大模型上线、推理优化与运维
- [[智能体/Agent_Production_Deployment_Runbook|Agent 生产部署 Runbook]] — Agent 系统的发布、监控与回滚
- [[RAG系统/RAG_Production_Architecture_Deep_Dive|RAG 生产架构深度解析]] — RAG pipeline 的可靠性设计
- [[计算机视觉/CV_Deployment_and_Inference_2026|CV 部署与推理 2026]] — 视觉模型生产化要点

### 安全、护栏与成本
- [[模型运维/LLM_Guardrails_and_Safety_Ops_2026|LLM 护栏与安全运维 2026]] — 输入输出安全与护栏运营
- [[编程/AI_Code_Security_Audit_Runbook|AI 代码安全审计 Runbook]] — AI 应用代码层安全审计
- [[模型训练/Training_Cost_Optimization_and_FinOps_2026|训练成本优化与 FinOps 2026]] — 成本治理与 FinOps 实践

### 网关、评估与前沿技术
- [[架构基建/AI_Gateway/LLM_Gateway_Deep_Dive|LLM Gateway 深度解析]] — 统一入口、路由、限流与可观测
- [[模型评估/RAG_Evaluation_Deep_Dive|RAG 评估深度解析]] — RAG 系统质量评估
- [[测试/Agent_Evaluation_Deep_Dive|Agent 评估深度解析]] — Agent 系统稳定性评估
- [[大模型/Test_Time_Compute_Scaling_2026|测试时计算缩放 2026]] — 推理阶段资源与质量权衡

### 相关概念
- [[概念/sre|SRE]] — 传统站点可靠性工程
- [[概念/mlops|MLOps 流水线]] — 模型交付与运维体系
- [[概念/observability|可观测性]] — 日志、指标、追踪三板斧
- [[概念/finops|FinOps]] — 云成本运营
- [[概念/incident-response|事故响应]] — 故障响应流程
