---
title: "LLM 并行策略全景 (Parallel Strategies Deep Dive)"
category: "10-deployment-inference-inference-optimization"
tags: ["parallelism", "tensor-parallel", "pipeline-parallel", "data-parallel", "expert-parallel", "sequence-parallel", "context-parallel", "fsdp", "megatron", "training", "inference"]
summary: "> **一句话概括**: TP/PP/DP/EP/SP/CP 六种并行维度如何切分一个万亿参数模型——本页从单卡瓶颈讲到 5D 并行组合，覆盖训练与推理的差异。"
created: "2026-07-24"
updated: "2026-07-24"
tier: core
aliases:
  - "Parallel Strategies Deep Dive"
  - "LLM 并行策略"
  - Parallel_Strategies_Deep_Dive
sources: []
name_zh: "LLM 并行策略全景"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LLM 并行策略全景 (Parallel Strategies Deep Dive)

> 中文简称：LLM 并行策略全景

> **一句话概括**: TP/PP/DP/EP/SP/CP 六种并行维度如何切分一个万亿参数模型——本页从单卡瓶颈讲到 5D 并行组合，覆盖训练与推理的差异。

---

## 目录

1. [为什么需要并行](#1-为什么需要并行)
2. [数据并行 DP / DDP / FSDP](#2-数据并行-dp--ddp--fsdp)
3. [张量并行 TP](#3-张量并行-tp)
4. [流水并行 PP](#4-流水并行-pp)
5. [序列并行 SP](#5-序列并行-sp)
6. [上下文并行 CP](#6-上下文并行-cp)
7. [专家并行 EP](#7-专家并行-ep)
8. [多维并行组合](#8-多维并行组合)
9. [并行策略对比](#9-并行策略对比)
10. [推理 vs 训练并行差异](#10-推理-vs-训练并行差异)
11. [框架支持](#11-框架支持)
12. [选型建议与总结](#12-选型建议与总结)

---

## 1. 为什么需要并行

### 1.1 单 GPU 的物理极限

一个 175B 参数的 GPT-3 模型，仅权重（FP16）就需要 $175 \times 10^9 \times 2 \text{ bytes} \approx 350\text{GB}$ 显存，远超单卡 H100 的 80GB。算上梯度、优化器状态（Adam 需 2 倍参数量的动量）和激活值，显存需求可达权重的 16 倍以上：

```
显存构成（训练，Adam + FP16 混合精度）:
─────────────────────────────────────────────
权重 W          : 2Φ bytes        (Φ = 参数量)
梯度 ∇W         : 2Φ bytes
优化器状态 m, v  : 4Φ + 4Φ = 8Φ bytes   (FP32)
激活值 A        : 与 batch × seq 相关
─────────────────────────────────────────────
总计            ≈ 16Φ bytes (不含激活)
```

对于 175B 模型：$16 \times 175\text{B} \approx 2.8\text{TB}$，至少需要 **35 张 H100** 才能放下训练状态。推理虽然没有梯度/优化器，但 KV Cache 随上下文增长，长上下文场景同样需要多卡。

### 1.2 并行的两条路线

并行本质上是把"一个模型的一次前向/反向"拆分到多张卡上，拆分维度有两个正交方向：

- **切数据**（Data Parallel）：每张卡算不同的样本，最后聚合梯度。
- **切模型**（Model Parallel）：把模型本身拆开，包括切层（Pipeline）、切矩阵（Tensor）、切专家（Expert）、切序列（Sequence/Context）。

下图给出全景：

```
                        ┌── Data Parallel (DP/DDP/FSDP)
                        │       切 batch
                        │
  并行策略 ──────────────┼── Model Parallel
                        │   ├── Tensor Parallel (TP)   切矩阵
                        │   ├── Pipeline Parallel (PP) 切层
                        │   ├── Expert Parallel (EP)   切专家 (MoE)
                        │   ├── Sequence Parallel (SP) 切激活序列维
                        │   └── Context Parallel (CP)  切注意力序列维
                        │
                        └── 组合: TP × PP × DP × EP × CP  (多维并行)
```

> 这六种维度互相正交，可以同时启用。NVIDIA 训练 GPT 时就是 TP×PP×DP 三维组合；DeepSeek-V3 训练用 TP×PP×EP×CP 四维。

### 1.3 通信是并行的代价

每多一个并行维度，就多一种通信开销。粗略地，各维度的关键通信：DP 用 All-Reduce 聚合梯度（每步）、TP 用 All-Reduce 传每层激活（极高带宽敏感）、PP 用点对点传激活（可重叠）、EP 用 All-to-All 路由 token、SP 用 All-Gather/Reduce-Scatter、CP 用环形 P2P 或 All-to-All 切 attention 序列。通信系统的细节见 [[10_部署推理/03_推理优化/19_Communication_系统_深入分析|通信系统全景]]。

---

## 2. 数据并行 DP / DDP / FSDP

数据并行是最古老也最简单的并行：每张卡持有**完整模型副本**，处理 batch 的不同子集，各自前向反向后用 All-Reduce 聚合梯度。

### 2.1 原始 DP（Parameter Server，已淘汰）

PyTorch 早期的 `torch.nn.DataParallel`（DP）用主卡聚合梯度，主卡显存和带宽成为瓶颈，已被弃用。

### 2.2 DDP（Distributed Data Parallel）

`torch.nn.parallel.DistributedDataParallel` 采用 **Ring All-Reduce**，无主卡瓶颈，梯度聚合带宽利用率高。

```
DDP 每步流程:
─────────────────────────────────────────────
1. 每张卡持有完整模型 W (副本相同)
2. 每张卡取 batch 的不同 shard: x_0, x_1, ..., x_{n-1}
3. 各自前向 + 反向，得到局部梯度 g_i
4. Ring All-Reduce: g = (1/n) Σ g_i   ← 梯度同步
5. 各卡用相同 g 更新 W (SGD/Adam)
─────────────────────────────────────────────
通信量: O(Φ) 每步   (Φ = 参数量)
显存:   每卡存完整 W + 梯度 + 优化器状态
```

**DDP 的瓶颈**：每卡都要存完整模型 + 优化器状态。模型一大（>10B），单卡放不下，DDP 失效。

### 2.3 FSDP（Fully Sharded Data Parallel）

FSDP（PyTorch 原生）和它的前身 ZeRO-3（DeepSpeed）把**参数、梯度、优化器状态都分片**到所有卡上，用前按需 All-Gather 拼回，用完即释放。

```
FSDP 分片机制 (ZeRO Stage 3):
─────────────────────────────────────────────
全局模型 W 切成 n 份: W_0, W_1, ..., W_{n-1}
卡 i 只常驻存 W_i, ∇W_i, optimizer_state_i

前向到 FSDP 层时:
  All-Gather  → 临时拼出完整 W
  前向计算
  释放完整 W (只留 W_i)

反向时同理按层 All-Gather 拼回 → 反向 → 释放
梯度 Reduce-Scatter 回分片
─────────────────────────────────────────────
显存: 每卡只存 W/n + ∇W/n + opt/n  (≈ 1/n)
通信: All-Gather(前向+反向) + Reduce-Scatter(梯度)
```

**FSDP vs DDP 对比**：

| 维度 | DDP | FSDP (ZeRO-3) |
|------|-----|---------------|
| 参数存储 | 每卡完整副本 | 分片，每卡 1/n |
| 显存（训练） | ~16Φ/n 卡里每卡 16Φ | ~16Φ 总量分摊，每卡 16Φ/n |
| 通信 | All-Reduce 梯度 | All-Gather + Reduce-Scatter |
| 适用模型规模 | < 10B | 10B ~ 数千亿 |
| 实现复杂度 | 简单 | 中（需配置分片策略） |

> ZeRO 三个 Stage 的显存节省：Stage 1 切优化器状态（4×）、Stage 2 再切梯度（8×）、Stage 3 再切参数（16×，即 FSDP）。

**ZeRO 显存公式**（Adam + FP16 混合精度，n 卡）：

$$
\text{Mem}_{\text{Stage3}} = \frac{16\Phi}{n} + \text{激活}
$$

对比 DDP 的 $\text{Mem}_{\text{DDP}} = 16\Phi + \text{激活}$，FSDP 把模型部分显存降为 1/n。

### 2.4 FSDP 的实践要点

- **reshard_after_forward**：反向时是否重新分片，影响显存/通信权衡。
- **CPU offload**：把不用的分片卸到 CPU 内存，进一步省显存（牺牲速度）。
- **mixed precision**：FSDP 与 BF16/FP8 配合，通信量减半。
- **不适合超大 batch 的长序列**：激活值未被分片，长上下文仍需结合 SP/CP。

---

## 3. 张量并行 TP

张量并行（Tensor Parallelism）把**单个矩阵乘法**切到多张卡上同步执行，是模型并行的最细粒度。Megatron-LM 是其代表实现。

### 3.1 为什么切矩阵

一个线性层 $Y = XW$，其中 $X \in \mathbb{R}^{b \times s \times h}$，$W \in \mathbb{R}^{h \times h'}$。把 $W$ 按列或按行切开，分配到不同卡，每卡算一部分，最后通信合并。

### 3.2 列并行（Column Parallel）

把权重 $W$ 按列切成 $[W_0, W_1, \dots, W_{n-1}]$，每卡持有 $W_i$：

```
列并行 (Column Parallel):
                          ┌───┐
   X ──────────────────►  │W_0│ ──► Y_0   (GPU 0)
   (输入复制到所有卡)      │W_1│ ──► Y_1   (GPU 1)
                          │...│
                          │W_n│ ──► Y_n   (GPU n)
                          └───┘
   Y = [Y_0 | Y_1 | ... | Y_n]   (按列拼接，无需通信即可得到完整 Y)
```

- **输入 X** 需在所有卡上（复制或共享）。
- **输出 Y** 按列分布，**无需通信**即可进入下一个并行算子。
- 适合作为多层感知机（MLP）第一层。

### 3.3 行并行（Row Parallel）

把权重 $W$ 按行切，输入 $X$ 也按列切：

```
行并行 (Row Parallel):
   X = [X_0 | X_1 | ... | X_n]   (输入按列分片)
        │      │            │
        ▼      ▼            ▼
       X_0W_0 X_1W_1  ...  X_nW_n
        │      │            │
        └──────┴──── All-Reduce ─────► Y = Σ X_iW_i
```

- 输出需要 **All-Reduce** 求和才完整。
- 适合作为 MLP 第二层（直接接列并行第一层的输出）。

### 3.4 Megatron 的 MLP 切法（列并行 + 行并行）

Megatron-LM 把一个 MLP（$Y = \text{GeLU}(XA)B$）拆成：第一层列并行、第二层行并行，**中间无需通信**：

```
Megatron MLP (TP=n):
─────────────────────────────────────────────
        X (复制到 n 卡)
        │
   ┌────┴────┐
   │ Col Par │  A 列切: A_0..A_n
   └────┬────┘
        ▼
   Z_i = GeLU(X · A_i)     ← 各卡独立，无通信
        │
   ┌────┴────┐
   │ Row Par │  B 行切: B_0..B_n
   └────┬────┘
        ▼
   Y_i = Z_i · B_i
        │
   All-Reduce              ← 唯一通信点
        ▼
        Y = Σ Y_i
─────────────────────────────────────────────
每层 MLP 只需 1 次 All-Reduce (而非每层 2 次)
```

**通信量**：每层一次 All-Reduce，传输 $b \times s \times h'$ 个元素。由于在 NVLink 域内（单节点），延迟低。

### 3.5 Self-Attention 的 TP

多头注意力天然适合 TP：把 head 切到不同卡，每卡算一部分 head，最后 All-Reduce。这是 TP 对 attention 的高效切法。

### 3.6 TP 的适用场景与推理变体

| 场景 | TP 适用性 |
|------|-----------|
| 单节点内（NVLink/NVSwitch） | ✅ 高效，All-Reduce 低延迟，标准 TP=8 |
| 跨节点（IB/RoCE） | ⚠️ All-Reduce 延迟高，TP 通常 ≤2 |
| 小模型（< 1B） | ❌ 通信开销大于收益 |

> **经验法则**：TP 一般不超过单节点 GPU 数（通常 8）。跨节点用 PP/DP 而非 TP，因为 All-Reduce 对延迟极敏感。

推理时 TP 同样切权重，但有特殊优化：All-Reduce 可换成更轻的通信（如 vLLM 的自定义 allreduce kernel，针对 NVLink 拓扑优化）；TP + KV Cache 分片时每卡只存自己 head 的 KV，无需复制。注意 TP 在 decode 阶段（batch=1）时通信占比高，需谨慎选择 TP 度。详见 [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM]] 中 tensor-parallel 部署章节。

---

## 4. 流水并行 PP

流水并行（Pipeline Parallelism）把模型的**不同层**放到不同卡上，数据像流水线一样依次流过。GPU 0 算前几层，结果传给 GPU 1 算中间几层，…… GPU n 算最后几层。

### 4.1 基本结构与气泡问题

最朴素的 PP（朴素流水线）有严重的 **气泡（bubble）**：同一时刻只有一张卡在工作，其他卡空等。

```
朴素 Pipeline (4 卡, 4 micro-batch):
时间 ──►
GPU0: [F0]........[B0]
GPU1:      [F1]........[B1]
GPU2:           [F2]........[B2]
GPU3:                [F3]........[B3]
      └── 大量气泡(空闲) ──┘   F=前向 B=反向
```

气泡占比：$(p-1)/m$，其中 $p$ 为流水线级数（卡数），$m$ 为 micro-batch 数。$m$ 越大气泡越小，但显存占用也越大（要存多个 micro-batch 的激活）。

### 4.2 GPipe

GPipe 把一个 batch 切成 $m$ 个 micro-batch，**先全部前向，再全部反向**：

```
GPipe (m=4, p=4):
GPU0: F0 F1 F2 F3 ............... B0 B1 B2 B3
GPU1:    F0 F1 F2 F3 .......... B0 B1 B2 B3
GPU2:       F0 F1 F2 F3 ..... B0 B1 B2 B3
GPU3:          F0 F1 F2 F3 B0 B1 B2 B3
气泡: 前后两端的空白区域
```

- 优点：实现简单，前向/反向阶段清晰。
- 缺点：要保存所有 micro-batch 的激活用于反向，**激活显存大**。

### 4.3 PipeDream / 1F1B

1F1B（One Forward One Backward）在流水线填满后立即开始反向，**交错执行前向和反向**，减少激活显存：

```
1F1B (m=4, p=4):
GPU0: F0 F1 F2 F3 B0 F4 B1 F5 B2 ...    (稳态: 1F1B 交替)
GPU1:    F0 F1 F2 B0 F3 B1 F4 B2 ...
GPU2:       F0 F1 B0 F2 B1 F3 B2 ...
GPU3:          F0 B0 F1 B1 F2 B2 ...
激活显存: 只需保存约 p 个 micro-batch 的激活 (vs GPipe 的 m 个)
```

- 优点：**激活显存显著降低**（O(p) vs O(m)）。
- 缺点：调度复杂，稳态前仍有 warmup 气泡。

### 4.4 Interleaved 1F1B（Megatron）

Megatron-LM 的 Interleaved 1F1B（也叫"虚拟流水线"）把每张卡上的层分成 $v$ 个 **virtual stage**（chunk），让通信更频繁但气泡更小：

```
Interleaved 1F1B (v=2, p=4):
每卡持有 2 个 chunk，相邻卡交错传递
气泡从 (p-1)/m 降到 (p-1)/(m×v)
代价: 通信次数 ×v，点对点通信量不变
```

气泡占比公式：

$$
\text{bubble ratio}_{\text{interleaved}} = \frac{p-1}{m \cdot v}
$$

通过增大 $v$（虚拟段数）可进一步压气泡，代价是通信次数增加。

### 4.5 PP 的通信与权衡

- PP 每层边界做 **Point-to-Point** 通信（传激活张量），只需相邻卡通信，带宽需求低于 TP 的 All-Reduce。
- 适合**跨节点**：相邻节点间点对点带宽（IB 200/400 Gbps）够用。
- PP 的层划分要**负载均衡**：不同层计算量不同（attention vs MLP），需手动或自动平衡。

### 4.6 PP 各方案对比

| 方案 | 气泡 | 激活显存 | 通信 | 复杂度 |
|------|------|----------|------|--------|
| 朴素 PP | 大 $(p-1)/m$ | O(m) | P2P | 低 |
| GPipe | 中 $(p-1)/m$ | O(m) | P2P | 低 |
| 1F1B | 中 $(p-1)/m$ | O(p) | P2P | 中 |
| Interleaved 1F1B | 小 $(p-1)/(mv)$ | O(p×v) | P2P ×v | 高 |

---

## 5. 序列并行 SP

序列并行（Sequence Parallelism）是 Megatron-LM 引入的**对 TP 的优化**，目的是减少 TP 中非矩阵乘部分（LayerNorm、Dropout、softmax 等）的激活值通信。

### 5.1 TP 的激活通信问题

在标准 Megatron TP 中，LayerNorm、Dropout 这些**元素级操作**的激活值在所有 TP 卡上都是完整复制（冗余），但它们产生的 All-Reduce 通信量与矩阵乘一样大。对于大模型，这部分激活通信占 TP 总通信的 30%+。

### 5.2 Megatron SP 的思路

把**元素级操作的激活**沿序列维度切分，每卡只存 1/n 的序列：

```
Megatron Sequence Parallelism:
─────────────────────────────────────────────
LayerNorm/Dropout 阶段:
   激活按 sequence 维切分, 每卡存 seq/n

进入 TP 矩阵乘前:
   All-Gather (sequence 维) → 拼回完整序列

TP 矩阵乘 + All-Reduce 结束后:
   Reduce-Scatter (sequence 维) → 重新切分
─────────────────────────────────────────────
效果: 元素级操作的激活显存降到 1/n
      通信从 All-Reduce 变成 All-Gather + Reduce-Scatter (总量相当但更均匀)
```

数学上，SP 把 TP 的 All-Reduce 替换为 Reduce-Scatter + All-Gather 的组合，二者通信量相等（All-Reduce = Reduce-Scatter + All-Gather），但 SP 让元素层操作也在分片状态下执行。

### 5.3 SP 的收益

| 指标 | 标准 TP | TP + SP |
|------|---------|---------|
| 元素层激活显存 | 完整 | 1/n |
| 通信总量 | All-Reduce | 相当（更均匀） |
| 激活显存总量 | 基线 | 显著降低 |
| 适用 | 通用 | 大模型训练标配 |

> SP 必须与 TP 同时启用（SP 度 = TP 度），不能独立使用。它是 TP 的"伴侣优化"。

### 5.4 SP 与 CP 的区别

容易混淆：

- **SP（Megatron SP）**：切 LayerNorm/Dropout 等**元素层激活**，针对 TP 的通信优化，切分维度是序列但语义上是减少 TP 冗余。
- **CP（Context Parallelism）**：切 **Attention 的序列维度**，解决长上下文 attention 的 $O(N^2)$ 显存，是真正的"分布式注意力"。

详见第 6 节和 [[10_部署推理/03_推理优化/24_长上下文_推理_2026|长上下文推理]]。

---

## 6. 上下文并行 CP

上下文并行（Context Parallelism）解决**长序列 attention 的 $O(N^2)$ 显存**问题：把 Q、K、V 沿序列维度切分到多卡，每卡只算自己那一段的 attention，通过环形通信拼出完整结果。

### 6.1 长上下文的显存墙

Attention 的中间矩阵 $S = QK^T \in \mathbb{R}^{N \times N}$。序列长度 $N$ 越大，显存和算力都 $O(N^2)$ 增长。100K 上下文的 attention 中间结果单卡放不下，必须分布式计算。

### 6.2 Ring Attention（环形注意力）

Ring Attention 把序列切成 $p$ 段，每卡持有一段 Q/K/V，卡间组成环，K/V 沿环传递：

```
Ring Attention (p=4):
─────────────────────────────────────────────
初始: GPU i 持有 Q_i, K_i, V_i (序列第 i 段)

Step 0:  GPU_i 用本地 Q_i 和 K_i,V_i 算 partial attn
Step 1:  K,V 沿环传递: GPU_i 收到 K_{i-1},V_{i-1}
         累积 attn 结果 (online softmax)
Step 2:  继续传递,累积...
...
Step p-1: 每张卡已遍历所有 K/V, 得到完整 O_i

通信: 每步传 K,V (P2P, 相邻卡)
计算: 每卡本地 attention, 与通信重叠
─────────────────────────────────────────────
每卡显存: O(N/p × d)  (只存一段)
通信: p-1 次 P2P, 可与计算 overlap
```

关键是 **online softmax**（同 FlashAttention）让部分结果可以增量累积，无需存整个 $N \times N$ 矩阵。

### 6.3 Ulysses 变体

Ulysses（DeepSpeed）用 **All-to-All** 替代环形 P2P：

```
Ulysses CP:
─────────────────────────────────────────────
1. Q,K,V 沿序列维切分: 每卡有 Q_i (heads × N/p × d)
2. All-to-All: 重排成 每卡拥有部分 head 的完整序列
   (heads/n × N × d)
3. 每卡在完整序列上算自己负责的 head
4. All-to-All: 重排回序列切分
─────────────────────────────────────────────
优势: All-to-All 比 Ring 的 P2P 在高带宽网络下更高效
劣势: 要求 head 数 ≥ CP 度
```

### 6.4 Ring vs Ulysses 对比

| 维度 | Ring Attention | Ulysses |
|------|----------------|---------|
| 通信模式 | P2P 环形 | All-to-All |
| 通信量 | $O(N \cdot d)$ 每步，$p$ 步 | $O(N \cdot d)$ 一次 |
| head 数限制 | 无 | head 数 ≥ CP 度 |
| 计算通信重叠 | 好（环形天然重叠） | 较差（需 All-to-All 同步） |
| 适用 | 长序列、低带宽 | 高带宽、head 多 |

### 6.5 CP 与 SP 的协同

CP 和 SP 都切序列维，但 CP 切 attention 的序列（需要环形/All-to-All 拼结果），SP 切元素层的序列（TP 伴侣）。现代 Megatron 同时启用 TP+SP+CP：

- 元素层激活：SP 切分（减少 TP 通信）。
- Attention 序列：CP 切分（解决长上下文显存）。

---

## 7. 专家并行 EP

专家并行（Expert Parallelism）专为 MoE 模型设计：把不同的**专家**放到不同 GPU 上，token 按路由结果跨卡分发。详见 [[10_部署推理/03_推理优化/22_MoE_推理优化|MoE 推理优化]]，这里聚焦与其它并行的组合。

### 7.1 EP 的基本通信：All-to-All

每个 MoE 层，router 决定 token 去哪个专家，然后：

```
EP All-to-All 流程 (E 个专家分到 E 张卡):
─────────────────────────────────────────────
1. Router: 每个 token → Top-K 专家
2. Dispatch (All-to-All): token 按目标专家发到对应卡
3. 专家计算: 每卡本地 FFN
4. Combine (All-to-All): 结果发回原卡
─────────────────────────────────────────────
通信量: O(batch × seq × hidden × 2)  (dispatch + combine)
```

### 7.2 EP 与 DP/TP 的组合

MoE 模型的非专家部分（attention、shared expert）仍需 TP/DP，因此 EP 通常与其他并行叠加：

| 组合 | 说明 | 典型 |
|------|------|------|
| EP + DP | 每组卡跑一个数据副本，组内专家分片 | DeepSeek-V3 |
| EP + TP | 每个专家再用 TP 切分（专家太大） | Mixtral 8x22B |
| EP + DP + TP + PP | 全维度并行 | 万亿 MoE 训练 |

### 7.3 EP 度选择

EP 度 $e$ 与专家数 $E$ 的关系：通常 $e \leq E$（每卡至少 1 个专家）。DeepSeek-V3 有 256 个专家，可用 EP=64（每卡 4 专家）甚至 EP=256（每卡 1 专家）。

> EP 度越高，单专家显存越小，但 All-to-All 通信越大。需结合网络拓扑（NVLink/IB）权衡。

### 7.4 EP 的负载均衡挑战

- 若 token 路由不均，某些卡的专家被打爆（热点），其他卡空闲。
- 训练用 auxiliary loss 鼓励均衡；推理用 expert duplication（复制热专家）或 dynamic routing。
- 详见 [[10_部署推理/03_推理优化/22_MoE_推理优化|MoE 推理优化]] 第 4 节。

---

## 8. 多维并行组合

实际生产中，单一并行维度无法覆盖，需要组合。NVIDIA 训练万亿参数模型用 TP×PP×DP，DeepSeek-V3 用 TP×PP×EP×CP。

### 8.1 组合原则

```
多维并行组合的决策树:
─────────────────────────────────────────────
1. 先定 TP: 通常 = 单节点 GPU 数 (8), 依赖 NVLink
2. 再定 EP: MoE 模型, 按专家数和网络定 (≤专家数)
3. 再定 PP: 跨节点, 按 PP=节点数 或更细
4. 再定 CP: 长上下文, 按序列长度和显存定
5. 最后 DP: 用剩余 GPU 做数据并行, 提升吞吐
─────────────────────────────────────────────
约束: TP × PP × EP(×CP) × DP = 总 GPU 数
```

**层次化放置**（拓扑感知）：

```
GPU 拓扑层次 (由近到远):
NVLink 域 (单节点 8 卡)  →  放 TP (需 All-Reduce, 低延迟)
节点内 → 节点间 (IB)     →  放 PP (P2P, 可重叠)
节点组                   →  放 DP/EP/CP
```

### 8.2 典型配置表（按模型规模）

| 模型规模 | 总 GPU | TP | PP | EP | CP | DP | 说明 |
|----------|--------|----|----|----|----|----|------|
| 7B Dense | 8 | 1 | 1 | - | - | 8 | 纯 DDP，单卡放得下 |
| 13B Dense | 8 | 2 | 1 | - | - | 4 | TP=2 跨 2 卡 |
| 70B Dense | 64 | 8 | 2 | - | - | 4 | TP×PP×DP=8×2×4 |
| 175B Dense | 512 | 8 | 8 | - | - | 8 | 经典 GPT-3 规模训练 |
| 405B Dense | 1024 | 8 | 16 | - | 2 | 4 | 含长上下文 CP |
| Mixtral 8x22B | 64 | 8 | 1 | 8 | - | 1 | EP=TP=8 |
| DeepSeek-V3 (671B MoE) | 2048 | 2 | 8 | 64 | 4 | 2 | 4D 并行 |

### 8.3 通信层次示例

以 DeepSeek-V3 配置（TP=2, PP=8, EP=64, CP=4, DP=2，共 2048 卡）为例，通信分层：

```
2048 GPU = 2(TP) × 8(PP) × 64(EP) × 4(CP) × 2(DP)

通信层次 (由频繁到稀疏):
├─ TP All-Reduce: 每 attention/MLP 层, NVLink 域 (2卡同节点)
├─ EP All-to-All: 每个 MoE 层, 64 卡范围 (跨节点, IB)
├─ CP P2P: 每个 attention 层, 4 卡范围
├─ PP P2P: 每个 PP 边界, 相邻节点
└─ DP All-Reduce: 每步反向, 2 个数据副本间
```

---

## 9. 并行策略对比

### 9.1 六种并行总览表

| 并行 | 切分对象 | 关键通信 | 通信频率 | 显存节省 | 适用规模 | 拓扑要求 |
|------|----------|----------|----------|----------|----------|----------|
| DP/DDP | batch | All-Reduce(梯度) | 每步 | 无（每卡完整副本） | < 10B | 任意 |
| FSDP | batch + 参数分片 | All-Gather + Reduce-Scatter | 每层 | 参数 1/n | 10B~千亿 | 任意（带宽敏感） |
| TP | 矩阵 | All-Reduce(激活) | 每层 | 参数+激活 1/n | 任意大 | NVLink 域内 |
| PP | 层 | P2P(激活) | 每层边界 | 参数 1/p（激活 O(p)） | 任意大 | 跨节点可行 |
| SP | 元素层激活序列 | All-Gather + Reduce-Scatter | 每层 | 激活 1/n | 配合 TP | 同 TP |
| CP | attention 序列 | P2P 环 / All-to-All | 每个 attention | 激活 1/c | 长上下文 | 带宽敏感 |
| EP | 专家 | All-to-All(token) | 每个 MoE 层 | 专家 1/e | MoE 模型 | 带宽敏感 |

### 9.2 通信量与显存公式

通信量（$\Phi$ 参数量，$B$=batch×seq，$h$=hidden，$L$=层数，$n$=卡数）：

| 并行 | 单步通信量 | 通信类型 |
|------|-----------|----------|
| DP | $2\Phi$（All-Reduce = RS + AG） | 集合通信 |
| FSDP | $\sim 3\Phi$（前向+反向 AG + 梯度 RS） | 集合通信 |
| TP | $2 \cdot L \cdot B \cdot h$（每层 All-Reduce） | 集合通信，频繁 |
| PP | $L \cdot B \cdot h$（层边界 P2P） | 点对点 |
| EP | $2 \cdot B \cdot h$（每 MoE 层 All-to-All） | All-to-All |

训练显存（Adam + FP16）：

$$
\text{Mem} = \underbrace{\frac{16\Phi}{n_{\text{fsdp}}}}_{\text{FSDP 分片}} + \underbrace{\text{激活}}_{\text{随 batch×seq}}, \quad
\text{激活显存/卡} \approx \frac{\text{激活总量}}{n_{\text{tp}} \times n_{\text{sp}} \times n_{\text{cp}}}
$$

---

## 10. 推理 vs 训练并行差异

训练和推理的并行策略虽原理相通，但优化目标截然不同。

### 10.1 目标差异

| 维度 | 训练 | 推理 |
|------|------|------|
| 优化目标 | 吞吐（samples/s）、收敛 | 延迟（TTFT/TPOT）+ 吞吐 |
| 梯度通信 | 必需（All-Reduce 梯度） | 无 |
| batch | 越大吞吐越高（受显存限） | 动态、变化（continuous batching） |
| 序列长度 | 固定/打包 | 变长、逐 token 增长 |
| 气泡容忍 | 较高（可大 batch 填） | 低（影响尾延迟） |

### 10.2 推理特有的并行优化与通信占比

- **无梯度通信**：推理只有前向，省掉 DP 的梯度 All-Reduce。
- **TP 为主**：推理引擎（vLLM/SGLang）默认 TP，因为单节点 NVLink 低延迟，且 TP 对 decode 友好。
- **EP 用于 MoE 推理**：DeepSeek-V3 推理用 EP，配合 expert duplication 均衡负载。
- **CP / Ring Attention**：长上下文推理（100K+）用 CP 切 attention。
- **PP 少用**：推理流水线气泡直接转化为用户感知的延迟，一般避免；除非超大模型（405B+）显存不够才用。
- **PD 分离**：Prefill 和 Decode 用不同并行配置（如 prefill 高 TP、decode 高 EP），见 [[10_部署推理/03_推理优化/13_Prefill_Decode_Disaggregation|Prefill-Decode 分离]]。

decode 阶段（batch 小、计算少）通信占比尤其高：单步计算 $O(N \times d)$，而 TP 通信 $O(d)$ 与计算同量级，decode 时 TP 通信可能占 30%+ 时间。vLLM 等引擎用自定义 allreduce kernel（针对 NVLink 拓扑）优化。

---

## 11. 框架支持

### 11.1 各框架并行支持矩阵

| 框架 | DP/FSDP | TP | PP | EP | SP | CP | 主要场景 |
|------|---------|----|----|----|----|----|----------|
| **Megatron-LM** | ✅ | ✅ | ✅(1F1B/Interleaved) | ✅ | ✅ | ✅ | 训练（并行策略发源地） |
| **DeepSpeed** | ✅(ZeRO) | ✅ | ✅ | ✅ | ✅ | ✅(Ulysses) | 训练（ZeRO/Ulysses） |
| **vLLM** | ✅(DP) | ✅ | ⚠️(有限) | ✅ | ❌ | ✅ | 推理（TP/EP 为主） |
| **SGLang** | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | 推理（类似 vLLM） |
| **TensorRT-LLM** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | 推理（NVIDIA 优化） |
| **PyTorch FSDP2** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 训练（原生 FSDP） |

### 11.2 各框架特点

- **Megatron-LM**：NVIDIA 出品，TP/PP/SP/CP 的"参考实现"，业界标准。训练必看。
- **DeepSpeed**：微软出品，ZeRO（FSDP 思想来源）+ Ulysses（CP 变体）+ ZeRO-Infinity（CPU/NVMe offload）。
- **vLLM / SGLang**：推理引擎，TP 为主，EP 支持 MoE，CP 支持长上下文。PP 少用（影响延迟）。
- **TensorRT-LLM**：NVIDIA 推理引擎，对 NVIDIA 硬件深度优化，支持全维度并行。

### 11.3 选择建议

| 场景 | 推荐框架 | 推荐并行 |
|------|----------|----------|
| 从零训练 70B+ | Megatron-LM / DeepSpeed | TP×PP×DP (+SP/CP) |
| 微调 7B-13B | PyTorch FSDP2 | FSDP |
| 推理服务 Dense 模型 | vLLM / SGLang | TP（单节点） |
| 推理服务 MoE | vLLM (EP) / TRT-LLM | TP×EP |
| 长上下文推理 | vLLM (CP) | TP×CP |

---

## 12. 选型建议与总结

### 12.1 性能调优 checklist

- [ ] TP 度 = 单节点 GPU 数（NVLink 域）
- [ ] PP 用 Interleaved 1F1B 减气泡
- [ ] 激活显存大 → 启用 SP
- [ ] 长上下文 → 启用 CP（Ring 或 Ulysses）
- [ ] MoE → EP + 负载均衡
- [ ] 梯度通信慢 → FSDP + 梯度压缩/FP8 通信
- [ ] 通信占比高 → 用 nsys/ncu profile，见 [[10_部署推理/03_推理优化/19_Communication_系统_深入分析|通信系统全景]]

### 12.2 一句话总结

> 并行策略的本质是"**沿正交维度切分计算**"：DP 切 batch、TP 切矩阵、PP 切层、EP 切专家、SP/CP 切序列。六者可叠加成 5D 并行，关键是在 GPU 拓扑上合理分层——TP 放 NVLink 域、PP 放跨节点、DP 兜底吞吐。推理时去掉梯度通信，以 TP 为主、EP/CP 按需，并用 PD 分离进一步优化。

---

## Related

- [[10_部署推理/index|部署推理]]
- [[10_部署推理/03_推理优化/22_MoE_推理优化|MoE 推理优化]]
- [[10_部署推理/03_推理优化/24_长上下文_推理_2026|长上下文推理]]
- [[10_部署推理/03_推理优化/19_Communication_系统_深入分析|通信系统全景]]
- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM]]
- [[10_部署推理/03_推理优化/13_Prefill_Decode_Disaggregation|Prefill-Decode 分离]]
- [[12_架构基建/07_硬件与算力/index|硬件计算]]
- [[12_架构基建/08_网络/index|AI 网络]]
- [[05_大模型/index|大模型]]
- [[10_部署推理/README|模型部署与推理]]
