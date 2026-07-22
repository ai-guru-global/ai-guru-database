---
title: Prefix Caching (前缀缓存)
category: -concepts
tags: [inference, kv-cache, caching, prefix, optimization, radix-attention, vllm, sglang]
relationships:
  - target: "概念/Inference/kv-cache"
    type: optimizes
  - target: "概念/Inference/radix-attention"
    type: implemented_by
  - target: "概念/Inference/request-scheduling"
    type: related_to
  - target: "概念/Inference/inference-performance"
    type: improves
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - "https://arxiv.org/abs/2312.07104"  # SGLang RadixAttention
summary: 前缀缓存通过复用多个请求共享的 prompt prefix 的 KV Cache 状态，避免重复 prefill 计算。命中率 60-85% 时每次调用成本降低 5-12×，是 2026 年推理侧最高杠杆的应用层优化。
provenance:
  extracted: 0.88
  inferred: 0.07
  ambiguous: 0.05
base_confidence: 0.83
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03
updated: 2026-07-21
aliases:
  - "Prefix Caching"
  - "prefix caching"
  - "前缀缓存"
  - "Prompt Caching"

---
# Prefix Caching (前缀缓存)

> 前缀缓存是推理侧最高杠杆的应用层优化——共享前缀的 KV Cache 只算一次，后续请求直接复用。

## 核心要点

- **复用共享 prompt prefix 的 KV Cache**：如果两个请求共享前 200K tokens 的 system prompt + 参考文档，前缀缓存使这 200K tokens 的 attention 计算变为内存读取
- **命中率 60-85%**：在 Agent 循环、多轮对话、RAG 等场景下可达高命中率
- **成本降低 5-12×**：命中时 per-call 成本大幅下降
- **越长的上下文越划算**：前缀越长，节省的 prefill 计算越多

## 工作原理

```
Request 1: [System Prompt (10K)] + [Document (50K)] + [User Query A (200)]
           → 计算完整 KV Cache → 存入缓存

Request 2: [System Prompt (10K)] + [Document (50K)] + [User Query B (150)]
           → 检测到前 60K tokens 匹配 → 直接读取缓存
           → 仅计算 User Query B 的 150 tokens

节省: 60K tokens 的 Prefill 计算 ≈ 节省 99.75% 的 Prefill 成本
```

## 四种实现方案

| 方案 | 引擎 | 匹配方式 | 最佳场景 | 粒度 |
|------|------|---------|---------|------|
| **vLLM APC** | vLLM 0.4+ | 基于哈希的精确前缀匹配 | 模板化 batch 推理 | Block (16 tokens) |
| **SGLang RadixAttention** | SGLang | 基数树分支匹配 | 动态多轮对话/Agent | 任意前缀 |
| **Anthropic Cache Markers** | Claude API | 应用层显式标记 | 多租户 SaaS | 标记点 |
| **TensorRT-LLM KV Reuse** | TensorRT-LLM | 底层引擎 API | 稳定高流量生产 | Block |
| **OpenAI Prompt Caching** | GPT API | 自动前缀匹配 | API 调用 | 128 tokens |

### vLLM APC vs SGLang RadixAttention

| 维度 | vLLM APC | SGLang RadixAttention |
|------|----------|--------------------|
| 匹配算法 | 哈希精确匹配 | Radix Tree 分支匹配 |
| 灵活性 | 仅精确前缀 | 支持任意共享前缀 |
| 多轮对话 | 支持 | 更优（树形结构） |
| 实现复杂度 | 低 | 中 |
| 命中率 | 高（模板化场景） | 更高（动态场景） |

## 场景化命中率

| 场景 | 预期命中率 | 原因 | 优化建议 |
|------|----------|------|----------|
| Agent 系统循环 | 70-85% | 共享 system prompt + tool 描述 | 保持 tool 描述顺序稳定 |
| RAG 文档问答 | 60-80% | 共享参考文档上下文 | 文档放 prompt 前部 |
| 多轮对话 | 50-70% | 共享对话历史前缀 | 历史追加而非重排 |
| Code Q&A | 65-80% | 共享代码仓库上下文 | 代码上下文放前部 |
| 批量翻译 | 80-90% | 共享 system prompt | 模板固定 |
| 一次性查询 | <10% | 低复用率 | 不建议启用 |

## 启用配置示例

```python
# vLLM 启用前缀缓存
from vllm import LLM

llm = LLM(
    model="Qwen/Qwen2.5-72B-Instruct",
    enable_prefix_caching=True,  # 启用 APC
    gpu_memory_utilization=0.9,
    max_model_len=131072,        # 128K 上下文
)

# SGLang 自动启用 RadixAttention
# python -m sglang.launch_server --model Qwen/Qwen2.5-72B-Instruct
# RadixAttention 默认启用，无需额外配置
```

