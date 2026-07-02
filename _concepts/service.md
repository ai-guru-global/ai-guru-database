---
title: "Service"
category: -concepts
tags: ["kubernetes", "k8s", "service", "networking", "cloud-native", "alibaba-cloud"]
summary: "Service 是 Kubernetes 中为 Pod 提供稳定网络访问入口的抽象层，通过 Label Selector 实现服务发现与四层负载均衡，是 K8s 工作负载对外暴露能力的核心机制。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "K8s Service"
  - "Kubernetes Service"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/kubectl"
    type: related_to
  - target: "_concepts/apsara-stack"
    type: related_to
sources: []
---

# Service

> **一句话理解**: Service 是 Kubernetes 中为 Pod 提供稳定网络访问入口的抽象层，通过 Label Selector 把流量负载均衡到后端 Pod。

## 核心要点

- **稳定端点**：Pod 的 IP 随生命周期变化，Service 提供一个固定的 Cluster IP 和 DNS 名称，解耦前端调用与后端实例。
- **服务发现**：同一集群内可通过 `<service-name>.<namespace>.svc.cluster.local` 直接访问，无需关心 Pod 实际 IP。
- **四层负载均衡**：kube-proxy 负责维护 Service 到后端 Pod 的转发规则，默认使用 iptables/ipvs 实现随机或轮询分发。
- **Label Selector 驱动**：Service 通过 `selector` 关联具有相同 Label 的 Pod，自动跟随 Deployment 的扩缩容变化。
- **多类型暴露**：ClusterIP 供集群内使用，NodePort 暴露节点端口，LoadBalancer 对接云负载均衡，ExternalName 映射外部域名。
- **Endpoints / EndpointSlice 支撑**：Service 的实际后端列表由 Endpoints（早期）或 EndpointSlice（推荐）对象维护，支持多版本兼容与大规模集群优化。

## 典型 YAML / 命令示例

```yaml
# service.yaml — 暴露 web 应用到集群内部
apiVersion: v1
kind: Service
metadata:
  name: web-service
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

```bash
# 创建并查看 Service
kubectl apply -f service.yaml
kubectl get svc web-service

# 查看 Service 关联的后端 Endpoints
kubectl get endpoints web-service

# 在集群内临时测试访问
curl http://web-service.default.svc.cluster.local:80

# 暴露已有 Deployment 为 NodePort（仅测试用）
kubectl expose deploy web --type=NodePort --port=80 --target-port=8080
```

## 选型对比

| 类型 | 作用范围 | 典型用途 | 专有云注意事项 |
|------|----------|----------|----------------|
| **ClusterIP** | 集群内部 | 微服务间调用、内部 API | 默认类型，不占用节点端口 |
| **NodePort** | 节点 IP + 端口 | 开发测试、临时暴露 | 端口范围 30000-32767，生产慎用 |
| **LoadBalancer** | 集群外部 | 对外提供稳定入口 | 依赖云厂商负载均衡实现 |
| **ExternalName** | DNS 层 | 映射外部服务域名 | 不创建代理，仅返回 CNAME |
| **Headless** | Pod 直连 | StatefulSet、服务发现需拿到 Pod IP | 设置 `clusterIP: None` |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）环境中，ACK 敏捷版与 ACK 专有版均完整支持 Kubernetes Service 模型。当用户将 Service 类型设为 `LoadBalancer` 时，集群会调用云控制器管理器（Cloud Controller Manager）自动创建或绑定到专有云网络组件（如洛神网络平台的负载均衡能力），实现与公有云一致的负载均衡暴露体验。工单处理中常见的 Service 相关排查点包括：Endpoint 为空（Label Selector 不匹配）、ClusterIP 无法访问（kube-proxy 规则异常）、LoadBalancer 状态 Pending（底层网络资源不足或权限策略限制）等。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/kubectl|kubectl]] — K8s 命令行工具
- [[_concepts/apsara-stack|阿里云专有云 Apsara Stack]] — 阿里云专有云平台
- [[_concepts/cri|CRI]] — 容器运行时接口
- [[_concepts/containerd|containerd]] — 容器运行时
