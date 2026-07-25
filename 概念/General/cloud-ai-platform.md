---
title: "云厂商 AI 平台对比"
tags: [cloud-ai-platform, aws-bedrock, azure-openai, google-vertex-ai, alibaba-pai, tencent-ti, multi-cloud]
aliases:
  - "Cloud AI Platform"
  - "云AI平台"
  - "MaaS"
category: -concepts
sources:
  - 12_架构基建/AWS_Bedrock_Deep_Dive.md
  - 12_架构基建/Azure_OpenAI_Deep_Dive.md
  - 12_架构基建/Google_Vertex_AI_Deep_Dive.md
  - 18_行业应用/Cloud_AI_Platforms_Comparison.md
relationships:
  - target: "概念/aws-bedrock"
    type: related_to
  - target: "概念/azure-openai"
    type: related_to
  - target: "概念/google-vertex-ai"
    type: related_to
  - target: "概念/managed-llm-service"
    type: belongs_to
summary: "云厂商 AI 平台 (AWS Bedrock / Azure OpenAI / Google Vertex AI / 阿里云 PAI / 腾讯 TI) 是托管式大模型服务 (MaaS) 的主流形态，提供模型市场、统一推理网关、企业级安全和合规能力。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.82
created: 2026-06-24
updated: 2026-07-21
---

# 云厂商 AI 平台对比

## 一句话定义

**云厂商 AI 平台 = 模型市场 + 统一推理网关 + 企业级治理** —— 公有云厂商提供的"大模型即服务"（MaaS, Model-as-a-Service）集成平台，统一接入多家基础模型、提供 Prompt 工程/RAG/Agent 编排工具、企业级安全/合规/VPC 能力，让企业无需自建推理基础设施即可使用 LLM 能力。

## 主流平台速览

| 平台 | 提供方 | 旗舰模型 | 核心定位 |
|------|--------|----------|---------|
| **AWS Bedrock** | Amazon | Claude / Llama / Mistral / Titan | 多模型市场 + 企业集成 |
| **Azure OpenAI** | Microsoft | GPT-4o / o1 / Embeddings | OpenAI 模型 + Azure 合规 |
| **Google Vertex AI** | Google | Gemini / Claude / Llama | Gemini 原生 + 数据一体化 |
| **阿里云 PAI / 百炼** | Alibaba | Qwen / 通义 / Llama | 中文场景首选 |
| **腾讯 TI 平台** | Tencent | 混元 / Llama | 微信生态 + 内容审核 |
| **火山方舟** | ByteDance | 豆包 / Doubao | 高并发推理 + 内容生成 |
| **IBM watsonx.ai** | IBM | Granite / Llama | 金融/医疗合规 |
| **Oracle GenOFS** | Oracle | Cohere / Llama | 传统企业数据库整合 |

## 核心能力矩阵

### 1. 模型市场（Model Garden / Catalog）

- **多模型选择**：避免厂商锁定，可热切换
- **私有模型托管**：上传自定义微调的模型
- **模型评估**：内置 benchmark 和对比工具

### 2. 推理网关（Inference Endpoint）

| 特性 | Bedrock | Azure OpenAI | Vertex AI |
|------|---------|--------------|-----------|
| API 兼容性 | OpenAI 兼容 + AWS SDK | OpenAI 原生 | OpenAI 兼容 + Vertex SDK |
| 推理 SLA | 99.9% | 99.9% | 99.9% |
| 流式输出 | ✅ | ✅ | ✅ |
| Function Calling | ✅ | ✅ | ✅ |
| Batch API | ✅ | ✅ | ✅ |
| Provisioned Throughput | ✅ | ✅ | ✅ |
| 区域可用 | 30+ | 60+ | 40+ |

### 3. RAG 与 Agent 工具链

- **AWS Bedrock Agents + Knowledge Bases** + OpenSearch / Kendra / S3 Vectors
- **Azure AI Studio + AI Search** + Cosmos DB / AI Foundry
- **Vertex AI Agent Builder + Vertex Search** + Cloud SQL / AlloyDB
- **阿里云百炼 + 阿里云 Elasticsearch / OpenSearch**

### 4. 安全与合规

| 能力 | 关键点 |
|------|--------|
| **数据驻留** | 区域级隔离，不出境的承诺 |
| **VPC 私有链接** | 流量不经过公网 |
| **CMK 加密** | 客户自带密钥加密 prompt/response |
| **审计日志** | CloudTrail / Azure Monitor / Cloud Logging |
| **负责任 AI** | 内容过滤、jailbreak 检测、偏见检测 |
| **合规认证** | SOC2 / ISO27001 / HIPAA / GDPR |

## 选型决策树

```
是否必须用 OpenAI 模型？
├── 是 → Azure OpenAI（国内/合规）或 OpenAI 直连
│
└── 否 → 是否深度绑定某个云生态？
    ├── AWS 生态 → Bedrock（最大模型选择）
    ├── Azure 生态 → Azure OpenAI（企业首选）
    ├── GCP 生态 → Vertex AI（数据一体化）
    ├── 阿里云生态 → 阿里云百炼 / PAI
    └── 跨云 / 中立 → Bedrock（模型最丰富）
```

## 定价对比（输入价格，$/M token，2026 年中）

