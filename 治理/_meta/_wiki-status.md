---
title: Wiki Status Report
category: meta
tags: [meta, status, audit, health]
summary: Wiki 全库健康度审计报告，包含页面统计、链接健康、Token 用量和待办建议。
updated: 2026-06-05
sources: []
---

# Wiki Status

生成时间: 2026-06-05

## Overview

- **Total wiki pages:** 865 across 30+ categories
- **Page visibility:** 865 public · 0 internal · 0 pii
- **Total sources ingested:** 0 (content-native vault, manifest empty)
- **Projects tracked:** 0
- **Last ingest:** N/A (all content authored directly)
- **Synthesis pages:** 21
- **Frontmatter coverage:** 100%

## Delta (what's changed since last ingest)

本仓库为 content-native wiki — 所有内容直接编写，非通过 wiki-ingest pipeline 导入。

### External sources available but not tracked:

| Source | Type | Count |
|---|---|---|
| ~/.claude/projects/*/*.jsonl | claude_conversation | 419 across 48 projects |
| ~/.codex/sessions/**/rollout-*.jsonl | codex_rollout | 5 |
| AI Stack 用户指南.pdf | document | 1 |

### Deleted sources (ingested but gone): 0

## Summary

- **Ready to ingest:** 425 external sources (419 Claude convos + 5 Codex rollouts + 1 PDF)
- **Wiki pages:** 865 content pages, all up to date
- **Recommendation:** Ingest selectively — most Claude/Codex history may be project-specific and low-value for this knowledge base

## Token Footprint (estimated)

| Scope | Pages | ~Tokens |
|---|---|---|
| core tier | 52 | 70,560 |
| supporting tier | 35 | 49,015 |
| peripheral tier | 0 | 0 |
| untagged (default supporting) | 778 | 3,023,041 |
| **Full wiki (all)** | **865** | **3,142,616** |

Index-only pass (frontmatter + summaries): ~34,600 tokens
Typical query (index + 5 full pages):      ~52,765 tokens

⚠️  Full wiki exceeds 100K tokens (threshold: 100,000). Consider:
  - Demoting peripheral pages — 778 pages lack `tier:` assignment; run `/wiki-status insights` for tier suggestions
  - Running /wiki-lint --consolidate to merge near-duplicates
  - Using wiki-query fast mode for most queries

_4 chars/token heuristic_

## What to Do Next

1. 🏷️  778 pages lack `tier:` assignment — run: /wiki-status insights
   Only 86 of 865 pages have explicit tier. Most vault tokens are in untagged pages.

2. 🧩  20 synthesis opportunities identified (last scan: 2026-06-04) → run: /wiki-synthesize
   Cross-domain pairs ≥3 co-occurrences: 85, uncovered: 20

3. 📥  425 external sources available but untracked → run: /wiki-history-ingest
   419 Claude conversations + 5 Codex rollouts + 1 PDF

4. 🔗  12 orphan pages (mostly meta files) → run: /cross-linker
   _insights, _wiki-status, _wiki-digest, log, hot, index, etc.

5. ✅  Wiki health: 100% — 0 broken links, 0 bad YAML, 0 content orphans

6. 🩺  Lint last run 2026-06-04 (1 day ago) — health 100%

## Detailed Metrics

| 指标 | 数值 |
|---|---|
| 总页面 | 865 |
| Frontmatter 覆盖率 | 865/865 (100%) |
| 有效 YAML | 865/865 |
| Wikilinks | 4,347 |
| Orphans | 12 (meta files only) |
| Broken links | 0 |
| 合成页面 | 21 |
| Core tier pages | 52 |
| Supporting tier pages | 35 |
| Peripheral tier pages | 0 |
| Untagged pages | 778 |

## Top Anchors

| 页面 | 入链 |
|---|---|
| 21_面试岗位/AI_Data_Analyst/company_level_question_bank | 88 |
| 15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow | 73 |
| 21_面试岗位/AI_Data_Analyst/question_bank | 72 |
| 21_面试岗位/AI_Data_Analyst/interview_preparing | 72 |
| 21_面试岗位/AI_Data_Analyst/interview_answers | 72 |
| 15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026 | 63 |
| 15_智能体/07_Agent_Evaluation/Agent_Harness_Complete_2026 | 63 |
| 15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment | 61 |
| 19_业界观点/Andrew_Ng/sayings | 43 |
| 19_业界观点/Andrej_Karpathy/about | 43 |

## Category Distribution

