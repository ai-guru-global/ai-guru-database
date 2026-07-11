---
title: '_meta 元文件索引'
category: '90-governance'
tags: ["governance", "meta", "index", "audit", "assessment"]
summary: '> 治理层 `_` 开头元文件的归组目录——审计报告、评估报告、检查报告、工作日志等内部生成文件的统一存放点。'
created: '2026-07-11'
updated: '2026-07-11'
tier: supporting
sources: []
aliases:
  - _meta
  - 元文件目录
---

# _meta 元文件索引

> 本目录集中存放治理层所有以 `_` 开头的**自动生成或半自动维护的元文件**。这些文件记录知识库的健康状态、审计结果和评估报告，面向项目维护者和 AI 工具链，不直接面向终端读者。

---

## 命名约定

- `_` 前缀 = 元文件 / 内部报告
- 带日期后缀（如 `_lint-report-2026-06-30.md`）= 历史快照
- 不带日期（如 `_lint-report.md`）= 当前版本

---

## 文件分类总览

| 文件 | 类型 | 说明 |
|------|------|------|
| `_content-audit-*` | 审计 | 内容审计报告 |
| `_content-assessment-*` | 审计 | 内容评估报告 |
| `_evaluation-*` | 评估 | 项目评估报告 |
| `_lint-report*` | 检查 | 链接检查报告 |
| `_quality-assessment` | 评估 | 质量评估 |
| `_project-evaluation` | 评估 | 项目评估（最新） |
| `_project-assessment-*` | 评估 | 项目评估历史快照 |
| `_concept-*` | 分析 | 概念分析 |
| `_governance-*` | 日志 | 治理工作日志 |
| `_improvement-*` | 执行 | 改进执行记录 |
| `_directory-*` | 规范 | 目录规范 |
| `_tag-taxonomy*` | 规范 | 标签分类 |
| `_taxonomy-*` | 评估 | 分类评估 |
| `_insights` | 洞察 | 知识洞察 |
| `_wiki-*` | 状态 | Wiki 状态/摘要 |
| `_synthesis-*` | 归档 | 综合页面归档 |
| `_nlp-*` | 分析 | NLP/LLM 分类分析 |
| `_post-*` | 重组 | 重组后记录 |
| `_content-gap*` | 分析 | 内容差距分析 |
| `_content-supplement*` | 计划 | 内容补充计划 |
| `_llm-ecosystem*` | 分析 | LLM 生态分析 |

---

## 质量与审计

| 文件 | 用途 | 生成方式 |
|------|------|---------|
| [\_lint-report.md](./_lint-report.md) | **当前 Lint 报告**——wikilink 断链、frontmatter 缺失、格式问题 | wiki-lint skill |
| [\_lint-report-2026-06-30.md](./_lint-report-2026-06-30.md) | Lint 报告历史快照（2026-06-30） | wiki-lint skill |
| [\_quality-assessment.md](./_quality-assessment.md) | **质量评估**——内容完整性、覆盖度、成熟度 | project-quality-assessment skill |
| [\_content-audit-2026-07-01.md](./_content-audit-2026-07-01.md) | **内容审计**——全量内容逐目录审计（88KB 大报告） | 手动 + 工具辅助 |
| [\_content-assessment-2026-06-23.md](./_content-assessment-2026-06-23.md) | 内容评估历史快照（2026-06-23） | 工具辅助 |
| [\_content-gap-analysis.md](./_content-gap-analysis.md) | **内容缺口分析**——识别缺失概念和领域 | 工具辅助 |
| [\_content-supplement-plan-2026-07-01.md](./_content-supplement-plan-2026-07-01.md) | 内容补充计划——基于审计的补充方案 | 手动 |
| [\_tag-taxonomy-report.md](./_tag-taxonomy-report.md) | **标签分类报告**——标签统计和规范化建议 | tag-taxonomy skill |
| [\_taxonomy-assessment-2026-06-23.md](./_taxonomy-assessment-2026-06-23.md) | 标签分类评估历史快照 | tag-taxonomy skill |

---

## 项目评估

| 文件 | 用途 |
|------|------|
| [\_project-evaluation.md](./_project-evaluation.md) | **当前项目整体评估**——健康度、风险、优先改进项 |
| [\_evaluation-2026-06-15.md](./_evaluation-2026-06-15.md) | 项目评估历史快照（2026-06-15） |
| [\_evaluation-2026-06-24.md](./_evaluation-2026-06-24.md) | 项目评估历史快照（2026-06-24） |
| [\_project-assessment-2026-06-22.md](./_project-assessment-2026-06-22.md) | 项目评估历史快照（2026-06-22） |
| [\_concept-completion-2026-06-24.md](./_concept-completion-2026-06-24.md) | 概念完成度评估 |
| [\_concept-strengthening-r2-2026-06-24.md](./_concept-strengthening-r2-2026-06-24.md) | 概念强化第二轮评估 |
| [\_improvement-execution-2026-06-24.md](./_improvement-execution-2026-06-24.md) | 改进项执行报告 |

---

## 分析与洞察

| 文件 | 用途 |
|------|------|
| [\_insights.md](./_insights.md) | **知识洞察**——跨领域知识结构分析、中心页面、桥梁节点（26KB） |
| [\_wiki-status.md](./_wiki-status.md) | **Wiki 状态**——当前知识库规模、来源数量、摄取增量 |
| [\_wiki-digest.md](./_wiki-digest.md) | **Wiki 摘要**——周期性知识摘要（新增、更新、连接） |
| [\_llm-ecosystem-analysis-2026-06-15.md](./_llm-ecosystem-analysis-2026-06-15.md) | 大模型生态分析 |
| [\_nlp-llms-split-assessment-2026-06-22.md](./_nlp-llms-split-assessment-2026-06-22.md) | NLP/LLM 目录拆分评估 |

---

## 规范与约定

| 文件 | 用途 |
|------|------|
| [\_directory-conventions.md](./_directory-conventions.md) | **目录结构规范**——知识库目录命名和组织约定 |

---

## 结构调整记录

| 文件 | 用途 |
|------|------|
| [\_post-restructure-2026-06-19.md](./_post-restructure-2026-06-19.md) | 重构后验证报告 |
| [\_governance-worklog-2026-06-22.md](./_governance-worklog-2026-06-22.md) | 治理工作日志 |
| [\_synthesis-index-archive.md](./_synthesis-index-archive.md) | 综合索引归档 |
| [\_synthesis-readme-archive.md](./_synthesis-readme-archive.md) | 综合 README 归档 |

---

## 维护说明

- `_meta` 元文件由工具链或维护者定期更新，贡献者一般无需手动修改
- 带日期的历史快照保留用于趋势对比，不做内容更新
- 不带日期的当前版本文件在每次审计/评估周期后覆盖更新
- 新增元文件应遵循 `_` 前缀命名约定并在此索引中登记

---

## Related

- [[治理/README|治理层总入口]]
- [[治理/index|治理目录索引]]
- [[治理/log|项目变更日志]]
