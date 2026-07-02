---
title: "Kubeflow"
category: -concepts
tags: ["kubeflow", "kubernetes", "mlops", "pipeline", "notebook", "training", "serving", "katib", "cncf"]
relationships:
  - target: "_concepts/mlops"
    type: extends
  - target: "_concepts/kubernetes"
    type: runs_on
  - target: "_concepts/pipeline"
    type: enables
  - target: "_concepts/kserve"
    type: related_to
  - target: "_concepts/volcano"
    type: related_to
sources:
  - 11_MLOps_Pipeline/Orchestration/Kubeflow_Deep_Dive.md
summary: "Kubeflow 是 CNCF 孵化的 Kubernetes 机器学习工具集，提供 Notebooks、Pipelines、Training、Katib（AutoML）、Serving 等组件，是 K8s 上端到端 MLOps 的主流开源方案。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Kubeflow

---
# Kubeflow

> Kubernetes 上的「机器学习全家桶」——从 Jupyter 到训练流水线再到模型服务的一站式 MLOps 平台。

---

## 1. 一句话定义

**Kubeflow** 是 CNCF 孵化的开源 MLOps 工具集，专为 Kubernetes 设计。它整合了 **Jupyter Notebooks、Pipelines（工作流）、Training Operator（分布式训练）、Katib（超参搜索）、KServe（模型服务）** 等组件，帮助企业构建端到端的机器学习平台。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Notebooks** | K8s 上的 Jupyter 开发环境 |
| **Pipelines** | 基于 Argo 的 DAG 工作流，可视化编排 |
| **Training Operator** | 支持 TFJob、PyTorchJob、MPIJob、XGBoostJob |
| **Katib** | 自动超参数优化与神经架构搜索 |
| **KServe** | 模型服务（可独立使用） |
| **Multi-tenancy** | 基于 K8s Namespace 的隔离 |

---

## 3. 架构组件

```
Kubeflow Platform
  ├── Central Dashboard
  ├── Notebooks (Jupyter)
  ├── Pipelines (Argo Workflows)
  ├── Training Operator
  ├── Katib
  └── KServe
```

---

## 4. 典型场景

1. **企业 MLOps 平台**：统一管理数据科学团队的工作流。
2. **分布式训练编排**：PyTorch/TensorFlow/MPI 分布式训练。
3. **自动化实验管理**：Katib 超参搜索 + Pipelines 自动化。
4. **模型全生命周期**：从开发到部署的一站式平台。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | 运行基座 |
| **KServe** | Kubeflow 生态的模型服务组件 |
| **Volcano / Kueue** | 可替代或增强 Training Operator 的调度能力 |
| **MLflow / W&B** | 实验跟踪，可与 Kubeflow 集成 |
| **Airflow / Argo** | Kubeflow Pipelines 基于 Argo |

---

## 6. 优势与局限

### 优势
- CNCF 背书，生态完整。
- 与 Kubernetes 深度集成。
- 组件可独立使用，灵活组合。

### 局限
- 组件多、部署复杂、学习曲线陡。
- 对 LLM 特定场景（如大模型预训练）需要额外定制。
- UI/UX 相比商业平台略显陈旧。

---

## Related

- [[11_MLOps_Pipeline/Orchestration/Kubeflow_Deep_Dive]] — Kubeflow 深度解析
- [[_concepts/mlops]] — MLOps
- [[_concepts/kubernetes]] — Kubernetes
- [[_concepts/kserve]] — KServe
- [[_concepts/volcano]] — Volcano
- [[_concepts/kueue]] — Kueue
