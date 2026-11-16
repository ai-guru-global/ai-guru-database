---
层: 04-行业应用层
节点: 08-网络安全与安全运营
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/AI安全与对齐/Robust Intelligence.md
---

# Robust Intelligence

> 「业界第一个 AI 防火墙」的出处公司：Harvard 学术团队 2019 年创办，2024-08 被思科收购，2025-01 产品化为 Cisco AI Defense，2025-04 升级为 Foundation AI 平台底座，2026 年转向智能体安全——AI 安全创业带被网安巨头整体收编的三个同向样本之一（另两家：Lakera 归 Check Point、Prompt Security 归 SentinelOne）。

## 是什么

**Robust Intelligence, Inc.** 是被思科收购的 AI 安全公司，官方收购博文定位其为「AI security solutions 前沿」的平台商，能力覆盖模型全生命周期（development to production）✅ 思科官方博客。收购后独立品牌已基本消失：Cisco AI Defense 现行产品页通篇无 Robust Intelligence 字样 ✅ 2026-11-11 实测；robustintelligence.com 本会话直连超时，域名现状未核 🔍。**收购金额官方未披露** ✅ 公告原文；「约 4 亿美元」为二手报道口径，本卡未能核到一手源 🔍，引用须带「未披露」标注。

**起源与创始团队**：红杉官网组合页口径「Founded by academics at Harvard in 2019」✅；创始人为 **Yaron Singer**（CEO，Harvard 计算机科学与应用数学终身教职）及其学生 **Kojin Oshiba** ✅ TechCrunch 2021-12-09 报道；思科收购公告确认 Singer 以联创 CEO 身份发言 ✅。⚠️ 「MIT 起源 / Israel Segev 联创」口径未获任何一手源支持——TechCrunch 与红杉两个独立源均记 Harvard + Oshiba，按证伪优先记存疑 🔍。波士顿（Cambridge）学术系谱成立：Harvard 位于 Cambridge, MA ⚠️ 地理归纳。

**独立期产品与融资**：产品名 RIME，核心是一个「AI 防火墙」——模型上线前压力测试 + 生产期持续监测（失败模式、数据漂移），且防火墙本身是一个预测「输入是否会导致错误预测」的 AI 模型 ✅ TechCrunch。2021-12 完成 3000 万美元 B 轮，Tiger Global 领投（超募），红杉连投（A 轮由红杉领投），另有 Harpoon 与 Engineering Capital ✅。思科收购博文称其开创了 AI 供应链安全与「algorithmic jailbreaking」工作 ✅；AI Defense 发布博文直接背书 Robust Intelligence 引入了「the industry's first AI Firewall」✅。

**收购与产品化第一段**：2024-08-26 思科 Tom Gillis 博文宣布收购意向（Robust Intelligence 早已是 Cisco Investments 被投企业），同文 2024-09-24 更新「已完成收购」✅；公告点名防护对象为 prompt injection、data poisoning、jailbreaking，检测映射 OWASP 与 MITRE ATLAS ✅。2025-01-15 思科 DJ Sampath 发布 **Cisco AI Defense**：四组件（AI Access / AI Cloud Visibility / AI Model & Application Validation / AI Runtime Protection），检测模型由 Scale AI 提供、遥测接入 Talos，并预告「2025-03 有更多分享」✅。

**产品化第二段（平台化与 2026 智能体转向）**：2025-04-28 思科成立 **Foundation AI**——以 Robust Intelligence 团队为底座的安全 AI 组织，Yaron Singer 出任 VP of AI and Security，路线是开源：首个发布为基于 Llama 预训练的 8B 安全基座模型，放 Hugging Face ✅。此后产品节奏转向智能体安全：2025-10 接入 NVIDIA NeMo Guardrails ⚠️、2026-02 提出 AI BOM ⚠️、2026-03 上线免费 Explorer Edition（算法红队）⚠️、2026-06 Policy Studio 与 Agent Harness Testing ⚠️、2026-10 与 Workday/ServiceNow 做智能体治理联盟 ⚠️、2026-11-09 宣布引入 Anthropic Claude Mythos 做红队 ⚠️（与产品页 Claude Mythos 合作表述互证 ✅）——以上条目日期与标题取自思科博客检索列表，正文未逐篇抓取 🔍。

**品类坐标**：产品页自述对齐 NIST、MITRE ATLAS、OWASP LLM Top 10，卖点是网络层执法「无需 agent 或库」、模型与应用验证「数秒出风险评估」✅；免费 Explorer Edition 入口 explorer.aidefense.cisco.com ✅。竞争带已被整体收编：Lakera 现挂 Check Point 品牌脚标 ✅ 页脚口径（收购公告未抓到，无日期 🔍）、Prompt Security 挂「From SentinelOne」✅ 页脚口径（同上）——「AI 防火墙」创业带在 2024–2025 被网安巨头吸收完毕，独立上市者缺核证 🔍。

