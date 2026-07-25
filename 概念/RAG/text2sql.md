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
  - 14_RAG系统/README.md
  - 15_智能体/05_Agent_Skills/Agent_Skills_Ecosystem_Catalog.md
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
updated: 2026-07-21
aliases:
  - Text2sql

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
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
- [[概念/rag-production-architecture|RAG 生产架构]] — 生产级 RAG 设计
- [[14_RAG系统/README]] — RAG 系统
- [[16_编程/README]] — AI 编程工具

---

## 2026 Text2SQL 生态

| 工具/模型 | 定位 | 核心优势 | 适用场景 |
|---------|------|---------|----------|
| **DIN-SQL** | 分解式 Text2SQL | 复杂查询分解、高准确率 | 企业 BI |
| **DAIL-SQL** | 示例增强 | Few-shot、跨库泛化 | 通用场景 |
| **SQLCoder** | 开源模型 | 15B 参数、可私有部署 | 数据安全敏感 |
| **GPT-4 + Schema** | API 方案 | 零训练、快速集成 | 原型验证 |

## 生产最佳实践

1. **Schema 链接**：提供完整表结构、字段注释、示例数据提升生成准确率
2. **SQL 验证**：生成后必须经过语法检查 + 沙箱执行验证
3. **权限控制**：仅允许 SELECT 查询，禁止 DDL/DML 操作
4. **结果解释**：将 SQL 结果转换为自然语言解释，提升可理解性
5. **迭代优化**：收集失败案例构建 Few-shot 示例库，持续提升准确率

## 2026 Text2SQL 生态现状

| 方案 | 准确率 | 适用场景 | 状态 |
|------|------|------|------|
| LLM + Schema | 85%+ | 通用查询 | ✅ 成熟 |
| LLM + Few-shot | 90%+ | 领域适配 | ✅ 成熟 |
| LLM + Agent | 92%+ | 复杂查询 | ✅ 成熟 |
| 微调模型 | 93%+ | 特定领域 | ✅ 成熟 |
| DAIL-SQL | 90%+ | 学术基准 | ✅ 成熟 |
| DIN-SQL | 88%+ | 分解推理 | ✅ 成熟 |

## 检查清单

- [ ] Schema 描述已完善
- [ ] Few-shot 示例库已构建
- [ ] SQL 安全审计已配置
- [ ] 结果解释已配置
- [ ] 失败案例已收集
- [ ] 准确率已监控

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 准确率低 | Schema 不清晰 | 完善表/字段描述 |
| SQL 注入风险 | 未审计 | 只读权限 + 参数化 |
| 复杂查询失败 | 单次生成不足 | Agent 多步分解 |
| 结果不可解释 | 缺少转换 | SQL 结果转自然语言 |

## 延伸阅读

- [[概念/RAG/rag-patterns|RAG Patterns]] — RAG 模式
- [[概念/LLM/prompt-engineering|Prompt Engineering]] — 提示工程
- [[概念/Agent/tool-use|Tool Use]] — 工具调用
- [[概念/RAG/ragas|RAGAS]] — 评估框架
- [[概念/LLM/fine-tuning|Fine-tuning]] — 微调

> ℹ️ Text2SQL 是自然语言查询数据库的关键技术，2026年 LLM + Agent + Few-shot 组合 准确率已达 90%+，生产环境需配置安全审计和结果解释。

## 2026 Text2SQL 生态现状

| 方案 | 准确率 | 特色 | 状态 |
|------|------|------|------|
| GPT-4 + Few-shot | 90%+ | 通用、简单 | ✅ 主流 |
| DIN-SQL | 88% | 分解推理 | ✅ 成熟 |
| DAIL-SQL | 89% | 示例选择 | ✅ 成熟 |
| SQLCoder | 87% | 开源微调 | ✅ 开源 |
| Agent + 工具 | 92%+ | 多步推理 | ✅ 前沿 |

## 检查清单

- [ ] Schema 信息已完整提供给模型
- [ ] Few-shot 示例已准备（覆盖常见查询）
- [ ] SQL 安全审计已配置（只读/白名单）
- [ ] 结果解释已启用
- [ ] 错误处理和回退已配置
- [ ] 性能已评估（延迟/准确率）

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 生成 SQL 错误 | Schema 信息不足 | 提供完整 DDL + 注释 |
| 复杂查询失败 | 单步推理不足 | 使用 Agent 多步分解 |
| 安全风险 | 未限制权限 | 只读账号 + 白名单 |
| 方言不兼容 | 模型训练数据偏 PostgreSQL | 指定方言 + Few-shot |

## 延伸阅读

- [[概念/Agent/tool-use|Tool Use]] — 工具调用
- [[概念/RAG/ragas|RAGAS]] — 评估框架
- [[概念/LLM/fine-tuning|Fine-tuning]] — 微调
- [[概念/RAG/rag-patterns|RAG Patterns]] — RAG 模式
- [[概念/Agent/agent-frameworks|Agent Frameworks]] — Agent 框架

> ℹ️ Text2SQL 生产最佳实践：完整 Schema + Few-shot + 只读审计 + 结果解释，复杂查询用 Agent 多步分解。
