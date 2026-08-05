---
title: "SFT（Supervised Fine-Tuning）"
category: -concepts
tags: [sft, fine-tuning, supervised-learning, instruction-tuning, llm, alignment]
aliases:
  - "SFT"
  - "Supervised Fine-Tuning"
  - "有监督微调"
  - "Instruction Tuning"
relationships:
  - target: "概念/fine-tuning-techniques"
    type: belongs_to
  - target: "概念/rlhf"
    type: precedes
  - target: "概念/dpo"
    type: precedes
  - target: "概念/lora-peft"
    type: related_to
sources:
  - 07_模型训练/Fine_tuning_Techniques/
  - 概念/lora-qlora-sft-rlhf-dpo.md
summary: "SFT（Supervised Fine-Tuning）是让预训练 LLM 学会"按指令回答"的关键步骤，用 (prompt, response) 对训练模型，是 RLHF / DPO 等对齐方法的前置阶段。"
lifecycle: reviewed
tier: core
updated: 2026-07-25
provenance:
  extracted: 0.92
  inferred: 0.06
  ambiguous: 0.02
base_confidence: 0.95
created: 2026-06-24
updated: 2026-06-24
name_zh: "监督微调"
---

# SFT（Supervised Fine-Tuning）

> 中文简称：监督微调

## 核心要点

- **定义**：用高质量 (prompt, response) 数据对，在预训练 LLM 基础上进一步训练。
- **目标**：让模型学会"按指令回答"，而非仅做"next-token 续写"。
- **数据格式**：
  ```json
  {"messages": [
    {"role": "system", "content": "你是一个助手"},
    {"role": "user", "content": "什么是 Transformer？"},
    {"role": "assistant", "content": "Transformer 是..."}
  ]}
  ```
- **核心变种**：
  - **指令微调（Instruction Tuning）**：基础 SFT
  - **对话微调（Chat Tuning）**：多轮对话
  - **Code SFT**：代码生成专项
  - **Multilingual SFT**：多语言
  - **Tool-use SFT**：工具调用
- **代表应用**：ChatGPT、Llama 2-Chat、Qwen-Chat、DeepSeek-Chat

## 一句话解释

> SFT = "教 LLM 听懂指令"；用人工写的 (问题, 回答) 对训练，让模型从"续写机器"变成"对话助手"。

## SFT 在 LLM 训练全流程中的位置

```
Pretrain (基础模型)
   ↓
SFT (指令微调) ← 第一阶段：教模型"听话"
   ↓
RLHF / DPO (对齐) ← 第二阶段：教模型"讨喜"
   ↓
最终 Chat Model
```

## 数据准备规范

| 维度 | 标准 |
|------|------|
| **总量** | ≥ 10K 条（基础），≥ 100K 条（生产级） |
| **多样性** | 覆盖 ≥ 5 类任务、≥ 3 种长度 |
| **准确性** | 人工审核或 GPT-4 评分 ≥ 4/5 |
| **去重** | 语义去重（embedding 相似度 < 0.85）|
| **长度分布** | 中位数 200-500 token |
| **语言比例** | 与目标用户群匹配 |

## 典型训练流程

```python
# HuggingFace Transformers + TRL
from trl import SFTTrainer, SFTConfig
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-7B")
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-7B")

config = SFTConfig(
    output_dir="./qwen2.5-7b-sft",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,    # 等效 batch 16
    learning_rate=2e-5,
    bf16=True,
    max_seq_length=2048,
    warmup_ratio=0.03,
)

trainer = SFTTrainer(
    model=model,
    args=config,
    train_dataset=dataset,        # chat-formatted data
    tokenizer=tokenizer,
    peft_config=lora_config,      # 可选 LoRA
)

trainer.train()
```

```bash
# LLaMA-Factory 一行命令
llamafactory-cli train \
  --stage sft \
  --model_name_or_path Qwen/Qwen2.5-7B \
  --dataset alpaca_zh,alpaca_en \
  --template qwen \
  --output_dir ./qwen2.5-7b-sft \
  --num_train_epochs 3 \
  --learning_rate 2e-5
```

## 关键超参

