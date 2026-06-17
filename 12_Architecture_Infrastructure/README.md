---
title: '架构与基础设施 (Architecture & Infrastructure)'
category: '12-architecture-infrastructure'
tags: ["architecture", "infrastructure", "kubernetes", "high-availability"]
summary: '> **一句话理解**: AI 系统架构是智能应用的"骨架与神经系统"——决定系统能支撑多少用户、响应有多快、运行有多稳、成本有多低。'
created: '2026-05-31'
updated: '2026-06-16'
---

# 架构与基础设施 (Architecture & Infrastructure)

> **一句话理解**: AI 系统架构是智能应用的"骨架与神经系统"——决定系统能支撑多少用户、响应有多快、运行有多稳、成本有多低。

---

## 本章内容

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI System Architecture 2026](./AI_System_Architecture_2026.md) | 四层架构全景图：应用层→服务层→数据层→基础设施层 | 架构师、技术负责人 |
| [AI Infrastructure 2026](./AI_Infrastructure_2026.md) | GPU 集群、存储网络、训练/推理基础设施 | 基础设施工程师 |
| [Capacity Planning 2026](./Capacity_Planning_2026.md) | QPS/并发模型、GPU 显存估算、成本预测 | 架构师、SRE |
| [High Availability 2026](./High_Availability_2026.md) | 多活架构、故障转移、灾备演练 | 运维工程师 |
| [AI Cost Optimization 2026](./AI_Cost_Optimization_2026.md) | 模型量化、缓存策略、批处理优化 | 成本敏感型团队 |
| [Edge AI 2026](./Edge_AI_2026.md) | 边缘部署、模型压缩、端侧推理 | 移动端/IoT 开发者 |
| [Multi Tenant Architecture](./Multi_Tenant_Architecture.md) | 租户隔离、资源配额、计费计量 | SaaS 架构师 |
| [Spring AI Architecture](./Spring_AI_Architecture.md) | Spring AI 企业级架构设计 | Java 生态开发者 |
| [AI Stack Deep Dive](./AI_Stack_Deep_Dive.md) | 阿里云 AI Stack 软硬一体推理一体机（V2.14.0） | 政企 IT 决策者、基础设施工程师 |
| [Future AI Hardware 2026](./Future_Computing_Hardware_2026.md) | 前沿硬件：硅光子技术、LPU、NPU 霸权、生物计算 | 架构师、前瞻研究 |
| [CDI Deep Dive](./CDI_Deep_Dive.md) | 容器设备接口标准：GPU/国产加速器如何统一接入 K8s 容器 | 基础设施工程师、平台 SRE |
| [CDI 小白版](./CDI_for_dummy.md) | 用「酒店入住单」「万能插头」比喻讲懂 CDI | 初学者、非基础设施背景 |
| [DRA Deep Dive](./DRA_Deep_Dive.md) | 动态资源分配：K8s 设备分配的未来，与 CDI 配对 | 架构师、平台 SRE |
| [MIG Deep Dive](./MIG_Deep_Dive.md) | Multi-Instance GPU：A100/H100/PPU 硬件级切片（GI/CI），多租户强隔离推理 | 平台工程师、多租户 SRE |
| [HAMi Deep Dive](./HAMi_Deep_Dive.md) | CNCF Sandbox 异构 GPU 虚拟化：NVIDIA/昇腾/寒武纪统一共享与隔离 | 平台工程师、SRE、成本优化团队 |
| [HAMi 入门](./HAMi_for_dummy.md) | 零基础理解 HAMi 如何让 K8s GPU 像 CPU 一样共享 | 初学者、开发测试负责人 |
| [HAMi 运维指南](./HAMi_Operation_Guide.md) | HAMi 安装、配置、升级、监控与 WebUI | 平台 SRE、运维工程师 |

### AI Stack 生产工具链

> AI Stack 软硬一体机的日常生产运维命令行工具集合。

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI Stack 生产工具链总览](./AI_Stack_Production_Toolchain.md) | 工具全景速查、生命周期流程图、按角色索引 | 所有 AI Stack 用户 |
| [容器与运行时](./AI_Stack_Container_Runtime_Guide.md) | nerdctl / crictl / ctr / docker / podman 选型与命令 | SRE、平台工程师 |
| [GPU 监控](./AI_Stack_GPU_Monitoring_Guide.md) | nvidia-smi / ppu-smi / rocm-smi / pmon 监控与排障 | 运维、性能工程师 |
| [模型下载与管理](./AI_Stack_Model_Management_Guide.md) | huggingface-cli / modelscope / git-lfs 下载与组织 | 模型工程师 |
| [推理服务](./AI_Stack_Inference_Serving_Guide.md) | vLLM / SGLang / Ollama / llama-server 启动与运维 | 推理工程师 |
| [训练启动器](./AI_Stack_Training_Launchers_Guide.md) | torchrun / accelerate / deepspeed / swift 分布式训练 | 训练工程师 |
| [K8s 编排](./AI_Stack_K8s_Operations_Guide.md) | kubectl / helm 日常排障与包管理 | K8s 工程师 |
| [AI Stack 专属工具](./AI_Stack_Exclusive_Tools_Guide.md) | stackops / aioController 运维与生命周期 | AI Stack 运维 |

