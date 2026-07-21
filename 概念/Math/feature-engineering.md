---
title: 特征工程
category: -concepts
tags: ["machine-learning", "feature-engineering", "encoding", "feature-selection", "preprocessing"]
aliases: [Feature prompt-engineering, 特征处理]
relationships:
  - target: "[[概念/supervised-learning]]"
    type: related_to
  - target: "概念/unsupervised-learning"
    type: related_to
  - target: "概念/automl"
    type: related_to
  - target: "概念/time-series-analysis"
    type: related_to
sources: [02_Machine_unsupervised-learning/Feature_Engineering/Feature_Engineering.md]
summary: 将原始数据转换为更有效表示的过程，是连接数据与模型的关键桥梁，决定模型性能上限。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
---

# 特征工程

特征工程是将原始数据转换为更有效表示的过程，使监督学习模型能更好地捕捉数据中的模式。对于表格数据和结构化业务场景，特征工程仍然是提升模型效果最直接、最高效的手段。"数据和特征决定了机器学习的上限，模型和算法只是逼近这个上限。"

## 核心要点

- 数值特征处理：标准化（Z-Score）、归一化（Min-Max）、鲁棒缩放、对数变换、Box-Cox 变换
- 类别特征编码：标签编码、独热编码、目标编码、频率编码、嵌入编码
- 缺失值处理策略：删除、统计量填充、模型预测填充、缺失指示器
- 特征选择三大范式：过滤法（快）、包裹法（精）、嵌入法（平衡）
- 特征交叉可捕捉非线性关系（如 `收入/负债` 比）
- 数据泄露是特征工程最常见的陷阱

## 详细内容

### 数值特征处理

| 方法 | 公式 | 适用场景 |
|------|------|---------|
| 标准化 | $z = (x - \mu) / \sigma$ | 近似正态分布；SVM、逻辑回归 |
| 归一化 | $x' = (x - x_{min}) / (x_{max} - x_{min})$ | 需压缩到 [0,1]；神经网络输入 |
| 鲁棒缩放 | $x' = (x - Q_2) / (Q_3 - Q_1)$ | 存在离群值 |
| 对数变换 | $x' = \log(1 + x)$ | 右偏分布（收入、房价） |

### 类别特征编码

| 编码方法 | 适用场景 | 注意事项 |
|---------|---------|---------|
| 标签编码 | 有序类别；树模型 | 引入虚假顺序关系 |
| 独热编码 | 无序类别，类别数少 | 高基数时维度爆炸 |
| 目标编码 | 高基数类别 | 容易数据泄露，需 K-Fold 正则化 |
| 频率编码 | 类别频率有意义 | 不同类别可能频率相同 |
| 嵌入编码 | 超高基数 + 深度学习 | 需要足够训练数据 |

### 特征选择方法对比

| 类型 | 原理 | 速度 | 代表方法 |
|------|------|------|---------|
| 过滤法 | 独立于模型 | 快 | 方差阈值、互信息、卡方检验 |
| 包裹法 | 依赖特定模型 | 慢 | 前向/后向选择、RFE |
| 嵌入法 | 模型训练中选 | 中 | Lasso、树模型重要性 |

**选择建议**：特征 >1000 时先用过滤法粗筛再用嵌入法精选；特征 <100 时直接用嵌入法。

### 时间序列特征构造

与时间序列分析密切相关：

| 特征类型 | 示例 | 捕捉信息 |
|---------|------|---------|
| 日历特征 | 年/月/日/周几/是否节假日 | 周期性模式 |
| 滞后特征 | `sales_lag_1`, `sales_lag_7` | 历史依赖 |
| 滑动窗口统计 | `mean_7d`, `std_30d` | 趋势和波动性 |
| 差分特征 | `value_t - value_{t-1}` | 变化速率 |

### 特征工程 vs 深度学习

| 维度 | 传统特征工程 | 深度学习端到端 |
|------|------------|--------------|
| 数据量要求 | 小数据也能发挥 | 需要大量数据 |
| 可解释性 | 高（有业务含义） | 低（黑盒） |
| 适用数据类型 | 表格数据最优 | 图像/文本/语音最优 |

结论：表格数据场景下，特征工程 + 梯度提升树仍然是最强方案。

### 常见陷阱

1. **数据泄露**：特征变换使用了测试集或未来信息 → 必须在训练集上 fit，测试集上 transform
2. **过度工程**：构造过多无意义特征导致过拟合 → 搭配特征选择
3. **分布漂移**：训练集和线上数据特征分布不一致 → 监控 PSI 指标

### 自动化工具

- **Featuretools**：基于深度特征合成自动构造聚合、变换特征
- **TSFresh**：时间序列自动特征提取（>700 种统计特征）
- **Feature Store**：Feast（开源）、Tecton 等管理生产环境特征

## 开放问题

- 深度学习自动特征提取能否完全取代人工特征工程？ ^[ambiguous]
- Feature Store 在中小型团队中的 ROI 如何？ ^[inferred]
- 如何自动化检测数据泄露？

## 来源

- 参考/feature-engineering-reference
- 概念/supervised-learning
- 概念/unsupervised-learning
- 概念/automl
- 概念/time-series-analysis

## Related

- [[概念/supervised-learning.md|supervised-learning]]
- [[概念/unsupervised-learning.md|unsupervised-learning]]
- [[机器学习/Anomaly_Detection/Anomaly_Detection.md|Anomaly_Detection]]
- [[机器学习/Anomaly_Detection/Anomaly_Detection_for_dummy.md|Anomaly_Detection_for_dummy]]
- [[机器学习/AutoML/AutoML.md|AutoML]]

---

## 2026 特征工程生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Feature Store** | 特征存储/复用 | GA |
| **Feast** | 开源 Feature Store | GA |
| **自动特征工程** | AutoML 自动特征生成 | GA |
| **特征监控** | 特征漂移检测 | GA |
| **嵌入特征** | 深度学习嵌入作为特征 | GA |

## 生产最佳实践

1. **特征存储**：用 Feature Store 实现特征复用
2. **特征监控**：监控特征漂移，及时告警
3. **自动特征**：用 AutoML 自动特征工程
4. **领域知识**：结合领域知识设计特征
5. **特征选择**：用特征选择去除冗余特征
