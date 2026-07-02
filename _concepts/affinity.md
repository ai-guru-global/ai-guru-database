---
title: "Affinity（亲和性调度）"
category: -concepts
tags: ["kubernetes", "k8s", "affinity", "cloud-native", "alibaba-cloud", "scheduling"]
summary: "Affinity 是 Kubernetes 的亲和性调度机制，通过 nodeAffinity、podAffinity 与 podAntiAffinity 控制 Pod 倾向于落在哪些节点或与哪些 Pod 共处/分离，从而实现负载分布、故障隔离与硬件感知的精细化调度，是 AI 推理与训练场景中的常用调度策略。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Affinity"
  - "Node Affinity"
  - "Pod Affinity"
  - "Pod Anti-Affinity"
  - "亲和性调度"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/pod"
    type: related_to
  - target: "_concepts/apsara-stack"
    type: related_to
sources: []
---

# Affinity（亲和性调度）

> **一句话理解**: Affinity 是 Kubernetes 让 Pod「更愿意」落在某些节点、靠近或远离某些 Pod 的调度规则，是 nodeSelector 的增强版。

## 核心要点

- **三大类型**：`nodeAffinity` 按节点标签亲和调度；`podAffinity` 让 Pod 倾向于与其他 Pod 落在同一拓扑域；`podAntiAffinity` 让 Pod 远离其他 Pod，实现分散部署。
- **软硬语义**：`preferredDuringSchedulingIgnoredDuringExecution` 为软约束（尽量满足），`requiredDuringSchedulingIgnoredDuringExecution` 为硬约束（必须满足，否则 Pending）。
- **拓扑域**：Pod 亲和/反亲和通过 `topologyKey` 定义作用范围，常用 `kubernetes.io/hostname`、zone/region 或自定义机架标签。
- **对比 nodeSelector**：nodeSelector 仅支持等值硬匹配，nodeAffinity 支持 In/NotIn/Exists/Gt/Lt 与软硬约束。
- **典型价值**：GPU 训练 Pod 调度到同 RDMA 交换机节点、微服务副本分散在不同宿主机、缓存代理贴近后端 Pod。
- **注意事项**：podAntiAffinity 在大规模集群会增加 kube-scheduler 开销；跨命名空间反亲和需显式配置 `namespaces` 或 `namespaceSelector`。

## 典型 YAML / 命令示例

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-inference
spec:
  replicas: 3
  selector:
    matchLabels:
      app: model-serving
  template:
    metadata:
      labels:
        app: model-serving
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: accelerator
                    operator: In
                    values: ["nvidia-a100"]
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              preference:
                matchExpressions:
                  - key: topology.kubernetes.io/zone
                    operator: In
                    values: ["zone-a"]
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: app
                    operator: In
                    values: ["model-serving"]
              topologyKey: kubernetes.io/hostname
      containers:
        - name: vllm
          image: registry.local/vllm/vllm-openai:v0.5.0
          resources:
            limits:
              nvidia.com/gpu: "1"
```

```bash
# 查看 Pod 被调度到的节点
kubectl get pods -l app=model-serving -o wide

# 查看调度事件
kubectl describe pod <pod-name> | grep -A5 Events

# 查看节点标签
kubectl get nodes --show-labels
```

## 选型对比

| 机制 | 作用对象 | 能力范围 | 软硬约束 | 适用场景 |
|------|----------|----------|----------|----------|
| **nodeSelector** | 节点标签 | 等值硬匹配 | 仅硬约束 | 简单 GPU 节点筛选 |
| **nodeAffinity** | 节点标签 | 支持 In/NotIn/Exists/Gt/Lt | 软 + 硬 | 硬件感知、多可用区优先 |
| **podAffinity** | Pod 标签 + 拓扑域 | 同域共处 | 软 + 硬 | 数据局部性、RDMA 训练同交换机 |
| **podAntiAffinity** | Pod 标签 + 拓扑域 | 同域分离 | 软 + 硬 | 副本打散、高可用 |
| **Taints / Tolerations** | 节点污点 + Pod 容忍 | 节点排斥 Pod | 仅硬约束 | 专用 GPU 节点 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）ACK 敏捷版中，Affinity 由 kube-scheduler 基于节点与 Pod 标签计算。平台基于 X-Dragon 神龙架构划分计算节点，并通过 Luoshen 网络在 zone/region 维度提供隔离与高性能转发；借助 Tianji 运维体系可为节点打上机柜、交换机、加速卡型号等标签，再利用 nodeAffinity 把 AI 训练 Pod 调度到同 RDMA 域节点，利用 podAntiAffinity 把推理副本分散到不同宿主机，提升容灾能力与网络吞吐。ASCM 的多租户配额也会影响可调度的节点池范围。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/pod|Pod]] — K8s 最小调度单元
- [[_concepts/kubectl|kubectl]] — K8s 命令行工具
- [[_concepts/apsara-stack|Apsara Stack]] — 阿里云专有云
- [[_concepts/containerd|containerd]] — 主流 CRI 实现
