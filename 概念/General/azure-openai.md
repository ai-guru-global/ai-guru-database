---
title: "Azure OpenAI"
category: -concepts
tags: ["azure-openai", "microsoft", "azure", "cloud", "openai", "gpt", "enterprise", "api"]
relationships:
  - target: "概念/cloud-ai-platform"
    type: extends
  - target: "概念/openai"
    type: related_to
  - target: "概念/aws-bedrock"
    type: related_to
  - target: "概念/vertex-ai"
    type: related_to
sources:
  - 架构基建/Azure_OpenAI_Deep_Dive.md
summary: "Azure OpenAI 是微软与 OpenAI 合作推出的企业级 GPT/Embedding 服务，在 Azure 云上提供与 OpenAI API 兼容的模型访问，强调数据隐私、区域部署和企业合规。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Azure Openai"
  - "azure openai"

---
# Azure OpenAI

> 企业版的「ChatGPT API」——在 Azure 云上安全合规地使用 GPT 和 Embedding。

---

## 1. 一句话定义

**Azure OpenAI** 是微软与 OpenAI 合作推出的**企业级 AI 服务**，在 Azure 云上提供 GPT-4o、GPT-4、GPT-3.5、DALL-E、Whisper、Embedding 等模型。它与 OpenAI API 高度兼容，同时提供数据隐私保护、私有网络、区域部署和企业级 SLA。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **OpenAI 模型** | GPT-4o、GPT-4、GPT-3.5、DALL-E、Whisper、Embedding |
| **API 兼容** | 与 OpenAI Python SDK 基本兼容 |
| **数据隐私** | 客户数据不用于训练基础模型 |
| **区域部署** | 可选数据驻留区域 |
| **内容过滤** | 内置 Responsible AI 内容审核 |
| **PTU / Pay-as-you-go** | 预配吞吐量单位或按量付费 |
| **Azure AI Studio** | 可视化模型部署、评估、提示工程 |

---

## 3. 典型场景

1. **企业 Copilot**：基于 GPT-4o 的办公助手。
2. **文档理解与生成**：RAG + Azure OpenAI。
3. **代码辅助**：GitHub Copilot 企业版底层。
4. **多模态应用**：DALL-E 图像生成、Whisper 语音转录。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **OpenAI API** | Azure OpenAI 是企业托管版 |
| **Azure AI Studio** | 模型管理与开发平台 |
| **Azure AI Search** | RAG 检索后端 |
| **Microsoft 365 Copilot** | 基于 Azure OpenAI 构建 |
| **AWS Bedrock** | 竞品，模型选择更多样 |
| **Google Vertex AI** | GCP 竞品 |

---

## 5. 优势与局限

### 优势
- 企业级合规和隐私保障。
- 与微软生态（M365、Azure AD、Power Platform）深度集成。
- API 兼容，迁移成本低。

### 局限
- 模型更新通常晚于 OpenAI 官方。
- 需要 Azure 订阅和配额申请。
- 国内需通过合规渠道使用。

---

## Related

- [[架构基建/Azure_OpenAI_Deep_Dive]] — Azure OpenAI 深度解析
- [[概念/cloud-ai-platform]] — 云 AI 平台
- [[概念/openai]] — OpenAI
- [[概念/aws-bedrock]] — AWS Bedrock
- [[概念/vertex-ai]] — Google Vertex AI
