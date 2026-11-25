---
title: AI Guru 仓库聚合与门禁评估（2026-11-18）
category: meta
tags: ["repo-aggregation", "governance", "gate", "maintenance"]
summary: "评估 ai-guru-global 下各仓库并入 ai-guru-database 的可行性与优先级，并实测评估现有 wiki 门禁的合理性与改造项。"
created: 2026-11-18
updated: 2026-11-18
tier: core
aliases: ["Repo Aggregation 2026-11"]
sources: []
name_zh: "仓库聚合与门禁评估"
---

# AI Guru 仓库聚合与门禁评估

> 中文简称：仓库聚合与门禁评估

> **一句话理解**：内容型仓库可以合并进知识库，但现有门禁只防「总量回退」、不防「新增违规」，且漏检 markdown 链接与 aliases；合并前必须先补 changed-only 门禁、统一口径和导入流水线。

- 评估日期：2026-11-18
- 评估范围：`/Users/allengaller/Documents/GitHub/ai-guru-global/` 下 13 个 git 仓库（`ai-guru-console` 为空目录）
- 文档定位：跨仓库规划稿，暂放仓库外；确认后可迁入 `ai-guru-database/wiki/治理/`
- 实测环境：macOS arm64，Python 3.12，`ai-guru-database` 工作区

---

## 0. 结论摘要

| 问题 | 结论 |
|---|---|
| 哪些仓库该合并 | 4 个直接合并、2 个可选、4 个保留独立、3 个归档/清理；活跃仓库可从 13 个收敛到 5 个 |
| 现有门禁是否合理 | **骨架合理，但不充分**。ratchet 基线 + pre-commit/CI 双端执行是正确的；作为聚合前置门禁存在 4 个结构性缺口 |
| 是否需要更新 | **需要**。优先补：changed-only 零新增、markdown 链接与 aliases 覆盖、发布/暂存/归档三区口径、导入批次配额 |
| 合并会不会被门禁挡住 | **会**。3 个内容仓库约 396 页，按现状导入会新增约 396 条 frontmatter 缺失、300+ 孤立页，门禁立即失败 |

---

# 第一部分 · 仓库聚合评估

## 1.1 判定标准

1. **是否内容型**：纯 Markdown / 静态文档优先合并；有独立发布物的不合。
2. **是否有分发链**：PyPI、npm、Go release、独立 MCP 服务等保持独立，合并只会把 CI/发布成本搬进来。
3. **是否与 wiki 同域**：与知识库主题重叠、且 wiki 有对应章节的优先合并。
4. **活跃度与体量**：长期无提交的仓库优先归档；应用型仓库只移内容、不动 `node_modules`/构建产物。
5. **是否依赖独立 URL/品牌**：awesome list、对外 demo 站要保留曝光价值，单独权衡。

## 1.2 总表

| 仓库 | 类型 / 体量 | 最近提交 | 与 wiki 关系 | 建议 |
|---|---|---|---|---|
| the-ops-agent-book | VitePress 书，44 页；git 1.4M | 11-12 | wiki `13_运维` 52 页已有基础 | **合并** |
| mechanic-romance | 具身语料，222 md（184 语料）；git 2.4M | 10-06 | wiki 具身仅 10 页，几乎是空白 | **合并** |
| open-point | Node CLI + MCP 知识点引擎；28 commits | 10-06 | 与 database 本体目标一致 | **合并** |
| beidiao-skills | 16 个企微/微信读书技能；2 commits | 10-29 | database 已有 `skills/` 39 个技能 | **合并** |
| open-geo | Awesome 榜单，130 md + console + 4 套 CI | 10-25 | wiki 无 GEO 内容 | 可选 |
| agent-landing | Agent Atlas SPA，数据 336K；2 commits | 11-10 | 与 `15_智能体` 同类，但 55 个文件未提交 | 可选 |
| deepdig | PyPI + MCP + 独立站点 | 10-29 | 无 | 保留 |
| resolve-agent | Go 平台，219 commits，releases/e2e | 11-16 | 无 | 保留 |
| fde-scope | Python 包，166 commits，release | 11-10 | wiki `22_FDE` 已承担知识面 | 保留 |
| agent-up | 私有 monorepo 产品，129 commits | 10-30 | 无 | 保留 |
| sentio | Next.js 原型，10 commits，无部署 | 10-06 | 无 | 归档 |
| cloudmanhq.github.io | 4 个文件，Jekyll | 2024-05 | 无 | 归档 |
| ai-guru-console | 空目录（仅 `.shell-cwd-placeholder`） | — | 内容已在 `database/console` | 直接删 |

