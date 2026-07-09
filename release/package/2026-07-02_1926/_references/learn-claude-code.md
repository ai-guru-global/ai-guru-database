---
title: "Learn Claude Code (shareAI-lab)"
category: -references
tags: ["course", "claude-code", "agent-harness", "github-repo", "external-source"]
sources:
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "shareAI-lab 的 Learn Claude Code 仓库索引：从零实现 Claude Code 式 Agent Harness 的 20 节渐进式教程，含本地克隆路径、License 与课程总览。"
created: "2026-06-12"
updated: "2026-06-12"
lifecycle: draft
tier: supporting
aliases:
  - "Learn Claude Code"
  - "learn claude code"

---
# Learn Claude Code (shareAI-lab)

> 外部源引用索引。完整课程映射与每课的概念链接见 **[[90_Learn/courses/share_ai/learn_claude_code]]**。

## 项目信息

| 属性 | 说明 |
|------|------|
| **GitHub 仓库** | [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) |
| **上游 URL** | https://github.com/shareAI-lab/learn-claude-code |
| **本地克隆路径** | `_raw/github-sources/learn-claude-code` |
| **License** | MIT |
| **语言** | 中文 README + 英文/日文翻译 |
| **结构** | 20 个渐进式章节 (`s01_agent_loop` ~ `s20_comprehensive`)，每章含 README、翻译、可运行 `code.py`、示意图 |

## 课程定位

作者核心观点：**Agent 的“能动性”来自模型训练**，工程人员的职责是构建 **Harness（运行环境）**：工具、知识、观察、动作接口、权限边界。Claude Code 的价值不在于“让模型变聪明”，而在于提供了一个不侵入模型决策的最小 harness：

```text
一个 agent loop
+ 工具（bash / read / write / edit / glob ...）
+ 按需技能加载
+ 上下文压缩
+ 子 Agent 派生
+ 任务系统与依赖图
+ 异步邮箱团队协调
+ worktree 隔离并行执行
+ 权限治理
+ 钩子扩展系统
+ 记忆持久化
+ MCP 外部能力路由
```

## 内容覆盖

| 模块 | 章节 |
|---|---|
| 核心循环与工具 | s01-s04 |
| 复杂任务处理 | s05-s08 |
| 记忆与恢复 | s09-s11 |
| 长期运行与调度 | s12-s14 |
| 多 Agent 协作 | s15-s18 |
| 外部能力与综合 | s19-s20 |

## 学习路线

主线：**行动 → 处理复杂工作 → 记忆与恢复 → 长期任务 → 协作 → 扩展与组装**。详见 [[90_Learn/courses/share_ai/learn_claude_code]] 的完整课表。

## 相关页面

- [[90_Learn/courses/share_ai/learn_claude_code]] — 完整 20 课映射与本库概念链接
- [[Agent/Agent_Harness/The_Anatomy_of_an_Agent_Harness]] — Harness 工程定义
- [[Agent/Agentic_Coding_Tools/Claude_Code_Deep_Dive]] — Claude Code 产品深度解析
- [[Agent/Agent_Harness/Agent_Harness_Architecture_2026]] — Agent Harness 架构 2026
