---
title: "KV Cache x Continuous Batching: 推理引擎的显存-调度协同优化"
category: synthesis
tags: [kv-cache, continuous-batching, inference, memory-pressure, prefill, decode, chunked-prefill, prefix-caching]
sources: [_concepts/kv-cache.md, _concepts/continuous-batching.md]
summary: "KV Cache 是 Continuous Batching 的显存约束——batch 中每个请求的 KV Cache 占用决定了系统能同时服务多少请求。现代推理引擎通过 prefix caching、chunked prefill 和 prefill/decode 分离等策略，同时优化两者以实现最大吞吐。"
created: 2026-07-02
updated: 2026-07-02
tier: core
lifecycle: draft
---

# KV Cache x Continuous Batching: 推理引擎的显存-调度协同优化

## The Connection

KV Cache 和 Continuous Batching 的关系是一个典型的**资源约束与调度策略**的博弈：

- **KV Cache 是 Continuous Batching 的物理约束**：batch 中每个活跃请求都需要占用 KV Cache 显存。当 KV Cache 接近满载时，调度器无法接受新请求，甚至需要抢占（preempt）现有请求
- **Continuous Batching 放大了 KV Cache 的管理难度**：动态插入/移出请求意味着 KV Cache 的占用模式从"静态可预测"变为"动态不可预测"
- **Prefill 阶段是两者的核心冲突点**：新请求的 prefill 会瞬间占用大量 KV Cache 和 GPU 算力，影响正在 decode 的其他请求

理解这个三角关系（KV Cache 容量 - 调度策略 - Prefill/Decode 阶段差异），是设计高效推理系统的关键。

## Where They Co-occur

- vLLM 的 Scheduler 每个 decode step 检查 KV Cache 使用率，决定是否接受新请求或抢占低优先级请求
- SGLang 的 RadixAttention 通过树形前缀匹配复用 KV Cache，减少 Continuous Batching 中重复 prefill 的显存开销
- TGI (Text Generation Inference) 的 HuggingFace 实现在 Continuous Batching 中使用 TensorCache 管理 KV Cache
- TensorRT-LLM 的 In-Flight Batching 通过 Paged KV Cache + 动态调度实现类似效果
- 所有现代推理引擎的 Scheduler 都将 KV Cache 使用率作为核心调度约束

## Key Connections

### 1. KV Cache 容量决定并发上限

```
并发请求上限 = 可用 KV Cache 显存 / 单请求平均 KV Cache 占用

示例: H100 80GB, 模型 Llama 70B (140GB, 需 TP=2)
  每张 GPU 可用显存: 80GB - 70GB(模型) = 10GB
  PagedAttention 利用率: 95% → 可用 9.5GB
  单请求 4K tokens KV Cache: ~0.54GB (FP16)
  
  理论并发上限: 9.5 / 0.54 ≈ 17 个请求/GPU
  双 GPU 总并发: ~34 个请求
```

**这个计算说明了一个关键事实**：在 LLM 推理中，**限制并发数的不是 GPU 算力，而是 KV Cache 显存容量**。Continuous Batching 的调度器必须时刻监控 KV Cache 使用率，确保不超过物理上限。

### 2. Prefill vs Decode：两个阶段的资源画像差异

| 维度 | Prefill 阶段 | Decode 阶段 |
|------|-------------|-------------|
| **计算特征** | 计算密集型（大规模矩阵乘） | 访存密集型（逐 token 生成） |
| **KV Cache 操作** | 一次性写入大量 KV | 逐步追加少量 KV |
| **GPU 利用率** | 高（并行处理 prompt） | 低（单 token 计算量小） |
| **延迟敏感度** | TTFT（用户等待首 token） | TPOT（流式输出流畅度） |
| **对 batch 的影响** | 阻塞 decode 请求 | 与其他 decode 并行 |

**核心矛盾**：当一个新请求进入 Continuous Batching 的 batch 时，它需要先执行 prefill——这是一个计算密集的大操作，会与正在 decode 的其他请求竞争 GPU 算力，导致 decode 延迟抖动。

### 3. Chunked Prefill：缓解 Prefill/Decode 冲突

Chunked Prefill 是解决 prefill-decode 冲突的核心技术：

```
无 Chunked Prefill:
  Step 1: Prefill A (4096 tokens)  → B,C,D decode 被阻塞 50ms
  Step 2: Decode A, B, C, D

有 Chunked Prefill (chunk_size = 512):
  Step 1: Prefill A[0:512]    + Decode B, C, D  → decode 仅延迟 6ms
  Step 2: Prefill A[512:1024] + Decode B, C, D
  ...
  Step 8: Prefill A[3584:4096] + Decode B, C, D
  Step 9: Decode A, B, C, D
```

KV Cache 与 Chunked Prefill 的交互：
- 每个 chunk 的 prefill 结果写入 KV Cache 的对应 blocks
- PagedAttention 使得逐 chunk 分配 blocks 成为可能（不需要为整个 prompt 预分配）
- 最后一个 chunk prefill 完成后，请求的完整 KV Cache 已就位，可以开始 decode

