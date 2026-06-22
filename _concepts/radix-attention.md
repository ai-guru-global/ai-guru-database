---
title: RadixAttention
category: -concepts
tags: [inference, kv-cache, prefix-caching, sglang, radix-tree]
relationships:
  - target: "_concepts/kv-cache"
    type: optimizes
  - target: "_concepts/prefix-caching"
    type: implements
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 10_Deployment_Inference/SGLang_Deep_Dive.md
summary: RadixAttention 是 SGLang 提出的基于基数树的 KV Cache 复用技术，自动检测并缓存共享 prompt 前缀，支持分支前缀匹配。在多轮对话、Agent 循环、RAG 等场景下比 vLLM APC 快 10-20%，是 2026 年动态多轮场景的最优选择。
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

# RadixAttention

## 核心要点

- **基数树结构的 KV Cache 管理**：将 KV Cache 组织为 Radix Tree，自动发现和复用共享前缀
- **分支匹配**：不同于 vLLM APC 的线性哈希匹配，RadixAttention 支持树形分支匹配，适合多候选路径场景
- **零配置自动优化**：无需应用层改动，SGLang 自动识别可复用的 KV Cache 前缀
- **动态场景最优**：多轮对话、Agent 循环、RAG 等不可预测对话流场景下比 vLLM 快 10-20%

## 详细内容

### Radix Tree 数据结构

RadixAttention 将每个 token 序列的 KV Cache 组织为基数树（压缩前缀树）：

```
Root
├── [System Prompt] (shared) → KV Cache A
│   ├── [User Turn 1] → KV Cache B1
│   │   ├── [Assistant Reply 1] → KV Cache C1
│   │   │   └── [User Turn 2] → KV Cache D1
│   │   └── [Alternative Reply] → KV Cache C2
│   └── [Different User Turn 1] → KV Cache B2
└── [Different System] → KV Cache E
```

- 共享前缀只计算一次，后续请求直接复用
- 分支点自动识别，支持多候选路径并行探索

### 与 vLLM APC 对比

| 特性 | vLLM APC | SGLang RadixAttention |
|------|---------|---------------------|
| **匹配方式** | 基于哈希的精确前缀匹配 | 基数树的结构化前缀匹配 |
| **分支支持** | 仅线性前缀 | 支持树形分支 |
| **配置** | 需手动开启或配置 | 零配置自动优化 |
| **最佳场景** | 模板化 batch 推理 | 动态多轮对话/Agent |
| **性能差异** | 静态前缀场景持平 | 动态分支场景快 10-20% |

### 适用场景

| 场景 | RadixAttention 优势 |
|------|-------------------|
| **多轮对话** | 自动缓存对话历史前缀，后续轮次无需重算 |
| **Agent 循环** | 多候选 action 路径共享 system prompt + 工具调用前缀 |
| **RAG 系统** | 多个查询共享相同的文档上下文前缀 |
| **Monte Carlo 解码** | 多条采样路径共享公共前缀 |
| **多租户 SaaS** | 每个租户的知识库作为独立分支 |

### 实测性能（RunPod H100 × 2, DeepSeek-R1-70B）

| 测试 | SGLang (tok/s) | vLLM (tok/s) | 优势 |
|------|---------------|-------------|------|
| 7K context, fresh | 29.5 | 28.6 | 持平 |
| 7K context, cache hit | **35.0** | 32.8 | **+7%** |
| Small context | 36.1 | 36.1 | 持平 |

缓存命中时 SGLang 优势明显，尤其在复杂多轮场景下差距更大。

## 来源

- LMSYS, "Fast and Expressive LLM Inference with RadixAttention and SGLang", 2024
- Zheng et al., "SGLang: Efficient Execution of Structured Language Model Programs", arXiv:2312.07104
- RunPod benchmark: https://www.runpod.io/blog/sglang-vs-vllm-kv-cache

## Related

- [[_concepts/kv-cache]] — KV Cache（RadixAttention 优化的对象）
- [[_concepts/prefix-caching]] — 前缀缓存（RadixAttention 是其中一种实现）
- [[_concepts/paged-attention]] — PagedAttention（底层内存管理）
- [[10_Deployment_Inference/SGLang_Deep_Dive]] — SGLang 推理框架（RadixAttention 首发）
- [[10_Deployment_Inference/vLLM_Deep_Dive]] — vLLM（Automatic Prefix Caching）
- [[10_Deployment_Inference/LMDeploy_Deep_Dive]] — LMDeploy（Prefix Caching）
