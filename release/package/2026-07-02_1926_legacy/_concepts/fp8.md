---
title: "FP8 浮点精度格式 (FP8 Floating Point Precision)"
category: -concepts
tags: ["fp8", "precision", "quantization", "inference-optimization", "e4m3", "e5m2", "hopper"]
relationships:
  - target: "_concepts/llm-quantization"
    type: related_to
  - target: "_concepts/deepgemm"
    type: related_to
  - target: "_concepts/model-formats"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "FP8 是 8-bit 浮点格式（E4M3/E5M2 两种变体），相比 FP16/BF16 减少一半显存占用，同时比 INT8 保留更好的精度。Hopper 架构原生支持 FP8 Tensor Core。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: core
---

# FP8 浮点精度格式

> **一句话理解**: FP8 是"8-bit 浮点数"——比 INT8 精度更好，比 FP16 显存省一半，是 2026 年大模型推理的新一代标准精度。

---

## 1. 精度格式对比

| 格式 | 位宽 | 指数位 | 尾数位 | 动态范围 | 典型用途 |
|------|------|--------|--------|----------|----------|
| **FP32** | 32 bit | 8 | 23 | ±3.4×10³⁸ | 传统训练 |
| **FP16** | 16 bit | 5 | 10 | ±65504 | 训练/推理 |
| **BF16** | 16 bit | 8 | 7 | ±3.4×10³⁸ | 训练首选 |
| **FP8 E4M3** | 8 bit | 4 | 3 | ±448 | **推理首选** |
| **FP8 E5M2** | 8 bit | 5 | 2 | ±57344 | 梯度计算 |
| **INT8** | 8 bit | - | - | -128~127 | 传统量化 |
| **INT4** | 4 bit | - | - | -8~7 | 极致压缩 |

---

## 2. 两种 FP8 变体

```
FP8 两种变体的位分配
│
├── E4M3（推理首选）
│   ├── 1 bit 符号
│   ├── 4 bit 指数 → 动态范围小
│   ├── 3 bit 尾数 → 精度高
│   ├── 范围: ±448
│   └── 用途: 权重存储、推理计算
│
└── E5M2（梯度首选）
    ├── 1 bit 符号
    ├── 5 bit 指数 → 动态范围大
    ├── 2 bit 尾数 → 精度低
    ├── 范围: ±57344
    └── 用途: 梯度累加、混合精度训练
```

---

## 3. FP8 vs INT8

| 维度 | FP8 | INT8 |
|------|-----|------|
| **精度类型** | 浮点（指数+尾数） | 定点（均匀分布） |
| **动态范围** | 大（±448 / ±57344） | 小（-128~127） |
| **大值/小值** | 自动适应 | 需要缩放因子 |
| **量化方式** | 原生支持 | 需校准（PTQ/QAT） |
| **精度损失** | ~1-2% | ~2-5% |
| **硬件支持** | Hopper+ (原生 Tensor Core) | 通用 |
| **推理速度** | 快（原生硬件加速） | 快 |
| **推荐场景** | Hopper/B100+ 推理 | 通用量化推理 |

---

## 4. 硬件支持

| GPU | FP8 支持 | 说明 |
|------|---------|------|
| **NVIDIA H100/H800** | ✅ 原生 | Hopper 架构 FP8 Tensor Core |
| **NVIDIA B100/B200** | ✅ 原生 | Blackwell 架构 FP8 增强 |
| **NVIDIA A100/A800** | ❌ 不支持 | Ampere 架构无 FP8 |
| **AMD MI300X** | ✅ 原生 | CDNA 3 架构 FP8 |
| **APG 自研加速卡** | ✅ 原生 | 兼容 CUDA FP8 API |
| **华为昇腾 910C** | ⚠️ 部分 | CANN 7.x 支持 |

---

## 5. FP8 在 AI Stack 中的应用

| 应用 | 说明 |
|------|------|
| **DeepGEMM** | DeepSeek FP8 GEMM 算子库，Hopper 优化 |
| **模型权重** | 越来越多模型提供 FP8 版本 |
| **推理框架** | vLLM/SGLang 原生支持 FP8 推理 |
| **A-Speed** | AI Stack 加速套件支持 FP8 推理优化 |

---

## 6. 精度选择决策树

```
选择推理精度
│
├── GPU 是 Hopper/B100+？
│   ├── 是 → FP8（最佳性价比）
│   └── 否 → INT8 或 FP16/BF16
│
├── 显存是瓶颈？
│   ├── 是 → FP8 > INT8 > INT4
│   └── 否 → BF16/FP16（最佳精度）
│
└── 精度敏感场景？
    ├── 是 → BF16 > FP8
    └── 否 → FP8（通用推理）
```

---

## Related

- [[_concepts/llm-quantization]] — LLM 量化
- [[_concepts/deepgemm]] — DeepGEMM FP8 算子库
- [[_concepts/model-formats]] — 模型格式
- [[_concepts/mixed-precision]] — 混合精度训练
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