## 1.3 第一档：直接合并（4 个）

### the-ops-agent-book

- 纯文档、无外部分发、仅 6 次提交；44 篇 md（guide 14 / playbooks 6 / vendors 8 / templates 8 / appendix 6）。
- 迁入 `wiki/13_运维/` 作为子系列（或 `专题研究/运维 Agent`），复用 `wiki-import` / `fix_spacing.py` / `link_gate.py` 过门禁。
- 代价：丢失 IBM 蓝白 VitePress 主题；旧 Pages 路径失效，需归档仓保留重定向。
- 工作量：0.5–1 天。

### mechanic-romance

- 184 篇具身语料 + 28 篇论文笔记 + demo 场景；36 次提交；无 CI。
- 这是价值最高的合并对象——wiki 具身板块目前只有 10 页。
- 迁入 `wiki/06_强化学习/05_机器人与具身智能/` 做语料子库；demo prompts 可放 `90_学习/` 或 `资料与归档/`。
- 主要成本：批量补 frontmatter、把相对 md 链接转 wikilink、建入链；工作量 2–3 天。
- 注意：仓库自述 license 为 `research-corpus`，合并前确认许可证兼容性。

### open-point

- 「把长文档解构为原子知识点」的 CLI + MCP，与 database 是天然上下游；未发布 npm（v0.1.0，无 publish 工作流）。
- 移入 `code/工具/openpoint/`，测试并入 database CI；工作量约半天。

### beidiao-skills

- 16 个 `wecomcli-*` + `weread` 技能，2 次提交，2.9M。
- database 的 `skills/` 已是第一公民（`.claude/skills` 软链到它），并入后只保留一个技能发现路径；工作量约半天。
- 若这些技能要独立分发给外部用户，可保留公开仓作为镜像；否则直接归档。

## 1.4 第二档：可选合并（2 个）

### open-geo

- 内容（docs + resources）值得收进 `专题研究/GEO`，但它是 awesome list，有对外 PR/曝光价值和 4 套独立 CI（awesome-lint / link-check / deploy-pages / ci）。
- 若不在乎榜单身份：迁内容、删 console、归档仓库。若在乎：保留独立仓，仅把核心方法论页同步进 wiki。

### agent-landing（Agent Atlas）

- 2 次提交，但当前有 55 个未提交改动，必须先 commit 再谈迁移。
- 310 个 Agent 条目、65 家厂商的数据是资产；建议把数据并入 `wiki/15_智能体`（或作为 database 的第三个子应用），避免再维护一个 Vite 应用。
- 若保留应用形态：合并后需在 Pages 工作流里增加一条子路径构建，database CI 会变重。
- 工作量：1–2 天。

## 1.5 保留独立的 4 个

| 仓库 | 保留理由 |
|---|---|
| deepdig | PyPI 发布 + MCP 服务 + 独立配置站点；合并会绑死发布链 |
| resolve-agent | Go 生产级平台，219 commits，release/CodeQL/e2e 三套流水线 |
| fde-scope | Python 包 + release；wiki `22_FDE` 已承担知识面，做交叉链接即可 |
| agent-up | 私有 monorepo 产品，129 commits，独立 CI/构建 |

判断原则：**合并不消灭 CI，只搬运 CI**。把这 4 个搬进 3.7G 的知识库仓库，只会让 database 的 CI 同时承担 Node/Go/Python 三套工具链。

## 1.6 归档 / 清理（3 个）

- **sentio**：10-06 后无提交、无部署工作流、Next.js 原型；建议 GitHub Archive，理念可摘 1 页进 wiki。
- **cloudmanhq.github.io**：2024-05 的 4 文件仓库，无维护价值；`cloudman-mindmap.md` 如仍有价值可先迁再归档。
- **ai-guru-console**：空壳目录，内容早已在 `ai-guru-database/console/`；直接删除。

## 1.7 合并的硬约束

