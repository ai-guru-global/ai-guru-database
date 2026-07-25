---
title: '无监督学习 (Unsupervised Learning)'
category: '02-machine-learning-unsupervised-learning'
tags: ["machine-learning", "supervised", "unsupervised"]
summary: '> **一句话理解**: 无监督学习就像"自己找规律"——没有老师告诉答案,让模型在没有标签的数据中自己发现隐藏的模式和结构,就像考古学家从文物中推测古代文明的生活方式。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Unsupervised Learning"
  - Unsupervised_Learning
sources: []

---
# 无监督学习 (Unsupervised Learning)

> **一句话理解**: 无监督学习就像"自己找规律"——没有老师告诉答案,让模型在没有标签的数据中自己发现隐藏的模式和结构,就像考古学家从文物中推测古代文明的生活方式。

## 1. 概述 (Overview)

无监督学习 (Unsupervised Learning) 是机器学习的重要分支,旨在从无标签数据中发现潜在结构、模式或表示。与监督学习不同,无监督学习没有明确的"正确答案",而是通过数据本身的统计特性进行学习。

### 1.1 无监督学习的特点

- **无需标注**: 节省人工标注成本,适用于海量数据
- **探索性分析**: 发现数据中的未知模式
- **特征学习**: 学习更好的数据表示用于下游任务
- **核心任务**:
 - **聚类 (Clustering)**: 将相似样本分组
 - **降维 (Dimensionality Reduction)**: 压缩数据维度保留关键信息
 - **异常检测 (Anomaly Detection)**: 识别异常样本
 - **密度估计 (Density Estimation)**: 建模数据分布

### 1.2 应用价值

```
数据预处理:
原始数据 → 降维 (PCA/t-SNE) → 可视化分析 → 特征提取

客户分群:
用户行为数据 → 聚类 (K-Means) → 精准营销策略

异常检测:
系统日志 → 密度估计 → 入侵检测/欺诈识别
```

## 2. 核心概念 (Core Concepts)

### 2.1 聚类分析 (Clustering Analysis)

聚类的目标是最大化**簇内相似度 (Intra-cluster Similarity)** 和最小化**簇间相似度 (Inter-cluster Similarity)**。

#### K-Means 聚类

**算法原理**:
K-Means 通过迭代优化,寻找 $K$ 个簇中心 (Centroid),最小化簇内误差平方和 (WCSS, Within-Cluster Sum of Squares):

$$WCSS = \sum_{k=1}^{K} \sum_{x_i \in C_k} ||x_i - \mu_k||^2$$

其中 $\mu_k$ 是第 $k$ 个簇的质心,$C_k$ 是第 $k$ 个簇的样本集合。

**算法步骤**:
```
初始化: 随机选择 K 个样本作为初始质心

迭代 (直到收敛):
  步骤 1 - 分配 (Assignment):
    对每个样本 x_i:
      计算到所有质心的距离 d(x_i, μ_k)
      分配到最近的簇: c_i = argmin_k ||x_i - μ_k||²
  
  步骤 2 - 更新 (Update):
    对每个簇 C_k:
      重新计算质心: μ_k = (1/|C_k|) Σ_{x_i ∈ C_k} x_i
  
  检查收敛:
    若质心不再变化或变化小于阈值 ε,停止
```

**收敛保证**: K-Means 保证收敛,因为每次迭代都单调降低 WCSS (但可能收敛到局部最优)。

**K 值选择方法**:

1. **肘部法则 (Elbow Method)**:
 - 绘制 K vs WCSS 曲线
 - 选择曲线"拐点"处的 K 值
   ```
   WCSS
     ^
     |  \
     |    \
     |      \_____  ← 肘部 (选择此 K)
     |            \____
     +---------------------> K
   ```

2. **轮廓系数 (Silhouette Score)**:
 $$s(i) = \frac{b(i) - a(i)}{\max\{a(i), b(i)\}}$$
 - $a(i)$: 样本 $i$ 与同簇其他样本的平均距离
 - $b(i)$: 样本 $i$ 与最近异簇样本的平均距离
 - 取值范围 $[-1, 1]$,越接近 1 越好

3. **Gap Statistic**:
 比较真实数据的 WCSS 与随机数据的期望 WCSS

**K-Means 优势与局限**:

| 优势 | 局限 |
|------|------|
| 简单高效,易于实现 | 需预先指定 K 值 |
| 可扩展到大数据 (Mini-batch K-Means) | 对初始化敏感 (可用 K-Means++ 改进) |
| 适合球形簇 | 不适合非凸形状或不同密度的簇 |
| 复杂度 $O(n \cdot K \cdot I \cdot d)$ | 对异常值敏感 |

#### 层次聚类 (Hierarchical Clustering)

**原理**: 构建树状聚类结构 (Dendrogram)

**两种策略**:
1. **凝聚式 (Agglomerative)**: 自底向上,每次合并最相似的簇
2. **分裂式 (Divisive)**: 自顶向下,递归分割簇

**链接准则**:

