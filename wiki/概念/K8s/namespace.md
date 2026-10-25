---
title: "Namespace"
category: -concepts
tags: ["kubernetes", "k8s", "namespace", "cloud-native", "alibaba-cloud"]
summary: "Namespace 是 Kubernetes 在单一集群内划分的逻辑边界，用于按团队、项目或环境组织资源，并实现访问控制与资源配额的软隔离。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Namespace"
  - "命名空间"
relationships:
  - target: "概念/kubernetes"
    type: part_of
  - target: "概念/pod"
    type: contains
  - target: "概念/service"
    type: contains
  - target: "概念/resource-quota"
    type: related_to
  - target: "概念/rbac"
    type: related_to
sources: []
name_zh: "K8s 命名空间"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# Namespace

> 中文简称：K8s 命名空间

> **一句话理解**: Namespace 是 K8s 集群里的「虚拟文件夹」，把 Pod、Service、ConfigMap 等资源按团队或项目分组，实现逻辑隔离与权限边界的软隔离。

## 核心要点

- **逻辑隔离边界**：同一 Namespace 内资源名必须唯一，不同 Namespace 之间可以存在同名资源。
- **资源组织方式**：通常按团队、项目或环境（如 dev / test / prod）划分 Namespace，便于管理与排障。
- **权限作用域**：RBAC 的 Role 与 RoleBinding 以 Namespace 为作用域，ClusterRole/ClusterBinding 则跨 Namespace。
- **配额控制单元**：ResourceQuota 与 LimitRange 必须绑定到具体 Namespace，限制该空间内的 CPU、内存、Pod 数量等。
- **服务发现范围**：Service 的短 DNS 名（如 `my-svc`）默认只在同 Namespace 内解析，跨 Namespace 需使用 `svc-name.namespace.svc.cluster.local`。
- **非安全沙箱**：Namespace 提供的是逻辑隔离而非强安全隔离，节点、网络、镜像等层面仍需额外加固。

## 典型 YAML / 命令示例

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ai-platform-dev
  labels:
    env: dev
    team: ai-platform
```

```bash
# 创建 Namespace
kubectl apply -f namespace.yaml

# 列出所有 Namespace
kubectl get namespaces

# 在指定 Namespace 中创建资源
kubectl create deployment nginx --image=nginx -n ai-platform-dev

# 切换当前 context 的默认 Namespace
kubectl config set-context --current --namespace=ai-platform-dev

# 查看某 Namespace 下所有常见资源
kubectl get all -n ai-platform-dev

# 为 Namespace 设置 ResourceQuota
kubectl apply -f - <<EOF
apiVersion: v1
kind: ResourceQuota
metadata:
  name: ai-platform-quota
  namespace: ai-platform-dev
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    pods: "20"
EOF
```

## 常见场景

| 场景 | 典型做法 | 注意事项 |
|------|----------|----------|
| 多团队共享集群 | 每团队或每应用分配独立 Namespace | 配合 RBAC 与 ResourceQuota 防止越权与资源抢占 |
| 多环境隔离 | dev、test、staging、prod 各建 Namespace | 生产环境建议独立集群或更强的网络/节点隔离 |
| 项目级成本分摊 | 通过 Namespace 标签汇总资源用量 | 可与监控、计费系统对接，按项目统计成本 |
| 临时测试/灰度 | 创建临时 Namespace，验证后删除 | 使用 `kubectl create ns` 与 `kubectl delete ns` 快速清理 |
| 平台系统组件隔离 | kube-system、ingress-nginx 等系统 Namespace | 普通用户应避免修改系统 Namespace，防止影响集群稳定性 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版与专有版中，Namespace 是 ASCM（阿里云专有云管理平台）进行多租户资源分区的基本单元。管理员可通过 ASCM 为不同部门或应用分配 Namespace，并绑定 ResourceQuota 与 RAM/ASCM 角色策略；在 X-Dragon 服务器与 Luoshen 网络底座之上，Namespace 提供逻辑隔离，而底层计算、网络与存储资源仍由 Tianji 统一运维调度。实际处理工单时，系统常要求提供具体 Namespace 名称，以便快速定位 Pod、Service 与事件。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/pod|Pod]] — Namespace 内的最小调度单元
- [[概念/service|Service]] — Namespace 内的服务发现
- [[概念/deployment|Deployment]] — 常用命名空间级工作负载
- [[概念/resource-quota|ResourceQuota]] — 命名空间资源配额
- [[概念/rbac|RBAC]] — 命名空间权限控制
- [[概念/network-policy|NetworkPolicy]] — 网络策略

---

## 2026 Namespace 最佳实践

| 场景 | 划分方式 | 说明 |
|------|----------|------|
| 多团队 | 按团队/项目 | 配合 RBAC 和 Quota |
| 多环境 | dev/test/prod | 生产建议独立集群 |
| 系统组件 | kube-system | 避免普通用户修改 |

## 生产最佳实践

1. **合理划分**：按团队/项目/环境划分 Namespace
2. **配额限制**：每个 Namespace 设置 ResourceQuota
3. **网络策略**：启用 NetworkPolicy 限制跨 Namespace 访问
4. **命名规范**：使用有意义的命名，便于管理

## Namespace 作用

| 作用 | 说明 |
|------|------|
| 资源隔离 | 不同 Namespace 资源独立 |
| 权限控制 | RBAC 按 Namespace 授权 |
| 配额管理 | ResourceQuota 限制总量 |
| 网络策略 | NetworkPolicy 隔离流量 |
| 资源命名 | 同名资源可共存 |

## 默认 Namespace

| Namespace | 用途 |
|------|------|
| default | 未指定 Namespace 的资源 |
| kube-system | K8s 系统组件 |
| kube-public | 公开资源 |
| kube-node-lease | 节点心跳 |

## Namespace 配置示例

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ml-team
  labels:
    team: ml
    environment: production
---
# 配合 ResourceQuota
apiVersion: v1
kind: ResourceQuota
metadata:
  name: ml-quota
  namespace: ml-team
spec:
  hard:
    requests.cpu: "100"
    requests.memory: 200Gi
    requests.nvidia.com/gpu: "16"
    limits.cpu: "200"
    limits.memory: 400Gi
    pods: "50"
    services: "20"
```

## AI 场景 Namespace 划分

| Namespace | 用途 | 资源配额 |
|------|------|------|
| ml-training | 训练任务 | GPU 配额高 |
| ml-inference | 推理服务 | GPU 配额中 |
| ml-data | 数据处理 | CPU/存储 |
| ml-dev | 开发测试 | 低配额 |
| ml-system | 平台组件 | 系统级 |

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get ns` | 列出 Namespace |
| `kubectl create ns <name>` | 创建 Namespace |
| `kubectl get pods -n <ns>` | 查看指定 NS 的 Pod |
| `kubectl config set-context --current --namespace=<ns>` | 切换默认 NS |

> 💡 Namespace 是 K8s 多租户隔离的基础，2026 年 AI 平台推荐按团队/环境/用途划分 Namespace + ResourceQuota。

## 注意事项

| 事项 | 说明 |
|------|------|
| 删除谨慎 | 删除 NS 会删除所有资源 |
| 跨 NS 访问 | 需要 RBAC 授权 |
| DNS 隔离 | service.ns.svc.cluster.local |
