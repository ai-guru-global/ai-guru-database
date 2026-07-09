---
title: '线性代数 (Linear Algebra)'
category: '01-fundamentals-linear-algebra'
tags: ["fundamentals", "math", "algorithms", "basics"]
summary: '> **一句话理解**: 线性代数是 AI 的"空间变换工具箱" —— 数据是向量，模型是矩阵，训练就是找到最佳的空间变换方式。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Linear Algebra"
  - Linear_Algebra
sources: []

---
# 线性代数 (Linear Algebra)

> **一句话理解**: 线性代数是 AI 的"空间变换工具箱" —— 数据是向量，模型是矩阵，训练就是找到最佳的空间变换方式。

线性代数是深度学习的语言，从数据表示到变换，几乎所有的机器学习操作都可以归结为矩阵运算。

---

## 1. 概述 (Overview)

线性代数 (Linear Algebra) 提供了处理高维数据的数学工具，是理解神经网络、优化算法和概率模型的基础。在 AI 领域：
- **数据表示**: 图像、文本、音频都被表示为向量或张量
- **模型计算**: 神经网络的每一层都是线性变换 + 非线性激活
- **优化理论**: 梯度下降依赖于向量微分和矩阵运算
- **降维与压缩**: SVD、PCA 等技术实现高效数据表示

### 为什么线性代数如此重要？
1. **高维空间直觉**: 人类难以直观理解超过 3 维的空间，线性代数提供了在高维空间中推理的工具
2. **计算效率**: 矩阵运算可以高度并行化，利用 GPU/TPU 加速
3. **理论基础**: 从最小二乘法到神经网络，本质都是求解线性系统或线性近似

---

## 2. 核心概念 (Core Concepts)

### 2.1 向量空间 (Vector Space)

**定义**: 向量空间是满足封闭性（加法和数乘）的集合 $V$，配备两个运算：
- 向量加法: $\mathbf{u} + \mathbf{v} \in V$
- 标量乘法: $\alpha \mathbf{v} \in V$ (其中 $\alpha \in \mathbb{R}$)

**直观理解**:
- 2D 平面是向量空间（所有平面向量的集合）
- 3D 空间中的任意向量都可以表示为 3 个基向量的线性组合
- 神经网络的隐层输出是高维向量空间中的点

**关键性质**:
1. **线性组合 (Linear Combination)**: $\mathbf{v} = c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \ldots + c_n\mathbf{v}_n$
2. **线性无关 (Linear Independence)**: 向量组中没有向量可以被其他向量的线性组合表示
3. **基 (Basis)**: 线性无关且张成整个空间的向量组
4. **维度 (Dimension)**: 基向量的数量

**AI 中的应用**:
- Word Embedding (如 Word2Vec) 将词映射到高维向量空间
- 注意力机制中的 Query、Key、Value 都是向量空间中的向量

---

### 2.2 张量 (Tensors)

| 名称 | 阶数 | 几何意义 | AI 示例 |
|------|------|----------|---------|
| **标量 (Scalar)** | 0阶 | 单个数值 | 损失值、学习率 |
| **向量 (Vector)** | 1阶 | 有方向的量 | 词向量、隐状态 |
| **矩阵 (Matrix)** | 2阶 | 线性变换 | 权重矩阵、注意力矩阵 |
| **3阶张量** | 3阶 | 多通道数据 | RGB 图像 $(H, W, 3)$ |
| **4阶张量** | 4阶 | 批量数据 | 图像批次 $(B, C, H, W)$ |

