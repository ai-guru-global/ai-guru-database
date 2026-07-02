---
title: "RoleBinding"
category: -concepts
tags: ["kubernetes", "k8s", "rolebinding", "rbac", "cloud-native", "alibaba-cloud"]
summary: "RoleBinding 是 Kubernetes RBAC 的命名空间级授权对象，用于将 Role 或 ClusterRole 的权限绑定到用户、用户组或 ServiceAccount。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "RoleBinding"
  - "角色绑定"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/rbac"
    type: part_of
  - target: "_concepts/serviceaccount"
    type: related_to
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# RoleBinding

> **一句话理解**: RoleBinding 是 K8s 的「授权通知书」——把某个 Role 或 ClusterRole 的权限授予用户、用户组或 ServiceAccount，且只在指定 Namespace 内生效。

## 核心要点

- **Namespace 级资源**：RoleBinding 本身属于某个 Namespace，其授予的权限仅在该 Namespace 内有效，不能跨 Namespace 生效。
- **绑定两种 Role**：可以引用同 Namespace 下的 `Role`，也可以引用集群级的 `ClusterRole`（此时只在当前 Namespace 复用其规则，权限仍被限制在该 Namespace）。
- **Subjects 支持三类主体**：`User`（用户名）、`Group`（用户组）或 `ServiceAccount`（服务账号）。其中 ServiceAccount 是工作负载（Pod）访问 API 最常用的身份。
- **权限可累积**：一个 Subject 可以被多个 RoleBinding/ClusterRoleBinding 绑定，最终权限是各角色权限的并集，遵循最小权限原则时应避免过度授权。
- **与 ClusterRoleBinding 的区别**：`ClusterRoleBinding` 在整个集群范围生效，常用于节点组件、集群管理员；`RoleBinding` 用于普通命名空间内的业务权限隔离。

## 典型 YAML / 命令示例

### 将 Role 绑定到 ServiceAccount

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: ai-apps
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: ai-apps
subjects:
  - kind: ServiceAccount
    name: model-serving-sa
    namespace: ai-apps
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### 将 ClusterRole 绑定到用户组（限定 Namespace）

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: dev-edit
  namespace: ai-apps
subjects:
  - kind: Group
    name: ai-developers
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: edit
  apiGroup: rbac.authorization.k8s.io
```

### 常用 kubectl 命令

```bash
# 查看某个 Namespace 下的 RoleBinding
kubectl get rolebinding -n ai-apps

# 查看 RoleBinding 详情
kubectl describe rolebinding read-pods -n ai-apps

# 验证 ServiceAccount 权限
kubectl auth can-i list pods \
  --as=system:serviceaccount:ai-apps:model-serving-sa \
  -n ai-apps
```

## 常见场景

| 场景 | 推荐做法 | 注意事项 |
|------|----------|----------|
| **给开发者只读权限** | RoleBinding 引用内置 `view` ClusterRole | 不要直接绑定 `cluster-admin` |
| **为 Pod 授予 API 访问权限** | RoleBinding 绑定到该 Pod 使用的 ServiceAccount | 每个应用单独建 SA，避免 default SA |
| **CI/CD 流水线部署** | RoleBinding 引用 `edit` ClusterRole 并绑定到 cicd-sa | 仅授权目标 Namespace，避免集群级权限 |
| **多租户隔离** | 每个租户 Namespace 内独立 RoleBinding | 配合 NetworkPolicy 做网络层隔离 |
| **临时排障授权** | 创建短期 RoleBinding，事后删除 | 使用 `kubectl delete rolebinding` 清理 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专用版/敏捷版中，RoleBinding 是标准 K8s RBAC 模型的核心组成部分，通常与 ASCM（Apsara Stack Cloud Management）中的 RAM 用户/用户组对接：ASCM 侧的用户或用户组通过联邦认证映射到 K8s 中的 User/Group，再由管理员在各业务 Namespace 内创建 RoleBinding 完成命名空间级授权。平台组件（如 Tianji 运维编排、Luoshen 网络相关组件）也会使用预设的 ServiceAccount 与 RoleBinding 来访问 kube-apiserver，遵循最小权限原则。

## Related

- [[_concepts/rbac|RBAC]] — K8s 基于角色的访问控制
- [[_concepts/serviceaccount|ServiceAccount]] — Pod 访问 API 的服务账号
- [[_concepts/kubernetes|Kubernetes]] — 容器编排平台
- [[_concepts/kubectl|kubectl]] — K8s 命令行工具
- [[_concepts/pod|Pod]] — K8s 最小调度单元
