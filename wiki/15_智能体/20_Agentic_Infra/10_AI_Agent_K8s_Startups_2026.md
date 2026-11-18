---
title: AI Infra / Agent Infra / K8s 赛道创业公司拆解 2026
category: -agents
tags: ["ai-infra", "agent-infrastructure", "kubernetes", "startups", "融资", "2026"]
summary: "三条基础设施赛道的创业资本对照：AI Infra 单笔十亿美元级军备赛（Fireworks/Baseten/Together/Modal）、Agent Infra 成长期（LangChain 30 亿美元 @C 轮）、K8s 成熟期退出靠并购（Isovalent→Cisco、Run:ai→NVIDIA）；附 NVIDIA 三层战投标的完整清单与模型层融资估值清单（OpenAI 1.25 万亿融前、Anthropic 9,650 亿 H 轮/650 亿 ARR、中国 IPO 潮 PS 阶梯）。"
created: 2026-11-17
updated: 2026-11-17
tier: core
aliases: [Infra 创业公司, AI Infra 融资, K8s 创业]
sources:
  - DefiLlama Pre-IPO (Fireworks AI)
  - 36氪《无问芯穹 C 轮》
  - TechCrunch (LangChain C 轮)
review_by: 2027-02-17
name_zh: "Infra赛道创业拆解"
---

# AI Infra / Agent Infra / K8s 赛道创业公司拆解 2026

> 中文简称：Infra赛道创业拆解

> **一句话理解**: 同样叫「基础设施」，三条赛道处在三个生命周期——AI Infra 是单笔十亿美元级的军备竞赛，Agent Infra 是刚被验证的成长期（LangChain 一年估值翻倍到 30 亿美元），K8s 则是成熟到「赢家靠并购退出」的旧战场。

---

## 0. 三赛道总对照

| 维度 | AI Infra（推理/Token 工厂） | Agent Infra（开发运行栈） | K8s/云原生 |
|------|------------------------------|----------------------------|-------------|
| 生命周期 | 爆发期 | 成长期 | 成熟期 |
| 单轮量级 | 十亿美元级（Fireworks D 轮 15 亿） | 亿美元级（LangChain C 轮 3 亿） | 千万美元级或被并购 |
| 2026 标志事件 | NVIDIA 战投三家推理公司 | LangChain 估值一年翻倍至 30 亿 | 思科买 Isovalent、NVIDIA 买 Run:ai |
| 主要退出 | IPO 排队（Fireworks 传 pre-IPO） | 尚未到退出期 | **并购是唯一现实出口** |
| 中国对照 | 无问芯穹累计 43 亿元、筹备 IPO | Dify Pre-A 3,000 万美元 | 无头部独立标的 |

**直觉**：**直觉**——钱的密度排序 AI Infra > Agent Infra > K8s，成熟度排序恰好相反；创业机会正从「K8s 之上的一切」迁移到「Token 生产效率」和「Agent 生产运行」两极。

---

## 1. AI Infra：Token 工厂的军备竞赛

### 1.1 海外头部（估值/收入口径，2026-11-16 老虎财经全景 + 各轮次披露）

| 公司 | 最新融资（时点） | 估值 | 收入口径 |
|------|------------------|------|----------|
| **Fireworks AI** | D 轮 15.05 亿美元 @175 亿（2026-07-16）；10 月传新轮拟按 300–400 亿洽谈（2026-10-21，早期谈判） | DefiLlama pre-IPO 估 385 亿（2026-11-14） | 约 10 亿美元 |
| **Baseten** | E 轮 50 亿（2026-02，NVIDIA 投约 1.5 亿）→ F 轮 130 亿（2026-06） | 2026-11 全景口径 300 亿（与 6 月口径冲突，**以最新披露为准**） | 约 6 亿美元，一年收入增长 20 倍 |
| **Together AI** | 8 亿美元 @83 亿（2026-07） | 83 亿 | — |
| **Modal** | D 轮 7.5 亿美元 @157.5 亿（2026-10-14，Accel 领投） | 较 5 月 C 轮 46.5 亿翻 3 倍+ | ARR 破 10 亿美元，Sandboxes 单品近 3 亿 |
| **fal** | — | 160 亿（2026-11 口径） | 约 8 亿美元（偏图像/视频推理） |

