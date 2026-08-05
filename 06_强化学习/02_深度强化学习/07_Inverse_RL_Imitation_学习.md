---
title: "逆强化学习与模仿学习深度解析 (Inverse RL & Imitation Learning Deep Dive)"
category: 06-reinforcement-learning-deep-rl
tags: ["reinforcement-learning", "deep-rl", "inverse-rl", "imitation-learning", "behavioral-cloning", "gail", "airl", "dagger", "robotics", "vla"]
summary: "> **一句话理解**: 逆强化学习是'看行为猜奖励'——从专家演示中推断奖励函数；模仿学习是'照葫芦画瓢'——直接学习专家策略。两者结合让AI无需手动设计奖励就能从人类演示中学习复杂技能。"
created: 2026-07-19
updated: 2026-07-19
tier: core
aliases:
  - "Inverse RL & Imitation Learning"
  - "IRL"
  - "Imitation Learning"
  - Inverse_RL_Imitation_Learning
sources: []

name_zh: "逆强化学习与模仿学习深度解析"
---
# 逆强化学习与模仿学习深度解析 (Inverse RL & Imitation Learning Deep Dive)

> 中文简称：逆强化学习与模仿学习深度解析

> **一句话理解**: 逆强化学习是"看行为猜奖励"——从专家演示中推断奖励函数；模仿学习是"照葫芦画瓢"——直接学习专家策略。两者结合让AI无需手动设计奖励就能从人类演示中学习复杂技能。

---

## 目录

