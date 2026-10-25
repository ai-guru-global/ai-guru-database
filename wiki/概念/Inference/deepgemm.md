---
title: "DeepGEMM FP8 算子库 (DeepGEMM FP8 Kernel Library)"
category: -concepts
tags: ["deepgemm", "fp8", "gemm", "deepseek", "kernel", "hopper", "low-precision"]
relationships:
  - target: "概念/deepseek-models"
    type: related_to
  - target: "概念/mixed-precision"
    type: related_to
  - target: "概念/flash-attention-kernels"
    type: related_to
  - target: "概念/cuda-platform"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "DeepGEMM 是 DeepSeek 开源的高性能 FP8 GEMM 算子库，基于 NVIDIA Hopper 架构优化，为 DeepSeek-V3 的低精度训练和推理提供底层算力支撑。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
name_zh: "DeepGEMM FP8 算子库"
---

# DeepGEMM FP8 算子库

> 中文简称：DeepGEMM FP8 算子库

> **一句话理解**: DeepGEMM 是 DeepSeek 的"FP8 算力引擎"——让 H100 GPU 以 FP8 精度跑出接近 BF16 的矩阵乘法性能，是 DeepSeek-V3 低成本训练的关键底层。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全称** | DeepGEMM |
| **开源方** | DeepSeek（深度求索） |
| **开源许可** | MIT License |
| **核心功能** | 高性能 FP8 GEMM（General Matrix Multiply） |
| **目标硬件** | NVIDIA Hopper (H100/H800) |
| **核心价值** | FP8 训练/推理的底层算力保障 |

---

## 2. 核心问题：FP8 矩阵乘法挑战

FP8 是 2026 年生产环境的默认精度，但 FP8 GEMM 面临精度和性能双重挑战：

| 挑战 | 说明 |
|------|------|
| **精度问题** | FP8 动态范围仅 ~240，直接量化会溢出/下溢 |
| **Scaling** | 需要精细的 per-tensor 或 per-block 缩放因子 |
| **硬件利用** | 需充分利用 Hopper Tensor Core FP8 指令 |
| **内存带宽** | 减少 HBM 访问次数是关键瓶颈 |

---

## 3. DeepGEMM 技术方案

### 3.1 核心设计

```
DeepGEMM 架构
│
├── FP8 GEMM 核心
│   ├── E4M3 格式（训练/推理激活）
│   ├── E5M2 格式（梯度）
│   └── Per-block Scaling（细粒度缩放）
│
├── Hopper 硬件优化
│   ├── TMA (Tensor Memory Accelerator)
│   ├── wgmma (Warp Group MMA) 指令
│   └── Async Pipeline（异步流水线）
│
└── 融合优化
    ├── GEMM + Epilogue 融合
    ├── GEMM + Activation 融合
    └── 减少中间结果 HBM 写回
```

### 3.2 关键技术

| 技术 | 说明 |
|------|------|
| **Per-block Scaling** | 128×128 块粒度缩放，避免全局缩放精度损失 |
| **TMA 异步加载** | 利用 Hopper TMA 单元异步搬运数据 |
| **Warp Group MMA** | 使用 wgmma 指令执行矩阵乘法，最大化 Tensor Core 利用率 |
| **多阶段 Pipeline** | 多级流水线重叠计算和数据搬运 |
| **累加精度** | FP32 累加，保证计算精度 |

---

## 4. DeepSeek 开源算子矩阵

DeepSeek 开源了完整的推理/训练算子生态：

| 项目 | 功能 | 硬件 | 开源许可 |
|------|------|------|----------|
| **FlashMLA** | MLA 注意力算子 | H800/B200 | MIT |
| **DeepGEMM** | FP8 矩阵乘法 | H100/H800 | MIT |
| **DualPipe** | 双向流水线并行 | 多 GPU | MIT |
| **3FS** | 分布式文件系统 | 存储集群 | MIT |

### 各算子的角色分工

```
DeepSeek-V3 训练/推理技术栈
│
├── 注意力层 → FlashMLA
│   └── MLA 压缩 KV Cache，7-28× 显存节省
│
├── 线性层 → DeepGEMM ← 本文
│   └── FP8 矩阵乘法，接近 BF16 精度
│
├── 并行调度 → DualPipe
│   └── 双向流水线，减少 pipeline bubble
│
└── 数据存储 → 3FS
    └── 分布式文件系统，高吞吐 I/O
```

---

## 5. 性能对比

