---
title: "Flowise 可视化 LLM 编排 (Flowise Visual LLM Orchestration)"
category: -concepts
tags: ["flowise", "llm-orchestration", "visual-programming", "nodejs", "low-code", "langchain"]
relationships:
  - target: "_concepts/langflow"
    type: related_to
  - target: "_concepts/dify"
    type: related_to
  - target: "_concepts/ragflow"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Flowise 是基于 LangChain.js 的可视化 LLM 应用构建工具——拖拽式界面 + Node.js 后端，零代码/低代码搭建 AI 工作流。开源、可自托管，是快速构建 LLM 应用原型的利器。"
provenance:
  extracted: 0.15
  inferred: 0.75
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
---

# Flowise 可视化 LLM 编排

> **一句话理解**: Flowise 是"拖拽搭积木建 AI 应用"——可视化界面拖拽 LangChain 组件，零代码构建 LLM 工作流，Node.js 驱动。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **技术栈** | LangChain.js + Node.js + React |
| **开源协议** | Apache 2.0 |
| **GitHub** | 32K+ ⭐ |
| **核心能力** | 拖拽式 LLM 工作流构建 |
| **部署** | npm 一键安装 / Docker / 云服务 |
| **定位** | LangChain 的可视化前端 |

### 与 LangFlow 对比

| 特性 | Flowise | LangFlow |
|------|---------|----------|
| **后端语言** | Node.js (LangChain.js) | Python (LangChain) |
| **生态** | npm 生态 | PyPI 生态 |
| **LLM 支持** | LangChain.js 支持范围 | LangChain Python 全量 |
| **部署难度** | 简单（npm start） | 中等（Python 环境） |
| **自定义组件** | JS/TS 编写 | Python 编写 |
| **API 集成** | 内置 REST API | 内置 API |
| **适合场景** | Web 开发者、前端团队 | Python ML 团队 |

---

## 2. 核心架构

```
┌─────────────────────────────────────────┐
│          Flowise 系统架构               │
├─────────────────────────────────────────┤
│                                         │
│  前端 (React)                           │
│    ├── 拖拽画布 (React Flow)            │
│    ├── 节点配置面板                     │
│    ├── 聊天测试窗口                     │
│    └── API 密钥管理                     │
│                                         │
│  后端 (Node.js + Express)               │
│    ├── 工作流引擎                       │
│    ├── LangChain.js 运行时             │
│    ├── 数据库 (SQLite/PostgreSQL)       │
│    ├── 向量存储集成                     │
│    └── REST API 层                      │
│                                         │
│  集成层                                 │
│    ├── LLM: OpenAI, Anthropic, Ollama   │
│    ├── 向量库: Pinecone, Chroma, Qdrant │
│    ├── 文档: PDF, CSV, Web Scraper      │
│    └── 外部: Webhook, API, Slack        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 核心概念

### 3.1 节点（Nodes）

| 节点类别 | 代表节点 | 功能 |
|---------|---------|------|
| **Chat Models** | OpenAI, Anthropic, Ollama | LLM 模型调用 |
| **Memory** | Buffer Memory, Window Memory | 对话记忆 |
| **Retrievers** | Vector Store Retriever | 文档检索 |
| **Chains** | LLM Chain, Retrieval QA Chain | 链式调用 |
| **Agents** | Tool Agent, OpenAI Functions Agent | 智能代理 |
| **Document Loaders** | PDF Loader, Web Scraper | 文档加载 |
| **Text Splitters** | Recursive Splitter | 文档切分 |
| **Embeddings** | OpenAI Embeddings | 文本向量化 |

### 3.2 工作流（Chatflow / Agentflow）

| 类型 | 说明 |
|------|------|
| **Chatflow** | 基于 Chain 的静态工作流，确定性执行 |
| **Agentflow** | 基于 Agent 的动态工作流，LLM 自主决策调用工具 |

---

## 4. 典型使用场景

### 4.1 RAG 聊天机器人

```
PDF Loader → Text Splitter → Embeddings → Pinecone
                                              ↓
User Query → Embeddings → Retriever → QA Chain → Response
```

### 4.2 多轮对话 Agent

```
User → Agent (OpenAI Functions)
         ├── Tool: Web Search
         ├── Tool: Calculator
         ├── Tool: Database Query
         └── Memory: Buffer Memory
```

### 4.3 API 集成

```bash
# Flowise 自动为每个工作流生成 REST API
curl http://localhost:3000/api/v1/prediction/{chatflowId} \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "什么是 RAG？"}'
```

---

## 5. AI Stack 中的定位

```
┌─────────────────────────────────────────┐
│     可视化 LLM 编排工具对比             │
├─────────────────────────────────────────┤
│                                         │
│  Flowise   ← Node.js / 前端友好        │
│  LangFlow  ← Python / ML 工程师友好    │
│  Dify      ← 企业级 / 全功能平台       │
│  Coze      ← 字节 / 商业平台           │
│  n8n       ← 通用工作流 + LLM 扩展     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. 部署方式

```bash
# npm 安装（最简单）
npm install -g flowise
npx flowise start

# Docker
docker run -d -p 3000:3000 flowiseai/flowise

# Docker Compose（带持久化）
docker compose up -d

# 环境变量
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=secret
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
```

---

## 7. 关键要点

1. **LangChain 可视化**：本质是 LangChain.js 的拖拽前端，底层能力等同 LangChain
2. **Node.js 生态**：适合前端/全栈开发者，与 JS 后端无缝集成
3. **API 即服务**：每个工作流自动暴露 REST API，可直接嵌入任何应用
4. **可自托管**：开源 Apache 2.0，数据不出企业
5. **低代码不低能**：支持自定义 JS 节点，复杂逻辑也能实现
6. **快速原型**：5 分钟搭建 RAG 原型，验证可行性后再工程化
