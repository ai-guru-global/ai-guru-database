---
title: 具身智能与机器人 (Robotics & Embodied AI)
category: 06-reinforcement-learning-robotics-embodied-ai
tags: ["reinforcement-learning", "agent", "mdp"]
summary: "| 文档 | 内容 | 适用读者 |"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

---
# 具身智能与机器人 (Robotics & Embodied AI)

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Embodied_AI_2026.md](./Embodied_AI_2026.md) | 具身智能完整指南 | 全面学习 |
| [Robot_VLA_Training_Pipeline_2026.md](./Robot_VLA_Training_Pipeline_2026.md) | VLA 训练全流程：数据采集、动作 Token 化、Sim-to-Real | 专业开发者 |

## 快速链接

### 核心概念
- **具身智能三大支柱**: 感知层 → 认知层 → 行动层
- **VLA 模型**: 视觉-语言-动作端到端模型
- **Sim-to-Real**: 仿真到现实迁移技术
- **遥操作**: 人类示范数据采集

### 2026 年关键进展
- **人形机器人**: Figure 02、Tesla Optimus、Unitree G1/H1 进入实际部署
- **机器人基础模型**: RT-2、π0、GR00T、Gemini Robotics
- **市场规模**: 46.7 亿→676.3 亿美元 (2033 年预测)

### 主要玩家
| 公司 | 产品/技术 | 特点 |
|------|----------|------|
| Figure AI | Figure 02 | BMW 工厂试点 |
| Tesla | Optimus | 自有工厂测试 |
| NVIDIA | GR00T + Isaac | 仿真+基础模型平台 |
| Google DeepMind | RT-2 / Gemini Robotics | 视觉-语言-动作 |
| Physical Intelligence | π0 | 通用操作模型 |
| Unitree | G1/H1 | 开源硬件 |

---

## 一句话总结

> **具身智能 = AI的"身体化"** — 从数字世界走向物理世界，让AI能像人类一样感知环境、理解任务并执行行动。

## Related
- [[06_强化学习/05_Robotics_Embodied_AI/README|具身智能与机器人 (Robotics & Embodied AI)]]

- [[06_强化学习/AI_Agents/AI_Agents_for_dummy]] — AI智能体 - 小白版 🤖 (共享: agent, mdp, reinforcement-learning, rl)
- [[06_强化学习/AI_Agents/Agent-in-nutshell]] — AI 智能体速成指南 (共享: agent, mdp, reinforcement-learning, rl)
- [[06_强化学习/AI_Agents/Agent_Future_Roadmap_2026_2030]] — Agent 未来发展路线图 2026-2030 (共享: agent, mdp, reinforcement-learning, rl)
- [[06_强化学习/AI_Agents/Agent_Protocols_Detail]] — AI Agent 协议详解：MCP、A2A、UCP (共享: agent, mdp, reinforcement-learning, rl)

- [[06_强化学习/05_Robotics_Embodied_AI/Robot_VLA_Training_Pipeline_2026|Robot VLA Training Pipeline 2026]]

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | Embodied AI 2026 | 理解具身智能 |
| 进阶 | VLA Models 2026 | 掌握 VLA 架构 |
| 实践 | Robot VLA Training Pipeline | 训练流程 |
| 前沿 | Humanoid Robot 2026 | 人形机器人 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 具身智能与 AI 的区别？ | 具身强调身体与环境交互 |
| VLA 模型需要什么数据？ | 视觉+语言+动作三元组 |
| Sim-to-Real 的难点？ | 域差距、物理精度 |
| 入门需要什么基础？ | RL + 机器人学基础 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域文件数 | 7 |
| 核心主题 | VLA、人形机器人、Sim2Real |
| 2026 热点 | VLA 模型、具身智能 |
| 市场规模 | 46.7亿→676.3亿美元 (2033) |

> 💡 具身智能是 AI 从数字世界走向物理世界的关键，2026 年 VLA 模型成为核心突破方 向。

## 具身智能核心技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 感知层 | 视觉/触觉/力觉 | 多模态传感器融合 |
| 认知层 | VLA/世界模型 | 语言理解+任务规划 |
| 决策层 | RL/模仿学习 | 动作生成与优化 |
| 执行层 | 运动控制 | 关节控制、力控制 |
| 仿真层 | Isaac Sim/MuJoCo | 训练与验证环境 |

## 具身智能 vs 传统机器人

| 维度 | 传统机器人 | 具身智能 |
|------|----------|----------|
| 编程方式 | 显式编程 | 学习获得 |
| 泛化能力 | 单任务 | 多任务迁移 |
| 环境适应 | 结构化 | 开放环境 |
| 交互方式 | 预定义 | 自然语言 |
| 典型代表 | 工业机械臂 | Figure 02, Optimus |

