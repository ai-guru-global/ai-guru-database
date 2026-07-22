---
title: Quantization
category: -concepts
tags: [inference, quantization, fp8, int8, int4, model-compression, performance, gptq, awq]
relationships:
  - target: "概念/Inference/model-compression"
    type: builds_on
  - target: "概念/Inference/kv-cache"
    type: optimizes
  - target: "概念/Inference/tensorrt"
    type: used_by
  - target: "部署推理/Quantization/Quantization_Techniques_2026"
    type: deepened_by
sources:
  - 部署推理/Inference_Performance/Inference_Terms_for_dummy.md
  - "https://arxiv.org/abs/2210.17323"  # GPTQ
  - "https://arxiv.org/abs/2306.00978"  # AWQ
summary: 量化通过降低模型权重和激活的数值精度，减少显存占用和数据搬运量，从而加速推理；常用 FP8/INT8/INT4/GPTQ/AWQ。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-07-21
aliases:
  - Quantization
  - "模型量化"
  - "LLM Quantization"

---
# Quantization（量化）

> 量化通过降低权重和激活的数值精度，减少显存占用和带宽消耗，从而加速推理。

## 大白话

量化就是**把模型参数的精度降低**。

- FP16：每个数用 16 位存，像高清图。
- INT8：每个数用 8 位存，像普通图。
- INT4：每个数用 4 位存，像压缩图。

精度越低，模型越小、加载越快、显存占用越少、读写越快；但质量可能略微下降。

## 量化类型全景

| 类型 | 精度 | 压缩比 | 精度损失 | 硬件要求 | 典型方法 |
|------|------|--------|----------|----------|----------|
| **FP16** | 16-bit 浮点 | 2× (vs FP32) | 几乎无 | 所有 GPU | 默认推理精度 |
| **BF16** | 16-bit 脑浮点 | 2× | 几乎无 | Ampere+ | 训练+推理 |
| **FP8** | 8-bit 浮点 | 4× | 极小 | H100+ | E4M3/E5M2 |
| **INT8** | 8-bit 整数 | 4× | 小 | 所有 GPU | SmoothQuant |
| **INT4** | 4-bit 整数 | 8× | 中 | 所有 GPU | GPTQ/AWQ |
| **INT2/3** | 2-3 bit | 12-16× | 大 | 研究阶段 | QuIP# |

## 权重量化 vs 激活量化

| 维度 | 权重量化 | 激活量化 |
|------|----------|----------|
| 对象 | 模型参数 (W) | 中间激活值 (X) |
| 时机 | 离线（部署前） | 在线（推理时） |
| 难度 | 低（分布稳定） | 高（分布动态、有 outlier） |
| 典型方法 | GPTQ, AWQ | SmoothQuant, FP8 |
| 效果 | 减少显存 + 加载时间 | 减少计算量 + 带宽 |

## 主流量化方法对比

| 方法 | 位宽 | 原理 | 校准数据 | 精度保持 | 速度提升 |
|------|------|------|----------|----------|----------|
| **GPTQ** | 4/3-bit | 二阶信息逐层量化 | 128样本 | 良好 | 2-3× |
| **AWQ** | 4-bit | 保护显著权重通道 | 少量样本 | 优秀 | 2-3× |
| **SmoothQuant** | INT8 | 平滑激活 outlier | 无需 | 优秀 | 1.5-2× |
| **FP8 (H100)** | 8-bit | 硬件原生 FP8 | 无需 | 几乎无损 | 1.5-2× |
| **GGUF Q4_K_M** | 4-bit | 混合精度分组量化 | 无需 | 良好 | CPU 友好 |
| **AQLM** | 2-bit | 加性量化 | 校准集 | 中等 | 3-4× |

## 量化对显存的影响

| 模型 | FP16 显存 | INT8 显存 | INT4 显存 |
|------|----------|----------|----------|
| 7B | ~14 GB | ~7 GB | ~3.5 GB |
| 13B | ~26 GB | ~13 GB | ~6.5 GB |
| 70B | ~140 GB | ~70 GB | ~35 GB |
| 405B | ~810 GB | ~405 GB | ~203 GB |

> 经验公式: 显存 ≈ 参数量 × 每参数字节数 + KV Cache + 激活缓冲

## KV Cache 量化

| 方案 | 精度 | 效果 | 支持引擎 |
|------|------|------|----------|
| FP8 KV Cache | E4M3 | 显存减半，精度几乎无损 | vLLM, TensorRT-LLM |
| INT8 KV Cache | 8-bit | 显存减半，轻微精度损失 | vLLM |
| INT4 KV Cache | 4-bit | 显存 1/4，明显精度损失 | 研究阶段 |
| KIVI | Key 2bit + Value 2bit | 极致压缩 | 研究阶段 |

## 量化实战示例

