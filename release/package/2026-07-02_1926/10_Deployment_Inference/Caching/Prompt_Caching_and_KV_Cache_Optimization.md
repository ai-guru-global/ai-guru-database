---
title: Prompt Caching 与 KV Cache 优化深度解析
category: 10-deployment-inference
tags: [prompt-caching, kv-cache, prefix-caching, attention-optimization, inference-engine, vllm, pagedattention]
summary: 深度解析 LLM 推理中的 KV Cache 管理、Prefix Caching、Prompt Caching 和注意力优化技术，涵盖从内存管理到多轮对话缓存的全栈优化策略。
date: 2026-06-01
created: 2026-06-12
tier: supporting
aliases:
  - "Prompt Caching And Kv Cache Optimization"
  - "Prompt Caching and KV Cache Optimization"
  - Prompt_Caching_and_KV_Cache_Optimization
sources: []

---
# Prompt Caching 与 KV Cache 优化深度解析

## 一句话理解

LLM 推理时，80% 的计算都花在重复处理相同的 system prompt 和对话历史上——**KV Cache 优化就是把"已经算过的"记住，让模型只关注"新说的"**。

---

## 一、KV Cache 的本质

### 1.1 为什么需要 KV Cache

**自回归生成的冗余**:
```
生成第 1 个 token:
  输入: [System Prompt + User Query]
  计算: Attention over all tokens
  输出: Token_1

生成第 2 个 token:
  输入: [System Prompt + User Query + Token_1]
  计算: Attention over all tokens (包括之前算过的！)
  输出: Token_2

生成第 3 个 token:
  输入: [System Prompt + User Query + Token_1 + Token_2]
  计算: Attention over all tokens (又重复算了一遍！)
  输出: Token_3
```

**问题**: System Prompt 和 User Query 在每一步都被重复计算。

**KV Cache 的解决方案**:
```
第 1 步:
  计算所有 token 的 K, V
  → 缓存 K[1:n], V[1:n]
  → 输出 Token_1

第 2 步:
  只计算 Token_1 的 K, V
  → 从缓存读取 K[1:n], V[1:n]
  → 拼接: K[1:n+1], V[1:n+1]
  → 输出 Token_2

第 3 步:
  只计算 Token_2 的 K, V
  → 从缓存读取 K[1:n+1], V[1:n+1]
  → 拼接: K[1:n+2], V[1:n+2]
  → 输出 Token_3
```

**效果**: 生成阶段每步只需计算 1 个 token 的 attention，而不是整个序列。

### 1.2 KV Cache 的内存占用

```python
# 计算公式
kv_cache_size = 2 × num_layers × num_kv_heads × head_dim × seq_len × batch_size × dtype_size

# 示例: LLaMA-2-70B
num_layers = 80
num_kv_heads = 8  (GQA)
head_dim = 128
seq_len = 8192
batch_size = 1
dtype_size = 2  (FP16)

kv_cache = 2 × 80 × 8 × 128 × 8192 × 1 × 2
         = 2.15 GB

# 如果 batch_size = 32:
kv_cache = 2.15 × 32 = 68.8 GB

# 如果 seq_len = 128K:
kv_cache = 2.15 × 16 = 34.4 GB (per batch)
```

**关键洞察**: KV Cache 内存占用与序列长度和 batch size 成正比。

---

## 二、Prefix Caching (前缀缓存)

### 2.1 核心思想

**观察**: 多个请求共享相同的前缀（system prompt、多轮对话的历史）。

```
请求 1: [System Prompt + User: "Hello"] → Assistant: "Hi!"
请求 2: [System Prompt + User: "How are you?"] → Assistant: "I'm good!"
请求 3: [System Prompt + User: "What's the weather?"] → Assistant: "..."

共同前缀: System Prompt (1000 tokens)
如果 3 个请求同时处理:
  不用算 3 遍 System Prompt！
  算 1 遍，缓存 K/V，3 个请求共享
```

### 2.2 RadixAttention: vLLM 的 Prefix Caching

**核心数据结构: Radix Tree (基数树)**

```
                    root
                     |
              [System Prompt]
               /    |    \
        [User1]  [User2]  [User3]
          |        |        |
       [Resp1]  [Resp2]  [Resp3]
```

**特性**:
- 共享节点只存储一次 K/V (如 System Prompt)
- 分支节点各自独立存储
- 支持动态插入和驱逐

