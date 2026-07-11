---
title: "Pod Disruption Budget"
category: -concepts
tags: ["kubernetes", "k8s", "resilience", "cloud-native", "alibaba-cloud"]
summary: "Pod Disruption Budget（PDB）是 Kubernetes 用于限制自愿中断（如节点维护、集群缩容）时同时不可用的 Pod 数量的保护机制，通过 minAvailable 或 maxUnavailable 与 Deployment/StatefulSet 配合，确保 AI 推理等关键服务在变更过程中保持最低可用副本。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "PDB"
  - "PodDisruptionBudget"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/pod"
    type: related_to
  - target: "概念/apsara-stack"
    type: related_to
sources: []
---

# Pod Disruption Budget

> **一句话理解**: PDB 是 K8s 对「自愿中断」的保险丝——节点维护、集群缩容时，它保证不会一次性把关键服务的 Pod 全部下线。

## 核心要点

- **自愿中断的防护**：PDB 只约束「自愿中断」（voluntary disruption），例如 `kubectl drain`、集群自动缩容、节点下线维护；它无法阻止节点宕机、OOMKilled、网络分区等非自愿中断。
- **两种配额表达方式**：通过 `minAvailable`（至少保留多少 Pod 可用）或 `maxUnavailable`（最多允许多少 Pod 同时不可用）来控制中断范围，二者不能同时用于同一 PDB。
- **通过 selector 绑定工作负载**：PDB 使用 `selector.matchLabels` 匹配 Pod，通常与 Deployment、ReplicaSet、StatefulSet 搭配使用；匹配不到 Pod 时不会生效。
- **阻塞式保护**：当驱逐某 Pod 会导致可用副本低于 PDB 阈值时，`kubectl drain` 或 Pod 驱逐 API 会被阻塞，并返回 `Cannot evict pod as it would violate the pod's disruption budget`。
- **AI 推理场景的关键配置**：大模型推理服务通常要求高可用，PDB 能避免在发布、节点轮换、缩容时全部副本同时不可用，降低推理中断风险。

## 典型 YAML / 命令示例

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ai-inference-pdb
  namespace: default
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: model-serving
      tier: inference
```

```yaml
# 使用 maxUnavailable 的等价写法（与 minAvailable 二选一）
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ai-inference-pdb
spec:
  maxUnavailable: 1
  selector:
    matchLabels:
      app: model-serving
```

```bash
# 查看当前命名空间下的 PDB
kubectl get pdb -n default

# 查看 PDB 详情与状态
kubectl describe pdb ai-inference-pdb -n default

# 查看 PDB 允许的 disruptions 数量
kubectl get pdb ai-inference-pdb -n default -o jsonpath='{.status.disruptionsAllowed}'
```

## 常见场景

| 场景 | 推荐配置 | 说明 |
|------|----------|------|
| **节点例行维护** | `minAvailable: 2` | 保证 drain 过程中至少保留 2 个推理 Pod 可用，维护窗口分批进行。 |
| **Deployment 滚动更新** | `maxUnavailable: 1` | 限制更新时最多 1 个副本不可用，避免推理服务全部中断。 |
| **集群自动缩容** | `minAvailable: ceil(replicas/2)` | 缩容触发 Pod 迁移时，保留半数以上副本可用。 |
| **无状态批量推理** | 不使用或宽松 PDB | 批处理任务可容忍中断，PDB 过严会阻碍节点维护。 |
| **ZooKeeper / Etcd 类有状态服务** | `minAvailable: quorum` | 保证多数派存活，防止因节点维护导致集群脑裂。 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版或飞天企业版容器服务中，PDB 同样是保障业务连续性的常用手段。专有云平台通常通过 Tianji 运维体系执行节点巡检、补丁升级或故障替换，这些操作会触发大量自愿中断；为 AI 推理、模型网关等关键服务配置合理的 PDB，可避免 ASCM 控制台发起的批量运维任务一次性驱逐过多 Pod。结合 X-Dragon 神龙计算与 Luoshen 网络的高性能转发，Pod 被重新调度后能快速恢复服务；若后端存储依赖 Pangu 或 Nüwa，PDB 也需要与存储挂载的可用域策略配合，防止计算副本保留但存储访问异常。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/pod|Pod]] — K8s 最小调度单元
- [[概念/kubectl|kubectl]] — K8s 命令行工具
- [[概念/apsara-stack|飞天企业版 Apsara Stack]] — 阿里云专有云
