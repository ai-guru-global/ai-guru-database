---
title: '架构与基础设施 (Architecture & Infrastructure)'
category: '12-architecture-infrastructure'
tags: ["architecture", "infrastructure", "kubernetes", "high-availability"]
summary: '> **一句话理解**: AI 系统架构是智能应用的"骨架与神经系统"——决定系统能支撑多少用户、响应有多快、运行有多稳、成本有多低。'
created: '2026-05-31'
updated: '2026-06-16'
tier: supporting
sources: []

name_zh: "架构与基础设施"
---
# 架构与基础设施 (Architecture & Infrastructure)

> 中文简称：架构与基础设施

> **一句话理解**: AI 系统架构是智能应用的"骨架与神经系统"——决定系统能支撑多少用户、响应有多快、运行有多稳、成本有多低。

---

## 本章内容

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI System Architecture 2026](./02_架构概览/03_AI_系统_架构_2026.md) | 四层架构全景图：应用层→服务层→数据层→基础设施层 | 架构师、技术负责人 |
| [AI Infrastructure 2026](./02_架构概览/02_AI_基础设施_2026.md) | GPU 集群、存储网络、训练/推理基础设施 | 基础设施工程师 |
| [Capacity Planning 2026](./02_架构概览/05_Capacity_Planning_2026.md) | QPS/并发模型、GPU 显存估算、成本预测 | 架构师、SRE |
| [AI SRE Runbook](../13_运维/02_SRE与可靠性/03_AI_SRE_操作手册.md) | AI 系统 SLO/SLI、GPU 容量规划、事故响应、模型回滚、灾备 | AI SRE、平台负责人 |
| [High Availability 2026](12_架构基建/02_架构概览/06_高可用_2026.md) | 多活架构、故障转移、灾备演练 | 运维工程师 |
| [AI Cost Optimization 2026](12_架构基建/02_架构概览/01_AI_成本优化_2026.md) | 模型量化、缓存策略、批处理优化 | 成本敏感型团队 |
| [Edge AI 2026](./07_硬件与算力/07_边缘_AI_2026.md) | 边缘部署、模型压缩、端侧推理 | 移动端/IoT 开发者 |
| [Multi Tenant Architecture](./02_架构概览/09_Multi_Tenant_架构.md) | 租户隔离、资源配额、计费计量 | SaaS 架构师 |
| [Spring AI Architecture](./02_架构概览/10_Spring_AI_架构.md) | Spring AI 企业级架构设计 | Java 生态开发者 |
| [AI Stack Deep Dive](12_架构基建/03_AI技术栈/02_AI技术栈_深入分析.md) | 阿里云 AI Stack 软硬一体推理一体机（V2.14.0） | 政企 IT 决策者、基础设施工程师 |
| [Future AI Hardware 2026](./07_硬件与算力/08_未来_Computing_硬件_2026.md) | 前沿硬件：硅光子技术、LPU、NPU 霸权、生物计算 | 架构师、前瞻研究 |
| CDI Deep Dive | 容器设备接口标准：GPU/国产加速器如何统一接入 K8s 容器 | 基础设施工程师、平台 SRE |
| CDI 小白版 | 用「酒店入住单」「万能插头」比喻讲懂 CDI | 初学者、非基础设施背景 |
| [DRA Deep Dive](./07_硬件与算力/06_DRA_深入分析.md) | 动态资源分配：K8s 设备分配的未来，与 CDI 配对 | 架构师、平台 SRE |
| [MIG Deep Dive](./07_硬件与算力/11_MIG_深入分析.md) | Multi-Instance GPU：A100/H100/PPU 硬件级切片（GI/CI），多租户强隔离推理 | 平台工程师、多租户 SRE |
| [HAMi Deep Dive](./03_AI技术栈/11_HAMi_深入分析.md) | CNCF Sandbox 异构 GPU 虚拟化：NVIDIA/昇腾/寒武纪统一共享与隔离 | 平台工程师、SRE、成本优化团队 |
| HAMi 入门 | 零基础理解 HAMi 如何让 K8s GPU 像 CPU 一样共享 | 初学者、开发测试负责人 |
| [HAMi 运维指南](./03_AI技术栈/12_HAMi_Operation_指南.md) | HAMi 安装、配置、升级、监控与 WebUI | 平台 SRE、运维工程师 |

