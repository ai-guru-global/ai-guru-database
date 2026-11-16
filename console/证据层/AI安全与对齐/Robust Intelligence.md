---
线索: Robust Intelligence
主题: AI安全与对齐
别名: [Robust Intelligence, Cisco AI Defense, Firewall for AI, AI Defense]
状态: 活跃
创建: 2026-11-11
更新: 2026-11-11
关键角色: [Robust Intelligence]
---

# Robust Intelligence

> 「业界第一个 AI 防火墙」的出处公司：Harvard 学术团队 2019 年创办，2024-08 被思科收购，2025-01 产品化为 Cisco AI Defense，2025-04 升级为 Foundation AI 平台底座，2026 年转向智能体安全——AI 安全创业带被网安巨头整体收编的三个同向样本之一（另两家：Lakera 归 Check Point、Prompt Security 归 SentinelOne）。

## 概述

**Robust Intelligence, Inc.** 是被思科收购的 AI 安全公司，官方收购博文定位其为「AI security solutions 前沿」的平台商，能力覆盖模型全生命周期（development to production）✅ 思科官方博客。收购后独立品牌已基本消失：Cisco AI Defense 现行产品页通篇无 Robust Intelligence 字样 ✅ 2026-11-11 实测；robustintelligence.com 本会话直连超时，域名现状未核 🔍。**收购金额官方未披露** ✅ 公告原文；「约 4 亿美元」为二手报道口径，本卡未能核到一手源 🔍，引用须带「未披露」标注。

**起源与创始团队**：红杉官网组合页口径「Founded by academics at Harvard in 2019」✅；创始人为 **Yaron Singer**（CEO，Harvard 计算机科学与应用数学终身教职）及其学生 **Kojin Oshiba** ✅ TechCrunch 2021-12-09 报道；思科收购公告确认 Singer 以联创 CEO 身份发言 ✅。⚠️ 「MIT 起源 / Israel Segev 联创」口径未获任何一手源支持——TechCrunch 与红杉两个独立源均记 Harvard + Oshiba，按证伪优先记存疑 🔍。波士顿（Cambridge）学术系谱成立：Harvard 位于 Cambridge, MA ⚠️ 地理归纳。

**独立期产品与融资**：产品名 RIME，核心是一个「AI 防火墙」——模型上线前压力测试 + 生产期持续监测（失败模式、数据漂移），且防火墙本身是一个预测「输入是否会导致错误预测」的 AI 模型 ✅ TechCrunch。2021-12 完成 3000 万美元 B 轮，Tiger Global 领投（超募），红杉连投（A 轮由红杉领投），另有 Harpoon 与 Engineering Capital ✅。思科收购博文称其开创了 AI 供应链安全与「algorithmic jailbreaking」工作 ✅；AI Defense 发布博文直接背书 Robust Intelligence 引入了「the industry's first AI Firewall」✅。

**收购与产品化第一段**：2024-08-26 思科 Tom Gillis 博文宣布收购意向（Robust Intelligence 早已是 Cisco Investments 被投企业），同文 2024-09-24 更新「已完成收购」✅；公告点名防护对象为 prompt injection、data poisoning、jailbreaking，检测映射 OWASP 与 MITRE ATLAS ✅。2025-01-15 思科 DJ Sampath 发布 **Cisco AI Defense**：四组件（AI Access / AI Cloud Visibility / AI Model & Application Validation / AI Runtime Protection），检测模型由 Scale AI 提供、遥测接入 Talos，并预告「2025-03 有更多分享」✅。

**产品化第二段（平台化与 2026 智能体转向）**：2025-04-28 思科成立 **Foundation AI**——以 Robust Intelligence 团队为底座的安全 AI 组织，Yaron Singer 出任 VP of AI and Security，路线是开源：首个发布为基于 Llama 预训练的 8B 安全基座模型，放 Hugging Face ✅。此后产品节奏转向智能体安全：2025-10 接入 NVIDIA NeMo Guardrails ⚠️、2026-02 提出 AI BOM ⚠️、2026-03 上线免费 Explorer Edition（算法红队）⚠️、2026-06 Policy Studio 与 Agent Harness Testing ⚠️、2026-10 与 Workday/ServiceNow 做智能体治理联盟 ⚠️、2026-11-09 宣布引入 Anthropic Claude Mythos 做红队 ⚠️（与产品页 Claude Mythos 合作表述互证 ✅）——以上条目日期与标题取自思科博客检索列表，正文未逐篇抓取 🔍。

