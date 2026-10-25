---
title: "HAMi (Heterogeneous AI Computing Virtualization Middleware)"
category: -concepts
tags: ["hami", "gpu-virtualization", "heterogeneous-computing", "cncf", "kubernetes", "gpu-sharing", "vgpu", "scheduling"]
relationships:
  - target: "概念/gpu-virtualization"
    type: extends
  - target: "概念/heterogeneous-gpu"
    type: enables
  - target: "概念/cdi"
    type: related_to
  - target: "概念/dra"
    type: related_to
  - target: "概念/gpu-operator"
    type: related_to
sources:
  - 12_架构基建/03_AI技术栈/HAMi_Deep_Dive.md
  - 12_架构基建/03_AI技术栈/HAMi_Operation_Guide.md
  - AI运维/SRE_Reliability/HAMi_Troubleshooting_Guide.md
summary: "HAMi 是 CNCF Sandbox 级异构 AI 算力虚拟化中间件，前身 k8s-vGPU-scheduler，可在 Kubernetes 上共享和隔离 GPU/NPU/MLU 等加速器，实现细粒度切分、显存硬隔离、拓扑感知调度与多厂商统一纳管。"
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.90
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Hami

name_zh: "异构算力虚拟化中间件"
---
# HAMi (Heterogeneous AI Computing Virtualization Middleware)

> 中文简称：异构算力虚拟化中间件

> Kubernetes 上的异构 AI 算力「切分机」——让一张 GPU 像 CPU/内存一样被多个 Pod 安全共享。

---

## 1. 一句话定义

**HAMi** 是面向 Kubernetes 的异构 AI 计算设备虚拟化中间件，由原 k8s-vGPU-scheduler 演进而来，2024 年 8 月进入 CNCF Sandbox。它通过 Device Plugin + Scheduler Extender + 容器内 CUDA/NVML 拦截库（HAMi-core / libvgpu.so）的组合，把 NVIDIA GPU、华为昇腾、寒武纪 MLU、海光 DCU、摩尔线程、沐曦、天数智芯、AWS Neuron 等异构加速器统一抽象为可按需切分的虚拟设备。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **设备共享** | 单张物理 GPU 切分为多个 vGPU，多 Pod 同时共享 |
| **显存硬隔离** | 通过 CUDA API 拦截实现容器级显存上限，防止超额使用 |
| **算力隔离** | 限制 SM 利用率或指定算力百分比，避免邻居干扰 |
| **多厂商适配** | NVIDIA、昇腾、寒武纪、海光、摩尔线程、沐曦、天数智芯、壁仞、AWS Neuron 等 |
| **拓扑感知调度** | 支持 NUMA、NVLink、GPU 亲和性，binpack / spread 策略 |
| **云原生零侵入** | 沿用 `nvidia.com/gpu` 资源语义，业务容器无需改代码 |
| **DRA / CDI 兼容** | 新版本支持 Kubernetes DRA 资源模型与 CDI 设备注入 |

---

## 3. 资源语义（Pod 中如何使用）

```yaml
resources:
  limits:
    nvidia.com/gpu: 1          # 需要 1 个物理 GPU 的切片
    nvidia.com/gpumem: 3000    # 每个切片 3000 MiB 显存（可选）
    nvidia.com/gpucores: 50    # 每个切片 50% 算力（可选）
```

> 注意：安装 HAMi 后，节点上注册的 `nvidia.com/gpu` 数量会变成 vGPU 数量（由 deviceSplitCount 决定）；Pod 里请求的 `nvidia.com/gpu` 仍表示需要的物理 GPU 数量。

---

## 4. 架构组件

```
Pod 提交
  ├── MutatingWebhook：注入 schedulerName=hami-scheduler 与设备注解
  ├── HAMi Scheduler Extender：Filter / Score / Bind，拓扑与策略决策
  ├── Device Plugin Allocate：读取注解，设置环境变量与设备文件
  └── HAMi-core (libvgpu.so)：容器内拦截 CUDA/NVML，执行配额与隔离
```

| 组件 | 职责 |
|------|------|
| **hami-scheduler** | K8s Scheduler Extender，负责异构设备调度 |
| **hami-device-plugin** | 向 kubelet 注册虚拟设备并执行 Allocate |
| **HAMi-core / libvgpu.so** | 容器内 CUDA/NVML 钩子，硬隔离显存与算力 |
| **vGPUmonitor** | 每容器 GPU 用量监控，暴露 Prometheus 指标 |
| **HAMi WebUI** | 可视化资源 overview（可选） |

---

## 5. 典型场景

1. **开发测试集群**：多人共享同一张 GPU，按需分配 1/4 或 1/8 卡。
2. **多租户推理服务**：vLLM / TGI 多个实例共卡，显存硬隔离避免 OOM 扩散。
3. **国产算力池化**：昇腾 / 海光 / 寒武纪混合部署，统一调度接口。
4. **边缘推理**：单卡边缘设备切分给多个轻量模型服务。

