---
title: "AI 集群高速网络 2.0 (InfiniBand NDR/XDR / RoCE v2 / 8 卡互联 / GB200 NVL72)"
category: concepts
tags:
  - gpu
  - network
  - infiniband
  - roce
  - rdma
  - nvlink
  - gb200
  - cluster
aliases:
  - AI Cluster Network 2.0
  - InfiniBand NDR/XDR
  - RoCE v2
  - GB200 NVL72
  - Ultra Ethernet
  - AI Fabric
relationships:
  - target: "概念/gpu-interconnect"
    type: extends
  - target: "概念/rdma-roce"
    type: related_to
  - target: "概念/nvlink"
    type: related_to
  - target: "概念/distributed-parallelism"
    type: related_to
summary: "AI 集群高速网络 2.0 是 2024-2026 训练万卡集群的关键基础设施——InfiniBand NDR(400Gbps)/XDR(800Gbps)、RoCE v2(国产替代)、GB200 NVL72(NVIDIA 新一代 72 卡柜内互联)、Ultra Ethernet(2025 开放标准)。NVLink 5 单 GPU 互联 1.8TB/s,跨节点 800Gbps,训练时延降 30-50%。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# AI 集群高速网络 2.0

> **一句话理解**:AI 集群高速网络 2.0 是 2024-2026 训练大模型的"血管"——InfiniBand NDR 400Gbps / XDR 800Gbps、RoCE v2 国产化替代、GB200 NVL72 单柜 72 卡、NVLink 5 1.8TB/s 单 GPU、Ultra Ethernet 开放标准。Llama 3 405B 训练用 16K H100 + 800Gbps 网络,性能决定训练效率。

---

## 一、为什么 AI 集群需要高速网络?

大模型训练对网络的要求:
- **AllReduce / AllGather**:千卡级梯度同步
- **低延迟**:PP / TP 通信 < 10μs
- **高带宽**:NVLink + IB 总带宽 800GB+/s
- **无损**:RoCEv2 PFC/ECN 调优

普通以太网络(100Gbps):训练速度损失 30-50%

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 无限带宽 | InfiniBand(IB) | NVIDIA 主导,事实标准 |
| 远程直接内存访问 | RDMA | 绕过 CPU 直接读写 |
| 基于以太网的 RDMA | RDMA over Converged Ethernet(RoCE) | v2 主流 |
| NDR 速率 | NDR Data Rate | 400 Gbps(2024) |
| XDR 速率 | XDR Data Rate | 800 Gbps(2025) |
| HDR 速率 | HDR Data Rate | 200 Gbps(2023) |
| NVLink | NVLink | NVIDIA 内部互联 |
| NVSwitch | NVSwitch | NVLink 交换机 |
| 顶级交换 | Top-of-Rack(ToR) | 机架顶交换 |
| 叶脊架构 | Leaf-Spine | 数据中心网络 |
| 优先流控 | Priority Flow Control(PFC) | RoCE 无损 |
| 显式拥塞通知 | Explicit Congestion Notification(ECN) | 拥塞控制 |
| 超以太网 | Ultra Ethernet | UEC 标准,2025 |
| 网络计算 | In-Network Computing | SHARP 协议 |
| 集合通信 | Collective Communication | AllReduce 等 |
| NCCL | NVIDIA Collective Communications Library | 集合通信库 |
| RDMA Verbs | RDMA Verbs | RDMA API |
| 跨节点 | Inter-Node | 跨机器通信 |
| 节点内 | Intra-Node | 单机内通信 |
| 高带宽内存 | HBM | GPU 显存 |
| 单柜互联 | NVL72 | 72 卡柜内 |

---

## 三、互联方案对比(2026-02 快照)

