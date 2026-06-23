---
title: "Learn Claude Code L03：Permission — 执行前做权限判断"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - permission
  - security
  - safety
sources:
  - "_raw/github-sources/learn-claude-code/s03_permission/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第三课：在工具执行前插入三道权限闸门——硬拒绝、规则匹配、用户审批——防止模型执行危险操作。"
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

# Learn Claude Code L03：Permission — 执行前做权限判断

> **一句话理解**: 安全不能靠信任模型，要靠代码——在工具执行前插入 `check_permission()`，三道闸门决定放行、拒绝还是问用户。

## 问题

Agent 有 bash 等强力工具。让它“清理一下项目”，理论上可能执行 `rm -rf /`。必须在做之前做权限判断。

## 三道闸门

| 闸门 | 作用 | 命中后 |
|------|------|--------|
| 1. 拒绝列表 | 永远禁止的操作（`rm -rf /`、`sudo`、`shutdown`） | 直接拒绝 |
| 2. 规则匹配 | 取决于上下文的操作（写工作区外、`rm` 文件） | 交给闸门 3 |
| 3. 用户审批 | 规则命中后暂停等用户确认 | 用户决定允许/拒绝 |

三道都没命中 → 直接执行。

## 关键代码模式

```python
def check_permission(block) -> bool:
    # 闸门 1: 硬拒绝
    if block.name == "bash":
        reason = check_deny_list(block.input.get("command", ""))
        if reason:
            return False

    # 闸门 2 + 3: 规则匹配 → 用户审批
    reason = check_rules(block.name, block.input)
    if reason:
        decision = ask_user(block.name, block.input, reason)
        if decision == "deny":
            return False

    return True
```

## 设计要点

- 教学版用简单字符串匹配演示，命令变体可能绕过 ^[extracted]
- 真实 Claude Code 有更复杂的权限同步机制（permissionSync.ts、useSwarmPermissionPoller.ts）^[inferred]
- 权限判断只改变“是否执行”，不改变 agent loop 本身

## 关联阅读

- [[90_Learn/courses/share_ai/learn_claude_code]] — 完整 20 课映射
- [[_references/learn-claude-code]] — 仓库引用索引
- [[15_Agent_Production/Enterprise_Agent/Agent_Production_2026]] — Agent 生产治理
- [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L01_Agent_Loop]] — L01 最小循环
