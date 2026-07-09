---
title: "Python for AI: 零基础到能写 AI 代码"
category: 01-fundamentals
tags: ["python", "programming", "basics", "ai-basics", "for-beginners"]
summary: "面向 AI 学习者的 Python 速成指南。不需要编程背景，从安装到语法、数据结构、函数、文件操作，全部用 AI 场景举例。读完即可看懂并修改机器学习代码。"
created: 2026-06-01
updated: 2026-06-01
tier: supporting
aliases:
  - "Python For Ai Basics"
  - "Python for AI Basics"
  - Python_for_AI_Basics

---
# Python for AI: 零基础到能写 AI 代码

> **一句话理解**: Python 是 AI 领域的"通用语"——就像学英语是为了读论文，学 Python 是为了让 AI 听你的指令。

---

## 1. 为什么 AI 都用 Python？

```
Python 在 AI 中的角色:

┌─────────────────────────────────────────────────────────────┐
│                    AI 技术栈中的 Python                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  你 (人类)                                                   │
│    │                                                         │
│    ▼                                                         │
│  Python 代码  ←── 简单、易读、像英语                        │
│    │                                                         │
│    ▼                                                         │
│  NumPy / PyTorch / TensorFlow                               │
│    │                                                         │
│    ▼                                                         │
│  C/C++ / CUDA  ←── 底层高性能计算 (你不用写)                │
│    │                                                         │
│    ▼                                                         │
│  GPU / TPU  ←── 硬件加速                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

关键优势:
├── 语法简单: 接近自然语言，1周可上手
├── 生态庞大: 99% 的 AI 论文都提供 Python 代码
├── 交互友好: Jupyter 中写一行看一行结果
└── 社区活跃: 任何问题 StackOverflow 都有答案
```

---

## 2. 安装与运行

### 2.1 安装 Python

