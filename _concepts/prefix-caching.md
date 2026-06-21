---
title: Prefix Caching (前缀缓存)
category: concepts
tags: [inference, kv-cache, caching, prefix, optimization]
relationships:
  - target: "_concepts/kv-cache"
    type: optimizes
  - target: "_concepts/radix-attention"
    type: implemented_by
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: 前缀缓存通过复用多个请求共享的 prompt prefix 的 KV Cache 状态，避免重复 prefill 计算。命中率 60-85% 时每次调用成本降低 5-12×，是 2026 年推理侧最高杠杆的应用层优化。实现包括 vLLM APC（哈希匹配）和 SGLang RadixAttention（树形匹配）。
provenance:
  extracted: 0.88
  inferred: 0.07
  ambiguous: 0.05
base_confidence: 0.83
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03 00:00:00+00:00
updated: 2026-06-03 00:00:00+00:00
---

# Prefix Caching (前缀缓存)

## 核心要点

- **复用共享 prompt prefix 的 KV Cache**：如果两个请求共享前 200K tokens 的 system prompt + 参考文档，前缀缓存使这 200K tokens 的 attention 计算变为内存读取
- **命中率 60-85%**：在 Agent 循环、多轮对话、RAG 等场景下可达高命中率
- **成本降低 5-12×**：命中时 per-call 成本大幅下降，是应用层最高杠杆优化
- **越长的上下文越划算**：前缀越长，节省的 prefill 计算越多

## 详细内容

### 四种实现方案

| 方案 | 引擎 | 匹配方式 | 最佳场景 |
|------|------|---------|---------|
| **vLLM APC** | vLLM 0.4+ | 基于哈希的精确前缀匹配 | 模板化 batch 推理 |
| **SGLang RadixAttention** | SGLang | 基数树分支匹配 | 动态多轮对话/Agent |
| **Anthropic Cache Markers** | Claude API | 应用层显式标记 | 多租户 SaaS |
| **TensorRT-LLM KV Reuse** | TensorRT-LLM | 底层引擎 API | 稳定高流量生产 |

### 工作原理

```
Request 1: [System Prompt (10K)] + [Document (50K)] + [User Query A (200)]
           → 计算完整 KV Cache → 存入缓存

Request 2: [System Prompt (10K)] + [Document (50K)] + [User Query B (150)]
           → 检测到前 60K tokens 匹配 → 直接读取缓存
           → 仅计算 User Query B 的 150 tokens
```

### 场景化命中率

| 场景 | 预期命中率 | 原因 |
|------|----------|------|
| Agent 系统循环 | 70-85% | 共享 system prompt + tool 描述 |
| RAG 文档问答 | 60-80% | 共享参考文档上下文 |
| 多轮对话 | 50-70% | 共享对话历史前缀 |
| Code Q&A | 65-80% | 共享代码仓库上下文 |
| 一次性查询 | <10% | 低复用率 |

### 最佳实践

1. **保持前缀稳定**：将 system prompt 和参考文档放在 prompt 开头，用户查询放在末尾
2. **设置合理 TTL**：热数据用 24h TTL，冷数据及时淘汰
3. **监控命中率**：命中率 <30% 时考虑关闭前缀缓存（管理开销 > 收益）
4. **配合 FP8 KV**：FP8 量化使缓存占用减半，可缓存更多前缀

## Related

- [[_concepts/kv-cache]] — KV Cache
- [[_concepts/radix-attention]] — RadixAttention（SGLang 实现）
- [[_concepts/paged-attention]] — PagedAttention（底层内存管理）
- [[10_Deployment_Inference/Prompt_Caching_and_KV_Cache_Optimization]] — Prompt Caching 全景