### Kubernetes 基础与专有云上下文

> 面向阿里云专有云 K8s 工单智能体：从核心组件、网络、存储到排障 Playbook，再到阿里云专有云（Apsara Stack）产品映射。

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Kubernetes 核心组件深度解析](12_架构基建/04_Kubernetes核心/01_Kubernetes核心_Components_深入分析.md) | 控制平面与节点组件原理、交互链路、故障排查 | K8s 工程师、SRE |
| [Kubernetes 网络深度解析](12_架构基建/04_Kubernetes核心/02_Kubernetes_网络_深入分析.md) | CNI、Service、DNS、Ingress、NetworkPolicy 与排障 | 网络工程师、SRE |
| [Kubernetes 存储深度解析](12_架构基建/04_Kubernetes核心/04_Kubernetes_存储_深入分析.md) | PV/PVC/StorageClass、CSI、StatefulSet 与分布式存储 | 存储工程师、SRE |
| [Kubernetes 可观测性栈](12_架构基建/04_Kubernetes核心/03_Kubernetes_可观测性_Stack.md) | Metrics/Logs/Traces 三支柱与阿里云专有云集成 | 可观测性工程师 |
| [阿里云专有云 K8s 上下文](./06_云厂商/03_Alibaba_云_Proprietary_K8s_上下文.md) | ACK 专有版/敏捷版、天基、ASCM、飞天底座映射 | 专有云运维、工单处理 |

### 阿里云 AI 平台

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [阿里云 PAI 深度解析](./06_云厂商/04_Alibaba_PAI_深入分析.md) | PAI-DSW / DLC / EAS 与 ACK 专有云集成 | AI 平台工程师、SRE |

### AI Stack 生产工具链

> AI Stack 软硬一体机的日常生产运维命令行工具集合。

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI Stack 生产工具链总览](12_架构基建/03_AI技术栈/09_AI技术栈_生产_工具链.md) | 工具全景速查、生命周期流程图、按角色索引 | 所有 AI Stack 用户 |
| [容器与运行时](12_架构基建/03_AI技术栈/01_AI技术栈_容器_Runtime_指南.md) | nerdctl / crictl / ctr / docker / podman 选型与命令 | SRE、平台工程师 |
| [GPU 监控](12_架构基建/03_AI技术栈/04_AI技术栈_GPU_监控_指南.md) | nvidia-smi / ppu-smi / rocm-smi / pmon 监控与排障 | 运维、性能工程师 |
| [模型下载与管理](12_架构基建/03_AI技术栈/08_AI技术栈_模型_Management_指南.md) | huggingface-cli / modelscope / git-lfs 下载与组织 | 模型工程师 |
| [推理服务](12_架构基建/03_AI技术栈/05_AI技术栈_推理_服务_指南.md) | vLLM / SGLang / Ollama / llama-server 启动与运维 | 推理工程师 |
| [训练启动器](12_架构基建/03_AI技术栈/10_AI技术栈_训练_发布ers_指南.md) | torchrun / accelerate / deepspeed / swift 分布式训练 | 训练工程师 |
| [K8s 编排](12_架构基建/03_AI技术栈/06_AI技术栈_K8s_Operations_指南.md) | kubectl / helm 日常排障与包管理 | K8s 工程师 |
| [AI Stack 专属工具](12_架构基建/README.md) | stackops / aioController 运维与生命周期 | AI Stack 运维 |
| [AI Stack MLOps 参考架构](./03_AI技术栈/07_AI技术栈_MLOps_参考_架构.md) | AI Stack + MLflow + ACK 私有化 MLOps 流水线 | 平台架构师 |

