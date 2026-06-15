---
title: "优化基础 - 小白版"
category: 07-model-training
tags: ["optimization", "gradient-descent", "learning-rate", "adam", "sgd", "training"]
summary: '> **一句话秒懂**: 优化就是给模型找一条"下山的路"——用最少的步数、最快的速度走到最低点（损失最小），就像闭眼下山，每一步都要踩对方向。'
created: 2026-06-12
updated: 2026-06-12
---

# 优化基础 - 小白版

> **一句话秒懂**: 优化就是给模型找一条"下山的路"——用最少的步数、最快的速度走到最低点（损失最小），就像闭眼下山，每一步都要踩对方向。

## 你将学到什么

- **你能够**理解梯度下降的核心思想（为什么模型能"学习"）
- **你能够**区分 SGD、Adam、AdamW 等主流优化器
- **你能够**掌握学习率调优的关键技巧（Warmup、Cosine Decay）
- **你能够**理解正则化如何防止模型"死记硬背"
- **你能够**判断什么时候该用什么优化策略

## 为什么这个很重要？

### 真实案例：学习率选错，训练 3 天白费

**场景**：训练一个图像分类模型

**错误示范**：
```
学习率 = 1.0（太大）
→ 损失值震荡：5.0 → 8.0 → 3.0 → 12.0 → ...
→ 模型"跳来跳去"永远找不到最优解
→ 浪费 3 天 GPU 时间，电费 $500
```

**正确做法**：
```
学习率 = 0.001 + Cosine Decay
→ 损失值稳步下降：5.0 → 3.2 → 2.1 → 1.5 → 1.2 → ...
→ 模型稳定收敛
→ 8 小时训练完成，效果达标
```

---

## 1. 梯度下降：核心思想

### 什么是梯度？

**直觉理解**：梯度就是"最陡的上坡方向"。

```
想象你站在一座山上：
- 梯度方向 = 最陡的上坡方向
- 负梯度方向 = 最陡的下坡方向（我们想要的）
- 梯度大小 = 坡度有多陡

损失函数 Loss(θ) 的梯度 ∇Loss：
- 告诉我们在当前参数 θ 下，哪个方向 loss 增加最快
- 我们反方向走，就能让 loss 减小
```

### 梯度下降三步曲

```
重复直到收敛（loss 不再明显下降）：
1. 计算当前参数的梯度: g = ∇Loss(θ)
2. 更新参数: θ = θ - lr × g
3. 检查是否收敛: |Loss_new - Loss_old| < ε
```

### 三种梯度下降变体

| 变体 | 每次使用的数据量 | 优点 | 缺点 |
|------|-----------------|------|------|
| **BGD** (Batch) | 全部数据 | 稳定，方向准确 | 慢，内存大 |
| **SGD** (Stochastic) | 1 个样本 | 快，内存小 | 方向噪声大 |
| **Mini-batch** | 一批样本 (32-512) | 兼顾速度和稳定 | 需要调 batch size |

```python
# Mini-batch 梯度下降（最常用）
for epoch in range(num_epochs):
    for batch in dataloader:  # 每次取 32 个样本
        loss = model.compute_loss(batch)
        loss.backward()        # 计算梯度
        optimizer.step()       # 更新参数
        optimizer.zero_grad()  # 清零梯度
```

---

## 2. 主流优化器对比

### 2.1 SGD (随机梯度下降)

```
θ = θ - lr × g

优点：简单、内存少、泛化好
缺点：收敛慢、容易卡在鞍点
适用：简单模型、资源受限
```

### 2.2 SGD + Momentum

```
v = β × v + g          # 累积动量
θ = θ - lr × v         # 带惯性的更新

直觉：就像滚下山坡的球，有了惯性就能冲过小山丘
β 通常 = 0.9
```

### 2.3 Adam (Adaptive Moment Estimation)

```
m = β₁ × m + (1-β₁) × g          # 一阶动量（方向）
v = β₂ × v + (1-β₂) × g²         # 二阶动量（梯度方差）
θ = θ - lr × m / (√v + ε)        # 自适应更新

直觉：每个参数有自己的学习率
- 梯度大的参数 → 学习率自动变小（防止跳太远）
- 梯度小的参数 → 学习率自动变大（加速收敛）
```

### 2.4 AdamW (Adam + Weight Decay)

```
与 Adam 的区别：正则化方式不同
- Adam: 把 weight decay 混入梯度 → 正则化效果受学习率影响
- AdamW: 直接对参数做衰减 → 正则化效果独立

θ = θ - lr × λ × θ    # 直接缩小参数值

推荐：训练 LLM 和 Transformer 默认用 AdamW
```

