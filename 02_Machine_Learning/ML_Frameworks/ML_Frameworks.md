---
title: "ML 框架概览 (ML Frameworks)"
category: 02-machine-learning
tags: ["machine-learning", "frameworks", "scikit-learn", "xgboost", "lightgbm"]
summary: "经典机器学习框架的对比与选型——scikit-learn 是通用首选，XGBoost/LightGBM 统治表格数据竞赛。"
created: 2026-06-15
updated: 2026-06-15
---

# ML 框架概览 (ML Frameworks)

> 经典机器学习框架的对比与选型——scikit-learn 是通用首选，XGBoost/LightGBM 统治表格数据竞赛。

---

## 框架对比

| 框架 | 特点 | 适用场景 | 学习曲线 |
|------|------|----------|----------|
| **scikit-learn** | API 统一、文档优秀、覆盖全面 | 通用 ML（分类/回归/聚类） | 低 |
| **XGBoost** | 梯度提升、速度快、精度高 | 表格数据、Kaggle 竞赛 | 中 |
| **LightGBM** | 微软出品、更快更省内存 | 大数据表格场景 | 中 |
| **CatBoost** | Yandex 出品、类别特征原生支持 | 有大量类别特征的数据 | 中 |
| **spaCy** | NLP 工业级工具 | 文本处理、NER | 中 |
| **Statsmodels** | 统计建模、假设检验 | 统计分析、计量经济学 | 高 |

## 选型建议

```
数据类型？
├── 表格数据 → XGBoost / LightGBM (竞赛首选)
├── 通用 ML → scikit-learn (入门首选)
├── 文本数据 → spaCy + scikit-learn
├── 时间序列 → statsmodels / Prophet
└── 不确定？→ scikit-learn + XGBoost
```

## 相关阅读

- [[02_Machine_Learning/Supervised_Learning/Supervised_Learning]] — 监督学习
- [[02_Machine_Learning/Ensemble_Learning/Ensemble_Learning]] — 集成学习
- [[02_Machine_Learning/Feature_Engineering/Feature_Engineering]] — 特征工程
