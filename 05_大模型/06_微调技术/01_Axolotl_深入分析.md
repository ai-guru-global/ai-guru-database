---
title: "Axolotl: 开源微调工具"
category: "05-nlp-llms-fine-tuning-techniques"
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: "> **一句话理解**: Axolotl 是开源微调工具——支持全参数/LoRA/QLoRA 微调、多框架兼容、分布式训练，AI 开发者微调的首选。"
created: "2026-05-31"
updated: "2026-05-31"
tier: core
aliases:
  - "Axolotl Deep Dive"
  - Axolotl_Deep_Dive
sources: []

name_zh: "Axolotl: 开源微调工具"
---
# Axolotl: 开源微调工具

> 中文简称：Axolotl: 开源微调工具

> **一句话理解**: Axolotl 是开源微调工具——支持全参数/LoRA/QLoRA 微调、多框架兼容、分布式训练，AI 开发者微调的首选。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Axolotl: 开源微调工具
═══════════════════════════════════════════════════════════════════

定位: 开源 LLM 微调工具，支持多种微调方法和分布式训练

核心理念:
───────────────────────────────────────────────────────────────────
• 多方法: 全参数/LoRA/QLoRA/Adapters
• 多框架: HuggingFace/DeepSpeed/FSDP
• 易用: YAML 配置定义训练
• 高效: 分布式训练支持
• 社区活跃: 持续迭代更新
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **全参数微调** | 完整参数更新 |
| **LoRA/QLoRA** | 高效微调 |
| **多模型** | Llama/Mistral/Qwen/Gemma |
| **分布式** | DeepSpeed/FSDP |
| **YAML 配置** | 声明式训练定义 |
| **数据格式** | Alpaca/ShareGPT |

### 1.3 支持模型

| 模型系列 | 支持 |
|------|------|
| **Llama** | Llama 2/3/3.1/3.2 |
| **Mistral** | Mistral/Mixtral |
| **Qwen** | Qwen 1.5/2 |
| **Gemma** | Gemma 2B/7B |
| **Yi** | Yi 6B/34B |
| **DeepSeek** | DeepSeek 7B/67B |

---

## 2. 核心概念

### 2.1 微调方法

```
Axolotl 微调方法
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        微调方法对比                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 全参数微调 (Full Fine-tune)                                   │
│  ───────────────────────────────────────────────────────────   │
│  更新所有参数                                                     │
│  优点: 最佳效果                                                  │
│  缺点: 显存占用大                                                │
│                                                                   │
│  2. LoRA (Low-Rank Adaptation)                                   │
│  ───────────────────────────────────────────────────────────   │
│  注入低秩矩阵                                                    │
│  优点: 显存高效，可组合                                          │
│  缺点: 效果略逊于全参数                                          │
│                                                                   │
│  3. QLoRA (Quantized LoRA)                                       │
│  ───────────────────────────────────────────────────────────   │
│  4bit 量化 + LoRA                                                │
│  优点: 极致显存效率                                              │
│  缺点: 训练速度较慢                                              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 配置结构

```yaml
# example.yaml
base_model: meta-llama/Meta-Llama-3.1-8B
model_type: LlamaForCausalLM

# 微调方法
fine_tune_type: lora

# 训练参数
batch_size: 4
gradient_accumulation_steps: 4
epochs: 3
learning_rate: 0.0002
lr_scheduler: cosine

# LoRA 配置
lora:
  r: 16
  lora_alpha: 32
  target_modules: [q_proj, v_proj]
  lora_dropout: 0.05
```

---

## 3. 架构设计

### 3.1 系统架构

```
Axolotl 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Axolotl 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              YAML Config                                   │   │
│   │  • 模型配置                                              │   │
│   │  • 训练参数                                              │   │
│   │  • 数据路径                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Axolotl Runner                              │   │
│   │  • 配置解析                                              │   │
│   │  • 数据加载                                              │   │
│   │  • 模型初始化                                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐        │
│   │ HuggingFace│       │ DeepSpeed │       │   FSDP   │        │
│   │ Trainer    │       │           │       │           │        │
│   └───────────┘       └───────────┘       └───────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install axolotl

# 或使用 Docker
docker pull winglisan/axolotl:latest
```

### 4.2 准备数据

```json
// data.jsonl
{"instruction": "翻译以下句子", "input": "Hello", "output": "你好"}
{"instruction": "翻译以下句子", "input": "World", "output": "世界"}
```

### 4.3 创建配置

```yaml
# llama3_lora.yaml
base_model: meta-llama/Meta-Llama-3.1-8B-Instruct
model_type: LlamaForCausalLM
fine_tune_type: lora

# 数据
datasets:
  - path: ./data.jsonl
    type: alpaca
dataset_prepared_path: ./prepared_data

# 训练参数
batch_size: 4
gradient_accumulation_steps: 4
epochs: 3
learning_rate: 0.0002
lr_scheduler: cosine
warmup_ratio: 0.1

# LoRA
lora_r: 16
lora_alpha: 32
lora_dropout: 0.05
lora_target_modules: [q_proj, v_proj]

# 优化
optimizer: adamw_torch
train_on_inputs: false
```

### 4.4 开始训练

```bash
# 单 GPU
axolotl train llama3_lora.yaml

# 多 GPU (DeepSpeed)
accelerate launch -m axolotl train llama3_lora.yaml --config deepspeed

# 分布式 (FSDP)
accelerate launch -m axolotl train llama3_lora.yaml --config fsdp
```

---

## 5. 高级用法

### 5.1 QLoRA 微调

```yaml
# qlora.yaml
base_model: meta-llama/Meta-Llama-3.1-8B-Instruct
model_type: LlamaForCausalLM
fine_tune_type: qlora

# QLoRA 配置
load_in_4bit: true
bnb_4bit_compute_dtype: float16
bnb_4bit_quant_type: nf4
bnb_4bit_use_double_quant: true

lora_r: 64
lora_alpha: 16
lora_dropout: 0.05
```

### 5.2 合并 LoRA 权重

```bash
# 合并 LoRA 到基础模型
axolotl export \
  --config llama3_lora.yaml \
  --merge_lora

# 导出为 HF 格式
axolotl export \
  --config llama3_lora.yaml \
  --output ./merged_model
```

### 5.3 多模态微调

```yaml
# llava_lora.yaml
base_model: llava-hf/llava-1.5-7b-hf
model_type: LlavaForConditionalGeneration

# 图像塔配置
image_square_size: 336
```

---

## 6. 对比与选择

### 6.1 微调工具对比

| 维度 | Axolotl | Unsloth | LLaMA Factory |
|------|---------|---------|---------------|
| **速度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **显存** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **功能** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **社区** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 快速实验 | Unsloth |
| 生产微调 | Axolotl |
| 功能全面 | LLaMA Factory |
| 中文优化 | LLaMA Factory |

---

## 参考资源

- [Axolotl GitHub](https://github.com/OpenAccess-AI-Collective/axolotl)
- [Axolotl 文档](https://axolotl.readthedocs.io/)
- [Axolotl 官方配置示例](https://github.com/OpenAccess-AI-Collective/axolotl/tree/main/examples)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[05_大模型/README.md|README]]
