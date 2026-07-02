---
title: "DeepSpeed"
category: -concepts
tags: ["deepspeed", "microsoft", "distributed-training", "zero", "parallelism", "inference", "optimization", "moe"]
relationships:
  - target: "_concepts/distributed-training"
    type: extends
  - target: "_concepts/megatron-lm"
    type: related_to
  - target: "_concepts/fsdp"
    type: related_to
  - target: "_concepts/hami"
    type: related_to
  - target: "_concepts/ray"
    type: related_to
sources:
  - 07_Model_Training/Distributed_Training/DeepSpeed_Deep_Dive.md
summary: "DeepSpeed 是微软开源的深度学习训练与推理优化库，以 ZeRO 显存优化、DeepSpeed-Inference、MoE 训练和 ZeRO-Inference 著称，广泛用于千亿参数大模型的预训练与微调。"
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
  - Deepspeed

---
# DeepSpeed

> 微软出品的「大模型训练加速器」——用 ZeRO 优化把千亿参数模型塞进有限 GPU。

---

## 1. 一句话定义

**DeepSpeed** 是微软开源的深度学习训练与推理优化库，核心特性包括 **ZeRO（Zero Redundancy Optimizer）** 显存优化、DeepSpeed-Inference 高吞吐推理、MoE（Mixture of Experts）训练、Offloading 和稀疏注意力等。它让研究者用更少的 GPU 训练更大的模型。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **ZeRO** | 把优化器状态、梯度、参数分片到多卡/多节点，消除冗余 |
| **ZeRO-Offload** | 把优化器状态/计算卸载到 CPU/NVMe |
| **ZeRO-Infinity** | 支持 NVMe 扩展，训练万亿参数模型 |
| **DeepSpeed-Inference** | 推理阶段的多 GPU 并行与量化 |
| **MoE** | 专家混合模型训练 |
| **Sparse Attention** | 长序列注意力优化 |
| **Pipeline Parallelism** | 与 Megatron-LM 集成 |
| **1-bit Adam / LAMB** | 通信压缩优化器 |

---

## 3. ZeRO 三个阶段

| 阶段 | 分片内容 | 显存节省 |
|------|---------|---------|
| **ZeRO-1** | 优化器状态分片 | 4x |
| **ZeRO-2** | 优化器状态 + 梯度分片 | 8x |
| **ZeRO-3** | 优化器状态 + 梯度 + 参数分片 | 与数据并行度线性相关 |

```
Data Parallel Group
  ├── GPU 0: optimizer_state_shard_0 + gradient_shard_0 + param_shard_0
  ├── GPU 1: optimizer_state_shard_1 + gradient_shard_1 + param_shard_1
  └── GPU N: ...
```

---

## 4. 典型场景

1. **千亿参数预训练**：ZeRO-3 + ZeRO-Infinity 扩展。
2. **单卡微调大模型**：ZeRO-Offload 把优化器状态放 CPU。
3. **低资源实验室**：用 1-2 张卡微调 7B/13B 模型。
4. **高吞吐推理服务**：DeepSpeed-Inference 多卡并行。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **PyTorch FSDP** | PyTorch 原生 ZeRO-3 类似实现 |
| **Megatron-LM** | 张量并行/流水线并行，常与 DeepSpeed 结合 |
| **Ray Train** | 可封装 DeepSpeed 分布式训练 |
| **HuggingFace Transformers** | 集成 `deepspeed` 参数，原生支持 |
| **HAMi** | DeepSpeed 训练任务可申请 HAMi vGPU |

---

## 6. 优势与局限

### 优势
- 极大降低大模型训练显存门槛。
- 与 HuggingFace 生态集成良好。
- 支持推理优化和 MoE。

### 局限
- 配置复杂，JSON 配置项多。
- 调试难度大，通信问题定位困难。
- 极致性能通常需结合 Megatron-LM。

---

## Related

- [[07_Model_Training/Distributed_Training/DeepSpeed_Deep_Dive]] — DeepSpeed 深度解析
- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/fsdp]] — PyTorch FSDP
- [[_concepts/megatron-lm]] — Megatron-LM
- [[_concepts/hami]] — HAMi GPU 虚拟化
- [[_concepts/ray]] — Ray 分布式框架
