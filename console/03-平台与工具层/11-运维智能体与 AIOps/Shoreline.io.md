---
层: 03-平台与工具层
节点: 11-运维智能体与 AIOps
类型: 学习页
状态: 观察中
更新: 2026-11-11
证据: 证据层/开发者工具/Shoreline.io.md
---

# Shoreline.io

> 修复动作代码化的运维自动化公司（Shoreline Software Inc.，2019 年成立 ⚠️）：用 alarm（发现）— action（修复命令）— bot（绑成自动修复回路）加 Op 查询语言，把 SRE runbook 变成可复用的代码资产。融资累计 $57M，止于 2022-03 的 B 轮（Insight Partners 领投）；2024-06 Bloomberg 报道被 NVIDIA 以约 $100M 收购（双方未官宣）；到 2026 年，官网域名 301 至 nvidia.com、GitHub 组织消失、Terraform provider 归档、第三方档案标注「No longer operating」——「独立产品已随并购整体下线」是本卡工作结论，「观察中」状态由此而来（证据强度高于通常的观察级，但官宣缺失故不翻牌）。

## 是什么

**Shoreline**（Shoreline Software Inc.）是一家面向 SRE/CloudOps 的事件自动化公司：告警定义「何时有问题」，action 定义「用什么命令修」，bot 把两者绑成无人值守的自修复回路，配套 runbooks、notebooks、资源查询、文件分发与 **Op 查询语言**，可从 UI、CLI、notebooks 或 Terraform 驱动 ✅（API Evangelist 2026-03 建档的产品描述；provider 资源清单含 action/alarm/bot/notebook/runbook/dashboard/nvault_secret 等 15 类 ✅ GitHub API）。成立时间 2019 年为 SiliconAngle 2024-06 文章口径 ⚠️；注册地与总部城市未核 🔍。2021-07-27 出隐身模式，2022-02 在 AWS/Azure/GCP 三云 GA ⚠️。

**创始人 Anurag Gupta**（founder & CEO）✅：TechCrunch 称其「在 AWS 负责基础设施八年」，职责是保障 AWS 自身的事件响应体系、并在内部做过自动化工具 ⚠️；SiliconAngle 称其为「前 AWS 数据库与分析服务工程师」⚠️。简报所提 **DynamoDB 背景：所有已核来源均未点名，不采信也不证伪** 🔍——两条二手口径与 DynamoDB 相容，但缺一手履历（LinkedIn 不可达）。2022-12 曾上 theCUBE 谈 DevOps ⚠️ 该段落为 Shoreline 赞助内容。

**产品主张是「把修复动作从 runbook 文档变成代码资产」**：TechCrunch 的转述是「Jupyter 风格的 notebook 记录并自动化常见故障的响应步骤」⚠️；Gupta 2021 年给差异化定位是「实时、全舰队的交互式调试与修复，资源、指标与 Linux 命令一体」，对标 PagerDuty/StackPulse ⚠️；2022-12 自述核心架构为并行分布式实时调试——「在一台主机上跑与在 30,000 台上跑是同一时刻」⚠️ 赞助访谈口径。简报所称产品名 **「Flare」在全部可核来源（502 个 Op Pack 仓库、provider 文档、全部新闻源）中零命中 🔍**，不排除与 Cloudflare 或他司工具混淆，登记为证据缺口。

**融资史（公司口径总额 $57M）**：B 轮 $35M、Insight Partners 领投、Dawn Capital 跟投（2022-03-28 ✅ TechCrunch）；文中回溯 A 轮 $22M、领投方未点名 ⚠️；Tracxn 口径投资方为 Insight、NTT Venture Capital、Dawn 三家 ⚠️ 二手转引。**简报所提「红杉领投种子/A 轮」：在全部已核来源中零命中，按证伪记录** 🔍（种子轮金额/领投方彻底未核；$22M+$35M=$57M 恰好对平，「三轮」与公开两轮的口径差可能意味着存在未披露种子轮 🔍）。

**客户与 ARR 是本卡最大的数据缺口**：从未有客户数、客户名单、收入或 ARR 的披露 🔍。用户侧唯一可引的故事来自 Incident Insights（2022-12 免费工具，只读 API key 接入 PagerDuty、无监督 ML 聚类事故工单）的 beta 客户自述：以为每周约 100 张工单，实测上周 2,100 张、多为误报 ⚠️ 赞助内容口径——既是「告警治理价值」的证明，也是样本性质的单例。2022-03 时员工近 50 人 ⚠️，此后无人数披露。

