---
title: "Agentic RAG"
category: -concepts
tags: ["rag", "agentic-rag", "agent", "retrieval", "reasoning", "self-rag"]
relationships:
  - target: "概念/rag-systems"
    type: evolves_from
  - target: "概念/ai-agents"
    type: uses
  - target: "概念/tool-calling"
    type: uses
  - target: "概念/reasoning-models"
    type: related_to
sources:
  - 14_RAG系统/04_Advanced_RAG/Agentic_RAG_Guide.md
  - 14_RAG系统/04_Advanced_RAG/RAG_Advanced_2026.md
  - 14_RAG系统/README_Advanced.md
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
updated: 2026-07-21
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

## 2026 年 Agentic RAG 生态

| 框架/工具 | Agentic RAG 支持 | 特色 |
|-----------|------------------|------|
| **LangGraph** | ✅ 原生 | 图编排 + 条件检索 + 状态机 |
| **LlamaIndex** | ✅ AgentRunner | 多步检索 + 工具调用 |
| **CrewAI** | ✅ 多 Agent | 研究员 Agent + 写作 Agent |
| **Self-RAG** | ✅ 模型内置 | 自主决定是否需要检索 |
| **CRAG** | ✅ 纠正式 | 检索质量评分 + 补充检索 |

## 生产最佳实践

1. **设置最大迭代次数**：防止 Agent 无限检索，建议 ≤ 3 轮
2. **检索质量评分**：每轮检索后评估相关性，低分则重写查询
3. **成本监控**：多轮检索 = 多次 LLM 调用，必须监控 Token
4. **与长上下文互补**：简单问题直接塞全文，复杂问题用 Agentic RAG
5. **可解释性**：保留检索决策日志，方便审计和调试
6. **缓存策略**：重复查询命中缓存，减少重复检索
7. **降级机制**：多轮失败后降级到传统 RAG 或直接回答

## 代码示例

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class RAGState(TypedDict):
    question: str
    documents: List[str]
    generation: str
    search_count: int
    quality_score: float

def should_retrieve(state: RAGState) -> str:
    """Agent 决策：是否需要检索"""
    # 简单问题直接回答
    if is_simple_question(state["question"]):
        return "generate"
    return "retrieve"

def evaluate_retrieval(state: RAGState) -> str:
    """评估检索质量"""
    score = evaluate_relevance(state["documents"], state["question"])
    if score > 0.8:
        return "generate"
    elif state["search_count"] < 3:
        return "rewrite"  # 重写查询再检索
    else:
        return "generate"  # 达到最大次数，强制生成

def rewrite_query(state: RAGState) -> RAGState:
    """重写查询"""
    new_query = llm.invoke(
        f"基于以下问题生成更好的搜索查询: {state['question']}"
    )
    state["question"] = new_query
    state["search_count"] += 1
    return state

# 构建图
workflow = StateGraph(RAGState)
workflow.add_node("retrieve", retrieve_documents)
workflow.add_node("generate", generate_answer)
workflow.add_node("rewrite", rewrite_query)

workflow.set_conditional_entry_point(should_retrieve)
workflow.add_conditional_edges("retrieve", evaluate_retrieval)
workflow.add_edge("rewrite", "retrieve")
workflow.add_edge("generate", END)

app = workflow.compile()
```

## 评估指标

| 指标 | 说明 | 目标值 |
|------|------|--------|
| **答案准确率** | 最终答案的正确性 | >90% |
| **检索精确率** | 检索文档的相关性 | >80% |
| **平均迭代次数** | Agent 检索轮数 | <2.5 |
| **响应延迟** | 端到端时间 | <10s |
| **成本/查询** | Token + API 费用 | <$0.05 |
| **引用覆盖率** | 答案有来源支持的比例 | >95% |

## 开放问题

- 如何在准确率、延迟、成本之间自动权衡
- Agentic RAG 的评估标准尚未统一
- 与长上下文模型（128K+）的边界：什么情况下直接塞全文比反复检索更好
- 多模态 Agentic RAG（图片、表格、视频）的检索策略
- 实时数据源的 Agentic RAG 如何处理数据新鲜度

## 与传统 RAG 对比

| 维度 | 传统 RAG | Agentic RAG |
|------|----------|-------------|
| **检索次数** | 固定 1 次 | 动态 0-N 次 |
| **查询重写** | 无 | 自动重写 |
| **质量评估** | 无 | 每轮评估 |
| **多源验证** | 无 | 交叉验证 |
| **可解释性** | 低 | 高（决策链可见） |
| **成本** | 低 | 中-高 |
| **延迟** | 低 | 中-高 |
| **准确率** | 70-80% | 85-95% |

## Related

- [[概念/rag-systems]] — RAG 检索增强生成
- [[概念/ai-agents]] — AI Agent
- [[概念/tool-calling]] — 工具调用
- [[概念/reasoning-models]] — 推理模型
- [[14_RAG系统/04_Advanced_RAG/Agentic_RAG_Guide]] — Agentic RAG 指南
- [[14_RAG系统/04_Advanced_RAG/RAG_Advanced_2026]] — RAG 高级技术 2026
- [[概念/agent-memory-systems]] — Agent Memory Systems
- [[概念/ai-coding-paradigms]] — Ai Coding Paradigms
- [[概念/rag-patterns]] — Rag Patterns
