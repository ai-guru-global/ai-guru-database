---
title: 'ML CI/CD 流水线 (ML CI/CD Pipeline)'
category: '11-mlops-pipeline'
tags: ["mlops", "ci-cd", "pipeline", "feature-store"]
summary: '> **一句话理解**: ML CI/CD 就像 AI 模型的"出厂质检流水线"——每次代码变更都要自动通过数据检查、模型测试、性能验证等多道关卡，确保只有合格的模型才能上线服务用户。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Ml Ci Cd"
  - "ML CI CD"
  - ML_CI_CD
sources: []

---
# ML CI/CD 流水线 (ML CI/CD Pipeline)

> **一句话理解**: ML CI/CD 就像 AI 模型的"出厂质检流水线"——每次代码变更都要自动通过数据检查、模型测试、性能验证等多道关卡，确保只有合格的模型才能上线服务用户。

---

## 1. 概述

### 传统 CI/CD vs ML CI/CD

```
传统 CI/CD:
  代码提交 → 单元测试 → 构建 → 部署

ML CI/CD:
  代码提交 → 数据验证 → 训练 → 评估 → 模型测试 → 部署 → 监控
       ↑                                                    │
       └──────────── 性能下降/漂移触发再训练 ◄───────────────┘
```

### 核心区别

| 维度 | 传统软件 CI/CD | ML CI/CD |
|------|---------------|----------|
| **构建产物** | 编译后的二进制/镜像 | 训练好的模型 + Pipeline |
| **测试对象** | 代码逻辑 | 数据质量 + 模型性能 + Pipeline |
| **部署单元** | 服务/容器 | 模型服务 + 特征 Pipeline + 配置 |
| **回滚原因** | Bug/崩溃 | 性能退化/数据漂移 |
| **确定性** | 确定（相同输入=相同输出） | 非确定（相同代码可能产生不同模型） |

---

## 2. 数据验证

### 2.1 Great Expectations

```python
import great_expectations as gx
from great_expectations.dataset import PandasDataset

context = gx.get_context()
datasource = context.sources.add_pandas("my_datasource")
data_asset = datasource.add_dataframe_asset(name="training_data")

batch_request = data_asset.build_batch_request(dataframe=df)

expectation_suite = context.add_expectation_suite("training_data_suite")

validator = context.get_validator(
    batch_request=batch_request,
    expectation_suite_name="training_data_suite",
)

validator.expect_table_row_count_to_be_between(min_value=10000, max_value=1000000)
validator.expect_column_to_exist("user_id")
validator.expect_column_values_to_not_be_null("label")
validator.expect_column_values_to_be_between("age", min_value=0, max_value=150)
validator.expect_column_values_to_be_in_set("gender", value_set=["M", "F", "Other"])
validator.expect_column_values_to_be_unique("user_id")
validator.expect_column_mean_to_be_between("purchase_amount", min_value=10, max_value=10000)

validator.save_expectation_suite(discard_failed_expectations=False)

checkpoint = context.add_or_update_checkpoint(
    name="data_quality_checkpoint",
    validations=[{"batch_request": batch_request}],
)

result = checkpoint.run()

if not result["success"]:
    print("DATA VALIDATION FAILED - blocking training!")
    for detail in result["run_results"].values():
        for vr in detail["validation_result"]["results"]:
            if not vr["success"]:
                print(f"  FAILED: {vr['expectation_config']['type']}")
```

### 2.2 Pandera

```python
import pandera as pa
from pandera import Column, Check, Index

schema = pa.DataFrameSchema(
    columns={
        "user_id": Column(int, Check(lambda x: x > 0), nullable=False),
        "age": Column(int, Check.in_range(0, 150)),
        "purchase_amount": Column(float, Check.in_range(0.0, 100000.0)),
        "label": Column(int, Check.isin([0, 1])),
        "category": Column(str, Check.str_length(min_value=1)),
    },
    checks=[
        pa.Check(lambda df: df["purchase_amount"].mean() < 5000,
                 error="Average purchase amount anomaly"),
    ],
    strict=True,
)

validated_df = schema.validate(raw_df)
```

---

## 3. 模型测试策略

### 3.1 测试金字塔

```
            ┌─────────┐
            │ 端到端测试 │  ← 完整 Pipeline 在预生产环境运行
            │  (少量)   │
           ┌┴─────────┴┐
           │  集成测试   │  ← 模型 + 特征 Pipeline 联合测试
           │  (适量)    │
          ┌┴───────────┴┐
          │   回归测试    │  ← 新模型 vs 旧模型性能对比
          │   (适量)     │
         ┌┴─────────────┴┐
         │   单元测试      │  ← 特征计算、预处理、后处理函数
         │   (大量)       │
         └───────────────┘
```

### 3.2 单元测试

