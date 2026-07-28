---
title: "多模态 RAG (ColPali / ColQwen / VisRAG / 图像文档检索)"
category: concepts
tags:
  - rag
  - multimodal-rag
  - colpali
  - colqwen
  - visrag
  - colbert
  - visual-document-retrieval
aliases:
  - Multimodal RAG
  - ColPali
  - ColQwen
  - VisRAG
  - Visual Document Retrieval
  - ColVision
relationships:
  - target: "概念/rag-systems"
    type: extends
  - target: "概念/vision-language-model"
    type: related_to
  - target: "概念/colbert-late-interaction"
    type: related_to
  - target: "概念/embedding-models"
    type: related_to
summary: "多模态 RAG 是 2024-2026 突破"文本 RAG 无法检索图表 / 公式 / 截图"的关键技术——ColPali(2024-05,直接用 VLM 把 PDF 页面当图)、ColQwen(Qwen2-VL 基础版)、VisRAG(多模态文档)、ColVision(2025)。不再需要 OCR / 文档解析,准确率提升 10-25%。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "多模态 RAG"
---

# 多模态 RAG

> 中文简称：多模态 RAG

> **一句话理解**:多模态 RAG 把"文档"从文本扩展到图像/PDF/截图/手写——ColPali 用 VLM 直接把整页当图编码,跳过 OCR,准确率 90%+(比传统 OCR+RAG 高 25%)。是金融财报/法律合同/医学影像/UI 截图检索的核心方案。

---

## 一、为什么需要多模态 RAG?

传统 RAG(文本切分 + 向量化)的问题:
- **图表无法检索**:PDF 里的趋势图、柱状图丢失
- **公式/手写难处理**:OCR 错漏多
- **布局信息丢失**:表格结构被破坏
- **截图/PDF 原貌丢失**:语义错位
- **多语言混排**:中日韩英混排 OCR 错误率 10%+

多模态 RAG 解法:
- **直接图像编码**:ColPali 把整页 PDF 当图
- **视觉 + 文本融合**:图表用视觉编码,文本用文本编码
- **保留布局**:ViT 保留位置信息
- **跳过 OCR**:省去错误环节

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 多模态 RAG | Multimodal RAG | RAG 跨文本/图像/视频 |
| 视觉文档检索 | Visual Document Retrieval(VDR) | 用图像检索文档 |
| 视觉编码器 | Vision Encoder | ViT / SigLIP / CLIP |
| 视觉语言模型 | Vision-Language Model(VLM) | Qwen-VL / InternVL / GPT-4V |
| 晚期交互 | Late Interaction | ColBERT 风格,查询/文档分别编码 |
| 页面编码 | Page Encoding | 把整页当图编码 |
| 文档解析 | Document Parsing | OCR + 布局分析 |
| 光学字符识别 | OCR | 图像转文字 |
| 布局分析 | Layout Analysis | 检测文本块/表格/图像位置 |
| 表格结构识别 | Table Structure Recognition(TSR) | 表格转结构化 |
| 图表问答 | Chart QA | 理解图表内容 |
| PDF 检索 | PDF Retrieval | PDF 内容检索 |
| 截图问答 | Screenshot QA | UI/代码截图问答 |
| 视频检索 | Video Retrieval | 视频内容检索 |
| 跨模态检索 | Cross-Modal Retrieval | 文本查图像 / 图像查文本 |
| 嵌入空间 | Embedding Space | 多模态共同空间 |
| 重排序 | Reranking | 多模态精排 |
| 多向量 | Multi-Vector | ColBERT 风格,每 token 一向量 |
| Patch 编码 | Patch Encoding | ViT 把图切成 patch 编码 |
| 端到端 | End-to-End | 编码 + 检索 一体化 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 团队/厂商 | 基础模型 | 准确率(VDR) | 许可证 |
|---|---|---|---|---|
| **ColPali** | ENS Paris-Saclay / ILLUIN | PaliGemma-3B | 80.1% | MIT |
| **ColPali v1.3** | ILLUIN | PaliGemma-2 3B | 83.4% | MIT |
| **ColQwen** | ILLUIN | Qwen2-VL 2B | 82.7% | MIT |
| **ColQwen2** | ILLUIN | Qwen2.5-VL 7B | 85.3% | MIT |
| **ColQwen2.5** | ILLUIN | Qwen2.5-VL 7B | 87.1% | MIT |
| **VisRAG** | Shanghai AI Lab | MiniCPM-V 2.6 | 81.5% | MIT |
| **VisRAG-2** | Shanghai AI Lab | InternVL 3 | 84.2% | MIT |
| **ColVision** | Salesforce | Florence-2 | 79.5% | MIT |
| **DSE** | Baidu | ERNIE-ViL | 78.9% | 闭源 |
| **M3DocRAG** | Sea AI Lab | InternVL 2.0 | 82.4% | MIT |
| **GME** | 智源 | BGE-VL | 80.6% | MIT |
| **BGE-VL** | 智源 | BGE-M3 + CLIP | 80.1% | MIT |
| **Qwen2.5-VL-Embed** | 阿里 | Qwen2.5-VL | 86.7% | Apache 2.0 |
| **传统 OCR + RAG** | - | - | 60-70% | - |

