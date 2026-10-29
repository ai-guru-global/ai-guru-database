---
title: "面试速览：GPU 高网高频 25 题"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "interview", "cheatsheet"]
summary: "GPU 高性能网络面试速查：五组高频 25 题的答题框架（含关键数字口径）、数字类快问快答与反问面试官的 5 个好问题。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["面试题速查", "Interview Cheatsheet"]
sources: []
name_zh: "面试速览"
---

# 面试速览：GPU 高网高频 25 题

> 中文简称：面试速览

> **一句话理解**: 把本系列的 25 个最常被问的问题各压缩成 3–5 行答题框架，面试前 30 分钟过一遍就能上场。

---

## 一、基础分层 5 题

**Q1｜为什么分 scale-up / scale-out？**
- 机内与跨机的带宽、时延需求差 1–2 个数量级，成本结构完全不同
- scale-up：NVLink4 900GB/s、NVLink5 1.8TB/s（双向，NVIDIA 官方口径），微秒级时延
- scale-out：IB NDR 400G / XDR 800G（单端口线速口径），时延高一档
- 一张网兜所有需求，要么浪费要么不够，所以分层
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/01_Scale_Up_NVLink_NVSwitch|Scale-Up NVLink/NVSwitch]]、[[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/02_Scale_Out_IB_RoCE_TCP|Scale-Out IB/RoCE/TCP]]

**Q2｜NVLink 为什么快？**
- 专用协议 + 内存语义，GPU 显存直连，不穿 PCIe/TCP 协议栈
- NVSwitch 提供任意点对点全互联，无跳数竞争
- 对照 PCIe5 x16 128GB/s（双向）：NVLink4 900GB/s、NVLink5 1.8TB/s（双向）
→ 详见 [[概念/GPU/nvlink|NVLink 概念页]]、[[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/01_Scale_Up_NVLink_NVSwitch|Scale-Up NVLink/NVSwitch]]

**Q3｜scale-out 三档（IB / RoCE / TCP 以太）怎么选？**
- IB：确定性最好、有 SHARP 与适配路由，最贵、锁定深
- RoCE：性价比之选，但必须调好无损（PFC/ECN），运维门槛在买方
- TCP 以太：零改造兜底，大集合通信性能差数倍，只适合小规模或容忍慢
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/02_Scale_Out_IB_RoCE_TCP|Scale-Out IB/RoCE/TCP]]

**Q4｜训练流量与推理流量画像差在哪？**
- 训练：大消息（256MB 级）、强同步、持续满带宽，看均值带宽
- 推理：小包（微秒级）、时延敏感、突发，看 P99
- 这决定了训练网追求确定性带宽、推理网追求隔离与低抖动
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/01_Training_vs_Inference_Traffic|训练 vs 推理流量画像]]

**Q5｜为什么计算网/存储网/带外网要分平面？**
- checkpoint 突发大流会挤占同步集合通信，带外要保证主网故障时仍可达
- 隔离让故障域与带宽预算互不侵蚀，是默认设计而非优化项
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/03_Multi_Plane_Network_Segmentation|多平面网络分割]]

---

## 二、拓扑 5 题

**Q6｜怎么判断网络无阻塞？**
- 看对分带宽（bisection）：任意二分切面的可用带宽不打折，即 1:1 收敛
- Fat-Tree/CLOS 在 1:1 时任意两端口间存在等宽路径
- 判定靠端口数收支：下行聚合 = 上行聚合
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/01_Fat_Tree_CLOS|Fat-Tree CLOS]]

**Q7｜收敛比怎么取舍？**
- 训练重 allreduce → 1:1 或轻度收敛（2:1），推理可放宽到 4:1
- 放宽省 spine 与上行光模块（网络 CAPEX 省 20%–40%，定性），代价是峰值受限
- 关键是业务峰值通信量可估，再按预算收敛
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/02_Oversubscription_Design|收敛比设计]]

**Q8｜rail-optimized 拓扑的原理？**
- 每台机器的同号 NIC（rail）接同一台 leaf，8 机一组凑齐 8 条 rail
- 同 rail 通信只穿一层交换机：hop 少、故障域隔离、端口映射可对齐并行切分
- 前提是调度按 rail 分组放置作业（topology-aware scheduling）
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/03_Rail_Optimized_Topology|轨道优化拓扑]]

**Q9｜什么时候需要三层 CLOS？**
- 两层端口数不够：spine 端口池耗尽、规模超出两层上限时加 super-spine
- 代价：hop +1、时延与光模块数量上升（全光口径光模块约为 GPU 的 6 倍，估算）
- 能用两层 + 分平面解决问题就不上三层
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/04_CLOS_Two_Three_Layer_Scaling|CLOS 两层三层扩展]]

