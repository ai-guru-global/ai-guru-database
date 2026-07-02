---
title: 推理性能术语大白话解释
category: 10-deployment-inference-inference-performance
tags: [inference, glossary, beginner, moe, mla, gqa, flops, prefill, decode, ttft, quantization, nvlink, infiniband, pd-disaggregation]
summary: "> 用大白话解释 MoE、MLA/GQA、FLOPS、Prefill、Decode、TTFT、量化、NVLink/IB、PD 分离等推理性能核心术语。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Inference Terms For Dummy"
  - "Inference Terms for dummy"
  - Inference_Terms_for_dummy
sources: []

---
# 推理性能术语大白话解释

> 把推理性能里最常出现的术语，用生活化的语言讲清楚。

---

## 1. MoE（混合专家模型）

### 大白话

想象你去医院看病：

- **Dense 模型** = 每个病人都找同一个全科医生，什么病都看。
- **MoE 模型** = 医院里有 256 个专科医生，但前台会根据你的症状，只把你分到 2-8 个最相关的科室。

所以 MoE 的医院“看起来很大、医生很多”，但每个病人实际看的医生很少。

### 技术一句话

> MoE 把 FFN 层拆成很多“专家”，每个 token 只激活少数几个专家，实现“参数量大但计算量小”。

### 为什么影响推理速度

- **好处**：激活参数少，推理 FLOPs 接近小模型。
- **代价**：token 要在不同专家之间“串门”（All-to-All 通信），专家和负载要均衡。

---

## 2. MLA / GQA（KV Cache 压缩技术）

### 大白话

想象 LLM 推理时要记住前面说过的所有话。标准做法是每个人（每个注意力头）都单独记一份笔记。

- **标准 MHA**：32 个人各记各的，笔记很厚。
- **GQA**：32 个人分成 8 组，每组共用一份笔记，笔记变薄。
- **MQA**：32 个人共用一份笔记，更薄。
- **MLA**：不直接记笔记，而是记一个“压缩摘要”，用时再展开，最薄。

### 技术一句话

> MLA/GQA/MQA 通过减少 KV Cache 的头数或维度，降低 decode 阶段的显存带宽压力。

### 为什么影响推理速度

Decode 阶段每生成一个字都要读一遍 KV Cache。KV Cache 越小，读得越快，TPOT 越低。

---

## 3. FLOPS（每秒浮点运算次数）

### 大白话

FLOPS 就是 GPU 每秒能做多少次数学运算。

- 像 CPU 的“几核几线程”。
- FLOPS 越高，算得越快。

但注意：

- **FLOPS 高 ≠ 推理一定快**。如果数据搬运慢，GPU 算力会闲置。
- Prefill 阶段主要吃 FLOPS，decode 阶段主要吃显存带宽。

### 技术一句话

> FLOPS 衡量 GPU 峰值算力，是 prefill 阶段的主要瓶颈指标。

---

## 4. Prefill（处理输入阶段）

### 大白话

你把问题发给 ChatGPT，它要先**把你说的话全部看一遍**，理解上下文，算出一个“记忆”（KV Cache）。

这个过程就是 Prefill。

- 输入越长，看得越久。
- 这一步是并行的：所有输入 token 一起算。

### 技术一句话

> Prefill 是自回归推理的第一阶段，一次性处理整个输入 prompt，生成所有 token 的 KV Cache。

### 为什么影响推理速度

Prefill 决定 **TTFT（首字等待时间）**。长输入会导致用户等很久才看到第一个字。

---

## 5. Decode（逐字生成阶段）

### 大白话

Prefill 看完后，模型开始**一个字一个字往外蹦**：

1. 生成第一个字
2. 把第一个字接回去
3. 生成第二个字
4. 把第二个字接回去
5. ...

这个过程就是 Decode。

- 每次只生成 1 个字。
- 但生成每个字时都要看前面所有字。

### 技术一句话

> Decode 是自回归推理的第二阶段，逐个生成输出 token，主要受显存带宽限制。

### 为什么影响推理速度

Decode 决定 **TPOT（每字生成时间）**。输出越长，这一步耗时越久。

---

## 6. TTFT（首字等待时间）

### 大白话

你从发送问题，到看到模型回复**第一个字**，中间等待的时间。

