---
title: "Learn Claude Code L17：Autonomous Agents — 自己看板，自己认领"
category: 13-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - autonomous-agents
  - multi-agent
  - task-system
sources:
  - "_raw/github-sources/learn-claude-code/s17_autonomous_agents/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第十七课：队友完成当前任务后不退出，进入 idle_poll 阶段轮询收件箱和任务看板，自动认领可执行的任务。"
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

# Learn Claude Code L17：Autonomous Agents — 自己看板，自己认领

> **一句话理解**: 队友应该自己看任务看板，发现没人做的任务就认领，做完再找下一个——不需要 Lead 手动分配。

## 问题

s16 的队友能通信、能握手关机，但每个任务都等 Lead 分配。如果看板上有 10 个未认领任务，Lead 要手动 assign 10 次，无法扩展。

## 解决方案

沿用 MessageBus 和协议工具，新增：
- **idle_poll**：空闲时每 5 秒轮询一次
- **scan_unclaimed_tasks**：扫描看板上可认领的任务
- **自动认领**：找到任务就 claim

## 队友生命周期

| 阶段 | 行为 | 退出条件 |
|------|------|---------|
| WORK | inbox → LLM → 工具循环 | `stop_reason != tool_use` |
| IDLE | 每 5s 轮询 inbox + 任务板 | 60s 超时或收到 shutdown |
| SHUTDOWN | 发 summary，退出 | — |

## 扫描可认领任务

```python
def scan_unclaimed_tasks():
    unclaimed = []
    for f in sorted(TASKS_DIR.glob("task_*.json")):
        task = json.loads(f.read_text())
        if (task.get("status") == "pending"
                and not task.get("owner")
                and can_start(task["id"])):
            unclaimed.append(task)
    return unclaimed
```

三个条件：pending、无 owner、所有 `blockedBy` 依赖已完成。

## 设计要点

- 教学版没有文件锁，并发认领可能出现竞争；至少 `task.owner` 检查避免了后写覆盖 ^[extracted]
- 真实 Claude Code 用 `proper-lockfile` 保护任务文件，`claimTask` 在文件锁内完成读-改-写 ^[inferred]
- inbox 优先于任务板，因为可能包含 `shutdown_request` 等协议消息

## 关联阅读

- [[90_Learn/Courses/Learn_Claude_Code_Course]] — 完整 20 课映射
- [[references/learn-claude-code]] — 仓库引用索引
- [[13_Agent_Production/Learn_Claude_Code_L12_Task_System]] — 任务系统
- [[13_Agent_Production/Learn_Claude_Code_L15_Agent_Teams]] — Agent Teams
