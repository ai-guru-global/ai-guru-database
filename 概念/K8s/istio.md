---
title: "Istio"
category: -concepts
tags: ["kubernetes", "k8s", "service-mesh", "microservices", "traffic-management", "cloud-native", "alibaba-cloud"]
summary: "Istio 是目前最流行的开源服务网格之一，通过 Sidecar Proxy 为微服务提供流量管理、安全通信和可观测性，无需修改应用代码。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
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
- [[概念/service-mesh|Service Mesh]] — 服务网格概念

---

## 2026 Istio 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **Ambient Mesh** | 无 Sidecar 模式 | GA |
| **多集群** | 跨集群流量管理 | GA |
| **Wasm 扩展** | 自定义过滤器 | GA |

## 架构组件

| 组件 | 职责 |
|------|------|
| **istiod** | 控制面（合并了 Pilot/Citadel/Galley） |
| **Envoy Sidecar** | 数据面代理，拦截 Pod 流量 |
| **istio-ingressgateway** | 南北向入口网关 |
| **istio-egressgateway** | 出站流量网关 |
| **ztunnel** | Ambient Mesh 零信任隧道 |

## 配置示例

```yaml
# 金丝雀发布 - VirtualService
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: inference-vs
spec:
  hosts:
    - inference-svc
  http:
    - match:
        - headers:
            x-canary:
              exact: "true"
      route:
        - destination:
            host: inference-svc
            subset: v2
    - route:
        - destination:
            host: inference-svc
            subset: v1
          weight: 90
        - destination:
            host: inference-svc
            subset: v2
          weight: 10
---
# DestinationRule
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: inference-dr
spec:
  host: inference-svc
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
  trafficPolicy:
    connectionPool:
      http:
        h2UpgradePolicy: UPGRADE
    outlierDetection:
      consecutive5xxErrors: 3
      interval: 10s
      baseEjectionTime: 30s
```

## Ambient Mesh 模式

| 维度 | Sidecar 模式 | Ambient 模式 |
|------|------------|------------|
| 资源开销 | ~100MB/Pod | ~10MB/Pod |
| 延迟 | +1-3ms | +<1ms |
| 升级影响 | 需重启 Pod | 无感知 |
| 功能 | 完整 | 完整 |
| 状态 | 成熟 | GA (1.22+) |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Sidecar 未注入 | 缺少 label/annotation | 检查 `istio-injection=enabled` |
| 503 错误 | 上游未就绪 | 配置 `holdApplicationUntilProxyStarts` |
| mTLS 失败 | 策略不一致 | 统一 PeerAuthentication |
| 配置不生效 | CRD 冲突 | 检查 VirtualService 优先级 |
| 内存占用高 | 连接数过多 | 调整 Sidecar 资源限制 |

## 生产最佳实践

1. **Sidecar 资源**：设置合理的 CPU/内存请求和限制
2. **mTLS 策略**：生产环境启用严格 mTLS
3. **流量管理**：使用 VirtualService 实现金丝雀发布
4. **可观测性**：启用指标、日志、追踪三位一体
5. **升级策略**：评估 Ambient Mesh 降低 Sidecar 开销

## 常用命令

```bash
# 检查 Sidecar 注入状态
kubectl get pods -n ai-inference -o jsonpath='{.items[*].spec.containers[*].name}'

# 查看 Envoy 配置
istioctl proxy-config routes <pod-name> -n ai-inference

# 检查 mTLS 状态
istioctl authn tls-check <pod-name>.ai-inference.svc.cluster.local

# 分析配置问题
istioctl analyze -n ai-inference

# 查看 Sidecar 日志
kubectl logs <pod-name> -c istio-proxy -n ai-inference
```

## 资源调优

| 参数 | 默认值 | 建议值 | 说明 |
|------|--------|--------|------|
| proxy CPU request | 100m | 50m | 低流量场景 |
| proxy Memory request | 128Mi | 64Mi | 低流量场景 |
| proxy CPU limit | 2 | 1 | 避免资源争抢 |
| proxy Memory limit | 1Gi | 256Mi | 根据流量调整 |

## 相关概念

- [[概念/linkerd|Linkerd]] — 轻量服务网格
- [[概念/envoy|Envoy]] — 数据面代理
- [[概念/service-mesh|Service Mesh]] — 服务网格概念

## 总结

Istio 是功能最全面的服务网格，提供流量管理、安全通信和可观测性。在 AI 推理场景中用于模型灰度发布、服务熔断和流量治理。评估 Ambient Mesh 可降低 Sidecar 开销。

---

> 💡 Istio 是功能最全面的服务网格，在 AI 推理场景中用于模型灰度发布、服务熔断和流量治理。
