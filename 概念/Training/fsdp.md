---
title: "FSDP (Fully Sharded Data Parallel)"
category: -concepts
tags: ["fsdp", "pytorch", "distributed-training", "zero", "sharding", "llm", "training"]
relationships:
  - target: "概念/distributed-training"
    type: extends
  - target: "概念/deepspeed"
    type: related_to
  - target: "概念/megatron-lm"
    type: related_to
  - target: "概念/pytorch"
    type: implements
sources:
  - 07_模型训练/04_Distributed_Training/FSDP_Deep_Dive.md
summary: "FSDP 是 PyTorch 原生的全分片数据并行框架，相当于 PyTorch 内置的 ZeRO-3，通过分片参数、梯度和优化器状态到多 GPU，实现大模型训练。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-25
aliases:
  - Fsdp

---
# FSDP (Fully Sharded Data Parallel)

> PyTorch 原生的「大模型训练利器」——把模型参数、梯度、优化器状态分片到多 GPU。

---

## 1. 一句话定义

**FSDP**（Fully Sharded Data Parallel）是 PyTorch 原生的分布式训练框架，相当于 PyTorch 内置的 **ZeRO-3**。它把模型的参数、梯度和优化器状态分片到多个 GPU/节点，让 PyTorch 项目能以最小改动训练更大模型。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **参数分片** | 模型参数按层分片到不同 rank |
| **梯度分片** | all-reduce 改成 reduce-scatter |
| **优化器状态分片** | 每个 rank 只保存部分优化器状态 |
| **自动包装** | `auto_wrap_policy` 自动决定分片粒度 |
| **混合精度** | 原生支持 AMP FP16/BF16 |
| **CPU Offload** | 参数/优化器状态可 offload 到 CPU |
| **检查点** | 支持 ShardedStateDict、FullStateDict |

---

## 3. FSDP vs DDP vs DeepSpeed ZeRO

| 特性 | DDP | FSDP | DeepSpeed ZeRO-3 |
|------|-----|------|-----------------|
| 参数复制 | 每 rank 完整 | 分片 | 分片 |
| 学习曲线 | 低 | 中 | 高 |
| 灵活性 | 中 | 高 | 中 |
| 生态集成 | PyTorch 原生 | PyTorch 原生 | HuggingFace 集成好 |
| 最佳场景 | 中小模型 | PyTorch 大模型 | 超大规模/Offload |

---

## 4. 典型场景

1. **PyTorch 大模型微调**：7B/13B/70B 模型 LoRA/全参数微调。
2. **多节点训练**：AWS/GCP/Azure 上的标准分布式训练。
3. **与 HuggingFace 集成**：`Trainer` 直接支持 FSDP。
4. **替代 DDP**：模型太大放不进单卡时。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **PyTorch DDP** | FSDP 是 DDP 的扩展 |
| **DeepSpeed ZeRO** | 功能类似，FSDP 更原生 |
| **Megatron-LM** | Megatron 做 TP/PP，FSDP 做 DP |
| **HuggingFace Trainer** | 原生支持 FSDP |
| **TorchTitan** | Meta 基于 FSDP 的大模型训练框架 |

---

## 6. 优势与局限

### 优势
- PyTorch 原生，与生态无缝集成。
- 代码改动小，从 DDP 迁移容易。
- 灵活性高，可定制 wrapping 策略。

### 局限
- 超大规模场景（千亿+）通常需结合 TP/PP。
- CPU Offload 通信开销大。
- 调试难度高于 DDP。

---

## Related

- [[07_模型训练/04_Distributed_Training/FSDP_Deep_Dive]] — FSDP 深度解析
- [[概念/distributed-training]] — 分布式训练
- [[概念/deepspeed]] — DeepSpeed
- [[概念/megatron-lm]] — Megatron-LM
- [[概念/pytorch]] — PyTorch
- [[概念/training-cost-optimization]] — 训练成本优化

---

## 2026 FSDP 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **FSDP2** | PyTorch 2.x 新版 API，更灵活 | GA |
| **DTensor 集成** | 分布式张量抽象 | GA |
| **混合分片** | 节点内 Full Shard + 节点间 Replicate | GA |
| **激活检查点** | 显存优化 | GA |

## 生产最佳实践

