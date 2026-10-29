---
title: "TP 跨机的时延账"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "tensor-parallel", "latency"]
summary: "算清 decode 阶段 TP 跨机后每层 AllReduce 的微秒级时延如何被层数与 token 数放大成 TPOT 劣化，并给出跨机扩展的经验法则。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["TP 跨机时延", "TP Cross-Node Latency"]
sources: []
name_zh: "TP 跨机的时延账"
---

# TP 跨机的时延账

> 中文简称：TP 跨机的时延账

> **一句话理解**: TP 一旦跨机，模型每一层都要多做一次跨机 AllReduce——每层多几 µs 看似不多，乘上约 80 层再乘上每个生成的 token，decode 延迟就被悄悄吃掉一大截。

---

## 一、通信从哪来：每层的 AllReduce 是激活求和

Tensor Parallelism 把每层权重按注意力头与 FFN 中间维切成 8 份（TP8），每卡只持有一份分片；但 LayerNorm 与残差连接需要全量激活，于是每个 transformer 层要做两次 AllReduce——attention 输出之后一次、FFN 输出之后一次——把各卡的部分和加总并广播回全量。

同一个 AllReduce 在训练与 decode 里性质完全不同：训练与大 batch prefill 的消息是 tokens × hidden × 2B、动辄几十 MB，带宽主导且能与反向计算 overlap，所以训练里跨机 TP 很常见；decode 的 batch 小，消息跌到 KB 到百 KB 级，延迟主导且不可 overlap，跨机 TP 的账在 decode 里算（流量背景见 [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/01_Training_vs_Inference_Traffic|训练与推理流量模型对比]]）。

先把两类域能力摆在一起：

| **互联形态** | **带宽口径** | **小消息集合通信时延** |
| --- | --- | --- |
| NVLink4 + NVSwitch（传统 8 卡机） | 900GB/s（双向，官方口径） | 机内 ~1µs 级 |
| NVLink5 + NVSwitch（NVL72 超节点） | 每卡 1.8TB/s（双向） | 机内 ~1µs 级，电域扩到 72 卡 |
| 跨机 RDMA（ConnectX-7 400G，一跳交换） | 每卡 400Gbps，约 50GB/s 单向 | 每次再 +2-5µs |
| 跨机 RDMA（ConnectX-8 800G，一跳交换） | 每卡 800Gbps | 延迟同量级，带宽翻倍 |

注意 800G 并不会让小消息变快——小消息的速度来自跳数与排队状况，不是线径；带宽口径只在 batch 大时才起作用。

以 70B 级模型（hidden 8192、fp16）为例：batch 32 的 decode 每次消息 = 32 × 8192 × 2B = 512KB，ring 切分后每卡发送约 2 × 512KB ÷ 8 = 128KB，已属小消息；batch 再小就贴近 MTU（4KB 级）。

---

## 二、跨机时延账：70B 模型算例表

以 70B 级模型（约 80 层）、TP8、单机为基线；表中时延为链路侧口径，不含框架与 kernel 启动开销：

| **部署形态** | **单次 AllReduce 的链路侧时延** | **每 token 160 次（80 层 × 2 次）累计** | **TPOT 影响（设机内基线 20ms）** |
| --- | --- | --- | --- |
| 单机 TP8（NVLink/NVSwitch） | ~1µs 级 | 已计入基线 | 基线 |
| 跨机 TP（RDMA，一跳交换、路径空闲） | 每次再 +2-5µs | +320-800µs | P50 劣化约 2%-4% |
| 跨机 TP（多跳、拥塞或被旁路流量干扰） | 每次再 +10µs 级 | +1.6ms 级 | 劣化约 8%，P99 更差 |

如果 TP 扩到 4 机 32 卡，ring 上的跨机段数进一步增加，上表还会恶化；跨机 TP 的代价随节点数超线性上升。

三个叠加效应让这笔账比表面更疼：

1. 串行不重叠：decode 每层通信之后紧跟依赖它的下一步计算，多出的时间 100% 进 TPOT；
2. 按 token 重复：每秒生成 50 个 token，就每秒付 50 遍这笔开销；
3. 带宽同时降级：机内是 NVLink4 900GB/s（双向，官方口径）的域，跨机后每卡只剩一张 400G 网卡（ConnectX-7 一代，约 50GB/s 单向）量级的出口，batch 一大又撞带宽墙——延迟、带宽两头不讨好。

---

## 三、小消息为什么延迟主导

小包的传输时间 = 消息大小 ÷ 带宽：400G 口上 1KB 约 20ns，一个 MTU（4KB 级）也不到 100ns，与任何一跳的排队相比都可以忽略。真正决定时延的是下面这些与带宽无关的项：

| **延迟来源** | **典型量级（路径空闲时）** | **堆带宽能否改善** |
| --- | --- | --- |
| 交换转发与线缆传播（每跳） | 每跳百 ns 级 | 否，只能减少跳数 |
| NIC 与 RDMA 协议栈处理 | 1-2µs 级 | 否，取决于设备与驱动 |
| 排队（buffer 中等待） | 空载近零；有并发流时 µs 到 ms 级 | 否，靠隔离与队列保障 |
| 意外事件（PFC 暂停、重传） | 数 µs 到 ms 级 | 否，靠无损网络调优 |

