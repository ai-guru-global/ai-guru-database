---
title: "RAGFlow 开源 RAG 引擎 (RAGFlow Deep Document Understanding)"
category: -concepts
tags: ["ragflow", "rag-engine", "document-understanding", "deep-search", "open-source"]
relationships:
  - target: "_concepts/rag-systems"
    type: related_to
  - target: "_concepts/docling"
    type: related_to
  - target: "_concepts/reranker"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "RAGFlow 是 InfiniFlow 开源的 RAG 引擎，以深度文档理解为核心——支持复杂 PDF 表格/图片/公式解析，提供可视化知识库管理，是企业级 RAG 的专精方案。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: supporting
---

# RAGFlow 开源 RAG 引擎

> **一句话理解**: RAGFlow 是"RAG 专精引擎"——以深度文档理解为核心竞争力，解析复杂 PDF 表格/图片/公式的能力业界领先。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **项目** | RAGFlow |
| **来源** | InfiniFlow 开源 |
| **功能** | 深度文档理解 RAG 引擎 |
| **核心优势** | 复杂 PDF 解析（表格/图片/公式/版面分析） |
| **开源** | Apache 2.0 |
| **GitHub** | github.com/infiniflow/ragflow |

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **深度文档理解** | 版面分析 + OCR + 表格/图片/公式识别 |
| **智能切分** | 基于文档结构的语义切分 |
| **可视化知识库** | 管理/预览/编辑知识库内容 |
| **多种检索策略** | 关键词 + 语义 + 混合检索 |
| **对话界面** | 内置聊天界面 + 引用溯源 |
| **API 开放** | REST API 嵌入到现有系统 |

---

## 3. 与同类 RAG 工具对比

| 维度 | RAGFlow | Dify | LangFlow | AI Stack 知识库 |
|------|---------|------|---------|---------------|
| **定位** | RAG 专精 | 全栈平台 | 编排工具 | 内置功能 |
| **文档理解** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Agent** | ⚠️ 基础 | ✅ 强 | ✅ 强 | ⚠️ 基础 |
| **工作流** | RAG 专属 | 通用 | 通用 | RAG 专属 |
| **私有部署** | ✅ | ✅ | ✅ | ✅ 一体机 |
| **中文优化** | ✅ 原生 | ✅ 原生 | 一般 | ✅ 原生 |

---

## 4. RAGFlow 文档解析优势

```
RAGFlow 文档解析流水线
│
├── 文档输入
│   └── PDF / DOCX / PPTX / 图片
│
├── 版面分析
│   ├── 标题/段落/表格/图片/公式 区域检测
│   └── 阅读顺序重建
│
├── 结构化提取
│   ├── 表格 → 结构化表格数据
│   ├── 图片 → OCR + 图片描述
│   ├── 公式 → LaTeX 表示
│   └── 段落 → 层级化文本
│
├── 语义切分
│   └── 基于文档结构的智能分块
│
└── 检索 + 生成
    └── 带引用溯源的 RAG 回答
```

---

## Related

- [[_concepts/rag-systems]] — RAG 系统
- [[_concepts/docling]] — Docling 文档解析
- [[_concepts/reranker]] — 重排序模型
- [[_concepts/dify]] — Dify LLM 平台
- README — RAGFlow 深度解析
