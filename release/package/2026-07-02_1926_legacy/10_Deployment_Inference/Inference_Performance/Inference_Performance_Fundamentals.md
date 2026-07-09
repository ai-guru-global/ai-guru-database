---
title: 推理性能基础
category: 10-deployment-inference-inference-performance
tags: [inference, performance, latency, throughput, roofline, benchmarking]
summary: "> LLM 推理性能的核心指标、瓶颈分析框架与优化技术分类。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Inference Performance Fundamentals"
  - Inference_Performance_Fundamentals

---
# 推理性能基础

> 延迟花在哪里、吞吐上不去的根因是什么、优化手段又该从哪里下手。

---

## 1. 核心指标

LLM 推理服务的性能通常用下面四个指标刻画。

### 1.1 TTFT（Time To First Token）

从请求到达，到模型输出**第一个 token** 的时间。

- 主要消耗在 **Prefill 阶段**：把用户输入的所有 token 过一遍模型，算出一个 KV Cache。
- 输入越长，TTFT 越高。
- 优化方向：FlashAttention、 Prefix Caching、PD 分离、输入压缩。

### 1.2 TPOT（Time Per Output Token）

生成阶段，**每输出一个 token 的平均耗时**。

- 主要消耗在 **Decode 阶段**：每次只生成一个新 token，但要读取前面所有 KV Cache。
- 优化方向：KV Cache 压缩、量化、投机解码、算子融合、更大的 batch size。

### 1.3 Throughput（吞吐量）

单位时间内生成的 token 数或处理的请求数。

- **Token throughput**（tok/s）：衡量系统整体产能。
- **Request throughput**（req/s / QPS）：衡量在线服务能力。
- 优化方向：Continuous Batching、动态批处理、更大的 batch、更高效的 attention 算子。

### 1.4 端到端延迟（E2E Latency）

用户感知的总延迟：

```
E2E Latency ≈ TTFT + (输出 token 数 × TPOT)
```

> 注意：压缩 TPOT 对长输出更重要；压缩 TTFT 对短输入/首屏体验更重要。

---

## 2. 瓶颈分析框架

### 2.1 两阶段模型

一次 LLM 推理可以分成两个阶段：

| 阶段 | 计算特征 | 瓶颈 |
|------|----------|------|
| **Prefill** | 输入 token 并行计算，计算密集 | 算力（FLOPS） |
| **Decode** | 逐个 token 自回归，显存带宽密集 | 显存带宽、KV Cache 大小 |

因此，**同一个优化手段对不同阶段的收益不同**：

- 量化：对 decode 收益大（减少 KV Cache 带宽）。
- FlashAttention：对 prefill 收益大（减少冗余计算）。
- PD 分离：把两个阶段拆到不同资源上，分别优化。

### 2.2 Roofline 模型

Roofline 把性能上限表示为：

```
性能上限 = min(峰值算力, 显存带宽 × 运算强度)
```

- **运算强度高**（prefill、大批量）：受峰值算力限制。
- **运算强度低**（decode、小批量）：受显存带宽限制。

判断瓶颈：

| 现象 | 可能瓶颈 |
|------|----------|
| GPU 利用率高但吞吐低 | 显存带宽 bound（典型 decode） |
| GPU 利用率低 | 请求不足、通信/调度 overhead、CPU 预处理慢 |
| 长输入 TTFT 极高 | 算力 bound 或 attention 复杂度 |
| batch size 增大吞吐反而下降 | KV Cache 爆显存或调度 overhead |

### 2.3 常见瓶颈定位 checklist

1. **CPU/GPU 是否在忙？** `nvidia-smi dmon` 看 util、mem、温度。
2. **TTFT 高还是 TPOT 高？** 区分 prefill/decode 问题。
3. **batch size 是否足够？** 小 batch 下 GPU 利用率通常上不去。
4. **KV Cache 是否占满？** 长上下文容易显存先爆。
5. **通信占比多少？** 多卡/多节点注意 NCCL AllReduce 时间。
6. **预处理/后处理是否拖后腿？** tokenize、detokenize、采样有时占 10-30%。

