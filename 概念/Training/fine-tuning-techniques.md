---
title: 微调技术
category: -concepts
tags:
- nlp
- fine-tuning
- model-training
- lora
- qlora
- rlhf
- dpo
- peft
- sft
relationships:
- target: '概念/llm-architectures'
  type: applies_to
- target: '概念/prompt-engineering'
  type: alternative_to
- target: '概念/lora-qlora-sft-rlhf-dpo'
  type: related_to
sources:
- 05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques.md
- 05_大模型/07_Fine_tuning_Techniques/PEFT_2026.md
- 05_大模型/07_Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail.md
summary: 微调技术从全参数微调发展到参数高效微调（LoRA/QLoRA/DoRA）和基于人类反馈的对齐（RLHF/DPO）。QLoRA可在单张消费级ai-hardware上微调70B模型，DPO绕过奖励模型简化对齐流程。2026年DoRA、PiSSA等新变体持续提升微调质量。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-05-31 00:00:00+00:00
updated: 2026-07-21
aliases:
  - "Fine Tuning Techniques"
  - "fine tuning techniques"

---
# 微调技术

## 概述

预训练模型学习了通用语言知识，但对特定任务表现不佳。微调通过在目标任务数据上继续训练使模型适应具体场景。优化路径：先优化 Prompt → 不够再加RAG → 还不行再微调。

## 方法分类

```
微调方法
├── 全参数微调（Full FT）— 更新所有参数，显存需求高
├── 参数高效微调（PEFT）— 只训练<1%参数
│   ├── LoRA / QLoRA / DoRA
│   ├── Adapter / Prefix Tuning
│   └── (IA)³ / PiSSA
└── 强化学习对齐（Alignment）
    ├── RLHF (PPO)
    └── DPO / ORPO / KTO
```

## LoRA：低秩适配

冻结预训练权重$W_0$，通过低秩分解矩阵学习增量：$W = W_0 + BA$（$B \in \mathbb{R}^{d \times r}$, $A \in \mathbb{R}^{r \times k}$，$r \ll \min(d,k)$）。

**为什么有效**：微调时权重更新矩阵$\Delta W$的内在秩很低，大部分信息集中在少数主方向。

**推理优化**：可将$W_0 + BA$合并为单个矩阵，无额外计算开销。

**秩r选择**：通用场景从r=8开始（90%场景够用），简单任务r=4，复杂任务r=16-32，r>64很少带来提升。

## QLoRA：4-bit量化+LoRA

NF4量化针对正态分布优化量化表，比标准model-compression精度损失更小。配合双量化和分页优化器，显存需求大幅降低：

| 模型 | 全参数微调 | LoRA | QLoRA |
|------|-----------|------|-------|
| llm-architectures 3 8B | 80GB | 16GB | 6GB |
| Llama 3 70B | 640GB | 160GB | 48GB |

QLoRA使**单张RTX 4090可微调8B模型，单张A100可微调70B模型**。

## 2026年LoRA新变体

### DoRA（Weight-Decomposed LoRA）

将权重分解为幅度和方向，仅微调方向部分。Llama 7B上准确率+3.7%，仅增加0.01%参数。适合质量优先、灾难性遗忘敏感的场景。

### rsLoRA（Rank-Stabilized LoRA）

高rank（>64）LoRA训练不稳定，rsLoRA将alpha设为$r^{0.5}$而非线性缩放，支持rank 100-1000+的稳定训练。

### PiSSA

使用SVD初始化LoRA矩阵，用预训练权重的主奇异值方向初始化，收敛更快、更好地保留原始能力。

### LoftQ

量化感知的LoRA初始化，联合优化量化和LoRA初始化以最小化近似误差，比标准QLoRA质量更好。

## RLHF：基于人类反馈的强化学习

ai-history核心技术，三阶段流程：

1. **SFT**：监督微调，学习高质量示例
2. **奖励模型训练**：人类标注偏好对比（A > B），训练RM预测偏好得分
3. **PPO优化**：RL最大化奖励，同时KL散度惩罚防止偏离SFT

挑战：训练不稳定（RL固有）、需4个模型同时运行、超参数敏感。

## DPO：直接偏好优化

