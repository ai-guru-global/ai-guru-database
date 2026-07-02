---
title: "AI Stack K8s 编排指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "kubernetes", "kubectl", "helm", "k8s", "orchestration"]
summary: "> **一句话理解**: AI Stack 内部通过 K8s 编排工作负载，kubectl 用于集群管理排障，helm 用于安装 GPUStack 等 K8s 包；日常优先通过平台层操作，不直接修改集群。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ai Stack K8s Operations Guide"
  - "AI Stack K8s Operations Guide"
  - AI_Stack_K8s_Operations_Guide
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI Stack K8s 编排指南

> **一句话理解**: AI Stack 内部通过 K8s 编排工作负载，`kubectl` 用于集群管理排障，`helm` 用于安装 GPUStack 等 K8s 包；日常优先通过平台层操作，不直接修改集群。

---

## 1. 工具选型矩阵

| 工具 | 用途 | 推荐场景 | 风险等级 |
|------|------|----------|----------|
| **kubectl** | K8s 集群管理 | 查看 Pod、日志、事件、节点资源 | 中（只读安全，写操作需谨慎） |
| **helm** | K8s 包管理 | 安装/升级/回滚 GPUStack、Prometheus 等 chart | 高（影响集群组件） |

---

## 2. 常用命令

### 2.1 kubectl

```bash
# 查看节点与 GPU 资源
kubectl get nodes -o wide
kubectl describe node <node-name>

# 查看 Pod 状态
kubectl get pods -n <namespace>
kubectl get pods -n <namespace> -o wide

# 查看 Pod 事件与详情
kubectl describe pod <pod-name> -n <namespace>

# 查看日志
kubectl logs <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --tail=100 -f

# 多容器 Pod 查看指定容器日志
kubectl logs <pod-name> -c <container-name> -n <namespace>

# 进入容器排查
kubectl exec -it <pod-name> -n <namespace> -- /bin/bash

# 查看 GPU 调度情况（需安装相关 CRD）
kubectl get pods -n <namespace> -o custom-columns=\
  "NAME:.metadata.name,GPU:.spec.containers[*].resources.limits.nvidia\.com/gpu"

# 导出 Pod YAML 用于审计
kubectl get pod <pod-name> -n <namespace> -o yaml > /tmp/pod.yaml
```

### 2.2 helm

```bash
# 添加 GPUStack chart 仓库
helm repo add gpustack https://gpustack.ai/helm-charts
helm repo update

# 安装 GPUStack
helm install gpuStack gpustack/gpustack -n gpustack --create-namespace

# 查看已安装 release
helm list -A

# 升级
helm upgrade gpuStack gpustack/gpustack -n gpustack

# 回滚
helm rollback gpuStack <revision> -n gpustack

# 查看 chart 值
helm show values gpustack/gpustack
```

---

## 3. 生产环境 Checklist

- [ ] 集群访问权限按最小权限原则分配，生产环境避免使用 `cluster-admin` 日常操作。
- [ ] 所有变更通过 GitOps / Helm / ArgoCD 等版本化方式管理，禁止直接 `kubectl edit` 生产负载。
- [ ] 命名空间按团队/环境隔离，配置 ResourceQuota 和 LimitRange。
- [ ] GPU 节点打标签并配置 node selector/affinity/taint-toleration，避免 CPU 负载抢占 GPU 节点。
- [ ] 安装并配置 GPU device plugin（NVIDIA Device Plugin / 国产对应插件）和 GPU 监控 DaemonSet。
- [ ] 关键 AI 服务配置 PodDisruptionBudget、HPA/VPA、亲和性反亲和性，保证高可用。
- [ ] 日志、指标、事件统一接入可观测平台（如 Prometheus + Grafana + Loki）。
- [ ] Helm release 升级前在测试环境验证 values 变更，保留历史 revision 以便回滚。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| Pod 处于 Pending | `kubectl describe pod` | 资源不足、GPU 未调度、镜像拉取中 |
| Pod 处于 ImagePullBackOff | `kubectl describe pod` / `crictl images` | 镜像不存在、仓库鉴权失败、网络不通 |
| Pod CrashLoopBackOff | `kubectl logs --previous` | 启动命令错误、依赖缺失、OOMKilled |
| GPU 未调度 | `kubectl describe node` | Device Plugin 未运行、资源名错误 |
| 节点 NotReady | `kubectl describe node` |  kubelet/容器运行时/网络异常 |
| Helm 安装失败 | `helm status <release> -n <ns>` | values 错误、CRD 未预装、权限不足 |
| 服务无响应 | `kubectl get svc -n <ns>` / `kubectl port-forward` | Service selector 错误、Endpoints 为空 |

---

## 5. AI Stack 与 K8s 的边界

| 层级 | 推荐操作方式 | 说明 |
|------|--------------|------|
| **平台控制台 / aioController** | 首选 | 模型部署、扩缩容、监控、日志聚合 |
| **kubectl（只读）** | 排障时使用 | `get`、`logs`、`describe` |
| **kubectl（写操作）** | 受限使用 | 仅在应急或平台未覆盖场景 |
| **helm** | 变更评审后使用 | 安装/升级基础设施组件 |

---

## Related

- [[12_Architecture_Infrastructure/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_Architecture_Infrastructure/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Exclusive_Tools_Guide|AI Stack 专属运维工具指南]]
- [[12_Architecture_Infrastructure/Hardware_Compute/CDI_Deep_Dive|CDI: 容器设备接口标准]]
- [[12_Architecture_Infrastructure/Hardware_Compute/DRA_Deep_Dive|DRA: 动态资源分配]]
- [[13_AI_Ops/AI_Ops_2026|AI Ops 2026: 智能运维体系与实践]]
