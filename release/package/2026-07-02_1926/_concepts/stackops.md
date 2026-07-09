---
title: "stackops AI Stack 专属运维工具 (AI Stack Exclusive Ops Tools)"
category: -concepts
tags: ["stackops", "aio-ops", "ai-stack", "ops", "deployment", "aiocontroller"]
relationships:
  - target: "_concepts/kubectl"
    type: related_to
  - target: "_concepts/synapse-gateway"
    type: related_to
  - target: "_concepts/nerdctl"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "stackops/aioController 是 AI Stack 一体机的专属运维工具集。stackops 提供一键部署/升级/诊断，aioController 是底层 K8s 控制器。区别于通用 K8s 工具的 AI Stack 专属层。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: core
---

# stackops / aioController AI Stack 专属运维工具

> **一句话理解**: stackops 是 AI Stack 的"一键运维管家"——封装了 K8s/容器/GPU/模型等复杂操作，提供开箱即用的部署/升级/诊断体验。

---

## 1. 工具定位

| 工具 | 定位 | 说明 |
|------|------|------|
| **stackops** | 运维 CLI 入口 | 一键部署/升级/诊断/配置 |
| **aioController** | K8s Controller | AI Stack 底层控制器 |
| **aio-ops** | 运维脚本集 | 环境检查/启动/停止 |

---

## 2. stackops 核心功能

| 功能 | 说明 |
|------|------|
| **一键部署** | 自动配置 K8s + GPU 驱动 + 推理引擎 |
| **版本升级** | AI Stack 版本滚动升级 |
| **健康检查** | GPU/OS/内存/磁盘/硬件全面检查 |
| **配置管理** | 模型网关/推理参数/资源配额 |
| **日志收集** | 自动收集系统日志用于诊断 |
| **故障诊断** | 一键诊断常见问题 |

---

## 3. AI Stack 运维工具全景

```
AI Stack 运维工具体系
│
├── AI Stack 专属层 ← 本文
│   ├── stackops（一键运维 CLI）
│   ├── aioController（K8s 控制器）
│   └── aio-ops（环境检查脚本）
│
├── K8s 编排层
│   ├── kubectl（K8s 资源管理）
│   └── helm（应用包管理）
│
├── 容器层
│   ├── nerdctl（容器日常操作）
│   ├── crictl（底层容器调试）
│   └── ctr（containerd 原生 CLI）
│
├── GPU 层
│   ├── nvidia-smi / ppu-smi / npu-smi
│   └── pmon（持续监控）
│
└── 模型层
    ├── huggingface-cli / modelscope（模型下载）
    └── vLLM / SGLang / Ollama（推理服务）
```

---

## 4. aioController 角色

aioController 是运行在 K8s 集群中的 **Controller**，负责：

| 职责 | 说明 |
|------|------|
| **资源编排** | 管理 AI Stack 自定义资源（CRD） |
| **状态协调** | 确保推理服务/模型网关等按预期运行 |
| **自动恢复** | Pod 异常时自动重启/重调度 |
| **配置同步** | 同步 AI Stack 平台配置到各组件 |

---

## 5. 与通用 K8s 工具对比

| 维度 | stackops | kubectl + helm |
|------|---------|---------------|
| **复杂度** | 低（一键操作） | 高（需理解 K8s 资源） |
| **适用人群** | AI Stack 用户/运维 | K8s 工程师 |
| **AI 感知** | GPU/模型/推理引擎 | 通用容器 |
| **故障诊断** | AI Stack 专属诊断 | 通用 K8s 排查 |
| **升级管理** | AI Stack 版本升级 | 手动 Helm 升级 |

---

## Related

- [[_concepts/kubectl]] — kubectl Kubernetes CLI
- [[_concepts/synapse-gateway]] — Synapse 模型网关
- [[_concepts/nerdctl]] — nerdctl 容器管理
- [[_concepts/crictl]] — crictl 容器调试
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
