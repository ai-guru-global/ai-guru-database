---
title: "KV Cache x PagedAttention: 从显存碎片到虚拟内存的推理革命"
category: synthesis
tags: [kv-cache, paged-attention, inference, memory-management, vllm, optimization, gpu]
sources: [概念/LLM/kv-cache.md, 概念/paged-attention.md]
summary: "KV Cache 是自回归推理的性能基石，但显存碎片化使其利用率仅 50-65%；PagedAttention 借鉴操作系统虚拟内存分页思想，将利用率提升至 95%+，成为 2026 年所有主流推理引擎的必选基座。"
created: 2026-07-02
updated: 2026-07-02
tier: core
lifecycle: draft
---

# KV Cache x PagedAttention: 从显存碎片到虚拟内存的推理革命

## The Connection

KV Cache 和 PagedAttention 解决的是同一个问题的两个层面：**KV Cache 回答"为什么要缓存"，PagedAttention 回答"怎么高效缓存"**。

KV Cache 是自回归 LLM 推理的核心优化——缓存已计算的 Key/Value 向量，避免每个新 token 都重算整个序列的注意力，将时间复杂度从 O(T^2) 降至 O(T)。但传统实现为每个请求预分配连续显存空间（按最大序列长度），导致严重的内存碎片：

- **内部碎片**：请求实际长度 < 预分配长度，浪费 30-50% 显存
- **外部碎片**：请求完成后释放的中间空洞无法被新请求利用
- 典型 bursty 流量下，有效利用率仅 50-65%

PagedAttention 的核心洞察是：**操作系统的虚拟内存分页机制恰好能解决这个问题**。将 KV Cache 分成固定大小的 block，通过 block table 间接寻址，按需分配而非预分配——这正是 OS 页表在 GPU 显存上的翻版。

## Where They Co-occur

- vLLM（PagedAttention 首发实现）将两者深度耦合：KV Cache 的存储、分配、回收全部通过 PagedAttention 管理
- SGLang 的 RadixAttention 在 PagedAttention 基础上增加了树形前缀共享，进一步优化多轮对话场景的 KV Cache 复用
- TensorRT-LLM 的 Paged KV Cache 实现与 vLLM 兼容，支持 In-Flight Batching 时的动态 block 分配
- LMDeploy 的 TurboMind 引擎独立实现了类似的分页 KV Cache 管理
- 2026 年所有主流推理引擎均默认启用 PagedAttention 作为 KV Cache 的底层存储方案

## Key Connections

### 1. 从连续分配到分页分配：显存管理的范式转换

```
传统 KV Cache 管理（连续分配）:
═══════════════════════════════════════════════════════════

请求 A (max_seq=2048, 实际=800):
  [████████░░░░░░░░░░░░░░░░░░░░]  ← 浪费 60%（内部碎片）

请求 B (max_seq=2048, 实际=1500):
  [██████████████░░░░░░]  ← 浪费 27%

请求 C (max_seq=2048, 实际=400):
  [████░░░░░░░░░░░░░░░░░░░░░░░░]  ← 浪费 80%

GPU 显存: [AAA...][空洞][BBB...][空洞][CCC...][空洞]
          ← 空洞之间无法被新请求利用（外部碎片）

有效利用率: ~50-65%


PagedAttention（分页分配）:
═══════════════════════════════════════════════════════════

Block Table:
  A → [block_3, block_7, block_12]
  B → [block_1, block_5, block_8, block_11, block_15]
  C → [block_2, block_4]

物理显存:
  [B0][C0][C1][A0][B3][B1][A2][A1][B2][  ][B4][  ][A2][  ][B4]
  ← 所有 block 填满，无空洞

有效利用率: 95%+
```

### 2. Block 的生命周期管理

PagedAttention 将 KV Cache 的管理粒度从"请求级"细化到"block 级"，这使得 block 可以独立于请求进行生命周期管理：

```
Block 生命周期:
  创建 → 分配给请求 → 写入 KV 数据 → [可能被共享] → 释放
  
关键操作:
├── allocate_block(): 从 free block pool 取一个空 block
├── write_kv(block, layer, tokens): 写入 K/V 向量
├── read_kv(block, layer, tokens): 通过 block table 间接读取
├── share_block(block): 多个请求共享同一 block（前缀缓存）
├── copy_on_write(block): 共享 block 需要修改时复制一份
└── free_block(block): 归还到 free block pool
```

