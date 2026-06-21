---
title: "ApacheCN AiLearning 学习指南"
category: "90-learn"
tags: ["learning-paths", "apachecn", "ailearning", "course-catalog", "data-analysis", "linear-algebra", "machine-learning", "pytorch", "tensorflow", "nlp"]
summary: "ApacheCN AiLearning 主线的学习指南，将数据分析、线性代数、机器学习、PyTorch、TensorFlow 2.x、NLP 等目录映射到本库章节。"
created: "2026-06-12"
updated: "2026-06-12"
sources:
  - "https://github.com/apachecn/ailearning"
  - "_raw/github-sources/ailearning"
provenance: |
  基于 ApacheCN AiLearning 仓库的 SUMMARY.md、README.md 与 docs/ 目录结构，
  抽取主要学习主线并映射到 ai-guru-database 的现有章节。
base_confidence: "high"
lifecycle: "draft"
tier: "supporting"
---

# ApacheCN AiLearning：学习指南与主线映射

> ApacheCN AiLearning 是一个大型中文 AI 知识库，以中文讲解 + 可运行代码为特色。本页将其主要学习主线映射到 ai-guru-database 的对应章节，便于按需补充阅读。

## 仓库信息

| 属性 | 说明 |
|------|------|
| 官方仓库 | https://github.com/apachecn/ailearning |
| 在线阅读 | https://ailearning.apachecn.org |
| 本地克隆 | `_raw/github-sources/ailearning` |
| 协议 | CC BY-NC-SA 4.0 |

## 主线总览

| 主线 | 章节/页数 | 仓库目录 | 本库入口 |
|------|-----------|----------|----------|
| 数据分析 | 约 155 页 / 12 模块 | `docs/da/` | [[01_Fundamentals/ApacheCN_Data_Analysis_Track]] |
| 线性代数 | 35 讲 + README | `docs/linalg/` | [[01_Fundamentals/ApacheCN_Linear_Algebra_Track]] |
| 机器学习 | 16 章 + 总结 | `docs/ml/` | [[02_Machine_Learning/ApacheCN_Machine_Learning_Track]] |
| PyTorch | 约 28 篇 | `docs/pytorch/` | [[03_Deep_Learning/ApacheCN_PyTorch_Track]] |
| TensorFlow 2.x | 10 章 | `docs/tf2/` | [[03_Deep_Learning/ApacheCN_TensorFlow_Track]] |
| 自然语言处理 | 16 章 | `docs/nlp/` | [[05_NLP_LLMs/ApacheCN_NLP_Track]] |
| 其他补充 | misc 10 + faq 2 + report 1 | `docs/misc/` 等 | 见下方说明 |

## 推荐学习路径

1. **数学与工具基础** → [[01_Fundamentals/ApacheCN_Data_Analysis_Track]] + [[01_Fundamentals/ApacheCN_Linear_Algebra_Track]]
2. **经典机器学习** → [[02_Machine_Learning/ApacheCN_Machine_Learning_Track]] + [[02_Machine_Learning/README]]
3. **深度学习框架（二选一）** → [[03_Deep_Learning/ApacheCN_PyTorch_Track]] 或 [[03_Deep_Learning/ApacheCN_TensorFlow_Track]]
4. **自然语言处理** → [[05_NLP_LLMs/ApacheCN_NLP_Track]] + [[05_NLP_LLMs/README]]

## 各主线速览

### [[01_Fundamentals/ApacheCN_Data_Analysis_Track|数据分析]]
覆盖 Python 工具链、NumPy、SciPy、Matplotlib、Pandas 与 Theano 基础，是后续 ML/DL 的编程与数据操作基础。

### [[01_Fundamentals/ApacheCN_Linear_Algebra_Track|线性代数]]
MIT 18.06 的中文笔记，从方程组几何解释到 SVD、伪逆，是理解神经网络矩阵运算的核心数学基础。

### [[02_Machine_Learning/ApacheCN_Machine_Learning_Track|机器学习实战]]
基于《Machine Learning in Action》的 16 章笔记，覆盖 KNN、决策树、SVM、集成学习、聚类、关联规则、PCA/SVD。

### [[03_Deep_Learning/ApacheCN_PyTorch_Track|PyTorch]]
莫烦 PyTorch 系列教程，从张量、神经网络基础到 CNN、RNN、GAN、DQN 和训练技巧。

### [[03_Deep_Learning/ApacheCN_TensorFlow_Track|TensorFlow 2.x]]
《Sklearn 与 TensorFlow 机器学习实用指南》第二版节选，使用 Keras 讲解 ANN、CNN、RNN/Attention、GAN、RL 与部署。

### [[05_NLP_LLMs/ApacheCN_NLP_Track|自然语言处理]]
基于 NLTK 的《Python 自然语言处理》第二版，讲解语料、分词、标注、分类、句法/语义分析与语言学数据管理。

## 其他资料

- `docs/misc/`：补充性专题资料（约 10 篇）
- `docs/faq/`：常见问题（2 篇）
- `docs/report/`：学习阶段总结（1 篇）

## 相关页面

- [[_references/apachecn-ailearning]] — 外部源引用索引
- [[00_AI_Introduction/AI_Learning_Resources]] — AI 学习资源与方法论
- [[90_Learn/guides/learning_paths_2026]] — 本库学习路径总览
