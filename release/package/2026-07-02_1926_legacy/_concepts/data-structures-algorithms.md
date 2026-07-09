---
title: 数据结构与算法
category: -concepts
tags: ["algorithms", "data-structures", "computational-graphs", "vector-indexing", "beam-search", "hnsw"]
aliases: [Data Structures, Algorithms, 计算图, 向量检索, DSA]
relationships:
  - target: "[[_concepts/linear-algebra]]"
    type: related_to
  - target: "_concepts/probability-statistics"
    type: related_to
  - target: "_concepts/distributed-systems"
    type: related_to
sources: [01_ai-fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms.md]
summary: 数据结构决定存储效率，算法决定计算速度。涵盖计算图与自动微分、Beam Search、HNSW向量检索，支撑AI训练到推理全流程。
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

# 数据结构与算法

高效的算法是实现大规模AI模型训练与推理的基础。从计算图的构建到向量检索，数据结构与算法无处不在。核心挑战包括：transformer-architecture注意力机制的O(n²)复杂度、大模型的存储效率、以及GPU友好的并行算法设计。

## 核心要点

- **计算图**本质是有向无环图(DAG)，前向传播是拓扑排序，反向传播是逆拓扑排序
- **反向模式自动微分**是深度学习的核心算法，一次前向+一次反向即可计算所有参数的梯度
- **Beam Search**以O(kTV)复杂度近似搜索最优序列，优于贪心的O(TV)但避免局部最优
- **HNSW**是向量数据库的默认算法，以O(log n)时间实现95-99%召回率
- **KV Cache**将生成推理的时间复杂度从O(T²)降到O(T)
- 矩阵乘法的复杂度分析是理解AI算法瓶颈的基础

## 详细内容

### 复杂度分析

| 符号 | 名称 | AI示例 |
|------|------|--------|
| O(1) | 常数 | 数组索引、哈希表查找 |
| O(log n) | 对数 | 二分搜索、HNSW搜索 |
| O(n) | 线性 | 遍历数组 |
| O(n log n) | 线性对数 | 快速排序 |
| O(n²) | 平方 | Transformer注意力 |
| O(2ⁿ) | 指数 | 递归斐波那契 |

**AI中的复杂度实例**：

| 操作 | 复杂度 | 瓶颈 |
|------|--------|------|
| 全连接层前向 | O(d_in × d_out) | 矩阵乘法 |
| 自注意力 | O(n²d) | 序列长度平方增长 |
| Beam Search | O(b×T×V) | 词表大小V |
| HNSW搜索 | O(log n) | 分层图结构 |
| K-NN暴力搜索 | O(nd) | 数据量线性增长 |

### 计算图与拓扑排序

神经网络的计算图本质上是DAG（有向无环图）：

- **前向传播**：按拓扑排序从输入到输出
- **反向传播**：按逆拓扑排序从输出到输入

**拓扑排序算法**（Kahn算法）：
1. 统计每个节点的入度
2. 将入度为0的节点加入队列
3. 依次处理队列中的节点，移除其出边，更新后继节点入度
4. 重复直到队列为空

PyTorch中的`torch.autograd`自动构建计算图并完成拓扑排序。

### 自动微分

| 维度 | 正向模式 | 反向模式(Backprop) |
|------|----------|-------------------|
| 计算顺序 | 随前向同步计算 | 先前向计算值，再反向计算梯度 |
| 适用场景 | 输入维度低 | 输出维度低（神经网络典型） |
| 复杂度 | O(n_in)次前向 | O(1)次前向+O(1)次反向 |
| 内存消耗 | 低 | 高（需存储中间结果） |

**为什么深度学习用反向模式？** 损失函数是标量（n_out=1），参数可能有数十亿（n_in≫1），一次反向传播即可计算所有参数的梯度。

**计算图示例**：

```
前向: a = x*y, b = a+z, L = sin(b)
反向（链式法则）:
  ∂L/∂b = cos(b)
  ∂L/∂a = ∂L/∂b × 1 = cos(b)
  ∂L/∂z = ∂L/∂b × 1 = cos(b)
  ∂L/∂x = ∂L/∂a × y = cos(b) × y
  ∂L/∂y = ∂L/∂a × x = cos(b) × x
```

### Beam Search（束搜索）

序列生成中暴力搜索复杂度O(V^T)不可行，Beam Search保留每个时间步最有可能的k个候选序列。

**算法流程**：
1. 初始化起始序列
2. 对每个候选序列，获取下一个token的概率分布
3. 考虑所有可能的扩展，按分数排序保留top-k
4. 重复直到所有序列结束或达到最大长度