**Q10｜超节点（supernode）解决什么？**
- 把 scale-up 域做大：机内/域内大带宽 all-to-all，压低跨机流量占比
- 本质是把「跨机问题」变回「机内问题」，绕开 scale-out 带宽墙
- 副作用：故障域变大、域边界调度复杂、成本向 scale-up 集中
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/06_Supernode_MegaPod_MultiPlane|超节点/MegaPod/多平面]]

---

## 三、协议 5 题

**Q11｜RDMA 为什么快？**
- 内核旁路 + 零拷贝：网卡直接读写远端内存，不经协议栈与两次数据搬移
- 时延从几十微秒级降到个位微秒级（定性量级），CPU 占用大幅下降
- 代价：需要注册内存、网卡队列规划，丢包代价高（引出无损需求）
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/01_RDMA_Semantics|RDMA 语义]]

**Q12｜RoCE 为什么必须无损？**
- RDMA 的重传语义简单（类 Go-Back-N），丢一个包整段重来
- 丢包 → 重传风暴 → 拥塞加剧 → 性能悬崖（不是线性变慢）
- 所以要用 PFC 保不丢 + ECN 控速率，把「丢包」换成「背压」
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/02_Lossless_Ethernet_PFC_ECN_DCQCN|无损以太 PFC/ECN/DCQCN]]

**Q13｜PFC / ECN / DCQCN 的关系？**
- PFC：链路级背压，缓冲区将满时通知上游暂停，保「不丢」
- ECN：拥塞时在 IP 头打标，端到端通知接收端「路上堵了」
- DCQCN：发端根据 ECN 反馈降速（pacing），三层协作避免永远靠 PFC 硬扛
- 风险：PFC 死锁/风暴，需 deadlock-free 队列设计
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/02_Lossless_Ethernet_PFC_ECN_DCQCN|无损以太 PFC/ECN/DCQCN]]

**Q14｜IB 与以太的本质差异？**
- IB：credit-based 流控（天然不丢）、适配路由、SHARP、管理面一体
- 以太：best-effort 起家，RoCE 用 PFC/ECN 补无损，胜在生态与多源
- 速率口径：IB NDR 400G / XDR 800G；以太同代演进 400G/800G
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/05_IB_vs_Ethernet_SpectrumX_UEC|IB vs 以太 SpectrumX UEC]]

**Q15｜SHARP 的原理？**
- 交换机在转发路径上就地做聚合（in-network reduction），allreduce 数据量降为约 1/n
- 「网在中间算」，跳数从劣势变优势，allreduce busbw 明显提升（定性）
- 依赖 IB 交换机支持与 SHARP 组管理，是以太侧目前难以复制的点
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/04_SHARP_In_Network_Computing|SHARP 在网计算]]

---

## 四、性能调优 5 题

**Q16｜Ring AllReduce 为什么带宽最优？**
- 每个参与者收发量恒为 2×(n−1)/n × 数据量，瓶颈锁在单条链路带宽
- 通信时间与节点数 n 基本无关，可扩展性好
- 小消息时 Ring 启动开销大，切换 Tree/其他算法
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/02_Ring_vs_Tree_AllReduce|Ring 与 Tree AllReduce]]

**Q17｜NCCL 怎么调？**
- 顺序：先看 NCCL_DEBUG 日志确认 alg/proto/通道数，再排除网络健康问题，最后才调参数
- 常用：NCCL_MAX_NCHANNELS 压满多 rail、NCCL_IB_HCA 锁网卡、绑定 GPU affinity
- 大多数场景默认即优，「调参」不如「修环境」
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/03_NCCL_Tuning|NCCL 调参]]

**Q18｜busbw 达标线是多少？**
- 口径：nccl-tests 报告的 bus bandwidth，约等于单卡有效通信吞吐
- 经验线：≥ 线速 90%——400G 口径 ≥ 45GB/s、800G 口径 ≥ 90GB/s（256MB allreduce）
- 低于线先查链路降速与 pause，再查通道与亲和
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/06_NCCL_Tests_Reading|nccl-tests 结果解读]]

```bash
# 现场一条命令验证 busbw
all_reduce_perf -b 256M -e 256M -f 2 -w 10   # 看 out busbw 列对照达标线
```

**Q19｜带宽只有预期的 40%，排查顺序？**
- ① 拓扑/亲和：绑错 NIC、跨 NUMA、rail 不对齐（nvidia-smi topo -m）
- ② 链路：降速、CRC、pause 计数（ibstat / ethtool -S）
- ③ 配置：PFC/ECN 门限、GDR 未启用、固件版本不一致
- ④ 参数：消息大小、通道数、算法被误锁
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/02_Network_Diagnostics_Command_Chain|网络诊断命令链]]

