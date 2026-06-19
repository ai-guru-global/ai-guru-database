---
title: 知识库目录结构重构设计 (Directory Restructure Design)
category: meta
tags: [directory-structure, refactoring, renumbering, governance]
summary: AI Guru 知识库的分层架构式重编号、知识图谱层 _ 前缀重命名、去重归位与脚本化迁移的完整设计。
created: 2026-06-19
updated: 2026-06-19
status: draft
---

# 知识库目录结构重构设计

> 本设计定义 AI Guru 知识库（ai-guru-database）的目录结构重构方案，目标是通过**分层架构式重编号**、**知识图谱层 `_` 前缀统一**、**去重归位**三项变更，使顶层结构连续无缺口、层级语义清晰、命名规范一致。

---

## 一、背景与动机

### 1.1 现状梳理

知识库现有顶层结构（详见 `_meta/_directory-conventions.md`）：
- **主知识章节 00–23**：22 个（缺 14、18，编号不连续）
- **拓展辅助章节 90–94**：5 个（学习/笔记/计划/工具/可视化）
- **知识图谱层**：`concepts/`（171）、`synthesis/`（28）、`references/`（24）
- **治理目录**：`_meta/`（23 个文件，含错位文件）、`_tools/`、`_staging/`、`_raw/`、`_archives/`、`_sources/`、`_projects/`

### 1.2 发现的问题

| # | 问题 | 严重性 |
|---|------|--------|
| P1 | 主章节编号断层（缺 14、18） | 中 |
| P2 | `13_Agent_Production/` 内嵌套带全局编号前缀的子目录（`16_Agent_Evaluation/`、`23_OpenClaw_Ecosystem/`），易与顶层章节混淆 | 中 |
| P3 | `17_AI_Coding/` 内部用 `01_Theory~04_Methodology` 编号，与其他章节子目录的纯主题命名风格不一致 | 低 |
| P4 | `_evaluation-2026-06-15.md` 同时存在于根目录与 `_meta/`（字节完全相同，10046B） | 中 |
| P5 | 根 `hot.md`（8040B）与 `_staging/hot.md`（2411B）同名不同步 | 中 |
| P6 | `_meta/` 内混放 7 个 `synthesis-*.md`/`cheatsheet-*.md`，按规范应属 `synthesis/` 与速查子目录 | 中 |
| P7 | 知识图谱层目录（concepts/synthesis/references）与治理目录（_meta/_tools）前缀风格不统一，视觉上分散 | 低 |
| P8 | 章节顺序按"学习路径"自然演进，但缺乏显式的层级分组，新读者难以快速定位技术栈位置 | 低 |

### 1.3 影响面量化（已实测）

| 维度 | 数值 | 性质 |
|------|------|------|
| Markdown 源文件 | ~1,216 个 | 需更新其中的 wikilink |
| wikilink 总数 | 9,101 个 | 目录前缀替换，纯机械操作 |
| `.manifest.json` | 578 行，含 15 个章节路径键 | 脚本重生成 |
| `Web/src/` 硬编码路径源文件 | 3 个（`docMap.ts`、`k8sEvalData.ts`、`TopicTagPanel.test.tsx`） | 手动改 |
| `Web/public/mkdocs/` HTML | 481 个 | 生成产物，`npm run build` 重建 |
| `_tools/fix_links.py` | 1 个脚本硬编码章节列表 | 同步更新 |
| 各章节被引用文件数 | 499–759 / 个 | wikilink 密集，脚本替换可行 |

**核心判断**：9,101 wikilink 看似庞大，但均为 `[[NN_Topic/...]]` 路径前缀形式，可用脚本按编号映射表精确替换，不触碰正文。真正需人工把关的仅源码 3 处 + 脚本 1 处 + 文档 8 处。**工程可行、风险可控**。

---

## 二、用户确认的决策

| 决策点 | 选择 |
|--------|------|
| 整理力度 | **重度**：重排编号 + 重构 |
| 章节编号缺口处理 | **重新编号**（连续无缺口） |
| 章节编排哲学 | **分层架构式（从下到上）** |
| 知识图谱层处理 | **保留独立但加 `_` 前缀重命名** |

---

## 三、设计详述

### 3.1 新编号体系（分层架构式，第 1 段）

