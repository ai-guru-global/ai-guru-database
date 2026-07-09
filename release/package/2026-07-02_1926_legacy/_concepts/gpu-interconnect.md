---
title: "NVLink 与 GPU 互联技术"
category: -concepts
tags: ["nvlink", "gpu-interconnect", "pcie", "hccs", "nvswitch", "infiniband"]
relationships:
  - target: "_concepts/ai-hardware"
    type: belongs_to
  - target: "_concepts/distributed-parallelism"
    type: enables
  - target: "_concepts/rdma-roce"
    type: related_to
  - target: "_concepts/heterogeneous-gpu"
    type: related_to
  - target: "部署推理/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 部署推理/Inference_Performance/Inference_Terms_for_dummy.md
summary: "GPU 互联是分布式训练/推理的通信瓶颈。NVLink 5.0 达 1.8 TB/s 双向带宽，是 PCIe 5.0 的 14 倍。AI Stack APG 卡间互联达 700 GB/s，机间 1.6T。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
aliases:
  - "Gpu Interconnect"
  - "gpu interconnect"

---
# NVLink 与 GPU 互联技术 (GPU Interconnect)

> GPU 的算力再强，如果彼此之间无法高效通信，整体性能就上不去。

---

## 大白话

多 GPU 一起工作时，它们之间要传数据。

- **NVLink**：像 GPU 之间的“专用高速通道”，在一块主板或相邻卡之间很快。
- **InfiniBand（IB）**：像机房里的“高速公路”，连接不同服务器上的 GPU。
- **普通以太网**：像乡间小路，慢且不稳定。

通信慢了，GPU 会空等，多卡反而更慢。

---

## 1. 互联层级

GPU 集群通信分为三个层级，带宽逐级递减：

```
GPU 互联层级（从高到低）:

├── 卡内 (Intra-GPU)
│   └── HBM 带宽：3.35 TB/s (H100) — 最快
│
├── 机内 (Intra-Node)
│   ├── NVLink：900 GB/s (NVLink 5.0, H100 双向)
│   ├── NVSwitch：全互联交换
│   ├── HCCS：华为昇腾卡间互联
│   └── PCIe 5.0：128 GB/s (双向) — 最慢的机内互联
│
├── 机间 (Inter-Node)
│   ├── InfiniBand NDR：400 Gb/s (50 GB/s)
│   ├── RoCE v2：200-400 Gb/s
│   └── 以太网：25-100 Gb/s
```

---

## 2. 主要互联技术对比

| 技术 | 厂商 | 带宽（双向） | 延迟 | 拓扑 | 适用 |
|------|------|-------------|------|------|------|
| **NVLink 5.0** | NVIDIA | 1.8 TB/s | ~1μs | 点对点 | H200/B200 机内 |
| **NVLink 4.0** | NVIDIA | 900 GB/s | ~1.5μs | 点对点 | H100 机内 |
| **NVSwitch** | NVIDIA | 900 GB/s (全互联) | ~1μs | 全互联 | 8-GPU 全互联 |
| **HCCS** | 华为 | 392 GB/s | ~2μs | 点对点 | Ascend 机内 |
| **PCIe 5.0** | 通用 | 128 GB/s | ~5μs | 树形 | CPU-GPU 通信 |
| **InfiniBand NDR** | NVIDIA | 50 GB/s (400G) | ~1μs | 网络 | 机间通信 |
| **RoCE v2** | 通用 | 25-50 GB/s | ~3μs | 网络 | 机间通信 |

---

## 3. NVLink 演进

| 版本 | 年份 | 单链路带宽 | 最大链路数 | 总带宽 | 代表 GPU |
|------|------|-----------|-----------|--------|---------|
| **NVLink 1.0** | 2016 | 40 GB/s | 6 | 240 GB/s | Tesla P100 |
| **NVLink 2.0** | 2017 | 50 GB/s | 6 | 300 GB/s | Tesla V100 |
| **NVLink 3.0** | 2020 | 50 GB/s | 12 | 600 GB/s | A100 |
| **NVLink 4.0** | 2022 | 56.25 GB/s | 16 | 900 GB/s | H100 |
| **NVLink 5.0** | 2024 | 100 GB/s | 18 | 1.8 TB/s | B200/GB200 |

