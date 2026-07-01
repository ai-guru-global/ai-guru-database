---
title: "LLM 网关对比 2026: LiteLLM vs Portkey vs Kong"
category: "12-architecture-infrastructure-ai-gateway"
tags: ["ai-gateway", "litellm", "portkey", "kong", "routing", "cost-optimization"]
summary: "LLM 网关是统一管理多 LLM 供应商的关键基础设施,本文对比 LiteLLM、Portkey、Kong 等主流方案的架构与适用场景。"
sources:
  - "https://github.com/BerriAI/litellm"
  - "https://portkey.ai/"
  - "https://docs.konghq.com/gateway/"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Llm Gateway Comparison 2026"
  - "LLM Gateway Comparison 2026"
  - LLM_Gateway_Comparison_2026

---
# LLM 网关对比 2026: LiteLLM vs Portkey vs Kong

> **一句话理解**: LLM 网关是统一管理多 LLM 供应商的关键基础设施,本文对比 LiteLLM、Portkey、Kong 等主流方案的架构与适用场景。

## 什么是 LLM 网关?

LLM 网关(Application Gateway for AI)是位于应用和 LLM API 之间的中间层,提供:

- **统一接口**: 一个 API 访问多家 LLM
- **智能路由**: 根据任务类型、成本、延迟选择模型
- **负载均衡**: 分散请求到多个 API Key/端点
- **成本控制**: 预算管理、token 限制
- **缓存**: 语义缓存、前缀缓存
- **安全**: API Key 管理、访问控制
- **可观测性**: 请求追踪、成本分析

## 主流方案对比

| 维度 | LiteLLM | Portkey | Kong AI Gateway |
|------|---------|---------|-----------------|
| **类型** | 开源 (Python) | 开源+云 | 企业级 API 网关 |
| **部署** | 自托管 | 自托管/云 | 自托管/云 |
| **模型支持** | 100+ 模型 | 200+ 模型 | 通过插件扩展 |
| **路由策略** | 负载均衡、fallback | 智能路由、A/B | 插件式路由 |
| **缓存** | 基础缓存 | 语义缓存 | 插件式缓存 |
| **成本管理** | 预算限制 | 高级成本分析 | 插件式 |
| **可观测性** | 基础日志 | 内置追踪 | 插件式 |
| **学习曲线** | 低 | 中 | 高 |
| **适用规模** | 中小 | 中大 | 大型企业 |

## LiteLLM

**优势**: 简单、轻量、API 兼容 OpenAI 格式

```python
from litellm import completion

# 统一接口访问不同模型
response = completion(
    model="gpt-4o",  # 或 "claude-3-opus", "gemini/gemini-pro"
    messages=[{"role": "user", "content": "Hello"}]
)
```

## Portkey

**优势**: 智能路由、高级缓存、内置可观测性

- AI 语义路由: 根据查询复杂度选择模型
- 自动 fallback: 主模型不可用时自动切换
- 成本优化: 简单查询用便宜模型,复杂查询用强模型

## Kong AI Gateway

**优势**: 企业级、插件生态、与现有 API 网关统一

- 基于 Kong 的成熟 API 网关基础设施
- 丰富的插件生态(限流、认证、日志)
- 适合已有 Kong 基础设施的企业

## 选型建议

| 场景 | 推荐方案 |
|------|---------|
| 个人/小团队 | LiteLLM (简单直接) |
| 中型团队 | Portkey (智能路由+缓存) |
| 大型企业 | Kong AI Gateway (企业级管控) |
| 已有 API 网关 | 在现有网关上加 LLM 插件 |

> **关联**: -> [[12_Architecture_Infrastructure/AI_Gateway|AI 网关]] | [[12_Architecture_Infrastructure/AI_Gateway/LiteLLM_Deep_Dive|LiteLLM]] | [[12_Architecture_Infrastructure/AI_Gateway/Portkey_Deep_Dive|Portkey]] | [[12_Architecture_Infrastructure/AI_Gateway/Kong_AI_Gateway_Deep_Dive|Kong]]