- [论文信息](#论文信息)
- [1. 概述](#1-概述)
- [2. 核心原理](#2-核心原理)
- [3. 算法详解](#3-算法详解)
- [4. 实验与基准](#4-实验与基准)
- [5. 代码实现要点](#5-代码实现要点)
- [6. 与其他方法对比](#6-与其他方法对比)
- [7. 2026前沿进展](#7-2026前沿进展)
- [8. 相关概念](#8-相关概念)

---

## 论文信息

| 属性 | 内容 |
|------|------|
| **IRL奠基** | Algorithms for Inverse Reinforcement Learning (Ng & Russell, 2000) |
| **MaxEnt IRL** | Maximum Entropy Inverse Reinforcement Learning (Ziebart et al., 2008) |
| **GAIL** | Generative Adversarial Imitation Learning (Ho & Ermon, 2016) |
| **AIRL** | Learning Robust Rewards with Adversarial Inverse RL (Fu et al., 2018) |
| **DAGGER** | A Reduction of Imitation Learning to No-Regret Online Learning (Ross et al., 2011) |
| **BC** | Behavioral Cloning (最经典的监督学习方法) |
| **VLA** | RT-2, Octo, OpenVLA (2023-2026, 视觉-语言-动作模型) |

---

## 1. 概述

### 1.1 为什么需要从演示中学习？

传统RL需要手动设计奖励函数，但这在很多场景下极其困难：

```
奖励设计的困境:

场景1: 机器人操作
  任务: 让机器人像人一样倒水
  奖励设计: ???
  → 角度？速度？力矩？水流量？
  → 多维目标难以平衡
  → 奖励稀疏（只有成功/失败）

场景2: 自动驾驶
  任务: 像人类司机一样驾驶
  奖励设计: ???
  → 安全 + 效率 + 舒适 + 礼貌
  → 权重如何设定？
  → 边缘情况无法穷举

场景3: 游戏AI
  任务: 像职业选手一样操作
  奖励设计: ???
  → 微观操作 + 宏观策略
  → 风格偏好难以量化

解决方案: 直接从专家演示中学习！
  → 不需要设计奖励函数
  → 人类"做"比"说"更容易
  → 演示天然包含丰富的隐式奖励信息
```

### 1.2 两大范式

```
从演示中学习 (Learning from Demonstration):

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  范式1: 模仿学习 (Imitation Learning)                    │
│  "直接学策略"                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 输入: 专家轨迹 {(s_t, a_t)}                     │    │
│  │ 输出: 策略 π(a|s) ≈ π_expert(a|s)              │    │
│  │ 方法: BC, DAGGER, GAIL                         │    │
│  │ 特点: 不推断奖励，直接映射状态→动作             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  范式2: 逆强化学习 (Inverse RL)                          │
│  "先学奖励，再学策略"                                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 输入: 专家轨迹 {(s_t, a_t)}                     │    │
│  │ 输出: 奖励函数 R(s,a) 使得专家策略最优          │    │
│  │ 方法: MaxEnt IRL, AIRL, T-REX                  │    │
│  │ 特点: 推断隐式奖励，可迁移到新环境              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  联系: GAIL/AIRL 将两者统一在对抗学习框架下              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 1.3 与RLHF的关系

```
IRL/IL 与 RLHF 的深层联系:

RLHF 本质上是一种逆强化学习！

传统IRL:
  专家演示: 人类操作轨迹 (s, a)
  推断: 奖励函数 R(s, a)
  应用: 机器人控制

RLHF:
  专家演示: 人类偏好 (y_w > y_l)
  推断: 奖励模型 R(x, y)  ← 这就是逆强化学习！
  应用: 语言模型对齐

见 [[概念/Training/reward-modeling]]:
  Bradley-Terry模型 ≈ 随机最优策略的IRL
  奖励模型 ≈ 从偏好数据推断的奖励函数
  DPO ≈ 绕过显式IRL的直接策略优化
```

---

## 2. 核心原理

### 2.1 Behavioral Cloning (行为克隆)

#### 基本思想

将模仿学习转化为监督学习问题：

$$\pi_\theta^* = \arg\min_\theta \mathbb{E}_{(s, a) \sim \mathcal{D}_{expert}} \left[ \mathcal{L}(\pi_\theta(s), a) \right]$$

对于确定性策略：

$$\mathcal{L}_{BC} = \mathbb{E}_{(s,a) \sim \mathcal{D}} \left[ ||\pi_\theta(s) - a||^2 \right]$$

对于随机策略：

$$\mathcal{L}_{BC} = -\mathbb{E}_{(s,a) \sim \mathcal{D}} \left[ \log \pi_\theta(a|s) \right]$$

#### 协变量偏移问题 (Covariate Shift)

```
BC的致命缺陷: 复合误差 (Compounding Error)

训练时: 策略只见过专家的状态分布 d_expert(s)
测试时: 策略自己的错误会把它带到从未见过的状态

示例 (自动驾驶):
  t=0: 车在路中间 (专家状态) → 策略输出微小偏差
  t=1: 车略偏右 (非专家状态) → 策略不知道如何纠正
  t=2: 车更偏右 (更远离专家分布) → 策略完全迷失
  t=3: 车冲出道路 → 灾难性失败

数学描述:
  单步误差: ε
  T步后累积误差: O(T²ε)  ← 二次增长！
  (而非 O(Tε) 的线性增长)

原因:
  - 策略在 d_π(s) 上运行
  - 但只在 d_expert(s) 上训练
  - 当 d_π ≠ d_expert 时，误差指数放大
```

### 2.2 DAGGER (Dataset Aggregation)

#### 核心思想

通过迭代式数据聚合解决协变量偏移：

```
DAGGER 算法直觉:

Round 1:
  - 用当前策略 π_1 收集轨迹
  - 在策略访问的状态上，询问专家"你会怎么做？"
  - 将专家标注加入数据集

Round 2:
  - 用更新后的策略 π_2 收集轨迹
  - 再次询问专家
  - 聚合所有数据

Round N:
  - 策略越来越好
  - 访问的状态越来越接近专家
  - 误差从 O(T²ε) 降低到 O(Tε)

关键: 在策略自己的分布上获取专家标签！
```

#### 形式化

$$\mathcal{D}_N = \bigcup_{i=1}^{N} \{(s_t, \pi^*(s_t)) : s_t \sim d_{\pi_i}\}$$

$$\pi_{N+1} = \arg\min_{\pi \in \Pi} \mathbb{E}_{(s,a) \sim \mathcal{D}_N} [\mathcal{L}(\pi(s), a)]$$

#### 理论保证

DAGGER将模仿学习的regret从 $O(T^2)$ 降低到 $O(T)$：

$$J(\pi^*) - J(\pi_N) \leq T \cdot \epsilon_N + O(1/T)$$

其中 $\epsilon_N$ 是第N轮的分类误差。

### 2.3 GAIL (Generative Adversarial Imitation Learning)

#### 核心思想

用GAN的框架做模仿学习——判别器区分专家和策略的轨迹：

```
GAN vs GAIL:

GAN:
  生成器 G: 生成假图片
  判别器 D: 区分真假图片
  目标: G生成以假乱真的图片

GAIL:
  策略 π: 生成轨迹 (状态-动作序列)
  判别器 D: 区分专家轨迹和策略轨迹
  目标: π生成以假乱真的轨迹
  奖励: -log D(s,a) (判别器越难区分，奖励越高)
```

#### 数学公式

判别器目标：

$$\min_D \mathbb{E}_{\pi_E}[\log D(s,a)] + \mathbb{E}_{\pi_\theta}[\log(1 - D(s,a))]$$

策略目标（最大化"欺骗"判别器的能力）：

$$\max_\pi -\mathbb{E}_{\pi}[\log D(s,a)] + \lambda H(\pi)$$

其中 $H(\pi)$ 是熵正则化（鼓励探索）。

#### 等价于最小化分布距离

GAIL等价于最小化策略分布和专家分布之间的Jensen-Shannon散度：

$$\min_\pi D_{JS}(\rho_{\pi_E} || \rho_\pi)$$

其中 $\rho_\pi(s,a)$ 是策略的占用度量 (occupancy measure)。

### 2.4 AIRL (Adversarial Inverse Reinforcement Learning)

#### GAIL的局限

```
GAIL的问题:
1. 学到的是"策略"而非"奖励"
   → 不能迁移到新环境
   → 不能与RL算法结合

2. 奖励不可恢复
   → -log D(s,a) 不是真正的奖励函数
   → 只用于训练，不能复用

3. 对超参数敏感
   → GAN训练的不稳定性
```

#### AIRL的改进

AIRL将判别器分解为奖励函数和策略：

$$D(s, a, s') = \frac{\exp(f(s, a, s'))}{\exp(f(s, a, s')) + \pi_\theta(a|s')}$$

其中奖励函数分解为：

$$f(s, a, s') = r(s, a) + \gamma h(s') - h(s)$$

- $r(s,a)$: 可恢复的奖励函数（shaping-free）
- $\gamma h(s') - h(s)$: 奖励塑形项（不改变最优策略）

#### AIRL的优势

```
1. 可恢复真实奖励:
   → r(s,a) 是环境真实的奖励函数
   → 可以迁移到新环境（不同动力学）
   → 可以与任何RL算法结合

2. 鲁棒性:
   → 学到的奖励对策略变化鲁棒
   → 不需要重新训练就能用于新策略

3. 与RL结合:
   → 先用AIRL从演示学奖励
   → 再用 [[TD3_Deep_Dive|TD3]] 或 [[SAC_Deep_Dive|SAC]] 优化
   → 演示 + RL = 更好的样本效率
```

### 2.5 逆强化学习的数学框架

#### 问题定义

给定：
- 状态空间 $\mathcal{S}$，动作空间 $\mathcal{A}$
- 转移动力学 $P(s'|s,a)$（已知或未知）
- 折扣因子 $\gamma$
- 专家轨迹集 $\mathcal{D} = \{\tau_1, ..., \tau_N\}$

目标：找到奖励函数 $R^*$ 使得专家策略 $\pi_E$ 是最优的：

$$R^* = \arg\max_R \left[ \min_\pi V_R^\pi \text{ s.t. } \pi_E = \arg\max_\pi V_R^\pi \right]$$

#### 歧义性问题

```
IRL的根本困难: 奖励不唯一！

问题: 多个奖励函数可以解释同一行为
  - R(s,a) = 0 对所有(s,a): 任何策略都是最优的
  - R(s,a) = 常数: 同上
  - 真正的奖励 + 任意势函数: 最优策略不变

解决: 添加约束/先验
  1. 最大熵假设 (MaxEnt IRL):
     → 专家按概率选择动作
     → P(τ) ∝ exp(R(τ))
     → 消除歧义

  2. 稀疏性假设:
     → 奖励只在少数状态非零
     → L1正则化

  3. 特征线性假设:
     → R(s,a) = w^T φ(s,a)
     → 只需学习权重w
```

#### MaxEnt IRL

$$P(\tau | R) = \frac{1}{Z} \exp\left(\sum_t R(s_t, a_t)\right)$$

训练目标：最大化专家轨迹的对数似然：

$$\max_R \sum_{\tau \in \mathcal{D}} \log P(\tau | R) = \sum_{\tau \in \mathcal{D}} R(\tau) - \log Z(R)$$

梯度：

$$\nabla_R \mathcal{L} = \hat{\mu}_{\mathcal{D}} - \mu_R$$

即：专家特征期望 - 当前最优策略特征期望 = 0（矩匹配）。

---

## 3. 算法详解

### 3.1 GAIL完整算法

```
算法: GAIL (Generative Adversarial Imitation Learning)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
初始化:
  - 策略网络 π_θ (Actor)
  - 判别器网络 D_ω
  - 专家数据集 D_E = {(s_t, a_t)}

训练循环:
  for 每个迭代:
    1. 收集策略轨迹:
       用 π_θ 与环境交互，收集轨迹 τ_π

    2. 更新判别器:
       从 D_E 采样 (s, a)_expert
       从 τ_π 采样 (s, a)_policy

       L_D = -E_expert[log D_ω(s,a)] - E_policy[log(1-D_ω(s,a))]
       ω ← ω - α_D ∇_ω L_D

    3. 计算奖励:
       r_t = -log D_ω(s_t, a_t)  (或 -log(1-D_ω(s_t,a_t)))
       → 判别器越认为是"专家的"，奖励越高

    4. 更新策略 (用TRPO/PPO):
       用 r_t 作为奖励信号
       加入熵正则: max_π E[Σ r_t] + λ H(π)
       θ ← TRPO_update(θ, r_t)

    5. 重复直到判别器无法区分 (D ≈ 0.5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.2 AIRL完整算法

```
算法: AIRL (Adversarial Inverse Reinforcement Learning)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
初始化:
  - 奖励网络 r_ψ(s, a)
  - 势函数网络 h_φ(s)
  - 策略网络 π_θ (用SAC/TD3训练)

训练循环:
  for 每个迭代:
    1. 用当前策略收集轨迹 τ_π

    2. 计算判别器:
       f(s, a, s') = r_ψ(s, a) + γ·h_φ(s') - h_φ(s)
       D(s, a, s') = exp(f) / (exp(f) + π_θ(a|s'))

    3. 更新奖励网络 (判别器训练):
       L_D = -E_expert[log D] - E_policy[log(1-D)]
       ψ, φ ← ψ, φ - α ∇ L_D

    4. 用恢复的奖励更新策略:
       reward = r_ψ(s, a)  ← 只用r，不用shaping项
       用 [[SAC_Deep_Dive|SAC]] 或 [[TD3_Deep_Dive|TD3]] 优化:
       θ ← RL_update(θ, reward)

输出:
  - 奖励函数 r_ψ(s, a) ← 可迁移！
  - 策略 π_θ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.3 DAGGER完整算法

```
算法: DAGGER (Dataset Aggregation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
初始化:
  - 数据集 D = ∅
  - 策略 π_1 (随机初始化)

for i = 1, 2, ..., N:
  1. 用当前策略 π_i 收集轨迹:
     τ = {(s_0, a_0), (s_1, a_1), ...} ~ π_i

  2. 在访问的状态上查询专家:
     对每个 s_t ∈ τ:
       a_t^* = π_expert(s_t)  ← 专家标注
       D ← D ∪ {(s_t, a_t^*)}

  3. 在聚合数据集上训练新策略:
     π_{i+1} = argmin_π Σ_{(s,a)∈D} L(π(s), a)

  4. (可选) 混合策略:
     以概率 β_i 使用 π_i，以 1-β_i 使用 π_expert
     β_i 随迭代递减

输出: 最终策略 π_N
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

关键: 每轮在策略自己的分布上获取专家标签
     → 解决协变量偏移
     → 误差从 O(T²) 降到 O(T)
```

### 3.4 从演示到RL的混合方法

```
方法: 演示初始化 + RL微调

Step 1: 用BC预训练策略
  π_0 = BC(D_expert)

Step 2: 用RL微调
  用 [[PPO_Deep_Dive|PPO]] / [[SAC_Deep_Dive|SAC]] / [[TD3_Deep_Dive|TD3]]
  从 π_0 开始，用环境奖励继续训练

优势:
  - BC提供好的初始化（避免随机探索）
  - RL超越演示（不局限于专家水平）
  - 样本效率大幅提升

2026实践:
  - VLA模型: 大规模BC预训练 + 少量RL微调
  - 机器人: 演示 + sim-to-real + RL适应
  - 游戏AI: 人类replay + self-play RL
```

---

## 4. 实验与基准

### 4.1 MuJoCo基准对比

| 环境 | BC | DAGGER | GAIL | AIRL+SAC | SAC(无演示) |
|------|-----|--------|------|----------|-------------|
| HalfCheetah | 410±120 | 2800±450 | 5200±380 | **9100±120** | 9636±86 |
| Hopper | 680±210 | 1200±380 | 2800±420 | **3400±80** | 3564±11 |
| Walker2d | 520±180 | 1500±420 | 3200±350 | **4500±110** | 4683±103 |
| Ant | 380±150 | 1100±350 | 2500±400 | **3800±90** | 3507±49 |
| Humanoid | 120±50 | 450±180 | 1800±350 | **4100±200** | 4337±176 |

**关键发现**：
- BC在简单任务上可用，复杂任务严重退化
- DAGGER需要在线专家，但效果显著优于BC
- GAIL不需要在线专家，效果接近RL
- AIRL+SAC结合演示和RL，达到或超越纯RL

### 4.2 样本效率对比

```
达到90%专家性能所需的环境交互步数:

方法              HalfCheetah    Hopper     Walker2d
─────────────────────────────────────────────────────
SAC (无演示)      800k          600k       700k
BC + SAC          200k          150k       180k
GAIL              400k          300k       350k
AIRL + SAC        100k          80k        120k
DAGGER            50k           40k        60k (需要在线专家)

结论:
- 演示数据可以将样本效率提升 5-10x
- AIRL + RL 是样本效率最高的组合
- DAGGER样本效率最高，但需要在线专家
```

### 4.3 机器人应用基准

```
真实机器人任务成功率 (50次试验):

任务: 杯子抓取
  BC (100 demos):     62%
  DAGGER (50 demos):  78%
  GAIL (100 demos):   71%
  AIRL + RL:          84%
  纯RL (无演示):      45% (需要10x更多时间)

任务: 门把手旋转
  BC (200 demos):     48%
  DAGGER (100 demos): 65%
  GAIL (200 demos):   58%
  AIRL + RL:          76%
  纯RL:               32%

任务: 布料折叠
  BC (500 demos):     35%
  GAIL (500 demos):   52%
  VLA模型 (2026):     78% ← 大规模预训练的优势
```

---

## 5. 代码实现要点

### 5.1 Behavioral Cloning (PyTorch)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset

class BCPolicy(nn.Module):
    """行为克隆策略网络"""
    def __init__(self, state_dim, action_dim, hidden_dim=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim),
            nn.Tanh(),  # 连续动作 [-1, 1]
        )

    def forward(self, state):
        return self.net(state)


def train_bc(expert_states, expert_actions, epochs=100, lr=3e-4, batch_size=256):
    """训练行为克隆策略"""
    state_dim = expert_states.shape[1]
    action_dim = expert_actions.shape[1]

    policy = BCPolicy(state_dim, action_dim).cuda()
    optimizer = torch.optim.Adam(policy.parameters(), lr=lr)

    dataset = TensorDataset(
        torch.FloatTensor(expert_states),
        torch.FloatTensor(expert_actions),
    )
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    for epoch in range(epochs):
        total_loss = 0
        for states, actions in dataloader:
            states, actions = states.cuda(), actions.cuda()

            pred_actions = policy(states)
            loss = F.mse_loss(pred_actions, actions)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}: Loss = {total_loss/len(dataloader):.6f}")

    return policy
```

### 5.2 GAIL实现

```python
class Discriminator(nn.Module):
    """GAIL判别器: 区分专家和策略的(s,a)对"""
    def __init__(self, state_dim, action_dim, hidden_dim=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim + action_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
            nn.Sigmoid(),  # 输出 [0, 1] 概率
        )

    def forward(self, state, action):
        sa = torch.cat([state, action], dim=-1)
        return self.net(sa)


class GAIL:
    def __init__(self, state_dim, action_dim, lr_d=3e-4, lr_pi=3e-4):
        self.discriminator = Discriminator(state_dim, action_dim).cuda()
        self.policy = BCPolicy(state_dim, action_dim).cuda()  # 或用PPO策略

        self.opt_d = torch.optim.Adam(self.discriminator.parameters(), lr=lr_d)
        self.opt_pi = torch.optim.Adam(self.policy.parameters(), lr=lr_pi)

    def compute_reward(self, states, actions):
        """GAIL奖励: -log D(s,a)"""
        with torch.no_grad():
            d = self.discriminator(states, actions)
            reward = -torch.log(d + 1e-8)  # 越像专家，奖励越高
        return reward

    def update_discriminator(self, expert_sa, policy_sa):
        """更新判别器"""
        expert_s, expert_a = expert_sa
        policy_s, policy_a = policy_sa

        d_expert = self.discriminator(expert_s, expert_a)
        d_policy = self.discriminator(policy_s, policy_a)

        # 标准GAN损失
        loss = -(torch.log(d_expert + 1e-8).mean() +
                 torch.log(1 - d_policy + 1e-8).mean())

        self.opt_d.zero_grad()
        loss.backward()
        self.opt_pi.zero_grad()  # 不更新策略
        loss.backward()
        self.opt_d.step()

        # 准确率监控
        acc = ((d_expert > 0.5).float().mean() +
               (d_policy < 0.5).float().mean()) / 2
        return loss.item(), acc.item()

    def update_policy(self, states, actions, rewards, next_states, dones):
        """用PPO/TRPO更新策略（简化版）"""
        # 这里省略PPO的完整实现，见 [[06_强化学习/02_深度强化学习/10_PPO_深入分析]]
        # 核心: 用GAIL奖励替代环境奖励
        pass
```

### 5.3 AIRL实现

```python
class AIRLReward(nn.Module):
    """AIRL: 可恢复的奖励函数"""
    def __init__(self, state_dim, action_dim, hidden_dim=256):
        super().__init__()
        # 奖励网络 r(s, a)
        self.reward_net = nn.Sequential(
            nn.Linear(state_dim + action_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
        )
        # 势函数 h(s)
        self.value_net = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
        )

    def forward(self, state, action, next_state, gamma=0.99):
        """计算 f(s,a,s') = r(s,a) + γh(s') - h(s)"""
        sa = torch.cat([state, action], dim=-1)
        r = self.reward_net(sa)
        h_s = self.value_net(state)
        h_sp = self.value_net(next_state)
        f = r + gamma * h_sp - h_s
        return f, r  # 返回f用于判别，r用于RL训练

    def get_reward(self, state, action):
        """推理时只用r(s,a)"""
        sa = torch.cat([state, action], dim=-1)
        return self.reward_net(sa)


class AIRL:
    def __init__(self, state_dim, action_dim, gamma=0.99):
        self.reward_model = AIRLReward(state_dim, action_dim).cuda()
        self.gamma = gamma
        # 策略用SAC训练，见 [[06_强化学习/02_深度强化学习/11_SAC_深入分析]]
        # self.sac = SAC(state_dim, action_dim)

    def update(self, expert_batch, policy_batch):
        """更新AIRL判别器"""
        # 专家数据
        e_s, e_a, e_ns = expert_batch
        f_expert, _ = self.reward_model(e_s, e_a, e_ns, self.gamma)
        # 专家策略概率 (需要知道或用均匀分布近似)
        log_pi_expert = torch.zeros_like(f_expert)  # 简化

        # 策略数据
        p_s, p_a, p_ns = policy_batch
        f_policy, _ = self.reward_model(p_s, p_a, p_ns, self.gamma)
        log_pi_policy = self.get_log_pi(p_s, p_a)  # SAC的log概率

        # 判别器损失
        d_expert = f_expert - log_pi_expert
        d_policy = f_policy - log_pi_policy

        loss = -(torch.log(torch.sigmoid(d_expert) + 1e-8).mean() +
                 torch.log(1 - torch.sigmoid(d_policy) + 1e-8).mean())

        return loss

    def get_log_pi(self, states, actions):
        """获取策略的log概率（从SAC）"""
        # 实际实现中从SAC的actor获取
        pass
```

### 5.4 DAGGER实现

```python
def dagger(env, expert_policy, num_iterations=10, episodes_per_iter=10):
    """DAGGER算法"""
    state_dim = env.observation_space.shape[0]
    action_dim = env.action_space.shape[0]

    # 初始化策略
    policy = BCPolicy(state_dim, action_dim).cuda()
    dataset_states = []
    dataset_actions = []

    for iteration in range(num_iterations):
        print(f"\n=== DAGGER Iteration {iteration+1} ===")

        # 1. 用当前策略收集轨迹
        iter_states = []
        for ep in range(episodes_per_iter):
            state, _ = env.reset()
            done = False
            while not done:
                iter_states.append(state)

                # 当前策略选择动作
                with torch.no_grad():
                    state_t = torch.FloatTensor(state).unsqueeze(0).cuda()
                    action = policy(state_t).cpu().numpy().flatten()

                next_state, _, terminated, truncated, _ = env.step(action)
                done = terminated or truncated
                state = next_state

        # 2. 在收集的状态上查询专家
        for s in iter_states:
            expert_action = expert_policy(s)  # 专家标注
            dataset_states.append(s)
            dataset_actions.append(expert_action)

        # 3. 在聚合数据集上重新训练
        states_tensor = torch.FloatTensor(np.array(dataset_states))
        actions_tensor = torch.FloatTensor(np.array(dataset_actions))

        dataset = TensorDataset(states_tensor, actions_tensor)
        dataloader = DataLoader(dataset, batch_size=256, shuffle=True)

        optimizer = torch.optim.Adam(policy.parameters(), lr=3e-4)
        for epoch in range(50):
            for s_batch, a_batch in dataloader:
                s_batch, a_batch = s_batch.cuda(), a_batch.cuda()
                pred = policy(s_batch)
                loss = F.mse_loss(pred, a_batch)
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

        # 4. 评估
        eval_reward = evaluate_policy(env, policy, num_episodes=5)
        print(f"Iteration {iteration+1}: Avg Reward = {eval_reward:.1f}")
        print(f"Dataset size: {len(dataset_states)}")

    return policy
```

### 5.5 常见实现陷阱

```python
# ❌ 错误1: GAIL判别器太强
# 判别器几步就完美区分 → 策略梯度消失
# ✅ 正确: 限制判别器更新频率
for i in range(5):  # 判别器多更新几步
    update_discriminator()
update_policy()  # 策略更新一次

# ❌ 错误2: BC不做数据归一化
states = raw_states  # 不同维度量纲不同
# ✅ 正确: 归一化到[-1,1]或标准化
state_mean = expert_states.mean(axis=0)
state_std = expert_states.std(axis=0) + 1e-8
states = (raw_states - state_mean) / state_std

# ❌ 错误3: GAIL奖励不加熵正则
reward = -torch.log(D(s, a))
# ✅ 正确: 加熵防止策略坍缩
reward = -torch.log(D(s, a)) + entropy_coeff * entropy(pi)

# ❌ 错误4: AIRL忘记奖励塑形分离
reward_for_rl = f(s, a, s')  # 包含shaping项
# ✅ 正确: RL训练只用r(s,a)
_, reward_for_rl = reward_model(s, a, s')  # 只取r

# ❌ 错误5: DAGGER专家查询太贵
# 每步都查询专家（真实机器人不可能）
# ✅ 正确: 批量查询 + 主动学习
# 只在策略不确定的状态查询专家
uncertainty = policy.get_uncertainty(states)
query_mask = uncertainty > threshold
```

---

## 6. 与其他方法对比

### 6.1 综合对比表

| 维度 | BC | DAGGER | GAIL | AIRL | RL (无演示) |
|------|-----|--------|------|------|-------------|
| **需要在线专家** | 否 | 是 | 否 | 否 | 否 |
| **需要环境交互** | 否 | 是 | 是 | 是 | 是 |
| **协变量偏移** | 严重 | 已解决 | 已解决 | 已解决 | 不适用 |
| **可恢复奖励** | 否 | 否 | 否 | 是 | 不适用 |
| **超越专家** | 否 | 否 | 困难 | 可以 | 是 |
| **样本效率** | 高(离线) | 高 | 中 | 高 | 低 |
| **训练稳定性** | 高 | 高 | 低(GAN) | 中 | 中 |
| **实现复杂度** | 低 | 中 | 高 | 高 | 中 |
| **适用场景** | 简单任务 | 有在线专家 | 离线演示 | 需要奖励 | 有奖励函数 |

### 6.2 选择指南

```
什么时候用BC?
├── 有大量高质量演示数据 ✓
├── 任务简单，状态空间小 ✓
├── 不需要超越专家 ✓
├── 快速原型验证 ✓
└── 作为其他方法的初始化 ✓

什么时候用DAGGER?
├── 有在线专家可以查询 ✓
├── 需要解决协变量偏移 ✓
├── 专家查询成本可接受 ✓
└── 需要理论保证 ✓

什么时候用GAIL?
├── 只有离线演示（无在线专家） ✓
├── 不需要恢复奖励函数 ✓
├── 任务复杂（BC效果差） ✓
└── 可以接受GAN训练的不稳定性 ✓

什么时候用AIRL?
├── 需要可迁移的奖励函数 ✓
├── 需要与RL算法结合 ✓
├── 环境动力学可能变化 ✓
└── 需要超越专家演示 ✓

什么时候用纯RL?
├── 有明确的奖励函数 ✓
├── 没有演示数据 ✓
├── 需要超越人类水平 ✓
└── 见 [[06_强化学习/02_深度强化学习/12_TD3_深入分析]], [[06_强化学习/02_深度强化学习/11_SAC_深入分析]], [[06_强化学习/02_深度强化学习/10_PPO_深入分析]] ✓
```

---

## 7. 2026前沿进展

### 7.1 VLA模型中的模仿学习

```
VLA (Vision-Language-Action) 模型 = 大规模BC + 多模态预训练

2026代表工作:
- RT-2 (Google): 视觉-语言模型直接输出机器人动作
- Octo (Berkeley): 开源通用机器人策略
- OpenVLA (Stanford): 7B参数的开源VLA
- π₀ (Physical Intelligence): 通用机器人基础模型

训练范式:
  阶段1: 大规模视觉-语言预训练 (互联网数据)
  阶段2: 机器人动作数据BC (Open X-Embodiment等)
  阶段3: 少量RL微调 (可选)

数据规模:
  - Open X-Embodiment: 1M+ 轨迹, 22种机器人
  - DROID: 76k 轨迹, 564个场景
  - 互联网视频: 数十亿帧 (自监督)

关键洞察:
  大规模BC + 多模态预训练 > 小规模RL
  → 数据规模是王道
  → 泛化能力来自预训练
  → 精细操作仍需RL微调
```

### 7.2 视频预训练作为模仿学习

```
2026新范式: 从视频学习 (Learning from Video)

传统IL: 需要动作标签 (s, a) 对
视频IL: 只需要视频 (s_t, s_{t+1}, ...)

方法:
1. 逆动力学模型 (Inverse Dynamics):
   给定 (s_t, s_{t+1})，预测 a_t
   → 将视频转化为 (s, a) 对
   → 然后标准BC

2. 视频预测 + 规划:
   学习视频生成模型 (世界模型)
   在"想象"中规划动作
   → 见 [[06_强化学习/02_深度强化学习/08_模型_Based_RL_深入分析]]

3. 对比学习:
   学习状态表示使得"相似动作的状态接近"
   → 无需动作标签

2026代表:
- UniPi: 视频生成作为策略
- SuSIE: 子目标生成
- GR-2 (ByteDance): 视频预训练 + 机器人微调
- Genie 2 (DeepMind): 交互式世界模型
```

### 7.3 扩散策略 (Diffusion Policy)

```
2024-2026: 扩散模型成为模仿学习的新范式

核心思想:
  将动作生成建模为去噪扩散过程
  π(a|s) = 逐步去噪: a_T → a_{T-1} → ... → a_0

优势:
  1. 多模态分布: 自然处理多个合理动作
     → BC的高斯假设失败的场景
     → 例: 绕障碍物可以走左也可以走右

  2. 表达力强: 可以建模任意复杂分布
  3. 训练稳定: 比GAN稳定得多
  4. 动作序列: 一次生成多步动作 (action chunking)

架构:
  输入: 观测 (图像/状态) + 噪声动作
  网络: U-Net 或 Transformer
  输出: 去噪后的动作序列

2026应用:
  - 灵巧手操作 (多指协调)
  - 双臂协作
  - 长horizon操作任务
  - 与VLA结合: VLA理解 + Diffusion执行
```

### 7.4 大规模机器人学习

```
2026趋势: Foundation Model for Robotics

数据飞轮:
  互联网视频 → 视觉理解
  机器人数据 → 动作学习
  仿真数据 → 大规模探索
  人类遥操作 → 高质量演示

训练Pipeline:
  1. 视觉-语言预训练 (数十亿图文对)
  2. 视频预测预训练 (数百万视频)
  3. 机器人BC (数十万轨迹)
  4. 仿真RL微调 (数十亿步)
  5. 真实世界适应 (数百次交互)

关键挑战:
  - 跨embodiment迁移 (不同机器人)
  - 长horizon任务分解
  - 安全约束
  - Sim-to-Real gap → 见 [[06_强化学习/05_机器人与具身智能/07_Sim_to_Real_Transfer_指南]]
```

### 7.5 IRL与LLM对齐的融合

```
2026: IRL思想在LLM对齐中的新应用

1. 从对话历史推断奖励:
   - 用户的隐式反馈 (点击、停留、重写)
   - 不需要显式标注
   - 类似IRL从行为推断奖励

2. 多轮对话中的IRL:
   - 用户的追问暗示不满意
   - 用户的接受暗示满意
   - 从对话动态推断偏好

3. Constitutional AI作为先验:
   - 宪法原则 = IRL中的先验约束
   - AI自我批评 = 专家演示
   - 迭代改进 = DAGGER

4. 见 [[概念/Training/reward-modeling]]:
   - 奖励模型 = 参数化IRL
   - DPO = 绕过显式IRL
   - RLHF = IRL + RL的完整pipeline
```

---

## 8. 相关概念

### 直接相关

- [[概念/Training/reward-modeling]] — 奖励建模本质是IRL在NLP中的应用
- [[06_强化学习/02_深度强化学习/10_PPO_深入分析]] — GAIL中策略优化的标准选择
- [[06_强化学习/02_深度强化学习/11_SAC_深入分析]] — AIRL中策略优化的最佳搭档
- [[06_强化学习/02_深度强化学习/12_TD3_深入分析]] — 连续控制中AIRL+RL的组合

### 扩展方向

- [[06_强化学习/02_深度强化学习/08_模型_Based_RL_深入分析]] — 世界模型，视频预测作为模仿学习
- [[06_强化学习/02_深度强化学习/05_Hierarchical_RL_深入分析]] — 层次化RL，技能学习与演示学习
- [[Exploration_Strategies_Deep_Dive]] — 探索策略，演示引导探索
- [[06_强化学习/02_深度强化学习/09_离线_RL_深入分析]] — 离线RL，与BC/IL共享"从数据学习"的思想

### RLHF与对齐

- [[06_强化学习/03_RLHF与对齐/04_RLHF_DPO_GRPO_深入分析]] — RLHF全流程，IRL思想的应用
- [[06_强化学习/03_RLHF与对齐/02_GRPO_训练_深入分析]] — GRPO训练，无需奖励模型的对齐

### 应用与基础

- [[06_强化学习/05_机器人与具身智能/07_Sim_to_Real_Transfer_指南]] — Sim-to-Real，演示学习在仿真中的应用
- [[Multi_Agent_RL]] — 多智能体，多专家演示学习
- [[06_强化学习/01_强化学习基础/03_RL基础]] — 强化学习基础
- [[90_学习/03_课程资源/hugging_face/03_deep_rl_course]] — 深度RL总览
- [[06_强化学习/05_机器人与具身智能/01_Embodied_AI_2026]] — 具身智能，VLA模型的应用场景
- [[06_强化学习/05_机器人与具身智能/09_VLA_模型_2026]] — VLA模型，大规模模仿学习的代表

---

## 总结

逆强化学习与模仿学习代表了"从演示中学习"的两大范式：

1. **BC** 最简单但有协变量偏移问题
2. **DAGGER** 通过在线查询解决偏移，但需要专家
3. **GAIL** 用对抗学习处理离线演示
4. **AIRL** 恢复可迁移的奖励函数
5. **VLA + Diffusion Policy** 是2026年大规模模仿学习的前沿

> 核心洞察：在数据充足的时代，大规模模仿学习（BC）+ 少量RL微调，比纯RL更有效率。VLA模型的成功证明了"数据规模 > 算法精巧"这一趋势。
