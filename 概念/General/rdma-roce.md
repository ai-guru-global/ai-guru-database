---
title: RDMA/RoCE (高速 GPU 网络)
category: -concepts
tags: [infrastructure, networking, rdma, roce, gpu-cluster]
relationships:
  - target: "概念/heterogeneous-gpu"
    type: enables
  - target: "概念/distributed-systems"
    type: extends
  - target: "概念/gpu-interconnect"
    type: related_to
  - target: "部署推理/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 部署推理/Inference_Performance/Inference_Terms_for_dummy.md
summary: RDMA (Remote Direct Memory Access) 允许 GPU 间直接内存访问绕过 CPU/OS，RoCE (RDMA over Converged Ethernet) 将其承载在以太网上。AI Stack 16 卡版机间通信带宽达 1.6T，采用 RoCE + 拓扑感知路由实现低时延无拥塞通信。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-06-03 00:00:00+00:00
updated: 2026-07-21 00:00:00+00:00
aliases:
  - "Rdma Roce"
  - "rdma roce"

---
# RDMA/RoCE (高速 GPU 网络)

## 大白话

多机多卡一起跑模型时，GPU 之间要传数据。

- **RDMA**：让 GPU 直接读写远处 GPU 的内存，不用经过 CPU，像快递直达。
- **RoCE**：把 RDMA 跑在普通以太网上，比专用 InfiniBand 便宜。
- **InfiniBand（IB）**：专用高速网络，性能最好但贵。

RDMA/IB/RoCE 就是 GPU 集群里的“高速公路”。

## 核心要点

- **RDMA**：Remote Direct Memory Access，允许节点间直接内存读写，绕过 CPU 和 OS 内核，延迟降至微秒级
- **RoCE**：RDMA over Converged Ethernet，将 RDMA 承载在标准以太网上，成本低于 InfiniBand
- **AI Stack 16 卡版**：机间 1.6T 通信带宽，5× 双口 200G 以太网卡，低时延无拥塞设计
- **三种 GPU 互联层级**：卡内 NVLink（900 GB/s）→ 机内 NVSwitch（700 GB/s）→ 机间 RoCE（1.6 Tbps）

## 详细内容

### GPU 通信带宽层级

| 层级 | 技术 | 带宽 | 用途 |
|------|------|------|------|
| **卡内** | NVLink 5.0 | 1.8 TB/s (双向) | 同节点 GPU 间通信 |
| **机内** | NVSwitch | 700 GB/s | 8 GPU 全互联 |
| **机间** | InfiniBand NDR | 400 Gbps | 传统高性能集群 |
| **机间** | **RoCE v2** | **1.6 Tbps** | AI Stack 以太网方案 |
| **通用** | 100GbE/400GbE | 100-400 Gbps | 存储/管理网络 |

### RDMA vs 传统网络

```
传统 TCP/IP:
  App → Kernel → TCP Stack → NIC → Network → NIC → TCP Stack → Kernel → App
  延迟: ~10-50 μs, CPU 参与每次数据传输

RDMA:
  App → RNIC → Network → RNIC → App  (Zero-copy, Kernel bypass)
  延迟: ~1-2 μs, CPU 完全不参与
```

### RoCE vs InfiniBand

| 特性 | InfiniBand | RoCE v2 |
|------|-----------|---------|
| **成本** | 高（专用交换机） | 低（标准以太网） |
| **带宽** | 400 Gbps (NDR) | 400 Gbps per port |
| **生态** | Mellanox/NVIDIA 主导 | 多厂商支持 |
| **拥塞控制** | 原生 Credit-based | PFC + ECN + DCQCN |
| **AI Stack 选择** | — | **RoCE v2** (5× 200G) |

### AI Stack 网络架构

```
AI Stack 16 卡版网络
│
├── 计算网络（RoCE v2）
│   ├── 5× 双口 200G 以太网卡 = 2 Tbps 总带宽
│   ├── 有效通信带宽 1.6 Tbps
│   └── 拓扑感知路由，避免热点
│
├── 管理网络
│   └── 双口 25GE × 1 (BMC/IPMI 管理)
│
└── 存储网络
    └── 240G SATA SSD + 3840G NVMe SSD ×4 (本地)
```

