---
title: "Prompt Cache 2.0 (Prefix Caching / vLLM Automatic / SGLang Radix / 长 prompt 复用)"
category: concepts
tags:
  - inference
  - prompt-cache
  - prefix-caching
  - vllm
  - sglang
  - radix-attention
  - long-context
aliases:
  - Prompt Cache 2.0
  - Prefix Caching
  - vLLM Automatic Prefix Caching
  - SGLang RadixAttention
  - Long Prompt Reuse
relationships:
  - target: "概念/prefix-caching"
    type: extends
  - target: "概念/vllm"
    type: related_to
  - target: "概念/sglang"
    type: related_to
  - target: "概念/kv-cache"
    type: related_to
summary: "Prompt Cache 2.0 是 2024-2026 突破"system prompt / 文档每次重算"的关键技术——vLLM Automatic Prefix Caching(自动块级复用)、SGLang RadixAttention(基数树 + LRU)、TGI Prefix Sharing、TensorRT-LLM Inflight Batching。把 system prompt 100K+ token 复用,首次 token 延迟降 5-10x,吞吐量提升 3-8x。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "Prefix Caching / vLLM Automatic / SGLang"
---

# Prompt Cache 2.0

> 中文简称：Prefix Caching / vLLM Automatic / SGLang

> **一句话理解**:Prompt Cache 2.0 把"长 system prompt / 文档前缀"在多请求间复用——vLLM 自动块级缓存、SGLang RadixAttention 用基数树管理,首次 token 延迟降 5-10x,吞吐量提升 3-8x,显存占用降 50%+。

---

## 一、为什么需要 Prompt Cache?

LLM 推理的"前缀重算"问题:
- 每次请求:相同 system prompt + 文档前缀
- 重复计算 KV Cache,浪费算力
- 长 prompt(100K+)下,首次 token 延迟可能 5-30s

Prompt Cache 解法:
- 缓存"相同前缀"的 KV Cache
- 多请求共享前缀 KV
- 避免重算

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 前缀缓存 | Prefix Caching | 共享前缀 KV |
| 块级缓存 | Block-Level Caching | 切块细粒度缓存 |
| 基数树 | Radix Tree | 树形前缀管理 |
| LRU 淘汰 | LRU Eviction | 最近最少使用淘汰 |
| 自动前缀缓存 | Automatic Prefix Caching | vLLM 特性 |
| 块大小 | Block Size | 缓存粒度(典型 16-256 token) |
| 哈希前缀 | Hash Prefix | 块级哈希 |
| 共享前缀 | Shared Prefix | 多请求共有 |
| 系统提示 | System Prompt | 始终相同 |
| 文档前缀 | Document Prefix | 知识库检索结果 |
| 跨请求共享 | Cross-Request Sharing | 多用户共享 |
| 增量计算 | Incremental Computation | 只算新部分 |
| 命中率 | Hit Rate | 缓存命中比例 |
| 首次 token | First Token | TTFT |
| 吞吐量 | Throughput | tokens/s |
| RadixAttention | RadixAttention | SGLang 核心 |
| 飞行批处理 | Inflight Batching | 动态批 |
| 持续批处理 | Continuous Batching | 动态调度 |
| KV 缓存共享 | KV Cache Sharing | 多请求共享 |
| 缓存淘汰 | Cache Eviction | 显存不足时清理 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 框架 | 缓存粒度 | 命中率 | 性能 | 开源 |
|---|---|---|---|---|---|
| **vLLM Automatic Prefix Caching** | vLLM | 块级(16 token) | 60-80% | 5-10x 加速 | Apache 2.0 |
| **SGLang RadixAttention** | SGLang | 基数树 + LRU | 70-85% | 5-10x 加速 | Apache 2.0 |
| **TGI Prefix Sharing** | HuggingFace TGI | 块级 | 50-70% | 3-5x 加速 | Apache 2.0 |
| **TensorRT-LLM** | NVIDIA | 块级 | 60-80% | 5-8x 加速 | Apache 2.0 |
| **lmdeploy** | InternLM | 块级 | 60-80% | 3-5x 加速 | Apache 2.0 |
| **llama.cpp Prefix Cache** | llama.cpp | 序列级 | 40-60% | 2-3x 加速 | MIT |
| **OpenAI Prompt Caching** | OpenAI API | 自动 | — | 5x 加速(API) | 商业 |
| **Anthropic Prompt Caching** | Anthropic API | 4 个粒度 | — | 4-5x 加速 | 商业 |
| **Google Context Caching** | Gemini API | 自动 | — | 4x 加速 | 商业 |
| **DeepSeek Context Cache** | DeepSeek API | 自动 | — | 5x 加速 | 商业 |

---

## 四、vLLM Automatic Prefix Caching 实战

### 4.1 启用

```python
from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Meta-Llama-3-70B-Instruct",
    enable_prefix_caching=True,  # 关键
    block_size=16,  # 块大小
)
```

### 4.2 原理

- 每个块(16 token)计算哈希
- 哈希相同 → 复用 KV Cache
- 不命中 → 增量计算

### 4.3 效果

- **命中率**:60-80%(典型 RAG 场景)
- **TTFT 降低**:5-10x(长 prompt 100K+)
- **吞吐量提升**:3-8x
- **显存节省**:50%+