**反方观点**：① 护栏可绕过性——间接提示注入是护栏类产品的经典失效模式（台内 [[AI安全与对齐/智能体安全与攻防]] 记 PromptArmor 对 Atlassian Rovo 的间接注入实证），思科未公开第三方压测数据 🔍；② 防火墙本身是 AI 模型（✅ TechCrunch 原文），误报/漏报是结构性盲区而非 bug；③ 「网络层执法」承诺与应用层攻击粒度之间的张力：设备看到的流量与密文，护栏有效性取决于部署点位颗粒度；④ 「被平台吞并」的预警已自我实现——独立公司不复存在，但换来创业公司拿不到的分发面（网络存量 + Talos + Splunk）。

## 怎么看

1. **AI 防火墙品类的终局样本：不是死在竞争里，而是「毕业」进巨头产品线。** Cisco 收 RI（2024-08）、Check Point 挂 Lakera 品牌、SentinelOne 挂 Prompt 品牌（两家均 ✅ 页脚口径、日期未核）三连同向，2024–2025 完成收编。对「AI 安全赛道」叙事的最大修正：这个品类的产业终局更接近网安巨头的生产线，而非独立上市公司——护栏创业公司的退出通道从一开始就指向收购。
2. **产品化三段论：收购（2024-08）→ 品牌化（AI Defense，2025-01）→ 平台化（Foundation AI，2025-04）。** RI 的真正遗产不是一个产品而是思科的 AI 安全引擎；Singer 从 CEO 变 VP 是典型 acq-hire + 平台化。开源 8B 安全模型在巨头中少见——用开源建品类话语权，配合 OWASP/NIST/ATLAS 对齐话术，是「标准制定者」打法而非「功能卖家」打法。
3. **金额口径纪律：官方未披露，「约 4 亿美元」只可作为待核二手口径。** Cisco Investments 先投后购的结构（公告 ✅ 确认 RI 已是被投企业）说明这是战略并购；对 [[商业与投融资/AI人才与并购潮]] 而言，该交易的价值在结构（投后并购、团队整编为平台组织）而非估值数字。
4. **网络层执法 vs 应用层护栏是路线赌注，不是工程细节。** 思科把护栏嵌入网络 fabric（「无需 agent 或库」✅），分发优势（网络存量 + Talos + Splunk）碾压创业公司；但间接提示注入是应用层/数据层攻击，网络点位看到的是流量与密文——护栏有效性取决于部署颗粒度。这是「无 agent 部署」承诺与攻击现实之间的结构性张力，待第三方压测公开 🔍。
5. **2026 年的产品节奏是品类重心迁移的直接证据。** AI BOM（供应链）→ Agent Harness Testing（行为）→ Agent Passport / Control Tower（治理联盟）→ Claude Mythos（用前沿模型打前沿模型），与 [[AI安全与对齐/智能体安全与攻防]] 的「治理焦点从模型转向权限」判断互证。Claude 红队合作既是能力也是依赖：护栏商对模型商的竞合关系值得持续跟踪。
6. **证据缺口显式登记**：① 收购金额一手源；② Lakera / Prompt Security 被收购的公告日期；③ RI 域名现状（本会话超时）；④ AI Defense 收入/客户规模（思科不分拆披露 🔍）；⑤ 护栏绕过/误报率的第三方压测。补全任一项即可升级对应段落的证据等级；合规框架（NIST AI RMF 等）的监管语境归 [[AI安全与对齐/AI监管政策]]，模型层安全的分工归 [[AI安全与对齐/对齐与可解释性研究]]。

## 关键锚点

- **2026-11-11** · 台内核查：AI Defense 产品页实测 ✅
- **2026-11-09** · [Cisco AI Defense to Add Anthropic's Claude Mythos for AI Red Teaming](https://blogs.cisco.com/ai/cisco-ai-defense-to-add-anthropics-claude-mythos-for-ai-red-teaming) ⚠️
- **2026-10-28** · [Cisco AI Defense joins ServiceNow's Control Tower Alliance](https://blogs.cisco.com/ai/cisco-ai-defense-joins-servicenows-control-tower-alliance) ⚠️
- **2026-10-20** · [Building Trust into Enterprise AI Agents: Cisco AI Defense and Workday Agent Passport](https://blogs.cisco.com/ai/building-trust-into-enterprise-ai-agents-cisco-ai-defense-and-workday-agent-passport) ⚠️

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/AI安全与对齐/Robust Intelligence.md)
- [AI安全与对齐/智能体安全与攻防](../../../证据层/AI安全与对齐/智能体安全与攻防.md)
- [AI安全与对齐/AI监管政策](../../../证据层/AI安全与对齐/AI监管政策.md)
- [AI安全与对齐/对齐与可解释性研究](../../../证据层/AI安全与对齐/对齐与可解释性研究.md)
- [行业应用/AI与网络安全](../../../证据层/行业应用/AI与网络安全.md)
- [商业与投融资/AI人才与并购潮](../../../证据层/商业与投融资/AI人才与并购潮.md)
- [训练与数据/ScaleAI与数据标注](../../../证据层/训练与数据/ScaleAI与数据标注.md)
