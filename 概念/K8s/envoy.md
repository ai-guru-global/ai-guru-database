---
title: "Envoy"
category: -concepts
tags: ["kubernetes", "k8s", "service-mesh", "proxy", "load-balancer", "cloud-native", "alibaba-cloud"]
summary: "Envoy 是 Lyft 开源的高性能边缘和服务代理，被 Istio、Contour、AWS App Mesh 等服务网格采用为数据面代理。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
aliases:
  - "Envoy Proxy"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/istio"
    type: used_by
  - target: "概念/service-mesh"
    type: used_by
sources: []
name_zh: "Envoy 服务代理"
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Envoy

> 中文简称：Envoy 服务代理

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

- [[概念/istio|Istio]] — 使用 Envoy 作为数据面的服务网格
- [[概念/linkerd|Linkerd]] — 使用自研代理的服务网格
- [[概念/service-mesh|Service Mesh]] — 服务网格概念
- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[概念/ingress|Ingress]] — 入口流量管理

---

## 2026 Envoy 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **xDS API** | 动态配置下发 | GA |
| **Wasm 扩展** | 自定义过滤器 | GA |
| **gRPC 原生** | HTTP/2、gRPC 支持 | GA |

## xDS API 体系

| API | 全称 | 作用 |
|-----|------|------|
| **LDS** | Listener Discovery | 动态下发监听器配置 |
| **RDS** | Route Discovery | 动态下发路由规则 |
| **CDS** | Cluster Discovery | 动态下发上游集群 |
| **EDS** | Endpoint Discovery | 动态下发端点列表 |
| **SDS** | Secret Discovery | 动态下发 TLS 证书 |

## 配置示例

```yaml
# Envoy 静态配置示例
static_resources:
  listeners:
    - name: http_listener
      address:
        socket_address:
          address: 0.0.0.0
          port_value: 8080
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                stat_prefix: ingress_http
                route_config:
                  name: local_route
                  virtual_hosts:
                    - name: backend
                      domains: ["*"]
                      routes:
                        - match:
                            prefix: "/api"
                          route:
                            cluster: inference_service
                http_filters:
                  - name: envoy.filters.http.router
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
  clusters:
    - name: inference_service
      connect_timeout: 5s
      type: STRICT_DNS
      lb_policy: ROUND_ROBIN
      load_assignment:
        cluster_name: inference_service
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      address: inference-svc
                      port_value: 8000
```

## Envoy vs 其他代理

| 特性 | Envoy | Nginx | HAProxy |
|------|-------|-------|--------|
| 动态配置 | xDS API | reload | Runtime API |
| 协议支持 | HTTP/2/gRPC/TCP | HTTP/TCP | HTTP/TCP |
| 可观测性 | 原生 Prometheus | 模块 | 原生 |
| 扩展机制 | Wasm/Lua/C++ | Lua/C 模块 | Lua |
| 热重启 | 支持 | 支持 | 支持 |

## AI 推理场景应用

| 场景 | Envoy 角色 | 配置要点 |
|------|----------|----------|
| **推理网关** | Ingress Gateway | 超时设置、重试策略 |
| **模型路由** | 流量分割 | 按 Header/权重路由到不同模型版本 |
| **gRPC 代理** | Sidecar | HTTP/2 连接池、流式响应 |
| **限流保护** | Rate Limit Filter | 保护 GPU 推理服务不被压平 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 配置未同步 | xDS 连接断开 | 检查控制面连接状态 |
| 内存占用高 | 连接数过多 | 调整连接池大小和超时 |
| 503 错误 | 上游不可用 | 检查健康检查和熔断配置 |
| 延迟增加 | Sidecar 开销 | 优化过滤器链、减少不必要的 filter |

## 生产最佳实践

1. **资源限制**：设置 Sidecar CPU/内存限制，避免资源争抢
2. **配置同步**：监控 xDS 连接状态，确保配置及时同步
3. **可观测性**：启用 Prometheus 指标、访问日志、追踪
4. **热重启**：利用热重启能力实现零停机更新
5. **连接池调优**：根据上游服务特性调整 HTTP/2 连接池参数

## 监控指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| `envoy_cluster_upstream_rq_time` | 上游请求时间 | P99 > 1s |
| `envoy_cluster_upstream_cx_active` | 活跃连接数 | > 1000 |
| `envoy_server_memory_allocated` | 内存使用 | > 80% limit |
| `envoy_cluster_upstream_rq_5xx` | 5xx 错误率 | > 1% |

## 性能调优

| 参数 | 默认值 | 建议值 | 说明 |
|------|--------|--------|------|
| concurrency | CPU 核数 | 2-4 | 工作线程数 |
| max_connections | 无限制 | 10000 | 最大连接数 |
| idle_timeout | 1h | 5m | 空闲连接超时 |
| connect_timeout | 5s | 2s | 连接超时 |

## 相关概念

- [[概念/istio|Istio]] — 使用 Envoy 的服务网格
- [[概念/linkerd|Linkerd]] — 轻量服务网格
- [[概念/service-mesh|Service Mesh]] — 服务网格概念

## 总结

Envoy 是云原生流量治理的基石，作为 Istio、Contour 等项目 的数据面代理。在 AI 推理场景中作为模型服务网关和 Sidecar 代理，提供动态路由、限流、熔断和可观测能力。

---

> 💡 Envoy 是云原生流量治理的基石，在 AI 推理场景中作为模型服务网关和 Sidecar 代理发挥核心作用。

## 版本兼容性

| Envoy 版本 | Istio 兼容 | 状态 |
|------------|-----------|------|
| 1.32.x | Istio 1.24+ | 稳定 |
| 1.31.x | Istio 1.23 | 维护 |
| 1.30.x | Istio 1.22 | EOL |