**Copy-on-Write 机制**：当两个请求共享前缀 block 时（如 system prompt 的 KV Cache），如果其中一个请求需要修改（如追加 token），PagedAttention 会复制该 block 而非直接修改——这与 OS 进程 fork 时的 CoW 完全一致。

### 3. KV Cache 显存公式与 PagedAttention 的影响

```
单请求 KV Cache 大小 = seq_len x n_layers x 2(K+V) x d_kv x n_heads x bytes_per_value

以 Llama 70B + 128K 上下文 + FP16 为例:
= 128K x 80 x 2 x 128 x 8 x 2 bytes = 17.3 GB

传统方式: 预分配 17.3 GB（即使实际只用 4K tokens = 0.54 GB）
PagedAttention: 按需分配，4K tokens 只需 0.54 GB

PagedAttention 节省 = (17.3 - 0.54) / 17.3 = 96.9%（对于短请求）
```

**核心影响**：PagedAttention 使得同一张 GPU 能同时服务更多请求。如果传统方式只能同时放 4 个请求的 KV Cache，PagedAttention 可以放 8-16 个（取决于实际长度分布），吞吐量提升 2-4x。

### 4. 参数调优：block_size 的权衡

| block_size | 显存浪费（内部碎片） | 页表大小 | 查找开销 | 推荐场景 |
|-----------|-------------------|---------|---------|---------|
| 8 tokens | 极低（<2%） | 大 | 较高 | 极短序列、精度敏感 |
| 16 tokens | 低（<5%） | 中等 | 适中 | **2026 默认值** |
| 32 tokens | 中等（<10%） | 小 | 较低 | 长序列、高吞吐 |
| 64 tokens | 较高 | 很小 | 最低 | 超长上下文（128K+） |

block_size 选择的本质是 **空间开销 vs 时间开销** 的权衡：
- block_size 太小：页表膨胀，attention kernel 的间接寻址开销增加
- block_size 太大：每个 block 的最后一个 block 可能浪费大量空间（内部碎片）

### 5. 五大 KV Cache 优化层与 PagedAttention 的位置

```
KV Cache 优化技术栈（从底到顶叠加）
│
├── Layer 1: PagedAttention ← 本页面焦点
│   消除显存碎片，利用率 50-65% → 95%+
│   所有上层优化的前提条件
│
├── Layer 2: 前缀缓存（Prefix Caching）
│   复用共享 prompt prefix 的 KV Cache block
│   依赖 PagedAttention 的 block 级管理
│   vLLM APC (哈希匹配) / SGLang RadixAttention (树形匹配)
│
├── Layer 3: 注意力压缩（MQA/GQA/MLA）
│   从模型架构层面减少 KV 头数和维度
│   与 PagedAttention 正交——压缩后的 KV 仍用分页管理
│
├── Layer 4: KV 量化（FP8/INT8）
│   减少每个 value 的字节数
│   量化的 KV block 仍通过 PagedAttention 管理
│
└── Layer 5: 滑动窗口
    限制注意力范围，恒定内存
    与 PagedAttention 互补——窗口内仍用分页管理
```

**叠加效应**：PagedAttention 是 Layer 1，是所有上层优化的基座。MLA + FP8 + Prefix Cache + PagedAttention 四者叠加可实现 4-40x 的长上下文推理成本压缩。

## Decision Framework

### PagedAttention 参数配置决策树

```
你的推理场景是什么？
│
├── 高并发短文本（聊天、RAG）
│   ├── block_size: 16
│   ├── gpu_memory_utilization: 0.90
│   └── max_num_batched_tokens: 大（如 8192）
│
├── 低并发长文本（文档分析、代码生成）
│   ├── block_size: 32
│   ├── gpu_memory_utilization: 0.95
│   └── max_num_batched_tokens: 中等（如 4096）
│
├── 超长上下文（128K+）
│   ├── block_size: 64
│   ├── gpu_memory_utilization: 0.95
│   ├── 启用 KV Cache 量化（FP8）
│   └── 考虑 MLA 架构模型（如 DeepSeek-V3）
│
└── 混合负载（长短交错）
    ├── block_size: 16（默认）
    ├── 启用 Chunked Prefill
    └── 启用 Prefix Caching
```

