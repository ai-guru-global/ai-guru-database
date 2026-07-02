---
title: "Envoy"
category: -concepts
tags: ["kubernetes", "k8s", "service-mesh", "proxy", "load-balancer", "cloud-native", "alibaba-cloud"]
summary: "Envoy 是 Lyft 开源的高性能边缘和服务代理，被 Istio、Contour、AWS App Mesh 等服务网格采用为数据面代理。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Envoy Proxy"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/istio"
    type: used_by
  - target: "_concepts/service-mesh"
    type: used_by
sources: []
---

# Envoy

> **一句话理解**: Envoy 是云原生时代最常用的「智能流量代理」，能作为 Ingress、Sidecar、负载均衡器，提供动态路由、限流、熔断、可观测能力。

## 核心要点

- **C++ 高性能代理**: 低延迟、高并发，支持热重启。
- **动态配置**: 通过 xDS API（LDS/RDS/CDS/EDS/SDS）动态接收控制面下发的配置。
- **多协议支持**: HTTP/1.1、HTTP/2、gRPC、TCP、UDP、Dubbo。
- **丰富的过滤器**: JWT 验证、速率限制、WAF、压缩、缓存。
- **可观测性**: 原生支持 Prometheus 指标、访问日志、分布式追踪。

## 典型角色

| 角色 | 场景 |
|------|------|
| **Sidecar** | Istio / Consul Connect 服务网格 |
| **Ingress Gateway** | 南北向流量入口 |
| **API Gateway** | 路由、鉴权、限流 |
| **负载均衡器** | 替代 Nginx/HAProxy |

## 阿里云专有云关联

在阿里云专有云环境中，Envoy 作为 Istio 数据面运行在业务 Pod 中，是微服务流量治理的核心。工单中「Sidecar 资源占用高」或「Envoy 配置未同步」时，需要检查 istiod 与 Envoy Sidecar 之间的 xDS 连接状态。

## Related

- [[_concepts/istio|Istio]] — 使用 Envoy 作为数据面的服务网格
- [[_concepts/linkerd|Linkerd]] — 使用自研代理的服务网格
- [[_concepts/service-mesh|Service Mesh]] — 服务网格概念
- [[_concepts/kubernetes|Kubernetes]] — 容器编排
