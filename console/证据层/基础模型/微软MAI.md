---
线索: 微软MAI
主题: 基础模型
别名: [Microsoft MAI, MAI-1, MAI-Thinking]
状态: 活跃
创建: 2026-09-04
更新: 2026-09-04
关键角色: [Microsoft, Mustafa Suleyman]
---

# 微软MAI

> 微软的自研前沿模型家族：从「OpenAI 之外的第二张牌」到接管 Copilot，Suleyman 的团队正走向台前。

## 概述

MAI 是微软 AI 部门（Microsoft AI，2024 年 3 月成立）的自研模型家族，由 DeepMind 联合创始人、Inflection AI 创始人 Mustafa Suleyman 执掌，创立时收编了 Inflection 团队的大部分成员。其战略定位是「在 OpenAI 之外拥有第二张牌」——微软既是 OpenAI 最大的算力与分销伙伴，也需要不受制于人的模型资产。路线先小后大：2024–2025 年以 MAI-1 等中小模型与语音、图像（MAI-Image 系列）等专用模型试水，MAI-1 preview 曾以匿名榜单位参加第三方竞技场测试；2026 年起 MAI 家族全面进入 Foundry 与 Copilot，并推出自研推理模型 MAI-Thinking-1 与网络安全专用模型 MAI-Cyber 系列，正式跻身前沿竞赛。

该线索追踪 MAI 家族的模型发布、在 Copilot/Foundry/Azure 生态中的替换进度，以及微软「低成本前沿 + 专用模型」路线与 OpenAI/Anthropic 的竞合变化。

### 2026-08

- **2026-08-12** · [微软首发自研推理模型MAI-Thinking-1](https://aihot.virxact.com/items/cmsqbnb8j01nrroosmwa5r6mj)
  Mustafa Suleyman 在官方 X 宣布首发自研推理模型 MAI-Thinking-1，为微软自研前沿推理线正式定调，MAI 从「专用补位」升级为「前沿旗舰」叙事。

### 2026-07

- **2026-07-28** · [Microsoft 发布 MAI-Cyber-1-Flash：5B 活跃参数的网络安全模型，驱动 MDASH 在 CyberGym 上达到 95.95%](https://aihot.virxact.com/items/cms4fb2n603f4roeprjoopbix)
  微软发布小参数网络安全专用模型 MAI-Cyber-1-Flash（5B 活跃参数），驱动自家 MDASH 在 CyberGym 达 95.95%，专用模型线继续下沉。
- **2026-07-23** · [微软MAI模型：以更低成本实现前沿能力规模化](https://aihot.virxact.com/items/cmrxr59xb01sbroxpzcqbv1fo)
  Nadella 官方转述 MAI 路线：以更低成本实现前沿能力规模化，与同期 Copilot 换模动作互为呼应。
- **2026-07-07** · [微软为降成本在Copilot中用自研MAI模型替换OpenAI和Anthropic模型](https://aihot.virxact.com/items/cmrb0u6pv02qtihogovduu795)
  The Decoder 报道微软为降低成本，开始在 Copilot 中用自研 MAI 模型替换 OpenAI 与 Anthropic 的模型——「第二张牌」进入实际兑现阶段。→ [[开发者工具/GitHubCopilot]]

### 2026-06

- **2026-06-02** · [微软首款高级推理AI模型MAI-Thinking-1发布](https://aihot.virxact.com/items/cmpwzm8ij028gsl798th4vl54)
  The Verge 报道微软首款高级推理模型 MAI-Thinking-1 随新一批 MAI 模型发布，自研线首次切入推理模型赛道。
- **2026-06-02** · [MAI-Image-2.5 launches at No. 2 for image editing on Arena](https://aihot.virxact.com/items/cms3g8wjy01i4rondcv3p2hlz)
  Microsoft AI 官方博客宣布 MAI-Image-2.5 登上 Arena 图像编辑榜第 2 位，图像线在第三方竞技场拿到头部座次。
- **2026-06-02** · [Building a hill-climbing machine： Launching seven new MAI models](https://aihot.virxact.com/items/cms3g8wjy01i8rondrbytpgwf)
  Microsoft AI 官方博客一次推出七款新 MAI 模型，以「建造爬山机」为题强调渐进式改进方法论，语音/图像/安全等专用线全面铺开。

### 2026-04

- **2026-04-02** · [MAI 模型家族全面登陆 Foundry，面向所有开发者开放](https://aihot.virxact.com/items/cmnw1ywdc01fmslc3iwwtn3oq)
  Nadella 官宣 MAI 模型家族全面入驻 Azure AI Foundry 并向所有开发者开放，自研模型正式进入微软开发者分发主渠道。

### 2026-03

- **2026-03-19** · [Superintelligence 团队新图像模型 MAI-Image-2 登陆 Copilot，即将上架 Foundry 企业版](https://aihot.virxact.com/items/cmnw1ywdc01fnslc3i1r05u3g)
  Nadella 官宣 Superintelligence 团队的图像新模型 MAI-Image-2 接入 Copilot 并即将上架 Foundry 企业版，MAI 专用模型开始进入微软全线产品。

## 分析

1. **「第二张牌」的兑现时刻**：对 OpenAI 的深度依赖是微软最大的战略敞口；MAI 用两年从补位小模型走到推理旗舰，2026 年 7 月 Copilot 换模是分水岭——平台方用自研模型替换供应商模型，标志两者关系从「竞合」走向「部分脱钩」，OpenAI 在微软生态内的议价权被实质性稀释。

2. **拼效率与分发，而非单点最前沿**：MAI 不追求刷爆每一张榜，而是「hill-climbing」式渐进改进 + 图像/语音/网络安全专用线 + Foundry/Copilot 的天然分发，把模型能力兑现为产品成本优势（降本、替换三方模型）——这与微软「平台公司」的身份高度自洽，也给「自研模型必须当冠军」的惯性叙事提供了一个反例。

## 关联线索

- [[开发者工具/GitHubCopilot]]
- [[基础模型/GPT系列]]
- [[商业与投融资/AI人才与并购潮]]
