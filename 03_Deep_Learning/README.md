---
title: 03 深度学习基础 (Deep Learning Foundations)
category: 03-deep-learning
tags: ["deep-learning", "neural-networks", "backpropagation"]
summary: "本章聚焦神经网络的核心机制，涵盖网络架构组件（激活函数、归一化层）、训练算法（反向传播）、优化器（Adam/AdamW）和正则化技术（Dropout）。这是现代深度学习的技术基石。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting

---
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
| **状态空间模型 2026 (SSM)** | **2026 新增** | **Mamba/S4/RetNet、O(n)线性复杂度、Transformer 挑战者** | **[State_Space_Models_2026.md](./State_Space_Models_2026.md)** |
| **图神经网络 (GNN)** | **2026 新增** | **GCN/GAT/GraphSAGE/Graph Transformer、消息传递范式、分子预测** | **[Graph_Neural_Networks/](./Graph_Neural_Networks/)** |
| **自监督学习 (SSL)** | **2026 新增** | **对比学习(SimCLR/MoCo)、掩码建模(MAE/BEiT)、自蒸馏(DINO)** | **[Self_Supervised_Learning/](./Self_Supervised_Learning/)** |
| **你的第一个神经网络** | **入门** | **PyTorch 搭建 CNN，训练 MNIST 手写数字识别，理解反向传播** | **[Your_First_Neural_Network.md](./Neural_Network_Core/Your_First_Neural_Network.md)** |
| **注意力机制 (Attention Mechanisms)** | **核心** | **自注意力、多头注意力、Flash Attention、GQA/MQA，现代 AI 的核心计算原语** | **[Attention_Mechanisms_Deep_Dive.md](./Neural_Network_Core/Attention_Mechanisms_Deep_Dive.md)** |
| **迁移学习 (Transfer Learning)** | **核心** | **预训练-微调范式、特征迁移、参数高效微调(LoRA)、域适应** | **[Transfer_Learning.md](./Transfer_Learning.md)** |
| **深度学习概览 (DL Overview)** | **入门** | **全景概览：从神经网络基础到现代架构，从训练技巧到工程实践** | **[DL_Overview.md](./DL_Overview.md)** |
| 世界模型 (World Models) | 前沿 | JEPA/V-JEPA/LeJEPA，自监督世界建模，通往 AGI 路径 | [World_Models_2026.md](./World_Models/World_Models_2026.md) |

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

## Related
- [[03_Deep_Learning/Graph_Neural_Networks/README|图神经网络 (Graph Neural Networks)]]
- [[03_Deep_Learning/Graph_Neural_Networks/Graph_Neural_Networks_Deep_Dive|图神经网络深度解读: 从 GCN 到 GAT 再到 Graph Transformer]]
- [[03_Deep_Learning/Self_Supervised_Learning/Self_Supervised_Learning_Deep_Dive|自监督学习深度解读: 从对比学习到掩码建模]]
- [[03_Deep_Learning/Self_Supervised_Learning/README|自监督学习 (Self-Supervised Learning)]]
- [[03_Deep_Learning/README_for_dummy|03 深度学习基础 - 小白版]]

- [[03_Deep_Learning/DL-in-nutshell]] — 深度学习速成指南 (共享: backpropagation, deep-learning, dl, neural-networks)
- [[03_Deep_Learning/World_Models/JEPA_Architecture_2026]] — JEPA 架构深度解析：LeCun 的世界模型之路 (共享: backpropagation, deep-learning, dl, neural-networks)
- [[03_Deep_Learning/World_Models/README]] — 世界模型 (World Models) (共享: backpropagation, deep-learning, dl, neural-networks)
- [[03_Deep_Learning/World_Models/World_Models_2026]] — World_Models_2026
- [[03_Deep_Learning/Optimization/Optimization_for_dummy]] — Optimization_for_dummy
- [[03_Deep_Learning/Optimization/Optimization]] — Optimization
- [[03_Deep_Learning/Neural_Network_Core/Neural_Network_Core_for_dummy]] — Neural_Network_Core_for_dummy
- [[03_Deep_Learning/Neural_Network_Core/Neural_Network_Core]] — Neural_Network_Core
- [[03_Deep_Learning/README_for_dummy.md|README_for_dummy]]

- [[03_Deep_Learning/README_for_dummy|03 深度学习基础 - 小白版]]

## 相关资源

- [[03_Deep_Learning/DL_Frameworks/pytorch_overview|PyTorch]]
- [[03_Deep_Learning/DL_Frameworks/tensorflow_overview|TensorFlow]]
- [[03_Deep_Learning/DL_Frameworks/keras_overview|Keras]]
