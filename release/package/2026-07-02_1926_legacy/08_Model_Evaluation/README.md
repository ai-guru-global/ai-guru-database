---
title: 模型评估 (Model Evaluation)
category: 08-model-evaluation
tags: ["model-evaluation", "metrics", "ab-testing", "benchmark"]
summary: "> **一句话理解**: 模型评估就像考试——你需要设计不同类型的考题（评估指标），用合理的考试规则（评估方法），才能判断学生（模型）是否真的学好了，而不是只会背答案（过拟合）。"
created: 2026-05-31
updated: 2026-05-31
tier: core

---
# 模型评估 (Model Evaluation)

> **一句话理解**: 模型评估就像考试——你需要设计不同类型的考题（评估指标），用合理的考试规则（评估方法），才能判断学生（模型）是否真的学好了，而不是只会背答案（过拟合）。

---

## 本章内容

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Model Evaluation](./Model_Evaluation.md) | 分类/回归/排序指标、LLM 评估基准、统计显著性 | 系统学习 |
| [Model Evaluation for Dummy](./Model_Evaluation_for_dummy.md) | 评估概念的简化版解释 | 初学者 |
| [Evaluation-in-nutshell](./Evaluation-in-nutshell.md) | 模型评估速成指南 | 快速入门 |
| [Evaluation Automation 2026](./Evaluation_Automation_2026.md) | CI/CD 中的自动评估流水线 | 进阶 |
| [Online Evaluation](./Evaluation_Tools/Online_Evaluation.md) | A/B 测试、影子流量、金丝雀发布 | 进阶 |
| [LLM-as-Judge 深度解析](./Evaluation_Tools/LLM_as_Judge_Deep_Dive.md) | 单点评分、成对比较、Rubric 评估、偏差缓解 | 进阶 |
| [Multimodal Evaluation Benchmarks](./Benchmarks/Multimodal_Evaluation_Benchmarks.md) | MMMU/MathVista/DocVQA/POPE 等视觉评测 | 进阶 |
| [Long Context Evaluation](./Benchmarks/Long_Context_Evaluation.md) | 128K+ 长上下文模型评估方法 | 进阶 |
| [**Unified Benchmark Comparison**](./Unified_Benchmark_Comparison.md) | 跨领域 AI 基准对比: LLM/CV/Speech/Multimodal/Agent SOTA | 进阶 |
| [**LLM Benchmark Suite 2026**](./Benchmarks/LLM_Benchmark_Suite_2026.md) | MMLU/GSM8K/HumanEval/SWE-bench/AIME/GPQA 全基准解读 | 进阶 |
| [**Agentic Benchmark Guide**](./Benchmarks/Agentic_Benchmark_Guide.md) | τ-bench/BFCL/SWE-bench/BrowseComp Agent 评测全景 | 进阶 |
| [LM Evaluation Harness Deep Dive](./Evaluation_Tools/LM_Evaluation_Harness_Deep_Dive.md) | EleutherAI 学术基准评测框架：MMLU/GSM8K/HumanEval 等 | 进阶 |
| [OpenCompass Deep Dive](./Evaluation_Tools/OpenCompass_Deep_Dive.md) | 上海 AI Lab 一站式评测平台：中文/多模态/CompassRank | 进阶 |
| [Fairness Evaluation](./Fairness_Evaluation_for_dummy.md) | 公平性评估入门 | 初学者 |
| [LLM 评估与测试大白话](./Benchmarks/LLM_Benchmarks_for_dummy.md) | BBH、Arena、红队测试、CI 集成评估、A/B 测试框架大白话 | 初学者 |
| [**LLM 评估方法论 2026**](./LLM_Evaluation_2026.md) | 自动化基准、人工评估、LLM-as-Judge、评估流水线 | 所有从业者 |
| [**RAG 评估深度解析**](./RAG_Evaluation_Deep_Dive.md) | 检索/生成评估、RAGAS/Ares/TruLens、LLM-as-Judge 偏见控制、A/B 测试 | RAG 开发者 |

---

## 学习路径

