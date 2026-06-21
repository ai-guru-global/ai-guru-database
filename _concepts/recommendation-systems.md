---
title: 推荐系统
category: concepts
tags: ["machine-learning", "recommendation", "collaborative-filtering", "content-based", "hybrid", "computer-vision", "matrix-factorization"]
aliases: [Recommendation Systems, 推荐系统, RecSys]
relationships:
  - target: "[[_concepts/supervised-learning]]"
    type: related_to
  - target: "_concepts/unsupervised-learning"
    type: related_to
  - target: "_concepts/feature-engineering"
    type: related_to
sources: [02_Machine_unsupervised-learning/Recommendation_Systems/Recommendation_Systems.md]
summary: 预测用户对物品的偏好，是电商、内容平台的核心技术，涵盖协同过滤、内容推荐和深度学习方法。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# 推荐系统

推荐系统是信息过滤系统的子类，旨在预测用户对物品的"评分"或"偏好"，是电商、内容平台、社交媒体的核心技术。推荐系统解决信息过载、长尾效应、用户留存和商业变现四大问题。典型的推荐流程为：百万级物品 → 召回（筛选到千级）→ 排序（精排到百级）→ 重排（最终展示）。

## 核心要点

- 三大基础范式：协同过滤、基于内容、混合方法
- 协同过滤利用群体智慧（User-Based / Item-Based），矩阵分解是其核心数学工具
- 基于内容的方法分析物品特征，不依赖其他用户数据，但易造成信息茧房
- 深度学习推荐模型：NCF、Wide & deep-reinforcement-learning、DeepFM、Two-Tower
- 冷启动是推荐系统的经典难题（新用户、新物品、新系统）
- 评估指标：NDCG（排序质量）、probability-statistics、Hit Rate、Coverage、Diversity

## 详细内容

### 协同过滤

#### User-Based vs Item-Based

| 对比 | User-Based | Item-Based |
|------|------------|------------|
| 相似度计算 | 用户之间 | 物品之间 |
| 稳定性 | 差（用户兴趣变化） | 好（物品特征稳定） |
| 适用场景 | 用户少、物品多 | 用户多、物品少 |

#### 矩阵分解

将高维稀疏的用户-物品评分矩阵分解为两个低维稠密矩阵：$R \approx P \times Q^T$。

- **SVD**：经典分解方法
- **ALS**（交替最小二乘法）：天然适合分布式计算、隐式反馈
- **SGD**：顺序更新，Netflix Prize 核心方法

### 基于内容的过滤

分析用户过去喜欢物品的特征（TF-IDF、特征向量），推荐具有相似特征的新物品。优势：不需要其他用户数据、可解释性强、新物品可立即推荐。劣势：只推荐相似物品（信息茧房）、需要好的特征工程。

### 混合方法

混合策略：加权混合、切换混合、级联混合、特征组合。将协同过滤和基于内容的优势结合，工业界普遍采用混合架构。

### 深度学习推荐模型

| 模型 | 特点 | 优点 | 缺点 |
|------|------|------|------|
| NCF | MLP + GMF | 灵活非线性 | 训练复杂 |
| Wide & Deep | 记忆 + 泛化 | Google 实践 | 需要特征工程 |
| DeepFM | FM + Deep | 自动交叉特征 | 参数较多 |
| Two-Tower | 双塔独立 | 召回高效 | 交互延迟 |

Two-Tower 模型是大规模召回的主流方案，用户和物品分别编码为向量，通过余弦相似度计算匹配度。

### 基于会话的推荐

适用于无登录/无历史记录场景，捕捉短期兴趣。代表模型：GRU4Rec（GRU 序列建模）、SASRec（Self-Attention 序列推荐）。

### 冷启动问题

| 策略 | 用户冷启动 | 物品冷启动 | 系统冷启动 |
|------|-----------|-----------|-----------|
| 热门推荐 | 适用 | 不适用 | 适用 |
| 基于内容 | 不适用 | 适用 | 不适用 |
| 迁移学习 | 适用 | 适用 | 适用 |
| 多臂老虎机 | 适用 | 适用 | 适用 |

### 评估指标

#### 离线指标

- **NDCG@k**：衡量排序质量，考虑位置权重
- **MAP**：平均精确率
- **Hit Rate**：推荐列表是否命中

#### 超越准确率的指标

| 指标 | 含义 |
|------|------|
| Coverage | 推荐物品覆盖率，避免只推荐热门 |
| Diversity | 推荐列表多样性，避免同质化 |
| Novelty | 推荐物品新颖度 |
| Serendipity | 意外且有用的推荐 |

### 工业架构参考

淘宝推荐流程：多路召回（协同过滤、Two-Tower ANN、图神经网络、热门、标签）→ 粗排 → 精排（DeepFM/DIN）→ 重排（多样性/业务规则）。

Netflix Prize 关键经验：集成方法效果最好、矩阵分解是核心、时间因素重要、隐式反馈比评分更有用。^[inferred]

## 开放问题

- 深度学习推荐模型相比传统方法的实际增益有多大？ ^[ambiguous]
- 如何平衡推荐准确性与多样性？
- 联邦学习在保护隐私推荐中的可行性 ^[inferred]

## 来源

- _references/recommendation-systems-reference
- _concepts/supervised-learning
- _concepts/unsupervised-learning
- _concepts/feature-engineering

## Related

- [[_concepts/supervised-learning.md|supervised-learning]]
- [[_concepts/unsupervised-learning.md|unsupervised-learning]]
- [[02_Machine_Learning/Anomaly_Detection/Anomaly_Detection.md|Anomaly_Detection]]
- [[02_Machine_Learning/Anomaly_Detection/Anomaly_Detection_for_dummy.md|Anomaly_Detection_for_dummy]]
- [[02_Machine_Learning/AutoML/AutoML.md|AutoML]]
