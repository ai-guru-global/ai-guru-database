---
title: "GPU Sharing"
category: -concepts
tags: ["gpu", "virtualization", "kubernetes", "k8s", "multi-tenant", "alibaba-cloud"]
summary: "GPU Sharing 是让多张工作负载共享同一张物理 GPU 的技术，可提升资源利用率，常见实现包括时间片调度、MIG、HAMi 等。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "GPU 共享"
relationships:
  - target: "概念/gpu"
    type: related_to
  - target: "概念/mig"
    type: implemented_by
  - target: "概念/hami"
    type: implemented_by
sources: []
---

# GPU Sharing

> **一句话理解**: GPU 共享就是「一张显卡分给多个任务用」，提高利用率，但共享方式不同，隔离性和性能也不同。

## 核心要点

- **时间片调度**: 多个进程轮流使用 GPU，隔离性弱。
- **MIG**: 硬件级隔离，固定分区。
- **HAMi**: 软件级虚拟化，支持显存超卖和弹性配额。
- **适用场景**: 开发测试、低优先级推理、多租户平台。
- **风险**: 超卖可能导致 OOM 或性能干扰。

## 选型对比

| 方案 | 隔离性 | 灵活性 | 显存超卖 |
|------|--------|--------|---------|
| 时间片 | 低 | 高 | 否 |
| MIG | 高 | 低 | 否 |
| HAMi | 中 | 高 | 是 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，GPU 共享常用于开发测试环境和小规模推理服务。生产环境关键任务建议使用 MIG 或独占 GPU。

## Related

- [[概念/gpu|GPU]]
- [[概念/mig|MIG]]
- [[概念/hami|HAMi]]
- [[概念/time-slicing|Time Slicing]]
- [[概念/gpu-oom|GPU OOM]]
