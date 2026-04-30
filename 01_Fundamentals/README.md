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
| AI硬件与芯片 (AI Hardware) | 进阶 | H100/H200/B200对比，GPU选型，边缘AI芯片，2026年硬件格局 | [AI_Hardware_2026.md](./AI_Hardware/AI_Hardware_2026.md) |
| Java 生态与 AI (Java Ecosystem AI) | 进阶 | Spring AI、LangChain4j、DJL、GraalVM，Java AI 应用全栈概览 | [Java_Ecosystem_AI_Overview.md](./Java_Ecosystem_AI/Java_Ecosystem_AI_Overview.md) |

## 前置知识 (Prerequisites)

- **AI历史了解**: 推荐先阅读 [AI历史时间线](../00_AI_Introduction/AI_History_Timeline.md) 了解1950-2026 AI发展脉络
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
