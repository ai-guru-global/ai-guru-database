---
层: 知识点
域: 10-格局与战线
更新: 2026-11-06
---

# 阵营：NVIDIA 全栈——把网络内嵌进 GPU 合同的垂直体系

> 一句话定位：唯一同时握有 scale-up（NVLink）、后端 scale-out（IB/Spectrum-X）、网卡（ConnectX/BlueField）与 CPO 的玩家，以机柜级交付把网络预算折进 GPU 合同，用年度性能代差换系统性溢价。

## 体系构成

| 层位 | 产品线 | 代际/事实锚点（口径基线） |
|---|---|---|
| scale-up 专有 | NVLink / NVSwitch | 900GB/s（H100）→ 1.8TB/s（NVL72，2024）→ 3.6TB/s（Rubin VR200 NVL72，2026-01 CES 口径） |
| 后端 IB | Quantum 系 | IB 体系内份额 100%；SHARP 在网计算深度绑定 |
| 后端以太网 | Spectrum-X 系 | 直接打进开放阵营腹地，争云厂以太网预算 |
| 网卡/DPU | ConnectX / BlueField | 网卡全球份额 60%+（估算口径） |
| CPO | Quantum-X / Spectrum-X Photonics | 2026 起量（量产口径） |
| 交付形态 | NVL72 → NVL144 → NVL576（Kyber） | NVL72 单柜 5000+ 铜缆；NVL144 计划 2026H2；NVL576 为已公布规划 |
| 开放接口 | NVLink Fusion（2025） | 基于 OCP MGX 向第三方 CPU/XPU 开放，标准与 IP 在己 |
| 软件栈 | NCCL / SHARP / DOCA / 机群管理 | 网络能力的兑现层，与 CUDA 同节奏演进 |

- 结构本质：网络不再按盒子卖，而是折进 NVL 机柜合同；网络占集群 capex 10–20% 的大头被内部化，客户议价对象从网络部门上移到 GPU 采购。
- 协同核心：CUDA→NCCL→SHARP/自适应路由端到端打通，网络差异直接体现在 MFU 上，形成"网络与 GPU 分开买就损失兑现率"的耦合。
- 历史起点：2020 年完成对 Mellanox 的收购获得 IB 与网卡基本盘；NVSwitch 自 2018 年（V100 代）起代际化，两条线在 Blackwell 世代（NVL72，2024）合并为整机柜形态。

## 打法与护城河

1. 性能代差：NVLink 每代翻倍（900GB/s→1.8→3.6TB/s），领先通用互连标准一个代际以上；scale-up 域内通信免征"带宽隐形税"，这是开放阵营短期补不齐的物理差距。
2. 系统绑定：机柜级交付把交换、铜背板、光互连、网卡打进同一 BOM，单点替换即损失整体兑现率，切换成本随代际累积。
3. 年度节奏：GPU 一年一代带动网络同步换代；对照交换芯片业 12.8T（2018）→25.6T（2020）→51.2T（2022）→102.4T（2025）的两年节奏，友商永远慢半拍。
4. Fusion 式开放：NVLink Fusion（2025）以 MGX 为外壳开放接入，但标准与 IP 在己——开放阵营的 scale-up 入场券由 NVIDIA 签发。
5. CPO 自家化：Quantum-X/Spectrum-X Photonics 2026 起量，若爬坡顺利可截留光模块利润池（约 25%，口径基线）中归系统厂的部分。

## 软肋

1. 价格与配给：整机柜方案溢价显著；GPU 紧缺期网络产品随 GPU 配给，非核心客户被系统性推向开放阵营。
2. 两面夹击：scale-out 被 Broadcom+UEC+Arista 压利润，scale-up 被 UALink 与以太网 scale-up 蚕食标准位。
3. 内部对冲：以太网统一对 NVIDIA 并非净利好——Spectrum-X 受益的同时，IB（份额 100% 的独占地盘）被侵蚀，两条产品线自相竞争。
4. 超大客户自研外溢：Google TPU ICI Torus+OCS 证明头部玩家可整体绕开 NVIDIA 网络栈；该模式若扩散到第二家，全栈溢价见顶。
5. 反垄断与地缘：整机柜捆绑面临监管审视（程度待核实）；中国大陆准入受限，把最大增量市场让给国内闭环。

## 胜负手与观察点

| 观察点 | 多头信号 | 空头信号 |
|---|---|---|
| NVL144（2026H2）/ NVL576（Kyber） | 按期交付，scale-up 域半径继续由 NVIDIA 定义 | 跳票或交付质量滑坡，域扩张让位开放方案 |
| CPO 自家化 | Photonics 2026 爬坡顺利，开始替代第三方光模块（替代比例待核实） | 爬坡不顺，光互连价值留在外部供应链 |
| Spectrum-X 守土 | 头部云厂以太网后端招标份额提升（待核实） | 以太网预算被 Arista/白盒+Broadcom 组合拿走 |
| Fusion 生态 | 第三方 CPU/XPU 接入后有实际出货（待核实） | 停在发布口径，无商用证据 |
| IB 份额 | 企稳 | 回升（台内证伪线之一，全栈溢价重估） |

- 关键推理：NVIDIA 的最优解不是死守 IB，而是让"以太网之名的 NVIDIA"（Spectrum-X/XGS）与"专有之实的 NVLink"（Fusion）双轨收租；跟踪时务必把两者分开计份额。

## 关联

- [战线-后端协议](./战线-后端协议.md)——IB 对 RoCE/UEC 的守城战
- [战线-scale-up生态](./战线-scale-up生态.md)——Fusion 对 UALink/以太网 scale-up
- [NVIDIA](../../厂家/NVIDIA.md)
- [Broadcom](../../厂家/Broadcom.md)
- [NVLink与NVSwitch](../02-机内互联/NVLink与NVSwitch.md)
- [ScaleUp域扩张](../08-趋势/ScaleUp域扩张.md)
