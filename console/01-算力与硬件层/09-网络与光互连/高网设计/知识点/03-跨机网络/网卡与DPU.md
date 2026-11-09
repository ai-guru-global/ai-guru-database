---
层: 知识点
域: 03-跨机网络
更新: 2026-10-27
---

# 网卡与 DPU：主机侧的网络端点

> ConnectX 谱系、BlueField DPU 的卸载与隔离、GPUDirect RDMA 的 P2P 依赖，以及网卡与 GPU 的配比演进。

## 解决什么问题

跨机网络的端点在主机侧：NIC 决定可达带宽（400G/800G）、RDMA 语义实现质量、与 GPU 的数据通路（GPUDirect）；DPU 进一步把网络/存储/安全处理从主机 CPU 卸载并提供租户隔离。网卡与 GPU 的配比（1:1 还是过收敛）直接决定集群网络架构与光模块用量。

## 核心原理

- **ConnectX 谱系**：CX-6 Dx（200G，PCIe Gen4）→ CX-7（400G，Gen5，NDR 主力）→ CX-8（800G，XDR/Spectrum-X800 配套）。IB 与以太双态（同一硬件烧录不同固件/接口形态），SHARP/自适应路由等系统特性与交换机配对。
- **BlueField DPU**：在 ConnectX 数据通路基础上加 Arm 核（BF-3 为 16 核，待核实）与可编程流水线，跑独立 OS：卸载 RDMA/OVS/存储（NVMe-oF）/加解密，把基础设施任务与业务域隔离；多租户云用它做裸金属与安全边界（类 AWS Nitro 思路）。AI 集群中常见于存储节点、安全与带外服务节点。
- **GPUDirect RDMA**：NIC 经 PCIe P2P 直接 DMA 进出 GPU 显存，绕过 CPU 拷贝。依赖三件事：平台 PCIe 拓扑支持 P2P 转发（同 Root Complex 或经 PCIe 交换）、nvidia-peermem 驱动、NCCL 自动探测利用。NIC 与 GPU 不在同一 PCIe 交换域时性能降级甚至回退走 CPU。
- **配比演进**：H100 代每 GPU 1×400G（每 HGX 8×400G，1:1）；B200/GB200 代典型每 GPU 800G（1:1）；成本敏感的推理集群做 1:2 过收敛（典型口径待核实）。GB200 NVL72 世代 72 卡共享柜内 NVLink 域，scale-out 仍以 800G 对外（具体端口形态待核实）。
- **国产/白盒 NIC 一句带过**：中科驭数等 DPU 与国产 GPU 配套 NIC 已起步，商用规模与 RoCE 生态成熟度待核实。

## 关键数字

| 型号 | 端口 | PCIe | 上市节奏 | 备注 |
| --- | --- | --- | --- | --- |
| ConnectX-6 Dx | 1–2×200G | Gen4 | 2020 | 200G 世代主力，含加密 |
| ConnectX-7 | 1×400G 或 2×200G | Gen5 | 2022 | NDR/400G RoCE 主力 |
| ConnectX-8 | 1×800G 或 2×400G | Gen5/Gen6（待核实） | 2024–2025 节奏 | XDR 与 Spectrum-X800 配套 |
| BlueField-2 | 200G | Gen4 | 2020 | DPU 世代起点 |
| BlueField-3 | 400G | Gen5 | 2023 | 16 Arm 核（待核实） |
| BlueField-4 | 800G | — | 2025 口径（待核实） | Blackwell 代配套 |

| 配置代际 | NIC:GPU | 单卡网络带宽 | 典型场景 |
| --- | --- | --- | --- |
| H100 代 | 1:1 | 400G | 训练主流 |
| B200/GB200 代 | 1:1 | 800G | 大模型训练 |
| 推理/成本敏感 | 1:2 甚至更低 | 共享 400/800G | 过收敛（待核实典型） |

## 设计要点与权衡

- PCIe 亲和优先：每张 NIC 与固定的 GPU 组挂在同一 PCIe 交换域下，配合轨道优化让「NIC i 只出流量到 leaf i」；IOMMU/ACS 配置不当会打断 P2P。
- 双端口 NIC 可当两条轨用，但要核对哈希与故障切换语义，避免双端口同时落在同一 leaf 形成假冗余。
- DPU 用在刀刃上：全量节点配 BlueField 的成本高，通常只在存储/安全/多租户边界节点部署。
- 固件-驱动-通信库矩阵提前锁定：ConnectX 固件、MOFED 驱动、NCCL 版本互相约束，升级要全链路回归。
- 配比选择回到流量模型：通信量与时延估算（见关联）决定 1:1 是否浪费；过收敛省的模块与交换机钱可能以 MFU 损失偿还。

## 常见坑

- NIC 与 GPU PCIe 亲和错配，GPUDirect 静默回退走 CPU，带宽腰斩且难发现。
- 开 IOMMU/ACS 后 P2P 被阻断，性能问题被误判为网络拥塞。
- 多代 NIC 混部（CX-6/7 混在一个集群）固件与调优参数不一致，尾时延劣化。
- 把 BlueField 当普通 ConnectX 用，付了 DPU 的钱没跑 DPU 的活。
- 网卡轨号与 leaf 端口映射不做资产化，故障定位时「哪张卡接哪台 leaf」靠人肉查线。

## 关联

- [一致性域与 GPUDirect](知识点/02-机内互联/一致性域与GPUDirect.md)
- [PCIe 层级](知识点/02-机内互联/PCIe层级.md)
- [IB-RoCE-UEC 路线](知识点/03-跨机网络/IB-RoCE-UEC路线.md)
- [NCCL](知识点/05-集合通信/NCCL.md)
- [轨道优化](知识点/04-拓扑组网/轨道优化.md)
- [NVIDIA](厂家/NVIDIA.md)
