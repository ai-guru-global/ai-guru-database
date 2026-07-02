---
title: 'AI编程 (AI Coding)'
category: '16-ai-coding'
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: '> AI编程已从"代码补全"进化为"结对编程伙伴"——本目录构建涵盖理论、工具、实战、方法论的完整知识体系。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
sources: []

---
# AI 编程 (AI Coding)

> AI 编程已从"代码补全"进化为"结对编程伙伴"——本目录构建涵盖理论、工具、实战、方法论的完整知识体系。

---

## 文档导航

### 理论 — 底层原理与架构

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI_Coding_Theory.md](./Theory/AI_Coding_Theory.md) | 编程范式演进、LLM与代码生成、Agentic Coding架构原理、能力边界 | 想理解"为什么"的开发者 |

### 工具 — IDE/CLI/平台选型

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI_Coding_Assistants_2026.md](./Tools/AI_Coding_Assistants_2026.md) | Cursor/Claude Code/Hermes/Windsurf/Copilot/Devin 全景对比、选型决策树 | 工具选型决策 |
| [Hermes_Agent_2026.md](./Tools/Hermes_Agent_2026.md) | Hermes Agent 深度指南：17+ Provider、6种终端后端、7大消息平台 | 深度了解 Hermes |

### 实战 — Prompt模板与案例

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Vibe_Coding_Getting_Started.md](./Practice/Vibe_Coding_Getting_Started.md) | 5分钟入门、4步安全法、实战练习 | 完全新手 |
| [Vibe_Coding_Prompt_Templates.md](./Practice/Vibe_Coding_Prompt_Templates.md) | STAR框架、8大场景提示模板、规则文件模板、反面教材 | 日常编码参考 |
| [Vibe_Coding_Real_World_Cases.md](./Practice/Vibe_Coding_Real_World_Cases.md) | 4大场景实战方案 + 3个真实团队案例 | 寻找落地参考 |

### 方法论 — 工作流与最佳实践

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Vibe_Coding_Methodology.md](./Methodology/Vibe_Coding_Methodology.md) | DGRV模型、五层能力模型、工作流模式、质量保障、团队协作 | 系统学习方法论 |
| [Vibe_Coding_Production_Practices.md](./Methodology/Vibe_Coding_Production_Practices.md) | 安全工程、质量监控、技术债管理、组织变革、合规 | 生产环境落地 |
| [Agentic_Coding_Methodology.md](./Methodology/Agentic_Coding_Methodology.md) | 多Agent协作架构、角色定义、环境沙箱、质量保障 | 进阶 |
| [AI 代码安全审计 Runbook](./AI_Code_Security_Audit_Runbook.md) | AI 生成代码漏洞、SAST/SCA/Secret Scan、AI 代码审查、CI/CD 集成 | 安全工程师、AI 开发者 |

---

## 快速选路

