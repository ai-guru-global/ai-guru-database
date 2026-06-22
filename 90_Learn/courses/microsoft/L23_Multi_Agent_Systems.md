---
title: "L23 - 多智能体系统"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "multi-agent", "agent-based-modeling", "netlogo", "emergent-behavior"]
summary: "从简单个体如何通过交互涌现出复杂集体行为的角度，理解多智能体系统（Multi-Agent Systems）的核心思想、代理分类，以及用 NetLogo 进行仿真实验的方法。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/6-Other/23-MultiagentSystems/README.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L23 - 多智能体系统

> **一句话理解**: 复杂智能或复杂行为不一定来自单个复杂大脑，也可以由许多简单个体（智能体，Agent）在环境中交互而**涌现**出来。

## 本课概览

多智能体系统（Multi-Agent Systems, MAS）是人工智能中一条独特的路径。与构建单一巨型模型不同，它关注如何让大量相对简单的**智能体（Agent）**在环境中感知、行动并相互影响，从而产生系统整体层面的复杂甚至“智能”行为。这种思路根植于**集体智能（Collective Intelligence）**、**涌现主义（Emergentism）**和**进化控制论（Evolutionary Cybernetics）**，其核心洞见是：当低层系统以合适方式组合时，会在高层获得额外的能力，即所谓**元系统跃迁（metasystem transition）**原则。

本课属于 Microsoft AI For Beginners 的“其他 AI 技术”模块，紧接在遗传算法与深度强化学习之后。它不提供深度学习训练代码，而是带你用一个可视化仿真工具 NetLogo，直观感受“个体规则 → 群体现象”的涌现过程。学完本课，你会理解 Agent 的基本分类、反应式与慎思式代理的区别，以及如何用基于 Agent 的建模（Agent-Based Modeling）去模拟交通、疫情、群体等真实复杂系统。

## 核心概念

- **智能体（Agent）**：生活在某个环境中的实体，能够感知环境并对环境施加动作。这个定义非常宽泛，可以是一只虚拟鸟、一辆模拟汽车、一个网络节点，也可以是一个自动助理程序。
- **涌现（Emergence）**：系统整体展现出任何单个组成部分都不具备的宏观模式。鸟群飞行、蚁群觅食、城市交通拥堵，都是典型的涌现现象。
- **反应式代理（Reactive Agent）**：基于“感知-动作”规则直接响应环境，没有复杂推理。NetLogo 中的海龟大多属于此类。
- **慎思式代理（Deliberative Agent）**：具备推理、规划和目标导向能力，能够主动发起行动，而不仅仅是对刺激做出反应。
- **基于 Agent 的建模（Agent-Based Modeling, ABM）**：通过为每个个体设定规则并运行仿真，来研究复杂系统整体行为的计算方法。NetLogo 是最经典的教育与科研 ABM 环境之一。
- **BDI 模型**：慎思式代理的一种经典架构，包含：
  - **信念（Beliefs）**：代理对环境的知识或事实；
  - **愿望（Desires）**：代理想要达成的目标；
  - **意图（Intentions）**：代理为达成目标而计划执行的具体行动。

## 关键知识点

- **Agent 的多维分类**：
  - 按推理能力：反应式（Reactive） vs. 慎思式（Deliberative）；
  - 按执行位置：静态代理（固定节点） vs. 移动代理（可在网络节点间迁移）；
  - 按行为动机：被动代理（无目标，仅响应外部刺激）、主动代理（有目标）、认知代理（复杂规划与推理）。
- **MAS 的典型应用场景**：
  - 电子游戏中的 NPC 行为控制；
  - 影视 3D 场景中的人群/群集动画；
  - 系统建模，例如 COVID-19 传播预测、城市交通流量模拟；
  - 复杂自动化系统，将每个设备视为独立 Agent，提高鲁棒性。
- **NetLogo 的三大对象**：
  - **海龟（Turtles）**：可在画布上移动的 Agent；
  - **斑块（Patches）**：构成环境的网格单元；
  - **观察者（Observer）**：唯一控制整个世界的特殊 Agent，负责按钮事件等全局逻辑。
