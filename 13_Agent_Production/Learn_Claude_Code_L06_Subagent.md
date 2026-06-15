---
title: "Learn Claude Code L06：Subagent — 大任务拆小，干净上下文"
category: 13-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - subagent
  - context-isolation
  - multi-agent
sources:
  - "_raw/github-sources/learn-claude-code/s06_subagent/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第六课：通过新增 task 工具 spawn 子 Agent，拥有独立 messages[]，只回传结论，避免主对话上下文被中间过程污染。"
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
---

# Learn Claude Code L06：Subagent — 大任务拆小，干净上下文

> **一句话理解**: 像“开一个新终端”一样 spawn 一个子 Agent，给它独立 messages[] 专心做一件事，做完只把结论写回笔记，主终端继续干活。

## 问题

Agent 修 bug 时读了 30 个文件、聊了 60 轮，messages 涨到 120 条，其中大量“追踪调用链”的中间过程与最终目标无关，导致上下文拥挤、越来越“健忘”。

## 解决方案

新增 `task` 工具：调用时 spawn 子 Agent，子 Agent 有全新的 `messages[]`，跑自己的循环，结束后只把摘要文本回传给主 Agent。

## 关键设计决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 上下文隔离 | 全新 `messages[]` | 子 Agent 中间过程不污染主 Agent |
| 只回传结论 | `extract_text(last_message)` | 不回传整个 messages 列表 |
| 禁止递归 | 子 Agent 无 task 工具 | 防止无限 spawn |
| 安全策略不跳过 | 子 Agent 工具调用也走 PreToolUse hook | 上下文隔离 ≠ 权限隔离 |

## 伪代码

```python
def spawn_subagent(description: str) -> str:
    sub_tools = [bash, read_file, write_file, edit_file, glob]  # 无 task
    messages = [{"role": "user", "content": description}]

    for _ in range(30):  # 安全限制
        response = client.messages.create(...)
        # ... 执行工具 ...

    return extract_text(messages[-1]["content"])
```

## 关联阅读

- [[90_Learn/Learn_Claude_Code_Course]] — 完整 20 课映射
- [[references/learn-claude-code]] — 仓库引用索引
- [[13_Agent_Production/Learn_Claude_Code_L15_Agent_Teams]] — 队友（长期协作 Agent）
- [[13_Agent_Production/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive]] — 多 Agent 框架对比
