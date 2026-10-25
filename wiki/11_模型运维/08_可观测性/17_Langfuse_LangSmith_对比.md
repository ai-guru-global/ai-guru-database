---
title: "Langfuse vs LangSmith: LLM 可观测性平台功能对比"
category: "11-mlops-pipeline"
tags: ["observability", "llm", "langfuse", "langsmith", "tracing", "evaluation"]
summary: "Langfuse（开源自托管）与 LangSmith（LangChain 官方 SaaS）的功能清单与逐项对比，含差异化能力与选型建议。"
created: 2026-10-15
updated: 2026-10-15
tier: supporting
aliases:
  - "Langfuse vs LangSmith"
  - "Langfuse LangSmith 对比"
sources:
  - "概念/RAG/langfuse.md"
  - "概念/RAG/langsmith.md"
name_zh: "Langfuse 与 LangSmith 对比"
---

# Langfuse vs LangSmith: LLM 可观测性平台功能对比

> 中文简称：Langfuse 与 LangSmith 对比

> **一句话理解**: Langfuse 是开源可自托管的 LLM 可观测性平台，LangSmith 是 LangChain 官方闭源 SaaS——功能面高度重叠，差异主要在开源/托管模式与生态绑定。

---

## 1. 定位速览

| 维度 | Langfuse | LangSmith |
|------|----------|-----------|
| **开发商** | Langfuse（开源社区） | LangChain Inc. |
| **类型** | 开源（MIT），可自托管 | 闭源 SaaS（免费层 + Developer + Enterprise，企业版支持自托管） |
| **存储** | 自托管 PostgreSQL + ClickHouse | LangChain 云端 |
| **数据主权** | 完全自控，满足 GDPR/SOC2 数据驻留 | 数据存云端，合规需评估 |
| **生态绑定** | 框架中立（LangChain/LlamaIndex/OpenAI/OTel） | LangChain / LangGraph 原生深度集成 |

---

## 2. Langfuse 功能清单

| 功能 | 说明 |
|------|------|
| **Tracing 链路追踪** | 记录每次 LLM 调用的输入/输出、Token 用量、延迟、metadata；支持 span 记录工具调用 |
| **自动集成** | LangChain CallbackHandler、LlamaIndex CallbackManager、OpenAI `@observe()` 装饰器、OpenTelemetry |
| **评估 Evaluation** | 手动打分 + 自动评估：毒性检测、幻觉检测、相关性评估、自定义 LLM-as-Judge |
| **Prompt 管理** | Prompt 版本化、label（如 production）、运行时拉取编译、支持 A/B 测试与回滚 |
| **数据集管理** | 创建测试数据集、添加测试用例、将运行结果关联到 trace 做批量评估 |
| **Dashboard UI** | 可视化分析、成本/Token 监控 |
| **自托管部署** | Docker Compose / K8s 部署（PostgreSQL + ClickHouse） |

## 3. LangSmith 功能清单

| 功能 | 说明 |
|------|------|
| **Tracing 追踪** | LLM 调用、Chain 执行链路、Agent 工具调用、LangGraph 状态图、嵌套 Run 树形展示 |
| **Evaluation 评估** | 内置评估器（准确性/相关性）、LLM-as-Judge、代码评估器、数据集管理、批量评估实验 |
| **Playground 调试** | Prompt 在线编辑 + 测试、多模型 A/B 对比、版本管理（LangSmith 独有能力） |
| **Monitoring 监控** | 延迟/成本/Token 统计、异常检测、用户反馈分析 |
| **Prompt Hub** | Prompt 版本管理与共享 |
| **零配置集成** | 设 `LANGSMITH_TRACING` 等三个环境变量即可自动追踪所有 LangChain 调用 |

---

## 4. 关键差异

1. **开源 vs SaaS**：Langfuse 开源可自托管，适合数据合规场景；LangSmith 闭源 SaaS，企业版才可自托管。
2. **生态绑定**：LangSmith 与 LangChain/LangGraph 原生深度集成，Agent 状态图可视化最强；Langfuse 框架中立。
3. **独有能力**：LangSmith 有在线 Playground；Langfuse 胜在数据主权和免费自托管。
4. **功能重叠面**：Tracing、评估、Prompt 管理、数据集管理四家核心能力两者都有。

---

## 5. 选型建议

| 场景 | 推荐 |
|------|------|
| LangChain / LangGraph 技术栈 | LangSmith |
| 开源自托管、数据合规要求高 | Langfuse（或 Opik） |
| 轻量 API 监控 | Helicone |
| ML 全栈观测 | Arize Phoenix |
| 生产级追踪 | LangSmith / Langfuse / Opik |

---

## 相关页面

- [[概念/RAG/langfuse|Langfuse（开源 LLM 可观测性平台）]]
- [[概念/RAG/langsmith|LangSmith LLM 可观测性平台]]
- [[11_模型运维/08_可观测性/07_LangSmith_深入分析|LangSmith 深入分析]]
- [[11_模型运维/08_可观测性/10_llm_observability_aiops|LLM 可观测性与 AIOps]]
- [[11_模型运维/08_可观测性/09_LLM_可观测性|LLM 可观测性]]

---

*Last updated: 2026-10-15*
