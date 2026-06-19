---
title: Agentic Coding 工具
category: 13-agent-production-agentic-coding-tools
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 从代码补全到完全自主执行，AI Agent 编程工具正在重塑软件开发的每个环节。"
created: 2026-05-31
updated: 2026-05-31
---

# Agentic Coding 工具

> 从代码补全到完全自主执行，AI Agent 编程工具正在重塑软件开发的每个环节。

---

## 概述

本目录收录 Agentic Coding 工具的深度解析与选型对比，覆盖 CLI Agent、IDE 集成、代码审查、自主执行等多种工具形态。

## 文档清单

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Agentic Coding Tools Overview](./Agentic_Coding_Tools_Overview.md) | AI Agent 全景图 (20+ 工具分层对比) | 全角色、入门选型 |
| [Claude Code Deep Dive](./Claude_Code_Deep_Dive.md) | Anthropic 官方 Agent 编程 CLI 深度解析 | 开发者、评估师 |
| [OpenCode Deep Dive](./OpenCode_Deep_Dive.md) | 自主执行式 AI 编程 Agent 架构与实践 | 开发者、评估师 |
| [Windsurf / Cursor / Devin](./Windsurf_Cursor_Devin_Dive.md) | Agentic Coding CLI 全景对比 | 开发者、产品经理 |
| [International Agentic Tools](./International_Agentic_Tools.md) | 国际工具 (Aider/Continue/CodeRabbit/Cody/Tabnine/Codeium) | 开发者、选型参考 |
| [Aider Deep Dive](./Aider_Deep_Dive.md) | 开源 CLI 代码编辑工具：Git 集成、多文件重构 | 开发者 |
| [Continue Deep Dive](./Continue_Deep_Dive.md) | 开源 VS Code/JetBrains 插件：多模型支持 | 开发者 |

## 工具能力光谱

```
代码补全             半自主执行           完全自主
─────────           ────────            ────────
Copilot             Cursor              Devin
Tabnine             Windsurf            SWE-agent
Codeium             Claude Code
                    OpenCode
```

## 关联目录

- [Agent Harness](../Agent_Harness/) -- Harness 工程与架构
- [Agent Frameworks](../Agent_Frameworks/) -- 多 Agent 开发框架
- [16_Agent_Evaluation](../16_Agent_Evaluation/) -- 工具评估基准 (SWE-bench 等)

---

*Last updated: 2026-04-14*

## Related
- [[15_Agent_Production/Agentic_Coding_Tools/README|Agentic Coding 工具]]

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)

