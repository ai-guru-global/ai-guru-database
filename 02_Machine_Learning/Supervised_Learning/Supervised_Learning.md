# 监督学习 (Supervised Learning)

> **一句话理解**: 监督学习就像"有老师的学习"——给模型展示大量的"问题-答案"配对（如图片→类别、房屋特征→价格），让它学会从输入推测正确输出，就像学生通过习题册学习解题规律一样。

## 1. 概述 (Overview)

监督学习 (Supervised Learning) 是机器学习的核心范式之一,利用已知标签的训练数据来学习输入到输出的映射函数 $f: X \rightarrow Y$。训练数据集由输入-输出对 $(x_i, y_i)$ 组成,模型的目标是找到最优的函数 $\hat{f}$,使其能够准确预测新数据的标签。

### 1.1 监督学习的特点

- **标注数据驱动**: 需要高质量的标注数据集
- **明确目标**: 损失函数定义了"好"模型的标准
- **泛化能力**: 核心挑战是在未见数据上保持性能
- **两大任务类型**:
  - **分类 (Classification)**: 输出离散类别 (如垃圾邮件判别)
  - **回归 (Regression)**: 输出连续数值 (如房价预测)

### 1.2 学习流程

```
训练阶段:
输入数据 (X) → 模型 (f) → 预测输出 (ŷ) → 损失函数 (Loss) → 参数更新

推理阶段:
新数据 (X_new) → 训练好的模型 (f*) → 预测结果 (ŷ_new)
```

## 2. 核心概念 (Core Concepts)

### 2.1 线性与逻辑回归

#### 线性回归 (Linear Regression)

**数学形式**:
$$\hat{y} = w_0 + w_1 x_1 + w_2 x_2 + ... + w_n x_n = \mathbf{w}^T \mathbf{x}$$

**损失函数** (均方误差 MSE):
$$L(\mathbf{w}) = \frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2 = \frac{1}{m} ||\mathbf{y} - \mathbf{X}\mathbf{w}||^2$$

**优化方法**:
1. **闭式解 (Normal Equation)**: $\mathbf{w}^* = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}$
   - 优势: 一步求解,无需调参
   - 劣势: $O(n^3)$ 复杂度,不适合大规模特征
2. **梯度下降 (Gradient Descent)**: $\mathbf{w} \leftarrow \mathbf{w} - \eta \nabla_{\mathbf{w}} L$
   - 优势: 可扩展到大数据,支持在线学习

#### 逻辑回归 (Logistic Regression)

**核心函数** (Sigmoid):
$$\sigma(z) = \frac{1}{1 + e^{-z}}, \quad \hat{y} = \sigma(\mathbf{w}^T \mathbf{x})$$

**损失函数** (交叉熵 Cross-Entropy):
$$L(\mathbf{w}) = -\frac{1}{m} \sum_{i=1}^{m} [y_i \log(\hat{y}_i) + (1-y_i) \log(1-\hat{y}_i)]$$

**多分类扩展** (Softmax Regression):
$$P(y=k|\mathbf{x}) = \frac{e^{\mathbf{w}_k^T \mathbf{x}}}{\sum_{j=1}^{K} e^{\mathbf{w}_j^T \mathbf{x}}}$$

### 2.2 支持向量机 (Support Vector Machine, SVM)

#### 核心思想: 最大间隔分类器

SVM 寻找一个超平面 $\mathbf{w}^T \mathbf{x} + b = 0$,使得正负样本之间的间隔 (margin) 最大化。

**优化目标**:
$$\min_{\mathbf{w}, b} \frac{1}{2} ||\mathbf{w}||^2 \quad \text{s.t.} \quad y_i (\mathbf{w}^T \mathbf{x}_i + b) \geq 1, \forall i$$

**几何直觉**:
```
       决策边界          支持向量
           |            ×  ○
    ×      |       ×       |
      ×    |  ×            |
-----------|--------------------------  间隔 = 2/||w||
           |         ○
      ○    |   ○         ○ |
           |               ×
```

#### 核技巧 (Kernel Trick)

当数据线性不可分时,通过核函数 $K(\mathbf{x}_i, \mathbf{x}_j) = \phi(\mathbf{x}_i)^T \phi(\mathbf{x}_j)$ 将数据映射到高维空间,而无需显式计算 $\phi(\mathbf{x})$。

