---
title: "层次化强化学习深度解析 (Hierarchical RL Deep Dive)"
category: 06-reinforcement-learning-deep-rl
tags: ["reinforcement-learning", "deep-rl", "hierarchical-rl", "options-framework", "temporal-abstraction", "subgoal", "skill-learning", "feudal-networks", "hiro"]
summary: "> **一句话理解**: 层次化RL是'分层管理'——高层策略制定子目标（做什么），低层策略执行具体动作（怎么做），通过时间抽象将长horizon任务分解为可管理的子任务，是解决复杂长序列决策的关键架构。"
created: 2026-07-19
updated: 2026-07-19
tier: core
aliases:
  - "Hierarchical RL Deep Dive"
  - "HRL"
  - "Options Framework"
  - Hierarchical_RL_Deep_Dive
sources: []

---
# 层次化强化学习深度解析 (Hierarchical RL Deep Dive)

> **一句话理解**: 层次化RL是"分层管理"——高层策略制定子目标（做什么），低层策略执行具体动作（怎么做），通过时间抽象将长horizon任务分解为可管理的子任务，是解决复杂长序列决策的关键架构。

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
| **Options Framework** | Between MDPs and Semi-MDPs (Sutton, Precup & Singh, 1999) |
| **FeUdal Networks** | FeUdal Networks for Hierarchical RL (Vezhnevets et al., 2017) |
| **HIRO** | Data-Efficient HRL with Off-Policy Correction (Nachum et al., 2018) |
| **HAC** | Learning Multi-Level Hierarchies with Hindsight (Andreas et al., 2017) |
| **Director** | Director: Deep RL with Hierarchical Abstractions (Hafner et al., 2020) |
| **LEAGUE** | LEAGUE: Learning Abstract Goals (2024) |

---

## 1. 概述

### 1.1 为什么需要层次化？

标准RL在处理长horizon任务时面临根本性困难：

```
长horizon任务的困境:

问题1: 信用分配 (Credit Assignment)
  任务: 机器人从房间A走到房间B拿杯子
  horizon: 1000步
  奖励: 只在最后拿到杯子时给+1
  → 哪一步是关键的？
  → 1000步中哪些动作导致了成功？
  → 标准RL需要指数级样本来解决

问题2: 探索困难
  随机策略在1000步内到达目标的概率:
  P ≈ (1/|A|)^1000 ≈ 0  ← 几乎不可能！
  → 需要结构化的探索
  → 见 [[Exploration_Strategies_Deep_Dive]]

问题3: 策略复杂度
  一个扁平策略需要记住:
  - 当前在哪个房间
  - 下一步去哪里
  - 如何避障
  - 如何抓取
  → 单一网络难以同时处理所有层次

人类如何解决?
  "去厨房拿杯子" 分解为:
  高层: 走到厨房 → 找到杯子 → 拿起杯子
  中层: 规划路径 → 避障 → 伸手
  低层: 关节力矩控制

  → 层次化分解！
```

### 1.2 层次化RL的核心思想

```
┌─────────────────────────────────────────────────────────┐
│              层次化RL的基本架构                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  高层策略 (Manager / High-Level Policy)                  │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 输入: 当前状态 s_t                              │    │
│  │ 输出: 子目标 g_t (每 c 步输出一次)              │    │
│  │ 时间尺度: 慢 (每10-50步决策一次)                │    │
│  │ 抽象级别: "做什么" (What to do)                 │    │
│  └─────────────────────────────────────────────────┘    │
│                          ↓ 子目标 g_t                   │
│  低层策略 (Worker / Low-Level Policy)                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 输入: 当前状态 s_t + 子目标 g_t                 │    │
│  │ 输出: 原始动作 a_t (每步输出)                   │    │
│  │ 时间尺度: 快 (每步决策)                         │    │
│  │ 抽象级别: "怎么做" (How to do)                  │    │
│  └─────────────────────────────────────────────────┘    │
│                          ↓ 动作 a_t                     │
│                    环境 (Environment)                    │
│                                                         │
│  时间抽象: 高层每c步决策一次                             │
│  c = 时间抽象步长 (temporal abstraction)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 1.3 层次化RL的分类

```
层次化RL方法分类:

1. 基于子目标 (Subgoal-based):
   ├── FeUdal Networks (FuN)
   ├── HIRO
   ├── HAC
   └── Director
   特点: 高层输出子目标状态/向量

2. 基于选项/技能 (Options/Skills):
   ├── Options Framework
   ├── Option-Critic
   ├── DIAYN (技能发现)
   └── DADS
   特点: 学习离散/连续的技能库

3. 基于价值分解 (Value Decomposition):
   ├── MAXQ
   ├── HRL with Successors
   └── HAM
   特点: 分解价值函数