## 常见问题

| 问题 | 解答 |
|------|------|
| VLA和传统控制的区别？ | VLA端到端从视觉+语言直接输出动作，无需手工设计控制器 |
| 具身智能需要RL吗？ | 不一定，模仿学习+RL微调是当前主流 |
| Sim-to-Real Gap大吗？ | 仍然显著，域随机化+少量真实数据微调可缓解 |
| 人形机器人何时普及？ | 2026年工厂试点，2030年家庭场景可期 |

## 具身智能学习路径

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | Embodied_AI_2026.md | 理解具身智能全景 |
| 进阶 | Robot_VLA_Training_Pipeline_2026.md | 掌握VLA训练流程 |
| 实践 | Sim_to_Real/index.md | 仿真到现实迁移 |
| 前沿 | VLA_Embodied_AI_2026.md | 最新模型与趋势 |

## 统计

| 指标 | 数值 |
|------|------|
| 文档数量 | 5 |
| 覆盖主题 | VLA/人形机器人/Sim-to-Real |
| 主要玩家 | 6+ 公司 |
| 市场规模(2033) | 676.3亿美元 |

> 💡 具身智能 = AI的“身体化”。从数字世界走向物理世界，让AI能像人类一样感知环境、理解任务并执行行动。

## 附录：具身智能知识图谱

| 知识节点 | 前置依赖 | 后续延伸 |
|----------|----------|----------|
| 机器人学基础 | 线性代数、力学 | 运动学、动力学 |
| 传感器融合 | 信号处理 | 视觉SLAM、触觉感知 |
| 模仿学习 | 监督学习 | 行为克隆、DAgger |
| VLA模型 | 多模态+RL | 通用操作 |
| Sim-to-Real | 仿真环境 | 域随机化、微调 |
| 运动控制 | 控制论 | MPC、全身控制 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 视觉-语言-动作 | VLA | 端到端多模态模型 |
| 遥操作 | Teleoperation | 人类远程控制采集数据 |
| 域随机化 | Domain Randomization | 仿真参数随机化 |
| 行为克隆 | Behavior Cloning | 监督学习模仿 |
| 力控制 | Force Control | 基于力的柔顺控制 |
| 全身控制 | Whole-Body Control | 人形机器人协调 |

## 附录：快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 了解具身智能全景 | Embodied_AI_2026.md | ⭐ |
| 学习VLA训练 | Robot_VLA_Training_Pipeline_2026.md | ⭐⭐⭐ |
| 了解人形机器人 | Humanoid_Robot_2026.md | ⭐⭐ |
| 最新VLA模型 | VLA_Embodied_AI_2026.md | ⭐⭐⭐ |
| Sim-to-Real迁移 | ../Sim_to_Real/index.md | ⭐⭐ |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解具身智能概念 | 感知-认知-行动 | ☐ |
| 了解VLA模型 | 视觉-语言-动作 | ☐ |
| 熟悉仿真平台 | Isaac Sim/MuJoCo | ☐ |
| 理解Sim-to-Real | 域随机化/微调 | ☐ |
| 了解人形机器人 | 2026年进展 | ☐ |
| 动手实践 | 完成一个仿真任务 | ☐ |

## 附录：2026年具身智能趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| VLA基础模型 | 通用操作模型涌现 | 降低任务适配成本 |
| 人形机器人量产 | Figure/Tesla/Unitree | 工厂场景先行 |
| 仿真器加速 | Genesis等超快仿真 | 训练效率提升100x |
| 数据飞轮 | 遥操作+仿真+视频 | 解决数据稀缺 |
| 多机协作 | 多机器人协同 | 复杂任务分解 |
| 触觉感知 | 电子皮肤/力传感器 | 精细操作 |
| 语言指令控制 | 自然语言→动作 | 降低使用门槛 |
| 安全约束 | 力/速度限制 | 人机协作安全 |
| 开源生态 | LeRobot/OpenVLA | 降低研究门槛 |
| 产业投资 | 百亿级融资 | 商业化加速 |
| 标准化评测 | 统一基准测试 | 公平对比 |
| 边缘部署 | 端侧推理优化 | 实时控制 |
| 安全认证 | 机器人安全标准 | 规模化部署 |
| 云端协同 | 云边端架构 | 算力分配 |
| 伦理规范 | 机器人行为准则 | 社会接受度 |
| 跨域迁移 | 不同场景泛化 | 通用智能体 |

---
*Last updated: 2026-07-21*
