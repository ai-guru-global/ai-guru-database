---
title: "Python 数据科学工具链: NumPy + Pandas + Matplotlib + Scikit-learn"
category: 01-fundamentals
tags: ["python", "numpy", "pandas", "matplotlib", "scikit-learn", "data-science", "toolkit"]
summary: "AI 开发者必备的四大利器速成。NumPy 做矩阵运算，Pandas 处理表格数据，Matplotlib 画可视化，Scikit-learn 训练第一个模型。全部用 AI 真实场景举例。"
created: 2026-06-01
updated: 2026-06-01
tier: supporting
aliases:
  - "Python Data Science Toolkit"
  - Python_Data_Science_Toolkit
sources: []

---
# Python 数据科学工具链: NumPy + Pandas + Matplotlib + Scikit-learn

> **一句话理解**: NumPy 是计算器，Pandas 是 Excel，Matplotlib 是画笔，Scikit-learn 是模型工厂——四者组合，就能完成 80% 的 AI 数据工作。

---

## 1. NumPy: 矩阵与张量运算

### 1.1 为什么需要 NumPy？

```
Python 原生列表 vs NumPy 数组:

Python 列表: [1, 2, 3] + [4, 5, 6] = [1, 2, 3, 4, 5, 6]  ← 拼接！
NumPy 数组: np.array([1,2,3]) + np.array([4,5,6]) = [5, 7, 9]  ← 逐元素相加！

AI 场景中:
├── 图片 = 三维数组 (高 × 宽 × 通道)
├── 一批图片 = 四维数组 (样本数 × 高 × 宽 × 通道)
├── 模型权重 = 二维/多维矩阵
└── 向量运算 = 神经网络的血液
```

### 1.2 核心操作

```python
import numpy as np

# 创建数组
image = np.zeros((224, 224, 3))       # 一张黑色图片 (高224, 宽224, 3通道RGB)
weights = np.random.randn(784, 256)    # 模型权重: 正态分布随机初始化
labels = np.array([0, 1, 0, 1, 1])    # 5个样本的标签

# 形状与维度 (AI 调试时最常用)
print(weights.shape)   # (784, 256) — 784输入特征，256神经元
print(weights.ndim)    # 2 — 二维矩阵

# 切片: 取前10张图片的前3个通道
batch = np.random.rand(100, 224, 224, 3)
first_10 = batch[:10, :, :, :3]
print(first_10.shape)  # (10, 224, 224, 3)

# 矩阵乘法 (神经网络前向传播的核心)
X = np.random.rand(32, 784)      # 32个样本，每个784维
W = np.random.rand(784, 256)     # 权重矩阵
output = X @ W                   # 矩阵乘法，结果: (32, 256)
print(output.shape)              # (32, 256)

# 广播机制: 不同形状数组自动对齐
scores = np.array([[0.1, 0.9],   # 2个样本，2类预测分数
                   [0.8, 0.2]])
bias = np.array([0.01, -0.01])   # 每个类别加一个偏置
result = scores + bias           # 自动广播到 (2, 2)
print(result)
# [[0.11 0.89]
#  [0.81 0.19]]

# 统计运算
losses = np.array([0.9, 0.7, 0.5, 0.3, 0.2])
print(f"平均损失: {losses.mean():.3f}")      # 0.520
print(f"最小损失: {losses.min():.3f}")       # 0.200
print(f"损失标准差: {losses.std():.3f}")     # 0.271
```

---

## 2. Pandas: 表格数据处理

### 2.1 为什么需要 Pandas？

```
AI 中的数据通常是表格:

┌────────┬────────┬────────┬────────┐
│ 身高   │ 体重   │ 年龄   │ 患病   │
├────────┼────────┼────────┼────────┤
│ 170    │ 65     │ 25     │ 0      │
│ 160    │ 55     │ 30     │ 0      │
│ 180    │ 85     │ 45     │ 1      │
└────────┴────────┴────────┴────────┘

Pandas 让你像操作 Excel 一样操作数据，但比 Excel 快 100 倍。
```

### 2.2 核心操作

```python
import pandas as pd

# 读取数据 (AI 最常用的操作)
df = pd.read_csv("patients.csv")   # 从 CSV 读取
df = pd.read_excel("data.xlsx")    # 从 Excel 读取

# 查看数据概况
print(df.head(5))        # 前5行
print(df.shape)          # (行数, 列数)
print(df.dtypes)         # 每列的数据类型
print(df.describe())     # 统计摘要 (均值/标准差/最大最小)

# 选择列 (特征选择)
features = df[ ["身高", "体重", "年龄"] ]  # 选取3个特征列
labels = df["患病"]                       # 选取目标列

# 筛选行 (数据清洗)
adults = df[df["年龄"] >= 18]           # 只保留成年人
healthy = df[df["患病"] == 0]           # 只保留健康人

# 处理缺失值
print(df.isnull().sum())                 # 查看每列缺失值数量
df_clean = df.dropna()                   # 删除缺失行
df_filled = df.fillna(df.mean())         # 用均值填充缺失值

# 新增列 (特征工程)
df["BMI"] = df["体重"] / (df["身高"] / 100) ** 2
print(df[ ["身高", "体重", "BMI"] ].head())

# 分组统计
grouped = df.groupby("患病")["年龄"].mean()
print(grouped)
# 患病
# 0    32.5
# 1    48.2
```

