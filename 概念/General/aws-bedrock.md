---
title: "AWS Bedrock"
category: -concepts
tags: ["aws-bedrock", "aws", "cloud", "foundation-model", "api", "serverless", "inference"]
relationships:
  - target: "概念/cloud-ai-platform"
    type: extends
  - target: "概念/foundation-model"
    type: provides
  - target: "概念/azure-openai"
    type: related_to
  - target: "概念/vertex-ai"
    type: related_to
sources:
  - 架构基建/AWS_Bedrock_Deep_Dive.md
summary: "AWS Bedrock 是亚马逊云的托管基础模型服务，提供 Claude、Llama、Titan、Stable Diffusion 等模型的统一 API，支持 RAG、Agent、微调（Customization）和 Guardrails，适合企业快速构建生成式 AI 应用。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Aws Bedrock"
  - "aws bedrock"

---
# AWS Bedrock

> 亚马逊云的「模型百货商店」——一个 API 调用多个顶尖基础模型。

---

## 1. 一句话定义

**AWS Bedrock** 是亚马逊云科技（AWS）提供的**托管基础模型服务**，通过统一 API 访问 Claude、Llama、Titan、Stable Diffusion、Command R+ 等多个模型。它支持知识库 RAG、Agents、模型微调（Customization）和 Guardrails，适合企业快速构建和部署生成式 AI 应用。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **多模型访问** | Claude、Llama、Titan、Stable Diffusion、Command R+ 等 |
| **统一 API** | 通过 `InvokeModel` 调用不同模型 |
| **知识库 RAG** | 集成 OpenSearch/Pinecone，托管检索增强生成 |
| **Agents** | 让模型调用工具和 API 完成多步任务 |
| **Guardrails** | 内容过滤、敏感话题拦截、PII 脱敏 |
| **模型微调** | Continued Pre-training 和 Fine-tuning |
| **无服务器** | 按需付费，无需管理 GPU 基础设施 |

---

## 3. 典型场景

1. **企业 AI 助手**：基于 Claude 的客服/内部助手。
2. **文档问答**：RAG 连接企业知识库。
3. **内容生成**：营销文案、代码生成、图像生成。
4. **AI Agent 工作流**：调用 AWS Lambda、API 完成自动化任务。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Amazon SageMaker** | 自定义模型训练/部署平台 |
| **AWS Lambda** | Bedrock Agents 可调用 Lambda 函数 |
| **Amazon OpenSearch** | Bedrock 知识库可选向量引擎 |
| **Azure OpenAI** | 微软企业级 OpenAI 服务 |
| **Google Vertex AI** | GCP 统一 AI 平台 |

---

## 5. 优势与局限

### 优势
- 一个平台访问多个顶级模型。
- 与 AWS 生态（IAM、CloudWatch、Lambda）深度集成。
- 企业级安全合规（VPC、加密、审计）。

### 局限
- 模型选择受 AWS 合作关系限制。
- 国内访问可能受网络和政策影响。
- 成本高于自托管开源模型。

---

## Related

- [[架构基建/AWS_Bedrock_Deep_Dive]] — AWS Bedrock 深度解析
- [[概念/cloud-ai-platform]] — 云 AI 平台
- [[概念/azure-openai]] — Azure OpenAI
- [[概念/vertex-ai]] — Google Vertex AI
- [[概念/foundation-model]] — 基础模型