**品类坐标**：产品页自述对齐 NIST、MITRE ATLAS、OWASP LLM Top 10，卖点是网络层执法「无需 agent 或库」、模型与应用验证「数秒出风险评估」✅；免费 Explorer Edition 入口 explorer.aidefense.cisco.com ✅。竞争带已被整体收编：Lakera 现挂 Check Point 品牌脚标 ✅ 页脚口径（收购公告未抓到，无日期 🔍）、Prompt Security 挂「From SentinelOne」✅ 页脚口径（同上）——「AI 防火墙」创业带在 2024–2025 被网安巨头吸收完毕，独立上市者缺核证 🔍。

**反方观点**：① 护栏可绕过性——间接提示注入是护栏类产品的经典失效模式（台内 [[AI安全与对齐/智能体安全与攻防]] 记 PromptArmor 对 Atlassian Rovo 的间接注入实证），思科未公开第三方压测数据 🔍；② 防火墙本身是 AI 模型（✅ TechCrunch 原文），误报/漏报是结构性盲区而非 bug；③ 「网络层执法」承诺与应用层攻击粒度之间的张力：设备看到的流量与密文，护栏有效性取决于部署点位颗粒度；④ 「被平台吞并」的预警已自我实现——独立公司不复存在，但换来创业公司拿不到的分发面（网络存量 + Talos + Splunk）。

## 时间线

### 2026-11

- **2026-11-11** · 台内核查：AI Defense 产品页实测 ✅
  五组件结构（AI Cloud Visibility / Model & Application Validation / Runtime Protection / AI Access / Supply Chain Risk Management）、NIST + MITRE ATLAS + OWASP LLM Top 10 对齐、网络层无 agent 执法、Explorer 免费版；全页无 Robust Intelligence 品牌。同年发布「State of AI Security」年度报告。
  来源：cisco.com AI Defense 产品页（本会话实测）· 2026-11-11