**Q20｜通信重叠有哪些手段？**
- DP：梯度分桶（bucket），反向传播与 allreduce 流水交叠
- PP：1F1B 调度，用流水线空泡换通信掩盖
- TP：层内强同步，基本无法重叠，所以更要留在机内
- MoE：All-to-All 与共享专家/非专家计算重叠
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/04_Compute_Comm_Overlap|计算通信重叠]]

---

## 五、推理与运维 5 题

**Q21｜TP 为什么不跨机？**
- TP 每层 2 次集合通信，同步语义、无法重叠
- 算例：80 层模型跨机每次多 50μs → 50μs × 2 × 80 ≈ 8ms，吃掉 TPOT 20ms 预算的四成
- 结论：TP 留机内 NVLink，跨机交给 PP/EP
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/02_TP_Cross_Node_Latency|TP 跨机时延]]

**Q22｜PD 分离的带宽怎么估？**
- 公式：带宽 = 并发数 × 每请求 KV ÷ 时延预算
- 每 token KV = 2 × 层数 × KV 头数 × head_dim × dtype 字节（示例模型约 320KB/token）
- 算例：100 并发 × 4K 上下文（1.3GB/请求）÷ 100ms ≈ 1.3TB/s 聚合带宽
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/03_PD_Disaggregation_KV_Transfer|PD 分离 KV 传输]]

**Q23｜EP（专家并行）的网络特征？**
- All-to-All 为主：突发、按专家热度不均衡、逐 token 小消息
- 对尾延迟敏感：一个慢专家拖住整个 step（一慢俱慢的推理版）
- 组网要点：高 bisection + 低抖动，配合专家放置均衡
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/05_EP_Multi_Node_Network|EP 多机网络]]、[[概念/GPU/expert-parallelism|专家并行概念页]]

**Q24｜光模块为什么是第一大故障源？**
- 数量最多：全光组网下模块数是 GPU 的数倍（两层约 4 倍、三层约 6 倍，估算口径）
- 有源器件 + 对温度敏感：光功率漂移 → 误码 → 降速 → 掉线的渐变链
- 失效常表现为「变慢」而非「断」，靠 DOM 趋势监控提前抓
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/01_Failure_Distribution_Patterns|故障分布模式]]

**Q25｜给你 30 分钟，怎么定位一条慢链路？**
- ① 作业侧拿 NCCL 日志定位慢 rank → 锁定节点（5 分钟）
- ② topo 对齐找到对应 NIC 与 leaf（5 分钟）
- ③ ibstat/ethtool 计数 + DOM 光功率比对基线（10 分钟）
- ④ 单链路打流（ib_write_bw）复现半速（5 分钟）
- ⑤ 隔离换件、回归验证（5 分钟起）
→ 详见 [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/02_Network_Diagnostics_Command_Chain|网络诊断命令链]]、[[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/03_Straggler_Identification|慢节点定位]]

---

## 六、快问快答：数字速记表

| **问题** | **数字（含口径）** |
| --- | --- |
| NVLink4 带宽 | 900GB/s（双向，NVIDIA 官方口径） |
| NVLink5 带宽 | 1.8TB/s（双向） |
| PCIe5 x16 | 128GB/s（双向） |
| IB NDR / XDR | 400G / 800G（单端口线速口径） |
| ConnectX-7 / ConnectX-8 | 400G / 800G |
| Tomahawk 5 交换容量 | 51.2T（整机容量口径） |
| busbw 达标线 | 400G ≥ 45GB/s、800G ≥ 90GB/s（约线速 90%，256MB allreduce） |
| 网络 CAPEX 占比 | 约占集群 CAPEX 10%–20%（行业常引用区间） |
| 光模块配比 | 两层全光约 4× GPU、三层约 6×（估算口径） |

数字的系统出处见 [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/06_Bandwidth_Latency_Cheat_Sheet|带宽时延速查表]]。

---

## 七、反问面试官的 5 个好问题

1. 你们 scale-up 域做多大？跨机流量占总通信量的比例是多少？
2. busbw 的基线是多少、多久做一次全组回归？
3. 过去一年最大的网络故障是什么？（听光模块占比与恢复时长）
4. 选的是 IB 还是 RoCE，当时决策的关键因素是什么？
5. 收敛比和 PD 分离组网是怎么设计的，P99 怎么验收？

好反问的共同点：问「数字与决策过程」，不问「用什么牌子」——前者暴露工程成熟度。

---

## 交叉引用

- [[12_架构基建/08_网络/07_GPU_高网设计/README|GPU 高网设计总索引]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/06_Bandwidth_Latency_Cheat_Sheet|带宽时延速查表]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/06_NCCL_Tests_Reading|nccl-tests 结果解读]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/02_Network_Diagnostics_Command_Chain|网络诊断命令链]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/01_Training_Angle|训练工程师视角]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/02_Inference_Angle|推理工程师视角]]
- [[概念/GPU/nccl|NCCL 概念页]]

---

*Last updated: 2026-10-27*