1. **体积**：database 已 3.7G（`.git` 927M + `code/原始` 754M + `code/前端应用` 777M + `wiki` 128M）。待合并内容仓 git 均在 3M 以内，安全；勿合并 0.7–1.5G 的应用目录。
2. **门禁**：wiki 全库受 frontmatter、断链、孤立页、间距门禁约束，约 450 页迁移是主要成本（见第二部分）。
3. **URL**：`ai-guru-global.github.io/<repo>/` 会失效；归档仓留重定向页，或在数据库站点做路径映射。

---

# 第二部分 · 门禁评估

## 2.1 门禁组成（实测）

| 位置 | 内容 | 触发条件 |
|---|---|---|
| `.githooks/pre-commit` | 拦截同步垃圾文件；暂存区含 `.md` 时跑 `link_gate.py` | 本地 commit |
| `.github/workflows/link-health.yml` | `link_gate.py` | push main / pull_request |
| `.github/workflows/deploy-pages.yml` | mkdocs build + `tsc --noEmit` + vite build | push main |
| `.github/workflows/secret-scan.yml` | gitleaks，默认只扫新增提交 | push / 手动 |

`link_gate.py` 四项指标，相对 `wiki/治理/_meta/link-health-baseline.json` **只许下降、不许上升**：

1. wikilink 断链数（`check_wikilinks.py` 口径）
2. 孤立页数（无任何 wikilink 入链，排除 README/index）
3. frontmatter 不完整数（缺 title/category/tags/summary/created/updated/tier/name_zh 之一）
4. 中英间距违规数（`fix_spacing.py` 差分）

## 2.2 实测数据（2026-11-18）

```text
✅ 断链：1438 / 基线 1438
✅ 孤立页：734 / 基线 734
✅ frontmatter 缺失：767 / 基线 767
✅ 中英间距：1047 / 基线 1047
✅ 门禁通过（断链率 5.2%，总 wikilink 约 27843）
运行耗时：3.7 秒（扫描 3331 篇 md）
```

| 指标 | 实测 | 占扫描页比例 | 备注 |
|---|---|---|---|
| 扫描页数 | 3331（全库 3340） | — | 排除 `来源/归档/docs` 等扫描源 |
| 断链 | 1438 次 / 唯一目标约 500 | 5.2% | 基线元数据仍写 24959 链接 / 530 目标，已过期 |
| 孤立页 | 734 | 22.0% | 仅统计 wikilink 入链 |
| frontmatter 不完整 | 767 | 23.0% | 其中 203 篇完全无 frontmatter |
| 中英间距违规 | 1047 | 31.4% | 均为「跑一次 fix_spacing 即可修复」 |
| 正文契约缺失 | 中文简称 246 / 一句话理解 1915 / 页脚 2267 | 7% / 57% / 68% | **门禁未检查** |
| 内部 markdown 链接 | 3593 条 | — | **门禁未检查**；`check_links.py` 报 972 条断链 |
| 重复 basename | 83 组 / 911 文件 | — | readme 337、index 318，另有 28 个 `01_关于` |
| 断链中可被 aliases 命中 | 368 / 500 唯一目标 | 74% | 门禁不解析 `aliases:`，与 Obsidian 语义不一致 |

对照 `wiki/治理/Quality_Metrics.md` 的自定目标：

- 一致性目标 ≥ 95%，实际 frontmatter 完整率约 77%；
- 连通性目标「无孤立文件」，实际 734；
- 平均 8.4 links/file，达到「≥ 3」目标。

## 2.3 设计上合理的部分（保留）

1. **ratchet 基线**：对 3000+ 页的历史库是正确的工程选择。全量严格模式会立刻冻结所有内容工作。
2. **跨平台正确性**：`exists_exact()` 逐组件精确匹配，消除 macOS 大小写不敏感与 Linux 判断链的漂移。
3. **零漂移实现**：`runpy` 复用巡检与修复脚本函数，而不是复制一套规则。
4. **性能可接受**：全库 3.7 秒，pre-commit 可用。
5. **双端执行**：pre-commit + PR CI 双重拦截，绕过本地钩子也会被 CI 挡住。
6. **基线入库且只降不升**：`--update-baseline` 只能写入通过的值，无法通过脚本抬高基线。
7. **gitleaks 只扫新增**：对 2000+ 文件的历史库是务实选择。

