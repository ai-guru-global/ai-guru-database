---
title: '编程 (AI Coding)'
category: '16-ai-coding'
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: '> AI编程已从"代码补全"进化为"结对编程伙伴"——本目录构建涵盖理论、工具、实战、方法论的完整知识体系。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
sources: []

name_zh: "编程"
---
# 编程 (AI Coding)

> 中文简称：编程

> AI 编程已从"代码补全"进化为"结对编程伙伴"——本目录构建涵盖理论、工具、实战、方法论的完整知识体系。

---

## 文档导航

### 理论 — 底层原理与架构

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [01_AI_编程_理论.md](./02_理论基础/01_AI_编程_理论.md) | 编程范式演进、LLM与代码生成、Agentic Coding架构原理、能力边界 | 想理解"为什么"的开发者 |

### 工具 — IDE/CLI/平台选型

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [01_AI_编程_Assistants_2026.md](./05_开发工具/01_AI_编程_Assistants_2026.md) | Cursor/Claude Code/Hermes/Windsurf/Copilot/Devin 全景对比、选型决策树 | 工具选型决策 |
| [14_Hermes_Agent_2026.md](./05_开发工具/14_Hermes_Agent_2026.md) | Hermes Agent 深度指南：17+ Provider、6种终端后端、7大消息平台 | 深度了解 Hermes |

### 实战 — Prompt模板与案例

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [06_Vibe_Coding_快速入门.md](./04_实践指南/06_Vibe_Coding_快速入门.md) | 5分钟入门、4步安全法、实战练习 | 完全新手 |
| [07_Vibe_Coding_Prompt_模板.md](./04_实践指南/07_Vibe_Coding_Prompt_模板.md) | STAR框架、8大场景提示模板、规则文件模板、反面教材 | 日常编码参考 |
| [08_Vibe_Coding_实战_案例.md](./04_实践指南/08_Vibe_Coding_实战_案例.md) | 4大场景实战方案 + 3个真实团队案例 | 寻找落地参考 |

### 方法论 — 工作流与最佳实践

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [03_Vibe_Coding_方法论.md](./03_方法论/03_Vibe_Coding_方法论.md) | DGRV模型、五层能力模型、工作流模式、质量保障、团队协作 | 系统学习方法论 |
| [04_Vibe_Coding_生产_实践.md](./03_方法论/04_Vibe_Coding_生产_实践.md) | 安全工程、质量监控、技术债管理、组织变革、合规 | 生产环境落地 |
| [01_Agent编程_方法论.md](./03_方法论/01_Agent编程_方法论.md) | 多Agent协作架构、角色定义、环境沙箱、质量保障 | 进阶 |
| [AI 代码安全审计 Runbook](./09_安全编码/02_AI_Code_安全_审计_操作手册.md) | AI 生成代码漏洞、SAST/SCA/Secret Scan、AI 代码审查、CI/CD 集成 | 安全工程师、AI 开发者 |

---

## 快速选路

```
我想做什么？ → 看哪个文档
═══════════════════════════════════════════════════════════════

"刚听说AI编程，想快速上手"
  → [入门指南](./04_实践指南/06_Vibe_Coding_快速入门.md)

"选哪个AI编程工具？"
  → [工具对比](./05_开发工具/01_AI_编程_Assistants_2026.md)

"怎么写好Prompt让AI生成更好的代码？"
  → [提示词模板库](./04_实践指南/07_Vibe_Coding_Prompt_模板.md)

"想知道AI编程背后的原理和限制"
  → [理论基础](./02_理论基础/01_AI_编程_理论.md)

"如何在团队/生产环境中系统化使用AI编程？"
  → [方法论](./03_方法论/03_Vibe_Coding_方法论.md)
  → [生产实践](./03_方法论/04_Vibe_Coding_生产_实践.md)

"看看别人怎么做的，有没有真实案例？"
  → [实战案例集](./04_实践指南/08_Vibe_Coding_实战_案例.md)

"对多Agent协作开发感兴趣"
  → [Agentic Coding 方法论](./03_方法论/01_Agent编程_方法论.md)
  → [理论基础 §3](./02_理论基础/01_AI_编程_理论.md#3-agentic-coding-架构原理)

"想深入了解Hermes Agent"
  → [Hermes Agent 深度指南](./05_开发工具/14_Hermes_Agent_2026.md)
```

---

## 2026年工具速览

