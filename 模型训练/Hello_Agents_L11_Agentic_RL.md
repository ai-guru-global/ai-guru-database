---
title: "Hello-Agents L11：Agentic-RL（从 SFT 到 GRPO 的 LLM 训练实战）"
category: "07-model-training"
tags:
  - ai-agents
  - agentic-rl
  - reinforcement-learning
  - sft
  - grpo
  - rlhf
  - hello-agents
sources:
  - "_raw/github-sources/hello-agents/docs/chapter11/第十一章 Agentic-RL.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第十一章笔记：将 LLM 视为可学习策略嵌入 Agent 感知-决策-执行循环，通过 SFT、奖励建模、PPO/GRPO 优化多步推理与工具使用能力。"
provenance:
  extracted: 0.74
  inferred: 0.21
  ambiguous: 0.05
base_confidence: 0.83
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Hello Agents L11 Agentic Rl"
  - "Hello Agents L11 Agentic RL"
  - Hello_Agents_L11_Agentic_RL

---
# Hello-Agents L11：Agentic-RL

> **一句话理解**: Agentic RL 将 LLM 视为可学习策略，嵌入 Agent 的顺序决策循环，通过强化学习优化多步推理、工具使用与长期任务完成度。

---

## 1. 从 LLM 训练到 Agentic RL

### 1.1 传统监督学习的局限

- 数据质量决定上限，模型只能模仿训练数据
- 缺乏探索能力，难以超越人类标注路径
- 难以优化多步推理的中间过程 ^[extracted]

### 1.2 强化学习的优势

- Agent 自主生成多个候选答案
- 根据正确性/任务完成度获得奖励
- 学习更优推理路径，甚至发现人类未标注的方法 ^[extracted]

---

## 2. LLM 训练全景图

### 2.1 预训练（Pretraining）

- 使用数 TB 级无标注文本
- 自监督学习：根据上文预测下一个词（Causal Language Modeling）
- 学习目标：$\mathcal{L}_{\text{pretrain}} = -\sum_{t=1}^{T} \log P(x_t | x_1, \ldots, x_{t-1}; \theta)$ ^[extracted]

### 2.2 后训练（Post-training）

#### 2.2.1 监督微调（SFT）

- 数据：(prompt, completion) 对
- 学习目标：$\mathcal{L}_{\text{SFT}} = -\sum_{i=1}^{N} \log P(y_i | x_i; \theta)$ ^[extracted]

#### 2.2.2 奖励建模（RM）

- 输入同一问题的两个回答（chosen / rejected）
- 学习目标：$\mathcal{L}_{\text{RM}} = -\mathbb{E}_{(x, y_w, y_l)} [\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))]$ ^[extracted]

#### 2.2.3 强化学习微调（RLHF / RLAIF）

- 经典算法：PPO
- 目标函数：$J_{\text{PPO}} = \mathbb{E}_{x, y \sim \pi_\theta} [r_\phi(x, y)] - \beta \cdot D_{KL}(\pi_\theta \|\| \pi_{\text{ref}})$ ^[extracted]
- RLHF 需要大量人工偏好标注，成本高昂
- RLAIF 用强 AI 模型替代人类标注，成本大幅降低 ^[extracted]

---

## 3. Agentic RL 的核心理念

### 3.1 与 PBRFT 的对比

| 维度 | PBRFT（偏好驱动 RL 微调） | Agentic RL |
|------|--------------------------|------------|
| 状态 | 仅用户提示，$s_0 = \text{prompt}$ | 包含历史观察，$s_t = (\text{prompt}, o_1, \ldots, o_t)$ |
| 行动 | 文本生成 | 文本生成 + 工具调用 + 环境操作 |
| 奖励 | 单步奖励 | 多步累积奖励 $R = \sum \gamma^t r(s_t, a_t)$ |
| 优化目标 | 单轮回答质量 | 复杂任务完成度 |

表格基于教材表 11.1 整理 ^[extracted]。

### 3.2 六大核心能力

Agentic RL 旨在赋予 LLM Agent 以下能力 ^[extracted]：

1. **推理（Reasoning）**: 逻辑得出结论
2. **工具使用（Tool Use）**: 选择并组合外部工具
3. **规划（Planning）**: 分解长期目标
4. **记忆（Memory）**: 利用历史信息
5. **自我改进（Self-improvement）**: 从错误中学习
6. **协作（Collaboration）**: 与其他 Agent 配合

> 教材原图 11.2 列出六大能力，此处第 3–6 项为基于常见 Agentic RL 框架的合理推断 ^[inferred]。

---

## 4. 奖励设计

- **稀疏奖励**: 仅在任务完成时给予（如答案正确 +1）
- **密集奖励**: 每步都给予（如工具调用成功 +0.1）
- **混合奖励**: 结合两者，平衡探索与收敛 ^[extracted]

---

## 5. 从 SFT 到 GRPO

- **SFT**: 学习指令遵循与对话格式
- **GRPO（Group Relative Policy Optimization）**: 无需单独奖励模型，通过组内相对优势估计优化策略
- 教材实战覆盖 SFT → GRPO 的完整 pipeline ^[extracted]

---

## 6. 关联阅读

- [[模型训练/Alignment/GRPO_and_New_Alignment_Methods]] — GRPO 与新对齐方法
- [[模型训练/Alignment/TRL_RLHF_DPO_Guide]] — TRL RLHF/DPO 实战
- [[强化学习/RL_Fundamentals]] — 强化学习基础
- [[强化学习/Deep_RL/README]] — 深度强化学习
- [[Agent/Hello_Agents_L04_ReAct]] — ReAct 多步推理范式
