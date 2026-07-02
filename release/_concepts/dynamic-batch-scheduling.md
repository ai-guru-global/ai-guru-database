---
title: "动态批调度"
category: -concepts
tags: ["inference", "batching", "scheduling", "throughput", "continuous-batching"]
relationships:
  - target: "_concepts/continuous-batching"
    type: related_to
  - target: "_concepts/model-serving"
    type: optimizes
  - target: "_concepts/paged-attention"
    type: synergizes_with
  - target: "_concepts/kv-cache"
    type: manages
sources:
  - 10_Deployment_Inference/Inference_Performance/Request_Scheduling_for_LLMs.md
  - 10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive.md
  - 10_Deployment_Inference/Inference_Engines/SGLang_Deep_Dive.md
summary: "动态批调度是推理引擎在每个生成步骤后重新安排请求的策略：新请求随时插入，完成请求随时退出，让 GPU 一直处于满负荷运转，避免‘等一个慢请求拖垮整批’的浪费。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Dynamic Batch Scheduling"
  - "dynamic batch scheduling"

---
# 动态批调度

## 核心要点

- **传统静态批处理**：等一个 batch 里所有请求都生成完，才接收下一批。如果某个请求特别长，其他请求都要干等。
- **动态批调度（Dynamic Batching）**：在每个 decode step 结束后，把已完成的请求踢出去，把新来的请求塞进来。
- **Continuous Batching / In-flight Batching** 是其工程实现，vLLM、SGLang、TensorRT-LLM、TGI 都支持。
- **收益**：GPU 利用率提升 2-4 倍，P99 延迟更稳定。

## 一句话理解

动态批调度就像‘拼车算法’：车不停地开，有人到站下车，有人中途上车，保证座位不空、效率最高。

## 详细内容

### 静态批处理的问题

```
静态 batch：
请求 A: ████████░░░░░░░░░░  （长）
请求 B: ████░░░░░░░░░░░░░░  （短）
请求 C: ██████░░░░░░░░░░░░  （中）
        ↑ B 和 C 明明跑完了，但要等 A 结束才能处理新请求
```

### 动态批处理

```
Step 1: A + B + C 一起跑
Step 2: B 完成退出，D 加入 → A + C + D
Step 3: C 完成退出，E 加入 → A + D + E
Step 4: A 完成退出，F 加入 → D + E + F
```

每个 step 后都重新组织 batch，GPU 几乎不空闲。

### 关键技术组件

| 组件 | 作用 |
|------|------|
| **迭代级调度器** | 每个 decode step 后重新排队 |
| **抢占（Preemption）** | 显存不足时暂停低优先级请求 |
| **Chunked Prefill** | 长 prompt 分块，和 decode 交错执行 |
| **优先级队列** | 保证 SLO，高优先级请求先处理 |
| **Token 预算** | 限制单步最大 batch size，防止延迟尖刺 |

### 与 PagedAttention 的关系

动态批调度要随时插入/释放请求，KV Cache 的管理必须非常灵活。PagedAttention 把 KV Cache 分成小块（block），就像操作系统的虚拟内存，支持请求动态进出，两者天然配合。

### 生产调优要点

- **max_num_seqs**：同时处理的请求数上限。
- **max_model_len**：支持的最大上下文长度。
- **gpu_memory_utilization**：留给 KV Cache 的显存比例。
- **scheduler_delay_factor**：等待更多请求到达再调度，权衡吞吐与延迟。

## 开放问题

- 如何在高吞吐与低 TTFT 之间做最优权衡。
- 多模态、多 LoRA、speculative decoding 下的调度策略。
- 按用户/租户区分的 QoS 调度。

## Related

- [[_concepts/continuous-batching]] — Continuous Batching
- [[_concepts/paged-attention]] — PagedAttention
- [[_concepts/model-serving]] — 模型服务
- [[_concepts/inference-performance]] — 推理性能
- [[10_Deployment_Inference/Inference_Performance/Request_Scheduling_for_LLMs]] — LLM 请求调度
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive]] — vLLM 深度解析
