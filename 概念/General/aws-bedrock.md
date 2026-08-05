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
  - 12_架构基建/AWS_Bedrock_Deep_Dive.md
summary: "AWS Bedrock 是亚马逊云的托管基础模型服务，提供 Claude、Llama、Titan、Stable Diffusion 等模型的统一 API，支持 RAG、Agent、微调（Customization）和 Guardrails，适合企业快速构建生成式 AI 应用。"
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
  - "Aws Bedrock"
  - "aws bedrock"

name_zh: "亚马逊 Bedrock 模型服务"
---
# AWS Bedrock

> 中文简称：亚马逊 Bedrock 模型服务

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

- [[12_架构基建/06_云厂商/05_AWS_Bedrock_深入分析]] — AWS Bedrock 深度解析
- [[概念/cloud-ai-platform]] — 云 AI 平台
- [[概念/azure-openai]] — Azure OpenAI
- [[概念/vertex-ai]] — Google Vertex AI
- [[概念/foundation-model]] — 基础模型

---

## 2026 AWS Bedrock 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **AWS Bedrock** | AWS 托管大模型服务 | GA |
| **Claude 系列** | Anthropic Claude 模型 | GA |
| **Llama 系列** | Meta Llama 模型 | GA |
| **Agents** | Bedrock Agents | GA |
| **Knowledge Bases** | RAG 知识库 | GA |

## 生产最佳实践

1. **托管服务**：AWS 环境用 Bedrock 托管服务
2. **多模型选择**：根据场景选择合适模型
3. **Agents 构建**：用 Bedrock Agents 构建 Agent
4. **Knowledge Bases**：RAG 用 Bedrock Knowledge Bases
5. **与 Azure 对比**：根据云环境选择 Bedrock 或 Azure

## API 调用示例

```python
import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")

response = client.converse(
    modelId="anthropic.claude-sonnet-4-20250514-v1:0",
    messages=[{"role": "user", "content": [{"text": "解释量子计算"}]}],
    inferenceConfig={"maxTokens": 1024, "temperature": 0.7}
)
print(response["output"]["message"]["content"][0]["text"])
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 模型不可用 | 区域限制 | 检查区域可用性 |
| 延迟高 | 跨区域调用 | 就近区域部署 |
| 成本高 | 大模型过度使用 | 小模型分流 + 缓存 |
| 吐量限制 | Service Quota | 申请提升配额 |
| 合规问题 | 数据驻留 | 选择合规区域 |

## 版本兼容性

| 服务 | 状态 | 说明 |
|------|------|------|
| Bedrock Converse API | GA | 统一对话 API |
| Bedrock Agents | GA | Agent 构建 |
| Knowledge Bases | GA | RAG 知识库 |
| Guardrails | GA | 内容安全 |
| Model Evaluation | GA | 模型评估 |

## 生产检查清单

1. 确认模型在目标区域可用
2. 配置 VPC Endpoint 私有访问
3. 启用 Guardrails 内容安全过滤
4. 设置 CloudWatch 监控和告警
5. 配置 IAM 最小权限访问
6. 建立成本监控和预算告警

## 总结

AWS Bedrock 是 AWS 生态中的统一大模型服务平台，提供 Claude、Llama、Mistral 等多模型选择。对于已在使用 AWS 的企业，Bedrock 是最低摩擦的 LLM 接入方式。

> 💡 Bedrock 选型原则：已在 AWS 生态 → Bedrock；已在 Azure → Azure OpenAI；已在 GCP → Vertex AI。避免跨云调用增加延迟和复杂度。

## Bedrock 模型目录

| 提供商 | 模型 | 特色 | 适用场景 |
|--------|------|------|----------|
| Anthropic | Claude 4 | 长上下文/安全 | 企业应用 |
| Meta | Llama 4 | 开源/可微调 | 自定义 |
| Mistral | Mistral Large | 欧洲合规 | 多语言 |
| Amazon | Titan/Nova | AWS 原生 | 成本敏感 |
| Cohere | Command R+ | RAG 优化 | 检索增强 |

## 生产检查清单

1. ✅ 使用 VPC Endpoint 私有访问
2. ✅ 配置 Guardrails 内容过滤
3. ✅ 启用 Model Invocation Logging
4. ✅ 设置用量配额 + 预算告警
5. ✅ 评估多模型提供商容灾
6. ✅ 使用 Knowledge Base 构建 RAG
7. ✅ 定期审计 IAM 权限

## 总结

AWS Bedrock 是 AWS 的托管 LLM 服务平台，提供多模型统一接入、Guardrails 安全护栏、Knowledge Base RAG 等能力。对于 AWS 生态用户，Bedrock 是接入 LLM 的最便捷方式。

> 💡 Bedrock 的核心价值：无需管理基础设施即可使用顶级 LLM——一个 API 接入 Claude、Llama、Mistral 等多家模型。

## 相关概念

- [[概念/azure-openai]] — Azure OpenAI 服务
- [[概念/vertex-ai]] — Google Vertex AI
- [[概念/cloud-ai-platform]] — 云 AI 平台对比

