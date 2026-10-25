---
title: "LLM Products Overview"
tags: [nlp, llm, products, chatgpt, claude, gemini, production]
status: complete
last_updated: 2026-07-21
sources: []
name_zh: "大模型产品总览"
---

# LLM Products Overview

> 中文简称：大模型产品总览

## Purpose

This directory contains overviews of major LLM products and tools in the ecosystem.

## Contents

| File | Description |
|------|-------------|
| 01_chatgpt_概览.md | OpenAI ChatGPT product overview |
| 02_claude_概览.md | Anthropic Claude product overview (2026) |
| 04_gemini_概览.md | Google Gemini product overview (2026) |
| 03_deepseek_概览.md | DeepSeek product overview (2026) |
| 09_perplexity_概览.md | Perplexity AI search product |
| 07_instructor_概览.md | Instructor library for structured outputs |
| 08_outlines_概览.md | Outlines for constrained generation |
| 05_god_tier_prompts_概览.md | Curated high-quality prompts |

## Related Directories

- [[05_大模型/13_全球LLM生态/README]]: LLM provider deep dives
- [[概念/LLM/llm-architectures]]: Technical architecture details
- [[概念/LLM/prompt-engineering]]: How to use these products effectively

## 产品对比

| 产品 | 厂商 | 特点 | 适用 |
|------|------|------|------|
| ChatGPT | OpenAI | 全能 | 通用 |
| Claude | Anthropic | 长文本 | 分析 |
| Gemini | Google | 多模态 | 综合 |
| DeepSeek | 深度求索 | 性价比 | 开发 |
| Perplexity | Perplexity | 搜索 | 研究 |

## 学习路径

| 阶段 | 内容 | 目标 |
|------|------|------|
| 入门 | 产品概览 | 了解选择 |
| 实践 | ChatGPT/Claude | 日常使用 |
| 开发 | API 调用 | 集成应用 |
| 进阶 | 结构化工具 | 高级用法 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 如何选择？ | 根据需求和预算 |
| API 费用？ | 按 Token 计费 |
| 开源替代？ | DeepSeek/Qwen |
| 企业级？ | Azure/AWS |

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 20 |
| 最后更新 | 2026-07-21 |

> 💡 选择正确的 LLM 产品是 AI 应用成功的第一步。

## 附录：API 定价对比

| 产品 | 输入 | 输出 | 特点 |
|------|------|------|------|
| GPT-4o | $2.5/M | $10/M | 全能 |
| Claude 3.5 | $3/M | $15/M | 长文本 |
| Gemini 2 | $1.25/M | $5/M | 多模态 |
| DeepSeek-V3 | $0.27/M | $1.1/M | 低价 |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 价格战 | 成本下降 | 普及 |
| 多模态 | 图文音视频 | 新场景 |
| Agent | 工具调用 | 自动化 |
| 企业级 | 私有部署 | 安全 |

## 附录：应用场景

| 场景 | 推荐产品 | 说明 |
|------|------|------|
| 日常对话 | ChatGPT/Claude | 通用助手 |
| 代码开发 | Claude/DeepSeek | 编程助手 |
| 文档分析 | Claude/Gemini | 长文本 |
| 搜索研究 | Perplexity | 实时信息 |
| 多模态 | GPT-4o/Gemini | 图文理解 |
| 企业应用 | Azure/AWS | 合规部署 |

## 附录：开发工具

| 工具 | 用途 | 特点 |
|------|------|------|
| Instructor | 结构化输出 | Pydantic |
| Outlines | 约束生成 | 正则/Schema |
| LangChain | 应用框架 | 链式调用 |
| LlamaIndex | RAG 框架 | 数据连接 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| API | Application Interface | 应用接口 |
| Token | Token | 计费单位 |
| 上下文 | Context | 输入窗口 |
| 流式 | Streaming | 逐字输出 |
| 函数调用 | Function Calling | 工具调用 |

## 附录：企业级功能

| 功能 | 说明 | 产品 |
|------|------|------|
| SSO | 单点登录 | 企业版 |
| 审计日志 | 使用记录 | 企业版 |
| 数据隔离 | 隐私保护 | 私有部署 |
| SLA | 服务保障 | 商业版 |

## Related

- [[05_大模型/13_全球LLM生态/index|Global LLM Ecosystem]]
- [[05_大模型/14_中国LLM生态/index|Chinese LLM Ecosystem]]
- [[05_大模型/index|大模型首页]]

## 附录：模型能力对比

| 能力 | GPT-4o | Claude | Gemini | DeepSeek |
|------|------|------|------|------|
| 推理 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 代码 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 多模态 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 长文本 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 中文 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 附录：部署选项

| 方式 | 说明 | 适用 |
|------|------|------|
| API | 云服务 | 快速上手 |
| 私有云 | 专属部署 | 企业级 |
| 本地 | 完全离线 | 高安全 |
| 混合 | 云+本地 | 灵活 |

## 附录：安全与合规

| 议题 | 说明 | 措施 |
|------|------|------|
| 数据隐私 | 训练数据 | 不用于训练 |
| 合规 | 行业规范 | 认证 |
| 审计 | 使用记录 | 日志 |
| 内容安全 | 有害内容 | 过滤 |

## 附录：成本优化

| 策略 | 说明 | 节省 |
|------|------|------|
| 缓存 | 重复请求 | 50%+ |
| 批处理 | 合并请求 | 30% |
| 模型选择 | 小模型 | 70% |
| 提示优化 | 减少 Token | 20% |

## 附录：集成模式

| 模式 | 说明 | 适用 |
|------|------|------|
| 直接调用 | API 请求 | 简单应用 |
| RAG | 检索增强 | 知识密集 |
| Agent | 工具调用 | 复杂任务 |
| 微调 | 领域适配 | 专业场景 |

> 💡 LLM 产品生态日益丰富，选择适合的工具可以事半功倍。

## 相关域

- [[05_大模型/07_提示工程/index|Prompt Engineering]]
- [[05_大模型/08_推理模型/index|Reasoning Models]]
- [[10_部署推理/index|部署推理]]

## 附录：选择决策树

| 需求 | 推荐 |
|------|------|
| 通用对话 | ChatGPT |
| 代码开发 | Claude |
| 多模态 | GPT-4o |
| 低成本 | DeepSeek |

## 附录：参考

| 资源 | 说明 |
|------|------|
| OpenAI API | 官方文档 |

---
*Last updated: 2026-07-21*
