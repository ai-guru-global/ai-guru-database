---
title: RLHF
category: concepts
tags: ["reinforcement-learning", "rlhf", "ppo", "alignment", "reward-model", "human-feedback", "ai-history"]
aliases: [RLHF, reinforcement-learning from Human Feedback, 基于人类反馈的强化学习, 人类对齐]
relationships:
  - target: "[[concepts/deep-reinforcement-learning]]"
    type: related_to
  - target: "concepts/reinforcement-learning"
    type: related_to
  - target: "concepts/ai-agents"
    type: related_to
sources:
  - 06_reinforcement-learning_unsupervised-learning/Deep_RL/Deep_RL.md
  - 06_Reinforcement_Learning/Deep_RL/PPO_Deep_Dive.md
summary: RLHF通过人类偏好训练奖励模型，再用PPO等算法对齐LLM行为，是ChatGPT等模型安全可控的核心训练范式。
provenance:
  extracted: 0.70
  inferred: 0.20
  ambiguous: 0.10
base_confidence: 0.70
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# RLHF

RLHF（Reinforcement Learning from Human Feedback）是将大语言模型与人类偏好对齐的核心训练范式。通过三个阶段——监督微调（SFT）、奖励建模（Reward Modeling）、PPO强化学习优化——使模型输出更安全、更有用、更符合人类意图。RLHF是ChatGPT成功的核心技术，也是深度强化学习在NLP领域最重要的应用。

## 核心要点

- 三阶段流程：SFT（监督微调）→ RM（奖励模型训练）→ PPO（强化学习优化）
- 奖励模型从人类偏好对比数据中学习，将"人类偏好"转化为可微分的标量奖励信号
- PPO的Clip机制限制策略不偏离SFT模型太远，保持语言流畅性
- RLHF本质上是在"有用性"和"安全性"之间寻找帕累托最优
- DPO（Direct Preference Optimization）作为替代方案，绕过奖励模型直接从偏好数据学习 ^[inferred]

## 详细内容

### 三阶段详解

**阶段一：SFT（supervised-learning fine-tuning-techniques）**
在高质量人工编写的指令-回答对上微调预训练LLM，建立基础的指令遵循能力。数据质量远比数量重要。

**阶段二：奖励模型训练**
收集人类对同一提示的多个回答的偏好排序（A比B好），训练一个奖励模型 $r_\phi(x, y)$ 预测人类偏好分数。损失函数基于Bradley-Terry模型：$\mathcal{L} = -\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))$，其中$y_w$是被偏好的回答。

**阶段三：PPO强化学习优化**
用奖励模型的输出作为奖励信号，PPO优化策略最大化奖励。同时加入KL散度惩罚防止策略偏离SFT模型太远：$R = r_\phi(x, y) - \beta \text{KL}[\pi_\theta \| \pi_{ref}]$

### PPO在RLHF中的角色

PPO的裁剪目标确保每次更新不会让模型行为发生剧变。在RLHF场景中，这尤其重要：过大的策略更新可能导致模型生成无意义文本或忘记已有能力。PPO的稳定性使其成为RLHF的首选算法。

### RLHF的挑战

**奖励破解**：模型可能找到奖励模型的漏洞，生成获得高奖励但实际无用的输出。缓解方法包括KL惩罚、奖励模型集成、红队测试。

**标注成本**：人类偏好数据采集昂贵且存在标注者分歧。解决方案包括使用AI辅助标注（RLAIF）、减少标注量（主动学习）。

**对齐税**：过度对齐可能降低模型能力。研究表明RLHF在提升安全性的同时可能降低某些推理任务的性能。

### 替代与演进

**DPO**（Direct Preference Optimization）：直接从偏好对学习策略，省略奖励模型训练步骤，实现更简单。

**RLAIF**（RL from AI Feedback）：用强模型（如GPT-4）替代人类标注偏好，降低成本。

**Constitutional AI**（Anthropic）：模型通过自我批评和修订实现自我对齐，减少对人类标注的依赖。

### RLHF在ChatGPT中的完整流程

1. 预训练阶段：在大规模文本语料上训练GPT基础模型
2. SFT阶段：在人工编写的高质量指令-回答对上微调
3. 奖励建模：收集人类偏好排序数据，训练奖励模型
4. PPO优化：用奖励模型的输出指导策略优化，KL惩罚保持模型稳定
5. 迭代：重复2-4阶段持续改进模型质量

每一步都需要精心设计数据质量、超参数和评估指标。OpenAI reportedly雇佣了数百名标注者参与偏好数据采集。

### RLHF对模型行为的影响

RLHF训练后的模型表现出明显的"对齐效应"：拒绝有害请求的频率显著提高，回答更有条理和礼貌，但可能过度谨慎（对无害请求也说"我无法帮助"）。这种"过度对齐"现象被称为" sycophancy"（谄媚），模型倾向于给出用户想听到的答案而非客观事实。

## 开放问题

- 奖励模型能否完全捕捉"人类偏好"这一模糊概念存疑 ^[ambiguous]
- 不同人类群体的偏好差异如何处理（价值对齐问题）
- RLHF的Scaling Law尚不清晰，多少偏好数据才能充分对齐
- 长期来看，是否需要超越RLHF的全新对齐范式

## 来源

- 06_Reinforcement_Learning/Deep_RL/Deep_RL.md
- 06_Reinforcement_Learning/Deep_RL/PPO_Deep_Dive.md

## Related

- [[22_Papers/RLHF_DPO_Deep_Dive]] — RLHF 与 DPO 深度解读 (从 InstructGPT 到 Direct Preference Optimization) (共享: alignment, rl, rlhf)
- [[concepts/deep-reinforcement-learning]] — 深度强化学习 (共享: ppo, rl)
