---
title: Prefill-Decode 分离部署架构
category: concepts
tags:
  - llm
  - inference
  - deployment
  - prefill
  - decode
  - disaggregated
  - serving
aliases:
  - Prefill-Decode Separation
  - Disaggregated Serving
  - Prefill-Decode 分离
  - 推理阶段分离
relationships:
  - target: "_concepts/ttft"
    type: optimizes
  - target: "_concepts/tpot"
    type: optimizes
  - target: "_concepts/model-inference"
    type: part_of
  - target: "_concepts/vllm-practical"
    type: related_to
summary: Prefill-Decode 分离将 LLM 推理的两个阶段部署到不同硬件上：Prefill 阶段需要高算力，Decode 阶段需要高内存带宽。通过分离可以分别优化 TTFT 和 TPOT，提升整体服务效率。
lifecycle: stable
tier: supporting
created: 2026-06-25
updated: 2026-06-25
---

# Prefill-Decode 分离部署架构

## 一句话总结

**Prefill-Decode 分离**将 LLM 推理的**预填充（Prefill）**和**解码（Decode）**阶段分配到不同的计算资源上，分别优化首 token 延迟和后续 token 延迟。

---

## 两阶段特性对比

| 特性 | Prefill 阶段 | Decode 阶段 |
|---|---|---|
| **计算类型** | 计算密集型 | 内存带宽密集型 |
| **输入** | 完整 prompt | 单个新 token |
| **并行度** | 高（可并行处理 prompt token）| 低（自回归）|
| **瓶颈** | 算力 FLOPs | 内存带宽、KV Cache |
| **优化目标** | 降低 TTFT | 降低 TPOT、提高吞吐 |

---

## 为什么需要分离？

同一批次 GPU 同时处理 Prefill 和 Decode 时会互相干扰：

- Prefill 占用大量计算资源，影响 Decode 的内存带宽；
- Decode 的频繁内存访问会拖慢 Prefill 的并行计算。

分离后：

- **Prefill 节点**使用高算力 GPU（如 A100/H100）；
- **Decode 节点**使用高带宽 GPU 或优化 KV Cache 的硬件；
- 两阶段通过 KV Cache 传递中间状态。

---

## 架构示意图

```mermaid
flowchart LR
    A[用户请求] --> B[调度器]
    B --> C[Prefill 集群]
    C --> D[计算 prompt KV Cache]
    D --> E[Decode 集群]
    E --> F[自回归生成 token]
    F --> G[返回结果]
```

---

## KV Cache 传递

Prefill 阶段计算完 prompt 的 KV Cache 后，需要将其传输到 Decode 节点：

```
Prefill Node: K_prompt, V_prompt
      ↓ 网络传输
Decode Node: 接收 KV Cache，继续生成
```

**关键挑战**：

- 长 prompt 的 KV Cache 很大，传输耗时；
- 需要低延迟、高带宽的网络（如 NVLink、InfiniBand）。

---

## 实现方式

### 1. 完全分离

- Prefill 和 Decode 使用独立的 GPU 池；
- 适合大规模在线服务。

### 2. 部分分离

- 同一 GPU 上 Prefill 和 Decode 分时执行；
- 实现简单，但优化效果不如完全分离。

### 3. Chunked Prefill

- 将长 prompt 分成多个 chunk 逐步处理；
- 与 Decode 交错执行，减少 Decode 等待时间。

---

## 代表工作

| 工作 | 机构 | 核心思想 |
|---|---|---|
| **Splitwise** | 微软 | 分析 Prefill/Decode 分离的成本效益 |
| **DistServe** | 清华/面壁 | 分离服务提升吞吐和延迟 |
| **Sarathi** | 微软 | Chunked Prefill + Decode 交错 |

---

## 适用场景

| 场景 | 是否推荐 |
|---|---|
| 高并发在线服务 | ✅ 强烈推荐 |
| Prompt 长度差异大 | ✅ 推荐 |
| 小批量离线推理 | ❌ 不必要 |
| 延迟要求不高的任务 | ❌ 不必要 |

---

## 延伸阅读

- [[_concepts/ttft|TTFT]]
- [[_concepts/tpot|TPOT]]
- [[_concepts/kv-cache|KV Cache]]
- [[_concepts/model-inference|模型推理]]
- [[_concepts/vllm-practical|vLLM 实战]]
