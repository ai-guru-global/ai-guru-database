---
title: "混合精度训练与推理 (Mixed Precision)"
category: -concepts
tags: ["mixed-precision", "bf16", "fp16", "fp8", "fp32", "quantization", "amp"]
relationships:
  - target: "_concepts/model-training"
    type: optimizes
  - target: "_concepts/model-compression"
    type: related_to
  - target: "_concepts/ai-hardware"
    type: depends_on
  - target: "_concepts/model-precision"
    type: detailed_by
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 07_Model_Training/Optimization/Mixed_Precision_Training.md
summary: "混合精度在训练中使用 BF16/FP16 加速计算并保持 FP32 主权重，显存减半、速度翻倍。2026年 FP8 训练成为新前沿，H100/MI300X 原生支持 FP8 Tensor Core。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
---

# 混合精度训练与推理 (Mixed Precision)

> 用一半的显存，跑两倍的 batch size——速度与精度的完美平衡。

---

## 1. 定义

**混合精度**（Mixed Precision）在深度学习中使用多种浮点数据类型：
- **前向/反向计算**：使用低精度（FP16/BF16/FP8）加速
- **权重主副本**：保持 FP32 精度，避免数值误差累积

---

## 2. 浮点数据类型对比

| 类型 | 位数 | 指数位 | 尾数位 | 动态范围 | 精度 | GPU 支持 |
|------|------|--------|--------|----------|------|---------|
| **FP32** | 32 | 8 | 23 | ±3.4×10³⁸ | 高 | 所有 GPU |
| **TF32** | 19 | 8 | 10 | 同 FP32 | 中 | A100+ |
| **BF16** | 16 | 8 | 7 | 同 FP32 | 低 | A100+ (推荐) |
| **FP16** | 16 | 5 | 10 | ±65504 | 中 | V100+ (需 loss scaling) |
| **FP8 E4M3** | 8 | 4 | 3 | ±448 | 低 | H100+ |
| **FP8 E5M2** | 8 | 5 | 2 | ±57344 | 极低 | H100+ |
| **INT8** | 8 | - | - | -128~127 | 整数 | 所有 GPU |
| **INT4/NF4** | 4 | - | - | - | 极低 | 推理量化 |

```
数值精度层级:
FP32 (最高) → TF32 → BF16 → FP16 → FP8 → INT8 → INT4/NF4 (最低)
  训练主权重    前向加速   混合精度   需scaling  前沿训练  推理量化  推理量化
```

---

## 3. 混合精度训练原理

### 3.1 AMP (Automatic Mixed Precision)

```
AMP 训练流程:
1. 前向传播：FP16/BF16 计算（速度快，显存小）
2. 反向传播：FP16/BF16 计算梯度
3. Loss Scaling：梯度乘以 scale factor（防止 FP16 下溢）
4. 梯度反缩放：梯度除以 scale factor
5. 权重更新：FP32 主权重 += FP32 梯度（精度保持）
```

### 3.2 BF16 vs FP16

| 维度 | BF16 | FP16 |
|------|------|------|
| **动态范围** | 同 FP32（8位指数） | 窄（5位指数） |
| **溢出风险** | 低 | 高（需要 Loss Scaling） |
| **训练稳定性** | 更好 | 需精细调参 |
| **推荐度** | **首选** (2024+) | 旧 GPU 备选 |
| **硬件要求** | A100+ / MI200+ | V100+ |

---

## 4. FP8：2026 年前沿

| 特性 | FP8 E4M3 | FP8 E5M2 |
|------|----------|----------|
| **用途** | 前向计算（精度更高） | 反向计算（范围更大） |
| **优势** | 速度 +2× vs BF16 | 梯度范围更大 |
| **挑战** | 需要 per-tensor scaling | 需要 per-tensor scaling |
| **框架** | PyTorch torch.amp, TransformerEngine | H100 原生支持 |

### FP8 训练效果

| 模型 | 框架 | 精度损失 | 速度提升 |
|------|------|----------|----------|
| Llama-70B | TransformerEngine | <0.1 pt | +1.5× |
| GPT-4 级 | Megatron-LM FP8 | <0.2 pt | +1.8× |
| DeepSeek-V3 | 自研 FP8 训练 | <0.1 pt | +2× |

---

## 5. 混合精度对推理的影响

| 精度 | 推理速度 | 显存占用 | 质量损失 | 适用场景 |
|------|----------|----------|----------|----------|
| **FP32** | 基准 | 基准 | 无 | 精度敏感任务 |
| **BF16** | +1.5× | -50% | 极小 | **默认推理精度** |
| **FP16** | +1.5× | -50% | 小 | 通用推理 |
| **INT8** | +2-3× | -75% | 中 | 高吞吐推理 |
| **INT4/NF4** | +3-4× | -87% | 中-大 | 资源受限推理 |

---

## 6. AI Stack 中的混合精度

| 场景 | 精度 | 说明 |
|------|------|------|
| **A-Speed 推理** | BF16 默认 | AI Stack 加速镜像默认使用 BF16 |
| **Qwen3-Pro** | BF16 + INT8 混合 | 专有优化，性能 1.9× |
| **模型量化** | INT8/INT4 | 国产芯片量化策略 |
| **KV Cache** | BF16 | MLA 压缩后 576 维 BF16 存储 |

---

## 7. 工程最佳实践

| 关注点 | 建议 |
|--------|------|
| **训练默认** | BF16 + AMP（最稳定，无需 loss scaling） |
| **显存受限** | FP8 训练（H100+，需 TransformerEngine） |
| **推理默认** | BF16（质量损失极小） |
| **高吞吐推理** | INT8 量化 + BF16 重计算 |
| **边缘部署** | INT4/NF4 量化 |
| **梯度累积** | 小显存时用梯度累积模拟大 batch |

---

## 8. 局限与开放问题

1. **FP8 生态**：框架支持仍在成熟中，部分算子无 FP8 实现
2. **收敛性**：某些模型在 FP8 下收敛变慢或不收敛
3. **科学计算**：混合精度在科学计算中的精度保证待验证
4. **国产芯片**：BF16/FP8 在国产 GPU 上的支持和优化程度参差不齐

---

## Related

- [[_concepts/model-precision]] — 模型精度（数值精度 vs 模型准确性的概念桥梁）
- [[_concepts/model-training]] — 模型训练（混合精度的应用）
- [[_concepts/model-compression]] — 模型压缩（量化技术）
- [[_concepts/ai-hardware]] — AI 硬件（GPU 精度支持）
- [[_concepts/distributed-parallelism]] — 分布式并行（训练加速策略）
- [[_concepts/kv-cache]] — KV Cache（推理中的精度选择）
- [[07_Model_Training/Optimization/Mixed_Precision_Training]] — 混合精度训练详解
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack
