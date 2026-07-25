---
title: '分布式系统 (Distributed Systems)'
category: '01-fundamentals-distributed-systems'
tags: ["fundamentals", "math", "algorithms", "basics"]
summary: '> **一句话理解**: 分布式训练就像"工厂流水线" —— 数据并行是开多条产线同时生产，模型并行是把大机器拆成多个零件分别组装，流水线并行则是按工序分段加工。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Distributed Systems"
  - Distributed_Systems
sources: []

---
# 分布式系统 (Distributed Systems)

> **一句话理解**: 分布式训练就像"工厂流水线" —— 数据并行是开多条产线同时生产，模型并行是把大机器拆成多个零件分别组装，流水线并行则是按工序分段加工。

随着模型参数规模进入千亿、万亿级别，分布式系统成为 AI 工程的核心。单卡无法容纳的模型必须通过多机多卡协同训练。

---

## 1. 概述 (Overview)

### 为什么需要分布式训练？

**规模挑战**:
- GPT-3 (175B): 需要约 350GB 内存（fp16 精度）
- NVIDIA A100: 80GB 显存 → 需要至少 5 张卡存储模型
- 训练数据: TB 级别，单卡加载时间过长

**三个核心维度**:
1. **数据并行 (Data Parallelism, DP)**: 解决数据量大的问题
2. **模型并行 (Model Parallelism, MP)**: 解决模型太大单卡放不下的问题
3. **流水线并行 (Pipeline Parallelism, PP)**: 减少模型并行中的空闲等待

---

## 2. 核心概念 (Core Concepts)

### 2.1 通信原语 (Communication Primitives)

分布式训练的基础是节点间的高效通信。

| 原语 | 操作 | 复杂度 | 应用场景 |
|------|------|--------|----------|
| **Broadcast** | 一个节点发送给所有节点 | $O(\log P)$ | 参数初始化 |
| **Reduce** | 所有节点聚合到一个节点 | $O(\log P)$ | 梯度汇总 |
| **All-Reduce** | 所有节点聚合后广播结果 | $O(\log P)$ | 数据并行梯度同步 |
| **All-Gather** | 收集所有节点数据并广播 | $O(P)$ | 拼接分片数据 |
| **Reduce-Scatter** | 聚合后分散到各节点 | $O(\log P)$ | ZeRO 优化器 |
| **Scatter** | 一个节点分发给所有节点 | $O(\log P)$ | 数据分片 |

**注**: $P$ 是节点/进程数

