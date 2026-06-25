---
title: "HAMi 深度解析: Kubernetes 异构算力虚拟化中间件"
category: "12-architecture-infrastructure"
tags: ["hami", "gpu-virtualization", "heterogeneous-computing", "cncf", "kubernetes", "vgpu", "gpu-sharing", "scheduling", "dra", "cdi", "dynamia"]
summary: "> **一句话理解**: HAMi 是 CNCF Sandbox 级 Kubernetes 异构 AI 算力虚拟化中间件，通过 Scheduler Extender + Device Plugin + 容器内 CUDA 拦截库，把 NVIDIA/昇腾/寒武纪/海光/摩尔线程等加速器统一抽象为可切分、可隔离、可调度的 vGPU。"
created: "2026-06-16"
updated: "2026-06-16"
---

# HAMi 深度解析: Kubernetes 异构算力虚拟化中间件

> **一句话理解**: HAMi 是 CNCF Sandbox 级 Kubernetes 异构 AI 算力虚拟化中间件，通过 Scheduler Extender + Device Plugin + 容器内 CUDA 拦截库，把 NVIDIA/昇腾/寒武纪/海光/摩尔线程等加速器统一抽象为可切分、可隔离、可调度的 vGPU。

> **项目状态**: CNCF Sandbox（2024-08 入驻） | **最新版本**: v2.9.0 | **官方站点**: https://project-hami.io

---

## 目录

