---
title: "MLOps 编码模式"
category: "16-ai-coding"
tags: ["mlops", "feature-store", "pipeline", "model-registry", "experiment-tracking", "dvc", "hydra", "testing"]
summary: "MLOps 编码模式全景：Feature Store SDK 模式(Feast/Tecton)、Pipeline 代码模式(Kubeflow/Airflow/Prefect)、Model Registry 客户端(MLflow/W&B)、实验追踪 API 模式、数据版本控制(DVC/LakeFS)、配置管理(Hydra/OmegaConf)、测试模式(数据/模型/集成)。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "MLOps Coding Patterns"
  - MLOps_Coding_Patterns
sources: []

name_zh: "MLOps 编码模式"
---
# MLOps 编码模式

> 中文简称：MLOps 编码模式

> **一句话理解**: 将 MLOps 工具链的 SDK 使用提炼为可复用的编码模式——Feature Store、Pipeline、Model Registry、实验追踪、数据版本控制、配置管理和测试，每个模式附带生产级代码示例。

---

## 一、概述

### 1.1 MLOps 编码模式的意义

```
没有模式的 MLOps 代码:              有模式的 MLOps 代码:
═══════════════════════            ═══════════════════
每个项目重写 SDK 调用              统一接口，切换后端无需改业务代码
配置散落在代码各处                  集中管理，类型安全
Pipeline 逻辑与基础设施耦合         声明式定义，可移植
实验无法复现                       完整追踪，一键复现
测试只覆盖模型精度                  数据/模型/集成全覆盖
```

### 1.2 MLOps 工具栈全景

```
┌─────────────────────────────────────────────────────────┐
│                    应用层 (Application)                   │
│         FastAPI / Gradio / Streamlit                     │
├─────────────────────────────────────────────────────────┤
│                    编排层 (Orchestration)                 │
│     Airflow / Prefect / Kubeflow / Dagster              │
├────────────┬────────────┬───────────────┬───────────────┤
│ Feature    │ Experiment │ Model         │ Data          │
│ Store      │ Tracking   │ Registry      │ Versioning    │
│ Feast/     │ MLflow/    │ MLflow/       │ DVC/          │
│ Tecton     │ W&B        │ W&B           │ LakeFS        │
├────────────┴────────────┴───────────────┴───────────────┤
│                    配置层 (Configuration)                 │
│         Hydra / OmegaConf / Pydantic                    │
├─────────────────────────────────────────────────────────┤
│                    计算层 (Compute)                       │
│     Kubernetes / Spark / Ray / GPU Cluster              │
└─────────────────────────────────────────────────────────┘
```

---
## 二、Feature Store SDK 模式

### 2.1 Feast: 开源 Feature Store

```python
"""Feast Feature Store SDK 模式"""
from datetime import datetime, timedelta
import feast
import pandas as pd
from feast import Entity, FeatureView, Field, FileSource
from feast.types import Float32, Int64

# ===== 模式 1: Feature 定义 (声明式) =====
user = Entity(name="user_id", join_keys=["user_id"])

user_transactions = FileSource(
    path="data/user_transactions.parquet",
    timestamp_field="event_timestamp",
)

user_features_view = FeatureView(
    name="user_transaction_features",
    entities=[user],
    ttl=timedelta(days=7),
    schema=[
        Field(name="transaction_count_7d", dtype=Int64),
        Field(name="avg_transaction_amount_7d", dtype=Float32),
        Field(name="distinct_merchants_7d", dtype=Int64),
    ],
    source=user_transactions,
)

# ===== 模式 2: Feature 获取 (在线/离线统一接口) =====
class FeatureStoreClient:
    """Feature Store 客户端 - 统一在线/离线获取"""
    
    def __init__(self, repo_path: str = "feature_repo"):
        self.store = feast.FeatureStore(repo_path=repo_path)
    
    def get_online_features(
        self, entity_rows: list[dict], features: list[str],
    ) -> pd.DataFrame:
        """在线获取 (低延迟, 用于推理)"""
        return self.store.get_online_features(
            features=features, entity_rows=entity_rows,
        ).to_df()
    
    def get_historical_features(
        self, entity_df: pd.DataFrame, features: list[str],
    ) -> pd.DataFrame:
        """离线获取 (用于训练, point-in-time correct)"""
        job = self.store.get_historical_features(
            entity_df=entity_df, features=features,
        )
        return job.to_df()
    
    def materialize(self, start_date: datetime, end_date: datetime) -> None:
        """物化: 离线 → 在线"""
        self.store.materialize(start_date=start_date, end_date=end_date)

# ===== 模式 3: 训练数据生成 =====
def generate_training_dataset(
    store: FeatureStoreClient, labels_df: pd.DataFrame,
) -> pd.DataFrame:
    """生成 point-in-time correct 的训练数据"""
    features = [
        "user_transaction_features:transaction_count_7d",
        "user_transaction_features:avg_transaction_amount_7d",
        "user_transaction_features:distinct_merchants_7d",
    ]
    training_df = store.get_historical_features(
        entity_df=labels_df, features=features,
    )
    assert not training_df.isnull().any().any(), "Features contain nulls"
    return training_df
```