### 何时 PagedAttention 不是最优解？

| 场景 | PagedAttention 表现 | 替代方案 |
|------|-------------------|---------|
| 极短序列（<64 tokens） | 页表查找开销 > 收益 | 传统连续分配 |
| 单请求独占 GPU | 碎片不是问题 | 无需分页 |
| CUDA 虚拟内存可用 | 间接寻址开销 | vAttention（CUDA VMM API） |
| Mamba/SSM 架构 | 无 KV Cache | 不需要分页 |

## Practical Guide

### 监控与调优

```bash
# 查看 vLLM 的 KV Cache 使用情况
curl http://localhost:8000/metrics | grep vllm_cache

# 关键指标:
# vllm:gpu_cache_usage_perc  — 当前 GPU KV Cache 使用率
# vllm:cpu_cache_usage_perc  — 当前 CPU KV Cache 使用率（swap）
# vllm:num_preemptions_total — 被抢占的请求数（应趋近 0）
# vllm:gpu_prefix_cache_hit_rate — 前缀缓存命中率
```

**调优信号**：
- `gpu_cache_usage_perc > 0.95`：KV Cache 接近满载，考虑增加 GPU 或降低 `max_num_seqs`
- `num_preemptions_total` 持续增长：显存不足导致请求被抢占，需扩容或优化
- `gpu_prefix_cache_hit_rate < 0.3`：前缀缓存未生效，检查是否有共享 system prompt

## Tensions and Trade-offs

- **显存效率 vs 计算开销**：PagedAttention 的 block table 查找增加 ~2-5% 的 attention 计算开销，在极短序列上得不偿失
- **block_size 选择**：太大浪费显存（内部碎片），太小增加页表大小和查找延迟——需要根据实际序列长度分布调优
- **与 Continuous Batching 的耦合**：PagedAttention 的细粒度管理使得 Continuous Batching 成为可能，但也意味着调度器必须处理更复杂的 block 分配逻辑
- **vAttention 的挑战**：2025 年提出的 vAttention 使用 CUDA 虚拟内存 API 替代 PagedAttention，保持 KV Cache 在连续物理内存中——可能在未来成为替代方案
- **多 GPU 场景**：Tensor Parallel 下每张 GPU 管理独立的 KV Cache block table，跨 GPU 的前缀共享需要额外协调

## Open Questions

- CXL 3.0 内存扩展能否突破 GPU 显存物理上限，让 PagedAttention 管理的 block pool 扩展到主机内存甚至其他设备？
- 当 KV Cache 量化（FP8）与 PagedAttention 结合时，量化误差是否在 block 边界处累积？
- Mamba/SSM 等非 Transformer 架构的"状态缓存"是否也能借鉴 PagedAttention 的分页管理思想？
- 未来是否会出现硬件级的"KV Cache 管理单元"——类似 MMU 之于虚拟内存？

## Related

- [[概念/kv-cache]] -- KV Cache（PagedAttention 管理的对象）
- [[概念/paged-attention]] -- PagedAttention（KV Cache 的虚拟内存管理）
- [[概念/continuous-batching]] -- Continuous Batching（与 PagedAttention 协同的调度技术）
- [[概念/multi-head-latent-attention]] -- MLA（架构层压缩 KV Cache）
- [[概念/prefix-caching]] -- 前缀缓存（复用共享 prompt prefix）
- [[概念/kv-cache-compression]] -- KV Cache 压缩
- [[部署推理/Inference_Engines/vLLM_Deep_Dive]] -- vLLM（PagedAttention 首发实现）
- [[部署推理/Inference_Engines/SGLang_Deep_Dive]] -- SGLang（RadixAttention 的内存管理）
- [[部署推理/Caching/KV_Cache_Deep_Dive]] -- KV Cache 深度研究
- [[治理/paged-attention-continuous-batching]] -- PagedAttention x Continuous Batching
- [[治理/kv-cache-inference-optimization]] -- KV Cache x 推理优化
