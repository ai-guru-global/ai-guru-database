---
title: 特征工程 (Feature Engineering)
category: 02-machine-learning-feature-engineering
tags: ["machine-learning", "supervised", "unsupervised"]
summary: "> **一句话理解**: 特征工程就像厨师备料——原始食材（原始数据）需要经过清洗、切割、调味（特征处理）才能做出美味佳肴（高性能模型）。模型的上限由数据和特征决定，算法只是逼近这个上限。"
created: 2026-05-31
updated: 2026-05-31
---

# 特征工程 (Feature Engineering)

> **一句话理解**: 特征工程就像厨师备料——原始食材（原始数据）需要经过清洗、切割、调味（特征处理）才能做出美味佳肴（高性能模型）。模型的上限由数据和特征决定，算法只是逼近这个上限。

## 1. 概述 (Overview)

特征工程 (Feature Engineering) 是将原始数据转换为更有效表示的过程，使机器学习模型能更好地捕捉数据中的模式。在深度学习时代之前，特征工程几乎决定了模型性能的 80%。即便在今天，对于表格数据 (Tabular Data) 和结构化业务场景，特征工程仍然是提升模型效果最直接、最高效的手段。

### 为什么特征工程如此重要？

- **数据质量 > 模型复杂度**: 在 Kaggle 竞赛中，获奖方案的核心差异往往在特征工程而非模型选择
- **可解释性**: 精心构造的特征往往具有业务含义，便于模型解释
- **效率**: 好的特征可以让简单模型（如线性回归）达到复杂模型的效果，降低计算成本
- **泛化能力**: 合理的特征变换能减少过拟合风险

### 在 AI 知识体系中的位置

```
原始数据 → [数据清洗] → [特征工程] → [模型训练] → [模型评估] → 部署
                          ^^^^^^^^^^^
                        你在这里
```

特征工程是连接"数据"和"模型"的关键桥梁，属于机器学习 Pipeline 的核心环节。

---

## 2. 核心概念 (Core Concepts)

### 2.1 数值特征处理 (Numerical Feature Processing)

数值特征是最常见的特征类型，但不同特征的量纲和分布差异巨大，需要标准化处理。

| 方法 | 公式 | 适用场景 | 注意事项 |
|------|------|---------|---------|
| **标准化 (Standardization)** | $z = \frac{x - \mu}{\sigma}$ | 特征近似正态分布；SVM、逻辑回归等对尺度敏感的模型 | 受离群值影响大 |
| **归一化 (Min-Max Normalization)** | $x' = \frac{x - x_{min}}{x_{max} - x_{min}}$ | 需要将值压缩到 [0, 1] 区间；神经网络输入 | 对离群值极其敏感 |
| **鲁棒缩放 (Robust Scaling)** | $x' = \frac{x - Q_2}{Q_3 - Q_1}$ | 数据中存在明显离群值 | 使用中位数和四分位距，抗离群值 |
| **对数变换 (Log Transform)** | $x' = \log(1 + x)$ | 右偏分布（如收入、房价）| 仅适用于非负值 |
| **Box-Cox 变换** | $x' = \frac{x^\lambda - 1}{\lambda}$ | 将任意分布转为近似正态 | 需搜索最优 $\lambda$ |

**初学者提示**: 如果不确定用哪种，先试标准化（StandardScaler）——它是最通用的选择。

### 2.2 类别特征编码 (Categorical Feature Encoding)

类别特征（如性别、城市、颜色）不能直接输入模型，需要编码为数值。

| 编码方法 | 原理 | 适用场景 | 优缺点 |
|---------|------|---------|--------|
| **标签编码 (Label Encoding)** | 将类别映射为整数 0, 1, 2, ... | 有序类别（如：低/中/高）；树模型 | 会引入虚假的顺序关系 |
| **独热编码 (One-Hot Encoding)** | 每个类别创建一个二元列 | 无序类别；类别数较少（<20）| 类别多时维度爆炸 |
| **目标编码 (Target Encoding)** | 用该类别对应目标变量的均值替换 | 高基数类别（如城市、用户ID）| 容易数据泄露，需正则化 |
| **频率编码 (Frequency Encoding)** | 用类别出现的频率替换 | 类别频率本身有意义时 | 不同类别可能频率相同 |
| **嵌入编码 (Embedding)** | 学习低维稠密向量表示 | 超高基数 + 深度学习模型 | 需要足够的训练数据 |

