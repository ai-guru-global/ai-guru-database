---
title: "AWS Bedrock 深度解析: 亚马逊云托管基础模型服务"
category: "12-architecture-infrastructure"
tags: ["aws-bedrock", "aws", "cloud", "foundation-model", "claude", "llama", "rag", "agent", "guardrails", "enterprise"]
summary: "> **一句话理解**: AWS Bedrock 是亚马逊云的托管基础模型服务，通过统一 API 提供 Claude、Llama、Titan、Stable Diffusion 等模型，并集成 RAG、Agent、微调和 Guardrails，帮助企业快速构建生成式 AI 应用。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Aws Bedrock Deep Dive"
  - "AWS Bedrock Deep Dive"
  - AWS_Bedrock_Deep_Dive
sources: []

---
# AWS Bedrock 深度解析：亚马逊云托管基础模型服务

> **一句话理解**: AWS Bedrock 是亚马逊云的托管基础模型服务，通过统一 API 提供 Claude、Llama、Titan、Stable Diffusion 等模型，并集成 RAG、Agent、微调和 Guardrails，帮助企业快速构建生成式 AI 应用。

> **官方站点**: https://aws.amazon.com/bedrock

---

## 目录

1. [产品定位与核心能力](#1-产品定位与核心能力)
2. [支持的模型](#2-支持的模型)
3. [核心功能详解](#3-核心功能详解)
4. [知识库 RAG](#4-知识库-rag)
5. [Agents 与工具调用](#5-agents-与工具调用)
6. [Guardrails 安全护栏](#6-guardrails-安全护栏)
7. [模型定制](#7-模型定制)
8. [典型架构](#8-典型架构)
9. [与 AWS 生态集成](#9-与-aws-生态集成)
10. [成本与计费](#10-成本与计费)
11. [生产最佳实践](#11-生产最佳实践)
12. [常见问题](#12-常见问题)
13. [官方资源](#13-官方资源)

---

## 1. 产品定位与核心能力

### 1.1 定位

AWS Bedrock 是**无服务器（Serverless）的基础模型平台**，企业无需管理 GPU 基础设施，即可通过统一 API 调用多个大模型，并构建 RAG、Agent 和安全可控的生成式 AI 应用。

### 1.2 核心能力

| 能力 | 说明 |
|------|------|
| **多模型访问** | 一个 API 调用多个基础模型 |
| **知识库 RAG** | 托管检索增强生成 |
| **Agents** | 模型自主调用工具 |
| **Guardrails** | 内容安全与合规 |
| **模型定制** | Fine-tuning 和 Continued Pre-training |
| **无服务器** | 按需扩展，零运维 |

---

## 2. 支持的模型

| 模型系列 | 代表模型 | 能力 |
|----------|---------|------|
| **Anthropic Claude** | Claude 3.5 Sonnet、Claude 3 Opus | 推理、代码、长文本 |
| **Meta Llama** | Llama 3、Llama 2 | 通用文本生成 |
| **Amazon Titan** | Titan Text、Titan Embeddings | AWS 自研模型 |
| **Stability AI** | Stable Diffusion XL | 图像生成 |
| **Cohere** | Command R+、Embed | 企业搜索与 RAG |
| **AI21 Labs** | Jurassic | 文本生成 |

---

## 3. 核心功能详解

### 3.1 InvokeModel API

```python
import boto3
import json

client = boto3.client("bedrock-runtime", region_name="us-west-2")

response = client.invoke_model(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    body=json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": "Hello, Claude"}]
    })
)
```

### 3.2 Converse API

更高级的对话 API，支持多轮、工具调用、系统提示：

```python
response = client.converse(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    messages=[{"role": "user", "content": [{"text": "What is AWS Bedrock?"}]}],
    inferenceConfig={"maxTokens": 1024, "temperature": 0.5}
)
```

---

## 4. 知识库 RAG

### 4.1 组件

- **Knowledge Base**：托管向量存储 + 检索。
- **Data Source**：S3、Confluence、Salesforce 等。
- **Embedding Model**：Titan Embeddings、Cohere Embed。
- **Vector Store**：OpenSearch Serverless、Pinecone、Redis、RDS PostgreSQL。

### 4.2 架构

```
文档 → S3 → Bedrock Knowledge Base → Embedding → Vector Store
                                          ↑
用户提问 → Bedrock → Retrieve → Augment Prompt → LLM → 答案
```

---

## 5. Agents 与工具调用

Bedrock Agents 让模型能够：

1. 理解用户意图。
2. 决定调用哪些 Action Group（API/Lambda）。
3. 执行工具并获取结果。
4. 综合结果生成最终回复。

```
User → Bedrock Agent → Action Group (Lambda/API) → Knowledge Base → Final Response
```

---

## 6. Guardrails 安全护栏

### 6.1 功能

| 功能 | 说明 |
|------|------|
| **内容过滤** | 拦截仇恨、侮辱、色情、暴力 |
| **敏感话题拦截** | 自定义拒绝话题 |
| **PII 脱敏** | 自动遮蔽邮箱、电话、身份证号 |
| **词汇过滤** | 自定义禁止词表 |
| **上下文一致性检查** | 检测幻觉 |

### 6.2 应用方式

```python
response = client.converse(
    modelId="...",
    messages=[...],
    guardrailConfig={
        "guardrailIdentifier": "my-guardrail",
        "guardrailVersion": "DRAFT"
    }
)
```

---

## 7. 模型定制

| 定制方式 | 说明 |
|----------|------|
| **Fine-tuning** | 用标注数据微调模型 |
| **Continued Pre-training** | 用无标注领域语料继续预训练 |
| **Provisioned Throughput** | 预配专属推理容量 |

---

## 8. 典型架构

```
┌─────────────────────────────────────────┐
│              企业应用 (Web/App)          │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│          AWS Bedrock (API Gateway)      │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │  LLM    │ │Knowledge│ │  Agent   │  │
│  │ Claude  │ │  Base   │ │          │  │
│  └─────────┘ └────┬────┘ └────┬─────┘  │
│                   │           │         │
│              OpenSearch    Lambda/API   │
└─────────────────────────────────────────┘
```

---

## 9. 与 AWS 生态集成

| 服务 | 集成方式 |
|------|---------|
| **Amazon S3** | 知识库数据源 |
| **AWS Lambda** | Agent Action Group |
| **Amazon OpenSearch** | 向量存储 |
| **Amazon Kendra** | 企业搜索 |
| **AWS IAM** | 权限控制 |
| **Amazon CloudWatch** | 监控与日志 |
| **AWS CloudTrail** | 审计 |

---

## 10. 成本与计费

| 计费项 | 说明 |
|--------|------|
| **按 token 计费** | 输入/输出 token 分别计价 |
| **Provisioned Throughput** | 小时费率，适合高吞吐 |
| **Knowledge Base** | 按存储和查询收费 |
| **Agents** | 按调用次数收费 |

---

## 11. 生产最佳实践

1. **使用 Converse API**：比 InvokeModel 更统一、功能更全。
2. **配置 Guardrails**： especially for customer-facing apps。
3. **启用 CloudTrail**：记录模型调用审计日志。
4. **使用 IAM 细粒度权限**：限制模型访问范围。
5. **监控 Token 使用**：避免意外高成本。
6. **RAG 使用缓存**：减少重复检索开销。

---

## 12. 常见问题

### Q1: Bedrock 与 SageMaker 怎么选？

**A**: Bedrock 适合快速使用托管基础模型；SageMaker 适合自定义训练和部署。

### Q2: 国内能用 Bedrock 吗？

**A**: 需要 AWS 海外账号，国内访问可能受网络影响，需合规评估。

### Q3: 如何评估不同模型的效果？

**A**: 使用 Model Evaluation on Amazon Bedrock 功能，支持自动和人工评估。

### Q4: 知识库支持中文吗？

**A**: 支持， embedding 和 LLM 需选择支持中文的模型。

### Q5: Guardrails 会影响延迟吗？

**A**: 会有轻微增加，通常在可接受范围。

### Q6: 可以部署自己的模型到 Bedrock 吗？

**A**: Bedrock 主要是托管第三方模型，自定义模型建议用 SageMaker。

### Q7: 与 Azure OpenAI 相比优势在哪？

**A**: 模型选择更多样（Claude、Llama 等），与 AWS 生态集成更深。

### Q8: Agents 支持哪些工具？

**A**: Lambda 函数、API Schema、Knowledge Base Retrieval。

---

## 13. 官方资源

- **官网**: https://aws.amazon.com/bedrock
- **文档**: https://docs.aws.amazon.com/bedrock/
- **模型列表**: https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html
- **Pricing**: https://aws.amazon.com/bedrock/pricing/

---

## Related

- [[概念/aws-bedrock]] — AWS Bedrock 概念卡片
- [[概念/azure-openai]] — Azure OpenAI
- [[概念/vertex-ai]] — Google Vertex AI
- [[概念/cloud-ai-platform]] — 云 AI 平台
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
