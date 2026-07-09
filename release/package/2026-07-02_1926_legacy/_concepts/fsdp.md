---
title: "FSDP (Fully Sharded Data Parallel)"
category: -concepts
tags: ["fsdp", "pytorch", "distributed-training", "zero", "sharding", "llm", "training"]
relationships:
  - target: "_concepts/distributed-training"
    type: extends
  - target: "_concepts/deepspeed"
    type: related_to
  - target: "_concepts/megatron-lm"
    type: related_to
  - target: "_concepts/pytorch"
    type: implements
sources:
  - 模型训练/Distributed_Training/FSDP_Deep_Dive.md
summary: "FSDP 是 PyTorch 原生的全分片数据并行框架，相当于 PyTorch 内置的 ZeRO-3，通过分片参数、梯度和优化器状态到多 GPU，实现大模型训练。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
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

- [[模型训练/Distributed_Training/FSDP_Deep_Dive]] — FSDP 深度解析
- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/deepspeed]] — DeepSpeed
- [[_concepts/megatron-lm]] — Megatron-LM
- [[_concepts/pytorch]] — PyTorch
