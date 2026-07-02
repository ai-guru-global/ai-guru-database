---
title: 数据流水线编排 (Data Pipeline Orchestration)
category: 11-mlops-pipeline
tags: ["mlops", "ci-cd", "pipeline", "feature-store"]
summary: "> **一句话理解**: 数据流水线编排就像铁路调度中心——协调各列火车（任务）的运行顺序、到站时间、异常处理，确保原材料（数据）按时、保质到达目的地（模型训练/推理）。"
created: 2026-05-31
updated: 2026-05-31
tier: core
aliases:
  - "Data Pipeline Orchestration"
  - Data_Pipeline_Orchestration

---
# 数据流水线编排 (Data Pipeline Orchestration)

> **一句话理解**: 数据流水线编排就像铁路调度中心——协调各列火车（任务）的运行顺序、到站时间、异常处理，确保原材料（数据）按时、保质到达目的地（模型训练/推理）。

---

## 1. 概述

### 为什么需要编排？

```
无编排的混乱:
  脚本A 早上8点跑
  脚本B 依赖A的输出, 但不知道A是否完成
  脚本C 需要A和B的结果, 但B经常超时
  → 需要人工盯着, 出错需要手动重启

有编排的有序:
  DAG(A → B → C)
  A 成功后自动触发 B
  B 失败后自动重试 3 次
  C 等待 A 和 B 都成功后执行
  全程自动, 失败自动通知
```

---

## 2. Apache Airflow

### 2.1 核心概念

| 概念 | 说明 | 类比 |
|------|------|------|
| **DAG** | 有向无环图，定义任务依赖关系 | 铁路网络图 |
| **Task** | DAG 中的一个节点 | 一列火车 |
| **Operator** | 任务的执行器 | 火车司机 |
| **Sensor** | 等待某个条件满足 | 红绿灯 |
| **XCom** | 任务间传递数据 | 站间调度电话 |

### 2.2 ML Pipeline DAG 示例

```python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.sensors.python import PythonSensor

default_args = {
    "owner": "ml-team",
    "depends_on_past": False,
    "email": ["ml-alerts@company.com"],
    "email_on_failure": True,
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="ml_training_pipeline",
    default_args=default_args,
    description="ML model training and deployment pipeline",
    schedule_interval="0 6 * * *",
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=["ml", "training"],
) as dag:

    def validate_data(**context):
        import pandas as pd
        from pandera import Column, Check, DataFrameSchema
        
        df = pd.read_parquet("/data/raw/daily_batch.parquet")
        
        schema = DataFrameSchema({
            "user_id": Column(int, Check(lambda x: x > 0)),
            "features": Column(float),
            "label": Column(int, Check.isin([0, 1])),
        })
        
        validated = schema.validate(df)
        row_count = len(validated)
        
        context["ti"].xcom_push(key="row_count", value=row_count)
        context["ti"].xcom_push(key="data_path", value="/data/validated/latest.parquet")
        validated.to_parquet("/data/validated/latest.parquet")
        print(f"Validated {row_count} rows")

    def compute_features(**context):
        data_path = context["ti"].xcom_pull(key="data_path", task_ids="validate_data")
        
        df = pd.read_parquet(data_path)
        features = feature_engineering_pipeline(df)
        
        output_path = "/data/features/latest.parquet"
        features.to_parquet(output_path)
        
        context["ti"].xcom_push(key="feature_path", value=output_path)
        print(f"Features computed: {features.shape}")

    def train_model(**context):
        feature_path = context["ti"].xcom_pull(key="feature_path", task_ids="compute_features")
        
        df = pd.read_parquet(feature_path)
        X_train, X_test, y_train, y_test = split_data(df)
        
        model = train_xgboost(X_train, y_train, params={
            "n_estimators": 500,
            "max_depth": 8,
            "learning_rate": 0.01,
        })
        
        metrics = evaluate_model(model, X_test, y_test)
        context["ti"].xcom_push(key="model_metrics", value=metrics)
        
        if metrics["f1_score"] > 0.85:
            model.save_model("/models/latest.json")
            context["ti"].xcom_push(key="model_path", value="/models/latest.json")
        else:
            raise ValueError(f"F1 {metrics['f1_score']:.3f} below threshold 0.85")

    def deploy_model(**context):
        model_path = context["ti"].xcom_pull(key="model_path", task_ids="train_model")
        metrics = context["ti"].xcom_pull(key="model_metrics", task_ids="train_model")
        
        deploy_to_serving(model_path, canary_percent=5)
        print(f"Deployed with metrics: {metrics}")

    validate_task = PythonOperator(
        task_id="validate_data",
        python_callable=validate_data,
    )

    feature_task = PythonOperator(
        task_id="compute_features",
        python_callable=compute_features,
    )

    train_task = PythonOperator(
        task_id="train_model",
        python_callable=train_model,
    )

    deploy_task = PythonOperator(
        task_id="deploy_model",
        python_callable=deploy_model,
    )

    validate_task >> feature_task >> train_task >> deploy_task
```

