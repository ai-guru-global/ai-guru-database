---
title: "Kubernetes 网络深度解析"
category: 12-architecture-infrastructure
tags: ["kubernetes", "k8s", "networking", "cni", "service", "ingress", "dns", "cloud-native", "alibaba-cloud"]
summary: "系统讲解 Kubernetes 网络模型、CNI、Service、DNS、Ingress、NetworkPolicy 及排障方法，面向阿里云专有云 K8s 工单处理。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "Kubernetes Networking Deep Dive"
  - "K8s Networking Deep Dive"
  - "Kubernetes_Networking_Deep_Dive"
sources: []
---

# Kubernetes 网络深度解析

> **一句话理解**: Kubernetes 网络是一套「每个 Pod 都有独立 IP、全集群扁平可达、Service 提供稳定访问入口、CNI 负责底层连通」的容器网络体系，是 K8s 工单中「连不上、解析不了、访问超时」问题的核心排查域。

> 📐 **概念方法论**: K8s 网络分四层理解最清晰——**容器网络接口层（CNI）**解决 Pod IP 与跨节点连通；**Service 层**解决 Pod 漂移后的稳定访问与负载均衡；**DNS 层**解决服务名到 ClusterIP 的解析；**Ingress/Gateway 层**解决七层路由与南北向入口。排障时按「Pod IP → Service IP → DNS → Ingress → 外部」逐层定位，可大幅减少盲目抓包。

---

## 目录

