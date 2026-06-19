---
title: "Agentic RAG 应用大白话：Agentic RAG、Text2SQL、代码生成工作流"
category: "11-rag-systems"
tags: ["agentic-rag", "text2sql", "code-generation", "rag", "agent", "for-dummy"]
summary: "> **一句话理解**: Agentic RAG 让 AI 像侦探一样反复查资料再回答，Text2SQL 让 AI 当数据库翻译官，代码生成工作流让 AI 参与从需求到上线的全过程——三者都是把大模型从‘聊天工具’变成‘能干活的助手’。"
created: "2026-06-16"
updated: "2026-06-16"
---

# Agentic RAG 应用大白话：Agentic RAG、Text2SQL、代码生成工作流

> **一句话理解**: Agentic RAG 让 AI 像侦探一样反复查资料再回答，Text2SQL 让 AI 当数据库翻译官，代码生成工作流让 AI 参与从需求到上线的全过程——三者都是把大模型从“聊天工具”变成“能干活的助手”。

---

## 1. Agentic RAG：会反复查资料的侦探

### 1.1 一句话理解

传统 RAG 像学生开卷考只翻一次书；Agentic RAG 像侦探查案，会反复翻资料、交叉验证、追问线索，直到答案靠谱。

### 1.2 传统 RAG 的局限

```
用户问：这家公司去年营收多少？
↓
检索一次：找到 5 篇新闻
↓
生成答案：可能新闻没提营收，模型就开始瞎编
```

### 1.3 Agentic RAG 怎么做

```
用户提问
  ↓
Agent 判断：需要检索吗？
  ├─ 不需要 → 直接回答
  └─ 需要 → 检索
            ↓
      评估结果质量
            ↓
      ├─ 足够 → 生成答案
      ├─ 不够 → 重写查询再检索
      └─ 矛盾 → 多源交叉验证
```

### 1.4 代表方案

| 方案 | 特点 |
|------|------|
| **Self-RAG** | 自己判断是否需要检索 |
| **CRAG** | 检索质量低时改查询或 web 搜索 |
| **ReAct RAG** | 推理和行动交替，多轮迭代 |

### 1.5 适合场景

- 复杂企业知识库问答。
- 法律咨询、医疗诊断。
- 科研文献综述。

---

## 2. Text2SQL：数据库翻译官

### 2.1 一句话理解

Text2SQL 就像给数据库配了一位“翻译官”：你对它说人话，它自动帮你写成数据库能懂的 SQL。

### 2.2 输入输出示例

```
用户：去年销售额最高的三个城市是哪些？
AI：SELECT city, SUM(sales) FROM orders WHERE year=2024 GROUP BY city ORDER BY SUM(sales) DESC LIMIT 3;
```

### 2.3 为什么难？

- 数据库表多、字段名缩写。
- 自然语言有歧义。
- SQL 语法严格，一个符号错就失败。
- 要防止 `DROP TABLE` 等危险操作。

### 2.4 典型流程

```
用户问题
  ↓
Schema 链接（找相关表/字段）
  ↓
SQL 生成
  ↓
语法/安全检查
  ↓
执行并返回结果
```

### 2.5 安全措施

- 数据库账号只读。
- 结果脱敏。
- 高风险操作人工确认。

---

## 3. 代码生成工作流：AI 辅助的流水线

### 3.1 一句话理解

代码生成工作流就像一条“AI 辅助的流水线”：从你想做什么，到代码上线运行，每一步都有 AI 帮忙，但每一步也都有自动化检查把关。

### 3.2 为什么需要工作流？

直接让 AI 生成代码的问题：
- 可能不符合项目规范。
- 可能有 bug 或安全漏洞。
- 难以追溯和复现。

### 3.3 典型流程

```
需求描述
  ↓
AI 规划（拆分任务、选方案）
  ↓
AI 生成代码 + 测试
  ↓
静态检查（lint、类型检查）
  ↓
自动化测试
  ↓
代码审查
  ↓
合并、构建、部署
  ↓
监控与回滚
```

### 3.4 AI 在每个环节的角色

| 环节 | AI 能力 |
|------|---------|
| 需求理解 | 解析自然语言需求 |
| 代码生成 | 续写、函数生成、重构 |
| 测试生成 | 自动生成单元测试 |
| 代码审查 | AI Reviewer |
| 文档生成 | 自动写注释和文档 |

---

## 4. 三者关系

```
Agentic RAG：让 AI 会查资料
Text2SQL：让 AI 会查数据库
代码生成工作流：让 AI 会写代码并上线
          ↓
    共同目标：让 AI 从“会说”变成“会干”
```

---

## 5. 核心概念速查表

| 概念 | 一句话 | 解决什么问题 |
|------|--------|--------------|
| **Agentic RAG** | 反复查资料的侦探 | 一次检索答案不准 |
| **Text2SQL** | 数据库翻译官 | 不会 SQL 的人想查数据 |
| **代码生成工作流** | AI 辅助的流水线 | AI 代码质量不可控 |

---

*Last updated: 2026-06-16*

## Related

- [[concepts/agentic-rag|Agentic RAG]]
- [[concepts/text2sql|Text2SQL]]
- [[concepts/code-generation-workflow|代码生成工作流]]
- [[concepts/rag-systems|RAG 检索增强生成]]
- [[concepts/ai-agents|AI Agent]]
- [[concepts/tool-calling|工具调用]]
- [[11_RAG_Systems/Agentic_RAG_Guide|Agentic RAG 指南]]
- [[17_AI_Coding/README|AI 编程工具]]
