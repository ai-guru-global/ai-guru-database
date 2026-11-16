---
层: 02-数据与模型层
节点: 04-开源权重生态
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/开源模型与生态/Apache软件基金会.md
---

# Apache软件基金会

> 开源许可治理的中立托管方：1999-06 注册的美国 501(c)(3)（Tax ID 47-0825376 ✅ 官网），志愿者为主体维护 231 个顶级项目 PMC（Whimsy 官方数据实测，2026-11-12）；Apache 2.0 凭「明示专利授予 + 商标排除」成为开放权重模型的事实标准许可，但大模型几乎全部「借许可证、不进治理」——权重托管在 Hugging Face，发布不经 PMC 与孵化器；2026 年 ASF 以 Responsible AI Initiative（$10M/3+ 年）与 Sourcelume（数据集出处元数据规范）重新卡位 AI 时代的「许可完整性」管道，而非模型托管。

## 是什么

**Apache 软件基金会（ASF）**是美国注册的 501(c)(3) 非营利会员制法人，官网自述使命「Software for the Public Good」、组织原则「community over code」✅ [apache.org/foundation](https://www.apache.org/foundation/)。官方史页口径：1995-02 由 8 名开发者（Apache Group）以邮件协作 NCSA httpd 补丁起家（"a 'patchy' server" 双关被官方史页记为「讹传成传奇」），**1999-06 完成法人 incorporation** ✅ [history](https://www.apache.org/history/)；常被引用的「1999-03-25 注册」具体日期未见于本次抓取的官方页面 🔍。运营形态极轻：无办公楼（「唯一的物理存在是技术基础设施」）、除少数外包合同工外无人从基金会领薪 ✅ [how-it-works](https://www.apache.org/foundation/how-it-works.html)、史页自述开销 ≤10% ✅。**规模口径需辨析**：官方页面只说「hundreds of projects」，台内常引的「350+ 顶级项目」未在本次抓取的官方页面出现 🔍；可核一手口径为 Whimsy 治理数据 **231 个 PMC**（2026-11-12）✅ + 孵化器在孵 podling 24 个（2026-11-12）✅，引用以这两个数为准。

**治理范式（Apache Way）是它的核心资产**：英才制阶梯 user→developer→committer（签 CLA）→PMC 成员→PMC 主席→ASF Member，身份（"hats"）授予个人而**不随雇佣关系走**——供应商中立的结构性保障 ✅；董事会固定 9 人、每年由会员改选 ✅；项目由 PMC 治理、主席由董事会任命并兼任基金会 VP，PMC 首要职能不是写码而是法律监督与「每个 release 都是社区整体产物」的程序把关 ✅；决策走 lazy consensus + +1/0/-1 投票，投 -1 必须附替代方案或详细理由 ✅；六条 Apache Way 原则收尾于「security as a mandatory feature」，并明文要求项目「独立于不当商业影响自治」✅。孵化器（2002-10-16 董事会决议设立 ✅ [Incubator](https://incubator.apache.org/)）不按技术优劣筛项目，只筛「能否长成英才制社区」：要求可运行代码基座 + IP 授权给 ASF + 导师，平均孵化约 1.5 年，官方口径截至 2023-04 累计 335 个 podling、毕业 239 个 ✅。

**Apache 2.0（2004-01）的条款结构是为「商业友好 + 专利安全」设计的** ✅ [全文](https://www.apache.org/licenses/LICENSE-2.0)：第 2/3 条分别授予**永续、全球、免费、不可撤销**的版权与专利许可；第 3 条专利授予范围限于「贡献本身必然侵权的专利主张」，并内嵌**专利诉讼终止条款**（起诉 Work 侵权即终止专利许可）；第 6 条**明确排除商标授权**——代码随便商用，品牌归基金会。这使它成为非 ASF 项目的默认底版许可：官方史页明说「无数非 ASF 软件以 Apache License 分发」✅。**LLVM 厘清**：LLVM 不是 ASF 项目（独立基金会治理 ⚠️），其官方 LICENSE.txt 自述「Apache License v2.0 with LLVM Exceptions」✅ [llvm.org](https://llvm.org/LICENSE.txt)——Apache 2.0 的影响力溢出 ASF 托管边界，但「用 Apache 2.0」≠「ASF 托管」。

**AI 时代它最响亮的角色是「许可供给方」而非「托管方」**。开放权重模型族普遍选用 Apache 2.0（Mistral 多数模型 ⚠️、Qwen2/2.5 起全族见 [[开源模型与生态/Qwen]]），选它正是选条款结构：明示专利授予（MIT 无明示专利条款）、OSD 兼容、企业法务通过率高；而托管环节几乎全部落在 [[开源模型与生态/HuggingFace]]——权重不是许可证定义的「Source form」（首选修改形式、软件源代码，条款为代码设计 ⚠️ 推析），发布投票/PMC 监督/社区多样性要求与模型实验室周级发版节奏错配，ASF 也没有 Hub 型权重分发基础设施。反之 ASF 自己的重量级 ML 项目是反面教材：**MXNet**（曾获 AWS 2016 年背书 ⚠️ 二手口径）2022-09 升 TLP、2023-09 退役、2024-02 移入 Attic ✅ [Attic](https://attic.apache.org/projects/mxnet.html)；TVM、Mahout 仍在 231 个 PMC 名单内但已边缘 ✅ Whimsy 口径。

**资金模式是「赞助 + 志愿者经济」**：企业赞助四档 Bronze $6k / Silver $25k / Gold $50k / Platinum $125k 每年，实物抵充不超过 25% ✅ [sponsorship](https://www.apache.org/foundation/sponsorship.html)；「无商标商业化」是中立的代价与机制——品牌归基金会，商业公司只能做代码与服务生意、不做品牌生意 ✅ 条款 6 + 史页「保护 Apache 品牌不被滥用」。2026 年起资金叙事明显转向 AI：**Responsible AI Initiative（RAI）2026-04 启动、3 年以上 $10M 资金目标** ✅，2026-10 博文披露其经 Anthropic Project Glasswing 通道三天扫完 75 个 PMC / 230 个仓库的安全扫描 ✅ [RAI 博文](https://blogs.apache.org/foundation/entry/what-the-asf-responsible-ai-initiative-has-built-so-far)；更早的 ASF Tooling Initiative 2025-03 上线 ✅。

**AI 时代的第二落点是「许可完整性管道」**：2026-11-10 博文介绍 **Apache Sourcelume** ✅ [博文](https://blogs.apache.org/foundation/entry/tiny-model-full-provenance-where-apache-sourcelume-is-and-where-it-is-)——数据集出处/保管链/许可的 JSON-LD 元数据规范 + 基于 Apache Atlas 的注册表，自述「不是认证机构、是管道」，并转引「2024 年审计发现主流数据集托管站点许可缺失率超 70%」（第三方审计 ⚠️）。这与 OSI 的 OSAID 1.0 ✅ [开源 AI 定义](https://opensource.org/ai/open-source-ai-definition)（要求 Data Information + Code + Parameters 三件套）构成分工：OSI 管定义、ASF 管可验证的出处记录，都切中同一痛点——模型「开源」声明的不可核验性；许可光谱另一端是自定义条款阵营（Llama Community License、Gemma Terms ⚠️，见 [[开源模型与生态/Llama]]、[[开源模型与生态/谷歌Gemma]]）与 MIT 极简阵营（DeepSeek，见 [[开源模型与生态/DeepSeek]]）。

**治理事件与证伪记录**：①**Log4Shell（CVE-2021-44228，CVSS 10.0）**是 ASF 历史最大安全事件，官方安全页 Credits 明确写「This issue was discovered by Chen Zhaojun of Alibaba Cloud Security Team」✅ [log4j security](https://logging.apache.org/log4j/2.x/security.html)；阿里云因通报时序遭工信部暂停合作的后续 ⚠️ 🔍 未核一手。②2021-04 多家安全媒体报道 ASF 基础设施遭入侵、官方称未发现源代码被篡改 ⚠️ 🔍 本次检索受限（搜索限流、安全媒体反爬）未获一手源；**台内线索提到「2021-09-24 ASF 服务被中国穿透攻击」——未找到任何日期/定性匹配的公开披露，日期与归因均无源可考，引用前必须证伪 🔍**。③2021-Q3 起 ASF 下载镜像体系切换为全球 CDN ✅ 史页。

## 怎么看

1. **供应商中立不是文化口号，是三层机制的叠加。** ①"hats not employers"——一切身份授予个人、与雇佣脱钩 ✅；②商标集中——Apache 2.0 第 6 条排除商标授权、品牌归基金会 ✅，商业公司只能做代码与服务生意；③PMC 程序监督（release 投票、法律把关）✅。三层缺一，中立就退化为某家厂商的治理剧场——这是 ASF 区别于「公司主导开源」的结构性资产，也是它卖「信誉」的资本。
2. **「借许可证、不进治理」是 AI 开源的结构性分裂，也是本卡最重要的观察框架。** 大模型选 Apache 2.0 是选条款（专利授予 + OSD 兼容），不是选治理：权重发布不经 PMC 投票、不进孵化器、不承担社区多样性义务，托管全部落在 [[开源模型与生态/HuggingFace]]。结果是「治理真空」的开放权重生态——模型卡与许可文本替代了 release 程序与社区监督，「开源」声明的可核验性崩塌（Sourcelume 转引的许可缺失率 >70% 是症状 ⚠️）。由此理解 OSI OSAID（定义层）与 ASF RAI/Sourcelume（验证层）为何都在补同一块板。
3. **大模型不进孵化器有四个硬约束**：①孵化器明文筛「英才制社区的多样性」，单一公司实验室天然不合格 ✅；②平均 1.5 年孵化周期 vs 实验室周级/月级发版 ✅；③IP 授权给 ASF + CLA 体系 vs 实验室保留许可控制权；④ASF 发行渠道是代码发布 CDN，没有权重托管基础设施。有意思的是代码类项目的镜像现象：当前 24 个在孵 podling 中 Seata、BifroMQ、GeaFlow、Amoro、Pegasus、OzHera 等多个源自中国公司捐赠（⚠️ 二手口径，官网仅列项目名 ✅）——代码类走 ASF、权重类走 HF 的分岔，在中国生态同样成立。
4. **MXNet 是「ASF 托管 ≠ 生态位保证」的完整案例**：AWS 2016 年背书（⚠️ 二手）→ TLP 2022-09 → 退役 2023-09 → Attic 2024-02 ✅ 官方口径。它证明基金会托管能提供法律与流程保护，不能提供社区与路线图活力；对照 Spark/Flink——同在 ASF 的大数据/AI 基础设施活得很好，差别不在基金会而在社区构成。「MXNet 之后无新的重量级 ML 框架在 ASF 孵化成功」是这条线索的反方记录，也是「ASF 对 AI 重量级项目吸引力下降」的具体化 🔍（趋势判断，待更多样本）。
5. **资金结构决定它只能做「中立仲裁者 + 管道」，做不了平台。** 赞助四档 $6k–$125k/年 vs 大厂 AI 预算量级悬殊，志愿者经济撑不起权重托管与算力账单；RAI 的 $10M/3+ 年是历史级募资，仍远小于一个 Hub 的运营成本 ✅——所以 ASF 的 AI 卡位必然落在元数据规范（Sourcelume）、安全扫描（Glasswing 75/231 PMC 起步）、许可完整性这类管道层 ✅。这是约束条件下的最优解，也划定了观察边界：不要期待「Apache Hub」。
6. **台内观察价值：开源许可治理主线的锚机构，三个跟踪点。** 许可光谱对照见 [[开源模型与生态/Llama]]（自定义限制端）、[[开源模型与生态/Qwen]]（Apache 2.0 端）、[[开源模型与生态/DeepSeek]]（MIT 端：放弃明示专利条款换极简）。跟踪：①RAI 募资进度与 Glasswing 扫描覆盖率（75/231 PMC 起步）；②Sourcelume 规范能否被 HF/ModelScope 等托管方采纳（元数据卡位之争）；③是否出现首个模型权重类 podling——打破「借许可证不进治理」的标志性事件 🔍。

## 关键锚点

- **2026-11-10** · [Apache Sourcelume 定位与路线博文](https://blogs.apache.org/foundation/entry/tiny-model-full-provenance-where-apache-sourcelume-is-and-where-it-is-) ✅
- **2026-10-06** · [RAI 进展博文](https://blogs.apache.org/foundation/entry/what-the-asf-responsible-ai-initiative-has-built-so-far) ✅
- **2026-04** · Responsible AI Initiative 启动 ✅
- **2025-03** · ASF Tooling Initiative 上线 ✅

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/开源模型与生态/Apache软件基金会.md)
- [开源模型与生态/HuggingFace](../../../证据层/开源模型与生态/HuggingFace.md)
- [开源模型与生态/Llama](../../../证据层/开源模型与生态/Llama.md)
- [开源模型与生态/Qwen](../../../证据层/开源模型与生态/Qwen.md)
- [开源模型与生态/DeepSeek](../../../证据层/开源模型与生态/DeepSeek.md)
- [开源模型与生态/谷歌Gemma](../../../证据层/开源模型与生态/谷歌Gemma.md)
