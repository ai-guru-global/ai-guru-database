---
title: "RDMA 与 RoCE 在 AI 集群中的应用"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["rdma", "roce", "networking", "ai", "distributed-training", "alibaba-cloud"]
summary: "深入讲解 RDMA 技术原理、RoCEv1/v2 的区别、在 AI 训练和推理中的部署要点，以及 K8s 上的配置与排障。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

# RDMA 与 RoCE 在 AI 集群中的应用

> **一句话理解**: RDMA 让网卡直接把数据从一台机器的内存搬到另一台机器， bypass 操作系统，延迟超低、CPU 占用极低。

## 目录

- [1. RDMA 原理](#1-rdma-原理)
- [2. RDMA vs 传统 TCP/IP](#2-rdma-vs-传统-tcpip)
- [3. InfiniBand vs RoCE](#3-infiniband-vs-roce)
- [4. RoCEv1 vs RoCEv2](#4-rocev1-vs-rocev2)
- [5. K8s 部署](#5-k8s-部署)
- [6. 性能调优](#6-性能调优)
- [Related](#related)

---

## 1. RDMA 原理

RDMA（Remote Direct Memory Access）允许一台主机直接访问另一台主机的内存，无需双方操作系统介入。

**关键组件**:
- **RNIC**: RDMA 网卡（如 Mellanox ConnectX-7）
- ** verbs / librdmacm**: 用户态编程接口
- **QP（Queue Pair）**: 通信端点

## 2. RDMA vs 传统 TCP/IP

| 特性 | TCP/IP | RDMA |
|------|--------|------|
| 延迟 | 10-100 μs | 1-3 μs |
| CPU 占用 | 高 | 极低 |
| 带宽 | 受协议栈开销影响 | 接近线速 |
| 编程模型 | socket | verbs |

## 3. InfiniBand vs RoCE

| 特性 | InfiniBand | RoCE |
|------|-----------|------|
| 物理层 | 专用 IB 网络 | 标准以太网 |
| 交换机 | IB 交换机 | 支持 PFC/ECN 的以太网交换机 |
| 生态 | NVIDIA/Mellanox 主导 | 通用以太网生态 |
| 部署成本 | 高 | 较低 |

## 4. RoCEv1 vs RoCEv2

| 特性 | RoCEv1 | RoCEv2 |
|------|--------|--------|
| 网络层 | L2 | L3（UDP/IP） |
| 路由 | 不支持 | 支持 |
| 适用 | 二层简单网络 | 大型三层网络 |

## 5. K8s 部署

### 5.1 使用 SR-IOV Device Plugin

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: rdma-test
spec:
  containers:
    - name: test
      image: rdma-test:latest
      resources:
        limits:
          openshift.io/mlnx_rdma: "1"
```

### 5.2 使用 Macvlan/IPvlan

适用于 RoCEv2 环境。

## 6. 性能调优

- **开启 PFC/ECN**: 保证无损以太网
- **调大 MTU**: 9000（Jumbo Frame）
- **CPU 隔离**: 绑定 IRQ 到特定核心
- **NCCL 参数**: `NCCL_IB_HCA`、`NCCL_SOCKET_IFNAME`

---

## Related

- [[_concepts/rdma-roce|RDMA/RoCE]]
- [[_concepts/infiniBand|InfiniBand]]
- [[12_Architecture_Infrastructure/Networking/AI_Networking_Fundamentals|AI 网络基础]]

- [[12_Architecture_Infrastructure/README|架构与基础设施 (Architecture & Infrastructure)]]
