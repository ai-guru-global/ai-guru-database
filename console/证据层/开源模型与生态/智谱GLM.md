---
线索: 智谱GLM
主题: 开源模型与生态
别名: [ChatGLM, GLM, GLM-5, 智谱AI]
状态: 活跃
创建: 2026-08-03
更新: 2026-10-03
关键角色: [智谱AI, 唐杰]
---

# 智谱GLM

> 智谱 AI 的 GLM 系列大模型，清华系中国开源主力，2026 年初成为「全球大模型第一股」。

## 概述

智谱 AI（Zhipu，02513.HK）源自清华大学唐杰团队，GLM（General Language Model）架构系列大模型。2024 年 ChatGLM 系列在国内 To B 市场占据重要份额；2025 年起 GLM 系列转向激进开源（MIT 许可）+ 国产芯片训练路线。

2026-01-08 智谱在港交所主板挂牌，成为**全球首家上市的大模型公司**；同年 6 月又建议发行 A 股登陆科创板（A+H），并将英文名变更为 Z.AI Co., Ltd.。同年 GLM-5 → 5.1 → 5.2 → 5.3 快速迭代，主打「长任务时代」与编程/Agent 能力。该线索追踪 GLM 系列演进与智谱的商业化进程。

### 2026-10

- **2026-10-01** · [Cursor 上线 GLM 5.3 与 GLM 5.3 Flash](https://x.com/cursor_ai/status/2105787358557999585)
  Cursor 官方账号：GLM 5.3 / 5.3 Flash 进入 Cursor，GLM 5.3 Max 是 CursorBench 4.0 得分最高的开源权重模型——SpaceX 收购后 OpenAI 断供背景下，GLM 成为头部编码 IDE 的默认开源选项之一，分发地位跃升。→ [[Agentic编码/Cursor]]

### 2026-09

- **2026-09-29** · [Anthropic 评测 GLM-5.3：能自主构建端到端网络漏洞利用且防护易被绕过](https://aihot.news/items/eqf3o3tlak08851t52unuji2o)
  Anthropic Research 官方评测：GLM-5.3 能自主构建端到端网络漏洞利用、且现有防护易被绕过——前沿实验室首次以官方报告点名评估中国开源前沿模型的网络安全能力；对 GLM 而言这是「涌现网安能力」（08-14 发布时官方自述）首次获得对手方的独立证实，双刃属性由此坐实。→ [[AI安全与对齐/对齐与可解释性研究]]

### 2026-08

- **2026-08-28** · [GLM-5.3 开源权重](https://aihot.virxact.com/items/cmtd32q060c3vroq546ccqp7r)
  官方 X 兑现两周之诺开放权重下载（IT之家次日报道）：GLM 许可允许本地部署、微调与商用，仅年营收超 100 亿美元的机构对外提供服务须接受安全审查；发布前因网络防御能力专门追加了两周全面安全评估。
- **2026-08-26** · [GLM-5.3-Flash 开源发布](https://www.zhipuai.cn/zh/research/163)
  原生多模态 Flash 档，MIT 许可开源；据财联社、36氪报道，推理全部承载于国产算力卡（约 10 万张），API 价格约为 Claude Opus 4.8 的 1/40。VentureBeat 同步报道；次日唐杰披露其登顶 OpenRouter 周 token 份额（近 20%），定价约为前沿模型 1/100、由纯国产芯片驱动。
- **2026-08-19** · [GLM-5.3 AA 综合智能指数 60 分，并列开源第一](https://aihot.virxact.com/items/cmszeb2mx0b3srodpef1ub0j0)
  官方公众号：Artificial Analysis 综合智能指数 60 分，与 Claude Fable 5、GPT-5.6 Sol 同档、与 Kimi K3 并列开源第一；API 定价与 GLM-5.2 持平，自称单任务成本为旗舰模型中最低。
- **2026-08-14** · [GLM-5.3 发布](https://z.ai/blog/glm-5.3)
  旗舰迭代，主打前沿编码与「涌现网络安全能力」（官方博客口径）；Bloomberg、VentureBeat 报道。发布时 API/Coding Plan 先行，开源权重官方承诺两周内开放。

### 2026-06

- **2026-06-13** · [GLM-5.2 发布并开源](https://finance.sina.com.cn/tech/digi/2026-06-13/doc-inicfvnr2880919.shtml)
  面向「长任务时代」的旗舰模型；真正可用 1M 上下文；Coding 与长程任务达开源 SOTA；MIT 开源。在 Code Arena 盲测中取得全球可用模型第一。
- **2026-06-01** · [建议发行 A 股并在科创板上市](https://aihot.virxact.com/items/cmpvej11l065tsl0zrvg9kj3a)
  IT之家报道港交所公告：拟发行占总股本 2%-8% 的新股登陆上交所科创板，募资投向通用基座大模型与 MaaS 平台；英文名称拟变更为 Z.AI Co., Ltd.，A+H 布局启动。

### 2026-05

- **2026-05-22** · [GLM-5.1 高速版发布](https://aihot.virxact.com/items/cmpga762r0dm4sljw23zihurw)
  输出速度 400 tokens/s，官方称刷新全球大模型 API 速度纪录（IT之家、官方公众号）。

### 2026-04

- **2026-04-07/08** · GLM-5.1 开源
  MIT 许可证开源权重，可免费商用。

### 2026-03

- **2026-03-27** · [GLM-5.1 发布](https://www.cls.cn/detail/2339864)
  3 月 27 日面向付费用户开放商用；744B/40B，完全基于华为国产芯片训练；唯一可「8 小时持续工作」的开源模型；SWE-Bench Pro 58.4 分登顶；核心工程能力对标 Claude Opus 4.6。

### 2026-02

- **2026-02-11** · [GLM-5 发布并开源](https://www.jiemian.com/article/14007254.html)
  旗舰模型，744B 总参/40B 激活，200K 上下文，预训练数据 28.5T；Coding/Agent 达开源 SOTA；对标 Claude Opus 4.5。同日讯飞星火 X2 亦发布。

### 2026-01

- **2026-01-19** · [GLM-4.7-Flash 开源、免费](https://aihot.virxact.com/items/cmnw1yzew01qsslc39bjxr11k)
  官方研究页宣布 4.x 世代 Flash 档开源且免费开放。
- **2026-01-13** · [联合华为开源 GLM-Image](https://aihot.virxact.com/items/cmo6qhlas059gsl4ruol1p1qv)
  首个基于国产昇腾芯片与 MindSpore 全流程训练的 SOTA 多模态生成模型（9B 自回归 + 7B 扩散解码器），复杂视觉文字生成居开源第一，API 低至 0.1 元/张。
- **2026-01-08** · [智谱港交所挂牌上市](https://m.caixin.com/m/2026-01-08/102401574.html)
  「全球大模型第一股」，首日高开 3.27%，市值约 555 亿港元。CEO 唐杰发内部信定调 2026 四大方向：GLM-5 迭代、新架构、更强泛化 RL、在线学习。→ [[商业与投融资/OpenAI融资与重组]]

## 关联线索

- [[开源模型与生态/DeepSeek]]
- [[开源模型与生态/Qwen]]
- [[商业与投融资/AI人才与并购潮]]
- [[推理与基础设施/AI芯片竞争]]

