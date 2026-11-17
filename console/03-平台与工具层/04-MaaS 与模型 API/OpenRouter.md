---
层: 03-平台与工具层
节点: 04-MaaS 与模型 API
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/智能体平台/OpenRouter.md
---

# OpenRouter

> 多模型 API 聚合与路由的 MaaS 分发入口：一个 API、一份账单纳管 400+ 模型（2026-05 官方口径），推理不加价、只在充值时收费；周吞吐六个月从 5 万亿涨到 25 万亿 token（2026-05），却没能守住独立——2026-08-19 官宣并入 Stripe（Bloomberg 口径对价 $7B+、上轮估值 13 亿美元），2026-11-10 Stripe 宣布交割完成，90 人团队成为支付基础设施里的「AI 流量路由器」。

## 是什么

**OpenRouter, Inc.**（官网 [openrouter.ai](https://openrouter.ai/) ✅）定位多模型统一网关：「One API for text, image, video, and audio models」，纯托管、「nothing to deploy or self-host」✅ 官网口径。法律实体 OpenRouter, Inc.，地址纽约麦迪逊大道 169 号，合同适用纽约州法，付款通道为 Stripe（USD）与 Coinbase（加密货币）✅ [服务条款](https://openrouter.ai/terms)。商业模式一句话：推理不加价——「We pass through the pricing of the underlying providers without any markup」，收入来自充值手续费与 BYOK 超额费（PAYG 内含每月 2.5 万美元 BYOK 免费额度，超出按站内同价的 5% 收）✅ [FAQ](https://openrouter.ai/docs/faq)。模型覆盖官方口径 400+（2026-05/08）✅，第三方页称「500 多个模型与 80 多家服务商」⚠️ 转引口径（2026-09）。

**创始人核验是本卡第一处证伪**：CEO 为 **Alex Atallah**——OpenSea 联合创始人、前 CTO，TechCrunch 报道中由其本人将公司比作「the equivalent of Stripe for AI」✅（2026-08-16）；百度百科词条同口径 ⚠️。预设的「创始人 Alex Albert」不成立：该名字属于 Anthropic 的 Claude 关系负责人，本次检索中搜索引擎摘要亦曾误报，已排除（2026-11-12 核验）。官方博客署名「Alex, Chris, Louis, and the OpenRouter team」（2026-08-19），Chris 与 Louis 的全名与角色未披露 🔍。上线窗口：不晚于 2023-08（HN 第三方应用已引用 openrouter.ai 的 GPT-4 32k 通道）⚠️，确切成立日期 🔍。团队 90 人（2026-08-19 官方原话「90-person startup」）✅——并入 Stripe 前保持小团队高人效。

**融资与出售压缩在 90 天内完成**：2026-05-28 官宣 B 轮 1.13 亿美元，CapitalG（Alphabet 增长基金）领投，NVentures（NVIDIA）、ServiceNow/MongoDB/Snowflake/Databricks 四家 Ventures、AMP PBC、Pace Capital 跟投，a16z 与 Menlo Ventures 为既有投资方 ✅ [官方公告](https://openrouter.ai/blog/announcements/series-b/)；TechCrunch 名单另列 Sequoia ⚠️ 与官方名单有出入。上轮估值 13 亿美元（TechCrunch 口径）；2026-08-16 Bloomberg 报道 Stripe 将以超 70 亿美元收购 ✅ [TechCrunch](https://techcrunch.com/2026/08/16/stripe-will-reportedly-acquire-ai-gateway-startup-openrouter-for-7b/)；2026-08-19 官方确认「same mission, same name, same product, same roadmap」、预计数周内交割 ✅；2026-11-10 Stripe 宣布「OpenRouter is now part of Stripe」⚠️ HN 转引。早期轮次（种子/A 轮）金额与时点未获一手口径 🔍；「无 VC 自报盈利」预设双双证伪——机构名单在案，盈利口径官方页面无声明、登记为证据缺口 🔍。

**产品机制是网关 + 路由 + 计费三合一**：OpenAI SDK 指向 OpenRouter 即 drop-in 替换 ✅ 官方 quickstart；上游单点故障自动 fallback（「automatically fall back to the next provider」）✅ FAQ；路由偏好用变体后缀表达——`:nitro` 按吞吐、`:floor` 按价格、`:exacto` 按工具调用可靠性 ✅ FAQ。隐私默认零保留：「Prompt and completion are not logged by default」，开日志换 1% 折扣；默认不放行有日志行为的上游 provider，除非用户打开开关 ✅ FAQ；欧盟流量经 eu.openrouter.ai 解密并只路由欧洲端点 ✅。周边配套：MCP server（mcp.openrouter.ai/mcp）、三语言官方 SDK（TypeScript/Python/Go）与 Agent SDK ✅ 官方 docs；Auto 与 Auto Code 旗舰路由器 2026-11-09 上线 ⚠️ HN 转引（「Auto is OpenRouter's flagship model router」✅ 官网模型页）。

**规模信号全部来自官方一手，但要分层读**。吞吐：周 token 量六个月 5 万亿 → 25 万亿、年化节奏「over a quadrillion tokens this year」（2026-05-28 官方）✅；2025-11 State of AI 报告统计累计 100 万亿 token（约两年窗口）✅——两个官方时点相隔约一年、量级差约两个数量级，增长斜率本身就是事件。榜单：[rankings](https://openrouter.ai/rankings) 按 token 排名（不排质量），2026-11-11 单日 DeepSeek V4.1 Flash 1017 达 9.62T、前十全部 ≥650B ✅；作者请求份额（2026-11-02 当周）DeepSeek 31.8%、OpenAI 19.3%、Google 13.6%、Z.ai 7.4%、Anthropic 5.8% ✅。用户 8M+（2026-05 官方「8M+ developers」、TechCrunch 2026-08「8 million global users」）✅。GitHub 组织 OpenRouterTeam：40 个公开仓库、4561 followers，Vercel AI SDK provider 696★、awesome-openrouter 543★ ✅ gh API（2026-11-12）；⚠️ 注意 github.com/OpenRouter 与 OpenRouterAI 为同名蹭名用户账号，非官方。

**在 agent 生态的位置：吃到了 coding agent 的最大红利，也暴露反方命题**。官方榜单 Top Apps：Claude Code 1.86T token/日居首、Hermes Agent 1.75T、Codex 830B（2026-11-11）✅——Claude Code 并非「默认走 OpenRouter」，是开发者经兼容端点把流量导了进来；「Cursor 默认路由经 OpenRouter」未获证据 🔍。结构面：编程查询占平台 token 量从 11% 涨破 50%、推理模型占 token >50%（2025-11 State of AI）✅，Anthropic 长期占编程支出 60%+ ✅。反方记录三条：同权重不同 provider 实测质量方差大、存在空 200 响应与 tool-call 标记泄漏（mmoustafa，2026-09-09）⚠️——聚合层的质量保障是概率性的；2026-10-27 起对全部推理流量做 CSAM 筛查、ZDR 增加法定保留例外 ✅ 官方博客——隐私默认让渡合规；并入 Stripe 后模型厂商是否接受竞对结算方代理分发 🔍 未获口径。

## 怎么看

1. **「Stripe for AI」从自我比附变成被本体收编——MaaS 分发入口的终局样本。** Atallah 2026-08 向媒体描述公司是「Stripe for AI」，三周后真 Stripe 以 $7B+ 把它买下（B/T 口径）。这印证聚合层的金融属性：推理不加价、充值收费、统一账单——本质是 token 的清算与结算，与支付网关同构。分发入口的归属最终由结算基础设施决定；这对一切「AI 流量入口」叙事是一枚定价锚，也是 [[商业与投融资/AI人才与并购潮]] 的基础设施层样本。
2. **排行榜是行业采用度的代理指标，但要防两个口径陷阱。** 官方方法论按 token 排名、不排质量、剔除隐私请求、免费变体单列 ✅。陷阱一：token 份额 ≠ 请求份额——第三方据公开榜单推「DeepSeek 占全部 token 量 53%」（dirac.run，2026-11-04 ⚠️），官方请求口径为 31.8%（2026-11-02 当周）：长提示的 agent 流量会放大 token 口径；陷阱二：榜单只测「经由 OpenRouter 的流量」，上游直销与框架内置路由不在统计内——它是采用度的下界，不是总量。
3. **价格弹性悖论：10% 降价只换 0.5–0.7% 用量增长（官方 State of AI，2025-11）——聚合层的价值不在价差套利。** 若靠价差吃饭，价格战会击穿它；事实相反：GPT-5.6 Sol 降价 50% 时平台费率结构不变（2026-08 ⚠️），降价做大 token 分母、聚合层按吞吐受益。它的真实护城河是可用性（自动 fallback）、长尾覆盖（400+ 模型/80+ provider）与供应商方差管理——第三方实测同权重不同 provider 质量方差大，恰是这层存在的理由 ⚠️。
4. **Agent 生态卡位：coding agent 是聚合层最大的量，平台化正从路由延伸到身份。** Claude Code 1.86T token/日居 App 榜首、编程 token 占比破 50%（2025-11）✅；产品端同步铺 Agent SDK、skills、Sign In with OpenRouter、Terraform provider ✅ GitHub——从「替开发者选模型」走向「替 agent 持有密钥、预算与审计」。切换成本一旦从 API 兼容升级为组织流程，网关层才真正可防御；这也是它与 [[智能体平台/Agent框架]] 内置路由的竞争分界。
5. **「双向挤压」命题在增长数据面前要打折扣，但并入 Stripe 后新增了中立性变量。** 挤压假说（上游直销 + LiteLLM 类框架路由 + 竞品如 Hypermode Model Router/Nano-GPT ⚠️ HN 口径）与事实并存：周吞吐 5T→25T（2026 上半年）、单模型日 9.6T（2026-11）✅——中国开源模型的爆发贡献了长尾分发需求（DeepSeek/Qwen/Z.ai 居 token 榜前列），这是直销模式覆盖不了的。真正的变量是中立性：模型厂商是否愿意让竞对的结算平台代理分发 🔍；CSAM 筛查（2026-10-27 ✅）已示范一次「平台合规 > 用户隐私默认」的优先级排序。
6. **台内观察价值：它是智能体平台主题的流量仪表盘。** rankings 的 Top Apps（Claude Code/Hermes Agent/Codex）是 agent 生态真实消费结构的公开数据源，可为 [[智能体平台/ClaudeAgentSDK]]（Claude Code 侧）、[[智能体平台/MCP协议]]（官方 MCP server 与 :exacto 工具调用路由）、[[智能体平台/Browser Use]]（浏览器 agent 的多模型采购形态）提供流量侧交叉验证；token 结构（编程 >50%、推理 >50%、中国开源份额）为 [[开源模型与生态/DeepSeek]] 的出海分发提供一手注脚。

## 关键锚点

- **2026-11-11** · [官方榜单：Claude Code 居 App 榜首，DeepSeek 单模型单日 9.62T](https://openrouter.ai/rankings) ✅
- **2026-11-10** · Stripe 宣布「OpenRouter is now part of Stripe」，交割完成 ⚠️
- **2026-10-30** · 重建 provider 路由层（「better, faster inference」）⚠️
- **2026-10-27** · [全部推理流量接入 CSAM 筛查，ZDR 增加法定保留例外](https://openrouter.ai/blog/announcements/csam-screening/) ✅

## 下钻

- [证据时间线（原始线索卡）](../../证据层/智能体平台/OpenRouter.md)
- [智能体平台/Agent框架](../../证据层/智能体平台/Agent框架.md)
- [智能体平台/ClaudeAgentSDK](../../证据层/智能体平台/ClaudeAgentSDK.md)
- [智能体平台/MCP协议](../../证据层/智能体平台/MCP协议.md)
- [智能体平台/Browser Use](../../证据层/智能体平台/Browser Use.md)
- [开源模型与生态/DeepSeek](../../证据层/开源模型与生态/DeepSeek.md)
- [商业与投融资/AI人才与并购潮](../../证据层/商业与投融资/AI人才与并购潮.md)
