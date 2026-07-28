---
title: "LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲"
category: -concepts
tags: ["lora", "qlora", "sft", "rlhf", "dpo", "fine-tuning", "alignment", "peft"]
aliases:
  - "LoRA QLoRA SFT RLHF DPO"
  - "微调五件套"
relationships:
  - target: "概念/fine-tuning-techniques"
    type: belongs_to
  - target: "概念/lora-peft"
    type: related_to
  - target: "概念/rlhf"
    type: related_to
  - target: "概念/model-training"
    type: prerequisite
  - target: "概念/deep-reinforcement-learning"
    type: related_to
sources:
  - 05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md
  - 05_大模型/07_Fine_tuning_Techniques/PEFT_2026.md
  - 07_模型训练/06_Alignment/TRL_RLHF_DPO_Guide.md
  - 07_模型训练/06_Alignment/GRPO_and_New_Alignment_Methods.md
summary: "把大模型微调的五个核心概念串成一条线：SFT 教它说话，RLHF/DPO 教它讨人喜欢，LoRA/QLoRA 让这一切能在普通显卡上跑起来。"
provenance:
  extracted: 0.40
  inferred: 0.50
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
name_zh: "LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲"
---

# LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲

> 中文简称：LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲

> **一句话理解**：训练 ChatGPT 这类模型，本质上分三步——先用 **SFT** 教会它听懂人话，再用 **RLHF/DPO** 让它回答得更讨喜，而 **LoRA/QLoRA** 是让你能用普通电脑跑完这两步的省钱技巧。

---

## 1. 五个概念是什么关系？

如果把大模型当成一个学生：

| 概念 | 角色 | 生活类比 |
|------|------|----------|
| **SFT** | 基础家教 | 给学生看例题和答案，让他学会基本答题格式 |
| **RLHF** | 人类导师 | 让学生做几套卷子，按人类喜好打分，慢慢纠正风格 |
| **DPO** | 简化的导师 | 不用训练打分器，直接告诉学生"这个答案比那个好" |
| **LoRA** | 聪明笔记法 | 不改课本，只贴便签，用少量笔记实现专业适配 |
| **QLoRA** | 压缩版笔记法 | 把课本扫描成低清电子版，笔记照常贴，成本再降几倍 |

```
预训练模型（已经读过互联网）
    ↓
SFT: 用 (问题, 标准答案) 教会基本对话
    ↓
RLHF / DPO: 用人类偏好让回答更安全、更有用、更礼貌
    ↓
LoRA / QLoRA: 上述步骤的省钱实现方式
```

**关键区分**：
- **SFT / RLHF / DPO** 是**训练目标或方法**（教模型什么）。
- **LoRA / QLoRA** 是**工程实现技巧**（怎么少花钱地教）。

两者可以任意组合：
- `LoRA + SFT`：最常见的轻量指令微调
- `QLoRA + DPO`：单卡消费级 GPU 做偏好对齐
- `全参数 + RLHF`：OpenAI 级别的大规模对齐

---

## 2. SFT：先让模型"会答题"

### 2.1 为什么需要 SFT？

预训练模型只是"会续写文本"，你问它"什么是量子力学"，它可能继续编小说，而不是认真回答。SFT 就是让它学会：

> 看到"问题"，应该生成"回答"。

### 2.2 数据长什么样？

```json
{
  "messages": [
    {"role": "user", "content": "什么是光合作用？"},
    {"role": "assistant", "content": "光合作用是绿色植物利用阳光、二氧化碳和水合成有机物的过程..."}
  ]
}
```

本质上是**监督学习**：输入 X（问题），预测 Y（答案），用交叉熵损失训练。

### 2.3 SFT 的局限

SFT 只能让模型"模仿"已有答案，但：
- 不知道哪些回答更受人喜欢
- 可能生成有害、偏见、冗长或过度讨好的内容
- 对"拒绝回答"这种能力很难通过示例学到

所以需要 RLHF / DPO 来补充。

---

## 3. RLHF：用人类偏好打磨回答

### 3.1 为什么 SFT 不够？

想象你培训客服：
- **SFT** = 给客服看优秀话术脚本，让他照着背。
- **RLHF** = 让客服上岗后，根据客户满意度评分不断调整语气和服务策略。

人类对同一个问题可能有很多合理回答，RLHF 帮助模型学会**人类更偏好的那种**。

### 3.2 三步流程

