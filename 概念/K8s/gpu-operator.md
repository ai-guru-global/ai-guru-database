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
- target: '概念/cdi'
  type: generates
- target: '概念/dra'
  type: deploys_driver
- target: '概念/gpu-virtualization'
  type: manages
- target: '概念/llm-infrastructure'
  type: enables
- target: '概念/model-deployment'
  type: enables
sources:
- 01_数学基础/10_AI_Hardware/NVIDIA_AMD_GPU_Deep_Dive.md
- 12_架构基建/07_Hardware_Compute/CDI_Deep_Dive.md
- 12_架构基建/CDI_for_dummy.md
summary: NVIDIA GPU Operator 是管理 Kubernetes 上 NVIDIA GPU 全栈软件的开源 Operator——以 DaemonSet 形式自动化部署驱动、nvidia-container-toolkit(生成 CDI spec)、device-plugin、DCGM 监控、MIG 管理器等组件，把 GPU 节点的 Day-0 安装与 Day-2 运维变成声明式配置。它是 CDI/DRA 在 NVIDIA 生态里的「实操入口」。
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-06-15 00:00:00+00:00
updated: 2026-07-21 00:00:00+00:00
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
- **CDI 生产线**: v23.9+ 可自动生成 `/var/run/cdi/nvidia.yaml`，是 [[概念/cdi|CDI]] 在 NVIDIA 集群的事实来源
- **DRA 载体**: 也是部署 NVIDIA DRA 驱动（见 [[概念/dra|DRA]]）的推荐方式

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

- [[概念/cdi|CDI 容器设备接口（Operator 生成其 spec）]]
- [[概念/dra|DRA（Operator 可部署其驱动）]]
- [[概念/gpu-virtualization|GPU 虚拟化（MIG 经 Operator 管理）]]
- [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI 深度解析]]
- [[12_架构基建/07_Hardware_Compute/DRA_Deep_Dive|DRA 深度解析]]
- [[01_数学基础/10_AI_Hardware/NVIDIA_AMD_GPU_Deep_Dive|NVIDIA/AMD GPU 深度解析]]
- [[概念/llm-infrastructure|LLM 基础设施]]

---

## 2026 GPU Operator 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GPU Operator v24.x** | 支持 B200/GB200，原生 CDI 生成 + DRA 驱动部署 | GA |
| **Node Feature Discovery (NFD)** | 自动检测 GPU 型号/显存/拓扑，打标签供调度器筛选 | GA |
| **DCGM 4.x** | 新一代 GPU 监控，支持 NVLink/PCIe 带宽、ECC 错误统计 | GA |
| **MIG Manager v2** | 动态 MIG 重配无需重启节点，支持 H100/B200 新分区模式 | GA |
| **GPU Operator + DRA** | 可选部署 NVIDIA DRA 驱动，实现属性级设备分配 | Beta |

## 生产最佳实践

1. **Helm 统一管理**：使用 Helm Chart 部署 GPU Operator，版本升级走滚动更新而非手动 SSH
2. **CDI 模式优先**：新集群启用 CDI 注入替代 NVIDIA_VISIBLE_DEVICES，确保跨运行时可移植
3. **驱动版本锁定**：在 values.yaml 中明确指定驱动版本，避免自动升级导致 CUDA 不兼容
4. **监控先行**：部署后立即配置 dcgm-exporter + Grafana 大盘，监控 GPU 温度/利用率/显存
5. **MIG 策略规划**：根据业务负载规划 MIG 分区方案，避免频繁重配影响在线服务

## GPU Operator 组件架构

| 组件 | 部署方式 | 功能 |
|------|------|------|
| gpu-operator | Deployment | 控制器 |
| nvidia-driver-daemonset | DaemonSet | 驱动安装 |
| nvidia-container-toolkit-daemonset | DaemonSet | 容器运行时 |
| nvidia-device-plugin-daemonset | DaemonSet | 设备插件 |
| dcgm-exporter | DaemonSet | 监控指标 |
| gpu-feature-discovery | DaemonSet | 节点标签 |
| mig-manager | DaemonSet | MIG 管理 |

## 支持的 GPU 型号

| 型号 | 架构 | 显存 | MIG 支持 |
|------|------|------|------|
| A100 | Ampere | 40/80 GB | ✅ |
| H100 | Hopper | 80 GB | ✅ |
| H200 | Hopper | 141 GB | ✅ |
| L40S | Ada | 48 GB | ❌ |
| T4 | Turing | 16 GB | ❌ |
| A30 | Ampere | 24 GB | ✅ |

## Helm 部署示例

```bash
# 添加 NVIDIA Helm 仓库
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update

# 部署 GPU Operator
helm install gpu-operator nvidia/gpu-operator \
  --namespace gpu-operator --create-namespace \
  --set driver.version=535.129.03 \
  --set toolkit.enabled=true \
  --set dcgmExporter.enabled=true \
  --set migManager.enabled=true
```

## 监控指标

| 指标 | 说明 | 告警阈值 |
|------|------|------|
| DCGM_FI_DEV_GPU_TEMP | GPU 温度 | > 85°C |
| DCGM_FI_DEV_GPU_UTIL | GPU 利用率 | < 10% (闲置) |
| DCGM_FI_DEV_FB_USED | 显存使用 | > 90% |
| DCGM_FI_DEV_POWER_USAGE | 功耗 | > TDP 90% |
| DCGM_FI_DEV_XID_ERRORS | XID 错误 | > 0 |

> 💡 GPU Operator 是 K8s 上 NVIDIA GPU 管理的标准方案，2026 年 AI 集群必装组件，实现驱动/运行时/监控全自动化。

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| GPU 不可见 | 驱动未安装 | 检查 driver-daemonset |
| CUDA 不兼容 | 驱动版本低 | 升级驱动版本 |
| MIG 失败 | GPU 不支持 | 检查 GPU 型号 |
| 监控无数据 | dcgm-exporter 异常 | 重启 Pod |
