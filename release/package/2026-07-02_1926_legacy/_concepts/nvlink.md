---
title: "NVLink"
category: -concepts
tags: ["gpu", "nvidia", "interconnect", "distributed-training", "alibaba-cloud"]
summary: "NVLink 是 NVIDIA 提供的高速 GPU 互联技术，用于同一节点内多张 GPU 卡之间的高速通信，带宽远高于 PCIe。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "NVIDIA NVLink"
relationships:
  - target: "_concepts/nccl"
    type: used_by
  - target: "_concepts/distributed-training"
    type: related_to
---

# NVLink

> **一句话理解**: NVLink 是 NVIDIA GPU 之间的「专用快车道」，让同一台服务器里的多张 GPU 卡能以极高带宽互相访问显存。

## 核心要点

- **高带宽**: 单链路可达 50GB/s 双向，NVLink 4 单卡可达 900GB/s 聚合带宽。
- **低延迟**: 比 PCIe 更快，适合大模型张量并行。
- **支持 P2P 显存访问**: GPU 可以直接读写另一张 GPU 的显存。
- **NVSwitch**: 在 DGX/HGX 中实现 8/16 卡全连接交换。
- **与 NCCL 集成**: NCCL 自动优先使用 NVLink 进行节点内通信。

## 常用命令

```bash
# 查看 GPU 拓扑
nvidia-smi topo -m

# 查看 NVLink 状态
nvidia-smi nvlink -e
```

## 阿里云专有云关联

在阿里云专有云环境中，神龙 GPU 实例（如 V100、A100、H100 机型）通常配备 NVLink/NVSwitch。工单中「单节点多卡训练慢」时，需通过 `nvidia-smi topo -m` 确认 GPU 间是否通过 NVLink 连接。

## Related

- [[_concepts/nccl|NCCL]]
- [[_concepts/infiniBand|InfiniBand]]
- [[_concepts/gpu-direct|GPU Direct]]
- [[_concepts/distributed-training|分布式训练]]
