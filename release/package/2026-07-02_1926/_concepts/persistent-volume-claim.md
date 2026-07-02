---
title: "PersistentVolumeClaim（PVC）"
category: -concepts
tags: ["kubernetes", "k8s", "storage", "cloud-native", "alibaba-cloud"]
summary: "PersistentVolumeClaim 是 Kubernetes 中 Pod 申请持久化存储的声明式对象，负责将工作负载与后端存储（云盘、NAS、OSS 等）解耦。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "PVC"
  - "PersistentVolumeClaim"
  - "持久卷声明"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/pod"
    type: used_by
  - target: "_concepts/statefulset"
    type: used_by
sources: []
---

# PersistentVolumeClaim（PVC）

> **一句话理解**: PVC 是 Pod 向 Kubernetes 集群「申请持久化存储」的工单，声明需要的容量和访问模式，由集群匹配后端 PersistentVolume。

## 核心要点

- **声明式抽象**: PVC 只描述应用对存储的需求（容量、读写模式、StorageClass），不绑定具体后端实现；后端 PersistentVolume（PV）由管理员或动态 Provisioner 提供。
- **生命周期独立 Pod**: PVC 与 PV 的绑定关系不因 Pod 重启、重建或重新调度而丢失，是 Stateful 应用（数据库、消息队列、模型仓库）的存储基座。
- **三种访问模式**: `ReadWriteOnce`（单节点读写，RWO）、`ReadOnlyMany`（多节点只读，ROX）、`ReadWriteMany`（多节点读写，RWX）；AI 场景中的共享数据集通常需要 RWX。
- **动态供给**: 通过 `StorageClass` 触发 CSI 插件自动创建云盘/NAS/OSS 等后端卷，减少人工预分配 PV 的运维成本。
- **调度依赖**: 使用 RWO 云盘的 Pod 会被 Scheduler 约束到 PV 所在可用区或节点，跨节点迁移时需要先解除挂载。

## 典型 YAML / 命令示例

```yaml
# pvc-example.yaml：申请一个 100Gi 的云盘，读写一次
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: model-data-pvc
  namespace: ai-serving
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: alicloud-disk-ssd
  resources:
    requests:
      storage: 100Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-server
  namespace: ai-serving
spec:
  replicas: 1
  selector:
    matchLabels:
      app: llm-server
  template:
    metadata:
      labels:
        app: llm-server
    spec:
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          volumeMounts:
            - name: model-storage
              mountPath: /models
      volumes:
        - name: model-storage
          persistentVolumeClaim:
            claimName: model-data-pvc
```

```bash
# 创建并查看 PVC
kubectl apply -f pvc-example.yaml
kubectl get pvc -n ai-serving
kubectl describe pvc model-data-pvc -n ai-serving

# 查看已绑定的 PV
kubectl get pv
```

## 选型对比

| 访问模式 | 适用后端 | 典型场景 | 注意事项 |
|----------|----------|----------|----------|
| **RWO** | 云盘（ESSD）、本地盘 | 数据库、单实例模型服务 | 只能挂载到一个节点，Pod 迁移受限 |
| **ROX** | NAS、对象存储 | 共享只读数据集、模型权重 | 多个 Pod 可同时只读挂载 |
| **RWX** | NAS、并行文件系统 | 多副本训练任务、共享 Checkpoint | 需要文件级共享存储支持 |
| ** ephemeral ** | emptyDir、内存盘 | 临时缓存、无状态推理 | Pod 销毁即丢失 |

## 阿里云专有云关联

在阿里云专有云中，PVC 通常通过 ACK 专用版或敏捷版集群的 CSI 插件对接后端存储：块存储可映射为 RWO 云盘，NAS 或 CPFS 提供 RWX 共享访问，OSS 适合大容量只读模型仓库。平台管理员可在 ASCM 控制台统一配置 StorageClass 和配额，开发团队只需提交 PVC 即可申请存储；天基/洛神等底层基础设施负责卷创建、挂载路径和网络打通。建议为 AI 训练场景优先选择支持 RWX 的共享存储，避免分布式训练任务因 RWO 云盘调度冲突而无法并行扩容。

## Related

- [[_concepts/kubernetes|Kubernetes]] — 容器编排平台
- [[_concepts/pod|Pod]] — PVC 的最终挂载对象
- [[_concepts/statefulset|StatefulSet]] — 常与 PVC 配合的有状态工作负载
- [[_concepts/configmap|ConfigMap]] — 配置数据挂载方式
