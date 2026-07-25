---
title: AutoML
category: -concepts
tags: ["machine-learning", "automl", "hyperparameter-optimization", "optuna", "nas", "model-selection"]
aliases: [AutoML, 自动化机器学习, Automated Machine unsupervised-learning]
relationships:
  - target: "[[概念/supervised-learning]]"
    type: related_to
  - target: "概念/ensemble-learning"
    type: related_to
  - target: "概念/feature-engineering"
    type: related_to
sources: [02_机器学习/11_AutoML/AutoML.md]
summary: 自动化机器学习Pipeline，包括自动特征工程、模型选择、超参数优化，降低ML应用门槛。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21
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

- 参考/automl-reference
- 概念/supervised-learning
- 概念/ensemble-learning
- 概念/feature-engineering

## Related

- [[概念/Math/supervised-learning.md|supervised-learning]]
- [[概念/Math/unsupervised-learning.md|unsupervised-learning]]
- [[02_机器学习/08_Anomaly_Detection/Anomaly_Detection.md|Anomaly_Detection]]
- [[02_机器学习/08_Anomaly_Detection/Anomaly_Detection_for_dummy.md|Anomaly_Detection_for_dummy]]
- [[02_机器学习/11_AutoML/AutoML.md|AutoML]]
- [[治理/anomaly-detection-automl|异常检测 × AutoML]] — 自动化异常发现的交叉合成

---

## 2026 AutoML 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **AutoGPTQ/AWQ** | 自动量化搜索最优量化配置 | GA |
| **NAS for LLM** | 神经架构搜索应用于大模型设计 | 研究 |
| **HPO 平台** | Optuna/Ray Tune 超参优化即服务 | GA |
| **AutoML 微调** | 自动选择 LoRA rank/alpha/目标层 | GA |
| **数据自动工程** | 自动特征选择、数据增强、清洗 | GA |

## 生产最佳实践

1. **搜索空间约束**：合理限定超参搜索范围，避免无效搜索浪费资源
2. **早停策略**：配置 early stopping 及时终止无希望的试验
3. **可复现性**：记录每次试验的完整配置，确保最优结果可复现
4. **资源预算**：设定 GPU 小时上限，避免 AutoML 无限消耗资源
5. **人工审核**：AutoML 结果需人工审核合理性，不盲目采用

## AutoML 工具对比

| 工具 | 定位 | 搜索策略 | 适用场景 | 成本 |
|------|------|----------|----------|------|
| AutoGluon | 表格数据 | 多层集成 | 结构化数据 | 低 |
| NNI | 通用 | NAS+HPO | 研究/生产 | 中 |
| Optuna | 超参优化 | TPE/CMA-ES | 超参调优 | 低 |
| Ray Tune | 分布式 | 多种 | 大规模搜索 | 中 |
| Vertex AI AutoML | 托管 | 黑盒 | 企业无运维 | 高 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 搜索时间过长 | 搜索空间过大 | 缩小搜索范围 + 早停 |
| 结果不可复现 | 随机种子未固定 | 固定 seed + 记录配置 |
| 过拟合验证集 | 搜索次数过多 | 使用嵌套交叉验证 |
| GPU 资源耗尽 | 未设置预算 | 配置 GPU 小时上限 |

## 生产检查清单

1. ✅ 明确搜索空间和目标指标
2. ✅ 设定 GPU 小时预算上限
3. ✅ 固定随机种子确保可复现
4. ✅ 使用独立测试集最终评估
5. ✅ AutoML 结果人工审核合理性
6. ✅ 记录最优配置纳入版本控制

## 总结

AutoML 将模型开发中的重复性工作自动化，2026 年已从超参搜索扩展到架构搜索、数据增强和特征工程。其核心价值是让 ML 工程师专注于问题定义和数据质量，而非繁琐的调参过程。

> 💡 AutoML 的核心价值是“自动化重复劳动”，而非“替代人类判断”——它找到最优配置，但问题定义和数据质量仍靠人类。

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| AutoGluon | 1.x | GA |
| Optuna | 4.x | GA |
| NNI | 3.x | GA |
| Ray Tune | 2.x | GA |
| Vertex AI AutoML | 2026 | GA |
