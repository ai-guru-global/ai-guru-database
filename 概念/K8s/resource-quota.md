---
title: "Resource Quota"
category: -concepts
tags: ["kubernetes", "k8s", "resource-management", "cloud-native", "alibaba-cloud"]
summary: "Resource Quota 是 Kubernetes 命名空间级资源配额对象，用于限制 Namespace 内可创建的 Pod、Service、PVC、CPU、内存及扩展资源总量，防止单一租户耗尽集群资源。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "ResourceQuota"
  - "资源配额"
relationships:
  - target: "概念/kubernetes"
    type: "related_to"
  - target: "概念/namespace"
    type: "part_of"
  - target: "概念/limit-range"
    type: "related_to"
sources: []
---

# Resource Quota

> **一句话理解**: Resource Quota 是 Kubernetes 给 Namespace 设置的「资源预算」，防止某个业务/租户把集群 CPU、内存、Pod 数等核心资源用光。

## 核心要点

- **命名空间级限制**: Resource Quota 只能绑定到某个 Namespace，无法跨 Namespace 统计，适合多租户或按项目隔离资源。
- **两类配额维度**:
  - **对象数量**: 限制 Pod、Service、ConfigMap、Secret、PVC、Deployment 等 API 对象的最大数量。
  - **计算资源**: 限制 CPU、内存、GPU、本地存储等可分配资源的总量（`requests` 与 `limits` 可分别限制）。
- **Hard 与 Scopes**:
  - `hard` 中定义具体上限；`scopes` 可限定只对特定 Pod 生效，如 `Terminating`、`NotTerminating`、`BestEffort`、`NotBestEffort`。
- **Admission 拦截**: 由 kube-apiserver 的 ResourceQuota Admission Plugin 在创建/更新资源时校验，超出配额则请求直接失败。
- **调度前提**: 若 Quota 限制了 `requests.cpu`/`requests.memory`，Pod 必须显式声明 `resources.requests`，否则无法创建。
- **与 LimitRange 配合**: Resource Quota 管「总量上限」，LimitRange 管「单个对象默认值/上下限」，两者常一起使用。

## 典型 YAML / 命令示例

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: ai-team-quota
  namespace: ai-inference
spec:
  hard:
    # 对象数量限制
    pods: "20"
    services: "10"
    persistentvolumeclaims: "5"
    # 计算资源限制
    requests.cpu: "40"
    requests.memory: 80Gi
    limits.cpu: "80"
    limits.memory: 160Gi
    requests.nvidia.com/gpu: "8"
```

```bash
# 查看指定 Namespace 的 Resource Quota
kubectl get resourcequota -n ai-inference

# 查看配额使用详情
kubectl describe resourcequota ai-team-quota -n ai-inference

# 查看所有 Namespace 配额
kubectl get resourcequota --all-namespaces
```

## 常见场景

| 场景 | 关注点 | 建议配置 |
|------|--------|----------|
| **多租户隔离** | 防止某部门耗尽集群资源 | 按部门/项目划分 Namespace 并设置 Quota |
| **AI 推理资源池** | GPU、显存、CPU 资源受限 | 限制 `requests.nvidia.com/gpu` 与 `limits.memory` |
| **测试环境沙箱** | 避免测试 Pod 无限创建 | 限制 `pods`、`services` 数量上限 |
| **生产核心服务** | 保证核心业务预留资源 | 单独 Namespace + 较高 Quota，不与其他业务混用 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专有版 / 敏捷版场景中，Resource Quota 通常与 ASCM（阿里云专有云管理平台）的租户配额、部门资源池配合使用。平台管理员可在 ASCM 控制台按组织层级分配集群资源额度，下层 Namespace 再通过 Kubernetes Resource Quota 做二次细分，实现「平台级配额 → 集群级 Quota → Namespace 级 Quota」的多层资源治理，避免单一 AI 推理或大数据作业占用过多 CPU/GPU 资源。

## Related

- [[概念/kubernetes|Kubernetes]] — 容器编排平台
- [[概念/namespace|Namespace]] — Resource Quota 的作用范围
- [[概念/limit-range|LimitRange]] — 单对象资源限制与默认值
- [[概念/scheduler|Scheduler]] — 资源调度与配额的关系
- [[概念/pod|Pod]] — 受配额约束的最小调度单元