### 2.2 Tecton: 企业级 Feature Store

```python
"""Tecton Feature Store SDK 模式"""
from tecton import Entity, FeatureService, batch_feature_view, realtime_feature_view
from datetime import timedelta

user = Entity(name="user", join_keys=["user_id"])

@batch_feature_view(
    sources=[transactions_batch], entities=[user],
    mode="spark_sql", batch_schedule=timedelta(days=1), ttl=timedelta(days=7),
)
def user_transaction_features(transactions):
    return transactions.groupby("user_id").agg(
        transaction_count_7d=("amount", "count"),
        avg_amount_7d=("amount", "mean"),
    )

# Feature Service 组合多个 Feature View (batch + realtime)
fraud_detection_fs = FeatureService(
    name="fraud_detection_features",
    features=[user_transaction_features, user_realtime_features],
)
```

### 2.3 Feature Store 对比

| 模式 | Feast | Tecton | Hopsworks |
|------|-------|--------|-----------|
| 部署方式 | 自托管/云 | SaaS | 自托管/云 |
| 实时 Feature | 有限 | 原生支持 | 原生支持 |
| 流式处理 | 需外部 | 内置 | 内置 (Flink) |
| Point-in-time | 支持 | 支持 | 支持 |
| 适用规模 | 中小 | 大 | 大 |

---

## 三、Pipeline 代码模式

### 3.1 Prefect: 现代 Python 编排

```python
"""Prefect Pipeline 模式"""
from prefect import flow, task
from prefect.task_runners import ConcurrentTaskRunner
from prefect.logging import get_run_logger
from datetime import timedelta
import pandas as pd

# ===== 模式 1: Task 定义 (原子操作) =====
@task(retries=3, retry_delay_seconds=60, timeout_seconds=600,
      cache_expiration=timedelta(hours=1))
def load_raw_data(source_path: str) -> pd.DataFrame:
    """加载原始数据 (带重试和缓存)"""
    logger = get_run_logger()
    logger.info(f"Loading data from {source_path}")
    df = pd.read_parquet(source_path)
    return df

@task(name="validate_data")
def validate_data(df: pd.DataFrame, schema: dict) -> pd.DataFrame:
    """数据校验"""
    for col, expected_type in schema.items():
        if col not in df.columns:
            raise ValueError(f"Missing column: {col}")
    return df

@task(name="train_model", timeout_seconds=3600)
def train_model(train_df: pd.DataFrame, val_df: pd.DataFrame, config: dict) -> dict:
    """模型训练"""
    logger = get_run_logger()
    logger.info(f"Training with config: {config}")
    metrics = {"loss": 0.05, "accuracy": 0.95, "f1": 0.93}
    return metrics

@task(name="register_model")
def register_model(model_path: str, metrics: dict, model_name: str) -> str:
    """注册模型到 Registry"""
    import mlflow
    with mlflow.start_run():
        mlflow.log_metrics(metrics)
        mlflow.pytorch.log_model(model_path, model_name)
    return f"{model_name}:latest"

# ===== 模式 2: Flow 定义 (DAG 编排) =====
@flow(name="ml-training-pipeline", task_runner=ConcurrentTaskRunner())
def training_pipeline(data_path: str, model_config: dict, model_name: str = "fraud-detector"):
    """完整训练 Pipeline"""
    raw_df = load_raw_data(data_path)
    validated_df = validate_data(raw_df, {"user_id": "int64", "amount": "float64"})
    
    train_df = validated_df.sample(frac=0.8, random_state=42)
    val_df = validated_df.drop(train_df.index)
    
    metrics = train_model(train_df, val_df, model_config)
    
    if metrics["f1"] > 0.90:  # 条件执行
        register_model("outputs/model.pt", metrics, model_name)

if __name__ == "__main__":
    training_pipeline(
        data_path="s3://data-lake/transactions/2026/",
        model_config={"lr": 1e-4, "epochs": 10, "batch_size": 256},
    )
```

