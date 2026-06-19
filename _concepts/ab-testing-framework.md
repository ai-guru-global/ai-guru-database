---
title: "A/B 测试框架"
category: concepts
tags: ["ab-testing", "online-evaluation", "experimentation", "model-evaluation", "statistics"]
relationships:
  - target: "concepts/model-evaluation"
    type: implements
  - target: "concepts/model-deployment"
    type: follows
  - target: "concepts/ci-integrated-evaluation"
    type: precedes
  - target: "concepts/online-evaluation"
    type: belongs_to
sources:
  - 08_Model_Evaluation/Online_Evaluation.md
  - 10_MLOps_Pipeline/LLM_Evaluation_Pipeline.md
  - concepts/model-evaluation.md
summary: "A/B 测试框架是一套在线对比新模型/策略与旧版本的工程系统。它把用户随机分成两组，一组用老版本（A），一组用新版本（B），通过统计检验判断新版本是否在真实业务指标上更好。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# A/B 测试框架

## 核心要点

- **A/B 测试是验证模型/产品改动的‘金标准’**。
- **核心逻辑**：随机分流 → 对照组用 A → 实验组用 B → 收集指标 → 统计检验 → 决策。
- **关键要求**：随机、可复现、统计显著、业务指标对齐。
- **不只是模型**：提示词、检索策略、UI、价格策略都可以用 A/B 测试。

## 一句话理解

A/B 测试框架就像一场‘公平对决’：随机抽一群人用新产品，另一群人用老产品，看哪边真的更赚钱、更满意、更少投诉。

## 详细内容

### 为什么需要 A/B 测试？

离线评估的局限：
- 测试集不等于真实用户分布。
- 自动指标（如 BLEU、准确率）不等于业务指标（转化率、留存、满意度）。
- 模型在新数据上可能表现完全不同。

A/B 测试直接看真实用户身上的效果。

### 基本流程

```
1. 假设：新版本能提升 X 指标
2. 设计：确定分流比例、目标指标、实验周期
3. 随机分流：用户被随机分到 A 组或 B 组
4. 运行实验：同时服务两组用户
5. 收集数据：点击率、转化率、停留时长、错误率等
6. 统计检验：判断差异是否显著
7. 决策：全量发布 / 回滚 / 继续优化
```

### 关键概念

| 概念 | 说明 |
|------|------|
| **SRM（Sample Ratio Mismatch）** | 实际分流比例是否偏离预期，偏离则实验无效 |
| **MDE（Minimum Detectable Effect）** | 最小可检测效应，决定需要多少样本 |
| **统计功效（Power）** | 检测出真实差异的概率，通常设 80% |
| **显著性水平（α）** | 假阳性概率，通常设 5% |
| **多重比较校正** | 同时看多个指标时要校正，避免假阳性 |

### 在 LLM 中的应用

| 场景 | 测什么 |
|------|--------|
| 模型替换 | 新模型 vs 旧模型的用户满意度 |
| 提示词优化 | 不同 prompt 的完成率 |
| RAG 策略 | 检索 Top-K 数量对答案准确率的影响 |
| Agent 工作流 | 多轮 vs 单轮对用户留存的影响 |

### 常见陷阱

- **样本量不足**：跑了三天就下结论，结果只是噪声。
- **指标太多**：看 20 个指标，总有一个‘显著’，其实是巧合。
- **分流不均**：新用户全进 B 组，老用户全进 A 组，结果不可比。
- ** novelty effect**：用户因为新鲜感点击新功能，不代表长期更好。

## 开放问题

- LLM 生成内容的 A/B 指标如何设计（创造性、有用性、安全性）。
- 长周期效应（如用户习惯变化）如何评估。
- 多模型、多策略同时实验时的复杂度管理。

## Related

- [[concepts/model-evaluation]] — 模型评估
- [[concepts/model-deployment]] — 模型部署
- [[concepts/online-evaluation]] — 在线评估
- [[concepts/ci-integrated-evaluation]] — CI 集成评估
- [[08_Model_Evaluation/Online_Evaluation]] — 在线评估
- [[10_MLOps_Pipeline/LLM_Evaluation_Pipeline]] — LLM 评估流水线