## 2.4 问题清单

### P0-1　只卡「净增量」，不卡「新增违规」

现状：门禁比较全库总数与基线，**一个新 PR 只要不再新增净违规就能通过**。例如：

- 修掉 10 条旧断链、同时新增 5 条新断链 → 总数下降 → 通过；
- 删掉 50 个孤立页 → 孤立数下降 → 通过（与「只增不减」治理原则冲突）。

影响：质量不会随工作量增长而收敛，只会随「净差」波动；聚合时也无法定位是哪一批导入引入的债务。

**建议**：增加 `link_gate.py --changed-only`：

- 取 `git diff --name-only --diff-filter=AMR` + `git ls-files --others --exclude-standard`；
- 对新增/修改的 `.md` **零容忍**：断链 0、间距 0、frontmatter 完整；
- 全局 ratchet 保留作兜底；
- 删除页需提交清单（或加页数下限），避免用删除刷指标。

**落地状态（2026-11-18）**：已实现 `--changed-only`，支持 `--staged`（pre-commit 读索引）、`--base REF...HEAD`（CI）与工作区三种范围；已接入 `.githooks/pre-commit`，全库 ratchet 保留。顺带修正孤立页口径：README/INDEX 导航页因未去 `.md` 扩展名被误计 441 个，孤立基线 734→294。

### P0-2　门禁只覆盖 wikilink，漏掉 markdown 链接与 aliases

现状：

- CI 只跑 wikilink；3593 条内部 markdown 链接不在门禁内，`check_links.py` 已报 972 条断链；
- `check_wikilinks.py` 不解析 frontmatter `aliases:`，而 Obsidian 支持别名链接。实测 500 个唯一断链目标中 368 个能被 aliases 命中；
- 同一原因导致**孤立页高估**：只被 alias 链接引用的页面会被计为孤立。

影响：门禁数字既漏报（md 链接）又误报（aliases）；聚合导入的文档若使用别名链接，会被直接判死。

**建议**：

- 把 `check_links.py` 的 md 链接与 alias 解析并入 `link_gate.py`（或抽成单一 resolver 库，两个脚本都引用它）；
- 对 changed-only 模式启用 alias 解析；
- 抽样 20 条「别名命中」链接人工确认 Obsidian 行为，再决定是否全量纳入。

**落地状态（2026-11-18，alias 部分）**：alias 解析已并入 `check_wikilinks.py`（`parse_aliases / build_alias_index / alias_candidates`），`link_gate.py` 全文 ratchet 与 `--changed-only` 共用同一口径，`--staged` 读取索引内容。按 `check_links.py` 既有 basename 兜底语义全量纳入：alias 兜底 1112 次（裸别名 141 / 带路径 971），断链 1438→326（唯一目标 495→127），孤立页 294→257，基线已收紧。带路径命中在全局输出单独计数，便于后续清理为现行路径。**md 链接门禁仍未接入，留待 P1。**

### P0-3　发布 / 暂存 / 归档三区口径不一致

现状：

- `链接扫描源` 跳过一级/二级目录含 `来源 / 归档 / docs` 的页面；
- 但 `wiki/原始/`（ingest inbox）不在跳过集，当前虽为空，语义上却是「未处理草稿也要过门禁」；
- `mkdocs.yml` 排除 `原始/**、归档/**、资料与归档/来源/**`；
- 前端 copy-docs 又是另一套范围。

影响：导入 450 页时，没有明确的「先落哪里、哪里算发布」规则；放 `资料与归档/来源/` 可绕过门禁，但站点不可见，等于假入库。

**建议**：在 `wiki/治理/` 定义单一 `zones.json`（或 yaml）：

```yaml
published: [wiki/**]            # 站点可见 + 全量门禁
staging:   [wiki/原始/**, wiki/资料与归档/来源/**]  # 站点不可见 + 仅格式检查
archive:   [wiki/归档/**]       # 冻结，不检查
```

由 `link_gate.py`、`mkdocs.yml`、前端 `copy-docs.js` 共同消费，消除三套口径。

### P0-4　没有导入批次机制，基线无法吸收合并

现状：门禁按全库净差判定，没有「这批导入允许临时欠账」的概念。

按现状合并三个内容仓的即时影响：