| 方法 | 距离定义 | 特点 |
|------|----------|------|
| 单链接 (Single Linkage) | $\min_{x \in C_i, y \in C_j} d(x, y)$ | 易产生链式效应 |
| 全链接 (Complete Linkage) | $\max_{x \in C_i, y \in C_j} d(x, y)$ | 倾向于紧凑簇 |
| 平均链接 (Average Linkage) | $\frac{1}{\|C_i\| \|C_j\|} \sum_{x \in C_i, y \in C_j} d(x, y)$ | 平衡链式与紧凑 |
| Ward 链接 | 最小化簇内方差增量 | 倾向于大小相近的簇 |

#### DBSCAN (Density-Based Spatial Clustering)

**核心思想**: 基于密度连接性定义簇,无需预设簇数量。

**关键参数**:
- $\epsilon$ (eps): 邻域半径
- MinPts: 核心点的最小邻居数

**点的分类**:
```
核心点 (Core Point):
  ε 邻域内至少有 MinPts 个点
  
边界点 (Border Point):
  ε 邻域内少于 MinPts 个点
  但在某核心点的 ε 邻域内
  
噪声点 (Noise):
  既不是核心点也不是边界点
  
簇的定义:
  由密度可达的核心点集合
```

**DBSCAN 参数选择**:

1. **MinPts 选择**:
 - 经验规则: $MinPts \geq D + 1$ (D 是数据维度)
 - 低维数据: MinPts = 4
 - 高维数据: MinPts 适当增大

2. **ε 选择** (K-距离图法):
 - 计算每个点到第 K 个最近邻的距离
 - 按距离排序绘制曲线
 - 选择曲线"肘部"作为 ε
   ```python
   from sklearn.neighbors import NearestNeighbors
   neighbors = NearestNeighbors(n_neighbors=MinPts)
   neighbors.fit(X)
   distances, _ = neighbors.kneighbors(X)
   distances = np.sort(distances[:, -1], axis=0)
   plt.plot(distances)  # 找拐点
   ```

**DBSCAN vs K-Means**:

| 特性 | DBSCAN | K-Means |
|------|--------|---------|
| **簇形状** | 任意形状 | 凸形/球形 |
| **簇数量** | 自动确定 | 需预先指定 |
| **异常值处理** | 标记为噪声 | 强制分配 |
| **簇密度** | 可处理不同密度 | 假设簇密度相似 |
| **复杂度** | $O(n \log n)$ (KD-tree) | $O(n \cdot K \cdot I)$ |
| **参数敏感性** | 对 ε 和 MinPts 敏感 | 对初始化敏感 |

#### 高斯混合模型 (Gaussian Mixture Model, GMM)

**概率视角的聚类**: 假设数据由 $K$ 个高斯分布的混合生成:

$$P(\mathbf{x}) = \sum_{k=1}^{K} \pi_k \mathcal{N}(\mathbf{x}|\mu_k, \Sigma_k)$$

其中:
- $\pi_k$: 第 $k$ 个分量的混合系数 ($\sum_k \pi_k = 1$)
- $\mu_k$: 第 $k$ 个分量的均值
- $\Sigma_k$: 第 $k$ 个分量的协方差矩阵

**EM 算法求解**:

```
E 步 (Expectation):
  计算后验概率 (责任度):
  γ(z_{ik}) = π_k·N(x_i|μ_k,Σ_k) / Σ_j π_j·N(x_i|μ_j,Σ_j)

M 步 (Maximization):
  更新参数:
  N_k = Σ_i γ(z_{ik})
  μ_k = (1/N_k) Σ_i γ(z_{ik})·x_i
  Σ_k = (1/N_k) Σ_i γ(z_{ik})·(x_i - μ_k)(x_i - μ_k)ᵀ
  π_k = N_k / N
```

**GMM vs K-Means**:

| 维度 | GMM | K-Means |
|------|-----|---------|
| **分配方式** | 软分配 (概率) | 硬分配 (确定) |
| **簇形状** | 椭圆形 (协方差可调) | 球形 |
| **理论基础** | 概率生成模型 | 距离优化 |
| **输出** | 每个样本属于各簇的概率 | 每个样本的唯一簇标签 |
| **复杂度** | 更高 (需估计协方差) | 更低 |

### 2.2 降维技术 (Dimensionality Reduction)

降维的目标: 在保留关键信息的前提下,将高维数据映射到低维空间。

#### 主成分分析 (PCA, Principal Component Analysis)

**数学原理**: 寻找数据方差最大的正交方向

**优化目标**:
$$\max_{\mathbf{w}} \mathbf{w}^T \Sigma \mathbf{w} \quad \text{s.t.} \quad ||\mathbf{w}|| = 1$$

其中 $\Sigma = \frac{1}{m} \mathbf{X}^T \mathbf{X}$ 是协方差矩阵。

