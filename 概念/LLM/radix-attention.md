---
title: RadixAttention
category: -concepts
tags: [inference, kv-cache, prefix-caching, sglang, radix-tree, multi-turn, agent]
relationships:
  - target: "概念/Inference/kv-cache"
    type: optimizes
  - target: "概念/Inference/prefix-caching"
    type: implements
  - target: "概念/Inference/sglang"
    type: core_component_of
  - target: "概念/Inference/flashinfer"
    type: uses
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 部署推理/Inference_Engines/SGLang_Deep_Dive.md
  - "https://arxiv.org/abs/2312.07104"
summary: RadixAttention 是 SGLang 提出的基于基数树的 KV Cache 复用技术，自动检测并缓存共享 prompt 前缀，支持分支前缀匹配。在多轮对话、Agent 循环、RAG 等场景下比 vLLM APC 快 10-20%，是 2026 年动态多轮场景的最优选择。
provenance:
  extracted: 0.88
  inferred: 0.07
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03
updated: 2026-07-21
aliases:
  - "Radix Attention"
  - "radix attention"
  - "基数树注意力"

---
# RadixAttention

> RadixAttention 是 SGLang 的核心技术——用基数树组织 KV Cache，自动发现和复用共享前缀，动态多轮场景下比 vLLM 快 10-20%。

## 核心要点

- **基数树结构的 KV Cache 管理**：将 KV Cache 组织为 Radix Tree，自动发现和复用共享前缀
- **分支匹配**：不同于 vLLM APC 的线性哈希匹配，支持树形分支匹配
- **零配置自动优化**：无需应用层改动，SGLang 自动识别可复用的 KV Cache 前缀
- **动态场景最优**：多轮对话、Agent 循环、RAG 等不可预测对话流场景下比 vLLM 快 10-20%

## Radix Tree 数据结构

```
Root
├── [System Prompt 10K] (shared) → KV Cache A
│   ├── [User Turn 1] → KV Cache B1
│   │   ├── [Assistant Reply 1] → KV Cache C1
│   │   │   └── [User Turn 2] → KV Cache D1  ← 命中 A+B1+C1
│   │   └── [Alternative Reply] → KV Cache C2  ← 命中 A+B1
│   └── [Different User] → KV Cache B2  ← 命中 A
└── [Different System] → KV Cache E
```

- 共享前缀只计算一次，后续请求直接复用
- 分支点自动识别，支持多候选路径并行探索
- LRU 淮汰策略：显存不足时自动淮汰最久未用的节点

## 与 vLLM APC 对比

| 特性 | vLLM APC | SGLang RadixAttention |
|------|---------|---------------------|
| **匹配方式** | 基于哈希的精确前缀匹配 | 基数树的结构化前缀匹配 |
| **分支支持** | 仅线性前缀 | 支持树形分支 |
| **配置** | 需手动开启 `--enable-prefix-caching` | 零配置自动优化 |
| **最佳场景** | 模板化 batch 推理 | 动态多轮对话/Agent |
| **性能差异** | 静态前缀场景持平 | 动态分支场景快 10-20% |
| **淮汰策略** | 基于引用计数 | LRU + 引用计数 |

## 适用场景

| 场景 | RadixAttention 优势 | 命中率 |
|------|-------------------|:------:|
| **多轮对话** | 自动缓存对话历史前缀 | 60-80% |
| **Agent 循环** | 多候选 action 共享 system + tool 前缀 | 70-85% |
| **RAG 系统** | 多个查询共享相同文档上下文 | 50-70% |
| **Monte Carlo 解码** | 多条采样路径共享公共前缀 | 80-90% |
| **多租户 SaaS** | 每个租户的知识库作为独立分支 | 40-60% |
| **Tree-of-Thought** | 分支探索共享父节点 | 50-70% |

## 实测性能

| 测试 | SGLang (tok/s) | vLLM (tok/s) | 优势 |
|------|:-------------:|:-----------:|:----:|
| 7K context, fresh | 29.5 | 28.6 | 持平 |
| 7K context, cache hit | **35.0** | 32.8 | **+7%** |
| Agent 5轮循环 | **42.0** | 33.5 | **+25%** |
| Small context | 36.1 | 36.1 | 持平 |

> 测试环境: RunPod H100 × 2, DeepSeek-R1-70B。缓存命中时 SGLang 优势明显，复杂多轮场景下差距更大。

## 配置与监控

```bash
# SGLang 启动 (RadixAttention 默认启用)
python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-72B-Instruct \
    --tp 4 \
    --enable-radix-cache \
    --schedule-conservativeness 0.8

# 监控缓存命中率
curl http://localhost:30000/get_server_info | jq '.cache_hit_rate'
```

## 生产最佳实践