### 优化器选择指南

```
你的场景是什么？
├── 训练 LLM / Transformer → AdamW (lr=1e-4 ~ 5e-5)
├── 训练 CNN 图像模型 → SGD + Momentum (lr=0.1) 或 AdamW
├── 微调预训练模型 → AdamW (lr=1e-5 ~ 5e-5)
├── 资源极度受限 → SGD (lr=0.01)
└── 不确定用哪个？ → AdamW (lr=3e-4)，这是最安全的选择
```

---

## 3. 学习率调度

### 3.1 为什么需要调度？

```
训练初期：需要大学习率 → 快速接近最优区域
训练后期：需要小学习率 → 精细调整，避免在最优解附近跳来跳去

类比：
开车导航 → 高速路段开快车（大 lr），接近目的地减速（小 lr）
```

### 3.2 常见调度策略

| 策略 | 原理 | 适用场景 |
|------|------|----------|
| **Constant** | lr 不变 | 简单任务、快速实验 |
| **Step Decay** | 每隔 N 步减半 | CNN 训练 |
| **Cosine Decay** | lr 按余弦曲线下降 | LLM/Transformer |
| **Warmup + Cosine** | 先升后降 | 大模型训练（推荐） |
| **Reduce on Plateau** | loss 不下降时减小 | 不确定时用这个 |

### 3.3 Warmup + Cosine Decay（最推荐）

```python
# 最流行的学习率调度
# 先用 10% 的步数线性增加 lr，再用余弦曲线降到 0

def get_lr(step, warmup_steps, total_steps, max_lr):
    if step < warmup_steps:
        return max_lr * step / warmup_steps  # 线性增长
    progress = (step - warmup_steps) / (total_steps - warmup_steps)
    return max_lr * 0.5 * (1 + cos(π × progress))  # 余弦衰减

# 典型参数：
# warmup_steps = total_steps × 0.1
# max_lr = 3e-4 (Transformer) 或 1e-3 (小模型)
```

---

## 4. 正则化技术

### 4.1 Weight Decay (L2 正则化)

```
在 loss 中加一项: Loss = 原始Loss + λ × Σθ²

效果：阻止参数变得太大，迫使模型用更"简单"的方式学习
λ 太大 → 欠拟合（模型太简单）
λ 太小 → 过拟合（模型记住了噪声）
常用值：0.01 ~ 0.1
```

### 4.2 Dropout

```
训练时：随机"关闭"一部分神经元（比如 20%）
推理时：所有神经元工作，输出乘以 0.8

效果：防止神经元之间"串通"记住训练数据
类比：小组作业中随机让几个人请假，逼迫每个人都学会独立完成任务

常用率：0.1 ~ 0.5（Transformer 通常 0.1）
```

### 4.3 Gradient Clipping

```
if ||gradient|| > max_norm:
    gradient = gradient × (max_norm / ||gradient||)

效果：防止梯度爆炸（loss 突然变成 NaN）
max_norm 通常 = 1.0
LLM 训练必备！
```

---

## 5. 实战代码模板

### 完整的 PyTorch 优化配置

```python
import torch
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR

# 模型
model = MyModel()

# 优化器（AdamW 是最安全的选择）
optimizer = AdamW(
    model.parameters(),
    lr=3e-4,           # 学习率
    weight_decay=0.01, # L2 正则化
    betas=(0.9, 0.95)  # 动量参数
)

# 学习率调度器
scheduler = CosineAnnealingLR(
    optimizer,
    T_max=10000,       # 总训练步数
    eta_min=1e-6       # 最小学习率
)

# 训练循环
for epoch in range(num_epochs):
    for batch in dataloader:
        loss = model(batch)
        loss.backward()
        
        # 梯度裁剪（防止梯度爆炸）
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        
        optimizer.step()
        scheduler.step()
        optimizer.zero_grad()
```

---

## 相关阅读

- [[07_Model_Training/Model_Training]] — 模型训练全景
- [[07_Model_Training/Model_Training_for_dummy]] — 模型训练入门版
- [[07_Model_Training/Distributed_Training_for_dummy]] — 分布式训练入门
- [[07_Model_Training/Training_Optimization_2026]] — 2026 训练优化进阶
- [[04_NLP_LLMs/Fine_tuning_Techniques/PEFT_2026]] — 参数高效微调
