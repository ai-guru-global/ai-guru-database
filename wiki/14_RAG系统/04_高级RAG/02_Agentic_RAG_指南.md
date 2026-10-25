---
title: "Agentic RAG: Agent 驱动的智能检索"
category: "14-rag-systems"
tags: ["rag", "agents", "agentic-rag", "architecture", "self-rag", "corrective-rag"]
summary: "将 Agent 能力融入 RAG 系统,实现自适应检索、多步推理、自我纠正的智能 RAG 架构。"
sources:
  - "https://github.com/NirDiamant/RAG_Techniques"
created: 2026-06-12
updated: 2026-06-15
lifecycle: reviewed
tier: supporting
aliases:
  - "Agentic Rag Guide"
  - "Agentic RAG Guide"
  - Agentic_RAG_Guide

name_zh: "Agentic RAG: Agent 驱动的智能检索"
---
# Agentic RAG: Agent 驱动的智能检索

> 中文简称：Agentic RAG: Agent 驱动的智能检索

> **一句话理解**: 将 Agent 能力融入 RAG 系统,实现自适应检索、多步推理、自我纠正的智能 RAG 架构。

## 什么是 Agentic RAG?

传统 RAG 是固定管道:查询 -> 检索 -> 生成。Agentic RAG 让 LLM Agent 控制检索过程,实现:

- **自适应检索**: 根据查询复杂度决定是否需要检索
- **多步检索**: 一次不够就检索多次
- **自我纠正**: 检查检索结果质量,不达标则重新检索
- **工具使用**: 检索之外调用计算器、代码执行器等工具

## 架构演进

```
传统 RAG (固定管道):
  Query -> Retrieve -> Generate -> Answer

Agentic RAG (Agent 控制):
  Query -> Agent(判断) -> [Retrieve/Generate/Tool] -> [验证] -> Answer
                ^                          |
                +--- 不满意则重新检索 -------+
```

## 关键技术

### Self-RAG
- Agent 自主判断是否需要检索
- 评估检索结果的相关性
- 评估生成答案的忠实度
- 多轮自我反思

### Corrective RAG (CRAG)
- 检索后评估文档质量
- 质量低 -> 触发 Web 搜索补充
- 质量高 -> 直接使用
- 融合多源信息

### Adaptive RAG
- 根据查询复杂度选择策略
- 简单查询: 直接生成
- 事实查询: 单步检索
- 复杂推理: 多步检索 + 推理

## 实现框架

### LangGraph Agentic RAG
```python
from langgraph.graph import StateGraph

# 定义节点
def route_query(state):
    # 判断查询类型
    if needs_retrieval(state["query"]):
        return "retrieve"
    return "generate"

def retrieve(state):
    # 执行检索
    return {"docs": retriever.invoke(state["query"])}

def grade_docs(state):
    # 评估文档质量
    if quality_ok(state["docs"]):
        return "generate"
    return "rewrite_query"

# 构建图
graph = StateGraph(...)
graph.add_node("route", route_query)
graph.add_node("retrieve", retrieve)
graph.add_node("grade", grade_docs)
```

### LlamaIndex Agentic RAG
- ReAct Agent + QueryEngine 工具
- 自动选择检索策略
- 多文档 Agent 协作

## 适用场景

| 场景 | 传统 RAG | Agentic RAG |
|------|---------|-------------|
| 简单 FAQ | 适用 | 过度 |
| 多文档推理 | 中 | 适用 |
| 开放式问题 | 差 | 适用 |
| 实时数据查询 | 需要工具 | 天然支持 |
| 复杂研究任务 | 差 | 适用 |

## 最佳实践

1. **从简单开始**: 先用传统 RAG,不够再升级
2. **设置最大迭代次数**: 防止 Agent 无限循环
3. **监控成本**: Agentic RAG 的 token 消耗更高
4. **评估驱动**: 用 Ragas/DeepEval 量化改进效果

## Agentic RAG 推理引擎推荐

Agentic RAG 涉及多次 LLM 调用，低延迟和高吞吐至关重要：

- **多轮推理 + 前缀缓存**: [[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang]]
- **通用生产环境**: [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM]]
- **极低延迟云 API**: [[10_部署推理/02_推理引擎/07_Groq_深入分析|Groq]]
- **推理引擎统一选型**: [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM 推理引擎选型指南]]
- **迁移与基准测试**: [[10_部署推理/02_推理引擎/16_LLM_推理引擎_迁移_指南|迁移指南]] / [[10_部署推理/02_推理引擎/15_LLM推理_基准测试_指南|基准测试指南]]

> **关联**: -> [[14_RAG系统/README|RAG 系统]] | [[15_智能体/README|Agent 生产]] | [[治理/rag-agents|RAG x Agent 合成]]
