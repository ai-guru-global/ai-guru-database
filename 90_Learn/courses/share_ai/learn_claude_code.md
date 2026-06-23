---
title: "Learn Claude Code 课程映射：20 课 Harness 工程"
category: 90-learn-courses-share-ai
tags: ["learning-paths", "claude-code", "agent-harness", "course-catalog", "ai-agents"]
sources:
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "shareAI-lab Learn Claude Code 20 课完整映射，列出每课引入的 Harness 机制并链接到本库已有概念页，配合 _references/learn-claude-code 使用。"
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.54
lifecycle: draft
tier: supporting
created: "2026-06-12"
updated: "2026-06-12"
---

# Learn Claude Code 课程映射：20 课 Harness 工程

> **一句话理解**: [Learn Claude Code](https://github.com/shareAI-lab/learn-claude-code) 是一套从零实现 Claude Code 式 Agent Harness 的 20 节渐进式教程。它主张“能动性来自模型，工程人员负责 Harness”，每章在不变的 `while True` 循环上叠加一个机制。本页将课程完整课表映射到 `ai-guru-database` 的对应章节。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **GitHub 仓库** | [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) |
| **本地克隆** | `_raw/github-sources/learn-claude-code` |
| **课时数量** | 20 课 + 综合章 |
| **前置要求** | Python 基础、Anthropic API key；建议先了解 [[15_Agent_Production/GenAI_L17_AI_Agents|AI 代理基础]] |
| **外部引用** | [[_references/learn-claude-code]] |

---

## 完整课表与概念映射

### 第一阶段：核心循环与工具（s01-s04）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s01 | Agent Loop | 最小 `while True` 循环；`stop_reason == "tool_use"` 决定是否继续 | [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L01_Agent_Loop|L01 笔记]], [[15_Agent_Production/GenAI_L17_AI_Agents|AI 代理]], [[15_Agent_Production/Agent_Harness/The_Anatomy_of_an_Agent_Harness|Harness 解剖]] |
| s02 | Tool Use | 工具定义 + `TOOL_HANDLERS` 分发映射；多工具并发安全 | [[15_Agent_Production/GenAI_L11_Integrating_with_Function_Calling|函数调用]], [[15_Agent_Production/Agent_Skills/Tool_Calling_Best_Practices|工具调用最佳实践]] |
| s03 | Permission | 三道权限闸门：硬拒绝、规则匹配、用户审批 | [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L03_Permission_System|L03 笔记]], [[15_Agent_Production/Enterprise_Agent/Agent_Production_2026|Agent 生产治理]] |
| s04 | Hooks | 循环扩展点：`UserPromptSubmit` / `PreToolUse` / `PostToolUse` / `Stop` | [[15_Agent_Production/Agent_Harness/Agent_Harness_Architecture_2026|Harness 架构]] |

### 第二阶段：复杂任务处理（s05-s08）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s05 | TodoWrite | `todo_write` 计划工具 + nag reminder，先列清单再执行 | [[15_Agent_Production/Agent_Workflow/Workflow-in-nutshell|工作流概述]], [[15_Agent_Production/Agentic_Design_Patterns_AndrewNg|代理设计模式]] |
| s06 | Subagent | 子 Agent：独立 `messages[]`、只回传结论、禁止递归 | [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L06_Subagent|L06 笔记]] |
| s07 | Skill Loading | 技能两级加载：SYSTEM 放目录，`load_skill` 按需注入完整内容 | [[15_Agent_Production/Learn_Claude_Code_L07_Skill_Loading|L07 笔记]], [[15_Agent_Production/Agent_Skills/Skills-in-nutshell|Agent Skills 速览]] |
| s08 | Context Compact | 四层压缩管线：snip / micro / budget / LLM 摘要 + reactive 应急 | [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L08_Context_Compact|L08 笔记]] |

### 第三阶段：记忆与恢复（s09-s11）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s09 | Memory | 跨会话记忆：`.memory/` Markdown 文件 + `MEMORY.md` 索引 + 每轮提取/整理 | [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L09_Memory_System|L09 笔记]], [[15_Agent_Production/Memory_Infrastructure/Agent_Memory_Systems_2026|Agent 记忆系统 2026]] |
| s10 | System Prompt | system prompt 分段定义、按真实状态运行时组装、缓存 | [[15_Agent_Production/Agent_Harness/Agent_Harness_Architecture_2026|Harness 架构]], [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering|提示工程]] |
| s11 | Error Recovery | 错误恢复：输出截断升级、上下文超限 reactive compact、429/529 指数退避与 fallback 模型 | [[15_Agent_Production/Agent_Harness/Harness-in-nutshell|Harness 速览]] |