按"从下到上"技术栈分层，22 个主章节重排为 **6 层 + 连续编号 00–21**（零缺口）。

#### 新旧编号映射表

| 新编号 | 新目录名 | 层级 | 旧编号 | 旧目录名 | 变化类型 |
|--------|----------|------|--------|----------|----------|
| **L0 基础层** | | | | | |
| 00 | `00_AI_Introduction` | 基础 | 00 | `00_AI_Introduction` | 不变 |
| 01 | `01_Fundamentals` | 基础 | 01 | `01_Fundamentals` | 不变 |
| **L1 模型层** | | | | | |
| 02 | `02_Machine_Learning` | 模型 | 02 | `02_Machine_Learning` | 不变 |
| 03 | `03_Deep_Learning` | 模型 | 03 | `03_Deep_Learning` | 不变 |
| 04 | `04_Computer_Vision` | 模型 | 05 | `05_Computer_Vision` | **编号 05→04** |
| 05 | `05_NLP_LLMs` | 模型 | 04 | `04_NLP_LLMs` | **编号 04→05** |
| 06 | `06_Reinforcement_Learning` | 模型 | 06 | `06_Reinforcement_Learning` | 不变 |
| **L2 工程层** | | | | | |
| 07 | `07_Model_Training` | 工程 | 07 | `07_Model_Training` | 不变 |
| 08 | `08_Model_Evaluation` | 工程 | 08 | `08_Model_Evaluation` | 不变 |
| 09 | `09_Testing` | 工程 | 15 | `15_Testing` | **15→09** |
| 10 | `10_Deployment_Inference` | 工程 | 09 | `09_Deployment_Inference` | **09→10** |
| **L3 平台层** | | | | | |
| 11 | `11_MLOps_Pipeline` | 平台 | 10 | `10_MLOps_Pipeline` | **10→11** |
| 12 | `12_Architecture_Infrastructure` | 平台 | 12 | `12_Architecture_Infrastructure` | 不变 |
| 13 | `13_AI_Ops` | 平台 | 16 | `16_AI_Ops` | **16→13** |
| **L4 应用层** | | | | | |
| 14 | `14_RAG_Systems` | 应用 | 11 | `11_RAG_Systems` | **11→14** |
| 15 | `15_Agent_Production` | 应用 | 13 | `13_Agent_Production` | **13→15** |
| 16 | `16_AI_Coding` | 应用 | 17 | `17_AI_Coding` | **17→16** |
| **L5 治理层** | | | | | |
| 17 | `17_Ethics_Safety` | 治理 | 19 | `19_Ethics_Safety` | **19→17** |
| **L6 资源层** | | | | | |
| 18 | `18_AI_Applications_Industry` | 资源 | 20 | `20_AI_Applications_Industry` | **20→18** |
| 19 | `19_Talks` | 资源 | 21 | `21_Talks` | **21→19** |
| 20 | `20_Papers` | 资源 | 22 | `22_Papers` | **22→20** |
| 21 | `21_Interviews` | 资源 | 23 | `23_Interviews` | **23→21** |

#### 关键设计决策

1. **零缺口连续编号 00–21**：旧 14、18 缺口消失。
2. **实际需重命名的章节 14 个**；00/01/02/03/06/07/08/12 共 8 个完全不动（14+8=22）。
3. **CV 与 NLP 顺序对调**（新 04=CV，新 05=NLP）：分层架构中视觉感知模型排在语言认知模型之前，符合"从感知到认知"递进，且 CV 内容更基础。
4. **Testing 从 15 提前到 09**：归入工程层，紧跟评估（08），形成"训练(07)→评估(08)→测试(09)→部署(10)"工程闭环。
5. **RAG 归应用层（14）而非平台层**：RAG 是面向应用的能力增强，平台层留给基础设施。
6. **拓展辅助章节 90–94 保持原编号**：独立编号空间，不属于核心主线。

### 3.2 知识图谱层 `_` 前缀重命名（第 2 段）

#### 重命名方案

| 旧目录 | 新目录 | 文件数 |
|--------|--------|--------|
| `concepts/` | `_concepts/` | 171 |
| `synthesis/` | `_synthesis/` | 28 |
| `references/` | `_references/` | 24 |

#### 顶层目录新格局

