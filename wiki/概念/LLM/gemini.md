---
title: "Google Gemini 模型"
category: -concepts
tags: [gemini, google, vertex-ai, multimodal, llm, foundation-model]
aliases:
  - "Gemini"
  - "Gemini Pro"
  - "Gemini Ultra"
relationships:
  - target: "概念/cloud-ai-platform"
    type: belongs_to
  - target: "概念/vertex-ai"
    type: hosted_by
  - target: "概念/foundation-model"
    type: type_of
  - target: "概念/multimodal-models"
    type: evolves_into
sources:
  - 12_架构基建/Google_Vertex_AI_Deep_Dive.md
  - 05_大模型/13_全球LLM生态/Google_Gemini_Deep_Dive.md
summary: "Gemini 是 Google DeepMind 于 2023 年底发布的多模态大模型系列（Nano / Flash / Pro / Ultra），原生支持文本/图像/视频/音频/代码多模态输入，是 Google Vertex AI 平台的旗舰模型。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-07-21
name_zh: "Google Gemini 模型"
---

# Google Gemini

> 中文简称：Google Gemini 模型

## 核心要点

- **定位**：Google DeepMind 的多模态原生大模型系列，对标 GPT-4o / Claude。
- **版本**（2026 中）：
  - **Gemini 3 Ultra**：旗舰、复杂推理、1M 上下文
  - **Gemini 3 Pro**：主力、性价比优选
  - **Gemini 3 Flash**：高吞吐、低延迟、低成本
  - **Gemini Nano**：端侧 / 嵌入式
- **核心特性**：
  - **原生多模态**：从预训练开始就同时训练文本/图像/音频/视频
  - **百万级上下文**：1M-10M token（部分版本）
  - **长视频理解**：可一次性处理数小时视频
  - **工具调用**：原生 Function Calling 与 Agent 能力
- **接入方式**：Google AI Studio（API）、Vertex AI（企业）、Gemini App（C 端）

## 一句话解释

> Gemini = Google 的"原生多模态"答案。从训练第一天就把多模态当一等公民，而不是拼接。

## 与其他旗舰对比

| 模型 | 原生多模态 | 上下文 | 推理 | 工具 | 价格 |
|------|----------|--------|------|------|------|
| Gemini 3 Ultra | ✅ 文本+图像+音频+视频 | 1M | 极强 | ✅ | $$$ |
| Gemini 3 Pro | ✅ | 1M | 强 | ✅ | $$ |
| Gemini 3 Flash | ✅ | 1M | 中 | ✅ | $ |
| GPT-5 | ✅ 文本+图像+音频 | 256K | 极强 | ✅ | $$$$ |
| Claude Opus 4.8 | ✅ 文本+图像 | 1M | 极强 | ✅ | $$$ |
| Claude Sonnet 4.6 | ✅ | 1M | 强 | ✅ | $$ |

## 何时使用

✅ **推荐**：
- 多模态任务（视频理解、图表解析）
- 超长上下文（> 200K）
- Google Cloud 生态深度集成
- 性价比敏感的中等任务（Flash）

⚠️ **不推荐**：
- 需要严格的逻辑/数学推理（Claude / o1 更强）
- 中国境内低延迟访问（Google 服务受限）

## 架构特点

| 特性 | 说明 |
|------|------|
| **原生多模态预训练** | 从第一天就联合训练文本/图像/音频/视频，而非后期拼接 |
| **MoE 架构** | Gemini 3 Ultra 采用 Mixture-of-Experts，激活参数远小于总参数 |
| **超长上下文** | 原生 1M token，部分版本支持 10M |
| **Thinking Mode** | 类似 o1 的思维链推理，可配置思考深度 |
| **原生工具调用** | Function Calling + Code Execution + Google Search |

## API 接入示例

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel("gemini-3-pro")

# 多模态输入
response = model.generate_content([
    "分析这张图表的趋势",
    {"mime_type": "image/png", "data": image_bytes},
])

# 流式输出
for chunk in model.generate_content(prompt, stream=True):
    print(chunk.text, end="")