### AI 基础设施（领域知识）

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI 网络基础](./08_网络/01_AI_网络_基础.md) | 带宽、延迟、拓扑、RDMA/RoCE/InfiniBand、K8s 网络配置 | 基础设施工程师 |
| [RDMA 与 RoCE 在 AI 集群中的应用](./08_网络/06_RDMA_and_RoCE_for_AI.md) | RDMA 原理、InfiniBand vs RoCE、K8s 部署与调优 | 网络工程师 |
| [AI 集群网络诊断命令集](./08_网络/05_网络_Diagnostics_命令.md) | IB/RoCE/以太网/K8s 网络带宽、延迟、连通性诊断命令 | 网络工程师 |
| [AI 存储模式](./09_存储/01_AI_存储_模式.md) | 本地 NVMe、并行文件系统、NAS、OSS 选型与组合 | 存储工程师 |
| [Checkpoint 与模型存储](./09_存储/02_Checkpoint_and_模型_存储.md) | Checkpoint 优化、模型版本存储、灾难恢复 | 训练/平台工程师 |
| [AI 存储诊断命令集](./09_存储/04_存储_Diagnostics_命令.md) | 本地磁盘/NAS/OSS/并行文件系统性能测试与问题定位 | 存储工程师 |
| [AI 安全基础](./10_安全/01_AI_安全_基础.md) | 模型安全、数据安全、基础设施安全、供应链安全 | 安全工程师 |
| [容器与供应链安全 for AI](./10_安全/02_容器_and_AI供应链安全_for_AI.md) | 镜像安全、运行时安全、SBOM、签名验证 | 安全/SRE |

### AI Gateway

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI Gateway 2026](./11_AI网关/01_AI网关_2026.md) | AI Gateway 全景：路由、安全、可观测性 | 架构师、SRE |
| [AI Gateway Comparison](./11_AI网关/02_AI网关_对比_2026.md) | 主流 Gateway 横向对比 | 选型参考 |
| [LLM Gateway 深度实战](./11_AI网关/11_LLM_Gateway_深入分析.md) | 路由、Fallback、限流、成本归因与 Terraform/Helm 模板 | 平台工程师 |
| [AI API 设计指南](./11_AI网关/04_API_设计_for_AI.md) | REST/gRPC/OpenAPI 选型、流式响应与版本管理 | 后端 / API 设计师 |
| [LiteLLM Deep Dive](./11_AI网关/09_LiteLLM_深入分析.md) | LiteLLM 统一接口层 | 开发者 |
| [Kong AI Gateway](./11_AI网关/08_Kong_AI网关_深入分析.md) | Kong AI 网关插件体系 | 平台工程师 |
| [Portkey Deep Dive](./11_AI网关/12_Portkey_深入分析.md) | Portkey 可观测性网关 | 架构师 |
| [Cohere Deep Dive](./11_AI网关/05_Cohere_深入分析.md) | Cohere 企业级 RAG/安全 | 企业用户 |
| [Spring AI Gateway Security](./11_AI网关/13_Spring_AI网关_安全.md) | Spring AI 安全网关 | Java 生态 |

### CNCF 云原生大模型 (Cloud Native AI)

> 2026 新增 · 系统梳理 CNCF 生态中与大模型相关的 18 个项目，覆盖「推理 / 调度 / 平台 / AIOps / 网关」五大层次，每篇含基础知识、使用、运维、配置。

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [CNCF LLM 项目全景导览](./05_CNCF云原生AI/README.md) | 18 个项目五层架构总览 + 选型决策树 | 架构师、平台工程师 |
| [KServe 深度解析](./05_CNCF云原生AI/14_KServe_深入分析.md) | K8s 标准化推理平台（CNCF 孵化） | 平台工程师 |
| [KAITO 深度解析](./05_CNCF云原生AI/10_KAITO_深入分析.md) | 一键 preset 部署 LLM 的 Operator（CNCF 沙箱） | 快速 PoC、Azure 栈 |
| [llm-d 深度解析](./05_CNCF云原生AI/17_llm_d_深入分析.md) | 分布式 + 共享 KV Cache 推理框架 | 超大规模平台 |
| [llmaz 深度解析](./05_CNCF云原生AI/18_llmaz_深入分析.md) | 易用优先的多引擎推理平台 | 中小团队 |
| [AIBrix 深度解析](./05_CNCF云原生AI/02_AIBrix_深入分析.md) | 模块化 vLLM 推理基础设施组件 | vLLM 重度用户 |
| [Volcano 深度解析](./05_CNCF云原生AI/19_Volcano_深入分析.md) | Gang Scheduling 批处理调度器（CNCF 孵化） | 分布式训练 |
| [KAI Scheduler 深度解析](./05_CNCF云原生AI/09_KAI_Scheduler_深入分析.md) | 万卡级拓扑感知 GPU 调度器（CNCF 沙箱） | 超大 AI 集群 |
| [Kueue 深度解析](./05_CNCF云原生AI/16_Kueue_深入分析.md) | K8s 原生作业排队/配额系统（SIGs） | 多租户平台 |
| KubeRay 深度解析 | Ray on K8s（vLLM 分布式底座） | 多机多卡推理 |
| [KitOps 深度解析](./05_CNCF云原生AI/12_KitOps_深入分析.md) | ModelKit 大模型制品打包标准（CNCF 沙箱） | MLOps、供应链安全 |
| [Dragonfly 深度解析](./05_CNCF云原生AI/03_Dragonfly_深入分析.md) | P2P 加速权重分发（CNCF 毕业） | 大规模集群 |
| [K8sGPT 深度解析](./05_CNCF云原生AI/07_K8sGPT_深入分析.md) | AI SRE 集群扫描器（CNCF 沙箱） | SRE、运维 |
| [HolmesGPT 深度解析](./05_CNCF云原生AI/05_HolmesGPT_深入分析.md) | AI 事故调查员（CNCF 沙箱） | SRE、On-call |
| [kagent 深度解析](./05_CNCF云原生AI/08_kagent_深入分析.md) | K8s 原生 DevOps Agent 框架（CNCF 沙箱） | 平台自动化 |
| [Knative 深度解析](./05_CNCF云原生AI/13_Knative_深入分析.md) | LLM 服务 scale-to-zero（CNCF 毕业） | 成本优化 |
| [Envoy AI Gateway 深度解析](./05_CNCF云原生AI/04_Envoy_AI网关_深入分析.md) | 基于 Envoy 的 GenAI 统一入口 | 流量入口 |
| [Kgateway 深度解析](./05_CNCF云原生AI/11_Kgateway_深入分析.md) | Envoy 内核 API+AI 双模网关 | 统一网关 |
| [AgentGateway 深度解析](./05_CNCF云原生AI/01_AgentGateway_深入分析.md) | AI Agent 与 MCP 服务器代理网关 | Agent 生产化 |

