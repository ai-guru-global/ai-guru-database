---
title: "stackops AI Stack 专属运维工具 (AI Stack Exclusive Ops Tools)"
category: -concepts
tags: ["stackops", "aio-ops", "ai-stack", "ops", "deployment", "aiocontroller"]
relationships:
  - target: "概念/kubectl"
    type: related_to
  - target: "概念/synapse-gateway"
    type: related_to
  - target: "概念/nerdctl"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "stackops/aioController 是 AI Stack 一体机的专属运维工具集。stackops 提供一键部署/升级/诊断，aioController 是底层 K8s 控制器。区别于通用 K8s 工具的 AI Stack 专属层。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
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

- [[概念/kubectl]] — kubectl Kubernetes CLI
- [[概念/synapse-gateway]] — Synapse 模型网关
- [[概念/nerdctl]] — nerdctl 容器管理
- [[概念/crictl]] — crictl 容器调试
- [[概念/helm]] — Helm 包管理
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 stackops 最佳实践

| 场景 | 工具 | 说明 |
|------|------|------|
| 日常运维 | stackops | 一键部署/升级/诊断 |
| K8s 操作 | kubectl | 资源管理 |
| 容器调试 | crictl/nerdctl | 底层排查 |

## 6. stackops 常用命令

| 命令 | 作用 |
|------|------|
| `stackops deploy` | 一键部署 AI Stack |
| `stackops upgrade` | 版本升级 |
| `stackops check` | 健康检查 |
| `stackops diagnose` | 故障诊断 |
| `stackops logs` | 日志收集 |
| `stackops config` | 配置管理 |
| `stackops status` | 查看服务状态 |

## 7. 故障排查流程

```
AI Stack 故障排查流程:

1. stackops check        → 快速健康检查
2. stackops diagnose     → 自动诊断常见问题
3. stackops logs         → 收集日志
4. kubectl get pods -A   → 查看 Pod 状态
5. nvidia-smi            → 检查 GPU 状态
6. crictl ps             → 检查容器状态
7. 联系技术支持         → 提供日志包
```

## 8. 与通用工具協作

| 场景 | 首选工具 | 补充工具 |
|------|----------|----------|
| 部署/升级 | stackops | - |
| 健康检查 | stackops check | nvidia-smi |
| Pod 排查 | kubectl | crictl |
| 容器调试 | crictl/nerdctl | ctr |
| GPU 问题 | nvidia-smi | stackops diagnose |
| 模型服务 | stackops | kubectl logs |
| 网络问题 | kubectl | 洛神控制台 |

## 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 部署失败 | 环境不满足 | `stackops check` 检查前置条件 |
| GPU 不可用 | 驱动未安装 | 检查 nvidia-smi 输出 |
| 推理服务异常 | 模型加载失败 | 检查模型路径和显存 |
| 升级失败 | 版本不兼容 | 查看升级日志，联系支持 |

## 生产最佳实践

1. **日常用 stackops**：AI Stack 用户优先使用 stackops
2. **深度排查用 kubectl**：需要深入 K8s 资源时用 kubectl
3. **日志收集**：故障时先用 stackops 收集日志
4. **版本升级**：使用 stackops 进行 AI Stack 版本升级
5. **定期检查**：每周执行 `stackops check` 确保系统健康

## 9. 版本兼容性

| AI Stack 版本 | K8s 版本 | GPU 驱动 | CUDA |
|--------------|----------|----------|------|
| 2.x | 1.26+ | 535+ | 12.x |
| 3.x | 1.28+ | 545+ | 12.x |
| 4.x | 1.30+ | 550+ | 12.x |

## 10. 环境检查清单

| 检查项 | 命令 | 期望结果 |
|--------|------|----------|
| GPU 驱动 | `nvidia-smi` | 显示 GPU 信息 |
| K8s 状态 | `kubectl get nodes` | 所有节点 Ready |
| 存储 | `df -h` | 磁盘空间充足 |
| 网络 | `ping <gateway>` | 网络连通 |
| 容器运行时 | `crictl info` | 运行时正常 |

> 💡 stackops 是 AI Stack 一体机的「运维管家」，封装了 K8s/GPU/模型的复杂操作，提供开箱即用的运维体验。
