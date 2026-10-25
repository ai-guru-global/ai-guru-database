---
title: "Agentic RAG 2.0 (Self-RAG / CRAG / FLARE / Corrective RAG / Adaptive)"
category: concepts
tags:
  - rag
  - agentic-rag
  - self-rag
  - crag
  - flare
  - corrective-rag
  - adaptive-rag
  - agentic
aliases:
  - Agentic RAG 2.0
  - Self-RAG
  - CRAG
  - FLARE
  - Corrective RAG
  - Adaptive RAG
relationships:
  - target: "概念/rag-systems"
    type: extends
  - target: "概念/agentic-rag"
    type: related_to
  - target: "概念/agent-loop"
    type: related_to
  - target: "概念/reranker"
    type: related_to
summary: "Agentic RAG 2.0 是 2024-2026 让 RAG 具备"自我反思 / 动态决策 / 多轮检索"能力的范式——Self-RAG(自评 token)、CRAG(Corrective,可纠错)、FLARE(前瞻性检索)、Adaptive RAG(路由器)、Corrective RAG(2024 综述)。把 RAG 从"一次性检索 + 生成"升级为"多轮推理 + 工具调用"。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "智能体化 RAG 2.0"
---

# Agentic RAG 2.0

> 中文简称：智能体化 RAG 2.0

> **一句话理解**:Agentic RAG 2.0 让 RAG 像 Agent 一样"判断 → 检索 → 反思 → 重试"——Self-RAG 在每个 token 后自评,CRAG 检测错误并重检,FLARE 边生成边检索,Adaptive RAG 用路由器分流。比传统 RAG 准确率提升 20-40%,是 2025 主流方案。

---

## 一、传统 RAG 的痛点

- **一次性检索**:不查 / 查错就出错
- **无反思**:不知道检索结果好不好
- **无多轮**:不能像人一样多次查
- **上下文无关**:不知道要不要查、查什么

Agentic RAG 2.0 解法:
- **路由器**:判断"要不要检索"
- **自评**:检索结果好不好?重试?
- **多轮**:多步检索 + 推理
- **动态决策**:边生成边决定下一步

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 智能体 RAG | Agentic RAG | RAG + Agent 决策 |
| 自我反思 | Self-RAG | 训练模型评估自己输出 |
| 修正 RAG | Corrective RAG(CRAG) | 检索错误自动修正 |
| 前瞻性 RAG | FLARE | 边生成边前瞻检索 |
| 自适应 RAG | Adaptive RAG | 动态路由查询 |
| 路由器 | Router | 判断查询类型 |
| 反思 token | Reflection Token | Self-RAG 特殊 token |
| 多轮检索 | Multi-Turn Retrieval | 多次检索 |
| 主动检索 | Active Retrieval | 按需触发检索 |
| 查询重写 | Query Rewriting | 优化检索 query |
| 查询分解 | Query Decomposition | 复杂问题拆子问题 |
| 上下文压缩 | Context Compression | 减少无关信息 |
| 检索评估 | Retrieval Evaluation | 评估检索质量 |
| 重检 | Re-Retrieval | 检索结果差时重试 |
| 元检索 | Meta-Retrieval | 关于检索的检索 |
| 工具调用 | Tool Calling | RAG 作为工具 |
| 知识图谱 RAG | GraphRAG | KG + RAG |
| Web 检索 | Web Search | 实时外部知识 |
| 文档分级 | Document Grading | 相关性评分 |
| 答案验证 | Answer Verification | 答案对不对 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 论文/项目 | 核心机制 | 增益 | 适合 |
|---|---|---|---|---|
| **Self-RAG** | ICLR 2024 | 训练反思 token([Retrieve]/[IsRel]/[IsSup]) | +20% 准确率 | 训练型,需微调 |
| **CRAG** | ICLR 2024 | 检索后置信度评估 + Web 兜底 | +15% 准确率 | 即插即用 |
| **FLARE** | EMNLP 2023 | 边生成边前瞻检索 | +25% 长答案 | 长答案生成 |
| **Adaptive RAG** | NAACL 2024 | 路由器分流(单跳/多跳/无) | +30% 效率 | 混合查询 |
| **Corrective RAG** | Yan 2024 | 评估 + 重检 + Web 兜底 | +18% 准确率 | 易集成 |
| **ReAct RAG** | ReAct 范式 | Thought-Action-Observation | +15% 多步 | 多步推理 |
| **Self-Ask** | EMNLP 2022 | 子问题 + Web 搜索 | +20% 复杂问题 | 多跳问答 |
| **IRCoT** | EMNLP 2023 | CoT 引导多轮检索 | +25% 多跳 | 多跳问答 |
| **Active RAG** | 2025 | 主动决定何时检索 | +20% | 成本敏感 |
| **GraphRAG + Agentic** | 2025 | 图遍历 + 多轮推理 | +30% 全局 | 全局问题 |

