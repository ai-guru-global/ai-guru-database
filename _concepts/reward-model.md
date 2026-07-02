---
title: "奖励模型 Reward Model (RLHF/GRPO 中的偏好评估器)"
category: -concepts
tags: ["reward-model", "rlhf", "grpo", "dpo", "preference-learning", "alignment"]
relationships:
  - target: "_concepts/rlhf"
    type: related_to
  - target: "_concepts/grpo"
    type: related_to
  - target: "_concepts/dpo"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Reward Model（奖励模型/RM）是 RLHF 流程中的偏好评估器——学习人类偏好，为 PPO 训练提供奖励信号。DPO/GRPO 等新方法通过隐式奖励绕过独立 RM 训练。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
---

# 奖励模型 Reward Model

> **一句话理解**: Reward Model 是"AI 的评分老师"——学习人类偏好，给模型输出打分，指导 RLHF 训练让模型更"有用、无害、诚实"。

---

## 1. 核心问题

如何让 LLM 的输出符合人类偏好？

| 问题 | 说明 |
|------|------|
| **有用性** | 模型回答是否真正解决用户问题 |
| **无害性** | 模型是否避免有害/偏见内容 |
| **诚实性** | 模型是否承认不确定性、不编造 |

---

## 2. RLHF 三阶段流程

```
RLHF 完整训练流程
│
├── 阶段 1：SFT（监督微调）
│   └── 用高质量数据微调基座模型
│
├── 阶段 2：Reward Model 训练 ← 本文
│   ├── 收集人类偏好数据（A vs B 对比标注）
│   ├── 训练 RM：学习人类偏好打分
│   └── 输出：偏好评估器
│
├── 阶段 3：RL 训练（PPO/GRPO）
│   ├── LLM 生成回答
│   ├── RM 打分 → 作为奖励信号
│   └── PPO/GRPO 优化 LLM 策略
│
└── 产出：对齐后的 LLM
```

---

## 3. Reward Model 架构

| 维度 | 说明 |
|------|------|
| **基座** | 与目标 LLM 相同架构（如 LLaMA-7B） |
| **输入** | (Prompt, Response) 对 |
| **输出** | 标量奖励分数 |
| **训练数据** | 人类标注的偏好对比（A 好于 B） |
| **损失函数** | Bradley-Terry 偏好模型 |

---

## 4. RM vs 无 RM 方案

| 方案 | RM 使用 | 代表方法 | 优劣 |
|------|--------|---------|------|
| **显式 RM** | 独立训练 RM | PPO-RLHF | 精确但成本高 |
| **隐式 RM** | DPO 隐式建模 | DPO/SimPO | 简单但灵活性低 |
| **无需 RM** | 规则/验证器 | GRPO (DeepSeek) | 高效但需设计奖励函数 |

### DeepSeek-R1 的 GRPO 方案

DeepSeek-R1 使用 **GRPO (Group Relative Policy Optimization)**，**不训练独立 Reward Model**：

| 维度 | 传统 RLHF (PPO) | GRPO (DeepSeek) |
|------|----------------|----------------|
| **奖励来源** | 独立 Reward Model | 组内相对排名 |
| **训练成本** | 高（需训练 RM） | 低（无需 RM） |
| **奖励信号** | 绝对分数 | 相对排名（组内对比） |
| **效果** | 好 | 同等或更优 |

---

## 5. 主流 RM 模型

| 模型 | 来源 | 参数量 | 特点 |
|------|------|--------|------|
| **Skywork-Reward** | 昆仑万维 | 8B | 开源奖励模型 |
| **Llama-3-RM** | Meta | 8B/70B | LLaMA 生态 |
| **UltraRM** | 社区 | 13B | 开源高质量 |
| **FsfairX** | 社区 | 7B | 通用偏好模型 |

---

## Related

- [[_concepts/rlhf]] — RLHF 人类反馈强化学习
- [[_concepts/grpo]] — GRPO 组相对策略优化
- [[_concepts/dpo]] — DPO 直接偏好优化
- [[_concepts/knowledge-distillation]] — 知识蒸馏
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
- [[_synthesis/modern-ai-training-stack|现代 AI 训练栈]] — 后训练 RL 与推理扩展的统一视角
