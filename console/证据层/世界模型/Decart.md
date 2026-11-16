---
线索: Decart
主题: 世界模型
别名: [Decart, Oasis, Lucid, Lucy, Live Stream Diffusion, DOS, Decart AI]
状态: 活跃
创建: 2026-11-11
更新: 2026-11-11
关键角色: [Decart]
---

# Decart

> 以「AI 版 Minecraft」一夜爆红的实时生成公司：卖的不是参数规模而是「实时生成的单位成本」——优化栈 DOS 先赚钱、模型 Lucy/Oasis 后出名；估值两年四级跳（$21M seed → $32M @ $500M+ → $100M @ $3.1B → $300M @ 近 $40 亿），2026-06 把世界模型做成按秒计费的 API（Oasis 3，$0.02/秒）。

## 概述

**Decart**（2023-09 成立，官网 [decart.ai](https://decart.ai/) ✅）自称「The Live AI Lab」，现产品线三条 ✅ 官网口径：**DOS**（Decart Optimization Stack，跨 NVIDIA GPU / Google TPU / Amazon Trainium 的推理与训练优化栈）、**Lucy**（实时世界编辑模型，沉浸体验/直播电商）、**Oasis**（面向物理 AI 的交互世界模型）。基地旧金山 + 以色列 ⚠️ TechCrunch 口径。它与 WorldLabs、Genie 同处「生成式世界模型」阵营（LeCun 世界模型语境下的下游分支），差异点押在**实时 + API + 垂直整合成本**。

**创始人**：CEO Dean Leitersdorf——Technion 计算机科学本科 + 硕士 + 博士 5 年读完（与 IDF 兵役重叠），2024-12 报道时 26 岁 ✅ [TechCrunch 2024-12-19](https://techcrunch.com/2024/12/19/decart-adds-another-32m-at-a-500m-valuation/)；其 arXiv 履历（2022–2025）全部为分布式计算理论、无一涉生成模型 ✅ arXiv 作者检索——「优化优先」基因。联合创始人 Moshe Shalev：IDF 8200 部队近 14 年、搭建该部队 AI 运营 ✅ 同上；第三位联创当时未披露，官方 media kit（2026-11）列「Dean、Orian、Moshe」三人 ✅，结合 arXiv 履历推断为 Orian Leitersdorf（PIM/存内计算方向）⚠️ 推断口径。

**起点是 2024-10-31 三事同日** ✅：出 stealth、seed $21M（Sequoia 领投 + Zeev Ventures；Sequoia 合伙人 Shaun Maguire 发文 [Partnering with Decart](https://www.sequoiacap.com/article/partnering-with-decart-the-future-of-ai-generated-experiences/)）、上线 Oasis——首个可玩的实时生成开放世界（Minecraft 素材训练、H100 运行、针对 Etched Sohu 芯片优化、称未来 4K）✅ [TechCrunch](https://techcrunch.com/2024/10/31/decarts-ai-simulates-a-real-time-playable-version-of-minecraft/)。官网口径 72 小时 100 万用户、一周 500 万 ✅；媒体实测「分辨率低、转身即忘」✅ 同上；Minecraft 素材未经微软授权的版权灰区 ✅；同日另有「成立三个月即盈利」报道标题 ⚠️ 标题口径经官网转介。

**技术叙事是垂直整合而非模型架构**：stealth 期的第一个产品就是 GPU 优化软件，在发 seed 前已做到数百万美元收入 ✅ TechCrunch；之后 LSD/Live Stream Diffusion（2025-07，sub-100ms 视频到视频）→ Lucy 1.0（2025-09，最早落地场景是手术视频编辑）→ Lucy 2（2026-01，实时世界变形）→ Oasis 3（2026-06）✅ 官网沿革。性能主张全部公司口径未独立复核 ⚠️：DOS 2.0 agentic 推理 1600 TPS（对比行业 ~200）、全高清世界模型推理 100 FPS、Lucy 在 AWS Trainium 上 101 FPS、成本效率 100x、比同类快 8x；Oasis 3 发布稿提及「与 Oasis 1、2 同样的实时基础」但 Oasis 2 发布时点未核得 🔍。

**融资四级跳** ✅：$21M seed @ 刚过 $1 亿（2024-10-31）→ $32M A 轮 Benchmark 领投 @ 投后 $500M+（2024-12-19）→ $100M @ $3.1B（2025-08-07，Fortune 独家标题口径）→ $300M，Radical Ventures 领投（2026-05-18）：新进 NVIDIA、Atreides、Valor Equity、Adobe Ventures、Toyota Ventures、eBay Ventures，Sequoia/Benchmark/Zeev 回投，个人投资者含 Karpathy、Michael Eisner、任天堂家族 ✅ 官网通稿；TechCrunch 称该轮后估值近 $40 亿 ⚠️ 二手口径。Amazon 为战略客户，公司称 DOS 授权已向云厂商/AI lab/超大客户产生显著收入 ⚠️ 公司口径。

**竞争与反方记录**：世界模型赛道拥挤——TechCrunch 列举 Google Genie 3（研究预览）、World Labs Marble（商用）、Luma/Runway 转向物理感知视频 ✅ [2026-06-10](https://techcrunch.com/2026/06/10/decarts-new-world-model-can-simulate-hours-of-photorealistic-driving-with-some-caveats/)，另有 NVIDIA Cosmos 的工业仿真管线定位重叠。反方：实时逐帧生成的记忆/一致性问题两年未根除（Oasis「转身即忘」→ Oasis 3「with some caveats」）；公司性能数字无第三方基准；早期产品名 Lucid/lucid-sim 在现行官网（产品页/研究页/博客存目）已无痕迹、未核得一手发布稿 🔍；30–100 FPS 实时推理的 GPU 密度与成本是商业化天花板。

## 时间线

### 2026-11

- **2026-11-05** · [Lucy 2.6：面向 Live Commerce 与互动](https://decart.ai/publications/introducing-lucy-2-6) ✅
  角色/服装/商品保真度提升，实时生成进入直播电商场景——Lucy 线从手术视频（2025-09）到电商的三级跳。
  来源：Decart 官网博客 · 2026-11-05

### 2026-10

- **2026-10** · 技术报告《Learning a Spatial Memory Codec for Video World Models》 ✅
  视频世界模型的空间记忆压缩编码，近 2 小时存档按视图读取——正面回应实时生成的「记忆」短板。同期研究页挂 EMNLP 2026 论文（SRI Guard 越狱检测）与 SIGGRAPH 2026 论文（AdaOr 编辑强度滑杆）。
  来源：research.decart.ai · 2026-10

### 2026-07

- **2026-07-16** · [Lucy 2.5：Live AI 提到 30 FPS](https://decart.ai/publications/lucy-2-5-raising-the-bar-for-live-ai) ✅
  更高质量编辑、物理感知 VFX、更强时序一致性、更低延迟，实时 30 FPS。
  来源：Decart 官网博客 · 2026-07-16

### 2026-06

- **2026-06-10** · [Oasis 3：首个面向物理 AI 的交互式世界模型](https://decart.ai/publications/introducing-oasis-3-first-interactive-world-model-for-physical-ai) ✅
  API 第一天开放（自称首个）、自动驾驶先行、动作条件闭环、同步多相机输出、端到端 <200ms（[产品页](https://decart.ai/oasis)）；定价 $0.02/秒，10 万+ 开发者社区（多为 Lucy 电商/直播场景）⚠️ CEO 口径。TechCrunch 评「可模拟数小时照片级驾驶——但有保留意见」，并披露上轮融资后估值近 $40 亿 ⚠️；同文列竞争对手 Genie 3、Marble、Luma/Runway。
  来源：[官网发布稿](https://decart.ai/publications/introducing-oasis-3-first-interactive-world-model-for-physical-ai) + [TechCrunch](https://techcrunch.com/2026/06/10/decarts-new-world-model-can-simulate-hours-of-photorealistic-driving-with-some-caveats/) · 2026-06-10

### 2026-05

- **2026-05-18** · [$300M 融资 + DOS 2.0 发布](https://decart.ai/publications/decart-raises-300m-tech-leaders-back-the-company-as-both-customers-and-investors) ✅
  Radical Ventures 领投；NVIDIA、Atreides、Valor、Adobe Ventures、Toyota Ventures、eBay Ventures 新进，Sequoia/Benchmark/Zeev 回投；个人：Karpathy、Michael Eisner、任天堂家族；Amazon 为战略客户。DOS 2.0：1600 TPS agentic 推理（对比行业 ~200）、全高清世界模型推理至 100 FPS、跨 GPU/TPU/Trainium；官方称 100x 成本效率、快 8x ⚠️ 公司口径；同月 AWS 合作 ✅ 官网沿革。WSJ 同日报道「让换 AI 芯片变容易——NVIDIA 成新投资者」（标题口径 ⚠️）。
  来源：官网通稿 + WSJ · 2026-05-18

### 2026-01

- **2026-01-26** · [Lucy 2：SOTA 实时世界变形模型](https://decart.ai/publications/lucy-2-introducing-sota-video-generation-in-realtime) ✅
  高保真视频编辑从离线渲染转向实时交互：角色替换、商品植入、机器人仿真数据增广。研究页基准：Lucy 于 AWS Trainium 上 101 FPS ⚠️ 公司口径；Forbes 次日报道（标题口径 ⚠️）。
  来源：官网博客 + Forbes · 2026-01-26

### 2025-10

- **2025-10-22** · 与 ElevenLabs 合作「活的角色」 ✅
  Decart 实时视频 + ElevenLabs 语音：口型同步的实时数字人，直播/虚拟人方向合流。
  来源：[官网博客](https://decart.ai/publications/building-living-characters-with-decart-and-elevenlabs) · 2025-10-22

### 2025-09

- **2025-09** · Lucy 1.0：首个实时手术视频编辑 ✅（官网沿革口径）
  「first real-time surgical video editing with frame-by-frame control」——Lucy 的第一个商业场景是医疗视频而非娱乐，先收隐私敏感高价值订单再转向消费级。
  来源：decart.ai/about · 2025-09

### 2025-08

- **2025-08-07** · $100M 融资，估值 $3.1B ✅（标题口径）
  Fortune 独家标题「Decart raises $100 million at a $3.1 billion valuation — chasing the future of real-time creative AI」；正文未取得一手核验 🔍。
  来源：[Fortune](https://fortune.com/2025/08/07/exclusive-decart-raises-100-million-at-a-3-1-billion-valuation-chasing-the-future-of-real-time-creative-ai/)（标题经官网 newsroom 转介）· 2025-08-07

### 2025-07

- **2025-07** · LSD（Live Stream Diffusion）：亚 100ms 视频到视频 ✅（官网沿革口径）
  首个 live-stream diffusion 模型；外媒同期报道「This AI Warps Live Video in Real Time」（2025-07-17，标题经官网转介 ⚠️）。
  来源：decart.ai/about · 2025-07

### 2024-12

- **2024-12-19** · [$32M Series A，投后 $500M+](https://techcrunch.com/2024/12/19/decart-adds-another-32m-at-a-500m-valuation/) ✅
  Benchmark 领投、Sequoia/Zeev 跟投（seed 投后刚过 $1 亿）；Dean Leitersdorf Technion 本硕博 5 年、Shalev 出自 IDF 8200、第三联创未披露；GPU 优化软件已有数百万美元收入；CEO 放话造「kilocorn」。四天后 Haaretz 报道 Elon Musk 转发该初创（标题口径 ⚠️，所涉产品名未核得 🔍）。
  来源：TechCrunch + [Haaretz](https://www.haaretz.com/israel-news/2024-12-22/ty-article/.premium/wow-this-is-happening-fast-why-elon-musk-tweeted-about-game-changing-israeli-startup/00000193-edff-d17a-a193-fdfffac40000) · 2024-12-19/22

### 2024-10

- **2024-10-31** · Oasis「A Universe in a Transformer」+ $21M seed ✅
  出 stealth、融资、上线同日：首个可玩实时生成开放世界（[TechCrunch](https://techcrunch.com/2024/10/31/decarts-ai-simulates-a-real-time-playable-version-of-minecraft/)），72 小时 100 万用户、一周 500 万 ✅ 官网；H100 运行、针对 Etched Sohu 优化；低分辨率与「转身即忘」被实测记录；Minecraft 素材版权灰区；同日「三个月即盈利」报道标题 ⚠️。Oasis 用的还是「键盘鼠标条件化」，到 Oasis 3（2026-06）才换成机器人动作条件化。
  来源：TechCrunch + [Sequoia](https://www.sequoiacap.com/article/partnering-with-decart-the-future-of-ai-generated-experiences/) + Calcalist（标题）· 2024-10-31

## 分析

1. **垂直整合反转了「模型公司烧卡」剧本：先卖效率，后卖世界。** stealth 期 GPU 优化软件已入账数百万美元、「三个月盈利」口径在前，模型爆红在后——估值四级跳的支撑是 DOS 的单位成本优势（1600 TPS vs 行业 ~200、100 FPS 的公司口径）而非参数规模。这是与 WorldLabs（学术叙事融资）、Genie（前沿实验室自研）完全不同的资本结构。
2. **Oasis 是营销事件，Oasis 3 才是生意。** 2024-10 的 AI Minecraft 证明了注意力（1M/72h）也暴露了技术天花板（遗忘、低分辨率、版权灰区）；2026-06 的 Oasis 3 把同一叙事换算成自动驾驶/机器人训练数据 API（$0.02/秒、动作条件闭环、多相机同步）——「世界模型」第一次成为可编程、可计费的单位，对标 OpenAI 的开发者生态打法（CEO 口径 ⚠️）。
3. **物理 AI 是第二次跨界，且资本与竞争关系重叠。** NVIDIA 同时是 [[世界模型/NVIDIACosmos]] 的作者与 Decart 的股东；Genie 3 停在研究预览、Marble 走显式 3D，Decart 用「流式扩散 + 优化栈」抢 API 商用先手。能否把仿真训练数据卖给 AV/机器人厂（Toyota Ventures 的投资视角），是 2027 年验证「世界模型 vs 视频生成」定位之争的判据。
4. **创始人履历解释产品路线：这是系统优化基因的 AI lab，不是架构创新基因的。** Dean 的 Technion 分布式计算理论训练（arXiv 履历无一涉生成模型）+ Shalev 的 8200 运营背景 → 先做跨芯片优化栈（DOS 支持 GPU/TPU/Trainium，对冲单一芯片依赖），再让模型长在栈上。DOS 2.0 的「换芯片不变慢」定位与 WSJ 标题互证。
5. **反方记录要按证据强度分层。** 性能数字（100x/8x/101 FPS/1600 TPS）全部公司口径、无第三方基准 ⚠️；实时逐帧生成的记忆/一致性两年未根除（Oasis「转身即忘」→ Spatial Memory Codec 报告自证仍在补课 → Oasis 3「with caveats」）；早期产品名 Lucid/lucid-sim 从官网消失、Oasis 2 发布时点不可考 🔍——产品名高频更替（Lucid→LSD→Lucy）本身是叙事驱动而非产品驱动运营的信号。
6. **台内观察价值：它是「实时生成算力经济学」的关键样本。** 同一世界模型叙事下的三条路线对照——WorldLabs 押显式 3D（[[世界模型/WorldLabs]]）、Genie 押隐式视频（[[世界模型/Genie]]）、Decart 押优化栈 + 流式扩散；与 [[多模态大模型/视频生成竞赛]] 的离线路线（Sora/Veo）构成「实时 vs 离线」分叉，其 API 定价（$0.02/秒）与 DOS 外售收入是 [[世界模型/NVIDIACosmos]] 之外观察仿真数据市场定价的第二个锚点。

## 关联线索

- [[世界模型/Genie]] — TechCrunch 列名的直接对手：Genie 3 停在研究预览，Decart 用 API 商用抢先手
- [[世界模型/WorldLabs]] — Marble 商用化的显式 3D 路线对照；流式扩散 vs 高斯泼溅的路线分叉
- [[世界模型/NVIDIACosmos]] — 物理 AI 仿真训练数据的正面竞合；NVIDIA 双重身份（Cosmos 作者 / Decart 新股东）
- [[多模态大模型/视频生成竞赛]] — 实时（Lucy/Oasis）vs 离线（Sora/Veo）的生成范式分野
- [[具身智能/特斯拉Optimus]] — Oasis 3 所指的 AV/机器人仿真训练需求侧样本
