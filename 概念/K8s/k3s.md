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
---

# K3s

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

## 生产最佳实践

1. **适用场景**：边缘计算、IoT、开发测试、CI/CD
2. **存储选型**：生产用 etcd，开发测试用 SQLite
3. **安全加固**：启用 NetworkPolicy、限制 API Server 访问
4. **资源监控**：边缘设备资源有限，设置合理的资源限制
5. **升级策略**：使用 System Upgrade Controller 自动化升级
