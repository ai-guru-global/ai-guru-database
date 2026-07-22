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

## 架构组件

| 组件 | 职责 |
|------|------|
| **linkerd-destination** | 服务发现和路由信息 |
| **linkerd-identity** | 证书管理和 mTLS |
| **linkerd-proxy-injector** | 自动注入 Sidecar |
| **linkerd2-proxy** | Rust 数据面代理 |
| **linkerd-viz** | 可观测性扩展 |

## 安装与注入

```bash
# 安装控制面
linkerd install | kubectl apply -f -

# 检查安装状态
linkerd check

# 注入 Sidecar（命名空间级）
kubectl annotate namespace ai-inference linkerd.io/inject=enabled

# 注入 Sidecar（工作负载级）
kubectl patch deployment inference-svc -p '{"spec":{"template":{"metadata":{"annotations":{"linkerd.io/inject":"enabled"}}}}}'
```

## 流量管理配置

```yaml
# 流量分割（金丝雀发布）
apiVersion: split.smi-spec.io/v1alpha2
kind: TrafficSplit
metadata:
  name: model-canary
spec:
  service: inference-svc
  backends:
    - service: inference-v1
      weight: 900m
    - service: inference-v2
      weight: 100m
---
# 重试策略
apiVersion: policy.linkerd.io/v1beta1
kind: HTTPRoute
metadata:
  name: inference-route
spec:
  parentRefs:
    - name: inference-svc
      kind: Service
      group: ""
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /predict
      filters:
        - type: RequestRedirect
          requestRedirect:
            statusCode: 307
      timeouts:
        request: 30s
```

## Linkerd vs Istio 详细对比

| 维度 | Linkerd | Istio |
|------|---------|-------|
| 数据面 | linkerd2-proxy (Rust) | Envoy (C++) |
| 内存占用 | ~50MB/Pod | ~100MB/Pod |
| 安装复杂度 | 一条命令 | Helm 多组件 |
| 多集群 | 支持 | 成熟 |
| 扩展性 | 有限 | Wasm/EnvoyFilter |
| 协议支持 | HTTP/gRPC/TCP | HTTP/gRPC/TCP/Dubbo |
| 社区规模 | 中等 | 极大 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Sidecar 未注入 | 缺少 annotation | 检查命名空间/工作负载注解 |
| mTLS 失败 | 证书过期 | 检查 linkerd-identity 组件 |
| 延迟增加 | 代理开销 | 调整 proxy 资源配置 |
| 连接超时 | 上游服务慢 | 配置合理的 timeout |

## 生产最佳实践

1. **适用场景**：中小规模集群、资源敏感场景
2. **与 Istio 对比**：追求简单用 Linkerd，追求功能用 Istio
3. **资源监控**：关注 linkerd2-proxy 内存使用
4. **渐进式采用**：先注入部分服务，验证后扩大范围
5. **可观测性**：启用 linkerd-viz 获取服务拓扑和指标

## 可观测性

```bash
# 安装 Viz 扩展
linkerd viz install | kubectl apply -f -

# 查看服务拓扑
linkerd viz -n ai-inference stat deploy

# 查看实时指标
linkerd viz -n ai-inference top deploy/inference-svc

# 查看路由详情
linkerd viz -n ai-inference routes deploy/inference-svc

# 查看边缘服务
linkerd viz -n ai-inference edges
```

## 资源调优

| 参数 | 默认值 | 建议值 | 说明 |
|------|--------|--------|------|
| proxy CPU request | 100m | 50m | 低流量场景 |
| proxy Memory request | 20Mi | 10Mi | 低流量场景 |
| proxy CPU limit | 1 | 500m | 避免资源争抢 |
| proxy Memory limit | 250Mi | 100Mi | 根据流量调整 |

## 相关概念

- [[概念/istio|Istio]] — 功能更丰富的服务网格
- [[概念/service-mesh|Service Mesh]] — 服务网格概念
- [[概念/envoy|Envoy]] — Istio 数据面代理

## 总结

Linkerd 是「够用就好」的服务网格选择，以极简、轻量和安全著称。特别适合不想承担 Istio 复杂度的团队，提供自动 mTLS、流量分割和可观测性。

---

> 💡 Linkerd 是「够用就好」的服务网格选择，特别适合不想承担 Istio 复杂度的团队。
