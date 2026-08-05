---
title: "DPO（Direct Preference Optimization）"
category: -concepts
tags: [dpo, alignment, rlhf, preference-learning, direct-preference-optimization, ppo]
aliases:
  - "DPO"
  - "Direct Preference Optimization"
  - "直接偏好优化"
relationships:
  - target: "概念/rlhf"
    type: belongs_to
  - target: "概念/ppo"
    type: alternative
  - target: "概念/orpo"
    type: alternative
  - target: "概念/ipo"
    type: alternative
  - target: "概念/kto"
    type: alternative
sources:
  - 07_模型训练/06_对齐研究/TRL_RLHF_DPO_Guide.md
  - 07_模型训练/06_对齐研究/GRPO_and_New_Alignment_Methods.md
summary: "DPO（Direct Preference Optimization）是 Rafailov et al. 2023 提出的简化对齐方法，将 PPO 的两阶段（SFT + RM + PPO）合并为单阶段，直接用偏好数据训练，无需训练 Reward Model 和 Critic。"
lifecycle: reviewed
tier: core
updated: 2026-07-25
provenance:
  extracted: 0.92
  inferred: 0.06
  ambiguous: 0.02
base_confidence: 0.95
created: 2026-06-24
updated: 2026-06-24
name_zh: "直接偏好优化"
---

# DPO（Direct Preference Optimization）

> 中文简称：直接偏好优化

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

## 源码级洞察（基于 trl v1.9.0 归档源码）

归档位置：`code/llm-frameworks/trl-v1.9.0/`（PyPI sdist）。

- **DPOTrainer 是核心六 Trainer 之一**：`trainer/dpo_trainer.py` L410 `DPOTrainer`，而 PPO 已退入 experimental——DPO 在工程上已取代 PPO 成为偏好对齐默认选择。
- **多 loss 加权组合**：L762-763 支持 `loss_type` 传入列表 + `loss_weights` 加权（如 sigmoid/IPO/hinge 混合），DPO 变种在同一个 Trainer 内部统一实现而非各自建类。
- **参考模型的三种省显存策略**：① `precompute_ref_log_probs`（L1178 `compute_ref_log_probs`）预算 ref logprobs 后释放 ref 模型；② LoRA 训练时直接 disable adapter 当作 ref（L1256 附近注释），无需第二份权重；③ Liger fused kernel（L1221 `_compute_loss_liger`）融合计算降峰值显存。

详见 [[07_模型训练/06_对齐训练/05_TRL_RLHF_DPO_指南]] 第 6 节。

## Related

- [[概念/rlhf]] — RLHF 总览
- [[概念/ppo]] — PPO（DPO 的“父算法”）
- [[概念/orpo]] / [[概念/ipo]] / [[概念/kto]] — DPO 变种
- [[概念/grpo]] — GRPO（DeepSeek-R1 路线）
- [[概念/preference-learning]] — 偏好学习总览
- [[概念/simpo]] — SimPO（无参考模型）
- [[07_模型训练/06_对齐训练/05_TRL_RLHF_DPO_指南]] — DPO 深度

---

## 2026 DPO 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **TRL 集成** | HuggingFace 原生支持 | GA |
| **多框架** | LLaMA-Factory/OpenRLHF/Unsloth | GA |
| **在线 DPO** | 结合在线采样的迭代式 | 研究前沿 |
| **多模态 DPO** | 视觉-语言模型对齐 | 实验性 |

## 生产最佳实践

1. **数据质量**：偏好对需明确标准，避免模糊标注
2. **beta 调优**：从 0.1 开始，根据 KL 散度调整
3. **与 PPO 对比**：简单场景用 DPO，复杂对齐用 PPO
4. **参考模型**：使用 SFT 后的模型作为参考
5. **评估指标**：胜率、人类评估、自动指标综合评估