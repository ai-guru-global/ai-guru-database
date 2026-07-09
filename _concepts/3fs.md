---
title: "3FS 分布式文件系统 (DeepSeek 3FS / Fire-Flyer File System)"
category: -concepts
tags: ["3fs", "fire-flyer", "deepseek", "distributed-storage", "training-data"]
relationships:
  - target: "_concepts/deepseek-models"
    type: related_to
  - target: "_concepts/dualpipe"
    type: related_to
  - target: "_concepts/deepgemm"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "3FS (Fire-Flyer File System) 是 DeepSeek 开源的高性能分布式文件系统，专为 AI 训练数据加载优化。利用 SSD 集群和客户端缓存，实现每秒 TB 级吞吐，是 DeepSeek-V3 训练的数据底座。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: supporting
---

# 3FS 分布式文件系统

> **一句话理解**: 3FS 是 DeepSeek 的"AI 训练专用存储"——利用 SSD 集群实现 TB/s 级数据吞吐，让 GPU 不再等数据。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全名** | Fire-Flyer File System (3FS) |
| **来源** | DeepSeek |
| **功能** | 高性能分布式文件系统 |
| **定位** | AI 训练/推理数据底座 |
| **开源** | MIT License |
| **GitHub** | github.com/deepseek-ai/3FS |

---

## 2. 核心问题

传统文件系统在 AI 训练中面临：

| 问题 | 说明 |
|------|------|
| **数据加载瓶颈** | GPU 计算速度快，但数据加载跟不上 |
| **随机读取效率** | 训练 batch 随机采样，传统 FS 随机 IO 差 |
| **元数据压力** | 百万小文件导致元数据操作缓慢 |
| **缓存失效** | 多节点训练时缓存命中率低 |

---

## 3. 3FS 解决方案

| 特性 | 说明 |
|------|------|
| **SSD 原生** | 专为 NVMe SSD 优化，不依赖 HDD |
| **用户态 IO** | 绕过内核，直接操作 SSD（SPDK/io_uring） |
| **客户端缓存** | 每个训练节点本地缓存热点数据 |
| **强一致性** | 写入后可立即读取最新数据 |
| **POSIX 兼容** | 标准文件 API，无需改代码 |

---

## 4. 性能指标

| 指标 | 3FS | HDFS | Ceph |
|------|-----|------|------|
| **顺序读** | ~6 TB/s (集群) | ~2 TB/s | ~3 TB/s |
| **随机读** | ~3 TB/s | ~500 GB/s | ~1 TB/s |
| **元数据 OPS** | 100 万+/s | 10 万/s | 50 万/s |
| **延迟** | ~100μs | ~10ms | ~5ms |
| **适用场景** | AI 训练/推理 | 大数据 | 通用存储 |

---

## 5. DeepSeek 开源训练生态

| 项目 | 功能 | 层级 |
|------|------|------|
| **FlashMLA** | MLA 注意力加速 | 推理算子 |
| **DeepGEMM** | FP8 GEMM 算子库 | 推理算子 |
| **DualPipe** | 双向流水线并行 | 训练调度 |
| **3FS** | 分布式文件系统 ← 本文 | 数据存储 |

---

## 6. 与其他分布式存储对比

| 维度 | 3FS | Alluxio | JuiceFS | GPFS |
|------|-----|---------|---------|------|
| **来源** | DeepSeek | Alluxio | Juicedata | IBM |
| **定位** | AI 专用 | 缓存加速 | 云存储 | HPC |
| **IO 模式** | 用户态 SSD | 缓存层 | FUSE | 内核态 |
| **POSIX** | ✅ | ⚠️ | ✅ | ✅ |
| **成本** | 开源 | 商业 | 开源 | 商业 |

---

## Related

- [[_concepts/deepseek-models]] — DeepSeek 模型系列
- [[_concepts/dualpipe]] — DualPipe 双向流水线
- [[_concepts/deepgemm]] — DeepGEMM FP8 算子库
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
