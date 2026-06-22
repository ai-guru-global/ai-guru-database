---
title: "RS-LoRA"
category: -concepts
tags: ["lora", "rs-lora", "peft", "fine-tuning", "parameter-efficient", "rank"]
relationships:
  - target: "_concepts/lora-peft"
    type: improves_upon
  - target: "_concepts/dora"
    type: related_to
  - target: "_concepts/fine-tuning-techniques"
    type: belongs_to
sources:
  - 05_NLP_LLMs/Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail.md
  - 05_NLP_LLMs/Fine_tuning_Techniques/README.md
summary: "RS-LoRA（Rank-Stabilized LoRA）是 LoRA 的变体，通过按 rank 的平方根缩放学习率，让小 rank 也能稳定学习。简单说：它让‘很少的参数’发挥出‘很多参数’的学习能力。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.78
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# RS-LoRA

## 核心要点

- **RS-LoRA = Rank-Stabilized LoRA**，重点解决 LoRA 在小 rank 时不稳定、效果差的问题。
- **核心 trick**：把 LoRA 的缩放因子 α 从固定值改为与 rank r 相关，并按 √r 缩放学习率。
- **效果**：在 rank 很小（如 r=1, 2, 4）时，RS-LoRA 仍能有效学习，显存占用更低。
- **适合场景**：端侧/边缘设备、超大模型、显存极其紧张时的微调。

## 一句话理解

RS-LoRA 就像给近视眼配了一副‘自动变焦眼镜’：即使镜片很小（rank 低），也能通过特殊调校看清远处细节。

## 详细内容

### LoRA 的缩放因子

LoRA 的更新量通常要乘以 α/r：

```
W = W₀ + (α/r) × BA
```

- α 是超参，常见设置 α=16 或 α=r。
- 当 r 很小时，α/r 可能过大，导致训练不稳定；固定 α 又限制小 rank 的学习能力。

### RS-LoRA 的改进

RS-LoRA 提出把缩放因子改为：

```
缩放 = α / √r
```

同时按 √r 调整学习率。这样：
- rank 越小，单步更新幅度越受控。
- 整体梯度更新保持与 rank 无关的稳定尺度。

### 直观类比

想象用不同粗细的笔画一幅画：
- **LoRA**：画笔固定，画布小时（rank 低）容易涂出边界。
- **RS-LoRA**：画笔自动变细，画布再小也能精细作画。

### RS-LoRA vs LoRA vs DoRA

| 方法 | 解决什么问题 | 适合场景 |
|------|--------------|----------|
| **LoRA** | 通用低秩微调 | rank 中等（8-64），资源充足 |
| **RS-LoRA** | 极小 rank 不稳定 | rank ≤ 8，显存极度受限 |
| **DoRA** | 方向更新不稳定 | 希望接近全量微调效果 |

### 实践建议

- 如果显存非常紧张，先用 RS-LoRA 把 rank 压到 1-4。
- 如果追求效果，DoRA + 中等 rank 更稳。
- RS-LoRA 和 DoRA 可以组合，但需调整超参。

## 开放问题

- RS-LoRA 在不同任务（代码、数学、多语言）上的最优 rank 范围。
- 与 4-bit/8-bit 量化结合的数值稳定性。
- 如何与 MoE、长上下文模型有效配合。

## Related

- [[_concepts/lora-peft]] — LoRA 与参数高效微调
- [[_concepts/dora]] — DoRA
- [[_concepts/fine-tuning-techniques]] — 微调技术
- [[05_NLP_LLMs/Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail]] — LoRA/QLoRA/SFT/RLHF/DPO 详解
