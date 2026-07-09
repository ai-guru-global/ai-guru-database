---
title: 分布式系统
category: -concepts
tags: ["distributed-systems", "all-reduce", "parallelism", "ZeRO", "fsdp", "model-training"]
aliases: [Distributed recommendation-systems, 分布式训练, All-Reduce, 3D并行]
relationships:
  - target: "[[_concepts/linear-algebra]]"
    type: related_to
  - target: "_concepts/data-structures-algorithms"
    type: related_to
  - target: "_concepts/ai-hardware"
    type: related_to
sources: [01_ai-fundamentals/Distributed_Systems/Distributed_Systems.md]
summary: 分布式训练是大规模AI的核心工程：数据并行解决数据量问题，模型并行解决单卡容量问题，ZeRO优化器消除冗余显存。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# 分布式系统

随着模型参数规模进入千亿、万亿级别，分布式系统成为AI工程的核心。单卡无法容纳的模型必须通过多机多卡协同训练。三个核心维度：数据并行（解决数据量大）、模型并行（解决单卡放不下）、流水线并行（减少空闲等待）。

## 核心要点

- **Ring All-Reduce**通信量约2N字节，与节点数无关，带宽利用率接近100%
- **ZeRO优化器**通过三阶段分片将显存从12N降到4N/P，通信量仅增加50%
- **张量并行**只适合单机内（NVLink 600GB/s vs InfiniBand 25GB/s，差距24倍）
- **3D并行**（数据×张量×流水线）是训练万亿参数模型的标准方案
- GPU选型直接影响并行策略的选择和通信瓶颈

## 详细内容

### 通信原语

| 原语 | 操作 | 应用场景 |
|------|------|----------|
| Broadcast | 一个节点→所有节点 | 参数初始化 |
| Reduce | 所有节点→一个节点 | 梯度汇总 |
| All-Reduce | 聚合+广播 | 数据并行梯度同步 |
| All-Gather | 收集+广播 | 拼接分片数据 |
| Reduce-Scatter | 聚合+分散 | ZeRO优化器 |
| Scatter | 分发 | 数据分片 |

### Ring All-Reduce

核心思想：将数据分块，通过环形传递完成归约和广播。

**过程**（4节点示例）：
1. **Reduce-Scatter阶段**（P-1轮）：每轮每个节点传递一个块并累加
2. **All-Gather阶段**（P-1轮）：收集其他节点的完整归约块

**复杂度分析**：
- 每个节点发送/接收：2×(P-1)/P×N字节
- 渐近：2N字节（与节点数无关）
- 总轮数：2(P-1)
- 优势：带宽利用率高（接近理论上限）
- 劣势：延迟随节点数线性增长

### 数据并行(DP)

每个设备复制完整模型，处理不同数据分片，通过All-Reduce同步梯度。

- 有效批量 = Per-GPU Batch × P
- 优点：实现简单（PyTorch DDP开箱即用），线性扩展
- 缺点：模型必须能放入单卡，小批量时通信开销占比大

### 张量并行(TP)

将单层权重矩阵切分到多个设备。

**model-training切分策略**：
- Transformer MLP：列切分（第一层）+ 行切分（第二层）
- 自注意力：QKV矩阵列切分，输出行切分

通信点：前向All-Gather收集输出，反向Reduce-Scatter分发梯度。

- 优点：减少单卡显存占用
- 缺点：每层都要通信，只适合高带宽互联（NVLink）

### 流水线并行(PP)

将模型按层切分形成流水线。

**GPipe微批次方案**：将批次切分为M个微批次（M≫P），气泡率(P-1)/M，M足够大时接近0。

- 优点：模型可切分到任意多设备，通信量小（仅传递激活值）
- 缺点：气泡时间导致GPU利用率下降，需重新计算中间激活

### 三种并行策略对比

| 维度 | 数据并行 | 张量并行 | 流水线并行 |
|------|----------|----------|------------|
| 切分对象 | 数据 | 单层权重 | 模型层 |
| 通信频率 | 每step | 每层 | 每micro-batch |
| 内存节省 | 无 | O(P) | O(P) |
| 适用场景 | 小模型大数据 | 单层太大 | 层数多 |
| 实现复杂度 | 低 | 中 | 高 |

### ZeRO优化器

