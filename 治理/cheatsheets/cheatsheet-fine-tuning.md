---
title: "模型微调技术速查表"
tags: [cheatsheet, fine-tuning, peft, lora, qlora, sft, rlhf, dpo, grpo, alignment]
type: cheatsheet
created: 2026-06-24
updated: 2026-06-24
tier: core
summary: "从 SFT 到 RLHF/DPO/GRPO 的完整后训练技术栈、PEFT 选型、数据准备规范、显存优化技巧与对齐训练最佳实践。"
sources: []
---

# 模型微调技术速查表

> **核心洞察**：2026 年模型适配的三大主流路径——**SFT（教说话）→ RLHF/DPO/GRPO（教讨喜）→ PEFT（省显存）**。LoRA/QLoRA 已成为工业标配，让 70B 模型在单卡 24GB 上可微调。
> 详见 [[Fine_tuning_Techniques]] · [[模型训练]] · [[Alignment/TRL_RLHF_DPO_Guide|TRL_RLHF_DPO_Guide]] · [[Alignment/GRPO_and_New_Alignment_Methods|GRPO_Guide]]

## 后训练三大范式

| 范式 | 训练目标 | 数据格式 | 关键算法 | 代表模型 |
|------|---------|---------|---------|---------|
| **SFT**（监督微调） | 拟合 (input, output) 对 | `(prompt, response)` | Cross-Entropy Loss | ChatGPT 初版、LLaMA-Chat |
| **RLHF**（人类反馈强化学习） | 学习人类偏好排序 | `(prompt, response_A, response_B, preference)` | PPO + Reward Model | InstructGPT、Claude |
| **DPO**（直接偏好优化） | 直接拟合偏好 | `(prompt, chosen, rejected)` | DPO Loss | Llama 3-Instruct、Zephyr |
| **GRPO**（组内相对策略优化） | 组内相对优势 | `(prompt, group_responses, rewards)` | GRPO Loss | DeepSeek-R1、QwQ |
| **KTO**（Kahneman-Tversky 优化） | 二元反馈 | `(prompt, response, good/bad)` | KTO Loss | Mistral-7B-Instruct |
| **IPO**（Identity Preference Optimization） | 偏好正则化 | `(prompt, chosen, rejected)` | IPO Loss | Stability AI |
| **SimPO**（Simple Preference Optimization） | 无参考模型 | `(prompt, chosen, rejected)` | SimPO Loss | 普林斯顿 2024 |
| **ORPO**（Odds Ratio Preference Optimization） | SFT + DPO 一体 | `(prompt, chosen, rejected)` | ORPO Loss | 2024 SOTA |

## PEFT（参数高效微调）选型

| 方法 | 可训练参数 | 显存节省 | 性能 | 适用场景 |
|------|----------|---------|------|---------|
| **Full Fine-tuning** | 100% | 0% | 100% 基线 | 数据充足、效果要求极致 |
| **LoRA** | 0.1-5% | 3-5x | 95-100% | **工业标配** |
| **QLoRA** | 0.1-5% | 5-10x | 93-98% | 单卡/24GB 显存 |
| **Adapter** | 1-5% | 2-4x | 90-95% | 多任务切换 |
| **Prefix Tuning** | 0.1% | 5-10x | 85-92% | 文本生成 |
| **Prompt Tuning** | 0.01% | 10x | 80-90% | 极轻量场景 |
| **IA³** | 0.01% | 10x | 92-97% | 推理高效 |
| **DoRA** | 0.1-5% | 3-5x | 96-100% | LoRA 改进版（解耦方向/幅度）|

### LoRA 关键超参

```python
from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16,                    # LoRA rank: 8-128, 默认 16
    lora_alpha=32,           # 缩放因子, 通常 = 2*r
    target_modules=["q_proj", "v_proj"],  # 目标模块
    lora_dropout=0.05,       # 防止过拟合
    bias="none",
    task_type="CAUSAL_LM"
)
# 选 target_modules 经验:
#   保守: q_proj, v_proj (~0.1% 参数)
#   标准: q_proj, k_proj, v_proj, o_proj
#   全量: 所有 linear 层
```

## SFT 数据准备

### 数据格式

```json
{
  "messages": [
    {"role": "system", "content": "你是一个 helpful assistant"},
    {"role": "user", "content": "什么是 Transformer？"},
    {"role": "assistant", "content": "Transformer 是一种基于自注意力机制的神经网络架构..."}
  ]
}
```

### 数据质量规范

| 维度 | 标准 |
|------|------|
| **总量** | ≥ 10K 条（基础），≥ 100K 条（生产级） |
| **多样性** | 覆盖 ≥ 5 类任务、≥ 3 种长度档 |
| **准确性** | 人工审核或 GPT-4 评分 ≥ 4/5 |
| **去重** | 语义去重（embedding 相似度 < 0.85）|
| **长度分布** | 中位数 200-500 token，< 2K token 为主 |
| **语言比例** | 与目标用户群匹配 |

## RLHF/DPO 训练流程

### RLHF 三步法

```
1. SFT (有监督微调)
   ↓
2. RM (Reward Model 训练)
   输入: (prompt, response_A, response_B, human_preference)
   输出: scalar reward score
   ↓
3. PPO (近端策略优化)
   目标: max E[reward] - β * KL(SFT || π)
   关键: KL 惩罚防止 reward hacking
```

### DPO 单步法（更简单）

