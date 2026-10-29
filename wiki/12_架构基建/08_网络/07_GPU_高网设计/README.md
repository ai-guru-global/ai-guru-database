---
title: "GPU 高性能网络设计（高网）知识体系"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "index", "hpn", "topology", "nccl", "rdma"]
summary: "GPU 高性能网络（高网）设计完整知识体系：八个知识层 + 厂家页 + 视角页共 60 页的总索引与学习路径。"
created: 2026-10-27
updated: 2026-10-27
tier: core
aliases: ["高网设计", "GPU 高网", "GPU Networking"]
sources: []
name_zh: "GPU 高网设计"
---

# GPU 高性能网络设计（高网）知识体系

> 中文简称：GPU 高网设计

> **一句话理解**: GPU 集群里「卡与卡怎么连起来」这件事的全部学问——从机内 NVLink 到跨机 IB/以太、从拓扑设计到 NCCL 调优、从光模块采购到故障定位。

---

## 一、体系结构

本目录按「八个知识层 + 厂家维度 + 视角维度」组织，共 60 页：

| 层 | 目录 | 回答的问题 | 页数 |
|--------|------|------------|------|
| ① 分层体系 | 01_分层体系/ | 网络分几层？各层用什么技术？ | 6 |
| ② 物理层硬件 | 02_物理层硬件/ | 交换机、网卡、光模块怎么选怎么配？ | 5 |
| ③ 拓扑设计 | 03_拓扑设计/ | 几千张卡怎么连？无阻塞怎么定义？ | 7 |
| ④ 协议与传输 | 04_协议传输/ | RDMA/IB/RoCE 怎么工作？无损怎么保证？ | 6 |
| ⑤ 集合通信 | 05_集合通信/ | AllReduce 怎么跑？NCCL 怎么调？ | 6 |
| ⑥ 推理网络 | 06_推理网络/ | 训练和推理对网络的要求差在哪？ | 6 |
| ⑦ 运维故障 | 07_运维故障/ | 慢链路怎么找？光模块坏了怎么知道？ | 6 |
| ⑧ 容量成本 | 08_容量成本/ | 多少卡配多少交换机？网络花多少钱？ | 4 |
| 厂家 | 09_厂家/ | NVIDIA/Broadcom/AMD/华为等各家路线 | 8 |
| 视角 | 10_视角/ | 训练/推理/运维/成本/选型/面试六个切入 | 6 |

---

## 二、分层目录

### 01_分层体系

- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/01_Scale_Up_NVLink_NVSwitch|Scale-Up 互联 NVLink 与 NVSwitch]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/02_Scale_Out_IB_RoCE_TCP|Scale-Out 互联三档选型（IB/RoCE/TCP）]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/03_Multi_Plane_Network_Segmentation|多网络平面分离]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/04_NVLink_Fusion|NVLink Fusion 开放生态]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/05_UALink|UALink 开放互联标准]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/06_Bandwidth_Latency_Cheat_Sheet|带宽延迟数量级速查]]

### 02_物理层硬件

- [[12_架构基建/08_网络/07_GPU_高网设计/02_物理层硬件/01_Switch_Generations|交换机代际与阵营]]
- [[12_架构基建/08_网络/07_GPU_高网设计/02_物理层硬件/02_NIC_and_DPU|网卡与 DPU]]
- [[12_架构基建/08_网络/07_GPU_高网设计/02_物理层硬件/03_Optical_Modules|光模块与光互连]]
- [[12_架构基建/08_网络/07_GPU_高网设计/02_物理层硬件/04_Component_Ratio_Cost|器件配比与成本结构]]
- [[12_架构基建/08_网络/07_GPU_高网设计/02_物理层硬件/05_Intra_Rack_Copper|机柜内互连与铜缆]]

### 03_拓扑设计

- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/01_Fat_Tree_CLOS|Fat-Tree 与 CLOS 无阻塞]]
- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/02_Oversubscription_Design|收敛比设计与成本权衡]]
- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/03_Rail_Optimized_Topology|Rail-Optimized 八轨拓扑]]
- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/04_CLOS_Two_Three_Layer_Scaling|二层与三层 CLOS 规模推演]]
- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/05_Topology_Parallel_Matching|拓扑与并行策略匹配]]
- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/06_Supernode_MegaPod_MultiPlane|超节点与多平面组网]]
- [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/07_Google_OCS|Google OCS 光交换]]

### 04_协议传输

- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/01_RDMA_Semantics|RDMA 语义与 verbs]]
- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/02_Lossless_Ethernet_PFC_ECN_DCQCN|无损以太 PFC/ECN/DCQCN]]
- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/03_IB_Flow_Control_Adaptive_Routing|IB 流控与自适应路由]]
- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/04_SHARP_In_Network_Computing|SHARP 在网计算]]
- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/05_IB_vs_Ethernet_SpectrumX_UEC|IB 与以太路线之争]]
- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/06_GPUDirect_Family|GPUDirect 家族]]

### 05_集合通信

- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/01_Collectives_Parallel_Mapping|集合通信原语与并行映射]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/02_Ring_vs_Tree_AllReduce|Ring 与 Tree AllReduce]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/03_NCCL_Tuning|NCCL 调优实战]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/04_Compute_Comm_Overlap|通信计算重叠]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/05_Collective_Libraries_Alternatives|集合通信库对比]]
- [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/06_NCCL_Tests_Reading|nccl-tests 判读]]

