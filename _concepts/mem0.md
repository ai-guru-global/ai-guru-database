---
title: "Mem0 (AI 记忆层基础设施)"
category: -concepts
tags: ["memory", "llm", "agent", "knowledge-graph", "long-term", "personalization"]
relationships:
  - target: "_concepts/zep"
    type: related_to
  - target: "_concepts/chroma"
    type: related_to
  - target: "_concepts/langsmith"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "开源的 AI 记忆层基础设施，为 LLM 应用提供自动化的长期记忆管理，支持用户/会话/Agent 三个维度的记忆持久化和个性化检索。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
---

# Mem0

[Mem0](https://github.com/mem0ai/mem0)（前身为 Embedchain）是一个开源的 **AI 记忆层基础设施**，专为 LLM 应用和 AI Agent 提供自动化的长期记忆管理。与 Zep 类似但更**轻量灵活**，Mem0 支持用户（User）、会话（Session）和 Agent 三个维度的记忆，通过自动提取、更新和检索记忆来让 AI 应用具备跨会话的个性化能力。

## 核心架构

```
Mem0 记忆架构:

LLM 应用 / Agent
        │
        ▼
┌─────────────────────────────┐
│        Mem0 Memory Layer     │
│  ┌───────────────────────┐  │
│  │  Memory Extractor      │  │  自动从对话中提取记忆
│  │  (LLM-driven)          │  │
│  ├───────────────────────┤  │
│  │  Memory Store          │  │  向量 + 图数据库
│  │  (Qdrant/Neo4j)        │  │
│  ├───────────────────────┤  │
│  │  Memory Retriever      │  │  语义检索 + 图检索
│  ├───────────────────────┤  │
│  │  Memory Manager        │  │  更新/冲突解决/衰减
│  └───────────────────────┘  │
└─────────────────────────────┘
```

## 核心特性

### 1. 三维记忆模型

```python
from mem0 import Memory

m = Memory()

# User 维度记忆 (跨会话持久)
m.add("I am a software engineer at Google", user_id="alice")
m.add("I prefer Python and Rust", user_id="alice")

# Session 维度记忆 (会话内)
m.add("We discussed project architecture", session_id="session-123")

# Agent 维度记忆 (Agent 学习)
m.add("User prefers concise responses", agent_id="assistant-1")

# 检索相关记忆
results = m.search("What programming language does Alice use?", user_id="alice")
# → ["Alice prefers Python and Rust"]
```

### 2. 自动记忆管理

```python
# Mem0 自动处理:
# 1. 提取: 从对话中自动提取关键事实
# 2. 更新: 新信息与旧记忆冲突时自动更新
#    "I moved to Seattle" → 更新 "Location: Seattle" (覆盖旧值)
# 3. 去重: 检测并合并重复记忆
# 4. 衰减: 随时间降低不常引用记忆的权重

# 获取用户所有记忆
all_memories = m.get_all(user_id="alice")
# → ["Software engineer at Google", "Prefers Python and Rust", "Lives in Seattle"]
```

### 3. 与 LangChain/LlamaIndex 集成

```python
from mem0 import Memory
from langchain_openai import ChatOpenAI

memory = Memory()
llm = ChatOpenAI(model="gpt-4")

# 对话中自动使用记忆
def chat(user_input: str, user_id: str):
    # 检索相关记忆
    relevant = memory.search(user_input, user_id=user_id)
    
    # 构建带记忆的 Prompt
    context = "\n".join([m["memory"] for m in relevant])
    prompt = f"Context: {context}\nUser: {user_input}\nAssistant:"
    
    response = llm.invoke(prompt)
    
    # 保存新记忆
    memory.add(f"User: {user_input}\nAssistant: {response}", user_id=user_id)
    
    return response
```

### 4. 多后端支持

| 后端 | 向量存储 | 图存储 | 适用场景 |
|------|----------|--------|----------|
| **Qdrant** | ✅ | ❌ | 默认 |
| **Chroma** | ✅ | ❌ | 轻量 |
| **pgvector** | ✅ | ❌ | PostgreSQL |
| **Neo4j** | ❌ | ✅ | 图记忆 |
| **混合** | ✅ | ✅ | 生产环境 |

## 与 Zep 对比

| 维度 | Mem0 | Zep |
|------|------|-----|
| **定位** | 轻量记忆层 | 全功能记忆平台 |
| **知识图谱** | 可选 (Neo4j) | 核心 (内置) |
| **事实提取** | ✅ | ✅ |
| **记忆维度** | User/Session/Agent | User/Session |
| **部署复杂度** | 低 | 高 |
| **嵌入方式** | SDK 嵌入 | 独立服务 |
| **开源许可** | Apache 2.0 | Elastic |
| **成熟度** | 较新 | 较成熟 |

## 典型应用场景

- **个人助手**: 记住用户偏好和历史信息
- **客服系统**: 跨会话记住客户问题上下文
- **教育 AI**: 跟踪学生学习进度
- **游戏 NPC**: Agent 记忆驱动的行为
- **企业内部工具**: 组织知识和项目上下文记忆

## 安装

```bash
pip install mem0ai

# 或 Mem0 Platform (托管)
pip install mem0ai
```

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mem0-service
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: mem0
        image: mem0ai/mem0:latest
        ports:
        - containerPort: 8000
        env:
        - name: QDRANT_URL
          value: "http://qdrant-svc:6333"
        - name: NEO4J_URI
          value: "bolt://neo4j-svc:7687"
```

## 参考资源

- [Mem0 GitHub](https://github.com/mem0ai/mem0)
- [Mem0 文档](https://docs.mem0.ai/)
- [Mem0 Platform](https://app.mem0.ai/)

## 相关概念

- [[_concepts/zep]] — Zep LLM 长期记忆平台
- [[_concepts/chroma]] — Chroma 向量数据库
- [[_concepts/milvus]] — Milvus 向量数据库
- [[_concepts/langsmith]] — LangSmith LLM 可观测性
