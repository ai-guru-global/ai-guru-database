---
title: 01 基础理论 (Fundamentals)
category: 01-fundamentals
tags: ["fundamentals", "math", "algorithms", "basics"]
summary: "数学核心(线性代数/概率统计/微积分/信息论)与工程基础(分布式系统/AI硬件/Python工具链)两层架构，为AI技术栈奠定理论与工具基础。"
created: 2026-05-31
updated: 2026-07-11
tier: supporting
sources: []

name_zh: "01 基础理论"
---
# 01 基础理论 (Fundamentals)

> 中文简称：01 基础理论

本章节涵盖人工智能与机器学习的科学支柱，分为**数学核心**（线性代数、概率统计、微积分、信息论）和**工程基础**（数据结构算法、分布式系统、AI 硬件、Python/Java 工具链）两层。数学核心为理解算法原理提供理论武器，工程基础为实际构建 AI 系统提供工具和方法论。

> **Scope 说明**: 本目录同时包含数学核心和工程基础内容。以下标注 §数学 的子目录属于纯数学领域，标注 §工程 的子目录属于计算机工程领域，与 [[12_架构基建/|架构基建]] 有交叉引用关系。

---

## 内容索引 (Content Index)

### A. 数学核心 (§数学)

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| **线性代数 (Linear Algebra)** | 入门 | 张量运算、特征值分解、SVD，构建所有模型参数表示的数学基础 | [[02_线性代数/Linear_Algebra]] |
| **概率论与统计 (Probability & Statistics)** | 入门 | 贝叶斯定理、高斯分布、信息论，处理 AI 中的不确定性 | [[03_概率统计/Probability_Statistics]] |
| **微积分与优化 (Calculus & Optimization)** | 入门→进阶 | 导数/偏导/链式法则/梯度下降/凸优化/KKT 条件，深度学习的数学基石 | [[Calculus_Optimization/Calculus_Optimization]] |
| **信息论 (Information Theory)** | 进阶 | 香农熵、交叉熵、KL 散度，连接信息论与损失函数设计 | [[04_信息论/Information_Theory_Fundamentals]] |

### B. 工程基础 (§工程)

> 以下子目录涉及计算机系统与工程实践，与 [[12_架构基建/|架构基建]] 目录有深度交叉。标注了推荐的主要归属目录。

| 主题 | 难度 | 描述 | 文档链接 | 关联目录 |
|------|------|------|---------|---------|
| **数据结构与算法 (DS & Algorithms)** | 进阶 | 计算图、拓扑排序、向量索引，支撑自动微分与高效检索 | [[01_数学基础/07_数据结构与算法/01_Data_Structures_Algorithms]] | — |
| **分布式系统 (Distributed Systems)** | 进阶 | All-Reduce、并行策略、ZeRO 优化，实现大规模模型训练 | [[09_分布式系统/Distributed_Systems]] | → [[12_架构基建/02_架构概览/|架构基建]] |
| **AI 硬件与芯片 (AI Hardware)** | 进阶 | H100/H200/B200 对比，GPU 选型，边缘 AI 芯片，2026 年硬件格局 | [[01_数学基础/10_AI硬件/01_AI硬件_2026]] | → [[12_架构基建/07_硬件与算力/|硬件计算]] |
| **GPU 编程 (GPU Programming)** | 进阶 | CUDA 基础、Kernel 编写、内存层次 | [[01_数学基础/10_AI硬件/05_GPU_Programming_CUDA_基础|CUDA_Basics]] | → [[12_架构基建/07_硬件与算力/|硬件计算]] |
| **Java 生态与 AI (Java Ecosystem)** | 进阶 | Spring AI、LangChain4j、DJL、GraalVM，Java AI 应用全栈概览 | [[01_数学基础/11_Java生态与AI/02_Java生态与AI_概览]] | → [[16_编程/|编程]] |
| **Python 工具链 (Python Toolkit)** | 入门 | NumPy / Pandas / Matplotlib / Scikit-learn 核心操作 | [[01_数学基础/08_Python工具包/06_Python_for_AI_基础]] | → [[00_入门/|入门]] |
| **开发环境配置 (Dev Setup)** | 入门 | Jupyter / Conda / VS Code / Colab / GPU 环境搭建 | [[Development_Setup/AI_Development_Environment_Setup]] | → [[00_入门/|入门]] |

---

## 学习路径 (Learning Path)

