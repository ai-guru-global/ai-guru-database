# HANDOFF.MD

> 执行新任务前先看本文件，避免重复踩坑；踩到新坑请追加。

## 坑

- **headless 测试 console 脚本不能用 `require`**：`console/data.js` 自带 `var DB = {}`，CommonJS require 后 DB 留在模块作用域，`global.DB` 拿不到。要用 `eval(fs.readFileSync(...))` 串联加载各脚本（与浏览器全局变量语义一致，脚本顺序见 `console/index.html` 底部）。
- **浏览器验证**：ZCode 内置浏览器技能依赖的 node REPL 工具不在会话中时，用上面的 eval 管线跑无头断言（提取目标函数源码 + 最小桩），数字口径与台内 `nodeStats` 完全一致。
- **侧栏不加 nodeStats 计数**：`buildNavTree` 有意不扫全库档案（见 app.js 内注释），新增侧栏链接不要顺手加实时计数。
- **大体量新 md 别放 docs/**：`build_console.py` 的 library 层对 docs/ 用 rglob 全量内嵌进 console/data.js（已 2.8MB）；独立知识库放 `wiki/`——主题只认 `_topics.md` 表格 + 主题目录顶层 `*.md`，validate/build 都不扫 wiki/ 子目录（2026-10-27 建 GPU高网设计 69 篇时验证过）。
- **并行子代理写大批文件会被限流打断**：8 个并发里 3 个报 Rate limit，但其中 2 个实际已把文件写完（报错发生在收尾汇报阶段）；重派前先 `find` 盘点实际落盘情况，只补真正缺失的批次，并发降到 2 稳定。
- **本机 grep 是 ugrep 别名**：中文长行上 `.{0,50}词.{0,90}` 有界重复报「exceeds complexity limits」；提取 md/json 长行上下文改用 `perl -ne 'while (/(.{0,50}词.{0,90})/g){...}'`。
- **批量建卡证据口径（2026-10-27 批 31 卡经验）**：时间线条目优先复用 `DB.archive`（4249 条）与大事记已有 aihot.news/官方 URL；2024 及更早的稳定事实可无 URL 裸条目（先例 AI芯片竞争.md）；证据不足的厂建「观察中」卡并显式写明证据缺口——台内宁可薄，不可编。
- **wiki/GPU高网设计 与台内已互链**：台内入口 `推理与基础设施/GPU高速网络.md`（证据时间线），改 wiki 不需要重建 data.js，改线索卡才需要 `make console`。

## 开源发布链路（2026-11-03 起）

- **产物分层**：`console/data.js`（台内）+ `data/*.json`（机器可读）+ `site/`（可抓取静态页）+ `docs/good-first-issues.md`（贡献队列）。前两者进 git，`site/` 是 Pages artifact 不入库。
- **生成命令**：`make dataset`（data + schema，含校验）、`make pages`（site，含 console 副本）、`make issues`（贡献队列）、`make mcp-test`、`make npm-test`。
- **不要手改** `data/`、`schema/`、`docs/good-first-issues.md`、`site/`；改源（md / chain.js / explain / deep）后重跑对应命令。
- **同源口径**：`build_dataset.py` 复用 `build_console.py` 的解析器；改解析规则只改 `build_console.py`，dataset 自动跟随。
- **chain.js 解析靠 Node**：`build_dataset.py` 用 `node -e` eval 手工策展 JS，需要 Node 20+；CI 的 `dataset.yml` 已装。
- **主题计数坑**：`parse_topics()` 只返回骨架，`count/clues` 必须在装配 clues 之后回填；`validate_dataset.py` 现在会校验「主题计数合计 = 线索总数」。
- **静态站链接**：`make pages-check` 检查 1000+ 内部链接；新增页面模板后必须跑。
- **发布前**：`docs/2026-11-v0.1-launch.md` 有旗舰文与各渠道文案；`docs/2026-11-开源发布计划.md` 是主计划与看板。
- **英文骨架**：`console/i18n-en.js` 是节点名/定义与主题定义的英文层；新增节点必须同步补，否则 `validate_dataset.py` 会报 warning。英文只做骨架，正文/证据仍为中文。
- **Issue 发布**：`make issues-publish ARGS="--kind thin --limit 5"` 默认 dry-run；`ARGS="--yes"` 才创建。标签需先按 `docs/labels.md` 建好，否则 `gh` 会因未知标签失败。
- **npm 类型**：`packages/ai-industry-graph/index.d.ts` 与 `index.js` 手动同步；新增导出要两边一起改。
- **新增节点是五件套**：chain.js（含 stack tiers 映射与两处「全部 N 节点」口径）→ i18n-en.js → explain-l<N>.js → deep-l<N>.js → PRODUCT/README/_topics 的节点数；漏一件则 validate_dataset 报 warning 或数据集英文层/六层解释缺空。
- **两场会话并行改仓库是常态**：动手前先 `git status` + `git diff --stat` 看对方进度（chain.js/覆盖面板/发布链路曾被并行会话一次做完），避免重做或覆盖。

## 目录即行业重构（2026-11-04 起）

- **根目录 01..05 五层目录树是产品本体**（用户指令：打开目录就是在读行业，不要台账视角）；18 主题证据卡整体迁入 `证据层/<主题>/`，`build_console.py`（`ROOT/"证据层"/t["key"]`）与 `validate.py`（扫 `证据层/`）已同步改路径。
- **`make tree`（tools/scripts/build_tree.py）合成目录树**：源 = chain.js + explain-l* + deep-l* + 证据层线索；**层/节点 `_index.md` 每次重新生成（装配产物，勿手改）**；叶子学习页只在不存在时生成，落地后手工维护，`--force` 才覆盖。
- **跨领域卡叶子归位走 OVERRIDES 表**（脚本头部）：关键词最优分配会被大节点吸走（GPU高速网络曾挂到 GPU 节点），策展性归属显式登记；改 chain keywords 或新增卡后按需补表。
- **全量重生成 runbook**（改动归属/修脚本后）：`find 0* -name "_index.md" -delete && find 0* -name "*.md" ! -name "_index.md" ! -path "*高网设计*" -delete && make tree`（仅限机器生成批次未手工润色前；手工内容落地后禁用）。
- **深潜子库在节点目录下**（`01-算力与硬件层/09-网络与光互连/高网设计/`，自 wiki/ 迁入）：脚本不扫描，跨目录链接以子库深度（根/3 层）计算 `../../../`；模板与规范在 `docs/深潜库模板/` + `docs/知识库模板.md`。
- 节点页上下游跨层链接由 build_tree 的 `nlink()` 解析（同层 `../NN-`，跨层 `../../0N-层/NN-`），手工改 `_index` 时别退回单层相对路径。
- **主题路径散布在多个脚本，迁移要全量 grep**：2026-11-06 跑 runbook 时发现 build_dataset.py（`ROOT / t["key"]`，症状是 clues.json 清零、事件/核验链接 208 处误报）与 validate.py（双链 `(ROOT/target)`，症状 123 条误报断链）两处漏改——已补 `证据层/` 前缀；判据：`grep -rn 'ROOT / t\["key"\]\|ROOT / target' tools/scripts/` 应零命中。
- **npm 包数据副本不随 dataset 自动更新**：`packages/ai-industry-graph/data/` 是打包快照，改 data/ 后要跑 `node packages/ai-industry-graph/scripts/sync-data.mjs` 再 `make npm-test`（症状：test 报旧节点数，如 69≠71）。**加线索同理**：96 线索 ≠ 包内 95 时也要 sync。
- **相对链接深度按「文件所在目录到仓库根」数**：深度 2 目录（如 `01-x/0N-节点/叶子.md`）用 `../../`，深度 3（深潜库顶层 README/行业拆解/时间线）用 `../../../`，深潜库知识点层（深度 4）用 `../../../../`。2026-11-06 发现 `02-自研 ASIC 与 TPU/平头哥.md` 下钻区曾误用 `../../../`（深度 3 口径套深度 2 目录，GitHub 上会 404），已修——写跨目录链接前先数层级，别照抄相邻文件的错例；批量写新页后用脚本对全部相对链接跑存在性检查（真武PPU拆解 15 篇已验证 0 断链）。
- **手写时间线条目没有实测取得的 URL 就不许挂链接**：搜索摘要给的 outlet 名只能写进「来源：」文本行，条目标 ⚠️/🔍 需一手源（先例：神州数码卡 2026-09-30 灵果上线、FY2025 年报两条）；URL 只允许来自本会话实际 fetch/搜索结果里带出的地址。
- **人力规模类数字只用年报「员工情况」章节口径**：第三方行情站口径能差 2 倍+（京北方：moomoo 13,614 人 vs 年报 31,278 人）；人均创收这类派生指标必须用年报人数算，双口径冲突时显式写「不采」并注明原因。
- **SPA 官网取证套路（WebFetch 拿到空壳时）**：browser-use 渲染后依次做三件事——① `domSnapshot()` 拿可见文案；② `evaluate` 遍历 `performance.getEntriesByType("resource")` 里的 JS 资源、`fetch` 回来正则提 `path:"/…"` 路由表（一次拿到真实信息架构，比点导航快）；③ 同法扫公司名/ICP备/上游模型痕迹（先例：纽扣AI 卡，路由表暴露 brokerage-logs 分销与 BYOK 结构）。注意路由字符串是命名推断时要标 ⚠️，登录墙内的数据只登记「存在」不编内容。
- **新卡先看 make tree 的默认挂叶再决定是否补 OVERRIDES**：神州数码卡关键词默认挂到 `05-交付与实施（FDE）`，与交付主题身份一致，无需登记；跨领域卡才需要（见上方 OVERRIDES 条）。
