---
title: "AI Stack"
category: -concepts
tags: ["alibaba-cloud", "ai-stack", "inference", "training", "proprietary-cloud", "alibaba-cloud"]
summary: "AI Stack 是阿里云推出的软硬一体 AI 平台，面向政企私有化场景提供模型管理、训练、推理、GPU 监控等全栈能力。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "阿里云 AI Stack"
  - "AI Stack 一体机"
relationships:
  - target: "概念/alibaba-cloud"
    type: provided_by
  - target: "概念/ack"
    type: runs_on
sources: []
---

# AI Stack

> **一句话理解**: AI Stack 是阿里云政企客户私有化部署 AI 的「一体机」，模型、训练、推理、监控开箱即用。

## 核心要点

- **软硬一体**: 预装 GPU/NPU 服务器、容器、AI 工具链。
- **模型管理**: huggingface-cli、modelscope、git-lfs 下载与版本组织。
- **训练启动器**: torchrun、accelerate、deepspeed、swift。
- **推理服务**: vLLM、SGLang、Ollama、llama-server。
- **GPU 监控**: nvidia-smi、ppu-smi、rocm-smi、pmon。
- **运维工具**: stackops、aioController。

## 典型组件

| 组件 | 说明 |
|------|------|
| stackops | 运维 CLI 工具 |
| aioController | 一体机生命周期管理 |
| AI Stack 容器运行时 | nerdctl/crictl/ctr 等 |
| AI Stack 模型仓库 | 本地模型版本管理 |

## 阿里云专有云关联

AI Stack 可与阿里云专有云 ACK 集成，作为私有化 AI 底座；也可独立部署在企业本地数据中心。

## Related

- [[概念/alibaba-cloud|Alibaba Cloud]]
- [[概念/ack|ACK]]
- [[12_架构基建/AI_Stack_Deep_Dive|AI Stack Deep Dive]]
- [[12_架构基建/03_AI_Stack/AI_Stack_MLOps_Reference_Architecture|AI Stack MLOps 参考 架构]]

---

## 2026 AI Stack 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **AI Stack** | 阿里云 AI 基础设施 | GA |
| **GPU 调度** | 分布式训练 GPU 调度 | GA |
| **模型仓库** | 内置模型注册中心 | GA |
| **MLOps 流水线** | 端到端 ML 流水线 | GA |
| **推理服务** | 模型推理服务 | GA |

## 生产最佳实践

1. **一体化平台**：用 AI Stack 一体化 AI 平台
2. **GPU 调度**：训练任务用 AI Stack GPU 调度
3. **模型管理**：模型注册到 AI Stack 仓库
4. **与 ACK 配合**：AI Stack + ACK 容器编排
5. **专有云部署**：专有云环境用 AI Stack

## 架构与组件

| 层级 | 组件 | 职责 |
|------|------|------|
| 硬件层 | GPU/NPU 服务器 | 算力基础设施 |
| 容器层 | containerd + K8s | 容器编排 |
| 训练层 | DeepSpeed/Arena | 分布式训练 |
| 推理层 | vLLM/SGLang | 模型推理服务 |
| 管理层 | stackops/aioController | 运维管理 |
| 监控层 | Prometheus + Grafana | GPU/服务监控 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `stackops status` | 查看集群状态 |
| `stackops gpu list` | 查看 GPU 列表 |
| `stackops model list` | 查看模型列表 |
| `nerdctl ps` | 查看运行容器 |
| `crictl pods` | 查看 Pod 列表 |
| `nvidia-smi` | 查看 GPU 状态 |

## 与 PAI 对比

