---
层: 04-行业应用层
节点: 08-网络安全与安全运营
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/AI安全与对齐/Palo Alto Networks.md
---

# Palo Alto Networks

> 网络安全平台化巨头，FY2026（截至 2026-07-31）营收 114.8 亿美元（+24%）、NGS ARR 91 亿美元（+63%）✅。用一年半七笔并购（CyberArk 211 亿、Chronosphere 30 亿等）把「网络防火墙公司」重写成五平台 AI 安全公司（Network & AI Security / Cortex / Idira）✅，代价是 GAAP 净利从 11.3 亿塌到 3.1 亿 ✅——并表买增长、非 GAAP 口径讲盈利的典型样本。

## 是什么

**Palo Alto Networks**（NASDAQ: PANW，官网 [paloaltonetworks.com](https://www.paloaltonetworks.com/) ✅ 2026-11-12 抓取）是总部在加州 Santa Clara 的网络安全平台化巨头，SEC 文件自述「the global AI cybersecurity leader」✅ [Q4 FY26 财报](https://www.sec.gov/Archives/edgar/data/1327567/000132756726000019/ex991q426earningsrelease.htm)。FY2026 全年营收 114.8 亿美元（+24%）、经营现金流 45.5 亿、调整后自由现金流利润率 38.4% ✅ [FY26 10-K](https://www.sec.gov/Archives/edgar/data/1327567/000132756726000023/panw-20260731.htm)；员工从 FY25 末 16,068 增至 21,921 人（含 CyberArk 带来约 4,223 人）✅ 10-K。2024-12-12 做过一拆二股票分拆 ✅ 10-K。

**「平台化」战略是这家公司的存在方式**：把分散的点产品打包成整合平台，让客户为「简化架构」付费。平台口径在 FY2026 发生重排——旧叙事是 Network Security / Cloud Security / Security Operations 三平台，FY26 10-K 改为 **Network & AI Security**（SASE + NGFW + CDSS + Prisma AIRS）、**Cortex**（SecOps + 云安全 Cortex Cloud + 可观测性 Chronosphere）、**Idira**（CyberArk 并入的身份安全新平台）三板块 ✅ 10-K；官网营销口径已列五平台（多出 Idira 与可观测性品牌 Cortex XCOR）✅ 官网。Arora 在 Q2 FY26 财报中称「平台化正在因 AI 而加速」✅ [财报](https://www.sec.gov/Archives/edgar/data/1327567/000132756726000003/ex991q226earningsrelease.htm)；但财报新闻稿与 10-K 均未再披露「前 5000 大客户中平台化客户数」这一早年惯例指标 🔍 本会话所抓 SEC 文件中无此数。

**并购即战略，一年半七笔**：IBM QRadar 资产（2024-08-31 交割，总对价 11 亿 = 5 亿现金 + 6.49 亿或有对价公允值）✅ 10-K → Protect AI（2025-07-22，6.35 亿美元、AI 安全）✅ 10-K → **CyberArk**（2025-07-30 宣告每股 45 美元现金 + 2.2005 股、权益价值约 250 亿、溢价 26% ✅ [公告](https://www.sec.gov/Archives/edgar/data/1327567/000119312525168821/d67702dex992.htm)；2026-02-11 交割、账面总对价 211 亿 = 23.1 亿现金 + 1.12 亿股折 184.9 亿 ✅ 10-K）→ Chronosphere（2026-01-29，30 亿美元、可观测性）✅ 10-K → Koi Security（2026-04-14，2.31 亿、agentic 端点）→ Portkey（2026-05-29，1.17 亿、AI 网关）→ Embrace Mobile（2026-07 协议、3.25 亿现金、RUM）与 Console（2026-07-29 协议、5 亿现金、agentic workflows 平台）✅ 均 10-K。宣告 250 亿 vs 交割账面 211 亿：股价波动让对价缩水约 39 亿，风险由 CyberArk 股东以股票形式分担 ✅ 两份文件对照。

**财报主线是 NGS ARR 的斜率与两种口径的利润分裂**（Next-Generation Security ARR，期末活跃合同年化口径、剔除硬件与遗留订阅，10-K 自述「operating metric」✅）：FY25 末 56 亿（+32%）✅ [Q4 FY25 财报](https://www.sec.gov/Archives/edgar/data/1327567/000132756725000024/ex991q425earningsrelease.htm) → Q1 FY26 59 亿（+29%）✅ [财报](https://www.sec.gov/Archives/edgar/data/1327567/000132756725000032/ex991q126earningsrelease.htm) → Q2 63 亿（+33%）→ Q3 81 亿（+60%，自披露其中 16 亿来自 CyberArk+Chronosphere 并表）✅ [财报](https://www.sec.gov/Archives/edgar/data/1327567/000132756726000012/ex991q326earningsrelease.htm) → Q4 91 亿（+63%）✅，单季净增近 10 亿；RPO 212 亿（+34%）✅ Q4 财报。FY27 指引：NGS ARR 110.75–111.75 亿（+22–23%）、营收 141–142 亿（+23–24%），管理层给出 FY30 NGS ARR 200 亿、FY28 调整后 FCF 利润率 40% 两个长期锚 ✅ Q4 财报。另一面：FY2026 GAAP 经营利润率 6.1%（FY25 为 13.5%）、GAAP 净利 3.07 亿（FY25 为 11.34 亿）、毛利率 73.4%→70.4%、Q4 单季 GAAP 净亏 2.82 亿 ✅ 10-K/Q4 财报——无形摊销、整合成本与所购可转债公允值变动压住 GAAP 表，非 GAAP 口径 Q4 经营利润 10 亿、Q1–Q3 连续非 GAAP 经营利润率 30%+ ✅。「并表买增长」的会计成本全部显性化在这张表上，是本线索最需要按口径拆开读的财务主线。

**AI 安全新品线是并购拼出来的**：**Prisma AIRS** 定位 AI 生命周期安全平台（AI Gateway、Agent Security、AI Red Teaming、AI Runtime Security、AI Model Security、AI Posture Management 六件套）✅ 10-K，其拼装路径清晰——Protect AI（AI 安全）+ Portkey（AI 网关）+ Koi（agentic 端点）三笔小并购均自述「enhances Prisma AIRS」✅ 10-K；**AI Access Security** 作为 CDSS 增值服务管住员工对 AI 应用的访问 ✅ 10-K；Console 的 agentic workflows 平台自述「expand the role of our Cortex platform across the broader enterprise agentic transformation」✅ Q4 财报。**Cortex XSIAM** 对 SOC 的重构：10-K 口径为「automates data integration, analysis, and triage to respond to most alerts」、定位「replacing traditional SIEM」，并接入 Chronosphere Telemetry Pipeline 控数据量 ✅ 10-K——但自动化分诊具体百分比、XSIAM ARR/订单里程碑等营销数字未进本会话所抓 SEC 文件 🔍。

**竞争位按 10-K 自己列的四类对手看** ✅：微软/Alphabet/Cisco（把安全塞进大平台）、CrowdStrike/Fortinet/Check Point/Zscaler/Okta/SailPoint/Delinea（独立安全厂商，其中 Zscaler 在 SASE 正面对位、Okta/SailPoint 在身份侧对位 CyberArk）、Datadog/Dynatrace/Elastic（可观测性侧对位 Chronosphere）、云厂商与初创。10-K 还新增身份安全品类风险因子：客户向更全平台厂商整合时，CyberArk 可能反被别人的平台化吞掉 ✅ 10-K——平台化叙事的攻守互换。CNAPP 侧微软/CrowdStrike 的同款口径核验记录见 [[AI安全与对齐/Wiz]]。

## 怎么看

1. **「平台化」既是产品战略也是会计事件，两种口径必须分开读。** Q3 FY26 是唯一自拆并表的季度（NGS ARR +60% 中 16 亿来自 CyberArk+Chronosphere ✅），换算有机增速约 +33%；Q4 的 +63% 未拆分 🔍。FY26 GAAP 净利塌陷 73%（3.07 亿 vs 11.34 亿）主要来自并购摊销与公允值变动，而非需求恶化（非 GAAP 经营利润 30 亿级 ✅）——但非 GAAP 口径恰恰剔除了平台化战略的成本本身，读这张表要用「并购后利润率重置」而非「利润下滑」框架。
2. **并购序列暴露了真实的平台版图，比营销口径诚实。** 七笔并购各对应一块平台拼图：QRadar→XSIAM 的 SIEM 替换入口、Protect AI/Portkey/Koi→Prisma AIRS 三件套、Chronosphere/Embrace→可观测性、CyberArk→Idira、Console→agentic Cortex。宣告 250 亿 vs 交割账面 211 亿（-16%）说明以股票支付的对价随 PANW 股价波动，CyberArk 股东承担了缩水——并购驱动型平台化的定价风险在交割日才结清。
3. **XSIAM 对 SOC 的重构是真叙事，但硬数字仍在 SEC 文件之外。** 10-K 只给定性口径（自动完成数据集成/分析/分诊以响应「most alerts」、替换传统 SIEM ✅），Q3 的「客户为 AI 部署安全下大单」是有机订单的唯一方向性表述 ✅；自动化分诊百分比、XSIAM ARR 里程碑等营销数字本会话未取得可引来源 🔍。Chronosphere 遥测管道接入 XSIAM 值得单独盯：SOC 的最大成本是数据量，安全 × 可观测性合流直接改 SOC 经济学。
4. **AI 安全线是「买来的完整」，差异化窗口与 Wiz 同步关闭。** Prisma AIRS 六件套 + AI Access Security 的能力拼图全部来自近 15 个月并购（Protect AI/Portkey/Koi ✅ 10-K 自述），无一件自研核心——与 [[AI安全与对齐/Wiz]] 记录的微软/CrowdStrike 复制 agentless 的节奏同构；AI 安全是否已进 ARR 表内科目，本会话所抓文件无拆分 🔍。
5. **平台化叙事的攻守互换写在 10-K 自己的风险因子里。** 「客户向更全平台厂商整合时，CyberArk 可能被吞掉」✅ 10-K——PANW 用平台化吃点产品，微软/Google（Wiz 并入后）/CrowdStrike 用更大的平台吃它；四类对手中 Zscaler（SASE）、Okta/SailPoint（身份）、Datadog/Dynatrace（可观测性）三线同时开战，FY30 200 亿 NGS ARR 目标隐含连续四年约 22% 复合增速（91 亿→200 亿，本卡计算口径），任何一线失守都会击穿该锚。
6. **台内观察价值：平台化巨头的「并购即产品线」样本。** 与 [[AI安全与对齐/Wiz]]（46x ARR 卖掉自己）构成安全并购两端——PANW 是买方口径（用股票和 GAAP 利润换平台完整性），Wiz 是卖方口径；与 [[AI安全与对齐/Robust Intelligence]]（IBM 买入后并入 watsonx 体系）对照 AI 安全两种整合路径（独立平台 vs 并入 AI 基础设施）；其 Koi/Console/Prisma AIRS Agent Security 是 [[AI安全与对齐/智能体安全与攻防]] 的防御供给侧一手样本。

## 关键锚点

- **2026-11-12** · [官网平台口径核验](https://www.paloaltonetworks.com/) ✅
- **2026-09-10** · [FY2026 10-K 提交](https://www.sec.gov/Archives/edgar/data/1327567/000132756726000023/panw-20260731.htm) ✅
- **2026-09-01** · [Q4 及 FY2026 财报](https://www.sec.gov/Archives/edgar/data/1327567/000132756726000019/ex991q426earningsrelease.htm) ✅
- **2026-06-02** · [Q3 FY2026 财报](https://www.sec.gov/Archives/edgar/data/1327567/000132756726000012/ex991q326earningsrelease.htm) ✅

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/AI安全与对齐/Palo Alto Networks.md)
- [AI安全与对齐/Wiz](../../../证据层/AI安全与对齐/Wiz.md)
- [AI安全与对齐/智能体安全与攻防](../../../证据层/AI安全与对齐/智能体安全与攻防.md)
- [AI安全与对齐/Robust Intelligence](../../../证据层/AI安全与对齐/Robust Intelligence.md)
