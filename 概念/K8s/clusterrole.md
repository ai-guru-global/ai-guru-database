---
title: "ClusterRole"
category: -concepts
tags: ["kubernetes", "k8s", "rbac", "cloud-native", "alibaba-cloud", "security"]
summary: "ClusterRole 是 Kubernetes 中集群级别的 RBAC 角色，用于定义跨所有命名空间乃至集群资源（如 Node、Namespace）的访问权限。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "ClusterRole"
  - "集群角色"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/rbac"
    type: part_of
provenance:
  extracted: 0.65
  inferred: 0.30
  ambiguous: 0.05
  base_confidence: 0.90
lifecycle: reviewed
sources: []
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

- [[概念/kubernetes|Kubernetes]] — 容器编排平台
- [[概念/rbac|RBAC 基于角色的访问控制]] — ClusterRole 所属的授权模型
- [[概念/clusterrolebinding|ClusterRoleBinding]] — 集群角色绑定
- [[概念/serviceaccount|ServiceAccount]] — 服务账户
- [[12_架构基建/AI_Stack_Deep_Dive|AI Stack 深度解析]] — 安全与 RBAC 实践

---

## 2026 RBAC 最佳实践

| 场景 | 推荐角色 | 说明 |
|------|----------|------|
| 平台监控 | 自定义只读 ClusterRole | 读取所有 Namespace 指标 |
| CI/CD | 自定义部署角色 | 限制到必要 API 组 |
| 运维只读 | 自定义 readonly | 比 view 更窄 |

## 生产最佳实践

1. **最小权限**：只授予必要的 verb 和 resource
2. **避免通配符**：不使用 * 通配符
3. **定期审计**：检查 cluster-admin 绑定
4. **聚合角色**：使用 aggregationRule 组装权限

## ClusterRole vs Role

| 特性 | ClusterRole | Role |
|------|------|------|
| 作用域 | 集群级 | 命名空间级 |
| 资源类型 | 所有资源 | 命名空间内资源 |
| 绑定方式 | ClusterRoleBinding | RoleBinding |
| 适用场景 | 集群管理/跨 NS | 单 NS 权限 |

## 内置 ClusterRole

| ClusterRole | 权限 | 适用场景 |
|------|------|------|
| cluster-admin | 所有权限 | 集群管理员 |
| admin | NS 管理 (无 RBAC) | NS 管理员 |
| edit | 读写 (无 RBAC) | 开发者 |
| view | 只读 | 观察者 |

## ClusterRole 配置示例

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: gpu-manager
rules:
# GPU 节点管理
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
# Pod 管理
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch", "delete"]
# GPU 设备插件
- apiGroups: ["nvidia.com"]
  resources: ["*"]
  verbs: ["*"]
```

## 聚合 ClusterRole

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: []  # 自动聚合
```

## AI 场景 ClusterRole

| ClusterRole | 权限 | 适用场景 |
|------|------|------|
| gpu-admin | GPU 节点管理 | GPU 管理员 |
| training-admin | 训练任务管理 | 训练平台 |
| inference-admin | 推理服务管理 | 推理平台 |
| ml-namespace-admin | ML NS 管理 | 团队管理员 |

> 💡 ClusterRole 是 K8s 集群级权限的核心，2026 年 AI 平台推荐按职责划分 ClusterRole + 最小权限原则。

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get clusterroles` | 查看 ClusterRole |
| `kubectl describe clusterrole <name>` | 详情 |
| `kubectl get clusterrolebindings` | 查看绑定 |
| `kubectl auth can-i --list --as=system:serviceaccount:ns:sa` | 检查权限 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 权限不足 | ClusterRole 未绑定 | 创建 ClusterRoleBinding |
| 权限过大 | 使用了 cluster-admin | 创建自定义 ClusterRole |
| 跨 NS 访问失败 | 使用 Role 而非 ClusterRole | 改用 ClusterRole |
| 聚合不生效 | Label 不匹配 | 检查 clusterRoleSelectors |

## 最佳实践

| 实践 | 说明 |
|------|------|
| 最小权限 | 只授予必要权限 |
| 避免通配符 | 不使用 * |
| 定期审计 | 检查过度授权 |
| 职责分离 | 按角色划分 |
