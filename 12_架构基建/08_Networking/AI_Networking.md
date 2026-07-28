---
title: AI 网络基础设施 (AI Networking)
category: 10-infrastructure
tags: ["infiniband", "roce", "nvlink", "network-topology", "gpu-cluster"]
summary: "AI 训练/推理网络基础设施：InfiniBand/RoCE/NVLink 对比、Fat-Tree/Dragonfly 拓扑、RDMA 原理、网络瓶颈诊断与 2026 万卡集群网络设计。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "AI 网络基础设施"
---
# AI 网络基础设施

> 中文简称：AI 网络基础设施

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

- [[12_架构基建/|架构基建]]
- [[07_模型训练/04_Distributed_Training/Training_Infrastructure|训练基础设施]]
- [[07_模型训练/04_Distributed_Training/|分布式训练]]
- [[概念/General/infiniBand|InfiniBand]]
- [[概念/General/rdma-roce|RDMA/RoCE]]

## 架构核心组件对比

| 组件层 | 功能 | 关键技术 | 选型考量 |
|--------|------|----------|----------|
| 计算层 | 07_模型训练/推理 | GPU/TPU/NPU集群 | 算力需求+成本 |
| 存储层 | 数据/模型/检查点 | 分布式存储/对象存储 | 容量+IOPS+成本 |
| 网络层 | 节点间通信 | RDMA/RoCE/InfiniBand | 带宽+延迟 |
| 调度层 | 资源编排 | K8s/Slurm/Ray | 弹性+效率 |
| 服务层 | 模型服务化 | vLLM/TGI/Triton | 吞吐+延迟 |
| 网关层 | 流量管理 | API Gateway/负载均衡 | 可用性+安全 |
| 监控层 | 可观测性 | Prometheus/Grafana/OTel | 全面+实时 |

## 架构设计原则

| 原则 | 说明 | 实践方法 |
|------|------|----------|
| 高可用 | 消除单点故障 | 多副本+故障转移+多AZ |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+分片 |
| 高性能 | 最小化延迟 | 缓存+并行+异步 |
| 安全性 | 纵深防御 | 加密+认证+审计 |
| 可观测 | 全链路可见 | Trace+Metrics+Logging |
| 成本优化 | 资源利用率最大化 | 弹性伸缩+混合部署 |

## 性能基准参考

| 场景 | 关键指标 | 目标值 | 优化方向 |
|------|----------|--------|----------|
| 模型推理 | 首Token延迟 | <500ms | 模型优化+缓存 |
| 批量推理 | 吞吐量 | >1000 req/s | 批处理+并行 |
| 训练任务 | GPU利用率 | >85% | 数据管道+通信优化 |
| 存储读写 | IOPS | >100K | NVMe+分布式 |
| 网络通信 | 带宽利用率 | >90% | RDMA+拓扑优化 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 |
|------|----------|----------|
| GPU利用率低 | 数据加载瓶颈 | 预取+多worker+NVMe |
| 推理延迟高 | 模型过大/批处理不当 | 量化+动态batch |
| 存储IO瓶颈 | 检查点写入集中 | 异步写入+分布式存储 |
| 网络拥塞 | AllReduce通信密集 | 梯度压缩+拓扑优化 |
| 资源碎片 | 调度策略不当 | Gang调度+资源预留 |

## 技术选型决策树

| 决策点 | 选项A | 选项B | 选择依据 |
|--------|-------|-------|----------|
| 训练框架 | PyTorch DDP | DeepSpeed/Megatron | 模型规模>10B用后者 |
| 推理引擎 | vLLM | TensorRT-LLM | 灵活性vs极致性能 |
| 存储方案 | 本地NVMe | 分布式存储(Ceph) | 数据规模+共享需求 |
| 网络方案 | 以太网 | InfiniBand | 集群规模+预算 |
| 调度系统 | K8s | Slurm | 云原生vs HPC传统 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 基础架构概念+组件认知 | 1-2周 | 理解全景图 |
| 基础 | 单一组件深入(存储/网络) | 2-3周 | 掌握核心原理 |
| 进阶 | 系统集成+性能优化 | 3-4周 | 能设计完整方案 |
| 实战 | 生产环境部署运维 | 4-6周 | 独立运维能力 |
| 精通 | 架构演进+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| RDMA | 远程直接内存访问(绕过CPU) |
| NVLink | GPU间高速互联 |
| InfiniBand | 高性能网络互连技术 |
| Checkpoint | 训练中间状态保存点 |
| Gang Scheduling | 一组Pod同时调度 |
| Data Parallelism | 数据并行(每GPU处理不同数据) |
| Model Parallelism | 模型并行(模型分片到多GPU) |
| Pipeline Parallelism | 流水线并行(层间流水) |
| Tensor Parallelism | 张量并行(层内切分) |
| KV Cache | 推理时缓存注意力键值 |

## 检查清单

- [ ] 理解AI基础设施全景架构
- [ ] 掌握计算/存储/网络核心组件
- [ ] 了解主流框架和工具链
- [ ] 能进行基本的性能分析和优化
- [ ] 熟悉生产环境最佳实践
- [ ] 关注硬件和架构演进趋势
