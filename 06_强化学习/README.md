---
title: 06 强化学习 (Reinforcement Learning)
category: 06-reinforcement-learning
tags: ["reinforcement-learning", "mdp", "deep-rl"]
summary: "本章涵盖强化学习的完整技术栈，从数学基础（MDP/贝尔曼方程）到深度强化学习算法（DQN/PPO），再到具身智能。Agent 相关内容已合并至 13_Agent_Production。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

name_zh: "06 强化学习"
---
# 06 强化学习 (Reinforcement Learning)

> 中文简称：06 强化学习

本章涵盖强化学习的完整技术栈，从数学基础（MDP/贝尔曼方程）到深度强化学习算法（DQN/PPO），再到具身智能与机器人。Agent 相关内容已合并至 [Agent](../15_智能体/README.md)。

## 学习路径 (Learning Path)

```
    ┌──────────────────────┐
    │  强化学习基础         │
    │  RL Foundations      │
    │  (MDP/Bellman)       │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  深度强化学习         │
    │  Deep RL             │
    │  (DQN/PPO/SAC)       │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  具身智能             │
    │  Embodied AI         │
    │  (机器人/VLA模型)     │
    └──────────────────────┘
```

## 🚀 速成指南 (In-Nutshell Quick Start)

> 面向初级运维人员的入门材料，包含丰富的 Mermaid 图示。

## 内容索引 (Content Index)

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 强化学习基础 (RL Foundations) | 入门 | MDP、贝尔曼方程、策略梯度、价值函数，RL 数学框架 | [RL_Foundations.md](06_强化学习/01_RL_Foundations/RL_Foundations.md) |
| 深度强化学习 (Deep RL) | 进阶 | DQN、PPO、SAC、离线 RL，结合神经网络的 RL 算法 | [Deep_RL.md](06_强化学习/02_Deep_RL/Deep_RL.md) |
| **多智能体系统 (Multi-Agent Systems)** | **进阶** | **合作/竞争/混合场景、CTDE、QMIX、MAPPO、涌现行为** | **[Multi_Agent_Systems.md](./06_Multi_Agent/Multi_Agent_Systems.md)** |
| 具身智能 (Embodied AI) | 前沿 | 机器人基础模型、VLA架构、Sim-to-Real、人形机器人产业 | [Embodied_AI_2026.md](./05_Robotics_Embodied_AI/Embodied_AI_2026.md) |

### 深度解读 (Deep Dive)

| 算法 | 内容 | 文档链接 |
|------|------|---------|
| DQN | 深度强化学习开山之作，Atari 游戏与经验回放 | [DQN_Deep_Dive.md](06_强化学习/02_Deep_RL/DQN_Deep_Dive.md) |
| PPO | OpenAI 默认 RL 算法，裁剪更新稳定训练 | [PPO_Deep_Dive.md](06_强化学习/02_Deep_RL/PPO_Deep_Dive.md) |
| RLHF/DPO/GRPO | 大模型对齐训练三大范式（GPT/DPO/DeepSeek-R1 路线） | [RLHF_DPO_GRPO_Deep_Dive.md](06_强化学习/03_RLHF_Alignment/RLHF_DPO_GRPO_Deep_Dive.md) |
| **GRPO 训练深度解析** | **生产必备** | **Group Relative Policy Optimization 原理、Reward 设计、显存优化与 DeepSeek-R1/Qwen3 复现** | **[GRPO_Training_Deep_Dive.md](06_强化学习/03_RLHF_Alignment/GRPO_Training_Deep_Dive.md)** |

### 小白版入门 (for_dummy)

- [强化学习与智能体 - 小白版](README_for_dummy.md) — 零基础入门
- [RL 基础 - 小白版](./01_RL_Foundations/RL_Foundations_for_dummy.md)
- [深度强化学习 - 小白版](./02_Deep_RL/Deep_RL_for_dummy.md)

## 前置知识 (Prerequisites)

- **必修**: [概率统计](01_数学基础/03_Probability_Statistics/Probability_Statistics.md)（理解 MDP 和期望计算）
- **必修**: [神经网络核心](03_深度学习/02_Neural_Network_Core/Neural_Network_Core.md)（深度 RL 中的函数逼近）
- **推荐**: [优化与正则化](03_深度学习/03_Optimization/Optimization.md)（稳定 RL 训练）
- **可选**: [大语言模型架构](05_大模型/05_LLM_Architectures/LLM_Architectures.md)（理解 LLM 驱动的智能体）

## 关键术语速查 (Key Terms)

- **MDP (Markov Decision Process)**: 马尔可夫决策过程，RL 的数学建模框架
- **贝尔曼方程 (Bellman Equation)**: 描述价值函数递归关系，RL 理论核心
- **策略 (Policy)**: 从状态到动作的映射，π(a|s)
- **价值函数 (Value Function)**: 评估状态或动作的长期回报 V(s) 或 Q(s,a)
- **Q-Learning**: 无模型价值学习算法，学习最优动作价值函数
- **DQN (Deep Q-Network)**: 结合深度学习的 Q-Learning，使用经验回放和目标网络
- **PPO (Proximal Policy Optimization)**: 策略梯度算法，通过裁剪更新稳定训练
- **Actor-Critic**: 结合策略和价值函数的 RL 架构
- **ReAct (Reasoning + Acting)**: 推理与执行交织的智能体范式
- **Multi-Agent RL**: 多智能体强化学习，处理协作与竞争场景
- **VLA (Vision-Language-Action)**: 视觉-语言-动作模型，机器人基础模型架构
- **Sim-to-Real**: 仿真到现实迁移，让仿真训练的模型在真实机器人上工作
- **Embodied AI**: 具身智能，有物理身体、能与环境交互的AI系统
- **Robot Foundation Model**: 机器人基础模型，在大量机器人数据上预训练的通用模型

