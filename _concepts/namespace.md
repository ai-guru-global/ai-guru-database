---
title: "Namespace"
category: -concepts
tags: ["kubernetes", "k8s", "namespace", "cloud-native", "alibaba-cloud"]
summary: "Namespace 是 Kubernetes 在单一集群内划分的逻辑边界，用于按团队、项目或环境组织资源，并实现访问控制与资源配额的软隔离。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Namespace"
  - "命名空间"
relationships:
  - target: "_concepts/kubernetes"
    type: part_of
  - target: "_concepts/pod"
    type: contains
  - target: "_concepts/service"
    type: contains
  - target: "_concepts/resource-quota"
    type: related_to
  - target: "_concepts/rbac"
    type: related_to
---

# Namespace

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

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/pod|Pod]] — Namespace 内的最小调度单元
- [[_concepts/service|Service]] — Namespace 内的服务发现
- [[_concepts/deployment|Deployment]] — 常用命名空间级工作负载
- [[_concepts/resource-quota|ResourceQuota]] — 命名空间资源配额
- [[_concepts/rbac|RBAC]] — 命名空间权限控制
- [[_concepts/serviceaccount|ServiceAccount]] — 命名空间内服务身份
