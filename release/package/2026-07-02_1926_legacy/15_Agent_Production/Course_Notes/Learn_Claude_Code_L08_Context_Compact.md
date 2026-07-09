---
title: "Learn Claude Code L08：Context Compact — 上下文总会满，要有办法腾地方"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - context-window
  - compression
  - memory
sources:
  - "_raw/github-sources/learn-claude-code/s08_context_compact/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第八课：四层压缩管线——snip（裁剪旧对话）、micro（旧工具结果占位）、budget（大结果落盘）、LLM 全量摘要——应对上下文窗口限制。"
provenance:
  extracted: 0.80
  inferred: 0.17
  ambiguous: 0.03
base_confidence: 0.72
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Learn Claude Code L08 Context Compact"
  - Learn_Claude_Code_L08_Context_Compact

---
# Learn Claude Code L08：Context Compact — 上下文总会满，要有办法腾地方

> **一句话理解**: 上下文窗口有限，四层压缩策略“便宜的先跑，贵的后跑”：先裁剪旧对话、再占位旧结果、再大结果落盘，最后才让 LLM 做全量摘要。

## 问题

Agent 读了大文件、跑了多轮命令后，`messages` 涨到超过上下文上限，API 返回 `prompt_too_long`，无法继续工作。

## 四层压缩管线

| 层级 | 名称 | 触发条件 | 成本 |
|------|------|----------|------|
| L1 | snip_compact | 消息数 > 50 | 0 API |
| L2 | micro_compact | 旧 tool_result 仍占空间 | 0 API |
| L3 | tool_result_budget | 单条 user 消息 > 200KB | 0 API |
| L4 | compact_history | 前三层后仍超限 | 1 API（LLM 摘要） |

## 各层要点

- **L1 snip_compact**：保留头部 3 条 + 尾部 47 条，中间用占位符替代；注意不能把 `assistant(tool_use)` 和对应的 `user(tool_result)` 拆开 ^[extracted]
- **L2 micro_compact**：只保留最近 3 条 tool_result 完整内容，更旧的替换为占位符 ^[extracted]
- **L3 tool_result_budget**：大 tool_result 落盘到 `.task_outputs/tool-results/`，上下文只留 `<persisted-output>` 标记 + 预览 ^[extracted]
- **L4 compact_history**：保存完整 transcript 到 `.transcripts/`，让 LLM 生成保留目标/发现/已改文件/剩余工作的摘要 ^[extracted]

## 设计原则

- 教学版只演示策略框架，真实 Claude Code 的压缩更复杂（保留 cache 边界、prompt cache 友好）^[inferred]
- 压缩是有损的，s09 的记忆系统用于保留不应丢失的细节

## 关联阅读

- [[90_Learn/courses/share_ai/learn_claude_code]] — 完整 20 课映射
- [[_references/learn-claude-code]] — 仓库引用索引
- [[Agent/Course_Notes/Learn_Claude_Code_L09_Memory_System]] — 记忆系统
- [[Agent/Memory_Infrastructure/Agent_Memory_Systems_2026]] — Agent 记忆系统 2026
