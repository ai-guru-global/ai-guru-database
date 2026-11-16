---
线索: Common Crawl
主题: 训练与数据
别名: [Common Crawl, CCBot, CC-MAIN, Common Crawl Foundation]
状态: 活跃
创建: 2026-11-11
更新: 2026-11-11
关键角色: [Common Crawl]
---

# Common Crawl

> 开放网页数据集的事实垄断者：2007 年 Gil Elbaz 创立的 501(c)(3)（官网 FAQ 口径），自 2008 年持续抓取、语料以 PB 计 ✅；月度 crawl 档案 CC-MAIN-{年}-{周}，最新 2026-10 档 21.6 亿页面 / 371.19 TiB（2026-11-12 抓取）✅；GPT-3 训练配比权重 60%、C4/The Pile/RefinedWeb（5T tokens）/FineWeb（96 个 dumps）的公共上游 ✅——「公共预训练数据 ≈ Common Crawl」这个等式至今没有被打破过。

## 概述

**Common Crawl Foundation** 是加州 501(c)(3) 非营利，官网自我定位「dedicated to providing a copy of the Internet」，免费向公众开放抓取档案与数据集 ✅ [FAQ](https://commoncrawl.org/faq)。官网 [overview](https://commoncrawl.org/overview)：语料「contains petabytes of data, regularly collected since 2008」，含原始网页数据、元数据抽取与文本抽取三层 ✅。创始人 Gil Elbaz（Applied Semantics 联合创始人，该公司 2003 年被 Google 收购）2007 年创立基金会并任董事会主席，目标是「让没有自有爬虫基础设施的研究者也能用上 web 规模的抓取数据」；2023 年起由 Rich Skrenta（blekko 搜索引擎创始人、Open Directory Project 创始人）任执行总监，2026 年口径约 18 名员工 ✅ [About](https://commoncrawl.org/about)。

**机制（官网 [get-started](https://commoncrawl.org/get-started) ✅，2026-11-12 抓取）**：抓取按 `CC-MAIN-{年}-{周}` 编号、约每 4–6 周一波，官网现列最早为 CC-MAIN-2016-40（2013 年夏之前为 ARC 旧格式）；每档提供三种格式——WARC（原始抓取：HTTP 响应、请求与抓取元数据）、WAT（每条记录的元数据 JSON）、WET（仅抽取纯文本）✅。最新一档 2026-10 crawl（2026-10-21 发布）：21.6 亿页面、解压后 371.19 TiB；2026 年 6–10 月各档稳定在 21.0–21.7 亿页面 / 354–371 TiB ✅ [博客列表](https://commoncrawl.org/blog)。分发托管在 AWS Open Data Sponsorship 计划的 `s3://commoncrawl/`（us-east-1），访问免费、无 requester-pays，站外可经 `data.commoncrawl.org` 直接 HTTP 下载；部分档案另镜像至 Hugging Face ✅。

**非营利运营是「家族资助 + 托管赞助」的极低成本结构**：官网 About 明确主要资助方为 Elbaz Family Foundation，AWS 自 2012 年起以 Open Data Sponsorship 捐赠托管 ✅；合作伙伴页列 NVIDIA、Hugging Face、a16z、Linux Foundation 等 ✅ [donate](https://commoncrawl.org/donate)。但财务透明度反常地低：ProPublica Nonprofit Explorer API 检索「Common Crawl」无该基金会记录，官网亦未披露收入/支出数字 🔍——一个承载全球公共预训练底座的组织，其 990 口径财务本次未能取得一手确认。

**在训练语料中的地位：几乎所有开放预训练语料的共同上游。** GPT-3 论文训练配比表中「Common Crawl (filtered)」占 410 billion tokens、训练权重 60%，为最大单一来源（次席 WebText2 为 19 billion tokens），并用 Spark MinHashLSH 做模糊去重 ✅ [arXiv 2005.14165](https://arxiv.org/abs/2005.14165)；T5 的 C4（Colossal Clean Crawled Corpus）由「对 Common Crawl 单一快照施加一组过滤器」构成 ✅ [arXiv 1910.10683](https://arxiv.org/abs/1910.10683)；The Pile（825 GiB、22 个子集）含 Pile-CC 子集，其消融以 Raw CC 与 CC-100 为基线 ✅ [arXiv 2101.00027](https://arxiv.org/abs/2101.00027)；Falcon 的 RefinedWeb 从 CommonCrawl 提取 5 trillion tokens，证明「仅靠清洗去重的 web 数据即可训练强模型、甚至显著超过在 The Pile 上训练的模型」✅ [arXiv 2306.01116](https://arxiv.org/abs/2306.01116)；Hugging Face 的 FineWeb 处理 96 个 CommonCrawl dumps（2013 年夏–2024 年 4 月）得约 15T tokens（v1.3.0 修复后 18.5T+），为公开最大的干净预训练集 ✅ [数据卡](https://hf-mirror.com/datasets/HuggingFaceFW/fineweb/raw/main/README.md)。各家的「数据配比研究」口径差异（是否过滤、去重几轮、取哪些 dumps）大于底座差异——底座是同一个。

**质量反方记录充分**：Dodge et al. 的 C4 纪实研究发现该单一快照混入专利、美军网站、机器翻译生成的文本与其他 benchmark 的评测样例（语料内污染），且重过滤使语料偏向正式美式英语 ✅ [arXiv 2104.08758](https://arxiv.org/abs/2104.08758)；FineWeb 的价值增量几乎全在清洗管线（datatrove 过滤 + 去重，单档 CC-MAIN-2024-10 原始 581.3 TiB → 过滤后 212.6 TiB），并用 Llama3-70B-Instruct 标注训练教育质量分类器切出 FineWeb-Edu（1.3T tokens），自证「合成数据训练的分类器」路线有效 ✅ [FineWeb-Edu 数据卡](https://hf-mirror.com/datasets/HuggingFaceFW/fineweb-edu/raw/main/README.md)。2026-08-31 官博对 2026-07 档 llms.txt 文件的分析发现 584,107 个文件、部分含 prompt injection ✅——对抗性内容已进入抓取面。

**法律与退出机制是双轨制**：爬虫 CCBot 尊重 robots.txt（含 Crawl-delay 与 Sitemap 协议），站点可 `User-agent: CCBot / Disallow: /` 退出 ✅ [FAQ](https://commoncrawl.org/faq)；但针对已发布历史档案，CC 于 2025-09-17 发布 Opt-Out Registry（后更名 Opt-Out Ledger），公开收到的每一条「法律退出请求」清单，原话「We have many downstream users who are not aware of the legal notices we have received」✅ [官博](https://commoncrawl.org/blog/common-crawl-foundation-opt-out-registry)——退出指令的治理责任在 CC 与下游使用者之间是断裂的。下游同样暴露：2025-01-31 FineWeb v1.3.0 按 Torstar 的 C&D 通知移除特定域名 ✅ 数据卡。NYT v. OpenAI 等诉讼中 Common Crawl 数据集被点名的具体指控（诉状引 WebText 与 Common Crawl 含时报文章），本次新闻源域全部不可达，未获一手确认 🔍。

## 时间线

### 2026-11

- **2026-11-04** · [warc2zip 工具发布](https://commoncrawl.org/blog) ✅
  将 WARC 档案转为可用常规工具检视的 zipped 文件，降低非 Hadoop 用户的检阅门槛。
  来源：Common Crawl Blog · 2026-11-04

### 2026-10

- **2026-10-21** · [October 2026 Crawl 发布：21.6 亿页面 / 371.19 TiB](https://commoncrawl.org/blog) ✅
  2026 年 6–10 月各档稳定在 21.0–21.7 亿页面 / 354.59–371.19 TiB（解压口径）；同期发布 2026 年 8–10 月 host/domain 级 Web Graphs（10-22）。
  来源：Common Crawl Blog · 2026-10-21

### 2026-09

- **2026-09-16** · [Getting Started with Common Crawl Data on Hugging Face](https://commoncrawl.org/blog) ✅
  官方教程确认部分档案镜像至 HF Storage Bucket（S3 兼容布局），分发面从 AWS 单点走向双轨。
  来源：Common Crawl Blog · 2026-09-16
- **2026-09-07** · Web Graph Embeddings 实验数据集：5290 万 host 的 128 维向量 ✅
  来源：Common Crawl Blog · 2026-09-07

### 2026-08

- **2026-08-31** · [2026-07 档 llms.txt 内容分析](https://commoncrawl.org/blog) ✅
  分析 584,107 个 llms.txt 文件，部分含 prompt injection——CC 档案同时成为观测「AI × Web 互动」的传感器。
  来源：Common Crawl Blog · 2026-08-31

### 2025-09

- **2025-09-17** · [Opt-Out Registry 发布（后更名 Opt-Out Ledger）](https://commoncrawl.org/blog/common-crawl-foundation-opt-out-registry) ✅
  公开每一条已收到的法律退出请求；鼓励出版方用 robots.txt 管控抓取，同时承认下游用户「不知道我们收到过哪些法律通知」。
  来源：Common Crawl Blog · 2025-09-17

### 2025-01

- **2025-01-31** · FineWeb v1.3.0：修复 9 个 dumps（新增约 400B tokens）、按 Torstar C&D 移除特定域名 ✅
  总量从 15T 升至 18.5T+ tokens；法律下架首次直接作用于 CC 派生数据集。
  来源：[FineWeb 数据卡](https://hf-mirror.com/datasets/HuggingFaceFW/fineweb/raw/main/README.md) · 2025-01-31

### 2023-06

- **2023-06** · [RefinedWeb：从 CommonCrawl 提取 5 trillion tokens](https://arxiv.org/abs/2306.01116) ✅
  Falcon 训练语料证明纯过滤去重的 web 数据可显著超越 The Pile 训练的模型。
  来源：arXiv 2306.01116 · 2023-06

### 2021

- **2021-04** · [C4 纪实研究（Dodge et al.）：单一快照的污染与偏斜](https://arxiv.org/abs/2104.08758) ✅
  发现 C4 混入专利/美军网站/机器翻译文本/benchmark 评测样例，重过滤偏斜至正式美式英语。
  来源：arXiv 2104.08758 · 2021-04
- **2021-01** · [The Pile 发布（825 GiB、22 子集）](https://arxiv.org/abs/2101.00027) ✅
  含 Pile-CC 子集，消融以 Raw CC 与 CC-100 为基线。
  来源：arXiv 2101.00027 · 2021-01

### 2020

- **2020-05** · [GPT-3 论文：Common Crawl (filtered) 410B tokens、训练权重 60%](https://arxiv.org/abs/2005.14165) ✅
  最大单一训练来源；Spark MinHashLSH 模糊去重。
  来源：arXiv 2005.14165 · 2020-05

### 2019-10

- **2019-10** · [T5 与 C4（Colossal Clean Crawled Corpus）](https://arxiv.org/abs/1910.10683) ✅
  对 Common Crawl 单一快照施加一组过滤器（Dodge et al. 纪实研究的对象），确立「重过滤清洗管线」范式。
  来源：arXiv 1910.10683 · 2019-10

### 2008

- **2008** · Gil Elbaz 于 2007 年创立基金会，数据收集自 2008 年开始 ✅
  定位「让缺爬虫基础设施的研究者用上 web 规模数据」；2013 年夏前为 ARC 格式；2012 年起 AWS 以 Open Data Sponsorship 捐赠托管（s3://commoncrawl/，us-east-1）✅。
  来源：Common Crawl About / get-started · 2007–2012

## 分析

1. **「公共预训练数据 ≈ Common Crawl」是一个结构性垄断，且是良性的。** 十七年里没有第二个组织做成同规模开放抓取：GPT-3（权重 60%）、C4、Pile-CC、RefinedWeb（5T）、FineWeb（18.5T）全部以它为底座 ✅。反面是单点风险：基金会主要资助方为 Elbaz Family Foundation 一家 ✅、990 财务本次检索不到一手记录 🔍、月度 crawl 约 360–370 TiB 的持续成本依赖 AWS 赞助维持——这条公共底座的存续条件比看上去更窄。
2. **价值增量在清洗层，不在抓取层——这是与 [[训练与数据/ScaleAI与数据标注]] 相对的数据供给另一极。** 同一个底座，C4 只留约 1%、RefinedWeb 洗出 5T、FineWeb 单档从 581 TiB 洗到 213 TiB ✅；各家「数据配比研究」的结论差异主要来自管线而非来源。谁掌握了清洗管线与质量分类器（FineWeb-Edu 用 Llama3-70B 标注 ✅），谁就掌握了数据护城河——CC 本身不是壁垒，CC 之上的加工才是。
3. **治理责任链条在 CC 与下游之间断裂。** CCBot 尊重 robots.txt ✅，但历史档案不可撤回；CC 2025 年公开法律退出清单时自己承认「许多下游用户不知道我们收到过法律通知」✅。Torstar C&D 直接下架 FineWeb 域名 ✅ 说明法律压力已穿透到派生层。用 CC 数据训练的模型，其数据合规的尽调义务实际落在下游——这是 [[行业应用/AI与法律]] 视角下的关键结构性事实。
4. **质量与对抗是开放语料的永久税。** C4 纪实研究的污染/偏斜证据 ✅、GPT-3 时代已需 MinHashLSH 去重 ✅、2026 年 llms.txt 里已出现 prompt injection ✅——随着站长从「被 crawl」转向「主动投喂 AI」（llms.txt）与「主动退出」（Opt-Out Ledger），抓取面正在从单向采集变成对抗性接口。
5. **分发的 AWS 单点正在松动。** 2012 年起 AWS 赞助托管是访问唯一通道，2026 年 9 月起官方开始向 Hugging Face 镜像部分档案 ✅——对地缘限制下的中国研究者（AWS us-east-1 直连受限），HF 镜像是实际可达性的分水岭；跟踪镜像覆盖率是观测这条底座开放度的最好指标。
6. **台内观察价值：它是最便宜的「AI-Web 关系传感器」。** 月度 21 亿页面口径稳定 ✅，可直接观测：llms.txt 采用曲线、prompt injection 检出率、退出清单增速。待补三件事：基金会 990 财务 🔍、NYT v. OpenAI 诉状中 CC 角色的一手引文 🔍、Opt-Out Ledger 清单规模数字 🔍。

## 关联线索

- [[训练与数据/数据壁垒与合成数据]] — CC 是「无壁垒公共底座」的对照面：壁垒在清洗管线与私有数据
- [[训练与数据/ScaleAI与数据标注]] — 数据供给两极：免费公共抓取 vs 付费人工标注
- [[行业应用/AI与内容产业]] — 出版方以 robots.txt / 法律退出 / C&D 应对抓取的另一侧记录
- [[行业应用/AI与法律]] — 退出机制双轨与诉讼中数据集角色的法律视角
- [[开源模型与生态/DeepSeek]] — 开放模型 × 开放语料的组合如何逼近闭源前沿
