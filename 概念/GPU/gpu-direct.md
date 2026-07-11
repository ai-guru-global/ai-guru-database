---
title: "GPU Direct"
category: -concepts
tags: ["gpu", "nvidia", "rdma", "distributed-training", "alibaba-cloud"]
summary: "GPU Direct 是 NVIDIA 技术套件，允许 GPU 与网卡/存储设备直接交换数据，绕过 CPU 和系统内存，降低延迟并提升带宽。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "NVIDIA GPU Direct"
relationships:
  - target: "概念/nccl"
    type: used_by
  - target: "概念/infiniBand"
    type: related_to
sources: []
---

# GPU Direct

> **一句话理解**: GPU Direct 让 GPU 和网卡/硬盘「直接对话」，数据不经过 CPU 内存，分布式训练通信更快、CPU 开销更低。

## 核心要点

- **GPU Direct RDMA**: GPU 显存与 RDMA 网卡直接传输，常用于 InfiniBand/RoCE。
- **GPU Direct Storage**: GPU 与存储设备直接传输数据，加速数据加载。
- **需要驱动支持**: `nvidia-peer-memory` 或 `nvidia_p2p` 模块。
- **与 NCCL 配合**: NCCL 利用 GPU Direct RDMA 实现高效跨机通信。

## 检查命令

```bash
# 查看是否加载 peer memory 模块
lsmod | grep nvidia

# 在节点上
nvidia-smi topo -p2p r
```

## 阿里云专有云关联

在阿里云专有云高性能 GPU 集群中，GPU Direct RDMA 是支撑大规模分布式训练的关键。工单中「NCCL 走 TCP 而不是 RDMA」时，常需检查 GPU Direct 相关驱动是否正确加载。

## Related

- [[概念/nccl|NCCL]]
- [[概念/infiniBand|InfiniBand]]
- [[概念/nvlink|NVLink]]
- [[概念/distributed-training|分布式训练]]