### 2.3 Sensor 使用

```python
from airflow.sensors.filesystem import FileSensor
from airflow.sensors.s3 import S3KeySensor

wait_for_data = FileSensor(
    task_id="wait_for_data",
    filepath="/data/raw/daily_batch.parquet",
    poke_interval=300,
    timeout=7200,
    mode="poke",
)

wait_for_s3_data = S3KeySensor(
    task_id="wait_for_s3_data",
    bucket_name="ml-data-bucket",
    bucket_key="raw/{{ ds }}/batch.parquet",
    aws_conn_id="aws_default",
)
```

### 2.4 分支逻辑

```python
from airflow.operators.python import BranchPythonOperator

def decide_training_path(**context):
    metrics = context["ti"].xcom_pull(key="model_metrics", task_ids="evaluate")
    
    if metrics["accuracy"] > 0.95:
        return "deploy_full"
    elif metrics["accuracy"] > 0.90:
        return "deploy_canary"
    else:
        return "notify_team_retrain"

branch = BranchPythonOperator(
    task_id="decide_path",
    python_callable=decide_training_path,
)
```

---

## 3. Dagster

### 3.1 核心概念

| 概念 | 说明 | Airflow 对应 |
|------|------|-------------|
| **Asset** | 数据资产（表、模型、文件） | Task 的输出 |
| **Resource** | 外部系统连接 | Connection |
| **Sensor** | 监控外部变化触发运行 | Sensor |
| **Schedule** | 定时触发 | Schedule |
| **Job** | 一组 Asset 的计算 | DAG |
| **Op** | 具体的计算操作 | Task |

### 3.2 ML Pipeline 示例