- **快速入门** → 待补充：Evaluation-in-nutshell.md
- **系统学习** → [Model Evaluation](./Model_Evaluation.md)（涵盖分类、回归、生成任务指标）
- **简化版** → [Model Evaluation for Dummy](./Model_Evaluation_for_dummy.md)

---

## 与其他章节的关联

### 前置知识
- [机器学习](../机器学习/README.md) — 偏差-方差权衡、过拟合概念
- [概率统计](../数学基础/Probability_Statistics/Probability_Statistics.md) — 统计检验、置信区间
- [模型训练](../模型训练/) — 训练过程与评估的关系

### 进阶方向
- [MLOps 流水线](../MLOps/) — 评估自动化和持续监控
- [测试](../AI测试/README.md) — AI 系统测试框架
- [AI Ops](../AI运维/README.md) — 模型性能监控与告警
- [价值对齐](../伦理安全/Value_Alignment/Value_Alignment.md) — 公平性评估

---

## 规划中的内容

- [x] ✅ [Evaluation Automation 2026](./Evaluation_Automation_2026.md) — CI/CD 自动评估流程
- [x] ✅ [Online Evaluation](./Evaluation_Tools/Online_Evaluation.md) — A/B 测试、影子流量、金丝雀发布
- [x] ✅ [LLM-as-Judge 深度解析](./Evaluation_Tools/LLM_as_Judge_Deep_Dive.md) — LLM 评委评估方法论
- [ ] 领域特定评估（医疗/金融/法律场景评估规范）
- [ ] 评估数据集构建（高质量评估集的采集与维护）

---

*本章内容持续建设中。*

## Related
- [[模型评估/Benchmarks/LLM_Benchmark_Suite_2026|LLM Benchmark Suite 2026 — 大语言模型评测基准全览]]
- [[模型评估/Benchmarks/Agentic_Benchmark_Guide|Agentic Benchmarks — AI Agent 评测全景指南]]
- [[模型评估/Evaluation_Tools/LLM_as_Judge_Deep_Dive|LLM-as-Judge 深度解析 (LLM-as-Judge Deep Dive)]]
- [[模型评估/Evaluation-in-nutshell|模型评估速成指南]]
- [[模型评估/Evaluation_Tools/Online_Evaluation|在线评估 (Online Evaluation)]]
- [[模型评估/Fairness_Evaluation_for_dummy|公平性评估 - 小白版]]
- [[模型评估/Evaluation_Automation_2026|自动化模型评估 2026 (Evaluation Automation)]]
- [[模型评估/README_for_dummy|08 模型评估 — 小白版 📝]]
- [[模型评估/Benchmarks/LLM_Benchmarks_for_dummy|LLM 评估与测试大白话]]
- [[_concepts/bbh|BBH]]
- [[_concepts/llm-arena|LLM Arena]]
- [[_concepts/red-teaming|红队测试]]
- [[_concepts/ci-integrated-evaluation|CI 集成评估]]
- [[_concepts/ab-testing-framework|A/B 测试框架]]

- [[模型评估/Model_Evaluation]] — 模型评估 (Model Evaluation) (共享: ab-testing, benchmark, metrics, model-evaluation)
- [[模型评估/Evaluation_Tools/Online_Evaluation.md|Online_Evaluation]]
- [[模型评估/Fairness_Evaluation_for_dummy.md|Fairness_Evaluation_for_dummy]]
- [[模型评估/Evaluation_Automation_2026.md|Evaluation_Automation_2026]]
- [[模型评估/README_for_dummy.md|README_for_dummy]]
- [[模型评估/Benchmarks/Multimodal_Evaluation_Benchmarks|Multimodal_Evaluation_Benchmarks]]
- [[模型评估/Benchmarks/Long_Context_Evaluation|Long_Context_Evaluation]]

## 本期新增

- [[模型评估/Benchmarks/Multimodal_Evaluation_Benchmarks|Multimodal Evaluation Benchmarks]]
- [[模型评估/Benchmarks/Long_Context_Evaluation|Long Context Evaluation]]

## 新增页面

- [[模型评估/Evaluation_Tools/LLM_as_Judge_Guide|LLM-as-Judge 评估指南]]
- [[模型评估/Unified_Benchmark_Comparison|统一 Benchmark 对比表]]