```
步骤 1：SFT
    用高质量对话数据训练一个基础 Chat 模型

步骤 2：训练奖励模型（Reward Model）
    对同一个问题，让人类标注 A 比 B 好
    训练一个"打分 AI"：r(question, answer) → score

步骤 3：PPO 强化学习
    Chat 模型生成回答 → 奖励模型打分 → 用 PPO 优化 Chat 模型
    同时加 KL 惩罚，防止模型变得太离谱
```

### 3.3 大白话理解 PPO

PPO 是一种"小心翼翼"的强化学习：
- 不会让模型一次改太多（Clip 机制）
- 奖励高就打赏，奖励低就惩罚
- 同时拉住模型："别偏离你原来的样子太远"

### 3.4 RLHF 的缺点

- **流程复杂**：要训练 SFT 模型、奖励模型、PPO 策略，至少 3 个模型
- **显存爆炸**：PPO 阶段要同时加载策略模型、参考模型、奖励模型、价值模型
- **超参难调**：奖励尺度、KL 系数、学习率都很敏感
- **奖励黑客（Reward Hacking）**：模型可能学会讨好奖励模型，而不是真正回答好

于是 DPO 被提出来简化这一切。

---

## 4. DPO：RLHF 的平替方案

### 4.1 核心思想

DPO 发现：其实不需要单独训练一个奖励模型，再把它当成强化学习的奖励信号。可以直接从偏好数据推导出目标函数，**一步完成对齐**。

### 4.2 数据长什么样？

```json
{
  "prompt": "如何学习编程？",
  "chosen": "建议从 Python 入门，先掌握基础语法，再通过小项目练习...",
  "rejected": "编程很简单，看两天就会了。"
}
```

DPO 的目标：让模型更可能生成 `chosen`，更不可能生成 `rejected`。

### 4.3 为什么 DPO 更受欢迎？

| 维度 | RLHF (PPO) | DPO |
|------|-----------|-----|
| 流程 | 3 阶段 | 1 阶段 |
| 需要模型数 | 4 个 | 2 个（当前模型 + 参考模型） |
| 显存需求 | 极高 | 中等 |
| 稳定性 | 容易崩 | 稳定 |
| 效果 | 上限略高 | 大多数场景接近 RLHF |
| 实现难度 | 高 | 低 |

### 4.4 DPO 的局限

- 对偏好数据质量要求很高
- 容易过拟合到训练分布
- 在超长上下文或复杂推理上，RLHF 可能 still 更强

2026 年更出现了 **ORPO**（把 SFT 和 DPO 合并成一步）、**KTO**（只需要"好/坏"二元标签）等进一步简化的方法。

---

## 5. LoRA：不改课本，只贴便签

### 5.1 微调大模型有多贵？

以 Llama-3-70B 为例：

| 项目 | 全参数微调 | LoRA |
|------|-----------|------|
| 可训练参数 | 700 亿 | ~1 亿 |
| 训练显存 | ~840 GB | ~160 GB |
| 保存体积 | 140 GB | 140 MB |
| 成本 | 几万美元 | 几百美元 |

### 5.2 LoRA 核心思想

预训练权重 $W_0$ 冻结不动，只训练一个低秩增量：

$$
W = W_0 + \frac{\alpha}{r} B A
$$

- $B$ 和 $A$ 是两个小矩阵，秩 $r$ 通常只有 8、16、64
- 训练完后可以把 $BA$ 合并回 $W_0$，**推理时零额外开销**

### 5.3 为什么低秩够用？

研究发现：微调时权重的变化量 $\Delta W$ 本质上**是低秩的**。就像人脸有几百块肌肉，但表达表情主要靠 20 块肌肉。用很小的秩就能抓住微调所需的大部分信息。

### 5.4 关键超参数

| 参数 | 含义 | 推荐值 |
|------|------|--------|
| `r`（秩） | 低秩维度 | 8-64，通用 16 |
| `alpha` | 缩放因子 | 通常 2×r |
| `target_modules` | 哪些层加 LoRA | q_proj/v_proj 最小；all_linear 最强 |
| `dropout` | 防过拟合 | 0.05-0.1 |
| `lr` | 学习率 | 1e-4 ~ 2e-4 |

---

## 6. QLoRA：把课本扫描成低清版

### 6.1 QLoRA = 量化 + LoRA

- 把基础模型从 16-bit 压缩到 4-bit（NF4 量化）
- LoRA 参数仍然用 16-bit 训练
- 前向传播时动态反量化，反向传播只更新 LoRA

### 6.2 显存对比

