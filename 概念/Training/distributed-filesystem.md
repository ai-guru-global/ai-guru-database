---
title: "Distributed Filesystem"
category: -concepts
tags: ["storage", "distributed-systems", "ai", "training", "checkpoint", "lustre", "cpfs", "parallel-filesystem"]
summary: "Distributed Filesystem（分布式文件系统）是跨多个节点提供统一文件访问的存储系统，常用于 AI 训练数据与 Checkpoint 的共享存储。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "分布式文件系统"
  - "并行文件系统"
  - "Parallel Filesystem"
relationships:
  - target: "概念/Training/distributed-systems"
    type: part_of
  - target: "概念/Training/storage"
    type: is_a
  - target: "概念/Training/parallel-training"
    type: enables
sources:
  - "https://www.lustre.org/"
---

# Distributed Filesystem

> **一句话理解**: 分布式文件系统就是把很多台机器的硬盘连成一片「大硬盘」，让多台 GPU 节点能同时高速读写训练数据。

## 为什么 AI 训练需要分布式文件系统

| 需求 | 说明 |
|------|------|
| **多节点并发读** | 数百台 GPU 机器同时读取训练数据 |
| **高吞吐写入** | Checkpoint 写入数百 GB，不能阻塞训练 |
| **共享访问** | 所有节点看到同一份数据，无需复制 |
| **POSIX 兼容** | PyTorch DataLoader 等无需改代码 |
| **弹性扩展** | 数据量增长时可在线扩容 |

## 主流分布式文件系统对比

| 系统 | 类型 | 吞吐 | 延迟 | 适用场景 | 特色 |
|------|------|------|------|----------|------|
| **Lustre** | 并行文件系统 | 极高 (TB/s) | 低 | HPC/AI 训练 | 最成熟、广泛使用 |
| **GPFS (Spectrum Scale)** | 并行文件系统 | 极高 | 低 | 企业级 HPC | IBM、快照、分层 |
| **BeeGFS** | 并行文件系统 | 高 | 低 | 中小规模 AI | 易部署、免费 |
| **CPFS** | 并行文件系统 | 极高 | 低 | 阿里云 AI | 全托管、与 ACK 集成 |
| **WEKA** | NVMe 并行 | 极高 | 极低 | GPU 训练 | 全闪存、K8s 原生 |
| **CephFS** | 分布式文件系统 | 中 | 中 | 通用存储 | 开源、统一存储 |
| **JuiceFS** | 元数据+对象存储 | 中 | 中 | 云原生 AI | 缓存加速、S3 后端 |

## 与对象存储对比

| 特性 | 分布式文件系统 | 对象存储 (OSS/S3) |
|------|--------------|--------|
| 延迟 | 低 (μs-ms) | 高 (10-100ms) |
| 小文件 | 较好 | 较差 |
| 扩展性 | 强 (PB级) | 极强 (EB级) |
| 成本 | 中 | 低 |
| 访问接口 | POSIX | HTTP API |
| 并发读写 | 原生支持 | 需额外设计 |
| 适用 | 训练数据、Checkpoint | 冷数据、备份、数据集分发 |

## AI 训练存储架构

```
分层存储架构:

┌─────────────────────────────────────────┐
│  热层: 并行文件系统 (Lustre/CPFS/WEKA)  │  ← 训练数据 + 当前 Checkpoint
├─────────────────────────────────────────┤
│  温层: NAS / CephFS                    │  ← 历史 Checkpoint + 日志
├─────────────────────────────────────────┤
│  冷层: 对象存储 (OSS/S3)              │  ← 数据集归档 + 模型发布
└─────────────────────────────────────────┘
```

## Checkpoint 存储最佳实践

| 实践 | 说明 |
|------|------|
| **异步写入** | 不阻塞训练主循环 |
| **分片写入** | 每个 rank 写自己的分片，避免单点瓶颈 |
| **双缓冲** | 写入 buffer A 时训练用 buffer B |
| **定期清理** | 只保留最近 N 个 Checkpoint |
| **分层存储** | 最新 Checkpoint 在热层，旧的转冷层 |

## 性能调优要点

| 维度 | 建议 |
|------|------|
| **条带化 (Striping)** | 大文件分片到多个 OST，提高并行吐吐 |
| **预读 (Read-ahead)** | 顺序读取时提前加载后续数据 |
| **客户端缓存** | 元数据缓存减少网络往返 |
| **网络** | RDMA/InfiniBand 连接存储节点 |
| **容量规划** | 预留 20% 空间避免写满降速 |

## 阿里云专有云关联

在阿里云专有云环境中，CPFS 等并行文件系统常用于 ACK 上 AI 训练集群的共享存储。工单中「训练吐吐低」时，需检查 CPFS 带宽利用率、条带化配置、以及网络拓扑是否跨 AZ。

## Related

- [[概念/Training/storage|Storage]]
- [[概念/Training/oss|OSS]]
- [[概念/Training/nas|NAS]]
- [[架构基建/Storage/AI_Storage_Patterns|AI 存储模式]]
- [[概念/Training/parallel-training|并行训练]]

