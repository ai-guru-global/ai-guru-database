---
title: '实验追踪深度解析 (Experiment Tracking Deep Dive)'
category: '11-mlops-pipeline'
tags: ["mlops", "ci-cd", "pipeline", "feature-store"]
summary: '> **一句话理解**: 实验追踪就像 AI 的"实验日记本"——自动记录每次训练的配方（参数）、结果（指标）和成品（模型），让你再也不用问"那个效果最好的模型是怎么训出来的？"'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Experiment Tracking Deep Dive"
  - Experiment_Tracking_Deep_Dive
sources: []

---
# 实验追踪深度解析 (Experiment Tracking Deep Dive)

> **一句话理解**: 实验追踪就像 AI 的"实验日记本"——自动记录每次训练的配方（参数）、结果（指标）和成品（模型），让你再也不用问"那个效果最好的模型是怎么训出来的？"

---

## 1. 概述

### 为什么需要实验追踪？

| 没有实验追踪 | 有实验追踪 |
|-------------|-----------|
| "上次那个 92% 的模型是怎么训的？" | 一键查看实验 #47 的所有参数和指标 |
| Excel 表格手动记录超参数 | 自动记录，零人工干预 |
| 模型文件 `model_v3_final_final_best.pkl` | 语义化版本管理，完整的模型血缘 |
| 无法复现"运气好"的那次实验 | 环境依赖+随机种子+数据版本，精确复现 |
| 团队成员各自为战 | 共享实验结果，协作分析 |

### 实验追踪的核心要素

```
一次完整的实验记录:

┌─────────────────────────────────────────────┐
│              Experiment #47                  │
├─────────────────────────────────────────────┤
│ 📋 超参数 (Parameters)                       │
│   ├── model: ResNet-50                      │
│   ├── learning_rate: 0.001                  │
│   ├── batch_size: 64                        │
│   ├── optimizer: Adam                       │
│   └── epochs: 100                           │
│                                              │
│ 📊 指标 (Metrics)                            │
│   ├── accuracy: 0.9234                      │
│   ├── f1_score: 0.9102                      │
│   ├── val_loss: 0.0823                      │
│   └── training_time: 2h 34min              │
│                                              │
│ 📦 工件 (Artifacts)                          │
│   ├── model_weights.pkl (247MB)            │
│   ├── confusion_matrix.png                │
│   └── training_log.txt                     │
│                                              │
│ 🏷️ 元数据 (Metadata)                         │
│   ├── git_commit: abc123                   │
│   ├── data_version: v2.3                   │
│   ├── python: 3.11                         │
│   └── GPU: A100 x 2                        │
└─────────────────────────────────────────────┘
```

---

## 2. MLflow 深度指南

### 2.1 架构

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│  MLflow Client│────►│  Tracking Server │────►│  Backend Store │
│  (Python SDK) │     │  (REST API)      │     │  (SQL/File)    │
└──────────────┘     └──────────────────┘     └────────────────┘
                                                     │
                                              ┌──────┴──────┐
                                              │ Artifact Store│
                                              │ (S3/GCS/Local)│
                                              └─────────────┘
```

### 2.2 实验跟踪

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, classification_report

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("fraud_detection_v2")

with mlflow.start_run(run_name="rf_tuned_v3"):
    params = {
        "n_estimators": 500,
        "max_depth": 15,
        "min_samples_split": 5,
        "min_samples_leaf": 2,
        "class_weight": "balanced",
        "random_state": 42,
    }
    mlflow.log_params(params)

    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "f1_score": f1_score(y_test, y_pred, average="weighted"),
        "precision": precision_score(y_test, y_pred, average="weighted"),
        "recall": recall_score(y_test, y_pred, average="weighted"),
    }
    mlflow.log_metrics(metrics)

    for step in range(1, params["n_estimators"] + 1, 50):
        intermediate_model = RandomForestClassifier(
            n_estimators=step, max_depth=params["max_depth"], random_state=42
        )
        intermediate_model.fit(X_train, y_train)
        step_score = intermediate_model.score(X_test, y_test)
        mlflow.log_metric("val_accuracy_step", step_score, step=step)

    mlflow.sklearn.log_model(
        model,
        "model",
        input_example=X_test[:5],
        signature=mlflow.models.infer_signature(X_test, y_pred),
    )

    mlflow.log_artifact("confusion_matrix.png")
    mlflow.log_artifact("classification_report.txt")

    print(f"Run ID: {mlflow.active_run().info.run_id}")
    print(f"Metrics: {metrics}")
```

### 2.3 模型注册中心

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

run_id = mlflow.active_run().info.run_id
model_uri = f"runs:/{run_id}/model"

result = mlflow.register_model(model_uri, "fraud_detection_model")
print(f"Registered model version: {result.version}")

client.transition_model_version_stage(
    name="fraud_detection_model",
    version=result.version,
    stage="Staging",
)

client.transition_model_version_stage(
    name="fraud_detection_model",
    version=result.version,
    stage="Production",
    archive_existing_versions=True,
)

client.update_model_version(
    name="fraud_detection_model",
    version=result.version,
    description="Improved recall on minority class from 72% to 89%",
)

