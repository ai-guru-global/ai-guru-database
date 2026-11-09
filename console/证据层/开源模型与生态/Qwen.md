---
线索: Qwen
主题: 开源模型与生态
别名: [通义千问, Qwen, Qwen3, Qwen-Coder]
状态: 活跃
创建: 2026-08-03
更新: 2026-09-04
关键角色: [阿里巴巴, 通义实验室]
---

# Qwen

> 阿里通义千问系列，中国开源大模型的旗舰之一，以高频率迭代与激进开源策略见长。

## 概述

Qwen（通义千问）是阿里巴巴的大模型系列，覆盖通用、Coder、VL（视觉）、数学等多条线。2024 年起 Qwen2/2.5 系列以 Apache 2.0 开源，迅速成为 Hugging Face 上下载量最大的中国模型族；2025 年 Qwen3 引入「混合推理」（Hybrid Thinking）。

2026 年 Qwen 进入「Agentic AI era」定位，迭代速度进一步加快（Qwen3.5 → 3.5-Omni → 3.6 → 3.7-Max → Qwen4 Coder → 3.8），并横向扩张至全模态、具身智能（VLA、Robot）与图像生成，旗舰闭源 Max 系列与开源系列双线并进；7 月国行 Apple 智能确认集成千问模型。该线索追踪 Qwen 的版本演进与开源生态影响。

### 2026-09

