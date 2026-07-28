---
title: 集成学习
category: -concepts
tags: ["machine-learning", "ensemble", "bagging", "boosting", "stacking", "random-forest", "xgboost", "lightgbm", "catboost"]
aliases: [Ensemble unsupervised-learning, 集成方法]
relationships:
  - target: "[[概念/supervised-learning]]"
    type: related_to
  - target: "概念/feature-engineering"
    type: related_to
  - target: "概念/automl"
    type: related_to
sources: [02_机器学习/04_Ensemble_Learning/Ensemble_Learning.md]
summary: 组合多个弱学习器构建强学习器，三大范式为Bagging、Boosting和Stacking。
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
name_zh: "集成学习"
---

# 集成学习

> 中文简称：集成学习

集成学习的核心思想：**组合多个弱学习器，构建一个强学习器**。通过偏差-方差分解理解：$\text{MSE} = \text{Bias}^2 + \text{Variance} + \text{Noise}$。三大范式各有侧重——Bagging 降低方差、Boosting 降低偏差、Stacking 整合互补信息。在监督学习的结构化数据场景中，集成方法几乎是最强方案。

## 核心要点

- Bagging（并行训练）降低方差，代表：随机森林
- Boosting（串行训练）降低偏差，代表：supervised-learning、LightGBM、CatBoost
- Stacking（分层组合）通过元学习器整合互补信息
- 随机森林 = Bagging + 特征随机选择，进一步降低模型间相关性
- XGBoost 引入正则化 + 二阶泰勒展开 + 稀疏感知，是竞赛常胜方法
- LightGBM 使用 GOSS + EFB + Leaf-wise 生长策略，训练速度最快
- CatBoost 通过 Ordered Boosting 和 Ordered Target Statistics 处理类别特征

## 详细内容

### 三大范式对比

| 范式 | 核心思想 | 代表算法 | 学习器关系 |
|------|---------|---------|-----------|
| Bagging | 并行训练，降低方差 | Random Forest | 独立并行 |
| Boosting | 串行训练，降低偏差 | XGBoost, LightGBM, CatBoost | 依赖串行 |
| Stacking | 分层组合，元学习 | Stacking, Blending | 层次化 |

### Bagging 与随机森林

Bootstrap 采样（约 63.2% 样本被采到，36.8% 为 OOB 样本）+ 聚合。随机森林在 Bagging 基础上加入特征随机选择（每次分裂仅考虑 $\sqrt{p}$ 个特征），进一步降低模型间相关性。

OOB 样本可作为免费验证集。方差公式：$\text{Var} = \rho\sigma^2 + \frac{1-\rho}{K}\sigma^2$，关键在于降低 $\rho$。

### Boosting 家族

#### XGBoost 核心创新

1. 正则化目标函数：$\Omega(f) = \gamma T + \frac{1}{2}\lambda\|w\|^2$
2. 二阶泰勒展开：更精确的损失近似
3. 分裂增益公式：高效剪枝
4. 稀疏感知：自动学习缺失值的最优分裂方向
5. 系统优化：列块并行、缓存优化、核外计算

#### LightGBM 核心创新

- **GOSS**：保留大梯度样本，随机丢弃小梯度样本
- **EFB**：互斥特征打包降维
- **Leaf-wise** 生长策略（对比 XGBoost 的 Level-wise）：效率更高但易过拟合

#### CatBoost 核心创新

- **Ordered Boosting**：避免目标泄露
- **Ordered Target probability-statistics**：最优类别特征编码
- **Oblivious Trees**：对称树，加速推理

### GBDT 家族对比

| 特性 | XGBoost | LightGBM | CatBoost |
|------|---------|----------|----------|
| 树生长策略 | Level-wise | Leaf-wise | Oblivious Trees |
| 训练速度 | 中等 | 最快 | 较慢 |
| 类别特征 | 需编码 | 原生支持 | 最优 |
| 过拟合风险 | 中 | 较高 | 最低 |
| 默认参数效果 | 中等 | 中等 | 最佳 |

