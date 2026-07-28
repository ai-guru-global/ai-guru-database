---
title: "CSI（Container Storage Interface）"
category: -concepts
tags: ["kubernetes", "k8s", "storage", "cloud-native", "alibaba-cloud"]
summary: "CSI 是 Kubernetes 定义的标准存储插件接口，让第三方存储系统能够以统一方式为 K8s 提供持久卷能力，无需改动 K8s 核心代码。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "CSI"
  - "Container Storage Interface"
  - "容器存储接口"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/containerd"
    type: related_to
  - target: "概念/cri"
    type: related_to
sources: []
name_zh: "容器存储接口"
---

# CSI（Container Storage Interface）

> 中文简称：容器存储接口

> **一句话理解**: CSI 是 Kubernetes 调用存储系统的「标准插头」——任何存储厂商只要实现 CSI 接口，就能为 K8s 提供动态持久卷能力。

## 核心要点

- **标准化接口**：CSI 定义了一套 gRPC 协议，包括 Controller Service、Node Service 和 Identity Service，屏蔽了底层存储差异。
- **解耦核心代码**：存储插件以独立 DaemonSet / Deployment 运行在 K8s 集群中，Kubelet 通过 CSI 调用它们，无需把存储驱动编译进 K8s。
- **动态供给（Dynamic Provisioning）**：配合 StorageClass，PVC 创建时自动申请并创建卷；删除 PVC 时可按策略回收或删除卷。
- **关键对象链**：StorageClass → PVC → PV → Pod VolumeMount，CSI Driver 负责把远端存储挂载到容器内。
- **高级能力**：支持快照（VolumeSnapshot）、卷扩容（Volume Expansion）、克隆（Volume Cloning）、拓扑感知（Topology）等。
- **故障排查入口**：关注 CSI Driver Pod、External-Provisioner、External-Attacher、Node-Driver-Registrar 等 sidecar 日志。

## 典型 YAML / 命令示例

```yaml
# StorageClass 示例：使用某 CSI Driver 作为默认存储类
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
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ai-model-pvc
  namespace: default
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: csi-disk-ssd
  resources:
    requests:
      storage: 100Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: model-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: model-server
  template:
    metadata:
      labels:
        app: model-server
    spec:
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          volumeMounts:
            - name: model-store
              mountPath: /models
          resources:
            limits:
              nvidia.com/gpu: "1"
      volumes:
        - name: model-store
          persistentVolumeClaim:
            claimName: ai-model-pvc
```

```bash
# 查看集群中注册的 CSI Driver
kubectl get csidrivers

# 查看 PVC 与 PV 绑定状态
kubectl get pvc,pv

# 查看某个节点的卷挂载事件
kubectl describe pod model-server-xxx

# 查看 CSI Driver Pod 日志（不同发行版命名空间可能不同）
kubectl logs -n kube-system -l app=csi-plugin --tail=200
```

## 选型对比

| 能力 | In-Tree 插件（已弃用） | CSI 插件 |
|------|----------------------|----------|
| 与 K8s 核心耦合 | 高，驱动在 K8s 代码库 | 低，独立部署 |
| 发布节奏 | 跟随 K8s 版本 | 存储厂商独立迭代 |
| 动态供给 | 部分支持 | 原生支持 |
| 快照 / 扩容 / 克隆 | 有限支持 | 完整支持 |
| 维护状态 | K8s 1.21+ 逐步移除 | 官方推荐方案 |

## 阿里云专有云关联

