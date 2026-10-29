---
title: "Scale-Up 互联：NVLink 与 NVSwitch"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "nvlink", "scale-up"]
summary: "定义 GPU 集群机架内一跳域：NVLink 代际带宽、NVSwitch 全互联与 NVL72 铜背板，以及 TP 为什么离不开它。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["纵向扩展互联", "NVLink Scale-Up"]
sources: []
name_zh: "Scale-Up 互联 NVLink 与 NVSwitch"
---

# Scale-Up 互联：NVLink 与 NVSwitch

> 中文简称：Scale-Up 互联 NVLink 与 NVSwitch

> **一句话理解**: Scale-Up 就是把一个机架内的 GPU 用专用高速线连成「一台大电脑」——NVLink 决定线有多粗，NVSwitch 决定域有多大，两者合起来决定一台「逻辑单机」最多能装多少张卡。

---

## 一、Scale-Up 域的定义

Scale-Up（纵向扩展）指用专用互联把多个 GPU（以及 CPU）组成一个一跳可达的共享高带宽域，对外表现为一台逻辑大机器。判断「是否在同一个 scale-up 域」，看四个特征：

- **物理范围**：节点内（8 卡 HGX）或机架内（GB200 NVL72 的 72 卡），流量不出机架、不进外部交换网。
- **带宽量级**：每 GPU 聚合带宽以 TB/s 计（NVLink5 双向 1.8TB/s），比跨机网络的 400G/800G 口径高约一个数量级。
- **延迟量级**：约 1µs 级（含 NVSwitch 一跳），抖动小、确定性强，可以放进计算的同步关键路径。
- **不占外部网络预算**：域内流量不上交换网，scale-out 的收敛比与容量设计可以独立展开。

例：一台 8 卡 H100 服务器是一个 scale-up 域；一台 GB200 NVL72 是一个更大的 scale-up 域，域内任意两卡一跳互通。

与之相对的是 Scale-Out（横向扩展）：跨节点、跨机架，走 IB/RoCE/以太交换网。两者不是二选一，而是先把一跳域做大，再决定需要多少个域、域间怎么连——这正是拓扑分册要展开的问题。

---

## 二、NVLink 代际演进

NVLink 是 NVIDIA 的 GPU 专用互联协议（高速差分串行链路），官方宣传口径统一为每 GPU 聚合双向带宽：

| **代际** | **代表 GPU** | **单卡双向带宽** | **单链路双向** | **每卡链路数** |
|---|---|---|---|---|
| NVLink1 | P100（2016） | 160GB/s | 40GB/s | 4 |
| NVLink2 | V100（2017） | 300GB/s | 50GB/s | 6 |
| NVLink3 | A100（2020） | 600GB/s | 50GB/s | 12 |
| NVLink4 | H100 SXM（2022） | 900GB/s | 50GB/s | 18 |
| NVLink5 | B200 / GB200（2024） | 1.8TB/s | 100GB/s | 18 |

三条规律：

1. 单卡双向带宽每代大约翻倍，代差直接决定一跳域内的通信预算。
2. 每卡链路数从 4 涨到 18，封装、基板走线与背板成本同步上升——这是 scale-up 域越做越大、越依赖铜背板的物理原因。
3. 口径警示：表中全部为双向口径。与单向口径的网络参数（如单向有效吞吐）对比时，先除以 2 再比。

NVLink 承载的不只是 GPU 互联：NVLink-C2C 把 Grace CPU 与 GPU 连成一致性超节点；NVLink Fusion 进一步把第三方芯片接入同一 fabric（见本系列 NVLink Fusion 页）。

---

## 三、NVSwitch：把点对点链路变成全互联交换

只有 NVLink 链路时，GPU 之间只能按固定拓扑部分直连；NVSwitch 把这些链路接入交换芯片，让域内任意两卡全带宽互通：

- **全互联（any-to-any）**：HGX H100 基板上集成 4 颗第三代 NVSwitch，任意 GPU 对之间都有满速路径，集合通信算法不必迁就硬件拓扑。
- **NVLS 多播（NVLink SHARP）**：第三代 NVSwitch 起支持在交换芯片内完成归约与多播，把 AllReduce/AllGather 的一部分计算下沉到交换机，减少数据在 GPU 之间的搬运次数。
- **SHARP 思想的两套实现**：NVLink 域内的 NVLS 与 IB 网络中的 SHARP 是同一思想——把集合操作塞进交换机，协议分册专门展开。

一句话：NVLink 决定「线有多粗」，NVSwitch 决定「域有多大、集合通信有多省」。从 GB200 代际起，NVSwitch 以独立托盘形态挂在机架背板上，成为机架级 fabric 的核心部件。

---

## 四、GB200 NVL72：铜背板上的一跳域

GB200 NVL72 是 scale-up 推进到机架级的代表形态：

