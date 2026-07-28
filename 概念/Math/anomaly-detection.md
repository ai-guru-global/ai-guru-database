---
title: 异常检测
category: -concepts
tags: ["machine-learning", "anomaly-detection", "outlier-detection", "isolation-forest", "autoencoder", "one-class-svm"]
aliases: [Anomaly object-detection, 离群点检测, 异常检测]
relationships:
  - target: "[[概念/unsupervised-learning]]"
    type: related_to
  - target: "概念/supervised-learning"
    type: related_to
  - target: "概念/time-series-analysis"
    type: related_to
sources: [02_Machine_unsupervised-learning/Anomaly_Detection/Anomaly_Detection.md]
summary: 识别数据中"与众不同"的模式，广泛应用于欺诈检测、入侵检测、故障预警等场景。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
name_zh: "异常检测"
---

# 异常检测

> 中文简称：异常检测

异常检测（Anomaly Detection）也称离群点检测，目标是从数据中识别与大多数数据显著不同的样本。通常无标签或极少标签，属于无监督学习范畴。核心挑战包括：定义"异常"、标注缺失、极度不平衡（异常样本极少）、异常模式演化、误报与漏报成本权衡。

## 核心要点

- 三种异常类型：点异常、上下文异常（依赖情境）、集体异常（一组数据的组合异常）
- 统计方法（Z-Score、IQR）简单但假设分布；距离/密度方法（KNN、LOF）更通用
- 孤立森林基于"异常点更容易被孤立"的思想，线性复杂度，是首选方法
- One-Class SVM 适合小数据集，用核函数映射到高维空间
- 自编码器通过重建误差检测异常，适合高维数据和深度学习场景
- 评估指标不能使用准确率，应使用 AUROC、AUPRC、F1、Precision@k

## 详细内容

### 异常类型

| 类型 | 粒度 | 检测难度 | 典型场景 |
|------|------|----------|----------|
| 点异常 | 单个样本 | 低 | 传感器故障值 |
| 上下文异常 | 样本 + 上下文 | 中 | 冬天 35°C、凌晨 CPU 90% |
| 集体异常 | 一组样本 | 高 | DDoS 攻击、心电异常节律 |

### 统计方法

| 方法 | 假设 | 鲁棒性 | 适用场景 |
|------|------|--------|----------|
| Z-Score | 正态分布 | 低 | 大样本、近似正态 |
| Modified Z-Score | 对称分布 | 高 | 有极端值的数据 |
| IQR | 无分布假设 | 中 | 任意分布 |
| Grubbs | 正态分布 | 低 | 小样本、单变量 |

### 孤立森林（Isolation Forest）

核心思想：异常点少且不同 → 需要更少的随机划分次数就能孤立。异常分数 $s(x) = 2^{-E(h(x))/c(n)}$，s ≈ 1 为异常，s ≈ 0.5 为正常。

优势：线性复杂度 $O(n)$、无需距离计算、对高维数据有效。是初次尝试的首选方法。

### One-Class supervised-learning

在特征空间中找到包含正常数据的超平面/超球体，边界外为异常。适合小数据集（训练慢 $O(n^2)$~$O(n^3)$），高维数据需调参。

**对比**：

| 特性 | One-Class SVM | Isolation Forest |
|------|---------------|------------------|
| 训练速度 | 慢 | 快 |
| 大数据集 | 不适合 | 适合 |
| 小数据集 | 适合 | 一般 |
| 可扩展性 | 差 | 好 |

### 自编码器方法

通过"压缩再重建"学习正常数据模式。异常数据重建误差大。架构：编码器 → 潜在表示（低维）→ 解码器 → 重建输出。变分自编码器（VAE）提供概率框架。

优势：适合高维数据、可学习复杂非线性模式。劣势：需要足够正常数据训练、超参数敏感。

### LOF（局部离群因子）

考虑局部密度比，能处理密度不均匀的数据。LOF ≈ 1 为正常，LOF >> 1 为异常。比 KNN-based 方法更适合密度不均匀场景。

### 时间序列异常检测

与时间序列分析密切相关：
- **STL 分解**：去除趋势和季节性后对残差检测
- **Prophet**：利用预测区间检测超出范围的点
- **动态阈值**：基于移动平均/标准差，随趋势和季节性调整

