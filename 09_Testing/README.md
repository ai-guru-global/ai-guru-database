---
title: AI 测试与评估 (AI Testing)
category: 09-testing
tags: ["testing", "ai-testing", "prompt-testing", "evaluation"]
summary: "> AI 测试是保障 LLM 应用质量的关键环节，覆盖 Prompt 测试、RAG 评估、Agent 评估、合同测试等多个维度。"
created: 2026-05-31
updated: 2026-05-31
tier: core

---
# AI 测试与评估 (AI Testing)

> AI 测试是保障 LLM 应用质量的关键环节，覆盖 Prompt 测试、RAG 评估、Agent 评估、合同测试等多个维度。

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Test_Framework_2026](./AI_Test_Framework_2026.md) | AI 测试框架全栈指南 | QA、开发者 |
| [AI-Testing-in-nutshell](./AI-Testing-in-nutshell.md) | AI 测试速查：核心概念快速掌握 | 快速入门 |
| [Contract_Testing](./Contract_Testing.md) | LLM 契约测试：输入输出规范验证 | 开发者、QA |
| [Test_Data_Management](./Test_Data_Management.md) | 测试数据管理：合成数据、边界案例 | 数据工程师 |

## Deep Dive 文档

### Prompt 与 RAG 测试

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Promptfoo Deep Dive](./Testing_Frameworks/Promptfoo_Deep_Dive.md) | Prompt 测试框架：批量测试、版本对比 | 开发者、Prompt 工程师 |
| [RAGAS Deep Dive](./RAGAS_Deep_Dive.md) | RAG 评估框架：答案质量、召回率 | RAG 开发者 |
| [DeepEval Deep Dive](./Testing_Frameworks/DeepEval_Deep_Dive.md) | LLM 评估框架：单元测试、集成测试 | 开发者、QA |

### 安全测试

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [LLM 安全测试](./Testing_Frameworks/LLM_Safety_Testing_Deep_Dive.md) | 红队、越狱、对抗防御、OWASP LLM Top 10 | 安全工程师、QA |
| [回归测试](./Testing_Frameworks/Regression_Testing_LLM_Deep_Dive.md) | 非确定性输出的回归策略、黄金集、CI 门控 | QA、平台工程师 |

### 实验追踪

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Weights & Biases Deep Dive](./Weights_Biases_Deep_Dive.md) | 实验追踪与可视化 | 研究者、工程师 |

## 测试类型

```
AI 测试类型
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        AI 测试金字塔                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│                         ▲ 端到端测试                              │
│                        ╱ ╲  Agent/RAG 评估                       │
│                       ╱   ╲  SWE-bench, RAGAS                    │
│                      ╱─────╲                                      │
│                     ▲ 集成测试 ▲                                  │
│                    ╱ ╲     ╱ ╲  API 契约、响应格式                │
│                   ╱   ╲   ╱   ╲  OpenAPI, JSON Schema             │
│                  ╱─────╲ ╱─────╲                                  │
│                 ▲ 单元测试▲              ▲ Prompt 测试 ▲          │
│                ╱ ╲     ╱ ╲            ╱ ╲                        │
│               ╱   ╲   ╱   ╲          ╱   ╲                       │
│              ╱─────╲ ╱─────╲        ╱─────╲                      │
│                                                                   │
│  单元测试:   模型输出验证    API 响应格式                          │
│  集成测试:   RAG 链路       多模型切换                             │
│  端到端:    Agent 任务完成  业务流程验证                          │
│  Prompt:    Few-shot 效果  Zero-shot 泛化                         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 评估基准

| 基准 | 适用场景 | 说明 |
|------|----------|------|
| **SWE-bench** | Agent 代码任务 | 软件工程任务评估 |
| **RAGAS** | RAG 系统 | 答案质量、上下文召回 |
| **BigCodeEval** | 代码生成 | 多编程语言评估 |
| **MMMU** | 多模态 | 多学科推理 |

## 工具对比

| 工具 | Prompt 测试 | RAG 评估 | Agent 评估 | 契约测试 |
|------|:-----------:|:---------:|:----------:|:--------:|
| **Promptfoo** | ✅ | ❌ | ❌ | ✅ |
| **RAGAS** | ❌ | ✅ | ❌ | ❌ |
| **DeepEval** | ✅ | ✅ | ✅ | ❌ |
| **Braintrust** | ✅ | ✅ | ✅ | ❌ |

## 关联目录

- [13_AI_Ops](../13_AI_Ops/) -- AI 运维与可观测性
- [15_Agent_Production/Agent_Evaluation](../15_Agent_Production/Agent_Evaluation/) -- Agent 评估

---

*Last updated: 2026-04-26*

## Related
- [[09_Testing/Testing_Frameworks/Promptfoo_Deep_Dive|Promptfoo: LLM Prompt 测试框架]]
- [[09_Testing/Weights_Biases_Deep_Dive|Weights & Biases: ML 实验追踪平台]]
- [[09_Testing/Test_Data_Management|测试数据管理 (Test Data Management)]]
- [[09_Testing/Contract_Testing|契约测试 (Contract Testing for AI Systems)]]
- [[09_Testing/README_for_dummy|15 AI 测试 — 小白版 🧪]]
- [[09_Testing/AI_Test_Framework_2026|AI 系统测试框架 (AI Test Framework 2026)]]
- [[09_Testing/RAGAS_Deep_Dive|RAGAS: RAG 评估框架]]

- [[09_Testing/AI-Testing-in-nutshell]] — AI 测试与评估速成指南 (共享: ai-testing, evaluation, prompt-testing, testing)
- [[09_Testing/AI_Testing_for_dummy]] — AI 测试 - 小白版 (共享: ai-testing, evaluation, prompt-testing, testing)
- [[09_Testing/Testing_Frameworks/Java_AI_Testing]] — Java AI 测试实践 (共享: ai-testing, evaluation, prompt-testing, testing)
- [[09_Testing/README_for_dummy.md|README_for_dummy]]

- [[09_Testing/Testing_Frameworks/Promptfoo_Deep_Dive|Promptfoo: LLM Prompt 测试框架]]
- [[09_Testing/Weights_Biases_Deep_Dive|Weights & Biases: ML 实验追踪平台]]
- [[09_Testing/Test_Data_Management|测试数据管理 (Test Data Management)]]
- [[09_Testing/Contract_Testing|契约测试 (Contract Testing for AI Systems)]]
- [[09_Testing/README_for_dummy|15 AI 测试 — 小白版 🧪]]
- [[09_Testing/AI_Test_Framework_2026|AI 系统测试框架 (AI Test Framework 2026)]]
- [[09_Testing/RAGAS_Deep_Dive|RAGAS: RAG 评估框架]]


- [[Regression_Testing_LLM_Deep_Dive|LLM 回归测试深度指南 - 非确定性输出的质量守护]]
