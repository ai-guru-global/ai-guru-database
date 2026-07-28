---
title: 优化与正则化
category: -concepts
tags: ["deep-learning", "optimization", "regularization", "adam", "sgd", "learning-rate", "dropout", "weight-decay"]
aliases: [Optimization, 训练优化, 优化器, 深度学习优化]
relationships:
  - target: "[[概念/neural-networks]]"
    type: related_to
  - target: "概念/transformer-architecture"
    type: related_to
  - target: "概念/state-space-models"
    type: related_to
sources: [03_deep-reinforcement-learning_unsupervised-learning/Optimization/Optimization.md]
summary: 深度学习训练的核心环节，涵盖优化器设计（SGD/Adam/AdamW）、学习率调度、梯度裁剪与正则化技术，决定模型收敛速度和最终性能。
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
name_zh: "优化与正则化"
---

# 优化与正则化

> 中文简称：优化与正则化

训练优化是深度学习的核心环节，在高维非凸参数空间中最小化损失函数。核心挑战包括局部极小值、鞍点、梯度消失/爆炸和病态曲率。优化器、学习率调度和正则化的协同配合决定了 神经网络 能否收敛以及最终性能。

## 核心要点

- **损失函数**衡量预测与真实值的差距，**优化器**定义参数更新规则
- **学习率**是最重要的超参数，需要精心调度
- **正则化**（Dropout、Weight Decay、Label Smoothing）防止过拟合
- AdamW + Warmup + Cosine Annealing 是 Transformer 训练标配
- 混合精度训练（FP16/FP32）可提速 2-3 倍，几乎不损失精度

## 详细内容

### 梯度下降家族

**批量梯度下降（BGD）**：使用全量数据计算梯度，稳定但计算量大。**随机梯度下降（SGD）**：单样本更新，快速但噪声大。**Mini-batch 梯度下降**：工业界标准，平衡计算效率与梯度稳定性，常用 batch size 32-256。

Batch size 选择指南：

| Batch Size | 优势 | 劣势 | 适用场景 |
|------------|------|------|----------|
| 小（16-32） | 正则化效果，泛化好 | 训练慢 | 小数据集 |
| 中（64-256） | 平衡速度和泛化 | 需调优 | 通用场景 |
| 大（512+） | 训练快，GPU 高效 | 泛化差 | 分布式训练 |

### 动量优化

**SGD + Momentum** 累积历史梯度加速收敛：$v_t = \beta v_{t-1} + \nabla_\theta J(\theta)$，$\beta$ 通常取 0.9。物理类比是小球滚下山坡时积累惯性。Nesterov 加速梯度（NAG）在"未来位置"计算梯度，提前预知方向避免过冲 ^[inferred]。

### 自适应学习率算法

**Adam** 结合 Momentum（一阶矩）和 RMSProp（二阶矩）：

$$m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t, \quad v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2$$

$$\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}, \quad \theta \leftarrow \theta - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t$$

偏差修正确保初期估计不受零初始化影响。默认 $\beta_1=0.9, \beta_2=0.999, \epsilon=10^{-8}$。

**AdamW** 修正了 Adam 中权重衰减的实现错误，将权重衰减与梯度解耦：

$$\theta \leftarrow \theta - \eta \left( \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon} + \lambda \theta \right)$$

在 Transformer 训练中显著优于 Adam，llm-architectures/GPT 训练快 10-20%。

### 优化器选择指南

| 优化器 | 优势 | 适用场景 |
|--------|------|----------|
| **SGD + Momentum** | 泛化最好，找到宽极小值 | CV（ResNet） |
| **Adam** | 快速收敛，鲁棒 | NLP/通用快速原型 |
| **AdamW** | Adam 改进，解耦权重衰减 | **transformer-architecture/SOTA** |
| **RMSProp** | 解决 AdaGrad 衰减 | RNN/强化学习 |

SGD 找到的极小值"更宽"（对参数扰动不敏感）导致泛化更好，而 Adam 可能陷入尖锐极小值 ^[inferred]。

### 学习率调度

学习率是最重要的超参数。常用策略：

**Warmup（预热）**：前 $N$ 步线性增加学习率，防止初期梯度爆炸。Transformer 必须使用，因为 Adam 初期二阶矩估计不准，$\frac{1}{\sqrt{v_t}}$ 过大 ^[inferred]。

**Cosine Annealing（余弦退火）**：平滑衰减学习率

$$\eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min}) \left(1 + \cos\left(\frac{t}{T} \pi\right)\right)$$

**Warmup + Cosine** 是当前 Transformer 训练标配（BERT、GPT 系列）。

**Step Decay**：每 $s$ 个 epoch 乘以衰减系数 $\gamma$（如 0.1），适合 CNN。

### 梯度裁剪

防止梯度爆炸，保留方向但限制幅度：

$$\mathbf{g}_{\text{clipped}} = \begin{cases} \mathbf{g} & \|\mathbf{g}\| \leq \tau \\ \frac{\tau}{\|\mathbf{g}\|} \mathbf{g} & \text{otherwise} \end{cases}$$

