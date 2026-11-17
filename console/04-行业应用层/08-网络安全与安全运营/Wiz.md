---
层: 04-行业应用层
节点: 08-网络安全与安全运营
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/AI安全与对齐/Wiz.md
---

# Wiz

> 云安全增速纪录保持者，也是 Google 史上最大收购的标的：320 亿美元全现金，2025-03-18 宣布、2026-03-11 交割 ✅。上线 18 个月做到 1 亿美元 ARR（2022 年宣布口径 ⚠️），2024-07 拒 Google 230 亿、2025-03 以 320 亿重新成交——价格涨 39%，ARR 同步翻倍，两个价格都是当时 ARR 的约 46 倍（本卡计算口径）。

## 是什么

**Wiz**（官网 [wiz.io](https://www.wiz.io/) ✅）是云原生应用保护平台（CNAPP）类别的定义者之一：以 agentless（无代理）架构统一云上安全能力，官方自述「Cloud & AI Security Platform」✅。官网口径：Fortune 100 中 65% 是客户、保护 500 万云工作负载、日均扫描 2300 亿文件 ✅ 自报营销口径；2026-11-11 抓取时官网已挂「Now part of Google Cloud」✅。总部纽约与以色列（TechCrunch 口径 ✅）。

**创始团队是「连续创业者 + 以色列军方」背景**：2020 年 1 月创立 ✅，四人组合 Assaf Rappaport（CEO）、Ami Luttwak（CTO）、Yinon Costica（产品 VP）、Roy Reznik（研发 VP）✅ [官网](https://www.wiz.io/about)；TechCrunch 描述四人为「前以色列军方军官」，此前创办的云安全公司 Adallom 于 2015 年被微软以 3.2 亿美元收购、团队在微软任职四年余后再创业 ✅。流通说法常称创始人为「Check Point 系」🔍 本会话未能核验此说，已核验的坐标是 Adallom→微软。

**增速轨迹是这条线索的硬通货**：上线后 18 个月达成 1 亿美元 ARR、2022 年宣布为「史上最快」⚠️ 公司宣称/媒体转载；此后约 3.5 亿（2024-05）→ 约 5 亿（2024-07）→ 约 7 亿（2025-03）✅ 均为 TechCrunch 引消息人士口径；2025 年内破 10 亿 ⚠️ 交割报道引知情人士，公司未发官方里程碑稿 🔍。资本轨迹同步陡峭：2024-05 融 10 亿美元、投后 120 亿（a16z/Lightspeed/Thrive 领投，自称「全球最大网络空间独角兽」）✅；2024 年底员工老股转让口径 160 亿 ⚠️；累计融资超 19 亿 ✅ Crunchbase 经 TechCrunch；2025-03-17 报道点名投资人含 a16z、Cyberstarts、Index Ventures、Greenoaks、Insight、Sequoia ✅。

**CNAPP 的差异化首先是「快」而不是「深」**：agentless 路线靠只读 API 接入，官方宣称「数分钟接入、全量覆盖、对工作负载零性能影响」✅ [官网平台页](https://www.wiz.io/platform)——对比装 agent 的传统 CWPP，这是把部署摩擦（获客成本）打掉的 PLG 式打法。架构核心是 Security Graph：把云资源、身份、代码、数据的关联建模成图，找「通往漏洞的最短路径」与「toxic combinations」✅ 官网口径。产品线三段（Wiz Cloud / Code / Defend）+ WIN 平台 200+ 集成 ✅；2026 年重心明显转向 AI 安全：AI-APP 平台、Red/Blue/Green 安全智能体、AI SAST、LLMjacking 与提示注入检测 ✅ 博客产品线口径。

**320 亿美元收购案三个时点核验完毕**：2025-03-18 宣布、全现金、超 2011 年 Motorola Mobility 的 125 亿成为 Google 史上之最 ✅；另有约 10 亿美元留任奖金池覆盖约 1700 名员工（人均约 58.8 万美元）、总盘近 330 亿 ✅；Google Cloud CEO Thomas Kurian 主导，承诺 Wiz 保持独立品牌、继续跨 AWS/Azure/Oracle 多云运营 ✅。监管线：DOJ 审查（2025-06 经 Bloomberg 报道 ⚠️）→ 2025-11-05 Rappaport 在 WSJ 活动确认司法部放行 ✅ → 2026-02 欧盟放行 ⚠️ 转述口径 → 2026-03-11 交割 ✅。未见公开的行为性救济条件 ⚠️，监管决定书原文未核 🔍。

**被否的 230 亿前史解释了最终成交条件的构成**：2024-07 Google 报 230 亿（当时对初创的最高报价），谈判破裂的两个实因——Wiz 要求保持独立分部 vs 并入 Google Cloud 的分歧、拜登政府反垄断审查压力 ✅；Rappaport 内部信给出第三条理由：「下一个里程碑是 10 亿 ARR 与 IPO」✅。到 2025 年三个变量全变：FTC 换帅（Ferguson 替代 Khan，市场预期转松）、价格 +39%、独立运营承诺落纸——2024 年拒绝的条件被逐一重新定价后成交 ✅。

**反方观点集中在两点**。估值端：320 亿 ≈ 宣布时 ARR 的 46 倍（本卡计算），隐含连续多年 50%+ 增速假设；领投方 Index 的 Shah 称之为「十年一遇的交易」，但风险投资人对自家项目的叙事立场需折价 ⚠️。竞争端：CNAPP 已成红海——微软 Defender for Cloud 官方文档自述 CNAPP（CSPM + DevSecOps + CWPP、agentless 扫描、cloud security graph 同款术语）✅ [Microsoft Learn](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction)；CrowdStrike Falcon Cloud Security 宣传「最完整的 CNAPP、统一 agent 与 agentless 防护」✅ [官网](https://www.crowdstrike.com/cybersecurity-101/cloud-security/cloud-native-application-protection-platform-cnapp/)；Palo Alto 同场竞技 🔍 本会话未能核验其产品页。agentless 架构本身已被对手复制，Wiz 的增量护城河在图数据规模与企业渗透率，不在架构独占。

## 怎么看

1. **增速纪录要按「口径」拆开看：每一档都是消息人士或公司宣称，不是 GAAP 收入。** 1 亿（上线 18 个月）→ 5 亿（2024-07）→ 7 亿（2025-03）→ 10 亿（2025 年内）的斜率在变大而非衰减，这是 320 亿定价的底盘；但破 10 亿无官方里程碑稿 🔍，且 ARR 是合同口径，收购窗口期的 ARR 宣称普遍偏乐观 ⚠️。可用作坐标，不宜当作审计数字引用。
2. **两个价格、同一个倍数：Google 从未加价，是 Wiz 的 ARR 替它涨了价。** 230 亿 / 5 亿 ≈ 46x（2024-07）、320 亿 / 7 亿 ≈ 46x（2025-03），本卡计算口径。真正变化的是成交条件：独立运营落纸、约 10 亿美元留任池锁定约 1700 人、监管环境从 Khan 换成 Ferguson——2024 年拒绝的三个理由（IPO 雄心、独立分歧、监管风险）在 2025 年逐一失效或被对价。这不是理想主义故事，是条件重新定价。
3. **Agentless 是获客武器不是终局架构，差异化窗口正在关闭。** 只读 API、分钟接入、零性能损耗打掉的是部署摩擦 ✅ 官网口径；但微软官方文档已自述 CNAPP 并用上「agentless」「cloud security graph」同款术语 ✅，CrowdStrike 宣称「统一 agent 与 agentless」✅。Wiz 剩余护城河 = Security Graph 关系数据规模 × 65% Fortune 100 渗透 × 多云中立身份——第三项在并入 Google 后从资产变成需要持续兑现的承诺。
4. **对 Google 这是云第三名的防御性补课，multicloud 承诺是给监管与客户的双重保险。** Google Cloud 份额约 12% vs AWS 30% / Azure 21%（2024-Q4 Statista 经 TechCrunch ⚠️）；安全是 GCP 相对微软最薄弱的一环（Mandiant 之后第二大动作）。监管端靠「不主导云也不主导安全」论证过关；商业端 Wiz 继续支持 AWS/Azure 是成交的组成部分——若 Google 收敛多云支持，65% Fortune 100 的续约盘就是反转的提款机。
5. **46 倍 ARR 的隐含假设是 AI 安全第二曲线接棒。** 云安全支出盘（2024 年 300 亿美元级 ✅ Reznik 引用口径）之外，真正的增量叙事是 AI 工作负载防护：Wiz 2026 年产品线（AI-APP、Red/Blue/Green 智能体、AI SAST、LLMjacking 检测）✅ 博客口径已整体转向。若 agentic AI 的云侧攻击面扩张兑现（见 [[AI安全与对齐/智能体安全与攻防]]），46x 是提前付款；若微软/CrowdStrike 以捆绑把 AI 安全做成附属品，倍数逻辑破裂。
6. **台内观察价值：同一张安全支出表的两端。** Wiz 按 46x ARR 定价、神州数码按分销薄利定价（见 [[交付与组织/神州数码]]），中间是「安全能力溢价 vs 安全交付溢价」的全球定价分层；并购侧它是 [[商业与投融资/AI人才与并购潮]] 的头部样本（VC 史上最大退出 + Google 史上最大收购 + 留任池锁人），被放弃的 IPO 路线则是 [[商业与投融资/AI的IPO窗口]] 的反样本。

## 关键锚点

- **2026-11-11** · 官网状态核验：挂牌「Now part of Google Cloud」 ✅
- **2026-03-15** · [Wiz investor unpacks Google's $32B acquisition](https://techcrunch.com/2026/03/15/wiz-investor-unpacks-googles-32b-acquisition/) ✅
- **2026-03-11** · [Google wraps up $32B acquisition of cloud cybersecurity startup Wiz](https://techcrunch.com/2026/03/11/google-completes-32b-acquisition-of-wiz/) ✅
- **2026-02** · 欧盟批准收购 ⚠️

## 下钻

- [证据时间线（原始线索卡）](../../证据层/AI安全与对齐/Wiz.md)
- [行业应用/AI与网络安全](../../证据层/行业应用/AI与网络安全.md)
- [AI安全与对齐/智能体安全与攻防](../../证据层/AI安全与对齐/智能体安全与攻防.md)
- [商业与投融资/AI人才与并购潮](../../证据层/商业与投融资/AI人才与并购潮.md)
- [商业与投融资/AI的IPO窗口](../../证据层/商业与投融资/AI的IPO窗口.md)
- [交付与组织/神州数码](../../证据层/交付与组织/神州数码.md)
