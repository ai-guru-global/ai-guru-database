---
title: "分布式并行策略 (Distributed Parallelism)"
category: -concepts
tags: ["distributed", "parallelism", "tensor-parallel", "pipeline-parallel", "data-parallel", "expert-parallel", "megatron", "deepspeed"]
relationships:
  - target: "概念/mixture-of-experts"
    type: related_to
  - target: "概念/model-training"
    type: enables
  - target: "概念/model-serving"
    type: enables
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 模型训练/Distributed_Training/Distributed_Training_2026.md
summary: "分布式并行策略是将大模型训练/推理分布到多GPU上的核心技术——数据并行(DP)、张量并行(TP)、流水线并行(PP)、专家并行(EP)、序列并行(SP)，可组合使用。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.92
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - "Distributed Parallelism"
  - "distributed parallelism"

---
# 分布式并行策略 (Distributed Parallelism)

> **主卡片**: [[distributed-training|分布式训练主卡片]] — 本文侧重并行策略对比矩阵。

> 当模型大到单卡装不下时——五种并行策略的排列组合艺术。

---

## 1. 定义

**分布式并行策略**是将大语言模型的训练或推理分布到多 GPU / 多节点上的核心技术。不同策略从不同维度切分计算，通常组合使用（如 3D 并行 = DP + TP + PP）。

---

## 2. 五大并行策略对比

| 策略 | 切分维度 | 通信量 | 适用场景 | 代表框架 |
|------|----------|--------|----------|----------|
| **数据并行 (DP)** | 数据 batch | AllReduce (梯度) | 模型可单卡放下 | DDP, FSDP |
| **张量并行 (TP)** | 模型参数（层内） | AllReduce (激活) | 单层超过单卡 | Megatron-LM |
| **流水线并行 (PP)** | 模型层（层间） | P2P (层间激活) | 模型超过单卡 | GPipe, PipeDream |
| **序列并行 (SP)** | 序列维度 | AllGather/ReduceScatter | 超长序列 | Ring Attention, Ulysses |
| **专家并行 (EP)** | 专家（MoE） | All-to-All (token 路由) | MoE 模型 | DeepSpeed-MoE |

---

## 3. 各策略详解

### 3.1 数据并行 (Data Parallelism, DP)

```
GPU 0: Model Copy + Data Shard 0 → Grad 0 ─┐
GPU 1: Model Copy + Data Shard 1 → Grad 1 ─┼─ AllReduce → 更新
GPU 2: Model Copy + Data Shard 2 → Grad 2 ─┘
```

| 变体 | 说明 | 显存效率 |
|------|------|----------|
| **DDP** (Distributed Data Parallel) | 每卡完整模型副本，同步 AllReduce | 低（每卡存完整模型） |
| **ZeRO-1** | 仅优化器状态分片 | 中 |
| **ZeRO-2** | 优化器 + 梯度分片 | 较高 |
| **ZeRO-3 (FSDP)** | 优化器 + 梯度 + 参数全分片 | 最高（接近线性扩展） |

### 3.2 张量并行 (Tensor Parallelism, TP)

将单层的权重矩阵按列/行切分到多 GPU：

```
Layer FFN:  x → [W_1 | W_2] → GeLU → [W_3; W_4] → output
            GPU 0   GPU 1              GPU 0  GPU 1
```

- **通信**：每层需要 2 次 AllReduce（前向 + 反向）
- **限制**：通常限于单机内（需要 NVLink 级带宽，700 GB/s+）
- **Megatron-LM 默认**：TP = 8（单机 8 卡）

### 3.3 流水线并行 (Pipeline Parallelism, PP)

将模型层分组到不同 GPU，数据以 micro-batch 流水线执行：

```
GPU 0: Layers 0-15   GPU 1: Layers 16-31   GPU 2: Layers 32-47

Micro-batch 流水线:
Time →
GPU 0: [μ0][μ1][μ2][μ3]...     ← 前向
GPU 1:      [μ0][μ1][μ2][μ3]... ← 前向
GPU 2:           [μ0][μ1][μ2]... ← 前向
```

| 调度策略 | Pipeline Bubble | 说明 |
|----------|-----------------|------|
| **GPipe** | ~50% | 简单但气泡大 |
| **1F1B (PipeDream)** | ~25% | 一前一后交替 |
| **Interleaved 1F1B** | ~12% | Megatron-LM 默认 |
| **Zero Bubble** | ~0% | 学术前沿 |

### 3.4 序列并行 (Sequence Parallelism, SP)

沿序列维度切分，解决超长序列的显存问题：

