---
title: "DataHerald (自然语言转 SQL 引擎)"
category: -concepts
tags: ["nl2sql", "text-to-sql", "database", "llm", "business-intelligence"]
relationships:
  - target: "概念/llamaindex"
    type: related_to
  - target: "概念/langchain"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "开源的自然语言转 SQL 引擎，让非技术人员通过自然语言查询数据库，支持多数据库后端和 Schema 理解。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.78
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
---

# DataHerald

[DataHerald](https://github.com/Dataherald/dataherald) 是一个开源的 **自然语言转 SQL (NL2SQL) 引擎**，让非技术人员能够通过自然语言直接查询数据库，无需编写 SQL。它通过 LLM 理解用户的自然语言问题，结合数据库 Schema 理解，自动生成准确的 SQL 查询并返回结果。

## 核心特性

### 1. 多数据库支持

```python
# 支持的数据库后端
# - PostgreSQL
# - MySQL
# - SQL Server
# - Snowflake
# - BigQuery
# - DuckDB
# - SQLite
```

### 2. Schema 理解

```python
from dataherald import Dataherald

dh = Dataherald(api_key="your-key")

# 连接数据库
dh.connect_database(
    db_type="postgresql",
    connection_string="postgresql://user:pass@host:5432/db"
)

# 自动分析 Schema
# - 表结构
# - 列类型
# - 外键关系
# - 示例数据
```

### 3. 自然语言查询

```python
# 用户用自然语言提问
result = dh.query("What are the top 5 products by revenue last month?")

# DataHerald 内部:
# 1. 理解问题意图
# 2. 映射到 Schema (products, orders, revenue)
# 3. 生成 SQL
# 4. 执行查询
# 5. 返回结果 + SQL (可审计)
```

### 4. 黄金 SQL 库

```python
# 添加验证过的 Query-SQL 对
dh.add_golden_sql(
    question="What is the total revenue?",
    sql="SELECT SUM(amount) FROM orders WHERE status='completed'"
)
# 后续相似问题优先匹配黄金 SQL，提高准确率
```

## 典型应用场景

- **商业分析**: 非技术用户直接查询业务数据
- **数据民主化**: 降低数据查询的技术门槛
- **内部工具**: 企业知识库与数据库的融合
- **BI 增强**: 为 BI 工具添加自然语言查询能力

## 安装

```bash
pip install dataherald
```

## 参考资源

- [DataHerald GitHub](https://github.com/Dataherald/dataherald)
- [DataHerald 文档](https://docs.dataherald.com/)

## 相关概念

- [[概念/llamaindex]] — LlamaIndex RAG 框架
- [[概念/langchain]] — LangChain 应用开发框架
- [[概念/query]] — DuckDB SQL 查询

---

## 2026 Dataherald 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Dataherald** | NL2SQL 引擎 | GA |
| **自然语言查询** | 自然语言转 SQL | GA |
| **多数据库支持** | 支持多种数据库 | GA |
| **LLM 集成** | LLM 驱动查询 | GA |
| **与 LangChain 集成** | LangChain 集成 | GA |

## 生产最佳实践

1. **NL2SQL**：自然语言查询用 Dataherald
2. **多数据库**：支持多种数据库
3. **LLM 驱动**：用 LLM 驱动查询生成
4. **与 LangChain 配合**：Dataherald + LangChain
5. **安全查询**：查询安全控制

## 架构示例

```text
用户自然语言问题
        ↓
┌─────────────────┐
│  Dataherald     │  ← Schema 感知 + 示例学习
│  NL2SQL 引擎   │
└────────┬────────┘
         ↓
    生成的 SQL
         ↓
┌─────────────────┐
│  安全验证层     │  ← 只读检查 + 权限控制
└────────┬────────┘
         ↓
    数据库执行 → 结果返回
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| SQL 生成错误 | Schema 复杂 | 提供示例 + 描述 |
| 查询不安全 | 缺乏验证 | 只读权限 + SQL 审计 |
| 性能差 | 全表扫描 | 添加索引 + 查询限制 |
| 多表关联错误 | 关系复杂 | 提供 ER 图 + 示例 |

## 版本兼容性

| 工具 | 状态 | 说明 |
|------|------|------|
| Dataherald | GA | NL2SQL 引擎 |
| LangChain | GA | 应用框架 |
| DuckDB | GA | 分析数据库 |
| Vanna.ai | GA | 开源替代 |

## 生产检查清单

1. 配置只读数据库连接
2. 提供 Schema 描述和查询示例
3. 启用 SQL 安全验证
4. 设置查询超时和结果限制
5. 监控查询准确率和性能
6. 建立用户反馈改进机制

## 版本兼容性

| 组件 | 版本 | 特性 | 备注 |
|------|------|------|------|
| **Dataherald** | ≥ 0.8 | NL2SQL 引擎 | 开源核心 |
| **LangChain** | ≥ 0.2 | SQL Agent | 集成框架 |
| **Vanna.ai** | ≥ 0.5 | RAG + SQL | 替代方案 |
| **GPT-4** | - | 后端 LLM | SQL 生成 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| SQL 生成错误 | 表结构复杂 | 添加 schema 描述 + 示例 |
| 查询性能差 | 生成 SQL 未优化 | 添加索引提示 + EXPLAIN 检查 |
| 多表关联失败 | 缺乏关系信息 | 配置表间关系元数据 |
| 安全风险 | SQL 注入 | 只读权限 + 参数化查询 |

## 总结

Dataherald 是 NL2SQL 领域的代表工具，让非技术用户能用自然语言查询数据库。在 LLM 时代，NL2SQL 已成为数据民主化的关键技术。

> 💡 NL2SQL 的核心价值：让数据查询不再是技术门槛——业务人员直接用自然语言提问，AI 自动生成并执行 SQL。

