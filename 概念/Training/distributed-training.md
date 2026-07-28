---
title: "分布式训练（Distributed Training）"
tags: [distributed-training, parallelism, data-parallel, model-parallel, pipeline-parallel, tensor-parallel, fsdp, deepspeed, megatron]
aliases:
  - "Distributed Training"
  - "分布式训练"
  - "Distributed Parallelism"
category: -concepts
sources:
  - 07_模型训练/04_Distributed_Training/Ray_Deep_Dive.md
  - 07_模型训练/04_Distributed_Training/FSDP_Deep_Dive.md
  - 07_模型训练/04_Distributed_Training/Megatron_LM_Deep_Dive.md
relationships:
  - target: "概念/distributed-parallelism"
    type: simplified
  - target: "概念/data-parallelism"
    type: belongs_to
  - target: "概念/model-parallelism"
    type: belongs_to
  - target: "概念/3d-parallelism"
    type: evolves_into
summary: "分布式训练是通过数据并行、模型并行、流水线并行、张量并行等策略，将大模型训练任务分解到多个 GPU/节点上的工程体系，是训练 10B+ 参数模型的关键技术。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-07-21
name_zh: "分布式训练"
---

# 分布式训练（Distributed Training）

> 中文简称：分布式训练

## 一句话定义

**分布式训练 = 多 GPU/多节点协同训练一个大模型** —— 通过**数据并行 (DP)**、**模型并行 (MP)**、**流水线并行 (PP)**、**张量并行 (TP)**、**序列并行 (SP)**、**专家并行 (EP)** 等策略，将单个训练任务分解到 N 个 GPU/节点上协同完成，是训练 10B+ 参数模型的必备技术。

## 为什么需要分布式训练

| 模型规模 | 单卡 H100 显存需求 | 单卡可不可行 |
|---------|-------------------|-------------|
| 7B FP16 | ~14GB | ✅ 单卡可行 |
| 13B FP16 | ~26GB | ✅ 80GB 卡可训 |
| 70B FP16 | ~140GB | ❌ 需张量并行 |
| 175B FP16 | ~350GB | ❌ 需 3D 并行 |
| 1T+ FP8 | >1TB | ❌ 需 3D + ZeRO + 序列并行 |

**三大资源瓶颈**：

1. **显存**：参数 + 梯度 + 优化器状态 + 激活值 → 单卡 H100 80GB 远不够
2. **算力**：训练 70B 模型需 1000+ PetaFLOPs × 训练步数
3. **通信**：多卡协同的梯度同步、参数广播开销

## 五大并行策略

### 1. 数据并行 (Data Parallel, DP)

**思路**：每张卡持有完整模型副本，处理不同 mini-batch 数据，梯度同步后更新。

```
GPU 0: 模型副本 + batch 0    ──┐
GPU 1: 模型副本 + batch 1    ──┼──► AllReduce 梯度
GPU 2: 模型副本 + batch 2    ──┤
GPU 3: 模型副本 + batch 3    ──┘
```

- **优点**：实现简单（PyTorch DDP 一行启用）
- **缺点**：每卡都要存完整模型，显存没省
- **变体**：
  - **DDP**（DistributedDataParallel）：PyTorch 原生
  - **ZeRO**（Zero Redundancy Optimizer）：DeepSpeed 提出，把优化器状态分片到多卡
    - ZeRO-1：分片优化器状态
    - ZeRO-2：分片梯度
    - ZeRO-3：分片参数（最激进，显存节省 8x，但通信量增加）

### 2. 张量并行 (Tensor Parallel, TP)

**思路**：把矩阵乘法的权重矩阵切分到多卡，每卡算部分结果。

```
原始权重 W = [4096, 4096]
GPU 0: W[:, :2048]   ──┐
GPU 1: W[:, 2048:]   ──┼──► 合并结果
                     ──┘
```

- **典型实现**：Megatron-LM（NVIDIA）
- **通信模式**：AllReduce 每层
- **适用场景**：单节点多卡，模型层太大放不下
- **通信开销**：高（每层都要同步）

### 3. 流水线并行 (Pipeline Parallel, PP)

**思路**：把模型按层切片，不同 GPU 负责不同层段。

```
GPU 0: Layer 0-7   ──►
GPU 1: Layer 8-15  ──►
GPU 2: Layer 16-23 ──►
GPU 3: Layer 24-31 ──► 输出
```

- **优点**：不同卡存模型不同段，显存省
- **缺点**：流水线 bubble（部分卡闲置等待）
- **典型实现**：PipeDream、PaddlePaddle、MindSpore
- **改进**：
  - **GPipe**：同步小 batch 切分
  - **PipeDream-1F1B**：1F1B 调度减少 bubble
  - **Interleaved PP**：层交错进一步减少 bubble

### 4. 序列并行 (Sequence Parallel, SP)

**思路**：长序列（>32K）切分到多卡，每卡处理一段序列。
- Megatron-SP、Ring Attention
- 显存节省与序列长度成正比
- 与 TP/PP 可叠加

### 5. 专家并行 (Expert Parallel, EP)

**思路**：MoE 模型中不同 GPU 持有不同专家，只激活部分专家。
- DeepSpeed-MoE、Mesh-TensorFlow
- 显存和算力都大幅节省
- 通信挑战：All-to-All

## 3D 并行：组合策略

现代大模型训练通常 **3D 并行 = DP + TP + PP**：