4. 基于规划 (Planning-based):
   ├── 层次化MCTS
   ├── 层次化世界模型
   └── LLM + RL (2026)
   特点: 高层做规划，低层做执行
```

---

## 2. 核心原理

### 2.1 Options Framework (选项框架)

#### 形式化定义

一个option $o$ 是一个三元组 $o = \langle \mathcal{I}_o, \pi_o, \beta_o \rangle$：

- **启动条件** $\mathcal{I}_o \subseteq \mathcal{S}$: 在哪些状态可以启动该option
- **内部策略** $\pi_o: \mathcal{S} \times \mathcal{A} \rightarrow [0,1]$: option执行期间的动作策略
- **终止条件** $\beta_o: \mathcal{S} \rightarrow [0,1]$: 在每个状态终止option的概率

#### 执行语义

```
Option执行过程:

1. 在状态 s_t，高层策略选择 option o
2. 检查: s_t ∈ I_o? (启动条件)
3. 执行: 按 π_o 选择动作 a_t
4. 转移: 环境转移到 s_{t+1}
5. 检查: 以概率 β_o(s_{t+1}) 终止
   - 终止: 回到步骤1，重新选择option
   - 不终止: 回到步骤3，继续执行

时间抽象:
  一个option可能执行1步，也可能执行100步
  高层只在option终止时做决策
  → 有效减少了高层的决策频率
```

#### Semi-MDP框架

使用options后，问题变成Semi-MDP (SMDP)：

$$\text{SMDP} = \langle \mathcal{S}, \mathcal{O}, P_o, R_o, \Gamma_o \rangle$$

其中：
- $P_o(s'|s, o)$: 执行option $o$ 后的状态转移
- $R_o(s, o)$: 执行option $o$ 的累积奖励
- $\Gamma_o(s, o)$: 折扣因子（取决于option持续时间）

$$R_o(s, o) = \mathbb{E}\left[\sum_{k=0}^{\tau-1} \gamma^k r_{t+k} \mid s_t = s, o_t = o\right]$$

其中 $\tau$ 是option的持续时间（随机变量）。

#### Option-Critic架构

Option-Critic (Bacon et al., 2017) 端到端学习options：

$$\mathcal{L} = \mathcal{L}_{option} + \mathcal{L}_{termination}$$

Option选择（高层）：

$$\pi_\Omega(o|s) = \text{softmax}(Q_\Omega(s, o))$$

终止学习：

$$\beta_o(s) = \sigma(W_\beta \phi(s) + b_\beta)$$

梯度：

$$\frac{\partial \mathcal{L}}{\partial \theta_o} = -\sum_s \mu(s, o) \sum_a \frac{\partial \pi_o(a|s)}{\partial \theta_o} Q_o(s, a)$$

### 2.2 FeUdal Networks (FuN)

#### 架构设计

```
FeUdal Networks 架构:

Manager (高层):
  输入: 状态 s_t (每 c 步)
  输出: 方向向量 d_t ∈ ℝ^k (单位球面上)
  含义: "朝着这个方向前进"

Worker (低层):
  输入: 状态 s_t + 子目标 g_t
  输出: 动作 a_t
  含义: "执行动作以接近子目标"

子目标设置:
  g_t = s_{t+c} - s_t  (c步后的状态变化)
  归一化: g_t / ||g_t|| → 方向

内在奖励 (Worker):
  r_t^W = cos(s_{t+1} - s_t, g_t)
  = (s_{t+1} - s_t)^T g_t / (||s_{t+1} - s_t|| · ||g_t||)
  → Worker被奖励"朝子目标方向移动"

Manager损失:
  L_M = 1 - cos(s_{t+c} - s_t, d_t)
  → Manager被训练预测"实际的状态变化方向"
```

#### 数学公式

Manager目标：

$$\max_{\theta_M} \mathbb{E}\left[\sum_t r_t + \alpha \mathcal{H}(\pi_M)\right]$$

Worker内在奖励：

$$r_t^{intrinsic} = \frac{(s_{t+1} - s_t) \cdot g_t}{||s_{t+1} - s_t|| \cdot ||g_t||}$$

Worker总奖励：

$$r_t^{total} = r_t^{env} + \beta \cdot r_t^{intrinsic}$$

### 2.3 HIRO (Hierarchical RL with Off-Policy Correction)

#### 核心创新

HIRO解决了层次化RL中的off-policy修正问题：

```
问题: 高层策略是off-policy的
  - 高层每c步决策一次
  - 在这c步内，低层策略可能已经更新
  - Replay buffer中的子目标可能已经"过时"
  - 标准off-policy方法（如TD3）的假设被违反