训练大模型时显存占用：参数(2B/param) + 梯度(2B) + Adam状态(8B) = 12字节/参数 + 激活值。7B模型仅模型状态就需要84GB。

**ZeRO三阶段**：

| 阶段 | 分片内容 | 内存/GPU | 通信量 |
|------|----------|----------|--------|
| 数据并行 | 无 | 12N | 2N |
| ZeRO-1 | 优化器状态 | 8N | 2N |
| ZeRO-2 | +梯度 | 6N | 2N |
| ZeRO-3 | +参数 | 4N/P | 3N |

**关键洞察**：ZeRO-3通信量仅增加50%，但显存减少P倍。

**ZeRO-3工作流程**：
1. All-Gather收集完整参数
2. 计算
3. 丢弃非本地参数

### FSDP (Fully Sharded Data Parallel)

PyTorch对ZeRO-3的实现。与DDP的主要区别：

| 特性 | DDP | FSDP |
|------|-----|------|
| 参数复制 | 每GPU全量 | 分片存储 |
| 通信量 | 2N | 3N |
| 适用场景 | 小模型(<10B) | 大模型(>10B) |

### 3D并行

现代大模型训练同时使用三种并行。示例配置（1024张A100训练GPT-3规模模型）：
- 数据并行度：8
- 张量并行度：8（单机内NVLink）
- 流水线并行度：16
- 总GPU = 8×8×16 = 1024

**超参数选择经验法则**：
1. 张量并行度尽量小（4-8），限制在单机内
2. 流水线并行度根据层数选择（每段2-4层）
3. 数据并行度用剩余所有GPU
4. P_data = N_total / (P_tensor × P_automl)

### 通信带宽分析

**α-β模型**：T_comm = α + β×M（α=延迟，β=带宽倒数，M=消息大小）

| 互联方式 | 带宽 | 延迟 | 适用 |
|----------|------|------|------|
| NVLink | 600 GB/s | <1μs | 单机内张量并行 |
| NVSwitch | 4.8 TB/s | <1μs | 单机内全局通信 |
| InfiniBand(200G) | 25 GB/s | 1-5μs | 跨机数据并行 |
| Ethernet(100G) | 12.5 GB/s | 10-50μs | 低成本集群 |

**优化方法**：
1. 梯度累积：减少通信频率，真实Batch = Micro-batch × AccumSteps × P
2. 混合精度：通信量减半
3. 梯度压缩：量化、稀疏化（可能损失精度）

### 实际训练案例

**OpenAI GPT-3**（推测）：175B参数，约10000张V100，数据并行64+模型并行每组8卡，训练时间约34天，总成本估计$4-12M。^[inferred]

**Meta LLaMA**：65B参数，2048张A100(80GB)，FSDP（等价ZeRO-3），训练1.4T tokens约21天。关键优化包括Flash Attention（减少显存50%）和激活重计算。

### 加速比分析

理想情况：加速比 = P

实际情况（Amdahl's Law）：Speedup = 1/((1-p) + p/P)，p为可并行比例。

示例：纯数据并行(p=0.95)4卡→3.48x（87%效率），加上通信(p=0.90)4卡→3.08x（77%效率）。

### 弹性训练

场景：节点动态加入/退出（抢占式实例）。核心技术：PyTorch Elastic，定期保存检查点+重新初始化通信组。^[inferred]

### 常见陷阱

1. **负载不均衡**：流水线并行中不同stage计算量差异大，需手动调整层分配
2. **通信死锁**：不同并行策略的通信原语冲突，需使用独立process group
3. **随机数不同步**：不同GPU的optimization-regularization不一致，需设置相同的random seed

## 开放问题

- 异步数据并行（Hogwild!）在超大规模下的收敛保证仍不完善^[ambiguous]
- 流水线并行的气泡问题是否有更优的理论解^[inferred]
- 跨数据中心训练的网络容错和一致性仍待突破^[inferred]

## 来源

- 数学基础/Distributed_Systems/Distributed_Systems.md
- ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (arXiv:1910.02054)
- Megatron-LM (arXiv:1909.08053)
- GPipe (arXiv:1811.06965)
- PyTorch FSDP (arXiv:2304.11277)

## Related

- [[_concepts/model-training]] — 模型训练 (共享: fsdp, training)
- [[_synthesis/training-fine-tuning]] — 模型训练 × 微调技术 (共享: fsdp, training)
