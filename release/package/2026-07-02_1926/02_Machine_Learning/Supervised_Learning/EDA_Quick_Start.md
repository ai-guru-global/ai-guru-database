---
title: "探索性数据分析 (EDA) 快速入门: 10 分钟读懂你的数据"
category: 02-machine-learning-supervised-learning
tags: ["eda", "exploratory-data-analysis", "visualization", "pandas", "beginner", "data-analysis"]
summary: "教会初学者用 5 个核心步骤快速理解数据集：概览统计、分布可视化、相关性分析、异常检测、洞察提炼。全部使用 Pandas + Matplotlib/Seaborn，附完整代码模板。"
created: 2026-06-01
updated: 2026-06-01
tier: supporting
aliases:
  - "Eda Quick Start"
  - "EDA Quick Start"
  - EDA_Quick_Start
sources: []

---
# 探索性数据分析 (EDA) 快速入门: 10 分钟读懂你的数据

> **一句话理解**: EDA 就像相亲前的"背景调查"——在投入感情（训练模型）之前，先了解对方（数据）的基本情况、性格特点（分布）、和潜在风险（异常值）。

---

## 1. EDA 五步速查法

```
EDA 完整流程 (5 步，10 分钟):

Step 1: 数据概览     →  多大？什么类型？缺多少？
Step 2: 单变量分析   →  每个特征长什么样？分布如何？
Step 3: 双变量分析   →  特征之间有关系吗？和目标有关吗？
Step 4: 异常检测     →  有没有"怪胎"数据？
Step 5: 洞察提炼     →  对建模有什么启发？
```

---

## 2. Step 1: 数据概览 (2 分钟)

```python
import pandas as pd
import numpy as np

# 加载数据 (以经典的 Iris 花卉数据集为例)
from sklearn.datasets import load_iris
iris = load_iris()
df = pd.DataFrame(iris.data, columns=iris.feature_names)
df["species"] = [iris.target_names[t] for t in iris.target]

# === 概览四连击 ===
print("1. 形状:", df.shape)           # (150, 5) — 150行，5列
print("\n2. 前5行:")
print(df.head())
print("\n3. 数据类型:")
print(df.dtypes)
print("\n4. 统计摘要:")
print(df.describe())
print("\n5. 缺失值:")
print(df.isnull().sum())
```

**关键问题清单**:
- [ ] 有多少样本？多少特征？
- [ ] 特征是什么类型？（数值/类别/文本/日期）
- [ ] 有缺失值吗？比例多少？
- [ ] 数值特征的均值、中位数、最大最小值合理吗？

---

## 3. Step 2: 单变量分析 (3 分钟)

### 3.1 数值特征分布

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 设置中文显示
plt.rcParams["font.sans-serif"] = ["SimHei", "Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False

# 所有数值特征的分布直方图
df.hist(bins=20, figsize=(12, 8), edgecolor="black")
plt.suptitle("数值特征分布", fontsize=14)
plt.tight_layout()
plt.show()

# 更精致的单特征分析 (以花瓣长度为例)
feature = "petal length (cm)"

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 直方图
sns.histplot(df[feature], kde=True, ax=axes[0], color="skyblue")
axes[0].set_title(f"{feature} 分布")

# 箱线图
sns.boxplot(y=df[feature], ax=axes[1], color="lightgreen")
axes[1].set_title(f"{feature} 箱线图")

# 按类别分组的小提琴图
sns.violinplot(x="species", y=feature, data=df, ax=axes[2], palette="Set2")
axes[2].set_title(f"{feature} 按品种分布")

plt.tight_layout()
plt.show()
```

### 3.2 类别特征分布

```python
# 类别特征计数
print(df["species"].value_counts())

# 可视化
df["species"].value_counts().plot(kind="bar", color=["#FF6B6B", "#4ECDC4", "#45B7D1"])
plt.title("品种分布")
plt.xlabel("品种")
plt.ylabel("数量")
plt.xticks(rotation=0)
plt.show()
```

**分布观察要点**:
- [ ] 是正态分布、偏态分布还是多峰分布？
- [ ] 有没有明显的不平衡？（某个类别占 90%？）
- [ ] 数值范围是否合理？（年龄出现负数？收入 10 亿？）

---

## 4. Step 3: 双变量分析 (3 分钟)

### 4.1 特征 vs 特征

```python
# 相关性热力图 (数值特征之间的关系)
plt.figure(figsize=(8, 6))
corr = df.select_dtypes(include=[np.number]).corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0, 
            square=True, fmt=".2f")
plt.title("特征相关性热力图")
plt.show()

# 解读:
# ┌─────────────────────────────────────┐
# │ 相关系数 r 的范围: -1 ~ +1          │
# │  r = +1: 完全正相关 (一个涨一个涨)  │
# │  r = -1: 完全负相关 (一个涨一个跌)  │
# │  r = 0:  无关                       │
# │  |r| > 0.7: 高度相关 (可能冗余)     │
# └─────────────────────────────────────┘
```

### 4.2 特征 vs 目标

```python
# 散点图矩阵: 看所有特征两两关系
sns.pairplot(df, hue="species", palette="Set2", diag_kind="kde")
plt.suptitle("散点图矩阵 (按品种着色)", y=1.02)
plt.show()

# 单个关系的深入观察
plt.figure(figsize=(8, 6))
sns.scatterplot(x="petal length (cm)", y="petal width (cm)", 
                hue="species", data=df, s=100, palette="Set2")
plt.title("花瓣长度 vs 花瓣宽度")
plt.show()

# 发现: 不同品种在二维平面上明显分开！
# 这意味着: 用这两个特征就能很好分类
```

### 4.3 分组统计

```python
# 按目标分组，看特征差异
grouped = df.groupby("species").agg({
    "sepal length (cm)": ["mean", "std"],
    "petal length (cm)": ["mean", "std"]
})
print(grouped)

