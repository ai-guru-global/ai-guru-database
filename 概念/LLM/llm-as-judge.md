---
title: "LLM-as-Judge（LLM 评判员）"
category: -concepts
tags: [llm-as-judge, llm-evaluation, gpt-4-judge, judge-llm, alpaca-eval]
aliases:
  - "LLM as Judge"
  - "LLM-as-Judge"
  - "Judge Model"
  - "LLM 评判员"
relationships:
  - target: "概念/llm-arena"
    type: complementary
  - target: "概念/benchmark"
    type: used_in
sources:
  - 模型评估/Evaluation_Tools/LLM_as_Judge_Guide.md
  - 概念/llm-arena.md
summary: "LLM-as-Judge 是用强 LLM（GPT-4 / Claude Opus）作为"裁判"自动评估其他 LLM 输出的范式；2026 年是 RAG、对话、Agent 评测的主流方法，但需警惕位置偏差、长度偏差等系统性问题。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-07-21
---

# LLM-as-Judge（LLM 评判员）

## 核心要点

- **核心思想**：用强 LLM（GPT-5 / Claude Opus 4.8）作为裁判，评估其他模型输出。
- **典型任务**：
  - 评估 A/B 测试（哪个回答更好）
  - 多维度评分（准确性、完整性、清晰度、格式）
  - 开放式问答评分（替代人工）
  - 对齐人类偏好
- **主流实现**：
  - **MT-Bench**（LMSYS）：80 道多轮对话
  - **AlpacaEval**：单轮胜率（自动 vs Reference）
  - **WildBench**：1K 真实场景任务
  - **Prometheus 2**：开源 Judge，70B 接近 GPT-4
  - **JudgeLRM**：7B 小模型 Judge
  - **PandaLM**：中英文多维度

## 一句话解释

> LLM-as-Judge = "用 GPT-5 当老师批改作业"；自动评估其他 LLM 输出，但别让 GPT-5 自己批自己（避免自偏好）。

## 标准 Prompt 模板

```python
JUDGE_PROMPT = """你是一个严格的评分员。请基于以下维度对 [A] 和 [B] 评分（1-10）：

[问题]: {question}
[标准答案]: {reference}
[回答 A]: {response_a}
[回答 B]: {response_b}

评分维度:
1. 准确性（事实是否正确，0-10）
2. 完整性（是否覆盖关键点，0-10）
3. 清晰度（表达是否流畅，0-10）
4. 格式（是否符合要求，0-10）

请严格思考，然后输出 JSON：
{
  "winner": "A" | "B" | "tie",
  "score_a": int,
  "score_b": int,
  "score_a_breakdown": {...},
  "score_b_breakdown": {...},
  "reason": "详细理由"
}
"""
```

## 系统性偏差与缓解

| 偏差 | 现象 | 缓解 |
|------|------|------|
| **位置偏差** | 偏好第一个回答 | 调换顺序两次取平均 |
| **长度偏差** | 偏好长回答 | 长度归一化 + 长度惩罚项 |
| **自我偏好** | 偏好自己输出 | 用不同模型做裁判 |
| **格式偏差** | 偏好 markdown | 标准化输入格式 |
| **模糊性** | 难区分细微差别 | 提供详细评分标准 + few-shot |
| **幻觉级联** | Judge 也可能幻觉 | 关键决策加人类复核 |

## 实施清单

```
准备阶段
├── 选定 Judge 模型（GPT-5 / Claude Opus / 开源 Judge）
├── 设计评分 prompt（含维度定义、few-shot）
├── 准备评估数据集（含标准答案）
└── 计算评估成本（GPT-5 评估 1K 题 ≈ $X）

执行阶段
├── 调换 A/B 顺序跑两次
├── 取平均得分
├── 统计胜率 / 评分分布
└── 加 95% 置信区间

验证阶段
├── 抽样 100 个结果做人工复核
├── 计算 Judge vs Human 一致性（Kappa 系数）
├── 检查是否有系统偏差
└── 必要时重新校准 prompt
```

## 与其他评测方法对比

| 方法 | 成本 | 速度 | 客观性 | 适合 |
|------|------|------|--------|------|
| **LLM-as-Judge** | $$ | 快 | 中（受 prompt 影响） | 大规模自动评估 |
| **人工评估** | $$$$ | 慢 | 高 | 黄金集、最终决策 |
| **规则化** | $ | 极快 | 高（仅适用客观题） | 代码、格式、数学 |
| **A/B Testing** | $$ | 中 | 中 | 真实用户体验 |
| **Chatbot Arena** | $$ | 中 | 高（人类盲测） | 综合排名 |

## 何时使用

✅ **推荐**：
- 大规模回归测试（黄金集 500+ 题）
- 多模型 A/B 对比
- RAG 评估（RAGAS Faithfulness 等指标）
- 人工评估前的初筛

⚠️ **不推荐**：
- 高风险最终决策（仍需人类把关）
- 客观题（用规则化更便宜）
- Judge 模型与被评模型同源时（自偏好严重）

## Related

- [[概念/llm-arena]] — Chatbot Arena（人类评判）
- [[概念/benchmark]] — Benchmark 总览
- [[模型评估/Evaluation_Tools/LLM_as_Judge_Guide]] — LLM-as-Judge 深度
- [[治理/cheatsheets/cheatsheet-evaluation]] — 评测速查表

---

## 2026 LLM-as-Judge 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GPT-4o Judge** | 最常用评判模型，与人类一致性 >85% | GA |
| **Claude Judge** | 长上下文评判，适合复杂任务 | GA |
| **MT-Bench** | 多轮对话评判基准 | GA |
| **AlpacaEval** | 自动化指令遵循评估 | GA |
| **Judge 偏差校正** | 位置偏差/冗长偏差校正技术 | GA |

## 生产最佳实践

1. **多 Judge 交叉验证**：用 2-3 个不同模型评判，取平均减少偏差
2. **位置偏差校正**：交换 A/B 顺序评判，避免位置偏好
3. **评判标准明确**：提供详细的评分标准和示例，提高一致性
4. **与人类评估校准**：定期与人类评估对比，确保 Judge 可靠性
5. **成本意识**：Judge 调用成本高，仅用于关键评估场景