### 主流云 AI 平台

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AWS Bedrock 深度解析](12_架构基建/06_云厂商/05_AWS_Bedrock_深入分析.md) | 亚马逊云托管基础模型服务：Claude/Llama/Titan/RAG/Agent/Guardrails | 企业架构师 |
| [Azure OpenAI 深度解析](12_架构基建/06_云厂商/06_Azure_OpenAI_深入分析.md) | 微软企业级 GPT 服务：数据隐私、区域部署、M365 集成 | 企业架构师 |
| [Google Vertex AI 深度解析](12_架构基建/06_云厂商/07_Google_Vertex_AI_深入分析.md) | GCP 统一 AI 平台：Gemini、训练、MLOps、TPU、BigQuery | 企业架构师 |

---

## 学习路径

- **架构概览** → [AI System Architecture 2026](./02_架构概览/03_AI_系统_架构_2026.md)（1-2 小时）
- **容量规划** → [Capacity Planning 2026](./02_架构概览/05_Capacity_Planning_2026.md) + [AI Cost Optimization 2026](12_架构基建/02_架构概览/01_AI_成本优化_2026.md)
- **高可用设计** → [High Availability 2026](12_架构基建/02_架构概览/06_高可用_2026.md) + [Multi Tenant Architecture](./02_架构概览/09_Multi_Tenant_架构.md)
- **边缘场景** → [Edge AI 2026](./07_硬件与算力/07_边缘_AI_2026.md)
- **Java 生态** → [Spring AI Architecture](./02_架构概览/10_Spring_AI_架构.md)
- **私有化 AI 一体机** → [AI Stack Deep Dive](12_架构基建/03_AI技术栈/02_AI技术栈_深入分析.md) → [AI Stack 生产工具链总览](12_架构基建/03_AI技术栈/09_AI技术栈_生产_工具链.md)
- **异构设备接入** → CDI Deep Dive（GPU/昇腾/寒武纪统一容器化）
- **GPU 硬件级切分** → [MIG Deep Dive](./07_硬件与算力/11_MIG_深入分析.md)（A100/H100/PPU 多租户强隔离）+ [HAMi Deep Dive](./03_AI技术栈/11_HAMi_深入分析.md)（软件超卖）
- **GPU 共享与池化** → [HAMi Deep Dive](./03_AI技术栈/11_HAMi_深入分析.md) → [HAMi 运维指南](./03_AI技术栈/12_HAMi_Operation_指南.md)
- **云原生大模型** → [CNCF LLM 项目全景导览](./05_CNCF云原生AI/README.md)（推理/调度/平台/AIOps/网关五层）

