---
title: '数据结构与算法 (Data Structures & Algorithms)'
category: '01-fundamentals-data-structures-algorithms'
tags: ["fundamentals", "math", "algorithms", "basics"]
summary: '> **一句话理解**: 算法是 AI 的"工具箱" —— 数据结构决定存储效率，算法决定计算速度，两者结合支撑起从训练到推理的整个流程。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Data Structures Algorithms"
  - Data_Structures_Algorithms
sources: []

name_zh: "数据结构与算法"
---
# 数据结构与算法 (Data Structures & Algorithms)

> 中文简称：数据结构与算法

> **一句话理解**: 算法是 AI 的"工具箱" —— 数据结构决定存储效率，算法决定计算速度，两者结合支撑起从训练到推理的整个流程。

高效的算法是实现大规模 AI 模型训练与推理的基础。从计算图的构建到向量检索，数据结构与算法无处不在。

---

## 1. 概述 (Overview)

在 AI 系统中，数据结构与算法的重要性体现在：
- **训练效率**: 计算图优化、梯度累积、内存管理
- **推理速度**: 解码策略（贪心/束搜索）、量化加速
- **数据检索**: 向量数据库中的近似最近邻搜索 (ANN)
- **模型架构**: 注意力机制的复杂度优化（稀疏注意力、线性注意力）

### 核心挑战
1. **时间复杂度**: Transformer 的注意力机制是 $O(n^2)$，处理长序列时成为瓶颈
2. **空间复杂度**: 大模型参数量巨大，需要高效存储（稀疏化、量化）
3. **并行化**: GPU 擅长矩阵运算但不擅长分支逻辑，需要算法重新设计

---

## 2. 核心概念 (Core Concepts)

### 2.1 复杂度分析

#### 时间复杂度（Big-O 表示）

| 符号 | 名称 | 示例算法 | 增长速率（n=1000） |
|------|------|----------|-------------------|
| $O(1)$ | 常数 | 数组索引、哈希表查找 | 1 |
| $O(\log n)$ | 对数 | 二分搜索 | 10 |
| $O(n)$ | 线性 | 遍历数组 | 1,000 |
| $O(n \log n)$ | 线性对数 | 快速排序、归并排序 | 10,000 |
| $O(n^2)$ | 平方 | 朴素矩阵乘法、Transformer 注意力 | 1,000,000 |
| $O(2^n)$ | 指数 | 递归斐波那契、暴力搜索 | $10^{301}$ |

#### AI 中的复杂度实例

| 操作 | 复杂度 | 瓶颈分析 |
|------|--------|----------|
| **全连接层前向传播** | $O(d_{in} \times d_{out})$ | 矩阵乘法（GPU 优化） |
| **自注意力机制** | $O(n^2 d)$ | 序列长度 $n$ 平方增长 |
| **卷积层（单层）** | $O(n_{out} \times k^2 \times c_{in})$ | 卷积核大小 $k$ |
| **Beam Search** | $O(b \times n \times V)$ | 词表大小 $V$ |
| **K-NN 暴力搜索** | $O(nd)$ | 数据量 $n$ 线性增长 |
| **HNSW 搜索** | $O(\log n)$ | 分层图结构 |

---

### 2.2 图论基础

#### 有向无环图 (Directed Acyclic Graph, DAG)

神经网络的计算图本质上是 DAG：

```
输入层          隐层1         隐层2        输出层
  x1 ────┐      ┌─► h1 ────┐   ┌─► h3 ───► y
         ├─► W1─┤           ├─► W2 ┤
  x2 ────┘      └─► h2 ────┘   └─► h4 ───┘
                                     
前向传播：拓扑排序（从输入到输出）
反向传播：逆拓扑排序（从输出到输入）
```

#### 拓扑排序 (Topological Sort)

**作用**: 确定计算顺序（保证依赖关系）

**算法**（Kahn 算法）:
1. 统计每个节点的入度
2. 将入度为 0 的节点加入队列
3. 依次处理队列中的节点，移除其出边，更新后继节点入度
4. 重复直到队列为空

