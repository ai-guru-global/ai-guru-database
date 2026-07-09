---
title: "nerdctl 容器管理 CLI (nerdctl Container CLI)"
category: -concepts
tags: ["nerdctl", "containerd", "container", "docker-alternative", "ai-stack-ops", "kubernetes"]
relationships:
  - target: "_concepts/containerd"
    type: builds_on
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/helm"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "nerdctl 是 containerd 的原生 CLI 客户端，提供类 Docker 的容器管理体验。AI Stack 所有模型服务以 containerd 容器形式部署，nerdctl 是日常运维的核心工具。"
provenance:
  extracted: 0.35
  inferred: 0.55
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: supporting
---

# nerdctl 容器管理 CLI

> **一句话理解**: nerdctl 是 containerd 的"Docker 替代品"——兼容 Docker 命令，但更轻量，AI Stack 容器运维的首选工具。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全称** | nerdctl (containerd CLI) |
| **类型** | 容器管理命令行工具 |
| **维护方** | containerd 社区 |
| **底层** | containerd 容器运行时 |
| **兼容性** | Docker CLI 命令兼容 |
| **安装** | `apt install nerdctl` 或 GitHub Release |

---

## 2. AI Stack 容器工具链对比

AI Stack 提供多种容器管理工具，各有分工：

| 工具 | 底层运行时 | 定位 | AI Stack 角色 |
|------|-----------|------|--------------|
| **nerdctl** | containerd | 开发者友好 CLI | 日常容器管理 |
| **crictl** | CRI (containerd/CRI-O) | K8s 调试工具 | K8s 容器调试 |
| **ctr** | containerd | 原生低层 CLI | 底层调试 |
| **docker** | Docker Engine | 传统容器管理 | 兼容场景 |
| **podman** | libpod | 无守护进程 | 安全敏感场景 |

### 工具选择

```
AI Stack 容器工具选择
│
├── 日常容器管理 → nerdctl
│   └── 类 Docker 体验，推荐首选
│
├── K8s 容器调试 → crictl
│   └── 查看 K8s Pod/容器状态
│
├── 底层调试 → ctr
│   └── containerd 原生操作
│
└── Docker 兼容脚本 → docker
    └── 已有 Docker 脚本无需改动
```

---

## 3. 核心命令

### 3.1 容器管理

```bash
# 运行容器
nerdctl run -d --name my-model -p 8080:8080 my-image

# 列出运行中容器
nerdctl ps

# 列出所有容器
nerdctl ps -a

# 停止容器
nerdctl stop my-model

# 删除容器
nerdctl rm my-model

# 查看容器日志
nerdctl logs -f my-model

# 进入容器
nerdctl exec -it my-model /bin/bash

# 容器资源使用
nerdctl stats
```

### 3.2 镜像管理

```bash
# 拉取镜像
nerdctl pull registry.example.com/my-model:v1

# 列出本地镜像
nerdctl images

# 删除镜像
nerdctl rmi my-image:v1

# 构建镜像
nerdctl build -t my-model:v1 .

# 推送镜像
nerdctl push registry.example.com/my-model:v1

# 导入/导出镜像
nerdctl save -o my-model.tar my-model:v1
nerdctl load -i my-model.tar
```

### 3.3 命名空间

```bash
# 列出命名空间
nerdctl namespace ls

# 指定命名空间操作
nerdctl -n k8s.io ps        # 查看 K8s 容器
nerdctl -n default ps       # 查看默认容器
```

> **AI Stack 注意**: AI Stack 的模型服务容器通常在 `k8s.io` 命名空间下。

---

## 4. 与 Docker CLI 对比

| Docker 命令 | nerdctl 等价 | 差异 |
|-------------|-------------|------|
| `docker run` | `nerdctl run` | 基本一致 |
| `docker ps` | `nerdctl ps` | 基本一致 |
| `docker build` | `nerdctl build` | 使用 BuildKit |
| `docker compose` | `nerdctl compose` | 兼容 Compose |
| `docker volume` | `nerdctl volume` | 基本一致 |
| `docker network` | `nerdctl network` | 支持 CNI |
| `docker login` | `nerdctl login` | 兼容 |
| `docker swarm` | ❌ 不支持 | 使用 K8s 替代 |

### 关键差异

| 特性 | Docker | nerdctl |
|------|--------|---------|
| 守护进程 | dockerd | containerd |
| 架构 | Docker → containerd → runc | nerdctl → containerd → runc |
| 内存占用 | 较高 | 较低 |
| K8s 兼容 | 需 Docker Shim | 原生 CRI |
| 镜像构建 | Docker BuildKit | BuildKit (独立) |

---

## 5. crictl vs nerdctl

| 维度 | nerdctl | crictl |
|------|---------|--------|
| **目标用户** | 开发者、运维 | K8s 管理员 |
| **API** | containerd API | CRI (Container Runtime Interface) |
| **命令风格** | 类 Docker | 类 kubectl |
| **镜像构建** | 支持 (build) | 不支持 |
| **容器管理** | 完整 | 只读为主 |
| **K8s Pod** | 不直接管理 | 管理 K8s Pod |
| **典型场景** | 日常运维 | K8s 故障排查 |

```bash
# crictl 示例：查看 K8s 容器
crictl ps
crictl pods
crictl logs <container-id>
crictl inspect <container-id>

# nerdctl 示例：管理容器
nerdctl ps
nerdctl run -d my-image
nerdctl logs my-container
```

---

## 6. AI Stack 运维场景

### 6.1 查看模型服务容器

```bash
# 查看 AI Stack 模型服务状态
nerdctl -n k8s.io ps | grep model

# 查看模型服务日志
nerdctl -n k8s.io logs -f <container-id>

# 进入模型服务容器
nerdctl -n k8s.io exec -it <container-id> /bin/bash
```

### 6.2 镜像管理

```bash
# 查看 AI Stack 预置镜像
nerdctl images | grep aio

# 拉取自定义推理镜像
nerdctl pull my-registry/custom-model:v2

# 导出镜像备份
nerdctl save -o backup.tar my-model:latest
```

### 6.3 故障排查

```bash
# 容器资源占用
nerdctl stats

# 容器详细信息
nerdctl inspect <container-id>

# 查看 containerd 状态
systemctl status containerd

# 查看容器日志
nerdctl -n k8s.io logs <container-id> --tail 100
```

---

## 7. Compose 支持

```bash
# 使用 nerdctl compose（兼容 docker-compose.yml）
nerdctl compose up -d
nerdctl compose down
nerdctl compose logs -f
nerdctl compose ps
```

---

## Related

- [[_concepts/containerd]] — containerd 容器运行时
- [[_concepts/kubernetes]] — Kubernetes 编排
- [[_concepts/helm]] — Helm 包管理
- [[_concepts/kustomize]] — Kustomize 配置管理
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
