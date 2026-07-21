---
title: "Storage"
category: -concepts
tags: ["storage", "infrastructure", "ai", "checkpoint", "object-storage", "parallel-filesystem"]
summary: "Storage（存储）是 AI 系统的关键基础设施，涵盖本地磁盘、NAS、对象存储、并行文件系统等多种形态。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "存储"
  - "AI Storage"
relationships:
  - target: "概念/oss"
    type: includes
  - target: "概念/nas"
    type: includes
  - target: "概念/distributed-filesystem"
    type: includes
sources: []
---

# Storage（存储）

> **一句话理解**: 存储 = AI 数据的「家」——训练数据、模型、Checkpoint、日志都需要合适的存储来放。

## 定义

Storage 是 AI 系统的数据持久化基础设施，不同场景（训练、推理、备份）对存储的性能、容量、成本要求差异巨大，需要分层选型。

## 存储类型对比

| 类型 | 代表 | 性能 | 成本 | 典型场景 |
|------|------|------|------|----------|
| **块存储** | 本地 NVMe、云盘 | 极高 IOPS | 高 | Checkpoint、临时文件 |
| **文件存储** | NAS、GPFS、Lustre | 高吞吐 | 中 | 训练数据集、模型仓库 |
| **对象存储** | S3、OSS、GCS | 中 | 低 | 日志、Artifact、备份 |
| **并行文件系统** | GPFS、Lustre、DAOS | 极高吐吐 | 高 | 大规模训练 |

## AI 场景选型指南

| 场景 | 推荐 | 关键指标 |
|------|------|----------|
| **Checkpoint** | 本地 NVMe / 并行 FS | 写入吞吐 > 10GB/s |
| **训练数据集** | 并行 FS / NAS | 随机读取 IOPS |
| **模型仓库** | NAS / OSS | 容量 + 版本管理 |
| **日志/Artifact** | OSS | 成本 + 生命周期 |
| **备份/归档** | OSS 冷存 | 最低成本 |
| **向量数据** | 专用向量库 | 低延迟检索 |

## 2026 年 AI 存储趋势

| 趋势 | 影响 |
|------|------|
| **Checkpoint 异步化** | 训练不停顿，后台写 Checkpoint |
| **分层存储自动化** | 热/温/冷数据自动迁移 |
| **计算存储分离** | GPU 节点无状态，存储集中管理 |
| **NVMe-oF** | 远程 NVMe，兼顾性能和灵活性 |

## 生产最佳实践

1. **Checkpoint 用本地 NVMe**：避免网络存储成为训练瓶颈
2. **数据集预热**：训练前将数据加载到本地/缓存
3. **分层存储**：热数据 NVMe，温数据 NAS，冷数据 OSS
4. **生命周期策略**：日志 30 天后自动转冷存
5. **容量监控**：训练数据增长快，提前规划扩容

## Related

- [[概念/oss|OSS]]
- [[概念/nas|NAS]]
- [[概念/distributed-filesystem|Distributed Filesystem]]
- [[概念/General/cloud-cost|Cloud Cost]] — 存储成本优化
- [[架构基建/Storage/AI_Storage_Patterns|AI 存储模式]]
