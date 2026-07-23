---
title: "Prefill/Decode 推理阶段"
category: -concepts
tags: ["prefill", "decode", "inference-phase", "ttft", "tps", "throughput"]
relationships:
  - target: "概念/kv-cache"
    type: builds_on
  - target: "概念/continuous-batching"
    type: related_to
  - target: "概念/speculative-decoding"
    type: extends
  - target: "概念/flash-attention-kernels"
    type: uses
  - target: "部署推理/Inference_Performance/Prefill_Decode_Disaggregation"
    type: optimized_by
  - target: "部署推理/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 部署推理/Inference_Performance/Prefill_Decode_Disaggregation.md
  - 部署推理/Inference_Performance/Inference_Terms_for_dummy.md
summary: "LLM 推理分为 Prefill（处理输入，计算密集）和 Decode（逐 token 生成，内存带宽密集）两阶段。优化策略截然不同，理解两阶段差异是推理系统设计的核心。"
provenance:
  extracted: 0.60
  inferred: 0.30
  ambiguous: 0.10
base_confidence: 0.92
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - "Prefill Decode"
  - "prefill decode"

---
# Prefill/Decode 推理阶段 (Inference Phases)

> 理解推理的两个阶段，才能分别优化它们。

---

## 大白话

你把问题发给 ChatGPT，它要干两件事：

1. **Prefill**：先把你的话全部看一遍，理解上下文，算出一个“记忆”（KV Cache）。
2. **Decode**：然后一个字一个字往外蹦，每蹦一个字都要回头看前面的记忆。

- Prefill 决定你等多久看到第一个字（TTFT）。
- Decode 决定后面每个字蹦得多快（TPOT）。

---

## 1. 两阶段模型

LLM 自回归推理天然分为两个阶段，计算特征截然不同：

```
推理流水线:
                Prefill 阶段                    Decode 阶段
        ┌─────────────────────┐      ┌──────────────────────────┐
输入 →  │ 处理全部输入 tokens  │  →   │ 逐 token 自回归生成        │
Prompt  │ 并行计算所有位置的    │      │ 每步只算 1 个 token        │
        │ KV 并存入 KV Cache  │      │ 从 KV Cache 读取历史       │
        └─────────────────────┘      └──────────────────────────┘
        计算密集型 (Compute-bound)     内存带宽密集型 (Memory-bound)
```

---

## 2. 两阶段对比

| 维度 | Prefill 阶段 | Decode 阶段 |
|------|-------------|-------------|
| **处理粒度** | 全部输入 tokens（并行） | 每步 1 个 token（串行） |
| **计算类型** | 计算密集型（大矩阵乘法） | 内存带宽密集型（小矩阵向量乘） |
| **瓶颈资源** | GPU 算力（TFLOPS） | 显存带宽（GB/s） |
| **延迟指标** | TTFT（Time to First Token） | TPOT（Time Per Output Token） |
| **KV Cache** | 写入（生成所有层的 KV） | 读取（追加 + 读取历史 KV） |
| **吞吐量** | 高（大量 token 并行） | 低（逐 token 串行） |
| **GPU 利用率** | 高（充分利用算力） | 低（受限于内存带宽） |

---

## 3. 关键性能指标

| 指标 | 全称 | 含义 | 典型值 |
|------|------|------|--------|
| **TTFT** | Time to First Token | 首 token 延迟（主要受 Prefill 影响） | 50-500ms |
| **TPOT** | Time Per Output Token | 每个输出 token 延迟（主要受 Decode 影响） | 10-50ms |
| **TPS** | Tokens Per Second | 每秒生成 token 数（= 1/TPOT） | 20-100 |
| **总吞吐** | System Throughput | 系统总 token/秒（含 Prefill+Decode） | 10K-100K |

---

## 4. 各阶段优化技术

### 4.1 Prefill 优化

| 技术 | 原理 | 效果 |
|------|------|------|
| **Chunked Prefill** | 将长 prompt 分块处理，避免一次性占用过多显存 | 降低峰值显存 |
| **FlashAttention** | 分块计算 + 不存储中间注意力矩阵 | 速度 +3×，显存 -20× |
| **Prefix Caching** | 复用已计算的公共前缀 KV | 相同前缀 TTFT 降低 50-80% |
| **Speculative Prefill** | 用小模型预测多个 token，大模型一次验证 | Prefill 时间减半 |

### 4.2 Decode 优化

| 技术 | 原理 | 效果 |
|------|------|------|
| **KV Cache** | 缓存历史 KV，避免重复计算 | 推理速度 +10× |
| **PagedAttention** | 分页管理 KV Cache，消除碎片 | 显存效率 +4× |
| **Speculative Decoding** | 小模型草稿 → 大模型验证 | Decode 速度 +2-3× |
| **Continuous Batching** | 动态调度，完成即替换 | 吞吐量 +2-3× |
| **Quantization** | INT8/INT4 降低显存读写量 | 带宽瓶颈缓解 +2× |

