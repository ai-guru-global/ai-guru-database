---
title: "PPO（Proximal Policy Optimization）"
category: -concepts
tags: [ppo, reinforcement-learning, policy-gradient, clip, rlhf, actor-critic]
aliases:
  - "PPO"
  - "Proximal Policy Optimization"
  - "近端策略优化"
relationships:
  - target: "概念/rlhf"
    type: belongs_to
  - target: "概念/dpo"
    type: alternative
  - target: "概念/grpo"
    type: alternative
  - target: "概念/reinforcement-learning"
    type: belongs_to
sources:
  - 07_模型训练/06_Alignment/TRL_RLHF_DPO_Guide.md
  - 06_强化学习/
summary: "PPO（Proximal Policy Optimization）是 OpenAI 2017 提出的策略梯度算法，通过 clip 机制稳定训练；是 RLHF 时代对齐 LLM 的事实标准算法（DPO / GRPO 等简化方法都源于 PPO 思想）。"
lifecycle: reviewed
tier: core
updated: 2026-07-25
provenance:
  extracted: 0.90
  inferred: 0.08
  ambiguous: 0.02
base_confidence: 0.92
created: 2026-06-24
updated: 2026-06-24
name_zh: "近端策略优化"
---

# PPO（Proximal Policy Optimization）

> 中文简称：近端策略优化

## 核心要点

- **提出**：Schulman et al., 2017（OpenAI）
- **核心创新**：用 **clip 机制**限制策略更新幅度，使训练稳定。
- **核心公式**：
  ```
  L_PPO = min(ratio · A, clip(ratio, 1-ε, 1+ε) · A)
  ratio = π_new(a|s) / π_old(a|s)
  ```
- **应用**：
  - RLHF（InstructGPT、ChatGPT）
  - 游戏 AI（OpenAI Five、Dota）
  - 机器人控制
  - 所有 RLHF 衍生方法的基础

## 一句话解释

> PPO = "稳定版的策略梯度算法"；通过 clip 限制每次更新幅度，让训练不发散；RLHF 的奠基算法。

## 核心机制

### Clip 机制

```python
def ppo_loss(policy, old_policy, states, actions, advantages, clip_range=0.2):
    # 新旧策略的概率比
    ratio = policy.log_prob(states, actions) - old_policy.log_prob(states, actions)
    ratio = torch.exp(ratio)
    
    # PPO clip 目标
    surr1 = ratio * advantages
    surr2 = torch.clamp(ratio, 1 - clip_range, 1 + clip_range) * advantages
    
    # 取两者较小值（悲观下界）
    policy_loss = -torch.min(surr1, surr2).mean()
    
    # 价值函数损失（Critic）
    value_loss = F.mse_loss(policy.value(states), returns)
    
    # KL 惩罚（防止偏离太远）
    kl_penalty = beta * kl_divergence(policy, old_policy)
    
    return policy_loss + value_loss + kl_penalty
```

## 在 RLHF 中的角色

```
Step 1: SFT (有监督微调)
   ↓ 输出 SFT 模型
Step 2: 训练 Reward Model
   ↓ 输入: (prompt, response_A, response_B, human_preference)
   ↓ 输出: scalar reward score
Step 3: PPO 优化 Policy
   ↓ 目标: max E[reward] - β·KL(SFT || π)
   ↓ 输入: (prompt, response, reward_score)
   ↓ 输出: 对齐后的 Policy
```

## 关键超参

| 超参 | 推荐值 | 说明 |
|------|--------|------|
| `clip_range` | 0.2 | 策略更新幅度限制 |
| `beta` (KL) | 0.01-0.05 | KL 惩罚强度 |
| `learning_rate` | 1e-5 (Actor) / 1e-5 (Critic) | 极低 |
| `batch_size` | 64-256 | 每步采样数 |
| `epochs` | 3-4 | 每步数据复用次数 |
| `gae_lambda` | 0.95 | GAE 参数 |
| `gamma` | 0.99 | 折扣因子 |

## 变种

| 变种 | 改进 |
|------|------|
| **PPO-Clip** | 标准版本（最常用）|
| **PPO-Penalty** | 用 KL 惩罚代替 clip |
| **GRPO** | 去掉 Critic，用组内对比 |
| **TRPO** | PPO 的前作，KL 约束更严格 |
| **A2C / A3C** | Actor-Critic 基线版本 |

## 与 DPO 的对比