HIRO的解决:
  1. 子目标重标注 (Goal Relabeling):
     - 存储: (s_t, g_t, s_{t+c}, r_{t:t+c})
     - 重标注: g_t' = s_{t+c} - s_t (实际达到的)
     - 用实际结果替代原始子目标

  2. 低层用TD3训练:
     - 输入: (s_t, g_t)
     - 输出: a_t
     - 奖励: -||s_{t+1} - s_t - g_t||² (接近子目标)

  3. 高层也用off-policy:
     - 输入: s_t
     - 输出: g_t
     - 奖励: 环境奖励的累积
```

#### 子目标空间设计

```
HIRO的子目标定义:

g_t = s_{t+c} - s_t  (状态差)

含义: "在c步内，状态应该变化多少"

优势:
  - 子目标是相对量（不依赖绝对位置）
  - 低层策略可以泛化到不同位置
  - 自然的时间抽象

低层奖励:
  r_t^W = -||f(s_{t+1}) - f(s_t) - g_t||²

  其中 f 是状态嵌入（可以是identity或学习的）
```

### 2.4 时间抽象 (Temporal Abstraction)

#### 为什么时间抽象重要？

```
无时间抽象 (扁平RL):
  决策频率: 每步
  horizon: T = 1000步
  有效搜索空间: |A|^T = |A|^1000

有时间抽象 (c=10):
  高层决策频率: 每10步
  高层horizon: T/c = 100步
  高层搜索空间: |G|^100 (G是子目标空间)
  低层搜索空间: |A|^10 (每个子目标内)

  总搜索空间: |G|^100 × |A|^10 << |A|^1000

  → 指数级减少！
```

#### 时间抽象的权衡

```
c 太小 (如 c=2):
  - 高层决策太频繁
  - 子目标太短期
  - 退化为扁平RL
  - 层次化优势消失

c 太大 (如 c=100):
  - 高层决策太少
  - 子目标太长期
  - 低层难以完成
  - 信用分配仍然困难

最佳 c:
  - 通常 c = 5~50
  - 取决于任务结构
  - 可以自适应学习
  - 多层级: c1=5, c2=25, c3=125
```

### 2.5 子目标发现 (Subgoal Discovery)

```
自动发现子目标的方法:

1. 基于瓶颈状态:
   - 找到状态空间中的"必经之路"
   - 如: 门口、走廊交叉口
   - 方法: 图分割、谱聚类

2. 基于技能分割:
   - 从演示数据中发现自然分割点
   - 见 [[Inverse_RL_Imitation_Learning]]
   - 方法: 变点检测、HMM

3. 基于互信息 (DIAYN):
   - 最大化技能与状态的互信息
   - I(z; s) = H(s) - H(s|z)
   - 不同技能访问不同状态区域
   - 自动发现多样化技能

4. 基于价值函数:
   - 价值函数的局部极值点
   - 梯度为零的状态
   - 自然的任务分割点

5. 基于LLM (2026):
   - 用语言模型描述子目标
   - "先走到桌子旁" → "再拿起杯子"
   - 自然语言作为子目标表示
   - 见 "与Agent规划的关系" 部分
```

---

## 3. 算法详解

### 3.1 HIRO完整算法

```
算法: HIRO (Hierarchical RL with Off-Policy Correction)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
初始化:
  - 高层策略 μ_H(s) → g (子目标生成器)
  - 低层策略 μ_L(s, g) → a (动作生成器)
  - 高层Critic Q_H(s, g)
  - 低层Critic Q_L(s, g, a)
  - 目标网络 (各一个)
  - Replay Buffers: D_H (高层), D_L (低层)
  - 时间抽象步长 c = 10

训练循环:
  s_0 = env.reset()
  for t = 0, 1, 2, ...:

    # 高层决策 (每c步)
    if t % c == 0:
      g_t = μ_H(s_t) + exploration_noise
      cumulative_reward = 0

    # 低层执行
    a_t = μ_L(s_t, g_t) + exploration_noise
    s_{t+1}, r_t, done = env.step(a_t)
    cumulative_reward += r_t

    # 低层奖励: 接近子目标
    r_t^L = -||s_{t+1} - s_t - g_t||²

    # 存储低层transition
    D_L.add(s_t, g_t, a_t, r_t^L, s_{t+1}, done)

    # 每c步: 存储高层transition
    if t % c == c-1 or done:
      # 子目标重标注
      g_t_relabeled = s_{t+1} - s_t  (实际达到的)
      D_H.add(s_t, g_t, cumulative_reward, s_{t+1}, done)

      # 更新高层 (用TD3)
      train_high_level(D_H)

    # 每步更新低层 (用TD3)
    train_low_level(D_L)

    s_t = s_{t+1}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.2 Option-Critic算法

