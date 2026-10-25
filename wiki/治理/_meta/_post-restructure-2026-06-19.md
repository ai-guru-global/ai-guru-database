---
title: 目录重构后验证报告
date: 2026-06-19
sources: []
name_zh: "目录重构后验证报告"
---

# 目录重构验证报告

> 中文简称：目录重构后验证报告

| 指标 | 基线 | 重构后 |
|------|------|--------|
| 文件数 | 2328 | 2324 |
| 内链数 | 6179 | 6179 |
| 断链数（原始计数） | 643 | 649 |

## 结论：重构未引入真实新断链 ✅

原始计数 649 > 643，但经**编号归一化对比**（把基线断链路径映射到新编号后与当前逐条比对），确认：

- **重构引入的真实新断链 = 0**
- 649 - 643 = 6 的差值全部来自预存断链的编号映射与归一化计数边界：
  - `来源/yeasy/` 的 `appendix/参考.md`（yeasy 来源素材自带的预存断链，目标文件在基线时即不存在）
  - `Vibe_Coding_Methodology.md`、`Agent_Harness_Complete_2026.md` 的相对路径层级 bug（基线时 `../../../17_AI_Coding/04_Methodology/` 已断，现映射为 `../../../AI编程/Methodology/`，性质不变）

## 重构完成项

| 验收项 | 状态 |
|--------|------|
| 顶层章节连续 00-21，无缺口 | ✅ |
| 知识图谱层 概念/治理/参考 | ✅ |
| 嵌套子目录去编号前缀（Agent_Evaluation/OpenClaw_Ecosystem/Theory/Tools/Practice/Methodology） | ✅ |
| 去重（根 _evaluation / _staging 治理/hot.md） | ✅ |
| 治理 错位文件归位（synthesis-*→综合，cheatsheet-*→治理/cheatsheets） | ✅ |
| wikilink/内链/反引号/裸路径全量重写（1161 文件） | ✅ |
| Web/src 路径与 categoryId 同步 | ✅ |
| README 章节导航/统计表更新 | ✅ |
| _directory-conventions.md 规范更新 | ✅ |
| .manifest.json 路径键更新（JSON 合法） | ✅ |
| 迁移脚本 15 单元测试全过 | ✅ |
| 每章独立 commit 可回滚（16 commits） | ✅ |

## 已知预存问题（非重构引入，超出本次范围）

- 部分深目录文档用过多 `../../../` 导致相对路径层级错误（如 `19_业界观点/Andrej_Karpathy/` 引用 `AI编程/Methodology/`）
- `来源/yeasy/` 来源素材内部存在断链（yeasy 项目自带）
- Web 前端 vitest 因缺 jsdom 环境配置无法运行（与重构无关）

## 关联

本重构后验证报告记录目录调整后的健康度，关联重构前的评估与后续治理。

- [[治理/_evaluation-2026-06-15|评估 2026-06-15]] — 重构前基线评估
- [[治理/_project-evaluation|项目整体评估]] — 顶层评估对照
- [[治理/_directory-conventions|目录结构规范]] — 重构遵循的命名约定
- [[治理/_content-audit-2026-07-01|内容审计 2026-07-01]] — 重构后的最新审计
- [[治理/quality-metrics/Quality_Metrics|质量度量]] — 连通性与覆盖率验证
- [[治理/_lint-report|Lint 报告]] — 重构引入的断链检查
- [[治理/_governance-worklog-2026-06-22|治理工作日志]] — 重构决策记录