**内存管理**:
```python
class PrefixCache:
    def __init__(self, max_blocks=10000):
        self.radix_tree = RadixTree()
        self.block_manager = BlockManager(max_blocks)
    
    def compute_or_cache(self, token_ids):
        # 1. 在 Radix Tree 中查找最长匹配前缀
        matched_prefix, remaining = self.radix_tree.find_longest_match(token_ids)
        
        # 2. 复用匹配前缀的 KV Cache
        if matched_prefix:
            cached_kv = self.block_manager.get_kv(matched_prefix)
            
        # 3. 只计算剩余部分的 KV
        new_kv = model.compute_kv(remaining)
        
        # 4. 将新计算的部分加入缓存
        self.radix_tree.insert(token_ids, new_kv)
        
        return concat(cached_kv, new_kv)
```

### 2.3 实际效果

**多轮对话场景**:
```
对话历史: 10 轮 × 200 tokens = 2000 tokens
System Prompt: 500 tokens

新消息: 50 tokens

Without Prefix Caching:
  需要计算: 2550 tokens 的 attention

With Prefix Caching:
  从缓存读取: 2500 tokens 的 K/V
  只计算: 50 tokens 的 attention
  
加速: ~50× (对于新 token 的生成)
```

**批量处理场景**:
```
100 个请求，共享相同的 System Prompt

Without Prefix Caching:
  计算 100 次 System Prompt

With Prefix Caching:
  计算 1 次 System Prompt
  99 次直接读取缓存
  
加速: ~100× (对于 prefix 部分)
```

---

## 三、PagedAttention: 解决 KV Cache 的内存碎片

### 3.1 内存碎片问题

**问题**: KV Cache 是动态增长的，导致内存碎片。

```
请求 A: seq_len = 100 → 分配 100 个 slot
请求 B: seq_len = 50  → 分配 50 个 slot
请求 C: seq_len = 200 → 分配 200 个 slot
请求 A 结束: 释放 100 个 slot

新请求 D: seq_len = 150
  碎片: 虽然有 100 + 50 = 150 个空闲 slot
  但它们不连续！
  → 无法分配，需要重新分配或等待
```

### 3.2 PagedAttention 的解决方案

**灵感**: 操作系统虚拟内存的分页机制。

```python
# 将 KV Cache 分成固定大小的 "块" (Block)
BLOCK_SIZE = 16  # 每个块存储 16 个 token 的 K/V

请求 A (seq_len = 100):
  需要: ceil(100 / 16) = 7 个块
  分配: Block[0], Block[5], Block[3], Block[8], Block[2], Block[9], Block[11]
  → 块不需要连续！

请求 B (seq_len = 50):
  需要: ceil(50 / 16) = 4 个块
  分配: Block[1], Block[4], Block[6], Block[7]

逻辑视图 (连续):
  [Token_0-15] [Token_16-31] [Token_32-47] ...

物理视图 (不连续):
  Block[0]    Block[5]    Block[3]    Block[8] ...
```

**Block Table**:
```python
request_A = {
    'block_table': [0, 5, 3, 8, 2, 9, 11],
    'num_tokens': 100
}

request_B = {
    'block_table': [1, 4, 6, 7],
    'num_tokens': 50
}
```

### 3.3 注意力计算的分块处理

```python
def paged_attention(query, block_table, key_cache_blocks, value_cache_blocks):
    # query: [num_heads, head_dim] — 当前 token 的 query
    
    output = torch.zeros(num_heads, head_dim)
    
    for block_id in block_table:
        # 从块缓存中读取 K, V
        K_block = key_cache_blocks[block_id]      # [BLOCK_SIZE, num_heads, head_dim]
        V_block = value_cache_blocks[block_id]    # [BLOCK_SIZE, num_heads, head_dim]
        
        # 计算当前块内的 attention
        scores = query @ K_block.transpose(-1, -2)  # [num_heads, BLOCK_SIZE]
        weights = torch.softmax(scores, dim=-1)
        
        # 加权求和
        output += weights @ V_block  # [num_heads, head_dim]
    
    return output
```

### 3.4 动态扩展与 Copy-on-Write

**问题**: 多个请求共享同一个前缀，但后续生成内容不同。

**Copy-on-Write (COW)**:
```python
# 请求 A 和 B 共享前 3 个块
request_A = {'block_table': [0, 1, 2], ...}
request_B = {'block_table': [0, 1, 2], ...}  # 共享！

# 请求 A 生成新 token
# 如果块 2 还有空间，直接写入
# 如果块 2 满了:
    # 分配新块
    # 复制块 2 的内容到新块
    # 更新 request_A 的 block_table
    # request_B 仍然指向原来的块 2

request_A = {'block_table': [0, 1, 2, 10], ...}  # 新块 10
request_B = {'block_table': [0, 1, 2], ...}       # 不变
```

