---
title: "A/B 测试 (A/B Testing)"
category: -concepts
tags: ["ab-testing", "online-experiment", "hypothesis-testing", "canary", "model-evaluation"]
relationships:
  - target: "概念/MLOps/shadow-deployment"
    type: related_to
  - target: "概念/MLOps/argo-rollouts"
    type: complements
  - target: "概念/General/ab-testing-framework"
    type: complements
sources:
  - 09_测试/04_Online_Testing/
  - 11_模型运维/
summary: "A/B 测试将流量随机分配给对照组与实验组，用统计假设检验判断新模型/新策略是否真正带来业务提升，是模型上线决策的黄金标准。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "A/B Testing"
  - "AB测试"
  - "在线实验"
name_zh: "A/B 测试"
---
# A/B 测试 (A/B Testing)

> 中文简称：A/B 测试

> 离线指标涨了不算数——让真实用户投票。

---

## 1. 定义

**A/B 测试**将用户随机分流到对照组（A：现有版本）与实验组（B：新版本），在相同时间窗口对比业务指标（点击率、留存、收入、满意度），用假设检验判断差异是否显著。核心价值：**建立因果关系**，排除时间、季节、用户构成等混杂因素。

---

## 2. 实验设计要素

| 要素 | 要点 |
|------|------|
| **随机化单元** | 用户级（最常见）/ 会话级 / 请求级；LLM 场景注意同一用户体验一致性 |
| **样本量估算** | 由 MDE（最小可检测效应）、显著性 α=0.05、功效 1−β=0.8 反推 |
| **指标体系** | 北极星指标 + 护栏指标（延迟/成本/投诉不得恶化） |
| **实验周期** | 覆盖完整周期（≥1–2 周），避免新奇效应 |
| **分层/互斥** | 多实验并行时用分层正交或互斥域防干扰 |

---

## 3. 常见陷阱

1. **提前偷看 (peeking)**：反复检验膨胀假阳性 → 固定周期或用序贯检验（SPRT/mSPRT）
2. **多重比较**：多指标多分组需 Bonferroni/FDR 校正
3. **SRM（样本比例失配）**：实际分流偏离设定比例说明随机化有 bug，结果作废
4. **辛普森悖论**：分层结构变化导致总体与分层结论相反
5. **网络效应**：社交/双边市场用户互相影响，需切换到地理/时间片实验

---

## 4. 模型上线的发布谱系

| 手段 | 流量 | 目的 |
|------|------|------|
| **Shadow 部署** | 复制流量，不影响用户 | 验证工程正确性/延迟 |
| **金丝雀发布** | 1–5% 真实流量 | 验证稳定性 |
| **A/B 测试** | 对半或多臂分流 | 验证业务效果因果 |
| **Interleaving** | 同请求混合两模型结果 | 排序模型高灵敏对比 |
| **多臂老虎机** | 动态调整流量 | 边实验边最大化收益 |

LLM 特有实践：A/B 对比不同模型/提示词版本，评估指标叠加 LLM-as-Judge 自动评分与人工反馈（👍/👎）。

---

## Related

- [[概念/MLOps/shadow-deployment]] — Shadow 部署（上线前置步骤）
- [[概念/MLOps/argo-rollouts]] — 渐进式发布工具
- [[概念/General/ab-testing-framework]] — A/B 测试框架
- [[概念/General/ctr]] — CTR（经典实验指标）
- [[概念/LLM/llm-as-judge]] — LLM 评审（LLM 实验的指标来源）

> ℹ️ 记忆锚点：离线评估回答"模型好不好"，A/B 测试回答"业务赚不赚"——两者缺一不可。
