---
title: "Google TPU 深度解析 2026"
category: "01-fundamentals-ai-hardware"
tags: ["tpu", "google", "ironwood", "trillium", "v5p", "v6e", "tpu7x", "ai-chip", "training", "inference"]
summary: "Google TPU 全代际技术解析:从 v4 到 TPU7x (Ironwood)，覆盖架构规格、Pod 规模、软件生态、部署案例和与 NVIDIA/AMD 的对比。"
sources:
  - "https://cloud.google.com/tpu/docs"
  - "https://cloud.google.com/tpu/docs/tpu7x"
  - "https://cloud.google.com/tpu/docs/v6e"
  - "https://cloud.google.com/tpu/docs/v5p"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Google Tpu Deep Dive"
  - "Google TPU Deep Dive"
  - Google_TPU_Deep_Dive

name_zh: "Google TPU 深度解析 2026"
---
# Google TPU 深度解析 2026

> 中文简称：Google TPU 深度解析 2026

> **一句话理解**: Google TPU 是全球最早量产的 AI 专用芯片，第七代 Ironwood (TPU7x) 以 192GB HBM、4,614 TFLOPS FP8 和 9,216 芯片 Pod 规模重新定义大规模 AI 计算。

---

## 目录

1. [TPU 演进历史](#1-tpu-演进历史)
2. [TPU v5p (2023 年)](#2-tpu-v5p)
3. [TPU v6e Trillium (2024 年)](#3-tpu-v6e-trillium)
4. [TPU7x Ironwood (2025 年, 最新)](#4-tpu7x-ironwood)
5. [全代际横向对比](#5-全代际横向对比)
6. [软件生态与框架支持](#6-软件生态与框架支持)
7. [部署案例](#7-部署案例)
8. [TPU vs NVIDIA vs AMD 对比](#8-tpu-vs-nvidia-vs-amd-对比)
9. [选型指南](#9-选型指南)

---

## 1. TPU 演进历史

```
Google TPU 代际演进:

2015  TPU v1  ── 推理专用, AlphaGo 使用
2017  TPU v2  ── 训练+推理, 引入 bfloat16
2018  TPU v3  ── 性能翻倍, Pod 规模扩大
2021  TPU v4  ── 3D Torus 互联, SparseCore
2023  TPU v5e ── 性价比优先, 256 芯片 Pod
2023  TPU v5p ── 训练旗舰, 8960 芯片 Pod
2024  TPU v6e ── Trillium, 推理优化
2025  TPU7x  ── Ironwood, 最新旗舰
```

---

## 2. TPU v5p (2023 年)

**定位**: 训练旗舰，面向大规模稠密和 MoE 模型训练

### 核心规格

| 参数 | 规格 |
|------|------|
| **代号** | TPU v5p |
| **芯片/Pod** | 8,960 |
| **TensorCore/芯片** | 2 |
| **MXU/芯片** | 8 (4 MXU x 2 TensorCore) |
| **SparseCore/芯片** | 4 |
| **BF16 算力/芯片** | 459 TFLOPS |
| **FP8 算力/芯片** | 459 TFLOPS |
| **HBM 容量/芯片** | 95 GiB |
| **HBM 带宽/芯片** | 2,575 GiBps (2.5 TB/s) |
| **ICI 双向带宽/芯片** | 1,200 GBps |
| **DCN 带宽/芯片** | 50 Gbps |
| **互联拓扑** | 3D Torus |
| **最大切片** | 16x16x24 (6,144 芯片) |
| **Multislice 最大** | 18,432 芯片 |
| **每 VM 芯片数** | 4 |
| **每 VM vCPU** | 208 |
| **每 VM RAM** | 448 GB |
| **机器类型** | `ct5p-hightpu-4t` |

### Pod 算力

| 切片规模 | 芯片数 | BF16 算力 | HBM 总容量 |
|---------|--------|----------|-----------|
| 最小切片 | 4 | 1.8 PFLOPS | 380 GiB |
| 1 Cube | 64 | 29.4 PFLOPS | 6.1 TiB |
| 8 Cubes | 512 | 234.9 PFLOPS | 48.4 TiB |
| 最大切片 | 6,144 | 2.8 PFLOPS | 583 TiB |
| 全 Pod | 8,960 | 4.1 EFLOPS | 851 TiB |

### 关键特性

- **3D Torus 互联**: 芯片间 1,200 GBps 双向带宽
- **Twisted Torus**: 4x4x8 等拓扑可使用扭曲环面, 分割带宽提升 70%
- **ICI 弹性**: 自动绕过光学链路故障, 提升调度可用性
- **SparseCore**: 专用稀疏计算核心, 加速推荐/Embedding 模型

---

## 3. TPU v6e Trillium (2024 年)

**定位**: 性价比优化, Transformer/CNN 训练推理

### 核心规格

| 参数 | 规格 |
|------|------|
| **代号** | Trillium (v6e) |
| **芯片/Pod** | 256 |
| **TensorCore/芯片** | 1 |
| **MXU/芯片** | 2 |
| **BF16 算力/芯片** | 918 TFLOPS |
| **INT8 算力/芯片** | 1,836 TOPS |
| **HBM 容量/芯片** | 32 GB |
| **HBM 带宽/芯片** | 1,638 GiBps (1.6 TB/s) |
| **ICI 双向带宽/芯片** | 800 GBps |
| **ICI 端口/芯片** | 4 |
| **DRAM/Host** | 1,536 GiB |
| **芯片/Host** | 8 |
| **互联拓扑** | 2D Torus |
| **BF16 Pod 算力** | 234.9 PFLOPS |
| **All-reduce 带宽/Pod** | 102.4 TB/s |
| **分割带宽/Pod** | 3.2 TB/s |
| **每 Host NIC** | 4x 200 Gbps |
| **DCN 带宽/Pod** | 25.6 Tbps |
| **特殊功能** | SparseCore |

### 切片配置

| 拓扑 | 芯片 | Hosts | VMs | 机器类型 | 用途 |
|------|------|-------|-----|---------|------|
| 1x1 | 1 | 1/8 | 1 | `ct6e-standard-1t` | 测试 |
| 2x2 | 4 | 1/2 | 1 | `ct6e-standard-4t` | 子主机 |
| 2x4 | 8 | 1 | 1 | `ct6e-standard-8t` | 推理优化 |
| 4x4 | 16 | 2 | 4 | `ct6e-standard-4t` | 多主机 |
| 8x8 | 64 | 8 | 16 | `ct6e-standard-4t` | 多主机 |
| 16x16 | 256 | 32 | 64 | `ct6e-standard-4t` | 最大 Pod |

### v6e vs v5p 关键差异

| 维度 | v6e | v5p |
|------|-----|-----|
| **BF16 算力** | 918 TF | 459 TF |
| **HBM 容量** | 32 GB | 95 GiB |
| **HBM 带宽** | 1.6 TB/s | 2.5 TB/s |
| **ICI 带宽** | 800 GBps | 1,200 GBps |
| **Pod 规模** | 256 | 8,960 |
| **互联** | 2D Torus | 3D Torus |
| **定位** | 推理+中小训练 | 大规模训练 |

---

## 4. TPU7x Ironwood (2025 年, 最新)

**定位**: 第七代旗舰, 大规模训练+推理

### 核心规格

| 参数 | v5p | v6e (Trillium) | **TPU7x (Ironwood)** |
|------|-----|---------------|---------------------|
| **芯片/Pod** | 8,960 | 256 | **9,216** |
| **TensorCore/芯片** | 2 | 1 | **2** |
| **SparseCore/芯片** | 4 | 2 | **4** |
| **BF16 算力/芯片** | 459 TF | 918 TF | **2,307 TF** |
| **FP8 算力/芯片** | 459 TF | 918 TF | **4,614 TF** |
| **HBM 容量/芯片** | 95 GiB | 32 GB | **192 GB** |
| **HBM 带宽/芯片** | 2,575 GiBps | 1,638 GiBps | **7,380 GiBps (7.4 TB/s)** |
| **ICI 带宽/芯片** | 1,200 GBps | 800 GBps | **1,200 GBps** |
| **DCN 带宽/芯片** | 50 Gbps | 100 Gbps | **100 Gbps** |
| **vCPU/VM (4 芯片)** | 208 | 180 | **224** |
| **RAM/VM (4 芯片)** | 448 GB | 720 GB | **960 GB** |
| **互联拓扑** | 3D Torus | 2D Torus | **3D Torus** |

### Ironwood 架构突破

**双 Chiplet 架构:**
```
Ironwood 芯片架构:

┌──────────────────────────────────────────┐
│            TPU7x 芯片                     │
│  ┌────────────────┐ ┌────────────────┐  │
│  │   Chiplet 0     │ │   Chiplet 1     │  │
│  │ ┌────────────┐  │ │ ┌────────────┐  │  │
│  │ │TensorCore 0│  │ │ │TensorCore 1│  │  │
│  │ └────────────┘  │ │ └────────────┘  │  │
│  │ ┌────┐ ┌────┐  │ │ ┌────┐ ┌────┐  │  │
│  │ │SC 0│ │SC 1│  │ │ │SC 2│ │SC 3│  │  │
│  │ └────┘ └────┘  │ │ └────┘ └────┘  │  │
│  │ ┌────────────┐  │ │ ┌────────────┐  │  │
│  │ │ HBM 96GB   │  │ │ │ HBM 96GB   │  │  │
│  │ └────────────┘  │ │ └────────────┘  │  │
│  └────────┬───────┘ └───────┬────────┘  │
│           └────── D2D ──────┘            │
│           (6x ICI 1D 速度)                │
└──────────────────────────────────────────┘
```

**关键特性:**
- **双 Chiplet**: 每芯片 2 个独立 Chiplet, 各有 1 个 TensorCore + 2 个 SparseCore + 96GB HBM
- **D2D 互联**: Die-to-Die 接口速度是 1D ICI 的 6 倍
- **192GB HBM**: 单芯片 192GB, 可容纳 70B 模型 (FP8)
- **7.4 TB/s 带宽**: 超过 NVIDIA B200 的 8 TB/s
- **4,614 TFLOPS FP8**: 超过 NVIDIA B200 的 2,250 TFLOPS
- **9,216 芯片 Pod**: 全球最大 TPU 集群

### 内存层级

| 层级 | 容量 | 带宽 | 说明 |
|------|------|------|------|
| **HBM** | 192 GB | 7.4 TB/s | 主显存 |
| **VMEM (SRAM)** | 可调 | 极高 | 片上高速暂存器 |
| **Host DRAM** | 960 GB/VM | PCIe 速度 | 可用于激活值/优化器卸载 |

### Pod 算力

| 切片规模 | 芯片数 | FP8 算力 | HBM 总容量 |
|---------|--------|----------|-----------|
| 最小切片 | 4 | 18.5 PFLOPS | 768 GB |
| 1 Cube | 64 | 295 PFLOPS | 12 TB |
| 8 Cubes | 512 | 2.4 PFLOPS | 98 TB |
| 最大 Pod | 9,216 | 42.5 PFLOPS | 1.7 PB |

### 与竞品对比

| 维度 | TPU7x | NVIDIA B200 | AMD MI350X |
|------|-------|-------------|------------|
| **FP8 算力** | 4,614 TF | 2,250 TF | 4,000+ TF |
| **HBM 容量** | 192 GB | 192 GB | 288 GB |
| **HBM 带宽** | 7.4 TB/s | 8 TB/s | 6 TB/s |
| **Pod 规模** | 9,216 芯片 | 72 卡 (NVL72) | 8 卡 |
| **Pod FP8 算力** | 42.5 PFLOPS | 162 PFLOPS | 32 PFLOPS |
| **可用性** | 仅 GCP | 多云 | 多云 |

---

## 5. 全代际横向对比

| 参数 | v4 | v5e | v5p | v6e | **TPU7x** |
|------|-----|------|------|------|----------|
| **年份** | 2021 | 2023 | 2023 | 2024 | **2025** |
| **BF16 算力** | 275 TF | 197 TF | 459 TF | 918 TF | **2,307 TF** |
| **FP8 算力** | — | 394 TF | 459 TF | 918 TF | **4,614 TF** |
| **HBM** | 32 GB | 16 GB | 95 GiB | 32 GB | **192 GB** |
| **HBM 带宽** | 1.2 TB/s | 820 GB/s | 2.5 TB/s | 1.6 TB/s | **7.4 TB/s** |
| **ICI 带宽** | 600 GBps | 400 GBps | 1,200 GBps | 800 GBps | **1,200 GBps** |
| **Pod 规模** | 4,096 | 256 | 8,960 | 256 | **9,216** |
| **互联** | 3D Torus | 2D Torus | 3D Torus | 2D Torus | **3D Torus** |
| **SparseCore** | ✅ | ✅ | ✅ | ✅ | **✅** |

---

## 6. 软件生态与框架支持

### 6.1 框架支持

| 框架 | TPU7x | v6e | v5p | 说明 |
|------|-------|-----|-----|------|
| **JAX** | ✅ | ✅ | ✅ | 原生支持, 最佳性能 |
| **PyTorch/XLA** | ✅ | ✅ | ✅ | PyTorch 通过 XLA 支持 |
| **TensorFlow** | ❌ | ✅ | ✅ | TPU7x 不支持 TF |

### 6.2 工具与库

| 工具 | 说明 |
|------|------|
| **JAX** | Google 原生 ML 框架, TPU 最佳支持 |
| **PyTorch/XLA** | PyTorch 通过 XLA 编译器运行在 TPU 上 |
| **MaxText** | Google 官方 LLM 训练框架 (基于 JAX) |
| **Pallas** | TPU 自定义内核编程 |
| **Pathways** | Google 的分布式 ML 系统 |
| **Multislice** | 跨切片训练, 最大 18,432 芯片 |
| **TPU Cluster Director** | 集群管理和调度 |

### 6.3 训练框架

| 框架 | 说明 | TPU 支持 |
|------|------|---------|
| **MaxText** | Google 官方 LLM 训练 | ✅ 原生 |
| **Pax** | Google 大模型训练 | ✅ 原生 |
| **DeepSpeed** | 微软分布式训练 | ⚠️ 有限 |
| **FSDP** | PyTorch 原生 | ✅ PyTorch/XLA |
| **Megatron-LM** | NVIDIA 训练框架 | ❌ 不支持 |

---

## 7. 部署案例

### 7.1 Google 内部使用

| 产品/模型 | TPU 版本 | 规模 | 说明 |
|-----------|---------|------|------|
| **Gemini 1.0/1.5** | TPU v5p | 万卡级 | Google 旗舰 LLM 训练 |
| **Gemini 2.0** | TPU v6e/TPU7x | 万卡级 | 下一代 LLM |
| **PaLM 2** | TPU v4 | 6,144 芯片 | 540B 参数 |
| **Imagen 2/3** | TPU v5p | 千卡级 | 图像生成 |
| **Gemma** | TPU v5e/v6e | 百卡级 | 开源小模型 |
| **AlphaFold 2** | TPU v4 | 数千芯片 | 蛋白质结构预测 |
| **AlphaGo/AlphaZero** | TPU v1-v3 | 数千芯片 | 围棋/棋类 AI |

### 7.2 外部客户使用

| 客户 | TPU 版本 | 场景 | 说明 |
|------|---------|------|------|
| **Anthropic** | TPU v5p | Claude 训练 | 部分训练负载 |
| **Apple** | TPU v5p | 内部 AI | 大规模训练 |
| **Salesforce** | TPU v5p | LLM 训练 | xGen 模型 |
| **Cohere** | TPU v5p | LLM 训练 | Command R 模型 |
| **Stability AI** | TPU v5p | SDXL | 图像生成训练 |
| **Midjourney** | TPU v5e | 推理 | 图像生成推理 |
| **Hugging Face** | TPU v5e | 模型托管 | 推理服务 |

### 7.3 Gemini 训练集群

```
Gemini 1.0 训练配置:
├── TPU: TPU v5p
├── 规模: 数万芯片 (Multislice)
├── 算力: ~100+ EFLOPS (BF16)
├── 框架: JAX + Pathways
├── 并行: 数据+模型+流水线
└── 训练时间: 数月

Gemini 2.0 训练配置:
├── TPU: TPU v6e + TPU7x
├── 规模: 万卡级 Multislice
├── 算力: 42.5 PFLOPS (FP8) per Pod
├── 框架: JAX + Pathways
└── 特点: MoE 架构, 推理优化
```

---

## 8. TPU vs NVIDIA vs AMD 对比

### 8.1 单芯片对比

| 维度 | TPU7x | NVIDIA B200 | AMD MI350X |
|------|-------|-------------|------------|
| **FP8 算力** | 4,614 TF | 2,250 TF | 4,000+ TF |
| **HBM** | 192 GB | 192 GB | 288 GB |
| **HBM 带宽** | 7.4 TB/s | 8 TB/s | 6 TB/s |
| **芯片间互联** | 1,200 GBps ICI | 1,800 GBps NVLink | 1,000+ GBps IF |
| **可用性** | 仅 GCP | 多云/自建 | 多云/自建 |
| **框架** | JAX 最优 | CUDA 最优 | ROCm |

### 8.2 集群级对比

| 维度 | TPU7x Pod | GB200 NVL72 | AMD MI350X 8 卡 |
|------|-----------|-------------|----------------|
| **芯片数** | 9,216 | 72 | 8 |
| **FP8 算力** | 42.5 PFLOPS | 324 PFLOPS | 32 PFLOPS |
| **总 HBM** | 1.7 PB | 13.8 TB | 2.3 TB |
| **扩展性** | 9,216 芯片直连 | 72 卡直连 | 需外部互联 |

### 8.3 优劣势

**TPU 优势:**
- 超大规模 Pod 直连 (9,216 芯片)
- Google 内部深度优化 (Gemini/PaLM 验证)
- JAX 原生支持, 性能最优
- Multislice 扩展到 18,432 芯片

**TPU 劣势:**
- 仅 GCP 可用, 锁定效应强
- CUDA 生态不兼容
- PyTorch 支持通过 XLA, 性能有损失
- 社区生态弱于 NVIDIA

---

## 9. 选型指南

```
选择 TPU 的场景:
├── 已在使用 GCP → TPU 是自然选择
├── JAX 生态 → TPU 性能最优
├── 超大规模训练 (>1000 芯片) → TPU7x Pod 优势明显
├── Google 模型 (Gemma 等) → TPU 原生优化
└── 预算敏感 → TPU v5e 性价比极高

选择 NVIDIA 的场景:
├── CUDA 生态依赖 → 必须 NVIDIA
├── PyTorch 为主 → CUDA 性能最优
├── 多云/自建 → NVIDIA 通用性最强
├── 需要最新模型支持 → NVIDIA 生态最全
└── 小规模部署 → NVIDIA 灵活性更高

选择 AMD 的场景:
├── 显存敏感 → MI300X/MI350X 显存最大
├── 预算敏感 → AMD 价格最低
└── ROCm 生态 → 可接受迁移成本
```

> **关联**: -> [[01_数学基础/10_AI_Hardware/NVIDIA_AMD_GPU_Deep_Dive|NVIDIA & AMD GPU]] | [[01_数学基础/10_AI_Hardware/Chinese_AI_Chips_Deep_Dive|国产 AI 芯片]] | [[07_模型训练/README|模型训练]] | [[10_部署推理/README|部署推理]]