- **2026-11-09** · [Cisco AI Defense to Add Anthropic's Claude Mythos for AI Red Teaming](https://blogs.cisco.com/ai/cisco-ai-defense-to-add-anthropics-claude-mythos-for-ai-red-teaming) ⚠️
  用前沿模型打前沿模型：Claude（Mythos）进入 AI Defense 红队管线；产品页已表述「思科是最早用 Anthropic Claude Mythos 做红队的企业之一」✅ 互证。
  来源：Cisco 博客（标题/日期取自检索列表，正文未抓）· 2026-11-09 · 🔍 需正文核
### 2026-10

- **2026-10-28** · [Cisco AI Defense joins ServiceNow's Control Tower Alliance](https://blogs.cisco.com/ai/cisco-ai-defense-joins-servicenows-control-tower-alliance) ⚠️
  智能体治理联盟化：把 AI Defense 检测接入 ServiceNow 控制塔体系。
  来源：Cisco 博客检索列表 · 2026-10-28 · 🔍 需正文核
- **2026-10-20** · [Building Trust into Enterprise AI Agents: Cisco AI Defense and Workday Agent Passport](https://blogs.cisco.com/ai/building-trust-into-enterprise-ai-agents-cisco-ai-defense-and-workday-agent-passport) ⚠️
  企业智能体「护照」式身份与信任框架。
  来源：Cisco 博客检索列表 · 2026-10-20 · 🔍 需正文核

### 2026-06

- **2026-06** · Policy Studio 与 Agent Harness Testing（智能体安全月）⚠️
  [Policy Studio（06-10）](https://blogs.cisco.com/ai/cisco-ai-defense-policy-studio-turning-unwritten-policy-into-adaptive-ai-guardrails)：把未成文政策转为自适应护栏；[Agent Harness Testing（06-16）](https://blogs.cisco.com/ai/agent-validation-explorer-edition)：智能体运行框架（harness）层验证进入 Explorer 版。
  来源：Cisco 博客检索列表 · 2026-06 · 🔍 需正文核

### 2026-03

- **2026-03-23** · [Cisco AI Defense: Explorer Edition Brings Agentic AI Red Teaming to Builders](https://blogs.cisco.com/ai/introducing-cisco-ai-defense-explorer) ⚠️
  免费开发者入口：explorer.aidefense.cisco.com（产品页 ✅ 互证），把算法红队开放给模型/智能体开发者。
  来源：Cisco 博客检索列表 · 2026-03-23

### 2026-02

- **2026-02-10** · [Know Your AI Stack: Introducing AI BOM in Cisco AI Defense](https://blogs.cisco.com/ai/know-your-ai-stack-introducing-ai-bom-in-cisco-ai-defense) ⚠️
  AI 物料清单（AI BOM）+ 同日「Security for the Agentic Era」博文——品类重心从「保护模型」正式移向「治理智能体栈」。
  来源：Cisco 博客检索列表 · 2026-02-10 · 🔍 需正文核

### 2025-10

- **2025-10-28** · [Cisco AI Defense Integrates with NVIDIA AI Enterprise Software to Secure AI Applications Using NVIDIA NeMo Guardrails](https://blogs.cisco.com/ai/cisco-ai-defense-integrates-with-nvidia-nemo-guardrails) ⚠️
  与护栏开源框架互操作——巨头护栏产品与生态框架的分工程度信号。
  来源：Cisco 博客检索列表 · 2025-10-28 · 🔍 需正文核

### 2025-04

- **2025-04-28** · [Foundation AI: Robust Intelligence for Cybersecurity](https://blogs.cisco.com/security/foundation-ai-building-the-intelligent-future-of-cybersecurity) ✅
  以 RI 团队为底座成立 Foundation AI；Yaron Singer 任 VP of AI and Security；开源路线：首个发布为 Llama 预训练 8B 安全基座模型（Hugging Face 可下载），后续预告安全推理模型与 AI-SCRM 情报（已嵌入 Secure Endpoint / Email Threat Protection / Secure Access）。
  来源：Cisco 博客（正文抓取）· 2025-04-28

### 2025-01

- **2025-01-15** · [Cisco AI Defense: Comprehensive Security for Enterprise AI Adoption](https://blogs.cisco.com/ai/cisco-ai-defense-comprehensive-security-for-enterprise-ai-adoption) ✅
  AI Defense 正式发布（DJ Sampath）：四组件、检测模型由 Scale AI 提供、遥测接 Talos；背书 Robust Intelligence 引入「the industry's first AI Firewall」；「更多内容 2025-03 分享」。
  来源：Cisco 博客（正文抓取）· 2025-01-15

### 2024-11

- **2024-11-11** · Robust Intelligence, Now Part of Cisco, Recognized as a 2024 Gartner Cool Vendor for AI Security ⚠️
  收购完成后三个月即获 Gartner「AI 安全酷厂商」类目认可——品类在 2024 年被分析师正式立项的时点证据。
  来源：Cisco 博客检索列表 · 2024-11-11 · 🔍 需正文核

### 2024-08

- **2024-08-26** · [Fortifying the future of Security for AI: Cisco Announces intent to acquire Robust Intelligence](https://blogs.cisco.com/news/fortifying-the-future-of-security-for-ai-cisco-announces-intent-to-acquire-robust-intelligence) ✅
  Tom Gillis 宣布收购意向：RI 早已是 Cisco Investments 被投企业；防护点名 prompt injection / data poisoning / jailbreaking，检测映射 OWASP 与 MITRE ATLAS；并入 Security Cloud。**金额未披露**；同文 2024-09-24 更新「已完成收购」。二手流传的「约 4 亿美元」未核到一手源 🔍。
  来源：Cisco 博客（正文抓取）· 2024-08-26

### 2021-12

- **2021-12-09** · [Robust Intelligence raises $30M Series B to stress test AI models](https://techcrunch.com/2021/12/09/robust-intelligence-raises-30m-series-b-to-stress-test-ai-models/) ✅
  Tiger Global 领投 3000 万美元 B 轮（超募），红杉连投（A 轮领投方）；RIME「AI 防火墙」产品形态确立：防火墙本身是 AI 模型。
  来源：TechCrunch（正文抓取）· 2021-12-09

### 2019

- **2019** · 公司创立 ✅
  Harvard 学术团队（Cambridge, MA）：Yaron Singer（CEO，终身教职）+ Kojin Oshiba（学生）；红杉同年领投 A 轮（合伙人 Bill Coughran）。「Israel Segev 联创 / MIT 起源」口径未获一手源支持 🔍。
  来源：红杉官网组合页 + TechCrunch · 2019

## 分析

1. **AI 防火墙品类的终局样本：不是死在竞争里，而是「毕业」进巨头产品线。** Cisco 收 RI（2024-08）、Check Point 挂 Lakera 品牌、SentinelOne 挂 Prompt 品牌（两家均 ✅ 页脚口径、日期未核）三连同向，2024–2025 完成收编。对「AI 安全赛道」叙事的最大修正：这个品类的产业终局更接近网安巨头的生产线，而非独立上市公司——护栏创业公司的退出通道从一开始就指向收购。
2. **产品化三段论：收购（2024-08）→ 品牌化（AI Defense，2025-01）→ 平台化（Foundation AI，2025-04）。** RI 的真正遗产不是一个产品而是思科的 AI 安全引擎；Singer 从 CEO 变 VP 是典型 acq-hire + 平台化。开源 8B 安全模型在巨头中少见——用开源建品类话语权，配合 OWASP/NIST/ATLAS 对齐话术，是「标准制定者」打法而非「功能卖家」打法。
3. **金额口径纪律：官方未披露，「约 4 亿美元」只可作为待核二手口径。** Cisco Investments 先投后购的结构（公告 ✅ 确认 RI 已是被投企业）说明这是战略并购；对 [[商业与投融资/AI人才与并购潮]] 而言，该交易的价值在结构（投后并购、团队整编为平台组织）而非估值数字。
4. **网络层执法 vs 应用层护栏是路线赌注，不是工程细节。** 思科把护栏嵌入网络 fabric（「无需 agent 或库」✅），分发优势（网络存量 + Talos + Splunk）碾压创业公司；但间接提示注入是应用层/数据层攻击，网络点位看到的是流量与密文——护栏有效性取决于部署颗粒度。这是「无 agent 部署」承诺与攻击现实之间的结构性张力，待第三方压测公开 🔍。
5. **2026 年的产品节奏是品类重心迁移的直接证据。** AI BOM（供应链）→ Agent Harness Testing（行为）→ Agent Passport / Control Tower（治理联盟）→ Claude Mythos（用前沿模型打前沿模型），与 [[AI安全与对齐/智能体安全与攻防]] 的「治理焦点从模型转向权限」判断互证。Claude 红队合作既是能力也是依赖：护栏商对模型商的竞合关系值得持续跟踪。
6. **证据缺口显式登记**：① 收购金额一手源；② Lakera / Prompt Security 被收购的公告日期；③ RI 域名现状（本会话超时）；④ AI Defense 收入/客户规模（思科不分拆披露 🔍）；⑤ 护栏绕过/误报率的第三方压测。补全任一项即可升级对应段落的证据等级；合规框架（NIST AI RMF 等）的监管语境归 [[AI安全与对齐/AI监管政策]]，模型层安全的分工归 [[AI安全与对齐/对齐与可解释性研究]]。

## 关联线索

- [[AI安全与对齐/智能体安全与攻防]] — 2026 产品重心（AI BOM / Agent Harness / Agent Passport）对应的攻防主战场
- [[AI安全与对齐/AI监管政策]] — NIST / OWASP / MITRE ATLAS 对齐话术的监管与合规语境
- [[AI安全与对齐/对齐与可解释性研究]] — 模型层安全与产品层护栏的分工边界
- [[行业应用/AI与网络安全]] — AI 安用品类的需求侧总账
- [[商业与投融资/AI人才与并购潮]] — AI 安全创业带被收编的三个同向样本（RI / Lakera / Prompt Security）
- [[训练与数据/ScaleAI与数据标注]] — AI Defense 检测模型的供给侧（2025-01 发布博文 ✅）
