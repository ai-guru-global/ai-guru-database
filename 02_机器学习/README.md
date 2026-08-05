---
title: 02 经典机器学习 (Classical Machine Learning)
category: 02-machine-learning
tags: ["machine-learning", "supervised", "unsupervised"]
summary: "本章介绍深度学习之前的主流机器学习方法，包括监督学习（分类/回归/集成）、无监督学习（聚类/降维）和特征工程。这些技术至今仍在工业界广泛应用，是理解 AI 建模思路的重要基础。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

name_zh: "02 经典机器学习"
---
# 02 经典机器学习 (Classical Machine Learning)

> 中文简称：02 经典机器学习

本章介绍深度学习之前的主流机器学习方法，包括监督学习（分类/回归/集成）、无监督学习（聚类/降维）和特征工程。这些技术至今仍在工业界广泛应用，是理解 AI 建模思路的重要基础。

## 学习路径 (Learning Path)

```
    ┌────────────────────┐
    │  监督学习           │
    │  Supervised        │
    │  Learning          │
    └──────────┬─────────┘
               │
               ▼
    ┌────────────────────┐
    │  特征工程           │
    │  Feature           │
    │  Engineering       │
    └──────────┬─────────┘
               │
               ▼
    ┌────────────────────┐
    │  无监督学习          │
    │  Unsupervised      │
    │  Learning          │
    └────────────────────┘
```

## 内容索引 (Content Index)

### 基础方法

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 监督学习 (Supervised Learning) | 入门 | 分类、回归、集成学习（XGBoost/LightGBM），掌握有标签数据建模 | [03_监督学习.md](./02_监督学习/03_监督学习.md) |
| 特征工程 (Feature Engineering) | 进阶 | 特征选择、特征构造、特征编码，提升模型性能的关键技能 | [Feature_Engineering/](./05_特征工程/) |
| 无监督学习 (Unsupervised Learning) | 进阶 | 聚类（K-Means/DBSCAN）、降维（PCA/t-SNE），挖掘无标签数据 | [02_无监督学习.md](./03_无监督学习/02_无监督学习.md) |
| **经典算法速查表** | **入门** | **12 个经典 ML 算法对比，用类比建立算法选择直觉** | **[06_ML_Algorithms_速查表.md](02_机器学习/01_机器学习基础/06_ML_Algorithms_速查表.md)** |

### 进阶主题

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 集成学习 (Ensemble Learning) | 进阶 | Bagging/Boosting/Stacking，XGBoost/LightGBM/CatBoost 全面对比 | [01_集成学习.md](./04_集成学习/01_集成学习.md) |
| 时间序列 (Time Series) | 进阶 | ARIMA/Prophet/Transformer 时序方法，预测未来趋势 | [02_时间序列_分析.md](./09_时间序列/02_时间序列_分析.md) |
| 异常检测 (Anomaly Detection) | 进阶 | Isolation Forest/AutoEncoder/统计方法，发现数据中的异常 | [01_异常检测.md](./08_异常检测/01_异常检测.md) |
| 推荐系统 (Recommendation Systems) | 进阶 | 协同过滤/矩阵分解/深度推荐，淘宝/Netflix 核心技术 | [02_推荐系统.md](./10_推荐系统/02_推荐系统.md) |
| AutoML | 进阶 | 自动化模型选择与调参，Optuna/Ray Tune/FLAML 实战 | [01_AutoML.md](./11_自动机器学习/01_AutoML.md) |

### 小白版 (for Dummy)

| 主题 | 文档链接 |
|------|---------|
| 集成学习入门 | [Ensemble_Learning_for_dummy.md](./04_集成学习/Ensemble_Learning_for_dummy.md) |
| 时间序列入门 | [Time_Series_for_dummy.md](./09_时间序列/Time_Series_for_dummy.md) |
| 异常检测入门 | [Anomaly_Detection_for_dummy.md](./08_异常检测/Anomaly_Detection_for_dummy.md) |
| 推荐系统入门 | [Recommendation_Systems_for_dummy.md](./10_推荐系统/Recommendation_Systems_for_dummy.md) |
| AutoML 入门 | [AutoML_for_dummy.md](./11_自动机器学习/AutoML_for_dummy.md) |
| **数据预处理入门** | [Data_Preprocessing_for_dummy.md](./05_特征工程/Data_Preprocessing_for_dummy.md) |
| **第一个 ML 模型** | [04_Your_First_ML_模型.md](./02_监督学习/04_Your_First_ML_模型.md) |
| **EDA 快速入门** | [01_EDA_快速入门.md](./02_监督学习/01_EDA_快速入门.md) |

## 前置知识 (Prerequisites)

- **必修**: [线性代数](01_数学基础/02_线性代数/03_线性代数.md)、[概率统计](01_数学基础/03_概率统计/02_概率统计.md)
- **推荐**: Python 数据分析库（Pandas、Scikit-learn）
- **可选**: [数据结构与算法](01_数学基础/07_数据结构与算法/01_Data_Structures_Algorithms.md)（理解树模型）

