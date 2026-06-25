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
9. [训练与推理中的位置（大白话定位）](#9-训练与推理中的位置大白话定位)
10. [常见问题与排错](#10-常见问题与排错)
11. [官方资源](#官方资源)

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

> 🔗 MIG 的完整原理（GI/CI/CE/CU、A100/H100 profile、ppu-smi/nvidia-smi 操作、K8s GPU Operator 策略）见专题 [[12_Architecture_Infrastructure/MIG_Deep_Dive]]；本节聚焦 MIG 切片如何通过 CDI 透传进容器。

CDI 的声明式模型尤其擅长三种场景：

- **MIG（Multi-Instance GPU）**: 一块 H100 切成 7 份，每份是一个独立 CDI device（如 `nvidia.com/mig-1g.10gb=0`），不同 Pod 拿到隔离的推理实例，互不影响。
- **GPUDirect RDMA / SR-IOV**: 训练大模型需要 GPU 直连网卡旁路 CPU。CDI spec 里同时声明 `/dev/infiniband/*` 与对应 GPU，运行时一并注入，无需特权模式。
- **异构混部**: 一个 Pod 同时申请 `nvidia.com/gpu=1`（做计算）+ `mellanox.com/nic=0`（做高速通信），CDI 把两家的 edits 合并进同一容器。

---

## 7. CDI vs 设备插件 vs DRA：选型矩阵

三者**不是互斥**，而是分层协作。CDI 是最底层的「注入语言」，上层分配机制可选：

| 维度 | 设备插件 (Device Plugin) | CDI | DRA (Dynamic Resource Allocation) | HAMi |
|------|--------------------------|-----|-----------------------------------|------|
| **解决的问题** | 上报+分配设备计数 | 描述+注入设备到容器 | 拓扑感知的动态分配 | 异构设备共享与隔离 |
| **K8s 版本** | 1.8+（GA） | 运行时层，与 K8s 版本无关 | 1.26 alpha / 1.32+ beta | 1.22+（DRA 模式需 1.34+） |
| **厂商耦合** | 每家写一套 | 厂商无关标准 | 厂商写 DRA 驱动 | 多厂商统一适配 |
| **GPU 细粒度** | 仅整卡/MIG 粗粒度 | 声明任意切片 | 支持拓扑/亲和 | 任意比例 vGPU 切分 |
| **隔离级别** | 无（整卡独占） | 注入层，不保证隔离 | 分配层，依赖驱动 | 显存/算力硬隔离 |
| **2026 推荐** | 旧集群过渡 | **必装基座** | 新集群首选 | 多租户/异构共享场景 |

> **一句话**: CDI 不是用来替代设备插件、DRA 或 HAMi 的，而是**它们脚下共享的地基**。HAMi 可以在 Device Plugin 模式或 DRA 模式下运行，并把 vGPU 通过 CDI 注入容器。详见 [[12_Architecture_Infrastructure/HAMi_Deep_Dive]]。

---

## 8. 在本知识库中的定位

CDI 是连接「硬件层」与「推理服务层」的隐形纽带：

- 向上支撑 [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive]]、[[10_Deployment_Inference/Inference_Engines/TensorRT_LLM_Deep_Dive]]、[[10_Deployment_Inference/Inference_Engines/TGI_Deep_Dive]] 等 GPU 推理引擎的容器化部署
- 横向配合 [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive]] 中国产加速器的统一接入
- 与 [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] 的 GPU 集群管理、[[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] 一体机的设备治理同属基础设施层

---

## 9. 训练与推理中的位置（大白话定位）

> 这一节用大白话讲 CDI 到底在 AI 训练/推理里扮演什么角色，不涉及 spec 细节。

### 一句话定位

**CDI 不是训练或推理本身的技术，它是「水电工」**——不帮你炼模型，也不帮你跑推理，只管一件事：**把 GPU 这台大机器，按标准方式接进容器这个车间，让它通上电能转起来。**

### 用车间打比方

| 现实 | 容器世界 |
|------|----------|
| 大功率机床 | GPU / 加速器 |
| 独立车间 | 容器 |
| 车间管理员（决定哪台机床进哪个车间） | K8s / 调度器 |
| **标准电源插座 + 接线说明书** | **CDI** ⬅ 它就这一层 |

以前每个机床厂商自带一套私房接线法（NVIDIA 一种、昇腾一种），管理员要会 N 套。CDI 规定：所有机床填同一张「接线需求单」（要几个插座、要不要接地线、先跑哪个自检脚本），管理员照单接电即可，不管你是谁家的。

### 在训练里

训练 = **几百张 GPU 抱团干活**。

```
[训练任务 Megatron/DeepSpeed] ──住进容器──▶ ┌─────────────┐
                                            │  训练容器     │ ◀── CDI 接线:
                                            │             │     ① 8 张 GPU
                                            │             │     ② RDMA 高速网卡
                                            │             │     ③ NCCL 共享内存 + 钩子
                                            └─────────────┘
                                                  ▼
                                          底层 GPU + 网络真实硬件
```

- **没有 CDI**: 每家卡厂 + 网卡厂各搞一套注入，跨厂商混插（NVIDIA 卡 + 国产网卡）基本要特权模式硬怼。
- **有了 CDI**: `nvidia.com/gpu` 与网卡厂商的 `xxx.com/nic` 各填各的单，运行时合并，一个容器同时插好 GPU + 网卡，训练就能用 GPUDirect RDMA 跑满速。

### 在推理里

推理 = **一张卡切成几份，服务很多用户**。

```
[用户请求] → [vLLM / TGI 推理引擎] ──住进容器──▶ ┌──────────────┐
                                                │  推理容器      │ ◀── CDI 接线:
                                                │              │     ① 1 张 GPU（或 1 个 MIG 切片）
                                                │              │     ② 驱动库 libcuda
                                                └──────────────┘
```

典型场景：一张 H100 用 MIG 切 7 份，7 个推理 Pod 各拿一份。CDI 的活是把每个切片**正确、隔离地**塞进对应容器——切片 A 的容器看不到切片 B，靠的就是 CDI 那张单只声明了该切片的设备节点。

### 训练 vs 推理，CDI 的活有区别吗？

**没有**。CDI 永远干同一件事：读需求单 → 把设备/库/钩子接进容器。区别只在**单子写了多少东西**：

|  | 训练 | 推理 |
|---|---|---|
| 接进来的东西 | 多卡 + 网卡 + NCCL 钩子 | 单卡 / MIG 切片 |
| 单子复杂度 | 厚（一堆设备节点 + 网卡 + 共享内存） | 薄（一张卡） |
| **CDI 的角色** | **完全一样：标准接线员** | **完全一样** |

### 全栈定位图

```
应用层:    训练框架 / 推理引擎（vLLM, TGI）
              │
调度层:    K8s ── 决定「哪块卡给谁」（设备插件 / DRA）
              │
━━━━━━━━━━━━━│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
注入层:    CDI ◀── 「卡怎么进容器」的标准   ← 这就是 CDI
━━━━━━━━━━━━━│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              │
运行时:    containerd → runc 创建容器
              │
硬件层:    GPU / 昇腾 / 寒武纪 / 网卡
```

> **一句话**: CDI 是训练和推理**都要经过的同一个收费站**——不管车里装的是训练还是推理任务，到这儿都是「按单接线、放设备进容器」。它不分训练/推理，只认那张标准需求单。

---

## 10. 常见问题与排错

CDI 把设备注入从「代码」变成「数据」，带来了标准化红利，但也引入一类新的故障模式——**绝大多数问题本质是「spec 不对、找不到、不同步、不兼容」**。下面按场景归档。

### 10.0 先纠正一个根本性误解

> **Q: containerd 开了 `enable_cdi=true`，容器就能看到 GPU 吗？**
> **A: 不能。** 那只是打开了「CDI 设备名解析器」。GPU 进容器要四件事凑齐，CDI 仅占其一：

```
① 宿主装好驱动 + nvidia-container-toolkit   ← 真正的 GPU 在这
② 有人生成 /var/run/cdi/nvidia.yaml         ← 描述怎么接线(nvidia-ctk / GPU Operator)
③ containerd 开 enable_cdi=true 并重启       ← 打开解析器(常被误当成"开关")
④ 容器启动时显式申请 --device nvidia.com/gpu=0  ← 不申请拿不到
   ─→ 容器内 nvidia-smi 才看得到
```

- **「开了 enable_cdi 就全有了」** ✗ → 只装了翻译官，还差 spec(②)+ 容器主动要(④)。最常翻车：spec 没生成，或容器没写 `--device`。
- **「CDI 让容器能用 GPU」** ✗ → 没 CDI 也能用（老路 `NVIDIA_VISIBLE_DEVICES` + nvidia-container-runtime 一直在）。CDI 只是把描述方式从厂商私有 hook 换成通用 JSON，**能力本身来自驱动与 toolkit**。
- **「所有容器自动看到」** ✗ → CDI **按需注入**，容器不声明设备名，一个节点都不给。

> 一句话：CDI 是「接线说明书 + 解析器」，不是「电源开关」。

### 10.1 配置与发现类

| 症状 | 根因 | 排查/修 |
|------|------|---------|
| `--device nvidia.com/gpu=0` 报 unknown device | runtime 没在 spec 目录找到该设备 | 确认 spec 在 `/etc/cdi` 或 `/var/run/cdi`；`cdi devices` 看运行时看到啥 |
| containerd 完全不认 CDI | `enable_cdi` 没开 | `config.toml` 设 `enable_cdi=true` + `cdi_spec_dirs`，**必须重启 containerd** |
| Docker `--device vendor.com/...` 静默无效 | Docker 25.0–28.1 没开 feature flag | `daemon.json` 加 `{"features":{"cdi":true}}` 重启 dockerd；或升级到 28.2+(默认开) |

> 最常见翻车点:**改了 containerd 配置忘重启**。CDI 配置只在 runtime 启动时加载一次。

### 10.2 生成与同步类

CDI spec 是**某时刻的快照**，硬件变了 spec 没跟着变，就会引用不存在的设备。

- **换了卡 / 重插了 GPU**：spec 里的 major/minor 或设备节点路径过期 → 容器拿到错设备或直接失败。**修**：重新 `nvidia-ctk cdi generate` 或让 GPU Operator 重生。
- **MIG 动态重配后**：切片布局变了，但 `/var/run/cdi/nvidia.yaml` 还是旧的 → Pod 拿到已不存在的切片，或 A/B 切片串扰。**修**：靠 mig-manager 在重配后触发 spec 重生；手动场景务必重生再调度。
- **驱动升级后**：库路径/版本变了，spec 里挂载的 `libcuda.so` 路径失效 → 容器里 GPU 报 "driver library not found"。**修**：重生 spec。

### 10.3 版本兼容类

| 冲突 | 表现 | 对策 |
|------|------|------|
| spec `cdiVersion` 太新(如 0.6.0)而 runtime 老 | 新字段(`hooks`/`additionalGids`/annotations)被忽略或报 schema 错 | 对齐版本:runtime 升级 或 spec 降到 runtime 支持的版本 |
| containerd < 1.7 | CDI 支持不完整 | 升到 1.7+ |
| K8s < 1.27 走不通「设备插件→CDI」桥 | kubelet 没有 `CDIDeviceIDs` 字段透传，退回老注入 | K8s 升 1.27+；DRA 需 1.32+ beta |

### 10.4 注入冲突类

- **CDI 与 `NVIDIA_VISIBLE_DEVICES` 双开**:迁移期最常见。两条注入路径同时改容器，可能设备被重复挂载或环境变量打架。**对策**:选一条——推荐留 CDI、关掉老 env 注入(GPU Operator 里把 toolkit 的 legacy 模式关掉)。
- **多厂商 kind 命名撞车**:极少见，但两家若都声明同 `vendor.com/class`，spec 合并行为未定义。**对策**:命名规范审查，厂商前缀必须唯一。

### 10.5 排查类(报错隐晦的重灾区)

- **hooks 失败**:`createContainer`/`startContainer` hook 报错时，容器报 `OCI runtime create failed: ...`，**不直接说哪个 hook 挂了**。**对策**:看 runtime debug 日志(containerd `--log-level=debug`、`journalctl -u containerd`)，定位到具体 hook 路径与退出码。
- **设备看得到用不了**:spec 里设备节点权限/major-minor/uid-gid 配错，容器里 `ls /dev/nvidia0` 有，但 CUDA 调用 EACCES。**对策**:核对 spec 的 `permissions`/`uid`/`gid` 与宿主实际一致。
- **挂载库路径不存在**:spec `mounts.hostPath` 指向的宿主文件没装(如精简 OS 没装 CUDA 用户态库)。**对策**:宿主补库 或 改用驱动容器化(GPU Operator)。
- **不知道注入了啥**:用 `cdi inject`(仓库 CLI)对一份 OCI config 预演，看合并结果;或 `crictl inspect <id>` 看容器实际拿到的设备。

### 10.6 安全类

- **隔离失效**:spec 错把整卡(`/dev/nvidia0` + 全部 SM)暴露给本该只拿一个 MIG 切片的容器 → 多租户串扰。**对策**:spec 审计;MIG 场景只声明切片对应设备节点,不声明整卡控制节点。
- **过度挂载**:把宿主 `/usr/lib` 整个挂进容器追求省事 → 攻击面放大。**对策**:只挂具体 `.so` 文件,不挂目录。
- **国产/异构工具链不成熟**:昇腾/寒武纪的 CDI 生成工具文档少,常需**手写 JSON**,字段易错(device node 类型 c/b、minor 号)。**对策**:用 `cdi validate` 对照 schema 校验;优先找厂商是否提供 operator 自动生成。

### 10.7 一条排错决策树

```
容器拿不到 GPU
   │
   ├── runtime 认 CDI 吗? ── 否 ──▶ 查 enable_cdi / Docker feature flag / 版本
   │              │
   │             是
   │              ▼
   ├── spec 文件在默认目录吗? ── 否 ──▶ 放到 /etc/cdi 或 /var/run/cdi;查 cdi_spec_dirs
   │              │
   │             是
   │              ▼
   ├── spec 是最新的吗?(换卡/重配MIG/升级驱动后) ── 否 ──▶ 重生 spec
   │              │
   │             是
   │              ▼
   ├── 设备名拼写对吗?(vendor.com/class=name) ── 否 ──▶ 改名
   │              │
   │             是
   │              ▼
   └─▶ runtime debug 日志看 hooks/权限/挂载 ──▶ 定位到具体 containerEdits
```

> 详见 [[_references/cdi-spec|CDI 规范官方源]] 的 CLI 与 schema 校验段。

---

## 官方资源

> 详细引用索引见 [[_references/cdi-spec|CDI 规范官方源引用]]。

- **规范仓库**: [github.com/cncf-tags/container-device-interface](https://github.com/cncf-tags/container-device-interface)
- **开源协议**: Apache-2.0（完全开源）
- **治理**: CNCF Tags（与 CNI 同一模式，CDI 模型即基于 CNI）
- **规范文件**: 仓库内 `SPEC.md`；Go 参考库 `pkg/cdi`
- **运行时支持**: containerd（`enable_cdi=true`）、CRI-O（默认开启）、Docker（25.0+，28.2 起默认）、Podman（4.1+）
- **CLI 工具**: `cdi`（仓库自带，可 list/validate/inject/monitor CDI spec）；NVIDIA 侧另有 `nvidia-ctk cdi generate`

---

## 相关阅读

- [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] — GPU 集群与训练/推理基础设施
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — 软硬一体推理平台设备治理
- [[12_Architecture_Infrastructure/HAMi_Deep_Dive]] — HAMi 异构 GPU 虚拟化（与 CDI 配合的共享方案）
- [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive]] — 国产异构加速器（CDI 的核心受益者）
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive]] — GPU 推理引擎的容器化落地
- [[10_Deployment_Inference/Deployment_Inference_2026]] — 部署推理 2026 趋势
- [[_synthesis/serving-deployment]] — 推理服务与部署综合
