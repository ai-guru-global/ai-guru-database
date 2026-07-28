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
  - 12_架构基建/Azure_OpenAI_Deep_Dive.md
summary: "Azure OpenAI 是微软与 OpenAI 合作推出的企业级 GPT/Embedding 服务，在 Azure 云上提供与 OpenAI API 兼容的模型访问，强调数据隐私、区域部署和企业合规。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Azure Openai"
  - "azure openai"

name_zh: "微软 Azure OpenAI 服务"
---
# Azure OpenAI

> 中文简称：微软 Azure OpenAI 服务

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

- [[12_架构基建/Azure_OpenAI_Deep_Dive]] — Azure OpenAI 深度解析
- [[概念/cloud-ai-platform]] — 云 AI 平台
- [[概念/openai]] — OpenAI
- [[概念/aws-bedrock]] — AWS Bedrock
- [[概念/vertex-ai]] — Google Vertex AI

---

## 2026 Azure OpenAI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Azure OpenAI** | 企业级 OpenAI 服务 | GA |
| **GPT-5** | 最新 GPT 模型 | GA |
| **合规部署** | 企业合规部署 | GA |
| **私有端点** | 私有网络访问 | GA |
| **内容过滤** | 内容安全过滤 | GA |

## 生产最佳实践

1. **企业合规**：企业合规用 Azure OpenAI
2. **私有端点**：敏感场景用私有端点
3. **内容过滤**：启用内容安全过滤
4. **与 AWS 对比**：根据云环境选择 Azure 或 AWS
5. **成本优化**：监控 API 调用成本

## API 调用示例

```python
from openai import AzureOpenAI

client = AzureOpenAI(
    api_key="your-key",
    api_version="2026-02-01",
    azure_endpoint="https://your-resource.openai.azure.com"
)

response = client.chat.completions.create(
    model="gpt-4o",  # deployment name
    messages=[{"role": "user", "content": "你好"}],
    temperature=0.7
)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 403 错误 | 权限不足/网络限制 | 检查 RBAC + 私有端点 |
| 模型不可用 | 未创建 Deployment | 先创建模型部署 |
| 吐量限制 | TPM/RPM 配额 | 申请提升配额 |
| 内容被过滤 | 内容安全策略 | 调整过滤阈值 |
| 延迟高 | 区域距离远 | 就近区域部署 |

## 版本兼容性

| 服务 | 状态 | 说明 |
|------|------|------|
| GPT-5 | GA | 最新旗舰 |
| GPT-4o | GA | 性价比主力 |
| o3/o4-mini | GA | 推理模型 |
| DALL-E 3 | GA | 图像生成 |
| Whisper | GA | 语音识别 |

## 生产检查清单

1. 配置私有端点避免公网暴露
2. 启用内容安全过滤
3. 设置 API 调用监控和告警
4. 配置 RBAC 最小权限
5. 建立成本预算和告警
6. 多区域部署确保高可用

## 总结

Azure OpenAI 是企业级 OpenAI 服务的首选部署方式，提供合规、安全、私有的 GPT 模型访问。对于中国/合规场景，Azure OpenAI 是最佳选择。

> 💡 Azure OpenAI 的核心优势：与直接调用 OpenAI API 相比，Azure 提供企业级 SLA、私有网络、合规认证、内容过滤——是企业生产的必选项。

## Azure OpenAI 部署模式

| 模式 | 特点 | 适用场景 |
|------|------|----------|
| 全球标准 | 多区域路由 | 通用场景 |
| 数据区域 | 数据不出区 | 合规要求 |
| 专属部署 | 独享资源 | 高性能/稳定 |
| 私有端点 | VPC 内访问 | 安全敏感 |

## 生产检查清单

1. ✅ 使用私有端点 + VPC 集成
2. ✅ 启用内容过滤（输入+输出）
3. ✅ 配置 TPM/RPM 配额限制
4. ✅ 使用 Managed Identity 认证
5. ✅ 启用诊断日志 + 审计
6. ✅ 多区域部署 + 故障转移
7. ✅ 定期轮换 API Key

## 版本兼容性

| 组件 | 版本 | 状态 |
|------|------|------|
| openai SDK | ≥ 1.30 | GA |
| API 版本 | 2026-01-01 | 最新 |
| Azure CLI | ≥ 2.60 | GA |

