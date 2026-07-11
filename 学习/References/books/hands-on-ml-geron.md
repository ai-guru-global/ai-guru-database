---
title: "Hands-On Machine Learning"
category: "-references-books"
tags:
  - book
  - learning-resource
  - machine-learning
  - deep-learning
  - scikit-learn
  - tensorflow
  - keras
  - aurelien-geron
  - oreilly
summary: "ML/DL 实战圣经（第3版），使用 Scikit-Learn、Keras 和 TensorFlow 端到端构建智能系统。两大部分覆盖经典 ML 与深度学习，含大量代码实战项目。"
sources:
  - "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/"
created: 2026-06-12
updated: 2026-07-11
lifecycle: reviewed
tier: supporting
aliases:
  - "Hands On Ml Geron"
  - "hands on ml geron"

---
# Hands-On Machine Learning

> **一句话理解**: 全球最畅销的 ML/DL 实战教材，从线性回归到 Transformer 全程代码驱动，被誉为"机器学习入门的第一本书"。

## 书籍信息

| 属性 | 说明 |
|------|------|
| **书名** | Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow（第3版） |
| **作者** | Aurélien Géron |
| **出版社** | O'Reilly（2022，第3版） |
| **页数** | 约 1000 页 |
| **难度** | ⭐⭐☆（入门→中级） |
| **代码语言** | Python（Scikit-Learn / Keras / TensorFlow） |
| **链接** | [O'Reilly](https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/) |

## 核心内容概要

全书分两大部分：

**Part 1 — 机器学习基础**（经典 ML）

1. 机器学习全景与端到端项目流程
2. 分类与回归（MNIST、住房价格预测）
3. 训练模型（线性回归、梯度下降、正则化）
4. 支持向量机（SVM）
5. 决策树与随机森林
6. 集成学习与降维

**Part 2 — 深度学习**

7. 多层感知机与 Keras 入门
8. 深度神经网络训练技巧（自定义训练循环）
9. 使用 TensorFlow 加载与预处理数据（tf.data）
10. 神经网络进阶（CNN、RNN、注意力机制）
11. 使用 Transformer 进行自然语言处理
12. 强化学习
13. 大规模训练与部署（分布式训练、TF Serving）

## 适合人群

- **级别**: 初级 → 中级
- **前置知识**: Python 基础、基本高等数学
- **适合**: ML 初学者、转行工程师、需要系统刷一遍基础的开发者

## 知识库章节映射

| 本书章节 | 推荐参考 |
|----------|----------|
| Part 1 经典 ML | [[机器学习/]] 、 [[数学基础/]] |
| Part 2 深度学习 | [[深度学习/]] |
| Ch 11 Transformer | [[大模型/LLM_Fundamentals]] |
| Ch 13 部署 | [[部署推理/]] |

## 学习建议

- **阅读顺序**: 先通读 Part 1（每章跑通 Notebook），再进 Part 2
- **实战搭配**: 每章搭配 Kaggle 练习题；深度学习部分建议同时阅读 [[dl-with-python-chollet]]
- **时间投入**: 约 2-3 个月（每天 1-2 小时）

## 亮点与局限

- ✅ **亮点**: 代码完整可运行、端到端项目驱动、插图丰富、第3版新增 Transformer 与注意力机制章节
- ⚠️ **局限**: 篇幅庞大（1000 页）可能劝退；以 TensorFlow 为主，PyTorch 用户需额外适配；理论深度不及 Goodfellow 花书

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[深度学习/]] | [[机器学习/]]
