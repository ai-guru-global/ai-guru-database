---
title: "Snorkel AI (数据编程与弱监督学习平台)"
category: -concepts
tags: ["weak-supervision", "data-programming", "labeling", "llm-training", "enterprise"]
relationships:
  - target: "概念/label-studio"
    type: related_to
  - target: "概念/feast"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "斯坦福开源的数据编程平台，通过弱监督学习（Weak Supervision）自动生成训练标签，减少 90% 的人工标注需求，企业版支持 LLM 数据工程。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.78
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
---

# Snorkel AI

[Snorkel AI](https://github.com/snorkel-team/snorkel) 源自斯坦福大学的**数据编程（Data Programming）和弱监督学习（Weak Supervision）**平台。其核心思想是：**用编程代替标注**——开发者编写"标注函数"（Labeling Functions）来描述数据中的模式，Snorkel 通过概率模型自动聚合多个弱标注源，生成高质量的训练标签，减少 90%+ 的人工标注需求。

## 核心原理

### 弱监督学习

```
传统标注: 人工标注 10,000 条 → 训练模型
弱监督:   编写 10 个标注函数 → 自动标注 100,000 条 → 训练模型

标注函数示例:
- "如果文本包含'not good' → 负面"
- "如果评分 < 3 → 负面"
- "如果包含感叹号 → 正面 (弱信号)"
```

## 核心特性

### 标注函数 (Labeling Functions)

```python
from snorkel.labeling import labeling_function

@labeling_function()
def text_contains_negative(x):
    return 1 if "not good" in x.text.lower() else -1  # 1=负面, -1=弃权

@labeling_function()
def rating_based(x):
    if x.rating < 3: return 1   # 负面
    elif x.rating > 4: return 0  # 正面
    return -1                     # 弃权

@labeling_function()
def keyword_positive(x):
    positive_words = ["great", "excellent", "amazing"]
    return 0 if any(w in x.text.lower() for w in positive_words) else -1
```

### 标签模型 (Label Model)

```python
from snorkel.labeling import LabelModel

# 聚合多个标注函数的输出
label_model = LabelModel(cardinality=2, verbose=True)
label_model.fit(L_train, n_epochs=500)

# 生成概率标签
train_labels = label_model.predict_proba(L_train)
# → 每条数据得到一个概率标签 [P(正面), P(负面)]
```

### Snorkel Flow (企业版)

企业版增加:
- **LLM 数据工程**: 为 LLM 微调构建高质量数据
- **可视化标注函数**: 低代码标注函数编写
- **数据质量监控**: 训练数据持续质量追踪
- **多模态**: 图像/文本/表格的弱监督

## 典型应用场景

- **大规模标注**: 需要大量训练数据但标注资源有限
- **LLM 数据工程**: 为 SFT/DPO 构建高质量训练数据
- **隐私数据**: 无法人工标注的敏感数据
- **快速迭代**: 需要频繁更新训练标签

## 安装

```bash
pip install snorkel
```

## 参考资源

- [Snorkel GitHub](https://github.com/snorkel-team/snorkel)
- [Snorkel AI 官网](https://snorkel.ai/)
- [Snorkel 论文 (VLDB 2020)](https://www.vldb.org/pvldb/vol13/p2350-ratner.pdf)

## 相关概念

- [[概念/label-studio]] — Label Studio 开源数据标注平台
- [[概念/feast]] — Feast 开源特征存储
- [[概念/mlflow]] — MLflow 实验追踪

---

## 2026 Snorkel AI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Snorkel Flow** | 数据编程平台 | GA |
| **弱监督** | 弱监督学习 | GA |
| **标注函数** | 标注函数定义 | GA |
| **数据编程** | 程序化标注 | GA |
| **与 Label Studio 对比** | Snorkel vs Label Studio | GA |

## 生产最佳实践

1. **弱监督**：标注成本高用弱监督
2. **数据编程**：程序化定义标注函数
3. **与 Label Studio 对比**：根据场景选择工具
4. **质量控制**：弱监督数据质量控制
5. **迭代优化**：迭代优化标注函数