### 4.4 适用场景

- RAG 检索结果(类似文档前缀)
- System prompt 固定
- 多轮对话(同上下文)
- 工具调用(system 固定)

---

## 五、SGLang RadixAttention 详解

### 5.1 核心思想

**基数树**(Radix Tree)管理所有请求的前缀:
- 根节点 = 空
- 叶子 = 完整请求
- 共享前缀 = 树中同祖先
- LRU 淘汰冷块

### 5.2 架构

```
            [空]
           /    \
       [sys]  [sys']
        /         \
   [doc1]      [doc2]
    /              \
[user1]         [user2]
```

### 5.3 实战

```python
import sglang as sgl

@sgl.function
def rag_qa(s, system, document, question):
    s += system  # 缓存
    s += document  # 缓存
    s += question  # 不缓存
    
runtime = sgl.Runtime(model_path="meta-llama/Meta-Llama-3-70B")
# 自动缓存前缀
```

### 5.4 性能

- 比 vLLM 略快(基数树更高效)
- 命中率 70-85%
- 与 Continuous Batching 深度集成

---

## 六、商业 API Prefix Caching

### 6.1 OpenAI Prompt Caching(2024-11)

- 自动:超过 1024 token 的 prompt 自动缓存 5-60 分钟
- 折扣:命中缓存 50% 价格
- 1024 token = 1 块(后续 +128 token)

### 6.2 Anthropic Prompt Caching(2024-08)

- 4 个断点:可自定义 4 个缓存层级
- 5 分钟 / 1 小时 TTL
- 写入折扣 25%,读取 90% 折扣

### 6.3 Google Context Caching(2024-06)

- Gemini API 内置
- 自动匹配
- 折扣 75%

### 6.4 DeepSeek Context Cache(2024-09)

- 自动匹配 system + 文档前缀
- 缓存命中:读 0.014 美元 / 1M tokens(原价 0.14 美元)

---

## 七、生产最佳实践

1. **首选 vLLM Automatic Prefix Caching**:开源、生产稳定、效果佳。
2. **SGLang 适合高复用场景**:系统提示 + 文档前缀固定,选 SGLang。
3. **block_size = 16**:平衡命中率与精度。
4. **System prompt 必加**:长 system prompt 收益最大。
5. **RAG 检索结果固定格式**:统一前缀,提升命中率。
6. **多轮对话保持上下文**:同一 thread_id 共享 KV。
7. **显存监控**:Prefix cache 占用显存,需监控。
8. **LRU 调优**:冷前缀淘汰,热前缀保留。
9. **API 调用启用 Prompt Caching**:OpenAI / Anthropic 都有,必用。
10. **A/B 测试**:不同 block_size / 框架对比。
11. **避免频繁变前缀**:prefix 变化会导致 cache miss。
12. **缓存容量规划**:估算 max prefix × 命中率 × 模型 KV 大小。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **vLLM APC** | v0.7+,生产稳定,默认启用 |
| **SGLang Radix** | v0.4+,LMSYS 主力 |
| **TGI** | v2.5,企业级 |
| **TensorRT-LLM** | v0.12+,NVIDIA 主力 |
| **API Prefix Caching** | OpenAI / Anthropic / Google / DeepSeek 全部支持 |
| **命中率** | 60-85%(典型 RAG / 工具调用) |
| **TTFT 提升** | 5-10x(100K+ prompt) |
| **市场规模** | 推理优化 ARR $1B+ |
| **主要竞品** | vLLM / SGLang / TGI / TensorRT-LLM / 商业 API |

---

## 九、See Also(官方源)

### vLLM

- 文档 [docs.vllm.ai/en/latest/features/automatic_prefix_caching.html](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html)
- 仓库 [github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)

### SGLang

- RadixAttention 论文 [arxiv.org/abs/2312.07104](https://arxiv.org/abs/2312.07104)
- 仓库 [github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
- 文档 [lmsys.org/blog/2024-01-17-sglang](https://lmsys.org/blog/2024-01-17-sglang/)

### 商业 API

- OpenAI Prompt Caching [platform.openai.com/docs/guides/prompt-caching](https://platform.openai.com/docs/guides/prompt-caching)
- Anthropic Prompt Caching [docs.claude.com/en/docs/build-with-claude/prompt-caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)
- Google Context Caching [ai.google.dev/gemini-api/docs/caching](https://ai.google.dev/gemini-api/docs/caching)
- DeepSeek Context Cache [api-docs.deepseek.com/guides/kv-cache](https://api-docs.deepseek.com/guides/kv-cache)

### 其他

- HuggingFace TGI [github.com/huggingface/text-generation-inference](https://github.com/huggingface/text-generation-inference)
- TensorRT-LLM [github.com/NVIDIA/TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)
- lmdeploy [github.com/InternLM/lmdeploy](https://github.com/InternLM/lmdeploy)

---

## 十、相关概念卡

- [[概念/prefix-caching|Prefix Caching]]
- [[概念/vllm|Vllm]]
- [[概念/sglang|Sglang]]
- [[概念/kv-cache|Kv Cache]]
- [[概念/continuous-batching|Continuous Batching]]
- [[概念/inference-performance|Inference Performance]]
- [[概念/rag-caching|Rag Caching]]
- [[概念/llm-infrastructure|Llm Infrastructure]]
