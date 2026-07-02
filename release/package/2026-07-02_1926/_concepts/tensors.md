---
title: Tensors
category: concepts
tags: [tensors, linear-algebra, deep-learning, matrix-operations, ai-fundamentals]
summary: 张量（Tensor）是标量、向量、矩阵在任意维度上的统一推广，是深度学习中表示数据、参数和梯度的核心数据结构。
created: 2026-07-02
updated: 2026-07-02
sources: []
---

# Tensors

**张量（Tensor）** 是深度学习与科学计算中最基础的数据结构，它是标量、向量、矩阵在任意维度上的自然推广。简单来说，张量就是一个多维数组，但它不仅仅是一个编程容器——在线性代数与微分几何语境下，张量还强调其在坐标变换下保持不变的物理/几何意义。

从阶数（rank/order）来看，张量形成一个清晰的层级：

| 阶数 | 名称 | AI 示例 |
|------|------|---------|
| 0 | 标量（scalar） | 损失值、学习率 |
| 1 | 向量（vector） | 词向量、隐状态 |
| 2 | 矩阵（matrix） | 权重矩阵、注意力矩阵 |
| 3 | 3 阶张量 | RGB 图像 `(H, W, 3)` |
| 4 | 4 阶张量 | 图像批次 `(B, C, H, W)` |

在工程实践中，PyTorch、TensorFlow 等框架中的 `Tensor` 通常指带有自动求导、GPU 加速和分布式语义的多维数组。

## 核心组成

一个张量通常由以下几个属性完整描述：

1. **形状（Shape）**：各维度的大小，例如 `(64, 3, 224, 224)` 表示 64 张 3 通道 224×224 的图像。
2. **数据类型（Dtype）**：`float32`、`bfloat16`、`int64` 等，决定精度与显存占用。
3. **设备（Device）**：数据驻留的位置，如 CPU、GPU、TPU 或 NPU，影响并行计算能力。
4. **步幅（Stride）**：沿各维度在内存中跳转的距离，决定视图（view）与拷贝（copy）的行为差异。
5. **布局（Layout）**：如稠密（dense）或稀疏（sparse），影响存储效率。

## 典型用例

- **数据表示**：将图像、文本、音频、视频统一表示为张量，便于批量处理。
- **模型参数**：神经网络的权重矩阵、偏置向量、归一化统计量都以张量形式存储。
- **中间激活**：每一层前向传播产生的特征图（feature map）都是张量。
- **梯度**：反向传播计算出的损失对参数的偏导数，同样组织为与参数同形的张量。
- **分布式训练**：大模型训练时，通过张量并行（tensor parallelism）将单个巨大张量切分到多卡计算。

## 与相关概念的区别与联系

- **张量 vs 矩阵**：矩阵只是 2 阶张量；张量可以是任意阶数，且更强调坐标变换下的协变/逆变规则。
- **张量 vs 向量**：向量是 1 阶张量，通常指一维有序数组；多个向量堆叠可形成更高阶张量。
- **张量 vs NumPy 数组**：二者在实现上高度相似，但深度学习框架的张量额外支持自动微分、加速器设备和计算图语义。

## Related

- [[_concepts/linear-algebra|线性代数]]
- [[_concepts/matrix-operations|矩阵运算]]
- [[_concepts/neural-networks|神经网络]]
- [[_concepts/embedding-models|嵌入模型]]
- [[_concepts/attention-variants|注意力机制]]
- [[_concepts/pytorch|PyTorch]]
- [[_concepts/ai-fundamentals|AI 基础]]
- [[_concepts/index|概念索引]]
