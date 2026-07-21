---
title: "CANN"
category: -concepts
tags: ["ascend", "huawei", "ai-chip", "runtime", "cann", "npu", "domestic-gpu"]
summary: "CANN（Compute Architecture for Neural Networks）是华为昇腾 AI 处理器的异构计算架构，提供从算子开发到推理部署的完整软件栈。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Compute Architecture for Neural Networks"
  - "昇腾 CANN"
relationships:
  - target: "概念/ascend-npu"
    type: runs_on
  - target: "概念/mindie"
    type: includes
sources: []
---

# CANN

> **一句话理解**: CANN 是昇腾 NPU 的软件底座，相当于 NVIDIA 的 CUDA + cuDNN + TensorRT 合体。

## 定义

CANN（Compute Architecture for Neural Networks）是华为为昇腾 AI 处理器打造的异构计算架构，提供从算子开发、模型编译到推理部署的全栈软件能力，是昇腾生态的核心基础设施。

## 架构分层

```
应用层:  MindIE (LLM 推理) / MindSpore / PyTorch Adapter
加速层:  ATB (Transformer Boost) / 融合算子库
编译层:  毕昇编译器 / GE 图引擎 / 算子编译器
算子层:  Ascend C / TBE / AKG
通信层:  HCCL (对标 NCCL)
运行时:  Runtime API / Stream 管理 / 内存管理
驱动层:  NPU Driver + Firmware
硬件层:  昇腾 910B / 910C / 310P
```

## 核心组件对标

| CANN 组件 | 功能 | NVIDIA 对标 |
|-----------|------|-------------|
| **Ascend C** | 算子开发语言 | CUDA C |
| **ATB** | Transformer 加速 | Transformer Engine |
| **HCCL** | 集合通信 | NCCL |
| **GE 图引擎** | 计算图优化 | TensorRT |
| **毕昇编译器** | 算子编译 | NVCC |
| **MindIE** | LLM 推理服务 | TensorRT-LLM / vLLM |

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **当前版本** | CANN 8.x |
| **LLM 支持** | MindIE 支持 Llama/Qwen/GLM/DeepSeek |
| **训练框架** | MindSpore + PyTorch Adapter |
| **硬件** | 910B/910C 训练，310P 推理 |
| **主要用户** | 华为云、运营商、政务、金融 |

## 生产部署要点

1. **版本严格匹配**：CANN 版本必须与 NPU 驱动、固件、基础镜像一致
2. **K8s 部署**：使用华为官方 NPU Device Plugin + 预装 CANN 的基础镜像
3. **MindIE 推理**：支持 Continuous Batching、PagedAttention、量化
4. **多机训练**：HCCL 配置需指定网卡、Rank 表，调试复杂度高于 NCCL
5. **算子兼容性**：自定义算子需用 Ascend C 重写，迁移成本显著

## Related

- [[概念/ascend-npu|Ascend NPU]]
- [[概念/mindie|MindIE]]
- [[概念/GPU/cambricon|Cambricon]] — 国产 AI 芯片对比
- [[概念/GPU/cudnn|cuDNN]] — NVIDIA 对标组件
- [[部署推理/Hardware/Ascend_NPU_Inference_Guide|昇腾 NPU LLM 推理部署指南]]