---

## 四、Self-RAG 详解

### 4.1 核心思想

训练 LLM 输出特殊 **Reflection Tokens**:
- `[Retrieve]`:是否需要检索?
- `[IsRel]`:检索文档是否相关?
- `[IsSup]`:检索内容是否支撑生成?
- `[IsUse]`:整体回答质量

### 4.2 工作流

```
Query → [Retrieve?] → 检索 → [IsRel?]
   ↓
   多个文档 → 选择相关 → 生成 → [IsSup?]
                                       ↓
                                   不支撑 → 重检
```

### 4.3 优势

- 不依赖外部 RAG 框架
- 单模型端到端
- 训练后可解释

### 4.4 实战

```python
from self_rag import SelfRAGPipeline

pipeline = SelfRAGPipeline(
    model_name="selfrag-llama2-7b",
    retriever=weaviate_retriever,
)

result = pipeline.run("2024 奥运会在哪举办?")
print(result.answer, result.reflection)
# [Retrieve] [IsRel: yes] [IsSup: yes] [IsUse: 4]
# 2024 奥运会在巴黎举办。
```

---

## 五、CRAG(Corrective RAG)详解

### 5.1 核心思想

检索后**评估质量**,根据评估结果决定:
- **Correct**:直接用
- **Incorrect**:触发 Web 搜索兜底
- **Ambiguous**:文档 + Web 混合

### 5.2 架构

```
Query → 检索 → [Evaluator] 
   ├── Correct → 文档 → LLM
   ├── Incorrect → Web Search → LLM
   └── Ambiguous → 文档 + Web → LLM
```

### 5.3 实战

```python
from langchain.chains import CRAGChain
from langchain_openai import ChatOpenAI

chain = CRAGChain.from_llm(
    llm=ChatOpenAI(model="gpt-4o"),
    retriever=vector_store.as_retriever(),
    web_search_tool=google_search,
)

result = chain.invoke({"question": "OpenAI 最新的 GPT 模型是?"})
print(result["answer"])
```

### 5.4 优势

- 即插即用,无需训练
- Web 兜底处理冷启动
- 置信度评估避免误用低质文档

---

## 六、FLARE 详解

### 6.1 核心思想

**Forward-Looking Active REtrieval**:
- 边生成 token,边预测下一句
- 如果预测置信度低,触发检索
- 用检索结果替换原预测

### 6.2 工作流

```
生成 token → 下一句预测
   ↓
   置信度 < 阈值?
   ├── 否 → 继续生成
   └── 是 → 检索 → 用检索结果重写
```

### 6.3 适合

- 长答案生成
- 事实密集场景
- 多步骤说明

---

## 七、Adaptive RAG 详解

### 7.1 核心思想

用 **Router** 判断查询类型:
- **单跳问题**:直接 RAG
- **多跳问题**:多轮 RAG / Agent
- **无检索问题**:直接 LLM

### 7.2 架构

```
Query → [Router LLM]
   ├── A: 无需检索 → 直接 LLM
   ├── B: 单跳 → 一次性 RAG
   └── C: 多跳 → Agent 多轮 RAG
```

### 7.3 实战

