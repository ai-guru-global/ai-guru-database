---
title: "crictl 容器运行时调试工具 (CRI Container Runtime CLI)"
category: -concepts
tags: ["crictl", "cri", "containerd", "kubernetes", "debugging", "ai-stack"]
relationships:
  - target: "概念/nerdctl"
    type: related_to
  - target: "概念/kubectl"
    type: related_to
  - target: "概念/ascend-npu"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "crictl 是 CRI (Container Runtime Interface) 标准的容器调试 CLI，直接对接 containerd。AI Stack K8s 集群中用于底层容器排查，比 nerdctl/docker 更底层。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: archived
created: 2026-06-16
updated: 2026-07-21
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

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

- [[概念/nerdctl]] — nerdctl 容器管理 CLI
- [[概念/kubectl]] — kubectl Kubernetes CLI
- [[概念/containerd]] — containerd 容器运行时
- [[概念/cri]] — CRI 容器运行时接口
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 crictl 最佳实践

| 场景 | 命令 | 说明 |
|------|------|------|
| Pod 启动失败 | crictl ps -a | 查看容器状态 |
| 镜像问题 | crictl images | 检查本地镜像 |
| GPU 异常 | crictl inspect | 检查设备挂载 |

## 生产最佳实践

1. **排查专用**：生产环境仅用于排查，不用于日常操作
2. **与 kubectl 配合**：先用 kubectl 定位，再用 crictl 深入
3. **日志查看**：crictl logs 查看容器原始日志
4. **权限控制**：限制 crictl 使用权限

## crictl vs docker vs kubectl

| 工具 | 层级 | 用途 | 生产使用 |
|------|------|------|------|
| kubectl | K8s API | 集群管理 | ✅ 主要 |
| crictl | CRI | 容器运行时排查 | ⚠️ 排查 |
| docker | Docker | 镜像构建/开发 | ❌ 已弃用 |
| ctr | containerd | 底层调试 | ⚠️ 调试 |

## 常用 crictl 命令

| 命令 | 用途 |
|------|------|
| `crictl ps` | 列出运行容器 |
| `crictl ps -a` | 列出所有容器 |
| `crictl pods` | 列出 Pod |
| `crictl logs <container>` | 查看容器日志 |
| `crictl exec -it <container> bash` | 进入容器 |
| `crictl inspect <container>` | 容器详情 |
| `crictl images` | 列出镜像 |
| `crictl rmi <image>` | 删除镜像 |
| `crictl stats` | 容器资源统计 |

## crictl 配置

```bash
# /etc/crictl.yaml
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 10
debug: false
```

## 排查流程

| 步骤 | 命令 | 目的 |
|------|------|------|
| 1 | `kubectl get pods` | 定位问题 Pod |
| 2 | `kubectl describe pod` | 查看事件 |
| 3 | `crictl ps -a` | 查看容器状态 |
| 4 | `crictl logs` | 查看容器日志 |
| 5 | `crictl inspect` | 深入分析 |

## 与 containerd 关系

| 组件 | 说明 |
|------|------|
| containerd | 容器运行时守护进程 |
| CRI | 容器运行时接口 |
| crictl | CRI 命令行工具 |
| runc | OCI 运行时 |

> 💡 crictl 是 K8s 容器运行时排查的标准工具，2026 年生产环境仅用于故障排查，日常操作使用 kubectl。

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 连接失败 | socket 路径错误 | 检查 /etc/crictl.yaml |
| 权限拒绝 | 无权限访问 socket | 使用 sudo 或加入 docker 组 |
| 容器不存在 | 容器已终止 | 使用 crictl ps -a |
| 日志不完整 | 日志轮转 | 检查 kubelet 日志配置 |

## 安全注意事项

| 事项 | 说明 |
|------|------|
| 最小权限 | 限制 crictl 使用用户 |
| 审计日志 | 记录 crictl 操作 |
| 生产限制 | 仅用于排查，不用于日常 |
| 只读模式 | 排查时避免修改操作 |
