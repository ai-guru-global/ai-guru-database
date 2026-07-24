---
title: "Reranker 2.0 / 重排序 2.0 (Qwen3-Reranker / GPT-4o Reranker / Late Interaction)"
category: concepts
tags:
  - rag
  - reranker
  - cross-encoder
  - qwen3-reranker
  - late-interaction
  - llm-reranker
  - reranking
aliases:
  - Reranker 2.0
  - Qwen3 Reranker
  - GPT-4o Reranker
  - LLM Reranker
  - Cross-Encoder Reranking
  - Late Interaction Reranking
relationships:
  - target: "概念/reranker"
    type: extends
  - target: "概念/colbert-late-interaction"
    type: related_to
  - target: "概念/rag-systems"
    type: related_to
  - target: "概念/embedding-models"
    type: related_to
summary: "Reranker 2.0 是 2024-2026 突破"传统 Cross-Encoder 慢 + 短文本"的方案——Qwen3-Reranker(0.6B/8B,多语种 SOTA)、GPT-4o-as-Reranker、ColBERT 晚期交互、ListT5、Cohere Rerank v3、BGE-Reranker-v2-Gemma。RAG 第二阶段精排的事实标准,Top-100 → Top-5 准确率提升 30-50%。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# Reranker 2.0

> **一句话理解**:Reranker 2.0 把"二阶段检索"中的精排升级为"LLM-as-Reranker"——用 LLM 直接给文档打分,Qwen3-Reranker、Cohere Rerank v3、BGE-Reranker-v2-Gemma、GPT-4o-as-Reranker 各有特色。RAG 系统准确率提升 30-50% 的关键。

---

## 一、为什么需要 Reranker?

两阶段检索的标准做法:
- **第一阶段(召回)**:向量检索 / BM25,Top-100
- **第二阶段(精排)**:Reranker 打分,Top-5-10

Reranker 的价值:
- **双塔召回的局限**:向量相似度 ≠ 真实相关性
- **细粒度匹配**:词级 / 语义级关联
- **多样性考虑**:避免"只召回相似文档,丢失关键信息"

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 重排序 | Reranking | 第二阶段精排 |
| 交叉编码器 | Cross-Encoder | 查询+文档联合编码 |
| 双塔 | Bi-Encoder / Dual Encoder | 查询/文档分别编码 |
| 单塔 | Mono-Encoder | 一篇文档一个分数 |
| 列表式 | Listwise | 一次排整批 |
| 对式 | Pairwise | 两两比较 |
| 点式 | Pointwise | 单文档打分 |
| LLM 重排序 | LLM Reranker | 用 LLM 打分 |
| 指令式重排 | Instruction-Following Reranker | 自然语言指令 |
| 列表 T5 | ListT5 | 列表式 T5 |
| 晚期交互 | Late Interaction | ColBERT 风格 |
| 多语种重排 | Multilingual Reranker | 跨语言支持 |
| 零样本重排 | Zero-Shot Reranker | 无需微调 |
| 微调重排 | Fine-Tuned Reranker | 任务特定微调 |
| 蒸馏重排 | Distilled Reranker | 大模型蒸馏到小 |
| 重排池 | Reranking Pool | 待重排候选集 |
| Top-K | Top-K | 取 K 个 |
| 阈值过滤 | Threshold Filter | 分数阈值筛选 |
| 分数校准 | Score Calibration | 跨模型分数对齐 |
| 重排评估 | Reranking Evaluation | NDCG / MRR / MAP |

---

## 三、主流 Reranker 对比(2026-02 快照)

| 模型 | 厂商/团队 | 大小 | 多语种 | NDCG@10 (BEIR) | 许可证 |
|---|---|---|---|---|---|
| **Qwen3-Reranker-8B** | 阿里 | 8B | 100+ | 56.2% | Apache 2.0 |
| **Qwen3-Reranker-4B** | 阿里 | 4B | 100+ | 54.8% | Apache 2.0 |
| **Qwen3-Reranker-0.6B** | 阿里 | 0.6B | 100+ | 52.1% | Apache 2.0 |
| **BGE-Reranker-v2-Gemma** | 智源 | 2B | 100+ | 54.5% | MIT |
| **BGE-Reranker-v2-MiniLM** | 智源 | 0.3B | 100+ | 50.2% | MIT |
| **Cohere Rerank v3.5** | Cohere | 闭源 | 100+ | 55.8% | 商业 |
| **Jina Reranker v2** | Jina | 0.5B | 多 | 52.3% | 商业 |
| **Mixedbread Rerank** | Mixedbread | 闭源 | 100+ | 53.7% | 商业 |
| **ColBERT v2** | Stanford | 110M | 多 | 50.1% | MIT |
| **RankT5** | Google | 多个 | 英文 | 49.5% | Apache 2.0 |
| **GPT-4o-as-Reranker** | OpenAI | 闭源 | 100+ | 58.3%(成本高) | 商业 |
| **Claude 3.7-as-Reranker** | Anthropic | 闭源 | 100+ | 57.6% | 商业 |
| **Gemini 2.5-as-Reranker** | Google | 闭源 | 100+ | 56.8% | 商业 |
| **ms-marco-MiniLM-L12** | Microsoft | 0.1B | 英文 | 42.1% | MIT |
| **monoT5** | Google | 0.2B-3B | 英文 | 47.5% | Apache 2.0 |

