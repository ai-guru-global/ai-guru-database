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
name_zh: "GPU 高速互联"
---

# NVLink

> 中文简称：GPU 高速互联

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

## 2026 NVLink 生态

| 版本 | 带宽 | 适用 GPU |
|------|------|------|
| **NVLink 4.0** | 900 GB/s | H100 |
| **NVLink 5.0** | 1800 GB/s | B200 |
| **NVSwitch** | 全互联 | DGX 系统 |

## 架构：NVLink 拓扑

```
DGX H100 (8 GPU)
    ├── GPU 0 ←NVLink→ GPU 1
    ├── GPU 0 ←NVLink→ GPU 2
    ├── ... (全互联)
    └── NVSwitch 实现任意 GPU 对通信
```

## 性能对比

| 互联技术 | 带宽 | 延迟 |
|------|------|------|
| **PCIe 5.0** | 128 GB/s | ~1μs |
| **NVLink 4.0** | 900 GB/s | ~0.5μs |
| **NVLink 5.0** | 1800 GB/s | ~0.3μs |

## 延伸阅读

- [[概念/GPU/gpu-direct|GPU Direct]] — GPU 直接访问
- [[概念/GPU/nccl|NCCL]] — 多 GPU 通信库
- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — NVIDIA GPU

> ℹ️ NVLink 是 NVIDIA 的高速 GPU 互联技术，提供比 PCIe 更高的带宽和更低的延迟。

## NVLink 配置示例

```bash
# 查看 NVLink 拓扑
nvidia-smi topo -m

# 查看 NVLink 状态
nvidia-smi nvlink -s

# 查看 NVLink 带宽
nvidia-smi nvlink -gt d
```

## NVLink vs PCIe

| 维度 | NVLink 4.0 | PCIe 5.0 |
|------|------|------|
| **带宽** | 900 GB/s | 128 GB/s |
| **延迟** | ~0.5μs | ~1μs |
| **拓扑** | 全互联 | 树形 |
| **适用** | GPU 间 | CPU-GPU |

## 生产最佳实践

1. **拓扑感知**：训练框架感知 NVLink 拓扑
2. **TP 用 NVLink**：张量并行用 NVLink 互联
3. **监控带宽**：监控 NVLink 带宽利用率
4. **与 PCIe 对比**：NVLink 带宽是 PCIe 7x+
5. **DGX 系统**：DGX 系统用 NVSwitch 全互联

## 检查清单

- [ ] NVLink 拓扑已确认
- [ ] NVLink 状态已检查
- [ ] 带宽监控已配置
- [ ] 训练框架已配置拓扑感知

## 常见问题

| 问题 | 解决方案 |
|------|------|
| NVLink 未启用 | 检查 GPU 型号和拓扑 |
| 带宽低 | 检查 NVLink 状态 |
| 拓扑不优 | 调整 GPU 布局 |
| 驱动问题 | 更新驱动 |

## 适用场景

| 场景 | 推荐度 | 说明 |
|------|------|------|
| **多 GPU 训练** | ⭐⭐⭐⭐⭐ | 高带宽互联 |
| **张量并行** | ⭐⭐⭐⭐⭐ | TP 必需 |
| **推理服务** | ⭐⭐⭐ | 可选 |
| **单 GPU** | ⭐ | 不需要 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| NVLink 未识别 | 驱动版本过低 | 升级至支持当前架构的驱动 |
| 带宽低于预期 | 链路降级 | `nvidia-smi nvlink -s` 检查链路状态 |
| 拓扑不对称 | PCIe 布局限制 | 选择 NVSwitch 全互联服务器 |
| 多节点无效 | NVLink 不跨节点 | 跨节点用 IB/RoCE，节点内用 NVLink |
| 故障检测 | 硬件链路故障 | 运行 `nvidia-smi nvlink -e` 检查错误计数 |

## 延伸阅读

- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — GPU 硬件平台
- [[概念/GPU/nccl|NCCL]] — 集合通信库，利用 NVLink 加速
- [[概念/GPU/tensor-parallelism|张量并行]] — 依赖 NVLink 的并行策略
- [[概念/GPU/gpu-direct|GPUDirect]] — GPU 直接访问网络
- [[概念/GPU/model-parallelism|模型并行]] — 并行策略总览

> ℹ️ NVLink 是节点内 GPU 互联的唯一高性能方案，2026年第五代 NVLink 提供 1.8 TB/s 双向带宽，配合 NVSwitch 实现 8 GPU 全互联，是张量并行的硬件基础。

## 2026 NVLink 生态现状

| 代际 | 带宽 | 架构 | 说明 |
|------|------|------|------|
| NVLink 5.0 | 1.8 TB/s | Blackwell | 当前最新 |
| NVLink 4.0 | 900 GB/s | Hopper | 主流部署 |
| NVLink 3.0 | 600 GB/s | Ampere | 存量集群 |
| NVSwitch 4 | 全互联 | Blackwell | 8 GPU 无阻塞 |
| NVL72 | 机架级 | Blackwell | 72 GPU 全互联 |

## 检查清单

- [ ] NVLink 版本与 GPU 架构匹配
- [ ] 链路状态已检查（无降级）
- [ ] NVSwitch 拓扑已验证
- [ ] 带宽已测试（接近理论峰值）
- [ ] 错误计数为零
- [ ] 散热方案已确认
- [ ] 固件版本已统一

> ℹ️ NVLink 带宽是张量并行效率的决定性因素，部署前必须验证实际带宽接近理论峰值。