**效果**: 共享前缀的内存只存储一份，直到某个请求需要修改时才复制。

---

## 四、Prompt Caching 的高级策略

### 4.1 滑动窗口缓存

**问题**: 无限长的对话历史会耗尽内存。

**解决方案**: 只缓存最近 N 轮对话。

```python
class SlidingWindowCache:
    def __init__(self, max_history=10):
        self.max_history = max_history
        self.cache = OrderedDict()
    
    def add(self, turn_id, kv_cache):
        self.cache[turn_id] = kv_cache
        
        # 淘汰旧的历史
        while len(self.cache) > self.max_history:
            self.cache.popitem(last=False)
    
    def get_context(self, current_turn):
        # 返回最近 max_history 轮的 KV Cache
        return [self.cache[t] for t in range(
            max(0, current_turn - self.max_history),
            current_turn
        )]
```

### 4.2 语义缓存

**问题**: 用户用不同的措辞问同一个问题。

```
用户 1: "What is the capital of France?"
用户 2: "Tell me the capital city of France."
用户 3: "France's capital?"

语义相同，但文本不同 → 传统的 Prefix Caching 无法命中
```

**语义缓存方案**:
```python
class SemanticCache:
    def __init__(self, embedding_model):
        self.embedding_model = embedding_model
        self.cache = {}  # embedding → KV Cache
    
    def get(self, query):
        query_emb = self.embedding_model.encode(query)
        
        # 查找语义相似的缓存
        for cached_emb, kv_cache in self.cache.items():
            similarity = cosine_similarity(query_emb, cached_emb)
            if similarity > 0.95:
                return kv_cache
        
        return None
    
    def put(self, query, kv_cache):
        query_emb = self.embedding_model.encode(query)
        self.cache[query_emb] = kv_cache
```

**效果**: 在 FAQ、客服等场景下，缓存命中率可以从 30% 提升到 70%。

### 4.3 分层缓存 (Hierarchical Caching)

```
L1 Cache (GPU SRAM): 最近 1 轮的 KV Cache
  - 访问延迟: ~1μs
  - 容量: 极小 (MB 级)

L2 Cache (GPU HBM): 最近 10 轮的 KV Cache
  - 访问延迟: ~10μs
  - 容量: 中等 (GB 级)

L3 Cache (CPU DRAM / NVMe): 历史对话库
  - 访问延迟: ~1ms
  - 容量: 极大 (TB 级)

L4 Cache (分布式存储): 持久化缓存
  - 访问延迟: ~10ms
  - 容量: 无限
```

**多级查询**:
```python
def get_kv_cache(query):
    # L1
    if query in l1_cache:
        return l1_cache[query]
    
    # L2
    if query in l2_cache:
        l1_cache[query] = l2_cache[query]  # 提升到 L1
        return l2_cache[query]
    
    # L3
    if query in l3_cache:
        l2_cache[query] = l3_cache[query]  # 提升到 L2
        return l3_cache[query]
    
    # L4
    if query in l4_cache:
        l3_cache[query] = l4_cache[query]
        return l4_cache[query]
    
    # 缓存未命中，重新计算
    return compute_kv(query)
```

---

## 五、KV Cache 压缩技术

### 5.1 量化压缩

```python
# FP16 → INT8
kv_cache_fp16 = torch.randn(num_layers, num_heads, seq_len, head_dim, dtype=torch.float16)
kv_cache_int8 = kv_cache_fp16.to(torch.int8)  # 内存减半

# 精度影响:
#  INT8: 困惑度上升 < 1% (可接受)
#  INT4: 困惑度上升 2-5% (需要校准)

# 更激进的: 混合精度
# 最近的 1K token: FP16 (精确)
# 1K-4K token: INT8 (平衡)
# > 4K token: INT4 (压缩)
```

### 5.2 稀疏化 (Eviction)

**观察**: 不是所有历史 token 都同等重要。

**策略**:
```python
def sparse_kv_cache(kv_cache, attention_scores, sparsity=0.5):
    # attention_scores: 每个历史 token 被关注的频率
    
    # 保留最重要的 50% token
    num_keep = int(len(kv_cache) * (1 - sparsity))
    top_indices = torch.topk(attention_scores, k=num_keep).indices
    
    # 只保留这些 token 的 K/V
    compressed_kv = kv_cache[top_indices]
    
    return compressed_kv
```