**优化技巧**：
- 长度归一化：Score = (1/T^α) Σ log P(y_t|y_{<t})，通常α∈[0.6, 0.7]
- 剪枝和覆盖惩罚避免重复生成
- Diverse Beam Search鼓励不同beam之间的差异

**复杂度**：时间O(k×T×V)，空间O(k×T)

### HNSW (Hierarchical Navigable Small World)

向量数据库需要在数百万高维向量中快速找到最近邻。

**核心思想**：结合跳表（分层加速）和小世界网络（短程+长程连接）。

**分层结构**：
- Layer 2（稀疏）：少量远距离连接
- Layer 1（中等）：中等密度连接
- Layer 0（稠密）：完整连接所有邻居

**搜索过程**：从最高层贪心跳转，到达局部最优后下降到下一层，最终在底层精确搜索。

**参数调优**：

| 参数 | 含义 | 推荐值 |
|------|------|--------|
| M | 每层最大连接数 | 16-48 |
| efConstruction | 构建时动态候选集大小 | 100-200 |
| efSearch | 查询时候选集大小 | 50-500 |

**性能对比**：

| 方法 | 查询时间 | 召回率@10 | 内存 |
|------|----------|-----------|------|
| 暴力搜索 | O(nd) | 100% | 低 |
| LSH | O(n/b) | 70-80% | 中 |
| HNSW | O(log n) | 95-99% | 高 |
| IVF | O(n/k) | 80-90% | 中 |

HNSW在高召回率要求下是最优选择，Faiss、vector-database、Weaviate等向量数据库默认使用。^[inferred]

### 哈希表在AI中的应用

1. **Embedding Layer**：本质是哈希表查找，O(1)获取词向量
2. **去重与集合操作**：数据预处理、NMS非极大值抑制
3. **KV Cache**：大模型推理中缓存已计算的Key和Value
4. **Memoization**：动态规划中避免重复计算

### 注意力机制复杂度优化

标准自注意力O(n²d)，优化方法：

| 方法 | 复杂度 | 代表模型 |
|------|--------|----------|
| 稀疏注意力 | O(n√nd) | Longformer, BigBird |
| 线性注意力 | O(nd²) | Performer, RWKV |
| 低秩分解 | O(nkd) | Linformer |
| Flash Attention | O(n²d) | IO优化，不改变复杂度 |

### KV Cache

生成式模型缓存已计算的Key和Value，每次只计算新query与所有key的注意力，将时间复杂度从O(T²)降到O(T)。与分布式系统中的通信优化思想类似。^[inferred]

### 动态规划：Viterbi算法

HMM/CRF解码中，给定观测序列找最优隐状态序列。DP递推：δ_t(s) = max_{s'} [δ_{t-1}(s') × P(s|s') × P(x_t|s)]，复杂度O(TS²)，远优于暴力O(S^T)。

### 量化算法

Int8量化：q = round((x-z)/s)，x ≈ s·q + z

- 对称量化：z=0，范围[-127,127]
- 非对称量化：z≠0，范围[0,255]
- W8A16：权重int8存储，激活float16

### 并行算法

**Parallel Prefix Sum（Scan）**：朴素O(n)时间无法并行，并行算法用树形归约实现O(log n)时间。应用于softmax的数值稳定计算。^[inferred]

### 常见陷阱

1. **过早优化**：先保证正确性，再优化性能
2. **忽略常数因子**：Big-O隐藏了常数，小规模时O(n log n)可能比O(n²)更慢
3. **缓存失效**：CPU/GPU缓存局部性至关重要，按列遍历矩阵比按行慢10倍

## 开放问题

- 线性注意力在哪些任务上可以完全替代softmax注意力仍不明确^[ambiguous]
- 超高维(>1000维)向量检索的最优算法仍在演进^[inferred]
- Flash long-context-models的IO优化思路是否可推广到其他算子^[inferred]

## 来源

- 数学基础/Data_Structures_Algorithms/Data_Structures_Algorithms.md
- Automatic Differentiation in Machine unsupervised-learning: a Survey (arXiv:1502.05767)
- HNSW原始论文 (arXiv:1603.09320)
- Flash Attention (arXiv:2205.14135)

## Related

- [[数学基础/AI_Hardware/AI_Hardware_2026.md|AI_Hardware_2026]]
- [[数学基础/AI_Hardware/README.md|AI_Hardware README]]
- [[数学基础/Data_Structures_Algorithms/Data_Structures_Algorithms.md|Data_Structures_Algorithms]]
- [[数学基础/Data_Structures_Algorithms/Data_Structures_Algorithms_for_dummy.md|Data_Structures_Algorithms_for_dummy]]
- [[数学基础/Distributed_Systems/Distributed_Systems.md|Distributed_Systems]]
