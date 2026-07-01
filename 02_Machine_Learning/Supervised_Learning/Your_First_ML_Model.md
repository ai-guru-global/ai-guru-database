---
title: "你的第一个 ML 模型: 从数据到预测（30 分钟实战）"
category: 02-machine-learning-supervised-learning
tags: ["machine-learning", "scikit-learn", "beginner", "tutorial", "first-model", "supervised-learning"]
summary: "零基础动手训练第一个真实机器学习模型。从加载数据、预处理、训练、评估到预测新样本，完整走通 ML 全流程。使用 scikit-learn 和经典 Titanic 数据集。"
created: 2026-06-01
updated: 2026-06-01
tier: supporting
aliases:
  - "Your First Ml Model"
  - "Your First ML Model"
  - Your_First_ML_Model

---
# 你的第一个 ML 模型: 从数据到预测（30 分钟实战）

> **一句话理解**: 读完本文，你将亲手训练一个能预测"泰坦尼克号乘客是否生还"的 AI 模型——从零开始，只需 30 分钟。

---

## 1. 机器学习全流程概览

```
机器学习项目五步法:

┌─────────────────────────────────────────────────────────────┐
│  Step 1          Step 2          Step 3          Step 4    │
│  加载数据   →   预处理    →   训练模型   →   评估模型     │
│                                                              │
│  .csv文件        清洗/填充        算法学习        准确率    │
│  图片文件夹      标准化           找规律           混淆矩阵  │
│  数据库          划分训练/测试    调参数           ROC曲线   │
│                                                              │
│                           ↓                                  │
│                     Step 5: 预测新数据                       │
│                     输入 → 模型 → 输出                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Step 1: 加载数据

### 2.1 数据集介绍

我们将使用 **Titanic 数据集**——机器学习的"Hello World"。

```
目标: 预测乘客是否在泰坦尼克号沉船中生还

数据示例:
┌────────┬────────┬──────┬────────┬──────────┬────────┐
│ 乘客ID │ 船舱等级 │ 性别 │ 年龄   │ 兄弟姐妹 │ 是否生还 │
├────────┼────────┼──────┼────────┼──────────┼────────┤
│ 1      │ 3      │ male │ 22     │ 1        │ 0      │
│ 2      │ 1      │ female│ 38    │ 1        │ 1      │
│ 3      │ 3      │ female│ 26    │ 0        │ 1      │
└────────┴────────┴──────┴────────┴──────────┴────────┘

是否生还: 0 = 遇难, 1 = 生还
```

### 2.2 代码实现

```python
import pandas as pd
import numpy as np

# 加载数据 (Kaggle Titanic 数据集)
train_df = pd.read_csv("train.csv")
test_df = pd.read_csv("test.csv")

print(f"训练集大小: {train_df.shape}")  # (891, 12)
print(f"测试集大小: {test_df.shape}")   # (418, 11)

# 查看前几行
print(train_df.head())

# 查看数据信息
print(train_df.info())
```

---

## 3. Step 2: 数据预处理

### 3.1 处理缺失值

```python
# 查看缺失值
print(train_df.isnull().sum())
# Age: 177 个缺失
# Cabin: 687 个缺失 (太多，直接丢弃)
# Embarked: 2 个缺失

# 填充年龄缺失值 (用中位数，对异常值更鲁棒)
train_df["Age"].fillna(train_df["Age"].median(), inplace=True)
test_df["Age"].fillna(test_df["Age"].median(), inplace=True)

# 填充登船港口缺失值 (用众数)
train_df["Embarked"].fillna(train_df["Embarked"].mode()[0], inplace=True)

# 填充票价缺失值
test_df["Fare"].fillna(test_df["Fare"].median(), inplace=True)

# 丢弃 Cabin 列 (缺失太多)
train_df = train_df.drop("Cabin", axis=1)
test_df = test_df.drop("Cabin", axis=1)
```

### 3.2 转换文本为数字

```python
# 机器学习模型只能处理数字，需要转换性别和登船港口

# 性别: male=0, female=1
train_df["Sex"] = train_df["Sex"].map({"male": 0, "female": 1})
test_df["Sex"] = test_df["Sex"].map({"male": 0, "female": 1})

# 登船港口: 用 One-Hot 编码
embarked_train = pd.get_dummies(train_df["Embarked"], prefix="Embarked")
embarked_test = pd.get_dummies(test_df["Embarked"], prefix="Embarked")

train_df = pd.concat([train_df, embarked_train], axis=1)
test_df = pd.concat([test_df, embarked_test], axis=1)

# 丢弃不需要的列
features_to_drop = ["PassengerId", "Name", "Ticket", "Embarked"]
train_df = train_df.drop(features_to_drop, axis=1)
test_df = test_df.drop(features_to_drop, axis=1)

print("预处理后:")
print(train_df.head())
```

### 3.3 准备特征和标签

```python
# 特征 (X): 除目标外的所有列
X = train_df.drop("Survived", axis=1)

# 标签 (y): 要预测的目标
y = train_df["Survived"]

print(f"特征矩阵: {X.shape}")  # (891, 8)
print(f"标签向量: {y.shape}")  # (891,)
```

---

## 4. Step 3: 训练模型

### 4.1 划分训练集和验证集

```python
from sklearn.model_selection import train_test_split

# 80% 训练, 20% 验证
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"训练集: {X_train.shape}")
print(f"验证集: {X_val.shape}")
```

### 4.2 选择并训练模型

```python
from sklearn.ensemble import RandomForestClassifier

# 创建模型
# n_estimators: 森林中树的数量
# random_state: 固定随机种子，结果可复现
model = RandomForestClassifier(n_estimators=100, random_state=42)

