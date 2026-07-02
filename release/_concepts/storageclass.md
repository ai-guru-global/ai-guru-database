---
title: "StorageClass"
category: -concepts
tags: ["kubernetes", "k8s", "storage", "cloud-native", "alibaba-cloud"]
summary: "StorageClass 是 Kubernetes 的存储类抽象，管理员用它把云盘、NAS、对象存储等后端抽象为不同性能的存储模板，PVC 通过指定 StorageClass 名实现动态卷供应。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "StorageClass"
  - "SC"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/apsara-stack"
    type: related_to
  - target: "_concepts/kubernetes"
    type: part_of
---

# StorageClass

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

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/apsara-stack|飞天企业版 Apsara Stack]] — 阿里云专有云
- [[_concepts/containerd|containerd]] — 容器运行时
- [[12_Architecture_Infrastructure/Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026