### 2.3 缺失值处理 (Missing Value Handling)

| 策略 | 实现方式 | 适用条件 |
|------|---------|---------|
| **删除** | 删除含缺失值的行或列 | 缺失比例极低（<5%）且随机缺失 |
| **均值/中位数填充** | 用统计量填充 | 数值特征，缺失随机 |
| **众数填充** | 用最频繁值填充 | 类别特征 |
| **插值法** | 线性/样条插值 | 时间序列数据 |
| **模型预测填充** | 用 KNN/随机森林预测缺失值 | 缺失与其他特征有关联 |
| **缺失指示器** | 新增一列标记是否缺失 | 缺失本身可能是有意义的信号 |

---

## 3. 关键技术详解 (Key Techniques)

### 3.1 特征交叉 (Feature Crossing)

特征交叉通过组合两个或多个特征创造新特征，捕捉非线性关系。

**典型案例**:
- **广告推荐**: `用户年龄段 × 商品类别` → 捕捉不同年龄人群的偏好差异
- **房价预测**: `面积 × 楼层` → 反映不同楼层的面积价值差异
- **风控场景**: `收入 / 负债` → 负债收入比（直接构造业务特征）

```
特征交叉方式:
  算术交叉: A + B, A - B, A * B, A / B
  多项式交叉: A^2, A*B, B^2 (PolynomialFeatures)
  类别交叉: city_北京_AND_age_25-30 (组合独热编码)
```

### 3.2 特征选择 (Feature Selection)

当特征数量过多时，需要筛选出最有价值的特征，减少维度灾难和过拟合。

#### 三大类方法对比

```
+------------------+---------------------+----------------------+
|   过滤法 Filter   |  包裹法 Wrapper      |  嵌入法 Embedded     |
+------------------+---------------------+----------------------+
| 独立于模型        | 依赖特定模型         | 模型训练过程中选择    |
| 速度快            | 速度慢（需反复训练）  | 速度中等             |
| 方差阈值          | 前向/后向选择        | Lasso (L1正则化)     |
| 互信息 (MI)       | 递归消除 (RFE)       | 树模型特征重要性      |
| 卡方检验          | 交叉验证选择         | XGBoost importance   |
+------------------+---------------------+----------------------+
```

**选择建议**:
- 特征 >1000 时：先用过滤法粗筛（方差阈值 + 互信息），再用嵌入法精选
- 特征 <100 时：直接使用嵌入法（L1 正则化或树模型重要性）
- 需要最优子集时：用包裹法（RFE），但注意计算成本

### 3.3 时间序列特征构造 (Time Series Feature Engineering)

时间序列数据需要构造时间相关的特征来捕捉趋势和周期性。

| 特征类型 | 示例 | 捕捉的信息 |
|---------|------|-----------|
| **日历特征** | 年/月/日/周几/是否节假日 | 周期性模式 |
| **滞后特征 (Lag)** | `sales_lag_1`, `sales_lag_7` | 历史依赖关系 |
| **滑动窗口统计** | `mean_7d`, `std_30d`, `max_7d` | 趋势和波动性 |
| **差分特征** | `value_t - value_{t-1}` | 变化速率 |
| **指数加权平均** | EWM (Exponentially Weighted Mean) | 近期趋势（衰减历史影响） |

---

## 4. 代码实战 (Hands-on Code)

### 4.1 完整特征工程 Pipeline（sklearn）

```python
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import (
    StandardScaler, OneHotEncoder, OrdinalEncoder, FunctionTransformer
)
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import GradientBoostingClassifier

# 定义不同类型的特征列
numeric_features = ['age', 'income', 'credit_score']
categorical_features = ['city', 'education']
ordinal_features = ['risk_level']  # 低/中/高

# 数值特征处理: 缺失值填充 → 对数变换（收入）→ 标准化
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 类别特征处理: 缺失值填充 → 独热编码
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

# 有序特征处理: 标签编码
ordinal_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ordinal', OrdinalEncoder(categories=``[ ['低', '中', '高'] ]``))
])

# 组合所有预处理步骤
preprocessor = ColumnTransformer(transformers=[
    ('num', numeric_transformer, numeric_features),
    ('cat', categorical_transformer, categorical_features),
    ('ord', ordinal_transformer, ordinal_features)
])

# 完整 Pipeline: 预处理 → 特征选择 → 模型
full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('feature_selection', SelectFromModel(
        GradientBoostingClassifier(n_estimators=100), threshold='median'
    )),
    ('classifier', GradientBoostingClassifier(n_estimators=200))
])

# 训练与预测
# full_pipeline.fit(X_train, y_train)
# predictions = full_pipeline.predict(X_test)
```

