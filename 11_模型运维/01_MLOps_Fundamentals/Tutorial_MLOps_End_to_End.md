---
title: "MLOps 端到端教程：DVC + MLflow + GitHub Actions + Evidently"
category: "11-mlops-pipeline"
tags: ["tutorial", "mlops", "dvc", "mlflow", "github-actions", "evidently", "end-to-end"]
summary: "> **一句话理解**: 本教程带你从零搭建一条完整的 ML 流水线——用 DVC 管数据版本、MLflow 追踪实验、GitHub Actions 自动化 CI/CD、Evidently 监控数据漂移，全流程可复制。"
created: "2026-06-25"
updated: "2026-06-25"
tier: supporting
aliases:
  - "Tutorial MLOps End to End"
  - Tutorial_MLOps_End_to_End
sources: []

name_zh: "MLOps 端到端教程"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# MLOps 端到端教程

> 中文简称：MLOps 端到端教程

> **目标**: 从零构建一条生产级 ML 流水线，涵盖数据版本、实验追踪、自动化训练、模型注册、部署和监控。
> **技术栈**: DVC + MLflow + GitHub Actions + Evidently + Docker

---

## 项目结构

```
mlops-project/
├── .dvc/                    # DVC 配置
├── .github/workflows/       # GitHub Actions
│   ├── train.yml            # 自动训练
│   └── deploy.yml           # 自动部署
├── data/
│   ├── raw/.dvc             # 原始数据版本指针
│   └── processed/           # 处理后数据
├── src/
│   ├── data_pipeline.py     # 数据预处理
│   ├── train.py             # 模型训练
│   ├── evaluate.py          # 模型评估
│   └── serve.py             # 推理服务
├── models/                  # 模型产物
├── mlruns/                  # MLflow 本地追踪
├── requirements.txt
├── Dockerfile
└── dvc.yaml                 # DVC Pipeline 定义
```

---

## Step 1: 数据版本控制 (DVC)

### 1.1 初始化 DVC

```bash
# 初始化 Git 和 DVC
git init
dvc init

# 添加原始数据到 DVC（大文件不进 Git）
dvc add data/raw/train.csv
# 生成 data/raw/train.csv.dvc（指针文件，进 Git）

git add data/raw/train.csv.dvc .gitignore
git commit -m "Add raw training data v1"
```

### 1.2 远程存储

```bash
# 配置 S3 远程存储
dvc remote add -d myremote s3://my-bucket/dvc-store
dvc push  # 上传数据到 S3

# 团队成员拉取
dvc pull  # 从 S3 下载数据
```

### 1.3 定义 Pipeline

```yaml
# dvc.yaml
stages:
  preprocess:
    cmd: python src/data_pipeline.py
    deps:
      - src/data_pipeline.py
      - data/raw/train.csv
    outs:
      - data/processed/train_clean.csv
      - data/processed/test_clean.csv

  train:
    cmd: python src/train.py
    deps:
      - src/train.py
      - data/processed/train_clean.csv
    params:
      - train.learning_rate
      - train.n_estimators
      - train.max_depth
    outs:
      - models/model.pkl
    metrics:
      - metrics/train_metrics.json:
          cache: false

  evaluate:
    cmd: python src/evaluate.py
    deps:
      - src/evaluate.py
      - models/model.pkl
      - data/processed/test_clean.csv
    metrics:
      - metrics/eval_metrics.json:
          cache: false
    plots:
      - metrics/confusion_matrix.png
```

```bash
# 运行完整 pipeline
dvc repro
# 自动生成 DAG 并执行变更的 stage
```

---

## Step 2: 实验追踪 (MLflow)

### 2.1 训练脚本集成

```python
# src/train.py
import mlflow
import mlflow.sklearn
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
import yaml
import pandas as pd

# 加载参数
with open("params.yaml") as f:
    params = yaml.safe_load(f)["train"]

# 加载数据
df = pd.read_csv("data/processed/train_clean.csv")
X_train, X_val, y_train, y_val = train_test_split(
    df.drop("target", axis=1), df["target"], test_size=0.2
)

# MLflow 追踪
mlflow.set_experiment("fraud-detection")

with mlflow.start_run(run_name="gbm-v2"):
    # 记录参数
    mlflow.log_params(params)

    # 训练
    model = GradientBoostingClassifier(
        learning_rate=params["learning_rate"],
        n_estimators=params["n_estimators"],
        max_depth=params["max_depth"],
    )
    model.fit(X_train, y_train)

    # 评估
    from sklearn.metrics import accuracy_score, f1_score
    y_pred = model.predict(X_val)
    accuracy = accuracy_score(y_val, y_pred)
    f1 = f1_score(y_val, y_pred)

    # 记录指标
    mlflow.log_metrics({"accuracy": accuracy, "f1_score": f1})

    # 记录模型
    mlflow.sklearn.log_model(model, "model",
                             registered_model_name="fraud-detector")

    print(f"Accuracy: {accuracy:.4f}, F1: {f1:.4f}")
```

### 2.2 参数配置

```yaml
# params.yaml
train:
  learning_rate: 0.1
  n_estimators: 200
  max_depth: 5
```

