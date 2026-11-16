---
层: 03-平台与工具层
节点: 07-数据基础设施
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/开发者工具/Snowflake.md
---

# Snowflake

> 云数仓第二极（NYSE: SNOW，市值约 1062 亿美元、2026-11-11 收盘口径 ⚠️）：按消耗计费的「AI Data Cloud」——FY2026 产品收入 44.72 亿美元（+29%）、NRR 125%；换帅两年后增速重回加速（Q1/Q2 FY2027 +34%/+37%、连续三季加速、FY2027 指引两度上调至 +36%），Cortex + Snowflake Intelligence + CoCo/CoWork 撑起「Agentic Enterprise」叙事，与私有市场估值 1900 亿美元的 Databricks 构成数仓双寡头。

## 是什么

**Snowflake Inc.**（特拉华州注册、纽交所 SNOW，总部加州 Menlo Park，官网口径随 8-K 迁址披露 ✅）是企业云数据仓库平台商，自定位「AI Data Cloud company」✅ [Q2 FY2027 财报](https://www.sec.gov/Archives/edgar/data/1640147/000164014726000033/fy2027q2earnings.htm)。2020-09 IPO（当年美股最大软件 IPO ⚠️ 常识口径、未单独核）。截至 2026-01-31 员工 9,060 人、分布 36 国 ✅ [FY2026 10-K](https://www.sec.gov/Archives/edgar/data/1640147/000164014726000008/snow-20260131.htm)；总收入地理构成：美国占 75%（35.24 亿）、EMEA 16%、APJ 6%（FY2026）✅ 10-K。对 AI 产业链，它是「企业数据的受管底座」：模型层的 Anthropic/OpenAI/Gemini 都要通过它的 Cortex 层进入企业数据，这一卡位是与 Databricks 竞争的核心资产。

**商业模式的全部杠杆在消耗（consumption）**：客户按容量或按需购买、按实际用量计收，用得越多收入越高 ✅ 10-K（收入确认与「净留存随用量扩张」的表述）。经营指标刻画了这个飞轮：NRR 125%（2026-01-31）vs 126%（2025）vs 133%（2024）✅ 10-K——三年下滑后在最新季回到 126%（2026-07-31）✅ Q2 FY2027；TTM 产品收入超 100 万美元客户 828 家（+27%）、Forbes Global 2000 客户 829 家、总客户 13,328 家（2026-01-31）✅；RPO 90.0 亿美元（+30%，2026-07-31）✅——合同蓄水池约等于两年产品收入。

**财务主线是「GAAP 亏损 vs 非 GAAP 盈利」的剪刀差收窄**：FY2026 总收入 46.84 亿（产品 44.72 亿、占 95%）✅ 10-K，三年序列产品收入 26.67→34.62→44.72 亿（+29%）✅；GAAP 经营亏损 14.35 亿（-31%）、净亏损 13.29 亿 ✅，而非 GAAP 经营利润 4.90 亿（+10%）✅ [Q4 FY2026 财报](https://www.sec.gov/Archives/edgar/data/1640147/000162828026011631/fy2026q4earnings.htm)；调整后自由现金流 11.93 亿（利润率 25%）、两年累计回购 28 亿美元 ✅ 10-K 现金流量表。代价是股权激励与并购摊销：Q2 FY2027 单季 GAAP 经营亏损仍有 2.63 亿 ✅。FY2027 全年指引：产品收入 60.70 亿（+36%）、非 GAAP 经营利润率 14.5%、调整后 FCF 利润率 23% ✅ [Q2 FY2027](https://www.sec.gov/Archives/edgar/data/1640147/000164014726000033/fy2027q2earnings.htm)；但非 GAAP 产品毛利率指引由 75% 下调至 74%——AI 工作负载的算力成本开始摊薄毛利率 ✅ 两期财报口径对照。

**「增长换 CEO」是理解这条线索的钥匙**：2024-02-27 创始 CEO Frank Slootman 退休（留任董事长），Sridhar Ramaswamy 接任 ✅ [8-K](https://www.sec.gov/Archives/edgar/data/1640147/000164014724000033/snow-20240227.htm)——他是 Neeva 创始 CEO（Neeva 2023 年被 Snowflake 收购）、前 Google 广告与工程 SVP、时任 SVP AI ✅ 8-K 履历，AI 派接班意向明确。兑现发生在两年后：产品收入增速 FY2026 +29% → Q1 FY2027 +34%（史上最大环比增量）→ Q2 FY2027 +37%（连续第三个加速季）✅ 两期财报；2026-07-15 董事会授予 Ramaswamy 100 万股 PSU（绑定股价里程碑，「高度稀缺的 AI 人才」留任口径 ✅ [8-K](https://www.sec.gov/Archives/edgar/data/1640147/000162828026048373/snow-20260715.htm)）；但 2026-03-31 CRO Mike Gannon 因个人原因离任、由十年老将 Jonathan Beaulier 接任 ✅ [8-K](https://www.sec.gov/Archives/edgar/data/1640147/000164014726000013/ex991_pressreleasex033126.htm)——销售一把手更替发生在加速季，值得跟踪。

**AI 战略是「模型中立 × 代理矩阵 × 消耗飞轮」**：Cortex 家族（Analyst/Agents/Code/Sense/AI Gateway）+ Snowflake Intelligence（企业代理，Q4 FY2026 三个月内近 2,500 账户 ✅）+ CoCo（9,100+ 账户）与 CoWork（5,800 账户）（2026-07-31 季度末四周均值口径 ✅ Q2 FY2027）；AI 功能总账户 13,600+（2026-04-30）✅ [Q1 FY2027 财报](https://www.sec.gov/Archives/edgar/data/1640147/000164014726000027/fy2027q1earnings.htm)。模型接入口径：与 Anthropic、Google Cloud、OpenAI 扩大原生模型接入 ✅ Q4 FY2026；OpenAI 合作深化至共创与联合 GTM ✅ Q1 FY2027（各合作首发日期 🔍 本会话未逐一核到发布稿）。2026-11-03 发布稿正式以 CoCo/CoWork 推「Agentic Enterprise」并定档 Q3 财报于 2026-12-02 ✅ [Newsroom](https://www.snowflake.com/news/)。AI 变现仍走消耗间接口径：CFO 称 AI 收入「meaningful step-up」但**不单列金额** ✅ Q2 FY2027——AI 产品 ARR 若在该电话会首次披露，是本线索最重要的待核数字 🔍。配套动作：AWS 60 亿美元多年协议 ✅ Q1 FY2027、SAP 合作转 GA ✅。

**并购是填栈手段，反方记录同样成体系**：Neeva（2023-05~07，CEO 来源）、Samooha（2023-12-20，数据净室）、Datavolo（2024-11-25，1.068 亿、多模态数据管道）、Crunchy Data（2025-06-06，**1.645 亿美元现金**、PostgreSQL——媒体传闻约 2.5 亿 ⚠️ 以 10-K 为准）、TensorStax（2025-11-18，AI 数据工程代理）、Observe（2026-02-02，约 5.962 亿、AI 可观测性，杀入「500 亿+ IT 运维市场」✅ 10-K 与 Q4 FY2026）、Natoma（2026-05 签约，企业级 MCP 平台，Q2 FY2027 已整合为 Cortex AI Gateway ✅）——对比 Databricks 10 亿美元买 Neon（2025-05 ⚠️ TechCrunch 口径），双方在 Postgres 与代理栈上军备竞赛。反方：三财年累计 GAAP 净亏超 34 亿美元 ✅ 10-K；三起集体诉讼在身（证券欺诈、**LLM 训练版权**（2025-11-21 蒙大拿联邦法院）、网络安全）✅ 10-K；Databricks 估值 62B（2025-01）→ 100B（2025-09，$4B ARR）→ 190B（2026-08-13，$5B 融资）⚠️ [TechCrunch 汇总](https://techcrunch.com/tag/databricks/)，私有估值与 Snowflake 公开市值 1062 亿（2026-11-11 ⚠️ [stockanalysis.com](https://stockanalysis.com/stocks/SNOW/)）的口径差是常见误读源；52 周股价区间 118.30–384.56 美元 ⚠️ 同源——AI 叙事重估的波动幅度极大。

## 怎么看

1. **消耗模式的会计结构决定它必须讲「AI 拉动用量」而不是「AI 卖许可」。** 产品收入占 95%、NRR 125–126%、RPO 90 亿（≈两年产品收入），收入端没有「AI SKU」可单独加价——AI 只能通过新增 workload、新增用户、新增消耗间接变现 ✅ 财报口径。这解释了为何 AI 披露全部用「账户数」（CoCo 9,100+/CoWork 5,800/AI 总账户 13,600+）而非金额：口径本身是商业模式的投影。代价是 AI 算力成本直接压毛利：FY2027 产品毛利率指引 75%→74%。
2. **「增长换 CEO」的兑现周期是两年，而非一个季度。** 2024-02 换帅时市场看到的是增速下台阶，2026 上半年才看到 +34%/+37% 的加速与连续两度上调指引 ✅。评估这类换帅事件，正确的时间尺度是 6–8 个季度；100 万股 PSU（2026-07-15，股价里程碑）与 CRO 更替（2026-03-31）说明公司自己把 2026–2027 当作窗口期——若 Q3 FY2027（2026-12-02 报）增速失守 37% 区间，叙事翻转也会很快。
3. **双寡头对比必须「同口径对齐」，否则处处是错觉。** 可比的是经营体量：Snowflake FY2026 产品收入 44.72 亿 ✅ vs Databricks 40 亿 ARR（2025-09 ⚠️）；不可比的是定价：Databricks 1900 亿美元私有估值（2026-08-13，$5B 融资 ⚠️ TechCrunch）vs Snowflake 1062 亿美元公开市值（2026-11-11 ⚠️）——前者未经公开市场校验、后者含流动性折价。真正的竞争变量是开放格式（Iceberg/湖仓）与 Postgres 补位（Neon $1B vs Crunchy $164.5M）——Snowflake 用小额快购补栈，Databricks 用大额买引擎。
4. **GAAP 巨亏 + 诉讼集群是这条线索的系统性折价项。** 三财年净亏累计超 34 亿美元（8.38→12.89→13.29 亿）✅ 10-K，源于股权激励（S&M 段 SBC 3.79 亿/年 ✅）与并购摊销；LLM 训练版权集体诉讼（2025-11-21）意味着自研 AI 栈也有法律成本，不只是模型中立方。0% 可转债滚动（2024 年 23 亿 → 2026-09 再发 37.5 亿）是在用资产负债表买 AI 转型时间——利息为零但或有稀释在累积（capped calls 只部分对冲）。
5. **可观测性与 Postgres 两条并购线指向同一个判断：数据平台在吞并运维与事务库。** Observe（5.962 亿）进入 Dynatrace/New Relic 所在的 ITOM 市场（公司口径 500 亿+），Crunchy Data 把事务型 Postgres 拉进分析云——与 [[开发者工具/Dynatrace]]、[[开发者工具/New Relic]]、[[开发者工具/ServiceNow]] 的边界正在重合：代理经济里「数据底座 × 工作流 × 运维」三者的兼并战场。
6. **台内观察价值：它是「企业 AI 数据底座」坐标系的锚点。** 跟踪三个硬指标：① AI 收入是否单列（Q3 FY2027 电话会 2026-12-02 🔍）；② NRR 能否站稳 126% 以上（2024 年 133%→2026 年 125% 的下台阶是否见底）；③ Observe/Postgres/Cortex Code 是否显性化为收入贡献。与 [[智能体平台/MCP协议]]（Natoma 收购＝协议层被平台收编的样本）、[[商业与投融资/AI的IPO窗口]]（Databricks 推迟 IPO 使 Snowflake 成为该赛道唯一公开对照）、[[商业与投融资/AI人才与并购潮]]（Postgres 军备竞赛）、[[商业与投融资/OpenAI融资与重组]]（模型伙伴绑定）互为印证。

## 关键锚点

- **2026-09-28** · 定价 37.5 亿美元 0% 可转债（10-01 交割）✅
- **2026-09-02** · [Snowflake Reports Financial Results for the Second Quarter of Fiscal 2027](https://www.sec.gov/Archives/edgar/data/1640147/000164014726000033/fy2027q2earnings.htm) ✅
- **2026-07-15** · 董事会向 CEO Ramaswamy 授予 100 万股绩效股票单位（PSU） ✅
- **2026-05-27** · [Q1 FY2027 财报：史上最大环比增量](https://www.sec.gov/Archives/edgar/data/1640147/000164014726000027/fy2027q1earnings.htm) ✅

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/开发者工具/Snowflake.md)
- [开发者工具/ServiceNow](../../../证据层/开发者工具/ServiceNow.md)
- [开发者工具/Dynatrace](../../../证据层/开发者工具/Dynatrace.md)
- [开发者工具/New Relic](../../../证据层/开发者工具/New Relic.md)
- [智能体平台/MCP协议](../../../证据层/智能体平台/MCP协议.md)
- [商业与投融资/AI的IPO窗口](../../../证据层/商业与投融资/AI的IPO窗口.md)
- [商业与投融资/AI人才与并购潮](../../../证据层/商业与投融资/AI人才与并购潮.md)
- [商业与投融资/OpenAI融资与重组](../../../证据层/商业与投融资/OpenAI融资与重组.md)