绕过奖励模型，直接优化偏好数据：

$$\mathcal{L}_{DPO} = -\mathbb{E}\left[\log \sigma\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{ref}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{ref}(y_l|x)}\right)\right]$$

| 维度 | RLHF | DPO |
|------|------|-----|
| 流程 | 3阶段，需训练RM | 1阶段，直接优化 |
| 所需模型 | 4个 | 2个 |
| 稳定性 | 不稳定 | 稳定 |
| 显存 | 极高 | 中等 |

其他对齐方法：ORPO（单阶段SFT+偏好优化同步）、KTO（只需二元反馈）、IPO（避免DPO梯度消失）。

## 常见陷阱

1. **灾难性遗忘**：小学习率+混入通用数据+PEFT可缓解
2. **过度对齐**：模型过于谨慎，拒绝正常问题
3. **奖励Hacking**：PPO学会"欺骗"奖励模型
4. **过拟合**：减少epochs、增加dropout、早停

## 关联主题

- LLM架构：微调的对象
- 提示工程：微调的轻量替代方案

## Related

- [[概念/lora-qlora-sft-rlhf-dpo]] — LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲
- [[概念/lora-peft]] — LoRA 与参数高效微调
- [[概念/rlhf]] — 基于人类反馈的强化学习
- [[概念/qlora]] — QLoRA 量化微调
- [[概念/dpo]] — DPO 直接偏好优化
- [[治理/training-fine-tuning]] — 模型训练 × 微调技术

---

## 2026 微调技术选型

| 方法 | 显存需求 | 适用场景 | 效果 |
|------|---------|---------|------|
| **全量微调** | 最高 | 资源充足、追求最佳效果 | ★★★★★ |
| **LoRA** | 中 | 通用微调 | ★★★★ |
| **QLoRA** | 低 | 资源受限、大模型 | ★★★★ |
| **DoRA** | 中 | 追求更好效果 | ★★★★☆ |
| **DPO/RLHF** | 高 | 对齐人类偏好 | ★★★★★ |

## 生产最佳实践

1. **方法选择**：资源充足用全量/LoRA，受限用 QLoRA
2. **数据质量**：高质量数据 > 数据数量
3. **超参调优**：学习率、batch size、epochs 需根据任务调整
4. **评估体系**：建立任务特定评估基准
5. **版本管理**：微调模型纳入版本控制，支持回滚

## 2026 微调技术生态现状

| 技术 | 类型 | 显存节省 | 精度 | 状态 |
|------|------|------|------|------|
| Full Fine-tuning | 全参数 | 0% | 最高 | ✅ 成熟 |
| LoRA | PEFT | 60-80% | 高 | ✅ 主流 |
| QLoRA | 量化 PEFT | 80-90% | 中高 | ✅ 主流 |
| DoRA | PEFT | 60-80% | 高 | ✅ 前沿 |
| Prefix Tuning | PEFT | 70-90% | 中 | ✅ 成熟 |
| Adapter | PEFT | 60-80% | 中高 | ✅ 成熟 |

## 检查清单

- [ ] 微调方法已根据资源和目标选择
- [ ] 数据质量已验证
- [ ] 超参已调优（lr/batch/epochs）
- [ ] 评估基准已建立
- [ ] 模型版本已管理
- [ ] 部署方案已规划

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 过拟合 | 数据少/epochs 多 | 增加数据 + 早停 |
| 效果差 | 学习率不当 | 调优 lr + warmup |
| 显存不足 | 模型太大 | 用 QLoRA 或梯度检查点 |
| 灾难性遗忘 | 全参数微调 | 用 PEFT 或混合数据 |

## 延伸阅读

- [[概念/Training/qlora|QLoRA]] — 量化 LoRA
- [[概念/Training/pissa|PiSSA]] — 奇异值初始化
- [[概念/Training/rslora|rsLoRA]] — 稳定 LoRA
- [[概念/Training/pre-training|Pre-training]] — 预训练
- [[概念/LLM/lora|LoRA]] — 低秩适配

> ℹ️ 微调技术选型：资源充足用 Full FT，资源受限用 QLoRA，追求效果用 DoRA+PiSSA，始终配合评估和版本管理。
