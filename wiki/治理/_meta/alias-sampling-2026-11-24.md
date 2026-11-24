---
title: Alias 链接抽样复核 2026-11-24
category: meta
tags: ["governance", "alias", "obsidian", "link-gate"]
summary: "20 条别名命中链接的 Obsidian 行为实证：带路径别名不可解析（实为断链，须清理为现行路径），裸别名可解析（合法保留）。"
created: 2026-11-24
updated: 2026-11-24
tier: supporting
aliases:
  - Alias Sampling 2026-11
  - 别名抽样复核
sources: []
name_zh: "别名链接抽样复核"
---
# Alias 链接抽样复核 2026-11-24

> 中文简称：别名链接抽样复核

> **一句话理解**: 门禁靠 frontmatter 别名兜底救回了 1,120 条链接，抽样 20 条实证后确认：裸别名在 Obsidian 里合法可用，但带路径前缀的别名链接（979 条）Obsidian 根本不认——它们是伪装成通过的断链。

---

## 背景与口径

`AI_Guru_仓库聚合与门禁评估_2026-11-18.md`（仓库父目录规划稿，未入库）要求抽
20 条"alias 命中"链接人工确认 Obsidian 行为，再决定是否全量纳入门禁。本页为
完整 20 条样本与结论，取代此前零散记录（4 条未归档，以本页为准）。

当前全库 alias 兜底解析 1,120 次：**带路径 971~979 / 裸别名 141**（两工具计数
口径略有差异）。样本按 `random.seed(42)` 分层抽取（带路径 10 + 裸别名 10）。

## Obsidian 语义判定

- `[[裸别名]]`：Obsidian 以 frontmatter `aliases` 建名索引，裸别名链接**可解析** ✓
- `[[目录/别名]]`：Obsidian 链接解析按「精确路径 → 文件名 → 别名」顺序匹配**完整链接串**，
  别名索引不含路径前缀 → `目录/别名` **不可解析** ✗

三例实证（链接路径均不存在、真实文件存在、别名确实声明于目标文件 frontmatter）：

| 链接目标 | 磁盘存在 | 真实文件 | 别名声明 |
|---|---|---|---|
| `00_入门/01_基础入门/AI_History_Timeline` | ✗ | `04_AI历史时间线.md` | `AI_History_Timeline` ✓ |
| `03_深度学习/07_世界模型/World_Models_2026` | ✗ | `03_世界模型_2026.md` | ✓ |
| `15_智能体/15_课程笔记/Microsoft_AI_Agents_L10_Production` | ✗ | `22_…第10课_生产.md` | ✓ |

带路径别名命中的成因：`rename_to_chinese` 一次迁移把文件改中文名、旧英文名降级为
aliases，当时链接改写保留了 `目录/旧英文名` 形态——在 Obsidian 语义下全部失效。

---

## 20 条样本明细

### 带路径别名（10 条，Obsidian 全部不可解析 ✗ → 须清理为现行路径）

| # | 来源页 | 链接目标 | 实际指向 |
|---|---|---|---|
| 1 | `治理/_meta/_synthesis-index-archive.md` | `治理/moe-inference-optimization` | `05_大模型/04_LLM架构/14_MoE_推理优化_2026` |
| 2 | `15_智能体/15_课程笔记/19_…Planning_设计` | `15_智能体/15_课程笔记/Microsoft_AI_Agents_L06_Trustworthy_Agents` | 同目录 `18_…第6课_Trustworthy_Agent` |
| 3 | `00_入门/04_伦理与未来/01_AI经典案例` | `00_入门/01_基础入门/AI_History_Timeline` | 同目录 `04_AI历史时间线` |
| 4 | `03_深度学习/01_深度学习基础/02_DL基础` | `03_深度学习/08_DL框架/DL_Frameworks` | 同目录 `03_DL框架` |
| 5 | `10_部署推理/02_推理引擎/25_TensorRT_LLM_深入分析` | `治理/chinese-chips-inference` | `12_架构基建/07_硬件与算力/05_chinese_chips_inference` |
| 6 | `01_数学基础/08_Python工具包/03_GenAI_L00_课程_配置` | `00_入门/GenAI_L01_Intro_to_GenAI_and_LLMs` | `00_入门/03_学习路径/05_GenAI_第1课…` |
| 7 | `01_数学基础/INDEX` | `01_数学基础/01_数学基础/Calculus_Optimization` | 同目录 `01_微积分与优化` |
| 8 | `15_智能体/07_Agent评估/README` | `15_智能体/07_Agent评估/Implementation/API_Integration_Guide` | 同目录 `Implementation/06_API_集成_指南` |
| 9 | `03_深度学习/README` | `03_深度学习/07_世界模型/World_Models_2026` | 同目录 `03_世界模型_2026` |
| 10 | `15_智能体/15_课程笔记/28_…L18_Securing_AI_Agent` | `15_智能体/15_课程笔记/Microsoft_AI_Agents_L10_Production` | 同目录 `22_…第10课_生产` |

