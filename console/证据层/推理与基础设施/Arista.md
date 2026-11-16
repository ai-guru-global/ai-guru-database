---
线索: Arista
主题: 推理与基础设施
别名: [Arista Networks, ANET, 阿里斯塔]
状态: 活跃
创建: 2026-11-11
更新: 2026-11-11
关键角色: [Arista]
---

# Arista

> AI 以太网的「军火库」：云数据中心交换机头部（FY2025 营收 90.06 亿美元、+28.6%），从数据中心交换切入 AI 后端网络（Etherlink 平台 + 单一 EOS 软件栈），正面错位英伟达 InfiniBand/NVLink 垂直捆绑；Q3 2026 营收 36.58 亿（+58.5%，公司自称 IPO 以来最高增速）、Q4 指引 39–40 亿 ⇒ FY2026 隐含约 133–134 亿美元（计算口径）。大客户双头（两家占 FY2025 收入 42%）与白盒/SONiC 自研是这条线索的两面风险。

## 概述

**Arista Networks**（纽交所 ANET，总部加州 Santa Clara）是云数据中心以太网交换机头部厂商，10-K 自述使命为「让客户以最快、最可靠、最安全的方式接入所有 centers of data」✅ [FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1596532/000159653226000013/anet-20251231.htm)。人事沿革（10-K 展示件清单 ✅）：Kenneth Duda 聘用信 2004-10-17（创始团队）、Jayshree Ullal 2008-08-01 加入任 CEO、Charles Giancarlo 2013-03-27 加入，2014 年 IPO（登记号 333-194899）✅；截至 2025-12-31 全球全职约 5,115 人 ✅。产品锚是单一软件栈 EOS + NetDL 数据湖 + CloudVision，覆盖 AI Centers、云数据中心、Campus、WAN 四域 ✅ 10-K。

