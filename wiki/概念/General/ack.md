---
title: "ACK"
category: -concepts
tags: ["kubernetes", "k8s", "alibaba-cloud", "container-service", "cloud-native"]
summary: "ACK（Alibaba Cloud Container Service for Kubernetes）是阿里云提供的容器服务 Kubernetes 版，支持公有云、专有云、边缘等多种部署形态。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "Alibaba Cloud Container Service for Kubernetes"
  - "容器服务 Kubernetes 版"
  - "阿里云 ACK"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/apsara-stack"
    type: related_to
sources: []
name_zh: "阿里云容器服务"
---

# ACK

> 中文简称：阿里云容器服务

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

- [[概念/kubernetes|Kubernetes]] — 开源容器编排
- [[概念/apsara-stack|Apsara Stack]] — 阿里云专有云
- [[12_架构基建/06_云厂商/Alibaba_Cloud/专有云/03_阿里云_专有云_K8s_上下文|阿里云专有云 K8s 上下文]]

---

## 2026 ACK 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **ACK** | 阿里云托管 K8s | GA |
| **ACK Pro** | 企业级 K8s | GA |
| **ACK Serverless** | 无服务器 K8s | GA |
| **GPU 调度** | AI 训练 GPU 调度 | GA |
| **混合云** | 混合云 K8s 管理 | GA |

## 生产最佳实践

1. **托管 K8s**：阿里云环境用 ACK 托管 K8s
2. **GPU 调度**：AI 训练用 ACK GPU 调度
3. **Serverless**：弹性场景用 ACK Serverless
4. **与 Apsara Stack 配合**：专有云用 Apsara Stack
5. **安全加固**：K8s 集群安全加固

## 架构与组件

| 组件 | 职责 | 管理方 |
|------|------|--------|
| API Server | 集群入口 | 阿里云托管 |
| etcd | 状态存储 | 阿里云托管 |
| Scheduler | Pod 调度 | 阿里云托管 |
| Controller Manager | 控制器 | 阿里云托管 |
| kubelet | 节点代理 | 用户管理 |
| kube-proxy | 网络代理 | 用户管理 |
| CNI (Terway/Flannel) | 网络插件 | 用户选择 |

## AI 工作负载支持

| 特性 | 说明 | 状态 |
|------|------|------|
| GPU 调度 | NVIDIA Device Plugin | GA |
| GPU 共享 | HAMi / cGPU | GA |
| 分布式训练 | Arena / Volcano | GA |
| 推理服务 | KServe / PAI-EAS | GA |
| 弹性伸缩 | HPA + KEDA | GA |
| 队列管理 | Kueue | Beta |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 节点 NotReady | kubelet 异常 | 检查节点状态和日志 |
| Pod Pending | 资源不足 | 扩容节点或调整资源请求 |
| GPU 不可用 | 驱动/插件问题 | 检查 nvidia-device-plugin |
| 网络不通 | 安全组/网络策略 | 检查安全组和 NetworkPolicy |

## 相关概念

- [[概念/kubernetes|Kubernetes]] — 开源容器编排
- [[概念/apsara-stack|Apsara Stack]] — 阿里云专有云
- [[概念/alibaba-cloud|Alibaba Cloud]] — 阿里云
- [[概念/pai|PAI]] — 阿里云 AI 平台

## 总结

ACK 是阿里云提供的托管 Kubernetes 服务，支持多种部署形态和 AI 工作负载。在专有云环境中是容器服务的核心入口。

---

> 💡 ACK 是阿里云把 Kubernetes 做成托管服务的产物，让用户不用自己维护控制平面，就能在云上跑容器和 AI 工作负载。

## 网络方案对比

| 方案 | 模式 | 性能 | 适用场景 |
|------|------|------|----------|
| Terway | ENI 直通 | 高 | 生产环境 |
| Flannel | Overlay | 中 | 开发测试 |
| Terway IPVLAN | 内核旁路 | 极高 | 高性能场景 |

## 存储方案对比

| 方案 | 类型 | 访问模式 | 适用场景 |
|------|------|----------|----------|
| 云盘 | 块存储 | RWO | 数据库、有状态服务 |
| NAS | 文件存储 | RWX | 共享数据、模型仓库 |
| OSS | 对象存储 | RWX | 训练数据、日志 |
| CPFS | 并行文件 | RWX | 大规模训练 |

## 安全加固清单

| 维度 | 措施 | 说明 |
|------|------|------|
| 网络 | NetworkPolicy | 限制 Pod 间通信 |
| 身份 | RBAC | 最小权限原则 |
| 镜像 | 签名验证 | 只允许签名镜像 |
| 运行时 | 安全沙箱 | 强隔离场景 |
| 审计 | 日志审计 | 开启 API 审计 |
| 密钥 | KMS 集成 | Secret 加密存储 |

## 监控与可观测性

| 组件 | 用途 | 部署方式 |
|------|------|----------|
| ARMS | APM 监控 | 阿里云托管 |
| Prometheus | 指标监控 | ACK 组件 |
| Grafana | 可视化 | ACK 组件 |
| SLS | 日志服务 | 阿里云托管 |
| CloudMonitor | 基础监控 | 阿里云托管 |

## 版本兼容性

| ACK 版本 | K8s 版本 | 状态 |
|----------|---------|------|
| ACK 1.31 | K8s 1.31 | 稳定 |
| ACK 1.30 | K8s 1.30 | 维护 |
| ACK 1.29 | K8s 1.29 | EOL |

## 集群管理常用命令

| 命令 | 说明 |
|------|------|
| `kubectl get nodes` | 查看节点状态 |
| `kubectl get pods -A` | 查看所有 Pod |
| `kubectl top nodes` | 查看节点资源使用 |
| `kubectl describe node <name>` | 查看节点详情 |
| `kubectl logs <pod> -f` | 查看 Pod 日志 |
| `kubectl exec -it <pod> -- bash` | 进入 Pod |

## AI 训练最佳实践

1. **GPU 节点池**：创建专用 GPU 节点池，与 CPU 节点隔离
2. **污点容忍**：GPU 节点设置污点，只允许训练任务调度
3. **资源配额**：每个团队设置 GPU 配额
4. **队列管理**：使用 Kueue 管理训练任务队列
5. **Checkpoint 存储**：使用 NAS/CPFS 存储 Checkpoint
6. **弹性伸缩**：配置 Cluster Autoscaler 自动扩缩 GPU 节点
7. **监控告警**：GPU 利用率、显存、温度监控

## 与云厂商 K8s 服务对比

| 服务 | 厂商 | GPU 支持 | AI 集成 |
|------|------|----------|----------|
| ACK | 阿里云 | HAMi/cGPU | PAI/Arena |
| EKS | AWS | 原生 | SageMaker |
| GKE | GCP | 原生 | Vertex AI |
| AKS | Azure | 原生 | ML Studio |

## 相关概念

- [[概念/kubernetes|Kubernetes]] — 容器编排底座
- [[概念/gpu-sharing|GPU Sharing]] — GPU 共享调度
- [[概念/pai|PAI]] — 阿里云 AI 平台

> 💡 ACK 是阿里云上运行 AI 工作负载的首选容器平台，结合 Arena 和 cGPU 可高效管理 GPU 资源。
