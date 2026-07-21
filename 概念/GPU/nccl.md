---
title: "NCCL"
category: -concepts
tags: ["distributed-training", "gpu", "nvidia", "communication", "kubernetes", "k8s", "alibaba-cloud"]
summary: "NCCL（NVIDIA Collective Communications Library）是 NVIDIA 提供的高性能多 GPU 集合通信库，是 PyTorch/TensorFlow 分布式训练的核心依赖。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "NVIDIA Collective Communications Library"
  - "NCCL 通信库"
relationships:
  - target: "概念/distributed-training"
    type: used_by
  - target: "概念/infiniBand"
    type: uses
  - target: "概念/nvlink"
    type: uses
sources: []
---

# NCCL

> **一句话理解**: NCCL 是 NVIDIA GPU 之间的「高速对讲机」，负责分布式训练里的 AllReduce、Broadcast、AllGather 等集合通信。

## 核心要点

- **集合通信原语**: AllReduce、AllGather、ReduceScatter、Broadcast、Reduce、AllToAll。
- **GPU 感知**: 自动选择 NVLink、PCIe、InfiniBand / RoCE 等最优传输路径。
- **与深度学习框架集成**: PyTorch DDP/FSDP、DeepSpeed、Megatron-LM、Horovod 都依赖 NCCL。
- **环境变量丰富**: `NCCL_DEBUG`、`NCCL_IB_DISABLE`、`NCCL_SOCKET_IFNAME`、`NCCL_TIMEOUT` 等。
- **版本敏感**: NCCL 版本需与 CUDA、驱动、框架匹配。

## 常用调试环境变量

```bash
export NCCL_DEBUG=INFO
export NCCL_DEBUG_SUBSYS=ALL
export NCCL_IB_DISABLE=0
export NCCL_SOCKET_IFNAME=eth0
export NCCL_TIMEOUT=1800
```

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，分布式训练通常部署在神龙 GPU 集群上，NCCL 会通过 RDMA/InfiniBand 网络进行跨机通信。工单中「分布式训练 Hang」时，开启 `NCCL_DEBUG=INFO` 是定位根因的第一步。

## Related

- [[概念/distributed-training|分布式训练]]
- [[概念/deepspeed|DeepSpeed]]
- [[概念/fsdp|FSDP]]
- [[概念/infiniBand|InfiniBand]]
- [[概念/nvlink|NVLink]]
- [[模型训练/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]

---

## 2026 NCCL 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **NCCL 2.20+** | 支持 NVLink/InfiniBand/RoCE | GA |
| **AllReduce** | 多 GPU 梯度聚合 | GA |
| **AllGather** | 多 GPU 数据收集 | GA |
| **ReduceScatter** | 规约后分发 | GA |
| **NCCL Tests** | 带宽/延迟测试工具 | GA |

## 生产最佳实践

1. **分布式训练必用**：多 GPU/多节点训练必须用 NCCL
2. **拓扑优化**：根据 GPU 拓扑优化 NCCL 通信路径
3. **InfiniBand 配合**：多节点用 InfiniBand + NCCL
4. **监控带宽**：用 NCCL Tests 监控通信带宽
5. **Hang 排障**：训练 Hang 时检查 NCCL 通信状态
