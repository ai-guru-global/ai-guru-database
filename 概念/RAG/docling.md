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

## 2026 Docling 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| PDF 解析 | ✅ 成熟 | 布局感知 |
| 表格提取 | ✅ 成熟 | 结构化输出 |
| OCR 集成 | ✅ 成熟 | 多语言 |
| Markdown 输出 | ✅ 成熟 | RAG 友好 |
| 批量处理 | ✅ 成熟 | 高吞吐 |
| 图片理解 | 🟡 发展中 | 多模态 |
| 手写体识别 | 🟡 发展中 | 特殊场景 |

## 检查清单

- [ ] Docling 版本已固定
- [ ] 解析质量已验证
- [ ] OCR 已配置（扫描件）
- [ ] 输出格式已确定
- [ ] 批量处理已配置
- [ ] 性能已测试

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 解析质量差 | 文档格式复杂 | 启用 OCR + 布局分析 |
| 表格提取失败 | 表格结构复杂 | 使用深度学习表格检测 |
| 速度慢 | 文档量大 | 批量处理 + GPU 加速 |
| 中文支持差 | 模型不匹配 | 使用中文 OCR 模型 |

## 延伸阅读

- [[概念/RAG/ragflow|RAGFlow]] — RAG 引擎（内置解析）
- [[概念/RAG/rag-patterns|RAG Patterns]] — RAG 模式
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库
- [[概念/RAG/embedding-models|Embedding Models]] — 嵌入模型
- [[概念/RAG/storage|Storage]] — 存储方案

> ℹ️ Docling 是 IBM 开源的文档解析工具，2026年以布局感知 PDF 解析 + 表格提取 + Markdown 输出著称，是 RAG 数据预处理的关键组件。

## Docling 配置示例

```python
from docling.document_converter import DocumentConverter
converter = DocumentConverter()
result = converter.convert("document.pdf")
markdown = result.document.export_to_markdown()
# 输出 RAG 友好的 Markdown 格式
```

## 支持格式对比

| 格式 | 解析质量 | 表格 | 图片 | 状态 |
|------|------|------|------|------|
| PDF | 高 | ✅ | ✅ | ✅ 成熟 |
| DOCX | 高 | ✅ | ✅ | ✅ 成熟 |
| HTML | 高 | ✅ | ✅ | ✅ 成熟 |
| PPTX | 中 | ✅ | ✅ | ✅ 成熟 |
| 扫描件 | 中 | 🟡 | ✅ | 🟡 OCR |

> ℹ️ Docling 是 2026 年最活跃的开源文档解析引擎，支持 30+ 格式统一输出，是 RAG 数据管道的首选前端组件。

## 延伸阅读

- [[概念/RAG/ragflow|RAGFlow]] — RAG 引擎
- [[概念/RAG/dify|Dify]] — LLM 平台
- [[概念/RAG/rag-patterns|RAG Patterns]] — RAG 模式