> NDCG@10 来自 BEIR 基准平均

---

## 四、Qwen3-Reranker 实战

### 4.1 安装

```bash
pip install vllm transformers
```

### 4.2 用 vLLM 部署

```python
from vllm import LLM, SamplingParams

llm = LLM(
    model="Qwen/Qwen3-Reranker-8B",
    task="reward",  # 关键
)

# 准备输入
query = "OpenAI 估值多少?"
documents = [
    "OpenAI 估值 3000 亿美元,2025 年完成融资。",
    "Anthropic 是 AI 安全公司,估值 3800 亿。",
    "天气晴朗,适合出游。",
]

# 构建 prompt
prompt_template = """<|im_start|>system
You are a relevance judge. Rate how relevant the document is to the query on 0-1 scale.<|im_end|>
<|im_start|>user
Query: {query}
Document: {doc}
Relevance score:<|im_end|>
<|im_start|>assistant
"""

inputs = [prompt_template.format(query=query, doc=d) for d in documents]
outputs = llm.generate(inputs, SamplingParams(temperature=0))

# 解析分数
scores = [float(o.outputs[0].text.strip()) for o in outputs]
ranked = sorted(zip(documents, scores), key=lambda x: x[1], reverse=True)
print(ranked)
# [('OpenAI 估值 3000...', 0.92), ('Anthropic...', 0.45), ('天气...', 0.05)]
```

### 4.3 与 LangChain 集成

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank
# 用 Qwen3-Reranker 替换 CohereRerank

from langchain_community.document_compressors.rankllm_rerank import RankLLMRerank

compressor = RankLLMRerank(
    model="Qwen/Qwen3-Reranker-8B",
    top_n=5,
)
reranker = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vector_store.as_retriever(search_kwargs={"k": 20}),
)

docs = reranker.invoke("OpenAI 估值多少?")
```

---

## 五、BGE-Reranker-v2 实战(开源轻量)

### 5.1 安装

```bash
pip install FlagEmbedding
```

### 5.2 使用

```python
from FlagEmbedding import FlagReranker

reranker = FlagReranker(
    "BAAI/bge-reranker-v2-gemma",
    use_fp16=True,
)

pairs = [
    ["OpenAI 估值多少?", "OpenAI 估值 3000 亿美元"],
    ["OpenAI 估值多少?", "Anthropic 估值 3800 亿"],
    ["OpenAI 估值多少?", "天气晴朗"],
]
scores = reranker.compute_score(pairs)
print(scores)
# [9.5, 0.6, -8.2]
```

---

## 六、GPT-4o-as-Reranker(零样本 SOTA)

### 6.1 Listwise 排序

```python
from openai import OpenAI

client = OpenAI()

def llm_rerank(query, documents, top_k=5):
    docs_text = "\n".join([f"[{i}] {d}" for i, d in enumerate(documents)])
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": f"""Query: {query}

Documents:
{docs_text}