三家（Fireworks/Baseten/Together）**均获 NVIDIA 战投**——芯片巨头把推理层当作释放硬件价值的杠杆（36氪，2026-10-12）。

### 1.2 中国梯队与新玩家

- **无问芯穹**：C 轮 23 亿元（2026-10 完成交割，清华电子系背景），累计 43 亿元——**国内最大 AI Infra 融资**，正筹备 IPO（36氪，2026-10-12）
- **vLLM 团队官宣创业**：融资 1.5 亿美元，清华特奖游凯超任联创（2026-01 社区资讯）
- **RadixArk**（SGLang 团队拆分）：估值 4 亿美元（2026-01）；**Tensormesh**（华人创立）种子 450 万美元
- 估值差的含义：海外独立 AI Infra 已先行定价（175 亿/130 亿/83 亿），国产 Token 工厂折价既说明赛道更早，也留出效率验证后的成长空间（知乎/36氪口径，2026-10）

**风险点**：Fireworks 于 2026-10-09 披露安全事件（内部凭证入侵、少量客户 API 密钥泄露，模型与数据称未被访问）——新轮融资洽谈紧随其后，客户信任成为变量。

---

## 2. Agent Infra：从「连接协议」到「全生命周期管理」

### 2.1 标志交易：LangChain C 轮

| 项 | 数据（时点） |
|----|--------------|
| 融资 | 3 亿美元 C 轮，估值 30 亿美元——**一年翻倍**（2026-11-13 TechCrunch 口径） |
| 客户 | LangSmith 约 7,000 家企业客户：Harvey、Rippling、Clay + 英伟达、丰田、Salesforce（公司披露，2026-11-16） |
| 产品重心 | Agent Runtime（运行）+ Observability/Evaluation（观测评估）+ Engine（自动修复）+ Fine-Tuning（轨迹转训练数据）+ LLM/Tool Gateway（治理） |

**直觉**：**直觉**——LangChain 从「提示词编排库」长成「Agent 的 Datadog」，融资逻辑是企业把 Agent 投产后，**观测、评估、治理**取代「怎么连起来」成为付费点。

### 2.2 格局要点

- **玩家密度**：CB Insights 已映射 135+ 家 agentic infra 公司，一年内赛道从 300 家公司膨胀到数千家（LinkedIn 转引 CB Insights，2026-10-30）
- **资金分布**：Voice AI 2025 年内融资近 4 亿美元；Agent 安全快速升温（Okta/Palo Alto 将 Agent 安全嵌入平台）；支付基础设施仍早期
- **标准收敛**：MCP（Anthropic，工具/数据）+ A2A（Google，Agent 协作）+ ACP（IBM，Agent 通信）成为生态基线
- **风向切换**（Madrona IA40 2026 榜单）：12 家 infra 上榜中 **5 家集中在推理与路由**（Baseten、OpenRouter、Fireworks、Together、fal），去年的编排/评估代表（CrewAI、Haize Labs）掉出——**Agent 真跑起来后，成本、调度、运行问题被推到台前**
- 其他资本信号：**n8n** 获 SAP 投资逾 6,000 万欧元 @52 亿、ARR 约 1 亿美元（2026Q3 口径）；新公司 **Mintive** 获 Cowboy/Coatue 及 Jeff Dean、Karpathy 个人投资（2026-11 报道）

---

## 3. K8s：成熟赛道，退出只有并购一条路

### 3.1 并购时间线（赛道的「收成期」证据）