### 3.2 Kubeflow Pipelines: K8s 原生

```python
"""Kubeflow Pipelines SDK 模式"""
from kfp import dsl, compiler
from kfp.dsl import Input, Output, Dataset, Model, Metrics

@dsl.component(base_image="python:3.12-slim",
               packages_to_install=["pandas", "scikit-learn"])
def preprocess_data(raw_data_path: str, processed_data: Output[Dataset]) -> dict:
    import pandas as pd
    df = pd.read_parquet(raw_data_path).dropna()
    df.to_parquet(processed_data.path)
    return {"rows": len(df)}

@dsl.component(base_image="pytorch/pytorch:2.6.0-cuda12.4-cudnn9-runtime",
               packages_to_install=["transformers"])
def train_model(processed_data: Input[Dataset], model_output: Output[Model],
                metrics_output: Output[Metrics], learning_rate: float = 1e-4) -> None:
    import torch
    model = torch.nn.Linear(128, 10)
    torch.save(model.state_dict(), f"{model_output.path}/model.pt")
    metrics_output.log_metric("accuracy", 0.95)

@dsl.pipeline(name="llm-finetune-pipeline")
def finetune_pipeline(data_path: str = "s3://bucket/data/", learning_rate: float = 1e-4):
    preprocess_task = preprocess_data(raw_data_path=data_path)
    train_task = train_model(
        processed_data=preprocess_task.outputs["processed_data"],
        learning_rate=learning_rate,
    )
    train_task.set_gpu_limit(1)
    train_task.set_memory_limit("64Gi")

compiler.Compiler().compile(finetune_pipeline, "pipeline.yaml")
```

### 3.3 Pipeline 工具对比

| 维度 | Prefect | Airflow | Kubeflow | Dagster |
|------|---------|---------|----------|---------|
| 定义方式 | Python 装饰器 | Python DAG | Python SDK | Python 装饰器 |
| 执行环境 | 本地/云/K8s | 本地/K8s | K8s 原生 | 本地/K8s |
| 动态 DAG | 支持 | 有限 | 支持 | 支持 |
| 数据感知 | 有限 | 无 | 原生 (Artifact) | 原生 (Asset) |
| 学习曲线 | 低 | 中 | 高 | 中 |
| 适用场景 | 通用 | 批处理 ETL | K8s ML | 数据资产 |

---

## 四、Model Registry 客户端模式

### 4.1 MLflow Model Registry

