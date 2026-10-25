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
name_zh: "存储"
---

# Storage（存储）

> 中文简称：存储

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

## 2026 AI 存储生态现状

| 存储类型 | 代表产品 | 场景 | 状态 |
|------|------|------|------|
| 本地 NVMe | Samsung PM9A3 | Checkpoint/缓存 | ✅ 主流 |
| 并行文件系统 | Lustre/GPFS | 训练数据 | ✅ 成熟 |
| 对象存储 | S3/OSS/MinIO | 数据集/模型 | ✅ 主流 |
| 向量数据库 | Milvus/Qdrant | RAG 检索 | ✅ 成熟 |
| GPU 直存 | GPUDirect Storage | 数据加载 | ✅ 新增 |
| 分布式缓存 | Alluxio/JuiceFS | 数据加速 | ✅ 成熟 |

## 存储性能指标

| 指标 | 说明 | 目标值 |
|------|------|------|
| 吞吐量 | 顺序读写速度 | > 10 GB/s (训练) |
| IOPS | 随机读写次数 | > 100K (Checkpoint) |
| 延迟 | 单次访问延迟 | < 1ms (NVMe) |
| 容量 | 总存储空间 | 按需扩展 |
| 可用性 | SLA | 99.99% |

## 检查清单

- [ ] 存储类型与场景匹配
- [ ] 分层存储策略已配置
- [ ] 生命周期策略已配置
- [ ] 容量监控已配置
- [ ] 备份策略已配置
- [ ] 性能基线已建立
- [ ] 扩容方案已规划

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Checkpoint 慢 | 网络存储带宽不足 | 使用本地 NVMe + 异步写入 |
| 数据加载慢 | 未预热 | 训练前预加载到本地/缓存 |
| 容量不足 | 数据增长快 | 配置自动扩容 + 生命周期策略 |
| 成本高 | 未分层 | 热/温/冷分层存储 |
| 可靠性差 | 单点故障 | 多副本 + 跨 AZ 备份 |

## 延伸阅读

- [[概念/RAG/vector-database|Vector Database]] — 向量存储
- [[概念/GPU/gpu-direct|GPUDirect]] — GPU 直存加速
- [[概念/MLOps/data-versioning|数据版本]] — 数据版本管理
- [[概念/General/cloud-cost|Cloud Cost]] — 存储成本优化
- [[12_架构基建/09_存储/01_AI_存储_模式|AI 存储模式]]

> ℹ️ AI 存储是训练和推理的基础设施，2026年分层存储 + GPUDirect Storage + 分布式缓存是标配，根据场景选择 NVMe/并行文件系统/对象存储组合。

## 存储架构示例

```
训练数据 → 并行文件系统 (Lustre/GPFS)
Checkpoint → 本地 NVMe + 异步上传 OSS
模型权重 → 对象存储 (S3/OSS)
RAG 向量 → 向量数据库 (Milvus/Qdrant)
缓存层 → Alluxio/JuiceFS
```

## 容量规划参考

| 场景 | 数据量 | 存储类型 | 容量估算 |
|------|------|------|------|
| 7B 模型训练 | 1-10 TB | 并行 FS | 数据集 × 3 副本 |
| Checkpoint | 14 GB/次 | NVMe + OSS | 每 1000 步保存 |
| RAG 知识库 | 100 GB | 向量 DB | 向量数 × 维度 × 4B |
| 日志 | 持续增长 | OSS | 30 天后转冷 |

## 检查清单

- [ ] 训练数据已放置在并行文件系统或本地 NVMe
- [ ] Checkpoint 写入路径已配置为高速存储
- [ ] 向量数据库已启用持久化和副本
- [ ] 分层存储策略已定义（热/温/冷）
- [ ] 容量监控告警已配置（80% 阈值）
- [ ] 数据备份和恢复流程已验证
- [ ] 存储 IOPS 满足训练吐吐量需求

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Checkpoint 写入慢 | 网络存储带宽不足 | 改用本地 NVMe + 异步上传 |
| 向量检索延迟高 | 数据未加载到内存 | 启用 mmap 或增加内存 |
| 存储空间不足 | 日志/Checkpoint 累积 | 配置生命周期策略自动清理 |
| 训练 I/O 瓶颈 | 小文件随机读取 | 合并为 TFRecord/WebDataset |
| 数据加载慢 | 网络延迟 | 数据预热到本地缓存 |

## 延伸阅读

- [[概念/RAG/vector-database|Vector Database]] — 向量存储与检索
- [[概念/RAG/storageclass|StorageClass]] — K8s 存储抽象
- [[概念/GPU/gpu-direct|GPUDirect]] — GPU 直接存储访问
- [[概念/K8s/persistent-volume|Persistent Volume]] — K8s 持久化存储
- [[12_架构基建/09_存储/01_AI_存储_模式|AI 存储模式]] — 存储架构设计

> ℹ️ AI 存储架构的核心原则是「分层匹配」：训练用并行 FS、推理用本地 NVMe、归档用 对象存储，避免一刀切导致性能浪费或瓶颈。

## 2026 AI 存储性能基准

| 存储类型 | 顺序读 | 随机 IOPS | 延迟 | 适用场景 |
|------|------|------|------|------|
| NVMe SSD | 7 GB/s | 1M | < 0.1ms | Checkpoint/缓存 |
| Lustre | 100 GB/s | 50K | 1-5ms | 训练数据 |
| Ceph | 5 GB/s | 10K | 5-10ms | 通用持久化 |
| S3/MinIO | 10 GB/s | N/A | 10-50ms | 模型/数据集 |
| NFS | 1 GB/s | 5K | 10-20ms | 共享文件 |

## 延伸阅读

- [[概念/RAG/vector-database|Vector Database]] — 向量存储与检索
- [[概念/RAG/storageclass|StorageClass]] — K8s 存储抽象
- [[概念/GPU/gpu-direct|GPUDirect]] — GPU 直接存储访问
- [[概念/K8s/persistent-volume|Persistent Volume]] — K8s 持久化存储
- [[12_架构基建/09_存储/01_AI_存储_模式|AI 存储模式]] — 存储架构设计

> ℹ️ 存储选型决策：训练数据用 Lustre/NVMe，Checkpoint 用 NVMe，模型归档用 S3，向量检索用内存 + SSD，避免用 NFS 承载高 I/O。

## 容量规划公式

```
向量存储 = 向量数 × 维度 × 4B (float32)
示例: 10M × 768维 = ~30 GB
Checkpoint = 模型参数 × 2 (fp16) × 副本数
示例: 7B 模型 = 14 GB × 3 = 42 GB
训练数据 = 原始数据 × 3 (副本) × 1.5 (元数据)
```

## 监控指标

| 指标 | 告警阈值 | 说明 |
|------|------|------|
| 磁盘使用率 | > 80% | 提前扩容 |
| IOPS 利用率 | > 90% | 性能瓶颈 |
| 写入延迟 | > 10ms | 存储降级 |
| 容量增长率 | 异常 | 数据泄漏 |
