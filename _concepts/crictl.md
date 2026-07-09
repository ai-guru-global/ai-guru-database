---
title: "crictl 容器运行时调试工具 (CRI Container Runtime CLI)"
category: -concepts
tags: ["crictl", "cri", "containerd", "kubernetes", "debugging", "ai-stack"]
relationships:
  - target: "_concepts/nerdctl"
    type: related_to
  - target: "_concepts/kubectl"
    type: related_to
  - target: "_concepts/ascend-npu"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "crictl 是 CRI (Container Runtime Interface) 标准的容器调试 CLI，直接对接 containerd。AI Stack K8s 集群中用于底层容器排查，比 nerdctl/docker 更底层。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: supporting
---

# crictl 容器运行时调试工具

> **一句话理解**: crictl 是 K8s 的"容器手术刀"——绕过 K8s API 直接操作底层 containerd，用于排查 Pod 启动失败、镜像拉取异常等底层问题。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全名** | CRI Container Runtime CLI |
| **标准** | CRI (Container Runtime Interface) |
| **对接** | containerd / CRI-O |
| **角色** | 底层容器调试 |
| **与 nerdctl 区别** | crictl 更底层（CRI 协议） |

---

## 2. AI Stack 容器工具层级

```
AI Stack 容器工具层级
│
├── 应用层
│   └── kubectl（K8s 资源管理）
│
├── 容器管理层
│   ├── nerdctl（containerd 用户端）
│   ├── docker/podman（OCI 用户端）
│   └── helm（K8s 包管理）
│
├── CRI 调试层 ← 本文
│   ├── crictl（CRI 协议直接操作）
│   └── ctr（containerd 原生 CLI）
│
└── 运行时层
    └── containerd → runc（OCI 运行时）
```

---

## 3. 核心命令速查

| 命令 | 功能 | 示例 |
|------|------|------|
| `crictl ps` | 查看运行中容器 | `crictl ps --name vllm` |
| `crictl pods` | 查看 Pod 列表 | `crictl pods --state ready` |
| `crictl images` | 查看本地镜像 | `crictl images ls` |
| `crictl logs` | 查看容器日志 | `crictl logs <container-id>` |
| `crictl exec` | 进入容器执行 | `crictl exec -it <id> bash` |
| `crictl inspect` | 检查容器详情 | `crictl inspect <id>` |
| `crictl stats` | 容器资源使用 | `crictl stats` |
| `crictl pull` | 拉取镜像 | `crictl pull registry/model:tag` |

---

## 4. crictl vs 其他容器工具

| 维度 | crictl | nerdctl | docker | ctr |
|------|--------|---------|--------|-----|
| **协议** | CRI | Docker API | Docker API | containerd API |
| **对接** | containerd/CRI-O | containerd | dockerd | containerd |
| **用途** | 调试排查 | 日常使用 | 通用 | 底层调试 |
| **K8s 感知** | 部分（Pod 概念） | 否 | 否 | 否 |
| **生产推荐** | 排查专用 | 日常操作 | 不推荐(K8s) | 高级调试 |

---

## 5. 典型排查场景

| 场景 | 排查命令 |
|------|----------|
| Pod 启动失败 | `crictl ps -a` → `crictl logs <id>` |
| 镜像拉取失败 | `crictl images` → `crictl pull <image>` |
| GPU 容器异常 | `crictl inspect <id>` → 检查 device 挂载 |
| 容器 OOM | `crictl stats` → 检查内存限制 |
| 推理服务无响应 | `crictl exec -it <id> curl localhost:8000/health` |

---

## Related

- [[_concepts/nerdctl]] — nerdctl 容器管理 CLI
- [[_concepts/kubectl]] — kubectl Kubernetes CLI
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