1. [项目背景与定位](#1-项目背景与定位)
2. [核心问题：为什么需要 HAMi](#2-核心问题为什么需要-hami)
3. [架构全景](#3-架构全景)
4. [四大核心组件详解](#4-四大核心组件详解)
5. [GPU 虚拟化与隔离机制](#5-gpu-虚拟化与隔离机制)
6. [调度策略与拓扑感知](#6-调度策略与拓扑感知)
7. [资源语义与使用方式](#7-资源语义与使用方式)
8. [与 CDI / DRA / GPU Operator 的关系](#8-与-cdi--dra--gpu-operator-的关系)
9. [多厂商适配现状](#9-多厂商适配现状)
10. [与 vLLM / TGI / Xinference 的集成](#10-与-vllm--tgi--xinference-的集成)
11. [生产落地案例](#11-生产落地案例)
12. [优势、局限与选型建议](#12-优势局限与选型建议)
13. [官方资源](#13-官方资源)

---

## 1. 项目背景与定位

### 1.1 发展历程

- **2021 年**：项目以 `k8s-vGPU-scheduler` 之名由第四范式等贡献者发起，目标解决 K8s 中 NVIDIA Device Plugin 一卡一 Pod 导致的利用率低下问题。
- **2024 年 8 月**：正式被 CNCF 接纳为 **Sandbox** 项目，并进入 CNCF Landscape 与 CNAI（Cloud Native AI）Landscape。
- **2025 年**：密瓜智能（Dynamia.ai）成立，核心团队为 HAMi 原作者与 Maintainer，推动开源社区与企业版双轮发展。
- **2026 年**：最新版本 v2.9.0，支持 DRA、CDI、AWS Neuron、动态 MIG、Volcano 集成等能力。

### 1.2 项目定位

| 维度 | 定位 |
|------|------|
| **技术层** | Kubernetes 异构 AI 加速器虚拟化与调度中间件 |
| **基金会** | CNCF Sandbox，CNAI Landscape 项目 |
| **发起/维护** | 开源社区 + 密瓜智能（Dynamia.ai）核心 Maintainer |
| **许可证** | Apache 2.0 |
| **核心目标** | 让异构算力像水电一样因开源而简单好用 |

---

## 2. 核心问题：为什么需要 HAMi

### 2.1 GPU 利用率困境

在典型 AI 推理与开发测试集群中，GPU 平均利用率往往只有 **10%-30%**：

- 推理服务白天高峰占满卡，夜间闲置。
- 开发测试人员每人独占一张卡，实际只跑小模型。
- 大模型训练需要整卡，但验证/调试阶段负载很轻。

### 2.2 Kubernetes 原生 Device Plugin 的局限

```
传统 Device Plugin 模型：
  Pod A ──→ 整卡 GPU 0
  Pod B ──→ 整卡 GPU 1
  Pod C ──→ 整卡 GPU 2
  ...
结果：一张卡只能给一个 Pod 用，无法细粒度共享。
```

Kubernetes Device Plugin 只负责「发现并分配物理设备」，不提供：

- 显存切分与隔离
- 算力百分比限制
- 多厂商统一语义
- 拓扑感知调度

### 2.3 HAMi 带来的改变

```
HAMi 模型：
  GPU 0 ──┬── vGPU 0 (Pod A, 3GB, 30% 算力)
          ├── vGPU 1 (Pod B, 5GB, 50% 算力)
          └── vGPU 2 (Pod C, 2GB, 20% 算力)
结果：单卡多 Pod 共享，显存与算力硬隔离。
```

---

## 3. 架构全景

### 3.1 请求生命周期

```
用户提交 Pod
    │
    ▼
MutatingWebhook
  └── 注入 schedulerName=hami-scheduler
  └── 注入设备类型/厂商注解
    │
    ▼
HAMi Scheduler Extender
  ├── Filter：节点是否满足资源请求
  ├── Score：binpack / spread / topology 打分
  └── Bind：选定 GPU 并写回注解
    │
    ▼
kubelet → Device Plugin Allocate
  └── 读取 Pod 注解，准备设备清单
    │
    ▼
容器启动
  └── CDI / 环境变量 / 设备节点注入
  └── libvgpu.so (HAMi-core) 预加载
    │
    ▼
应用运行
  └── CUDA/NVML API 调用被拦截
  └── 显存/算力配额强制执行
```

### 3.2 组件关系图

```
┌─────────────────────────────────────────────────────────────┐
│                      Kubernetes Control Plane                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   API Server │  │   Scheduler  │  │ HAMi Scheduler   │  │
│  │              │  │  (Extender)  │  │   Extender       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│           ▲                                    │             │
│           └────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                        GPU Worker Node                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   kubelet    │◄─┤ HAMi Device  │  │  HAMi WebUI      │  │
│  │              │  │   Plugin     │  │  (可选)          │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────┘  │
│                           │                                  │
│              ┌────────────┼────────────┐                    │
│              ▼            ▼            ▼                    │
│         ┌────────┐  ┌──────────┐  ┌──────────┐             │
│         │ vGPU   │  │  libvgpu │  │ vGPUmonitor│            │
│         │ monitor│  │  (hook)  │  │ (metrics) │             │
│         └────────┘  └──────────┘  └──────────┘             │
│                              │                               │
│                              ▼                               │
│                    ┌─────────────────────┐                   │
│                    │  Physical GPU/NPU   │                   │
│                    └─────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 四大核心组件详解

### 4.1 HAMi Scheduler Extender

- **部署形态**：以 Deployment 运行在 `kube-system`，通过 `--config` 向 Kubernetes 原生 scheduler 注册为 Extender。
- **核心职责**：
  - **Filter**：过滤不满足显存/算力/拓扑要求的节点。
  - **Score**：按 binpack（集中填包）或 spread（分散负载）策略打分。
  - **Bind**：在节点内选择具体 GPU 设备，并将分配结果写入 Pod 注解。
- **关键配置项**：
  - `scheduler.defaultSchedulerPolicy.nodeSchedulerPolicy`：`binpack` | `spread`
  - `scheduler.defaultSchedulerPolicy.gpuSchedulerPolicy`：`binpack` | `spread`

### 4.2 HAMi Device Plugin

- **部署形态**：DaemonSet，每个 GPU 节点运行一个 Pod。
- **核心职责**：
  - 向 kubelet 注册虚拟设备数量（由 `deviceSplitCount` 决定）。
  - 在 `Allocate` 阶段读取 scheduler 写好的注解，设置容器环境变量、设备节点、CDI 注入。
- **关键配置项**：
  - `devicePlugin.deviceSplitCount`：每张物理卡切分成多少 vGPU。
  - `devicePlugin.migStrategy`：`none` | `mixed`。
  - `devicePlugin.nvidianodeSelector`：只在这些节点上调度 HAMi。

### 4.3 HAMi-core（libvgpu.so）

- **位置**：通过 LD_PRELOAD 注入到业务容器内。
- **工作原理**：
  - 使用 `dlsym` 钩子拦截 CUDA Runtime / Driver API 与 NVML API。
  - `cuMemAlloc` 等显存分配 API 被重定向，检查当前容器已用显存是否超过限额。
  - `nvmlDeviceGetMemoryInfo` 等查询 API 被虚拟化，返回容器视角的显存总量。
- **隔离粒度**：
  - 显存：硬限制，超额返回 `CUDA_ERROR_OUT_OF_MEMORY`。
  - 算力：通过时间片/流控限制 SM 利用率。

### 4.4 vGPUmonitor

- **职责**：
  - 监控每个容器的 GPU 使用量（显存、算力、温度、功率）。
  - 暴露 Prometheus 指标，供 HAMi WebUI 与外部告警系统消费。
- **关键指标**：
  - `hami_vgpu_memory_used_bytes`
  - `hami_vgpu_memory_limit_bytes`
  - `hami_vgpu_utilization`
  - `hami_vgpu_core_limit`

---

## 5. GPU 虚拟化与隔离机制

### 5.1 虚拟化层次对比

| 方案 | 隔离级别 | 粒度 | 性能开销 | 代表 |
|------|---------|------|---------|------|
| **MIG（硬件）** | 硬件级 | 固定分区 | 最低 | NVIDIA A100/H100/B200 |
| **HAMi（软件）** | 驱动/运行时级 | 任意比例 | 中 | HAMi vGPU |
| **NVIDIA vGPU（商业）** | 驱动级 | 固定配置 | 中 | NVIDIA GRID / vGPU |
| **时间分片** | OS 级 | 时间片 | 高抖动 | CUDA MPS |

### 5.2 HAMi 隔离实现

```c
// HAMi-core 显存拦截示例（概念）
CUresult cuMemAlloc(CUdeviceptr *dptr, size_t bytesize) {
    if (current_usage + bytesize > memory_limit) {
        return CUDA_ERROR_OUT_OF_MEMORY;
    }
    current_usage += bytesize;
    return real_cuMemAlloc(dptr, bytesize);
}
```

- **显存隔离**：硬限制，容器内程序看到的总显存等于配额，超额分配失败。
- **算力隔离**：通过限制并发 kernel 数量或时间片占比实现，避免单一容器占满 SM。
- **进程级会计**：共享内存区域 + 信号量，多进程共享同一容器配额。

### 5.3 动态 MIG 支持

HAMi 支持 NVIDIA MIG 的两种模式：

| 模式 | 说明 |
|------|------|
| `none` | 不使用 MIG，整卡通过 HAMi 软件切分 |
| `mixed` | 节点上同时存在 MIG 实例和非 MIG GPU，HAMi 统一管理 |

> `single` 模式（纯 MIG 节点）当前未支持。

---

## 6. 调度策略与拓扑感知

### 6.1 调度策略

| 策略 | 行为 | 适用场景 |
|------|------|---------|
| **binpack** | 优先把任务集中放到同一节点/同一张卡 | 提升利用率、减少碎片 |
| **spread** | 优先把任务分散到不同节点/不同卡 | 降低单点故障影响、均衡负载 |
| **NUMA 亲和** | 优先选择同一 NUMA 节点内的 GPU | 降低跨 NUMA 延迟 |
| **NVLink 亲和** | 多卡任务优先选择 NVLink 互联的 GPU | 训练/大模型推理 |

### 6.2 调度配置示例

```yaml
# values.yaml 片段
scheduler:
  defaultSchedulerPolicy:
    nodeSchedulerPolicy: binpack
    gpuSchedulerPolicy: spread
  leaderElect: true
  replicas: 3
```

---

## 7. 资源语义与使用方式

### 7.1 NVIDIA GPU

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: vllm-hami
spec:
  schedulerName: hami-scheduler
  containers:
    - name: vllm
      image: vllm/vllm-openai:latest
      resources:
        limits:
          nvidia.com/gpu: 1          # 需要 1 个物理 GPU 切片
          nvidia.com/gpumem: 8192    # 每个切片 8192 MiB 显存
          nvidia.com/gpucores: 50    # 每个切片 50% 算力
```

### 7.2 显存单位

- `nvidia.com/gpumem`：整数，单位 MiB。
- `nvidia.com/gpumem-percentage`：整数，占单卡总显存百分比。

### 7.3 指定设备类型/UUID

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
    nvidia.com/gpumem: 4096
  annotations:
    hami.io/node-nvidia-scheduler-policy: "spread"
```

---

## 8. 与 CDI / DRA / GPU Operator 的关系

### 8.1 HAMi vs CDI

| 对比项 | HAMi | CDI |
|--------|------|-----|
| **层级** | 设备共享 + 隔离 + 调度 | 设备注入标准 |
| **关系** | HAMi 可利用 CDI 将设备规范注入容器 | CDI 可被 HAMi 消费 |
| **解决的问题** | 异构设备共享与隔离 | 设备如何被容器运行时识别和挂载 |

> 参考本库 [[12_Architecture_Infrastructure/CDI_Deep_Dive]]。

### 8.2 HAMi vs DRA

| 对比项 | HAMi Device Plugin 模式 | HAMi DRA 模式 |
|--------|------------------------|---------------|
| **K8s 版本** | 兼容较老版本 | 需要 K8s 1.34+（DRA GA） |
| **调度参与** | Scheduler Extender 外部参与 | 原生 scheduler 内部参与分配 |
| **资源模型** | 扩展资源 `nvidia.com/gpu` | `ResourceClaim` + 结构化参数 |
| **迁移成本** | 低 | 中 |

HAMi 新版同时支持两种模式，用户可按集群版本和团队能力选择。

> 参考本库 [[12_Architecture_Infrastructure/DRA_Deep_Dive]]。

### 8.3 HAMi vs NVIDIA GPU Operator

| 对比项 | GPU Operator | HAMi |
|--------|-------------|------|
| **主要职责** | 驱动、Container Toolkit、Device Plugin、MIG Manager | GPU 共享、隔离、调度 |
| **能否共存** | 可以 | 可以 |
| **建议组合** | GPU Operator 负责驱动+MIG；HAMi 负责共享调度 | — |

---

## 9. 多厂商适配现状

| 厂商/芯片 | 显存隔离 | 算力隔离 | 多卡支持 | 状态 |
|-----------|---------|---------|---------|------|
| **NVIDIA GPU** | ✅ | ✅ | ✅ | 最成熟 |
| **华为昇腾 NPU** | 开发中 | 开发中 | ❌ | 持续适配 |
| **寒武纪 MLU** | ✅ | ❌ | ❌ | 可用 |
| **海光 DCU** | ✅ | ✅ | ❌ | 可用 |
| **摩尔线程 GPU** | 开发中 | 开发中 | ❌ | 持续适配 |
| **沐曦 MetaX** | 开发中 | 开发中 | ❌ | 持续适配 |
| **天数智芯** | 开发中 | 开发中 | ❌ | 持续适配 |
| **壁仞** | 开发中 | 开发中 | ❌ | 持续适配 |
| **AWS Neuron** | ✅ | ✅ | ✅ | v2.7.0+ 支持 |

> 实际支持情况请以官方文档最新版为准。

---

## 10. 与 vLLM / TGI / Xinference 的集成

### 10.1 vLLM

HAMi 已与 vLLM Production Stack 验证兼容。在 vLLM Pod 中直接申请 vGPU 资源即可：

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
    nvidia.com/gpumem: 16384
```

vLLM 看到的显存即为配额，可同时运行多个 vLLM 实例共卡。

### 10.2 TGI / Xinference

同理，只需在资源限制中声明 `nvidia.com/gpu` 与 `nvidia.com/gpumem`，无需修改应用镜像或启动参数。

---

## 11. 生产落地案例

### 11.1 顺丰科技

- **场景**：大规模异构算力池化与调度。
- **效果**：6 张 GPU 部署 19 个测试服务，节省 13 张卡，资源效率提升 2 倍以上。
- **来源**：CNCF Case Study。

### 11.2 PREP EDU（越南 AI 学习平台）

- **场景**：RTX 4070 与 RTX 4090 混装的复杂异构环境。
- **效果**：GPU 集群痛点减少 50%，GPU 基础架构优化 90%。
- **来源**：CNCF Case Study。

---

## 12. 优势、局限与选型建议

### 12.1 优势

- **利用率提升明显**：典型场景 2-5 倍。
- **多厂商支持**：不绑定 NVIDIA，适配国产芯片。
- **无侵入**：业务容器无需改代码。
- **社区活跃**：CNCF Sandbox，GitHub 3,500+ Stars。
- **企业版可选**：密瓜智能提供原厂 SLA 与加固支持。

### 12.2 局限

- 软件隔离在高负载下的抖动大于硬件 MIG。
- 部分国产芯片仍在持续适配。
- 视频编解码支持有限。
- MIG single 模式未支持。

### 12.3 选型建议

| 场景 | 推荐方案 |
|------|---------|
| 多租户推理、需要强隔离 | NVIDIA MIG + HAMi（mixed 模式） |
| 开发测试、轻量共享 | HAMi 软件切分 |
| 国产芯片混部 | HAMi（按官方支持矩阵选择芯片） |
| 大规模训练 | 整卡独占或 MIG，HAMi 用于辅助共享 |

---

## 13. 官方资源

- **官网**: https://project-hami.io
- **GitHub**: https://github.com/Project-HAMi/HAMi
- **文档**: https://project-hami.io/docs
- **中文文档**: https://project-hami.io/zh/docs
- **HAMi WebUI**: https://github.com/Project-HAMi/HAMi-WebUI
- **企业版**: https://dynamia.ai

---

## Related

- [[_concepts/hami]] — HAMi 概念卡片
- [[_concepts/gpu-virtualization]] — GPU 虚拟化
- [[_concepts/heterogeneous-gpu]] — 异构 GPU 集群
- [[_concepts/cdi]] — CDI 容器设备接口
- [[_concepts/dra]] — DRA 动态资源分配
- [[12_Architecture_Infrastructure/HAMi_Operation_Guide]] — HAMi 运维指南
- [[12_Architecture_Infrastructure/HAMi_for_dummy]] — HAMi 入门
- [[13_AI_Ops/HAMi_Troubleshooting_Guide]] — HAMi 问题排查
