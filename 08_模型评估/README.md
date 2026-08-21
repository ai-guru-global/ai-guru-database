---
title: 模型评估 (Model Evaluation)
category: 08-model-evaluation
tags: ["model-evaluation", "metrics", "ab-testing", "benchmark"]
summary: "> **一句话理解**: 模型评估就像考试——你需要设计不同类型的考题（评估指标），用合理的考试规则（评估方法），才能判断学生（模型）是否真的学好了，而不是只会背答案（过拟合）。"
created: 2026-05-31
updated: 2026-05-31
tier: core
sources: []

name_zh: "模型评估"
---
# 模型评估 (Model Evaluation)

> 中文简称：模型评估

> **一句话理解**: 模型评估就像考试——你需要设计不同类型的考题（评估指标），用合理的考试规则（评估方法），才能判断学生（模型）是否真的学好了，而不是只会背答案（过拟合）。

---

## 本章内容

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Model Evaluation](08_模型评估/01_评估基础/06_模型评估.md) | 分类/回归/排序指标、LLM 评估基准、统计显著性 | 系统学习 |
| [Model Evaluation for Dummy](08_模型评估/README.md) | 评估概念的简化版解释 | 初学者 |
| [Evaluation-in-nutshell](08_模型评估/01_评估基础/02_评估_简明指南.md) | 模型评估速成指南 | 快速入门 |
| [Evaluation Automation 2026](08_模型评估/05_自动化评估/02_评估_自动化_2026.md) | CI/CD 中的自动评估流水线 | 进阶 |
| [Online Evaluation](08_模型评估/04_评估工具/07_在线_评估.md) | A/B 测试、影子流量、金丝雀发布 | 进阶 |
| [LLM-as-Judge 深度解析](./04_评估工具/03_LLM_as_Judge_深入分析.md) | 单点评分、成对比较、Rubric 评估、偏差缓解 | 进阶 |
| [Multimodal Evaluation Benchmarks](./02_基准测试/09_多模态_评估_基准测试.md) | MMMU/MathVista/DocVQA/POPE 等视觉评测 | 进阶 |
| [Long Context Evaluation](./02_基准测试/08_Long_上下文_评估.md) | 128K+ 长上下文模型评估方法 | 进阶 |
| [**Unified Benchmark Comparison**](./02_基准测试/11_Unified_基准测试_对比.md) | 跨领域 AI 基准对比: LLM/CV/Speech/Multimodal/Agent SOTA | 进阶 |
| [**LLM Benchmark Suite 2026**](./02_基准测试/07_LLM_基准测试_Suite_2026.md) | MMLU/GSM8K/HumanEval/SWE-bench/AIME/GPQA 全基准解读 | 进阶 |
| [**Agentic Benchmark Guide**](./02_基准测试/01_Agentic_基准测试_指南.md) | τ-bench/BFCL/SWE-bench/BrowseComp Agent 评测全景 | 进阶 |
| [LM Evaluation Harness Deep Dive](./04_评估工具/05_LM_评估_脚手架_深入分析.md) | EleutherAI 学术基准评测框架：MMLU/GSM8K/HumanEval 等 | 进阶 |
| [OpenCompass Deep Dive](./04_评估工具/08_OpenCompass_深入分析.md) | 上海 AI Lab 一站式评测平台：中文/多模态/CompassRank | 进阶 |
| Fairness Evaluation | 公平性评估入门 | 初学者 |
| LLM 评估与测试大白话 | BBH、Arena、红队测试、CI 集成评估、A/B 测试框架大白话 | 初学者 |
| [**LLM 评估方法论 2026**](08_模型评估/03_LLM评估/03_LLM评估_2026.md) | 自动化基准、人工评估、LLM-as-Judge、评估流水线 | 所有从业者 |
| [**RAG 评估深度解析**](08_模型评估/03_LLM评估/05_RAG评估_深入分析.md) | 检索/生成评估、RAGAS/Ares/TruLens、LLM-as-Judge 偏见控制、A/B 测试 | RAG 开发者 |
| [A/B 测试方案模板](./05_自动化评估/01_AB测试模板.md) | 标准化 ML 模型 A/B 测试方案模板 | 算法 / 产品 |
| [模型评估报告模板](./05_自动化评估/03_评估_报告_模板.md) | 标准化模型评估报告模板 | 算法工程师 |