| 事件 | 时点 | 备注 |
|------|------|------|
| Red Hat 收购 CoreOS | 2018-01 | 2.5 亿美元，K8s 早期经典退出 |
| 思科收购 Isovalent（Cilium 母公司） | 2023-12 宣布、2024 财年 Q3 完成 | **对价未见公开披露**；媒体称收购前一轮估值约 2.5 亿美元口径；Cilium 成多云网络事实标准 |
| NVIDIA 收购 Run:ai | 2024-04 签约、2025-01 宣布完成 | 约 7 亿美元，曾受欧盟审查障碍；总融资仅 1.18 亿美元；**收购后软件开源**——K8s 成为 GPU 调度事实标准的注脚 |

### 3.2 还活着的独立公司（向 AI 迁移求生）

- **Rafay**（2017 创立）：K8s 集群生命周期 + GPU 自助调度；2026-03 GTC 与 NVIDIA 合作（Slurm 控制器 + K8s 编排）、早期 B 轮 2,500 万美元
- **Loft Labs / Kubermatic / Akuity / Komodor / Fairwinds**：自助 K8s、GitOps（Argo 商业化）、K8s 故障诊断、治理合规——多为千万美元级早期轮次
- 生存逻辑：独立 K8s 工具的天花板被云厂商托管服务（EKS/GKE/AKS）压平，出路是**垂直化（AI 工作负载调度）或被收购**

### 3.3 K8s 被 AI 重新点燃的三条线

1. **GPU 调度**：Run:ai 被 NVIDIA 开源化后，Kueue/KubeRay/Volcano/KAI Scheduler 等调度栈成为 AI-on-K8s 主战场（本库 [CNCF 云原生 AI 章节](../../12_架构基建/05_CNCF云原生AI/README.md) 收录 20+ 项目）
2. **推理服务化**：KServe/llm-d/KGateway 承接模型服务（同章节）
3. **Agent on K8s**：kagent、HolmesGPT 等把 Agent 自身跑在 K8s 上

---

## 4. NVIDIA 三层战投标的清单（2026-11-17 检索补充）

**总口径**：CFO Colette Kress 在 2026 财年 Q2 电话会（2026-08-26）确认「已向前沿 AI 实验室投资近 500 亿美元」，含直接投资、算力承诺与基础设施合作；未上市公司资产较上一财年末增长逾一倍。

### 4.1 AI Infra 层：推理三家 + 云与供应链 + 两次巨型收购

| 标的 | 定位 | 金额/时点 | 状态 |
|------|------|-----------|------|
| Fireworks AI | 推理（Token 工厂） | B 轮 2024-07 参投（5,200 万轮）；D 轮 2026-07-15 15.05 亿 @175 亿 | 持续持股；10 月传新轮 300–400 亿洽谈 |
| Baseten | 推理 | E 轮 2026-02 投约 1.5 亿 @50 亿；F 轮 2026-06 @130 亿 | 10 月传新轮 20 亿 @260–300 亿洽谈（2026-10-31） |
| Together AI | 推理 | 2026-07-01 8 亿 @83 亿轮参投 | 已确认 |
| CoreWeave / Nebius | AI 云 | 2026-01 20 亿 / 2026-03 20 亿 | 已确认 |
| Lambda / Crusoe | 训练云/数据中心 | 2025-02 D 轮 4.8 亿 @25 亿 / 2024-11 6.86 亿 | 已确认 |
| Marvell、Lumentum、Coherent | 硅光子 | 2026-03 各 20 亿共研 | 已确认 |
| Corning / Iren | 供应链/数据中心 | 2026-05 最高 32 亿 / 最高 21 亿 | 已确认 |
| **Groq** | 推理芯片 | 2025-12 约 200 亿芯片资产交易 | 已完成（媒体称「去年底约 200 亿美元收购」） |
| **Hugging Face** | 开源模型分发入口 | **2026-09-03 宣布 129.303 亿**（119 亿股东对价 + 最高 10 亿留任股权），**史上最大收购**（前纪录为 2019 年 Mellanox 69 亿） | 待监管批准，预计 2027H1 交割；2026-10 美国司法部问询；按 HF 年化收入约 1.5 亿计约 86x PS |