**常用核函数对比**:

| 核函数 | 公式 | 适用场景 |
|--------|------|----------|
| 线性核 (Linear) | $K(\mathbf{x}, \mathbf{z}) = \mathbf{x}^T \mathbf{z}$ | 高维稀疏数据 (文本分类) |
| 多项式核 (Polynomial) | $K(\mathbf{x}, \mathbf{z}) = (\mathbf{x}^T \mathbf{z} + c)^d$ | 需要特征交互的任务 |
| RBF 高斯核 (Gaussian) | $K(\mathbf{x}, \mathbf{z}) = e^{-\gamma \|\mathbf{x} - \mathbf{z}\|^2}$ | 通用场景,边界复杂 |
| Sigmoid 核 | $K(\mathbf{x}, \mathbf{z}) = \tanh(\alpha \mathbf{x}^T \mathbf{z} + c)$ | 模拟神经网络 |

**为什么需要核技巧?**
1. **计算效率**: 避免在超高维空间中显式计算 $\phi(\mathbf{x})$
2. **理论保证**: 核函数满足 Mercer 定理时,对应有效的内积空间
3. **灵活性**: 可为不同数据类型设计专用核 (如图核、字符串核)

### 2.3 决策树 (Decision Tree)

#### 分裂标准对比

决策树通过递归划分特征空间构建树结构。核心问题: **如何选择最优分裂点?**

**信息增益 (Information Gain)** — ID3/C4.5 算法:
$$IG(D, A) = Entropy(D) - \sum_{v \in Values(A)} \frac{|D_v|}{|D|} Entropy(D_v)$$

其中熵 $Entropy(D) = -\sum_{k=1}^{K} p_k \log_2 p_k$

**基尼不纯度 (Gini Impurity)** — CART 算法:
$$Gini(D) = 1 - \sum_{k=1}^{K} p_k^2$$

**对比分析**:

| 指标 | 信息增益 (ID3) | 信息增益率 (C4.5) | 基尼系数 (CART) |
|------|---------------|------------------|----------------|
| 计算复杂度 | 需计算对数 | 需计算对数 + 归一化 | 仅平方运算,更快 |
| 对不平衡敏感性 | 偏向取值多的特征 | 惩罚取值多的特征 | 中等 |
| 多分类支持 | 天然支持 | 天然支持 | 支持但更适合二分类 |
| 剪枝策略 | 悲观剪枝 | 错误率降低剪枝 | 代价复杂度剪枝 |

**决策树优势**:
- 可解释性强 (白盒模型)
- 无需特征归一化
- 自动处理特征交互

**决策树劣势**:
- 易过拟合 (需剪枝)
- 对噪声敏感
- 不稳定 (数据微小变化可能导致结构大变)

### 2.4 集成学习 (Ensemble Learning)

集成学习通过组合多个弱学习器来提升整体性能。核心思想: **"三个臭皮匠,顶个诸葛亮"**。

#### Bagging (Bootstrap Aggregating)

**随机森林 (Random Forest)**:
1. **有放回采样**: 从 $m$ 个样本中采样 $m$ 次 (Bootstrap)
2. **特征随机**: 每次分裂仅考虑 $\sqrt{n}$ 个随机特征
3. **投票聚合**: 分类用多数投票,回归用平均

**效果**: 降低方差 (Variance),防止过拟合

#### Boosting (提升法)

**核心思想**: 序列化训练,每个新模型专注修正前序模型的错误。

**AdaBoost 算法**:
1. 初始化样本权重 $w_i = 1/m$
2. 训练弱分类器 $h_t$,计算错误率 $\epsilon_t$
3. 更新权重: 错分样本权重 $\times e^{\alpha_t}$,正确样本权重 $\times e^{-\alpha_t}$
4. 最终模型: $H(x) = \text{sign}(\sum_{t} \alpha_t h_t(x))$

**效果**: 降低偏差 (Bias),提升弱模型

#### 梯度提升决策树 (GBDT) 家族对比

