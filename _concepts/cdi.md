---
title: CDI (Container Device Interface)
category: concepts
tags:
- cdi
- container-device-interface
- kubernetes
- gpu
- containerd
- infrastructure
- device-plugin
relationships:
- target: '_concepts/llm-infrastructure'
  type: enables
- target: '_concepts/model-deployment'
  type: enables
- target: '_concepts/model-serving'
  type: related_to
- target: '_concepts/distributed-parallelism'
  type: related_to
sources:
- 12_Architecture_Infrastructure/CDI_Deep_Dive.md
- 12_Architecture_Infrastructure/CDI_for_dummy.md
- 12_Architecture_Infrastructure/AI_Infrastructure_2026.md
summary: CDI 是容器运行时层的「设备通用语」——用一份标准 JSON 描述 GPU/FPGA/RDMA/国产加速器如何接入容器，让 NVIDIA、华为昇腾、寒武纪等异构硬件以同一套方式被 vLLM/TGI 等 AI 工作负载透明使用，是设备插件与 DRA 共同依赖的设备注入地基。
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15 00:00:00+00:00
updated: 2026-06-15 00:00:00+00:00
---

# CDI (Container Device Interface)

## 核心要点

- **CDI** 是容器运行时（containerd / CRI-O）层的**厂商无关、运行时无关**设备接入标准，由 CNCF 容器运行时社区维护
- 用一份**声明式 JSON Spec**（位于 `/etc/cdi/`、`/var/run/cdi/`）描述「使用某设备需要对容器做哪些改动」
- 解决的核心矛盾：设备**分配**（K8s 决定给哪块卡）与设备**注入**（运行时把卡塞进容器）之间缺少统一中间表示
- 三个关键字段：`kind`（设备族 `vendor/class`）、`devices[].name`（逻辑名）、`containerEdits`（注入改动集：设备节点/环境变量/挂载/钩子）
- 申请语法：`vendor.com/class=name`，如 `nvidia.com/gpu=0`、`huawei.com/ascend=0`
- 是 **设备插件（旧）与 DRA 动态资源分配（新，K8s 1.32+ beta）共同依赖的设备注入地基**

## 解决的旧世界痛点

| 旧方案 | 问题 |
|--------|------|
| NVIDIA `NVIDIA_VISIBLE_DEVICES` 环境变量 | 厂商私有，需打补丁的 runtime 才认 |
| 裸 `--device /dev/foo0` 挂载 | 容器内无驱动库，常需特权模式 |
| 设备插件 | 只管分配，把注入逻辑留给各家自造，互不兼容 |

## 关键组件

| 组件 | 说明 |
|------|------|
| **CDI Spec JSON** | 声明设备族及其注入改动集，可继承（kind 级 edits 被所有 device 继承） |
| **vendor/class (kind)** | 全局唯一设备族标识，如 `nvidia.com/gpu`、`cambricon.com/mlu` |
| **containerEdits** | 注入容器的最小改动：deviceNodes / env / mounts / hooks |
| **生成工具** | `nvidia-ctk cdi generate`；NVIDIA GPU Operator v23.9+ 自动生成 |

## 典型场景

- **LLM 推理容器化**: vLLM / TGI / TensorRT-LLM 在 K8s 上获取 GPU，无需 `NVIDIA_VISIBLE_DEVICES`
- **国产/异构加速器统一接入**: 昇腾、寒武纪、壁仞、AMD、Intel 用同一套语言接入（见 [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive]]）
- **MIG 切片**: H100 切 7 份，每份独立 CDI device，隔离推理实例
- **GPUDirect RDMA / 训练**: GPU 直连网卡旁路 CPU，spec 同时声明网卡与 GPU
- **异构混部**: 一个 Pod 同时申请 GPU + 智能网卡，CDI 合并两家 edits

## 常见误解（CDI 是什么 / 不是什么）

> **核心心智模型**: CDI 是「接线说明书 + 解析器」，**不是「电源开关」**。

**问: containerd 开了 `enable_cdi=true`，容器就能看到 GPU 吗？**
**答: 不能。** 那只是打开了「CDI 设备名解析器」。GPU 进容器是四件事凑齐，CDI 仅占其一：

```
① 宿主装好驱动 + nvidia-container-toolkit   ← 真正的 GPU 在这
② 有人生成 /var/run/cdi/nvidia.yaml         ← 描述怎么接线(nvidia-ctk / GPU Operator)
③ containerd 开 enable_cdi=true 并重启       ← 打开解析器
④ 容器启动时显式申请 --device nvidia.com/gpu=0  ← 不申请拿不到
```

三个高频误解：

| 误解 | 真相 |
|------|------|
| 「开了 `enable_cdi` 就全有了」 | 只装了「翻译官」，还需 spec 存在 + 容器主动申请 |
| 「CDI 让容器能用 GPU」 | 没 CDI 也能用（老路 `NVIDIA_VISIBLE_DEVICES` + nvidia-container-runtime 一直在）。CDI 只是换了**更标准的描述方式**，能力来自驱动与 toolkit |
| 「所有容器自动看到 GPU」 | CDI **按需注入**：容器不声明设备名，就一个节点都不给 |

## 与相关概念的关系

```
CDI (设备注入地基)
├── 支撑: 设备插件 (Device Plugin) —— 分配层，老路径
├── 支撑: DRA (Dynamic Resource Allocation) —— 分配层，新路径(K8s 1.32+)
├── 服务于: 模型部署 / 推理服务 (vLLM/TGI/TensorRT-LLM 容器化)
├── 赋能: 异构 GPU 集群 / 国产化替换
└── 对比: NVIDIA 私有 env 注入 (被 CDI 取代的旧方案)
```

## 延伸阅读

- [[12_Architecture_Infrastructure/CDI_Deep_Dive|CDI 容器设备接口标准深度解析]]
- [[12_Architecture_Infrastructure/CDI_for_dummy|CDI 小白版]]
- [[12_Architecture_Infrastructure/DRA_Deep_Dive|DRA 深度解析（配对概念）]]
- [[_concepts/dra|DRA 动态资源分配（分配层搭档）]]
- [[_concepts/gpu-operator|NVIDIA GPU Operator（生成 CDI spec 的运维层）]]
- [[_concepts/oci-runtime|OCI Runtime Spec（CDI 注入的最终落点）]]
- [[12_Architecture_Infrastructure/AI_Infrastructure_2026|AI Infrastructure 2026]]
- [[10_Deployment_Inference/vLLM_Deep_Dive|vLLM 深度解析]]
- [[10_Deployment_Inference/TensorRT_LLM_Deep_Dive|TensorRT-LLM 深度解析]]
- [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive|国产 AI 芯片深度解析]]
- [[_concepts/llm-infrastructure|LLM 基础设施]]
- [[_concepts/model-deployment|模型部署]]