```python
"""MLflow Model Registry 客户端模式"""
import mlflow
from mlflow.tracking import MlflowClient
from enum import Enum

class ModelStage(Enum):
    STAGING = "Staging"
    PRODUCTION = "Production"
    ARCHIVED = "Archived"

class ModelRegistryClient:
    """Model Registry 统一客户端"""
    
    def __init__(self, tracking_uri: str = "http://mlflow:5000"):
        mlflow.set_tracking_uri(tracking_uri)
        self.client = MlflowClient()
    
    # ===== 模式 1: 注册模型 =====
    def register_model(self, model_path: str, name: str,
                       metrics: dict[str, float]) -> str:
        """注册新模型版本"""
        try:
            self.client.create_registered_model(name)
        except mlflow.exceptions.MlflowException:
            pass  # 已存在
        
        with mlflow.start_run():
            mlflow.log_metrics(metrics)
            mlflow.pytorch.log_model(model_path, "model",
                                     registered_model_name=name)
        
        versions = self.client.search_model_versions(f"name='{name}'")
        latest = max(int(v.version) for v in versions)
        return f"{name}:{latest}"
    
    # ===== 模式 2: 模型晋升 =====
    def promote_to_production(self, name: str, version: str,
                              min_metrics: dict[str, float] | None = None) -> bool:
        """将模型从 Staging 晋升到 Production"""
        # 归档当前 Production 版本
        current_prod = self.client.get_latest_versions(name, stages=["Production"])
        for mv in current_prod:
            self.client.transition_model_version_stage(
                name=name, version=mv.version, stage="Archived")
        
        # 晋升新版本
        self.client.transition_model_version_stage(
            name=name, version=version, stage="Production")
        return True
    
    # ===== 模式 3: 加载生产模型 =====
    def load_production_model(self, name: str):
        """加载当前 Production 模型"""
        return mlflow.pytorch.load_model(f"models:/{name}/Production")
```

### 4.2 Weights & Biases (W&B)

```python
"""W&B 实验追踪与模型注册模式"""
import wandb

class WandBTracker:
    """W&B 实验追踪器"""
    
    def __init__(self, project: str, entity: str | None = None):
        self.project = project
        self.entity = entity
    
    def training_loop_with_tracking(self, config: dict):
        """带追踪的训练循环"""
        with wandb.init(project=self.project, config=config,
                        tags=["training"]) as run:
            model = build_model(config)
            optimizer = build_optimizer(model, config)
            
            for step in range(config["max_steps"]):
                loss = train_step(model, optimizer, step)
                wandb.log({"train/loss": loss, "train/step": step}, step=step)
                
                if step % config["eval_interval"] == 0:
                    val_metrics = evaluate(model)
                    wandb.log({"val/accuracy": val_metrics["accuracy"]}, step=step)
                
                if step % config["save_interval"] == 0:
                    self._save_checkpoint_artifact(model, step, run)
    
    def _save_checkpoint_artifact(self, model, step: int, run):
        """保存 Checkpoint 为 W&B Artifact"""
        import torch
        artifact = wandb.Artifact(f"checkpoint-{run.id}", type="model",
                                  metadata={"step": step})
        path = f"checkpoints/step_{step}.pt"
        torch.save(model.state_dict(), path)
        artifact.add_file(path)
        run.log_artifact(artifact)
    
    def register_model(self, model_path: str, name: str) -> str:
        """注册模型到 W&B Registry"""
        artifact = wandb.Artifact(name=name, type="model")
        artifact.add_file(model_path)
        artifact.link(f"{self.project}/model-registry/{name}")
        return artifact.version
```

---

## 五、实验追踪 API 模式

### 5.1 统一追踪接口

