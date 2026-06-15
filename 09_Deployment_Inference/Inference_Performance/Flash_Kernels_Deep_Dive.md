---
title: Flash 系列 Kernel 深潜
category: 09-deployment-inference
tags: [inference, flash-attention, flashinfer, flashmla, flashdecoding, kernels, performance]
summary: "> FlashAttention、FlashDecoding、FlashInfer、FlashMLA 等内核如何把 Attention 的显存访问降到接近理论下限。"
created: 2026-06-15
updated: 2026-06-15
---

# Flash 系列 Kernel 深潜

> 现代 LLM 推理的 attention 算子已经把显存墙利用到极致——核心思路是“算得多、写得少”。

---

## 1. 为什么需要 Flash 系列 Kernel

标准 attention 的实现要把中间结果 `S = QK^T` 和 `P = softmax(S)` 全部写回显存（HBM），计算量不大但显存带宽极高：

```
标准 Attention:
Q × K^T → S (N×N)  写 HBM
softmax(S) → P (N×N) 写 HBM
P × V → O 读 HBM
```

对于长序列，这个 `N×N` 矩阵是瓶颈：

- 显存占用：`O(N²)`
- 带宽：多次读写 HBM

**Flash 系列 Kernel** 的核心思想：**分块计算、 Online softmax、减少 HBM 写入**。

---

## 2. FlashAttention

### 2.1 核心优化

FlashAttention 把 Q、K、V 分成小块（tile），在 SRAM 内完成 softmax 和 attention 计算，**只把最终结果 O 写回 HBM**。

```
FlashAttention:
for each block of Q:
    for each block of K, V:
        在 SRAM 内算 QK^T、softmax、PV
        累积 online softmax 的 running max / sum
    输出最终 O_block
```

### 2.2 Online Softmax

关键技巧：不一次性看到所有 `QK^T`，而是分块累积，用 running maximum 和 running sum 修正 softmax。

```
m_new = max(m_old, m_block)
l_new = exp(m_old - m_new) * l_old + exp(m_block - m_new) * l_block
```

这样不用存整个 `N×N` 矩阵。

### 2.3 收益

| 指标 | 标准 Attention | FlashAttention |
|------|----------------|----------------|
| 显存 | O(N²) | O(N) |
| HBM 访问 | 多次读写 N×N | 接近线性 |
| 速度 | 慢（带宽瓶颈） | 快 2-4× |

---

## 3. FlashDecoding

### 3.1 Decode 阶段的问题

Decode 阶段每次只生成 1 个新 token，但要和前面所有 token 的 KV Cache 做 attention：

```
Q: [1, d]
K, V: [N, d]
```

此时矩阵乘法变成“小矩阵 × 大矩阵”，GPU 算力利用率低，主要受显存带宽限制。

### 3.2 FlashDecoding 的优化

**把 K/V 分成多个小块，分别并行计算 partial attention，最后归约。**

```
FlashDecoding:
K, V 分成 G 组
每组独立算 partial softmax(O_i, l_i, m_i)
最后 across groups 归约得到完整 O
```

这样可以：

- 增加并行度（原本 decode 是串行的）。
- 更充分利用 GPU 算力。
- 减少 TPOT。

### 3.3 与 FlashAttention 的区别

| | FlashAttention | FlashDecoding |
|--|----------------|---------------|
| 场景 | Prefill（长输入并行计算） | Decode（单 token 长上下文） |
| 并行维度 | Q 分块 | K/V 分块 |
| 主要收益 | 显存 ↓、速度 ↑ | TPOT ↓ |

---

## 4. FlashInfer

### 4.1 定位

FlashInfer 是一个**模块化的 attention kernel 库**，被 vLLM、SGLang 等框架集成。

特点：

- 支持 **Batch Decode**、**Batch Prefill**、**Append** 等多种算子。
- 支持 **Page Table**（与 PagedAttention 配合）。
- 支持 **CUDA graph**、**speculative decoding**、**prefix caching**。
- 支持多种数据类型：FP16、BF16、FP8、INT8。

### 4.2 三种核心算子

| 算子 | 用途 |
|------|------|
| `BatchPrefillWithPagedKVCache` | 处理变长输入 prefill，支持 Paged KV Cache |
| `BatchDecodeWithPagedKVCache` | 处理 decode 阶段，支持多请求并发 |
| `BatchPrefillWithRaggedKVCache` | 处理非分页的连续 KV Cache |
| `AppendKVCache` | 新 token 的 KV 写入与 attention 融合 |

### 4.3 为什么比手写 attention 快

- **Kernel fusion**：把 QK^T、softmax、PV、KV append 合成一个 kernel，减少 launch overhead。
- **负载均衡**：处理不同序列长度的 batch 时动态调度 warp。
- **Page-aware**：直接支持 vLLM 的 block table。

---

## 5. FlashMLA

### 5.1 背景

DeepSeek-V2/V3 使用 **MLA（Multi-head Latent Attention）**，把 KV Cache 压缩到极致。但标准 FlashAttention 是为 MHA/MQA/GQA 设计的，不直接支持 MLA 的 latent vector。

### 5.2 FlashMLA 的优化

FlashMLA 专门为 MLA 设计：

- 把 compressed latent KV 和 decoupled RoPE 分开处理。
- 在 kernel 内完成低秩投影，避免额外读写。
- 支持 FP8/BF16 混合精度。

### 5.3 收益

以 DeepSeek-V3 为例：

- KV Cache 从 MHA 的 ~213GB（128K FP16）降到 MLA 的 ~7.6GB。
- FlashMLA 让 decode 阶段在压缩后的 latent space 上高效计算。

---

## 6. 对比总结

| Kernel | 核心场景 | 关键优化 | 代表框架 |
|--------|----------|----------|----------|
| FlashAttention | Prefill | Tile + Online Softmax，减少 HBM 写入 | 几乎所有框架 |
| FlashDecoding | Decode | K/V 分块并行，提高 decode 并行度 | vLLM、SGLang |
| FlashInfer | 通用 | 模块化、Paged KV、Batch Prefill/Decode | vLLM、SGLang、MLC-LLM |
| FlashMLA | MLA 架构 | 针对 latent attention 优化 | DeepSeek 推理栈 |

---

## 7. 选型建议

| 场景 | 推荐 |
|------|------|
| 通用 LLM 推理 | FlashAttention + FlashDecoding |
| 使用 vLLM/SGLang | 默认已集成 FlashInfer |
| DeepSeek-V2/V3 | FlashMLA |
| 超长上下文 decode | FlashDecoding 或 FlashInfer BatchDecode |
| 自研推理框架 | 直接调用 FlashInfer 算子库 |

---

## 8. 一句话总结

> Flash 系列 Kernel 用“分块 + online softmax + kernel 融合”把 attention 的显存访问从 O(N²) 降到 O(N)，是现代 LLM 推理速度的基石。

---

## Related

- [[concepts/flash-attention-kernels]] — Flash Attention 概念卡
- [[concepts/kv-cache]] — KV Cache 优化
- [[concepts/paged-attention]] — PagedAttention
- [[concepts/multi-head-latent-attention]] — MLA
- [[09_Deployment_Inference/Inference_Performance/README|推理性能专题]]
- [[09_Deployment_Inference/Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[09_Deployment_Inference/KV_Cache_Deep_Dive|KV Cache Deep Dive]]
