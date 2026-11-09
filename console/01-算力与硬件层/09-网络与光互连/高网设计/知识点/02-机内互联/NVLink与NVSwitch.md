---
层: 知识点
域: 02-机内互联
更新: 2026-10-27
---

# NVLink 与 NVSwitch

> GPU 专用机内互联与交换体系：用全互联的专用协议平面取代 PCIe 的层级式通用 IO，是 scale-up 域的物理基础。

## 解决什么问题

- PCIe 为通用 IO 设计，单卡带宽、每瓦带宽、任意点对任意点联通性都不匹配 8 卡训练的集合通信需求；根复合体层级下，跨 Switch/跨 NUMA 的 GPU 对带宽不对称且常需 CPU 介入（详见 [PCIe层级](PCIe层级.md)）。
- 训练主通信原语是 allreduce/allgather：要求任意两卡间都有接近 HBM 带宽量级（成数百 GB/s 以上）的路径。PCIe Gen4 x16 双向 ~64 GB/s（2017 规范，2020 规模部署），仅约 A100 HBM 带宽（1.55 TB/s，2020）的 4%——机内互联是首要瓶颈。
- NVLink 的答案：专用短距差分链路 + 专用交换芯片（NVSwitch），把 8 卡板乃至整机架做成无阻塞全互联域，数据面完全绕开 CPU 与操作系统。

## 核心原理

- 链路：NVLink 是点对点差分串行链路，信号速率逐代翻倍（NVLink 4 达 100 Gbps/lane，2022）；承载内存读写语义（load/store），并支持一致性协议，NVLink C2C（2022，Grace 世代）把一致性延伸到 CPU-GPU 之间（详见 [一致性域与GPUDirect](一致性域与GPUDirect.md)）。
- 拓扑演进：
  - NVLink 1/2（P100/V100）：无交换，卡间直连 mesh（V100 为 hybrid cube mesh，每卡 6 链路），多数卡对间无直连链路，多跳且无带宽保证。
  - NVLink 3 起（A100，2020）：NVSwitch 交换拓扑，每 GPU 全部链路上连 NVSwitch，任意 GPU 对间单跳、全带宽、无超分。
- NVSwitch 代际一句带过：第一代随 DGX-2（2018）实现 16×V100 全互联；第二代服务 A100（HGX 基板 6 颗，64 端口）；第三代服务 H100（每板 4 颗，并可经 NVLink Switch 芯片跨 4 节点组 32 GPU 域，细节待核实）；第四代服务 Blackwell（GB200 NVL72，交换能力进入机架级），随 Rubin 的下一代交换芯片细节待核实。
- 机架域：GB200 NVL72（2024）以 72 GPU + 36 Grace CPU 构成单一 NVLink 域；VR200 NVL72 于 2026-01 CES 发布（NVLink 6，3.6 TB/s/卡）；Vera Rubin NVL144 计划 2026 下半年；Kyber NVL576 为已公布的后续规划——scale-up 域从板级走向机架级、多机架级（详见 [超节点](超节点.md)）。
- 生态：NVLink Fusion（2025 发布）基于 OCP MGX 机架规格向第三方 CPU/XPU 开放 NVLink 生态——开放接入但标准制定权仍在 NVIDIA（详见 [开放互联路线](开放互联路线.md)）。
- 对照：AMD Infinity Fabric 是同构思路（专用互联+交换，覆盖片内到卡间 xGMI 到跨节点），走开放生态，单卡互联带宽代际落后 NVLink 约 1–2 代（定性，2025）。

## 关键数字（表格）

NVLink 历代每 GPU 双向带宽：

| 世代 | 代表 GPU | 年份 | 双向带宽/卡 | 拓扑 |
|---|---|---|---|---|
| NVLink 1 | P100 | 2016 | 160 GB/s | 点对点 mesh |
| NVLink 2 | V100 | 2017 | 300 GB/s | hybrid cube mesh |
| NVLink 3 | A100 | 2020 | 600 GB/s | NVSwitch 全互联 |
| NVLink 4 | H100 | 2022 | 900 GB/s | NVSwitch 全互联，可跨节点 |
| NVLink 5 | B200 | 2024 | 1.8 TB/s | NVSwitch，NVL72 机架域 |
| NVLink 6 | Rubin | 2026 | 3.6 TB/s | NVL72/144，Kyber NVL576 规划中 |

参照系：PCIe Gen5 x16 双向 ≈ 128 GB/s（2022 年起规模量产）。NVLink 4（2022）约为其 7 倍，NVLink 6（2026）约为其 28 倍；同代 PCIe Gen6 在 AI 服务器尚未规模落地（待核实）。

## 设计要点与权衡

- 每瓦带宽与成本（定性结论）：机架内 NVLink+铜互联的每 Gbps 传输功耗与成本显著低于等带宽的跨机光互联——这是"把通信收进机架"的经济动机；定量见 [机柜铜背板与AEC](机柜铜背板与AEC.md) 与 [光模块配比经济学](../03-跨机网络/光模块配比经济学.md)。
- 域大小的选择：NVL72 级域把 TP/EP 的大通信量关在机架内，scale-out 只承载 DP 梯度等小比例流量；代价是机架级供电/液冷/故障域集中（三权衡详见 [超节点](超节点.md)）。
- NVLink 不替代 PCIe：存储、网卡、管理、扩展仍走 PCIe 平面；两个平面的拓扑共同决定 NCCL 的通道选择（详见 [NCCL](../05-集合通信/NCCL.md)）。
- 锁定效应：选择 NVLink 域即同时选择 GPU 代际、机架形态与供应链，替换成本极高；开放替代路线见 [开放互联路线](开放互联路线.md)。

## 常见坑

- 只看 GPU 带宽不看 NIC 亲和：GPU 再快，NIC 挂错 CPU/PCIe Switch 会让跨机通信绕 CPU，GPUDirect RDMA 失效（详见 [PCIe层级](PCIe层级.md)）。
- 混淆"链路全互联"与"任意两卡同时全带宽"：交换芯片总容量有上限，饱和度要按交换容量核算，不能按链路数×带宽线性外推。
- NVL72 是一个供电/液冷/维护单元：整机架当量的故障域，运维与续训策略要按机架粒度设计（详见 [弹性与容错续训](../04-拓扑组网/弹性与容错续训.md)）。
- 以为 NVLink 消灭 scale-out：域封顶在 72/144/576 量级，十万卡集群主体仍是跨机网络（详见 [十万卡设计](../08-趋势/十万卡设计.md)）。

## 关联

- [PCIe层级](PCIe层级.md)：被 NVLink 绕开但无法取代的通用平面。
- [一致性域与GPUDirect](一致性域与GPUDirect.md)：NVLink 承载的内存语义、C2C 与 MNNVL。
- [超节点](超节点.md)：NVLink 域机架化后的形态与三权衡。
- [机柜铜背板与AEC](机柜铜背板与AEC.md)：NVSwitch 机架域的物理载体。
- [NCCL](../05-集合通信/NCCL.md)：软件层如何利用 NVLink/NVSwitch 拓扑。
- [ScaleUp域扩张](../08-趋势/ScaleUp域扩张.md)：域从 8 卡到 NVL576 的演进视角。
