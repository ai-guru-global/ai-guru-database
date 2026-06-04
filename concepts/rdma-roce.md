---
title: RDMA/RoCE (高速 GPU 网络)
category: concepts
tags: [infrastructure, networking, rdma, roce, gpu-cluster]
relationships:
  - target: "concepts/heterogeneous-gpu"
    type: enables
  - target: "concepts/distributed-systems"
    type: extends
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: RDMA (Remote Direct Memory Access) 允许 GPU 间直接内存访问绕过 CPU/OS，RoCE (RDMA over Converged Ethernet) 将其承载在以太网上。AI Stack 16 卡版机间通信带宽达 1.6T，采用 RoCE + 拓扑感知路由实现低时延无拥塞通信。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: supporting
created: 2026-06-03 00:00:00+00:00
updated: 2026-06-03 00:00:00+00:00
---

# RDMA/RoCE (高速 GPU 网络)

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

- [[concepts/heterogeneous-gpu]] — 异构 GPU 集群
- [[concepts/distributed-systems]] — 分布式系统
- [[concepts/training-inference-unification]] — 训推一体
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — 阿里云 AI Stack
