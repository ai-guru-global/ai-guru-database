---
title: "MIG"
category: -concepts
tags: ["gpu", "nvidia", "virtualization", "multi-tenant", "alibaba-cloud"]
summary: "MIG（Multi-Instance GPU）是 NVIDIA 提供的 GPU 硬件级切片技术，可将单张 GPU 物理划分为多个独立实例，实现强隔离的多租户共享。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Multi-Instance GPU"
  - "NVIDIA MIG"
relationships:
  - target: "_concepts/gpu"
    type: part_of
  - target: "_concepts/gpu-sharing"
    type: is_a
  - target: "_concepts/hami"
    type: related_to
---

# MIG

> **一句话理解**: MIG 能把一张 A100/H100 物理切成最多 7 个独立小 GPU，每个实例有自己的显存和计算单元，互不干扰。

## 核心要点

- **硬件级隔离**: 在 GPU 硬件层面划分计算和显存资源。
- **强隔离**: 比时间片虚拟化更安全，适合多租户。
- **支持的 GPU**: A100、H100、H200 等数据中心 GPU。
- **Profile 配置**: 如 `1g.5gb`、`2g.10gb`、`3g.20gb` 等。
- **与 Kubernetes 集成**: 通过 NVIDIA Device Plugin 暴露为 `nvidia.com/mig-1g.5gb` 等资源。

## 常用命令

```bash
# 查看 MIG 状态
nvidia-smi mig -lgi
nvidia-smi mig -lci

# 创建 MIG 实例
nvidia-smi mig -cgi 19 -C
```

## 与 HAMi 对比

| 特性 | MIG | HAMi |
|------|-----|------|
| 隔离级别 | 硬件级 | 软件级 |
| 灵活性 | 固定 profile | 更灵活 |
| 支持 GPU | A100/H100 等 | 多厂商 |
| 显存超卖 | 不支持 | 支持 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，MIG 可用于 A100/H100 GPU 的多租户隔离。工单中「GPU 资源争抢」或「需要强隔离」时，可考虑 MIG。

## Related

- [[_concepts/gpu|GPU]]
- [[_concepts/gpu-sharing|GPU Sharing]]
- [[_concepts/hami|HAMi]]
- [[_concepts/time-slicing|Time Slicing]]
- [[AI运维/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
