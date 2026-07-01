---
title: "Model Parallelism"
category: -concepts
tags: ["distributed-training", "llm", "gpu", "alibaba-cloud"]
summary: "Model Parallelism（模型并行）是将单个模型切分到多张 GPU 上并行训练或推理的分布式策略，包括张量并行和流水线并行。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "模型并行"
relationships:
  - target: "_concepts/distributed-training"
    type: part_of
  - target: "_concepts/tensor-parallelism"
    type: is_a
  - target: "_concepts/pipeline-parallelism"
    type: is_a
---

# Model Parallelism

> **一句话理解**: 模型并行就是「模型太大，一张 GPU 装不下，把模型拆开分到多张卡上跑」。

## 核心要点

- **解决单卡显存不足**: 当模型参数量超过单卡显存时使用。
- **两种主要形式**:
  - **张量并行（Tensor Parallelism）**: 层内切分。
  - **流水线并行（Pipeline Parallelism）**: 层间切分。
- **常与数据并行结合**: 形成 3D 并行。
- **框架支持**: Megatron-LM、DeepSpeed、FSDP、Colossal-AI。

## 与 Data Parallelism 对比

| 并行方式 | 切分对象 | 解决什么问题 |
|----------|---------|-------------|
| Data Parallelism | 数据 | 加速训练 |
| Model Parallelism | 模型 | 单卡放不下大模型 |
| Pipeline Parallelism | 模型层 | 跨节点大模型 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，大模型训练常使用 Megatron-LM 或 DeepSpeed 的模型并行能力，部署在神龙 GPU 集群上。

## Related

- [[_concepts/tensor-parallelism|Tensor Parallelism]]
- [[_concepts/pipeline-parallelism|Pipeline Parallelism]]
- [[_concepts/distributed-training|分布式训练]]
- [[_concepts/megatron-lm|Megatron-LM]]
- [[_concepts/deepspeed|DeepSpeed]]
