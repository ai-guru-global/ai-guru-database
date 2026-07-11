---
title: "Docling 文档解析工具 (Docling Document Parser)"
category: -concepts
tags: ["docling", "document-parser", "rag", "pdf", "ibm", "preprocessing"]
relationships:
  - target: "概念/rag-systems"
    type: related_to
  - target: "概念/embedding-models"
    type: related_to
  - target: "概念/reranker"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Docling 是 IBM 开源的文档解析工具，支持 PDF/DOCX/PPTX/HTML 等格式的结构化提取。保留表格/图片/段落层级关系，是 RAG 流水线文档预处理的首选工具。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: supporting
---

# Docling 文档解析工具

> **一句话理解**: Docling 是"RAG 的文档解析器"——IBM 开源，能将 PDF/Word/PPT 转为结构化 JSON，保留表格、图片、段落层级关系，让 RAG 检索更精准。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **项目** | Docling |
| **来源** | IBM Research |
| **功能** | 多格式文档结构化解析 |
| **开源** | MIT License |
| **GitHub** | github.com/DS4SD/docling |
| **核心优势** | 表格/图片/层级关系保留 |

---

## 2. 支持格式

| 格式 | 扩展名 | 表格提取 | 图片提取 | 层级保留 |
|------|--------|---------|---------|---------|
| **PDF** | .pdf | ✅ | ✅ | ✅ |
| **Word** | .docx | ✅ | ✅ | ✅ |
| **PowerPoint** | .pptx | ✅ | ✅ | ✅ |
| **HTML** | .html | ✅ | ✅ | ✅ |
| **Markdown** | .md | ✅ | ✅ | ✅ |
| **图片** | .png/.jpg | OCR | ✅ | N/A |

---

## 3. 在 RAG 流水线中的位置

```
RAG 文档处理流水线
│
├── 文档输入
│   └── PDF / DOCX / PPTX / HTML
│
├── 文档解析 ← Docling（本文）
│   ├── 结构化提取（段落/表格/图片/标题）
│   ├── 层级关系保留
│   └── 输出: DoclingDocument JSON
│
├── 文档切分 (Chunking)
│   ├── 按标题层级切分
│   ├── 语义切分
│   └── 滑动窗口
│
├── 向量化 (Embedding)
│   └── bge-m3 / GTE / E5
│
├── 检索 + 重排序
│   └── ANN + Reranker
│
└── 生成
    └── LLM 基于检索结果回答
```

---

## 4. 快速使用

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()

# 解析 PDF
result = converter.convert("report.pdf")

# 获取结构化文档
doc = result.document

# 导出 Markdown
md = doc.export_to_markdown()

# 导出 JSON（保留完整结构）
json_data = doc.export_to_dict()

# 遍历段落
for para in doc.paragraphs:
    print(f"[{para.level}] {para.text}")

# 提取表格
for table in doc.tables:
    df = table.export_to_dataframe()
    print(df.head())
```

---

## 5. 与同类工具对比

| 维度 | Docling | Unstructured | PyMuPDF | Marker |
|------|---------|-------------|---------|--------|
| **来源** | IBM | Unstructured.io | 社区 | 社区 |
| **表格提取** | ✅ 优秀 | ✅ | ⚠️ 需手写 | ✅ |
| **层级保留** | ✅ 完整 | ⚠️ 部分 | ❌ | ✅ |
| **多格式** | 6+ | 20+ | PDF only | PDF only |
| **OCR** | ✅ 内置 | ✅ | 需外部 | ✅ |
| **速度** | 中 | 慢 | 快 | 中 |
| **输出格式** | JSON/MD | 多种 | 原始 | MD |

---

## Related

- [[概念/rag-systems]] — RAG 系统
- [[概念/embedding-models]] — 嵌入模型
- [[概念/reranker]] — 重排序模型
- [[概念/agentic-rag]] — Agentic RAG
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
