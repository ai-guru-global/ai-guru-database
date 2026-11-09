---
线索: HBM与先进存储
主题: 推理与基础设施
别名: [HBM, HBM3E, HBM4, HBM4E, 高带宽内存, SK 海力士, 三星]
状态: 活跃
创建: 2026-10-27
更新: 2026-10-27
关键角色: [SK 海力士, 三星, 美光, NVIDIA]
---

# HBM与先进存储

> AI 芯片的第二战场：HBM 高带宽内存。谁先把下一代 HBM 送上产线，谁就攥住 GPU 世代的供给节奏。

## 概述

HBM（High Bandwidth Memory，高带宽内存）通过 3D 堆叠 DRAM 与 GPU 封装直连，是大模型训练/推理中显存带宽的物理来源。竞争格局长期由 SK 海力士、三星、美光三家瓜分，且节奏与 NVIDIA 产品世代深度绑定：Hopper 用 HBM3/HBM3E，Blackwell 用 HBM3E 加量，Rubin 首次上 HBM4（288GB/卡）。

2026 年的竞争焦点是 HBM4/HBM4E 的先发：三星率先出样 HBM4E，SK 海力士计划五年内晶圆产能翻倍——存储厂把 AI 需求当作穿越存储周期的主引擎。

### 2026-05

- **2026-05-29** · [三星业内率先出样 HBM4E 内存](https://aihot.virxact.com/items/cmpq8kjw502qrslnouugetmfh)
  IT之家报道，三星率先向客户出样 HBM4E——HBM4 尚未大规模放量而下一代已进入送样阶段，存储竞赛白热化。

### 2026-06

- **2026-06-02** · [SK 海力士计划五年内晶圆产能翻倍](https://aihot.virxact.com/items/cmpwf05rk02d5slsnyqog4n3x)
  SK 集团会长崔泰源披露，HBM 供给侧加速扩产。

### 2026-03

- **2026-03-16** · [NVIDIA GTC 2026：Vera Rubin 平台正式发布](https://nvidianews.nvidia.com/news/nvidia-vera-rubin-platform)
  Rubin GPU：3360 亿晶体管、3nm、288GB HBM4、22 TB/s 显存带宽——GPU 世代竞争直接翻译成 HBM4 的封装与容量竞争。→ [[推理与基础设施/AI芯片竞争]]

### 2024-03

- **2024-03** · HBM3E 成为 Blackwell 世代标配
  Blackwell B200/GB200 采用 HBM3E（192GB/卡，8 TB/s），HBM 需求随大模型上下文与 MoE 参数规模持续膨胀，SK 海力士率先量产供应。

## 分析

1. **HBM 是 NVIDIA 世代的隐形闸门**：每一代 GPU 的晶体管与带宽规格，最终都落到 HBM 产能与先进封装（CoWoS）上——[[推理与基础设施/台积电与先进制程]] 与本线索共同构成「算力供给的物理瓶颈层」。
2. **三星的追赶叙事**：HBM3 世代 SK 海力士独供 NVIDIA 旗舰一度让三星掉队，HBM4E 率先出样是三星「以下一代打当代」的翻盘尝试。
3. **推理时代改变需求结构**：长上下文与 KV Cache 让显存容量/带宽成为推理成本主项，HBM 需求从训练侧单引擎变成训练 + 推理双引擎。

## 关联线索

- [[推理与基础设施/AI芯片竞争]]
- [[推理与基础设施/台积电与先进制程]]
