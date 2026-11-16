# HANDOFF.MD — 踩坑记录

> 供后续 Agent 会话接手时先读，避免重复踩坑。按最新在前追加。

## 2026-11-12 · 机构拆解全面补齐批次（88 卡批量生产 + 收尾集成）

- **批量卡时间线必须机械重排**：19 波 subagent 写的 88 张卡，「月内最新在上」纪律约六成违反（45 处月内乱序 + 2 处月间乱序）。修法：python 脚本按 `## 时间线` → `### YYYY-MM` → `- **` 条目三级切分重排（月-only 条目沉月末尾）。**第一版漏了 `reverse=True`，把原本正确的倒序排成正序、越修越糟（49→149 错）**——重排脚本必须先在 1 个文件上验证方向，且天然幂等可重跑。已全绿。
- **validate.py 双链解析对点号线索名有存量 bug（已修）**：`with_suffix(".md")` 会把 `Resolve.ai`/`Shoreline.io` 的 `.ai`/`.io` 当后缀剥掉 → 误报断链。已改为 `target + ".md"` 追加式。以后公司名带点号（域名式命名）直接建卡即可。
- **大批量挂叶后 OVERRIDES 要全量审查而非抽查**：88 张卡默认挂叶约三分之一被正文关键词吸走（美团→开源权重、BIS→GPU、CoreWeave→成本单位经济…）。先 `find 0* -name "*.md" -newer` 列全量挂点 → 人眼过一遍身份级错挂 → 批量登记 OVERRIDES（本批 +48 条，累计 62）→ 删旧叶重跑 `make tree`。抽样检查会漏。
- **players.js note 批量重算脚本**：88 家 note 更新用 node 脚本跑 playerStats 口径（roles 含本名或别名精确匹配 clue.alias），基于 make console 后的 data.js；`src.split(old).join(neu)` 全局替换（JSON.stringify 做锚），别用 `p.note = ...` 后直接写回（会改内存不改盘）。
- **限流中断恢复纪律再次生效**：两次 5 小时限流 + 一次 API 网络瞬断，均按「先 ls 盘点磁盘实际状态再补派」零重做（Rokid 报错前已写完、Duolingo 补派时才真缺）。API 瞬断（ENOTFOUND/EADDRNOTAVAIL）等 1-2 分钟重试即可。
- **search 配额耗尽后的替代通道优先级**（本批 88 卡全程实战验证）：SEC EDGAR / HKEX 披露易 / 巨潮 / Federal Register 直连 > 公司官网 newsroom > GitHub API / arXiv > 东方财富接口 > 搜狗结果页。WebSearch 配额约一周窗口，大批量前先打满一轮测试配额水位。
- 产物：187 线索（+88）/ 5 层 71 节点 / data.js 4.6MB / dataset v2026.11 / npm 187 clues 全绿；台账 `console/研判/2026-11-11-机构拆解全面补齐台账.md`（已标记完成）。

## 2026-11-10 · console × wiki 联邦制启动（实体登记表 + 高网映射表）

- **两库融合不走物理合并**：评估结论（`console/研判/2026-11-09-console与wiki语料融合评估.md`）是联邦制——骨架文件 `wiki/治理/实体登记表.md`（跨库实体互认 + SSOT 声明，准入纪律=只登记两边都有专页的实体）与 `wiki/治理/高网内容映射表.md`（高网三套 38 对知识点配对，归一候选 22 待 P2 逐对裁决）。**后续任何人想「合并/搬迁」两库内容前必须先读这两份文件**；新增跨库内容先查登记表定落点。
- **表格内 `\|` 转义 wikilink：check_links.py 实测不误报**（2026-11-09 条目留的疑问已闭环）；自写校验脚本仍需 `.rstrip('\\')`。
- **vault 外（console/）引用一律用反引号文字路径，不用 md 相对链接**：Obsidian 对 vault 外相对链接不可靠，且可避免链接校验器对 ../ 出库路径的未知行为；写完用 `(Path(文件).parent / 路径).resolve().exists()` 验证存在性。
- **增量断链核对法**：改 wiki 前后各跑 `check_links.py --json f.json`，broken_list 按 source 归因——总数字会随并行会话漂移（本次 973→975→973，+2 是自己引用的未建文件，建完即平），只看绝对数会误判。
- console 深潜库（01..05 树下）README 改动不影响 build_console/validate（只扫证据层），无需重跑 make console。

## 2026-11-09 · ai-guru-console 拆解台整体迁入 console/ 子项目

