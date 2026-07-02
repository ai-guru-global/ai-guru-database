---
title: 'DQN 深度解读 - 深度强化学习开山之作'
category: '06-reinforcement-learning-deep-rl'
tags: ["reinforcement-learning", "agent", "mdp", "dqn"]
summary: '> **一句话理解**: DQN 就像教 AI "记住游戏经验"——用深度学习记住每种场面的"分数"，用经验回放打乱相关性，用目标网络固定"正确答案"，三项创新结合让 AI 首次从像素级别学会玩游戏。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Dqn Deep Dive"
  - "DQN Deep Dive"
  - DQN_Deep_Dive
sources: []

---
# DQN 深度解读 - 深度强化学习开山之作

> **一句话理解**: DQN 就像教 AI "记住游戏经验"——用深度学习记住每种场面的"分数"，用经验回放打乱相关性，用目标网络固定"正确答案"，三项创新结合让 AI 首次从像素级别学会玩游戏。

---

## 论文信息

| 属性 | 内容 |
|------|------|
| **论文** | Playing Atari with Deep Reinforcement Learning |
| **作者** | Mnih et al., DeepMind |
| **发表** | Nature 2013 |

---

## 1. 核心创新

### 三项关键技术

```
1. 端到端学习
   原始像素 → 神经网络 → 游戏动作
   无需人工设计特征

2. 经验回放 (Experience Replay)
   把游戏经历存起来，随机抽取学习
   打破样本相关性

3. 目标网络 (Target Network)
   用"老"网络计算目标值
   学习更稳定
```

---

## 2. 问题：为什么传统 RL 不行？

### 雅达利游戏的挑战

```
- 状态空间: 210×160×3 = 100,800 像素
- 动作空间: 约 18 个按钮组合
- 状态数量: 10^170+ (比宇宙原子还多)

传统 Q-Learning 用 Q 表根本存不下！
```

---

## 3. DQN 算法

### 3.1 整体架构

```
输入层: 210×160×3 原始像素
  ↓
卷积层1: 32 个 8×8 卷积, stride=4, ReLU
  ↓
卷积层2: 64 个 4×4 卷积, stride=2, ReLU
  ↓
卷积层3: 64 个 3×3 卷积, stride=1, ReLU
  ↓
全连接层: 512, ReLU
  ↓
输出层: 18 个动作的 Q 值
```

### 3.2 Q-Learning 目标

```
Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]

更新规则:
- 旧价值 + 学习率 × TD 误差
- TD 误差 = 实际奖励 + 未来价值 - 旧价值
```

### 3.3 经验回放

```
经验池存储:
(s_t, a_t, r_t, s_{t+1}, done)

随机采样 batch 学习，打破时间相关性
```

### 3.4 目标网络

```
每 N 步把在线网络的参数复制给目标网络

目标值 = r + γ·max Q_target(s', a')
固定目标一段时间，学习更稳定
```

---

## 4. 伪代码

```
初始化: 在线网络 Q, 目标网络 Q̄, 经验池 D
for episode in range(M):
    s = 环境初始化
    for step in range(T):
        # ε-greedy 选择动作
        a = π_ε(s)

        # 执行动作
        s', r, done = env.step(a)

        # 存储经验
        D.append((s, a, r, s', done))

        # 从 D 随机采样
        batch = sample(D)

        # 计算 TD 目标
        y = r + γ·max Q̄(s')  (if not done)

        # 更新 Q 网络
        loss = (y - Q(s,a))²
        optimizer.step()

        # 定期更新目标网络
        if step % N == 0:
            Q̄ ← Q
```

---

## 5. 实验结果

| 游戏 | 随机策略 | DQN | 人类 |
|------|---------|-----|------|
| Breakout | 0.3 | 401 | 31.8 |
| Space Invaders | 0.2 | 126 | 1.8 |
| Enduro | 0.0 | 142 | 1.6 |

---

## 6. 为什么必读

```
【学术价值】
- 证明 DL + RL 可以结合
- 开创深度 RL 领域
- 启发了后续所有深度 RL (AlphaGo, PPO等)

【工程价值】
- 第一个通用游戏 AI
- 同一架构玩多个游戏
- 为机器人、自动驾驶铺路
```

---

## 7. 后续改进

```
DQN → Double DQN (解决过估计)
    → Dueling DQN (分离状态价值和动作优势)
    → Prioritized DDQN (优先级采样)
    → Rainbow (组合所有改进)
```

---

*原始论文: [arXiv:1312.5602](https://arxiv.org/abs/1312.5602)*