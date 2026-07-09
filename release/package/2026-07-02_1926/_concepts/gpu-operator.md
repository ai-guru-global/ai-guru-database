---
title: NVIDIA GPU Operator
category: -concepts
tags:
- gpu-operator
- kubernetes
- nvidia
- gpu
- day-2-operations
- cdi
- mig
relationships:
- target: '_concepts/cdi'
  type: generates
- target: '_concepts/dra'
  type: deploys_driver
- target: '_concepts/gpu-virtualization'
  type: manages
- target: '_concepts/llm-infrastructure'
  type: enables
- target: '_concepts/model-deployment'
  type: enables
sources:
- 数学基础/AI_Hardware/NVIDIA_AMD_GPU_Deep_Dive.md
- 架构基建/Hardware_Compute/CDI_Deep_Dive.md
- 架构基建/CDI_for_dummy.md
summary: NVIDIA GPU Operator 是管理 Kubernetes 上 NVIDIA GPU 全栈软件的开源 Operator——以 DaemonSet 形式自动化部署驱动、nvidia-container-toolkit(生成 CDI spec)、device-plugin、DCGM 监控、MIG 管理器等组件，把 GPU 节点的 Day-0 安装与 Day-2 运维变成声明式配置。它是 CDI/DRA 在 NVIDIA 生态里的「实操入口」。
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15 00:00:00+00:00
updated: 2026-06-15 00:00:00+00:00
aliases:
  - "Gpu Operator"
  - "gpu operator"

---
# NVIDIA GPU Operator

## 核心要点

- **GPU Operator** 是 NVIDIA 开源项目（`NVIDIA/gpu-operator`），用 Operator 模式管理 K8s 节点上的 **NVIDIA GPU 全套软件栈**
- 目标：把「GPU 节点初始化」从手工 SSH 装驱动，变成 `helm install` 声明式配置
- **Day-0 自动化**: 驱动加载、容器运行时配置（containerd/docker）、nvidia-container-toolkit 部署
- **Day-2 运维**: 驱动升级、MIG 切片动态重配、DCGM 监控、节点标签、健康检查
- **CDI 生产线**: v23.9+ 可自动生成 `/var/run/cdi/nvidia.yaml`，是 [[_concepts/cdi|CDI]] 在 NVIDIA 集群的事实来源
- **DRA 载体**: 也是部署 NVIDIA DRA 驱动（见 [[_concepts/dra|DRA]]）的推荐方式

## 管理的组件

| 组件 DaemonSet | 职责 |
|----------------|------|
| **nvidia-driver** | 节点驱动加载（裸金属容器化驱动） |
| **nvidia-container-toolkit** | 注入层工具，**生成 CDI spec** 的 `nvidia-ctk` 即来自此 |
| **nvidia-device-plugin** | 旧分配层：向 kubelet 上报 GPU（计数模型） |
| **gpu-feature-discovery** | 给节点打标签（GPU 型号/显存/MIG 能力），供调度器筛选 |
| **dcgm-exporter** | 基于 DCGM 的 Prometheus 指标导出（温度/利用率/显存） |
| **nvidia-mig-manager** | MIG 分区动态配置（无需重启节点切切片） |
| **validator** | GPU 节点就绪性自检（CUDA/驱动/plugin 三联验证） |

## 解决的运维痛点

| 传统手工 | GPU Operator |
|----------|--------------|
| 每台 GPU 节点 SSH 装 CUDA 驱动 | 驱动以容器形态由 Operator 拉起，节点 OS 保持纯净 |
| 升级驱动要逐台停机 | 改 Helm values，Operator 滚动重启 driver DaemonSet |
| MIG 重配要 `nvidia-smi -mig` + 重启 | MIG Manager 按配置标签动态切换 |
| 监控要自己装 DCGM | dcgm-exporter 自动接入 Prometheus |

## CDI / DRA 集成

```yaml
# values.yaml 启用 CDI（v23.9+）
devicePlugin:
  enabled: true
  # 旧路:环境变量注入(NVIDIA_VISIBLE_DEVICES)
  # 新路:CDI 注入(推荐)
# GPU Operator 会:
#   1. 调 nvidia-ctk cdi generate → /var/run/cdi/nvidia.yaml
#   2. device-plugin 返回 CDI 设备 ID 给 kubelet
#   3. containerd 按 CDI spec 注入设备
```

- **CDI 模式**(推荐): 生成 spec → 注入层现代化 → 跨运行时可移植
- **DRA 模式**(实验): 可选部署 NVIDIA DRA 驱动，走向属性化分配

## 典型场景

- **GPU 节点规模化**: 百卡以上集群的统一驱动/工具链管理
- **MIG 运营**: 白天切 7 份跑推理、夜间合并跑训练，用 mig-manager 标签驱动
- **异构节点混部**: gpu-feature-discovery 标签让调度器区分 H100/H200/A100
- **可观测性**: dcgm-exporter + Grafana 建 GPU 监控大盘

## 局限

- **仅 NVIDIA**: 管不了昇腾/寒武纪/AMD（各家有自己的 operator 或手工方案）
- **裸金属驱动容器化**: 某些云厂商托管 K8s（GKE/EKS）已有自己的 GPU 集成，二者会冲突，需择一
- **CDI/DRA 版本对齐**: 需 Operator 版本、containerd 版本、K8s 版本三者匹配，升级有耦合

## 与相关概念的关系

```
GPU Operator (运维层)
├── 生成: CDI spec (注入地基)
├── 部署: Device Plugin (旧分配) / DRA 驱动 (新分配)
├── 管理: MIG / 监控 / 节点标签
├── 服务于: GPU 节点的全生命周期
└── 局限: 仅 NVIDIA;与托管 K8s 集成有冲突
```

## 延伸阅读

- [[_concepts/cdi|CDI 容器设备接口（Operator 生成其 spec）]]
- [[_concepts/dra|DRA（Operator 可部署其驱动）]]
- [[_concepts/gpu-virtualization|GPU 虚拟化（MIG 经 Operator 管理）]]
- [[架构基建/Hardware_Compute/CDI_Deep_Dive|CDI 深度解析]]
- [[架构基建/Hardware_Compute/DRA_Deep_Dive|DRA 深度解析]]
- [[数学基础/AI_Hardware/NVIDIA_AMD_GPU_Deep_Dive|NVIDIA/AMD GPU 深度解析]]
- [[_concepts/llm-infrastructure|LLM 基础设施]]