| 特性 | XGBoost | LightGBM | CatBoost |
|------|---------|----------|----------|
| **发布时间** | 2016 | 2017 | 2018 |
| **树生长策略** | Level-wise (层级生长) | Leaf-wise (叶子最优) | Oblivious Trees (对称树) |
| **分裂算法** | 预排序 + 近似直方图 | 直方图 (Histogram-based) | Ordered Boosting |
| **类别特征** | One-hot/标签编码 | 原生支持 | **最优** (Target Statistics) |
| **缺失值处理** | 稀疏感知 (Sparsity-aware) | 零值分桶 | 特殊处理 |
| **训练速度** | 中等 | **最快** (GPU 并行) | 慢 (迭代编码) |
| **内存占用** | 高 (需预排序) | **低** (直方图压缩) | 中等 |
| **过拟合风险** | 需调参 | Leaf-wise 易过拟合 | **最低** (正则化强) |
| **默认参数效果** | 中等 | 中等 | **最佳** |
| **适用场景** | 结构化数据竞赛 | 大规模数据 | 类别特征多的任务 |

**XGBoost 核心创新**:
1. **正则化损失**: $Obj = \sum_{i} l(y_i, \hat{y}_i) + \sum_{k} \Omega(f_k)$,其中 $\Omega(f) = \gamma T + \frac{1}{2} \lambda ||\mathbf{w}||^2$
2. **二阶泰勒展开**: 更精确的损失近似
3. **加权分位数**: 高效处理大数据

**LightGBM 优势**:
- **GOSS (Gradient-based One-Side Sampling)**: 保留大梯度样本,随机丢弃小梯度样本
- **EFB (Exclusive Feature Bundling)**: 互斥特征打包降维

**CatBoost 特色**:
- **Ordered Target Statistics**: 避免目标泄漏
- **Oblivious Trees**: 每层所有节点用相同分裂特征,加速推理

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 偏差-方差权衡 (Bias-Variance Tradeoff)

模型误差可分解为三部分:
$$\mathbb{E}[(y - \hat{f}(x))^2] = \text{Bias}^2 + \text{Variance} + \text{Irreducible Error}$$

- **偏差 (Bias)**: 模型预测的期望值与真实值的差距,反映拟合能力
- **方差 (Variance)**: 模型对训练集变化的敏感度,反映泛化能力
- **不可约误差 (Irreducible Error)**: 数据本身的噪声,无法消除

**学习曲线诊断**:
```
误差 (Error)
  ^
  |        欠拟合 (High Bias)
  |   ┌────────────────────────
  |   │ 训练误差 (Training Error)
  |   │
  |   └────────────────────────
  |     验证误差 (Validation Error)
  |
  +────────────────────────────> 训练集大小 (m)

误差 (Error)
  ^
  |        过拟合 (High Variance)
  |        ┌──────────────
  |       ╱ 验证误差
  |      ╱
  |  ───╱─── 训练误差
  |
  +────────────────────────────> 训练集大小 (m)
```

**解决策略**:

| 问题 | 特征 | 解决方法 |
|------|------|----------|
| **欠拟合** | 训练/验证误差都高 | 增加模型复杂度,添加特征,减少正则化 |
| **过拟合** | 训练误差低,验证误差高 | 增加数据,正则化,简化模型,特征选择 |
| **适中拟合** | 训练/验证误差都低且接近 | 理想状态,继续调优 |

### 3.2 正则化技术 (Regularization)

**L1 正则化 (Lasso)**:
$$L(\mathbf{w}) = \frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2 + \alpha \sum_{j=1}^{n} |w_j|$$

- 效果: 产生稀疏解 (特征选择)
- 适用: 高维数据,需解释性

**L2 正则化 (Ridge)**:
$$L(\mathbf{w}) = \frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2 + \alpha \sum_{j=1}^{n} w_j^2$$

- 效果: 权重平滑,避免极端值
- 适用: 多重共线性问题

**Elastic Net** (L1 + L2):
$$L(\mathbf{w}) = \frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2 + \alpha_1 \sum_{j} |w_j| + \alpha_2 \sum_{j} w_j^2$$

### 3.3 交叉验证 (Cross-Validation)

