---
title: "CNI（Container Network Interface）"
category: -concepts
tags: ["kubernetes", "k8s", "cni", "cloud-native", "alibaba-cloud"]
summary: "CNI（Container Network Interface）是 Kubernetes 与网络插件之间的标准接口，负责 Pod 的 IP 分配、虚拟网卡创建和跨节点通信，是 K8s 容器网络可插拔的基础。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "CNI"
  - "Container Network Interface"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/pod"
    type: related_to
  - target: "概念/service"
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

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/pod|Pod]] — Pod 网络主体
- [[概念/service|Service]] — K8s 服务发现与负载均衡
- [[概念/network-policy|NetworkPolicy]] — 网络策略
- [[概念/cri|CRI]] — 容器运行时接口

---

## 2026 CNI 生态

| 插件 | 特点 | 适用场景 |
|------|------|----------|
| **Cilium** | eBPF、高性能 | 云原生安全 |
| **Calico** | BGP、NetworkPolicy | 生产环境 |
| **Flannel** | 轻量、简单 | 中小集群 |
| **Terway** | 阿里云 ENI 直连 | 阿里云 ACK |

## 生产最佳实践

1. **生产用 Calico/Cilium**：支持 NetworkPolicy，性能高
2. **网络策略**：启用 NetworkPolicy 限制 Pod 间访问
3. **IP 规划**：合理规划 Pod CIDR，避免与主机网络冲突
4. **性能监控**：关注网络延迟、丢包率

## CNI 插件对比

| 插件 | 模式 | NetworkPolicy | 性能 | 特点 |
|------|------|------|------|------|
| Calico | BGP/VXLAN | ✅ | 高 | 企业级 |
| Cilium | eBPF | ✅ | 极高 | 云原生 |
| Flannel | VXLAN | ❌ | 高 | 简单 |
| Weave | VXLAN | ✅ | 中 | 加密 |
| Antrea | OVS | ✅ | 高 | 企业级 |
| kube-router | BGP | ✅ | 高 | 轻量 |

## CNI 工作原理

| 步骤 | 说明 |
|------|------|
| 1 | kubelet 创建 Pod |
| 2 | 调用 CNI 插件 |
| 3 | 配置网络命名空间 |
| 4 | 分配 IP 地址 |
| 5 | 设置路由规则 |
| 6 | Pod 网络就绪 |

## CNI 配置示例

```json
// /etc/cni/net.d/10-calico.conflist
{
  "name": "calico",
  "cniVersion": "1.0.0",
  "plugins": [
    {
      "type": "calico",
      "etcd_endpoints": "http://etcd:2379",
      "log_level": "info",
      "ipam": {
        "type": "calico-ipam"
      },
      "policy": {
        "type": "k8s"
      }
    }
  ]
}
```

## AI 场景网络需求

| 场景 | 网络要求 | 推荐 CNI |
|------|------|------|
| 分布式训练 | 高带宽/低延迟 | Cilium/Calico |
| 推理服务 | 高并发 | Calico/Cilium |
| 多租户 | 网络隔离 | Calico + NetworkPolicy |
| 边缘计算 | 轻量 | Flannel |

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get pods -n kube-system -l k8s-app=calico-node` | 查看 CNI Pod |
| `calicoctl node status` | Calico 节点状态 |
| `cilium status` | Cilium 状态 |
| `ip addr show` | 查看网络接口 |

> 💡 CNI 是 K8s 容器网络的标准接口，2026 年 AI 集群推荐 Calico (企业) 或 Cilium (高性能)。

## 网络模式对比

| 模式 | 说明 | 性能 | 适用场景 |
|------|------|------|------|
| VXLAN | 覆盖网络 | 中 | 跨子网 |
| BGP | 原生路由 | 高 | 同子网/高性能 |
| eBPF | 内核旁路 | 极高 | 高性能/可观测 |
| HostNetwork | 主机网络 | 最高 | 特殊场景 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Pod 无法通信 | CNI 未安装 | 检查 CNI Pod |
| IP 分配失败 | IPAM 耗尽 | 扩大 Pod CIDR |
| 网络延迟高 | VXLAN 开销 | 改用 BGP/eBPF |
| NetworkPolicy 无效 | CNI 不支持 | 更换支持 NP 的 CNI |

## 最佳实践

| 实践 | 说明 |
|------|------|
| 生产用 Calico/Cilium | 企业级功能 |
| 启用 NetworkPolicy | 网络隔离 |
| 监控网络指标 | 延迟/丢包/带宽 |
| 合理规划 CIDR | 避免冲突 |
