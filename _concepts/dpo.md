---
title: "DPO（Direct Preference Optimization）"
category: -concepts
tags: [dpo, alignment, rlhf, preference-learning, direct-preference-optimization, ppo]
aliases:
  - "DPO"
  - "Direct Preference Optimization"
  - "直接偏好优化"
relationships:
  - target: "_concepts/rlhf"
    type: belongs_to
  - target: "_concepts/ppo"
    type: alternative
  - target: "_concepts/orpo"
    type: alternative
  - target: "_concepts/ipo"
    type: alternative
  - target: "_concepts/kto"
    type: alternative
sources:
  - 模型训练/Alignment/TRL_RLHF_DPO_Guide.md
  - 模型训练/Alignment/GRPO_and_New_Alignment_Methods.md
summary: "DPO（Direct Preference Optimization）是 Rafailov et al. 2023 提出的简化对齐方法，将 PPO 的两阶段（SFT + RM + PPO）合并为单阶段，直接用偏好数据训练，无需训练 Reward Model 和 Critic。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.92
  inferred: 0.06
  ambiguous: 0.02
base_confidence: 0.95
created: 2026-06-24
updated: 2026-06-24
---

# DPO（Direct Preference Optimization）

## 核心要点

- **提出**：Rafailov et al., 2023-05（Stanford，论文 "Direct Preference Optimization"）
- **核心创新**：把 RLHF 的两阶段（SFT + RM + PPO）合并为**单阶段**，直接用偏好对 (chosen, rejected) 训练，无需 Reward Model。
- **核心公式**：
  ```
  L_DPO = -log_sigmoid(β · (log π(y_w|x) / π_ref(y_w|x) - log π(y_l|x) / π_ref(y_l|x)))
  ```
- **核心优势**：
  - 无需训练 Reward Model（节省 30% 计算）
  - 无需 PPO（训练稳定、收敛快）
  - 与 SFT 同框架（简单）
  - 效果接近 PPO，稳定性更好
- **代表应用**：Llama 3-Instruct、Zephyr、Mixtral-Instruct

## 一句话解释

> DPO = "PPO 简化版"；不需要 Reward Model，直接用"哪个更好"的数据训练，效果一样好但简单很多。

## RLHF vs DPO

| 阶段 | RLHF | DPO |
|------|------|-----|
| 1. SFT | ✅ | ✅ |
| 2. Reward Model 训练 | ✅ | ❌（不需要）|
| 3. PPO 训练 | ✅ | ❌ |
| 4. DPO 训练 | ❌ | ✅（直接用偏好数据）|
| 总阶段数 | 3 | 2 |
| 显存 | 4x（Policy + RM + Ref + Critic）| 2x（Policy + Ref）|
| 训练稳定性 | 中（PPO 容易崩）| 高 |
| 效果 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 关键公式推导

DPO 从 Bradley-Terry 模型出发，证明**最优策略与 Reward 函数一一对应**：

```python
# 推导核心：最优策略 = Reward 的归一化形式
π*(y|x) = (1/Z(x)) · π_ref(y|x) · exp(r(x,y)/β)

# 代入 Bradley-Terry 偏好模型
L_DPO = -log_sigmoid(
    β · log(π(y_chosen|x) / π_ref(y_chosen|x))
    - β · log(π(y_rejected|x) / π_ref(y_rejected|x))
)
```

## 数据格式

```json
{
  "prompt": "什么是 Transformer？",
  "chosen": "Transformer 是基于自注意力机制的神经网络...",
  "rejected": "Transformer 是一种 RNN..."
}
```

或使用 UltraFeedback / Anthropic HH-RLHF 等公开数据集。

## 典型使用

```python
# TRL 库
from trl import DPOTrainer, DPOConfig

config = DPOConfig(
    beta=0.1,                    # KL 强度
    learning_rate=5e-7,          # 极低学习率
    per_device_train_batch_size=2,
    num_train_epochs=3,
    max_length=1024,
    max_prompt_length=512,
)

trainer = DPOTrainer(
    model=model,
    ref_model=ref_model,         # 参考模型（一般是 SFT 模型）
    args=config,
    train_dataset=dataset,       # 包含 prompt/chosen/rejected
    tokenizer=tokenizer,
)

trainer.train()
```

```bash
# LLaMA-Factory 也支持
llamafactory-cli train \
  --stage dpo \
  --model_name_or_path meta-llama/Llama-2-7b-hf \
  --dataset ultrafeedback \
  --template llama2 \
  --output_dir ./llama2-7b-dpo
```

## 关键超参

| 超参 | 推荐值 | 说明 |
|------|--------|------|
| `beta` | 0.1 (Llama 3 用 0.01) | KL 强度（越大越保守）|
| `learning_rate` | 5e-7 | 比 SFT 低 1-2 数量级 |
| `batch_size` | 2-4 | 小批量 |
| `epochs` | 2-3 | 通常 1-3 轮 |
| `max_length` | 1024-2048 | prompt + response |
| `loss_type` | "sigmoid" | 也可 "hinge" / "ipo" / "kto" |

## 何时使用

✅ **推荐**：
- 有成对偏好数据（chosen vs rejected）
- 不想训练 Reward Model（节省资源）
- 想要稳定训练（PPO 容易崩）
- 想用 TRL / LLaMA-Factory 快速实验

⚠️ **不推荐**：
- 只有二元反馈（用 KTO）
- 极小数据集（用 IPO 防过拟合）
- 需要 SFT + DPO 一体化（用 ORPO）

## 变种与扩展

| 算法 | 改进点 | 适用 |
|------|--------|------|
| **IPO** | 正则化，防过拟合 | 小数据 |
| **KTO** | 二元反馈 | 👍/👎 数据 |
| **ORPO** | SFT + DPO 融合 | 单阶段 |
| **SimPO** | 无需参考模型 | 简化训练 |
| **CPO** | SFT loss + DPO loss | 防止遗忘 |

## 主流实现

- **TRL**（HuggingFace）：参考实现
- **LLaMA-Factory**：中文友好
- **OpenRLHF**：大规模分布式
- **Llama-3** 官方训练脚本：使用 DPO

## Related

- [[_concepts/rlhf]] — RLHF 总览
- [[_concepts/ppo]] — PPO（DPO 的"父算法"）
- [[_concepts/orpo]] / [[_concepts/ipo]] / [[_concepts/kto]] — DPO 变种
- [[_concepts/grpo]] — GRPO（DeepSeek-R1 路线）
- [[模型训练/Alignment/TRL_RLHF_DPO_Guide]] — DPO 深度