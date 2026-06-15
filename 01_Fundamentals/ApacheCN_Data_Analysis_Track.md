---
title: "ApacheCN 数据分析主线"
category: "01-fundamentals"
tags: ["apachecn", "ailearning", "data-analysis", "python", "numpy", "scipy", "matplotlib", "pandas", "theano"]
summary: "ApacheCN 数据分析主线概览：docs/da/ 下约 155 页，覆盖 Python 工具、NumPy、SciPy、Matplotlib、Pandas 与 Theano 基础。"
created: "2026-06-12"
updated: "2026-06-12"
sources:
  - "https://github.com/apachecn/ailearning/tree/master/docs/da"
  - "_raw/github-sources/ailearning/docs/da"
provenance: |
  基于 ApacheCN AiLearning 仓库 docs/da/ 目录的 README.md、SUMMARY.md 以及
  001.md（Python 工具）的抽样阅读，保留原始章节目录与主题归纳。
base_confidence: "high"
lifecycle: "draft"
tier: "supporting"
---

# ApacheCN 数据分析主线

> `docs/da/` 目录下的《Python 数据分析中文笔记》，约 **155 页**、**12 个模块**，系统覆盖 Python 数据分析工具链，是后续机器学习与深度学习的编程基础。

## 内容结构

| 模块 | 主题 | 代表文件 |
|------|------|----------|
| 01 Python 工具 | Anaconda、IPython、Jupyter Notebook | `001.md` |
| 02 Python 基础 | 数据类型、控制流、函数、模块、文件读写 | `006.md` |
| 03 NumPy | 数组、矩阵、广播、ufunc、结构化数组 | `028.md` |
| 04 SciPy | 插值、概率统计、优化、积分、稀疏矩阵 | `052.md` |
| 05 Python 进阶 | 迭代器、生成器、装饰器、上下文管理器 | `063.md` |
| 06 Matplotlib | Pyplot、绘图实例、文本与注释 | `080.md` |
| 07 使用其他语言扩展 | Cython、ctypes | `091.md` |
| 08 面向对象编程 | class、继承、接口、多重继承 | `100.md` |
| 09 Theano 基础 | 符号图、线性/Logistic 回归、CNN | `114.md` |
| 10 有趣的第三方模块 | basemap、cartopy、NBA/金庸数据分析 | `134.md` |
| 11 有用的工具 | pickle、json、logging、requests 等 | `139.md` |
| 12 Pandas | Series、DataFrame | `150.md` |

> **注意**：Theano 已停止维护，可作为理解符号计算图与自动微分的历史参考；现代等价工具见 [[03_Deep_Learning/DL_Frameworks/pytorch_overview]] 与 [[03_Deep_Learning/DL_Frameworks/tensorflow_overview]]。

## 与本库关联

- Python 环境配置 → [[01_Fundamentals/AI_Development_Environment_Setup]]
- 线性代数/NumPy 基础 → [[01_Fundamentals/Linear_Algebra/Linear_Algebra]]
- 概率统计 → [[01_Fundamentals/Probability_Statistics/Probability_Statistics]]
- 数据结构与算法 → [[01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms]]
- 机器学习数据预处理 → [[02_Machine_Learning/Feature_Engineering/Feature_Engineering]]

## 参考

- 仓库主线入口：`_raw/github-sources/ailearning/docs/da/`
- 上级指南：[[90_Learn/ApacheCN_AILearning_Guide]]
- 引用索引：[[references/apachecn-ailearning]]
