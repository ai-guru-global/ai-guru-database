---
title: "NAS"
category: -concepts
tags: ["storage", "file-storage", "cloud", "alibaba-cloud"]
summary: "NAS（Network Attached Storage）是网络附加存储，提供文件级访问接口（NFS/SMB），适合 AI 训练中的共享工作目录和模型仓库。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Network Attached Storage"
  - "阿里云 NAS"
relationships:
  - target: "概念/storage"
    type: is_a
  - target: "概念/alibaba-cloud"
    type: provided_by
sources: []
---

# NAS

> **一句话理解**: NAS 就是网络上的共享硬盘，多台机器可以同时挂载，适合存大家都要读写的文件。

## 核心要点

- **文件级访问**: 支持 NFS/SMB 协议
- **共享**: 多客户端同时访问
- **POSIX 兼容**: 无需改代码
- **适用**: 共享数据集、模型仓库、开发环境 home 目录

## 与 OSS 对比

| 特性 | NAS | OSS |
|------|-----|-----|
| 协议 | NFS/SMB | S3/HTTP |
| 延迟 | 低 | 较高 |
| 小文件 | 友好 | 较差 |
| 扩展性 | 有限 | 无限 |
| 成本 | 中 | 低 |

## 阿里云专有云关联

在阿里云专有云环境中，NAS 可作为 ACK 的 ReadWriteMany PVC，用于多 Pod 共享数据集和模型。

## Related

- [[概念/storage|Storage]]
- [[概念/oss|OSS]]
- [[概念/alibaba-cloud|Alibaba Cloud]]
