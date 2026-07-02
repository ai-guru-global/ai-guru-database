---
title: "Kubernetes 存储深度解析"
category: 12-architecture-infrastructure
tags: ["kubernetes", "k8s", "storage", "csi", "pv", "pvc", "statefulset", "cloud-native", "alibaba-cloud"]
summary: "系统讲解 Kubernetes 存储体系、PV/PVC/StorageClass、CSI、有状态服务及排障方法，面向阿里云专有云 K8s 工单处理。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "Kubernetes Storage Deep Dive"
  - "K8s Storage Deep Dive"
  - "Kubernetes_Storage_Deep_Dive"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# Kubernetes 存储深度解析

> **一句话理解**: Kubernetes 存储是一套「声明式持久化」体系——Pod 通过 PVC 表达"我要多大、怎么读写的卷"，StorageClass + CSI Driver 在底层真正创建/挂载/回收卷，让有状态应用在容器编排里也能被声明式管理。

> 📐 **概念方法论**: K8s 存储解决「容器销毁后数据怎么办」。关键是分清三层抽象：**用户层**（Pod/PVC 声明需求）、**编排层**（PV/StorageClass 匹配调度）、**实现层**（CSI Driver / 后端存储创建挂载）。工单中多数存储问题出在三层的"衔接"。

---

## 目录