适用于 RNN/LSTM（长序列梯度易爆炸）、Transformer（深层网络）和训练早期。max_norm=1.0 是 Transformer 标准。

### 正则化技术

**Dropout**：训练时以概率 $p$ 随机丢弃神经元，效果等同于训练 $2^n$ 个子网络的集成。防止神经元共适应，强制学习鲁棒特征。通常 0.2-0.5，用于全连接层。

**Weight Decay（L2 正则化）**：惩罚大权重 $\frac{\lambda}{2}\|\theta\|^2$，限制参数范数。AdamW 中正确实现为解耦形式。

**Label Smoothing**：将硬标签 $[0, 1]$ 软化为 $[\epsilon/K, 1-\epsilon+\epsilon/K]$，防止过度自信，提升泛化 ^[inferred]。

**BatchNorm 的正则化效果**：mini-batch 噪声类似 Dropout，具有隐式正则化。

### 混合精度训练

FP16 加速计算 + FP32 保证精度。损失缩放避免 FP16 下溢，主权重用 FP32 累积更新。训练速度提升 2-3 倍，内存减半，几乎不损失精度。

### 梯度累积

模拟大 batch size 训练但不增加内存：累积 $n$ 步梯度后统一更新，等效 batch size = $n \times b$。适用于大模型训练（GPT/BERT）和显存受限环境。

### 实战配置参考

**ResNet（CV）**：SGD + Momentum(0.9)，lr=0.1 Step Decay，batch=256，weight_decay=1e-4

**BERT（NLP）**：AdamW，lr=1e-4，Warmup(10k steps) + linear-algebra Decay，梯度裁剪 max_norm=1.0，混合精度 FP16

**PPO（RL）**：Adam，lr=3e-4 固定，梯度裁剪 0.5，熵正则化

## 开放问题

- 自适应优化器泛化性不如 SGD 的根本原因是什么？ ^[ambiguous]
- 最优学习率调度是否存在理论保证？当前主要依赖经验
- 大 batch 训练的泛化 Gap 是否可通过正则化完全消除？ ^[ambiguous]

## 来源

- 03_深度学习/03_Optimization/Optimization.md
- Kingma & Ba (2015) Adam, Loshchilov & Hutter (2017) AdamW
- Goyal et al. (2017) 大 batch 训练技巧
## Related

- [[20_论文精读/08_Vision/ResNet_Deep_Dive.md]] — ResNet 深度解读

---

## 2026 优化与正则化生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **AdamW** | LLM 训练标准优化器 | GA |
| **学习率调度** | Cosine/Warmup 学习率调度 | GA |
| **Dropout** | 经典正则化方法 | GA |
| **Weight Decay** | 权重衰减正则化 | GA |
| **梯度裁剪** | 防止梯度爆炸 | GA |

## 生产最佳实践

1. **AdamW 默认**：LLM 训练默认用 AdamW
2. **学习率调度**：必须用学习率调度
3. **梯度裁剪**：训练大模型必须梯度裁剪
4. **正则化平衡**：正则化强度需要调优
5. **大 batch 训练**：大 batch 训练需要调整学习率

## 2026 优化器生态

| 优化器 | 特点 | 适用 | 状态 |
|--------|------|------|------|
| **AdamW** | 解耦权重衰减 | 通用首选 | GA |
| **Lion** | 符号更新 | 大模型 | GA |
| **Sophia** | 二阶信息 | 大模型 | 研究 |
| **Adafactor** | 内存高效 | 大模型 | GA |
| **LAMB** | 大 batch | 分布式 | GA |

## 正则化方法对比

| 方法 | 原理 | 效果 | 适用 |
|------|------|------|------|
| **L1 (Lasso)** | 绝对值惩罚 | 稀疏化 | 特征选择 |
| **L2 (Ridge)** | 平方惩罚 | 平滑化 | 通用 |
| **Dropout** | 随机失活 | 防过拟合 | 深度学习 |
| **Weight Decay** | 权重衰减 | 泛化 | 通用 |
| **Early Stopping** | 早停 | 防过拟合 | 通用 |
| **Label Smoothing** | 标签平滑 | 校准 | 分类 |

## 优化器代码示例

```python
import torch
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR

# AdamW 优化器
optimizer = AdamW(
    model.parameters(),
    lr=1e-4,
    betas=(0.9, 0.999),
    weight_decay=0.01
)

# 余弦退火学习率调度
scheduler = CosineAnnealingLR(optimizer, T_max=1000, eta_min=1e-6)

# 训练循环
for epoch in range(100):
    for batch in dataloader:
        loss = model(batch)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        scheduler.step()
        optimizer.zero_grad()
```

## 延伸阅读

- [[概念/Math/neural-networks|神经网络]] — 网络基础
- [[概念/Training/training-optimization|训练优化]] — 训练技巧
- [[概念/Math/linear-algebra|线性代数]] — 矩阵运算
- [[概念/LLM/llm-training-checklist|训练清单]] — LLM 训练

> ℹ️ 优化器和正则化是训练成功的关键，AdamW + 余弦退火是标配。
