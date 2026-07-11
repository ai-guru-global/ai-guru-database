---
title: "Istio"
category: -concepts
tags: ["kubernetes", "k8s", "service-mesh", "microservices", "traffic-management", "cloud-native", "alibaba-cloud"]
summary: "Istio 是目前最流行的开源服务网格之一，通过 Sidecar Proxy 为微服务提供流量管理、安全通信和可观测性，无需修改应用代码。"
created: 2026-06-26
updated: 2026-06-26
tier: archived
aliases:
  - "Istio Service Mesh"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/service"
    type: related_to
  - target: "概念/service-mesh"
    type: related_to
sources: []
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Istio

> **一句话理解**: Istio 是在 K8s 里给微服务之间加了一层「智能代理」，自动做负载均衡、加密、限流、熔断和链路追踪。

## 核心要点

- **Sidecar 模式**: 每个 Pod 注入 Envoy Proxy，拦截进出流量。
- **流量管理**: 虚拟服务（VirtualService）、目标规则（DestinationRule）、网关（Gateway）、服务入口（ServiceEntry）。
- **安全**: 自动 mTLS、鉴权策略（AuthorizationPolicy）、认证策略（PeerAuthentication）。
- **可观测性**: 自动生成指标、访问日志、分布式追踪。
- **多集群**: 支持单控制面、多控制面、外部控制面等部署模式。

## 核心 CRD

| CRD | 作用 |
|-----|------|
| `VirtualService` | 定义路由规则（权重、超时、重试） |
| `DestinationRule` | 定义后端策略（负载均衡、连接池、TLS） |
| `Gateway` | 定义入口网关 |
| `ServiceEntry` | 注册外部服务 |
| `AuthorizationPolicy` | 访问控制 |
| `PeerAuthentication` | mTLS 策略 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，Istio 常与神龙 X-Dragon 网络、洛神 SLB 配合实现微服务南北/东西向流量治理。工单中「服务间调用失败」或「金丝雀流量比例不对」时，检查 Envoy Sidecar 是否注入、VirtualService 路由、以及 AuthorizationPolicy 是否放行。

## Related

- [[概念/linkerd|Linkerd]] — 轻量服务网格
- [[概念/envoy|Envoy]] — 数据面代理
- [[概念/service|Service]] — K8s 服务发现
- [[概念/kubernetes|Kubernetes]] — 容器编排
