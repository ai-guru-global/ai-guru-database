---
title: "MLOps Engineer 面试指南"
category: "21-interviews-mlops-engineer"
tags: ["interviews", "career", "experience", "practitioners", "mlops", "ci-cd", "kubernetes", "model-serving", "monitoring", "model-registry", "feature-store", "llm-ops"]
summary: "MLOps Engineer 面试全流程指南，覆盖 ML 生命周期管理、CI/CD Pipeline、模型服务化、监控告警、模型注册表、Feature Store、Kubernetes 部署和 LLMOps。适用于 Google、Meta、Amazon、Uber、Netflix 等公司的 MLOps 岗位。"
created: 2026-05-31
updated: 2026-07-11
tier: supporting
aliases:
  - "MLOps_Engineer"
  - "MLOps Engineer 面试指南"
  - "MLOps_Engineer Interview Guide"
  - "ML Platform Engineer"
sources: []
name_zh: "MLOps Engineer 面试指南"
---

# MLOps Engineer 面试指南

> 中文简称：MLOps Engineer 面试指南

> **一句话理解**: MLOps Engineer 是 ML 工程化的推动者——将 DevOps 的最佳实践扩展到机器学习领域，构建自动化训练-评估-部署-监控的全生命周期 Pipeline，让模型迭代像软件发布一样可靠、快速、可追溯。

---

## Table of Contents

