---
title: RL Foundations
type: index
created: 2026-07-02
updated: 2026-07-11
sources: []
---

# RL Foundations

本页面索引 `强化学习/RL_Foundations` 目录下的所有内容。

> **合并说明**: 原 `RL_Fundamentals/` 目录已合并至 `RL_Foundations/`。以下两个文件从 RL_Fundamentals 迁入。

## 内容导航

### 核心文档

| 文件 | 说明 |
|------|------|
| [[强化学习/RL_Foundations/RL_Foundations\|RL Foundations]] | 强化学习基础——完整版，涵盖核心理论与算法 |
| [[强化学习/RL_Foundations/RL_Foundations_for_dummy\|RL Foundations For Dummy]] | 强化学习基础——大白话版，面向初学者 |

### 从 RL_Fundamentals 合并的文档

| 文件 | 说明 |
|------|------|
| [[强化学习/RL_Foundations/RL-in-nutshell\|RL in a Nutshell]] | 强化学习精要概览——从 RL_Fundamentals 合并，浓缩核心概念与关键算法 |
| [[强化学习/RL_Foundations/RL_Fundamentals_overview\|RL Fundamentals Overview]] | 强化学习基础总览——从 RL_Fundamentals 合并，系统梳理 RL 基础知识体系 |

## 全部文件

- [[强化学习/RL_Foundations/RL_Foundations|RL Foundations]]
- [[强化学习/RL_Foundations/RL_Foundations_for_dummy|RL Foundations For Dummy]]
- [[强化学习/RL_Foundations/RL-in-nutshell|RL in a Nutshell]] *(从 RL_Fundamentals 合并)*
- [[强化学习/RL_Foundations/RL_Fundamentals_overview|RL Fundamentals Overview]] *(从 RL_Fundamentals 合并)*

## 核心概念

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| MDP | 马尔可夫决策过程 | RL 问题建模 |
| 奖励函数 | 环境反馈信号 | 目标定义 |
| 策略 | 状态到动作的映射 | 决策制定 |
| 价值函数 | 长期回报估计 | 状态评估 |
| 探索与利用 | Explore vs Exploit | 平衡策略 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | RL Foundations for dummy | 零基础理解 |
| 进阶 | RL Foundations | 完整理论 |
| 精要 | RL in a Nutshell | 快速回顾 |
| 总览 | RL Fundamentals Overview | 知识体系 |

## 常见问题

| 问题 | 解答 |
|------|------|
| RL 与监督学习的区别？ | RL 通过交互学习，无需标注 |
| 什么是 MDP？ | 状态+动作+奖励+转移概率 |
| 探索与利用如何平衡？ | ε-greedy、UCB、Thompson |
| 入门需要什么基础？ | 概率论 + 线性代数 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域文件数 | 4 |
| 核心概念 | 5+ |
| 适用人群 | RL 初学者 |
| 前置知识 | 概率论、线代 |

> 💡 RL 基础是理解所有强化学习算法的根基，建议先掌握 MDP、价值函数和策略梯度三大核心。

## 附录：RL 基础知识图谱

| 知识节点 | 前置依赖 | 后续延伸 |
|----------|----------|----------|
| MDP | 概率论 | 所有 RL 算法 |
| 价值函数 | MDP | Q-Learning |
| 策略梯度 | 微积分 | REINFORCE |
| Actor-Critic | 价值+策略 | PPO, SAC |
| 探索利用 | 多臂老虎机 | 平衡策略 |

## 附录：RL 基础术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 状态 | State | 环境当前情况 |
| 动作 | Action | 可执行的操作 |
| 奖励 | Reward | 环境反馈信号 |
| 策略 | Policy | 状态到动作映射 |
| 折扣因子 | Discount Factor | 未来奖励衰减 |

## RL基础算法对比

| 算法 | 类型 | 核心思想 | 适用场景 |
|------|------|----------|----------|
| 动态规划 | 值函数 | 贝尔曼方程迭代 | 已知模型 |
| Monte Carlo | 值函数 | 完整轨迹平均 | 无模型、 episodic |
| TD Learning | 值函数 | 单步自举更新 | 无模型、继续 |
| Q-Learning | 值函数 | 离策略最大值 | 离散动作 |
| SARSA | 值函数 | 在策略更新 | 安全探索 |
| REINFORCE | 策略梯度 | 完整轨迹梯度 | 连续动作 |

