---
title: "StorageClass"
category: -concepts
tags: ["kubernetes", "k8s", "storage", "cloud-native", "alibaba-cloud"]
summary: "StorageClass 是 Kubernetes 的存储类抽象，管理员用它把云盘、NAS、对象存储等后端抽象为不同性能的存储模板，PVC 通过指定 StorageClass 名实现动态卷供应。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "StorageClass"
  - "SC"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/apsara-stack"
    type: related_to
  - target: "概念/kubernetes"
    type: part_of
sources: []
name_zh: "K8s 存储类"
---

# StorageClass

> 中文简称：K8s 存储类

> **一句话理解**: StorageClass 是 Kubernetes 的「存储套餐」——把不同性能、协议和后端的存储抽象成可复用模板，PVC 按名称引用即可自动获得对应卷。

## 核心要点

- **存储类抽象**：将底层存储按照性能、协议、后端划分为不同类型（如高性能 SSD、共享文件存储、对象存储），供 PVC 选择。
- **动态供应（Dynamic Provisioning）**：PVC 指定 StorageClass 后，Kubernetes 自动调用 Provisioner 创建 PV，无需管理员手动预先创建卷。
- **Provisioner 驱动**：由 CSI 插件或 in-tree 插件实现，例如云盘 CSI、NAS CSI、CPFS CSI 等对应插件。
- **关键参数**：
  - `reclaimPolicy`：卷释放后是 `Retain`（保留）还是 `Delete`（删除）。
  - `volumeBindingMode`：`Immediate` 立即绑定，或 `WaitForFirstConsumer` 等 Pod 调度后再绑定。
  - `allowVolumeExpansion`：是否支持在线扩容。
- **默认类**：一个集群可设置一个默认 StorageClass（`storageclass.kubernetes.io/is-default-class: "true"`），未指定 StorageClass 的 PVC 自动使用它。
- **与 PV/PVC 的关系**：StorageClass 是「模板」，PV 是「实际卷」，PVC 是「申领请求」；链路为 PVC → StorageClass → Provisioner → PV。

## 典型 YAML / 命令示例

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: alicloud-disk-ssd
provisioner: diskplugin.csi.alibabacloud.com
parameters:
  regionId: cn-hangzhou
  zoneId: cn-hangzhou-b
  diskType: cloud_ssd
  fsType: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

```bash
# 查看集群 StorageClass
kubectl get storageclass

# 查看默认 StorageClass
kubectl get storageclass -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}'

# 创建 PVC 引用 StorageClass
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: alicloud-disk-ssd
  resources:
    requests:
      storage: 100Gi
EOF
```

## 选型对比

| 维度 | cloud_ssd | cloud_essd | NAS / CPFS | 本地盘 |
|------|-----------|------------|------------|--------|
| **适用场景** | 通用块存储 | 高 IOPS 数据库 / AI 训练 | 多 Pod 共享读 / 写 | 大数据 / 缓存 |
| **访问模式** | ReadWriteOnce | ReadWriteOnce | ReadWriteMany | ReadWriteOnce |
| **性能** | 中等 | 高 | 中 | 高（但无冗余） |
| **扩容** | 支持 | 支持 | 支持 | 通常不支持 |
| **典型后端** | SSD 云盘 | ESSD 云盘 | 文件存储 | 节点本地 SSD |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）及 ACK 敏捷版 / 专有版中，StorageClass 通常由部署时预置的 CSI 插件提供，如云盘 CSI、NAS CSI、CPFS CSI、本地盘 CSI 等。处理工单时，需确认客户 PVC 引用的 StorageClass 名称、Provisioner 与后端存储池是否匹配，并关注 `volumeBindingMode` 设置——AI 训练等调度敏感场景建议设置为 `WaitForFirstConsumer`，避免 volume 与 Pod 调度在不同可用区导致 PVC 长期 Pending。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/apsara-stack|飞天企业版 Apsara Stack]] — 阿里云专有云
- [[概念/containerd|containerd]] — 容器运行时
- [[概念/storage]] — AI 存储基础设施
- [[12_架构基建/02_架构概览/02_AI_基础设施_2026]] — AI 基础设施 2026

---

## 2026 AI 场景 StorageClass 实践

| 场景 | 推荐 StorageClass | 关键参数 | 说明 |
|------|------------------|---------|------|
| **模型 Checkpoint** | 高性能云盘 | WaitForFirstConsumer | 避免跨 AZ 调度 |
| **训练数据集** | NAS/CPFS | ReadWriteMany | 多 Pod 共享读取 |
| **向量库持久化** | ESSD 云盘 | volumeBindingMode | 低延迟随机读写 |
| **日志/临时数据** | 本地盘 | 高 IOPS | 成本敏感场景 |

## 生产最佳实践