**求解步骤**:
```
1. 数据中心化: X̄ = X - mean(X)

2. 计算协方差矩阵: Σ = (1/m) X̄ᵀ X̄

3. 特征分解: Σ = V Λ Vᵀ
   - V: 特征向量矩阵 (主成分方向)
   - Λ: 特征值对角矩阵 (方差大小)

4. 选择前 k 个主成分: V_k = [v₁, v₂, ..., v_k]

5. 投影: Z = X̄ V_k ∈ ℝ^{m×k}
```

**方差解释率**:
$$\text{Explained Variance Ratio} = \frac{\lambda_i}{\sum_{j=1}^{n} \lambda_j}$$

**选择主成分数量**:
- 累积方差解释率 ≥ 85%-95%
- 碎石图 (Scree Plot) 找"肘部"

**PCA 几何直觉**:
```
原始 2D 数据:        PCA 投影到 1D:
  
    × ×              PC1 (主成分1)
  × × ×              ────────────→
 × × × ×             ⋮ ⋮ ⋮ ⋮ ⋮ ⋮
  × × ×              (所有点投影)
    × ×
                     PC2 被丢弃(方差小)
```

**PCA 的局限**:
- 线性变换,无法捕捉非线性结构
- 对异常值敏感
- 假设方差大的方向更重要 (不一定成立)

#### 线性判别分析 (LDA, Linear Discriminant Analysis)

**与 PCA 的区别**: LDA 是有监督降维,目标是最大化类间距离/类内距离比。

**优化目标**:
$$\max_{\mathbf{w}} \frac{\mathbf{w}^T S_B \mathbf{w}}{\mathbf{w}^T S_W \mathbf{w}}$$

- $S_B$: 类间散度矩阵 (Between-class Scatter)
- $S_W$: 类内散度矩阵 (Within-class Scatter)

#### t-SNE (t-Distributed Stochastic Neighbor Embedding)

**核心思想**: 保持高维空间中的邻域结构,将相似样本在低维空间中靠近。

**概率分布**:
- 高维空间: 样本相似度 $p_{j|i} = \frac{\exp(-||x_i - x_j||^2 / 2\sigma_i^2)}{\sum_{k \neq i} \exp(-||x_i - x_k||^2 / 2\sigma_i^2)}$
- 低维空间: $q_{ij} = \frac{(1 + ||y_i - y_j||^2)^{-1}}{\sum_{k \neq l} (1 + ||y_k - y_l||^2)^{-1}}$ (t 分布)

**损失函数** (KL 散度):
$$C = \sum_i KL(P_i || Q_i) = \sum_i \sum_j p_{ij} \log \frac{p_{ij}}{q_{ij}}$$

**关键参数**:
- **Perplexity**: 控制关注的邻居数量 (推荐 5-50)
 - 小 perplexity: 关注局部结构
 - 大 perplexity: 关注全局结构
- **学习率**: 通常 100-1000
- **迭代次数**: 至少 1000 次

**t-SNE vs PCA**:

| 特性 | t-SNE | PCA |
|------|-------|-----|
| **线性性** | 非线性 | 线性 |
| **保持结构** | 局部邻域 | 全局方差 |
| **计算复杂度** | $O(n^2)$ | $O(nd^2 + d^3)$ |
| **确定性** | 随机 (每次结果不同) | 确定 |
| **可逆性** | 不可逆 | 可逆重构 |
| **用途** | **可视化** (2D/3D) | 特征提取/压缩 |
| **超参数** | 需仔细调整 | 几乎无需调整 |

**t-SNE 重要提示**:
- ❌ **不能用于训练特征**: t-SNE 无法转换新样本
- ✅ **仅用于可视化**: 探索数据分布、类别分离度
- ⚠️ **簇间距离无意义**: 不能根据簇间距离判断相似性
- ⚠️ **全局结构可能失真**: 可能将不相关簇放在一起

#### UMAP (Uniform Manifold Approximation and Projection)

**核心思想**: 基于黎曼几何和拓扑数据分析,保留局部和全局结构。

**UMAP vs t-SNE**:

| 特性 | UMAP | t-SNE |
|------|------|-------|
| **速度** | **快** (大数据更优) | 慢 |
| **全局结构** | **保留较好** | 损失较多 |
| **可重复性** | 更稳定 | 随机性强 |
| **新数据转换** | **支持** (transform) | 不支持 |
| **超参数敏感性** | 较低 | 较高 |
| **理论基础** | 流形学习 | 概率嵌入 |

**关键参数**:
- **n_neighbors**: 局部邻域大小 (默认 15)
- **min_dist**: 低维空间点间最小距离 (默认 0.1)
- **metric**: 距离度量 (欧氏距离/余弦距离等)

### 2.3 异常检测 (Anomaly Detection)

#### Isolation Forest (孤立森林)

**核心思想**: 异常点更容易被"孤立"——需要更少的随机划分次数。

**算法流程**:
```
训练阶段:
  For i = 1 to n_trees:
    随机采样数据
    构建 iTree:
      随机选择特征和分裂值
      递归分裂直到:
        - 节点只有一个样本
        - 达到最大深度
        - 所有样本值相同

预测阶段:
  对每个样本计算平均路径长度 h(x)
  异常分数: s(x) = 2^(-h(x)/c(n))
  - s(x) ≈ 1: 异常
  - s(x) ≈ 0.5: 正常
```

