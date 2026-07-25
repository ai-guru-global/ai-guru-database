---
title: "PagedAttention x Continuous Batching: 内存效率与动态调度的双重引擎"
category: synthesis
tags: [paged-attention, continuous-batching, inference, vllm, scheduling, throughput, memory-management]
sources: [概念/paged-attention.md, 概念/continuous-batching.md]
summary: "PagedAttention 解决显存碎片问题，Continuous Batching 解决调度浪费问题——两者天然互补：分页内存管理使迭代级动态调度成为可能，组合实现 2-4x 吞吐提升，是 2026 年高吞吐推理的双基座。"
created: 2026-07-02
updated: 2026-07-02
tier: core
lifecycle: draft
---

# PagedAttention x Continuous Batching: 内存效率与动态调度的双重引擎

## The Connection

PagedAttention 和 Continuous Batching 分别解决 LLM 推理的两个独立瓶颈，但它们的组合产生了远超各自单独效果的协同增益：

- **PagedAttention** 解决的是 **"空间问题"**：KV Cache 的显存碎片导致 GPU 无法同时容纳足够多的请求
- **Continuous Batching** 解决的是 **"时间问题"**：静态 batch 中短请求完成后 GPU 空等长请求，算力被浪费

两者的协同关键在于：**Continuous Batching 要求请求可以随时插入和移出 batch，而这恰好需要 PagedAttention 提供的细粒度 block 级内存管理**。如果 KV Cache 是连续分配的，你无法在两个已分配请求之间"插入"一个新请求的 KV Cache——但分页分配下，新请求只需要从 free pool 中获取几个 block 即可。

这就像城市交通：**PagedAttention 是把大停车场改成智能车位系统（每个车位可独立分配），Continuous Batching 是把固定发车的公交改成随到随上的地铁（每站都可以上下客）。两者缺一不可**。

## Where They Co-occur

- vLLM 是两者组合的首发实现：PagedAttention (SOSP 2023) + Continuous Batching (源自 Orca, OSDI 2022)
- SGLang 在两者基础上增加零开销调度和 RadixAttention 前缀共享
- TensorRT-LLM 的 In-Flight Batching 本质上是 Continuous Batching + Paged KV Cache
- TGI (Text Generation Inference) 从 v2.0 开始同时支持 Continuous Batching 和 PagedAttention
- LMDeploy 的 TurboMind 引擎独立实现分页 KV Cache + 连续批处理
- 2026 年所有主流推理引擎均将两者作为默认配置

## Key Connections

### 1. Static Batching 的两重浪费

理解两者协同价值的前提，是看清 Static Batching 到底浪费了什么：

```
Static Batching 的时间-空间双重浪费:
═══════════════════════════════════════════════════════════

时间浪费（调度层面）:
  Request A: ██████████░░░░░░░░░░  (10步完成，但要等B)
  Request B: ████████████████████  (20步)
  Request C: 等待中...等待中...等待中...████████████  (排队)
  → A 完成后 GPU 空等 10 步，C 排队等待 20 步

空间浪费（内存层面）:
  A 预分配: [████████████████████]  (按最大长度预分配)
  A 实际用: [██████████]           (只用了一半)
  → 显存浪费 50%，本可以多放一个请求

Continuous Batching + PagedAttention 消除双重浪费:
  Request A: ██████████ → 释放 → Request C 插入
  Request B: ████████████████████ → 释放 → Request D 插入
  Request C:          ████████████████
  → 每步都充分利用 GPU，每个 block 都按需分配
```

### 2. 协同机制详解：一次推理迭代中的完整流程

```
一个 decode step 的完整流程:
═══════════════════════════════════════════════════════════

Step N 结束:
  ├── 检查哪些请求已完成（生成了 EOS token）
  │   └── 完成的请求: 释放其所有 KV Cache blocks → free pool
  │
  ├── 检查等待队列是否有新请求
  │   └── 新请求: 从 free pool 分配 blocks → 加入 batch
  │
  ├── 检查是否需要 preemption（显存不足）
  │   └── 低优先级请求: swap KV blocks 到 CPU 内存 → 暂停
  │
  └── 执行 Step N+1:
      ├── 当前 batch 中所有请求并行 decode
      ├── 每个请求通过 block table 读取自己的 KV blocks
      └── 新生成的 token 写入新分配的 block

关键: block table 的间接寻址使得 batch 中的请求集合可以在
每步之间变化，而不需要重新组织物理显存布局。
```

