---
title: "Service Mesh"
category: -concepts
tags: ["kubernetes", "k8s", "service-mesh", "microservices", "traffic-management", "cloud-native", "alibaba-cloud"]
summary: "Service Mesh（服务网格）是一种将服务间通信能力从应用中剥离出来的基础设施层，通过 Sidecar 代理统一实现流量管理、安全和可观测性。"
created: 2026-06-26
updated: 2026-06-26
tier: archived
aliases:
  - "服务网格"
  - "Microservices Mesh"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/istio"
    type: implemented_by
  - target: "概念/linkerd"
    type: implemented_by
sources: []
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Service Mesh

> **一句话理解**: 服务网格把微服务之间「怎么连接、怎么保护、怎么看」的问题从业务代码里抽出来，交给一个专门的代理层处理。

## 核心要点

- **Sidecar 模式**: 每个 Pod 注入代理容器，拦截所有进出流量。
- **流量管理**: 负载均衡、熔断、重试、超时、金丝雀、A/B 测试。
- **安全通信**: 自动 mTLS、访问控制、认证授权。
- **可观测性**: 统一指标、日志、链路追踪。
- **Sidecar-less 趋势**: Ambient Mesh、eBPF 方案减少 Sidecar 开销。

## 典型架构

```text
App A Pod [App + Envoy Sidecar]  ←mTLS→  App B Pod [App + Envoy Sidecar]
                ↑
        Istio Control Plane (istiod)
```

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，服务网格可用于微服务间的东西向流量治理，常与洛神网络、神龙 X-Dragon 配合。工单中「跨服务调用延迟高」或「服务间认证失败」时，服务网格的 mTLS 策略和 VirtualService 是重点排查对象。

## Related

- [[概念/istio|Istio]] — 主流服务网格实现
- [[概念/linkerd|Linkerd]] — 轻量服务网格实现
- [[概念/envoy|Envoy]] — 数据面代理
- [[概念/kubernetes|Kubernetes]] — 容器编排