**优势**:
- 线性复杂度 $O(n)$
- 无需距离计算
- 对高维数据有效

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 聚类评估指标

由于无监督学习没有真实标签,评估更具挑战性。

#### 内部评估 (无需标签)

**轮廓系数 (Silhouette Coefficient)**:
$$s = \frac{1}{n} \sum_{i=1}^{n} \frac{b_i - a_i}{\max(a_i, b_i)}$$

**Calinski-Harabasz 指数** (方差比准则):
$$CH = \frac{SS_B / (K-1)}{SS_W / (n-K)}$$
- $SS_B$: 簇间离散度
- $SS_W$: 簇内离散度
- 越大越好

**Davies-Bouldin 指数**:
$$DB = \frac{1}{K} \sum_{i=1}^{K} \max_{j \neq i} \frac{\sigma_i + \sigma_j}{d(c_i, c_j)}$$
- 越小越好

#### 外部评估 (有标签用于验证)

**调整兰德指数 (Adjusted Rand Index, ARI)**:
$$ARI = \frac{RI - \mathbb{E}[RI]}{\max(RI) - \mathbb{E}[RI]}$$
- 取值范围 $[-1, 1]$,1 表示完美匹配
- 调整后考虑随机聚类的影响

**归一化互信息 (Normalized Mutual Information, NMI)**:
$$NMI = \frac{MI(U, V)}{\sqrt{H(U) H(V)}}$$

### 3.2 维度灾难 (Curse of Dimensionality)

**现象**: 高维空间中,样本间距离趋于相等,聚类和近邻方法失效。

**数学证明**:
在 $d$ 维单位超立方体中,体积主要集中在"角落":
$$\frac{V_{\text{内切球}}}{V_{\text{超立方体}}} = \frac{\pi^{d/2}/\Gamma(d/2+1)}{2^d} \xrightarrow{d \to \infty} 0$$

**解决策略**:
1. **降维**: PCA/t-SNE/UMAP
2. **特征选择**: 移除冗余特征
3. **正则化**: 防止高维过拟合
4. **核方法**: 隐式映射到高维

## 4. 代码实战 (Hands-on Code)

### 4.1 聚类完整实战

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs, make_moons
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import silhouette_score, adjusted_rand_score, calinski_harabasz_score
from sklearn.preprocessing import StandardScaler

# 1. 生成测试数据
X_blobs, y_blobs = make_blobs(n_samples=500, centers=4, cluster_std=1.0, random_state=42)
X_moons, y_moons = make_moons(n_samples=500, noise=0.05, random_state=42)

# 数据标准化 (对 DBSCAN 尤其重要)
scaler = StandardScaler()
X_blobs_scaled = scaler.fit_transform(X_blobs)
X_moons_scaled = scaler.fit_transform(X_moons)

# 2. K-Means 肘部法则
wcss = []
silhouette_scores = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_blobs_scaled)
    wcss.append(kmeans.inertia_)
    silhouette_scores.append(silhouette_score(X_blobs_scaled, kmeans.labels_))

# 绘制肘部曲线
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].plot(K_range, wcss, marker='o')
axes[0].set_xlabel('Number of Clusters (K)')
axes[0].set_ylabel('WCSS (Inertia)')
axes[0].set_title('Elbow Method')
axes[0].grid(True)

axes[1].plot(K_range, silhouette_scores, marker='s', color='green')
axes[1].set_xlabel('Number of Clusters (K)')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Analysis')
axes[1].grid(True)
plt.tight_layout()
plt.savefig('kmeans_selection.png')

# 3. 多算法对比
algorithms = {
    'K-Means': KMeans(n_clusters=4, random_state=42),
    'DBSCAN': DBSCAN(eps=0.3, min_samples=5),
    'Agglomerative': AgglomerativeClustering(n_clusters=4)
}

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
datasets = [('Blobs', X_blobs_scaled, y_blobs), ('Moons', X_moons_scaled, y_moons)]

for row, (data_name, X, y_true) in enumerate(datasets):
    for col, (algo_name, algorithm) in enumerate(algorithms.items()):
        # 训练
        y_pred = algorithm.fit_predict(X)
        
        # 评估
        sil_score = silhouette_score(X, y_pred) if len(set(y_pred)) > 1 else -1
        ari_score = adjusted_rand_score(y_true, y_pred)
        ch_score = calinski_harabasz_score(X, y_pred) if len(set(y_pred)) > 1 else 0
        
        # 可视化
        axes[row, col].scatter(X[:, 0], X[:, 1], c=y_pred, cmap='viridis', s=20)
        axes[row, col].set_title(f'{data_name} - {algo_name}\nSil:{sil_score:.2f} ARI:{ari_score:.2f}')
        axes[row, col].set_xticks([])
        axes[row, col].set_yticks([])

plt.tight_layout()
plt.savefig('clustering_comparison.png')
print("聚类对比图已保存")

