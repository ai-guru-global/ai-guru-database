---
title: "Preference Learning（偏好学习）"
category: -concepts
tags: [preference-learning, rlhf, dpo, alignment, human-feedback, ranking]
aliases:
  - "Preference Learning"
  - "偏好学习"
relationships:
  - target: "概念/rlhf"
    type: belongs_to
  - target: "概念/dpo"
    type: includes
  - target: "概念/ppo"
    type: includes
  - target: "概念/kto"
    type: includes
sources:
  - 07_模型训练/06_Alignment/
summary: "Preference Learning（偏好学习）是 RLHF / DPO / IPO / KTO 等所有基于人类偏好训练方法的总称；通过学习"哪个回答更好"而非绝对正确来对齐模型。"
lifecycle: reviewed
tier: core
updated: 2026-07-21
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-06-24
name_zh: "偏好学习"
---

# Preference Learning（偏好学习）

> 中文简称：偏好学习

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

- [[概念/rlhf]] — RLHF 总览
- [[概念/dpo]] / [[概念/ppo]] / [[概念/kto]] / [[概念/ipo]] / [[概念/orpo]] / [[概念/grpo]]
- [[概念/sft]] — SFT（偏好学习的前置阶段）
- [[概念/simpo]] — SimPO（无参考模型偏好优化）
- [[07_模型训练/06_Alignment/index]] — 对齐章节

---

## 2026 偏好学习算法对比

| 算法 | 数据格式 | 需要奖励模型 | 复杂度 | 适用场景 |
|------|---------|-------------|--------|----------|
| **PPO-RLHF** | 成对偏好 | ✅ | 高 | 高质量对齐 |
| **DPO** | 成对偏好 | ❌ | 中 | 有 A/B 数据 |
| **GRPO** | 组内采样 | ❌ | 中 | 资源受限 |
| **KTO** | 二元反馈 | ❌ | 低 | 只有 👍/👎 |
| **SimPO** | 成对偏好 | ❌ | 低 | 无参考模型 |

## 生产最佳实践

1. **算法选择**：根据数据格式和资源选择合适算法
2. **数据质量**：偏好数据需明确标准，避免模糊标注
3. **迭代优化**：收集用户反馈持续迭代偏好数据
4. **评估体系**：自动指标 + 人类评估结合
5. **与 SFT 配合**：SFT 打好基础，偏好学习精调对齐

## 2026 偏好学习生态现状

| 方法 | 需要 RM | 需要参考模型 | 特色 | 状态 |
|------|------|------|------|------|
| PPO | ✅ | ✅ | 经典 RLHF | ✅ 成熟 |
| DPO | ❌ | ✅ | 简化、稳定 | ✅ 主流 |
| GRPO | ❌ | ✅ | 组内排序 | ✅ 前沿 |
| KTO | ❌ | ✅ | 单样本 | ✅ 主流 |
| ORPO | ❌ | ❌ | 最简化 | ✅ 主流 |
| SimPO | ❌ | ❌ | 无参考 | ✅ 前沿 |

## 检查清单

- [ ] 偏好数据已收集并验证质量
- [ ] 方法已根据资源和目标选择
- [ ] 超参已调优
- [ ] 评估体系已建立（自动 + 人工）
- [ ] 与 SFT 基线已对比
- [ ] 迭代优化流程已建立

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 对齐效果差 | 数据质量低 | 提升数据质量和多样性 |
| 过拟合偏好 | 迭代太多 | 早停 + 正则化 |
| 生成质量下降 | KL 约束太弱 | 增大 KL 系数 |
| 训练不稳定 | 学习率太高 | 降低 lr + warmup |

## 延伸阅读

- [[概念/Training/rlhf|RLHF]] — 人类反馈强化学习
- [[概念/Training/ppo|PPO]] — 近端策略优化
- [[概念/Training/grpo|GRPO]] — 组相对策略优化
- [[概念/Training/dpo|DPO]] — 直接偏好优化
- [[概念/Training/kto|KTO]] — KTO 对齐

> ℹ️ 偏好学习是 LLM 对齐的核心环节，2026年 DPO/GRPO 替代 PPO 成主流，数据质量始终是第一要素。

## 方法选择指南

```
资源充足 + 效果优先 → PPO
资源受限 + 简化流程 → DPO
数学/代码推理 → GRPO
数据稀缺 → KTO
最简化 → ORPO/SimPO
```

> ℹ️ 偏好学习是 LLM 对齐的核心，数据质量始终是第一要素。

## 延伸阅读

- [[概念/Training/rlhf|RLHF]] — 人类反馈强化学习
- [[概念/Training/dpo|DPO]] — 直接偏好优化