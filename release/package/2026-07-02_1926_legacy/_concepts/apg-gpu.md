---
title: "APG 自研加速卡 (Alibaba Proprietary GPU)"
category: -concepts
tags: ["apg", "alibaba-cloud", "gpu", "ai-stack", "cuda-compatible", "accelerator"]
relationships:
  - target: "_concepts/ai-hardware"
    type: related_to
  - target: "_concepts/cuda-platform"
    type: related_to
  - target: "_concepts/a-speed"
    type: related_to
  - target: "_concepts/heterogeneous-gpu"
    type: related_to
  - target: "_concepts/gpu-interconnect"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "APG 是阿里云自研的 AI 加速卡，是 AI Stack 的首选 GPU。高度兼容 CUDA API，卡间互联带宽达 700 GB/s，16 卡旗舰版提供 1.5+ TB 超大显存。"
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
---

# APG 自研加速卡

> **一句话理解**: APG 是阿里云的"自研 AI 芯片"——AI Stack 的首选 GPU，高度兼容 CUDA，是国产替代 NVIDIA 的关键载体。

---

## 1. 定位

APG（Alibaba Proprietary GPU）是阿里云自研的 AI 加速卡，作为 AI Stack 的**首选硬件平台**：

| 维度 | 信息 |
|------|------|
| **厂商** | 阿里云 |
| **类型** | AI 加速卡（GPU） |
| **CUDA 兼容** | 高度兼容 CUDA API |
| **AI Stack 角色** | 首选 GPU，Qwen3-Pro 独占输出平台 |
| **竞争定位** | 对标 NVIDIA H800/H100 |

---

## 2. 硬件规格

### 2.1 APG 服务器规格矩阵

| 版本 | GPU 数量 | 机架规格 | CPU | 显存 | 卡间互联 | 机间带宽 |
|------|----------|----------|-----|------|----------|----------|
| **2 卡版** | 2 | 2U | 2× 海光 C86-4G | — | — | 100Gb |
| **4 卡版** | 4 | 4U | 2× 海光 7470 | — | — | 100Gb+ |
| **8 卡版** | 8 | 4U | 2× 海光 7470 | — | — | 100Gb+ |
| **16 卡旗舰** | 16 | 14U (2U+6U×2) | 2× Xeon/海光7490 | 1.5+ TB | 700 GB/s | 1.6T |

### 2.2 16 卡旗舰版详细规格

| 模块 | 规格 |
|------|------|
| **GPU 数量** | 16 卡 |
| **形态** | 14U AI 服务器（机头 2U + 机尾 6U×2） |
| **内存** | 32 个 DDR5 插槽，最高 5600 MT/s |
| **显存** | 1.5+ TB 超大显存 |
| **卡间互联** | 700 GB/s |
| **本地存储** | 240G SATA SSD ×1 + 3840G NVMe SSD ×4 |
| **网络** | 双口 200G 以太网卡 ×5 + 双口 25GE ×1 |
| **机间带宽** | 1.6T 通信带宽，低时延无拥塞 |
| **电源** | 机头 2×2000W (1+1)，机尾 4×4000W (N+N) |

---

## 3. CUDA 兼容性

APG 的核心竞争力之一是**高度兼容 CUDA 生态**：

| 兼容层面 | 说明 |
|----------|------|
| **CUDA API** | 直接调用 CUDA API，代码无需修改 |
| **NVCC 编译** | 支持 NVCC 编译命令行 |
| **cuDNN** | 兼容 cuDNN 深度学习库 |
| **框架支持** | PyTorch / TensorFlow / JAX 无需改动 |
| **迁移成本** | 从 NVIDIA 迁移门槛极低 |

### CUDA 兼容性对比

| GPU | CUDA 兼容度 | 迁移难度 | 生态成熟度 |
|-----|------------|----------|-----------|
| **APG** (阿里云) | 高度兼容 | 极低 | 中（快速增长） |
| **NVIDIA** | 原生 | 无需迁移 | 最高 |
| **Ascend** (华为) | 需适配 | 中等 | 中高 |
| **AMD Instinct** | ROCm 兼容层 | 中等 | 中 |

---

## 4. 在 AI Stack 中的独占优势

| 独占能力 | 说明 |
|----------|------|
| **Qwen3-Pro 独占输出** | 专有优化模型仅在 APG 上可用 |
| **A-Speed 最优适配** | A-Speed 加速套件优先适配 APG |
| **KVCache 加速** | Qwen3-235B KVCache 加速 + APFS 存储 |
| **1.9× 性能** | Qwen3-Pro 在 APG 上性能翻倍 |

---

## 5. 与竞品 GPU 对比

| 维度 | APG 16 卡 | NVIDIA H100 8卡 | 华为昇腾 910B 8卡 |
|------|-----------|-----------------|------------------|
| **卡间互联** | 700 GB/s | 900 GB/s (NVLink) | 392 GB/s (HCCS) |
| **单机显存** | 1.5+ TB | 640 GB (8×80GB) | 512 GB (8×64GB) |
| **CUDA 兼容** | 高度兼容 | 原生 | 需适配 |
| **推理框架** | A-Speed | vLLM/SGLang/TensorRT | MindSpore/vLLM |
| **供应链** | 自主可控 | 受出口管制 | 自主可控 |

---

## 6. 多 GPU 支持架构

AI Stack 支持三种 GPU 的统一纳管：

```
AI Stack 异构 GPU 架构
│
├── APG (阿里云) ← 首选
│   ├── CUDA 高度兼容
│   ├── A-Speed 最优适配
│   └── Qwen3-Pro 独占
│
├── Ascend (华为昇腾)
│   ├── CANN/MindSpore 适配
│   └── 国产替代选项
│
└── NVIDIA
    ├── 原生 CUDA/cuDNN
    └── 业界标准
```

---

## Related

- [[_concepts/ai-hardware]] — AI 硬件全景
- [[_concepts/cuda-platform]] — CUDA 计算平台
- [[_concepts/a-speed]] — A-Speed 加速推理
- [[_concepts/heterogeneous-gpu]] — 异构 GPU 纳管
- [[_concepts/gpu-interconnect]] — GPU 互联
- [[_concepts/ascend-npu]] — 华为昇腾 NPU
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
