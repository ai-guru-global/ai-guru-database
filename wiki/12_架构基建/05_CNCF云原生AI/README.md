---
title: "CNCF 云原生大模型 (LLM) 项目全景导览"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "cloud-native", "kubernetes", "llm", "genai", "inference", "ai-infrastructure"]
summary: "> **一句话理解**: 这是 CNCF 生态中与大模型 (LLM/GenAI) 相关的 20 个核心项目的系统性梳理——按「推理 / 调度 / 平台 / AIOps / 网关」五大层次组织，每个项目覆盖基础知识、使用、运维、配置，面向生产环境。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
sources: []

name_zh: "CNCF 云原生大模型 项目全景导览"
---
# CNCF 云原生大模型 (LLM) 项目全景导览

> 中文简称：CNCF 云原生大模型 项目全景导览

> **一句话理解**: 这是 CNCF 生态中与大模型 (LLM/GenAI) 相关的 20 个核心项目的系统性梳理——按「推理 / 调度 / 平台 / AIOps / 网关」五大层次组织，每个项目覆盖基础知识、使用、运维、配置，面向生产环境。

> 🔗 **数据来源**: 基于 CNCF Landscape 官方数据 (2026-06) 与各项目仓库最新 Release 提取。所有标注「CNCF 官方」的项目均属于 Graduated / Incubating / Sandbox 之一。

---

## 目录

