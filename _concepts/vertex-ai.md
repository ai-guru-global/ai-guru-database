---
title: "Google Vertex AI"
category: concept
tags: ["vertex-ai", "google-cloud", "gcp", "ai-platform", "mlops", "foundation-model", "gemini", "tpus"]
relationships:
  - target: "_concepts/cloud-ai-platform"
    type: extends
  - target: "_concepts/gemini"
    type: provides
  - target: "_concepts/aws-bedrock"
    type: related_to
  - target: "_concepts/azure-openai"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/Google_Vertex_AI_Deep_Dive.md
summary: "Google Vertex AI 是 GCP 统一的机器学习和生成式 AI 平台，提供模型训练、微调、部署、MLOps 和 Gemini 等基础模型 API，深度集成 TPU 和 BigQuery。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# Google Vertex AI

> GCP 的「统一 AI 工作台」——从数据准备、模型训练到推理部署和 MLOps 全流程覆盖。

---

## 1. 一句话定义

**Google Vertex AI** 是 Google Cloud 提供的**统一机器学习和生成式 AI 平台**，覆盖数据准备、模型训练、超参调优、部署、监控和 MLOps。它提供 Gemini、PaLM、Imagen、Codey 等基础模型 API，同时支持自定义模型训练和 TPU 加速。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **生成式 AI 模型** | Gemini、PaLM 2、Imagen、Codey、Embeddings |
| **模型训练** | AutoML、自定义训练、分布式训练 |
| **模型微调** | 适配器微调（Adapter Tuning）、RLHF |
| **模型部署** | 在线预测、批量预测 |
| **MLOps** | Pipelines、Experiments、Model Registry、Feature Store |
| **TPU/GPU** | 深度集成 Cloud TPU 和 NVIDIA GPU |
| **BigQuery 集成** | 数据仓库与 AI 平台联动 |

---

## 3. 典型场景

1. **Gemini 应用开发**：多模态理解和生成。
2. **企业 MLOps**：端到端模型生命周期管理。
3. **大模型微调**：基于企业数据微调 PaLM/Gemini。
4. **推荐与搜索**：结合 BigQuery 和 Vertex AI Feature Store。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Gemini** | Google 旗舰多模态模型 |
| **BigQuery** | Vertex AI 可直接读取 BigQuery 数据 |
| **Cloud TPU** | Vertex AI 训练可用 TPU |
| **AWS Bedrock** | 竞品，Bedrock 更偏基础模型 API |
| **Azure OpenAI** | 竞品，Azure OpenAI 更偏 GPT 生态 |
| **Kubeflow** | Vertex AI Pipelines 基于 Kubeflow Pipelines |

---

## 5. 优势与局限

### 优势
- 与 GCP 数据栈（BigQuery、GCS）集成好。
- TPU 训练成本优势。
- MLOps 功能完整。

### 局限
- 国内使用受网络和政策限制。
- 部分高级功能绑定 GCP 生态。
- 企业级市场份额不如 Azure OpenAI。

---

## Related

- [[12_Architecture_Infrastructure/Google_Vertex_AI_Deep_Dive]] — Google Vertex AI 深度解析
- [[_concepts/cloud-ai-platform]] — 云 AI 平台
- [[_concepts/gemini]] — Gemini
- [[_concepts/aws-bedrock]] — AWS Bedrock
- [[_concepts/azure-openai]] — Azure OpenAI
