---
title: "LoRA / QLoRA / SFT / RLHF / DPO 大白话详解"
category: "05-nlp-llms-fine-tuning-techniques"
tags: ["nlp", "llm", "lora", "qlora", "sft", "rlhf", "dpo", "fine-tuning", "alignment", "peft"]
summary: "> **一句话理解**: 把大模型微调的五个核心概念串成一条线——SFT 教它说话，RLHF/DPO 教它讨人喜欢，LoRA/QLoRA 让这一切能在普通显卡上跑起来。"
created: "2026-06-16"
updated: "2026-07-25"
tier: supporting
aliases:
  - "Lora Qlora Sft Rlhf Dpo In Detail"
  - "LoRA QLoRA SFT RLHF DPO in Detail"
  - LoRA_QLoRA_SFT_RLHF_DPO_in_Detail
sources: []

name_zh: "LoRA / QLoRA / SFT / RLHF / DPO 大白话详解"
---
# LoRA / QLoRA / SFT / RLHF / DPO 大白话详解

> 中文简称：LoRA / QLoRA / SFT / RLHF / DPO 大白话详解

> **一句话理解**：训练 ChatGPT 这类模型，本质上分三步——先用 **SFT** 教会它听懂人话，再用 **RLHF/DPO** 让它回答得更讨喜，而 **LoRA/QLoRA** 是让你能用普通电脑跑完这两步的省钱技巧。

---

## 目录