- **并行执行语义**：在 NetLogo 中，`ask turtles [...]` 和 `ask patches [...]` 中的代码会由所有海龟/斑块并行执行，这是涌现行为产生的关键。
- **群体行为（Flocking）三规则**（Reynolds 规则）：
  1. **对齐（Alignment）**：朝向邻近 Agent 的平均航向转向；
  2. **聚合（Cohesion）**：向邻近 Agent 的平均位置靠拢；
  3. **分离（Separation）**：与过近的 Agent 保持距离。
  仅由这三条局部规则，就能涌现出类似真实鸟群的复杂飞行模式。
- **慎思式 Agent 的通信需求**：
  - 知识交换语言：如 KIF（Knowledge Interchange Format）、KQML（Knowledge Query and Manipulation Language）；
  - 协商协议：基于拍卖、合同网等机制；
  - 共同本体（Ontology）：确保不同 Agent 对同一概念语义一致；
  - 服务发现：让 Agent 知道其他 Agent 能做什么。

## 代码/实验说明

本课没有 PyTorch/TensorFlow Notebook，核心实验在 **NetLogo** 环境中完成。

### 安装与入口

- 官方下载：[NetLogo Download](https://ccl.northwestern.edu/netlogo/download.shtml)
- 打开后进入 **File → Models Library**，即可浏览大量内置模型。

### NetLogo 基础语法示例

```netlogo
; 创建 10 只海龟
 create-turtles 10

; 命令所有海龟向前移动 10 个单位
ask turtles [
  forward 10
]

; 定义不同品种的海龟
breed [cats cat]
```

### 典型交互流程

1. 打开模型（如 **Biology → Flocking**）。
2. 点击 **Setup** 按钮，初始化仿真状态（对应代码中的 `to setup`）。
3. 点击 **Go** 按钮，开始运行仿真（对应代码中的 `to go`）。
4. 在 **Code** 标签页中查看三条 flocking 规则的具体实现。

### 推荐的官方模型探索

| 模型路径 | 说明 |
|---------|------|
| **Biology → Flocking** | 群体行为涌现的经典演示，可调整视野范围（vision range）与分离度。 |
| **Art → Fireworks** | 将烟花视为多个粒子流的集体行为。 |
| **Social Science → Traffic Basic / Traffic Grid** | 一维/二维城市交通仿真，车辆遵循“前方空旷则加速、看到障碍则刹车”规则。 |
| **Social Science → Party** | 模拟鸡尾酒会上人们如何聚集，可寻找让群体“快乐值”最快增长的参数组合。 |

### 官方作业

- **NetLogo Assignment**（[assignment.md](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/6-Other/23-MultiagentSystems/assignment.md)）：从模型库中挑选一个模型，尽可能贴近真实场景进行调参或扩展。建议任务是用 **Virus** 模型模拟 COVID-19 传播，并录制视频说明模型与现实情境的对应关系。

## 本课不覆盖与延伸

- **不覆盖**：本课只进行概念与 NetLogo 仿真演示，不深入 MAS 的形式化理论、分布式协商算法、博弈论、以及多智能体强化学习（MARL）的训练方法。
- **不覆盖**：没有涉及当前热门的 LLM-based Multi-Agent 框架（如 AutoGen、CrewAI、LangGraph 等）的工程实践。
- **延伸**：若对现代 Agent 工程感兴趣，可阅读本库 [[06_Reinforcement_Learning/AI_Agents/AI_Agents]] 与 [[15_Agent_Production/README]]；若对 Agent 仿真与复杂系统建模感兴趣，可进一步学习基于 Agent 的建模方法论、Swarm Intelligence 以及 NetLogo 的 BehaviorSpace 实验工具。

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[06_Reinforcement_Learning/AI_Agents/AI_Agents]]
  - [[15_Agent_Production/README]]
- 外部资源：
  - [NetLogo 官方站点](https://ccl.northwestern.edu/netlogo/)
  - [Beginner's Interactive NetLogo Dictionary](https://ccl.northwestern.edu/netlogo/bind/)
  - 课前测验：[Pre-lecture quiz](https://ff-quizzes.netlify.app/en/ai/quiz/45)
  - 课后测验：[Post-lecture quiz](https://ff-quizzes.netlify.app/en/ai/quiz/46)
