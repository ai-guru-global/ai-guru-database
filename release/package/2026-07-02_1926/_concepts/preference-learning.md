---
title: "Preference Learning（偏好学习）"
category: -concepts
tags: [preference-learning, rlhf, dpo, alignment, human-feedback, ranking]
aliases:
  - "Preference Learning"
  - "偏好学习"
relationships:
  - target: "_concepts/rlhf"
    type: belongs_to
  - target: "_concepts/dpo"
    type: includes
  - target: "_concepts/ppo"
    type: includes
  - target: "_concepts/kto"
    type: includes
sources:
  - 07_Model_Training/Alignment/
summary: "Preference Learning（偏好学习）是 RLHF / DPO / IPO / KTO 等所有基于人类偏好训练方法的总称；通过学习"哪个回答更好"而非绝对正确来对齐模型。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-06-24
---

# Preference Learning（偏好学习）

## 核心要点

- **定义**：通过学习人类对模型输出的"偏好比较"（A 比 B 好）来对齐模型，而非学习绝对正确答案。
- **核心优势**：
  - 偏好标注比绝对标注容易（人更擅长比较）
  - 捕捉"主观但合理"的偏好（如语气、风格、安全）
  - 解决"没有标准答案但有更好答案"的任务
- **数据格式**：通常 `(prompt, response_A, response_B, preference)` 或 `(prompt, chosen, rejected)`
- **代表算法**：

| 算法 | 数据 | 核心思想 | 代表 |
|------|------|---------|------|
| **RLHF (PPO)** | 成对偏好 | Reward Model + PPO | ChatGPT |
| **DPO** | 成对偏好 | 直接拟合偏好 | Llama 3 |
| **IPO** | 成对偏好 | 正则化 | Stability AI |
| **KTO** | 二元反馈 | 前景理论 | Mistral |
| **ORPO** | 成对偏好 | SFT + DPO 融合 | - |
| **SimPO** | 成对偏好 | 无需参考模型 | - |
| **GRPO** | 组内比较 | 无 Critic | DeepSeek-R1 |

## 一句话解释

> Preference Learning = "教模型哪个更好"；通过人类偏好比较训练，比"教正确答案"更接近真实场景。

## 与监督学习的对比

| 维度 | 监督学习 | 偏好学习 |
|------|---------|---------|
| 数据 | (input, label) | (prompt, A, B, preference) |
| 标注成本 | 中 | 低（更易标注）|
| 信息量 | 1 bit | log(n) bits（n 个候选）|
| 适用 | 有标准答案 | 无标准答案 / 主观偏好 |
| 代表任务 | 分类 / 回归 | 对话质量 / 安全性 / 风格 |

## Bradley-Terry 模型（理论基础）

偏好学习的数学基础：

```
P(A ≻ B | prompt) = σ(r(prompt, A) - r(prompt, B))

σ = sigmoid 函数
r = 隐式奖励函数
P(A ≻ B) = A 比 B 更好的概率
```

训练目标：让模型预测的偏好概率与人类标注一致。

## 数据收集方式

| 方式 | 特点 | 适用 |
|------|------|------|
| **人工标注** | 质量最高 | 高质量场景 |
| **众包（MTurk）** | 成本低 | 大规模 |
| **AI 反馈（RLAIF）** | 成本极低 | 隐私敏感 |
| **用户反馈** | 真实场景 | Chatbot / 推荐 |
| **规则化偏好** | 完全自动 | 代码 / 数学 |

## 关键挑战

| 挑战 | 现象 | 缓解 |
|------|------|------|
| **标注一致性** | 不同标注者偏好不同 | 多人标注 + 投票 |
| **Reward Hacking** | RM 给高分但实际差 | KL 约束 + 人类评估 |
| **模式坍缩** | 模型只输出一种风格 | 多样性奖励 |
| **位置偏差** | 偏好第一个 | 调换 A/B 顺序两次 |

## 主流框架

| 框架 | 强项 |
|------|------|
| **TRL** | HuggingFace 官方，RLHF/DPO/KTO |
| **LLaMA-Factory** | 中文友好，全套算法 |
| **OpenRLHF** | 大规模分布式 |
| **Verl**（字节）| 高性能 PPO |

## 何时使用

✅ **推荐**：
- 任何 LLM 对齐阶段（ChatGPT、Llama 3 都是）
- 数据存在主观性
- 已有偏好标注或可低成本获取
- 想要接近人类偏好的模型

⚠️ **不推荐**：
- 有明确标准答案的任务（监督学习更好）
- 数据量极少（< 100 条）
- 没有人类偏好（用规则化 RM）

## Related

- [[_concepts/rlhf]] — RLHF 总览
- [[_concepts/dpo]] / [[_concepts/ppo]] / [[_concepts/kto]] / [[_concepts/ipo]] / [[_concepts/orpo]] / [[_concepts/grpo]]
- [[_concepts/sft]] — SFT（偏好学习的前置阶段）
- [[07_Model_Training/Alignment/index]] — 对齐章节