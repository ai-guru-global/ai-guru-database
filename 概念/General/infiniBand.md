---
title: "InfiniBand"
category: -concepts
tags: ["networking", "rdma", "gpu", "distributed-training", "high-performance-computing", "alibaba-cloud"]
summary: "InfiniBand 是高性能计算场景常用的高速网络技术，支持 RDMA，广泛用于大规模 GPU 集群的分布式训练。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "IB"
  - "InfiniBand 网络"
relationships:
  - target: "概念/nccl"
    type: used_by
  - target: "概念/gpu-direct"
    type: related_to
  - target: "概念/distributed-training"
    type: related_to
sources: []
name_zh: "无限带宽网络"
---

# InfiniBand

> 中文简称：无限带宽网络

> **一句话理解**: InfiniBand 是数据中心里的「高速公路」，让 GPU 之间可以直接高速通信，延迟远低于传统以太网。

## 核心要点

- **RDMA 支持**: 允许网卡直接读写远端内存，CPU 开销极低。
- **高带宽低延迟**: 常见 100G/200G/400G NDR，延迟微秒级。
- **IB 协议栈**: 不同于 TCP/IP，使用 IB Verbs API。
- **Mellanox/NVIDIA 主导**: ConnectX 系列网卡 + OFED 驱动。
- **与 NCCL 配合**: NCCL 通过 IB 完成跨节点 GPU 集合通信。

## 常用命令

```bash
# 查看 IB 设备状态
ibstat
ibstatus
ibv_devinfo

# 测试带宽
ib_write_bw
ib_read_bw
```

## 阿里云专有云关联

在阿里云专有云环境中，神龙 GPU 集群常配置 InfiniBand 或 RoCE 网络支撑大规模分布式训练。工单中「NCCL 初始化失败」或「跨节点训练慢」时，需检查 IB 网卡驱动、端口状态和子网管理器（Subnet Manager）。

## Related

