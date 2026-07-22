---
title: "PersistentVolumeClaim（PVC）"
category: -concepts
tags: ["kubernetes", "k8s", "storage", "cloud-native", "alibaba-cloud"]
summary: "PersistentVolumeClaim 是 Kubernetes 中 Pod 申请持久化存储的声明式对象，负责将工作负载与后端存储（云盘、NAS、OSS 等）解耦。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "PVC"
  - "PersistentVolumeClaim"
  - "持久卷声明"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/pod"
    type: used_by
  - target: "概念/statefulset"
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

- [[概念/kubernetes|Kubernetes]] — 容器编排平台
- [[概念/pod|Pod]] — PVC 的最终挂载对象
- [[概念/statefulset|StatefulSet]] — 常与 PVC 配合的有状态工作负载
- [[概念/persistent-volume|PersistentVolume]] — 持久卷
- [[概念/csi|CSI]] — 容器存储接口
- [[概念/configmap|ConfigMap]] — 配置数据挂载方式

---

## 2026 PVC 最佳实践

| 访问模式 | 适用场景 | 后端存储 |
|----------|----------|----------|
| RWO | 数据库、单实例服务 | 云盘、本地盘 |
| ROX | 共享只读数据集 | NAS、对象存储 |
| RWX | 多副本训练、共享 Checkpoint | NAS、并行文件系统 |

## 生产最佳实践

1. **AI 训练用 RWX**：分布式训练需要共享存储
2. **动态供给**：使用 StorageClass 自动创建 PV
3. **容量规划**：合理设置存储容量，避免浪费
4. **备份策略**：重要数据定期备份

## PVC 访问模式

| 模式 | 缩写 | 说明 | 适用场景 |
|------|------|------|------|
| ReadWriteOnce | RWO | 单节点读写 | 数据库/单 Pod |
| ReadOnlyMany | ROX | 多节点只读 | 共享配置 |
| ReadWriteMany | RWX | 多节点读写 | 分布式训练 |
| ReadWriteOncePod | RWOP | 单 Pod 读写 | 严格独占 |

## PVC 生命周期

| 阶段 | 说明 |
|------|------|
| Pending | 等待绑定 PV |
| Bound | 已绑定 PV |
| Lost | PV 丢失 |
| Terminating | 删除中 |

## PVC 配置示例

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: training-data
spec:
  accessModes:
    - ReadWriteMany  # 分布式训练需要
  storageClassName: nfs-client
  resources:
    requests:
      storage: 500Gi
---
# Pod 中使用
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: trainer
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: training-data
```

## 动态供给流程

| 步骤 | 说明 |
|------|------|
| 1 | 用户创建 PVC |
| 2 | PVC 引用 StorageClass |
| 3 | Provisioner 监听 PVC |
| 4 | 动态创建 PV |
| 5 | PVC 绑定 PV |
| 6 | Pod 挂载使用 |

## AI 场景存储需求

| 场景 | 访问模式 | 容量 | 性能要求 |
|------|------|------|------|
| 训练数据集 | RWX | 1-100 TB | 高吞吐 |
| 检查点 | RWX | 100 GB-1 TB | 高 IOPS |
| 模型仓库 | ROX | 10-100 GB | 中 |
| 日志 | RWO | 10-100 GB | 低 |

> 💡 PVC 是 K8s 存储请求的标准方式，2026 年 AI 训练推荐 RWX + 动态供给 + 高性能 StorageClass。

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get pvc` | 查看 PVC |
| `kubectl describe pvc <name>` | PVC 详情 |
| `kubectl delete pvc <name>` | 删除 PVC |
