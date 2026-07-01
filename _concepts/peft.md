---
title: "PEFT 参数高效微调库 (Parameter-Efficient Fine-Tuning)"
category: -concepts
tags: ["peft", "lora", "fine-tuning", "huggingface", "adapter", "ia3"]
relationships:
  - target: "_concepts/lora-peft"
    type: related_to
  - target: "_concepts/qlora"
    type: related_to
  - target: "_concepts/bitsandbytes"
    type: related_to
  - target: "_concepts/pissa"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "PEFT 是 HuggingFace 官方的参数高效微调库——统一封装了 LoRA、Prefix Tuning、Prompt Tuning、IA³ 等主流 PEFT 方法。是大模型微调的标准入口，一行代码即可将全参微调转换为高效微调。"
provenance:
  extracted: 0.25
  inferred: 0.65
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: stable
tier: core
---

# PEFT 参数高效微调库

> **一句话理解**: PEFT 是"大模型微调的统一入口"——HuggingFace 官方库，一个 Config 切换 LoRA/Prompt Tuning/IA³ 等各种微调方法。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发者** | HuggingFace |
| **GitHub** | 18K+ ⭐ |
| **定位** | 参数高效微调的统一框架 |
| **核心价值** | 将多种 PEFT 方法统一到一个 API |
| **依赖** | PyTorch, transformers |

---

## 2. 支持的 PEFT 方法

```
┌─────────────────────────────────────────┐
│        PEFT 方法分类                    │
├─────────────────────────────────────────┤
│                                         │
│  1. 低秩适配 (Low-Rank)                │
│     ├── LoRA     — 低秩矩阵分解        │
│     ├── AdaLoRA  — 自适应秩分配        │
│     ├── PiSSA    — SVD 初始化           │
│     ├── DoRA     — 权重/方向解耦       │
│     └── rsLoRA   — 缩放增强            │
│                                         │
│  2. 提示调优 (Prompt-Based)            │
│     ├── Prompt Tuning  — 可学习前缀    │
│     ├── Prefix Tuning  — 可学习键值对  │
│     └── P-Tuning v2   — 多层提示       │
│                                         │
│  3. 适配器 (Adapter)                    │
│     ├── IA³     — 缩放激活向量         │
│     └── (S)FT   — 稀疏微调             │
│                                         │
│  4. 组合方法                            │
│     ├── LoRA + QLoRA (量化基座)        │
│     └── LoRA + 多适配器并行            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 核心 API

### 3.1 LoRA 微调

```python
from peft import LoraConfig, get_peft_model, TaskType

# 1. 定义 LoRA 配置
config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                        # 秩
    lora_alpha=32,               # 缩放因子
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    bias="none",
)

# 2. 一行代码转换模型
model = get_peft_model(base_model, config)
model.print_trainable_parameters()
# 输出: trainable params: 4,194,304 || all params: 6,742,609,920 || trainable%: 0.0622%

# 3. 正常训练（只更新 LoRA 参数）
trainer = Trainer(model=model, ...)
trainer.train()

# 4. 保存适配器（很小，几 MB）
model.save_pretrained("./lora-adapter")
```

### 3.2 其他 PEFT 方法

```python
from peft import PromptTuningConfig, IA3Config

# Prompt Tuning
pt_config = PromptTuningConfig(
    task_type=TaskType.CAUSAL_LM,
    num_virtual_tokens=20,
    prompt_tuning_init="TEXT",
    prompt_tuning_init_text="Classify the sentiment:",
    tokenizer_name_or_path="meta-llama/Llama-3-8B",
)

# IA³
ia3_config = IA3Config(
    task_type=TaskType.CAUSAL_LM,
    target_modules=["k_proj", "v_proj", "down_proj"],
    feedforward_modules=["down_proj"],
)

# 用法完全一致
model = get_peft_model(base_model, ia3_config)
```

### 3.3 多适配器管理

```python
# 添加多个适配器
model.add_adapter("coding", lora_config_coding)
model.add_adapter("chat", lora_config_chat)

# 切换适配器
model.set_adapter("coding")

# 合并适配器到基座
model = model.merge_and_unload()
```

---

## 4. 各方法显存对比

### Llama-3-8B 微调

| 方法 | 可训练参数 | 显存占用 | 效果 |
|------|:---:|:---:|:---:|
| 全参微调 | 100% | ~80 GB | 基准 |
| LoRA (r=16) | 0.06% | ~18 GB | 接近全参 |
| LoRA + QLoRA (4-bit) | 0.06% | ~8 GB | 接近全参 |
| Prompt Tuning | 0.01% | ~16 GB | 稍弱 |
| IA³ | 0.01% | ~16 GB | 接近 LoRA |

---

## 5. 与 bitsandbytes 组合

```python
from transformers import BitsAndBytesConfig

# 4-bit 量化基座 + LoRA = QLoRA
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)

# 量化基座模型
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-70B",
    quantization_config=bnb_config,
)

# 添加 LoRA 适配器
model = get_peft_model(model, LoraConfig(r=16, lora_alpha=32))

# 70B 模型在单卡 48GB GPU 上微调！
```

---

## 6. 关键要点

1. **统一 API**：所有 PEFT 方法都通过 `get_peft_model(config)` 一行代码启用
2. **HuggingFace 官方**：与 transformers 深度集成，是微调的标准入口
3. **适配器很小**：LoRA 适配器通常只有几 MB，可独立存储和加载
4. **多适配器**：同一模型可挂载多个适配器，按需切换
5. **合并部署**：`merge_and_unload()` 将适配器合并回基座模型，推理无额外开销
6. **生态丰富**：支持 PiSSA、DoRA、rsLoRA 等最新变体