# 4. DBSCAN 参数选择 (K-距离图)
from sklearn.neighbors import NearestNeighbors
neighbors = NearestNeighbors(n_neighbors=5)
neighbors.fit(X_moons_scaled)
distances, _ = neighbors.kneighbors(X_moons_scaled)
distances = np.sort(distances[:, -1], axis=0)

plt.figure(figsize=(10, 6))
plt.plot(distances)
plt.xlabel('Sample Index (sorted)')
plt.ylabel('4-th Nearest Neighbor Distance')
plt.title('K-Distance Graph for DBSCAN ε Selection')
plt.axhline(y=0.2, color='r', linestyle='--', label='Suggested ε=0.2')
plt.legend()
plt.grid(True)
plt.savefig('dbscan_epsilon_selection.png')
```

### 4.2 降维与可视化

```python
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import umap
from sklearn.datasets import load_digits

# 加载高维数据 (64 维)
digits = load_digits()
X, y = digits.data, digits.target

# 1. PCA 降维
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)
print(f"PCA 解释方差比: {pca.explained_variance_ratio_}")
print(f"累积解释方差: {pca.explained_variance_ratio_.sum():.2%}")

# 2. t-SNE 降维
tsne = TSNE(n_components=2, perplexity=30, random_state=42, n_iter=1000)
X_tsne = tsne.fit_transform(X)

# 3. UMAP 降维
reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, random_state=42)
X_umap = reducer.fit_transform(X)

# 可视化对比
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
methods = [('PCA', X_pca), ('t-SNE', X_tsne), ('UMAP', X_umap)]

for ax, (method_name, X_reduced) in zip(axes, methods):
    scatter = ax.scatter(X_reduced[:, 0], X_reduced[:, 1], c=y, cmap='tab10', s=10, alpha=0.7)
    ax.set_title(f'{method_name} (digits dataset)')
    ax.set_xlabel('Component 1')
    ax.set_ylabel('Component 2')
    plt.colorbar(scatter, ax=ax)

plt.tight_layout()
plt.savefig('dimensionality_reduction_comparison.png')
print("降维对比图已保存")

# 4. PCA 方差解释率分析
pca_full = PCA(n_components=20)
pca_full.fit(X)

plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.bar(range(1, 21), pca_full.explained_variance_ratio_)
plt.xlabel('Principal Component')
plt.ylabel('Explained Variance Ratio')
plt.title('Scree Plot')

plt.subplot(1, 2, 2)
plt.plot(range(1, 21), np.cumsum(pca_full.explained_variance_ratio_), marker='o')
plt.xlabel('Number of Components')
plt.ylabel('Cumulative Explained Variance')
plt.axhline(y=0.95, color='r', linestyle='--', label='95% threshold')
plt.title('Cumulative Explained Variance')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.savefig('pca_variance_analysis.png')
```

### 4.3 异常检测实战

```python
from sklearn.ensemble import IsolationForest
from sklearn.svm import OneClassSVM
from sklearn.covariance import EllipticEnvelope

# 生成包含异常值的数据
rng = np.random.RandomState(42)
X_normal = 0.3 * rng.randn(500, 2)
X_outliers = rng.uniform(low=-4, high=4, size=(50, 2))
X_anomaly = np.vstack([X_normal, X_outliers])

# 多算法对比
anomaly_algorithms = {
    'Isolation Forest': IsolationForest(contamination=0.1, random_state=42),
    'One-Class SVM': OneClassSVM(nu=0.1, kernel='rbf', gamma=0.1),
    'Robust Covariance': EllipticEnvelope(contamination=0.1, random_state=42)
}

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

for ax, (name, algorithm) in zip(axes, anomaly_algorithms.items()):
    # 预测 (1: 正常, -1: 异常)
    y_pred = algorithm.fit_predict(X_anomaly)
    
    # 可视化
    ax.scatter(X_anomaly[y_pred == 1, 0], X_anomaly[y_pred == 1, 1], 
               c='blue', s=20, label='Normal', alpha=0.6)
    ax.scatter(X_anomaly[y_pred == -1, 0], X_anomaly[y_pred == -1, 1], 
               c='red', s=50, label='Anomaly', marker='x')
    ax.set_title(name)
    ax.legend()
    ax.set_xlim(-5, 5)
    ax.set_ylim(-5, 5)

plt.tight_layout()
plt.savefig('anomaly_detection.png')
print("异常检测结果已保存")
```

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 客户分群 (Customer Segmentation)

**任务**: 根据用户行为将客户分为不同群体
**数据**: 购买频率、客单价、浏览历史、停留时长
**方法**: K-Means / GMM
**价值**:
- 精准营销: 针对不同群体推送个性化广告
- 产品设计: 根据主力用户群优化功能
- 客户生命周期管理: 识别高价值客户

**案例**: 某电商将用户分为:
- 高价值常客: 高频高额,重点维护
- 价格敏感型: 优惠券敏感,促销重点
- 新用户: 增长潜力,引导转化
- 流失风险: 活跃度下降,挽留策略

### 5.2 图像压缩 (Image Compression)

**任务**: 使用 K-Means 进行颜色量化
**方法**: 将像素 RGB 值聚类,用质心替代原始颜色
**效果**: 将 24-bit 真彩色压缩到 16/256 色

```python
from sklearn.cluster import MiniBatchKMeans
import matplotlib.image as mpimg

