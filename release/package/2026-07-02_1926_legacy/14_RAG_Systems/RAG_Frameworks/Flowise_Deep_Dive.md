---
title: "Flowise: 低代码 LLM 应用平台"
category: "14-rag-systems"
tags: ["rag", "retrieval", "vector-database", "embedding", "llm"]
summary: "> **一句话理解**: Flowise 是极简的低代码 LLM 应用平台——拖拽即可构建 AI 应用，专注于 Chatflow 可视化编排。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Flowise Deep Dive"
  - Flowise_Deep_Dive

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Flowise: 低代码 LLM 应用平台

> **一句话理解**: Flowise 是极简的低代码 LLM 应用平台——拖拽即可构建 AI 应用，专注于 Chatflow 可视化编排。

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
Flowise: 低代码 LLM 平台
═══════════════════════════════════════════════════════════════════

定位: 极简低代码的 Chatflow 编排工具，拖拽即可构建 AI 应用

核心理念:
───────────────────────────────────────────────────────────────────
• 极简体验: 拖拽式构建，所见即所得
• 快速部署: 一键发布为 API 或嵌入式
• 开源免费: 完全开源，可私有部署
• 模板市场: 预建模板快速开始
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **可视化 Chatflow** | 拖拽构建对话流程 |
| **组件丰富** | 80+ 预建组件 |
| **多模型支持** | OpenAI/Claude/本地 |
| **向量存储** | 内置多种向量库 |
| **API 导出** | 一键生成 API |
| **嵌入分享** | 网页嵌入或分享链接 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| Flowise 1.0 | 2023.6 | 首个版本 |
| v1.2 | 2023.10 | 多模型支持 |
| v1.4 | 2024.2 | API 导出 |
| v1.6 | 2024.6 | 模板市场 |
| v2.0 | 2025.1 | 多模态支持 |

---

## 2. 核心概念

### 2.1 界面布局

```
Flowise 主界面
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Flowise                                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────────────────────────────────────┐ │
│  │            │  │                                            │ │
│  │  Tools     │  │           Chatflow Canvas                  │ │
│  │  Palette   │  │                                            │ │
│  │            │  │    ┌─────────┐      ┌─────────┐           │ │
│  │ ┌────────┐ │  │    │ Chat    │──────│  LLM    │           │ │
│  │ │Prompt  │ │  │    │ Message │      │         │           │ │
│  │ └────────┘ │  │    └─────────┘      └────┬────┘           │ │
│  │ ┌────────┐ │  │         │                 │                │ │
│  │ │  LLM   │ │  │    ┌────┴────┐            │                │ │
│  │ └────────┘ │  │    │  Buffer │            │                │ │
│  │ ┌────────┐ │  │    │ Memory  │            │                │ │
│  │ │Vector  │ │  │    └─────────┘            │                │ │
│  │ └────────┘ │  │                            ▼                │ │
│  │ ┌────────┐ │  │                      ┌─────────┐           │ │
│  │ │Agent   │ │  │                      │ Response│           │ │
│  │ └────────┘ │  │                      └─────────┘           │ │
│  │ ┌────────┐ │  │                                            │ │
│  │ │Utility │ │  └────────────────────────────────────────────┘ │
│  │ └────────┘ │                                                  │
│  └────────────┘                                                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Chat Preview                                [Deploy]       │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 组件分类

| 类别 | 组件 | 说明 |
|------|------|------|
| **Chains** | LLMChain, ConversationChain, RetrievalQA | 链式处理 |
| **Chat Models** | OpenAI, Anthropic, Google, Local | 模型接口 |
| **Memory** | BufferMemory, BufferWindowMemory, Redis | 记忆存储 |
| **Vector Stores** | Chroma, Pinecone, Milvus, Qdrant | 向量存储 |
| **Embeddings** | OpenAI Embeddings, HuggingFace | 嵌入模型 |
| **Prompts** | PromptTemplate, ChatPromptTemplate | 提示词 |
| **Tools** | SerpAPI, Calculator, HTTP Request | 外部工具 |
| **Utilities** | JSON Parser, String Parser, Math | 工具函数 |

### 2.3 节点类型

```
Flowise 节点类型
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        节点类型                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  🔵 入口节点 (Source)                                            │
│  ├── Chat Message Input                                          │
│  └── API Request Input                                           │
│                                                                   │
│  🟢 处理节点 (Processing)                                         │
│  ├── LLM (ChatOpenAI, Claude, etc.)                             │
│  ├── Chain (LLMChain, RetrievalQA, etc.)                        │
│  ├── Agent (ReAct, OpenAI Functions, etc.)                      │
│  └── Prompt (PromptTemplate, etc.)                              │
│                                                                   │
│  🟡 存储节点 (Storage)                                            │
│  ├── Memory (BufferMemory, etc.)                               │
│  └── VectorStore (Chroma, etc.)                                │
│                                                                   │
│  🟠 工具节点 (Tools)                                              │
│  ├── Search (SerpAPI, Google Search)                            │
│  ├── Calculator                                                  │
│  └── HTTP Request                                                │
│                                                                   │
│  🔴 输出节点 (Output)                                              │
│  ├── Chat Response                                               │
│  └── JSON Response                                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. 架构设计

### 3.1 Chatflow 架构

