---
title: "RAG 语义缓存 (GPTCache / Redis Semantic Cache / 2025-2026 新方案)"
category: concepts
tags:
  - rag
  - semantic-cache
  - gptcache
  - redis-semantic-cache
  - llm-cache
  - cache-embedding
  - cache-hit-rate
aliases:
  - RAG Semantic Cache
  - GPTCache
  - Redis Semantic Cache
  - LLM Semantic Cache
  - Semantic Cache
relationships:
  - target: "概念/rag-systems"
    type: extends
  - target: "概念/embedding-models"
    type: related_to
  - target: "概念/vector-database"
    type: related_to
  - target: "概念/gptcache"
    type: related_to
summary: "RAG 语义缓存是 2023-2026 突破"重复查询浪费 LLM 调用"的关键基础设施——用 Embedding 相似度判断查询是否"语义相同",命中缓存直接返回。GPTCache / Redis Semantic Cache / LangChain Cache 在生产环境节省 30-70% LLM 成本,把延迟从秒级降到毫秒级。"
lifecycle: reviewed
t tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "RAG 语义缓存"
---

# RAG 语义缓存

> 中文简称：RAG 语义缓存

> **一句话理解**:RAG 语义缓存让"用户问'今天天气怎样?'和'现在天气如何?'"共用一个 LLM 响应——用 Embedding 相似度判断语义一致性,命中缓存毫秒级返回,未命中走 RAG。生产环境命中率 30-70%,成本可降 50%+,延迟降 10-100x。

---

## 一、为什么需要语义缓存?

传统精确缓存的问题:
- "今天天气怎样" ≠ "现在天气如何" → 都 miss
- 用户表达多样,精确匹配命中率 < 5%

LLM 调用痛点:
- 成本高(每千 token $0.01-0.1)
- 延迟大(2-10s)
- 重复查询浪费资源
- 并发高时易触发限流

语义缓存解法:
- 用 Embedding 把查询编码成向量
- 向量相似度 > 阈值 → 命中
- 返回缓存的 RAG 答案

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 语义缓存 | Semantic Cache | 语义相似度匹配 |
| 精确缓存 | Exact Cache | 字面相同才命中 |
| 缓存命中 | Cache Hit | 命中缓存 |
| 缓存未命中 | Cache Miss | 走 RAG |
| 命中率 | Hit Rate | 命中数 / 总查询数 |
| 相似度阈值 | Similarity Threshold | 判定命中的相似度 |
| 缓存键 | Cache Key | 查询的唯一标识 |
| 缓存值 | Cache Value | 答案 + 元数据 |
| 嵌入向量 | Embedding Vector | 查询编码 |
| 余弦相似度 | Cosine Similarity | 经典相似度 |
| LRU 淘汰 | LRU Eviction | 最近最少使用淘汰 |
| TTL | Time to Live | 缓存有效期 |
| 缓存预热 | Cache Warmup | 主动填充缓存 |
| 缓存穿透 | Cache Penetration | 永远 miss |
| 缓存击穿 | Cache Breakdown | 热点过期 |
| 缓存雪崩 | Cache Avalanche | 大量同时失效 |
| 分布式缓存 | Distributed Cache | Redis / Memcached |
| 向量缓存 | Vector Cache | 存储查询向量 |
| 多级缓存 | Multi-Level Cache | L1/L2/L3 |
| 缓存污染 | Cache Pollution | 低质答案污染 |
| 缓存审计 | Cache Audit | 答案质量评估 |
| 失效策略 | Invalidation | 文档变更时清缓存 |
| 增量更新 | Incremental Update | 只更新变化部分 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 厂商/团队 | 存储 | 特色 | 性能 | 许可证 |
|---|---|---|---|---|---|
| **GPTCache** | zilliztech | SQLite/Postgres/Milvus | 成熟、生产级 | 高 | Apache 2.0 |
| **Redis Semantic Cache** | Redis | Redis Stack + Vector Search | 已有 Redis 友好 | 中 | 商业 / RSAL |
| **LangChain Cache** | LangChain | InMemory/Redis/SQLite | 框架集成 | 中 | MIT |
| **LlamaIndex Cache** | LlamaIndex | 多种后端 | 框架集成 | 中 | MIT |
| **Semantic Cache(Vertex)** | Google Cloud | 托管 | 企业级 | 高 | 商业 |
| **Azure AI Cache** | Microsoft | 托管 | 企业级 | 高 | 商业 |
| **Memcached + BERT** | 自建 | Memcached | 简单 | 中 | Apache 2.0 |
| **vLLM Prefix Cache** | vLLM | 显存 | 系统级 | 极高 | Apache 2.0 |
| **LiteLLM Cache** | BerriAI | 多种后端 | 代理级 | 中 | MIT |
| **Caching 2026: SGLang Radix** | LMSYS | GPU 显存 | 自动前缀共享 | 极高 | Apache 2.0 |
| **Mem0 Semantic Cache** | Mem0 | 多种 | 长期记忆 + 缓存 | 中 | Apache 2.0 |

---

## 四、GPTCache 实战(开源主流)

### 4.1 安装

```bash
pip install gptcache
```

### 4.2 配置

```python
from gptcache import Cache
from gptcache.adapter.api import get, put
from gptcache.embedding import Onnx
from gptcache.manager import CacheBase, VectorBase, get_data_manager
from gptcache.similarity_evaluation.distance import SearchDistanceEvaluation

# 嵌入模型
onnx = Onnx()

# 缓存存储(SQLite)
cache_base = CacheBase("sqlite")
# 向量存储(Milvus)
vector_base = VectorBase("milvus", dimension=onnx.dimension)
data_manager = get_data_manager(cache_base, vector_base)

# 相似度评估
evaluation = SearchDistanceEvaluation()

# 初始化
cache = Cache()
cache.init(
    embedding_func=onnx.to_embeddings,
    data_manager=data_manager,
    similarity_evaluation=evaluation,
    config=Config(similarity_threshold=0.85),
)
```