**体量与加速度**：FY2024 营收 70.03 亿（+19.5%）→ FY2025 90.06 亿（+28.6%）✅ [Q4 2024 ER](https://www.sec.gov/Archives/edgar/data/1596532/000159653225000018/ex991q424-earningsrelease.htm)、[Q4 2025 ER](https://www.sec.gov/Archives/edgar/data/1596532/000159653226000010/ex991q425-earningsrelease.htm)；2026 年再加速：Q1 27.09 亿（+35.1%）→ Q2 30.36 亿（+37.7%，首个 30 亿季度）→ Q3 36.58 亿（+58.5%）✅ 三季 ER；9M 2026 合计 94.02 亿 + Q4 指引 39–40 亿 ⇒ FY2026 隐含约 133–134 亿、同比约 +48%（本卡计算口径，⚠️ 指引未兑现前仅为推算）。盈利质量：Q3 2026 GAAP/非 GAAP 营业利润率 44.9%/49.1%，GAAP 摊薄 EPS 1.22 美元高于非 GAAP 1.20——因 1.345 亿美元战略投资收益一次性计入 ✅ Q3 ER。

**AI 后端网络是官方叙事的第二曲线**：2025 年公司定下 AI 后端（back-end）与园区（campus）各 7.5 亿美元年度目标 ⚠️ 财报电话会口径，本会话未能核验一手转写 🔍；FY2025 ER 给出结果端——CEO Ullal 原文「We exceeded both our AI networking and campus expansion goals」✅。产品侧：Etherlink 组合 20+ 款（7800R AI Spine、7060 AI Leaf、7700R4 分布式 Etherlink 交换机 DES），Meta 已将 7700R4 DES 用于其以太网 AI 集群 ✅ Q4 2024 ER；2026-11 发布机架级 scale-up 架构 Etherlink SU-144（单跳 144 XPU/架、跨架 1,024 XPU，合作方 AMD/Arm/Broadcom/d-Matrix/Meta/Microsoft/Qualcomm）与 scale-across 路由（SRv6，面向百万 XPU 级分布式集群）✅ [Q3 2026 ER](https://www.sec.gov/Archives/edgar/data/1596532/000159653226000252/ex991q326-earningsrelease.htm)；以太网 scale-up 开放标准 ESUN 于 2025-10 OCP 全球峰会设立 ✅ ER。

**大客户集中是财务主线**：10-K 不点名两家 >10% 客户，FY2025 占比 26% 与 16%（合计 42%）、FY2024 20% 与 15%（35%）、FY2023 21% 与 18%（39%）✅ 10-K；市场普遍对应 Microsoft 与 Meta ⚠️ 未获一手点名 🔍。10-K 风险原文承认大客户「会按网络角色/项目在多供应商间重新分配份额」、批量订单带来季度波动 ✅；应收账款端前两大经销商占 52%（2025-12-31）✅。收入地域：美洲 79.1%、EMEA 11.9%、APAC 9.0%（FY2025）✅ 10-K。

**竞争位**：AI 后端以太网正面竞争 InfiniBand 与 NVLink——10-K 原文指 IB/NVLink「常与英伟达 GPU 打包为垂直方案出售」，并点名英伟达投资多家 AI Neocloud「用于影响采购决策而非最佳组件选择」✅ 10-K；其余对手：Cisco（在位主导）、HPE（并购 Juniper）、Dell/EMC、Extreme、华为 ✅。替代威胁来自白盒：客户可基于开源网络 OS + 商品化硬件自研或走 disaggregated 采购，「可能制造向下的定价压力」✅ 10-K——与 [[推理与基础设施/云厂商自研芯片]] 同源：超大规模客户既是买家又是潜在自研者。机会侧是 UEC/以太网对 IB 的替换 ✅ 10-K → [[推理与基础设施/GPU高速网络]]。

**Campus/WAN/安全是第二战场**：Gartner 数据中心交换 MQ 领导者（2025-03-31 发布）、企业有线无线 LAN 远见者（2025-06-25）→ 2026 年 LAN MQ 升为领导者 ✅ ER 口径；2025 年从 Broadcom 收购 VeloCloud SD-WAN 组合 ✅ Q2 2025 ER；安全以 NDR（对手 Cisco/Darktrace/ExtraHop）与网络包代理 DMF（对手 Gigamon/Keysight 等）切入 ✅ 10-K；AVA agentic AI 网络运维 ✅ FY2025 ER。公司电话会口径的增长公式 SLOSS（Security/LAN/SD-WAN/Observability）⚠️ 电话会口径，本会话未核一手 🔍。

**治理与经营口径**：Jayshree Ullal 任主席 + CEO，经营叙事由其代言（「Arista 2.0」「centers of data」、累计出货 1.5 亿端口 ✅ FY2025 ER）；2025 年管理层升格：Todd Nightingale（前 Fastly CEO、前 Cisco）任总裁 + COO、Kenneth Duda 升总裁 + CTO、CFO Chantelle Breithaupt ✅ ER；2024-12-03 完成四比一拆股 ✅；2026-09 纳入标普 100 ✅ Q3 2026 ER；10-K 披露 Ullal 于 2025-11-14 设立 10b5-1 减持计划（至多 572.6 万股，常规安排，中性记录）✅。

## 时间线

### 2026-11

- **2026-11-03** · [Q3 2026 财报：营收 36.58 亿、+58.5%，IPO 以来最高增速](https://www.sec.gov/Archives/edgar/data/1596532/000159653226000252/ex991q326-earningsrelease.htm) ✅
  超出此前约 33 亿指引；非 GAAP 营业利润率 49.1%；发布 Etherlink SU-144 机架级架构（144 XPU/架单跳、1,024 XPU 跨架）与 scale-across 百万 XPU 方案；Q4 指引 39–40 亿 ⇒ FY2026 隐含 133–134 亿（计算口径）。
  来源：SEC EDGAR（8-K 附录 99.1）· 2026-11-03

### 2026-08

- **2026-08-04** · [Q2 2026 财报：首个 30 亿+ 季度](https://www.sec.gov/Archives/edgar/data/1596532/000159653226000174/ex991q226-earningsrelease.htm) ✅
  营收 30.36 亿（+37.7%）、非 GAAP EPS +40%；发布 7060XE7 1.6T 平台，LPO 使互连功耗较传统可插拔光模块降约 60%；入选 2026 Fortune 500、Gartner LAN MQ 领导者。
  来源：SEC EDGAR · 2026-08-04

### 2026-05

- **2026-05-05** · [Q1 2026 财报：35.1% 增速开局](https://www.sec.gov/Archives/edgar/data/1596532/000159653226000074/ex991q126-earningsrelease.htm) ✅
  营收 27.09 亿（+35.1%）、经营现金流 16.9 亿；发布 XPO 液冷可插拔光学（网络机架 -75%、机房占地 -44%）；客户 NPS 89。
  来源：SEC EDGAR · 2026-05-05

### 2026-02

- **2026-02-12** · [FY2025 年报：营收 90.06 亿、+28.6%，「超额完成 AI 网络与园区目标」](https://www.sec.gov/Archives/edgar/data/1596532/000159653226000010/ex991q425-earningsrelease.htm) ✅
  CEO 确认 AI 网络与 campus 双目标超额（对应 2025 年各 7.5 亿目标 ⚠️🔍）；累计出货 1.5 亿端口；Q4 单季净利破 10 亿（CFO 口径）；FY2025 10-K 于 2026-02-17 递交 ✅。
  来源：SEC EDGAR（8-K 附录 / 10-K）· 2026-02-12/17

### 2025-11

- **2025-11-04** · [Q3 2025 财报：+27.5%，AI 网络组织升格](https://www.sec.gov/Archives/edgar/data/1596532/000159653225000284/ex991q325-earningsrelease.htm) ✅
  营收 23.08 亿；Kenneth Duda 任总裁 + CTO、Tyson Lamoreaux 任 SVP Cloud & AI Networking；发布 CloudVision AI 端到端 AI 负载观测。电话会应同步更新 AI 后端目标进展 🔍 本会话未获取转写。
  来源：SEC EDGAR · 2025-11-04

### 2025-08

- **2025-08-05** · [Q2 2025 财报：单季非 GAAP 营业利润首破 10 亿；收购 VeloCloud](https://www.sec.gov/Archives/edgar/data/1596532/000159653225000214/ex991q225-earningsrelease.htm) ✅
  营收 22.05 亿（+30.4%）；宣布从 Broadcom 收购 VeloCloud SD-WAN 组合补 WAN 线；Todd Nightingale（前 Fastly CEO / 前 Cisco）任总裁 + COO。
  来源：SEC EDGAR · 2025-08-05

### 2025-02

- **2025-02-18** · [FY2024 年报：营收 70.03 亿、+19.5%；Meta 部署 7700R4 DES](https://www.sec.gov/Archives/edgar/data/1596532/000159653225000018/ex991q424-earningsrelease.htm) ✅
  公司亮点：Meta 在其最新以太网 AI 集群部署 Arista 7700R4 分布式 Etherlink 交换机——头部大客户 AI 后端以太网化的一手证据。
  来源：SEC EDGAR · 2025-02-18

### 2024-12

- **2024-12-03** · 完成四比一拆股 ✅
  经修订注册证书 2024-12-03 生效，1 拆 4，2024-12-04 起按拆股后口径交易。
  来源：Q4 2024 财报（SEC EDGAR）· 2024-12

## 分析

1. **「AI 后端目标制」正在退场，跟踪口径要换挡。** 2025 年的 7.5 亿 AI 后端 + 7.5 亿 campus 目标（电话会口径 ⚠️🔍）已由「双目标超额完成」兑付（FY2025 ER ✅）；2026 年起官方 ER 只给总量与利润率指引，不再单列 AI 收入——Q3 2026 +58.5% 的高增速无法从一手文件拆出 AI 占比。验证只能靠后续电话会转写：公司若恢复 AI 拆分按新数字重置；若持续不拆，AI 叙事须以大客户集中度（26% + 16%）做代理变量。
2. **大客户集中不是外生风险，是商业模式本身。** 两家 >10% 客户合计 FY2023 39% → FY2024 35% → FY2025 42% ✅ 10-K（未点名，市场对应 Microsoft/Meta ⚠️🔍）；10-K 原文承认大客户「按网络角色在多供应商间重新分配」（Meta/Microsoft 多栈采购是公开事实 ⚠️）——AI 后端放量与客户议价力上升同步发生，Q3 2026 GAAP 毛利率 63.6%（同比 -1.0pt）可读作大客户量价结构的代价 ✅。
3. **竞争位是非对称的：不卖 GPU，所以能卖所有 GPU 的网络。** 10-K 点名英伟达以 IB/NVLink 捆绑 GPU、投资 AI Neocloud「影响购买决策」✅；Arista 的反制是开放路线（UEC/ESUN）+ 单一 EOS 栈 + 第三方交换芯片（Broadcom 等 ⚠️ 公知口径，10-K 未展开）。以太网换 IB 在 scale-out 已是顺风；scale-up（SU-144 对位 NVLink）与 scale-across（SRv6 百万 XPU）是把战场伸进英伟达腹地的两步棋，兑现看 2027 年实际部署而非发布稿 → [[推理与基础设施/AI芯片竞争]]。
4. **白盒/SONiC 是十年期威胁，不是当期拐点。** 10-K 风险原文承认客户可自研白盒（开源 NOS + 商品硬件）或走 disaggregated 采购、带来向下定价压力 ✅——威胁来源恰是最大客户群，与 [[推理与基础设施/云厂商自研芯片]] 的逻辑同构。当期无证据显示白盒侵蚀份额（Q3 2026 仍在加速 ✅），但 Microsoft/Meta 每一轮网络自研评估都是证伪观察点 🔍 无公开份额口径。
5. **软件栈护城河体现为利润率与黏性，不是收入份额。** EOS 单栈 + NetDL/CloudVision 运维黏性支撑非 GAAP 营业利润率 49.1%（Q3 2026）；服务收入 9M 2026 约 13.0 亿、占 13.8%（计算口径）✅；NPS 89（2026）✅ 是公司披露的黏性代理指标。对照 [[交付与组织/神州数码]] 的渠道薄利：同一网络的软件时间价值可被设备商二次定价，这是平台商与渠道商的会计分野。
6. **台内观察价值：网络层是 AI 算力开支的第二落点。** 与 [[推理与基础设施/GPU高速网络]]（scale-out 互联路线之争）、[[推理与基础设施/AI数据中心与能源]]（XPO 液冷光学、LPO 降约 60% 互连功耗的能耗账本）互为印证。跟踪硬指标：① Q4 2026 指引 39–40 亿兑现；② FY2026 两家大客户合计是否突破 45%；③ campus/WAN（VeloCloud 整合）是否守住第二曲线；④ ESUN/SU-144 在 2027 年的部署证据。

## 关联线索

- [[推理与基础设施/GPU高速网络]] — 以太网 vs InfiniBand/NVLink 的 scale-out 路线之争；UEC/ESUN 开放标准对冲英伟达垂直栈
- [[推理与基础设施/云厂商自研芯片]] — 大客户「既买设备又自研」的双重身份：SONiC 白盒威胁与自研 XPU 同源
- [[推理与基础设施/AI芯片竞争]] — scale-up 机架级架构（SU-144 vs NVLink）把网络嵌入 XPU 生态位
- [[推理与基础设施/AI数据中心与能源]] — XPO 液冷光学与 LPO：网络侧的功耗账本