```
Flowise Chatflow 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      Chatflow 架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User Input (API/Web)                                           │
│         │                                                        │
│         ▼                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  Flow Engine                             │   │
│   │  ┌──────────────────────────────────────────────────┐  │   │
│   │  │                                                  │  │   │
│   │  │    Node A → Node B → Node C → Node D            │  │   │
│   │  │                                                  │  │   │
│   │  └──────────────────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  Data Flow                              │   │
│   │  Input → Prompt → LLM → Memory → Output                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│   Response                                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 执行流程

```
Flowise 执行流程
═══════════════════════════════════════════════════════════════════

1. 部署 Chatflow
   └── Flow 保存为 JSON 配置

2. 接收请求
   └── POST /api/v1/prediction/{chatflowId}

3. 解析流程
   └── JSON → Node Graph → Topological Sort

4. 节点执行
   └── 按顺序执行每个节点
   └── 节点输出 → 下一个节点输入

5. 返回结果
   └── 最终输出 → JSON Response

6. 存储记忆 (可选)
   └── BufferMemory → Redis/PostgreSQL
```

### 3.3 API 导出

```bash
# 获取 Chatflow API
curl -X POST http://localhost:3000/api/v1/prediction/{chatflowId} \
  -H "Content-Type: application/json" \
  -d '{
    "question": "解释量子计算",
    "streaming": false
  }'
```

---

## 4. 快速开始

### 4.1 安装

```bash
# Docker 部署 (推荐)
git clone https://github.com/FlowiseAI/Flowise.git
cd Flowise/docker
cp .env.example .env
docker-compose up -d

# 访问 http://localhost:3000

# 或 npm 部署
npm install -g flowise
npx flowise start
```

### 4.2 构建简单 Chatbot

```
构建步骤
═══════════════════════════════════════════════════════════════════

1. 打开 http://localhost:3000

2. 创建 Chatflow
   └── 点击 "Add new Chatflow"

3. 拖拽组件
   └── Chat Models → OpenAI
   └── Chains → ConversationChain
   └── Memory → BufferMemory

4. 连接节点
   └── Chat Message → OpenAI → Memory → Chat Response

5. 配置组件
   └── OpenAI: 设置 API Key
   └── Memory: 设置持久化

6. 测试
   └── 在右侧预览面板测试对话

7. 部署
   └── 点击 "Deploy"
   └── 获取 API 或嵌入代码
```

### 4.3 构建 RAG 应用

```
RAG Flow 配置
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        RAG Flow                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Document Loader] ──→ [Text Splitter] ──→ [Vector Store]       │
│                                                                   │
│         ◀───────────────────────────────────────────────────      │
│         │                                                        │
│  [Chat Input]                                                    │
│         │                                                        │
│         ▼                                                        │
│  [Embedding] ──→ [Vector Store Retriever]                       │
│                        │                                         │
│                        ▼                                         │
│              [Embedding + Retrieved Docs]                        │
│                        │                                         │
│                        ▼                                         │
│                   [LLM + Prompt]                                 │
│                        │                                         │
│                        ▼                                         │
│                   [Response]                                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. 组件详解

### 5.1 LLM 组件

```javascript
// 支持的 LLM 组件

// OpenAI 系列
ChatOpenAI
GPT-3 / GPT-4 / GPT-4o

// Anthropic
ChatAnthropic
Claude 2 / Claude 3

// Google
ChatGoogleGenerativeAI
Gemini Pro

// 开源
HuggingFace
Ollama
LocalAI

// 国内
ChatOpenAI (通义千问 API)
ChatOpenAI (文心一言 API)
```

### 5.2 向量存储

```javascript
// 支持的向量存储

// 本地
Chroma
Faiss
Weaviate

// 云服务
Pinecone
Milvus
Qdrant
SingleStore

// 配置示例 (Chroma)
{
  "name": "Chroma",
  "serverUrl": "http://localhost:8000",
  "collectionName": "my_collection"
}
```

### 5.3 自定义组件

```javascript
// Flowise 自定义工具
// 使用 Tool 节点添加自定义功能

// 或者使用 Code 节点
const yourFunction = async (nodeData) => {
  const { input, param1 } = nodeData;

  // 自定义逻辑
  const result = doSomething(input, param1);

  return result;
};
```

---

## 6. 对比与选择

### 6.1 与其他平台对比

| 维度 | Flowise | Dify | LangFlow | Coze |
|------|----------|------|----------|------|
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **功能深度** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **可扩展性** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **部署** | 自托管 | 自托管 | 自托管 | 云/自托管 |
| **价格** | 免费 | 免费 | 免费 | 免费/付费 |

### 6.2 适用场景

**✅ Flowise 最佳场景:**
- 快速构建简单 Chatbot
- 非技术用户
- 需要快速原型
- 小规模部署

**❌ 不适合场景:**
- 复杂工作流 (用 LangFlow)
- 企业级功能 (用 Dify)
- 高度定制需求

---

## 参考资源

- [Flowise GitHub](https://github.com/FlowiseAI/Flowise)
- [Flowise 文档](https://docs.flowiseai.com/)
- [Flowise 市场](https://flowiseai.com/marketplace)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[RAG系统/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[RAG系统/RAG_Systems.md|RAG_Systems]]
- [[RAG系统/README_Advanced.md|README_Advanced]]
- [[RAG系统/RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[_synthesis/rag-vector-database.md|rag-vector-database]]
