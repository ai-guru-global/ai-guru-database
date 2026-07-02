---
title: "K8s 存储故障远程诊断决策树"
tags: [synthesis, kubernetes, troubleshooting, storage, pvc, csi, diagnosis, work-order, remote-support, decision-tree]
type: synthesis
created: 2026-07-01
tier: core
aliases:
  - "K8s Storage Diagnosis"
  - "PVC 挂载失败诊断"
  - "存储排障"
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# K8s 存储故障远程诊断决策树

> **核心洞察**：K8s 存储工单的核心矛盾在三层抽象的「衔接处」——用户声明 PVC，StorageClass 匹配 PV，CSI Driver 创建底层卷。远程诊断的关键是判断卡在哪一层。80% 的存储问题表现为 Pod 卡在 `ContainerCreating`，Events 显示 `volume mount failed` 或 `AttachVolume failed`。

---

## 诊断入口：存储问题的现象是什么？

```
用户报告 "存储有问题"
│
├── PVC 一直 Pending（未 Bound）
│   └── → 参见 §1
│
├── Pod 卡在 ContainerCreating，存储挂载失败
│   └── → 参见 §2
│
├── Volume 已挂载但数据读写异常
│   └── → 参见 §3
│
├── 多副本 Deployment 挂载 RWO 云盘冲突
│   └── → 参见 §4
│
├── StatefulSet 存储未正确关联
│   └── → 参见 §5
│
└── 专有云特有：盘古/飞天存储后端异常
    └── → 参见 §6
```

---

## §1 PVC Pending — 未绑定 PV

**远程应问**：
1. `kubectl get pvc <name> -n <ns>` — 状态是 Pending 还是 Bound？
2. `kubectl describe pvc <name> -n <ns>` — Events 中有什么信息？
3. StorageClass 是否存在？`kubectl get storageclass`

**根因决策**：

| 现象 | 根因 | 验证 | 处置建议 |
|------|------|------|---------|
| `no persistent volumes available` | 无可用 PV（静态供给） | `kubectl get pv` | 创建 PV 或改用动态供给 |
| `storageclass not found` | StorageClass 名称错误或不存在 | `kubectl get sc` | 修正 StorageClass 名称 |
| `provisioning failed` | CSI Driver 异常（动态供给） | `kubectl get pods -n kube-system \| grep csi` | 检查 CSI Controller Pod |
| `wait for first consumer` | WaitForFirstConsumer 模式 | 这是正常的——Pod 调度后才会绑定 | 无需处理，创建 Pod 后会自动绑定 |

参见 [[Kubernetes_Storage_Deep_Dive]]、[[_concepts/persistent-volume-claim]]、[[_concepts/persistent-volume]]、[[_concepts/storageclass]]、[[_concepts/csi]]。

---

## §2 Pod ContainerCreating — 卷挂载失败

**远程应问**：
1. `kubectl describe pod <name> -n <ns>` — Events 中的具体错误？
2. 这个卷是新建的还是已有卷重新挂载？
3. 上一个使用该卷的 Pod 是否已经终止？

**根因排序（按概率）**：

| Events 信息 | 根因 | 指导用户验证 | 处置建议 |
|------------|------|-------------|---------|
| `AttachVolume.Attach failed` | 卷无法挂载到节点 | 检查卷是否已被其他节点占用（RWO） | 确认旧 Pod 已释放 |
| `MountVolume.MountDevice failed` | 设备挂载失败 | 检查节点是否能访问存储后端 | 检查网络/存储驱动 |
| `MountVolume.SetUp failed` | 文件系统挂载失败 | 检查 fsType 和挂载选项 | 修正 fsType 配置 |
| `volume node affinity conflict` | 卷和 Pod 在不同可用区 | `kubectl get pv -o wide` 查看卷所在 AZ | 调整 Pod 调度或使用跨 AZ 存储 |
| `context deadline exceeded` | CSI 超时 | 检查 CSI Driver Pod 状态 | 重启 CSI Node Pod |

参见 [[Kubernetes_Storage_Deep_Dive]]、[[_concepts/csi]]。

---

## §3 卷已挂载但读写异常

**远程应问**：
1. 错误是 `Read-only file system` 还是 `No space left on device`？
2. `kubectl exec <pod> -- df -h <mount-path>` — 挂载点和空间？
3. `kubectl exec <pod> -- ls -la <mount-path>` — 权限是否正确？

**根因决策**：

| 错误 | 根因 | 处置建议 |
|------|------|---------|
| `Read-only file system` | 底层存储异常导致文件系统变只读 | 联系存储团队检查后端；临时：重启 Pod |
| `No space left on device` | 卷已满 | 扩容 PVC 或清理数据 |
| `Permission denied` | fsGroup / SecurityContext 不匹配 | 调整 fsGroup 或 initContainer chmod |
| `Input/output error` | 底层存储损坏 | 严重问题，需联系存储团队 |
| 挂载点为空 | 子路径错误或空目录挂载 | 检查 subPath / mountPath 配置 |

参见 [[Kubernetes_Storage_Deep_Dive]]、[[_concepts/persistent-volume]]。

---

## §4 Deployment 多副本 RWO 冲突