## 探索与利用平衡

| 策略 | 原理 | 优势 | 劣势 |
|------|------|------|------|
| ε-greedy | 随机概率探索 | 简单 | 无差别探索 |
| UCB | 不确定性上界 | 理论保证 | 计算开销 |
| Thompson Sampling | 后验采样 | 贝叶斯最优 | 实现复杂 |
|  Boltzmann | 软最大值 | 平滑 | 温度调参 |
| 内在动机 | 好奇心驱动 | 稀疏奖励 | 设计困难 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | RL_Fundamentals_overview.md | 理解MDP、奖励、策略 |
| 进阶 | Sutton教材前6章 | 掌握TD/MC/DP |
| 实践 | Gymnasium + Q-Learning | 动手实现 |
| 深入 | Deep_RL/index.md | 深度强化学习 |

## 常见问题

| 问题 | 解答 |
|------|------|
| MDP的马尔可夫性是什么？ | 下一状态只依赖当前状态和动作，与历史无关 |
| Q-Learning和SARSA的区别？ | Q-Learning用max Q（离策略），SARSA用实际Q（在策略） |
| 为什么需要折扣因子？ | 避免无限累积、数学收敛、反映时间偏好 |
| 表格方法有什么局限？ | 状态空间爆炸，无法处理高维/连续状态 |

## 统计

| 指标 | 数值 |
|------|------|
| 核心算法 | 6种 |
| 探索策略 | 5种 |
| 前置知识 | 概率论+微积分 |
| 推荐教材 | Sutton & Barto 2nd Ed |

> 💡 RL基础是整个强化学习大厦的地基。掌握MDP建模、值函数、策略梯度的直觉，后续所有算法都是这些概念的延伸。

## 附录：知识图谱

| 知识节点 | 前置依赖 | 后续延伸 |
|----------|----------|----------|
| MDP建模 | 概率论 | 所有RL算法 |
| 贝尔曼方程 | MDP | 值函数方法 |
| 动态规划 | 贝尔曼方程 | 策略/值迭代 |
| Monte Carlo | 采样 | 无模型学习 |
| TD Learning | MC+DP | Q-Learning/SARSA |
| 策略梯度 | 微积分 | REINFORCE/PPO |

## 附录：快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 零基础入门 | RL_Fundamentals_overview.md | ⭐ |
| 理解数学原理 | Sutton教材 | ⭐⭐ |
| 动手实现Q-Learning | Gymnasium教程 | ⭐⭐ |
| 进入深度RL | Deep_RL/index.md | ⭐⭐ |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解MDP五元组 | (S,A,P,R,γ) | ☐ |
| 能写贝尔曼方程 | V(s)和Q(s,a) | ☐ |
| 理解探索-利用 | ε-greedy等 | ☐ |
| 实现Q-Learning | 表格环境 | ☐ |
| 理解策略梯度 | REINFORCE | ☐ |
| 完成练习 | Sutton教材习题 | ☐ |
| 动手项目 | CartPole/MountainCar | ☐ |

## 附录：RL基础 vs 深度RL

| 维度 | RL基础 | 深度RL |
|------|--------|--------|
| 状态表示 | 表格/离散 | 连续/高维 |
| 函数通近 | 查表 | 神经网络 |
| 样本效率 | 低 | 中-高 |
| 泛化能力 | 无 | 有 |
| 典型环境 | GridWorld | Atari/MuJoCo |
| 前置知识 | 概率论 | +深度学习 |

## 附录：推荐资源

| 资源 | 类型 | 说明 |
|------|------|------|
| Sutton & Barto | 教材 | RL圣经，免费PDF |
| 3Blue1Brown | 视频 | 直觉理解 |
| Gymnasium | 工具 | 标准RL环境 |
| Spinning Up | 教程 | OpenAI入门指南 |
| CS285 | 课程 | UC Berkeley深度RL |

---
*Last updated: 2026-07-21*
