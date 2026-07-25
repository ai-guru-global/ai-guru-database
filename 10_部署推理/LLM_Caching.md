---
title: LLM 缓存策略 (LLM Caching)
category: 07-deployment
tags: ["kv-cache", "semantic-cache", "prompt-cache", "prefix-cache", "inference-optimization"]
summary: "LLM 缓存完整技术体系：KV Cache 管理、语义缓存、Prompt 缓存、前缀缓存、分布式缓存架构与 2026 生产实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# LLM 缓存策略 (LLM Caching)

## 1. 缓存层次

```
LLM 推理缓存层次 (从快到慢):

L1: KV Cache (GPU 显存)
  - 已计算 token 的 Key/Value
  - 避免重复计算
  - 速度: 即时

L2: Prefix Cache (GPU/CPU)
  - 相同前缀的 KV Cache 复用
  - 系统 prompt / 多轮对话
  - 节省: 50-90% prefill 时间

L3: Semantic Cache (Redis/向量库)
  - 语义相似问题 → 直接返回缓存答案
  - 不需要调用模型
  - 节省: 100% 推理成本

L4: Prompt Cache (API 级)
  - 相同 prompt 前缀 → 服务端缓存
  - OpenAI/Anthropic 原生支持
  - 节省: 50-90% 输入 token 费用
```

## 2. KV Cache 管理

### 2.1 PagedAttention (vLLM)

```python
# KV Cache 问题:
# - 传统: 为每个请求预分配最大长度 KV Cache
# - 浪费: 平均利用率 < 50% (大部分请求用不满)
# - 碎片: 不同长度请求造成内存碎片

# PagedAttention 解决:
# - 将 KV Cache 分成固定大小的"页" (如 16 tokens)
# - 按需分配页 (类似操作系统虚拟内存)
# - 利用率: > 95%

class PagedKVCache:
    """
    vLLM PagedAttention 核心思想:
    - Block Size: 16 tokens
    - 每个请求按需分配 block
    - 共享 block (如 beam search)
    """
    def __init__(self, num_blocks, block_size=16, 
                 num_heads=32, head_dim=128):
        self.block_size = block_size
        # 预分配所有 block
        self.k_cache = torch.zeros(
            num_blocks, block_size, num_heads, head_dim
        )
        self.v_cache = torch.zeros(
            num_blocks, block_size, num_heads, head_dim
        )
        # Block 表: 请求 → block 列表
        self.block_tables = {}
    
    def allocate(self, request_id, num_tokens):
        """为请求分配 block"""
        num_blocks_needed = (num_tokens + self.block_size - 1) // self.block_size
        free_blocks = self.get_free_blocks(num_blocks_needed)
        self.block_tables[request_id] = free_blocks
    
    def free(self, request_id):
        """请求完成，释放 block"""
        blocks = self.block_tables.pop(request_id)
        self.return_blocks(blocks)
```

### 2.2 KV Cache 压缩

```python
KV_CACHE_COMPRESSION = {
    "GQA (Grouped Query Attention)": {
        "原理": "多个 Q 头共享 KV 头",
        "压缩": "KV Cache 减少 4-8x",
        "2026": "几乎所有新模型都用 GQA",
    },
    "MQA (Multi Query Attention)": {
        "原理": "所有 Q 头共享 1 个 KV",
        "压缩": "KV Cache 减少 32x",
        "质量": "略有下降",
    },
    "量化 KV Cache": {
        "原理": "KV 从 FP16 → INT8/INT4",
        "压缩": "2-4x",
        "工具": "vLLM --kv-cache-dtype fp8",
    },
    "滑动窗口": {
        "原理": "只保留最近 N 个 token 的 KV",
        "适用": "Mistral/Gemma 的窗口注意力",
        "限制": "无法访问远距离信息",
    },
    "Token 驱逐": {
        "原理": "移除不重要的 token KV",
        "方法": "H2O / SnapKV / PyramidKV",
        "压缩": "保留 20-50% token",
    },
}
```

## 3. 语义缓存

### 3.1 实现

