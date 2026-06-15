---
title: "Learn Claude Code L12：Task System — 目标太大，拆成小任务"
category: 13-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - task-system
  - planning
  - dag
sources:
  - "_raw/github-sources/learn-claude-code/s12_task_system/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第十二课：用文件持久化的任务图替代进程内 TodoWrite，任务之间有 blockedBy 依赖、可 claim/complete，为多 Agent 协作打基础。"
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

# Learn Claude Code L12：Task System — 目标太大，拆成小任务

> **一句话理解**: 把大目标拆成持久化在磁盘上的小任务，任务之间有依赖图，可以跨会话 claim、追踪、解锁，是多 Agent 协作的基础。

## 问题

Agent 接到的项目涉及数据库、API、测试多个步骤。用 s05 的 `TodoWrite` 列清单存在会话内存中，写到一半发现依赖没完成，且会话结束就丢失。

## TodoWrite vs Task System

| | TodoWrite (s05) | Task System (s12) |
|---|---|---|
| 定位 | 当前任务的执行清单 | 可恢复的任务系统 |
| 存储 | 进程内 / 会话状态 | `.tasks/{id}.json` |
| 依赖 | 无 | `blockedBy` 依赖图 |
| 生命周期 | 当前会话 | 跨会话保留 |
| 分工 | 不负责任务认领 | `owner` / claim |
| 粒度 | Agent 自己的步骤 | 可被认领、追踪、解锁的任务 |

## Task 数据结构

```python
@dataclass
class Task:
    id: str
    subject: str
    description: str
    status: str          # pending | in_progress | completed
    owner: str | None
    blockedBy: list[str] # 依赖任务 ID 列表
```

## 核心操作

- **create_task**: 创建任务，自动持久化到 `.tasks/{id}.json`
- **can_start**: 检查 `blockedBy` 全部 completed
- **claim_task**: 认领任务，状态 pending → in_progress，记录 owner
- **complete_task**: 完成任务，解锁下游任务

## 设计要点

- 教学版只演示 `blockedBy` 检查，没有实现环检测 ^[extracted]
- 任务系统与错误恢复是独立层，互不耦合 ^[extracted]
- 真实 Claude Code 中 `utils/tasks.ts` 只管 CRUD，`query.ts` 管错误恢复 ^[inferred]

## 关联阅读

- [[90_Learn/Courses/Learn_Claude_Code_Course]] — 完整 20 课映射
- [[references/learn-claude-code]] — 仓库引用索引
- [[13_Agent_Production/Learn_Claude_Code_L15_Agent_Teams]] — Agent Teams
- [[13_Agent_Production/Learn_Claude_Code_L17_Autonomous_Agents]] — 自治 Agent
