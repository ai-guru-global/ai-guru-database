---
title: "Kubernetes"
category: -concepts
tags: ["kubernetes", "k8s", "orchestration", "container", "cncf", "scheduling", "cloud-native"]
relationships:
  - target: "_concepts/containerd"
    type: uses
  - target: "_concepts/helm"
    type: related_to
  - target: "_concepts/cni"
    type: uses
  - target: "_concepts/csi"
    type: uses
  - target: "_concepts/hami"
    type: runs_on
  - target: "_concepts/kubeflow"
    type: runs_on
  - target: "_concepts/kserve"
    type: runs_on
sources:
  - 12_Architecture_Infrastructure/Architecture_Overview/AI_Infrastructure_2026
summary: "Kubernetes 是 CNCF Graduated 的容器编排平台，提供自动化部署、扩缩容、负载均衡和自愈能力，是云原生 AI 工作负载（训练、推理、MLOps）的事实标准运行基座。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.95
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
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

- [[_concepts/containerd]] — containerd
- [[_concepts/helm]] — Helm
- [[_concepts/etcd]] — etcd
- [[_concepts/hami]] — HAMi GPU 虚拟化
- [[_concepts/kubeflow]] — Kubeflow
- [[_concepts/kserve]] — KServe
- [[_concepts/pod]] — Pod
- [[_concepts/deployment]] — Deployment
- [[_concepts/service]] — Service
- [[_concepts/cni]] — CNI
- [[_concepts/csi]] — CSI
- [[_concepts/rbac]] — RBAC
- [[12_Architecture_Infrastructure/Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026
- [[12_Architecture_Infrastructure/Kubernetes_Core_Components_Deep_Dive]] — K8s 核心组件深度解析
- [[12_Architecture_Infrastructure/Kubernetes_Networking_Deep_Dive]] — K8s 网络深度解析
- [[12_Architecture_Infrastructure/Kubernetes_Storage_Deep_Dive]] — K8s 存储深度解析
- [[13_AI_Ops/Kubernetes_Troubleshooting_Playbook]] — K8s 运维排障 Playbook
