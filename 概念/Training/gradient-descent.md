---
title: "梯度下降 (Gradient Descent)"
category: -concepts
tags: [deep-learning, optimization, gradient-descent, neural-network, fundamentals]
created: 2026-06-25
updated: 2026-07-21
summary: "通过计算损失函数对参数的梯度，并沿梯度反方向迭代更新参数，从而最小化模型误差的优化算法。"
lifecycle: reviewed
tier: supporting
aliases:
  - "Gradient Descent"
  - "梯度下降"
sources:
  - "https://arxiv.org/abs/1412.6980"  # Adam optimizer
name_zh: "梯度下降"
---

# 梯度下降 (Gradient Descent)

> 中文简称：梯度下降

**梯度下降是一种通过反复沿损失函数梯度的反方向调整模型参数，使预测误差逐渐减小的优化算法。** 它是训练神经网络最常用的基础方法。

## 核心思想

把模型训练想象成下山：

- 你站在一座山上，目标是走到山谷最低点
- 每次你环顾四周，找到最陡的下坡方向，朝那个方向迈一小步
- 重复这个过程，最终就能到达山谷

| 爬山比喻 | 训练含义 |
|---|---|
| 山的高度 | 损失函数（Loss）的大小 |
| 当前位置 | 模型当前的参数值 |
| 最陡下坡方向 | 梯度的反方向 |
| 步长 | 学习率（Learning Rate） |
| 山谷 | 损失最小的最优参数 |

## 算法步骤

1. **计算损失**：用当前参数对训练数据做预测，计算误差
2. **求梯度**：计算损失函数对每个参数的偏导数
3. **更新参数**：每个参数沿梯度反方向移动一小步
4. **重复迭代**：直到损失收敛或达到最大迭代次数

参数更新公式：

```
θ_new = θ_old − η × ∇L(θ_old)

其中：
  θ = 模型参数
  η = 学习率 (learning rate)
  ∇L = 损失函数的梯度
```

## 关键超参数

| 超参数 | 作用 | 影响 |
|---|---|---|
| 学习率 | 控制每次更新的步长 | 太大震荡/发散，太小收敛极慢 |
| 迭代次数 | 训练轮数 | 太少欠拟合，太多过拟合 |
| 批量大小 | 每次计算梯度的样本数 | 影响梯度估计的噪声与速度 |

## 常见变体

| 变体 | 原理 | 特点 |
|------|------|------|
| **Batch GD** | 每次用全部数据计算梯度 | 稳定但慢 |
| **SGD** | 每次用一个样本 | 快但噪声大 |
| **Mini-batch GD** | 每次用一小批样本 | 兼顾速度与稳定性，最常用 |
| **SGD + Momentum** | 加入动量项加速 | 减少震荡，加速收敛 |
| **Adam** | 自适应学习率 + 动量 | 默认选择，大多数场景好用 |
| **AdamW** | Adam + 解耦权重衰减 | LLM 训练标配 |

### 优化器对比

| 优化器 | 适用场景 | 典型学习率 |
|--------|----------|------------|
| SGD + Momentum | CV 任务、精细调优 | 0.01-0.1 |
| Adam | 通用默认 | 1e-3 到 3e-4 |
| AdamW | LLM 预训练/微调 | 1e-4 到 5e-5 |
| LAMB/LARS | 大 batch 分布式训练 | 1e-3 到 1e-2 |

## LLM 训练中的学习率调度

```
典型 LLM 学习率调度 (Warmup + Cosine Decay):

lr
│    /\
│   /  \
│  /    \
│ /      \
│/        \___
└───────────── steps
  warmup  cosine decay
```

```python
from transformers import get_cosine_schedule_with_warmup

scheduler = get_cosine_schedule_with_warmup(
    optimizer,
    num_warmup_steps=1000,      # 预热 1000 步
    num_training_steps=100000   # 总训练步数
)
```

## 为什么有效

梯度指向损失函数增长最快的方向，因此反方向就是损失下降最快的方向。沿着这个方向不断更新参数，损失就会逐步减小，模型预测能力随之提升。

## 常见问题与解决

