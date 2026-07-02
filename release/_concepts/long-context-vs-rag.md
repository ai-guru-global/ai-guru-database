---
title: "长上下文 vs RAG: 技术选型指南"
category: "-concepts"
tags: ["rag", "long-context", "architecture", "design-decision", "trade-off"]
summary: "当 LLM 支持 100K+ token 上下文窗口时,RAG 还有必要吗?本文对比两种方案的优劣,提供技术选型决策框架。"
sources:
  - "https://arxiv.org/abs/2307.03172"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: core
aliases:
  - "Long Context Vs Rag"
  - "long context vs rag"
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.78
relationships:
  - target: "_concepts/rag-systems"
    type: related_to
---
# 长上下文 vs RAG: 技术选型指南

> **一句话理解**: 当 LLM 支持 100K+ token 上下文窗口时,RAG 还有必要吗?本文对比两种方案的优劣,提供技术选型决策框架。

## 核心问题

随着 Gemini (1M tokens)、Claude (200K tokens)、GPT-4o (128K tokens) 等长上下文模型的出现,一个关键问题浮出水面:还需要 RAG 吗?

## 方案对比

| 维度 | 长上下文 | RAG |
|------|---------|-----|
| **实现复杂度** | 低(直接塞进 prompt) | 高(检索管道、向量数据库) |
| **成本** | 高(token 费用随上下文线性增长) | 中(仅检索相关片段) |
| **延迟** | 高(长输入处理慢) | 低(仅处理相关片段) |
| **准确性** | 中(可能迷失在中间) | 高(精确检索相关信息) |
| **可扩展性** | 差(受窗口限制) | 好(可处理任意大语料) |
| **实时性** | 差(需要重新输入) | 好(索引可实时更新) |
| **可解释性** | 低(不知道参考了什么) | 高(可追溯检索来源) |

## 何时用长上下文?

- 文档量小(单个文档 < 100K tokens)
- 需要全局理解(总结、分析整个文档)
- 快速原型(不想搭建检索管道)
- 文档结构复杂(表格、图表混合)

## 何时用 RAG?

- 语料库大(超过模型上下文窗口)
- 需要实时更新(知识库频繁变化)
- 成本敏感(不想为不相关内容付费)
- 需要可追溯性(引用来源)
- 多轮对话(需要记忆管理)

## 混合方案(最佳实践)

实际生产中,最佳方案通常是两者结合:

```
用户查询
  |
  v
[路由层] 判断查询类型
  |
  +-- 简单事实查询 -> RAG (精确检索)
  |
  +-- 全局分析查询 -> 长上下文 (全文输入)
  |
  +-- 复杂推理 -> RAG + 长上下文 (检索后拼接)
```

### 具体策略

1. **RAG-first**: 默认用 RAG 检索,仅在需要全文分析时切换
2. **分层检索**: 先粗检索(关键词),再精检索(语义),最后用长上下文补充
3. **摘要索引**: 对长文档先生成摘要索引,检索时用摘要定位,再用长上下文读全文
4. **上下文压缩**: 检索后用 LLM 压缩上下文,减少 token 消耗

## 关键研究

| 研究 | 发现 |
|------|------|
| Lost in the Middle | LLM 对上下文中间位置的信息关注度最低 |
| RAG vs Long Context | RAG 在精确信息检索任务上始终优于长上下文 |
| RAPTOR | 递归摘要 + 检索 = 最佳分层方案 |

> **关联**: -> [[14_RAG_Systems/README|RAG 系统]] | [[05_NLP_LLMs/README|NLP/LLM]] | [[90_Learn/guides/ai_engineering_roadmap_2026|AI 工程路线图]]

