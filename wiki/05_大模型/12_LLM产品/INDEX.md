---
title: LLM Products
type: index
created: 2026-07-02
updated: 2026-07-21
sources: []
name_zh: "大模型产品"
name_en: "LLM Products"
---

# LLM Products

> 中文简称：大模型产品 ｜ English Name: LLM Products

LLM 产品概览索引，覆盖主流 AI 助手、结构化输出工具和 AI 搜索引擎。

## 子域简介

本子域聚焦 LLM 产品层，包括：

- **AI 助手**: ChatGPT、Claude、Gemini、DeepSeek
- **结构化工具**: Instructor、Outlines
- **AI 搜索**: Perplexity
- **提示词资源**: God Tier Prompts

## Files

- [[05_大模型/12_LLM产品/01_chatgpt_概览|Chatgpt Overview]]
- [[05_大模型/12_LLM产品/02_claude_概览|Claude Overview]]
- [[05_大模型/12_LLM产品/03_deepseek_概览|Deepseek Overview]]
- [[05_大模型/12_LLM产品/04_gemini_概览|Gemini Overview]]
- [[05_大模型/12_LLM产品/05_god_tier_prompts_概览|God Tier Prompts Overview]]
- [[05_大模型/12_LLM产品/07_instructor_概览|Instructor Overview]]
- [[05_大模型/12_LLM产品/08_outlines_概览|Outlines Overview]]
- [[05_大模型/12_LLM产品/09_perplexity_概览|Perplexity Overview]]
- [[05_大模型/12_LLM产品/README|README]]

## 产品对比矩阵

| 产品 | 类型 | 特点 | 适用场景 |
|------|------|------|------|
| ChatGPT | AI 助手 | 综合能力强 | 通用任务 |
| Claude | AI 助手 | 安全对齐、长上下文 | 企业应用 |
| Gemini | AI 助手 | 原生多模态 | 多模态任务 |
| DeepSeek | AI 助手 | 开源、性价比高 | 开发者 |
| Perplexity | AI 搜索 | 有来源的答案 | 研究调研 |
| Instructor | 工具 | 结构化输出 | 应用开发 |
| Outlines | 工具 | 约束生成 | 可靠输出 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|------|------|
| 入门 | chatgpt_overview | 了解 AI 助手 |
| 进阶 | instructor_overview | 结构化输出 |
| 拓展 | perplexity_overview | AI 搜索应用 |
| 实践 | god-tier-prompts_overview | 提示词工程 |

## 核心概念速查

| 概念 | 说明 | 相关产品 |
|------|------|------|
| 结构化输出 | 保证 LLM 输出符合 Schema | Instructor, Outlines |
| RAG | 检索增强生成 | Perplexity |
| 提示词工程 | 设计有效提示 | God Tier Prompts |
| 多模态 | 图文音视频理解 | Gemini, ChatGPT |

## 常见问题

| 问题 | 解答 |
|------|------|
| 如何选择 AI 助手？ | 根据任务、成本、合规要求 |
| 结构化输出重要吗？ | 生产应用必须 |
| AI 搜索可靠吗？ | 需验证来源 |

## 相关概念

