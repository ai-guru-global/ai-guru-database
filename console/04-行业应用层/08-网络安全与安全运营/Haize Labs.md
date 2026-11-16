---
层: 04-行业应用层
节点: 08-网络安全与安全运营
类型: 学习页
状态: 观察中
更新: 2026-11-11
证据: 证据层/AI安全与对齐/Haize Labs.md
---

# Haize Labs

> AI 红队自动化评测创业公司（纽约）：以越狱发现起家，2024-12 起产品重心迁向 LLM-as-a-judge/RLHF 基建。产品史在 GitHub 上逐条可核（2023-07 组织创建 → 2024 越狱披露三连 → Verdict → 2025-2026 judge 基建五连），商业面（融资/客户/主产品「hal」）本会话一个数都未核到——「开源足迹厚、商业足迹薄」是本卡的证据结构，「观察中」状态由此而来。

## 是什么

**Haize Labs**（官网 [haizelabs.com](https://www.haizelabs.com/)，2026-11-12 实测为 Cloudflare 反爬 + JS 渲染，正文未取得 🔍）是一家 AI 红队与评测自动化创业公司。GitHub 组织自述 "build ai systems you can trust."（组织创建于 2023-07-29 ✅ GitHub API 实测）；官网的搜索引擎索引快照定位语为 "helps ambitious enterprises accelerate their AI initiatives out of POC and into production" ⚠️ cn.bing 快照口径——话术重心已从对抗性红队偏向企业 AI 生产化评测。

**起源与团队**：Leonard Tang 为联合创始人 ✅（Weaviate Podcast #121 主持人介绍口径，2025-05-12）；其 GitHub（leonardtang）bio 直挂 @haizelabs、定位纽约 ✅。「哈佛系辍学年轻团队」是流通叙事，但本会话未能核到一手源 🔍；流通中的其他联创姓名各说法互相冲突，全部不采信 🔍。可核的团队第二成员是 **Nimit Kalra**：Verdict 论文一作 + PyPI 包维护者邮箱 nimit@haizelabs.com ✅。

**学术线是这家公司的信誉底座**：arXiv 作者检索得 Leonard Tang 16 篇（2021-2026），早期为 MIT 数学研究（Drori 组），后转入安全攻防。越狱披露代表作 **Bijection Learning**（2024-10-02，与 Brian R.Y. Huang、Maximilian Li 合著）：用上下文学习教模型随机双射编码绕过安全训练，核心发现是越强的模型被绕过得越严重——存在性与结论可核 ✅，技术细节不在此复述（披露纪律）。其后 Tang 出现在 **Constitutional Classifiers**（2025-01-31）43 人作者列——该论文是 Anthropic 的安全护栏研究（Jan Leike、Jared Kaplan 等 Anthropic 系作者为主）✅；另参与 MLCommons AI Safety Benchmark v0.5（2024-04，13 类危害 × 43090 条测试提示）✅。

**产品线（开源可核部分）**：简报所称主产品「hal」与官网商业产品架构，本会话未能核到 🔍。可核的产品轨迹全在 GitHub：dspy-redteam（2024-03）→ llama3-jailbreak（2024-04-20，"Sorry Zuck!"，574 星）→ Thorn in a HaizeStack 长上下文越狱测试（2024-05）→ get-haized「haizing suite 自动发现的越狱集」（2024-06）→ **Verdict**「LLM-as-a-judge 推理时扩展」声明式框架（2024-12 建仓、2025-02 发论文、pip 可装 ✅ PyPI）→ 2025-2026 连续转向 judge/reward 基建（j1-micro 小型 reward models、annotate 从 agent 日志造 judge、TournO 用锦标赛比较产出 RLHF reward 信号）✅ GitHub API。

**商业面几乎全部待核**：融资轮次/金额/投资方、客户名单（模型厂商与政府客户口径）、收入与团队规模——本会话均未核到 🔍；流通中的 A 轮说法口径不一且无一手源，本卡不引任何数字。verdict.haizelabs.com（403）与 api.haizelabs.com（405）域名存活（2026-11-12 实测）佐证产品化基建在运行；欧盟 AI Act/美国政策推动第三方评测需求是品类常见叙事，但该公司官方合规框架背书未核到 🔍。2026 年仓库仍持续更新（TournO 最后推送 2026-05-08 ✅），公司存续与活跃可确认。

**反方观点**：① 对抗性越狱技术半衰期短，自家仓库重心 2025 年后从越狱整体迁向 judge/RLHF 基建，是品类收窄的市场信号之一（本卡推断 ⚠️）；② 评测即服务的持续性存疑——Verdict 走开源 + PyPI，能力外溢，护城河需依赖闭源平台与数据回路，未核 🔍；③ 模型厂自研红队挤压：Anthropic 以「3000+ 小时红队」为 Constitutional Classifiers 自证 ✅，第三方评测商的独立价值最终要靠监管强制力兜底；④ 2025-12-04 HN 提交转推 Bijection Learning 一作 Brian R.Y. Huang 的 X 帖「Abusive Founders at Haize Labs」，帖文正文本会话不可核，指控内容与真伪未知 🔍——对一家卖「信任」的公司，这是必须跟踪的治理变量。

## 怎么看

1. **品类卡位在「模型厂自证不可信 × 监管要求可信」的夹缝里，缝隙宽度由监管决定。** Anthropic 用 3000+ 小时红队自证（2025-01 ✅），模型厂评测基建越强，独立评测商的差异化越要压在「不受模型厂控制」一点上，其变现最终挂钩欧盟 AI Act 类强制合规——监管语境归 [[AI安全与对齐/AI监管政策]]。该公司官方是否打合规牌，未核 🔍。
2. **产品重心迁移（越狱 → judge/RLHF）是本卡最硬的一条观察，时间戳全可核。** 2024 全年做攻击面（jailbreak/长上下文/haizing suite），2024-12 起 Verdict、2025-2026 五个新仓库全部是 judge/reward/RLHF 基建。两种解读并存：对抗性红队商业化不及预期，或骑上 RL 后训练 judge 需求的顺风。无论哪种，纯「越狱发现」作为产品品类正在变窄。
3. **竞争三线：模型厂内部红队、开源红队工具、被巨头收编的护栏带。** 开源侧 NVIDIA garak 等压低工具门槛（HN Garak 讨论中 haizelabs 被并列提及 ⚠️）；护栏带 Lakera/Prompt Security/Robust Intelligence 已在 2024-2025 被网安巨头整体收编（见 [[AI安全与对齐/Robust Intelligence]]）——独立评测商的出口要么被收编要么独立长大，Haize Labs 两条都未兑现。众测平台 AI 线（HackerOne 等）未核 🔍。
4. **学术资本是小团队的真实资产，也是被收编的入口。** 创始人嵌入安全研究共同体（Anthropic 论文合作者、MLCommons 基准贡献者）是小公司撬动模型厂客户的杠杆；Robust Intelligence 的终局（学术团队→巨头产品线）提示这条路径的另一半。年轻团队深依赖创始人个人声誉，2025-12 争议指控若发酵将直接冲击核心资产（未核 🔍）。
5. **证据结构本身值得记录：开源足迹厚、商业足迹薄。** 十余个仓库时间戳构成可信产品史，但融资、客户、收入、团队规模一个未核——检索通道受限（搜索限流、主站反爬、多个域名解析污染）是原因之一，但公司在主流财经媒体可见度低本身是事实。补证最短路径：一手融资通稿或主流媒体深度报道。
6. **证据缺口显式登记（补全任一项即可升级对应段落）**：① 融资轮次/金额/投资方一手源；② 创始团队完整名单与哈佛起源核证；③「hal」产品名与官网产品架构；④ 客户名单（模型厂商/政府口径）；⑤ 2025-12 创始人争议指控原文与后续；⑥ 收入/团队规模。

## 关键锚点

- **2026-11-12** · 台内核查：GitHub/域名/arXiv 三通道实测 ✅
- **2026-03-22** · TournO 仓库创建 ✅
- **2025-12-04** · HN 提交「Abusive Founders at Haize Labs」⚠️
- **2025-05-12** · Weaviate Podcast #121：Scaling Judge-Time Compute with Leonard Tang ✅

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/AI安全与对齐/Haize Labs.md)
- [AI安全与对齐/Robust Intelligence](../../../证据层/AI安全与对齐/Robust Intelligence.md)
- [AI安全与对齐/智能体安全与攻防](../../../证据层/AI安全与对齐/智能体安全与攻防.md)
- [AI安全与对齐/AI监管政策](../../../证据层/AI安全与对齐/AI监管政策.md)
- [AI安全与对齐/对齐与可解释性研究](../../../证据层/AI安全与对齐/对齐与可解释性研究.md)
- [AI安全与对齐/Wiz](../../../证据层/AI安全与对齐/Wiz.md)