### 06_推理网络

- [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/01_Training_vs_Inference_Traffic|训练与推理流量模型对比]]
- [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/02_TP_Cross_Node_Latency|TP 跨机的时延账]]
- [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/03_PD_Disaggregation_KV_Transfer|PD 分离 KV 传输链路]]
- [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/04_Mooncake_KV_Pool|Mooncake KV 池化架构]]
- [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/05_EP_Multi_Node_Network|EP 多机推理网络]]
- [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/06_Affinity_Topology_Scheduling|亲和性与拓扑调度]]

### 07_运维故障

- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/01_Failure_Distribution_Patterns|网络故障分布与模式]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/02_Network_Diagnostics_Command_Chain|网络诊断命令链]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/03_Straggler_Identification|慢节点定位与隔离]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/04_Lossless_Config_Audit|无损网络配置核查]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/05_Multi_Tenant_Isolation|多租户网络隔离]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/06_Telemetry_Baseline_Monitoring|网络遥测与监控基线]]

### 08_容量成本

- [[12_架构基建/08_网络/07_GPU_高网设计/08_容量成本/01_Topology_Sizing_Walkthrough|拓扑规模推演六步法]]
- [[12_架构基建/08_网络/07_GPU_高网设计/08_容量成本/02_Network_CAPEX_Model|网络 CAPEX 模型]]
- [[12_架构基建/08_网络/07_GPU_高网设计/08_容量成本/03_Power_Liquid_Cooling_Network|功率液冷与网络约束]]
- [[12_架构基建/08_网络/07_GPU_高网设计/08_容量成本/04_Traffic_Modeling|集群流量建模]]

### 09_厂家

- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/01_NVIDIA_Networking_Stack|NVIDIA 网络全栈]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/02_Broadcom_Switching|Broadcom 交换芯片]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/03_AMD_UALink_Pensando|AMD 网络与 UALink]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/04_Marvell_Networking_Optics|Marvell 网络与光互连]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/05_Cisco_Silicon_One|Cisco Silicon One]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/06_MediaTek_NVLink_Fusion|联发科与 NVLink Fusion]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/07_Huawei_CloudEngine_Atlas|华为网络与昇腾组网]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/08_Intel_Ethernet_Gaudi|Intel 以太路线与 Gaudi]]

### 10_视角

- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/01_Training_Angle|训练工程师视角]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/02_Inference_Angle|推理工程师视角]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/03_Ops_Angle|网络运维视角]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/04_Cost_Angle|成本视角]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/05_Vendor_Selection_Angle|选型决策视角]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/06_Interview_Angle|面试速览（25 题）]]

---

## 三、三条学习路径

**训练工程师线**：速查 → [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/06_Bandwidth_Latency_Cheat_Sheet|数量级速查]] → [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/01_Collectives_Parallel_Mapping|原语与并行映射]] → [[12_架构基建/08_网络/07_GPU_高网设计/05_集合通信/03_NCCL_Tuning|NCCL 调优]] → [[12_架构基建/08_网络/07_GPU_高网设计/03_拓扑设计/03_Rail_Optimized_Topology|Rail 拓扑]] → [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/01_Training_Angle|训练视角]]

**推理工程师线**：[[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/01_Training_vs_Inference_Traffic|流量模型对比]] → [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/02_TP_Cross_Node_Latency|TP 时延账]] → [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/03_PD_Disaggregation_KV_Transfer|KV 传输]] → [[12_架构基建/08_网络/07_GPU_高网设计/06_推理网络/05_EP_Multi_Node_Network|EP 网络]] → [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/02_Inference_Angle|推理视角]]

**网络运维线**：[[12_架构基建/08_网络/07_GPU_高网设计/02_物理层硬件/03_Optical_Modules|光模块]] → [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/02_Network_Diagnostics_Command_Chain|诊断命令链]] → [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/03_Straggler_Identification|慢节点定位]] → [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/06_Telemetry_Baseline_Monitoring|监控基线]] → [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/03_Ops_Angle|运维视角]]

---

## 四、与既有页面的关系

本体系是专题深化，通用内容仍在原页面：

- [[10_部署推理/03_推理优化/19_Communication_系统_深入分析|LLM 通信系统全景]]：通信部分的原始深潜页，05_集合通信 层与其互补
- [[12_架构基建/08_网络/02_AI_网络|AI 网络基础设施]]：本章原有概览页
- [[12_架构基建/08_网络/06_RDMA_and_RoCE_for_AI|RDMA 与 RoCE 在 AI 集群中的应用]]：RDMA 专页
- [[13_运维/02_SRE与可靠性/10_GPU_集群_Operations_2026|GPU 集群运维 2026]]：GPU 集群运维全景（网络节与 07_运维故障 层互补）
- [[10_部署推理/03_推理优化/13_Prefill_Decode_Disaggregation|Prefill/Decode 分离]]、[[10_部署推理/03_推理优化/25_Disaggregated_服务_2026|Disaggregated 服务 2026]]：PD 分离主线页
- [[12_架构基建/02_架构概览/02_AI_基础设施_2026|AI 基础设施 2026]]：基建全景与功率液冷

---

*Last updated: 2026-10-27*
