---
层: 知识点
域: 02-机内互联
更新: 2026-10-27
---

# 一致性域与 GPUDirect

> 两个互补机制：一致性域把"谁能直接 load/store 谁"的边界从片内扩展到机架，GPUDirect 把数据搬运路径上的 CPU 摘掉——共同决定机内互联跑的是内存语义还是消息语义。

## 解决什么问题

- 默认数据路径都过 CPU：GPU↔GPU 要经主存中转或 CPU 调度；NIC 收包先落 CPU 内存再拷入显存；读盘先入 page cache。每次中转等于一次拷贝加一次系统调用，CPU 与内存带宽成为瓶颈。
- 默认语义是消息/拷贝语义：设备间不共享地址可见性，必须显式搬运。若互联硬件直接支持 load/store 与缓存一致性，指针可跨设备共享，编程模型与通信库随之简化提速。
- GPUDirect 解决"路径"问题（绕开 CPU），一致性域解决"语义"问题（直接互访）；两者叠加才构成 NVLink/UALink 类 scale-up 域的软件价值。

## 核心原理

- 语义层级：消息传递（send/recv）< one-sided（RDMA put/get）< load/store 直访（内存语义）< 硬件缓存一致性（原子性与可见性由硬件保证）。NVLink 自第 2 代（2017）在与 Power9 CPU 间提供一致性；NVLink C2C（2022，Grace 世代）把 Grace-CPU 与 GPU 拼成一致性域；GB200 世代的 MNNVL 把一致性域扩到多机 NVLink 域（规模细节待核实）。
- GPUDirect 家族与各自绕开的 CPU 路径：
  - P2P：GPU↔GPU 经 PCIe Switch/NVLink 直读对方显存，绕开"落主存+CPU 中转"。
  - RDMA：NIC 的 DMA 直达显存，绕开"NIC→CPU 内存→拷贝入显存"；前提是 NIC 与 GPU 的 PCIe 亲和（见 [PCIe层级](PCIe层级.md)）。
  - Storage：NVMe 直达显存，绕开 page cache 与 CPU 拷贝，检查点/权重加载提速。
  - Video：解码器输出帧直达显存，绕开 CPU 中转，视频推理管线常用。
- 对集合通信库的影响：NCCL 探测拓扑（NVLink/PCIe 亲和）后选通道与算法——一致性域越大，ring/tree 可用的"全带宽边"越多；MNNVL 域内 allreduce 可全程驻留 NVLink，跨域才落网卡（见 [NCCL](../05-集合通信/NCCL.md)、[Ring与Tree算法](../05-集合通信/Ring与Tree算法.md)）。
- 对编程模型的影响：一致性域内可用统一虚拟地址写指针共享代码，跨域仍回到显式通信。域边界即语义断崖，代码跨域要换通信原语。

## 关键数字（表格）

GPUDirect 家族对照（定性）：

| 机制 | 路径变化 | 绕开对象 | 关键前提 | 主要收益 |
|---|---|---|---|---|
| P2P | GPU→主存→GPU 变 GPU→GPU | CPU、主存拷贝 | 同 switch 子树或 NVLink；ACS 关闭 | 时延降、吞吐升 |
| RDMA | NIC→CPU 内存→显存 变 NIC→显存 | CPU bounce buffer | NIC-GPU 亲和、IOMMU 配置正确 | 跨机通信省一次拷贝 |
| Storage | 盘→page cache→显存 变 盘→显存 | CPU、系统内存 | 文件系统兼容、对齐 | 检查点/加载提速 |
| Video | 解码→CPU→显存 变 解码→显存 | CPU 中转 | 驱动与框架支持 | 视频推理管线提速 |

互联语义层级对照（定性）：

| 语义 | 代表 | 额外开销 |
|---|---|---|
| 消息传递 | IB Verbs、NCCL 点对点 | 显式序列化与缓冲管理 |
| one-sided RDMA | GPUDirect RDMA put/get | 仍需显式发起 |
| load/store | NVLink GPU-GPU、UALink 目标语义 | 地址翻译（如 ATS） |
| 缓存一致性 | NVLink C2C（Grace）、MNNVL 方向 | 硬件目录/监听的功耗与时延 |

## 设计要点与权衡

- 域越大越好是错觉：一致性域扩大的代价是硬件目录开销、故障耦合（成员故障伤及域内语义）与 RAS 复杂度；主流分工是把 TP/EP 高通信量封进一致性域、把 DP 留给消息语义（见 [超节点](超节点.md)）。
- 亲和是 GPUDirect 的先决条件：采购时锁定 GPU-NIC 同 switch 走线，部署后用 `nvidia-smi topo -m` 验收 PIX/NV 标记（见 [性能基线与验收](../07-可靠与评估/性能基线与验收.md)）。
- IOMMU 策略要显式决策：安全要求（隔离、热迁移）与 P2P 性能冲突；虚拟化集群常默认开 IOMMU/ACS，AI 裸机集群通常为性能关闭或白名单直通。
- 一致性域内做 checkpoint 更难：成员故障后的语义恢复（脏缓存、在途事务）比消息语义复杂，续训方案要专门覆盖（见 [弹性与容错续训](../04-拓扑组网/弹性与容错续训.md)）。

## 常见坑

- IOMMU/ACS 开启导致 P2P 降级：P2P 被强制经根复合体，`nvidia-smi topo -m` 显示 PHB/SYS，带宽与时延双劣化——最常见的"集群跑不满"根因之一。
- 混淆统一内存与硬件一致性：CUDA 统一内存（页迁移/预取）是软件机制，NVLink C2C 的缓存一致性是硬件域；前者时延不保证，后者只在域内成立。
- GPUDirect RDMA"开了但没打满"：内存注册缓存命中率、对齐、IOMMU 映射粒度不当都会让它悄悄退化回 bounce buffer 路径。
- 滥用域内原子操作做跨卡同步：一致性域的原子操作时延仍显著高于本地，锁竞争会吃掉全部收益（优化手段见 [通信优化技术](../05-集合通信/通信优化技术.md)）。

## 关联

- [NVLink与NVSwitch](NVLink与NVSwitch.md)：一致性域的物理载体。
- [PCIe层级](PCIe层级.md)：GPUDirect 的亲和前提。
- [网卡与DPU](../03-跨机网络/网卡与DPU.md)：RDMA 端点视角。
- [NCCL](../05-集合通信/NCCL.md)、[通信优化技术](../05-集合通信/通信优化技术.md)：利用这些机制的软件层。
- [开放互联路线](开放互联路线.md)：UALink 把一致性语义带入开放标准。