### AI Gateway

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI Gateway 2026](./AI_Gateway/AI_Gateway_2026.md) | AI Gateway 全景：路由、安全、可观测性 | 架构师、SRE |
| [AI Gateway Comparison](./AI_Gateway/AI_Gateway_Comparison_2026.md) | 主流 Gateway 横向对比 | 选型参考 |
| [LiteLLM Deep Dive](./AI_Gateway/LiteLLM_Deep_Dive.md) | LiteLLM 统一接口层 | 开发者 |
| [Kong AI Gateway](./AI_Gateway/Kong_AI_Gateway_Deep_Dive.md) | Kong AI 网关插件体系 | 平台工程师 |
| [Portkey Deep Dive](./AI_Gateway/Portkey_Deep_Dive.md) | Portkey 可观测性网关 | 架构师 |
| [Cohere Deep Dive](./AI_Gateway/Cohere_Deep_Dive.md) | Cohere 企业级 RAG/安全 | 企业用户 |
| [Spring AI Gateway Security](./AI_Gateway/Spring_AI_Gateway_Security.md) | Spring AI 安全网关 | Java 生态 |

### CNCF 云原生大模型 (Cloud Native AI)

> 2026 新增 · 系统梳理 CNCF 生态中与大模型相关的 18 个项目，覆盖「推理 / 调度 / 平台 / AIOps / 网关」五大层次，每篇含基础知识、使用、运维、配置。

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [CNCF LLM 项目全景导览](./CNCF_Cloud_Native_AI/README.md) | 18 个项目五层架构总览 + 选型决策树 | 架构师、平台工程师 |
| [KServe 深度解析](./CNCF_Cloud_Native_AI/KServe_Deep_Dive.md) | K8s 标准化推理平台（CNCF 孵化） | 平台工程师 |
| [KAITO 深度解析](./CNCF_Cloud_Native_AI/KAITO_Deep_Dive.md) | 一键 preset 部署 LLM 的 Operator（CNCF 沙箱） | 快速 PoC、Azure 栈 |
| [llm-d 深度解析](./CNCF_Cloud_Native_AI/llm-d_Deep_Dive.md) | 分布式 + 共享 KV Cache 推理框架 | 超大规模平台 |
| [llmaz 深度解析](./CNCF_Cloud_Native_AI/llmaz_Deep_Dive.md) | 易用优先的多引擎推理平台 | 中小团队 |
| [AIBrix 深度解析](./CNCF_Cloud_Native_AI/AIBrix_Deep_Dive.md) | 模块化 vLLM 推理基础设施组件 | vLLM 重度用户 |
| [Volcano 深度解析](./CNCF_Cloud_Native_AI/Volcano_Deep_Dive.md) | Gang Scheduling 批处理调度器（CNCF 孵化） | 分布式训练 |
| [KAI Scheduler 深度解析](./CNCF_Cloud_Native_AI/KAI_Scheduler_Deep_Dive.md) | 万卡级拓扑感知 GPU 调度器（CNCF 沙箱） | 超大 AI 集群 |
| [Kueue 深度解析](./CNCF_Cloud_Native_AI/Kueue_Deep_Dive.md) | K8s 原生作业排队/配额系统（SIGs） | 多租户平台 |
| [KubeRay 深度解析](./CNCF_Cloud_Native_AI/KubeRay_Deep_Dive.md) | Ray on K8s（vLLM 分布式底座） | 多机多卡推理 |
| [KitOps 深度解析](./CNCF_Cloud_Native_AI/KitOps_Deep_Dive.md) | ModelKit 大模型制品打包标准（CNCF 沙箱） | MLOps、供应链安全 |
| [Dragonfly 深度解析](./CNCF_Cloud_Native_AI/Dragonfly_Deep_Dive.md) | P2P 加速权重分发（CNCF 毕业） | 大规模集群 |
| [K8sGPT 深度解析](./CNCF_Cloud_Native_AI/K8sGPT_Deep_Dive.md) | AI SRE 集群扫描器（CNCF 沙箱） | SRE、运维 |
| [HolmesGPT 深度解析](./CNCF_Cloud_Native_AI/HolmesGPT_Deep_Dive.md) | AI 事故调查员（CNCF 沙箱） | SRE、On-call |
| [kagent 深度解析](./CNCF_Cloud_Native_AI/kagent_Deep_Dive.md) | K8s 原生 DevOps Agent 框架（CNCF 沙箱） | 平台自动化 |
| [Knative 深度解析](./CNCF_Cloud_Native_AI/Knative_Deep_Dive.md) | LLM 服务 scale-to-zero（CNCF 毕业） | 成本优化 |
| [Envoy AI Gateway 深度解析](./CNCF_Cloud_Native_AI/Envoy_AI_Gateway_Deep_Dive.md) | 基于 Envoy 的 GenAI 统一入口 | 流量入口 |
| [Kgateway 深度解析](./CNCF_Cloud_Native_AI/Kgateway_Deep_Dive.md) | Envoy 内核 API+AI 双模网关 | 统一网关 |
| [AgentGateway 深度解析](./CNCF_Cloud_Native_AI/AgentGateway_Deep_Dive.md) | AI Agent 与 MCP 服务器代理网关 | Agent 生产化 |