- 72 张 B200 GPU 与 36 颗 Grace CPU，组成 18 个计算托盘和 9 个 NVSwitch 托盘，装进一个机架。
- 全部 GPU 经第五代 NVSwitch 一跳互通，形成 72 卡单一 NVLink 域；机架聚合 NVLink 带宽约 130TB/s（72 × 1.8TB/s 的双向聚合口径）。
- 托盘之间用铜背板直连（数千根铜缆），不走光模块：短距铜互联的成本与功耗远低于等量光互联，代价是机架形态固定、域不能跨机架延伸。
- 功率密度跨入必须液冷的区间，交付形态从「服务器 + 交换机」变成「整机架一体交付」。

对高网设计的含义：NVL72 把「一台机器」的定义从 8 卡扩到 72 卡，原本跨节点的 TP/EP 通信被收进机架，跨机架流量主要剩 DP/PP 与部分 EP——集群 scale-out 的流量模型因此改变，容量规划必须先问 NVLink 域有多大。

---

## 五、为什么 TP 重度依赖 Scale-Up

张量并行（Tensor Parallelism，TP）把单层矩阵乘切到多卡，Megatron 风格实现里每层前向/反向各做两次 AllGather/Reduce-Scatter（每层 4 次集合通信），这些特点决定 TP 必须住在 scale-up 域内：

- **频次极高**：通信嵌在每一层的计算关键路径上，无法靠算通重叠完全掩盖。
- **延迟敏感**：单次通信量不大（MB 级），但次数极多，每跳延迟每加 1µs 都会被放大数千倍。
- **带宽敏感**：大激活张量的 AllGather 需要接近显存读写量级的带宽，只有 TB/s 级 NVLink 扛得住。

粗算一笔账（量级示意）：百 MB 量级的一次 AllGather，在 900GB/s 双向带宽下约 0.1ms 量级完成；同样的量落到跨机 400G 端口（每方向线路速率约 50GB/s，还要在多卡间分摊），要慢接近一个数量级，且每次都要吃满网络延迟。

经验法则：TP 组优先放进同一个 NVLink 域（节点内或 NVL72 内）；跨节点 TP 是不得已的选择，且必须配 RDMA 网络与拓扑对齐调度。MoE 的专家并行（EP）在域内路由激活时同理受益。反例是常见故障模式：TP 组跨节点后，微秒级网络延迟叠加交换机排队，训练 step time 出现「莫名变慢」。

---

## 六、NVLink 与 PCIe 对比

| **维度** | **NVLink5** | **PCIe 5.0 x16** |
|---|---|---|
| 带宽 | 1.8TB/s（每卡双向聚合） | 128GB/s（双向；单向 64GB/s） |
| 定位 | GPU 专用互联 fabric | 通用主机/外设总线 |
| 拓扑 | 经 NVSwitch 全互联 | 树状（Root Complex / PCIe Switch） |
| 访问语义 | 可直接 load/store 对端显存 | 依赖 DMA 与地址映射 |
| 典型延迟 | 对端 GPU 约 1µs 级 | 跨 CPU 约 2µs 级 |

数量级结论：NVLink5 单卡带宽约为 PCIe5 x16 的 14 倍。GPU 之间的热路径（TP 通信、专家路由、KV 共享）应留在 NVLink 域；PCIe 留给 GPU-CPU 协作、网卡、NVMe 这类不需要 TB/s 的通路。

另一个常被忽略的细节：每卡一张 400G 网卡通常也挂在 PCIe5 上，PCIe 带宽要同时为 GPU-CPU 交换与网卡收发留预算；小集群用 PCIe P2P 跨卡通信能跑，但带宽与延迟各差一个量级，只适合验证与轻负载。

---

## 七、上手验证：看清你的一跳域

部署与排障时，先用两条命令确认 scale-up 域的真实拓扑与健康度：

```bash
# 查看 GPU 互联拓扑矩阵：NV# 表示经 NVLink 互通，PIX/PXB/SYS 表示绕行 PCIe 或跨 CPU
nvidia-smi topo -m

# 查看 NVLink 链路状态（排查降速与断链）
nvidia-smi nvlink -s
```

检查两点：一是拓扑矩阵中 TP 组内两两之间应以 NV 开头（如 NV18），出现 SYS/PHB 说明通信绕行 PCIe；二是链路状态应为 Active 且宽度满配。NVLink 降速是训练「无报错但变慢」的高频根因，先把域看清楚，再谈调优。

---

## 交叉引用

- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/02_Scale_Out_IB_RoCE_TCP|Scale-Out 互联三档选型]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/06_Bandwidth_Latency_Cheat_Sheet|带宽延迟数量级速查]]
- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/06_Supernode_MegaPod_MultiPlane|超节点与 MegaPod 多平面]]
- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/04_SHARP_In_Network_Computing|SHARP 网内计算]]
- [[概念/GPU/nvlink|NVLink 概念页]]
- [[概念/GPU/gpu-interconnect|GPU 互联]]

---

*Last updated: 2026-10-27*
