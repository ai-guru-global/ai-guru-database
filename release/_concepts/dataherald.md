---
title: "DataHerald (自然语言转 SQL 引擎)"
category: -concepts
tags: ["nl2sql", "text-to-sql", "database", "llm", "business-intelligence"]
relationships:
  - target: "_concepts/llamaindex"
    type: related_to
  - target: "_concepts/langchain"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "开源的自然语言转 SQL 引擎，让非技术人员通过自然语言查询数据库，支持多数据库后端和 Schema 理解。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.78
lifecycle: stable
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

- [[_concepts/llamaindex]] — LlamaIndex RAG 框架
- [[_concepts/langchain]] — LangChain 应用开发框架
- query — DuckDB SQL 查询
