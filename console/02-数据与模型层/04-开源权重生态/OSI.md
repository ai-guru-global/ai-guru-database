---
层: 02-数据与模型层
节点: 04-开源权重生态
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/开源模型与生态/OSI.md
---

# OSI

> Open Source 的定义者与许可审批机构（1998 年成立，加州 501(c)(3)）：OSD 十条沿用至今（v1.9，2007-03-22 定稿）、经其审批的许可证约 110 个（2026-11 抓取口径）；2024-10-28 发布 OSAID 1.0，把四自由度平移到 AI——数据信息 + 代码 + 参数三要素缺一不可，官方 FAQ 示例判 Llama2/Grok/Phi-2/Mixtral 不合规、Meta 的 700M MAU 条款是 open-washing 判定的实锚；但两年后 OSI 自认「data is the bottleneck」、鲜有模型满足数据条款，2026-11 起以 AI Salons 重新开炉。Google/AWS/Microsoft 是其 Diamond/Platinum 赞助商，被定义者供养定义者，是这条线索最值得盯的结构张力。

## 是什么

**Open Source Initiative（OSI）**是「Open Source」一词及其边界的制度化所有者：加州非营利公众公司、501(c)(3)（IRS 编号 91-2037395，2003 年获免税资格 ✅ [About](https://opensource.org/about)/[History](https://opensource.org/history)），在欧盟注册透明登记号、设 Europe Foundation ✅。核心资产两件：**OSD（Open Source Definition）**十条——自由再分发、源码可得、衍生作品、不歧视人与领域等（v1.9，2007-03-22 定稿，脱胎于 Bruce Perens 1997 年起草的 Debian 自由软件准则 ✅ [OSD](https://opensource.org/osd)）；以及**许可审批机制**——提交许可证逐条对照 OSD 审查，批准后进入官方清单，现有约 110 个（MIT、Apache-2.0、GPL-2.0/3.0、AGPL-3.0 等，2026-11 抓取 ✅ [Licenses](https://opensource.org/licenses)）。「开源不只意味着能看到源码」是 OSD 引言的原话 ✅——这条边界从 1998 年起就是行业共同语言。

**沿革**：1998-02-03「open source」一词在 Palo Alto 策略会上由 Christine Peterson 提出（Netscape 开源浏览器源码之后），同月下旬 Eric Raymond（首任主席）与 Bruce Perens（副主席）等联合创会 ✅ History。从软件许可证裁判到 AI 定义者的转折发生在 2023-06：OSI 召集董事会与 Mozilla、Creative Commons、Wikimedia、Internet Archive、Linux Foundation Europe、OSS Capital 举行首次 AI 定义会议 ✅ [Timeline](https://opensource.org/ai/timeline)。现任治理层：董事会主席 Tracy Hinds（2026-10 newsletter 称其 outgoing）、执委会含 Thierry Carrez、Chris Aniszczyk 等 ✅ [Board](https://opensource.org/board)；执行董事已换届——NTIA 回信（2024-04）署名 Stefano Maffulli ✅ [NTIA 回应](https://opensource.org/blog/osi-response-to-ntia)，2026-10 newsletter 由 Duane O'Brien 以 ED 身份署名「first months in this role」✅ [Opening New Paths](https://opensource.org/blog/opening-new-paths-for-open-source)。资金侧为企业赞助分层制：Automattic（Titanium）、MongoDB/Cisco/AWS/Google（Diamond）、Bloomberg/Microsoft/Red Hat（Platinum）、Capital One/GitHub/Sentry/Eclipse（Gold）✅ [Sponsors](https://opensource.org/sponsors)。

**OSAID（Open Source AI Definition）是 27 年来最大的一次定义扩容**：1.0 于 2024-10-28 正式发布 ✅（RC1 公告明标目标日期 2024-10-28 ✅ [RC1](https://opensource.org/blog/the-open-source-ai-definition-v-1-0-rc1-is-available-for-comments)，OSI Timeline 与 2026-11 博文均口径为在 All Things Open（Raleigh，2024-10-27~29）发布 ✅）。条文以 OECD「AI system」定义为基底 ✅，要求四自由度（use/study/modify/share），且「preferred form」被实体化为三要素：**Data Information**（足以让「有技能者构建实质等价系统」的训练数据信息，含不可共享数据的完整描述与来源）、**Code**（训练与运行全源码）、**Parameters**（权重），三者均须以 OSI 批准的 terms/licenses 提供 ✅ [OSAID 1.0](https://opensource.org/ai/open-source-ai-definition)。流程是社区共制：2024-01-12 至 2024-10-18 双周 Town Hall、多国线下工作坊，1.0 前一个月刚出 v0.0.9 草案 ✅ Timeline/RC1。

**判定口径与 open-washing 是 OSAID 的另一半**：官方 FAQ 把判定做成教学示例——**不合规**：Llama2（Meta）、Grok（X）、Phi-2（Microsoft）、Mixtral（Mistral）；**改许可即可合规**：BLOOM、Starcoder2、Falcon；**通过校验**：Pythia、OLMo、Amber、CrystalCoder、T5 ✅ [FAQ](https://opensource.org/ai/faq)。Qwen 与 DeepSeek 未被 OSI 点名判定 🔍。OSI 明言这些是「learning exercises, not certifications」且**不再逐个认证系统** ✅ FAQ——裁判权留白，判定成本转回使用者。官网把「Combat Openwashing」列为定义存在的三大理由之一 ✅ [AI](https://opensource.org/ai)；「开放权重 ≠ 开源 AI」专页论证权重单独不满足 study/modify 前置条件 ✅ [Open Weights](https://opensource.org/ai/open-weights)。最实的证据锚是 Llama 3.1 Community License（2024-07-23）：月活超 7 亿须向 Meta 单独申请（「you must request a license from Meta, which Meta may grant to you in its sole discretion」）、强制「Built with Llama」标识与命名规则、Acceptable Use Policy 约束 ✅ [许可原文](https://raw.githubusercontent.com/meta-llama/llama-models/main/models/llama3_1/LICENSE)——与 OSD「不歧视领域」直接冲突，[[开源模型与生态/Llama]] 的开放性质疑即由此展开。

**政策面是 OSI 的第二战场**：致 NTIA 意见书（2024-03-27）主张美国联邦「最大程度鼓励 Open Source AI」，引 OSS 生态 8.8 万亿美元估值与 OECD 定义「已用于 NIST AI RMF、并为欧盟 AI Act 提供输入」✅ NTIA 回应；与 Open Future 联名发布数据治理白皮书（2025-02-03，巴黎两日工作坊 + Sloan 基金会资助）✅ [白皮书页](https://opensource.org/data-governance-open-source-ai)；2026-09 与 CMU 主导的 OFAI（OSI 任 policy lead）联署支持美国发展更多开放模型 ✅ [OFAI 博文](https://opensource.org/blog/we-must-open-the-frontier-osi-ofai-support-calls-for-the-u-s-to-develop-more-open-models)；2026-10 参与联合国大会边会（UNGA81）谈 Open Source AI 共同语言 ✅。监管依赖定义是结构性的：欧盟 AI Act 对开源模型的义务豁免以「自由开源许可」为门槛，OSAID 正在竞争这个参照系位置 ⚠️（豁免条款与 OSI 游说角色为公开报道归纳口径，本次未逐条核对法规文本 🔍），监管语境见 [[AI安全与对齐/欧盟AI办公室]]。

**2026 年的 OSI 是「承认—重启」状态**：AI Salons 系列（Raleigh/Duke、Barcelona/Open Forum Europe + Open Knowledge Foundation，下一站巴黎 DPGA 与 FOSDEM 2027）重启 OSAID 讨论 ✅ [Salon 博文](https://opensource.org/blog/open-source-ai-salons-shaping-the-osaid-together)；OSI 自认「OSAID 应用比 OSD 难得多」「数据透明是瓶颈——鲜有模型满足数据信息要求」，并讨论开放度分级（taxonomy of openness）与机器可读元数据 ✅ 同文。背书名单覆盖企业（SUSE/Bloomberg/Intel/Mozilla/GitLab/NextCloud/Eclipse/Samsung）、学界（CMU、Princeton 的 Narayanan/Kapoor、Stanford 的 Percy Liang）、政界（Audrey Tang）与中国开源社等 ✅ [Endorsements](https://opensource.org/ai/endorsements)——但同一页面记录了保留意见：Percy Liang 与 OSB Alliance 背书同时指出隐私法下数据披露不切实际 ✅。外部反方更尖锐：Fastly（CEO Anil Dash）2024-10 发文批评 OSAID 是「用户雷区」（广泛报道口径 ⚠️ 本次未获一手源 🔍）；媒体广泛报道 Meta 方面通过政策渠道反对 OSAID、称其有利于中国竞争对手（2025 年初报道 ⚠️ 未获一手源 🔍）。OSI 的自辩同样值得记录：全量数据共享会把开源 AI 压缩成「只能用开放数据训练」的小众，OSD 亦从未要求可复现 ✅ FAQ。

## 怎么看

1. **OSI 的真实资产是「定义权 + 审批权」，OSAID 是它 27 年来第一次试图把这套权力平移到新物种。** OSD 是 10 条行为准则 + 逐案审批（约 110 个许可 ✅），OSAID 则把「preferred form」实体化为数据信息/代码/参数三要素 ✅——从「审查许可文本」变成「审查模型构成物」，裁判对象从法律文本变成工程事实，难度自认陡增（「OSAID 应用比 OSD 难得多」✅ Salon 博文）。
2. **判定权是留白的：OSI 只做教育性示例、明言不再逐个认证。** FAQ 判 Llama2/Grok/Phi-2/Mixtral 不合规 ✅，但又称这些是 learning exercises、非认证 ✅——边界清晰（Llama 700M 条款 ✅ 许可原文）而裁决稀缺，把合规判定成本转回生态：Hugging Face 上「代码用 OSI 批准许可 + 权重附带限制条款」的混搭泛滥正是这个留白的直接后果 ✅ Salon 博文；[[开源模型与生态/Qwen]]、[[开源模型与生态/DeepSeek]] 均未被 OSI 点名 🔍。
3. **数据条款是 OSAID 的战场中心，反方与自辩都值得留档。** 反方：Percy Liang/OSB Alliance 指隐私法下披露不切实际 ✅ Endorsements 页（OSI 自己记录在案）；Fastly/Anil Dash「用户雷区」批评（⚠️ 二手口径）；媒体报 Meta 游说反对（⚠️ 未获一手源 🔍）。自辩：全开放会把开源 AI 压缩成小众、OSD 从未要求可复现 ✅ FAQ。OSI 两年后的自我诊断（「data is the bottleneck」✅）等于承认 1.0 的数据门槛高于现实——2026-11 Salons 的分级化方案（taxonomy of openness）可能松动「开源/不开源」的二元结构 ⚠️（尚在讨论）。
4. **OSI 定义的实际杠杆在监管：OSAID 是在竞争「法定开源 AI」的参照系位置。** OSI 自己在 NTIA 意见书里点破：OECD 定义已支撑 NIST AI RMF 并为 EU AI Act 提供输入 ✅；欧盟 AI Act 对开源模型的义务豁免以许可证性质为门槛，谁的定义被监管引用，谁就给数百万开放权重模型定价合规成本 ⚠️ 归纳口径。监管语境与执行方见 [[AI安全与对齐/欧盟AI办公室]]；美国侧 OSI 已通过 NTIA/OFAI/UNGA81 三线铺路 ✅。
5. **治理与资金构成结构性张力：被定义者供养定义者。** Diamond/Platinum 赞助商 Google/AWS/Microsoft/Bloomberg/Red Hat ✅ 正是开放权重发布与「开源」标签的最大使用者；OSI 声明赞助不构成背书 ✅ Sponsors 页，但「反 open-washing 的裁判由 open-washing 的最大玩家供养」是这条线索必须保留的中性事实项。叠加 2026 年 ED 换届（Maffulli→O'Brien）、board chair 期满 ✅，OSAID 修订期的组织稳定性 🔍 需跟踪。
6. **台内观察价值：它是开源模型许可判定的坐标系原点。** 本台 Llama/Qwen/DeepSeek/Gemma 等卡的「开源」定性需回链此卡的 OSAID 三要素口径统一标定；跟踪三件事：FOSDEM 2027 前后的 OSAID 修订走向（v1.1 是否成文 🔍）、ModelGo/OpenMDW 等模型专用许可能否过审（首个「模型许可」获批将是定义落地的里程碑 🔍）、欧盟 AI Act 实施细则是否援引 OSAID 🔍；社区侧放大器见 [[开源模型与生态/HuggingFace]]。

## 关键锚点

- **2026-11-11** · [Salons and What's Next（成员通讯）](https://opensource.org/blog/open-source-ai-salons-and-whats-next) ✅
- **2026-11-10** · [Open Source AI Salons：Shaping the OSAID, Together](https://opensource.org/blog/open-source-ai-salons-shaping-the-osaid-together) ✅
- **2026-10-19** · 十月成员通讯：ED 换届、UNGA81、使命扩展 ✅
- **2026-10-08** · [OSI at UNGA81](https://opensource.org/blog/open-enables-a-lot-the-osi-at-unga81) ✅

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/开源模型与生态/OSI.md)
- [开源模型与生态/Llama](../../../证据层/开源模型与生态/Llama.md)
- [开源模型与生态/Qwen](../../../证据层/开源模型与生态/Qwen.md)
- [开源模型与生态/DeepSeek](../../../证据层/开源模型与生态/DeepSeek.md)
- [开源模型与生态/HuggingFace](../../../证据层/开源模型与生态/HuggingFace.md)
- [AI安全与对齐/欧盟AI办公室](../../../证据层/AI安全与对齐/欧盟AI办公室.md)
