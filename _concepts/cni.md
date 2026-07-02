---
title: "CNI（Container Network Interface）"
category: -concepts
tags: ["kubernetes", "k8s", "cni", "cloud-native", "alibaba-cloud"]
summary: "CNI（Container Network Interface）是 Kubernetes 与网络插件之间的标准接口，负责 Pod 的 IP 分配、虚拟网卡创建和跨节点通信，是 K8s 容器网络可插拔的基础。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "CNI"
  - "Container Network Interface"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/pod"
    type: related_to
  - target: "_concepts/service"
    type: part_of
sources: []
---

# CNI（Container Network Interface）

> **一句话理解**: CNI 是 Kubernetes 调用网络插件的「标准插座」，负责给每个 Pod 插上 IP、连上网络。

## 核心要点

- **标准接口**：CNI 定义了容器运行时（如 containerd）与网络插件之间的调用规范，Kubelet 在创建/删除 Pod 时触发 CNI 插件执行。
- **核心职责**：为 Pod 分配 IP 地址、创建 veth pair / 虚拟网卡、配置节点与跨节点路由，保证同节点和跨节点 Pod 之间可互通。
- **可插拔架构**：只要实现 CNI 规范，就可以替换底层网络方案（Calico、Flannel、Cilium、Terway 等），不影响 K8s 上层 API。
- **网络策略**：部分 CNI 插件（如 Calico、Cilium）还支持 NetworkPolicy，实现 Pod 级别的入/出站防火墙。
- **与 Service 的分层**：CNI 解决 Pod 的 L2/L3 连通性；Service 与 kube-proxy 在其之上提供稳定的虚拟 IP 和负载均衡。

## 典型 YAML / 命令示例

```bash
# 查看节点上已配置的 CNI 网络配置
ls /etc/cni/net.d/

# 查看 CNI 插件可执行文件（bridge、loopback、host-local 等）
ls /opt/cni/bin/

# 查看 Pod IP（由 CNI 插件分配）
kubectl get pod -n default -o wide

# 测试 Pod 跨节点连通性
kubectl run debug --image=nicolaka/netshoot -it --rm -- ping <pod-ip>
```

使用 Calico 等支持 NetworkPolicy 的 CNI 时，可限制 Pod 间访问：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-allow-frontend
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 80
```

## 选型对比

| CNI 插件 | 核心特点 | 适用场景 |
|---|---|---|
| **Calico** | BGP/路由模式、支持 NetworkPolicy、性能高 | 生产环境、多集群网络 |
| **Flannel** | 轻量、Overlay（VXLAN）、部署简单 | 中小集群、快速验证 |
| **Cilium** | 基于 eBPF、可观测性强、高级安全策略 | 云原生安全、服务网格 |
| **Terway** | 阿里云自研、支持 ENI/IP 直连 | 阿里云 ACK、专有云 |
| **Weave Net** | Overlay、自动发现、易用 | 早期/测试集群 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）环境中，ACK 敏捷版/专有版通常采用阿里云自研的 Terway 作为 CNI 插件。Terway 可将神龙（X-Dragon）服务器上的弹性网卡（ENI）或辅助 IP 直接挂载到 Pod，使 Pod IP 与底层洛神（Luoshen）网络无缝对接，减少 Overlay 封装开销，提升 AI 训练、推理等大流量业务的网络性能。在 AS CM 管理的租户集群中，网络策略与地址段规划通常还需结合 Tianji 运维体系进行统一配置与审计。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/pod|Pod]] — Pod 网络主体
- [[_concepts/service|Service]] — K8s 服务发现与负载均衡
- [[_concepts/cri|CRI]] — 容器运行时接口
- [[_concepts/kubectl|kubectl]] — K8s 命令行工具
