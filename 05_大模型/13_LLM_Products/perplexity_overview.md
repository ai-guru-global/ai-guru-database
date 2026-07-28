---
title: "Perplexity AI 概览"
category: "05-nlp-llms-llm-products"
tags: ["llm", "search", "product", "ai-assistant", "research"]
summary: "结合 LLM 与实时网络搜索的 AI 搜索引擎，提供带引用来源的精准回答，是信息检索的新范式。"
sources:
  - "https://www.perplexity.ai/"
created: 2026-06-12
updated: 2026-07-10
lifecycle: reviewed
tier: supporting
aliases:
  - "Perplexity Overview"
  - "perplexity overview"
  - perplexity_overview

name_zh: "Perplexity AI 概览"
---
# Perplexity AI 概览

> 中文简称：Perplexity AI 概览

> **一句话理解**: 结合 LLM 与实时网络搜索的 AI 搜索引擎，提供带引用来源的精准回答。

## 核心特性

- **搜索+生成**: 先搜索互联网，再用 LLM 生成回答
- **引用来源**: 每个回答都附带来源链接
- **实时信息**: 获取最新信息，不受训练数据截止限制
- **多模型**: 支持 GPT-4o、Claude、自研模型
- **Pro Search**: 多步推理，更深入的研究
- **Deep Research**: 自主多轮深度研究
- **Spaces**: 团队协作研究空间
- **API**: 开发者搜索 API

## 产品版本

| 版本 | 定价 | 特点 |
|------|------|------|
| Free | 免费 | 基础搜索，有限 Pro Search |
| Pro | $20/月 | 无限 Pro Search，多模型选择 |
| Enterprise | 定制 | 企业安全、SSO、审计 |
| API | 按量计费 | 开发者搜索接口 |

## 与传统搜索对比

| 维度 | Google | Perplexity | ChatGPT Search |
|------|--------|------------|----------------|
| 输出 | 链接列表 | 直接回答 | 直接回答 |
| 引用 | 无 | 每句话有引用 | 部分引用 |
| 交互 | 一次性 | 多轮追问 | 多轮追问 |
| 深度 | 表面 | Pro Search 深入 | 中等 |
| 实时性 | 强 | 强 | 强 |
| 广告 | 有 | 无 | 无 |

## 2026 Perplexity 生态

| 功能 | 说明 | 状态 |
|------|------|------|
| **Pro Search** | 多步推理搜索 | GA |
| **Deep Research** | 自主深度研究报告 | GA |
| **Spaces** | 团队研究协作 | GA |
| **Sonar API** | 开发者搜索 API | GA |
| **Perplexity Assistant** | 移动端 AI 助手 | GA |
| **Shopping** | AI 购物助手 | 预览 |

## API 使用示例

```python
import requests

url = "https://api.perplexity.ai/chat/completions"
headers = {"Authorization": f"Bearer {API_KEY}"}

response = requests.post(url, json={
    "model": "sonar-pro",
    "messages": [
        {"role": "user", "content": "2026年最新的AI芯片市场格局"}
    ],
    "search_recency_filter": "week"
})

result = response.json()
print(result["choices"][0]["message"]["content"])
print("Citations:", result["citations"])  # 来源链接
```

## 生产最佳实践

1. **搜索策略**：复杂问题用 Pro Search，简单问题用基础搜索
2. **引用验证**：始终检查引用来源的可靠性
3. **时效性**：使用 recency_filter 控制搜索时间范围
4. **多轮追问**：利用多轮对话深入探索
5. **API 集成**：将搜索能力嵌入自己的应用

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 回答不准确 | 来源质量差 | 检查引用 + 交叉验证 |
| 搜索速度慢 | Pro Search 多步 | 简单问题用基础搜索 |
| API 限流 | 并发超限 | 实现重试 + 缓存 |
| 中文效果差 | 英文优先 | 使用中文提示词引导 |

## 版本兼容性

| 组件 | 版本 | 特性 | 备注 |
|------|------|------|------|
| Sonar API | v2 (2026) | 多模型路由、流式输出 | 兼容 OpenAI 格式 |
| Pro Search | v3 | 多步推理、自动分解问题 | Pro 用户专属 |
| Deep Research | v2 | 自主多轮研究、报告生成 | 支持 PDF 导出 |
| Spaces | v2 | 团队协作、知识共享 | 企业版增强 |
| Mobile App | v4 | 语音搜索、相机搜索 | iOS/Android |

