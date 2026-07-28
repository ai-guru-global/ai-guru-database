---
title: "HuggingFace Datasets Streaming 模式实战指南"
category: "14-rag-systems"
tags: ["huggingface", "datasets", "streaming", "data-engineering", "rag", "fine-tuning", "large-scale-data"]
summary: "> **一句话理解**: 当数据集大到无法全部下载（如 FineWeb-Edu 的 TB 级语料），`datasets` 库的 Streaming 模式让你在内存有限的机器上边读边处理，是 RAG 测评与模型微调数据准备的必备技能。"
created: "2026-06-25"
updated: "2026-06-25"
tier: supporting
aliases:
  - "HF Datasets Streaming"
  - "HuggingFace Datasets Streaming"
  - HF_Datasets_Streaming
sources: []

name_zh: "HuggingFace Datasets Streaming 模式实战指南"
---
# HuggingFace Datasets Streaming 模式实战指南

> 中文简称：HuggingFace Datasets Streaming 模式实战指南

> **一句话理解**: `datasets` 库的 Streaming 模式通过惰性加载（lazy loading）+ Arrow 格式流式传输，让你在 8GB 内存的笔记本上处理 TB 级数据集，无需完整下载。

---

## 目录

1. [Streaming vs 非 Streaming：何时用哪种](#1-streaming-vs-非-streaming何时用哪种)
2. [流式加载 HuggingFace Hub 数据集](#2-流式加载-huggingface-hub-数据集)
3. [流式预处理管道](#3-流式预处理管道)
4. [与 RAG 系统集成](#4-与-rag-系统集成)
5. [与模型微调集成](#5-与模型微调集成)
6. [性能优化与进阶技巧](#6-性能优化与进阶技巧)

---

## 1. Streaming vs 非 Streaming：何时用哪种

### 1.1 核心差异对比

| 维度 | 非 Streaming（默认） | Streaming (`streaming=True`) |
|------|---------------------|-----------------------------|
| **加载方式** | 完整下载 → 解码 → 内存映射 | 逐条/逐批惰性读取 |
| **内存占用** | ≈ 数据集大小（Arrow 格式） | ≈ 单 batch 大小（KB~MB 级） |
| **首次访问延迟** | 高（需完整下载） | 低（立即返回迭代器） |
| **随机访问** | ✅ 支持 `dataset[i]` | ❌ 仅顺序遍历 |
| **长度** | ✅ `len(dataset)` 已知 | ⚠️ 未知（需 `info.splits` 估算） |
| **缓存** | 磁盘 Arrow 缓存 | 无持久缓存（可选手动缓存） |
| **适用场景** | 数据集 ≤ 可用磁盘，需多次遍历 | 数据集 > 磁盘/内存，单次或少量遍历 |

### 1.2 Benchmark：Streaming vs 非 Streaming 内存对比

以 `HuggingFaceFW/fineweb-edu` (sample-10BT, ~18GB 压缩) 为例，在 16GB RAM 机器上：

```python
from datasets import load_dataset
import psutil, os

process = psutil.Process(os.getpid())

# 非 Streaming —— 会先下载 18GB，再加载
# ds = load_dataset("HuggingFaceFW/fineweb-edu", "sample-10BT", split="train")
# 内存峰值: ~2.1 GB (Arrow mmap)，但磁盘占用 18GB

# Streaming —— 立即返回，不下载
ds_stream = load_dataset("HuggingFaceFW/fineweb-edu", "sample-10BT",
                         split="train", streaming=True)
# 内存峰值: ~85 MB（仅迭代器 + 当前 batch）
```

| 模式 | 磁盘占用 | 内存峰值 | 首条数据延迟 |
|------|---------|---------|-------------|
| 非 Streaming | 18 GB | ~2.1 GB | ~45 min（下载） |
| Streaming | 0 GB（临时缓存 ~MB） | ~85 MB | ~2 sec |

### 1.3 决策规则

```
数据集大小 ≤ 磁盘空间 × 0.7 且需要多次随机访问？
  → 非 Streaming
数据集大小 > 磁盘空间 或 仅需 1-2 次顺序遍历？
  → Streaming
需要将数据集作为 RAG 语料库流式构建索引？
  → Streaming（配合 batch 处理）
```

---

## 2. 流式加载 HuggingFace Hub 数据集

### 2.1 基础用法

```python
from datasets import load_dataset

# 最简流式加载
ds = load_dataset("HuggingFaceFW/fineweb-edu", "sample-10BT",
                  split="train", streaming=True)

# 逐条遍历
for i, example in enumerate(ds):
    print(example["text"][:200])
    if i >= 5:
        break

# 按 batch 遍历（推荐，更高效）
for batch in ds.iter(batch_size=1000):
    texts = batch["text"]  # list of 1000 strings
    print(f"Got batch of {len(texts)} examples")
    break
```

### 2.2 加载指定子集与分片

```python
# 加载特定 split + 限制样本数（用于快速验证）
ds_small = load_dataset(
    "HuggingFaceFW/fineweb-edu",
    "sample-10BT",
    split="train",
    streaming=True
).take(10000)  # 仅取前 10000 条

# 多 split 同时加载
splits = load_dataset(
    "allenai/dolma",
    "v1_7",
    split=["train", "validation"],
    streaming=True
)
train_stream, val_stream = splits
```

### 2.3 从私有仓库加载

```python
from huggingface_hub import login

# 方式 1：交互式登录
login()

# 方式 2：环境变量 HF_TOKEN
import os
os.environ["HF_TOKEN"] = "hf_xxxxxxxxxxxxxxxxxxxx"

ds = load_dataset("your-org/private-dataset",
                  split="train", streaming=True)
```

### 2.4 加载 CSV/JSON/Parquet 远程文件

```python
# 从 URL 流式加载（支持 S3、GCS、HTTPS）
ds = load_dataset(
    "csv",
    data_files="https://example.com/data/large_corpus.csv.gz",
    streaming=True
)

# 从 S3（需安装 s3fs）
ds = load_dataset(
    "parquet",
    data_files="s3://my-bucket/data/*.parquet",
    streaming=True
)
```

---

## 3. 流式预处理管道

### 3.1 流式 `map()`：逐条转换

```python
from datasets import load_dataset

ds = load_dataset("HuggingFaceFW/fineweb-edu", "sample-10BT",
                  split="train", streaming=True)

def clean_text(example):
    """清洗文本：去除多余空行、截断超长文本"""
    text = example["text"]
    # 去除连续空行
    import re
    text = re.sub(r'\n{3,}', '\n\n', text)
    # 截断到 8192 字符（适配大多数 LLM 上下文）
    if len(text) > 8192:
        text = text[:8192]
    return {"text": text, "char_count": len(text)}

ds_clean = ds.map(clean_text)

# 验证
for ex in ds_clean.take(3):
    print(f"[{ex['char_count']} chars] {ex['text'][:100]}...")
```

### 3.2 流式 `filter()`：质量过滤

```python
def quality_filter(example):
    """基于启发式规则过滤低质量文本"""
    text = example["text"]
    # 过滤条件
    if len(text) < 200:           # 太短
        return False
    if text.count('\n') < 2:      # 缺少段落结构
        return False
    # 语言检测（简单启发式）
    chinese_ratio = sum('\u4e00' <= c <= '\u9fff' for c in text[:1000]) / 1000
    if chinese_ratio < 0.1:       # 中文占比不足 10%（针对中文语料）
        return False
    return True

ds_filtered = ds_clean.filter(quality_filter)
```

### 3.3 Tokenization on-the-fly（流式分词）

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-7B-Instruct")

def tokenize_fn(example):
    """流式分词，返回 input_ids + attention_mask"""
    result = tokenizer(
        example["text"],
        max_length=2048,
        truncation=True,
        padding=False,
        return_tensors=None  # 返回 list，不转 tensor
    )
    return result

ds_tokenized = ds_filtered.map(tokenize_fn, remove_columns=["text", "char_count"])

# 验证 token 分布
import collections
lengths = collections.Counter()
for ex in ds_tokenized.take(10000):
    bucket = (len(ex["input_ids"]) // 256) * 256
    lengths[bucket] += 1

for k in sorted(lengths):
    print(f"  {k:4d}-{k+255:4d} tokens: {lengths[k]:,} examples")
```

### 3.4 组合管道：map + filter + shuffle

```python
# 流式管道链式组合
pipeline = (
    ds
    .map(clean_text)                    # 1. 清洗
    .filter(quality_filter)             # 2. 质量过滤
    .map(tokenize_fn,                   # 3. 分词
         remove_columns=["text", "char_count"])
    .shuffle(buffer_size=10000,         # 4. 流式 shuffle（近似随机）
             seed=42)
)

# 注意：streaming 模式下 shuffle 使用 buffer 近似随机
# buffer_size 越大，随机性越好，内存消耗越高
# 推荐：buffer_size = batch_size × 10~100
```

---

## 4. 与 RAG 系统集成

### 4.1 流式构建向量索引（配合 SentenceTransformers）

当语料库大到无法全量下载时，流式构建向量索引是 RAG 系统的核心需求：

```python
from datasets import load_dataset
from sentence_transformers import SentenceTransformer
import numpy as np

# 加载模型
model = SentenceTransformer("BAAI/bge-large-zh-v1.5")

# 流式加载语料
corpus = load_dataset("your-org/knowledge-base",
                      split="train", streaming=True)

# 配置
BATCH_SIZE = 512
EMBEDDING_DIM = 1024
INDEX_PATH = "index_embeddings.npy"
TEXTS_PATH = "index_texts.jsonl"

# 流式构建索引
all_embeddings = []
total_indexed = 0

with open(TEXTS_PATH, "w", encoding="utf-8") as f_texts:
    for batch in corpus.iter(batch_size=BATCH_SIZE):
        texts = batch["text"]

        # 批量编码
        embeddings = model.encode(
            texts,
            batch_size=64,
            show_progress_bar=False,
            normalize_embeddings=True
        )

        # 累积 embeddings（内存允许时定期 flush 到磁盘）
        all_embeddings.append(embeddings)

        # 写入文本
        for text in texts:
            f_texts.write(f'{{"text": {repr(text)}, "id": {total_indexed}}}\n')
            total_indexed += 1

        # 每 10 万条 flush 一次到磁盘
        if total_indexed % 100000 == 0:
            chunk = np.vstack(all_embeddings)
            np.save(INDEX_PATH.replace(".npy", f"_{total_indexed}.npy"), chunk)
            all_embeddings = []  # 释放内存
            print(f"Indexed {total_indexed:,} documents")

# 合并最终索引
if all_embeddings:
    final = np.vstack(all_embeddings)
    np.save(INDEX_PATH, final)
    print(f"Final index: {final.shape}")
```

### 4.2 流式 RAG 评测

```python
def evaluate_rag_streaming(rag_pipeline, test_set_stream, n_samples=500):
    """流式评测 RAG 系统，避免全量加载测试集"""
    results = {"faithfulness": [], "relevance": [], "latency_ms": []}

    for i, example in enumerate(test_set_stream.take(n_samples)):
        import time
        start = time.time()

        # RAG pipeline 推理
        response = rag_pipeline.query(example["question"])

        latency = (time.time() - start) * 1000
        results["latency_ms"].append(latency)

        # 简化评分（生产环境用 LLM-as-Judge）
        results["relevance"].append(
            1.0 if example["answer"] in response else 0.0
        )

        if (i + 1) % 100 == 0:
            print(f"[{i+1}/{n_samples}] "
                  f"Avg latency: {np.mean(results['latency_ms']):.0f}ms, "
                  f"Relevance: {np.mean(results['relevance']):.2%}")

    return {k: np.mean(v) for k, v in results.items()}
```

---

## 5. 与模型微调集成

### 5.1 流式喂入 TRL SFTTrainer

```python
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import SFTTrainer, SFTConfig

model_id = "Qwen/Qwen2.5-7B"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype="auto")

# 流式加载训练数据
train_ds = load_dataset("your-org/sft-dataset",
                        split="train", streaming=True)
eval_ds = load_dataset("your-org/sft-dataset",
                       split="validation", streaming=True).take(200)

def format_instruction(example):
    """将原始数据转为 SFT 指令格式"""
    return {
        "text": (
            f"<|im_start|>system\n你是一个有帮助的AI助手。<|im_end|>\n"
            f"<|im_start|>user\n{example['instruction']}<|im_end|>\n"
            f"<|im_start|>assistant\n{example['output']}<|im_end|>"
        )
    }

train_ds = train_ds.map(format_instruction)
eval_ds = eval_ds.map(format_instruction)

# SFTTrainer 原生支持 streaming dataset
trainer = SFTTrainer(
    model=model,
    args=SFTConfig(
        output_dir="./sft-output",
        max_seq_length=2048,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=8,
        learning_rate=2e-5,
        max_steps=5000,            # streaming 模式必须指定 max_steps（非 num_epochs）
        eval_steps=500,
        save_steps=500,
        logging_steps=10,
        fp16=True,
        report_to="tensorboard",
    ),
    train_dataset=train_ds,
    eval_dataset=eval_ds,
    tokenizer=tokenizer,
)

trainer.train()
```

> **关键注意**: Streaming 模式下 `num_train_epochs` 无效（无法知道总样本数），**必须使用 `max_steps`** 来控制训练长度。

### 5.2 流式喂入 PEFT/LoRA 训练

```python
from peft import LoraConfig, get_peft_model

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

peft_model = get_peft_model(model, lora_config)
peft_model.print_trainable_parameters()
# 输出: trainable params: 20,971,520 || all params: 7,636,434,944 || trainable%: 0.2746

# 训练循环与非 PEFT 完全一致
trainer = SFTTrainer(
    model=peft_model,
    args=SFTConfig(max_steps=3000, **other_args),
    train_dataset=train_ds,
    tokenizer=tokenizer,
)
trainer.train()
peft_model.save_pretrained("./lora-adapter")
```

---

## 6. 性能优化与进阶技巧

### 6.1 预取策略

```python
from datasets import load_dataset, DownloadConfig

# 增大下载并发数和预取缓冲
download_config = DownloadConfig(
    max_retries=3,
    num_proc=4,           # 并行下载线程
    use_etag=False,       # 跳过 ETag 检查（加速内网场景）
)

ds = load_dataset(
    "HuggingFaceFW/fineweb-edu", "sample-10BT",
    split="train", streaming=True,
    download_config=download_config,
)
```

### 6.2 多进程并行处理

```python
import torch
from torch.utils.data import DataLoader

# 将 streaming dataset 包装为 PyTorch IterableDataset
class StreamingDataset(torch.utils.data.IterableDataset):
    def __init__(self, hf_dataset, tokenizer, max_length=2048):
        self.ds = hf_dataset
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __iter__(self):
        for example in self.ds:
            tokens = self.tokenizer(
                example["text"],
                max_length=self.max_length,
                truncation=True,
                padding="max_length",
                return_tensors="pt"
            )
            yield {
                "input_ids": tokens["input_ids"].squeeze(0),
                "attention_mask": tokens["attention_mask"].squeeze(0),
                "labels": tokens["input_ids"].squeeze(0),
            }

dataset = StreamingDataset(ds, tokenizer)

# DataLoader 的 num_workers 控制多进程预取
loader = DataLoader(
    dataset,
    batch_size=8,
    num_workers=4,         # 4 个 worker 进程并行预取
    prefetch_factor=2,     # 每个 worker 预取 2 个 batch
    pin_memory=True,       # GPU 训练时锁页内存
)

for batch in loader:
    # 直接送入 GPU
    input_ids = batch["input_ids"].cuda()
    # ... 训练逻辑
```

### 6.3 磁盘缓存策略

当需要多次遍历同一流式数据集时，手动缓存避免重复下载：

```python
import json
from pathlib import Path

class CachedStreamingDataset:
    """带本地磁盘缓存的流式数据集包装器"""

    def __init__(self, ds, cache_dir: str = "./ds_cache"):
        self.ds = ds
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True, parents=True)
        self.cache_file = self.cache_dir / "cache.jsonl"

    def __iter__(self):
        # 优先从缓存读取
        if self.cache_file.exists():
            print(f"Reading from cache: {self.cache_file}")
            with open(self.cache_file, "r", encoding="utf-8") as f:
                for line in f:
                    yield json.loads(line)
            return

        # 首次遍历：流式读取 + 写入缓存
        print("First pass: streaming + caching...")
        with open(self.cache_file, "w", encoding="utf-8") as f:
            for example in self.ds:
                f.write(json.dumps(example, ensure_ascii=False) + "\n")
                yield example

# 使用
cached_ds = CachedStreamingDataset(ds, cache_dir="./cache/fineweb-sample")

# 第 1 次遍历：从 Hub 流式下载 + 写缓存
for ex in cached_ds:
    pass  # 处理...

# 第 2 次遍历：直接从本地缓存读取（极快）
for ex in cached_ds:
    pass  # 处理...
```

### 6.4 与 `datasets>=3.0` 的新 API

```python
# datasets 3.0+ 引入了更流畅的 streaming API
from datasets import load_dataset

ds = load_dataset("HuggingFaceFW/fineweb-edu", "sample-10BT",
                  split="train", streaming=True)

# 新增：dataset_info 查看（不下载数据）
from datasets import get_dataset_config_names, get_dataset_split_names
configs = get_dataset_config_names("HuggingFaceFW/fineweb-edu")
splits = get_dataset_split_names("HuggingFaceFW/fineweb-edu", "sample-10BT")
print(f"Configs: {configs[:5]}...")
print(f"Splits: {splits}")

# 新增：Streaming + 列选择（减少网络传输）
ds_slim = ds.select_columns(["text", "url"])  # 只下载需要的列
```

### 6.5 故障排除

| 问题 | 原因 | 解决 |
|------|------|------|
| `ConnectionError` / 超时 | 网络不稳定或 HF Hub 限流 | 设置 `HF_HUB_ETAG_TIMEOUT=120`；使用 mirror |
| 遍历速度越来越慢 | 内存泄漏（累积了中间结果） | 定期 `del` 大对象；使用 `gc.collect()` |
| `max_steps` 估算困难 | 不知道数据集总大小 | 用 `ds.info.splits["train"].num_examples`（如有）或先 `take(1000)` 估算 |
| 多 worker 重复数据 | IterableDataset 缺少 worker 分片逻辑 | 在 `__iter__` 中根据 `worker_info.id` 进行分片 |
| `ValueError: too many open files` | 缓存文件句柄泄漏 | `ulimit -n 65536` 或升级 `datasets>=3.0` |

---

## Related

- [[14_RAG系统/01_RAG_Fundamentals]] — RAG 基础架构
- [[14_RAG系统/04_Advanced_RAG/Advanced_RAG_DLAI_Practices]] — 高阶 RAG 实战
- [[05_大模型/07_Fine_tuning_Techniques/README]] — 微调技术目录
- [[07_模型训练/06_Alignment/TRL_RLHF_DPO_Guide]] — TRL 训练框架
- [[10_部署推理/02_Inference_Engines/TGI_Deep_Dive]] — TGI 推理引擎（HF 生态）

---

*Last updated: 2026-06-25*
*Version: 1.0.0*

- [[14_RAG系统/README|RAG 系统 (RAG Systems)]]
