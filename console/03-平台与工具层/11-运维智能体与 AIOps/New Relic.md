---
层: 03-平台与工具层
节点: 11-运维智能体与 AIOps
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/开发者工具/New Relic.md
---

# New Relic

> 全栈可观测老牌（APM 起家，50+ 能力一个平台）：2020-07 豪赌消费定价 + 免费层，2023-11-08 以 87 美元/股、65 亿美元被 Francisco Partners/TPG 私有化退市，24 亿美元并购贷由 Blue Owl 领衔的私募信贷承接（SOFR+675、2030-11 到期）；2026 年把叙事押在「Intelligent Observability」——AI 生成的代码与 agent 产出越多，机器管机器的遥测需求越大。

## 是什么

**New Relic, Inc.**（私有，2007-09 注册、2008-02 公司化，总部旧金山，官网 [newrelic.com](https://newrelic.com/) ✅）是全栈可观测平台：APM 起家，现覆盖基础设施、日志、数字体验、安全等 50+ 能力，2026 年起主打「Intelligent Observability Beyond Human Scale」叙事 ✅ [CEO 任命稿](https://newrelic.com/press-release/20261001)。2023-11-08 退市后归 Francisco Partners 与 TPG 所有（收购主体 Crewline Buyer, Inc.）✅ [8-K](https://www.sec.gov/Archives/edgar/data/1448056/000119312523273042/d469974d8k.htm)，公开披露只剩新闻稿与债务市场渠道——年报消失是这条线索所有数字的第一约束。

**沿革与资本市场史**：IPO 完成于 **2014-12**（NYSE: NEWR）✅ [FY2023 10-K](https://www.sec.gov/Archives/edgar/data/1448056/000144805623000033/newr-20230331.htm)——⚠️ 台外「2018 IPO」口径不成立；私有化签约 **2023-07-31**、股东会通过 2023-11-02、交割退市 **2023-11-08** ✅ 8-K——⚠️ 「2022-11 私有化」口径亦不成立（[TechCrunch 2023-07-31](https://techcrunch.com/2023/07/31/new-relic-agrees-to-go-private-in-6-5b-all-cash-deal/)）。上市末段成绩单：FY2020-FY2023 营收 5.995 → 9.256 亿美元（+17.8%）⚠️ [stockanalysis 聚合](https://stockanalysis.com/stocks/newr/financials/)、FY2023 净亏 1.802 亿美元 ✅ 10-K；付费客户 16,000+，年消费 10 万美元以上 1,200+、百万美元以上 150+ ✅ 10-K；最后一季（FY2024 Q1，截至 2023-06-30）收入 2.426 亿、同比 +12% ✅ TechCrunch——私有化时年化 run-rate 约 9.7 亿美元 ⚠️ 测算。

**定价模式是它的豪赌也是伤口**：2020-07 宣布转向消费制（可观测业首个免费层打法 ⚠️ [TechCrunch 回溯](https://techcrunch.com/2021/05/14/new-relics-business-remodel-will-leave-new-ceo-with-work-to-do/)），FY2021 落地——按「用户数 + 数据摄取量」计费、全遥测统一单价无超量罚金、免费层驱动 PLG ✅ 10-K；同期销售重组裁约 160 人 ⚠️ TechCrunch。⚠️ 台外「2023-10 定价变革」口径不成立：可核验的是 2023-09-05 Standard 版调整 ✅ 官网。现行模式（2026-11 抓取 ✅ [pricing](https://newrelic.com/pricing)）：每账户 100GB/月 + 1 名全功能用户免费，Basic 免费 / Core 49 美元 / 全平台用户 99-349 美元，Data Plus 0.60 美元/GB，另有按 CCU 计的无席位全消耗制——三版并存说明计费模型至今仍在找稳态。

**债务与披露通道**：交割日签署信贷协议——24 亿美元定期贷款 + 2.5 亿美元循环额度（+5000 万信用证），Blue Owl Capital Corporation 任行政/抵押代理，几乎所有资产第一优先担保 ✅ [8-K](https://www.sec.gov/Archives/edgar/data/1448056/000119312523273042/d469974d8k.htm)。BDC 季报是当前唯一公开持仓窗口：2026-09-30 OBDC 持期限贷款面值 1.468 亿/FV 1.439 亿、ORTIC 面值 9,291 万/FV 9,105 万，利率 **SOFR+675、floor 1.00%、2030-11-08 到期**，FV 约为面值 98%——履约正常 ✅ 两只 [OBDC](https://www.sec.gov/Archives/edgar/data/1655888/000165588826000069/obdc-20260930.htm)/[ORTIC](https://www.sec.gov/Archives/edgar/data/1869453/000186945326000066/ortic-20260930.htm) 10-Q；其他持有人含 GS BDC、BlackRock TCP、Apollo Debt Solutions、MidCap（EDGAR 全文检索 ✅）。🔍 私有化后 LTM 收入/EBITDA 无公开数字（BDC 不披露组合公司财务、评级报告未取到）。

**AI 产品线的时间戳链**：2023-05-02 以「Grok」名义发布可观测生成式助手（自称业界首个，自然语言查数/RCA 问句）✅ [TechCrunch](https://techcrunch.com/2023/05/02/new-relic-launches-grok-its-ai-observability-assistant/)；现名 **New Relic AI**（GPT-4 底座、50+ 语言、FedRAMP/HIPAA 客户暂不可用 ✅ [产品页](https://newrelic.com/platform/new-relic-ai)，更名时点 🔍）。2026 年进入产品化兑现期：2026-02-24 发 Agentic Platform（无代码可观测 agent + MCP）与 OTel fleet 管理 ✅ [TechCrunch](https://techcrunch.com/2026/02/24/new-relic-launches-new-ai-agent-platform-and-opentelemetry-tools/)；2026-10-06 Now 大会发 AI Evaluation、Ground Truth CLI、Infrastructure 360 ✅ 官网；2026-10-28 Change Tracking 直接进 GitHub Copilot ✅ 官网；2026-11-10 发 Autopilot Kubernetes Agent ✅ 官网——口径从「人用自然语言查」转向「headless：agent 产出代码与部署，可观测自主接线」。

**治理与竞争位**：CEO 链——创始人 Lew Cirne → Bill Staples（2021-07-01 就任 ✅ [TechCrunch](https://techcrunch.com/2021/05/13/new-relic-is-bringing-in-a-new-ceo-as-founder-lew-cirne-moves-to-executive-chairman-role/)；Staples 2024-12-05 转任 GitLab CEO ✅ TechCrunch）→ Ashan Willy（任期起点 🔍 无一手源）→ **Nandini Ramani**（2026-10-01，前 AWS 可观测/搜索/合规线负责人，含 CloudWatch/OpenSearch）✅ 官网；2026-10-29 Boomi CEO Steve Lucas 任董事会主席 ✅ 新闻稿。竞争位：Gartner APM 魔力象限第三（2021，落后 Dynatrace/AppDynamics）⚠️ 时点早；对照 Datadog Q3 2026 收入 11.97 亿美元（+35%）、FY2026 指引 45.2 亿 ✅ [8-K](https://www.sec.gov/Archives/edgar/data/1561550/000162828026069792/ex-991x20260930x8k.htm)——Datadog 单季已超 New Relic 退市时全年 run-rate。反方观点：退市后透明度断崖；可观测市场 OTel 标准化 + Grafana/Splunk（思科）挤压的同质化内卷 ⚠️。

## 怎么看

1. **定价是豪赌也是伤口：免费层买增长，但买不来增速。** 2020-07 消费转型把获客成本打掉（100GB + 1 用户免费、全遥测统一单价），代价是转型期增速换挡与裁员 160 人；退市前一年收入增速 +12% 对净亏 1.8 亿，说明 PLG 模型在大客户段未能复现 Datadog 式高增长。现行「席位 + 用量 + CCU 无席位」三制并存，是模型仍在找稳态的直接证据——跟踪 2026-10 新 CEO 下计费是否第四度改版。
2. **私有化资金结构决定披露形态：私募信贷替代公开市场。** 24 亿定期贷款不是银团也不是高收益债，而是 Blue Owl 领衔的 BDC 联合体（unitranche，SOFR+675/floor 1%，利差属私募信贷典型定价、成本显著高于同评级公开债 ⚠️ 未取当期 SOFR 基准）；FV/par ≈ 98%（2026-09-30）说明按期履约。这创造了台内方法论样本：**BDC 10-Q 是私有化公司财务状态的主要公开窗口**（与 [[商业与投融资/Blue Owl]] 互联），但它不含组合公司收入——LTM 缺口 🔍 只能靠评级报告或退出事件回填。
3. **「AI 生成代码 → 可观测需求」在 2026 年进入产品化兑现期，时间戳链完整。** Grok（2023-05）→ Agentic Platform + MCP（2026-02）→ AI Evaluation / Ground Truth CLI（2026-10-06）→ Change Tracking 进 Copilot（2026-10-28）→ Autopilot（2026-11-10）。逻辑：agent 产出部署的频率与变更面远超人工，「人读仪表盘」不可扩展，可观测必须变成机器对机器——这是对 [[Agentic编码/ClaudeCode]]、[[Agentic编码/Cursor]] 产出曲线的下游对价，也是「Agentic AIOps」口径的实证基础。
4. **竞争位：从公开市场老三到 PE 手里的价值修复标的。** Gartner APM MQ 第三（2021，落后 Dynatrace/AppDynamics）⚠️ 时点早；如今 Datadog 单季收入（11.97 亿）已超它退市时的全年 run-rate（约 9.7 亿 ⚠️ 测算），规模差一个量级。翻身假说押在 headless AI 可观测对老玩家的重置；结构性逆风是 OTel 标准化削弱数据锁定、Grafana 开源栈与思科收编 Splunk 的挤压 ⚠️ 观点——而 NR 把 OTel 管理做回产品是逆风中的对冲动作。
5. **两年两 CEO + 主席双换，是退出准备信号也是组织风险。** 交割即换全董事会（2023-11）；Staples 2024-12 跳 GitLab；2026-10 一个月内 CEO（Ramani，AWS 可观测背景——竞争对手云厂商视角）与主席（Lucas，Marketo/iCIMS 退出履历）双换 ⚠️ 推断为 PE 搭「下一个成长故事/上市友好」台面。关键运营层（CFO Ashish Agarwal 等）为 2026 年新班底 ✅ 官网，磨合成本待观察。
6. **台内观察价值：同时是三条线索的实证节点。** ①「AI 代码 → 可观测税」需求传导的下游样本（[[开发者工具/GitHubCopilot]]）；②私募信贷替代公开市场的披露形态（[[商业与投融资/Blue Owl]]）；③中速增长 SaaS 退市与退出路径的估值天花板样本（[[商业与投融资/AI的IPO窗口]]）。2025 年公开可核验事件为空 🔍（本会话检索受限，新闻稿归档页 JS 分页未取到）——补 IPO/融资传闻时优先核 Bloomberg/Reuters 一手，再对照 BDC 投资逻辑变化。

## 关键锚点

- **2026-11-10** · [发布 Autopilot Kubernetes Agent](https://newrelic.com/press-release/20261110) ✅
- **2026-11-04/05** · Blue Owl 系两只 BDC 三季报披露贷款条款 ✅
- **2026-10-29** · [Steve Lucas（Boomi CEO）出任董事会主席](https://newrelic.com/press-release/20261029) ✅
- **2026-10-28** · Change Tracking 进入 GitHub Copilot ✅

## 下钻

- [证据时间线（原始线索卡）](../../证据层/开发者工具/New Relic.md)
- [开发者工具/GitHubCopilot](../../证据层/开发者工具/GitHubCopilot.md)
- [Agentic编码/ClaudeCode](../../证据层/Agentic编码/ClaudeCode.md)
- [Agentic编码/Cursor](../../证据层/Agentic编码/Cursor.md)
- [商业与投融资/Blue Owl](../../证据层/商业与投融资/Blue Owl.md)
- [商业与投融资/AI的IPO窗口](../../证据层/商业与投融资/AI的IPO窗口.md)
