---
线索: Together AI
主题: 推理与基础设施
别名: [Together AI, Together Computer, Together Compute]
状态: 活跃
创建: 2026-11-11
更新: 2026-11-11
关键角色: [Together AI]
---

# Together AI

> 开源模型的「AI Native Cloud」：自己不训 frontier 模型，把 FlashAttention 学术血统做成推理溢价层——2026-07 Series C 8 亿美元、估值 83 亿（Aramco Ventures 领投），年化 bookings 超 11.5 亿美元，每月向 100 万+ 开发者服务数百万亿 token。

## 概述

**Together AI**（2022 年成立，官网 [together.ai](https://www.together.ai/) ✅）定位「The AI Native Cloud」：开源模型微调 + 推理一体化平台 ✅ 官网产品口径。学术出身是第一标签：联合创始人 Tri Dao 是 FlashAttention（NeurIPS 2022）与 Mamba（COLM 2024）作者、斯坦福计算机博士、普林斯顿助理教授，现任公司首席科学家 ✅ [个人主页](https://tridao.me/)；创始团队其余成员（CEO 与 Percy Liang、Ce Zhang、Chris Ré 等斯坦福/学界系背景）⚠️ 记忆口径，本轮未获一手页面核实 🔍。GitHub org 仍名 togethercomputer ✅ RedPajama 仓库口径，早期以分散式训练研究社区起家 ⚠️。

**产品矩阵是推理分层的标准三级火箭** ✅ [官网产品页](https://www.together.ai/products)：serverless 推理（按 token 计费免运维）、batch 推理（单模型可扩至 300 亿 token）、dedicated 端点（独占基础设施）、dedicated container（视频/音频/图像生成负载）、GPU 集群（自助单机到数千卡、按需 B200）、代码 Sandbox、零出口费托管存储，外加微调服务；2026-10 又把企业级后训练（Together Post-Training）独立成产品线 ⚠️ 索引口径。产品逻辑：让开发者从 serverless 试验平滑升级到专属容量与裸金属集群，一条 OpenAI 兼容 API 贯穿 ✅。

**系统研究是它对「托管无护城河」的正面回答**：FlashAttention-4（2026-03-05 发布，B200 上 1605 TFLOPs/s、71% 利用率，前向比 cuDNN 9.13 快最高 1.3 倍）✅ [官方博客](https://www.together.ai/blog/flashattention-4)；ThunderKittens 内核家族；2026-11-04 发布 Together Compiler（TKCC）——用 agent 对推理引擎做「持续编译」，引擎热加载把启动从 467 秒压到 9 秒、实验吞吐 252 倍，在 Kimi K3/GLM 5.3/DeepSeek v4.1-Flash 等前沿开源模型上最高 2.6 倍 TPS，拿下 SemiAnalysis InferenceMAX 低延迟基准 SOTA（MiniMax M3.1-Flash 1111 TPS / DeepSeek v4.1-Flash 1205 TPS）✅ [同帖](https://www.together.ai/blog/together-compiler-continual-compilation-for-ai-inference)，自称「今日已服务数万亿 token」。

**融资轨迹两年跳了两个数量级**：2023 年 Series A 1.025 亿美元（Kleiner Perkins 领投，NVIDIA、Emergence Capital 参投）✅；2025 年初（2025-02 口径 ⚠️ 具体日未核）Series B 3.05 亿美元、估值 33 亿（Salesforce Ventures 领投，转引 Reuters）✅；2026-07-01 Series C 8 亿美元、估值 83 亿（Aramco Ventures 领投，NVIDIA、Vista、General Catalyst、Emergence、March Capital、Pegatron、SentinelOne S Ventures 等参投）✅ [TechCrunch](https://techcrunch.com/2026/07/01/neocloud-together-ai-raises-800m-leaps-to-8-3b-valuation/)。种子轮细节与 2024 年中流传的 1.5 亿美元/$12.5 亿估值口径本轮未获一手核实 🔍；估值最新锚点 = 2026-07 的 83 亿美元。

**规模与客户是最硬也最不完整的部分**：官方口径 8000+ 付费客户（Cursor、Cognition、Decagon、ElevenLabs 被点名）✅ [YC 集群帖](https://www.together.ai/blog/together-yc-gpu-cluster)；年化 bookings 超 11.5 亿美元（截至 2026-07 前一季度）✅ TechCrunch 转述公司口径；每月向 100 万+ 开发者服务数百万亿 token ✅ [IBM Cloud 合作帖](https://www.together.ai/blog/expanding-our-enterprise-inference-capacity-with-ibm-cloud-and-nvidia)（2026-10-06，与 IBM/NVIDIA 在 IBM Cloud 上共建 B300 专属推理集群，Together 为首个客户）。但 GAAP 收入、毛利率、bookings 与确认收入的缺口均未披露 🔍。

**分发卡位是第二重身位**：新开源模型 day-0 上线成为常态——Thinking Machines Lab 的 Inkling（975B 总参/40B 激活 MoE、100 万上下文、三模态输入）2026-07-15 发布当日即在其 serverless 平台可调用，Together 为其自定义注意力方案配了 FA4 定制内核 ✅；2026-07-20 与 Y Combinator 共建 YC 社区首个专属 GPU 集群（无长期合约、分钟级开机、宣称「当前满载」）✅；Meta Muse Spark Open、Kimi K3、GLM 5.3、DeepSeek V4 系的 day-0 与成本对比评测持续滚动 ⚠️ 官网博客索引口径。它不拥有任何模型权重，卖的是「最新开源权重 → 生产流量」的转化速度与工程折扣。

## 时间线

### 2026-11

- **2026-11-04** · [Together Compiler：面向推理的持续编译（TKCC）](https://www.together.ai/blog/together-compiler-continual-compilation-for-ai-inference) ✅
  agent 驱动的引擎重编译循环：热加载启动 467s → 9s、实验吞吐 252 倍；前沿开源模型最高 2.6 倍 TPS、InferenceMAX SOTA 1111/1205 TPS；同期发布 Polymorphic Inference ⚠️ 索引口径。
  来源：Together AI 官方博客 · 2026-11-04

### 2026-10

- **2026-10-27** · GPU 集群「自动修复」：故障 GPU 自动替换至健康节点 ⚠️ 官网博客索引标题口径 🔍
- **2026-10-19** · Together Post-Training 发布：企业级后训练/模型塑形产品线 ⚠️ 官网博客索引标题口径 🔍
- **2026-10-15** · Meta Muse Spark Open 在其平台上线 ⚠️ 官网博客索引标题口径 🔍
- **2026-10-06** · [与 IBM Cloud、NVIDIA 共建企业推理容量：B300 专属集群](https://www.together.ai/blog/expanding-our-enterprise-inference-capacity-with-ibm-cloud-and-nvidia) ✅
  「IBM Cloud 上首个此类大规模专属推理集群」，Together 为首个客户，Spectrum-X 以太网互联；官方口径「每月向 100 万+ 开发者服务数百万亿 token」「token 需求即将走向抛物线」。
  来源：Together AI 官方博客 · 2026-10-06

### 2026-07

- **2026-07-20** · [与 Y Combinator 共建 YC 社区首个专属 GPU 集群](https://www.together.ai/blog/together-yc-gpu-cluster) ✅
  无长期合约享长期费率、分钟级开机；同帖披露 8000+ 客户（Cursor/Decagon/Cognition/ElevenLabs）。
  来源：Together AI 官方博客 · 2026-07-20
- **2026-07-15** · [Thinking Machines Lab 新模型 Inkling day-0 上线](https://www.together.ai/blog/together-ai-brings-thinking-machines-labs-new-model-inkling-on-day-0) ✅
  975B/40B 激活 MoE、100 万上下文、文本+图像+音频输入；FA4 内核适配其自定义注意力，serverless 单端点全模态、按推理深度计费。
  来源：Together AI 官方博客 · 2026-07-15
- **2026-07-01** · [Series C：8 亿美元、估值 83 亿，Aramco Ventures 领投](https://techcrunch.com/2026/07/01/neocloud-together-ai-raises-800m-leaps-to-8-3b-valuation/) ✅
  NVIDIA/Vista/General Catalyst/Emergence/March Capital/Pegatron/SentinelOne S Ventures 参投；年化 bookings 超 11.5 亿；2026-03 The Information 曾报其洽谈 10 亿/$75 亿——最终「少拿钱、高估值」；同稿引 OpenRouter 研究称开源模型用量一年增长两倍。
  来源：TechCrunch · 2026-07-01

### 2026-06

- **2026-06-17** · [Kimi K2.7 Code vs Claude Fable 5：成本差 94%](https://www.together.ai/blog/kimi-k2-7-code-vs-claude-fable-5) ✅
  12 个落地页实测：Kimi 约为 Fable 5 的 1/16 成本、比 Opus 4.8 便宜约 8 倍，质量差距仅个位数分——开源「准平价替代」的厂商一手证据，也反向标注了闭源 API 若降价能压薄托管价差的空间。
  来源：Together AI 官方博客 · 2026-06-17

### 2026-03

- **2026-03-05** · [FlashAttention-4 发布](https://www.together.ai/blog/flashattention-4) ✅
  Tri Dao（普林斯顿/Together）与 Ted Zadouri 领衔；B200 BF16 最高 1605 TFLOPs/s（71% 利用率），前向比 cuDNN 9.13 快 1.1–1.3 倍、比 Triton 快 2.1–2.7 倍；部分技术已并入 cuDNN 9.13/9.14+。
  来源：Together AI 官方博客 · 2026-03-05

### 2025

- **2025-02** · Series B：3.05 亿美元、估值 33 亿，Salesforce Ventures 领投 ✅
  TechCrunch Series C 报道回溯口径（转引 Reuters）；约 16 个月后估值升至 83 亿。一手新闻稿本轮未获 🔍。
  来源：TechCrunch（回溯）/ Reuters（原报）· 2025-02

### 2023

- **2023-10-30** · [RedPajama-Data-v2：30 万亿去重 token 开源](https://www.together.ai/blog/redpajama-data-v2) ✅
  84 个 CommonCrawl dump、1000 亿+ 文档、5 种语言、40+ 预计算质量标注，自称「已发布的最大 LLM 训练公开数据集」；RedPajama-1T（2023-03，1 万亿英文 token）累计下载 19 万+ 次。开源数据 + 开源内核 + 开源研究构成其社区获客漏斗。
  来源：Together AI 官方博客 · 2023-10-30
- **2023** · Series A：1.025 亿美元，Kleiner Perkins 领投 ✅
  NVIDIA 与 Emergence Capital 参投（TechCrunch Series C 报道回溯口径）。
  来源：TechCrunch（回溯）· 2023

### 2022

- **2022** · 公司成立；FlashAttention 论文（NeurIPS 2022）发表 ✅
  Tri Dao 个人主页确认其为联合创始人兼首席科学家；TechCrunch/YC 帖「成立四年」（2026-07 口径）与 2022 年一致。
  来源：[tridao.me](https://tridao.me/) · TechCrunch · 2022

## 分析

1. **商业模式 =「系统研究 → 推理溢价」的学术产业化。** FlashAttention 系列、ThunderKittens、TKCC 持续编译构成自研私有引擎栈，把学术声誉直接折现成基准 SOTA 与 2.6 倍吞吐的商务话术。与 vLLM/SGLang 的中立社区路线（见 [[推理与基础设施/vLLM与推理引擎]]）不同：Together 的引擎是私有的、周边是开源的——RedPajama 数据、FA4 内核、DeepSWE 等研究都是获客漏斗，不是中立公共品。
2. **开源模型的「卖水人」结构决定天花板与地板。** 它不训 frontier 模型，卖的是最新开源权重到生产流量的转化速度（Inkling day-0 ✅、40+ 生产级模型目录 ✅ Inkling 帖口径），点名客户（Cursor/Cognition/Decagon/ElevenLabs）全是 Agent/编码/语音应用层。开源质量逼近闭源 + 约 16 倍成本差（K2.7 实测 ✅）是流量红利；但托管没有独占权重，任何云都能挂同一模型，护城河只剩引擎效率与价格——SemiAnalysis 基准排名的持续性是核心观察指标。
3. **反方观点按结构建模，不按情绪处理。** 挤压来自两头：上游 frontier 实验室 API 持续降价 + 发开放权重模型，稀释「托管开源更便宜」的第一性卖点；模型厂商自营端点（DeepSeek/GLM/Kimi 官方 API）以出厂价参与同模型竞争。开源托管商的应对只有规模与工程执行力。本卡未采集到 2025–2026 年上游降价的一手价格序列 🔍，此判断目前是结构性推理而非实证。
4. **融资读法：估值两年 2.5 倍（33 亿 → 83 亿），但「少拿钱」本身是信号。** The Information 口径的 10 亿/$75 亿谈判最终落成 8 亿/$83 亿——估值上去、稀释下来；Aramco Ventures 领投把主权资本接进股东名单（对照 [[推理与基础设施/主权AI]] 的中东坐标）。NVIDIA 连续参投（Series A/C）+ FA4 深度绑定 B200/B300，是英伟达生态「软件陈列室」的又一员——与 [[推理与基础设施/CoreWeave]] 的硬件版绑定互为镜像。
5. **最大证据风险：bookings ≠ 收入。** 11.5 亿美元年化 bookings 是合同口径，GAAP 收入、毛利率、确认节奏全部未披露 🔍；推理托管是重资本生意（B300 集群、IBM Cloud 容量扩张），8 亿美元融资去向（自建 vs 租赁）未明 🔍。CoreWeave 用 SEC 文件撑起的「订单簿信用」分析框架，在私营的 Together 这里只能拿到一半数据。
6. **台内观察价值：开源模型经济学的枢纽节点。** 同时连接模型层（[[开源模型与生态/DeepSeek]]、[[开源模型与生态/Kimi]]、[[开源模型与生态/ThinkingMachines]] 的 day-0 分发）、引擎层（[[推理与基础设施/vLLM与推理引擎]] 的路线对手）与资本层（[[推理与基础设施/CoreWeave]] 的 neocloud 对照——Together 是软件密度高的轻资产版）。跟踪四个硬指标：InferenceMAX 排名、bookings→收入转化、毛利率、模型厂商自营 API 的价差。

## 关联线索

- [[推理与基础设施/vLLM与推理引擎]] — 自研私有引擎（FA4/TKCC）vs 中立开源引擎（vLLM/SGLang）的路线对照
- [[推理与基础设施/CoreWeave]] — 同为 AI 云的两极：重资产杠杆 vs 软件密度溢价
- [[推理与基础设施/主权AI]] — Aramco Ventures 领投 Series C：主权资本进场开源模型云
- [[开源模型与生态/DeepSeek]] — DeepSeek V4/v4.1-Flash 是其 Compiler 基准与 day-0 评测常客
- [[开源模型与生态/Kimi]] — Kimi K3/K2.7 Code 是其基准评测与成本对比的主角
- [[开源模型与生态/ThinkingMachines]] — Inkling day-0 上线：新锐实验室 × 托管云的发行组合