### 4. Prefix Caching：减少重复 Prefill 的 KV Cache 开销

在多轮对话和 RAG 场景中，多个请求共享相同的 system prompt 或对话历史。Prefix Caching 通过复用已计算的 KV Cache blocks，避免重复 prefill：

```
Prefix Caching 示例:
═══════════════════════════════════════════════════════════

Request 1: [system prompt (512 tokens)] [user msg 1 (100 tokens)]
Request 2: [system prompt (512 tokens)] [user msg 2 (150 tokens)]
Request 3: [system prompt (512 tokens)] [user msg 3 (80 tokens)]

无 Prefix Caching:
  3 个请求各自 prefill system prompt → 3 x 512 = 1536 tokens prefill
  KV Cache 占用: 3 x system prompt blocks

有 Prefix Caching (vLLM APC):
  仅 Request 1 prefill system prompt → 512 tokens prefill
  Request 2, 3 直接引用 Request 1 的 system prompt blocks
  KV Cache 占用: 1 x system prompt blocks (共享) + 各自独有部分
  节省: ~67% 的 system prompt KV Cache
```

两种主流实现：
- **vLLM Automatic Prefix Cache (APC)**：基于 hash 匹配，将 prompt 按 block 粒度计算 hash，相同 hash 的 block 直接复用
- **SGLang RadixAttention**：基于 radix tree（基数树）匹配，支持更灵活的前缀共享，包括中间节点的共享

### 5. 调度器决策：KV Cache 感知的 Continuous Batching

现代推理引擎的调度器在每个 step 做出如下决策：

```
Scheduler 决策流程 (每步执行):
═══════════════════════════════════════════════════════════

1. 计算当前 KV Cache 使用率
   current_usage = allocated_blocks / total_blocks

2. 检查完成请求 → 释放 blocks
   for req in completed:
       free_blocks(req.block_table)

3. 检查等待队列 → 尝试调度新请求
   for req in waiting_queue:
       needed_blocks = estimate_blocks(req)
       if current_usage + needed_blocks < threshold:
           allocate_blocks(req)
           add_to_batch(req)
       else:
           break  # KV Cache 不足，停止接受新请求

4. 检查是否需要抢占
   if current_usage > preemption_threshold:
       victim = select_lowest_priority(batch)
       preempt(victim)  # swap 或 recompute

5. 执行当前 step (prefill chunks + decode)
```

**关键调度策略**：

| 策略 | 触发条件 | 行为 | 影响 |
|------|---------|------|------|
| **接受新请求** | KV Cache 充足 | 分配 blocks + prefill | 增加并发 |
| **拒绝新请求** | KV Cache 不足 | 保留在等待队列 | 增加 TTFT |
| **抢占低优先级** | KV Cache 接近满载 | swap/recompute victim | 保护高优先级 |
| **Chunked Prefill** | 长 prompt 进入 | 分块 prefill | 降低 decode 延迟抖动 |
| **Prefix Cache 命中** | 相同前缀 | 复用 blocks | 减少 prefill 时间 |

### 6. 不同推理引擎的优化策略对比

| 引擎 | KV Cache 管理 | 调度策略 | 前缀缓存 | Prefill 优化 |
|------|-------------|---------|---------|-------------|
| **vLLM** | PagedAttention | Continuous Batching | APC (hash) | Chunked Prefill |
| **SGLang** | PagedAttention | 零开销调度 | RadixAttention (tree) | Chunked Prefill |
| **TensorRT-LLM** | Paged KV Cache | In-Flight Batching | 有限支持 | Chunked Prefill |
| **TGI** | TensorCache | Continuous Batching | 有限支持 | Chunked Prefill |
| **LMDeploy** | TurboMind Paging | Continuous Batching | 支持 | 支持 |

## Decision Framework

### Prefill/Decode 分离 vs 混合部署

| 架构 | 描述 | 优势 | 劣势 | 适用场景 |
|------|------|------|------|---------|
| **混合部署** | Prefill 和 Decode 在同一 GPU | 架构简单，无需网络通信 | Prefill 阻塞 Decode | 中小规模、成本敏感 |
| **分离部署 (PD Disagg)** | Prefill GPU 和 Decode GPU 分开 | 各自优化，无相互干扰 | 需传输 KV Cache，架构复杂 | 大规模、延迟敏感 |

```
PD 分离架构数据流:
═══════════════════════════════════════════════════════════

[Prefill GPU]                    [Decode GPU]
  接收新请求                        接收已完成 prefill 的请求
  执行 prefill                     逐步 decode
  生成完整 KV Cache                每步追加 1 token 的 KV
       │                                │
       └──── KV Cache 传输 ────────────→│
              (NCCL/RDMA)               │
                                        ↓
                                    生成完成 → 释放
```

**KV Cache 传输是 PD 分离的核心挑战**：
- 128K tokens 的 KV Cache (Llama 70B FP16) 约 17.3 GB
- 通过 NVLink 传输约 30-50ms，通过 PCIe 约 100-200ms
- 压缩传输（FP8）可减少 50% 传输量

### 推理引擎选型与 KV Cache-调度协同

