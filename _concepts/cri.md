---
title: "CRI（Container Runtime Interface）"
category: -concepts
tags: [cri, container-runtime, kubernetes, containerd, cri-o, docker]
aliases:
  - "CRI"
  - "Container Runtime Interface"
  - "容器运行时接口"
relationships:
  - target: "_concepts/containerd"
    type: implements
sources:
  - _concepts/containerd.md
summary: "CRI（Container Runtime Interface）是 Kubernetes 定义的容器运行时标准接口，containerd 和 CRI-O 是其两个主流实现；kubelet 通过 CRI 与底层容器运行时通信。"
lifecycle: reviewed
tier: supporting
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# CRI（Container Runtime Interface）

## 核心要点

- **定义**：Kubernetes 与容器运行时之间的标准 API 接口（Protocol Buffers + gRPC）。
- **设计目的**：把 K8s 与具体容器运行时解耦（之前 Docker 是唯一选择）。
- **主流 CRI 实现**：

| 实现 | 提供方 | 强项 |
|------|--------|------|
| **containerd** | CNCF 毕业 | 工业标准、稳定、高性能 |
| **CRI-O** | Red Hat / K8s 社区 | 轻量、专为 K8s 设计 |
| **Docker Shim** | Docker | 已弃用（K8s 1.24+） |

## 一句话解释

> CRI = "K8s 调用容器的标准接口"；通过它 K8s 不再绑定任何具体运行时。

## 工作示意

```
kubelet (K8s 节点 Agent)
   │
   │ gRPC (CRI 协议)
   ▼
CRI Runtime (containerd / CRI-O)
   │
   ├── Pull Image (从镜像仓库)
   ├── Create / Start / Stop Container
   ├── Exec Command (进入容器)
   └── Mount / Network / Resource 管理
```

## 与 OCI 的关系

```
CRI (Kubernetes <-> Runtime)
   ↓ 调用
OCI Runtime Spec (Runtime <-> OS)
   ↓ 标准
runc / crun (实际容器进程)
```

- **CRI**：K8s 与 Runtime 之间
- **OCI**：Runtime 与 OS 之间（创建容器的标准）
- **runc**：OCI 参考实现（实际创建 cgroup / namespace）

## 何时关注 CRI

✅ **需要关注**：
- 自建 K8s 集群选型（containerd vs CRI-O）
- 容器镜像格式演进（OCI Image Spec）
- GPU 集群配置（containerd + nvidia-container-toolkit）
- 边缘 K8s（k3s 默认 containerd）

⚠️ **无需关注**：
- 应用开发者（K8s 抽象层足够）
- 使用托管 K8s（EKS / GKE / AKS 已选好）

## Related

- [[_concepts/containerd]] — containerd（CRI 主流实现）
- [[12_Architecture_Infrastructure/AI_Stack_Container_Runtime_Guide]] — 容器运行时实践