**来源**: [PyTorch Tensors Documentation](https://pytorch.org/docs/stable/tensors.html)

---

### 2.3 矩阵运算与线性变换

#### 矩阵乘法的几何意义

矩阵乘法 $\mathbf{y} = A\mathbf{x}$ 可以理解为三种几何变换：

1. **旋转 (Rotation)**:
   ```
   R = [cos(θ)  -sin(θ)]
       [sin(θ)   cos(θ)]
   ```

2. **缩放 (Scaling)**:
   ```
   S = [s_x   0 ]
       [ 0   s_y]
   ```

3. **剪切 (Shear)**:
   ```
   H = [1   k]
       [0   1]
   ```

**复合变换**: 多个矩阵相乘表示变换的组合
$$
\mathbf{y} = A_3 A_2 A_1 \mathbf{x}
$$
注意：矩阵乘法不满足交换律，$AB \neq BA$

**ASCII 图解 - 矩阵乘法的行列视角**:
```
    A (m×n)       ×       B (n×p)       =      C (m×p)
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  a11 ... a1n│      │  b11 ... b1p│      │  c11 ... c1p│
│  a21 ... a2n│  ×   │  b21 ... b2p│  =   │  c21 ... c2p│
│   ⋮       ⋮ │      │   ⋮       ⋮ │      │   ⋮       ⋮ │
│  am1 ... amn│      │  bn1 ... bnp│      │  cm1 ... cmp│
└─────────────┘      └─────────────┘      └─────────────┘

C[i,j] = Σ(k=1 to n) A[i,k] × B[k,j]
       = A的第i行 · B的第j列
```

---

### 2.4 特殊矩阵

| 矩阵类型 | 定义 | 性质 | AI 应用 |
|----------|------|------|---------|
| **单位矩阵 (Identity)** | $I_{ij} = \delta_{ij}$ | $AI = IA = A$ | 残差连接 (ResNet) |
| **正交矩阵 (Orthogonal)** | $Q^T Q = I$ | 保持向量长度 | 权重初始化 (Orthogonal Init) |
| **对称矩阵 (Symmetric)** | $A = A^T$ | 实特征值 | Hessian 矩阵、协方差矩阵 |
| **正定矩阵 (Positive Definite)** | $\mathbf{x}^T A \mathbf{x} > 0$ | 所有特征值为正 | 优化中的凸性保证 |

---

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 特征值分解 (Eigenvalue Decomposition, EVD)

#### 定义
对于方阵 $A \in \mathbb{R}^{n \times n}$，如果存在非零向量 $\mathbf{v}$ 和标量 $\lambda$ 使得：
$$
A\mathbf{v} = \lambda\mathbf{v}
$$
则称 $\lambda$ 为特征值 (Eigenvalue)，$\mathbf{v}$ 为对应的特征向量 (Eigenvector)。

#### 几何直觉
- 特征向量表示矩阵变换的"主轴方向"
- 特征值表示在该方向上的拉伸或压缩程度
- 特征值为 0 表示该方向被压缩到 0（矩阵不满秩）

#### EVD 分解
如果矩阵 $A$ 有 $n$ 个线性无关的特征向量，可以分解为：
$$
A = Q\Lambda Q^{-1}
$$
其中：
- $Q$ 是特征向量组成的矩阵
- $\Lambda = \text{diag}(\lambda_1, \lambda_2, \ldots, \lambda_n)$ 是特征值对角矩阵

**对称矩阵的特例**:
当 $A$ 是实对称矩阵时：
$$
A = Q\Lambda Q^T \quad (Q^T Q = I)
$$
此时特征向量相互正交，特征值均为实数。

#### 应用场景
1. **主成分分析 (PCA)**: 协方差矩阵的特征向量是主成分方向
2. **图神经网络**: 图拉普拉斯矩阵的特征值用于图谱卷积
3. **马尔可夫链**: 转移矩阵的特征值决定收敛速度

---

### 3.2 奇异值分解 (Singular Value Decomposition, SVD)

#### 定义
任意矩阵 $A \in \mathbb{R}^{m \times n}$ 都可以分解为：
$$
A = U\Sigma V^T
$$
其中：
- $U \in \mathbb{R}^{m \times m}$ 是左奇异向量矩阵（列正交）
- $\Sigma \in \mathbb{R}^{m \times n}$ 是奇异值对角矩阵（$\sigma_1 \geq \sigma_2 \geq \ldots \geq 0$）
- $V \in \mathbb{R}^{n \times n}$ 是右奇异向量矩阵（列正交）

#### 完整推导

**Step 1: 构造对称矩阵**
$$
A^T A \in \mathbb{R}^{n \times n} \quad \text{(对称正定)}
$$

**Step 2: EVD 分解**
$$
A^T A = V\Lambda V^T \quad (\Lambda = \text{diag}(\lambda_1, \ldots, \lambda_n))
$$

**Step 3: 定义奇异值**
$$
\sigma_i = \sqrt{\lambda_i}
$$

**Step 4: 计算左奇异向量**
$$
\mathbf{u}_i = \frac{1}{\sigma_i} A\mathbf{v}_i \quad (i = 1, \ldots, r)
$$
其中 $r = \text{rank}(A)$

**Step 5: 验证正交性**
$$
\mathbf{u}_i^T \mathbf{u}_j = \frac{1}{\sigma_i \sigma_j} \mathbf{v}_i^T A^T A \mathbf{v}_j = \frac{\lambda_j}{\sigma_i \sigma_j} \delta_{ij} = \delta_{ij}
$$

#### 物理意义（四个基本子空间）

```
                  V^T
         ┌──────────────────┐
         │                  │
     A   │   Row Space      │    Σ        U
  ───────►   (秩 r)        ────────►  (左奇异向量)
         │                  │
         │   Null Space     │
         └──────────────────┘
              ⊥
```

1. **列空间 (Column Space)**: $U$ 的前 $r$ 列
2. **行空间 (Row Space)**: $V$ 的前 $r$ 列
3. **零空间 (Null Space)**: $V$ 的后 $n-r$ 列
4. **左零空间 (Left Null Space)**: $U$ 的后 $m-r$ 列

#### 截断 SVD (Truncated SVD)
保留前 $k$ 个最大奇异值进行低秩近似：
$$
A \approx A_k = U_k \Sigma_k V_k^T
$$
这是弗罗贝尼乌斯范数下的最佳秩-k 近似（Eckart-Young 定理）。

#### 能量保留比
$$
\text{Energy Ratio} = \frac{\sum_{i=1}^k \sigma_i^2}{\sum_{i=1}^r \sigma_i^2}
$$

---

### 3.3 矩阵范数 (Matrix Norms)

常用范数对比：

| 范数 | 定义 | 几何意义 | 计算复杂度 |
|------|------|----------|------------|
| **Frobenius 范数** | $\|A\|_F = \sqrt{\sum_{ij} a_{ij}^2}$ | 矩阵元素的欧氏距离 | $O(mn)$ |
| **L2 范数（谱范数）** | $\|A\|_2 = \sigma_{\max}(A)$ | 最大奇异值 | $O(\min(m,n)^2)$ |
| **核范数** | $\|A\|_* = \sum_i \sigma_i$ | 奇异值之和（凸松弛秩） | $O(\min(m,n)^3)$ |

---

## 4. 代码实战 (Hands-on Code)

### 4.1 使用 NumPy 实现 SVD 降维

```python
import numpy as np
import matplotlib.pyplot as plt

# 生成合成数据（带噪声的低秩矩阵）
np.random.seed(42)
m, n, r = 100, 80, 5  # m行 n列 真实秩为5
U_true = np.random.randn(m, r)
V_true = np.random.randn(n, r)
A_true = U_true @ V_true.T
noise = 0.5 * np.random.randn(m, n)
A = A_true + noise

# 执行 SVD 分解
U, S, Vt = np.linalg.svd(A, full_matrices=False)

# 分析奇异值衰减
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.semilogy(S, 'o-')
plt.xlabel('Index')
plt.ylabel('Singular Value')
plt.title('Singular Value Spectrum')
plt.grid(True)

# 计算不同秩的重构误差
ranks = range(1, 21)
errors = []
for k in ranks:
    A_k = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
    error = np.linalg.norm(A - A_k, 'fro') / np.linalg.norm(A, 'fro')
    errors.append(error)

plt.subplot(1, 2, 2)
plt.plot(ranks, errors, 'o-')
plt.xlabel('Rank k')
plt.ylabel('Relative Error')
plt.title('Reconstruction Error vs Rank')
plt.grid(True)
plt.tight_layout()
# plt.savefig('svd_analysis.png')

# 低秩近似
k = 5
A_approx = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
compression_ratio = (m * k + k + n * k) / (m * n)
print(f"原矩阵大小: {m}×{n} = {m*n} 个元素")
print(f"压缩后存储: {m*k} + {k} + {n*k} = {m*k + k + n*k} 个元素")
print(f"压缩率: {compression_ratio:.2%}")
print(f"重构误差: {np.linalg.norm(A - A_approx, 'fro'):.4f}")
```

### 4.2 手动实现幂迭代法求最大特征值

```python
def power_iteration(A, num_iterations=100):
    """
    幂迭代法求矩阵的最大特征值和特征向量
    原理: v_{k+1} = A @ v_k / ||A @ v_k||
    """
    n = A.shape[0]
    v = np.random.rand(n)
    v = v / np.linalg.norm(v)
    
    for _ in range(num_iterations):
        # 矩阵-向量乘法
        v_new = A @ v
        # 归一化
        v = v_new / np.linalg.norm(v_new)
    
    # 计算特征值（瑞利商）
    eigenvalue = v.T @ A @ v
    return eigenvalue, v

# 测试
A = np.array([[4, 1], [2, 3]])
lambda_max, v_max = power_iteration(A)
print(f"最大特征值: {lambda_max:.4f}")
print(f"对应特征向量: {v_max}")

# 验证
eigvals, eigvecs = np.linalg.eig(A)
print(f"NumPy 结果: {eigvals[0]:.4f}")
```

---

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 Transformer 中的 QKV 矩阵

在自注意力机制中，输入 $X \in \mathbb{R}^{n \times d}$ 通过三个线性变换得到 Query、Key、Value：

$$
\begin{aligned}
Q &= XW_Q \quad (W_Q \in \mathbb{R}^{d \times d_k}) \\
K &= XW_K \quad (W_K \in \mathbb{R}^{d \times d_k}) \\
V &= XW_V \quad (W_V \in \mathbb{R}^{d \times d_v})
\end{aligned}
$$

**注意力计算**:
$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

**线性代数视角**:
1. $QK^T$ 是两个子空间的相似度矩阵（内积测量相关性）
2. Softmax 归一化后变为概率分布（行和为 1）
3. 乘以 $V$ 是加权求和（线性组合）

**为什么除以 $\sqrt{d_k}$？**
- 当维度 $d_k$ 很大时，点积 $\mathbf{q}^T \mathbf{k}$ 的方差会很大
- 假设 $\mathbf{q}, \mathbf{k}$ 元素独立同分布，均值 0，方差 1
- 则 $\text{Var}(\mathbf{q}^T \mathbf{k}) = d_k$
- 除以 $\sqrt{d_k}$ 使方差稳定为 1，避免 softmax 饱和

---

### 5.2 LoRA 低秩分解与 SVD 的关系

**Low-Rank Adaptation (LoRA)** 是一种高效微调大模型的方法，核心思想：

原始参数更新：
$$
W' = W + \Delta W
$$

LoRA 约束：
$$
\Delta W = BA \quad (B \in \mathbb{R}^{d \times r}, A \in \mathbb{R}^{r \times k}, r \ll \min(d,k))
$$

**与 SVD 的联系**:
1. 如果 $\Delta W$ 本身是低秩的，SVD 可以找到最优的秩-r 近似
2. LoRA 直接参数化为两个低秩矩阵的乘积，避免存储完整的 $\Delta W$
3. 训练时只更新 $B$ 和 $A$，参数量减少到 $r(d+k)$

**压缩比计算**:
- 原始: $d \times k$ 参数
- LoRA: $r(d + k)$ 参数
- 比例: $\frac{r(d+k)}{dk}$（当 $r=8, d=k=4096$ 时约为 0.4%）

**实践经验**:
- 对于 7B 模型，$r=8$ 通常足够
- 较大的 $r$ 提升有限，但内存占用线性增长
- 不同层可以设置不同的秩

---

### 5.3 主成分分析 (PCA) 降维

PCA 通过 EVD/SVD 找到数据的主方差方向：

**步骤**:
1. 中心化数据: $X_c = X - \bar{X}$
2. 计算协方差矩阵: $C = \frac{1}{n-1}X_c^T X_c$
3. EVD 分解: $C = Q\Lambda Q^T$
4. 选择前 k 个主成分: $Z = X_c Q_k$

**等价 SVD 方法**:
直接对 $X_c$ 做 SVD: $X_c = U\Sigma V^T$，则 $Z = U_k \Sigma_k$

---

### 5.4 图神经网络中的拉普拉斯矩阵

图拉普拉斯矩阵 $L = D - A$（$D$ 是度矩阵，$A$ 是邻接矩阵）：

**归一化拉普拉斯**:
$$
L_{sym} = D^{-1/2} L D^{-1/2} = I - D^{-1/2} A D^{-1/2}
$$

**谱卷积**:
$$
g_\theta * x = U g_\theta(\Lambda) U^T x
$$
其中 $U$ 是 $L$ 的特征向量矩阵，$\Lambda$ 是特征值矩阵。

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 随机化算法

**随机 SVD (Randomized SVD)**:
- 当矩阵非常大时，完整 SVD 计算复杂度 $O(mn^2)$ 不可接受
- 随机 SVD 通过随机投影降低复杂度到 $O(mnk)$（$k$ 是目标秩）

**算法流程**:
1. 生成随机矩阵 $\Omega \in \mathbb{R}^{n \times k}$
2. 计算 $Y = A\Omega$
3. 正交化 $Y$ 得到 $Q$
4. 计算 $B = Q^T A$ 并对 $B$ 做 SVD

**应用**: scikit-learn 的 `TruncatedSVD` 内部使用随机 SVD

---

### 6.2 张量分解

高阶张量（如视频数据）可以用 Tucker 分解或 CP 分解：

**CP 分解 (CANDECOMP/PARAFAC)**:
$$
\mathcal{X} \approx \sum_{r=1}^R \mathbf{a}_r \circ \mathbf{b}_r \circ \mathbf{c}_r
$$

**Tucker 分解**:
$$
\mathcal{X} \approx \mathcal{G} \times_1 U_1 \times_2 U_2 \times_3 U_3
$$

**应用**: 压缩卷积神经网络的参数

---

### 6.3 常见陷阱

1. **数值稳定性**:
 - 直接计算 $A^T A$ 会丢失精度（条件数平方）
 - 应使用 QR 分解或 Householder 变换

2. **稀疏矩阵**:
 - 对于 $10^6 \times 10^6$ 的稀疏矩阵，不要转为稠密格式
 - 使用 `scipy.sparse` 模块

3. **梯度消失**:
 - 深度网络中多个矩阵相乘，若最大奇异值 <1 会导致梯度消失
 - 解决方法: 正交初始化、残差连接、LayerNorm

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- **微积分**: 理解梯度（向量微分）和黑塞矩阵（二阶导数矩阵）
- **概率论**: 协方差矩阵是期望算子，EVD 用于高斯分布的对角化

### 进阶推荐
- **[优化理论](../../深度学习/Optimization/Optimization.md)**: 牛顿法、拟牛顿法依赖黑塞矩阵
- **[神经网络核心](../../深度学习/Neural_Network_Core/Neural_Network_Core.md)**: 理解权重矩阵的初始化策略
- **[Transformer 架构](../../大模型/Transformer_Revolution/Transformer_Revolution.md)**: 注意力机制的矩阵计算
- **[模型压缩](../../部署推理/Deployment_Inference.md)**: SVD、低秩分解在压缩中的应用

---

## 8. 面试高频问题 (Interview FAQs)

### Q1: SVD 和 EVD 的区别是什么？
**A**: 
- **EVD**: 仅适用于方阵，且通常要求对称或可对角化。分解为 $A = Q\Lambda Q^{-1}$
- **SVD**: 适用于任意 $m \times n$ 矩阵。分解为 $A = U\Sigma V^T$，$U$ 和 $V$ 都是正交矩阵
- **关系**: 对对称矩阵 $A$，EVD 和 SVD 等价（奇异值 = |特征值|）
- **优势**: SVD 数值稳定性更好，且能处理非方阵

### Q2: Transformer 中为什么使用缩放点积注意力（除以 $\sqrt{d_k}$）？
**A**: 
- 当维度 $d_k$ 很大时，$QK^T$ 的方差会增大到 $d_k$
- 大的方差导致 softmax 进入饱和区（梯度接近 0）
- 除以 $\sqrt{d_k}$ 后方差稳定为 1，保持梯度流动
- **实验证明**: 在 $d_k=512$ 时，不缩放会导致训练不稳定

### Q3: LoRA 为什么有效？参数量减少这么多为什么效果不降低？
**A**:
- **假设**: 预训练模型已经学到通用知识，微调时参数更新 $\Delta W$ 的内在秩很低
- **实证**: 论文发现 $r=1,2$ 时就能达到 60-70% 的效果，$r=8$ 接近全参数微调
- **原理**: 类似于梯度下降在高维空间中实际上沿低维子空间移动
- **额外好处**: 可以并行训练多个任务的 LoRA 模块，推理时动态切换

### Q4: 为什么神经网络权重初始化要用正交矩阵？
**A**:
- **目标**: 避免梯度消失/爆炸
- **原理**: 正交矩阵的奇异值都是 1，前向传播时保持向量长度，反向传播时保持梯度尺度
- **实现**: PyTorch 中 `torch.nn.init.orthogonal_(tensor)`
- **局限**: 仅适用于方阵；对于非方阵，使用 Xavier/He 初始化

### Q5: 如何高效计算矩阵乘法 $ABC$（三个矩阵）？
**A**:
- **关键**: 结合律（但不满足交换律）
- **示例**: $A_{10 \times 100}, B_{100 \times 5}, C_{5 \times 50}$
 - $(AB)C$: $10 \times 100 \times 5 + 10 \times 5 \times 50 = 7500$ 次乘法
 - $A(BC)$: $100 \times 5 \times 50 + 10 \times 100 \times 50 = 75000$ 次乘法
- **优化**: 使用动态规划找最优括号化（时间复杂度 $O(n^3)$）
- **实践**: 现代深度学习框架会自动优化计算图

---

## 9. 参考资源 (References)

### 经典教材
- [Linear Algebra Done Right - Sheldon Axler](https://linear.axler.net/)  
  强调向量空间和线性映射，避免行列式优先的传统路线
  
- [Introduction to Linear Algebra - Gilbert Strang (MIT)](https://math.mit.edu/~gs/linearalgebra/)  
  配套 MIT 18.06 课程，注重几何直觉

### 视觉学习
- [3Blue1Brown - Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra)  
  通过动画可视化线性变换、特征值、SVD 等概念

### 论文
- [The Fundamental Theorem of Linear Algebra - Gilbert Strang](https://web.mit.edu/18.06/www/essays/newpaper_7.pdf)  
  深入阐述四个基本子空间

- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)  
  微软提出的高效微调方法

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)  
  Transformer 原始论文，Section 3.2 详细解释缩放点积注意力

### 工具与库
- [NumPy Linear Algebra](https://numpy.org/doc/stable/reference/routines.linalg.html)  
  `np.linalg.svd`, `np.linalg.eig` 等核心函数

- [PyTorch nn.init](https://pytorch.org/docs/stable/nn.init.html)  
  各种矩阵初始化方法

- [scikit-learn TruncatedSVD](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html)  
  随机 SVD 实现

---

*Last updated: 2026-02-10*
