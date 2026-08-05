---
title: "KTO（Kahneman-Tversky Optimization）"
category: -concepts
tags: [kto, alignment, rlhf, dpo, preference-learning, prospect-theory]
aliases:
  - "KTO"
  - "Kahneman-Tversky Optimization"
  - "Kahneman-Tversky 优化"
relationships:
  - target: "概念/dpo"
    type: alternative
  - target: "概念/rlhf"
    type: belongs_to
sources:
  - 07_模型训练/06_对齐研究/
summary: "KTO（Kahneman-Tversky Optimization）是受 Kahneman-Tversky 前景理论启发的对齐算法，使用二元反馈（好/坏）而非成对偏好，可大幅降低数据标注成本。"
lifecycle: reviewed
tier: supporting
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-07-21
name_zh: "前景理论对齐优化"
---

# KTO（Kahneman-Tversky Optimization）

> 中文简称：前景理论对齐优化

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

- [[概念/dpo]] — DPO（更主流的替代）
- [[概念/rlhf]] — RLHF 总览
- [[概念/grpo]] — GRPO（另一种新算法）
- [[概念/preference-learning]] — 偏好学习
- [[概念/orpo]] — ORPO（几率比偏好优化）
- [[概念/simpo]] — SimPO（无参考模型偏好优化）

---

## 2026 KTO 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **TRL 集成** | HuggingFace TRL 原生支持 | GA |
| **多语言** | 中文/英文/多语言场景验证 | GA |
| **与 DPO 融合** | KTO + DPO 混合训练 | 实验性 |
| **在线 KTO** | 结合在线采样的迭代式 KTO | 研究前沿 |

## 生产最佳实践

1. **数据质量**：二元反馈需明确标准，避免模糊标注
2. **样本平衡**：好/坏样本比例建议 1:1 至 2:1，避免偏斜
3. **beta 调优**：从 0.1 开始，根据 KL 散度调整
4. **与 DPO 对比**：有 A/B 数据用 DPO，只有单边反馈用 KTO
5. **评估指标**：使用胜率、人类评估、自动指标综合评估

## 2026 KTO 生态现状

| 框架/工具 | 支持 | 特色 | 状态 |
|------|------|------|------|
| TRL (HuggingFace) | ✅ | KTOTrainer | ✅ 主流 |
| LLaMA-Factory | ✅ | 集成支持 | ✅ 主流 |
| OpenRLHF | ✅ | 分布式 | ✅ 主流 |
| Axolotl | ✅ | 配置支持 | ✅ 成熟 |

## 检查清单

- [ ] 单边反馈数据已收集
- [ ] 数据质量已验证
- [ ] beta 参数已调优
- [ ] 评估基准已建立
- [ ] 与 DPO 效果已对比

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 效果不如 DPO | 数据质量差 | 提升数据质量 |
| 训练不稳定 | beta 不当 | 调整 beta |
| 过拟合 | 数据量少 | 增加数据 + 正则化 |
| 生成质量下降 | 过度优化 | 早停 + KL 约束 |

## 延伸阅读

- [[概念/Training/dpo|DPO]] — 直接偏好优化
- [[概念/Training/grpo|GRPO]] — 组相对策略优化
- [[概念/Training/orpo|ORPO]] — 简化偏好优化
- [[概念/Training/preference-learning|Preference Learning]] — 偏好学习
- [[概念/Training/rlhf|RLHF]] — 人类反馈强化学习

> ℹ️ KTO 是单边反馈场景的偏好对齐方案，无需 A/B 对比数据，2026年适合数据稀缺场景 。

## KTO vs 其他偏好对齐方法

| 方法 | 数据需求 | 参考模型 | 效果 | 复杂度 |
|------|------|------|------|------|
| PPO | A/B 对比 | 需要 | 最高 | 高 |
| DPO | A/B 对比 | 需要 | 高 | 中 |
| KTO | 单边反馈 | 需要 | 中高 | 中 |
| ORPO | A/B 对比 | 不需要 | 中高 | 低 |
| SimPO | A/B 对比 | 不需要 | 中高 | 最低 |

## KTO 损失函数

```
L_KTO = E[λ_D · log σ(β · log π(y_w|x)/π_ref(y_w|x))]
      + E[λ_U · log σ(β · log π_ref(y_l|x)/π(y_l|x))]

其中:
- y_w: 期望输出 (desirable)
- y_l: 不期望输出 (undesirable)
- λ_D, λ_U: 权重系数
- β: 温度参数
```

## KTO 训练配置示例

```python
from trl import KTOTrainer, KTOConfig

config = KTOConfig(
    output_dir="./kto_output",
    beta=0.1,                    # KL 惩罚系数
    desirable_weight=1.0,        # 期望样本权重
    undesirable_weight=1.0,      # 不期望样本权重
    learning_rate=5e-7,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    max_length=1024,
)

# 数据格式: 单边反馈
# {"prompt": "...", "completion": "...", "label": true/false}
```

## KTO 适用场景

| 场景 | 说明 | 优势 |
|------|------|------|
| 用户反馈 | 点赞/点踩数据 | 无需配对 |
| 安全对齐 | 有害/无害分类 | 单边标注 |
| 质量过滤 | 好/差回答 | 数据易得 |
| 数据稀缺 | 少量反馈数据 | 样本效率高 |
