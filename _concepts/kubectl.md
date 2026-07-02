---
title: "kubectl Kubernetes CLI (Kubernetes Command-Line Tool)"
category: -concepts
tags: ["kubectl", "kubernetes", "k8s", "cli", "ai-stack-ops", "container-orchestration"]
relationships:
  - target: "_concepts/kubernetes"
    type: builds_on
  - target: "_concepts/helm"
    type: related_to
  - target: "_concepts/nerdctl"
    type: related_to
  - target: "_concepts/containerd"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "kubectl 是 Kubernetes 的命令行工具，AI Stack 底层基于 K8s 编排，所有模型服务以容器形式运行，kubectl 是 K8s 工程师进行集群运维的核心工具。"
provenance:
  extracted: 0.25
  inferred: 0.65
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: supporting
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# kubectl Kubernetes CLI

> **一句话理解**: kubectl 是 K8s 的"遥控器"——所有容器编排操作都通过它执行，AI Stack 底层基于 K8s，运维必会。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全称** | Kubernetes Command-Line Tool |
| **安装** | 随 K8s 集群安装或单独下载 |
| **功能** | K8s 集群管理、Pod 操作、资源查看 |
| **AI Stack 角色** | K8s 编排工具，管理底层容器集群 |
| **适用角色** | K8s 工程师、平台工程师 |

---

## 2. AI Stack 中的 K8s 架构

AI Stack 底层基于 Kubernetes，所有模型服务以容器形式运行：

```
AI Stack K8s 架构
│
├── 控制台层
│   └── 可视化操作 → 转化为 K8s 资源操作
│
├── K8s 集群层
│   ├── kubectl ← 运维入口
│   ├── Pods — 模型推理服务
│   ├── Services — 服务发现与负载均衡
│   ├── Deployments — 部署策略
│   ├── ConfigMaps — 配置管理
│   └── GPU 资源 — Device Plugin
│
└── 容器运行时层
    └── containerd ← 实际运行容器
```

---

## 3. 核心命令速查

### 3.1 资源查看

```bash
# 查看所有 Pod
kubectl get pods -A

# 查看 AI Stack 命名空间的 Pod
kubectl get pods -n aio-system

# 查看 GPU 资源分配
kubectl describe node <node-name> | grep -A5 "Allocatable"

# 查看 Service
kubectl get svc -A

# 查看 Deployment
kubectl get deploy -A

# 查看资源用量
kubectl top pods -n aio-system
kubectl top nodes
```

### 3.2 Pod 管理

```bash
# 查看 Pod 日志
kubectl logs <pod-name> -n <namespace> -f

# 进入 Pod
kubectl exec -it <pod-name> -n <namespace> -- /bin/bash

# 重启 Pod（通过删除触发重建）
kubectl delete pod <pod-name> -n <namespace>  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]

# 查看 Pod 详情（故障排查）
kubectl describe pod <pod-name> -n <namespace>

# 端口转发（本地调试）
kubectl port-forward svc/<service-name> 8080:80 -n <namespace>
```

### 3.3 GPU 资源查看

```bash
# 查看节点 GPU 资源
kubectl get nodes -o json | jq '.items[].status.allocatable'

# 查看 GPU Pod 状态
kubectl get pods -l gpu=true -A

# 查看 NVIDIA Device Plugin
kubectl get pods -n kube-system | grep nvidia
```

---

## 4. AI Stack 常用运维操作

### 4.1 查看模型服务状态

```bash
# 查看 AI Stack 所有服务
kubectl get all -n aio-system

# 查看推理服务 Pod
kubectl get pods -n aio-system -l app=model-serving

# 查看推理服务日志
kubectl logs -n aio-system -l app=model-serving -f --tail=100
```

### 4.2 故障排查流程

```
K8s 故障排查流程
│
├── 1. kubectl get pods — 查看 Pod 状态
│   ├── CrashLoopBackOff → 查看日志
│   ├── Pending → 检查资源调度
│   └── ImagePullBackOff → 检查镜像
│
├── 2. kubectl describe pod — 查看详情
│   ├── Events — 最近事件
│   ├── Conditions — Pod 条件
│   └── Containers — 容器状态
│
├── 3. kubectl logs — 查看应用日志
│   └── 定位应用层错误
│
└── 4. kubectl exec — 进入容器调试
    └── 检查文件、网络、进程
```

### 4.3 资源扩缩容

```bash
# 手动扩容 Deployment
kubectl scale deploy <name> --replicas=3 -n <namespace>

# 查看 HPA（水平自动扩缩容）
kubectl get hpa -A
```

---

## 5. 与其他容器工具的关系

| 工具 | 操作层 | 说明 |
|------|--------|------|
| **kubectl** | K8s 集群层 | Pod/Service/Deployment 管理 |
| **helm** | K8s 应用层 | 应用包管理（Chart） |
| **nerdctl** | 容器层 | 直接管理 containerd 容器 |
| **crictl** | CRI 层 | K8s 容器调试 |
| **ctr** | containerd 层 | 底层容器操作 |

### 层级关系

```
工具层级
│
├── 应用层: helm — 打包部署
├── 编排层: kubectl — K8s 资源管理 ← 本文
├── CRI 层: crictl — K8s 容器调试
├── 容器层: nerdctl — containerd CLI
└── 底层: ctr — containerd 原生操作
```

---

## 6. 常用配置文件 (kubeconfig)

| 文件 | 说明 |
|------|------|
| `~/.kube/config` | 默认 K8s 配置 |
| `KUBECONFIG` 环境变量 | 指定配置文件路径 |
| AI Stack 自动配置 | 安装时自动生成 |

```bash
# 查看当前 context
kubectl config current-context

# 切换 context
kubectl config use-context <context-name>

# 查看所有 context
kubectl config get-contexts
```

---

## Related

- [[_concepts/kubernetes]] — Kubernetes 编排
- [[_concepts/helm]] — Helm 包管理
- [[_concepts/nerdctl]] — nerdctl 容器管理
- [[_concepts/containerd]] — containerd 运行时
- [[_concepts/kustomize]] — Kustomize 配置管理
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
- [[_meta/Production_Safety_Policy|生产安全策略]] — 集群操作风险评估规范
