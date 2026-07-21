---
title: "Experiment Tracking (实验追踪)"
category: "概念"
tags: ["experiment-tracking", "mlops", "mlflow", "wandb", "reproducibility", "model-registry"]
summary: "Experiment Tracking 是 ML 工程化的基石——自动记录每次训练的参数、指标、产物和代码版本，使实验可复现、可对比、可审计。"
created: "2026-06-25"
updated: "2026-07-21"
tier: core
aliases:
  - "Experiment Tracking"
  - "实验追踪"
  - "实验管理"
sources: []

---
# Experiment Tracking (实验追踪)

> **一句话定义**: Experiment Tracking 自动记录 ML 实验中的一切（超参数、指标曲线、模型产物、数据集版本、代码 commit），让"上次效果好的那个参数是什么"不再需要人脑记忆。

---

## 为什么需要

| 没有实验追踪 | 有实验追踪 |
|------------|----------|
| "我记得 learning_rate 好像是 0.001…" | 精确记录每次实验的所有参数 |
| 无法复现 3 个月前的最佳模型 | 一键复现（参数 + 数据版本 + 代码） |
| 团队 A 和 B 重复跑了相同实验 | 全局搜索，避免重复 |
| 不知道哪个版本的模型在线上 | Model Registry 清晰管理 |

---

## 核心追踪内容

```
每次 Experiment Run 记录:
├── 参数 (Hyperparameters)
│   └── learning_rate, batch_size, epochs, model_type...
├── 指标 (Metrics)
│   └── loss curve, accuracy, f1, perplexity...
├── 产物 (Artifacts)
│   └── 模型权重, 评估报告, 可视化图表
├── 环境 (Environment)
│   └── Python 版本, 依赖版本, GPU 型号
├── 代码 (Code)
│   └── Git commit hash, 脚本快照
└── 数据 (Data)
    └── 数据集版本 (DVC hash), 数据摘要统计
```

---

## 主流工具

| 工具 | 开源 | 特点 | 适合场景 |
|------|------|------|---------|
| **MLflow** | ✅ | 最成熟，四大组件（Tracking/Projects/Models/Registry） | 通用 ML |
| **Weights & Biases** | 部分 | 最美观的可视化，Sweep 超参搜索 | 深度学习研究 |
| **Comet ML** | 商业 | 企业级，实验对比功能强大 | 大型团队 |
| **Neptune.ai** | 部分 | 轻量，团队协作好 | 中小团队 |
| **TensorBoard** | ✅ | Google 原生，与 TF/JAX 集成好 | TF 用户 |

---

## MLflow 核心概念

```
MLflow Tracking:
├── Experiment          # 一组相关的 Runs（如 "fraud-detection"）
│   ├── Run 1           # 一次实验（参数 + 指标 + 产物）
│   ├── Run 2
│   └── Run 3
├── Model Registry      # 模型版本管理（Staging → Production → Archived）
└── Tracking Server     # 远程服务器（共享实验结果）
```

```python
import mlflow

mlflow.set_tracking_uri("http://mlflow-server:5000")
mlflow.set_experiment("fraud-detection")

with mlflow.start_run():
    mlflow.log_param("learning_rate", 0.001)
    mlflow.log_param("model_type", "xgboost")

    # 训练...
    for epoch in range(10):
        loss = train_one_epoch()
        mlflow.log_metric("loss", loss, step=epoch)

    mlflow.log_artifact("model.pkl")
    mlflow.sklearn.log_model(model, "model",
                             registered_model_name="fraud-detector")
```

---

## LLM 时代的实验追踪

LLM 应用的"实验"与传统 ML 有本质区别：

| 维度 | 传统 ML 实验 | LLM 实验 |
|------|-----------|---------|
| 核心变量 | 超参数 | Prompt 模板 + 模型选择 |
| 评估指标 | Accuracy/F1 | Faithfulness / Safety / Relevance |
| 迭代方式 | 重训模型 | 改 Prompt / 换模型 / 调 RAG |
| 追踪工具 | MLflow / W&B | Langfuse / LangSmith / Promptfoo |

---

## Related

- [[模型运维/Experiment_Tracking/Experiment_Tracking_Deep_Dive]] — 实验追踪深度解析
- [[模型运维/Experiment_Tracking/MLflow_Deep_Dive]] — MLflow 深度解析
- [[概念/feature-store]] — Feature Store 概念
- [[概念/model-registry]] — Model Registry 概念

---

## 2026 实验追踪生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **MLflow Tracking** | 开源实验追踪 | GA |
| **Weights & Biases** | 云端实验追踪/可视化 | GA |
| **Neptune.ai** | 实验元数据管理 | GA |
| **Comet ML** | 实验对比/可视化 | GA |
| **TensorBoard** | TensorFlow 原生可视化 | GA |

## 生产最佳实践

1. **所有实验必追踪**：每次实验必须记录参数/指标/产物
2. **可复现性**：记录完整环境信息，支持复现
3. **实验对比**：用工具对比不同实验效果
4. **与 CI/CD 集成**：实验追踪集成到 CI/CD
5. **团队协作**：实验结果团队共享
