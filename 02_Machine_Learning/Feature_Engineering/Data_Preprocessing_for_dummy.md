---
title: "数据预处理入门: 清洗、转换、标准化"
category: 02-machine-learning-feature-engineering
tags: ["data-preprocessing", "cleaning", "missing-values", "normalization", "beginner", "for-dummy"]
summary: "面向初学者的数据预处理完整指南。从缺失值处理、异常值检测、数据类型转换到特征缩放，全部用生活化比喻和代码示例讲解。"
created: 2026-06-01
updated: 2026-06-01
---

# 数据预处理入门: 清洗、转换、标准化

> **一句话理解**: 数据预处理就像洗菜切菜——再好的厨师（模型），用发霉的食材（脏数据）也做不出好菜。

---

## 1. 为什么数据预处理比模型更重要？

```
真实世界的数据 vs 理想数据:

理想数据                    真实数据
┌────────┬────────┐        ┌────────┬────────┬────────┐
│ 身高   │ 体重   │        │ 身高   │ 体重   │ 年龄   │
├────────┼────────┤        ├────────┼────────┼────────┤
│ 170    │ 65     │        │ 170    │ 65     │ 25     │
│ 160    │ 55     │        │ 160    │ ???    │ 30     │
│ 180    │ 85     │        │ 180    │ 85     │ -5     │ ← 异常!
└────────┴────────┘        │ ???    │ 70     │ 45     │ ← 缺失!
                           └────────┴────────┴────────┘

模型遇到脏数据的结果:
├── 缺失值 → 报错或预测偏差
├── 异常值 → 模型被"带偏"
├── 量纲不一致 → 大数值特征垄断模型
└── 文本混数字 → 无法计算
```

---

## 2. 缺失值处理

### 2.1 发现缺失值

```python
import pandas as pd
import numpy as np

# 创建示例数据 (模拟真实场景)
df = pd.DataFrame({
    "姓名": ["张三", "李四", "王五", "赵六", "孙七"],
    "年龄": [25, 30, np.nan, 28, np.nan],
    "收入": [5000, np.nan, 8000, np.nan, 6000],
    "城市": ["北京", "上海", "北京", np.nan, "广州"]
})

print("原始数据:")
print(df)

# 查看缺失值
print("\n缺失值统计:")
print(df.isnull().sum())
# 年龄: 2, 收入: 2, 城市: 1

# 查看缺失比例
print("\n缺失比例:")
print(df.isnull().mean() * 100)
```

### 2.2 处理策略

```python
# 策略1: 删除缺失行 (适合缺失很少的情况)
df_drop = df.dropna()
print("删除后:", df_drop.shape)  # (2, 4) — 只剩2行！

# 策略2: 填充固定值
df_fill0 = df.fillna(0)
df_fill_unknown = df.fillna("未知")

# 策略3: 用统计量填充 (最常用)
df["年龄"] = df["年龄"].fillna(df["年龄"].median())   # 中位数 (对异常值鲁棒)
df["收入"] = df["收入"].fillna(df["收入"].mean())     # 均值
df["城市"] = df["城市"].fillna(df["城市"].mode()[0])  # 众数

print("\n填充后:")
print(df)

# 策略4: 按组填充 (更精准)
# 比如: 用同城市的平均年龄填充年龄缺失值
df["年龄"] = df.groupby("城市")["年龄"].transform(
    lambda x: x.fillna(x.median())
)
```

### 2.3 策略选择指南

```
缺失值处理决策树:

缺失比例 < 5%?
├── 是 → 直接删除行 (dropna)
└── 否 → 继续判断

        缺失是否随机?
        ├── 是 → 用统计量填充 (均值/中位数/众数)
        └── 否 → 用模型预测缺失值 或 创建"是否缺失"新特征

特殊场景:
├── 时间序列: 用前后值插值 (interpolate)
├── 分类变量: 用"未知"类别或众数
└── 必须唯一: 身份证号等不能填充，只能删除
```

---

## 3. 异常值检测与处理

### 3.1 什么是异常值？

