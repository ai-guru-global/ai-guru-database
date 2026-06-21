---
title: "ApacheCN 机器学习（机器学习实战）主线"
category: "02-machine-learning"
tags: ["apachecn", "ailearning", "machine-learning", "machine-learning-in-action", "supervised-learning", "unsupervised-learning"]
summary: "ApacheCN 机器学习实战主线概览：docs/ml/ 下 16 章，覆盖 KNN、决策树、SVM、集成方法、聚类、关联规则、PCA/SVD 与推荐系统。"
created: "2026-06-12"
updated: "2026-06-12"
sources:
  - "https://github.com/apachecn/ailearning/tree/master/docs/ml"
  - "_raw/github-sources/ailearning/docs/ml"
provenance: |
  基于 ApacheCN AiLearning 仓库 docs/ml/ 目录的 1.md（机器学习基础）与 2.md（KNN）
  以及 SUMMARY.md 章节目录整理而成。
base_confidence: "high"
lifecycle: "draft"
tier: "supporting"
---

# ApacheCN 机器学习（机器学习实战）主线

> `docs/ml/` 基于《Machine Learning in Action》（《机器学习实战》），共 **16 章** 笔记与配套代码，用 Python 2.7/3.6 实现经典算法，覆盖分类、回归、聚类、频繁项集、降维与推荐系统。

## 章节映射

| 章 | 主题 | 算法/技术 |
|----|------|-----------|
| 1 | 机器学习基础 | ML 概述、监督/无监督/强化学习、术语与流程 |
| 2 | k-近邻算法 | KNN 分类、距离度量、归一化 |
| 3 | 决策树 | ID3/C4.5、信息增益、树剪枝 |
| 4 | 朴素贝叶斯 | 条件概率、文本分类 |
| 5 | Logistic 回归 | sigmoid、梯度上升/下降 |
| 6 | SVM 支持向量机 | 核函数、SMO |
| 7 | 集成方法 | 随机森林、AdaBoost |
| 8 | 回归 | 线性回归、局部加权回归 |
| 9 | 树回归 | CART、回归树、模型树 |
| 10 | K-Means 聚类 | 聚类、SSE、二分 K-Means |
| 11 | Apriori 算法 | 频繁项集、关联规则 |
| 12 | FP-growth 算法 | 高效频繁项集挖掘 |
| 13 | PCA 降维 | 主成分分析 |
| 14 | SVD 简化数据 | 奇异值分解、推荐系统初步 |
| 15 | 大数据与 MapReduce | 分布式计算基础 |
| 16 | 推荐系统 | 协同过滤（已迁移至独立仓库） |

## 代表章节示例

- **第 1 章**：系统梳理 ML 任务类型、开发流程、训练/验证/测试集划分、过拟合与欠拟合、精确率/召回率/F 值。
- **第 2 章 KNN**：以约会网站配对与手写数字识别为例，讲解 KNN 原理、归一化、KD-Tree/Ball-Tree 复杂度。

## 与本库关联

- 本库机器学习总览 → [[02_Machine_Learning/README]]
- 速成指南 → [[02_Machine_Learning/ML-in-nutshell]]
- 监督学习 → [[02_Machine_Learning/Supervised_Learning/Supervised_Learning]]
- 集成学习 → [[02_Machine_Learning/Ensemble_Learning/Ensemble_Learning]]
- 无监督学习 → [[02_Machine_Learning/Unsupervised_Learning/Unsupervised_Learning]]
- 特征工程 → [[02_Machine_Learning/Feature_Engineering/Feature_Engineering]]
- 推荐系统 → [[02_Machine_Learning/Recommendation_Systems/Recommendation_Systems]]

## 参考

- 仓库主线入口：`_raw/github-sources/ailearning/docs/ml/`
- 上级指南：[[90_Learn/courses/apachecn/ailearning_guide]]
- 引用索引：[[_references/apachecn-ailearning]]
