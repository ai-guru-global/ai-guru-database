---
线索: Gemini
主题: 基础模型
别名: [Google Gemini, Gemini 1.5, Gemini 2.0, Gemini 2.5]
状态: 活跃
创建: 2026-07-30
更新: 2026-10-03
关键角色: [Google, Google DeepMind]
---

# Gemini

> Google DeepMind 的原生多模态旗舰，凭超长上下文与全家桶分发完成从追赶者到并跑者的逆转。

## 概述

Gemini 是 Google DeepMind 的旗舰模型系列，2023 年 12 月发布，定位「原生多模态」（从头以文本/图像/音频/视频联合训练）。其标志性能力是百万级 token 超长上下文（Gemini 1.5）与深度整合 Google 生态（搜索、Workspace、Android）。

在经历 Bard 时期的仓促追赶后，Gemini 2.0/2.5 世代已稳定处于第一梯队；2026 年进入 Gemini 3/3.5 世代的高频点版本迭代（Pro/Flash/Live/Omni 多形态并行）。该线索追踪 Google 在基础模型上的技术路线与产品整合。

### 2026-09

- **2026-09-30** · [Google DeepMind 发布 Gemini 4 Argon，面向可信网络防御者先行开放](https://aihot.news/items/uob3jvsb97uh5achwaggjrhqh)
  继 Gemini 3.8 Flash 不到一个月再度旗舰点版本迭代；Artificial Analysis 智能指数追平 GPT-6 Astra，折扣价下每任务成本仅 Astra 的 60%，Google 重回智能水平前三（[Artificial Analysis 完整文章](https://aihot.virxact.com/items/thdata2aa7ex9kgzv72mk4kn3)）。Gemini 4 Argon (High) 上线 Arena Agent Arena 第 8 名（净提升 +7.92%，[镜像](https://aihot.virxact.com/items/m49i2ro59f3lqy8ocoghr9f2j)）；Gemini 4 是 Google DeepMind 首个 proprietary 模型（Demis Hassabis 在 10-01 转发时点明）。同日发布 [SynthID Bio](https://aihot.news/items/deivg466iwv9ypddacud3hd7d)：把不可感知签名直接嵌入蛋白质序列，是面向 AI 生成生物设计的首个水印家族。
- **2026-09-30** · [Google DeepMind 发布 SynthID Bio，为 AI 生成的蛋白质嵌入可验证水印](https://aihot.news/items/deivg466iwv9ypddacud3hd7d)
  Sundar Pichai 宣布 SynthID Bio 作为面向 AI 生成生物设计的新型水印方法家族，首次实现将不可感知的签名直接嵌入蛋白质序列、且不影响其生物功能；技术细节与适用范围由 DeepMind 与 Sundar Pichai 官方推文同步公开，属「科学诚信 + 生物安全」双向意义的水印首发。
- **2026-09-23** · [Google DeepMind 发布 Gemini 3.8 Flash TTS 与 Flash-Lite TTS 语音生成模型](https://aihot.news/items/cmuea8xrm0t1nroghhxj2y3eg)
  Gemini 3.8 Flash 系列在文本、Live、Thinking、TTS 四档位上完成扩展，TTS 与 ASR（8-26 Gemini 3.5 Transcribe）合拢，DeepMind 拿到「对话 - 听 - 写」全链路。→ [[语音与音频/ElevenLabs|语音与音频]]
- **2026-09-15** · [Google DeepMind 发布 Gemini 3.8 Live 和 3.8 Live Extended Thinking](https://aihot.news/items/cmu2xqfxz02zhroc1hxuzi6jm)
  Gemini 主线在 Flash / Flash-Lite / Flash Cyber 之外再扩 Live 双档位，主打实时音视频交互与扩展思考模式，与同周 StepAudio 3（阶跃星辰）和 Vidu S2（生数科技）共同把 9 月中旬的语音 / 视频生成推到多模型同日发布节奏。→ [[语音与音频/ElevenLabs|语音与音频]]
- **2026-09-03** · [Google DeepMind 发布 WeatherNext 3 全球天气 AI 模型](https://aihot.virxact.com/items/cmtlnmh4o0fmsrow5i7pdq8b0)
  官方博客发布第三代全球天气模型，支持逐小时更新、分辨率较上一代提升约 5 倍。
- **2026-09-02** · [Google DeepMind 发布 Gemini 3.8 Flash 与 3.8 Flash Cyber 两款新模型](https://aihot.virxact.com/items/cmtkbdbti01n8roz5k5kt1g98)
  3.7 Flash 发布约三周内再度点版本迭代，通用工作马 3.8 Flash 与政府专用网络安全型号 3.8 Flash Cyber 并行发布，延续「Flash + Cyber」双轨。

### 2026-08

- **2026-08-27** · [Gemini Omni 1.1 Flash 发布，为开发者提供更强生成式视频控制](https://aihot.virxact.com/items/cmtbq1hfq156croamzzo9gno2)
  DeepMind 官方博客发布 Omni 1.1 Flash，向开发者开放更强的生成式视频控制能力。
- **2026-08-26** · [Gemini 3.5 Transcribe 发布](https://aihot.virxact.com/items/cmtacq8vz0aedroj24bcix9go)
  官方发布面向实时语音交互的高精度语音转文本模型，补齐 3.5 家族的转写形态。
- **2026-08-13** · [Gemini 3.7 Flash 发布](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/)
  定位「最智能的工作马模型」，主打编码与 Agent 工作流能力的大幅跃升（约三周内的点版本迭代）；Reuters 报道其面向编码与 Agent 场景，官方同步放出模型卡；8-14 起全面上线 Pro 与 Ultra 订阅用户。
- **2026-08-11** · [Gemini 月活破 10 亿，成谷歌增长最快产品](https://aihot.virxact.com/items/cmsoxh6oa0a3drohdskp7cb9u)
  Sundar Pichai 官宣 Gemini 月活跃用户突破 10 亿，The Verge 指出其与 ChatGPT 同月双双迈过 10 亿门槛。

### 2026-07

- **2026-07-21** · [Gemini 3.6 Flash + 3.5 Flash-Lite + 3.5 Flash Cyber 发布](https://techcrunch.com/2026/07/21/google-releases-three-new-gemini-models-but-no-3-5-pro/)
  三型号同日发布：3.6 Flash（工作马，$1.5/M 输入、$7.5/M 输出，DeepSWE 49% vs 3.5 的 37%）、3.5 Flash-Lite（最低成本）、3.5 Flash Cyber（仅政府专用的网络安全模型）。3.5 Pro 仍未发布。
- **2026-07-17** · Gemini 3.5 Pro 推迟
  DeepMind 放弃原基础、采用更长预训练周期，3.5 Pro 推迟（具体日为半证实单源，Google 官方仅称「仍在测试」）。

### 2026-06

- **2026-06-30** · [Nano Banana 2 Lite 与 Gemini Omni Flash 发布](https://aihot.virxact.com/items/cmr0ucc880030slatw1gfkq2h)
  DeepMind 官方博客发布轻量图像模型 Nano Banana 2 Lite，并正式放出 Omni Flash（I/O 预览后的全量版本）。
- **2026-06-10** · [DiffusionGemma：文本生成提速 4 倍的开源扩散模型](https://aihot.virxact.com/items/cmq8aoxud00ngslldd191n34b)
  官方开源的离散扩散语言模型，文本生成较自回归快 4 倍；技术报告 7 月底公布。
- **2026-06-09** · [Gemini 3.5 Live Translate 发布](https://aihot.virxact.com/items/cmq6sxx1u0bizsl5ib9ja78pe)
  官方发布 70+ 语言近实时语音到语音翻译模型，进一步铺开 3.5 家族的语音形态。
- **2026-06-03** · [Gemma 4 12B 发布](https://aihot.virxact.com/items/cmpyerfzl04g6slaxbcd0ly8n)
  Hassabis 与 Pichai 官宣：统一无编码器多模态架构，16GB VRAM 即可本地多步推理；Gemma 4 系列累计下载量破 1.5 亿。

### 2026-05

- **2026-05-28** · [Nano Banana Pro 与 Nano Banana 2 正式发布](https://aihot.virxact.com/items/cmpps64fo00p9slm6g6j53psu)
  官方开发者渠道宣布旗舰图像模型 Nano Banana Pro 与 Nano Banana 2 正式开放。
- **2026-05-25** · [AlphaProof Nexus 以几百美元成本解决数十年未解数学问题](https://aihot.virxact.com/items/cmpl3eupd0chwsl01o9tkqehz)
  The Decoder 报道 DeepMind 的 AlphaProof Nexus 以数百美元算力成本攻克悬置数十年的数学难题。
- **2026-05-19** · [Google I/O 2026：Gemini 3.5 系列启动 + Gemini Omni 取代 Veo](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/)
  I/O 2026 发布 Gemini 3.5 Flash（已上线）并预告 3.5 Pro；同日发布 Gemini Omni（取代 Gemini App 中的 Veo），首版 Omni Flash 当日可用，可将任意参考（图像/文本/视频/音频）转为统一输出。2026 年 5 月起 Gemini App 后端默认调用 Omni 而非 Veo。→ [[多模态大模型/视频生成竞赛]]
- **2026-05–06** · Gemini 3 Deep Think 升级
  面向科学/研究/工程的推理升级，面向 AI Ultra 订阅者。

### 2026-04

- **2026-04-30** · [Gemini Embedding 2 发布](https://aihot.virxact.com/items/cmolryh3501wosll966mttaas)
  官方 X 发布谷歌首个原生多模态嵌入模型，面向多模态 RAG 检索场景。
- **2026-04-02** · [Gemma 4 发布](https://en.wikipedia.org/wiki/Gemini_(language_model))
  开源多模态模型系列迭代；官方称「各尺寸最强开源模型」、性能超体量 10 倍以上的模型（Hassabis），Hugging Face 同步上架。

### 2026-03

- **2026-03-26** · [Gemini 3.1 Flash Live 发布](https://aihot.virxact.com/items/cmnw1yr5o00vwslc33gg9tne6)
  官方称「迄今最高质量的音频与语音模型」，更低延迟、更高精度，驱动 Gemini Live 迄今最大升级。
- **2026-03-03** · Gemini 3.1 Flash Lite 开发者发布
  通过 Google API 向开发者发布。

### 2026-02

- **2026-02-26** · [Nano Banana 2 发布](https://aihot.virxact.com/items/cmo22udgi012qslbag8z2fl3l)
  DeepMind 官宣基于最新 Gemini Flash 的图像生成模型，宣称达到 SOTA。
- **2026-02-19** · [Gemini 3.1 Pro 发布](https://aihot.virxact.com/items/cmnwsdqak003dslagneje0uhp)
  官方博客发布，定位「专为最复杂任务打造的更智能模型」，核心智能全面升级。

### 2026-01

- **2026-01-29** · [Project Genie（Genie 3 世界模型）向公众开放](https://mashable.com/article/google-launches-project-genie-3-how-to-try)
  Genie 3 世界模型通过 Project Genie 网页界面向 Google AI Ultra 美国订阅用户推出，可从文本生成可探索的交互式 3D 环境。→ [[世界模型/Genie]]
- **2026-01-05** · Gemini 3 Grounding 计费开始
  Gemini 3 的 Google Search Grounding 开始计费。
- **2026-01** · [AlphaGenome 论文发表于 Nature](https://cen.acs.org/biological-chemistry/genomics/Googles-AlphaGenome-predicts-function-DNA/104/web/2026/01)
  DNA 功能预测模型正式发表于 Nature（模型本身自 2025-06 起非商用可用），解码人类「暗基因组」。→ [[行业应用/AlphaFold与AI科研]]

### 2025-03

- **2025-03** · [Gemini 2.5 Pro 发布](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/)
  内置思维链的推理模型，在 LMArena 等多个榜单登顶，编码与数学能力大幅跃升，被广泛视为 Google 首次拿到「单点最强」称号。

### 2024-12

- **2024-12** · [Gemini 2.0 发布，进入 Agent 时代](https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/)
  Gemini 2.0 Flash 主打原生工具调用与多模态输出，同步展示 Project Astra（通用助手）与 Project Mariner（浏览器 Agent），Google 正式宣布「Agentic 时代」路线。

### 2024-05

- **2024-05** · AI Overviews 全量上线美国
  I/O 大会宣布 Gemini 驱动的 AI Overviews 进入 Google 搜索主结果页，这是搜索四分之一个世纪以来最大的界面变革（初期因错误答案风波紧急收缩）。

### 2024-02

- **2024-02** · [Gemini 1.5 发布，百万 token 上下文](https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/)
  MoE 架构 + 100 万（实验室 1000 万）token 上下文窗口，长上下文成为 Gemini 相对 GPT/Claude 的第一个明确技术优势；同月 Bard 更名 Gemini。

### 2023-12

- **2023-12** · [Gemini 1.0 发布](https://blog.google/technology/ai/google-gemini-ai/)
  Google DeepMind 合并后的首个旗舰成果，分 Ultra/Pro/Nano 三档，宣称 MMLU 超越 GPT-4（后因演示视频剪辑争议口碑受损）。

## 分析

1. **从追赶到并跑的教科书**：Bard 的仓促（2023）→ Gemini 1.5 找到长上下文差异化（2024）→ 2.5 登顶（2025），Google 用两年时间证明其研究底蕴（Transformer 发源地）+ TPU 自有算力 + 数据生态的综合优势难以被长期压制。

2. **分发是终极武器**：搜索 AI Overviews、Android 内置、Workspace 集成——Gemini 不需要赢得「主动选择」，只需成为数十亿用户的默认选项。这与 Meta 策略同构，且监管是最大变数（搜索垄断案）。

3. **TPU 垂直整合**：Gemini 全系在自研 TPU 上训练，Google 是唯一不依赖 NVIDIA 的前沿实验室，算力成本优势将在推理模型时代（token 消耗爆炸）被放大。

## 关联线索

- [[基础模型/GPT系列]]
- [[基础模型/Claude]]
- [[世界模型/Genie]]
- [[推理与基础设施/AI芯片竞争]]