---
*Last updated: 2026-04-01*

## Related
- [[06_强化学习/RL-in-nutshell|强化学习速览]] — 从 MDP 到 DQN/PPO 到 RLHF/DPO/GRPO 全栈速览 (共享: rl, reinforcement-learning, ppo, rlhf)
- [[06_强化学习/README_for_dummy|06 强化学习与智能体 - 小白版 🎮]]

- [[06_强化学习/01_RL_Foundations/RL_Foundations]] — 强化学习基础 (RL Foundations)
- [[06_强化学习/01_RL_Foundations/RL_Foundations_for_dummy]] — 强化学习基础 - 小白版 🎲
- [[06_强化学习/05_Robotics_Embodied_AI/Embodied_AI_2026]] — Embodied_AI_2026
- [[06_强化学习/05_Robotics_Embodied_AI/VLA_Models_2026]] — VLA 模型 2026：视觉-语言-动作模型的技术突破与产业应用
- [[06_强化学习/05_Robotics_Embodied_AI/Embodied_AI_Complete_2026]] — 具身智能 (Embodied AI) 2026 完整指南
- [[06_强化学习/02_Deep_RL/Deep_RL]] — Deep_RL
- [[06_强化学习/02_Deep_RL/PPO_Deep_Dive]] — PPO_Deep_Dive
- [[06_强化学习/02_Deep_RL/Deep_RL_for_dummy]] — Deep_RL_for_dummy
- [[06_强化学习/02_Deep_RL/DQN_Deep_Dive]] — DQN_Deep_Dive
- [[概念/Training/rlhf.md|rlhf]]

## 强化学习核心算法对比

| 算法 | 类型 | 动作空间 | 样本效率 | 典型应用 |
|------|------|----------|----------|----------|
| Q-Learning | 值函数 | 离散 | 低 | 表格游戏 |
| DQN | 值函数+深度 | 离散 | 中 | Atari游戏 |
| PPO | 策略梯度 | 连续/离散 | 中 | 通用控制 |
| SAC | Actor-Critic | 连续 | 高 | 机器人控制 |
| TD3 | Actor-Critic | 连续 | 高 | 连续控制 |
| Decision Transformer | 序列建模 | 任意 | 高 | 离线RL |
| GRPO | 策略优化 | 离散(Token) | 中 | LLM对齐 |

## 子域学习路径

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | RL_Foundations/ | 理解MDP、Q-Learning、策略梯度 |
| 进阶 | Deep_RL/ | 掌握DQN、PPO、SAC |
| 对齐 | RLHF_Alignment/ | 理解RLHF、DPO、GRPO |
| 多智能体 | Multi_Agent_RL/ | 协作/竞争博弈 |
| 具身智能 | Robotics_Embodied_AI/ | VLA、Sim-to-Real |
| 迁移 | Sim_to_Real/ | 仿真到现实迁移 |
| 应用 | RL_Applications/ | 推荐、游戏、控制 |

## 常见问题

| 问题 | 解答 |
|------|------|
| RL和监督学习的核心区别？ | RL通过延迟奖励学习，无标准答案；监督学习有即时标签 |
| 为什么RL训练不稳定？ | 数据分布随策略变化（非平稳）、奖励稀疏、高方差 |
| PPO为什么流行？ | 实现简单、超参不敏感、性能稳定 |
| RLHF和DPO的区别？ | RLHF需训练奖励模型+在线采样；DPO直接用偏好对优化 |
| 强化学习需要GPU吗？ | 表格方法不需要；深度RL建议至少一张GPU |

## 统计

| 指标 | 数值 |
|------|------|
| 子域数量 | 7 |
| 文档总数 | 20+ |
| 核心算法 | 15+ |
| 覆盖应用 | 游戏/机器人/LLM/推荐 |

> 💡 强化学习是AI从“感知”走向“决策”的核心桥梁。2026年，RL与LLM的融合（RLHF/GRPO）和具身智能是最活跃的研究方向。

---
*Last updated: 2026-07-21*

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
| 零基础入门RL | RL_Foundations/RL_Foundations_for_dummy | ⭐ |
| 理解DQN原理 | Deep_RL/DQN_Deep_Dive | ⭐⭐ |
| 掌握PPO实现 | Deep_RL/PPO_Deep_Dive | ⭐⭐ |
| 了解RLHF对齐 | RLHF_Alignment/RLHF_DPO_GRPO_Deep_Dive | ⭐⭐⭐ |
| 学习具身智能 | Robotics_Embodied_AI/ | ⭐⭐⭐ |
| 多智能体协作 | Multi_Agent_RL/Multi_Agent_RL | ⭐⭐⭐ |
| Sim-to-Real迁移 | Sim_to_Real/index | ⭐⭐⭐ |

---
*Last updated: 2026-07-21*

