---
title: 模型评估
category: concepts
tags:
- evaluation
- metrics
- ab-testing
- automation
- benchmark
- ci-cd
relationships:
- target: 'concepts/model-training'
  type: validates
- target: 'concepts/model-deployment'
  type: precedes
- target: 'concepts/bbh'
  type: exemplified_by
- target: 'concepts/llm-arena'
  type: exemplified_by
- target: 'concepts/red-teaming'
  type: tested_by
- target: 'concepts/ci-integrated-evaluation'
  type: implements
- target: 'concepts/ab-testing-framework'
  type: implements
sources:
- 08_model-training_Evaluation/Model_Evaluation.md
- 08_Model_Evaluation/Online_Evaluation.md
- 08_Model_Evaluation/Evaluation_Automation_2026.md
summary: 模型评估涵盖离线指标体系（分类/回归/排序/llm-infrastructure基准）、在线评估（A/B测试/影子部署/金丝雀发布）和自动化评估流水线（CI/CD集成/质量门禁/回归测试）。核心原则：永远不在训练集上评估、选择与业务目标一致的指标、统计显著性检验不可或缺。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.78
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31 00:00:00+00:00
updated: 2026-05-31 00:00:00+00:00
---

# 模型评估

## 核心要点

- **离线评估**提供分类指标（Accuracy/Precision/Recall/F1/AUC-ROC）、回归指标（MAE/RMSE/R²）、排序指标（NDCG/MAP）和LLM基准（MMLU/HumanEval/GSM8K）
- **在线评估**通过A/B测试验证真实业务指标，SRM检查确保分流随机性，金丝雀发布渐进暴露新模型
- **自动化评估**将评估集成到CI/CD流水线，通过质量门禁和回归测试确保新版本不劣于旧版本
- 统计显著性检验（配对t检验/McNemar/Wilcoxon）是判断模型差异是否真实存在的基础

## 详细内容

### 离线评估指标体系

**分类任务**以混淆矩阵为基础：Accuracy适用于类别均衡场景；Precision关注误报成本（垃圾邮件过滤）；Recall关注漏报成本（癌症筛查）；F1-Score平衡二者；AUC-ROC衡量不同阈值下的整体判别能力，0.5为随机、1.0为完美。

**回归任务**：MAE对异常值鲁棒、RMSE惩罚大误差、R²解释方差比例。

**排序/推荐**：NDCG考虑位置衰减的增益、MAP衡量平均精确率。

**LLM评估**呈现多维度趋势：知识推理（MMLU/GPQA）、代码生成（HumanEval/MBPP pass@k）、数学推理（GSM8K/MATH）、指令遵循（MT-Bench/AlpacaEval）、安全性（毒性评分/偏见检测）。LLM-as-Judge用强模型评估弱模型输出，需注意位置偏见和长度偏见。

交叉验证（K-Fold/Stratified/Time time-series-analysis）在小数据集上提供更可靠的性能估计。Bootstrap方法通过有放回采样估计指标的置信区间。

### 在线评估方法

离线评估有固有局限：测试集分布偏离真实用户、代理指标（BLEU/准确率）不等于业务指标（转化率/留存）。

**A/B测试**是黄金标准：随机分流用户到对照组和实验组，收集业务指标后进行统计检验。关键步骤：

1. **SRM检查**：用卡方检验验证实际分流比例是否偏离预期（p<0.05表示分流异常）
2. **确定样本量**：基于最小可检测效应（MDE）、基线转化率和统计功效计算
3. **多重比较校正**：多指标同时测试时用Bonferroni或FDR控制假阳性

**影子部署（Shadow Deployment）**让新模型与旧模型并行处理相同请求但不返回新模型结果，零风险收集对比数据。

**金丝雀发布（Canary）**先向5-10%流量暴露新模型，监控关键指标后逐步扩大。

### 自动化评估流水线

评估自动化将"考试"从手工操作变为工业流水线：

**回归测试**：每次模型变更自动运行全部历史基准，任何指标下降超过阈值则阻止发布。

**质量门禁**：在模型注册前设置硬性门槛（如MMLU≥65%、毒性≤0.05、延迟≤100ms），全部通过才允许晋级到Production。

**CI/CD集成**：Git Push触发→代码质量检查→训练Job→单元评估+集成评估→回归对比→门禁决策→模型注册。评估配置代码化、环境容器化（Docker）、数据集版本锁定，确保可复现。

**可复现性指纹**：`模型版本@commit + 数据集@hash + 评估代码@commit + Docker镜像@digest + 随机种子 + 硬件规格`。

## 开放问题

- LLM评估基准的饱和速度加快，需持续更新更具挑战性的测试集
- LLM-as-Judge的系统性偏见（位置、长度、风格）尚未完全解决
- 多模态模型的评估标准仍在快速发展中

## 来源

- Floridi et al., "The ai-ethics of Artificial Intelligence," 2020（评估公平性）
- Kohavi et al., "Trustworthy Online Controlled Experiments," 2020
- Liang et al., "Holistic Evaluation of Language world-models-jepa (HELM)," 2023

## Related

- [[08_Model_Evaluation/Model_Evaluation]] — 模型评估 (Model Evaluation) (共享: ab-testing, benchmark, metrics)
- [[08_Model_Evaluation/README]] — 模型评估 (Model Evaluation) (共享: ab-testing, benchmark, metrics)
- [[concepts/bbh]] — BBH
- [[concepts/llm-arena]] — LLM Arena
- [[concepts/red-teaming]] — 红队测试
- [[concepts/ci-integrated-evaluation]] — CI 集成评估
- [[concepts/ab-testing-framework]] — A/B 测试框架
- [[08_Model_Evaluation/LLM_Benchmarks_for_dummy]] — LLM 评估与测试大白话
