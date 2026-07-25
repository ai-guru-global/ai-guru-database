---
title: "DRA (Dynamic Resource Allocation) 深度解析:Kubernetes 设备分配的未来"
category: "12-architecture-infrastructure"
tags: ["dra", "dynamic-resource-allocation", "kubernetes", "gpu", "scheduling", "device-plugin", "cdi"]
summary: "> **一句话理解**: DRA 是 Kubernetes 1.32+ 的现代设备分配机制——用声明式 ResourceClaim 替代 Device Plugin 的整数计数模型，支持拓扑亲和、设备共享与丰富属性匹配，与 CDI 共同构成下一代 GPU/加速器接入栈。"
created: "2026-06-15"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Dra Deep Dive"
  - "DRA Deep Dive"
  - DRA_Deep_Dive
sources: []

---
# DRA (Dynamic Resource Allocation) 深度解析

> **一句话理解**: DRA 是 Kubernetes 1.32+ 的现代设备分配机制——用声明式 `ResourceClaim` 替代 Device Plugin 的整数计数模型，支持拓扑亲和、设备共享与丰富属性匹配，与 [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI]] 共同构成下一代 GPU/加速器接入栈。

> **成熟度**: 1.26 alpha → 1.32 beta（含结构化参数）| **KEP**: kubernetes/enhancements#3063

---

## 目录