在阿里云专有云中，ACK 敏捷版 / 专属版（Apsara Stack）通常以 CSI 方式接入后端存储：云盘（ESSD/SSD/高效云盘）、NAS、OSS、本地盘等分别对应不同的 CSI Driver。ASCM 控制台创建的 StorageClass 会映射到专有云后端的存储池； Tianji / 天基负责管控面组件的生命周期，确保 CSI Controller 与 Node Plugin 在 X-Dragon 服务器和 Luoshen 网络环境下正常注册。运维工作单中常见的「PVC 无法绑定」「Pod 挂载失败」等问题，多数需要检查 CSI Driver 状态、节点 SAN/NAS 可达性以及 StorageClass 参数是否正确。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/containerd|containerd]] — 容器运行时
- [[概念/cri|CRI（Container Runtime Interface）]] — 容器运行时接口
- [[概念/cni|CNI]] — 容器网络接口
- [[12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026|AI 基础设施 2026]] — AI 基础设施 overview

---

## 2026 CSI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Generic Ephemeral Volumes** | Pod 级临时卷，生命周期与 Pod 绑定，由 CSI 动态供给 | GA |
| **ReadWriteOncePod (RWOP)** | 单 Pod 独占访问模式，增强数据安全性 | GA |
| **VolumeSnapshot v1** | 标准化卷快照/恢复，支持级联快照 | GA |
| **CSI Migration** | In-Tree 插件自动迁移至 CSI，无需修改 PVC | GA |
| **拓扑感知调度 (Topology)** | 确保 Pod 调度到与卷同可用区的节点 | GA |

## 生产最佳实践

1. **使用 WaitForFirstConsumer**：设置 `volumeBindingMode: WaitForFirstConsumer`，避免卷与 Pod 调度到不同可用区
2. **启用卷扩容**：设置 `allowVolumeExpansion: true`，支持在线扩容而无需重建 PVC
3. **回收策略明确**：生产数据卷使用 `reclaimPolicy: Retain`，避免误删 PVC 导致数据丢失
4. **监控 CSI Driver 健康**：对 CSI Controller/Node Plugin Pod 设置健康检查和告警
5. **定期快照备份**：配合 VolumeSnapshot + CronJob 实现关键数据卷的定时快照保护

## CSI 架构组件

| 组件 | 部署方式 | 功能 |
|------|------|------|
| CSI Controller | Deployment/StatefulSet | 卷生命周期管理 |
| CSI Node Plugin | DaemonSet | 节点挂载/卸载 |
| CSI Identity | 所有插件 | 插件信息/健康检查 |
| External Provisioner | Sidecar | 动态创建卷 |
| External Attacher | Sidecar | 卷附加/分离 |
| External Resizer | Sidecar | 卷扩容 |

## 主流 CSI 驱动对比

| 驱动 | 厂商 | 存储类型 | 特点 |
|------|------|------|------|
| EBS CSI | AWS | 块存储 | 云盘 |
| PD CSI | GCP | 块存储 | 持久磁盘 |
| Azure Disk CSI | Azure | 块存储 | 托管磁盘 |
| Ceph RBD | 开源 | 块存储 | 分布式 |
| NFS CSI | 开源 | 文件存储 | 共享存储 |
| Longhorn | Rancher | 块存储 | 云原生 |

## CSI 卷操作生命周期

| 操作 | 说明 | 触发条件 |
|------|------|------|
| CreateVolume | 创建卷 | PVC 创建 |
| DeleteVolume | 删除卷 | PV 删除 (Delete策略) |
| ControllerPublish | 附加卷到节点 | Pod 调度 |
| NodeStage | 节点准备 | 首次挂载 |
| NodePublish | 挂载到 Pod | Pod 启动 |
| ExpandVolume | 扩容 | PVC 扩容请求 |

> 💡 CSI 是 K8s 存储插件的标准接口，2026 年所有主流存储厂商都提供 CSI 驱动，替代了旧的 FlexVolume。

## StorageClass 配置示例

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: disk.csi.everest.io
parameters:
  type: ssd
  fstype: ext4
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| PVC Pending | 驱动未安装 | 检查 CSI Driver Pod |
| 挂载失败 | 节点插件异常 | 重启 Node Plugin |
| 扩容失败 | 不支持扩容 | 检查 allowVolumeExpansion |
| 性能差 | 存储类型不当 | 更换 SSD/高性能存储 |
