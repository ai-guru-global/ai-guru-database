---
title: "containerd"
category: -concepts
tags: ["containerd", "container-runtime", "cri", "kubernetes", "docker", "cncf"]
relationships:
  - target: "_concepts/cri"
    type: implements
  - target: "_concepts/kubernetes"
    type: used_by
  - target: "_concepts/oci-runtime"
    type: related_to
  - target: "_concepts/docker"
    type: related_to
sources:
  - 架构基建/Architecture_Overview/AI_Infrastructure_2026
summary: "containerd 是 CNCF Graduated 的工业级容器运行时，实现了 Kubernetes CRI 接口，负责镜像拉取、容器生命周期管理和存储管理，是 K8s 默认推荐的容器引擎。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Containerd

---
# containerd

> Kubernetes 的「容器管家」——负责拉镜像、启停容器、管理存储和网络命名空间。

---

## 1. 一句话定义

**containerd** 是 CNCF Graduated 的工业级容器运行时，实现了 Kubernetes **CRI（Container Runtime Interface）** 接口。它负责镜像拉取、容器生命周期管理、存储卷挂载和网络命名空间配置，是 K8s 集群中最常用的底层容器引擎。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **镜像管理** | 拉取、推送、解压、缓存容器镜像 |
| **容器生命周期** | 创建、启动、停止、删除容器 |
| **CRI 实现** | 与 Kubernetes kubelet 对接 |
| **快照管理** | 支持 overlayfs、zfs、btrfs 等存储驱动 |
| **CDI 支持** | 可将 GPU/NPU 等设备通过 CDI 规范注入容器 |
| **OCI 兼容** | 符合 OCI Runtime 和 Image 规范 |

---

## 3. 架构组件

```
containerd
  ├── Client API (gRPC)
  ├── Image Service
  ├── Content Store
  ├── Snapshotter
  ├── Runtime (runc/crun)
  └── Task Service
```

---

## 4. 典型场景

1. **Kubernetes 节点运行时**：几乎所有现代 K8s 发行版的默认选择。
2. **GPU AI 容器**：配合 nvidia-container-runtime 运行 CUDA 工作负载。
3. **边缘设备**：轻量、稳定，适合资源受限环境。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | 通过 CRI 调用 containerd |
| **Docker** | Docker 早期基于 containerd，现 containerd 独立发展 |
| **CRI-O** | 另一个 CRI 运行时，Red Hat 主导 |
| **runc** | containerd 默认使用的底层 OCI 运行时 |
| **CDI** | containerd 1.14+ 支持 CDI 设备注入 |

---

## 6. 常用命令

```bash
# 查看容器
ctr -n k8s.io containers list

# 查看镜像
crictl images

# 查看容器运行时状态
systemctl status containerd
```

---

## Related

- [[_concepts/kubernetes]] — Kubernetes
- [[_concepts/cri]] — CRI 容器运行时接口
- [[_concepts/oci-runtime]] — OCI Runtime
- [[_concepts/cdi]] — CDI 容器设备接口
- [[架构基建/Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026
