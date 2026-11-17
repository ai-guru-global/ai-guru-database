---
层: 03-平台与工具层
节点: 12-浏览器与计算机使用
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/智能体平台/Browserbase.md
---

# Browserbase

> AI 浏览器基础设施（无头浏览器云，旧金山）：2023-11 创始备忘录起步、2024 上半年上线，API 调起隔离浏览器会话，叠加 Search/Fetch/Functions/Identity 与无码层 Director；开源 SDK Stagehand 为品类最大开源抓手（26,008 stars @ 2026-11-12）。融资确证到 2025-06-18 Series B $40M（Notable Capital 领投、CRV/Kleiner Perkins 跟投）；流通的「$300M 估值」「a16z 参与」「YC 孵化」三条口径均未获一手源，本卡证伪登记。

## 是什么

**Browserbase**（官网 [browserbase.com](https://www.browserbase.com/) ✅ 2026-11-12 实测）定位云浏览器基础设施：官网口径「Browserbase makes the web as reliable and programmable as APIs」「Access the 85% APIs can't reach」——API 覆盖不了的那部分 web（登录墙、验证码、人机界面），由 agent 经云浏览器完成 ✅。官网自报规模（2026-11-12 实测时点）：**月 35M+ 浏览器会话、10,000 家客户、10 万开发者、周 SDK 下载 2.9M、SOC-2 Type II** ✅ 均为公司自报，无第三方审计口径 🔍。

**沿革**：起点是创始人 **Paul Klein IV** 2023-11-30 的备忘录（原发于 Hawk Hill Ventures 的 memo 站，后转载官方博客）——「The world deserves a 10x better browser automation platform」✅；Stagehand 仓库首个提交 2024-03-20（"Stagehand prototype"，Jeremy Press）✅ GitHub API；Series B 稿自述彼时「launched ~16 months prior」✅ 即约 2024 年初上线，VentureBeat 2024-06-06 独家报道发布 ⚠️ 稿件正文被反爬墙拦截未逐字核 🔍。团队驻旧金山，官网 Careers 自述「a small team with a high bar」、YoY headcount growth 2.7x ⚠️ 自报。

**产品栈（官网口径 ✅）**：底座 **Browsers**（隔离浏览器会话、专用云浏览器基建；指纹、代理轮换、验证码处理类能力以官方 what-is 系列文档与 Proxy/Stealth 配置形式存在 ⚠️ 产品存在可证、法律灰区另述）；其上 **Search API**（2026-03）与 **Fetch API**（2026-03，URL→HTML/JSON/Markdown）；**Functions**（2026-02，官方类比「AWS Lambda with a browser built-in」）；无码层 **Director**（自然语言→自动生成并执行 Stagehand 代码）；**Agents**（2026-06-30 GA，一句话描述→托管 agent，无需自托管 loop）✅。实名案例：The General Intelligence Company 用其做 PR 自动验证，5 人团队每天合入约 50 个 PR ✅ 官方案例需折价读。

**Stagehand 是这条线索最硬的证据**：开源浏览器自动化 SDK，MIT 协议，**26,008 stars / 1,814 forks / 431 open issues，仓库 2024-03-24 创建，本卡核查当日（2026-11-12）仍在推送** ✅ GitHub API 实测；官方 2024-09-12 发过「pledge to open source」博客 ⚠️ 承诺类口径。v4（2026-08-10）把状态管理移入随页浏览器扩展、TS/Python/Go 三 SDK 同核、单条统一 Locator 取代旧 API ✅。周下载 2.9M 官网自报 ⚠️，与「10 万开发者」口径的换算关系未披露 🔍。

**融资**：确证到 **Series B $40M，2025-06-18 官宣，Notable Capital 领投，CRV 与 Kleiner Perkins 作为既有投资方跟投，估值未披露** ✅ 官方一手稿（作者署名 founder Paul Klein）；CRV/KP 为 B 轮前投资人 ✅ 同稿可证。**缺失与证伪**：seed 与 A 轮的金额、时间、领投方无一手公开源 🔍；流通的「估值约 $300M」仅见于二手（如 2026-03 YouTube 访谈标题）⚠️ 不采信为确证；「a16z 参与」在官网、博客、Series B 稿中零出现 ⚠️ 证伪；[ycombinator.com/companies/browserbase](https://www.ycombinator.com/companies/browserbase) 返回 404（2026-11-12 实测），「YC 孵化」口径未获证实 🔍。

**客户与生态**：官网客户墙 Microsoft、Clay、ClickUp、Ramp、Replit、DeepMind、Lovable 等 ✅ logo 墙不等于深案例；实名深案例可见 Microsoft（computer-use 模型训练用真实 web 环境）与 The General Intelligence Company 两条 ✅。生态动作密集：Vercel Marketplace（2026-02）、Coinbase x402 agentic 支付（2025-12）、Fingerprint.js agent 身份识别（2026-02）、n8n/Mastra/crewAI 集成，以及面向 Claude Code 与 OpenAI SDK 的官方 CUA toolset 仓库（2026-10）✅。官方 MCP server 仓库（2024-12 创建，3,397 stars）**现已归档** ✅ 2026-11-12 实测——入口收敛回平台 API 本身。

**合规边界与反方记录**：行业参照系是 2025-08 Cloudflare 指控 Perplexity「未声明的隐身爬虫」风波（[Cloudflare 原帖 2025-08-04](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) ✅ 未点名 Browserbase；Perplexity 同日回应称指控有误 ⚠️ 双方各执）——验证码处理与指纹管理这类能力始终处于反爬对抗的法律灰区，本卡按公开报道中性登记。Browserbase 的官方路线是「亮明身份」：2025-08-05 立场稿称「agents are going to need to self identify」，随后一年内与 Cloudflare（2025-08）、Stytch（2025-09）、1Password（2025-10/2026-10）、Okta（2026-09）连发身份类合作，跟进 IETF Web Bot Auth 提案 ✅。反方观点：① 竞品 Anchor Browser 实测 Browserbase 对美国 Top100 网站裸配置页面加载成功率 71% vs 自家 93%（2025-08-22 测试）⚠️ 竞品发布，其自注「失败可能源于配置而非兼容性」；② 模型厂商原生 computer use（OpenAI/Anthropic/Gemini）是侧翼挤压，Browserbase 的对冲是把对手变客户（CUA toolset、Microsoft 训练案例）⚠️ 分析推断；③ 收入与估值长期不透明 🔍。

## 怎么看

1. **卡位是「API 覆盖不了的那 85% web」的物理接口层。** 登录墙、验证码、表单这些人类界面是 agent 落地的物理瓶颈；Browserbase 把它做成按调计费的基建（隔离会话/日志/replay/observability），上承 [[智能体平台/Agent框架]] 的 agent loop、下接代理与指纹供给链。它的天花板与 Cloudflare 类反爬厂商的对抗强度直接挂钩——这是纯工程之外的政策变量。
2. **Stagehand 是获客漏斗，也是开源标准的卡位筹码。** 26,008 stars（2026-11-12）让「浏览器自动化 SDK」的默认心智落在自家协议上；但官方 MCP server 仓库已归档、入口收敛回平台 API ✅——开源层负责培养习惯，商业层（并发、身份、Functions、托管 Agents）负责收租。2.9M 周下载 vs 10 万开发者的口径差 🔍 提示自报数据要按「漏斗口径」而非「收入口径」读。
3. **身份层是第二曲线，也是合规灰区的解法。** 2025-08 立场稿（self identify）之后一年，Cloudflare/Stytch/1Password/Okta/Fingerprint 连发合作、跟进 IETF Web Bot Auth ✅——把「绕过反爬」的灰区叙事改写为「亮明身份的受信 agent」。这决定了它与验证码打码类玩家的长期分野：前者卖信任基础设施，后者始终暴露在反爬升级与法律风险之下（行业参照：Cloudflare-Perplexity 事件 ✅ 未涉 Browserbase）。
4. **模型厂商原生 computer use 是双刃剑：既是最大客户也是最大侧翼。** OpenAI/Anthropic/Gemini 都在原生浏览器操作上发力；Browserbase 的对冲是把自己做成这些模型的 harness（claude-cua-toolset、openai-cua-toolset 仓库 ✅、Microsoft 用其真实 web 环境训 computer use 模型的案例 ✅）——「模型越强，跑在云浏览器里的测试/训练/运行需求越多」是它的叙事，「模型厂商把浏览执行收进自家基建」是它的尾部风险 ⚠️ 推断，与 [[智能体平台/ClaudeAgentSDK]] 的 harness 生态互为印证。
5. **财务透明度是这条线索最弱的环节。** 确证到 $40M B 轮（2025-06-18 ✅）之后再无融资或收入披露；「$300M 估值」「a16z」「YC」三条流通口径全部证伪 🔍。竞品基准（Anchor 71% vs 93% ⚠️ 竞品发布）与自建 Playwright/Selenium 集群的 build-vs-buy 压力（官方自己也在写这个选题 ⚠️）共同构成定价天花板——云浏览器的溢价要靠「可靠性 + 身份 + 合规」三件事持续兑现。
6. **台内观察价值：agent 落地的「最后一英里物理层」样本。** 它与 [[智能体平台/MCP协议]]（工具接入协议）、[[智能体平台/Agent框架]]（编排层）共同构成智能体平台栈的三层；观察点是 Web Bot Auth 是否成为 agent 身份事实标准、以及托管 Agents（2026-06）能否把基建收入抬升为应用收入——从卖会话到卖结果的单价跳变是 2026-2027 的关键数据点 🔍 无公开口径。

## 关键锚点

- **2026-11-12** · 台内核查：官网/GitHub API/官方博客三通道实测 ✅
- **2026-10-22 / 10-27** · 1Password 合作稿 + Authenticated Fetch 上线 ⚠️
- **2026-08-10** · [Stagehand v4：状态管理移入浏览器扩展](https://browserbase.com/blog/stagehand-v4) ✅
- **2026-06-30** · [Introducing Browserbase Agents](https://browserbase.com/blog/introducing-browserbase-agents) ✅

## 下钻

- [证据时间线（原始线索卡）](../../证据层/智能体平台/Browserbase.md)
- [智能体平台/MCP协议](../../证据层/智能体平台/MCP协议.md)
- [智能体平台/Agent框架](../../证据层/智能体平台/Agent框架.md)
- [智能体平台/ClaudeAgentSDK](../../证据层/智能体平台/ClaudeAgentSDK.md)