> 准确率基于 ViDoRe(VIsual Document REtrieval)基准

---

## 四、ColPali 架构详解

### 4.1 核心思想

- **整页图像输入**:不切分文本,直接把整页 PDF 当图
- **PaliGemma 编码**:用 VLM 提取 1024 个 patch embedding
- **晚期交互**:查询 → 同样的 VLM 编码 → MaxSim 相似度

### 4.2 架构

```
PDF Page
   ↓
PaliGemma(VLM)
   ↓
1024 patch embeddings(每页)
   ↓
存储到 ColBERT 风格向量库(多向量)

Query
   ↓
PaliGemma(同一模型)
   ↓
128 query embeddings
   ↓
MaxSim 相似度 = sum of max(q·d) over all patches
   ↓
Top-K 页面
```

### 4.3 实战

```python
from colpali_engine.models import ColPali, ColPaliProcessor
from colpali_engine.utils.indexing import index
import torch

model = ColPali.from_pretrained("vidore/colpali-v1.3", torch_dtype=torch.bfloat16).to("cuda")
processor = ColPaliProcessor.from_pretrained("vidore/colpali-v1.3")

# 索引 PDF 页面
images = [Image.open(f"page_{i}.png") for i in range(10)]
batch = processor.process_images(images).to("cuda")
page_embeddings = model(**batch)  # (10, 1024, 128)

# 检索
queries = ["2024 年营收是多少?"]
batch_queries = processor.process_queries(queries).to("cuda")
query_embeddings = model(**batch_queries)  # (1, 128, 128)

scores = processor.score_multi_vector(query_embeddings, page_embeddings)
# tensor([[9.5, 3.2, 2.1, ...]]) # Top-K
```

### 4.4 性能数据

- **索引速度**:100 页/分钟(A100)
- **检索速度**:10ms(A100, 100K 页索引)
- **显存**:1GB / 1000 页
- **准确率**:ViDoRe 80.1%

---

## 五、ColQwen2.5 实战(Qwen2.5-VL 基础)

### 5.1 优势

- **多语言原生**:中英日韩,无需特别处理
- **图表理解**:Qwen2.5-VL 对图表 SOTA
- **公式支持**:LaTeX / 化学式 / 手写
- **长文档**:整本书可处理

### 5.2 实战

```python
from colpali_engine.models import ColQwen2_5, ColQwen2_5_Processor

model = ColQwen2_5.from_pretrained(
    "vidore/colqwen2.5-v0.2",
    torch_dtype=torch.bfloat16,
).to("cuda")
processor = ColQwen2_5_Processor.from_pretrained("vidore/colqwen2.5-v0.2")
# ... 类似 ColPali
```

---

## 六、生产最佳实践

