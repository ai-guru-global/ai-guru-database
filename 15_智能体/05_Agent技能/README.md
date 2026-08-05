---
title: Agent Skills 文档索引
category: 15-agent-production-agent-skills
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 本文件夹收录 Agent Skills 开放标准的完整知识体系，覆盖从入门到生产、从个人到团队的全部场景。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

name_zh: "Agent Skills 文档索引"
---
# Agent Skills 文档索引

> 中文简称：Agent Skills 文档索引

> 本文件夹收录 Agent Skills 开放标准的完整知识体系，覆盖从入门到生产、从个人到团队的全部场景。

---

## 📖 阅读路径

### 路径一：快速入门（30 分钟）

适合第一次接触 Agent Skills、想马上动手写一个 Skill 的读者。

```
12_技能_简明指南.md → 按 5 分钟 Quickstart 写第一个 Skill
```

### 路径二：系统学习（2-3 小时）

适合需要全面理解 Agent Skills 标准、掌握最佳实践的开发者。

```
12_技能_简明指南.md（速览）
  → 02_Agent_技能_深入分析.md（完整规范与理论）
  → 05_Agent技能_Practical_Guide.md（实战案例与操作）
```

### 路径三：团队落地（1-2 天）

适合需要组织团队采用 Agent Skills、建立评估和治理流程的 Leader。

```
04_Agent_技能_Multi_Role_分析.md（五角色协作框架）
  → 11_技能_版本管理_指南.md（团队 Skill 库治理）
  → 03_Agent_技能_生态_Catalog.md（现有 Skill 选型）
```

### 路径四：找现成 Skill（5 分钟）

适合不想自己写、想快速找到已有 Skill 的用户。

```
03_Agent_技能_生态_Catalog.md → 按领域或团队查找
```

---

## 📚 文档清单

| 文档 | 定位 | 适合读者 | 预估阅读时间 |
|------|------|---------|-------------|
| **[12_技能_简明指南.md](15_智能体/05_Agent技能/12_技能_简明指南.md)** | 速览版 / 书写速查手册 | 所有写 Skill 的人 | 30 分钟 |
| **[05_Agent技能_Practical_Guide.md](15_智能体/05_Agent技能/05_Agent技能_Practical_Guide.md)** | 实战操作手册 | 需要案例和步骤的开发者 | 1 小时 |
| **[02_Agent_技能_深入分析.md](15_智能体/05_Agent技能/02_Agent_技能_深入分析.md)** | 理论规范大全 | 需要全面掌握标准的人 | 2-3 小时 |
| **[04_Agent_技能_Multi_Role_分析.md](15_智能体/05_Agent技能/04_Agent_技能_Multi_Role_分析.md)** | 团队协作视角 | 团队 Lead、架构师、PM | 1-2 小时 |
| **[03_Agent_技能_生态_Catalog.md](15_智能体/05_Agent技能/03_Agent_技能_生态_Catalog.md)** | 生态选型索引 | 需要找现成 Skill 的人 | 20 分钟 |
| **[11_技能_版本管理_指南.md](15_智能体/05_Agent技能/11_技能_版本管理_指南.md)** | 团队治理指南 | 组织级 Skill 库管理者 | 30 分钟 |
| **[13_Spring_AI_技能_集成.md](15_智能体/05_Agent技能/13_Spring_AI_技能_集成.md)** | Spring AI 集成 | Java + Spring AI 开发者 | 15 分钟 |

---

## 🎯 核心概念一句话

> **Agent Skills = 一个包含 `SKILL.md` 的文件夹**，用 Markdown 告诉 AI Agent 什么场景下该做什么、怎么做。

由 Anthropic 开发并作为开放标准发布，已被 **30+** 主流 Agent 产品采纳（Claude Code、Copilot、Cursor、Codex、Gemini CLI 等）。

---

## 📊 生态数据（2026-04）

| 指标 | 数值 |
|------|------|
| 总 Skills 数量 | 451+ |
| 官方 Skills | 307 |
| 社区 Skills | 144 |
| 开发团队 | 38 家 |
| 兼容 Agent 产品 | 30+ |
| 最大仓库 Stars | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (24.9k⭐) |
| 精选合集 Stars | [VoltAgent/awesome-agent-skills](https://github.com/Volt智能体/awesome-agent-skills) (15.1k⭐, 1060+ Skills) |

---

## 🔗 外部资源

- [官方文档](https://agentskills.io) — Agent Skills 标准文档站
- [官方目录](https://officialskills.sh) — 451+ Skills 在线浏览
- [精选合集](https://github.com/Volt智能体/awesome-agent-skills) — GitHub 精选列表
- [Vercel Skills](https://github.com/vercel-labs/agent-skills) — React/Next.js 最佳实践

---

## 🗂️ 文件夹结构

```
15_智能体/05_Agent技能/
├── README.md                           ← 本文件
├── 12_技能_简明指南.md               ← 速览版 / 书写速查
├── 02_Agent_技能_深入分析.md           ← 完整规范、核心机制、最佳实践
├── 05_Agent技能_Practical_Guide.md     ← 实战案例、操作步骤、调试排错
├── 04_Agent_技能_Multi_Role_分析.md ← 五角色协作、产品路线图、安全模型
├── 03_Agent_技能_生态_Catalog.md   ← 451+ Skills 生态索引
├── 11_技能_版本管理_指南.md           ← 团队治理、版本管理、CI/CD 集成
└── 13_Spring_AI_技能_集成.md     ← Spring AI 框架集成说明
```

---

> 📅 **最后更新**：2026-05-07

## Related
- [[15_智能体/05_Agent技能/Agent_Skills_Multi_Role_Analysis|Agent Skills 多角色全景分析]]
- [[15_智能体/05_Agent技能/README|Agent Skills 文档索引]]
- [[15_智能体/05_Agent技能/Skill_Versioning_Guide|Skill 版本管理与团队治理]]
- [[15_智能体/05_Agent技能/Skills-in-nutshell|Agent Skills 书写速览]]
- [[15_智能体/05_Agent技能/03_Agent_技能_生态_Catalog|Agent Skills 生态目录]]
- [[15_智能体/05_Agent技能/02_Agent_技能_深入分析|Agent Skills 深度解析]]
- [[15_智能体/05_Agent技能/Spring_AI_Skills_Integration|Spring AI 与 Agent Skills 集成]]
- [[15_智能体/05_Agent技能/Agent_Skills_Practical_Guide|Agent Skills 实战指南]]

- [[15_智能体/07_Agent评估/05_Agent_脚手架_完整_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent评估/08_Agent_红队测试_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent评估/Assessment/03_评估_工作流]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent评估/Assessment/01_生产_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)


- [[15_智能体/README|Agent 生产部署 (Agent Production)]]

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*
