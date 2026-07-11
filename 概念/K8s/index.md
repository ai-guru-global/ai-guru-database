---
title: "K8s 概念索引"
category: -concepts
tags: ["kubernetes", "k8s", "index", "ai"]
summary: "概念/K8s 目录导航索引，按 AI 核心关联度分类。"
updated: 2026-07-11
tier: core
---

# K8s 概念索引

> 本目录聚焦 **AI/机器学习场景下的 Kubernetes 知识**。通用云原生工具已归档至底部，仅作参考。

---

## AI 核心 K8s 概念

### AI/GPU 调度与推理

| 概念 | 说明 |
|------|------|
| [[hami]] | 异构算力管理与 GPU 共享 |
| [[gpu-operator]] | NVIDIA GPU Operator，自动化 GPU 驱动部署 |
| [[gpu-sharing]] | GPU 共享机制 |
| [[gpu-virtualization]] | GPU 虚拟化 |
| [[time-slicing]] | GPU 时间切片 |
| [[dra]] | Dynamic Resource Allocation（K8s 1.26+ GPU 资源分配） |
| [[cdi]] | Container Device Interface（设备暴露给容器） |
| [[kserve]] | KServe 模型推理框架 |
| [[kueue]] | Kueue 批作业排队调度 |
| [[volcano]] | Volcano 高性能批调度 |
| [[k3s]] | K3s 轻量 K8s（边缘 AI 常用） |
| [[nemo-guardrails]] | NeMo Guardrails（LLM 安全护栏） |
| [[guardrails]] | AI Guardrails 概念 |
| [[guardrails-ai]] | Guardrails AI 库 |
| [[stackops]] | AI Stack 专属运维工具 |

### K8s 核心工作负载

| 概念 | 说明 |
|------|------|
| [[kubernetes]] | Kubernetes 核心概念 |
| [[pod]] | Pod — 最小调度单元 |
| [[replicaset]] | ReplicaSet — 副本控制器 |
| [[statefulset]] | StatefulSet — 有状态工作负载 |
| [[daemonset]] | DaemonSet — 每节点运行 |
| [[job]] | Job — 批处理任务 |
| [[cronjob]] | CronJob — 定时任务 |

### K8s 网络与服务

| 概念 | 说明 |
|------|------|
| [[service]] | Service — 服务发现与负载均衡 |
| [[ingress]] | Ingress — HTTP 路由入口 |
| [[network-policy]] | NetworkPolicy — 网络隔离 |
| [[cni]] | Container Network Interface |
| [[namespace]] | Namespace — 逻辑隔离 |

### K8s 存储与配置

| 概念 | 说明 |
|------|------|
| [[configmap]] | ConfigMap — 配置注入 |
| [[secret]] | Secret — 敏感数据 |
| [[persistent-volume]] | PersistentVolume |
| [[persistent-volume-claim]] | PersistentVolumeClaim |
| [[csi]] | Container Storage Interface |

### K8s 调度与资源管理

| 概念 | 说明 |
|------|------|
| [[taint]] | Taint — 节点排斥（GPU 节点调度关键） |
| [[toleration]] | Toleration — 容忍度 |
| [[label]] | Label — 标签 |
| [[selector]] | Selector — 标签选择器 |
| [[resource-quota]] | ResourceQuota — 资源配额 |
| [[limit-range]] | LimitRange — 资源限制范围 |
| [[pod-disruption-budget]] | PodDisruptionBudget |
| [[horizontal-pod-autoscaler]] | HPA — 水平自动扩缩 |
| [[vertical-pod-autoscaler]] | VPA — 垂直自动扩缩 |

### K8s 安全与身份

| 概念 | 说明 |
|------|------|
| [[rbac]] | RBAC — 基于角色的访问控制 |
| [[serviceaccount]] | ServiceAccount |
| [[clusterrole]] | ClusterRole |
| [[clusterrolebinding]] | ClusterRoleBinding |
| [[rolebinding]] | RoleBinding |
| [[pod-security-standards]] | Pod Security Standards |

### K8s 工具链与容器运行时

| 概念 | 说明 |
|------|------|
| [[helm]] | Helm — 包管理 |
| [[cri]] | Container Runtime Interface |
| [[containerd]] | containerd 容器运行时 |
| [[oci-runtime]] | OCI Runtime 规范 |
| [[docker]] | Docker |

---

## 通用云原生工具（已归档）

> **说明**: 以下概念为通用云原生生态工具，与 AI/GPU/推理/训练核心关联度较低。文件保留但标记为 `tier: archived`，不再作为 AI 知识库重点维护。如需深入学习，请参考 [CNCF 官方文档](https://www.cncf.io/)。

### Service Mesh / 代理

- [[linkerd]] — 轻量服务网格
- [[istio]] — 全功能服务网格
- [[envoy]] — 高性能代理
- [[service-mesh]] — 服务网格概念

### GitOps / 多集群

- [[flux]] — GitOps 持续交付
- [[karmada]] — 多集群编排

### 安全扫描 / 策略

- [[falco]] — 运行时安全检测
- [[trivy]] — 漏洞与配置扫描
- [[detect-secrets]] — 密钥泄露检测
- [[sealed-secrets]] — Git 加密 Secret
- [[external-secrets-operator]] — 外部密钥同步
- [[kyverno]] — K8s 策略引擎
- [[opa]] — 通用策略引擎 (Rego)
- [[cert-manager]] — TLS 证书管理

### CLI 工具

- [[nerdctl]] — containerd CLI
- [[crictl]] — CRI 调试工具