| 方案 | FP8 GEMM 性能 (H100) | 精度 | 特点 |
|------|---------------------|------|------|
| **DeepGEMM** | ~900 TFLOPS | Per-block Scaling | DeepSeek 优化 |
| **cuBLAS FP8** | ~800 TFLOPS | Per-tensor Scaling | NVIDIA 标准 |
| **CUTLASS FP8** | ~850 TFLOPS | Per-block | NVIDIA 模板库 |
| **BF16 cuBLAS** | ~500 TFLOPS | BF16 基线 | 无精度损失 |

> DeepGEMM 在 FP8 GEMM 上实现了对 cuBLAS 的 **~10-15% 性能提升**。

---

## 6. 与 AI Stack 的关系

DeepGEMM 作为 DeepSeek 开源生态的一部分，间接支撑 AI Stack 的推理能力：

| 关联点 | 说明 |
|--------|------|
| DeepSeek 模型部署 | AI Stack 预置 DeepSeek 全系列，底层可能使用 DeepGEMM |
| FP8 推理 | AI Stack 支持 FP8 精度推理，DeepGEMM 提供参考实现 |
| A-Speed 加速 | A-Speed 可能集成或参考 DeepGEMM 的优化策略 |

---

## Related

- [[概念/deepseek-models]] — DeepSeek 模型系列
- [[概念/mixed-precision]] — 混合精度
- [[概念/flash-attention-kernels]] — FlashMLA 算子
- [[概念/cuda-platform]] — CUDA 计算平台
- [[概念/quantization]] — 量化技术
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析]] — AI Stack 深度解析

## DeepGEMM vs 其他 GEMM 库

| 库 | 精度 | 硬件 | 特点 | 适用 |
|------|------|------|------|------|
| **DeepGEMM** | FP8 | H100+ | DeepSeek 专用，极致优化 | DeepSeek 推理 |
| **cuBLAS** | FP16/FP8 | NVIDIA | 通用，稳定 | 通用场景 |
| **CUTLASS** | 多种 | NVIDIA | 可定制，模板库 | 自定义 kernel |
| **FlashAttention** | FP16/FP8 | NVIDIA | 注意力专用 | Attention 计算 |
| **FlashMLA** | FP8 | H100+ | MLA 专用 | DeepSeek MLA |

## DeepGEMM 工作原理

```
标准 GEMM: C = A × B  (FP16)
  计算量: 2 × M × N × K FLOPs
  内存访问: (M×K + K×N + M×N) × 2 bytes

DeepGEMM (FP8):
  A: FP8 (E4M3), B: FP8 (E4M3), C: FP16/BF16
  计算量不变，但内存访问减半
  + 针对 H100 TMA (Tensor Memory Accelerator) 优化
  + 异步流水线: 数据加载与计算重叠

效果: 相比 cuBLAS FP8，吐吐量提升 1.2-1.5x
```

## 生产最佳实践

1. **DeepSeek 推理必用**：DeepGEMM 是 DeepSeek-V3 推理的标配
2. **H100+ 才有效**：DeepGEMM 依赖 H100 TMA 硬件特性
3. **与 FlashMLA 配合**：DeepGEMM (线性层) + FlashMLA (注意力)
4. **非 DeepSeek 用 cuBLAS**：其他模型用标准 cuBLAS/CUTLASS
5. **FP8 校准**：FP8 精度有限，需要正确的缩放因子

## 延伸阅读

- [[概念/Inference/flashmla|FlashMLA]] — MLA 注意力优化
- [[概念/Inference/quantization|量化]] — FP8 量化技术
- [[概念/LLM/flash-attention-kernels|Flash Attention]] — 注意力算子
- [[概念/Inference/tensorrt|TensorRT]] — 编译优化

> ℹ️ DeepGEMM 是 DeepSeek 推理性能的关键组件，与 FlashMLA 配合使用。
仅适用于 H100+ GPU，其他硬件用标准 cuBLAS/CUTLASS。

---

## 2026 DeepGEMM 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **FP8 GEMM** | H100 WGMMA 指令的 FP8 矩阵乘法 | GA |
| **JIT 编译** | 运行时编译最优 GEMM kernel | GA |
| **与 FlashMLA 配合** | DeepSeek 推理链的核心组件 | GA |
| **Grouped GEMM** | MoE 专家并行计算 | GA |
| **开源免费** | MIT 许可，可自由集成 | GA |

## 生产最佳实践

1. **硬件要求**：仅支持 H100/H200+，A100 无法使用
2. **与 vLLM 集成**：通过 vLLM 后端自动调用 DeepGEMM
3. **精度验证**：FP8 量化后验证输出质量，确保精度损失可接受
4. **性能基准**：与 cuBLAS FP16 对比，确认实际加速比
5. **回退方案**：非 H100 环境自动回退标准 GEMM，不影响功能
