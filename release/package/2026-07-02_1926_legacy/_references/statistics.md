---
title: Skill 中常用统计方法速查
category: references
tags: [skill, statistics, ab-testing, regression, hypothesis-testing, data-analysis]
summary: Agent Skill 开发中常用的描述统计、假设检验、回归与 A/B 测试基础速查表，帮助在 Skill schema、评估指标与数据管道中正确选型与解释。
created: 2026-07-02
updated: 2026-07-02
---

# Skill 中常用统计方法速查

Agent Skill 经常需要把原始观测转化为可用于决策的指标。本文档汇总 Skill schema 设计、评估脚本与 A/B 评估中最常用的统计方法，便于快速选型与正确解释。

## 描述统计

描述统计用于 summarization Skill 或指标面板，帮助用户一眼理解数据分布。

- **集中趋势**
  - 均值（mean）：对异常值敏感，适合近似对称分布。
  - 中位数（median）：抗异常值，适合收入、延迟等右偏分布。
  - 众数（mode）：适合类别型字段，如最常见错误码。
- **离散程度**
  - 标准差（std）与方差（variance）：描述数据波动，配合均值使用。
  - 四分位距（IQR）：`Q3 - Q1`，用于稳健地识别异常值。
  - 极差（range）：简单但易受离群点影响。
- **分布形态**
  - 偏度（skewness）：>0 右偏，<0 左偏。
  - 峰度（kurtosis）：描述尾部厚度，异常值风险参考。
  - 百分位数（p50, p90, p99）：延迟、耗时类 Skill 的首选指标。

## 假设检验

在 Skill 评估或判定节点中，用假设检验判断差异是否显著，避免凭肉眼下结论。

- **t 检验**：比较两组均值，要求近似正态或样本量足够大。
  - 独立样本 t 检验：A/B 两组用户。
  - 配对 t 检验：同一对象前后对比。
- **卡方检验（χ²）**：检验类别变量独立性，如错误类型是否与模型版本相关。
- **Mann-Whitney U**：非参数替代 t 检验，适合偏态或有序数据。
- **p 值与显著性**
  - 常用阈值 α=0.05。
  - 报告时同时给出效应量（effect size）和置信区间，避免仅看 p 值。

## 回归基础

回归用于构建预测型 Skill 或解释变量之间的关系。

- **线性回归**：预测连续值，如响应延迟、任务耗时。
  - 需检查残差正态性、同方差性与多重共线性。
- **逻辑回归**：预测二分类结果，如任务成功/失败。
  - 输出概率，可解释性强，适合 baseline。
- **正则化**
  - L1（Lasso）：可做特征选择。
  - L2（Ridge）：缓解多重共线性。
- **评估指标**
  - 回归：MAE、RMSE、R²。
  - 分类：准确率、精确率、召回率、F1、AUC-ROC。

## A/B 测试基础

Skill 的 A/B 测试能力通常需要以下统计支撑。

- **实验设计**
  - 随机分流：确保样本独立同分布。
  - 样本量估算：基于预期提升、基线转化率、α 与 power（通常 0.8）。
- **指标选择**
  - 北极星指标：1-2 个核心指标。
  - 护栏指标：防止副作用，如错误率、延迟 p99。
- **分析方法**
  - 转化率用 Z 检验或卡方检验。
  - 连续指标用 t 检验或 Mann-Whitney U。
  - 多重比较问题：同时检验多个指标时，使用 Bonferroni 或 FDR 校正。
- **提前停止与窥视问题**
  - 固定样本量实验优于随意提前停止。
  - 如需序贯检验，使用如 O'Brien-Fleming 等成熟方案。

## Skill 开发中的实用建议

- 在 schema 中明确字段是计数、比率还是连续值，这决定后续适用的统计方法。
- 对涉及随机性的 Skill，记录随机种子，保证结果可复现。
- 在输出中报告置信区间，而不仅是点估计。
- 遇到小样本时，优先使用非参数方法或贝叶斯方法，避免正态假设失真。
- 不要把“统计显著”等同于“业务显著”，始终结合效应量判断。

## Related

- [[Agent/Agent_Skills/README|Agent Skills]]
- [[_references/index|References Index]]
- [[AI测试/AB_Testing_AI_Systems|A/B Testing AI Systems]]
- [[模型评估/Evaluation_Metrics|Evaluation Metrics]]
- Probability and Statistics
