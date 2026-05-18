# 02 经典机器学习 (Classical Machine Learning)

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
| 监督学习 (Supervised Learning) | 入门 | 分类、回归、集成学习（XGBoost/LightGBM），掌握有标签数据建模 | [Supervised_Learning.md](./Supervised_Learning/Supervised_Learning.md) |
| 特征工程 (Feature Engineering) | 进阶 | 特征选择、特征构造、特征编码，提升模型性能的关键技能 | [Feature_Engineering/](./Feature_Engineering/) |
| 无监督学习 (Unsupervised Learning) | 进阶 | 聚类（K-Means/DBSCAN）、降维（PCA/t-SNE），挖掘无标签数据 | [Unsupervised_Learning.md](./Unsupervised_Learning/Unsupervised_Learning.md) |

### 进阶主题

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 集成学习 (Ensemble Learning) | 进阶 | Bagging/Boosting/Stacking，XGBoost/LightGBM/CatBoost 全面对比 | [Ensemble_Learning.md](./Ensemble_Learning/Ensemble_Learning.md) |
| 时间序列 (Time Series) | 进阶 | ARIMA/Prophet/Transformer 时序方法，预测未来趋势 | [Time_Series_Analysis.md](./Time_Series/Time_Series_Analysis.md) |
| 异常检测 (Anomaly Detection) | 进阶 | Isolation Forest/AutoEncoder/统计方法，发现数据中的异常 | [Anomaly_Detection.md](./Anomaly_Detection/Anomaly_Detection.md) |
| 推荐系统 (Recommendation Systems) | 进阶 | 协同过滤/矩阵分解/深度推荐，淘宝/Netflix 核心技术 | [Recommendation_Systems.md](./Recommendation_Systems/Recommendation_Systems.md) |
| AutoML | 进阶 | 自动化模型选择与调参，Optuna/Ray Tune/FLAML 实战 | [AutoML.md](./AutoML/AutoML.md) |

### 小白版 (for Dummy)

| 主题 | 文档链接 |
|------|---------|
| 集成学习入门 | [Ensemble_Learning_for_dummy.md](./Ensemble_Learning/Ensemble_Learning_for_dummy.md) |
| 时间序列入门 | [Time_Series_for_dummy.md](./Time_Series/Time_Series_for_dummy.md) |
| 异常检测入门 | [Anomaly_Detection_for_dummy.md](./Anomaly_Detection/Anomaly_Detection_for_dummy.md) |
| 推荐系统入门 | [Recommendation_Systems_for_dummy.md](./Recommendation_Systems/Recommendation_Systems_for_dummy.md) |
| AutoML入门 | [AutoML_for_dummy.md](./AutoML/AutoML_for_dummy.md) |

## 前置知识 (Prerequisites)

- **必修**: [线性代数](../01_Fundamentals/Linear_Algebra/Linear_Algebra.md)、[概率统计](../01_Fundamentals/Probability_Statistics/Probability_Statistics.md)
- **推荐**: Python 数据分析库（Pandas、Scikit-learn）
- **可选**: [数据结构与算法](../01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms.md)（理解树模型）

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