- [[概念/nccl|NCCL]]
- [[概念/nvlink|NVLink]]
- [[概念/gpu-direct|GPU Direct]]
- [[概念/distributed-training|分布式训练]]
- [[07_模型训练/04_Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]

---

## 2026 InfiniBand 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **InfiniBand NDR** | 400Gbps 高速互联 | GA |
| **RoCE** | 以太网 RDMA | GA |
| **NCCL** | NVIDIA 集合通信库 | GA |
| **GPU Direct** | GPU 直接通信 | GA |
| **SHARP** | 网内计算加速 | GA |

## 生产最佳实践

1. **高速互联**：分布式训练用 InfiniBand 互联
2. **NCCL 优化**：优化 NCCL 通信性能
3. **GPU Direct**：启用 GPU Direct 减少拷贝
4. **网络监控**：监控网络性能
5. **与 RoCE 对比**：根据场景选择 IB 或 RoCE

## IB vs RoCE 对比

| 维度 | InfiniBand | RoCE v2 |
|------|------|------|
| 带宽 | 400 Gbps (NDR) | 200 Gbps |
| 延迟 | ~1μs | ~2-5μs |
| 成本 | 高 | 中 |
| 生态 | NVIDIA 主导 | 开放标准 |
| 运维 | 需 Subnet Manager | 标准以太网 |
| 适用 | 大规模训练 | 中小规模/推理 |

## 网络拓扑

| 拓扑 | 说明 | 适用规模 |
|------|------|------|
| Fat-Tree | 无阻塞交换 | 千卡级 |
| Dragonfly | 分组全连接 | 万卡级 |
| Rail-Optimized | 每 GPU 独立 IB 口 | GPU 集群 |
| Ring | 环形拓扑 | 小规模 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| NCCL 初始化失败 | IB 驱动/端口异常 | 检查 ibstat、重启 OFED |
| 跨节点训练慢 | 带宽不足/拓扑不当 | 检查 IB 带宽、优化拓扑 |
| 丢包 | 网络拥塞/线缆故障 | 检查计数器、更换线缆 |
| GPU Direct 失败 | 驱动不兼容 | 更新 NVIDIA 驱动和 OFED |
| Subnet Manager 异常 | SM 故障 | 重启 opensm |

## 相关概念

- [[概念/nccl|NCCL]] — NVIDIA 集合通信库
- [[概念/nvlink|NVLink]] — GPU 卡间互联
- [[概念/gpu-direct|GPU Direct]] — GPU 直接通信
- [[概念/computer-architecture|Computer Architecture]] — 计算机体系结构

> 💡 InfiniBand 是大规模 GPU 集群的“神经网络”——没有高速互联，再多的 GPU 也只是“孤岛”。

## 版本兼容性

| 组件 | 版本 | 状态 |
|------|------|------|
| ConnectX-7 | NDR 400G | GA |
| ConnectX-6 | HDR 200G | GA |
| OFED | 24.01+ | GA |
| NCCL | 2.20+ | GA |
| SHARP | 3.0+ | GA |

## 生产检查清单

1. 确认 IB 网卡固件和 OFED 驱动版本匹配
2. 检查所有端口状态为 Active
3. 验证 Subnet Manager 正常运行
4. 测试节点间带宽和延迟
5. 启用 GPU Direct RDMA
6. 配置 NCCL 环境变量优化通信
7. 监控 IB 端口错误计数器
8. 建立网络故障自动迁移机制

## 总结

InfiniBand 是大规模 GPU 集群的标准互联方案，提供 400Gbps 带宽和微秒级延迟。与 NCCL、GPU Direct 配合，支撑千卡级分布式训练。

> 💡 选择 InfiniBand 的核心原因是其低延迟和高带宽——对于 AllReduce 密集的分布式训练，网络性能直接决定训练效率。

## NCCL 环境变量优化

| 变量 | 值 | 说明 |
|------|------|------|
| NCCL_IB_DISABLE | 0 | 启用 IB |
| NCCL_IB_GID_INDEX | 3 | RoCE GID 索引 |
| NCCL_SOCKET_IFNAME | eth0 | 网络接口 |
| NCCL_DEBUG | INFO | 调试日志 |
| NCCL_ALGO | Ring/Tree | 集合通信算法 |
| NCCL_NET_GDR_LEVEL | 5 | GPU Direct 级别 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| NVIDIA Networking 文档 | 文档 | IB 产品文档 |
| NCCL 官方文档 | 文档 | 集合通信库 |
| perftest | 工具 | IB 性能测试 |
| ibutils | 工具 | IB 诊断工具 |

## 性能基准

| 测试项 | NDR 400G | HDR 200G | RoCE 200G |
|------|------|------|------|
| 单向带宽 | 380 Gbps | 190 Gbps | 185 Gbps |
| 双向带宽 | 750 Gbps | 375 Gbps | 360 Gbps |
| 延迟 | 0.9 μs | 1.1 μs | 2.5 μs |
| AllReduce 8节点 | 12 GB/s | 6 GB/s | 5.5 GB/s |

## 常用命令

| 命令 | 说明 |
|------|------|
| `ibstat` | 查看 IB 设备状态 |
| `ibstatus` | 查看 IB 端口状态 |
| `ibv_devinfo` | 查看 IB 设备信息 |
| `ib_write_bw` | 测试写带宽 |
| `ib_read_lat` | 测试读延迟 |
| `perfquery` | 查看端口计数器 |
| `opensm` | 启动 Subnet Manager |

## 总结

InfiniBand 是大规模 GPU 集群的标准互联方案，提供 400Gbps 带宽和微秒级延迟。与 NCCL、GPU Direct 配合，支撑千卡级分布式训练。对于 AllReduce 密集的工作负载，网络性能直接决定训练效率。

> 💡 InfiniBand 的核心价值是“让 GPU 之间像在同一台机器上一样通信”——这是大规模分布式训练的基础。

## 2026 InfiniBand 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **NDR 400G** | 新一代 400Gbps InfiniBand 网络 | GA |
| **Quantum-3 交换机** | 下一代低延迟交换芯片 | GA |
| **SHARP v3** | 网内计算加速 AllReduce | GA |
| **RoCE 替代** | 以太网 RoCE 方案成本更低 | GA |
| **NCCL 集成** | NVIDIA 集合通信库原生支持 | GA |

## 生产最佳实践

1. **训练必用**：万卡训练必须使用 IB/RoCE 高速网络
2. **拓扑设计**：使用 Fat-Tree 或 Dragonfly 拓扑避免网络瓶颈
3. **SHARP 加速**：启用网内计算加速 AllReduce 操作
4. **监控网络**：跟踪 IB 端口错误率和延迟，及时排查故障
5. **成本平衡**：推理集群可用 RoCE，训练集群用 IB

## 相关概念

- [[概念/nccl|NCCL]] — NVIDIA 集合通信库
- [[概念/nvlink|NVLink]] — GPU 卡间互联
- [[概念/gpu-direct|GPU Direct]] — GPU 直接通信
- [[概念/computer-architecture|Computer Architecture]] — 计算机体系结构
