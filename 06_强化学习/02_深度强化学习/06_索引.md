---
title: Deep RL
type: index
created: 2026-07-02
updated: 2026-07-11
sources: []
tags: [auto-index]
name_zh: "深度强化学习"
name_en: "Deep RL"
---

# Deep RL

> 中文简称：深度强化学习 ｜ English Name: Deep RL

深度强化学习（Deep Reinforcement Learning）— DQN、PPO、SAC、Model-Based RL 与 Offline RL 的系统知识体系。

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[06_强化学习/02_深度强化学习/02_深度_RL|Deep RL]] | Deep RL knowledge system: value function, policy gradient and Actor-Critic methods | RL researchers / students |
| [[06_强化学习/02_深度强化学习/02_深度_RL|Deep RL for dummy]] | Deep RL beginner guide: from MDP to PPO | beginners / RL learners |
| [[06_强化学习/02_深度强化学习/03_DQN_深入分析|DQN Deep Dive]] | DQN deep dive: experience replay, target network and Rainbow extensions | RL researchers / students |
| [[06_强化学习/02_深度强化学习/10_PPO_深入分析|PPO Deep Dive]] | PPO deep dive: clipped objective, GAE and implementation details | RL engineers / RLHF practitioners |
| [[06_强化学习/02_深度强化学习/11_SAC_深入分析|SAC Deep Dive]] | SAC deep dive: maximum entropy RL and temperature auto-tuning | RL researchers |
| [[06_强化学习/02_深度强化学习/08_模型_Based_RL_深入分析|Model Based RL Deep Dive]] | Model-based RL deep dive: world model and planning algorithms | RL researchers / robotics engineers |
| [[06_强化学习/02_深度强化学习/09_离线_RL_深入分析|Offline RL Deep Dive]] | Offline RL deep dive: offline data, distribution shift and conservative constraints | RL researchers / applied scientists |

## Related

- [[06_强化学习/index|强化学习首页]]
- [[20_论文精读/07_强化学习/index|RL 论文]]
- [[19_业界观点/Demis_Hassabis/index|Demis Hassabis]]

## 核心概念

| 概念 | 说明 | 代表算法 |
|------|------|----------|
| 价值函数 | 状态/动作价值估计 | DQN |
| 策略梯度 | 直接优化策略 | REINFORCE |
| Actor-Critic | 结合价值与策略 | PPO, SAC |
| 模型基础 | 学习环境模型 | World Model |
| 离线 RL | 从静态数据学习 | CQL, IQL |

## 算法对比

| 算法 | 类型 | 特点 | 适用场景 |
|------|------|------|----------|
| DQN | Value-based | 离散动作 | 游戏 |
| PPO | Policy-based | 稳定、简单 | 通用 |
| SAC | Max Entropy | 探索性强 | 连续控制 |
| Model-Based | 模型学习 | 样本高效 | 机器人 |
| Offline RL | 静态数据 | 无需交互 | 医疗/金融 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | Deep RL for dummy | 理解基本概念 |
| 进阶 | DQN/PPO Deep Dive | 掌握核心算法 |
| 深入 | SAC/Model-Based | 高级方法 |
| 实践 | Offline RL | 实际应用 |

## 常见问题

| 问题 | 解答 |
|------|------|
| DQN 和 PPO 的区别？ | DQN 离散动作，PPO 连续/离散 |
| 为什么 PPO 最流行？ | 简单、稳定、效果好 |
| Offline RL 的难点？ | 分布偏移问题 |
| 入门需要什么基础？ | RL 基础 + 深度学习 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域文件数 | 7 |
| 核心算法 | 5+ |
| 适用场景 | 游戏/机器人/LLM |
| 2026 热点 | Offline RL、RLHF |

> 💡 深度强化学习是 RL 与深度学习的融合，PPO 因其简单稳定成为最流行算法，也是 RLHF 的核心。

## 附录：深度 RL 知识图谱

| 知识节点 | 前置依赖 | 后续延伸 |
|----------|----------|----------|
| DQN | RL 基础 + CNN | 游戏 AI |
| PPO | 策略梯度 | RLHF |
| SAC | 最大熵 RL | 连续控制 |
| Model-Based | 世界模型 | 机器人 |
| Offline RL | 静态数据 | 医疗/金融 |