| 排名 | 工具 | 最适合 | 价格 | 评分 |
|------|------|--------|------|------|
| 1 | Cursor | 全能IDE | $20/月 | 9.2/10 |
| 2 | Claude Code | 终端代理 | $20/月 | 9.0/10 |
| 3 | Hermes Agent | 全平台开源 | 免费(自带API) | 8.8/10 |
| 4 | Windsurf | 性价比 | $15/月 | 8.5/10 |
| 5 | Copilot | 企业 | $10/月 | 8.3/10 |

> 详见 [AI编程助手全景报告](./05_开发工具/01_AI_编程_Assistants_2026.md)

---

## 一句话总结

> **AI 编程已从"补全"进化为"结对编程伙伴"** — Cursor 以 72% 代码接受率领跑，Hermes Agent 以全平台开源和 17+模型支持成为最大变量，Agentic Coding 成为 2026 年主流。

## Related
- [[16_编程/04_实践指南/07_Vibe_Coding_Prompt_模板|Vibe Coding 提示词模板库]]
- [[16_编程/04_实践指南/Vibe_Coding_Getting_Started|Vibe Coding 傻瓜指南 (Vibe Coding for Dummies)]]
- [[16_编程/04_实践指南/Vibe_Coding_Real_World_Cases|Vibe Coding 实战案例集]]
- [[16_编程/08_OpenRouter_路由服务/12_12_openrouter_enterprise_advanced|16_编程/08_OpenRouter_路由服务/12-openrouter-enterprise-advanced]]
- [[16_编程/05_开发工具/14_Hermes_Agent_2026|Hermes Agent 2026 年专业指南]]
- [[16_编程/05_开发工具/24_Qoder_指南|Qoder / QoderWork / QoderWake 使用指南]]
- [[16_编程/05_开发工具/DeepSeek_Guide|DeepSeek 使用指南]]
- [[16_编程/05_开发工具/22_Monica_指南|Monica 使用指南]]
- [[16_编程/01_编程基础/01_AI编程2026指南|AI 编程 - 速查版]]
- [[16_编程/README|AI 编程 (AI Coding)]]
- [[16_编程/06_工具对比/04_MOC_OpenRouter_OpenCode|topic-ai-coding MOC]]
- [[16_编程/README|17 AI 编程 — 小白版 💻]]

- [[概念/ai-agents]] — AI 智能体
- [[概念/prompt-engineering]] — 提示工程
- [[16_编程/03_方法论/04_Vibe_Coding_生产_实践]] — Vibe_Coding_Production_Practices
- [[16_编程/03_方法论/Agentic_Coding_Methodology]] — Agentic_Coding_Methodology
- [[16_编程/03_方法论/Vibe_Coding_Methodology]] — Vibe_Coding_Methodology
- [[16_编程/05_开发工具/20_MiMO_指南]] — MiMO 使用指南
- [[16_编程/05_开发工具/17_Kilo_指南]] — Kilo / KiloClaw 使用指南
- [[16_编程/05_开发工具/13_Grok_指南]] — Grok / Grok Code 使用指南
- [[16_编程/05_开发工具/18_Kimi_指南]] — Kimi Code / Kimi Chat 使用指南
- [[16_编程/05_开发工具/01_AI_编程_Assistants_2026]] — AI_Coding_Assistants_2026
- [[16_编程/05_开发工具/26_Trae_指南]] — Trae 使用指南
- [[16_编程/05_开发工具/21_MiniMax_指南]] — MiniMax / MiniClaw 使用指南
- [[16_编程/05_开发工具/19_Manus_指南]] — Manus 使用指南
- [[16_编程/05_开发工具/12_GLM_指南]] — GLM 使用指南
- [[16_编程/05_开发工具/25_Qwen_指南]] — Qwen (通义千问) 使用指南
- [[16_编程/05_开发工具/08_Cursor_指南]] — Cursor 使用指南
- [[16_编程/05_开发工具/06_Comate_指南]] — Comate 使用指南
- [[16_编程/05_开发工具/15_Ima_指南]] — Ima 使用指南
- [[16_编程/05_开发工具/07_Coze_指南]] — Coze 使用指南
- [[16_编程/05_开发工具/23_Pending_工具_Catalog]] — 待探索工具目录

- [[Claude_Enterprise_Use_Cases|Claude 企业实践案例]]
- [[16_编程/02_理论基础/03_Claude_成本优化|Claude 成本优化与性能调优]]
- [[16_编程/05_开发工具/05_codex_openai_概览|OpenAI Codex 概览]]
- [[16_编程/05_开发工具/11_github_copilot_概览|GitHub Copilot 概览]]

## 新增页面

- [[16_编程/01_编程基础/01_AI编程2026指南|AI 编程 2026 全景指南]]
