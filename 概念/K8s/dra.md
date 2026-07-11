---
title: DRA (Dynamic Resource Allocation)
category: -concepts
tags:
- dra
- dynamic-resource-allocation
- kubernetes
- gpu
- device-plugin
- scheduling
- cdi
relationships:
- target: '概念/cdi'
  type: pairs_with
- target: '概念/gpu-virtualization'
  type: supersedes_allocation
- target: '概念/heterogeneous-gpu'
  type: enables
- target: '概念/llm-infrastructure'
  type: enables
- target: '概念/model-deployment'
  type: enables
sources:
- 架构基建/Hardware_Compute/DRA_Deep_Dive.md
- 架构基建/Hardware_Compute/CDI_Deep_Dive.md
summary: DRA 是 Kubernetes 1.32+ beta 的现代设备分配机制——用 ResourceClass/ResourceClaim 让第三方驱动声明式申请 GPU/加速器，支持跨节点协调、NUMA 拓扑亲和与设备共享。它与 CDI 是一对：DRA 管「谁拿哪块卡」(分配)，CDI 管「卡怎么进容器」(注入)，共同取代传统的 Device Plugin 单体模型。
provenance:
  extracted: 0.6
  inferred: 0.3
  ambiguous: 0.1
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: core
created: 2026-06-15 00:00:00+00:00
updated: 2026-06-15 00:00:00+00:00
aliases:
  - Dra

---
# DRA (Dynamic Resource Allocation)

## 核心要点

- **DRA** 是 Kubernetes 设备分配的新一代机制（KEP-3063），解决传统 Device Plugin 的根本局限
- 成熟度：**1.26 alpha（2022）→ 1.32 beta（2024，含结构化参数）→ 预计 1.34 GA**
- 核心抽象：第三方 **DRA 驱动**（DaemonSet）通过自定义资源声明、协调、分配设备
- 与 [[概念/cdi|CDI]] 是**配对关系**：DRA 负责分配层决策，CDI 负责注入层落地；DRA 驱动返回 CDI 设备 ID，运行时据此注入
- 四大对象：`ResourceClass`（资源类）、`ResourceClaim`（资源申请）、`ResourceClaimTemplate`（Pod 级模板）、`PodSchedulingContext`（调度协调）

## 解决 Device Plugin 的什么痛点

| Device Plugin 局限 | DRA 突破 |
|--------------------|----------|
| 只能按整数计数分配（`nvidia.com/gpu: 2`） | 支持**丰富属性**匹配（显存大小、MIG 切片、厂商特性） |
| 设备只能被一个容器独占 | 支持**设备共享**（多容器共用一卡） |
| 无法表达跨设备亲和 | 支持 **NUMA/拓扑亲和**（GPU + NIC 在同一 NUMA 节点） |
| 单节点 gRPC，无跨节点协调 | 驱动可跨节点协调（如分布式训练的多卡绑定） |
| 分配逻辑与厂商驱动耦合在 kubelet 外 | 驱动以 controller 形式参与调度循环 |

## 关键 API 对象

| 对象 | 作用域 | 职责 |
|------|--------|------|
| **ResourceClass** | 集群级 | 定义一类设备资源（如 `nvidia.com/gpu-h100`），指向 DRA 驱动 |
| **ResourceClaim** | 命名空间级 | 申请一份具体资源（Pod 持有） |
| **ResourceClaimTemplate** | 命名空间级 | 为每个 Pod 实例化生成 ResourceClaim |
| **PodSchedulingContext** | — | 驱动与调度器协调：预留/确认设备 |

```yaml
# 现代姿势：Pod 通过 ResourceClaim 申请 GPU（DRA）
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaimTemplate
metadata: { name: gpu-claim }
spec:
  spec:
    devices:
      requests:
      - name: req
        deviceClassName: nvidia.com/gpu
        selectors:
        - cel: "device.attributes['nvidia.com'].memory > 70000000000"  # >70GB 显存
---
apiVersion: v1
kind: Pod
metadata: { name: vllm-dra }
spec:
  resourceClaims:
  - name: gpu
    resourceClaimTemplateName: gpu-claim
  containers:
  - name: vllm
    image: vllm/vllm-openai:latest
    resources:
      claims:
      - name: gpu   # 引用上面的 claim → DRA 分配 → CDI 注入
```

## 典型场景

- **拓扑感知推理**: 要求 GPU 与 RDMA 网卡在同一 NUMA 节点，降低跨 socket 延迟
- **MIG 精细切片**: 按显存/算力属性匹配 MIG 实例，而非粗粒度整卡
- **多厂商混部**: 不同 ResourceClass 对应 NVIDIA / 昇腾 / 寒武纪，驱动各自实现
- **设备共享**: 轻量推理多个 Pod 共用一张 GPU（配合时间分片）

## 与相关概念的关系

```
DRA (分配层 - 新)
├── 配对: CDI (注入层) —— DRA 决策 → 返回 CDI 设备 ID → 运行时注入
├── 取代: Device Plugin (分配层 - 旧，计数模型)
├── 赋能: 异构 GPU 集群 / 拓扑感知调度
├── 由 ... 驱动: NVIDIA DRA Driver / AMD / Intel 各自实现
└── 依赖: 容器运行时 (containerd 1.7+ / CRI-O) 解析 CDI
```

## 延伸阅读

- [[架构基建/Hardware_Compute/DRA_Deep_Dive|DRA 深度解析]]
- [[概念/cdi|CDI 容器设备接口（配对概念）]]
- [[架构基建/Hardware_Compute/CDI_Deep_Dive|CDI 深度解析]]
- [[概念/gpu-virtualization|GPU 虚拟化]]
- [[概念/heterogeneous-gpu|异构 GPU 集群]]
- [[概念/gpu-operator|NVIDIA GPU Operator]]
- [[概念/oci-runtime|OCI Runtime Spec]]
