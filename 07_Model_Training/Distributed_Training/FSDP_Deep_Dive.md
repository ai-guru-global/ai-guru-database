---
title: "FSDP 深度解析: PyTorch 全分片数据并行"
category: "07-model-training"
tags: ["fsdp", "pytorch", "distributed-training", "zero", "sharding", "llm", "training", "offload"]
summary: "> **一句话理解**: FSDP 是 PyTorch 原生的全分片数据并行框架，相当于 PyTorch 内置的 ZeRO-3，通过把参数、梯度和优化器状态分片到多 GPU，让 PyTorch 项目以最小改动训练大模型。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Fsdp Deep Dive"
  - "FSDP Deep Dive"
  - FSDP_Deep_Dive
sources: []

---
# FSDP 深度解析：PyTorch 全分片数据并行

> **一句话理解**: FSDP 是 PyTorch 原生的全分片数据并行框架，相当于 PyTorch 内置的 ZeRO-3，通过把参数、梯度和优化器状态分片到多 GPU，让 PyTorch 项目以最小改动训练大模型。

> **官方文档**: https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html

---

## 目录

1. [核心问题：为什么需要 FSDP](#1-核心问题为什么需要-fsdp)
2. [FSDP 工作原理](#2-fsdp-工作原理)
3. [与 DDP / DeepSpeed 的对比](#3-与-ddp--deepspeed-的对比)
4. [关键 API 与配置](#4-关键-api-与配置)
5. [与 HuggingFace Trainer 集成](#5-与-huggingface-trainer-集成)
6. [CPU Offload 与 Checkpoint](#6-cpu-offload-与-checkpoint)
7. [混合精度与性能优化](#7-混合精度与性能优化)
8. [生产最佳实践](#8-生产最佳实践)
9. [常见问题与排查](#9-常见问题与排查)
10. [官方资源](#10-官方资源)

---

## 1. 核心问题：为什么需要 FSDP

### 1.1 DDP 的局限

PyTorch DDP 要求每个 GPU 保存完整模型副本。对于 70B 参数模型：

- 参数：140 GB（FP16）
- 梯度：140 GB
- 优化器状态：840 GB（Adam FP32）
- 总计：1120 GB

单卡 A100 80GB 远远不够。

### 1.2 FSDP 的解决思路

FSDP 把参数、梯度、优化器状态分片到所有参与训练的 rank：

```
Rank 0: shard_0 of params/grads/optimizer_states
Rank 1: shard_1
Rank N: shard_N
```

---

## 2. FSDP 工作原理

### 2.1 Forward

```python
# 1. All-gather 参数
# 2. 执行 forward
# 3. 释放非本 rank 参数
```

### 2.2 Backward

```python
# 1. All-gather 参数
# 2. 计算梯度
# 3. Reduce-scatter 梯度到对应 rank
# 4. 释放参数，保留本 rank 梯度分片
```

### 2.3 Optimizer Step

每个 rank 只更新自己负责的参数分片。

---

## 3. 与 DDP / DeepSpeed 的对比

| 特性 | DDP | FSDP | DeepSpeed ZeRO-3 |
|------|-----|------|-----------------|
| 模型副本 | 每 rank 完整 | 分片 | 分片 |
| 代码改动 | 小 | 小 | 中 |
| 灵活性 | 中 | 高 | 中 |
| 超大规模 | 不适合 | 适合（需配合 TP/PP） | 更适合 |
| CPU Offload | 不支持 | 支持 | 支持 |

---

## 4. 关键 API 与配置

### 4.1 基础用法

```python
import torch
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp.wrap import size_based_auto_wrap_policy

model = FSDP(
    model,
    auto_wrap_policy=size_based_auto_wrap_policy,
    mixed_precision=torch.bfloat16,
    device_id=torch.cuda.current_device()
)
```

### 4.2 常用参数

| 参数 | 说明 |
|------|------|
| `auto_wrap_policy` | 自动决定 FSDP wrapping 粒度 |
| `mixed_precision` | 混合精度配置 |
| `cpu_offload` | 参数/梯度 offload 到 CPU |
| `sharding_strategy` | FULL_SHARD / SHARD_GRAD_OP / NO_SHARD |
| `backward_prefetch` | 预取参数减少等待 |
| `limit_all_gathers` | 限制并发 all-gather |

---

## 5. 与 HuggingFace Trainer 集成

```python
from transformers import TrainingArguments, Trainer

training_args = TrainingArguments(
    output_dir="./output",
    fsdp=["full_shard", "auto_wrap"],
    bf16=True,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
)

trainer = Trainer(model=model, args=training_args, train_dataset=dataset)
trainer.train()
```

---

## 6. CPU Offload 与 Checkpoint

### 6.1 CPU Offload

```python
from torch.distributed.fsdp import CPUOffload

model = FSDP(model, cpu_offload=CPUOffload(offload_params=True))
```

适合单卡显存极小但 CPU 内存充足的场景。

### 6.2 Checkpoint

```python
FSDP.set_state_dict_type(model, StateDictType.SHARDED_STATE_DICT)
torch.save(model.state_dict(), "checkpoint.pt")
```

---

## 7. 混合精度与性能优化

### 7.1 混合精度

```python
from torch.distributed.fsdp import MixedPrecision

mp_policy = MixedPrecision(param_dtype=torch.bfloat16, reduce_dtype=torch.bfloat16, buffer_dtype=torch.bfloat16)
model = FSDP(model, mixed_precision=mp_policy)
```

### 7.2 性能优化建议

- 使用 `backward_prefetch=BACKWARD_PRE`。
- 设置 `limit_all_gathers=True`。
- 合理选择 `auto_wrap_policy`。
- 使用 `torch.compile` 进一步加速。

---

## 8. 生产最佳实践

### 8.1 自动包装策略

```python
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy

model = FSDP(
    model,
    auto_wrap_policy=transformer_auto_wrap_policy(
        layer_cls={TransformerBlock}
    )
)
```

### 8.2 检查点保存

- 小模型：FullStateDict
- 大模型：ShardedStateDict

### 8.3 多节点训练

配合 `torchrun` 启动：

```bash
torchrun --nproc_per_node=8 --nnodes=4 --node_rank=$RANK --master_addr=$MASTER_ADDR train.py
```

---

## 9. 常见问题与排查

### Q1: FSDP 与 DDP 可以同时用吗？

**A**: 不可以，FSDP 是 DDP 的替代。

### Q2: 训练报 `CUDA out of memory`

**A**: 启用 `cpu_offload`、减小 batch size、使用 activation checkpointing。

### Q3: 与 DeepSpeed 怎么选？

**A**: PyTorch 原生项目选 FSDP；需要 NVMe Offload 或 HuggingFace 生态深度集成选 DeepSpeed。

### Q4: FSDP 支持 LoRA 吗？

**A**: 支持，通常只 wrap base model，LoRA 参数不做 FSDP。

### Q5: Checkpoint 加载报错

**A**: 确认 StateDictType 一致，ShardedStateDict 需用对应加载方式。

### Q6: 为什么 all-gather 通信很多？

**A**: FSDP 每次 forward/backward 都需要 all-gather 参数，这是正常开销。

### Q7: 如何监控 FSDP 性能？

**A**: 使用 PyTorch Profiler 和 NCCL 日志分析通信瓶颈。

### Q8: FSDP 能做张量并行吗？

**A**: FSDP 本身是数据并行，TP 需配合 torch.distributed.tensor.parallel 或其他框架。

---

## 10. 官方资源

- **官方教程**: https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html
- **API 文档**: https://pytorch.org/docs/stable/fsdp.html
- **HuggingFace 集成**: https://huggingface.co/docs/transformers/main/en/fsdp

---

## Related

- [[_concepts/fsdp]] — FSDP 概念卡片
- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/deepspeed]] — DeepSpeed
- [[_concepts/megatron-lm]] — Megatron-LM
- [[07_Model_Training/Distributed_Training/DeepSpeed_Deep_Dive]] — DeepSpeed 深度解析
- [[07_Model_Training/Distributed_Training/Megatron_LM_Deep_Dive]] — Megatron-LM 深度解析
