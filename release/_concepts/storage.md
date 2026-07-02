---
title: "Storage"
category: -concepts
tags: ["storage", "infrastructure", "ai", "alibaba-cloud"]
summary: "Storage（存储）是 AI 系统的关键基础设施，涵盖本地磁盘、NAS、对象存储、并行文件系统等多种形态。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "存储"
relationships:
  - target: "_concepts/oss"
    type: includes
  - target: "_concepts/nas"
    type: includes
  - target: "_concepts/distributed-filesystem"
    type: includes
---

# Storage

> **一句话理解**: 存储就是 AI 数据的「家」——训练数据、模型、Checkpoint、日志都需要合适的存储来放。

## 核心要点

- **块存储**: 云盘、本地 NVMe
- **文件存储**: NAS、并行文件系统
- **对象存储**: OSS/S3
- **分层存储**: 热/温/冷数据分级
- **性能指标**: IOPS、吞吐、延迟

## AI 场景选型

| 场景 | 推荐 |
|------|------|
| Checkpoint | 本地 NVMe / 并行文件系统 |
| 训练数据集 | 并行文件系统 / NAS |
| 模型仓库 | NAS / OSS |
| 日志/Artifact | OSS |
| 备份/归档 | OSS 冷存 |

## 阿里云专有云关联

在阿里云专有云环境中，存储层包括盘古块存储、文件存储 NAS、对象存储 OSS，ACK 通过 CSI 插件对接这些存储。

## Related

- [[_concepts/oss|OSS]]
- [[_concepts/nas|NAS]]
- [[_concepts/distributed-filesystem|Distributed Filesystem]]
- [[12_Architecture_Infrastructure/Storage/AI_Storage_Patterns|AI 存储模式]]