| 维度 | AI Stack | PAI |
|------|----------|-----|
| 部署 | 私有化/本地 | 公有云托管 |
| 适用 | 政企/金融 | 互联网/初创 |
| 运维 | 自运维 + stackops | 全托管 |
| 弹性 | 受限于硬件 | 无限弹性 |
| 成本 | 一次性投入 | 按量付费 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| GPU 不可用 | 驱动/插件问题 | 检查 nvidia-device-plugin |
| 模型加载失败 | 存储/权限问题 | 检查模型路径和权限 |
| 训练任务失败 | 资源不足/配置错误 | 检查资源配额和配置 |
| 推理服务慢 | 模型未优化 | 使用量化/编译优化 |

## 相关概念

- [[概念/alibaba-cloud|Alibaba Cloud]] — 阿里云
- [[概念/ack|ACK]] — 容器服务
- [[概念/pai|PAI]] — AI 平台
- [[概念/General/stackops|StackOps]] — 运维工具

## 总结

AI Stack 是阿里云推出的软硬一体 AI 平台，面向政企私有化场景提供模型管理、训练、推理、GPU 监控等全栈能力。

---

> 💡 AI Stack 是阿里云政企客户私有化部署 AI 的「一体机」，模型、训练、推理、监控开箱即用。

## 部署架构

```
用户请求 → 负载均衡 → 推理服务 (vLLM/SGLang)
                              ↓
                    模型仓库 (ModelScope/HF)
                              ↓
              GPU 集群 (NVIDIA/华为昇腾)
                              ↓
              存储 (NAS/OSS/CPFS)
```

| 组件 | 部署方式 | 资源需求 |
|------|----------|----------|
| 控制面 | K8s Deployment | 4C8G |
| 推理服务 | GPU Pod | 1-8 GPU |
| 模型仓库 | StatefulSet + NAS | 2C4G + 存储 |
| 监控 | Prometheus + Grafana | 2C4G |
| stackops | DaemonSet | 1C1G |

## GPU 管理

| 功能 | 工具 | 说明 |
|------|------|------|
| GPU 发现 | nvidia-device-plugin | 自动发现 GPU |
| GPU 监控 | DCGM / nvidia-smi | 利用率/温度/显存 |
| GPU 共享 | HAMi / cGPU | 多 Pod 共享 GPU |
| GPU 调度 | K8s Scheduler | 按 GPU 数量调度 |
| GPU 故障 | Node Problem Detector | 自动检测故障 |

## 模型生命周期

| 阶段 | 工具 | 说明 |
|------|------|------|
| 下载 | modelscope/huggingface-cli | 模型下载 |
| 存储 | NAS/OSS | 模型存储 |
| 版本 | Model Registry | 版本管理 |
| 部署 | vLLM/SGLang | 推理服务部署 |
| 监控 | Prometheus | 推理指标监控 |
| 更新 | 滚动更新 | 模型版本更新 |

## 版本兼容性

| 组件 | 版本 | 状态 |
|------|------|------|
| AI Stack | 2.0+ | 稳定 |
| vLLM | 0.6+ | 稳定 |
| SGLang | 0.4+ | 稳定 |
| CUDA | 12.4+ | 稳定 |
| K8s | 1.28+ | 稳定 |

## 生产检查清单

1. **GPU 驱动**：确认 GPU 驱动和 CUDA 版本匹配
2. **网络配置**：确保推理服务网络可达
3. **存储挂载**：确认 NAS/OSS 挂载正常
4. **模型缓存**：配置模型本地缓存加速加载
5. **监控告警**：GPU 利用率、显存、温度告警
6. **备份恢复**：定期备份模型和配置
7. **安全加固**：限制 API 访问权限

## 故障排查流程

```
1. 检查服务状态 → 2. 检查 GPU 状态 → 3. 检查日志
       ↓                    ↓                  ↓
4. 检查网络 → 5. 检查存储 → 6. 重启服务
```

## 相关概念

- [[概念/pai|PAI]] — 阿里云 AI 平台
- [[概念/ack|ACK]] — 容器服务底座
- [[概念/gpu-sharing|GPU Sharing]] — GPU 资源管理

> 💡 AI 技术栈的核心是将算力、框架、模型、应用四层解耦，每层可独立演进和替换。