```python
from langchain.agents import create_adaptive_rag_agent

agent = create_adaptive_rag_agent(
    llm=ChatOpenAI(model="gpt-4o"),
    tools=[single_hop_rag, multi_hop_rag],
    router_prompt="判断问题类型",
)
```

---

## 八、生产最佳实践

1. **首选 CRAG / Corrective RAG**:即插即用,无需训练,易集成。
2. **训练型方案选 Self-RAG**:有训练能力 / 数据可微调时。
3. **多跳问题用 IRCoT / Self-Ask**:CoT 引导多轮检索。
4. **长答案生成用 FLARE**:前瞻检索,事实准确。
5. **混合查询用 Adaptive RAG**:路由器节省成本。
6. **必须加 Web 兜底**:本地知识库不够全,Web 检索补足。
7. **置信度评估必备**:不评估就不知道检索质量。
8. **答案验证**:LLM-as-Judge 验证答案准确性。
9. **成本控制**:每次查询限制 < 3 次检索。
10. **评估用 RAGAS**:传统指标 + 检索质量 + 答案忠实度。
11. **A/B 测试**:不同方案对比,选最优。
12. **可观测性**:Langfuse / LangSmith 追踪每步。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **CRAG** | LangChain / LlamaIndex 集成,主流生产方案 |
| **Self-RAG** | SelfRAG-Llama2/3 已开源,2025-2026 微调服务化 |
| **FLARE** | 学术向,生产用 LangGraph + 自定义实现 |
| **Adaptive RAG** | LangGraph / LlamaIndex 路由器实现 |
| **框架集成** | LangGraph 1.0 / AutoGen 0.4 / LlamaIndex 原生 |
| **Web 搜索兜底** | Tavily / SerpAPI / DuckDuckGo / Brave Search |
| **评估** | RAGAS / TruLens / DeepEval 全部支持 |
| **企业应用** | 客服 / 法务 / 投研 / 政务"高质量 RAG" |
| **ARR 规模** | Agentic RAG 平台 $300M+,年增速 150% |
| **主要竞品** | LangChain / LlamaIndex / Haystack / Dify |

---

## 十、See Also(官方源)

### 核心论文

- Self-RAG [arxiv.org/abs/2310.11511](https://arxiv.org/abs/2310.11511)
- CRAG [arxiv.org/abs/2401.15884](https://arxiv.org/abs/2401.15884)
- FLARE [arxiv.org/abs/2305.06983](https://arxiv.org/abs/2305.06983)
- Adaptive RAG [arxiv.org/abs/2403.14403](https://arxiv.org/abs/2403.14403)
- IRCoT [arxiv.org/abs/2212.10509](https://arxiv.org/abs/2212.10509)
- Self-Ask [arxiv.org/abs/2204.06543](https://arxiv.org/abs/2204.06543)

### 框架集成

- LangGraph Adaptive RAG [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph/)
- LlamaIndex RouterQueryEngine [docs.llamaindex.ai](https://docs.llamaindex.ai/)
- Haystack Pipelines [haystack.deepset.ai](https://haystack.deepset.ai/)

### 评估

- RAGAS [github.com/explodinggradients/ragas](https://github.com/explodinggradients/ragas)
- TruLens [github.com/truera/trulens](https://github.com/truera/trulens)
- DeepEval [github.com/confident-ai/deepeval](https://github.com/confident-ai/deepeval)

### Web 搜索

- Tavily [tavily.com](https://tavily.com/)
- SerpAPI [serpapi.com](https://serpapi.com/)
- Brave Search [brave.com/search/api](https://brave.com/search/api/)

---

## 十一、相关概念卡

- [[概念/rag-systems|Rag Systems]]
- [[概念/agentic-rag|Agentic Rag]]
- [[概念/rag-patterns|Rag Patterns]]
- [[概念/hybrid-search|Hybrid Search]]
- [[概念/reranker|Reranker]]
- [[概念/agent-loop|Agent Loop]]
- [[概念/langgraph|Langgraph]]
- [[概念/llm-as-judge|Llm As Judge]]
