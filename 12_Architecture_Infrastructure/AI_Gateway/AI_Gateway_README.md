---
title: AI Gateway
category: 12-architecture-infrastructure-ai-gateway
tags: ["ai-gateway", "api-management", "routing", "litellm"]
summary: "> AI 网关是 LLM 请求的统一入口，提供路由、限流、缓存、成本控制等企业级能力。"
created: 2026-05-31
updated: 2026-06-15
---

# AI Gateway

> AI 网关是 LLM 请求的统一入口，提供路由、限流、缓存、成本控制等企业级能力。

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI Gateway 2026](./AI_Gateway_2026.md) | AI Gateway 架构设计、核心功能、选型指南 | 架构师、开发者 |
| [LiteLLM Deep Dive](./LiteLLM_Deep_Dive.md) | 多模型统一 API 代理：100+ 模型支持、成本路由、预算控制 | 开发者、DevOps |
| [Portkey Deep Dive](./Portkey_Deep_Dive.md) | 企业级 AI Gateway：全链路追踪、成本控制、负载均衡 | 企业级用户 |
| [Cohere Deep Dive](./Cohere_Deep_Dive.md) | 企业级 Embedding：顶级向量、Rerank、多语言 | 搜索/RAG |

## 核心功能

| 功能 | 说明 |
|------|------|
| **智能路由** | 基于成本/延迟/可用性自动选择最优模型 |
| **成本控制** | 预算限制、每模型配额、支出追踪 |
| **限流熔断** | 速率限制、自动故障转移 |
| **语义缓存** | 相似查询缓存，节省 40-50% 成本 |
| **统一接口** | OpenAI 兼容 API，零代码迁移 |

## 开源方案对比

| 方案 | 模型支持 | 自托管 | 路由策略 | 选型建议 |
|------|----------|--------|----------|----------|
| **LiteLLM** | 100+ | ✅ | 5+ 种 | 多模型统一管理 |
| **Bifrost** | 20+ | ✅ | 基础 | 高性能 Rust 实现 |
| **Portkey** | 50+ | ❌ | 多种 | 企业级观测性 |

## 关联目录

- [10_Deployment_Inference](../10_Deployment_Inference/) -- 推理引擎 (vLLM, SGLang)
- [LLM 推理引擎选型指南](../../10_Deployment_Inference/LLM_Inference_Engine_Selection_Guide.md) -- 网关后端模型/推理引擎选型
- [LLM 推理引擎迁移指南](../../10_Deployment_Inference/LLM_Inference_Engine_Migration_Guide.md) -- 多引擎切换与灰度策略
- [14_RAG_Systems](../14_RAG_Systems/) -- RAG 系统
- [13_AI_Ops](../13_AI_Ops/) -- AI 运维

---

*Last updated: 2026-04-24*

## Related
- [[14_AI_Gateway/AI_Gateway_Comparison_2026|AI Gateway 对比 2026]]
- [[14_AI_Gateway/LiteLLM_Deep_Dive|LiteLLM: 多模型统一 API 代理]]
- [[14_AI_Gateway/README_for_dummy|14 AI Gateway — 小白版 🚪]]
- [[10_Deployment_Inference/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
- [[10_Deployment_Inference/LLM_Inference_Engine_Migration_Guide|LLM 推理引擎迁移指南]]
- [[10_Deployment_Inference/vLLM_Deep_Dive|vLLM 深度解析]]
- [[10_Deployment_Inference/SGLang_Deep_Dive|SGLang 深度解析]]

- [[14_AI_Gateway/AI_Gateway_for_dummy]] — AI Gateway 入门指南 (for Dummies) (共享: ai-gateway, api-management, litellm, routing)
- [[14_AI_Gateway/Gateway-in-nutshell]] — AI 网关速成指南 (共享: ai-gateway, api-management, litellm, routing)
- [[14_AI_Gateway/Kong_AI_Gateway_Deep_Dive]] — Kong AI Gateway 深度解析 (共享: ai-gateway, api-management, litellm, routing)
- [[14_AI_Gateway/Spring_AI_Gateway_Security]] — Spring AI 网关与安全 (共享: ai-gateway, api-management, litellm, routing)
- [[14_AI_Gateway/AI_Gateway_Comparison_2026.md|AI_Gateway_Comparison_2026]]
- [[14_AI_Gateway/README_for_dummy.md|README_for_dummy]]

- [[14_AI_Gateway/AI_Gateway_Comparison_2026|AI Gateway 对比 2026]]
- [[14_AI_Gateway/LiteLLM_Deep_Dive|LiteLLM: 多模型统一 API 代理]]
- [[14_AI_Gateway/README_for_dummy|14 AI Gateway — 小白版 🚪]]

