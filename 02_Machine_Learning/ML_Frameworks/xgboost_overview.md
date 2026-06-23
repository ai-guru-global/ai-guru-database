---
title: "XGBoost 概览"
category: "02-machine-learning-ml-frameworks"
tags: ["machine-learning", "framework", "gradient-boosting", "xgboost", "gbdt"]
summary: "高性能梯度提升决策树（GBDT）框架，Kaggle 结构化数据竞赛常胜军，支持分布式训练与 GPU 加速，表格数据的事实标准。"
sources:
  - "https://xgboost.ai/"
created: 2026-06-12
updated: 2026-06-23
lifecycle: reviewed
---

# XGBoost 概览

> **一句话理解**: 高性能梯度提升决策树（GBDT）框架，Kaggle 结构化数据竞赛常胜军，支持分布式训练与 GPU 加速，表格数据的事实标准。

## 简介

XGBoost（eXtreme Gradient Boosting）于 2014 年由陈天奇发布，是梯度提升决策树的高效实现。它在 2010 年代中后期的 Kaggle 竞赛中横扫表格数据赛道（Higgs Boson、Otto Group 等冠军方案核心），成为结构化/表格数据的**事实标准**。即使在深度学习时代，XGBoost 在中小规模表格数据上仍常优于神经网络（精度高、训练快、可解释）。

**官网**: [xgboost.ai](https://xgboost.ai/) · **最新版本**: XGBoost 2.1（2026）

## 核心特性

| 特性 | 说明 |
|------|------|
| **梯度提升** | 串行训练弱学习器（决策树），每棵修正前一棵的残差 |
| **二阶优化** | 使用损失函数的一阶+二阶导数（Hessian），收敛更快 |
| **正则化** | 内置 L1/L2 正则 + 树复杂度惩罚，防过拟合 |
| **缺失值处理** | 自动学习缺失值的默认分裂方向，无需预处理填充 |
| **GPU 加速** | `tree_method=gpu_hist`，GPU 训练快 10-50× |
| **分布式训练** | 原生支持 Spark/Dask/Flink 分布式 |
| **特征重要性** | 提供 gain/weight/cover/shap 多种重要性指标 |
| **早停** | `early_stopping_rounds`，验证集无提升时自动停止 |

## 典型用法

```python
import xgboost as xgb
from sklearn.model_selection import train_test_split

# 准备数据（XGBoost 自动处理缺失值）
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 训练（GPU 加速 + 早停）
model = xgb.XGBClassifier(
    n_estimators=1000,
    max_depth=6,
    learning_rate=0.1,
    tree_method='gpu_hist',        # GPU 加速
    subsample=0.8,
    colsample_bytree=0.8,
    early_stopping_rounds=50,      # 早停
    eval_metric='auc',
)
model.fit(X_train, y_train,
          eval_set=[(X_test, y_test)],
          verbose=False)

# 特征重要性（SHAP 值）
import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
```

## 与其他 GBDT 框架对比

| 框架 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **XGBoost** | 精度高、生态成熟、GPU | 大数据速度不如 LightGBM | 中等数据、精度优先 |
| **LightGBM** | 速度快、内存低（Leaf-wise） | 小数据易过拟合 | 大规模数据、速度优先 |
| **CatBoost** | 类别特征原生支持（免编码） | 训练较慢 | 高基数类别特征 |
| **Scikit-learn GBM** | 集成方便、纯 Python | 速度慢、无 GPU | 入门学习 |

**经验法则**：
- 数据量 < 10 万行 → XGBoost（精度优先）
- 数据量 > 100 万行 → LightGBM（速度优先）
- 类别特征多 → CatBoost（免 Target Encoding）

## 适用场景

- **首选 XGBoost**：Kaggle 竞赛、表格/结构化数据、CTR 预估、风控评分卡
- **首选 LightGBM**：超大规模数据（亿级行）、低延迟在线推理
- **考虑神经网络**：图像/文本/序列（非结构化数据）

## Related

- [[02_Machine_Learning/README|机器学习]] — 章节主页
- [[08_Model_Evaluation/README|模型评估]] — GBDT 的评估指标（AUC/F1）
- [[07_Model_Training/README|模型训练]] — 超参数调优实践
- [[02_Machine_Learning/Feature_Engineering|特征工程]] — XGBoost 配套的特征处理