---

## 学习路径

- **架构概览** → [AI System Architecture 2026](./AI_System_Architecture_2026.md)（1-2 小时）
- **容量规划** → [Capacity Planning 2026](./Capacity_Planning_2026.md) + [AI Cost Optimization 2026](./AI_Cost_Optimization_2026.md)
- **高可用设计** → [High Availability 2026](./High_Availability_2026.md) + [Multi Tenant Architecture](./Multi_Tenant_Architecture.md)
- **边缘场景** → [Edge AI 2026](./Edge_AI_2026.md)
- **Java 生态** → [Spring AI Architecture](./Spring_AI_Architecture.md)
- **私有化 AI 一体机** → [AI Stack Deep Dive](./AI_Stack_Deep_Dive.md) → [AI Stack 生产工具链总览](./AI_Stack_Production_Toolchain.md)
- **异构设备接入** → [CDI Deep Dive](./CDI_Deep_Dive.md)（GPU/昇腾/寒武纪统一容器化）
- **GPU 硬件级切分** → [MIG Deep Dive](./MIG_Deep_Dive.md)（A100/H100/PPU 多租户强隔离）+ [HAMi Deep Dive](./HAMi_Deep_Dive.md)（软件超卖）
- **GPU 共享与池化** → [HAMi Deep Dive](./HAMi_Deep_Dive.md) → [HAMi 运维指南](./HAMi_Operation_Guide.md)
- **云原生大模型** → [CNCF LLM 项目全景导览](./CNCF_Cloud_Native_AI/README.md)（推理/调度/平台/AIOps/网关五层）

---

## 与其他章节的关联

### 前置知识
- [深度学习](../03_Deep_Learning/README.md) — 理解模型计算特性
- [部署推理](../09_Deployment_Inference/README.md) — 推理优化是架构设计的基础
- [RAG 系统](../11_RAG_Systems/README.md) — 检索系统的架构考量

### 进阶方向
- [AI Gateway](./AI_Gateway/AI_Gateway_README.md) — 流量接入层设计（本章子目录）
- [AI Ops](../16_AI_Ops/README.md) — 运维监控与自动化
- [Agent 生产](../13_Agent_Production/README.md) — Agent 系统的架构模式

---

*本章内容持续完善中。*

## Related
- [[12_Architecture_Infrastructure/AI_Cost_Optimization_2026|AI 成本优化与 FinOps 2026]]
- [[12_Architecture_Infrastructure/High_Availability_2026|AI 系统高可用架构设计 (High Availability 2026)]]
- [[12_Architecture_Infrastructure/README|架构与基础设施 (Architecture & Infrastructure)]]
- [[12_Architecture_Infrastructure/Edge_AI_2026|边缘 AI / 设备端 AI 2026]]
- [[12_Architecture_Infrastructure/AI_System_Architecture_2026|AI 系统架构全景图 (AI System Architecture 2026)]]
- [[12_Architecture_Infrastructure/README_for_dummy|12 架构与基础设施 — 小白版 🏗️]]
- [[12_Architecture_Infrastructure/Capacity_Planning_2026|AI 系统容量规划指南 (Capacity Planning 2026)]]

- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive|阿里云 AI Stack: 企业级软硬一体 AI 推理平台]]
- [[12_Architecture_Infrastructure/CDI_Deep_Dive|CDI (Container Device Interface): 容器设备接口标准]]
- [[concepts/ai-architecture]] — AI 系统架构
- [[concepts/llm-infrastructure]] — LLM 基础设施
- [[12_Architecture_Infrastructure/Alibaba_Cloud_AI_Stack_Deep_Dive|阿里云 AI Stack 深度解读]] — 专有云 AI 推理平台三层架构
- [[12_Architecture_Infrastructure/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_Architecture_Infrastructure/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[12_Architecture_Infrastructure/AI_Stack_GPU_Monitoring_Guide|AI Stack GPU 监控指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Model_Management_Guide|AI Stack 模型下载与管理指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Inference_Serving_Guide|AI Stack 推理服务指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Training_Launchers_Guide|AI Stack 训练启动器指南]]
- [[12_Architecture_Infrastructure/AI_Stack_K8s_Operations_Guide|AI Stack K8s 编排指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Exclusive_Tools_Guide|AI Stack 专属运维工具指南]]

