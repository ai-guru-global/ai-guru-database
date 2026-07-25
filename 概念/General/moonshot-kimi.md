---
title: "Moonshot AI / Kimi 模型系列 (Moonshot AI & Kimi Model Family)"
category: -concepts
tags: ["moonshot", "kimi", "chinese-llm", "long-context", "ai-stack"]
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/long-context-models"
    type: related_to
  - target: "概念/deepseek-models"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "Moonshot AI（月之暗面）是中国 AI 公司，旗下 Kimi 智能助手以超长上下文（200K-2M tokens）著称。AI Stack 预置 Kimi-K2.5/K2.6 模型。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
---

# Moonshot AI / Kimi 模型系列

> **一句话理解**: Moonshot AI（月之暗面）是"长上下文之王"——Kimi 以 200K-2M token 上下文窗口闻名，是中国 AI 四小龙之一。

---

## 1. 公司概况

| 维度 | 信息 |
|------|------|
| **公司名** | 月之暗面 (Moonshot AI) |
| **创始人** | 杨植麟（清华大学背景） |
| **成立时间** | 2023 年 |
| **核心产品** | Kimi 智能助手 |
| **估值** | 超过 30 亿美元（2024） |
| **技术路线** | 超长上下文 + 多模态 |

---

## 2. Kimi 模型系列

| 模型 | 上下文 | 特点 |
|------|--------|------|
| **Kimi-K2.5** | 128K+ | AI Stack 预置版本 |
| **Kimi-K2.6** | 128K+ | AI Stack 最新版本 |
| **Kimi-1.5** | 128K | 推理增强版 |
| **moonshot-v1** | 200K | 初代长上下文模型 |
| **Kimi Chat** | 2M | 消费端产品（200万字） |

### 技术特点

| 特点 | 说明 |
|------|------|
| **超长上下文** | 200K-2M tokens，支持完整书籍/代码仓库输入 |
| **中文能力** | 中文理解和生成优秀 |
| **多模态** | 支持图文混合理解 |
| **推理增强** | 支持深度思考和工具调用 |

---

## 3. 在 AI Stack 中的位置

AI Stack V2.14.0 预置 Moonshot 模型：

| 模型 | 说明 |
|------|------|
| Kimi-K2.5 | AI Stack 预置 |
| Kimi-K2.6 | AI Stack 最新版 |

### AI Stack 多厂商模型生态

```
AI Stack 模型生态
│
├── 阿里自研: Qwen 系列 + Qwen3-Pro（独占）
├── DeepSeek: R1/V3/V4 全系列
├── Moonshot: Kimi-K2.5/K2.6 ← 本文
├── 智谱 AI: GLM-5.1 系列
├── MiniMax: M2.7
└── BAAI: bge-reranker（重排序）
```

---

## 4. 与中国大模型竞品对比

| 维度 | Kimi (Moonshot) | Qwen (阿里) | DeepSeek | GLM (智谱) |
|------|----------------|------------|----------|-----------|
| **上下文** | 200K-2M | 128K-256K | 128K | 128K |
| **核心优势** | 超长文本 | 全能+开源 | 开源+高效 | 学术根基 |
| **开源** | 部分 | 全面 Apache 2.0 | 全面 MIT | 部分开源 |
| **MoE** | 是 | 是 | 是 | 是 |
| **代码能力** | 强 | 强 | 强 | 中 |

---

## Related

- [[概念/llm-architectures]] — LLM 架构
- [[概念/long-context-models]] — 长上下文模型
- [[概念/deepseek-models]] — DeepSeek 系列
- [[概念/zhipu-glm]] — 智谱 GLM 系列
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 Moonshot/Kimi 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Kimi** | Moonshot 大模型 | GA |
| **长上下文** | 超长上下文支持 | GA |
| **Kimi API** | 模型 API 服务 | GA |
| **开源模型** | 开源模型生态 | GA |
| **多模态** | 多模态能力 | GA |

## 生产最佳实践

1. **长上下文**：长文档处理用 Kimi
2. **国产模型**：国产场景考虑 Kimi
3. **API 调用**：用 API 调用 Kimi
4. **与 DeepSeek 对比**：根据场景选择 Kimi 或 DeepSeek
5. **开源优势**：开源模型可自托管

## API 调用示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-moonshot-key",
    base_url="https://api.moonshot.cn/v1"
)

response = client.chat.completions.create(
    model="moonshot-v1-128k",
    messages=[{"role": "user", "content": "总结这篇文档..."}],
    temperature=0.7
)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 长文本处理慢 | 上下文太长 | 分段处理/摘要 |
| API 调用失败 | Key/网络问题 | 检查配置和代理 |
| 效果不如预期 | 模型版本旧 | 升级最新版本 |
| 成本高 | 长上下文 token 多 | 精简输入/缓存 |

## 版本兼容性

| 模型 | 状态 | 说明 |
|------|------|------|
| Kimi (moonshot-v1) | GA | 长上下文 |
| Kimi 开源版 | GA | 自托管 |
| OpenAI 兼容 API | GA | 接口兼容 |

## 生产检查清单

1. 长文档场景优先测试 Kimi
2. 监控 API 调用成本和延迟
3. 与 Qwen/DeepSeek 对比评测
4. 配置内容安全过滤
5. 建立模型版本回滚机制
6. 敏感数据自托管部署

## 版本兼容性

| 模型 | 上下文 | 特点 | 适用场景 |
|------|------|------|------|
| **Kimi k2** | 128K | MoE 1T 参数，工具调用强 | Agent/复杂任务 |
| **moonshot-v1-128k** | 128K | 长上下文理解 | 长文档分析 |
| **moonshot-v1-32k** | 32K | 平衡性能与成本 | 通用对话 |
| **moonshot-v1-8k** | 8K | 低成本快速 | 简单任务 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 长文档处理慢 | 上下文过长 | 分段处理 + 摘要策略 |
| API 限流 | 并发超限 | 实现指数退避重试 |
| 中文理解优于英文 | 训练数据分布 | 英文任务考虑其他模型 |
| 输出截断 | max_tokens 不足 | 调大 max_tokens 参数 |

## 总结

Moonshot/Kimi 是国产大模型中长上下文能力的代表，其 200K+ 上下文窗口适合长文档分析、报告生成等场景。对于需要处理超长文本的国产场景，Kimi 是重要选择。

> 💡 Kimi 的核心优势：长上下文是其独特卖点——处理 100 页文档、整本书籍、长会议记录时，Kimi 是国产模型中的首选。

## 相关概念

- [[概念/zhipu-glm]] — 智谱 GLM 系列
- [[概念/qwen]] — 通义千问
- [[概念/long-context]] — 长上下文技术