1. [为什么需要 DRA:Device Plugin 的天花板](#1-为什么需要-dradevice-plugin-的天花板)
2. [核心抽象:四个 API 对象](#2-核心抽象四个-api-对象)
3. [工作原理:调度器与驱动的协调循环](#3-工作原理调度器与驱动的协调循环)
4. [结构化参数(1.32 beta 的关键跃迁)](#4-结构化参数132-beta-的关键跃迁)
5. [实战:用 DRA 申请 GPU 跑 vLLM](#5-实战用-dra-申请-gpu-跑-vllm)
6. [DRA + CDI:分配与注入的完整闭环](#6-dra--cdi分配与注入的完整闭环)
7. [迁移指南:从 Device Plugin 到 DRA](#7-迁移指南从-device-plugin-到-dra)
8. [生态现状与风险](#8-生态现状与风险)

---

## 1. 为什么需要 DRA:Device Plugin 的天花板

Device Plugin 自 K8s 1.8 起 GA，统治了六年，但它的模型非常朴素——**把设备当可数物品**：

```yaml
# Device Plugin 的世界:只能表达「要几张」
resources:
  limits:
    nvidia.com/gpu: 2   # 数字。没了。
```

这套模型在「一张卡 = 一个容器」的时代够用，但 2024 年后撑不住了：

| 场景 | Device Plugin 的尴尬 |
|------|---------------------|
| 要 70GB+ 显存的卡 | 无法表达属性，只能全集群手动打标签 |
| MIG 切片调度 | 实例被当成独立设备硬塞进 ExtendedResource，调度器不懂切片语义 |
| GPU + 网卡同 NUMA | 无法表达设备间拓扑关系 |
| 多 Pod 共享一卡 | 计数模型天生独占，共享要靠 [[12_架构基建/03_AI_Stack/HAMi_Deep_Dive|HAMi]] 等外部方案 |
| 厂商做复杂分配逻辑 | 必须绕过调度器，在 kubelet 外自建 gRPC，调度器看不到真实状态 |

> **根本矛盾**: 调度器对设备「一无所知」，只看到一个整数；真实的设备能力、拓扑、共享需求，调度器全看不见。

DRA 的解法：**把设备分配变成调度器可理解的一等公民**——驱动声明式描述资源，调度器基于属性与拓扑做决策。

---

## 2. 核心抽象:四个 API 对象

```
ResourceClass (集群级)        ──「我要 H100 这一类 GPU」
        │ 指向 DRA 驱动
        ▼
ResourceClaim (命名空间级)    ──「给我一份符合该类的具体资源」
        │ 可被 Pod 引用
        ▼
Pod.spec.resourceClaims[]     ──「这个 Pod 用这份 claim」
        │ 容器通过 resources.claims 引用
        ▼
PodSchedulingContext         ──「驱动 ↔ 调度器协调:先预留,再确认」
```

| 对象 | 作用域 | 作用 |
|------|--------|------|
| **ResourceClass** | 集群级 | 由管理员创建，定义一类设备 + 指向处理它的 DRA 驱动 |
| **ResourceClaim** | 命名空间级 | 申请一份资源；可被 Pod 持有，状态跟踪分配结果 |
| **ResourceClaimTemplate** | 命名空间级 | 让每个 Pod 实例化出自己的 ResourceClaim（StatefulSet 友好） |
| **PodSchedulingContext** | 内部对象 | 调度器与驱动的握手协议：`Pending` → 驱动预留 → 调度器再确认 |

**关键能力**: `selectors` 支持 CEL 表达式按设备属性筛选，这是 Device Plugin 完全做不到的。

---

## 3. 工作原理:调度器与驱动的协调循环

```
 Pod 创建 (带 ResourceClaim)
        │
        ▼
 ┌──────────────────┐
 │   调度器          │  ① 选节点:基于节点上可用 claim
 │  (kube-scheduler)│
 └────────┬─────────┘
          │ ② 临时绑定 Pod 到节点
          ▼
 ┌──────────────────┐
 │   DRA 驱动        │  ③ 驱动看到 PodSchedulingContext
 │  (DaemonSet)     │     决定:能否在这节点分配设备?
 └────────┬─────────┘
          │ ④ 返回:预留/拒绝 + 分配候选
          ▼
 ┌──────────────────┐
 │   调度器          │  ⑤ 二次决策:综合所有驱动意见
 └────────┬─────────┘
          │ ⑥ 最终绑定
          ▼
 ┌──────────────────┐
 │   DRA 驱动        │  ⑦ 分配设备 → 返回 CDI 设备 ID
 └────────┬─────────┘
          │ ⑧ CDI ID 下发给 containerd
          ▼
 ┌──────────────────┐
 │   容器运行时      │  ⑨ 按 CDI spec 注入设备 → 创建容器
 └──────────────────┘
```

**两阶段握手的意义**: 避免驱动在调度器还没定节点时就盲目分配设备，防止「分配了又被调度器否决」的反复抖动。

---

## 4. 结构化参数(1.32 beta 的关键跃迁)

DRA 早期（alpha）有个性能隐患：调度器做决策时**必须回调驱动**，每个 Pod 调度都要一次额外往返，集群一大就成瓶颈。

1.32 beta 引入 **结构化参数（Structured Parameters）**：驱动把设备清单与分配结果用**标准格式**写进 `ResourceClaim`，调度器**直接读**，无需回调驱动。这把 DRA 从「演示可用」推进到「生产可用」：

| 维度 | alpha(回调模型) | 1.32 beta(结构化参数) |
|------|----------------|----------------------|
| 调度延迟 | 每Pod一次驱动RPC | 调度器本地决策 |
| 集群规模上限 | 小集群 | 千节点级 |
| 驱动复杂度 | 必须实现调度hook | 只需发布设备清单 |

---

## 5. 实战:用 DRA 申请 GPU 跑 vLLM

```yaml
# 1. 管理员一次性定义:GPU 资源类
apiVersion: resource.k8s.io/v1beta1
kind: DeviceClass
metadata: { name: nvidia-gpu }
spec:
  nodeSelector: { node.kubernetes.io/instance-type: gpu-node }
---
# 2. 应用声明:要一张 >70GB 显存的卡
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaimTemplate
metadata: { name: big-gpu }
spec:
  spec:
    devices:
      requests:
      - name: req
        deviceClassName: nvidia-gpu
        selectors:
        - cel: "device.attributes['nvidia.com'].memory > 70000000000"
---
apiVersion: v1
kind: Pod
metadata: { name: vllm-dra }
spec:
  resourceClaims:
  - name: gpu
    resourceClaimTemplateName: big-gpu
  containers:
  - name: vllm
    image: vllm/vllm-openai:latest
    command: ["--model", "/models/Qwen2.5-72B"]
    resources:
      claims:
      - name: gpu
```

> 注意:无需 `nvidia.com/gpu: 1`，也无需 `NVIDIA_VISIBLE_DEVICES`——DRA 分配后自动经 CDI 注入。

---

## 6. DRA + CDI:分配与注入的完整闭环

二者是**互补的两层**，不是替代关系：

```
         ┌───────────── 分配层 ─────────────┐
         │  Device Plugin (旧,计数)         │
         │  DRA (新,属性/拓扑/共享) ◀──未来  │
         └──────────────┬──────────────────┘
                        │ 输出:CDI 设备 ID
                        │ (如 nvidia.com/gpu=0)
         ┌──────────────▼──────────────────┐
         │        注入层:CDI               │
         │  读 spec → 合并 containerEdits   │
         └──────────────┬──────────────────┘
                        │ 合并进 OCI config.json
                        ▼
                  runc / crun 创建容器
```

- **分配层**决定「这块卡给谁」——可选 Device Plugin 或 DRA
- **注入层**（CDI）是**两层共用的地基**——无论上层选谁，最终都翻译成 CDI 设备名

> 详见 [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI 深度解析]] 与 [[概念/dra|DRA 概念卡片]]。

---

## 7. 迁移指南:从 Device Plugin 到 DRA

| 阶段 | 做法 | 风险 |
|------|------|------|
| **过渡期(现在)** | Device Plugin + CDI(注入层先行) | 低 — CDI 已 GA，注入现代化 |
| **混合期** | DRA 驱动与 Device Plugin 共存(K8s 支持并存) | 中 — 注意资源不重复计算 |
| **目标态** | 全量 DRA + CDI | 等 DRA GA(预计 1.34)+ 驱动成熟 |

**务实建议**: 2026 年新集群优先开启 CDI(注入层);DRA(分配层)等驱动 beta 稳定后在非生产环境灰度。

---

## 8. 生态现状与风险

**已就绪**
- NVIDIA DRA Driver（`nvidia/k8s-dra-driver`，实验→渐稳）
- AMD、Intel DRA 驱动陆续跟进
- containerd 1.7+ / CRI-O 原生解析 CDI 设备 ID

**风险与局限**
- DRA 尚未 GA，API（v1beta1）仍可能调整
- 结构化参数要求驱动改写，部分厂商驱动滞后
- 国产加速器(昇腾/寒武纪)DRA 驱动仍在追赶，过渡期仍依赖 Device Plugin + CDI

---

## 相关阅读

- [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI 容器设备接口标准(配对概念)]]
- [[12_架构基建/03_AI_Stack/HAMi_Deep_Dive|HAMi 异构 GPU 虚拟化(Device Plugin 模式下的共享方案)]]
- [[概念/dra|DRA 概念卡片]]
- [[概念/cdi|CDI 概念卡片]]
- [[概念/hami|HAMi 概念卡片]]
- [[概念/gpu-operator|NVIDIA GPU Operator(部署 DRA 驱动的载体)]]
- [[概念/gpu-virtualization|GPU 虚拟化(MIG 切片调度)]]
- [[概念/heterogeneous-gpu|异构 GPU 集群]]
- [[12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026|AI Infrastructure 2026]]
