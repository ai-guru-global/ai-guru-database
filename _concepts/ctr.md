---
title: "ctr containerd 原生 CLI (ctr - containerd CLI)"
category: -concepts
tags: ["ctr", "containerd", "cli", "container-debugging", "kubernetes"]
relationships:
  - target: "_concepts/crictl"
    type: related_to
  - target: "_concepts/container-runtime"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "ctr 是 containerd 自带的原生命令行工具，用于直接与 containerd 守护进程交互——管理容器、镜像、快照、任务等。与 crictl 互补，是 AI Stack 底层容器调试的重要工具。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
---

# ctr containerd 原生 CLI

> **一句话理解**: ctr 是 containerd 的"亲儿子 CLI"——直接跟 containerd 对话，管理容器/镜像/快照/任务，比 crictl 更底层。

---

## 1. 定位与作用

| 维度 | 说明 |
|------|------|
| **全称** | containerd CLI (ctr) |
| **来源** | containerd 项目自带的命令行工具 |
| **协议** | 直接调用 containerd gRPC API |
| **定位** | containerd 原生调试/管理工具 |
| **对比** | crictl 遵循 CRI 标准，ctr 直连 containerd |

### 与 crictl 的区别

| 特性 | ctr | crictl |
|------|-----|--------|
| 通信方式 | 直连 containerd API | 通过 CRI 接口 |
| 功能范围 | 全量（含快照、内容存储等） | CRI 子集 |
| Pod 感知 | 无 Pod 概念 | 感知 Pod/Sandbox |
| 使用场景 | 底层调试、镜像管理 | Kubernetes 容器调试 |
| 安装 | containerd 自带 | 需单独安装 |

---

## 2. 核心命令

### 2.1 容器与任务管理

```bash
# 列出所有容器
ctr containers ls

# 列出运行中的任务
ctr tasks ls

# 启动容器
ctr run -d docker.io/library/nginx:latest my-nginx

# 进入容器
ctr tasks exec --exec-id shell1 my-nginx /bin/sh

# 停止任务
ctr tasks kill my-nginx

# 删除容器
ctr containers rm my-nginx
```

### 2.2 镜像管理

```bash
# 拉取镜像
ctr images pull docker.io/library/ubuntu:22.04

# 列出本地镜像
ctr images ls

# 导出镜像
ctr images export ubuntu.tar docker.io/library/ubuntu:22.04

# 导入镜像
ctr images import ubuntu.tar

# 删除镜像
ctr images rm docker.io/library/ubuntu:22.04
```

### 2.3 快照与内容存储

```bash
# 列出快照
ctr snapshots ls

# 查看内容存储
ctr content ls

# 查看命名空间
ctr namespaces ls
```

### 2.4 命名空间

```bash
# containerd 支持命名空间隔离
ctr -n k8s.io containers ls    # K8s 管理的容器
ctr -n default containers ls   # 默认命名空间
```

---

## 3. AI Stack 中的应用

```
┌─────────────────────────────────────────┐
│         AI Stack 容器调试层次            │
├─────────────────────────────────────────┤
│                                         │
│  kubectl (K8s 层)                       │
│    ↓                                    │
│  crictl (CRI 层 - Pod 感知)             │
│    ↓                                    │
│  ctr (containerd 原生层 - 最底层)  ◄──  │
│    ↓                                    │
│  containerd (容器运行时)                │
│    ↓                                    │
│  runc / nvidia-container-runtime        │
│                                         │
└─────────────────────────────────────────┘
```

### 典型调试场景

| 场景 | ctr 命令 | 用途 |
|------|----------|------|
| GPU 容器启动失败 | `ctr -n k8s.io containers ls` | 查看 K8s 管理的容器状态 |
| 镜像拉取问题 | `ctr images pull --all-platforms` | 多架构镜像拉取 |
| 容器快照排查 | `ctr snapshots ls` | 查看容器文件系统快照 |
| 内容完整性检查 | `ctr content ls` | 检查镜像层内容 |

---

## 4. 常用调试技巧

### 4.1 查看容器详细信息

```bash
# JSON 格式输出
ctr containers info my-container

# 查看容器进程
ctr tasks ps my-container
```

### 4.2 与 nvidia-container-runtime 配合

```bash
# 使用 NVIDIA 运行时启动 GPU 容器
ctr run --runtime io.containerd.runtime.v2.task \
    --env NVIDIA_VISIBLE_DEVICES=all \
    nvcr.io/nvidia/cuda:12.0-base gpu-test nvidia-smi
```

### 4.3 排查容器挂载

```bash
# 查看容器的挂载点
ctr containers info my-container | grep -A 20 mounts
```

---

## 5. 与其他工具的关系

```
ctr ←→ containerd (原生 API)
crictl ←→ containerd (CRI API)
kubectl ←→ kubelet ←→ CRI ←→ containerd
nerdctl ←→ containerd (Docker 兼容 CLI)
```

| 工具 | 角色 | 适用场景 |
|------|------|----------|
| **ctr** | containerd 原生 CLI | 底层调试、镜像/快照管理 |
| **crictl** | CRI 兼容 CLI | K8s 容器调试 |
| **nerdctl** | Docker 兼容 CLI | Docker 用户迁移 |
| **kubectl** | K8s CLI | 集群资源管理 |

---

## 6. 关键要点

1. **ctr 是 containerd 自带的**：安装 containerd 即有，无需额外安装
2. **比 crictl 更底层**：可以访问快照、内容存储等 CRI 不暴露的功能
3. **命名空间隔离**：K8s 容器在 `k8s.io` 命名空间，直接操作时注意区分
4. **调试终极手段**：当 crictl 和 kubectl 都无法定位问题时，用 ctr 直连排查
5. **AI Stack 场景**：GPU 容器调试、镜像层检查、运行时问题排查的底层工具