```python
from dagster import (
    asset, AssetKey, AssetObservation, MetadataValue,
    Output, Definitions, define_asset_job, ScheduleDefinition,
    Config, EnvVar,
)
from dagster_aws.s3 import S3Resource
import pandas as pd

class MLConfig(Config):
    min_accuracy: float = 0.85
    model_type: str = "xgboost"
    test_size: float = 0.2

@asset(
    description="原始数据验证与清洗",
    compute_kind="pandas",
    metadata={"owner": "data-team"},
)
def raw_data_validated(s3: S3Resource) -> pd.DataFrame:
    raw = pd.read_parquet("s3://ml-data/raw/latest.parquet")
    
    assert raw["user_id"].notna().all(), "user_id has nulls"
    assert raw["label"].isin([0, 1]).all(), "invalid labels"
    
    cleaned = raw.dropna(subset=["features"])
    
    yield Output(
        value=cleaned,
        metadata={
            "num_rows": len(cleaned),
            "num_columns": len(cleaned.columns),
            "preview": MetadataValue.md(cleaned.head().to_markdown()),
        },
    )

@asset(
    description="特征工程",
    compute_kind="pandas",
)
def features(raw_data_validated: pd.DataFrame) -> pd.DataFrame:
    df = raw_data_validated.copy()
    
    df["purchase_frequency"] = df["total_purchases"] / df["account_age_days"]
    df["avg_order_value"] = df["total_spent"] / df["total_purchases"]
    df["recency_score"] = 1 / (1 + df["days_since_last_purchase"])
    
    feature_cols = ["purchase_frequency", "avg_order_value", "recency_score",
                    "age", "account_age_days", "total_purchases"]
    
    yield Output(
        value=df[feature_cols + ["user_id", "label"]],
        metadata={
            "feature_count": len(feature_cols),
            "features": feature_cols,
        },
    )

@asset(
    description="训练模型并记录指标",
    compute_kind="sklearn",
)
def trained_model(features: pd.DataFrame, config: MLConfig) -> dict:
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score, f1_score
    import joblib
    
    X = features.drop(columns=["user_id", "label"])
    y = features["label"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=config.test_size, random_state=42
    )
    
    model = RandomForestClassifier(n_estimators=200, max_depth=10)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "f1_score": float(f1_score(y_test, y_pred)),
    }
    
    assert metrics["accuracy"] >= config.min_accuracy, \
        f"Accuracy {metrics['accuracy']:.3f} below {config.min_accuracy}"
    
    joblib.dump(model, "/models/latest.joblib")
    
    yield Output(
        value=metrics,
        metadata={
            "accuracy": MetadataValue.float(metrics["accuracy"]),
            "f1_score": MetadataValue.float(metrics["f1_score"]),
        },
    )

@asset(
    description="部署模型到推理服务",
    compute_kind="kubernetes",
)
def deployed_model(trained_model: dict) -> str:
    deploy_to_serving("/models/latest.joblib")
    
    return f"Deployed model with accuracy={trained_model['accuracy']:.3f}"

ml_job = define_asset_job(
    name="ml_training_job",
    selection=[raw_data_validated, features, trained_model, deployed_model],
)

ml_schedule = ScheduleDefinition(
    job=ml_job,
    cron_schedule="0 6 * * *",
)

defs = Definitions(
    assets=[raw_data_validated, features, trained_model, deployed_model],
    jobs=[ml_job],
    schedules=[ml_schedule],
    resources={
        "s3": S3Resource(
            endpoint_url=EnvVar("S3_ENDPOINT"),
        ),
    },
)
```

---

## 4. Prefect

```python
from prefect import flow, task, get_run_logger
from prefect.tasks import task_input_hash
from datetime import timedelta

@task(
    retries=3,
    retry_delay_seconds=60,
    cache_key_fn=task_input_hash,
    cache_expiration=timedelta(hours=1),
)
def validate_data(data_path: str) -> str:
    logger = get_run_logger()
    df = pd.read_parquet(data_path)
    logger.info(f"Validating {len(df)} rows")
    
    if df["label"].isna().any():
        raise ValueError("Found null labels")
    
    validated_path = data_path.replace("raw", "validated")
    df.to_parquet(validated_path)
    return validated_path

@task
def compute_features(data_path: str) -> str:
    df = pd.read_parquet(data_path)
    features = feature_engineering(df)
    output_path = data_path.replace("validated", "features")
    features.to_parquet(output_path)
    return output_path

@task
def train_model(feature_path: str, min_accuracy: float = 0.85) -> dict:
    df = pd.read_parquet(feature_path)
    model, metrics = train_and_evaluate(df)
    
    if metrics["accuracy"] < min_accuracy:
        raise ValueError(f"Accuracy too low: {metrics['accuracy']}")
    
    return metrics

@flow(name="ML Training Pipeline", version="1.0.0")
def ml_pipeline(data_path: str = "/data/raw/latest.parquet"):
    validated = validate_data(data_path)
    featured = compute_features(validated)
    metrics = train_model(featured)
    
    return metrics

if __name__ == "__main__":
    ml_pipeline()
```

---

## 5. 工具对比

