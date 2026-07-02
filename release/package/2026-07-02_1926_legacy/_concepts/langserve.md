---
title: "LangServe (LangChain 一键部署服务)"
category: -concepts
tags: ["langchain", "deployment", "api-server", "serverless", "langchain-ecosystem"]
relationships:
  - target: "_concepts/langsmith"
    type: related_to
  - target: "_concepts/chainlit"
    type: related_to
  - target: "_concepts/litellm"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "LangChain 官方的一键部署工具，将 LangChain/LangGraph 应用自动转化为生产级 REST API，支持流式输出、批处理和 Playground UI。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: stable
tier: supporting
---

# LangServe

[LangServe](https://github.com/langchain-ai/langserve) 是 LangChain 官方推出的**一键部署工具**，能将任何 LangChain/LangGraph 应用（Chain、Agent、Runnable）自动转化为**生产级 REST API**。它基于 FastAPI 构建，原生支持流式输出、批处理、配置化 Playground UI，是 LangChain 生态中从"开发原型"到"生产服务"的**标准路径**。

## 核心架构

```
LangServe 架构:

LangChain Runnable (Chain/Agent/Graph)
        │
        ▼
┌─────────────────────────┐
│       LangServe          │
│  ┌───────────────────┐  │
│  │ FastAPI Router     │  │
│  ├───────────────────┤  │
│  │ /invoke    (同步)  │  │
│  │ /batch     (批量)  │  │
│  │ /stream    (流式)  │  │
│  │ /stream_log(日志流) │  │
│  │ /playground (UI)   │  │
│  └───────────────────┘  │
└─────────────────────────┘
        │
        ▼
   HTTP / SSE / WebSocket
```

## 核心特性

### 1. 一键部署 Chain

```python
from fastapi import FastAPI
from langserve import add_routes
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 定义 Chain
chain = (
    ChatPromptTemplate.from_template("Tell me a joke about {topic}")
    | ChatOpenAI(model="gpt-4")
)

# FastAPI 应用
app = FastAPI(title="Joke API")

# 一键添加路由
add_routes(
    app,
    chain,
    path="/joke",
    playground_type="default"  # 启用 Playground UI
)

# 启动
# uvicorn app:app --host 0.0.0.0 --port 8000
```

### 2. 自动 API 端点

```
部署后自动生成:

POST /joke/invoke      — 同步调用
POST /joke/batch       — 批量调用
POST /joke/stream      — SSE 流式输出
POST /joke/stream_log  — 带日志的流式输出
GET  /joke/playground  — 交互式 Playground UI
GET  /joke/input_schema   — 输入 Schema
GET  /joke/output_schema  — 输出 Schema
```

### 3. 流式输出

```python
import httpx

# 客户端消费流式输出
async with httpx.AsyncClient() as client:
    async with client.stream(
        "POST",
        "http://localhost:8000/joke/stream",
        json={"input": {"topic": "programming"}},
        headers={"Content-Type": "application/json"}
    ) as response:
        async for chunk in response.aiter_lines():
            print(chunk)
```

### 4. LangGraph 部署

```python
from langgraph.graph import StateGraph, END
from langserve import add_routes

# 定义 LangGraph
graph = StateGraph(AgentState)
graph.add_node("researcher", research_node)
graph.add_node("writer", writer_node)
graph.add_edge("researcher", "writer")
graph.add_edge("writer", END)
graph.set_entry_point("researcher")

app = graph.compile()

# 部署
add_routes(app, path="/agent", input_keys=["input"])
```

### 5. 配置化调用

```python
# 支持配置（如模型选择、温度）
add_routes(
    app,
    chain.configurable_alternatives(
        ConfigurableField(id="model"),
        default_key="gpt-4",
        gpt35=ChatOpenAI(model="gpt-3.5-turbo")
    ),
    path="/chat"
)

# 调用时指定配置
# POST /chat/invoke
# {"input": {...}, "config": {"configurable": {"model": "gpt35"}}}
```

### 6. 客户端 SDK

```python
from langserve import RemoteRunnable

# Python 客户端
remote_chain = RemoteRunnable("http://localhost:8000/joke")

# 同步调用
result = remote_chain.invoke({"topic": "AI"})

# 流式调用
for chunk in remote_chain.stream({"topic": "AI"}):
    print(chunk)

# 批量调用
results = remote_chain.batch([
    {"topic": "AI"},
    {"topic": "cloud"}
])
```

## 与 FastAPI 集成

```python
from fastapi import FastAPI
from langserve import add_routes
from langchain_openai import ChatOpenAI

app = FastAPI()

# 多个 Chain 并存部署
add_routes(app, joke_chain, path="/joke")
add_routes(app, qa_chain, path="/qa")
add_routes(app, code_chain, path="/code")

# 自定义中间件（认证、限流）
@app.middleware("http")
async def auth_middleware(request, call_next):
    token = request.headers.get("Authorization")
    if not validate_token(token):
        return Response(status_code=401)
    return await call_next(request)
```

## 典型应用场景

- **RAG API 服务**: 将 RAG Chain 部署为 REST API
- **Agent 服务**: 部署 LangGraph Agent 为可调用服务
- **内部工具**: 企业内部 AI 工具的统一 API 层
- **微服务**: 多个 Chain 作为独立微服务部署
- **Playground**: 非技术人员可通过 UI 测试 Chain

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langserve-app
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: langserve
        image: langserve-app:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
        livenessProbe:
          httpGet:
            path: /ok
            port: 8000
        readinessProbe:
          httpGet:
            path: /ok
            port: 8000
```

## 安装

```bash
pip install "langserve[all]"
```

## 参考资源

- [LangServe GitHub](https://github.com/langchain-ai/langserve)
- [LangServe 文档](https://python.langchain.com/docs/langserve)
- [LangChain 文档](https://python.langchain.com/)

## 相关概念

- [[_concepts/langsmith]] — LangSmith LLM 可观测性
- [[_concepts/chainlit]] — Chainlit 生产级 AI 聊天 UI
- [[_concepts/litellm]] — LiteLLM 统一 LLM API 代理
- [[_concepts/flowise]] — Flowise Node.js LLM 编排
