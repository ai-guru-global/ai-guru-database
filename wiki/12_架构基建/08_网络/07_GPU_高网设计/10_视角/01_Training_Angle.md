---
title: "训练工程师视角：把 GPU 高网当手册用"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "training", "mfu"]
summary: "训练侧的 GPU 网络速查：各阶段流量画像、MFU 通信归因、hang/loss spike 排查顺序、提需求模板与常用命令。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["训练视角", "Training Angle"]
sources: []
name_zh: "训练工程师视角"
---

# 训练工程师视角：把 GPU 高网当手册用

> 中文简称：训练工程师视角

> **一句话理解**: 训练慢先别急着怪模型和代码——MFU 上限与 hang 排查速度，很大程度由这张网络决定。

---

## 一、训练各阶段网络需求速查

同一份训练作业，不同阶段对网络的要求完全不同。先分清「走哪张网、什么流量特征」，提需求和排障都不会跑偏。

| **阶段** | **走哪张网** | **流量特征** | **网络关注点** |
| --- | --- | --- | --- |
| 数据加载（读样本/tokenize） | 存储网（以太或 RoCE） | 持续大流、读放大 | 带宽水位、与计算网隔离 |
| 前向/反向每 step | 计算网（scale-up + scale-out） | AllReduce/AllGather/ReduceScatter，强同步 | busbw 达标、拓扑亲和、通信重叠 |
| MoE 层专家分发 | 计算网（跨机为主） | All-to-All 突发、不均衡 | 尾延迟、逐 token 小消息 |
| checkpoint 写出 | 存储网 | 突发大流（GB 到 TB 级） | 限速与缓冲，避免压垮存储面 |
| eval / 生成式评测 | 两张网均少量 | 低频小包 | 不与训练主流量争带宽 |

两条结论：计算网要「快」（带宽、时延、拓扑一起看），存储网要「稳」（绝不干扰计算网）；因此物理或逻辑隔离是默认设计，详见 [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/03_Multi_Plane_Network_Segmentation|多平面网络分割]]。

---

## 二、MFU 与通信：串行通信直接吃掉算力利用率

MFU 的分母是墙钟 step 时间。通信只要没被计算盖住，就会 1:1 加长 step：

```text
MFU ≈ 理论计算时间 ÷（理论计算时间 + 串行通信时间 + 空闲等待）
```

算例：每 step 纯计算 800ms、串行通信 200ms，step 拉长到 1s，MFU 直接打 8 折；若把其中 150ms 重叠进计算，MFU 恢复到约 94%。通信优化的全部杠杆就在「串行」二字上。

各并行方式的通信画像（详见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/01_Collectives_Parallel_Mapping|集合通信与并行的映射]]）：

| **并行方式** | **集合通信原语** | **消息特征** | **敏感维度** |
| --- | --- | --- | --- |
| 数据并行 DP | AllReduce（梯度） | 大消息、每 step 一次 | 带宽 |
| 张量并行 TP | AllReduce/AllGather（每层激活） | 小消息、每层多次 | 时延 |
| 序列/上下文并行 | ReduceScatter + AllGather | 中等、随序列长度增长 | 带宽 + 时延 |
| 专家并行 EP（MoE） | All-to-All | 突发、不均衡 | 尾延迟 + 带宽 |

经验规律：大消息看带宽（Ring 把瓶颈锁在单条链路上），小消息看时延（层数 × 次数放大），详见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/02_Ring_vs_Tree_AllReduce|Ring 与 Tree AllReduce]]。

---

## 三、loss spike / hang：先 NCCL 日志，再拓扑，再链路

排查顺序固定：**先拿 NCCL 日志 → 再看拓扑与亲和 → 再查链路层 → 最后才怀疑应用代码**。前两步在作业侧即可完成，第三步才需要网络团队介入。

```bash
# 第 1 步：NCCL 日志（保住现场，别急着重启）
NCCL_DEBUG=INFO NCCL_DEBUG_SUBSYS=INIT,GRAPH,TUNING torchrun train.py
# 看点：选了什么 alg/proto、通道数、WARN 与 timeout、卡在哪个 rank

# 第 2 步：拓扑与亲和（本机两条命令）
nvidia-smi topo -m      # GPU-NIC 亲和矩阵，检查 PIX/PHB 跨越
numactl -H              # NUMA 与网卡是否同侧

# 第 3 步：链路层（与网络团队一起）
ibstat                                          # 端口状态与速率（400G 是否已降速）
ethtool -S <netdev> | grep -Ei "crc|pause|drop" # 错误计数增量
```

