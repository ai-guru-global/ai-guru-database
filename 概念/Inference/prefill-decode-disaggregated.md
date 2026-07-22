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
  - "Prefill-Decode Disaggregation"
  - "Prefill Decode Disaggregation"
  - "prefill decode disaggregation"
relationships:
  - target: "概念/ttft"
    type: optimizes
  - target: "概念/tpot"
    type: optimizes
  - target: "概念/model-inference"
    type: part_of
  - target: "概念/vllm-practical"
    type: related_to
summary: Prefill-Decode 分离将 LLM 推理的两个阶段部署到不同硬件上：Prefill 阶段需要高算力，Decode 阶段需要高内存带宽。通过分离可以分别优化 TTFT 和 TPOT，提升整体服务效率。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-06-25
sources: []
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

- [[概念/ttft|TTFT]]
- [[概念/tpot|TPOT]]
- [[概念/kv-cache|KV Cache]]
- [[概念/model-inference|模型推理]]
- [[概念/vllm-practical|vLLM 实战]]

## PD 分离架构全景

| 方案 | 说明 | 加速比 | 状态 |
|------|------|--------|------|
| **DistServe** | Prefill/Decode 独立 GPU 池 | 1.5-2x | 研究 |
| **Splitwise** | 微软 PD 分离方案 | 1.5x | 研究 |
| **Mooncake** | 月之暗面 KVCache 分离 | 2x+ | 生产 |
| **TetriInfer** | 分布式 PD 调度 | 1.5x | 研究 |
| **vLLM PD** | vLLM 原生 PD 分离 | 1.5x | GA |

## PD 分离工作原理

```
传统部署 (PD 混合):
  [GPU] Prefill(计算密集) + Decode(内存密集) 交替执行
  问题: Prefill 阻塞 Decode，TTFT 和 TPOT 互相影响

PD 分离部署:
  [Prefill Pool] ──KV Transfer──> [Decode Pool]
  │                                    │
  └─ 计算密集优化                    └─ 内存密集优化
     (Flash Attn, 大 batch)            (投机解码, 小 batch)

KV Transfer 方式:
├── NVLink (同机多卡)
├── RDMA/InfiniBand (跨机)
└── TCP/IP (通用，慢)
```

## 生产最佳实践

1. **大规模才用 PD 分离**：100+ GPU 时考虑，小规模用混合部署
2. **KV Transfer 带宽**：跨机 PD 分离需要高速网络 (RDMA)
3. **负载均衡**：Prefill 和 Decode 池独立扩缩容
4. **监控 TTFT/TPOT**：分离后分别监控两个阶段延迟
5. **与 Chunked Prefill 配合**：长输入分块 prefill，避免阻塞

## 延伸阅读

- [[概念/Inference/prefill-decode|Prefill/Decode]] — 两阶段详解
- [[概念/Inference/ttft|TTFT]] — 首 Token 延迟
- [[概念/Inference/kv-cache|KV Cache]] — 缓存管理
- [[概念/Inference/inference-performance|推理性能]] — 性能优化

> ℹ️ PD 分离是大规模推理服务的重要架构演进，可提升 30-50% 利用率。
实现方案: DistServe, Splitwise, Mooncake, vLLM PD 分离。
适用场景: 100+ GPU 大规模服务，小规模用混合部署即可。
关键挑战: KV Cache 跨节点传输需要高速网络 (RDMA/InfiniBand)。
性能收益: TTFT 降低 30-50%，Decode 吐吐量提升 20-40%。
监控重点: KV Transfer 延迟、Prefill/Decode 池利用率。