```
你的优先目标是什么？
│
├── 最大吞吐量（成本优先）
│   ├── 推荐: vLLM + PagedAttention + Continuous Batching
│   ├── 启用: Prefix Caching, Chunked Prefill
│   └── 参数: max_num_seqs=512, gpu_memory_utilization=0.95
│
├── 最低延迟（体验优先）
│   ├── 推荐: TensorRT-LLM + In-Flight Batching
│   ├── 禁用: Chunked Prefill（避免 prefill 干扰 decode）
│   └── 参数: max_num_seqs=64, 预留更多显存给 batch
│
├── 最佳前缀复用（多轮对话/RAG）
│   ├── 推荐: SGLang + RadixAttention
│   ├── RadixAttention 的树形匹配比 hash 匹配更灵活
│   └── 命中率可达 60-85%
│
└── 超长上下文（128K+）
    ├── 推荐: vLLM + MLA 模型 + FP8 KV Cache
    ├── 必须: PagedAttention (否则碎片率极高)
    └── 考虑: PD 分离架构
```

## Practical Guide

### 监控 KV Cache 与调度的关键指标

| 指标 | 含义 | 健康范围 | 异常处理 |
|------|------|---------|---------|
| `gpu_cache_usage` | KV Cache 使用率 | 60-90% | >95%: 扩容或减少并发 |
| `num_preemptions` | 抢占次数 | 趋近 0 | 持续增长: 显存不足 |
| `prefix_cache_hit_rate` | 前缀缓存命中率 | >50% (多轮场景) | <20%: 检查 prompt 模板 |
| `ttft_p50` | 首 token 延迟中位数 | <500ms | >2s: prefill 阻塞或排队 |
| `tpot_p50` | 每 token 延迟中位数 | <50ms | >100ms: batch 太大 |
| `e2e_latency_p99` | 端到端延迟 P99 | <10s | 取决于输出长度 |

### 常见调优场景

**场景 1: TTFT 过高**
- 原因: 新请求的 prefill 排队等待
- 方案: 减小 chunked prefill chunk size，增加 prefill 优先级
- 参数: `--enable-chunked-prefill --max-num-partial-prefills 2`

**场景 2: TPOT 抖动大**
- 原因: prefill 和 decode 混合执行，prefill 阻塞 decode
- 方案: 减小 max_num_batched_tokens，限制每步 prefill 量
- 参数: `--max-num-batched-tokens 2048`

**场景 3: 前缀缓存命中率低**
- 原因: 不同请求的 system prompt 有微小差异（如时间戳）
- 方案: 将可变部分移出 prefix 区域
- 配置: 确保 system prompt 的前 N 个 block 完全相同

## Tensions and Trade-offs

- **KV Cache 容量 vs 模型大小**：两者竞争同一块 GPU 显存。更大的模型意味着更少的 KV Cache 空间，限制了 Continuous Batching 的并发上限
- **Prefill 速度 vs Decode 稳定性**：更快的 prefill（更大的 chunk）意味着更低的 TTFT，但更大的 decode 延迟抖动
- **Prefix Caching 的内存代价**：缓存的 KV blocks 占用显存但不属于任何活跃请求。高命中率时收益大，低命中率时反而浪费显存
- **PD 分离的传输开销**：KV Cache 在 GPU 间传输引入额外延迟，短请求可能得不偿失
- **抢占的连锁反应**：被抢占的请求恢复时需要重新分配 blocks，可能触发新一轮抢占

## Open Questions

- KV Cache 的显存占用能否通过 offloading 到 CXL 扩展内存或远端内存池来突破 GPU 显存物理上限？
- Prefill/Decode 分离架构中，KV Cache 的传输能否利用计算-通信重叠（overlap）来隐藏延迟？
- SGLang 的 RadixAttention 能否扩展到跨请求的"语义前缀共享"——不仅匹配相同文本，还匹配语义相近的 prompt？
- 当 KV Cache 使用 FP8 量化时，Chunked Prefill 的边界处是否会出现精度损失？

## Related

- [[_concepts/kv-cache]] -- KV Cache（推理的显存瓶颈）
- [[_concepts/continuous-batching]] -- Continuous Batching（调度优化）
- [[_concepts/paged-attention]] -- PagedAttention（KV Cache 的分页管理）
- [[_concepts/prefix-caching]] -- 前缀缓存（复用共享 prompt prefix）
- [[_concepts/kv-cache-compression]] -- KV Cache 压缩
- [[_concepts/multi-head-latent-attention]] -- MLA（架构层 KV Cache 压缩）
- [[_synthesis/kv-cache-paged-attention]] -- KV Cache x PagedAttention
- [[_synthesis/paged-attention-continuous-batching]] -- PagedAttention x Continuous Batching
- [[_synthesis/serving-deployment]] -- 模型服务 x 模型部署
- [[部署推理/Inference_Engines/vLLM_Deep_Dive]] -- vLLM 深度解析
- [[部署推理/Inference_Engines/SGLang_Deep_Dive]] -- SGLang 深度解析
- [[部署推理/Caching/KV_Cache_Deep_Dive]] -- KV Cache 深度研究
