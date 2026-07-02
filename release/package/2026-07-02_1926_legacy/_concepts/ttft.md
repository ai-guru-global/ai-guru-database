---
title: TTFT（Time To First Token）
category: concepts
tags:
  - llm
  - inference
  - ttft
  - latency
  - performance
  - serving
aliases:
  - TTFT
  - Time To First Token
  - 首 token 延迟
  - 首字延迟
relationships:
  - target: "_concepts/tpot"
    type: paired_with
  - target: "_concepts/model-inference"
    type: part_of
  - target: "_concepts/kv-cache"
    type: affected_by
  - target: "_concepts/paged-attention"
    type: optimized_by
summary: TTFT 是从收到用户请求到模型返回第一个生成 token 的时间，主要消耗在 prompt 的预填充（prefill）阶段，是衡量 LLM 推理服务响应速度的关键指标。
lifecycle: stable
tier: supporting
created: 2026-06-25
updated: 2026-06-25
---

# TTFT（Time To First Token）

## 一句话总结

TTFT（Time To First Token）是**从请求发起到模型输出第一个 token 的时间**，反映用户感知的“响应速度”。

---

## 为什么 TTFT 重要？

对于交互式应用（聊天、搜索、代码助手），用户看到第一个字之前通常只能等待。TTFT 直接决定用户体验：

- TTFT < 100ms：感觉即时响应；
- TTFT 100ms ~ 500ms：可接受；
- TTFT > 1s：明显感觉卡顿。

---

## TTFT 的构成

```
TTFT = 网络传输 + 队列等待 + 预填充计算 + 首个 token 生成
```

其中**预填充（Prefill）**是主要部分。

### 预填充阶段

预填充阶段需要：

1. 对整个 prompt 进行一次前向传播；
2. 计算 prompt 中所有 token 的 KV Cache；
3. 输出第一个新 token。

计算量与 prompt 长度成正比：

```
Prefill FLOPs ∝ prompt_length^2 × d
```

---

## 影响 TTFT 的因素

| 因素 | 影响 |
|---|---|
| **Prompt 长度** | 越长，预填充计算量越大，TTFT 越高 |
| **模型大小** | 参数量越大，前向传播越慢 |
| ** batch size** | 批处理可降低均摊 TTFT，但单请求等待可能增加 |
| **硬件算力** | GPU/TPU 的计算和内存带宽 |
| **量化** | INT8/FP8 可降低计算量和显存占用 |
| **并行策略** | 张量并行、流水线并行影响预填充速度 |

---

## 优化 TTFT 的方法

| 方法 | 原理 |
|---|---|
| **减少 prompt 长度** | 精简上下文、使用更短的 system prompt |
| **Prompt 缓存** | 缓存常见 prompt 的 KV Cache |
| **更高效的 Attention** | FlashAttention 减少预填充时间 |
| **量化** | 降低模型计算和显存开销 |
| **张量并行** | 多卡并行加速预填充 |
| **动态批处理** | 合理调度请求，减少队列等待 |

---

## TTFT vs TPOT

| 指标 | TTFT | TPOT |
|---|---|---|
| **全称** | Time To First Token | Time Per Output Token |
| **测量对象** | 第一个 token 的延迟 | 之后每个 token 的延迟 |
| **主要阶段** | Prefill | Decoding |
| **决定体验** | 用户感知的响应速度 | 用户感知的生成流畅度 |
| **瓶颈** | 计算 FLOPs、prompt 长度 | 内存带宽、KV Cache、批处理 |

两者共同决定端到端延迟：

```
Total Latency ≈ TTFT + (output_length - 1) × TPOT
```

---

## 延伸阅读

- [[_concepts/tpot|TPOT]]
- [[_concepts/model-inference|模型推理]]
- [[_concepts/kv-cache|KV Cache]]
- [[_concepts/paged-attention|PagedAttention]]
- [[_concepts/flash-attention-kernels|FlashAttention]]
