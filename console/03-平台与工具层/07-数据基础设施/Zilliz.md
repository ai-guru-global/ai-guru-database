---
层: 03-平台与工具层
节点: 07-数据基础设施
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/开发者工具/Zilliz.md
---

# Zilliz

> 向量数据库品类的定义者与开源 Milvus 的商业主体（官网口径 2017 年成立、累计投资 $113M、10,000+ 企业用户）：以 Apache-2.0 的 Milvus（实测 46,646 star，2026-11-12）做获客面，Zilliz Cloud 做利润面，2026 年把叙事从「向量数据库」升维到「Vector Lakebase / lake-native」，并把产品操作面交给 coding agent（CLI + Skills + Claude Code 插件）。创始人 Charles Xie 口径已核——流通的「星绍辉」为讹传，疑源其绰号 Starlord。

## 是什么

**Zilliz**（官网 [zilliz.com](https://zilliz.com/about) ✅ 2026-11-12 实测）自述使命 "Helping organizations make sense of unstructured data"，官网页脚给三组硬口径：**2017 — Founded、$113M — Investment、10,000+ Enterprise users** ✅。总部旧金山湾区（另列纽约、东京、上海、新加坡、柏林、伦敦），产品两件套：开源 Milvus（"the world's most popular open-source vector database"，官网挂 46.6k star）+ 托管服务 Zilliz Cloud（已改称 "fully managed **Vector Lakebase**"，BYOC 模式可选）✅。

**创始人 Charles Xie 的口径已核**：unite.ai 专访（2025-01-13）确认其 Oracle 6 年软件工程师、**Oracle 12c Multitenant 团队创始成员**、威斯康星大学麦迪逊分校计算机硕士、LF AI & Data 基金会董事且 **2020、2021 两任主席** ✅；TechCrunch（2022-08-24）记录其绰号 "**Starlord**" ✅。流通的「星绍辉」人名未见任何官方佐证，疑为绰号讹传 🔍；「齐侠忠」口径同样无一手源，其 LinkedIn handle "chaoxie" 暗示中文名或含「超」，证伪证实均缺材料 🔍。成立年份是双口径：官网 2017（公司注册）vs 媒体惯用 2019（Milvus 开源年）——TechCrunch 口径 "started Zilliz in Shanghai"（上海起家）、2020 年宣布赴美、2022-08 迁总部旧金山 ✅。

**开源项目本体实测**：GitHub org milvus-io 创建于 2019-06-12、68 个公开仓库；[milvus-io/milvus](https://github.com/milvus-io/milvus) 建库 2019-09-16、首个 release **v0.5.0（2019-10-21）**、Apache-2.0 ✅ GitHub API；2026-11-12 实测 **46,646 star / 4,327 fork / 约 403 名贡献者 / pushed 2026-11-12** ✅。贡献榜前列 congqixia（1,810 commits）、JinHai-CN（1,110）、bigsheeper（1,098）均为 Zilliz 雇员背景 ✅——「开源主创作者与商业公司重合」是明牌而非猜测。LF AI & Data 口径：TechCrunch 2022-08 稿称 Milvus 已是基金会 "top-level project" ✅（毕业精确月份未核 🔍）；流通的「2019 年被 LF AI 接纳为孵化项目」本会话未取得一手源，仅 org 创建时间可作旁证 ⚠️。

**产品版本史是一条清晰的能力扩围线**：Milvus 2.3（2023-03，首次支持 NVIDIA GPU）→ 2.4（2024-04，DBTA 标题 "Advances the Field of Vector Databases with GPUs"；CAGRA 为其 GPU-ANN 索引路线 ⚠️ 未逐字核）→ 2.5（2024-12，向量 + 关键词混合检索/BM25，官方口径 "30x Faster" ⚠️ 未独立验证）→ 2.6（2025-06，Woodpecker 磁盘化 WAL 免 Kafka、冷热分层、向量压缩、内建 streaming node）✅ → **3.0（2026-08-01 官宣 "Lake-Native"**，实测 3.x 线最新 v3.0.6 2026-11-11，与 2.6.x 双线发版）✅。3.0 特性（官方博客，作者系前 Elasticsearch 员工）：BM25 与向量同一 schema、RRF 融合进内核、服务端聚合、多级重排（3.0.1）、RaBitQ 1-bit 量化 ✅。商业面 Zilliz Cloud：2022-11 GA → BYOC 强化（2025-02）→ 按需算力定价（2026-05）→ Loon lake-native 向量存储引擎（2026-06-29）✅。

**商业化叙事两段转向**：访谈口径私有引擎 Cardinal "3x the performance of open-source Milvus and 10x over competitors" ⚠️ 公司自述未独立验证。2023 年蹭 RAG 热点（营销标题 "[aims to cure AI hallucinations](https://insidebigdata.com/2023/04/12/latest-version-of-zilliz-cloud-aims-to-cure-ai-hallucinations/)"，2023-04；2023-06 推免费层）→ 2025-2026 转向 agentic：context engineering 博文线、**Zilliz CLI + Zilliz Skill/Milvus Skill（2026-04-01，经 skills 协议面向 Claude Code、Cursor、Codex、Copilot）+ Claude Code 插件（14 个 skills，`/zilliz:quickstart` 等）** ✅，口号 "No console. No context switching."；2026-06-10 发布 **Vector Lakebase**（"Unified Data Platform for AI"），品类命名权从 vector database 移向 lakebase ✅。

**品类之争的四强与反方硬数据**：Pinecone——2022-08 时 PitchBook 估值 $168M（TechCrunch 同稿）✅；流通口径 2023-04 融 $100M、估值 $750M ⚠️ 本会话未核到一手源 🔍；2026 年动作密集：Nexus agentic GA（2026-08-06）、全文检索 GA（2026-09-09）、**pg_pinecone 开源 Postgres 检索**（2026-10-27）✅ 官网。Qdrant/Weaviate/Chroma 的融资收入口径未核 🔍；可核事实是 Zilliz（2026-10-28 发 Chroma→Zilliz 迁移指南）与 Pinecone（2026-10-26 同题指南）同月互挖轻量用户 ✅。反方论点的硬数据：[pgvector](https://github.com/pgvector/pgvector)（实测 23,654 star）CHANGELOG **v0.5.0（2023-08-28）引入 HNSW** 后高频发版（v0.7.0 2024-04-29、v0.8.0 2024-10-30、v0.8.7 2026-10-01）✅——「通用数据库附加向量能力」的时间线实体。

**反方观点与证据缺口**：「专用向量库被通用库吞并论」有两个证词级细节需要同时摆出：其一 pgvector 上述节奏；其二 Elasticsearch 9.5 的 RRF 被许可墙锁在 Platinum 档（Zilliz 博客实测基础许可下 "returns a 403"）——商业许可反而成了通用库的软肋，但该文作者为 Zilliz 员工且自认 "This isn't a benchmark" ⚠️。中国故事缺口最大：与阿里云的投资/竞购传闻未核到任何一手源 🔍（可核的投资方为 Prosperity7、Pavilion Capital（淡马锡）、Hillhouse、5Y、云启资本——TechCrunch ✅）；收入、估值、员工数零披露 🔍；本卡检索受 WebSearch 限流（重置 2026-12-02）与 DDG/Bing/Mojeek 反爬拦截限制，中文渠道全线未触达 🔍。

## 怎么看

1. **「先公司后开源」是被流通叙事遮蔽的关键结构。** 官网 2017 成立、2019-10 才开源 v0.5.0——Milvus 不是社区项目长出公司，而是公司孵化开源资产（TechCrunch：上海起家图工程师红利与数据体量、"global from day one"）。这与 Databricks 同构，也解释了「LF AI 托管 + 创始人任两任基金会主席」的治理组合：开源中立性与商业控制权同时握在手里。
2. **人名证伪是本卡的方法论样本。** 流通的「星绍辉」无任何官方佐证，最接近的事实是 TechCrunch 记录的绰号 "Starlord"（星爵）；「齐侠忠」同样无一手源。可核链为 unite.ai 访谈（Oracle 12c Multitenant 创始成员、LF AI & Data 主席 2020-2021）+ LinkedIn handle chaoxie。中文社区把绰号当本名的转写讹传路径，值得台内所有「中文名 + 英文名」双口径条目引以为鉴。
3. **品类之争三阶段在 Zilliz 身上完整走完：定义品类 → 吸收对手 → 重新划品类。** 2021-2023 专用向量库定义期；2024-2025 用 2.5 混合检索（BM25）承认纯向量不够、用 2.6 降本对冲通用库；2026 年 3.0 直言 "covers both keyword and vector search well enough to replace the two-engine setup"（打 Elasticsearch），Lakebase 命名把战场从 DB 换到数据平台——对标的预算池变成 Databricks/Snowflake。反方证据同样硬：pgvector v0.5.0（2023-08-28）起三年十余个版本、23.6k star，「通用库附加能力」成立；但 Pinecone 自己发 pg_pinecone（2026-10-27）说明纯玩家也在向 Postgres 靠——品类边界在双向渗透，而非单向吞并。
4. **agentic 转向的具体形态是「把数据库操作面交给 coding agent」。** CLI + Skill + Claude Code 插件三层栈（2026-04）对着四大 coding agent 交付，"No console. No context switching."——数据库厂商的 UI 投资正在让位于 agent 可调用的接口面；与 Pinecone Nexus（2026-08 GA）同向：RAG→agent 知识/记忆层叙事在两强处均已产品化而非停留在 PPT。Zilliz 的差异化押注在 Lakebase 品类名 + 开源基本盘，Pinecone 押在闭源托管 + agent 检索层。
5. **证据缺口显式登记（补全任一项即可升级对应段落）**：① 2023-04 Pinecone $100M/$750M 一手源；② Qdrant/Weaviate/Chroma 融资收入口径；③ Zilliz 收入/估值/员工数；④ 与阿里云投资或竞购传闻的一手源；⑤ 创始人中文名（chaoxie 的汉字写法）；⑥ LF AI 接纳（2019）与毕业（2022）精确月份；⑦ Cardinal「3x/10x」性能口径独立验证；⑧ Milvus 2.4 CAGRA 字样的一手发布稿。
6. **台内观察价值：它是「开源基础设施商业化」的最干净样本之一**——单一开源项目（46.6k star，约为 pgvector 23.6k 的两倍）+ 托管云 + 品类命名权三层齐备；与 [[开发者工具/快猫星云]]（夜莺同构路径、star 1.3 万量级）构成中美开源商业化的规模对照，「品类命名权」打法是 [[交付与组织/神州数码]] 渠道打法之外的第二种中国背景基础设施出海样本。

## 关键锚点

- **2026-11-11** · Milvus v3.0.6 发布，3.x 与 2.6.x 双线发版 ✅
- **2026-10-28** · 博客发「Migrating from Chroma to Zilliz Cloud」✅
- **2026-08-01** · 官宣 Milvus 3.0：Lake-Native ✅
- **2026-06-10** · 发布 Vector Lakebase ✅

## 下钻

- [证据时间线（原始线索卡）](../../证据层/开发者工具/Zilliz.md)
- [开发者工具/快猫星云](../../证据层/开发者工具/快猫星云.md)
- [智能体平台/ClaudeAgentSDK](../../证据层/智能体平台/ClaudeAgentSDK.md)
- [智能体平台/MCP协议](../../证据层/智能体平台/MCP协议.md)
- [智能体平台/Agent框架](../../证据层/智能体平台/Agent框架.md)
- [推理与基础设施/vLLM与推理引擎](../../证据层/推理与基础设施/vLLM与推理引擎.md)
- [交付与组织/神州数码](../../证据层/交付与组织/神州数码.md)
