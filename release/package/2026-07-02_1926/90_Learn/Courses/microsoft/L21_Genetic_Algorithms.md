---
title: "L21 - 遗传算法"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "genetic-algorithms", "evolutionary-computation", "optimization", "search"]
summary: "通过模拟种群进化中的选择、交叉与变异，在复杂搜索空间中寻找近似最优解。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/6-Other/21-GeneticAlgorithms/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L21 Genetic Algorithms"
  - L21_Genetic_Algorithms
sources: []

---
# L21 - 遗传算法

> **一句话理解**：把问题的潜在解看作“基因”，让一群解在适应度（fitness）压力下不断选择、交叉、变异，最终收敛到优质解。

---

## 本课概览

遗传算法（Genetic Algorithms, GA）是一类受生物进化启发的优化/搜索方法，由美国学者 **John Henry Holland** 于 1975 年系统提出。与梯度下降（Gradient Descent）这类基于导数的方法不同，GA 不依赖目标函数可微，也不要求问题具有连续的结构，因此特别适合组合优化、离散搜索或解空间极其庞大的问题。

本课属于 Microsoft AI For Beginners 课程中“其他 AI 技术”模块，位于强化学习之前，主要帮助你理解：

- 如何用“基因”编码问题解；
- 如何设计适应度函数来评价解的好坏；
- 如何通过选择（Selection）、交叉（Crossover）、变异（Mutation）三种算子驱动种群进化；
- GA 的典型应用场景与实现套路。

---

## 核心概念

- **基因 / 染色体（Gene / Chromosome）**  
  问题的每个潜在解都被编码成一条基因，常见形式包括二进制串、整数数组或实数向量。例如 8 皇后问题中，一条基因可以是 `[3, 1, 4, ...]`，表示每行皇后的列位置。

- **种群（Population）**  
  多个基因组成的集合 `G`，是算法迭代演化的对象。初始种群通常随机生成。

- **适应度函数（Fitness Function）**  
  映射 `fit: Γ → ℝ`，用于衡量基因的优劣。在本课约定中，**值越小表示解越好**。设计一个好的 fitness 函数往往是 GA 成功的关键。

- **选择（Selection）**  
  根据适应度挑选较优个体，让它们有更多机会参与下一代的繁殖。常见方式包括轮盘赌、锦标赛选择等。

- **交叉 / 重组（Crossover）**  
  从种群中随机挑选两条基因 `g₁, g₂`，通过某种方式拼接产生新解 `g = crossover(g₁, g₂)`。例如单点交叉、均匀交叉或针对问题定制的部分映射交叉（PMX）。

- **变异（Mutation）**  
  对单条基因的某些位点做随机扰动，例如把二进制串某位取反，或把整数数组某个值替换。变异的作用是维持种群多样性、帮助算法跳出局部最优（local minimum）。

- **进化循环**  
  在每一代中，以一定概率选择“交叉”或“变异”操作，产生新解后如果它比父代更好，就替换回种群，如此反复直到适应度足够小或达到最大迭代次数。

---

## 关键知识点

- **Holland 的基本框架**：先定义基因表示 `g ∈ Γ`、适应度 `fit`、交叉算子 `crossover: Γ² → Γ`、变异算子 `mutate: Γ → Γ`，然后反复演化。
- **算法主循环**（简化版）：
  1. 随机生成初始种群 `G ⊆ Γ`。
  2. 随机决定本步执行交叉还是变异。
  3. 若交叉：随机选 `g₁, g₂ ∈ G`，计算 `g = crossover(g₁, g₂)`；若 `fit(g)` 优于任一父代，则替换之。
  4. 若变异：随机选 `g ∈ G`，用 `mutate(g)` 替换。
  5. 重复 2–4，直到满足停止条件。
- **跳出局部最优**：交叉负责“组合已有好的片段”，变异负责“探索未知区域”，两者配合平衡“ exploitation（利用）”与“exploration（探索）”。
- **典型任务**：排班优化、装箱/背包问题、最优切割、加速穷举搜索，以及训练神经网络权重（演化神经网络 / Neuroevolution）。

---

## 代码/实验说明

本节课没有 PyTorch / TensorFlow 框架拆分，官方提供了两个可直接运行的 Python Jupyter Notebook：

### 1. 课堂练习：`Genetic.ipynb`

[官方 Notebook（GitHub）](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/6-Other/21-GeneticAlgorithms/Genetic.ipynb)

包含两个经典示例：

- **公平分宝（Fair division of treasure）**：把物品价值尽量公平地分成两组。
- **8 皇后问题（8 Queens Problem）**：在 8×8 棋盘上放置 8 个皇后，使其互不攻击。

Notebook 的核心流程大致如下（伪代码）：

```python
# 1. 初始化随机种群
population = [random_gene() for _ in range(pop_size)]

for generation in range(max_generations):
    # 2. 以一定概率执行交叉或变异
    if random() < crossover_prob:
        g1, g2 = random_select(population)
        child = crossover(g1, g2)
        if fitness(child) < fitness(g1):
            replace g1 by child  # 或替换更差的父代
    else:
        g = random_select_one(population)
        mutant = mutate(g)
        replace g by mutant if better

    # 3. 当 fitness 达到阈值时停止
    if best_fitness(population) < threshold:
        break
```

### 2. 课后作业：`Diophantine.ipynb`

[官方作业（GitHub）](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/6-Other/21-GeneticAlgorithms/Diophantine.ipynb)

要求解一个**丢番图方程**（整数根方程）。例如：

```
a + 2b + 3c + 4d = 30
```

提示：把 `[a, b, c, d]` 作为一条基因，并让 `fitness = |a + 2b + 3c + 4d - 30|`。个体取值范围可限定在 `[0, 30]`。

---

## 本课不覆盖与延伸

- **不覆盖**：
  - 遗传算法的严格收敛性证明。
  - 现代进阶变体，如遗传编程（Genetic Programming）、进化策略（Evolution Strategies, ES）、NEAT（NeuroEvolution of Augmenting Topologies）。
  - 与深度强化学习的系统对比（这是下一课 L22 的内容）。
- **延伸**：
  - 学完本课后可继续学习 [[强化学习/RL-in-nutshell]] 中的“基于演化策略的策略搜索”思想。
  - 在超参数优化与神经网络结构搜索（NAS）中，演化算法仍是一种重要的基线方法。
  - 推荐观看官方给出的 Super Mario 遗传算法+神经网络视频，直观感受“进化”如何训练游戏 AI。

---

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[强化学习/RL-in-nutshell]]
  - [[机器学习/ML-in-nutshell]]
