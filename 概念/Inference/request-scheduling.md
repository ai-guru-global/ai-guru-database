---
title: Request Scheduling for LLMs
category: -concepts
tags: [inference, scheduling, continuous-batching, preemption, performance, vllm, chunked-prefill]
relationships:
  - target: "概念/Inference/continuous-batching"
    type: builds_on
  - target: "概念/Inference/paged-attention"
    type: uses
  - target: "概念/Inference/prefill-decode"
    type: optimizes
  - target: "概念/Inference/inference-autoscaling"
    type: related_to
  - target: "部署推理/Inference_Performance/Request_Scheduling_for_LLMs"
    type: deepened_by
sources:
  - 部署推理/Inference_Performance/Request_Scheduling_for_LLMs.md
  - "https://arxiv.org/abs/2309.06180"  # vLLM PagedAttention
summary: LLM 推理请求调度决定请求顺序、batch 组成、抢占策略，通过 Continuous Batching、Chunked Prefill、SLO-aware 调度等手段提高吞吐并稳定延迟。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-07-21
aliases:
  - "Request Scheduling"
  - "request scheduling"
  - "LLM 请求调度"

---
# Request Scheduling for LLMs（LLM 请求调度）

> LLM 请求调度就是“在显存有限的情况下，决定谁先算、怎么拼 batch、被抢占了怎么办”。

## 核心目标

在三个约束之间做动态平衡：

```
┌─────────────────────────────────────┐
│  GPU 显存约束 (KV Cache 容量)      │
│  延迟 SLO (TTFT/TPOT 上限)       │
│  吞吐量目标 (tokens/s 最大化)     │
└─────────────────────────────────────┘
```

## 调度核心机制

### Continuous Batching

传统 Static Batching 必须等整个 batch 完成才能加入新请求，造成 GPU 空闲。Continuous Batching 允许：

```
Step 1: [Req_A, Req_B, Req_C]  ← Req_A 完成
Step 2: [Req_D, Req_B, Req_C]  ← Req_D 立即加入
Step 3: [Req_D, Req_E, Req_C]  ← Req_B 完成，Req_E 加入
```

**效果**: GPU 利用率从 40-60% 提升到 80-95%。

### Chunked Prefill

将长 Prompt 的 Prefill 阶段拆分为多个 chunk，与 Decode 请求交替执行：

```
无 Chunked Prefill:
[==== Prefill 4096 tokens ====][Decode][Decode]  ← Decode 请求等待很久

有 Chunked Prefill:
[Prefill_512][Decode][Prefill_512][Decode][Prefill_512][Decode]...  ← 交替执行
```

**效果**: TTFT P99 降低 50-70%，避免长 Prefill 阻塞 Decode。

### 抢占策略（Preemption）

当显存不足时，调度器需要抢占低优先级请求：

| 策略 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| **Swap** | 将 KV Cache 换出到 CPU 内存 | 恢复快 | PCIe 带宽瓶颈 |
| **Recompute** | 丢弃 KV Cache，重新计算 | 无内存压力 | 恢复慢（重新 Prefill） |
| **混合** | 短请求 Swap，长请求 Recompute | 平衡 | 策略复杂 |

## SLO-Aware 调度

### 优先级分级

| 优先级 | 场景 | TTFT SLO | 调度策略 |
|--------|------|----------|----------|
| P0 - 实时 | 用户对话 | <500ms | 立即 Prefill，可抢占 P2 |
| P1 - 标准 | API 调用 | <2s | 正常排队 |
| P2 - 批量 | 离线处理 | <30s | 填充空闲 slot |

### 调度算法对比

| 算法 | 原理 | 优势 | 劣势 |
|------|------|------|------|
| **FCFS** | 先来先服务 | 公平 | 长请求阻塞短请求 |
| **SJF** | 短作业优先 | 平均延迟低 | 长请求饥饿 |
| **SLO-aware** | 按 SLO 剩余时间排序 | SLO 达标率高 | 实现复杂 |
| **Priority Queue** | 多级优先级 | 灵活 | 低优先级饥饿 |
| **Fair Share** | 按用户/租户配额 | 多租户公平 | 突发时延迟高 |

