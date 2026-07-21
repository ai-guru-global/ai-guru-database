---
title: "PersistentVolume"
category: -concepts
tags: ["kubernetes", "k8s", "persistent-volume", "storage", "cloud-native", "alibaba-cloud"]
summary: "PersistentVolume（PV）是 Kubernetes 中由集群管理员或存储类动态供给的持久化存储资源，与 Pod 生命周期解耦，为有状态应用提供落盘能力。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "PV"
  - "Persistent Volume"
  - "持久卷"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/statefulset"
    type: related_to
  - target: "概念/pod"
    type: part_of
sources: []
---

# PersistentVolume

> **一句话理解**: PV 是 Kubernetes 里与 Pod 生命周期解耦的持久化存储资源，由管理员预配或 StorageClass 动态供给，通过 PVC 被工作负载消费。

## 核心要点

- **持久化存储抽象**: PV 代表集群中的一块真实存储（NFS、iSCSI、Ceph、云盘等），由集群管理员创建或 CSI 驱动根据 StorageClass 自动动态供给。
- **与 Pod 解耦**: PV 的生命周期独立于 Pod。Pod 删除后，PV 中的数据仍可保留，重新调度后可通过 PersistentVolumeClaim（PVC）重新挂载原数据。
- **静态 vs 动态供给**:
  - **静态**: 管理员手动创建 PV，用户通过 PVC 申请匹配。
  - **动态**: PVC 指定 StorageClass，由 CSI Provisioner 自动创建底层卷和对应 PV。
- **访问模式（Access Modes）**: 决定卷可被多少个节点以何种方式挂载，常见有 `ReadWriteOnce`（单节点读写）、`ReadOnlyMany`（多节点只读）、`ReadWriteMany`（多节点读写）。
- **回收策略（Reclaim Policy）**: 删除 PVC 后 PV 的处理方式，包括 `Retain`（保留数据，需手动清理）、`Delete`（自动删除底层卷）、`Recycle`（已废弃，不建议使用）。
- **PVC 是用户视角**: 应用开发者通常只写 PVC，由平台或控制器完成 PV 绑定；运维排障时需要同时查看 PV、PVC、StorageClass 和 CSI 事件。

## 典型 YAML / 命令示例

### 静态供给 PV + PVC

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv-001
spec:
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    server: 10.0.0.10
    path: /data/k8s/vol001
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data
  namespace: default
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 50Gi
  volumeName: nfs-pv-001
```

### 动态供给 PVC + Pod 挂载

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-data
  namespace: default
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 100Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: mysql-0
spec:
  containers:
    - name: mysql
      image: mysql:8.0
      volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: mysql-data
```

### 常用排查命令

```bash
# 查看 PV 与 PVC 绑定关系
kubectl get pv,pvc -A

# 查看 PV 详情及回收策略
kubectl describe pv <pv-name>

# 查看 PVC 事件（Pending 时重点关注）
kubectl describe pvc <pvc-name> -n <namespace>

# 查看 StorageClass 及默认标记
kubectl get sc
```

## 选型对比

| 维度 | emptyDir | hostPath | PersistentVolume |
|------|----------|----------|------------------|
| **生命周期** | 随 Pod 创建/销毁 | 随节点存在 | 独立于 Pod，可保留 |
| **数据持久化** | 否 | 节点本地，不跨节点 | 是，可跨节点迁移 |
| **多 Pod 共享** | 同一 Pod 内多容器 | 同一节点多 Pod | 取决于 AccessMode 和后端 |
| **适用场景** | 临时缓存、中间结果 | 节点级日志/守护进程 | 数据库、文件存储、有状态应用 |
| **生产可用性** | 不建议存放重要数据 | 一般不建议 | 推荐 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专有版 / 敏捷版中，PersistentVolume 通常对接企业存储后端（如盘古分布式存储、SAN、NAS 或本地 Ceph/RBD）。平台管理员会预先创建对应后端协议的 StorageClass（如云盘类型、NAS 类型），应用团队只需提交 PVC 即可动态申请 PV。处理 ACK 工单时，常见问题包括 PVC 长时间 `Pending`（StorageClass 不存在或 CSI 插件异常）、Pod 漂移后挂载失败（多节点读写协议不匹配）、以及误删 PVC 导致 PV 回收策略触发数据删除。建议生产环境对核心数据设置 `Retain` 策略，并结合 ASCM 进行资源审计。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/statefulset|StatefulSet]] — 有状态工作负载控制器
- [[概念/pod|Pod]] — K8s 最小调度单元
- [[概念/cri|CRI]] — 容器运行时接口
- [[概念/containerd|containerd]] — 容器运行时

---

## 2026 PersistentVolume 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **ReadWriteOncePod (RWOP)** | 单 Pod 独占访问模式，防止多 Pod 误挂载同一卷 | GA |
| **VolumeSnapshot v1** | 标准化快照/恢复，支持级联快照与定时备份 | GA |
| **Generic Ephemeral Volumes** | Pod 级临时卷，由 CSI 动态供给，生命周期与 Pod 绑定 | GA |
| **CSI Migration** | In-Tree 插件自动迁移至 CSI，无需修改 PVC | GA |
| **Volume Populator** | 从快照/镜像/自定义源初始化卷数据 | Beta |

## 生产最佳实践

1. **回收策略明确**：生产数据卷使用 `reclaimPolicy: Retain`，避免误删 PVC 导致数据丢失
2. **WaitForFirstConsumer**：设置 `volumeBindingMode: WaitForFirstConsumer`，避免卷与 Pod 调度到不同可用区
3. **定期快照备份**：配合 VolumeSnapshot + CronJob 实现关键数据卷的定时保护
4. **监控 PV 状态**：对 PV/PVC 的 Pending/Lost 状态设置告警，及时发现存储异常
5. **容量规划**：启用 `allowVolumeExpansion`，支持在线扩容而无需重建 PVC
