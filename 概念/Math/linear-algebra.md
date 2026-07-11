---
title: 线性代数
category: -concepts
tags: [math, linear-algebra, tensors, SVD, eigenvalues, matrix-operations]
aliases: [Linear Algebra, 矩阵运算, 张量运算]
relationships:
  - target: "[[概念/probability-statistics]]"
    type: related_to
  - target: "概念/data-structures-algorithms"
    type: related_to
  - target: "概念/distributed-systems"
    type: related_to
sources: [01_ai-fundamentals/Linear_Algebra/Linear_Algebra.md]
summary: 线性代数是AI的空间变换工具箱：数据是向量，模型是矩阵，训练即寻找最佳空间变换。涵盖张量、特征值分解、SVD及矩阵运算。
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

# 线性代数

线性代数是深度学习的语言，从数据表示到变换，几乎所有机器学习操作都可以归结为矩阵运算。在AI中，图像、文本、音频都被表示为向量或张量，神经网络的每一层本质上是线性变换加非线性激活，训练过程就是寻找最优的空间变换参数。

## 核心要点

- **向量空间**是满足加法和数乘封闭性的集合，概率论中的多元高斯分布依赖向量空间结构
- **张量**是AI数据的基本表示形式：标量(0阶)→向量(1阶)→矩阵(2阶)→高阶张量(图像批次为4阶)
- **矩阵乘法**的几何意义是旋转、缩放、剪切的复合变换，矩阵乘法不满足交换律
- **特征值分解(EVD)**仅适用于方阵，**SVD**适用于任意矩阵且数值稳定性更好
- **fine-tuning-techniques低秩微调**的数学基础是SVD低秩近似，参数量可减少到0.4% ^[inferred]
- transformer-architecture中的缩放点积注意力除以√d_k是为了稳定softmax的梯度

## 详细内容

### 向量空间与基

向量空间配备向量加法和标量乘法两个运算。关键性质包括：

- **线性组合**: v = c₁v₁ + c₂v₂ + ... + cₙvₙ
- **线性无关**: 向量组中没有向量可被其他向量线性组合表示
- **基**: 线性无关且张成整个空间的向量组，基向量数量即为维度

AI中的应用：Word Embedding将词映射到高维向量空间，注意力机制中的Query、Key、Value都是向量空间中的向量。

### 张量层级

| 名称 | 阶数 | AI示例 |
|------|------|--------|
| 标量 | 0阶 | 损失值、学习率 |
| 向量 | 1阶 | 词向量、隐状态 |
| 矩阵 | 2阶 | 权重矩阵、注意力矩阵 |
| 3阶张量 | 3阶 | RGB图像 (H,W,3) |
| 4阶张量 | 4阶 | 图像批次 (B,C,H,W) |

### 矩阵运算与线性变换

矩阵乘法 y = Ax 可理解为三种几何变换的复合：

1. **旋转**: R = [[cos θ, -sin θ], [sin θ, cos θ]]
2. **缩放**: S = [[sx, 0], [0, sy]]
3. **剪切**: H = [[1, k], [0, 1]]

复合变换：y = A₃A₂A₁x，注意矩阵乘法不满足交换律。

### 特殊矩阵

| 矩阵类型 | 定义 | AI应用 |
|----------|------|--------|
| 单位矩阵 | I_ij = δ_ij | 残差连接(ResNet) |
| 正交矩阵 | Q^TQ = I | 权重初始化(Orthogonal Init) |
| 对称矩阵 | A = A^T | Hessian矩阵、协方差矩阵 |
| 正定矩阵 | x^TAx > 0 | 优化中的凸性保证 |

### 特征值分解(EVD)

对方阵 A ∈ ℝⁿˣⁿ，若存在非零向量v和标量λ使得 Av = λv，则λ为特征值，v为特征向量。

分解形式：A = QΛQ⁻¹（Q为特征向量矩阵，Λ为特征值对角矩阵）

对称矩阵特例：A = QΛQ^T，特征向量相互正交，特征值均为实数。

应用：PCA的协方差矩阵特征向量即为主成分方向，图神经网络中拉普拉斯矩阵的特征值用于图谱卷积。

