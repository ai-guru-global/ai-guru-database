---
层: 01-算力与硬件层
节点: 07-数据中心与集群
类型: 学习页
状态: 活跃
更新: 2026-11-11
证据: 证据层/推理与基础设施/Nutanix.md
---

# Nutanix

> 超融合（HCI）品类的发明者与「软件优先」转型的教科书样本：FY2026 订阅收入占总营收 95%（FY2024 94%→FY2026 95% ✅ 10-K）、自身不持有硬件库存，靠 Cisco/Dell/HPE/Lenovo 等 OEM 出货软件 royalty；FY2026 营收 28.54 亿美元（+12%）、ARR 25.5 亿（+16%）、自由现金流 8.41 亿 ✅。Broadcom 收购 VMware（2023-11）后的替代窗口是其近三年最大顺风，10-K 原文自认「扩大份额的机会已经变大」，管理层称迁移潮「稳定攀升、约持续五年」⚠️ 媒体口径。

## 是什么

**Nutanix, Inc.**（纳斯达克 NTNX，官网 [nutanix.com](https://www.nutanix.com/) ✅）2009 年 9 月注册于特拉华州、总部加州 San Jose ✅ [FY2026 10-K](https://www.sec.gov/Archives/edgar/data/1618732/000119312526394793/ntnx-20260731.htm)。截至 2026-07-31：全球约 8,350 名员工（62% 在美国之外）、超过 32,000 家终端客户 ✅ 10-K。商业模式的关键一句话：只卖软件（含支持订阅），**不持有硬件或部件库存** ✅ 10-K——超融合的「一体机」由 Cisco、Dell、Fujitsu、HPE、Lenovo 五家 OEM 以 Cisco Compute HCI / Dell XC / Fujitsu XF / HPE DX / Lenovo Converged HX 等形态出货 ✅，「数家竞争对手同时也是它的伙伴、分销商或 OEM」。

**沿革与品类发明**：Dheeraj Pandey 等 2009 年创立，**2011 年 10 月开始销售初版 Nutanix 操作系统**（在 VMware 环境上以软件定义方式提供块存储——招股书自述「率先开创了超融合基础架构」）✅ [424B4 招股书](https://www.sec.gov/Archives/edgar/data/1618732/000119312516727084/d937439d424b4.htm)；「2013 起家」是常见误记——2013 年是 Prism 管理界面、去重/压缩与 Hyper-V/KVM 支持的版本年，2015 年改名为 Acropolis 并推出自研 hypervisor AHV ✅ 424B4。IPO 于 2016-09-30 以 16.00 美元/股发行、净筹资约 2.154 亿美元 ✅ 424B4。

**订阅转型是这条线索的成人礼**：2017-03-02 Q2 FY17 财报（营收 1.822 亿、+77%，但 GAAP 净亏 9,320 万、递延收入 4.206 亿 +128%）披露转向订阅与「替代消费模式」，增长口径被打乱 ✅ [8-K 附录](https://www.sec.gov/Archives/edgar/data/1618732/000115752317000706/a51519313ex99_1.htm)；同期做空报告的具体发布方与日期 🔍 本会话搜索受限未能核验（维基/新闻源不可达）。转型后遗症以两起证券集体诉讼呈现（2019-02、2023-03 提起，均已了结）✅ 10-K。财务终局成立：订阅收入占比 94%→95%→95%（FY2024–2026）✅ 10-K——「95%+」的说法应以 95% 为准。

**FY2026 财报（财年 7 月底截止，2026-08-26 发布）**：全年营收 28.54 亿美元（+12%）、GAAP 毛利率 86.8%/非 GAAP 88.0%、GAAP 营业利润率 9.6%/非 GAAP 23.7%、经营现金流 9.17 亿、自由现金流 8.41 亿（上年 7.50 亿）✅ [Q4 FY26 8-K 附录](https://www.sec.gov/Archives/edgar/data/1618732/000117184326005752/exh_991.htm)；ARR 25.5 亿美元（+16%）✅，注意公司自 Q1 FY26 起**更新了 ARR 计算口径并重述历史值** ⚠️ 财报脚注；全年新增客户 3,000+ ✅。FY2027 指引：营收 31.80–32.30 亿、非 GAAP 营业利润率 24–25%、FCF 8.5–9.5 亿 ✅；Q1 FY27（2026-11-12 时点尚未发布）指引营收 7.55–7.65 亿 ✅。地区拆分：美国 15.30 亿（约 54%）、EMEA 8.31 亿、APAC 4.18 亿（约 15%）✅ 10-K，除美国外无单一国家占比超 10%。

**AI 承载是第二叙事曲线**：产品矩阵已从「跑虚机的超融合」扩到 **Nutanix Enterprise AI（NAI）**——10-K 定义为「在 CNCF Kubernetes 上跨公有云/数据中心/边缘/neocloud/OEM 平台（Cisco、Dell、Supermicro）做私有推理」、含模型路由与 token 级限流 ✅ 10-K；NAI 2.8 已 GA，带 MCP 网关（Agent Gateway）做 agent 访问治理与 token 配额，私有推理支持 LoRA 微调（<8B）、张量并行与投机解码（宣称最高 2.5x token 生成加速）✅ [SiliconANGLE](https://siliconangle.com/2026/08/26/nutanix-expands-cloud-platform-with-controls-for-agentic-ai/)；NKP Metal 把平台延伸到裸金属 Kubernetes ✅；2026-10-02 收购法国 Ryax Technologies，把 GPU 利用率与智能调度并入 NKP/NAI ✅ [StorageNewsletter](https://www.storagenewsletter.com/2026/10/02/nutanix-acquires-ryax-technologies-to-help-customers-accelerate-agentic-ai-initiatives/)。CEO Ramaswami 的框架：GPU 之于今天≈虚拟化之前的 CPU，「每 token 成本」是客户对话里的核心经济学 ⚠️ theCUBE 访谈口径；公司自建约 2,000 万美元 GPU 集群跑开源权重模型，预计覆盖内部 AI 需求至 80% ⚠️ SiliconANGLE。针对 NPU 的具体型号支持公告 🔍 未核到一手源，10-K/新闻稿口径均为 GPU/加速计算。

**中国与竞争**：与联想的 OEM（Lenovo Converged HX）早在招股书时代即已存在（当时 OEM 为 Dell 与 Lenovo）✅ 424B4，FY26 又与 AMD、Lenovo、NetApp、NVIDIA 签新/增强协议 ✅ 8-K；中文媒体称 Nutanix（路坦力）已将中国大陆销售与部分维保交由联想负责 ⚠️ 必应搜索摘要，[原文页](https://zhuanlan.zhihu.com/p/5098675677)反爬未能直接核验 🔍。中国超融合软件市场被华为、新华三、深信服、浪潮、SmartX 五个国产品牌把持（IDC 2021Q4 口径，SmartX 转述 ⚠️ 厂商口径，[对比文](https://www.doit.com.cn/p/490014.html)），SmartX 亦公开提供 Nutanix→SMTX OS 迁移指南 ⚠️ [厂商博客](https://www.smartx.com/blog/2024/09/nutanix-migration-guide/)；Nutanix 在中国的权威份额口径 🔍 缺失。竞争面：10-K 点名 VMware by Broadcom、Microsoft、Red Hat（软件）、AWS/Google/Oracle/Azure（云）、Dell、Everpure、Fujitsu、HPE、Hitachi Vantara、Lenovo、NetApp、**华为**（系统）✅。

**VMware 替代窗口与硬件挤压是 FY26 的一体两面**：10-K 原文「我们认为自 Broadcom 于 2023 年 11 月收购 VMware 以来，我们扩大市场份额的机会已经变大」——Broadcom 改动了 VMware 产品组合、定价、伙伴与认证体系，客户正在评估替代品，但多年期合同、刷新周期与服务器供应都在拖慢转化 ✅ 10-K；管理层称迁移活动「稳定且在攀升」、约持续五年，主要障碍是客户惯性而非技术 ⚠️ [SiliconANGLE 财报报道](https://siliconangle.com/2026/08/26/nutanix-tops-estimates-as-external-storage-growth-helps-counter-hardware-squeeze/)。同期服务器涨价、交期拉长（「硬件挤压」）迫使更多合同用远期起始日确认收入 ⚠️ 同上；对冲动作是外置存储集成（Dell PowerFlex/PowerStore、Everpure FlashArray 已上线，NetApp ONTAP 限量可用、Lenovo ThinkSystem 已宣布）✅ 10-K——让客户带着旧存储上船，管理层称该线已贡献多笔七位数 ACV 合同 ⚠️。

## 怎么看

1. **「软件优先」的会计真相：royalty 模式成立，但逃不开硬件周期。** 订阅占 95%、GAAP 毛利率 86.8%、不持硬件库存——这是软件公司的损益表；可客户要买服务器才能跑它：FY26 末的「硬件挤压」（服务器涨价 + 交期拉长）直接把合同推成远期起始日 ⚠️。它不是纯软件故事，是「软件损益表 × 硬件交付周期」的混合体，Q1 FY27（2026 年 12 月初披露）的营收落在指引（7.55–7.65 亿）的下沿还是上沿，是检验这种耦合的第一个数据点。
2. **VMware 替代窗口是五年期的结构性顺风，不是一次性脉冲。** 管理层口径「稳定攀升、约持续五年」⚠️，10-K 同时自己列出了减速项：多年期合同、刷新周期、预算与服务器供应 ✅。这意味着对它的建模不该用「事件驱动」，而该用「五年续约率重定价」——每年 VMware 续约季的转化率才是核心变量，营收 +12~16% 的平稳增速正是窗口被周期摊薄的样子。
3. **AI 承载的真对位是「推理与 agent 的治理层」，不是训练。** 它讲的 GPU 利用率/每 token 成本/agent 配额（NAI 2.8、MCP 网关、Ryax 调度）本质是把 HCI 的「把分散资源池化」基因重述到推理经济学 ⚠️；这与 [[推理与基础设施/vLLM与推理引擎]]、[[推理与基础设施/Groq与推理专用芯片]] 所在的「算力效率」层互为上下游。大模型训练所需的 RDMA 级网络与单一大规模存储域并非超融合架构所长——公司自己也没往训练叙事上靠。NPU 支持的具体公告 🔍 未核到，勿引用「NPU 超融合」作为已验证卖点。
4. **中国叙事=联想渠道里的软件 royalty，天花板由国产五强决定。** 中国大陆销售与维保交联想 ⚠️ 摘要口径待核，等于退出一线品牌竞争、转为 OEM 抽成；而 IDC 2021Q4 口径下中国超融合软件市场由华为、新华三、深信服、浪潮、SmartX 把持 ⚠️ 厂商转述。对位差异清楚：Nutanix 卖全球统一软件栈，SmartX/深信服卖本地化一体机 + 信创节点——信创采购制度性排除它，中国市场对它是现金流项而非增长项（APAC 仅占营收约 15% ✅）。
5. **反方观点要记账：天花板、bundle 压力与口径纪律三条都有实据。** ① HCI 增量让位于 AI factory/neocloud（公司自己在 .NEXT 2026 卖 Service Provider Central 给 neocloud ⚠️，等于承认企业虚机市场不再是主战场）；② 10-K 承认竞争对手正在用「agentic AI 与 AI factory」打包 bundle 反制 ✅，Broadcom、Dell、华为都有更全的硬软件组合；③ 口径纪律：ARR 方法论 2026 年内更新并重述历史 ⚠️、2017 做空疑云 🔍 与两起已了结集体诉讼 ✅——引用其 ARR/ACV 时必须带时点与口径。
6. **台内观察价值：它是「软件定义基础设施 royalty 化」的最纯样本。** 芯片厂商（AMD 股权绑定）、OEM（五家服务器厂）、存储大厂（Everpure/NetApp 外置存储集成）都在向它的控制平面付费——与 [[推理与基础设施/浪潮信息]]（硬件载体的中国对照）、[[推理与基础设施/华为昇腾]]（整机+自有软件栈的封闭对位）、[[推理与基础设施/主权AI]]（管理层点名的主权化机会 ⚠️）互为印证。跟踪三个硬指标：Q1 FY27 是否兑现指引、外置存储「七位数 ACV」是否扩大为可披露口径、VMware 迁移转化率的任何管理层量化。

## 关键锚点

- **2026-10-02** · [Nutanix Acquires Ryax Technologies](https://www.storagenewsletter.com/2026/10/02/nutanix-acquires-ryax-technologies-to-help-customers-accelerate-agentic-ai-initiatives/) ✅
- **2026-09-18** · FY2026 10-K 递交 ✅
- **2026-08-26** · [Q4 与 FY2026 财报](https://www.sec.gov/Archives/edgar/data/1618732/000117184326005752/exh_991.htm) ✅
- **2026-04-09** · .NEXT 2026：Agentic AI 全栈平台与 NKP Metal ✅

## 下钻

- [证据时间线（原始线索卡）](../../证据层/推理与基础设施/Nutanix.md)
- [推理与基础设施/浪潮信息](../../证据层/推理与基础设施/浪潮信息.md)
- [推理与基础设施/华为昇腾](../../证据层/推理与基础设施/华为昇腾.md)
- [推理与基础设施/AI芯片竞争](../../证据层/推理与基础设施/AI芯片竞争.md)
- [推理与基础设施/主权AI](../../证据层/推理与基础设施/主权AI.md)
- [推理与基础设施/vLLM与推理引擎](../../证据层/推理与基础设施/vLLM与推理引擎.md)