**PyTorch 中的应用**: `torch.autograd` 自动构建计算图并完成拓扑排序

---

### 2.3 哈希表 (Hash Table)

#### 原理
- **哈希函数**: 将键映射到固定范围的索引 $h(k) \to [0, m-1]$
- **冲突解决**: 链表法、开放寻址法

#### AI 中的应用

**1. Embedding Layer（嵌入层）**
```python
# PyTorch 实现（简化）
class Embedding:
    def __init__(self, vocab_size, embed_dim):
        self.weight = torch.randn(vocab_size, embed_dim)
    
    def forward(self, input_ids):
        # 本质上是哈希表查找
        return self.weight[input_ids]  # O(1) 查找
```

**2. 去重与集合操作**
- 数据预处理：快速去重样本
- NMS（非极大值抑制）：目标检测中去除重复框

**3. 缓存**
- KV Cache（大模型推理）：缓存已计算的 Key 和 Value
- Memoization：动态规划中避免重复计算

---

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 自动微分 (Automatic Differentiation, AD)

#### 正向模式 vs 反向模式

| 维度 | 正向模式 (Forward Mode) | 反向模式 (Reverse Mode, Backprop) |
|------|-------------------------|-----------------------------------|
| **计算顺序** | 随前向传播同步计算梯度 | 先前向计算值，再反向计算梯度 |
| **适用场景** | 输入维度低（$n_{in} \ll n_{out}$） | 输出维度低（$n_{out} \ll n_{in}$，神经网络典型情况） |
| **复杂度** | $O(n_{in})$ 次前向传播 | $O(1)$ 次前向 + $O(1)$ 次反向传播 |
| **内存消耗** | 低（即时计算） | 高（需存储中间结果） |

**为什么深度学习用反向模式？**
- 损失函数是标量（$n_{out}=1$），参数可能有数十亿（$n_{in} \gg 1$）
- 一次反向传播即可计算所有参数的梯度

#### 计算图示例

```
前向传播:
a = x * y    (中间结果: ∂L/∂a)
b = a + z    (中间结果: ∂L/∂b)
L = sin(b)   (损失)

反向传播（链式法则）:
∂L/∂b = cos(b)
∂L/∂a = ∂L/∂b × 1 = cos(b)
∂L/∂z = ∂L/∂b × 1 = cos(b)
∂L/∂x = ∂L/∂a × y = cos(b) × y
∂L/∂y = ∂L/∂a × x = cos(b) × x
```

#### 计算图的 ASCII 可视化

```
           前向传播 →
        x ──┐
            ├─ × ──► a ──┐
        y ──┘            ├─ + ──► b ──► sin ──► L
        z ───────────────┘
        
        ← 反向传播（梯度流）
    ∂L/∂x ◄─┐
            ├─ ∂a ◄── ∂L/∂a ◄─┐
    ∂L/∂y ◄─┘                 ├─ ∂b ◄── ∂L/∂b ◄── cos(b)
    ∂L/∂z ◄───────────────────┘
```

---

### 3.2 Beam Search（束搜索）

#### 问题背景
在序列生成任务（如机器翻译、文本生成）中，暴力搜索所有可能序列的复杂度是 $O(V^T)$（$V$ 是词表大小，$T$ 是序列长度），不可行。

#### 算法原理
保留每个时间步最有可能的 $k$ 个候选序列（beam width = $k$）：

