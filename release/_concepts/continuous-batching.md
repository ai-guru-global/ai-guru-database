---
title: Continuous Batching (连续批处理)
category: -concepts
tags: [inference, batching, scheduling, throughput]
relationships:
  - target: "_concepts/model-deployment"
    type: optimizes
  - target: "_concepts/paged-attention"
    type: synergizes_with
  - target: "_concepts/dynamic-batch-scheduling"
    type: related_to
  - target: "_concepts/sglang"
    type: used_by
  - target: "_concepts/tensorrt-llm"
    type: used_by
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive.md
summary: Continuous Batching（连续批处理）由 Orca (OSDI'22) 提出，在迭代级别动态调度请求——新请求插入正在运行的 batch，已完成请求立即释放资源。相比静态 batching 吞吐提升 2-4×，是 2026 年高吞吐推理的标配技术。
provenance:
  extracted: 0.9
  inferred: 0.05
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03 00:00:00+00:00
updated: 2026-06-03 00:00:00+00:00
aliases:
  - "Continuous Batching"
  - "continuous batching"

---
# Continuous Batching (连续批处理)

## 核心要点

- **迭代级调度**：每个 decode step 后可插入新请求或释放完成请求，无需等待整个 batch 完成
- **吞吐提升 2-4×**：消除传统 static batching 中"最长序列决定整体等待"的浪费
- **与 PagedAttention 天然协同**：PagedAttention 的 block 级内存管理支持请求的随时插入释放
- **2026 标配**：vLLM、SGLang、TensorRT-LLM、TGI 均默认启用

## 详细内容

### Static Batching vs Continuous Batching

```
Static Batching (序列级):
┌─────┐
│ A   │██████████████░░░░░░░░  (A 先完成，但要等 B)
│ B   │██████████████████████
└─────┘                           ↑ batch 整体完成才能处理新请求

Continuous Batching (迭代级):
┌─────┐
│ A   │██████████████ → 释放 → C 插入
│ B   │██████████████████████ → 释放 → D 插入
└─────┘                    每个 step 都可调度
```

### 关键技术组件

| 组件 | 功能 |
|------|------|
| **Iteration-level Scheduler** | 每个 decode step 后重新评估请求队列 |
| **Selective Batching** | 同一 batch 中不同请求可在不同层使用不同 batch size |
| **Preemption** | 显存不足时暂停低优先级请求，高优先级先行 |
| **Chunked Prefill** | 将长 prompt prefill 分块，与 decode 交错执行 |

### 性能影响

| 场景 | Static Batching | Continuous Batching |
|------|----------------|-------------------|
| 变长请求 | 严重浪费（最长决定） | 高效利用 |
| 突发流量 | 排队等待 | 即时插入 |
| 吞吐提升 | 基线 | **2-4×** |
| 延迟 P99 | 受最长序列影响 | 更稳定 |

### Chunked Prefill 优化

长 prompt 的 prefill 阶段计算量大，会阻塞 decode 请求。Chunked Prefill 将 prefill 分成多个 chunk（如每 chunk 512 tokens），与 decode 请求交错执行：

```
Step 1: Prefill A[0:512]  +  Decode B, C, D
Step 2: Prefill A[512:1024] + Decode B, C, D
Step 3: Prefill A[1024:1536] + Decode B, C, D  (A prefill 完成)
Step 4: Decode A, B, C, D
```

## 来源

- Yu et al., "Orca: A Distributed Serving System for Transformer-Based Generative Models," OSDI 2022
- "Inside vLLM: Anatomy of a High-Throughput LLM Inference System", 2025

## Related

- [[_concepts/paged-attention]] — PagedAttention（内存管理协同）
- [[_concepts/kv-cache]] — KV Cache
- [[_concepts/model-deployment]] — 模型部署
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive]] — vLLM（Continuous Batching + PagedAttention）
- [[10_Deployment_Inference/Inference_Engines/SGLang_Deep_Dive]] — SGLang（零开销调度 + Continuous Batching）
- [[10_Deployment_Inference/Inference_Engines/TGI_Deep_Dive]] — TGI（Continuous Batching）
- [[10_Deployment_Inference/Inference_Engines/LMDeploy_Deep_Dive]] — LMDeploy（Continuous Batching）
- [[10_Deployment_Inference/Inference_Engines/TensorRT_LLM_Deep_Dive]] — TensorRT-LLM（In-Flight Batching）
- [[_concepts/dynamic-batch-scheduling]] — 动态批调度
- [[_concepts/sglang]] — SGLang
- [[_concepts/tensorrt-llm]] — TensorRT-LLM
