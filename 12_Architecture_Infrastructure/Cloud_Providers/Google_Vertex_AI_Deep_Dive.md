---
title: "Google Vertex AI 深度解析: GCP 统一 AI 平台"
category: "12-architecture-infrastructure"
tags: ["vertex-ai", "google-cloud", "gcp", "ai-platform", "mlops", "gemini", "tpus", "foundation-model", "bigquery"]
summary: "> **一句话理解**: Google Vertex AI 是 GCP 统一的机器学习和生成式 AI 平台，提供模型训练、微调、部署、MLOps 和 Gemini 等基础模型 API，深度集成 TPU、BigQuery 和 Google 生态。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Google Vertex Ai Deep Dive"
  - "Google Vertex AI Deep Dive"
  - Google_Vertex_AI_Deep_Dive

---
# Google Vertex AI 深度解析：GCP 统一 AI 平台

> **一句话理解**: Google Vertex AI 是 GCP 统一的机器学习和生成式 AI 平台，提供模型训练、微调、部署、MLOps 和 Gemini 等基础模型 API，深度集成 TPU、BigQuery 和 Google 生态。

> **官方站点**: https://cloud.google.com/vertex-ai

---

## 目录

1. [产品定位与核心能力](#1-产品定位与核心能力)
2. [生成式 AI 模型](#2-生成式-ai-模型)
3. [模型训练与微调](#3-模型训练与微调)
4. [Vertex AI Pipelines 与 MLOps](#4-vertex-ai-pipelines-与-mlops)
5. [模型部署与推理](#5-模型部署与推理)
6. [RAG 与 Grounding](#6-rag-与-grounding)
7. [与 BigQuery / TPU 集成](#7-与-bigquery--tpu-集成)
8. [典型架构](#8-典型架构)
9. [成本与计费](#9-成本与计费)
10. [生产最佳实践](#10-生产最佳实践)
11. [常见问题](#11-常见问题)
12. [官方资源](#12-官方资源)

---

## 1. 产品定位与核心能力

### 1.1 定位

Vertex AI 是 Google Cloud 提供的**端到端 AI 平台**，把传统 ML（AutoML、自定义训练）和生成式 AI（Gemini、PaLM、Imagen）统一在一个平台上，覆盖数据准备、训练、调优、部署、监控全生命周期。

### 1.2 核心能力

| 能力 | 说明 |
|------|------|
| **基础模型 API** | Gemini、PaLM 2、Imagen、Codey、Embeddings |
| **自定义训练** | 分布式训练、TPU/GPU |
| **模型微调** | Adapter Tuning、RLHF |
| **MLOps** | Pipelines、Experiments、Model Registry |
| **特征平台** | Vertex AI Feature Store |
| **模型监控** | Model Monitoring |
| **RAG** | Grounding with Google Search、Vector Search |

---

## 2. 生成式 AI 模型

| 模型 | 能力 |
|------|------|
| **Gemini 1.5 Pro** | 多模态、长上下文（最高 2M tokens） |
| **Gemini 1.5 Flash** | 高速、低成本 |
| **PaLM 2** | 文本生成、聊天、Embedding |
| **Imagen** | 图像生成与编辑 |
| **Codey** | 代码生成与补全 |
| **Chirp** | 语音转录与合成 |

---

## 3. 模型训练与微调

### 3.1 训练方式

| 方式 | 说明 |
|------|------|
| **AutoML** | 零代码训练表格、图像、文本、视频模型 |
| **自定义训练** | 使用 PyTorch/TensorFlow/XGBoost 自定义代码 |
| **分布式训练** | 多工作器、多 GPU/TPU |
| **微调** | Adapter Tuning、RLHF、蒸馏 |

### 3.2 TPU 训练

Vertex AI 深度集成 Cloud TPU：

```python
from google.cloud import aiplatform

job = aiplatform.CustomJob(
    display_name="llm-training",
    worker_pool_specs=[{
        "machine_spec": {"machine_type": "cloud-tpu", "accelerator_type": "TPU_V5e", "accelerator_count": 8},
        "replica_count": 1,
        "container_spec": {"image_uri": "gcr.io/my-project/llm-train:latest"}
    }]
)
job.run()
```

---

## 4. Vertex AI Pipelines 与 MLOps

### 4.1 Pipelines

基于 Kubeflow Pipelines，支持：

- 可视化 DAG
- 组件复用
- 实验追踪
- 流水线版本管理

### 4.2 Model Registry

集中管理模型版本、评估结果和部署状态。

### 4.3 Feature Store

统一管理训练和推理特征，解决训练-服务偏差。

---

## 5. 模型部署与推理

### 5.1 部署方式

| 方式 | 说明 |
|------|------|
| **Online Prediction** | 实时 REST/gRPC 端点 |
| **Batch Prediction** | 批量异步推理 |
| **Model Garden** | 预训练模型一键部署 |

### 5.2 调用示例

```python
import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="my-project", location="us-central1")
model = GenerativeModel("gemini-1.5-pro-002")
response = model.generate_content("Explain Vertex AI")
print(response.text)
```

---

## 6. RAG 与 Grounding

### 6.1 Grounding

Vertex AI 提供两种 grounding 方式：

- **Google Search Grounding**：基于 Google 搜索实时信息。
- **Vertex AI Vector Search**：基于企业私有向量数据库。

### 6.2 Vector Search

托管向量数据库服务，支持：

- 大规模 Embedding 存储
- 近似最近邻检索
- 与 BigQuery 数据联动

---

## 7. 与 BigQuery / TPU 集成

| 服务 | 集成方式 |
|------|---------|
| **BigQuery** | 直接读取数据仓库，做特征工程和模型输入 |
| **Cloud Storage** | 存储训练数据、模型 artifact |
| **Cloud TPU** | 加速训练和推理 |
| **Dataflow** | 大规模数据预处理 |
| **Cloud Monitoring** | 模型监控和告警 |

---

## 8. 典型架构

```
┌─────────────────────────────────────────┐
│           企业应用 / 数据分析            │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│          Google Vertex AI               │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │ Gemini  │ │Custom   │ │ Vector   │  │
│  │  API    │ │ Model   │ │ Search   │  │
│  └────┬────┘ └────┬────┘ └────┬─────┘  │
│       │            │           │         │
│  BigQuery    Cloud TPU    Cloud Storage │
└─────────────────────────────────────────┘
```

---

## 9. 成本与计费

| 计费项 | 说明 |
|--------|------|
| **模型 API** | 按 token/图像/字符计费 |
| **训练** | 按计算实例小时计费 |
| **推理端点** | 按实例小时或按请求计费 |
| **存储** | Cloud Storage 和 Vector Search 存储费用 |

---

## 10. 生产最佳实践

1. **使用 Model Registry 管理版本**：避免模型漂移。
2. **Feature Store 统一特征**：减少训练-服务偏差。
3. **启用 Model Monitoring**：检测数据漂移和预测异常。
4. **利用 TPU 降低成本**：大规模训练优先 TPU。
5. **VPC-SC 保护数据**：限制数据出站。
6. **混合使用 grounding**：Google Search + 私有 Vector Search。

---

## 11. 常见问题

### Q1: Vertex AI 与 AWS Bedrock/Azure OpenAI 怎么选？

**A**: GCP 生态/需要 TPU/深度 MLOps 选 Vertex AI；多模型或 AWS 生态选 Bedrock；微软生态选 Azure OpenAI。

### Q2: 国内能用 Vertex AI 吗？

**A**: 需要 GCP 全球账号，国内访问需合规网络方案。

### Q3: Gemini 支持多长上下文？

**A**: Gemini 1.5 Pro 支持最高 200 万 tokens 上下文。

### Q4: 可以部署 HuggingFace 模型吗？

**A**: 可以，通过 Custom Training 或 Model Garden 部署。

### Q5: Vector Search 与 Milvus/Qdrant 怎么选？

**A**: GCP 生态内优先 Vertex AI Vector Search；多云/开源优先 Milvus/Qdrant。

### Q6: 如何监控模型性能？

**A**: 使用 Vertex AI Model Monitoring 和 Cloud Monitoring。

### Q7: Pipelines 与 Kubeflow 有什么关系？

**A**: Vertex AI Pipelines 基于 Kubeflow Pipelines，但做了托管化。

### Q8: 训练大模型需要多少 TPU？

**A**: 取决于模型规模，70B 模型通常需要 64-256 个 TPU v5e chip。

---

## 12. 官方资源

- **官网**: https://cloud.google.com/vertex-ai
- **文档**: https://cloud.google.com/vertex-ai/docs
- **Model Garden**: https://cloud.google.com/model-garden
- **Pricing**: https://cloud.google.com/vertex-ai/pricing

---

## Related

- [[_concepts/vertex-ai]] — Google Vertex AI 概念卡片
- [[_concepts/aws-bedrock]] — AWS Bedrock
- [[_concepts/azure-openai]] — Azure OpenAI
- [[_concepts/gemini]] — Gemini
- [[_concepts/cloud-ai-platform]] — 云 AI 平台
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