### 4.2 Agent 层：编码双雄 + 模型实验室 + 数据与搜索

| 标的 | 定位 | 金额/时点 |
|------|------|-----------|
| **Cognition（Devin）** | 编码 Agent | E 轮 2026-09 超 20 亿 @480 亿，NVIDIA 在投资方名单（a16z/Accel 领投） |
| **Cursor（Anysphere）** | 编码 | D 轮 2025-11-13 23 亿 @293 亿，战略投资方（同轮 Google）；2026-06 SpaceX 600 亿收购后退出 |
| n8n | 工作流自动化 | 与 Accel 同列投资方（2026 口径） |
| Kore.ai | 企业客服 Agent | 2023-12 1.5 亿轮参投 |
| Scale AI | 训练数据/评估 | 2024-05 10 亿轮（与 Accel、亚马逊、Meta） |
| Perplexity | AI 搜索 | 2023-11 起每轮参投；2026-08 洽谈新轮 @300 亿+ |
| OpenAI / Anthropic / xAI / SSI | 前沿模型 | 300 亿（2026-02）｜G 轮承诺最高 100 亿 @3,800 亿（2026-02）｜2026-01 E 轮 200 亿中参投（后随 xAI 并入 SpaceX 转为股票）｜50 亿 |
| Mistral / Reflection / Cohere / Runway / Imbue | 模型 | Mistral C 轮 2025-09 17 亿欧 @117 亿欧｜Reflection 2025-10 20 亿 @80 亿｜Cohere 2025-06 5 亿轮｜Runway 2025-04 D 轮 3.08 亿 @30 亿+ |

> 证伪注记：某媒体将「Anthropic」误写为「Cursor 母公司」——Cursor 母公司为 Anysphere，与 Anthropic 无关；本文按 TradingKey 口径（Anthropic G 轮 2026-02、NVIDIA 承诺最高 100 亿）采用。

### 4.3 K8s/调度层：只买不投

| 标的 | 时点 | 对价 | 备注 |
|------|------|------|------|
| **Run:ai** | 2024-04 宣布、2025-01 完成 | 约 7 亿（报道口径 7 亿至多 10 亿） | K8s GPU 调度；**收购后软件开源**并入 DGX Cloud |
| **SchedMD**（Slurm 母公司） | 2025 | 未披露（体量小） | HPC 调度器，与 K8s 栈互补 |

**检索结论**：NVIDIA 在 K8s 层**未发现对独立 K8s 创业公司的股权投资**——该层的 NVIDIA 存在形态是「收购调度层（Run:ai/SchedMD）+ 合作伙伴网络（Rafay GTC 2026、思科 AI 工厂）」，而非持股。

**直觉**：**直觉**——NVIDIA 的三层打法随生命周期切换：爆发期用战投绑定供给（推理三家）、成长期用战投卡位入口（Cognition/Cursor）、成熟期直接买断标准（Run:ai 开源化、Hugging Face 收编分发入口）；无论哪层胜出，它都赢在卖铲。

---

## 5. 模型层公司融资与估值清单（2026-11-17 检索补充）

**框架位置**：模型层是三条 infra 赛道的**共同上游客户与资金源头**——NVIDIA 向前沿实验室投入近 500 亿美元（2026-08-26 财报电话会），本质是给卖铲生意预付货款；推理三家的 Token 需求、Agent 层的模型调用，全部由模型层的资本开支与 ARR 派生。

### 5.1 美国头部：万亿美元俱乐部

