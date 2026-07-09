---
title: "AI Agent 记忆技术完全指南"
category: "15-agent-production-memory-infrastructure"
tags: ["agents", "memory", "rag", "knowledge-graph", "mem0", "long-term-memory"]
summary: "Agent 记忆系统的架构与实现:短期记忆、长期记忆、工作记忆、情景记忆,含 Mem0、Zep、Graphiti 等工具。"
sources:
  - "https://github.com/mem0ai/mem0"
  - "https://www.getzep.com/"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Agent Memory Techniques"
  - Agent_Memory_Techniques

---
# AI Agent 记忆技术完全指南

> **一句话理解**: Agent 记忆系统的架构与实现:短期记忆、长期记忆、工作记忆、情景记忆,含 Mem0、Zep、Graphiti 等工具。

## 为什么 Agent 需要记忆?

无记忆的 Agent 每次对话都是从零开始。记忆让 Agent 能够:
- 记住用户偏好和历史
- 从过去的交互中学习
- 跨会话保持上下文
- 构建个性化的用户体验

## 记忆类型

| 类型 | 类比 | 存储方式 | 生命周期 |
|------|------|---------|---------|
| **工作记忆** | 人脑的短期记忆 | 上下文窗口 | 单次对话 |
| **情景记忆** | 记住发生过的事 | 向量数据库 | 长期 |
| **语义记忆** | 记住学到的知识 | 知识图谱 | 永久 |
| **程序记忆** | 记住怎么做 | 工具定义/技能 | 永久 |

## 记忆架构

```
用户输入
  |
  v
[记忆检索] -> 从长期记忆中检索相关上下文
  |
  v
[上下文组装] -> 工作记忆 + 检索结果 + 用户输入
  |
  v
[LLM 生成]
  |
  v
[记忆存储] -> 将重要信息存入长期记忆
  |
  v
输出
```

## 记忆工具对比

| 工具 | 类型 | 特点 | 适用场景 |
|------|------|------|---------|
| [Mem0](https://github.com/mem0ai/mem0) | 开源 | 用户记忆管理、自动提取 | 个性化 Agent |
| [Zep](https://www.getzep.com/) | 开源+云 | 记忆+知识图谱+事实检查 | 企业级 Agent |
| [Graphiti](https://github.com/getzep/graphiti) | 开源 | 知识图谱记忆 | 复杂关系推理 |
| [MemGPT](https://github.com/cpacker/MemGPT) | 开源 | 虚拟内存管理 | 长对话 |
| [LangChain Memory](https://python.langchain.com/docs/modules/memory/) | 框架内置 | 多种记忆类型 | LangChain 应用 |

## Mem0 详解

```python
from mem0 import Memory

m = Memory()

# 存储记忆
m.add("我喜欢用 Python 编程", user_id="alice")

# 检索记忆
results = m.search("编程语言偏好", user_id="alice")
# -> [{"text": "我喜欢用 Python 编程", "score": 0.95}]

# 记忆自动管理
# - 去重: 重复信息不会重复存储
# - 更新: 矛盾信息会更新旧记忆
# - 衰减: 不常用的记忆权重降低
```

## 知识图谱记忆

传统向量记忆只存储文本片段,知识图谱记忆存储结构化的实体和关系:

```
向量记忆: "Allen 喜欢 Python, 在小米工作"
知识图谱: Allen --[喜欢]--> Python
          Allen --[就职于]--> 小米
          小米 --[属于]--> 科技公司
```

优势:
- 精确关系查询
- 多跳推理
- 可解释性

## 最佳实践

1. **分层存储**: 工作记忆(上下文) + 长期记忆(向量/图谱)
2. **自动提取**: 不要让用户手动管理记忆
3. **隐私保护**: 敏感信息需要用户确认才存储
4. **记忆清理**: 定期清理过时和低价值记忆
5. **个性化**: 基于记忆提供个性化响应

> **关联**: -> [[Agent/README|Agent 生产]] | [[Agent/Memory_Infrastructure/README|记忆基础设施]] | [[RAG系统/README|RAG 系统]]