production_model = mlflow.pyfunc.load_model(
    model_uri="models:/fraud_detection_model/Production"
)
predictions = production_model.predict(new_data)
```

### 2.4 MLflow Projects

```yaml
name: fraud_detection
conda_env: conda.yaml
entry_points:
  main:
    parameters:
      n_estimators: {type: int, default: 200}
      max_depth: {type: int, default: 10}
      data_path: {type: string, default: "data/train.csv"}
    command: "python train.py --n_estimators {n_estimators} --max_depth {max_depth} --data {data_path}"
  hyperopt:
    parameters:
      max_evals: {type: int, default: 50}
    command: "python hyperopt_search.py --max_evals {max_evals}"
```

### 2.5 MLflow 搜索与对比

```python
runs = mlflow.search_runs(
    experiment_names=["fraud_detection_v2"],
    filter_string="metrics.f1_score > 0.90",
    order_by=["metrics.f1_score DESC"],
    max_results=10,
)

print(runs``[ ["run_id", "metrics.f1_score", "params.n_estimators", "params.max_depth"] ]``)
```

---

## 3. Weights & Biases (W&B) 深度指南

### 3.1 核心概念

| 概念 | 说明 | MLflow 对应 |
|------|------|------------|
| **Project** | 项目级别的实验集合 | Experiment |
| **Run** | 一次实验运行 | Run |
| **Sweep** | 超参数搜索 | 需外部工具 |
| **Artifact** | 版本化的文件 | Artifact |
| **Report** | 可视化报告 | 无直接对应 |

### 3.2 基础追踪

```python
import wandb

wandb.init(
    project="fraud-detection",
    name="rf-tuned-v3",
    config={
        "model": "RandomForest",
        "n_estimators": 500,
        "max_depth": 15,
        "min_samples_split": 5,
        "class_weight": "balanced",
        "dataset": "credit_card_transactions_v2",
        "train_size": 80000,
        "test_size": 20000,
    },
    tags=["baseline", "balanced-weights"],
)

model = RandomForestClassifier(**wandb.config)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
wandb.log({
    "accuracy": accuracy_score(y_test, y_pred),
    "f1_score": f1_score(y_test, y_pred),
    "confusion_matrix": wandb.plot.confusion_matrix(
        probs=None, y_true=y_test, preds=y_pred, class_names=["Normal", "Fraud"]
    ),
})

wandb.finish()
```

### 3.3 训练循环集成

```python
import wandb
import torch

wandb.init(project="image-classification", config={
    "epochs": 50,
    "batch_size": 128,
    "learning_rate": 0.001,
    "model": "ResNet-50",
})

config = wandb.config

for epoch in range(config.epochs):
    model.train()
    train_loss = 0
    correct = 0
    total = 0

    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        train_loss += loss.item()
        _, predicted = output.max(1)
        total += target.size(0)
        correct += predicted.eq(target).sum().item()

        if batch_idx % 50 == 0:
            wandb.log({
                "batch_loss": loss.item(),
                "batch_accuracy": 100.0 * correct / total,
                "epoch": epoch,
                "batch": batch_idx,
            })

    val_loss, val_acc = validate(model, val_loader)

    wandb.log({
        "epoch_train_loss": train_loss / len(train_loader),
        "epoch_train_acc": 100.0 * correct / total,
        "epoch_val_loss": val_loss,
        "epoch_val_acc": val_acc,
        "epoch": epoch,
        "learning_rate": optimizer.param_groups[0]["lr"],
    })

    scheduler.step()

wandb.finish()
```

### 3.4 W&B Sweeps（超参数搜索）

```python
sweep_config = {
    "method": "bayes",
    "metric": {"name": "epoch_val_acc", "goal": "maximize"},
    "parameters": {
        "learning_rate": {
            "min": 0.0001,
            "max": 0.01,
            "distribution": "log_uniform",
        },
        "batch_size": {"values": [32, 64, 128, 256]},
        "optimizer": {"values": ["adam", "sgd", "adamw"]},
        "weight_decay": {"min": 0.0, "max": 0.1},
        "dropout": {"min": 0.1, "max": 0.5},
    },
    "early_terminate": {
        "type": "hyperband",
        "min_iter": 10,
        "eta": 2,
    },
}

sweep_id = wandb.sweep(sweep_config, project="image-classification")

def train():
    wandb.init()
    config = wandb.config
    model = build_model(config)
    for epoch in range(50):
        train_one_epoch(model, config)
        val_acc = validate(model)
        wandb.log({"epoch_val_acc": val_acc, "epoch": epoch})

wandb.agent(sweep_id, function=train, count=50)
```

### 3.5 W&B Artifacts

```python
with wandb.init(project="fraud-detection", job_type="training") as run:
    dataset_artifact = run.use_artifact("fraud-detection/train_data:v2")
    data_dir = dataset_artifact.download()

    model_artifact = wandb.Artifact(
        name="fraud-model",
        type="model",
        description="RandomForest v3 with balanced weights",
        metadata={"f1_score": 0.91, "accuracy": 0.93},
    )
    model_artifact.add_file("model.pkl")
    model_artifact.add_file("feature_importance.png")
    run.log_artifact(model_artifact)