- 就像你问朋友问题，他沉默思考的那段时间。
- TTFT 主要被 prefill 阶段决定。

### 技术一句话

> TTFT = Time To First Token，从请求到达至输出第一个 token 的延迟。

### 常见目标

| 场景 | 目标 |
|------|------|
| 在线聊天 | P50 < 100ms，P99 < 500ms |
| 长文档处理 | 可能几秒到几十秒 |

---

## 7. 量化（Quantization）

### 大白话

量化就是**把模型参数的精度降低**。

- FP16：每个数用 16 位存，像高清图。
- INT8：每个数用 8 位存，像普通图。
- INT4：每个数用 4 位存，像压缩图。

精度越低：

- 模型越小，加载越快。
- 显存占用越少。
- 计算和读写越快。
- 但质量可能略微下降。

### 技术一句话

> 量化通过降低权重和激活的数值精度，减少显存占用和带宽消耗，从而加速推理。

### 常见做法

- 权重量化：INT8/INT4/GPTQ/AWQ
- KV Cache 量化：FP8/INT8

---

## 8. NVLink / InfiniBand（卡间通信）

### 大白话

多 GPU 一起工作时，它们之间要传数据。

- **NVLink**：像 GPU 之间的“专用高速通道”，在一块主板或相邻卡之间很快。
- **InfiniBand（IB）**：像机房里的“高速公路”，连接不同服务器上的 GPU，速度也很快。
- **普通以太网**：像乡间小路，慢且不稳定。

### 技术一句话

> NVLink 是 NVIDIA GPU 的高速互联，InfiniBand 是数据中心级 RDMA 网络，两者都是多卡/多节点推理的关键通信基础设施。

### 为什么影响推理速度

- MoE 的 All-to-All 通信。
- 多卡并行（TP/PP/EP）时的数据传输。
- 通信慢了，GPU 会空等。

---

## 9. PD 分离（Prefill-Decode 分离）

### 大白话

Prefill 和 Decode 是两种完全不同的工作：

- **Prefill**：像写文章前的“查资料、列大纲”，需要大量脑力（算力）。
- **Decode**：像“逐字誊写”，需要手速（显存带宽）。

PD 分离就是：**让擅长查资料的人去 prefill，让擅长写字的人去 decode**，互相不拖累。

### 技术一句话

> PD 分离把 prefill 和 decode 阶段拆到不同的 GPU/实例上执行，分别优化算力和带宽瓶颈。

### 为什么影响推理速度

- 长输入不会阻塞正在生成的请求。
- prefill 和 decode 可以独立扩缩容。
- 代价：需要在两者之间传输 KV Cache。

---

## 10. 一句话总览

| 术语 | 大白话 | 决定什么 |
|------|--------|----------|
| MoE | 很多专科医生，但只看相关科室 | 大模型的计算效率 |
| MLA/GQA | 多个人共用/压缩笔记 | KV Cache 大小、decode 速度 |
| FLOPS | GPU 每秒算多少 | prefill 算力上限 |
| Prefill | 先读完整个输入 | TTFT（首字等待） |
| Decode | 逐字生成 | TPOT（每字耗时） |
| TTFT | 看到第一个字要等多久 | 用户体验 |
| 量化 | 把模型压小 | 显存、带宽、速度 |
| NVLink/IB | GPU 间高速公路 | 多卡通信效率 |
| PD 分离 | 查资料和写字分开干 | 长上下文/高并发稳定性 |

---

## Related

- [[_concepts/mixture-of-experts]] — MoE
- [[_concepts/multi-head-latent-attention]] — MLA
- [[_concepts/attention-variants]] — GQA/MQA
- [[_concepts/flops]] — FLOPS
- [[_concepts/prefill-decode]] — Prefill / Decode
- [[_concepts/ttft]] — TTFT
- [[_concepts/quantization]] — 量化
- [[_concepts/gpu-interconnect]] — GPU 互联
- [[_concepts/rdma-roce]] — RDMA / InfiniBand
- [[_concepts/prefill-decode-disaggregation]] — PD 分离
- [[10_Deployment_Inference/Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[10_Deployment_Inference/Inference_Performance/Inference_Speed_Factors_for_dummy|决定模型推理速度的要素]]