1. **保持前缀稳定**：System Prompt 和 Tool 描述放在最前且顺序不变
2. **监控命中率**：低于 40% 时检查前缀设计是否合理
3. **合理设置 mem-fraction-static**：默认 0.88，留出 Radix Tree 管理余量
4. **Agent 场景最佳**：多步工具调用中 RadixAttention 收益最大
5. **避免频繁变更 System Prompt**：每次变更会导致缓存失效
6. **与 FlashInfer 协同**：SGLang 默认使用 FlashInfer 算子，Cascade Attention 进一步提升

## 与其他前缀缓存方案对比

| 方案 | 实现 | 粒度 | 驱逐策略 | 代表 |
|------|------|------|----------|------|
| **RadixAttention** | Radix Tree | Token 级 | LRU | SGLang |
| **Automatic Prefix Caching** | Hash Block | Block 级 | LRU | vLLM |
| **Prompt Cache** | 手动标记 | Prompt 级 | 手动 | Anthropic API |
| **KV Cache 预加载** | 离线计算 | 全量 | 无 | Cache-Augmented Gen |

## 性能影响分析

| 场景 | 缓存命中率 | TTFT 降低 | 说明 |
|------|----------|----------|------|
| 多轮对话 | 60-80% | 50-70% | 历史消息复用 |
| Agent 工具调用 | 70-90% | 60-80% | System+Tool 前缀复用 |
| 批量处理 | 30-50% | 20-40% | 相同模板复用 |
| 随机查询 | 10-20% | 5-15% | 收益有限 |

## 2026 生态现状

| 类别 | 进展 | 说明 |
|------|------|------|
| **SGLang** | RadixAttention 首发 | 最完整的实现 |
| **vLLM** | Automatic Prefix Caching | Block 级前缀缓存 |
| **FlashInfer** | Cascade Attention | 与 RadixAttention 协同 |
| **Cache-Augmented Gen** | KV 预加载 | 离线预计算替代实时检索 |

## RadixAttention 工作原理

```
传统 KV Cache:  每个请求独立缓存，前缀重复计算
RadixAttention: 用 Radix Tree 共享前缀 KV Cache

请求 1: [System Prompt] + [User A Query]  → 生成 A
请求 2: [System Prompt] + [User B Query]  → 生成 B
请求 3: [System Prompt] + [User A Query] + [Follow-up] → 生成 C

Radix Tree 结构:
  root
  └── [System Prompt KV] ← 共享
      ├── [User A KV] ← 请求 1,3 共享
      └── [User B KV] ← 请求 2 独享

效果: 前缀命中时跳过 prefill，延迟降低 2-5x
```

## 前缀缓存技术对比

| 技术 | 粒度 | 匹配策略 | 引擎 | 加速比 |
|------|------|---------|------|--------|
| **RadixAttention** | Token 级 | Radix Tree 前缀匹配 | SGLang | 2-5x |
| **APC** | Block 级 | Hash 匹配 | vLLM | 1.5-3x |
| **Prompt Cache** | 全量 | 精确匹配 | 自实现 | 2-4x |
| **CacheBlend** | 混合 | 部分重用 | 研究 | 1.5-2x |

## 生产最佳实践

1. **System Prompt 统一**：保持 System Prompt 不变，最大化前缀命中率
2. **LRU 淮汰策略**：显存有限时用 LRU 淮汰低频前缀
3. **监控命中率**：关注 prefix cache hit rate，低于 30% 需调整策略
4. **与 Chunked Prefill 配合**：长前缀分块加载，避免阻塞解码请求
5. **多轮对话优化**：将历史对话放在前缀，充分利用缓存

## 延伸阅读

- [[概念/LLM/kv-cache|KV Cache]] — RadixAttention 优化对象
- [[概念/LLM/kv-cache-compression|KV Cache 压缩]] — 显存优化
- [[概念/LLM/paged-attention|PagedAttention]] — vLLM 显存管理
- [[概念/LLM/llm-inference-engine|推理引擎]] — 引擎全景

## 来源

- LMSYS, "Fast and Expressive LLM Inference with RadixAttention and SGLang", 2024
- Zheng et al., "SGLang: Efficient Execution of Structured Language Model Programs", arXiv:2312.07104

## Related

- [[概念/Inference/kv-cache]] — KV Cache（RadixAttention 优化的对象）
- [[概念/Inference/prefix-caching]] — 前缀缓存（RadixAttention 是其中一种实现）
- [[概念/Inference/sglang]] — SGLang 推理引擎（RadixAttention 首发）
- [[概念/Inference/flashinfer]] — FlashInfer 算子库
- [[部署推理/Inference_Engines/SGLang_Deep_Dive]] — SGLang 深度解析
- [[部署推理/Inference_Engines/vLLM_Deep_Dive]] — vLLM（Automatic Prefix Caching）