### 4.3 使用

```python
from gptcache import cache

# 报告
def report_user_question(question: str) -> str:
    # 查缓存
    cached_answer = cache.get(question)
    if cached_answer:
        return cached_answer
    
    # 走 RAG
    answer = rag_chain.run(question)
    
    # 写缓存
    cache.put(question, answer)
    return answer
```

### 4.4 性能

- **命中率**:30-70%(生产环境)
- **命中延迟**:5-20ms
- **未命中延迟**:2-10s
- **成本节省**:50%+
- **相似度阈值**:0.85 平衡召回与精度

---

## 五、Redis Semantic Cache 实战

### 5.1 安装 Redis Stack

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

### 5.2 配置 LangChain

```python
from langchain.cache import RedisSemanticCache
from langchain_openai import OpenAIEmbeddings
from langchain.globals import set_llm_cache

# 初始化
set_llm_cache(RedisSemanticCache(
    redis_url="redis://localhost:6379",
    embedding=OpenAIEmbeddings(),
    score_threshold=0.85,  # 相似度阈值
))

# 使用(透明集成)
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o")
llm.invoke("今天天气怎样?")  # 走 RAG + 写缓存
llm.invoke("现在天气如何?")  # 命中缓存,毫秒级返回
```

---

## 六、vLLM Prefix Cache / SGLang Radix(系统级)

### 6.1 vLLM Prefix Cache

- 自动缓存 system prompt + 文档前缀
- 同前缀查询共享 KV Cache
- 命中率 60-80%,延迟降 5x

### 6.2 SGLang RadixAttention

- 基数树结构管理前缀
- 自动 LRU 淘汰
- 多请求共享 KV
- 性能提升 5-10x

### 6.3 实战

```python
import sglang as sgl

@sgl.function
def multi_turn(s, question):
    s += system_prompt  # 自动缓存
    s += user(question)

runtime = sgl.Runtime(model_path="meta-llama/Meta-Llama-3-70B")
result = multi_turn.run(runtime, question="...")
```

---

## 七、生产最佳实践

1. **首选 GPTCache + 向量库**:生产级,易部署。
2. **已有 Redis 用 Redis Semantic Cache**:集成简单。
3. **框架用 LangChain Cache**:透明集成,代码零修改。
4. **相似度阈值 0.85 是好的起点**:根据场景调。
5. **缓存键用查询 + 上下文**:不同 namespace 隔离。
6. **TTL 30 分钟 - 24 小时**:时效性内容短,知识库内容长。
7. **失效策略**:文档更新时清相关缓存,不要全清。
8. **监控命中率**:< 30% 调阈值,> 80% 验证准确性。
9. **缓存质量验证**:抽样检查答案质量,避免低质缓存污染。
10. **多级缓存**:L1 内存(LRU) + L2 Redis + L3 向量库。
11. **缓存预热**:新部署时用历史查询预热。
12. **避免缓存雪崩**:TTL 加随机偏移,避免同时失效。
13. **A/B 测试**:开 / 关缓存对比成本与质量。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **GPTCache** | v0.7+,生产稳定,Milvus 团队维护 |
| **Redis Semantic Cache** | Redis Stack 7.4+ 原生向量搜索 |
| **LangChain Cache** | 11+ 后端(Redis/SQLite/Memcached) |
| **vLLM Prefix Cache** | v0.6+,系统级,自动 |
| **SGLang Radix** | LMSYS SGLang 0.3+,基数树 + LRU |
| **LiteLLM Cache** | v1.5+,代理级,简单 |
| **企业级** | Vertex AI / Azure AI 原生支持 |
| **命中率** | 30-70%(典型),80%+(优质实现) |
| **成本节省** | 50%+(中位),70%+(极佳) |
| **市场规模** | 缓存基础设施 ARR $200M+ |

---

## 九、See Also(官方源)

### GPTCache

- GitHub [github.com/zilliztech/GPTCache](https://github.com/zilliztech/GPTCache)
- 文档 [gptcache.readthedocs.io](https://gptcache.readthedocs.io/)
- 论文 [arxiv.org/abs/2311.10656](https://arxiv.org/abs/2311.10656)

### Redis

- Redis Stack [redis.io/docs/latest/develop/get-started/vector](https://redis.io/docs/latest/develop/get-started/vector/)
- LangChain Redis [python.langchain.com/docs/integrations/caches/redis](https://python.langchain.com/docs/integrations/caches/redis)

### 框架

- LangChain Caching [python.langchain.com/docs/modules/model_io/models/llms/llm_caching](https://python.langchain.com/docs/modules/model_io/models/llms/llm_caching)
- LlamaIndex Caching [docs.llamaindex.ai](https://docs.llamaindex.ai/)
- LiteLLM Cache [docs.litellm.ai](https://docs.litellm.ai/)

### 系统级

- vLLM Automatic Prefix Caching [docs.vllm.ai](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html)
- SGLang RadixAttention [github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)

---

## 十、相关概念卡

- [[概念/rag-systems|Rag Systems]]
- [[概念/embedding-models|Embedding Models]]
- [[概念/vector-database|Vector Database]]
- [[概念/gptcache|Gptcache]]
- [[概念/llm-infrastructure|Llm Infrastructure]]
- [[概念/inference-performance|Inference Performance]]
- [[概念/RAG/storage|Redis]]
- [[概念/vllm|Vllm]]