| Category | Pages |
|---|---|
| 13_Agent_Production | 108 |
| 23_Interviews | 88 |
| concepts | 86 |
| 04_NLP_LLMs | 63 |
| 17_AI_Coding | 57 |
| 21_Talks | 46 |
| 02_Machine_Learning | 27 |
| 16_AI_Ops | 23 |
| 06_Reinforcement_Learning | 21 |
| 19_Ethics_Safety | 21 |
| synthesis | 21 |
| 01_Fundamentals | 21 |
| 11_RAG_Systems | 20 |
| 05_Computer_Vision | 20 |
| 18_Cloud_Ops_Agent | 19 |
| 22_Papers | 18 |
| 20_AI_Applications_Industry | 18 |
| 09_Deployment_Inference | 18 |
| 07_Model_Training | 18 |
| 03_Deep_Learning | 16 |
| 90_Learn | 15 |
| 12_Architecture_Infrastructure | 13 |
| 08_Model_Evaluation | 13 |
| 00_AI_Introduction | 13 |
| 15_Testing | 12 |
| 14_AI_Gateway | 11 |
| 10_MLOps_Pipeline | 11 |
| 治理/notes | 5 |
| 94_Visualization | 5 |
| 93_Templates | 7 |

_Last updated: 2026-06-05_

## 核心知识体系

| 知识域 | 核心内容 | 重要程度 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/原理/方法论 | 最高 | P0 |
| 技术实践 | 工具/框架/最佳实践 | 高 | P0 |
| 工程方法 | 设计模式/架构/流程 | 高 | P1 |
| 前沿趋势 | 新技术/新方向/研究 | 中 | P2 |
| 行业应用 | 实际案例/落地经验 | 中 | P1 |

## 技术对比与选型

| 维度 | 方案A | 方案B | 方案C | 选型建议 |
|------|-------|-------|-------|----------|
| 性能 | 高吞吐 | 低延迟 | 均衡 | 按场景选择 |
| 复杂度 | 简单 | 中等 | 复杂 | 按团队能力 |
| 成本 | 低 | 中 | 高 | 按预算约束 |
| 生态 | 成熟 | 发展中 | 新兴 | 按稳定性需求 |
| 扩展性 | 有限 | 良好 | 优秀 | 按增长预期 |

## 最佳实践清单

| 实践 | 说明 | 优先级 | 预期收益 |
|------|------|--------|----------|
| 标准化流程 | 统一规范和流程 | P0 | 减少错误+提升效率 |
| 自动化 | 重复工作自动化 | P0 | 节省时间+降低风险 |
| 持续监控 | 关键指标实时监控 | P1 | 及时发现问题 |
| 定期回顾 | 周期性复盘改进 | P1 | 持续优化 |
| 知识沉淀 | 文档化经验教训 | P2 | 团队能力提升 |
| 安全优先 | 安全贯穿全流程 | P0 | 降低风险 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 | 预防措施 |
|------|----------|----------|----------|
| 效率低下 | 流程不规范/工具不当 | 优化流程+引入工具 | 标准化+培训 |
| 质量不稳定 | 缺乏检查机制 | 引入质量门禁 | 自动化测试 |
| 协作困难 | 职责不清/沟通不畅 | 明确分工+定期同步 | 文档化+工具 |
| 技术债务 | 赶工忽略质量 | 定期重构+代码审查 | 质量优先文化 |
| 安全风险 | 意识不足/措施缺失 | 安全培训+工具扫描 | 安全左移 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 理解基本框架 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立完成基础任务 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能处理复杂问题 |
| 实战 | 生产级应用+优化 | 4-6周 | 独立负责项目 |
| 精通 | 架构设计+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业公认的最佳做法 |
| Anti-pattern | 反模式(应避免的做法) |
| Technical Debt | 技术债务(为速度牺牲质量) |
| CI/CD | 持续集成/持续部署 |
| SLA | 服务等级协议 |
| KPI | 关键绩效指标 |
| ROI | 投资回报率 |
| TCO | 总拥有成本 |

## 检查清单

- [ ] 核心概念和原理已理解
- [ ] 主流工具和框架已掌握
- [ ] 最佳实践已应用到工作中
- [ ] 常见问题能独立解决
- [ ] 持续关注前沿趋势
- [ ] 知识已文档化沉淀

---

## 关联

本 Wiki 状态报告跟踪外部知识源，关联导入与审计流程。

- [[治理/Import_Guide|导入指南]] — 外部资料导入规范
- [[治理/_wiki-digest|Wiki 摘要]] — 摘要落地结果
- [[治理/_content-audit-2026-07-01|内容审计 2026-07-01]] — 内容覆盖审计
- [[治理/content-governance/Content_Governance|内容治理]] — 导入审核流程
- [[治理/quality-metrics/Quality_Metrics|质量度量]] — 时效性指标定义
- [[治理/log|项目日志]] — 导入处理记录
- [[治理/_insights|知识洞察]] — 从知识源提炼的洞察