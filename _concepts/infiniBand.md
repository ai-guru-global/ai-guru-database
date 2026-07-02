---
title: "InfiniBand"
category: -concepts
tags: ["networking", "rdma", "gpu", "distributed-training", "high-performance-computing", "alibaba-cloud"]
summary: "InfiniBand 是高性能计算场景常用的高速网络技术，支持 RDMA，广泛用于大规模 GPU 集群的分布式训练。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "IB"
  - "InfiniBand 网络"
relationships:
  - target: "_concepts/nccl"
    type: used_by
  - target: "_concepts/gpu-direct"
    type: related_to
  - target: "_concepts/distributed-training"
    type: related_to
sources: []
---

# InfiniBand

> **一句话理解**: InfiniBand 是数据中心里的「高速公路」，让 GPU 之间可以直接高速通信，延迟远低于传统以太网。

## 核心要点

- **RDMA 支持**: 允许网卡直接读写远端内存，CPU 开销极低。
- **高带宽低延迟**: 常见 100G/200G/400G NDR，延迟微秒级。
- **IB 协议栈**: 不同于 TCP/IP，使用 IB Verbs API。
- **Mellanox/NVIDIA 主导**: ConnectX 系列网卡 + OFED 驱动。
- **与 NCCL 配合**: NCCL 通过 IB 完成跨节点 GPU 集合通信。

## 常用命令

```bash
# 查看 IB 设备状态
ibstat
ibstatus
ibv_devinfo

# 测试带宽
ib_write_bw
ib_read_bw
```

## 阿里云专有云关联

在阿里云专有云环境中，神龙 GPU 集群常配置 InfiniBand 或 RoCE 网络支撑大规模分布式训练。工单中「NCCL 初始化失败」或「跨节点训练慢」时，需检查 IB 网卡驱动、端口状态和子网管理器（Subnet Manager）。

## Related

- [[_concepts/nccl|NCCL]]
- [[_concepts/nvlink|NVLink]]
- [[_concepts/gpu-direct|GPU Direct]]
- [[_concepts/distributed-training|分布式训练]]
- [[07_Model_Training/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]