# 可视化分组均值
df_melted = df.melt(id_vars=["species"], 
                    value_vars=iris.feature_names,
                    var_name="feature", value_name="value")

plt.figure(figsize=(10, 6))
sns.barplot(x="feature", y="value", hue="species", data=df_melted, palette="Set2")
plt.title("各品种特征均值对比")
plt.xticks(rotation=15)
plt.show()
```

---

## 5. Step 4: 异常检测 (1 分钟)

```python
# 快速异常检测: 箱线图矩阵
num_cols = df.select_dtypes(include=[np.number]).columns

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
axes = axes.flatten()

for i, col in enumerate(num_cols):
    sns.boxplot(y=df[col], ax=axes[i], color="lightblue")
    axes[i].set_title(f"{col} 箱线图")

plt.tight_layout()
plt.show()

# 定量检测
from scipy import stats

for col in num_cols:
    z_scores = np.abs(stats.zscore(df[col]))
    outliers = df[z_scores > 3]
    if len(outliers) > 0:
        print(f"{col}: 发现 {len(outliers)} 个异常值")
    else:
        print(f"{col}: 无异常值")
```

---

## 6. Step 5: 洞察提炼 (1 分钟)

```python
# EDA 报告模板 (可以复制到 notebook 中)

report = f"""
================ EDA 快速报告 ================
数据集: Iris 花卉数据集
样本数: {df.shape[0]}
特征数: {df.shape[1] - 1} (不含目标)

【数据质量】
- 缺失值: {df.isnull().sum().sum()} 个
- 异常值: 未发现
- 类别平衡: {dict(df['species'].value_counts())}

【关键发现】
1. 花瓣长度与花瓣宽度高度相关 (r={corr.loc['petal length (cm)', 'petal width (cm)']:.2f})
2. 花瓣特征能很好区分品种 (散点图明显分离)
3. Setosa 品种明显较小 (花瓣长度 < 2cm)

【建模建议】
- 优先使用花瓣特征 (信息量大)
- 花瓣长度 + 花瓣宽度两个特征可能就足够
- 数据质量高，无需复杂预处理
- 适合作为分类问题入门数据集
=============================================
"""
print(report)
```

---

## 7. EDA 代码模板 (复制即用)

```python
"""
通用 EDA 模板 —— 拿到任何数据集，先跑一遍这个
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

def quick_eda(df, target_col=None):
    """10分钟快速EDA"""
    
    print("=" * 50)
    print("Step 1: 数据概览")
    print("=" * 50)
    print(f"形状: {df.shape}")
    print(f"\n数据类型:\n{df.dtypes}")
    print(f"\n缺失值:\n{df.isnull().sum()}")
    print(f"\n统计摘要:\n{df.describe()}")
    
    print("\n" + "=" * 50)
    print("Step 2: 单变量分析")
    print("=" * 50)
    
    num_cols = df.select_dtypes(include=[np.number]).columns
    cat_cols = df.select_dtypes(include=["object", "category"]).columns
    
    # 数值分布
    if len(num_cols) > 0:
        df[num_cols].hist(bins=20, figsize=(12, 8), edgecolor="black")
        plt.suptitle("数值特征分布")
        plt.tight_layout()
        plt.show()
    
    # 类别分布
    if len(cat_cols) > 0:
        for col in cat_cols:
            print(f"\n{col} 分布:")
            print(df[col].value_counts().head(10))
    
    print("\n" + "=" * 50)
    print("Step 3: 双变量分析")
    print("=" * 50)
    
    # 相关性
    if len(num_cols) > 1:
        plt.figure(figsize=(8, 6))
        sns.heatmap(df[num_cols].corr(), annot=True, cmap="coolwarm", center=0)
        plt.title("相关性热力图")
        plt.show()
    
    # 与目标的关系
    if target_col and target_col in df.columns:
        if df[target_col].dtype == "object" or df[target_col].nunique() < 10:
            for col in num_cols[:3]:  # 只看前3个数值特征
                plt.figure(figsize=(8, 4))
                sns.boxplot(x=target_col, y=col, data=df)
                plt.title(f"{col} vs {target_col}")
                plt.show()
    
    print("\n" + "=" * 50)
    print("Step 4: 异常检测")
    print("=" * 50)
    
    for col in num_cols:
        z = np.abs(stats.zscore(df[col].dropna()))
        n_outliers = (z > 3).sum()
        if n_outliers > 0:
            print(f"{col}: {n_outliers} 个潜在异常值 (|Z| > 3)")
    
    print("\nEDA 完成！")

# 使用方法:
# quick_eda(your_dataframe, target_col="target")
```

---

## 8. 不同数据类型的 EDA 策略

| 数据类型 | 重点观察 | 常用图表 |
|----------|----------|----------|
| **数值连续** | 分布、偏度、异常值 | 直方图、箱线图、KDE |
| **数值离散** | 取值范围、频次 | 柱状图、计数表 |
| **类别** | 类别数量、平衡性 | 计数柱状图、饼图 |
| **时间序列** | 趋势、季节性、周期 | 折线图、ACF/PACF |
| **文本** | 长度分布、高频词 | 词云、长度直方图 |
| **图像** | 尺寸分布、样本可视化 | 网格展示、像素直方图 |

---

## Related

- [[机器学习/Feature_Engineering/Data_Preprocessing_for_dummy]] — 数据清洗与预处理
- [[机器学习/Feature_Engineering/Feature_Engineering_for_dummy]] — 特征工程入门
- [[数学基础/Python_Data_Science_Toolkit]] — Pandas + Matplotlib 基础
- [[机器学习/Supervised_Learning/Your_First_ML_Model]] — 建模实战
