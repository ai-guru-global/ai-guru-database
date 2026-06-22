---
title: AI 系统架构
category: -concepts
tags:
- - - transformer-architecture
- kubernetes
- microservices
- high-availability
- multi-tenant
relationships:
- target: '_concepts/llm-infrastructure'
  type: related_to
- target: '_concepts/mlops'
  type: related_to
- target: '_concepts/rag-systems'
  type: related_to
sources:
- 12_Architecture_Infrastructure/AI_System_Architecture_2026.md
- 12_Architecture_llm-infrastructure/Spring_AI_Architecture.md
- 12_Architecture_Infrastructure/High_Availability_2026.md
- 12_Architecture_Infrastructure/Multi_Tenant_Architecture.md
summary: AI系统架构是智能应用的骨架与神经系统，采用四层模型（应用层→服务层→数据层→基础设施层），需兼顾解耦、可扩展、高可用、可观测和安全五大设计原则。
provenance:
  extracted: 0.78
  inferred: 0.15
  ambiguous: 0.07
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31 00:00:00+00:00
updated: 2026-05-31 00:00:00+00:00
---

# AI 系统架构

## 核心要点

AI系统架构采用四层模型：L4应用层（Web/移动端/API接入）→ L3服务层（LLM/Agent/RAG/向量服务）→ L2数据层（向量数据库/关系数据库/对象存储/消息队列/缓存）→ L1基础设施层（Kubernetes/GPU集群/网络/存储/安全）。

设计原则：解耦（各层独立变化）、可扩展（无状态服务水平扩展）、高可用（多副本故障转移）、可观测（全链路监控）、安全（纵深防御）。

AI系统架构的特殊性在于：GPU资源昂贵需要精细调度、模型加载慢需要预热、推理状态（KV Cache/对话历史）管理复杂、Token消耗决定成本结构。

## 详细内容

### 服务层核心组件

LLM服务：统一ChatModel/EmbeddingModel抽象，支持多供应商Fallback（Primary→Secondary→Local→Cache→Static）。提供同步完成、流式响应和批量处理三种模式。

Agent服务：请求接收→任务解析→规划器→执行器→工具调用→结果处理→生成响应的闭环流程。记忆系统分为短期记忆（Redis）和长期记忆（Vector DB）。

RAG服务：查询改写→向量检索+关键词检索→RRF融合→Cross-Encoder重排序→上下文构建→LLM生成的完整automl。

### Spring AI 企业级架构

Spring AI在AI架构中扮演LLM统一抽象层、RAG编排引擎、Agent运行时和企业集成桥梁四个角色。核心抽象：ChatClient（高层API）→ Model API（中层）→ VectorStore（存储抽象）。

Advisor模式是Spring AI的中间件机制，类似Servlet Filter，支持Chat Memory（注入对话历史）、RAG（检索增强文档）、Rate Limiting（限流控制）、Logging（请求日志）等横切关注点的链式处理。

微服务架构采用Spring Cloud Gateway作为API网关，通过Nacos/Eureka做服务发现，支持同步REST（OpenFeign）、异步消息（Kafka）、流式SSE（WebFlux）和gRPC四种服务间通信方式。^[inferred]

### 可观测性三支柱

日志（Fluentd/Vector→Loki）、指标（Prometheus→Grafana）、追踪（OpenTelemetry→Jaeger）构成可观测性基础。关键指标包括LLM请求延迟（P50/P95/P99）、Token消耗量、错误率、GPU利用率和队列深度。

### 安全架构

四层安全设计：网络安全（防火墙+WAF+DDoS防护）、访问控制（IAM+RBAC+MFA）、数据安全（TLS 1.3传输加密+AES-256存储加密+DLP防泄漏）、应用安全（输入验证+输出过滤+审计日志）。

### 高可用设计

AI系统高可用的特殊挑战：GPU故障率比CPU高一个数量级（MTBF约10K小时）、模型加载需要30s-5min、KV Cache和Agent状态管理复杂、GPU冗余成本高昂。

多可用区部署是高可用的基础：API服务≥3副本跨AZ分布、LLM推理服务≥2副本、数据库主从复制、Redis Sentinel高可用。K8s配置需设置Pod反亲和性（确保跨AZ分布）、PodDisruptionBudget（最小可用数）和三级健康检查（startup/readiness/liveness）。

故障恢复策略：GPU硬件故障（自动驱逐+新Pod调度，3-5分钟）、服务卡死（健康检查超时Kill+重启，30-60秒）、AZ级故障（DNS/LB切换+存活AZ扩容）、上游API故障（熔断+备用供应商）。^[ambiguous]

### 多租户架构

隔离模型从低到高：共享一切（成本低隔离弱）→ Schema隔离（独立Schema共享服务）→ 数据库隔离（独立DB共享服务）→ 实例隔离（独立部署共享网络）。AI系统的多租户还需考虑GPU资源隔离（ai-hardware MIG时间分片）、向量数据库命名空间隔离、Token配额和计费计量。

租户上下文通过ThreadLocal管理，所有数据查询强制注入租户过滤条件。K8s层通过Namespace+ResourceQuota+NetworkPolicy实现资源隔离和网络隔离。

### 扩展性设计

水平扩展策略：推理请求路由到GPU节点池（HPA自动扩缩，基于GPU利用率）、计算请求路由到CPU节点池、向量查询路由到向量节点池。数据分片采用一致性哈希（缓存）、范围分片（关系数据库）和哈希分片（向量数据库）。

### 容灾架构

跨区域容灾策略：Active-Passive（RPO分钟级，RTO 5-15分钟，成本1.3x）、Active-Active（RPO接近0，RTO <1分钟，成本2x）。容灾切换自动化：健康检测→连续失败达阈值→DNS权重切换→DR数据库提升为主库→DR区域推理服务扩容→告警通知。

## 开放问题

- AI系统架构标准化程度不足，缺乏类似十二要素应用的共识框架
- Agent状态管理（长期运行的有状态工作流）的架构模式仍在演进 ^[ambiguous]
- model-deployment GPU的冷启动问题限制了弹性扩缩容的效率
- 多租户场景下GPU资源隔离的性价比优化空间

## 来源

- 12_Architecture_Infrastructure/AI_System_Architecture_2026.md — 四层架构全景图、服务设计、可观测性
- 12_Architecture_Infrastructure/Spring_AI_Architecture.md — Spring AI企业级架构、Advisor模式
- 12_Architecture_Infrastructure/High_Availability_2026.md — 多AZ部署、故障恢复、健康检查
- 12_Architecture_Infrastructure/Multi_Tenant_Architecture.md — 隔离模型、资源管理、计费计量

## Related

- [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] — AI Infrastructure 2026 完全指南 (共享: high-availability, kubernetes)
- [[12_Architecture_Infrastructure/Architecture-in-nutshell]] — AI 架构速成指南 (共享: high-availability, kubernetes)
- [[12_Architecture_Infrastructure/Architecture_Infrastructure_for_dummy]] — AI 架构基础设施 - 小白版 (共享: high-availability, kubernetes)
- [[12_Architecture_Infrastructure/Spring_AI_Architecture]] — Spring AI 系统架构设计 (共享: high-availability, kubernetes)