```python
"""统一实验追踪接口 - 后端可切换"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any
import time

@dataclass
class ExperimentRun:
    run_id: str
    experiment_name: str
    config: dict[str, Any]
    tags: list[str] = field(default_factory=list)
    start_time: float = field(default_factory=time.time)

class ExperimentTracker(ABC):
    """实验追踪抽象接口"""
    @abstractmethod
    def start_run(self, name: str, config: dict) -> ExperimentRun: ...
    @abstractmethod
    def log_metrics(self, metrics: dict[str, float], step: int | None = None): ...
    @abstractmethod
    def log_params(self, params: dict[str, Any]): ...
    @abstractmethod
    def log_artifact(self, path: str, name: str | None = None): ...
    @abstractmethod
    def end_run(self): ...

class MLflowTracker(ExperimentTracker):
    """MLflow 实现"""
    def start_run(self, name: str, config: dict) -> ExperimentRun:
        import mlflow
        run = mlflow.start_run(run_name=name)
        mlflow.log_params(config)
        return ExperimentRun(run_id=run.info.run_id,
                             experiment_name=name, config=config)
    
    def log_metrics(self, metrics: dict[str, float], step: int | None = None):
        import mlflow
        mlflow.log_metrics(metrics, step=step)
    
    def log_params(self, params: dict[str, Any]):
        import mlflow
        mlflow.log_params(params)
    
    def log_artifact(self, path: str, name: str | None = None):
        import mlflow
        mlflow.log_artifact(path)
    
    def end_run(self):
        import mlflow
        mlflow.end_run()

class WandBTracker(ExperimentTracker):
    """W&B 实现"""
    def start_run(self, name: str, config: dict) -> ExperimentRun:
        import wandb
        run = wandb.init(project="ai-experiments", name=name, config=config)
        return ExperimentRun(run_id=run.id, experiment_name=name, config=config)
    
    def log_metrics(self, metrics: dict[str, float], step: int | None = None):
        import wandb
        wandb.log(metrics, step=step)
    
    def log_params(self, params: dict[str, Any]):
        import wandb
        wandb.config.update(params)
    
    def log_artifact(self, path: str, name: str | None = None):
        import wandb
        artifact = wandb.Artifact(name=name or "artifact", type="model")
        artifact.add_file(path)
        wandb.log_artifact(artifact)
    
    def end_run(self):
        import wandb
        wandb.finish()

# 使用: 切换后端只需改一行
tracker: ExperimentTracker = MLflowTracker()  # 或 WandBTracker()
```

---

## 六、数据版本控制

### 6.1 DVC: 数据版本控制

```python
"""DVC 数据版本控制模式"""
import subprocess
import json
from pathlib import Path
from dataclasses import dataclass

@dataclass
class DataVersion:
    path: str
    md5: str
    size: int

class DVCManager:
    """DVC 数据版本管理器"""
    
    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path)
    
    def track_dataset(self, data_path: str) -> DataVersion:
        """将数据文件纳入 DVC 版本控制"""
        subprocess.run(["dvc", "add", data_path], cwd=self.repo_path, check=True)
        dvc_file = Path(f"{data_path}.dvc")
        meta = json.loads(dvc_file.read_text())
        return DataVersion(path=data_path, md5=meta["outs"][0]["md5"],
                          size=meta["outs"][0]["size"])
    
    def create_pipeline_stage(self, name: str, cmd: str,
                              deps: list[str], outs: list[str]) -> None:
        """定义 DVC Pipeline Stage"""
        args = ["dvc", "stage", "add", "-n", name, "-f"]
        for dep in deps:
            args.extend(["-d", dep])
        for out in outs:
            args.extend(["-o", out])
        args.append(cmd)
        subprocess.run(args, cwd=self.repo_path, check=True)
    
    def reproduce(self, target: str | None = None) -> None:
        """复现数据管道"""
        args = ["dvc", "repro"] + ([target] if target else [])
        subprocess.run(args, cwd=self.repo_path, check=True)
    
    def push_data(self, remote: str = "origin") -> None:
        subprocess.run(["dvc", "push", "-r", remote], cwd=self.repo_path, check=True)
    
    def pull_data(self, remote: str = "origin") -> None:
        subprocess.run(["dvc", "pull", "-r", remote], cwd=self.repo_path, check=True)
```

```yaml
# dvc.yaml - Pipeline 定义
stages:
  preprocess:
    cmd: python src/data/preprocess.py
    deps:
      - data/raw/train.jsonl
      - src/data/preprocess.py
    params:
      - preprocess.max_length
      - preprocess.min_quality
    outs:
      - data/processed/train.parquet

  train:
    cmd: python src/train.py
    deps:
      - data/processed/train.parquet
      - src/train.py
    params:
      - train.learning_rate
      - train.epochs
    outs:
      - outputs/model.pt
    metrics:
      - outputs/metrics.json:
          cache: false
```

### 6.2 LakeFS: Git-like 数据湖版本控制

