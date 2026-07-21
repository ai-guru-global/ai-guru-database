---
title: "NVLink"
category: -concepts
tags: ["gpu", "nvidia", "interconnect", "distributed-training", "alibaba-cloud"]
summary: "NVLink 是 NVIDIA 提供的高速 GPU 互联技术，用于同一节点内多张 GPU 卡之间的高速通信，带宽远高于 PCIe。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "NVIDIA NVLink"
relationships:
  - target: "概念/nccl"
    type: used_by
  - target: "概念/distributed-training"
    type: related_to
sources: []
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

- [[概念/nccl|NCCL]]
- [[概念/infiniBand|InfiniBand]]
- [[概念/gpu-direct|GPU Direct]]
- [[概念/distributed-training|分布式训练]]

---

## 2026 NVLink 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **NVLink 4.0** | H100 专用，900 GB/s 双向带宽 | GA |
| **NVLink 5.0** | B100/B200 专用，1.8 TB/s 带宽 | GA |
| **NVSwitch** | 多 GPU 全互联交换机 | GA |
| **NVLink Bridge** | 双 GPU 桥接器 | GA |
| **NVLink Network** | 机架级 NVLink 网络 | GA |

## 生产最佳实践

1. **多卡训练必用**：同一节点多 GPU 训练必须用 NVLink
2. **NVSwitch 全互联**：8 GPU 节点用 NVSwitch 实现全互联
3. **与 PCIe 对比**：NVLink 带宽是 PCIe 5.0 的 7x+
4. **拓扑感知**：训练框架感知 NVLink 拓扑，优化通信
5. **监控带宽**：监控 NVLink 带宽利用率，发现瓶颈