```
算法: Option-Critic (端到端学习Options)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
初始化:
  - K个option的内部策略 π_1, ..., π_K
  - 高层策略 π_Ω(o|s)
  - 终止函数 β_1(s), ..., β_K(s)
  - Q值: Q_Ω(s,o), Q_o(s,a) for each o

训练循环:
  s = env.reset()
  选择初始option: o ~ π_Ω(·|s)

  for each step:
    # 执行当前option的动作
    a ~ π_o(·|s)
    s', r, done = env.step(a)

    # 更新Q值
    Q_Ω(s,o) ← Q_Ω(s,o) + α[r + γ max_o' Q_Ω(s',o') - Q_Ω(s,o)]
    Q_o(s,a) ← Q_o(s,a) + α[r + γ(1-β_o(s'))V(s') - Q_o(s,a)]

    # 更新option策略 (策略梯度)
    ∇π_o ∝ (Q_o(s,a) - V(s)) · ∇log π_o(a|s)

    # 更新终止函数
    ∇β_o ∝ (Q_Ω(s,o) - max_o' Q_Ω(s,o')) · ∇β_o(s)
    → 如果当前option不如最优option，增加终止概率

    # 更新高层策略
    ∇π_Ω ∝ (Q_Ω(s,o) - V_Ω(s)) · ∇log π_Ω(o|s)

    # 检查终止
    if Bernoulli(β_o(s')):
      o ~ π_Ω(·|s')  # 选择新option

    s = s'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.3 Director (层次化世界模型)

```
算法: Director (Hafner et al., 2020)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
核心思想: 在世界模型中做层次化

架构:
  世界模型 (RSSM):
    - 编码器: o_t → s_t (观测→潜在状态)
    - 动力学: s_t, a_t → s_{t+1} (状态转移)
    - 解码器: s_t → ô_t (状态→观测)

  高层策略 (Manager):
    - 输入: s_t
    - 输出: 离散任务 z_t ∈ {1, ..., K}
    - 频率: 每 c 步

  低层策略 (Worker):
    - 输入: s_t, z_t
    - 输出: a_t
    - 频率: 每步

训练:
  1. 在想象中 (imagination) 训练:
     - 用世界模型生成轨迹
     - 不需要真实环境交互
     - 样本效率极高

  2. 高层奖励:
     r_H = 环境奖励 + 内在奖励(探索新状态)

  3. 低层奖励:
     r_L = 环境奖励 (直接)

  4. 交替训练:
     - 固定高层，训练低层
     - 固定低层，训练高层
     - 见 [[Model_Based_RL_Deep_Dive]]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.4 技能学习 (Skill Learning)

```
DIAYN (Diversity is All You Need):

目标: 学习多样化的技能，无需环境奖励

最大化:
  F(θ) = I(z; s) + H(z) - H(z|s_0)
       = 互信息 + 技能熵 - 初始状态条件熵

  z: 技能变量 (离散或连续)
  s: 状态
  s_0: 初始状态

直觉:
  - I(z; s) 大: 不同技能访问不同状态 → 技能有区分度
  - H(z) 大: 技能均匀使用 → 不坍缩
  - H(z|s_0) 小: 初始状态不决定技能 → 技能是学到的

训练:
  1. 采样技能 z ~ p(z) (均匀)
  2. 用策略 π(a|s,z) 执行
  3. 内在奖励: r = log q(z|s) - log p(z)
     → 被奖励"到达能识别技能z的状态"
  4. 用 [[SAC_Deep_Dive|SAC]] 优化

应用:
  - 技能作为高层动作
  - 下游任务: 选择技能序列
  - 零样本迁移: 组合已有技能
```

---

## 4. 实验与基准

### 4.1 标准基准任务

| 环境 | 描述 | Horizon | 层次化优势 |
|------|------|---------|-----------|
| Ant-Maze | 蚂蚁走迷宫 | 1000+ | 极大（需要路径规划） |
| Ant-Push | 蚂蚁推物体 | 500+ | 大（需要分阶段） |
| Ant-Fall | 蚂蚁下台阶 | 500+ | 大（需要分阶段） |
| Kitchen | 厨房多任务 | 280 | 大（多子任务序列） |
| Montezuma's Revenge | Atari探索 | 9999+ | 极大（极度稀疏） |
| MiniGrid | 网格世界 | 变化 | 中等 |
| Crafter | 生存游戏 | 无限 | 大（科技树） |

### 4.2 Ant-Maze性能对比

| 方法 | Ant-Maze-U | Ant-Maze-M | Ant-Maze-L |
|------|-----------|-----------|-----------|
| SAC (扁平) | 0% | 0% | 0% |
| HIRO | 67% | 45% | 28% |
| HAC | 73% | 52% | 35% |
| Director | **82%** | **68%** | **52%** |
| FuN | 45% | 30% | 15% |
| Option-Critic | 55% | 38% | 20% |
| LEAGUE (2024) | **90%** | **75%** | **60%** |