- [[05_大模型/13_全球LLM生态|全球 LLM 生态]]
- [[05_大模型/07_提示工程|提示词工程]]
- [[概念/LLM/structured-output|结构化输出]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 8 |
| 产品类型 | 4 |
| 最后更新 | 2026-07-21 |

> 💡 LLM 产品层是技术落地的关键，选择时需综合考虑能力、成本、合规和集成难度。

## 附录：产品选择决策树

```
需要 LLM 产品 →
├── 通用对话 → ChatGPT / Claude
├── 多模态任务 → Gemini / GPT-4o
├── 结构化输出 → Instructor / Outlines
├── 研究调研 → Perplexity
└── 提示词参考 → God Tier Prompts
```

## 附录：API 集成要点

| 要点 | 说明 |
|------|------|
| 认证 | API Key 管理 |
| 速率限制 | 请求频率控制 |
| 错误处理 | 重试机制 |
| 成本控制 | Token 用量监控 |
| 安全 | 输入过滤、输出审核 |

---
*Last updated: 2026-07-21*

## 附录：产品功能对比

| 功能 | ChatGPT | Claude | Gemini | DeepSeek |
|------|------|------|------|------|
| 对话 | ✅ | ✅ | ✅ | ✅ |
| 代码 | ✅ | ✅ | ✅ | ✅ |
| 多模态 | ✅ | ✅ | ✅ | 部分 |
| 长上下文 | 128K | 200K | 1M | 128K |
| 推理 | ✅ | ✅ | ✅ | ✅ |
| API | ✅ | ✅ | ✅ | ✅ |
| 开源 | 否 | 否 | 部分 | 是 |

## 附录：成本对比

| 产品 | 免费层 | 付费起价 | 企业方案 |
|------|------|------|------|
| ChatGPT | 有 | $20/月 | 定制 |
| Claude | 有 | $20/月 | 定制 |
| Gemini | 有 | $20/月 | 定制 |
| DeepSeek | 有 | 按量 | 定制 |
| Perplexity | 有 | $20/月 | 定制 |

## 附录：使用场景推荐

| 场景 | 推荐产品 | 理由 |
|------|------|------|
| 日常对话 | ChatGPT | 综合能力强 |
| 代码开发 | Claude/ChatGPT | 代码理解好 |
| 文档分析 | Claude | 长上下文 |
| 多模态 | Gemini | 原生支持 |
| 研究调研 | Perplexity | 有来源 |
| 应用开发 | Instructor | 结构化输出 |
| 开源部署 | DeepSeek | 可自托管 |

## 附录：安全与合规

| 产品 | 数据政策 | 合规认证 | 适用地区 |
|------|------|------|------|
| ChatGPT | 可不用训练 | SOC2 | 全球 |
| Claude | 可不用训练 | SOC2 | 全球 |
| Gemini | 可不用训练 | SOC2 | 全球 |
| DeepSeek | 开源可控 | - | 全球 |

## 附录：集成方式

| 方式 | 说明 | 适用场景 |
|------|------|------|
| Web UI | 网页界面 | 个人使用 |
| API | REST/SDK | 应用集成 |
| 插件 | 第三方集成 | 扩展功能 |
| 私有部署 | 本地/私有云 | 企业安全 |

## 附录：评估指标

| 指标 | 说明 | 测量方法 |
|------|------|------|
| 准确率 | 答案正确性 | 人工评估 |
| 延迟 | 响应时间 | P50/P95/P99 |
| 成本 | Token 价格 | 每百万 Token |
| 可用性 | 服务稳定性 | SLA |
| 安全性 | 数据保护 | 合规审计 |

## 附录：2026 产品趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| Agent 化 | 自主任务执行 | 工作流自动化 |
| 多模态融合 | 图文音视频统一 | 更丰富交互 |
| 个性化 | 记忆和偏好 | 更好体验 |
| 企业级 | 安全合规 | 大规模采用 |
| 开源追平 | 能力接近闭源 | 降低成本 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 结构化输出 | Structured Output | 符合 Schema 的输出 |
| 检索增强 | RAG | 结合检索的生成 |
| 提示词 | Prompt | 输入指令 |
| 上下文窗口 | Context Window | 可处理 Token 数 |
| 对齐 | Alignment | 符合人类意图 |

> 💡 选择 LLM 产品的核心原则：先明确需求，再评估能力，最后考虑成本和合规。

---

## 快速导航

- 想了解 AI 助手？→ [[05_大模型/12_LLM产品/01_chatgpt_概览|ChatGPT 概览]]
- 需要结构化输出？→ [[05_大模型/12_LLM产品/07_instructor_概览|Instructor 概览]]
- 做研究调研？→ [[05_大模型/12_LLM产品/09_perplexity_概览|Perplexity 概览]]
- 学提示词工程？→ [[05_大模型/12_LLM产品/05_god_tier_prompts_概览|God Tier Prompts]]
