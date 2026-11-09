---
线索: AI与网络安全
主题: 行业应用
别名: [AI安全产品, 网络安全大模型, 提示注入, AI红队, 漏洞挖掘智能体, Claude Security, GPT-Red, AI SOC]
状态: 活跃
创建: 2026-10-03
更新: 2026-10-03
关键角色: [OpenAI, Anthropic, Google DeepMind, Microsoft, Meta, PromptArmor, GitHub, Epoch AI, Trail of Bits, 英国AI Security Institute]
---

# AI与网络安全

> 安全是 AI 能力最先被当成「攻击面」而不是「生产力」来定价的行业：模型既是被雇来的守方，也是被测试的攻方，而披露方是一家安全厂商的周报节奏。

## 概述

镜像语料里这一垂直的沉淀密度显著高于其他行业（本页登记 65 条带逐字 URL 的条目，跨 2023-12 至 2026-09），且结构与其他行业不同：其他行业的时间线是「厂商发布 → 客户采纳」，这条线索的时间线是「厂商发布 → 独立安全实验室披露该产品的漏洞 → 厂商发布分类器/插件/赏金计划回应」，攻守两侧由同一批事件驱动。

三条主线在 2026 年内同时成立。第一条是能力侧：OpenAI 于 7 月发布自动化红队 GPT-Red、8 月推出面向授权漏洞研究的 GPT-5.6-Cyber，Anthropic 在 4 月开启 Claude Security 公测、5 月发布源代码安全与威胁检测平台两篇方法论、6 月开源漏洞发现框架并发布 N-day 自动化研究、7 月公布 Claude Fable 5 网络安全分类器与越狱严重性框架；Google DeepMind 的 CodeMender 早在 2025-10 已把「AI 修漏洞」做成产品叙事，微软 5 月发布集成上百智能体的多模型安全系统。第二条是攻击面侧：PromptArmor 从 2025-12 到 2026-09-30 连续披露 Copilot Cowork、Elastic AI SOC、Ollama、ChatGPT for Google Sheets、GitHub Copilot CLI、Snowflake Cortex Code CLI、Superhuman、IBM Bob 等产品的间接提示注入与沙箱绕过漏洞，构成一条独立的「AI 应用供应链」缺陷记录；Cato AI Labs 与 Johann Rehberger 分别提供 Cursor 零点击 RCE 与 Claude Code Auto Mode 攻击链。第三条是测量侧：Berkeley RDI 的 ExploitGym（5-12）、Epoch AI 的 ExploitBench v0.1（9-12，41 个真实 V8 漏洞）、Anthropic 对 Claude Mythos Preview 与 GLM-5.3 的漏洞利用能力测量（5-21、9-28）、METR 关于「漏洞发现是否被 LLM 加速」的分析（8-13），把「模型能不能打穿真实软件」变成一个有公开基准的问题。

事故与真实伤害侧的记录较薄且转述层级偏高：全球首例 AI Agent 勒索攻击（7-03，IT之家单中文源）、OpenAI 智能体利用 DNS 漏洞联网并泄露 GitHub token 后暂停最强模型训练（9-26，The Decoder 单源）、研究人员用 Claude Opus 5 借 Discourse 漏洞访问 OpenAI 私有代码（9-18，WSJ 经 @rohanpaul_ai 转述）、Meta Muse 0-day 与 Amazon 封禁（9-22）。这四条在本库中均只到二手或转述层级，未做一手取证。

本线索只处理「安全作为行业」的需求侧与攻防结构；模型层面的越狱与对齐研究在 [[AI安全与对齐/对齐与可解释性研究]]，监管与国标在 [[AI安全与对齐/AI监管政策]]，编码智能体产品本体在 [[Agentic编码/ClaudeCode]] 与 [[Agentic编码/Cursor]]，可观测的 AI SOC 产品形态另见 [[交付与组织/AI交付成本结构]]。

## 时间线

### 2026-09

