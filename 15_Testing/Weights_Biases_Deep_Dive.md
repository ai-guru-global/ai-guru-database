# Weights & Biases: ML 实验追踪平台

> **一句话理解**: Weights & Biases (W&B) 是 ML 实验追踪平台——参数记录、可视化、协作、模型管理，AI 研究者的实验瑞士军刀。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Weights & Biases: ML 实验追踪平台
═══════════════════════════════════════════════════════════════════

定位: 面向 ML 研究的实验追踪和可视化平台，专注易用性和协作

核心理念:
───────────────────────────────────────────────────────────────────
• 极简: 一行代码接入
• 协作: 团队共享实验
• 可视化: 丰富的指标图表
• 管理: 模型版本化管理
• 自动化: AutoML 集成
• 云服务: SaaS 或自托管
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **实验追踪** | 参数、指标、日志 |
| **可视化** | 实时图表、对比 |
| **协作** | 团队共享、评论 |
| **模型管理** | 版本、注册表 |
| **AutoML** | 超参数优化 |
| **Alert** | 异常警报 |

### 1.3 支持框架

| 框架 | 支持 |
|------|------|
| PyTorch | ⭐⭐⭐⭐⭐ 原生 |
| TensorFlow | ⭐⭐⭐⭐⭐ 原生 |
| JAX | ⭐⭐⭐⭐⭐ 原生 |
| Scikit-learn | ⭐⭐⭐⭐ 原生 |
| LangChain | ⭐⭐⭐⭐ 支持 |
| HuggingFace | ⭐⭐⭐⭐⭐ 集成 |

---

## 2. 核心概念

### 2.1 项目结构

```
W&B Project Structure
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        W&B 项目结构                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Project: "llm-experiments"                                      │
│  │                                                                  │
│  ├── Runs:                                                       │
│  │     ├── run_001: train.py lr=0.001                           │
│  │     ├── run_002: train.py lr=0.01                            │
│  │     └── run_003: train.py lr=0.0001                         │
│  │                                                                  │
│  ├── Reports:                                                    │
│  │     └── "Learning Rate Comparison"                           │
│  │                                                                  │
│  └── Models:                                                     │
│        └── "best_model:v3"                                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 核心概念

| 概念 | 说明 |
|------|------|
| **Run** | 一次实验运行 |
| **Project** | 项目组 |
| **Sweep** | 超参数搜索 |
| **Report** | 实验报告 |
| **Model** | 模型注册 |

---

## 3. 架构设计

### 3.1 系统架构

```
W&B 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        W&B 架构                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              W&B Python SDK                               │   │
│   │  wandb.init()                                          │   │
│   │  wandb.log({"loss": 0.5})                              │   │
│   │  wandb.watch(model)                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              W&B Server (Cloud / On-prem)                │   │
│   │  • Run Storage                                           │   │
│   │  • Artifact Store                                       │   │
│   │  • Metrics DB                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Web Dashboard                                │   │
│   │  • Run Comparison                                       │   │
│   │  • Charts                                              │   │
│   │  • Reports                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install wandb
```

### 4.2 基础使用

```python
import wandb
import random

# 登录
wandb.login()

# 初始化
wandb.init(
    project="my-first-project",
    name="experiment-001",
    config={
        "learning_rate": 0.001,
        "epochs": 100,
        "batch_size": 32
    }
)

# 训练循环
for epoch in range(100):
    loss = random.random() * (1 - epoch/100)  # 模拟训练
    accuracy = 1 - loss + random.random() * 0.1

    # 记录指标
    wandb.log({
        "epoch": epoch,
        "loss": loss,
        "accuracy": accuracy
    })

wandb.finish()
```

### 4.3 PyTorch 集成

```python
import torch
import wandb

wandb.init(project="pytorch-experiments")

# 创建模型
model = MyModel()
wandb.watch(model, log="parameters")

optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

for epoch in range(100):
    # 训练...
    loss = train_step()

    wandb.log({"loss": loss, "epoch": epoch})
```

### 4.4 查看结果

```bash
# 启动本地 UI
wandb server start

# 访问 http://localhost:8080
```

---

## 5. 高级特性

### 5.1 Sweep 超参数搜索

```python
# sweep.yaml
method: bayes
metric:
  name: val_loss
  goal: minimize
parameters:
  learning_rate:
    min: 0.0001
    max: 0.1
    distribution: log_uniform
  batch_size:
    values: [16, 32, 64, 128]
  optimizer:
    values: ["adam", "sgd"]
```

```bash
# 启动 sweep
wandb sweep sweep.yaml
wandb agent <sweep_id>
```

### 5.2 模型管理

```python
# 保存模型
wandb.save("model.pt")

# 或使用 Artifact
artifact = wandb.Artifact("my-model", type="model")
artifact.add_file("model.pt")
wandb.log_artifact(artifact)

# 加载模型
artifact = run.use_artifact("my-model:v0")
model = torch.load(artifact.download())
```

### 5.3 团队协作

```python
# 分享 Report
wandb.init(project="team-project", entity="my-team")

# 添加评论
run.comment("This experiment shows promising results!")

# 创建 Report
report = wandb.compose(
    "Training Results",
    sections=[
        "# Experiment Summary",
        "## Key Findings",
        "## Next Steps"
    ]
)
```

---

## 6. 对比与选择

### 6.1 实验追踪平台对比

| 维度 | W&B | MLflow | Neptune |
|------|-----|--------|---------|
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **可视化** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **协作** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **免费额度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **自托管** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 研究团队 | W&B |
| 自托管 | MLflow |
| 轻量级 | Neptune |
| 成本敏感 | MLflow |

---

## 参考资源

- [W&B GitHub](https://github.com/wandb/wandb)
- [W&B 文档](https://docs.wandb.ai/)
- [W&B Papers](https://wandb.ai/papers)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*
