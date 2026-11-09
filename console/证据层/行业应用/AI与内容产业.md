---
线索: AI与内容产业
主题: 行业应用
别名: [AI视频生成, AI音乐生成, AI翻译, AI配音, AI游戏内容, 影视AI, 数字人, 字幕组, 内容本地化]
状态: 活跃
创建: 2026-10-03
更新: 2026-10-03
关键角色: [字节跳动Seed, 生数科技Vidu, 腾讯混元, 美团LongCat, 阿里巴巴, Cohere, ElevenLabs, Runway, Luma AI, Google DeepMind, NVIDIA, Hugging Face, 小红书, MiniMax, A24, 华策影视]
---

# AI与内容产业

> 内容产业是 AI 能力最先被「按秒计价」的行业：视频、音频、翻译三条线各自长出了独立的价格、独立的评测和独立的劳资摩擦，而三者的下游客户（影视、直播、出海、社媒）其实是同一批人。

## 概述

本线索覆盖 AI 在内容生产链上的四条主线：**视频生成**（含数字人与实时交互）、**音频与配音**（含音乐生成）、**翻译与本地化**（含端侧模型与字幕/弹幕场景）、**游戏与互动内容**。四条线在镜像里的时间密度差别很大：视频与翻译自 2026-04 起几乎每月都有发布，音频与音乐集中在 2026-03 至 2026-07 的模型窗口，游戏侧则大量以「编码智能体顺手做出一个可玩游戏」的形态出现——后者与 [[Agentic编码/ClaudeCode]]、[[Agentic编码/Codex]] 的边界在本页是刻意保留的：本页只登记「产出物是内容」的事件，不登记开发工具本身的迭代。

产业侧的资本与渠道动作比模型侧稀疏但更硬：[[开源模型与生态/DeepSeek]]、[[开源模型与生态/MiniMax]] 等中国厂商以「成本砍半」「端侧 440MB」这类价格与体积口径竞争，而 Google DeepMind 对 A24 的投资、生数科技与华策影视的战略合作则把 AI 从工具位推进到制片位。翻译与配音侧最值得注意的结构性事实是：多个厂商在同一时间窗内报出「70+ 语言」这个同一量级的能力口径（Google、OpenAI 各自宣称），但两家的口径含义不同（输入侧覆盖 vs 语音到语音近实时），本页分别登记而不合并。

劳动侧证据极薄：本页只有一条来自汉化组/字幕组从业者访谈的素材（2026-09-21，单源公众号），它撑不起「AI 冲击内容本地化就业」这个判断，只能登记为缺口。收入口径在本垂直整体缺位：镜像内没有任何一家内容生成厂商公布过收入、调用量或客户数，因此本页不做任何市场规模陈述。

## 时间线

### 2026-09