1. **绑定模式**：AI 训练场景必须设置 `WaitForFirstConsumer`，避免 PVC Pending
2. **回收策略**：生产数据设置 `Retain`，防止误删；临时数据用 `Delete`
3. **性能分级**：按业务重要性选择不同性能等级的 StorageClass
4. **容量监控**：配置 PVC 使用率告警，避免磁盘写满导致训练中断
5. **CSI 插件**：确认 Provisioner 与后端存储池匹配，定期检查 CSI 插件健康状态

## 2026 StorageClass 生态现状

| 存储类型 | Provisioner | 场景 | 状态 |
|------|------|------|------|
| 本地 NVMe | local-path-provisioner | Checkpoint | ✅ 成熟 |
| 云 SSD | EBS/PD Provisioner | 通用 | ✅ 成熟 |
| 并行文件系统 | Lustre CSI | 训练数据 | ✅ 成熟 |
| 对象存储 | S3 CSI (Mountpoint) | 数据集 | ✅ 新增 |
| 共享文件 | NFS/EFS CSI | 多节点共享 | ✅ 成熟 |

## 检查清单

- [ ] StorageClass 与场景匹配
- [ ] 性能等级已确认
- [ ] 容量监控已配置
- [ ] CSI 插件健康
- [ ] 备份策略已配置
- [ ] 扩容策略已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| PVC Pending | Provisioner 不可用 | 检查 CSI 插件状态 |
| 性能不足 | 存储类型不匹配 | 更换更高性能 StorageClass |
| 容量不足 | 未配置扩容 | 启用 allowVolumeExpansion |
| 挂载失败 | 权限问题 | 检查 fsGroup/SELinux 配置 |

## 延伸阅读

- [[概念/RAG/storage|Storage]] — AI 存储总览
- [[概念/K8s/persistent-volume|Persistent Volume]] — K8s 存储
- [[概念/K8s/gpu-operator|GPU Operator]] — GPU 管理
- [[概念/MLOps/data-versioning|数据版本]] — 数据管理
- [[12_架构基建/09_存储/01_AI_存储_模式|AI 存储模式]]

> ℹ️ StorageClass 是 K8s 存储抽象，2026年 AI 场景需根据工作负载选择 NVMe/并行文件系统/对象存储对应 StorageClass。

## 2026 AI StorageClass 生态现状

| StorageClass | 后端 | 场景 | 性能 | 状态 |
|------|------|------|------|------|
| local-nvme | 本地 NVMe | Checkpoint/缓存 | 极高 IOPS | ✅ 主流 |
| lustre-fs | Lustre | 训练数据 | 高吞吐 | ✅ 成熟 |
| ceph-rbd | Ceph | 通用持久化 | 中等 | ✅ 成熟 |
| nfs-client | NAS | 共享数据 | 中等 | ✅ 主流 |
| s3-csi | MinIO/S3 | 模型/数据集 | 高吞吐 | ✅ 主流 |
| gp3-ebs | AWS EBS | 云上通用 | 中等 | ✅ 商业 |

## 检查清单

- [ ] 训练 Pod 已使用高速 StorageClass（NVMe/Lustre）
- [ ] Checkpoint PVC 已配置高性能存储
- [ ] 数据加载 PVC 已设置合适的 accessMode
- [ ] 存储容量已预留 30% 余量
- [ ] reclaimPolicy 已正确配置（Retain/Delete）
- [ ] 存储监控告警已接入

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Pod Pending | PVC 无法绑定 | 检查 StorageClass 和容量 |
| I/O 性能差 | 使用了网络存储 | 改用 local-nvme |
| 数据丢失 | reclaimPolicy=Delete | 改为 Retain |
| 多 Pod 访问冲突 | accessMode 错误 | 使用 ReadWriteMany |

## 延伸阅读

- [[概念/RAG/storage|Storage]] — AI 存储总览
- [[概念/K8s/persistent-volume|Persistent Volume]] — K8s 持久化存储
- [[概念/K8s/gpu-operator|GPU Operator]] — GPU 管理
- [[概念/MLOps/data-versioning|数据版本]] — 数据管理
- [[12_架构基建/09_存储/01_AI_存储_模式|AI 存储模式]]

> ℹ️ AI 工作负载 StorageClass 选型：训练数据用 Lustre/NVMe，Checkpoint 用 NVMe， 模型归档用 S3，避免用通用 NFS 承载高 I/O 场景。

## 性能对比

| StorageClass | IOPS | 吞吐 | 延迟 | 适用 |
|------|------|------|------|------|
| local-nvme | 100K+ | 6 GB/s | < 1ms | Checkpoint |
| lustre-fs | 50K | 100 GB/s | 1-5ms | 训练数据 |
| ceph-rbd | 10K | 1 GB/s | 5-10ms | 通用 |
| s3-csi | N/A | 10 GB/s | 10-50ms | 归档 |