**来源**: [NVIDIA Collective Communications Library (NCCL)](https://developer.nvidia.com/nccl)

---

### 2.2 All-Reduce 算法详解

#### Ring All-Reduce（环形归约）

**核心思想**: 将数据分块，通过环形传递完成归约和广播。

**ASCII 图解**（4 个节点，数据分 4 块）:

```
初始状态（每个节点持有不同数据块）:
GPU 0: [a0, b0, c0, d0]
GPU 1: [a1, b1, c1, d1]
GPU 2: [a2, b2, c2, d2]
GPU 3: [a3, b3, c3, d3]

Step 1-3: Reduce-Scatter（归约分散阶段）
┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐
│ GPU0│──►│ GPU1│──►│ GPU2│──►│ GPU3│
└──┬──┘   └──┬──┘   └──┬──┘   └──┬──┘
   └─────────┴─────────┴─────────┘
   
每轮传递一个块并累加:
  Round 1: GPU0发送d0, GPU1发送a1, GPU2发送b2, GPU3发送c3
  Round 2: GPU0发送c0, GPU1发送d1, GPU2发送a2, GPU3发送b3
  Round 3: GPU0发送b0, GPU1发送c1, GPU2发送d2, GPU3发送a3

结果（每个节点持有1个完整归约块）:
GPU 0: [?, ?, ?, d_sum]  (d_sum = d0+d1+d2+d3)
GPU 1: [a_sum, ?, ?, ?]
GPU 2: [?, b_sum, ?, ?]
GPU 3: [?, ?, c_sum, ?]

Step 4-6: All-Gather（全收集阶段）
再传递 P-1 轮，收集其他节点的完整块

最终状态:
GPU 0: [a_sum, b_sum, c_sum, d_sum]
GPU 1: [a_sum, b_sum, c_sum, d_sum]
GPU 2: [a_sum, b_sum, c_sum, d_sum]
GPU 3: [a_sum, b_sum, c_sum, d_sum]
```

#### 复杂度分析

**通信量**:
- 每个节点发送/接收: $2 \times \frac{(P-1)}{P} \times N$ 字节（$N$ 是总数据大小）
- 渐近: $2N$ 字节（与节点数无关！）

**时间复杂度**:
- 总轮数: $2(P-1)$
- 时间: $O(N / \text{bandwidth} + P \times \text{latency})$

**优势**: 带宽利用率高（接近理论上限）

**劣势**: 延迟随节点数线性增长

---

### 2.3 并行策略对比

#### 数据并行 (Data Parallelism, DP)

**原理**: 每个设备复制完整模型，处理不同数据分片。

```
GPU 0: Model Copy 1  +  Batch 0  →  Grad 0  ┐
GPU 1: Model Copy 2  +  Batch 1  →  Grad 1  ├─ All-Reduce → 更新所有模型
GPU 2: Model Copy 3  +  Batch 2  →  Grad 2  ┘
```

**特点**:
- ✅ 实现简单（PyTorch DDP 开箱即用）
- ✅ 线性扩展（通信量恒定）
- ❌ 模型必须能放入单卡
- ❌ 小批量时通信开销占比大

**公式**（有效批量大小）:
$$
\text{Effective Batch Size} = \text{Per-GPU Batch} \times P
$$

---

#### 张量并行 (Tensor Parallelism, TP)

**原理**: 将单层的权重矩阵切分到多个设备。

**示例**（全连接层 $Y = XW$）:

```
X (输入)       W (权重切分)           Y (输出)
[batch, d] × [ d, h ] = [batch, h]

切分方案（列切分）:
        ┌─────┬─────┐
X  ×    │ W1  │ W2  │  =  [Y1, Y2]  → concat → Y
        │     │     │
        └─────┴─────┘
       GPU 0  GPU 1
```

**通信点**:
1. 前向: All-Gather 收集输出
2. 反向: Reduce-Scatter 分发梯度

**特点**:
- ✅ 减少单卡显存占用
- ❌ 需要频繁通信（每层都要）
- ❌ 只适合高带宽互联（NVLink）

**Megatron-LM 的切分策略**:
- Transformer MLP: 列切分（第一层）+ 行切分（第二层）
- 自注意力: QKV 矩阵列切分，输出行切分

**来源**: [Megatron-LM: Training Multi-Billion Parameter Models](https://arxiv.org/abs/1909.08053)

---

#### 流水线并行 (Pipeline Parallelism, PP)

**原理**: 将模型按层切分，形成流水线。

**朴素流水线的问题（气泡）**:

```
时间轴 →
GPU 0: [F1]     [F2]     [F3]     [B1]     [B2]     [B3]
GPU 1:      [F1]     [F2]     [F3]     [B1]     [B2]
GPU 2:           [F1]     [F2]     [F3]     [B1]
       ↑气泡 ↑气泡 ↑气泡 ↑气泡 ↑气泡

F = 前向传播, B = 反向传播
```

**GPipe 的微批次 (Micro-batch) 方案**:

```
将批次切分为 M 个微批次（M >> P）

GPU 0: [F1][F2][F3][F4][B1][B2][B3][B4]
GPU 1:     [F1][F2][F3][F4][B1][B2][B3]
GPU 2:         [F1][F2][F3][F4][B1][B2]
              ↑更少的气泡时间

气泡率: (P-1) / M （M 足够大时接近 0）
```

**特点**:
- ✅ 模型可切分到任意多个设备
- ✅ 通信量小（仅传递激活值）
- ❌ 气泡时间导致 GPU 利用率下降
- ❌ 需要重新计算中间激活（内存换时间）

**来源**: [GPipe: Efficient Training with Pipeline Parallelism](https://arxiv.org/abs/1811.06965)

---

#### 三种并行策略对比表

| 维度 | 数据并行 | 张量并行 | 流水线并行 |
|------|----------|----------|------------|
| **切分对象** | 数据 | 单层权重 | 模型层 |
| **通信频率** | 每个 step | 每层 | 每个 micro-batch |
| **通信量** | $O(\text{model\_size})$ | $O(\text{activation\_size})$ | $O(\text{activation\_size})$ |
| **内存节省** | 无 | $O(P)$ | $O(P)$ |
| **适用场景** | 小模型，大数据 | 单层太大 | 模型层数多 |
| **实现复杂度** | 低 | 中 | 高 |
| **扩展性** | 优秀 | 中（受带宽限制） | 中（受气泡限制） |

---

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 ZeRO (Zero Redundancy Optimizer)

#### 问题背景

训练大模型时，显存占用包括：
1. **模型状态 (Model States)**: 
 - 参数 $\Phi$
 - 梯度 $G$
 - 优化器状态 $O$（如 Adam 的动量和方差）
2. **激活值 (Activations)**: 前向传播的中间结果（反向传播需要）
3. **临时缓冲 (Temporary Buffers)**: 梯度累积等

**示例**（混合精度训练）:
- 参数: 2 字节/参数（fp16）
- 梯度: 2 字节/参数
- Adam 状态: 8 字节/参数（fp32 的动量 + 方差）
- **总计**: 12 字节/参数 + 激活值

7B 参数模型 → 84GB 仅模型状态！

---

#### ZeRO 三阶段

**Stage 1: 优化器状态分片 (Optimizer State Partitioning)**

每个 GPU 只存储 $1/P$ 的优化器状态：

```
原始（数据并行）:
GPU 0: [Params, Grads, Opt_all]  → 12x 内存
GPU 1: [Params, Grads, Opt_all]
GPU 2: [Params, Grads, Opt_all]

ZeRO Stage 1:
GPU 0: [Params, Grads, Opt_0]  → 8x 内存
GPU 1: [Params, Grads, Opt_1]
GPU 2: [Params, Grads, Opt_2]
       更新后 All-Gather 参数
```

**内存节省**: $12x \to 8x$（优化器状态减少 4/P）

---

**Stage 2: 梯度分片 (Gradient Partitioning)**

每个 GPU 只存储对应的梯度分片：

```
ZeRO Stage 2:
GPU 0: [Params, Grad_0, Opt_0]  → 6x 内存
GPU 1: [Params, Grad_1, Opt_1]
GPU 2: [Params, Grad_2, Opt_2]
       Reduce-Scatter 梯度
```

**内存节省**: $8x \to 6x$

---

**Stage 3: 参数分片 (Parameter Partitioning)**

每个 GPU 只存储 $1/P$ 的参数，用时通过 All-Gather 收集：

```
ZeRO Stage 3:
GPU 0: [Param_0, Grad_0, Opt_0]  → 4x 内存
GPU 1: [Param_1, Grad_1, Opt_1]
GPU 2: [Param_2, Grad_2, Opt_2]

前向/反向时:
  1. All-Gather 收集完整参数
  2. 计算
  3. 丢弃非本地参数
```

**内存节省**: $6x \to 4x/P$（几乎线性缩放）

---

#### ZeRO 对比表

| 阶段 | 优化器分片 | 梯度分片 | 参数分片 | 内存/GPU (Nx 参数量) | 通信量 |
|------|------------|----------|----------|---------------------|--------|
| **数据并行** | ❌ | ❌ | ❌ | 12N | 2N |
| **ZeRO-1** | ✅ | ❌ | ❌ | 8N | 2N |
| **ZeRO-2** | ✅ | ✅ | ❌ | 6N | 2N |
| **ZeRO-3** | ✅ | ✅ | ✅ | 4N/P | 3N |

**关键洞察**: ZeRO-3 通信量仅增加 50%，但显存减少 $P$ 倍！

**来源**: [ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)

---

### 3.2 FSDP (Fully Sharded Data Parallel)

PyTorch 对 ZeRO-3 的实现，核心理念相同但工程细节不同。

#### 配置代码示例

```python
import torch
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy
from transformers.models.llama.modeling_llama import LlamaDecoderLayer

# 初始化分布式环境
torch.distributed.init_process_group(backend="nccl")

# 定义模型
model = MyTransformer(...)

# FSDP 包装（自动分片）
model = FSDP(
    model,
    auto_wrap_policy=transformer_auto_wrap_policy(
        transformer_layer_cls={LlamaDecoderLayer},  # 按层分片
    ),
    mixed_precision=torch.distributed.fsdp.MixedPrecision(
        param_dtype=torch.float16,
        reduce_dtype=torch.float16,
        buffer_dtype=torch.float16,
    ),
    sharding_strategy="FULL_SHARD",  # 等价于 ZeRO-3
    device_id=torch.cuda.current_device(),
)

# 训练循环（与普通 DDP 一致）
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
for batch in dataloader:
    optimizer.zero_grad()
    loss = model(batch).loss
    loss.backward()
    optimizer.step()
```

#### FSDP vs DDP

| 特性 | DDP | FSDP |
|------|-----|------|
| **参数复制** | 每个 GPU 全量 | 分片存储 |
| **显存占用** | 高 | 低 |
| **通信量** | 2N（All-Reduce 梯度） | 3N（All-Gather 参数） |
| **适用场景** | 小模型（< 10B） | 大模型（> 10B） |

---

### 3.3 3D 并行（数据 × 张量 × 流水线）

#### 组合策略

现代大模型训练通常同时使用三种并行：

**示例配置**（训练 GPT-3 规模模型，1024 张 A100）:
- 数据并行度: 8（8 副本）
- 张量并行度: 8（单层切 8 份，需高带宽）
- 流水线并行度: 16（模型切 16 段）
- **总 GPU**: $8 \times 8 \times 16 = 1024$

**ASCII 图解**:

```
                数据并行（8副本）
        ┌────────────────────────────────┐
        │                                │
        ▼                                ▼
    Replica 0                        Replica 7
    ┌─────────────┐                 ┌─────────────┐
    │ Stage 0     │ PP ──┐          │ Stage 0     │
    │ (TP=8)      │      │          │ (TP=8)      │
    ├─────────────┤      │          ├─────────────┤
    │ Stage 1     │      ├─ 流水线  │ Stage 1     │
    │ (TP=8)      │      │          │ (TP=8)      │
    ├─────────────┤      │          ├─────────────┤
    │   ...       │      │          │   ...       │
    ├─────────────┤      │          ├─────────────┤
    │ Stage 15    │ ◄────┘          │ Stage 15    │
    │ (TP=8)      │                 │ (TP=8)      │
    └─────────────┘                 └─────────────┘
         ↑ 每个 Stage 内部使用张量并行（8卡）
```

#### 超参数选择策略

**经验法则**:
1. **张量并行度**: 尽量小（4-8），限制在单机内（利用 NVLink）
2. **流水线并行度**: 根据模型层数选择（每段 2-4 层）
3. **数据并行度**: 用剩余所有 GPU

**公式**:
$$
P_{\text{data}} = \frac{N_{\text{total}}}{P_{\text{tensor}} \times P_{\text{pipeline}}}
$$

---

### 3.4 通信带宽瓶颈分析

#### 通信时间公式

**α-β 模型**:
$$
T_{\text{comm}} = \alpha + \beta \times M
$$
- $\alpha$: 延迟（latency），固定开销
- $\beta$: 带宽倒数（1/bandwidth）
- $M$: 消息大小

#### 实测数据（NVIDIA DGX A100）

| 互联方式 | 带宽 | 延迟 | 适用场景 |
|----------|------|------|----------|
| **NVLink** | 600 GB/s | < 1 μs | 单机内张量并行 |
| **NVSwitch** | 4.8 TB/s | < 1 μs | 单机内全局通信 |
| **InfiniBand (200G)** | 25 GB/s | 1-5 μs | 跨机数据并行 |
| **Ethernet (100G)** | 12.5 GB/s | 10-50 μs | 低成本集群 |

#### 优化方法

1. **梯度累积 (Gradient Accumulation)**: 减少通信频率
$$
\text{真实 Batch Size} = \text{Micro-batch} \times \text{Accum Steps} \times P
$$

2. **混合精度 (Mixed Precision)**: 通信量减半（fp32 → fp16）

3. **梯度压缩**: 量化、稀疏化（可能损失精度）

---

## 4. 代码实战 (Hands-on Code)

### 4.1 PyTorch DDP 基础示例

```python
import torch
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data.distributed import DistributedSampler

def setup(rank, world_size):
    """初始化分布式环境"""
    dist.init_process_group(
        backend="nccl",  # GPU 通信
        init_method="env://",  # 从环境变量读取配置
        rank=rank,
        world_size=world_size,
    )
    torch.cuda.set_device(rank)

def cleanup():
    dist.destroy_process_group()

def train(rank, world_size):
    setup(rank, world_size)
    
    # 模型
    model = MyModel().to(rank)
    ddp_model = DDP(model, device_ids=[rank])
    
    # 数据加载器（分布式采样）
    dataset = MyDataset()
    sampler = DistributedSampler(
        dataset,
        num_replicas=world_size,
        rank=rank,
        shuffle=True,
    )
    dataloader = torch.utils.data.DataLoader(
        dataset,
        batch_size=32,
        sampler=sampler,
    )
    
    # 训练循环
    optimizer = torch.optim.Adam(ddp_model.parameters(), lr=1e-3)
    
    for epoch in range(10):
        sampler.set_epoch(epoch)  # 每个 epoch 打乱数据
        
        for batch in dataloader:
            inputs, labels = batch
            inputs, labels = inputs.to(rank), labels.to(rank)
            
            optimizer.zero_grad()
            outputs = ddp_model(inputs)
            loss = F.cross_entropy(outputs, labels)
            loss.backward()  # 自动 All-Reduce 梯度
            optimizer.step()
        
        if rank == 0:
            print(f"Epoch {epoch}, Loss: {loss.item()}")
    
    cleanup()

# 启动多进程（使用 torchrun）
# torchrun --nproc_per_node=4 train.py
if __name__ == "__main__":
    world_size = torch.cuda.device_count()
    torch.multiprocessing.spawn(train, args=(world_size,), nprocs=world_size)
```

### 4.2 使用 DeepSpeed 训练

```python
import deepspeed
import torch

# 配置文件 ds_config.json
ds_config = {
    "train_batch_size": 64,
    "gradient_accumulation_steps": 4,
    "fp16": {
        "enabled": True,
        "loss_scale": 0,
        "initial_scale_power": 16,
    },
    "zero_optimization": {
        "stage": 2,  # ZeRO-2
        "offload_optimizer": {
            "device": "cpu",  # 优化器状态卸载到 CPU
            "pin_memory": True,
        },
    },
}

# 模型
model = MyTransformer()

# DeepSpeed 初始化
model_engine, optimizer, _, _ = deepspeed.initialize(
    model=model,
    config=ds_config,
    model_parameters=model.parameters(),
)

# 训练循环
for batch in dataloader:
    loss = model_engine(batch).loss
    model_engine.backward(loss)
    model_engine.step()  # 自动处理梯度累积和优化器更新
```

---

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 OpenAI GPT-3 训练配置（推测）

- **模型**: 175B 参数，96 层 Transformer
- **硬件**: 约 10,000 张 V100 (32GB)
- **并行策略**:
  - 数据并行: 64
  - 模型并行（张量 + 流水线）: 每组 8 卡
- **训练时间**: 300 万 GPU-小时（约 34 天）
- **总成本**: 估计 $4-12 百万美元

### 5.2 Meta LLaMA 开源训练实践

- **模型**: 65B 参数
- **硬件**: 2048 张 A100 (80GB)
- **并行策略**: 
  - FSDP（等价 ZeRO-3）
  - 序列并行（处理长序列）
- **训练时间**: 1.4T tokens，约 21 天
- **吞吐量**: 380 tokens/秒/GPU

**关键优化**:
- Flash Attention: 减少显存占用 50%
- 激活重计算: 换时间减显存

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 异步数据并行

**问题**: 同步 All-Reduce 等待最慢的 GPU（stragglers）

**解决**: 异步更新（如 Hogwild!）

**权衡**: 梯度延迟导致收敛速度变慢

### 6.2 弹性训练 (Elastic Training)

**场景**: 节点动态加入/退出（抢占式实例）

**技术**: PyTorch Elastic（Torch Distributed Elastic）

**核心**: 定期保存检查点 + 重新初始化通信组

### 6.3 常见陷阱

1. **负载不均衡**: 流水线并行中不同 stage 计算量差异大
 - 解决: 手动调整层分配

2. **通信死锁**: 不同并行策略的通信原语冲突
 - 解决: 使用独立的 process group

3. **随机数不同步**: 不同 GPU 的 dropout 不一致
 - 解决: 设置相同的 random seed

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- **[线性代数](../Linear_Algebra/Linear_Algebra.md)**: 矩阵乘法的切分方式
- **[数据结构与算法](../Data_Structures_Algorithms/Data_Structures_Algorithms.md)**: 通信原语的实现

### 进阶推荐
- **[模型压缩](10_部署推理/01_Deployment_Fundamentals/Deployment_Inference.md)**: 量化与分布式训练结合
- **[大模型训练](05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques.md)**: 具体实践案例
- **[MLOps](11_模型运维/01_MLOps_Fundamentals/MLOps_Pipeline.md)**: 集群管理与监控

---

## 8. 面试高频问题 (Interview FAQs)

### Q1: 数据并行和模型并行的区别？分别适用什么场景?
**A**:
- **数据并行 (DP)**: 
 - 每个 GPU 复制完整模型，处理不同数据
 - 适用: 模型能放入单卡，数据量大
 - 示例: 训练 ResNet-50
- **模型并行 (MP)**:
 - 将模型切分到多个 GPU
 - 适用: 单卡放不下模型
 - 示例: GPT-3 (175B)
- **实践**: 现代训练通常混合使用（3D 并行）

### Q2: ZeRO 优化器的原理是什么？与传统数据并行有什么区别？
**A**:
- **传统 DP**: 每个 GPU 存储完整的参数、梯度、优化器状态（12x 内存）
- **ZeRO**: 分片存储，用时通信收集
 - Stage 1: 优化器状态分片 → 8x 内存
 - Stage 2: + 梯度分片 → 6x 内存
 - Stage 3: + 参数分片 → 4x/P 内存
- **代价**: 增加 50% 通信量（All-Gather 参数）
- **收益**: 显存线性缩放，可训练更大模型

### Q3: All-Reduce 的 Ring 算法为什么高效？
**A**:
- **暴力方案**: 所有节点发送到一个节点 → 通信量 $O(NP)$，瓶颈在单节点
- **Tree All-Reduce**: 树形归约 → 通信量 $O(N \log P)$，但不平衡
- **Ring All-Reduce**: 
 - 数据分 $P$ 块，每个节点每轮传递 1 块
 - 通信量: $2N(P-1)/P \approx 2N$（与节点数无关！）
 - 所有链路同时工作，带宽利用率 100%
- **关键**: 适合高带宽、低延迟网络（如 NVLink）

### Q4: 为什么张量并行只适合单机内？
**A**:
- **通信频率**: 每层都要 All-Gather/Reduce-Scatter
- **通信量**: 每层激活值大小（可能 GB 级）
- **带宽需求**:
 - NVLink: 600 GB/s（单机内）
 - InfiniBand: 25 GB/s（跨机）
 - 差距 24 倍！
- **结论**: 跨机张量并行会导致通信时间远超计算时间
- **实践**: TP ≤ 8（单机内），更大规模用流水线并行

### Q5: 如何计算分布式训练的理论加速比？
**A**:
**理想情况**（无通信开销）: 加速比 = $P$

**实际情况**（Amdahl's Law）:
$$
\text{Speedup} = \frac{1}{(1-p) + p/P}
$$
- $p$: 可并行部分比例
- $P$: 并行度

**示例**:
- 纯数据并行（$p=0.95$）: 4 卡 → 3.48x（87% 效率）
- 加上通信（$p=0.90$）: 4 卡 → 3.08x（77% 效率）

**优化目标**: 提高 $p$（减少串行部分，如数据加载）

---

## 9. 参考资源 (References)

### 经典教材
- [Distributed Systems - Maarten van Steen & Andrew Tanenbaum](https://www.distributed-systems.net/index.php/books/ds3/)  
  分布式系统理论基础

### 论文
- [ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)  
  微软 DeepSpeed 的核心技术

- [Megatron-LM: Training Multi-Billion Parameter Models Using Model Parallelism](https://arxiv.org/abs/1909.08053)  
  NVIDIA 的张量并行实现

- [GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism](https://arxiv.org/abs/1811.06965)  
  Google 的流水线并行

- [PyTorch FSDP: Experiences on Scaling Fully Sharded Data Parallel](https://arxiv.org/abs/2304.11277)  
  PyTorch 官方的 ZeRO-3 实现

### 工具与框架
- [PyTorch Distributed](https://pytorch.org/docs/stable/distributed.html)  
  DDP、FSDP、RPC 等分布式 API

- [DeepSpeed](https://github.com/microsoft/DeepSpeed)  
  ZeRO、3D 并行、推理优化

- [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)  
  生产级大模型训练框架

- [Horovod](https://github.com/horovod/horovod)  
  Uber 开源的分布式训练库

- [NCCL](https://developer.nvidia.com/nccl)  
  NVIDIA 集合通信库

### 博客与教程
- [Hugging Face: Efficient Training on Multiple GPUs](https://huggingface.co/docs/transformers/perf_train_gpu_many)  
  实用的多卡训练指南

- [PyTorch Distributed Tutorial](https://pytorch.org/tutorials/beginner/dist_overview.html)  
  官方分布式教程

---

*Last updated: 2026-02-10*

## 相关链接

- [[01_数学基础/09_Distributed_Systems/Distributed_Systems_for_dummy|分布式系统 (小白版)]] — 本篇的零基础版本
- [[01_数学基础/09_Distributed_Systems/index|分布式系统索引]] — 主题导览
- [[概念/Training/distributed-training|分布式训练]] — 分布式系统的 AI 应用
- [[概念/Training/distributed-parallelism|分布式并行]] — 数据/模型/流水线并行
- [[概念/Training/fsdp|FSDP]] — 主流分布式训练策略
- [[概念/Training/deepspeed|DeepSpeed]] — 分布式训练框架代表
