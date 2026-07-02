---
title: "NVIDIA & AMD 数据中心 GPU 深度解析 2026"
category: "01-fundamentals-ai-hardware"
tags: ["gpu", "nvidia", "amd", "h200", "b200", "mi300x", "mi350", "blackwell", "hopper", "inference", "training"]
summary: "NVIDIA H200/B200/GB200 和 AMD MI300X/MI350 的完整技术规格、架构对比、云厂商定价和大规模部署案例。"
sources:
  - "https://www.nvidia.com/en-us/data-center/"
  - "https://www.amd.com/en/products/accelerators/instinct.html"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Nvidia Amd Gpu Deep Dive"
  - "NVIDIA AMD GPU Deep Dive"
  - NVIDIA_AMD_GPU_Deep_Dive

---
# NVIDIA & AMD 数据中心 GPU 深度解析 2026

> **一句话理解**: NVIDIA H200/B200 主导训练和推理市场，AMD MI300X/MI350 以显存优势切入超大模型推理和性价比训练场景。

---

## 目录

1. [NVIDIA Hopper 架构 (H100/H200)](#1-nvidia-hopper-架构)
2. [NVIDIA Blackwell 架构 (B200/GB200)](#2-nvidia-blackwell-架构)
3. [AMD CDNA 架构 (MI300X/MI350)](#3-amd-cdna-架构)
4. [全产品线横向对比](#4-全产品线横向对比)
5. [云厂商定价与可用性](#5-云厂商定价与可用性)
6. [大规模部署案例](#6-大规模部署案例)
7. [选型决策指南](#7-选型决策指南)

---

## 1. NVIDIA Hopper 架构

### 1.1 H100 SXM (2022 年发布, 2023 年量产)

**定位**: Hopper 一代旗舰, 训练+推理全能

| 参数 | 规格 |
|------|------|
| **架构** | Hopper (GH100) |
| **制程** | TSMC 4N |
| **晶体管** | 800 亿 |
| **CUDA Cores** | 16,896 |
| **Tensor Cores** | 528 (第四代) |
| **显存** | 80GB HBM3 |
| **显存带宽** | 3.35 TB/s |
| **FP16 算力** | 989 TFLOPS |
| **FP8 算力** | 1,979 TFLOPS |
| **INT8 算力** | 3,958 TOPS |
| **NVLink** | 900 GB/s (NVLink 4) |
| **PCIe** | PCIe 5.0 x16 |
| **TDP** | 700W |
| **互联** | NVSwitch, 8 卡直连 |
| **价格** | ~$33,000 |

**核心特性:**
- **Transformer Engine**: 自动 FP8/FP16 混合精度, Transformer 训练加速 2-3x
- **MIG (Multi-Instance GPU)**: 最多 7 个独立实例
- **NVLink 4**: 900GB/s 双向, 8 卡 NVSwitch 全互联
- **HBM3**: 首款采用 HBM3 的 GPU

### 1.2 H200 SXM (2024 年发布)

**定位**: Hopper 二代, 推理优化旗舰

| 参数 | H100 SXM | H200 SXM | 提升 |
|------|----------|----------|------|
| **架构** | Hopper | Hopper | - |
| **制程** | TSMC 4N | TSMC 4N | - |
| **CUDA Cores** | 16,896 | 16,896 | - |
| **Tensor Cores** | 528 | 528 | - |
| **显存** | 80GB HBM3 | **141GB HBM3e** | **+76%** |
| **显存带宽** | 3.35 TB/s | **4.8 TB/s** | **+43%** |
| **FP8 算力** | 1,979 TFLOPS | 1,979 TFLOPS | - |
| **NVLink** | 900 GB/s | 900 GB/s | - |
| **TDP** | 700W | 700W | - |
| **价格** | ~$33,000 | ~$40,000 | +21% |

**H200 关键洞察:**
```
H200 不是更快的 H100, 而是"内存更大"的 H100

适用场景:
├── 70B 模型推理: H100 需 2 卡, H200 1 卡即可 → 实际成本更低
├── 长上下文 (>100K tokens): KV Cache 占用大, H200 多容纳 ~2x
├── MoE 模型: 专家权重占用大显存, H200 优势明显
└── 批量推理: 更大显存 = 更大 batch = 更高吞吐
```

### 1.3 H200 NVL (NVL 版本, 2024 年)

**定位**: 双卡 NVLink 直连, 推理优化

| 参数 | 规格 |
|------|------|
| **显存** | 2x 141GB = 282GB (统一编址) |
| **互联** | NVLink 4, 900GB/s |
| **适用** | 超大模型推理 (175B+) |

---

## 2. NVIDIA Blackwell 架构 (2025 年, 最新旗舰)

### 2.1 Blackwell 架构概述

Blackwell 是 NVIDIA 第六代数据中心 GPU 架构, 以数学家 David Blackwell 命名。相比 Hopper, Blackwell 在算力、显存、互联、推理能力上实现全面代际升级。

**Blackwell vs Hopper 核心提升:**

| 维度 | Hopper (H100) | Blackwell (B200) | 提升 |
|------|--------------|-----------------|------|
| **制程** | TSMC 4N | TSMC 4NP | - |
| **晶体管** | 800 亿 | 2,080 亿 | +160% |
| **CUDA Cores** | 16,896 | 18,432 | +9% |
| **Tensor Cores** | 528 (第四代) | 576 (第五代) | +9% |
| **显存** | 80GB HBM3 | 192GB HBM3e | +140% |
| **显存带宽** | 3.35 TB/s | 8 TB/s | +139% |
| **FP8 算力** | 1,979 TF | 2,250 TF | +14% |
| **FP4 算力** | 不支持 | 4,500 TF | 新增 |
| **NVLink** | 900 GB/s (v4) | 1,800 GB/s (v5) | +100% |
| **TDP** | 700W | 1,000W | +43% |

### 2.2 B200 SXM (2025 年发布)

**定位**: Blackwell 一代旗舰, 训练+推理全面升级

| 参数 | 规格 |
|------|------|
| **架构** | Blackwell (GB202) |
| **制程** | TSMC 4NP |
| **晶体管** | 2,080 亿 |
| **CUDA Cores** | 18,432 |
| **Tensor Cores** | 576 (第五代) |
| **显存** | 192GB HBM3e (6 个 HBM3e Stack) |
| **显存带宽** | 8 TB/s |
| **FP4 算力** | 4,500 TFLOPS (4.5 PFLOPS) |
| **FP8 算力** | 2,250 TFLOPS (2.25 PFLOPS) |
| **FP16 算力** | 1,125 TFLOPS |
| **BF16 算力** | 1,125 TFLOPS |
| **INT8 算力** | 4,500 TOPS |
| **INT4 算力** | 9,000 TOPS |
| **NVLink** | 1,800 GB/s (NVLink 5) |
| **PCIe** | PCIe 6.0 x16 |
| **TDP** | 1,000W |
| **价格** | ~$60,000-70,000 |
| **发布** | 2025 年 Q2 |

**Blackwell 架构突破:**
```
Blackwell vs Hopper 代际提升:
├── 第二代 Transformer Engine
│   ├── FP4/FP6 支持 (更高吞吐)
│   └── 推理吞吐: 比 H100 高 15x (特定负载)
├── NVLink 5 (1.8 TB/s)
│   └── 比 NVLink 4 快 2x, 18 个 NVLink 端口
├── 192GB HBM3e
│   └── 6 个 HBM3e Stack, 比 H200 多 36%
├── 双 Die 封装
│   └── B200 = 2 个 GPU Die 封装在一起 (类似 AMD Chiplet)
├── 专用解压缩引擎
│   └── 加速 RAG 等检索任务 (硬件级 LZ4/Zstd)
├── RAS (可靠性/可用性/可服务性) 引擎
│   └── AI 预测性维护, 故障自愈
├── 保密计算
│   └── TEE (可信执行环境), 保护训练数据隐私
└── Secure AI
    └── 硬件级 AI 安全特性
```

**B200 双 Die 架构:**
```
B200 GPU 架构 (双 Die 封装):

┌──────────────────────────────────────────┐
│              B200 SXM                    │
│  ┌────────────────┐ ┌────────────────┐  │
│  │    Die 0        │ │    Die 1        │  │
│  │ ┌────────────┐  │ │ ┌────────────┐  │  │
│  │ │9,216 CUDA  │  │ ││9,216 CUDA  │  │  │
│  │ │288 Tensor  │  │ ││288 Tensor  │  │  │
│  │ └────────────┘  │ │ └────────────┘  │  │
│  │ ┌────────────┐  │ │ ┌────────────┐  │  │
│  │ │ 96GB HBM3e │  │ ││ 96GB HBM3e │  │  │
│  │ │ 4 TB/s     │  │ ││ 4 TB/s     │  │  │
│  │ └────────────┘  │ │ └────────────┘  │  │
│  └────────┬───────┘ └───────┬────────┘  │
│           └──── Die-to-Die ──┘           │
│           (高速片间互联)                   │
│  ┌─────────────────────────────────────┐ │
│  │ NVLink 5: 1,800 GB/s (18 端口)      │ │
│  │ PCIe 6.0 x16                        │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### 2.3 B100 (2024 年发布, 过渡产品)

**定位**: Blackwell 架构先行者, 平衡性能与功耗

| 参数 | B100 | B200 | 差异 |
|------|------|------|------|
| **显存** | 192GB HBM3e | 192GB HBM3e | 相同 |
| **显存带宽** | 8 TB/s | 8 TB/s | 相同 |
| **FP8 算力** | 1,800 TF | 2,250 TF | B200 +25% |
| **FP4 算力** | 3,500 TF | 4,500 TF | B200 +29% |
| **NVLink** | 1,800 GB/s | 1,800 GB/s | 相同 |
| **TDP** | 700W | 1,000W | B200 +43% |
| **定位** | 过渡/云厂商 | 旗舰训练 | - |

### 2.4 GB200 SuperChip (2025 年发布)

**定位**: Grace CPU + Blackwell GPU 超级芯片, CPU-GPU 统一架构

| 参数 | 规格 |
|------|------|
| **组成** | 1x Grace CPU + 2x B200 GPU |
| **GPU 显存** | 2x 192GB = 384GB HBM3e |
| **GPU 带宽** | 2x 8 TB/s = 16 TB/s |
| **CPU 内存** | 480GB LPDDR5x (960 GB/s) |
| **总内存** | 864GB |
| **GPU FP8 算力** | 2x 2,250 TF = 4,500 TFLOPS |
| **GPU FP4 算力** | 2x 4,500 TF = 9,000 TFLOPS |
| **NVLink** | 1,800 GB/s (GPU 间) |
| **NVLink-C2C** | 900 GB/s (CPU-GPU, 统一内存) |
| **TDP** | 2,700W (整体) |

**GB200 关键优势:**
- **统一内存编址**: CPU-GPU 通过 NVLink-C2C 实现统一内存, 减少数据搬运
- **384GB GPU 显存**: 可单 SuperChip 运行 405B 模型 (FP8)
- **Grace CPU**: 72 个 Arm Neoverse V2 核心, 480GB LPDDR5x
- **数据预处理**: CPU 处理数据加载/预处理, GPU 专注计算

### 2.5 GB200 NVL72 (机柜级方案, 2025 年)

**定位**: 72 卡机柜级 AI 超算, 万亿参数模型训练

| 参数 | 规格 |
|------|------|
| **GPU 数量** | 72x B200 |
| **CPU 数量** | 36x Grace |
| **总 GPU 显存** | 72x 192GB = 13.8TB HBM3e |
| **总 CPU 内存** | 36x 480GB = 17.3TB LPDDR5x |
| **总内存** | 31.1TB |
| **FP8 算力** | 144 PFLOPS (162 PFLOPS peak) |
| **FP4 算力** | 324 PFLOPS |
| **NVLink 5** | 1,800 GB/s 全互联 (NVSwitch) |
| **网络** | 8x 400Gb/s InfiniBand NDR |
| **外部带宽** | 3.2 Tbps |
| **形态** | 单机柜液冷 |
| **功率** | ~120kW |
| **适用** | 万亿参数模型训练 |

**NVL72 架构:**
```
GB200 NVL72 机柜架构:

┌─────────────────────────────────────────┐
│            NVL72 机柜 (液冷)             │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  NVLink Switch Fabric            │   │
│  │  (72 卡全互联, 1,800 GB/s/卡)    │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │Tray │ │Tray │ │Tray │ │Tray │ ...   │
│  │  2x │ │  2x │ │  2x │ │  2x │       │
│  │GB200│ │GB200│ │GB200│ │GB200│       │
│  └─────┘ └─────┘ └─────┘ └─────┘       │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  InfiniBand NDR 400Gb/s x8       │   │
│  │  (3.2 Tbps 外部网络)              │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘

单机柜: 72 GPU + 36 CPU = 144 PFLOPS FP8
```

### 2.6 Blackwell Ultra (B300/GB300, 2025 年下半年)

**定位**: Blackwell 架构增强版, 推理性能大幅提升

Blackwell Ultra 是 Blackwell 的增强版本, Tensor Core 超频, 推理能力显著提升。

**Blackwell Ultra 核心提升:**
```
Blackwell Ultra vs Blackwell:
├── Tensor Core 加速: 2x 注意力层加速
├── AI 算力: 1.5x FP4 算力提升
├── NVFP4: 新增 4-bit 浮点精度
├── 推理吞吐: 比 Blackwell 高 50x (Agentic AI 场景)
└── 成本: 比 Blackwell 降低 35x (每百万 token)
```

| 参数 | B200 | B300 | 提升 |
|------|------|------|------|
| **显存** | 192GB HBM3e | 288GB HBM3e | +50% |
| **FP4 算力** | 4,500 TF | 6,750+ TF | +50% |
| **FP8 算力** | 2,250 TF | 3,375+ TF | +50% |
| **NVLink** | 1,800 GB/s (v5) | 1,800 GB/s (v5) | - |
| **TDP** | 1,000W | 1,200W | +20% |

**GB300 NVL72 官方规格 (已量产):**

| 参数 | GB200 NVL72 | GB300 NVL72 | 提升 |
|------|-------------|-------------|------|
| **GPU** | 72x Blackwell | 72x Blackwell Ultra | - |
| **CPU** | 36x Grace | 36x Grace | - |
| **CPU 核心** | 2,592 Arm V2 | 2,592 Arm V2 | - |
| **GPU 显存** | 13.8TB HBM3e | 20TB HBM3e | +45% |
| **GPU 带宽** | — | 576 TB/s | - |
| **CPU 内存** | 17TB LPDDR5X | 17TB LPDDR5X | - |
| **CPU 带宽** | — | 14 TB/s | - |
| **总快速内存** | — | 37 TB | - |
| **NVLink 带宽** | 130 TB/s | 130 TB/s | - |
| **FP4 (Sparsity)** | 324 PFLOPS | **1,440 PFLOPS** | **4.4x** |
| **FP4 (Dense)** | — | **1,080 PFLOPS** | - |
| **FP8/FP6** | 144 PFLOPS | **720 PFLOPS** | **5x** |
| **INT8** | — | 24 POPS | - |
| **FP16/BF16** | — | **360 PFLOPS** | - |
| **TF32** | — | **180 PFLOPS** | - |
| **FP32** | — | 6 PFLOPS | - |
| **FP64** | — | 100 TFLOPS | - |
| **网络** | ConnectX-7 400Gb/s | ConnectX-8 800Gb/s | 2x |
| **散热** | 液冷 | 液冷 | - |

**GB300 NVL72 vs Hopper 性能提升:**
```
GB300 NVL72 vs H100:
├── AI 工厂输出: 50x (整体)
├── 用户响应: 10x (TPS/user)
├── 吞吐效率: 5x (TPS/MW)
├── 实时视频生成: 30x (Cosmos 模型)
├── FP4 算力: 1,440 PFLOPS vs 0 (Hopper 不支持 FP4)
└── 显存: 20TB vs 640GB (31x)
```

**GB300 NVL72 核心特性:**
- **Blackwell Ultra GPU**: 1.5x FP4 算力 + 2x 注意力层加速 (vs Blackwell)
- **ConnectX-8 SuperNIC**: 800Gb/s 每 GPU 网络 (vs ConnectX-7 的 400Gb/s)
- **NVLink 5**: 130 TB/s 全互联带宽
- **Grace CPU**: 2,592 Arm Neoverse V2 核心, 17TB LPDDR5X
- **NVIDIA Mission Control**: 全栈 AI 工厂管理
- **NVIDIA Dynamo**: 推理优化框架
- **TensorRT-LLM**: 推理加速

**GB300 NVL72 部署案例:**
| 客户 | 场景 | 状态 |
|------|------|------|
| **Microsoft Azure** | Agentic AI 推理 | 2025 H2 |
| **CoreWeave** | 云推理服务 | 2025 H2 |
| **Oracle OCI** | OCI AI 集群 | 2025 H2 |

**DGX Station (桌面超级计算机):**
- GB300 Grace Blackwell Ultra 桌面形态
- 支持大规模训练和推理的本地部署

---

### 2.7 Vera Rubin (2026 年, 下一代旗舰)

**定位**: Blackwell 下一代, Agentic AI 超级计算机

Vera Rubin 是 NVIDIA 第七代数据中心 GPU 架构, 以天文学家 Vera Rubin 命名。这是 NVIDIA 2026 年发布的最新旗舰平台。

**Vera Rubin 平台七大芯片:**
```
Vera Rubin NVL72 平台组成:
├── Rubin GPU (下一代 GPU)
├── Vera CPU (下一代 CPU, Arm Olympus 核心)
├── NVLink 6 Switch (3.6 TB/s/卡)
├── ConnectX-9 SuperNIC (1.6 Tb/s/卡)
├── BlueField-4 DPU
├── Spectrum-X Ethernet CPO (共封装光学)
└── Groq 3 LPU (推理加速器, 256 LPU/机柜)
```

**Rubin GPU 核心规格:**

| 参数 | B200 | B300 | **Rubin GPU** |
|------|------|------|--------------|
| **显存** | 192GB HBM3e | 288GB HBM3e | **288GB HBM4** |
| **显存带宽** | 8 TB/s | ~12 TB/s | **22 TB/s** |
| **NVFP4 推理** | 4,500 TF | 6,750+ TF | **50 PFLOPS** |
| **FP8 训练** | 2,250 TF | 3,375+ TF | **17.5 PFLOPS** |
| **FP16/BF16** | 1,125 TF | ~1,700 TF | **4 PFLOPS** |
| **FP64** | ~40 TF | ~60 TF | **33 TFLOPS** |
| **NVLink** | 1,800 GB/s (v5) | 1,800 GB/s (v5) | **3,600 GB/s (v6)** |

**Vera Rubin NVL72 (机柜级):**

| 参数 | GB200 NVL72 | GB300 NVL72 | **Vera Rubin NVL72** |
|------|-------------|-------------|---------------------|
| **GPU** | 72x B200 | 72x B300 | **72x Rubin** |
| **CPU** | 36x Grace | 36x Grace | **36x Vera** |
| **总 GPU 显存** | 13.8TB | 20.7TB | **20.7TB HBM4** |
| **总 CPU 内存** | 17.3TB | 17.3TB | **54TB LPDDR5X** |
| **NVFP4 推理** | 324 PFLOPS | 486 PFLOPS | **3,600 PFLOPS** |
| **FP8 训练** | 144 PFLOPS | 216 PFLOPS | **1,260 PFLOPS** |
| **NVLink 带宽** | 130 TB/s | 130 TB/s | **260 TB/s** |
| **网络带宽** | 3.2 TB/s | 3.2 TB/s | **28.8 TB/s** |
| **CPU 核心** | 2,592 Arm | 2,592 Arm | **3,168 Olympus** |
| **HBM4 芯片数** | — | — | **1,296** |

**Vera Rubin vs GB200 NVL72 性能提升:**
```
Vera Rubin NVL72 核心优势:
├── 推理成本: 1/10 (每百万 token)
├── 训练效率: 1/4 GPU 数量 (同等模型)
├── 推理吞吐: 10x tokens/MW (同等功耗)
├── 万亿参数模型: 35x 吞吐/MW (配合 Groq 3 LPX)
└── NVLink 6: 3.6 TB/s/卡 (vs NVLink 5 的 1.8 TB/s)
```

**Vera CPU:**
- 自研 Arm Olympus 核心
- 88 核心/芯片
- 1.5TB LPDDR5X/芯片
- 专为数据移动和 Agentic 推理设计

**Groq 3 LPU (推理加速器):**
- 256 LPU/机柜
- 128GB SRAM
- 40 PB/s 内存带宽
- 640 TB/s scale-up 带宽/机柜
- 与 Vera Rubin NVL72 协同设计
- 35x 推理性能/瓦特 (vs Blackwell)

**Vera Rubin 部署状态:**
- 2026 年已进入量产
- 台湾顶级服务器制造商批量生产
- 云厂商、超算中心已开始部署

### 2.8 NVLink 演进

| 版本 | 带宽/卡 | 最大 GPU 数 | 对应架构 |
|------|---------|-----------|---------|
| NVLink 3 | 600 GB/s | 8 | A100 |
| NVLink 4 | 900 GB/s | 8 | H100/H200 |
| NVLink 5 | 1,800 GB/s | 72 (NVL72) | B200/B300 |
| **NVLink 6** | **3,600 GB/s** | **72 (NVL72)** | **Rubin** |

### 2.9 NVIDIA 完整产品线 (2024-2026)

| 产品 | 架构 | 显存 | FP8 算力 | NVLink | 发布 | 状态 |
|------|------|------|----------|--------|------|------|
| H100 SXM | Hopper | 80GB HBM3 | 1,979 TF | 900 GB/s (v4) | 2023 | 量产 |
| H200 SXM | Hopper | 141GB HBM3e | 1,979 TF | 900 GB/s (v4) | 2024 | 量产 |
| B100 | Blackwell | 192GB HBM3e | 1,800 TF | 1,800 GB/s (v5) | 2024 | 量产 |
| B200 SXM | Blackwell | 192GB HBM3e | 2,250 TF | 1,800 GB/s (v5) | 2025 | 量产 |
| B300 | Blackwell Ultra | 288GB HBM3e | 3,375+ TF | 1,800 GB/s (v5) | 2025 H2 | 量产 |
| GB200 | Blackwell+Grace | 384GB HBM3e | 4,500 TF | 1,800 GB/s (v5) | 2025 | 量产 |
| GB300 NVL72 | Blackwell Ultra | 20TB HBM3e | **720 PFLOPS (FP8)** / **1,440 PFLOPS (FP4)** | 130 TB/s NVLink | 2025 H2 | 量产 |
| **Rubin GPU** | **Vera Rubin** | **288GB HBM4** | **17.5 PFLOPS** | **3,600 GB/s (v6)** | **2026** | **量产** |
| **Vera Rubin NVL72** | **Vera Rubin** | **20.7TB HBM4** | **1,260 PFLOPS** | **3,600 GB/s (v6)** | **2026** | **量产** |

### 2.10 DGX B200 / DGX GB200 系统

| 系统 | GPU | 显存 | FP8 算力 | 互联 | 形态 |
|------|-----|------|----------|------|------|
| **DGX B200** | 8x B200 | 1.5TB | 18 PFLOPS | NVLink 5 | 8U 风冷 |
| **DGX GB200** | 72x B200 | 13.8TB | 144 PFLOPS | NVLink 5 | 机柜液冷 |
| **HGX B200** | 8x B200 | 1.5TB | 18 PFLOPS | NVLink 5 | OAM 基板 |
| **MGX GB200** | 36x GB200 | 12.6TB | 72 PFLOPS | NVLink 5 | 模块化 |

### 2.7 Blackwell 训练集群部署案例

| 客户 | 规模 | 系统 | 模型 | 状态 |
|------|------|------|------|------|
| **xAI (Elon Musk)** | 100,000x B200 | DGX B200 | Grok 4 | 2025 年建设 |
| **Meta** | 600,000+ GPU | DGX B200 + NVL72 | Llama 4 | 2025 年扩建 |
| **Microsoft Azure** | 数万卡 NVL72 | GB200 NVL72 | GPT-5 | 2025 年部署 |
| **Oracle OCI** | 数万卡 B200 | DGX B200 | OCI AI 集群 | 2025 年 Q2 |
| **CoreWeave** | 数万卡 B200 | DGX B200 | 云 GPU | 2025 年 Q2 |
| **Lambda** | 数千卡 B200 | DGX B200 | Lambda Cloud | 2025 年 |
| **xAI Memphis** | 100,000x H100 | DGX H100 | Grok 3 | 2024 年完成 |
| **Tesla** | 50,000x H100 | DGX H100 | FSD/Optimus | 2024 年完成 |
| **字节跳动** | 数万卡 H800/B200 | HGX | 豆包 | 持续扩建 |
| **阿里云** | 数万卡 H800 | HGX | 通义千问 | 持续扩建 |

### 2.8 xAI Memphis 超级集群详解 (2024 年, 已建成)

```
xAI Memphis 集群 (全球最大 AI 训练集群之一):
├── GPU: 100,000x H100 SXM
├── 算力: ~200 EFLOPS (FP8)
├── 显存: 8PB HBM3
├── 网络: InfiniBand NDR 400Gb/s
├── 存储: 数十 PB 高速存储
├── 电力: ~70MW (约一个小型发电厂)
├── 造价: ~$3-4B (约 250-300 亿人民币)
├── 建设周期: 约 4 个月 (从零到满载)
├── 用途: Grok 3 训练
└── 地点: 美国田纳西州孟菲斯市
```

### 2.9 Meta RSC 超级集群详解 (2024 年, 已建成)

```
Meta RSC (Research SuperCluster):
├── Phase 1 (2022): 16,000x A100
├── Phase 2 (2024): 600,000+ H100
├── 算力: ~1.2 ZFLOPS (FP8)
├── 显存: 48PB HBM3
├── 网络: InfiniBand + RoCE 混合
├── 存储: 100+ PB
├── 造价: ~$20B+ (约 1500 亿人民币)
├── 用途: Llama 3.1 405B 训练
└── 地点: 美国多个数据中心
```

### 2.10 Blackwell vs Hopper 选型指南

| 场景 | 推荐 | 原因 |
|------|------|------|
| **当前生产推理** | H200 | 成熟、供应稳定、软件优化完善 |
| **下一代训练** | B200 | 算力密度更高、支持更大模型 |
| **万亿参数训练** | GB200 NVL72 | 13.8TB 统一显存、144 PFLOPS |
| **预算有限** | H100 | 性价比最高、二手市场活跃 |
| **FP4 推理** | B200 | 原生 FP4 支持, 吞吐 4.5 PFLOPS |
| **RAG 加速** | B200 | 专用解压缩引擎 |
| **机柜级部署** | GB200 NVL72 | 液冷、高密度、全互联 |

### 2.11 Blackwell 云厂商定价 (2025 年)

| 平台 | 实例类型 | GPU | 价格/小时 | 可用性 |
|------|---------|-----|-----------|--------|
| **AWS** | p6 (预期) | 8x B200 | $20+ | 预览 |
| **Azure** | ND GB200 v6 | 72x NVL72 | 企业定制 | 预览 |
| **GCP** | a3-ultragpu-b200 | 8x B200 | $15+ | 预览 |
| **CoreWeave** | DGX B200 | 8x B200 | ~$18 | 预览 |
| **Lambda** | DGX B200 | 8x B200 | ~$15 | 预览 |
| **Oracle OCI** | DGX B200 | 8x B200 | ~$16 | 预览 |

---

## 3. AMD CDNA 架构

### 3.1 MI300X (2023 年发布, 2024 年量产)

**定位**: 显存容量之王, 超大模型推理

| 参数 | 规格 |
|------|------|
| **架构** | CDNA 3 |
| **制程** | TSMC 5nm + 6nm (Chiplet) |
| **Chiplet** | 8 个 XCD + 4 个 IOD |
| **计算单元** | 304 个 CU |
| **Stream Cores** | 19,456 |
| **Matrix Cores** | 1,216 |
| **显存** | 192GB HBM3 |
| **显存带宽** | 5.3 TB/s |
| **FP16 算力** | 1,307 TFLOPS |
| **BF16 算力** | 1,307 TFLOPS |
| **FP8 算力** | 2,614 TFLOPS |
| **INT8 算力** | 2,614 TOPS |
| **TF32 算力** | 653.7 TFLOPS |
| **FP64 算力** | 81.7 TFLOPS (Vector) / 163.4 TFLOPS (Matrix) |
| **Infinity Fabric** | 896 GB/s |
| **TDP** | 750W |
| **价格** | ~$15,000 |

**MI300X 关键优势:**
```
MI300X vs H100:
├── 显存: 192GB vs 80GB (+140%)
├── 带宽: 5.3 TB/s vs 3.35 TB/s (+58%)
├── FP16: 1,307 TF vs 989 TF (+32%)
├── FP64: 81.7 TF vs 33.5 TF (+144%)
├── 价格: ~$15k vs ~$33k (-55%)
└── 性价比: 推理场景接近 2x

MI300X vs H200:
├── 显存: 192GB vs 141GB (+36%)
├── 带宽: 5.3 TB/s vs 4.8 TB/s (+10%)
├── FP8: 2,614 TF vs 1,979 TF (+32%)
└── 价格: ~$15k vs ~$40k (-63%)
```

**Chiplet 架构:**
```
MI300X 架构 (Chiplet 封装):

┌──────────────────────────────────────────┐
│              MI300X                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │XCD 0│ │XCD 1│ │XCD 2│ │XCD 3│       │
│  │38 CU│ │38 CU│ │38 CU│ │38 CU│       │
│  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘       │
│     └───┬───┘       └───┬───┘           │
│    ┌────▼────┐     ┌────▼────┐          │
│  ┌─┤IOD 0/1 ├─┐ ┌─┤IOD 2/3 ├─┐        │
│  │ └────┬────┘ │ │ └────┬────┘ │        │
│  │      │      │ │      │      │        │
│  │ ┌────▼────┐ │ │ ┌────▼────┐ │        │
│  │ │XCD 4/5  │ │ │ │XCD 6/7  │ │        │
│  │ └─────────┘ │ │ └─────────┘ │        │
│  └─────────────┘ └─────────────┘        │
│         ┌───────────────────┐            │
│         │  HBM3 控制器       │ 192GB     │
│         │  5.3 TB/s          │            │
│         └───────────────────┘            │
└──────────────────────────────────────────┘
```

### 3.2 MI325X (2024 年发布, MI300X 升级版)

**定位**: MI300X 的显存升级版, 对标 H200

| 参数 | MI300X | MI325X | 提升 |
|------|--------|--------|------|
| **显存** | 192GB HBM3 | **256GB HBM3E** | **+33%** |
| **显存带宽** | 5.3 TB/s | **6 TB/s** | **+13%** |
| **FP16 算力** | 1,307 TF | 1,307 TF | - |
| **FP8 算力** | 2,614 TF | 2,614 TF | - |
| **FP64 算力** | 81.7 TF | 81.7 TF | - |
| **TDP** | 750W | 1,000W | +33% |
| **封装** | OAM | OAM | - |

**MI325X vs H200 (AMD 官方对比):**
| 维度 | H200 SXM | MI325X OAM | 胜者 |
|------|----------|------------|------|
| **AI 性能 (FP16)** | 989.4 TF | 1,307.4 TF | MI325X (+32%) |
| **AI 性能 (FP8)** | 1,978.9 TF | 2,614.9 TF | MI325X (+32%) |
| **HPC 性能 (FP64)** | 33.5 TF | 81.7 TF | MI325X (+144%) |
| **显存容量** | 141 GB | 256 GB | MI325X (+82%) |
| **显存带宽** | 4.8 TB/s | 6 TB/s | MI325X (+25%) |

**MI325X 平台 (8 卡):**
| 参数 | 规格 |
|------|------|
| **GPU** | 8x MI325X OAM |
| **总显存** | 2TB HBM3E |
| **总带宽** | 48 TB/s |
| **FP16 算力** | 20.9 PFLOPS (含 sparsity) |
| **互联** | 第四代 Infinity Fabric |

### 3.3 MI350 系列 (2025 年, CDNA 4, 最新旗舰)

**定位**: AMD 最新旗舰, Blackwell 竞争者, 已量产

MI350 系列基于第四代 CDNA 架构, 是 AMD 2025 年发布的最新数据中心 GPU 产品线。

#### MI355X (OAM, 旗舰)

| 参数 | 规格 |
|------|------|
| **架构** | CDNA 4 |
| **计算单元** | 256 CU |
| **显存** | 288GB HBM3E |
| **显存带宽** | 8 TB/s |
| **FP16/BF16 (Sparsity)** | 5.0 PFLOPS |
| **FP8/OCP-FP8 (Sparsity)** | 10.1 PFLOPS |
| **MXFP6** | 10.1 PFLOPS |
| **MXFP4** | 10.1 PFLOPS |
| **FP64 (Vector)** | 78.6 TFLOPS |
| **FP64 (Matrix)** | 78.6 TFLOPS |
| **FP32 (Vector)** | 157.3 TFLOPS |
| **封装** | OAM |

**MI355X vs B200 (AMD 官方对比):**

| 维度 | B200 SXM5 | MI355X OAM | 胜者 |
|------|-----------|------------|------|
| **AI 性能 (FP16 Sparsity)** | 4.5 PFLOPS | 5.0 PFLOPS | MI355X (+11%) |
| **AI 性能 (FP8 Sparsity)** | 9 PFLOPS | 10.1 PFLOPS | MI355X (+12%) |
| **AI 性能 (MXFP6)** | 4.5 PFLOPS | 10.1 PFLOPS | MI355X (+124%) |
| **HPC 性能 (FP64)** | 37 TF | 78.6 TF | MI355X (+112%) |
| **显存容量** | 180 GB | 288 GB | MI355X (+60%) |
| **显存带宽** | 7.7 TB/s | 8.0 TB/s | MI355X (+4%) |

#### MI350X (OAM, 标准版)

| 参数 | 规格 |
|------|------|
| **架构** | CDNA 4 |
| **计算单元** | 256 CU |
| **显存** | 288GB HBM3E |
| **显存带宽** | 8 TB/s |
| **封装** | OAM |

#### MI350P (PCIe, 企业版, 新产品)

| 参数 | 规格 |
|------|------|
| **架构** | CDNA 4 |
| **计算单元** | 128 CU |
| **显存** | 144GB HBM3E |
| **显存带宽** | 4 TB/s |
| **封装** | PCIe |
| **定位** | 企业级, 无需更换基础设施 |

**MI350P 关键优势:**
- PCIe 形态, 可直接插入现有服务器
- 无需 OAM 基板和液冷基础设施
- Dell/HPE/Lenovo/Supermicro/Cisco 等 OEM 支持
- AMD Enterprise AI Suite 软件栈

**MI350P vs H200 NVL:**
- 更低 OPEX (MXFP6/MXFP4 低精度)
- 更多 HBM3E 显存
- 开源软件生态, 无许可费用

#### MI350 系列平台 (8 卡)

| 参数 | 规格 |
|------|------|
| **GPU** | 8x MI355X 或 MI350X OAM |
| **总显存** | 2.3TB HBM3E |
| **总带宽** | 64 TB/s |
| **MXFP4/MXFP6 算力** | 80.5 PFLOPS |
| **互联** | 第四代 Infinity Fabric |
| **散热** | 风冷或直接液冷 (DLC) |

**可运行模型 (FP16, +10% 开销):**
- OPT 130B: 1 卡
- GPT-3 175B: 2 卡
- LLaMA 405B: 2 卡
- Gopher 280B: 2 卡
- PaLM 340B: 3 卡
- 1T 参数模型: 5 卡

#### MI350 系列关键特性

- **CDNA 4 架构**: 新一代计算单元, 能效比提升
- **MXFP4/MXFP6**: 新增低精度数据格式, 推理吞吐翻倍
- **288GB HBM3E**: 业界最大显存, 可单卡运行 130B 模型 (FP16)
- **8 TB/s 带宽**: 与 B200 持平
- **ROCm 7.2.4 支持**: 已正式支持
- **AMD Enterprise AI Suite**: 企业级 AI 软件栈, Kubernetes 集成
- **AMD GPU Operator**: 简化 K8s 部署

#### MI350 部署案例 (2026 年)

| 客户 | GPU | 场景 | 详情 |
|------|-----|------|------|
| **Maincode** | MI355X | 澳大利亚 AI 工厂 | $30M, 主权 AI |
| **TensorWave** | MI300X/MI355X | AI 云服务 | 2x 性能, 40-60% 成本节省 |
| **Dell** | MI350P | PowerEdge 服务器 | 企业级 PCIe 部署 |
| **HPE** | MI350P | ProLiant 服务器 | 企业级部署 |
| **Lenovo** | MI350P | AI 服务器 | 企业级部署 |
| **Supermicro** | MI350P | 高密度 AI 服务器 | 模块化架构 |
| **Cisco** | MI350P | UCS 服务器 | 网络+AI 集成 |
| **Akamai** | MI350P | 边缘推理 | 分布式推理 |
| **Red Hat** | MI350P | OpenShift AI | 混合云 AI |
| **VMware/Broadcom** | MI350P | VCF | 虚拟化 AI |

### 3.4 AMD Instinct 完整产品线 (2024-2026)

| 产品 | 架构 | 显存 | 带宽 | FP8 算力 | 封装 | 状态 |
|------|------|------|------|----------|------|------|
| MI300X | CDNA 3 | 192GB HBM3 | 5.3 TB/s | 2,614 TF | OAM | 量产 |
| MI325X | CDNA 3 | 256GB HBM3E | 6 TB/s | 2,614 TF | OAM | 量产 |
| MI300A | CDNA 3+Zen4 | 128GB HBM3 | 5.3 TB/s | 2,614 TF | APU | 量产 |
| MI350P | CDNA 4 | 144GB HBM3E | 4 TB/s | — | PCIe | 量产 |
| MI350X | CDNA 4 | 288GB HBM3E | 8 TB/s | — | OAM | 量产 |
| **MI355X** | **CDNA 4** | **288GB HBM3E** | **8 TB/s** | **10.1 PFLOPS** | **OAM** | **量产** |

### 3.5 AMD 路线图 (CDNA Next)

AMD 已公布 CDNA 架构路线图, 但 MI400/MI500 系列尚未正式发布:

| 代际 | 架构 | 预计时间 | 状态 |
|------|------|---------|------|
| MI300 系列 | CDNA 3 | 2023-2024 | 量产 |
| MI350 系列 | CDNA 4 | 2025 | 量产 |
| MI400 系列 | CDNA Next | 2026-2027 | 未公布 |
| MI500 系列 | CDNA Next+ | 2028+ | 未公布 |

**CDNA 4 已确认的关键技术方向:**
- MXFP4/MXFP6 低精度数据格式
- HBM3E 显存
- PCIe 企业级形态
- AMD Enterprise AI Suite 软件栈
- 更高 CU 数量和能效比

### 3.4 MI300A APU (2023 年发布)

**定位**: CPU+GPU 统一架构 APU, HPC + AI 融合

| 参数 | 规格 |
|------|------|
| **架构** | CDNA 3 + Zen 4 |
| **GPU CU** | 228 个 |
| **CPU 核心** | 24 个 Zen 4 x86 |
| **统一显存** | 128GB HBM3 |
| **显存带宽** | 5.3 TB/s |
| **FP16 算力** | 1,307 TFLOPS |
| **FP8 算力** | 2,614 TFLOPS |
| **FP64 算力** | 61.3 TF (Vector) / 122.6 TF (Matrix) |
| **TDP** | 760W |

**MI300A vs H100 (AMD 官方对比):**
| 维度 | H100 SXM | MI300A APU | 胜者 |
|------|----------|------------|------|
| **AI 性能 (FP8)** | 3,957.8 TF | 3,922.3 TF | 接近 |
| **HPC 性能 (FP64)** | 33.5 TF | 61.3 TF | MI300A (+83%) |
| **显存容量** | 80 GB | 128 GB | MI300A (+60%) |
| **显存带宽** | 3.4 TB/s | 5.3 TB/s | MI300A (+56%) |

**El Capitan 超级计算机:**
- 地点: Lawrence Livermore National Laboratory
- 规模: 2 ExaFLOPS
- 芯片: AMD MI300A APU
- 用途: 核武器模拟、科学研究
- 排名: 全球最快超级计算机之一

### 3.5 ROCm 软件生态 (最新进展)

#### ROCm 7.2.4 (2026-05-29, 最新稳定版)

**核心改进:**
| 改进 | 说明 |
|------|------|
| **hipGraphLaunch 延迟降低** | 多列表图拓扑启动延迟优化 |
| **CPX 模式 H2D 修复** | MI300 系列 CPX 模式内存拷贝延迟修复 |
| **vLLM 分析改进** | PyTorch profiler 追踪准确性提升 |
| **MIGraphX concat 优化** | 消除冗余设备端拷贝 |

**支持的 GPU:**
| GPU | 固件版本 | 驱动版本 |
|-----|---------|---------|
| MI355X | 01.26.00.02 | 30.30.x |
| MI350X | 01.26.00.02 | 30.30.x |
| MI325X | 01.25.06.08 | 30.30.x |
| MI300X | 01.25.06.04 | 30.30.x |
| MI300A | BKC 26.1 | — |
| MI250X | IFWI 47 | — |

#### ROCm 7.13.0 Preview (技术预览)

- ROCm XIO: GPU 发起的直接 IO (无需 CPU 介入)
- 继续支持 MI350X/MI355X

#### ROCm 核心组件

| 类别 | 组件 | 版本 | 说明 |
|------|------|------|------|
| **运行时** | HIP | 7.2.1 | GPU 编程模型 |
| **运行时** | ROCr Runtime | 1.18.0 | 底层运行时 |
| **编译器** | LLVM | 22.0.0 | 编译器后端 |
| **编译器** | HIPCC | 1.1.1 | HIP 编译器 |
| **数学库** | hipBLAS | 3.2.0 | 线性代数 |
| **数学库** | hipBLASLt | 1.2.2 | 轻量级 BLAS |
| **数学库** | rocBLAS | 5.2.0 | BLAS 实现 |
| **通信** | RCCL | 2.27.7 | 集合通信 (对标 NCCL) |
| **深度学习** | MIOpen | 3.5.1 | 深度学习库 (对标 cuDNN) |
| **推理** | MIGraphX | 2.15.0 | 推理引擎 |
| **调试** | ROCgdb | 16.3 | 调试器 |
| **性能** | ROCprofiler-SDK | 1.1.0 | 性能分析 |

#### ROCm 即将弃用

| 组件 | 状态 | 替代 |
|------|------|------|
| ROCTracer | 2026 Q2 弃用 | ROCprofiler-SDK |
| ROCProfiler | 2026 Q2 弃用 | ROCprofiler-SDK |
| ROCm SMI | 即将进入维护模式 | AMD SMI |
| roc-obj-ls/extract | 即将移除 | llvm-objdump --offloading |

#### ROCm 生态框架支持

| 框架 | MI300X | MI325X | MI350X | 状态 |
|------|--------|--------|--------|------|
| **PyTorch** | ✅ | ✅ | ✅ | 原生支持 |
| **vLLM** | ✅ | ✅ | ✅ | 官方支持 |
| **SGLang** | ✅ | ✅ | ✅ | 官方支持 |
| **TensorFlow** | ✅ | ✅ | ⚠️ | 社区支持 |
| **JAX** | ✅ | ✅ | ⚠️ | 实验性 |
| **DeepSpeed** | ✅ | ✅ | ⚠️ | 社区支持 |
| **ONNX Runtime** | ✅ | ✅ | ✅ | MIGraphX EP |
| **Hugging Face** | ✅ | ✅ | ✅ | Optimum-ROCm |

### 3.6 AMD 部署案例 (详细)

| 客户 | 规模 | GPU | 场景 | 详情 |
|------|------|-----|------|------|
| **Microsoft Azure** | 数万卡 MI300X | MI300X | Azure ND MI300X | GPT-4 推理, Copilot |
| **Oracle OCI** | 数千卡 MI300X | MI300X | OCI AI 实例 | 通用推理 |
| **Meta** | 数千卡 MI300X | MI300X | Llama 推理 | 内部推理服务 |
| **Microsoft** | 数千卡 MI300X | MI300X | GitHub Copilot | 代码补全推理 |
| **Hugging Face** | 数百卡 MI300X | MI300X | 模型托管 | 推理服务 |
| **Stability AI** | 数千卡 MI300X | MI300X | SDXL | 图像生成 |
| **TensorWave** | AI 云 | MI300X | AI 云服务 | 2x 性能, 40-60% 成本节省 |
| **Maincode** | $30M AI 工厂 | MI355X | 澳大利亚 AI 工厂 | 主权 AI |
| **Lawrence Livermore** | El Capitan | MI300A | 超级计算机 | 2 ExaFLOPS, 核武器模拟 |

### 3.7 AMD 优劣势分析

| 优势 | 劣势 |
|------|------|
| 显存容量最大 (288GB MI355X) | ROCm 生态弱于 CUDA |
| 价格最低 ($15k MI300X) | 部分模型需额外优化 |
| HPC 性能领先 (FP64) | 多卡扩展弱于 NVLink |
| CDNA 4 算力翻倍 | 供应改善中但仍不如 NVIDIA |
| ROCm 7.x 快速迭代 | 社区活跃度较低 |
| El Capitan 验证的超算能力 | 训练案例少于 NVIDIA |
| vLLM/SGLang 官方支持 | 推理优化不如 TensorRT |

---

## 4. 全产品线横向对比

### 4.1 核心参数对比

| GPU | 架构 | 显存 | 带宽 | FP8 算力 | NVLink/IF | TDP | 价格 |
|-----|------|------|------|----------|-----------|-----|------|
| H100 SXM | Hopper | 80GB HBM3 | 3.35 TB/s | 1,979 TF | 900GB/s | 700W | $33k |
| H200 SXM | Hopper | 141GB HBM3e | 4.8 TB/s | 1,979 TF | 900GB/s | 700W | $40k |
| B200 SXM | Blackwell | 192GB HBM3e | 8 TB/s | 2,250 TF | 1,800GB/s | 1000W | $65k |
| GB200 | Blackwell+Grace | 384GB HBM3e | 8 TB/s | 4,500 TF | 1,800GB/s | 2700W | $120k+ |
| MI300X | CDNA 3 | 192GB HBM3 | 5.3 TB/s | 2,614 TF | 896GB/s | 750W | $15k |
| MI350X | CDNA 4 | 288GB HBM3e | 6 TB/s | 4,000+ TF | 1,000+GB/s | 800W | $25k |

### 4.2 能力矩阵

| GPU | 训练 | 推理 | 超大模型 | 性价比 | 生态成熟度 |
|-----|------|------|---------|--------|-----------|
| H100 | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ |
| H200 | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ |
| B200 | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| MI300X | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ |
| MI350X | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ |

---

## 5. 云厂商定价与可用性

### 5.1 H200 云实例

| 平台 | 实例类型 | GPU | 价格/小时 | 可用性 |
|------|---------|-----|-----------|--------|
| AWS | p5e.48xlarge | 8x H200 | $12-15 | GA |
| Azure | NC H200 v1 | 8x H200 | $11 | GA |
| GCP | a3-ultragpu-8g | 8x H200 | $10+ | GA |
| Lambda | gpu_8x_h200 | 8x H200 | ~$8 | GA |
| CoreWeave | 8x H200 SXM | 8x H200 | ~$9 | GA |

### 5.2 B200 云实例 (2025 年)

| 平台 | 实例类型 | GPU | 价格/小时 | 可用性 |
|------|---------|-----|-----------|--------|
| AWS | p6 (预期) | 8x B200 | $20+ | 预览 |
| Azure | ND GB200 v6 | 72x B200 | 企业定制 | 预览 |
| GCP | a3-ultragpu-b200 | 8x B200 | $15+ | 预览 |

### 5.3 MI300X 云实例

| 平台 | 实例类型 | GPU | 价格/小时 | 可用性 |
|------|---------|-----|-----------|--------|
| Azure | ND MI300X v5 | 8x MI300X | ~$7 | GA |
| OCI | BM.GPU.MI300X | 8x MI300X | ~$6 | GA |
| Lambda | gpu_8x_mi300x | 8x MI300X | ~$5 | GA |

### 5.4 H100 云实例 (仍主流)

| 平台 | 实例类型 | GPU | 价格/小时 | 性价比 |
|------|---------|-----|-----------|--------|
| AWS | p5.48xlarge | 8x H100 | $10 | 中 |
| Azure | NC100 v1 | 8x H100 | $9 | 中 |
| GCP | a3-highgpu-8g | 8x H100 | $8 | 高 |
| Lambda | gpu_8x_h100 | 8x H100 | $2.49 | 极高 |
| CoreWeave | 8x H100 SXM | 8x H100 | ~$2.50 | 极高 |
| GCP Spot | a3-highgpu-8g | 8x H100 | $3.72 | 极高(可中断) |

---

## 6. 大规模部署案例

### 6.1 NVIDIA 部署案例

| 客户 | 规模 | GPU | 模型 | 场景 |
|------|------|-----|------|------|
| **xAI (Elon Musk)** | 100,000x H100 | H100 | Grok 3 | 训练集群, 2024 年建成 |
| **Meta** | 600,000+ H100 | H100 | Llama 3.1 405B | 训练+推理 |
| **OpenAI/Microsoft** | 数万卡 H200 | H200 | GPT-4o/GPT-5 | 训练+推理 |
| **Google** | 数万卡 H100 | H100 | Gemini | 外部补充 |
| **Tesla** | 50,000x H100 | H100 | FSD/Optimus | 自动驾驶训练 |
| **字节跳动** | 数万卡 H100 | H100 | 豆包 | 训练+推理 |
| **阿里云** | 数万卡 H800 | H800 | 通义千问 | 训练+推理 |
| **腾讯云** | 数万卡 H800 | H800 | 混元 | 训练+推理 |
| **Mistral** | 数千卡 H100 | H100 | Mistral Large | 训练 |
| **Anthropic** | 数万卡 H200 | H200 | Claude 4 | 训练+推理 |

### 6.2 AMD 部署案例

| 客户 | 规模 | GPU | 模型 | 场景 |
|------|------|-----|------|------|
| **Microsoft Azure** | 数万卡 MI300X | MI300X | GPT-4 推理 | Azure ND MI300X |
| **Oracle OCI** | 数千卡 MI300X | MI300X | 通用推理 | OCI 实例 |
| **Meta** | 数千卡 MI300X | MI300X | Llama 推理 | 内部推理 |
| **Microsoft** | 数千卡 MI300X | MI300X | Copilot | GitHub Copilot 推理 |
| **Hugging Face** | 数百卡 MI300X | MI300X | 模型托管 | 推理服务 |
| **Stability AI** | 数千卡 MI300X | MI300X | SDXL/Stable Diffusion | 图像生成 |

### 6.3 典型集群配置

**xAI Memphis 集群 (2024 年):**
```
规模: 100,000x H100
算力: ~200 EFLOPS (FP8)
显存: 8PB HBM3
功耗: ~70MW
网络: InfiniBand NDR 400Gb/s
造价: ~$3-4B
用途: Grok 3 训练
```

**Meta RSC 集群 (2024 年):**
```
规模: 600,000+ H100
算力: ~1.2 ZFLOPS (FP8)
显存: 48PB HBM3
网络: InfiniBand + RoCE
造价: ~$20B+
用途: Llama 3.1 405B 训练
```

---

## 7. 选型决策指南

### 7.1 按场景选型

```
你的需求是什么?
═══════════════════════════════════════════════════════

  大模型训练 (100B+):
  ├── 首选: H100/H200 集群 (成熟、软件优化完善)
  ├── 下一代: B200 (算力密度更高)
  └── 性价比: MI300X (显存大、价格低)

  大模型推理:
  ├── 70B 模型:
  │   ├── H200 (141GB, 1 卡即可)
  │   └── MI300X (192GB, 余量更大, 更便宜)
  ├── 405B 模型:
  │   ├── GB200 NVL72 (384GB 统一编址)
  │   └── MI300X 8 卡集群
  └── 长上下文 (>100K):
      ├── H200 (4.8 TB/s 带宽)
      └── MI300X (5.3 TB/s 带宽)

  预算敏感:
  ├── 推理: MI300X ($15k, 192GB)
  ├── 训练: H100 (二手市场活跃, ~$25k)
  └── 云: Lambda/CoreWeave H100 ($2.5/h)

  国内部署:
  ├── 国产化: 华为昇腾 910B/910C
  └── 非禁售: H800 (已禁) / H20 (可用)
```

### 7.2 H200 vs MI300X 决策

| 维度 | H200 | MI300X | 胜者 |
|------|------|--------|------|
| 显存 | 141GB | 192GB | MI300X |
| 带宽 | 4.8 TB/s | 5.3 TB/s | MI300X |
| FP8 算力 | 1,979 TF | 2,614 TF | MI300X |
| 价格 | ~$40k | ~$15k | MI300X |
| 生态 | CUDA | ROCm | H200 |
| 供应 | 充足 | 改善中 | H200 |
| 多卡扩展 | NVLink 900GB/s | IF 896GB/s | H200 |

**结论**: 预算敏感选 MI300X, 生态优先选 H200

### 7.3 B200 vs MI350X 决策

| 维度 | B200 | MI350X | 胜者 |
|------|------|--------|------|
| 显存 | 192GB | 288GB | MI350X |
| 带宽 | 8 TB/s | 6 TB/s | B200 |
| FP8 算力 | 2,250 TF | 4,000+ TF | MI350X |
| 价格 | ~$65k | ~$25k | MI350X |
| 生态 | CUDA | ROCm | B200 |

**结论**: MI350X 在性价比上全面领先, 但 B200 生态更成熟

> **关联**: -> [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive|国产 AI 芯片]] | [[07_Model_Training/README|模型训练]] | [[10_Deployment_Inference/README|部署推理]] | [[90_Learn/guides/ai_engineering_roadmap_2026|AI 工程路线图]]