| 方案 | 厂商 | 带宽/链路 | 延迟 | 生态 | 适合 |
|---|---|---|---|---|---|
| **InfiniBand XDR** | NVIDIA Mellanox | 800 Gbps | < 1μs | NCCL + SHARP | 大模型训练 |
| **InfiniBand NDR** | NVIDIA Mellanox | 400 Gbps | < 1.5μs | NCCL + SHARP | 大模型训练 |
| **RoCE v2 + 调优** | 多厂商 | 400 Gbps | 2-5μs | NCCL/PyTorch | 国产替代 |
| **Ultra Ethernet** | UEC 联盟 | 800 Gbps | < 2μs | 标准 2025-Q4 | 未来开放标准 |
| **NVLink 5** | NVIDIA | 1.8 TB/s | < 1μs | 仅 NVIDIA | 单机 8 GPU |
| **NVSwitch 4** | NVIDIA | 14.4 TB/s | < 1μs | 仅 NVIDIA | 单机 8/16 GPU |
| **GB200 NVL72** | NVIDIA | 130 TB/s(总) | < 1μs | 72 卡柜 | 万卡级训练 |
| **华为 HCCS** | 华为 | 1.2 TB/s | < 2μs | CANN | 昇腾集群 |
| **壁仞 B-Link** | 壁仞 | 1.2 TB/s | — | 自研 | 壁仞集群 |
| **以太网 100G/200G** | 多厂商 | 100-200 Gbps | 5-10μs | TCP/IP | 小集群 |

---

## 四、InfiniBand 详解(NVIDIA 主导)

### 4.1 演进

| 代际 | 年份 | 速率 | 交换机 |
|---|---|---|---|
| **FDR** | 2014 | 56 Gbps | — |
| **EDR** | 2016 | 100 Gbps | — |
| **HDR** | 2019 | 200 Gbps | Quantum-2 |
| **NDR** | 2022 | 400 Gbps | Quantum-2 |
| **XDR** | 2024-09 | 800 Gbps | Quantum-3 |
| **GDR** | 2026(预期) | 1.6 Tbps | — |

### 4.2 SHARP 协议

- **In-Network Computing**:交换机做 AllReduce
- 多 GPU 通信不经过网卡,直接交换
- 训练加速 20-30%

### 4.3 拓扑

- **Fat-Tree**:经典 IB 拓扑
- **Dragonfly+**:HPC 拓扑,高带宽
- **HyperX / Dragonfly++**:低延迟拓扑

---

## 五、RoCE v2 详解(国产替代)

### 5.1 优势

- 兼容以太网设备
- 成本低(Cisco / Arista / H3C 交换机)
- 国产化(华为 CloudEngine / 锐捷)

### 5.2 调优

- **PFC**(Priority Flow Control):优先级流控,避免丢包
- **ECN**(Explicit Congestion Notification):显式拥塞
- **DCQCN**(Data Center QCN):综合方案

### 5.3 实战配置

```bash
# Mellanox/NVIDIA ConnectX-7
mlnx_qos -i eth0 --pfc 0,0,0,1,0,0,0,0  # 队列 3 启用 PFC
cma_roce_mode -d mlx5_0 -p 1  # RoCE v2
cma_roce_tos -d mlx5_0 -t 4   # 优先级

# 验证
ib_write_bw -d mlx5_0 -x 3  # 3 为 RoCE
```

### 5.4 性能

- 调优后:RoCE v2 性能可达 IB 90%+
- 未调优:50-70% 性能损失

---

## 六、GB200 NVL72 详解(NVIDIA 新一代)

### 6.1 架构

- **72 个 Blackwell GPU** + **36 个 Grace CPU**
- 单柜互联:**NVLink Switch 4**
- 总带宽:**130 TB/s**(前所未有的单柜带宽)
- 等效:**72 GPU = 1 个超节点**

### 6.2 性能

- **FP4 算力**:1.4 ExaFLOPS(Peta × 1000)
- **HBM3e**:每个 GPU 192GB(总 13.8TB)
- **功耗**:1.2MW / 柜

### 6.3 应用

- Llama 3 后续训练
- 实时推理(MoE 100B+ 实时)
- 科学研究(气候 / 生物 / 物理)

