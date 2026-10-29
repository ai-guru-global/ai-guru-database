---
title: "亲和性与拓扑调度"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "numa", "scheduling"]
summary: "从 NUMA、GPU、NIC 三层亲和到 NCCL 拓扑利用与 K8s 拓扑感知调度，讲清让物理网络发挥实力的软件摆放规则与验证命令。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["亲和性拓扑调度", "Affinity and Topology Scheduling"]
sources: []
name_zh: "亲和性与拓扑调度"
---

# 亲和性与拓扑调度

> 中文简称：亲和性与拓扑调度

> **一句话理解**: 再好的物理网络也架不住调度器乱放——GPU、网卡、NUMA 同侧对齐、通信组整组同置，是 rail 优化网络发挥实力的软件前提。

---

## 一、三层亲和：NUMA、GPU 与 NIC 同侧

一台 8 卡机内，GPU 分挂两颗 CPU，每颗 CPU 各管一半 GPU 与一半网卡。进程若跑在 CPU0 却用 CPU1 侧的网卡收发，数据就要跨 socket 走一次，延迟与带宽双输。这就是三层亲和要管的事：

| **亲和层级** | **对齐对象** | **错配后果** |
| --- | --- | --- |
| NUMA | 进程线程与所用 GPU、NIC 同属一个 NUMA 节点 | 跨 socket 访问内存，延迟上升，UPI/PCIe 带宽被浪费 |
| PCIe | GPU 与 NIC 在同一 PCIe switch / root complex 下 | 多过一层转接，P2P 直通与 GPUDirect 路径变差 |
| 物理 rail | GPU i ↔ NIC i ↔ leaf i 一一对应 | rail 优化失效，流量窜到别的 rail 上排队 |

第三层是关键：rail-optimized 拓扑（见 [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/03_Rail_Optimized_Topology|Rail-Optimized 拓扑]]）假定每张 GPU 走「自己的」网卡上「自己的」leaf，软件摆放错位等于把精心设计的多平面当单平面用。

三层里前两层是单机内的物理事实，出厂就定死；第三层则同时取决于接线和调度——同一套硬件，摆放正确与否能差出一个量级的通信效率。

---

## 二、上机验证命令

```bash
# GPU 互联与 NUMA 亲和矩阵：看 NV#（NVLink 直连数）、PIX/PHB（PCIe 层级）、
# NODE/SYS（同/跨 NUMA）、以及 CPU Affinity 与 NIC Affinity 列
nvidia-smi topo -m

# RDMA 设备与 Linux 接口名的映射：确认 GPU 旁边到底是哪张网卡、状态是否 Up
ibdev2netdev

# CPU 侧 NUMA 划分与各节点内存容量
lscpu | grep -i numa

# 把推理/训练进程绑定到 GPU 所在 NUMA 节点（示例：node 1）
numactl --cpunodebind=1 --membind=1 python3 serve.py
```

```text
# nvidia-smi topo -m 输出示意（节选，实际为 8×8 矩阵加 Legend）
GPU0  GPU1  ...  NIC0  NIC4  CPU Affinity    NUMA Affinity  NIC Affinity
GPU0   X    NV18      PIX   SYS    0-31,64-95         0            NIC0
GPU4  SYS   SYS       SYS   PIX    96-127,160-191     1            NIC4
```

读法：NV18 表示两卡间有 18 条 NVLink 直连；PIX 是同 PCIe switch、PHB 是同主桥不同 switch、SYS 是跨 socket；NUMA Affinity 与 NIC Affinity 列直接给出「这张卡该用哪张网卡」。

两条硬性检查：每张 GPU 的 NIC Affinity 与预期 rail 一致；所有 RDMA 设备状态为 Up、接口名与配置一致。任何一条不过，后面的性能调优都是在错误的地基上盖楼。上线前的检查清单化做法见 [[12_架构基建/08_网络/05_网络_Diagnostics_命令|网络 Diagnostics 命令]] 与 [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/02_Network_Diagnostics_Command_Chain|网络诊断命令链]]。

---

## 三、NCCL 如何自动利用拓扑

NCCL 初始化时会枚举总线和网络拓扑生成拓扑 XML（可用 NCCL_TOPO_FILE 固定一份已知良好的拓扑），然后做两件事：

- **决定环顺序**：按「快链路相邻」原则排 ring，NVLink 直连的卡排在一起，跨机段落落在 NUMA 亲和的 NIC 上，避免数据绕远路；
- **选择算法**：NVSwitch 机器上启用 NVLS，跨机场景在 ring/tree 之间按消息大小切换。

