---
title: "AI Stack + MLflow + ACK 私有化 MLOps 参考架构"
category: 12-architecture-infrastructure
subcategory: ai-stack
tags: ["ai-stack", "mlflow", "ack", "proprietary-cloud", "mlops", "kubernetes", "k8s", "alibaba-cloud"]
summary: "面向阿里云专有云的 AI Stack MLOps 私有化参考架构，覆盖数据验证、训练、实验追踪、模型注册、推理部署与可观测性的完整流水线。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# AI Stack + MLflow + ACK 私有化 MLOps 参考架构

> **一句话理解**: 把 AI Stack 当成私有化 AI 底座，ACK 当调度层，MLflow 当模型与实验中枢，组合成一条端到端的 MLOps 流水线。

## 目录

- [1. 架构总览](#1-架构总览)
- [2. 组件职责](#2-组件职责)
- [3. 数据层](#3-数据层)
- [4. 训练层](#4-训练层)
- [5. 实验追踪与模型注册](#5-实验追踪与模型注册)
- [6. 推理层](#6-推理层)
- [7. 可观测性](#7-可观测性)
- [8. 安全与多租户](#8-安全与多租户)
- [9. 典型工单场景](#9-典型工单场景)
- [10. 部署清单](#10-部署清单)
- [Related](#related)

---

## 1. 架构总览

```text
┌─────────────────────────────────────────────────────────────┐
│                        用户 / 开发者                          │
│                  CLI / Jupyter / PAI-DSW                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   流水线编排 (Airflow/Kubeflow)              │
│        数据验证 → 训练 → 评估 → 注册 → 部署 → 监控          │
└───────┬───────────────┬───────────────┬─────────────────────┘
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
│  数据层       │ │  训练层      │ │  推理层      │
│  OSS/NAS     │ │  ACK + GPU   │ │  ACK + KServe│
│  MaxCompute  │ │  PAI-DLC     │ │  PAI-EAS     │
│  DataWorks   │ │  torchrun    │ │  vLLM/SGLang │
└──────────────┘ └─────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────▼───────────────┐
        │   MLflow（Tracking/Registry）  │
        │   PostgreSQL + OSS/NAS        │
        └───────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    可观测性                                  │
│   Prometheus/Grafana + ARMS + SLS + ASCM 告警中心           │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 组件职责

| 组件 | 职责 | 私有化形态 |
|------|------|-----------|
| **AI Stack** | 私有化 AI 一体机底座，含模型管理、GPU 监控、训练/推理启动器 | 一体机/集群 |
| **ACK 专有云** | 容器编排与 GPU 资源调度 | ACK 专有版/敏捷版 |
| **MLflow** | 实验追踪、参数/指标记录、模型版本注册 | ACK 部署 |
| **PostgreSQL** | MLflow Tracking 元数据库 | RDS / 自建 |
| **OSS/NAS** | 数据集、模型权重、Artifact 存储 | 盘古对象/文件存储 |
| **Airflow/Kubeflow** | 流水线编排 | ACK 上部署 |
| **PAI-DLC/EAS** | 可选的训练/推理托管组件 | 私有化 PAI |

---

## 3. 数据层

### 3.1 数据流

```text
数据源（业务系统 / 日志 / DataWorks）
   ↓
数据湖（OSS / MaxCompute）
   ↓
数据验证（Great Expectations / Pandera / Evidently）
   ↓
特征/训练集 → MLflow Artifact / NAS
```

### 3.2 数据验证门禁

```yaml
# Airflow DAG 片段
validate_data = KubernetesPodOperator(
    task_id="validate-data",
    namespace="mlops",
    image="ge-validate:latest",
    cmds=["python", "validate.py"],
    env_vars={"MLFLOW_TRACKING_URI": "http://mlflow.mlops.svc:5000"},
)
```

---

## 4. 训练层

### 4.1 ACK 训练任务

```yaml
apiVersion: kubeflow.org/v1
kind: PyTorchJob
metadata:
  name: llm-finetune-qwen2
  namespace: training
spec:
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      template:
        spec:
          containers:
            - name: pytorch
              image: ai-stack-training:latest
              command:
                - torchrun
                - --nproc_per_node=8
                - train.py
                - --model Qwen2-7B
                - --mlflow_uri http://mlflow.mlops.svc:5000
              resources:
                limits:
                  nvidia.com/gpu: "8"
```

### 4.2 AI Stack 训练启动器

```bash
# 使用 AI Stack 启动器
ai-stack train \
  --framework swift \
  --model /models/Qwen2-7B \
  --dataset /data/sft.jsonl \
  --gpus 8 \
  --mlflow-tracking-uri http://mlflow.mlops.svc:5000 \
  --experiment-name qwen2-sft
```

---

## 5. 实验追踪与模型注册

### 5.1 MLflow Tracking Server

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mlflow
  namespace: mlops
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mlflow
  template:
    spec:
      containers:
        - name: mlflow
          image: mlflow:latest
          env:
            - name: MLFLOW_BACKEND_STORE_URI
              value: postgresql://mlflow:xxx@postgres:5432/mlflow
            - name: MLFLOW_DEFAULT_ARTIFACT_ROOT
              value: oss://mlflow-artifacts/
          ports:
            - containerPort: 5000
```

### 5.2 模型注册流程

```python
import mlflow

mlflow.set_tracking_uri("http://mlflow.mlops.svc:5000")
mlflow.set_experiment("qwen2-sft")

with mlflow.start_run():
    mlflow.log_params({"lr": 1e-5, "epochs": 3})
    mlflow.log_metrics({"loss": 0.23})
    mlflow.pytorch.log_model(model, "model")
    mlflow.register_model(
        model_uri=f"runs:/{mlflow.active_run().info.run_id}/model",
        name="qwen2-7b-sft"
    )
```

---

## 6. 推理层

### 6.1 KServe + vLLM

```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: qwen2-7b
  namespace: serving
spec:
  predictor:
    containers:
      - name: kserve-container
        image: vllm-serve:latest
        args:
          - --model
          - /mnt/models/qwen2-7b
          - --tensor-parallel-size
          - "2"
        resources:
          limits:
            nvidia.com/gpu: "2"
```

### 6.2 模型从 MLflow 加载

```python
import mlflow.pyfunc

model = mlflow.pyfunc.load_model("models:/qwen2-7b-sft/Production")
```

---

## 7. 可观测性

| 层级 | 指标 | 工具 |
|------|------|------|
| 基础设施 | GPU 利用率、显存、温度 | DCGM Exporter、AI Stack GPU 监控 |
| K8s | Pod 状态、调度、HPA | kube-state-metrics、Prometheus |
| 训练 | loss、lr、throughput | MLflow、TensorBoard、W&B |
| 推理 | TTFT、TPOT、QPS、错误率 | vLLM metrics、Prometheus |
| 数据 | 漂移、schema 违规 | Evidently、Great Expectations |
| 告警 | ASCM 告警中心、钉钉/短信 | ARMS/SLS 告警 |

---

## 8. 安全与多租户

- **命名空间隔离**: 按团队/项目划分 Namespace + ResourceQuota
- **RBAC**: 限制对 MLflow、模型仓库的访问
- **镜像安全**: ACR 镜像扫描、只读 rootfs
- **Secret 管理**: 数据库密码、OSS AK 用 KMS/SealedSecret
- **网络隔离**: 训练/推理/服务网络分区

---

## 9. 典型工单场景

### 9.1 MLflow Tracking Server 不可达

参考 [[11_模型运维/12_Troubleshooting/MLflow_Tracking_Server_Unreachable|MLflow Tracking Server 不可达排障]]。

### 9.2 训练任务 Pod Pending

1. `kubectl describe node` 看 GPU 资源
2. `kubectl logs` 看镜像拉取/启动错误
3. 检查 Volcano scheduler queue
4. 检查 HAMi/MIG 配额

### 9.3 推理服务延迟高

参考 [[13_运维/02_SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook|LLM 推理延迟/不可用 Runbook]]。

---

## 10. 部署清单

| 组件 | 部署方式 | 验证命令 |
|------|---------|---------|
| ACK 集群 | 阿里云专有云控制台 | `kubectl get nodes` |
| GPU Operator | Helm | `kubectl get pods -n gpu-operator` |
| MLflow | Helm/ACK 应用 | `curl http://mlflow:5000/health` |
| PostgreSQL | RDS/Helm | `psql -h postgres -U mlflow` |
| Airflow | Helm | `kubectl get pods -n airflow` |
| KServe | Helm | `kubectl get inferenceservice` |
| Prometheus/Grafana | ACK 可观测插件 | `kubectl get svc -n monitoring` |

---

## Related

- [[概念/ai-stack|AI Stack]]
- [[概念/ack|ACK]]
- [[概念/mlflow|MLflow]]
- [[概念/mlops|MLOps]]
- [[概念/kserve|KServe]]
- [[11_模型运维/12_Troubleshooting/MLflow_Tracking_Server_Unreachable|MLflow Tracking Server 不可达排障]]
- [[12_架构基建/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_架构基建/AI_Stack_Training_Launchers_Guide|AI Stack 训练启动器指南]]

- [[12_架构基建/README|架构与基础设施 (Architecture & Infrastructure)]]
