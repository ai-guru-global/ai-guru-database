---
title: 目录重组计划 2026（四期迁移）
category: meta
tags: ["重组", "目录结构", "迁移", "计划"]
summary: "全库分布逻辑诊断与四期重组计划：只动散装层（166 篇）、三大高密链接区零位移；P1 专题研究目录收编、P2 资料与归档、P3 命名归一、P4 全量校验，每期独立 commit 可回滚。"
created: 2026-11-18
updated: 2026-11-18
tier: core
aliases: [目录重组计划, 重组计划, Restructure Plan]
sources: []
name_zh: "目录重组计划"
---

# 目录重组计划 2026（四期迁移）
> 中文简称：目录重组计划

> **一句话理解**: 主干（00–22 章节 + 概念图谱 + 治理）一个文件不动，只把顶层 10 个散装目录按"研究产出/运营资料"两类收编进两个新文件夹，全程约 48 处链接编辑、每期独立 commit 可回滚。

> **模块**：治理｜**性质**：结构变更计划（执行期逐期更新状态）｜**风险等级**：🔶 中高（批量移动）

---

## 1. 诊断：并存的四套组织逻辑

| 逻辑 | 载体 | 体量 | 状态 |
|------|------|------|------|
| 学习序（00→22 编号） | 24 个编号章节 | ~2,300 篇 | ✅ 稳定，不动 |
| 概念图谱（主题网） | `概念/` 12 大类 | 714 篇 | ✅ 稳定，与主干互链 1,875 处，不动 |
| 产业分层（五层栈） | `console/01–05` + 研判/证据层 | ~366 篇 | ✅ 独立子项目，不动 |
| 项目制/杂项（无规则） | 顶层 10 个散装目录 | ~166 篇 | ⚠️ 本次重组对象 |

**散装目录实测（2026-11-18）**：`DeepSeek_研究`(125)、`机构深度研究`(14)、`reports`(8)、`来源`(5)、`AI原生企业`(5)、`GTM`(3)、`归档`(2)、`docs`(2)、`assistant`(1)、`原始`(1，近乎空箱)。

**五个问题**：

1. 顶层噪音——10 个散装目录中 8 个不足 10 篇，却与 286 篇的 `12_架构基建` 平级
2. 命名无公约——`22-FDE`（连字符）应为 `22_FDE`；`DeepSeek 研究` 带空格；中英混杂
3. 内容混装——研究产出、运营资料、元文档、收件箱四种性质平铺同一层
4. 构建产物入内容库——`94_可视化/` 内含 `data.json`、`index.html`、`favicon.svg`
5. 两套产业分类并存——`console` 五层栈 vs `18_行业应用` 十九行业（分属不同产品，**本计划不动**）

## 2. 目标结构（只动散装层）

```
wiki/
├── 00_入门 … 22_FDE/  90_学习/ 94_可视化/    主干区（学习序，不动）
├── 概念/                                     图谱区（不动）
├── 治理/                                     规则区（不动）
├── 专题研究/                                  ← 新增，收编项目制研究（147 篇）
│   ├── DeepSeek_研究/        (125，P3 期已去空格)
│   ├── 机构深度研究/          (14)
│   ├── AI原生企业/            (5)
│   └── GTM/                   (3)
├── 归档/                                     (保留顶层：10+ skill 硬编码排除路径)
├── 原始/                                     (保留顶层：10+ skill 的 ingest 收件箱)
└── 资料与归档/                                 ← 新增，收编运营杂项（P2 期实收 4 目录）
    ├── reports/  来源/  docs/  assistant/
```

**原则**：`00–22 + 概念 + 治理` 三大高密链接区零位移；只重组低入链散装层。

**P2 期范围调整（2026-11-18 执行时发现，成本表漏检）**：`归档/` 与 `原始/` 被 10+ 个 wiki-* skill 以顶层路径硬编码（排除清单、`/wiki-ingest 原始/` 收件箱工作流），移动或删除需同步改 20+ 处 skill 契约——两目录保留顶层，列为后续「P5：skill 契约解耦」期候选。

## 3. 迁移成本（2026-11-18 路径级实测）

| 项 | 数量 | 依据 |
|----|------|------|
| 移动目录内出链待修 | 33 处 | 机构深度研究 18 + GTM 15（其余出链为 0） |
| 外部入链待修 | 9 处 | 来源 5 + assistant 2 + 机构深度研究 2 |
| mkdocs.yml 导航项 | 6 处 | 硬编码引用，须同批修改 |
| 前端/console/工具硬编码 | 0 | 已扫描确认 |
| manifest/.code-up 引用 | 0 | 已扫描确认 |

## 4. 分期执行

| 期 | 内容 | 校验 | 状态 |
|----|------|------|------|
| **P1** | `git mv` 4 研究目录 → `专题研究/`；修 33 出链 + 2 入链 + mkdocs 项；建新目录 README | `check_links.py` 零断链 + 独立 commit | ✅ 2026-11-18 |
| **P2** | `git mv` 4 运营目录 → `资料与归档/`（`归档/`、`原始/` 因 skill 耦合保留顶层）；修 7 入链 + build_index/query 脚本根定位 + mkdocs 5 项 + AGENTS 布局 | 同上 | ✅ 2026-11-18 |
| **P3** | 命名归一：`22-FDE`→`22_FDE`、`DeepSeek 研究`→`DeepSeek_研究` | 同上 + portal 再生成 golden 10/10 | ✅ 2026-11-18 |
| **P4** | 全量校验：`check_links.py --strict` + `wiki_health.py` + `gen_subdir_indexes.py` 重建 INDEX + mkdocs 构建冒烟 + 更新本文件状态 | 四项全绿 | ✅ 2026-11-18 |
| **P5**（追加期） | 方案 A 解耦：建 `治理/_meta/infra-dirs.json` 单一事实源；接线 check_wikilinks / build_portal / build_index 三工具；mkdocs 排除段加指引注释；17 个 skill 追加「路径权威」段 | 三工具加载值断言 + 门禁恰等基线 + portal 重建平价 | ✅ 2026-11-18 |

