---
线索: Bloomberg
主题: 行业应用
别名: [Bloomberg, 彭博, Bloomberg Terminal]
状态: 活跃
创建: 2026-11-11
更新: 2026-11-11
关键角色: [Bloomberg]
---

# Bloomberg

> 金融终端的「常量」：1981 年 Michael Bloomberg 带着所罗门兄弟 1000 万美元遣散费创立（CNBC 口径 ✅），以「新闻 + 数据 + 交易执行 + IB Chat 网络」闭环收了华尔街四十余年订阅费——2015 年口径 30 万+ 终端订阅、约 2 万美元/年（✅ CNBC；现行媒体口径 ~3.3 万美元/年、32 万+ 席位 ⚠️ 未核验 🔍）；2023-03 的 BloombergGPT 论文首次证明领域私有语料可自训 50B 金融大模型，成为垂直行业 AI 化的起点事件。

## 概述

**Bloomberg L.P.** 是全球金融数据终端（官方名 Bloomberg Professional Service ✅ [CNBC 解释文](https://www.cnbc.com/2015/04/17/the-bloomberg-terminal-cnbc-explains.html)）与彭博社的所有者，**私有公司**：创始人 Michael Bloomberg 持股 **89%**（✅ CNBC 两次报道口径，2019/2020 年），不披露财务报表，年收入为媒体与行业咨询口径的百亿美元级 🔍 本会话未能核验（官网与行业年报在抓取环境不可达，数字请以 Burton-Taylor 年度报告为准）。

**沿革**：1981 年布隆伯格被所罗门兄弟裁撤、以 1000 万美元遣散费创业（✅ CNBC），先做卖方交易员的实时债券数据终端，后长成数据 + 新闻（彭博社，1990 年创刊）+ 交易执行（Tradebook）+ 消息网络的一体化金融基础设施 ✅ CNBC 口径；2002–2013 任纽约市长期间保留所有权、让出 CEO 头衔，2014 年回归公司 ✅ CNBC 2014/2020 报道。股东回报不适用——它不分红不上市，现金流用于再投入与慈善。

**终端商业模式**：订阅制席位费，客户是买方/卖方机构、央行、监管与财政部。2015 年公开口径：30 万+ 专业市场参与者、约 2 万美元/年 ✅ CNBC；此后历轮涨价，媒体广泛引用口径已到 ~3.3 万美元/席/年 ⚠️ 二手口径 🔍 官网定价不公开、未能核验最新值。定价权的真实来源不是数据本身，而是**切换成本**：IB Chat 是华尔街事实上的交易通讯层（CNBC：很多机构靠它完成交易与沟通 ✅），2015-04-17 一次数小时宕机就让市场成交量缩水、英国推迟国债拍卖 ✅——这是「系统性基础设施」的直接证据。

**数据护城河在私有语料，不在界面**：BloombergGPT 论文披露其训练集含 3630 亿 tokens 的金融语料（论文自述「可能是有史以来最大的领域专用数据集」）+ 3450 亿通用 tokens（约 51 : 49）✅ [arXiv 2303.17564](https://arxiv.org/abs/2303.17564)；CNBC 访谈给出语料构成——**FinPile**：20 年积累的证券文件、新闻稿、彭博新闻、外部出版物与金融网页爬取，超 1000 亿词 ✅。这套「新闻 + 数据 + 执行」闭环的副产品语料，是 LLM 时代它从界面入口转向数据与语料供给的新筹码。

**AI 动作**：2023-03-30 论文发布为行业里程碑 ✅；2023-04 公司确认计划把 BloombergGPT 集成进终端功能（CEO 问答、标题多空判断、公司名→代码、标题生成等任务已有指标）✅ [CNBC 2023-04-13](https://www.cnbc.com/2023/04/13/bloomberg-plans-to-integrate-gpt-style-ai-into-its-terminal.html)。此后 Terminal 内 AI 助手/AI 命令等产品化细节，官方一手口径未能在本会话核验 🔍（bloomberg.com 在本环境不可达），AI 功能现状请以官网与产品发布为准。

**竞争格局**：名义对手是 LSEG Workspace（官网定位「可信数据 + 市场新闻 + 分析 + AI 驱动智能的一体化体验」✅ [lseg.com](https://www.lseg.com/en/data-analytics/products/workspace)）、FactSet、标普与 Moody's；行业侧份额数字（Bloomberg 约 1/3）为 Burton-Taylor 订阅内容、媒体转引口径 🔍 未能独立核验。行业咨询 Burton-Taylor 官网 2025-02 给出基准判断：**到 2028 年底 AI 将为市场数据行业增速贡献约 2 个百分点、对应约 19 亿美元增量收入** ✅ [官网文章](https://tpicap.com/burtontaylor/news/02/2025/expanding-opportunity-ai-market-data-providers-capital-markets)——行业共识是 AI 对数据商是增量而非替代。

**治理与独立性是这条线索的永久变量**：89% 创始人持股意味着所有者政治行动直接传导到编辑部——2019-11 参选当天主编 Micklethwait 备忘录「延续不调查 Mike（及其家族与基金会）的传统，并延伸至其民主党对手；对特朗普政府的调查继续」✅ [CNBC](https://www.cnbc.com/2019/11/24/bloomberg-news-will-not-investigate-mike-bloomberg-or-his-democratic-rivals-during-primary.html)，遭业内批评 ⚠️；2020-03-04 退选当日恢复正常报道 ✅ [CNBC](https://www.cnbc.com/2020/03/04/bloomberg-journalists-free-to-resume-normal-political-coverage.html)。慈善侧体量足以影响机构议程：2024-07 彭博慈善一次性向约翰·霍普金斯医学院捐 10 亿美元覆盖学费 ✅ [CNBC](https://www.cnbc.com/2024/07/08/thanks-to-a-1-billion-gift-most-johns-hopkins-medical-students-will-no-longer-pay-tuition.html)；2020-02 其顾问承诺若当选则把公司放入盲信托出售、收益归彭博慈善（限定不卖外国买家与 PE）✅ [CNBC](https://www.cnbc.com/2020/02/18/bloomberg-would-sell-business-interests-if-elected-president.html)。反方观点：金融裁员潮下 3 万美元级年费续约承压 ⚠️，且 LLM 直接接数据/API 化存在绕开终端界面的长期风险——但 2026 年新入口仍在模仿它而非替代它：Kalshi 为重度交易者开发「预测市场版彭博终端」，且其行情数据本身就已接入 Bloomberg 平台 ✅ [CNBC 2026-06-04](https://www.cnbc.com/2026/06/04/kalshi-is-building-a-bloomberg-terminal-for-prediction-markets.html)。

## 时间线

### 2026-06

- **2026-06-04** · [Kalshi is building a Bloomberg Terminal for prediction markets](https://www.cnbc.com/2026/06/04/kalshi-is-building-a-bloomberg-terminal-for-prediction-markets.html) ✅
  预测市场平台 Kalshi 为重度交易者开发新界面（alpha 测试），被消息源类比为「传统证券 derivatives 的 Bloomberg Terminal」；Kalshi 行情数据当前已可在 Bloomberg 平台获取；此前 2026-04 Fortune 报道风投 Paradigm 自建预测市场数据平台 ⚠️ 转述口径。
  来源：CNBC · 2026-06-04

### 2025-02

- **2025-02-05** · [The Expanding Opportunity of AI for Market Data Providers in the Capital Markets](https://tpicap.com/burtontaylor/news/02/2025/expanding-opportunity-ai-market-data-providers-capital-markets) ✅
  Burton-Taylor（TP ICAP 旗下、市场数据行业基准咨询）预测：到 2028 年底 AI 为市场数据行业 YoY 增速贡献约 2 个百分点、对应约 19 亿美元增量收入（出处标注其 2024 年报告《AI and its Implication on Market Data Providers》）；生成式 AI 推动定制研究摘要与自动化洞察成为数据商新收入线。
  来源：Burton-Taylor 官网 · 2025-02-05

### 2024-07

- **2024-07-08** · 彭博慈善向约翰·霍普金斯大学医学院捐 10 亿美元 ✅
  免除多数医学生学费（家庭收入低于 30 万美元全覆盖、17.5 万美元以下含生活费）——创始人个人慈善体量的最新锚点。
  来源：[CNBC](https://www.cnbc.com/2024/07/08/thanks-to-a-1-billion-gift-most-johns-hopkins-medical-students-will-no-longer-pay-tuition.html) · 2024-07-08

### 2023-04

- **2023-04-13** · [Bloomberg plans to integrate GPT-style A.I. into its terminal](https://www.cnbc.com/2023/04/13/bloomberg-plans-to-integrate-gpt-style-ai-into-its-terminal.html) ✅
  ML 产品与研究负责人 Gideon Mann 确认 BloombergGPT 将集成进终端功能；披露 FinPile 语料构成（20 年积累、超 1000 亿词：证券文件/新闻稿/彭博新闻/外部出版物/金融网页）；已有任务指标：CEO 问答、标题多空判断、公司名→代码、标题生成。
  来源：CNBC · 2023-04-13

### 2023-03

- **2023-03-30** · [BloombergGPT: A Large Language Model for Finance](https://arxiv.org/abs/2303.17564) ✅
  50B 参数金融大模型论文：3630 亿金融 tokens（自述「可能是有史以来最大的领域专用数据集」）+ 3450 亿通用 tokens（约 51 : 49 混训），金融任务显著超越同规模通用模型、通用基准不退化；附录含「Training Chronicles」。垂直行业以私有语料自训大模型的首个标志性公开样本。
  来源：arXiv（v1 2023-03-30，v3 2023-12-21）· 2023-03-30

### 2020-03

- **2020-03-04** · 布隆伯格退选，彭博社当日恢复正常政治报道 ✅
  Micklethwait 邮件：「对民主党候选人与特朗普总统执行完全相同的报道规则」；89% 持股口径在本文再次确认。
  来源：[CNBC](https://www.cnbc.com/2020/03/04/bloomberg-journalists-free-to-resume-normal-political-coverage.html) · 2020-03-04

### 2020-02

- **2020-02-18** · 顾问承诺：若当选总统将盲信托出售公司、收益归彭博慈善 ✅
  顾问 Tim O'Brien 表态，限定不卖外国买家与 PE；当时布隆伯格任 CEO；2002–2013 市长任内保留股权、让出 CEO 头衔。
  来源：CNBC · 2020-02-18

### 2019-11

- **2019-11-24** · 编辑部备忘录：不调查 Mike 及其民主党对手 ✅
  布隆伯格宣布参选当天，主编 Micklethwait 备忘录「延续不调查 Mike（及其家族与基金会）的传统，并延伸至民主党初选对手；对特朗普政府的 P&I 调查继续；报道中须声明『我们的所有者现在是候选人』」——所有权与编辑部独立性的教科书案例，遭业内批评 ⚠️。
  来源：[CNBC（备忘录全文）](https://www.cnbc.com/2019/11/24/bloomberg-news-will-not-investigate-mike-bloomberg-or-his-democratic-rivals-during-primary.html) · 2019-11-24

### 2015-04

- **2015-04-17** · 全球宕机数小时：英国推迟国债拍卖、市场成交量缩水 ✅
  同篇 CNBC 解释文给出当时公开口径：30 万+ 专业用户、约 2 万美元/年；官方名 Bloomberg Professional Service、Bloomberg Anywhere 移动接入、Tradebook 执行。
  来源：[CNBC](https://www.cnbc.com/2015/04/17/the-bloomberg-terminal-cnbc-explains.html) · 2015-04-17

## 分析

1. **终端是「网络效应年金」，不是数据订阅。** 定价权的锚是 IB Chat 交易通讯网络 + 执行闭环 + 合规习惯的合计切换成本（一次宕机能推迟英国国债拍卖 ✅），这解释了 ~3 万美元级年费在裁员周期中的韧性 ⚠️；但它也意味着护城河属于「关系存量」而非技术增量——所有对手都在抄界面，没人能抄网络。
2. **BloombergGPT 的里程碑与分水岭是同一件事。** 2023-03 它证明领域语料可自训 50B 模型且金融任务显著占优 ✅；此后行业普遍转向「通用底座 + 领域微调/检索」，自研路线未成为可复制的成功范式 🔍——它的意义在于把「私有数据是 AI 时代资产」变成全行业的共识，而非一条产品路线。
3. **数据护城河的结构性收益正在换形态：从界面入口到语料供给。** FinPile（20 年、1000 亿词 ✅）在 LLM 时代有两个出口：训练语料授权与 AI-ready 数据分发；Burton-Taylor 把 AI 对市场数据行业的贡献量化为 2028 年前约 19 亿美元增量 ✅——行业咨询的口径是增量逻辑，这为「终端被 LLM 绕开」的反方假设提供了第一层反证，但那是行业口径、不是 Bloomberg 单家口径 ⚠️。
4. **89% 创始人持股把治理风险写进了资产结构。** 参选即触发编辑部独立性事件（2019-11 备忘录 ✅）对终端客户（央行、监管、财政部）与彭博社公信力都有传导；反过来说，2020-02「当选即卖公司、收益归慈善」的承诺 ✅ 显示所有者清楚这一风险。跟踪点：下一次所有者政治行动时编辑部的应对，以及彭博慈善体量对政策议程的影响。
5. **竞争的真实格局：名义对标 Workspace/FactSet/标普，实际对手是「非终端化」。** LSEG Workspace 把 AI 驱动智能写进官网定位 ✅，份额战在分析师工作台；但 2026 年的新信号是模仿而非替代——Kalshi 给预测市场做「彭博终端」，而它的数据反而接入 Bloomberg 平台 ✅。终端形态（软件包早已取代物理机 ✅）说明「终端」是个工作流概念，AI Agent 若接管交易工作流，才是真正绕开。
6. **台内观察价值：AI 金融的「数据层入口」全球侧对照组。** 与 [[行业应用/AI金融]] 的中国侧样本互为参照；它是 [[训练与数据/数据壁垒与合成数据]] 中「私有语料即壁垒」的极值样本；「LLM 搜索绕开终端入口」的假设与 [[AI搜索与信息获取/Perplexity]]、[[AI搜索与信息获取/ChatGPT搜索]] 的通用入口扩张互为反证；其自研领域模型路线与 [[基础模型/GPT系列]] 的通用底座路线构成 2023 年的分岔口记录。

## 关联线索

- [[行业应用/AI金融]] — 金融 AI 应用的全球侧数据层底座与中国侧样本对照
- [[训练与数据/数据壁垒与合成数据]] — FinPile 20 年私有语料是「数据即壁垒」的极值样本
- [[AI搜索与信息获取/Perplexity]] — 「LLM 直接给答案绕开终端入口」假设的通用侧代表
- [[AI搜索与信息获取/ChatGPT搜索]] — 同上，入口迁移的另一观测点
- [[基础模型/GPT系列]] — BloombergGPT 基于 GPT 架构的自研领域变体，2023 年路线分岔的记录
