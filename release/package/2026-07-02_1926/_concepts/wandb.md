---
title: "Weights & Biases 实验追踪 (Weights & Biases / W&B)"
category: -concepts
tags: ["wandb", "weights-and-biases", "experiment-tracking", "visualization", "sweeps"]
relationships:
  - target: "_concepts/mlflow"
    type: related_to
  - target: "_concepts/agent-evaluation"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Weights & Biases (W&B) 是最流行的 ML 实验追踪和可视化平台——以精美的仪表盘、强大的可视化和 Sweeps 超参搜索著称。是 AI 研究领域的首选实验管理工具。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: reviewed
tier: core
---

# Weights & Biases 实验追踪

> **一句话理解**: W&B 是"ML 实验的仪表盘"——精美的可视化、实时的训练曲线、一键对比实验结果，研究者最爱的实验追踪工具。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **全称** | Weights & Biases (W&B) |
| **类型** | 云服务 (SaaS) + 开源客户端 |
| **GitHub** | 9K+ ⭐ (客户端) |
| **核心价值** | 实验追踪 + 可视化 + 超参搜索 |
| **用户** | 研究团队、AI 实验室、企业 ML 团队 |

---

## 2. 核心功能

```
┌─────────────────────────────────────────┐
│          W&B 功能全景                   │
├─────────────────────────────────────────┤
│                                         │
│  1. Experiments（实验追踪）             │
│     ├── 参数/指标自动记录              │
│     ├── 系统资源监控 (GPU/CPU/内存)    │
│     ├── 代码版本追踪                    │
│     └── 实时仪表盘                      │
│                                         │
│  2. Sweeps（超参搜索）                  │
│     ├── Grid / Random / Bayesian        │
│     ├── 分布式并行搜索                  │
│     └── Early Stopping                  │
│                                         │
│  3. Tables（数据分析）                  │
│     ├── 交互式数据表                    │
│     ├── 可视化分析                      │
│     └── 预测对比                        │
│                                         │
│  4. Models（模型管理）                  │
│     ├── 模型版本追踪                    │
│     └── 模型注册表                      │
│                                         │
│  5. Weave（LLM 专属）                   │
│     ├── LLM 调用追踪                    │
│     ├── Prompt 版本管理                │
│     └── LLM 评估                        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 核心用法

### 3.1 基础追踪

```python
import wandb

# 初始化实验
run = wandb.init(
    project="llm-fine-tuning",
    name="lora-r16-lr2e4",
    config={
        "model": "Llama-3-8B",
        "lora_r": 16,
        "learning_rate": 2e-4,
        "batch_size": 4,
    }
)

# 训练中记录指标
for step, (loss, acc) in enumerate(training_loop):
    wandb.log({
        "train/loss": loss,
        "train/accuracy": acc,
        "step": step,
    })

# 记录模型
wandb.save("model.safetensors")
run.finish()
```

### 3.2 Sweeps 超参搜索

```python
# 定义搜索空间
sweep_config = {
    "method": "bayes",
    "metric": {"name": "val_loss", "goal": "minimize"},
    "parameters": {
        "learning_rate": {"min": 1e-5, "max": 1e-3, "distribution": "log_uniform"},
        "lora_r": {"values": [8, 16, 32, 64]},
        "batch_size": {"values": [2, 4, 8]},
    }
}

sweep_id = wandb.sweep(sweep_config, project="llm-fine-tuning")
wandb.agent(sweep_id, function=train_fn, count=50)
```

---

## 4. 与 MLflow 对比

| 特性 | W&B | MLflow |
|------|-----|--------|
| **可视化** | ★★★★★ 极强 | ★★★☆☆ 基础 |
| **开源程度** | 客户端开源 | 全栈开源 |
| **自托管** | ❌ 企业版才有 | ✅ 免费自托管 |
| **超参搜索** | ★★★★★ Sweeps | ★★☆☆☆ |
| **模型部署** | ❌ | ✅ 内置 |
| **协作** | ★★★★★ | ★★★☆☆ |
| **学习曲线** | 低 | 低 |
| **免费额度** | 有限（学术免费） | 完全免费 |

---

## 5. AI Stack 中的定位

```
┌─────────────────────────────────────────┐
│     ML 实验追踪选型                     │
├─────────────────────────────────────────┤
│                                         │
│  W&B     ← 研究首选、可视化最强 ★      │
│  MLflow  ← 企业标配、开源全栈          │
│  Neptune ← 轻量级、团队协作             │
│  Comet   ← 全功能、Opik 母公司          │
│  TensorBoard ← 免费基础                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. 关键要点

1. **可视化标杆**：训练曲线、超参搜索、模型对比的可视化业界最佳
2. **研究生态**：OpenAI、Anthropic、DeepMind 等顶级实验室都在使用
3. **Sweeps 强大**：贝叶斯优化的超参搜索，分布式并行
4. **Weave (LLM)**：新推出的 LLM 专属追踪，对标 LangSmith
5. **闭源服务端**：数据存在 W&B 云端，企业版支持私有部署
6. **学术免费**：学术和个人项目免费使用，门槛极低