### 3. Preemption：显存不足时的优雅降级

当 Continuous Batching 不断插入新请求导致显存接近满载时，PagedAttention 提供了两种抢占策略：

| 策略 | 机制 | 延迟影响 | 适用场景 |
|------|------|---------|---------|
| **Swap** | 将被抢占请求的 KV blocks 复制到 CPU 内存 | 恢复时需 copy back，延迟 10-50ms | 频繁抢占、CPU 内存充足 |
| **Recompute** | 丢弃被抢占请求的 KV Cache，恢复时重新 prefill | 恢复时需重算，延迟与 prefill 相当 | CPU 内存紧张、prefill 快 |

调度器根据当前系统状态动态选择策略。PagedAttention 的 block 级管理使得 swap 可以按 block 粒度进行，而非整个请求——这减少了数据传输量。

### 4. Chunked Prefill 与 PagedAttention 的配合

长 prompt 的 prefill 阶段计算量大（一次性处理数千 tokens），如果直接执行会阻塞正在 decode 的其他请求。Chunked Prefill 将 prefill 分成多个 chunk，与 decode 交错执行：

```
Chunked Prefill 执行流程:
═══════════════════════════════════════════════════════════

假设 Request A 有 4096 tokens 的 prompt，chunk_size = 512

Step 1: Prefill A[0:512]    + Decode B, C, D
  → A 的前 512 tokens 的 KV Cache 写入 32 个 blocks (block_size=16)
  
Step 2: Prefill A[512:1024] + Decode B, C, D
  → A 的中间 512 tokens 的 KV Cache 写入另外 32 个 blocks
  
Step 3: Prefill A[1024:1536] + Decode B, C, D
Step 4: Prefill A[1536:2048] + Decode B, C, D
...
Step 8: Prefill A[3584:4096] + Decode B, C, D
  → A 的 prefill 完成，下一步开始 decode

Step 9: Decode A, B, C, D

关键: PagedAttention 使得 prefill 过程中可以逐 chunk
分配 blocks，而不需要预先为整个 prompt 预留空间。
```

### 5. 吞吐量提升的量化分析

| 指标 | Static Batching | Continuous Batching only | PagedAttention only | 两者组合 |
|------|----------------|-------------------------|--------------------|---------|
| 显存利用率 | 50-65% | 50-65% | **95%+** | **95%+** |
| GPU 计算利用率 | 40-60% | **85%+** | 60-75% | **90%+** |
| 并发请求数 | N | N | **2-3x N** | **2-4x N** |
| 吞吐提升 | 1x | 1.5-2x | 1.5-2x | **2-4x** |
| TTFT P99 | 受排队影响 | 较稳定 | 受排队影响 | **最稳定** |

**为什么是乘法而非加法？**
- PagedAttention 让 GPU 能"装下"更多请求（空间维度）
- Continuous Batching 让 GPU 在每个时间步都"有事做"（时间维度）
- 两者分别在空间和时间维度消除浪费，效果相乘

## Decision Framework

### 如何最大化两者协同效果？

```
你的负载特征是什么？
│
├── 请求长度分布均匀（方差小）
│   ├── Continuous Batching 收益有限（请求几乎同时完成）
│   ├── PagedAttention 收益有限（预分配浪费少）
│   └── 建议: 增大 max_num_seqs，提高并发上限
│
├── 请求长度差异大（方差大）
│   ├── Continuous Batching 收益大（短请求早完成早释放）
│   ├── PagedAttention 收益大（长短混合碎片少）
│   └── 建议: 默认配置即可，两者自然发挥最大价值
│
├── 突发流量（请求到达不均匀）
│   ├── Continuous Batching 即时插入新请求
│   ├── PagedAttention 按需分配，不预占
│   └── 建议: 启用 prefix caching 加速突发 prefill
│
└── 长 prompt + 短输出（如分类、摘要）
    ├── prefill 占比大，decode 占比小
    ├── Continuous Batching 收益有限
    └── 建议: 重点优化 Chunked Prefill 参数
```

### 关键参数调优对照表