**K 折交叉验证流程**:
```
数据集划分 (K=5 示例):
+-----+-----+-----+-----+-----+
|  1  |  2  |  3  |  4  |  5  |  Fold 1: 2,3,4,5 训练, 1 验证
+-----+-----+-----+-----+-----+  Fold 2: 1,3,4,5 训练, 2 验证
                                 Fold 3: 1,2,4,5 训练, 3 验证
最终得分: 平均 5 次验证误差        Fold 4: 1,2,3,5 训练, 4 验证
                                 Fold 5: 1,2,3,4 训练, 5 验证
```

**变体**:
- **留一法 (LOOCV)**: $K = m$ (样本数),计算量大但方差小
- **分层 K 折 (Stratified K-Fold)**: 保持每折中类别比例不变
- **时间序列交叉验证**: 禁止"未来数据泄露",仅用过去预测未来

## 4. 代码实战 (Hands-on Code)

### 4.1 完整 Pipeline: 数据 → 训练 → 评估

```python
import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV, learning_curve
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import matplotlib.pyplot as plt

# 1. 数据加载与预处理
data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 特征标准化 (对 SVM 和逻辑回归很重要)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 2. 模型对比训练
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'SVM (RBF Kernel)': SVC(kernel='rbf', probability=True),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
}

results = {}
for name, model in models.items():
    # 训练
    model.fit(X_train_scaled, y_train)
    
    # 预测
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1] if hasattr(model, 'predict_proba') else None
    
    # 评估
    results[name] = {
        'accuracy': model.score(X_test_scaled, y_test),
        'auc': roc_auc_score(y_test, y_proba) if y_proba is not None else None
    }
    
    print(f"\n{'='*50}")
    print(f"{name} 评估结果:")
    print(classification_report(y_test, y_pred, target_names=data.target_names))
    print(f"混淆矩阵:\n{confusion_matrix(y_test, y_pred)}")

# 3. 超参数调优 (以 SVM 为例)
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.001, 0.01, 0.1],
    'kernel': ['rbf', 'linear']
}

grid_search = GridSearchCV(
    SVC(probability=True), param_grid, cv=5, 
    scoring='roc_auc', n_jobs=-1, verbose=1
)
grid_search.fit(X_train_scaled, y_train)

print(f"\n最佳参数: {grid_search.best_params_}")
print(f"最佳 AUC: {grid_search.best_score_:.4f}")

# 4. 学习曲线分析 (诊断偏差-方差)
train_sizes, train_scores, val_scores = learning_curve(
    RandomForestClassifier(random_state=42), 
    X_train_scaled, y_train, cv=5, 
    train_sizes=np.linspace(0.1, 1.0, 10), 
    scoring='accuracy', n_jobs=-1
)

train_mean = train_scores.mean(axis=1)
val_mean = val_scores.mean(axis=1)

plt.figure(figsize=(10, 6))
plt.plot(train_sizes, train_mean, label='Training Score', marker='o')
plt.plot(train_sizes, val_mean, label='Validation Score', marker='s')
plt.xlabel('Training Set Size')
plt.ylabel('Accuracy')
plt.title('Learning Curve - Random Forest')
plt.legend()
plt.grid(True)
plt.savefig('learning_curve.png')
print("\n学习曲线已保存到 learning_curve.png")
```

### 4.2 XGBoost 实战

```python
import xgboost as xgb
from sklearn.metrics import mean_squared_error

# 回归任务示例 (房价预测)
from sklearn.datasets import fetch_california_housing
housing = fetch_california_housing()
X_train, X_test, y_train, y_test = train_test_split(
    housing.data, housing.target, test_size=0.2, random_state=42
)

# XGBoost 原生接口
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

params = {
    'objective': 'reg:squarederror',
    'max_depth': 6,
    'eta': 0.1,  # 学习率
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'lambda': 1.0,  # L2 正则化
    'alpha': 0.0    # L1 正则化
}

# 训练并监控验证集
evals = [(dtrain, 'train'), (dtest, 'test')]
bst = xgb.train(
    params, dtrain, num_boost_round=200, 
    evals=evals, early_stopping_rounds=10, verbose_eval=20
)

# 预测与评估
y_pred = bst.predict(dtest)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"Test RMSE: {rmse:.4f}")

# 特征重要性可视化
xgb.plot_importance(bst, max_num_features=10)
plt.savefig('feature_importance.png')
```

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 金融风控 (Credit Scoring)