### 奇异值分解(SVD)

任意矩阵 A ∈ ℝᵐˣⁿ 可分解为 A = UΣV^T：

- U ∈ ℝᵐˣᵐ：左奇异向量矩阵（列正交）
- Σ ∈ ℝᵐˣⁿ：奇异值对角矩阵（σ₁ ≥ σ₂ ≥ ... ≥ 0）
- V ∈ ℝⁿˣⁿ：右奇异向量矩阵（列正交）

**推导步骤**：
1. 构造对称矩阵 A^TA
2. 对 A^TA 做EVD分解
3. 定义奇异值 σ_i = √λ_i
4. 计算左奇异向量 u_i = (1/σ_i)Av_i

**截断SVD**：保留前k个最大奇异值做低秩近似 A ≈ U_k Σ_k V_k^T，这是Frobenius范数下的最佳秩-k近似（Eckart-Young定理）。

**能量保留比** = Σᵢ₌₁ᵏ σᵢ² / Σᵢ₌₁ʳ σᵢ²

### SVD与EVD的区别

- EVD仅适用于方阵，SVD适用于任意m×n矩阵
- SVD的U和V都是正交矩阵，数值稳定性更好
- 对对称矩阵，EVD和SVD等价（奇异值 = |特征值|）

### 矩阵范数

| 范数 | 定义 | 几何意义 |
|------|------|----------|
| Frobenius范数 | ‖A‖_F = √Σᵢⱼ aᵢⱼ² | 矩阵元素的欧氏距离 |
| L2范数(谱范数) | ‖A‖₂ = σ_max(A) | 最大奇异值 |
| 核范数 | ‖A‖_* = Σᵢ σᵢ | 奇异值之和（凸松弛秩） |

### Transformer中的QKV矩阵

自注意力机制中，输入X通过三个线性变换得到Q、K、V：

- Q = XW_Q, K = XW_K, V = XW_V
- Attention(Q,K,V) = softmax(QK^T / √d_k)V

线性代数视角：QK^T是两个子空间的相似度矩阵，softmax归一化后变为概率分布，乘以V是加权求和。除以√d_k的原因是当维度很大时，点积的方差会增大到d_k，导致softmax饱和。^[inferred]

### LoRA与SVD的关系

LoRA约束参数更新为低秩形式：ΔW = BA（B∈ℝ^{d×r}, A∈ℝ^{r×k}, r ≪ min(d,k)）

与SVD的联系：
- 若ΔW本身是低秩的，SVD可找到最优秩-r近似
- LoRA直接参数化为两个低秩矩阵乘积，训练时只更新B和A
- 压缩比 = r(d+k)/(dk)，当r=8, d=k=4096时约为0.4%

### 随机化算法

**随机SVD**：当矩阵非常大时，通过随机投影将复杂度从O(mn²)降到O(mnk)：
1. 生成随机矩阵Ω ∈ ℝⁿˣᵏ
2. 计算Y = AΩ
3. 正交化Y得到Q
4. 计算B = Q^TA并对B做SVD

### 张量分解

高阶张量（如视频数据）可用Tucker分解或CP分解压缩，应用包括压缩卷积神经网络参数。^[inferred]

### 常见陷阱

1. **数值稳定性**：直接计算A^TA会丢失精度（条件数平方），应使用QR分解
2. **稀疏矩阵**：大规模稀疏矩阵不要转为稠密格式，使用scipy.sparse
3. **梯度消失**：深度网络中多个矩阵相乘，若最大奇异值<1会导致梯度消失，解决方法包括正交初始化、残差连接、LayerNorm

## 开放问题

- 非方阵的最优初始化策略仍存在争议（Xavier vs He vs Orthogonal）
- 大模型中权重矩阵的内在秩如何随训练动态变化^[ambiguous]
- 随机SVD在不同数据分布下的误差界尚不完整^[inferred]

## 来源

- 数学基础/Linear_Algebra/Linear_Algebra.md
- 3Blue1Brown: Essence of Linear Algebra
- LoRA: Low-Rank Adaptation of Large Language world-models-jepa (arXiv:2106.09685)
- Attention Is All You Need (arXiv:1706.03762)
