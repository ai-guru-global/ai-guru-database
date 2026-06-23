---
title: "Learn Claude Code L15：Agent Teams — 一个搞不定，组队来"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - multi-agent
  - agent-teams
  - message-bus
sources:
  - "_raw/github-sources/learn-claude-code/s15_agent_teams/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第十五课：用 MessageBus 文件收件箱 + 队友线程实现多 Agent 协作，一个 Lead Agent 带多个持久队友并行工作。"
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

# Learn Claude Code L15：Agent Teams — 一个搞不定，组队来

> **一句话理解**: 大项目超出单个 Agent 的上下文覆盖范围时，用文件收件箱（MessageBus）+ 队友线程实现 Lead 与多个持久队友的协作。

## 问题

"重构整个后端"涉及认证、数据库、API、测试。单个 Agent 在修 API 路由时，认证模块细节已不在上下文中，注意力覆盖不了所有模块。

## 子 Agent vs 队友

| | s06 子 Agent | s15 队友 |
|---|---|---|
| 生命周期 | 一次性，用完销毁 | 多轮（教学版限 10 轮） |
| 通信 | 只回传结论 | 异步收件箱，随时通信 |
| 上下文 | 完全隔离 | 通过消息共享信息 |
| 数量 | 一个主 Agent + 偶尔子 Agent | 一个 Lead + 多个队友 |

## MessageBus：文件收件箱

```python
class MessageBus:
    def send(self, from_agent, to_agent, content, msg_type="message"):
        msg = {"from": from_agent, "to": to_agent,
               "content": content, "type": msg_type, "ts": time.time()}
        with open(MAILBOX_DIR / f"{to_agent}.jsonl", "a") as f:
            f.write(json.dumps(msg) + "\n")

    def read_inbox(self, agent):
        msgs = [json.loads(line) for line in inbox.read_text().splitlines()]
        inbox.unlink()  # 消费式
        return msgs
```

- 用文件是因为直观、跨线程可观察；真实 CC 用 `~/.claude/teams/{team}/inboxes/` 并加 `proper-lockfile` 防并发写冲突 ^[inferred]
- 教学版 `read_inbox` 有 read + unlink 竞态，多线程可能丢消息

## Lead 的 inbox 注入

Lead 每轮主循环结束后检查收件箱，队友消息注入 history，让 LLM 能看到并反应：

```python
inbox = BUS.read_inbox("lead")
if inbox:
    history.append({"role": "user", "content": f"[Inbox]\n{inbox_text}"})
```

## 关联阅读

- [[90_Learn/courses/share_ai/learn_claude_code]] — 完整 20 课映射
- [[_references/learn-claude-code]] — 仓库引用索引
- [[15_Agent_Production/Learn_Claude_Code_L06_Subagent]] — 子 Agent
- [[15_Agent_Production/Learn_Claude_Code_L17_Autonomous_Agents]] — 自治 Agent
- [[15_Agent_Production/Agent_Protocols/A2A_Protocol_Deep_Dive]] — A2A 协议