1. **首选 ColQwen2.5(中文场景)**:Qwen2.5-VL 基础,中英日韩 SOTA。
2. **英文 / 多语种选 ColPali v1.3**:成熟、稳定、文档好。
3. **大文档库用 ColVision**:处理百万页级。
4. **跳过 OCR 直接图像编码**:准确率提升 25%,延迟增加有限。
5. **Patch 维度 1024 / 128**:标准 ColBERT 风格。
6. **MaxSim 相似度**:晚期交互 SOTA,不要换 cosine。
7. **向量库用 Qdrant / Milvus / Vespa**:支持多向量。
8. **重排序用 Qwen2.5-VL / GPT-4o**:Top-100 → Top-5 精排。
9. **混合检索**:图像 + 文本双路,文本用 BGE-m3。
10. **页面级 vs 段落级**:ColPali 页面级,精度不够再切段。
11. **可观测性**:Langfuse 追踪检索 + 视觉理解。
12. **成本控制**:小文档用 mini ColPali,大文档用 ColQwen2.5。

---

## 七、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **ColPali / ColQwen** | v1.3 / 2.5 GA,生产成熟 |
| **VisRAG** | v2(2025-12),InternVL 3 基础,中文 SOTA |
| **VDR 基准 ViDoRe** | v2(2025-09),中英日韩扩展 |
| **向量库** | Qdrant / Milvus 2.5+ / Vespa / Weaviate 全部支持多向量 |
| **框架** | LangChain / LlamaIndex / Haystack 集成 |
| **企业应用** | 金融财报 / 法律合同 / 医学影像 / UI 设计稿 / 论文 |
| **VLM 编码器** | Qwen2.5-VL / InternVL 3 / PaliGemma-3 / GPT-4o / Claude 3.5 |
| **标准化** | ViDoRe / ChartQA / DocVQA / InfoVQA |
| **市场规模** | 多模态 RAG 企业 ARR $500M+ |
| **主要竞品** | ColPali / ColQwen / VisRAG / GPT-4o Direct |

---

## 八、See Also(官方源)

### ColPali / ColQwen

- ColPali GitHub [github.com/illuin-tech/colpali](https://github.com/illuin-tech/colpali)
- ColPali 论文 [arxiv.org/abs/2407.01449](https://arxiv.org/abs/2407.01449)
- Vidore 基准 [github.com/illuin-tech/vidore-benchmark](https://github.com/illuin-tech/vidore-benchmark)
- HuggingFace 集合 [huggingface.co/vidore](https://huggingface.co/vidore)

### VisRAG

- VisRAG 论文 [arxiv.org/abs/2410.10594](https://arxiv.org/abs/2410.10594)
- VisRAG GitHub [github.com/zaidalyafeai/VisRAG](https://github.com/zaidalyafeai/VisRAG)

### 其他

- ColBERT [github.com/stanford-futuredata/colbert](https://github.com/stanford-futuredata/colbert)
- Qwen2.5-VL [qwenlm.github.io/blog/qwen2.5-vl](https://qwenlm.github.io/blog/qwen2.5-vl/)
- InternVL [github.com/OpenGVLab/InternVL](https://github.com/OpenGVLab/InternVL)
- BGE-VL [github.com/FlagOpen/FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)

### 框架

- LangChain Multi-Modal [python.langchain.com/docs/use_cases/multimodal](https://python.langchain.com/docs/use_cases/multimodal)
- LlamaIndex Multi-Modal [docs.llamaindex.ai/en/stable/optimizing/agentic_strategies/agentic_strategies](https://docs.llamaindex.ai/en/stable/optimizing/agentic_strategies/agentic_strategies.html)
- Haystack Multimodal [haystack.deepset.ai](https://haystack.deepset.ai/)

### 评测

- ViDoRe [github.com/illuin-tech/vidore-benchmark](https://github.com/illuin-tech/vidore-benchmark)
- DocVQA [docvqa.org](https://www.docvqa.org/)
- ChartQA [github.com/ahmed-masry/ChartQA](https://github.com/ahmed-masry/ChartQA)
- InfoVQA [github.com/visheratin/infovqa](https://github.com/visheratin/infovqa)

---

## 九、相关概念卡

- [[概念/rag-systems|Rag Systems]]
- [[概念/vision-language-model|Vision Language Model]]
- [[概念/embedding-models|Embedding Models]]
- [[概念/colbert-late-interaction|Colbert Late Interaction]]
- [[概念/hybrid-search|Hybrid Search]]
- [[概念/document-ai|Document Ai]]
- [[概念/reranker|Reranker]]
- [[概念/qwen-series|Qwen Series]]