```python
import numpy as np
from redis import Redis
import json

class SemanticCache:
    """
    语义缓存: 相似问题直接返回缓存答案
    
    流程:
    1. 用户提问 → 计算 embedding
    2. 在缓存中搜索相似问题 (余弦相似度)
    3. 相似度 > 阈值 → 直接返回缓存答案
    4. 否则 → 调用模型 → 存入缓存
    
    节省: 高频重复问题可节省 60-80% 推理成本
    """
    def __init__(self, embedding_model, redis_client,
                 similarity_threshold=0.95, ttl=3600):
        self.embedder = embedding_model
        self.redis = redis_client
        self.threshold = similarity_threshold
        self.ttl = ttl
    
    async def get_or_compute(self, query, compute_fn):
        """获取缓存或计算"""
        # 1. 计算查询 embedding
        query_emb = await self.embedder.encode(query)
        
        # 2. 搜索相似缓存
        cached = await self.search_similar(query_emb)
        
        if cached and cached["similarity"] > self.threshold:
            return cached["response"]  # 命中缓存
        
        # 3. 未命中，调用模型
        response = await compute_fn(query)
        
        # 4. 存入缓存
        await self.store(query, query_emb, response)
        
        return response
    
    async def search_similar(self, query_emb):
        """向量相似搜索"""
        # 使用 Redis Vector Search / pgvector / Qdrant
        results = self.redis.ft("cache_idx").search(
            f"*=>[KNN 1 @embedding $vec AS score]",
            query_params={"vec": query_emb.tobytes()},
        )
        if results.docs:
            return {
                "response": json.loads(results.docs[0].response),
                "similarity": 1 - float(results.docs[0].score),
            }
        return None
    
    async def store(self, query, embedding, response):
        """存入缓存"""
        self.redis.hset(f"cache:{hash(query)}", mapping={
            "query": query,
            "embedding": embedding.tobytes(),
            "response": json.dumps(response),
        })
        self.redis.expire(f"cache:{hash(query)}", self.ttl)
```

### 3.2 适用场景

| 场景 | 命中率 | 节省 | 适用性 |
|------|--------|------|--------|
| FAQ/客服 | 70-90% | 极高 | 非常适合 |
| 知识问答 | 40-60% | 高 | 适合 |
| 代码生成 | 20-40% | 中 | 部分适合 |
| 创意写作 | 5-10% | 低 | 不适合 |
| 多轮对话 | 30-50% | 中 | 需上下文 |

## 4. Prompt 缓存 (API 级)

### 4.1 提供商支持

```python
# 2026 主流 API 的 Prompt Caching:

PROMPT_CACHING = {
    "OpenAI": {
        "机制": "自动缓存相同前缀 (≥1024 tokens)",
        "折扣": "缓存命中 → 输入 token 50% 折扣",
        "使用": "无需配置，自动生效",
        "最佳实践": "把系统 prompt 放最前面",
    },
    "Anthropic": {
        "机制": "显式标记 cache_control",
        "折扣": "缓存写入 1.25x, 读取 0.1x",
        "使用": "在消息中标记 breakpoints",
        "TTL": "5 分钟 (活跃) / 1 小时",
    },
    "Google Gemini": {
        "机制": "Context Caching API",
        "折扣": "缓存 token 75% 折扣",
        "使用": "创建缓存对象 → 引用",
        "TTL": "可配置 (默认 1 小时)",
    },
}

# Anthropic 示例:
"""
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": "很长的系统 prompt...",  # > 1024 tokens
        "cache_control": {"type": "ephemeral"}  # 标记缓存
    }],
    messages=[{"role": "user", "content": "问题"}]
)
# 首次: 写入缓存 (1.25x 费用)
# 后续: 读取缓存 (0.1x 费用) → 节省 90%!
"""
```

## 5. 前缀缓存 (Prefix Caching)

```python
# 推理引擎级前缀缓存:

PREFIX_CACHING = {
    "vLLM (Automatic Prefix Caching)": {
        "原理": "哈希匹配 KV Cache block",
        "启用": "--enable-prefix-caching",
        "场景": "多轮对话/共享系统 prompt",
        "效果": "TTFT 减少 50-90%",
    },
    "SGLang (RadixAttention)": {
        "原理": "基数树索引 KV Cache",
        "优势": "更细粒度的前缀匹配",
        "效果": "比 vLLM 更好的缓存命中",
    },
    "TensorRT-LLM": {
        "原理": "KV Cache 复用 + 量化",
        "启用": "reuse_kv_cache=True",
    },
}

# 最佳实践:
# 1. 系统 prompt 固定且放最前面
# 2. 多轮对话保持前缀不变
# 3. 批量请求共享相同前缀
# 4. 避免在前缀中插入时间戳等变化内容
```

## 6. 交叉引用

- [[10_部署推理/Serving_Architecture/|服务架构]]
- [[10_部署推理/02_Inference_Engines/|推理引擎]]
- [[概念/LLM/kv-cache|KV Cache 概念]]
- [[概念/LLM/prefix-caching|前缀缓存]]
- [[10_部署推理/04_Inference_Performance/|推理性能]]
- [[10_部署推理/06_Caching/|缓存]]
