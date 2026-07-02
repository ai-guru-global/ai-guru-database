---
title: "ClusterRole"
category: -concepts
tags: ["kubernetes", "k8s", "rbac", "cloud-native", "alibaba-cloud", "security"]
summary: "ClusterRole 是 Kubernetes 中集群级别的 RBAC 角色，用于定义跨所有命名空间乃至集群资源（如 Node、Namespace）的访问权限。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "ClusterRole"
  - "集群角色"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/rbac"
    type: part_of
provenance:
  extracted: 0.65
  inferred: 0.30
  ambiguous: 0.05
  base_confidence: 0.90
lifecycle: stable
---

# ClusterRole

> **一句话理解**: ClusterRole 是 Kubernetes 的「全局通行证」——它定义了某个身份在整个集群范围内能对哪些资源执行什么操作。

## 核心要点

- **集群级作用域**：与 `Role`（Namespace 级别）不同，`ClusterRole` 的规则适用于所有 Namespace，也能授予 Node、Namespace、PersistentVolume、ClusterRole 本身等集群级资源的权限。
- **必须绑定才生效**：`ClusterRole` 本身不代表权限，需要通过 `ClusterRoleBinding`（集群范围）或 `RoleBinding`（单个 Namespace）绑定到 User、Group 或 ServiceAccount。
- **最小权限原则**：只授予完成工作所需的 verb，例如 `get`、`list`、`watch`、`create`、`update`、`patch`、`delete`，尽量避免使用 `*` 通配符。
- **聚合角色**：可使用 `aggregationRule` 与 `clusterRoleSelectors` 自动合并带特定标签的 ClusterRole，便于平台级权限组装。
- **内置默认角色**：K8s 预置了 `cluster-admin`、`admin`、`edit`、`view` 等 ClusterRole，可作为常用分权起点。

## 典型 YAML / 命令示例

```yaml
# 跨 Namespace 只读 Pod、Service、Deployment 的 ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: global-reader
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]
---
# 绑定给 monitoring namespace 中的 ServiceAccount
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: global-reader-binding
subjects:
  - kind: ServiceAccount
    name: monitor
    namespace: monitoring
roleRef:
  kind: ClusterRole
  name: global-reader
  apiGroup: rbac.authorization.k8s.io
```

```bash
# 查看所有 ClusterRole
kubectl get clusterroles

# 查看某个 ClusterRole 的详细规则
kubectl describe clusterrole global-reader

# 验证某 ServiceAccount 是否拥有跨 Namespace 读 Pod 的权限
kubectl auth can-i get pods --as=system:serviceaccount:monitoring:monitor -A
```

## 常见场景

| 场景 | 推荐做法 | 说明 |
|------|----------|------|
| 平台级监控 Agent | `ClusterRole` + `ClusterRoleBinding` | 需要读取所有 Namespace 的 Pod、Node、Endpoint 等指标 |
| 多 Namespace CI/CD | `ClusterRole` 绑定到 ServiceAccount | 流水线需要在多个 Namespace 中部署或查看资源 |
| 集群运维只读视图 | 自定义 readonly ClusterRole | 比内置 `view` 更窄，避免暴露 Secret 等敏感资源 |
| 单 Namespace 应用 | 优先使用 `Role` + `RoleBinding` | 遵循最小权限，不放大到全集群 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版 / 专属版以及 ASCM 多集群管理体系中，`ClusterRole` 与 `ClusterRoleBinding` 仍是 K8s API 层授权的核心对象。平台通常会预置租户管理员、只读审计、运维操作员等集群级角色，并通过对接企业账号或 SSO 将外部身份映射为 Group，再绑定到 `ClusterRole`；底层 Tianji 与 Luoshen 负责资源调度与网络转发，而 `ClusterRole` 则控制谁能通过 kube-apiserver 操作这些资源。实际排障时可通过 `kubectl auth can-i` 快速验证账号在专有云集群中的真实权限。

## Related

- [[_concepts/kubernetes|Kubernetes]] — 容器编排平台
- [[_concepts/rbac|RBAC 基于角色的访问控制]] — ClusterRole 所属的授权模型
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive|AI Stack 深度解析]] — 安全与 RBAC 实践
