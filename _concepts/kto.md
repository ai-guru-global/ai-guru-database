---
title: "KTO（Kahneman-Tversky Optimization）"
category: -concepts
tags: [kto, alignment, rlhf, dpo, preference-learning, prospect-theory]
aliases:
  - "KTO"
  - "Kahneman-Tversky Optimization"
  - "Kahneman-Tversky 优化"
relationships:
  - target: "_concepts/dpo"
    type: alternative
  - target: "_concepts/rlhf"
    type: belongs_to
sources:
  - 07_Model_Training/Alignment/
summary: "KTO（Kahneman-Tversky Optimization）是受 Kahneman-Tversky 前景理论启发的对齐算法，使用二元反馈（好/坏）而非成对偏好，可大幅降低数据标注成本。"
lifecycle: stable
tier: supporting
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# KTO（Kahneman-Tversky Optimization）

## 核心要点

- **核心创新**：基于 Kahneman-Tversky 前景理论，**只需二元反馈（好/坏）**而非成对偏好。
- **数据格式**：`(prompt, response, good_or_bad)` 而非 DPO 的 `(prompt, chosen, rejected)`。
- **数据优势**：
  - 标注成本减半（标一个比标一对便宜）
  - 更易收集（用户点赞/点踩）
  - 与人类直觉更一致（人对单事件判断比对比更准）
- **代表应用**：Mistral-7B-Instruct（部分对齐阶段）

## 一句话解释

> KTO = "DPO 用前景理论改写"；只需知道 response 好不好，不用两个对照；数据更便宜、收集更容易。

## 数据对比

| 算法 | 数据格式 | 标注成本 | 适用场景 |
|------|---------|---------|---------|
| **PPO/RLHF** | `(prompt, response_A, response_B, preference)` | 高 | 人类偏好排序 |
| **DPO** | `(prompt, chosen, rejected)` | 中 | A/B 对比标注 |
| **KTO** | `(prompt, response, good/bad)` | **低** | 👍/👎 单边标注 |
| **ORPO** | `(prompt, chosen, rejected)` | 中 | SFT + DPO 一体 |

## 关键公式

```python
# KTO Loss（基于前景理论的不对称损失）
def kto_loss(policy_chosen_logps, policy_rejected_logps,
             reference_chosen_logps, reference_rejected_logps,
             beta=0.1, desirable_weight=1.0, undesirable_weight=1.0):
    # 计算 KL 散度（policy vs reference）
    kl_chosen = policy_chosen_logps - reference_chosen_logps
    kl_rejected = policy_rejected_logps - reference_rejected_logps
    
    # 前景理论：损失厌恶不对称
    # desirable（好）样本用 +w_r
    # undesirable（坏）样本用 -λ * w_r
    losses = torch.cat([
        desirable_weight * (1 - torch.sigmoid(beta * kl_chosen)),
        -undesirable_weight * (1 - torch.sigmoid(beta * kl_rejected))
    ])
    return losses.mean()
```

## 关键超参

| 超参 | 推荐值 | 说明 |
|------|--------|------|
| `beta` | 0.1 | KL 强度 |
| `desirable_weight` | 1.0 | 好样本权重 |
| `undesirable_weight` | 1.0 | 坏样本权重 |
| `learning_rate` | 5e-7 | 极低 |

## 何时使用

✅ **推荐**：
- 已有 👍/👎 类用户反馈数据
- 标注预算有限
- 业务场景难以获得 A/B 对比数据
- 想从 DPO 切换但保留二元标注格式

⚠️ **不推荐**：
- 已有高质量成对偏好数据（DPO 更直接）
- 需要精确偏好排序（A/B 测试）

## Related

- [[_concepts/dpo]] — DPO（更主流的替代）
- [[_concepts/rlhf]] — RLHF 总览
- [[_concepts/grpo]] — GRPO（另一种新算法）
- [[_concepts/preference-learning]] — 偏好学习- [[_concepts/orpo]] — ORPO（几率比偏好优化）
