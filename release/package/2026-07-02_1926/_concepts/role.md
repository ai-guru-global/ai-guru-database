---
title: "Role"
category: -concepts
tags: ["kubernetes", "k8s", "role", "cloud-native", "alibaba-cloud"]
summary: "Role 是 Kubernetes 命名空间级别的 RBAC 权限集合，通过 RoleBinding 绑定到用户或 ServiceAccount，决定主体能在指定 namespace 内执行哪些 API 操作。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Kubernetes Role"
  - "K8s Role"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/rbac"
    type: part_of
  - target: "_concepts/serviceaccount"
    type: related_to
sources: []
---

# Role

> **一句话理解**: Role 是 Kubernetes 里限定在某个 namespace 内的「岗位说明书」——它声明了谁能在这个命名空间里对哪些资源做什么操作。

## 核心要点

- **namespace 级别权限**: Role 的作用域仅限其所在的 namespace，无法跨 namespace 授权。如果需要集群级权限，应使用 ClusterRole。
- **由 rules 组成**: 每条 rule 通过 `apiGroups`、`resources`、`verbs` 定义允许的操作，遵循最小权限原则，只授予完成任务所需的最小 API 权限。
- **必须与 RoleBinding 配合**: Role 本身不直接赋权给主体，需要通过 RoleBinding 将 Role 绑定到 User、Group 或 ServiceAccount。
- **resources 不写 namespace**: Role 的 rules 中只声明资源类型（如 `configmaps`、`pods`），不写具体 namespace，因为 Role 已经隶属于某个 namespace。
- **常见最小权限场景**: 给推理服务 ServiceAccount 只读 ConfigMap 权限、给 CI/CD 账号只读 Secret 权限、给运维账号某个 namespace 的 Pod 管理权限。
- **与 ClusterRole 的区别**: Role 仅对单个 namespace 生效，适合多租户隔离；ClusterRole 对整个集群生效，适合节点、namespace、集群角色等全局资源。

## 典型 YAML / 命令示例

### 创建一个只读 ConfigMap 的 Role 并绑定到 ServiceAccount

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: configmap-reader
  namespace: model-serving
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-configmaps
  namespace: model-serving
subjects:
  - kind: ServiceAccount
    name: ai-inference-sa
    namespace: model-serving
roleRef:
  kind: Role
  name: configmap-reader
  apiGroup: rbac.authorization.k8s.io
```

### 常用 kubectl 命令

```bash
# 查看某个 namespace 下的所有 Role
kubectl get roles -n model-serving

# 查看 Role 详情
kubectl describe role configmap-reader -n model-serving

# 查看 RoleBinding
kubectl get rolebindings -n model-serving

# 验证某个 ServiceAccount 的权限
kubectl auth can-i get configmaps \
  --as=system:serviceaccount:model-serving:ai-inference-sa \
  -n model-serving
```

## 选型对比

| 维度 | Role | ClusterRole |
|------|------|-------------|
| **作用范围** | 单个 namespace | 整个集群 |
| **绑定对象** | RoleBinding | ClusterRoleBinding 或 RoleBinding |
| **适用资源** | Pod、ConfigMap、Secret 等命名空间资源 | Node、Namespace、PersistentVolume、ClusterRole 等集群资源 |
| **多租户场景** | 推荐，用于 namespace 级别隔离 | 谨慎使用，通常用于集群管理员或系统组件 |
| **典型示例** | 应用 ServiceAccount 只读配置 | 监控组件读取所有节点信息 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专有版 / 敏捷版环境中，Role 是实现多租户 namespace 隔离和最小权限的基础资源。平台管理员通常为不同业务团队或 AI 应用划分独立的 namespace，并通过 Role + RoleBinding 限制团队只能操作本 namespace 内的 Pod、Service、ConfigMap 等资源。上层 ASCM 或 Tianji 控制台可能将企业组织架构映射为 K8s 用户/用户组，最终仍需落到 Role / ClusterRole 的 RBAC 规则上；对于需要访问 OSS、SLB 等云资源的 Pod，通常还需配合 RAM 角色或云凭证机制，与 K8s Role 分层管理。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/rbac|RBAC]] — 基于角色的访问控制
- [[_concepts/serviceaccount|ServiceAccount]] — Pod 在集群中的身份标识
