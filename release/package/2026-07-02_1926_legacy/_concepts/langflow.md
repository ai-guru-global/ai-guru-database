---
title: "LangFlow 可视化 LLM 编排 (LangFlow Visual LLM Orchestration)"
category: -concepts
tags: ["langflow", "visual-programming", "llm-chain", "rag", "low-code"]
relationships:
  - target: "_concepts/rag-systems"
    type: related_to
  - target: "_concepts/agentic-rag"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "LangFlow 是 DataStax 开源的可视化 LLM 应用编排工具，通过拖拽方式构建 RAG/Agent/Chain 流程。AI Stack 知识库生态中可作为低代码 RAG 应用构建工具。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: supporting
---

# LangFlow 可视化 LLM 编排

> **一句话理解**: LangFlow 是"拖拽式 LLM 应用构建器"——无需写代码，通过可视化流程图编排 RAG/Agent/Chain，快速搭建 AI 应用。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **项目** | LangFlow |
| **来源** | DataStax 开源 |
| **功能** | 可视化 LLM 应用编排 |
| **底层** | 基于 LangChain |
| **开源** | MIT License |
| **GitHub** | github.com/langflow-ai/langflow |

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **拖拽编排** | 可视化连接 LLM/Embedding/Vector DB/Agent |
| **即时预览** | 每个节点可独立测试 |
| **RAG 构建** | 拖拽连接文档→切分→嵌入→检索→生成 |
| **Agent 构建** | 可视化定义工具调用链 |
| **API 导出** | 一键生成 REST API |
| **Python 兼容** | 可导出为 Python 代码 |

---

## 3. 与同类低代码/编排工具对比

| 维度 | LangFlow | Flowise | Dify | n8n |
|------|---------|---------|------|-----|
| **来源** | DataStax | 社区 | Dify | n8n |
| **底层框架** | LangChain | LangChain | 自研 | 自研 |
| **可视化** | 流程图 | 流程图 | 工作流 | 工作流 |
| **RAG** | ✅ | ✅ | ✅ 原生 | 需插件 |
| **Agent** | ✅ | ✅ | ✅ | ✅ |
| **私有部署** | ✅ | ✅ | ✅ | ✅ |
| **API 导出** | ✅ | ✅ | ✅ | ✅ |
| **Python 导出** | ✅ | ❌ | ❌ | ❌ |

---

## 4. 在 AI Stack 生态中的位置

```
AI Stack LLM 应用构建选项
│
├── 低代码/可视化
│   ├── AI Stack 知识库（内置 RAG）
│   ├── 百炼专属版 MINI/Lite
│   ├── LangFlow ← 本文
│   ├── Flowise
│   └── Dify
│
├── 代码级框架
│   ├── LangChain / LlamaIndex
│   ├── Haystack
│   └── RAGFlow
│
└── 推理层
    └── vLLM / SGLang / Ollama
```

---

## Related

- [[_concepts/rag-systems]] — RAG 系统
- [[_concepts/agentic-rag]] — Agentic RAG
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
