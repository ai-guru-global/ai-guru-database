---
title: "超参数优化完全指南 (Hyperparameter Optimization Complete Guide)"
category: 07-model-training-optimization
tags: ["model-training", "hyperparameter", "optimization", "auto-tuning", "neural-architecture-search"]
summary: "超参数优化是模型训练中最具经验性的环节——从网格搜索到贝叶斯优化，从手动调参到自动化，系统解析超参数优化的方法论。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Hyperparameter Optimization"
  - "Hyperparameter Tuning"
  - Hyperparameter_Tuning
sources: []

---
# 超参数优化完全指南 (Hyperparameter Optimization Complete Guide)

> 超参数优化是模型训练中最具经验性的环节——从网格搜索到贝叶斯优化，从手动调参到自动化，系统解析超参数优化的方法论。

---

## 1. 概述 (Overview)

超参数（Hyperparameter）是在训练开始前设定的参数，不能通过梯度下降学习。超参数的选择对模型性能有巨大影响——同样的模型架构，不同的超参数可能导致准确率相差 10% 以上。

### 超参数 vs 模型参数

| 维度 | 模型参数 | 超参数 |
|------|---------|--------|
| **设定方式** | 通过训练学习 | 人工/自动设定 |
| **示例** | 权重、偏置 | 学习率、批大小、层数 |
| **数量** | 百万-万亿 | 几个-几十个 |
| **优化方法** | 梯度下降 | 搜索算法 |

### 常见超参数分类

```
优化超参数:
  - 学习率 (learning_rate)
  - 批大小 (batch_size)
  - 优化器选择 (optimizer)
  - 权重衰减 (weight_decay)
  - 梯度裁剪 (max_grad_norm)

架构超参数:
  - 层数 (num_layers)
  - 隐藏维度 (hidden_size)
  - 注意力头数 (num_heads)
  - Dropout 率 (dropout)

训练超参数:
  - 训练轮数 (num_epochs)
  - 学习率调度 (scheduler)
  - 预热步数 (warmup_steps)
  - 早停耐心值 (patience)
```

---

## 2. 搜索方法 (Search Methods)

### 2.1 网格搜索 (Grid Search)

```
穷举所有超参数组合:

学习率: [0.001, 0.01, 0.1]
批大小: [32, 64, 128]
→ 3 × 3 = 9 种组合

优点: 简单、完整覆盖
缺点: 指数级增长、无法利用先验知识

适用: 超参数数量少 (≤3)、每个超参数取值少
```

### 2.2 随机搜索 (Random Search)

```
随机采样超参数组合:

  for i in range(n_trials):
      lr = sample_from_distribution(log_uniform(1e-5, 1e-1))
      bs = sample_from_distribution(choice([32, 64, 128, 256]))
      train_and_evaluate(lr, bs)

优点: 
  - 更高效 (Bergstra & Bengio 2012)
  - 可以并行
  - 容易实现

缺点: 
  - 不利用历史结果
  - 可能浪费资源在差的区域

适用: 超参数数量多、搜索空间大
```

### 2.3 贝叶斯优化 (Bayesian Optimization)

```
核心思想: 用代理模型建模超参数-性能关系，智能选择下一组超参数

循环:
  1. 代理模型预测各超参数组合的性能
  2. 采集函数选择最"有希望"的组合
  3. 评估该组合，更新代理模型
  4. 重复

代理模型:
  - 高斯过程 (GP): 传统方法，计算成本高
  - 随机森林: 更适合离散超参数
  - TPE (Tree-structured Parzen Estimator): Hyperopt 使用
  - 神经网络: 最灵活

采集函数:
  - Expected Improvement (EI)
  - Upper Confidence Bound (UCB)
  - Probability of Improvement (PI)

工具:
  - Optuna: 最流行的超参数优化框架
  - Hyperopt: Python 库
  - BayesianOptimization: 简洁的 GP 优化
```

### 2.4 进化算法 (Evolutionary Algorithms)

```
模拟自然选择:

  1. 初始化种群 (随机超参数组合)
  2. 评估适应度 (验证集性能)
  3. 选择优秀个体
  4. 交叉 (组合优秀超参数)
  5. 变异 (随机扰动)
  6. 重复

代表: CMA-ES, NSGA-II, PBT

优势: 
  - 可以优化多个目标
  - 不需要梯度
  - 适合非连续搜索空间
```

### 2.5 种群训练 (Population Based Training, PBT)

```
DeepMind 提出，结合训练和超参数搜索:

  1. 并行训练 N 个模型 (不同超参数)
  2. 定期评估性能
  3. 复制优秀模型的权重和超参数
  4. 变异超参数，继续训练
  
优势: 
  - 超参数随训练过程自适应调整
  - 不需要额外的搜索阶段
  - 计算效率高

应用: AlphaStar, 大规模 LLM 训练
```

