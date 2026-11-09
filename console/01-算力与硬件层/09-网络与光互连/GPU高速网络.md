---
层: 01-算力与硬件层
节点: 09-网络与光互连
类型: 学习页
状态: 活跃
更新: 2026-10-27
证据: 证据层/推理与基础设施/GPU高速网络.md
---

# GPU高速网络

> GPU 集群「高网」：机内 Scale-up 互联与跨机 Scale-out 网络的总称——算力军备里与芯片同权重的一层，本卡是台内入口，深度内容在独立知识库。

## 是什么

GPU 高速网络（社区简称「高网」）指支撑大规模 GPU 集群的两层网络体系：机内 Scale-up（NVLink/超节点/铜背板，追求极大带宽域）与跨机 Scale-out（IB/RoCE 以太网/Clos 拓扑，追求无损可扩展）。测试时计算与超节点化（NVL72/CloudMatrix）让网络从「配套」升格为决定训练/推理效率与 TCO 的主变量，光模块、交换芯片、铜连接随之成为产业链高弹性环节。

本卡作为拆解台内的高网线索入口与证据时间线；系统性的知识点、厂家档案与各角色视角，在深潜子库 [01-算力与硬件层/09-网络与光互连/高网设计](../../01-算力与硬件层/09-网络与光互连/高网设计/README.md)（68 篇：知识点 42 / 厂家 18 / 角度 8，2026-10-27 建库）中展开，两处互为索引。

### 2026-08

- **2026-08-24** · [Vera Rubin NVL72 每瓦特智能体工作量提升至 30 倍](https://aihot.virxact.com/items/cmt7e0g7y232wro7384g82x67)
  机架级（含 NVLink 域与网络）能效成为 Rubin 世代官方核心口径——网络与互联是「每瓦」叙事的主要构成。→ [[推理与基础设施/AI数据中心与能源]]

### 2026-07

- **2026-07-31** · [发改委：全国智能算力规模达去年同期 2.8 倍](https://aihot.virxact.com/items/cms8llt7f0iaprot0tz5qnk6i)
  智算扩张直接拉动国内高网设备（交换机/光模块/超节点）需求，厂商阵营见知识库厂家档。

### 2026-03

- **2026-03-16** · [NVIDIA GTC 2026：Vera Rubin 平台正式发布](https://nvidianews.nvidia.com/news/nvidia-vera-rubin-platform)
  NVLink 6 每卡 3.6 TB/s、Spectrum-6 以太网——机内/跨机两层的代际规格同步翻新。→ [[推理与基础设施/AI芯片竞争]]

### 2026-01

- **2026-01-14** · [NVIDIA CES 2026：Vera Rubin 首秀](https://blogs.nvidia.com/blog/2026-ces-special-presentation/)
  含 Vera Rubin 超级芯片与 VR200 NVL72（知识库口径基线：NVLink 6 单卡 3.6 TB/s）。

### 2026（持续）

- **2026（持续）** · 中国超节点对标 NVL72
  华为 CloudMatrix 384（384 颗昇腾 910C，约 300 PFLOPS）对标 GB200 NVL72；Atlas 950 超节点（8192 颗 950DT）预计 2026 Q4 上市——scale-up 域规模成为中外对垒的核心指标。→ [[推理与基础设施/华为昇腾]]

### 2025

- **2025** · 开放互联阵营成型（知识库口径基线，已核实）
  UEC 1.0（超以太网，2025-06）与 UALink 1.0（2025）相继发布；Broadcom Tomahawk 6 102.4T（2025）确立 102.4T 交换芯片代际——以太网阵营从 scale-out 向 scale-up 域反攻。

### 2024

- **2024** · 国内万卡级网络实践公开（知识库口径基线，已核实）
  阿里 HPN（15k GPU，SIGCOMM 2024）与字节 MegaScale（12288 GPU，NSDI 2024）论文公开，中国云厂商的规模组网方法论进入国际视野。
- **2024-03-18** · [Blackwell NVL72 发布](https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing)
  72 GPU 单 NVLink 域、铜背板全互联——scale-up 域从「8 卡」跃迁到「72 卡机架」，高网产业链（铜连接/背板/机柜）被重写。→ [[推理与基础设施/AI芯片竞争]]

## 怎么看

1. **高网是「第二算力」**：同等 GPU 数量下，互联规格决定 MFU 与超节点上限；网络（铜/光/交换）占智算中心资本开支的比例持续抬升，光模块成为 2024–2026 年 AI 硬件链弹性最大的环节之一。
2. **两条路线之争**：NVIDIA 垂直整合（NVLink+IB/Spectrum-X）对阵开放阵营（UEC/UALink+白盒），中国侧以「超节点 + 国产以太网交换」走出第三条路径——与 [[推理与基础设施/主权AI]] 的国产替代主线同频。
3. **知识库分工**：本线维护事件与证据；[高网设计深潜库](../../01-算力与硬件层/09-网络与光互连/高网设计/README.md) 维护系统知识（需求估算→机内→跨机→拓扑→集合通信→无损→运维→趋势 8 域 42 篇 + 厂家 18 档 + 角度 8 视角），其「待核实」项按该库事实纪律管理。

## 关键锚点

- **2026-08-24** · [Vera Rubin NVL72 每瓦特智能体工作量提升至 30 倍](https://aihot.virxact.com/items/cmt7e0g7y232wro7384g82x67)
- **2026-07-31** · [发改委：全国智能算力规模达去年同期 2.8 倍](https://aihot.virxact.com/items/cms8llt7f0iaprot0tz5qnk6i)
- **2026-03-16** · [NVIDIA GTC 2026：Vera Rubin 平台正式发布](https://nvidianews.nvidia.com/news/nvidia-vera-rubin-platform)
- **2026-01-14** · [NVIDIA CES 2026：Vera Rubin 首秀](https://blogs.nvidia.com/blog/2026-ces-special-presentation/)

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/推理与基础设施/GPU高速网络.md)
- [推理与基础设施/AI芯片竞争](../../../证据层/推理与基础设施/AI芯片竞争.md)
- [推理与基础设施/华为昇腾](../../../证据层/推理与基础设施/华为昇腾.md)
- [推理与基础设施/AI数据中心与能源](../../../证据层/推理与基础设施/AI数据中心与能源.md)
- [推理与基础设施/主权AI](../../../证据层/推理与基础设施/主权AI.md)
