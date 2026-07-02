---
title: "DoRA"
category: -concepts
tags: ["lora", "dora", "peft", "fine-tuning", "parameter-efficient"]
relationships:
  - target: "_concepts/lora-peft"
    type: improves_upon
  - target: "_concepts/fine-tuning-techniques"
    type: belongs_to
  - target: "_concepts/quantization"
    type: complements
sources:
  - 05_NLP_LLMs/Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail.md
  - 05_NLP_LLMs/Fine_tuning_Techniques/README.md
  - _concepts/lora-peft.md
summary: "DoRA（Weight-Decomposed Low-Rank Adaptation）是 LoRA 的升级版。它把模型权重拆成‘方向’和‘大小’两部分，只微调方向部分，让低秩微调更稳定、更接近全量微调的效果。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Dora

---
# DoRA

## 核心要点

- **DoRA 是 LoRA 的改进版**，全称 Weight-Decomposed Low-Rank Adaptation。
- **核心思想**：把权重矩阵 W 分解为**幅度（magnitude）**和**方向（direction）**两个部分。
- **LoRA 的问题**：直接学一个低秩增量 ΔW，方向更新可能和原始权重耦合，影响稳定性。
- **DoRA 的做法**：固定幅度，只学方向上的低秩变化，数学上更优雅，实验效果通常更好。

## 一句话理解

DoRA 就像给汽车调方向盘：LoRA 是连方向盘和油门一起改，DoRA 是只调方向盘的角度，让转弯更精准、不容易失控。

## 详细内容

### LoRA 回顾

LoRA 微调时，原始权重 W₀ 冻结，只训练两个低秩矩阵 B 和 A：

```
W = W₀ + ΔW = W₀ + BA
```

这样参数量只有原来的 0.1%-1%。

### DoRA 的分解

DoRA 把 W₀ 先拆成幅度和方向：

```
W₀ = m₀ × (W₀ / ||W₀||) = 幅度 × 单位方向
```

然后微调时：
- **幅度 m₀ 保持不动**
- **方向部分用 LoRA 更新**：W₀/||W₀|| + BA

最终：

```
W = m₀ × (W₀/||W₀|| + BA)
```

### 为什么这样更好？

| 方面 | LoRA | DoRA |
|------|------|------|
| 更新对象 | 直接改 W | 只改方向，不改幅度 |
| 稳定性 | 一般 | 更好 |
| 低秩下的效果 | 有时不如全量微调 | 更接近全量微调 |
| 训练成本 | 低 | 略高（需计算幅度归一化） |

### 适用场景

- **小 rank（如 r=8）** 时，DoRA 比 LoRA 优势明显。
- **需要接近全量微调效果**，但显存/算力有限。
- **QLoRA 场景**：4-bit 量化 + DoRA 能在单卡 24GB 上微调 70B 模型。

### 与 RS-LoRA 的关系

DoRA 解决的是“方向更新更稳定”的问题；RS-LoRA 解决的是“rank 很小时学习能力不足”的问题。两者可以叠加使用。

## 开放问题

- DoRA 在不同模型规模/任务上的最优 rank 选择。
- 与 MoE、长上下文模型的兼容性。
- 推理时是否/如何将 DoRA 合并回基座权重。

## Related

- [[_concepts/lora-peft]] — LoRA 与参数高效微调
- [[_concepts/rs-lora]] — RS-LoRA
- [[_concepts/fine-tuning-techniques]] — 微调技术
- [[_concepts/quantization]] — 量化
- [[05_NLP_LLMs/Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail]] — LoRA/QLoRA/SFT/RLHF/DPO 详解