| 维度 | PPO | DPO |
|------|-----|-----|
| Reward Model | 需要 | 不需要 |
| Critic 网络 | 需要 | 不需要 |
| 训练阶段 | 3（SFT / RM / PPO）| 2（SFT / DPO）|
| 在线采样 | 需要（rollout）| 不需要 |
| 显存 | 高（4x 模型）| 中（2x 模型）|
| 训练稳定性 | 中（易崩）| 高 |
| 效果 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 代表 | ChatGPT、Claude | Llama 3 |

## 何时使用

✅ **推荐**：
- 训练对齐 LLM（与 RM 配合）
- 有大量算力（可训练 Critic）
- 需要在线策略（PPO 支持）
- RLHF 标准流程

⚠️ **不推荐**：
- 资源受限（用 DPO 替代）
- 没有 Reward Model（用 DPO/KTO）
- 小数据（用 IPO）
- 想要单阶段（用 ORPO）

## 主流实现

- **TRL**（HuggingFace）：`PPOTrainer`
- **OpenRLHF**：大规模分布式 PPO
- **DeepSpeed-Chat**：Microsoft 出品
- **Verl**（字节）：高性能 PPO 框架
- **Stable-Baselines3**：通用 RL

## 源码级洞察（基于 trl v1.9.0 归档源码）

归档位置：`code/llm-frameworks/trl-v1.9.0/`（PyPI sdist）。

- **重要事实：PPO 已被移出 TRL 核心 API**。`PPOTrainer` 现位于 `experimental/ppo/ppo_trainer.py` L297，不再在核心 `trl/trainer/` 目录（核心只保留 SFT/DPO/GRPO/RLOO/KTO/Reward 六个）。这是"PPO→DPO/GRPO 演进"的最直接工程证据。
- **免 Critic 替代者入位**：`trainer/rloo_trainer.py` L1513-1544 用 leave-one-out 组内均值基线替代价值网络；`trainer/grpo_trainer.py` 用组内标准化优势——两者都省掉了 PPO 的 Critic，显存减半。
- **PPO 的 clip 思想仍在**：GRPO 的 `_compute_loss`（`trainer/grpo_trainer.py` L2991）保留了 PPO 式重要性采样比率截断（clip）目标——PPO 没有消失，而是以简化形态延续。

详见 [[07_模型训练/06_Alignment/RLHF_at_Scale_2026]] 第 13 节。

## Related

- [[概念/rlhf]] — RLHF 总览
- [[概念/dpo]] — DPO（PPO 简化版）
- [[概念/grpo]] — GRPO（PPO 改进版，去 Critic）
- [[概念/reinforcement-learning]] — 强化学习
- [[概念/orpo]] / [[概念/ipo]] / [[概念/kto]] — 偏好学习变种
- [[概念/preference-learning]] — 偏好学习总览

---

## 2026 PPO 生态

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **TRL** | HuggingFace 原生 | 通用场景 |
| **OpenRLHF** | 大规模分布式 | 生产环境 |
| **DeepSpeed-Chat** | 微软出品 | DeepSpeed 生态 |
| **Verl** | 字节高性能 | 超大规模 |

## 生产最佳实践

1. **奖励模型**：定期更新奖励模型，避免奖励黑客
2. **KL 约束**：保持与参考模型的 KL 散度在合理范围
3. **clip 调优**：从 0.2 开始，根据训练稳定性调整
4. **与 DPO/GRPO 对比**：资源充足用 PPO，受限用 DPO/GRPO
5. **监控指标**：关注奖励均值、KL 散度、策略熔

## 2026 PPO 生态现状

| 框架/工具 | 支持 | 特色 | 状态 |
|------|------|------|------|
| TRL (HuggingFace) | ✅ | PPOTrainer | ✅ 主流 |
| OpenRLHF | ✅ | 分布式 PPO | ✅ 主流 |
| DeepSpeed-Chat | ✅ | 微软全栈 | ✅ 成熟 |
| ColossalChat | ✅ | 易用 | ✅ 主流 |
| veRL (Volcano) | ✅ | 字节跳动 | ✅ 前沿 |

## 延伸阅读

- [[概念/Training/rlhf|RLHF]] — 人类反馈强化学习
- [[概念/Training/grpo|GRPO]] — 组相对策略优化
- [[概念/Training/reward-modeling|Reward Modeling]] — 奖励建模
- [[概念/Training/dpo|DPO]] — 直接偏好优化
- [[概念/Training/preference-learning|Preference Learning]] — 偏好学习

> ℹ️ PPO 是 RLHF 的经典算法，2026年仍是大厂对齐首选，但 DPO/GRPO 在资源受限场景更受欢迎。

## 检查清单

- [ ] 奖励模型已训练并验证
- [ ] KL 约束已配置
- [ ] clip 参数已调优
- [ ] 监控看板已配置
- [ ] 回退策略已准备