```

## 定价参考 (2026 中)

| 模型 | 输入 | 输出 | 上下文 |
|------|:----:|:----:|:------:|
| Gemini 3 Ultra | $7/M tok | $21/M tok | 1M |
| Gemini 3 Pro | $1.25/M tok | $5/M tok | 1M |
| Gemini 3 Flash | $0.075/M tok | $0.30/M tok | 1M |
| Gemini Nano | 端侧免费 | - | 32K |

## 相关生态

| 产品 | 定位 |
|------|------|
| **Gemini App** | C 端对话助手（对标 ChatGPT） |
| **Gemini Live** | 实时语音对话（移动端） |
| **Gemini for Workspace** | 集成 Gmail/Docs/Sheets |
| **Gemini Code Assist** | IDE 代码助手 |
| **Gemini CLI** | 命令行 Agent 工具 |
| **Vertex AI** | 企业级 MLOps 平台 |
| **AI Studio** | 开发者免费试验场 |

## 2026 生态定位

- **多模态最强**: 视频理解、图表解析、音频转写一体化
- **超长上下文领先**: 1M-10M token 窗口，可处理数小时视频
- **性价比优选**: Flash 版本价格仅为 GPT-5 的 1/50
- **企业级合规**: Vertex AI 提供 VPC-SC、CMEK、审计日志

## 延伸阅读

- [[概念/LLM/foundation-model|基础模型]]
- [[概念/LLM/multimodal-models|多模态模型]]
- [[12_架构基建/06_云厂商/Google_Cloud/01_Google_Vertex_AI_深入分析|Vertex AI 深度解析]]
- [[05_大模型/13_全球LLM生态/05_Google_Gemini_深入分析|Google Gemini 深度解析]]

---

## 2026 Gemini 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Gemini 2.5 Pro/Flash** | 原生多模态 + 2M Token 上下文 | GA |
| **Gemini API** | Google AI Studio / Vertex AI 双通道访问 | GA |
| **Code Execution** | 内置代码执行环境，支持数据分析 | GA |
| **Grounding with Search** | 搜索增强生成，减少幻觉 | GA |
| **Gemini in Workspace** | Docs/Sheets/Gmail 原生集成 | GA |

## 生产最佳实践

1. **模型选择**：简单任务用 Flash（快/便宜），复杂任务用 Pro
2. **长上下文利用**：Gemini 支持 2M Token，适合长文档分析
3. **多模态输入**：充分利用原生图像/视频/音频理解能力
4. **成本控制**：Flash 价格极低，适合高并发场景
5. **与 GPT 对比评估**：生产前用目标场景对比 Gemini 与 GPT 效果

## Gemini 模型矩阵 (2026)

| 模型 | 参数规模 | 上下文 | 特点 | 定价 |
|------|---------|--------|------|------|
| **Gemini 3 Ultra** | MoE ~2T | 2M | 最强推理+多模态 | $$$$ |
| **Gemini 3 Pro** | MoE | 2M | 通用旗舰 | $$$ |
| **Gemini 3 Flash** | 小型 MoE | 1M | 极速极便宜 | $ |
| **Gemini 3 Nano** | 端侧 | 32K | 设备端推理 | 免费 |

## Gemini vs GPT vs Claude 对比

| 维度 | Gemini 3 | GPT-5 | Claude 4 |
|------|----------|-------|----------|
| **上下文窗口** | 2M (最长) | 1M | 500K |
| **多模态** | 原生视频/音频 | 图像/音频 | 图像 |
| **代码能力** | 强 | 极强 | 极强 |
| **中文能力** | 强 | 强 | 强 |
| **价格** | Flash 极便宜 | 中 | 中高 |
| **开源** | 无 | 无 | 无 |
| **工具调用** | 强 | 极强 | 强 |

## Gemini API 调用示例

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel("gemini-3-flash")

# 多模态输入
response = model.generate_content([
    "分析这张图表的趋势",
    {"mime_type": "image/png", "data": image_bytes}
])

# 长文档分析 (2M 上下文)
response = model.generate_content(
    [long_document_text, "总结这份文档的核心要点"],
    generation_config={"max_output_tokens": 4096}
)
```

## 延伸阅读

- [[概念/LLM/gpt-series-evolution|GPT 系列演进]] — OpenAI 模型对比
- [[概念/LLM/multimodal-llm|多模态 LLM]] — 多模态能力详解
- [[概念/LLM/context-window|上下文窗口]] — 长上下文技术
- [[概念/LLM/llm-architectures|LLM 架构]] — MoE 架构基础