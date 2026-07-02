---
title: "AI 网络基础"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["networking", "ai", "rdma", "roce", "infiniband", "kubernetes", "k8s", "alibaba-cloud"]
summary: "面向 AI 训练与推理集群的网络基础知识：带宽、延迟、拓扑、拥塞控制，以及 K8s 中网络配置对分布式训练的影响。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# AI 网络基础

> **一句话理解**: AI 集群里的网络决定了 GPU 之间「说话快不快」，训练大模型时，网络慢了，GPU 再强也得等。

## 目录

- [1. 为什么 AI 对网络敏感](#1-为什么-ai-对网络敏感)
- [2. 核心指标](#2-核心指标)
- [3. 网络类型对比](#3-网络类型对比)
- [4. 典型拓扑](#4-典型拓扑)
- [5. K8s 中的网络配置](#5-k8s-中的网络配置)
- [6. 故障排查](#6-故障排查)
- [Related](#related)

---

## 1. 为什么 AI 对网络敏感

- **分布式训练**: All-Reduce、All-Gather 等集合通信对带宽和延迟敏感。
- **大模型**: 参数多、梯度大，每次同步数据量大。
- **推理服务**: TTFT/TPOT 受网络延迟影响，尤其是跨节点推理。

---

## 2. 核心指标

| 指标 | 说明 | 关注点 |
|------|------|--------|
| **带宽** | 单位时间传输数据量 | 越高越好，通常 Gbps/Tbps |
| **延迟** | 数据从发送到接收的时间 | 越低越好，RDMA 可降到微秒级 |
| **PFC/ECN** | 无损网络流控 | 避免拥塞丢包 |
| **收敛比** | 网络上下行带宽比 | 1:1 无收敛最佳 |

---

## 3. 网络类型对比

| 类型 | 带宽 | 延迟 | 适用 |
|------|------|------|------|
| **InfiniBand** | 高（NVIDIA 主推） | 极低 | 超大规模训练 |
| **RoCEv2** | 高 | 低 | 以太网环境训练 |
| **标准以太网** | 中 | 高 | 推理、管理面 |
| **NVLink/NVSwitch** | 极高 | 极低 | 单节点内 GPU 互联 |

详见：[[_concepts/rdma-roce|RDMA/RoCE]]、[[_concepts/infiniBand|InfiniBand]]

---

## 4. 典型拓扑

```text
单机 8 卡：
  GPU0 - GPU1 - GPU2 - GPU3 - GPU4 - GPU5 - GPU6 - GPU7
   \      |      |      |      |      |      |      /
    \____NVSwitch____________________________/

多机集群：
  每台服务器内：NVLink/NVSwitch
  服务器之间：InfiniBand / RoCE 交换机
```

---

## 5. K8s 中的网络配置

- **CNI 插件**: Calico/Cilium/Flannel，高性能场景可用 SR-IOV/DPDK
- **Multus**: 多网卡配置，分离管理面与 RDMA 网络
- **Network Operator**: 自动化 RDMA/RoCE 配置
- **Pod 多网卡**:

```yaml
apiVersion: k8s.cni.cncf.io/v1
kind: NetworkAttachmentDefinition
metadata:
  name: rdma-network
spec:
  config: |
    {
      "cniVersion": "0.3.1",
      "type": "host-device",
      "device": "eth1"
    }
```

---

## 6. 故障排查

| 现象 | 可能原因 | 检查 |
|------|---------|------|
| NCCL timeout | 网络不通、带宽不足 | `ib_write_bw`、`ping`、`iperf` |
| 训练速度远低于理论值 | 收敛比不足、PFC 配置错误 | 交换机配置、NCCL 日志 |
| RDMA 不工作 | 驱动、固件、CNI 配置 | `ibstat`、`rdma link` |

---

## Related

- [[_concepts/rdma-roce|RDMA/RoCE]]
- [[_concepts/infiniBand|InfiniBand]]
- [[_concepts/nvlink|NVLink]]
- [[07_Model_Training/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]
