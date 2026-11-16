---
线索: Resolve.ai
主题: 开发者工具
别名: [Resolve.ai, Resolve AI, AI SRE]
状态: 活跃
创建: 2026-11-11
更新: 2026-11-11
关键角色: [Resolve.ai]
---

# Resolve.ai

> AI SRE 标杆创业公司（旧金山，2024 年初成立）：两位前 Splunk 可观测性掌舵人（Omnition 创始二人组、OpenTelemetry 共建者）做的「生产环境 on-call agent」。2024-10 种子轮 $35M（Greylock 领投）→ 2026-02 确认 A 轮 $125M、$1B 估值（Lightspeed 领投）；流通中的「前 Meta/Mercury 背景」与「自动处理 80% 报警」两条口径均未获一手源支持，本卡证伪登记。

## 概述

**Resolve AI**（官网 [resolve.ai](https://resolve.ai) ✅ 2026-11-12 实测）定位 "AI SRE" 平台，口号 "Machines on-call for humans"：agent 替工程团队上 on-call——接警分诊、多假设并行调查、根因定位、缓解恢复、修复出 PR、生成事后报告 ✅ 官网/官方博客。官网可核的成果口径（2026-11 实测）：停机时间最多降 80%、MTTR 快 5 倍、on-call 生产力 +75% ✅——注意是「downtime -80%」，不是流通叙事里的「自动处理 80% 报警」🔍 后者无一手出处。

**创始团队（任务线索证伪项）**：联合创始人 **Spiros Xanthos**（CEO）与 **Mayank Agarwal**（CTO），UIUC 研究生同学、两代连续创业者 ✅ TechCrunch/Greylock 一致口径：Pattern Insight 2012 年卖给 VMware、Omnition 2019 年被 Splunk 收购，二人随后在 Splunk 领导可观测性业务（Xanthos 任 GM 四年、Agarwal 任可观测性首席架构师），并共建 OpenTelemetry ✅。任务提示中的「前 Meta/Mercury 工程背景」在 Greylock 投资稿、两篇 TechCrunch 融资报道与官网中均无对应，判为与他司混淆 ⚠️ 不采信。

**融资**：种子轮 **$35M**，2024-10-01 官宣，Greylock 领投（Saam Motamedi、Corinne Riley），Unusual Ventures 跟投，另有 OpenAI/Google/GitHub/AWS/Ramp/Notion/LinkedIn/Snowflake 系天使 ✅ Greylock 一手稿；TechCrunch 后续报道补口径称 Fei-Fei Li、Jeff Dean 参与种子轮 ⚠️ 二手。A 轮两段式：2025-12-19 TechCrunch 首报 $1B 估值、Lightspeed 领投、ARR 约 $4M ⚠️ 匿名源；2026-02-04 确认 **$125M @ $1B 估值**，Lightspeed 领投，Greylock/Unusual/Artisanal Ventures/A* 跟投 ✅。TechCrunch 匿名源称该轮含分层定价、混合估值可能低于 $1B，公司发言人否认（"100% of the equity was purchased at a valuation of $1 billion"）⚠️ 双方各执。

**产品架构**：planner 生成多个 agent 并行追不同假设，证据收敛到根因（要求因果性、引用可溯、证据充分）✅ 官方发布稿；Hivemind 组件维护「生产当前状态」✅ 官网。安全设计是两道闸门：调查 human-on-the-loop、写操作 human-in-the-loop，写凭证加密且仅批准后由执行引擎使用 ✅。集成 Slack/MS Teams/PagerDuty/Datadog/Grafana/Prometheus/AWS/GCP/Kubernetes，经 MCP 或 HTTP ✅ 插件博文；模型路线为自有领域模型 + 前沿模型混用 ✅ 官网。

**客户**：logo 墙约 20 家（Cisco、SAP、Salesforce、Snowflake、Robinhood、Nasdaq、Coinbase、MSCI、Expedia、MongoDB 等）✅ logo 墙不等于深案例；实名案例 4 家：DoorDash（根因时间最多 -87%）、Coinbase（调查时间 -72%）、Zscaler（war room 工程师 -30%、DNS 异常早于人工 bridge 两小时发现）、Gametime（客户自述博客）✅。Greylock 2025-11 稿称设计伙伴一年内全部转付费、客户口径「事故解决时间 -70%+」✅ 投资方稿需折价读。公司未公布客户数与收入，除 TechCrunch 匿名源的 ~$4M ARR（2025-12）外无财务口径 🔍。

**品类定位**：AI SRE 是 2024 年起成形的独立 agent 品类（TechCrunch 直接以品类名相称 ✅）；Resolve 走「跨栈独立层」路线——横接各家可观测平台，把 Datadog/Grafana/PagerDuty 降为数据源，而非寄生于单一平台。TechCrunch 点名对手 Traversal（Sequoia/Kleiner Perkins $48M A 轮）✅；可观测平台原生 agent 功能（如 Datadog Bits 类）是品类侧翼 ⚠️ 分析推断，本会话未展开核。

**反方观点**：① 幻觉与误操作：agent 直接触碰生产写路径，错误修复的爆炸半径远大于错误回答，官方用人工批准闸门对冲——这也自认全自动闭环未兑现 ✅ 官方口径；② 生产信任门槛：on-call 的责任无法外包给无法问责的 agent，~$4M ARR 对 $1B 估值约 250 倍（2025-12 口径 ⚠️ 匿名源），收入验证远未完成；③ 平台挤压：可观测平台握有数据与集成话语权，原生 agent 化是自然延伸，跨栈 agent 的集成依赖随时可被重新定价 ⚠️ 推断；④ A 轮分层定价争议若属实，$1B 是营销估值 ⚠️。

## 时间线

### 2026-11

- **2026-11-12** · 台内核查：官网/Greylock/TechCrunch 三通道实测 ✅
  官网产品口径、客户墙与案例数字逐条抓取；种子轮 Greylock 一手稿（2024-10-01）、Greymatter 深访（2025-11-03）、TechCrunch 两篇融资报道（2025-12-19、2026-02-04）全文核验；「前 Meta/Mercury 背景」「自动处理 80% 报警」两条流通口径未获一手源支持 🔍。
  来源：resolve.ai / greylock.com / techcrunch.com 实测 · 2026-11-12

### 2026-09

- **2026-09** · 生产上下文插件开放给 Cursor / Claude Code / Codex ⚠️
  把调查结论、根因与修复方案注入编码 agent，修复方案可转 PR、回写 Linear、部署后验证是否生效；支持同步团队自有 SKILL.md runbook ✅。博文未标日期（文中 webinar 定于 2026-09-17），随后有 GitHub Universe 2026 参会回顾 ✅。
  来源：[Resolve AI 博客](https://resolve.ai/blog/resolve-ai-plugin-cursor-claude-code-codex) · 2026-09 · 🔍 发布日未标注

### 2026-02

- **2026-02-04** · [AI SRE Resolve AI confirms $125M raise, unicorn valuation](https://techcrunch.com/2026/02/04/ai-sre-resolve-ai-confirms-125m-raise-unicorn-valuation/) ✅
  $125M A 轮 @ $1B 估值，Lightspeed 领投，Greylock、Unusual Ventures、Artisanal Ventures、A* 跟投；确认 2025-12 首报。分层定价争议中公司否认混合估值低于 $1B ⚠️。
  来源：TechCrunch（Marina Temkin）· 2026-02-04

### 2025-12

- **2025-12-19** · [Ex-Splunk execs' startup Resolve AI hits $1B valuation with Series A](https://techcrunch.com/2025/12/19/ex-splunk-execs-startup-resolve-ai-hits-1-billion-valuation-with-series-a/) ✅
  A 轮由 Lightspeed 领投（三个信源），估值 $1B 但或有分层结构；ARR 约 $4M（两个信源）⚠️ 匿名源；点名竞争对手 Traversal（Sequoia/Kleiner Perkins $48M A 轮）✅。
  来源：TechCrunch（Marina Temkin）· 2025-12-19

### 2025-11

- **2025-11-03** · [How Resolve AI is Building Agents to Keep the World's Software Running](https://greylock.com/blog/how-resolve-ai-is-building-agents-to-keep-the-worlds-software-running) ✅
  Greylock 深访稿：设计伙伴「一年内全部转为付费客户」；客户口径事故解决时间 -70%+、on-call 生产力 +75%、每工程师每周省最多 20 小时；Xanthos："We're facing a new crisis where we're building faster than we can operate."
  来源：Greylock Greymatter（Kaitlin Durkosh）· 2025-11-03

### 2024-10

- **2024-10-01** · [Introducing Resolve: An AI Production Engineer](https://greylock.com/blog/introducing-resolve) ✅
  种子轮 $35M 官宣：Greylock 领投（Motamedi/Riley），Unusual Ventures 跟投 + OpenAI/Google/GitHub/AWS 等系天使；口径称工程师最多 90% 时间耗在生产维护、目标放大生产力 100 倍；上线六个月企业用户含 DataStax、Uni、Background ✅。公司 2024 年初成立 ✅ TechCrunch。
  来源：Greylock（投资方一手稿）· 2024-10-01

### 2019

- **2019** · Omnition 被 Splunk 收购，二人组进入 Splunk 领导可观测性 ✅
  Xanthos 在 Splunk 四年（GM），Agarwal 任可观测性首席架构师；Omnition 期间共建成 OpenTelemetry（最广泛采用的开源可观测性项目）✅。
  来源：TechCrunch/Greylock（一致口径）· 2019

### 2012

- **2012** · 第一段创业 Pattern Insight 卖给 VMware ✅
  两位创始人的合作起点可上溯 UIUC 研究生时代（约 20 年）✅。
  来源：Greylock Greymatter · 2012

## 分析

1. **创始谱系决定品类选择，这不是一张普通 AI 应用卡。** 两代退出（Pattern Insight→VMware 2012、Omnition→Splunk 2019）+ OpenTelemetry 共建者身份，意味着他们对「生产数据长什么样、告警为什么失真」有一手认知；agent 接入生产栈依赖的开放可观测标准正是他们当年亲手推动的——独立 agent 层的接入面由创始团队前任铺路 ✅ Greylock/TC 一致口径。
2. **产品路线是「独立 agent 层」，把可观测平台降格为数据源。** 横接 Datadog/Grafana/PagerDuty/Prometheus + MCP，赌的是「单一平台的 native agent 做不到跨栈调查」。反噬也在这里：数据与集成话语权在平台手里，平台原生 agent 是品类侧翼 ⚠️ 推断未展开核；这与 [[AI安全与对齐/Haize Labs]]「模型厂自研红队挤压独立评测商」是同构压力。
3. **「告警收敛→根因定位→修复执行」价值链上，Resolve 实际卡在中间段。** 收敛与定位（调查、根因、事后文档）已产品化；修复执行仍是「修复方案 → 人工批准 → PR/执行引擎」，写操作 human-in-the-loop 是官方明示设计 ✅——全自动闭环（公司愿景叫 "self-driving production"）是路线图而非现状，对它应按「SRE 副驾驶」计价，而非「替代 on-call」。
4. **估值与收入的剪刀差是这条线索最硬的财务事实。** ~$4M ARR vs $1B 估值（2025-12 口径 ⚠️ 匿名源）约 250 倍，且 A 轮或含分层定价——顶级基金在为「AI SRE 品类头部」支付稀缺性溢价而非收入溢价。$125M 弹药（2026-02）足够支撑企业级销售周期，但续约与净收入留存是 2026-2027 的硬关卡 🔍 无公开口径。
5. **客户证明结构「墙厚案浅」，且指标全是时间节约类。** logo 墙约 20 家、深案例仅 4 家，指标集中在 MTTR/调查时间/war room 人数，无一例「自动处理率」——「80% 报警自动处理」的流通口径找不到一手出处 🔍 证伪登记；时间节约（效率叙事）≠ 替代值班（替代叙事），混淆二者正是本卡要防的口径漂移。
6. **台内观察价值：生产-代码回路的先行样本。** 把生产上下文注入 Cursor/Claude Code/Codex、把修复方案转 PR（2026-09 插件 ✅），等于给 [[Agentic编码/Cursor]]、[[Agentic编码/ClaudeCode]] 一类编码 agent 补上「生产反馈环节」——运维 agent 与编码 agent 的缝合处是 AI SRE 品类最独特的观察位。

## 关联线索

- [[Agentic编码/Cursor]] — 生产上下文插件发布对象，编码 agent 与生产 agent 的回路接口
- [[Agentic编码/ClaudeCode]] — 同上；插件支持同步 Claude Code 的 SKILL.md runbook
- [[Agentic编码/Devin]] — 「自主接管职业工作流」同期样本：编码侧 vs 运维侧的交付难度对照
- [[智能体平台/MCP协议]] — 与生产栈（Datadog/Grafana/K8s 等）集成的协议通道
- [[智能体平台/Agent框架]] — planner + 多 agent 并行假设调查的框架层背景
- [[AI安全与对齐/智能体安全与攻防]] — 写操作 agent 的误操作风险与生产信任门槛的攻防面