- **2026-09-21** · [数字生命卡兹克访谈汉化组：AI 时代字幕组与漫画组的真实处境](https://aihot.news/items/cmualyqxc0nztro5tbldva2bh)
  ⚠️ 单源（来源：公众号：数字生命卡兹克），属从业者自述层级。这是本线索目前唯一一条劳动侧一手素材，样本量 = 一个汉化组，不足以支撑行业判断，仅登记为缺口线索。
- **2026-09-11** · [实测 DeepSeek V4.1 Flash：价格大降、原生带视觉，作者用游戏与城市生成任务验证表现](https://aihot.news/items/cmtwsc5gt09uarow7n2r2jrz3)
  ⚠️ 单源实测（来源：公众号：卡尔的AI沃茨）。「价格大降」的具体数字未在本条引用，因镜像只有转述标题；能力口径以作者自选任务为样本，不作基准结论。
- **2026-09-09** · [Cohere 发布开源权重翻译模型 North Small Translate，WMT26 得分 83.60 超越 DeepL 与 Google Translate](https://aihot.news/items/cmuh2jk8606ssrolz2ouuav48)
  ⚠️ 厂商口径（来源：Cohere 产品与研究博客（网页））：83.60 与「超越 DeepL / Google Translate」均为发布方自述，未取 WMT26 官方成绩表交叉；对比对象是否同口径（是否含专有模型微调）未核。
- **2026-09-04** · [OpenAI 工程师用 Astra 在 Codex 中构建太空游戏 Void Explorer 的实践详解](https://aihot.news/items/oi75rpmjfylkbnch2czemkpwg)
  一手工程实践（来源：OpenAI Developers：Blog（网页））。登记理由：这是「AI 生成可发布游戏内容」的工程侧样本，含工作流细节而非演示短片。
- **2026-09-04** · [开发者用 Claude Fable 5 在 Claude Code 中将 1993 年 Amiga 游戏 Babylonian Twins 移植到 Godot](https://aihot.news/items/cmtm7yl5s01dbrobnjyyupz0q)
  ⚠️ 单源（来源：Hacker News 热门（buzzing.cc 中文翻译））：经聚合站翻译转述，未取得原帖与作者仓库。

### 2026-08

- **2026-08-31** · [基于 MiniMax H3 Max 的 24 小时 AI 直播网站上线了](https://aihot.news/items/cmtgihylr01tlrokdreezpex0)
  ⚠️ 厂商口径（来源：公众号：MiniMax（稀宇科技））：「24 小时直播」是产品形态演示，未给观众规模或留存数据。
- **2026-08-26** · [腾讯混元将端侧翻译模型 Hy-MT2-1.8B 压缩至 440MB，已落地哔哩哔哩直播弹幕翻译](https://aihot.news/items/cmta7honk0553roj21gque0zw)
  厂商口径（来源：公众号：腾讯混元），但「落地哔哩哔哩直播弹幕翻译」是少见的**具体生产场景声明**——与多数只报模型分的发布不同，本条给出接入位；弹幕量与准确率未披露 ⚠️。
- **2026-08-25** · [OpenRouter 视频生成 API：一份代码优先的接入指南](https://aihot.news/items/cmt8zzh0w05nirolyozmvq7i0)
  一手文档（来源：OpenRouter：Announcements（RSS））。登记理由：视频生成开始进入**聚合网关**层，意味着多家模型被同一套计价与路由口径统一定价。
- **2026-08-07** · [小红书联合浙大、复旦提出 CULTURE-MT：首个面向社媒翻译的「文化有效性」评测基准，入选 ICML 2026](https://aihot.news/items/cmsiry2eo1r4tronkt9qv2twu)
  来源：公众号：小红书技术（dots.llm）。学术侧一手程度较高（有 ICML 2026 归属表述），但会议接收状态未取官方录用列表交叉 ⚠️。
- **2026-08-07** · [Seedance 2.5 API上线，视频生成开启「电影级长叙事」](https://aihot.news/items/cmsijqoan1h2qronk7rexfm14)
  ⚠️ 厂商口径（来源：公众号：火山引擎）：「电影级」「长叙事」均为宣传词，未给时长上限、分辨率与价格。
- **2026-08-06** · [面壁智能 AMNESIAC：反向图灵测试 AI 审讯游戏](https://aihot.news/items/cmshjbfzc0gceronkw6dqhrsb)
  ⚠️ 单源（来源：X：面壁智能 OpenBMB (@OpenBMB)），厂商自有账号；游戏可玩性与评测未取第三方样本。
- **2026-08-05** · [用 Claude Fable 5 一次性生成完整《Raccoon Heist》游戏](https://aihot.news/items/cmsgiawmi06n8ro5qttsxdlib)
  一手实践记录（来源：Simon Willison 博客）：本条是「一次性生成完整可玩游戏」中证据质量最高的一条，作者附可复现过程而非演示视频。
- **2026-08-02** · [EA 首席战略官谈生成式 AI 如何进入可游玩的实时游戏世界](https://aihot.news/items/cmsdo0x3203dmro0ovomuyfqx)
  来源：Runway：News（网页）——⚠️ 需注意采访方即被访方所属生态（Runway 主持内容），EA 一侧的落地规模与投入未披露。

### 2026-07

- **2026-07-23** · [SANA-Video 2.0：混合线性注意力与注意力残差实现高效视频生成](https://aihot.news/items/cmryvpwy905kerolgy47s0xdn)
  一手论文（来源：HuggingFace Daily Papers（社区热门论文））：效率主张以论文自报指标为层级，未取第三方复现。
- **2026-07-19** · [字节跳动发布 Seed Audio 1.0 音频创作模型，统一建模人声与音效实现端到端影视级音频生成](https://aihot.news/items/cmrsopm9r0b7ubiwmtfvpwkxu)
  来源：字节 Seed：Research Feed（网页内嵌数据）。厂商口径 ⚠️，但属研究侧发布页而非营销稿；「影视级」为宣传词，未给片方采用证据。
- **2026-07-14** · [Google AI 发布 Gemini 3.5 Live Translate，支持 70+ 语言近实时语音到语音翻译](https://aihot.news/items/cmrkta2fv011vbi5qe7hdwh0s)
  来源：X：Google AI for Developers (@googleaidevs)；与 2026-06-09 Jeff Dean 同题发布属**同一厂商两渠道**，不构成独立交叉印证。
- **2026-07-10** · [GenCeption：视频生成模型作为通用视觉学习器](https://aihot.news/items/cmrillgtw009abilk3fe1kk05)
  一手论文（来源：HuggingFace Daily Papers（社区热门论文））。
- **2026-07-07** · [NotebookLM短视频概览正式上线](https://aihot.news/items/cmray36fg021nihogfo205417)
  ⚠️ 单源（来源：X：Gemini Notebook (@Gemini_Notebook)），产品号自述，未取 Google 官方博客正文。
- **2026-07-03** · [生数科技发布 Vidu S1，推动视频生成迈向「实时交互」新时代](https://aihot.news/items/cmr53vzsc07l3sll5x8mfscz3)
  ⚠️ 厂商口径（来源：公众号：生数科技（Vidu·视频））：「实时交互」的帧率与延迟数值未在本条引用。

### 2026-06

- **2026-06-22** · [Google DeepMind 7500 万美元投资 A24，合作开发电影 AI 工具](https://aihot.news/items/cmqpl4smd01j1slp5npj3krmn)
  来源：TechCrunch：AI（RSS）。本条是本线索里**资本与制片绑定**最明确的一条：金额与投资主体为报道口径 ⚠️，未取 DeepMind 或 A24 官方公告页交叉。
- **2026-06-16** · [成本砍半，字节跳动推出 Seedance 2.0 Mini 视频生成模型](https://aihot.news/items/cmqfzvk1h026sslspt58nzmdd)
  来源：IT之家（RSS）转述字节发布。「成本砍半」⚠️ 未给对照基准（相对 Seedance 2.0 哪一档、按 token 还是按秒）。
- **2026-06-09** · [Gemini 3.5 Live Translate 支持70+语言翻译](https://aihot.news/items/cmq6xs7fj00lgslbha1wb69hy)
  来源：X：Jeff Dean (@JeffDean)。与 7-14 同属 Google 自述渠道；与 2026-05-29 OpenAI 同量级口径是**不同厂商**，可作竞争存在性对照，不可作能力优劣比较。
- **2026-06-09** · [Luma AI Ray3.2 API：电影级渲染可集成](https://aihot.news/items/cmq6vx8zl000uslbhiiucbbxy)
  ⚠️ 厂商口径（来源：X：Luma AI (@LumaLabsAI)）。
- **2026-06-08** · [生数科技与华策影视达成战略合作，共建AI视听创制中心](https://aihot.news/items/cmq50iuao03eislt2og43waqb)
  ⚠️ 单源（来源：公众号：生数科技（Vidu·视频））：合作方华策影视侧未取得独立公告。这是中国侧「模型方 × 内容方」结构最清晰的样本，但合作深度（是否独家、是否付费）未披露。
- **2026-06-08** · [OmniGameArena：面向VLM游戏智能体的统一UE5基准与改善动态](https://aihot.news/items/cmq662pg105irsl5i1tkwikyf)
  一手论文（来源：HuggingFace Daily Papers（社区热门论文））。属评测基建侧，与 [[评测与基准/ARC系列基准]] 不同层：本基准测的是「玩内容」而非「生成内容」。
- **2026-06-06** · [五个实验室，五个心智：用小模型构建多模型金融剧情游戏](https://aihot.news/items/cmq2rp55c00hlsl97h98gkd14)
  一手博客（来源：Hugging Face：Blog（RSS））。跨域样本：内容形态是游戏，主题金融，与 [[行业应用/AI金融]] 有交集。
- **2026-06-05** · [京东开源JoyAI-Echo长音视频生成框架](https://aihot.news/items/cmq642x6l0501sl5i3sl7adjt)
  ⚠️ 厂商口径（来源：公众号：京东JoyAI）：开源许可、权重可得性未取仓库页交叉。
- **2026-06-04** · [Grok Imagine视频生成上线Vercel](https://aihot.news/items/cmpysolhn02y4sli3qzy0o7te)
  ⚠️ 单源（来源：X：Elon Musk (@elonmusk, xAI)），且经第三方平台承载，未取 Vercel 侧公告。
- **2026-06-03** · [Echo-Infinity：学习演化记忆实现实时无限视频生成](https://aihot.news/items/cmpyw41ob03vvsli3998nmc40)
  一手论文（来源：HuggingFace Daily Papers（社区热门论文））。

### 2026-05

- **2026-05-29** · [OpenAI推出实时翻译模型，支持70+语言输入](https://aihot.news/items/cmprd8aty0d2jslnojk7ompp6)
  来源：X：Greg Brockman (@gdb)。注意口径差异：本条为「语言**输入**覆盖」，与 Google 侧「语音到语音」不同层，不可并列为同一能力 ⚠️。
- **2026-05-28** · [ElevenLabs 发布 Dubbing v2 AI 配音模型，保留原始情感表演并支持 90+ 语言](https://aihot.news/items/px9k9ymt8q29gpg8cqarqwr5i)
  厂商口径（来源：ElevenLabs：Blog（网页））：90+ 语言为本垂直内最高的语言数自述；「保留原始情感表演」是主观质量主张，未取第三方评测 ⚠️。
- **2026-05-27** · [开源FastVideo Dreamverse实时视频生成工具](https://aihot.news/items/cmpoddncn053yslv428au39s3)
  来源：X：Sky Computing Lab (@haoailab)。与 2026-03-17 原型发布同渠道，属同一团队两次登记。
- **2026-05-22** · [美团开源 LongCat-Video-Avatar 1.5：数字人视频生成效率提升 15 倍](https://aihot.news/items/ql1pyrh787i56r2vpwzv62vor)
  ⚠️ 厂商口径（来源：公众号：龙猫LongCat（美团））：「15 倍」的分母与测项未披露。
- **2026-05-21** · [Viggle推出3D格斗派对游戏Fight Anyone 3D](https://aihot.news/items/cmpfw62gg0a6hsljwnu5etjbw)
  ⚠️ 单源（来源：X：Viggle AI (@ViggleAI)）。
- **2026-05-21** · [LongCat-Video-Avatar-1.5：升级版音频驱动数字人视频生成框架](https://aihot.news/items/cmpfoox6408bdsljwnbdhvasf)
  来源：美团 LongCat：HuggingFace 新模型——与 2026-05-22 公众号条目构成**同一厂商双渠道**（HF 仓库侧 + 自媒体侧），仓库页可作权重与许可的核验入口，是本垂直内印证质量较高的一组。
- **2026-05-21** · [腾讯开源Hy-MT2多语言翻译模型](https://aihot.news/items/cmpf9b1ua04fzsljw1eu965w5)
  来源：X：腾讯混元 (@TencentHunyuan)；与 2026-08-26 的 440MB 端侧压缩同属 Hy-MT 系列，可串成「开源发布 → 端侧压缩 → 落地弹幕」三步链。
- **2026-05-19** · [Gemini 3.5 Flash快速构建互动游戏](https://aihot.news/items/cmpd3im1b00mislk1cy88q2ht)
  ⚠️ 单源（来源：X：Gemini (@GeminiApp)），产品号演示。
- **2026-05-19** · [Gemini Omni助力Google Flow创作电影级故事](https://aihot.news/items/cmpczbj4s01k6sljl6alywqgy)
  ⚠️ 厂商口径（来源：X：Google DeepMind (@GoogleDeepMind)）：Flow 为用户侧创作工具，未披露专业片方采用。
- **2026-05-14** · [教视觉-语言模型说「电影语言」](https://aihot.news/items/cmp4yeqnn09sksljxvgbqhxp4)
  一手研究博客（来源：CMU：Machine Learning Blog）：把镜头语法做成可测能力，属评测基建而非产品发布。
- **2026-05-14** · [Together AI 开源视频翻译工具 Violin，集成 Whisper、DeepSeek V4 Pro 与 Sonic 3](https://aihot.news/items/cmu1gtphz0983rocnsf6pugjh)
  来源：Together AI 研究与产品博客（RSS）。工具链样本：把 ASR + LLM + TTS 串成端到端本地化流水线，与 [[语音与音频/ElevenLabs]] 有直接交集。
- **2026-05-12** · [Dungeons & Desktops: 使用 GitHub Copilot CLI 构建一款程序化生成的 Roguelike 游戏](https://aihot.news/items/cmp2t8mfk00fvsl1qaoedujdf)
  一手博客（来源：GitHub Blog）：厂商自有渠道 ⚠️；本条同时是本线索与编码智能体的边界样本。
- **2026-05-11** · [WorldReasonBench：面向未来世界状态预测的视频生成器人类对齐压力测试](https://aihot.news/items/cmp25c775049pslbpgxpk21cc)
  一手论文（来源：HuggingFace Daily Papers（社区热门论文））。与 [[世界模型/Genie]]、[[世界模型/WorldLabs]] 的判断口径相关：视频生成被从「好看」推向「世界状态一致」。
- **2026-05-02** · [Demis Hassabis 分享AI洞见：从游戏训练到科学发现与哲学思考](https://aihot.news/items/cmooa6mp30mqvsll9mwtts1lm)
  ⚠️ 观点性素材（来源：X：Demis Hassabis (@demishassabis)），只登记为厂商叙事，不含可引数据。

### 2026-04

- **2026-04-30** · [STARFlow-V：基于标准化流的端到端视频生成建模](https://aihot.news/items/cmor004mg009qslix0l0qi16f)
  一手论文（来源：Apple Machine Learning Research（RSS））。
- **2026-04-29** · [腾讯开源Hy-MT1.5-1.8B-1.25bit翻译模型，440MB体积支持手机离线运行](https://aihot.news/items/cmok52zii027oslz3yvh4kwyv)
  来源：X：腾讯混元 (@TencentHunyuan)。体积口径与 2026-08-26 的「压缩至 440MB」一致，可互为同厂商两渠道复述 ⚠️。
- **2026-04-27** · [阿里：视频生成模型 HappyHorse1.0 开启灰测，千问 App 首发支持 15 秒多镜头叙事](https://aihot.news/items/cmoh3v8t002jpslwp5vg9dk9q)
  来源：IT之家（RSS）。「灰测」「15 秒多镜头」为报道口径 ⚠️，未取阿里官方发布页；与 [[开源模型与生态/Qwen]] 属同集团不同产品线。
- **2026-04-15** · [Seedance 2.0：推进面向复杂世界的视频生成](https://aihot.news/items/cmo0vpnos02w5sli2drnkba57)
  一手论文（来源：HuggingFace Daily Papers（社区热门论文））：与 2026-06-16 Mini、2026-08-07 2.5 API 构成同族版本链。
- **2026-04-15** · [宣布推出视频生成功能](https://aihot.news/items/cmor004i8006uslix3utegke0)
  一手公告（来源：OpenRouter：Announcements（RSS））。与 2026-08-25 的接入指南配对：先加品类、后补文档，是网关层把视频当成标准 SKU 的两步。

### 2026-03

- **2026-03-25** · [基于 Lyria 3 构建：全新音乐生成模型开放预览](https://aihot.news/items/cmnwsxt6l007tslteaa524f7w)
  来源：Google Blog：AI（RSS）。厂商口径 ⚠️；「开放预览」的范围（地域、商用许可）未取正文。与 [[语音与音频/Suno]] 构成音乐生成两侧的竞争存在性。
- **2026-03-17** · [FastVideo推出Dreamverse原型，实现「氛围导演」式实时视频生成](https://aihot.news/items/cmnxjn85o00gpsl9orek4kxrd)
  来源：X：Sky Computing Lab (@haoailab)，原型阶段 ⚠️。

### 2026-02

- **2026-02-25** · [LLM Skirmish：AI代理可玩的实时战略游戏基准测试](https://aihot.news/items/cmnw1z0iz023oslc3xuv89mjk)
  ⚠️ 单源（来源：Hacker News：AI 热帖），属社区热度而非一手发布页。

### 2025-10

- **2025-10-21** · [Together AI 上线 40 多个图像与视频生成模型，新增视频生成 API](https://aihot.news/items/cmu1gtpi50995rocnh4rywulw)
  一手公告（来源：Together AI 研究与产品博客（RSS））：与 OpenRouter 2026-04-15 构成**两家网关**各自把视频纳入的独立记录，是本垂直内少见的跨厂商同类事实。
- **2025-10-10** · [Ming-VideoMAR：基于连续令牌的自回归视频生成模型](https://aihot.news/items/cmorb7ik40074slhfvdmvwsw7)
  来源：蚂蚁 inclusionAI：GitHub 新仓库，仓库存在性证据 ⚠️，模型质量与采用未证。

### 2025-08

- **2025-08-04** · [FastWan视频生成模型实现70倍加速，5秒出片](https://aihot.news/items/cmnxjn85o00h2sl9obw8o7gox)
  ⚠️ 厂商/团队自述（来源：X：Sky Computing Lab (@haoailab)）：「70 倍」未给对照基线与硬件。本条是本线索内最早的「实时化」速度口径。

## 分析

1. **本垂直的可引证据几乎全是厂商口径，且缺一个共同的字段：价格。** 视频、配音、音乐三条线的发布都在讲能力（时长、语言数、"电影级"），但镜像内没有一条给出按秒或按次的公开报价。翻译侧是唯一例外：它长出了体积口径（440MB）与语言数口径（70+/90+），因为翻译的价值可以直接由「能否在手机离线跑」判定。缺价格使本垂直无法像 [[行业应用/AI办公]] 那样做定价轨比较——这不是我没查到，而是本线索的素材层确实没有这一维，登记为缺口而非以「厂商未披露」一笔带过。
2. **「70+ 语言」在同一个月内被两家不同厂商各自报出，是本垂直唯一稳的交叉结构。** 但它交叉的是「前沿厂商都把这当作必报指标」这一事实，不是任何一方更强。ElevenLabs 报 90+ 却属另一家厂商、另一套任务（配音 vs 翻译输入覆盖），三个数字不可排序。把数字排序是这类发布最容易被误读的地方，本页刻意只并列不排名。
3. **网关层（Together 2025-10、OpenRouter 2026-04 与 2026-08）比模型发布更能说明「品类成立」。** 两家独立聚合商在不到一年内分别把视频生成纳入标准 SKU、写出代码优先的接入文档，这是需求侧信号；模型发布是供给侧信号。二者的时间差（供给侧论文 4-15 与 8-07 在前，网关文档在后）说明视频生成从「论文能力」到「可编程商品」的转化周期在数月量级。
4. **中国侧的主打口径是成本与体积，而不是质量。** 「成本砍半」（Seedance 2.0 Mini）、「效率提升 15 倍」（LongCat-Video-Avatar）、「440MB 离线」（Hy-MT）三例都是相对量，且分母全部未披露。这与欧美侧「电影级」「情感表演」的质量叙事形成分工：中国厂商在争单位成本，欧美厂商在争能否进专业工作流。⚠️ 两侧口径都不可核，但**口径本身的分工是可观察的**。
5. **制片位与工具位的分界线在 2026 年 6 月被两条动作同时触碰**：Google DeepMind 投资 A24（资本进入制片）、生数科技与华策影视共建创制中心（模型方进入内容方组织）。两条各自单源，合起来也只支撑「AI 厂商开始争取内容产业链的上游位置」这一个判断，不支撑任何收入或份额推论。这是本垂直最薄也最值钱的一条方向性线索，值得后续专门取证（见 `docs/AI与行业交叉评估.md` 的缺口登记）。
6. **劳动侧证据不足是当前最大的结构性缺陷。** 全部素材里只有一条字幕组/汉化组访谈，且是单一公众号的一次访谈。所有关于「AI 是否压缩本地化外包与字幕岗位」的判断在本页都属无证据推论。相反，雇主侧信号（京东、美团、蚂蚁等非内容公司进入内容模型研发）密度更高——但镜像把它们记在开源发布口径下，没有招聘或组织口径 ⚠️。因此本页明确不做的事：**不写就业冲击结论**。
7. **游戏内容被编码智能体重塑的程度被现有素材严重低估。** 2026-08-05（一次生成完整游戏）、2026-09-04（Codex 构建可发布游戏 + 移植 1993 年 Amiga 游戏）三条都指向同一件事：可玩内容的生产门槛已降到个人开发者一次会话的量级。但这三条全部来自开发者自述或聚合站转述，没有一个销售或留存数据。因此本页把它登记为**趋势存在**而非**产业已变**。

## 关联线索

- [[多模态大模型/视频生成竞赛]] — 供给侧模型竞赛主线索，本页只取其在内容产业内的采用与定价后果
- [[多模态大模型/Sora]] — 视频生成标志性产品
- [[语音与音频/ElevenLabs]] — 配音与音频本地化主玩家
- [[语音与音频/Suno]] — 音乐生成对标
- [[开源模型与生态/DeepSeek]] — 本页多个工具链与价格口径的相关方
- [[开源模型与生态/Qwen]] — 阿里侧内容模型与千问 App 承载
- [[开源模型与生态/MiniMax]] — 直播与音频内容侧
- [[开源模型与生态/智谱GLM]] — 中国侧多模态供给
- [[Agentic编码/ClaudeCode]] — 「一次生成可玩内容」的工具侧
- [[Agentic编码/Codex]] — 同上
- [[开发者工具/GitHubCopilot]] — 游戏内容生产样本所在渠道
- [[基础模型/Gemini]] — 翻译、Flow、NotebookLM 视频概览的共同来源
- [[基础模型/GPT系列]] — OpenAI 实时翻译与内容工具侧
- [[消费级AI应用/ChatGPT产品]] — 内容生产的大众入口
- [[消费级AI应用/Meta-AI]] — 社媒侧内容分发
- [[行业应用/AI与营销电商]] — 广告素材生成与内容本地化的直接下游
- [[行业应用/AI金融]] — 金融剧情游戏与内容化传播的交集
- [[行业应用/AlphaFold与AI科研]] — 同属「按科学/工艺口径评价生成质量」的一类
- [[评测与基准/ArtificialAnalysis指数]] — 生成类能力口径的第三方指数参照
- [[世界模型/WorldLabs]] — 视频生成向「世界状态一致」迁移的相邻判断
- [[具身智能/特斯拉Optimus]] — 物理 AI 与生成模型在评估口径上的共同难题（本条为对照，非同一线）
