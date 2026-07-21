---
title: "Gradient Checkpointing"
category: -concepts
tags: ["training", "llm", "memory-optimization", "gpu", "alibaba-cloud"]
summary: "Gradient Checkpointing（梯度检查点）是一种以计算换显存的技术：只保存部分中间激活值，反向传播时重新计算其余部分，从而显著降低训练显存占用。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "梯度检查点"
  - "Activation Checkpointing"
relationships:
  - target: "概念/Training/distributed-training"
    type: complements
  - target: "概念/Training/lora-peft"
    type: related_to
sources:
  - "https://arxiv.org/abs/1604.06174"  # Training Deep Nets with Sublinear Memory
---

# Gradient Checkpointing

> **一句话理解**: Gradient Checkpointing 是训练大模型时的「以时间换空间」技巧——少保存一些中间结果，反向传播时再算一遍，从而省出大量显存。

## 核心原理

### 问题背景

训练神经网络时，前向传播产生的中间激活值（activations）需要保存以供反向传播计算梯度。对于 L 层的网络，激活值显存占用为 O(L)，当模型很深或 batch size 很大时，激活值可能占据大部分显存。

### 解决方案

```
正常训练：
  前向：保存所有层的激活值 → 显存 O(L)
  反向：直接用保存的激活值计算梯度

Gradient Checkpointing：
  前向：只保存“检查点”层的激活值 → 显存 O(√L)
  反向：遇到未保存的层，从最近检查点重新前向计算
```

### 显存 vs 计算权衡

| 策略 | 激活值显存 | 额外计算 | 总训练时间 |
|------|------------|----------|------------|
| 无检查点 | O(L) | 0 | 基准 |
| 每层检查点 | O(√L) | ~33% | +20-30% |
| 全检查点 | O(1) | ~100% | +50-80% |

## 使用示例

### HuggingFace Transformers

```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2-7B-Instruct")
model.gradient_checkpointing_enable()

# 配合 LoRA 微调
from peft import LoraConfig, get_peft_model

peft_config = LoraConfig(r=16, lora_alpha=32, target_modules="all-linear")
model = get_peft_model(model, peft_config)
# 7B 模型在单张 24GB GPU 上可微调
```

### PyTorch 原生

```python
import torch.utils.checkpoint as checkpoint

class TransformerBlock(nn.Module):
    def forward(self, x):
        # 对注意力层使用检查点
        x = x + checkpoint.checkpoint(
            self.attention, x, use_reentrant=False
        )
        x = x + self.ffn(x)
        return x
```

### DeepSpeed 配置

```json
{
  "activation_checkpointing": {
    "partition_activations": true,
    "contiguous_memory_optimization": true,
    "number_checkpoints": 24
  }
}
```

## 与其他显存优化技术的对比

| 技术 | 省什么 | 代价 | 适用 |
|------|--------|------|------|
| **Gradient Checkpointing** | 激活值显存 | 计算时间 +20-30% | 单卡/多卡 |
| **ZeRO-2/3** | 优化器状态/参数分片 | 通信开销 | 多卡 |
| **量化训练 (QLoRA)** | 权重显存 | 精度 | 微调 |
| **混合精度 (BF16)** | 所有张量显存 | 数值稳定性 | 通用 |
| **Offloading** | 全部显存 | CPU↔GPU 传输 | 极端受限 |

## 实践建议

1. **默认开启**：微调 7B+ 模型时建议始终开启
2. **配合 LoRA/QLoRA**：三者组合可在 24GB GPU 上微调 70B 模型
3. **检查点粒度**：通常每 2-4 层设一个检查点即可
4. **注意 use_reentrant=False**：PyTorch 2.0+ 推荐非重入模式，兼容性更好
5. **与 Flash Attention 配合**：Flash Attention 已内置激活值重计算，无需额外检查点

## 典型场景显存估算

| 模型 | 无检查点 | 有检查点 | 节省 |
|------|----------|----------|------|
| 7B (seq=2048) | ~60GB | ~35GB | 42% |
| 13B (seq=2048) | ~100GB | ~60GB | 40% |
| 70B (seq=4096) | ~400GB | ~250GB | 38% |

## Related

- [[概念/Training/distributed-training|分布式训练]] — 多卡并行训练
- [[概念/Training/lora-peft|LoRA / PEFT]] — 参数高效微调
- [[概念/Training/qlora|QLoRA]] — 量化 + LoRA
- [[概念/Training/deepspeed|DeepSpeed]] — 分布式训练框架
- [[概念/LLM/llm-quantization|LLM 量化]] — 推理时显存优化
- [[运维/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
