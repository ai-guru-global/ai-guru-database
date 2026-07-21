---
title: AI 工具全景 2026 (AI Tools Landscape)
category: 06-learning
tags: ["ai-tools", "landscape", "comparison", "productivity"]
summary: "2026 AI 工具全景图：编码（Cursor/Copilot）、对话（ChatGPT/Claude）、图像（Midjourney/SD）、视频（Sora/Kling）、Agent 框架、企业 AI 平台分类与选型指南。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# AI 工具全景 2026 (AI Tools Landscape)

## 1. 工具分类

```
2026 AI 工具生态:

┌─────────────────────────────────────────┐
│  对话/助手: ChatGPT / Claude / Gemini   │
├─────────────────────────────────────────┤
│  编码: Cursor / Copilot / Windsurf      │
├─────────────────────────────────────────┤
│  图像: Midjourney / DALL-E / SD / Flux  │
├─────────────────────────────────────────┤
│  视频: Sora / Kling / Runway / Pika     │
├─────────────────────────────────────────┤
│  音频: ElevenLabs / Suno / Udio         │
├─────────────────────────────────────────┤
│  Agent: LangChain / CrewAI / AutoGen    │
├─────────────────────────────────────────┤
│  企业: Azure AI / Bedrock / Vertex AI   │
└─────────────────────────────────────────┘
```

## 2. 各类工具对比

### 2.1 AI 编码

| 工具 | 类型 | 特色 | 价格 | 适用 |
|------|------|------|------|------|
| Cursor | IDE | 最深度 AI 集成 | $20/月 | 专业开发 |
| GitHub Copilot | 插件 | 生态最广 | $10/月 | 通用 |
| Windsurf | IDE | 多文件编辑 | $15/月 | 全栈 |
| Qoder | IDE | Agent 模式 | - | 复杂任务 |
| Devin | Agent | 自主编码 | $500/月 | 自动化 |

### 2.2 AI 对话

| 工具 | 模型 | 特色 | 价格 |
|------|------|------|------|
| ChatGPT | GPT-4o/o3 | 最全面/插件 | $20/月 |
| Claude | Claude 4 | 长文本/代码/安全 | $20/月 |
| Gemini | Gemini 2.5 | Google 生态/多模态 | $20/月 |
| 文心一言 | ERNIE | 中文/百度生态 | 免费/会员 |
| Kimi | Moonshot | 长文本/中文 | 免费/会员 |

### 2.3 AI 图像/视频

| 工具 | 类型 | 特色 | 价格 |
|------|------|------|------|
| Midjourney | 图像 | 艺术质量最高 | $10/月起 |
| DALL-E 3 | 图像 | 文字理解好 | ChatGPT 内 |
| Stable Diffusion | 图像 | 开源/可控 | 免费 |
| Flux | 图像 | 2026 最强开源 | 免费 |
| Sora | 视频 | OpenAI 视频生成 | 订阅 |
| 可灵 (Kling) | 视频 | 中国最强/免费额度 | 免费/会员 |
| Runway Gen-4 | 视频 | 专业视频编辑 | $12/月起 |

## 3. 选型指南

```python
TOOL_SELECTION_GUIDE = {
    "个人开发者": {
        "编码": "Cursor 或 Copilot",
        "对话": "Claude Pro 或 ChatGPT Plus",
        "图像": "Midjourney 或 Flux (本地)",
        "预算": "$30-50/月",
    },
    "AI 应用团队": {
        "开发": "Cursor + LangChain/LlamaIndex",
        "评估": "LangSmith / Langfuse",
        "部署": "Vercel / Railway / AWS",
        "预算": "$200-1000/月",
    },
    "企业": {
        "平台": "Azure AI / AWS Bedrock / GCP Vertex",
        "安全": "私有部署 + 数据隔离",
        "治理": "模型注册 + 审计 + 合规",
        "预算": "$10K-100K+/月",
    },
}
```

## 4. 交叉引用

- [[入门/|入门]]
- [[入门/AI_Career_Guide/AI_Career_Guide|AI 职业指南]]
- [[编程/AI_IDE/AI_IDE_Landscape_2026|AI IDE 全景]]
- [[大模型/|大模型]]
- [[智能体/|智能体]]
