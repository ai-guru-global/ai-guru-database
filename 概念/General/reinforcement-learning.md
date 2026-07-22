---
title: 强化学习
category: -concepts
tags: ["reinforcement-learning", "mdp", "q-learning", "policy-gradient", "exploration"]
aliases: [Reinforcement unsupervised-learning, RL, 强化学习基础]
relationships:
  - target: "[[概念/deep-reinforcement-learning]]"
    type: related_to
  - target: "概念/rlhf"
    type: related_to
  - target: "概念/ai-agents"
    type: related_to
sources:
  - 强化学习/RL_Foundations/RL_Foundations.md
summary: 强化学习通过智能体与环境交互试错学习最优策略，MDP是其数学基础，Q-Learning和策略梯度是两大算法族。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
---

# 强化学习

强化学习（Reinforcement Learning, RL）是机器学习第三大范式，通过智能体（ai-agents）与环境（Environment）的交互试错学习最优策略。与监督学习的根本区别：反馈是延迟的标量奖励信号而非即时标签，数据是时序相关而非i.i.d.。RL是深度强化学习和RLHF的理论基础，也支撑着AI智能体的决策能力。

## 核心要点

- MDP五元组 ⟨S, A, P, R, γ⟩ 是RL的数学基础，马尔可夫性质使问题可解
- **值函数**评估状态/动作的好坏：$V^\pi(s) = \mathbb{E}_\pi[\sum \gamma^t r_t]$，**策略**定义动作选择规则
- **贝尔曼方程**建立值函数的递归结构：$V(s) = \max_a [R(s,a) + \gamma \sum P(s'|s,a) V(s')]$
- **探索-利用困境**是RL核心挑战：ε-贪心、UCB、Thompson Sampling是三种主流探索策略
- Q-Learning是Off-Policy经典算法，SARSA是On-Policy对应方案

## 详细内容

### 核心算法谱系

| 算法 | 类型 | 特点 | 适用条件 |
|------|------|------|---------|
| 策略迭代 | 动态规划 | 已知模型 | 小规模MDP |
| 价值迭代 | 动态规划 | 已知模型 | 小规模MDP |
| 蒙特卡洛 | 无模型 | 需完整轨迹 | 分幕式任务 |
| TD(0) | 无模型 | 一步更新 | 通用 |
| Q-Learning | Off-Policy | 无模型 | 通用 |
| SARSA | On-Policy | 无模型 | 安全探索 |

### 贝尔曼方程

贝尔曼方程是RL的数学核心，将无限时间步的累积奖励转化为递推关系。贝尔曼期望方程用于策略评估，贝尔曼最优方程用于求解最优策略。直觉："一个状态的价值等于即时奖励加上未来状态的折扣价值"。

### Q-Learning更新规则

