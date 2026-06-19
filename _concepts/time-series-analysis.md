---
title: 时间序列分析
category: concepts
tags: ["machine-learning", "time-series", "arima", "forecasting", "seasonality", "prophet", "sarima"]
aliases: [Time Series Analysis, 时序分析, 时间序列预测]
relationships:
  - target: "[[concepts/supervised-learning]]"
    type: related_to
  - target: "concepts/feature-engineering"
    type: related_to
  - target: "concepts/anomaly-detection"
    type: related_to
sources: [02_Machine_unsupervised-learning/Time_Series/Time_Series_Analysis.md]
summary: 分析按时间排列的数据序列，捕捉趋势、季节性和周期模式，用于预测未来值。
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

# 时间序列分析

时间序列是按时间顺序排列的数据序列，与传统机器学习不同，样本之间存在**时间依赖关系**，不能假设独立同分布。核心关注时间模式、趋势和周期，广泛应用于销售预测、金融分析、设备监控等领域。时间序列数据需要专门的特征工程方法（滞后特征、滑动窗口统计）。

## 核心要点

- 时间序列分解为三大成分：趋势（Trend）、季节性（Seasonality）、残差（Residual）
- 平稳性是 ARIMA 建模的前提，需通过 ADF/KPSS 检验验证
- ARIMA(p,d,q) 由自回归（AR）、差分（I）、移动平均（MA）组成
- SARIMA 在 ARIMA 基础上增加季节性参数
- Prophet（Facebook）处理多季节性和节假日效应，简单好用
- 不能使用标准 K 折交叉验证，必须用滚动/扩展窗口验证
- 评估指标：MAE、RMSE、MAPE、SMAPE、MASE

## 详细内容

### 时间序列分解

$$y_t = T_t + S_t + R_t \quad \text{(加法模型)}$$
$$y_t = T_t \times S_t \times R_t \quad \text{(乘法模型)}$$

- **趋势**：长期变化方向（如股价上涨）
- **季节性**：周期性变化（如冰淇淋销量季节波动）
- **残差**：去除趋势和季节性后的噪声

STL 分解比经典分解更灵活，支持鲁棒拟合。

### 平稳性

弱平稳条件：均值恒定、方差恒定、自协方差只与时间差有关。平稳化方法：差分、对数变换+差分、去趋势。

ADF 与 KPSS 联合判断：ADF 原假设为非平稳，KPSS 原假设为平稳，两者互补使用。

### ARIMA 模型

ARIMA(p,d,q) 参数选择：
- **d**（差分阶数）：通过 ADF 检验确定
- **p**（AR 阶数）：通过 PACF 截尾点确定
- **q**（MA 阶数）：通过 ACF 截尾点确定

| 模式 | ACF | PACF | 模型 |
|------|-----|------|------|
| AR(p) | 拖尾 | p 阶截尾 | ARIMA(p,d,0) |
| MA(q) | q 阶截尾 | 拖尾 | ARIMA(0,d,q) |
| ARMA | 拖尾 | 拖尾 | ARIMA(p,d,q) |

Auto-ARIMA（pmdarima 库）可自动搜索最优参数。

### SARIMA

SARIMA(p,d,q)(P,D,Q,s) 在 ARIMA 基础上增加季节性成分，s 为季节周期（月度 s=12，季度 s=4）。

### 指数平滑

| 方法 | 适用场景 |
|------|---------|
| 简单指数平滑 | 无趋势无季节性 |
| Holt 线性趋势 | 有趋势无季节性 |
| Holt-Winters | 有趋势有季节性 |

### Prophet

Facebook 开发的可加模型：$y(t) = g(t) + s(t) + h(t) + \epsilon_t$

- $g(t)$：趋势项（分段线性或逻辑增长）
- $s(t)$：季节性项（傅里叶级数）
- $h(t)$：节假日效应

关键参数：`changepoint_prior_scale`（趋势灵活度）、`seasonality_prior_scale`（季节性强度）。

### 深度学习方法

| 模型 | 特点 |
|------|------|
| NeuralProphet | Prophet + AR-Net，更强表达力 |
| TFT | 多变量支持，变量选择网络，概率预测 |
| PatchTST | 将时间序列分割成 Patch，Transformer 处理 |

框架推荐：Darts（统一接口）、Nixtla/NeuralForecast（SOTA）、PyTorch Forecasting。

### 时间序列交叉验证

标准 K 折会随机打乱导致**未来数据泄露**。正确做法：
- **滚动窗口验证**：固定窗口大小向前滚动
- **扩展窗口验证**：训练集逐渐扩大

### 评估指标

| 指标 | 特点 |
|------|------|
| MAE | 直观，对异常值不敏感 |
| RMSE | 惩罚大误差 |
| MAPE | 百分比误差 |
| MASE | 与朴素基线比较，<1 表示优于基线 |

## 开放问题

- transformer-architecture 在长序列时间序列预测中是否全面优于传统方法？ ^[ambiguous]
- 多变量时间序列中变量选择的自动化方法
- 概率预测（预测区间）在实际业务中的校准问题 ^[inferred]

## 来源

- references/time-series-reference
- concepts/supervised-learning
- concepts/feature-engineering
- concepts/anomaly-detection

## Related

- [[concepts/supervised-learning.md|supervised-learning]]
- [[concepts/unsupervised-learning.md|unsupervised-learning]]
- [[02_Machine_Learning/Anomaly_Detection/Anomaly_Detection.md|Anomaly_Detection]]
- [[02_Machine_Learning/Anomaly_Detection/Anomaly_Detection_for_dummy.md|Anomaly_Detection_for_dummy]]
- [[02_Machine_Learning/AutoML/AutoML.md|AutoML]]
