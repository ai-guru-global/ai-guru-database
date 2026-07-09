---
title: Agent Skills 文档索引
category: 15-agent-production-agent-skills
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 本文件夹收录 Agent Skills 开放标准的完整知识体系，覆盖从入门到生产、从个人到团队的全部场景。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

---
# Agent Skills 文档索引

> 本文件夹收录 Agent Skills 开放标准的完整知识体系，覆盖从入门到生产、从个人到团队的全部场景。

---

## 📖 阅读路径

### 路径一：快速入门（30 分钟）

适合第一次接触 Agent Skills、想马上动手写一个 Skill 的读者。

```
Skills-in-nutshell.md → 按 5 分钟 Quickstart 写第一个 Skill
```

### 路径二：系统学习（2-3 小时）

适合需要全面理解 Agent Skills 标准、掌握最佳实践的开发者。

```
Skills-in-nutshell.md（速览）
  → Agent_Skills_Deep_Dive.md（完整规范与理论）
  → Agent_Skills_Practical_Guide.md（实战案例与操作）
```

### 路径三：团队落地（1-2 天）

适合需要组织团队采用 Agent Skills、建立评估和治理流程的 Leader。

```
Agent_Skills_Multi_Role_Analysis.md（五角色协作框架）
  → Skill_Versioning_Guide.md（团队 Skill 库治理）
  → Agent_Skills_Ecosystem_Catalog.md（现有 Skill 选型）
```

### 路径四：找现成 Skill（5 分钟）

适合不想自己写、想快速找到已有 Skill 的用户。

```
Agent_Skills_Ecosystem_Catalog.md → 按领域或团队查找
```

---

## 📚 文档清单

| 文档 | 定位 | 适合读者 | 预估阅读时间 |
|------|------|---------|-------------|
| **[Skills-in-nutshell.md](15_Agent_Production/Agent_Skills/Skills-in-nutshell.md)** | 速览版 / 书写速查手册 | 所有写 Skill 的人 | 30 分钟 |
| **[Agent_Skills_Practical_Guide.md](15_Agent_Production/Agent_Skills/Agent_Skills_Practical_Guide.md)** | 实战操作手册 | 需要案例和步骤的开发者 | 1 小时 |
| **[Agent_Skills_Deep_Dive.md](15_Agent_Production/Agent_Skills/Agent_Skills_Deep_Dive.md)** | 理论规范大全 | 需要全面掌握标准的人 | 2-3 小时 |
| **[Agent_Skills_Multi_Role_Analysis.md](15_Agent_Production/Agent_Skills/Agent_Skills_Multi_Role_Analysis.md)** | 团队协作视角 | 团队 Lead、架构师、PM | 1-2 小时 |
| **[Agent_Skills_Ecosystem_Catalog.md](15_Agent_Production/Agent_Skills/Agent_Skills_Ecosystem_Catalog.md)** | 生态选型索引 | 需要找现成 Skill 的人 | 20 分钟 |
| **[Skill_Versioning_Guide.md](15_Agent_Production/Agent_Skills/Skill_Versioning_Guide.md)** | 团队治理指南 | 组织级 Skill 库管理者 | 30 分钟 |
| **[Spring_AI_Skills_Integration.md](15_Agent_Production/Agent_Skills/Spring_AI_Skills_Integration.md)** | Spring AI 集成 | Java + Spring AI 开发者 | 15 分钟 |

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
| 精选合集 Stars | [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) (15.1k⭐, 1060+ Skills) |

---

## 🔗 外部资源

- [官方文档](https://agentskills.io) — Agent Skills 标准文档站
- [官方目录](https://officialskills.sh) — 451+ Skills 在线浏览
- [精选合集](https://github.com/VoltAgent/awesome-agent-skills) — GitHub 精选列表
- [Vercel Skills](https://github.com/vercel-labs/agent-skills) — React/Next.js 最佳实践

---

## 🗂️ 文件夹结构

```
15_Agent_Production/Agent_Skills/
├── README.md                           ← 本文件
├── Skills-in-nutshell.md               ← 速览版 / 书写速查
├── Agent_Skills_Deep_Dive.md           ← 完整规范、核心机制、最佳实践
├── Agent_Skills_Practical_Guide.md     ← 实战案例、操作步骤、调试排错
├── Agent_Skills_Multi_Role_Analysis.md ← 五角色协作、产品路线图、安全模型
├── Agent_Skills_Ecosystem_Catalog.md   ← 451+ Skills 生态索引
├── Skill_Versioning_Guide.md           ← 团队治理、版本管理、CI/CD 集成
└── Spring_AI_Skills_Integration.md     ← Spring AI 框架集成说明
```

---

> 📅 **最后更新**：2026-05-07

## Related
- [[15_Agent_Production/Agent_Skills/Agent_Skills_Multi_Role_Analysis|Agent Skills 多角色全景分析]]
- [[15_Agent_Production/Agent_Skills/README|Agent Skills 文档索引]]
- [[15_Agent_Production/Agent_Skills/Skill_Versioning_Guide|Skill 版本管理与团队治理]]
- [[15_Agent_Production/Agent_Skills/Skills-in-nutshell|Agent Skills 书写速览]]
- [[15_Agent_Production/Agent_Skills/Agent_Skills_Ecosystem_Catalog|Agent Skills 生态目录]]
- [[15_Agent_Production/Agent_Skills/Agent_Skills_Deep_Dive|Agent Skills 深度解析]]
- [[15_Agent_Production/Agent_Skills/Spring_AI_Skills_Integration|Spring AI 与 Agent Skills 集成]]
- [[15_Agent_Production/Agent_Skills/Agent_Skills_Practical_Guide|Agent Skills 实战指南]]

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)


- [[15_Agent_Production/README|Agent 生产部署 (Agent Production)]]
