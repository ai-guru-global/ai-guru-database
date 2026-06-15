---
title: Hot Cache
updated: 2026-06-15T08:18:23Z
---

## Recent Activity

- **Ingested Microsoft AI Agents for Beginners 13 lesson READMEs** — 全部挂入 `13_Agent_Production/Microsoft_AI_Agents_L*.md`，补齐 17 课中缺失的 13 个深化页面（L00/L03/L06-L15/L18）。涵盖从课程环境、设计原则、可信 Agent、规划、多 Agent、元认知、生产化、协议（MCP/A2A/NLWeb）、上下文工程、记忆、MAF 框架、浏览器 Agent 到加密审计收据的全链路。每页含 Pydantic / OpenTelemetry / Ed25519 等具体代码示例与跨课交叉引用。

## Active Threads

- **Microsoft AI Agents 课程深化系列**：17 课页面已完整覆盖，下一步可考虑 ingest 对应的 `*-python-agent-framework.ipynb` notebook 作为可运行示例
- **`_raw/` 暂存区还剩 4 个仓库未 ingest**：learn-claude-code / hello-agents / ailearning / hands-on-llms 的章节 README 可按本批模式继续推进

## Key Takeaways

- **Agent 设计三视角**：UX 原则（L03）→ 工程模式（L04/L07/L08）→ 元认知（L09）→ 生产化（L10）→ 协议化（L11）→ 上下文与记忆（L12/L13）→ 框架收口（L14）→ 安全兜底（L18）
- **加密审计收据的边界（L18）**：Ed25519 签名证明 Attribution/Integrity/Ordering，**不证明** Correctness/Policy/Identity/Input truthfulness——这是治理系统设计的核心区分
- **上下文工程 ≠ 提示工程（L12）**：前者管理动态信息流（四类上下文 + 六大策略 + 四大失败模式），后者只关注静态指令

## Flagged Contradictions

- L03 "Agentic Design Principles"（UX 视角）vs [[13_Agent_Production/Agentic_Design_Patterns_AndrewNg]]（工程视角）—— 两者覆盖范围不同，需在引用处明确区分
