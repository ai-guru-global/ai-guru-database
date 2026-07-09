---
title: 监督学习
category: -concepts
tags: ["machine-learning", "supervised", "classification", "regression", "svm", "decision-tree", "xgboost"]
aliases: [Supervised unsupervised-learning, 有监督学习]
relationships:
  - target: "[[_concepts/unsupervised-learning]]"
    type: related_to
  - target: "_concepts/feature-engineering"
    type: related_to
  - target: "_concepts/ensemble-learning"
    type: related_to
  - target: "_concepts/automl"
    type: related_to
sources: [机器学习/Supervised_Learning/Supervised_Learning.md]
summary: 利用标注数据学习输入到输出的映射，分为分类和回归两大任务，是机器学习核心范式。
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

# 监督学习

监督学习是机器学习的核心范式，利用已知标签的训练数据学习映射函数 $f: X \rightarrow Y$。核心挑战在于泛化能力——在未见数据上保持性能。与无监督学习不同，监督学习需要高质量标注数据驱动。

## 核心要点

- 两大任务类型：**分类**（离散输出，如垃圾邮件判别）和**回归**（连续输出，如房价预测）
- 核心算法包括线性回归、逻辑回归、SVM、决策树及集成学习方法
- 偏差-方差权衡是模型调优的核心：$\text{Error} = \text{Bias}^2 + \text{Variance} + \text{Noise}$
- 正则化（L1/L2/ElasticNet）是防止过拟合的关键手段
- 特征工程决定了模型性能上限，算法只是逼近这个上限 ^[inferred]
- 交叉验证（K-Fold、LOOCV、分层K折）是可靠的模型评估方法

## 详细内容

### 线性与逻辑回归

线性回归使用均方误差（MSE）作为损失函数，可通过闭式解或梯度下降优化。逻辑回归通过 Sigmoid 函数将输出映射到概率，使用交叉熵损失。Softmax 回归是其多分类扩展。

### 支持向量机（SVM）

SVM 寻找最大间隔超平面，核技巧（线性核、多项式核、RBF 核、Sigmoid 核）使其能处理非线性问题，无需显式计算高维映射。优势在于小样本、非线性场景表现好。

**常用核函数对比**：

| 核函数 | 适用场景 |
|--------|----------|
| 线性核 | 高维稀疏数据（文本分类） |
| 多项式核 | 需要特征交互的任务 |
| RBF 高斯核 | 通用场景，边界复杂 |
| Sigmoid 核 | 模拟神经网络 |

### 决策树

通过递归划分特征空间构建树结构。分裂标准包括信息增益（ID3/C4.5）和基尼不纯度（CART）。优势是可解释性强、无需特征归一化；劣势是易过拟合、对噪声敏感。

### 偏差-方差权衡

| 问题 | 特征 | 解决方法 |
|------|------|----------|
| 欠拟合 | 训练/验证误差都高 | 增加模型复杂度，添加特征 |
| 过拟合 | 训练误差低，验证误差高 | 增加数据，正则化，简化模型 |
| 适中拟合 | 训练/验证误差都低且接近 | 理想状态 |

### 正则化

- **L1（Lasso）**：产生稀疏解，适用于特征选择
- **L2（Ridge）**：权重平滑，处理多重共线性
- **Elastic Net**：L1 + L2 组合

### 样本不平衡处理

正负样本比例悬殊时（如欺诈检测 1:1000），解决方案包括：
1. 数据层面：过采样（SMOTE）、欠采样（Tomek Links）
2. 算法层面：类别权重调整、代价敏感学习
3. 评估层面：使用 Precision/Recall/F1/AUC，PR 曲线比 ROC 更合适

### 常见陷阱

1. **数据泄露**：在全量数据上做归一化再划分 → 应先划分再 fit/transform
2. **过度调参**：反复在验证集上调参导致验证集不再"干净" → 使用嵌套交叉验证
3. **忽略业务约束**：如信用评分模型必须可解释

## 开放问题

- 深度学习与经典监督学习的边界在表格数据场景下如何划定？
- 小样本学习（Few-shot Learning）能否有效降低标注成本？ ^[ambiguous]
- 自监督预训练对传统监督学习范式的冲击程度

## 来源

- _references/supervised-learning-reference
- _concepts/unsupervised-learning
- _concepts/feature-engineering
- _concepts/ensemble-learning

## Related

- [[机器学习/Ensemble_Learning/Ensemble_Learning]] — 集成学习 (Ensemble Learning) - 完全指南 (共享: ml, supervised)
- [[机器学习/Feature_Engineering/Feature_Engineering]] — 特征工程 (Feature Engineering) (共享: ml, supervised)
- [[机器学习/Feature_Engineering/Feature_Engineering_for_dummy]] — 特征工程 - 小白版 (共享: ml, supervised)
- [[机器学习/ML-in-nutshell]] — 机器学习速成指南 (共享: ml, supervised)
- [[_concepts/recommendation-systems.md|recommendation-systems]]
- [[_concepts/anomaly-detection.md|anomaly-detection]]
