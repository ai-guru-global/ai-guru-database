---
层: 厂家
域: 厂家
更新: 2026-10-27
---

# NVIDIA × GPU 高网

> GPU 事实标准厂商：NVLink 统治机内、收购 Mellanox 统治跨机，唯一同时握有 GPU、机内 fabric、IB/以太网交换、网卡与 CPO 的全栈玩家。

## 在 GPU 高网中的角色

- 定义机内互联带宽基线：NVLink/NVSwitch 是所有 GPU 高网方案的对照系，其每代翻倍的节奏直接牵引铜背板、AEC、连接器与光模块产业链的技术指标。
- 2020 年完成以约 69 亿美元收购 Mellanox（口径：约 70 亿美元级），由此同时持有 InfiniBand、以太网交换、ConnectX 网卡、BlueField DPU，成为「GPU+网络」垂直整合的孤例。
- 以整机架交付（NVL72/NVL144/NVL576）把网络从部件采购变为系统采购，重写 GPU 集群的商业与部署形态。
- 网络层双押：InfiniBand 守 HPC/训练存量与极致性能，Spectrum-X 以太网吃 scale-out 通用化红利；机内则以 NVLink Fusion 向第三方开放。

## 产品谱系

| 分组 | 代际 | 规格与锚点 |
|---|---|---|
| NVLink/NVSwitch | NVLink 1（P100，2016） | 单卡 160 GB/s |
| | NVLink 2（V100，2017） | 单卡 300 GB/s，首次引入 NVSwitch |
| | NVLink 3（A100，2020） | 单卡 600 GB/s |
| | NVLink 4（H100，2022） | 单卡 900 GB/s |
| | NVLink 5（B200/GB200，2024） | 单卡 1.8 TB/s，NVL72 铜背板全互联 |
| | NVLink 6（Rubin，2026） | 单卡 3.6 TB/s |
| 机架形态 | HGX（A100/H100 代） | 8 卡 SXM 基板 + NVSwitch |
| | GB200 NVL72（2024） | 72 GPU 单 NVLink 域 |
| | VR200 NVL72（2026-01 CES 发布） | Rubin 代 NVL72 |
| | Vera Rubin NVL144 | 计划 2026 下半年 |
| | Kyber NVL576 | 已公布规划，更大 scale-up 域 |
| IB 交换 | Quantum（HDR 200G，2019） | 40×200G |
| | Quantum-2（NDR 400G，2021–22） | 64×400G，片上集成 SHARP |
| | Quantum-X800（XDR 800G，2024） | 144×800G，配套 GB200 代集群 |
| 以太网交换 | Spectrum-3（12.8T，2019） | RoCE 与通用以太网主力一代 |
| | Spectrum-4（51.2T，2023–24） | Spectrum-X 平台交换基座 |
| | Spectrum-XGS（2025 发布口径） | 面向 scale-up 域的以太网交换族 |
| 网卡/DPU | ConnectX-7（400G） | Spectrum-X 体系中的 SuperNIC |
| | ConnectX-8（800G） | 800G 代，量产节奏待核实 |
| | BlueField-3（400G，2023） | DPU/SuperNIC；BlueField-4 待核实 |
| CPO | Quantum-X Photonics | IB CPO 交换，GTC 2025 发布，2026 量产口径 |
| | Spectrum-X Photonics | 以太网 CPO 交换，同上口径 |

## 技术路线与取舍

- 垂直整合换性能闭环：GPU—NVLink—交换—网卡—NCCL/SHARP 软件栈全链路协同优化，是对手最难复制的护城河，代价是客户锁定。
- 协议私有但网络层开放双押：机内 NVLink 长期不授权，跨机 IB 与以太网两条产品线并行，把「性能优先」与「通用优先」两类客户都留在自己体系内。
- scale-up 铜优先：NVL72 用铜背板把高速域做大，光只出现在跨机与 CPO 边界，本质是功耗与成本的显性取舍。
- NVLink Fusion（2025）：基于 OCP MGX 向第三方 CPU/XPU 开放 NVLink，试图把 NVLink 从私有接口升级为生态标准，防御 UALink 阵营。

## 竞争与对标

- vs Broadcom：系统级方案对芯片供应；Spectrum-X（含 Photonics）正面进入以太网/CPO 地盘，Broadcom 以 UEC + 白盒生态反制。
- vs UEC/UALink 开放联盟：分别从 scale-out 与 scale-up 两端瓦解其网络锁定，NVIDIA 以 Fusion 开放与 CPO 节奏回应。
- vs 超大规模自研体系（Google TPU 网络）：不直接竞争部件，但争夺同一批资本开支，是另一条技术路线的存在证明。

## 近况（2025–26，仅用已核实事实）

- 2026-01 CES 发布 Rubin 架构 VR200 NVL72；NVLink 6 单卡 3.6 TB/s（NVLink 5 为 1.8 TB/s）。
- Vera Rubin NVL144 计划 2026 下半年；Kyber NVL576 为已公布规划。
- NVLink Fusion（2025）：基于 OCP MGX 向第三方 CPU/XPU 开放 NVLink 生态。
- Quantum-X / Spectrum-X Photonics（CPO，GTC 2025 发布，2026 量产口径）。

## 关联

- [NVLink与NVSwitch](../知识点/02-机内互联/NVLink与NVSwitch.md)
- [SHARP在网计算](../知识点/05-集合通信/SHARP在网计算.md)
- [IB-RoCE-UEC路线](../知识点/03-跨机网络/IB-RoCE-UEC路线.md)
- [CPO共封装光学](../知识点/03-跨机网络/CPO共封装光学.md)
- [ScaleUp域扩张](../知识点/08-趋势/ScaleUp域扩张.md)
- [Broadcom](./Broadcom.md)
