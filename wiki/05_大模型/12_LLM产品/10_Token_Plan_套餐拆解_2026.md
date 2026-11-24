---
title: "Token Plan 套餐拆解 2026（各家横向对比）"
category: "05-nlp-llms-llm-products"
tags: ["token-plan", "pricing", "billing", "maas", "subscription", "2026"]
summary: "各模型厂商 Token Plan 横向拆解：百炼 Credits、方舟 AFP/Coding Plan/递减包、腾讯积分三套计量单位的换算经济学，与海外『per-token + Batch/缓存折扣』范式对照，含双11 活动价与选型判读。"
sources:
  - "https://developer.aliyun.com/article/1779930"
  - "https://docs.volcengine.com/docs/acitvity-rule/megasale"
  - "https://cloud.tencent.com/document/product/1823/131173"
created: 2026-11-19
updated: 2026-11-19
tier: supporting
aliases:
  - "Token Plan"
  - "Token 套餐"
  - "TokenPlan 对比"
  - token_plan_pricing
name_zh: "Token Plan 套餐拆解"
---

# Token Plan 套餐拆解 2026（各家横向对比）

> 中文简称：Token Plan 套餐拆解

> **一句话理解**: 国内平台把模型调用做成「订阅制通行证」（百炼 Credits、方舟 AFP、腾讯积分三种计量单位互不兼容），海外大厂反其道而行——不做订阅，用 Batch 五折与缓存九折把按量价打到「类订阅」水平；比价的唯一方法是全部折算成「每百万 token」。

---

## 0. 边界与口径警示

- **本篇只覆盖平台 API 侧**的 token 计费计划；C 端 App 会员（千问 App、豆包 App 等订阅）不在范围内
- **同名不同物**：库内 [阿里 Token 经济页](../../12_架构基建/06_云厂商/Alibaba_Cloud/产品/09_Token经济与商业化.md) 采「千问 App C 端 39/139/499」口径，与本篇百炼平台的「个人版 39/79/499 Credits」是两套产品——引用时务必区分
- 所有价格为**公开页/官方文档核验值**（时点见各节），活动价与刊例价差异可达 2 倍+

## 1. 总对照：五种形态一张表

| 平台 | 形态 | 计量单位 | 核心特征 | 时点 |
|------|------|----------|----------|------|
| **阿里云百炼** | 个人/团队订阅 + 资源包 + 节省计划 + Night Plan | **Credits** | 一份订阅通吃千问模型 + Claude Code/Cursor/Qoder 等工具 | 2026-11-06 |
| **火山方舟** | Coding Plan / Agent Plan + AI 节省统一计划 + 递减包 + TPM 保障包 | **AFP** | 输入输出同系数、无峰谷全天同价 | 2026-10-20 |
| **腾讯云 TokenHub** | 个人双系列（通用/Hy）+ 企业版（专业积分制/轻享 Token 池） | **积分 / Token 池** | 2026-08-31 起 token→积分，公式含缓存命中系数 | 2026-11-11 |
| **百度千帆** | 未见统一订阅——模型调用/平台能力/企业资源分别计费 | 按量 + 商务 | 老牌 To B，资源走合同 | 2026-11-13 |
| **硅基流动 / DeepSeek 官方** | 无订阅制——免费模型 + 低单价按量 | 按量 | 硅基 9B 以下长期免费、新用户 2,000 万 tokens + 14 元 | 2026-09-01 |

**直觉**：**直觉**——「订阅化程度」与「自研模型广度」正相关：模型矩阵越宽（千问/豆包/混元），越有底气卖通行证；只做聚合或只卖自家模型的（硅基/DeepSeek），反而保持纯按量最干净。

## 2. 阿里云百炼 Token Plan（Credits 体系）

