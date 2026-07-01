---
title: "Learn Claude Code L09：Memory — 压缩会丢细节，要有一层不丢的"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - memory
  - persistence
sources:
  - "_raw/github-sources/learn-claude-code/s09_memory/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第九课：用文件系统实现跨压缩、跨会话的记忆层——.memory/ Markdown 文件 + MEMORY.md 索引 + 每轮结束后的提取器。"
provenance:
  extracted: 0.82
  inferred: 0.15
  ambiguous: 0.03
base_confidence: 0.72
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Learn Claude Code L09 Memory System"
  - Learn_Claude_Code_L09_Memory_System

---
# Learn Claude Code L09：Memory — 压缩会丢细节，要有一层不丢的

> **一句话理解**: LLM 没有持久状态，上下文压缩又会丢细节。记忆层用文件系统保存稳定偏好和项目知识，跨压缩、跨会话保留。

## 问题

s08 的 autoCompact 会把当前目标写进摘要，但细节会丢失（如“用 tab 缩进”被简化成“用户有代码风格偏好”）。而且新开会话连摘要也没了。

## 解决方案

- 存储：`.memory/` 目录下每个记忆一个 `.md` 文件，带 YAML frontmatter（`name` / `description` / `type`）
- 索引：`MEMORY.md` 一行一个链接，常驻 SYSTEM prompt
- 加载：按需把相关记忆注入当前 user turn
- 写入：每轮对话结束后由提取器自动保存新记忆

## 四类记忆

| 类型 | 回答什么 | 示例 |
|------|---------|------|
| user | 你是谁 | “用 tab 不用空格” |
| feedback | 怎么做事 | “别 mock 数据库” |
| project | 正在发生什么 | “auth 重写是合规驱动” |
| reference | 东西在哪找 | “pipeline bug 在 Linear INGEST” |

## 加载路径

1. **索引常驻 SYSTEM**：`build_system()` 把 `MEMORY.md` 清单注入 prompt（可被 prompt cache 缓存）^[extracted]
2. **相关记忆按需注入**：每轮开始时用轻量 side-query 选出相关记忆文件，再读内容注入 user turn（最多 5 条）^[extracted]

## 写入时机

`extract_memories()` 在模型停止且没有 tool_use 时运行：先检查是否已有重复，再用 LLM 提取 `{name, type, description, body}` JSON 数组，只有确实有新信息时才写文件。

## 关联阅读

- [[90_Learn/courses/share_ai/learn_claude_code]] — 完整 20 课映射
- [[_references/learn-claude-code]] — 仓库引用索引
- [[15_Agent_Production/Course_Notes/Learn_Claude_Code_L08_Context_Compact]] — 上下文压缩
- [[15_Agent_Production/Memory_Infrastructure/Agent_Memory_Systems_2026]] — Agent 记忆系统 2026