| 公司 | 最新融资/估值（时点） | 收入口径（时点） | 状态 |
|------|----------------------|------------------|------|
| **OpenAI** | 私募 150 亿美元 @ **1.25 万亿美元融前**（2026-11-13 CNBC，首批 110 亿 11-06 到账）；此前 1,220 亿美元承诺 @8,520 亿投后（2026-03-31 完成） | 2026Q3 营收约 100 亿美元（环比 +50%），运营亏损 109 亿美元（WSJ）；ARR 约 400 亿（2026-11 口径） | IPO 推迟至 2027；NVIDIA 承诺 300 亿（2026-02） |
| **Anthropic** | H 轮 650 亿 @ **9,650 亿**（2026-05，全球最高估值私有 AI 公司）；G 轮 300 亿 @3,800 亿（2026-02，GIC/Coatue 领投，微软、NVIDIA 参投）；Forge 隐含 1 万亿（2026-04，**私募二级口径非融资口径**） | ARR **650 亿美元**（2026-11 彭博引创始人披露，较 2025 底约 90 亿增 7 倍+）；4 月曾以总额法 300 亿首超 OpenAI 净额法 250 亿 | 纳斯达克 IPO 计划 **2026-11-19 开始交易**、目标估值最高 1.4 万亿（路透，2026-11-13）；80% 营收来自企业端，Claude Code ARR 超 25 亿 |
| **xAI** | E 轮 200 亿 @ **2,300 亿**（2026-01，a16z 领投，NVIDIA 参与） | — | 并入 SpaceX 后 NVIDIA 持股转为 SpaceX 股票（账面约 210 亿，2026-09 口径） |
| **Thinking Machines Lab** | 洽谈 10 亿 @ **400 亿**（2026-09-03 TechCrunch，Accel 拟领投）；此前 20 亿 @80 亿（2025-10，NVIDIA 为主要参与方） | — | Mira Murati 创立；联创流失传闻与高估值并存 |
| **Safe Superintelligence** | NVIDIA 承诺最高 50 亿（2026-07-28 参投） | 研究型、无收入 | Ilya Sutskever 创立，纯研究定位 |

> 证伪注记：Anthropic「1 万亿美元」是 Forge Global 私募二级隐含估值（2026-04），不是融资估值；其融资口径为 H 轮 9,650 亿。两个数字不得混用。

### 5.2 欧洲：Mistral 的主权 AI 转向

- D 轮 30 亿欧元（约 34.9 亿美元）@ **210 亿欧元+**（2026-09-08，**三星领投**，Salesforce Ventures、英伟达、ASML 等 20+ 家跟投）——**欧洲科技公司史上最大股权融资**；一年前 ASML 领投后估值 117 亿欧元
- 战略转向：从开放权重模型转向出售 AI 基础设施与主权计算（Mistral Compute，自建数据中心 + 算力租赁），与 Nebius、Nscale 直接竞争；本轮首次由非欧洲实体领投
- 收入参考：约 4 亿美元（2025-09 Series C 口径，multiples.vc）

### 5.3 中国：IPO 潮与两条资本哲学

| 公司 | 融资/估值（时点） | 收入（时点） | 资本动作 |
|------|-------------------|--------------|----------|
| **DeepSeek** | 首轮外部融资隐含 **3,508.8 亿元**（2026-07-17，安徽开润披露 29 亿获 0.8265%）；二轮 1,055 亿元 @ **投后 6,155 亿元**（2026-10） | 4.75 亿元营收、7.15 亿亏损（2026 前 7 个月） | 腾讯/宁德时代/京东/网易/IDG 参与；中信证券筹备科创板、目标 2026 交表；创始人系持股约 78% |
| **月之暗面（Kimi）** | C 轮后 43 亿（2025 底）→ 3 个月 180 亿 → Pre-IPO **约 500 亿美元**（2026-07 洽谈、10 月完成） | ARR 3 亿（2026-06）→ **10 亿美元**（2026-08） | 2027Q1 港股 IPO；中国移动等产业资本进入；K3 达 2.8 万亿参数（全球最大开源模型） |
| **智谱** | 港股市值峰值破万亿 → 约 3,135 亿港元（2026-10-08，较 6 月高点 **-78%**） | H1'26 营收 9.54 亿元、亏 20 亿；全业务 ARR 破 18 亿美元（2026-09） | 2026-01-08 上市，「全球大模型第一股」 |
| **MiniMax** | 港股市值约 730 亿港元（2026-10-08，较 3 月高点蒸发约 3,400 亿，媒体称「跌掉 80%」） | 2025 营收 5.43 亿元、亏 17.5 亿 | 2026-01-09 上市首日 +109% |
| **阶跃星辰** | 约 25 亿美元融资 @ 约 100 亿美元投后（2026-11 口径） | — | 手机产业链资本支持，押注万亿参数基座 + 终端落地 |

