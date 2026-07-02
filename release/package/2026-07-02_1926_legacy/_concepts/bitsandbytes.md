---
title: "bitsandbytes 量化优化库 (bitsandbytes Quantization Library)"
category: -concepts
tags: ["bitsandbytes", "quantization", "8bit", "4bit", "adam8bit", "memory-optimization"]
relationships:
  - target: "_concepts/qlora"
    type: related_to
  - target: "_concepts/llm-quantization"
    type: related_to
  - target: "_concepts/peft"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "bitsandbytes 是 HuggingFace 旗下的 GPU 量化优化库——提供 8-bit 优化器（Adam8bit）、4-bit 量化（NF4/FP4）和 LLM.int8() 推理。是 QLoRA 微调的底层引擎，让大模型训练和推理在消费级 GPU 上成为可能。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: stable
tier: core
---

# bitsandbytes 量化优化库

> **一句话理解**: bitsandbytes 是"让大模型塞进小显卡的魔法师"——8-bit 优化器省一半显存，4-bit 量化省 75% 显存，QLoRA 的底层核心。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发者** | Tim Dettmers → HuggingFace |
| **语言** | Python + CUDA C++ |
| **GitHub** | 8K+ ⭐ |
| **核心功能** | 量化优化器 + 量化线性层 |
| **定位** | GPU 内存优化的瑞士军刀 |

---

## 2. 三大核心功能

### 2.1 8-bit 优化器

```
传统 Adam: FP32 状态（每个参数 8 字节状态）
Adam8bit:  INT8 状态（每个参数 2 字节状态）

显存节省: 优化器状态减少 75%
效果: 几乎无损失
```

```python
import bitsandbytes as bnb

# 直接替换 torch.optim.Adam
optimizer = bnb.optim.Adam8bit(model.parameters(), lr=1e-4)

# 也支持其他优化器
optimizer = bnb.optim.Lion8bit(model.parameters(), lr=1e-4)
optimizer = bnb.optim.PagedAdam8bit(model.parameters(), lr=1e-4)
```

### 2.2 LLM.int8() 推理

```
核心思想:
  - 大多数权重用 INT8 量化
  - 离群值（outlier）保留 FP16
  - 混合精度矩阵乘法

效果:
  - 推理显存减半
  - 精度几乎无损失
  - 速度可能稍慢（解码开销）
```

```python
from transformers import AutoModelForCausalLM

# 一行代码启用 int8 推理
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-70B",
    load_in_8bit=True,  # bitsandbytes int8
    device_map="auto"
)
```

### 2.3 4-bit 量化（NF4 / FP4）

```
NF4 (NormalFloat4):
  - 专为正态分布权重设计
  - 信息论最优的 4-bit 量化
  - QLoRA 的核心技术

FP4 (Float4):
  - 通用浮点 4-bit 量化
  - 适用于非正态分布场景

显存节省: ~75%（vs FP16）
```

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",          # NormalFloat4
    bnb_4bit_compute_dtype=torch.bfloat16,  # 计算精度
    bnb_4bit_use_double_quant=True,      # 嵌套量化
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-70B",
    quantization_config=bnb_config,
    device_map="auto"
)
```

---

## 3. 显存对比

### 70B 模型（Llama-3-70B）

| 配置 | 模型权重 | 优化器状态 | 总显存 | GPU 需求 |
|------|---------|-----------|-------|---------|
| FP16 全量 | 140 GB | 560 GB | 700+ GB | 8×A100 80GB |
| FP16 + Adam8bit | 140 GB | 140 GB | 280+ GB | 4×A100 80GB |
| INT8 推理 | 70 GB | — | 70+ GB | 1×A100 80GB |
| NF4 + QLoRA | 35 GB | ~1 GB | 36+ GB | 1×A100 40GB |
| NF4 推理 | 35 GB | — | 35+ GB | 1×RTX 4090 24GB |

---

## 4. NF4 原理

```
NormalFloat4 量化:
  
  假设预训练权重 ~ N(0, σ²)
  
  1. 计算理论最优的 4-bit 量化分位点
     （基于正态分布的 CDF）
  
  2. 16 个量化级别:
     [-1.0, -0.6962, -0.5251, -0.3949,
      -0.2844, -0.1848, -0.0911, 0.0,
       0.0796, 0.1609, 0.2461, 0.3379,
       0.4407, 0.5626, 0.7230, 1.0]
  
  3. 每个权重映射到最近的分位点
  4. 反量化时用分位点值 × scale 恢复
```

| 量化类型 | 假设分布 | 最优性 |
|---------|---------|-------|
| INT4 | 均匀分布 | 非最优 |
| FP4 | 通用 | 较好 |
| **NF4** | 正态分布 | **信息论最优** |

---

## 5. 在 QLoRA 中的角色

```
┌─────────────────────────────────────────┐
│          QLoRA 技术栈                    │
├─────────────────────────────────────────┤
│                                         │
│  bitsandbytes (NF4 量化)                │
│    ↓ 基座模型 4-bit 存储                │
│  PEFT / LoRA (适配器)                   │
│    ↓ 训练时仅更新 LoRA 参数             │
│  Adam8bit (优化器)                      │
│    ↓ 优化器状态也量化                   │
│  Double Quantization (嵌套量化)         │
│    ↓ 量化常数再量化                     │
│                                         │
│  结果: 65B 模型 → 单卡 48GB GPU        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. Paged 优化器

```python
# PagedAdam8bit - 使用 NVIDIA 统一内存特性
# 当 GPU 显存不足时自动 offload 到 CPU
optimizer = bnb.optim.PagedAdam8bit(
    model.parameters(), 
    lr=1e-4,
    # 长序列导致 OOM 时自动分页到 CPU
)
```

| 特性 | 普通 Adam8bit | PagedAdam8bit |
|------|:---:|:---:|
| 显存效率 | 高 | 更高 |
| OOM 防护 | 无 | 自动 offload |
| 速度 | 快 | 稍慢（offload 时） |

---

## 7. 关键要点

1. **QLoRA 的基石**：没有 bitsandbytes 的 NF4 量化，QLoRA 无法实现
2. **三管齐下**：8-bit 优化器 + INT8 推理 + NF4 量化，全方位省显存
3. **NF4 是创新**：利用权重正态分布特性做信息论最优量化
4. **一行代码**：`load_in_4bit=True` 即可启用，与 HuggingFace 深度集成
5. **消费级 GPU 可能**：70B 模型推理可在 RTX 4090 上运行
6. **HuggingFace 官方**：已被 HuggingFace 收购并集成到 transformers 中
