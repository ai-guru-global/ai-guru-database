---
title: "FP8 浮点精度格式 (FP8 Floating Point Precision)"
category: -concepts
tags: ["fp8", "precision", "quantization", "inference-optimization", "e4m3", "e5m2", "hopper"]
relationships:
  - target: "概念/llm-quantization"
    type: related_to
  - target: "概念/deepgemm"
    type: related_to
  - target: "概念/model-formats"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "FP8 是 8-bit 浮点格式（E4M3/E5M2 两种变体），相比 FP16/BF16 减少一半显存占用，同时比 INT8 保留更好的精度。Hopper 架构原生支持 FP8 Tensor Core。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
updated: 2026-07-21
name_zh: "FP8 浮点精度格式"
---

# FP8 浮点精度格式

> 中文简称：FP8 浮点精度格式

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

- [[概念/llm-quantization]] — LLM 量化
- [[概念/deepgemm]] — DeepGEMM FP8 算子库
- [[概念/model-formats]] — 模型格式
- [[概念/mixed-precision]] — 混合精度训练
- [[概念/smoothquant]] — SmoothQuant INT8 量化
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析]] — AI Stack 深度解析

---

## 2026 FP8 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **Hopper 原生** | H100/H200 Tensor Core 支持 | GA |
| **Transformer Engine** | NVIDIA 自动混合精度 | GA |
| **DeepSpeed FP8** | 训练框架支持 | GA |
| **vLLM FP8** | 推理引擎支持 | GA |

## 生产最佳实践

1. **格式选择**：前向用 E4M3，反向用 E5M2
2. **缩放策略**：使用动态缩放（per-tensor/per-channel）
3. **精度验证**：FP8 训练后验证下游任务精度损失 <1%
4. **与 BF16 对比**：精度敏感场景优先 BF16，吞吐敏感用 FP8
5. **硬件要求**：FP8 需要 Hopper 架构（H100/H200）

## 2026 FP8 生态现状

| 框架/工具 | 支持 | 特色 | 状态 |
|------|------|------|------|
| Transformer Engine | ✅ | NVIDIA 官方 | ✅ 主流 |
| DeepSpeed FP8 | ✅ | 微软集成 | ✅ 主流 |
| Megatron-LM | ✅ | 大规模训练 | ✅ 成熟 |
| NeMo | ✅ | NVIDIA 全栈 | ✅ 主流 |
| PyTorch native | ✅ | torch.float8 | ✅ 前沿 |

## 检查清单

- [ ] GPU 支持 FP8（Hopper+）
- [ ] Transformer Engine 已配置
- [ ] 缩放策略已选择（per-tensor/per-channel）
- [ ] 精度验证已完成（< 1% 损失）
- [ ] 与 BF16 效果已对比
- [ ] 吐吐量提升已验证

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 精度损失大 | 缩放策略不当 | 改用 per-channel 缩放 |
| 训练不稳定 | 动态范围溢出 | 调整缩放因子 |
| 吐吐量未提升 | 未充分利用 | 检查 kernel 融合 |
| 兼容性问题 | 库版本旧 | 更新 TE/CUDA |

## 延伸阅读

- [[概念/Training/mixed-precision|Mixed Precision]] — 混合精度
- [[概念/Training/smoothquant|SmoothQuant]] — 平滑量化
- [[概念/Training/deepspeed|DeepSpeed]] — 分布式训练
- [[概念/Training/megatron-lm|Megatron-LM]] — 分布式框架
- [[概念/GPU/tensors|Tensors]] — 张量计算

> ℹ️ FP8 是 2026 年大模型训练的前沿加速技术，H100/B200 上可提升 1.5-2x 吐吐量，精度损失 < 1%，是超大规模训练的必选。

## 性能对比

| 精度 | 吐吐量 | 显存 | 精度损失 | 硬件 |
|------|------|------|------|------|
| FP32 | 1x | 4x | 0% | 所有 |
| BF16 | 2x | 2x | < 0.1% | Ampere+ |
| FP8 | 3x | 1x | < 1% | Hopper+ |
| INT8 | 2.5x | 1x | < 1% | 所有 |

> ℹ️ FP8 训练在 H100/B200 上已成熟，是超大规模训练的必选加速技术。