```
我想做什么？ → 看哪个文档
═══════════════════════════════════════════════════════════════

"刚听说AI编程，想快速上手"
  → [入门指南](./Practice/Vibe_Coding_Getting_Started.md)

"选哪个AI编程工具？"
  → [工具对比](./Tools/AI_Coding_Assistants_2026.md)

"怎么写好Prompt让AI生成更好的代码？"
  → [提示词模板库](./Practice/Vibe_Coding_Prompt_Templates.md)

"想知道AI编程背后的原理和限制"
  → [理论基础](./Theory/AI_Coding_Theory.md)

"如何在团队/生产环境中系统化使用AI编程？"
  → [方法论](./Methodology/Vibe_Coding_Methodology.md)
  → [生产实践](./Methodology/Vibe_Coding_Production_Practices.md)

"看看别人怎么做的，有没有真实案例？"
  → [实战案例集](./Practice/Vibe_Coding_Real_World_Cases.md)

"对多Agent协作开发感兴趣"
  → [Agentic Coding 方法论](./Methodology/Agentic_Coding_Methodology.md)
  → [理论基础 §3](./Theory/AI_Coding_Theory.md#3-agentic-coding-架构原理)

"想深入了解Hermes Agent"
  → [Hermes Agent 深度指南](./Tools/Hermes_Agent_2026.md)
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

> 详见 [AI编程助手全景报告](./Tools/AI_Coding_Assistants_2026.md)

---

## 一句话总结

> **AI 编程已从"补全"进化为"结对编程伙伴"** — Cursor 以 72% 代码接受率领跑，Hermes Agent 以全平台开源和 17+模型支持成为最大变量，Agentic Coding 成为 2026 年主流。

## Related
- [[16_AI_Coding/Practice/Vibe_Coding_Prompt_Templates|Vibe Coding 提示词模板库]]
- [[16_AI_Coding/Practice/Vibe_Coding_Getting_Started|Vibe Coding 傻瓜指南 (Vibe Coding for Dummies)]]
- [[16_AI_Coding/Practice/Vibe_Coding_Real_World_Cases|Vibe Coding 实战案例集]]
- [[16_AI_Coding/Tools/OpenRouter/12-openrouter-enterprise-advanced|16_AI_Coding/Tools/OpenRouter/12-openrouter-enterprise-advanced]]
- [[16_AI_Coding/Tools/Hermes_Agent_2026|Hermes Agent 2026 年专业指南]]
- [[16_AI_Coding/Tools/Qoder_Guide|Qoder / QoderWork / QoderWake 使用指南]]
- [[16_AI_Coding/Tools/DeepSeek_Guide|DeepSeek 使用指南]]
- [[16_AI_Coding/Tools/Monica_Guide|Monica 使用指南]]
- [[16_AI_Coding/AI_Coding-in-nutshell|AI 编程 - 速查版]]
- [[16_AI_Coding/README|AI 编程 (AI Coding)]]
- [[16_AI_Coding/MOC_OpenRouter_OpenCode|topic-ai-coding MOC]]
- [[16_AI_Coding/README_for_dummy|17 AI 编程 — 小白版 💻]]

- [[_concepts/ai-agents]] — AI 智能体
- [[_concepts/prompt-engineering]] — 提示工程
- [[16_AI_Coding/Methodology/Vibe_Coding_Production_Practices]] — Vibe_Coding_Production_Practices
- [[16_AI_Coding/Methodology/Agentic_Coding_Methodology]] — Agentic_Coding_Methodology
- [[16_AI_Coding/Methodology/Vibe_Coding_Methodology]] — Vibe_Coding_Methodology
- [[16_AI_Coding/Tools/MiMO_Guide]] — MiMO 使用指南
- [[16_AI_Coding/Tools/Kilo_Guide]] — Kilo / KiloClaw 使用指南
- [[16_AI_Coding/Tools/Grok_Guide]] — Grok / Grok Code 使用指南
- [[16_AI_Coding/Tools/Kimi_Guide]] — Kimi Code / Kimi Chat 使用指南
- [[16_AI_Coding/Tools/AI_Coding_Assistants_2026]] — AI_Coding_Assistants_2026
- [[16_AI_Coding/Tools/Trae_Guide]] — Trae 使用指南
- [[16_AI_Coding/Tools/MiniMax_Guide]] — MiniMax / MiniClaw 使用指南
- [[16_AI_Coding/Tools/Manus_Guide]] — Manus 使用指南
- [[16_AI_Coding/Tools/GLM_Guide]] — GLM 使用指南
- [[16_AI_Coding/Tools/Qwen_Guide]] — Qwen (通义千问) 使用指南
- [[16_AI_Coding/Tools/Cursor_Guide]] — Cursor 使用指南
- [[16_AI_Coding/Tools/Comate_Guide]] — Comate 使用指南
- [[16_AI_Coding/Tools/Ima_Guide]] — Ima 使用指南
- [[16_AI_Coding/Tools/Coze_Guide]] — Coze 使用指南
- [[16_AI_Coding/Tools/Pending_Tools_Catalog]] — 待探索工具目录

- [[Claude_Enterprise_Use_Cases|Claude 企业实践案例]]
- [[Claude_Cost_Optimization|Claude 成本优化与性能调优]]
- [[codex-openai_overview|OpenAI Codex 概览]]
- [[github-copilot_overview|GitHub Copilot 概览]]

## 新增页面

- [[16_AI_Coding/AI_Coding_2026_Guide|AI 编程 2026 全景指南]]