```
ai-guru-database/
├── 📚 核心知识章节 (00-21)     ← 6 层架构主线
├── 🗂️ 拓展辅助章节 (90-94)    ← 学习/笔记/计划/工具/可视化
├── 🔗 知识图谱层（_ 前缀统一）
│   ├── _concepts/              ← 概念卡片
│   ├── _synthesis/             ← 跨域综合
│   └── _references/            ← 外部引用索引
├── 📋 _meta/                   ← 项目治理与评估（去重后）
├── 🗄️ 生命周期: _raw/ _staging/ _archives/
├── 📦 _sources/ _projects/
├── 🌐 Web/ + _tools/
└── 📄 根目录文件: README/ROADMAP/index/hot 等
```

#### 设计权衡

选"加 `_` 前缀"而非"合并进 `_knowledge/`"：① 在 Finder/IDE 排序中三个目录自然聚拢到下划线区；② 保留 concepts/synthesis/references 三种语义边界（速查卡 vs 跨域综合 vs 外部引用）；③ 改动仅路径前缀替换，脚本化安全。

### 3.3 去重、归位与嵌套子目录（第 3 段）

#### 3.3.1 去重与归位

| 问题 | 处理 | 依据 |
|------|------|------|
| `_evaluation-2026-06-15.md` 根 + `_meta/` 双副本（10046B 相同） | **删根目录副本**，留 `_meta/_evaluation-2026-06-15.md` | 规范第 113-137 行规定治理文件在 `_meta` |
| 根 `hot.md`（8040B）vs `_staging/hot.md`（2411B） | **留根 `hot.md`**（README 第 517 行已引用 `[[hot]]`），删 `_staging/hot.md` 过期副本；规范补充说明 hot.md 是正式入口 | hot.md 是用户/Agent 导航入口 |
| `_meta/` 内 4 个 `synthesis-*.md` | → `_synthesis/` | 本质是跨域综合 |
| `_meta/` 内 3 个 `cheatsheet-*.md` | → `_meta/cheatsheets/`（新建子目录） | 速查表归治理子目录 |

#### 3.3.2 嵌套编号子目录处理

**`15_Agent_Production/`（旧 13）内部**：

| 旧 | 新 | 原因 |
|----|----|------|
| `16_Agent_Evaluation/` | `Agent_Evaluation/` | 去全局编号前缀，子主题非独立章节 |
| `23_OpenClaw_Ecosystem/` | `OpenClaw_Ecosystem/` | 同上 |

**`16_AI_Coding/`（旧 17）内部**：

| 旧 | 新 | 原因 |
|----|----|------|
| `01_Theory/` | `Theory/` | 统一主题命名 |
| `02_Tools/` | `Tools/` | 同上 |
| `03_Practice/` | `Practice/` | 同上 |
| `04_Methodology/` | `Methodology/` | 同上 |

### 3.4 迁移脚本设计（核心工程保障）

脚本路径：`_tools/restructure_2026.py`，幂等、可校验、分阶段。

#### 四阶段执行

```
Phase A: dry-run 预检
  - 解析完整映射表，统计受影响文件数
  - 输出 rename_plan.csv：旓名→新名→受影响 wikilink 数
  - 不做写操作，供人工 review

Phase B: 目录重命名（git mv，保留历史）
  - 顺序：先长路径（子目录），再短路径（顶层章节）
  - 每步 git mv 后立即 commit，生成可回滚检查点
  - _concepts/_synthesis/_references 重命名

Phase C: wikilink 与内链全量重写
  - 规则表（最长前缀优先，避免误伤）：
    "13_Agent_Production/16_Agent_Evaluation" → "15_Agent_Production/Agent_Evaluation"
    "13_Agent_Production/23_OpenClaw_Ecosystem" → "15_Agent_Production/OpenClaw_Ecosystem"
    "17_AI_Coding/01_Theory" → "16_AI_Coding/Theory"
    ... 嵌套规则 6 条 + 顶层规则 22 条
  - 只替换 wikilink [[]] 内和 markdown 链接 () 内的路径
  - 正文纯文本提及单独输出 review_list

Phase D: 校验
  - 运行 _tools/check_links.py 统计断链
  - 对比 dry-run 前后断链数（应 ≤ 迁移前）
  - 重生成 .manifest.json 和 index.md
  - 输出 verification_report.md
```

#### 关键安全机制

