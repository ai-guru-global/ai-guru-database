---
title: "CANN"
category: -concepts
tags: ["ascend", "huawei", "ai-chip", "runtime", "alibaba-cloud"]
summary: "CANN（Compute Architecture for Neural Networks）是华为昇腾 AI 处理器的异构计算架构，提供从算子开发到推理部署的完整软件栈。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Compute Architecture for Neural Networks"
  - "昇腾 CANN"
relationships:
  - target: "_concepts/ascend-npu"
    type: runs_on
  - target: "_concepts/mindie"
    type: includes
---

# CANN

> **一句话理解**: CANN 是昇腾 NPU 的软件底座，相当于 NVIDIA 的 CUDA + cuDNN + TensorRT 合体。

## 核心要点

- **算子开发**: Ascend C、TBE、AKG
- **加速库**: ATB（Transformer Boost）
- **通信库**: HCCL（对标 NCCL）
- **编译**: 毕昇编译器、图编译器
- **运行时**: Runtime API、GE 图引擎

## 阿里云专有云关联

在阿里云专有云昇腾节点上，CANN 版本需与 NPU 驱动、基础镜像严格匹配，K8s 中常作为基础镜像预装。

## Related

- [[_concepts/ascend-npu|Ascend NPU]]
- [[_concepts/mindie|MindIE]]
- [[10_Deployment_Inference/Hardware/Ascend_NPU_Inference_Guide|昇腾 NPU LLM 推理部署指南]]