## 高级 API 用法

```python
# 多轮对话 + 搜索域限制
import requests

url = "https://api.perplexity.ai/chat/completions"
headers = {"Authorization": f"Bearer {API_KEY}"}

response = requests.post(url, json={
    "model": "sonar-pro",
    "messages": [
        {"role": "system", "content": "你是一位技术研究员"},
        {"role": "user", "content": "2026年向量数据库市场格局"},
        {"role": "assistant", "content": "主要玩家包括 Pinecone、Weaviate..."},
        {"role": "user", "content": "对比 Pinecone 和 Milvus 的性能"}
    ],
    "search_domain_filter": ["arxiv.org", "github.com"],
    "search_recency_filter": "month",
    "return_related_questions": True
})

result = response.json()
print(result["choices"][0]["message"]["content"])
print("Related:", result.get("related_questions", []))
```

## 性能基准

| 指标 | 基础搜索 | Pro Search | Deep Research |
|------|------|------|------|
| 平均延迟 | 2-3s | 5-10s | 30-120s |
| 引用数量 | 3-5 | 5-15 | 20-50+ |
| 搜索深度 | 单轮 | 3-5 步 | 10+ 轮 |
| 准确率 | 85% | 92% | 95%+ |
| Token 消耗 | ~500 | ~2000 | ~10000+ |

## 生产检查清单

1. ✅ 确认 API Key 权限和速率限制
2. ✅ 实现请求重试和指数退避
3. ✅ 缓存高频查询结果（TTL 建议 1h）
4. ✅ 验证引用来源的可靠性
5. ✅ 设置搜索时间范围避免过时信息
6. ✅ 监控 API 用量和成本
7. ✅ 实现降级策略（API 不可用时回退）
8. ✅ 对用户输入进行安全过滤

## 相关概念

- [[05_大模型/README|NLP & LLMs]]
- [[概念/perplexity|Perplexity 概念卡片]]
- [[概念/rag|RAG 检索增强生成]]
- [[概念/RAG/hybrid-search|AI 搜索]]
- [[05_大模型/13_LLM_Products/chatgpt_overview|ChatGPT 概览]]
- [[14_RAG系统/06_RAG_Frameworks/index|RAG 框架]]

## 总结

Perplexity 是 AI 搜索的领导者，将 LLM 与实时搜索结合，提供带引用的精准回答。它代表了信息检索从"找链接"到"给答案"的范式转变。2026 年 Perplexity 已从单一搜索工具进化为完整的研究平台，Deep Research 和 Spaces 功能使其成为知识工作者的核心生产力工具。

> 💡 Perplexity 的核心价值：让搜索从"给你一堆链接"变为"给你一个答案"——并且告诉你答案从哪里来。在 2026 年，它已不仅是搜索引擎，更是 AI 驱动的研究助手。

## 附录：Perplexity API 参数速查

| 参数 | 说明 | 示例 |
|------|------|------|
| model | 模型选择 | sonar-pro, sonar |
| search_recency_filter | 搜索时间范围 | day, week, month |
| search_domain_filter | 搜索域限制 | ["arxiv.org"] |
| return_related_questions | 返回相关问题 | true/false |
| temperature | 生成温度 | 0.0-1.0 |

## 附录：Perplexity 使用场景

| 场景 | 推荐功能 | 理由 |
|------|------|------|
| 快速事实查询 | 基础搜索 | 快速、免费 |
| 深度研究 | Pro Search | 多步推理 |
| 学术调研 | Deep Research | 全面报告 |
| 团队协作 | Spaces | 知识共享 |
| 开发集成 | Sonar API | 程序化调用 |

## 附录：Perplexity vs 传统搜索引擎

| 维度 | Perplexity | Google/Bing |
|------|------|------|
| 答案形式 | 综合摘要 + 引用 | 链接列表 |
| 交互方式 | 对话式 | 关键词搜索 |
| 深度研究 | 支持多步推理 | 需手动多次搜索 |
| 实时性 | 实时网络访问 | 实时索引 |
| 适用场景 | 研究、学习 | 快速查找 |

> 💡 Perplexity 的核心价值：将搜索引擎和 AI 助手融合，提供有来源的可信答案。