**回滚约定**：每期独立 commit，任一步 `git revert` 即还原；全程只移动、不删除。

## 5. 执行记录

- 2026-11-18：计划沉淀；P1 执行完毕——`git mv` 4 目录（147 篇）入 `专题研究/`，修复 33 处出链、2 处外部入链、42 处内部 wikilink 前缀、mkdocs.yml 4 项、portal 测试夹具 2 处（golden.json/build_portal.py，计划外发现）；新建专区 README 并补 wikilink 入链消孤立；`check_links.py` 移动相关断链 0（全库 974→973 为存量清零 1）、`link_gate.py` 四项指标均不高于基线。
- 2026-11-18：P2 执行完毕——`git mv` reports/来源/docs/assistant 入 `资料与归档/`；修复 8 文件 wikilink 入链（来源 5 + assistant 2 + 来源内部自引）、hot.md 3 处行内路径、`assistant/build_index.py` 与 `query.py` 根定位（`parents[2]`）+ 跳过集补 `资料与归档`、mkdocs 排除 5 项、根 AGENTS.md 布局段（含 P1 遗留）、新建专区 README + 入链；**范围调整**：`归档/`、`原始/` 因 10+ skill 顶层硬编码保留原位（成本表漏检，同 P1 portal 夹具类），列为 P5 候选。**工具随迁**：`check_wikilinks.py` 扫描排除规则由「仅顶层命中」改为「一级或二级路径命中」——`来源/`、`docs/` 迁入二级后仍延续「信源/规划稿只作链接目标、不作扫描源」的既定口径（否则其历史 frontmatter/间距/断链违规将一次性入账 +18）；门禁四项 1438/734/767/1047 全部恰等基线。
- 2026-11-18：P3 执行完毕——`git mv` `22-FDE`→`22_FDE`、`专题研究/DeepSeek 研究`→`DeepSeek_研究`；sed 全库 md（两旧名→新名）+ AGENTS.md + mkdocs 导航 + ai-guru-doc-style skill + build_portal golden 常量；`build_portal.py` 再生成 portal 数据（3978 条索引 / 37 分片 3819 页，覆盖校验 3819/3819，golden 10/10 含 `FDE`→`22_FDE/` 新路径）；旧分片 `wiki__22-FDE.js` 由生成器自动清除。**有意保留**：`.zcode/plans` 与 `console/研判/2026-11-09` 历史快照不改名，`console/data.local.js` 为 gitignore 本机产物。顺手修复 1 处存量断链（`22_FDE/03_交付方法论` 裸路径链接补 `./` 前缀，检查器按库根解析所致）。终检：源残留 0、`check_links` 相关断链 0、`link_gate` 四项 1438/734/767/1047 全绿。
- 2026-11-18：P4 执行完毕，**四期计划全部收官**——① `check_links --strict`：973（972 missing_file + 1 dir_reference，均存量，重组相关 0，较非严格仅 +1）；② `wiki_health`：corpus 孤立页 0，1 处存量 frontmatter 缺失（`治理/_meta/_synthesis-index-archive.md`）；③ `gen_subdir_indexes` 补建 1 个缺失自动索引（`10_部署推理/02_推理引擎/index.md`，38 文件导航）——其模板缺现行必备字段且含间距违规，已补齐 `category/summary/tier/name_zh`、跑 `fix_spacing` 修复、父 README 补 wikilink 入链消孤立；④ mkdocs 全量构建 exit 0（98.85s，仅存量锚点 INFO）；⑤ `link_gate` 四项 1438/734/767/1047 全部恰等基线。遗留（非本计划范围）：972 条存量断链以 90_学习 书籍外链为主，另有 P5（skill 契约解耦：归档/原始 顶层保留）候选。
- 2026-11-18：**P5 方案 A（解耦部分）执行完毕**——① 新建 `治理/_meta/infra-dirs.json` 单一事实源：10 个基建目录清单（含 placement/scan/portal/mkdocs 策略与保留理由）、5 组 `tool_lists`（三工具字面量清单）、`skill_couplings`（归档 10 + 原始 13 共 17 文件命中数）、`static_copies_not_wired`（mkdocs/smart_fix_links/check_links 陈旧 'docs'/8 个一次性脚本）与 `how_to_move` 五步迁移手册；② 接线三工具（加载失败回退同值默认，py_compile + 加载值断言全过）：`check_wikilinks.py`（ROOT_ONLY_SKIP + classify 首段集合）、`build_portal.py`（WIKI_EXCLUDE_DIRS/SUBDIRS）、`assistant/build_index.py`（ROOT_ONLY_SKIP）；③ `mkdocs.yml` 排除段上方加权威源指引注释（YAML 校验通过）；④ 17 个 skill 文件批量追加「路径权威」指引段（幂等，17/17）。**平价验证**：link_gate 四项恰等基线、portal 全量重建 golden 10/10 且 diff 仅 P4 新索引导致的合法 +1（3978→3979）。**范围外记录**：`归档/`、`原始/` 仍保留顶层（方案 C 结论不变，解耦后未来移动只需改 JSON + 静态副本）；提交时并行会话对 `check_wikilinks.py` 的在途别名索引改动（FRONTMATTER/`_split_alias_values` 等，编译与门禁均已验证）随文件一并入库并已在 commit message 标注，其 `link_gate.py`/基线/`pre-commit`/`.gitleaks.toml` 在途文件未纳入本提交。

---

*Last updated: 2026-11-18*
