---
title: 01 基础理论 (Fundamentals)
category: 01-fundamentals
tags: ["fundamentals", "math", "algorithms", "basics"]
summary: "本章节涵盖人工智能与机器学习最底层的科学支柱，包括数学基础（线性代数、概率统计）和计算机科学基础（数据结构算法、分布式系统）。这些知识是理解现代 AI 技术栈的必要前提。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

---
# 01 基础理论 (Fundamentals)

本章节涵盖人工智能与机器学习最底层的科学支柱，包括数学基础（线性代数、概率统计）和计算机科学基础（数据结构算法、分布式系统）。这些知识是理解现代 AI 技术栈的必要前提。

## 学习路径 (Learning Path)

```
    ┌──────────────────┐
    │  线性代数        │
    │  Linear Algebra  │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │  概率论与统计     │
    │  Probability &   │
    │  Statistics      │
    └────────┬─────────┘
             │
             ├─────────────────────┐
             ▼                     ▼
    ┌────────────────┐    ┌───────────────┐
    │  数据结构       │    │  分布式系统   │
    │  与算法         │    │  Distributed  │
    │  DS & Algo      │    │  Systems      │
    └────────────────┘    └───────────────┘
```

## 内容索引 (Content Index)

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 线性代数 (Linear Algebra) | 入门 | 张量运算、特征值分解、SVD，构建所有模型参数表示的数学基础 | [Linear_Algebra.md](./Linear_Algebra/Linear_Algebra.md) |
| 概率论与统计 (Probability & Statistics) | 入门 | 贝叶斯定理、高斯分布、信息论，处理 AI 中的不确定性 | [Probability_Statistics.md](./Probability_Statistics/Probability_Statistics.md) |
| 数据结构与算法 (Data Structures & Algorithms) | 进阶 | 计算图、拓扑排序、向量索引，支撑自动微分与高效检索 | [Data_Structures_Algorithms.md](./Data_Structures_Algorithms/Data_Structures_Algorithms.md) |
| 分布式系统 (Distributed Systems) | 进阶 | All-Reduce、并行策略、ZeRO 优化，实现大规模模型训练 | [Distributed_Systems.md](./Distributed_Systems/Distributed_Systems.md) |
| AI 硬件与芯片 (AI Hardware) | 进阶 | H100/H200/B200 对比，GPU 选型，边缘 AI 芯片，2026 年硬件格局 | [AI_Hardware_2026.md](./AI_Hardware/AI_Hardware_2026.md) |
| Java 生态与 AI (Java Ecosystem AI) | 进阶 | Spring AI、LangChain4j、DJL、GraalVM，Java AI 应用全栈概览 | [Java_Ecosystem_AI_Overview.md](./Java_Ecosystem_AI/Java_Ecosystem_AI_Overview.md) |
| **Python for AI (Python 基础)** | **入门** | **Python 语法速成，面向 AI 场景，零基础友好** | **[Python_for_AI_Basics.md](./Python_for_AI_Basics.md)** |
| **Python 数据科学工具链** | **入门** | **NumPy / Pandas / Matplotlib / Scikit-learn 核心操作** | **[Python_Data_Science_Toolkit.md](./Python_Data_Science_Toolkit.md)** |
| **AI 开发环境配置** | **入门** | **Jupyter / Conda / VS Code / Colab / GPU 环境搭建** | **[AI_Development_Environment_Setup.md](./AI_Development_Environment_Setup.md)** |

## 前置知识 (Prerequisites)

- **AI 历史了解**: 推荐先阅读 [AI历史时间线](../00_AI_Introduction/AI_History_Timeline.md) 了解 1950-2026 AI 发展脉络
- **数学**: 高中微积分、基础矩阵运算
- **编程**: Python 基础、NumPy 库基本操作
- **无 AI 前序要求**: 本章是整个知识体系的起点

## 关键术语速查 (Key Terms)

- **张量 (Tensor)**: 多维数组，是神经网络参数和数据的基本表示形式
- **特征值分解 (EVD)**: 将矩阵分解为特征向量和特征值，用于理解数据主方向
- **奇异值分解 (SVD)**: 矩阵分解技术，广泛用于降维和推荐系统
- **贝叶斯定理 (Bayes' Theorem)**: 描述条件概率关系，是概率推理的核心
- **信息熵 (Entropy)**: 衡量不确定性的度量，用于损失函数设计
- **KL 散度 (KL Divergence)**: 衡量两个分布差异的指标，常用于对比学习
- **计算图 (Computation Graph)**: 用有向无环图表示计算过程，支持自动微分
- **All-Reduce**: 分布式训练中同步梯度的通信原语
- **Data Parallelism**: 数据并行策略，将数据分批分配到多个设备
- **ZeRO 优化**: 零冗余优化技术，减少大模型训练的显存占用

---
*Last updated: 2026-02-10*

## Related
- [[01_Fundamentals/README_for_dummy|基础理论 - 新手导航]]

- [[01_Fundamentals/AI_Hardware/README]] — AI硬件与芯片 (AI Hardware) (共享: algorithms, basics, fundamentals, math)
- [[01_Fundamentals/Fundamentals-in-nutshell]] — AI 基础速成指南 (共享: algorithms, basics, fundamentals, math)
- [[01_Fundamentals/Java_Ecosystem_AI/Java_Ecosystem_AI_Overview]] — Java 生态与 AI：全景概览 (共享: algorithms, basics, fundamentals, math)
- [[01_Fundamentals/Java_Ecosystem_AI/Spring_AI_Deep_Dive]] — Spring AI 深度解析 (共享: algorithms, basics, fundamentals, math)
- [[01_Fundamentals/Java_Ecosystem_AI/Java_Ecosystem_AI_for_dummy]] — Java_Ecosystem_AI_for_dummy
- [[01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms_for_dummy]] — Data_Structures_Algorithms_for_dummy
- [[01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms]] — Data_Structures_Algorithms
- [[01_Fundamentals/Distributed_Systems/Distributed_Systems_for_dummy]] — Distributed_Systems_for_dummy
- [[01_Fundamentals/Distributed_Systems/Distributed_Systems]] — Distributed_Systems
- [[01_Fundamentals/Probability_Statistics/Probability_Statistics_for_dummy]] — Probability_Statistics_for_dummy
- [[01_Fundamentals/Probability_Statistics/Probability_Statistics]] — Probability_Statistics
- [[01_Fundamentals/AI_Hardware/AI_Hardware_2026]] — AI_Hardware_2026
- [[01_Fundamentals/Linear_Algebra/Linear_Algebra_for_dummy]] — Linear_Algebra_for_dummy
- [[01_Fundamentals/Linear_Algebra/Linear_Algebra]] — Linear_Algebra
- [[01_Fundamentals/README_for_dummy.md|README_for_dummy]]
- [[_meta/AI_Basics_Gap_Analysis|AI 基础入门缺口分析]] — 入门内容覆盖度分析与补全追踪

## 相关页面
- [[01_Fundamentals/Information_Theory/README|信息论基础 (Information Theory)]]
- [[01_Fundamentals/Information_Theory/Information_Theory_Fundamentals|信息论基础: 从香农熵到 LLM 的交叉熵损失]]

- [[_concepts/data-structures-algorithms|Data Structures Algorithms]]