### 方法选择指南

| 场景 | 推荐方法 | 理由 |
|------|----------|------|
| 初次尝试 | Isolation Forest | 快速、效果好、易用 |
| 密度不均匀 | LOF | 考虑局部密度 |
| 小数据集 | One-Class SVM | 小样本表现好 |
| 高维数据 | Isolation Forest / AutoEncoder | 不受维度影响 |
| 时间序列 | STL + LSTM-AE | 捕捉时序依赖 |
| 最高精度 | 多方法集成 | 综合优势 |

### 评估方法

由于极度不平衡（正常 99%+），准确率无意义。核心指标：
- **AUROC**：整体评估
- **AUPRC**：极度不平衡时更合适
- **Precision@k**：排序类任务
- **F1-Score**：平衡精确率和召回率

## 开放问题

- 无标签场景下如何系统性评估异常检测器？ ^[ambiguous]
- 对抗性异常（异常模式随检测器演化）如何应对？
- 集成多种异常检测方法的最优策略是什么？ ^[inferred]

## 来源

- 参考/anomaly-detection-reference
- 概念/unsupervised-learning
- 概念/time-series-analysis

## Related

- [[概念/Math/supervised-learning.md|supervised-learning]]
- [[概念/Math/unsupervised-learning.md|unsupervised-learning]]
- [[02_机器学习/08_Anomaly_Detection/Anomaly_Detection.md|Anomaly_Detection]]
- [[02_机器学习/08_Anomaly_Detection/Anomaly_Detection_for_dummy.md|Anomaly_Detection_for_dummy]]
- [[02_机器学习/11_AutoML/AutoML.md|AutoML]]
- [[治理/anomaly-detection-automl|异常检测 × AutoML]] — 自动化异常发现的交叉合成

---

## 2026 异常检测生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Isolation Forest** | 孤立森林，高效异常检测 | GA |
| **Autoencoder** | 自编码器异常检测 | GA |
| **LOF** | 局部离群因子 | GA |
| **PyOD** | Python 异常检测库 | GA |
| **时序异常** | Prophet/ARIMA 时序异常 | GA |

## 生产最佳实践

1. **无监督优先**：异常检测优先用无监督方法
2. **多方法融合**：多种异常检测方法融合
3. **阈值调优**：根据业务调优异常阈值
4. **实时监控**：生产数据实时异常检测
5. **与可观测性配合**：异常检测 + 可观测性监控

## 2026 异常检测生态

| 方法 | 类型 | 适用 | 状态 |
|------|------|------|------|
| **Isolation Forest** | 隔离 | 高维数据 | GA |
| **LOF** | 密度 | 局部异常 | GA |
| **Autoencoder** | 重建 | 复杂模式 | GA |
| **DBSCAN** | 聚类 | 密度异常 | GA |
| **One-Class SVM** | 边界 | 单类分类 | GA |
| **Transformer AD** | 注意力 | 时序异常 | GA |

## 异常检测架构

```
异常检测方法分类:
├── 统计方法: Z-Score / IQR / Grubbs
├── 距离方法: KNN / LOF
├── 密度方法: DBSCAN / LOF
├── 隔离方法: Isolation Forest
├── 重建方法: Autoencoder / VAE
├── 分类方法: One-Class SVM
└── 深度方法: Transformer / GAN
```

## 异常检测代码示例

```python
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
import numpy as np

# Isolation Forest
iso_forest = IsolationForest(contamination=0.1, random_state=42)
predictions = iso_forest.fit_predict(X)
anomalies = X[predictions == -1]

# Local Outlier Factor
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.1)
labels = lof.fit_predict(X)
scores = lof.negative_outlier_factor_
```

## 延伸阅读

- [[概念/Math/unsupervised-learning|无监督学习]] — 无监督基础
- [[概念/Math/time-series-analysis|时序分析]] — 时序异常
- [[概念/Math/feature-engineering|特征工程]] — 特征设计
- [[概念/MLOps/observability|监控]] — 生产监控

> ℹ️ 异常检测是数据质量和安全的关键，无监督方法最常用。
