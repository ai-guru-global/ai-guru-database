---
title: "FlashInfer 算子库 (FlashInfer Kernel Library)"
category: -concepts
tags: ["flashinfer", "inference-kernel", "attention", "paged-attention", "mlsys", "sglang", "cuda", "cascade-attention"]
relationships:
  - target: "概念/Inference/flash-attention-kernels"
    type: related_to
  - target: "概念/Inference/paged-attention"
    type: related_to
  - target: "概念/Inference/speculative-decoding"
    type: enables
  - target: "概念/Inference/sglang"
    type: used_by
  - target: "概念/Inference/prefix-caching"
    type: enables
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
  - "https://arxiv.org/abs/2501.01005"  # FlashInfer paper
summary: "FlashInfer 是面向 LLM Serving 的高性能注意力算子库，MLSys 2025 Best Paper。为 SGLang 提供底层 PagedAttention/Cascade Attention 算子，支持 KV Cache 共享、推测解码、变长批处理，是 2026 年推理引擎的核心算子基础设施。"
provenance:
  extracted: 0.40
  inferred: 0.50
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "FlashInfer"
  - "FlashInfer Kernel"
  - "FlashInfer 算子库"

name_zh: "FlashInfer 算子库"
---

# FlashInfer 算子库

> 中文简称：FlashInfer 算子库

> **一句话理解**: FlashInfer 是 LLM 推理的“注意力算子引擎”——MLSys 2025 Best Paper，为 SGLang/vLLM 等框架提供底层高效注意力计算。

## 定位与背景

| 维度 | 信息 |
|------|------|
| **项目** | FlashInfer |
| **来源** | 港大/CMU/SGLang 团队 |
| **荣誉** | MLSys 2025 Best Paper |
| **功能** | LLM Serving 注意力算子库 |
| **语言** | CUDA C++ + Python 绑定 |
| **GitHub** | github.com/flashinfer-ai/flashinfer |
| **主要用户** | SGLang (默认)、vLLM (可选) |

## 核心算子矩阵

| 算子 | 功能 | 性能特点 | 应用场景 |
|------|------|----------|----------|
| **BatchDecode** | 批量解码注意力 | 高吞吐，变长 batch | 每个 decode step |
| **BatchPrefill** | 批量预填充注意力 | 低延迟，chunked | 新请求 prefill |
| **Cascade Attention** | 级联注意力（前缀共享） | 减少 40-60% 重复计算 | 多轮对话 |
| **Paged KV Cache** | 分页式 KV 管理 | 显存零碎片 | 所有场景 |
| **Speculative Decoding** | 推测解码验证 | 2-3× 加速 | 延迟敏感 |
| **Shared Prefix** | 共享前缀注意力 | Multi-turn 优化 | Agent/对话 |
| **Append KV** | 增量 KV 写入 | 零拷贝 | 每步 decode |
| **RoPE** | 旋转位置编码 | 融合计算 | 每层 attention |

## 在推理框架中的位置

```
LLM 推理引擎架构
│
├── 应用层
│   ├── SGLang ← 默认使用 FlashInfer
│   ├── vLLM ← 可选 FlashInfer 后端
│   └── TensorRT-LLM ← 自研算子
│
├── 算子层
│   ├── FlashInfer ← 本文（Serving 专用）
│   ├── FlashAttention 1/2/3 ← 通用注意力
│   ├── FlashMLA ← DeepSeek MLA 专用
│   └── Triton Kernels ← 自定义算子
│
└── 硬件层
    ├── NVIDIA GPU (Tensor Core, CUDA)
    └── AMD GPU (ROCm, 实验性)
```

## 与同类算子库对比

| 维度 | FlashInfer | FlashAttention 3 | FlashMLA |
|------|-----------|---------------|--------|
| **来源** | 港大/SGLang | Stanford (Tri Dao) | DeepSeek |
| **专注场景** | LLM Serving | 通用注意力 | MLA 注意力 |
| **KV Cache** | Paged 原生支持 | 不支持 Paged | 支持 |
| **推测解码** | ✅ 原生 | ❌ | ❌ |
| **前缀共享** | ✅ Cascade | ❌ | ❌ |
| **变长 Batch** | ✅ 原生 | 需 padding | ✅ |
| **框架集成** | SGLang 默认 | 广泛 | vLLM |
| **MLSys Best Paper** | 2025 | 2023 | - |
| **FP8 支持** | ✅ | ✅ | ✅ |