### 4.2 目标编码（带正则化防止数据泄露）

```python
from sklearn.model_selection import KFold

def target_encode(train_df, col, target, n_splits=5, smoothing=10):
    """K-Fold 目标编码，防止数据泄露"""
    global_mean = train_df[target].mean()
    encoded = pd.Series(index=train_df.index, dtype=float)
    
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    for train_idx, val_idx in kf.split(train_df):
        # 仅用训练折计算编码
        stats = train_df.iloc[train_idx].groupby(col)[target].agg(['mean', 'count'])
        # 贝叶斯平滑: 样本少时偏向全局均值
        smooth_mean = (stats['mean'] * stats['count'] + global_mean * smoothing) / \
                      (stats['count'] + smoothing)
        encoded.iloc[val_idx] = train_df.iloc[val_idx][col].map(smooth_mean)
    
    encoded.fillna(global_mean, inplace=True)
    return encoded
```

### 4.3 时间序列特征构造

```python
def create_time_features(df, date_col='date', target_col='sales'):
    """为时间序列数据构造日历 + 滞后 + 滑动窗口特征"""
    df = df.copy()
    df[date_col] = pd.to_datetime(df[date_col])
    
    # 日历特征
    df['dayofweek'] = df[date_col].dt.dayofweek
    df['month'] = df[date_col].dt.month
    df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
    
    # 滞后特征
    for lag in [1, 7, 14, 28]:
        df[f'lag_{lag}'] = df[target_col].shift(lag)
    
    # 滑动窗口统计
    for window in [7, 14, 30]:
        df[f'rolling_mean_{window}'] = df[target_col].shift(1).rolling(window).mean()
        df[f'rolling_std_{window}'] = df[target_col].shift(1).rolling(window).std()
    
    return df
```

---

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 真实工业应用

| 行业 | 典型特征工程 | 效果提升 |
|------|------------|---------|
| **广告推荐** | 用户行为序列特征（点击率/停留时长/历史偏好） + 上下文特征交叉 | CTR 提升 15-30% |
| **金融风控** | 负债收入比、还款历史滑动窗口统计、社交图谱特征 | AUC 提升 3-5% |
| **电商搜索** | 查询-商品文本相似度、价格区间编码、用户价格敏感度 | NDCG 提升 10-20% |
| **医疗诊断** | 生理指标趋势特征、检查结果交叉、病史编码 | 灵敏度提升 5-10% |

### 5.2 特征工程 vs 深度学习自动特征提取

| 维度 | 传统特征工程 | 深度学习端到端 |
|------|------------|--------------|
| **数据量要求** | 小数据也能发挥 | 需要大量数据 |
| **可解释性** | 高（特征有业务含义） | 低（黑盒提取） |
| **领域知识要求** | 高（需理解业务）| 低（自动学习） |
| **适用数据类型** | 表格数据最优 | 图像/文本/语音最优 |
| **维护成本** | 需持续更新特征 | 端到端更新模型 |

**结论**: 对于表格数据，特征工程 + 梯度提升树（XGBoost/LightGBM）仍然是最强方案；对于非结构化数据（图像/文本），深度学习的自动特征提取更优。

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 自动特征工程 (Automated Feature Engineering)

- **Featuretools**: 基于深度特征合成 (Deep Feature Synthesis) 自动构造聚合、变换特征
- **AutoFeat**: 自动生成多项式和交叉特征并筛选
- **TSFresh**: 专门针对时间序列的自动特征提取（计算 >700 种统计特征）

### 6.2 特征存储 (Feature Store)

生产环境中，特征的计算、存储和服务需要工程化管理：

```
特征存储架构:
  离线特征 → [Batch Pipeline] → Feature Store (Hive/Delta Lake)
  在线特征 → [Stream Pipeline] → Feature Store (Redis/DynamoDB)
                                      ↓
                               [Model Serving] → 预测结果
```

主流 Feature Store 方案：Feast (开源)、Tecton、SageMaker Feature Store、Vertex AI Feature Store。

### 6.3 常见陷阱

1. **数据泄露 (Data Leakage)**: 在特征构造时使用了测试集信息或未来信息
   - **防范**: 所有特征变换必须 fit on train, transform on test
