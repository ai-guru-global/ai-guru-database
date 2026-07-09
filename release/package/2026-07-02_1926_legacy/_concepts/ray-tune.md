---
title: "Ray Tune 分布式超参数调优 (Ray Tune Hyperparameter Tuning)"
category: -concepts
tags: ["ray-tune", "hyperparameter-tuning", "distributed", "ray", "bayesian-optimization"]
relationships:
  - target: "_concepts/mlflow"
    type: related_to
  - target: "_concepts/wandb"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Ray Tune 是基于 Ray 的分布式超参数调优框架——支持 Bayesian Optimization、HyperBand、PBT 等先进算法，可分布式并行搜索超参数空间。是大规模 ML 调优的标准工具。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: stable
tier: supporting
---

# Ray Tune 分布式超参数调优

> **一句话理解**: Ray Tune 是"超参数搜索的分布式引擎"——在多 GPU/多机器上并行搜索最优超参数，支持贝叶斯优化、早停、群体进化等先进算法。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **所属生态** | Ray (Anyscale) |
| **开源协议** | Apache 2.0 |
| **GitHub** | 35K+ ⭐ (Ray 仓库) |
| **核心价值** | 分布式超参数搜索 |
| **搜索算法** | Bayesian / HyperBand / PBT / BOHB |

---

## 2. 核心概念

```
┌─────────────────────────────────────────┐
│          Ray Tune 工作流程              │
├─────────────────────────────────────────┤
│                                         │
│  1. 定义搜索空间                        │
│     ├── Grid Search (网格)              │
│     ├── Random Search (随机)            │
│     └── Bayesian (贝叶斯优化)           │
│                                         │
│  2. 选择调度器                          │
│     ├── FIFO (先进先出)                 │
│     ├── ASHA (异步早停)                 │
│     ├── HyperBand (资源感知早停)        │
│     └── PBT (群体训练)                  │
│                                         │
│  3. 分布式执行                          │
│     ├── 多 GPU 并行试验                 │
│     ├── 多机器分布式                    │
│     └── 自动资源调度                    │
│                                         │
│  4. 结果分析                            │
│     ├── 最优配置                        │
│     ├── 学习曲线                        │
│     └── 超参数重要性                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 核心用法

### 3.1 基础搜索

```python
from ray import tune, train
from ray.tune.schedulers import ASHAScheduler

# 定义训练函数
def train_fn(config):
    model = build_model(
        lr=config["learning_rate"],
        hidden_size=config["hidden_size"],
    )
    for epoch in range(50):
        loss = train_step(model)
        acc = evaluate(model)
        train.report({"loss": loss, "accuracy": acc})

# 定义搜索空间
search_space = {
    "learning_rate": tune.loguniform(1e-5, 1e-2),
    "hidden_size": tune.choice([128, 256, 512, 1024]),
    "batch_size": tune.choice([16, 32, 64]),
    "dropout": tune.uniform(0.1, 0.5),
}

# 运行调优
tuner = tune.Tuner(
    train_fn,
    param_space=search_space,
    tune_config=tune.TuneConfig(
        num_samples=50,        # 50 个试验
        scheduler=ASHAScheduler(
            max_t=50,
            grace_period=10,
            reduction_factor=3,
        ),
        metric="accuracy",
        mode="max",
    ),
    run_config=train.RunConfig(
        resources_per_trial={"gpu": 1},
    ),
)

results = tuner.fit()
best_result = results.get_best_result("accuracy", "max")
print(f"最优配置: {best_result.config}")
print(f"最优精度: {best_result.metrics['accuracy']}")
```

### 3.2 LLM 微调超参搜索

```python
# 与 HuggingFace + PEFT 集成
search_space = {
    "learning_rate": tune.loguniform(1e-5, 5e-4),
    "lora_r": tune.choice([8, 16, 32, 64]),
    "lora_alpha": tune.choice([16, 32, 64, 128]),
    "warmup_ratio": tune.uniform(0.0, 0.1),
}

# 分布式搜索: 4 GPU 同时跑 4 个试验
run_config = train.RunConfig(
    resources_per_trial={"gpu": 1},
    num_samples=32,  # 总共 32 个试验
)
```

---

## 4. 搜索算法对比

| 算法 | 原理 | 效率 | 适用场景 |
|------|------|:---:|---------|
| **Grid** | 穷举所有组合 | 低 | 参数少、离散 |
| **Random** | 随机采样 | 中 | 通用基线 |
| **Bayesian** | 贝叶斯优化 | 高 | 连续参数 |
| **HyperBand** | 资源感知早停 | 很高 | 参数多 |
| **BOHB** | Bayesian + HyperBand | 最高 | 大规模搜索 |
| **PBT** | 群体进化训练 | 高 | 长训练 |

---

## 5. 与 W&B Sweeps 对比

| 特性 | Ray Tune | W&B Sweeps |
|------|----------|-----------|
| **分布式** | ★★★★★ 原生 | ★★★★☆ |
| **搜索算法** | 更丰富 (PBT, BOHB) | Bayesian |
| **资源调度** | ★★★★★ 精细 | 基础 |
| **可视化** | ★★★☆☆ | ★★★★★ |
| **与训练集成** | 需要适配 | 简单 |
| **成本** | 免费 | 免费 (有额度限制) |

---

## 6. 关键要点

1. **分布式原生**：基于 Ray，天然支持多 GPU/多机器分布式搜索
2. **算法丰富**：从 Grid Search 到 PBT/BOHB，覆盖各种搜索需求
3. **早停机制**：ASHA/HyperBand 自动停止不好的试验，节省资源
4. **LLM 调优**：可用于搜索 LoRA rank、学习率、warmup 等 LLM 微调超参数
5. **Ray 生态**：与 Ray Train、Ray Serve 等组件无缝集成
6. **开源免费**：Apache 2.0，Anyscale 提供商业托管版本
