---
title: "Google Vertex AI"
category: -concepts
tags: ["vertex-ai", "google-cloud", "gcp", "ai-platform", "mlops", "foundation-model", "gemini", "tpus"]
relationships:
  - target: "概念/cloud-ai-platform"
    type: extends
  - target: "概念/gemini"
    type: provides
  - target: "概念/aws-bedrock"
    type: related_to
  - target: "概念/azure-openai"
    type: related_to
sources:
  - 12_架构基建/Google_Vertex_AI_Deep_Dive.md
summary: "Google Vertex AI 是 GCP 统一的机器学习和生成式 AI 平台，提供模型训练、微调、部署、MLOps 和 Gemini 等基础模型 API，深度集成 TPU 和 BigQuery。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Vertex Ai"
  - "vertex ai"

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

- [[12_架构基建/Google_Vertex_AI_Deep_Dive]] — Google Vertex AI 深度解析
- [[概念/cloud-ai-platform]] — 云 AI 平台
- [[概念/gemini]] — Gemini
- [[概念/aws-bedrock]] — AWS Bedrock
- [[概念/azure-openai]] — Azure OpenAI

---

## 2026 Vertex AI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Vertex AI** | GCP AI 平台 | GA |
| **Gemini 系列** | Google Gemini 模型 | GA |
| **Model Garden** | 模型市场 | GA |
| **Vertex AI Search** | 企业搜索 | GA |
| **Vertex AI Agent** | Agent 构建 | GA |

## 生产最佳实践

1. **GCP 环境**：GCP 环境用 Vertex AI
2. **Gemini 模型**：Google 模型用 Gemini
3. **Model Garden**：从 Model Garden 选择模型
4. **Vertex AI Search**：企业搜索用 Vertex AI Search
5. **与 AWS/Azure 对比**：根据云环境选择平台

## API 调用示例

```python
import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="my-project", location="us-central1")
model = GenerativeModel("gemini-2.5-pro")

response = model.generate_content(
    "解释量子计算",
    generation_config={"temperature": 0.7, "max_output_tokens": 1024}
)
print(response.text)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 权限错误 | IAM 配置不当 | 检查 Vertex AI User 角色 |
| 模型不可用 | 区域限制 | 检查区域可用性 |
| 配额超限 | QPM/TPM 限制 | 申请配额提升 |
| 延迟高 | 区域距离远 | 就近区域部署 |
| 成本高 | 大模型过度使用 | 小模型分流 + 缓存 |

## 版本兼容性

| 服务 | 状态 | 说明 |
|------|------|------|
| Gemini 2.5 Pro | GA | 最强多模态 |
| Gemini 2.5 Flash | GA | 性价比 |
| Model Garden | GA | 150+ 模型 |
| Vertex AI Search | GA | 企业搜索 |
| Vertex AI Agent Builder | GA | Agent 构建 |

## 生产检查清单

1. 配置 VPC Service Controls 数据安全
2. 启用数据加密和访问审计
3. 设置 Cloud Monitoring 告警
4. 配置 IAM 最小权限
5. 建立成本预算和告警
6. 多区域部署确保高可用

## 总结

Vertex AI 是 GCP 生态的统一 AI 平台，Gemini 系列模型在多模态和长上下文方面具有独特优势。对于已在使用 GCP 的企业，Vertex AI 是最自然的 AI 接入方式。

> 💡 Vertex AI 的核心优势：Gemini 的 2M 上下文窗口和多模态能力是其独特卖点，适合长文档分析、视频理解等场景。

## Vertex AI 服务矩阵

| 服务 | 功能 | 适用场景 |
|------|------|----------|
| Gemini API | 多模态推理 | 通用 AI 应用 |
| Model Garden | 开源模型托管 | 自定义部署 |
| AutoML | 自动机器学习 | 结构化数据 |
| Feature Store | 特征存储 | 推荐/风控 |
| Pipelines | ML 工作流 | 自动化训练 |
| Endpoints | 推理服务 | 生产部署 |

## 生产检查清单

1. ✅ 使用区域端点降低延迟
2. ✅ 配置配额限制防止超支
3. ✅ 启用 VPC Service Controls
4. ✅ 模型版本固定 + 回滚机制
5. ✅ 监控 token 消耗和延迟
6. ✅ 评估 Gemini vs 开源模型成本效益

## 版本兼容性

| 组件 | 版本 | 状态 |
|------|------|------|
| google-cloud-aiplatform | ≥ 1.50 | GA |
| Gemini API | v1.5 | GA |
| Vertex AI SDK | 2.x | GA |

> 💡 Vertex AI 的核心价值：GCP 生态的 AI 统一平台——从训练到部署到监控，一站式管理 ML 生命周期。

