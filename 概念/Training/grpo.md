---
title: "GRPO（Group Relative Policy Optimization）"
category: -concepts
tags: [grpo, deepseek-r1, rlhf, alignment, reinforcement-learning, policy-optimization]
aliases:
  - "GRPO"
  - "Group Relative Policy Optimization"
  - "组内相对策略优化"
relationships:
  - target: "概念/rlhf"
    type: belongs_to
  - target: "概念/dpo"
    type: alternative
  - target: "概念/ppo"
    type: alternative
  - target: "概念/reasoning-models"
    type: applied_in
sources:
  - 07_模型训练/06_Alignment/GRPO_and_New_Alignment_Methods.md
summary: "GRPO（Group Relative Policy Optimization）是 DeepSeek 在 R1 模型中提出的对齐算法，无需 Critic 模型，通过组内多个采样响应的相对优势进行策略优化，比 PPO 更简单高效。"
lifecycle: reviewed
tier: core
updated: 2026-07-21
provenance:
  extracted: 0.90
  inferred: 0.08
  ambiguous: 0.02
base_confidence: 0.92
created: 2026-06-24
updated: 2026-06-24
---

# GRPO（Group Relative Policy Optimization）

## 核心要点

- **核心创新**：用同一 prompt 的多次采样（group）内的**相对奖励**估计优势，去除 Critic 网络。
- **提出者**：DeepSeek（DeepSeek-R1 论文，2025-01）
- **核心优势**：
  - 无需训练 Critic（节省 50%+ 显存）
  - 训练稳定性更好
  - 与 R1 类推理模型结合极佳
- **代表应用**：DeepSeek-R1、QwQ、Open-R1 等

## 一句话解释

> GRPO = "PPO 去掉 Critic，用组内对比代替"；省钱又稳定，R1 的核心训练算法。

## 算法对比

| 算法 | Critic | 优势估计 | 显存 | 代表 |
|------|--------|---------|------|------|
| **PPO** | 必需 | 绝对优势 | 高 | InstructGPT、Claude |
| **GRPO** | 不需要 | 组内相对 | 中（节省 50%）| DeepSeek-R1 |
| **DPO** | 不需要 | 直接拟合偏好 | 低 | Llama 3 |
| **RLOO** | 不需要 | Leave-One-Out | 低 | Mistral |

## 工作流程

```
1. 每个 prompt 采样 G 个 response: {r_1, r_2, ..., r_G}
2. 用 Reward Model 给每个 response 打分: {s_1, s_2, ..., s_G}
3. 计算组内相对优势:
   A_i = (s_i - mean(s_1..s_G)) / std(s_1..s_G)
4. PPO 风格策略更新，但 advantage 用组内相对值
5. KL 惩罚项约束策略偏移（SFT 模型为参照）
```

## 关键公式

```python
# GRPO 目标函数
def grpo_objective(prompt, group_responses, rewards, ref_logprobs, beta=0.04):
    # 组内相对优势
    advantages = (rewards - rewards.mean()) / (rewards.std() + 1e-8)
    
    # 当前策略对数概率
    policy_logprobs = compute_logprobs(prompt, group_responses)
    
    # 重要性采样比率
    ratio = torch.exp(policy_logprobs - ref_logprobs)
    
    # PPO clip 目标
    surr1 = ratio * advantages
    surr2 = torch.clamp(ratio, 1 - 0.2, 1 + 0.2) * advantages
    policy_loss = -torch.min(surr1, surr2).mean()
    
    # KL 惩罚
    kl_penalty = beta * (policy_logprobs - ref_logprobs).mean()
    
    return policy_loss + kl_penalty
```

## 关键超参

| 超参 | 推荐值 | 说明 |
|------|--------|------|
| `group_size` (G) | 8-16 | 每 prompt 采样数 |
| `beta` (KL) | 0.01-0.04 | KL 惩罚强度 |
| `clip_range` | 0.2 | PPO clip 范围 |
| `learning_rate` | 1e-6 | 比 SFT 低 1-2 数量级 |
| `reward_model` | 需要 | 用偏好 RM 或规则 RM |

## 何时使用