## 关键术语速查 (Key Terms)

- **过拟合 (Overfitting)**: 模型在训练集上表现好但泛化差，需通过正则化缓解
- **正则化 (Regularization)**: L1/L2 惩罚项，防止模型参数过大导致过拟合
- **交叉验证 (Cross-Validation)**: 数据分割技术，评估模型真实泛化能力
- **集成学习 (Ensemble Learning)**: 组合多个弱模型提升性能（Bagging/Boosting）
- **梯度提升 (Gradient Boosting)**: 顺序训练模型修正前序误差，如 XGBoost/LightGBM
- **特征工程 (Feature Engineering)**: 从原始数据构造有效特征，往往决定模型上限
- **主成分分析 (PCA)**: 线性降维方法，提取数据主要方差方向
- **t-SNE**: 非线性降维技术，常用于高维数据可视化
- **K-Means**: 经典聚类算法，通过距离划分数据簇
- **DBSCAN**: 基于密度的聚类，可发现任意形状簇并处理噪声

---
*Last updated: 2026-02-10*

## Related
- [[02_机器学习/README|经典机器学习 - 新手导航]]

- [[02_机器学习/04_集成学习/Ensemble_Learning]] — 集成学习 (Ensemble Learning) - 完全指南 (共享: machine-learning, ml, supervised, unsupervised)
- [[02_机器学习/05_特征工程/01_特征工程]] — 特征工程 (Feature Engineering) (共享: machine-learning, ml, supervised, unsupervised)
- [[02_机器学习/05_特征工程/Feature_Engineering_for_dummy]] — 特征工程 - 小白版 (共享: machine-learning, ml, supervised, unsupervised)
- [[02_机器学习/ML-in-nutshell]] — 机器学习速成指南 (共享: machine-learning, ml, supervised, unsupervised)
- [[02_机器学习/08_异常检测/02_anomaly_detection_automl]] — Anomaly_Detection_for_dummy
- [[02_机器学习/08_异常检测/02_anomaly_detection_automl]] — Anomaly_Detection
- [[02_机器学习/10_推荐系统/Recommendation_Systems]] — Recommendation_Systems
- [[02_机器学习/10_推荐系统/Recommendation_Systems_for_dummy]] — Recommendation_Systems_for_dummy
- [[02_机器学习/11_自动机器学习/01_AutoML]] — AutoML
- [[02_机器学习/11_自动机器学习/01_AutoML]] — AutoML_for_dummy
- [[02_机器学习/03_无监督学习/Unsupervised_Learning]] — Unsupervised_Learning
- [[02_机器学习/03_无监督学习/Unsupervised_Learning_for_dummy]] — 无监督学习 - 小白版
- [[02_机器学习/09_时间序列/Time_Series_for_dummy]] — Time_Series_for_dummy
- [[02_机器学习/09_时间序列/Time_Series_Analysis]] — 时间序列分析 (Time Series Analysis) - 完全指南
- [[02_机器学习/02_监督学习/Supervised_Learning_for_dummy]] — Supervised_Learning_for_dummy
- [[02_机器学习/02_监督学习/Supervised_Learning]] — Supervised_Learning
- [[02_机器学习/04_集成学习/Ensemble_Learning_for_dummy]] — Ensemble_Learning_for_dummy
- [[02_机器学习/README|README_for_dummy]]
- [[概念/Math/feature-engineering.md|feature-engineering]]

## 相关页面
- [[02_机器学习/06_贝叶斯方法/Bayesian_Methods_Deep_Dive|贝叶斯方法深度解读: 从贝叶斯定理到概率编程]]
- [[02_机器学习/06_贝叶斯方法/README|贝叶斯方法 (Bayesian Methods)]]
- [[02_机器学习/07_因果推断/Causal_Inference_Deep_Dive|因果推断深度解读: 从相关到因果的 AI 新范式]]
- [[02_机器学习/07_因果推断/README|因果推断 (Causal Inference)]]

- [[概念/recommendation-systems|Recommendation Systems]]

- [[概念/time-series-analysis|Time Series Analysis]]

- [[概念/automl|Automl]]

- [[概念/ensemble-learning|Ensemble Learning]]

- [[概念/anomaly-detection|Anomaly Detection]]

## 相关资源

- [[02_机器学习/12_ML框架/05_scikit_learn_概览|Scikit-learn]]
- [[02_机器学习/12_ML框架/06_xgboost_概览|XGBoost]]
- [[02_机器学习/12_ML框架/03_lightgbm_概览|LightGBM]]
- [[02_机器学习/12_ML框架/01_catboost_概览|CatBoost]]
- [[02_机器学习/01_机器学习基础/05_Kaggle_概览|Kaggle 数据科学竞赛平台概览]]
