---
title: "Zep (LLM 长期记忆平台)"
category: -concepts
tags: ["memory", "llm", "conversation-history", "knowledge-graph", "agent", "long-term"]
relationships:
  - target: "_concepts/langsmith"
    type: related_to
  - target: "_concepts/gptcache"
    type: related_to
  - target: "_concepts/chroma"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "开源的 LLM 长期记忆平台，自动从对话历史中提取事实、实体和关系构建知识图谱，让 AI 应用具备跨会话的持久记忆能力。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: stable
tier: supporting
---

# Zep

[Zep](https://github.com/getzep/zep) 是一个开源的 **LLM 长期记忆平台**，专为 AI 应用（Agent、Chatbot、RAG）提供跨会话的持久记忆能力。与传统基于向量检索的记忆方案不同，Zep 自动从对话历史中**提取事实、实体和关系**，构建**用户知识图谱**，让 AI 能够基于丰富的结构化上下文（而非简单的历史片段）来响应用户。

## 核心架构

```
Zep 记忆架构:

用户对话
    │
    ▼
┌─────────────────────────┐
│       Zep Server         │
│  ┌───────────────────┐  │
│  │ Message Store      │  │  原始消息存储
│  ├───────────────────┤  │
│  │ Fact Extractor     │  │  自动事实提取
│  │ (LLM-driven)       │  │
│  ├───────────────────┤  │
│  │ Entity Extractor   │  │  实体识别
│  ├───────────────────┤  │
│  │ Knowledge Graph    │  │  图数据库
│  │ (Neo4j)            │  │
│  ├───────────────────┤  │
│  │ Vector Index       │  │  语义搜索
│  │ (Qdrant/pgvector)  │  │
│  └───────────────────┘  │
└─────────────────────────┘
    │
    ▼
AI 应用获取丰富上下文
(事实 + 实体 + 相关历史)
```

## 核心特性

### 1. 事实提取

```python
from zep_python import ZepClient

client = ZepClient(api_url="http://localhost:8000")

# 添加对话消息
session_id = "user-123"
messages = [
    {"role": "user", "content": "I'm John, I work at Google as a ML engineer."},
    {"role": "assistant", "content": "Nice to meet you, John! ML engineering at Google sounds great."},
    {"role": "user", "content": "I prefer Python and PyTorch for my work."},
]

client.memory.add(session_id, messages=messages)

# Zep 自动提取事实:
# - John works at Google
# - John is an ML engineer
# - John prefers Python
# - John prefers PyTorch
```

### 2. 记忆检索

```python
# 检索相关记忆
memory = client.memory.get(session_id)

print(memory.summary)        # 对话摘要
print(memory.facts)          # 提取的事实列表
print(memory.relevant_facts) # 与当前查询相关的事实

# 语义搜索记忆
results = client.memory.search(
    session_id,
    text="What programming language does John use?",
    limit=5
)
# → 返回: "John prefers Python and PyTorch"
```

### 3. 知识图谱

```python
# Zep 自动构建用户知识图谱:
#
# [John] --works_at--> [Google]
# [John] --role--> [ML Engineer]
# [John] --prefers--> [Python]
# [John] --prefers--> [PyTorch]
# [John] --interested_in--> [Machine Learning]
#
# 图谱持久化，跨会话保持更新

# 图谱查询
graph = client.graph.get(session_id)
# 返回用户相关的实体和关系
```

### 4. 多用户/多会话管理

```python
# 用户维度
client.user.add(user_id="user-123", metadata={"name": "John"})

# 会话维度
client.memory.add_session(
    session_id="session-456",
    user_id="user-123",
    metadata={"type": "support"}
)

# 跨会话记忆共享
# 同一用户的不同会话共享知识图谱
```

### 5. 与 LangChain 集成

```python
from langchain.memory import ZepMemory

memory = ZepMemory(
    session_id="user-123",
    url="http://localhost:8000",
    api_key="your-api-key"
)

# LangChain Agent 自动使用 Zep 记忆
agent = create_agent(llm, tools, memory=memory)
agent.invoke("What did we discuss last time?")
# Agent 能回忆起之前会话的事实和上下文
```

## 与传统记忆方案对比

| 维度 | Zep | 向量检索记忆 | 滑动窗口 | 摘要记忆 |
|------|-----|-------------|---------|---------|
| **记忆类型** | 事实+图谱+向量 | 向量片段 | 原始消息 | 压缩摘要 |
| **跨会话** | ✅ (图谱持久) | 部分 | ❌ | 部分 |
| **事实提取** | ✅ (自动) | ❌ | ❌ | ❌ |
| **实体关系** | ✅ (图谱) | ❌ | ❌ | ❌ |
| **语义搜索** | ✅ | ✅ | ❌ | ❌ |
| **上下文质量** | 高（结构化） | 中 | 低 | 中 |
| **Token 效率** | 高 | 中 | 低 | 高 |
| **复杂度** | 高 | 中 | 低 | 低 |

## 典型应用场景

- **个人助手**: 记住用户的偏好、历史、个人信息
- **客服系统**: 跨会话记住客户问题历史
- **教育 AI**: 跟踪学生的学习进度和薄弱环节
- **医疗 AI**: 记住患者的病史和用药记录
- **企业 Agent**: 记住组织架构、项目上下文

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zep-server
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: zep
        image: ghcr.io/getzep/zep:latest
        ports:
        - containerPort: 8000
        env:
        - name: ZEP_STORE_POSTGRES_DSN
          value: "postgres://user:pass@postgres-svc:5432/zep"
        - name: ZEP_NLP_SERVER_URL
          value: "http://zep-nlp-svc:5557"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zep-nlp
spec:
  template:
    spec:
      containers:
      - name: zep-nlp
        image: ghcr.io/getzep/zep-nlp-server:latest
        resources:
          requests:
            memory: "4Gi"
```

## 安装

```bash
# Docker Compose (推荐)
docker compose up -d  # 包含 Zep + Postgres + NLP

# 或 pip (Python SDK)
pip install zep-python
```

## 参考资源

- [Zep GitHub](https://github.com/getzep/zep)
- [Zep 文档](https://help.getzep.com/)
- [Zep Cloud](https://www.getzep.com/)

## 相关概念

- [[_concepts/gptcache]] — GPTCache LLM 语义缓存引擎
- [[_concepts/chroma]] — Chroma 向量数据库
- [[_concepts/milvus]] — Milvus 向量数据库
- [[_concepts/langsmith]] — LangSmith LLM 可观测性
