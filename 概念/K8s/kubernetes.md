---
title: "Kubernetes"
category: -concepts
tags: ["kubernetes", "k8s", "orchestration", "container", "cncf", "scheduling", "cloud-native"]
relationships:
  - target: "概念/containerd"
    type: uses
  - target: "概念/helm"
    type: related_to
  - target: "概念/cni"
    type: uses
  - target: "概念/csi"
    type: uses
  - target: "概念/hami"
    type: runs_on
  - target: "概念/kubeflow"
    type: runs_on
  - target: "概念/kserve"
    type: runs_on
sources:
  - 架构基建/Architecture_Overview/AI_Infrastructure_2026
summary: "Kubernetes 是 CNCF Graduated 的容器编排平台，提供自动化部署、扩缩容、负载均衡和自愈能力，是云原生 AI 工作负载（训练、推理、MLOps）的事实标准运行基座。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.95
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Kubernetes

---
# Kubernetes

> 云原生世界的「操作系统」——把一堆容器编排成可扩展、可自愈的分布式应用。

---

## 1. 一句话定义

**Kubernetes**（K8s）是 CNCF Graduated 的开源容器编排平台，提供自动化部署、扩缩容、负载均衡、服务发现和自愈能力。它是现代云原生 AI 基础设施（训练、推理、MLOps、Agent 平台）的事实标准运行基座。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **容器编排** | 自动化调度 Pod 到节点 |
| **服务发现与负载均衡** | Service + Ingress |
| **自动扩缩容** | HPA、VPA、Cluster Autoscaler |
| **存储编排** | PVC、CSI 插件 |
| **配置管理** | ConfigMap、Secret |
| **自愈** | 自动重启、重新调度、滚动更新 |
| **声明式 API** | YAML 描述期望状态 |

---

## 3. 架构组件

```
Control Plane
  ├── API Server
  ├── etcd
  ├── Scheduler
  ├── Controller Manager
  └── Cloud Controller Manager

Worker Node
  ├── kubelet
  ├── kube-proxy
  └── Container Runtime (containerd)
```

---

## 4. AI 场景中的 Kubernetes

| 场景 | 用途 |
|------|------|
| **分布式训练** | PyTorchJob、MPIJob、TFJob |
| **模型服务** | KServe、vLLM、TGI 部署 |
| **MLOps** | Kubeflow Pipelines、MLflow |
| **GPU 共享** | HAMi、NVIDIA Device Plugin |
| **Agent 平台** | Dify、Coze、OpenClaw 部署 |

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **containerd / CRI-O** | 容器运行时 |
| **Helm** | K8s 包管理器 |
| **etcd** | K8s 配置存储 |
| **Prometheus/Grafana** | K8s 监控 |
| **HAMi / GPU Operator** | K8s GPU 管理 |
| **Kubeflow / KServe** | K8s AI/ML 平台 |

---

## Related

- [[概念/containerd]] — containerd
- [[概念/helm]] — Helm
- [[概念/etcd]] — etcd
- [[概念/hami]] — HAMi GPU 虚拟化
- [[概念/kubeflow]] — Kubeflow
- [[概念/kserve]] — KServe
- [[概念/pod]] — Pod
- [[概念/deployment]] — Deployment
- [[概念/service]] — Service
- [[概念/cni]] — CNI
- [[概念/csi]] — CSI
- [[概念/rbac]] — RBAC
- [[架构基建/Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026
- [[架构基建/Kubernetes_Core_Components_Deep_Dive]] — K8s 核心组件深度解析
- [[架构基建/Kubernetes_Networking_Deep_Dive]] — K8s 网络深度解析
- [[架构基建/Kubernetes_Storage_Deep_Dive]] — K8s 存储深度解析
- [[运维/Kubernetes_Troubleshooting_Playbook]] — K8s 运维排障 Playbook

---

## 2026 Kubernetes AI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **K8s 1.32/1.33** | DRA Beta、Sidecar Containers GA、Gateway API 集成 | GA |
| **LeaderWorkerSet (LWS)** | 分布式训练/推理的多 Pod 协调，支持 Gang Scheduling | Beta |
| **Kueue + Volcano** | 批作业排队 + 高性能调度，AI 训练集群标配 | GA |
| **Gateway API v1.1** | 替代 Ingress，支持 gRPC/HTTP 推理流量路由 | GA |
| **Confidential Containers** | 基于 TEE 的机密容器，保护 AI 模型/数据安全 | Beta |

## 生产最佳实践

1. **版本策略**：生产集群保持 N-1 版本，每季度评估升级，避免大版本跳跃
2. **GPU 节点池化**：GPU 节点使用独立节点池 + Taint/Toleration，与 CPU 工作负载隔离
3. **资源配额必配**：每个 Namespace 设置 ResourceQuota + LimitRange，防止资源耗尽
4. **监控全覆盖**：部署 Prometheus + Grafana + Alertmanager，监控控制面/节点/Pod 全链路
5. **GitOps 管理**：使用 ArgoCD/Flux 管理集群配置，变更可追溯、可回滚