- **迁移已完成并 commit（6fa98acb9，1160 文件）**：拆解台自 `ai-guru-console` 仓库全量迁入 `console/`，源项目清理按用户指令执行中。console 子项目**自包含**：`cd console && make console` 即可构建（构建脚本 ROOT=parents[2] 自适应新位置），`file://…/console/console/index.html` 直开。
- **嵌套 .gitignore 的前缀模式会失效（本次最大坑）**：源 `.gitignore` 的 `console/data.local.js`、`console/ops.local.js` 复制到 `database/console/.gitignore` 后多了一层目录、匹配落空，私人研判层差点被 `git add console/` 入库。已去前缀修复。**以后把任何子项目迁进子目录，带路径前缀的 ignore 模式必须逐条重审**；`git check-ignore --no-index` 批量验证后再 add。
- **`git ls-files` 计数 ≠ 工作树**：源仓库 880 tracked 里有 233 个「tracked 但工作树已删除」（旧主题目录/wiki 迁移残留，删除未 commit），比对迁移完整性要用工作树快照（rsync checksum 双向 1373=1373），不能用 ls-files 当基准。
- **中文路径比对必须 `-c core.quotepath=false`**：默认八进制转义+引号会让逐文件存在性检查全报 MISSING 假警报；`git add --dry-run | wc -l` 也不可靠（untracked 目录折叠成一行），以 add 后 `git diff --cached --name-only` 为准。
- **console/.github/workflows/ 在本仓库不会被激活**（Actions 只认根目录 .github/），暂属休眠文件；若日后要在 ai-guru-database 启用 console 的 CI/Pages，需把 workflow 提升到根 `.github/workflows/` 并改仓库名/Pages 配置。
- **site/（Pages artifact）未随迁移入库**（与源仓库策略一致）；`console/console/` 下双击 index.html 即用，部署另走 Pages 流程。
- 构建链新位置验证 runbook（已全通，可复用）：`cd console && make console && python3 tools/scripts/validate.py`，`make tree` 连跑两次 checksum 应一致（幂等），puppeteer file:// 冒烟 8 路由。

## 2026-11-09 · 季度新概念雷达机制启动（9 张新概念卡 + RSI 卡更新 + 术语表收编）

