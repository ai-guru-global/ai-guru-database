---
title: "Agentic RAG"
category: -concepts
tags: ["rag", "agentic-rag", "agent", "retrieval", "reasoning", "self-rag"]
relationships:
  - target: "_concepts/rag-systems"
    type: evolves_from
  - target: "_concepts/ai-agents"
    type: uses
  - target: "_concepts/tool-calling"
    type: uses
  - target: "_concepts/reasoning-models"
    type: related_to
sources:
  - RAG系统/Advanced_RAG/Agentic_RAG_Guide.md
  - RAG系统/Advanced_RAG/RAG_Advanced_2026.md
  - RAG系统/README_Advanced.md
summary: "Agentic RAG 是让大模型在检索时拥有‘自主权’的 RAG 升级版。模型不再一次性检索就回答，而是可以判断要不要检索、检索什么、检索结果够不够好，必要时重写查询多轮迭代，把准确率从 70% 提升到 90%+。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.84
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Agentic Rag"
  - "agentic rag"

---
# Agentic RAG

## 核心要点

- **传统 RAG**：用户提问 → 检索一次 → 把检索结果塞进 prompt → 生成答案。
- **Agentic RAG**：把检索交给 Agent，Agent 自己决定：
  - 这个问题需要检索吗？
  - 检索一次够吗？
  - 检索结果可靠吗？
  - 要不要再检索一次、换个关键词？
- **代表方案**：Self-RAG、Corrective RAG（CRAG）、ReAct RAG、RAG Agent。

## 一句话理解

传统 RAG 像学生开卷考只翻一次书；Agentic RAG 像侦探查案，会反复翻资料、交叉验证、追问线索，直到答案靠谱。

## 详细内容

### 传统 RAG 的瓶颈

```
用户问：这家公司去年营收多少？
↓
检索：找到 5 篇新闻
↓
生成：可能新闻没提营收，模型就开始瞎编
```

问题在于：检索一次得到的内容可能不够、不对、不全。

### Agentic RAG 怎么做

```
用户提问
  ↓
Agent 判断：需要检索吗？
  ├─ 不需要 → 直接回答
  └─ 需要 → 执行检索
            ↓
      评估检索结果质量
            ↓
      ├─ 足够 → 生成答案
      ├─ 不够 → 重写查询再检索
      └─ 矛盾 → 多源交叉验证
```

### 主要技术路线

| 方案 | 核心思想 |
|------|----------|
| **Self-RAG** | 模型生成时主动决定是否需要检索，并引用来源 |
| **CRAG** | 检索结果打分，低分时改查询、用 web 搜索补全 |
| **ReAct RAG** | 推理（Reasoning）和行动（Action）交替，多轮检索 |
| **GraphRAG** | 结合知识图谱做多跳推理 |

### 适用场景

- **复杂企业知识库问答**：需要跨文档汇总、推理。
- **法律咨询/医疗诊断**：答案必须可追溯、可验证。
- **科研文献综述**：需要多轮检索、去重、归纳。

### 成本与收益

| 方面 | 说明 |
|------|------|
| 准确率 | 通常比传统 RAG 高 10-20% |
| 延迟 | 多轮迭代带来更高延迟 |
| 成本 | 更多 LLM 调用和检索次数 |
| 可解释性 | 更高，因为决策过程可见 |

## 开放问题

- 如何在准确率、延迟、成本之间自动权衡。
- Agentic RAG 的评估标准尚未统一。
- 与长上下文模型（128K+）的边界：什么情况下直接塞全文比反复检索更好。

## Related

- [[_concepts/rag-systems]] — RAG 检索增强生成
- [[_concepts/ai-agents]] — AI Agent
- [[_concepts/tool-calling]] — 工具调用
- [[_concepts/reasoning-models]] — 推理模型
- [[RAG系统/Advanced_RAG/Agentic_RAG_Guide]] — Agentic RAG 指南
- [[RAG系统/Advanced_RAG/RAG_Advanced_2026]] — RAG 高级技术 2026
- [[_concepts/agent-memory-systems]] — Agent Memory Systems
- [[_concepts/ai-coding-paradigms]] — Ai Coding Paradigms
- [[_concepts/rag-patterns]] — Rag Patterns