Rank documents by relevance. Output only the indices in order, e.g. [2, 0, 4, 1, 3]"""
        }],
        temperature=0,
    )
    
    indices = parse_indices(response.choices[0].message.content)
    return [documents[i] for i in indices[:top_k]]
```

### 6.2 优势

- 零样本,无需训练
- 复杂 query 理解强
- Listwise / Pairwise 灵活

### 6.3 缺点

- 慢(每个 query 一次 LLM 调用)
- 贵(数千 token)
- 难以大规模(>100 文档)

---

## 七、ColBERT 晚期交互作为 Reranker

ColBERT 本质上是细粒度重排:
- **第一阶段**:ColBERT 召回(可作为粗排)
- **第二阶段**:ColBERT 重打分(精排)

```python
from colbert import Searcher

searcher = Searcher(index="my_index", collection=documents)

# 直接重排 Top-100
results = searcher.search(query, k=100)  # 召回 100
# ColBERT 内部已经做了 MaxSim 精排
top_5 = results[:5]
```

---

## 八、生产最佳实践

1. **首选 Qwen3-Reranker-4B/8B**:开源、SOTA、多语种。
2. **轻量场景用 BGE-Reranker-v2-MiniLM**:0.3B,CPU 也能跑。
3. **企业级用 Cohere Rerank v3.5**:质量最高,但贵。
4. **零样本用 GPT-4o/Claude 3.7**:偶尔重排,准确率最高。
5. **两阶段必做**:双塔召回 + Reranker 精排,缺一不可。
6. **Top-100 → Top-5-10**:召回多,精排到 5-10。
7. **Reranker 性能监控**:NDCG@10 / MRR,持续观察。
8. **A/B 测试**:开/关 Reranker 对比。
9. **缓存 Reranker 结果**:相同 query 命中缓存。
10. **指令式 Reranker**:支持"重视时效""避免重复"等指令。
11. **多语种场景**:Qwen3 / BGE-v2-Gemma 中文 SOTA。
12. **GPU 资源紧张**:Qwen3-Reranker-0.6B 单卡够用。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Qwen3-Reranker** | v0.6B/4B/8B,2025-11 GA,中文 SOTA |
| **BGE-Reranker-v2** | Gemma / MiniLM 系列,智源 2024-08 |
| **Cohere Rerank** | v3.5(2025-10),企业级,质量 SOTA |
| **Jina Reranker** | v2(2025-03),多语种,API 友好 |
| **ListT5** | Google 2024,Listwise 重排 |
| **RankZephyr** | 2024,Zephyr 蒸馏 |
| **GPT-4o-as-Reranker** | 零样本 SOTA,但贵 |
| **框架集成** | LangChain / LlamaIndex / Haystack 原生 |
| **基准** | BEIR / MIRACL / TREC-COVID / NFCorpus |
| **企业应用** | 法律 / 金融 / 客服 / 学术"高准确 RAG" |
| **市场规模** | Reranker 商业化 ARR $100M+ |

---

## 十、See Also(官方源)

### Qwen3-Reranker

- Qwen3-Reranker [huggingface.co/Qwen/Qwen3-Reranker-8B](https://huggingface.co/Qwen/Qwen3-Reranker-8B)
- Qwen3 博客 [qwenlm.github.io/blog/qwen3-reranker](https://qwenlm.github.io/blog/qwen3-reranker)

### BGE-Reranker

- BGE-Reranker-v2 [huggingface.co/BAAI/bge-reranker-v2-gemma](https://huggingface.co/BAAI/bge-reranker-v2-gemma)
- FlagEmbedding [github.com/FlagOpen/FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)
- 文档 [github.com/FlagOpen/FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)

### Cohere

- Cohere Rerank [cohere.com/rerank](https://cohere.com/rerank)
- 文档 [docs.cohere.com/docs/rerank-2](https://docs.cohere.com/docs/rerank-2)

### Jina

- Jina Reranker [jina.ai/reranker](https://jina.ai/reranker/)

### 其他

- ColBERT [github.com/stanford-futuredata/colbert](https://github.com/stanford-futuredata/colbert)
- RankT5 论文 [arxiv.org/abs/2203.15691](https://arxiv.org/abs/2203.15691)
- RankZephyr 论文 [arxiv.org/abs/2312.02724](https://arxiv.org/abs/2312.02724)

### 框架

- LangChain Rerank [python.langchain.com/docs/integrations/retrievers](https://python.langchain.com/docs/integrations/retrievers)
- LlamaIndex Rerank [docs.llamaindex.ai](https://docs.llamaindex.ai/)
- Haystack Rankers [haystack.deepset.ai](https://haystack.deepset.ai/)

### 基准

- BEIR [github.com/beir-cellar/beir](https://github.com/beir-cellar/beir)
- MIRACL [github.com/project-miracl/miracl](https://github.com/project-miracl/miracl)

---

## 十一、相关概念卡

- [[概念/reranker|Reranker]]
- [[概念/colbert-late-interaction|Colbert Late Interaction]]
- [[概念/embedding-models|Embedding Models]]
- [[概念/rag-systems|Rag Systems]]
- [[概念/agentic-rag-2|Agentic Rag 2]]
- [[概念/hybrid-search|Hybrid Search]]
- [[概念/bge-m3|Bge M3]]
- [[概念/qwen-series|Qwen Series]]
