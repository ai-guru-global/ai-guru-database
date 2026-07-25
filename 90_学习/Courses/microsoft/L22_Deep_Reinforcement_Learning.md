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
  - 学习完本课后，可继续本库 [[06_强化学习/02_Deep_RL/Deep_RL]] 与 [[06_强化学习/01_RL_Foundations/RL_Foundations]] 进行更深入的理论与算法扩展。
  - 观看官方推荐视频：[How a computer learns to play Super Mario](https://www.youtube.com/watch?v=qv6UVOQ0F44)，感受 RL 在复杂游戏中的表现。

## 相关阅读

- 课程索引：[[90_学习/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[06_强化学习/02_Deep_RL/Deep_RL]]
  - [[06_强化学习/01_RL_Foundations/RL_Foundations]]

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化

## 进阶内容补充

| 主题 | 深度解析 | 实践要点 | 参考资源 |
|------|----------|----------|----------|
| 原理深入 | 底层机制剖析 | 源码阅读+实验验证 | 官方文档+论文 |
| 工程实现 | 生产级代码实践 | 设计模式+测试覆盖 | 开源项目 |
| 性能调优 | 瓶颈定位+优化 | Profiling+基准测试 | 性能工具 |
| 安全加固 | 威胁建模+防护 | 安全审计+渗透测试 | 安全框架 |
| 架构演进 | 系统设计与重构 | 渐进式改造+验证 | 架构书籍 |

## 实践操作指南

| 步骤 | 操作 | 验证方法 | 常见问题 |
|------|------|----------|----------|
| 环境搭建 | 安装依赖+配置 | 运行hello world | 版本冲突 |
| 基础使用 | 核心API调用 | 单元测试通过 | 参数错误 |
| 功能开发 | 业务逻辑实现 | 集成测试通过 | 边界条件 |
| 性能优化 | 热点优化+缓存 | 压测达标 | 内存泄漏 |
| 部署上线 | 容器化+CI/CD | 灰度验证通过 | 配置差异 |

## 技术选型决策

| 考量因素 | 权重 | 评估方法 | 决策标准 |
|----------|------|----------|----------|
| 功能匹配 | 30% | 需求清单对比 | 覆盖核心需求 |
| 性能表现 | 25% | 基准测试 | 满足SLA |
| 社区生态 | 20% | Star/Issue/更新频率 | 活跃维护 |
| 学习成本 | 15% | 文档质量+上手时间 | 团队可接受 |
| 长期维护 | 10% | 路线图+兼容性 | 可持续发展 |

## 故障排查流程

| 阶段 | 动作 | 工具 | 产出 |
|------|------|------|------|
| 复现 | 稳定复现问题 | 日志+断点 | 复现步骤 |
| 定位 | 缩小问题范围 | 二分法+排除法 | 问题模块 |
| 分析 | 找到根本原因 | 源码+文档 | 根因报告 |
| 修复 | 实施修复方案 | 代码修改+测试 | 修复PR |
| 验证 | 确认问题消除 | 回归测试 | 验证报告 |
| 预防 | 防止再次发生 | 监控+文档 | 改进措施 |

## 知识关联图谱

| 关联领域 | 关系 | 学习顺序 |
|----------|------|----------|
| 前置基础 | 必须先掌握 | 先学 |
| 并行技能 | 相互增强 | 同步 |
| 进阶方向 | 深入发展 | 后学 |
| 应用场景 | 价值体现 | 实践 |
| 工具支撑 | 效率提升 | 随时 |

## 持续改进清单

- [ ] 定期回顾和更新知识
- [ ] 实践验证理论认知
- [ ] 关注社区最新动态
- [ ] 参与技术讨论和分享
- [ ] 将经验沉淀为文档
- [ ] 持续优化工作流程