1. **git mv 保留完整历史**——`git log --follow` 可追溯。
2. **每章节一个 commit**——精确回滚粒度。
3. **dry-run 先行**——Phase A 输出计划表，review 后才执行 B/C。
4. **wikilink 边界匹配**——`(?<![A-Za-z0-9_])NN_Topic(?![A-Za-z0-9_])` 防御性正则。
5. **Web/src 三源文件 + fix_links.py + 文档**作为 Phase C 显式清单，单独处理。

#### 重命名顺序约束（避免冲突）

04↔05 对调是唯一的双向冲突点。处理方式：
- Step 1: `git mv 04_NLP_LLMs 04_NLP_LLMs.tmp`
- Step 2: `git mv 05_Computer_Vision 04_Computer_Vision`
- Step 3: `git mv 04_NLP_LLMs.tmp 05_NLP_LLMs`

其余映射均为单向（旧编号唯一指向新编号），无冲突。

### 3.5 配套文档更新清单

| 文件 | 更新内容 |
|------|----------|
| `_meta/_directory-conventions.md` | 重写第二、三、四节：新编号体系、6 层架构、`_` 前缀规则 |
| `README.md` | 章节导航表（296-334 行）、统计表（107-135 行）、所有内链 |
| `ROADMAP.md` | 引用的章节路径 |
| `index.md` | 自动重生成 |
| `hot.md` | 内部链接前缀 |
| `Web/src/data/docMap.ts`、`k8sEvalData.ts`、`TopicTagPanel.test.tsx` | 章节路径键 |
| `_tools/fix_links.py` | 硬编码章节列表 |
| `Web/public/mkdocs/` | `npm run build` 重建，不手改 481 HTML |

---

## 四、重构总览

| 变化类型 | 数量 | 风险 | 方式 |
|----------|------|------|------|
| 顶层章节重编号 | 14 个 | 中 | git mv + wikilink 脚本 |
| 嵌套子目录改名 | 6 个 | 低 | git mv + 局部 wikilink |
| 知识图谱层重命名 | 3 个 | 中 | git mv + 全量 wikilink |
| 去重删文件 | 2 个 | 低 | rm（已确认重复） |
| 错位文件归位 | 7 个 | 低 | git mv |
| wikilink 重写 | ~9,101 | 机械 | 脚本精确替换 |
| 源码硬编码更新 | 4 处 | 低 | 手动 |
| 生成产物重建 | 481 | 无 | npm run build |
| 文档同步 | 8 个 | 低 | 手动 |

**执行顺序**：dry-run 预检 → 知识图谱层重命名 → 顶层章节重编号（逐章 commit）→ 嵌套子目录改名 → wikilink 全量重写 → 去重归位 → 源码/文档更新 → Web 重建 → 校验断链 → 更新规范文档。

---

## 五、范围与非目标

### 5.1 本次范围内
- 顶层章节重编号（00–21 连续）
- 知识图谱层 `_` 前缀重命名
- 嵌套子目录去编号前缀
- 去重、归位、迁移脚本、wikilink 重写、文档同步

### 5.2 非目标（明确排除）
- **不**改变任何文档的正文内容（只改路径与链接）
- **不**合并/拆分 concepts/synthesis/references 的内部文件
- **不**重排 90–94 拓展辅助章节编号
- **不**重新设计 frontmatter、tag taxonomy 或 README 的营销文案
- **不**手改 `Web/public/mkdocs/` 生成产物（交给 npm build）

---

## 六、验收标准

1. ✅ 顶层章节编号连续 00–21，无缺口
2. ✅ `_meta/_directory-conventions.md` 反映新结构
3. ✅ 无重复文件（根目录与 _meta 无同名）
4. ✅ 13/17 内部子目录无全局编号前缀
5. ✅ concepts/synthesis/references 加 `_` 前缀
6. ✅ `check_links.py` 报告断链数 ≤ 迁移前
7. ✅ `.manifest.json` 与 `index.md` 重生成且路径正确
8. ✅ `Web/src/` 三个源文件路径键更新
9. ✅ README 章节导航表与实际目录一致
10. ✅ 每个章节重命名对应一个独立 commit，可回滚

---

## Related

- [[_directory-conventions]] — 现有目录规范（待重写）
- [[README]] — 项目主页（待更新章节导航）
- [[_project-evaluation]] — 项目评估报告