1. **分片策略**：节点内 FULL_SHARD，节点间 HYBRID_SHARD 平衡通信
2. **激活检查点**：显存受限时启用，牺牲 ~20% 计算换显存
3. **与 DeepSpeed 对比**：PyTorch 生态优先用 FSDP，复杂场景用 DeepSpeed
4. **混合精度**：BF16 训练 + FP32 优化器状态
5. **监控指标**：关注通信/计算比、显存峰值、step time

## 2026 FSDP 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| FSDP1 | ✅ | PyTorch 原生 | ✅ 成熟 |
| FSDP2 | ✅ | 重构版 | ✅ 前沿 |
| 混合精度 | ✅ | BF16/FP16 | ✅ 主流 |
| 激活检查点 | ✅ | 显存优化 | ✅ 主流 |
| 与 DeepSpeed 互操作 | ✅ | 灵活选择 | ✅ 成熟 |

## 检查清单

- [ ] 分片策略已配置（FULL_SHARD/SHARD_GRAD_OP）
- [ ] 混合精度已启用
- [ ] 激活检查点已启用
- [ ] 通信优化已配置
- [ ] 监控已接入
- [ ] 与 DeepSpeed 已对比

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 显存 OOM | 分片不够 | 启用 FULL_SHARD |
| 通信瓶颈 | 带宽不足 | 优化通信重叠 |
| 训练慢 | 未重叠通信 | 配置通信重叠 |
| 收敛差 | 学习率不当 | 调优 lr + warmup |

## 延伸阅读

- [[概念/Training/deepspeed|DeepSpeed]] — 微软训练框架
- [[概念/Training/megatron-lm|Megatron-LM]] — NVIDIA 分布式框架
- [[概念/Training/mixed-precision|Mixed Precision]] — 混合精度
- [[概念/Training/gradient-checkpointing|Gradient Checkpointing]] — 梯度检查点
- [[概念/GPU/model-parallelism|Model Parallelism]] — 模型并行

> ℹ️ FSDP 是 2026 年 PyTorch 生态的分布式训练标配，与 DeepSpeed 功能对标，PyTorch 原生集成更简洁。

## FSDP vs DeepSpeed

| 特性 | FSDP | DeepSpeed ZeRO |
|------|------|------|
| 框架 | PyTorch 原生 | 第三方库 |
| 配置 | Python API | JSON 配置 |
| 分片策略 | FULL/SHARD/NO | Stage 1/2/3 |
| CPU Offload | ✅ | ✅ |
| 混合精度 | ✅ | ✅ |
| 生态集成 | HF/原生 | HF/原生 |
| 学习曲线 | 低 | 中 |

## FSDP 配置示例

```python
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp import ShardingStrategy, MixedPrecision

# FSDP 配置
fsdp_config = {
    "sharding_strategy": ShardingStrategy.FULL_SHARD,
    "mixed_precision": MixedPrecision(
        param_dtype=torch.bfloat16,
        reduce_dtype=torch.bfloat16,
        buffer_dtype=torch.bfloat16,
    ),
    "cpu_offload": False,
    "backward_prefetch": True,
    "limit_all_gathers": True,
}

model = FSDP(model, **fsdp_config)
```

## 显存优化对比

| 模型 | 单卡 | DDP | FSDP | 节省 |
|------|------|------|------|------|
| 7B | 56 GB | 56 GB | 14 GB | 75% |
| 13B | 104 GB | OOM | 26 GB | - |
| 70B | OOM | OOM | 140 GB | - |

## 源码级洞察（Accelerate v1.14.0）

- 工程落地经 HuggingFace Accelerate：`FullyShardedDataParallelPlugin`（`utils/dataclasses.py`）的 `fsdp_version` 字段统一屏蔽 FSDP1（类包装）与 FSDP2（`fully_shard` 函数式 + DTensor）。
- FSDP2 接管流程见 `fsdp2_prepare_model`（`utils/fsdp_utils.py`）：自动包装→DeviceMesh 接入（可组合 TP/CP）→量化参数兼容→fp32 主权重上提。
- 源码归档：`code/llm-frameworks/accelerate-v1.14.0/`，详见 [[07_模型训练/04_Distributed_Training/FSDP_Deep_Dive|FSDP 深度解析]] 第 11 节。