拆开看一次跨机小消息 AllReduce：本地经 NVLink 取邻居分片（~1µs 级）+ 跨机 RDMA 读写（2-5µs）+ 全组同步，合计 3-6µs；机内 NVLS 一类方案整体 ~1-2µs。差距就是上表里每层 2-5µs 的来源。

结论：decode 的 AllReduce 消息接近或低于 MTU 时，加带宽没有意义；有效的是三件事——少跳数（单层 CLOS）、保隔离（别让大象流进同一队列）、选低时延的交换机与 NIC。速查口径见 [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/06_Bandwidth_Latency_Cheat_Sheet|带宽与时延速查表]]。

---

## 四、跨机 TP 勉强可用的三个条件

跨机 TP 并非绝对禁区，满足以下条件时勉强可用：

1. **batch 足够大（吞吐型场景）**：消息从 KB 级涨到 MB 级后，传输时间虽上升但被更多 token 摊薄，通信占比反而下降——离线批处理可接受，在线 decode 不满足；
2. **节点数少**：2 机 16 卡的路径深度与 fan-in 远好于 8 机 64 卡，抖动与故障面也小；
3. **定制低延迟 allreduce**：one-shot/直写式 allreduce、NVSHMEM、引擎内 custom allreduce 一类方案把跨机小消息 AllReduce 压回低 µs 级，才勉强追平机内体验。

一个实际判断标准：把「每层额外时延 × 每层 2 次 × 层数」与目标 TPOT 的 1%-3% 预算比较，超过就不该跨机。在线服务通常不满足条件 1，所以工业界的默认结论是：decode 阶段 TP 不跨机。

---

## 五、EP/PP 跨机为什么可接受

| **并行策略** | **跨机原语** | **通信频率** | **与计算的可重叠性** | **跨机评价** |
| --- | --- | --- | --- | --- |
| TP | AllReduce | 每层 2 次、全组同步 | decode 下几乎不可重叠 | 不推荐跨机 |
| PP | P2P send/recv | 每层 1 次、仅相邻两卡 | microbatch 流水线天然重叠 | 可接受 |
| EP | All-to-All | 每 MoE 层 2 次 | 可与 attention/共享专家部分重叠 | 大 MoE 的主流选择 |
| DP | AllReduce（仅训练） | 每 step 1 次 | 可与计算重叠 | 无碍 |

PP 的跨机通信只有相邻 stage 之间的激活 P2P，被流水线掩盖；EP 的 All-to-All 虽然也频繁，但 dispatch/combine 可通过 hook 与其他计算重叠，且不要求全组在同一瞬间同步求和，对微抖动的容忍度更高。多机 EP 的完整展开见 [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/05_EP_Multi_Node_Network|EP 多机推理网络]]；各并行策略与集合通信原语的对应见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/01_Collectives_Parallel_Mapping|集合通信与并行的映射]]。

注意 EP 的 All-to-All 在 decode 下同样是小包流，只是容忍度更高——网络设计仍要按小包低抖动的标准来做，不能拿训练大流的调参直接套用。

---

## 六、经验法则与 NVLink 域的联动

经验法则两条：TP 不跨出单机 NVLink 域（传统 8 卡机即 TP≤8）；需要跨机扩展时优先 EP + DP，decode 尤其如此。NVLink 域的大小直接决定这条法则的边界：

- 传统 8 卡机：NVLink 域 = 8 卡，TP8 到顶，再大就必须跨机付本页的时延账；
- GB200 NVL72 一类超节点：72 卡同处一个 NVLink5 域（每卡 1.8TB/s，双向口径），TP16/TP32/TP72 仍是「机架内电域」，不跨出 NVLink 域就不触发跨机 RDMA 时延——NVL72 实际把「跨机 TP 问题」改写成「跨出机架才有的问题」。

Scale-Up 域与机架内铜互联的展开见 [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/01_Scale_Up_NVLink_NVSwitch|Scale-Up NVLink/NVSwitch]]、[[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/04_NVLink_Fusion|NVLink Fusion]] 与 [[12_架构基建/08_网络/07_GPU_高网设计/02_物理层硬件/05_Intra_Rack_Copper|机架内铜互联]]。

放进系列全景：Scale-Up 域负责把同步通信圈进电域，Scale-Out 域承载 EP/PP/DP 与 KV 迁移，分层边界见 [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/02_Scale_Out_IB_RoCE_TCP|Scale-Out IB/RoCE/TCP]]。

---

## 交叉引用

- [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/01_Training_vs_Inference_Traffic|训练与推理流量模型对比]]
- [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/05_EP_Multi_Node_Network|EP 多机推理网络]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/02_Ring_vs_Tree_AllReduce|Ring 与 Tree AllReduce]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/05_Collective_Libraries_Alternatives|集合通信库替代方案]]
- [[概念/GPU/model-parallelism|模型并行]]
- [[10_部署推理/03_推理优化/18_Parallel_策略_深入分析|Parallel 策略深入分析]]

---

*Last updated: 2026-10-27*
