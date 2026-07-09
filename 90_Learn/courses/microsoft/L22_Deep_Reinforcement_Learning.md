---
title: "L22 - 深度强化学习"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "reinforcement-learning", "deep-rl", "policy-gradient", "actor-critic", "openai-gym"]
summary: "通过 OpenAI Gym 中的 CartPole 任务，理解强化学习『学习 by doing』的范式，掌握策略梯度（Policy Gradient）与 Actor-Critic 两类深度 RL 算法的基本思想。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/6-Other/22-DeepRL/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L22 Deep Reinforcement Learning"
  - L22_Deep_Reinforcement_Learning
sources: []

---
# L22 - 深度强化学习

> **一句话理解**：智能体（Agent）在没有标签指导的情况下，通过与环境反复交互、根据最终奖励调整行为，从而学会完成任务的机器学习方法。

## 本课概览

深度强化学习（Deep Reinforcement Learning，深度 RL）是机器学习三大范式之一（另两个是有监督学习与无监督学习）。与依赖已知标签的有监督学习不同，强化学习的核心是**在做中学**：智能体通过试验、犯错、获得奖励来逐步优化策略。

本课位于 Microsoft AI For Beginners 课程第六模块“其他 AI 技术”中，紧接遗传算法，后续将过渡到多智能体系统。它通过一个经典控制任务——**CartPole 平衡杆**——带你建立 RL 问题的基本直觉，并介绍两种最基础的深度 RL 算法：**策略梯度（Policy Gradient）**与 **Actor-Critic**。本课的目标不是穷尽 RL 全家桶，而是让你理解“环境—奖励—策略—训练”这一闭环，并能在 Gym 中复现一个会自己立杆子的智能体。

## 核心概念

- **环境 / 模拟器（Environment / Simulator）**：定义任务规则的地方。强化学习需要在可重复运行的环境中进行大量实验，例如 OpenAI Gym 提供的 CartPole、Atari 游戏等。
- **奖励函数（Reward Function）**：告诉智能体“做得怎么样”的标量信号。在很多任务中，奖励只在 episode 结束时才明确给出（如下棋的胜负），因此单独一步的好坏往往无法直接判断。
- **探索与利用（Exploration vs. Exploitation）**：训练过程中需要在“按当前最优策略行动”与“尝试新动作以发现更高奖励”之间取得平衡。
- **策略（Policy，π）**：智能体在给定状态下选择动作的模型。可以是一个确定性函数，也可以是概率分布 $π(a|s)$，表示在状态 $s$ 下采取动作 $a$ 的概率。
- **策略梯度（Policy Gradient）**：直接用神经网络建模 $π(a|s)$，通过一次完整试验（episode）得到的累积奖励来加权每一步动作，从而“强化”带来高回报的动作。
- **Actor-Critic**：在策略网络之外再引入一个**价值网络（Critic / 评论家）**，用来估计当前状态未来能获得的累积奖励；策略网络被称为 **Actor / 演员**。两者协同训练，Critic 提供基准来降低 Actor 更新的方差。

## 关键知识点

- **强化学习与有监督学习的本质区别**：有监督学习每一步都有正确标签；RL 通常只在整个交互序列结束后才得到最终奖励，单步动作没有即时对错。
- **Gym 环境统一接口**：
  - `env.reset()` 开始一次新试验；
  - `env.step(action)` 执行一步，返回 `(observation, reward, done, info)`；
  - `env.action_space` 与 `env.observation_space` 分别描述可执行动作与可观测状态。
- **CartPole 任务**：在一维滑轨上左右移动小车，使竖直杆尽可能长时间不倒。状态通常由 `[小车位置, 小车速度, 杆角度, 杆角速度]` 构成。
- **折扣累积奖励**：越早获得的奖励对当前决策影响越小，常用折扣因子 $γ$（例如 $γ=0.99$）对过去奖励进行衰减：$G_t = \sum_{k=0}^{\infty} γ^k r_{t+k}$。
- **Policy Gradient 的直观训练逻辑**：对一条 episode 路径，根据最终的累积回报放大“好动作”的概率、缩小“坏动作”的概率。
- **Actor-Critic 的优势**：Critic 估计状态价值 $V(s)$，用来替代整条路径的累积回报，降低方差并支持在线更新；整体结构与生成对抗网络（GAN）有相似之处，但目标是协同而非对抗。
- **深度 RL 的典型应用**：Atari 游戏（CNN 处理屏幕像素）、棋类游戏（AlphaZero 自我对弈）、工业控制（如 Microsoft Project Bonsai 的仿真控制系统）。

## 代码/实验说明

本课官方提供两个可运行的 Jupyter Notebook，分别用 TensorFlow 与 PyTorch 实现 CartPole 上的策略梯度 / Actor-Critic：

- TensorFlow 版本：[CartPole-RL-TF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/6-Other/22-DeepRL/CartPole-RL-TF.ipynb)
- PyTorch 版本：[CartPole-RL-PyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/6-Other/22-DeepRL/CartPole-RL-PyTorch.ipynb)

核心代码结构可概括为以下几步：

```python
import gym
env = gym.make("CartPole-v1")

env.reset()
done = False
total_reward = 0
while not done:
    env.render()
    action = env.action_space.sample()   # 随机动作示例
    observation, reward, done, info = env.step(action)
    total_reward += reward

print(f"Total reward: {total_reward}")
```

在策略梯度实现中，通常会：

1. 用神经网络接收状态，输出每个动作的概率；
2. 运行若干 episode，收集 `(state, action, reward)` 序列；
3. 计算折扣累积奖励 $G_t$；
4. 以 $-G_t \log π(a_t|s_t)$ 作为损失，反向传播更新策略网络；
5. 重复直到杆能长时间保持直立。

Actor-Critic 版本则会额外训练一个价值网络，并用时序差分（Temporal Difference，TD）误差同时指导 Actor 与 Critic 的更新。

### 课后实验：Mountain Car

本课作业要求训练另一个 Gym 经典控制环境 [Mountain Car](https://www.gymlibrary.ml/environments/classic_control/mountain_car/)：小车动力不足，需要学会在 cos状山谷中来回摆动以冲上右侧山顶。实验说明见官方 lab 目录：[`lab/README.md`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/6-Other/22-DeepRL/lab/README.md)。

## 本课不覆盖与延伸

- **不覆盖**：
  - 经典表格型 RL（Q-Learning、SARSA、值迭代等）的完整推导；可参考微软 [ML-For-Beginners 强化学习章节](https://github.com/microsoft/ML-For-Beginners/blob/main/8-Reinforcement/README.md)。
  - 高级算法如 DQN、A3C、PPO、TRPO、SAC、TD3；这些属于更专门的 RL 课程范畴。
  - 连续动作空间、多智能体强化学习（MARL）、离线强化学习（Offline RL）。
- **延伸**：
  - 学习完本课后，可继续本库 [[强化学习/Deep_RL/Deep_RL]] 与 [[强化学习/RL_Foundations/RL_Foundations]] 进行更深入的理论与算法扩展。
  - 观看官方推荐视频：[How a computer learns to play Super Mario](https://www.youtube.com/watch?v=qv6UVOQ0F44)，感受 RL 在复杂游戏中的表现。

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[强化学习/Deep_RL/Deep_RL]]
  - [[强化学习/RL_Foundations/RL_Foundations]]