---

## 与其他章节的关联

### 前置知识
- [深度学习](../03_深度学习/README.md) — 理解模型计算特性
- [部署推理](10_部署推理/README.md) — 推理优化是架构设计的基础
- [RAG 系统](../14_RAG系统/README.md) — 检索系统的架构考量

### 进阶方向
- [AI Gateway](./11_AI网关/03_AI网关_README.md) — 流量接入层设计（本章子目录）
- [AI Ops](../13_运维/README.md) — 运维监控与自动化
- [Agent 生产](../15_智能体/README.md) — Agent 系统的架构模式

---

*本章内容持续完善中。*

## Related
- [[12_架构基建/02_架构概览/01_AI_成本优化_2026|AI 成本优化与 FinOps 2026]]
- [[12_架构基建/High_Availability_2026|AI 系统高可用架构设计 (High Availability 2026)]]
- [[12_架构基建/README|架构与基础设施 (Architecture & Infrastructure)]]
- [[12_架构基建/07_硬件与算力/07_边缘_AI_2026|边缘 AI / 设备端 AI 2026]]
- [[12_架构基建/02_架构概览/03_AI_系统_架构_2026|AI 系统架构全景图 (AI System Architecture 2026)]]
- [[12_架构基建/README|12 架构与基础设施 — 小白版 🏗️]]
- [[12_架构基建/02_架构概览/05_Capacity_Planning_2026|AI 系统容量规划指南 (Capacity Planning 2026)]]

- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析|阿里云 AI Stack: 企业级软硬一体 AI 推理平台]]
- [[12_架构基建/07_硬件与算力/03_CDI_深入分析|CDI (Container Device Interface): 容器设备接口标准]]
- [[概念/ai-architecture]] — AI 系统架构
- [[概念/llm-infrastructure]] — LLM 基础设施
- [[12_架构基建/06_云厂商/01_Alibaba_云_AI技术栈_深入分析|阿里云 AI Stack 深度解读]] — 专有云 AI 推理平台三层架构
- [[12_架构基建/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_架构基建/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[12_架构基建/03_AI技术栈/04_AI技术栈_GPU_监控_指南|AI Stack GPU 监控指南]]
- [[12_架构基建/03_AI技术栈/08_AI技术栈_模型_Management_指南|AI Stack 模型下载与管理指南]]
- [[12_架构基建/03_AI技术栈/05_AI技术栈_推理_服务_指南|AI Stack 推理服务指南]]
- [[12_架构基建/AI_Stack_Training_Launchers_Guide|AI Stack 训练启动器指南]]
- [[12_架构基建/03_AI技术栈/06_AI技术栈_K8s_Operations_指南|AI Stack K8s 编排指南]]
- [[12_架构基建/03_AI技术栈/03_AI技术栈_Exclusive_工具_指南|AI Stack 专属运维工具指南]]


- [[12_架构基建/11_AI网关/03_AI网关_README|AI Gateway]]
- [[概念/Inference/ai-gateway-2|14 AI Gateway — 小白版 🚪]]
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析|阿里云 AI Stack: 企业级软硬一体 AI 推理平台]]
- [[AI_Stack_MLOps_Reference_Architecture|AI Stack + MLflow + ACK 私有化 MLOps 参考架构]]
- [[12_架构基建/03_AI技术栈/14_Safetensors_Hub_Management|Safetensors 与 Hub 治理：下一代模型存储与分发标准]]
- [[12_架构基建/06_云厂商/04_Alibaba_PAI_深入分析|阿里云 PAI 深度解析]]
- [[12_架构基建/README.md|CDI 容器设备接口 - 小白版]]
- [[概念/K8s/kubernetes|Kubernetes 可观测性栈]]
- [[12_架构基建/08_网络/06_RDMA_and_RoCE_for_AI|RDMA 与 RoCE 在 AI 集群中的应用]]
- [[Container_and_Supply_Chain_Security_for_AI|容器与供应链安全 for AI]]
- [[12_架构基建/09_存储/01_AI_存储_模式|AI 存储模式]]

## 工单诊断入口

- [[13_运维/04_问题排查/05_diagnosis_work_order_hub]] — 工单智能体远程诊断知识枢纽（Pod/网络/存储/GPU 四大决策树）