1. [K8s 网络模型](#1-k8s-网络模型)
2. [CNI 与主流插件](#2-cni-与主流插件)
3. [Service 与 kube-proxy](#3-service-与-kube-proxy)
4. [CoreDNS 与服务发现](#4-coredns-与服务发现)
5. [Ingress 与 Gateway API](#5-ingress-与-gateway-api)
6. [NetworkPolicy](#6-networkpolicy)
7. [常见网络故障排查](#7-常见网络故障排查)
8. [阿里云专有云关联](#8-阿里云专有云关联)

---

## 1. K8s 网络模型

### 1.1 核心设计原则

Kubernetes 网络模型由三个极简规则定义，所有合法 CNI 插件都必须满足：

| 规则 | 含义 | 工单意义 |
|------|------|----------|
| **Pod IP 唯一且可路由** | 每个 Pod 在集群范围内拥有独立 IP，不依赖 NAT 即可被其他 Pod 直接访问 | 排查时可以直接 `ping <pod-ip>`，IP 就是 Pod 的身份 |
| **节点可与所有 Pod 互通** | Node 上进程（kubelet、kube-proxy、调试容器）能直接访问任意 Pod | 节点级排障工具可直接探针 Pod |
| **Pod 可与所有节点互通** | Pod 能直接访问节点上的服务（如 kubelet 10250、NodePort） | 监控/日志 Agent 采集节点指标不额外转接 |

> 这三条规则共同造就了一个**扁平网络**：对应用而言，集群就是一台大交换机，Pod 像物理机一样拥有真实 IP。

### 1.2 网络命名空间与数据面基础

> K8s 与 Docker 默认 bridge 的关键差异：K8s 中 Pod IP 在集群全局唯一且可跨节点直接路由，无需端口映射。

### 1.3 IP 地址规划（CIDR）

每个 Pod 拥有独立的 Linux 网络命名空间（netns），CNI 插件负责把 Pod netns 连接到主机网络：

```
Pod netns:        eth0 <───────────────> vethxxx (主机侧)
                         veth pair
主机 root netns:  cni0/虚拟网桥 ──▶ 节点路由/Overlay ──▶ 其他节点
```

常用查看命令：

```bash
# 查看 Pod 所在节点的网络命名空间
kubectl get pod <pod> -o wide

# 在节点上查看 Pod 的 veth 接口
ip netns list                    # 容器运行时创建的 netns
ip addr | grep veth              # 主机侧 veth

# 查看 Pod 内部路由（替换成实际容器 ID/名称）
kubectl exec -it <pod> -- ip route
kubectl exec -it <pod> -- cat /etc/resolv.conf
```

### 1.4 IP 地址规划（CIDR）

集群网络至少涉及三个地址段，工单中常因地址冲突或耗尽引发故障：

| CIDR | 作用 | 典型冲突 |
|------|------|----------|
| **Pod CIDR** | 给 Pod 分配 IP | 与企业内网、VPC 子网重叠会导致路由黑洞 |
| **Service CIDR** | ClusterIP 范围 | 不可路由到集群外，仅供内部使用 |
| **节点子网** | Node IP 所在 VPC/物理网段 | 与 Pod CIDR 重叠会造成路由异常 |

```bash
# 查看集群网络配置
kubectl cluster-info dump | grep -E "service-cluster-ip-range|cluster-cidr|pod-network-cidr"

# kube-controller-manager 关键启动参数
# --cluster-cidr=10.244.0.0/16        # Pod CIDR
# --service-cluster-ip-range=10.96.0.0/12  # Service CIDR
# --node-cidr-mask-size=24             # 每个节点分到的 Pod 子网大小
```

> **规划建议**: Pod CIDR 与 Service CIDR 不要与线下机房、专线、VPN 网段重叠；专有云场景下还要与洛神 VPC 网段、VSwitch 网段做统一规划，避免飞天企业版多租户地址冲突。

---

## 2. CNI 与主流插件

### 2.1 CNI 职责与调用时机

CNI（Container Network Interface）是 Kubelet 与网络插件之间的标准契约：

- **ADD**: Pod 创建时，Kubelet 调用 CNI 插件分配 IP、创建网卡、配置路由
- **DEL**: Pod 删除时，回收 IP、清理网卡
- **CHECK**: 校验网络配置是否生效

```bash
# 节点上的 CNI 配置
ls /etc/cni/net.d/
cat /etc/cni/net.d/10-calico.conflist

# CNI 二进制
ls /opt/cni/bin/
```

### 2.2 主流 CNI 插件对比

| 插件 | 数据面 | 路由模式 | NetworkPolicy | 核心优势 | 典型场景 |
|------|--------|----------|---------------|----------|----------|
| **Calico** | Linux 路由/iptables | BGP 或 IPIP/VXLAN Overlay | ✅ | 成熟、性能好、路由可视化强 | 大规模生产、裸金属、混合云 |
| **Cilium** | eBPF | 隧道或原生路由 | ✅（含 L7） | 可观测性极强、安全策略细 | 零信任、服务网格、高安全场景 |
| **Flannel** | VXLAN/UDP/host-gw | Overlay 为主 | ❌ | 简单、轻量、易部署 | 中小集群、测试环境 |
| **Antrea** | OVS / 自研数据面 | Overlay | ✅ | VMware 生态、与 NSX 集成 | Tanzu 环境、混合虚拟化 |
| **Terway** | 阿里云 ENI / ipvlan | 直连（IP 与 ECS 同网段） | ✅ | 高性能、无 Overlay、云原生 | 阿里云 ACK / 专有云 |

### 2.3 Calico 深入

Calico 提供两种模式：

- **BGP 模式**: 每个节点作为 BGP Speaker，把 Pod 路由通告到物理交换机，实现无 Overlay 高性能转发
- **IPIP/VXLAN 模式**: 跨节点流量封装在隧道中，对底层网络无特殊要求

```bash
# 查看 Calico 节点与 BGP 对等体状态
calicoctl node status
calicoctl get ippool -o wide
ip route | grep 10.244
```

### 2.4 Cilium 深入

Cilium 用 eBPF 替代 iptables，提供 Identity-based 安全、Hubble 可观测、Cluster Mesh 跨集群服务发现。

```bash
# 查看 Cilium Agent 状态与 Hubble 流量
cilium status
hubble observe --pod default/nginx
```

### 2.5 Flannel 与轻量场景

Flannel 是最简 Overlay 方案：

```bash
# 查看 Flannel 子网分配
cat /run/flannel/subnet.env

# VXLAN 模式会在每个节点创建 flannel.1 接口
ip -d link show flannel.1
```

> Flannel 不支持 NetworkPolicy，生产环境中若需隔离，必须叠加 Calico policy-only 模式或换用 Cilium。

### 2.6 阿里云 Terway

Terway 是阿里云自研 CNI，ACK 专有版/敏捷版与飞天企业版专有云的主要网络方案。核心特点：

| 特性 | 说明 |
|------|------|
| **ENI 模式** | 每个 Pod 独占弹性网卡（ENI），IP 直接来自 VPC 子网 |
| **ENIIP 模式** | 一个 ENI 上绑定多个辅助 IP，分配给多个 Pod，兼顾密度与性能 |
| **IPvlan 数据面** | 相比 veth + 网桥，转发路径更短、吞吐更高 |
| **无 Overlay** | 跨节点流量直接走洛神 VPC 路由，不封装 VXLAN |

```bash
# 在 ACK 节点上查看 Terway 状态
terway-cli show
terway-cli mapping

# 查看 ENI 与 Pod 的映射
kubectl get pod -o wide -n kube-system | grep terway
```

> **工单经验**: 专有云经常出现「ENI 配额不足」「辅助 IP 池耗尽」导致 Pod 处于 `ContainerCreating`。此时 `describe pod` 会提示 `allocate ip failed` 或 `no available ip`，需联系平台扩容节点 ENI 配额或调整 IP 池。

---

## 3. Service 与 kube-proxy

### 3.1 Service 的本质

Service 是一个稳定的虚拟入口，通过 `selector` 把流量负载到一组 Pod：`Client → ClusterIP → EndpointSlice → Pod`。

### 3.2 Service 类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| **ClusterIP** | 默认类型，仅在集群内可达 | 微服务内部调用 |
| **NodePort** | 在每个节点上开放固定端口（30000-32767） | 临时外部访问、测试 |
| **LoadBalancer** | 由云控制器申请负载均衡器 | 生产南北向入口 |
| **ExternalName** | CNAME 记录，映射到外部域名 | 将外部服务纳入 K8s 服务发现 |

```bash
# 查看 Service 与后端 Endpoints/EndpointSlice
kubectl get svc web -o wide
kubectl get endpoints web
kubectl get endpointslices -l kubernetes.io/service-name=web
```

### 3.3 kube-proxy 三种模式

kube-proxy 负责把 Service 虚拟 IP 翻译成后端 Pod IP：

| 模式 | 实现 | 优点 | 缺点 |
|------|------|------|------|
| **iptables** | 为每个 Service 生成 iptables 规则 | 兼容性好、稳定 | 后端多时规则多、更新慢、无连接保持 |
| **ipvs** | 基于 IPVS 内核模块做负载均衡 | 性能好、支持多种调度算法 | 需加载 ipvs 内核模块 |
| **nftables** | 使用 nftables（K8s 1.31+ 实验） | 规则表达力强 | 较新，生态待成熟 |

```bash
# 查看 kube-proxy 模式
kubectl get configmap kube-proxy -n kube-system -o yaml | grep mode

# 节点上查看 iptables 规则（仅 iptables 模式）
iptables -t nat -L KUBE-SERVICES -n | grep <service-ip>

# 节点上查看 IPVS 虚拟服务（仅 ipvs 模式）
ipvsadm -Ln
```

> **选型建议**: 中小集群 iptables 足够；后端 Pod 数量多（>1000）或追求会话亲和性时切 ipvs；未来可关注 nftables 稳定化。

### 3.4 EndpointSlice

EndpointSlice 是 Endpoints 的继任者，把后端 Pod 信息切片存储，降低大规模集群下 API Server 与 kube-proxy 的同步压力：

```bash
kubectl get endpointslices
kubectl get endpointslices <slice-name> -o yaml
```

### 3.5 Headless Service

当 `clusterIP: None` 时，DNS 直接返回后端 Pod IP 列表，不经过 kube-proxy 负载均衡：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongo
spec:
  clusterIP: None
  selector:
    app: mongo
  ports:
    - port: 27017
```

> 常用于有状态服务（如 StatefulSet + MongoDB/MySQL 分片），客户端自己决定连接哪个 Pod。

### 3.6 ExternalTrafficPolicy 与外网流量

| 策略 | 行为 | 适用 |
|------|------|------|
| **Cluster**（默认） | 流量可能先被转发到其他节点，再路由到 Pod | 负载均衡更均匀 |
| **Local** | 只把流量转发到本节点上的 Pod | 保留真实客户端源 IP |

```yaml
spec:
  externalTrafficPolicy: Local
```

> 阿里云 SLB 映射 LoadBalancer Service 时，若业务需要获取真实源 IP，应设置 `externalTrafficPolicy: Local`。

---

## 4. CoreDNS 与服务发现

### 4.1 K8s DNS 机制

集群内 DNS 由 CoreDNS 提供，每个 Pod 的 `/etc/resolv.conf` 指向 CoreDNS Service（通常是 `10.96.0.10`）：

```
Pod 发起 dns lookup: web.default.svc.cluster.local
           │
           ▼
      CoreDNS Pod
           │
           ├── 集群内域名 ──► 查询 API Server / EndpointsSlice ──► 返回 ClusterIP
           └── 外部域名 ──► 递归到上游 DNS
```

```bash
# 查看 Pod 的 DNS 配置
kubectl exec -it <pod> -- cat /etc/resolv.conf

# 典型输出
nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

### 4.2 DNS 名称规则

| 名称 | 说明 | 示例 |
|------|------|------|
| Service 短名 | 同一 namespace 内可直接用 | `http://web` |
| Service 全限定名 | `<service>.<ns>.svc.cluster.local` | `web.default.svc.cluster.local` |
| Headless StatefulSet | `<pod-name>.<service>.<ns>.svc.cluster.local` | `mongo-0.mongo.default.svc.cluster.local` |
| ExternalName | CNAME 到外部域名 | `api.example.com` |

### 4.3 CoreDNS 配置

CoreDNS 通过 ConfigMap `coredns` 配置：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
           lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
           ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf {
           max_concurrent 1000
        }
        cache 30
        loop
        reload
        loadbalance
    }
```

> 关键插件：`kubernetes` 处理集群域名，`forward` 递归外部域名，`cache` 降低 API Server 压力，`rewrite` 做域名重写。

### 4.4 排障命令

```bash
# 测试 DNS 解析
kubectl run -it --rm debug --image=nicolaka/netshoot -- nslookup web.default

# 查看 CoreDNS Pod 状态
kubectl get pods -n kube-system -l k8s-app=kube-dns

# 查看 CoreDNS 日志
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=100

# DNS 压力测试
drill -p 53 @10.96.0.10 web.default.svc.cluster.local
```

### 4.5 常见 DNS 问题

| 现象 | 根因 | 处理 |
|------|------|------|
| `nslookup` 间歇性失败 | CoreDNS 副本数不足或 HPA 未配置 | 扩容 CoreDNS Deployment |
| 外部域名解析慢 | `ndots:5` 导致 search 域多次尝试 | 使用 FQDN（末尾加 `.`）或调 `ndots` |
| 跨 namespace 访问失败 | 使用了短名而非全限定名 | 改为 `<svc>.<ns>.svc.cluster.local` |
| 解析返回旧 IP | CoreDNS cache 或 kube-proxy 规则未更新 | 检查 EndpointsSlice / 重启 CoreDNS Pod |

---

## 5. Ingress 与 Gateway API

### 5.1 Ingress 控制器

Ingress 本身只是 API 对象，真正的流量转发由 Ingress Controller 实现。常见选择：

| 控制器 | 特点 | 适用 |
|--------|------|------|
| **Nginx Ingress** | 最流行、文档丰富、支持 TCP/UDP | 通用生产场景 |
| **Traefik** | 云原生、自动服务发现、支持中间件 | 微服务动态路由 |
| **Contour** | Envoy 数据面、Gateway API 支持好 | 现代七层网关 |

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web
                port:
                  number: 80
```

### 5.2 Ingress 流量路径

流量路径：`外部客户端 → Ingress Controller（LoadBalancer/NodePort Service）→ 按 host/path 匹配 → 后端 Service ClusterIP → EndpointSlice → 目标 Pod`。

### 5.3 Gateway API

Gateway API 是 Ingress 的下一代替代，角色更清晰：

| 资源 | 职责 |
|------|------|
| **GatewayClass** | 定义控制器类型（如 nginx、contour、istio） |
| **Gateway** | 定义监听器（IP、端口、TLS） |
| **HTTPRoute/TCPRoute** | 把流量路由到后端 Service |
| **ReferenceGrant** | 跨 namespace 引用权限 |

> Gateway API 把「入口基础设施」与「应用路由」解耦，更适合多团队共享集群入口。

### 5.4 Ingress 排障

```bash
# 查看 Ingress 事件
kubectl describe ingress web-ingress

# 查看 Ingress Controller 日志
kubectl logs -n ingress-nginx deploy/ingress-nginx-controller --tail=200

# 检查后端健康
kubectl get endpoints web

# 从 Ingress Controller Pod 内测试后端
curl http://web.default.svc.cluster.local:80
```

---

## 6. NetworkPolicy

### 6.1 作用与局限

NetworkPolicy 是 K8s 原生的四层防火墙。要点：需要 CNI 支持（Calico/Cilium/Terway 支持，Flannel 不支持）；默认全部放行；策略采用白名单机制，显式允许才放行。

### 6.2 典型策略示例

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
          port: 8080
```

默认拒绝所有入站：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Ingress
```

### 6.3 跨 namespace 与 IPBlock

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-monitoring
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: monitoring
        - ipBlock:
            cidr: 192.168.1.0/24
```

### 6.4 排障 NetworkPolicy

```bash
# 确认 CNI 支持策略
kubectl get pods -n kube-system | grep -E "calico|cilium|terway"

# 查看策略是否命中
kubectl get networkpolicies -A
kubectl describe networkpolicy <name>

# 从源 Pod ping/nc 目标 Pod 验证
kubectl exec -it <source-pod> -- nc -vz <target-ip> <port>
```

---

## 7. 常见网络故障排查

### 7.1 排障分层模型

遇到网络问题时，按以下顺序分层定位：Pod IP 层 → Service 层 → DNS 层 → Ingress 层 → 外部层。

### 7.2 常用诊断命令速查

```bash
# Pod / Service / Endpoint 信息
kubectl get pod,svc,ep -n <ns> -o wide
kubectl describe pod <pod>

# 调试容器
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- bash

# 连通性测试
ping <pod-ip>
nc -vz <pod-ip> <port>
curl -v http://<service-ip>:<port>
nslookup <svc>.<ns>.svc.cluster.local

# 节点网络与 kube-proxy
ip route
iptables -t nat -L KUBE-SERVICES -n
ipvsadm -Ln

# CNI / DNS 状态
ls /etc/cni/net.d/
calicoctl node status
terway-cli show
kubectl logs -n kube-system -l k8s-app=kube-dns
```

### 7.3 故障症状、根因与处理

| 症状 | 可能根因 | 排查命令 | 处理方向 |
|------|----------|----------|----------|
| Pod 状态 `ContainerCreating` 且事件提示网络失败 | CNI 插件异常、IP 池耗尽、ENI 配额不足 | `kubectl describe pod`; `terway-cli show` | 重启 CNI Pod、扩容 ENI/IP、检查节点状态 |
| 同节点 Pod 互通正常，跨节点不通 | Overlay 隧道异常、VPC 路由缺失、安全组/ACL 拦截 | `ip route`; `ping` 跨节点 Pod IP | 检查 CNI 隧道接口、VPC 路由表、安全组 |
| 访问 Service 超时 | kube-proxy 规则未同步、Endpoints 为空、后端 Pod 未就绪 | `kubectl get endpoints`; `iptables -t nat -L` | 检查 selector/label、Pod readiness、重启 kube-proxy |
| DNS 间歇性解析失败 | CoreDNS Pod 资源不足、缓存问题、ndots 配置 | `kubectl top pod -n kube-system`; `nslookup` | 扩容 CoreDNS、调整 ndots、清理缓存 |
| Ingress 返回 502/503 | 后端 Pod 不健康、Service 端口错、Ingress 规则未匹配 | `kubectl describe ingress`; `curl` 测试后端 | 检查 readinessProbe、Service targetPort、Ingress 路径 |
| 跨 namespace 访问失败 | 使用了短名、NetworkPolicy 拦截 | `nslookup <svc>.<ns>.svc.cluster.local` | 使用全限定域名、检查 NetworkPolicy |
| 出网流量被丢弃 | SNAT 规则缺失、企业防火墙、安全组 | `kubectl exec -it <pod> -- curl http://<external>` | 检查 CNI `natOutgoing`、NAT 网关、安全组 |
| LoadBalancer Service 无法从外网访问 | 云控制器未创建 SLB、监听器端口未映射、节点安全组 | `kubectl get svc -o wide`; 云平台控制台 | 检查 cloud-controller-manager、SLB 状态、节点安全组 |
| Pod 能 ping 但 TCP 不通 | 目标端口未监听、NetworkPolicy 拦截、中间件连接池满 | `nc -vz <ip> <port>`; `ss -tlnp` | 检查应用监听端口、NetworkPolicy、应用日志 |

### 7.4 抓包与日志

```bash
# 抓 Pod 接口的包
ip addr | grep <pod-ip>              # 找主机侧 veth
tcpdump -i vethxxx -nn -s0 -w /tmp/pod.pcap
kubectl exec -it <pod> -- tcpdump -i eth0 -nn -s0

# 查看关键组件日志
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=200
kubectl logs -n kube-system -l k8s-app=kube-proxy --tail=200
kubectl logs -n kube-system -l app=terway --tail=200
```

---

## 8. 阿里云专有云关联

### 8.1 飞天企业版与 ACK

在阿里云专有云（Apsara Stack / 飞天企业版）环境中，容器服务形态主要为：

| 产品 | 定位 | 网络插件 |
|------|------|----------|
| **ACK 专有版** | 企业级托管 K8s，平台侧深度运维 | Terway（默认）/ Flannel |
| **ACK 敏捷版** | 轻量、快速交付、中小型场景 | Terway / Flannel |
| **ASCM** | 阿里云专有云云管平台，统一资源、租户、运维 | 与 ACK 网络控制台集成 |

> 神龙（X-Dragon）服务器是阿里云自研的高性能物理机，ACK 专有版常部署在神龙之上，配合 Terway ENI 模式可把弹性网卡直通给 Pod。

### 8.2 洛神网络与 K8s 网络对接

洛神（Luoshen）是阿里云自研的虚拟网络系统。关键组件：

- **VPC**: K8s 节点所在的虚拟私有云
- **VSwitch**: 节点子网，Terway ENI 模式下 Pod IP 可直接从 VSwitch 网段分配
- **VRouter/自定义路由**: 洛神路由表负责把 Pod 网段指向正确的节点 ENI
- **安全组**: 节点级防火墙，控制东西向与南北向流量
- **NAT 网关/公网 IP**: 控制 Pod 出网与外部入站

流量路径：`外部用户 → SLB → NodePort/LoadBalancer Service → Node → Terway → Pod`。

### 8.3 Terway 在专有云中的常见问题

| 问题 | 现象 | 处理 |
|------|------|------|
| **ENI 配额不足** | Pod `ContainerCreating`，事件 `failed to allocate eni` | 在 ASCM/节点控制台提升单节点 ENI 上限，或改用 ENIIP 模式 |
| **辅助 IP 池耗尽** | 新 Pod 无法分配 IP，调度 Pending | 扩容节点、调整 VSwitch 网段大小、回收闲置 ENI |
| **VPC 路由表缺失** | 跨节点 Pod 不通，同节点正常 | 检查洛神路由表是否包含 Pod CIDR 到节点 ENI 的路由 |
| **安全组拦截** | 部分端口通、部分不通 | 检查节点安全组入/出站规则、Pod 安全组（若启用） |
| **Terway DaemonSet 异常** | 大量 Pod 网络创建失败 | `kubectl rollout restart ds terway -n kube-system`；检查 terway-cli 日志 |

```bash
# 在 ACK 专有云节点上排查 Terway
cat /var/log/messages | grep terway
terway-cli mapping | grep <pod-ip>
terway-cli show

# 查看洛神 ENI 分配
ip addr show eth0
ip addr show eth1
```

### 8.4 SLB 与 Service 映射

阿里云专有云 ACK 中，LoadBalancer 类型 Service 由 **cloud-controller-manager** 驱动创建 SLB 实例。工单要点：

- 若需要保留真实客户端源 IP，务必设置 `externalTrafficPolicy: Local`
- 多可用区场景下 SLB 后端需覆盖多个 VSwitch，避免单点
- 删除 Service 后 SLB 实例未自动释放时，检查 cloud-controller-manager 日志

```bash
kubectl logs -n kube-system -l app=cloud-controller-manager --tail=200
```

### 8.5 天基运维体系与网络变更

在飞天企业版中，网络变更通常纳入 **天基** 运维体系管理：节点扩容、VSwitch 变更、安全组调整需通过天基或 ASCM 工单审批；网络地址规划由平台团队统一维护，避免多租户冲突；重大网络割接前需在 ACK 集群内做 Pod 连通性基线测试。

### 8.6 工单处理 checklist

处理阿里云专有云 K8s 网络工单时，建议按以下 checklist 执行：

1. **确认集群版本与网络插件**: `kubectl get nodes`, `kubectl get pods -n kube-system`
2. **确认 Pod/Service/DNS 状态**: `kubectl get pod,svc,ep -n <ns>`
3. **确认节点网络配置**: `ip route`, `ip addr`, `iptables -L -n -v`
4. **确认 CNI 插件状态**: `terway-cli show` / `calicoctl node status` / `cilium status`
5. **确认洛神侧配置**: VPC 路由表、安全组、SLB 监听器、ENI 配额
6. **复现并抓包**: 使用 netshoot 容器在源/目标 Pod 及节点上同时抓包
7. **关联变更**: 询问近期是否有节点扩容、网络割接、策略变更、版本升级
8. **回滚预案**: 若确认为变更引入，准备 NetworkPolicy 回滚、Service 注解调整、节点隔离等预案

---

## Related

- [[_concepts/cni|CNI]] — 容器网络接口基础概念
- [[_concepts/service|Service]] — K8s 服务发现与负载均衡
- [[_concepts/pod|Pod]] — Pod 网络主体
- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/kagent_Deep_Dive|kagent Deep Dive]] — K8s 原生的 DevOps AI Agent 框架
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/K8sGPT_Deep_Dive|K8sGPT Deep Dive]] — K8s 单轮诊断助手
- [[12_Architecture_Infrastructure/README]] — 架构与基础设施总览
- [[network-policy]]
