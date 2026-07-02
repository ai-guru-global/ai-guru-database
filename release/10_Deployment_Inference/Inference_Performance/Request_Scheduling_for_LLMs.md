---
title: LLM 推理请求调度
category: 10-deployment-inference-inference-performance
tags: [inference, scheduling, continuous-batching, preemption, priority, performance]
summary: "> 请求调度决定谁先算、怎么拼 batch、被抢占了怎么办，是高并发推理服务的核心控制面。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Request Scheduling For Llms"
  - "Request Scheduling for LLMs"
  - Request_Scheduling_for_LLMs

---
# LLM 推理请求调度

> 同样的 GPU 硬件，不同的调度策略能让吞吐差几倍，也能让 P99 延迟从 500ms 变 2s。

---

## 1. 调度要解决什么问题

LLM 推理服务的输入是高度不规则的：

- 输入长度从几十到几十万 token 不等。
- 输出长度不可预知。
- 不同用户有不同的延迟要求。
- GPU 显存有限，batch size 不能无限大。

调度器需要决定：

1. **从等待队列里挑哪个请求？**
2. **当前 batch 里放多少请求？**
3. **新请求来了能不能塞进正在跑的 batch？**
4. **显存不够时抢占谁？**
5. **怎么保证高优先级请求不被饿死？**

---

## 2. 基础调度策略

### 2.1 First-Come-First-Served (FCFS)

按到达顺序处理，最简单。

- 优点：公平、实现简单。
- 缺点：短请求被长输入/长输出阻塞，尾延迟差。

### 2.2 Shortest Job First (SJF)

优先处理预计耗时短的请求。

- 优点：平均延迟低。
- 缺点：长请求可能被饿死，需要 aging 机制。

### 2.3 Earliest Deadline First (EDF)

优先处理 deadline 最近的请求。

- 适合有 SLA 的在线服务。
- 需要估计每个请求的完成时间。

---

## 3. Continuous Batching

### 3.1 为什么不用静态 batch

静态 batch 的问题：

- 必须等 batch 里所有请求都生成完，才能处理下一批。
- 一个长输出请求会拖住整个 batch。

### 3.2 Continuous Batching（In-Flight Batching）

核心思想：**一个请求完成 decode 后立即退出，新请求立即加入 batch**。

```
时间轴:
t0: [A, B, C] 进入 batch
     A 完成 → A 退出，D 加入
     [B, C, D]
     B 完成 → B 退出，E 加入
     [C, D, E]
```

效果：

- GPU 利用率更高。
- 吞吐提升 2-5×。
- 现在所有生产级引擎（vLLM、SGLang、TGI、TensorRT-LLM）都支持。

---

## 4. Preemption（抢占）

### 4.1 为什么需要抢占

当新请求到来但显存不够时，需要把正在跑的请求暂时换出。

### 4.2 两种抢占方式

| 方式 | 原理 | 代价 |
|------|------|------|
| **Swap** | 把 KV Cache 换到 CPU 内存 | 换入换出有延迟 |
| **Recompute** | 放弃当前状态，之后重新 prefill | 计算浪费 |

### 4.3 抢占策略

- **FIFO 抢占**：先抢占最近加入的（通常输出短，损失小）。
- **优先级抢占**：低优先级先被抢占。
- **输出长度预估抢占**：估计快要完成的请求不被抢占。

---

## 5. Chunked Prefill

### 5.1 问题

长 prompt 的 prefill 会一次性占满 GPU 算力，阻塞其他请求的 decode。

### 5.2 Chunked Prefill

把长 prefill 拆成多个 chunk，和 decode 请求**交错执行**。

```
[Chunk 1 of Prefill A] → [Decode B, C] → [Chunk 2 of Prefill A] → [Decode B, C, D]
```

效果：

- 避免长 prefill 垄断 GPU。
- TPOT 更稳定。
- vLLM V1 默认开启。

---

## 6. SLO-Aware 调度

### 6.1 目标

- 保证高优先级请求的 TTFT/TPOT。
- 在资源紧张时，低优先级请求可以排队或降级。

### 6.2 常见策略

| 策略 | 做法 |
|------|------|
| **TTFT SLO 调度** | 优先调度短输入或 deadline 近的 prefill |
| **TPOT SLO 调度** | 控制 decode batch 大小，避免 TPOT 超标 |
| **分级服务** | 付费用户/实时应用走优先队列 |
| **预算消耗模型** | 估计每个请求的剩余预算，动态调整优先级 |

---

## 7. 主流引擎实现

| 引擎 | 调度特点 |
|------|----------|
| **vLLM** | Continuous Batching + Swap/Recompute + Chunked Prefill |
| **SGLang** | RadixAttention 前缀缓存 + 零开销调度 |
| **TensorRT-LLM** | In-Flight Batching + 优先级队列 |
| **TGI** | Continuous Batching + 队列管理 |
| **Orca** | 学术原型，首次提出 Iteration-level Scheduling |

---

## 8. 一句话总结

> LLM 推理调度就是“在显存、延迟、吞吐之间做动态平衡”，Continuous Batching 是基础，抢占、Chunked Prefill、SLO-aware 是高并发场景的进阶手段。

---

## Related

- [[_concepts/continuous-batching]] — Continuous Batching
- [[_concepts/paged-attention]] — PagedAttention
- [[_concepts/prefill-decode]] — Prefill / Decode 阶段
- [[10_Deployment_Inference/Inference_Performance/README|推理性能专题]]
- [[10_Deployment_Inference/Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[10_Deployment_Inference/Inference_Performance/Prefill_Decode_Disaggregation|Prefill-Decode 分离]]
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive|vLLM Deep Dive]]