```python
"""LakeFS: 数据湖的 Git 分支模型"""
from lakefs_sdk.client import LakeFSClient
from lakefs_sdk.models import BranchCreation, CommitCreation

class LakeFSManager:
    def __init__(self, endpoint: str, access_key: str, secret_key: str):
        self.client = LakeFSClient(lakefs_sdk.Configuration(
            host=endpoint, username=access_key, password=secret_key))
    
    def create_experiment_branch(self, repo: str, name: str) -> str:
        """从 main 创建实验分支 (类似 git checkout -b)"""
        branch = f"experiment/{name}"
        self.client.branches.create_branch(repository=repo,
            branch_creation=BranchCreation(name=branch, source="main"))
        return branch
    
    def commit_and_merge(self, repo: str, branch: str, message: str) -> None:
        """提交并合并到 main (类似 git merge)"""
        self.client.commits.commit(repository=repo, branch=branch,
            commit_creation=CommitCreation(message=message))
        self.client.refs.merge_into_branch(
            repository=repo, destination_ref="main", source_ref=branch)
```

### 6.3 数据版本控制对比

| 维度 | DVC | LakeFS | Delta Lake |
|------|-----|--------|-----------|
| 模型 | 文件级 | 对象存储级 | 表级 |
| 分支 | 通过 Git | 原生 | 无 |
| 适用数据量 | GB-TB | TB-PB | TB-PB |
| 适用场景 | 中小数据集 | 数据湖 | 数据仓库 |

---

## 七、配置管理

### 7.1 Hydra + OmegaConf

```python
"""Hydra 配置管理模式"""
import hydra
from omegaconf import DictConfig, OmegaConf
from dataclasses import dataclass, field
from hydra.core.config_store import ConfigStore
from hydra.utils import instantiate

# ===== 模式 1: 结构化配置 (类型安全) =====
@dataclass
class ModelConfig:
    _target_: str = "myproject.models.TransformerModel"
    hidden_size: int = 4096
    num_layers: int = 32
    num_heads: int = 32
    dropout: float = 0.1

@dataclass
class TrainingConfig:
    learning_rate: float = 1e-4
    batch_size: int = 32
    max_steps: int = 100_000
    warmup_steps: int = 2000
    optimizer: str = "adamw"

@dataclass
class ExperimentConfig:
    model: ModelConfig = field(default_factory=ModelConfig)
    training: TrainingConfig = field(default_factory=TrainingConfig)
    seed: int = 42
    output_dir: str = "outputs/${now:%Y-%m-%d_%H-%M-%S}"

cs = ConfigStore.instance()
cs.store(name="config", node=ExperimentConfig)

# ===== 模式 2: 使用 Hydra 装饰器 =====
@hydra.main(version_base=None, config_path="configs", config_name="config")
def main(cfg: DictConfig) -> None:
    print(OmegaConf.to_yaml(cfg))
    model = instantiate(cfg.model)  # 通过 _target_ 实例化
    lr = cfg.training.learning_rate

if __name__ == "__main__":
    main()
```

```bash
# Hydra 命令行覆盖
python train.py model.hidden_size=8192 training.learning_rate=5e-5 seed=123

# 多运行 (超参搜索)
python train.py --multirun training.learning_rate=1e-4,5e-5,1e-5

# 使用配置组
python train.py model=llama-70b training=finetune
```

### 7.2 配置管理对比

| 工具 | 类型安全 | 组合能力 | CLI 覆盖 | 适用场景 |
|------|---------|---------|---------|---------|
| Hydra | 结构化配置 | 配置组 | 强大 | 研究/实验 |
| OmegaConf | 结构化配置 | 插值 | 中 | 配置库 |
| Pydantic | 强类型 | 嵌套 | 需额外 | 生产服务 |
| dynaconf | 中 | 环境感知 | 中 | 多环境部署 |

---

## 八、测试模式

### 8.1 数据测试

