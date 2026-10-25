---
title: "FSDP 深度解析: PyTorch 全分片数据并行"
category: "07-model-training"
tags: ["fsdp", "pytorch", "distributed-training", "zero", "sharding", "llm", "training", "offload"]
summary: "> **一句话理解**: FSDP 是 PyTorch 原生的全分片数据并行框架，相当于 PyTorch 内置的 ZeRO-3，通过把参数、梯度和优化器状态分片到多 GPU，让 PyTorch 项目以最小改动训练大模型。"
created: "2026-06-16"
updated: "2026-07-25"
tier: supporting
aliases:
  - "Fsdp Deep Dive"
  - "FSDP Deep Dive"
  - FSDP_Deep_Dive
sources: []

name_zh: "FSDP 深度解析: PyTorch 全分片数据并行"
---
# FSDP 深度解析：PyTorch 全分片数据并行

> 中文简称：FSDP 深度解析: PyTorch 全分片数据并行

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

## 11. 源码级实现解析（基于 Accelerate v1.14.0）

> FSDP 本体在 PyTorch 内部，但工程落地普遍通过 HuggingFace Accelerate。本节基于本仓库归档源码 `code/llm-frameworks/accelerate-v1.14.0/src/accelerate/`，剖析 FSDP1/FSDP2 的集成实现。

### 11.1 架构设计：Plugin 抽象屏蔽 FSDP1/FSDP2 差异

所有 FSDP 配置收敛到 `FullyShardedDataParallelPlugin`（`utils/dataclasses.py` L1584），其 `fsdp_version` 字段（L1657，默认 1）是全局分叉点：

| 维度 | FSDP1（version=1） | FSDP2（version=2） |
|---|---|---|
| 分片策略 | `sharding_strategy: str`（FULL_SHARD/SHARD_GRAD_OP...） | `reshard_after_forward: bool`（L1596） |
| 混合精度 | `MixedPrecision` | `torch.distributed.fsdp.MixedPrecisionPolicy`（L1605） |
| CPU Offload | `CPUOffload` | `CPUOffloadPolicy`（L1615） |
| 包装方式 | `FullyShardedDataParallel` 类包装 | `fully_shard` 函数式改写（DTensor） |

`utils/fsdp_utils.py` 中大量 `if fsdp_plugin.fsdp_version == 2:` 分支（L90/L122/L253 等）证明 Accelerate 用同一套 save/load API 同时兼容两代实现。

### 11.2 关键技术实现：FSDP2 准备流程

`fsdp2_prepare_model`（`utils/fsdp_utils.py` L645）是 FSDP2 接管模型的完整流程，每步都有明确工程动机：

1. **幂等检查**：若模型已是 `FSDPModule`（含 torch.compile 包装情况）直接返回（L657-661）。
2. **自动包装策略**：`fsdp2_plugin.set_auto_wrap_policy(model)` 按 transformer 层类名确定分片边界（L665）。
3. **DeviceMesh 接入**：从 `accelerator.torch_device_mesh` 取 `fsdp_dim_names` 子网格（L674）——这是 FSDP2 能与 TP/CP 组合成 HSDP/多维并行的入口（配合 `parallelism_config.py`）。
4. **量化兼容**：非浮点冻结 `Params4bit`（bitsandbytes）会被加入 `ignored_params` 排除分片，因为 uint8 quant_storage 无法存活于 `fully_shard` 的 DTensor 转换（L689-698）。
5. **主权重上提**：混合精度下把可训参数统一 upcast 到 fp32 主权重，计算精度交给 `MixedPrecisionPolicy.param_dtype`（L707-714）——FSDP2 要求同组参数 dtype 一致。

配套的 `fsdp2_load_full_state_dict`（L467）实现 rank0 广播式加载，`fsdp2_switch_optimizer_parameters`（L563）在参数被替换为 DTensor 后原地修复优化器引用。

### 11.3 性能与内存优化机制

- **RAM 高效加载**：`enable_fsdp_ram_efficient_loading`（L39）设置环境变量让 transformers 只在 rank0 加载完整权重，其余 rank 用 meta device，避免 N 卡节点 N 份完整模型的内存峰值；FSDP1 路径下要求 `sync_module_states=True` 配合（L187）。
- **检查点类型分流**：`save_fsdp_model`（L103）按 `StateDictType`（FULL/SHARDED_STATE_DICT）分流：FULL 在 rank0 聚合便于分发，SHARDED 各 rank 写自己分片支持快速恢复。
- **reshard_after_forward 权衡**：FSDP2 下设为 `False` 等价于 FSDP1 的 SHARD_GRAD_OP（前向后保留全参数，省去反向重新 all-gather，以显存换通信）。

### 11.4 配置与部署要点（源码印证）

- 启动器通过环境变量 `FSDP_VERSION` 传递版本选择（`utils/launch.py` L309），`accelerate config` 生成的 yaml 与之一一对应。
- 新项目建议直接 `fsdp_version: 2`：DTensor 基座、可组合 device mesh、量化兼容性更好；FSDP1 仍是默认值仅为向后兼容。
- QLoRA + FSDP2 时将 `bnb_4bit_quant_storage` 设为浮点类型（如 bf16），否则 4-bit 权重会被整体排除在分片外（源码 L700-705 的 warning 即为此场景）。

---

## Related

- [[概念/fsdp]] — FSDP 概念卡片
- [[概念/distributed-training]] — 分布式训练
- [[概念/deepspeed]] — DeepSpeed
- [[概念/megatron-lm]] — Megatron-LM
- [[07_模型训练/04_分布式训练/02_DeepSpeed_深入分析]] — DeepSpeed 深度解析
- [[07_模型训练/04_分布式训练/08_Megatron_LM_深入分析]] — Megatron-LM 深度解析