---

## 6. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **NVIDIA Device Plugin** | HAMi 替代或共存，解决其整卡独占问题 |
| **NVIDIA GPU Operator** | HAMi 可与 GPU Operator 集成，由 Operator 管理驱动/MIG |
| **CDI** | HAMi 支持通过 CDI 将设备规范注入容器 |
| **DRA** | HAMi 新版集成 DRA，实现调度器参与的资源分配 |
| **MIG** | HAMi 支持动态 MIG（mixed/none 模式），但非硬件 MIG 强隔离 |
| **Volcano** | HAMi 可与 Volcano 配合，支持 Dynamic MIG 等高级调度 |
| **vLLM / Xinference** | 已验证兼容，可直接作为推理引擎运行在 HAMi vGPU 上 |

---

## 7. 优势与局限

### 优势
- 提升 GPU 利用率 2-5 倍，降低 AI 基础设施成本。
- 不绑定单一芯片厂商，适配国产算力。
- 部署简单，Helm 一键安装。
- CNCF Sandbox 背书，社区活跃（3,500+ Stars，多家生产用户）。

### 局限
- 软件隔离在高负载场景仍有轻微抖动，不如 MIG 硬件隔离稳定。
- 部分厂商设备仍在持续适配中（显存/算力隔离支持度不一）。
- 视频编解码（NVDEC/ENCODE）当前支持有限。
- MIG 仅支持 mixed / none 模式，single 模式暂不支持。

---

## Related

- [[概念/gpu-virtualization]] — GPU 虚拟化技术全景
- [[概念/heterogeneous-gpu]] — 异构 GPU 集群
- [[概念/cdi]] — CDI 容器设备接口
- [[概念/dra]] — DRA 动态资源分配
- [[概念/gpu-operator]] — NVIDIA GPU Operator
- [[12_架构基建/03_AI技术栈/11_HAMi_深入分析]] — HAMi 深度解析
- [[12_架构基建/03_AI技术栈/12_HAMi_Operation_指南]] — HAMi 运维指南
- [[13_运维/02_SRE与可靠性/HAMi_Troubleshooting_Guide]] — HAMi 问题排查

---

## 2026 HAMi 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **HAMi v2.6** | 支持 8+ 芯片厂商，DRA/CDI 兼容，调度性能优化 | GA |
| **CNCF Sandbox → Incubating** | 社区活跃度提升，生产用户增加至 50+ | GA |
| **vGPUmonitor v2** | 每容器 GPU 用量监控，支持 Grafana 大盘与告警 | GA |
| **Volcano 集成** | 与 Volcano 调度器配合，支持 Gang Scheduling + vGPU | GA |
| **WebUI 可视化** | 集群 GPU 资源 overview、分配状态、使用率可视化 | GA |

## 生产最佳实践

1. **显存硬隔离必开**：生产环境启用 `gpumem` 限制，防止单容器 OOM 影响同卡其他服务
2. **合理设置 deviceSplitCount**：根据 GPU 显存大小和业务需求设置切分数，避免过度碎片化
3. **监控全覆盖**：部署 vGPUmonitor + Prometheus，监控每容器显存/算力使用率
4. **多厂商分别验证**：异构集群中分别验证各厂商设备的显存/算力隔离支持度
5. **与 GPU Operator 协同**：NVIDIA 节点使用 GPU Operator 管理驱动，HAMi 负责虚 拟化层

## HAMi vs 其他 GPU 共享方案

| 方案 | 类型 | 显存隔离 | 算力隔离 | 多厂商 |
|------|------|------|------|------|
| HAMi | 软件 | ✅ | ✅ | ✅ |
| MIG | 硬件 | ✅ | ✅ | ❌ (NVIDIA) |
| vGPU | 驱动 | ✅ | ✅ | 部分 |
| Time-slicing | 时间片 | ❌ | ❌ | ✅ |
| MPS | 进程 | ❌ | 部分 | ❌ (NVIDIA) |

## HAMi 配置示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  containers:
  - name: app
    image: nvidia/cuda:12.0-base
    resources:
      limits:
        nvidia.com/gpu: 1          # GPU 数量
        nvidia.com/gpumem: 4096    # 显存限制 (MB)
        nvidia.com/gpucores: 50    # 算力限制 (%)
```

## 支持的 GPU 厂商

| 厂商 | 设备类型 | 显存隔离 | 算力隔离 |
|------|------|------|------|
| NVIDIA | GPU | ✅ | ✅ |
| AMD | GPU | ✅ | ✅ |
| 华为 | Ascend NPU | ✅ | ✅ |
| 寒武纪 | MLU | ✅ | ✅ |
| 海光 | DCU | ✅ | ✅ |

> 💡 HAMi 是 2026 年云原生 GPU 共享的首选方案，支持多厂商异构集群，显存+算力双隔离。