```
正常数据范围:        异常值:
年龄: 0-120 岁       年龄: -5 岁, 999 岁
收入: 0-100 万       收入: -1000, 10 亿
身高: 50-250 cm      身高: 0.5 cm, 5000 cm
```

### 3.2 检测方法

```python
import matplotlib.pyplot as plt

# 创建含异常值的数据
ages = [25, 30, 28, 35, 29, 31, 27, 150, 26, -5]
incomes = [5000, 6000, 5500, 8000, 5200, 5800, 4900, 1000000, 5100, 6200]

df = pd.DataFrame({"年龄": ages, "收入": incomes})

# 方法1: 箱线图 (Box Plot) — 一目了然
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
df["年龄"].plot.box()
plt.title("年龄箱线图")

plt.subplot(1, 2, 2)
df["收入"].plot.box()
plt.title("收入箱线图")
plt.tight_layout()
plt.show()

# 箱线图解读:
# ├── 盒子中间线: 中位数
# ├── 盒子范围: 25%分位数 ~ 75%分位数
# ├──  whiskers (须): 正常范围
# └── 圆圈点: 异常值！


# 方法2: IQR 法 (统计方法)
def detect_outliers_iqr(series):
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    return series[(series < lower) | (series > upper)]

outliers = detect_outliers_iqr(df["年龄"])
print(f"年龄异常值: {outliers.tolist()}")  # [150, -5]


# 方法3: Z-Score 法 (适合正态分布数据)
from scipy import stats

z_scores = stats.zscore(df["收入"])
outliers_z = df["收入"][abs(z_scores) > 3]  # |Z| > 3 认为是异常
print(f"收入异常值 (Z-Score): {outliers_z.tolist()}")  # [1000000]
```

### 3.3 处理异常值

```python
# 策略1: 删除
df_clean = df[(df["年龄"] > 0) & (df["年龄"] < 120)]
df_clean = df_clean[df_clean["收入"] < 100000]

# 策略2: 截断 (Winsorization)
# 把极端值截断到合理范围的边界
df["年龄"] = df["年龄"].clip(lower=0, upper=120)
df["收入"] = df["收入"].clip(lower=0, upper=50000)

# 策略3: 用中位数替换
median_age = df["年龄"][df["年龄"].between(0, 120)].median()
df["年龄"] = df["年龄"].apply(lambda x: median_age if x < 0 or x > 120 else x)
```

---

## 4. 数据类型转换

### 4.1 数值 vs 类别

```python
df = pd.DataFrame({
    "性别": ["男", "女", "女", "男", "女"],
    "学历": ["本科", "硕士", "本科", "博士", "硕士"],
    "满意度": ["高", "中", "低", "高", "中"],
    "购买次数": ["1", "3", "0", "5", "2"]  # 数字但存成了文本！
})

# 文本数字 → 真正数字
df["购买次数"] = df["购买次数"].astype(int)

# 有序类别 → 数字编码 (满意度: 低 < 中 < 高)
df["满意度_code"] = df["满意度"].map({"低": 0, "中": 1, "高": 2})

# 无序类别 → One-Hot 编码 (性别、学历)
df_encoded = pd.get_dummies(df, columns=["性别", "学历"], prefix=["性别", "学历"])
print(df_encoded.head())

# 结果:
# 满意度  满意度_code  购买次数  性别_女  性别_男  学历_本科  学历_博士  学历_硕士
```

### 4.2 何时用什么编码？

```
编码方式选择:

有序类别 (低/中/高, 小学/中学/大学)
└── 标签编码 (Label Encoding): 0, 1, 2
    └── 模型能理解"顺序"关系

无序类别 (红/绿/蓝, 北京/上海/广州)
└── One-Hot 编码: [1,0,0], [0,1,0], [0,0,1]
    └── 避免模型误以为"北京 < 上海 < 广州"

类别太多 (100+ 个城市)
└── 目标编码 (Target Encoding): 用该类别的平均目标值替换
    └── 或 embeddings (深度学习)
```

---

## 5. 特征缩放 (Feature Scaling)

### 5.1 为什么需要缩放？

