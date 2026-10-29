---
title: "Broadcom 交换芯片"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "broadcom", "whitebox", "sonic"]
summary: "拆解 Broadcom 在以太交换芯片的统治地位、Tomahawk/Jericho/Trident 产品线分工、白盒+SONiC 生态与 UALink 开放 scale-up 路线。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["博通交换芯片", "Broadcom Switching"]
sources: []
name_zh: "Broadcom 交换芯片"
---

# Broadcom 交换芯片

> 中文简称：Broadcom 交换芯片

> **一句话理解**: 全球大多数数据中心交换机的心脏是 Broadcom 的交换芯片——它不卖整机、只卖芯片，却撑起了白盒生态和开放网络路线的半壁江山。

---

## 一、统治地位：以太交换芯片的事实标准

Broadcom 的商业模式是 merchant silicon（商用芯片）：自己不做整机，把交换芯片和 SDK 卖给 Arista、Cisco、超微以及 Celestica、Accton（Edgecore）等 ODM。第三方机构口径下，Broadcom 长期占据数据中心以太交换芯片出货的多数份额，AI 集群浪潮让这一地位更加集中。

结果是一个表面上品牌林立、底层高度同质的市场：不同厂家的 51.2T 交换机拆开看，里面往往是同一颗 Tomahawk 5。这既压低了整机价格，也让"换品牌不换芯片"成为云厂商控制成本的常规操作。

对 AI 集群的直接意义：后端计算网（RoCE）与前端通用网的主流性能档位，几乎每一代都有 Broadcom 芯片在场，任何组网选型都绕不开它。

为什么芯片层如此集中：

- **研发门槛**：先进交换芯片的流片成本与软件栈投入巨大，能持续跟进 51.2T/102.4T 世代的玩家屈指可数。
- **生态惯性**：SDK、SAI 适配、测试脚本、运维工具长期围绕主流芯片沉淀，后来者迁移成本高。
- **供应成熟**：多家 ODM 同步推出基于同一芯片的整机，产能有冗余，交付风险低。

换个角度看，Broadcom 是 AI 网络的"隐形收税人"：不管上层买谁家的整机、用谁家的 GPU，只要走以太路线，芯片层的大头大概率流向它。

---

## 二、产品线矩阵：Tomahawk / Jericho / Trident 各司其职

**表：Broadcom 三大交换芯片产品线**

| 产品线 | 定位 | 代表代际与规格 |
| --- | --- | --- |
| **Tomahawk** | 高带宽、高端口数，AI/云数据中心主力 | TH4 12.8T → TH5 51.2T → TH6 102.4T（2025 年发布） |
| **Jericho** | 智能边缘/大规模路由：大表项、深缓冲 | Jericho2 / Jericho3 系列，适合骨干与边界 |
| **Trident** | 企业与接入层，成熟稳定 | Trident 系列，企业交换机常客 |

注：Tomahawk 6 为 2025 年发布口径，整机量产节奏以设备商公告为准；Jericho 与 Tomahawk 常在同一个 fabric 里分工——Jericho 管路由、大表项与边界，Tomahawk 管高密转发。

三条产品线的代际节奏并不孤立：Tomahawk 定吞吐上限，Jericho 定组网半径（大路由表支撑更大故障域），Trident 保存量市场。AI 集群里最常见的是"Tomahawk 做叶子/脊交换 + Jericho 做边界与跨集群互联"的组合。

当前 AI 以太计算网的主力仍是 TH5 51.2T 世代（对应 64 个 800G 端口的典型形态）；TH6 102.4T 面向下一代端口速率与更大 radix，是 1.6T 时代的卡位产品。

---

## 三、白盒生态：Broadcom 芯片 + SONiC 的默认组合

白盒（whitebox）交换机的标准配方是：ODM 硬件 + Broadcom 芯片 + 开源 NOS。NOS 首选 SONiC（微软发起、Linux 基金会托管的开放网络系统），其 SAI 抽象层把不同芯片的差异屏蔽在统一接口之下。

这套组合是超大规模数据中心的默认选择：硬件多家 ODM 竞争压价，软件自主可控可深度定制，故障排查不依赖原厂黑盒。Meta 的 FBOSS、微软的 SONiC 大规模部署都建立在此类芯片底座上。

社区与商用 NOS 的大致分工：

- **SONiC**：社区主线 + 各家自建分支，云厂商事实标准。
- **FBOSS**：Meta 自研，随 OCP 开放部分组件。
- **Cumulus**：NVIDIA 收购的商用 NOS，常见于传统企业白盒部署。

白盒的隐性成本要算清楚：NOS 适配、自动化流水线、遥测体系都要自建或采购商业支持，团队没有一定规模的网络工程能力时，白盒的硬件价差会被人力成本吃掉。

