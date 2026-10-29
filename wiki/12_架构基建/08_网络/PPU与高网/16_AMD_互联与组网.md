---
title: "AMD 互联与组网"
category: 12_架构基建-08-网络
tags: ["amd", "instinct", "infinity-fabric", "xgmi", "mi300x", "mi355x", "ualink", "rccl"]
summary: "AMD Instinct 的互联与组网：MI300X 的 8-GPU 全互连 896 GB/s、MI350 系列提升至约 1.07 TB/s、RCCL 通信库与 ROCm 生态，以及 AMD 主导的 UALink 开放标准对 NVLink 的挑战。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["AMD 互联", "Infinity Fabric", "UALink"]
sources:
  - "https://www.amd.com/en/products/accelerators/instinct.html"
  - "https://www.datacenterdynamics.com/en/news/ualink-consortium-releases-200g-10-specification-for-ai-accelerator-interconnects"
name_zh: "AMD 互联"
---

# AMD 互联与组网

> 中文简称：AMD 互联

> **一句话理解**: AMD 用 Infinity Fabric 把 8 张 MI300X 织成全互连（896 GB/s），MI350 代提到约 1.07 TB/s，再牵头 UALink 开放标准拉全行业对抗 NVLink——硬件追赶 + 标准合围双线作战。

---

## 1. Infinity Fabric / xGMI 事实

| 平台 | 互连结构 | 聚合带宽（公开口径） |
|---|---|---|
| MI300X（CDNA 3，2023） | 8-GPU OAM 全互连网格，xGMI 链路 7×128 GB/s | **896 GB/s** |
| MI350X/MI355X（CDNA 4，2025） | 全互连链路 7×153.6 GB/s | **约 1.07 TB/s** |
| MI350P（PCIe 形态） | 无 OAM 全互连，PCIe Gen5 x16（128 GB/s） | 降档形态 |

配套事实：MI300X 192 GB HBM3（5.3 TB/s）；MI350 系列 288 GB HBM3E（最高 8 TB/s）——显存容量优势是 AMD 对 NVIDIA 的核心卖点，互联带宽仍落后 NVLink 5（1.8 TB/s）约一代。

---

## 2. 软件栈

- **ROCm**：开源对标 CUDA；**RCCL** 集合通信库（NCCL 等价物），见 [[12_架构基建/08_网络/PPU与高网/06_集合通信库全景_2026|06 通信库全景]]；
- ROCm 开源属性让海光等国产厂商复用整套路线（见 [[12_架构基建/08_网络/PPU与高网/10_海光DCU互联与组网|海光 DCU 互联与组网]]）；
- 生态短板：框架适配与算子覆盖仍落后 CUDA，MI350 世代明显收窄。

---

## 3. UALink：AMD 领衔的标准战争

| 维度 | 内容 |
|---|---|
| 阵营 | AMD + Broadcom + Cisco + Google + HPE + Intel + Meta + Microsoft 等（2024 组联盟，2025-04 发 UALink 1.0 规格） |
| 1.0 规格 | 200 Gbps/lane、单 Pod 最多 **1024 加速器**、内存共享语义（load/store 级） |
| 2.0 方向 | 网内计算（in-network compute），目标对齐 NVLink 6 代的聚合带宽 |
| 对 NVIDIA | 与 NVLink Fusion（NVIDIA 的开放化回应）正面对撞，见 [[12_架构基建/08_网络/PPU与高网/07_NVIDIA_互联与组网|NVIDIA 互联与组网]] §5 |

**国产关联**：UALink 的开放路线给国产自研互联（ICN/HCCS/XPU-Link/BLINK…）提供了「将来可对话」的标准锚点，但短期各自为政。

---

## 4. 组网要点

1. **8 卡域思维**：与 NVIDIA 8 卡 NVSwitch 机同理，TP/EP 压在 xGMI 域内；跨域走 IB/RoCE；
2. **机架化竞争**：AMD 亦推机架级方案（Helios 系，对标 NVL72），规格随代际演进，引用时查最新口径；
3. **PCIe 形态降档**：选 MI350P 类 PCIe 卡做 TP 集群要先算互联账（128 GB/s 上限）。

---

## 5. 已知与未知

**有公开依据**：896 GB/s 与 1.07 TB/s 全互连口径；UALink 1.0 规格与联盟名单；ROCm/RCCL 定位。

**随代际变化快**：MI400/Helios 机架、UALink 2.0、ROCm 版本演进——以 AMD 最新资料为准。

---

## 6. 面试速记

1. AMD 记忆点：**8 卡全互连 896 GB/s→1.07 TB/s + 192/288 GB 大显存 + UALink 盟主**；
2. 「为什么 MI300X 推理火」：显存大→单机塞得下大模型副本，互联够用即可；
3. UALink 与 NVLink 的差别不在带宽而在**开放性**——云巨头想摆脱单厂锁定。

---

## Related

- [[12_架构基建/08_网络/PPU与高网/README|PPU 与高网系列总纲]]
- [[12_架构基建/08_网络/PPU与高网/07_NVIDIA_互联与组网|NVIDIA 互联与组网]]
- [[01_数学基础/10_AI硬件/07_NVIDIA_AMD_GPU_深入分析|NVIDIA & AMD GPU 深度解析]]

---

*Last updated: 2026-10-27*