1. [K8s 存储模型](#1-k8s-存储模型)
2. [CSI 体系](#2-csi-体系)
3. [PV 生命周期](#3-pv-生命周期)
4. [StorageClass 与动态供给](#4-storageclass-与动态供给)
5. [有状态服务](#5-有状态服务)
6. [分布式存储选型](#6-分布式存储选型)
7. [常见存储故障排查](#7-常见存储故障排查)
8. [阿里云专有云关联](#8-阿里云专有云关联)
9. [常见问题 FAQ](#9-常见问题-faq)

---

## 1. K8s 存储模型

### 1.1 为什么需要持久化存储

容器是「一次性的」：Pod 重建、节点漂移都会清空本地文件系统。数据库、消息队列、AI 模型仓库等场景要求数据独立于容器生命周期。

K8s 的 **Volume 抽象** 把存储挂载进容器，容器里看到普通目录，实际数据由后端存储托管。

### 1.2 三种核心对象

| 对象 | 谁声明 | 作用 |
|------|--------|------|
| **Volume** | Pod 内声明 | 把存储挂进容器，随 Pod 创建/销毁 |
| **PVC** | 用户/应用 | 表达"我要多大的持久卷、什么访问模式" |
| **PV** | 集群/动态供给 | 集群中的真实持久卷资源 |

核心关系：**PVC 是"订单"，PV 是"库存"，StorageClass 是"工厂"，CSI Driver 是"生产线"**。

### 1.3 访问模式

| 模式 | 缩写 | 含义 | 典型后端 |
|------|------|------|----------|
| ReadWriteOnce | RWO | 单个节点读写 | 云盘、本地 SSD |
| ReadOnlyMany | ROX | 多节点只读 | 共享文件系统快照 |
| ReadWriteMany | RWX | 多节点读写 | NAS、CephFS、OSS |
| ReadWriteOncePod | RWOP | 单个 Pod 独占读写 | K8s 1.27+ |

> 工单常见坑：Deployment 多副本挂载 RWO 云盘，调度到不同节点后无法挂载。

### 1.4 Volume 类型速查

| 类型 | 是否持久化 | 适用场景 |
|------|-----------|----------|
| `emptyDir` | 否 | 临时缓存 |
| `hostPath` | 节点级 | 单节点守护进程（生产受限） |
| `configMap`/`secret` | 否 | 配置文件注入 |
| `persistentVolumeClaim` | 是 | 数据库、模型（生产标准） |

### 1.5 Pod 使用 PVC 示例

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-data
  namespace: prod
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: csi-disk-ssd
  resources:
    requests:
      storage: 100Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  namespace: prod
spec:
  replicas: 1
  selector:
    matchLabels: { app: mysql }
  template:
    metadata:
      labels: { app: mysql }
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

```bash
kubectl get pvc -n prod
kubectl get pv | grep mysql-data
kubectl describe pod mysql-xxx -n prod
```

---

## 2. CSI 体系

### 2.1 什么是 CSI

CSI（Container Storage Interface）是 K8s 与外部存储系统之间的 **标准 gRPC 协议**。存储厂商把驱动做成独立组件部署在集群里，无需把代码塞进 K8s 核心。

> 一句话：**CSI = 存储驱动的"USB 接口"**。

```
   用户声明 PVC
        │
        ▼
   K8s 控制面 ── external-provisioner / attacher / resizer
        │ gRPC (CSI)
        ▼
   CSI Driver (Controller + Node Plugin)
        │ 调用存储 API
        ▼
   后端存储系统（云盘/NAS/Ceph/盘古等）
```

### 2.2 CSI 三大服务

| 服务 | 部署形态 | 职责 |
|------|----------|------|
| **Identity Service** | Controller + Node | 上报驱动名称与能力 |
| **Controller Service** | Controller Pod | 创建/删除/扩容/快照/克隆 |
| **Node Service** | 每个节点 DaemonSet | 把卷 mount 到容器目录 |

### 2.3 CSI Sidecar 容器

| Sidecar | 作用 | 排查重点 |
|---------|------|----------|
| **external-provisioner** | 监听 PVC，调 CreateVolume | PVC Pending |
| **external-attacher** | 监听 VolumeAttachment，调 PublishVolume | attach/detach 失败 |
| **external-resizer** | 监听 PVC 扩容 | 扩容卡住 |
| **external-snapshotter** | 监听 VolumeSnapshot | 快照失败 |
| **node-driver-registrar** | 向 kubelet 注册 CSI 插件 | 节点看不到驱动 |
| **livenessprobe** | 探活 CSI 插件 | Pod 重启 |

### 2.4 CSI 拓扑与调度

云盘等存储有可用区亲和性。`volumeBindingMode: WaitForFirstConsumer` 让调度器等 Pod 调度到具体节点后再创建卷，避免跨 AZ 挂载失败。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-disk-topology
provisioner: diskplugin.csi.alibabacloud.com
volumeBindingMode: WaitForFirstConsumer
allowedTopologies:
  - matchLabelExpressions:
      - key: topology.diskplugin.csi.alibabacloud.com/zone
        values: [cn-hangzhou-g]
```

### 2.5 CSI vs In-Tree 插件

| 维度 | In-Tree（已弃用） | CSI |
|------|-------------------|-----|
| 与 K8s 核心耦合 | 高 | 低 |
| 发布节奏 | 跟随 K8s | 厂商独立迭代 |
| 动态供给 | 部分支持 | 原生支持 |
| 快照/扩容/克隆 | 有限 | 完整 |
| 维护状态 | 1.21+ 逐步移除 | 官方推荐 |

---

## 3. PV 生命周期

### 3.1 四个阶段

```
PVC: Pending → Bound → Lost（PV 被删）
PV:  Available → Bound → Released → Available/Failed/Deleted
```

| 阶段 | 含义 | 常见触发 |
|------|------|----------|
| **Pending** | PVC 等待匹配 PV 或动态创建 | 无可用 PV、StorageClass 找不到、CSI 报错 |
| **Bound** | PVC 已绑定到 PV | 正常状态 |
| **Available** | PV 空闲，可被绑定 | 静态 PV 未使用 |
| **Released** | 原 PVC 已删，PV 待回收 | 取决于 reclaimPolicy |
| **Failed** | 回收失败 | 手动清理出错、后端不可达 |

### 3.2 静态供给 vs 动态供给

| 方式 | 流程 | 适用 |
|------|------|------|
| **静态供给** | 管理员先创建 PV → 用户创建 PVC 匹配 → 绑定 | 存量卷、特殊拓扑 |
| **动态供给** | 用户创建 PVC 引用 StorageClass → provisioner 自动创建 PV | 生产默认 |

静态 PV 示例：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: manual-pv-001
spec:
  capacity: { storage: 100Gi }
  accessModes: [ReadWriteOnce]
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
  csi:
    driver: diskplugin.csi.alibabacloud.com
    volumeHandle: d-bp1xxxxxxxx
    fsType: ext4
    volumeAttributes: { type: cloud_ssd }
```

### 3.3 Reclaim Policy

| 策略 | 行为 | 风险 |
|------|------|------|
| **Delete** | 删 PVC 时同步删除后端卷 | 误删 = 数据永久丢失 |
| **Retain** | 删 PVC 后 PV 进入 Released，后端卷保留 | 需手动清理 |

生产建议：开发/测试用 `Delete`；生产数据库用 `Retain` + 定期快照备份。

### 3.4 生命周期全流程

```
1. Provisioning：用户 apply PVC → external-provisioner 调 CSI CreateVolume → 创建 PV
2. Binding：PV 控制器把 PVC 与 PV 一对一绑定
3. Using：Pod 调度 → kubelet 调 NodePublishVolume → mount 到容器
4. Reclaiming：删 PVC → 按 reclaimPolicy 处理（Delete 或 Retain）
```

---

## 4. StorageClass 与动态供给

### 4.1 StorageClass 是什么

StorageClass 是「卷的模板」：定义用哪个 provisioner、创建什么规格、回收策略、是否允许扩容。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-disk-ssd
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: diskplugin.csi.alibabacloud.com
parameters:
  type: cloud_ssd
  regionId: cn-hangzhou
  zoneId: cn-hangzhou-g
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

### 4.2 关键字段

| 字段 | 作用 | 建议 |
|------|------|------|
| `provisioner` | 指定 CSI Driver 名称 | 与 CSIDriver 对象名一致 |
| `parameters` | 透传给 CSI Driver 的键值对 | 参考厂商文档 |
| `reclaimPolicy` | PVC 删除后的回收策略 | 生产数据库用 Retain |
| `allowVolumeExpansion` | 是否允许在线扩容 | 数据库/AI 盘建议开启 |
| `volumeBindingMode` | Immediate / WaitForFirstConsumer | 拓扑敏感存储用后者 |

### 4.3 默认 StorageClass

```bash
kubectl get sc
kubectl annotate sc csi-disk-ssd storageclass.kubernetes.io/is-default-class=true
```

### 4.4 动态供给示例

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ai-model-pvc
  namespace: default
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: csi-disk-ssd
  resources:
    requests:
      storage: 100Gi
```

```bash
kubectl get pvc ai-model-pvc -w
kubectl get pv -w
kubectl logs -n kube-system deployment/csi-provisioner -c external-provisioner -f
```

### 4.5 卷扩容

```bash
kubectl patch pvc ai-model-pvc -p '{"spec":{"resources":{"requests":{"storage":"200Gi"}}}}'
kubectl get pvc ai-model-pvc -o jsonpath='{.status.capacity.storage}'
kubectl logs -n kube-system deployment/csi-provisioner -c external-resizer
```

> 只能增大不能缩小；云盘有步进和上限。

### 4.6 卷快照与克隆

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: mysql-snap-20260626
  namespace: prod
spec:
  volumeSnapshotClassName: csi-disk-snapshot
  source:
    persistentVolumeClaimName: mysql-data
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-data-restore
  namespace: prod
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: csi-disk-ssd
  resources:
    requests:
      storage: 100Gi
  dataSource:
    name: mysql-snap-20260626
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
```

---

## 5. 有状态服务

### 5.1 StatefulSet 三件套

数据库、Kafka、Redis 集群需要 **稳定网络身份** 和 **稳定存储身份**，因此用 StatefulSet。

| 组件 | 作用 |
|------|------|
| **StatefulSet** | 保证 Pod 启动/停止顺序、稳定主机名与网络标识 |
| **Headless Service** | 为每个 Pod 生成独立 DNS，如 `mysql-0.mysql.prod.svc.cluster.local` |
| **PVC Template** | 每个 Pod 拥有独立 PVC，删 Pod 不丢数据 |

```
StatefulSet: mysql
  Pod: mysql-0 ──► PVC: data-mysql-0 ──► PV: pv-0001
  Pod: mysql-1 ──► PVC: data-mysql-1 ──► PV: pv-0002
  Pod: mysql-2 ──► PVC: data-mysql-2 ──► PV: pv-0003
```

### 5.2 StatefulSet + Headless Service + PVC 示例

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
  namespace: prod
spec:
  clusterIP: None
  selector: { app: mysql }
  ports: [{ port: 3306 }]
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: prod
spec:
  serviceName: mysql
  replicas: 3
  selector:
    matchLabels: { app: mysql }
  template:
    metadata:
      labels: { app: mysql }
    spec:
      containers:
        - name: mysql
          image: mysql:8.0
          volumeMounts:
            - name: data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:
    - metadata: { name: data }
      spec:
        accessModes: [ReadWriteOnce]
        storageClassName: csi-disk-ssd
        resources:
          requests: { storage: 100Gi }
```

```bash
kubectl get sts mysql -n prod
kubectl get pods -n prod -l app=mysql -w
kubectl get pvc -n prod -l app=mysql
```

### 5.3 StatefulSet 存储注意事项

| 场景 | 行为 | 建议 |
|------|------|------|
| Pod 被删重建 | 同名 Pod 重新挂载原 PVC | 不要手动删 PVC |
| 缩容 | 默认不删 PVC | 需要时再手动清理 |
| 扩容 | 按序号递增创建新 Pod/PVC | 注意存储池容量 |
| 滚动更新 | 倒序更新，一次一个 | 确保副本间维持 quorum |
| 跨节点迁移 | 取决于后端存储是否支持 detach/attach | 云盘支持；本地盘不支持 |

### 5.4 DaemonSet 与本地存储

需要「每个节点本地高性能盘」的场景，可用 DaemonSet + Local PV。`hostPath` 有安全限制，生产更推荐 Local PV。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-ssd
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-pv-node1
spec:
  capacity: { storage: 500Gi }
  accessModes: [ReadWriteOnce]
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-ssd
  local:
    path: /mnt/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/hostname
              operator: In
              values: [k8s-node-01]
```

> 本地盘节点故障后数据不可迁移。

---

## 6. 分布式存储选型

### 6.1 选型维度

| 维度 | 关键问题 |
|------|----------|
| 访问模式 | RWO、RWX 还是 ROX？ |
| 一致性 | 强一致还是最终一致？ |
| 性能 | IOPS、吞吐、时延？ |
| 可用性 | RTO/RPO 要求？ |
| 运维复杂度 | 是否有专职存储 SRE？ |
| 云平台集成 | 是否已有云盘/NAS/OSS？ |

### 6.2 方案对比

| 方案 | 访问模式 | 一致性 | 适用场景 | 运维复杂度 |
|------|----------|--------|----------|------------|
| **Longhorn** | RWO/RWX | 强一致 | 中小规模、边缘 K8s | 中 |
| **Rook/Ceph** | RWO/RWX/对象/块 | 强一致 | 大规模统一存储 | 高 |
| **OpenEBS** | RWO/RWX | 视引擎 | 本地盘增强、低成本 | 中 |
| **NFS** | RWX | 文件锁 | 共享文件、CI 缓存、训练数据 | 低 |
| **盘古/云盘** | RWO/RWX/对象 | 强一致 | 阿里云公有云/专有云 | 低（托管） |

### 6.3 各方案要点

- **Longhorn**：基于块 + iSCSI，自动多副本。适合节点数 < 100 的中小集群，对网络/CPU 有要求。
- **Rook/Ceph**：提供 RBD、CephFS、RGW 三种接口。适合大集群，OSD 规划和 CRUSH Map 需提前设计。
- **OpenEBS**：引擎可选 Local PV、cStor、Mayastor（NVMe-oF）。适合不想引入 Ceph 的场景。
- **NFS**：协议简单、RWX 天然支持。适合只读共享、低并发写。不适合高并发数据库。
- **盘古/云盘**：阿里云 ESSD/SSD/高效云盘为 RWO；NAS 为 RWX；OSS 适合归档和模型仓库。在专有云优先使用 ACK 官方 CSI Driver。

---

## 7. 常见存储故障排查

### 7.1 排查总链路

```
Pod 起不来 / 应用报错
    │
    ▼
1. kubectl describe pod          → 看 mount/attach 错误
2. kubectl describe pvc          → 看是否 Bound
3. kubectl describe pv           → 看后端卷状态
4. kubectl get volumeattachment  → 看 attach 是否卡住
5. kubectl logs csi-provisioner  → provisioning 错误
6. kubectl logs csi-plugin(node) → mount/format 错误
7. 登录节点检查 dmesg / mount / lsblk
8. 检查后端存储控制台/CLI
```

### 7.2 故障速查表

| 症状 | 可能原因 | 排查命令 |
|------|----------|----------|
| PVC 一直 Pending | StorageClass 不存在 / provisioner 没注册 / 后端配额不足 | `kubectl get sc`; `kubectl get csidriver`; `kubectl logs deployment/csi-provisioner` |
| PVC Bound 但 Pod ContainerCreating | CSI Node 插件没运行 / 节点无法挂载 | `kubectl get pod -n kube-system -l app=csi-plugin`; `kubectl describe pod` |
| Multi-Attach error | RWO 卷已 attach 到另一节点 | `kubectl get volumeattachment`; 确认旧 Pod 已终止 |
| FailedMount / timeout | 网络不通 / 存储端拒绝 / 残留挂载 | 节点 `dmesg -T`; `mount \| grep <pv>` |
| 扩容失败 | 后端不支持 / filesystem 扩容失败 | `kubectl logs csi-provisioner -c external-resizer` |
| 删 PVC 后 PV 还在 Released | reclaimPolicy=Retain | 手动 `kubectl delete pv` 并清理后端卷 |
| Read-only filesystem | 存储端把卷置为只读保护 | 查看后端存储状态；`dmesg` |
| Pod 迁移后数据丢失 | 使用了 emptyDir/hostPath/本地盘 | 检查 Volume 类型和 PV 后端 |
| 快照失败 | VolumeSnapshotClass 不存在 | `kubectl get volumesnapshotclass` |
| Permission denied | fsGroup 与卷内文件权限不匹配 | `kubectl describe pod`; 容器内 `ls -la` |

### 7.3 关键排查命令集

```bash
# 看所有 PVC/PV 状态
kubectl get pvc,pv --all-namespaces

# 看 CSI Driver 注册情况
kubectl get csidrivers

# 看 VolumeAttachment
kubectl get volumeattachment

# 看 CSI Controller 日志
kubectl logs -n kube-system deployment/csi-provisioner --all-containers --tail=500

# 看 CSI Node 日志
kubectl logs -n kube-system -l app=csi-plugin --tail=500 --all-containers

# 查看 Pod 事件
kubectl describe pod <pod-name> -n <ns>

# 节点上查看块设备与挂载
lsblk
mount | grep <pv-name-or-pod-uid>
df -h

# 查看内核日志
dmesg -T | grep -i -E "ext4|xfs|scsi|nvme|mount"

# 验证权限
kubectl auth can-i create pvc --as=system:serviceaccount:prod:app-sa -n prod
```

### 7.4 典型错误信息解析

| Event 消息 | 含义 | 处理 |
|------------|------|------|
| `Unable to attach or mount volumes` | attach 或 mount 失败 | 看更下层错误 |
| `Volume is already exclusively attached to one node` | RWO 卷未从旧节点 detach | 等待旧 Pod 终止；必要时删 VolumeAttachment |
| `Failed to create volume: ... insufficient capacity` | 后端存储池容量/配额不足 | 扩容存储池或清理无用卷 |
| `MountVolume.SetUp failed ... exit status 32` | mount 失败，常为文件系统损坏 | 节点 `fsck` |
| `no volume plugin matched` | 没有对应 CSI Driver | 安装/升级 Driver |

### 7.5 挂载残留清理（谨慎）

```bash
# 找到 Pod 的 mount 目录
find /var/lib/kubelet/pods -type d -name "*<pvc-name>*"

# 卸载残留挂载点
umount /var/lib/kubelet/pods/<pod-uid>/volumes/kubernetes.io~csi/<pv-name>/mount

# 删除残留 VolumeAttachment
kubectl delete volumeattachment csi-<hash>  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]

# 重启 CSI Node 插件
kubectl delete pod -n kube-system -l app=csi-plugin --field-selector spec.nodeName=<node>  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]
```

> ⚠️ 手动 umount 和删 VolumeAttachment 有风险，确认无活跃 Pod 使用该卷。

---

## 8. 阿里云专有云关联

### 8.1 专有云 ACK 存储架构

阿里云专有云平台（飞天企业版 Apsara Stack）提供的容器服务 ACK 分为 **ACK 专有版** 和 **ACK 敏捷版**。存储层面都通过 CSI 接入后端：

```
   ACK 专有版 / 敏捷版 控制平面
            │
   CSI Driver (ACK 官方)
   ├─ csi-plugin (DaemonSet, Node 插件)
   ├─ csi-provisioner (Deployment, Controller)
   ├─ csi-attacher / csi-resizer / csi-snapshotter
            │
            ▼
   飞天企业版存储层
   ├─ 盘古 Pangu（分布式文件/块/对象统一存储）
   ├─ 神龙 X-Dragon 服务器本地 NVMe/SSD
   └─ 洛神 Luoshen 网络（存储网络互通）
```

### 8.2 常见 CSI Driver

| 后端存储 | CSI Driver 示例名 | 访问模式 | 典型场景 |
|----------|-------------------|----------|----------|
| 云盘 ESSD/SSD/高效 | `diskplugin.csi.alibabacloud.com` | RWO | MySQL、PostgreSQL、AI 模型 |
| NAS | `nasplugin.csi.alibabacloud.com` | RWX | 共享数据、训练数据集 |
| OSS | `ossplugin.csi.alibabacloud.com` | RWX/ROX | 模型仓库、归档、静态资源 |
| 本地盘 | `localplugin.csi.alibabacloud.com` | RWO | 日志、监控、高性能缓存 |

> 实际 driver 名称以集群内 `kubectl get csidrivers` 输出为准。

### 8.3 ASCM 控制台与 StorageClass

在专有云 **ASCM（Apsara Stack Cloud Management）** 控制台中：
- 集群管理员预创建 StorageClass，关联后端存储池。
- 业务用户只需在 YAML 中引用 StorageClass 名称。
- StorageClass 参数（如 `type`, `regionId`, `zoneId`, `performanceLevel`）由平台团队统一配置。

工单中 PVC 创建失败时，先确认：
1. 用户使用的 StorageClass 在 ASCM 中是否存在且可用。
2. 对应存储池是否还有容量/配额。
3. 用户命名空间是否有权限使用该 StorageClass。

### 8.4 天基与 CSI 组件生命周期

专有云平台使用 **天基（Tianji）** 运维底座管理管控面组件：
- 升级 ACK 时，天基滚动升级 CSI Driver。
- CSI Pod 持续 CrashLoopBackOff 时，检查天基组件状态、镜像拉取、节点资源。
- 神龙（X-Dragon）裸金属节点上，CSI Node Plugin 需正确识别 NVMe 设备并挂载。

```bash
kubectl get pods -n kube-system -l app=csi-plugin
kubectl get pods -n kube-system -l app=csi-provisioner
kubectl get csidrivers
kubectl get sc
```

### 8.5 专有云常见工单场景

| 工单现象 | 优先检查点 | 处理思路 |
|----------|------------|----------|
| PVC Pending | StorageClass / CSI provisioner / 后端配额 | `kubectl describe pvc`; `kubectl logs csi-provisioner` |
| Pod 无法挂载云盘 | 节点 CSI 插件 / VolumeAttachment / 跨 AZ | `kubectl get volumeattachment`; 检查节点拓扑 |
| NAS 挂载慢或卡死 | 网络连通性 / NAS 配额 / mount 参数 | 节点 `telnet <nas-endpoint> 2049`; 检查 `nolock`/`hard` |
| OSS 文件列表不同步 | FUSE 缓存策略 | 调整 `cache`/`lookup-cache` 参数 |
| 扩容未生效 | allowVolumeExpansion / 后端容量 / 文件系统 | `kubectl describe pvc`; `kubectl logs external-resizer` |
| 快照无法创建 | VolumeSnapshotClass / CSI snapshot CRD | `kubectl get volumesnapshotclass` |

### 8.6 盘古存储在 ACK 中的角色

**盘古 Pangu** 是阿里云自研分布式存储系统，专有云存储底座：
- 云盘、NAS、OSS 的底层数据都落在盘古上。
- ACK CSI Driver 调用的存储 API 最终由盘古完成数据放置、副本、快照、扩容。
- 遇到「后端存储不可达」「存储池容量不足」，需平台侧检查盘古集群健康度。

> 若 CSI Driver 日志报 `Internal error from storage backend`，应升级到存储/平台团队，租户侧通常无法直接修复。

---

## 9. 常见问题 FAQ

**Q1: 一个 PVC 能被多个 Pod 用吗？**
A: PVC 与 PV 一对一绑定。多个 Pod 能否共用取决于访问模式：RWO 只能同节点 Pod 共享；RWX 可跨节点共享；StatefulSet 每个 Pod 通常使用独立 PVC。

**Q2: `reclaimPolicy: Delete` 安全吗？**
A: 开发测试方便，但生产数据库有误删风险。关键数据建议用 `Retain`，并配合 VolumeSnapshot 备份。

**Q3: 为什么 StatefulSet 缩容后 PVC 还在？**
A: 设计如此，防止误删数据。需手动 `kubectl delete pvc` 清理，并确认后端卷是否也需删除。

**Q4: CSI Driver Pod 都运行，但 PVC 还是 Pending？**
A: 先看 `kubectl describe pvc` 事件；再看 `csi-provisioner` 日志；最后确认 StorageClass、provisioner 名称、后端配额。

**Q5: `WaitForFirstConsumer` 和 `Immediate` 的区别？**
A: `Immediate` 立即创建卷，可能放到 Pod 调度不到的可用区；`WaitForFirstConsumer` 等 Pod 调度后再创建，保证拓扑一致。多可用区集群建议后者。

**Q6: ACK 敏捷版和专有版在存储上有什么区别？**
A: 两者都通过 CSI 接入后端存储，PVC/PV/StorageClass 使用方式一致。差异主要在控制平面形态、CSI 组件版本和 ASCM 管控粒度。

**Q7: 本地盘和云盘怎么选？**
A: 需要跨节点迁移选云盘；追求极致 IOPS 且应用有副本机制（如 Kafka、TiKV）可选本地盘。本地盘节点故障时数据不可迁移。

**Q8: 应用报 `Read-only file system`，但 PVC 正常？**
A: 后端异常时常把卷置为只读保护（如盘古检测到损坏、云盘欠费）。需看 CSI Node 日志、节点 `dmesg` 及后端告警。

---

## Related

- [[_concepts/csi|CSI（Container Storage Interface）]] — CSI 概念卡片
- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/statefulset|StatefulSet]] — 有状态工作负载
- [[12_Architecture_Infrastructure/Architecture_Overview/AI_Infrastructure_2026|AI 基础设施 2026]] — AI 基础设施 overview
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/kagent_Deep_Dive]] — K8s 原生 DevOps Agent 框架
- [[storageclass]]
- [[persistent-volume]]