```python
import pytest
import numpy as np

def test_feature_computation():
    raw_data = pd.DataFrame({
        "user_id": [1, 2, 3],
        "purchase_amount": [100, 200, 300],
        "purchase_date": ["2026-01-01", "2026-01-15", "2026-02-01"],
    })
    features = compute_features(raw_data)
    
    assert "avg_purchase_amount" in features.columns
    assert features["avg_purchase_amount"].notna().all()
    assert (features["avg_purchase_amount"] >= 0).all()

def test_prediction_output_shape():
    model = load_model("models/latest")
    sample_input = create_sample_input(batch_size=10)
    predictions = model.predict(sample_input)
    
    assert predictions.shape == (10,)
    assert np.all((predictions >= 0) & (predictions <= 1))

def test_model_handles_missing_values():
    model = load_model("models/latest")
    input_with_missing = create_sample_input()
    input_with_missing.iloc[0, 2] = np.nan
    
    predictions = model.predict(input_with_missing)
    assert not np.any(np.isnan(predictions))

def test_latency_requirement():
    model = load_model("models/latest")
    sample = create_sample_input(batch_size=1)
    
    start = time.time()
    for _ in range(100):
        model.predict(sample)
    avg_latency = (time.time() - start) / 100 * 1000
    
    assert avg_latency < 50, f"Latency {avg_latency:.1f}ms exceeds 50ms threshold"
```

### 3.3 回归测试

```python
class ModelRegressionTest:
    def __init__(self):
        self.baseline_model = mlflow.pyfunc.load_model("models:/fraud_model/Production")
        self.candidate_model = mlflow.pyfunc.load_model("models:/fraud_model/Staging")
        self.test_data = load_regression_test_set()
    
    def test_performance_no_regression(self):
        baseline_pred = self.baseline_model.predict(self.test_data)
        candidate_pred = self.candidate_model.predict(self.test_data)
        
        baseline_f1 = f1_score(y_true, baseline_pred)
        candidate_f1 = f1_score(y_true, candidate_pred)
        
        assert candidate_f1 >= baseline_f1 - 0.02, \
            f"F1 regression: {candidate_f1:.4f} < {baseline_f1:.4f} - 0.02"
    
    def test_latency_no_regression(self):
        baseline_time = measure_latency(self.baseline_model, n=100)
        candidate_time = measure_latency(self.candidate_model, n=100)
        
        assert candidate_time <= baseline_time * 1.2, \
            f"Latency regression: {candidate_time:.1f}ms > {baseline_time:.1f}ms * 1.2"
    
    def test_prediction_consistency(self):
        stable_samples = load_stable_test_samples()
        baseline_pred = self.baseline_model.predict(stable_samples)
        candidate_pred = self.candidate_model.predict(stable_samples)
        
        consistency = np.mean(baseline_pred == candidate_pred)
        assert consistency >= 0.95, \
            f"Prediction changed for {1-consistency:.1%} of stable samples"
```

---

## 4. GitHub Actions for ML

### 4.1 完整 ML Pipeline

```yaml
name: ML Training Pipeline

on:
  push:
    paths:
      - 'src/**'
      - 'data/**'
      - 'configs/**'
  pull_request:
    branches: [main]

env:
  MLFLOW_TRACKING_URI: http://mlflow.company.com
  MODEL_NAME: fraud_detection

jobs:
  data-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - name: Validate data
        run: python src/validate_data.py --config configs/data_validation.yaml
      - name: Check data drift
        run: python src/check_data_drift.py --reference data/reference.parquet --current data/current.parquet

  model-training:
    needs: data-validation
    runs-on: [self-hosted, gpu]
    steps:
      - uses: actions/checkout@v4
      - name: Train model
        run: python src/train.py --config configs/production.yaml
      - name: Upload model artifact
        uses: actions/upload-artifact@v4
        with:
          name: model
          path: models/

  model-evaluation:
    needs: model-training
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: model
          path: models/
      - name: Run evaluation suite
        run: python src/evaluate.py --model models/latest --test-data data/test.parquet
      - name: Regression test
        run: python src/regression_test.py --candidate models/latest --baseline models/production
      - name: Check fairness
        run: python src/fairness_check.py --model models/latest --data data/test.parquet

  model-registration:
    needs: model-evaluation
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Register model
        run: python src/register_model.py --name $MODEL_NAME --auto-promote

  deploy-staging:
    needs: model-registration
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: python src/deploy.py --env staging --model $MODEL_NAME
      - name: Smoke test
        run: python src/smoke_test.py --env staging --timeout 60

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Canary deployment (5%)
        run: python src/deploy.py --env production --strategy canary --traffic 5
      - name: Monitor canary
        run: python src/monitor_canary.py --duration 300 --min-accuracy 0.90
      - name: Full rollout
        run: python src/deploy.py --env production --strategy rollout --traffic 100
```

### 4.2 定时漂移检测

```yaml
name: Data Drift Detection

on:
  schedule:
    - cron: '0 8 * * *'
  workflow_dispatch:

jobs:
  drift-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Pull latest production data
        run: python src/fetch_production_data.py --days 7
      - name: Run drift detection
        run: |
          python src/drift_detection.py \
            --reference data/reference_distribution.pkl \
            --current data/last_7_days.parquet \
            --threshold 0.1
      - name: Notify on drift
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          channel: '#ml-alerts'
          message: "Data drift detected! Check the report: ${{ steps.drift.outputs.report_url }}"
```