### 裸别名（10 条，Obsidian 全部可解析 ✓ → 合法保留）

| # | 来源页 | 链接目标 | 实际指向 |
|---|---|---|---|
| 11 | `21_面试岗位/23_Prompt工程师/02_Prompt工程师_2026` | `AI_Safety_Engineer_2026` | `21_面试岗位/10_AI安全工程师/01_AI安全工程师_2026` |
| 12 | `08_模型评估/04_评估工具/01_Eval_Driven_开发` | `Evaluation_Automation_2026` | `08_模型评估/05_自动化评估/02_评估_自动化_2026` |
| 13 | `04_计算机视觉/08_多模态视觉/05_Visual_Grounding_深入分析` | `Image_Classification_Detection` | `04_计算机视觉/02_图像分类与检测/01_图像分类与检测` |
| 14 | `00_入门/02_技术概览/02_AI_多模态_GenAI` | `AI_Tools_Practical_Guide` | `00_入门/03_学习路径/04_AI工具实用指南` |
| 15 | `06_强化学习/02_深度强化学习/05_Hierarchical_RL_深入分析` | `Inverse_RL_Imitation_Learning` | 同目录 `07_Inverse_RL_Imitation_学习` |
| 16 | `08_模型评估/04_评估工具/01_Eval_Driven_开发` | `Safety_Alignment_Evaluation` | `08_模型评估/06_安全评估/04_安全_对齐_评估` |
| 17 | `05_大模型/14_中国LLM生态/18_模型Scope_模型_索引` | `ModelScope_Model_Index_Qwen` | 同目录 `17_模型Scope_模型_索引_Qwen` |
| 18 | `05_大模型/14_中国LLM生态/README` | `DeepSeek_Deep_Dive` | 同目录 `08_深度Seek_深入分析` |
| 19 | `20_论文精读/06_对齐研究/02_宪法AI_论文_深入分析` | `Chain_of_Thought_Deep_Dive` | 同目录 `01_思维链_深入分析` |
| 20 | `06_强化学习/02_深度强化学习/05_Hierarchical_RL_深入分析` | `Exploration_Strategies_Deep_Dive` | 同目录 `04_探索_策略_深入分析` |

---

## 结论与处置

1. **带路径别名（约 979 条）= 伪装通过的断链**。登记为
   [[治理/KNOWN_ISSUES#ISS-111|ISS-111]]，清理战役（P0-2C2）：用
   `alias_candidates` 现行路径改写链接目标（多数只需去掉路径前缀或替换为真实
   文件名）；可与 [[治理/KNOWN_ISSUES#ISS-105|ISS-105 乱码家族]] 顺带清偿
   （样本中 `深度Seek` 类机翻别名即是该家族残留）。
2. **裸别名（141 条）= 合法 Obsidian 语义**，保留；新写页面仍按 AGENTS.md 惯例
   用现行路径 wikilink，别名只作兜底不作首选。
3. **门禁口径跟进**：path-alias 命中在 `link_gate` 输出中已单独计数；纳入断链
   指标须走独立棘轮键（沿用 staging 指标先例），避免一次性 +979 冲爆基线。
   落点与 [[治理/KNOWN_ISSUES#ISS-110|ISS-110 根相对裸写]] 同批处理。

---

*Last updated: 2026-11-24*
