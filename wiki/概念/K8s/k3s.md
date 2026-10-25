---
title: "K3s"
category: -concepts
tags: ["kubernetes", "k8s", "edge", "lightweight", "rancher", "cloud-native", "alibaba-cloud"]
summary: "K3s 是 Rancher 推出的轻量级 Kubernetes 发行版，针对边缘计算、IoT、CI/CD 和资源受限场景优化，二进制仅约 100MB。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "K3s 轻量 K8s"
  - "Rancher K3s"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/karmada"
    type: related_to
sources: []
name_zh: "轻量级 K8s 发行版"
---

# K3s

> 中文简称：轻量级 K8s 发行版

> **一句话理解**: K3s 是 K8s 的「精简版」，去掉云厂商驱动、用 SQLite/etcd 可选存储，能在边缘设备或低资源机器上跑。

## 核心要点

- **单二进制**: 一个二进制文件包含 server 和 agent 角色。
- **轻量组件**: 默认使用 containerd，移除 alpha 功能和非必要插件。
- **内置存储**: 默认 SQLite，可选 etcd、MySQL、PostgreSQL。
- **边缘友好**: 支持 ARM、air-gap 离线安装、嵌入式网络存储。
- **CNCF 认证**: 通过官方一致性认证，是兼容 Kubernetes 的发行版。

## 常用命令

```bash
# 单节点安装
curl -sfL https://get.k3s.io | sh -

# 查看节点
k3s kubectl get nodes

# Agent 加入集群
k3s agent --server https://<server-ip>:6443 --token <token>
```

## 选型对比

| 发行版 | 定位 | 资源占用 | 适用场景 |
|--------|------|---------|---------|
| **K3s** | 轻量通用 | 低 | 边缘、IoT、开发测试 |
| **K0s** | 轻量通用 | 低 | 裸机、VM、边缘 |
| **MicroK8s** | 开发/桌面 | 低 | 本地开发、Ubuntu |
| **ACK 专有版** | 企业级 | 高 | 生产核心系统 |

## 阿里云专有云关联

在阿里云专有云环境中，K3s 可用于边缘节点、门店网关、工厂设备上的轻量容器管理，再通过 Karmada 或多集群管理工具接入中心 ACK 集群。工单中「边缘节点容器管理」场景会涉及 K3s 与 ACK 的协同。

## Related

- [[概念/kubernetes|Kubernetes]] — 标准 K8s
- [[概念/karmada|Karmada]] — 多集群编排
- [[概念/containerd|containerd]] — 容器运行时
- [[概念/volcano|Volcano]] — AI 任务调度

---

## 2026 K3s 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 认证** | 通过一致性测试 | GA |
| **嵌入式 etcd** | 可选 etcd/SQLite/MySQL | GA |
| **边缘 AI** | 支持 GPU 设备插件 | GA |
| **K3s + KubeEdge** | 云边协同 | 社区 |

## 架构与组件

| 组件 | 说明 |
|------|------|
| **k3s server** | 控制面 + Agent 一体化 |
| **k3s agent** | 工作节点，连接 server |
| **containerd** | 默认容器运行时 |
| **Flannel** | 默认 CNI 网络插件 |
| **Traefik** | 默认 Ingress Controller |
| **CoreDNS** | 集群 DNS |
| **SQLite/etcd** | 可选存储后端 |

## 安装与配置

```bash
# 单节点安装
curl -sfL https://get.k3s.io | sh -

# 禁用默认组件安装
curl -sfL https://get.k3s.io | sh -s - --disable traefik --disable servicelb

# 使用 etcd 存储
curl -sfL https://get.k3s.io | sh -s - --cluster-init

# Agent 加入集群
curl -sfL https://get.k3s.io | K3S_URL=https://server:6443 K3S_TOKEN=<token> sh -

# 查看节点
k3s kubectl get nodes

# 获取 kubeconfig
cat /etc/rancher/k3s/k3s.yaml
```

## K3s vs 其他轻量 K8s

| 维度 | K3s | K0s | MicroK8s | Minikube |
|------|-----|-----|----------|----------|
| 维护方 | Rancher/SUSE | Mirantis | Canonical | CNCF |
| 二进制大小 | ~100MB | ~200MB | snap | ~1GB |
| 存储 | SQLite/etcd | etcd | dqlite | 多种 |
| ARM 支持 | 是 | 是 | 是 | 是 |
| 生产就绪 | 是 | 是 | 是 | 否 |
| GPU 支持 | 插件 | 插件 | 插件 | 有限 |

## AI 边缘场景

| 场景 | 说明 |
|------|------|
| **边缘推理** | 在门店/工厂部署轻量推理服务 |
| **IoT 网关** | 设备端容器管理 |
| **开发测试** | 本地快速搭建 K8s 环境 |
| **CI/CD Runner** | 轻量级构建执行器 |
| **云边协同** | 配合 KubeEdge/Karmada 接入中心集群 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 节点 NotReady | 网络不通 | 检查 6443 端口和防火墙 |
| Pod Pending | 资源不足 | 检查节点 CPU/内存 |
| DNS 解析失败 | CoreDNS 异常 | 检查 CoreDNS Pod 状态 |
| GPU 不可用 | 缺少 Device Plugin | 安装 NVIDIA Device Plugin |

## 生产最佳实践

1. **适用场景**：边缘计算、IoT、开发测试、CI/CD
2. **存储选型**：生产用 etcd，开发测试用 SQLite
3. **安全加固**：启用 NetworkPolicy、限制 API Server 访问
4. **资源监控**：边缘设备资源有限，设置合理的资源限制
5. **升级策略**：使用 System Upgrade Controller 自动化升级

## 相关概念

- [[概念/kubernetes|Kubernetes]] — 标准 K8s
- [[概念/karmada|Karmada]] — 多集群编排
- [[概念/containerd|containerd]] — 容器运行时

## 系统要求

| 资源 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 1 核 | 2 核 |
| 内存 | 512MB | 2GB |
| 磁盘 | 1GB | 10GB |
| 操作系统 | Linux | Ubuntu 22.04+ |
| 架构 | x86_64/ARM64 | x86_64 |

## 总结

K3s 是 Rancher 推出的轻量级 Kubernetes 发行版，针对边缘计算、IoT、CI/CD 和资源受限场景优化。配合 Karmada 可实现云边协同，是边缘 AI 推理的理想选择。

---

> 💡 K3s 是边缘 AI 推理和轻量级容器管理的理想选择，配合 Karmada 可实现云边协同。

## 版本兼容性

| K3s 版本 | Kubernetes 版本 | 状态 |
|----------|----------------|------|
| v1.31.x | 1.31 | 稳定 |
| v1.30.x | 1.30 | 维护 |
| v1.29.x | 1.29 | EOL |

























