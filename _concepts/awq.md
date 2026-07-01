---
title: "AWQ（Activation-aware Weight Quantization）"
category: -concepts
tags: [awq, quantization, llm-inference, low-bit, gptq, model-compression]
aliases:
  - "AWQ"
  - "Activation-aware Weight Quantization"
  - "激活感知权重量化"
relationships:
  - target: "_concepts/quantization"
    type: belongs_to
  - target: "_concepts/model-compression"
    type: belongs_to
  - target: "_concepts/gptq"
    type: alternative
  - target: "_concepts/llm-inference"
    type: applied_in
sources:
  - 10_Deployment_Inference/Quantization/
summary: "AWQ（Activation-aware Weight Quantization）是 MIT 韩松团队 2023 年提出的 LLM INT4 量化方法，通过保护"显著权重"（基于激活分布）实现 4-bit 量化下接近 FP16 的精度，是 GPTQ 的主要替代方案。"
lifecycle: stable
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-06-24
---

# AWQ（Activation-aware Weight Quantization）

## 核心要点

- **提出者**：MIT 韩松团队（2023-06，论文 "AWQ: Activation-aware Weight Quantization"）
- **核心思想**：
  - 观察到 LLM 中**少数权重（1-3%）**对推理结果影响巨大
  - 这些"显著权重"可通过观察激活分布识别
  - 量化时**保护显著权重**用更高精度，其他用 INT4
- **优势**：
  - **INT4 量化接近 FP16 精度**（损失 < 1%）
  - 显存减少 3-4 倍
  - 推理速度提升 1.5-2x（消费级 GPU）
  - 无需训练 / 反向传播（GPTQ 需要）
- **代表应用**：TinyChat、TensorRT-LLM、vLLM、Mistral / Llama 2/3 / Qwen 量化版本

## 一句话解释

> AWQ = "智能保护重要权重的 INT4 量化"；找出 LLM 中的"关键少数"权重保留精度，其余全砍到 4-bit。

## 与其他量化方法对比

| 方法 | 比特 | 精度损失 | 速度 | 训练需求 | 适用 |
|------|------|---------|------|---------|------|
| **FP16** | 16 | 0% | 基线 | ❌ | 基线 |
| **INT8** | 8 | < 0.5% | 1.5-2x | ❌ | 显存节省 |
| **GPTQ** | 4 | < 1% | 2-3x | ✅（校准）| 极致压缩 |
| **AWQ** | 4 | < 1% | **2-3x** | ❌ | **生产首选** |
| **bitsandbytes NF4** | 4 | < 2% | 2-3x | ❌ | 快速部署 |
| **SmoothQuant** | 8 | < 1% | 2x | ✅ | 激活难量化场景 |
| **GGUF (Q4_K_M)** | 4-5 | < 2% | 慢 | ❌ | CPU/边缘 |

## 工作原理

```
1. 校准：用小批量真实数据跑一遍模型，记录激活分布
2. 识别显著权重：
   - 计算每个 channel 的激活 magnitude
   - top-1% channel 对应的权重 = 显著权重
3. 缩放保护：
   - 对显著权重所在 channel 乘以 s = mean(|激活|) / max(|激活|)
   - 让显著权重的数值范围更大（量化误差相对更小）
4. INT4 量化所有权重
5. 反缩放恢复：推理时除以 s
```

## 典型使用

```python
# AutoAWQ（最常用）
from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer

model_path = "Qwen/Qwen2.5-7B-Instruct"
quant_path = "qwen2.5-7b-awq"

# 加载模型
model = AutoAWQForCausalLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

# 量化配置
quant_config = {
    "zero_point": True,        # 对称/非对称
    "q_group_size": 128,        # group size
    "w_bit": 4,                 # 目标比特
    "version": "GEMM"           # GEMM / GEMV
}

# 校准 + 量化
model.quantize(tokenizer, quant_config=quant_config,
                calib_data="calib.json")

# 保存
model.save_quantized(quant_path)
tokenizer.save_pretrained(quant_path)
```

```python
# vLLM 加载 AWQ 模型（生产推荐）
from vllm import LLM, SamplingParams

llm = LLM(
    model="qwen2.5-7b-awq",
    quantization="awq",
    gpu_memory_utilization=0.9,
)
```

## 何时使用

✅ **推荐**：
- 7B-70B 模型部署到消费级 GPU（24GB / 48GB）
- 显存受限但需要接近 FP16 精度
- 生产 LLM 服务（无需训练数据）

⚠️ **不推荐**：
- 模型 < 3B（INT8 已经够）
- 训练场景（量化会损失训练稳定性）
- 极致精度要求（FP8 + 量化感知训练）

## 性能基准

| 模型 | FP16 (GB) | AWQ INT4 (GB) | 显存节省 | 精度损失 |
|------|-----------|---------------|---------|---------|
| Llama-2-7B | 13.5 | 4.5 | 3x | < 1% |
| Llama-2-13B | 26 | 8.5 | 3x | < 1% |
| Llama-2-70B | 140 | 40 | 3.5x | < 1.5% |
| Qwen2.5-7B | 15 | 5 | 3x | < 0.5% |
| Qwen2.5-72B | 145 | 45 | 3.2x | < 1% |

## 主流生态支持

- **AutoAWQ**：参考实现（MIT）
- **vLLM**：原生支持 AWQ
- **TensorRT-LLM**：原生支持
- **TGI**：支持
- **llama.cpp**：支持 AWQ 格式转换
- **SGLang**：支持

## Related

- [[_concepts/gptq]] — GPTQ（AWQ 主要替代）
- [[_concepts/quantization]] — 量化总览
- [[_concepts/model-compression]] — 模型压缩
- [[10_Deployment_Inference/Quantization]] — 量化章节- [[_concepts/pruning]] — 剪枝