```python
"""数据质量测试模式"""
import pytest
import pandas as pd
import numpy as np

class TestDataQuality:
    """数据质量测试套件"""
    
    @pytest.fixture
    def training_data(self) -> pd.DataFrame:
        return pd.read_parquet("data/processed/train.parquet")
    
    # ===== 模式 1: Schema 测试 =====
    def test_schema_completeness(self, training_data):
        required = {"user_id", "text", "label", "timestamp"}
        missing = required - set(training_data.columns)
        assert not missing, f"Missing columns: {missing}"
    
    # ===== 模式 2: 数据完整性 =====
    def test_no_null_in_critical_columns(self, training_data):
        for col in ["user_id", "text", "label"]:
            assert training_data[col].isnull().sum() == 0
    
    def test_label_distribution(self, training_data):
        label_counts = training_data["label"].value_counts(normalize=True)
        assert label_counts.min() > 0.05, "Label imbalance detected"
    
    # ===== 模式 3: 数据泄漏检测 =====
    def test_no_data_leakage(self, training_data):
        test_data = pd.read_parquet("data/processed/test.parquet")
        overlap = set(training_data["user_id"]) & set(test_data["user_id"])
        assert len(overlap) / len(test_data) < 0.01
    
    # ===== 模式 4: 分布漂移 (PSI) =====
    def test_feature_distribution_stability(self, training_data):
        mid = len(training_data) // 2
        first_half = training_data.iloc[:mid]
        second_half = training_data.iloc[mid:]
        for col in ["text_length", "label"]:
            psi = self._calculate_psi(first_half[col], second_half[col])
            assert psi < 0.2, f"Distribution drift in {col}: PSI={psi:.3f}"
    
    @staticmethod
    def _calculate_psi(expected: pd.Series, actual: pd.Series, bins: int = 10) -> float:
        breakpoints = np.linspace(
            min(expected.min(), actual.min()),
            max(expected.max(), actual.max()), bins + 1)
        exp_pcts = np.histogram(expected, bins=breakpoints)[0] / len(expected)
        act_pcts = np.histogram(actual, bins=breakpoints)[0] / len(actual)
        exp_pcts = np.clip(exp_pcts, 1e-6, None)
        act_pcts = np.clip(act_pcts, 1e-6, None)
        return float(np.sum((act_pcts - exp_pcts) * np.log(act_pcts / exp_pcts)))
```

### 8.2 模型测试

```python
"""模型测试模式"""
import pytest
import torch
import numpy as np

class TestModelBehavior:
    @pytest.fixture
    def model(self):
        model = torch.load("outputs/model.pt", weights_only=True)
        model.eval()
        return model
    
    def test_deterministic_output(self, model):
        """相同输入产生相同输出"""
        inp = torch.randn(1, 128)
        with torch.no_grad():
            assert torch.allclose(model(inp), model(inp), atol=1e-6)
    
    def test_output_range(self, model):
        """输出无 NaN/Inf，范围合理"""
        with torch.no_grad():
            outputs = model(torch.randn(100, 128))
        assert not torch.isnan(outputs).any()
        assert not torch.isinf(outputs).any()
        assert outputs.abs().max() < 100
    
    def test_inference_latency(self, model):
        """推理延迟在 SLO 内"""
        import time
        inp = torch.randn(1, 128)
        for _ in range(10):  # warmup
            model(inp)
        times = []
        for _ in range(100):
            start = time.perf_counter()
            with torch.no_grad():
                model(inp)
            times.append(time.perf_counter() - start)
        assert np.percentile(times, 95) < 0.05, "P95 latency > 50ms"
    
    def test_model_version_consistency(self, model):
        """输出与 golden reference 一致"""
        golden_in = torch.load("tests/golden/inputs.pt")
        golden_out = torch.load("tests/golden/outputs.pt")
        with torch.no_grad():
            assert torch.allclose(model(golden_in), golden_out, atol=1e-4)
```

### 8.3 集成测试