| 模型 | OpenAI 直连 | Bedrock | Vertex AI | 备注 |
|------|-------------|---------|-----------|------|
| GPT-4o | $2.50 | — | — | Azure OpenAI 价格类似 |
| Claude Sonnet 4.6 | $3.00 | $3.00 | $3.00 | 三家一致 |
| Gemini 2.5 Pro | $1.25 | — | $1.25 | Vertex AI 有 prompt cache 折扣 |
| Llama 4 70B | $0.88 (Together) | $0.95 | $0.95 | 自托管性价比更高 |

> **提示**：云厂商平台通常比直连贵 5-15%，但节省了推理基础设施运维、合规认证、跨区域复制成本。

## 与自托管的关系

| 维度 | 云 AI 平台 | 自托管 (vLLM/TGI/TRT) |
|------|-----------|----------------------|
| **初期成本** | 低（按 token 计费） | 高（GPU 采购/租赁） |
| **规模经济** | 大流量贵 | 大流量便宜（>10亿 token/月） |
| **数据控制** | 中（依赖厂商） | 高（数据不出机房） |
| **运维复杂度** | 低 | 高（需 GPU/网络/监控栈） |
| **模型选择** | 多（受厂商合作限制） | 任意（开源+自研） |
| **合规** | 高（已有 SOC2/HIPAA） | 自建（按行业） |

**经验阈值**：每月 < 1 亿 token 用云平台；> 5 亿 token 自托管更经济。

## 中国云厂商特殊考量

- **国际模型访问**：Bedrock/Vertex 在国内通过香港/新加坡区域延迟较高
- **合规备案**：阿里/腾讯/火山/智谱/百川/通义等需通过大模型备案
- **私有化部署**：金融/政府客户倾向私有化（华为盘古、商汤、智谱）
- **API 网关**：阿里云 GAIA / 腾讯 API 网关 提供统一入口

## 发展趋势（2026）

- **Agent 平台化**：从单模型 API 演进到 Agent Marketplace（A2A 协议）
- **推理优化内置**：Bedrock/Vertex 引入 speculative decoding、prompt caching
- **多模态一体化**：图像/视频/音频统一接口
- **BYOC（Bring Your Own Cloud）**：客户在自建 K8s 上跑托管模型
- **Fine-tuning 即服务**：Bedrock Fine-tuning / Vertex AI Tuning 普及

---

**参见**：[[AWS_Bedrock_Deep_Dive]] · [[Azure_OpenAI_Deep_Dive]] · [[Google_Vertex_AI_Deep_Dive]] · [[12_架构基建/README|架构基建]] · [[概念/aws-bedrock]] · [[概念/azure-openai]]

---

## 2026 云 AI 平台生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **多云模型市场** | AWS/Azure/GCP 统一模型目录与 API | GA |
| **Serverless 推理** | 按 token 计费、零运维托管推理 | GA |
| **私有端点** | VPC 内部署专属模型实例 | GA |
| **统一可观测** | 跨云平台统一监控、日志、追踪 | GA |
| **成本优化器** | 智能路由选择性价比最优模型 | GA |

## 生产最佳实践

1. **避免锁定**：使用抽象层封装云厂商 API，保留多云切换能力
2. **数据合规**：确认数据存储区域符合当地法规（GDPR/等保）
3. **成本管控**：设置每日/每月 token 用量上限，防止意外超支
4. **容灾设计**：主备双云部署，单云故障自动切换
5. **安全审计**：定期审计 API Key 权限，禁用不再使用的凭证

## 云 AI 平台对比

| 平台 | 特色服务 | GPU 支持 | 定价模式 | 适用场景 |
|------|----------|----------|----------|----------|
| AWS Bedrock | 多模型统一 API | 托管 | 按 token | 企业多模型 |
| Azure OpenAI | GPT 系列专属 | 托管 | 按 token | 微软生态 |
| GCP Vertex AI | 全栈 ML 平台 | 自管/托管 | 按小时 | GCP 用户 |
| 阿里云 PAI | 灵骏智算 | 自管 | 按小时 | 国内企业 |
| Modal | GPU 函数计算 | 弹性 | 按秒 | 初创团队 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 成本失控 | 未设置预算限制 | 配置预算告警 + 自动停机 |
| 供应商锁定 | 深度依赖单一平台 | 抽象层封装 + 多云策略 |
| 延迟波动 | 共享资源争抢 | 专属实例 + 多区域部署 |
| 合规风险 | 数据跨境 | 选择同区域部署 + 加密 |

## 生产检查清单

1. ✅ 设置预算上限 + 自动告警
2. ✅ API Key 最小权限 + 定期轮换
3. ✅ 多区域部署 + 容灾切换
4. ✅ 数据加密（传输 + 存储）
5. ✅ 抽象层封装避免供应商锁定
6. ✅ 定期审计权限和用量

## 总结

云 AI 平台是 2026 年企业 AI 应用的主要部署方式，提供从模型 API、训练平台到推理服务的全栈能力。选择时需综合考虑成本、延迟、合规和供应商锁定风险。

> 💡 云 AI 平台的核心价值是“降低 AI 门槛”——让企业无需自建 GPU 集群即可获得世界一流的 AI 能力。