---
title: TPOT（Time Per Output Token）
category: concepts
tags:
  - llm
  - inference
  - tpot
  - latency
  - throughput
  - serving
aliases:
  - TPOT
  - Time Per Output Token
  - 每 token 延迟
  - 生成延迟
relationships:
  - target: "_concepts/ttft"
    type: paired_with
  - target: "_concepts/model-inference"
    type: part_of
  - target: "_concepts/kv-cache"
    type: optimized_by
  - target: "_concepts/paged-attention"
    type: optimized_by
  - target: "_concepts/speculative-decoding"
    type: optimized_by
summary: TPOT 是模型生成阶段每输出一个 token 的平均时间，主要受内存带宽和 KV Cache 影响，是衡量 LLM 推理服务流畅度的核心指标。
lifecycle: stable
tier: supporting
created: 2026-06-25
updated: 2026-06-25
---

# TPOT（Time Per Output Token）

## 一句话总结

TPOT（Time Per Output Token）是**模型生成阶段每输出一个 token 的平均时间**，反映生成过程的流畅度。

---

## 为什么 TPOT 重要？

首个 token 返回后，用户会连续看到后续 token 流出。TPOT 决定：

- 文字“打字”速度是否自然；
- 长回复是否让用户等待过久；
- 系统单位时间内能服务多少 token。

理想情况下，TPOT 应接近人类阅读速度（约 50~200ms/token）。

---

## TPOT 的构成

```
TPOT ≈ 解码阶段单次前向传播时间
```

解码阶段（Decoding）与预填充（Prefill）不同：

- 每次只输入一个新 token；
- 需要读取之前所有 token 的 KV Cache；
- 计算量小，但内存访问密集。

---

## 影响 TPOT 的因素

| 因素 | 影响 |
|---|---|
| **KV Cache 大小** | 越大，读取越慢，TPOT 越高 |
| **序列长度** | 长上下文需要更大的 KV Cache |
| **内存带宽** | 解码阶段主要是内存带宽瓶颈 |
| **批处理大小** | 增大 batch 可提高吞吐，但可能增加单请求 TPOT |
| **量化** | 降低权重和 KV Cache 大小，减少内存访问 |
| **模型大小** | 参数量越大，加载权重越慢 |

---

## 优化 TPOT 的方法

| 方法 | 原理 |
|---|---|
| **KV Cache 优化** | 缓存历史 K/V，避免重复计算 |
| **PagedAttention** | 更高效管理 KV Cache 内存 |
| **量化（INT8/INT4/FP8）** | 减少权重和 KV Cache 大小 |
| **GQA / MQA** | 减少 KV Cache 的头维度 |
| **Continuous Batching** | 动态组 batch，提高 GPU 利用率 |
| **Speculative Decoding** | 小模型生成候选，大模型验证，降低有效 TPOT |
| **CUDA 图 / Kernel 优化** | 减少 kernel 启动开销 |

---

## TTFT vs TPOT

| 指标 | TTFT | TPOT |
|---|---|---|
| **全称** | Time To First Token | Time Per Output Token |
| **测量对象** | 第一个 token 的延迟 | 之后每个 token 的延迟 |
| **主要阶段** | Prefill | Decoding |
| **瓶颈** | 计算 FLOPs | 内存带宽、KV Cache |
| **优化重点** | 加速预填充 | 加速解码、减少内存访问 |

两者共同决定端到端延迟：

```
Total Latency ≈ TTFT + (output_length - 1) × TPOT
```

---

## 吞吐量（Throughput）与 TPOT 的关系

```
Throughput ≈ batch_size / TPOT
```

- 增大 batch size 可以提高吞吐，但可能增加每个请求的 TPOT；
- 优化目标是在满足延迟要求的前提下最大化吞吐。

---

## 延伸阅读

- [[_concepts/ttft|TTFT]]
- [[_concepts/model-inference|模型推理]]
- [[_concepts/kv-cache|KV Cache]]
- [[_concepts/paged-attention|PagedAttention]]
- [[_concepts/speculative-decoding|推测解码]]
- [[_concepts/continuous-batching|Continuous Batching]]
