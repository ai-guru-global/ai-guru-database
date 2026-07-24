---
title: 测试与评估 (AI Testing)
category: 09-testing
tags: ["testing", "ai-testing", "prompt-testing", "evaluation"]
summary: "> AI 测试是保障 LLM 应用质量的关键环节，覆盖 Prompt 测试、RAG 评估、Agent 评估、合同测试等多个维度。"
created: 2026-05-31
updated: 2026-05-31
tier: core
sources: []

---
# 测试与评估 (AI Testing)

> AI 测试是保障 LLM 应用质量的关键环节，覆盖 Prompt 测试、RAG 评估、Agent 评估、合同测试等多个维度。

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI_Test_Framework_2026](./Testing_Fundamentals/AI_Test_Framework_2026.md) | AI 测试框架全栈指南 | QA、开发者 |
| [AI-Testing-in-nutshell](./Testing_Fundamentals/AI-Testing-in-nutshell.md) | AI 测试速查：核心概念快速掌握 | 快速入门 |
| [Contract_Testing](测试/Contract_Testing.md) | LLM 契约测试：输入输出规范验证 | 开发者、QA |
| [Test_Data_Management](测试/Test_Data_Management.md) | 测试数据管理：合成数据、边界案例 | 数据工程师 |

## Deep Dive 文档

### Prompt、RAG 与 Agent 测试

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Promptfoo Deep Dive](./Testing_Frameworks/Promptfoo_Deep_Dive.md) | Prompt 测试框架：批量测试、版本对比 | 开发者、Prompt 工程师 |
| [RAGAS Deep Dive](测试/RAGAS_Deep_Dive.md) | RAG 评估框架：答案质量、召回率 | RAG 开发者 |
| [DeepEval Deep Dive](./Testing_Frameworks/DeepEval_Deep_Dive.md) | LLM 评估框架：单元测试、集成测试 | 开发者、QA |
| [Agent 评估深度解析](测试/Agent_Evaluation_Deep_Dive.md) | Agent 系统评估方法论、基准、LLM-as-Judge、成本约束 | Agent 开发者、QA |

### 安全测试

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [LLM 安全测试](./Testing_Frameworks/LLM_Safety_Testing_Deep_Dive.md) | 红队、越狱、对抗防御、OWASP LLM Top 10 | 安全工程师、QA |
| [回归测试](./Testing_Frameworks/Regression_Testing_LLM_Deep_Dive.md) | 非确定性输出的回归策略、黄金集、CI 门控 | QA、平台工程师 |

### 实验追踪

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Weights & Biases Deep Dive](测试/Weights_Biases_Deep_Dive.md) | 实验追踪与可视化 | 研究者、工程师 |

### 在线评估

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI 系统 A/B 测试](测试/AB_Testing_AI_Systems.md) | 实验设计、流量分配、统计分析、AI 特殊考量 | 产品经理、工程师 |

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

- [AI运维](../运维/) -- AI 运维与可观测性
- [Agent/Agent_Evaluation](../智能体/Agent_Evaluation/) -- Agent 评估

---

*Last updated: 2026-04-26*

## Related
- [[测试/Testing_Fundamentals/AI_Test_Framework_2026|AI 系统测试框架 (AI Test Framework 2026)]]
- [[测试/Testing_Fundamentals/AI-Testing-in-nutshell|AI 测试与评估速成指南]]
- [[测试/Testing_Fundamentals/AI_Testing_for_dummy|AI 测试 - 小白版]]
- [[测试/Testing_Frameworks/Promptfoo_Deep_Dive|Promptfoo: LLM Prompt 测试框架]]
- [[测试/Testing_Frameworks/DeepEval_Deep_Dive|DeepEval: LLM 评估框架]]
- [[测试/Testing_Frameworks/Regression_Testing_LLM_Deep_Dive|LLM 回归测试深度指南]]
- [[测试/Testing_Frameworks/LLM_Safety_Testing_Deep_Dive|LLM 安全测试深度指南]]
- [[测试/Testing_Frameworks/Java_AI_Testing|Java AI 测试实践]]
- [[测试/RAGAS_Deep_Dive|RAGAS: RAG 评估框架]]
- [[测试/Agent_Evaluation_Deep_Dive|Agent 评估深度解析]]
- [[测试/Contract_Testing|契约测试 (Contract Testing for AI Systems)]]
- [[测试/Test_Data_Management|测试数据管理 (Test Data Management)]]
- [[测试/Weights_Biases_Deep_Dive|Weights & Biases: ML 实验追踪平台]]
- [[测试/AB_Testing_AI_Systems|AI 系统 A/B 测试]]
- [[测试/README_for_dummy|15 AI 测试 — 小白版 🧪]]

## 测试工具全景

| 工具 | 类型 | 语言 | 适用场景 |
|------|------|------|----------|
| DeepEval | 评估框架 | Python | 通用 LLM 测试 |
| Promptfoo | Prompt 测试 | Node.js | Prompt 工程 |
| RAGAS | RAG 评估 | Python | RAG 系统 |
| LangSmith | 追踪评估 | Python/JS | LangChain 生态 |
| W&B | 实验跟踪 | Python | 模型迭代 |
| Pact | 契约测试 | 多语言 | 微服务 API |
| Garak | 安全测试 | Python | 红队测试 |
| Optimizely | A/B 测试 | SaaS | 在线实验 |

## 测试金字塔

| 层级 | 测试类型 | 占比 | 速度 | 工具 |
|------|----------|------|------|------|
| 底层 | 单元测试 | 60% | 快 | pytest |
| 中层 | 集成/契约 | 25% | 中 | Pact |
| 顶层 | E2E/评估 | 15% | 慢 | DeepEval |

## 学习路径

| 阶段 | 推荐文档 | 目标 |
|------|----------|------|
| 入门 | Testing Fundamentals | 建立测试认知 |
| 实践 | Testing Frameworks | 掌握工具使用 |
| 进阶 | RAGAS + Agent Eval | 专项评估 |
| 精通 | AB Testing + W&B | 生产级体系 |

## 常见问题

| 问题 | 解答 |
|------|------|
| AI 测试与传统测试有何不同？ | 非确定性输出需语义/统计断言 |
| 应该先学什么？ | 从 Testing Fundamentals 开始 |
| 测试需要多少成本？ | 采样评估可控制成本 |
| 如何构建测试体系？ | 金字塔模型 + CI/CD 集成 |

## 统计

| 指标 | 数值 |
|------|------|
| 子域总数 | 9 |
| 文件总数 | 15+ |
| 核心工具 | 10+ |
| 覆盖场景 | 单元/集成/E2E/安全/性能 |

> 💡 AI 测试是保障 AI 系统可靠性的核心实践，从基础方法论到工具化实践，构建全面质量保障体系。

## 快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 零基础入门 | README_for_dummy | ★☆☆ |
| 了解测试基础 | Testing Fundamentals | ★☆☆ |
| 选择测试工具 | Testing Frameworks | ★★☆ |
| 评估 RAG | RAGAS | ★★☆ |
| 评估 Agent | Agent Evaluation | ★★☆ |

## 资源汇总

| 资源 | 类型 | 特点 |
|------|------|------|
| DeepEval | 框架 | 全面指标 |
| Promptfoo | 工具 | 快速上手 |
| RAGAS | 框架 | RAG 专用 |
| W&B | 平台 | 实验管理 |
| 本知识库 | 综合 | 中文体系化 |

---
*Last updated: 2026-07-21*