| 参数 | 含义 | 高吞吐推荐 | 低延迟推荐 |
|------|------|----------|----------|
| `max_num_seqs` | 最大并发请求数 | 256-512 | 32-64 |
| `max_num_batched_tokens` | 每步最大 token 数 | 4096-8192 | 512-1024 |
| `gpu_memory_utilization` | KV Cache 显存占比 | 0.90-0.95 | 0.80-0.85 |
| `enable_chunked_prefill` | 启用分块 prefill | true | false |
| `max_paddings` | 允许的最大 padding | 256 | 64 |

## Practical Guide

### vLLM 中启用两者

```bash
# vLLM 默认同时启用 PagedAttention 和 Continuous Batching
python -m vllm.entrypoints.openai.api_server \
    --model Qwen2-7B-Instruct \
    --max-num-seqs 256 \
    --max-num-batched-tokens 8192 \
    --gpu-memory-utilization 0.90 \
    --enable-chunked-prefill \
    --max-model-len 32768

# 监控关键指标
curl http://localhost:8000/metrics | grep -E "throughput|cache|batch"
```

### 性能验证 Checklist

| 检查项 | 预期 | 异常信号 |
|--------|------|---------|
| GPU 利用率 | >85% | <60% 说明 batch 太小或调度低效 |
| KV Cache 使用率 | 70-95% | <50% 说明 max_num_seqs 太小 |
| Preemption 次数 | 趋近 0 | 持续增长说明显存不足 |
| TTFT P50 | <500ms | >2s 说明 prefill 阻塞严重 |
| 吞吐量 vs 并发 | 线性增长 | 饱和后下降说明达到 GPU 上限 |

## Tensions and Trade-offs

- **调度复杂度 vs 吞吐量**：Continuous Batching 的迭代级调度引入调度器开销（每步评估队列），但现代实现（vLLM V1 Engine）已将此开销控制在 <1%
- **Prefill vs Decode 的资源竞争**：Chunked Prefill 解决了长 prompt 阻塞 decode 的问题，但 prefill chunk 和 decode 请求共享 GPU 算力，可能影响 decode 延迟稳定性
- **公平性 vs 效率**：Continuous Batching 可能让新到达的短请求"插队"排在长请求前面——vLLM 通过优先级队列和最大等待时间缓解此问题
- **Preemption 的代价**：Swap 到 CPU 内存的 KV Cache 需要 PCIe 带宽恢复，在高抢占率下可能成为瓶颈
- **V1 Engine 的改进**：vLLM V1 引擎重写了调度器，将 PagedAttention 和 Continuous Batching 的管理统一到单一执行器中，端到端吞吐再提升 30%+

## Open Questions

- Continuous Batching 的调度策略能否引入强化学习，根据历史负载模式预测最优调度决策？
- 当 PagedAttention 的 block_size 趋近于 1（token 级分页）时，是否会出现新的管理开销瓶颈？
- 在多模型部署场景（一个 GPU 运行多个 LoRA adapter），Continuous Batching 的调度器如何处理不同模型的 prefill/decode 混合？
- 硬件层面的支持：GPU 是否有望内置"batch 调度器"，将 Continuous Batching 的决策从软件层卸载到硬件？

## Related

- [[概念/paged-attention]] -- PagedAttention（内存管理基座）
- [[概念/continuous-batching]] -- Continuous Batching（调度基座）
- [[概念/kv-cache]] -- KV Cache（两者共同管理的对象）
- [[概念/dynamic-batch-scheduling]] -- 动态批调度
- [[概念/model-deployment]] -- 模型部署全景
- [[治理/kv-cache-paged-attention]] -- KV Cache x PagedAttention
- [[治理/kv-cache-inference-optimization]] -- KV Cache x 推理优化
- [[治理/serving-deployment]] -- 模型服务 x 模型部署
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive]] -- vLLM（两者首发组合实现）
- [[10_部署推理/02_Inference_Engines/SGLang_Deep_Dive]] -- SGLang（零开销调度 + 两者协同）
- [[10_部署推理/02_Inference_Engines/TensorRT_LLM_Deep_Dive]] -- TensorRT-LLM（In-Flight Batching）
- [[10_部署推理/02_Inference_Engines/TGI_Deep_Dive]] -- TGI（Continuous Batching）
