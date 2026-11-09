---
线索: DeepSeek
主题: 开源模型与生态
别名: [深度求索, DeepSeek-V3, DeepSeek-R1]
状态: 活跃
创建: 2026-07-30
更新: 2026-09-04
关键角色: [DeepSeek, 幻方量化]
---

# DeepSeek

> 用几百万美元级训练成本对齐闭源旗舰的中国开源实验室，2025 年初引发全球 AI 市场地震。

## 概述

DeepSeek（深度求索）是量化基金幻方（High-Flyer）孵化的 AI 实验室，以「极致工程效率 + MIT 许可彻底开源」著称。V2 掀起中国 API 价格战，V3 以约 558 万美元 GPU 成本（官方口径）训练出 GPT-4o 级模型，R1 则以开源推理模型比肩 o1，直接引发 2025 年 1 月末美股 AI 板块巨震。2026 年 V4 系（4 月 preview、8 月正式版）以激进定价放大影响力，并于 6 月完成首轮外部融资、投后估值超 500 亿美元。

该线索追踪 DeepSeek 的模型发布、技术创新（MLA、MoE、GRPO、蒸馏）与其对全球 AI 格局的冲击。

### 2026-09

- **2026-09-10** · [DeepSeek 发布 V4.1-Flash，API 价格同步下调](https://aihot.news/items/cmtv48yni0oq5rorpf4o74549)
  1M 上下文、FP4 KV 缓存与跨层注意力复用，主打编码智能体 prefill 效率（[MarkTechPost 详解](https://aihot.virxact.com/items/cmtv7kmzk02vdrok9y0y8njiv)）；WorkBuddy 上线即日起两周免费试用（[镜像](https://aihot.virxact.com/items/cmtvqbs1q03q9rofb98re4l3n)）。开源 MoE 主线在前沿模型密集发布周后维持自身节奏。Baseten 工程博客次日（09-11）发布 [V4.1-Flash 编码智能体 prefill 优化分析](https://aihot.news/items/cmtym24xb0002rob419mlyhlb)。

### 2026-08

- **2026-08-31** · [DeepSeek-V4-Flash-Vision-Exp 开源](https://aihot.virxact.com/items/cmth7tmq2067orodmh6g0sxie)
  V4 系首个多模态模型权重以 MIT 许可上架 Hugging Face（IT之家报道）；官方称多模态 Agent 能力接近 Opus-4.8，并公开覆盖视觉编码器、DFlash Attention、MoE 等模块的最小化 PyTorch 推理实现。
- **2026-08-21** · [DeepSeek-V4-Flash-Vision-Exp 上线](https://api-docs.deepseek.com/news/news260821/)
  V4 系首个多模态实验版，视觉理解 API 开放（官方公告）；NVIDIA 开发者论坛实测与社区量化权重随即跟进。
- **2026-08-13** · [DeepSeek V4-Pro 正式版发布并开源](https://www.reuters.com/world/china/deepseek-releases-official-v4-pro-model-it-steps-up-expansion-2026-08-13/)
  1.6T 总参旗舰正式版（4 月 preview 转正），延续 MIT 许可；官方 API 更新日志称 Agent 能力大幅增强；Reuters 报道其同步推进扩张。
- **2026-08-13** · [DeepSeek Harness v0.1 开发者预览版发布](https://aihot.virxact.com/items/cmsrjqqfg02z0ro469zple5jl)
  官方 X 宣布：MIT 许可开源的智能体框架，基于 Cordis 元框架、「一切皆为插件」（模型/工具/沙箱/编排均可替换），对标 Claude Cowork（IT之家报道）。

### 2026-07

- **2026-07-24** · 旧 API 名称停用
  `deepseek-chat`、`deepseek-reasoner` 两个旧模型名停用，进入三个月迁移窗口。
- **2026-07 月底** · DeepSeek-V4-Flash 正式版发布
  Agent 模型正式版发布；社区自测显示 Flash-0731 变体在 9 项基准上反超 V4-Pro preview（社区测试，非官方基准）；Artificial Analysis 显示其开源后跻身开源模型前三。

### 2026-06

- **2026-06-16** · [DeepSeek 完成首轮外部融资，估值超 500 亿美元](https://aihot.virxact.com/items/cmqggy29t00gaslevgnwfv3sl)
  The Decoder 报道：募资超 500 亿元人民币（约 74 亿美元）；投资结构特殊，多数资金以无投票权、五年锁定期形式进入梁文锋管理的有限合伙企业。
- **2026-06-04** · [连续四周登顶 OpenRouter Token 份额榜](https://aihot.virxact.com/items/cmpzljcev04oyslkpirsh5gdy)
  OpenRouter 官方数据显示，V4 系带动 DeepSeek 连续四周登顶其 token 份额榜。

### 2026-05

- **2026-05-24** · [旗舰模型 V4-Pro 75 折转为永久](https://aihot.virxact.com/items/cmpk417ey03vssl01z5zsemms)
  Bloomberg 报道：原定月底到期的 V4-Pro 大幅折扣永久化，开发者价格保持在原价四分之一，延续激进定价策略。
- **2026-05 底** · A 轮约 70 亿美元（约 500 亿人民币）
  投后估值 520-590 亿美元；腾讯、宁德时代入局，梁文锋自参与。

### 2026-04

- **2026-04-26** · [输入缓存价格降至原价 1/10](https://aihot.virxact.com/items/cmog0c5bj00czslr37t1k5kqd)
  官方 X 宣布 API 输入缓存全系列降至原价十分之一，配合 V4 预览版放量进一步压低使用成本。
- **2026-04-24** · [DeepSeek V4 Preview 发布并开源](https://api-docs.deepseek.com/news/news260424/)
  发布并开源 V4-Pro（1.6T 总参/49B 激活）和 V4-Flash（284B 总参/13B 激活）；1M 上下文成默认；采用 Token-wise 压缩 + DSA（DeepSeek Sparse Attention）；Agentic Coding/Math/STEM 领先开源；兼容 Claude Code/OpenCode。同日 OpenAI 发布 GPT-5.5，中美旗舰模型正面对撞。
- **2026-04** · 首次外部融资启动
  报道融前估值约 440 亿美元，启动首次外部融资。

### 2025-05

- **2025-05-28** · R1-0528 更新发布
  推理能力显著增强、幻觉率下降，逼近 o3/Gemini 2.5 Pro 水平，证明 R1 并非一次性奇迹，DeepSeek 保持第一梯队迭代节奏。

### 2025-01

- **2025-01-20** · [DeepSeek-R1 发布](https://api-docs.deepseek.com/news/news250120)
  MIT 许可开源的推理模型，基准比肩 o1，API 价格仅为其约 1/30，并公开 GRPO 强化学习方法与蒸馏小模型系列。一周后 DeepSeek App 登顶美区 App Store，1 月 27 日 NVIDIA 单日市值蒸发约 6000 亿美元，被称为 AI 的「斯普特尼克时刻」。

### 2024-12

- **2024-12-26** · DeepSeek-V3 发布
  671B 参数 MoE（激活 37B），官方口径 2048 张 H800、约 558 万美元 GPU 成本完成预训练，性能对标 GPT-4o/Claude 3.5 Sonnet，「效率神话」引发全球对训练成本叙事的重估。

### 2024-05

- **2024-05** · DeepSeek-V2 掀起价格战
  MLA（多头潜在注意力）大幅压缩 KV Cache，API 定价降至每百万 token 1 元人民币级，被称为「AI 界拼多多」，倒逼中国大模型全行业降价。

### 2023-11

- **2023-11** · DeepSeek Coder 开源发布
  首批开源成果，代码模型在同规模开源模型中表现突出，实验室开始进入国际开发者视野。

## 分析

1. **约束催生创新**：出口管制下的算力约束反而逼出 MLA、FP8 训练、极致 MoE 等工程创新——DeepSeek 证明「算力换不来的效率」是可以被研究出来的，这动摇了「算力=能力」的行业公理。

2. **彻底开源作为不对称武器**：MIT 许可 + 公开技术报告 + 开源权重（对比 Llama 的受限许可、OpenAI 的完全封闭），DeepSeek 用最彻底的开放换取了最大的全球生态渗透，尤其在 API 价格敏感的市场。

3. **地缘叙事的双刃剑**：「斯普特尼克时刻」让 DeepSeek 成为中美 AI 竞争的符号，带来声望的同时也招致多国政府设备禁令与更严的芯片管制审查，其后续发展始终处在地缘政治聚光灯下。

## 关联线索

- [[开源模型与生态/Llama]]
- [[推理与基础设施/AI芯片竞争]]
- [[训练与数据/RLHF与后训练]]
