---
title: "GPTCache (LLM 语义缓存引擎)"
category: -concepts
tags: ["caching", "llm", "semantic-similarity", "cost-optimization", "latency"]
relationships:
  - target: "概念/helicone"
    type: related_to
  - target: "概念/litellm"
    type: related_to
  - target: "概念/vllm"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "开源的 LLM 语义缓存引擎，通过向量相似度匹配缓存 Prompt-Response 对，在命中缓存时直接返回结果，大幅降低 API 成本与延迟。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
---

# GPTCache

[GPTCache](https://github.com/zilliztech/GPTCache) 是 [Zilliz](https://zilliz.com/)（Milvus 母公司）开源的 **LLM 语义缓存引擎**。与传统的精确匹配缓存不同，GPTCache 通过**向量嵌入**将 Prompt 转换为语义向量，使用**相似度搜索**找到语义相近的缓存 Prompt，命中时直接返回缓存的 Response——无需调用 LLM。这在大量重复或相似查询的场景下，可将 API 成本降低 **50-90%**，延迟从秒级降到毫秒级。

## 核心原理

```
GPTCache 工作流程:

用户 Prompt ──→ [Embedding 模型] ──→ 向量
                                      │
                              ┌───────▼───────┐
                              │ 向量数据库搜索  │
                              │ (Milvus/FAISS) │
                              └───────┬───────┘
                                      │
                         ┌────────────┼────────────┐
                         │            │            │
                      命中 (sim>阈值)              未命中
                         │                         │
                    返回缓存 Response         调用 LLM
                         │                         │
                      延迟 <10ms              ┌────▼────┐
                                              │  LLM    │
                                              └────┬────┘
                                                   │
                                            缓存 Response
                                            + 向量入库
```

## 核心特性

### 1. 语义缓存

```python
from gptcache import cache
from gptcache.adapter import openai

# 初始化缓存
cache.init(
    embedding_func=cache.embedding.Onnx().to_embeddings,  # 嵌入模型
    pre_embedding_func=cache.processor.pre.get_prompt,     # 预处理
    data_manager=cache.manager.get_data_manager(
        data_path="sqlite",
        vector_params={"dim": 384}  # 向量维度
    ),
    similarity_evaluation=cache.similarity_evaluation.OnnxBERTSimilarity()
)

# 设置 OpenAI 调用（自动走缓存）
openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "What is Python?"}]
)
# 首次: 调用 OpenAI → 缓存结果
# 第二次相似查询: 直接返回缓存 (<10ms)
```

### 2. 多种缓存后端

| 后端 | 向量存储 | KV 存储 | 适用场景 |
|------|----------|---------|----------|
| **SQLite + FAISS** | FAISS (内存) | SQLite | 开发/小规模 |
| **Milvus + MySQL** | Milvus | MySQL | 生产/大规模 |
| **Redis** | Redis | Redis | 低延迟 |
| **PostgreSQL** | pgvector | PostgreSQL | 一体化 |

### 3. 相似度评估策略

```python
# 策略 1: 精确匹配 (ExactMatch)
evaluation = cache.similarity_evaluation.ExactMatchEvaluation()

# 策略 2: OnnxBERT 语义相似度
evaluation = cache.similarity_evaluation.OnnxBERTSimilarity()

# 策略 3: 自定义阈值
from gptcache.similarity_evaluation.distance import SearchDistanceEvaluation
evaluation = SearchDistanceEvaluation(max_distance=0.5)
```

### 4. 缓存淘汰策略

```python
# LRU (最近最少使用)
cache.init(
    cache_enable_check=True,
    data_manager=cache.manager.get_data_manager(
        eviction="LRU",
        max_size=10000  # 最大缓存条目
    )
)
```

### 5. 与 LangChain 集成

```python
from langchain.cache import GPTCache as LangChainGPTCache
import gptcache

# LangChain 自动缓存
from langchain.globals import set_llm_cache
set_llm_cache(LangChainGPTCache())
```

## 缓存命中率优化

| 场景 | 精确缓存命中率 | GPTCache 命中率 |
|------|---------------|-----------------|
| **完全相同 Prompt** | 100% | 100% |
| **相似 Prompt** | 0% | 60-90% |
| **同义不同表达** | 0% | 40-70% |
| **RAG 重复查询** | 低 | 70-95% |
| **客服常见问题** | 低 | 80-95% |

## 成本节省估算

```
假设:
- GPT-4 API: $30/1M input tokens, $60/1M output tokens
- 日均请求: 10,000 次
- 平均 Token: 1000 input + 500 output
- 日成本: ~$600

GPTCache 缓存命中率 70%:
- 实际 API 调用: 3,000 次
- 日成本: ~$180
- 节省: $420/天 ≈ $12,600/月 (70% 节省)
```

## 典型应用场景

- **客服系统**: 相似问题直接命中缓存
- **RAG Pipeline**: 重复检索查询走缓存
- **开发/测试**: 大量相同 Prompt 的测试环境
- **API 代理**: 在多租户场景下共享缓存
- **数据分析**: 重复的分析查询

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gptcache
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: gptcache
        image: gptcache:latest
        ports:
        - containerPort: 8000
        env:
        - name: GPTCACHE_MILVUS_HOST
          value: "milvus-svc"
        - name: GPTCACHE_MILVUS_PORT
          value: "19530"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
---
apiVersion: v1
kind: Service
metadata:
  name: gptcache-svc
spec:
  selector:
    app: gptcache
  ports:
  - port: 8000
```

## 安装

```bash
pip install gptcache
```

## 参考资源

- [GPTCache GitHub](https://github.com/zilliztech/GPTCache)
- [GPTCache 文档](https://gptcache.readthedocs.io/)
- [Milvus](https://milvus.io/)

## 相关概念

- [[概念/helicone]] — Helicone LLM API 监控
- [[概念/litellm]] — LiteLLM 统一 LLM API 代理
- [[概念/milvus]] — Milvus 向量数据库
- [[概念/langsmith]] — LangSmith LLM 可观测性