## 2026 分布式文件系统生态现状

| 文件系统 | 类型 | 吞吐 | 适用场景 | 状态 |
|------|------|------|------|------|
| Lustre | 并行 FS | 100 GB/s+ | 训练数据 | ✅ 成熟 |
| GPFS/Spectrum Scale | 并行 FS | 100 GB/s+ | HPC/AI | ✅ 成熟 |
| CephFS | 分布式 | 10 GB/s | 通用 | ✅ 主流 |
| JuiceFS | 云原生 | 5 GB/s | 云上 AI | ✅ 主流 |
| Alluxio | 缓存层 | 20 GB/s | 数据编排 | ✅ 主流 |
| NFS | 网络 FS | 1 GB/s | 共享文件 | ✅ 成熟 |

## 检查清单

- [ ] 文件系统已根据工作负载选择
- [ ] 吞吐满足训练需求
- [ ] 容量已规划（含增长）
- [ ] 备份和恢复已配置
- [ ] 监控已接入（IOPS/吞吐/延迟）
- [ ] 数据预热已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 训练 I/O 瓶颈 | 文件系统吞吐不足 | 升级并行 FS 或数据预热 |
| 小文件性能差 | 元数据瓶颈 | 合并为 TFRecord/WebDataset |
| 容量不足 | 数据增长快 | 扩容 + 生命周期策略 |
| 延迟高 | 网络拥塞 | 优化网络或本地缓存 |

## 延伸阅读

- [[概念/RAG/storage|Storage]] — AI 存储总览
- [[概念/RAG/storageclass|StorageClass]] — K8s 存储抽象
- [[概念/K8s/persistent-volume|Persistent Volume]] — K8s 持久化存储
- [[架构基建/Storage/AI_Storage_Patterns|AI 存储模式]] — 存储架构设计
- [[概念/Training/parallel-training|Parallel Training]] — 并行训练

> ℹ️ 分布式文件系统是 AI 训练的数据底座，2026年 Lustre/GPFS 仍是训练数据首选，JuiceFS/Alluxio 是云上新选择。

## 主流分布式文件系统对比

| 文件系统 | 类型 | 吞吐 | 适用场景 | 部署复杂度 |
|------|------|------|------|------|
| Lustre | 并行 FS | 极高 | HPC/AI 训练 | 高 |
| GPFS/Spectrum Scale | 并行 FS | 极高 | 企业 AI | 高 |
| Ceph | 分布式 | 高 | 通用存储 | 中 |
| JuiceFS | 云原生 | 中高 | 云上 AI | 低 |
| Alluxio | 数据编排 | 高 | 缓存加速 | 中 |
| NFS | 网络 FS | 中 | 小规模 | 低 |
| HDFS | 分布式 | 高 | 大数据生态 | 中 |
| WekaFS | 并行 FS | 极高 | AI/HPC | 中 |

## 性能调优要点

| 调优项 | 方法 | 效果 |
|------|------|------|
| 条带化 | 增大 stripe size/count | 提升顺序读写吞吐 |
| 预读 | 配置 readahead | 减少 I/O 等待 |
| 缓存 | 客户端/服务端缓存 | 降低延迟 |
| 元数据 | 分离 MDS 或缓存 | 提升小文件性能 |
| 网络 | RDMA/InfiniBand | 降低传输延迟 |
| 数据格式 | TFRecord/WebDataset | 减少小文件开销 |

## 部署架构参考

```
┌─────────────────────────────────────────┐
│            AI Training Cluster           │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │GPU-0│ │GPU-1│ │GPU-2│ │GPU-N│      │
│  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘      │
│     └───────┴───────┴───────┘          │
│              │ RDMA/IB Network          │
└──────────────┼──────────────────────────┘
               │
┌──────────────┼──────────────────────────┐
│    Distributed File System Layer        │
│  ┌───────────┴───────────────┐          │
│  │  Lustre / GPFS / JuiceFS  │          │
│  └───────────┬───────────────┘          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │OSS-0│ │OSS-1│ │OSS-2│ │OSS-N│      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
└─────────────────────────────────────────┘
```

## 容量规划参考

| 训练规模 | 数据集大小 | 推荐文件系统 | 网络要求 |
|------|------|------|------|
| 单机 8 卡 | < 1 TB | 本地 NVMe + NFS | 10 GbE |
| 多机 64 卡 | 1-10 TB | Lustre/Ceph | 100 GbE |
| 集群 512+ 卡 | 10-100 TB | Lustre/GPFS/WekaFS | IB HDR/NDR |
| 超大规模 | > 100 TB | GPFS + 对象存储分层 | IB NDR + 分层 |

## 数据生命周期管理

| 阶段 | 存储层 | 策略 |
|------|------|------|
| 热数据（当前训练） | 高性能并行 FS | 全速读写 |
| 温数据（近期实验） | 标准分布式 FS | 按需加载 |
| 冷数据（历史数据集） | 对象存储/磁带 | 归档压缩 |
| 中间检查点 | 并行 FS + 对象存储 | 异步上传 |
