---
title: "Linkerd"
category: -concepts
tags: ["kubernetes", "k8s", "service-mesh", "microservices", "traffic-management", "cloud-native", "alibaba-cloud"]
summary: "Linkerd 是 CNCF 毕业的服务网格项目，以极简、轻量和安全著称，采用 Rust 编写的 micro-proxy 作为数据面，适合对延迟敏感的场景。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
aliases:
  - "Linkerd2"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/istio"
    type: related_to
  - target: "概念/service-mesh"
    type: related_to
sources: []
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Linkerd

> **一句话理解**: Linkerd 是 Istio 的「轻量替代品」，安装简单、资源占用少，适合不想为服务网格付出过高复杂度的团队。

## 核心要点

- **极简架构**: 控制面只有几个组件，安装仅需一条命令。
- **Rust 代理**: 数据面 linkerd2-proxy 用 Rust 编写，内存占用低。
- **自动 mTLS**: 默认开启双向 TLS。
- **流量分割**: 支持金丝雀和蓝绿发布。
- **可靠性**: 重试、超时、熔断、负载均衡。

## 选型对比

| 特性 | Istio | Linkerd |
|------|-------|---------|
| 功能丰富度 | 极高 | 核心功能 |
| 资源占用 | 较高 | 低 |
| 学习曲线 | 陡峭 | 平缓 |
| 多集群 | 成熟 | 支持 |
| 数据面 | Envoy | linkerd2-proxy |

## 阿里云专有云关联

在阿里云专有云环境中，Linkerd 适合中小规模 ACK 集群的服务网格试点。工单中「Sidecar 资源占用高」时，可考虑从 Istio 迁移到 Linkerd 以降低成本。

## Related

- [[概念/istio|Istio]] — 功能更丰富的服务网格
- [[概念/service-mesh|Service Mesh]] — 服务网格概念
- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[概念/envoy|Envoy]] — Istio 数据面代理

---

## 2026 Linkerd 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 毕业** | 成熟稳定 | GA |
| **Rust 代理** | 低资源占用 | GA |
| **自动 mTLS** | 零配置安全 | GA |

## 生产最佳实践

1. **适用场景**：中小规模集群、资源敏感场景
2. **与 Istio 对比**：追求简单用 Linkerd，追求功能用 Istio
3. **资源监控**：关注 linkerd2-proxy 内存使用
4. **渐进式采用**：先注入部分服务，验证后扩大范围
