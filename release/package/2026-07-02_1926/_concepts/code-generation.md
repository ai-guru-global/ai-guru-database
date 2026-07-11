---
title: "代码生成"
category: -concepts
tags: ["code-generation", "ai-coding", "copilot", "program-synthesis"]
relationships:
  - target: "_concepts/code-generation-workflow"
    type: part_of
  - target: "_concepts/ai-agents"
    type: used_by
  - target: "_concepts/text2sql"
    type: belongs_to
sources:
  - AI编程/README.md
  - AI编程/Cursor_Deep_Dive.md
  - AI编程/GitHub_Copilot_Deep_Dive.md
summary: "代码生成是让大模型根据自然语言描述或上下文自动写出代码的技术。范围从单行补全、函数生成，到多文件项目开发、测试用例生成、代码审查辅助。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Code Generation"
  - "code generation"

---
# 代码生成

## 核心要点

- **代码生成 = 用自然语言或上下文让 AI 写代码**。
- **粒度可大可小**：从补全一行代码，到生成整个函数、模块、项目。
- **核心能力**：理解需求、选择算法、遵循语法、调用 API、处理边界条件。
- **典型应用**：IDE 智能补全、自动修 bug、生成单元测试、代码重构、Text2SQL。

## 一句话理解

代码生成就像给程序员配了一个“全能实习生”：你告诉它要做什么，它帮你写出第一版代码，你再审阅修改。

## 详细内容

### 主要形式

| 形式 | 说明 | 例子 |
|------|------|------|
| **代码补全** | 根据上下文续写 | GitHub Copilot |
| **函数生成** | 从注释/签名生成完整函数 | Cursor |
| **项目生成** | 多文件脚手架 | v0、Bolt |
| **测试生成** | 自动生成单元测试 | CodiumAI |
| **代码解释** | 把代码转成自然语言 | 各种 AI 代码助手 |

### 关键挑战

- 正确性：生成代码是否能运行、是否有 bug。
- 安全性：是否引入漏洞（如 SQL 注入）。
- 可维护性：是否符合项目风格。
- 版权：训练数据可能带来许可证风险。

## Related

- [[_concepts/code-generation-workflow]] — 代码生成工作流
- [[_concepts/ai-agents]] — AI Agent
- [[_concepts/text2sql]] — Text2SQL
- [[编程/README]] — AI 编程工具
- [[编程/Tools/AI_Coding_Assistants_2026]] — GitHub Copilot 深度解析
