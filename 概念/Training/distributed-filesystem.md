---
title: "Distributed Filesystem"
category: -concepts
tags: ["storage", "distributed-systems", "ai", "training", "alibaba-cloud"]
summary: "Distributed Filesystem（分布式文件系统）是跨多个节点提供统一文件访问的存储系统，常用于 AI 训练数据与 Checkpoint 的共享存储。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "分布式文件系统"
relationships:
  - target: "概念/distributed-systems"
    type: part_of
  - target: "概念/storage"
    type: is_a
sources: []
---

# Distributed Filesystem

> **一句话理解**: 分布式文件系统就是把很多台机器的硬盘连成一片「大硬盘」，让多台 GPU 节点能同时高速读写训练数据。

## 核心要点

- **共享访问**: 多节点并发读写
- **高吞吐**: 适合大文件顺序读写
- **POSIX 兼容**: 无需改代码即可使用
- **典型系统**: Lustre、GPFS、BeeGFS、CPFS、WEKA

## 与对象存储对比

| 特性 | 分布式文件系统 | 对象存储 |
|------|--------------|---------|
| 延迟 | 低 | 高 |
| 小文件 | 较好 | 较差 |
| 扩展性 | 强 | 极强 |
| 成本 | 中 | 低 |
| 适用 | 训练数据、Checkpoint | 冷数据、备份 |

## AI 场景

- 训练数据共享
- Checkpoint 写入
- 模型仓库共享

## 阿里云专有云关联

在阿里云专有云环境中，CPFS 等并行文件系统常用于 ACK 上 AI 训练集群的共享存储。

## Related

- [[概念/storage|Storage]]
- [[概念/oss|OSS]]
- [[概念/nas|NAS]]
- [[架构基建/Storage/AI_Storage_Patterns|AI 存储模式]]