### 2.3 MLflow UI

```bash
# 启动 MLflow 追踪服务器
mlflow server --host 0.0.0.0 --port 5000

# 打开 http://localhost:5000 查看所有实验
# 功能：实验对比、模型版本管理、模型注册表
```

---

## Step 3: 自动化 CI/CD (GitHub Actions)

### 3.1 自动训练 Pipeline

```yaml
# .github/workflows/train.yml
name: ML Training Pipeline

on:
  push:
    paths:
      - 'data/raw/**'          # 数据变更触发
      - 'src/**'               # 代码变更触发
      - 'params.yaml'          # 参数变更触发
  workflow_dispatch:            # 手动触发

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Pull data from DVC
        run: dvc pull
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Run DVC Pipeline
        run: dvc repro

      - name: Check model quality
        run: |
          python -c "
          import json
          with open('metrics/eval_metrics.json') as f:
              metrics = json.load(f)
          f1 = metrics['f1_score']
          print(f'F1 Score: {f1:.4f}')
          if f1 < 0.85:
              raise ValueError(f'F1 Score {f1:.4f} below threshold 0.85')
          print('✅ Model quality check passed')
          "

      - name: Push metrics to MLflow
        run: |
          mlflow server --host 0.0.0.0 --port 5000 &
          sleep 5
          mlflow ui
        env:
          MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_TRACKING_URI }}

      - name: Commit updated DVC files
        run: |
          git config user.name "CI Bot"
          git config user.email "ci@bot.com"
          git add metrics/ models/
          git diff --cached --quiet || git commit -m "CI: update model $(date +%Y%m%d)"
          git push
```

### 3.2 自动部署

```yaml
# .github/workflows/deploy.yml
name: Deploy Model

on:
  workflow_run:
    workflows: ["ML Training Pipeline"]
    types: [completed]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t model-server:latest .

      - name: Push to registry
        run: |
          docker tag model-server:latest ${{ secrets.REGISTRY }}/model-server:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/model-server:${{ github.sha }}

      - name: Deploy to K8s (Canary)
        run: |
          kubectl set image deployment/model-server \
            model=${{ secrets.REGISTRY }}/model-server:${{ github.sha }}
          kubectl rollout status deployment/model-server --timeout=300s
```

---

## Step 4: 模型监控 (Evidently)

### 4.1 数据漂移检测

```python
# src/monitor.py
import pandas as pd
from evidently import ColumnMapping
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, DataQualityPreset

# 加载参考数据（训练集）和当前数据（生产推理数据）
reference = pd.read_csv("data/processed/train_clean.csv")
current = pd.read_csv("data/production/last_week_predictions.csv")

# 列映射
column_mapping = ColumnMapping(
    target="target",
    prediction="prediction",
    numerical_features=["age", "income", "transaction_amount"],
    categorical_features=["region", "device_type"],
)

# 生成报告
report = Report(metrics=[
    DataDriftPreset(),
    DataQualityPreset(),
])
report.run(reference_data=reference, current_data=current,
           column_mapping=column_mapping)

# 保存报告
report.save_html("reports/drift_report.html")

# 程序化检查
drift_score = report.as_dict()["metrics"][0]["result"]["dataset_drift"]
if drift_score:
    print("⚠️ 检测到数据漂移！建议重训模型。")
    # 触发重训 pipeline
else:
    print("✅ 数据分布稳定")
```

### 4.2 定期监控调度

```yaml
# 在 K8s CronJob 中运行监控
apiVersion: batch/v1
kind: CronJob
metadata:
  name: model-monitor
spec:
  schedule: "0 9 * * *"  # 每天 9:00
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: monitor
            image: model-monitor:latest
            command: ["python", "src/monitor.py"]
          restartPolicy: OnFailure
```

---

## Step 5: 串联全流程

```
[数据更新] → git push → DVC push → GitHub Actions
  ↓
[train.yml] → dvc repro → MLflow 追踪 → 质量门禁
  ↓
[通过] → deploy.yml → Docker build → K8s Canary
  ↓
[监控] → Evidently 每日检查 → 漂移告警 → 触发重训
```

### 快速验证 Checklist

- [ ] `dvc repro` 可重现完整 pipeline
- [ ] `mlflow ui` 显示所有实验记录
- [ ] GitHub Actions 在代码/数据变更时自动触发
- [ ] 模型 F1 < 0.85 时 pipeline 阻断
- [ ] Evidently 报告正确检测漂移
- [ ] Docker 镜像可在任何机器运行推理服务

---

## Related

- [[11_模型运维/05_Orchestration/Data_Versioning_DVC_LakeFS]] — DVC 深度解析
- [[11_模型运维/04_Experiment_Tracking/MLflow_Deep_Dive]] — MLflow 深度解析
- [[11_模型运维/06_CI_CD/ML_CI_CD]] — ML CI/CD
- [[11_模型运维/08_Observability/Model_Monitoring_and_Drift_Detection_2026]] — 模型监控

---

*Last updated: 2026-06-25*
*Version: 1.0.0*

- [[11_模型运维/README|MLOps 流水线 (MLOps Pipeline)]]
