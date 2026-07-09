---
title: "DeepSpeed 深度解析: 微软大模型训练与推理优化库"
category: "07-model-training"
tags: ["deepspeed", "microsoft", "distributed-training", "zero", "parallelism", "inference", "optimization", "moe", "offload", "quantization"]
summary: "> **一句话理解**: DeepSpeed 是微软开源的深度学习优化库，通过 ZeRO 显存分片、Offload、DeepSpeed-Inference 和 MoE 等技术，让千亿参数大模型的训练与推理在有限 GPU 上成为可能。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Deepspeed Deep Dive"
  - "DeepSpeed Deep Dive"
  - DeepSpeed_Deep_Dive

---
# DeepSpeed 深度解析：微软大模型训练与推理优化库

> **一句话理解**: DeepSpeed 是微软开源的深度学习优化库，通过 ZeRO 显存分片、Offload、DeepSpeed-Inference 和 MoE 等技术，让千亿参数大模型的训练与推理在有限 GPU 上成为可能。

> **官方站点**: https://www.deepspeed.ai

---

## 目录

1. [项目背景与定位](#1-项目背景与定位)
2. [核心问题：大模型训练显存瓶颈](#2-核心问题大模型训练显存瓶颈)
3. [ZeRO 显存优化详解](#3-zero-显存优化详解)
4. [ZeRO-Offload 与 ZeRO-Infinity](#4-zero-offload-与-zero-infinity)
5. [DeepSpeed-Inference](#5-deepspeed-inference)
6. [MoE 训练](#6-moe-训练)
7. [稀疏注意力与 1-bit 优化器](#7-稀疏注意力与-1-bit-优化器)
8. [与 HuggingFace / PyTorch / Ray 的集成](#8-与-huggingface--pytorch--ray-的集成)
9. [与 HAMi 的 GPU 共享集成](#9-与-hami-的-gpu-共享集成)
10. [生产最佳实践](#10-生产最佳实践)
11. [常见问题与排查](#11-常见问题与排查)
12. [官方资源](#12-官方资源)

---

## 1. 项目背景与定位

### 1.1 发展历程

- **2020 年**：微软发布 DeepSpeed 和 ZeRO，解决大模型训练显存瓶颈。
- **2021 年**：推出 ZeRO-Infinity，支持 NVMe 扩展训练万亿参数模型。
- **2022 年**：发布 DeepSpeed-Inference 和 MoE 训练支持。
- **2023-2026 年**：持续增强对 LLM 的支持，包括 HuggingFace 原生集成、4-bit/8-bit 量化、ZeRO-Inference 等。

### 1.2 项目定位

| 维度 | 定位 |
|------|------|
| **技术层** | 训练/推理优化库 |
| **维护方** | Microsoft |
| **许可证** | MIT |
| **核心目标** | 用更少 GPU 训练/推理更大模型 |

---

## 2. 核心问题：大模型训练显存瓶颈

训练一个 175B 参数的 GPT 模型，使用 Adam 优化器需要：

- 参数：2 bytes × 175B = 350 GB（FP16）
- 梯度：2 bytes × 175B = 350 GB
- 优化器状态：12 bytes × 175B = 2,100 GB
- **总计约 2.8 TB**

单卡 A100 80GB 远远不够。DeepSpeed ZeRO 通过分片消除冗余。

---

## 3. ZeRO 显存优化详解

### 3.1 传统数据并行的冗余

```
GPU 0: full_params + full_grads + full_optimizer_states
GPU 1: full_params + full_grads + full_optimizer_states
GPU N: full_params + full_grads + full_optimizer_states
```

每张卡都保存完整副本，N 张卡就有 N 份冗余。

### 3.2 ZeRO-1 / ZeRO-2 / ZeRO-3

```
ZeRO-1: 优化器状态分片
  GPU 0: params + grads + optimizer_state_0
  GPU 1: params + grads + optimizer_state_1

ZeRO-2: 优化器状态 + 梯度分片
  GPU 0: params + grad_0 + optimizer_state_0
  GPU 1: params + grad_1 + optimizer_state_1

ZeRO-3: 优化器状态 + 梯度 + 参数分片
  GPU 0: param_0 + grad_0 + optimizer_state_0
  GPU 1: param_1 + grad_1 + optimizer_state_1
```

### 3.3 显存节省

| 阶段 | 显存倍数 |
|------|---------|
| 基线 | 1x |
| ZeRO-1 | 4x |
| ZeRO-2 | 8x |
| ZeRO-3 | 与 DP 度线性相关 |

---

## 4. ZeRO-Offload 与 ZeRO-Infinity

### 4.1 ZeRO-Offload

把优化器状态和计算卸载到 CPU，甚至 NVMe：

```json
{
  "zero_optimization": {
    "stage": 2,
    "offload_optimizer": {
      "device": "cpu",
      "pin_memory": true
    }
  }
}
```

适合：单卡/少卡微调大模型。

### 4.2 ZeRO-Infinity

进一步把参数和优化器状态卸载到 NVMe SSD：

```json
{
  "zero_optimization": {
    "stage": 3,
    "offload_param": {
      "device": "nvme",
      "nvme_path": "/local_nvme"
    },
    "offload_optimizer": {
      "device": "nvme",
      "nvme_path": "/local_nvme"
    }
  }
}
```

适合：超大规模模型预训练。

---

## 5. DeepSpeed-Inference

### 5.1 多 GPU 并行推理

```python
import deepspeed
import torch

model = ...

deepspeed_engine = deepspeed.init_inference(
    model,
    tensor_parallel={"tp_size": 4},
    dtype=torch.half,
    replace_with_kernel_inject=True
)
```

### 5.2 量化推理

```python
deepspeed_engine = deepspeed.init_inference(
    model,
    dtype=torch.int8,
    replace_with_kernel_inject=True
)
```

### 5.3 ZeRO-Inference

用于单卡无法放下整个模型时的推理，把参数 offload 到 CPU/NVMe。

---

## 6. MoE 训练

DeepSpeed 提供端到端 MoE 训练支持：

```python
from deepspeed.moe.layer import MoE

moe_layer = MoE(
    hidden_size=hidden_size,
    expert=expert_module,
    num_experts=64,
    ep_size=8
)
```

- **EP（Expert Parallelism）**：专家分片到不同节点。
- **EP + ZeRO-3**：组合使用可训练超大 MoE 模型。

---

## 7. 稀疏注意力与 1-bit 优化器

### 7.1 Sparse Attention

通过稀疏模式降低长序列 attention 复杂度，支持 10K+ 序列长度。

### 7.2 1-bit Adam / LAMB

压缩优化器通信量，适合多节点网络带宽受限场景。

---

## 8. 与 HuggingFace / PyTorch / Ray 的集成

### 8.1 HuggingFace Transformers

```python
from transformers import TrainingArguments, Trainer

training_args = TrainingArguments(
    ...,
    deepspeed="ds_config_zero3.json"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset
)
trainer.train()
```

### 8.2 PyTorch 原生

```python
import deepspeed

model_engine, optimizer, _, _ = deepspeed.initialize(
    args=args,
    model=model,
    model_parameters=model.parameters()
)

for batch in dataloader:
    loss = model_engine(batch)
    model_engine.backward(loss)
    model_engine.step()
```

### 8.3 Ray Train

```python
from ray.train.torch import TorchTrainer
from ray.train.deepspeed import DeepSpeedConfig

trainer = TorchTrainer(
    train_loop_per_worker=train_func,
    scaling_config=train.ScalingConfig(num_workers=8, use_gpu=True),
    run_config=...
)
```

---

## 9. 与 HAMi 的 GPU 共享集成

在资源受限场景下，DeepSpeed 训练任务可以申请 HAMi vGPU：

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
    nvidia.com/gpumem: 16384
```

> 注意：DeepSpeed ZeRO-3 需要频繁通信，vGPU 的软件隔离可能带来轻微抖动。关键生产训练建议使用独占 GPU 或 MIG。

---

## 10. 生产最佳实践

### 10.1 配置选择

| 场景 | 推荐配置 |
|------|---------|
| 单卡微调 7B/13B | ZeRO-2 + Offload to CPU |
| 多卡训练 70B | ZeRO-3 + Offload to NVMe |
| 千亿预训练 | ZeRO-Infinity + Pipeline Parallel |
| 高吞吐推理 | DeepSpeed-Inference + TP |

### 10.2 JSON 配置模板（ZeRO-2 Offload）

```json
{
  "bf16": {
    "enabled": true
  },
  "zero_optimization": {
    "stage": 2,
    "offload_optimizer": {
      "device": "cpu",
      "pin_memory": true
    },
    "allgather_partitions": true,
    "allgather_bucket_size": 2e8,
    "overlap_comm": true,
    "reduce_scatter": true
  },
  "train_batch_size": "auto",
  "train_micro_batch_size_per_gpu": "auto",
  "gradient_accumulation_steps": "auto"
}
```

### 10.3 性能调优

- 使用 NCCL 多机通信，确保 RDMA/RoCE 网络。
- 调整 `allgather_bucket_size` 和 `reduce_bucket_size`。
- 开启 `overlap_comm` 隐藏通信延迟。
- 使用 BF16 替代 FP16 减少溢出。

---

## 11. 常见问题与排查

### Q1: ZeRO-3 训练速度很慢

**A**: 参数分片引入大量通信，建议配合 NVLink/InfiniBand，或改用 ZeRO-2 + Offload。

### Q2: `CUDA out of memory` 即使开了 ZeRO

**A**: 检查 activation checkpointing 是否开启，增大 `gradient_accumulation_steps` 减小 micro batch。

### Q3: HuggingFace 集成时配置不生效

**A**: 确保 `deepspeed` 参数路径正确，且配置文件中 `train_batch_size` 设为 `auto`。

### Q4: DeepSpeed-Inference 启动报错 `tensor parallel size mismatch`

**A**: 确保 GPU 数量能被 `tp_size` 整除。

### Q5: Offload 到 NVMe 训练卡住

**A**: 检查 NVMe 路径权限和可用空间，确保 I/O 带宽足够。

### Q6: 和 FSDP 怎么选？

**A**: HuggingFace 生态快速上手选 DeepSpeed；PyTorch 原生项目且需与生态深度整合选 FSDP。

### Q7: 多节点通信失败

**A**: 检查 NCCL 环境变量、节点间 SSH/网络、防火墙、共享文件系统。

### Q8: 如何保存和加载 ZeRO-3 Checkpoint？

**A**: 使用 `deepspeed.DeepSpeedEngine.save_checkpoint()` 和 `load_checkpoint()`，会自动聚合/分片参数。

---

## 12. 官方资源

- **官网**: https://www.deepspeed.ai
- **GitHub**: https://github.com/microsoft/DeepSpeed
- **文档**: https://www.deepspeed.ai/docs/
- **ZeRO 论文**: https://arxiv.org/abs/1910.02054
- **HuggingFace 集成指南**: https://huggingface.co/docs/transformers/main_classes/deepspeed

---

## Related

- [[_concepts/deepspeed]] — DeepSpeed 概念卡片
- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/fsdp]] — PyTorch FSDP
- [[_concepts/megatron-lm]] — Megatron-LM
- [[_concepts/hami]] — HAMi GPU 虚拟化
- [[_concepts/ray]] — Ray 分布式框架
- [[模型训练/Distributed_Training/Ray_Deep_Dive]] — Ray
- [[模型训练/Distributed_Training/Distributed_Training_2026]] — 分布式训练 2026
