---
title: "PromptFlow: 微软提示词工作流平台"
category: "15-agent-production-agent-platforms"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: PromptFlow 是微软的提示词工程平台——可视化构建、测试、部署 LLM 应用，支持 RAG、Agent 和多模型编排。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Promptflow Deep Dive"
  - "PromptFlow Deep Dive"
  - PromptFlow_Deep_Dive

---
# PromptFlow: 微软提示词工作流平台

> **一句话理解**: PromptFlow 是微软的提示词工程平台——可视化构建、测试、部署 LLM 应用，支持 RAG、Agent 和多模型编排。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [节点详解](#5-节点详解)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
PromptFlow: 微软提示词工程平台
═══════════════════════════════════════════════════════════════════

定位: 微软 Azure ML 提供的提示词编排和评估平台

核心理念:
───────────────────────────────────────────────────────────────────
• 可视化编排: 图形化构建 LLM 工作流
• 内置工具: RAG、Agent、评估节点
• 企业级: Azure 集成，SSO，RBAC
• 评估框架: 内置提示词评估和 A/B 测试
• 部署: 一键部署为 API 或 Azure Functions
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **可视化画布** | 拖拽式流程构建 |
| **丰富节点** | LLM、RAG、Prompt、Tool |
| **评估工具** | 内置提示词评估 |
| **版本控制** | Git 集成 |
| **Azure 集成** | Azure ML 无缝集成 |
| **生产部署** | API 部署和监控 |

### 1.3 与其他平台对比

| 维度 | PromptFlow | LangFlow | Dify |
|------|------------|----------|------|
| **开发商** | Microsoft | LangChain | 个人/社区 |
| **部署** | Azure | 自托管 | 自托管 |
| **企业特性** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **评估功能** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## 2. 核心概念

### 2.1 核心对象

```
PromptFlow 核心对象
═══════════════════════════════════════════════════════════════════

Flow (流程)
├── Nodes (节点)
│   ├── LLM (大语言模型)
│   ├── Prompt (提示词模板)
│   ├── Python (Python 工具)
│   ├── Vector Index (向量索引)
│   ├── Embedding (嵌入)
│   └── Custom (自定义工具)
├── Connections (连接)
└── Inputs/Outputs (输入/输出)

Variants (变体)
├── 同一节点的多个版本
└── 用于 A/B 测试

Evaluation (评估)
├── 自动指标
├── 人工评估
└── 性能追踪
```

### 2.2 节点类型

| 节点 | 说明 | 用途 |
|------|------|------|
| **LLM** | 语言模型调用 | GPT-4、Claude、本地模型 |
| **Prompt** | 提示词模板 | 结构化提示 |
| **Python** | Python 代码 | 数据处理、工具 |
| **Vector Index** | 向量索引 | RAG 检索 |
| **Embedding** | 嵌入模型 | 文本向量化 |
| **出境** | HTTP 请求 | 外部 API |
| **灵** | 条件路由 | 逻辑分支 |

---

## 3. 架构设计

### 3.1 Flow 架构

```
PromptFlow Flow 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        PromptFlow Flow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   输入节点                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  text_input, chat_input, files                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    处理节点                              │   │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │   │
│   │  │ Embed  │→│  Index  │→│   LLM   │→│ Output  │     │   │
│   │  │  ding  │  │  Search │  │         │  │         │     │   │
│   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    输出节点                              │   │
│   │  response, evaluation_result                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 评估架构

```
PromptFlow 评估流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        评估流程                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Flow + Test Data                                                 │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Batch Run                                                     │ │
│  │ 执行 Flow 并收集输出                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Metrics Calculation                                          │ │
│  │ ├── Accuracy                                                 │ │
│  │ ├── Groundedness (基于上下文)                               │ │
│  │ └── Latency                                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Variant Comparison (变体对比)                                │ │
│  │ └── 选择最优变体                                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 安装 PromptFlow CLI
pip install promptflow

# 安装 Azure ML 扩展
pip install promptflow-azure

# 启动 UI
pf start
# 访问 http://localhost:8080
```

### 4.2 创建 Flow

```bash
# 创建新 Flow
pf flow init --flow-name my_flow

# 目录结构
my_flow/
├── flow.dag.yaml      # Flow 定义
├── .env                # 环境变量
└── users/             # 工具函数
```

### 4.3 Flow 定义示例

```yaml
# flow.dag.yaml
inputs:
  question:
    type: string
    default: "什么是量子计算?"

nodes:
  - name: embed_question
    type: Embedding
    provider: AzureOpenAI
    connection: azure_openai_connection
    settings:
      model: text-embedding-3-small

  - name: search_index
    type: VectorIndexSearch
    input: embed_question
    connection: azure_ai_search_connection
    settings:
      index: knowledge_base

  - name: generate_answer
    type: LLM
    input: search_index
    connection: azure_openai_connection
    settings:
      model: gpt-4o
      prompt: |
        基于以下上下文回答问题。

        上下文: {{context}}

        问题: {{question}}

        回答:

outputs:
  answer:
    type: string
    source: generate_answer
```

### 4.4 执行 Flow

```bash
# 单一执行
pf flow test --flow my_flow --input question="什么是量子计算?"

# 批量测试
pf flow batch --flow my_flow --input test_data.jsonl

# 评估
pf flow evaluate --flow my_flow --data eval_data.jsonl
```

---

## 5. 节点详解

### 5.1 LLM 节点

```yaml
# LLM 节点配置
- name: chat_llm
  type: LLM
  provider: AzureOpenAI
  connection: my_connection
  settings:
    model: gpt-4o
    temperature: 0.7
    max_tokens: 1000
    prompt: |
      你是一个有帮助的助手。
      用户: {{user_input}}
      助手:
```

### 5.2 Python 节点

```python
# users/my_tool.py
from promptflow import tool

@tool
def process_text(text: str) -> str:
    """自定义文本处理工具"""
    # 清理文本
    text = text.strip()
    text = text.replace("\n\n", "\n")

    # 统计
    word_count = len(text.split())

    return f"{text}\n\n[字数: {word_count}]"
```

### 5.3 条件路由

```yaml
# 条件节点
- name: route_intent
  type: Router
  input: user_query
  conditions:
    - if: contains($$input, "代码")
      then: code_flow
    - if: contains($$input, "解释")
      then: explanation_flow
    - else: general_flow
```

---

## 6. 对比与选择

### 6.1 适用场景

**✅ PromptFlow 最佳场景:**
- 企业级 LLM 应用
- Azure 生态系统
- 需要评估和监控
- A/B 测试提示词

**❌ 不适合场景:**
- 小团队或个人
- 预算有限
- 完全开源需求

---

## 参考资源

- [PromptFlow GitHub](https://github.com/microsoft/promptflow)
- [PromptFlow 文档](https://microsoft.github.io/promptflow/)
- [Azure ML Prompt Flow](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*