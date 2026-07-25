---
title: Reinforcement Learning
type: index
created: 2026-07-02
updated: 2026-07-02
sources: []
---

# Reinforcement Learning

This page indexes the contents of `强化学习`.

## Subdirectories

- [[06_强化学习/02_Deep_RL/index|Deep RL]]
- [[06_强化学习/01_RL_Foundations/index|RL Foundations]]
- [[06_强化学习/05_Robotics_Embodied_AI/index|Robotics Embodied AI]]

## Files

- [[06_强化学习/Multi_Agent_RL|Multi Agent RL]]
- [[06_强化学习/Multi_Agent_Systems|Multi Agent Systems]]
- [[06_强化学习/README|README]]
- [[06_强化学习/README_for_dummy|README For Dummy]]
- [[06_强化学习/RL-in-nutshell|RL In Nutshell]]
- [[06_强化学习/RL_Fundamentals|RL Fundamentals]]
- [[06_强化学习/RLHF_DPO_GRPO_Deep_Dive|RLHF DPO GRPO Deep Dive]]

## 核心概念

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| 马尔可夫决策过程 | MDP 框架 | RL 问题建模 |
| 价值函数 | 状态/动作价值估计 | Q-Learning |
| 策略梯度 | 直接优化策略 | REINFORCE |
| Actor-Critic | 结合价值与策略 | PPO, SAC |
| RLHF | 人类反馈强化学习 | LLM 对齐 |

## 子域简介

| 子域 | 核心主题 | 文件数 |
|------|----------|--------|
| RL Foundations | RL 基础理论 | 4 |
| Deep RL | 深度强化学习 | 7 |
| Robotics Embodied AI | 具身智能 | 7 |
| RLHF Alignment | 对齐技术 | 1 |
| Sim to Real | 仿真迁移 | 1 |
| RL Applications | 应用实践 | 1 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | RL Foundations | 理解 RL 基础 |
| 进阶 | Deep RL | 掌握深度 RL |
| 实践 | RLHF/DPO | LLM 对齐 |
| 前沿 | Robotics Embodied AI | 具身智能 |

## 常见问题

| 问题 | 解答 |
|------|------|
| RL 与监督学习的区别？ | RL 通过交互学习，无需标注数据 |
| 入门需要什么基础？ | 概率论 + 线性代数 + Python |
| RLHF 是什么？ | 用人类反馈训练 LLM |
| 学习周期多长？ | 3-6 个月入门 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域总数 | 6 |
| 文件总数 | 20+ |
| 核心算法 | 10+ |
| 2026 热点 | RLHF、具身智能、VLA |

> 💡 强化学习是 AI 从“感知”走向“决策”的核心技术，2026 年在 LLM 对齐和具身智能领域发挥关键作用。

## 附录：强化学习知识图谱

| 知识节点 | 前置依赖 | 后续延伸 |
|----------|----------|----------|
| RL 基础 | 概率论、线代 | 所有 RL 算法 |
| 深度 RL | RL 基础 + DL | RLHF、机器人 |
| RLHF | RL + NLP | LLM 对齐 |
| 具身智能 | RL + 机器人 | VLA、Sim2Real |
| 多智能体 | RL + 博弈论 | 协作/竞争 |

## 附录：强化学习术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 策略 | Policy | 状态到动作映射 |
| 价值函数 | Value Function | 长期回报估计 |
| 奖励 | Reward | 环境反馈信号 |
| 探索 | Exploration | 尝试新动作 |
| 利用 | Exploitation | 使用已知最优 |

## 强化学习算法分类

| 分类维度 | 类型 | 代表算法 | 特点 |
|----------|------|----------|------|
| 值函数方法 | 离散动作 | DQN, Double DQN | 学习Q值 |
| 策略梯度 | 连续/离散 | PPO, REINFORCE | 直接优化策略 |
| Actor-Critic | 连续 | SAC, TD3, A3C | 结合两者优势 |
| 模型基础 | 任意 | Dreamer, MBPO | 学习环境模型 |
| 离线RL | 任意 | CQL, Decision Transformer | 无需在线交互 |
| 多智能体 | 任意 | MAPPO, QMIX | 协作/竞争 |

## 子域导航

