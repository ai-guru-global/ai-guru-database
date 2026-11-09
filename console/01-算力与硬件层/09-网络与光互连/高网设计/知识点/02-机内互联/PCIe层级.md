---
层: 知识点
域: 02-机内互联
更新: 2026-10-27
---

# PCIe 层级

> GPU 服务器的通用 IO 平面：根复合体—PCIe Switch—端点的层级拓扑。带宽不及 NVLink，但承载 NIC/存储/管理，其亲和关系决定 GPUDirect 能否真正绕开 CPU。

## 解决什么问题

- 一台 8 卡 GPU 服务器里有三类设备要互通：GPU↔GPU、GPU↔NIC、GPU↔NVMe。NVLink 只覆盖第一类，其余全部落在 PCIe 平面上（见 [NVLink与NVSwitch](NVLink与NVSwitch.md)）。
- PCIe 平面的核心问题不是峰值带宽而是拓扑：设备挂在哪颗 CPU、哪颗 PCIe Switch 下，决定 P2P DMA 是直达还是要穿根复合体、跨 NUMA。拓扑错了，名义带宽再高也用不出来。
- 本篇给出层级模型、代际带宽与亲和设计规则；AMD 卡间 xGMI 等专用互联不在此展开（见 [AMD](../../厂家/AMD.md)）。

## 核心原理

- 层级：根复合体（CPU 集成 PCIe 控制器，每颗 CPU 若干 root port）→ PCIe Switch（扇出与驻留转发）→ 端点（GPU/NIC/NVMe）；CPU↔CPU 之间走 UPI/Infinity Fabric，形成 NUMA 边界。
- P2P DMA：同一条 switch 子树内，两端点可经交换芯片直读直写，不经 CPU、不落主存中转；跨 root complex 或跨 NUMA 时路径质量急剧下降（时延上升、带宽受上行口约束）。
- 典型 8 卡 HGX 服务器（H100 世代，2022–2023 主流）：GPU 基板经 PCIe Gen5 x16 上连两颗 CPU，8 张 NIC 分布在两颗 CPU 的 root port 下——NIC 与 GPU 是否同 root complex/NUMA 决定 P2P 直达与否（具体每机型走线以厂商文档为准）。
- 信号物理：速率每代翻倍，Gen4（16 GT/s）起主板走线接近极限，Gen5（32 GT/s）普遍需要 Retimer 重定时——这是 lane 资源昂贵、bifurcation 受限的物理根源。

## 关键数字（表格）

PCIe 代际 x16 聚合带宽（编码后有效值）：

| 代际 | 规范年份 | 单 lane 速率 | x16 单向 | x16 双向 | 备注 |
|---|---|---|---|---|---|
| Gen3 | 2010 | 8 GT/s | ~15.8 GB/s | ~31.5 GB/s | 128b/130b，存量庞大 |
| Gen4 | 2017 | 16 GT/s | ~31.5 GB/s | ~63 GB/s | 上一代主力 |
| Gen5 | 2019 | 32 GT/s | ~63 GB/s | ~126 GB/s | 2022 年起量产，需 Retimer |
| Gen6 | 2022 | 64 GT/s PAM4 | ~121 GB/s | ~242 GB/s | FLIT/FEC；AI 服务器尚未规模落地（待核实） |
| Gen7 | 制定中（待核实） | 128 GT/s | ~242 GB/s | ~484 GB/s | 未量产 |

参照：Gen5 x16 双向 ≈ 128 GB/s，约为 NVLink 4（900 GB/s，2022）的 1/7、NVLink 5（1.8 TB/s，2024）的 1/14——量价决定了 GPU-GPU 主通信必须上专用互联。lane 预算：单颗服务器 CPU 提供 80（Intel 平台）~128（AMD 平台）条 lane（2022–2024 主流世代，以具体型号为准），两颗 CPU 要塞下 GPU 上行、NIC、NVMe、BMC、Retimer，预算极紧。

## 设计要点与权衡

- GPU–NIC 亲和是第一设计规则：承载 RDMA 的 NIC 与主力通信 GPU 放同一颗 PCIe Switch 子树下可 P2P 直达；否则要么绕 CPU 根复合体、要么跨 NUMA，GPUDirect RDMA 时延与带宽双降（机制见 [一致性域与GPUDirect](一致性域与GPUDirect.md)）。
- 上行口径核算：PCIe Switch 上行（到 CPU）常为 x16，多端点同时打向上行口（GPU 读 NIC + CPU 读写 NVMe）即超分；按"同子树内 P2P 流量不上行"的原则给设备分族。
- NVMe 与 NIC 争 lane：先保 NIC 的 x16 满速，再谈盘位；系统盘走 BMC/M.2 独立通道，数据盘按 P2P 需求分族。
- 采购规格书应写拓扑而非只写"PCIe 5.0"：要求厂商提供 lspci 树与 GPU-NIC 亲和矩阵，验收时用 `nvidia-smi topo -m` 核对 PIX/PHB/NODE/SYS 标记（见 [性能基线与验收](../07-可靠与评估/性能基线与验收.md)）。

## 常见坑

- bifurcation：主板/转接卡把 x16 拆成 x8+x8 的能力不是默认有；买错背板或 riser，第二张卡只能跑 x8。
- lane 复用：部分平台 lane 由 PCIe 与 M.2/U.2/OCP 网卡复用，插满 GPU 后 NIC 降速到 x8 甚至 x4，带宽对半。
- ACS/IOMMU：开启 ACS（访问控制服务）后 P2P 被强制经根复合体转发，`nvidia-smi topo -m` 里 PIX 变 PHB，性能大幅下降；虚拟化/IOMMU 场景要显式评估（详见 [一致性域与GPUDirect](一致性域与GPUDirect.md)）。
- 热插拔与拓扑发现：热插拔换卡后 PCIe 序号/NUMA 亲和可能变化，而驱动与 NCCL 按启动时拓扑缓存，不重启会拿到过期拓扑。
- Gen5 信号余量小：线缆/转接卡/挡板的厘米级差异都可能使链路训练掉速到 Gen4，机房巡检要把"链路训练速率"列为检查项（见 [监控与拨测](../07-可靠与评估/监控与拨测.md)）。

## 关联

- [NVLink与NVSwitch](NVLink与NVSwitch.md)：并行存在的 GPU 专用平面。
- [一致性域与GPUDirect](一致性域与GPUDirect.md)：P2P/RDMA 绕 CPU 的机制与 IOMMU 陷阱。
- [网卡与DPU](../03-跨机网络/网卡与DPU.md)：PCIe 端点侧的 NIC 视角。
- [NCCL](../05-集合通信/NCCL.md)：拓扑探测与通道选择。
- [性能调优](../../角度/性能调优.md)：从整机视角做亲和优化。