# 训练 (这就是 "fit" —— 让模型从数据中学习规律)
print("开始训练...")
model.fit(X_train, y_train)
print("训练完成！")
```

### 4.3 训练过程发生了什么？

```
RandomForest 训练过程:

1. 从训练集中随机抽取多个子集 (Bootstrap)
2. 对每个子集训练一棵决策树
   └── 每棵树问一系列问题: "年龄 > 30?" "性别 = 女?"
   └── 直到把数据分到很细的组
3. 最后有 100 棵树，每棵树都学会了一些规律
4. 预测时，100 棵树投票，多数票决定结果

为什么有效?
├── 单棵树容易"过拟合"(死记硬背)
└── 100 棵树平均后，误差互相抵消，更稳健
```

---

## 5. Step 4: 评估模型

### 5.1 基础指标

```python
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# 在验证集上预测
y_pred = model.predict(X_val)

# 准确率
acc = accuracy_score(y_val, y_pred)
print(f"准确率: {acc:.2%}")
# 预期: 80%-85%

# 详细报告
print("\n分类报告:")
print(classification_report(y_val, y_pred, target_names=["遇难", "生还"]))
```

### 5.2 混淆矩阵可视化

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 混淆矩阵
cm = confusion_matrix(y_val, y_pred)

plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=["预测遇难", "预测生还"],
            yticklabels=["真实遇难", "真实生还"])
plt.ylabel("真实标签")
plt.xlabel("预测标签")
plt.title("混淆矩阵")
plt.show()

# 解读:
# ┌─────────┬─────────┐
# │ 真阴性  │ 假阳性  │
# │ (正确)  │ (误报)  │
# ├─────────┼─────────┤
# │ 假阴性  │ 真阳性  │
# │ (漏报)  │ (正确)  │
# └─────────┴─────────┘
```

### 5.3 特征重要性

```python
# 看看哪些特征对预测最重要
importances = pd.DataFrame({
    "feature": X.columns,
    "importance": model.feature_importances_
}).sort_values("importance", ascending=False)

print(importances)

# 可视化
plt.figure(figsize=(8, 5))
sns.barplot(data=importances, x="importance", y="feature", palette="viridis")
plt.title("特征重要性: 什么因素最影响生还率？")
plt.xlabel("重要性")
plt.show()

# 通常你会发现:
# 1. 性别 (女性优先上救生艇)
# 2. 船舱等级 (头等舱更靠近甲板)
# 3. 票价 ( correlate with 船舱等级)
```

---

## 6. Step 5: 预测新数据

```python
# 在测试集上做最终预测
test_predictions = model.predict(test_df)

# 查看前10个预测
print("前10位乘客的预测结果:")
for i in range(10):
    result = "生还" if test_predictions[i] == 1 else "遇难"
    print(f"  乘客 {i+1}: {result}")

# 保存结果 (Kaggle 提交格式)
submission = pd.DataFrame({
    "PassengerId": range(892, 892 + len(test_predictions)),
    "Survived": test_predictions
})
submission.to_csv("my_first_submission.csv", index=False)
print("\n结果已保存到 my_first_submission.csv")
```

---

## 7. 如何提升表现？

```python
# 方法1: 调参 (Grid Search)
from sklearn.model_selection import GridSearchCV

param_grid = {
    "n_estimators": [50, 100, 200],
    "max_depth": [3, 5, 7, None],
    "min_samples_split": [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,           # 5折交叉验证
    scoring="accuracy",
    n_jobs=-1       # 使用所有CPU核心
)

grid_search.fit(X_train, y_train)
print(f"最佳参数: {grid_search.best_params_}")
print(f"最佳准确率: {grid_search.best_score_:.2%}")

# 方法2: 尝试其他算法
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

models = {
    "逻辑回归": LogisticRegression(max_iter=1000),
    "支持向量机": SVC(),
    "随机森林": RandomForestClassifier(n_estimators=100)
}

for name, m in models.items():
    m.fit(X_train, y_train)
    score = m.score(X_val, y_val)
    print(f"{name}: {score:.2%}")
```

---

## 8. 你刚完成了什么？

```
✅ 加载真实数据集 (CSV)
✅ 处理缺失值 (填充/删除)
✅ 文本转数字 (映射/One-Hot)
✅ 划分训练/验证集
✅ 训练 RandomForest 模型
✅ 评估模型 (准确率/混淆矩阵)
✅ 理解特征重要性
✅ 预测新样本并保存结果
```

**这就是机器学习的完整流程**——无论多复杂的项目，核心都是这 5 步。

---

## 9. 下一步

- **[[03_Deep_Learning/Neural_Network_Core/Your_First_Neural_Network|你的第一个神经网络]]** — 用 PyTorch 训练神经网络
- **[[02_Machine_Learning/ML_Algorithms_Cheatsheet|经典算法速查表]]** — 了解其他 ML 算法
- **[[02_Machine_Learning/Feature_Engineering/Feature_Engineering_for_dummy|特征工程入门]]** — 让模型表现更好
- **[[08_Model_Evaluation/Model_Evaluation_for_dummy|模型评估入门]]** — 深入理解准确率之外的指标

---

## Related

- [[01_Fundamentals/Python_for_AI_Basics]] — Python 语法基础
- [[01_Fundamentals/Python_Data_Science_Toolkit]] — NumPy / Pandas / Matplotlib
- [[01_Fundamentals/AI_Development_Environment_Setup]] — 环境配置
- [[02_Machine_Learning/ML_Algorithms_Cheatsheet]] — 经典算法速查
- [[_synthesis/python-data-science-pipeline|Python × 数据科学]] — 入门到实战
- [[_synthesis/python-first-ml-model|Python 基础 × 第一个 ML 模型]] — 从零到一的实战桥梁
