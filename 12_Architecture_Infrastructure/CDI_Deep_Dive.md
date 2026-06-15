---
title: "CDI (Container Device Interface): 容器设备接口标准深度解析"
category: "12-architecture-infrastructure"
tags: ["cdi", "container-device-interface", "kubernetes", "gpu", "containerd", "infrastructure", "device-plugin", "dra"]
summary: "> **一句话理解**: CDI 是容器运行时的「设备通用语」——用一份标准 JSON 描述 GPU/FPGA/RDMA/国产加速器如何接入容器，让 NVIDIA、华为昇腾、寒武纪等异构硬件都能以同一套方式被 vLLM/TGI 等 AI 工作负载透明使用。"
created: "2026-06-15"
updated: "2026-06-15"
---

# CDI (Container Device Interface): 容器设备接口标准深度解析

> **一句话理解**: CDI 是容器运行时的「设备通用语」——用一份标准 JSON 描述 GPU/FPGA/RDMA/国产加速器如何接入容器，让 NVIDIA、华为昇腾、寒武纪等异构硬件都能以同一套方式被 vLLM/TGI 等 AI 工作负载透明使用。

> **规范状态**: CNCF 容器运行时社区标准 | **采纳方**: containerd、CRI-O、NVIDIA GPU Operator、Kubernetes DRA

---

## 目录