| 超参 | 推荐值 | 说明 |
|------|--------|------|
| `learning_rate` | 1e-5 ~ 5e-5 | 比预训练低 1-2 数量级 |
| `batch_size` | 32-128 (global) | 取决于 GPU 数量 |
| `epochs` | 2-3 | 太多易过拟合 |
| `max_seq_length` | 2048-4096 | 根据数据调整 |
| `warmup_ratio` | 0.03-0.1 | 稳定收敛 |
| `weight_decay` | 0.0-0.01 | 通常 0 |

## 与 RLHF/DPO 的对比

| 维度 | SFT | RLHF | DPO |
|------|-----|------|-----|
| 数据 | (prompt, response) | (prompt, chosen, rejected) | (prompt, chosen, rejected) |
| 训练目标 | Cross-Entropy | PPO + KL 惩罚 | Sigmoid Loss |
| 需要 RM | ❌ | ✅ | ❌ |
| 显存 | 1x | 4x | 2x |
| 训练速度 | 快 | 慢 | 中 |
| 稳定性 | 高 | 中 | 高 |
| 效果上限 | 中 | 高 | 中-高 |

## 何时使用

✅ **推荐**：
- 任何 LLM 应用的第一步
- 让模型学会遵循指令
- 基础对话能力构建
- 任务专项微调（代码 / 数学 / 法律）

⚠️ **不推荐**：
- 跳过 SFT 直接 RLHF/DPO（会崩）
- 数据质量差（会放大错误）
- 过多样本 / epoch（过拟合）

## 常见陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| 学习率过大 | Loss 震荡 | 降到 1e-5，配合 warmup |
| 数据质量差 | 输出混乱 | 严格清洗 + 人工审核 |
| 灾难性遗忘 | 微调后通用能力丧失 | 混入通用数据 + KL 正则 |
| 过拟合 | 训练好测试差 | 早停 + dropout + 数据增强 |
| 长度不匹配 | 截断或 OOM | 选合适 max_seq_length |

## 源码级洞察（基于 LLaMA-Factory v0.9.5 归档源码）

> 证据位于 `code/llm-frameworks/LLaMA-Factory-v0.9.5/src/llamafactory/`：

- **SFT 流水线实体**：`run_sft()`（`train/sft/workflow.py` L41）——加模型→套模板→建 Trainer，由 `run_exp()`（`train/tuner.py` L139）按 `stage: sft` 分发。
- **数据模板是第一道门**：`Template`（`data/template.py` L41）+ `get_template_and_fix_tokenizer()`（L628）把原始问答对渲染成各模型专属 chat 格式——模板选错是 SFT 效果差的头号原因。
- **与 LoRA 的接头**：`init_adapter()`（`model/adapter.py` L293）在 SFT 前把基座包装成 peft 模型。详见 [[05_大模型/07_微调技术/06_LLaMA_Factory_深入分析|LLaMA-Factory 深度解析]]。

---

## Related

- [[概念/llm-training-checklist]] — LLM 训练检查清单
- [[概念/lora-qlora-sft-rlhf-dpo]] — LoRA + SFT 综合
- [[概念/rlhf]] — RLHF（SFT 后阶段）
- [[概念/dpo]] — DPO（SFT 后阶段）
- [[概念/fine-tuning-techniques]] — 微调技术
- [[概念/lora-peft]] — LoRA / PEFT
- [[概念/pre-training]] — 预训练（SFT 前置阶段）
- [[05_大模型/07_微调技术/03_微调技术]] — 微调章节

---

## 2026 SFT 生态

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **TRL** | HuggingFace 原生 | 通用场景 |
| **LLaMA-Factory** | 中文友好、可视化 | 快速上手 |
| **Unsloth** | 2-5x 加速 | 追求速度 |
| **SWIFT** | 阿里开源 | 国产生态 |

## 生产最佳实践

1. **数据质量**：高质量指令数据 > 数据数量
2. **学习率**：从 2e-5 开始，根据模型调整
3. **防止过拟合**：早停 + dropout + 数据增强
4. **灾难性遗忘**：混入通用数据 + KL 正则
5. **评估体系**：建立任务特定评估基准