---
title: 神经网络
category: -concepts
tags: ["deep-learning", "neural-networks", "backpropagation", "activation-function", "normalization", "cnn", "rnn"]
aliases: [Neural Network, 神经网络核心, 深度学习基础]
relationships:
  - target: "[[概念/optimization-regularization]]"
    type: related_to
  - target: "概念/transformer-architecture"
    type: related_to
  - target: "概念/state-space-models"
    type: related_to
sources: [03_deep-reinforcement-learning_unsupervised-learning/Neural_Network_Core/Neural_Network_Core.md]
summary: 深度学习基石，通过层级化非线性变换自动学习多层次数据表示，涵盖前向传播、反向传播、激活函数与归一化等核心机制。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
name_zh: "神经网络"
---

# 神经网络

> 中文简称：神经网络

神经网络是深度学习的基石，通过多层简单计算单元的堆叠将输入信息逐步转换为高层抽象特征。从 1943 年的 McCulloch-Pitts 神经元到现代 Transformer，神经网络已成为计算机视觉、自然语言处理等领域的核心技术。训练过程依赖 优化器 在高维参数空间中寻找最优解。

## 核心要点

- **端到端学习**：自动学习从原始输入到输出的映射，无需手工特征工程
- **分层表示**：浅层学习边缘、纹理等简单特征，深层学习物体、语义等抽象概念
- **通用逼近能力**：理论上单隐层含足够多神经元的网络可逼近任意连续函数
- **非线性建模**：激活函数引入非线性，使模型能拟合复杂函数
- **可扩展性**：从小型 MLP 到数十亿参数的大模型，架构灵活

## 详细内容

### 从感知机到多层感知机

感知机（Perceptron, 1958）是最简单的神经网络，输出 $\hat{y} = \text{sign}(\mathbf{w}^T \mathbf{x} + b)$，但无法解决 XOR 等非线性问题（Minsky 证明，1969）。多层感知机（MLP）通过引入隐藏层突破此限制：

$$\mathbf{h} = \sigma(\mathbf{W}_1 \mathbf{x} + \mathbf{b}_1), \quad \hat{y} = \mathbf{W}_2 \mathbf{h} + \mathbf{b}_2$$

通用逼近定理保证，含足够多神经元的单隐层网络可逼近任意连续函数。实践中深度网络比浅层宽网络更参数高效。

### 前向传播与反向传播

前向传播逐层计算：

$$\mathbf{z}^{[l]} = \mathbf{W}^{[l]} \mathbf{a}^{[l-1]} + \mathbf{b}^{[l]}, \quad \mathbf{a}^{[l]} = \sigma(\mathbf{z}^{[l]})$$

反向传播通过链式法则高效计算梯度：

$$\delta^{[l]} = (\mathbf{W}^{[l+1]})^T \delta^{[l+1]} \odot \sigma'(\mathbf{z}^{[l]})$$

$$\frac{\partial L}{\partial \mathbf{W}^{[l]}} = \delta^{[l]} (\mathbf{a}^{[l-1]})^T$$

反向传播是训练神经网络的核心算法，计算图从输出层向输入层反向传递梯度。

### 激活函数

激活函数引入非线性，使深层网络有意义。关键对比：

| 激活函数 | 公式 | 适用场景 |
|----------|------|----------|
| **ReLU** | $\max(0, x)$ | CV 基础网络，简单高效 |
| **GELU** | $x \Phi(x)$ | Transformer，平滑非线性 |
| **Swish** | $x \sigma(\beta x)$ | NAS 搜索结果，自门控 |
| **Tanh** | $\frac{e^x - e^{-x}}{e^x + e^{-x}}$ | 零中心输出，适合浅层 |

ReLU 的"神经元死亡"问题（负区间梯度为零）可通过 Leaky ReLU 缓解。GELU 在 BERT/GPT 中表现优于 ReLU，可看作随机 Dropout 的确定性近似 ^[inferred]。