**典型工单场景**：Deployment 有 3 个副本，挂载同一块 RWO（ReadWriteOnce）云盘，只有 1 个 Pod 能启动，其他卡在 ContainerCreating。

**根因**：RWO 卷只能挂载到一个节点。

**远程建议**：
1. 确认访问模式：`kubectl get pvc -o custom-columns=NAME:.metadata.name,ACCESS:.spec.accessModes`
2. 如果需要多 Pod 共享：
   - 改用 RWX（如 NAS/NFS）存储
   - 或改为每 Pod 独立 PVC（配合 StatefulSet volumeClaimTemplates）
3. 专有云中，NAS（盘古文件系统）支持 RWX，建议咨询平台团队

参见 [[Kubernetes_Storage_Deep_Dive]]、[[_concepts/statefulset]]、[[_concepts/persistent-volume-claim]]。

---

## §5 StatefulSet 存储未正确关联

**远程应问**：
1. `kubectl get pvc -n <ns>` — 是否有 `<sts-name>-<ordinal>` 格式的 PVC？
2. StatefulSet 是否配置了 `volumeClaimTemplates`？
3. 删除 Pod 后 PVC 是否被保留？（StatefulSet 默认保留 PVC）

**常见问题**：

| 问题 | 原因 | 处置 |
|------|------|------|
| 无自动创建 PVC | 未配置 volumeClaimTemplates | 添加 volumeClaimTemplates |
| Pod 重新调度后数据丢失 | 使用了 volumePath 而非 PVC | 改用 PVC 模板 |
| PVC 残留导致混乱 | StatefulSet 删除后 PVC 默认保留 | 手动清理无用 PVC |
| 顺序启动卡住 | podManagementPolicy: OrderedReady | 改为 Parallel（如不需要顺序） |

参见 [[_concepts/statefulset]]、[[_concepts/persistent-volume-claim]]。

---

## §6 专有云特有：盘古/飞天存储后端

**远程应问**：
1. 存储类型是云盘（块存储）还是 NAS（文件存储）还是 OSS（对象存储）？
2. 通过 ASCM/天基确认存储后端服务是否正常？

**专有云存储映射**：

| K8s 概念 | 专有云产品 | 工单关注点 |
|---------|----------|----------|
| StorageClass (云盘) | 盘古块存储 (EBS) | 卷创建/挂载/扩容是否正常 |
| StorageClass (NAS) | 盘古文件系统 (NAS) | 挂载点权限 / 空间 / 性能 |
| CSI Driver | 云盘 CSI / NAS CSI | CSI Pod 是否正常 |
| 存储 Region/AZ | 专有云可用区 | 卷和 Pod 是否同 AZ |

参见 [[Alibaba_Cloud_Proprietary_K8s_Context]]、[[_concepts/oss]]、[[Kubernetes_Storage_Deep_Dive]]。

---

## 存储诊断命令速查

| 目的 | 命令 | 安全等级 |
|------|------|---------|
| 查看 PVC 状态 | `kubectl get pvc -n <ns>` | 🟢 只读 |
| 查看 PV 详情 | `kubectl get pv -o wide` | 🟢 只读 |
| 查看 StorageClass | `kubectl get sc` | 🟢 只读 |
| 查看 CSI 状态 | `kubectl get pods -n kube-system \| grep csi` | 🟢 只读 |
| 查看卷挂载 | `kubectl exec <pod> -- df -h` | 🟢 只读 |
| 扩容 PVC | `kubectl patch pvc <name> -p '{"spec":{"resources":{"requests":{"storage":"100Gi"}}}}'` | 🟠 中危 |
| 删除 PVC | `kubectl delete pvc <name>` | 🔴 高危，数据可能丢失 |

---

## 远程诊断安全护栏

| 操作 | 风险等级 | 远程建议方式 |
|------|---------|------------|
| 查看 PVC/PV/StorageClass | 🟢 只读 | 直接建议执行 |
| 扩容 PVC | 🟠 中危 | 确认存储后端支持在线扩容后建议 |
| 删除 PVC | 🔴 高危 | 强烈建议先备份数据，走变更流程 |
| 修改 StorageClass | 🔴 高危 | 不建议远程操作，需平台团队参与 |
| 重启 CSI Driver | 🔴 高危 | 可能影响全集群存储，走紧急变更流程 |

---

## Related

- [[Kubernetes_Storage_Deep_Dive]] — K8s 存储深度解析
- [[Kubernetes_Troubleshooting_Playbook]] — K8s 排障完整手册
- [[diagnosis-k8s-pod-failure]] — Pod 故障诊断决策树
- [[diagnosis-k8s-network-failure]] — 网络故障诊断决策树
- [[Alibaba_Cloud_Proprietary_K8s_Context]] — 专有云 K8s 上下文
- [[_concepts/persistent-volume-claim]] — PVC 概念
- [[_concepts/persistent-volume]] — PV 概念
- [[_concepts/storageclass]] — StorageClass 概念
- [[_concepts/csi]] — CSI 概念
- [[_concepts/statefulset]] — StatefulSet 概念
- [[_concepts/oss]] — OSS 对象存储概念
