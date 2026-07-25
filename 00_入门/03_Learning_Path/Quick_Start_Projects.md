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

- [[00_入门/|入门]]
- [[00_入门/03_Learning_Path/AI_Career_Guide|AI 职业指南]]
- [[14_RAG系统/|RAG 系统]]
- [[15_智能体/|智能体]]
- [[90_学习/|学习]]

## 6. 项目技术栈对照

| 项目 | 核心技术 | 框架/工具 | 部署方式 |
|------|----------|------------|----------|
| 聊天机器人 | LLM API | OpenAI SDK | Vercel/本地 |
| RAG 问答 | 向量检索+LLM | LangChain, ChromaDB | Docker |
| AI 客服 | Agent+工具 | CrewAI, RAG | 云服务 |
| 图像分类 | CNN/训练 | PyTorch, torchvision | API 服务 |
| Prompt 优化 | 评估+自动化 | DSPy, Ragas | 本地脚本 |
| 多模态应用 | 视觉+语言 | GPT-4o, Gemini | 全栈部署 |

## 7. 项目难度与时间估算

| 项目 | 难度 | 预计时间 | 前置知识 |
|------|------|----------|----------|
| 聊天机器人 | ★☆☆ | 1-2天 | Python 基础 |
| RAG 问答 | ★★☆ | 3-5天 | LLM API、向量概念 |
| AI 客服 | ★★★ | 1-2周 | RAG、Agent 架构 |
| 图像分类 | ★★☆ | 3-5天 | PyTorch、CNN |
| Prompt 优化 | ★★☆ | 2-3天 | LLM 基础、评估 |
| 多模态应用 | ★★★ | 1-2周 | 全部前置 |

## 8. 常见问题

| 问题 | 解答 |
|------|------|
| 没有 GPU 能做项目吗？ | 可以，使用 API 调用或 Colab 免费 GPU |
| 项目应该做多复杂？ | 先跑通 MVP，再迭代增强 |
| 如何展示项目？ | GitHub + README + 在线 Demo |
| 项目经验如何写进简历？ | 强调技术方案、挑战、结果 |

> 💡 做项目的核心目标是「理解原理 + 积累实践」，不必追求完美，先跑通再优化。

## 9. 项目统计

| 指标 | 数值 |
|------|------|
| 推荐项目数 | 6 个 |
| 平均完成时间 | 1-2 周/个 |
| 核心技术栈 | Python + LLM API |
| 难度范围 | ★☆☆ ~ ★★★ |

---
*Last updated: 2026-07-21*
