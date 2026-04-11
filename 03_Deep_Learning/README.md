# 03 深度学习基础 (Deep Learning Foundations)

本章聚焦神经网络的核心机制，涵盖网络架构组件（激活函数、归一化层）、训练算法（反向传播）、优化器（Adam/AdamW）和正则化技术（Dropout）。这是现代深度学习的技术基石。

## 学习路径 (Learning Path)

```
    ┌────────────────────────┐
    │  神经网络核心           │
    │  Neural Network Core   │
    │  (反向传播/激活函数)    │
    └───────────┬────────────┘
                │
                ▼
    ┌────────────────────────┐
    │  训练优化               │
    │  Optimization          │
    │  (优化器/正则化)        │
    └────────────────────────┘
```

## 内容索引 (Content Index)

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 神经网络核心 (Neural Network Core) | 入门 | 激活函数、反向传播、BatchNorm/LayerNorm，理解网络训练机制 | [Neural_Network_Core.md](./Neural_Network_Core/Neural_Network_Core.md) |
| 优化与正则化 (Optimization) | 进阶 | AdamW、学习率调度、Dropout/Weight Decay，稳定训练与防过拟合 | [Optimization.md](./Optimization/Optimization.md) |
| **状态空间模型 2026 (SSM)** | **2026 新增** | **Mamba/S4/RetNet、O(n)线性复杂度、Transformer挑战者** | **[State_Space_Models_2026.md](./State_Space_Models_2026.md)** |
| 世界模型 (World Models) | 前沿 | JEPA/V-JEPA/LeJEPA，自监督世界建模，通往AGI路径 | [World_Models_2026.md](./World_Models/World_Models_2026.md) |

## 前置知识 (Prerequisites)

- **必修**: [线性代数](../01_Fundamentals/Linear_Algebra/Linear_Algebra.md)（矩阵运算）、[概率统计](../01_Fundamentals/Probability_Statistics/Probability_Statistics.md)（损失函数设计）
- **推荐**: [监督学习](../02_Machine_Learning/Supervised_Learning/Supervised_Learning.md)（理解梯度下降）
- **可选**: [数据结构与算法](../01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms.md)（理解计算图）

## 关键术语速查 (Key Terms)

- **反向传播 (Backpropagation)**: 通过链式法则计算梯度，是训练神经网络的核心算法
- **激活函数 (Activation Function)**: 引入非线性，常用 ReLU、GELU、Sigmoid
- **梯度消失/爆炸 (Gradient Vanishing/Exploding)**: 深层网络训练问题，通过归一化和残差连接缓解
- **BatchNorm**: 批归一化，稳定训练并加速收敛
- **LayerNorm**: 层归一化，Transformer 架构中的标准组件
- **优化器 (Optimizer)**: 更新参数的算法，Adam/AdamW 是主流选择
- **学习率调度 (Learning Rate Scheduling)**: 动态调整学习率，如 Warmup + Cosine Decay
- **Dropout**: 训练时随机丢弃神经元，防止过拟合
- **Weight Decay**: L2 正则化的另一种形式,限制参数范数
- **残差连接 (Residual Connection)**: 跳跃连接技术，解决深层网络退化问题

---
*Last updated: 2026-02-10*
