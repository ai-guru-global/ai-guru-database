---
title: "Model Parallelism"
category: -concepts
tags: ["distributed-training", "llm", "gpu", "alibaba-cloud"]
summary: "Model Parallelism（模型并行）是将单个模型切分到多张 GPU 上并行训练或推理的分布式策略，包括张量并行和流水线并行。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "模型并行"
relationships:
  - target: "概念/distributed-training"
    type: part_of
  - target: "概念/tensor-parallelism"
    type: is_a
  - target: "概念/pipeline-parallelism"
    type: is_a
sources: []
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

- [[概念/tensor-parallelism|Tensor Parallelism]]
- [[概念/pipeline-parallelism|Pipeline Parallelism]]
- [[概念/distributed-training|分布式训练]]
- [[概念/megatron-lm|Megatron-LM]]
- [[概念/deepspeed|DeepSpeed]]

---

## 2026 模型并行生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Tensor Parallelism** | 层内切分，适合大层 | GA |
| **Pipeline Parallelism** | 层间切分，适合深层网络 | GA |
| **Expert Parallelism** | MoE 专家分布到不同 GPU | GA |
| **Sequence Parallelism** | 序列维度切分，降低激活内存 | GA |
| **3D/4D/5D 并行** | 多维度组合并行策略 | GA |

## 生产最佳实践

1. **大模型必用**：>10B 参数模型必须用模型并行
2. **TP 适合层内**：Tensor Parallelism 适合大层（如 Attention）
3. **PP 适合层间**：Pipeline Parallelism 适合深层网络
4. **MoE 用 EP**：MoE 模型用 Expert Parallelism 分布专家
5. **组合策略**：生产环境用 3D/4D 并行组合策略
