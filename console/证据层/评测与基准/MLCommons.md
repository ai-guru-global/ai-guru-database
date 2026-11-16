---
线索: MLCommons
主题: 评测与基准
别名: [MLCommons, MLPerf, MLPerf Training, MLPerf Inference, AILuminate, MLPerf Endpoints, Candela]
状态: 活跃
创建: 2026-11-11
更新: 2026-11-11
关键角色: [MLCommons]
---

# MLCommons

> AI 行业的「成绩单发行方」：2018 年 MLPerf 起于 Baidu/Google/哈佛/斯坦福/伯克利工程师的联合基准工程，2020-12-03 注册为非营利联盟 MLCommons；现有 125+ 会员与附属、10 个基准套件、累计 89.7k+ MLPerf 成绩（2026-11-12 官网抓取）。训练/推理一年各约两轮：最新成绩轮 Training v6.0（2026-06-16，24 家）、Inference v6.1（2026-09-16，30 家提交创纪录，DeepSeek R1 每加速器成绩较 v5.1 提升 5.7 倍）；closed/open 分区 + Available/Preview/RDI 可用性标注构成公信力机制；安全线 AILuminate 从 2024-12 v1.0 迭代到 2026-10 Safety 1.2.1 + Jailbreak 1.1；MLPerf 成绩已是 GPU 采购的事实口径，而新套件 Endpoints（2026-10 v1.0 开放提交）正把「跑分」推向「按出厂形态计价」。

## 概述