- **2026-09-20** · [Qwen 开源 Qwen-Image-2.1：7B 统一生成与编辑并原生支持透明图像](https://aihot.news/items/cmu9tfhu904turokx2vfjy34f)
  Artificial Analysis 评测：登顶两个 AA-Image 榜单的开源权重模型（[镜像](https://aihot.virxact.com/items/kaz49j9sbrf1rcugch9d2fdjm)）；透明图像原生输出使生成 → 编辑工作流首次不需额外抠图通道，是开源图像线的首次「统一模型贯通」范式。→ [[多模态大模型/视频生成竞赛]]
- **2026-09-18** · Qwen3.8-LiveTranslate 实时同传模型发布
  官方博客：LAAL（Latency-Aware Accuracy Level）降至 2.3 秒，主打实时同传场景；与 Omni-Flash（9-17）合并构成 9 月中下旬的「实时 + 全模态」双轴。
- **2026-09-17** · [Qwen 发布原生全模态模型 Qwen3.8-Omni-Flash，主打音视频智能体任务交付](https://aihot.news/items/cmu5smj860insroqokcuh0u9v)
  继 8-26 Qwen3.8-Flash-Next、9-18 Qwen3.8-LiveTranslate（LAAL 2.3 秒）后再次把全模态能力下放到 Flash 档位；统一模型贯通文本 / 图像 / 音频 / 视频四线。
- **2026-09-02** · [Qwen3.8-Max-0902 登顶 Code Arena](https://aihot.virxact.com/items/cmtjimzgx083zrobvekm2zmje)
  官方 X：Code Arena: WebDev 以 1691 分首发即总榜第一，混合定价 $5/MToken、自称领跑性价比 Pareto 前沿；2.4T 参数、1M 上下文，Qwen Cloud 可试用（官方口径，榜单原始数据待第三方核验）。

### 2026-08

- **2026-08-26** · [Qwen3.8-Flash-Next 发布](https://qwen.ai/blog?id=qwen3.8-flash-next)
  125B 总参/6B 激活的多模态 MoE 快速档，主打极致成本；官方称其架构为 Qwen4 的预演（The Decoder、MarkTechPost 报道）；同日官方 X 宣布 Qwen3.8-Flash 开源。
- **2026-08-20** · [Qwen-UI-Agent 发布](https://aihot.virxact.com/items/cmt1di48c04vuro1q95i06dby)
  阿里发布「以真实世界为中心」的 GUI 智能体基座模型（IT之家报道）：覆盖手机/电脑/网页/DeepSearch，MobileWorld 82.1%、OSWorld-Verified 79.5%；自建 100+ 台真机环境训练评测，技术报告与 GitHub（Tongyi-MAI/MAI-UI）同日开放。
- **2026-08-14** · [通义千问开源 Qwen3.8 系列模型](https://aihot.virxact.com/items/cmst3j53e03ncro068tgsr4xn)
  官方 X 宣布：Qwen3.8-27B 稠密多模态（262K 上下文可扩至 1M）与旗舰级 Qwen3.8-2.4T-A95B 开放权重，Apache 2.0，上架 Hugging Face 与 ModelScope；硅基流动同步上线。
- **2026-08-06** · [千问全网首发公测，Wan3.0 视频生成模型亮相](https://aihot.virxact.com/items/cmshjzc390h6cronkkgtujtis)
  千问 APP 公众号：新一代视频生成模型稳定直出 30 秒一镜到底，主打导演级镜头语言与角色/场景一致性，在千问创作率先开放公测。
- **2026-08-06** · [Qwen-Image-3.0 正式发布，高清图低至 $0.03](https://aihot.virxact.com/items/cmsh5bwo400rjro280qm4x4is)
  阿里云 X 宣布图像模型转正：主打生产就绪（4.5K token 长提示词、12 种语言文本渲染），弹性计费高清图 $0.03 起，上架 Model Studio 与 Qwen Cloud。
- **2026-08-03** · [Qwen3.8-Max 发布](https://qwen.ai/blog?id=qwen3.8)
  阿里官方博客确认：2.4T 参数、1M 上下文；Bloomberg、CNBC 交叉报道；27B 版以 Apache 2.0 开源权重先行（HuggingFace Qwen/Qwen3.8-27B）。7 月预览版条目的存疑随官方发布解除。

### 2026-07

- **2026-07-21** · [Qwen-Image-3.0 发布](https://aihot.virxact.com/items/cmru9nwvo0b1kbi7f5vi9uqfu)
  第三代图像生成模型，官方博客称核心关键词为「真实」；Pro 版 8 月 5 日上线 Qwen Cloud（官方 X）。
- **2026-07-15** · [国行 Apple 智能完成备案，千问将接入苹果 AI](https://aihot.virxact.com/items/cmrltzprt0013bi5ku0th9q9q)
  IT之家报道阿里千问将集成至苹果 AI 能力；TechCrunch 次日确认 Apple Intelligence 获准在华上线、将集成阿里 Qwen 与百度 AI 能力。
- **2026-07** · Qwen3.8 预览版上线
  预览版上线，多家媒体汇总提及目标超越 GLM-5.2；官方 X 已于 7 月 19 日宣布「Qwen3.8 开源发布，2.4T 参数模型上线」，此前存疑解除。

### 2026-06

- **2026-06-16** · [Qwen-Robot 具身智能基础模型套件发布](https://aihot.virxact.com/items/cmqg5kvq2006fslncudi17omu)
  官方博客同步推出三件套：Qwen-Robot 基座、RobotWorld 具身世界模型与 RobotManip 机器人操作模型，打通大模型到物理世界。
- **2026-06-02** · Qwen 4 Coder 32B-A3B 发布
  首个迈入第四代的 Qwen 模型，开源，在同类编码基准上达成重要里程碑。
- **2026-06-01** · [Qwen3.7-Plus 多模态智能体模型发布](https://aihot.virxact.com/items/cmpvhrr4m070isl0z1o4ce6hx)
  官方博客与通义实验室公众号同步宣布，补齐 3.7 系多模态 Agent 档位。

### 2026-05

- **2026-05-29** · [Qwen-VLA 发布](https://aihot.virxact.com/items/cmpr2b1l40aa6slnoit9b7p92)
  官方博客发布视觉-语言-动作统一动作框架，迈向通用具身智能；同日登上 HuggingFace Daily Papers。
- **2026-05-19/20** · [Qwen3.7-Max 发布](https://venturebeat.com/technology/alibabas-proprietary-qwen3-7-max-can-run-for-35-hours-autonomously-and-supports-external-harnesses-like-anthropics-claude-code)
  云栖大会发布旗舰闭源模型；可自主运行长达 35 小时；支持 Claude Code 等外部框架；定位「Agent Era」办公生产力。官方 X 后引 Code Arena：代码竞技场第四、与 Claude Opus 4.6 持平。

### 2026-04

- **2026-04-22** · [Qwen3.6-27B 发布](https://aihot.virxact.com/items/cmoczwjl40046slkqqx0d9t1v)
  27B 稠密模型实现旗舰级编程能力（Simon Willison 评测评测），后成为社区本地开发热点。
- **2026-04-16** · [Qwen3.6-35B-A3B 开源](https://aihot.virxact.com/items/cmq2o71l101jnsl6n5x3b4qk1)
  通义实验室宣布开源，主打能动（agentic）编码能力的 35B 总参/3B 激活 MoE。

### 2026-03

- **2026-03-29** · [Qwen3.5-Omni 发布](https://aihot.virxact.com/items/cmnw1zbm102csslc39zjhqn79)
  官方发布最新一代全模态模型，统一理解文本、图像、音频与视频，口号「迈向原生全模态 AGI」，并配套 Qwen Studio 一站式工作台。

### 2026-02

- **2026-02-16** · [Qwen3.5 发布并开源](https://www.reuters.com/world/china/alibaba-unveils-new-qwen35-model-agentic-ai-era-2026-02-16/)
  原生多模态 MoE（397B 总参）；面向「Agentic AI era」；比前代便宜约 60%、大负载处理能力提升 8 倍；兼容 OpenClaw 等开源 Agent。

### 2026-01

- **2026-01** · Qwen3-Max-Thinking 发布
  超万亿参数推理大模型，创阿里推理模型规模纪录。（注：见于年初盘点汇总，参数规模待官方核实。）

## 关联线索

- [[开源模型与生态/DeepSeek]]
- [[开源模型与生态/智谱GLM]]
- [[推理与基础设施/AI芯片竞争]]
- [[训练与数据/RLHF与后训练]]