```python
# 使用 AutoGPTQ 量化
from auto_gptq import AutoGPTQForCausalLM
from transformers import AutoTokenizer

model = AutoGPTQForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B-Instruct",
    quantize_config={"bits": 4, "group_size": 128, "desc_act": True}
)
model.quantize(calibration_dataset)  # 128 条校准数据
model.save_quantized("./qwen2.5-7b-gptq-4bit")

# 使用 AutoAWQ 量化
from awq import AutoAWQForCausalLM

model = AutoAWQForCausalLM.from_pretrained("Qwen/Qwen2.5-7B-Instruct")
model.quantize(tokenizer, quant_config={"w_bit": 4, "q_group_size": 128})
model.save_quantized("./qwen2.5-7b-awq-4bit")
```

## 量化选型决策

```
硬件支持 FP8？ (H100/H200/B200)
├─ 是 → 直接用 FP8（几乎无损，最简单）
└─ 否 → 显存是否充足？
    ├─ 充足 → FP16/BF16（无精度损失）
    └─ 不足 → 需要压缩到多少？
        ├─ 50% → INT8 SmoothQuant
        └─ 75% → INT4 AWQ/GPTQ
```

## 生产最佳实践

1. **优先 FP8**: H100+ 硬件首选 FP8，几乎无精度损失且无需校准
2. **AWQ 优于 GPTQ**: 同等位宽下 AWQ 精度保持更好，推理速度相当
3. **评估先行**: 量化后必须跑 benchmark（MMLU/GSM8K）确认精度可接受
4. **KV Cache 量化**: 长上下文场景优先启用 FP8 KV Cache，显存减半
5. **避免过度压缩**: 70B+ 模型 INT4 可接受，7B 模型 INT4 精度损失明显

## Related

- [[概念/Inference/model-compression|模型压缩]]
- [[概念/Inference/kv-cache|KV Cache]]
- [[概念/Inference/tensorrt|TensorRT]]
- [[部署推理/Quantization/Quantization_Techniques_2026|Quantization Techniques 2026]]
- [[概念/Inference/inference-performance|推理性能]]

## 量化方案对比 (2026)

| 方案 | 位宽 | 质量保留 | 速度提升 | 硬件要求 | 适用 |
|------|------|---------|---------|---------|------|
| **FP8 (E4M3)** | 8-bit | ~99% | 1.5-2x | H100+ | 生产首选 |
| **INT8 (W8A8)** | 8-bit | ~98% | 1.5x | 所有 GPU | 通用 |
| **GPTQ** | 4-bit | ~95% | 2-3x | 所有 GPU | 显存受限 |
| **AWQ** | 4-bit | ~96% | 2-3x | 所有 GPU | 显存受限 |
| **GGUF Q4_K_M** | 4-bit | ~94% | 2x | CPU/GPU | 边缘 |
| **FP4** | 4-bit | ~93% | 2-3x | B200+ | 下一代 |

## 量化选型决策

```
有 H100/B200?
├── 是 → FP8 (质量最优 + 速度翻倍)
└── 否 → 显存够吗?
    ├── 够 → INT8 (W8A8)
    └── 不够 → GPTQ/AWQ INT4

边缘/CPU 部署? → GGUF Q4_K_M / Q5_K_M
```

## 生产最佳实践

1. **H100+ 必用 FP8**：质量几乎无损，速度翻倍
2. **大模型用 INT4**：70B+ 模型 INT4 质量可接受
3. **小模型谨慎**：7B 以下 INT4 损失明显，用 INT8
4. **KV Cache FP8**：长上下文场景启用 FP8 KV Cache
5. **量化后评估**：上线前用目标场景评估量化后质量

## 2026 量化技术生态

| 量化方案 | 精度 | 硬件要求 | 质量损失 | 状态 |
|----------|------|----------|----------|------|
| **FP8 (E4M3)** | 8-bit | H100/H200 | <1% | GA 主流 |
| **INT8 (W8A8)** | 8-bit | A100+ | 1-2% | GA |
| **GPTQ INT4** | 4-bit | 通用 GPU | 2-5% | GA |
| **AWQ INT4** | 4-bit | 通用 GPU | 1-3% | GA |
| **GGUF Q4_K_M** | 4-bit | CPU/GPU | 2-4% | GA |
| **INT2/FP4** | 2-4bit | 研究阶段 | 5-15% | 实验 |

## 量化代码示例

```python
# AWQ 量化 (AutoAWQ)
from awq import AutoAWQForCausalLM
model = AutoAWQForCausalLM.from_pretrained("meta-llama/Llama-3-70B")
model.quantize(tokenizer, quant_config={"w_bit": 4, "q_group_size": 128})
model.save_quantized("./llama3-70b-awq")

# vLLM 加载量化模型
from vllm import LLM
llm = LLM(model="./llama3-70b-awq", quantization="awq")
```

## 延伸阅读

- [[概念/Inference/model-formats|模型格式]] — 格式与量化关系
- [[概念/Inference/gguf|GGUF]] — 边缘量化格式
- [[概念/Inference/inference-performance|推理性能]] — 量化对性能影响
- [[概念/LLM/llama-cpp|llama.cpp]] — 本地量化推理

> ℹ️ 量化是显存优化的第一手段，H100+ 优先用 FP8，资源受限用 INT4。