| 维度 | Airflow | Dagster | Prefect |
|------|---------|---------|---------|
| **设计哲学** | 任务调度 | 数据资产管理 | 动态工作流 |
| **学习曲线** | 陡峭 | 中等 | 平缓 |
| **DAG 定义** | Python 脚本 | Python 装饰器 | Python 装饰器 |
| **数据血缘** | 需第三方 | 内置（Asset） | 需第三方 |
| **测试支持** | 弱 | 强（本地测试） | 强 |
| **实时数据** | 弱 | 原生支持 | 原生支持 |
| **UI** | 成熟但复杂 | 现代 | 现代 |
| **社区规模** | 最大 | 快速增长 | 快速增长 |
| **适用场景** | 传统数据仓库 | 现代 ML 平台 | 快速原型 |

### 选型建议

```
选择编排工具:

  你主要做什么？
  ├── 传统 ETL + 数据仓库调度
  │   └── Airflow（最成熟, 生态最全）
  ├── ML Pipeline + 特征工程
  │   └── Dagster（内置数据资产管理）
  └── 快速迭代 + 简单 Pipeline
      └── Prefect（最易上手）
```

---

## 6. 最佳实践

### 6.1 DAG 设计原则

```
好的 DAG 设计:
  ├── 幂等性: 同一输入,同一输出 (可安全重跑)
  ├── 原子性: 每个任务只做一件事
  ├── 幂等 + 增量: 避免每次全量计算
  ├── 清晰命名: task_id 反映业务含义
  └── 合理超时: 设置 task 超时,防止挂死
```

### 6.2 错误处理策略

| 策略 | 适用场景 | 实现方式 |
|------|---------|---------|
| **自动重试** | 网络抖动、临时故障 | `retries=3, retry_delay=timedelta(minutes=5)` |
| **降级处理** | 非关键数据源不可用 | 使用缓存数据 + 告警 |
| **失败通知** | 所有失败 | Email/Slack/PagerDuty |
| **部分完成** | 批量任务中部分失败 | 记录失败项,继续处理成功项 |
| **死信队列** | 反复失败的任务 | 写入 DLQ,人工处理 |

---

## 7. 面试高频问题

**Q1: Airflow 和 Dagster 的核心区别？**
> Airflow 以任务调度为核心，关注"什么时间执行什么"；Dagster 以数据资产为核心，关注"数据如何流动和转化"。Dagster 的 Asset 模型天然适合 ML Pipeline，因为 ML Pipeline 本质是数据资产的链式转换。

**Q2: 如何保证 Pipeline 的幂等性？**
> (1) 使用确定性文件名（如带时间戳的输出路径），(2) 每次运行前清理上次的输出，(3) 使用检查点（checkpoint）记录已完成的步骤，(4) 避免依赖外部状态，只用输入参数决定输出。

---

## 工具实现（本章节）

本文讲流水线编排的**概念与选型**。具体工具的命令、配置、部署：

- [[Kubeflow_Deep_Dive]] — Kubeflow：云原生 ML 平台
- [[Prefect_Deep_Dive]] — Prefect：Python 原生工作流编排

---

## 8. 参考资源

- [Apache Airflow 文档](https://airflow.apache.org/docs/)
- [Dagster 文档](https://docs.dagster.io/)
- [Prefect 文档](https://docs.prefect.io/)
- [Airflow vs Dagster vs Prefect 对比](https://dagster.io/blog/airflow-vs-dagster)

---

*Last updated: 2026-05-18*

## Related

- [[11_MLOps_Pipeline/MLOps-in-nutshell]] — MLOps 速成指南 (共享: ci-cd, feature-store, mlops, pipeline)
- [[11_MLOps_Pipeline/MLOps_Pipeline.md|MLOps_Pipeline]]
- [[11_MLOps_Pipeline/CI_CD/ML_CI_CD.md|ML_CI_CD]]
- [[11_MLOps_Pipeline/MLOps_Pipeline_for_dummy.md|MLOps_Pipeline_for_dummy]]
- [[11_MLOps_Pipeline/MLOps_Maturity_Model.md|MLOps_Maturity_Model]]
