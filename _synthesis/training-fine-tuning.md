---
title: 模型训练 × 微调技术
category: -synthesis
tags: ["model-training", "fine-tuning", "lora", "deepspeed", "fsdp", "optimization", "peft"]
sources: [_concepts/model-training.md, _concepts/fine-tuning-techniques.md]
created: 2026-05-31T21:30:00+08:00
updated: 2026-05-31T21:30:00+08:00
summary: "从预训练到对齐的完整闭环：分布式训练解决规模问题，参数高效微调（LoRA/QLoRA/DoRA）解决适配问题，RLHF/DPO 解决价值观问题。"
provenance:
  extracted: 0.35
  inferred: 0.55
  ambiguous: 0.1
base_confidence: 0.72
lifecycle: draft
lifecycle_changed: 2026-05-31
---

# 模型训练 × 微调技术

## The Connection

大模型的能力不是单一阶段产生的，而是**预训练 → 微调 → 对齐**三阶段叠加的结果。预训练（由 [[_concepts/model-training]] 涵盖）赋予模型语言和世界知识；微调（由 [[_concepts/fine-tuning-techniques]] 涵盖）将通用能力聚焦到特定任务或领域；对齐（RLHF/DPO）则塑造模型的行为边界。三者共享同一个底层基础设施（分布式并行、混合精度、梯度优化），但目标函数和优化策略截然不同。

## Where They Co-occur

- LoRA/QLoRA 等 PEFT 方法必须在预训练完成后的模型权重上操作
- DeepSpeed ZeRO 和 FSDP 既用于预训练，也常用于全参数微调阶段
- RLHF 的奖励模型训练本质上是一个小型监督学习过程，依赖与预训练相同的优化器栈

## Cross-cutting Insight

> **微调不是训练的"轻量版"，而是训练的"方向修正版"。**

预训练的损失曲面（loss landscape）极其平缓，微调则是在特定任务方向的"局部陡峭化"。LoRA 的低秩假设之所以有效，正是因为预训练已经学到了通用的低维流形（low-dimensional manifold），微调只需要在该流形内做微小偏移。这解释了为什么 0.1% 的参数更新就能产生显著的领域适配效果。

## Tensions and Trade-offs

- **全参数微调 vs PEFT**：全参数在数据充足时上限更高，但灾难性遗忘更严重；LoRA 保留通用能力，但在复杂任务上可能欠拟合
- **SFT vs RLHF**：SFT（监督微调）让模型"会说人话"，RLHF 让模型"说正确的话"，但 RLHF 的训练不稳定性和奖励黑客（reward hacking）是持续挑战
- **量化与微调**：QLoRA 的 4-bit 量化在消费级 GPU 上可行，但量化误差对精细对齐任务的影响尚未完全量化

## Open Questions

- DoRA（权重分解低秩适配）是否能在精度上系统性地超越 LoRA？
- 直接偏好优化（DPO）能否完全替代 PPO-based RLHF，还是只能在特定规模下生效？
- 持续学习（continual learning）能否解决多轮微调后的灾难性遗忘？

## Related

- [[07_Model_Training/Distributed_Training/Distributed_Training_2026]] — Distributed Training 2026 (共享: fsdp, optimization)
- [[07_Model_Training/Distributed_Training/Distributed_Training_for_dummy]] — 分布式训练 - 小白版 (共享: fsdp, optimization)
- [[07_Model_Training/Optimization/Mixed_Precision_Training]] — 混合精度训练 (Mixed Precision Training) (共享: fsdp, optimization)
