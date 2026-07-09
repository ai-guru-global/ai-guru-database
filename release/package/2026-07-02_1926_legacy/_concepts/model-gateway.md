---
title: 模型网关 (Model Gateway / AI Gateway)
category: -concepts
tags: [model-gateway, ai-gateway, load-balancing, routing, api-management, synapse]
relationships:
  - target: "_concepts/llm-infrastructure"
    type: related_to
  - target: "_concepts/model-deployment"
    type: related_to
  - target: "_concepts/model-serving"
    type: builds_on
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 架构基建/AI_Gateway/AI_Gateway_2026
summary: 模型网关是 LLM 服务的统一入口层，负责流量路由、负载均衡、API-Key 鉴权、模型版本管理与可观测性。
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: stable
tier: core
created: 2026-06-12
aliases:
  - "Model Gateway"
  - "model gateway"

---
# 模型网关 (Model Gateway)

## 1. 定义

**模型网关**（Model Gateway / AI Gateway）是位于客户端与后端推理引擎之间的**统一流量管理层**，提供路由、鉴权、限流、可观测等 API 网关能力，同时针对 LLM 推理场景做了专门优化（如 token 级计量、流式响应代理、多模型版本灰度）。

> 在 AI Stack 中，该组件称为 **Synapse 网关**；在开源领域，代表性项目包括 LiteLLM、Portkey、Kong AI Gateway 等。

---

## 2. 核心能力矩阵

| 能力域 | 功能 | 说明 |
|--------|------|------|
| **路由与负载均衡** | 多模型路由、权重分流 | 按模型名/版本/负载比例分发请求 |
| **鉴权与访问控制** | API-Key 管理、RBAC | 多租户隔离，按组织/用户粒度控权 |
| **流量治理** | 限流、熔断、重试 | Token 级 & Request 级双重限流 |
| **可观测性** | Metrics、Logging、Tracing | 首 token 延迟（TTFT）、吞吐、错误率 |
| **成本管控** | Token 计量、配额 | 按组织/项目维度统计 token 消耗 |
| **协议适配** | OpenAI API 兼容 | 统一接口屏蔽后端差异（vLLM/TGI/TRT-LLM） |
| **安全合规** | 内容审核、PII 过滤 | 请求/响应双向内容安全检查 |

---

## 3. 架构分层

```
┌─────────────────────────────────────────┐
│              Client Apps                │
│  (OpenAI SDK / LangChain / 自研应用)     │
└─────────────────┬───────────────────────┘
                  │ HTTPS / gRPC
┌─────────────────▼───────────────────────┐
│          Model Gateway Layer             │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Auth/ACL │ │  Router  │ │ Rate    │ │
│  │ 鉴权层   │ │ 路由引擎  │ │ Limiter │ │
│  └──────────┘ └──────────┘ └─────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Observa- │ │ Content  │ │ Token   │ │
│  │ bility   │ │ Filter   │ │ Meter   │ │
│  └──────────┘ └──────────┘ └─────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Backend Inference Engines          │
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │vLLM  │  │SGLang│  │TRT-LLM│         │
│  └──────┘  └──────┘  └──────┘          │
└─────────────────────────────────────────┘
```

---

## 4. 主流方案对比

| 维度 | LiteLLM | Portkey | Kong AI Gateway | Synapse (AI Stack) |
|------|---------|---------|-----------------|-------------------|
| **开源** | 是 (MIT) | 部分开源 | 是 (Apache 2.0) | 否（商业） |
| **OpenAI 兼容** | 完整 | 完整 | 完整 | 完整 |
| **多模型路由** | 100+ Provider | 多 Provider | 插件化 | 与 AI Stack 深度集成 |
| **Fallback** | 自动故障转移 | 自动 | 健康检查 | 模型级 Fallback |
| **Token 计量** | 内置 | 内置 | 插件 | 内置 |
| **部署形态** | Python Proxy | SaaS/Self-host | Gateway 服务 | 与 AI Stack 一体机集成 |

---

## 5. 路由策略

| 策略 | 适用场景 | 说明 |
|------|----------|------|
| **轮询 (Round Robin)** | 同构多副本 | 请求均匀分配到各副本 |
| **加权分流** | A/B 测试、灰度 | 按比例（如 80/20）分流到不同模型版本 |
| **延迟感知** | 异构后端 | 优先路由到低延迟节点 |
| **优先级队列** | 多租户 | VIP 租户请求优先处理 |
| **Fallback 链** | 高可用 | 主模型不可用时自动切换到备用模型 |

---

## 6. 关键指标

| 指标 | 含义 | 目标值 |
|------|------|--------|
| **TTFT** (Time To First Token) | 首 token 延迟 | < 200ms |
| **TPS** (Tokens Per Second) | 生成吞吐 | 取决于后端模型 |
| **网关附加延迟** | Gateway 自身开销 | < 5ms (P99) |
| **可用性** | 服务可用率 | 99.95%+ |
| **限流精度** | Token 级计量误差 | < 2% |

---

## 7. 最佳实践

1. **统一 API 契约**: 使用 OpenAI 兼容接口，后端引擎可无感切换
2. **Token 级限流**: 比 Request 级更精细，防止长上下文请求耗尽配额
3. **灰度发布**: 新模型版本先承接 5-10% 流量，验证指标后全量切换
4. **Fallback 策略**: 配置主→备模型链，主模型超时/报错时自动降级
5. **内容安全前置**: 在网关层做 PII 脱敏 & 合规审核，减轻后端负担
6. **可观测性三件套**: Metrics（Prometheus）+ Logging（ELK）+ Tracing（OpenTelemetry）

---

## 8. AI Stack Synapse 网关特色

| 特性 | 说明 |
|------|------|
| **开箱即用** | 与 AI Stack 一体机预集成，无需额外部署 |
| **模型管理** | 多模型版本管理、一键部署/回滚 |
| **生态集成** | 与百炼平台 API-Key 互通 |
| **安全架构** | 内置内容审核 + 网络隔离 + 数据加密 |
| **弹性扩展** | 多机集群模式下统一流量入口 |

---

## Related

- [[架构基建/AI_Gateway/AI_Gateway_2026]] — AI Gateway 全景
- [[架构基建/AI_Gateway/LiteLLM_Deep_Dive]] — LiteLLM 深度解析
- [[架构基建/AI_Gateway/Kong_AI_Gateway_Deep_Dive]] — Kong AI Gateway
- [[架构基建/AI_Gateway/Portkey_Deep_Dive]] — Portkey 深度解析
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
- [[_concepts/llm-infrastructure]] — LLM 基础设施
- [[_concepts/model-serving]] — 模型服务
- [[架构基建/Alibaba_Cloud_AI_Stack_Deep_Dive|阿里云 AI Stack]] — 专有云推理平台的模型网关实现
