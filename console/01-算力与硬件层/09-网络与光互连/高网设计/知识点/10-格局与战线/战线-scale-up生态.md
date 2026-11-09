---
层: 知识点
域: 10-格局与战线
更新: 2026-11-06
---

# 战线：scale-up 生态——NVLink/Fusion vs UALink vs 以太网 scale-up

> 一句话定位：机柜内/机柜群互连标准归属之争——NVLink 以 3.6TB/s（Rubin VR200 NVL72，2026-01 CES 口径）性能代差加 Fusion 半开放防守；UALink 与以太网 scale-up 赌"开放标准+多源芯片"打开 NVLink 替代市场，赢家拿走 2026e 数十亿美元级（估算口径）增速最快的价值层。

## 对垒双方（三方）

| 阵营 | 载体 | 语义/定位 | 状态锚点 |
|---|---|---|---|
| NVIDIA NVLink / NVLink Fusion | NVLink 总线 + Fusion 开放层 | 一致性/加载存储语义的专有总线 + 半开放接入 | NVLink 3.6TB/s（2026-01 口径）；Fusion（2025）基于 OCP MGX 向第三方 CPU/XPU 开放 |
| UALink | UALink 1.0（2025） | 对标 NVLink 语义的开放标准位 | 1.0 已发布；商用芯片与整机待落地（待核实） |
| 以太网 scale-up | NVIDIA Spectrum-XGS、UEC scale-up profile | 用"够快的以太网+大域"绕开语义之争 | XGS 2025 发布（细节待核实）；UEC scale-up profile 进度待核实 |

- 路线差异的本质：NVLink/UALink 争"加载存储/一致性语义"，以太网 scale-up 争"放松语义但堆带宽"——三者赌的是不同抽象层，短期并存而非互斥。
- 竞争不对称：NVIDIA 同时占专有（NVLink）与以太网（Spectrum-X/XGS）两个生态位；UALink 的赢面取决于非 NVIDIA XPU（AMD、国产阵营）的总量与代际。
- 自研旁证：Google TPU ICI Torus+OCS 证明自研 scale-up 可行，但只适用于自研芯片巨头——它验证了天花板，没有开放生态。

## 赌注（赢了拿走什么）

1. 机柜内互连标准归属：scale-up 互连 2026e 数十亿美元级（估算口径）且为增速最快的价值层（NVLink 带宽每代翻倍）。
2. NVLink 替代市场：成为非 NVIDIA 加速卡（AMD/国产 GPU）scale-up 的默认选项，绑定其系统形态与机柜设计。
3. 超节点天花板定义权：标准决定单域卡数上限（NVL144 计划 2026H2 / NVL576 Kyber 规划 / UALink 域 / 以太网大域），进而决定调度与通信库生态的适配重心。
4. Fusion 的期权价值：若第三方 XPU 大规模接入，NVIDIA 从"卖 GPU"扩展为"卖互连标准授权"，打开第二收租管道。

## 判据与里程碑

1. UALink 商用芯片落地：1.0（2025）后首个商用交换/重定时器芯片与整机的出现时间与量产规模（待核实）。
2. Fusion 第三方接入出货：第三方 CPU/XPU 经 Fusion 的实际出货量，而非发布口径（待核实）。
3. XGS 出货：NVIDIA 以太网 scale-up 产品线的商用部署规模（待核实）。
4. 超节点卡数天花板实测：NVL144（2026H2）/NVL576 交付，对照夸娥 kUAE（2025）等国产超节点的实际卡数与商用规模。
5. 通信库耦合：NCCL 对非 NVLink 域的支持深度、开源通信库对 UALink/以太网 scale-up 的适配——开放阵营的隐性瓶颈（待核实）。
6. UEC scale-up profile 进度：以太网阵营能否给出统一的 scale-up 规范位（待核实）。

### 里程碑日历（口径基线锚点）

- 2024：NVL72（NVLink 1.8TB/s）确立机柜级 scale-up 形态；单柜 5000+ 铜缆成为工程基准。
- 2025：NVLink Fusion、UALink 1.0、夸娥 kUAE 超节点同年落地——开放标准位的"占位年"。
- 2026：Rubin VR200 NVL72（3.6TB/s，2026-01 CES 口径）先行验证代际节奏；NVL144 计划 2026H2 交付。

## 情景推演（基准/多头/空头，开放阵营视角）

| 情景 | 时间窗 | 描述 | 赢家 |
|---|---|---|---|
| 基准：NVLink 守擂、开放补位 | 2025–2028 | NVLink 在 NVIDIA 体系内不可替代；UALink/以太网 scale-up 服务非 NVIDIA XPU 成长盘 | NVIDIA 吃主力，开放阵营吃替代盘 |
| 多头：UALink 破局 | 2027–2030 | UALink 商用芯片规模化 + AMD/国产 XPU 放量，形成第二事实标准 | AMD/国产 GPU 阵营 + UALink 芯片供应商 |
| 空头：Fusion 收编 | 2025–2029 | Fusion 让第三方 XPU 以 NVIDIA 标准接入，UALink 停在纸面；或以太网 scale-up 被 XGS 抢先产品化 | NVIDIA——开放的名义、专有的实质 |

- 台内主判断：scale-up 域扩张是本轮最大结构性趋势（价值再分配第一受益层）；标准战短期动摇不了 NVLink 的性能代差，但决定 2027 年后非 NVIDIA 阵营的系统形态。
- 观察口径提醒：scale-up 互连市场规模（2026e 数十亿美元级）目前主要藏在 NVIDIA 整机柜 BOM 内，独立统计口径尚未建立（待核实），份额类数字一律按估算口径处理。

## 关联

- [阵营-NVIDIA全栈](./阵营-NVIDIA全栈.md)
- [战线-铜光边界](./战线-铜光边界.md)
- [开放互联路线](../02-机内互联/开放互联路线.md)
- [超节点](../02-机内互联/超节点.md)
- [ScaleUp域扩张](../08-趋势/ScaleUp域扩张.md)
- [AMD](../../厂家/AMD.md)
