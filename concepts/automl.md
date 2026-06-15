---
title: AutoML
category: concepts
tags: ["machine-learning", "automl", "hyperparameter-optimization", "optuna", "nas", "model-selection"]
aliases: [AutoML, 自动化机器学习, Automated Machine unsupervised-learning]
relationships:
  - target: "[[concepts/supervised-learning]]"
    type: related_to
  - target: "concepts/ensemble-learning"
    type: related_to
  - target: "concepts/feature-engineering"
    type: related_to
sources: [02_Machine_Learning/AutoML/AutoML.md]
summary: 自动化机器学习Pipeline，包括自动特征工程、模型选择、超参数优化，降低ML应用门槛。
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

# AutoML

AutoML（Automated Machine Learning）旨在将机器学习 Pipeline 中的重复性、高门槛步骤自动化，包括特征工程、模型选择、超参数优化和神经架构搜索，降低 ML 应用门槛、提升效率。AutoML 让从业者从"炼丹师"变成"指挥官"。

## 核心要点

- AutoML 覆盖 Pipeline：数据预处理 → 特征工程 → 模型选择 → 超参数优化 → 评估
- 超参数优化方法：网格搜索、随机搜索、贝叶斯优化（GP/TPE/SMAC）、多保真度方法（Hyperband）
- Optuna 是最流行的 HPO 框架，核心特性：Define-by-Run API、TPE 采样器、高效剪枝
- Auto-sklearn、FLAML、TPOT 是主流 AutoML 平台
- 神经架构搜索（NAS）自动设计神经网络结构，DARTS 是代表性方法
- Ray Tune 支持分布式超参数优化，适合大规模搜索

## 详细内容

### AutoML 平台对比

| 平台 | 搜索策略 | 速度 | 特点 |
|------|---------|------|------|
| Auto-sklearn | 贝叶斯 + 元学习 | 中等 | sklearn 生态 |
| FLAML | 经济型 CFL | 快 | 微软出品，轻量 |
| TPOT | 遗传编程 | 慢 | 可导出 Python 脚本 |
| H2O AutoML | 多种策略 | 中等 | 企业级，功能全面 |
| Google Vertex AI | 云端 | 快 | 深度学习强，图像/NLP 好 |

### 超参数优化方法

| 方法 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| 网格搜索 | 遍历所有组合 | 简单可并行 | 维度灾难 |
| 随机搜索 | 随机采样 | 比网格搜索高效 | 可能错过最优点 |
| 贝叶斯优化(GP) | 概率代理模型 | 样本效率高 | 高维计算贵 |
| TPE | 核密度估计 | 处理高维好 | 需要足够样本 |
| Hyperband | 逐级淘汰 | 高效利用资源 | 可能丢好配置 |
| BOHB | 贝叶斯 + 淘汰 | 兼顾效率与质量 | 实现复杂 |

### Optuna 深度解析

核心概念：Study（优化任务）→ Trial（参数试验）→ Suggest（采样参数）→ Objective（评估函数）→ model-compression（提前终止差 trial）。

采样器选择：

| 采样器 | 原理 | 何时使用 |
|--------|------|----------|
| TPESampler | 核密度估计 | 通用默认选择 |
| GPSampler | 高斯过程 | 昂贵评估（<100 次） |
| CMAESampler | 协方差矩阵自适应 | 连续参数空间 |
| NSGAIISampler | 多目标进化 | 多目标优化 |

剪枝机制：通过报告中间结果提前终止表现差的 trial，大幅节省计算资源。

### Ray Tune 分布式 HPO

Ray Tune 是分布式超参数优化框架，支持 Optuna、Ax、HyperOpt 等多种搜索算法集成，配合 ASHA 调度器实现大规模并行搜索。适合资源充足、搜索空间大的场景。

### 神经架构搜索（NAS）

NAS 自动搜索最优网络结构，核心三要素：
1. **搜索空间**：链式结构、Cell-based、层次结构
2. **搜索策略**：随机搜索、进化算法、强化学习、可微搜索（DARTS）
3. **评估策略**：完整训练、代理模型、权重共享、早停

DARTS 将架构搜索转化为可微优化问题，通过 softmax 权重选择操作。

### 自动特征工程

Featuretools 是最流行的自动化特征工程库，核心是**深度特征合成（DFS）**，可从关系型数据中自动生成聚合和变换特征。常用聚合原语：sum、mean、count、mode、std、trend、time_since_last。

### 最佳实践

| 实践 | 优先级 |
|------|--------|
| 先建手动 Baseline | 高 |
| 合理设搜索空间 | 高 |
| 使用 Pruning 节省资源 | 高 |
| 交叉验证避免过拟合 | 高 |
| 持久化 Study 到数据库 | 中 |
| 集成 Top-K 模型 | 中 |
| 分阶段搜索（先粗后细） | 中 |

### 资源预算参考

| 数据规模 | 推荐 AutoML 时间 | 推荐工具 |
|----------|-----------------|----------|
| <10K 行 | 5-15 分钟 | FLAML |
| 10K-100K | 30-120 分钟 | Optuna + FLAML |
| 100K-1M | 2-8 小时 | Ray Tune + ASHA |
| >1M（深度学习） | 8-48 小时 | Ray Tune + ai-hardware 集群 |

## 开放问题

- AutoML 在多大程度上可以取代数据科学家？ ^[ambiguous]
- 多目标优化（精度 + 推理速度 + 公平性）的实用化程度
- NAS 在非视觉/非 NLP 任务中的效果 ^[inferred]

## 来源

- references/automl-reference
- concepts/supervised-learning
- concepts/ensemble-learning
- concepts/feature-engineering

## Related

- [[concepts/supervised-learning.md|supervised-learning]]
- [[concepts/unsupervised-learning.md|unsupervised-learning]]
- [[02_Machine_Learning/Anomaly_Detection/Anomaly_Detection.md|Anomaly_Detection]]
- [[02_Machine_Learning/Anomaly_Detection/Anomaly_Detection_for_dummy.md|Anomaly_Detection_for_dummy]]
- [[02_Machine_Learning/AutoML/AutoML.md|AutoML]]
- [[synthesis/anomaly-detection-automl|异常检测 × AutoML]] — 自动化异常发现的交叉合成