---

## 5. Append 阶段（第三阶段）

FlashInfer 等现代推理框架引入了 **Append** 阶段：

| 阶段 | 描述 | 特点 |
|------|------|------|
| **Prefill** | 处理输入 prompt | 计算密集 |
| **Decode** | 逐 token 生成 | 内存带宽密集 |
| **Append** | KV Cache 写入 | 与 Attention 融合执行，减少中间结果写回 |

Append 优化：将新 token 的 KV 写入与 Attention 计算融合，减少一次 HBM 写回操作。

---

## 6. DeepSeek 的差异化策略

| 模型 | Prefill 策略 | Decode 策略 |
|------|-------------|-------------|
| **DeepSeek-V2** | Token-level Sparse Attention | Dense MLA Decoding |
| **DeepSeek-V3** | 同上，峰值 640 TFLOPS (H800) | 内存带宽 3000 GB/s，660 TFLOPS |
| **DeepSeek-V4** | MLA + MoE 协同 | MLA + MoE 协同 + MTP |

---

## 7. 工程意义

| 场景 | 关注指标 | 优化方向 |
|------|----------|----------|
| **聊天机器人** | TTFT（首 token 要快） | Prefill 优化 + 缓存 |
| **长文生成** | TPS（生成速度） | Decode 优化 + 投机解码 |
| **批量处理** | 总吞吐量 | Continuous Batching |
| **高并发** | 系统总吞吐 | PagedAttention + 量化 |

---

## 8. 局限与开放问题

1. **Prefill-Decode 干扰**：同一 GPU 上两阶段争夺资源
2. **长上下文**：128K+ 上下文的 Prefill 时间可能超过 10 秒
3. **异构调度**：Prefill 和 Decode 是否应该在不同 GPU 上运行（PD 分离架构）
4. **量化权衡**：INT4 量化加速 Decode 但可能损失精度

---

## Related

- [[概念/kv-cache]] — KV Cache（两阶段的核心数据结构）
- [[概念/continuous-batching]] — 连续批处理（Decode 阶段调度）
- [[概念/speculative-decoding]] — 投机解码（Decode 加速）
- [[概念/flash-attention-kernels]] — FlashAttention 内核（Prefill 加速）
- [[概念/paged-attention]] — PagedAttention（KV Cache 管理）
- [[概念/mixture-of-experts]] — MoE（与推理阶段的协同）
- [[概念/ttft]] — TTFT
- [[部署推理/Inference_Performance/Prefill_Decode_Disaggregation|Prefill-Decode 分离]]
- [[部署推理/Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话解释]]
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack

## Prefill vs Decode 对比

| 维度 | Prefill | Decode |
|------|---------|--------|
| **计算模式** | 并行 (所有输入 Token) | 串行 (逐 Token) |
| **计算密集度** | 高 (Compute-bound) | 低 (Memory-bound) |
| **GPU 利用率** | 高 | 低 |
| **延迟影响** | TTFT | TPOT |
| **优化方向** | Flash Attention, 分块 | 投机解码, 量化 |
| **显存占用** | 一次性 | 逐步增长 (KV Cache) |

## PD 分离架构

```
传统部署 (PD 混合):
  [GPU] Prefill + Decode 在同一 GPU
  问题: Prefill 阻塞 Decode，延迟波动大

PD 分离部署:
  [Prefill GPU Pool] → KV Transfer → [Decode GPU Pool]
  优势: 各自优化，延迟稳定，利用率提升 30-50%

实现: DistServe, Splitwise, Mooncake
```

## 生产最佳实践

1. **监控 TTFT 和 TPOT**：分别监控两个阶段的延迟
2. **长输入用 Chunked Prefill**：避免单次 prefill 阻塞解码
3. **大规模用 PD 分离**：100+ GPU 时考虑 Prefill/Decode 分离
4. **投机解码加速 Decode**：Decode 阶段用 Speculative Decoding
5. **KV Cache 管理**：Decode 阶段显存主要是 KV Cache

---

## 2026 Prefill/Decode 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Chunked Prefill** | 分块预填充降低 TTFT 峰值 | GA |
| **PagedAttention** | vLLM 分页 KV Cache 管理 | GA |
| **Prefill/Decode 分离** | 独立资源池优化各阶段 | GA |
| **投机解码** | 小模型加速 Decode 阶段 | GA |
| **KV Cache 压缩** | 量化/稀疏化降低显存占用 | GA |

## 生产最佳实践

1. **阶段识别**：监控 Prefill/Decode 时间占比，确定瓶颈
2. **Chunked Prefill**：长输入场景启用分块预填充
3. **KV Cache 预算**：根据序列长度规划 KV Cache 显存
4. **投机解码**：Decode-bound 场景启用 Speculative Decoding
5. **分离部署**：大规模场景考虑 Prefill/Decode 分离架构
