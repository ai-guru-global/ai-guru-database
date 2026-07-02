---
title: "CSI（Container Storage Interface）"
category: -concepts
tags: ["kubernetes", "k8s", "storage", "cloud-native", "alibaba-cloud"]
summary: "CSI 是 Kubernetes 定义的标准存储插件接口，让第三方存储系统能够以统一方式为 K8s 提供持久卷能力，无需改动 K8s 核心代码。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "CSI"
  - "Container Storage Interface"
  - "容器存储接口"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/containerd"
    type: related_to
  - target: "_concepts/cri"
    type: related_to
---

# CSI（Container Storage Interface）

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

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/containerd|containerd]] — 容器运行时
- [[_concepts/cri|CRI（Container Runtime Interface）]] — 容器运行时接口
- [[_concepts/cni|CNI]] — 容器网络接口
- [[12_Architecture_Infrastructure/Architecture_Overview/AI_Infrastructure_2026|AI 基础设施 2026]] — AI 基础设施 overview
