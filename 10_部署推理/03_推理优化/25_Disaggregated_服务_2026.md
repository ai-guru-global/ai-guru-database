---
title: "2026 推理服务前沿架构 (Disaggregated Serving 2026)"
category: 10-deployment-inference-inference-performance
tags: [inference, PD分离, Disaggregated, Chunked-Prefill, distserve, mooncake, splitwise, kv-cache-migration, 2026]
summary: "> **一句话概括**：2026 年 LLM 推理服务从前缀共享 / 连续批处理演进到 Prefill-Decode 分离、Chunked Prefill、Decode 池化的 disaggregated 架构，用 KV Cache 跨节点迁移换两阶段极致解耦。"
created: 2026-07-24
updated: 2026-07-24
tier: core
aliases:
  - "Disaggregated Serving 2026"
  - "PD 分离 2026"
  - Disaggregated_Serving_2026
sources:
  - "DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving (OSDI 2024)"
  - "Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving (Moonshot AI, 2024)"
  - "Splitwise: Efficient Generative LLM Inference Using Phase Splitting (ISCA 2024)"
  - "SARATHI: Efficient LLM Inference by Piggybacking Decodes with Chunked Prefills (2024)"
  - "vLLM V1 / SGLang Disaggregated Serving 2025-2026"
name_zh: "2026 推理服务前沿架构"
---

# 2026 推理服务前沿架构 (Disaggregated Serving 2026)

> 中文简称：2026 推理服务前沿架构

> **一句话概括**：2026 年 LLM 推理服务从前缀共享 / 连续批处理演进到 **Prefill-Decode 分离、Chunked Prefill、Decode 池化** 的 disaggregated 架构——用一个基座模型拆出两个物理资源池，靠 KV Cache 跨节点迁移把"算力"和"带宽"两类瓶颈彻底解耦。

本文是 [[10_部署推理/03_推理优化/13_Prefill_Decode_Disaggregation|PD分离基础]] 的 2026 工程化升级版，聚焦 **Chunked Prefill、DistServe / Mooncake / Splitwise 的真实系统设计、KV Cache 迁移建模与单池 vs 双池的取舍**。

---

## 目录