**伪代码**（带详细注释）:
```python
def beam_search(model, start_token, beam_width, max_len, vocab_size):
    """
    model: 语言模型（给定历史预测下一个token的概率）
    start_token: 起始标记（如 <BOS>）
    beam_width: 束宽（同时保留的候选数量）
    max_len: 最大生成长度
    vocab_size: 词表大小
    """
    # 初始化：只有起始序列
    beams = [(start_token, 0.0)]  # (序列, 对数概率)
    
    for t in range(max_len):
        candidates = []  # 存储所有候选扩展
        
        for seq, score in beams:
            if seq[-1] == END_TOKEN:
                # 已结束的序列不再扩展
                candidates.append((seq, score))
                continue
            
            # 获取下一个token的概率分布
            probs = model.predict_next(seq)  # shape: (vocab_size,)
            log_probs = np.log(probs + 1e-12)  # 避免 log(0)
            
            # 考虑所有可能的下一个token
            for token in range(vocab_size):
                new_seq = seq + [token]
                new_score = score + log_probs[token]  # 累加对数概率
                candidates.append((new_seq, new_score))
        
        # 按分数排序，保留 top-k
        candidates = sorted(candidates, key=lambda x: x[1], reverse=True)
        beams = candidates[:beam_width]
        
        # 如果所有序列都结束，提前停止
        if all(seq[-1] == END_TOKEN for seq, _ in beams):
            break
    
    # 返回分数最高的序列
    return beams[0][0]
```

#### 优化技巧

1. **长度归一化**（避免偏向短序列）:
$$
\text{Score} = \frac{1}{T^\alpha} \sum_{t=1}^T \log P(y_t | y_{<t})
$$
 通常取 $\alpha \in [0.6, 0.7]$

2. **剪枝**:
 - 提前停止：当分数最高的未完成序列分数低于最差的完成序列时停止
 - 覆盖惩罚：避免重复生成相同的片段

3. **多样性**:
 - Diverse Beam Search: 鼓励不同 beam 之间的差异
 - Top-p Sampling: 从累积概率 $p$ 的核心词汇中采样

#### 复杂度分析
- **时间**: $O(k \times T \times V)$（每步考虑 $k$ 个序列的 $V$ 个扩展）
- **空间**: $O(k \times T)$（存储 $k$ 个序列）

**对比贪心搜索**:
- 贪心: $O(T \times V)$，但可能陷入局部最优
- Beam Search: 略高的计算成本换取更好的全局搜索

---

### 3.3 HNSW (Hierarchical Navigable Small World)

#### 问题背景
向量数据库（RAG、推荐系统）需要在数百万甚至数十亿高维向量中快速找到最近邻。

#### 核心思想
结合两种数据结构：
1. **跳表 (Skip List)**: 分层加速一维搜索
2. **小世界网络 (Small World)**: 短程连接 + 长程连接

#### 分层结构（ASCII 图解）

```
Layer 2 (稀疏):  A ──────────────────────► E
                 
Layer 1 (中等):  A ────► B ────────► D ──► E ──► F
                 
Layer 0 (稠密):  A ─► B ─► C ─► D ─► E ─► F ─► G ─► H
                 ↕    ↕    ↕    ↕    ↕    ↕    ↕    ↕
              (完整连接所有邻居)

搜索过程（查找离 Query Q 最近的点）:
1. 从 Layer 2 最高层开始，贪心跳转到更接近 Q 的节点
2. 到达局部最优后，下降到 Layer 1，继续搜索
3. 最终在 Layer 0 精确搜索
```

#### 算法步骤

**插入**:
1. 随机选择层数 $l$ (指数分布)
2. 从顶层开始搜索最近邻
3. 在每层建立双向连接（限制最大度数 $M$）

**搜索**:
1. 入口点：顶层的固定节点
2. 贪心搜索：每层选择距离最小的邻居
3. 下降到下一层，直到底层
4. 返回候选集中的 top-k

#### 参数调优

| 参数 | 含义 | 影响 | 推荐值 |
|------|------|------|--------|
| **M** | 每层最大连接数 | 越大查询越准但构建慢 | 16-48 |
| **efConstruction** | 构建时动态候选集大小 | 影响索引质量 | 100-200 |
| **efSearch** | 查询时候选集大小 | 影响召回率 | 50-500 |
| **层数** | 自动生成（指数分布） | - | - |

#### 性能对比

