---
title: 快速上手项目 (Quick Start Projects)
category: 06-learning
tags: ["projects", "hands-on", "beginner", "portfolio"]
summary: "5 个 AI 入门实战项目：RAG 问答机器人、AI 客服 Agent、图像分类器、Prompt 优化器、多模态应用，含完整技术栈和学习目标。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 快速上手项目 (Quick Start Projects)

## 1. 项目总览

```
5 个由浅入深的实战项目:

项目 1: RAG 问答机器人 (难度: ★★☆, 时间: 1-2 天)
  → 学会: 向量数据库 + 检索 + LLM 生成

项目 2: AI 客服 Agent (难度: ★★★, 时间: 3-5 天)
  → 学会: Agent 架构 + 工具调用 + 多轮对话

项目 3: 图像分类器 (难度: ★★☆, 时间: 2-3 天)
  → 学会: PyTorch + 迁移学习 + 部署

项目 4: Prompt 优化器 (难度: ★★★, 时间: 2-3 天)
  → 学会: 评估 + 自动化 + A/B 测试

项目 5: 多模态应用 (难度: ★★★★, 时间: 5-7 天)
  → 学会: 视觉 + 语言 + 端到端应用
```

## 2. 项目 1: RAG 问答机器人

```python
"""
项目 1: 基于你的文档构建一个问答机器人
技术栈: Python + LangChain + ChromaDB + OpenAI API
"""
# 核心代码 (~50 行):
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

# 1. 加载文档
docs = PyPDFLoader("your_doc.pdf").load()

# 2. 分块
chunks = RecursiveCharacterTextSplitter(
    chunk_size=500, chunk_overlap=50
).split_documents(docs)

# 3. 向量化 + 存储
vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings())

# 4. 构建 QA 链
qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o"),
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
)

# 5. 提问
answer = qa.invoke("文档的主要内容是什么?")
print(answer)

# 学习目标:
# - 理解 RAG 流程 (索引→检索→生成)
# - 掌握向量数据库基本操作
# - 学会分块策略选择
```

## 3. 项目 2: AI 客服 Agent

```python
"""
项目 2: 构建一个能查订单/退款的客服 Agent
技术栈: Python + OpenAI Function Calling + FastAPI
"""
from openai import OpenAI

client = OpenAI()

# 定义工具
tools = [
    {
        "type": "function",
        "function": {
            "name": "check_order",
            "description": "查询订单状态",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {"type": "string", "description": "订单号"}
                },
                "required": ["order_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "process_refund",
            "description": "处理退款",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": ["order_id", "reason"],
            },
        },
    },
]

# Agent 循环
def agent_loop(user_message, messages):
    messages.append({"role": "user", "content": user_message})
    
    while True:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
        )
        msg = response.choices[0].message
        
        if msg.tool_calls:
            for call in msg.tool_calls:
                result = execute_tool(call.function.name, call.function.arguments)
                messages.append({"role": "tool", "content": result, "tool_call_id": call.id})
        else:
            return msg.content  # 最终回答

# 学习目标:
# - 理解 Agent 的 思考→行动→观察 循环
# - 掌握 Function Calling
# - 学会多轮对话管理
```

## 4. 项目难度递进

| 项目 | 核心技能 | 前置知识 | 产出 |
|------|----------|----------|------|
| RAG 问答 | 检索+生成 | Python/API | 可部署的问答服务 |
| AI 客服 | Agent+工具 | RAG 基础 | 多工具 Agent |
| 图像分类 | CV+训练 | PyTorch | 模型+API |
| Prompt 优化 | 评估+自动化 | LLM 基础 | 评估框架 |
| 多模态 | 视觉+语言 | 全部前置 | 完整应用 |

## 5. 交叉引用

- [[入门/|入门]]
- [[入门/AI_Career_Guide/AI_Career_Guide|AI 职业指南]]
- [[RAG系统/|RAG 系统]]
- [[智能体/|智能体]]
- [[学习/|学习]]