**任务**: 预测用户是否会违约
**数据**: 收入、负债率、历史还款记录、征信分
**模型选择**: LightGBM (处理类别特征如职业、地区)
**关键技术**:
- 样本不平衡处理 (SMOTE 过采样/调整类别权重)
- 特征工程 (构造交互特征如收入/负债比)
- 模型可解释性 (SHAP 值解释预测原因)

### 5.2 医疗诊断 (Disease Prediction)

**任务**: 乳腺癌良恶性分类
**数据**: 细胞核特征 (半径、纹理、周长等)
**模型选择**: SVM (小样本 + 高维特征)
**关键技术**:
- 特征归一化 (不同量纲的医学指标)
- 核函数选择 (RBF 核捕捉非线性关系)
- 交叉验证 (避免小样本过拟合)

### 5.3 推荐系统 (CTR Prediction)

**任务**: 预测用户点击广告概率
**数据**: 用户画像 + 物品特征 + 上下文信息
**模型选择**: 逻辑回归 (在线学习,可解释) → GBDT (离线特征工程)
**关键技术**:
- 类别特征编码 (One-hot/目标编码/Embedding)
- 正负样本采样 (负样本下采样)
- 模型融合 (LR + GBDT 双塔模型)

### 5.4 时间序列预测 (Sales Forecasting)

**任务**: 预测商品未来销量
**数据**: 历史销量 + 节假日 + 促销活动
**模型选择**: XGBoost (捕捉复杂模式) + ARIMA (时间依赖)
**关键技术**:
- 时间窗口特征 (滑动窗口统计量)
- 趋势-季节性分解
- 时间序列交叉验证

## 6. 进阶话题 (Advanced Topics)

### 6.1 样本不平衡问题 (Imbalanced Data)

**问题**: 正负样本比例悬殊 (如欺诈检测: 1:1000)

**解决方案**:
1. **数据层面**:
   - 过采样 (SMOTE, ADASYN)
   - 欠采样 (Tomek Links, NearMiss)
   - 合成样本 (GAN)

2. **算法层面**:
   - 类别权重: `class_weight='balanced'`
   - 代价敏感学习 (Cost-sensitive Learning)
   - 异常检测角度 (One-class SVM, Isolation Forest)

3. **评估层面**:
   - 不用准确率,用 **Precision/Recall/F1/AUC**
   - PR 曲线比 ROC 曲线更合适

### 6.2 特征工程 (Feature Engineering)

**原则**: "数据和特征决定了机器学习的上限,模型和算法只是逼近这个上限"

**常用技术**:
```python
# 1. 多项式特征 (捕捉特征交互)
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2, interaction_only=True)
X_poly = poly.fit_transform(X)

# 2. 目标编码 (Target Encoding)
category_means = df.groupby('category')['target'].mean()
df['category_encoded'] = df['category'].map(category_means)

# 3. 分箱 (Binning)
pd.cut(df['age'], bins=[0, 18, 35, 60, 100], labels=['未成年', '青年', '中年', '老年'])
```

### 6.3 模型融合 (Model Ensemble)

**Stacking 示例**:
```python
from sklearn.ensemble import StackingClassifier

base_learners = [
    ('rf', RandomForestClassifier(n_estimators=100)),
    ('svm', SVC(probability=True)),
    ('xgb', xgb.XGBClassifier())
]
meta_learner = LogisticRegression()

stacking = StackingClassifier(
    estimators=base_learners, 
    final_estimator=meta_learner, 
    cv=5
)
stacking.fit(X_train, y_train)
```

### 6.4 常见陷阱

1. **数据泄露 (Data Leakage)**:
   - 错误: 在全量数据上做归一化,再划分训练/测试集
   - 正确: 先划分,再在训练集上 fit,测试集上 transform

2. **过度调参 (Overfitting to Validation Set)**:
   - 问题: 反复在验证集上调参,导致验证集不再"干净"
   - 解决: 使用三重划分 (训练集/验证集/测试集) 或嵌套交叉验证

3. **忽略业务约束**:
   - 示例: 信用评分模型必须可解释 (监管要求),不能单纯追求 AUC

