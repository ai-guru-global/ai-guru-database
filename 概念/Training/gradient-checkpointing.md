---
title: "Gradient Checkpointing"
category: -concepts
tags: ["training", "llm", "memory-optimization", "gpu", "alibaba-cloud"]
summary: "Gradient Checkpointing（梯度检查点）是一种以计算换显存的技术：只保存部分中间激活值，反向传播时重新计算其余部分，从而显著降低训练显存占用。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "梯度检查点"
  - "Activation Checkpointing"
relationships:
  - target: "概念/gpu-oom"
    type: mitigates
  - target: "概念/deepspeed"
    type: related_to
  - target: "概念/lora-peft"
    type: related_to
sources: []
---

# Gradient Checkpointing

> **一句话理解**: Gradient Checkpointing 是训练大模型时的「以时间换空间」技巧——少保存一些中间结果，反向传播时再算一遍，从而省出大量显存。

## 核心要点

- **节省显存**: 可将激活值显存占用从 O(L) 降到 O(√L) 或 O(1)。
- **增加计算**: 反向传播时需要重新前向计算，训练时间增加约 20-30%。
- **适用场景**: 大模型微调、长序列训练、显存受限场景。
- **框架支持**: PyTorch `torch.utils.checkpoint`、Hugging Face `gradient_checkpointing_enable()`、DeepSpeed。

## 使用示例

```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2-7B-Instruct")
model.gradient_checkpointing_enable()
```

## 与 ZeRO 的对比

| 技术 | 省什么 | 代价 | 适用 |
|------|--------|------|------|
| Gradient Checkpointing | 激活值显存 | 计算时间 | 单卡/多卡 |
| ZeRO-2/3 | 优化器状态/参数分片 | 通信 | 多卡 |
| 量化训练 (QLoRA) | 权重显存 | 精度 | 微调 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，微调任务遇到 CUDA OOM 时，开启 `gradient_checkpointing=True` 是最常用的缓解手段之一，配合 LoRA/QLoRA 可在较小 GPU 上训练更大模型。

## Related

- [[概念/gpu-oom|GPU OOM]]
- [[概念/deepspeed|DeepSpeed]]
- [[概念/lora-peft|LoRA / PEFT]]
- [[概念/qlora|QLoRA]]
- [[运维/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