1. [背景：为什么要做 disaggregated serving](#1-背景为什么要做-disaggregated-serving)
2. [干扰问题深度分析](#2-干扰问题深度分析)
3. [Chunked Prefill：消除干扰的"单池"解法](#3-chunked-prefill消除干扰的单池解法)
4. [Disaggregated Prefill-Decode：物理分离的"双池"解法](#4-disaggregated-prefill-decode物理分离的双池解法)
5. [KV Cache 迁移：迁移什么、怎么传、延迟建模](#5-kv-cache-迁移迁移什么怎么传延迟建模)
6. [Decode 池化：访存密集的高密度打包](#6-decode-池化访存密集的高密度打包)
7. [调度算法：配比动态调整与跨池路由](#7-调度算法配比动态调整与跨池路由)
8. [系统对比：Mooncake / DistServe / Splitwise / Sarathi](#8-系统对比mooncake--distserve--splitwise--sarathi)
9. [混合架构：单池 Chunked Prefill vs 双池 Disaggregated](#9-混合架构单池-chunked-prefill-vs-双池-disaggregated)
10. [性能收益实测](#10-性能收益实测)
11. [工程落地要点与陷阱](#11-工程落地要点与陷阱)
12. [选型决策树与 FAQ](#12-选型决策树与-faq)

---

## 1. 背景：为什么要做 disaggregated serving

LLM 推理的两个阶段在 **计算特性上几乎正交**，这是 disaggregated serving 一切讨论的起点：

| 阶段 | 计算量 | 访存量 | 瓶颈资源 | 典型 batch 形态 |
|------|--------|--------|----------|----------------|
| **Prefill** | 大（一次处理整个 prompt） | 中（GEMM 受限） | **算力 FLOPS** | 小 batch、大序列 |
| **Decode** | 小（每步 1 token） | 大（读全部 KV Cache） | **显存带宽 HBM** | 大 batch、单 token |

这两类工作的"理想硬件配置"完全不同：Prefill 喜欢 **高算力密度**（FLOPS/$、FLOPS/W），Decode 喜欢 **高显存带宽**（HBM TB/s、大容量缓存）。把它们塞进同一个 GPU 池、同一个连续 batch，就会出现第 2 节的"干扰问题"。

> 2024-2026 的演进主线：**prefix caching → continuous batching → Chunked Prefill（单池消干扰）→ Disaggregated PD（双池解耦）→ Decode 池化 + KV Cache 中心化存储**。基础概念见 [[10_部署推理/03_推理优化/13_Prefill_Decode_Disaggregation|PD分离基础]]。

### 1.1 2026 的现实约束

- 上下文窗口从 32K → 1M（参见 [[10_部署推理/03_推理优化/24_长上下文_推理_2026|长上下文推理]]），prefill 单次成本爆炸。
- MoE 模型（DeepSeek-V3 / Kimi K2 / Qwen3-MoE）让 prefill 更算力密集、decode 更访存密集，分离收益放大。
- 企业 SLO 把 **TTFT（首 token 延迟）** 和 **TPOT（每 token 延迟）** 分开约束，混池几乎不可能同时满足两者。

---

## 2. 干扰问题深度分析

> 这是整个 disaggregated serving 的"病因学"。不搞懂干扰，就无法理解为什么 Chunked Prefill 和双池分离都要被发明出来。

### 2.1 Prefill 与 Decode 的资源需求对比

用 Roofline 模型量化（详见 [[10_部署推理/03_推理优化/01_推理性能_基础|推理性能基础]]）：

```
算术强度 = FLOPs / Bytes

Prefill（大 batch × 长序列）:  算术强度高 → 卡在 "算力区"
Decode（大 batch × 1 token）:  算术强度低 → 卡在 "带宽区"
```

一个 Prefill step 在算力区把 SM（流多处理器）占满；一个 Decode step 在带宽区把 HBM 带宽吃满。**两类工作争抢的是完全不同的硬件资源**，但混池时调度器只能让它们排队。

### 2.2 TTFT 与 TPOT 的冲突

- **TTFT** 主要由 Prefill 决定：`TTFT ≈ T_prefill`（prefill 计算时间 + 排队时间）。
- **TPOT** 主要由 Decode 决定：`TPOT ≈ T_decode_step`（单步 decode + 排队时间）。

冲突点：当一个长 prefill 进入 batch，它会霸占算力数十到数百毫秒，期间 **正在 decode 的所有请求的下一步 token 都被卡住**，TPOT 出现尖刺；反过来，大量 decode 请求占满显存带宽时，新到的 prefill 排队变长，TTFT 恶化。

### 2.3 干扰时间线（ASCII）

下面是一个典型混池的时间线。`P` 表示 prefill chunk，`D` 表示 decode step。理想情况是 D 平稳前进；现实中一个长 P 会把 D 完全打断。

```
理想（无干扰）：
t: 0   1   2   3   4   5   6   7   8   9  10
    D1  D2  D3  D4  D5  D6  D7  D8  D9  D10  ← TPOT 稳定 ~30ms

现实（长 prefill 抢占，混池）：
t: 0   1   2   3   4   5   6   7   8   9  10 11 12 13 14
    D1  D2 [======= P_long (8 步算力独占) =======] D3  D4  D5
              ▲                                            ▲
              │ prefill 到达，SM 被占满                    │ decode 恢复
              └── 这段时间内所有 decode 请求的 TPOT 尖刺到 200ms+

干扰量化：
  - TPOT P99 从 30ms → 250ms（8× 尖刺）
  - 用户感知：输出"卡顿"、逐字变顿
  - 若启用抢占（preemption），prefill 被打断后又造成 TTFT 抖动
```

### 2.4 干扰的三种典型形态

| 干扰形态 | 触发条件 | 受害指标 | 传统缓解 | 根治方案 |
|----------|----------|----------|----------|----------|
| **长 Prefill 阻塞 Decode** | 长 prompt 进入 batch | TPOT 尖刺 | 限制 max batch、优先 decode | Chunked Prefill / PD 分离 |
| **Decode 占满带宽拖慢 Prefill** | 大量并发 decode | TTFT 上升 | 限并发、提前 prefill | PD 分离 |
| **Prefill 与 Decode 互相抢占** | 显存不足触发 preemption | TTFT + TPOT 双抖动 | 增大显存、换出 KV | Decode 池化 + KV offload |

> 关联：抢占机制本身的代价见 [[10_部署推理/03_推理优化/14_Request_调度_for_LLMs|请求调度]] 第 4 节。混池本质上让"调度"承担了它不该承担的"资源隔离"职责。

---

## 3. Chunked Prefill：消除干扰的"单池"解法

> **核心思想**：与其把一个长 prefill 一口气算完（从而霸占算力），不如把它 **切成固定大小的 chunk**，每个 chunk 与 decode step 交替执行，让 decode 永远不被饿死。

Chunked Prefill 又称 **Piggybacking**（Sarathi 论文），是 2024 年被 vLLM、SGLang、TRT-LLM 普遍采纳的"低成本消干扰"方案。

### 3.1 原理

```
传统（非 chunked）：
[==== Prefill 2048 tokens ====][D][D][D][D][D]
 ← 这段时间 decode 全部卡住 →        ← 恢复 →

Chunked（chunk_size = 512）：
[P512][D][P512][D][P512][D][P512][D][D][D][D]
   ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑
   每跑 512 prefill token 就插一个 decode step
   → decode 的 TPOT 始终被"喂"，不出现长间隔
```

### 3.2 关键参数

| 参数 | 含义 | 典型取值 | 影响 |
|------|------|----------|------|
| `chunk_size`（max_tokens_in_batch 中的 prefill 配额） | 每个 step 允许的 prefill token 数 | 256–2048 | 小→TPOT 稳但 prefill 慢；大→prefill 快但 TPOT 抖 |
| `max_num_seqs` | 并发序列数 | 128–1024 | 影响 decode batch 密度 |
| `long_prefill_token_threshold` | 超过此长度强制 chunk | 2048–8192 | 保护长 prompt 不阻塞 |

### 3.3 收益与代价

| 维度 | 收益 | 代价 |
|------|------|------|
| TPOT 稳定性 | 显著改善（无长 stall） | prefill 总时间略增（chunk 边界开销） |
| 吞吐 | 提升（prefill 与 decode 重叠） | 单 step 调度复杂度上升 |
| 实现成本 | 低（单池改造即可） | 无法根治带宽 vs 算力的硬件错配 |
| GPU 利用率 | 提升（SM 更持续占用） | - |

### 3.4 vLLM / SGLang 的实现要点

- **vLLM**：`Scheduler` 在每个 step 把"待 prefill 的请求"按 chunk 切分，与"正在 decode 的请求"拼成混合 batch。V1 调度器默认开启 chunked prefill。
- **SGLang**：在 RadixAttention 之上叠加 chunked prefill，前缀命中时只对 delta 部分做 chunk。
- **TRT-LLM**：In-Flight Batching 天然支持 chunked prefill（称为 "micro-batching"）。

> 局限：Chunked Prefill 仍在 **同一张 GPU、同一个显存池** 上跑，无法解决"算力型卡 vs 带宽型卡"的硬件错配，也无法做 prefill/decode 的 **独立扩缩容**。这引出第 4 节的物理分离。

---

## 4. Disaggregated Prefill-Decode：物理分离的"双池"解法

> **核心思想**：既然 prefill 和 decode 想要不同的硬件，那就直接拆成两个 **物理隔离的 GPU 池**，中间用 KV Cache 迁移连接。

### 4.1 架构总览

```
                          ┌─────────────────────────────┐
   用户请求 ──────────────►│   Global Router / Scheduler  │
                          └──────────┬──────────────────┘
                                     │ 按 input length + SLO 路由
                  ┌──────────────────┴──────────────────┐
                  ▼                                     ▼
        ┌───────────────────┐                 ┌───────────────────┐
        │  Prefill Pool     │                 │   Decode Pool     │
        │  (算力型, 小 batch)│   KV Cache      │ (带宽型, 大 batch) │
        │  高 FLOPS 配置     │ ───迁移(RDMA)──►│  高 HBM 带宽配置   │
        │  tensor 并行宽     │                 │  高密度打包        │
        └───────────────────┘                 └─────────┬─────────┘
                                                        │
                                          流式 token ───┴───► 用户
```

- **Prefill Pool**：每个实例 tensor 并行度（TP）较大、batch 较小，目标是把 prompt 尽快算完输出 KV Cache。
- **Decode Pool**：每个实例 batch 极大（访存密集，可塞几百到上千序列），目标是把 TPOT 压到最低。
- **KV Cache 迁移层**：把 prefill 产出的 KV Cache 送到 decode 池选定的实例。

### 4.2 两阶段解耦带来的"三个独立"

| 维度 | 混池 | Disaggregated |
|------|------|---------------|
| 硬件选型 | 一刀切 | prefill 用算力型，decode 用带宽型 |
| 扩缩容 | 按整体 QPS | prefill 峰值、decode 峰值各自扩缩 |
| 调度 | 一个调度器兼顾两阶段 | 两个独立调度器，各为其 SLO 优化 |

### 4.3 为什么"物理分离"比"逻辑分离"强

逻辑分离（chunked prefill）解决了 **时间维度的干扰**，但解决不了：

1. **硬件维度错配**：同一批 GPU 不可能同时是"最高算力"和"最高带宽"。
2. **扩缩维度耦合**：prefill 高峰时不得不连带扩 decode 实例（浪费），反之亦然。
3. **故障域耦合**：一个 decode 实例 OOM 会拖死同实例的 prefill。

物理分离把这三点全部解耦，代价是引入 KV Cache 迁移（第 5 节）。

---

## 5. KV Cache 迁移：迁移什么、怎么传、延迟建模

> KV Cache 迁移是 disaggregated serving 的"命门"——迁得慢，分离的收益全被吃掉。

### 5.1 迁移什么：block / page 粒度

现代引擎（vLLM、SGLang）用 **PagedAttention** 把 KV Cache 组织成固定大小的 block/page（通常 16 token/block）。迁移的天然单位就是 **block**：

- 不需要迁整个序列，可以 **增量迁移**（prefill 算完一段就传一段）。
- 支持前缀共享：相同前缀的 block 只传一次（见 [[10_部署推理/03_推理优化/05_KV_Cache_深入分析|KV Cache 深度]] 的 paging 部分）。

### 5.2 怎么传：RDMA / GPU Direct / NVLink

| 传输方式 | 带宽 | 延迟 | 适用场景 |
|----------|------|------|----------|
| **TCP / 普通 Ethernet** | 10–25 Gbps | 高（ms 级） | 跨机架、低成本 |
| **RoCE / InfiniBand (RDMA)** | 100–400 Gbps | 低（μs 级） | 机架内 / 集群内主力 |
| **GPU Direct RDMA (GDR)** | 同上，且绕过 CPU | 最低 | GPU↔GPU 直传，Mooncake 主力 |
| **NVLink / NVSwitch** | 300–900 GB/s | 极低 | 同节点内多 GPU |
| **PCIe + 主机内存中转** | 32–64 GB/s | 中 | 无 RDMA 的降级方案 |

传输链路指标与 AI 集群网络设计强相关，参见 [[12_架构基建/08_网络/index|AI网络]]。

### 5.3 迁移延迟建模

KV Cache 大小（FP16）：

```
KV_size = 2 × seq_len × n_layers × n_kv_heads × head_dim × 2 bytes

例：Llama-3 70B（80 层, GQA 8 KV heads, head_dim=128）, seq_len=8192:
  = 2 × 8192 × 80 × 8 × 128 × 2
  ≈ 2.68 GB
```

迁移时间（忽略协议开销的粗略下界）：

```
T_transfer = KV_size / Bandwidth

例：2.68 GB / 200 Gbps(=25 GB/s) ≈ 107 ms
   2.68 GB / 400 Gbps(=50 GB/s) ≈ 54 ms
   用 GPU Direct + 量化到 FP8：2.68/2 = 1.34 GB → 27 ms
```

关键结论：

| seq_len | FP16 KV 大小 | 200 Gbps 迁移 | 400 Gbps + FP8 |
|---------|--------------|---------------|----------------|
| 2K | 0.67 GB | 27 ms | 7 ms |
| 8K | 2.68 GB | 107 ms | 27 ms |
| 32K | 10.7 GB | 430 ms | 107 ms |
| 128K | 42.9 GB | 1.7 s | 430 ms |

> 超长上下文（>32K）下，迁移延迟可能 **超过 prefill 本身**，这是 disaggregated serving 在长上下文场景的"软肋"，必须配合 **pipeline 重叠传输**（边 prefill 边传）和 **KV 量化传输**。

### 5.4 隐藏迁移延迟的工程手段

| 手段 | 原理 | 收益 |
|------|------|------|
| **Pipeline 传输** | prefill 算完一个 block 立刻传，不等全部算完 | 把 T_transfer 与 T_prefill 重叠 |
| **KV 量化传输** | 传输 FP8/INT8，到 decode 池再反量化 | 带宽 ×2 |
| **前缀复用** | 共享前缀的 KV 只传 delta | 命中时 T_transfer → 0 |
| **就近调度** | prefill 与 decode 落同一机架/节点 | 用 NVLink 代替网络 |
| **分层 KV Store** | 热 KV 在 HBM，温 KV 在 CPU DRAM，冷 KV 在 SSD（Mooncake KVCache 池） | 解耦存储与计算 |
| **预取 / 预调度** | decode 池提前预约，KV 到达即跑 | 消除 decode 侧等待 |

---

## 6. Decode 池化：访存密集的高密度打包

> Decode 是访存密集型工作，**算力大量闲置**，所以可以把 batch 打到极大，让每张 GPU 服务远多于 prefill 池的序列数。

### 6.1 为什么 decode 能高密度打包

```
Decode step 的算术强度 ≈ (batch × 1 token 的 FLOPs) / (batch × seq_len × KV 读取字节)
                       ≈ 2 × d_model / (2 × seq_len × d_model)
                       ≈ 1 / seq_len   （远低于硬件拐点）
```

算术强度极低意味着 **GPU 算力远没用满**，瓶颈在带宽。增加 batch size 几乎不增加算力消耗（每多一条序列只多一点点 attention FLOPs），但能摊薄每 token 的带宽成本。

### 6.2 batch size 对比

| 池 | 典型 batch size | 主要占用资源 | 利用率特征 |
|----|-----------------|--------------|------------|
| Prefill Pool | 4–32（小 batch、大序列） | 算力 SM | 算力接近打满 |
| Decode Pool | 256–2048（大 batch、单 token） | HBM 带宽 | 带宽接近打满，算力闲置 70%+ |

### 6.3 decode 池的容量上限

decode 池能塞多少序列，由 **KV Cache 显存** 决定（而非算力）：

```
max_seqs_in_decode_pool ≈ (GPU_HBM - model_weights) / per_seq_KV

例：H100 80GB, 70B 模型 FP16 权重 ~140GB(需 TP=2),
    每条 8K 上下文序列 KV ≈ 2.68GB,
    可用 ~20GB → 约 7 条/卡（TP=2 下 ~14 条）
用 GQA/MLA 压缩 + KV FP8 后，可提升到几十到上百条/卡。
```

这就是为什么 decode 池化必须配合 [[10_部署推理/03_推理优化/05_KV_Cache_深入分析|KV Cache 深度]] 里的 GQA/MLA/量化一起做。

---

## 7. 调度算法：配比动态调整与跨池路由

> disaggregated serving 的"大脑"是全局调度器，它要回答三个问题：prefill/decode 池各配多少卡、请求路由到哪个 prefill 实例、KV 迁移到哪个 decode 实例。

### 7.1 Prefill-Decode 配比

DistServe 给出的原则：**按 goodput（满足 SLO 的有效吞吐）最大化来配比**，而不是按总吞吐。

```
goodput = throughput ∝ (prefill_capacity × decode_capacity) / (prefill_load + decode_load)

最优配比 r* = prefill_gpus / decode_gpus 满足:
    prefill_capacity(r* × N) ≈ decode_capacity((1-r*) × N)
即两池的"瓶颈产能"相等（木桶原理）。
```

经验值（DistServe 报告）：

| 负载特征 | prefill : decode |
|----------|------------------|
| 短输入短输出（chat） | 1 : 2 ~ 1 : 3 |
| 长输入短输出（RAG 摘要） | 2 : 1 ~ 3 : 1 |
| 长输入长输出（写作） | 1 : 1 |
| 超长上下文（>128K） | 3 : 1 ~ 5 : 1（prefill 极重） |

### 7.2 请求路由

| 路由决策 | 依据 | 目标 |
|----------|------|------|
| 选 prefill 实例 | 当前队列长度、输入长度、前缀命中率 | 最小化 TTFT + 最大化前缀复用 |
| 选 decode 实例 | 剩余 KV 容量、网络距离、负载 | 最小化 TPOT + 避免迁移抖动 |
| 迁移路径 | prefill↔decode 拓扑、带宽余量 | 最小化 T_transfer |

### 7.3 Mooncake 的"KVCache-centric"调度

Mooncake（Moonshot AI）把 KV Cache 当作 **一等公民**，全局调度围绕 KV 的"生产-传输-消费"展开：

1. 请求到达 → router 选一个 prefill 实例（优先命中已有前缀 KV 的实例）。
2. prefill 产出 KV → 写入 **全局 KVCache 池**（分层：GPU HBM → CPU DRAM → SSD）。
3. router 选一个 decode 实例 → KV 从池中按需迁移。
4. decode 流式输出，KV 持续追加到池。

这种"KV 中心化"让前缀共享、多轮对话、容错迁移都变成 KV 池的管理问题，而非请求路由问题。

---

## 8. 系统对比：Mooncake / DistServe / Splitwise / Sarathi

| 系统 | 年份 | 核心思想 | 关键创新 | 池形态 | KV 迁移 | 生产规模 |
|------|------|----------|----------|--------|---------|----------|
| **Sarathi** | 2023-24 | Chunked Prefill（piggyback） | 单池消干扰 | 单池 | 无（同池） | 被 vLLM/SGLang 吸收 |
| **DistServe** | 2024 (OSDI) | PD 物理分离 + goodput 优化 | 配比理论、迁移建模 | 双池 | RDMA | 学术原型 |
| **Splitwise** | 2024 (ISCA) | 按阶段拆到不同 GPU 类型 | 算力型 vs 带宽型硬件 | 双池 | 节点内 | 学术原型 |
| **Mooncake** | 2024 (Moonshot) | KVCache-centric 分离 | 全局 KV 池、分层存储 | 双池 + KV 池 | GPU Direct RDMA | **大规模生产**（Kimi） |
| **DeepSeek Infra** | 2024-25 | MoE + PD 分离 | 专家负载均衡 + PD 解耦 | 双池 | RDMA | 生产 |
| **vLLM Disaggregated** | 2025-26 | V1 支持 PD 分离 | 与 PagedAttention 集成 | 双池 | 可配置 | 生产可用 |
| **SGLang PD** | 2025-26 | RadixAttention + PD 分离 | 前缀树跨池共享 | 双池 | RDMA | 生产可用 |

### 8.1 选型要点

- **要最低实现成本先消干扰** → Sarathi / Chunked Prefill（单池）。
- **要极致 TTFT + TPOT + 独立扩缩** → DistServe 式双池。
- **超大规模 + 多轮对话 + 前缀复用** → Mooncake 式 KV 池。
- **MoE 模型** → DeepSeek 式专家感知分离。

---

## 9. 混合架构：单池 Chunked Prefill vs 双池 Disaggregated

> 这是 2026 年工程上争论最多的问题：**到底上不上双池？** 答案取决于负载形态、团队能力、网络条件。

### 9.1 对比表

| 维度 | 单池 Chunked Prefill | 双池 Disaggregated |
|------|----------------------|--------------------|
| 干扰消除 | 时间维度（部分） | 时间 + 硬件维度（彻底） |
| 实现复杂度 | 低（改造调度器） | 高（router + 迁移 + 双调度） |
| 硬件要求 | 普通 GPU 集群 | 最好有 RDMA + 异构卡 |
| 扩缩容粒度 | 整实例 | prefill/decode 各自 |
| TTFT 优化 | 中等 | 显著 |
| TPOT 稳定性 | 良好 | 极佳 |
| 长上下文支持 | 一般（带宽瓶颈） | 好（prefill 可大 TP） |
| 多轮对话/前缀复用 | 好（同池易共享） | 需 KV 池配合 |
| 适用规模 | 中小（<几十卡） | 大（百卡以上） |

### 9.2 何时用单池 Chunked Prefill

- 团队规模小，不想引入双调度器、KV 迁移的复杂度。
- 负载以短输入短输出为主，干扰不严重。
- 没有高速互联（RDMA/NVLink）。
- 卡数 < 几十张。

### 9.3 何时用双池 Disaggregated

- TTFT 和 TPOT 有 **独立的严格 SLO**（如 TTFT < 500ms 且 TPOT < 30ms）。
- 负载 **长输入占比高**（RAG、长文档、代码仓库）。
- 有 **异构硬件**（算力型卡 + 带宽型卡）或 RDMA 互联。
- 规模够大（百卡以上），迁移开销可被吞吐增益摊薄。
- 多轮对话/前缀复用频繁 → 配 KV 池（Mooncake 式）。

### 9.4 渐进式演进路径

推荐的工程演进路线（从低到高）：

```
[1] continuous batching + prefix caching
        │ （遇到 TPOT 尖刺）
        ▼
[2] + Chunked Prefill（Sarathi）           ← 单池，成本最低
        │ （遇到硬件错配 / 长上下文 / 独立 SLO）
        ▼
[3] + PD 双池分离（DistServe 式）            ← 引入 router + 迁移
        │ （遇到多轮对话 / 前缀复用需求）
        ▼
[4] + 全局 KVCache 池（Mooncake 式）         ← KV 中心化
```

---

## 10. 性能收益实测

> 以下数据综合 DistServe / Mooncake / Splitwise 论文与 2025-2026 开源引擎 benchmark，仅供量级参考。

### 10.1 DistServe（vs vLLM 连续批处理基线）

| 指标 | 基线（混池） | DistServe（双池） | 提升 |
|------|--------------|-------------------|------|
| Goodput（满足 SLO 的吞吐） | 1× | **2–4×** | 2–4 倍 |
| TTFT P99 | 1× | 0.3–0.5× | 降低 50–70% |
| TPOT P99 | 1× | 0.2–0.4× | 降低 60–80% |

### 10.2 Mooncake（Kimi 生产）

- 在 Moonshot 内部生产环境，PD 分离 + KV 池使 **吞吐提升数倍**，同时支撑百万级上下文请求。
- KV 池命中率提升后，迁移开销被前缀复用大幅摊薄。

### 10.3 Splitwise（异构硬件）

- 用算力型 GPU 做 prefill、带宽型 GPU 做 decode，相比同构混池 **每 token 成本降低 1.4–2.5×**。

### 10.4 Sarathi / Chunked Prefill

- 相比非 chunked，**decode 延迟（TPOT）降低 2–10×**（消除长 stall），prefill 时间增加 < 10%。

### 10.5 综合量级判断

| 场景 | 收益来源 | 典型量级 |
|------|----------|----------|
| 短输入短输出 | 主要靠 chunked prefill | 吞吐 +20–50% |
| 长输入 | PD 分离 | TTFT -50%，吞吐 +2× |
| 长上下文 | PD 分离 + 大 TP prefill | TTFT -70% |
| 多轮对话 | KV 池前缀复用 | 迁移开销 -80% |

---

## 11. 工程落地要点与陷阱

### 11.1 落地检查清单

- [ ] **量化干扰**：先用 profiling 确认 TPOT 尖刺确实来自 prefill 抢占（而非别的原因）。
- [ ] **评估迁移开销**：测算目标 seq_len 下的 `T_transfer`，确认小于 `T_prefill`。
- [ ] **网络就绪**：RDMA/InfiniBand 带宽是否够？跨机架延迟是否可接受？
- [ ] **KV 池选型**：是否需要分层存储（HBM/DRAM/SSD）？冷热策略？
- [ ] **配比自动化**：用 goodput 反馈控制动态调整 prefill/decode 卡数。
- [ ] **容错**：decode 实例宕机时，KV 能否从池中重新路由？
- [ ] **监控**：分别监控 TTFT、TPOT、迁移延迟、KV 池命中率。

### 11.2 常见陷阱

| 陷阱 | 现象 | 规避 |
|------|------|------|
| 迁移吃掉收益 | 上双池后 TTFT 反而变高 | 必须开 pipeline 传输 + 量化 + 就近调度 |
| 配比静态 | 负载变化后某池长期过载/空闲 | 动态配比（goodput 反馈） |
| 前缀复用失效 | 双池后前缀命中率暴跌 | 引入 KV 池，跨池共享前缀 |
| 双份显存 | 迁移途中 prefill 与 decode 各存一份 KV | 用零拷贝 / GPU Direct |
| 调试黑盒 | 故障难定位在哪一环 | 全链路 tracing（router→prefill→迁移→decode） |

---

## 12. 选型决策树与 FAQ

### 12.1 决策树

```
你的负载？
├─ 短输入短输出（chat）、卡数<几十
│   └─ continuous batching + Chunked Prefill（单池）
├─ 长输入（RAG/长文档）/ 独立 SLO / 有 RDMA
│   └─ PD 双池分离（DistServe 式）
│       ├─ 多轮对话 / 前缀复用频繁 → + KVCache 池（Mooncake 式）
│       └─ MoE 模型 → 专家感知分离（DeepSeek 式）
└─ 超长上下文（>128K）
    └─ PD 分离 + 大 TP prefill + KV 量化传输（必选）
```

### 12.2 FAQ

**Q1：Chunked Prefill 能完全替代 PD 分离吗？**
不能。Chunked Prefill 解决时间维度干扰，但解决不了硬件错配、独立扩缩容、独立 SLO。负载轻时够用，负载重或长上下文时必须上双池。

**Q2：KV 迁移会不会让延迟反而变高？**
会，如果迁移没优化。但配合 pipeline 传输 + 量化 + 前缀复用，迁移延迟可被隐藏到 prefill 时间之内，净收益为正。关键是别让 `T_transfer > T_prefill`。

**Q3：PD 分离对 MoE 模型有什么额外好处？**
MoE 模型 prefill 时专家负载波动大，分离后 prefill 池可专门做专家负载均衡；decode 池则可按热专家做缓存优化。见 [[10_部署推理/03_推理优化/22_MoE_推理优化|MoE 推理优化]]。

**Q4：小团队/单机能上 disaggregated serving 吗？**
不建议。单机资源不够拆两个池，迁移开销也不划算。单机用 Chunked Prefill 即可。

**Q5：PD 分离和 speculative decoding 冲突吗？**
不冲突，可叠加。Speculative decoding 在 decode 池内加速，PD 分离在外层解耦。见 [[10_部署推理/03_推理优化/12_Speculative_Decoding_高级_2026|Speculative Decoding 2026]]。

---

## 相关知识

- [[10_部署推理/03_推理优化/13_Prefill_Decode_Disaggregation|PD分离基础]] — 本页的基础概念版
- [[10_部署推理/03_推理优化/18_Parallel_策略_深入分析|并行策略]] — 双池如何与 TP/PP 组合
- [[10_部署推理/03_推理优化/14_Request_调度_for_LLMs|请求调度]] — 连续批处理、抢占、优先级
- [[10_部署推理/03_推理优化/24_长上下文_推理_2026|长上下文推理]] — 长上下文为何放大 PD 分离收益
- [[10_部署推理/03_推理优化/05_KV_Cache_深入分析|KV Cache 深度]] — paging、GQA/MLA、量化（迁移的基础）
- [[10_部署推理/03_推理优化/README|推理性能]] — 性能专题索引
- [[10_部署推理/index|部署推理]] — 部署推理总索引
- [[12_架构基建/08_网络/index|AI网络]] — RDMA/InfiniBand 与迁移链路
- [[05_大模型/index|大模型]] — 大模型总索引

---

## 参考论文与系统

1. **DistServe** — *Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving*, OSDI 2024.
2. **Mooncake** — *A KVCache-centric Disaggregated Architecture for LLM Serving*, Moonshot AI, 2024.
3. **Splitwise** — *Efficient Generative LLM Inference Using Phase Splitting*, ISCA 2024.
4. **Sarathi** — *Efficient LLM Inference by Piggybacking Decodes with Chunked Prefills*, 2024.
5. **vLLM V1 / SGLang** — 2025-2026 开源 disaggregated serving 实现。
6. **DeepSeek Infra** — MoE + PD 分离生产实践。

> 本文为 2026 前沿工程化综述，具体参数与收益随硬件、模型、负载变化，生产落地前请以实测为准。