## 7. 与其他主题的关联 (Connections)

### 7.1 前置知识
- **数学基础**: 线性代数 (矩阵运算)、微积分 (梯度下降)、概率论 (贝叶斯定理)
- **统计学习**: 最大似然估计、假设检验、置信区间
- **优化理论**: 凸优化、拉格朗日乘子法 (SVM 对偶问题)

### 7.2 横向关联
- [**无监督学习**](../Unsupervised_Learning/Unsupervised_Learning.md): 可用 PCA 降维后再做监督学习
- [**特征工程**](../Feature_Engineering/): 决定监督学习的上限
- [**模型评估**](../../08_Model_Evaluation/Model_Evaluation.md): A/B 测试、模型监控

### 7.3 纵向进阶
- [**神经网络**](../../03_Deep_Learning/Neural_Network_Core/Neural_Network_Core.md): 逻辑回归是单层神经网络
- [**集成深度学习**](../../03_Deep_Learning/): GBDT 特征 + 神经网络融合
- [**AutoML**](../../10_MLOps_Pipeline/MLOps_Pipeline.md): 自动特征工程、超参数优化

## 8. 面试高频问题 (Interview FAQs)

### Q1: 为什么 SVM 需要核技巧?能否直接在高维空间计算?

**答案**: 核技巧的关键在于**避免显式计算高维映射**。

**理由**:
1. **计算复杂度**: 若显式映射到 $d$ 维空间,每个样本计算 $O(d)$,而 RBF 核是无限维,根本无法计算
2. **存储成本**: 高维特征矩阵无法存储 (维度灾难)
3. **核技巧优势**: 只需计算内积 $K(\mathbf{x}_i, \mathbf{x}_j)$,复杂度 $O(n^2)$ 而非 $O(n^2 d)$

**例子**: 2D → 多项式核 3次映射到 10D,1000 个样本需要 $1000 \times 10 = 10^4$ 存储,但核矩阵只需 $1000 \times 1000 = 10^6$ 且可稀疏化。

### Q2: XGBoost 相比传统 GBDT 有哪些创新?

**答案**: 五大核心改进

1. **正则化目标函数**: 
   $$Obj^{(t)} = \sum_{i=1}^{m} l(y_i, \hat{y}_i^{(t-1)} + f_t(x_i)) + \Omega(f_t) + \text{Constant}$$
   其中 $\Omega(f) = \gamma T + \frac{1}{2} \lambda \sum_{j=1}^{T} w_j^2$,防止过拟合

2. **二阶泰勒展开**: 
   $$Obj^{(t)} \approx \sum_{i=1}^{m} [g_i f_t(x_i) + \frac{1}{2} h_i f_t^2(x_i)] + \Omega(f_t)$$
   更精确的损失近似,加速收敛

3. **分裂增益公式**:
   $$Gain = \frac{1}{2} \left[ \frac{G_L^2}{H_L + \lambda} + \frac{G_R^2}{H_R + \lambda} - \frac{(G_L + G_R)^2}{H_L + H_R + \lambda} \right] - \gamma$$
   高效剪枝

4. **稀疏感知**: 自动学习缺失值的最优分裂方向

5. **系统优化**: 列块并行、缓存优化、核外计算 (Out-of-core)

### Q3: 如何判断模型是欠拟合还是过拟合?

**答案**: 通过学习曲线和验证曲线诊断

| 现象 | 诊断 | 解决方案 |
|------|------|----------|
| 训练误差高 & 验证误差高 | 欠拟合 (High Bias) | 增加模型复杂度,添加特征,减少正则化 |
| 训练误差低 & 验证误差高 | 过拟合 (High Variance) | 增加数据,正则化,Dropout,Early Stopping |
| 训练误差低 & 验证误差低 | 适中拟合 | 理想状态 |
| 验证误差 < 训练误差 | 数据泄露 | 检查数据划分流程 |

**代码检测**:
```python
from sklearn.model_selection import validation_curve

param_range = [1, 10, 100, 1000]
train_scores, val_scores = validation_curve(
    SVC(), X, y, param_name='C', param_range=param_range, cv=5
)
# 绘制 C 值 vs 误差曲线,找到最佳复杂度
```

### Q4: 随机森林为什么能降低方差?