**关键发现**：
- 扁平RL在长horizon迷宫中完全失败
- 层次化方法将成功率从0%提升到60-90%
- Director（世界模型+层次化）效果最好
- 子目标空间设计是关键

### 4.3 Kitchen多任务环境

```
Kitchen环境:
  任务: 完成4个子任务 (如: 开微波炉、开水壶、开灯、滑橱柜)
  子任务顺序: 任意
  奖励: 每完成一个子任务 +1

结果 (平均完成子任务数 / 4):
  扁平SAC:        0.3
  HIRO:           1.8
  HAC:            2.1
  Director:       2.8
  Relay Policy:   2.5
  人类演示+RL:    3.5

分析:
  - 层次化方法自然地将任务分解为子任务
  - 高层学习"做什么顺序"
  - 低层学习"如何执行每个子任务"
  - 演示初始化进一步提升效果
```

### 4.4 时间抽象步长的影响

```
HIRO在Ant-Maze-U上的性能 vs 时间抽象步长c:

c=2:   成功率 35%  (太短，退化为扁平)
c=5:   成功率 55%
c=10:  成功率 67%  (标准设置)
c=20:  成功率 62%
c=50:  成功率 48%  (太长，低层难以完成)
c=100: 成功率 30%  (太长，信用分配困难)

最优c取决于:
  - 子任务的典型持续时间
  - 状态空间的尺度
  - 低层策略的能力
```

---

## 5. 代码实现要点

### 5.1 HIRO实现 (PyTorch)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import copy

class HighLevelPolicy(nn.Module):
    """高层策略: 状态 → 子目标"""
    def __init__(self, state_dim, goal_dim, hidden_dim=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, goal_dim),
            nn.Tanh(),  # 子目标归一化
        )

    def forward(self, state):
        return self.net(state)


class LowLevelPolicy(nn.Module):
    """低层策略: (状态, 子目标) → 动作"""
    def __init__(self, state_dim, goal_dim, action_dim, hidden_dim=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim + goal_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim),
            nn.Tanh(),
        )

    def forward(self, state, goal):
        sg = torch.cat([state, goal], dim=-1)
        return self.net(sg)


