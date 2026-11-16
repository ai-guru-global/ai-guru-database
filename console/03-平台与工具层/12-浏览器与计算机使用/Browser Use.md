---
层: 03-平台与工具层
节点: 12-浏览器与计算机使用
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/智能体平台/Browser Use.md
---

# Browser Use

> 浏览器自动化开源框架的事实标准（GitHub 120,752 star / 361 贡献者，2026-11-12 GitHub API 实测）：ETH Zurich 两人团队 2024-10 开源、YC W25、2025-03 种子轮 $17M（Felicis Ventures 领投）；2026-11-10 发布 1.0「CDP is all you need」删除约 80% 代码转投 REPL+CDP 路线，商业模式是「harness 开源、云收费」——stealth 浏览器 $0.02/浏览器小时与托管 Agent API 正面对标 Browserbase，browser-harness 又反向寄生于 Claude Code/Codex/Cursor 的编码 Agent 生态。

## 是什么

**Browser Use**（官网 [browser-use.com](https://browser-use.com) ✅ 2026-11-12 实测）是「给 LLM 一个真浏览器」的开源框架与配套云，官网口号 "AGENT = HARNESS + BROWSER"、自述「#1 browser agent on GitHub」✅。GitHub 主仓库 [browser-use/browser-use](https://github.com/browser-use/browser-use) 2024-10-31 创建，实测 120,752 star / 13,497 fork / 361 贡献者 / MIT，pushed_at 2026-11-12（当日仍在提交）✅ GitHub API；仓库描述自述双形态："Open-source Python library for AI browser agents, plus Browser Use Cloud: stealth browsers and a hosted agent API" ✅。官网挂 121k、YC 页挂 110k+ ⚠️ 均为取整或落后于实测值。

**出身是瑞士学生项目转 YC 创业，创始人经 GitHub 逐人核证**：Magnus Müller（GitHub: MagMueller，主仓库第一贡献者 3,811 commits，bio "Adventurer | Founder | SF | Browser Use"）任 CEO；Gregor Žunič（GitHub: gregpr07，1,148 commits，bio "Forbes 80 under 80"）任 CTO ✅ GitHub profile。YC 官方页口径：Winter 2025 批次、founded 2024、San Francisco、partner Jared Friedman、团队规模 5 人 ⚠️ 页面时点未标注；两人均为 ETH Zurich 数据科学背景（Müller 自述 scraping hobbyist + ML researcher、曾为 Cambridge CARES 发表；Žunič 数据科学硕士 + 物理学士）✅ YC 页。

**融资核到种子轮一手源，后续轮次为零**：官方博客 [We Raised $17M](https://browser-use.com/posts/seed-round)（2025-03-22，CTO Gregor Žunič 署名）✅：$17M，Felicis Ventures 领投，A Capital、Nexus Ventures、Y Combinator、Paul Graham、Liquid2、SV Angel、Pioneer Fund 跟投；公告时点 star 5 万、开发者 1.5 万+。流通口径有作「Felix Capital 领投」⚠️ 与官方一手公告相悖，本卡以官方为准。种子轮后至 2026-11-12 未核到 A 轮或任何新融资披露 🔍。

**商业面三条产品线 + 企业合规**（官网 ✅ 2026-11-12）：Web agents（托管 Agent API，$0.006/任务中位价）、stealth browsers（$0.02/浏览器小时，README 自述含 CAPTCHA 处理与住宅代理 ✅）、Browser Harness（免费开源，官网自述 "Used by Hermes Agent's browser tool"）。企业口径：SOC 2 Type II、on-prem、EU 云落在 Frankfurt、企业版含 HIPAA ✅。基础设施两篇官方博客自述：Firecracker microVM 让云浏览器 3x 便宜（2026-06-15）、迁移 AWS Bedrock AgentCore（2026-07-12）✅ 自述口径。

**工程节奏快到要求下游锁死版本**：0.13.x 系列 2026-08-16 → 2026-10-26 发 7 个 patch ✅；2026-11-10 直接跳 [1.0.0](https://github.com/browser-use/browser-use/releases/tag/1.0.0)，release 说明题为 "CDP is all you need"：删除 136,866 行（约 80% 代码库），弃 DOM 序列化与 action schema，改为「模型在持久 REPL 里写 Python、直连 Chrome DevTools Protocol」，同模型口径自称 +33 点、成本 1/2.7–5.2、速度 2–3x ✅ 自测；随后两日连发 1.0.1/1.0.2 ✅。README 明言 "releases move fast and can break APIs"、要求精确 pin 版本，0.x 用户被留在 `pip 'browser-use<1'` 旧线 ⚠️。

**组织仓库揭示第三条战线——寄生于编码 Agent**：browser-harness（2026-04-17 建，19,035 star）自述 "Let Claude Code, Codex or Cursor use your real Chrome, logged in as you" ✅；macos-harness / windows-harness（2026-08）把同思路伸到 OS 层 ✅；jev-ultrafast（2026-09-16 建，24,430 star）于 2026-10-31 上线为 BU Ultrafast，自述中位任务 22 秒 ✅ 官方博客。另有 workflow-use（4,252 star，自述 "RPA 2.0"）、benchmark（BU Bench V2.1，200 真实网页任务）、vibetest-use（MCP 自动化 QA）✅ org API。生态锚点：YC 页自述「作为驱动 Manus 的工具之一走红」⚠️ YC 口径；仓库 topics 含 mcp/cdp/computer-use，README 带 mcp-name 头 ✅。

**与原生方案的竞合是这条线索的主变量**：官方博客 [Computer Use vs Browser Use](https://browser-use.com/posts/computer-use-vs-browser-use)（2026-11-05）自陈分野——Anthropic computer use（2024-10，该文承认此词之源）与 OpenAI/Google 同路线走截图+像素坐标，browser use 走页面结构+CDP；官方建议网页任务用 browser use、只有离开浏览器才用 computer use ✅ 一手口径。官网基准榜把 Playwright MCP（2.3）、Chrome DevTools MCP（1.5）列为 harness 对比基线（自测 4.7 任务/10M tokens）✅ 自测。反方记录：① 大模型厂商原生浏览器层（官网 "Popular" 词条同时挂着 Claude in Chrome、Codex 浏览器）既是客户也是替代者 ⚠️；② 三张基准榜全为自建自测、无第三方审计（官网尚且批评他人 "self-graded"）⚠️；③ 收入、客户名单、员工规模零披露 🔍。

## 怎么看

1. **「harness 开源、云收费」是本卡最清晰的商业结构。** 免费的开源库与 harness 负责需求漏斗（12 万 star），云侧在真正难替代处收费：stealth 浏览器、CAPTCHA、住宅代理、microVM 规模化。与 [[开发者工具/快猫星云]] 的「引擎开源、平台收费」同构，但 Browser Use 的付费层更偏基础设施而非平台，竞品直接是 Browserbase/Kernel/Anchor 这类云浏览器商——官网三榜公开点名对比（stealth 通过率 90.5% vs Browserbase 78.5%，100 站点 7 供应商自测口径）是罕见的公开叫板 ✅ 自测。
2. **1.0 重写是「框架被模型能力吸收」的一次自我实验。** 0.x 的立身之本是 DOM 序列化换结构化文本（种子轮公告原文的技术叙事），1.0 把它删了：持久 REPL + 裸 CDP，靠模型自己写代码。一个 12 万 star 项目主动毁弃成名架构，为 [[智能体平台/Agent框架]] 的「薄 harness」论提供最硬实证——脚手架价值随模型迭代递减，护城河只能向 infra（stealth/代理/调度）与分发（star 存量）转移。
3. **对原生方案是竞合，且竞争面在变大。** Anthropic computer use（2024-10）、OpenAI/Google 同类能力抢的是同一批任务；Browser Use 的应对有二：技术上论证「结构+CDP 优于截图+像素」（2026-11-05 官方竞合文章），生态上转做编码 Agent 的浏览器外设（browser-harness 明写 Claude Code/Codex/Cursor）。但厂商也在自建浏览器层（Claude in Chrome、Codex 浏览器能力）——寄生策略既是获客通道也是把替代风险内嵌进客户关系 ⚠️。另见 [[智能体平台/ClaudeAgentSDK]] 的 Agent 侧坐标。
4. **版本暴力是下游的真实风险。** README 自述 "releases move fast and can break APIs"、要求精确 pin；0.x→1.0 抛弃式重写把存量用户留在旧线。被 [[智能体平台/Manus]] 类产品与 Agent 框架引用越广，breaking change 的外部性越大——「默认浏览器层」的地位与工程稳定性承诺之间存在张力 ⚠️。
5. **基准全自测是证据层的软肋。** 官网把「公开 benchmark」做成产品并嘲讽他者 self-graded，但自家三榜由自家基础设施跑、无第三方审计 🔍；种子轮技术叙事（结构化文本）与 1.0 实际路线（裸 CDP）的断裂提示：对这家公司的官方口径要按「版本」取用，不按「事实」固化。
6. **缺口显式登记（补全任一项即可升级对应段落）**：① 种子轮后约 20 个月无新融资披露（A 轮有无 🔍）；② 收入/客户名单/付费转化零披露 🔍；③ 团队规模仅 YC 页 5 人口径、时点未标注 🔍；④ Žunič bio "Forbes 80 under 80" 未核到原文 🔍。

## 关键锚点

- **2026-11-12** · 台内核查：GitHub API × 官网 × YC 页 × 官方博客四通道实测 ✅
- **2026-11-10** · [browser-use 1.0.0「CDP is all you need」](https://github.com/browser-use/browser-use/releases/tag/1.0.0) ✅
- **2026-11-05** · [官方博客：Computer Use vs Browser Use](https://browser-use.com/posts/computer-use-vs-browser-use) ✅
- **2026-10-31** · BU Ultrafast 上线：全美云套餐（含免费层）默认搭载 ✅

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/智能体平台/Browser Use.md)
- [智能体平台/Agent框架](../../../证据层/智能体平台/Agent框架.md)
- [智能体平台/MCP协议](../../../证据层/智能体平台/MCP协议.md)
- [智能体平台/Manus](../../../证据层/智能体平台/Manus.md)
- [智能体平台/ClaudeAgentSDK](../../../证据层/智能体平台/ClaudeAgentSDK.md)