```python
# DPO Loss: 直接用偏好数据，无需 RM 和 PPO
def dpo_loss(policy_chosen_logps, policy_rejected_logps,
             ref_chosen_logps, ref_rejected_logps, beta=0.1):
    pi_logratios = policy_chosen_logps - policy_rejected_logps
    ref_logratios = ref_chosen_logps - ref_rejected_logps
    return -F.logsigmoid(beta * (pi_logratios - ref_logratios)).mean()
```

### GRPO（DeepSeek-R1 路线）

```python
# GRPO: 组内相对优势估计，无需 Critic
def grpo_loss(prompt, group_responses, rewards, num_generations=8):
    # 1. 每个 prompt 生成 G 个 response
    # 2. 计算组内相对优势: A_i = (r_i - mean(r)) / std(r)
    # 3. PPO-style 更新，但 advantage 是组内相对值
    advantages = (rewards - rewards.mean()) / (rewards.std() + 1e-8)
    return policy_gradient_loss(log_probs, advantages)
```

## 显存优化技巧

| 技巧 | 显存节省 | 性能影响 |
|------|---------|---------|
| **Mixed Precision (BF16/FP16)** | 30-50% | 几乎无损 |
| **Gradient Accumulation** | 增加 batch 等效大小 | 训练慢 |
| **Gradient Checkpointing** | 30-50% | 训练慢 20% |
| **DeepSpeed ZeRO-2** | 4-8x（多卡） | 通信开销 |
| **DeepSpeed ZeRO-3** | 8-16x（多卡） | 通信更多 |
| **FSDP** | 8-16x（多卡） | 类似 ZeRO-3 |
| **QLoRA (4-bit 量化)** | 5-10x | 微小性能损失 |
| **Flash Attention 2** | 5-10x 显存 + 2-3x 速度 | 必须 |

## 训练超参速查

| 超参 | SFT 推荐 | DPO 推荐 | GRPO 推荐 |
|------|---------|---------|----------|
| Learning Rate | 1e-5 ~ 5e-5 | 5e-7 ~ 5e-6 | 1e-6 ~ 5e-6 |
| Batch Size | 32-128 (global) | 32-64 | 64-256 |
| Epochs | 2-3 | 1-2 | 1-2 |
| Warmup Ratio | 0.03-0.1 | 0.1 | 0.1 |
| Weight Decay | 0.0-0.01 | 0.0 | 0.0 |
| KL Beta (RLHF) | - | - | 0.01-0.04 |
| DPO Beta | - | 0.1 | - |

## 训练框架

| 框架 | 强项 | 适用 |
|------|------|------|
| **TRL** | HuggingFace 官方，SFT/DPO/GRPO/PPO | 全场景 |
| **LLaMA-Factory** | 中文友好、配置化 | 中文 SFT |
| **Unsloth** | 2-5x 加速、显存省 40% | 单卡微调 |
| **Axolotl** | 配置文件驱动、多模态 | 生产级 |
| **MS-Swift** | 魔搭出品、多模型 | 中文 |
| **DeepSpeed-Chat** | 大规模 RLHF | 70B+ 模型 |
| **OpenRLHF** | 高性能 RLHF | 70B+ 模型 |

## 评估指标

### SFT 评估

| 指标 | 工具 |
|------|------|
| **Loss / Perplexity** | 训练曲线 |
| **MT-Bench** | GPT-4 评分 |
| **IFEval** | 指令遵循 |
| **AlpacaEval** | 胜率 |

### 对齐评估

| 指标 | 说明 | 目标 |
|------|------|------|
| **Reward Model Score** | RM 打分 | 持续上升 |
| **Win Rate vs SFT** | 对比 SFT 模型胜率 | ≥ 70% |
| **Safety Score** | 安全违规率 | ≤ 1% |
| **HHH Score** | Helpfulness/Honesty/Harmlessness | ≥ 4/5 |
| **Refusal Rate** | 拒答率 | 5-15%（合理） |

## 常见陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| **学习率过大** | Loss 震荡/不收敛 | 降到 1e-5，配合 warmup |
| **数据质量差** | 模型输出混乱 | 严格清洗、人工审核 |
| **灾难性遗忘** | 微调后丢失通用能力 | 混入通用数据 + KL 正则 |
| **Reward Hacking** | RM 高分但实际差 | 增 KL 惩罚、加人类评估 |
| **过拟合** | 训练集好、测试集差 | 早停 + dropout + 数据增强 |
| **CUDA OOM** | 显存爆 | 启用 QLoRA + Gradient Checkpointing |
| **DPO 过拟合** | 偏好数据生硬 | 降 beta、增 epochs |

## 微调决策树

```
是否需要改变模型行为？
├── 否 → Prompt Engineering / RAG
└── 是 → 数据量？
    ├── < 1K 条 → Few-shot / ICL
    ├── 1K-10K → LoRA SFT
    ├── 10K-100K → Full SFT 或 LoRA
    └── > 100K → Full SFT
        │
        需要对齐人类偏好？
        ├── 否 → SFT 结束
        └── 是 → 数据形式？
            ├── 成对偏好 → DPO / IPO
            ├── 排序列表 → RLHF (PPO)
            └── 二元反馈 → KTO
```

---

**参见**：[[Fine_tuning_Techniques]] · [[模型训练/Alignment/TRL_RLHF_DPO_Guide|TRL_RLHF_DPO_Guide]] · [[Alignment/GRPO_and_New_Alignment_Methods|GRPO_Guide]] · [[PEFT_2026]] · [[概念/lora-qlora-sft-rlhf-dpo]] · [[概念/distributed-training]]