✅ **推荐**：
- 训练推理模型（数学 / 代码 / 逻辑）
- 没有足够预算训练 Critic
- 想复用现有 Reward Model
- 训练数据有限（组内对比提供更多学习信号）

⚠️ **不推荐**：
- 极复杂奖励工程（PPO 更灵活）
- 单次采样（GRPO 需要 group_size > 1）

## 训练基础设施

| 框架 | GRPO 支持 |
|------|----------|
| **TRL**（HuggingFace）| ✅ 原生支持 |
| **OpenRLHF** | ✅ |
| **Unsloth** | ✅ |
| **LLaMA-Factory** | ✅ |
| **verl**（字节）| ✅ 大规模 |

## Related

- [[概念/rlhf]] — RLHF 总览
- [[概念/dpo]] — DPO（另一种简化方法）
- [[概念/ppo]] — PPO（GRPO 的“父算法”）
- [[概念/reasoning-models]] — 推理模型（GRPO 主要应用场景）
- [[概念/preference-learning]] — 偏好学习总览
- [[07_模型训练/06_Alignment/GRPO_and_New_Alignment_Methods]] — GRPO 深度

---

## 2026 GRPO 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **DeepSeek-R1** | GRPO 原生应用 | GA |
| **TRL 集成** | HuggingFace 原生支持 | GA |
| **多框架支持** | OpenRLHF/Unsloth/LLaMA-Factory | GA |
| **在线 GRPO** | 结合在线采样的迭代式 | 研究前沿 |

## 生产最佳实践

1. **组大小**：建议 8-16 个采样，平衡效果与成本
2. **温度设置**：采样温度 0.7-1.0，确保多样性
3. **与 DPO 对比**：推理任务用 GRPO，通用对齐用 DPO
4. **奖励设计**：可验证任务用规则奖励，开放任务用奖励模型
5. **监控指标**：关注奖励均值、KL 散度、响应多样性

## 2026 GRPO 生态现状

| 框架/工具 | 支持 | 特色 | 状态 |
|------|------|------|------|
| TRL (HuggingFace) | ✅ | GRPOTrainer | ✅ 主流 |
| OpenRLHF | ✅ | 分布式 | ✅ 主流 |
| veRL (Volcano) | ✅ | 字节跳动 | ✅ 前沿 |
| LLaMA-Factory | ✅ | 集成支持 | ✅ 主流 |
| verl (open-source) | ✅ | 社区版 | ✅ 前沿 |

## 检查清单

- [ ] 奖励函数已设计（规则/模型）
- [ ] 组大小已设置（通常 8-16）
- [ ] KL 约束已配置
- [ ] 响应多样性已监控
- [ ] 评估基准已建立
- [ ] 与 DPO/PPO 效果已对比

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 奖励不提升 | 奖励函数设计差 | 重新设计奖励 |
| 多样性下降 | KL 约束太弱 | 增大 KL 系数 |
| 训练不稳定 | 组大小太小 | 增大组大小 |
| 过拟合奖励 | 迭代太多 | 早停 + 正则化 |

## 延伸阅读

- [[概念/Training/ppo|PPO]] — 近端策略优化
- [[概念/Training/dpo|DPO]] — 直接偏好优化
- [[概念/Training/rlhf|RLHF]] — 人类反馈强化学习
- [[概念/Training/reward-modeling|Reward Modeling]] — 奖励建模
- [[概念/Training/preference-learning|Preference Learning]] — 偏好学习

> ℹ️ GRPO 是 2026 年数学/代码推理任务的首选对齐算法，组内相对排序无需显式奖励模型，DeepSeek-R1 验证了其效果。

## 性能参考

| 任务 | 提升 | 训练时间 | 显存 |
|------|------|------|------|
| 数学 (MATH) | +15-25% | 4-8h | 48 GB |
| 代码 (HumanEval) | +10-20% | 4-8h | 48 GB |
| 通用对话 | +5-10% | 2-4h | 24 GB |
| 逻辑推理 | +10-15% | 4-8h | 48 GB |

> ℹ️ GRPO 在数学/代码推理任务上效果显著，是 DeepSeek-R1 的核心对齐算法。