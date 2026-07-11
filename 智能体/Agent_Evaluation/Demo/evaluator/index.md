---
title: Evaluator
type: index
created: 2026-07-02
updated: 2026-07-11
sources: []
tags: [auto-index]
---

# Evaluator

评估器核心代码 — 实现 LLM-as-Judge、安全检查（safety check）、多维度打分等 Agent 输出质量评估逻辑。

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[智能体/Agent_Evaluation/Demo/evaluator/core|core]] | Core evaluation dispatcher logic | evaluation engineers |
| [[智能体/Agent_Evaluation/Demo/evaluator/llm_judge|llm judge]] | LLM-based automatic evaluation module | evaluation engineers |
| [[智能体/Agent_Evaluation/Demo/evaluator/metrics|metrics]] | Evaluation metrics calculation module | evaluation engineers |
| [[智能体/Agent_Evaluation/Demo/evaluator/safety_checker|safety checker]] | Safety compliance checking module | security engineers |
| [[智能体/Agent_Evaluation/Demo/evaluator/scorer|scorer]] | Score aggregation and ranking module | evaluation engineers |
| [[智能体/Agent_Evaluation/Demo/evaluator/__init__|  init  ]] | Module initialization file | developers |

## Related

- [[智能体/Agent_Evaluation/Demo/index|Demo 首页]]
- [[智能体/Agent_Evaluation/Rubrics/index|评分规则]]