img = mpimg.imread('photo.jpg')
h, w, c = img.shape
img_array = img.reshape(-1, 3)

# K-Means 颜色量化
kmeans = MiniBatchKMeans(n_clusters=16, random_state=42)
kmeans.fit(img_array)
compressed = kmeans.cluster_centers_[kmeans.labels_]
compressed_img = compressed.reshape(h, w, c)

# 压缩率: 原始 (h×w×24 bits) → 压缩 (h×w×4 bits + 16×24 bits)
```

### 5.3 基因数据分析 (Gene Expression Analysis)

**任务**: 从基因表达矩阵中发现细胞类型
**数据**: 单细胞 RNA 测序 (scRNA-seq)
**流程**:
1. **降维**: PCA (500 维 → 50 维) → UMAP (50 维 → 2 维)
2. **聚类**: Leiden / Louvain 算法识别细胞群
3. **标记**: 寻找每个群的差异表达基因

**挑战**:
- 高维稀疏数据 (> 20,000 基因)
- 批次效应校正
- 罕见细胞类型识别

### 5.4 推荐系统 (Recommendation Systems)

**协同过滤的降维**:
- **问题**: 用户-物品评分矩阵高维稀疏
- **方法**: 矩阵分解 (Matrix Factorization) / SVD
- **目标**: 学习低维用户和物品嵌入向量

### 5.5 异常检测应用

1. **信用卡欺诈检测**: Isolation Forest 识别异常交易
2. **网络入侵检测**: One-Class SVM 检测异常流量
3. **工业设备故障预警**: 传感器数据异常模式识别

## 6. 进阶话题 (Advanced Topics)

### 6.1 谱聚类 (Spectral Clustering)

**核心思想**: 将聚类问题转化为图分割问题

**算法流程**:
```
1. 构建相似度图:
   - 邻接矩阵 W: W_ij = exp(-||x_i - x_j||² / 2σ²)
   - 度矩阵 D: D_ii = Σ_j W_ij

2. 计算拉普拉斯矩阵:
   L = D - W  (未归一化)
   或 L_norm = I - D^(-1/2) W D^(-1/2)  (归一化)

3. 特征分解:
   求 L 的前 k 个最小特征值对应的特征向量

4. K-Means 聚类:
   对特征向量矩阵进行 K-Means
```

**优势**: 能处理非凸形状的簇 (如环形、交叉结构)

### 6.2 密度峰值聚类 (Density Peak Clustering)

**假设**: 簇中心是局部密度峰值,且与其他高密度点距离远。

**两个关键量**:
1. **局部密度**: $\rho_i = \sum_{j} \chi(d_{ij} - d_c)$
2. **最近高密度点距离**: $\delta_i = \min_{j:\rho_j > \rho_i} d_{ij}$

**选择簇中心**: $\rho$ 和 $\delta$ 都较大的点

### 6.3 聚类集成 (Clustering Ensemble)

**动机**: 单个聚类算法可能不稳定,融合多个结果更鲁棒。

**方法**:
1. **共识聚类 (Consensus Clustering)**:
 - 运行多次聚类 (不同参数/随机种子)
 - 构建共识矩阵: $M_{ij}$ = 样本 $i,j$ 被分到同一簇的频率
 - 对 $M$ 再次聚类

2. **证据累积 (Evidence Accumulation)**:
 - 将多个聚类结果编码为二值向量
 - 计算样本间的汉明距离
 - 基于距离矩阵聚类

### 6.4 常见陷阱

1. **不做数据归一化**:
 - 问题: 数量级大的特征主导距离计算
 - 示例: 年龄 (0-100) vs 收入 (0-1000000)
 - 解决: StandardScaler / MinMaxScaler

2. **忽略评估多样性**:
 - 问题: 仅用单一指标 (如 WCSS) 可能误导
 - 解决: 同时参考 Silhouette / Calinski-Harabasz / 领域知识

3. **t-SNE 参数未调优**:
 - 问题: 默认参数可能产生误导性可视化
 - 解决: 尝试不同 perplexity (5, 30, 50)

4. **高维数据直接聚类**:
 - 问题: 维度灾难导致距离度量失效
 - 解决: 先降维 (PCA) 再聚类

## 7. 与其他主题的关联 (Connections)

### 7.1 前置知识
- **线性代数**: 特征分解 (PCA)、奇异值分解 (SVD)、矩阵运算
- **概率统计**: 高斯分布 (GMM)、KL 散度 (t-SNE)、贝叶斯推断
- **优化理论**: 梯度下降 (t-SNE)、EM 算法 (GMM)

### 7.2 横向关联
- [**监督学习**](../Supervised_Learning/Supervised_Learning.md): PCA 降维后可提升监督模型性能
- [**特征工程**](../Feature_Engineering/): 聚类标签可作为新特征
- [**深度学习**](03_深度学习/02_Neural_Network_Core/Neural_Network_Core.md): 自编码器 (Autoencoder) 是非线性降维

### 7.3 纵向进阶
- **半监督学习**: 结合少量标签数据与聚类
- **表示学习**: Word2Vec / 图嵌入 (Node2Vec)
- **生成模型**: VAE (变分自编码器) / GAN (生成对抗网络)

## 8. 面试高频问题 (Interview FAQs)

### Q1: K-Means 的 K 值如何确定?有哪些方法?

**答案**: 四种主流方法

1. **肘部法则 (Elbow Method)**:
 - 绘制 K vs WCSS 曲线
 - 选择曲线急剧下降后趋于平缓的"拐点"
 - **局限**: 拐点不总是明显

2. **轮廓系数法 (Silhouette Method)**:
 - 计算不同 K 值的平均轮廓系数
 - 选择系数最大的 K
 - **优势**: 考虑了簇的紧密度和分离度

3. **Gap Statistic**:
 - 比较 $\log(WCSS_k)$ 与随机数据的期望
 - $Gap(k) = \mathbb{E}[\log(WCSS_k^*)] - \log(WCSS_k)$
 - 选择 $Gap(k)$ 最大的 K

4. **领域知识**:
 - 根据业务需求预设 (如客户分为 3-5 类)
 - 结合可解释性要求

**代码示例**:
```python
from sklearn.metrics import silhouette_score