---

## 3. Matplotlib: 数据可视化

### 3.1 为什么需要可视化？

```
AI 中的可视化场景:
├── 训练曲线: 损失下降、准确率上升
├── 数据分布: 查看是否有异常值
├── 特征关系: 散点图看相关性
├── 模型结果: 混淆矩阵、ROC 曲线
└── 图像样本: 查看训练数据长什么样
```

### 3.2 核心操作

```python
import matplotlib.pyplot as plt

# 训练曲线 (最常用)
epochs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
train_loss = [0.9, 0.7, 0.55, 0.45, 0.38, 0.32, 0.28, 0.25, 0.23, 0.21]
val_acc = [0.65, 0.72, 0.78, 0.82, 0.85, 0.87, 0.88, 0.89, 0.90, 0.90]

plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.plot(epochs, train_loss, "b-o", label="Train Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Training Loss Curve")
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(epochs, val_acc, "g-s", label="Val Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.title("Validation Accuracy")
plt.legend()

plt.tight_layout()
plt.savefig("training_curve.png")  # 保存图片
plt.show()

# 散点图: 看特征关系
plt.scatter(df["身高"], df["体重"], c=df["患病"], cmap="coolwarm", alpha=0.6)
plt.xlabel("Height")
plt.ylabel("Weight")
plt.title("Height vs Weight (Red = Sick)")
plt.colorbar()
plt.show()

# 柱状图: 类别分布
df["患病"].value_counts().plot(kind="bar", color=["green", "red"])
plt.title("Class Distribution")
plt.xticks([0, 1], ["Healthy", "Sick"], rotation=0)
plt.show()
```

---

## 4. Scikit-learn: 机器学习模型

### 4.1 为什么用 Scikit-learn？

```
Scikit-learn 是经典机器学习的"瑞士军刀":
├── 内置几十种算法 (决策树、SVM、随机森林...)
├── 统一的 API: 所有模型都是 fit() + predict()
├── 内置数据集、评估指标、交叉验证
└── 文档完善，适合学习算法原理
```

### 4.2 统一 API 模式

```python
from sklearn import 某个模型

# 1. 创建模型
model = 某个模型(超参数)

# 2. 训练 (喂数据)
model.fit(X_train, y_train)

# 3. 预测
predictions = model.predict(X_test)

# 4. 评估
score = model.score(X_test, y_test)
```

### 4.3 完整示例: 鸢尾花分类

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. 加载内置数据集
iris = load_iris()
X, y = iris.data, iris.target
print(f"数据集大小: {X.shape}")  # (150, 4) — 150个样本，4个特征

# 2. 划分训练集/测试集 (80%训练，20%测试)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. 特征标准化 (均值为0，方差为1)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 4. 创建并训练模型
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. 预测与评估
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"准确率: {acc:.2%}")
print(classification_report(y_test, y_pred, target_names=iris.target_names))

# 6. 预测新样本
new_flower = [ [5.1, 3.5, 1.4, 0.2] ]  # 一朵新花的数据
new_flower_scaled = scaler.transform(new_flower)
predicted_class = model.predict(new_flower_scaled)
print(f"预测结果: {iris.target_names[predicted_class[0]]}")
```

---

## 5. 四库协作实战: 完整 ML 工作流

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Step 1: Pandas 加载数据
df = pd.read_csv("data.csv")

# Step 2: Pandas 清洗数据
df = df.dropna()  # 删除缺失值
X = df.drop("target", axis=1)  # 特征
y = df["target"]               # 标签

# Step 3: NumPy 底层运算 (Pandas 基于 NumPy)
print(f"特征矩阵形状: {X.values.shape}")  # 转为 NumPy 数组

# Step 4: Scikit-learn 训练模型
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

model = RandomForestClassifier()
model.fit(X_train_s, y_train)

# Step 5: Matplotlib 可视化结果
importances = model.feature_importances_
features = X.columns

plt.barh(features, importances)
plt.xlabel("Importance")
plt.title("Feature Importance")
plt.show()
```

---

## 6. 安装命令速查

```bash
# 方式1: pip 单独安装
pip install numpy pandas matplotlib scikit-learn

# 方式2: conda 安装 (推荐)
conda install numpy pandas matplotlib scikit-learn

# 方式3: 安装完整数据科学套装
pip install jupyter notebook  # 交互式编程环境
```

---

## Related

- [[01_数学基础/Python_for_AI_Basics]] — Python 语法基础
- [[01_数学基础/AI_Development_Environment_Setup]] — Jupyter / Conda / GPU 环境
- [[02_机器学习/02_Supervised_Learning/Your_First_ML_Model]] — 你的第一个 ML 模型实战
- [[02_机器学习/ML_Algorithms_Cheatsheet]] — 经典算法速查表
- [[治理/python-data-science-pipeline|Python × 数据科学]] — 从语法到实战
- [[治理/python-first-ml-model|Python 基础 × 第一个 ML 模型]] — 从零到一的实战桥梁
- [[94_可视化/Data_Visualization_Best_Practices|数据可视化最佳实践]] — 图表选择、配色与交互式可视化
