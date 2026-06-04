---
title: Wiki Digest — 本周知识动态
category: meta
tags: [meta, digest, weekly, changelog]
summary: 本周 Wiki 更新摘要，涵盖标签规范化、链接网络构建、合成页面创建和 frontmatter 修复。
---

# Wiki Digest — 2026年06月01日

## 本周概况

- **修改文件**: 624 个
- **新增页面**: 8 个（3 合成 + 3 洞察报告 + 1 MOC + 1 index）
- **标签规范化**: 12 组合并，影响 106 个文件
- **Frontmatter 修复**: 263 个文件的 YAML 语法修复
- **Orphan 清零**: 从 333 降至 4（仅 .github/ 模板）
- **Broken links**: 从 ~370 降至 0
- **Wikilinks 总数**: 3,444

## 按目录分布

| 目录 | 修改文件数 |
|---|---|
| 13_Agent_Production | 107 |
| 23_Interviews | 88 |
| 21_Talks | 46 |
| 04_NLP_LLMs | 32 |
| 16_AI_Ops | 23 |
| 06_Reinforcement_Learning | 21 |
| 05_Computer_Vision | 20 |
| 11_RAG_Systems | 20 |
| 02_Machine_Learning | 19 |
| 18_Cloud_Ops_Agent | 19 |
| 19_Ethics_Safety | 18 |
| 01_Fundamentals | 16 |
| 20_AI_Applications_Industry | 16 |
| 09_Deployment_Inference | 15 |
| 90_Learn | 14 |

## 主要工作主题

### 1. 标签体系规范化 (Tag Taxonomy)
- 合并缩写与全称: `rl`→`reinforcement-learning`, `ml`→`machine-learning`, `cv`→`computer-vision`, `dl`→`deep-learning`
- 统一大小写: `AGI`→`agi`, `GPU`→`gpu`, `FSDP`→`fsdp`, `HNSW`→`hnsw`
- 统一单复数: `neural-network`→`neural-networks`
- 消除语义重复: `training`→`model-training`, `k8s`→`kubernetes`, `model-serving`→`serving`

### 2. 知识图谱链接化
- 为 160 个 orphan 添加出链
- 从宿主页面注入 261 个入链
- 目录内交叉链接: Talks (42) + Interviews (84)
- README 聚合链接: Talks README (20) + Interviews README (46) + root README (1)

### 3. 合成页面 (Synthesis)
- `agent-framework-production` — Agent 框架与生产部署
- `career-interviews` — AI 面试与职业发展
- `talks-insights` — AI 领袖演讲与行业洞察

### 4. 报告与洞察
- `_insights.md` — 图谱拓扑分析（锚点、桥梁、聚类、意外连接）
- `_tag-taxonomy-report.md` — 标签规范化报告
- `_lint-report.md` — Wiki 健康检查基线
- `_wiki-status.md` — 全库状态快照

### 5. Frontmatter 修复
- 修复 263 个文件的 YAML 语法错误（title/summary 中的冒号和引号未正确转义）
- 全部 frontmatter 现可通过标准 YAML 解析器验证

## 本周热门标签（按修改覆盖）

- #ai-agents: 129 文件
- #agent-framework: 107 文件
- #production: 107 文件
- #langgraph: 107 文件
- #interviews: 88 文件
- #career: 88 文件
- #experience: 88 文件
- #practitioners: 88 文件
- #llm: 55 文件
- #talks: 46 文件
- #speeches: 46 文件
- #insights: 46 文件
- #leaders: 46 文件
- #nlp: 41 文件
- #transformer: 39 文件
- #gpt: 35 文件
- #bert: 33 文件
- #computer-vision: 26 文件
- #model-evaluation: 26 文件
- #reinforcement-learning: 24 文件

## 图谱健康度趋势

| 指标 | 本周初 | 本周末 |
|---|---|---|
| Frontmatter | 11% | 100% |
| Orphans | 723 | 4 |
| Broken links | ~370 | 0 |
| Wikilinks | 0 | 3,444 |
| Synthesis pages | 0 | 8 |

_Next: 考虑运行 `wiki-export` 将图谱导出为可视化格式，或 `graph-colorize` 为 Obsidian Graph View 着色。_