**Windows/Mac 最简单方式**: 安装 [Anaconda](https://www.anaconda.com/download)（自带 Python + 常用库）

**验证安装**:
```bash
# 打开终端 (Terminal / CMD / PowerShell)
python --version
# 输出类似: Python 3.11.5
```

### 2.2 三种运行 Python 的方式

```
方式1: 交互式 (适合探索)
─────────────────────────────
$ python
>>> 2 + 3
5
>>> exit()

方式2: 脚本文件 (适合完整程序)
─────────────────────────────
# 新建文件 hello.py，内容:
print("Hello AI!")

# 运行:
$ python hello.py
Hello AI!

方式3: Jupyter Notebook (AI 最常用)
─────────────────────────────
# 安装: pip install jupyter
# 启动: jupyter notebook
# 在浏览器中写代码，即时看到结果
```

---

## 3. 核心语法（AI 场景版）

### 3.1 变量与数据类型

```python
# 变量就像"盒子"，装不同类型的数据

# 数字 (模型参数、损失值)
learning_rate = 0.001      # 小数 (浮点数)
epochs = 10                # 整数
batch_size = 32

# 字符串 (文本数据、标签)
dataset_name = "ImageNet"
model_type = 'ResNet'

# 布尔值 (判断、开关)
is_training = True
use_gpu = False

# 空值 (缺失数据)
unknown_value = None

# 查看类型
print(type(learning_rate))  # <class 'float'>
print(type(dataset_name))   # <class 'str'>
```

### 3.2 列表与字典（AI 最常用的结构）

```python
# 列表 (List): 有序集合，类似数组
# 用途: 存储一批数据样本、一组准确率

accuracies = [0.72, 0.85, 0.91, 0.93]  # 4轮训练的准确率
image_paths = ["cat1.jpg", "dog1.jpg", "cat2.jpg"]  # 图片路径

# 常用操作
print(len(accuracies))       # 4 (长度)
print(accuracies[0])         # 0.72 (第1个，索引从0开始)
print(accuracies[-1])        # 0.93 (最后1个)
print(accuracies[1:3])       # [0.85, 0.91] (切片)

accuracies.append(0.95)      # 添加元素
print(accuracies)            # [0.72, 0.85, 0.91, 0.93, 0.95]

# 字典 (Dict): 键值对映射
# 用途: 存储模型配置、超参数

model_config = {
    "name": "ResNet50",
    "layers": 50,
    "learning_rate": 0.001,
    "batch_size": 32,
    "optimizer": "Adam"
}

print(model_config["name"])       # ResNet50
print(model_config.get("layers")) # 50
model_config["epochs"] = 100      # 添加新键值对
```

### 3.3 条件与循环

```python
# if 语句: 判断逻辑
accuracy = 0.89

if accuracy >= 0.95:
    print("优秀，可以部署了！")
elif accuracy >= 0.85:
    print("不错，再调调参。")   # 会打印这行
else:
    print("还需要改进。")


# for 循环: 遍历数据
# 场景: 遍历训练轮次，打印每轮结果

for epoch in range(5):  # 0, 1, 2, 3, 4
    loss = 1.0 / (epoch + 1)  # 模拟损失下降
    print(f"Epoch {epoch}: loss = {loss:.4f}")

# 输出:
# Epoch 0: loss = 1.0000
# Epoch 1: loss = 0.5000
# Epoch 2: loss = 0.3333
# Epoch 3: loss = 0.2500
# Epoch 4: loss = 0.2000


# 遍历列表
models = ["ResNet", "VGG", "Transformer"]
for model in models:
    print(f"正在评测模型: {model}")
```

### 3.4 函数

```python
# 函数: 封装可复用的代码块
# 场景: 计算准确率、数据预处理

def calculate_accuracy(correct, total):
    """计算准确率"""
    return correct / total

acc = calculate_accuracy(correct=85, total=100)
print(f"准确率: {acc:.2%}")  # 准确率: 85.00%


# 默认参数 (AI 配置常用)
def train_model(model_name, epochs=10, lr=0.001):
    """训练模型，有默认超参数"""
    print(f"训练 {model_name}, 轮数={epochs}, 学习率={lr}")

train_model("ResNet")                    # 使用默认值
train_model("BERT", epochs=5, lr=2e-5)   # 自定义参数
```

---

## 4. 文件操作与数据加载

```python
# 读取 CSV 数据 (AI 最常用)
import csv

with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # 每行是一个列表

# 读取文本文件 (语料、日志)
with open("article.txt", "r", encoding="utf-8") as f:
    text = f.read()
    print(f"文章字数: {len(text)}")

# 保存结果
with open("results.txt", "w", encoding="utf-8") as f:
    f.write("训练完成！\n")
    f.write("准确率: 92.3%\n")
```

---

## 5. 错误处理（让程序更稳定）

```python
# 场景: 读取可能损坏的数据文件
try:
    with open("model_weights.pkl", "rb") as f:
        weights = load(f)
except FileNotFoundError:
    print("错误: 权重文件不存在，请先训练模型。")
except Exception as e:
    print(f"未知错误: {e}")
```

---

## 6. 下一步

掌握以上内容后，你已经可以：
- ✅ 读懂 80% 的机器学习教程代码
- ✅ 修改超参数、调整数据路径
- ✅ 运行 Jupyter Notebook 中的示例

接下来建议学习：
- **[[数学基础/Python_Data_Science_Toolkit|Python 数据科学工具链]]** — NumPy / Pandas / Matplotlib
- **[[数学基础/AI_Development_Environment_Setup|AI 开发环境配置]]** — Jupyter / Conda / GPU
- **[[机器学习/Supervised_Learning/Your_First_ML_Model|你的第一个 ML 模型]]** — 用 scikit-learn 训练真实模型

---

## 7. 速查表

| 语法 | 示例 | AI 场景 |
|------|------|---------|
| 变量赋值 | `x = 10` | 存储超参数 |
| 列表 | `data = [1, 2, 3]` | 存储一批样本 |
| 字典 | `config = {"lr": 0.01}` | 模型配置 |
| for 循环 | `for i in range(10)` | 遍历训练轮次 |
| if 判断 | `if acc > 0.9` | 判断是否达标 |
| 函数 | `def train(): ...` | 封装训练逻辑 |
| 文件读取 | `open("data.csv")` | 加载数据集 |
| f-string | `f"acc={acc:.2f}"` | 格式化输出结果 |

---

## Related

- [[数学基础/Python_Data_Science_Toolkit]] — NumPy / Pandas / Matplotlib / Scikit-learn
- [[数学基础/AI_Development_Environment_Setup]] — Jupyter / Conda / Colab / GPU
- [[数学基础/Linear_Algebra/Linear_Algebra_for_dummy]] — 线代基础
- [[AI入门/AI_Fundamentals_for_dummy]] — AI 概念小白版
- [[_synthesis/python-data-science-pipeline|Python × 数据科学]] — AI 入门完整工具链