---

## 学习路径

- **快速入门** → 待补充：02_评估_简明指南.md
- **系统学习** → [Model Evaluation](08_模型评估/01_评估基础/06_模型评估.md)（涵盖分类、回归、生成任务指标）
- **简化版** → [Model Evaluation for Dummy](08_模型评估/README.md)

---

## 与其他章节的关联

### 前置知识
- [机器学习](../02_机器学习/README.md) — 偏差-方差权衡、过拟合概念
- [概率统计](01_数学基础/03_概率统计/02_概率统计.md) — 统计检验、置信区间
- [模型训练](../07_模型训练/) — 训练过程与评估的关系

### 进阶方向
- [MLOps 流水线](../11_模型运维/) — 评估自动化和持续监控
- [测试](../09_测试/README.md) — AI 系统测试框架
- [AI Ops](../13_运维/README.md) — 模型性能监控与告警
- [价值对齐](17_伦理安全/02_价值对齐/04_Value_对齐.md) — 公平性评估

---

## 规划中的内容

- [x] ✅ [Evaluation Automation 2026](08_模型评估/05_自动化评估/02_评估_自动化_2026.md) — CI/CD 自动评估流程
- [x] ✅ [Online Evaluation](08_模型评估/04_评估工具/07_在线_评估.md) — A/B 测试、影子流量、金丝雀发布
- [x] ✅ [LLM-as-Judge 深度解析](./04_评估工具/03_LLM_as_Judge_深入分析.md) — LLM 评委评估方法论
- [ ] 领域特定评估（医疗/金融/法律场景评估规范）
- [ ] 评估数据集构建（高质量评估集的采集与维护）

---

*本章内容持续建设中。*

## Related
- [[08_模型评估/02_基准测试/07_LLM_基准测试_Suite_2026|LLM Benchmark Suite 2026 — 大语言模型评测基准全览]]
- [[08_模型评估/02_基准测试/01_Agentic_基准测试_指南|Agentic Benchmarks — AI Agent 评测全景指南]]
- [[08_模型评估/04_评估工具/03_LLM_as_Judge_深入分析|LLM-as-Judge 深度解析 (LLM-as-Judge Deep Dive)]]
- [[08_模型评估/Evaluation-in-nutshell|模型评估速成指南]]
- [[08_模型评估/04_评估工具/Online_Evaluation|在线评估 (Online Evaluation)]]
- [[08_模型评估/README.md|公平性评估 - 小白版]]
- [[08_模型评估/Evaluation_Automation_2026|自动化模型评估 2026 (Evaluation Automation)]]
- [[08_模型评估/README|08 模型评估 — 小白版 📝]]
- [[08_模型评估/README.md|LLM 评估与测试大白话]]
- [[概念/bbh|BBH]]
- [[概念/llm-arena|LLM Arena]]
- [[概念/red-teaming|红队测试]]
- [[概念/ci-integrated-evaluation|CI 集成评估]]
- [[概念/ab-testing-framework|A/B 测试框架]]

- [[08_模型评估/01_评估基础/06_模型评估]] — 模型评估 (Model Evaluation) (共享: ab-testing, benchmark, metrics, model-evaluation)
- [[08_模型评估/04_评估工具/07_在线_评估.md|Online_Evaluation]]
- [[08_模型评估/README.md|Fairness_Evaluation_for_dummy]]
- [[08_模型评估/05_自动化评估/02_评估_自动化_2026.md|Evaluation_Automation_2026]]
- [[08_模型评估/README|README_for_dummy]]
- [[08_模型评估/02_基准测试/02_benchmark_evaluation|Multimodal_Evaluation_Benchmarks]]
- [[08_模型评估/02_基准测试/08_Long_上下文_评估|Long_Context_Evaluation]]

## 本期新增

- [[08_模型评估/02_基准测试/02_benchmark_evaluation|Multimodal Evaluation Benchmarks]]
- [[08_模型评估/02_基准测试/08_Long_上下文_评估|Long Context Evaluation]]

## 新增页面

- [[08_模型评估/04_评估工具/04_LLM_as_Judge_指南|LLM-as-Judge 评估指南]]
- [[08_模型评估/02_基准测试/11_Unified_基准测试_对比|统一 Benchmark 对比表]]