| 方法 | 构建时间 | 查询时间 | 召回率@10 | 内存 |
|------|----------|----------|-----------|------|
| **暴力搜索** | $O(n)$ | $O(nd)$ | 100% | 低 |
| **LSH** | $O(n)$ | $O(n/b)$ | 70-80% | 中 |
| **HNSW** | $O(n \log n)$ | $O(\log n)$ | 95-99% | 高 |
| **IVF** | $O(n)$ | $O(n/k)$ | 80-90% | 中 |

**结论**: HNSW 在高召回率要求下是最优选择（Faiss、Milvus、Weaviate 等向量数据库的默认算法）

---

## 4. 代码实战 (Hands-on Code)

### 4.1 简化版自动微分实现

```python
import numpy as np

class Tensor:
    """支持自动微分的张量类"""
    def __init__(self, data, requires_grad=False):
        self.data = np.array(data, dtype=float)
        self.grad = None
        self.requires_grad = requires_grad
        self._backward = lambda: None  # 反向传播函数
        self._prev = set()  # 父节点
        
    def backward(self):
        """反向传播（拓扑排序 + 链式法则）"""
        topo = []
        visited = set()
        
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        
        build_topo(self)
        
        self.grad = np.ones_like(self.data)
        for node in reversed(topo):
            node._backward()
    
    def __add__(self, other):
        other = other if isinstance(other, Tensor) else Tensor(other)
        out = Tensor(self.data + other.data, requires_grad=True)
        
        def _backward():
            if self.requires_grad:
                self.grad = (self.grad or 0) + out.grad
            if other.requires_grad:
                other.grad = (other.grad or 0) + out.grad
        
        out._backward = _backward
        out._prev = {self, other}
        return out
    
    def __mul__(self, other):
        other = other if isinstance(other, Tensor) else Tensor(other)
        out = Tensor(self.data * other.data, requires_grad=True)
        
        def _backward():
            if self.requires_grad:
                self.grad = (self.grad or 0) + other.data * out.grad
            if other.requires_grad:
                other.grad = (other.grad or 0) + self.data * out.grad
        
        out._backward = _backward
        out._prev = {self, other}
        return out
    
    def __repr__(self):
        return f"Tensor({self.data}, grad={self.grad})"

# 测试：计算 f(x, y) = x * y + x
x = Tensor(2.0, requires_grad=True)
y = Tensor(3.0, requires_grad=True)

z = x * y + x  # z = 2*3 + 2 = 8
z.backward()

print(f"z = {z.data}")  # 8.0
print(f"∂z/∂x = {x.grad}")  # ∂z/∂x = y + 1 = 4.0
print(f"∂z/∂y = {y.grad}")  # ∂z/∂y = x = 2.0
```

### 4.2 Beam Search 完整实现

```python
import numpy as np

class SimpleLanguageModel:
    """简化的语言模型（用于演示）"""
    def __init__(self, vocab_size):
        self.vocab_size = vocab_size
    
    def predict_next(self, sequence):
        """给定序列，预测下一个token的概率分布"""
        # 这里用随机概率模拟（实际应用中是神经网络前向传播）
        probs = np.random.dirichlet(np.ones(self.vocab_size))
        return probs

def beam_search(model, start_token, end_token, beam_width=3, max_len=10):
    beams = [([start_token], 0.0)]  # (序列, 累积对数概率)
    
    for step in range(max_len):
        candidates = []
        
        for seq, score in beams:
            if seq[-1] == end_token:
                candidates.append((seq, score))
                continue
            
            probs = model.predict_next(seq)
            log_probs = np.log(probs + 1e-12)
            
            # 只考虑概率最高的 beam_width 个token（减少计算）
            top_indices = np.argsort(log_probs)[-beam_width:]
            
            for token in top_indices:
                new_seq = seq + [token]
                new_score = score + log_probs[token]
                candidates.append((new_seq, new_score))
        
        # 长度归一化
        candidates = sorted(candidates, 
                           key=lambda x: x[1] / len(x[0])**0.7, 
                           reverse=True)
        beams = candidates[:beam_width]
        
        # 打印当前 beams
        print(f"Step {step+1}:")
        for i, (seq, score) in enumerate(beams):
            print(f"  Beam {i+1}: {seq} (score={score:.3f})")
        
        if all(seq[-1] == end_token for seq, _ in beams):
            break
    
    return beams[0][0], beams[0][1]

# 测试
vocab_size = 10
model = SimpleLanguageModel(vocab_size)
start_token, end_token = 0, 9

best_seq, best_score = beam_search(model, start_token, end_token, beam_width=3, max_len=5)
print(f"\n最佳序列: {best_seq}")
print(f"分数: {best_score:.3f}")
```