```
 ┌─── 数学核心 (Math Core) ───────────────────────────┐
 │                                                     │
 │  线性代数 ──→ 概率统计 ──→ 微积分与优化 ──→ 信息论  │
 │                                                     │
 └─────────────────────────────────────────────────────┘
          │
          ▼
 ┌─── 工程基础 (Engineering) ──────────────────────────┐
 │                                                     │
 │  数据结构与算法 ──→ 分布式系统 ──→ AI 硬件          │
 │                                                     │
 │  Python 工具链 ──── 开发环境配置                    │
 │                                                     │
 └─────────────────────────────────────────────────────┘
```

## 前置知识 (Prerequisites)

- **AI 历史了解**: 推荐先阅读 [AI历史时间线](00_入门/01_基础入门/04_AI历史时间线.md) 了解 1950-2026 AI 发展脉络
- **数学**: 高中微积分、基础矩阵运算
- **编程**: Python 基础、NumPy 库基本操作
- **无 AI 前序要求**: 本章是整个知识体系的起点

## 关键术语速查 (Key Terms)

**数学核心**:
- **张量 (Tensor)**: 多维数组，是神经网络参数和数据的基本表示形式
- **特征值分解 (EVD)**: 将矩阵分解为特征向量和特征值，用于理解数据主方向
- **奇异值分解 (SVD)**: 矩阵分解技术，广泛用于降维和推荐系统
- **贝叶斯定理 (Bayes' Theorem)**: 描述条件概率关系，是概率推理的核心
- **信息熵 (Entropy)**: 衡量不确定性的度量，用于损失函数设计
- **KL 散度 (KL Divergence)**: 衡量两个分布差异的指标，常用于对比学习
- **梯度 (Gradient)**: 所有偏导数组成的向量，指向函数值上升最快的方向
- **链式法则 (Chain Rule)**: 复合函数求导法则，反向传播的理论基础

**工程基础**:
- **计算图 (Computation Graph)**: 用有向无环图表示计算过程，支持自动微分
- **All-Reduce**: 分布式训练中同步梯度的通信原语
- **Data Parallelism**: 数据并行策略，将数据分批分配到多个设备
- **ZeRO 优化**: 零冗余优化技术，减少大模型训练的显存占用

---
*Last updated: 2026-07-11*

## Related

- [[01_数学基础/README|基础理论 - 新手导航]]

### 数学核心
- [[01_数学基础/02_线性代数/03_线性代数]] — 线性代数
- [[01_数学基础/README.md]] — 线性代数入门
- [[01_数学基础/03_概率统计/02_概率统计]] — 概率论与统计
- [[01_数学基础/README.md]] — 概率统计入门
- [[01_数学基础/01_数学基础/Calculus_Optimization]] — 微积分与优化
- [[01_数学基础/04_信息论/Information_Theory_Fundamentals]] — 信息论基础
- [[01_数学基础/Fundamentals-in-nutshell]] — AI 基础速成指南

### 工程基础
- [[01_数学基础/10_AI硬件/01_AI硬件_2026]] — AI 硬件 2026 全景
- [[15_智能体/06_记忆基础设施/05_synthesis_memory_systems]] — 分布式系统
- [[01_数学基础/README.md]] — 分布式系统入门
- [[01_数学基础/10_AI硬件/05_GPU_Programming_CUDA_基础|CUDA_Basics]] — GPU/CUDA 编程
- [[01_数学基础/11_Java生态与AI/02_Java生态与AI_概览]] — Java AI 生态概览
- [[01_数学基础/11_Java生态与AI/03_Spring_AI_深入分析]] — Spring AI 深度解析
- [[01_数学基础/11_Java生态与AI/02_Java生态与AI_概览]] — Java AI 生态入门
- [[01_数学基础/07_数据结构与算法/01_Data_Structures_Algorithms]] — 数据结构与算法
- [[01_数学基础/07_数据结构与算法/01_Data_Structures_Algorithms]] — DS&A 入门

### 跨目录关联
- [[12_架构基建/07_硬件与算力/|架构基建 - 硬件计算]] — GPU 虚拟化与异构计算深度内容
- [[12_架构基建/02_架构概览/|架构基建 - 架构概览]] — 分布式训练系统架构
- [[16_编程/|编程]] — Java/Python AI 编程实践
- [[00_入门/|入门]] — Python 基础与开发环境
- [[治理/AI_Basics_Gap_Analysis|AI 基础入门缺口分析]] — 入门内容覆盖度分析
- [[概念/data-structures-algorithms|Data Structures Algorithms]] — 概念卡片
