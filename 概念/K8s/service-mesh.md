---
title: "Service Mesh"
category: -concepts
tags: ["kubernetes", "k8s", "service-mesh", "microservices", "traffic-management", "cloud-native", "alibaba-cloud"]
summary: "Service Mesh（服务网格）是一种将服务间通信能力从应用中剥离出来的基础设施层，通过 Sidecar 代理统一实现流量管理、安全和可观测性。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
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
- [[概念/network-policy|NetworkPolicy]] — 网络策略

---

## 2026 服务网格生态

| 方案 | 特点 | 适用场景 |
|------|------|----------|
| **Istio** | 功能全面、生态丰富 | 企业级微服务 |
| **Linkerd** | 轻量、简单 | 中小规模 |
| **Ambient Mesh** | 无 Sidecar、低开销 | 资源敏感 |
| **eBPF** | 内核级、高性能 | 极致性能 |

## 核心能力矩阵

| 能力 | 说明 | 典型配置 |
|------|------|----------|
| **流量管理** | 负载均衡、熔断、重试、超时 | VirtualService/DestinationRule |
| **流量分割** | 金丝雀、蓝绿、A/B 测试 | 权重路由 |
| **安全通信** | 自动 mTLS、访问控制 | PeerAuthentication |
| **可观测性** | 指标、日志、追踪 | Prometheus/Jaeger |
| **服务发现** | 透明代理、DNS 拦截 | Sidecar 注入 |

## Sidecar vs Sidecar-less

| 维度 | Sidecar 模式 | Ambient Mesh | eBPF |
|------|------------|-------------|------|
| 资源开销 | 高（~100MB/Pod） | 低 | 极低 |
| 延迟增加 | 1-3ms | <1ms | <0.5ms |
| 功能完整性 | 完整 | 完整 | 有限 |
| 侵入性 | 需注入 | 无侵入 | 无侵入 |
| 成熟度 | 成熟 | 较新 | 发展中 |

## AI 推理场景应用

| 场景 | 网格能力 | 价值 |
|------|----------|------|
| **模型灰度发布** | 流量分割 | 新模型版本渐进式上线 |
| **推理服务熔断** | 熔断/重试 | 防止 GPU 服务雪崩 |
| **多模型路由** | Header 路由 | 按请求类型路由到不同模型 |
| **服务间 mTLS** | 自动加密 | 保护模型 API 通信安全 |
| **推理链路追踪** | 分布式追踪 | 定位端到端延迟瓶颈 |

## 选型决策树

```
是否需要服务网格？
├─ 微服务数量 > 10 → 是
├─ 需要 mTLS → 是
├─ 需要金丝雀发布 → 是
└─ 单体应用 → 否

选择哪个方案？
├─ 企业级、功能全面 → Istio
├─ 轻量、简单 → Linkerd
├─ 资源敏感 → Ambient Mesh
└─ 极致性能 → eBPF (Cilium)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Sidecar 资源高 | 默认配置过大 | 调整 CPU/内存 request/limit |
| 服务间调用失败 | mTLS 策略不一致 | 统一 PeerAuthentication |
| 延迟增加 | 代理开销 | 评估 Ambient Mesh |
| 配置不生效 | CRD 冲突 | 检查 VirtualService 优先级 |

## 生产最佳实践

1. **选型匹配**：根据规模和复杂度选择合适方案
2. **渐进式采用**：先可观测性，再流量管理，最后安全
3. **资源规划**：Sidecar 模式需额外资源开销
4. **监控告警**：关注 Sidecar 资源使用、配置同步状态
5. **性能基线**：部署前测量延迟基线，评估网格开销

## 相关概念

- [[概念/istio|Istio]] — 主流服务网格实现
- [[概念/linkerd|Linkerd]] — 轻量服务网格实现
- [[概念/envoy|Envoy]] — 数据面代理

## 部署检查清单

| 检查项 | 说明 |
|--------|------|
| Sidecar 注入 | 确认命名空间已启用注入 |
| mTLS 策略 | 统一 PeerAuthentication |
| 资源限制 | 设置 Sidecar CPU/内存 |
| 可观测性 | 启用指标/日志/追踪 |
| 性能基线 | 部署前测量延迟基线 |

## 总结

服务网格是微服务架构的「基础设施层」，将服务间通信能力从应用中剥离出来。在 AI 推理场景中主要用于模型灰度发布、服务熔断和链路追踪。根据规模和复杂度选择 Istio、Linkerd 或 Ambient Mesh。

---

> 💡 服务网格是微服务架构的「基础设施层」，在 AI 推理场景中主要用于模型灰度发布、服务熔断和链路追踪。

## 版本兼容性

| 组件 | 版本 | K8s 兼容 | 状态 |
|------|------|---------|------|
| Istio | 1.24+ | 1.29+ | 稳定 |
| Linkerd | 2.16+ | 1.28+ | 稳定 |
| Envoy | 1.32+ | - | 稳定 |
| Cilium Mesh | 1.16+ | 1.29+ | 稳定 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `istioctl proxy-status` | 查看 Sidecar 同步状态 |
| `istioctl analyze` | 分析配置问题 |
| `linkerd check` | 检查 Linkerd 健康状态 |
| `linkerd viz dashboard` | 打开可视化面板 |
| `kubectl get virtualservices` | 查看流量规则 |

## 生产检查清单

1. **渐进式接入**：先接入非关键服务，验证后再扩展
2. **资源规划**：Sidecar 每 Pod 额外占用 100-200m CPU、128-256Mi 内存
3. **mTLS 全局启用**：使用 STRICT 模式确保服务间加密
4. **超时配置**：设置合理的请求超时避免级联故障
5. **可观测性先行**：先启用指标/追踪，再配置流量策略

## AI 推理场景应用

| 场景 | 网格能力 | 配置示例 |
|------|----------|----------|
| 模型灰度发布 | 流量拆分 | VirtualService weight 90/10 |
| 推理服务熔断 | 异常点检测 | DestinationRule outlierDetection |
| 多模型路由 | Header 路由 | match headers model-version |
| 链路追踪 | 分布式 Trace | 自动注入 trace header |
| mTLS 加密 | 服务间安全 | PeerAuthentication STRICT |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Sidecar 注入失败 | Namespace 未标记 | `kubectl label ns <ns> istio-injection=enabled` |
| 服务不可达 | mTLS 不匹配 | 统一 PeerAuthentication 策略 |
| 延迟增加 | Sidecar 开销 | 调整 concurrency 和资源限制 |
| 配置不生效 | xDS 同步延迟 | `istioctl proxy-status` 检查 |