### 4.3 使用 Faiss 实现 HNSW 向量检索

```python
import numpy as np
import faiss

# 生成模拟数据
d = 128  # 向量维度
n_train = 10000  # 训练集大小
n_query = 5  # 查询数量

np.random.seed(42)
train_data = np.random.randn(n_train, d).astype('float32')
query_data = np.random.randn(n_query, d).astype('float32')

# 归一化（余弦相似度需要）
faiss.normalize_L2(train_data)
faiss.normalize_L2(query_data)

# 构建 HNSW 索引
M = 32  # 每层连接数
efConstruction = 40  # 构建时候选集大小

index = faiss.IndexHNSWFlat(d, M)
index.hnsw.efConstruction = efConstruction

# 添加向量
index.add(train_data)

# 搜索
efSearch = 16  # 查询时候选集大小
index.hnsw.efSearch = efSearch

k = 10  # 返回最近的 10 个邻居
distances, indices = index.search(query_data, k)

# 结果
print(f"查询向量 0 的最近邻索引: {indices[0]}")
print(f"对应距离: {distances[0]}")

# 性能对比：暴力搜索
index_flat = faiss.IndexFlatIP(d)  # 内积（余弦相似度）
index_flat.add(train_data)
distances_flat, indices_flat = index_flat.search(query_data, k)

# 计算召回率
recall = np.mean([len(set(indices[i]) & set(indices_flat[i])) / k 
                  for i in range(n_query)])
print(f"\nHNSW 召回率: {recall:.2%}")
```

---

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 注意力机制的复杂度优化

**标准自注意力**: $O(n^2 d)$（$n$ 是序列长度，$d$ 是隐藏维度）

**优化方法**:

| 方法 | 复杂度 | 核心思想 | 代表模型 |
|------|--------|----------|----------|
| **稀疏注意力** | $O(n \sqrt{n} d)$ | 只计算局部+全局注意力 | Longformer, BigBird |
| **线性注意力** | $O(n d^2)$ | 核方法近似 softmax | Performer, RWKV |
| **低秩分解** | $O(n k d)$ | $QK^T \approx AB^T$ ($k \ll n$) | Linformer |
| **Flash Attention** | $O(n^2 d)$ | IO 优化（不改变复杂度） | Flash Attention v1/v2 |

### 5.2 KV Cache 在大模型推理中的应用

**问题**: 生成式模型每次生成新 token 时需要重新计算所有历史 token 的注意力

**解决**: 缓存已计算的 Key 和 Value

```python
# 伪代码
class CachedAttention:
    def __init__(self):
        self.k_cache = []  # 缓存 Key
        self.v_cache = []  # 缓存 Value
    
    def forward(self, q_new, k_new, v_new):
        # 追加新的 key/value
        self.k_cache.append(k_new)
        self.v_cache.append(v_new)
        
        # 拼接所有历史 key/value
        K = concat(self.k_cache, dim=1)  # [batch, seq_len, d]
        V = concat(self.v_cache, dim=1)
        
        # 只计算新 query 与所有 key 的注意力
        attn = softmax(q_new @ K.T / sqrt(d))
        out = attn @ V
        return out
```

**收益**: 时间复杂度从 $O(T^2)$ 降到 $O(T)$（$T$ 是生成长度）

---

### 5.3 动态规划在序列标注中的应用

**Viterbi 算法**（HMM/CRF 解码）:

给定观测序列 $\mathbf{x} = (x_1, \ldots, x_T)$，找最优隐状态序列 $\mathbf{y}^*$：
$$
\mathbf{y}^* = \arg\max_{\mathbf{y}} P(\mathbf{y}|\mathbf{x})
$$

