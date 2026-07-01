---
title: 奖励模型（Reward Modeling）
category: concepts
tags:
  - llm
  - rlhf
  - reward-model
  - alignment
  - human-feedback
  - preference-learning
aliases:
  - Reward Modeling
  - 奖励模型
  - Reward Model
  - 偏好模型
relationships:
  - target: "_concepts/rlhf"
    type: part_of
  - target: "_concepts/dpo"
    type: alternative_to
  - target: "_concepts/ppo"
    type: used_by
  - target: "_concepts/sft"
    type: follows
summary: 奖励模型是 RLHF 流程中的核心组件，它学习人类对模型回答的偏好，为强化学习提供可优化的标量奖励信号。
lifecycle: stable
tier: core
created: 2026-06-25
updated: 2026-06-25
---

# 奖励模型（Reward Modeling）

## 一句话总结

奖励模型学习人类对 LLM 回答的偏好排序，将其转化为一个标量分数，用于指导后续的强化学习微调。

---

## 在 RLHF 中的位置

```
Pre-train → SFT → [Reward Model Training] → PPO / RL Fine-tuning
```

奖励模型训练是 RLHF 三阶段中的**第二阶段**。

---

## 训练数据

奖励模型的训练数据是**偏好对（preference pairs）**：

```
(x, y_w, y_l)
```

其中：

- `x`：输入 prompt；
- `y_w`：人类偏好的回答（win）；
- `y_l`：人类不喜欢的回答（lose）。

数据收集方式：

| 方式 | 说明 |
|---|---|
| **人工标注** | 人类直接比较两个回答 |
| **模型辅助标注** | 用 GPT-4 等强模型生成偏好标签 |
| **Elo 评分** | 多次对比后计算排名分数 |

---

## 损失函数

奖励模型 `r_θ(x, y)` 输出一个标量分数。训练目标是让偏好回答的分数高于非偏好回答：

```
L_RM = -E_{(x, y_w, y_l) ~ D} [log σ(r_θ(x, y_w) - r_θ(x, y_l))]
```

其中 `σ` 是 sigmoid 函数。

直观理解：

- 如果 `r_θ(x, y_w) > r_θ(x, y_l)`，损失小；
- 如果 `r_θ(x, y_w) < r_θ(x, y_l)`，损失大。

---

## 模型结构

奖励模型通常基于预训练好的 SFT 模型改造：

1. 移除原模型的语言建模头；
2. 新增一个标量输出头；
3. 输入 prompt + response，输出一个奖励分数。

```
Input:  [prompt] + [response]
Output: scalar reward
```

---

## 偏好维度

人类标注时通常考虑多个维度：

| 维度 | 说明 |
|---|---|
| **有用性（Helpfulness）** | 回答是否解决了用户问题 |
| **诚实性（Honesty）** | 是否包含虚假或误导信息 |
| **无害性（Harmlessness）** | 是否有害、偏见或危险 |
| **遵循指令** | 是否按要求格式输出 |
| **流畅性** | 语言是否自然通顺 |

---

## 奖励模型的挑战

| 挑战 | 说明 |
|---|---|
| **奖励黑客（Reward Hacking）** | 模型找到获得高分但实际很差的输出方式 |
| **偏好不一致** | 不同标注者、不同文化的偏好可能冲突 |
| **分布外泛化差** | 奖励模型在训练数据分布外可能打分不准 |
| **标量奖励的局限性** | 多维偏好被压缩成一个数字，信息损失大 |
| **可扩展性** | 高质量人类偏好数据昂贵且耗时 |

---

## 奖励模型的替代方案

| 方法 | 说明 |
|---|---|
| **DPO** | 直接用偏好数据优化策略模型，无需奖励模型 |
| **KTO** | 只需要二元偏好（好/坏），降低标注成本 |
| **Constitutional AI** | 用原则/宪法替代部分人类偏好标注 |
| **RLAIF** | 用 AI 反馈替代人类反馈 |

---

## 实践建议

1. **数据质量 > 数量**：错误的偏好标注会直接污染奖励模型。
2. **覆盖多样场景**：单一领域的偏好数据会导致泛化差。
3. **定期校准**：奖励模型可能需要随着策略模型迭代而更新。
4. **KL 约束**：RL 阶段用 KL 散度约束，避免策略过度优化奖励模型。

---

## 延伸阅读

- [[_concepts/rlhf|RLHF]]
- [[_concepts/dpo|DPO]]
- [[_concepts/kto|KTO]]
- [[_concepts/ppo|PPO]]
- [[_concepts/sft|SFT]]