### 梯度消失与爆炸

深层网络中梯度在反向传播时逐层衰减或增长：

- **梯度消失**：Sigmoid/Tanh 的导数 $< 1$，连乘导致梯度指数衰减（$0.25^L \to 0$）
- **梯度爆炸**：权重过大时梯度指数增长，参数更新失控

**解决方案**：

| 技术 | 解决问题 | 原理 |
|------|----------|------|
| ReLU | 梯度消失 | 正区间梯度恒为 1 |
| 残差连接（ResNet） | 梯度消失 | 梯度可跳过层直接传播 |
| LSTM/GRU | RNN 梯度消失 | 门控机制保护梯度 |
| BatchNorm | 梯度消失 | 保持激活值在合理范围 |
| He 初始化 | 梯度消失/爆炸 | 控制初始权重尺度 |
| 梯度裁剪 | 梯度爆炸 | 限制梯度范数 |

### 权重初始化

随机初始化打破对称性，策略选择取决于激活函数：

- **Xavier 初始化**：$W \sim \mathcal{N}(0, \frac{2}{n_{\text{in}} + n_{\text{out}}})$，适合 Tanh/Sigmoid
- **He 初始化**：$W \sim \mathcal{N}(0, \frac{2}{n_{\text{in}}})$，适合 ReLU/Leaky ReLU，深度网络标配

He 初始化考虑了 ReLU 只保留一半激活的特性，方差减半后补偿 ^[inferred]。

### 归一化技术

归一化通过标准化中间层激活加速训练并提升泛化：

**Batch Normalization (BN)**：对每个 mini-batch 跨样本归一化

$$\hat{x}_i = \frac{x_i - \mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}}, \quad y_i = \gamma \hat{x}_i + \beta$$

优势是加速收敛、缓解梯度消失、具有正则化效果。劣势是对 batch size 敏感，训练/推理行为不一致。

**Layer Normalization (LN)**：对单个样本跨特征归一化

不依赖 batch size，训练推理行为一致。Transformer 使用 LN 而非 BN，因为序列长度可变导致 batch 统计量不稳定 ^[inferred]。

| 维度 | Batch Norm | Layer Norm |
|------|------------|------------|
| 归一化维度 | 跨样本（batch 维度） | 跨特征（feature-engineering 维度） |
| batch 依赖 | 依赖 batch size | 不依赖 |
| 训练/推理 | 行为不同 | 行为一致 |
| 适用场景 | CNN（图像） | NLP（Transformer/RNN） |

### 主流架构概览

| 架构 | 核心组件 | 归纳偏置 | 代表模型 |
|------|----------|----------|----------|
| MLP | 全连接层 | 无（通用） | 传统神经网络 |
| CNN | 卷积 + 池化 | 局部性 + 平移不变性 | ResNet, EfficientNet |
| RNN | 循环连接 | 时序依赖 | LSTM, GRU |
| transformer-architecture | 自注意力 | 全局关联 | BERT, GPT, ViT |

**CNN 核心原理**：卷积操作通过参数共享、局部连接和平移不变性高效处理网格数据（如图像）。

**RNN 与 LSTM**：循环神经网络处理序列数据但受梯度问题困扰。LSTM 通过门控机制（遗忘门、输入门、输出门）和细胞状态 $C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$ 让梯度直接传播，缓解长程依赖问题。

**残差连接**：$\mathbf{h}^{[l+1]} = \mathbf{h}^{[l]} + F(\mathbf{h}^{[l]})$，梯度包含单位矩阵 $I$ 保证梯度流动，是训练极深网络（100+ 层）的关键。

### optimization-regularization 正则化

训练时以概率 $p$ 随机丢弃神经元，推理时保留全部。效果相当于训练 $2^n$ 个子网络的集成，防止神经元共适应。通常用于全连接层之间，Dropout 率 0.2-0.5。

## 开放问题