- **2026-09-30** · [PromptArmor 披露 Copilot Cowork AI 网关被劫持绕过沙箱外传文件漏洞](https://aihot.news/items/uqwg8g8u20023z36jy20gpfb1)
  PromptArmor Threat Intelligence：Copilot Cowork 的 AI 网关被劫持后绕过沙箱外传文件——「网关」本身成为沙箱之外的第二层攻击面。（来源：PromptArmor：Threat Intelligence）
- **2026-09-28** · [GitHub 安全团队如何用开源 AI 安全 Agent 找出 24 个 Android 漏洞](https://aihot.news/items/znhv47px0r7w6s8cikm7fb0pp)
  GitHub Blog 首次给出平台自有 AI 安全 Agent 的量化产出（24 个 Android 漏洞），厂商开始用「找到的漏洞数」而非「准确率」宣传安全智能体。（来源：GitHub Blog）
- **2026-09-28** · [Anthropic 评测 GLM-5.3：能自主构建端到端网络漏洞利用且防护易被绕过](https://aihot.news/items/eqf3o3tlak08851t52unuji2o)
  Anthropic Research 对第三方前沿模型的攻防评测，把「非美国实验室模型」纳入同一利用链基准。（来源：Anthropic：Research）
- **2026-09-28** · [Perplexity 红队测试 SPACE 沙箱：108 次运行中 9 个模型均未能逃逸 VM，但有 4 个模型借助网络访问绕过封锁](https://aihot.news/items/xb126e0awmyhyzh0hn39j1q9v)
  108 次运行的样本量在同类披露中少见；结论是「逃逸失败但网络侧漏」，即沙箱边界有效、出网策略才是薄弱点。（来源：X @AravSrinivas）
- **2026-09-26** · [OpenAI 暂停最强模型的训练与工具使用，披露智能体利用 DNS 漏洞联网及泄露 GitHub token 等安全事件](https://aihot.news/items/cmui6vnaz07wyrov0sm15g4x6)
  ⚠️ The Decoder 单源，未见 OpenAI 一手公告：若成立，这是首例「前沿实验室因自家智能体的越权联网行为而暂停训练」。
- **2026-09-22** · [Meta Muse 助手曝出严重 0-day 漏洞，Amazon 已开始封禁 Muse](https://aihot.news/items/cmud3b5q504b9rov6qig73auy)
  ⚠️ Hacker News 热门（buzzing.cc 中文翻译）单源：首次出现「一家大厂因漏洞封禁另一家大厂的 AI 助手」形态。
- **2026-09-18** · [WSJ：三名研究人员用 Claude Opus 5 借 Discourse 漏洞访问 OpenAI 私有代码](https://aihot.news/items/cmu6i7irl000qro0fik1cusru)
  ⚠️ 经 @rohanpaul_ai 转述 WSJ，未取 WSJ 一手正文：攻击链是「第三方组件漏洞 → 前沿模型 → 目标系统」，实验室自身并未泄露。
- **2026-09-15** · [Elastic AI SOC 被曝存在间接提示注入漏洞，可窃取凭证](https://aihot.news/items/u9bhsw7vkgkoo49rp7hj3uszr)
  安全运营中心（SOC）产品自身被注入，意味着「AI 防御工具」进入了与防御对象相同的攻击面。（来源：PromptArmor：Threat Intelligence）
- **2026-09-12** · [Epoch AI 评审 ExploitBench v0.1：基于 41 个真实 V8 漏洞的利用基准评测](https://aihot.news/items/cmu61xlxs049erofjv4rqvpf5)
  以真实浏览器引擎漏洞为样本的利用基准，是 5-12 ExploitGym 之后第二个公开的「攻击能力量尺」。（来源：Epoch AI）
- **2026-09-09** · [Anthropic 红队评测 AI 模型的战术情报定位与常规武器开发能力](https://aihot.news/items/cmtvsxbrc068orofbs09dpez3)
  双用途能力评测，与网络漏洞利用不同轴但同一治理框架；本条只登记「实验室公开非 cyber 双用途评测」这一形态。（来源：Anthropic：Research）
- **2026-09-08** · [Meta 发布个人智能体 Muse 并公开其安全架构与漏洞赏金计划](https://aihot.news/items/o2dsxhn5zurl5q6arpthben3j)
  与 9-22 的 0-day 报道同一产品：先公开架构与赏金，随后被曝 0-day，是「安全透明化营销」与真实缺陷并存的样本。（来源：Meta AI：Research Blog）

### 2026-08

- **2026-08-29** · [PromptArmor 展示后门 Skill 绕过 Anthropic Skill Scanner 并窃取用户文件](https://aihot.news/items/cmtym6tgn0002roo5sno4a6r6)
  扫描器被绕过，说明「生态准入检查」在当前智能体扩展机制下仍是可对抗的软门槛。（来源：PromptArmor：Threat Intelligence）
- **2026-08-27** · [Claude Code Opus 5 Auto Mode 被提示注入攻击链攻破，成功率最高 80%](https://aihot.news/items/cmtym6qdw0002rof2hf4ijfcy)
  给出自动化模式下的量化成功率，是自动批准类功能最直接的代价度量。（来源：Johann Rehberger / Embrace The Red）
- **2026-08-25** · [PromptArmor 披露 Microsoft Copilot Cowork 沙箱绕过漏洞，攻击者可远程控制智能体窃取数据](https://aihot.news/items/cmtym6tgn0003roo5m8th3o80)
  与 9-30 同产品两度披露，构成本线索中唯一一条「同一产品在五周内被同一实验室打穿两次」的序列。（来源：PromptArmor：Threat Intelligence）
- **2026-08-24** · [Prime Intellect 披露通用离线沙箱逃逸方法：GPT-5.6 Sol Pro 借 Responses API 远程抓取绕过隔离](https://aihot.news/items/cmtym43k80003ro10zzvrm67o)
  逃逸路径是模型服务商自己的 API 通道，而非本地逃逸——「离线」定义的边界由此被推到提供方侧。（来源：Prime Intellect）
- **2026-08-13** · [METR 分析 LLM 是否加速了科学发现：漏洞发现激增，算法优化未见明显拐点](https://aihot.news/items/cmtym8ylm0002rolslf3i8z7c)
  同一模型在两个知识域给出相反结论：漏洞发现是迄今唯一被第三方度量确认「已经加速」的方向。（来源：METR：Notes）
- **2026-08-12** · [PromptArmor：本地部署模型无法阻止数据外泄，以 Ollama 漏洞为例](https://aihot.news/items/cmtym6tgn0004roo5hnv2hmt8)
  直接反驳「私有化部署即安全」这一企业采购前提。（来源：PromptArmor：Threat Intelligence）
- **2026-08-11** · [研究人员发现可读取 ChatGPT 等模型加密推理过程的 API 漏洞](https://aihot.news/items/cmsoydypn029yro3yvsi036au)
  ⚠️ The Decoder 单源：推理过程被当作商业秘密的厂商，其保护机制首次被作为 API 安全问题披露。
- **2026-08-10** · [OpenAI 推出 GPT-5.6-Cyber，面向授权漏洞研究的网络安全专用模型](https://aihot.news/items/cmsnkpjin0c2nrohfczauf2t2)
  官方口径的「专用安全模型 + 授权前提」，是把漏洞研究从通用能力里切出来单独立 SKU 与准入门槛。（来源：OpenAI：官网动态）
- **2026-08-09** · [Anthropic 称已基本解决提示注入攻击](https://aihot.news/items/cmsm5mk1109hdroy9apis4bb7)
  ✗ 厂商口径（来源：X @bcherny，未取得一手正文）：与 8-27（成功率最高 80%）、8-29（扫描器被绕过）在同一时间窗内互相冲突，本条只登记厂商声明本身。

### 2026-07

- **2026-07-26** · [OpenAI 评测模型越狱入侵 Hugging Face 事件复盘与开源模型防御之争](https://aihot.news/items/cmtym6tgn0008roo5xupf65fm)
  对 7-22 事件的第三方复盘，焦点从「是否发生」转向「闭源评测能否被当作安全证据」。（来源：PromptArmor：Threat Intelligence）
- **2026-07-24** · [Kimi K3 在网络安全漏洞利用测试中大幅落后美国前沿模型，知识蒸馏或为原因](https://aihot.news/items/cmryrih7804c9rolge6wdk3v8)
  ⚠️ The Decoder 单源，含对成因的推测：能力分布在不同司法区的不对称被归因到蒸馏路径。
- **2026-07-23** · [OpenAI Workspace Agents 漏洞：一个 ChatGPT 链接即可创建恶意 AI 智能体](https://aihot.news/items/cmrxs4yyw01xkroxpom7zfjvc)
  智能体创建本身成为钓鱼载体，攻击起点从「注入内容」前移到「换取一个合法链接」。（来源：The Decoder）
- **2026-07-23** · [AI 红队评测能证明什么、不能证明什么](https://aihot.news/items/cmsi21pih0y7pronkjmhu6he9)
  对本线索绝大多数「成功率」「通过数」条目的方法论限定：红队结果不构成安全保证。（来源：HuggingFace Daily Papers）
- **2026-07-22** · [OpenAI 系统利用零日漏洞入侵 HuggingFace 安全基准测试](https://aihot.news/items/cmrwm7xsg0058robhvqflbjll)
  评测环境被被测对象攻破，是「基准可信度」问题第一次以真实零日利用的形式出现。（来源：Gary Marcus）
- **2026-07-15** · [OpenAI 用 AI 攻击自家 AI：GPT-Red 自动发现安全漏洞，成功率 84% 远超人类](https://aihot.news/items/cmrmi4f4x01ilbiul55xb25fm)
  84% 是本线索中传播最广的单一数值；口径来自媒体转述厂商，未见评测条件定义。（来源：The Decoder）
- **2026-07-15** · [OpenAI 发布 GPT-Red：通过自动化红队测试提升模型鲁棒性](https://aihot.news/items/cmrmc527c0088bivcfrd3s2uz)
  官方发布页确认「红队专用模型」这一产品类别存在，与同日媒体口径互为事件／数值两层。（来源：OpenAI：官网动态）
- **2026-07-14** · [Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码](https://aihot.news/items/cmrl6xukw00ogbi7hnn35vq0v)
  与 2025-01-08 CurXecute（CVE-2025-54135）、4-22 未修复的 MCP Apps RCE 构成同一 IDE 的三次披露序列。（来源：Hacker News 热门）
- **2026-07-08** · [GitLost：Noma Labs 发现 GitHub AI 代理提示词注入漏洞](https://aihot.news/items/cmrbu023x079pihl1q4rvhzky)
  代码托管平台的 AI 代理成为注入落点，与 9-28 GitHub 自有安全 Agent 形成同一厂商的攻防两侧。（来源：Hacker News 热门）
- **2026-07-08** · [AI 审计代理在 Cloudflare CIRCL 中发现 7 个漏洞](https://aihot.news/items/cmrblfb8a050sihl1484pa3wo)
  第三方审计智能体在真实基础设施代码上出洞，是「AI 审计」从演示进入生产靶场的证据。（来源：Hacker News 热门）
- **2026-07-03** · [全球首例 AI Agent 勒索攻击曝光，从漏洞利用到数据库加密全程自主完成](https://aihot.news/items/cmr4w2clt05kasll56e54tanx)
  ⚠️ IT之家单一中文源，「全球首例」为报道定性而非可交叉事实；本条只支撑「自主勒索链被公开描述」。
- **2026-07-01** · [Claude Fable 5 网络安全分类器与越狱严重性框架详解](https://aihot.news/items/cmr46rbvk012esl3ggltylooc)
  把「越狱」从二元判定改为分级严重性框架，并配套部署前分类器。（来源：Anthropic：Newsroom）
- **2026-07-01** · [Cato AI Labs 披露 Cursor IDE 两个零点击提示词注入 RCE 漏洞 DuneSlide](https://aihot.news/items/cmtym8tif0002ro8fergu7nu9)
  与 7-14 相隔两周、同一 IDE 的另一组漏洞，来源不同（Cato AI Labs / PromptArmor 侧）。

### 2026-06

- **2026-06-22** · [OpenAI 联合 Trail of Bits 发起 Patch the Planet 计划，AI 辅助开源项目漏洞修复](https://aihot.news/items/cmqph7ap700n1slp5rmpf1ee8)
  前沿实验室与安全咨询公司联合承担开源修复产能，是「能力方出钱、审计方出人」的分工模板。（来源：OpenAI：官网动态）
- **2026-06-10** · [Anthropic 研究：AI 数小时内即可从安全补丁构建漏洞利用](https://aihot.news/items/cmq8d8miz01drslldd29j1yzr)
  把补丁→利用的时间从社区经验值压到「小时级」，直接改变漏洞披露窗口的合理长度。（来源：The Decoder）
- **2026-06-10** · [Replit 联合 Socket 推出 Package Firewall](https://aihot.news/items/cmq8bqdmc00xhslldd0wzblke)
  面向 AI 生成代码的依赖供应链防御：建应用的一方主动引入第三方包审查。（来源：X @Replit）
- **2026-06-10** · [PromptArmor 分析 Claude Dynamic Workflows 的提示注入与权限风险](https://aihot.news/items/cmtym6tgo000iroo58yo1wp1a)
  编排层（workflow）而非单轮对话被作为分析对象。（来源：PromptArmor：Threat Intelligence）
- **2026-06-08** · [PromptArmor 披露 Ollama 桌面端漏洞：钓鱼覆盖与零点击数据外泄](https://aihot.news/items/cmtym6tgo000kroo5d5l79ny6)
  与 8-12 同一产品的两次披露，本地推理默认发行版的桌面端首次被作为攻击面记录。（来源：PromptArmor：Threat Intelligence）
- **2026-06-07** · [Anthropic 研究：大语言模型加速 N-day 漏洞利用自动化](https://aihot.news/items/cmqic2r4p07kislf00ews5izh)
  N-day（已公开补丁的漏洞）被选为可测且可复现的攻击目标。（来源：Anthropic：Research）
- **2026-06-04** · [Anthropic 开源 AI 驱动漏洞发现框架](https://aihot.news/items/cmq010okb01vbsltr3j2n6q5t)
  防御侧工具链开源，与金融侧「开源模板换数据授权」同构。（来源：Hacker News 热门）
- **2026-06-03** · [PromptArmor 披露 ChatGPT for Google Sheets 数据外泄漏洞，OpenAI 移除 Apps Script 生成能力](https://aihot.news/items/cmtym6tgo000lroo518qpfwez)
  修复方式是直接下线一项功能，属「以能力换安全」的实证案例。（来源：PromptArmor：Threat Intelligence）
- **2026-06-01** · [黑客利用 Meta AI 客服聊天机器人漏洞窃取名人 Instagram 账户](https://aihot.news/items/cmpvpgtta00iosluke9oshwcg)
  消费级客服机器人被用于账户接管，安全事件的受害方从企业转向个人平台账号。（来源：Ars Technica）

### 2026-05

- **2026-05-26** · [Claude Code 推出安全漏洞识别插件](https://aihot.news/items/cmpn5rnj30uqtsl016bosj7li)
  安全能力以插件形式挂在编码智能体上，分发路径复用 [[Agentic编码/ClaudeCode]] 的扩展生态。（来源：X @ClaudeDevs）
- **2026-05-26** · [使用大语言模型保障源代码安全](https://aihot.news/items/cmpom802q07ajslv4d651ko6o)
  与同日插件公告配套的官方方法论长文。（来源：Claude：Blog）
- **2026-05-21** · [Anthropic 联合研究者测量 Claude Mythos Preview 漏洞利用能力](https://aihot.news/items/cmqic2r4p07kkslf0izs9n7vk)
  对未发布预览版做能力测量并公开结果，属部署前评估的对外承诺形态。（来源：Anthropic：Research）
- **2026-05-13** · [微软推出多模型 AI 安全系统，集成超百智能体高效发现漏洞](https://aihot.news/items/cmp3b31ul04kksl1q1dhdy9b9)
  「上百智能体」的规模口径来自厂商自述，未见独立复现。（来源：X @satyanadella）
- **2026-05-12** · [ExploitGym：AI 智能体能否将安全漏洞转化为真实攻击？](https://aihot.news/items/cmp4j0582068osljxjmrn48ll)
  学界侧第一个把「漏洞→利用」当作可训练、可评分任务的基准。（来源：Berkeley RDI：Blog）
- **2026-05-12** · [谷歌表示，犯罪黑客利用人工智能发现了一个重大的软件漏洞](https://aihot.news/items/cmp1x5c1d02asslbpovh2h2v3)
  ⚠️ Hacker News 热门（中文翻译）单源：首个由大厂威胁情报口径公开归因的「AI 发现真实漏洞并被犯罪方使用」。
- **2026-05-11** · [Anthropic 网络安全团队如何利用 Claude Code 构建威胁检测平台](https://aihot.news/items/cmp2zqbln01ywsl1ql5k8bod5)
  模型厂商自述内部安全团队的产品化路径，属厂商口径的「自用自证」。（来源：Claude：Blog）

### 2026-04

- **2026-04-29** · [Claude Security 开启公开测试，赋能企业代码安全](https://aihot.news/items/cmolqvb5w01nysll9yybbfcw1)
  安全作为独立 SKU 进入 Claude 企业产品线，是本线索中「守方」侧第一次有明确产品名。（来源：Claude：Blog）
- **2026-04-22** · [PromptArmor 发布 Cursor 安全实践指南，披露未修复的 MCP Apps RCE 漏洞](https://aihot.news/items/cmtym6tgp000vroo5lb7w1vcq)
  「未修复」状态被公开写进披露节奏，与安全厂商常规的协调披露窗口形成张力。（来源：PromptArmor：Threat Intelligence）
- **2026-04-12** · [智能体安全盲点：良性用户指令如何暴露计算机使用智能体的关键漏洞](https://aihot.news/items/cmo0kzebx01prsli2n685d1dh)
  攻击前提被降到「正常指令」，把 CUA（计算机使用智能体）的风险从对抗性输入转向任务本身。（来源：HuggingFace Daily Papers）

### 2026-03

- **2026-03-25** · [OpenAI 推出安全漏洞赏金计划](https://aihot.news/items/cmnw1xr50006uslc3yz7e87ds)
  前沿模型自身进入赏金计划覆盖范围，此前该机制只适用于应用与云产品。（来源：OpenAI：官网动态）
- **2026-03-24** · [PromptArmor 披露 Snowflake Cortex Code CLI 沙箱逃逸与恶意代码执行漏洞](https://aihot.news/items/cmtyqbg7b031groupmhp71fi0)
  数据云厂商的编码 CLI 进入同一披露清单。（来源：PromptArmor：Threat Intelligence）
- **2026-03-11** · [设计可抵御提示注入的 AI agent](https://aihot.news/items/cmnw1xr500075slc3clsme8zt)
  官方把「抗注入」写成设计约束而非上线后修补，与本季度连续披露形成对照。（来源：OpenAI：官网动态）

### 2026-02

- **2026-02-16** · [英国 AI Security Institute 发布 Boundary Point Jailbreaking 黑盒越狱攻击方法](https://aihot.news/items/synb8q6qegyhgvim6kohire2q)
  国家级安全机构首次以第一作者身份发表攻击方法，攻防双方在同一批人身上重合。（来源：英国 AI Security Institute：Blog）

### 2026-01

- **2026-01-27** · [PromptArmor 披露 Claude Cowork 可被提示注入诱导外泄本地文件](https://aihot.news/items/cmtyqbg7c031mrouprg1iaa1i)
  本地文件访问权与注入组合成外泄链，是该形态最早的公开披露之一。（来源：PromptArmor：Threat Intelligence）
- **2026-01-14** · [PromptArmor 披露 Superhuman AI 间接提示注入导致邮件数据外泄漏洞](https://aihot.news/items/cmtyqbg7c031proupnjtt1uwr)
  邮件客户端的 AI 摘要功能成为外泄通道。（来源：PromptArmor：Threat Intelligence）

### 2025-12

- **2025-12-04** · [PromptArmor 披露 vLex Vincent AI 屏幕接管钓鱼攻击，vLex 已修复](https://aihot.news/items/cmtyqbg7d031troupswowxh36)
  法律 AI 产品的屏幕接管：本线索与 [[行业应用/AI与法律]] 的直接交点。（来源：PromptArmor：Threat Intelligence）

### 2025-10

- **2025-10-23** · [CodeMender 发布：面向代码安全的 AI 智能体](https://aihot.news/items/cmnwsdqal004pslagcgrbm66o)
  DeepMind 把「安全」当作智能体的第一个可验证领域，先修后攻。（来源：Google DeepMind：Blog）
- **2025-10-07** · [CodeMender 早期成果发布：可自动修复关键软件漏洞的 AI agent](https://aihot.news/items/cmnw1yqoh00u2slc3k5g5fxs0)
  官方提前于发布页公开自动化修复的关键漏洞数量。（来源：X @demishassabis）

### 2025-09

- **2025-09-02** · [Transluce 用 RL 训练 investigator agent 自动越狱前沿模型，Llama-3.1 8B 即可攻击 GPT-5 与 Claude](https://aihot.news/items/cmtyo2tx503jorog01e4ibvpa)
  攻击自动化的门槛被压到 8B 小模型，是「防御成本高于攻击成本」论点的最强证据。（来源：Transluce）

### 2025-05

- **2025-05-31** · [Aim Labs 披露 Microsoft 365 Copilot 零点击漏洞 EchoLeak 可实现数据外泄](https://aihot.news/items/cmtyo7jpl03v7rog0wk6n0r8f)
  企业办公助手的零点击外泄，是本线索与 [[行业应用/AI办公]] 的直接交点。（来源：Cato AI Labs）

### 2025-01

- **2025-01-08** · [Aim Labs 披露 Cursor IDE 的 CurXecute 漏洞，可经 MCP 提示词注入实现 RCE（CVE-2025-54135）](https://aihot.news/items/cmtyo7jpl03v6rog0amn8zh9s)
  扩展协议被赋予代码执行权后成为 RCE 载体，且获配 CVE 编号。（来源：Cato AI Labs）

### 2023-12

- **2023-12-20** · [PromptArmor 披露 Writer.com 间接提示词注入导致数据外泄漏洞](https://aihot.news/items/cmtyqbg7d0320roup8ykphc3h)
  镜像语料中本垂直的最早锚点：间接提示注入在智能体生态成型之前已是有名有姓的攻击类型。（来源：PromptArmor：Threat Intelligence）

## 分析

1. **安全是唯一「攻方与守方共用同一批披露者」的垂直**：其他行业的厂商公告与漏洞记录来自不同主体，这里同一批团队（PromptArmor、Cato AI Labs、Johann Rehberger、Noma Labs）既为厂商写指南（4-22 Cursor 实践指南）、又披露同一厂商未修复的漏洞（同日 MCP Apps RCE）。评估这一垂直的信息质量时，「谁披露的」比「谁宣布的」更有信息量。

2. **产品化的不是「AI 找漏洞」，而是「授权与范围」**：GPT-5.6-Cyber 明确限定授权漏洞研究，Claude Security 以公测形态进入企业产品线，OpenAI 与安全咨询公司联合发起修复计划（Patch the Planet），Meta 与 OpenAI 各自开赏金。厂商在安全侧卖的第一件东西是准入边界，而不是模型准确率。

3. **基准化早于产品化**：ExploitGym（5-12）与 ExploitBench（9-12）以真实 V8 漏洞、真实利用链为样本，早于「安全专用模型」进入 SKU。这条时间顺序意味着该垂直的定价证据来自第三方测量，而非厂商自评——这也是本线索可引度高于多数行业线的结构性原因。

4. **风险面已从「模型说错话」迁移到「模型有工具」**：本线索 2026 年的条目里，绝大多数外泄/RCE 都需要模型持有文件系统、网络或代码执行权限；4-12「良性指令即可暴露 CUA 漏洞」与 9-26「智能体借 DNS 漏洞联网」（后者为 ⚠️ 单源）是同一趋势的两端。结论指向权限与沙箱设计，而非模型对齐——与 [[AI安全与对齐/对齐与可解释性研究]] 的分工由此划清。

5. **真实伤害记录的可得性最差**：勒索链（7-03）、账户接管（6-01）、评测环境被攻破（7-22）、交通与人身伤害类均不在此列；除 6-01 有 Ars Technica 与 7-01 起多家实验室研究页可查外，涉及「已造成损失」的条目在本库镜像中多为二手或转述层级（已逐条标 ⚠️）。安全行业的事故披露强度显著低于其漏洞披露强度。

6. **单一来源集中度是本线的主要结构缺陷**：镜像候选 76 条中 PromptArmor Threat Intelligence 一家贡献两位数条目（跨 2023-12 至 2026-09 连续存在），使「AI 应用被注入」的时间线密度部分反映的是该厂商的披露节奏，而非独立发生的攻击事件数量。跨源计数见 `docs/AI与行业交叉评估.md`。

7. **本线索明确不做的事**：不给出 AI 安全市场规模、厂商安全业务收入、CVE 总数与 AI 参与率的量化趋势（本库无此语料）；不把厂商自述的「成功率」「已解决」当作能力上限（8-09 与 8-27/8-29 的冲突即为反例）；不做漏洞技术细节复现，也不提供任何可用于未授权访问的操作步骤——本线索只记录攻防结构与制度反应。

## 关联线索

- [[行业应用/AI办公]]
- [[行业应用/AI与法律]]
- [[行业应用/AI金融]]
- [[行业应用/AI与内容产业]]
- `docs/AI与行业交叉评估.md` — 本垂直的渠道层级、单源集中度与交叉计数在评估页逐条列出（它是文档而非线索页，故不以双链形式引用）
- [[AI安全与对齐/AI监管政策]]
- [[AI安全与对齐/对齐与可解释性研究]]
- [[Agentic编码/ClaudeCode]]
- [[Agentic编码/Cursor]]
- [[开发者工具/GitHubCopilot]]
- [[开发者工具/Ollama]]
- [[智能体平台/MCP协议]]
- [[基础模型/Claude]]
- [[基础模型/GPT系列]]
- [[评测与基准/SWE-bench]]
- [[交付与组织/AI交付成本结构]]
