---
title: "LangFlow: 可视化 Agent/RAG 开发平台"
category: "11-rag-systems"
tags: ["rag", "retrieval", "vector-database", "embedding", "ai-agents"]
summary: "> **一句话理解**: LangFlow 是 LangChain 的可视化 IDE——拖拽节点构建 Pipeline，所见即所得，让复杂的 Agent 和 RAG 开发变得直观简单。"
created: "2026-05-31"
updated: "2026-05-31"
---

# LangFlow: 可视化 Agent/RAG 开发平台

> **一句话理解**: LangFlow 是 LangChain 的可视化 IDE——拖拽节点构建 Pipeline，所见即所得，让复杂的 Agent 和 RAG 开发变得直观简单。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [组件详解](#5-组件详解)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LangFlow: 可视化开发平台
═══════════════════════════════════════════════════════════════════

定位: LangChain 的图形化开发环境，通过拖拽组件构建 LLM 应用

核心理念:
───────────────────────────────────────────────────────────────────
• 可视化编程: 所见即所得的图形界面
• 组件化: 复用 LangChain 所有组件
• 快速原型: 几分钟构建复杂 Pipeline
• 一键导出: 生成 Python 代码部署
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **图形界面** | 拖拽式节点编辑 |
| **组件丰富** | LangChain 全部组件 |
| **实时预览** | 即时测试 Prompt |
| **代码导出** | 一键生成 Python |
| **多模型支持** | OpenAI/Claude/本地 |
| **自定义组件** | 注册 Python 函数 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| LangFlow 0.1 | 2023.5 | 首个可视化版本 |
| v0.2 | 2023.9 | 数据结构可视化 |
| v1.0 | 2024.3 | 生产就绪，代码导出 |
| v1.1 | 2024.9 | 多 Agent 支持 |
| v1.2 | 2025.1 | 自定义组件市场 |

---

## 2. 核心概念

### 2.1 界面布局

```
LangFlow 主界面
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  LangFlow                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐                                                  │
│  │ Sidebar   │  ┌────────────────────────────────────────────┐ │
│  │           │  │                                            │ │
│  │ Components│  │           Canvas (画布)                     │ │
│  │           │  │                                            │ │
│  │ ┌───────┐ │  │    ┌─────────┐      ┌─────────┐           │ │
│  │ │Prompt │ │  │    │  LLM    │──────│ Output  │           │ │
│  │ └───────┘ │  │    └─────────┘      └─────────┘           │ │
│  │ ┌───────┐ │  │         │                                  │ │
│  │ │Vector │ │  │    ┌─────────┐                           │ │
│  │ └───────┘ │  │    │Retriev- │                           │ │
│  │ ┌───────┐ │  │    │er       │                           │ │
│  │ │ Agent │ │  │    └────┬────┘                           │ │
│  │ └───────┘ │  │         │                                │ │
│  │ ┌───────┐ │  │    ┌────┴────┐                           │ │
│  │ │  Tool │ │  │    │ Vector  │                           │ │
│  │ └───────┘ │  │    │ Store   │                           │ │
│  │ ┌───────┐ │  │    └─────────┘                           │ │
│  │ │ Memory│ │  │                                          │ │
│  │ └───────┘ │  └────────────────────────────────────────────┘ │
│  └────────────┘                                                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Console / Output                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

| 组件类型 | 组件 | 说明 |
|----------|------|------|
| **LLM** | OpenAI, Anthropic, HuggingFace | 模型接口 |
| **Prompt** | PromptTemplate, ChatPromptTemplate | 提示词模板 |
| **Retrieval** | VectorStoreRetriever, BM25Retriever | 检索器 |
| **Memory** | ConversationBufferMemory, VectorStoreMemory | 记忆 |
| **Agent** | Agent, Tool | Agent 和工具 |
| **Output** | Response, ChatOutput | 输出处理 |

### 2.3 节点类型

```
节点类型层级
═══════════════════════════════════════════════════════════════════

Layer 1: 输入节点
├── Chat Input
├── File Input
└── API Input

Layer 2: 处理节点
├── LLM (语言模型)
├── Prompt (提示词)
├── Agent (智能体)
└── Chain (链)

Layer 3: 检索节点
├── Vector Store (向量存储)
├── Retriever (检索器)
└── Embedder (嵌入模型)

Layer 4: 记忆节点
├── Memory (记忆)
├── Buffer (缓冲区)
└── Summary (摘要)

Layer 5: 输出节点
├── Chat Output
├── File Output
└── API Output
```

---

## 3. 架构设计

### 3.1 工作流程

```
LangFlow 执行流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                    构建阶段 (Build Time)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  用户拖拽组件 → 连接边 → 配置参数 → 保存 Flow                    │
│                                                                   │
│  Flow 保存格式 (JSON):                                            │
│  {                                                               │
│    "nodes": [                                                    │
│      {"id": "n1", "type": "OpenAI", "data": {...}},             │
│      {"id": "n2", "type": "Prompt", "data": {...}},             │
│    ],                                                            │
│    "edges": [                                                    │
│      {"source": "n1", "target": "n2"}                           │
│    ]                                                             │
│  }                                                               │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    执行阶段 (Runtime)                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 解析 Flow JSON                                               │
│  2. 构建 LangChain Chain/DAG                                     │
│  3. 执行节点拓扑排序                                             │
│  4. 运行时数据流                                                  │
│  5. 输出结果                                                      │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 代码生成

```
LangFlow 代码导出
═══════════════════════════════════════════════════════════════════

图形界面:
┌──────────────────────────────────────────────────────────────────┐
│  [OpenAI] ──→ [PromptTemplate] ──→ [LLaMA Index] ──→ [Output]   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
生成的 Python 代码:
───────────────────────────────────────────────────────────────────

from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from llama_index.core import VectorStoreIndex

# 构建 Chain
llm = OpenAI(temperature=0.7)
prompt = PromptTemplate.from_template("{query}")

chain = prompt | llm

# 执行
result = chain.invoke({"query": "解释量子计算"})
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 安装
pip install langflow

# 启动 (默认 http://localhost:7860)
langflow

# 或使用 Docker
docker run -p 7860:7860 langflowai/langflow
```

### 4.2 基本操作

```
操作流程
═══════════════════════════════════════════════════════════════════

1. 打开浏览器 http://localhost:7860

2. 从侧边栏拖拽组件到画布
   - 拖拽 "OpenAI" 作为 LLM
   - 拖拽 "PromptTemplate" 作为提示词

3. 连接组件
   - 从 OpenAI 的输出连接到 PromptTemplate 的输入
   - 从 PromptTemplate 连接到 ChatOutput

4. 配置参数
   - 点击节点，配置 API key、模型等

5. 测试运行
   - 在 Chat Input 输入测试问题
   - 点击运行查看结果

6. 导出代码
   - 点击右上角 "Export" 按钮
   - 选择生成 Python 代码
```

### 4.3 构建 RAG Pipeline

```
RAG Flow 示例
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        RAG Pipeline                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [File] ──→ [RecursiveCharacterTextSplitter] ──→ [OpenAIEmbeddings]│
│                                                                  │
│         ───────────────────────────────────────────→ [Chroma]    │
│                                                                  │
│  [ChatInput]                                                     │
│       │                                                          │
│       ▼                                                          │
│  [OpenAIEmbeddings] ──→ [ChromaRetriever]                       │
│                                                │                  │
│                                                ▼                  │
│  [PromptTemplate] ←───────────────────────────────────────────── │
│       │                                                            │
│       ▼                                                            │
│  [OpenAI]                                                         │
│       │                                                            │
│       ▼                                                            │
│  [ChatOutput]                                                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. 组件详解

### 5.1 LLM 组件

```python
# LangFlow 支持的 LLM 组件

# OpenAI 系列
- OpenAI (GPT-3.5, GPT-4)
- AzureOpenAI
- ChatOpenAI

# Anthropic 系列
- Anthropic (Claude 3, Claude 3.5)

# 开源模型
- HuggingFace (Inference API, Local)
- Ollama (本地模型)
- Anthropic via Bedrock

# 国内模型
- Qwen (阿里)
- DeepSeek
- ZhipuAI (智谱)
```

### 5.2 检索器组件

```python
# 向量存储
- Chroma
- Pinecone
- Weaviate
- Qdrant
- Milvus

# 检索策略
- VectorStoreRetriever (向量检索)
- BM25Retriever (稀疏检索)
- ParentDocumentRetriever (父子文档)
- MultiQueryRetriever (多查询扩展)
- EnsembleRetriever (集成检索)
```

### 5.3 自定义组件

```python
# 在 LangFlow 中创建自定义组件
from langflow import CustomComponent

class MyCustomTool(CustomComponent):
    """自定义工具组件"""

    display_name = "My Custom Tool"
    description = "执行自定义逻辑的工具"

    inputs = [
        {"name": "input_text", "type": "str", "required": True}
    ]

    outputs = [
        {"name": "result", "type": "str"}
    ]

    def build(self):
        def my_func(input_text: str) -> str:
            # 自定义逻辑
            return f"Processed: {input_text}"

        return my_func

# 注册组件
langflow.register(MyCustomTool)
```

---

## 6. 对比与选择

### 6.1 与其他可视化工具对比

| 维度 | LangFlow | Dify | Coze | Flowise |
|------|----------|------|------|---------|
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **组件丰富** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **代码导出** | ✅ | ❌ | ❌ | ✅ |
| **自定义组件** | ✅ | ✅ | 有限 | ✅ |
| **多 Agent** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **学习曲线** | 中等 | 低 | 低 | 低 |

### 6.2 适用场景

**✅ LangFlow 最佳场景:**
- 需要可视化构建复杂 RAG
- 学习和实验 LangChain
- 快速原型验证想法
- 需要代码导出部署

**❌ 不适合场景:**
- 完全无代码需求 (用 Dify)
- 需要团队协作 (用 Coze)
- 简单单一功能 (用直接 API)

---

## 参考资源

- [LangFlow GitHub](https://github.com/langflow-ai/langflow)
- [LangFlow 文档](https://docs.langflow.org/)
- [LangFlow 示例](https://github.com/langflow-ai/langflow-examples)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[14_RAG_Systems/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[14_RAG_Systems/RAG_Systems.md|RAG_Systems]]
- [[14_RAG_Systems/README_Advanced.md|README_Advanced]]
- [[14_RAG_Systems/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[_synthesis/rag-vector-database.md|rag-vector-database]]