### 6.4 价格

- 单柜 $3M+ USD
- 100 柜集群 = $300M
- 适合头部玩家

---

## 七、Ultra Ethernet(UEC,2025 开放标准)

### 7.1 目标

- 取代 InfiniBand 的"开放标准"
- 800 Gbps 起步
- RDMA + In-Network Computing
- 2025-Q4 1.0 规范

### 7.2 联盟

- Linux Foundation 主导
- NVIDIA / AMD / Intel / Broadcom / Meta / Microsoft / Google / Oracle

### 7.3 生态

- 2026-Q1 首批设备
- 2026-Q3 厂商认证
- 2027 大规模部署

---

## 八、生产最佳实践

1. **大模型训练选 InfiniBand NDR/XDR**:性能稳定,生态成熟。
2. **国产替代选 RoCE v2 + 调优**:PFC/ECN/DCQCN 必做。
3. **NVLink 5 + GB200**:预算充足选 NVIDIA 新一代。
4. **国产集群选 HCCS**:昇腾生态完善。
5. **SHARP 协议启用**:交换机做 AllReduce,加速 20-30%。
6. **NCCL 调优**:`NCCL_IB_HCA` / `NCCL_IB_GID_INDEX` / `NCCL_DEBUG=INFO`。
7. **拓扑感知调度**:Volcano / Kueue + IB 拓扑。
8. **无损 RoCE 验证**:PFC + ECN 双向调优。
9. **A/B 测试**:IB vs RoCE 性能差距 < 10% 即可接受。
10. **监控**:UCX 性能、丢包率、拥塞事件。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **InfiniBand XDR** | 2025-12 GA,800 Gbps |
| **GB200 NVL72** | 2025-09 GA,首批部署 |
| **RoCE v2** | 国产化首选,70% 国产集群 |
| **Ultra Ethernet** | 1.0 规范 2025-Q4 |
| **NVLink 5** | 1.8 TB/s,Blackwell GPU |
| **昇腾 HCCS** | 1.2 TB/s,国产 SOTA |
| **市场规模** | AI 集群网络 ARR $5B+ |
| **主要竞品** | InfiniBand / RoCE / UE / NVLink / HCCS |

---

## 十、See Also(官方源)

### InfiniBand

- NVIDIA Quantum-3 [nvidia.com/en-us/networking/quantum3](https://www.nvidia.com/en-us/networking/infiniband/)
- Mellanox [mellanox.com](https://www.mellanox.com/)

### RoCE

- RDMA Consortium [roceinitiative.org](https://www.roceinitiative.org/)
- RoCE v2 规范 [cwinsdor.github.io/RoCE](https://cwinsdor.github.io/RoCE/)

### Ultra Ethernet

- UEC 联盟 [ultraethernet.org](https://ultraethernet.org/)
- 规范 [ultraethernet.org/specification](https://ultraethernet.org/specification/)

### GB200

- NVIDIA Blackwell [nvidia.com/en-us/data-center/h100](https://www.nvidia.com/en-us/data-center/h100/) → 升级 GB200
- NVL72 [nvidia.com/en-us/data-center/gb200-nvl72](https://www.nvidia.com/en-us/data-center/gb200-nvl72/)

### 国产

- 华为 CloudEngine [e.huawei.com](https://e.huawei.com/)
- 锐捷 RG-NBR 系列 [ruijie.com.cn](https://www.ruijie.com.cn/)

---

## 十一、相关概念卡

- [[概念/gpu-interconnect|Gpu Interconnect]]
- [[概念/rdma-roce|Rdma Roce]]
- [[概念/nvlink|Nvlink]]
- [[概念/distributed-parallelism|Distributed Parallelism]]
- [[概念/nccl|Nccl]]
- [[概念/ascend-npu|Ascend Npu]]
- [[概念/zero-redundancy-optimizers|Zero Redundancy Optimizers]]
- [[概念/gb200|Gb200]]