---

## 3. 优化技术分类

### 3.1 计算优化

| 技术 | 作用 | 适用场景 |
|------|------|----------|
| 量化 | 降低权重和 KV Cache 精度，提升带宽 | 几乎所有部署场景 |
| FlashAttention / FlashDecoding | 减少 attention 显存访问 | prefill/decode 都受益 |
| 算子融合 | 减少 kernel launch 和中间结果 | 小 batch、低延迟 |
| 投机解码 | 用小模型/草稿并行生成多个 token | decode 阶段延迟敏感 |
| MoE 专家并行 | 减少激活参数、平衡负载 | MoE 大模型 |

### 3.2 显存与 KV Cache 优化

| 技术 | 作用 |
|------|------|
| GQA / MQA / MLA | 减少 KV Cache 头数或维度 |
| KV Cache 量化 | FP8/INT8 存储 KV |
| PagedAttention | 分页管理 KV Cache，减少碎片 |
| Prefix Caching | 复用共享 prompt 的 KV Cache |
| KV Cache Offloading | 把 KV 换到 CPU/SSD/远程内存 |

### 3.3 调度与并发优化

| 技术 | 作用 |
|------|------|
| Continuous Batching | 动态把新请求塞进正在运行的 batch |
| Prefill-Decode 分离 | 让 prefill 和 decode 用不同资源配置 |
| 优先级调度 / 抢占 | 保障高优先级请求、SLO 隔离 |
| 请求调度策略 | chunked prefill、max token 预测、负载均衡 |

### 3.4 系统架构优化

| 技术 | 作用 |
|------|------|
| Tensor / Pipeline Parallelism | 多卡并行大模型 |
| 多模型混部 | 提高 GPU 利用率 |
| AI Gateway | 路由、缓存、降级、限流 |
| 弹性扩缩容 | 根据 QPS/延迟自动调整副本 |

---

## 4. 性能优化决策树

```
开始优化
│
├─ 延迟高？
│   ├─ TTFT 高 → FlashAttention、Prefix Cache、PD 分离、输入压缩
│   └─ TPOT 高 → KV Cache 压缩、量化、投机解码、更大的 batch
│
├─ 吞吐低？
│   ├─ GPU 利用率低 → Continuous Batching、提高并发、减少 CPU 开销
│   └─ GPU 利用率高 → 量化、算子优化、通信优化、扩容
│
├─ 长上下文出问题？
│   → MLA、KV 量化、PagedAttention、滑动窗口、KV Offloading
│
└─ 高并发/SLO 要求严？
    → PD 分离、优先级调度、AI Gateway、弹性扩缩容
```

---

## 5. 评测原则

1. **固定负载模型**：用真实请求分布，而不是单一 prompt 长度。
2. **同时报 TTFT 和 TPOT**：单看吞吐会掩盖延迟问题。
3. **控制变量**：对比不同引擎时，固定模型、量化方式、硬件、并发数。
4. **关注尾延迟**：P99 比 P50 更能反映用户体验。
5. ** warm up 后再测**：避免第一次推理的编译/缓存冷启动影响。

---

## Related

- [[_concepts/inference-performance]] — 推理性能概念卡
- [[_concepts/prefill-decode]] — Prefill / Decode 阶段
- [[_concepts/kv-cache]] — KV Cache 优化
- [[_concepts/continuous-batching]] — Continuous Batching
- [[_concepts/speculative-decoding]] — 投机解码
- [[部署推理/Inference_Performance/README|推理性能专题]]
- [[部署推理/Caching/KV_Cache_Deep_Dive|KV Cache Deep Dive]]
- [[部署推理/Quantization/Quantization_Techniques_2026|Quantization Techniques 2026]]
