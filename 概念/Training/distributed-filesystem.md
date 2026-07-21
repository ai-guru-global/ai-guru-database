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
