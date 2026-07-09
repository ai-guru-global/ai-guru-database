---
title: "AI 存储模式"
category: 12-architecture-infrastructure
subcategory: storage
tags: ["storage", "ai", "checkpoint", "nas", "oss", "distributed-filesystem", "alibaba-cloud"]
summary: "面向 AI 训练与推理的存储模式：本地 NVMe、并行文件系统、对象存储、NAS 的选型与组合策略。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# AI 存储模式

> **一句话理解**: AI 场景存储要同时满足「训练时高吞吐读数据」和「Checkpoint 时高吞吐写大文件」，不同环节用不同存储。

## 目录

- [1. AI 存储的三种负载](#1-ai-存储的三种负载)
- [2. 存储类型对比](#2-存储类型对比)
- [3. 数据加载优化](#3-数据加载优化)
- [4. Checkpoint 策略](#4-checkpoint-策略)
- [5. K8s 存储配置](#5-k8s-存储配置)
- [Related](#related)

---

## 1. AI 存储的三种负载

| 负载 | 特征 | 存储需求 |
|------|------|---------|
| **训练数据读取** | 大量小文件/大文件流式读取 | 高吞吐、低延迟 |
| **Checkpoint 写入** | 周期性写大文件（GB-TB） | 高吞吐、高带宽 |
| **模型仓库/Artifact** | 大文件、版本化、共享读取 | 高可靠、可共享 |

---

## 2. 存储类型对比

| 类型 | 吞吐 | 延迟 | 适用 |
|------|------|------|------|
| **本地 NVMe** | 极高 | 极低 | Checkpoint、热数据 |
| **并行文件系统** | 高 | 低 | 训练数据、共享数据集 |
| **NAS** | 中 | 中 | 模型仓库、小数据集 |
| **对象存储 OSS** | 高（顺序） | 高 | 冷数据、备份、Artifact |

常见并行文件系统：Lustre、GPFS、BeeGFS、CPFS、WEKA。

## 3. 数据加载优化

- **WebDataset / TFRecord / Arrow**: 打包小文件为大文件
- **DALI**: GPU 直接解码
- **预取与缓存**: 训练前把数据缓存到本地 NVMe
- **分层存储**: 热数据 NVMe，温数据并行文件系统，冷数据 OSS

## 4. Checkpoint 策略

```text
高频 checkpoint → 本地 NVMe
异步上传 → 并行文件系统 / OSS
最终归档 → OSS / 磁带库
```

## 5. K8s 存储配置

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: training-data
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: cpfs-rwx
  resources:
    requests:
      storage: 10Ti
```

---

## Related

- [[_concepts/distributed-filesystem|Distributed Filesystem]]
- [[_concepts/oss|OSS]]
- [[_concepts/nas|NAS]]
- [[12_Architecture_Infrastructure/Storage/Checkpoint_and_Model_Storage|Checkpoint 与模型存储]]

- [[12_Architecture_Infrastructure/README|架构与基础设施 (Architecture & Infrastructure)]]
