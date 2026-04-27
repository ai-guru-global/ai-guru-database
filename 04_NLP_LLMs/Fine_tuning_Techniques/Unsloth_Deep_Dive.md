# Unsloth: 快速 LLM 微调框架

> **一句话理解**: Unsloth 让大模型微调快 2-5 倍、显存减半——使用优化过的反向传播和量化，在消费级 GPU 上也能微调 70B 模型。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [优化技术](#5-优化技术)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Unsloth: 快速 LLM 微调
═══════════════════════════════════════════════════════════════════

定位: 加速 LLM 微调的开源框架，比传统方法快 2-5 倍

核心理念:
───────────────────────────────────────────────────────────────────
• 速度提升: 2-5 倍训练加速
• 显存优化: 减少 50-60% 显存使用
• 精度保持: 与全量训练精度相当
• 易用性: 几行代码即可开始
• 免费: 开源 MIT 许可证
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **反向传播优化** | 手写 CUDA kernel，提升速度 |
| **动态量化** | 训练时量化，减少显存 |
| **梯度检查点** | 节省显存，略微增加时间 |
| **Flash Attention** | 优化 Attention 计算 |
| **多 GPU 支持** | 数据并行和模型并行 |
| **模板支持** | Llama、Mistral、Qwen 等 |

### 1.3 性能对比

| 模型 | 原始显存 | Unsloth 显存 | 加速比 |
|------|----------|--------------|--------|
| Llama 7B | 28GB | 14GB | 2x |
| Llama 13B | 56GB | 28GB | 2x |
| Llama 70B | 280GB | 140GB | 2x |
| Mistral 7B | 28GB | 12GB | 2.3x |

---

## 2. 核心概念

### 2.1 优化原理

```
传统 PyTorch vs Unsloth
═══════════════════════════════════════════════════════════════════

传统 PyTorch:
───────────────────────────────────────────────────────────────────
for batch in dataloader:
    outputs = model(batch)  # FP16, 显存占用大
    loss = criterion(outputs, target)
    loss.backward()        # 反向传播，创建梯度
    optimizer.step()       # 更新权重，显存再次增加
    optimizer.zero_grad()

Unsloth:
───────────────────────────────────────────────────────────────────
for batch in dataloader:
    outputs = model(batch)  # BF16 + 混合精度
    loss = criterion(outputs, target)
    loss.backward()         # 手写反向传播，更高效
    optimizer.step()        # BF16 更新，显存节省
    optimizer.zero_grad()

关键差异:
• 手写 CUDA 反向传播 kernel
• 动态量化感知训练
• 梯度分页
```

### 2.2 支持的模型

| 模型 | 支持 | 优化程度 |
|------|------|----------|
| **Llama 2/3** | ✅ | 4-bit, 8-bit |
| **Mistral** | ✅ | 4-bit, 8-bit |
| **Qwen 2** | ✅ | 4-bit, 8-bit |
| **DeepSeek** | ✅ | 4-bit, 8-bit |
| **Gemma** | ✅ | 4-bit, 8-bit |
| **Phi-3** | ✅ | 4-bit, 8-bit |

---

## 3. 架构设计

### 3.1 系统架构

```
Unsloth 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Unsloth 架构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   用户代码 (几行)                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  from unsloth import FastLanguageModel                   │   │
│   │  model, tokenizer = FastLanguageModel.from_pretrained   │   │
│   │  model = FastLanguageModel.get_peft_model(...)          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Unsloth Core (优化引擎)                     │   │
│   │  ┌────────────────────────────────────────────────────┐  │   │
│   │  │  手写 CUDA Kernels (反向传播)                      │  │   │
│   │  │  动态量化 (QLoRA)                                  │  │   │
│   │  │  梯度分页 (Gradient Checkpointing)                 │  │   │
│   │  │  Flash Attention v2                                │  │   │
│   │  └────────────────────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              底层优化                                     │   │
│   │  ├── 自定义反向传播                                       │   │
│   │  ├── BF16/FP16 混合精度                                 │   │
│   │  └── 4-bit 量化权重                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 安装 Unsloth
pip install unsloth

# 同时安装相关依赖
pip install unsloth[cu121]  # CUDA 12.1
# 或
pip install unsloth[cu118]  # CUDA 11.8
```

### 4.2 基础微调

```python
from unsloth import FastLanguageModel
import torch

# 加载模型 (4-bit)
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/llama-3-8b-bnb-4bit",  # 或本地路径
    max_seq_length = 2048,
    dtype = torch.bfloat16,
    load_in_4bit = True,
)

# 添加 LoRA 适配器
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,  # LoRA rank
    target_modules = ["q_proj", "v_proj"],
    lora_alpha = 16,
    dropout = 0.05,
    bias = "none",
    use_gradient_checkpointing = "unsloth",
)

# 准备数据
from datasets import load_dataset
dataset = load_dataset("json", data_files="train.jsonl", split="train")

def formatting_func(example):
    text = f"问: {example['question']}\n答: {example['answer']}"
    return [tokenizer(text, truncation=True, max_length=512)]

dataset = dataset.map(formatting_func, batched=True)

# 训练
from unsloth import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset,
    dataset_text_field = "text",
    max_seq_length = 512,
    dataset_num_proc = 4,
    packing = True,
    args = TrainingArguments(
        per_device_train_batch_size = 4,
        gradient_accumulation_steps = 4,
        warmup_steps = 10,
        max_steps = 100,
        learning_rate = 2e-4,
        fp16 = not torch.cuda.is_bf16_supported(),
        bf16 = torch.cuda.is_bf16_supported(),
        logging_steps = 10,
        optim = "adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "linear",
    ),
)

trainer.train()
```

### 4.3 推理

```python
from unsloth import FastLanguageModel

# 加载微调后的模型
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "./my-finetuned-model",
    max_seq_length = 2048,
)

FastLanguageModel.for_inference(model)

# 推理
messages = [{"role": "user", "content": "解释量子纠缠"}]
inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt = True,
    tokenize = True,
    return_tensors = "pt",
).to("cuda")

outputs = model.generate(
    input_ids = inputs,
    max_new_tokens = 256,
    use_cache = True,
    temperature = 0.7,
    top_p = 0.9,
)

result = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(result)
```

---

## 5. 优化技术

### 5.1 手写 CUDA 反向传播

```python
# Unsloth 使用手写反向传播代替 PyTorch autograd
# 这可以：
# 1. 避免存储中间激活值
# 2. 融合操作减少内存访问
# 3. 使用 BF16 加速计算

# 普通 PyTorch 反向传播
loss.backward()  # 需要存储所有中间激活

# Unsloth 反向传播
grad_output = compute_grad_output(loss)
input_grad = custom_backward(input, grad_output)  # 不需要存储中间激活
```

### 5.2 量化配置

```python
# 4-bit 量化配置
model = FastLanguageModel.from_pretrained(
    model_name = "llama-3-8b",
    load_in_4bit = True,
    bnb_4bit_compute_dtype = torch.bfloat16,
    bnb_4bit_quant_type = "nf4",  # Normal Float 4
    bnb_4bit_use_double_quant = True,  # 双重量化
)
```

### 5.3 梯度检查点

```python
# 启用梯度检查点
model = FastLanguageModel.get_peft_model(
    model,
    use_gradient_checkpointing = "unsloth",  # Unsloth 优化版本
)
```

---

## 6. 对比与选择

### 6.1 与其他微调框架对比

| 维度 | Unsloth | Axonn | 传统 LoRA |
|------|---------|-------|-----------|
| **速度** | 2-5x | 1.5-2x | 1x |
| **显存** | -50% | -30% | 基准 |
| **精度** | 持平 | 持平 | 基准 |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **成本** | 免费 | 免费 | 免费 |

### 6.2 适用场景

**✅ Unsloth 最佳场景:**
- 个人开发者微调
- 消费级 GPU (24GB)
- 快速实验迭代
- 资源有限的团队

**❌ 不适合场景:**
- 超大规模预训练
- 需要极致精度
- 企业级完整 MLOps

---

## 参考资源

- [Unsloth GitHub](https://github.com/unslothai/unsloth)
- [Unsloth 文档](https://unsloth.ai/)
- [Unsloth 模型库](https://huggingface.co/unsloth)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*