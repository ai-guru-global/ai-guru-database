---
title: 推理性能专题
category: 09-deployment-inference
tags: [inference, performance, latency, throughput, optimization, benchmarking]
summary: "> 从指标定义到系统优化：LLM 推理性能工程的知识地图与实践指南。"
created: 2026-06-15
updated: 2026-06-15
---

# 推理性能专题

> 从指标定义到系统优化：LLM 推理性能工程的知识地图与实践指南。

---

## 专题定位

本专题聚焦 **LLM 推理阶段的性能工程**，不重复讲解具体引擎的安装配置，而是把“性能指标 → 瓶颈定位 → 优化技术 → 评测方法”串成一条可落地的线索。

与现有内容的区别：

- `09_Deployment_Inference/README.md` 是**引擎选型地图**。
- `Deployment_Inference.md` 是**部署与加速概览**。
- 本专题是**性能工程方法论**，专门回答：
  - 延迟到底花在哪里？
  - 吞吐上不去是算力、显存带宽还是通信的问题？
  - 长上下文、高并发、MoE、多模态分别该怎么优化？
  - 如何设计公平、可复现的推理 benchmark？

---

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [推理性能基础](./Inference_Performance_Fundamentals.md) | 指标、瓶颈模型、Roofline、优化技术分类 | 所有性能工程从业者 |
| [Prefill-Decode 分离](./Prefill_Decode_Disaggregation.md) | Disaggregated Serving 架构与 KV Cache 传输 | 长上下文/高并发场景 |
| [MoE 推理优化](./MoE_Inference_Optimization.md) | All-to-All、Expert Parallelism、负载均衡 | MoE 模型部署 |
| [推理 Profiling 与 Benchmarking](./LLM_Inference_Profiling_and_Benchmarking.md) | Nsight、PyTorch Profiler、llmperf、指标陷阱 | 性能测试工程师 |

---

## 优化技术全景

```
LLM 推理性能优化技术栈
│
├── 1. 计算优化
│   ├── 量化（FP8/INT8/INT4/GPTQ/AWQ）
│   ├── 算子融合 / FlashAttention / FlashDecoding
│   ├── 投机解码（Speculative Decoding / Medusa / EAGLE）
│   └── MoE 专家并行与负载均衡
│
├── 2. 显存与带宽优化
│   ├── KV Cache 压缩（GQA/MLA）
│   ├── KV Cache 量化 / Offloading
│   ├── PagedAttention / RadixAttention
│   └── Prefix / Prompt Caching
│
├── 3. 调度与并发优化
│   ├── Continuous Batching
│   ├── Prefill-Decode 分离
│   ├── 请求优先级与抢占
│   └── 动态扩缩容与负载均衡
│
└── 4. 系统架构优化
    ├── Tensor / Pipeline / Expert Parallelism
    ├── 多模型混部
    ├── 边缘/CPU/NPU 推理
    └── AI Gateway 路由与缓存
```

---

## 核心指标速查

| 指标 | 含义 | 常见目标 |
|------|------|----------|
| **TTFT** | Time To First Token，首 token 延迟 | P50 < 100ms，P99 < 500ms |
| **TPOT** | Time Per Output Token，生成阶段每 token 耗时 | 尽量低，与 decode 算力/带宽相关 |
| **Throughput** | 总吞吐（tokens/s 或 requests/s） | 越高越好，受 batch size 影响大 |
| **QPS** | 每秒请求数 | 在线服务核心指标 |
| **GPU Utilization** | GPU 利用率 | 高不一定代表高效，需结合 roofline |

---

## 关联内容

- [09 部署与推理总览](../README.md)
- [Deployment Inference](../Deployment_Inference.md) — 部署与推理加速概览
- [KV Cache Deep Dive](../KV_Cache_Deep_Dive.md) — KV Cache 深度优化
- [Quantization Techniques 2026](../Quantization_Techniques_2026.md) — 量化技术全景
- [Speculative Decoding Advanced 2026](../Speculative_Decoding_Advanced_2026.md) — 投机解码
- [Prompt Caching and KV Cache Optimization](../Prompt_Caching_and_KV_Cache_Optimization.md) — 缓存优化

---

## Related

- [[concepts/inference-performance]] — 推理性能：概念卡
- [[concepts/kv-cache]] — KV Cache 优化
- [[concepts/paged-attention]] — PagedAttention
- [[concepts/continuous-batching]] — Continuous Batching
- [[concepts/speculative-decoding]] — 投机解码
- [[concepts/prefill-decode]] — Prefill / Decode 阶段
- [[09_Deployment_Inference/README|模型部署与推理]]