**PS 阶梯**（36氪，2026-11-12，按 H1 收入年化 vs 市值/估值）：MiniMax 40x < 可灵 41x < 月之暗面 50x < DeepSeek 74x < 智谱 141x——一级市场「夹在两只已上市股票中间：比跌透的 MiniMax 贵，比没跌透的智谱便宜」。

### 5.4 三个判读

1. **收入-估值鸿沟是行业底色**：智谱 H1 亏 20 亿对应 3,135 亿港元市值、OpenAI 单季亏 109 亿对应 1.25 万亿融前——市场按「技术壁垒 × 增长斜率 × 生态话语权」定价，传统 PS 框架失效
2. **Anthropic 反超的口径陷阱**：2026-04 首次在 ARR（总额法 300 亿 vs OpenAI 净额法 250 亿）与隐含估值（1 万亿 vs 8,800 亿）双领先，但净额法调整后 220 亿仍低于 250 亿——**引用必须带口径**
3. **两种资本哲学**：DeepSeek 绝对控股（约 78%）+ 谨慎节奏 vs 月之暗面火箭冲刺（3 个月估值 4 倍、股东倒逼上市）；中国大模型 PS 约为美国同行 7–8 倍（港股纯血稀缺所致）

---

## 6. 三赛道合起来看：三条判读

1. **同一门生意的不同时段**：K8s 教会了世界「编排一切」，AI Infra 是把编排对象换成 GPU/Token，Agent Infra 是把编排对象换成任务与工具——**K8s 的退出史（并购）就是 AI Infra 的未来剧本**（预示推理层终局可能被芯片商/云商整合；NVIDIA 已用 Run:ai 与 Hugging Face 两笔收购预演）
2. **NVIDIA 的三层下注**：详见第 4 节完整清单——战投推理公司（Fireworks/Baseten/Together）+ 买调度层与分发入口（Run:ai/SchedMD/Hugging Face/Groq）+ 合作伙伴网络（Rafay/思科 AI 工厂）
3. **模型层是三条赛道的资金总闸**：第 5 节显示模型层半年融资近 1,880 亿美元（占当季全球风投约 63%，2026H1 口径）——infra 层的景气度是模型层资本开支的影子变量，模型层估值收缩会先传导到推理层订单

## 7. 风险与挑战

- **口径冲突**：Baseten 130 亿（2026-06 F 轮）vs 300 亿（2026-11 全景）差 2.3 倍，引用必须带时点
- **推理价格战**：Token 工厂互相压价，毛利率被云厂商与开源（vLLM/SGLang）两头挤压
- **安全事件**：Fireworks 2026-10-09 凭证泄露事件表明 infra 层的单点事故可直接冲击融资节奏
- **K8s 创业收缩**：托管服务吞噬腰部工具，独立标的持续萎缩

---

## 8. 与其它文档的衔接

- 同目录：[Agentic Infra 全景 2026](./01_Agentic_Infra_全景_2026.md)（七层栈技术版）、[生产环境组件清单](./02_生产环境组件清单.md)、[推理服务化与 PD 分离部署](./03_推理服务化与_PD_分离部署.md)
- 同批次：[Agent 赛道创业公司拆解 2026](../17_Agent应用/05_Agent_Startups_2026.md)（应用层资本面——本篇是其上游）
- 跨章节：[CNCF 云原生 AI](../../12_架构基建/05_CNCF云原生AI/README.md)（K8s 项目图谱）、[Agent Gateway 深入分析](../../12_架构基建/05_CNCF云原生AI/01_AgentGateway_深入分析.md)

