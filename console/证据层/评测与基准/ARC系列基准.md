---
线索: ARC系列基准
主题: 评测与基准
别名: [ARC-AGI, Abstraction and Reasoning Corpus]
状态: 活跃
创建: 2026-09-04
更新: 2026-09-04
关键角色: [François Chollet, ARC Prize]
---

# ARC系列基准

> 「人类轻松、AI 困难」的流体智能标尺：每当前沿模型逼近饱和，基准就换代升维——直到模型跑得比出题人更快。

## 概述

ARC 系列由前 Google 研究员、《Python 深度学习》作者 François Chollet 于 2019 年创设（Abstraction and Reasoning Corpus），以少量全新谜题测「人类轻松、AI 困难」的流体智能，刻意与可被训练数据「刷」的知识型基准对立，由 ARC Prize 基金会以高额奖金长期运营。2024 年 12 月 OpenAI o3 以 87.5%（高算力模式）首次逼近人类水平地突破 ARC-AGI 半私有集，验证了「测试时计算」新范式；2025 年更难的 ARC-AGI-2 接棒；2026 年初上线的 ARC-AGI-3 转向交互式任务（新增动作效率维度），成为前沿模型「通用智能」的裁判尺，仅约半年即被 GPT-6 Astra 以 99.9% 刷线。

该线索追踪各代 ARC 基准的演进、模型刷线历史，以及随之而来的「基准饱和」争论。

### 2026-09

- **2026-09-04** · [OpenAI GPT-6 Astra 在 ARC-AGI-3 上取得 SOTA 并超越人类动作效率基线](https://aihot.virxact.com/items/cmtm7yl5s01d5robnsn25onbz)
  Hacker News 热议：GPT-6 Astra 不仅得分 SOTA，动作效率也超过人类基线——交互式基准衡量的「做事」维度首次被模型反超。→ [[基础模型/GPT系列]]
- **2026-09-03** · [OpenAI 发布 GPT-6 Astra，ARC-AGI 3 得分 99.9%](https://aihot.virxact.com/items/cmtlzasi70s61row5vze3ldjh)
  Simon Willison 等跟进确认：GPT-6 Astra 官方基准 ARC-AGI-3 得分 99.9% SOTA，发布仅半年出头的 ARC-AGI-3 被一步「刷穿」。
- **2026-09-03** · [François Chollet 评 GPT-6 Astra 在 ARC-AGI-3 上的表现](https://aihot.virxact.com/items/cmtlyeuas0rigrow5d2jq4xb7)
  基准创设人 Chollet 本人在 X 回应 Astra 刷线，其评价成为「这算不算通用智能」争论的定音锤。
- **2026-09-03** · [ARC-AGI-3 发布仅半年即被 Astra 饱和，进展快于 François Chollet 预期一倍](https://aihot.virxact.com/items/cmtlzumiu0soirow5cfujh2xf)
  社区测算 ARC-AGI-3 从发布到饱和仅约半年，速度比 Chollet 此前预期快一倍，前沿能力增长持续跑赢基准供给侧。

### 2026-07

- **2026-07-17** · [Schema Harness 在 ARC-AGI-3 公开集上取得约 99% 成绩](https://aihot.virxact.com/items/cmropqooe05tqbitodvnqnc6u)
  社区脚手架 Schema Harness 在 ARC-AGI-3 公开集拿下约 99%（Hacker News 热议）——公开集先行饱和的信号，也为「脚手架刷分」争议埋下伏笔。

## 分析

1. **裁判尺的自我革命与失速**：ARC 的每次换代（ARC→AGI-2→AGI-3）都发生在上代被逼近饱和之时，靠「升维」维持区分度；但当换代周期以年计、饱和周期缩到半年，评测供给侧已被前沿能力反超——ARC-AGI-4 的设计压力空前，「通用智能裁判」的角色可能让位于持续更新的动态评测。

2. **刷分的不只是模型**：Schema Harness 在公开集拿 99%、两项 API 设置即可让 GPT-5.6 得分翻三倍——脚手架与评测设置已成为与模型能力同权重的变量。解读 ARC 分数时，「多少归模型、多少归 harness」是新的评测科学问题，也是厂商发布口径容易被高估的地方。

## 关联线索

- [[评测与基准/SWE-bench]]
- [[评测与基准/LMArena]]
- [[评测与基准/ArtificialAnalysis指数]]
- [[基础模型/GPT系列]]
- [[基础模型/Gemini]]