**DP 递推**:
$$
\delta_t(s) = \max_{s'} \left[\delta_{t-1}(s') \times P(s|s') \times P(x_t|s)\right]
$$

**复杂度**: $O(T \times S^2)$（$S$ 是状态数），远优于暴力搜索的 $O(S^T)$

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 并行算法

**问题**: GPU 有数千个核心，如何设计适合并行的算法？

**案例：Parallel Prefix Sum（Scan）**

应用：累积和、前缀最大值（用于 softmax 的数值稳定）

```
输入:  [1, 2, 3, 4, 5, 6, 7, 8]
输出:  [1, 3, 6, 10, 15, 21, 28, 36]

朴素算法: O(n) 时间，但无法并行
并行算法: O(log n) 时间，O(n) 处理器
```

**关键**: 树形归约（Tree Reduction）

### 6.2 量化算法

**Int8 量化**:
$$
q = \text{round}\left(\frac{x - z}{s}\right), \quad x \approx s \cdot q + z
$$
其中 $s$ 是缩放因子，$z$ 是零点偏移。

**W8A16（权重8位，激活16位）**:
- 权重量化为 int8 存储，推理时动态反量化
- 激活保持 float16，避免精度损失

**对称 vs 非对称量化**:
- 对称: $z=0$，范围 $[-127, 127]$（ReLU 后的激活适用）
- 非对称: $z \neq 0$，范围 $[0, 255]$（覆盖更广）

### 6.3 常见陷阱

1. **过早优化**: 先保证正确性，再优化性能
   - 案例: 手写 CUDA kernel 前，先用 PyTorch 验证结果

2. **忽略常数因子**: Big-O 隐藏了常数，实际可能 $O(n \log n) > O(n^2)$（当 $n$ 小时）
   - 案例: 小规模矩阵乘法用 Strassen 算法反而更慢

3. **缓存失效**: CPU/GPU 缓存局部性至关重要
   - 案例: 按列遍历矩阵（C 连续）比按行慢 10 倍

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- **[线性代数](../02_线性代数/03_线性代数.md)**: 矩阵运算的复杂度分析
- **[概率论](../03_概率统计/02_概率统计.md)**: Beam Search 中的概率计算

### 进阶推荐
- **[神经网络核心](03_深度学习/02_神经网络核心/09_神经网络核心.md)**: 计算图与反向传播
- **[Transformer 架构](05_大模型/04_Transformer_Revolution/09_03_Transformer架构架构_Revolution.md)**: 注意力机制的优化
- **[模型压缩](10_部署推理/01_部署基础/03_部署推理.md)**: 量化、剪枝、蒸馏
- **[向量数据库](14_RAG系统/01_RAG基础/07_RAG_系统.md)**: HNSW、ANN 算法实践

---

## 8. 面试高频问题 (Interview FAQs)

### Q1: 为什么深度学习使用反向模式自动微分而不是正向模式？
**A**:
- **复杂度**: 神经网络输出维度（损失）远小于输入维度（参数）
  - 正向模式: 需要 $O(n_{\text{params}})$ 次前向传播
  - 反向模式: 只需 1 次前向 + 1 次反向传播
- **示例**: 1B 参数模型，标量损失
  - 正向模式: 需要 10 亿次前向传播
  - 反向模式: 仅需 1 次
- **适用场景**: 正向模式适合 Jacobian 矩阵计算（$n_{in} \ll n_{out}$）

### Q2: Beam Search 和贪心搜索的区别？为什么不直接用贪心？
**A**:
- **贪心搜索**: 每步选择概率最高的 token，$O(T \times V)$
- **Beam Search**: 保留 top-k 个候选，$O(k \times T \times V)$
- **问题**: 贪心容易陷入局部最优
  - 示例: 翻译"I am fine"
    - 贪心可能先选"我很"（高概率），后续被迫选"好的"（不自然）
    - Beam Search 保留"我挺"候选，最终生成"我挺好"（全局更优）
- **局限**: Beam Search 仍是近似算法，无法保证全局最优

### Q3: HNSW 为什么比传统索引（如 KD-Tree）快？
**A**:
- **KD-Tree**:
  - 低维高效（$d \leq 20$），高维退化为暴力搜索（维度灾难）
  - 查询复杂度: $O(2^d + \log n)$（$d$ 大时接近 $O(n)$）
- **HNSW**:
  - 基于图而非树，不受维度限制
  - 分层跳跃 + 贪心搜索，复杂度 $O(\log n)$
  - 实证: 在 128 维向量上，HNSW 比 KD-Tree 快 100 倍
- **代价**: 构建时间和内存消耗更高

### Q4: 为什么 Transformer 自注意力是 $O(n^2)$？如何优化？
**A**:
- **原因**: 计算 $QK^T$（$n \times d$ 乘以 $d \times n$）产生 $n \times n$ 矩阵
- **瓶颈**: 当 $n=10000$ 时，矩阵有 1 亿元素
- **优化方案**:
  1. **稀疏注意力**: 只计算局部窗口 + 全局 token（Longformer）
  2. **线性注意力**: 近似 softmax 为核函数（Performer）
  3. **Flash Attention**: 优化内存访问，减少 HBM↔SRAM 传输
- **权衡**: 精度 vs 速度（如线性注意力牺牲 1-2% 准确率换取 10 倍提速）

### Q5: 哈希表在嵌入层中的作用是什么？
**A**:
- **嵌入层本质**: 从词表索引到向量的映射（lookup table）
- **实现**: `embedding_matrix[token_id]`（数组索引，$O(1)$）
- **哈希表优势**:
  - 支持动态词表（新词动态插入）
  - 处理稀疏词表（大部分 token 很少出现）
- **实际应用**: 推荐系统中的 ID embedding（数亿用户/物品）
  - 使用 Hash Embedding 减少内存（冲突用加法聚合）

---

## 9. 参考资源 (References)

### 经典教材
- [Introduction to Algorithms (CLRS) - Thomas Cormen et al.](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/) 
 算法圣经，覆盖所有基础算法

- [The Art of Computer Programming - Donald Knuth](https://www-cs-faculty.stanford.edu/~knuth/taocp.html) 
 计算机科学的数学基础

### 在线课程
- [CS 61B: Data Structures (UC Berkeley)](https://sp21.datastructur.es/) 
 Java 实现，配有完整作业和自动评分系统

- [MIT 6.006: Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/) 
 理论与实践并重

### 论文
- [Automatic Differentiation in Machine Learning: a Survey](https://arxiv.org/abs/1502.05767) 
 自动微分全面综述

- [Efficient and Robust Approximate Nearest Neighbor Search using Hierarchical Navigable Small World Graphs](https://arxiv.org/abs/1603.09320) 
 HNSW 原始论文

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) 
 Transformer 架构，Appendix 有复杂度分析

- [Flash Attention: Fast and Memory-Efficient Exact Attention](https://arxiv.org/abs/2205.14135) 
 IO 感知的注意力优化

### 工具与库
- [Faiss (Facebook AI Similarity Search)](https://github.com/facebookresearch/faiss) 
 高效向量检索库，支持 GPU 加速

- [PyTorch Autograd](https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html) 
 自动微分实现

- [Numba](https://numba.pydata.org/) 
 Python JIT 编译器，加速 NumPy 代码

---

*Last updated: 2026-02-10*

## Related

- [[03_深度学习/02_神经网络核心/09_神经网络核心]] — 神经网络核心：计算图与自动微分
- [[05_大模型/05_LLM架构/05_LLM架构]] — LLM 架构中的注意力复杂度优化
- [[14_RAG系统/01_RAG基础/07_RAG_系统]] — RAG 系统中的向量检索与 ANN 算法
- [[07_模型训练/04_分布式训练/03_分布式训练_2026]] — 分布式训练中的通信算法
- [[概念/transformer-architecture]] — Transformer 架构与注意力机制