### Stacking 与 Blending

Stacking 使用 K 折交叉验证生成元特征，数据利用更充分、过拟合风险较低。Blending 使用固定验证集，计算简单但数据利用较少。基学习器的预测必须通过交叉验证生成，避免数据泄露。

### 方法选择指南

| 场景 | 推荐方法 | 理由 |
|------|---------|------|
| 快速基线 | Random Forest | 简单鲁棒、无需调参 |
| 结构化数据竞赛 | LightGBM/XGBoost | 精度高、速度快 |
| 大量类别特征 | CatBoost | 自动处理类别特征 |
| 极致精度 | Stacking | 组合多种模型优势 |
| GPU 加速 | XGBoost/LightGBM | 原生 GPU 支持 |

经验法则：从 Random Forest 基线开始，然后尝试 LightGBM/XGBoost 调优，需要更高精度时再考虑 Stacking。^[inferred]

## 开放问题

- Leaf-wise 与 Level-wise 在不同数据规模下的最优选择？ ^[ambiguous]
- 集成方法的理论最优基学习器数量如何确定？
- Stacking 的元学习器选择对最终效果的影响有多大？ ^[inferred]

## 来源

- 参考/ensemble-learning-reference
- 概念/supervised-learning
- 概念/feature-engineering
- 概念/automl

## Related

- [[概念/supervised-learning]] — 监督学习 (共享: ml, xgboost)

---

## 2026 集成学习生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **XGBoost** | 梯度提升树，竞赛常胜 | GA |
| **LightGBM** | 微软轻量级 GBDT | GA |
| **CatBoost** | Yandex 类别特征友好 | GA |
| **Random Forest** | 随机森林，Bagging 代表 | GA |
| **Stacking** | 多层模型堆叠 | GA |

## 生产最佳实践

1. **表格数据首选**：表格数据优先用 XGBoost/LightGBM
2. **特征工程**：集成学习需要特征工程
3. **超参数调优**：用 Optuna 调优超参数
4. **与深度学习对比**：表格数据集成学习常优于深度学习
5. **模型融合**：多模型融合提升效果

## 2026 集成学习生态

| 方法 | 代表 | 特点 | 状态 |
|------|------|------|------|
| **Bagging** | Random Forest | 并行降方差 | GA |
| **Boosting** | XGBoost/LightGBM | 串行降偏差 | GA |
| **Stacking** | 多层融合 | 元学习器 | GA |
| **Voting** | 硬/软投票 | 简单融合 | GA |
| **Snapshot Ensemble** | 单训练多模型 | 高效 | GA |

## 集成学习架构

```
集成学习方法:
1. Bagging (并行):
   数据 → Bootstrap 采样 → 多个基学习器 → 平均/投票

2. Boosting (串行):
   数据 → 学习器1 → 残差 → 学习器2 → ... → 加权求和

3. Stacking (分层):
   数据 → 多个基学习器 → 元学习器 → 最终预测
```

## XGBoost 代码示例

```python
import xgboost as xgb
from sklearn.model_selection import cross_val_score

# 创建 XGBoost 分类器
model = xgb.XGBClassifier(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric='logloss'
)

# 交叉验证
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"Accuracy: {scores.mean():.4f} ± {scores.std():.4f}")

# 训练并预测
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

## 延伸阅读

- [[概念/Math/supervised-learning|有监督学习]] — 有监督学习
- [[概念/Math/feature-engineering|特征工程]] — 特征设计
- [[概念/Math/optimization-regularization|优化与正则化]] — 优化方法
- [[概念/Math/neural-networks|神经网络]] — 深度学习

> ℹ️ 集成学习是表格数据竞赛的霸主，XGBoost/LightGBM 仍是首选。
> 生产环境建议结合交叉验证和早停，防止过拟合。
> 表格数据优先尝试 XGBoost/LightGBM，深度学习不一定更好。
