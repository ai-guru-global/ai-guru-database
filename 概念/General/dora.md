---
title: "DoRA"
category: -concepts
tags: ["lora", "dora", "peft", "fine-tuning", "parameter-efficient"]
relationships:
  - target: "概念/lora-peft"
    type: improves_upon
  - target: "概念/fine-tuning-techniques"
    type: belongs_to
  - target: "概念/quantization"
    type: complements
sources:
  - 05_大模型/07_微调技术/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail.md
  - 05_大模型/07_微调技术/README.md
  - 概念/lora-peft.md
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
updated: 2026-07-21
aliases:
  - Dora

name_zh: "权重分解低秩适配"
---
# DoRA

> 中文简称：权重分解低秩适配

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

- [[概念/lora-peft]] — LoRA 与参数高效微调
- [[概念/rs-lora]] — RS-LoRA
- [[概念/fine-tuning-techniques]] — 微调技术
- [[概念/quantization]] — 量化
- [[05_大模型/07_微调技术/07_LoRA_QLoRA_SFT_RLHF_DPO_in_Detail]] — LoRA/QLoRA/SFT/RLHF/DPO 详解

---

## 2026 DoRA 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **DoRA** | 权重分解低秩适配 | GA |
| **LoRA** | 低秩适配 | GA |
| **QLoRA** | 量化 LoRA | GA |
| **rs-LoRA** | 秩稳定 LoRA | GA |
| **PEFT** | 参数高效微调 | GA |

## 生产最佳实践

1. **DoRA 微调**：大模型微调用 DoRA
2. **与 LoRA 对比**：DoRA 效果优于 LoRA
3. **QLoRA 节省**：显存不足用 QLoRA
4. **秩选择**：根据任务选择合适秩
5. **与全量微调对比**：根据场景选择微调方法

## DoRA 配置示例

```python
from peft import LoraConfig, get_peft_model

# DoRA 配置
config = LoraConfig(
    r=64,                    # 秩
    lora_alpha=128,          # 缩放因子
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    use_dora=True,           # 启用 DoRA
    task_type="CAUSAL_LM"
)
model = get_peft_model(base_model, config)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 效果不如预期 | 秩太小/目标模块少 | 增大秩、扩展目标模块 |
| 显存不足 | 模型太大 | QLoRA + 4bit 量化 |
| 训练不稳定 | 学习率太高 | 降低 lr、增大 warmup |
| 推理速度慢 | 未合并权重 | merge_and_unload() |
| 与 LoRA 差异小 | 任务简单 | 简单任务用 LoRA 即可 |

## 版本兼容性

| 工具 | 版本 | 说明 |
|------|------|------|
| PEFT | 0.10+ | DoRA 支持 |
| transformers | 4.40+ | 模型加载 |
| bitsandbytes | 0.43+ | QLoRA 量化 |

## 生产检查清单

1. 根据任务复杂度选择 DoRA/LoRA
2. 秩从 64 开始，根据效果调整
3. 显存不足时启用 QLoRA
4. 训练后合并权重提升推理速度
5. 在验证集上评估微调效果
6. 保存适配器便于多任务切换

# 版本兼容性

| 框架/工具 | 最低版本 | DoRA 支持 | 备注 |
|------|------|------|------|
| **PEFT** | ≥ 0.9.0 | ✅ 原生支持 | `use_dora=True` 参数 |
| **transformers** | ≥ 4.38.0 | ✅ 配合 PEFT | 需搭配 PEFT 库 |
| **LLaMA-Factory** | ≥ 0.6.0 | ✅ 内置 | 训练配置 `finetuning_type: dora` |
| **Axolotl** | ≥ 0.4.0 | ✅ 支持 | YAML 配置 `peft: dora` |
| **Unsloth** | ≥ 2024.4 | ✅ 加速支持 | 2x 训练速度提升 |

## 生产检查清单

1. ✅ 确认基座模型权重已正确加载（FP16/BF16）
2. ✅ 设置合理的 rank（推荐 16-64）和 alpha（= 2×rank）
3. ✅ 对比 LoRA 基线确认 DoRA 增益显著
4. ✅ 监控训练显存（DoRA 比 LoRA 多约 10-20%）
5. ✅ 保存适配器权重并记录训练配置
6. ✅ 在目标评估集上验证微调效果

## 总结

DoRA 是 LoRA 的增强版本，通过权重分解实现更接近全量微调的效果，同时保持参数高效。对于追求微调质量且资源有限的场景，DoRA 是最佳选择。

> 💡 DoRA 的核心价值：用 LoRA 的成本获得接近全量微调的效果——是参数高效微调的"质量升级版"。

## 相关概念

- [[概念/Training/lora-peft|lora]] — LoRA 低秩适配
- [[概念/qlora]] — QLoRA 量化微调
- [[概念/peft]] — PEFT 参数高效微调库