排查手段是 NCCL_DEBUG=INFO：观察 comm 建立时打印的 ring/graph 与所选 NIC，若发现跨机段绑到了非亲和网卡或环在机间来回跳，就要回头查第一节的三层亲和。调优展开见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/03_NCCL_Tuning|NCCL 调优]] 与 [[概念/GPU/nccl|NCCL]]；通信与计算的重叠利用见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/04_Compute_Comm_Overlap|计算与通信重叠]]。

一个快速自检：同一组通信基准在不同节点组合上跑，若带宽数据离散度大，多半是拓扑摆放问题而不是链路问题；基准工具的读数方法见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/06_NCCL_Tests_Reading|NCCL Tests 结果解读]]。

---

## 四、K8s 侧：拓扑感知分配与 gang 调度

裸机时代靠 numactl 与运维纪律，K8s 时代要靠调度器把同样的规则自动化：

- **device-plugin 的 topology-aware allocation**：NVIDIA device plugin 向 kubelet 上报 GPU 的 NUMA/PCIe 拓扑提示，把「同侧的 GPU + NIC + CPU」成组分配给同一 pod，演进方向是 DRA（动态资源分配）；
- **gang scheduling**：Volcano、Kueue 等保证通信组要么整体同时启动、要么都不启动——部分成员占坑不干活会造成资源假死与 NCCL init 超时；
- **拓扑感知调度器**：同一通信组的 pod 尽量放进同一 leaf 甚至同一 spine 域，跨组才跨域，把稀缺的低跳数路径留给组内高频通信。

并行策略与拓扑粒度的匹配关系见 [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/05_Topology_Parallel_Matching|拓扑与并行的匹配]]；多层数据中心的落位策略见 [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/04_CLOS_Two_Three_Layer_Scaling|CLOS 两三层扩展]]。

这三件事缺一不可：只做拓扑分配不做 gang，组凑不齐照样 hang；只做 gang 不做拓扑感知，组凑齐了却被放进错误的域。

---

## 五、反例：通信组被打散的代价（定性）

某次扩容高峰，默认 spread 调度把一个 64 卡通信组的成员打散到 8 个不同 spine 域下。NCCL 拓扑探测照样能建环——环被迫跨 spine 绕远路，跳数增加、共享上行链路排队，AllReduce 实测性能掉 30% 以上（定性经验值）。

更隐蔽的伤害在长尾：个别成员每次都要跨域，成为慢者（straggler），全组的集合通信被最慢成员拖着走，P99 显著恶化，且问题随其他租户流量波动「时好时坏」，难复现。定位思路：先比对「组员拓扑分布」与「通信热点」是否错位，再进入 [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/03_Straggler_Identification|Straggler 识别]] 的排查流程。

预防方式是把拓扑约束写进调度器的硬约束：通信组跨 spine 比例超过阈值就拒绝放置或触发整组重排，而不是靠事后人工巡检发现。

---

## 六、调度与故障联动

- **坏机/坏网卡规避**：故障节点从可分配池摘除后，拓扑约束要同步收缩——例如坏一台 leaf 下的机器，调度器应优先在同 leaf 域内找替补，而不是随手补一个远域节点；
- **整组重排**：通信组成员故障触发 gang 语义的整组重建或 checkpoint 回退，避免「半死组」长期占资源；训练侧的处置手册见 [[07_模型训练/04_分布式训练/04_分布式训练_Hang_操作手册|分布式训练 Hang 操作手册]]；
- **告警联动**：拓扑错配（组员跨域比例）应作为集群级告警接入运维面板，与链路质量告警并列，整体运维节奏见 [[13_运维/02_SRE与可靠性/10_GPU_集群_Operations_2026|GPU 集群 Operations 2026]]。

调度与故障是一对动态约束：可用拓扑随故障收缩，调度器每次重排都要重新做一次亲和与同置检查，而不是只在首次放置时认真一次。

---

## 交叉引用

- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/03_Rail_Optimized_Topology|Rail-Optimized 拓扑]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/03_NCCL_Tuning|NCCL 调优]]
- [[概念/GPU/nccl|NCCL]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/02_Network_Diagnostics_Command_Chain|网络诊断命令链]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/03_Straggler_Identification|Straggler 识别]]
- [[07_模型训练/04_分布式训练/04_分布式训练_Hang_操作手册|分布式训练 Hang 操作手册]]

---

*Last updated: 2026-10-27*
