---
title: "ACK"
category: -concepts
tags: ["kubernetes", "k8s", "alibaba-cloud", "container-service", "cloud-native"]
summary: "ACK（Alibaba Cloud Container Service for Kubernetes）是阿里云提供的容器服务 Kubernetes 版，支持公有云、专有云、边缘等多种部署形态。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "Alibaba Cloud Container Service for Kubernetes"
  - "容器服务 Kubernetes 版"
  - "阿里云 ACK"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/apsara-stack"
    type: related_to
---

# ACK

> **一句话理解**: ACK 是阿里云把 Kubernetes 做成托管服务的产物，让用户不用自己维护控制平面，就能在云上跑容器和 AI 工作负载。

## 核心要点

- **托管 K8s 控制平面**: 用户只需管理工作节点（Worker），阿里云负责 API Server、etcd、Scheduler 等高可用。
- **多种形态**: 托管版、专有版、敏捷版、Serverless 版、边缘版，覆盖公有云到专有云。
- **深度集成阿里云基础设施**: 与 ECS/神龙、SLB、NAS/OSS、RDS、ARMS、SLS、ACR 等无缝集成。
- **企业级特性**: 多集群管理、安全沙箱、机密计算、混合云网络、FinOps 成本分析。
- **AI 友好**: 支持 GPU、NPU 调度，集成 HAMi、NVIDIA Device Plugin、AI 推理框架。

## 主要版本

| 版本 | 定位 | 控制面 | 典型场景 |
|------|------|--------|---------|
| **托管版** | 标准公有云 | 阿里云托管 | 互联网应用、微服务 |
| **专有版** | 企业级 / 金融级 | 用户 VPC 内独占 | 强隔离、合规 |
| **敏捷版** | 轻量 / 私有化 | 可精简 | 边缘、分支机构 |
| **Serverless** | 无服务器 | 全托管 | 事件驱动、快速伸缩 |
| **边缘版** | 边缘节点 | 云边协同 | IoT、边缘推理 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）中，ACK 专有版与敏捷版是容器服务的核心入口，底层依赖天基 Tianji 进行部署运维，网络由洛神 Luoshen 提供，存储由盘古 Pangu 提供，统一管控通过 ASCM 实现。工单处理中常说的「ACK 集群」即指这些私有化部署的 K8s 集群。

## Related

- [[_concepts/kubernetes|Kubernetes]] — 开源容器编排
- [[_concepts/apsara-stack|Apsara Stack]] — 阿里云专有云
- [[架构基建/Alibaba_Cloud_Proprietary_K8s_Context|阿里云专有云 K8s 上下文]]