## 附录：深度 RL 术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 经验回放 | Experience Replay | 存储转换样本 |
| 目标网络 | Target Network | 稳定训练 |
| 优势函数 | Advantage Function | 动作优势估计 |
| 裁剪 | Clipping | 限制更新幅度 |
| 熵 | Entropy | 探索程度度量 |

## 深度RL算法对比

| 算法 | 类型 | 动作空间 | 样本效率 | 稳定性 | 典型应用 |
|------|------|----------|----------|--------|----------|
| DQN | 值函数 | 离散 | 中 | 高 | Atari |
| Double DQN | 值函数 | 离散 | 中 | 高 | 减少过估计 |
| PPO | 策略梯度 | 连续/离散 | 中 | 高 | 通用控制 |
| SAC | Actor-Critic | 连续 | 高 | 高 | 机器人 |
| TD3 | Actor-Critic | 连续 | 高 | 高 | 连续控制 |
| Decision Transformer | 序列建模 | 任意 | 高 | 高 | 离线RL |
| Dreamer | 模型基础 | 连续 | 极高 | 中 | 想象训练 |

## 关键技术创新

| 技术 | 作用 | 代表算法 |
|------|------|----------|
| 经验回放 | 打破数据相关性 | DQN |
| 目标网络 | 稳定训练 | DQN |
| 截断策略 | 限制更新幅度 | PPO |
| 最大熵 | 鼓励探索 | SAC |
| 注意力机制 | 序列决策 | Decision Transformer |
| 世界模型 | 想象训练 | Dreamer |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | 02_DQN_深入分析.md | 理解深度值函数 |
| 进阶 | 04_PPO_深入分析.md | 掌握策略梯度 |
| 前沿 | Decision_Transformer.md | 序列决策新范式 |
| 实践 | Gymnasium + SB3 | 动手实验 |

## 常见问题

| 问题 | 解答 |
|------|------|
| DQN为什么需要目标网络？ | 避免“自己追自己”的训练不稳定 |
| PPO的clip有什么作用？ | 限制策略更新幅度，防止崩溃 |
| SAC的最大熵是什么意思？ | 在优化奖励的同时鼓励探索 |
| Decision Transformer和传统RL的区别？ | 将RL转化为序列预测问题，无需贝尔曼方程 |

## 统计

| 指标 | 数值 |
|------|------|
| 核心算法 | 7+ |
| 关键技术 | 6项 |
| 前置知识 | RL基础 + 深度学习 |
| 实践框架 | Stable-Baselines3, RLlib |

> 💡 深度RL = 强化学习 + 深度网络。DQN开创了时代，PPO成为事实标准，Decision Transformer代表新范式。

## 附录：知识图谱

| 知识节点 | 前置依赖 | 后续延伸 |
|----------|----------|----------|
| 经验回放 | 数据结构 | DQN、离线RL |
| 目标网络 | 神经网络 | DQN稳定性 |
| 截断策略 | 策略梯度 | PPO、TRPO |
| 最大熵 | 信息论 | SAC |
| 注意力机制 | Transformer | Decision Transformer |
| 世界模型 | 序列模型 | Dreamer、MBPO |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 经验回放 | Experience Replay | 存储并重用转换 |
| 目标网络 | Target Network | 延迟更新稳定训练 |
| 截断 | Clipping | 限制策略更新幅度 |
| 广义优势估计 | GAE | 平衡偏差与方差 |
| 最大熵 | Maximum Entropy | 鼓励探索的正则化 |
| 离线RL | Offline RL | 无需在线交互 |

## 附录：快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 理解DQN原理 | 02_DQN_深入分析.md | ⭐⭐ |
| 掌握PPO实现 | 04_PPO_深入分析.md | ⭐⭐ |
| 了解Decision Transformer | Decision_Transformer.md | ⭐⭐⭐ |
| 动手实验 | Gymnasium + SB3 | ⭐⭐ |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解经验回放 | 为什么需要、如何实现 | ☐ |
| 理解目标网络 | 为什么稳定训练 | ☐ |
| 实现DQN | Atari环境 | ☐ |
| 理解PPO clip | 截断机制原理 | ☐ |
| 实现PPO | 连续控制环境 | ☐ |
| 了解SAC | 最大熵框架 | ☐ |
| 了解Decision Transformer | 序列决策 | ☐ |
| 实践项目 | 完成一个完整RL项目 | ☐ |
| 阅读论文 | DQN/PPO/SAC原论文 | ☐ |
| 理解离线RL | CQL/DT | ☐ |

---
*Last updated: 2026-07-21*