### 第四阶段：长期运行与调度（s12-s14）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s12 | Task System | 文件持久化任务图：`blockedBy` 依赖、`claim` / `complete` 状态机 | [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L12_Task_System|L12 笔记]] |
| s13 | Background Tasks | 慢操作后台线程 + `<task_notification>` 注入，主循环不阻塞 | [[15_Agent_Production/Agent_Harness/Agent_Harness_Architecture_2026|Harness 架构]] |
| s14 | Cron Scheduler | 独立调度线程 + `cron_queue` + queue processor，支持 durable / session-only 任务 | [[15_Agent_Production/Agent_Harness/Harness-in-nutshell|Harness 速览]], [[11_MLOps_Pipeline/CI_CD/ML_CI_CD|ML CI/CD]] |

### 第五阶段：多 Agent 协作（s15-s18）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s15 | Agent Teams | `MessageBus` 文件收件箱；Lead + 持久队友线程并行工作 | [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L15_Agent_Teams|L15 笔记]], [[15_Agent_Production/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive|多 Agent 框架对比]] |
| s16 | Team Protocols | 结构化请求-响应协议：`request_id` 关联、`shutdown` / `plan_approval` 握手 | [[15_Agent_Production/Agent_Protocols/A2A_Protocol_Deep_Dive|A2A 协议]] |
| s17 | Autonomous Agents | 队友自组织：`idle_poll` 轮询收件箱 + 任务板自动认领 | [[15_Agent_Production/Course_Notes/Learn_Claude_Code/Learn_Claude_Code_L17_Autonomous_Agents|L17 笔记]], [[15_Agent_Production/Agentic_Design_Patterns_AndrewNg|代理设计模式]] |
| s18 | Worktree Isolation | 任务绑定 git worktree，队友在独立目录并行执行 | [[15_Agent_Production/Agentic_Coding_Tools/Claude_Code_Deep_Dive|Claude Code 深度解析]] |

### 第六阶段：外部能力与综合（s19-s20）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s19 | MCP Plugin | MCP 外部工具发现与调用：`mcp__server__tool` 命名空间、动态工具池 | [[15_Agent_Production/Learn_Claude_Code_L19_MCP_Plugin|L19 笔记]], [[_references/awesome-mcp-servers|Awesome MCP Servers]] |
| s20 | Comprehensive Agent | 把 s01-s19 的机制挂回同一个循环，展示完整 harness 数据流 | [[_references/learn-claude-code|仓库引用]], [[15_Agent_Production/Agent_Harness/The_Anatomy_of_an_Agent_Harness|Harness 解剖]] |

---

## 学习建议

1. **先通读 s01-s04**：理解“循环不变、机制外挂”的设计哲学，再看后续章节会更清晰。
2. **重点突破 s08、s09、s12**：上下文压缩、记忆、任务图是长期运行 Agent 的三大支柱。
3. **多 Agent 部分按顺序读**：s15（团队邮箱）→ s16（协议）→ s17（自治）→ s18（隔离），每层解决一个真实协作问题。
4. **配合本库阅读**：遇到通用概念（如 [[15_Agent_Production/Agent_Harness/The_Anatomy_of_an_Agent_Harness|Harness 解剖]]、[[15_Agent_Production/Memory_Infrastructure/Agent_Memory_Systems_2026|记忆系统 2026]]）可跳转加深理解。

---

## 相关页面

- [[_references/learn-claude-code]] — 仓库外部源引用索引
- [[15_Agent_Production/Agent_Harness/The_Anatomy_of_an_Agent_Harness]] — Harness 工程定义
- [[15_Agent_Production/Agentic_Coding_Tools/Claude_Code_Deep_Dive]] — Claude Code 产品解析
- [[90_Learn/guides/ai_engineering_roadmap_2026]] — AI 工程师学习路线
- [[90_Learn/guides/learning_paths_2026]] — 本库 6 条学习路径总览