**现状：四条独立证据链指向「已交割、产品面整体拆除」**。① www.shoreline.io 以 301 重定向至 nvidia.com/en-us/（nginx，2026-11-12 curl 实测 ✅）；② shoreline-io GitHub 组织返回 404 ✅；③ Terraform provider 仓库迁移至 **NVIDIA** 组织名下并归档（NVIDIA/terraform-provider-shoreline，pushed 2026-08-05 ✅）；④ API Evangelist 2026-03-27 建档标注「No longer operating」，记载 NVIDIA 于 2024-07 收购、shoreline.io 与 docs.shoreline.io 不再解析 ✅。Bloomberg 2024-06-18 的报道（约 $100M、双方均未确认 ⚠️ SiliconAngle 转述）是唯一的时点一手转述源；NVIDIA 从未官宣 🔍。

**反方观点**：① 修复代码库冷启动难是品类固有问题——官方在 2023-08~11 机器式批量生成约 494 个 Terraform Op Pack 仓库（单日最多 122 个建仓）✅ GitHub 时间戳，用「官方预制内容海」对冲冷启动，侧面说明客户自写 Op 的生态从未起飞（推断 ⚠️）；② 与可观测/事件平台的原生自动化高度重叠——产品起点挂在 PagerDuty 数据上 ⚠️，Datadog/PagerDuty AIOps 类原生功能可覆盖大部分场景；③ $100M 卖价对 $57M 融资：回报倍数平庸，这是技术吸收（tuck-in）而非财务退出，品类独立长大的故事到此为止；④ 收购后产品整体下线而非独立运营，客户资产与 Op 代码库的下落未核 🔍。

## 怎么看

1. **品类卡位：修复代码化层，三不靠。** alarm/action/bot 不是 RPA（无 UI 操作层）、不是 IaC（编排期望态置备而非故障修复）、在 2024 年前也还不是 agentic remediation（修复动作是人写好的代码，LLM 只出现在事后分析的 Incident Insights）。它是 SRE runbook 的代码资产层——一个真实但狭窄的缝隙，2024 年后 LLM Agent 崛起，「修复动作」品类被 agentic remediation 重新定义，Shoreline 没等到这班船。
2. **NVIDIA 收购逻辑里最硬的证据是产品侧的：GPU 调试 Op Pack。** 2023-08 首批 ai/gpu 调试包与通用包同批建仓 ✅，随后四个月铺满 494 个模板仓库——GPU 集群规模化后的故障修复自动化正好卡进 NVIDIA「卖集群 + 卖软件栈」叙事。$100M 对 $57M 融资的回报倍数说明这是 tuck-in 式技术吸收，不是品类的财务胜利。
3. **冷启动难题的反方验证就写在仓库时间戳里。** 官方机器式批量生成 Op Pack（2023-08 单日 122 建仓）是对「客户不愿从零写修复代码」的platform-side对冲；生态若健康，不需要官方内容海。修复代码库的维护成本与内容护城河同体量增长，这是该品类所有后来者（含 agentic 方案）都要回答的题。
4. **与可观测平台原生功能的重叠是结构性风险。** 产品起点挂在 PagerDuty 数据上（Incident Insights）⚠️，对标名单里 PagerDuty/StackPulse 在前 ⚠️——AIOps 平台把「检测→修复」闭环原生化的每一步都在压缩独立修复层的定价空间；独立公司要么被吸收（本案），要么下沉成平台功能。
5. **「深度吸收」的整合模式样本：域名 301、组织消失、provider 归档、文档下线。** 对照 Run:ai（并入后保留产品线运营），NVIDIA 对 $100M 级 tuck-in 选择了整体拆除——对台内判断「被大厂收购的小工具公司还活着吗」提供参照：**看域名解析与 GitHub 组织，不看新闻稿**。
6. **证据结构本身值得登记：一手源随产品下线而消失。** 官网/文档/博客全下线，现存一手工件仅 502 个 Op Pack 仓库 + 归档 provider；补证最短路径为 Wayback 官网快照（本会话网络不可达 archive.org）、Bloomberg 原文、创始人 LinkedIn 履历（可核 DynamoDB 与总部地）。

## 关键锚点

- **2026-11-12** · 台内核查：域名与 GitHub 双通道实测 ✅
- **2026-03-27** · API Evangelist 建档：标注「No longer operating」 ✅
- **2024-06-18** · Bloomberg 报道 NVIDIA 收购 Shoreline，估值约 $100M ⚠️
- **2024-03-27** · Op Pack 仓库创建与推送冻结 ✅

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/开发者工具/Shoreline.io.md)
- [商业与投融资/AI人才与并购潮](../../../证据层/商业与投融资/AI人才与并购潮.md)
- [智能体平台/Agent框架](../../../证据层/智能体平台/Agent框架.md)
- [Agentic编码/Devin](../../../证据层/Agentic编码/Devin.md)