$$Q(S,A) \leftarrow Q(S,A) + \alpha [R + \gamma \max_{a'} Q(S',a') - Q(S,A)]$$

关键特性：Off-Policy（行为策略和目标策略不同）、使用max操作估计未来最优值、在满足访问所有(s,a)对无限次条件下收敛到Q*。

### 探索策略对比

| 策略 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| ε-贪心 | 概率ε随机探索 | 简单 | 盲目随机 |
| UCB | Q值+不确定性项 | 理论保证 | 需统计次数 |
| Thompson Sampling | 从后验分布采样 | 贝叶斯框架 | 计算复杂 |

### On-Policy vs Off-Policy

| 维度 | On-Policy | Off-Policy |
|------|-----------|------------|
| 定义 | 评估和改进同一策略 | 用行为策略采样，评估目标策略 |
| 数据效率 | 低 | 高（可重用历史数据） |
| 稳定性 | 更稳定 | 容易发散 |
| 代表算法 | SARSA, A3C, PPO | Q-Learning, deep-reinforcement-learning, SAC |

### 关键挑战

**奖励稀疏**：只在最终成功时有奖励。解决方案：奖励塑造、课程学习、分层RL、好奇心驱动、HER（后见之明经验回放）。

**信用分配**：长序列中判断哪些动作关键。方法：n-步回报、资格迹TD(λ)、优势函数 $A(s,a) = Q(s,a) - V(s)$。

**奖励设计**：不当奖励导致意外行为。经典案例：让机器人快速到达目标，结果学会原地打转刷速度奖励。需仔细检查奖励函数避免漏洞。

### 前沿方向

Offline RL（从固定数据集学习，BCQ/CQL）、Meta-RL（快速适应新任务，MAML/RL²）、Safe RL（约束优化避免危险动作）、Model-Based RL（学习环境模型提高效率，World world-models-jepa/MuZero）、多智能体RL（博弈与协作）。

## 开放问题

- 奖励设计不当可能导致智能体学到错误策略（奖励破解/Reward Hacking） ^[ambiguous]
- 样本效率低（需百万级交互）限制了RL在真实世界的应用
- 安全强化学习（Safe RL）的约束满足仍有理论差距
- 从离线数据集学习（Offline RL）的分布偏移问题尚未完全解决

## 来源

- 强化学习/RL_Foundations/RL_Foundations.md

## Related

- [[强化学习/AI_Agents/AI_Agents_for_dummy]] — AI智能体 - 小白版 🤖 (共享: mdp, reinforcement-learning, rl)
- [[强化学习/AI_Agents/Agent-in-nutshell]] — AI 智能体速成指南 (共享: mdp, reinforcement-learning, rl)
- [[强化学习/AI_Agents/Agent_Future_Roadmap_2026_2030]] — Agent 未来发展路线图 2026-2030 (共享: mdp, reinforcement-learning, rl)
- [[强化学习/AI_Agents/Agent_Protocols_Detail]] — AI Agent 协议详解：MCP、A2A、UCP (共享: mdp, reinforcement-learning, rl)

---

## 2026 强化学习生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **RLHF** | 人类反馈强化学习 | GA |
| **PPO** | 近端策略优化 | GA |
| **DPO** | 直接偏好优化 | GA |
| **GRPO** | 组相对策略优化 | GA |
| **Agent RL** | Agent 强化学习 | 研究 |

## 生产最佳实践

1. **RLHF 对齐**：LLM 对齐用 RLHF/DPO
2. **PPO 训练**：RL 训练用 PPO
3. **DPO 简化**：简化对齐用 DPO
4. **奖励设计**：合理设计奖励函数
5. **与 SFT 配合**：SFT + RL 配合

## RL 算法对比

| 算法 | 类型 | 优势 | 适用场景 |
|------|------|------|----------|
| **PPO** | On-policy | 稳定、通用 | RLHF 对齐 |
| **DPO** | Off-policy | 无需 RM | 简化对齐 |
| **GRPO** | Group | 无需 Critic | 推理模型 |
| **SAC** | Off-policy | 探索强 | 连续控制 |
| **TD3** | Off-policy | 稳定 | 机器人控制 |

## RLHF 训练流程

```text
SFT 模型 → Reward Model 训练 → PPO/DPO 对齐 → 对齐后模型
    │              │                    │
    │         人类偏好数据          奖励信号
    │              │                    │
  监督微调      排序/评分          策略优化
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 奖励 hacking | 模型钻奖励漏洞 | 多维度奖励 + KL 约束 |
| 训练不稳定 | PPO 参数不当 | 调整 clip、lr |
| 模式崩塌 | 探索不足 | 增大熵奖励 |
| RM 过拟合 | 偏好数据少 | 数据增强 + 正则化 |
| 对齐税 | 对齐后能力下降 | 平衡 KL 系数 |

## 版本兼容性

| 工具 | 版本 | 说明 |
|------|------|------|
| TRL | 0.9+ | RLHF 训练 |
| OpenRLHF | 最新 | 分布式 RLHF |
| DeepSpeed-Chat | 最新 | RLHF 流水线 |
| Stable Baselines3 | 2.x | 经典 RL |

## 生产检查清单

1. SFT 后再进行 RL 对齐
2. 奖励函数多维度设计
3. 监控 KL 散度防止过度偏移
4. 定期评估对齐效果
5. 建立人类偏好数据集
6. 跟踪奖励 hacking 风险

## 版本兼容性

| 算法/工具 | 版本 | 特性 | 适用场景 |
|------|------|------|------|
| **PPO (TRL)** | ≥ 0.8 | RLHF 标准 | LLM 对齐 |
| **DPO** | 2023+ | 无奖励模型 | 简化对齐 |
| **GRPO** | 2025+ | 组内相对优化 | 推理模型 |
| **Stable Baselines3** | ≥ 2.3 | 经典 RL | 游戏/控制 |
| **RLlib (Ray)** | ≥ 2.10 | 分布式 RL | 大规模训练 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 奖励 hacking | 模型钻奖励漏洞 | 多维度奖励 + KL 约束 |
| 训练不稳定 | PPO 超参敏感 | 调整 clip_range + lr |
| 模式崩塌 | 多样性不足 | 添加探索奖励 + 温度采样 |
| 计算成本高 | 多模型并行 | 使用 DPO/GRPO 简化流程 |

## 总结

强化学习是 LLM 对齐的核心技术，RLHF/DPO 使模型输出更符合人类偏好。2026 年 GRPO 等新算法进一步简化了推理模型训练。

> 💡 RL 在 LLM 中的核心价值：SFT 教模型“会说话”，RL 教模型“说人话”——对齐是让 AI 真正有用的关键一步。

