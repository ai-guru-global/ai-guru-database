---
title: "NVIDIA 互联与组网"
category: 12_架构基建-08-网络
tags: ["nvidia", "nvlink", "nvswitch", "nvl72", "spectrum-x", "infiniband", "ualink"]
summary: "NVIDIA 互联全家桶：机内 NVLink 5/NVSwitch、机架级 NVL72、机间 Quantum IB 与 Spectrum-X 以太网两条产品线，以及 NVLink Fusion 开放与 UALink 阵营的对峙。"
created: 2026-10-27
updated: 2026-10-27
tier: core
aliases: ["NVIDIA 互联", "NVLink 与 Spectrum-X"]
sources:
  - "https://www.nvidia.com/en-us/data-center/nvlink/"
  - "https://www.nvidia.com/en-us/data-center/nvswitch/"
  - "https://www.nvidia.com/en-us/networking/products/spectrum-x/"
name_zh: "NVIDIA 互联与组网"
---

# NVIDIA 互联与组网

> 中文简称：NVIDIA 互联

> **一句话理解**: NVIDIA 的互联战略是「机内 NVLink、机间 IB/以太两手抓」——NVLink 定义卡间带宽天花板，NVL72 把机架变成一台计算机，Spectrum-X 让以太网也能跑 AI，而整个体系正被 UALink 联盟集体挑战。

---

## 1. 机内：NVLink + NVSwitch

| 版本 | 代表 GPU | 单链路 | 总带宽（双向） |
|---|---|---|---|
| NVLink 3.0 | A100 | 50 GB/s | 600 GB/s |
| NVLink 4.0 | H100/H200 | 56.25 GB/s | 900 GB/s |
| NVLink 5.0 | B200/GB200 | 100 GB/s | 1.8 TB/s |

- **NVSwitch**：把点对点 NVLink 汇成交换矩阵，实现 8 卡/72 卡全互联任意对等带宽，并支持 **SHARP**（交换机内归约，AllReduce 不必把数据全拉回 GPU）；
- NVLink 语义包含内存访问与一致性支持，不只是「更快的线」——这是它与通用网络协议的本质差异；
- 演进细节与国产对标见 [[概念/GPU/nvlink|NVLink]] 与 [[概念/GPU/gpu-interconnect|GPU 互联技术]]。

## 2. 机架级：GB200 NVL72

- 72 颗 Blackwell GPU + NVSwitch 互联成单个 NVLink 域，官方口径 NVLink 域内聚合带宽 130 TB/s 量级；
- 整架液冷、作为「一台计算机」交付——超节点范式定义者（对比见 [[12_架构基建/08_网络/PPU与高网/02_超节点技术_2026|02 超节点技术]]）；
- 对上层含义：TP/EP 可以放心跨节点放进 72 卡域，这也是 MoE 训练与推理密集并行的黄金尺寸。

## 3. 机间：两条产品线

| 产品线 | 定位 | 关键组件 | 特点 |
|---|---|---|---|
| **Quantum（InfiniBand）** | 极限性能专用网 | Quantum-2/X800 交换机 + ConnectX-7/8 网卡 | NDR 400G→X800 800G；SHARP 网内计算；生态封闭、成本高 |
| **Spectrum-X（以太网）** | 以太网路线的 AI 专线 | Spectrum-3/4 交换机 + BlueField/SuperNIC | 自适应路由 + 拥塞控制 + 性能隔离，宣称逼近 IB 的有效带宽；RoCE 的「厂方强化版」 |

> 选型视角：IB vs RoCE vs eRDMA 的对比放在 [[12_架构基建/08_网络/PPU与高网/20_高网选型对比_2026|20 高网选型对比]]，协议原理见 [[12_架构基建/08_网络/06_RDMA_and_RoCE_for_AI|RDMA 与 RoCE 在 AI 集群中的应用]]。

## 4. 软件栈绑定

| 层 | 组件 |
|---|---|
| 通信库 | NCCL（拓扑感知，自动用 NVLink/SHARP/RDMA），见 [[概念/GPU/nccl|NCCL]] |
| 直通路径 | GPUDirect RDMA / GPUDirect TCPX，见 [[概念/GPU/gpu-direct|GPUDirect]] |
| 集群管理 | NVIDIA AI Fabric、Nsight/DCGM 的网络侧指标 |

## 5. 生态战争：NVLink Fusion vs UALink

- **NVLink Fusion**（2025 起）：向第三方 CPU/加速器开放 NVLink 互联生态——从封闭走向「按我的标准开放」；
- **UALink 1.0**（2025-04 发布规格）：AMD/Broadcom/Google/Meta/Microsoft 等联盟的开放回应——200G/lane、单 Pod 最多 1024 加速器、内存共享语义（AMD 侧见 [[12_架构基建/08_网络/PPU与高网/16_AMD_互联与组网|AMD 互联与组网]]）；
- 观察点：UALink 2.0 的网内计算与 NVLink 6 的带宽竞赛；国产阵营短期不受影响（各家自研，见厂家篇）。

---

## 6. 面试视角的三个必答题

1. **NVLink 和 IB 的分工**？机内总线 vs 机间网络；TP 在 NVLink 域内、DP 跨 IB。
2. **为什么 Spectrum-X 存在**？把 AI 负载从「专用 IB」搬回「以太网存量机房」，用自适应路由与拥塞控制补齐有损网短板。
3. **NVL72 改变了什么**？72 卡共享一个 NVLink 域，超节点内 TP/EP 不再受单机 8 卡限制——直接对标国产 CloudMatrix/磐久 AL128 的军备竞赛。

---

## Related

- [[12_架构基建/08_网络/PPU与高网/README|PPU 与高网系列总纲]]
- [[概念/GPU/nvlink|NVLink]] · [[概念/GPU/nccl|NCCL]] · [[概念/GPU/gpu-direct|GPUDirect]]
- [[01_数学基础/10_AI硬件/07_NVIDIA_AMD_GPU_深入分析|NVIDIA & AMD GPU 深度解析]]

---

*Last updated: 2026-10-27*