- 最优网络架构是否可被自动发现（NAS 的极限在哪里）？ ^[ambiguous]
- 深度网络为什么泛化能力好？传统泛化理论无法解释过参数化网络的泛化行为 ^[ambiguous]
- 神经网络的彩票假设（Lottery Ticket Hypothesis）是否揭示了网络训练的本质？

## 来源

- 03_深度学习/02_神经网络核心/Neural_Network_Core.md
- McCulloch-Pitts (1943), Rosenblatt 感知机 (1958), Rumelhart 反向传播 (1986)
- He et al. (2015) 残差网络, Ioffe & Szegedy (2015) BatchNorm

## Related

- [[03_深度学习/DL-in-nutshell]] — 深度学习速成指南 (共享: backpropagation, dl)
- [[03_深度学习/README]] — 03 深度学习基础 (Deep Learning Foundations) (共享: backpropagation, dl)
- [[03_深度学习/07_世界模型/02_JEPA_架构_2026]] — JEPA 架构深度解析：LeCun 的世界模型之路 (共享: backpropagation, dl)
- [[03_深度学习/07_世界模型/README]] — 世界模型 (World Models) (共享: backpropagation, dl)
- [[概念/Vision/world-models-jepa.md|world-models-jepa]]

---

## 2026 神经网络生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Transformer** | 当前主流架构 | GA |
| **MLP/MoE** | 多层感知机/混合专家 | GA |
| **CNN** | 卷积神经网络，视觉任务 | GA |
| **RNN/LSTM** | 循环网络，时序任务 | GA |
| **神经架构搜索** | NAS 自动架构设计 | 研究 |

## 生产最佳实践

1. **Transformer 优先**：NLP/多模态优先用 Transformer
2. **预训练+微调**：大模型预训练 + 下游微调
3. **正则化**：训练必须用正则化防止过拟合
4. **批归一化**：深度网络用批归一化/LayerNorm
5. **残差连接**：深层网络用残差连接

## 2026 神经网络架构生态

| 架构 | 代表 | 特点 | 状态 |
|------|------|------|------|
| **Transformer** | GPT/LLaMA | 注意力机制 | GA 主流 |
| **CNN** | ConvNeXt | 卷积 | GA |
| **RNN/LSTM** | - | 序列 | 衰退 |
| **Mamba/SSM** | Mamba-2 | 状态空间 | 研究 |
| **MoE** | Mixtral | 混合专家 | GA |
| **RWKV** | RWKV-6 | 线性注意力 | 研究 |

## 神经网络基础组件

```
神经网络组件:
┌─────────────────────────────────────────┐
│  输入层: 数据输入                        │
├─────────────────────────────────────────┤
│  隐藏层: 线性变换 + 激活函数            │
│    - 全连接: y = Wx + b                 │
│    - 卷积: y = Conv(x, W)               │
│    - 注意力: y = Attention(Q, K, V)     │
├─────────────────────────────────────────┤
│  归一化: LayerNorm / BatchNorm          │
├─────────────────────────────────────────┤
│  残差连接: y = x + f(x)                 │
├─────────────────────────────────────────┤
│  输出层: 任务特定输出                    │
└─────────────────────────────────────────┘
```

## 神经网络代码示例

```python
import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.GELU(),
            nn.LayerNorm(hidden_dim),
            nn.Dropout(0.1),
            nn.Linear(hidden_dim, output_dim)
        )
    
    def forward(self, x):
        return self.layers(x)

model = MLP(784, 256, 10)
```

## 延伸阅读

- [[概念/Math/activation-value|激活函数]] — 非线性核心
- [[概念/Math/optimization-regularization|优化与正则化]] — 训练优化
- [[概念/LLM/transformer-architecture|Transformer]] — 主流架构
- [[概念/Math/linear-algebra|线性代数]] — 数学基础

> ℹ️ 神经网络是深度学习的核心，Transformer 是 2026 年的主流架构。