| 问题 | 现象 | 解法 |
|------|------|------|
| 梯度消失 | 深层网络梯度趋近 0 | ReLU、残差连接、LayerNorm |
| 梯度爆炸 | 梯度变得极大 | 梯度裁剪 (gradient clipping) |
| 局部最优 | 陷入非全局最优点 | 动量、随机性、多起点 |
| 鞍点 | 梯度为 0 但非极值 | Adam 等自适应方法 |

## 相关

- [[概念/Training/gradient-checkpointing|梯度检查点]] — 训练显存优化
- [[概念/Training/distributed-training|分布式训练]] — 多卡并行训练
- [[03_深度学习/Deep_Learning_For_Beginners|深度学习入门]] — 神经网络基础
- [[05_大模型/05_LLM架构/09_LLM_Internals_训练|大模型训练内幕]] — 优化器与 学习率调度

## 2026 梯度下降生态现状

| 优化器 | 特色 | 适用 | 状态 |
|------|------|------|------|
| AdamW | 权重衰减解耦 | 通用 | ✅ 主流 |
| Lion | 符号更新、省显存 | 大模型 | ✅ 前沿 |
| Sophia | 二阶信息 | 大模型 | ✅ 前沿 |
| Adafactor | 省显存 | 超大模型 | ✅ 成熟 |
| LAMB | 大 batch | 分布式 | ✅ 成熟 |

## 检查清单

- [ ] 优化器已根据任务选择
- [ ] 学习率已调优（含 warmup）
- [ ] 权重衰减已配置
- [ ] 梯度裁剪已启用
- [ ] 学习率调度已配置
- [ ] 收敛性已验证

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 不收敛 | 学习率太高 | 降低 lr + warmup |
| 收敛慢 | 学习率太低 | 增大 lr |
| 震荡 | batch 太小 | 增大 batch 或梯度累积 |
| 过拟合 | 权重衰减不足 | 增大 weight decay |

## 延伸阅读

- [[概念/Training/pre-training|Pre-training]] — 预训练
- [[概念/Training/mixed-precision|Mixed Precision]] — 混合精度
- [[概念/Training/deepspeed|DeepSpeed]] — 分布式训练
- [[概念/Training/fsdp|FSDP]] — PyTorch 全分片
- [[03_深度学习/Deep_Learning_For_Beginners|深度学习入门]] — 神经网络基础

> ℹ️ 梯度下降是深度学习的核心优化算法，2026年 AdamW 仍是主流，Lion/Sophia 是前沿 选择，学习率调优是关键。

## 优化器对比

| 优化器 | 原理 | 优势 | 适用场景 |
|------|------|------|------|
| SGD | 基础梯度下降 | 简单、泛化好 | CV/小模型 |
| Momentum | 动量加速 | 收敛快 | 通用 |
| Adam | 自适应学习率 | 收敛快、稳定 | 通用默认 |
| AdamW | 解耦权重衰减 | 泛化更好 | LLM 训练 |
| Lion | 符号更新 | 显存省 | 大模型 |
| Sophia | 二阶信息 | 收敛快 | 研究前沿 |

## 学习率调度策略

| 策略 | 说明 | 适用场景 |
|------|------|------|
| Warmup + Cosine | 先升后降 | LLM 预训练 |
| Warmup + Linear | 线性衰减 | 微调 |
| OneCycleLR | 单周期 | 快速训练 |
| ReduceOnPlateau | 自适应 | 验证集监控 |
| Constant | 固定 | 简单场景 |

## 超参数参考

| 任务 | 优化器 | 学习率 | Batch Size | Warmup |
|------|------|------|------|------|
| LLM 预训练 | AdamW | 1e-4 ~ 3e-4 | 1M-4M tokens | 2000 steps |
| LLM 微调 | AdamW | 1e-5 ~ 5e-5 | 32-128 | 100 steps |
| LoRA 微调 | AdamW | 1e-4 ~ 3e-4 | 16-64 | 50 steps |
| CV 分类 | SGD+M | 0.01-0.1 | 256-1024 | 5 epochs |

## 梯度问题与解决

| 问题 | 现象 | 解决方案 |
|------|------|------|
| 梯度爆炸 | loss 突变 NaN | 梯度裁剪 (max_norm=1.0) |
| 梯度消失 | 训练停滞 | 残差连接 + LayerNorm |
| 鞍点 | 收敛慢 | 动量 + 自适应 lr |
| 局部极小 | 泛化差 | 大 batch + 高 lr |
