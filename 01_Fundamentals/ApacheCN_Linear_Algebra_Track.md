---
title: "ApacheCN 线性代数主线"
category: "01-fundamentals-linear-algebra"
tags: ["apachecn", "ailearning", "linear-algebra", "mit-18.06", "math", "svd", "eigenvalue"]
summary: "ApacheCN 线性代数主线概览：docs/linalg/ 下 MIT 18.06 中文笔记 35 讲，覆盖向量空间、特征值、SVD、伪逆与线性变换。"
created: "2026-06-12"
updated: "2026-06-12"
sources:
  - "https://github.com/apachecn/ailearning/tree/master/docs/linalg"
  - "_raw/github-sources/ailearning/docs/linalg"
provenance: |
  基于 ApacheCN AiLearning 仓库 docs/linalg/ 目录的 README.md、chapter01.md
  以及 SUMMARY.md 的章节目录整理而成。
base_confidence: "high"
lifecycle: "draft"
tier: "supporting"
---

# ApacheCN 线性代数主线

> `docs/linalg/` 收录了 **MIT 18.06 线性代数** 课程的中文笔记，共 **35 讲**，从方程组的几何解释出发，逐步深入到 SVD、伪逆与线性变换，是理解 AI 矩阵运算的核心数学基础。

## 内容结构

| 阶段 | 讲次 | 核心主题 |
|------|------|----------|
| 基础 | 1–10 | 方程组几何解释、矩阵消元、LU 分解、向量空间、四个基本子空间 |
| 正交与投影 | 11–17 | 正交向量、子空间投影、最小二乘、Gram-Schmidt 正交化 |
| 行列式与特征值 | 18–24 | 行列式、特征值/特征向量、对角化、微分方程、马尔可夫矩阵、傅里叶级数 |
| 正定与 SVD | 25–35 | 对称矩阵、正定矩阵、相似矩阵、SVD、线性变换、基变换、伪逆 |

## 代表章节示例

- **第 1 讲：方程组的几何解释**：通过“行图像”与“列图像”理解 $Ax=b$，强调将矩阵乘法视为列向量的线性组合。
- **第 21 讲：特征值与特征向量**：掌握矩阵变换的主轴方向与伸缩因子。
- **第 30 讲：奇异值分解（SVD）**：任意矩阵的低秩近似与四大子空间分解。

## 与本库关联

- 本库线性代数核心页 → [[01_Fundamentals/Linear_Algebra/Linear_Algebra]]
- 概率统计基础 → [[01_Fundamentals/Probability_Statistics/Probability_Statistics]]
- 神经网络中的矩阵运算 → [[03_Deep_Learning/Neural_Network_Core/Neural_Network_Core]]
- 优化理论（Hessian、正定） → [[03_Deep_Learning/Optimization/Optimization]]
- PCA/SVD 在机器学习中的应用 → [[02_Machine_Learning/Unsupervised_Learning/Unsupervised_Learning]]

## 参考

- 仓库主线入口：`_raw/github-sources/ailearning/docs/linalg/`
- 在线阅读：https://linalg.apachecn.org
- 上级指南：[[90_Learn/Courses/ApacheCN_AILearning_Guide]]
- 引用索引：[[references/apachecn-ailearning]]
