---
title: "CRI（Container Runtime Interface）"
category: -concepts
tags: [cri, container-runtime, kubernetes, containerd, cri-o, docker]
aliases:
  - "CRI"
  - "Container Runtime Interface"
  - "容器运行时接口"
relationships:
  - target: "概念/containerd"
    type: implements
sources:
  - 概念/containerd.md
summary: "CRI（Container Runtime Interface）是 Kubernetes 定义的容器运行时标准接口，containerd 和 CRI-O 是其两个主流实现；kubelet 通过 CRI 与底层容器运行时通信。"
lifecycle: reviewed
tier: supporting
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-07-21
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

- [[概念/containerd]] — containerd（CRI 主流实现）
- [[概念/oci-runtime]] — OCI 运行时标准
- [[概念/docker]] — Docker 容器平台
- [[12_架构基建/AI_Stack_Container_Runtime_Guide]] — 容器运行时实践

---

## 2026 CRI 生态

| 实现 | 特点 | 适用场景 |
|------|------|----------|
| **containerd** | 工业标准、稳定 | 生产环境 |
| **CRI-O** | 轻量、专为 K8s | OpenShift |
| **Docker** | 开发友好 | 本地开发 |

## CRI API 核心操作

| 操作 | 说明 |
|------|------|
| **RunPodSandbox** | 创建 Pod 沙箱（网络命名空间） |
| **CreateContainer** | 在沙箱内创建容器 |
| **StartContainer** | 启动容器 |
| **StopContainer** | 停止容器 |
| **RemoveContainer** | 删除容器 |
| **ListContainers** | 列出容器 |
| **ContainerStatus** | 获取容器状态 |
| **ExecSync** | 在容器内执行命令 |
| **PullImage** | 拉取镜像 |
| **ImageStatus** | 获取镜像状态 |

## containerd vs CRI-O 详细对比

| 维度 | containerd | CRI-O |
|------|-----------|-------|
| 维护方 | CNCF/Docker | Red Hat/K8s SIG |
| 设计目标 | 通用容器运行时 | 专为 K8s 设计 |
| 功能范围 | 完整 | 最小化 |
| 镜像构建 | 支持 (nerdctl) | 不支持 |
| 流式处理 | 支持 | 支持 |
| GPU 支持 | nvidia-container-toolkit | nvidia-container-toolkit |
| 默认发行版 | 大多数 K8s | OpenShift |
| 资源占用 | 中 | 低 |

## GPU 集群 CRI 配置

```toml
# /etc/containerd/config.toml
version = 2

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.nvidia]
  runtime_type = "io.containerd.runc.v2"
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.nvidia.options]
    BinaryName = "/usr/bin/nvidia-container-runtime"

[plugins."io.containerd.grpc.v1.cri".containerd.default_runtime_name]
  default_runtime_name = "nvidia"
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Pod 创建失败 | CRI 连接异常 | 检查 containerd 服务状态 |
| 镜像拉取失败 | 网络/认证问题 | 检查 registry 配置和 secret |
| GPU 不可用 | runtime 未配置 | 检查 nvidia-container-toolkit |
| 容器启动慢 | 镜像过大 | 使用镜像预热和分层优化 |

## 生产最佳实践

1. **生产用 containerd**：稳定、高性能、CNCF 毕业项目
2. **GPU 配置**：containerd + nvidia-container-toolkit
3. **镜像格式**：使用 OCI 标准镜像格式
4. **运行时监控**：关注容器启动时间、资源使用
5. **版本管理**：保持 containerd 与 K8s 版本兼容

## 常用调试命令

```bash
# 查看 containerd 状态
systemctl status containerd

# 查看容器列表
crictl ps -a

# 查看镜像列表
crictl images

# 查看 Pod 沙箱
crictl pods

# 查看容器日志
crictl logs <container-id>

# 进入容器
crictl exec -it <container-id> /bin/sh

# 查看容器详细信息
crictl inspect <container-id>

# 拉取镜像
crictl pull nvcr.io/nvidia/pytorch:24.01-py3
```

## 性能优化

| 优化项 | 说明 |
|--------|------|
| 镜像预热 | 使用 `crictl pull` 预拉取大镜像 |
| 分层缓存 | 优化 Dockerfile 层顺序 |
| 并行拉取 | 调整 `max_concurrent_downloads` |
| 存储驱动 | 使用 overlayfs 提升性能 |

## 相关概念

- [[概念/containerd|containerd]] — CRI 主流实现
- [[概念/oci-runtime|OCI Runtime]] — 容器运行时标准
- [[概念/docker|Docker]] — 容器平台

> 💡 CRI 是 K8s 与容器运行时的解耦层，理解 CRI 有助于排查 GPU 集群容器启动和运行时问题。