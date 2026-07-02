---
title: 工具领域知识与项目工具指南 (Tools)
category: 93-tools
tags: [tools, software, utilities, productivity, api-design, documentation, prompt-management]
summary: "AI 工具领域知识文章（API 设计、文档自动化、Prompt 管理平台）与项目运维指南（导入规范、文档模板）的集合。"
created: 2026-05-31
updated: 2026-06-24
tier: supporting

---
# 工具领域知识与项目工具指南 (Tools)

> **一句话理解**: 本章节包含两类内容——① AI 工具领域知识文章（API 设计、文档自动化、Prompt 管理等），② AI Guru 项目自身的运维工具指南（导入规范、文档模板）。

---

## 与 `_tools/` 的区别

| 维度 | `93_Templates/` (本目录) | `_tools/` (项目脚本) |
|------|---------------------|---------------------|
| **定位** | 知识文章 + 项目指南 | 实际运维脚本 |
| **内容类型** | Markdown 文档 | Python/Bash 脚本 |
| **示例** | API_Design_for_AI.md (1368 行) | `check_links.py`, `count_words.py` |
| **受众** | 知识库读者 + 项目维护者 | 项目维护者 / CI 流水线 |
| **关系** | 知识层：介绍工具方法论 | 执行层：实际运行脚本 |

---

## 本章内容

### AI 工具领域知识文章

| 文档 | 行数 | 内容 |
|------|------|------|
| [[93_Templates/API_Design_for_AI]] | 1368 | AI 系统 API 设计权威指南：RESTful / GraphQL / gRPC 选型、版本管理、OpenAPI 规范 |
| [[93_Templates/Documentation_Automation]] | 1068 | AI 文档自动化工具全景：Sphinx / MkDocs / Docusaurus / Vale / Vale 对比 |
| [[93_Templates/Prompt_Management_Platform]] | 1199 | Prompt 管理平台调研：LangSmith / PromptLayer / Helicone / Langfuse 深度对比 |
| [[93_Templates/LLM_Gateway_Deep_Dive]] | 572 | LLM Gateway 设计、实现与运维模板：路由、Fallback、限流、成本归因、Terraform/Helm |

### 项目运维指南

| 文档 | 行数 | 内容 |
|------|------|------|
| [[93_Templates/DOCUMENT_TEMPLATES]] | 1087 | **全项目文档模板规范**：README / nutshell / for_dummy / 核心内容 / 论文解读 / 行业应用 |
| [[93_Templates/IMPORT_GUIDE]] | 276 | 知识库内容导入规范与流程（URL / 文件 / 批量导入） |

---

## 规划中的增强方向

- [ ] 自动化链接检查器（检测断链） → 已在 `_tools/check_links.py` 实现基础版
- [ ] 内容质量评分脚本（行数、链接密度、代码覆盖率）
- [ ] 术语一致性检查器（对照 AI Full Stack Concepts）
- [x] 文档模板规范（已沉淀为 [[93_Templates/DOCUMENT_TEMPLATES]]）

---

## 与其他章节的关联

- [[_meta/plan/README]] — 项目规划与路线图
- [[_meta/notes/README]] — 知识库元数据与笔记
- README — 项目运维脚本（执行层）

---

## Related

- [[93_Templates/README_for_dummy|93 Tools — 小白版]]
- [[93_Templates/API_Design_for_AI|AI API 设计指南]]
- [[93_Templates/Documentation_Automation|AI 文档自动化]]
- [[93_Templates/Prompt_Management_Platform|Prompt 管理平台]]
- [[93_Templates/DOCUMENT_TEMPLATES]] — 文档模板规范
- [[93_Templates/IMPORT_GUIDE]] — 导入指南

---

*本章节面向知识库读者（工具领域知识）和项目维护者（运维指南）。*

*Last updated: 2026-06-24*
---
title: 工具与指南 (Tools)
category: 93-tools
tags: ["tools", "software", "utilities", "productivity"]
summary: "> **一句话理解**: 本章节提供 AI Guru 知识库的项目工具、导入指南和自动化脚本，帮助维护者和贡献者高效管理内容。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting

---
# 工具与指南 (Tools)

> **一句话理解**: 本章节提供 AI Guru 知识库的项目工具、导入指南和自动化脚本，帮助维护者和贡献者高效管理内容。

---

## 本章内容

| 文档 | 内容 |
|------|------|
| [Import Guide](./IMPORT_GUIDE.md) | 知识库内容导入规范与流程 |
| [Document Templates](./DOCUMENT_TEMPLATES.md) | **全项目文档模板规范**（README / nutshell / for_dummy / 核心内容 / 论文解读 / 行业应用） |

---

## 规划中的工具

- [ ] 自动化链接检查器（检测断链）
- [ ] 内容质量评分脚本（行数、链接密度、代码覆盖率）
- [ ] 术语一致性检查器（对照 AI Full Stack Concepts）
- [x] 文档模板规范（已沉淀为 [DOCUMENT_TEMPLATES.md](./DOCUMENT_TEMPLATES.md)）

---

## 与其他章节的关联

- [_meta/plan](../_meta/plan/README.md) — 项目规划与路线图
- [_meta/notes](../_meta/notes/README.md) — 知识库元数据

---

*本章节面向项目维护者和贡献者。*

## Related
- [[93_Templates/Documentation_Automation|AI 文档自动化]]
- [[93_Templates/README_for_dummy|93 Tools — 小白版 🛠️]]
- [[93_Templates/Prompt_Management_Platform|Prompt 管理平台]]
- [[93_Templates/API_Design_for_AI|AI API 设计指南]]

- [[93_Templates/DOCUMENT_TEMPLATES]] — AI Guru 知识库 — 文档模板规范 (共享: productivity, software, tools, utilities)
- [[93_Templates/IMPORT_GUIDE]] — 📥 导入指南 (共享: productivity, software, tools, utilities)
- [[93_Templates/Documentation_Automation.md|Documentation_Automation]]
- [[93_Templates/README_for_dummy.md|README_for_dummy]]
- [[93_Templates/Prompt_Management_Platform.md|Prompt_Management_Platform]]
- [[93_Templates/API_Design_for_AI.md|API_Design_for_AI]]

