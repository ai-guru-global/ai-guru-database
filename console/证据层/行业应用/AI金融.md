---
线索: AI金融
主题: 行业应用
别名: [AI金融, 金融大模型, 投研智能体, ChatGPT for Excel, Claude for Excel, 金融数据集成, CFO 办公室]
状态: 活跃
创建: 2026-09-30
更新: 2026-09-30
关键角色: [OpenAI, Anthropic, Google, Microsoft, MiniMax]
---

# AI金融

> 金融行业买的不是席位，是数据接入权与可审计性：Excel/Sheets 插件是分发位而不是产品位。

## 概述

金融是 2026 年垂直落地密度最高、但公开收入口径最少的行业。厂商的打法在一年内明显分层：一是把工作簿变成入口——OpenAI 推出 ChatGPT for Excel 与金融数据集成、Anthropic 把 Claude 接入 Excel/PowerPoint/Word/Outlook、xAI 的 Grok for Excel 随后入场，三家在同一个格子（分析师已有的 Excel 文件）里抢位置；二是把合规与可审计性做成产品——Anthropic 发布金融服务部署指南、金融与保险智能体解决方案、开源金融全栈模板，OpenAI 面向财务团队发布 Codex 用法，本质是用「可复核的流程」换取机构数据授权；三是把咨询业变成渠道——普华永道全球部署 Claude，OpenAI 与 PwC 合作「重塑 CFO 办公室」。中国侧的形态不同：蚂蚁以「AI 版支付宝（阿宝）」把助手嵌进已持牌的支付 App，从邀测到公测只用两周，而银行、券商与监管侧在本库镜像中仍无逐条可引的落地披露。

反向信号同样来自金融：Anthropic 新模型被报道引发欧洲央行要求升级网络防御 ⚠️（转述层级，未见央行一手声明），盈透证券接入 Grok 直接生成实时交易指令，说明金融是第一个被当作「模型能力系统性变量」对待的行业。

本线索只处理金融行业的需求侧与数据授权结构；Office 插件的席位定价、渠道返点与分销商准入在 [[行业应用/AI办公]]，单位经济与毛利口径在 [[交付与组织/AI交付成本结构]]。

### 2026-09

