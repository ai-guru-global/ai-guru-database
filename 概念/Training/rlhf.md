---
title: RLHF
category: -concepts
tags: ["reinforcement-learning", "rlhf", "ppo", "alignment", "reward-model", "human-feedback", "ai-history"]
aliases: [RLHF, reinforcement-learning from Human Feedback, 基于人类反馈的强化学习, 人类对齐]
relationships:
  - target: "[[概念/deep-reinforcement-learning]]"
    type: related_to
  - target: "概念/reinforcement-learning"
    type: related_to
  - target: "概念/ai-agents"
    type: related_to
  - target: "概念/lora-qlora-sft-rlhf-dpo"
    type: related_to
sources:
  - 06_reinforcement-learning_unsupervised-learning/Deep_RL/Deep_RL.md
  - 06_强化学习/02_Deep_RL/PPO_Deep_Dive.md
summary: RLHF通过人类偏好训练奖励模型，再用PPO等算法对齐LLM行为，是ChatGPT等模型安全可控的核心训练范式。
provenance:
  extracted: 0.70
  inferred: 0.20
  ambiguous: 0.10
base_confidence: 0.70
lifecycle: reviewed
lifecycle_changed: 2026-07-21
updated: 2026-07-25
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-06-16T00:00:00Z
name_zh: "人类反馈强化学习"
---

# RLHF

> 中文简称：人类反馈强化学习

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

- 06_强化学习/02_Deep_RL/Deep_RL.md
- 06_强化学习/02_Deep_RL/PPO_Deep_Dive.md

## 源码级洞察（基于 trl v1.9.0 归档源码）

归档位置：`code/llm-frameworks/trl-v1.9.0/`（PyPI sdist）。

- **核心 API 已收敛为六个 Trainer**：`trl/trainer/` 只保留 SFT/DPO/GRPO/RLOO/KTO/Reward，均继承 `trainer/base_trainer.py` L67 `_BaseTrainer(Trainer)`——RLHF 全流水线（SFT→RM→RL）在同一套基类抽象下完成。
- **经典 PPO 式 RLHF 已退入 experimental**：`PPOTrainer` 位于 `experimental/ppo/ppo_trainer.py` L297，与 ORPO/CPO/OnlineDPO/NashMD/XPO 等 30+ 方法同居——印证主流实践已从 PPO 转向 DPO/GRPO。
- **奖励模型环节**：`trainer/reward_trainer.py` L227 `RewardTrainer` 实现 Bradley-Terry 成对比较训练，是三阶段流水线中 RM 阶段的参考实现。
- **规模化基础设施**：`generation/vllm_client.py` L58 `VLLMClient` 提供训推分离（生成走 vLLM、训练进程 NCCL 同步权重），是工业级 RLHF 的关键工程模式。

详见 [[07_模型训练/06_Alignment/RLHF_at_Scale_2026]] 第 13 节、[[07_模型训练/06_Alignment/TRL_RLHF_DPO_Guide]] 第 6 节。

## Related

- [[概念/lora-qlora-sft-rlhf-dpo]] — LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲
- [[概念/dpo]] — DPO（直接偏好优化）
- [[概念/grpo]] — GRPO（组相对策略优化）
- [[概念/reward-modeling]] — 奖励模型
- [[20_论文精读/06_Alignment/RLHF_DPO_Deep_Dive]] — RLHF 与 DPO 深度解读
- [[概念/deep-reinforcement-learning]] — 深度强化学习

---

## 2026 RLHF 生态

| 算法 | 核心机制 | 优势 | 适用场景 |
|------|---------|------|----------|
| **PPO-RLHF** | 奖励模型 + PPO | 效果最佳、可控性强 | 高质量对齐 |
| **DPO** | 直接偏好优化 | 无需奖励模型、简单 | 有 A/B 数据 |
| **GRPO** | 组相对策略 | 无需 Critic、省资源 | 资源受限 |
| **KTO** | 二元反馈 | 标注成本低 | 只有 👍/👎 数据 |

## 生产最佳实践

1. **算法选择**：资源充足用 PPO-RLHF，简单场景用 DPO，资源受限用 GRPO
2. **奖励模型**：定期更新奖励模型，避免奖励黑客（reward hacking）
3. **KL 约束**：保持与参考模型的 KL 散度在合理范围，避免过度偏离
4. **人类评估**：自动指标 + 人类评估结合，确保对齐质量
5. **迭代优化**：收集用户反馈持续迭代偏好数据

## 2026 RLHF 生态现状

| 阶段 | 工具 | 特色 | 状态 |
|------|------|------|------|
| SFT | LLaMA-Factory/TRL | 监督微调 | ✅ 主流 |
| 奖励建模 | TRL/OpenRLHF | 偏好学习 | ✅ 主流 |
| PPO | TRL/OpenRLHF | 经典 RL | ✅ 成熟 |
| DPO | TRL/LLaMA-Factory | 简化对齐 | ✅ 主流 |
| GRPO | TRL/veRL | 推理对齐 | ✅ 前沿 |

## 检查清单

- [ ] SFT 基线已建立
- [ ] 偏好数据已收集并验证
- [ ] 对齐方法已选择（PPO/DPO/GRPO）
- [ ] KL 约束已配置
- [ ] 评估体系已建立（自动 + 人工）
- [ ] 迭代优化流程已建立

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 对齐效果差 | 数据质量低 | 提升数据质量 |
| 奖励黑客 | KL 约束太弱 | 增大 KL 系数 |
| 生成质量下降 | 过度优化 | 早停 + 正则化 |
| 训练不稳定 | 学习率太高 | 降低 lr + warmup |

## 延伸阅读

- [[概念/Training/ppo|PPO]] — 近端策略优化
- [[概念/Training/dpo|DPO]] — 直接偏好优化
- [[概念/Training/grpo|GRPO]] — 组相对策略优化
- [[概念/Training/reward-modeling|Reward Modeling]] — 奖励建模
- [[概念/Training/preference-learning|Preference Learning]] — 偏好学习

> ℹ️ RLHF 是 LLM 对齐的核心流程，2026年 DPO/GRPO 替代 PPO 成主流，数据质量和迭代优化是关键。

## 对齐方法选择指南

| 场景 | 推荐方法 | 理由 |
|------|------|------|
| 资源充足 + 效果优先 | PPO | 经典 RLHF，效果最佳 |
| 资源受限 + 简化流程 | DPO | 无需 RM，稳定 |
| 数学/代码推理 | GRPO | 组内排序，推理增强 |
| 数据稀缺 | KTO | 单样本偏好 |
| 最简化 | ORPO/SimPO | 无参考模型 |

## 训练流程参考

```
1. SFT 基线 → 2. 偏好数据收集 → 3. 对齐训练 → 4. 评估 → 5. 迭代
```

## 延伸阅读

- [[概念/Training/ppo|PPO]] — 近端策略优化
- [[概念/Training/dpo|DPO]] — 直接偏好优化
- [[概念/Training/grpo|GRPO]] — 组相对策略优化
- [[概念/Training/reward-modeling|Reward Modeling]] — 奖励建模
- [[概念/Training/preference-learning|Preference Learning]] — 偏好学习

> ℹ️ RLHF 是 LLM 对齐的核心流程，2026年 DPO/GRPO 替代 PPO 成主流。

## 检查清单

- [ ] SFT 基线已建立
- [ ] 偏好数据已收集
- [ ] 对齐方法已选择
- [ ] 评估体系已建立
- [ ] 迭代优化流程已建立
