---
title: '架构与基础设施 (Architecture & Infrastructure)'
category: '12-architecture-infrastructure'
tags: ["architecture", "infrastructure", "kubernetes", "high-availability"]
summary: '> **一句话理解**: AI 系统架构是智能应用的"骨架与神经系统"——决定系统能支撑多少用户、响应有多快、运行有多稳、成本有多低。'
created: '2026-05-31'
updated: '2026-05-31'
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

---

## 学习路径

- **架构概览** → [AI System Architecture 2026](./AI_System_Architecture_2026.md)（1-2 小时）
- **容量规划** → [Capacity Planning 2026](./Capacity_Planning_2026.md) + [AI Cost Optimization 2026](./AI_Cost_Optimization_2026.md)
- **高可用设计** → [High Availability 2026](./High_Availability_2026.md) + [Multi Tenant Architecture](./Multi_Tenant_Architecture.md)
- **边缘场景** → [Edge AI 2026](./Edge_AI_2026.md)
- **Java 生态** → [Spring AI Architecture](./Spring_AI_Architecture.md)
- **私有化 AI 一体机** → [AI Stack Deep Dive](./AI_Stack_Deep_Dive.md)
- **异构设备接入** → [CDI Deep Dive](./CDI_Deep_Dive.md)（GPU/昇腾/寒武纪统一容器化）

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