2. **过度工程**: 构造过多无意义特征导致过拟合
   - **防范**: 始终搭配特征选择步骤
3. **分布漂移**: 训练集和线上数据的特征分布不一致
   - **防范**: 监控特征分布（PSI 指标）

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- [概率论与数理统计](../../01_Fundamentals/Probability_Statistics/Probability_Statistics.md) — 理解分布变换和统计量
- [线性代数](../../01_Fundamentals/Linear_Algebra/Linear_Algebra.md) — PCA 降维的数学基础

### 进阶方向
- [监督学习](../Supervised_Learning/Supervised_Learning.md) — 特征工程的下游消费者
- [无监督学习](../Unsupervised_Learning/Unsupervised_Learning.md) — PCA/t-SNE 作为降维特征
- [模型评估](../../08_Model_Evaluation/Model_Evaluation.md) — 评估特征工程的效果
- [MLOps Pipeline](../../10_MLOps_Pipeline/MLOps_Pipeline.md) — 特征存储与特征管道

---

## 8. 面试高频问题 (Interview FAQs)

**Q1: 标准化和归一化的区别是什么？什么场景用哪个？**
> 标准化（Z-Score）将数据变为均值 0、标准差 1，适合假设数据近似正态分布的模型（SVM、逻辑回归）。归一化（Min-Max）将数据压缩到 [0,1]，适合需要固定范围的场景（神经网络输入、图像像素）。如果有离群值，考虑用 RobustScaler。

**Q2: 如何处理高基数类别特征（如用户 ID、城市名）？**
> 方案一：目标编码 (Target Encoding) + 贝叶斯平滑防泄漏。方案二：频率编码。方案三：深度学习场景下使用 Embedding 层。避免直接 One-Hot，会导致维度爆炸。

**Q3: 什么是数据泄露？如何避免？**
> 数据泄露是指模型在训练时"看到"了不该看到的信息（测试集数据或未来数据）。避免方法：1) 特征变换只在训练集上 fit；2) 时间序列数据严格按时间划分；3) 目标编码使用 K-Fold 方式。

**Q4: 特征选择和降维有什么区别？**
> 特征选择是从原始特征中选子集（保留原始含义），降维是通过数学变换（如 PCA）创建新特征（失去原始含义）。特征选择保留可解释性，降维可能效果更好但牺牲了解释性。

**Q5: 深度学习时代还需要特征工程吗？**
> 需要。表格数据场景下，XGBoost + 特征工程仍优于深度学习。即使在深度学习中，数据清洗、缺失值处理、特征归一化仍然必要。此外，领域知识驱动的特征构造（如金融中的负债收入比）可以显著加速模型收敛。

---

## 9. 参考资源 (References)

### 经典书籍与论文
- [Feature Engineering and Selection - Max Kuhn](https://bookdown.org/max/FES/) — 特征工程领域最全面的参考书
- [Scikit-learn Preprocessing Guide](https://scikit-learn.org/stable/modules/preprocessing.html) — 官方特征预处理文档

### 开源工具
- [Featuretools](https://github.com/alteryx/featuretools) — 自动特征工程库
- [Category Encoders](https://contrib.scikit-learn.org/category_encoders/) — sklearn 兼容的类别编码库
- [TSFresh](https://tsfresh.readthedocs.io/) — 时间序列自动特征提取
- [Feast](https://feast.dev/) — 开源 Feature Store

### 优质教程
- [Kaggle Feature Engineering Course](https://www.kaggle.com/learn/feature-engineering) — Kaggle 官方特征工程教程
- [Applied Machine Learning - Feature Engineering (Cornell CS5785)](https://www.cs.cornell.edu/courses/cs5785/) — 康奈尔大学应用机器学习课程

---
*Last updated: 2026-02-10*

## Related

- [[02_Machine_Learning/Ensemble_Learning/Ensemble_Learning]] — 集成学习 (Ensemble Learning) - 完全指南 (共享: machine-learning, ml, supervised, unsupervised)
- [[02_Machine_Learning/Feature_Engineering/Feature_Engineering_for_dummy]] — 特征工程 - 小白版 (共享: machine-learning, ml, supervised, unsupervised)
- [[02_Machine_Learning/ML-in-nutshell]] — 机器学习速成指南 (共享: machine-learning, ml, supervised, unsupervised)
- [[02_Machine_Learning/README]] — 02 经典机器学习 (Classical Machine Learning) (共享: machine-learning, ml, supervised, unsupervised)
