---
title: "模型服务模式 (Model Serving Patterns)"
category: "11-mlops-pipeline"
tags: ["model-serving", "online-inference", "batch-inference", "streaming", "model-routing", "mlops"]
summary: "> **一句话理解**: 模型服务模式决定了推理请求如何被处理——在线实时（低延迟）、批量离线（高吞吐）、流式处理（实时流数据），以及多模型路由策略（按任务/成本/延迟智能分流）。"
created: "2026-06-25"
updated: "2026-06-25"
tier: supporting
aliases:
  - "Model Serving Patterns"
  - Model_Serving_Patterns
sources: []

---
# 模型服务模式 (Model Serving Patterns)

> **一句话理解**: 选择正确的服务模式是 ML 系统架构的核心决策——在线实时追求低延迟，批量离线追求高吞吐，流式处理追求实时性。多模型路由则进一步优化成本和质量。

> **与 `10_部署推理/02_Inference_Engines/` 的边界**: 本文件聚焦 MLOps 视角的**架构模式与决策**，推理引擎目录聚焦具体引擎的**实现细节与调优**。

---

## 目录

1. [服务模式全景](#1-服务模式全景)
2. [在线实时推理 (Online/Real-time)](#2-在线实时推理-onlinereal-time)
3. [批量离线推理 (Batch)](#3-批量离线推理-batch)
4. [流式推理 (Streaming)](#4-流式推理-streaming)
5. [多模型路由策略](#5-多模型路由策略)
6. [模式选型决策](#6-模式选型决策)
7. [最佳实践](#7-最佳实践)
8. [常见问题](#8-常见问题)

---

## 1. 服务模式全景

### 1.1 三大模式对比

| 维度 | 在线实时 | 批量离线 | 流式处理 |
|------|---------|---------|---------|
| **延迟要求** | < 100ms - 2s | 分钟-小时 | < 1s（per record） |
| **吞吐量** | 单请求 | 百万级/批 | 持续流 |
| **触发方式** | API 调用 | 定时/事件触发 | 数据流驱动 |
| **资源利用** | 低（等待请求） | 高（满载处理） | 中（持续消费） |
| **典型场景** | 聊天、推荐、搜索 | 报表、离线评估、ETL | 实时监控、欺诈检测 |
| **扩展方式** | HPA (请求驱动) | 定时扩容 | 按 partition 扩展 |

### 1.2 架构位置

```
[用户/应用]
    │
    ├─ 在线请求 → [API Gateway] → [在线推理服务] → 响应
    │
    ├─ 批量任务 → [任务调度器] → [批量推理集群] → 结果存储
    │
    └─ 事件流   → [消息队列] → [流式推理消费者] → 下游系统
```

---

## 2. 在线实时推理 (Online/Real-time)

### 2.1 架构模式

```
客户端 → Load Balancer → Inference Pod (GPU)
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                [模型加载] [推理引擎] [后处理]
                (启动时)  (每请求)  (格式化)
```

### 2.2 关键设计决策

| 决策 | 选项 | 推荐 |
|------|------|------|
| 模型加载 | 启动时加载 vs 按需加载 | 启动时加载（避免冷启动） |
| 批处理 | 单请求 vs 动态 batching | 动态 batching（vLLM/SGLang 自动） |
| 缓存 | 无 vs Semantic Cache | Semantic Cache（重复查询节省 50%+ GPU） |
| 超时 | 固定 vs 自适应 | 自适应（基于 P99 历史数据） |
| 降级 | 报错 vs 返回缓存/默认值 | 返回上次成功响应（带 staleness 标记） |

### 2.3 动态 Batching

```python
import asyncio
import time

class DynamicBatcher:
    """将多个并发请求合并为一个 batch 推理"""

    def __init__(self, model, max_batch_size=32, max_wait_ms=50):
        self.model = model
        self.max_batch_size = max_batch_size
        self.max_wait_ms = max_wait_ms
        self.queue = asyncio.Queue()

    async def predict(self, request):
        future = asyncio.get_event_loop().create_future()
        await self.queue.put((request, future))
        return await future

    async def _batch_worker(self):
        while True:
            batch = []
            futures = []
            deadline = time.time() + self.max_wait_ms / 1000

            # 收集请求直到满 batch 或超时
            while len(batch) < self.max_batch_size and time.time() < deadline:
                try:
                    timeout = max(0, deadline - time.time())
                    req, fut = await asyncio.wait_for(
                        self.queue.get(), timeout=timeout
                    )
                    batch.append(req)
                    futures.append(fut)
                except asyncio.TimeoutError:
                    break

            if batch:
                # 批量推理
                results = self.model.predict_batch(batch)
                for result, future in zip(results, futures):
                    future.set_result(result)
```

### 2.4 Semantic Cache

```python
from sentence_transformers import SentenceTransformer
import numpy as np

class SemanticCache:
    """语义缓存：相似查询复用之前的回答"""

    def __init__(self, similarity_threshold=0.95, max_size=10000):
        self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
        self.threshold = similarity_threshold
        self.cache = {}  # hash → (embedding, response)
        self.embeddings = []  # 用于快速检索
        self.max_size = max_size

    def get(self, query: str):
        query_emb = self.encoder.encode([query])[0]
        for key, (cached_emb, response) in self.cache.items():
            similarity = np.dot(query_emb, cached_emb) / (
                np.linalg.norm(query_emb) * np.linalg.norm(cached_emb)
            )
            if similarity >= self.threshold:
                return response, similarity
        return None, 0.0

    def put(self, query: str, response: str):
        if len(self.cache) >= self.max_size:
            # LRU 淘汰
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
        query_emb = self.encoder.encode([query])[0]
        self.cache[hash(query)] = (query_emb, response)
```

---

## 3. 批量离线推理 (Batch)

### 3.1 适用场景

| 场景 | 数据规模 | 时效要求 |
|------|---------|---------|
| 全量数据重标注 | 百万-亿级 | 天级 |
| 离线评估/对比 | 万级测试集 | 小时级 |
| 定期 Embedding 更新 | 百万级文档 | 天级 |
| 数据管道中的推理步骤 | 持续产出 | 小时级 |

### 3.2 实现模式

```python
# 模式 1: 单机批量
from datasets import load_dataset

ds = load_dataset("my-dataset", split="test")
results = []

for batch in ds.iter(batch_size=64):
    outputs = model.predict_batch(batch["input"])
    results.extend(outputs)

# 模式 2: 分布式批量 (Ray)
import ray

@ray.remote(num_gpus=1)
def predict_shard(shard):
    model = load_model()
    return [model.predict(x) for x in shard]

# 分片
shards = split_dataset(ds, num_shards=8)
futures = [predict_shard.remote(s) for s in shards]
all_results = ray.get(futures)

# 模式 3: 云 API 批量 (OpenAI Batch API 等)
# 上传 JSONL → 提交任务 → 24h 内完成 → 下载结果
# 价格通常为在线 API 的 50%
```

### 3.3 资源规划

| 数据量 | GPU 类型 | 预计时间 | 成本估算 |
|--------|---------|---------|---------|
| 10K 条 × 2K tokens | 1× A10G | ~10 min | $0.15 |
| 100K 条 × 2K tokens | 4× A100 | ~30 min | $12 |
| 1M 条 × 2K tokens | 8× A100 | ~2 hr | $96 |
| 1M 条 (API Batch) | — | 24 hr | ~$200 |

---

## 4. 流式推理 (Streaming)

### 4.1 适用场景

- **实时欺诈检测**: 每笔交易实时评分
- **内容审核**: 用户发布内容实时过滤
- **IoT 异常检测**: 传感器数据流实时分析
- **实时推荐**: 用户行为流触发推荐更新

### 4.2 Kafka + 推理消费者

```python
from kafka import KafkaConsumer, KafkaProducer
import json

consumer = KafkaConsumer(
    "user-events",
    bootstrap_servers=["kafka:9092"],
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    group_id="model-serving-group",
    auto_offset_reset="latest",
)

producer = KafkaProducer(
    bootstrap_servers=["kafka:9092"],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

model = load_model()

for message in consumer:
    event = message.value

    # 实时推理
    prediction = model.predict(event["features"])

    # 发送到下游
    producer.send("predictions", {
        "event_id": event["id"],
        "prediction": prediction,
        "model_version": "v2.3.1",
        "latency_ms": 0,  # 填充实际值
    })
```

### 4.3 Spark Structured Streaming

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import FloatType

spark = SparkSession.builder.appName("streaming-inference").getOrCreate()

# 加载模型并广播
broadcast_model = spark.sparkContext.broadcast(load_model())

@udf(returnType=FloatType())
def predict_udf(features):
    return float(broadcast_model.value.predict([features])[0])

# 从 Kafka 读取流
stream = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "kafka:9092")
    .option("subscribe", "events")
    .load()
)

# 流式推理
predictions = stream.select(
    "value",
    predict_udf("features").alias("prediction")
)

# 写入下游
query = (
    predictions.writeStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "kafka:9092")
    .option("topic", "predictions")
    .option("checkpointLocation", "/tmp/checkpoint")
    .start()
)
```

---

## 5. 多模型路由策略

### 5.1 路由模式

| 路由策略 | 原理 | 适用场景 |
|---------|------|---------|
| **轮询** | 均匀分配到多个模型实例 | 负载均衡 |
| **能力路由** | 按任务类型路由到专门模型 | 多任务系统 |
| **成本路由** | 简单问题→小模型，复杂问题→大模型 | 成本优化 |
| **延迟路由** | 延迟敏感→快模型，非敏感→高质量模型 | SLA 差异化 |
| **A/B 路由** | 按比例分流到实验组 | Champion-Challenger |
| **降级路由** | 主模型超时/报错→备用模型 | 高可用 |

### 5.2 智能成本路由

```python
class CostRouter:
    """按问题复杂度智能选择模型"""

    def __init__(self):
        self.small_model = load_model("llama-8b")   # $0.05/1M tokens
        self.large_model = load_model("llama-70b")   # $0.20/1M tokens

    def estimate_complexity(self, messages: list) -> str:
        """启发式复杂度估计"""
        total_tokens = sum(len(m.get("content", "").split()) for m in messages)

        # 简单规则
        if total_tokens < 100 and not any(
            keyword in str(messages)
            for keyword in ["分析", "比较", "推理", "代码", "explain why"]
        ):
            return "simple"
        return "complex"

    def route(self, messages: list) -> dict:
        complexity = self.estimate_complexity(messages)

        if complexity == "simple":
            response = self.small_model.generate(messages)
            return {"model": "llama-8b", "response": response, "cost": "low"}
        else:
            response = self.large_model.generate(messages)
            return {"model": "llama-70b", "response": response, "cost": "high"}
```

### 5.3 降级路由 (Fallback)

```python
class FallbackRouter:
    """主模型不可用时自动降级"""

    def __init__(self):
        self.models = [
            ("primary", load_model("llama-70b"), 30),     # 30s 超时
            ("fallback", load_model("llama-8b"), 10),     # 10s 超时
            ("emergency", load_model("llama-3b"), 5),     # 5s 超时
        ]

    def predict(self, messages):
        for name, model, timeout in self.models:
            try:
                response = model.generate(messages, timeout=timeout)
                return {"model": name, "response": response}
            except TimeoutError:
                logger.warning(f"{name} 超时，尝试降级...")
                continue
            except Exception as e:
                logger.error(f"{name} 异常: {e}，尝试降级...")
                continue

        # 所有模型都不可用
        return {"model": "cache", "response": get_cached_response(messages)}
```

---

## 6. 模式选型决策

### 6.1 决策树

```
需要实时响应用户？
  ├─ 是 → 在线推理
  │     ├─ 高并发 (>100 QPS) → vLLM/SGLang + 动态 batching
  │     ├─ 低并发 (<10 QPS) → 单实例 + Semantic Cache
  │     └─ 混合大小模型 → 智能路由
  │
  └─ 否 → 数据驱动还是时间驱动？
        ├─ 数据驱动 (事件流) → 流式推理 (Kafka/Spark)
        └─ 时间驱动 (定时任务) → 批量推理 (Ray/分布式)
```

### 6.2 成本对比

| 模式 | 日均 100K 请求 | 日均 1M 请求 | 关键成本因素 |
|------|--------------|-------------|-------------|
| 在线（自建 GPU） | $50/天 | $500/天 | GPU 利用率（闲时浪费） |
| 在线（云 API） | $30/天 | $250/天 | token 单价 |
| 批量（自建） | $20/天 | $200/天 | 可延迟 → 填满 GPU |
| 批量（云 Batch API） | $15/天 | $150/天 | 半价但 24h 延迟 |

---

## 7. 最佳实践

1. **从在线推理开始**: MVP 阶段用单实例在线推理，验证后再优化
2. **Semantic Cache 是低成本高收益**: 对重复查询场景可节省 50%+ GPU 成本
3. **批量任务错峰执行**: 非紧急批量任务在 GPU 低峰时段（凌晨）运行
4. **流式推理要做幂等**: 消息可能重复消费，推理结果需要幂等写入
5. **路由策略要有监控**: 记录每次路由决策，分析模型选择是否合理
6. **降级方案必须预演**: 定期演练主模型宕机场景，验证降级链路

---

## 8. 常见问题

### Q1: 在线推理的 GPU 利用率很低怎么办？
使用动态 batching（vLLM/SGLang 自动支持）；或结合批量推理在闲时处理积压任务。

### Q2: 流式推理如何保证顺序性？
Kafka partition 内保证顺序。使用用户 ID 作为 partition key 确保同一用户的事件按序处理。

### Q3: 多模型路由增加了系统复杂度，值得吗？
对大规模系统（> 100K QPS）值得。典型收益：成本降低 30-50%，延迟降低 20-40%。

### Q4: Batch 推理失败如何重试？
将失败的分片记录到 dead letter queue，使用指数退避重试。Ray 原生支持 task retry。

### Q5: 如何处理推理服务的冷启动？
保持至少 1 个 warm Pod（不缩到 0）；或使用模型预热（startup probe 中发送预热请求）。

---

## Related

- [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide]] — 推理引擎选型
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive]] — vLLM 动态 Batching
- [[11_模型运维/06_CI_CD/Deployment_Strategies]] — 部署策略
- [[11_模型运维/09_Cost/Cost_Optimization_MLOps]] — MLOps 成本优化
- [[12_架构基建/11_AI_Gateway/README]] — AI Gateway 多模型路由

---

*Last updated: 2026-06-25*
*Version: 1.0.0*

- [[11_模型运维/README|MLOps 流水线 (MLOps Pipeline)]]