- **用户举例「RSI」时先 grep 再动手**：RSI 卡（`概念/Safety/recursive-self-improvement.md`）2026-08-17 已建且质量很好，本会话是补「2026 Q3-Q4 实证节」而非重建。「新增概念」类任务一律先跑双判据（全库全文提及 <5 处 且 无概念卡）再定新建/更新，grep 时注意 RSI 在 README 是「递归自我改进」中文名。
- **表格内 wikilink 的 `\|` 转义会让链接校验正则误报**：target 尾部会吞进 `\`（本会话 19 条假断链全是这个），自写校验脚本必须 `.rstrip('\\')`；`check_links.py` 是否同样误报未测，修它时留意。
- 季度机制入口：`wiki/00_入门/02_技术概览/07_新概念雷达_2026Q3Q4.md`（收录判据四条：时间窗/全库提及<5/双信源/稳定性；观察名单 7 条待 2027-02-09 复审并续作 Q4Q1 版）。
- 术语表的季度收编节插在「## 附录：术语分类索引」**之前**（表格 + 概念卡落点链），不动老附录分类串。
- 校验方式沿用：basename 索引回退 + relationships/表格转义处理的自写脚本（全局 `check_links --json` 的 broken_list 有 999 截断），本次 0 断链、全库总数维持基线 973。

## 2026-11-06 · OpenTrek 平铺 15 页重构为 8 子目录 29 页（14_OpenTrek/）

- **「平铺→目录树」重构的安全流程**：①根 README 不动（外部入口链接全指向它）；②agent 先 Read 旧页再写新子目录页（事实与口径标注必须完整继承，给旧→新映射）；③新页白名单只列新树、明令禁链旧平铺页；④抽查关键事实继承（grep 曾震宇/ZStack 日期/PVPO/信通院/1-10-30）后统一 rm 旧页；⑤全库 grep 确认无残留旧路径引用。本次 342 链接 0 断链、fix_spacing 零修改。
- 拆页粒度经验：行业方案一行业一页、网关与 Token 治理分家、评测与训练分家最自然；Hub 从市场页挪到「全景与演进」更贴资产主题。
- 同会话未 commit 的自建页可安全重组（内容全保留）；已 commit 的页面重组须走只增不减评审。

## 2026-11-06 · OpenTrek 深度沉淀 16 页落库（Alibaba_Cloud/产品/14_OpenTrek/）

- **无本地信源的产品靠「官网产品页 WebFetch + 多轮 WebSearch + 库内纠偏记录」三件套**：OpenTrek 官网页能撑起 15 页骨架（四大卖点/三行业方案/ZStack 合作都是官网或可核实报道口径）。
- **口径三档必须显式区分**：官网确认（四大卖点/部署形态/行业方案）／公开报道（ZStack 合作 2026-10-20、2022 产业智能五大技术）／分析视角或待核实（与百炼的分工、1-10-30 单位含义、PVPO/VCRL 算法细节、信通院认证——营销渠道提及但官网未列）。宣传数字（天级交付/提效 30%/降本 90%）一律标「宣传口径」+验证方法。写作 agent 收到该纪律后执行良好。
- 库内已有纠偏线索要主动利用：AI Stack 营销材料曾出现「OpenTrek-LLM」而官方指南没有——直接引用为「营销 vs 官方口径」案例，呼应 12_架构基建/03 与 概念/General/a-speed 的既有纠偏。
- 系列间互链模式固化：新系列 README 与相邻系列（13_百炼深度）互挂「姊妹篇」，产品/README 表格加行，零成本双向可达。

## 2026-11-06 · 百炼深度沉淀 26 页落库（Alibaba_Cloud/产品/13_百炼深度/）

- **章节级 frontmatter 约定不统一**：`08_网络` 用 `category: 12-architecture-infrastructure`（kebab 式），但 `Alibaba_Cloud` 全章用 `category: 12_架构基建/Alibaba_Cloud`（路径式）且无 subcategory 字段。给写作 agent 下模板前必须先 head 目标章节既有页确认。
- **本机 bailian-* 技能（~/.zcode/skills/ 与 ~/.agents/skills/ 各 11 个）是百炼产品文档的第一手信源**（bl CLI v2.5.1 实测提炼），比网页抓取可靠；写百炼相关内容先读这些 SKILL.md，命令细节禁止凭记忆编造。
- 每批 2 个写作 agent 全程稳定（4 批 26 文件零失败），前条 ≤2 并发结论再次验证；wikilink 白名单 + 目录内单独校验第三次复用依旧有效（239 链接 0 断链）。

## 2026-10-27 · PPU 与高网 23 页落库（08_网络/PPU与高网/）——与 07_GPU_高网设计 撞车后共存

- **两个高网系列是互补不是重复**：`07_GPU_高网设计/`=网络工程视角（交换机/光模块/无损配置/成本），`PPU与高网/`=算力芯片视角（ICN/HCCS/MLU-Link/XPU-Link/BLINK/MTLink 等卡间互联、超节点、通信库）。后者覆盖的寒武纪/海光/昆仑芯/燧原/天数/壁仞/摩尔线程 7 家互联专页前者完全没有。两系列已互相挂 Related，**后续新增高网内容先看自己属于哪个视角再选系列**。
- **本会话开始时 09_PPU_High_Performance_Network.md 尚不存在、写作中途被并行会话落库**——大批量落库前 `ls` 目标目录 + 落库前再查一次（间隔数小时的批量写作，中途必须重查一次 git status/ls，本会话 23 文件写作全程未重查，收尾才发现撞车，靠内容互补才免于返工）。
- **国产互联参数公开口径极不统一**（寒武纪 590 带宽有 300/372 GB/s 两种社区口径、燧原 S60 672 GB/s 为社区口径）：写厂家页必须带「已知与未知」小节，逐条标来源，不确定的写「官方未公开」而不是挑一个数字背书。
- 校验沿用上条经验：wikilink 白名单 + 目录内单独校验有效；`fix_spacing.py wiki/12_架构基建/08_网络/PPU与高网` 只扫本目录。

## 2026-10-27 · GPU 高网 61 页批量落库（08_网络/07_GPU_高网设计/）

- **并行写作 agent >4 个并发会撞 `[1302] Rate limit reached`**：10 组齐发挂了 4 组且无任何输出回执；改为每批 2 个 agent 稳定完成。批量化落库时按 2 并发分批。
- **wikilink 白名单制防断链有效**：给每个写作 agent 下发「本系列文件清单 + 既有页面白名单」、禁相对链接，602 条链接全量校验只漏 1 处拼写（`Supernod` 少 e）。校验脚本逻辑：提取新目录全部 wikilink，对 `wiki/<路径>` 与 `wiki/<路径>.md` 做存在性匹配。
- **`check_links.py --json` 的 `broken_list` 上限 999**，全库基线断链接近该数时会被截断，判断「新增文件是否引入断链」必须对目标目录单独校验，不能只看全局 JSON。
- **`fix_spacing.py` 接受目录参数**：`python3 code/工具/fix_spacing.py wiki/<目录>` 可只扫新目录，避免动到并行会话的未提交文件。
- 并行会话竞态提醒仍有效：本次进行中有另一会话新建了 `wiki/12_架构基建/08_网络/PPU与高网/`，提交前需 `git status` 重查。