- **个人版**（双 11 口径，活动 2026-11-02～11-30）：Lite **39 元/月 11,500 Credits**（新客首购 **19.5 元**）、Essential **79 元/25,500**（新客 **39.5 元**）、Pro **499 元/月**
- **团队版**：标准 150 元 → 尊享 1,398 元；**额度按月发放、不结转**（另有口径称个人版为 7 天窗口——文档 2026-09-02 更新，两口径并列、以控制台为准）
- **Credits 通吃范围**：千问系列多模态模型 + 文本/图像/视频/语音，且可在 **Claude Code、Cursor、Qwen Code、Codex、Qoder、OpenClaw** 等工具中使用（一份订阅、多工具记账）
- **叠加机制**：Night Plan 夜间折扣；全模型通享**节省计划**（新客月包省 50%、季包 55%，覆盖 150+ 模型，当月用不完清零）；指定模型**资源包**（qwen-plus 1,200 万 tokens 售 11.66 元，仅抵扣该模型）；新人免费 >7,000 万 tokens
- **硬约束**：仅**华北 2（北京）**地域；Credits 不结转、用尽暂停（可购用量包）；Token Plan 专属 `sk-tp` 密钥不消耗新人免费额度

## 3. 火山方舟（AFP 体系 + 三形态）

- **方舟 Coding Plan / Agent Plan**（面向编程与 Agent 工具的订阅）：最新支持 **DeepSeek-V4 系列、GLM-5.2、Kimi-K2.7**（AI 普惠季规则，2026-10-20）
- **AFP 折算公式**（2026-09-15 核验）：`AFP = (输入 token × 输入系数 + 输出 token × 输出系数) / 10000`，**输入 = 输出系数、无峰谷全天同价**——四家中唯一没有时段套利空间的计量
- **官方系数样本**（AFP/百万 token，输入=输出）：Doubao-Seed-2.1-turbo 250、GLM-5.3 450、GLM-5.3-Flash 50、DeepSeek-V4.1-Flash 250（2026-09-15～09-28 限时 125）、V4.1-Pro 550；**Doubao-Seed-2.1-pro 未纳入 Agent Plan 抵扣体系**
- **AI 节省统一计划**：预付后抵扣豆包大模型/视频/图像的按量账单（豆包 2.0、图像 5.0 限首购新用户）
- **递减包**（新客 5 折，1 个月有效）：豆包大模型 2.0 **19 元/约 800 万 tokens**（刊例 38 元）、100 元/约 4,000 万；DeepSeek-V4-flash 同价
- **活动期套餐**：Lite/Small 档首两月 9.9 元/月、Pro/Medium 49.9 元/月，第三月恢复 40/200 元原价；**TPM 保障包**走商务报价（范围内不限速、超出降级）

## 4. 腾讯云 TokenHub（积分体系，唯一含缓存系数）

- **个人版双系列**：通用 Token Plan（DeepSeek/GLM/Kimi/MiniMax/混元）+ Hy Token Plan（混元自研），各 Lite/Standard/Pro 档；**2026-08-31 17:00 起计量单位由 token 调整为积分**，价格不变、模型积分系数不同
- **积分公式**（行业独有——把缓存写进抵扣）：`单次积分 = (未命中缓存输入 × 输入系数 + 输出 × 输出系数 + 缓存命中 × 缓存系数) / 1,000,000`；2026-09 曾做全系数 5 折限时
- **企业版两档**：
  - **专业套餐**（积分制）：**5 万积分 500 元/月起**（国际文档刊例 70 美元/月），支持自定义积分、每 1 万积分开 1 个 API Key 共享池；**不结转、不退订、不降配**
  - **轻享套餐**（纯 Token 池，仅 Auto 智能路由模型）：广州 **5,000 万 tokens 100 元/月**、新加坡 130 元/月
- **模型面**：Hy4（2026-11-04 上线，积分抵扣限时优惠）+ GLM-5.3、Kimi K3/K2.7、DeepSeek-V4.1 等；TokenHub 按量 **5 折至 2026-12-31**；Hy4 preview 套餐内价 2026-11-04 曾上调
- **Claude Code 官方接入**：`ANTHROPIC_BASE_URL=https://tokenhub.tencentmaas.com/plan/anthropic`、`sk-tp` 密钥——与百炼 `sk-sp` 同一打法

## 5. 海外对照：没有 Token Plan，但把按量打成「类订阅」

| 机制 | 折扣 | 时点与来源 |
|------|------|-----------|
| **Batch API**（异步、可等 24h） | OpenAI/Anthropic/Google **普遍 5 折**；Sonnet 5.5 标准输入 $2/输出 $10 → Batch $1/$5 | 2026-10-14 新浪财经 |
| **Prompt Caching** | 命中省约 **九成**；Anthropic Opus 输入 $4 叠加 Batch+缓存 → **$0.10，省 97.5%** | 2026-10-26 / 2026-11-07 |
| **阶段性价格** | Gemini 3.8 Flash：2026-12-31 前 $0.75/$3.75，**2027-01-01 起翻倍至 $1.50/$7.50** | 2026-10-14 新浪财经 |
| 低价走量 | Claude Haiku 5.5：输入 **$0.10**/百万起 | 2026-10-08 |

