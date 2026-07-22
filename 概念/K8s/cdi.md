---
title: CDI (Container Device Interface)
category: -concepts
tags:
- cdi
- container-device-interface
- kubernetes
- gpu
- containerd
- infrastructure
- device-plugin
relationships:
- target: '概念/llm-infrastructure'
  type: enables
- target: '概念/model-deployment'
  type: enables
- target: '概念/model-serving'
  type: related_to
- target: '概念/distributed-parallelism'
  type: related_to
sources:
- 架构基建/Hardware_Compute/CDI_Deep_Dive.md
- 架构基建/CDI_for_dummy.md
- 架构基建/Architecture_Overview/AI_Infrastructure_2026
summary: CDI 是容器运行时层的「设备通用语」——用一份标准 JSON 描述 GPU/FPGA/RDMA/国产加速器如何接入容器，让 NVIDIA、华为昇腾、寒武纪等异构硬件以同一套方式被 vLLM/TGI 等 AI 工作负载透明使用，是设备插件与 DRA 共同依赖的设备注入地基。
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-06-15 00:00:00+00:00
updated: 2026-07-21 00:00:00+00:00
aliases:
  - Cdi

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
- **国产/异构加速器统一接入**: 昇腾、寒武纪、壁仞、AMD、Intel 用同一套语言接入（见 [[数学基础/AI_Hardware/Chinese_AI_Chips_Deep_Dive]]）
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

- [[架构基建/Hardware_Compute/CDI_Deep_Dive|CDI 容器设备接口标准深度解析]]
- [[架构基建/CDI_for_dummy|CDI 小白版]]
- [[架构基建/Hardware_Compute/DRA_Deep_Dive|DRA 深度解析（配对概念）]]
- [[概念/dra|DRA 动态资源分配（分配层搭档）]]
- [[概念/gpu-operator|NVIDIA GPU Operator（生成 CDI spec 的运维层）]]
- [[概念/oci-runtime|OCI Runtime Spec（CDI 注入的最终落点）]]
- [[架构基建/Architecture_Overview/AI_Infrastructure_2026|AI Infrastructure 2026]]
- [[部署推理/Inference_Engines/vLLM_Deep_Dive|vLLM 深度解析]]
- [[部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive|TensorRT-LLM 深度解析]]
- [[数学基础/AI_Hardware/Chinese_AI_Chips_Deep_Dive|国产 AI 芯片深度解析]]
- [[概念/llm-infrastructure|LLM 基础设施]]
- [[概念/model-deployment|模型部署]]

---

## 2026 CDI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **CDI Spec v0.8** | 支持 Intel/AMD/华为昇腾/寒武纪多厂商统一描述 | GA |
| **containerd 2.x 原生 CDI** | 默认启用 CDI 解析，无需手动配置 enable_cdi | GA |
| **nvidia-ctk cdi generate** | GPU Operator v24+ 自动生成并注册 CDI Spec | GA |
| **DRA + CDI 联动** | K8s 1.32+ DRA 分配后返回 CDI 设备 ID，运行时透明注入 | Beta |
| **MIG CDI 切片** | H100/B200 MIG 实例独立 CDI device，精细隔离推理实例 | GA |

## 生产最佳实践

1. **统一使用 CDI 接入**：新集群优先采用 CDI 替代厂商私有环境变量，确保多厂商设备统一描述
2. **自动化 Spec 生成**：使用 GPU Operator 或 nvidia-ctk 自动生成 CDI Spec，避免手动维护
3. **版本锁定**：将 CDI Spec 纳入 GitOps 管理，变更走 PR 审核流程
4. **与 DRA 配合**：K8s 1.32+ 集群建议启用 DRA，实现属性级设备匹配 + CDI 注入
5. **多厂商验证**：异构集群中验证各厂商 CDI Spec 兼容性，确保 containerEdits 无 冲突

## CDI vs 传统设备注入

| 特性 | CDI | 环境变量 | Device Plugin |
|------|------|------|------|
| 标准化 | ✅ CNCF | ❌ 厂商私有 | 部分 |
| 多运行时 | ✅ | 部分 | ✅ |
| 设备描述 | 声明式 | 命令式 | 命令式 |
| 设备共享 | 支持 | 不支持 | 不支持 |
| 拓扑感知 | 支持 | 不支持 | 部分 |

## CDI Spec 结构

```yaml
# /etc/cdi/nvidia.yaml
cdiVersion: "0.6.0"
kind: nvidia.com/gpu
devices:
- name: gpu0
  containerEdits:
    env:
    - NVIDIA_VISIBLE_DEVICES=0
    deviceNodes:
    - /dev/nvidia0
    - /dev/nvidiactl
    - /dev/nvidia-uvm
    mounts:
    - hostPath: /usr/lib/x86_64-linux-gnu/libcuda.so
      containerPath: /usr/lib/x86_64-linux-gnu/libcuda.so
containerEdits:
  hooks:
  - hookName: createContainer
    path: /usr/bin/nvidia-cdi-hook
```

## CDI 支持的运行时

| 运行时 | 支持状态 | 说明 |
|------|------|------|
| containerd | ✅ GA | 默认推荐 |
| CRI-O | ✅ GA | OpenShift 默认 |
| Docker | ✅ GA | 开发环境 |
| Podman | ✅ GA | 无守护进程 |

## CDI 与 GPU Operator 集成

| 组件 | 作用 |
|------|------|
| nvidia-ctk | 生成 CDI Spec |
| gpu-operator | 自动管理 CDI |
| device-plugin | 设备发现 |
| containerd | CDI 注入 |

> 💡 CDI 是 2026 年容器设备注入的标准方案，替代厂商私有环境变量，实现跨运行时可移植。

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 设备不可见 | CDI Spec 未生成 | 运行 nvidia-ctk cdi generate |
| 权限错误 | 设备节点权限 | 检查 deviceNodes 配置 |
| 运行时不支持 | 版本太旧 | 升级 containerd/CRI-O |