1. [为什么需要云原生 LLM 栈](#1-为什么需要云原生-llm-栈)
2. [五层架构全景](#2-五层架构全景)
3. [项目清单总表](#3-项目清单总表)
4. [按层次详解](#4-按层次详解)
5. [生产环境选型决策树](#5-生产环境选型决策树)
6. [学习路径](#6-学习路径)
7. [与现有章节的关联](#7-与现有章节的关联)

---

## 1. 为什么需要云原生 LLM 栈

大模型落地生产环境，**单机推理脚本完全不够**。一个真实的大模型服务至少要解决下面这些问题，而这些问题 Kubernetes 已经为传统应用解决过一遍——把 LLM 工作负载搬上 K8s，复用云原生最佳实践，是最经济的路径：

```
LLM 生产化的 10 个痛点              ←→   云原生解法
═══════════════════════════════════════════════════════════════════
• GPU 资源稀缺、贵、要排队           ←→   调度器 (Volcano/KAI/Kueue)
• 模型权重几十~几百 GB，分发慢       ←→   P2P 分发 (Dragonfly)
• 推理要弹性扩缩容、闲时缩到 0        ←→   Serverless (Knative)
• 多模型/多版本共存                  ←→   推理 CRD (KServe/KAITO)
• GPU 显存碎片、要共享               ←→   设备分配 (DRA/CDI)
• 模型即代码、要版本化打包           ←→   制品标准 (KitOps ModelKit)
• 故障排查要懂 K8s + 懂 LLM          ←→   AIOps (K8sGPT/HolmesGPT)
• 多租户隔离、配额、计费             ←→   Namespace + 网关 (AgentGateway)
• Agent 要安全沙箱、有状态           ←→   Sandbox (agent-sandbox/e2b)
• 流量要路由、限流、降级             ←→   AI Gateway (Envoy AI Gateway)
```

**核心结论**：CNCF 在 2024-2026 专门新增了 `AI Agent`、`Inference`、`Training`、`AI Native Infra` 四个景观分类，就是为了把这套「LLM on Kubernetes」的栈标准化。本导览就是这套栈的中文落地手册。

---

## 2. 五层架构全景

```
                    ┌─────────────────────────────────────────┐
   流量入口层        │  Knative  │  Envoy AI Gateway           │  ← 南北向流量、弹性、路由
   (Gateway)        │  Kgateway │  AgentGateway               │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌────────────────▼────────────────────────┐
   应用/Agent 层     │  kagent (DevOps Agent on K8s)           │  ← Agent 运行时
   (App/Agent)      └────────────────┬────────────────────────┘
                                     │
                    ┌────────────────▼────────────────────────┐
   推理服务层        │  KServe  │  KAITO  │  llm-d             │  ← 模型 → API
   (Inference)      │  llmaz   │  AIBrix                     │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌────────────────▼────────────────────────┐
   调度/编排层       │  Volcano  │  KAI Scheduler  │  Kueue    │  ← GPU/Job 排队与分配
   (Scheduling)     │  KubeRay                                │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌────────────────▼────────────────────────┐
   平台/制品层       │  Kubeflow  │  KitOps (ModelKit)         │  ← 生命周期、打包、分发
   (Platform)       │  Dragonfly (权重 P2P 分发)               │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌────────────────▼────────────────────────┐
   可观测/AIOps 层   │  K8sGPT  │  HolmesGPT                  │  ← LLM 辅助运维
   (Observability)  └─────────────────────────────────────────┘
```

---

## 3. 项目清单总表

> 状态列：`Graduated` 毕业项目（最成熟）、`Incubating` 孵化（生产可用）、`Sandbox` 沙箱（早期/创新）、`Landscape` 在 CNCF 景观但非官方项目（生态事实标准）。

| # | 项目 | 状态 | 层次 | 一句话定位 | 深度文档 |
|---|------|------|------|-----------|---------|
| 1 | **KServe** | Incubating | 推理 | Kubernetes 上的标准化推理平台（GenAI + 传统 ML） | [[12_架构基建/05_CNCF云原生AI/14_KServe_深入分析]] |
| 2 | **KAITO** | Sandbox | 推理 | 一键在 K8s 跑 LLM 推理/微调/RAG 的 Operator | [[12_架构基建/05_CNCF云原生AI/10_KAITO_深入分析.md]] |
| 3 | **llm-d** | Landscape | 推理 | K8s 原生高性能分布式 LLM 推理框架 | [[12_架构基建/05_CNCF云原生AI/17_llm_d_深入分析.md]] |
| 4 | **llmaz** | Landscape | 推理 | K8s 上「易用优先」的 LLM 推理平台 | [[12_架构基建/05_CNCF云原生AI/18_llmaz_深入分析.md]] |
| 5 | **AIBrix** | Landscape | 推理 | 模块化的 GenAI 推理基础设施组件 | [[12_架构基建/05_CNCF云原生AI/02_AIBrix_深入分析.md]] |
| 6 | **Volcano** | Incubating | 调度 | K8s 批处理/HPC/AI 训练调度器 | [[12_架构基建/05_CNCF云原生AI/19_Volcano_深入分析.md]] |
| 7 | **KAI Scheduler** | Sandbox | 调度 | 大规模 AI GPU 调度器（YN 机房级） | [[12_架构基建/05_CNCF云原生AI/09_KAI_Scheduler_深入分析.md]] |
| 8 | **Kueue** | Landscape | 调度 | K8s 原生 Job 排队系统（配额/抢占） | [[12_架构基建/05_CNCF云原生AI/16_Kueue_深入分析.md]] |
| 9 | **KubeRay** | Landscape | 调度 | 在 K8s 上运行 Ray（vLLM/SGLang 分布式底座） | [[12_架构基建/05_CNCF云原生AI/15_KubeRay_深入分析.md]] |
| 10 | **Kubeflow** | Incubating | 平台 | K8s 原生 ML 平台（训练流水线） | [[11_模型运维/05_流程编排/07_Kubeflow_深入分析.md]] |
| 11 | **KitOps** | Sandbox | 平台 | ModelKit——模型+代码+数据统一打包标准 | [[12_架构基建/05_CNCF云原生AI/12_KitOps_深入分析.md]] |
| 12 | **Dragonfly** | Graduated | 平台 | P2P 加速——百 GB 模型权重秒级分发 | [[12_架构基建/05_CNCF云原生AI/03_Dragonfly_深入分析.md]] |
| 13 | **K8sGPT** | Sandbox | AIOps | 用 LLM 给 K8s 集群做"AI 体检" | [[12_架构基建/05_CNCF云原生AI/07_K8sGPT_深入分析.md]] |
| 14 | **HolmesGPT** | Sandbox | AIOps | 调查告警/执行 Runbook 的 AI SRE | [[12_架构基建/05_CNCF云原生AI/05_HolmesGPT_深入分析.md]] |
| 15 | **kagent** | Sandbox | AIOps | 在 K8s 里运行 DevOps AI Agent 的框架 | [[12_架构基建/05_CNCF云原生AI/08_kagent_深入分析.md]] |
| 16 | **Knative** | Graduated | 网关 | Serverless——LLM 服务 scale-to-zero | [[12_架构基建/05_CNCF云原生AI/13_Knative_深入分析.md]] |
| 17 | **Envoy AI Gateway** | Landscape | 网关 | 基于 Envoy Gateway 的 GenAI 统一入口 | [[12_架构基建/05_CNCF云原生AI/04_Envoy_AI网关_深入分析.md]] |
| 18 | **Kgateway** | Landscape | 网关 | Envoy 内核的 API/AI 双模网关 | [[12_架构基建/05_CNCF云原生AI/11_Kgateway_深入分析.md]] |
| 19 | **AgentGateway** | Landscape | 网关 | AI Agent 与 MCP 服务器的下一代代理 | [[12_架构基建/05_CNCF云原生AI/01_AgentGateway_深入分析.md]] |
| 20 | **vLLM / SGLang / TGI** | 参考 | 推理(引擎) | 被 KServe/KAITO/llm-d 编排的底层引擎 | [[10_部署推理/02_推理引擎/29_vLLM_深入分析.md]] |

---

## 4. 按层次详解

### 4.1 推理服务层 (Inference Serving)

这层负责把"一个模型文件"变成"一个 OpenAI 兼容的 HTTP API"，是 LLM 上 K8s 的**第一入口**。

| 项目 | 适合场景 | 底层引擎 | 复杂度 |
|------|---------|---------|--------|
| **KServe** | 企业级多框架、推理即 CRD、已有传统 ML | vLLM/TGI/Triton/Ollama/任意 | ⭐⭐⭐⭐ |
| **KAITO** | 微软生态、想 30 秒拉起一个大模型 | vLLM / TGI（预置 preset） | ⭐⭐ |
| **llm-d** | 超大规模、 disaggregated KV Cache、多租户 | 自研（兼容 vLLM worker） | ⭐⭐⭐⭐⭐ |
| **llmaz** | 中小团队、易用优先、InferencePool | vLLM / SGLang / TGI / Ollama | ⭐⭐⭐ |
| **AIBrix** | 模块化、按需启用（路由/缓存/弹性） | vLLM / SGLang | ⭐⭐⭐ |

> 选型一句话：**中小团队上 llmaz，企业统一平台上 KServe，追极致规模上 llm-d，微软/Azure 栈上 KAITO。**

详见各深度文档。底层引擎选型（vLLM vs SGLang vs TGI）见 [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南.md]]。

### 4.2 调度与编排层 (Scheduling & Orchestration)

LLM 工作负载的特点是 **GPU 密集 + 长任务 + 资源争抢**，K8s 默认调度器不够用。这层解决"谁先拿到 GPU"。

| 项目 | 核心能力 | 适用场景 |
|------|---------|---------|
| **Volcano** | Gang Scheduling（任务要么全调度要么不调度）、队列、公平共享 | 分布式训练、HPC |
| **KAI Scheduler** | 拓扑感知、GPU 碎片整理、万卡级拓扑最优 | 超大 AI 集群（YN/机房级） |
| **Kueue** | 配额管理、排队、抢占、与 Volcano/批处理 CRD 协同 | 多租户、资源不足要排队的平台 |
| **KubeRay** | 把 RayCluster/RayJob 声明式跑在 K8s | vLLM/SGLang 的分布式 Ray 后端 |

> 选型一句话：**有配额排队需求上 Kueue；分布式训练要 Gang 调度上 Volcano；万卡拓扑优化上 KAI Scheduler；vLLM 多节点分布式离不开 KubeRay。**

### 4.3 平台与制品层 (Platform & Lifecycle)

| 项目 | 核心能力 |
|------|---------|
| **Kubeflow** | 端到端 ML 平台：Notebook/Pipeline/Katib/Training Operator/Model Registry |
| **KitOps** | ModelKit 制品标准——把 model + code + config + data 打成一个 OCI 镜像，跨团队复现 |
| **Dragonfly** | P2P 镜像/权重分发，解决"100 个节点同时拉 70GB 模型把仓库打挂"的问题 |

### 4.4 可观测 / AIOps 层

这一层是"用 LLM 来运维 LLM 系统"，是云原生独有的玩法。

| 项目 | 触发方式 | 能干什么 |
|------|---------|---------|
| **K8sGPT** | CLI / Operator | 扫描集群 → 用 LLM 解释异常 + 给修复建议 |
| **HolmesGPT** | 接 Prometheus/PagerDuty/告警 | 收到告警 → 自动调查 → 给根因 + Runbook |
| **kagent** | 声明式 Agent CRD | 在 K8s 里跑自定义 DevOps Agent（巡检/发布/兜底） |

### 4.5 网关与 Serverless 层 (Gateway & Traffic)

| 项目 | 定位 | 关键能力 |
|------|------|---------|
| **Knative** | Serverless 运行时 | Scale-to-zero（闲时把 GPU Pod 缩到 0，省钱）、流量灰度 |
| **Envoy AI Gateway** | GenAI 统一入口 | 多 LLM provider 路由、token 限流、故障转移 |
| **Kgateway** | Envoy 内核双模网关 | 既是 API 网关又是 AI 网关，Omni-directional |
| **AgentGateway** | Agent/MCP 代理 | 给 AI Agent 和 MCP server 做统一鉴权/路由/沙箱入口 |

> 网关层更全的对比（含 LiteLLM/Kong/Portkey 等非 CNCF 方案）见 [[12_架构基建/11_AI网关/02_AI网关_对比_2026.md]]。

---

## 5. 生产环境选型决策树

```
你要在 K8s 上跑大模型？  从这里开始
        │
        ▼
   是单一模型还是多模型/多租户？
        │
   ┌────┴─────────────────┐
   │ 单一/简单            │ 多模型/企业平台
   ▼                      ▼
 想 30 秒拉起？        已有传统 ML 推理？
   │                      │
   ▼                      ▼
 KAITO                  KServe
   │                      │
   │ (否则 llmaz)         │ (否则 llm-d 超大规模)
   │                      │
   ▼                      ▼
 ──────────── 推理引擎选好了 ────────────
        │
        ▼
   GPU 够不够用？
        │
   ┌────┴─────────────┐
   │ 够，但闲时浪费    │ 不够，要排队/共享
   ▼                  ▼
 Knative             Kueue + Volcano
 (scale-to-zero)     (排队/配额/Gang 调度)
        │                  │
        ▼                  ▼
 ──────────── 调度层选好了 ────────────
        │
        ▼
   模型权重怎么分发？  → Dragonfly (P2P)
   模型怎么打包交付？  → KitOps (ModelKit)
   谁来运维/排障？     → K8sGPT + HolmesGPT
   流量怎么管？        → Envoy AI Gateway / Kgateway
```

---

## 6. 学习路径

按角色推荐阅读顺序：

**👨‍💻 平台工程师 / SRE（最推荐）**
1. 本导览（建立全景） → 2. [[12_架构基建/05_CNCF云原生AI/10_KAITO_深入分析.md]]（最快上手） → 3. [[12_架构基建/05_CNCF云原生AI/14_KServe_深入分析]]（企业标准） → 4. [[12_架构基建/05_CNCF云原生AI/16_Kueue_深入分析.md]]（多租户） → 5. [[12_架构基建/05_CNCF云原生AI/07_K8sGPT_深入分析.md]]（运维）

**🏗️ 架构师**
1. 本导览 → 2. [[12_架构基建/05_CNCF云原生AI/17_llm_d_深入分析.md]]（超大规模） → 3. [[12_架构基建/05_CNCF云原生AI/09_KAI_Scheduler_深入分析.md]]（万卡调度） → 4. [[12_架构基建/05_CNCF云原生AI/04_Envoy_AI网关_深入分析.md]]（流量入口）

**🚀 快速 PoC**
直接看 [[12_架构基建/05_CNCF云原生AI/10_KAITO_深入分析.md]] 的「快速开始」章节，15 分钟拉起一个大模型服务。

---

## 7. 与现有章节的关联

| 本节项目 | 关联章节 | 关联点 |
|---------|---------|-------|
| KServe / KAITO / llm-d | [[10_部署推理/index|部署与推理]] | 它们编排的就是 vLLM/SGLang/TGI 这些引擎 |
| KubeRay / Volcano / Kueue | [[12_架构基建/02_架构概览/02_AI_基础设施_2026|AI 基础设施]] | GPU 调度与集群管理 |
| Envoy AI Gateway / Kgateway | [[12_架构基建/11_AI网关/01_AI网关_2026|AI Gateway]] | 流量入口的 CNCF 实现 |
| K8sGPT / HolmesGPT | [[13_运维/index|AI 运维]] | AIOps 的云原生实践 |
| KitOps | [[11_模型运维/index|MLOps 流水线]] | 模型制品管理 |
| Kubeflow | [[11_模型运维/05_流程编排/07_Kubeflow_深入分析|Kubeflow 深度解析]] | 已有专题，本节引用 |
| DRA / CDI | [[12_架构基建/07_硬件与算力/06_DRA_深入分析|DRA]] / [[12_架构基建/07_硬件与算力/03_CDI_深入分析|CDI]] | GPU 设备怎么分配给上面这些项目 |

---

## Related

- [[12_架构基建/02_架构概览/02_AI_基础设施_2026|AI 基础设施 2026]] — 本节项目的底层硬件/网络/存储
- [[12_架构基建/07_硬件与算力/06_DRA_深入分析.md|DRA 深度解析]] — K8s 把 GPU 分给推理 Pod 的机制
- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南.md|LLM 推理引擎选型]] — 本节推理层调用的底层引擎
- [[12_架构基建/11_AI网关/02_AI网关_对比_2026.md|AI Gateway 对比]] — 网关层全方案对比
- [[13_运维/02_SRE与可靠性/22_SRE_for_AI_系统|面向 AI 系统的 SRE]] — K8sGPT/HolmesGPT 落地的运维框架
- [[README|知识库总索引]]