**直觉**：**直觉**——海外用「Batch + 缓存」做隐形折扣（叠满砍 97.5%），国内用「订阅 + 活动」做显性折扣（双 11 五折）；但中国平台的 plan 多了一层独有价值——**直接喂给 Claude Code/Cursor 这些海外工具**，把「模型订阅」变成了「工具通行证」。

## 6. 选型判读（三条）

1. **计量单位不可直比**：Credits ≠ AFP ≠ 积分 ≠ Token 池——必须用**自己最近 30 天真实请求日志**折算成「每百万输入 / 每百万输出 / 月固定费」再比（七牛云选型文方法论，2026-09-08）；方舟 AFP 输入=输出同系数最干净，腾讯积分含缓存系数对多轮 Agent 最友好
2. **活动价 ≠ 预算价**：双 11 五折、首两月 9.9、按量 5 折均有截止日（11-30 / 12-31）；做年度预算一律按刊例价算，活动当节省
3. **硬约束先核对**：地域绑定（百炼仅华北 2；腾讯广州/新加坡 endpoint 与可用模型不同）、额度作废（行业通则：不结转）、系数可调（Hy4 preview 上调先例）——开通前把「地域 + 结转 + 超额停机开关」三项过一遍

## 7. 与其它文档的衔接

- 同章：[DeepSeek 概览](./03_deepseek_概览.md)、[ChatGPT 概览](./01_chatgpt_概览.md)（海外按量侧代表）
- 跨章：[阿里 Token 经济与商业化](../../12_架构基建/06_云厂商/Alibaba_Cloud/产品/09_Token经济与商业化.md)（C 端/ATH 口径，与本篇互补）、[百炼竞品对比](../../12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/23_Competitor_Comparison.md)、[AI 成本优化 2026](../../12_架构基建/02_架构概览/01_AI_成本优化_2026.md)

## 8. 参考来源（检索日期 2026-11-19）

- 阿里云开发者社区：[双 11 Token Plan 5 折与档位](https://developer.aliyun.com/article/1779930)、[收费价格表](https://developer.aliyun.com/article/1778646/)、[租用资费横向对比](https://developer.aliyun.com/article/1779189)、[选购攻略与 Credits 规则](https://developer.aliyun.com/article/1777520)
- 火山引擎官方文档：[AI 普惠季活动规则](https://docs.volcengine.com/docs/acitvity-rule/megasale)、[方舟活动页（递减包）](https://www.volcengine.com/activity/ark)；CSDN：[国内各平台 Token Plan 折算对比（AFP 系数表）](https://blog.csdn.net/han1202012/article/details/166112304)
- 腾讯云官方：[Token Plan 企业版专业套餐](https://www.tencentcloud.com/zh/document/product/1300/81489)、[轻享套餐](https://cloud.tencent.com/document/product/1823/131173)、[个人版积分制公告](https://cloud.tencent.com/act/pro/tokenplan)；腾讯云社区：[Hy4 与统一积分池](https://cloud.tencent.com/developer/article/2778048)、[Claude Code 接入实测](https://cloud.tencent.com/developer/article/2767736)
- 横评与方法论：[7 大主流平台对比](https://m.blog.csdn.net/aidoudoulong/article/details/170742103)、[20 个平台横向对比](https://blog.csdn.net/aidoudoulong/article/details/166844734)、[Token Plan 哪家划算（七牛云）](https://news.qiniu.com/archives/1788856850196)
- 海外定价：[2026 主流大模型 API 价格速览](https://www.aiexpress.news/wiki/llm-api-pricing-2026)、[Anthropic API Pricing 2026](https://www.activepieces.com/blog/anthropic-api-pricing-2026-cost-per-million-tokens)、[新浪财经：DeepSeek 们的性价比](https://finance.sina.cn/2026-10-14/detail-inivcxxn0522169.d.html)、[千问 AI 平台计费说明](https://platform.qianwenai.com/docs/developer-guides/getting-started/pricing)

---

*Last updated: 2026-11-19*