---

## 3. LLM 训练超参数 (LLM Training Hyperparameters)

### 3.1 关键超参数

```
学习率 (Learning Rate):
  - 典型范围: 1e-5 ~ 3e-4
  - 小模型 (1B): 3e-4
  - 中模型 (7B): 1e-4 ~ 2e-4
  - 大模型 (70B): 5e-5 ~ 1.5e-5
  
  调度策略:
  - Cosine decay: 最常用
  - WSD (Warmup-Stable-Decay): 新趋势

批大小 (Batch Size):
  - 以 token 数计算 (不是样本数)
  - 典型: 2M ~ 30M tokens per step
  - 小模型: 2-4M tokens
  - 大模型: 4-30M tokens

权重衰减 (Weight Decay):
  - 典型值: 0.01 ~ 0.1
  - LLM: 通常 0.1

梯度裁剪 (Gradient Clipping):
  - 典型值: 1.0
  - 防止梯度爆炸
```

### 3.2 微调超参数

```
LoRA 微调:
  - 学习率: 1e-4 ~ 3e-4 (比全参微调大)
  - rank: 8-64 (任务越复杂越大)
  - alpha: 16-128 (通常是 rank 的 2 倍)
  - dropout: 0.05-0.1

全参微调:
  - 学习率: 1e-5 ~ 5e-5
  - 批大小: 根据 GPU 内存调整
  - 梯度累积: 有效批大小 = 批大小 × 累积步数

SFT (指令微调):
  - 学习率: 1e-5 ~ 2e-5
  - 训练轮数: 1-3 (避免过拟合)
  - 最大序列长度: 2048-8192

RLHF/DPO:
  - 学习率: 5e-7 ~ 5e-6
  - beta (DPO): 0.1-0.5
  - 训练步数: 100-1000
```

---

## 4. 实用工具 (Practical Tools)

### 4.1 Optuna

```python
import optuna

def objective(trial):
    lr = trial.suggest_float("lr", 1e-5, 1e-1, log=True)
    batch_size = trial.suggest_categorical("batch_size", [32, 64, 128])
    num_layers = trial.suggest_int("num_layers", 2, 8)
    dropout = trial.suggest_float("dropout", 0.0, 0.5)
    
    model = build_model(num_layers, dropout)
    accuracy = train_and_evaluate(model, lr, batch_size)
    return accuracy

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=100)

print(f"Best trial: {study.best_trial.params}")
```

### 4.2 Weights & Biases Sweeps

```yaml
# sweep_config.yaml
program: train.py
method: bayes
metric:
  name: val_accuracy
  goal: maximize
parameters:
  learning_rate:
    min: 0.0001
    max: 0.01
  batch_size:
    values: [32, 64, 128]
  num_layers:
    values: [3, 5, 7]
```

### 4.3 Ray Tune

```python
from ray import tune

config = {
    "lr": tune.loguniform(1e-5, 1e-1),
    "batch_size": tune.choice([32, 64, 128]),
}

analysis = tune.run(
    train_fn,
    config=config,
    num_samples=100,
    scheduler=ASHAScheduler(metric="val_loss", mode="min"),
)

print(f"Best config: {analysis.best_config}")
```

---

## 5. 最佳实践 (Best Practices)

### 5.1 搜索策略选择

```
资源有限?
├── 手动调参 → 基于经验快速迭代
├── 随机搜索 → 50-100 次试验
├── 贝叶斯优化 → 20-50 次试验
└── PBT → 大规模训练

超参数数量?
├── 1-3 个 → 网格搜索或手动
├── 4-10 个 → 随机搜索或贝叶斯
└── 10+ 个 → 贝叶斯优化或进化算法
```

### 5.2 常见陷阱

```
1. 搜索空间太大
   → 缩小范围，基于先验知识

2. 评估噪声太大
   → 增加验证集大小，多次评估取平均

3. 过拟合验证集
   → 使用交叉验证，保留独立测试集

4. 忽略计算成本
   → 使用早停、低保真度评估

5. 不记录实验
   → 使用 W&B/MLflow 跟踪所有实验
```

---

## 相关阅读

- [[07_模型训练/03_Optimization/Optimization]] — 训练优化
- [[07_模型训练/03_Optimization/Training_Optimization_2026]] — 训练优化 2026
- [[07_模型训练/03_Optimization/Scaling_Laws_and_Training_Dynamics]] — 缩放定律
- [[07_模型训练/03_Optimization/Mixed_Precision_Training]] — 混合精度训练
- [[11_模型运维/04_Experiment_Tracking/index]] — 实验跟踪
- [[02_机器学习/11_AutoML/AutoML]] — AutoML