| 方法 | 原理 | 通信 |
|------|------|------|
| **Megatron SP** | LayerNorm/Dropout 沿序列切分 | AllGather |
| **Ring Attention** | 环形传递 KV block | P2P |
| **Ulysses** | 序列维度 All-to-All 到注意力维度 | All-to-All |
| **Context Parallel** | 序列分块 + Ring 通信 | P2P |

### 3.5 专家并行 (Expert Parallelism, EP)

MoE 模型专用：不同专家分布在不同 GPU：

```
Token → Router → Top-8 专家
                    │
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
GPU 0             GPU 1           GPU 2
Experts 0-85    Experts 86-170   Experts 171-255
```

**通信**：All-to-All（每个 token 需路由到目标 GPU 上的专家）

---

## 4. 3D 并行组合（典型配置）

以 DeepSeek-V3 (671B, 1024 GPUs) 为例：

```
1024 GPUs = 16 nodes × 64 GPUs/node

配置:
├── DP = 16 (数据并行度)
├── TP = 8 (张量并行，机内 NVLink)
├── PP = 8 (流水线并行，跨机)
└── 总并行度 = 16 × 8 × 8 = 1024

通信层级:
├── 机内: TP (AllReduce over NVLink, 700 GB/s)
├── 机间: PP (P2P over RoCE, 1.6T)
└── 全局: DP (AllReduce over RoCE)
```

---

## 5. 推理 vs 训练的并行策略差异

| 维度 | 训练 | 推理 |
|------|------|------|
| **DP 目的** | 梯度并行更新 | 多副本并发请求 |
| **TP 通信** | 前向+反向各 1 次 AllReduce | 仅前向 1 次 AllReduce |
| **PP 气泡** | 需要 micro-batch 调度 | 首请求延迟增加 |
| **典型配置** | 3D (DP×TP×PP) | TP only（单机）或 TP+PP（多机） |
| **框架** | Megatron-LM, DeepSpeed | vLLM, TensorRT-LLM, SGLang |

---

## 6. 并行策略选型指南

| 模型规模 | 推荐策略 | 说明 |
|----------|----------|------|
| **< 7B** | DP only | 单卡可放下，多副本并发 |
| **7B-70B** | TP=8 (单机) + DP | 单机 8 卡张量并行 |
| **70B-175B** | TP=8 + PP=2 + DP | 2 机张量+流水线 |
| **175B-671B** | TP=8 + PP=8 + DP=N | 多机 3D 并行 |
| **MoE 模型** | TP + EP + DP | 专家并行 + 张量并行 |

---

## 7. 主要框架

| 框架 | 策略支持 | 场景 |
|------|----------|------|
| **Megatron-LM** (NVIDIA) | TP + PP + SP + DP | 大规模训练金标准 |
| **DeepSpeed** (Microsoft) | ZeRO-1/2/3 + PP + EP | 训练优化 |
| **FSDP** (PyTorch) | ZeRO-3 like | PyTorch 原生 |
| **vLLM** | TP + PP | 推理 |
| **TensorRT-LLM** | TP + PP | NVIDIA 推理 |

---

## Related

- [[模型训练/Distributed_Training/Distributed_Training_2026]] — 分布式训练
- [[概念/mixture-of-experts]] — MoE（Expert Parallelism）
- [[概念/model-training]] — 模型训练
- [[概念/model-serving]] — 模型服务（推理并行策略）
- [[概念/heterogeneous-gpu]] — 异构 GPU 集群
- [[概念/deepspeed]] — DeepSpeed
- [[概念/fsdp]] — FSDP
- [[概念/megatron-lm]] — Megatron-LM
- [[概念/dualpipe]] — DualPipe 双向流水线

---

## 2026 并行策略选型

| 并行类型 | 适用场景 | 通信开销 | 代表实现 |
|---------|---------|---------|----------|
| **DP** | 扩展吞吐 | 低 | DDP/FSDP |
| **TP** | 节点内大模型 | 高 | Megatron-LM |
| **PP** | 节点间大模型 | 中 | DualPipe |
| **EP** | MoE 模型 | 中 | DeepSpeed-MoE |
| **SP** | 长序列 | 中 | Ring Attention |

## 生产最佳实践

1. **组合策略**：TP 节点内、PP 节点间、DP 扩展吞吐
2. **通信优化**：启用通信重叠、梯度压缩
3. **监控指标**：关注 MFU、通信/计算比、显存峰值
4. **框架选择**：PyTorch 生态用 FSDP，复杂场景用 DeepSpeed/Megatron
5. **负载均衡**：MoE 模型需注意专家负载均衡
