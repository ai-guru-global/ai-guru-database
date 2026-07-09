---
title: "NF4（4-bit NormalFloat Quantization）"
category: -concepts
tags: [nf4, quantization, bitsandbytes, 4-bit, llm-inference]
aliases:
  - "NF4"
  - "4-bit NormalFloat"
  - "NormalFloat 4-bit"
relationships:
  - target: "_concepts/quantization"
    type: belongs_to
  - target: "_concepts/model-compression"
    type: belongs_to
  - target: "_concepts/awq"
    type: alternative
sources:
  - 部署推理/Quantization/
summary: "NF4（4-bit NormalFloat）是 bitsandbytes 库提出的 4-bit 数据类型，针对正态分布权重做了优化设计；QLoRA 用 NF4 实现单卡 24GB 量化微调 65B 模型。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-06-24
---

# NF4（4-bit NormalFloat Quantization）

## 核心要点

- **提出**：bitsandbytes 库 + QLoRA 论文（Dettmers et al., 2023-05）
- **核心思想**：LLM 权重近似正态分布；NF4 用 **16 个分位数** 对正态分布进行最优分割，比均匀 INT4 更精确。
- **代表应用**：
  - **QLoRA**：单卡 24GB 微调 65B 模型
  - **bitsandbytes**：通用 4-bit 加载
  - HuggingFace Transformers 原生集成

## 一句话解释

> NF4 = "为正态分布量身定制的 4-bit 数字"；用信息论最优分位点量化，比 INT4 更准，是 QLoRA 的基石。

## INT4 vs NF4

```
INT4（均匀分布）        NF4（正态分布最优）
   16 等距值              16 个分位数（按信息密度分布）
       │                       │
       │  -8 -7 ... 0 ... 7    │  在 0 附近密集
       │                       │  在 ±3σ 之外稀疏
       │                       │
   信息损失：              信息损失：
   极端值浪费             最优利用每 1 bit
```

## 典型使用（QLoRA）

```python
from transformers import BitsAndBytesConfig, AutoModelForCausalLM
import torch

# NF4 配置（4-bit 量化）
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",           # 关键：NF4 数据类型
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,     # 嵌套量化（再省 0.4 bit/param）
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    quantization_config=bnb_config,
    device_map="auto",
)

# 配合 LoRA 训练
from peft import LoraConfig, get_peft_model
peft_config = LoraConfig(r=16, lora_alpha=32, target_modules="all-linear")
model = get_peft_model(model, peft_config)
# 现在可以用 24GB 显存微调 7B 模型！
```

## 关键参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| `quant_type` | `"nf4"` | 关键：选 NF4 |
| `compute_dtype` | `bfloat16` | 计算精度（bf16 > fp16）|
| `use_double_quant` | `True` | 嵌套量化（额外省 0.4 bit）|
| `load_in_4bit` | `True` | 4-bit 模式 |

## 显存节省

| 模型 | FP16 | NF4 4-bit | 节省 |
|------|------|-----------|------|
| 7B | 14 GB | ~4 GB | 3.5x |
| 13B | 26 GB | ~7 GB | 3.7x |
| 65B | 130 GB | ~35 GB | 3.7x |
| 70B | 140 GB | ~40 GB | 3.5x |

> QLoRA + NF4 让 **65B 模型可在单卡 24GB（如 RTX 4090）上微调**！

## QLoRA 三大组件

```
QLoRA = NF4 量化 + 双重量化 + 分页优化器
         ↓                ↓                ↓
       4-bit 存储    额外节省 ~0.4 bit   防止 OOM
         ↓
       + LoRA adapter（仅训练这部分 FP16 参数）
         ↓
       显存占用 ~1/3 FP16 LoRA
```

## 何时使用

✅ **推荐**：
- **单卡 / 消费级 GPU 显存受限**（24-48GB）
- 想微调大模型（13B-70B）
- 快速实验（无需校准数据，直接加载）
- HuggingFace 生态项目

⚠️ **不推荐**：
- 生产推理（用 AWQ / GPTQ 更优）
- 模型 < 3B（INT8 已足够）
- 极端精度要求（损失 ~1%）

## 主流生态

- **bitsandbytes**：参考实现
- **HuggingFace Transformers**：原生集成
- **QLoRA**：代表应用
- **PEFT**：配合 LoRA 使用
- **Unsloth**：进一步优化（2-5x 加速）

## Related

- [[_concepts/awq]] — AWQ（生产推理首选）
- [[_concepts/gptq]] — GPTQ（学术首选）
- [[_concepts/quantization]] — 量化总览
- [[_concepts/lora-peft]] — LoRA / PEFT
- [[_concepts/model-compression]] — 模型压缩