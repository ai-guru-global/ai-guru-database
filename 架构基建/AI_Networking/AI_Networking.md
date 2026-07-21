---
title: AI 网络基础设施 (AI Networking)
category: 10-infrastructure
tags: ["infiniband", "roce", "nvlink", "network-topology", "gpu-cluster"]
summary: "AI 训练/推理网络基础设施：InfiniBand/RoCE/NVLink 对比、Fat-Tree/Dragonfly 拓扑、RDMA 原理、网络瓶颈诊断与 2026 万卡集群网络设计。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# AI 网络基础设施

## 1. 网络层次

```
AI 集群网络四层架构:

L1 节点内 (GPU↔GPU): NVLink/NVSwitch
  带宽: 900 GB/s (NVLink 5.0, B200)
  延迟: <1μs
  用途: Tensor Parallel 通信

L2 节点间同机架: InfiniBand/RoCE
  带宽: 400 Gbps × 8 = 3.2 Tbps/节点
  延迟: 1-5μs
  用途: Pipeline/Data Parallel

L3 机架间: 核心交换网络
  拓扑: Fat-Tree / Dragonfly
  带宽: 收敛比 1:1 (无阻塞)
  用途: 大规模 Data Parallel

L4 跨 DC: 专线/暗光纤
  带宽: 100-800 Gbps
  延迟: 1-10ms
  用途: 异步训练/数据同步
```

## 2. 互联技术对比

| 技术 | 带宽 | 延迟 | 成本 | 适用 |
|------|------|------|------|------|
| NVLink 5.0 | 1.8 TB/s | <1μs | 含 GPU | 节点内 |
| InfiniBand NDR | 400 Gbps | ~1μs | 高 | 训练集群 |
| InfiniBand XDR | 800 Gbps | ~1μs | 极高 | 2026 新集群 |
| RoCE v2 | 400 Gbps | ~2-5μs | 中 | 性价比方案 |
| 以太网 (Ultra) | 800 Gbps | ~5μs | 低 | 推理/存储 |

## 3. RDMA 原理

```python
# RDMA (Remote Direct Memory Access):
# 绕过 CPU/OS，GPU 直接读写远端内存

RDMA_BENEFITS = {
    "零拷贝": "数据不经过 CPU 内存",
    "内核旁路": "不经过操作系统内核",
    "CPU 卸载": "CPU 不参与数据传输",
    "低延迟": "硬件级传输，<2μs",
}

# NCCL (NVIDIA Collective Communications Library):
# GPU 集合通信库，利用 RDMA 实现:
# - AllReduce: 所有 GPU 梯度聚合
# - AllGather: 收集所有 GPU 数据
# - ReduceScatter: 聚合后分发
# - Broadcast: 一对多广播

# 网络配置最佳实践:
NCCL_CONFIG = {
    "NCCL_IB_DISABLE": "0",           # 启用 InfiniBand
    "NCCL_NET_GDR_LEVEL": "5",        # GPU Direct RDMA
    "NCCL_IB_HCA": "mlx5_0,mlx5_1",   # 指定 HCA
    "NCCL_SOCKET_IFNAME": "eth0",      # 管理网络
    "NCCL_DEBUG": "WARN",              # 日志级别
}
```

## 4. 网络拓扑

### 4.1 Fat-Tree

```
Fat-Tree (胖树) 拓扑:
- 最常用的高性能计算网络
- 无阻塞: 任意两节点间有等带宽路径
- 层次: 核心层 → 汇聚层 → 接入层

        [Core Switch ×4]
       /    |    |    \
  [Spine] [Spine] [Spine] [Spine]  ×8
    |       |       |       |
  [Leaf]  [Leaf]  [Leaf]  [Leaf]   ×16
   /|\     /|\     /|\     /|\
 GPU节点  GPU节点  GPU节点  GPU节点  ×128

优势: 无阻塞、路径多、负载均衡
劣势: 布线复杂、成本高
```

### 4.2 网络瓶颈诊断

```python
# 常见网络问题诊断:

NETWORK_DIAGNOSTICS = {
    "带宽不足": {
        "症状": "AllReduce 时间长，GPU 利用率低",
        "诊断": "ib_write_bw / nccl-tests",
        "解决": "升级网络 / 减少通信量",
    },
    "延迟高": {
        "症状": "小消息通信慢",
        "诊断": "ib_write_lat / perftest",
        "解决": "检查路由 / 启用 GDR",
    },
    "丢包": {
        "症状": "NCCL 超时 / 训练中断",
        "诊断": "ethtool -S / 交换机日志",
        "解决": "更换线缆 / 修复端口",
    },
    "拥塞": {
        "症状": "带宽波动大、PFC 风暴",
        "诊断": "交换机缓冲区监控",
        "解决": "调整 ECN / 增加带宽",
    },
}

# NCCL 性能测试:
"""
# AllReduce 带宽测试
mpirun -np 64 ./all_reduce_perf -b 8 -e 1G -f 2 -g 8

# 预期: 接近理论带宽的 80-90%
# 如果 < 70%: 网络有问题
"""
```

## 5. 2026 趋势

```
- Ultra Ethernet Consortium: 以太网追赶 InfiniBand
- 800G 普及: XDR InfiniBand / 800G 以太网
- 光互联: 共封装光学 (CPO) 降低功耗
- 网络内计算: SHARP (In-Network Reduction)
- AI  fabric: 专为 AI 训练优化的网络协议
```

## 6. 交叉引用

- [[架构基建/|架构基建]]
- [[模型训练/Training_Infrastructure/|训练基础设施]]
- [[模型训练/Distributed_Training/|分布式训练]]
- [[概念/General/infiniBand|InfiniBand]]
- [[概念/General/rdma-roce|RDMA/RoCE]]