**MLCommons 是行业共办的 AI 工程联盟，自称使命「standardize AI measurement and enable informed decisions」** ✅ [官网](https://mlcommons.org/)（2026-11-12 抓取）。规模口径：125+ 会员与附属（startups、leading companies、academics、non-profits）、10 个基准套件（Training、Training HPC、Inference 的 Datacenter/Edge/Mobile/Tiny、Client、Automotive、Storage、Endpoints 等）、累计 89.7k+ MLPerf 成绩、70 万数据集采用 Croissant 元数据 ✅。组织形态「community-driven and community-funded」，向公司、学界、非营利、政府与个人按非歧视原则开放 ✅ [About](https://mlcommons.org/about/)。治理现值（2026-11-12 抓取）：Executive Director Rebecca Weiss、President Peter Mattson（官网表述「founded and is President」）、Founder 兼 Head of MLPerf David Kanter ✅ [Leadership](https://mlcommons.org/leadership/)；早期媒体口径中执行董事为 Kanter，交接时间本次未核 🔍。

**沿革有一手官方时间轴**（[About](https://mlcommons.org/about/) ✅）：2018-02 Baidu、Google、Harvard、Stanford、UC Berkeley 的工程师/研究者初次聚会 → 2018-05-02 MLPerf Training 套件发布 → 2018-12-05 MLPerf HPC 发布 → 2018-12-12 首批 MLPerf Training 成绩（Google、Intel、NVIDIA）→ 2019-06-24 MLPerf Inference 发布 → 2019-10-22 TinyML → **2020-12-03 MLCommons 正式成立** → 2023-11 AI Risk & Reliability 工作组。「MLPerf 起源于 Google/百度/斯坦福 2018 合作」的常见说法可证实但需补全：官方口径为五机构（含哈佛、伯克利）✅。

**MLPerf 套件节奏是「一年各约两轮」的固定赛程**。训练最新成绩轮 v6.0（2026-06-16 官宣 ✅）：24 家机构、95 套系统、13 种加速器、60% 多节点；新增 DeepSeek V3（671B 总参/37B 激活，套件内最大）与 GPT-OSS 20B 两条 MoE 负载，FP4 精度配方成规模出现、云端提交较 v5.1 翻倍 ✅ [发布稿](https://mlcommons.org/2026/06/mlperf-training-v6-0-results/)；基准定义已至 v6.1（新增 LLM 后训练负载 Qwen3.5-397B-A17B ✅ [Training 页](https://mlcommons.org/benchmarks/training/)），但 v6.1 成绩轮在 GitHub 尚无 results 仓库（2026-11-12 查）🔍。推理最新成绩轮 v6.1（2026-09-16 官宣）：**30 家机构提交创历史纪录**（Crusoe 等六家首秀）；新增端到端 RAG、Edge Agentic 推理与投机解码；NVIDIA Rubin / Vera Rubin NVL72 以 Preview 类别亮相；最大系统 512 加速器；DeepSeek R1 每加速器服务器成绩较 v5.1 提 **5.7 倍**、VLM 提 2.99 倍 ✅ [发布稿](https://mlcommons.org/2026/09/mlperf-inference-v6-1-results/)。

**公信力机制 = 分区 + 可用性标注 + 开源日志**。成绩分 Closed（同参考模型/同数据集的「apples-to-apples」）与 Open（允许自定义模型的创新分区）两轨，另设 Available（可购买）/ Preview（未出货）/ RDI（研发或内部用途）三级可用性标注 ✅ [Inference 规则页](https://mlcommons.org/benchmarks/inference/)；训练成绩以「训到质量目标的总墙钟时间」计，去掉最好最差后取均值（成像 ±2.5%、其他 ±5% 波动带）✅ [Training 页](https://mlcommons.org/benchmarks/training/)；每轮 results 仓库（提交日志与系统配置）在 GitHub 开源可复核 ✅ [inference_results_v6.1](https://github.com/mlcommons/inference_results_v6.1)。这套设计把「营销跑分」与「可比成绩」分开——但 Open 分区天然利于养得起提交工程的头部厂商，是结构性偏置 ⚠️ 分析推断。

**AI 安全线 AILuminate 是第二条产品线**：v1.0（2024-12-04）以 2.4 万+ 风险提示词、12 类危害场景给「广泛使用的 LLM」发安全评级，官方强调被测模型「看不到提示词、接触不到评审器」✅ [发布稿](https://mlcommons.org/2024/12/mlcommons-ailuminate-v1-0-release/)；v1.1（2025-02-10）增法语 ⚠️ 列表口径；2026 年迭代显著加速——Jailbreak v0.7（2026-02）、Assessment Standard v1.4（2026-05）、Safety v1.2（2026-09）、Safety 1.2.1 + Jailbreak 1.1 首批公开成绩（2026-10-29），方法论从 LLM-as-judge 换成专用确定性评审器，题库保密 + 预留官方题防记忆化，页列 87 家参与机构（OpenAI、Anthropic、Google/DeepMind、微软、Meta、NVIDIA 与 MIT/斯坦福/牛津等）✅ [AILuminate](https://mlcommons.org/ailuminate/)。2026-10-29 同日上线 Candela（「AI risk benchmarking-as-a-service」）⚠️ 列表口径 🔍 未读原文。

**会员与采购影响**：提交方结构覆盖芯片（NVIDIA、AMD、Intel、Qualcomm）、云（Google、Azure、Oracle、CoreWeave、Nebius、Lambda）、OEM/ODM（Dell、HPE、Supermicro、Fujitsu、广达、纬颖、英业达等）与学界/国家实验室 ✅ 各轮发布稿与 AILuminate 页。MLPerf 已是采购定价的事实口径：2026-10 官方专文把新套件 Endpoints 定位为「a practical procurement tool」，口径是「the system as sold, not the configuration as tuned」——直指传统跑分按「调优过的配置」计价、买家到手即缩水的问题，并给出四步采购法（定位并发区间 → 设 SLA → 比吞吐 → 按 provisioned power 归一）✅ [Endpoints 说明](https://mlcommons.org/2026/10/mlperf-endpoints-matters-to-buyers/)。2026-10-15 MLCommons 获选美国 NSF 支持 AI Efficiency Challenge 的基准团队（MLPerf Agents）✅ [新闻](https://mlcommons.org/2026/10/nsf-stride-ai-efficiency-challenge/) ⚠️ 未读原文。

**反方记录**：①过拟合与定制争议——Open 分区允许厂商用自改模型/自调实现冲榜；Closed 分区的精度门槛在 FP4 时代成为「精度换速度」的新灰区，官方文承认配方差异「被 spotlight」✅，但第三方批评文章本次未获一手抓取 🔍；②官方自认固定场景局限：v6.1 发布稿明确「>50% 提交者用了将取代 Inference 数据中心基准的新 API harness」✅——五年历史的 LoadGen 固定场景被自己换代，等于官方承认旧口径跟不上生产形态；③与 LMArena 的分工：MLPerf 管硬件/系统性能（客观负载），LMArena 管人类偏好（模型质量），两套榜单回答不同问题、不可互相替代。

## 时间线

### 2026-10

- **2026-10-29** · [AILuminate Safety 1.2.1 与 Jailbreak 1.1 首批公开成绩](https://mlcommons.org/2026/10/ailuminate-safety-1-2-1-and-jailbreak-1-1/) ✅
  Safety 1.2.1（确定性评审器、0-100 百分位评分）与 Jailbreak 1.1 组成首份公开安全成绩；方法论细节见 AILuminate 官页 ✅。
  来源：MLCommons Blog · 2026-10-29
- **2026-10-29** · Candela 上线：AI 风险基准即服务 ⚠️
  「benchmarking-as-a-service for developers and deployers」；基准产品服务化的商业化试探。
  来源：[MLCommons News](https://mlcommons.org/2026/10/introducing-candela/) · 2026-10-29 · 🔍 未读原文
- **2026-10-15** · 获选 NSF 支持 AI Efficiency Challenge 基准团队（MLPerf Agents）⚠️
  智能体基准进入国家级工程；同日官方发文解释 Endpoints 为何「对买家重要」✅ 已读。
  来源：[MLCommons News](https://mlcommons.org/2026/10/nsf-stride-ai-efficiency-challenge/) · 2026-10-15 · 🔍 未读原文

### 2026-09

- **2026-09-24** · MLPerf Training 首个 LLM 后训练基准 ⚠️
  官宣 LLM post-training 负载（Training 页现值 Qwen3.5-397B-A17B、R2E-Gym、pass@4 ✅）；训练基准定义升至 v6.1，成绩轮 GitHub 尚未发布（2026-11-12 查）🔍。
  来源：[MLCommons Blog](https://mlcommons.org/2026/09/mlperf-training-llm-post-training/) · 2026-09-24 · 🔍 未读原文

- **2026-09-16** · [MLPerf Inference v6.1 成绩：30 家提交创纪录](https://mlcommons.org/2026/09/mlperf-inference-v6-1-results/) ✅
  Crusoe 等 6 家首秀；新增端到端 RAG、Edge Agentic、投机解码；NVIDIA Rubin 以 Preview 亮相；最大系统 512 加速器；DeepSeek R1 每加速器成绩较 v5.1 ×5.7；>50% 提交用新 API harness（Endpoints 前身，将取代 Inference 数据中心基准）。
  来源：MLCommons News · 2026-09-16
### 2026-06

- **2026-06-16** · [MLPerf Training v6.0 成绩发布](https://mlcommons.org/2026/06/mlperf-training-v6-0-results/) ✅
  24 家、95 系统、13 加速器、60% 多节点；新增 DeepSeek V3（671B/37B 激活，套件最大）与 GPT-OSS 20B；云端提交较 v5.1 翻倍；FP4 多配方 + 精度门槛「spotlight on implementation differences」。
  来源：MLCommons News · 2026-06-16

### 2026-04

- **2026-04-01** · [MLPerf Inference v6.0 成绩发布](https://mlcommons.org/2026/04/mlperf-inference-v6-0-results/) ✅
  24 家；11 项数据中心测试中 5 项新增/更新：GPT-OSS 120B、DeepSeek R1 交互式、首个序列推荐 DLRMv3、首个文生视频；多节点提交 +30%、10+ 节点系统占 10%；最大系统 72 节点/288 加速器；LoadGen++ 上线。
  来源：MLCommons News · 2026-04-01

### 2025-07

- **2025-07-30** · MLPerf Client v1.0 发布 ⚠️
  AI PC/端侧 LLM 基准套件转正（v0.5 2024-12 → v0.6 2025-04 → v1.0）。
  来源：[MLCommons News](https://mlcommons.org/2025/07/mlperf-client-v1-0/) · 2025-07-30 · 🔍 未读原文

### 2024-12

- **2024-12-04** · [AILuminate v1.0 发布](https://mlcommons.org/2024/12/mlcommons-ailuminate-v1-0-release/) ✅
  首个行业共创 LLM 安全基准：2.4 万+ 提示词、12 类危害、英语；被测模型不可预知提示词与评审器；参与方 Stanford/Columbia/Google/Intel/NVIDIA/Meta/Microsoft/Qualcomm/AI Verify 基金会等；法语/中文/印地语列入 2025 早期计划。
  来源：MLCommons News · 2024-12-04

### 2020-12

- **2020-12-03** · MLCommons 正式成立 ✅
  以联盟实体承接 MLPerf 与后续套件（MLCube、People's Speech 等）；「社区驱动、社区资助、非歧视开放」。
  来源：[MLCommons About 沿革](https://mlcommons.org/about/) · 2020-12-03

### 2018

- **2018-05-02** · MLPerf Training 套件发布 ✅
  起点：2018-02 Baidu/Google/Harvard/Stanford/UC Berkeley 工程师聚会；2018-12-05 HPC 套件、2018-12-12 首批成绩（Google/Intel/NVIDIA）相继落地——「社区基准」先于组织两年半存在。
  来源：[MLCommons About 沿革](https://mlcommons.org/about/) · 2018

## 分析

1. **它不是「跑分网站」，是 AI 硬件定价的度量衡发行方。** 89.7k+ 累计成绩、一年四轮（训练×2 + 推理×2）✅ 的固定赛程 + 开源日志，使 MLPerf 成绩成为 GPU/加速器采购与发布传播的事实口径；2026-10 Endpoints 专文直接把基准语言写成采购四步法 ✅。基准组织的权力来自「买家需要可比数字、厂商需要可信背书」的双边网络效应——与 LMArena 靠社区投票、[[评测与基准/ArtificialAnalysis指数]] 靠聚合转述的机制完全不同。
2. **公信力机制的核心是「分区 + 可用性标注」，本质是给营销留边界。** Closed 分区锁参考模型换可比性，Open 分区放自定义实现换创新展示；Available/Preview/RDI 标注直接打击「未出货芯片冲榜」的经典操作 ✅。代价是结构性偏置：头部厂商养得起整套提交工程（软件栈、调参、复跑），小厂天然少出现在榜单上 ⚠️ 推断。FP4 时代「同门槛不同配方」再开新灰区，官方自己承认差异「被 spotlight」✅——精度门槛是护栏，不是等价保证。
3. **Inference → Endpoints 换代是官方自曝旧口径局限，也是 LLM 时代评测形态之争。** v6.1 发布稿写明新 API harness「将取代 Inference 数据中心基准」✅；Endpoints 论「system as sold, not configuration as tuned」✅——固定场景跑分高估「调优演示」、低估真实服务水平，在推理即服务的 2026 年这是定价权问题：按旧口径买卡可能买错。观察点：Endpoints 与 Inference 的双轨并行期与切换时间表 🔍。
4. **AILuminate 的两年五版是「攻防节奏」的物化，也是安全基准的方法论样本。** 2024-12 v1.0（静态危害提示词）→ 2026 年 Jailbreak 线 + 确定性评审器 + 题库保密/预留题 ✅：每项收紧都对应一类污染攻击（题库记忆化、迎合 LLM-as-judge）。这与 [[评测与基准/LMArena]] 的投票污染问题同源——凡影响采购与声誉的基准都会被攻击，防御成本是基准组织的新主营成本；Candela 把基准做成服务（2026-10）则是把防御成本转售的第一步 ⚠️。
5. **性能 + 安全双线，外加数据/存储/端点横向扩张，构成「AI 工程基础设施标准组织」的完整占位，但也摊薄战线。** 10 个套件（含 Storage v3.0、Client、Automotive、Endpoints）+ Croissant 数据元标准 ✅ + Candela 服务化 ⚠️——从性能到安全到数据治理全占位；反方是会员制非营利资源约束下多产品线的维护质量分化（如 AlgoPerf 声量远小于 MLPerf ⚠️ 观察口径 🔍 未单独核实）。
6. **台内观察价值：它是 [[推理与基础设施/AI芯片竞争]] 的地面实况数据源。** 每轮 submitters 名单 = 芯片/云/整机格局快照（v6.1 新增 Crusoe 首秀、NVIDIA Rubin 走 Preview 类别 ✅）；跟踪三件事：Rubin 从 Preview 转正的轮次时点、Endpoints 与 Inference 的切换节奏、AILuminate 中文版进度（v1.0 发布时列「early 2025」计划，实际落地 🔍 未核）。

## 关联线索

- [[评测与基准/LMArena]] — 分工对照：MLPerf 管硬件/系统性能口径，LMArena 管人类偏好口径
- [[评测与基准/ArtificialAnalysis指数]] — 分工对照：聚合型模型性价比指数 vs 联盟制硬件基准
- [[推理与基础设施/AI芯片竞争]] — 每轮 MLPerf submitters 名单是芯片格局的地面实况