**答案**: 通过**去相关化**降低集成模型方差

**数学推导**:
假设 $m$ 个独立同分布的模型,方差 $\sigma^2$,平均后方差降为 $\sigma^2 / m$。
但若模型间相关系数 $\rho$,则方差为:
$$Var(\bar{f}) = \rho \sigma^2 + \frac{1-\rho}{m} \sigma^2$$

**随机森林的去相关策略**:
1. **Bootstrap 采样**: 每棵树训练数据不同 → 降低 $\rho$
2. **特征随机**: 每次分裂仅考虑 $\sqrt{n}$ 个特征 → 强制多样性
3. **结果**: $\rho$ 降低,方差大幅下降

**对比**: Bagging 只做 Bootstrap (相关性仍高),随机森林加入特征随机 (相关性更低)

### Q5: 逻辑回归和 SVM 有什么区别?什么时候用哪个?

**答案**: 核心差异在于损失函数和决策边界

| 维度 | 逻辑回归 (Logistic Regression) | SVM (Support Vector Machine) |
|------|-------------------------------|------------------------------|
| **损失函数** | 交叉熵 (所有样本都贡献损失) | Hinge Loss (只关注支持向量) |
| **输出** | 概率 $P(y=1|x) \in (0,1)$ | 决策函数 $f(x)$ (需校准才能得概率) |
| **决策边界** | 最大似然估计 | 最大间隔 |
| **对异常值敏感性** | 高 (所有样本影响) | 低 (只支持向量影响) |
| **训练效率** | 快 (凸优化,梯度下降) | 慢 ($O(n^2)$ 至 $O(n^3)$) |
| **核技巧** | 不支持 (需手动特征工程) | 原生支持 (RBF/Polynomial 核) |
| **可解释性** | 高 (权重直接解释) | 中 (支持向量难解释) |

**使用建议**:
- **逻辑回归**: 需要概率输出、线性可分、大数据集、在线学习
- **SVM**: 小样本、非线性问题、对异常值鲁棒性要求高

## 9. 参考资源 (References)

### 9.1 经典论文
- **[XGBoost: A Scalable Tree Boosting System (Chen & Guestrin, 2016)](https://arxiv.org/abs/1603.02754)**: XGBoost 原论文
- **[LightGBM: A Highly Efficient Gradient Boosting Decision Tree (Ke et al., 2017)](https://papers.nips.cc/paper/6907-lightgbm-a-highly-efficient-gradient-boosting-decision-tree)**: LightGBM 原理
- **[Random Forests (Breiman, 2001)](https://link.springer.com/article/10.1023/A:1010933404324)**: 随机森林开创性工作

### 9.2 教材与课程
- **[Introduction to Statistical Learning (ISL)](https://www.statlearning.com/)**: 入门经典,配 R 代码
- **[Elements of Statistical Learning (ESL)](https://web.stanford.edu/~hastie/ElemStatLearn/)**: 理论深入
- **[Machine Learning Specialization - Andrew Ng](https://www.coursera.org/specializations/machine-learning-introduction)**: Coursera 经典课程

### 9.3 开源库
- **[Scikit-learn](https://scikit-learn.org/)**: Python 机器学习标准库
- **[XGBoost](https://xgboost.readthedocs.io/)**: 高性能 GBDT 实现
- **[LightGBM](https://lightgbm.readthedocs.io/)**: 微软开源 GBDT
- **[CatBoost](https://catboost.ai/)**: Yandex 开源,类别特征优化

### 9.4 竞赛与实践
- **[Kaggle Learn - Intro to Machine Learning](https://www.kaggle.com/learn/intro-to-machine-learning)**: 交互式教程
- **[Kaggle Competitions](https://www.kaggle.com/competitions)**: 实战训练场
- **[UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php)**: 标准数据集

### 9.5 进阶阅读
- **[SHAP: A Unified Approach to Interpreting Model Predictions](https://arxiv.org/abs/1705.07874)**: 模型可解释性
- **[Practical Lessons from Predicting Clicks on Ads at Facebook](https://research.facebook.com/publications/practical-lessons-from-predicting-clicks-on-ads-at-facebook/)**: 工业界最佳实践

---
*Last updated: 2026-02-10*
