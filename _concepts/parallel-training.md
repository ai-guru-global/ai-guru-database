---
title: "Parallel Training"
category: concepts
tags: ["distributed-training", "gpu", "llm", "model-parallelism", "deepspeed"]
summary: "Parallel Training（并行训练）是利用数据并行、模型并行、流水线并行、张量并行等策略，将模型训练任务拆分到多张 GPU 或多个节点上同时执行的工程技术，用于突破单卡显存与算力瓶颈。"
created: 2026-07-02
updated: 2026-07-02
---

# Parallel Training

**并行训练（Parallel Training）** 指将单个模型训练任务拆分为多个可并行执行的子任务，并在多张 GPU 或多个计算节点上同时运行，以缩短训练时间、扩大可训练模型规模。它是当前训练 10B 参数以上大语言模型的基础工程能力。

## 核心原理与组成

并行训练通常按拆分维度分为三类：

- **数据并行（Data Parallelism, DP）**：每张 GPU 保存完整模型副本，各自处理不同数据分片，最后聚合梯度。实现简单，是中小模型最常用的并行方式。
- **模型并行（Model Parallelism, MP）**：将模型本身按层或按张量切分到不同 GPU，每张卡只保存部分参数。适用于单卡显存无法容纳完整模型的情况。
- **混合并行（Hybrid Parallelism）**：将数据并行、流水线并行、张量并行等组合使用，例如 3D 并行（DP + PP + TP），以同时扩展 batch size、层数和层内张量规模。

此外，**FSDP（Fully Sharded Data Parallel）** 和 **ZeRO** 通过更细粒度的参数/梯度/优化器状态分片，在数据并行框架内进一步降低单卡显存占用。

## 典型用例

- 训练 GPT、LLaMA、Qwen 等数十亿到数千亿参数的大语言模型。
- 在千卡集群上完成大规模视觉或多模态模型预训练。
- 使用 DeepSpeed、Megatron-LM、FSDP、Colossal-AI 等框架进行高效分布式训练。

## 与相关概念的区别与联系

| 概念 | 关注点 | 与并行训练的关系 |
|------|--------|-----------------|
| **分布式训练（Distributed Training）** | 多节点/多卡的训练体系 | 并行训练是其核心实现手段 |
| **模型并行** | 模型切分 | 并行训练的一种策略 |
| **张量并行** | 层内张量拆分 | 模型并行的细化形式 |
| **流水线并行** | 层间按阶段拆分 | 常与数据并行、张量并行组合使用 |
| **并行推理** | 推理阶段的并行加速 | 复用相同的并行切分思想，但目标为低延迟而非高吞吐训练 |

## Related

- [[_concepts/distributed-training|分布式训练]]
- [[_concepts/model-parallelism|模型并行]]
- [[_concepts/pipeline-parallelism|流水线并行]]
- [[_concepts/tensor-parallelism|张量并行]]
- [[_concepts/deepspeed|DeepSpeed]]
- [[_concepts/megatron-lm|Megatron-LM]]
- [[_concepts/fsdp|FSDP]]
- [[_concepts/torchrun|torchrun]]