- [1. 岗位定位与核心职责](#1-岗位定位与核心职责)
  - [1.1 岗位定位](#11-岗位定位)
  - [1.2 核心职责](#12-核心职责)
  - [1.3 核心技能栈](#13-核心技能栈)
  - [1.4 与相近岗位的区别](#14-与相近岗位的区别)
- [2. 技术能力要求](#2-技术能力要求)
- [3. 核心知识领域](#3-核心知识领域)
- [4. 高频面试问题](#4-高频面试问题)
- [5. 系统设计题](#5-系统设计题)
- [6. 编程与实操题](#6-编程与实操题)
- [7. 备考策略与学习路径](#7-备考策略与学习路径)
- [8. 行业薪资范围参考](#8-行业薪资范围参考)
- [9. 面试 Checklist](#9-面试-checklist)
- [Related](#related)

---

## 1. 岗位定位与核心职责

### 1.1 岗位定位

MLOps Engineer（机器学习运维工程师）是将 DevOps 方法论应用于机器学习全生命周期的专业岗位。传统的软件 CI/CD 关注代码变更，但 ML 系统的复杂性远超传统软件——不仅代码在变，数据在变，模型在变，甚至"正确"的定义也在随时间变化。

Google 著名的论文《Hidden Technical Debt in Machine Learning Systems》指出，在典型的 ML 系统中，只有约 5% 的代码是核心的 ML 代码，其余 95% 是周边的工程基础设施。MLOps Engineer 的使命就是**构建和管理这 95% 的基础设施**。

MLOps 的核心挑战：
- **数据版本化**: 训练数据的变更需要像代码一样被追踪
- **模型版本化**: 不同版本的模型需要被管理、对比和回滚
- **实验追踪**: 数百次实验的超参数、指标和产出需要被系统记录
- **可复现性**: 训练过程需要在不同环境和时间点被精确复现
- **持续训练**: 模型需要在新数据可用时自动重训练
- **持续部署**: 新模型需要经过评估后自动部署到生产
- **模型监控**: 上线后需要持续监控性能退化（漂移）
- **合规审计**: 金融、医疗等领域的模型决策需要可审计

### 1.2 核心职责

| 职责领域 | 具体内容 | 交付物 |
|---------|---------|--------|
| **CI/CD Pipeline** | 构建模型训练-评估-部署的自动化流水线 | Pipeline 配置、DAG |
| **模型注册表** | 管理模型版本、元数据和生命周期 | Model Registry 配置 |
| **Feature Store** | 构建在线/离线特征服务 | Feature Store 架构 |
| **模型服务** | 部署和管理推理服务 | Serving 基础设施 |
| **监控告警** | 建立模型性能监控和漂移检测 | 监控仪表盘 |
| **实验管理** | 构建实验追踪平台 | Experiment Tracking |
| **自动化重训练** | 设计持续训练（CT）机制 | CT Pipeline |
| **成本优化** | 优化训练和推理的计算资源成本 | 成本报告 |

### 1.3 核心技能栈

| 维度 | 关键技能 | 常见工具/框架 |
|------|---------|--------------|
| **CI/CD** | Pipeline 设计、自动化测试、蓝绿/金丝雀部署 | GitHub Actions, Jenkins, GitLab CI |
| **容器化** | Docker、Kubernetes、Helm | Docker, K8s, Helm |
| **实验追踪** | 超参数管理、指标记录、模型对比 | MLflow, W&B, Neptune |
| **模型服务** | 推理引擎、模型格式、API 部署 | TorchServe, TF Serving, Triton, KServe |
| **数据版本** | 数据管道版本化 | DVC, Pachyderm, LakeFS |
| **编排** | Pipeline 依赖管理、调度 | Airflow, Kubeflow, Argo Workflows |
| **监控** | 模型性能监控、漂移检测 | Prometheus, Evidently, Arize |
| **云平台** | 云 ML 服务 | SageMaker, Vertex AI, Azure ML |

### 1.4 与相近岗位的区别

| 岗位 | 核心关注点 | 与 MLOps Engineer 的差异 |
|------|-----------|------------------------|
| **DevOps Engineer** | 软件 CI/CD、基础设施运维 | 不涉及 ML 特有的数据/模型版本化 |
| **ML Engineer** | 模型开发和训练 | 更偏建模，MLOps 更偏工程化 |
| **Data Engineer** | 数据管道和数据仓库 | 更偏数据基础设施，MLOps 更偏模型生命周期 |
| **AI Infra Engineer** | GPU 集群和训练基础设施 | 更偏底层基础设施，MLOps 更偏流程自动化 |
| **AI SRE** | 线上系统可靠性 | 更偏监控和故障处理，MLOps 更偏自动化 |

---

## 2. 技术能力要求

### 基础级 (初级 MLOps Engineer)

- **DevOps 基础**: 理解 CI/CD 概念，会使用 Git、Docker
- **Kubernetes 基础**: 能部署简单的应用到 K8s，理解 Pod、Service、Deployment
- **ML 基础**: 理解模型训练和推理的基本流程
- **实验追踪**: 会使用 MLflow 或 W&B 记录实验
- **Python**: 熟练使用 Python 编写 Pipeline 脚本
- **SQL**: 能编写基本的数据查询和处理

### 进阶级 (中级 MLOps Engineer)

- **端到端 Pipeline**: 能设计和实现从数据到部署的完整 MLOps Pipeline
- **模型服务化**: 能部署和管理推理服务（TorchServe / TF Serving / Triton）
- **实验管理平台**: 能为公司搭建或选型实验管理平台
- **监控体系**: 能建立模型性能监控和漂移检测系统
- **持续训练**: 能设计自动化的重训练 Pipeline
- **Feature Store**: 理解并实践 Feature Store 的设计

### 专家级 (高级 MLOps Engineer)

- **MLOps 架构**: 能为公司级 ML 平台设计整体 MLOps 架构
- **多团队协作**: 能协调 ML、数据、工程团队建立统一的 MLOps 标准
- **成本优化**: 能系统性地优化训练和推理的计算成本
- **合规与治理**: 建立满足金融/医疗合规的模型治理框架
- **前沿跟踪**: 跟踪 MLOps 和 LLMOps 的最新工具和最佳实践

---

## 3. 核心知识领域

### 3.1 ML 生命周期管理

**核心主题**:
- **ML 生命周期**: 数据准备 → 特征工程 → 模型训练 → 评估 → 部署 → 监控 → 重训练
- **与软件生命周期的差异**: 数据和模型的版本化、实验的非确定性
- **持续集成（CI）**: 代码测试、数据验证、模型评估的自动化
- **持续部署（CD）**: 模型部署的蓝绿/金丝雀策略
- **持续训练（CT）**: 基于新数据/时间触发的自动重训练

### 3.2 实验追踪与模型管理

**核心主题**:
- **实验追踪**: 记录每次训练的超参数、代码版本、数据版本、指标、产出
- **工具对比**:
  - MLflow: 开源、通用、可自部署
  - W&B (Weights & Biases): 商业、可视化好、协作强
  - SageMaker / Vertex AI 内置追踪
- **模型注册表（Model Registry）**: 模型版本管理、Stage（Staging/Production/Archived）、审批
- **数据版本化**: DVC、LakeFS、Pachyderm

### 3.3 模型服务化

**核心主题**:
- **推理引擎对比**:
  | 引擎 | 特点 | 适用场景 |
  |------|------|---------|
  | TorchServe | PyTorch 原生 | PyTorch 模型 |
  | TF Serving | TensorFlow 原生 | TF 模型 |
  | NVIDIA Triton | 多框架、高性能 | GPU 推理、多模型 |
  | KServe | K8s 原生、Serverless | 云原生部署 |
  | vLLM | LLM 专用 | 大模型推理 |

- **部署模式**:
  - 实时推理: 低延迟、在线 API
  - 批量推理: 高吞吐、离线处理
  - 流式推理: 数据流上的推理
  - 边缘推理: 设备端部署

- **模型格式**: ONNX、TensorRT、TorchScript、Core ML

### 3.4 Feature Store

**核心主题**:
- **核心概念**: 特征的定义、存储、服务，保证训练-推理一致性
- **架构**:
  - 离线存储: 训练用，批量读取
  - 在线存储: 推理用，低延迟读取
  - 转换逻辑: 共享的特征计算代码
- **Point-in-Time 正确性**: 防止训练时的特征泄露
- **工具**: Feast、Tecton、Databricks Feature Store、SageMaker Feature Store

### 3.5 模型监控与漂移检测

**核心主题**:
- **监控层次**:
  - 基础设施: CPU/GPU 利用率、内存、延迟
  - 模型性能: 准确率、延迟（需要延迟标注）
  - 数据漂移: 输入分布变化
  - 概念漂移: 输入-输出关系变化
  - 预测漂移: 输出分布变化

- **漂移检测方法**: PSI、KS 检验、KL 散度、Wasserstein 距离
- **工具**: Evidently AI、Arize、Fiddler、WhyLabs
- **告警策略**: 基于阈值、基于趋势

### 3.6 Kubernetes 与模型部署

**核心主题**:
- **GPU 调度**: Device Plugin、GPU Sharing、MIG
- **弹性伸缩**: HPA、KEDA（基于自定义指标）
- **模型热加载**: 不中断服务的模型更新
- **多租户**: GPU 资源隔离和共享
- **KServe**: K8s 原生的模型服务框架

### 3.7 LLMOps

大模型时代的 MLOps 扩展。

**核心主题**:
- **与传统 MLOps 的差异**: 模型巨大、推理成本高、输出非确定、评估困难
- **LLM 部署**: vLLM、TensorRT-LLM、SGLang 的部署运维
- **Prompt 版本管理**: Prompt 作为代码资产的管理
- **RAG Pipeline 管理**: 向量库更新、检索质量监控
- **LLM 评估**: 离线评估和在线质量监控
- **成本监控**: Token 消耗追踪和优化

---

## 4. 高频面试问题

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

### 4.1 MLOps 基础 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | MLOps 和传统 DevOps 的核心区别是什么？ | ⭐ | 🔴 |
| 2 | 描述一个完整的 ML 生命周期，从数据到部署到监控 | ⭐ | 🔴 |
| 3 | 什么是持续训练（Continuous Training）？如何设计？ | ⭐⭐ | 🔴 |
| 4 | Training-Serving Skew 是什么？如何防止？ | ⭐⭐ | 🔴 |
| 5 | 模型版本管理和软件版本管理有什么不同？ | ⭐ | 🟡 |
| 6 | 如何保证 ML 训练的可复现性？ | ⭐⭐ | 🟡 |
| 7 | ML 中的技术债务主要体现在哪些方面？ | ⭐⭐ | 🟡 |

### 4.2 Pipeline 与 CI/CD (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 8 | 设计一个 ML 模型的 CI/CD Pipeline | ⭐⭐ | 🔴 |
| 9 | 模型部署的金丝雀策略如何实现？ | ⭐⭐ | 🟡 |
| 10 | 如何自动化测试 ML Pipeline？测试什么？ | ⭐⭐ | 🟡 |
| 11 | 数据验证应该在 Pipeline 的哪个阶段进行？如何做？ | ⭐⭐ | 🟡 |
| 12 | 如何处理 Pipeline 中的失败和重试？ | ⭐ | 🟡 |
| 13 | MLflow 的核心组件有哪些？它的局限是什么？ | ⭐ | 🟢 |

### 4.3 模型服务与部署 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 14 | 对比 TorchServe、TF Serving、Triton 的优缺点 | ⭐⭐ | 🟡 |
| 15 | 如何设计一个支持自动伸缩的推理服务？ | ⭐⭐ | 🔴 |
| 16 | 模型部署到边缘设备有什么特殊考虑？ | ⭐⭐ | 🟢 |
| 17 | 如何实现不中断服务的模型更新（热加载）？ | ⭐⭐ | 🟡 |
| 18 | 如何设计多模型服务架构？ | ⭐⭐ | 🟢 |

### 4.4 监控与漂移 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 19 | 如何检测模型的性能退化？有哪些方法？ | ⭐⭐ | 🔴 |
| 20 | 数据漂移和概念漂移的区别？如何区分？ | ⭐⭐ | 🔴 |
| 21 | 如何监控一个没有延迟标注的模型？ | ⭐⭐ | 🟡 |
| 22 | 发现模型漂移后，自动化重训练的触发条件如何设计？ | ⭐⭐ | 🟡 |
| 23 | 如何设计模型监控的告警策略，减少误报？ | ⭐⭐ | 🟢 |

### 4.5 系统设计与行为 (4 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 24 | 设计一个企业级 ML 平台的完整架构 | ⭐⭐⭐ | 🔴 |
| 25 | 描述一个你从零搭建的 MLOps Pipeline | ⭐⭐ | 🔴 |
| 26 | 你和 ML 团队对部署节奏有分歧时如何处理？ | ⭐⭐ | 🟡 |
| 27 | 你如何推动团队采用 MLOps 最佳实践？ | ⭐⭐ | 🟡 |

---

## 5. 系统设计题

### 5.1 设计企业级 ML 平台

**题目**: 为一家有 100 名 ML 工程师的公司设计企业级 ML 平台。

**考察要点**:

1. **平台架构层次**:
   ```
   用户界面 → 实验管理 → 训练服务 → 模型注册 → 部署服务 → 监控告警
   ```

2. **核心组件**:
   - **实验管理**: MLflow / W&B
   - **训练集群**: Kubernetes + GPU Operator
   - **Feature Store**: Feast / Tecton
   - **模型注册**: MLflow Model Registry
   - **推理服务**: KServe / Triton
   - **监控**: Prometheus + Evidently

3. **Pipeline 自动化**:
   - CI: 代码测试 + 数据验证 + 模型评估
   - CD: 金丝雀部署 + 自动回滚
   - CT: 触发式重训练

4. **多租户与资源管理**:
   - GPU 配额和调度
   - 命名空间隔离
   - 成本分摊

5. **安全与合规**:
   - 模型审批流程
   - 数据访问控制
   - 审计日志

### 5.2 设计持续训练系统

**考察要点**:
1. 触发条件: 时间触发、数据量触发、性能退化触发
2. 数据收集: 新数据的质量验证
3. 训练 Pipeline: 自动化训练 + 评估
4. 模型对比: 新模型 vs 当前生产模型
5. 自动部署: 通过质量门禁后自动上线
6. 回滚机制: 新模型效果差时自动回滚

### 5.3 设计 LLM 应用运维系统

**考察要点**:
1. Prompt 版本管理
2. RAG 知识库更新
3. 推理服务部署（vLLM）
4. 质量监控（LLM-as-Judge）
5. 成本监控（Token 消耗）
6. 安全监控（有害内容率）

---

## 6. 编程与实操题

### 6.1 使用 MLflow 追踪实验

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def train_with_tracking(X_train, y_train, X_test, y_test, params):
    """使用 MLflow 追踪训练实验。"""
    
    # 设置实验
    mlflow.set_experiment("fraud_detection")
    
    with mlflow.start_run():
        # 记录超参数
        mlflow.log_params(params)
        
        # 训练模型
        model = RandomForestClassifier(**params)
        model.fit(X_train, y_train)
        
        # 评估
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        
        # 记录指标
        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_metric("test_samples", len(X_test))
        
        # 记录模型
        mlflow.sklearn.log_model(model, "model")
        
        # 记录数据信息
        mlflow.set_tag("data_version", "v2.1")
        mlflow.set_tag("framework", "sklearn")
        
        return model, accuracy
```

### 6.2 实现模型漂移检测 Pipeline

```python
import numpy as np
from scipy import stats

class ModelDriftMonitor:
    """模型漂移监控 Pipeline。"""
    
    def __init__(self, reference_data, reference_predictions):
        self.ref_data = reference_data
        self.ref_preds = reference_predictions
    
    def check_data_drift(self, current_data, threshold=0.05):
        """检测输入数据分布漂移"""
        drift_results = {}
        
        for column in current_data.columns:
            if current_data[column].dtype in ['float64', 'int64']:
                # 数值列: KS 检验
                stat, p_value = stats.ks_2samp(
                    self.ref_data[column], current_data[column]
                )
                drift_results[column] = {
                    'method': 'KS',
                    'statistic': stat,
                    'p_value': p_value,
                    'drifted': p_value < threshold
                }
            else:
                # 类别列: 卡方检验
                ref_dist = self.ref_data[column].value_counts(normalize=True)
                cur_dist = current_data[column].value_counts(normalize=True)
                # ... 卡方检验
        
        drifted_features = [k for k, v in drift_results.items() if v['drifted']]
        return {
            'drifted_features': drifted_features,
            'drift_ratio': len(drifted_features) / len(drift_results),
            'details': drift_results
        }
    
    def check_prediction_drift(self, current_predictions, threshold=0.05):
        """检测预测分布漂移"""
        stat, p_value = stats.ks_2samp(self.ref_preds, current_predictions)
        return {
            'statistic': stat,
            'p_value': p_value,
            'drifted': p_value < threshold
        }
```

### 6.3 实现金丝雀部署

```python
import random
from dataclasses import dataclass

@dataclass
class CanaryConfig:
    initial_percentage: float = 5.0  # 初始 5% 流量
    increment: float = 5.0  # 每次增加 5%
    max_percentage: float = 100.0
    error_rate_threshold: float = 0.02  # 错误率超过 2% 则回滚
    latency_threshold_ms: float = 500  # P99 延迟超过 500ms 则回滚

class CanaryDeployer:
    """模型金丝雀部署管理器。"""
    
    def __init__(self, config: CanaryConfig):
        self.config = config
        self.current_percentage = config.initial_percentage
        self.metrics = {'errors': 0, 'total': 0, 'latencies': []}
    
    def route_request(self):
        """决定请求路由到新模型还是旧模型"""
        if random.random() * 100 < self.current_percentage:
            return 'canary'
        return 'stable'
    
    def record_result(self, model_version, success, latency_ms):
        """记录请求结果"""
        if model_version == 'canary':
            self.metrics['total'] += 1
            if not success:
                self.metrics['errors'] += 1
            self.metrics['latencies'].append(latency_ms)
    
    def evaluate(self):
        """评估金丝雀表现，决定是否推进或回滚"""
        if self.metrics['total'] < 100:
            return 'waiting'  # 样本不足
        
        error_rate = self.metrics['errors'] / self.metrics['total']
        p99_latency = np.percentile(self.metrics['latencies'], 99)
        
        if error_rate > self.config.error_rate_threshold:
            return 'rollback'
        
        if p99_latency > self.config.latency_threshold_ms:
            return 'rollback'
        
        if self.current_percentage < self.config.max_percentage:
            self.current_percentage = min(
                self.current_percentage + self.config.increment,
                self.config.max_percentage
            )
            return 'promote'
        
        return 'complete'
```

### 6.4 Kubernetes 模型部署配置

```yaml
# Kubernetes Deployment for LLM Inference with vLLM
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
  namespace: ml-serving
spec:
  replicas: 3
  selector:
    matchLabels:
      app: llm-inference
  template:
    metadata:
      labels:
        app: llm-inference
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        resources:
          limits:
            nvidia.com/gpu: 1
            memory: 40Gi
          requests:
            nvidia.com/gpu: 1
            memory: 32Gi
        env:
        - name: MODEL_NAME
          value: "meta-llama/Llama-3-70B"
        - name: TENSOR_PARALLEL_SIZE
          value: "1"
        ports:
        - containerPort: 8000
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 120
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: llm-inference
spec:
  selector:
    app: llm-inference
  ports:
  - port: 80
    targetPort: 8000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: llm-inference-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: llm-inference
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 6.5 实现数据验证 Pipeline

```python
import pandas as pd
from dataclasses import dataclass
from typing import List

@dataclass
class DataValidationRule:
    name: str
    column: str
    rule_type: str  # not_null, unique, range, regex
    params: dict

class DataValidationPipeline:
    """ML Pipeline 的数据验证阶段。"""
    
    def __init__(self, rules: List[DataValidationRule]):
        self.rules = rules
    
    def validate(self, df: pd.DataFrame) -> dict:
        results = {'passed': True, 'violations': [], 'summary': {}}
        
        for rule in self.rules:
            if rule.column not in df.columns:
                results['violations'].append({
                    'rule': rule.name,
                    'error': f"列 {rule.column} 不存在"
                })
                results['passed'] = False
                continue
            
            col = df[rule.column]
            violations = 0
            
            if rule.rule_type == 'not_null':
                violations = col.isnull().sum()
            elif rule.rule_type == 'unique':
                violations = col.duplicated().sum()
            elif rule.rule_type == 'range':
                violations = ((col < rule.params['min']) | 
                              (col > rule.params['max'])).sum()
            
            results['summary'][rule.name] = {
                'violations': int(violations),
                'violation_rate': float(violations) / len(df)
            }
            
            if violations > rule.params.get('max_violations', 0):
                results['passed'] = False
        
        return results
```

---

## 7. 备考策略与学习路径

### 7.1 基础阶段（2-3 个月）

1. **DevOps 基础**:
   - 学习 Docker 和 Kubernetes
   - 理解 CI/CD 概念，实践 GitHub Actions
   - 获取 CKA 或等效知识

2. **ML 基础**:
   - 理解模型训练和推理的基本流程
   - 学习 MLflow 或 W&B 的使用
   - 完成一个简单的 ML 项目

3. **云平台**:
   - 选择一个云平台深入学习（AWS/GCP/Azure）
   - 了解平台的 ML 服务

### 7.2 进阶阶段（2-3 个月）

1. **MLOps 实践**:
   - 构建端到端的 MLOps Pipeline
   - 实践模型部署和监控
   - 学习 Feature Store

2. **工具栈精通**:
   - MLflow、Airflow/Kubeflow、KServe
   - 模型服务框架（TorchServe/Triton）
   - 监控工具（Prometheus/Evidently）

3. **LLMOps**:
   - 学习 LLM 推理部署（vLLM/TGI）
   - 实践 Prompt 版本管理
   - 了解 RAG Pipeline 管理

### 7.3 面试冲刺阶段（1 个月）

1. **系统设计**: 准备 3+ 个 MLOps 系统设计案例
2. **工具对比**: 整理工具选型的对比矩阵
3. **代码实操**: 练习 Pipeline 和监控代码
4. **公司研究**: 了解目标公司的 ML 平台

---

## 8. 行业薪资范围参考

> 以下数据基于 2025-2026 年美国市场，仅供参考。

| 级别 | 公司类型 | 年薪范围 (美元) | 说明 |
|------|---------|---------------|------|
| 初级 (1-3 年) | FAANG / 大型科技公司 | $150K - $230K | DevOps + ML 基础 |
| 中级 (3-6 年) | FAANG / 大型科技公司 | $220K - $380K | 能独立设计 Pipeline |
| 高级 (6+ 年) | FAANG / 大型科技公司 | $330K - $550K+ | ML Platform 架构师 |

**中国市场** (人民币):
- 初级 (1-3 年): 30-60 万
- 中级 (3-6 年): 60-120 万
- 高级 (6+ 年): 120-200 万

---

## 9. 面试 Checklist

- [ ] 能设计端到端的 MLOps Pipeline
- [ ] 理解 Training-Serving Skew 和防止方法
- [ ] 能对比主流模型服务框架
- [ ] 理解模型漂移检测的方法和工具
- [ ] 能设计金丝雀部署策略
- [ ] 会使用 MLflow / W&B 进行实验追踪
- [ ] 能编写 Kubernetes 部署配置
- [ ] 理解 Feature Store 的设计
- [ ] 能设计持续训练系统
- [ ] 了解 LLMOps 的特殊挑战
- [ ] 准备了 MLOps 系统设计案例
- [ ] 能讨论成本优化策略

---

## Related

- [[21_面试岗位/README|AI 面试准备 (Interviews)]]
- [[21_面试岗位/Interview_Guide/jobs|AI 相关岗位与工种清单]]
- [[21_面试岗位/AI_Infrastructure_Engineer/question_bank|AI Infrastructure Engineer 题库]]
- [[21_面试岗位/AI_Reliability_Engineer/AI_Reliability_Engineer|AI Reliability Engineer 面试指南]]
- [[21_面试岗位/Data_Engineer/Data_Engineer|Data Engineer 面试指南]]
- [[21_面试岗位/Machine_Learning_Engineer/question_bank|Machine Learning Engineer 题库]]
- [[21_面试岗位/AI_Evaluation_Engineer/AI_Evaluation_Engineer|AI Evaluation Engineer 面试指南]]

---

*Last updated: 2026-07-11*