K_range = range(2, 11)
scores = []
for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42)
    labels = kmeans.fit_predict(X)
    scores.append(silhouette_score(X, labels))

optimal_k = K_range[np.argmax(scores)]
print(f"最优 K = {optimal_k}")
```

### Q2: t-SNE 能否用于生成训练特征?为什么?

**答案**: ❌ **不能用于训练特征**,只能用于可视化。

**核心原因**:
1. **不可逆性**: t-SNE 没有显式的映射函数 $f: \mathbb{R}^d \rightarrow \mathbb{R}^2$,无法转换新样本
2. **非确定性**: 每次运行结果不同 (随机初始化)
3. **全局结构失真**: 为优化局部邻域,牺牲了全局距离关系
4. **计算成本**: $O(n^2)$ 复杂度,不适合大数据

**正确用法**:
```python
# ✅ 正确: 仅用于探索性可视化
X_tsne = TSNE(n_components=2).fit_transform(X_train)
plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y_train)

# ❌ 错误: 不能这样用于训练
model.fit(X_tsne, y_train)  # 新数据无法转换!
```

**替代方案**:
- **PCA**: 可逆,支持 transform 新数据
- **UMAP**: 支持 transform,但仍建议谨慎用于训练特征
- **Autoencoder**: 学习编码器-解码器,可转换新样本

### Q3: DBSCAN 和 K-Means 分别适合什么场景?

**答案**: 根据数据特性和任务需求选择

| 场景 | 推荐算法 | 原因 |
|------|----------|------|
| **簇形状为凸形/球形** | K-Means | 假设与数据匹配,效率高 |
| **簇形状任意 (环形/月牙)** | DBSCAN | 基于密度,不受形状限制 |
| **簇大小/密度不一** | DBSCAN | 不假设簇大小相似 |
| **存在大量噪声** | DBSCAN | 自动标记噪声点 |
| **需要预测新样本** | K-Means | 可直接分配到最近质心 |
| **高维数据** | K-Means | DBSCAN 在高维易失效 |
| **不知道簇数量** | DBSCAN | 无需预设 K |
| **需要在线更新** | K-Means (Mini-batch) | 支持增量学习 |

**实战建议**:
```python
# 数据探索阶段: 先可视化判断
from sklearn.decomposition import PCA
X_2d = PCA(n_components=2).fit_transform(X)
plt.scatter(X_2d[:, 0], X_2d[:, 1])

# 决策:
# - 看到明显分离的球形簇 → K-Means
# - 看到复杂形状/密度变化 → DBSCAN
# - 不确定 → 都试试,用 Silhouette Score 对比
```

### Q4: PCA 为什么需要数据中心化?不中心化会怎样?

**答案**: 中心化确保方差最大化的方向是真正的主成分。

**数学原因**:
PCA 的优化目标是最大化投影方差:
$$\max_{\mathbf{w}} \mathbf{w}^T \Sigma \mathbf{w} = \max_{\mathbf{w}} \mathbf{w}^T (\frac{1}{m} \mathbf{X}^T \mathbf{X}) \mathbf{w}$$

若数据未中心化 ($\mathbb{E}[\mathbf{x}] \neq 0$):
- 协方差矩阵包含均值项: $\Sigma = \mathbb{E}[\mathbf{x}\mathbf{x}^T] - \mathbb{E}[\mathbf{x}]\mathbb{E}[\mathbf{x}]^T$
- 第一主成分可能只是指向数据均值的方向 (无意义)

**示例**:
```python
from sklearn.decomposition import PCA