## Related

- [[概念/heterogeneous-gpu]] — 异构 GPU 集群
- [[概念/distributed-systems]] — 分布式系统
- [[概念/training-inference-unification]] — 训推一体
- [[架构基建/AI_Stack_Deep_Dive]] — 阿里云 AI Stack

---

## 2026 RDMA/RoCE 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **RDMA** | 远程直接内存访问 | GA |
| **RoCE** | 以太网 RDMA | GA |
| **InfiniBand** | 高速互联 | GA |
| **NCCL** | NVIDIA 集合通信 | GA |
| **GPU Direct** | GPU 直接通信 | GA |

## 生产最佳实践

1. **分布式训练**：分布式训练用 RDMA/RoCE
2. **NCCL 优化**：优化 NCCL 通信性能
3. **GPU Direct**：启用 GPU Direct 减少拷贝
4. **与 InfiniBand 对比**：根据场景选择 RoCE 或 IB
5. **网络监控**：监控 RDMA 网络性能

## RoCE vs InfiniBand

| 维度 | RoCE v2 | InfiniBand |
|------|---------|------------|
| **带宽** | 100-400Gbps | 200-800Gbps |
| **延迟** | ~2μs | ~1μs |
| **成本** | 低（以太网） | 高（专用设备） |
| **生态** | 广泛 | NVIDIA 主导 |
| **适用** | 中小规模集群 | 大规模训练 |

## NCCL 环境变量配置

```bash
# NCCL RDMA 优化配置
export NCCL_IB_DISABLE=0          # 启用 IB/RoCE
export NCCL_NET_GDR_LEVEL=5       # GPU Direct RDMA
export NCCL_IB_HCA=mlx5_0,mlx5_1  # 指定 HCA 设备
export NCCL_SOCKET_IFNAME=eth0    # 网络接口
export NCCL_DEBUG=INFO            # 调试日志
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 通信慢 | 未启用 RDMA | 检查 NCCL_IB_DISABLE |
| GPU Direct 失败 | 驱动/内核不支持 | 更新驱动、加载模块 |
| 网络拥塞 | PFC 配置不当 | 配置 ECN + PFC |
| 带宽不达标 | MTU/队列配置 | 调大 MTU、多队列 |
| 训练挂起 | NCCL 超时 | 检查网络连通性 |

## 版本兼容性

| 组件 | 版本 | 说明 |
|------|------|------|
| NCCL | 2.20+ | 集合通信 |
| MLNX OFED | 24.x | RDMA 驱动 |
| CUDA | 12.x | GPU 环境 |
| Linux Kernel | 5.15+ | 内核支持 |

## 生产检查清单

1. 确认 RDMA 网卡和驱动正常
2. 启用 GPU Direct RDMA
3. 配置 PFC/ECN 防止网络拥塞
4. 监控 RDMA 带宽和延迟
5. 测试 NCCL allreduce 性能
6. 配置网络冗余防止单点故障

## 版本兼容性

| 组件 | 版本 | 带宽 | 备注 |
|------|------|------|------|
| **ConnectX-7** | MLNX 28.4+ | 400Gbps | NDR InfiniBand |
| **ConnectX-6** | MLNX 23+ | 200Gbps | HDR |
| **NCCL** | ≥ 2.20 | - | GPU 集合通信 |
| **UCX** | ≥ 1.16 | - | 统一通信框架 |
| **BlueField-3** | 2025+ | 400Gbps | DPU 卸载 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 带宽未达标 | MTU 配置错误 | 设置 MTU 9000 + PFC |
| 延迟抨动 | 网络拥塞 | 启用 ECN + 调整 QoS |
| NCCL 超时 | 网络分区 | 检查交换机 + 冗余链路 |
| GPU 利用率低 | 通信成为瓶颈 | 增大 micro-batch + 通信重叠 |

## 总结

RDMA/RoCE 是 AI 分布式训练的网络基石，提供低延迟、高带宽的 GPU 间通信。对于多节点训练，RDMA 网络性能直接决定训练效率。

> 💡 RDMA 的核心价值：让 GPU 间通信像本地内存访问一样快——绕过 CPU 和内核协议栈，是大规模训练的必备网络。