```bash
# 白盒交换机（SONiC + Broadcom 芯片）上的日常巡检入口
show platform summary     # 平台与芯片型号（如 Tomahawk 5）
show interfaces status    # 端口状态
show queue counters       # 队列与 ECN 标记计数（无损网必看）
```

---

## 四、路线之争：白盒 vs NVIDIA 商用整机

AI 集群组网存在两条路线：NVIDIA 商用整机路线（Quantum/Spectrum 原厂设备 + 原厂软件）与白盒路线（Broadcom 芯片 + SONiC/自研 NOS + ODM 整机）。两条路线之争本质是"确定性溢价 vs 自主可控与成本"。

**表：白盒路线 vs NVIDIA 商用整机路线**

| 维度 | 白盒（Broadcom + SONiC） | NVIDIA 商用整机 |
| --- | --- | --- |
| **硬件来源** | 多家 ODM 竞争 | NVIDIA 一家 |
| **软件** | SONiC/社区/自研，可深度定制 | 原厂封闭栈，开箱即用 |
| **性能调优** | 需要自建工程团队 | 原厂联合调优，确定性强 |
| **典型用户** | 超大规模云厂商 | 企业、部分云厂训练集群 |

注意品牌机与白盒在芯片层常常同源：Arista、Cisco 的多数数据中心机型同样采购 Broadcom 芯片，差异主要在软件与服务。真正的分界线不在"品牌 vs 白盒"，而在"谁掌握软件栈与运维闭环"。

路线选择与集群规模强相关：千卡以下、运维团队小，整机的确定性更值钱；万卡级、有专职网络团队，白盒的成本与可控性优势开始压倒一切。

---

## 五、UALink 联盟与 AI 以太 fabric 的 merchant silicon 底座

- 2024 年 10 月，Broadcom 加入 UALink 联盟董事会，成为开放 scale-up 互连的交换芯片供应方之一——为市场提供 NVSwitch 之外的开放交换芯片路线。
- scale-out 侧，Meta、字节等超大规模厂商的 AI fabric 大量采用 merchant silicon 底座（公开资料口径），配合社区或自研 NOS 运营，后端 RoCE 计算网与前端通用网都有部署。
- UEC（Ultra Ethernet Consortium）路线上，Broadcom 同样是核心成员——开放的 scale-up（UALink）与开放的 scale-out（UEC）在芯片层面对 NVIDIA 的 NVLink + IB 形成夹击。

UALink 交换芯片的意义在于把 scale-up 的开放从"规范纸面"推进到"有货可买"：开放标准若没有对应的高性能交换芯片供应，就无法真正替代 NVSwitch。Broadcom 与其他联盟成员的芯片路线图是开放阵营可信度的关键一环。

也要看到：芯片层面的开放并不等于零锁定。TH 系列一家独大让白盒生态对 Broadcom 形成新的依赖；SAI 对新特性（如新世代拥塞控制）的支持节奏参差，仍是白盒运维的常见痛点。

---

## 六、对市场的意义：打破锁定与多源供应

- **打破锁定**：没有 Broadcom 芯片的性能代际，以太路线很难在高端与 IB 抗衡；它是"开放阵营能用得起的高性能"的物质基础。
- **多源供应**：云厂商在 NVIDIA 整机与 Broadcom 白盒之间保持双线，用一边压另一边的价，是 AI 基建采购的标准动作。
- **代际与产能风险**：单颗芯片系列承载过大份额，产能波动与早期缺陷会传导到整个白盒生态；多代共存（TH4/TH5 同堂采购）是常见对冲手段。

采购视角的四条判断：

- 自研网络团队强、集群规模大：白盒路线综合成本最优，性能靠工程能力补齐。
- 团队小、要确定性：NVIDIA 商用整机仍是省心答案。
- 混合是常态：管理网/存储网用白盒或品牌以太，后端计算网按训练/推理负载二选一试点，再决定主力路线。
- 无论选哪条路线，建议在合同层面锁定芯片代际与软件支持年限——白盒的隐性成本大头在软件维护，不在采购价。

---

## 交叉引用

- [[12_架构基建/08_网络/07_GPU_高网设计/02_物理层硬件/01_Switch_Generations|交换机代际演进]]
- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/05_IB_vs_Ethernet_SpectrumX_UEC|IB vs 以太：Spectrum-X 与 UEC]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/05_UALink|UALink]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/01_NVIDIA_Networking_Stack|NVIDIA 网络全栈]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/05_Vendor_Selection_Angle|厂家选型视角]]
- [[12_架构基建/08_网络/07_GPU_高网设计/08_容量成本/02_Network_CAPEX_Model|网络 CAPEX 模型]]

---

*Last updated: 2026-10-27*
