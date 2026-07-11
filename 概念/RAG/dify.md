---
title: "Dify 开源 LLM 应用平台 (Dify Open-Source LLM App Platform)"
category: -concepts
tags: ["dify", "llm-platform", "rag", "agent", "low-code", "workflow"]
relationships:
  - target: "概念/rag-systems"
    type: related_to
  - target: "概念/agentic-rag"
    type: related_to
  - target: "概念/langflow"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Dify 是最流行的开源 LLM 应用开发平台，提供可视化工作流编排、RAG 引擎、Agent 框架、模型管理和运营分析。AI Stack 生态中可作为企业级 LLM 应用构建工具。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: supporting
---

# Dify 开源 LLM 应用平台

> **一句话理解**: Dify 是"开源的 LLM 应用开发平台"——可视化工作流 + RAG + Agent + 模型管理 + 运营分析，企业搭建 AI 应用的首选开源方案。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **项目** | Dify |
| **来源** | 社区开源 |
| **功能** | LLM 应用开发全栈平台 |
| **开源** | Apache 2.0 |
| **GitHub** | github.com/langgenius/dify |
| **Stars** | 60K+（2025） |

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **工作流编排** | 可视化拖拽构建 LLM 应用流程 |
| **RAG 引擎** | 内置文档切分/嵌入/检索/重排序 |
| **Agent 框架** | ReAct / Function Calling Agent |
| **模型管理** | 多模型接入、负载均衡、Fallback |
| **运营分析** | 对话日志、用户分析、A/B 测试 |
| **API 优先** | REST API + SDK，嵌入到现有系统 |

---

## 3. 与同类平台对比

| 维度 | Dify | LangFlow | Flowise | 百炼专属版 |
|------|------|---------|---------|----------|
| **开源** | ✅ | ✅ | ✅ | ❌ 商业 |
| **工作流** | 可视化 | 可视化 | 可视化 | 可视化 |
| **RAG** | ✅ 原生 | 需构建 | 需构建 | ✅ 原生 |
| **Agent** | ✅ | ✅ | ✅ | ✅ |
| **运营分析** | ✅ 内置 | ❌ | ❌ | ✅ |
| **私有部署** | ✅ Docker | ✅ | ✅ | ✅ 一体机 |
| **多租户** | ✅ | ❌ | ❌ | ✅ |
| **中文优化** | ✅ 原生 | 一般 | 一般 | ✅ 原生 |

---

## 4. 在 AI Stack 生态中的位置

```
AI Stack LLM 应用构建层级
│
├── 一体化方案
│   ├── AI Stack 知识库（内置 RAG）
│   └── 百炼专属版 MINI/Lite/标准版
│
├── 开源平台（可部署在 AI Stack 上）
│   ├── Dify ← 本文（最全面）
│   ├── LangFlow（LangChain 生态）
│   ├── Flowise（LangChain 轻量）
│   └── RAGFlow（RAG 专精）
│
├── 代码框架
│   ├── LangChain / LlamaIndex / Haystack
│   └── 自定义 Python
│
└── 推理层
    └── vLLM / SGLang / Ollama
```

---

## Related

- [[概念/rag-systems]] — RAG 系统
- [[概念/langflow]] — LangFlow 可视化编排
- [[概念/agentic-rag]] — Agentic RAG
- [[11_RAG_Systems/Dify_Deep_Dive]] — Dify 深度解析
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