## Cascade Attention 原理

多轮对话中，多个请求共享 System Prompt 前缀：

```
传统方式：每个请求独立计算前缀注意力
Request 1: [System 10K][User1 200][Reply1 500]
Request 2: [System 10K][User2 150][Reply2 300]
→ 重复计算 System 10K tokens 的注意力

Cascade Attention：
├── Level 0: 共享前缀 [System 10K] → 只计算一次
├── Level 1: 各请求增量部分独立计算
└── Merge: 合并共享 + 增量结果
→ 节省 40-60% 计算量，前缀越长收益越大
```

### 性能收益量化

| 场景 | 前缀长度 | 请求数 | 计算节省 | 延迟降低 |
|------|:------:|:----:|:------:|:------:|
| Agent 工具调用 | 8K | 16 | 55% | 40% |
| 多轮对话 | 4K | 8 | 45% | 35% |
| RAG 查询 | 32K | 32 | 70% | 55% |
| 多采样 | 2K | 64 | 60% | 50% |

## API 使用示例

```python
import flashinfer
import torch

# 1. 批量解码注意力 (Paged KV Cache)
batch_size = 32
num_heads = 32
head_dim = 128
page_size = 16

# 初始化 Paged KV Cache
kv_cache = torch.randn(batch_size * 256, 2, num_heads, page_size, head_dim,
                       device="cuda", dtype=torch.float16)

# 创建 wrapper
wrapper = flashinfer.BatchDecodeWithPagedKVCacheWrapper(
    workspace_buffer=torch.empty(128 * 1024 * 1024, device="cuda"),
    kv_layout="NHD"
)

# 计划 + 执行
wrapper.plan(page_table, kv_indptr, last_page_len, num_heads, head_dim, page_size)
output = wrapper.run(query, kv_cache)

# 2. Cascade Attention (前缀共享)
wrapper_shared = flashinfer.BatchDecodeWithPagedKVCacheWrapper(...)
wrapper_local = flashinfer.BatchDecodeWithPagedKVCacheWrapper(...)

# 共享前缀只计算一次
output_shared = wrapper_shared.run(query, shared_kv_cache)
output_local = wrapper_local.run(query, local_kv_cache)
# 合并结果
output = flashinfer.merge_state(output_shared, output_local)
```

## 2026 生态进展

| 特性 | 状态 | 说明 |
|------|------|------|
| FlashInfer v0.2+ | ✅ 稳定 | SGLang 默认算子后端 |
| FP8 Attention | ✅ | Hopper/Blackwell 架构 |
| Cascade Inference | ✅ | 多级前缀共享 |
| Speculative Decoding | ✅ | EAGLE-2 集成 |
| ROCm 支持 | 🟡 实验 | AMD MI300X |
| MLA 支持 | ✅ | DeepSeek-V3 兼容 |
| JIT 编译 | ✅ | 自动调优 kernel 参数 |
| vLLM 集成 | ✅ 可选 | 替代自研 PagedAttention |

## 生产最佳实践

1. **优先用 SGLang 集成**：FlashInfer 作为 SGLang 默认后端，无需单独配置
2. **启用 Cascade Attention**：多轮对话/Agent 场景自动触发，确保前缀稳定
3. **Paged KV page_size=16**：默认值在大多数场景最优，超长上下文可尝试 32
4. **FP8 注意力量化**：H100/B200 上启用 FP8 可提升 30%+ 吞吐，精度损失微小
5. **监控 workspace 内存**：默认 128MB，超大 batch 可能需增加
6. **JIT 编译缓存**：首次运行会编译 kernel，生产环境预热后再接受流量

## 开放问题

- 超长上下文 (>1M tokens) 下 Cascade Attention 的多级拆分策略
- 与 MoE 模型的注意力算子协同优化
- ROCm 后端的性能差距缩小

## Related

- [[概念/Inference/flash-attention-kernels]] — FlashAttention 算子系列
- [[概念/Inference/paged-attention]] — PagedAttention 虚拟内存式 KV 管理
- [[概念/Inference/speculative-decoding]] — 投机解码
- [[概念/Inference/continuous-batching]] — Continuous Batching
- [[概念/Inference/sglang]] — SGLang 推理引擎
- [[概念/Inference/prefix-caching]] — 前缀缓存
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析]] — AI Stack 深度解析