1. [五个概念的关系图](#1-五个概念的关系图)
2. [SFT：先让模型会答题](#2-sft先让模型会答题)
3. [RLHF：用人类偏好打磨回答](#3-rlhf用人类偏好打磨回答)
4. [DPO：RLHF 的简化版](#4-dporlhf-的简化版)
5. [LoRA：不改课本，只贴便签](#5-lora不改课本只贴便签)
6. [QLoRA：把课本扫描成低清版](#6-qlora把课本扫描成低清版)
7. [实战流水线：QLoRA + SFT → QLoRA + DPO](#7-实战流水线qlora--sft--qlora--dpo)
8. [选型决策树](#8-选型决策树)
9. [常见误区与避坑](#9-常见误区与避坑)
10. [源码印证：这些概念在代码里长什么样](#10-源码印证这些概念在代码里长什么样)
11. [延伸阅读](#11-延伸阅读)

---

## 1. 五个概念的关系图

如果把大模型当成一个学生，这五个概念分别对应不同的教学环节：

| 概念 | 角色 | 生活类比 | 本质 |
|------|------|----------|------|
| **SFT** | 基础家教 | 给学生看例题和答案，让他学会基本答题格式 | 监督学习 |
| **RLHF** | 人类导师 | 让学生做卷子，按人类喜好打分，慢慢纠正风格 | 强化学习对齐 |
| **DPO** | 简化的导师 | 不用训练打分器，直接告诉学生"这个答案比那个好" | 直接偏好优化 |
| **LoRA** | 聪明笔记法 | 不改课本，只贴便签，用少量笔记实现专业适配 | 参数高效微调 |
| **QLoRA** | 压缩版笔记法 | 把课本扫描成低清电子版，笔记照常贴，成本再降几倍 | 量化 + LoRA |

### 1.1 整体流程

```
预训练模型（已经读过互联网，会续写文本）
    ↓
SFT: 用 (问题, 标准答案) 教会基本对话格式
    ↓
RLHF / DPO: 用人类偏好让回答更安全、更有用、更礼貌
    ↓
LoRA / QLoRA: 上述步骤的省钱实现方式
```

### 1.2 关键区分

- **SFT / RLHF / DPO** 是**训练目标或方法**，解决"教模型什么"的问题。
- **LoRA / QLoRA** 是**工程实现技巧**，解决"怎么少花钱地教"的问题。

两者可以任意组合：

| 组合 | 适用场景 |
|------|----------|
| LoRA + SFT | 最常见的轻量指令微调 |
| QLoRA + DPO | 单卡消费级 GPU 做偏好对齐 |
| 全参数 + RLHF | OpenAI 级别的大规模对齐 |
| QLoRA + SFT → QLoRA + DPO | 个人/小团队最主流路径 |

---

## 2. SFT：先让模型会答题

### 2.1 为什么需要 SFT？

预训练模型的训练目标是"预测下一个词"。你问它"什么是量子力学"，它可能会继续编故事，而不是认真回答。

**SFT 的目标**：让模型学会"看到问题，生成回答"的映射关系。

### 2.2 数据格式

SFT 数据就是成对的 `(指令, 回答)`：

```json
{
  "messages": [
    {"role": "user", "content": "什么是光合作用？"},
    {"role": "assistant", "content": "光合作用是绿色植物利用阳光、二氧化碳和水合成有机物的过程..."}
  ]
}
```

也可以写成更简单的格式：

```text
### Instruction:
什么是光合作用？

### Response:
光合作用是绿色植物利用阳光、二氧化碳和水合成有机物的过程...
```

### 2.3 训练时发生了什么？

本质上和预训练一样，都是"预测下一个词"，但区别在于：

- **预训练**：输入是任意文本，模型学习语言规律
- **SFT**：输入是"指令 + 回答"，模型学习"按指令生成回答"

损失函数仍然是交叉熵：

$$
\mathcal{L}_{\text{SFT}} = -\sum_{t} \log P(y_t | x, y_{<t})
$$

### 2.4 SFT 的局限

SFT 只能让模型"模仿"已有答案，但无法区分：

- 哪个回答更简洁？
- 哪个回答更安全？
- 哪个回答更有帮助？
- 什么时候应该拒绝回答？

这就需要 RLHF / DPO 出场了。

---

## 3. RLHF：用人类偏好打磨回答

### 3.1 为什么 SFT 不够？

想象培训客服：

- **SFT** = 给客服看优秀话术脚本，让他照着背。
- **RLHF** = 让客服上岗后，根据客户满意度评分不断调整语气和服务策略。

对于同一个问题，可能有多个合理回答。RLHF 帮助模型学会**人类更偏好的那种**。

### 3.2 三步流程

RLHF 通常包含三个阶段：

```
步骤 1：SFT
    用高质量对话数据训练一个基础 Chat 模型

步骤 2：训练奖励模型（Reward Model, RM）
    对同一个问题，收集多个回答
    让人类标注：A 比 B 好
    训练一个"打分 AI"：r(question, answer) → score

步骤 3：PPO 强化学习
    Chat 模型生成回答 → 奖励模型打分 → 用 PPO 算法优化 Chat 模型
    同时加入 KL 惩罚，防止模型偏离 SFT 模型太远
```

### 3.3 奖励模型是怎么训练的？

假设有一个问题 $x$，两个回答 $y_w$（更好）和 $y_l$（更差）。奖励模型的损失函数基于 Bradley-Terry 模型：

$$
\mathcal{L}_{\text{RM}} = -\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))
$$

简单说：让好回答的分数显著高于差回答的分数。

### 3.4 PPO 在 RLHF 中的作用

PPO（Proximal Policy Optimization）是一种"小心翼翼"的强化学习算法：

- **Clip 机制**：每次更新不会让模型行为发生剧变
- **KL 惩罚**：$R = r_\phi(x, y) - \beta \text{KL}[\pi_\theta \| \pi_{\text{ref}}]$，防止模型为了高奖励而变得离谱
- **稳定性**：适合高维离散动作空间（比如生成文本）

### 3.5 RLHF 为什么能让 ChatGPT 更讨喜？

RLHF 让模型学会三个 H 原则：

- **Helpful（有帮助）**：回答真正解决问题
- **Honest（诚实）**：不瞎编，承认不知道
- **Harmless（无害）**：拒绝有害请求

### 3.6 RLHF 的缺点

- **流程复杂**：要训练 SFT 模型、奖励模型、PPO 策略
- **显存爆炸**：PPO 阶段通常要同时加载 4 个模型
- **超参难调**：奖励尺度、KL 系数、学习率都很敏感
- **奖励黑客（Reward Hacking）**：模型可能学会讨好奖励模型，而不是真正回答好

于是 DPO 被提出来简化这一切。

---

## 4. DPO：RLHF 的简化版

### 4.1 核心洞察

DPO 的论文作者发现：其实不需要单独训练一个奖励模型，再把它当成强化学习的奖励信号。可以直接从偏好数据推导出目标函数，**一步完成对齐**。

### 4.2 数据格式

DPO 只需要偏好对数据：

```json
{
  "prompt": "如何学习编程？",
  "chosen": "建议从 Python 入门，先掌握基础语法，再通过小项目练习。推荐先理解变量、循环、函数，然后尝试写简单的脚本。",
  "rejected": "编程很简单，看两天就会了。"
}
```

### 4.3 DPO 的目标函数

DPO 直接优化策略模型 $\pi_\theta$，让它相对于参考模型 $\pi_{\text{ref}}$ 更偏好生成 $y_w$ 而不是 $y_l$：

$$
\mathcal{L}_{\text{DPO}} = -\mathbb{E}\left[\log \sigma\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]
$$

白话解释：

> 让"好回答"在当前模型下的概率，相对于参考模型显著增加；让"坏回答"的概率显著降低。

### 4.4 RLHF vs DPO 对比

| 维度 | RLHF (PPO) | DPO |
|------|-----------|-----|
| 流程阶段 | 3 阶段（SFT → RM → PPO） | 1 阶段 |
| 需要模型数 | 4 个 | 2 个（当前 + 参考） |
| 显存需求 | 极高 | 中等 |
| 训练稳定性 | 容易崩 | 稳定 |
| 效果上限 | 略高 | 大多数场景接近 RLHF |
| 实现难度 | 高 | 低 |
| 超参数量 | 多 | 少 |

### 4.5 DPO 的局限

- **数据质量要求高**：偏好数据必须准确、一致
- **容易过拟合**：可能过度拟合训练分布中的偏好
- **复杂场景**：在超长上下文或复杂推理上，RLHF 可能 still 更强

### 4.6 2026 年的新变体

- **ORPO（Odds Ratio Preference Optimization）**：把 SFT 和 DPO 合并成一步，省 50% 显存
- **KTO（Kahneman-Tversky Optimization）**：不需要成对偏好，只需要每条样本是"好"还是"坏"
- **IPO（Identity Preference Optimization）**：解决 DPO 的梯度消失问题

---

## 5. LoRA：不改课本，只贴便签

### 5.1 微调大模型有多贵？

以 Llama-3-70B 为例：

| 项目 | 全参数微调 | LoRA |
|------|-----------|------|
| 可训练参数 | 700 亿 | ~1 亿 |
| 训练显存 | ~840 GB | ~160 GB |
| 保存体积 | 140 GB | 140 MB |
| 单次训练成本 | 几万美元 | 几百美元 |

### 5.2 LoRA 核心思想

预训练权重 $W_0$ 冻结不动，只训练一个低秩增量：

$$
W = W_0 + \frac{\alpha}{r} B A
$$

其中：

- $W_0 \in \mathbb{R}^{d \times k}$：预训练权重，冻结
- $B \in \mathbb{R}^{d \times r}$，$A \in \mathbb{R}^{r \times k}$：可训练的低秩矩阵
- $r \ll \min(d, k)$：秩，通常 8-64
- $\alpha$：缩放因子，通常设为 $2r$

### 5.3 为什么低秩够用？

研究发现：微调时权重的变化量 $\Delta W$ 本质上**是低秩的**。就像人脸有几百块肌肉，但表达表情主要靠 20 块肌肉。用很小的秩就能抓住微调所需的大部分信息。

### 5.4 推理零开销

训练完后，可以把 $BA$ 合并回 $W_0$：

$$
W_{\text{final}} = W_0 + \frac{\alpha}{r} B A
$$

合并后的模型和普通模型一模一样，**推理时没有任何额外延迟**。

### 5.5 关键超参数

| 参数 | 含义 | 推荐值 |
|------|------|--------|
| `r`（秩） | 低秩维度 | 8（简单）/ 16（通用）/ 64（复杂） |
| `alpha` | 缩放因子 | 通常 2×r |
| `target_modules` | 哪些层加 LoRA | q_proj, v_proj（最小）或 all_linear（最强） |
| `dropout` | 防过拟合 | 0.05-0.1 |
| `learning_rate` | 学习率 | 1e-4 ~ 2e-4（比全参数高 10 倍） |

### 5.6 2026 年 LoRA 新变体

- **DoRA**：把权重分解为幅度和方向，只微调方向，保留预训练知识更好
- **rsLoRA**：支持高秩（>64）稳定训练
- **PiSSA**：用 SVD 初始化 LoRA 矩阵，收敛更快
- **LoftQ**：量化感知的 LoRA 初始化，QLoRA 质量更好

---

## 6. QLoRA：把课本扫描成低清版

### 6.1 QLoRA = 量化 + LoRA

QLoRA 在 LoRA 的基础上，把基础模型用 4-bit 量化：

- 基础模型权重：4-bit（NF4）
- LoRA 参数：16-bit（BF16）
- 前向传播：动态反量化到 BF16
- 反向传播：只更新 LoRA 参数

### 6.2 显存对比

| 模型 | 全参数微调 | LoRA (FP16) | QLoRA (4-bit) |
|------|-----------|-------------|---------------|
| Llama-3-8B | 80 GB | 16 GB | **6 GB** |
| Llama-3-70B | 640 GB | 160 GB | **48 GB** |
| Qwen-72B | 576 GB | 144 GB | **44 GB** |

这意味着：

- **RTX 4090（24GB）** 可以微调 7B-13B 模型
- **单张 A100（80GB）** 可以微调 70B 模型
- **MacBook Pro M3 Max（128GB 统一内存）** 也能微调 7B-13B 模型

### 6.3 QLoRA 的三大核心技术

1. **NF4 量化（Normal Float 4）**
   - 针对正态分布优化的 4-bit 表示
   - 比均匀 INT4 量化信息损失更小

2. **双量化（Double Quantization）**
   - 对量化常数本身再次量化
   - 进一步节省显存

3. **分页优化器（Paged Optimizer）**
   - GPU 显存不足时，自动把优化器状态换出到 CPU
   - 允许使用更大的 batch size

### 6.4 精度损失大吗？

NF4 量化经过专门设计，配合 LoRA 训练，效果损失通常只有 1-3%。在很多任务上，QLoRA 的效果接近甚至等同于标准 LoRA。

---

## 7. 实战流水线：QLoRA + SFT → QLoRA + DPO

这是目前个人开发者和小团队最主流的路径。

### 7.1 阶段一：QLoRA + SFT

```python
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training, TaskType
from trl import SFTTrainer
from datasets import load_dataset

# 1. 4-bit 量化配置
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

model_id = "meta-llama/Llama-3-8B"
tokenizer = AutoTokenizer.from_pretrained(model_id)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

# 2. 加载量化模型
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=bnb_config,
    device_map="auto",
    attn_implementation="flash_attention_2",
)
model = prepare_model_for_kbit_training(model)

# 3. LoRA 配置
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# 4. 加载数据集
dataset = load_dataset("json", data_files="sft_data.jsonl", split="train")

# 5. 训练参数
training_args = TrainingArguments(
    output_dir="./sft_qlora_output",
    num_train_epochs=1,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    optim="paged_adamw_8bit",
    warmup_ratio=0.03,
    lr_scheduler_type="cosine",
    bf16=True,
    gradient_checkpointing=True,
    logging_steps=10,
    save_strategy="epoch",
)

# 6. 训练
trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    tokenizer=tokenizer,
    max_seq_length=2048,
    dataset_text_field="text",
    packing=True,
)
trainer.train()
model.save_pretrained("./sft_qlora_adapter")
```

### 7.2 阶段二：QLoRA + DPO

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, PeftModel
from trl import DPOTrainer, DPOConfig
from datasets import load_dataset

# 加载 SFT 后的模型
base_model = "meta-llama/Llama-3-8B"
sft_adapter = "./sft_qlora_adapter"

model = AutoModelForCausalLM.from_pretrained(
    base_model,
    quantization_config=BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4"),
    device_map="auto",
)
model = PeftModel.from_pretrained(model, sft_adapter, is_trainable=True)

tokenizer = AutoTokenizer.from_pretrained(base_model)
tokenizer.pad_token = tokenizer.eos_token

# 偏好数据集：必须包含 prompt / chosen / rejected
dataset = load_dataset("json", data_files="dpo_data.jsonl", split="train")

# DPO 配置
dpo_args = DPOConfig(
    output_dir="./dpo_qlora_output",
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    learning_rate=5e-5,  # DPO 学习率通常比 SFT 低
    beta=0.1,  # 控制与参考模型的偏离程度
    max_length=1024,
    max_prompt_length=512,
    remove_unused_columns=False,
)

trainer = DPOTrainer(
    model=model,
    ref_model=None,  # 使用 PEFT 时可设为 None，trl 自动处理
    args=dpo_args,
    train_dataset=dataset,
    tokenizer=tokenizer,
)

trainer.train()
model.save_pretrained("./dpo_qlora_adapter")
```

### 7.3 推理：加载训练好的 Adapter

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

base_model = "meta-llama/Llama-3-8B"
model = AutoModelForCausalLM.from_pretrained(base_model, device_map="auto")
model = PeftModel.from_pretrained(model, "./dpo_qlora_adapter")

tokenizer = AutoTokenizer.from_pretrained(base_model)

# 合并 Adapter（可选，推理更快）
model = model.merge_and_unload()

# 推理
inputs = tokenizer("如何学习编程？", return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=256, temperature=0.7, top_p=0.9)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

---

## 8. 选型决策树

```
你有多少数据?
├── <100 条
│   └── 先用 Prompt Engineering / Few-shot，可能不需要微调
├── 100-10,000 条
│   └── LoRA / QLoRA + SFT（性价比最高）
└── >10,000 条
    └── 考虑全参数微调（效果最好）

你需要对齐人类偏好吗?
├── 不需要（只学格式/领域知识）
│   └── SFT 就够了
└── 需要（安全、礼貌、拒绝有害请求）
    ├── 资源充足、追求极致 → RLHF (PPO)
    └── 资源有限、求稳求快 → DPO / ORPO / KTO

你有多少显存?
├── >80GB → 全参数微调 / LoRA
├── 24-48GB → QLoRA (7B-13B)
└── <16GB → QLoRA + 更小模型 / 使用云端 GPU

你想部署多个任务吗?
├── 是 → LoRA（一个基础模型 + N 个 Adapter）
└── 否 → 全参数或合并后的 LoRA
```

---

## 9. 常见误区与避坑

### 误区 1：LoRA 效果一定不如全参数微调

**事实**：在大多数任务上，LoRA 能达到全参数微调的 90-97%，但成本只有 1%。只有在需要大幅改变模型基础能力（如从通用模型彻底改造成医疗模型）时，全参数才明显更好。

### 误区 2：DPO 一定比 RLHF 好

**事实**：DPO 更简单、更稳定，但 RLHF 在复杂场景和超长上下文上可能 still 更强。2026 年的趋势是 DPO/ORPO 为主，RLHF 用于追求极致性能的团队。

### 误区 3：QLoRA 会严重损失精度

**事实**：NF4 量化经过专门设计，配合 LoRA 训练，效果损失通常只有 1-3%，在很多任务上几乎感觉不到。

### 误区 4：微调后模型不会遗忘

**事实**：微调可能导致**灾难性遗忘**（Catastrophic Forgetting），即模型学会新任务后忘记旧能力。

**缓解方法**：

1. 使用更小的学习率
2. 在训练集中混入 10-20% 的通用数据
3. 使用 LoRA/DoRA 而不是全参数微调
4. 使用更短的训练轮数

### 误区 5：rank 越大越好

**事实**：rank 过大（>64 或 128）通常不会带来明显提升，反而可能过拟合。通用任务从 r=16 开始，复杂任务可尝试 r=32-64。

### 误区 6：SFT 数据越多越好

**事实**：SFT 数据质量远比数量重要。几千条高质量数据往往比几十万条低质量数据效果更好。

---

## 10. 源码印证：这些概念在代码里长什么样

> 基于本仓库归档源码 `code/llm-frameworks/peft-v0.19.1/` 与 `code/llm-frameworks/LLaMA-Factory-v0.9.5/`，把前面的大白话落到真实实现。

### 10.1 LoRA："便签"的真身

- **便签本体**：`peft/tuners/lora/layer.py` 中 `LoraLayer`（L100）把 `lora_A`/`lora_B` 存成 `nn.ModuleDict`，一个目标层可以同时贴多张"便签"（多 adapter）。
- **贴便签的动作**：`BaseTuner.inject_adapter()`（`tuners_utils.py` L749）扫描模型，把 `q_proj`/`v_proj` 等 `nn.Linear` 替换成 `lora.Linear`（layer.py L769）——课本（基座权重）一个字都没改。
- **B 为什么零初始化**：`update_layer()`（layer.py L153）里 B 矩阵初始化为全零，所以训练第 0 步时 `B@A=0`，模型完全等价于原模型，从"不捣乱"的起点开始学。
- **撕掉便签合进课本**：部署时 `merge()`（layer.py L817）执行 `W += B@A*scaling`，推理零开销；`unmerge()`（L884）可逆向撤销。

### 10.2 QLoRA："低清扫描课本 + 高清便签"

`peft/tuners/lora/bnb.py` 中 `Linear4bit`（L311）：基座是 bitsandbytes 的 NF4 量化层（低清课本），forward 时先反量化算主干，再加上 fp16/bf16 的 LoRA 旁路（高清便签）——两者精度不同但互不干扰，这就是 QLoRA 省显存不牵连训练精度的实现真相。

### 10.3 SFT/DPO/PPO 流水线：LLaMA-Factory 怎么串起来

| 概念 | 源码实体（`src/llamafactory/`） | 说明 |
|------|-------------------------------|------|
| 统一入口 | `run_exp()`（train/tuner.py L139）→ `_training_function()`（L68） | 按 `stage` 参数分发到 pt/sft/rm/ppo/dpo/kto 子流水线 |
| SFT 教学 | `run_sft()`（train/sft/workflow.py L41） | 加模型→套模板→建 Trainer，就是第 2 节讲的"拿题库教学生答题" |
| 贴 LoRA | `init_adapter()`（model/adapter.py L293） | 内部调用 peft 的 `get_peft_model`，两个库在此接头 |
| 对话模板 | `Template`（data/template.py L41）+ `get_template_and_fix_tokenizer()`（L628） | 把原始问答对拼成各模型专属 chat 格式，SFT 数据质量的第一道门 |
| 偏好训练 | `train/dpo/`、`train/ppo/`、`train/rm/`、`train/kto/` 子目录 | 每个对齐方法一个 workflow+trainer，结构与 sft 完全对称 |

> 一句话：**peft 负责"怎么省"（adapter 注入/量化适配），LLaMA-Factory 负责"怎么练"（数据模板/训练编排）**，两者在 `init_adapter` 处会合。详见 [[05_大模型/07_Fine_tuning_Techniques/LLaMA_Factory_Deep_Dive|LLaMA-Factory 深度解析]]。

---

## 11. 延伸阅读

### 概念卡片

- [[概念/lora-qlora-sft-rlhf-dpo]] — 本文对应的概念卡片
- [[概念/fine-tuning-techniques]] — 微调技术总览
- [[概念/lora-peft]] — LoRA 与参数高效微调
- [[概念/rlhf]] — 基于人类反馈的强化学习

### 主章节深度文档

- [Fine_tuning_Techniques_for_dummy.md](./Fine_tuning_Techniques_for_dummy.md) — 微调技术小白版
- [PEFT_2026.md](./PEFT_2026.md) — PEFT 2026 完全指南
- [Fine_tuning_Strategies.md](05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Strategies.md) — 微调策略完全指南
- [TRL_RLHF_DPO_Guide.md](07_模型训练/06_Alignment/TRL_RLHF_DPO_Guide.md) — TRL 实战：RLHF 与 DPO
- [GRPO_and_New_Alignment_Methods.md](07_模型训练/06_Alignment/GRPO_and_New_Alignment_Methods.md) — GRPO 与新一代对齐方法

### 关键论文

- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314)
- [DPO: Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [InstructGPT: Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)

---

*Last updated: 2026-07-25*