| 来源 | 新增页 | 新增 frontmatter 缺失 | 新增孤立页（估） |
|---|---|---|---|
| the-ops-agent-book | 44 | +44（仅 title/description） | ~20–40（相对 md 链接不计入链） |
| mechanic-romance | 222 | +222（完全无 frontmatter） | ~180 |
| open-geo | 130 | +130（id/title/order/description） | ~60–100 |
| **合计** | **~396** | **~396** | **~300+** |

基线会从 767 → 1163、734 → 1000+，门禁直接失败。

**建议**：加 `wiki/治理/_meta/import-batches/<batch>.json`：

```json
{
  "batch": "mechanic-romance",
  "created": "2026-11-20",
  "expires": "2026-12-20",
  "allowed_delta": {"frontmatter_incomplete": 90, "orphan_count": 60},
  "note": "分批导入，每周收紧一次"
}
```

门禁读取未过期批次并扣减允许增量；到期自动失效。比一次性抬高基线更可控，也留下审计轨迹。

### P1-1　基线没有收敛机制

现状：`--update-baseline` 只能人工手动跑，没有定时任务、没有季度目标；23% frontmatter 欠账可以无限期存在。

**建议**：

- 每月定时工作流跑 `link_gate.py --update-baseline` 并自动开 PR（指标不变时无 diff）；
- 在基线文件增加 `targets` 字段（如 Q1 末 frontmatter 缺失 ≤ 300、孤立 ≤ 400、断链率 ≤ 2%）；
- 每周生成债务报告（按目录聚合），让新增债务可见。

### P1-2　frontmatter 只查「键存在」，不查「值正确」

现状：`FIELD` 正则只看键名，以下都不校验：

- `tier` 是否为 `core/supporting/peripheral`；
- `category` 是否在允许集合；
- 日期是否 ISO 格式、`created` 是否晚于 `updated`；
- `tags` 是否为列表；
- `name_zh` 是否与正文 `> 中文简称：` 一致；
- 修改页面时 `updated` 是否真的更新（AGENTS.md 声称「review gate checks this」，实际没有）。

**建议**：changed-only 模式下做值校验 + `updated` 与 git 修改时间比对；存量只报告不阻断。

### P1-3　孤立页口径不完整 + 重复 basename 歧义

- 孤立页只统计 wikilink 入链，markdown 链接不算；mechanic-romance 这类相对链接文档导入后会全部变「孤儿」。
- 83 组重复 basename（911 文件）中，`check_wikilinks.build_indexes()` 排序后取第一个匹配，入链只记到其中一篇，其余篇被误判孤儿。

**建议**：解析入链时同时统计 md 链接；对重复 basename 生成报告，changed-only 模式下要求歧义链接使用全路径。

### P1-4　代码侧没有 PR 门禁

现状：

- Python 工具只有 1 个测试文件，CI 不跑 pytest；
- 前端 `tsc` 只在 main 的部署工作流跑，PR 不跑 lint/vitest/playwright；
- gitleaks 只挂 `push`，不挂 `pull_request`（fork PR 不扫）。

**建议**：增加 `ci.yml`（PR 触发）：`pytest`、`eslint --max-warnings 0`、`vitest run`、`tsc --noEmit`；gitleaks 增加 `pull_request`。

### P2　文档与实现漂移

- `AGENTS.md` 仍写「~2,100 Markdown / 19.6M 字符」「2,700+ 已合规」「name_zh 2,742 页」，实测 3331 扫描页、frontmatter 缺失 767、name_zh 缺失 209。
- `Quality_Metrics.md` 以 2,826 文件为口径，称门禁三项，实际四项。
- 基线 JSON 的 `total_links: 24959` 与实测 27843 不符。
- `AGENTS.md` 把「中文简称 / 一句话理解 / 页脚 / ≥2 出链」写成 mandatory，但门禁并不检查（实际缺失 246 / 1915 / 2267）。

**建议**：要么在 changed-only 门禁里实现这些正文契约，要么把文档措辞降级为「推荐」并列入债务清单。不要让「强制」只停留在文字上。

## 2.5 建议的目标形态

