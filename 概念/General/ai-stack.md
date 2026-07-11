---
title: "AI Stack"
category: -concepts
tags: ["alibaba-cloud", "ai-stack", "inference", "training", "proprietary-cloud", "alibaba-cloud"]
summary: "AI Stack 是阿里云推出的软硬一体 AI 平台，面向政企私有化场景提供模型管理、训练、推理、GPU 监控等全栈能力。"
created: 2026-06-26
updated: 2026-06-26
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
- [[架构基建/AI_Stack_Deep_Dive|AI Stack Deep Dive]]
- [[架构基建/AI_Stack/AI_Stack_MLOps_Reference_Architecture|AI Stack MLOps 参考架构]]
