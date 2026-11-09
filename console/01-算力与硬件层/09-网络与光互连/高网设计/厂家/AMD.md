---
层: 厂家
域: 厂家
更新: 2026-10-27
---

# AMD × GPU 高网

> GPU 挑战者 + 开放互联阵营主导者之一：Infinity Fabric 只做自家 8 卡域，跨机押标准以太网，scale-up 押 UALink，以「不锁定的 AI 集群」对位 NVIDIA。

## 在 GPU 高网中的角色

- GPU 市场第二极：MI 系列以 HBM 容量与性价比切入训练/推理市场；机内互联带宽与 NVLink 存在代差，靠「开放 + 单卡显存」的组合拳竞争。
- 开放互联阵营主导者：与 Intel 等联合推动 UALink（scale-up 开放互联），跨机走标准以太网（RoCE），主张「无私有 fabric 也能组 AI 集群」。
- 体系补全：Pensando DPU 补网络侧，收购 ZT Systems 补系统设计与整机能力，凑齐「GPU 之外」的拼图。
- MI300A 已进入顶级 HPC（El Capitan 采用，公开口径），APU 路线在科学计算侧得到验证。

## 产品谱系

| 分组 | 代际 | 规格与锚点 |
|---|---|---|
| Infinity Fabric | 片内/封装内 | MCM 各芯粒之间、CPU-GPU 之间的片上/封装互联 |
| | 片间（XGMI） | GPU 间直连；历代带宽演进数字待核实 |
| | MI300X 口径 | 官方口径 GPU 间 Infinity Fabric 896 GB/s（双向），8 卡全互联 |
| | MI300A 口径 | APU：Zen4 CPU+GPU+128 GB HBM3 一致性内存（官方口径） |
| | 对位参考 | NVLink 5 单卡 1.8 TB/s 对 XGMI 896 GB/s，约一个代差（各官方口径） |
| GPU 平台 | MI300A/MI300X（2023） | CDNA3，8×XCD MCM；MI300A 为 APU（Zen4+GPU+HBM 一致性封装） |
| | MI325X（2024） | 256 GB HBM3e，8 卡平台延续 |
| | MI355X（2025） | 288 GB HBM3e；节奏以公开口径为准 |
| 开放互联 | UALink 1.0（2025） | 与 Intel 等联合主导的 scale-up 开放互联标准 |
| DPU | Pensando Salina | 2023 公开；后续代际（Bolero 等）待核实 |
| 系统整合 | ZT Systems（2024 宣布收购） | 约 49 亿美元，服务器系统设计+制造；制造业务计划出售（接手方与进展待核实） |
| 软件 | ROCm/RCCL | 对位 CUDA/NCCL 的开源软件与通信栈 |

## 技术路线与取舍

- 不自建私有跨机 fabric：机内只做 8 卡 XGMI 域，跨机走标准以太网（RoCE），把「不锁定」本身当卖点；代价是没有 NVLink 那种万卡级 scale-up 域，只能等 UALink 生态成熟。
- 以 HBM 容量换互联劣势：MI 系历代单卡显存领先同代 NVIDIA，推理与大模型单卡放置是主要叙事。
- MI300A 的 APU 路线：CPU-GPU 统一内存一致性，在 HPC（如 El Capitan）有独特价值，是 NVLink+Grace 之外的另一种超节点思路。
- 软件栈跟随：跨机走标准以太网时，集合通信性能依赖 RCCL 与生态调优，软件是其组网能力的一半。

## 竞争与对标

- vs NVIDIA：GPU 性价比、HBM 容量、开放生态对 NVLink 性能与机架级方案；客户以「避免单一锁定」为由引入 MI 系列（Microsoft、Meta 等公开采用，公开报道口径）。
- vs Intel：UALink 联盟内部的共同主导者，话语权存在竞合；客户端 XPU 在部分负载正面相遇。
- 对网络厂商的意义：AMD 阵营天然是以太网/UEC 生态的客户，Broadcom/Cisco/Arista 等受益于其开放路线。
- 供应链位：以太网阵营把 AMD 视为关键增量客户；UALink 若落地将整体拉动开放 scale-up 生态。

## 近况（2025–26，仅用已核实事实）

- UALink 1.0 于 2025 年发布（AMD/Intel 主导）。
- 其余 GPU 与 DPU 代际节奏以谱系表标注口径为准，2025H2 之后未核实的信息不在本页断言。

## 关联

- [开放互联路线](../知识点/02-机内互联/开放互联路线.md)
- [超节点](../知识点/02-机内互联/超节点.md)
- [IB-RoCE-UEC路线](../知识点/03-跨机网络/IB-RoCE-UEC路线.md)
- [网卡与DPU](../知识点/03-跨机网络/网卡与DPU.md)
- [通信库生态](../知识点/05-集合通信/通信库生态.md)
- [NVIDIA](./NVIDIA.md)