1. [为什么需要 CDI：旧世界的痛](#1-为什么需要-cdi旧世界的痛)
2. [核心概念：Spec 文件、Kind、containerEdits](#2-核心概念spec-文件kindcontaineredits)
3. [工作原理：从声明到挂载](#3-工作原理从声明到挂载)
4. [生成 CDI Spec：NVIDIA 与异构厂商](#4-生成-cdi-specnvidia-与异构厂商)
5. [在 K8s 上为 LLM 推理使用 CDI](#5-在-k8s-上为-llm-推理使用-cdi)
6. [MIG 切片、RDMA 与多厂商混合](#6-mig-切片rdma-与多厂商混合)
7. [CDI vs 设备插件 vs DRA：选型矩阵](#7-cdi-vs-设备插件-vs-dra选型矩阵)
8. [在本知识库中的定位](#8-在本知识库中的定位)

---

## 1. 为什么需要 CDI：旧世界的痛

在 CDI 出现之前，把一块加速器交给容器，没有统一答案：

- **NVIDIA 的「环境变量黑魔法」**: 长期依赖 `NVIDIA_VISIBLE_DEVICES=0,1` 这类环境变量，由 `nvidia-container-runtime`（一个预加载 hook）拦截并注入 `/dev/nvidia*` 设备节点、挂载用户态库、设置 `LD_LIBRARY_PATH`。这是 **NVIDIA 专属** 的私有约定，只有 containerd/docker 通过打补丁的 runtime 才能识别。
- **裸设备节点挂载**: 一些厂商（FPGA、早期国产卡）只能让用户手写 `--device /dev/foo0:/dev/foo0`，容器内还要手动配驱动库，特权模式满天飞。
- **设备插件（Device Plugin）只解决一半问题**: Kubernetes Device Plugin 负责向 kubelet 上报设备并做分配决策，但它把设备「实际注入容器」的方式留给了各家厂商——于是每家都造了一套自己的注入逻辑，互不兼容。

> **核心矛盾**: 设备分配（K8s 决定把哪块卡给你）和设备注入（运行时把卡真正塞进容器）之间，缺一个**厂商无关、运行时无关**的中间表示。

CDI 正是为补上这一层而生：一份声明式 JSON，告诉容器运行时「要使用这个设备，需要改哪些东西」。

---

## 2. 核心概念：Spec 文件、Kind、containerEdits

### 2.1 Spec 文件结构

CDI Spec 是一个 JSON（也支持 YAML）文件，默认搜索路径为 `/etc/cdi/` 与 `/var/run/cdi/`：

```json
{
  "cdiVersion": "0.5.0",
  "kind": "nvidia.com/gpu",
  "containerEdits": {
    "env": ["NVIDIA_DRIVER_CAPABILITIES=compute,utility"]
  },
  "devices": [
    {
      "name": "0",
      "containerEdits": {
        "deviceNodes": [
          { "path": "/dev/nvidia0" },
          { "path": "/dev/nvidiactl" },
          { "path": "/dev/nvidia-uvm" }
        ],
        "hooks": [
          { "hookName": "createContainer", "path": "/usr/bin/nvidia-ctk", "args": ["nvidia-ctk", "hook", "ensure-runtime-deps"] }
        ],
        "mounts": [
          { "hostPath": "/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.545", "containerPath": "/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.545" }
        ]
      }
    }
  ]
}
```

### 2.2 三个关键字段

| 字段 | 含义 | 示例 |
|------|------|------|
| **`kind`** | `vendor/class` 形式的设备族标识，全局唯一 | `nvidia.com/gpu`、`huawei.com/ascend`、`cambricon.com/mlu` |
| **`devices[].name`** | 该 kind 下具体设备的逻辑名，用户按此申请 | `0`、`gpu0`、`mig-1g.10gb` |
| **`containerEdits`** | 注入容器所需的最小改动集：设备节点、环境变量、挂载、钩子 | 见上 |

**申请语法**: `vendor.com/class=name`，例如 `nvidia.com/gpu=0` 或 `huawei.com/ascend=0`。容器运行时收到这个名字后，去 spec 文件里查表，合并所有匹配 device 的 `containerEdits`，再创建容器。

### 2.3 可继承的 Edits

`kind` 级的 `containerEdits` 会被该 kind 下**所有设备**继承（如上例的 `NVIDIA_DRIVER_CAPABILITIES` 对每张 GPU 都生效），device 级的 edits 则只在使用该设备时叠加。这种「公共 + 私有」两层合并模型，避免了在每张卡上重复声明公共库挂载。

---

## 3. 工作原理：从声明到挂载

```
            ┌─────────────────────────────────────────────┐
            │              设备的提供方                     │
            │  (NVIDIA GPU Operator / 厂商 DRA Driver)     │
            └──────────────────┬──────────────────────────┘
                               │ 调用 nvidia-ctk cdi generate
                               ▼
            ┌─────────────────────────────────────────────┐
            │   CDI Spec JSON  (/etc/cdi/*.json)          │
            │   声明: 这台机器上有哪些设备、如何注入        │
            └──────────────────┬──────────────────────────┘
                               │ 引用设备名 nvidia.com/gpu=0
            ┌──────────────────▼──────────────────────────┐
            │  分配层 (kubelet / DRA / device-plugin)      │
            │  决策: 把 0 号卡分给 Pod A                   │
            └──────────────────┬──────────────────────────┘
                               │ 下发 CDI 设备 ID
            ┌──────────────────▼──────────────────────────┐
            │   高层运行时 (containerd / CRI-O)            │
            │   解析 CDI 名 → 读 spec → 收集 edits         │
            └──────────────────┬──────────────────────────┘
                               │ 合并进 OCI spec
            ┌──────────────────▼──────────────────────────┐
            │   低层运行时 (runc / crun)                   │
            │   按 OCI spec 创建容器: 挂设备/装钩子/挂库    │
            └─────────────────────────────────────────────┘
```

**与旧方式的本质区别**: 设备的「使用说明」从代码（各家 runtime hook）搬到了**数据**（标准 JSON）。运行时只认 CDI 协议，不再关心你是 NVIDIA 还是昇腾——只要厂商提供了 spec，就能用。

---

## 4. 生成 CDI Spec：NVIDIA 与异构厂商

### 4.1 NVIDIA（最成熟生态）

```bash
# 方式一: 手动生成（nvidia-container-toolkit 自带）
nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml

# 方式二: 推荐生产做法 —— 交给 NVIDIA GPU Operator
# Operator v23.9+ 默认开启 CDI，自动维护 /var/run/cdi/nvidia.yaml
# 在 values.yaml 中:
#   devicePlugin:
#     cdidiEnabled: true
```

生成的 spec 会自动覆盖：全卡、MIG 切片、NVLink、NCCL 所需的共享内存与钩子。

### 4.2 国产/异构加速器

这正是 CDI 对本知识库「国产 AI 芯片」生态的最大价值——**同一套接入语言**：

| 厂商 | kind 命名 | 生成方式 |
|------|-----------|----------|
| 华为昇腾 Ascend | `huawei.com/ascend` | MindX/Ascend Docker Runtime 输出 CDI spec |
| 寒武纪 Cambricon | `cambricon.com/mlu` | 寒武纪设备插件配套 cdi-generate |
| 壁仞 Biren | `biren.com/biu` | 厂商 operator 生成 |
| AMD Instinct | `amd.com/gpu` | `amdgpu` device plugin + CDI |
| Intel GPU/FPGA | `intel.com/gpu`、`intel.com/fpga` | Intel Device Plugins Operator |

> **工程意义**: 一套 K8s 集群里混插昇腾 + NVIDIA，推理引擎只要声明「我要一块 `huawei.com/ascend=0`」或 `nvidia.com/gpu=1`，运行时行为完全一致，无需为每家写特判逻辑。详见 [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive]]。

---

## 5. 在 K8s 上为 LLM 推理使用 CDI

以容器运行时直接运行 vLLM 推理为例（containerd 1.7+ 原生支持 CDI）：

```bash
# nerdctl 通过 CDI 名请求 GPU，无需 NVIDIA 私有 runtime
nerdctl run --rm \
  --device nvidia.com/gpu=0 \
  -p 8000:8000 \
  -v /models:/models \
  vllm/vllm-openai:latest \
  --model /models/Qwen2.5-7B \
  --port 8000
```

在 Kubernetes 中，Pod 通过设备插件声明 GPU，kubelet（1.27+）会把 CDI 设备 ID 经由 `CDIDeviceIDs` 字段透传给 containerd，containerd 再走 CDI 解析：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: vllm-serving
spec:
  containers:
  - name: vllm
    image: vllm/vllm-openai:latest
    resources:
      limits:
        nvidia.com/gpu: 1   # 设备插件分配 → 自动转为 CDI 注入
    # 无需再手写 NVIDIA_VISIBLE_DEVICES
```

> **现代姿势（DRA）**: Kubernetes 1.32+ 的 DRA（Dynamic Resource Allocation）让 Pod 直接申请 `ResourceClaim`，DRA 驱动返回 CDI 设备引用，绕开传统设备插件的计数限制，支持拓扑感知（NUMA/NVLink 亲和）与细粒度 MIG 切片。CDI 仍是 DRA 下唯一的设备注入语言。

---

## 6. MIG 切片、RDMA 与多厂商混合

CDI 的声明式模型尤其擅长三种场景：

- **MIG（Multi-Instance GPU）**: 一块 H100 切成 7 份，每份是一个独立 CDI device（如 `nvidia.com/mig-1g.10gb=0`），不同 Pod 拿到隔离的推理实例，互不影响。
- **GPUDirect RDMA / SR-IOV**: 训练大模型需要 GPU 直连网卡旁路 CPU。CDI spec 里同时声明 `/dev/infiniband/*` 与对应 GPU，运行时一并注入，无需特权模式。
- **异构混部**: 一个 Pod 同时申请 `nvidia.com/gpu=1`（做计算）+ `mellanox.com/nic=0`（做高速通信），CDI 把两家的 edits 合并进同一容器。

---

## 7. CDI vs 设备插件 vs DRA：选型矩阵

三者**不是互斥**，而是分层协作。CDI 是最底层的「注入语言」，上层分配机制可选：

| 维度 | 设备插件 (Device Plugin) | CDI | DRA (Dynamic Resource Allocation) |
|------|--------------------------|-----|-----------------------------------|
| **解决的问题** | 上报+分配设备计数 | 描述+注入设备到容器 | 拓扑感知的动态分配 |
| **K8s 版本** | 1.8+（GA） | 运行时层，与 K8s 版本无关 | 1.26 alpha / 1.32+ beta |
| **厂商耦合** | 每家写一套 | 厂商无关标准 | 厂商写 DRA 驱动 |
| **GPU 细粒度** | 仅整卡/MIG 粗粒度 | 声明任意切片 | 支持拓扑/亲和 |
| **2026 推荐** | 旧集群过渡 | **必装基座** | 新集群首选 |

> **一句话**: CDI 不是用来替代设备插件或 DRA 的，而是**两者脚下共享的地基**。无论上层用哪种分配方式，最终都翻译成 CDI 设备名交给运行时。

---

## 8. 在本知识库中的定位

CDI 是连接「硬件层」与「推理服务层」的隐形纽带：

- 向上支撑 [[09_Deployment_Inference/vLLM_Deep_Dive]]、[[09_Deployment_Inference/TensorRT_LLM_Deep_Dive]]、[[09_Deployment_Inference/TGI_Deep_Dive]] 等 GPU 推理引擎的容器化部署
- 横向配合 [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive]] 中国产加速器的统一接入
- 与 [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] 的 GPU 集群管理、[[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] 一体机的设备治理同属基础设施层

---

## 相关阅读

- [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] — GPU 集群与训练/推理基础设施
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — 软硬一体推理平台设备治理
- [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive]] — 国产异构加速器（CDI 的核心受益者）
- [[09_Deployment_Inference/vLLM_Deep_Dive]] — GPU 推理引擎的容器化落地
- [[09_Deployment_Inference/Deployment_Inference_2026]] — 部署推理 2026 趋势
- [[synthesis/serving-deployment]] — 推理服务与部署综合
