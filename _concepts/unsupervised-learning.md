---
title: 无监督学习
category: concepts
tags: ["machine-learning", "unsupervised", "clustering", "pca", "dimensionality-reduction", "tsne", "dbscan"]
aliases: [Unsupervised Learning]
relationships:
  - target: "[[_concepts/supervised-learning]]"
    type: related_to
  - target: "_concepts/feature-engineering"
    type: related_to
  - target: "_concepts/anomaly-detection"
    type: related_to
sources: [02_Machine_Learning/Unsupervised_Learning/Unsupervised_Learning.md]
summary: 从无标签数据中发现潜在结构和模式，包括聚类、降维、密度估计等核心任务。
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

# 无监督学习

无监督学习旨在从无标签数据中发现潜在结构、模式或表示。与监督学习不同，它没有明确的"正确答案"，而是通过数据本身的统计特性进行学习。核心任务包括聚类、降维、异常检测和密度估计。

## 核心要点

- 无需标注数据，节省人工成本，适用于海量数据探索
- 聚类目标：最大化簇内相似度、最小化簇间相似度
- K-Means 简单高效但需预设 K 值，DBSCAN 可自动确定簇数量且能发现任意形状
- PCA 是线性降维的标准方法，t-SNE/UMAP 用于非线性可视化
- 维度灾难：高维空间中样本间距离趋于相等，需先降维再聚类
- 无监督评估更具挑战性，需结合内部指标（轮廓系数）和外部指标（ARI、NMI）

## 详细内容

### 聚类算法对比

#### K-Means

最小化簇内误差平方和（WCSS），通过迭代分配和更新质心收敛。K 值选择方法：肘部法则、轮廓系数、Gap Statistic。局限：需预设 K、对初始化敏感（K-Means++ 改进）、仅适合球形簇。

#### 层次聚类

构建树状聚类结构（Dendrogram），分凝聚式（自底向上）和分裂式（自顶向下）。链接准则：单链接、全链接、平均链接、Ward 链接。

#### DBSCAN

基于密度连接性定义簇，无需预设簇数量。关键参数：$\epsilon$（邻域半径）和 MinPts。可发现任意形状簇、自动标记噪声点，但高维数据易失效。

#### 高斯混合模型（GMM）

概率视角的聚类，假设数据由多个高斯分布混合生成，使用 EM 算法求解。提供软分配（概率），K-Means 是 GMM 的特殊退化情况。

**聚类算法对比**：

| 特性 | K-Means | DBSCAN | GMM |
|------|---------|--------|-----|
| 簇形状 | 球形 | 任意 | 椭圆 |
| 簇数量 | 需预设 | 自动确定 | 需预设 |
| 分配方式 | 硬分配 | 硬分配 | 软分配 |
| 异常值处理 | 强制分配 | 标记噪声 | 概率输出 |

### 降维技术

#### PCA（主成分分析）

寻找数据方差最大的正交方向。步骤：数据中心化 → 计算协方差矩阵 → 特征分解 → 选择前 k 个主成分。选择标准：累积方差解释率 ≥ 85%-95%。局限：线性变换、对异常值敏感。

#### t-SNE

保持高维空间中的邻域结构，仅用于可视化（2D/3D），不能用于训练特征。关键参数：Perplexity（5-50）。重要提示：簇间距离无意义，全局结构可能失真。

#### UMAP

基于黎曼几何，保留局部和全局结构。相比 t-SNE：速度更快、全局结构保留更好、支持新数据转换（transform）。

**降维方法对比**：

| 特性 | PCA | t-SNE | UMAP |
|------|-----|-------|------|
| 线性性 | 线性 | 非线性 | 非线性 |
| 可逆性 | 可逆 | 不可逆 | 支持转换 |
| 用途 | 特征提取/压缩 | 可视化 | 可视化/特征 |
| 速度 | 快 | 慢 | 快 |

### 聚类评估指标

- **内部评估**（无需标签）：轮廓系数、Calinski-Harabasz 指数、Davies-Bouldin 指数
- **外部评估**（有标签验证）：调整兰德指数（ARI）、归一化互信息（NMI）

## 开放问题

- 聚类结果的可解释性如何与业务需求对齐？ ^[ambiguous]
- 高维稀疏数据（如基因数据）的最佳聚类策略
- UMAP 在多大程度上可以替代 PCA 用于下游特征提取？ ^[inferred]

## 来源

- _references/unsupervised-learning-reference
- _concepts/supervised-learning
- _concepts/feature-engineering
- _concepts/anomaly-detection

## Related

- [[02_Machine_Learning/Ensemble_Learning/Ensemble_Learning]] — 集成学习 (Ensemble Learning) - 完全指南 (共享: ml, unsupervised)
- [[02_Machine_Learning/Feature_Engineering/Feature_Engineering]] — 特征工程 (Feature Engineering) (共享: ml, unsupervised)
- [[02_Machine_Learning/Feature_Engineering/Feature_Engineering_for_dummy]] — 特征工程 - 小白版 (共享: ml, unsupervised)
- [[02_Machine_Learning/ML-in-nutshell]] — 机器学习速成指南 (共享: ml, unsupervised)
- [[_concepts/time-series-analysis.md|time-series-analysis]]
- [[_concepts/automl.md|automl]]
- [[_concepts/ensemble-learning.md|ensemble-learning]]
