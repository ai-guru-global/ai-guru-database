---
title: 数值方法 (Numerical Methods)
category: 01-math-foundations
tags: ["numerical-methods", "floating-point", "sparse-matrix", "stability"]
summary: "AI 系统中的数值计算基础：浮点精度、稀疏矩阵运算、数值稳定性分析，以及深度学习训练和推理中的数值问题诊断与解决。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 数值方法 (Numerical Methods)

AI 系统的底层是数值计算。本模块覆盖浮点运算、稀疏矩阵、数值稳定性等核心主题，帮助工程师理解和诊断训练/推理中的数值问题。

## 内容索引

| 主题 | 难度 | 文档链接 |
|------|------|---------|
| 数值方法总论 | 入门 | [Numerical_Methods.md](./Numerical_Methods.md) |
| 浮点精度与混合精度训练 | 进阶 | [Floating_Point_Precision.md](./Floating_Point_Precision.md) |
| 稀疏矩阵与高效运算 | 进阶 | [Sparse_Matrix_Computation.md](./Sparse_Matrix_Computation.md) |
| 数值稳定性与诊断 | 进阶 | [Numerical_Stability.md](./Numerical_Stability.md) |
| 小白版入门 | 入门 | [Numerical_Methods_for_dummy.md](./Numerical_Methods_for_dummy.md) |

## 前置知识

- **必修**: [线性代数](../Linear_Algebra/Linear_Algebra.md)（矩阵运算基础）
- **必修**: [微积分与优化](../Calculus_Optimization/Calculus_Optimization.md)（梯度计算）
- **推荐**: [GPU 编程](../GPU_Programming/)（硬件浮点实现）

## 与其他模块的关联

- [[模型训练/Mixed_Precision_Training/|混合精度训练]] — FP16/BF16/FP8 实战
- [[部署推理/Model_Compression/|模型压缩与量化]] — INT8/INT4 量化中的精度损失
- [[大模型/LLM_Architectures/LLM_Internals_Inference|推理内幕]] — KV Cache 数值精度
