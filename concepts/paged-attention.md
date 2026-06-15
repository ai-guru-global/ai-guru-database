---
title: PagedAttention
category: concepts
tags: [inference, kv-cache, memory-management, vllm, paged-attention]
relationships:
  - target: "concepts/kv-cache"
    type: optimizes
  - target: "concepts/model-deployment"
    type: enables
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 09_Deployment_Inference/vLLM_Deep_Dive.md
summary: PagedAttention 是 vLLM 提出的 KV Cache 内存管理技术，借鉴操作系统虚拟内存分页思想，将 KV Cache 分成固定大小 block 按需分配，消除显存碎片，将利用率从 50-65% 提升到 95%+。2026 年所有主流推理引擎均默认启用。
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
---

# PagedAttention

## 核心要点

- **KV Cache 的虚拟内存**：借鉴 OS 分页思想，将 KV Cache 分成固定大小 block（通常 16/32 tokens），通过 block table 间接寻址
- **消除显存碎片**：传统连续分配在变长 batch 下碎片率 35-50%，PagedAttention 降至 <5%
- **2026 行业标配**：vLLM、SGLang、TensorRT-LLM 均默认启用，是推理部署的必选基座

## 详细内容

### 问题：KV Cache 显存碎片

传统 LLM 推理为每个请求预分配连续的 KV Cache 空间（按最大序列长度），导致：
- **内部碎片**：请求实际长度 < 预分配长度，浪费 30-50% 显存
- **外部碎片**：请求完成后释放的中间空洞无法被新请求利用
- 典型 bursty 流量下，有效利用率仅 50-65%

### PagedAttention 原理

```
传统分配（连续）:
┌──────────────┐  ┌──────────┐
│ Request A    │  │ Req B    │  ← 中间空洞浪费
└──────────────┘  └──────────┘

PagedAttention（分页）:
Block Table:  A→[3,7,12]  B→[1,5]
Physical: [B0][B1][  ][A0][  ][B2][  ][A1][  ][  ][  ][A2][  ]...
```

- **Block**：固定大小的 KV Cache 存储单元（16 或 32 tokens）
- **Block Table**：每个请求维护一个页表，记录其 KV block 的物理位置
- **按需分配**：新 token 生成时才分配新 block，不需要预分配
- **Attention Kernel**：通过页表间接读取 KV block，计算开销增加 ~2-5%

### 关键参数

| 参数 | 说明 | 典型值 |
|------|------|--------|
| **block_size** | 每个 block 包含的 token 数 | 16 或 32 |
| **gpu_memory_utilization** | GPU 显存用于 KV Cache 的比例 | 0.9 (90%) |
| **max_num_blocks_per_seq** | 单序列最大 block 数 | seq_len / block_size |

### 性能影响

| 指标 | 传统分配 | PagedAttention |
|------|---------|---------------|
| 显存利用率 | 50-65% | **95%+** |
| 并发请求数 | 受限 | **2-4× 提升** |
| 吞吐量 | 基线 | **2-4× 提升** |
| 单 token 计算开销 | 基线 | +2-5% (页表查找) |

### Continuous Batching 协同

PagedAttention 与 Continuous Batching 天然配合：
- Continuous Batching 在迭代级动态调度请求（新请求插入、完成请求释放）
- PagedAttention 提供细粒度 block 级内存管理，支持请求的随时插入和释放
- 两者组合使 vLLM 在 bursty 流量下保持高吞吐

### 局限与替代方案

- **页表查找开销**：每个 attention 步骤需查 block table，对极短序列反而有开销
- **vAttention (2025)**：使用 CUDA 虚拟内存 API 替代 PagedAttention，保持 KV Cache 在连续物理内存中，减少查找开销
- **block_size 选择**：太大浪费显存，太小增加页表大小和查找开销

## 来源

- Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention," SOSP 2023
- vLLM 官方文档: https://docs.vllm.ai

## Related

- [[concepts/kv-cache]] — KV Cache（PagedAttention 管理的对象）
- [[concepts/continuous-batching]] — Continuous Batching（协同技术）
- [[concepts/model-deployment]] — 模型部署全景
- [[concepts/multi-head-latent-attention]] — MLA（架构层压缩 KV Cache）
- [[09_Deployment_Inference/vLLM_Deep_Dive]] — vLLM（PagedAttention 首发实现）
- [[09_Deployment_Inference/SGLang_Deep_Dive]] — SGLang（结合 RadixAttention 的内存管理）
- [[09_Deployment_Inference/LMDeploy_Deep_Dive]] — LMDeploy（TurboMind Paging KV Cache）
- [[09_Deployment_Inference/TensorRT_LLM_Deep_Dive]] — TensorRT-LLM（In-Flight Batching + Paged KV）
