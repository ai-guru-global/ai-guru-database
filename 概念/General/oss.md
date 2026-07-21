---
title: "OSS"
category: -concepts
tags: ["storage", "object-storage", "cloud", "alibaba-cloud"]
summary: "OSS（Object Storage Service）是阿里云提供的海量、安全、低成本、高可靠的对象存储服务，常用于 AI 训练数据、模型和日志的存储。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Object Storage Service"
  - "阿里云 OSS"
relationships:
  - target: "概念/storage"
    type: is_a
  - target: "概念/alibaba-cloud"
    type: provided_by
sources: []
---

# OSS

> **一句话理解**: OSS 是云上的「大硬盘」，适合存海量文件，按量付费，常用于存训练数据、模型权重和日志。

## 核心要点

- **对象存储**: 以对象（Object）形式存储，通过 HTTP/HTTPS 访问
- **高可靠**: 多副本冗余
- **低成本**: 适合冷数据和归档
- **大文件支持**: 适合模型权重、Checkpoint
- **生命周期管理**: 自动转冷存、过期删除

## 与 NAS/文件系统对比

| 特性 | OSS | NAS |
|------|-----|-----|
| 协议 | HTTP/S3 API | NFS/SMB |
| 延迟 | 较高 | 较低 |
| 成本 | 低 | 中 |
| 适用 | 备份、归档、大文件 | 共享工作目录 |

## 阿里云专有云关联

在阿里云专有云环境中，盘古对象存储提供 OSS 兼容接口，可作为 AI Stack 的模型仓库、数据集和日志存储。

## Related

- [[概念/storage|Storage]]
- [[概念/nas|NAS]]
- [[概念/alibaba-cloud|Alibaba Cloud]]

---

## 2026 OSS 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **阿里云 OSS** | 对象存储服务 | GA |
| **S3 兼容** | 兼容 S3 API | GA |
| **生命周期管理** | 自动分层/过期 | GA |
| **跨区域复制** | 数据容灾 | GA |
| **AI 数据湖** | 训练数据存储 | GA |

## 生产最佳实践

1. **数据存储**：训练数据/模型用 OSS 存储
2. **生命周期**：配置生命周期自动分层
3. **跨区域复制**：重要数据跨区域复制
4. **访问控制**：配置 Bucket 访问权限
5. **与 NAS 配合**：OSS + NAS 分层存储