```python
"""端到端集成测试"""
import pytest
from fastapi.testclient import TestClient

class TestInferenceServiceIntegration:
    @pytest.fixture
    def client(self):
        from myproject.inference.server import app
        return TestClient(app)
    
    def test_health_check(self, client):
        assert client.get("/health").status_code == 200
    
    def test_inference_endpoint(self, client):
        resp = client.post("/v1/completions", json={
            "prompt": "What is ML?", "max_tokens": 100})
        assert resp.status_code == 200
        assert len(resp.json()["choices"][0]["text"]) > 0
    
    def test_streaming_endpoint(self, client):
        with client.stream("POST", "/v1/completions",
                          json={"prompt": "Hello", "stream": True}) as resp:
            tokens = [l[6:] for l in resp.iter_lines()
                     if l.startswith("data: ") and l != "data: [DONE]"]
            assert len(tokens) > 0
    
    def test_input_validation(self, client):
        resp = client.post("/v1/completions", json={"prompt": ""})
        assert resp.status_code == 422
```

---

## 九、工具对比表

### MLOps 工具全景

| 类别 | 工具 | 开源 | 核心优势 | 适用规模 |
|------|------|------|---------|---------|
| Feature Store | Feast | 是 | 简单、云原生 | 中小 |
| Feature Store | Tecton | 否 | 实时、企业级 | 大 |
| Pipeline | Prefect | 是 | Python 原生、易用 | 中 |
| Pipeline | Airflow | 是 | 成熟、生态大 | 大 |
| Pipeline | Kubeflow | 是 | K8s 原生 | 大 |
| Pipeline | Dagster | 是 | 数据资产、可观测 | 中大 |
| Registry | MLflow | 是 | 全功能、简单 | 中小 |
| Registry | W&B | 否 | 可视化、协作 | 中大 |
| 数据版本 | DVC | 是 | Git 集成、简单 | 中小 |
| 数据版本 | LakeFS | 是 | 数据湖原生 | 大 |
| 配置 | Hydra | 是 | 组合、CLI 覆盖 | 研究 |
| 配置 | Pydantic | 是 | 类型安全 | 生产 |
| 测试 | pytest | 是 | 通用测试框架 | 所有 |

---
## 十、最佳实践

### 10.1 MLOps 编码原则

1. **接口抽象** — 所有外部服务通过接口访问，后端可切换
2. **配置外置** — 代码中不硬编码路径、参数、密钥
3. **幂等操作** — Pipeline 步骤可安全重跑
4. **版本一切** — 数据、代码、配置、模型全部版本化
5. **测试左移** — 数据测试在 Pipeline 早期执行
6. **可复现** — 任何实验可以一键复现
7. **渐进式** — 从简单开始，按需引入工具

### 10.2 项目成熟度模型

| Level | 阶段 | 特征 |
|-------|------|------|
| 1 | 手动 (Notebook) | 无版本控制，无测试 |
| 2 | 基础自动化 | Git + DVC + 简单 Pipeline + MLflow |
| 3 | 标准化 | CI/CD + 配置管理 + 测试 + Model Registry |
| 4 | 平台化 | Feature Store + 自动 Pipeline + 监控 + A/B |
| 5 | 智能化 | 自动超参 + 自动部署 + 漂移检测 |

---

## 十一、2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| AI-native Pipeline | LLM 辅助 Pipeline 构建 | 降低 MLOps 门槛 |
| 统一可观测性 | 实验追踪 + 生产监控融合 | 全生命周期可见 |
| Feature Store 简化 | 嵌入式 Feature Store | 减少基础设施 |
| 声明式 MLOps | YAML/DSL 定义全流程 | 减少样板代码 |
| 数据合约 (Data Contracts) | 生产者-消费者契约 | 数据质量保障 |
| 模型即代码 | 模型版本 = Git commit | 简化版本管理 |

---
## 十二、相关概念

- [[16_编程/01_编程基础/03_Python_for_AI_2026]] — Python for AI 2026
- [[16_编程/01_编程基础/04_Rust_for_AI_基础设施]] — Rust for AI 基础设施
- [[16_编程/01_编程基础/01_AI编程2026指南]] — AI 编程工具全景
- [[GPU_Cluster_Operations_2026]] — GPU 集群运维
- [[13_运维/02_SRE与可靠性/20_模型服务_SLA_Management]] — 模型服务 SLA 管理
- [[13_运维/02_SRE与可靠性/22_SRE_for_AI_系统]] — AI 系统 SRE 实践