```

---

## 4. Neptune.ai

### 4.1 基础用法

```python
import neptune

run = neptune.init_run(
    project="workspace/fraud-detection",
    tags=["random-forest", "balanced"],
)

run["parameters"] = {
    "n_estimators": 500,
    "max_depth": 15,
    "class_weight": "balanced",
}

model = RandomForestClassifier(n_estimators=500, max_depth=15)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
run["metrics/accuracy"] = accuracy_score(y_test, y_pred)
run["metrics/f1_score"] = f1_score(y_test, y_pred)

run["confusion_matrix"].upload("confusion_matrix.png")

for threshold in [0.3, 0.4, 0.5, 0.6, 0.7]:
    y_pred_t = (model.predict_proba(X_test)[:, 1] > threshold).astype(int)
    f1 = f1_score(y_test, y_pred_t)
    run["threshold_search/threshold"].append(threshold)
    run["threshold_search/f1"].append(f1)

run.stop()
```

---

## 5. 工具对比

### 5.1 全面对比

| 维度 | MLflow | W&B | Neptune |
|------|--------|-----|---------|
| **开源** | 是 | 部分 | 部分 |
| **自托管** | 支持 | 不支持 | 支持 |
| **定价** | 免费（自托管） | 按用户/团队 | 按使用量 |
| **UI 质量** | 良好 | 优秀 | 优秀 |
| **超参数搜索** | 需外部工具 | 内置 Sweeps | 需外部工具 |
| **团队协作** | 基本 | 强（Reports） | 强 |
| **Artifact 管理** | 支持 | 支持 | 支持 |
| **模型注册** | 内置 | 内置 | 内置 |
| **视频/音频** | 不支持 | 支持 | 支持 |
| **报警通知** | 不支持 | Slack/Webhook | Slack/Webhook |
| **多语言** | Python, R, Java | Python, Swift | Python, R, Java |
| **部署难度** | 低 | 无需部署 | 低 |

### 5.2 选型建议

| 场景 | 推荐工具 | 理由 |
|------|---------|------|
| **个人/小团队** | MLflow | 免费自托管，功能完整 |
| **重度可视化需求** | W&B | UI 最强，报告功能好 |
| **企业合规要求** | Neptune | 灵活部署，细粒度权限 |
| **学术研究** | W&B | 论文图表直接导出 |
| **大规模生产** | MLflow | 与基础设施集成好 |

---

## 6. 最佳实践

### 6.1 实验命名规范

```
推荐格式: <模型>_<数据集>_<关键超参>_<日期>

示例:
  rf_credit_v2_n500_d15_20260518
  res50_imagenet_lr001_aug_20260518
  bert_sst2_epochs3_warmup01_20260518
```

### 6.2 该记录什么

| 必须记录 | 建议记录 | 可选记录 |
|---------|---------|---------|
| 超参数 | Git commit hash | 系统硬件信息 |
| 关键指标 | 数据集版本 | 代码 diff |
| 模型文件 | Python 包版本 | 完整环境快照 |
| 训练曲线 | 随机种子 | CPU/GPU 利用率 |

### 6.3 常见错误

```python
# ❌ 错误: 忘记记录关键超参数
model = RandomForestClassifier()
model.fit(X_train, y_train)

# ✅ 正确: 所有超参数都记录
params = {"n_estimators": 200, "max_depth": 10}
mlflow.log_params(params)
model = RandomForestClassifier(**params)
```

---

## 7. 面试高频问题

**Q1: MLflow 和 W&B 的核心区别？**
> MLflow 开源自托管，包含完整的 ML 生命周期管理（跟踪+项目+模型+注册）；W&B 侧重实验可视化和团队协作，UI 体验更好但为 SaaS 服务。选择取决于团队是否需要自托管和完整生命周期管理。

**Q2: 如何保证实验可复现？**
> 记录：(1) 代码版本（git commit），(2) 数据版本（DVC/hash），(3) 所有超参数和随机种子，(4) Python 环境依赖（requirements.txt），(5) 硬件信息。使用 `mlflow.projects` 或 Docker 封装运行环境。

---

## 工具实现（本章节）

本文讲实验追踪的**概念与选型**。具体工具的命令、配置、部署：

- [[MLflow_Deep_Dive]] — MLflow：开源 ML 生命周期管理
- [[ClearML_Deep_Dive]] — ClearML：一站式开源 ML 平台

---

## 8. 参考资源

- [MLflow 官方文档](https://mlflow.org/docs/latest/index.html)
- [W&B 官方文档](https://docs.wandb.ai/)
- [Neptune 官方文档](https://docs.neptune.ai/)
- [MLflow vs W&B vs Neptune 对比](https://neptune.ai/blog/mlflow-vs-weights-and-biases)

---

*Last updated: 2026-05-18*

## Related

- [[模型运维/Orchestration/Data_Pipeline_Orchestration.md|Data_Pipeline_Orchestration]]
- [[模型运维/MLOps-in-nutshell.md|MLOps-in-nutshell]]
- [[概念/mlops.md|mlops]]