| 子域 | 内容 | 难度 |
|------|------|------|
| RL_Foundations/ | MDP、Q-Learning、策略梯度 | ⭐ |
| Deep_RL/ | DQN、PPO、SAC、Decision Transformer | ⭐⭐ |
| RLHF_Alignment/ | RLHF、DPO、GRPO | ⭐⭐⭐ |
| Multi_Agent_RL/ | 多智能体协作与博弈 | ⭐⭐⭐ |
| Robotics_Embodied_AI/ | VLA、人形机器人 | ⭐⭐⭐ |
| Sim_to_Real/ | 仿真到现实迁移 | ⭐⭐ |
| RL_Applications/ | 游戏/推荐/控制应用 | ⭐⭐ |

## 学习路径建议

| 阶段 | 时间 | 目标 | 推荐资源 |
|------|------|------|----------|
| 入门 | 1-2周 | 理解MDP、奖励、策略 | RL_Foundations/ |
| 进阶 | 3-4周 | 掌握DQN、PPO | Deep_RL/ |
| 对齐 | 2周 | 理解RLHF/DPO | RLHF_Alignment/ |
| 实践 | 持续 | 动手项目 | Gymnasium + SB3 |

## 常见问题

| 问题 | 解答 |
|------|------|
| RL的核心挑战是什么？ | 探索-利用平衡、延迟奖励、样本效率、训练稳定性 |
| 深度RL和传统RL的区别？ | 用深度网络替代表格，处理高维状态空间 |
| RLHF为什么重要？ | 让LLM输出符合人类偏好，是ChatGPT的核心技术 |
| 学RL需要什么前置？ | Python + 概率论 + 基本微积分 + 线性代数 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域数量 | 7 |
| 文档总数 | 20+ |
| 核心算法 | 15+ |
| 覆盖应用 | 游戏/机器人/LLM/推荐 |

> 💡 强化学习是AI从“感知”走向“决策”的核心桥梁。2026年，RL与LLM的融合（RLHF/GRPO）和具身智能是最活跃的研究方向。

## 附录：知识图谱

| 知识节点 | 前置依赖 | 后续延伸 |
|----------|----------|----------|
| MDP基础 | 概率论 | Q-Learning、策略梯度 |
| Q-Learning | MDP基础 | DQN、Double DQN |
| 策略梯度 | 微积分、MDP | REINFORCE、PPO |
| Actor-Critic | 策略梯度+值函数 | SAC、TD3、A3C |
| DQN | Q-Learning+深度网络 | Rainbow、离线RL |
| PPO | 策略梯度+截断 | RLHF、机器人控制 |
| RLHF | PPO+奖励模型 | DPO、GRPO |
| 多智能体RL | 博弈论+RL | 协作/竞争场景 |
| Sim-to-Real | 仿真环境+域随机化 | 具身智能 |
| VLA模型 | 多模态+RL | 机器人操作 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 马尔可夫决策过程 | MDP | RL的数学框架 |
| 贝尔曼方程 | Bellman Equation | 价值函数递推关系 |
| 经验回放 | Experience Replay | 存储并重用转换 |
| 目标网络 | Target Network | 稳定训练的延迟更新网络 |
| 优势函数 | Advantage Function | A(s,a)=Q(s,a)-V(s) |
| 广义优势估计 | GAE | 平衡偏差与方差 |
| 域随机化 | Domain Randomization | Sim-to-Real核心技术 |
| 奖励塑形 | Reward Shaping | 设计中间奖励加速学习 |

## 附录：快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 零基础入门RL | RL_Foundations/ | ⭐ |
| 理解DQN原理 | Deep_RL/DQN_Deep_Dive | ⭐⭐ |
| 掌握PPO实现 | Deep_RL/PPO_Deep_Dive | ⭐⭐ |
| 了解RLHF对齐 | RLHF_Alignment/ | ⭐⭐⭐ |
| 学习具身智能 | Robotics_Embodied_AI/ | ⭐⭐⭐ |
| 多智能体协作 | Multi_Agent_RL/ | ⭐⭐⭐ |
| Sim-to-Real迁移 | Sim_to_Real/ | ⭐⭐ |
| RL应用全景 | RL_Applications/ | ⭐⭐ |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解MDP建模 | 状态/动作/奖励/转移 | ☐ |
| 掌握值函数方法 | Q-Learning/SARSA | ☐ |
| 理解策略梯度 | REINFORCE/PPO | ☐ |
| 了解RLHF | 奖励模型+PPO | ☐ |
| 动手实践 | Gymnasium环境 | ☐ |

---
*Last updated: 2026-07-21*