class HighLevelCritic(nn.Module):
    """高层Critic: Q(s, g)"""
    def __init__(self, state_dim, goal_dim, hidden_dim=256):
        super().__init__()
        # Twin Q (见 [[TD3_Deep_Dive]])
        self.q1 = nn.Sequential(
            nn.Linear(state_dim + goal_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
        )
        self.q2 = nn.Sequential(
            nn.Linear(state_dim + goal_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
        )

    def forward(self, state, goal):
        sg = torch.cat([state, goal], dim=-1)
        return self.q1(sg), self.q2(sg)


class LowLevelCritic(nn.Module):
    """低层Critic: Q(s, g, a)"""
    def __init__(self, state_dim, goal_dim, action_dim, hidden_dim=256):
        super().__init__()
        self.q1 = nn.Sequential(
            nn.Linear(state_dim + goal_dim + action_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
        )
        self.q2 = nn.Sequential(
            nn.Linear(state_dim + goal_dim + action_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
        )

    def forward(self, state, goal, action):
        sga = torch.cat([state, goal, action], dim=-1)
        return self.q1(sga), self.q2(sga)


class HIRO:
    def __init__(self, state_dim, action_dim, goal_dim=None,
                 c=10, gamma=0.99, tau=0.005, lr=3e-4):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.goal_dim = goal_dim or state_dim  # 子目标维度=状态维度
        self.c = c  # 时间抽象步长
        self.gamma = gamma
        self.tau = tau

        # 高层
        self.high_policy = HighLevelPolicy(state_dim, self.goal_dim).cuda()
        self.high_critic = HighLevelCritic(state_dim, self.goal_dim).cuda()
        self.high_policy_target = copy.deepcopy(self.high_policy)
        self.high_critic_target = copy.deepcopy(self.high_critic)

        # 低层
        self.low_policy = LowLevelPolicy(
            state_dim, self.goal_dim, action_dim
        ).cuda()
        self.low_critic = LowLevelCritic(
            state_dim, self.goal_dim, action_dim
        ).cuda()
        self.low_policy_target = copy.deepcopy(self.low_policy)
        self.low_critic_target = copy.deepcopy(self.low_critic)

        # 优化器
        self.high_opt = torch.optim.Adam(self.high_policy.parameters(), lr=lr)
        self.high_critic_opt = torch.optim.Adam(self.high_critic.parameters(), lr=lr)
        self.low_opt = torch.optim.Adam(self.low_policy.parameters(), lr=lr)
        self.low_critic_opt = torch.optim.Adam(self.low_critic.parameters(), lr=lr)

    def select_high_action(self, state):
        """高层选择子目标"""
        with torch.no_grad():
            state_t = torch.FloatTensor(state).unsqueeze(0).cuda()
            goal = self.high_policy(state_t).cpu().numpy().flatten()
        return goal

    def select_low_action(self, state, goal):
        """低层选择动作"""
        with torch.no_grad():
            state_t = torch.FloatTensor(state).unsqueeze(0).cuda()
            goal_t = torch.FloatTensor(goal).unsqueeze(0).cuda()
            action = self.low_policy(state_t, goal_t).cpu().numpy().flatten()
        return action

    def compute_low_reward(self, state, next_state, goal):
        """低层内在奖励: 接近子目标"""
        achieved = next_state - state
        return -np.sum((achieved - goal) ** 2, axis=-1)

    def train_low_level(self, batch):
        """训练低层 (TD3风格)"""
        s, g, a, r, s_next, done = batch

        with torch.no_grad():
            # 目标动作 + 平滑噪声
            noise = (torch.randn_like(a) * 0.2).clamp(-0.5, 0.5)
            next_a = (self.low_policy_target(s_next, g) + noise).clamp(-1, 1)
            target_q1, target_q2 = self.low_critic_target(s_next, g, next_a)
            target_q = torch.min(target_q1, target_q2)
            target = r + (1 - done) * self.gamma * target_q

        q1, q2 = self.low_critic(s, g, a)
        critic_loss = F.mse_loss(q1, target) + F.mse_loss(q2, target)

        self.low_critic_opt.zero_grad()
        critic_loss.backward()
        self.low_critic_opt.step()

        # 延迟更新Actor
        actor_loss = -self.low_critic.q1(
            torch.cat([s, g, self.low_policy(s, g)], dim=-1)
        ).mean()

        self.low_opt.zero_grad()
        actor_loss.backward()
        self.low_opt.step()

    def train_high_level(self, batch):
        """训练高层 (TD3风格)"""
        s, g, r, s_next, done = batch

        with torch.no_grad():
            noise = (torch.randn_like(g) * 0.2).clamp(-0.5, 0.5)
            next_g = (self.high_policy_target(s_next) + noise).clamp(-1, 1)
            target_q1, target_q2 = self.high_critic_target(s_next, next_g)
            target_q = torch.min(target_q1, target_q2)
            # 高层用 γ^c 折扣
            target = r + (1 - done) * (self.gamma ** self.c) * target_q

        q1, q2 = self.high_critic(s, g)
        critic_loss = F.mse_loss(q1, target) + F.mse_loss(q2, target)

        self.high_critic_opt.zero_grad()
        critic_loss.backward()
        self.high_critic_opt.step()

        actor_loss = -self.high_critic.q1(
            torch.cat([s, self.high_policy(s)], dim=-1)
        ).mean()

        self.high_opt.zero_grad()
        actor_loss.backward()
        self.high_opt.step()
```

### 5.2 Option-Critic简化实现

```python
class OptionCritic:
    """Option-Critic: 端到端学习离散options"""
    def __init__(self, state_dim, action_dim, num_options=4, lr=3e-4):
        self.num_options = num_options

        # 每个option一个策略
        self.option_policies = nn.ModuleList([
            nn.Sequential(
                nn.Linear(state_dim, 256), nn.ReLU(),
                nn.Linear(256, action_dim), nn.Softmax(dim=-1),
            ) for _ in range(num_options)
        ]).cuda()

        # 高层策略 (option选择)
        self.meta_policy = nn.Sequential(
            nn.Linear(state_dim, 256), nn.ReLU(),
            nn.Linear(256, num_options), nn.Softmax(dim=-1),
        ).cuda()

        # 终止函数
        self.termination = nn.ModuleList([
            nn.Sequential(
                nn.Linear(state_dim, 256), nn.ReLU(),
                nn.Linear(256, 1), nn.Sigmoid(),
            ) for _ in range(num_options)
        ]).cuda()

        # Q值
        self.Q_omega = nn.Sequential(  # Q(s, o)
            nn.Linear(state_dim, 256), nn.ReLU(),
            nn.Linear(256, num_options),
        ).cuda()

    def select_option(self, state, epsilon=0.1):
        """ε-greedy选择option"""
        if np.random.random() < epsilon:
            return np.random.randint(self.num_options)
        with torch.no_grad():
            s = torch.FloatTensor(state).unsqueeze(0).cuda()
            q = self.Q_omega(s)
            return q.argmax(dim=-1).item()

    def select_action(self, state, option):
        """在option内选择动作"""
        with torch.no_grad():
            s = torch.FloatTensor(state).unsqueeze(0).cuda()
            probs = self.option_policies[option](s)
            return torch.multinomial(probs, 1).item()

    def should_terminate(self, state, option):
        """检查是否终止当前option"""
        with torch.no_grad():
            s = torch.FloatTensor(state).unsqueeze(0).cuda()
            prob = self.termination[option](s)
            return torch.bernoulli(prob).item() > 0.5
```

### 5.3 常见实现陷阱

```python
# ❌ 错误1: 子目标空间太大
goal_dim = 100  # 高维子目标，低层无法完成
# ✅ 正确: 子目标维度适中，或用低维嵌入
goal_dim = state_dim  # 或学习一个低维嵌入
goal = encoder(state)  # 压缩到关键维度

# ❌ 错误2: 低层奖励设计不当
r_low = -np.linalg.norm(next_state - goal)  # 绝对位置
# ✅ 正确: 用相对位移
r_low = -np.linalg.norm((next_state - state) - goal)  # 相对变化

# ❌ 错误3: 高层折扣因子错误
target = r + gamma * next_q  # 用γ而非γ^c
# ✅ 正确: 高层用γ^c (因为每c步决策一次)
target = r + (gamma ** c) * next_q

# ❌ 错误4: 子目标不重标注
# 直接用原始子目标训练高层
# ✅ 正确: HIRO式重标注
goal_relabeled = actual_next_state - state  # 实际达到的

# ❌ 错误5: 高低层同时更新
# 每步同时更新高层和低层
# ✅ 正确: 低层每步更新，高层每c步更新
if t % c == 0:
    train_high_level()
train_low_level()  # 每步
```

---

## 6. 与其他方法对比

### 6.1 综合对比表

| 维度 | 扁平RL | Options | FuN | HIRO | Director |
|------|--------|---------|-----|------|----------|
| **时间抽象** | 无 | 可变 | 固定c | 固定c | 固定c |
| **子目标类型** | 无 | 终止条件 | 方向向量 | 状态差 | 离散任务 |
| **高层学习** | 不适用 | 策略梯度 | 策略梯度 | Off-policy | 世界模型 |
| **低层学习** | 直接 | 策略梯度 | 内在奖励 | TD3 | 世界模型 |
| **Off-policy** | 可以 | 困难 | 困难 | 是 | 是(想象) |
| **样本效率** | 低 | 中 | 中 | 高 | 极高 |
| **长horizon** | 极差 | 好 | 好 | 好 | 极好 |
| **实现复杂度** | 低 | 中 | 高 | 高 | 极高 |
| **可扩展性** | 好 | 中 | 中 | 好 | 中 |

### 6.2 选择指南

```
什么时候用扁平RL?
├── 短horizon任务 (< 200步) ✓
├── 奖励密集 ✓
├── 简单环境 ✓
└── 见 [[TD3_Deep_Dive]], [[SAC_Deep_Dive]], [[PPO_Deep_Dive]]

什么时候用Options/技能?
├── 有自然的子任务结构 ✓
├── 需要技能复用 ✓
├── 离散技能集足够 ✓
└── 需要可解释性 ✓

什么时候用HIRO?
├── 连续状态空间 ✓
├── 需要off-policy样本效率 ✓
├── 子目标可以用状态差表示 ✓
└── 长horizon连续控制 ✓

什么时候用Director?
├── 需要极高样本效率 ✓
├── 可以学习世界模型 ✓
├── 复杂视觉环境 ✓
└── 见 [[Model_Based_RL_Deep_Dive]] ✓

什么时候用LLM + RL (2026)?
├── 需要自然语言子目标 ✓
├── 需要常识推理 ✓
├── 开放世界任务 ✓
└── 见 "与Agent规划的关系" ✓
```

---

## 7. 2026前沿进展

### 7.1 与Agent规划的关系

```
2026: LLM作为高层规划器 + RL作为低层执行器

架构:
  LLM (高层):
    - 输入: 任务描述 + 当前状态
    - 输出: 自然语言子目标序列
    - "1. 走到厨房 2. 打开冰箱 3. 拿出牛奶"

  VLA/RL (低层):
    - 输入: 子目标 + 视觉观测
    - 输出: 机器人动作
    - 执行每个子目标

代表工作:
  - SayCan (Google): LLM规划 + 价值函数可行性评估
  - Code as Policies: LLM生成控制代码
  - Inner Monologue: LLM + 环境反馈循环
  - Voyager (Minecraft): LLM技能库 + 自动课程
  - RT-2 + PaLM-E: 端到端VLA

优势:
  - LLM提供常识和推理能力
  - RL提供精确控制
  - 自然语言作为子目标表示
  - 零样本泛化到新任务

挑战:
  - LLM幻觉 → 不可行的子目标
  - 低层执行失败 → 需要重规划
  - 长horizon → 规划深度有限
  - 实时性 → LLM推理慢
```

### 7.2 自动层次发现

```
2026: 无需手动设计层次结构

方法1: 层次化技能发现
  - 自动学习多层级技能
  - 底层: 原子动作 (伸手、抓取)
  - 中层: 基元动作 (拿杯子、开门)
  - 高层: 任务序列 (做早餐)

方法2: 时间尺度学习
  - 自动学习每层的决策频率
  - 不需要手动设置c
  - 基于信息瓶颈原理

方法3: 因果发现
  - 从数据中发现因果层次
  - 哪些变量是"高层"的
  - 哪些是"低层"的

方法4: 对比学习
  - 学习不同时间尺度的表示
  - 慢变量 → 高层
  - 快变量 → 低层
  - 类似时间对比网络 (TCN)
```

### 7.3 层次化离线RL

```
2026: 从离线数据学习层次化策略

挑战:
  - 离线数据没有子目标标注
  - 需要自动发现层次结构
  - 分布偏移问题更严重

方法:
  1. 轨迹分割 + BC:
     - 用变点检测分割轨迹为子任务
     - 每段训练一个低层策略
     - 高层学习子任务序列

  2. 层次化Decision Transformer:
     - 高层DT: 预测子目标序列
     - 低层DT: 条件于子目标预测动作
     - 见 [[Offline_RL_Deep_Dive]]

  3. 层次化Diffusion Policy:
     - 高层: 扩散模型生成子目标
     - 低层: 扩散模型生成动作序列
     - 多模态分布处理

  4. 视频预训练 + 层次化:
     - 从视频学习层次化表示
     - 慢特征 → 子目标
     - 快特征 → 动作
```

### 7.4 多智能体层次化RL

```
2026: 层次化 + 多智能体

架构:
  全局高层: 任务分配 (谁做什么)
  局部高层: 路径规划 (怎么做)
  低层: 动作执行 (具体控制)

应用:
  - 多机器人仓库物流
  - 自动驾驶车队协调
  - 多无人机编队
  - 见 [[Multi_Agent_RL]]

方法:
  - 集中式高层 + 分布式低层
  - 通信作为子目标传递
  - 层次化信用分配
```

### 7.5 层次化探索

```
2026: 层次化结构改善探索

问题: 长horizon任务的探索极其困难
  → 见 [[Exploration_Strategies_Deep_Dive]]

层次化探索:
  高层探索: 尝试不同的子目标序列
    → 粗粒度探索 (去哪里)
  低层探索: 在子目标内尝试不同动作
    → 细粒度探索 (怎么去)

方法:
  1. 好奇心驱动的高层:
     - 高层被奖励"访问新的子目标区域"
     - 低层被奖励"完成当前子目标"

  2. 技能空间的探索:
     - 在技能空间而非动作空间探索
     - 尝试不同的技能组合
     - DIAYN + 层次化

  3. LLM引导的探索:
     - LLM建议"下一步尝试什么"
     - 基于常识的探索方向
     - 减少无效探索
```

---

## 8. 相关概念

### 直接相关

- [[TD3_Deep_Dive]] — HIRO低层使用TD3训练
- [[SAC_Deep_Dive]] — 技能学习(DIAYN)基于SAC
- [[PPO_Deep_Dive]] — Option-Critic中策略更新
- [[Model_Based_RL_Deep_Dive]] — Director基于世界模型

### 扩展方向

- [[Exploration_Strategies_Deep_Dive]] — 层次化探索策略
- [[Inverse_RL_Imitation_Learning]] — 从演示学习技能/子目标
- [[Offline_RL_Deep_Dive]] — 层次化离线RL
- [[Multi_Agent_RL]] — 多智能体层次化

### RLHF与Agent

- [[Reward_Modeling_Deep_Dive]] — 多层级奖励设计
- [[RLHF_DPO_GRPO_Deep_Dive]] — RLHF中的层次化奖励
- [[Hierarchical_RL_Deep_Dive]] — 本文

### 基础与应用

- [[RL_Foundations]] — 强化学习基础，SMDP
- [[Deep_RL]] — 深度RL总览
- [[Sim_to_Real_Transfer_Guide]] — 层次化策略的Sim-to-Real
- [[Embodied_AI_2026]] — 具身智能中的层次化控制
- [[VLA_Models_2026]] — VLA模型，LLM+RL的层次化架构

---

## 总结

层次化RL通过时间抽象和子目标分解，将不可解的长horizon问题转化为可管理的子问题：

1. **Options Framework** 提供了理论基础（SMDP）
2. **FuN** 开创了深度层次化RL
3. **HIRO** 解决了off-policy修正问题
4. **Director** 结合世界模型达到SOTA
5. **LLM + RL** 是2026年最实用的层次化架构

> 核心洞察：层次化不是可选的优化——对于真正的长horizon任务，它是必需的。2026年的Agent系统（LLM规划 + RL执行）本质上就是层次化RL的工程实现。
