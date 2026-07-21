---
title: "rsLoRA 秩稳定 LoRA (Rank-Stabilized LoRA)"
category: -concepts
tags: ["rslora", "lora", "fine-tuning", "rank-stabilization", "scaling"]
relationships:
  - target: "概念/lora-peft"
    type: related_to
  - target: "概念/peft"
    type: related_to
  - target: "概念/pissa"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "rsLoRA 通过修改 LoRA 的缩放因子为 1/√r 解决高秩时效果退化的问题——让 LoRA 在 rank 增大时保持稳定的训练表现。简单一行配置改动即可生效。"
provenance:
  extracted: 0.15
  inferred: 0.75
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: supporting
updated: 2026-07-21
aliases:
  - "RS-LoRA"
  - "Rs Lora"
  - "rs lora"
---

# rsLoRA 秩稳定 LoRA

> **一句话理解**: rsLoRA 是"LoRA 的高秩补丁"——把缩放因子从 α/r 改为 α/√r，让 LoRA 在 rank 增大时不再退化。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **全称** | Rank-Stabilized LoRA |
| **论文** | "LoRA Meets Dropout under a Unified Framework" (2024) |
| **核心改动** | 缩放因子 α/r → α/√r |
| **解决的问题** | 高 rank 时 LoRA 效果退化 |
| **改动量** | 一行代码 |

---

## 2. 问题分析

### 标准 LoRA 的问题

```
标准 LoRA 缩放:
  ΔW = (α/r) · B · A

问题: 当 rank r 增大时:
  - B·A 的范数 ∝ r (随 r 线性增长)
  - 但缩放因子 α/r ∝ 1/r (随 r 线性减小)
  - 两者乘积理论上应保持稳定
  
实际上:
  - 训练初期 B·A 的范数 < r (还没学好)
  - 缩放因子已经 1/r 压得很小
  - 导致梯度信号弱，学习困难
  - 高 rank 时效果反而不如低 rank！
```

### rsLoRA 的修复

```
rsLoRA 缩放:
  ΔW = (α/√r) · B · A

为什么有效:
  - B·A 的范数 ∝ √r (随机矩阵理论)
  - 缩放因子 α/√r ∝ 1/√r
  - 乘积 ∝ √r · 1/√r = 常数 (稳定！)
  - 无论 rank 多大，ΔW 的范数保持稳定
```

---

## 3. 对比实验

### Llama-3-8B 微调

| Rank (r) | 标准 LoRA | rsLoRA | 提升 |
|:---:|:---:|:---:|:---:|
| 8 | 基准 | 基准 | ~0% |
| 16 | 基准 | +0.2% | 小 |
| 32 | -0.3% | +0.5% | 中 |
| 64 | -0.8% | +0.8% | 显著 |
| 128 | -1.5% | +1.0% | 很大 |
| 256 | -2.5% | +1.2% | 极大 |

**关键发现**: 标准 LoRA 在 r>32 后开始退化，rsLoRA 持续提升

---

## 4. 使用方法

```python
from peft import LoraConfig, get_peft_model

# 标准 LoRA
config_standard = LoraConfig(
    r=64,
    lora_alpha=128,
    lora_dropout=0.05,
    # 使用默认的缩放方式
)

# rsLoRA (HuggingFace PEFT 已支持)
config_rslora = LoraConfig(
    r=64,
    lora_alpha=128,
    lora_dropout=0.05,
    use_rslora=True,  # ← 一行开启 rsLoRA
)

model = get_peft_model(base_model, config_rslora)
```

### 何时使用 rsLoRA

| 场景 | 推荐 |
|------|------|
| r ≤ 16 | 标准 LoRA 即可 |
| r = 32-64 | 推荐 rsLoRA |
| r ≥ 128 | **必须** rsLoRA |
| 不确定 rank | 推荐 rsLoRA (无负面影响) |

---

## 5. 与其他 LoRA 变体关系

```
┌─────────────────────────────────────────┐
│         LoRA 变体分类                   │
├─────────────────────────────────────────┤
│                                         │
│  初始化改进:                            │
│    PiSSA ← SVD 初始化                  │
│                                         │
│  缩放改进:                              │
│    rsLoRA ← √r 缩放 ★ 本文           │
│                                         │
│  结构改进:                              │
│    DoRA  ← 权重/方向解耦               │
│    AdaLoRA ← 自适应秩                  │
│                                         │
│  训练策略改进:                          │
│    LoRA+ ← 差异化学习率               │
│                                         │
│  这些改进可以组合使用！                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. 关键要点

1. **改动极小**：仅将缩放因子从 α/r 改为 α/√r，一行配置
2. **高秩时关键**：rank 越大，rsLoRA 的优势越明显
3. **无负面影响**：低 rank 时与标准 LoRA 效果相当，不会变差
4. **PEFT 已集成**：`use_rslora=True` 即可使用
5. **可组合**：可以和 PiSSA、DoRA 等其他改进叠加使用
6. **理论支撑**：基于随机矩阵理论，缩放与范数增长匹配

---

## Related

- [[概念/lora-peft]] — LoRA 与参数高效微调
- [[概念/peft]] — PEFT 库
- [[概念/pissa]] — PiSSA 奇异值适配
- [[概念/qlora]] — QLoRA 量化微调

## 2026 rsLoRA 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **PEFT 集成** | `use_rslora=True` 即可使用 | GA |
| **与 DoRA 组合** | rsLoRA + DoRA 叠加 | 实验性 |
| **高 rank 优化** | rank > 32 时效果显著 | GA |

## 生产最佳实践

1. **启用时机**：rank > 32 时建议启用 rsLoRA
2. **配置简单**：仅需设置 `use_rslora=True`
3. **无负面影响**：低 rank 时与标准 LoRA 效果相当
4. **可组合**：与 PiSSA、DoRA 等方法叠加使用
5. **适用场景**：追求高 rank 稳定训练时优先选择