## 主流引擎调度器对比

| 引擎 | 调度器特色 | Continuous Batching | Chunked Prefill | 抢占 |
|------|----------|:---:|:---:|:---:|
| **vLLM** | PagedAttention + 调度器 | ✅ | ✅ | Swap/Recompute |
| **SGLang** | RadixAttention 前缀复用 | ✅ | ✅ | Recompute |
| **TensorRT-LLM** | In-flight Batching | ✅ | ✅ | Swap |
| **TGI** | 优先级队列 | ✅ | ✅ | Recompute |
| **llama.cpp** | 简单队列 | 部分 | ❌ | ❌ |

## vLLM 调度器配置示例

```python
from vllm import LLM, SamplingParams

llm = LLM(
    model="Qwen/Qwen2.5-72B-Instruct",
    tensor_parallel_size=4,
    max_num_seqs=256,           # 最大并发序列数
    max_num_batched_tokens=8192, # 每步最大 token 数
    enable_chunked_prefill=True, # 启用 Chunked Prefill
    preemption_mode="swap",     # 抢占策略: swap/recompute
    gpu_memory_utilization=0.9, # GPU 显存利用率
    num_scheduler_steps=1,      # 调度步长
)

# 优先级调度（通过 priority 参数）
outputs = llm.generate(
    prompts=["..."],
    priority=[0, 1, 2],  # 0=最高优先级
)
```

## 调度与显存管理的关系

```
请求到达 → 调度器检查可用 KV Cache blocks
    ├─ 充足 → 加入当前 batch
    ├─ 不足 → 尝试抢占低优先级请求
    │       ├─ Swap 成功 → 释放 blocks，加入新请求
    │       └─ 无可抢占 → 放入等待队列
    └─ 批量请求 → 填充空闲 slot，不抢占
```

## 生产最佳实践

1. **启用 Continuous Batching**: 所有生产环境必须启用，吐吐提升 2-3×
2. **Chunked Prefill**: 当输入长度方差大时必须启用，避免 TTFT 尖刺
3. **SLO 分级**: 实时对话与离线批量分开调度，避免互相影响
4. **显存预留**: 保留 10-15% 显存作为抢占缓冲，避免 OOM
5. **监控队列深度**: 队列 >100 时考虑扩容而非纯调度优化
6. **Prefix Caching**: 多轮对话场景启用前缀缓存，减少重复 Prefill

## Related

- [[概念/Inference/continuous-batching|Continuous Batching]]
- [[概念/Inference/paged-attention|PagedAttention]]
- [[概念/Inference/prefill-decode|Prefill / Decode 阶段]]
- [[概念/Inference/inference-autoscaling|推理扩缩容]]
- [[部署推理/Inference_Performance/Request_Scheduling_for_LLMs|LLM 请求调度]]

## 请求调度策略全景

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| **FCFS** | 先来先服务 | 简单场景 |
| **Priority Queue** | 优先级队列 | SLA 分级 |
| **SJF** | 短作业优先 | 降低平均延迟 |
| **Fair Share** | 公平分享 | 多租户 |
| **Deadline-aware** | 截止时间感知 | 实时任务 |
| **Prefill-aware** | 区分 Prefill/Decode | PD 分离 |

## 调度与批处理协同

```
请求到达 → 等待队列 → 调度器 → Continuous Batching → GPU 执行
                         │
                         ├── 优先级排序
                         ├── 显存预估 (KV Cache 需求)
                         ├── 前缀匹配 (Prefix Cache)
                         └── 超时检查 (SLA 保障)

关键参数:
- max_num_seqs: 最大并发序列数
- max_num_batched_tokens: 最大批处理 Token 数
- max_wait_time: 最大等待时间
```

## 生产最佳实践

1. **优先级队列**：VIP 用户/实时任务优先处理
2. **显存预估**：调度前预估 KV Cache 需求，避免 OOM
3. **超时保护**：设置最大等待时间，超时返回 503
4. **前缀亲和**：相同 System Prompt 路由到同一实例
5. **监控队列**：队列深度 > 阈值时触发扩容

> ℹ️ 请求调度是推理服务的核心组件，直接影响延迟和吐吐量。
