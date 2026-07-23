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