- **2026-09-30** · [OpenAI 据报道洽谈以约 1.4 万亿美元估值融资至少 300 亿美元](https://aihot.virxact.com/items/hxdv40od8cwti1sfmkmursiop)
  TechCrunch 单源 ⚠️：OpenAI 进入 $1.4 万亿估值 / $300 亿融资洽谈阶段；估值与融资金额在本轮不可双源印证。详见待核实清单第七节裁决口径。
- **2026-09-19** · [FT 报道 OpenAI 预计 2030 年前累计现金消耗约 $278B](https://aihot.virxact.com/items/cmu7mv3mi0j8brogr1ktcfhb6)
  Rohan Paul 转 FT：OpenAI 在 2030 年前累计现金消耗约 2780 亿美元；AI 公司现金消耗从「年度 burn」升级为「十年总 burn」，资本侧的 1.4 万亿估值洽谈（9-30）以此为底层假设。→ [[商业与投融资/OpenAI融资与重组]]
- **2026-09-17** · [纽约时报诉 OpenAI 与微软案解封文件披露 AI 抓取被称为史上最大劳动窃取](https://aihot.news/items/cmu5y1e61069vroiq1klswjin)
  TechCrunch：NYT v OpenAI / Microsoft 案解封文件显示内部文件把 AI 抓取描述为「史上最大劳动窃取」；与 9-18 The Decoder「媒体提交简要判决动议」+ 9-27 HN「Authors Guild v OpenAI 新文件披露高管早已知道大规模盗版书籍训练违法」共同构成 9 月「训练数据版权诉讼」三连。
- **2026-09-15** · [Perplexity 自研 CobbleDB 替代 AWS DynamoDB，每年最多可节省一亿美元](https://aihot.news/items/cmu352k2908t9rosaotpsx42c)
  Aravind Srinivas：Perplexity 自研 CobbleDB 替代 AWS DynamoDB，每年最多可节省一亿美元——AI 公司从「云服务消费方」向「基础设施自建方」扩展，成本结构从 OpEx 转向 CapEx + 自研工程。
- **2026-09-15** · [PromptArmor 披露 Elastic AI SOC 被曝存在间接提示注入漏洞，可窃取凭证](https://aihot.news/items/u9bhsw7vkgkoo49rp7hj3uszr)
  PromptArmor：Elastic AI SOC 间接提示注入漏洞，可窃取凭证——SOC（安全运营中心）的 AI 化首次以「提示注入」为攻击面，与 9-10 OpenAI「Anthropic 蒸馏攻击」、9-26 OpenAI 暂停最强模型训练构成 9 月「AI 安全工程化」三连。

### 2026-07

- **2026-07-27** · [用Claude和Python构建技能驱动的金融分析智能体](https://aihot.virxact.com/items/cms3k7su000n8roiytkztsme7)
  第三方工程教程把「金融分析」拆成可组合的技能单元，说明机构级投研能力正在被社区以工程范式复刻，而非只能靠厂商模板。（来源：MarkTechPost）
- **2026-07-20** · [Grok for Excel 发布：在 Microsoft Excel 中用自然语言提问、写公式和运行场景](https://aihot.virxact.com/items/cmrtfkakm2undbitla364sgej)
  xAI 官方发布 Excel 插件，主打自然语言提问、写公式与情景运行，成为第三家在金融核心工作负载里落位的模型厂商。（来源：xAI News）
- **2026-07-20** · [Grok for Excel 上线，支持金融建模与图表生成](https://aihot.virxact.com/items/cmrtiyiqd3p47bitly2fi80jn)
  同一发布的推广口径，明确把「金融建模」而非通用表格作为卖点。（来源：X @elonmusk）
- **2026-07-16** · [MiniMax Code 2.0 桌面端焕新：底层架构全面升级，金融模块即将上线](https://aihot.virxact.com/items/cmrmudyvj015jbije15lwn7k2)
  编码智能体把「金融模块」列为下一个垂直交付项，垂类开始成为 Agent 产品的路线图单元而非销售话术。⚠️ 发布时点为「即将上线」，未见可用的金融模块实证。
- **2026-07-02** · [AI 版支付宝开放公测，蚂蚁阿宝无需邀请码即可体验](https://aihot.virxact.com/items/cmr2x7ii20c2jsl8zygz5iw9n)
  邀测到公测仅两周，中国侧金融 AI 的入口形态是把助手嵌进已持牌、已实名、已有交易数据的 App。（来源：IT之家 https://www.ithome.com/0/971/469.htm，2026-07-02 10:51；证券时报网 https://www.stcn.com/article/detail/3994899.html，2026-07-02 16:08 逐字口径「7月2日，蚂蚁集团宣布，AI版支付宝"阿宝"正式开放公测」）
  ⚠️ 同日报道中的「首推 72 项智能办事技能」仅见于证券时报网单源，IT之家同题稿件「技能」0 命中；两源可交叉的是「公测开放、无需邀请码」这一事件本身，72 项作为单源数值不作规模结论。详见 docs/AI教育与金融来源档案.md A7/A8。

### 2026-06

- **2026-06-25** · [盈透证券（Interactive Brokers）与 Grok 集成：组合分析、情景建模与实时交易指令生成](https://aihot.virxact.com/items/cmqst0js5060tslfu7s6uxjhf)
  券商官方新闻室宣布把模型接入组合分析并生成实时交易指令，是首批明确触及下单环节的持牌机构集成。（来源：xAI News 转述盈透公告；盈透一手页 https://www.interactivebrokers.com/en/general/about/mediaRelations/6-22-26.php 抓取超时，未取得一手正文）
- **2026-06-16** · [AI 版支付宝官宣开启邀测：右滑打开"阿宝"，官方放出 100 个邀请码](https://aihot.virxact.com/items/cmqg20v1a02rtslspl2co5zge)
  支付宝以「右滑」这种入口级改造承接助手形态，金融场景的中国侧竞争发生在超级 App 的交互层。（来源：IT之家）
- **2026-06-06** · [五个实验室，五个心智：用小模型构建多模型金融剧情游戏](https://aihot.virxact.com/items/cmq2rp55c00hlsl97h98gkd14)
  以金融决策为题材的多模型评测型作品，反映金融成为检验「小模型能否承担专业判断」的低成本试验场。（来源：HF Blog）

### 2026-05

- **2026-05-26** · [Anthropic 新模型震动金融圈，欧洲央行紧急开会要求升级网络防御](https://aihot.virxact.com/items/cmplvrbvr0ja8sl01cwts44vh)
  报道称央行层面把模型能力视为需要应对的风险事件。⚠️ 本条仅有中文科技媒体转述，未获欧洲央行一手声明或会议纪要，不可作为监管立场引用；详见 docs/AI教育与金融来源档案.md。
- **2026-05-19** · [Ramp利用Gemini API构建高级财务代理](https://aihot.virxact.com/items/cmpd9r1gv0221slk1frk69vtc)
  企业支出管理平台以客户身份公开自研财务智能体，「财务月结」成为第一个被 SaaS 平台内化而非由厂商直售的金融工作流。（来源：X @googleaidevs）
- **2026-05-15** · [普华永道全球部署Claude，助力客户构建技术、执行交易并重塑企业职能](https://aihot.virxact.com/items/cmp68q4280kmwsljx5vvpdg5v)
  四大之一的全球部署公告，把模型转成面向企业客户的交付能力；金融行业的模型销售由此获得一条转售通道。（来源：Anthropic Newsroom；PwC 一手新闻室 https://www.pwc.com/us/en/about-us/newsroom/press-releases/anthropic-pwc-expand-alliance-agentic-enterprise.html）
  ✗ 一手不可达（2026-09-30 复核）：上述 PwC 页面返回 403、正文 507 字节且为 Akamai 拦截页（「Access Denied … Reference #18.4e9e3617.1790760034.4073a81」），属 WAF 拒访而非 404，故「全球部署」的范围、客户数与合同额均无可引一手口径，本条只支撑事件发生。详见 docs/AI教育与金融来源档案.md A11。
- **2026-05-12** · [财务团队如何使用 Codex](https://aihot.virxact.com/items/cmp38ss5i0410sl1qxvso9atl)
  OpenAI 官方以财务岗位为对象发布用法指南，编码智能体的第二增长曲线是「会写脚本的非程序员」。（来源：OpenAI）
- **2026-05-11** · [Anthropic开源金融AI全栈模板](https://aihot.virxact.com/items/cmp1e405f0xg6sllhvgli5ewp)
  官方开源金融全栈模板，把「怎么搭」公开化以换取机构采纳；模板开放的是工程骨架，数据授权仍是合同问题。（来源：X @frxiaobei；一手仓库 https://github.com/anthropics/financial-services）
  🔍 检索通道说明（2026-09-30）：github.com 的 HTML 页在本网络会话两次传输超时，仓库事实经 https://api.github.com/repos/anthropics/financial-services 取得——Apache-2.0、默认分支 main、created 2026-02-23、Stars 38,304 / Forks 5,513 / open_issues 226（截至 2026-09-30，同日两次查询相差 1，星数只作热度信号）。仓库 created 早于 2026-05-11 的公告约两个半月，「骨架先行、公告在后」可核。README 正文未取得，不引其目录结构。详见 docs/AI教育与金融来源档案.md A9。
- **2026-05-07** · [在Excel、PowerPoint、Word和Outlook中与Claude协同工作](https://aihot.virxact.com/items/cmovu1k5j00cbslcxfdtkl5tg)
  Claude 把插件面从 Excel 扩到 Office 全家桶，金融分析的产出物（备忘录、月报、邮件）第一次被整体纳入模型工作流。（来源：Claude Blog）
- **2026-05-06** · [ChatGPT for Excel and Google Sheets](https://aihot.virxact.com/items/cmoti0lh305gqslv7ywv7c5fj)
  官方同日覆盖 Excel 与 Sheets 两个宿主，说明插件的价值不在模型调用而在嵌入既有记账体系。（来源：X @gdb）
- **2026-05-06** · [Perplexity Agent API 新增金融搜索功能](https://aihot.virxact.com/items/cmou5vmfk00lrslnd9898tz2g)
  搜索厂商把金融数据检索做成 API 能力，金融侧的竞争还包括「谁掌握行情与公告的检索入口」。（来源：X @perplexity_ai）
- **2026-05-05** · [OpenAI 与 PwC 合作重塑 CFO 办公室](https://aihot.virxact.com/items/cmos49izq04u8slrj0fixm8tb)
  OpenAI 同日与 PwC 官宣合作，把 CFO 这一角色（而非某个系统）作为目标客户单元。（来源：OpenAI）
- **2026-05-05** · [金融服务行业Claude部署指南发布](https://aihot.virxact.com/items/cmot0u5zc01gaslv79q25qha8)
  官方行业部署指南，把合规、审计与人工复核写成前置条件而非附录。（来源：Claude Blog）
- **2026-05-05** · [金融与保险智能体解决方案](https://aihot.virxact.com/items/cmosrxflg00yoslpl1a1yr8y9)
  与部署指南同日发布的解决方案页，厂商开始按「行业职能包」而非按模型 SKU 报价。（来源：Anthropic）
- **2026-05-05** · [Claude金融模板上线 助力投研与月结](https://aihot.virxact.com/items/cmossac73014gslpl98yusvv2)
  同日发布序列的第四项，把投研与月结拆成两个可交付场景。⚠️ 2026-05-05 四条应视为一次协同发布，不计作四起独立事件。（来源：X @claudeai）

### 2026-03

- **2026-03-23** · [使用 LlamaParse 与 Gemini 3.1 构建智能金融助手](https://aihot.virxact.com/items/cmoegbhpz00htslxx72wchomb)
  文档解析层厂商与模型层联合发布金融助手方案，金融 AI 的技术栈开始出现明确的「解析—检索—推理」分工。（来源：Google Developers Blog）
- **2026-03-11** · [Claude for Excel 与 Claude for PowerPoint 实现无缝同步](https://aihot.virxact.com/items/cmnw1yoll00hdslc3schhkj3v)
  Excel 与 PowerPoint 之间的同步能力，意味着模型的产出可以在分析—汇报链路里保持引用一致。（来源：X @claudeai）
- **2026-03-05** · [推出 ChatGPT for Excel 及全新金融数据集成](https://aihot.virxact.com/items/cmnw1xr50007lslc30j3neuwr)
  金融数据集成与插件同时发布，是「插件是分发位、数据接入才是商品」这一结构的首次官方表述。（来源：OpenAI；一手页 https://openai.com/index/chatgpt-for-excel/）
  ✗ 一手不可达（2026-09-30 复核）：openai.com 该页返回 403、正文约 10,008 字节且内容层只有「Enable JavaScript and cookies to continue」，属 JS 挑战阻塞而非 404；因此数据供应商名单、接入字段与计费口径均不可引，本条只支撑「插件与金融数据集成同日发布」这一形态。同域其余未回抓条目按一手不可达推定处理。详见 docs/AI教育与金融来源档案.md A12。

### 2025-10

- **2025-10-29** · [金融服务领域构建 AI 代理指南](https://aihot.virxact.com/items/cmnw1xu3t00doslc3d40aybmz)
  厂商侧第一份成体系的金融 Agent 构建指南，为 2026 年的模板化与开源化定下「以流程合规换取数据接入」的路线。（来源：Claude Blog）

### 2025-08

- **2025-08-18** · [Excel 新增 =COPILOT（） 函数，可在表格中直接分析、生成内容和头脑风暴](https://aihot.virxact.com/items/cmnw1ywdd01g3slc3a5ltifgn)
  宿主软件自己把模型做成函数，插件竞争的终点因此不是模型接入而是谁拥有默认入口。（来源：X @satyanadella）

## 分析

1. **插件是分发位，数据授权才是商品**：三家在 2026 年 3–7 月连续发布 Excel/Sheets 插件，宿主与调用方式高度一致；真正区分报价的是能否读到持仓、行情、总账与月末结账数据。金融模型的定价单位因此接近数据接口合同，而非席位数——与 [[行业应用/AI办公]] 的席位与返点逻辑是两套账。

2. **开源模板与部署指南是合规的替代品**：金融机构无法把黑箱接进投研与月结，厂商用公开模板、部署指南和「人工复核写在前置条件里」来证明可审计性。开放的是工程骨架，收紧的是数据边界——这两件事同时发生并不矛盾。

3. **咨询业成为金融模型的转售层**：普华永道全球部署与 OpenAI×PwC 合作同日出现（2026-05-15 / 2026-05-05），意味着厂商在金融侧购买的不是收入而是转售资质；交付责任与可审计性同时被外包给四大，这构成了 [[交付与组织/服务伙伴与认证体系]] 里「资格即产品」的金融行业版本。

4. **中国侧走入口而非工作簿**：蚂蚁把助手做成支付宝的一次右滑，两周内从邀测到公测——中国的金融 AI 竞争发生在已持牌超级 App 的交互层，因为数据授权与合规主体已经存在；银行、券商与监管侧缺公开逐条披露，本库镜像中未见可引的机构级部署公告，属采集缺口而非「未发生」的结论。

5. **金融也是模型风险被行政化对待的第一行业**：实时交易指令生成（盈透×Grok）与央行层面的网络防御反应（转述层级 ⚠️）说明，监管对该行业的关注点已从「输出是否正确」前移到「模型能力本身是否构成运行风险」，这条变化应回看 [[AI安全与对齐/AI监管政策]]。

6. **本线索明确不做的事**：不给出金融行业 AI 支出规模、不比较各厂商金融客户的收入贡献、不把厂商自评 benchmark（如千问志愿类、社区教程类）当作机构渗透率证据——口径与授权层级均不可得。

## 关联线索

- [[行业应用/AI办公]]
- [[行业应用/AI教育]]
- [[交付与组织/AI交付成本结构]]
- [[交付与组织/服务伙伴与认证体系]]
- [[AI安全与对齐/AI监管政策]]
- [[基础模型/Claude]]
