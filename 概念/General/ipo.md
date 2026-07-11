---
title: "IPO（Identity Preference Optimization）"
category: -concepts
tags: [ipo, alignment, dpo, preference-learning, regularization]
aliases:
  - "IPO"
  - "Identity Preference Optimization"
  - "恒等偏好优化"
relationships:
  - target: "概念/dpo"
    type: alternative
  - target: "概念/rlhf"
    type: belongs_to
sources:
  - 模型训练/Alignment/
summary: "IPO（Identity Preference Optimization）是 DPO 的改进版，通过正则化防止 overfitting，在小数据集和重复偏好对场景下比 DPO 更稳定。"
lifecycle: reviewed
tier: supporting
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# IPO（Identity Preference Optimization）

## 核心要点

- **提出**：Azar et al., 2023-10（论文 "A General Theoretical Paradigm to Understand Learning from Human Feedback"）
- **核心问题**：DPO 在某些场景会**过拟合**到偏好数据，甚至学到"任何 response 都比 reference 好"
- **核心改进**：在 DPO Loss 基础上加入**正则化项**，防止策略漂移过大
- **核心优势**：
  - 比 DPO 更稳定（尤其小数据集）
  - 防止奖励函数过度优化
  - 理论上等价于"恒等映射正则化"

## 一句话解释

> IPO = "DPO 加个安全带"；防止 DPO 在重复数据上把模型带偏。

## DPO vs IPO

| 维度 | DPO | IPO |
|------|-----|-----|
| Loss | `log_sigmoid(β·Δ)` | `(Δ - 1/(2β))²` |
| 优化方向 | 拉大 chosen vs rejected | 拉大 chosen vs rejected，但有上界 |
| 过拟合风险 | 高（重复偏好数据）| 低 |
| 小数据集稳定性 | 中 | **强** |
| 大数据集表现 | **强** | 中 |
| 适用 | 标准偏好数据 | 小数据 / 含噪声 / 重复 |

## 关键公式

```python
# IPO Loss（比 DPO 多一个正则项）
def ipo_loss(policy_chosen_logps, policy_rejected_logps,
             ref_chosen_logps, ref_rejected_logps, beta=0.1, tau=0.1):
    # 计算 log probability 差异
    policy_logratios = policy_chosen_logps - policy_rejected_logps
    ref_logratios = ref_chosen_logps - ref_rejected_logps
    
    # IPO 损失：(log_ratio - 1/(2β))²
    diff = policy_logratios - ref_logratios
    losses = (diff - 1 / (2 * beta)) ** 2
    return losses.mean()
```

## DPO 过拟合问题示意

```
DPO 训练:
  Pair (prompt, "great response", "bad response")
  Loss = -log_sigmoid(β · (logp(great) - logp(bad)))
  
  随着训练:
  - 模型学到：chosen 概率 → 100%
  - 副作用：reference 概率 → 0%（"任何 response 都好于不响应"）
  - 结果：模型在未见过 prompt 上胡言乱语

IPO 训练:
  - 在 DPO Loss 基础上加正则项
  - 阻止 chosen/rejected 概率极端分化
  - 模型保持稳定
```

## 何时使用

✅ **推荐**：
- 偏好数据集小（< 5K）
- 数据含噪声 / 标注不一致
- 同一偏好对重复出现
- 想避免 DPO 的奖励黑客问题

⚠️ **不推荐**：
- 大规模高质量偏好数据（DPO 更强）
- 已有充分训练的 SFT 模型（DPO 即可）
- 想最大化偏好准确率

## 主流实现

- **TRL**（HuggingFace）：`CPOLoss` / `IPOLoss`
- **trlx**：早期实现
- **直接实现**：公式简单，10 行代码

## Related

- [[概念/dpo]] — DPO
- [[概念/kto]] — KTO（二元反馈）
- [[概念/grpo]] — GRPO
- [[概念/rlhf]] — RLHF 总览