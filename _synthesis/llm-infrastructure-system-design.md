---
title: "LLM 基础设施 × 传统系统架构 — 从 Web 服务到 Token 工厂"
category: -synthesis
tags: [llm-infrastructure, ai-infrastructure, system-design, gpu, serving, architecture]
sources:
  - "[[_concepts/llm-infrastructure]]"
  - "[[12_Architecture_Infrastructure/AI_Infrastructure_2026]]"
  - "[[12_Architecture_Infrastructure/AI_System_Architecture_2026]]"
  - "[[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]]"
created: 2026-06-05
updated: 2026-06-05
summary: "传统系统架构（微服务、负载均衡、数据库）的哪些经验能迁移到 LLM 基础设施，哪些需要彻底重写？从 Web 服务架构师到 AI 基础设施工程师的认知迁移指南。"
provenance:
  extracted: 0.2
  inferred: 0.7
  ambiguous: 0.1
lifecycle: draft
lifecycle_changed: 2026-06-05
---

# LLM 基础设施 × 传统系统架构 — 从 Web 服务到 Token 工厂

## The Connection

LLM 基础设施不是从零发明的——它大量借鉴了传统 Web 服务架构（API Gateway、负载均衡、缓存、监控），但又有几个**根本性差异**使得直接套用 Web 架构会踩坑。理解哪些经验能迁移、哪些需要重写，是从系统架构师转型 AI 基础设施工程师的关键。

## Where They Co-occur

- **AI Gateway**：传统 API Gateway（Kong、Envoy）的 LLM 适配版——路由、限流、鉴权、token 计费
- **推理服务化**：vLLM/TGI 的 deployment 模式复用 Kubernetes 的 Service/Deployment/HPA 概念
- **KV Cache 管理**：类似传统数据库的 buffer pool，但数据是 attention key-value tensor
- **多租户隔离**：从 VM/Container 隔离到 GPU 算力隔离（MIG、MPS、vGPU）
- **可观测性**：从 APM（延迟、吞吐、错误率）到 LLM Ops（token 延迟、TTFT、幻觉率）

## Cross-cutting Insight

传统架构和 LLM 基础设施的核心差异可以归结为**三个范式转换**：

### 1. 从请求-响应到流式推理
传统 Web 服务：请求 → 处理 → 响应（毫秒级，确定性）。LLM 推理：请求 → Prefill → 逐 token Decode（秒级，流式输出）。这改变了负载均衡（不能简单 round-robin，需要感知 GPU 显存和 KV cache 占用）和超时策略（不能用固定 timeout，需要 token 级进度检测）。

### 2. 从水平扩展到 GPU 拓扑感知
传统服务：加更多 Pod 即可。LLM 服务：需要考虑 GPU 拓扑（NVLink 连接、PCIe 带宽）、张量并行的设备亲和性、跨节点推理的通信开销。这催生了"拓扑感知调度"——不是把请求发到任意 GPU，而是发到与模型分片匹配的 GPU 组。

### 3. 从无状态到有状态推理
传统 Web 服务：天然无状态，水平扩展简单。LLM 推理：KV cache 是有状态的，迁移代价高（PagedAttention 的 block 不能跨实例共享）。这导致传统 sticky session 策略不够——需要 cache-aware routing（将续写请求路由到同一实例以复用 KV cache）。

## Tensions and Trade-offs

| 张力 | 传统做法 | LLM 做法 | 折中 |
|------|---------|---------|------|
| 扩展策略 | HPA (CPU/Memory) | GPU 利用率 + KV cache 占用率 | 自定义 metrics + KEDA |
| 缓存层 | Redis/Memcached | Prefix caching (PagedAttention) | 分层：Redis 存 prompt cache，GPU 存 KV cache |
| 服务发现 | Consul/Eureka | 静态 GPU 拓扑 + 动态负载 | 拓扑感知的 service mesh |
| 数据库 | PostgreSQL/MySQL | 向量数据库 (Milvus/Qdrant) | 混合：关系数据用 PG，向量用专用 DB |
| 监控 | Prometheus + Grafana | Prometheus + OpenTelemetry LLM 语义 | 统一观测面，区分传统和 LLM 指标 |

## Open Questions

- Serverless LLM 推理（如 Modal、Replicate）是否会替代自建 GPU 集群，像 AWS Lambda 替代自建服务器一样
- 如何将传统微服务的 circuit breaker 模式应用于 LLM 调用链——当上游 LLM 超时，是否应该降级到更小的模型
- LLM 推理的"冷启动"问题（模型加载到 GPU 需要分钟级）是否可以通过 checkpoint streaming 解决

## Related

- [[_concepts/llm-infrastructure]] — LLM 基础设施概念
- [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] — AI 基础设施 2026
- [[12_Architecture_Infrastructure/AI_System_Architecture_2026]] — AI 系统架构
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI 技术栈深度解读
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive]] — vLLM 推理引擎
- [[14_AI_Gateway/AI_Gateway_2026]] — AI Gateway 2026
- [[_synthesis/serving-deployment]] — 服务化 × 部署