| **现象** | **常见网络原因** | **落点页** |
| --- | --- | --- |
| 集合通信 hang（默认约 30 分钟超时） | 某 rank 链路劣化或丢包重传，全员等齐 | [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/03_Straggler_Identification|慢节点定位]] |
| loss spike 后自行恢复 | 链路误码（CRC）引发重传抖动、梯度迟到 | [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/01_Failure_Distribution_Patterns|故障分布模式]] |
| 多机比单机慢数倍 | 跨机走了以太 fallback、未启用 GPUDirect | [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/06_GPUDirect_Family|GPUDirect 家族]] |
| 固定卡数才慢（如 64 的倍数） | 作业拓扑跨轨道、rail 不对齐 | [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/03_Rail_Optimized_Topology|轨道优化拓扑]] |

hang 的操作级处置手册见 [[07_模型训练/04_分布式训练/04_分布式训练_Hang_操作手册|分布式训练 Hang 操作手册]]。

---

## 四、「为什么我的 MFU 只有 40%」分层归因表

从上往下排，一层排掉再进下一层，不要跳步：

| **层级** | **要问的问题** | **典型症状** | **验证手段** |
| --- | --- | --- | --- |
| ① 并行切法 | TP/PP/DP 比例是否匹配模型与集群 | TP 跨机后每层都在等通信 | NCCL 日志中的算法与消息大小分布 |
| ② 通信重叠 | 串行通信有没有被计算盖住 | GPU 利用率周期性掉到 0 | profiler 看通信 kernel 占比与空洞 |
| ③ 网络健康 | busbw 是否达标、有无降速链路 | nccl-tests 跑不出基线值 | 全组 nccl-tests 回归比对历史基线 |
| ④ 慢节点 | 是否个别 rank「一慢俱慢」 | 只有固定几台机器指标异常 | straggler 定位 + 逐机打流 |

第 ③ 层怎么读数见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/06_NCCL_Tests_Reading|nccl-tests 结果解读]]；第 ② 层的手段见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/04_Compute_Comm_Overlap|计算通信重叠]]。

---

## 五、给网络团队提需求的正确姿势

「网络慢，帮我看下」是无法执行的工单。网络团队需要的最小信息集：

| **要素** | **要写清** | **反例** |
| --- | --- | --- |
| 消息大小 | 分布而非均值（P50/P99，如 256MB allreduce） | 「传很多数据」 |
| 频率 | 每 step 次数 × step 时长 | 「很频繁」 |
| 同步语义 | 同步集合通信还是异步 All-to-All | 不写 |
| 目标口径 | busbw/时延期望（如 400G 口径 ≥ 45GB/s） | 「越快越好」 |
| 作业拓扑 | 节点数、PPN、预期 rail 对齐方式 | 不给 hosts 列表 |

一个合格的需求模板：

```text
作业：70B 密集模型，TP=8 × PP=4 × DP=16，共 512 卡，PPN=8
通信：每 step 一次 1.4GB 梯度 AllReduce（跨机为主）
期望：跨机 allreduce busbw ≥ 45GB/s（400G 口径、256MB 消息）
现象：1024 卡组 busbw 仅 20GB/s，64 卡组正常；NCCL 日志已归档
```

---

## 六、一页速查：常用环境变量与命令

| **项** | **常用值/命令** | **用途** |
| --- | --- | --- |
| NCCL_DEBUG | INFO（配合 SUBSYS=INIT,GRAPH,TUNING） | 拿到算法与通道选择依据 |
| NCCL_IB_HCA | =mlx5_0,…,mlx5_7 | 锁定 IB 网卡，防以太 fallback |
| NCCL_SOCKET_IFNAME | =eth0 | 控制初始化/带外流量走哪张卡 |
| NCCL_MAX_NCHANNELS | 8–32 | 提高通道并行度压满多 rail |
| NCCL_ALGO / NCCL_PROTO | Ring/Tree；Simple/LL128 | 复现或排查算法选择问题 |
| nvidia-smi topo -m | — | GPU-NIC 亲和矩阵 |
| ibstat / ethtool -S | — | 端口速率与错误计数 |
| all_reduce_perf | -b 8M -e 1G -f 2 | busbw 基线测试 |

拿到一台新机器，60 秒体检：

```bash
nvidia-smi topo -m                        # 亲和是否健康（不跨 PCIe 桥）
ibstat | grep -E "Rate|State"             # 8 张网卡是否满速 LinkUp
ib_write_bw -a -d mlx5_0 --report_gbits   # 与对端打流验证单链路线速
```

系统性调参见 [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/03_NCCL_Tuning|NCCL 调参]]；跨团队协作界面见 [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/03_Ops_Angle|网络运维视角]]，推理侧对照见 [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/02_Inference_Angle|推理工程师视角]]。

---

## 交叉引用

- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/03_NCCL_Tuning|NCCL 调参]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/06_NCCL_Tests_Reading|nccl-tests 结果解读]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/04_Compute_Comm_Overlap|计算通信重叠]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/03_Straggler_Identification|慢节点定位]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/03_Ops_Angle|网络运维视角]]
- [[07_模型训练/04_分布式训练/04_分布式训练_Hang_操作手册|分布式训练 Hang 操作手册]]

---

*Last updated: 2026-10-27*
