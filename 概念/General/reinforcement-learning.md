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
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
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