**H2O (Heavy Hitter Oracle)**:
- 发现少数 token 承担了大部分 attention 权重
- 通常 20% 的 token 承载了 80% 的 attention
- 只保留这些 "Heavy Hitter" token

### 5.3 低秩近似

```python
# 将 KV Cache 投影到低维空间
# K: [seq_len, num_heads, head_dim]

# SVD 分解
U, S, V = torch.svd(K)

# 保留前 r 个奇异值
r = head_dim // 4
K_compressed = U[:, :r] @ torch.diag(S[:r]) @ V[:, :r].T

# 存储: U[:, :r] 和 S[:r] (而不是完整的 K)
# 压缩比: 4×
```

---

## 六、工程实践

### 6.1 vLLM 的 Prefix Caching 配置

```python
from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-2-7b",
    enable_prefix_caching=True,  # 开启 Prefix Caching
    block_size=16,               # 块大小
    gpu_memory_utilization=0.9,  # GPU 内存利用率
)

# 第一批请求会填充缓存
outputs_1 = llm.generate([long_prompt_1] * 10)

# 后续请求复用缓存
outputs_2 = llm.generate([long_prompt_1 + "Continue:"] * 10)
# 如果 prompt 共享前缀，会自动命中缓存
```

### 6.2 监控指标

```python
# 需要监控的关键指标
metrics = {
    'cache_hit_rate': cache_hits / total_requests,
    'avg_prefix_length': mean(len(prefix) for prefix in cached_prefixes),
    'kv_cache_memory': current_kv_cache_size / total_gpu_memory,
    'eviction_rate': num_evictions / total_cache_ops,
    'time_saved': baseline_time - cached_time,
}

# 健康阈值
assert metrics['cache_hit_rate'] > 0.3       # 至少 30% 命中率
assert metrics['kv_cache_memory'] < 0.8      # KV Cache 不超过 80% GPU 内存
assert metrics['eviction_rate'] < 0.1        # 驱逐率不超过 10%
```

### 6.3 常见陷阱

**陷阱 1: 缓存污染**
```
问题: 缓存中积累了大量不常用的前缀，导致常用前缀被驱逐

解决: LRU (Least Recently Used) 或 LFU (Least Frequently Used) 策略
```

**陷阱 2: 缓存一致性**
```
问题: 模型权重更新后，旧的 KV Cache 不再有效

解决: 版本控制——缓存时记录模型版本号，更新权重时清空缓存
```

**陷阱 3: 并发冲突**
```
问题: 多个请求同时读写同一块缓存

解决: 读写锁或 Copy-on-Write 机制
```

---

## 七、前沿方向

### 7.1 FlashAttention-3 + KV Cache 优化

**FlashAttention 的演进**:
- FlashAttention-1: 减少 HBM 访问
- FlashAttention-2: 更好的 warp 级并行
- FlashAttention-3: 结合 KV Cache 压缩和异步加载

**新特性**:
- 在 attention 计算的同时进行 KV Cache 量化
- 支持 FP8 精度的 KV Cache
- 与 Prefix Caching 原生集成

### 7.2 持久化 KV Cache

**场景**: 长期对话助手（如个人 AI 助理）。

```python
class PersistentKVCache:
    def __init__(self, user_id):
        self.user_id = user_id
        self.cache_db = Redis()  # 或其他 KV 存储
    
    def load_history(self):
        # 从持久化存储加载用户的对话历史 KV Cache
        return self.cache_db.get(f"kv_cache:{self.user_id}")
    
    def save_history(self, kv_cache):
        # 对话结束后保存 KV Cache
        self.cache_db.set(f"kv_cache:{self.user_id}", kv_cache)
```

**挑战**:
- KV Cache 体积大（GB 级），存储成本高
- 加载延迟高（从磁盘/网络加载）
- 模型更新后需要重新计算

### 7.3 跨模型 KV Cache 共享

**愿景**: 不同模型（如 GPT-4 和 Claude）共享 KV Cache。

**技术障碍**:
- 模型架构不同（层数、头数、维度）
- 位置编码不同
- Tokenizer 不同

**可能的解决方案**:
- 标准化中间表示（类似 ONNX）
- 用蒸馏模型做 "翻译"

---

## Related

- [[10_Deployment_Inference/Caching/Speculative_Decoding_Advanced_2026]]
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive]]
- [[_concepts/model-serving]]
- [[05_NLP_LLMs/LLM_Architectures/LLM_Architectures]]
- [[10_Deployment_Inference/Deployment_Inference_2026]]
