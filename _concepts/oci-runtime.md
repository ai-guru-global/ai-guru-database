---
title: OCI Runtime Spec (开放容器倡议运行时规范)
category: -concepts
tags:
- oci
- container-runtime
- runc
- containerd
- infrastructure
- standards
relationships:
- target: '_concepts/cdi'
  type: consumed_by
- target: '_concepts/llm-infrastructure'
  type: foundation_of
- target: '_concepts/model-deployment'
  type: enables
sources:
- 12_Architecture_Infrastructure/Hardware_Compute/CDI_Deep_Dive.md
- 12_Architecture_Infrastructure/CDI_for_dummy.md
summary: OCI Runtime Spec 是开放容器倡议制定的「容器在运行时到底是什么」的标准——用一份 config.json 描述容器的根文件系统、进程、mounts、linux.devices 与 hooks。它是 runc/crun 等低层运行时的实现依据，也是 CDI 注入设备时的最终落点:CDI 的 containerEdits 被高层运行时合并进这份 config.json，再由 runc 据此创建容器。
provenance:
  extracted: 0.5
  inferred: 0.4
  ambiguous: 0.1
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15 00:00:00+00:00
updated: 2026-06-15 00:00:00+00:00
aliases:
  - "Oci Runtime"
  - "oci runtime"

---
# OCI Runtime Spec (开放容器倡议运行时规范)

## 核心要点

- **OCI (Open Container Initiative)** 是 2015 年由 Docker/CoreOS 等成立的 Linux 基金会项目，终结了「容器格式之战」
- 三大规范：**Image Spec**(镜像格式)、**Runtime Spec**(运行时行为，本文焦点)、**Distribution Spec**(镜像分发)
- Runtime Spec 定义「容器实例是什么」——一份 **`config.json`** 描述运行态的全部细节
- **runc** 是参考实现，**crun / runsc / kata** 等均符合此规范
- 与 [[_concepts/cdi|CDI]] 的关系：CDI **不是** OCI 规范的一部分，而是高层运行时(containerd)在调用 runc 前**预处理 config.json** 的中间层——CDI 的 containerEdits 被合并进 config.json 的 `mounts` / `linux.devices` / `hooks`

## config.json 的关键字段

| 字段 | 含义 | CDI 注入点 |
|------|------|-----------|
| `root` | 根文件系统路径 | — |
| `process` | 要执行的进程(args/env/cwd/capabilities) | CDI `env` 合并到 `process.env` |
| **`mounts`** | 挂载列表 | ✅ CDI `mounts`(如 libcuda.so) |
| **`linux.devices`** | 设备节点列表 | ✅ CDI `deviceNodes`(如 /dev/nvidia0) |
| **`hooks`** | 生命周期钩子 | ✅ CDI `hooks`(createContainer 等) |
| `linux.namespaces` | 命名空间(pid/net/uts...) | — |
| `linux.resources` | cgroup 资源限制 | — |

## 容器运行时分层

```
高层运行时 (High-level Runtime)
  containerd / CRI-O / dockerd
     │  解析镜像、管理卷、网络
     │  ★ 在这里:读取 CDI spec,合并 containerEdits
     ▼
  生成 OCI config.json (bundle)
     │
     ▼
低层运行时 (Low-level Runtime) —— 符合 OCI Runtime Spec
  runc / crun / kata-runtime / runsc
     │  按 config.json 创建命名空间/cgroup/挂载/设备
     ▼
  容器进程运行
```

**关键洞察**: CDI 的作用域在「高层→低层」的衔接处——它告诉 containerd「在生成 config.json 时额外加这些设备/挂载/钩子」，runc 本身对 CDI 一无所知。

## 典型场景(与 AI 的交集)

- **GPU 容器化**: CDI 把 `/dev/nvidia0` 与驱动库写进 config.json，runc 据此把 GPU 暴露给容器（vLLM/TGI 推理）
- **安全隔离**: kata-runtime 作为 OCI 运行时，把容器变成轻量 VM，用于多租户 AI 推理的强隔离
- **沙箱**: runsc(gVisor)拦截系统调用，用于运行不信任的模型推理代码

## 与相关概念的关系

```
OCI Runtime Spec (容器运行时标准)
├── 被消费: CDI 把 containerEdits 合并进 config.json
├── 实现: runc(参考) / crun / kata / runsc
├── 承载: 高层运行时 (containerd/CRI-O) 调用低层运行时
├── 赋能: GPU/异构设备的容器化(AI 推理底座)
└── 上游: OCI Image Spec(镜像) → Runtime Spec(运行)
```

## 延伸阅读

- [[_concepts/cdi|CDI（注入 config.json 的预处理层）]]
- [[_concepts/dra|DRA（分配层）]]
- [[_concepts/gpu-operator|NVIDIA GPU Operator]]
- [[12_Architecture_Infrastructure/Hardware_Compute/CDI_Deep_Dive|CDI 深度解析]]
- [[12_Architecture_Infrastructure/Hardware_Compute/DRA_Deep_Dive|DRA 深度解析]]
- [[_concepts/llm-infrastructure|LLM 基础设施]]
