---
title: "ORPO（Odds Ratio Preference Optimization）"
category: -concepts
tags: [orpo, alignment, sft, dpo, preference-learning, single-stage]
aliases:
  - "ORPO"
  - "Odds Ratio Preference Optimization"
  - "几率比偏好优化"
relationships:
  - target: "概念/dpo"
    type: alternative
  - target: "概念/sft"
    type: integrates_with
  - target: "概念/rlhf"
    type: belongs_to
sources:
  - 07_模型训练/06_对齐研究/
summary: "ORPO 将 SFT 与偏好对齐统一为单阶段训练，无需参考模型即可获得比 DPO 更好的对齐效果，是 2024 年轻量级对齐的代表性方法。"
lifecycle: reviewed
tier: supporting
updated: 2026-07-21
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
name_zh: "比值比偏好优化"
---

# ORPO（Odds Ratio Preference Optimization）

> 中文简称：比值比偏好优化

## 核心要点

- **提出**：Hong et al., 2024-03（论文 "ORPO: Monolithic Preference Optimization without Reference Model"）
- **核心创新**：把 **SFT + DPO 融合为单一阶段**的偏好对齐算法，**无需参考模型**。
- **核心优势**：
  - 单阶段（无需先 SFT 再 DPO）
  - 无需参考模型（节省显存）
  - 比 DPO 更稳定、效果更好
  - 训练效率提升 ~30%
- **Loss 组成**：
  - **SFT loss**：标准交叉熵（教模型生成）
  - **Odds Ratio loss**：偏好对齐（拉大 chosen vs rejected）

## 一句话解释

> ORPO = "SFT + DPO 一步到位"；不分两个阶段，一次训练同时学会生成 + 对齐偏好，省时省力。

## 与其他对齐方法对比

| 方法 | 阶段 | 参考模型 | 显存 | 训练效率 | 效果 |
|------|------|---------|------|---------|------|
| **PPO** | 2 (SFT → PPO) | Reward Model + Ref | 高 | 低 | 强 |
| **DPO** | 2 (SFT → DPO) | Ref Policy | 中 | 中 | 强 |
| **KTO** | 1.5 (SFT + KTO) | Ref Policy | 中 | 中 | 中 |
| **ORPO** | **1** | **无** | **低** | **高** | **强** |
| **SimPO** | 2 (SFT → SimPO) | 无 | 低 | 中 | 中-强 |

## 关键公式

```python
# ORPO Loss = SFT Loss + Odds Ratio Loss
def orpo_loss(policy_chosen_logps, policy_rejected_logps,
              chosen_input_ids, labels, beta=0.1):
    # 1. SFT Loss（标准交叉熵）
    sft_loss = cross_entropy_loss(policy_output, labels)
    
    # 2. Odds Ratio Loss
    # Odds = p(chosen) / p(rejected)
    # log_odds = log(odds_chosen / odds_rejected)
    odds_chosen = torch.exp(policy_chosen_logps)
    odds_rejected = torch.exp(policy_rejected_logps)
    log_odds = torch.log(odds_chosen / odds_rejected)
    
    # Sigmoid 让 log_odds 越大越好
    odds_loss = -F.logsigmoid(log_odds).mean()
    
    # 3. 总损失
    total_loss = sft_loss + beta * odds_loss
    return total_loss
```

## 关键超参

| 超参 | 推荐值 | 说明 |
|------|--------|------|
| `beta` | 0.1 | Odds Ratio loss 权重 |
| `learning_rate` | 5e-6 | 比 SFT 低 |
| `batch_size` | 4-8 | 小批量即可 |

## 训练流程

```python
# TRL 中使用 ORPO
from trl import ORPOTrainer, ORPOConfig

config = ORPOConfig(
    beta=0.1,
    learning_rate=5e-6,
    per_device_train_batch_size=4,
    num_train_epochs=3,
    max_length=1024,
)

trainer = ORPOTrainer(
    model=model,
    args=config,
    train_dataset=dataset,  # 包含 "chosen" 和 "rejected" 字段
    tokenizer=tokenizer,
)

trainer.train()
```

## 何时使用

✅ **推荐**：
- 想简化对齐流程（省去 SFT 阶段）
- 显存受限（无需参考模型）
- 中等规模偏好数据（10K-100K）
- 训练效率敏感

⚠️ **不推荐**：
- 已有高质量 SFT 模型（DPO 即可）
- 大规模工业级对齐（PPO 仍是 SOTA）
- 极小数据集（IPO 更稳）

## 性能对比

| Benchmark | DPO | ORPO | 提升 |
|-----------|-----|------|------|
| AlpacaEval 2.0 | 25.8 | **28.7** | +2.9 |
| IFEval | 53.6 | **57.7** | +4.1 |
| MT-Bench | 7.65 | **7.78** | +0.13 |

## Related

- [[概念/dpo]] — DPO（基线）
- [[概念/sft]] — SFT（ORPO 集成了 SFT）
- [[概念/ipo]] — IPO（正则化版本）
- [[概念/kto]] — KTO（二元反馈）
- [[概念/rlhf]] — RLHF 总览
- [[概念/preference-learning]] — 偏好学习总览

---

## 2026 ORPO 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **TRL 集成** | HuggingFace 原生支持 | GA |
| **单阶段训练** | SFT + 对齐一体 | GA |
| **无参考模型** | 无需额外参考模型 | GA |

## 生产最佳实践

1. **数据格式**：使用 (prompt, chosen, rejected) 格式
2. **lambda 调优**：从 0.1 开始，根据效果调整
3. **与 DPO 对比**：追求简单用 ORPO，追求效果用 DPO
4. **适用场景**：资源受限、想简化训练流程时优先选择
5. **评估指标**：胜率、人类评估、自动指标综合评估

## 2026 ORPO 生态现状

| 框架/工具 | 支持 | 特色 | 状态 |
|------|------|------|------|
| TRL (HuggingFace) | ✅ | ORPOTrainer | ✅ 主流 |
| LLaMA-Factory | ✅ | 集成支持 | ✅ 主流 |
| OpenRLHF | ✅ | 分布式 | ✅ 主流 |
| Axolotl | ✅ | 配置支持 | ✅ 成熟 |

## 检查清单

- [ ] 偏好数据已准备（chosen/rejected）
- [ ] 数据质量已验证
- [ ] 超参已调优（lr/lambda）
- [ ] 评估基准已建立
- [ ] 与 DPO 效果已对比

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 效果不如 DPO | 数据质量差 | 提升数据质量 |
| 训练不稳定 | 学习率太高 | 降低 lr + warmup |
| 过拟合 | 数据量少 | 增加数据 + 正则化 |
| 生成质量下降 | lambda 太大 | 减小 lambda |

## 延伸阅读

- [[概念/Training/dpo|DPO]] — 直接偏好优化
- [[概念/Training/grpo|GRPO]] — 组相对策略优化
- [[概念/Training/simpo|SimPO]] — 简化偏好优化
- [[概念/Training/preference-learning|Preference Learning]] — 偏好学习
- [[概念/Training/rlhf|RLHF]] — 人类反馈强化学习

> ℹ️ ORPO 是最简化的偏好对齐方案，无需参考模型，2026年适合资源受限场景，效果接近 DPO。

## 性能参考

| 场景 | 胜率 | 训练时间 | 显存 |
|------|------|------|------|
| 通用对话 | 55-60% | 2-4h | 24 GB |
| 代码生成 | 52-58% | 4-8h | 48 GB |
| 数学推理 | 50-55% | 4-8h | 48 GB |