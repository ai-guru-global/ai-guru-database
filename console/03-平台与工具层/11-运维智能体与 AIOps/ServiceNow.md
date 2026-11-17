---
层: 03-平台与工具层
节点: 11-运维智能体与 AIOps
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/开发者工具/ServiceNow.md
---

# ServiceNow

> 企业工作流平台的「收租人」：从 ITSM 审批流起家，做到 100+ 亿条工作流/年跑在平台上（FY2025 订阅收入 128.83 亿美元、+21%、占总收入 97%）；2026 年把自己重新定位为「Super Intelligence Control Tower」，AI ACV 年内两次上调目标至 17 亿美元，并斥资约 112 亿美元连买 Moveworks、Veza、Armis——把工作流护城河从 IT 横向铺向安全与 CRM，代价是毛利率回落与举债利息费用 13 倍跳升。

## 是什么

**ServiceNow, Inc.**（纽交所 NOW，官网 [servicenow.com](https://www.servicenow.com/) ✅）是企业工作流 SaaS 平台，2012 年 IPO ✅ [FY2017 10-K](https://www.sec.gov/Archives/edgar/data/1373715/000137371518000058/now-20171231x10k.htm)。FY2025（12 月底截止）订阅收入 **128.83 亿美元（+21%）**、总收入 132.78 亿（+21%），订阅占总收入 97% ✅ [FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1373715/000137371526000007/now-20251231.htm)；2025-12-31 员工 29,187 人（美国 14,601）✅。2026-10-28 发布的 Q3 2026 财报把公司标语从上半年的「AI control tower」改成了**「Super Intelligence Control Tower for business reinvention」**✅ [Q3 2026 8-K 附录](https://www.sec.gov/Archives/edgar/data/1373715/000137371526000092/erq3fy26.htm)——定位语一年两换，是 AI 叙事压力的直接读数。

**护城河的核心不是 AI 模型，是工作流引擎与数据模型**：官方口径「100+ 亿条工作流每年跑在平台上」✅ Q3 8-K「About」段。合同结构是这条护城河的量化：2026-09-30 RPO **297 亿美元**（+22%）、cRPO 136.5 亿（+20.5%）✅；2025 年末 RPO 282 亿（+27%）、其中 cRPO 占 46%（+25%）✅ 10-K——长约递延收入把客户锁 3 年以上。客户结构上台阶：单季 19 笔 >500 万美元净新增 ACV（+135% YoY）、>500 万 ACV 客户 680 家（+23%）✅ Q3 8-K。FY2025 10-K 竞争名单：Microsoft、Oracle、SAP、Salesforce、Workday，外加「与 AI 相关的点方案新进者」与自建方案 ✅——Zendesk 未列入（服务台细分的对手是它 2026-10 推的平台外轻量产品 Flow）🔍 未检索第三方竞争份额源。

**Agentic AI 是 2024-2026 的变现主线，口径在升级**：2025-03-10 宣告收购 Moveworks 时披露 Pro Plus AI SKU 的 ACV 于 2024-12-31 突破 **2 亿美元**、AI 客户近 1,000 家 ✅ [425 宣告稿](https://www.sec.gov/Archives/edgar/data/1373715/000137371525000096/prmavericks3-10.htm)；Q2 2026 财报宣布「ServiceNow AI ACV 突破 10 亿美元」✅ [Q2 8-K 附录](https://www.sec.gov/Archives/edgar/data/1373715/000137371526000072/erq2fy26.htm)；Q3 把 2026 年底目标二次上调到 **17 亿美元**（年初口径 10 亿，+70%）✅。注意口径从「Pro Plus SKU ACV」扩成了「AI ACV」总口径——纵向对比时必须换算。消费侧：生产环境 agentic 用量年内至今 **13 倍** YoY、agentic 部署 9 个月增 9 倍 ✅。10-K 产品层表述为 Now Assist（可接第三方/自研模型）+「数千个开箱 AI agent」+ 跨方 agent 编排（AI Agent Orchestrator 的产品名本卡未取得一手源 🔍）。

**并购是第二增长引擎，也是商誉快速堆积处**：Moveworks（企业搜索+前端虚拟助手）2025-03-10 以 **28.5 亿美元**宣告（现金+股票）✅，但直到 **2025-12-15 才交割**、会计总对价 **24.07 亿美元**（股票 14.67 亿按当日 $153.04 计 + 现金 9.05 亿）✅ 10-K——宣告到交割历时 9 个月，宣告值与入账值差 15%。2025 年还交割 Logik.io（CPQ，05-30 ✅ 10-K 并购注释 XBRL）、data.world（数据目录/治理，2025-07 ✅ 10-K）。2026 年连落两子：Veza（AI 身份安全，03-02，约 12 亿）+ **Armis**（网络暴露管理/物理网络安全，04-20，约 **76 亿美元**现金）✅ [Q3 2026 10-Q](https://www.sec.gov/Archives/edgar/data/1373715/000137371526000096/now-20260930.htm)；九个月并购现金流出 91.7 亿、商誉从 35.78 亿跳到 **100.12 亿** ✅。融资侧：2025 年发 senior notes ~39.4 亿、2026 年 term loan 40 亿滚动 + 商业票据，Q3 利息费用 8,100 万（上年同期 600 万）✅。

**毛利率曲线是这条线索的财务主叙事**：早期爬坡有硬数据——FY2013 GAAP 总毛利率 **63.4%** → FY2017 **74.1%** ✅ [FY2017 10-K 五年精选数据](https://www.sec.gov/Archives/edgar/data/1373715/000137371518000058/now-20171231x10k.htm)，与 a16z「Trading Margin for Moat」所引 ServiceNow 63.2%→79% 爬坡叙事方向一致（该文原文本会话未能检索核验 🔍）。如今反向重演：FY2024 订阅 GAAP 毛利率 82% → FY2025 **80%**，10-K 原话预告 2026 将因「第三方云服务用量增长 + 并购无形资产摊销」继续下滑；FY2026 指引 GAAP 订阅毛利率 75% / non-GAAP 81%，Q3 2026 non-GAAP 订阅毛利率 80%（上年同期 83%）✅——AI 推理成本与并购摊销正在吃掉三个点毛利，换来的是 AI ACV 与 RPO 增速。公司对冲叙事是 **Rule of 57**（cc 订阅增速 + FCF margin）与 FY2026 FCF margin 36%（年内上调 100bps）✅。

**扩张路径：ITSM → HR/员工 → CRM → 安全**。HR 侧 EmployeeWorks 让无代码建 agent（+ToolSmith 开发环境）✅；CRM 侧以 Logik.io CPQ + 德甲联赛「Official CRM Partner」（7 渠道归一、89% 首触解决率）等案例铺开，获 Forrester Wave CPQ 2026-Q4 Leader ✅ 公司自引口径；安全侧 2026-10 发布 Autonomous Security 六件套（Armis、Veza 能力直连）✅。AI 治理叙事同样横向结盟：OpenAI（ChatGPT 插件经 Action Fabric）、Google Cloud（工作流接入 Gemini Enterprise）、NVIDIA（个人 agent「Arc」+ BlueField DPU 强制执行），并发起 Control Tower Alliance（创始成员含 Anthropic、AWS、Cisco、Okta、Stripe 等）✅ Q3 8-K——平台把「任何模型的输出」变成「可治理的动作」，这是它与纯 agent 框架的差异化。

**证伪区与压力项**：GAAP 营业利润率 Q3 2026 仅 9.5%（non-GAAP 32.5%——SBC 占收入 15.5%、摊销 5%、重组/遣散 2%）✅；递延薪酬 2.11 亿 + 并购费用 1.18 亿（9M26）✅ 10-Q。任务线索中提到的 AIOps 收购标的「Instayn」在 FY2025 10-K、Q3 2026 10-Q、FY2017 10-K 三份文件全文中均零命中，判定为待证伪名 🔍（早期 ITOM/ITOA 收购史本会话未逐项核验）。并购攒出来的 100 亿商誉 + 40 亿 term loan，是下个减值周期的种子。

## 怎么看

1. **工作流引擎是真护城河，AI 只是把它重新定价。** RPO 297 亿 = 未来三年的合同租金；审批流数据模型（CMDB/ITSM 表结构）是 20 年攒下的企业流程本体，agent 再强也得落在这张流程网上执行——这就是 ServiceNow 敢把叙事从「ITSM 厂商」一路升级到「Super Intelligence Control Tower」的底气。但定位语一年两换也暴露软肋：AI 入口的定义权不在它手里。
2. **AI 变现口径三年三变，纵向对比必须先对表。** Pro Plus SKU ACV（2024 年末 2 亿）→ AI ACV（2026 Q2 破 10 亿）→ AI ACV 年底目标 17 亿：口径从单一 SKU 扩到全部 AI 产品，增速数字不能直接连成一条线。硬锚点是 agentic 生产用量 13x 与 19 笔 >500 万大单 +135%——大企业开始为 agent 签多年大单，这是从席位订阅转向消费+结果的过渡证据。
3. **「Trading Margin for Moat」正在当代重演，方向相反。** 早期 63.4%→74.1% 的爬坡是规模效应的自然赠礼；2026 年毛利率回落三个点（non-GAAP 订阅毛利率 83%→80%）是主动买增长：AI 推理走第三方云 + 并购摊销。检验这笔交换是否划算的两个数：non-GAAP 订阅毛利率守住 80%、FCF margin 兑现 36%——若双双失守，则是「以毛利换故事」而非换护城河。
4. **112 亿并购把安全变成第二引擎，也把软件公司变成杠杆化资产包。** Armis+Veza 让「Autonomous Security」有实体，但商誉 100 亿（占总资产 31%）、term loan 40 亿、利息费用 13 倍跳升、递延薪酬 2.11 亿——这套组合在利率与整合执行上都加了杠杆。Moveworks 宣告价与入账价差 15% 已经演示了股价波动如何改写对价；下一个演示可能是减值测试。
5. **对 Microsoft 的竞争是入口之争，ServiceNow 的反制是「治理层结盟」。** 10-K 把 Microsoft 列竞争名单第一位；微软的 Copilot/Gemini 企业入口（Google 同理）想接管员工交互层，ServiceNow 的解法不是自建入口而是把 OpenAI、Gemini Enterprise、NVIDIA 的出口全部接上 Action Fabric/治理强制层，再做 Control Tower Alliance 圈生态——把自己定位成所有入口之下的执行与审计平面。这层逻辑成立的前提是企业真需要「治理 agent」这个新中间层，否则被两端（模型厂商入口 + AI 点方案）夹扁。
6. **台内观察价值：平台层 vs 交付层的活对照。** 同一张企业工作流需求单，在美国是 80% 订阅毛利率的软件合同，在中国是[[交付与组织/神州数码]]的渠道化交付与[[交付与组织/京北方]]的银行 IT 人天外包（31,278 名员工卖 48.4 亿营收、人均 15 万）——ServiceNow 每一季度证明一次「工作流资产化」的毛利上限，恰好标出这两条中国线索的天花板与转型压力；微软系入口对照见 [[开发者工具/GitHubCopilot]]。

## 关键锚点

- **2026-10-28** · [Q3 2026 财报：订阅收入 39.88 亿 +21%，AI ACV 目标上调至 17 亿](https://www.sec.gov/Archives/edgar/data/1373715/000137371526000092/erq3fy26.htm) ✅
- **2026-07-22** · [Q2 2026 财报：ServiceNow AI ACV 突破 10 亿美元](https://www.sec.gov/Archives/edgar/data/1373715/000137371526000072/erq2fy26.htm) ✅
- **2026-04-20** · Armis Security 交割：约 76 亿美元现金 ✅
- **2026-03-02** · Veza Technologies 交割：约 12 亿美元 ✅

## 下钻

- [证据时间线（原始线索卡）](../../证据层/开发者工具/ServiceNow.md)
- [开发者工具/GitHubCopilot](../../证据层/开发者工具/GitHubCopilot.md)
- [交付与组织/神州数码](../../证据层/交付与组织/神州数码.md)
- [交付与组织/京北方](../../证据层/交付与组织/京北方.md)