---

## 5. 部署策略

### 5.1 部署策略对比

| 策略 | 流量分配 | 风险 | 回滚速度 | 适用场景 |
|------|---------|------|---------|---------|
| **蓝绿部署** | 0% → 100% 切换 | 中 | 秒级 | 低风险更新 |
| **金丝雀发布** | 5% → 25% → 100% | 低 | 分钟级 | 高风险更新 |
| **影子模式** | 0%（仅记录） | 极低 | 不需要 | 新模型验证 |
| **A/B 测试** | 随机分组 | 中 | 分钟级 | 效果对比 |

### 5.2 金丝雀发布实现

```python
class CanaryDeployer:
    def __init__(self, model_a_name, model_b_name, traffic_percentage=5):
        self.model_a = load_model(model_a_name)
        self.model_b = load_model(model_b_name)
        self.traffic_percentage = traffic_percentage
        self.metrics = {"a": [], "b": []}
    
    def predict(self, features):
        if random.random() * 100 < self.traffic_percentage:
            prediction = self.model_b.predict(features)
            self.metrics["b"].append(time.time())
            return prediction, "B"
        else:
            prediction = self.model_a.predict(features)
            self.metrics["a"].append(time.time())
            return prediction, "A"
    
    def evaluate_canary(self):
        a_latency = np.mean(self.metrics["a"][-1000:])
        b_latency = np.mean(self.metrics["b"][-100:])
        
        if b_latency > a_latency * 1.5:
            print("ALERT: Canary model latency 50% higher than baseline")
            return False
        
        print(f"Canary healthy. Traffic: {self.traffic_percentage}%")
        return True
    
    def promote(self):
        print(f"Promoting canary model to full traffic")
        self.traffic_percentage = 100
    
    def rollback(self):
        print(f"Rolling back canary, reverting to 0% traffic")
        self.traffic_percentage = 0
```

---

## 6. 监控与告警集成

```python
class MLPipelineMonitor:
    def __init__(self):
        self.alert_channels = ["slack://ml-alerts", "pagerduty://ml-oncall"]
    
    def check_pipeline_health(self):
        checks = {
            "data_freshness": self._check_data_freshness(),
            "model_performance": self._check_model_performance(),
            "feature_availability": self._check_feature_store(),
            "prediction_latency": self._check_latency(),
            "resource_usage": self._check_resources(),
        }
        
        for check_name, result in checks.items():
            if not result["healthy"]:
                self._send_alert(check_name, result)
        
        return checks
    
    def _check_model_performance(self):
        current_acc = self._get_latest_accuracy()
        baseline_acc = self._get_baseline_accuracy()
        
        if current_acc < baseline_acc - 0.05:
            return {
                "healthy": False,
                "message": f"Accuracy dropped: {current_acc:.3f} vs baseline {baseline_acc:.3f}",
            }
        return {"healthy": True, "message": f"Accuracy: {current_acc:.3f}"}
```

---

## 7. 面试高频问题

**Q1: ML CI/CD 和传统 CI/CD 最大区别？**
> 三个核心区别：(1) 测试对象不同——ML 需要测试数据质量、模型性能、特征一致性；(2) 构建过程非确定性——相同代码可能训练出不同模型，需要记录完整环境；(3) 部署后仍需持续监控——模型可能因数据漂移而退化。

**Q2: 如何设计模型回滚机制？**
> 三层防护：(1) 金丝雀发布——先小流量验证再全量；(2) 自动化性能监控——指标低于阈值自动触发回滚；(3) 模型注册中心——保留所有历史版本，一键回滚到上一稳定版本。

**Q3: 数据验证应该检查什么？**
> 四类检查：(1) Schema 验证——列名、类型、范围；(2) 统计验证——均值、方差、分布是否偏移；(3) 完整性——缺失值比例、行数；(4) 业务规则——特定字段的约束条件。

---

## 工具实现（本章节）

本文讲 ML CI/CD 的**概念与流程**。AI 系统的 CI/CD 实践与工具配置：

- [[CI_CD_Pipeline_AI_2026]] — AI 系统 CI/CD 流水线 2026

---

## 8. 参考资源

- [Great Expectations](https://greatexpectations.io/)
- [Pandera](https://pandera.readthedocs.io/)
- [GitHub Actions for ML](https://docs.github.com/en/actions)
- [Continuous Delivery for ML (Google)](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)

---

*Last updated: 2026-05-18*

## Related

- [[11_模型运维/05_Orchestration/Data_Pipeline_Orchestration.md|Data_Pipeline_Orchestration]]
- [[11_模型运维/01_MLOps_Fundamentals/MLOps-in-nutshell.md|MLOps-in-nutshell]]
- [[概念/MLOps/mlops.md|mlops]]
