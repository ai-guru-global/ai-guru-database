---
title: "MIG"
category: -concepts
tags: ["gpu", "nvidia", "virtualization", "multi-tenant", "alibaba-cloud"]
summary: "MIG（Multi-Instance GPU）是 NVIDIA 提供的 GPU 硬件级切片技术，可将单张 GPU 物理划分为多个独立实例，实现强隔离的多租户共享。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Multi-Instance GPU"
  - "NVIDIA MIG"
relationships:
  - target: "概念/gpu"
    type: part_of
  - target: "概念/gpu-sharing"
    type: is_a
  - target: "概念/hami"
    type: related_to
sources: []
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

- [[概念/gpu|GPU]]
- [[概念/gpu-sharing|GPU Sharing]]
- [[概念/hami|HAMi]]
- [[概念/time-slicing|Time Slicing]]
- [[运维/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]

---

## 2026 MIG 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **MIG (A100/H100)** | 多实例 GPU，硬件级隔离 | GA |
| **MIG 7 实例** | A100 最多切分 7 个实例 | GA |
| **MIG + K8s** | Kubernetes 原生 MIG 支持 | GA |
| **MIG 监控** | 每实例独立监控指标 | GA |
| **MIG 配置文件** | 预定义 MIG 配置模板 | GA |

## 生产最佳实践

1. **多租户必用**：多租户场景用 MIG 硬件隔离
2. **实例规格选择**：根据任务选择 1g/2g/3g/4g/7g 实例
3. **与 Time-Slicing 对比**：MIG 硬件隔离，Time-Slicing 软件隔离
4. **K8s 集成**：用 NVIDIA Device Plugin 管理 MIG
5. **监控每实例**：监控每个 MIG 实例的利用率