```
                    完整集群 (e.g., 256 GPUs)
                            │
              ┌─────────────┴─────────────┐
              │     数据并行 (DP=8)        │  ← 处理不同 batch
              └─────────────┬─────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
      ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
      │ TP=4, PP=4│   │ TP=4, PP=4│   │ TP=4, PP=4│  ← 每节点 16 卡
      │ (16 卡)   │   │ (16 卡)   │   │ (16 卡)   │
      └───────────┘   └───────────┘   └───────────┘
      节点 0          节点 1          节点 2
```

**典型 70B 训练配置**：

| 并行维度 | 数值 | 说明 |
|---------|------|------|
| 张量并行 TP | 8 | 单节点内 8 卡 |
| 流水线并行 PP | 4 | 4 个节点 |
| 数据并行 DP | 32 | 32 路副本 |
| 总 GPU | 1024 | 8 × 4 × 32 |
| ZeRO | 关闭 | TP+PP 已分片 |
| 单 batch size | 1024 tokens | 32 × 32 |
| 全局 batch size | 32K tokens | |

## 主流框架对比

| 框架 | 提供方 | 强项 | 代表项目 |
|------|--------|------|---------|
| **PyTorch DDP + FSDP** | Meta | 原生、灵活 | Llama 3 |
| **DeepSpeed** | Microsoft | ZeRO 易用性 | BLOOM、MT-NLG |
| **Megatron-LM** | NVIDIA | TP 极致优化 | GPT-3、Megatron-Turing |
| **Colossal-AI** | HPC-AI Tech | 多维并行 + 异构 | BLOOM |
| **MindSpore** | Huawei | 国产、图优化 | Pangu |
| **PaddlePaddle** | Baidu | 国产、4D 并行 | ERNIE |
| **JAX + pjit** | Google | 函数式 | PaLM、Gemma |
| **Alpa** | UC Berkeley | 自动并行 | OPT-175B |

## 通信原语

分布式训练的核心是通信优化：

| 原语 | 用途 | 带宽需求 |
|------|------|---------|
| **AllReduce** | 梯度同步 | 高 |
| **AllGather** | 收集分片参数 | 高 |
| **ReduceScatter** | 归约 + 分散 | 高 |
| **Broadcast** | 广播参数 | 中 |
| **All-to-All** | MoE 路由 | 极高 |
| **Send/Recv** | PP 阶段传递 | 中 |

**通信库**：

- **NCCL**（NVIDIA 闭源，性能最优）
- **Gloo**（Meta 开源，CPU fallback）
- **OneCCL**（Intel）
- **BytePS**（字节跳动，自研高性能）

## 关键性能指标

- **MFU**（Model FLOPs Utilization）：实际算力 / 理论峰值，>50% 为优
- **HFU**（Hardware FLOPs Utilization）：含通信损耗的真实利用率
- **Throughput**（tokens/sec）：全局吞吐，受弱卡限制（木桶效应）
- **Step time**：每步训练时间，P50/P99

## 调试与故障排查

常见分布式训练故障：

1. **NCCL 通信超时**：节点间网络问题、驱动版本不一致
2. **显存 OOM**：减小 batch size / 启用 ZeRO / 启用 gradient checkpointing
3. **Loss 不收敛**：学习率需要按全局 batch size 线性缩放（√N 或 linear scaling rule）
4. **慢卡（straggler）**：硬件故障或资源争抢，需监控每卡利用率
5. **Checkpoint 加载失败**：不同 TP/PP 切分导致权重形状不匹配

## 何时选择何种策略

| 模型规模 | 集群规模 | 推荐策略 |
|---------|---------|---------|
| < 3B | 1-8 卡 | DDP 即可 |
| 3B-13B | 8-32 卡 | DDP + ZeRO-2 |
| 13B-70B | 32-128 卡 | FSDP / ZeRO-3 |
| 70B-200B | 128-512 卡 | TP + DP (3D 并行) |
| 200B+ | 512+ 卡 | TP + PP + DP + ZeRO |
| MoE 任意规模 | - | + 专家并行 EP |

## 发展趋势（2026）

- **FSDP v2**：Meta 推 FSDP v2，简化配置、提升性能
- **异构训练**：CPU 卸载 + GPU 计算，进一步突破显存限制
- **3D + 专家并行**：成为 MoE 训练标配
- **FlashAttention-3 集成**：通信-计算 overlap 进一步压缩
- **Async Checkpointing**：异步保存，断点续训体验提升

---

**参见**：[[Ray_Deep_Dive]] · [[FSDP_Deep_Dive]] · [[Megatron_LM_Deep_Dive]] · [[概念/distributed-parallelism]] · [[07_模型训练/README|模型训练]] · [[07_模型训练/04_Distributed_Training/index]]

---

## 2026 分布式训练生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **FSDP2** | PyTorch 原生全分片数据并行 | GA |
| **DeepSpeed 0.15+** | 微软分布式训练库 | GA |
| **Megatron-LM** | NVIDIA 大模型训练框架 | GA |
| **3D 并行** | DP + TP + PP 组合并行 | GA |
| **万卡训练** | 10K+ GPU 集群训练 | GA |

## 生产最佳实践

1. **并行策略**：根据模型规模选择 DP/FSDP/3D 并行
2. **通信优化**：多机训练用 NCCL + RDMA 优化通信
3. **显存管理**：启用激活检查点 + ZeRO 降低显存
4. **扩展性测试**：从小规模验证扩展效率再扩大
5. **故障恢复**：配置定期 checkpoint，支持断点续训