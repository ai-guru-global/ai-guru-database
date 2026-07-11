---
title: "Text2SQL"
category: -concepts
tags: ["text2sql", "nl2sql", "database", "rag", "agent", "sql"]
relationships:
  - target: "概念/rag-systems"
    type: related_to
  - target: "概念/ai-agents"
    type: used_by
  - target: "概念/prompt-engineering"
    type: uses
  - target: "概念/code-generation"
    type: belongs_to
sources:
  - RAG系统/README.md
  - Agent/Agent_Skills/Agent_Skills_Ecosystem_Catalog.md
  - AI编程/README.md
summary: "Text2SQL（也叫 NL2SQL）是把自然语言问题自动转换成可执行 SQL 查询的技术。它让不懂 SQL 的人能用大白话查数据库，是数据分析、智能客服、企业 BI 的核心能力。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Text2sql

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Text2SQL

## 核心要点

- **Text2SQL = 自然语言 → SQL**。
- **输入**：用户用大白话提问，如“去年销售额最高的三个城市是哪些？”
- **输出**：模型生成对应的 SQL：`SELECT city, SUM(sales) ... GROUP BY city ... ORDER BY ... LIMIT 3`
- **核心挑战**：理解用户意图、匹配数据库 schema、生成正确 SQL、处理复杂查询（多表 join、聚合、子查询）。

## 一句话理解

Text2SQL 就像给数据库配了一位‘翻译官’：你对它说人话，它自动帮你写成数据库能懂的 SQL。

## 详细内容

### 为什么难？

1. **Schema 复杂**：真实数据库有几十上百张表、字段名缩写、外键关系。
2. **歧义多**："最近的订单"可能指时间近、也可能指距离近。
3. **SQL 语法严格**：一个逗号、引号错了就执行失败。
4. **安全敏感**：生成 `DROP TABLE` 或泄露隐私数据的 SQL 会出大事。

### 典型方案

| 方案 | 说明 |
|------|------|
| **提示工程** | 把表结构、示例 SQL 放进 prompt，让 LLM 直接生成 |
| **RAG + Text2SQL** | 先检索相似问题和对应 SQL，再让模型参考生成 |
| **Agentic Text2SQL** | Agent 先理解意图、再查 schema、再生成、再执行验证 |
| **微调专用模型** | 用 Spider、BIRD 等 Text2SQL 数据集训练小模型 |

### 关键组件

```
用户问题
  ↓
Schema 链接（找到相关表/字段）
  ↓
SQL 生成
  ↓
SQL 校验（语法/安全）
  ↓
执行并返回结果（或解释）
```

### 安全与治理

- **只读权限**：生产环境禁止生成 DELETE/DROP/UPDATE。
- **结果脱敏**：返回前过滤敏感字段。
- **人工确认**：高风险操作需人工审批。
- **查询审计**：记录所有生成的 SQL 和用户问题。

### 主流数据集与评估

| 数据集 | 特点 |
|--------|------|
| **Spider** | 多表、跨领域，学术界标准 |
| **BIRD** | 真实数据库、脏数据，更贴近生产 |
| **WikiSQL** | 单表简单查询 |

## 开放问题

- 复杂业务逻辑（窗口函数、CTE、存储过程）的生成稳定性。
- 跨数据库方言（MySQL/PostgreSQL/Snowflake/BigQuery）的适配。
- 生成 SQL 的可解释性和错误诊断。

## Related

- [[概念/rag-systems]] — RAG 检索增强生成
- [[概念/ai-agents]] — AI Agent
- [[概念/code-generation]] — 代码生成
- [[概念/prompt-engineering]] — 提示工程
- [[RAG系统/README]] — RAG 系统
- [[编程/README]] — AI 编程工具