```text
第一层 · 存量 ratchet（保留）
  全库四项指标 ≤ 基线；月度自动收紧 + 季度目标

第二层 · 变更门禁（新增，P0）
  新增/修改文件：断链 0 / 间距 0 / frontmatter 完整且合法 / md 链接有效 / alias 可解析 / 歧义 basename 用全路径
  删除文件：清单或页数下限

第三层 · 导入批次（新增，P0）
  import-batches/<batch>.json 限定临时欠账与到期日
  到期自动失效，债务必须被消化
```

配套单一 resolver 库，`check_links.py`、`check_wikilinks.py`、`link_gate.py` 共用，消除两套断链口径（当前 1438 vs 972）。

---

# 第三部分 · 合并与门禁联动

## 3.1 推荐的导入流水线

1. **落暂存区**：外部仓库内容先放 `wiki/原始/<repo>/`（站点不可见、仅格式检查）。
2. **结构映射**：确定目标章节与编号（如 `13_运维/07_运维Agent手册/`），建章节 `README.md` / `INDEX.md` 作为入链 hub。
3. **frontmatter 自动补齐**：从源文档 `title/description` 映射 `title/summary`，按章节填 `category/tier`，`created/updated` 取源仓库 git 日期，`name_zh` 取中文标题。
4. **链接转换**：相对 md 链接 → wikilink；重名 basename 用全路径；alias 保留并登记。
5. **入链与导航**：每页至少 1 条来自 hub 的入链；章节挂到上级 README。
6. **过门禁**：`fix_spacing.py` → `link_gate.py --changed-only` → 全库 ratchet → PR 审查。

## 3.2 工作量的真实分布

| 工作 | 占比 | 说明 |
|---|---|---|
| 搬文件 | ~10% | 目录结构简单 |
| frontmatter 补齐 | ~35% | 396 页，可脚本化 70% |
| 链接转换与入链 | ~40% | 最大头；决定孤立页与断链 |
| 主题合并/去重 | ~15% | 与 wiki 既有页面的分工声明 |

## 3.3 建议执行顺序

1. **第 0 周**：补 P0-1（changed-only）、P0-3（zones）、P0-2（md 链接 + alias）——没有这三项，后面每批导入都在和门禁对抗。
2. **第 1 周**：合并 open-point + beidiao-skills（零内容债，当天可完成）。
3. **第 2 周**：合并 the-ops-agent-book（44 页，验证导入流水线）。
4. **第 3–4 周**：合并 mechanic-romance（222 页，分 3 批，每批建 import-batch）。
5. **随时**：归档 sentio / cloudmanhq / ai-guru-console。
6. **再评估**：open-geo、agent-landing（先提交 agent-landing 的 55 个未提交改动）。

---

# 附录 · 实测命令与原始数据

```bash
# 门禁现状
python3 code/工具/link_gate.py

# 断链分类巡检
python3 code/工具/check_wikilinks.py

# 合并口径（wikilink + md 链接）
python3 code/工具/check_links.py

# 间距自动修复
python3 code/工具/fix_spacing.py
```

关键实测数字：

```text
link_gate: 断链 1438 / 孤立 734 / frontmatter 767 / 间距 1047（全绿，3.7s，3331 页）
frontmatter 缺字段分布: category 608、summary 625、tier 626、updated 356、tags 341、created 307、name_zh 209、title 206
正文契约缺失: 中文简称 246、一句话理解 1915、Last updated 页脚 2267
check_links: wikilink 27548 + 内部 md 链接 3593，断链 972（非 strict，含 alias 解析）
重复 basename: 83 组 / 911 文件（readme 337、index 318、01_关于 28、04_名言 18）
断链目标中 alias 可命中: 368 / 500 唯一目标
数据库体积: 3.7G（.git 927M、code/原始 754M、code/前端应用 777M、wiki 128M、release 51M、console 45M）
```

## Related

- [[治理/KNOWN_ISSUES]] —— 评估驱动的改造项全部登记于此（ISS-101~111）
- [[治理/Quality_Metrics]] —— 门禁十一项基线口径与 targets
- [[治理/_meta/import-batches/README|导入批次授权]] —— A4 等批量导入的债务额度机制
- [[治理/Content_Governance]] —— 只增不减与审核流程

---

*Last updated: 2026-11-18*（2026-11-25 落库 wiki/治理；P0/P1-2 改造项已落地，落地状态见各处 KNOWN_ISSUES 与 Quality_Metrics 口径声明）
