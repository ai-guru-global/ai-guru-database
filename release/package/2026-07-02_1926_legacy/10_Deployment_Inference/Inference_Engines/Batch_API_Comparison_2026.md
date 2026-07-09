---
title: "LLM Batch API 完全指南: 批量推理的成本优化利器"
category: "10-deployment-inference"
tags: ["batch-api", "cost-optimization", "inference", "openai", "anthropic", "gemini", "deepseek", "async-processing"]
summary: "> **一句话理解**: Batch API 是 LLM 成本优化的最大杠杆——用 50% 的价格处理非实时任务，覆盖数据标注、评估、批量嵌入等场景，是生产系统降本的核心武器。"
created: 2026-06-15
updated: 2026-06-15
lifecycle: reviewed
tier: supporting
aliases:
  - "Batch Api Comparison 2026"
  - "Batch API Comparison 2026"
  - Batch_API_Comparison_2026

---
# LLM Batch API 完全指南: 批量推理的成本优化利器

> **一句话理解**: Batch API 是 LLM 成本优化的最大杠杆——用 50% 的价格处理非实时任务，覆盖数据标注、评估、批量嵌入等场景，是生产系统降本的核心武器。

---

## 目录

1. [什么是 Batch API](#1-什么是-batch-api)
2. [供应商对比](#2-供应商对比)
3. [架构模式](#3-架构模式)
4. [实现指南](#4-实现指南)
5. [最佳实践](#5-最佳实践)
6. [成本对比](#6-成本对比)
7. [选型决策](#7-选型决策)

---

## 1. 什么是 Batch API

### 1.1 定义

Batch API 是一种异步批量推理接口——将多个请求打包成一个批次提交，服务端在后台排队处理，完成后返回结果。与实时 API 的核心区别:

```
实时 API (Real-time)                Batch API (Async Batch)
═══════════════════                 ═══════════════════════

客户端 ──请求──> 服务端              客户端 ──批量文件──> 服务端
       <──响应──                          │
       (同步等待, 按需计费)                │ (后台排队处理)
                                         │
                                    客户端 <──结果文件──┘
                                    (异步回调, 50% 折扣)
```

### 1.2 核心价值

| 维度 | 实时 API | Batch API |
|------|---------|-----------|
| **延迟** | 秒级响应 | 分钟~小时级 |
| **价格** | 标准价 | 50% 折扣 (OpenAI) |
| **吞吐** | 受 rate limit 限制 | 高吞吐, 独立配额 |
| **适用场景** | 交互式应用 | 大规模离线处理 |
| **错误处理** | 即时重试 | 批量重试, 部分失败 |

### 1.3 典型使用场景

```
Batch API 最佳使用场景
═══════════════════════════════════════════════════════════════

✅ 数据标注 (Data Labeling)
   └─ 对 100 万条数据做情感分析/分类
   └─ 用 Batch API: $150 → $75, 省 50%

✅ 评估管线 (Evaluation Pipeline)
   └─ 对模型输出做 LLM-as-Judge 打分
   └─ 10 万条评估记录, 批量处理最经济

✅ 批量嵌入 (Embedding Generation)
   └─ RAG 系统的文档向量化
   └─ 百万级文档嵌入, 成本直降一半

✅ 内容生成 (Content Generation)
   └─ 批量生成产品描述/摘要/翻译
   └─ 非实时场景, 优先用 Batch

✅ 数据增强 (Data Augmentation)
   └─ 合成训练数据
   └─ 大规模 prompt → completion 转换

❌ 不适合的场景
   └─ 聊天机器人 (需要即时响应)
   └─ 实时代码补全 (延迟敏感)
   └─ 搜索增强 (用户在线等待)
```

---

## 2. 供应商对比

### 2.1 总览对比表

| 维度 | OpenAI Batch API | Anthropic Message Batches | Google Gemini Batch | DeepSeek Batch |
|------|-----------------|--------------------------|-------------------|---------------|
| **折扣** | 50% | 50% | 50% (GCP credits) | 动态折扣 |
| **最大批量** | 50,000 请求/文件 | 100,000 请求/批次 | 无硬性上限 | 50,000 请求 |
| **完成时间** | ≤24 小时 | ≤24 小时 | 数分钟~小时 | ≤24 小时 |
| **文件格式** | JSONL | JSONL | JSONL / BigQuery | JSONL |
| **支持模型** | GPT-4o, GPT-4o-mini, o1, embeddings | Claude 3.5 Sonnet, Claude 3 Opus/Sonnet | Gemini 1.5 Pro/Flash, Gemini 2.0 | DeepSeek-V3, DeepSeek-R1 |
| **错误处理** | 部分成功 | 部分成功 | 部分成功 | 部分成功 |
| **API 风格** | REST + SDK | REST + SDK | Vertex AI SDK | REST + SDK |
| **独立配额** | ✅ 与实时分离 | ✅ 与实时分离 | ✅ 专用配额 | ✅ 与实时分离 |

### 2.2 OpenAI Batch API

OpenAI 是 Batch API 的先行者, 2024 年 4 月推出, 生态最成熟。

```
OpenAI Batch API 架构
═══════════════════════════════════════════════════════

1. 上传 JSONL 文件
   ┌─────────────────────────────────────────────────┐
   │ {"custom_id": "req-1", "method": "POST",        │
   │  "url": "/v1/chat/completions",                 │
   │  "body": {"model": "gpt-4o",                    │
   │           "messages": [...]}}                   │
   │ {"custom_id": "req-2", ...}                     │
   │ ... (最多 50,000 行)                             │
   └─────────────────────────────────────────────────┘
                      │
                      ▼
2. 创建 Batch Job ──> file-abc123
                      │
                      ▼
3. 后台处理 (≤24h)    status: validating → in_progress → completed
                      │
                      ▼
4. 下载结果文件
   ┌─────────────────────────────────────────────────┐
   │ {"custom_id": "req-1", "response": {...}}       │
   │ {"custom_id": "req-2", "error": {...}}          │
   └─────────────────────────────────────────────────┘
```

**支持的端点**:

| 端点 | 模型示例 | 用途 |
|------|---------|------|
| `/v1/chat/completions` | GPT-4o, GPT-4o-mini | 文本生成/对话 |
| `/v1/embeddings` | text-embedding-3-large | 向量嵌入 |
| `/v1/completions` | gpt-3.5-turbo-instruct | 补全 (legacy) |

**Rate Limits (Batch)**:

| 模型 | Token 限额 (Batch) | 与实时对比 |
|------|-------------------|-----------|
| GPT-4o | 30M tokens/day | 独立配额, 不影响实时 |
| GPT-4o-mini | 150M tokens/day | 独立配额 |
| text-embedding-3-large | 数十亿 tokens/day | 几乎无限制 |

### 2.3 Anthropic Message Batches API

Anthropic 2024 年 10 月推出 Message Batches API, 与 OpenAI 对标。

```python
# Anthropic Batch API 核心流程
# 1. 创建批次 (内联请求, 无需单独上传文件)
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "req-1",
            "params": {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "..."}]
            }
        },
        # ... 最多 100,000 个请求
    ]
)
# 2. 轮询状态
# 3. 获取结果
```

**Anthropic 特点**:
- 内联请求定义 (无需先上传文件再引用)
- 支持所有 Claude 模型 (Claude 3.5 Sonnet, Claude 3 Opus 等)
- 50% 折扣, 与 OpenAI 一致
- 每批次最多 100,000 个请求

### 2.4 Google Gemini Batch Prediction

Google 通过 Vertex AI 提供 Batch Prediction, 深度集成 GCP 生态。

```
Vertex AI Batch Prediction 流程
═══════════════════════════════════════════════════════

选项 A: JSONL 文件 (GCS)
─────────────────────────
  gs://bucket/input.jsonl ──> BatchPredictionJob ──> gs://bucket/output.jsonl

选项 B: BigQuery 表
─────────────────────
  bq://project.dataset.input ──> BatchPredictionJob ──> bq://project.dataset.output
```

**Google 特点**:
- 深度集成 BigQuery, 适合数据密集型场景
- 支持 Gemini 1.5 Pro/Flash, Gemini 2.0 Flash
- 通过 GCP credits 可进一步降低成本
- 无硬性请求上限, 适合超大规模批处理

### 2.5 DeepSeek Batch API

DeepSeek 作为国产大模型的性价比标杆, 也提供 Batch API。

```python
# DeepSeek Batch API (与 OpenAI 格式兼容)
import openai

client = openai.OpenAI(
    api_key="sk-deepseek-xxx",
    base_url="https://api.deepseek.com/batch"
)
# 使用方式与 OpenAI Batch API 几乎一致
```

**DeepSeek 特点**:
- API 格式与 OpenAI 兼容, 迁移成本极低
- 基础价格本就极低 (DeepSeek-V3: $0.27/1M input), Batch 再打折
- 支持 DeepSeek-V3, DeepSeek-R1
- 适合对成本极度敏感的场景

### 2.6 开源方案: 自建 Batch 处理

对于需要自部署的场景, 可以用推理引擎自带的 batch 能力:

| 方案 | Batch 模式 | 特点 |
|------|-----------|------|
| **vLLM** | `--enable-chunked-prefill` + 连续批处理 | 最高吞吐, GPU 利用率 90%+ |
| **TGI** | `--max-batch-prefill-tokens` | HuggingFace 生态, 简单易用 |
| **SGLang** | RadixAttention + 连续批处理 | 结构化生成优化 |
| **TensorRT-LLM** | In-flight batching | NVIDIA 极致优化 |

> **关联**: 自建 batch 服务的详细方案参见 [[部署推理/Inference_Engines/vLLM_Deep_Dive|vLLM 深度解析]] 和 [[部署推理/Inference_Engines/TGI_Deep_Dive|TGI 深度解析]]

---

## 3. 架构模式

### 3.1 异步批处理管线

最经典的模式: 提交 → 轮询 → 收集结果。

```
异步批处理管线架构
═══════════════════════════════════════════════════════════════

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  数据准备     │────>│  批次提交     │────>│  状态监控     │
│  (JSONL 生成) │     │  (Batch API)  │     │  (Polling)    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  结果存储     │<────│  结果解析     │<────│  结果下载     │
│  (DB/S3)     │     │  (错误分离)   │     │  (JSONL)     │
└──────────────┘     └──────────────┘     └──────────────┘
```

### 3.2 Batch + Streaming 混合模式

对于需要部分实时反馈的场景, 可以混合使用:

```
混合架构: Batch + Streaming
═══════════════════════════════════════════════════════════════

                    ┌─────────────────────────────┐
                    │         请求路由器            │
                    │   (按延迟敏感度分流)          │
                    └─────────┬──────────┬─────────┘
                              │          │
                   延迟敏感    │          │  非延迟敏感
                              ▼          ▼
                    ┌──────────────┐  ┌──────────────┐
                    │  实时 API     │  │  Batch API   │
                    │  (标准价格)   │  │  (50% 折扣)  │
                    └──────────────┘  └──────────────┘
                              │          │
                              ▼          ▼
                    ┌─────────────────────────────┐
                    │         结果合并层            │
                    └─────────────────────────────┘

路由策略:
  • 用户交互式请求 → 实时 API (秒级响应)
  • 后台数据处理   → Batch API (小时级, 省 50%)
  • 定时任务       → Batch API (夜间批量处理)
```

### 3.3 错误处理与重试策略

```
错误处理决策树
═══════════════════════════════════════════════════════════════

Batch 结果返回
       │
       ├── 成功请求 ──────────────────> 写入结果表
       │
       └── 失败请求
              │
              ├── 429 (Rate Limit) ───> 加入重试队列 (指数退避)
              │
              ├── 500 (Server Error) ──> 加入重试队列 (最多 3 次)
              │
              ├── 400 (Bad Request) ───> 记录错误, 跳过 (数据问题)
              │
              └── 超时 ────────────────> 加入重试队列 (降低 batch 大小)
```

### 3.4 何时选择 Batch vs 实时

```
选型决策矩阵
═══════════════════════════════════════════════════════════════

                    延迟要求
                    低 (< 1s)          高 (> 1min OK)
                ┌─────────────────┬─────────────────┐
  请求量  低     │  实时 API       │  实时 API       │
         (<1K)  │  (简单直接)      │  (没必要用batch) │
                ├─────────────────┼─────────────────┤
         高     │  实时 API       │  Batch API      │
         (>10K) │  (流式处理)      │  ⭐ 最佳选择     │
                └─────────────────┴─────────────────┘

判断标准:
  ✅ 用 Batch API:
     • 延迟容忍 > 1 小时
     • 请求量 > 1,000
     • 成本敏感
     • 可以接受部分失败

  ❌ 用实时 API:
     • 用户在线等待
     • 请求量小 (< 100)
     • 延迟 < 1 秒
     • 需要流式输出
```

---

## 4. 实现指南

### 4.1 OpenAI Batch API 完整示例

```python
import openai
import json
import time

client = openai.OpenAI()

# ========== Step 1: 准备 JSONL 文件 ==========
def prepare_batch_file(tasks: list[dict], output_path: str):
    """将任务列表转换为 Batch API 要求的 JSONL 格式"""
    with open(output_path, "w") as f:
        for i, task in enumerate(tasks):
            request = {
                "custom_id": f"task-{i}",
                "method": "POST",
                "url": "/v1/chat/completions",
                "body": {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": task["system_prompt"]},
                        {"role": "user", "content": task["user_input"]},
                    ],
                    "max_tokens": 1024,
                },
            }
            f.write(json.dumps(request) + "\n")

# 示例: 批量情感分析
tasks = [
    {
        "system_prompt": "判断以下文本的情感: positive/negative/neutral",
        "user_input": "这个产品太好用了, 强烈推荐!",
    },
    {
        "system_prompt": "判断以下文本的情感: positive/negative/neutral",
        "user_input": "质量很差, 用了一天就坏了",
    },
    # ... 更多任务
]
prepare_batch_file(tasks, "batch_input.jsonl")

# ========== Step 2: 上传文件 ==========
batch_file = client.files.create(
    file=open("batch_input.jsonl", "rb"),
    purpose="batch",
)
print(f"文件 ID: {batch_file.id}")

# ========== Step 3: 创建 Batch Job ==========
batch_job = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
    metadata={"description": "情感分析批量任务"},
)
print(f"Batch Job ID: {batch_job.id}")
print(f"状态: {batch_job.status}")

# ========== Step 4: 轮询状态 ==========
while True:
    batch_job = client.batches.retrieve(batch_job.id)
    print(f"状态: {batch_job.status}, 进度: {batch_job.request_counts}")
    if batch_job.status in ("completed", "failed", "expired"):
        break
    time.sleep(60)  # 每分钟检查一次

# ========== Step 5: 获取结果 ==========
if batch_job.status == "completed":
    result_file = client.files.content(batch_job.output_file_id)
    results = [
        json.loads(line)
        for line in result_file.text.strip().split("\n")
    ]
    for result in results:
        custom_id = result["custom_id"]
        if result.get("error"):
            print(f"{custom_id}: 错误 - {result['error']}")
        else:
            content = result["response"]["body"]["choices"][0]["message"]["content"]
            print(f"{custom_id}: {content}")
```

### 4.2 Anthropic Message Batches 示例

```python
import anthropic

client = anthropic.Anthropic()

# ========== 创建批次 (内联请求) ==========
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "sentiment-1",
            "params": {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 100,
                "messages": [
                    {
                        "role": "user",
                        "content": "判断情感: '这个产品太好用了' → positive/negative/neutral",
                    }
                ],
            },
        },
        {
            "custom_id": "sentiment-2",
            "params": {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 100,
                "messages": [
                    {
                        "role": "user",
                        "content": "判断情感: '质量很差' → positive/negative/neutral",
                    }
                ],
            },
        },
        # ... 最多 100,000 个请求
    ],
)

print(f"Batch ID: {batch.id}")
print(f"状态: {batch.processing_status}")

# ========== 轮询结果 ==========
import time

while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    time.sleep(30)

# ========== 获取结果 ==========
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        content = result.result.message.content[0].text
        print(f"{result.custom_id}: {content}")
    else:
        print(f"{result.custom_id}: {result.result.type}")
```

### 4.3 Google Vertex AI Batch Prediction 示例

```python
from google.cloud import aiplatform

aiplatform.init(project="my-project", location="us-central1")

# ========== 方式 A: JSONL 文件输入 ==========
batch_job = aiplatform.BatchPredictionJob.create(
    job_name="batch-sentiment-analysis",
    model_name="publishers/google/models/gemini-1.5-flash",
    gcs_source="gs://my-bucket/input.jsonl",
    gcs_destination_prefix="gs://my-bucket/output/",
    machine_type="n1-standard-4",
)

# ========== 方式 B: BigQuery 输入 ==========
batch_job = aiplatform.BatchPredictionJob.create(
    job_name="batch-sentiment-bq",
    model_name="publishers/google/models/gemini-1.5-flash",
    bigquery_source="bq://project.dataset.input_table",
    bigquery_destination_prefix="bq://project.dataset.output_table",
)

# 等待完成
batch_job.wait()
print(f"状态: {batch_job.state}")
print(f"输出: {batch_job.output_info}")
```

### 4.4 统一抽象层

在实际项目中, 建议封装统一的 Batch 接口:

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum

class BatchStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    PARTIAL = "partial"

@dataclass
class BatchRequest:
    id: str
    messages: list[dict]
    model: str
    max_tokens: int = 1024

@dataclass
class BatchResult:
    id: str
    content: str | None
    error: str | None
    token_usage: dict | None

class BatchProvider(ABC):
    """统一的 Batch API 抽象接口"""

    @abstractmethod
    def submit(self, requests: list[BatchRequest]) -> str:
        """提交批次, 返回 batch_id"""

    @abstractmethod
    def status(self, batch_id: str) -> BatchStatus:
        """查询批次状态"""

    @abstractmethod
    def results(self, batch_id: str) -> list[BatchResult]:
        """获取批次结果"""

    @abstractmethod
    def cancel(self, batch_id: str) -> bool:
        """取消批次"""

# 使用示例
provider: BatchProvider = OpenAIBatchProvider()  # 或 AnthropicBatchProvider()
batch_id = provider.submit(requests)
# ... 等待 ...
results = provider.results(batch_id)
```

---

## 5. 最佳实践

### 5.1 大批次分片策略

```
批次分片策略
═══════════════════════════════════════════════════════════════

输入: 200,000 条请求
       │
       ▼
  ┌─────────────────────────────────────────┐
  │           分片逻辑                       │
  │  • OpenAI: 每文件最多 50,000 条          │
  │  • Anthropic: 每批次最多 100,000 条      │
  │  • 建议: 即使支持更多, 也分片以降低风险    │
  └─────────┬────────────┬────────────┬─────┘
            │            │            │
            ▼            ▼            ▼
     ┌──────────┐ ┌──────────┐ ┌──────────┐
     │ Batch 1  │ │ Batch 2  │ │ Batch 3  │
     │ 50K 条   │ │ 50K 条   │ │ 50K 条   │
     └──────────┘ └──────────┘ └──────────┘
            │            │            │
            ▼            ▼            ▼
     并行提交, 分别监控, 结果合并

好处:
  1. 单批次失败不影响其他
  2. 可以逐步获取结果 (先完成的先处理)
  3. 避免单批次过大导致超时
  4. 更细粒度的进度监控
```

### 5.2 监控进度

```python
import asyncio
from datetime import datetime

class BatchMonitor:
    def __init__(self, provider: BatchProvider, batch_ids: list[str]):
        self.provider = provider
        self.batch_ids = batch_ids
        self.start_time = datetime.now()

    async def monitor(self):
        """监控多个批次的进度"""
        while True:
            statuses = {
                bid: self.provider.status(bid)
                for bid in self.batch_ids
            }
            completed = sum(
                1 for s in statuses.values()
                if s == BatchStatus.COMPLETED
            )
            elapsed = (datetime.now() - self.start_time).total_seconds()
            print(
                f"[{elapsed:.0f}s] 进度: {completed}/{len(self.batch_ids)} 批次完成"
            )
            if all(s == BatchStatus.COMPLETED for s in statuses.values()):
                print("所有批次完成!")
                break
            await asyncio.sleep(60)
```

### 5.3 处理部分失败

```python
def handle_batch_results(
    results: list[BatchResult],
    retry_queue: list[BatchRequest],
) -> tuple[list[dict], list[dict]]:
    """分离成功和失败的结果, 失败的加入重试队列"""
    succeeded = []
    failed = []

    for result in results:
        if result.error:
            failed.append({
                "id": result.id,
                "error": result.error,
                "retryable": _is_retryable(result.error),
            })
            if _is_retryable(result.error):
                retry_queue.append(
                    BatchRequest(
                        id=f"retry-{result.id}",
                        messages=result.messages,
                        model=result.model,
                    )
                )
        else:
            succeeded.append({
                "id": result.id,
                "content": result.content,
            })

    print(f"成功: {len(succeeded)}, 失败: {len(failed)}, 可重试: {len(retry_queue)}")
    return succeeded, failed

def _is_retryable(error: str) -> bool:
    """判断错误是否可重试"""
    retryable_codes = ["429", "500", "502", "503", "504"]
    return any(code in error for code in retryable_codes)
```

### 5.4 成本预估

```python
def estimate_batch_cost(
    num_requests: int,
    avg_input_tokens: int,
    avg_output_tokens: int,
    model: str = "gpt-4o-mini",
) -> dict:
    """预估 Batch API 成本"""
    # 2026 年价格 (USD per 1M tokens)
    pricing = {
        "gpt-4o": {"input": 2.50, "output": 10.00},
        "gpt-4o-mini": {"input": 0.15, "output": 0.60},
        "claude-3-5-sonnet": {"input": 3.00, "output": 15.00},
    }

    if model not in pricing:
        raise ValueError(f"不支持的模型: {model}")

    price = pricing[model]
    batch_discount = 0.5  # 50% 折扣

    input_cost = num_requests * avg_input_tokens * price["input"] / 1_000_000
    output_cost = num_requests * avg_output_tokens * price["output"] / 1_000_000
    real_time_total = input_cost + output_cost
    batch_total = real_time_total * batch_discount

    return {
        "model": model,
        "requests": num_requests,
        "real_time_cost": f"${real_time_total:.2f}",
        "batch_cost": f"${batch_total:.2f}",
        "savings": f"${real_time_total - batch_total:.2f}",
        "savings_pct": f"{(1 - batch_discount) * 100:.0f}%",
    }

# 示例
print(estimate_batch_cost(
    num_requests=100_000,
    avg_input_tokens=500,
    avg_output_tokens=200,
    model="gpt-4o-mini",
))
# {'model': 'gpt-4o-mini', 'requests': 100000,
#  'real_time_cost': '$19.50', 'batch_cost': '$9.75',
#  'savings': '$9.75', 'savings_pct': '50%'}
```

---

## 6. 成本对比

### 6.1 各供应商 Batch vs 实时价格

| 模型 | 实时价格 (Input/1M) | Batch 价格 (Input/1M) | 节省 |
|------|--------------------|-----------------------|------|
| GPT-4o | $2.50 | $1.25 | 50% |
| GPT-4o-mini | $0.15 | $0.075 | 50% |
| Claude 3.5 Sonnet | $3.00 | $1.50 | 50% |
| Claude 3 Opus | $15.00 | $7.50 | 50% |
| Gemini 1.5 Flash | $0.075 | $0.0375 | 50% |
| DeepSeek-V3 | $0.27 | ~$0.14 | ~50% |

### 6.2 典型场景成本计算

```
场景: 10 万条数据的情感分析
═══════════════════════════════════════════════════════════════

假设: 平均输入 300 tokens, 输出 50 tokens

┌─────────────────┬──────────┬──────────┬──────────┬──────────┐
│ 模型            │ 实时成本  │ Batch 成本│ 节省金额  │ 节省比例  │
├─────────────────┼──────────┼──────────┼──────────┼──────────┤
│ GPT-4o          │ $125.00  │ $62.50   │ $62.50   │ 50%      │
│ GPT-4o-mini     │ $7.80    │ $3.90    │ $3.90    │ 50%      │
│ Claude 3.5 Son. │ $150.00  │ $75.00   │ $75.00   │ 50%      │
│ DeepSeek-V3     │ $13.50   │ $6.75    │ $6.75    │ 50%      │
└─────────────────┴──────────┴──────────┴──────────┴──────────┘

场景: 100 万条文档嵌入
═══════════════════════════════════════════════════════════════

假设: 平均每条 512 tokens

┌────────────────────────┬──────────┬──────────┬──────────┐
│ 模型                   │ 实时成本  │ Batch 成本│ 节省金额  │
├────────────────────────┼──────────┼──────────┼──────────┤
│ text-embedding-3-large │ $130.00  │ $65.00   │ $65.00   │
│ text-embedding-3-small │ $10.00   │ $5.00    │ $5.00    │
└────────────────────────┴──────────┴──────────┴──────────┘
```

### 6.3 自建 vs 托管 Batch 成本

| 维度 | 托管 Batch API | 自建 (vLLM/TGI) |
|------|---------------|-----------------|
| **硬件成本** | 0 (按需付费) | GPU 租赁 $1-3/hr |
| **运维成本** | 0 | 需要 DevOps |
| **灵活性** | 受限于供应商模型 | 任意开源模型 |
| **数据隐私** | 数据发送到第三方 | 数据不出境 |
| **适用规模** | 中小规模 | 大规模持续运行 |
| **盈亏平衡点** | - | ~50M tokens/天 |

> **关联**: 自建推理的成本分析参见 [[部署推理/Cost/LLM_Cost_Optimization|LLM 成本优化完全指南]]

---

## 7. 选型决策

### 7.1 供应商选择指南

```
Batch API 供应商选择决策树
═══════════════════════════════════════════════════════════════

Q1: 数据是否可以出境?
    │
    ├── 否 ──> DeepSeek Batch API / 自建 vLLM
    │
    └── 是
         │
         Q2: 是否已在 GCP 生态?
              │
              ├── 是 ──> Google Gemini Batch (Vertex AI)
              │         (BigQuery 集成, GCP credits 可用)
              │
              └── 否
                   │
                   Q3: 需要最强模型能力?
                        │
                        ├── 是 ──> OpenAI Batch API
                        │         (GPT-4o/o1, 生态最成熟)
                        │
                        └── 否
                             │
                             Q4: 需要长上下文/代码理解?
                                  │
                                  ├── 是 ──> Anthropic Message Batches
                                  │         (Claude 3.5 Sonnet, 200K context)
                                  │
                                  └── 否 ──> 成本优先:
                                             DeepSeek (最便宜)
                                             GPT-4o-mini (最便宜的顶级模型)
```

### 7.2 迁移检查清单

从实时 API 迁移到 Batch API 时, 逐项检查:

```
迁移检查清单
═══════════════════════════════════════════════════════════════

□ 延迟要求: 确认业务场景可以接受 > 1 小时的延迟
□ 错误处理: 实现部分失败的处理逻辑
□ 进度监控: 建立批次状态轮询机制
□ 结果解析: 处理 JSONL 格式的返回结果
□ 重试逻辑: 可重试错误的自动重试机制
□ 配额管理: 了解供应商的 Batch 配额限制
□ 文件管理: JSONL 文件的生成、上传、清理流程
□ 日志审计: 记录每个批次的提交时间、完成时间、成功率
□ 成本监控: 跟踪 Batch API 的实际支出
□ 回退方案: 如果 Batch API 不可用, 能否回退到实时 API
```

### 7.3 常见陷阱

| 陷阱 | 描述 | 解决方案 |
|------|------|---------|
| **超时未处理** | 24 小时内未完成的批次会过期 | 设置告警, 拆分大批次 |
| **格式错误** | JSONL 格式不合规导致整个批次失败 | 提交前验证格式 |
| **配额误解** | Batch 配额与实时配额是独立的 | 查阅文档确认 |
| **结果遗漏** | 只检查了成功结果, 忽略了失败条目 | 总是解析 error 字段 |
| **成本误算** | 忘记输出 token 通常比输入贵 | 分别计算 input/output 成本 |

---

## 相关页面

- [[部署推理/Cost/LLM_Cost_Optimization|LLM 成本优化完全指南]] — Batch API 是成本优化的核心策略之一
- [[部署推理/Inference_Engines/vLLM_Deep_Dive|vLLM 深度解析]] — 自建 Batch 服务的首选推理引擎
- [[部署推理/Deployment_Inference_2026|部署推理 2026 趋势]] — 整体推理部署趋势与技术选型
- [[部署推理/Inference_Engines/TGI_Deep_Dive|TGI 深度解析]] — HuggingFace 生态的 Batch 推理方案
- [[部署推理/Caching/Prompt_Caching_and_KV_Cache_Optimization|Prompt Caching]] — 与 Batch API 互补的成本优化手段