## 9. 来源与时点

- [老虎财经《全球 AI 独角兽全景图》](https://www.laohucaijing.com/Www_detail1/index/2/238989/)（2026-11-16，Baseten/Modal/fal/Crusoe 估值与收入；[c114 镜像](http://www.c114.net.cn/industry/146875.html)，均校验 200）
- [DefiLlama Pre-IPO：Fireworks AI](https://defillama.com/pre-ipo/fireworks-ai)（2026-11-14 估值 385 亿；*2026-11-17 校验：该站整站自本网络 000 不可达——example.com 200 排除普遍断网，WebFetch 亦超时；内容为检索当日获取，浏览器/海外网络可复核*）
- 智东西/Business Insider：Fireworks 新轮洽谈 300–400 亿（2026-10-21；*知乎原文 403 反爬，改挂[网易转载《华人女掌门带队！英伟达支持的 AI 独角兽》](https://m.163.com/dy/article/L9PQ7Q210519QQUP.html)，校验 200*）
- [Today's Startup News：Modal D 轮 7.5 亿 @157.5 亿](https://www.todaysstartupnews.com/news/october-11-18-2026-startup-funding-news-recap)（2026-10-18，校验 200）
- [36氪《无问芯穹 C 轮 23 亿》](https://m.36kr.com/p/4022354331160454)（2026-10-12）与《Token 工厂融资大爆发》（2026-10-16；*知乎原文 403 反爬，改挂[百家号同文镜像](https://baijiahao.baidu.com/s?id=1878818287080034823)，校验 200*）
- [新浪财经：LangChain 3 亿 @30 亿](https://finance.sina.cn/cj/2026-11-16/detail-iniywwze5717825.d.html)（2026-11-16）与 [TechCrunch 原文](https://techcrunch.com/2026/11/13/ai-agent-startup-langchain-hits-3b-valuation/)（2026-11-13；[网易镜像](https://m.163.com/dy/article/LBUC3SG6051180F7.html)），均校验 200
- [NVIDIA Developer Blog：Rafay 合作](https://developer.nvidia.com/zh-cn/blog/delivering-nvidia-accelerated-computing-for-enterprise-ai-workloads-with-rafay/)（2026-03-17）；[CSDN：思科收购 Isovalent](https://m.blog.csdn.net/dwh0403/article/details/135182811)（2023-12-24，另见 [cniteyes 分析](http://www.cniteyes.com/archives/39220)）；[Calcalist：Run:ai 7 亿对价与欧盟审查](https://www.calcalistech.com/ctechnews/article/rk7fhg11bjg)（2024-10-31，另见 [ai-bot 官宣稿](https://ai-bot.cn/nvidia-acquires-ai-startup-runai/)），均校验 200
- [TradingKey《英伟达 2026 年 AI 投资清单》](https://www.tradingkey.com/zh-hans/analysis/stocks/us-stock/262135441-nvidia-2026-ai-investment-openai-huggingface-nvda-tradingkey)（2026-08-27，OpenAI 300 亿/Anthropic 100 亿/CoreWeave 20 亿等，校验 200）
- [腾讯新闻《129 亿美元，英伟达史上最大一笔收购即将落地》](https://new.qq.com/rain/a/20260915A05O9600)（2026-09-15，前沿实验室近 500 亿总口径，校验 200）
- [读懂 AI 时代《英伟达同意以 129.303 亿美元收购 Hugging Face》](https://www.readaitime.com/news/2026-09-15/2g5zg6fi)（2026-09-15）；[InfoQ 转引 Business Insider 谈判与 DOJ 问询](https://www.infoq.cn/article/Z9bIWfsMCIA9yiLUSDvJ)（2026-11-13），均校验 200
- [Odaily《Cognition 完成超 20 亿美元 E 轮》](https://m.odaily.news/zh-CN/newsflash/516824)（2026-09-11，NVIDIA 在投资方名单；[链得得镜像](https://www.chaindd.net/nictation/3901929.html)），均校验 200
- [CNBC/IT之家《OpenAI 最新一轮私募融资 150 亿美元，融前估值 1.25 万亿美元》](https://www.ithome.com/html/android/1026495.htm)（2026-11-13，含 WSJ Q3 营收 100 亿/运营亏损 109 亿；另存[同花顺镜像](https://goodsfu.10jqka.com.cn/20261113/c681784512.shtml)，均校验 200）
- [firecat《IPO 前夕营收数据曝光：Anthropic 年化收入达 650 亿美元》](https://www.firecat-web.com/daily-news/14341)（2026-11-14，彭博口径 + H 轮 650 亿@9,650 亿）与 [firecat《Anthropic 估值触及万亿美元》](https://www.firecat-web.com/daily-news/8410)（2026-11-15，Forge 隐含估值与总额/净额法辨析）
- [navcn《2026 年 AI 行业融资快报》](https://www.navcn.cn/1480.html)（2026-11-12，四笔合计 1,880 亿占当季风投 63%；xAI E 轮 200 亿@2,300 亿）
- [36氪《2026 AI 上市潮》](https://36kr.com/p/3971481903306372)（2026-11-17，中国各家收入-市值对照）与 [36氪《MiniMax 跌掉 80%、DeepSeek 拟融资 1000 亿》](https://36kr.com/p/4019328250171529)（2026-11-12，PS 阶梯 40x–141x）
- [央视财经/同花顺《Mistral 完成 30 亿欧元 D 轮，估值超 210 亿欧元》](https://finance.sina.cn/stock/jdts/2026-09-09/detail-iniresya5647820.d.html)（2026-09-09，三星领投、欧洲史上最大股权融资；收入参考另见 [multiples.vc](https://multiples.vc/private-comps/mistral-ai)）
- [百度百科「估值」词条](https://baike.baidu.com/item/%E4%BC%B0%E5%80%BC/4518500)（2026-11-12，DeepSeek 首轮 3,508.8 亿元隐含估值、月之暗面 500 亿美元 Pre-IPO；*脚本访问 403 为整站条目页反爬，浏览器可正常访问，2026-11-17 校验*）
- [InfoQ 转引 TechCrunch《Accel 拟领投 Thinking Machines 10 亿轮 @400 亿》](https://xie.infoq.cn/article/7b07800b7ad0f2c0e5f5659c8)（2026-09-03；月之暗面 IPO 节奏另见 [firecat](https://www.firecat-web.com/daily-news/6146)、PS 与估值争议另见[新浪财经《大模型跌成这样，还是贵？》](https://cj.sina.cn/articles/view/2357213493/8c803935019028aag)）
- [Wikipedia：Cursor (company)](https://en.wikipedia.org/wiki/Cursor_(company))（D 轮 23 亿 @293 亿含 NVIDIA/Google，2025-11-13；*2026-11-17 校验：en.wikipedia.org 整站自本网络 000 不可达（网络层，非内容失效），内容为检索当日获取；同事实另见 [BAAI Hub 引 Business Insider](https://hub.baai.ac.cn/view/59141)（SpaceX 600 亿收购 Cursor，校验 200）*）；雪球《AI 圈最贵的》（2026-10-15，Baseten E 轮 NVIDIA 约 1.5 亿，[校验 200](https://xueqiu.com/4379570015/412473348)；英伟达押注三家 Token 工厂的同源论述另见[搜狐转载](https://sports.sohu.com/a/1088177409_122983200)（校验 200））——*原引网易《英伟达投的三家美国 AI 创企》（2026-10-19）经校验 m/www 双端 404 真失效，已弃用*

---

*Last updated: 2026-11-17*