### NVLink vs PCIe

| 维度 | NVLink 4.0 | PCIe 5.0 x16 | 倍数 |
|------|-----------|-------------|------|
| **带宽** | 900 GB/s | 128 GB/s | 7× |
| **延迟** | ~1.5 μs | ~5 μs | 3× |
| **CPU 依赖** | 无（GPU 直连） | 有（经 CPU 桥接） | — |
| **适用** | 模型并行（TP/PP） | 数据传输、推理 | — |

---

## 4. AI Stack APG 互联架构

| 互联层级 | 技术 | 带宽 | 说明 |
|----------|------|------|------|
| **卡间（16 卡）** | 高速直连 | 700 GB/s | 类 NVLink 互联 |
| **机间** | 200G 以太网 ×5 | 1.6 TB | 低时延无拥塞 |
| **管理网** | 25GE ×1 | 25 Gb/s | BMC/IPMI 管理 |

### 对分布式推理的影响

| 并行策略 | 互联需求 | AI Stack 支持 |
|----------|----------|-------------|
| **张量并行 (TP)** | 极高（每层 AllReduce） | 卡间 700 GB/s ✅ |
| **流水线并行 (PP)** | 高（层间传输激活） | 卡间 700 GB/s ✅ |
| **数据并行 (DP)** | 中（梯度同步） | 机间 1.6 TB ✅ |
| **序列并行 (SP)** | 高（序列维度切分） | 卡间 700 GB/s ✅ |

---

## 5. NVSwitch 与全互联

```
8-GPU NVSwitch 全互联拓扑:

GPU0 ←→ NVSwitch ←→ GPU1
 ↕          ↕          ↕
GPU2 ←→ NVSwitch ←→ GPU3
 ↕          ↕          ↕
GPU4 ←→ NVSwitch ←→ GPU5
 ↕          ↕          ↕
GPU6 ←→ NVSwitch ←→ GPU7

任意两 GPU 间可直连通信，无需经过 CPU 或其他 GPU 中转
带宽: 每对 GPU 间 900 GB/s (NVLink 4.0)
```

NVSwitch 优势：
- **全互联**：任意两 GPU 带宽相同
- **集合通信**：硬件级 AllReduce/AllGather 加速
- **NVLink SHARP**：在交换机中直接做归约运算

---

## 6. 国产互联技术

| 厂商 | 互联技术 | 带宽 | 对标 |
|------|----------|------|------|
| **华为昇腾** | HCCS | 392 GB/s | NVLink 3.0 |
| **海光** | 自研互联 | ~200 GB/s | NVLink 2.0 |
| **寒武纪** | MLU-Link | ~200 GB/s | NVLink 2.0 |

**异构互联挑战**：不同厂商 GPU 间的互联协议不兼容，需要通过标准网络（RDMA/RoCE）进行通信。

---

## 7. 工程最佳实践

| 关注点 | 建议 |
|--------|------|
| **TP 放置** | 张量并行必须在同一 NVLink 域内（机内） |
| **PP 放置** | 流水线并行可跨节点（对带宽要求低于 TP） |
| **DP 放置** | 数据并行适合跨节点（梯度同步频率低） |
| **网络选型** | 机间优先 InfiniBand，次选 RoCE v2 |
| **拓扑感知** | 调度器应感知物理拓扑，优先将通信密集的并行策略放在同节点 |

---

## 8. 局限与开放问题

1. **NVLink 不可跨节点**：NVLink 仅限机内，机间必须走网络
2. **国产化差距**：国产 GPU 互联带宽约为 NVIDIA 的 1/2-1/3
3. **异构混合**：混合 NVIDIA + 国产 GPU 时，互联协议不兼容
4. **散热限制**：NVLink 5.0 的高带宽带来更高功耗和散热需求
5. **未来趋势**：CXL 和 UCIe 可能成为下一代统一互联标准

---

## Related

- [[_concepts/ai-hardware]] — AI 硬件（GPU 计算能力）
- [[_concepts/distributed-parallelism]] — 分布式并行策略（互联是基础）
- [[_concepts/rdma-roce]] — RDMA/RoCE（机间网络通信）
- [[_concepts/heterogeneous-gpu]] — 异构 GPU（国产互联挑战）
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack（APG 互联架构）
