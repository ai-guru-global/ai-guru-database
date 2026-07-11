---
title: Learn Claude Code L19 - MCP Plugin
category: 15-agent-production
tags: [claude-code, mcp, plugin, course-notes]
summary: Claude Code 课程第 19 课笔记：MCP 外部工具发现、命名空间与动态工具池。
created: 2026-07-02
updated: 2026-07-02
sources: []
---

# Learn Claude Code L19 - MCP Plugin

> **一句话理解**: MCP Plugin 让 Claude Code 像浏览器插件一样动态发现并使用外部工具，核心是把工具调用规范化为 `mcp__server__tool` 命名空间。

---

## 核心要点

- **工具发现**: Agent 通过 MCP server 的 capability 声明发现可用工具
- **命名空间**: `mcp__server__tool` 避免工具名冲突
- **动态工具池**: 运行时按需注册/卸载，不必把所有工具 Prompt 都塞进上下文

## 安全注意事项

- 对 MCP server 进行权限隔离
- 验证工具输入参数，防止注入
- 记录工具调用日志用于审计

## Related

- [[学习/References/Articles/awesome-mcp-servers|Awesome MCP Servers]]
- [[智能体/Agent_Protocols/MCP_Implementation_Guide|MCP 实现指南]]
- [[智能体/Course_Notes/Learn_Claude_Code_L17_Autonomous_Agents|L17 Autonomous Agents]]

---
*Last updated: 2026-07-02*