```
问题场景:

特征A: 收入 (范围: 3000 ~ 50000)
特征B: 年龄 (范围: 18 ~ 80)

模型计算距离时:
└── 收入差 1000  vs  年龄差 10
└── 收入 dominates！年龄的贡献被淹没

缩放后:
└── 收入和年龄都在 0~1 或 -1~1 范围
└── 两个特征公平参与计算
```

### 5.2 两种常用方法

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# 示例数据
data = pd.DataFrame({
    "收入": [3000, 8000, 5000, 15000, 6000],
    "年龄": [25, 35, 28, 45, 30]
})

# 方法1: 标准化 (Standardization) — 最常用
# 公式: (x - 均值) / 标准差
# 结果: 均值为0，方差为1，范围大致在 [-3, 3]
scaler_std = StandardScaler()
data_std = scaler_std.fit_transform(data)
print("标准化后:")
print(pd.DataFrame(data_std, columns=["收入", "年龄"]))

# 方法2: 归一化 (Normalization) — 适合需要固定范围的场景
# 公式: (x - min) / (max - min)
# 结果: 范围 [0, 1]
scaler_minmax = MinMaxScaler()
data_minmax = scaler_minmax.fit_transform(data)
print("\n归一化后:")
print(pd.DataFrame(data_minmax, columns=["收入", "年龄"]))

# 重要: 保存 scaler，预测时也要用同样的参数！
# scaler 会记住训练数据的均值/标准差
new_data = [ [7000, 32] ]  # 新样本
new_scaled = scaler_std.transform(new_data)
print(f"\n新样本标准化后: {new_scaled}")
```

### 5.3 选择指南

```
StandardScaler (标准化):
├── 数据分布近似正态
├── 算法对异常值不太敏感
├── 适用: 线性回归、逻辑回归、SVM、神经网络
└── 不适用: 数据有明显边界 (如像素值 0-255)

MinMaxScaler (归一化):
├── 数据有明确边界
├── 需要固定范围输出
├── 适用: 神经网络输入、图像像素、KNN
└── 注意: 对异常值敏感 (一个极大值会把其他值压到接近0)
```

---

## 6. 完整预处理 Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# 定义数值特征和类别特征
num_features = ["年龄", "收入"]
cat_features = ["性别", "城市"]

# 数值处理流程: 填充缺失值 → 标准化
num_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

# 类别处理流程: 填充缺失值 → One-Hot 编码
cat_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

# 组合预处理
preprocessor = ColumnTransformer([
    ("num", num_transformer, num_features),
    ("cat", cat_transformer, cat_features)
])

# 完整 Pipeline: 预处理 → 模型
total_pipeline = Pipeline([
    ("preprocess", preprocessor),
    ("model", RandomForestClassifier())
])

# 一键训练！
total_pipeline.fit(X_train, y_train)
predictions = total_pipeline.predict(X_test)
```

---

## 7. 速查表

| 问题 | 解决方案 | 代码 |
|------|----------|------|
| 缺失值 | 填充中位数 | `df.fillna(df.median())` |
| 缺失值 | 删除行 | `df.dropna()` |
| 异常值 | IQR 检测 | `Q3-Q1` 范围外 |
| 异常值 | 截断 | `df.clip(lower, upper)` |
| 文本数字 | 转数值 | `pd.to_numeric()` |
| 有序类别 | 标签编码 | `.map({"低":0, "高":2})` |
| 无序类别 | One-Hot | `pd.get_dummies()` |
| 特征缩放 | 标准化 | `StandardScaler()` |
| 特征缩放 | 归一化 | `MinMaxScaler()` |

---

## Related

- [[02_Machine_Learning/Supervised_Learning/EDA_Quick_Start]] — 探索性数据分析入门
- [[02_Machine_Learning/Feature_Engineering/Feature_Engineering_for_dummy]] — 特征工程小白版
- [[02_Machine_Learning/Supervised_Learning/Your_First_ML_Model]] — 第一个 ML 模型
- [[01_Fundamentals/Python_Data_Science_Toolkit]] — Pandas 基础