| 模型 | 全参数微调 | LoRA | QLoRA |
|------|-----------|------|-------|
| Llama-3-8B | 80 GB | 16 GB | **6 GB** |
| Llama-3-70B | 640 GB | 160 GB | **48 GB** |

这意味着：
- **RTX 4090（24GB）** 可以微调 7B-13B 模型
- **单张 A100（80GB）** 可以微调 70B 模型

### 6.3 QLoRA 的三大 trick

1. **NF4 量化**：针对正态分布优化的 4-bit 表示，信息损失小
2. **双量化（Double Quantization）**：对量化常数再量化，进一步省显存
3. **分页优化器（Paged Optimizer）**：显存不够时自动把优化器状态换到 CPU

---

## 7. 实战组合：一条典型的训练流水线

```python
# 阶段 1：QLoRA + SFT
# 用消费级显卡在指令数据上微调，学会基本对话

# 阶段 2：QLoRA + DPO
# 在偏好数据上进一步对齐，让回答更安全、有用、符合人类口味
```

这就是目前个人开发者和小团队最主流的路径：

```
Base Model
    ↓ QLoRA + SFT
SFT Model（能对话）
    ↓ QLoRA + DPO
Aligned Chat Model（又好又安全）
```

---

## 8. 选型决策树

```
你有多少数据?
├── <100 条
│   └── 先用 Prompt Engineering / Few-shot
├── 100-10,000 条
│   └── LoRA / QLoRA + SFT（性价比最高）
└── >10,000 条
    └── 全参数微调（效果最好）

你需要对齐人类偏好吗?
├── 不需要（只学格式/领域知识）
│   └── SFT 就够了
└── 需要（安全、礼貌、拒绝有害请求）
    ├── 资源充足 → RLHF (PPO)
    └── 资源有限 → DPO / ORPO / KTO

你有多少显存?
├── >80GB → 全参数 / LoRA
├── 24GB → QLoRA (7B-13B)
└── <16GB → QLoRA + 更小模型 / 云端
```

---

## 9. 常见误区

### 误区 1：LoRA 效果不如全参数微调

**事实**：在大多数任务上，LoRA 能达到全参数微调的 90-97%，但成本只有 1%。只有在需要大幅改变模型基础能力时才需要全参数。

### 误区 2：DPO 一定比 RLHF 好

**事实**：DPO 更简单、更稳定，但 RLHF 在复杂场景和超长上下文上可能 still 更强。2026 年的趋势是 DPO/ORPO 为主，RLHF 用于追求极致。

### 误区 3：QLoRA 会严重损失精度

**事实**：NF4 量化经过专门设计，配合 LoRA 训练，效果损失通常只有 1-3%，在很多任务上几乎感觉不到。

### 误区 4：微调后模型不会遗忘

**事实**：微调可能导致**灾难性遗忘**。缓解方法：低学习率、混入通用数据、用 LoRA/DoRA 而不是全参数。

---

## 10. 一句话总结

- **SFT** 让模型"会回答"；
- **RLHF/DPO** 让模型"回答得让人满意"；
- **LoRA/QLoRA** 让这一切变得"便宜且可行"。

普通人玩大模型微调，最实用的组合就是：

> **QLoRA + SFT → QLoRA + DPO**

---

## Related

- [[概念/fine-tuning-techniques]] — 微调技术总览
- [[概念/lora-peft]] — LoRA 与参数高效微调
- [[概念/rlhf]] — 基于人类反馈的强化学习
- [[概念/model-training]] — 模型训练基础
- [[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy]] — 微调技术小白版
- [[07_模型训练/06_Alignment/TRL_RLHF_DPO_Guide]] — TRL 实战：RLHF 与 DPO
- [[07_模型训练/06_Alignment/GRPO_and_New_Alignment_Methods]] — GRPO 与新一代对齐方法

---

## 2026 微调对齐全链路生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **SFT** | 监督微调基础流程 | GA |
| **QLoRA** | 4bit 量化 + LoRA 微调 | GA |
| **DPO/GRPO** | 直接偏好优化对齐 | GA |
| **TRL** | HuggingFace 对齐训练库 | GA |
| **LLaMA-Factory** | 一站式微调框架 | GA |

## 生产最佳实践

1. **流程顺序**：SFT → DPO/GRPO，不要跳过 SFT 直接对齐
2. **数据配比**：SFT 数据质量 > 数量，对齐数据需多样化
3. **显存优化**：显存不足用 QLoRA，充足用 LoRA
4. **评估闭环**：每步微调后评估，确认效果提升
5. **版本管理**：微调模型版本化，支持回滚