# 未中心化
pca_no_center = PCA(n_components=2)
X_pca_wrong = pca_no_center.fit_transform(X)  # 错误!

# 正确做法 (sklearn 内部自动中心化)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)  # X 会被自动中心化

# 手动中心化
X_centered = X - X.mean(axis=0)
X_pca_manual = pca.fit_transform(X_centered)
```

**是否需要标准化?**
- **中心化**: 总是需要 (PCA 前提)
- **标准化 (除以标准差)**: 
 - 特征量纲不同 → 需要 (如身高 cm vs 体重 kg)
 - 特征量纲相同 → 不需要 (如像素值都是 0-255)

### Q5: GMM 和 K-Means 有什么本质区别?

**答案**: 硬分配 vs 软分配,优化目标不同

| 维度 | K-Means | GMM |
|------|---------|-----|
| **模型假设** | 簇是等方差的球形 | 簇是任意协方差的椭圆 |
| **分配方式** | 硬分配 (每个点属于唯一簇) | 软分配 (概率分布) |
| **优化目标** | 最小化 WCSS | 最大化似然 $P(X|\theta)$ |
| **输出** | 簇标签 $c_i \in \{1,...,K\}$ | 后验概率 $P(c_k|x_i)$ |
| **参数** | 质心 $\mu_k$ | 均值 $\mu_k$ + 协方差 $\Sigma_k$ + 权重 $\pi_k$ |
| **算法** | Lloyd 迭代 | EM 算法 |
| **适用场景** | 简单快速聚类 | 需要概率输出/椭圆簇 |

**数学关系**:
K-Means 是 GMM 的特殊情况:
- 当 GMM 的协方差矩阵 $\Sigma_k = \sigma^2 I$ (球形)
- 且 $\sigma \rightarrow 0$ (硬分配)
- GMM 退化为 K-Means

**代码对比**:
```python
from sklearn.mixture import GaussianMixture

# K-Means: 硬分配
kmeans = KMeans(n_clusters=3)
labels_hard = kmeans.fit_predict(X)  # 返回 {0, 1, 2}

# GMM: 软分配
gmm = GaussianMixture(n_components=3)
gmm.fit(X)
probs = gmm.predict_proba(X)  # 返回 [[0.8, 0.1, 0.1], ...]
labels_soft = gmm.predict(X)  # 返回概率最大的类
```

## 9. 参考资源 (References)

### 9.1 经典论文
- **[Visualizing Data using t-SNE (van der Maaten & Hinton, 2008)](https://www.jmlr.org/papers/v9/vandermaaten08a.html)**: t-SNE 原论文
- **[UMAP: Uniform Manifold Approximation and Projection (McInnes et al., 2018)](https://arxiv.org/abs/1802.03426)**: UMAP 算法
- **[DBSCAN: A Density-Based Algorithm (Ester et al., 1996)](https://www.aaai.org/Papers/KDD/1996/KDD96-037.pdf)**: DBSCAN 开创性工作
- **[Isolation Forest (Liu et al., 2008)](https://ieeexplore.ieee.org/document/4781136)**: 异常检测经典算法

### 9.2 教材与课程
- **[Elements of Statistical Learning - Chapter 14](https://web.stanford.edu/~hastie/ElemStatLearn/)**: 无监督学习理论
- **[Pattern Recognition and Machine Learning (Bishop)](https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/)**: 第 9 章混合模型,第 12 章 PCA
- **[Unsupervised Learning - Stanford CS229](https://cs229.stanford.edu/)**: Andrew Ng 课程讲义

### 9.3 开源库
- **[Scikit-learn Clustering](https://scikit-learn.org/stable/modules/clustering.html)**: 聚类算法集合
- **[UMAP Python Library](https://umap-learn.readthedocs.io/)**: UMAP 官方实现
- **[hdbscan](https://hdbscan.readthedocs.io/)**: 层次 DBSCAN 改进版
- **[Yellowbrick](https://www.scikit-yb.org/)**: 机器学习可视化工具 (含聚类评估)

### 9.4 工具与教程
- **[Scikit-learn Clustering Comparison](https://scikit-learn.org/stable/auto_examples/cluster/plot_cluster_comparison.html)**: 官方算法对比示例
- **[Distill.pub - How to Use t-SNE Effectively](https://distill.pub/2016/misread-tsne/)**: t-SNE 可视化最佳实践
- **[Kaggle - Clustering Notebooks](https://www.kaggle.com/code?searchQuery=clustering)**: 实战案例

### 9.5 进阶阅读
- **[Spectral Clustering Tutorial (von Luxburg, 2007)](https://arxiv.org/abs/0711.0189)**: 谱聚类理论综述
- **[A Survey on Clustering Ensembles (Vega-Pons & Ruiz-Shulcloper, 2011)](https://www.sciencedirect.com/science/article/pii/S0888613X10001587)**: 聚类集成方法
- **[Deep Clustering (Min et al., 2018)](https://arxiv.org/abs/1801.07648)**: 深度学习与聚类结合

---
*Last updated: 2026-02-10*