```python
# Anthropic Prompt Caching (API 层)
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": long_system_prompt,  # >1024 tokens
        "cache_control": {"type": "ephemeral"}  # 标记缓存点
    }],
    messages=[{"role": "user", "content": "..."}]
)
# 命中时: input tokens 成本降低 90%
```

## 性能影响

| 指标 | 无缓存 | 有缓存 (命中) | 提升 |
|------|--------|------------|------|
| TTFT (60K前缀) | ~3s | ~100ms | 30× |
| Prefill 计算量 | 60K tokens | 200 tokens | 300× 减少 |
| 每次调用成本 | 1× | 0.08-0.2× | 5-12× 降低 |
| 显存占用 | 基线 | +10-20% (缓存) | 略增 |

## 最佳实践

1. **保持前缀稳定**: 将 system prompt 和参考文档放在 prompt 开头，用户查询放在末尾
2. **设置合理 TTL**: 热数据用 24h TTL，冷数据及时淘汰
3. **监控命中率**: 命中率 <30% 时考虑关闭前缀缓存（管理开销 > 收益）
4. **配合 FP8 KV**: FP8 量化使缓存占用减半，可缓存更多前缀
5. **避免前缀变动**: 时间戳、随机 ID 等不要放在前缀中，会破坏缓存
6. **Prompt 结构化**: 固定部分放前，可变部分放后，最大化共享前缀长度

## Related

- [[概念/Inference/kv-cache|KV Cache]]
- [[概念/Inference/radix-attention|RadixAttention]]
- [[概念/Inference/paged-attention|PagedAttention]]
- [[概念/Inference/inference-performance|推理性能]]
- [[部署推理/Caching/Prompt_Caching_and_KV_Cache_Optimization|Prompt Caching 全 景]]

## 前缀缓存技术对比

| 技术 | 粒度 | 匹配策略 | 引擎 | 加速比 |
|------|------|---------|------|--------|
| **RadixAttention** | Token 级 | Radix Tree | SGLang | 2-5x |
| **APC** | Block 级 | Hash | vLLM | 1.5-3x |
| **Prompt Cache** | 全量 | 精确匹配 | 自实现 | 2-4x |
| **CacheBlend** | 混合 | 部分重用 | 研究 | 1.5-2x |
| **API Prompt Cache** | 全量 | 精确 | OpenAI/Anthropic | 2-4x |

## 前缀缓存工作原理

```
请求 1: [System Prompt (1K tokens)] + [User Query A]
请求 2: [System Prompt (1K tokens)] + [User Query B]
请求 3: [System Prompt (1K tokens)] + [User Query A] + [Follow-up]

无缓存: 每个请求都重新计算 System Prompt 的 KV
有缓存: System Prompt KV 只计算一次，后续复用

Radix Tree 结构:
  root
  └── [System Prompt KV] ← 共享
      ├── [Query A KV] ← 请求 1,3 共享
      └── [Query B KV] ← 请求 2 独享
```

## 生产最佳实践

1. **System Prompt 统一**：保持 System Prompt 不变，最大化命中率
2. **监控命中率**：prefix cache hit rate 低于 30% 需调整
3. **LRU 淮汰**：显存有限时用 LRU 淮汰低频前缀
4. **多轮对话优化**：历史对话放前缀，充分利用缓存
5. **API 缓存利用**：OpenAI/Anthropic 自动缓存相同前缀

## 延伸阅读

- [[概念/Inference/radix-attention|RadixAttention]] — SGLang 前缀缓存
- [[概念/Inference/paged-attention|PagedAttention]] — vLLM 显存管理
- [[概念/Inference/kv-cache|KV Cache]] — 缓存基础
- [[概念/Inference/ttft|TTFT]] — 前缀缓存降低 TTFT

> ℹ️ 前缀缓存是推理服务的重要优化，相同 System Prompt 可加速 2-5x。
实现: SGLang RadixAttention (Token 级)、vLLM APC (Block 级)。
生产建议: 保持 System Prompt 不变，监控 cache hit rate > 30%。
注意: 前缀缓存与 PagedAttention 配合使用，显存管理更高效。
限制: 前缀必须完全匹配，部分匹配无法利用缓存。
优化: 将不变内容 (System Prompt) 放在最前面，变化内容放后面。
工具: SGLang RadixAttention / vLLM APC / OpenAI Prompt Caching。
