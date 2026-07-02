---
title: "Hugging Face Datasets 流式处理与大规模语料加工指南"
category: "14-rag-systems"
tags: ["datasets", "huggingface", "data-processing", "streaming", "rag"]
summary: "> **一句话理解**: 面对 TB 级的大模型预训练/RAG 语料，`datasets` 库的 Streaming 模式允许你在一台只有 8GB 内存的笔记本上处理海量数据而不会 OOM。"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "Hf Datasets Streaming"
  - "HF Datasets Streaming"
  - HF_Datasets_Streaming

---
# Hugging Face Datasets 流式处理与大规模语料加工指南

> **一句话理解**: 面对 TB 级的大模型预训练或庞大的 RAG 语料库，Hugging Face 的 `datasets` 库提供了强大的 **Streaming (流式加载)** 模式，允许你在一台只有 8GB 内存的笔记本上飞速处理海量数据而不会 OOM。

---

## 目录

1. [常规加载 vs 流式加载 (Streaming)](#1-常规加载-vs-流式加载-streaming)
2. [流式处理实战](#2-流式处理实战)
3. [多进程数据处理 (Map 优化)](#3-多进程数据处理-map-优化)
4. [为 RAG 系统构建索引数据](#4-为-rag-系统构建索引数据)
5. [结合 Arrow 格式的高级特性](#5-结合-arrow-格式的高级特性)

---

## 1. 常规加载 vs 流式加载 (Streaming)

当我们从 Hub 加载数据集时，默认行为是将所有数据下载到本地磁盘缓存（通常在 `~/.cache/huggingface/datasets`）。

**常规加载的痛点**：
*   **漫长的等待**：如果你加载 `HuggingFaceFW/fineweb` 这样几百 GB 的数据集，光下载就要几个小时。
*   **磁盘耗尽**：本地磁盘很容易被打满。
*   **内存溢出**：即使是使用 Arrow 映射，过多的元数据也可能导致 OOM。

**Streaming 模式**：
只需加上 `streaming=True`，数据集不会一次性下载。它会在后台通过迭代器（Iterator）一边下载、一边处理、一边丢弃。真正做到了 "On-the-fly"。

---

## 2. 流式处理实战

### 2.1 启用 Streaming
以 FineWeb (高质量 Web 爬取数据集) 为例：

```python
from datasets import load_dataset

# 瞬间返回一个 IterableDataset，不会占用大量硬盘
iterable_dataset = load_dataset(
    "HuggingFaceFW/fineweb", 
    name="sample-10BT", # 使用 100 亿 token 的子集
    split="train", 
    streaming=True
)

# 查看第一条数据
print(next(iter(iterable_dataset)))
```

### 2.2 过滤与清洗 (Filter & Map)

在流模式下，`map` 和 `filter` 依然可用，但它们变成了惰性计算（Lazy Evaluation）。只有当你通过 `next()` 或循环去索要数据时，清洗逻辑才会真正执行。

```python
def is_long_enough(example):
    # 只保留文本长度大于 1000 字符的文章
    return len(example["text"]) > 1000

def extract_metadata(example):
    # 清洗：提取 URL 域名并增加一个长度字段
    url = example.get("url", "")
    domain = url.split("/")[2] if "//" in url else ""
    
    return {
        "text": example["text"],
        "domain": domain,
        "char_count": len(example["text"])
    }

# 链式调用
processed_dataset = (
    iterable_dataset
    .filter(is_long_enough)
    .map(extract_metadata)
)

# 打印前 3 条处理后的数据
for i, item in enumerate(processed_dataset):
    print(item["domain"], item["char_count"])
    if i == 2:
        break
```

---

## 3. 多进程数据处理 (Map 优化)

如果是**常规非流式加载**（例如几十 GB 数据已经下载到本地），你可以利用所有 CPU 核心并行处理数据（如 Tokenization）。

```python
dataset = load_dataset("json", data_files="my_local_data.jsonl", split="train")

from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B")

def tokenize_function(examples):
    # 批量处理 (Batched)
    return tokenizer(examples["text"], truncation=True, max_length=512)

# 开启多进程 (num_proc) 和批量处理 (batched)
# 这是大模型数据清洗必须掌握的核心技巧
tokenized_dataset = dataset.map(
    tokenize_function, 
    batched=True,           # 一次传递一个 batch 给函数
    num_proc=16,            # 开启 16 个进程加速
    remove_columns=["text"] # 处理完后删除原始大文本，节约内存
)
```

---

## 4. 为 RAG 系统构建索引数据

在构建 RAG 时，我们需要将长文档进行 Chunking (分块)。使用 `datasets` 库处理比原生 LangChain 的 Document Loader 更快、更适合 PB 级数据。

```python
def chunk_document(examples):
    chunk_size = 500
    overlap = 50
    chunks = []
    source_ids = []
    
    # 因为是 batched=True，examples["text"] 是一个列表
    for doc_id, text in zip(examples["id"], examples["text"]):
        start = 0
        text_len = len(text)
        
        while start < text_len:
            end = start + chunk_size
            chunks.append(text[start:end])
            source_ids.append(doc_id)
            start += chunk_size - overlap # 处理 overlap
            
    return {
        "chunk_text": chunks,
        "doc_id": source_ids
    }

# 将 1 万篇长文章变为 10 万个 chunk
rag_dataset = dataset.map(
    chunk_document,
    batched=True,
    remove_columns=dataset.column_names # 删除所有原列，完全替换为新列
)

# 导出为 JSONL 或直接供给向量数据库
rag_dataset.to_json("rag_chunks.jsonl", orient="records", lines=True)
```

---

## 5. 结合 Arrow 格式的高级特性

`datasets` 库底层基于 Apache Arrow 格式。它的核心优势是 **Memory-mapping (内存映射)**。
这意味着，如果你有一个 50GB 的本地数据集，通过 `datasets.load_from_disk()` 加载它时，它**不会把 50GB 载入内存**，而是根据程序访问的指针实时从硬盘映射数据。

```python
# 1. 将处理好的数据存为 arrow 格式目录
rag_dataset.save_to_disk("./my_arrow_dataset")

# 2. 第二天重新加载，速度极快（毫秒级），不占用 RAM
import datasets
reloaded = datasets.load_from_disk("./my_arrow_dataset")
```

---

## 相关阅读
- [[14_RAG_Systems/Advanced_RAG/Data_Ingestion_Pipeline]]
- [[14_RAG_Systems/Vector_Database_for_dummy]]
- [[07_Model_Training/Data/Tokenizer_Design_2026]]
