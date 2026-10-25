---
title: "Online DPO / RL 新进展 (Online DPO / DAPO / Reinforce++ / 推理 RL 2025)"
category: concepts
tags:
  - training
  - rl
  - online-dpo
  - dapo
  - reinforcepp
  - rlvr
  - reasoning-rl
  - grpo
aliases:
  - Online DPO
  - DAPO
  - Reinforce++
  - RLVR
  - Reasoning RL
  - GRPO++
relationships:
  - target: "概念/dpo"
    type: extends
  - target: "概念/grpo"
    type: extends
  - target: "概念/rlvr"
    type: related_to
  - target: "概念/prm-process-reward-model"
    type: related_to
summary: "Online DPO / DAPO / Reinforce++ 是 2025-2026 推理 RL 的三大新进展——在线训练无需 reference policy(Online DPO)、解耦 clip + dual-loss(DAPO 字节)、PPO 简化无 critic(Reinforce++)。是 o1 / R1 训练范式的工业化进展,把"思考型模型"训练成本降 50%,稳定度提升。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "Online DPO / RL 新进展"
---

# Online DPO / RL 新进展

> 中文简称：Online DPO / RL 新进展

> **一句话理解**:Online DPO / DAPO / Reinforce++ 是 2025 年"o1 类推理模型"训练范式的三大突破——把 RLHF 复杂流水线简化,无需 reference model(Online DPO)、解耦 clip 提高稳定性(DAPO)、去掉 critic 节省显存(Reinforce++)。DeepSeek R1 / Qwen QwQ / o3 全部采用这些技术。

---

## 一、为什么需要新 RL 算法?

传统 RLHF(RLHF + PPO)的问题:
- **需要 4 个模型**:Policy / Reference / Reward / Critic
- **显存占用高**:70B 模型 + RLHF 需 280GB+
- **训练不稳定**:PPO 收敛困难,reward hacking 频发
- **复杂超参**:clip range、KL 系数、GAE 参数
- **实现复杂**:几千行代码,bug 多

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 在线直接偏好优化 | Online DPO | 动态生成偏好对 |
| 解耦裁剪策略优化 | Decoupled Clip and Dynamic sAmpling Policy Optimization(DAPO) | 字节开源,长 CoT 训练 |
| 简化 PPO | Reinforce++ | 去掉 critic 的 PPO |
| 可验证奖励 RL | Reinforcement Learning with Verifiable Rewards(RLVR) | 答案可验证则无需 RM |
| 群体相对策略优化 | GRPO | DeepSeek 提出,无 critic |
| 过程奖励模型 | Process Reward Model(PRM) | 见 LLM/PRM 卡 |
| 偏好学习 | Preference Learning | DPO 核心 |
| 参考模型 | Reference Model | DPO 需要冻结的参考 |
| 奖励模型 | Reward Model | 打分函数 |
| 评论家 | Critic | PPO 价值网络 |
| 优势 | Advantage | 动作相对平均的优势 |
| 裁剪 | Clipping | 限制策略更新幅度 |
| 重要性采样 | Importance Sampling | 旧/新策略比值 |
| 奖励破解 | Reward Hacking | 钻空子刷分 |
| KL 散度 | KL Divergence | 策略与参考的距离 |
| 长 CoT | Long Chain-of-Thought | 思考型模型输出 |
| 思考预算 | Thinking Budget | 推理时 token 上限 |
| 截断采样 | Truncated Sampling | 截断超长/超短样本 |
| 难度感知 | Difficulty-Aware | 动态调整难度 |
| 动态采样 | Dynamic Sampling | 按需要重新采样 |
| Token 级损失 | Token-Level Loss | 每个 token 单独算 loss |
| 序列级损失 | Sequence-Level Loss | 整序列平均 loss |

---

## 三、主流新算法对比(2026-02 快照)

| 算法 | 厂商/团队 | 核心创新 | 显存节省 | 稳定性 | 适合 |
|---|---|---|---|---|---|
| **Online DPO** | ARL/UC Berkeley | 动态生成偏好,无需 reference | -30% | 中 | 通用 |
| **DAPO** | ByteDance | Decoupled Clip + Dynamic Sampling + Token-Level | -40% | 高 | 长 CoT |
| **Reinforce++** | Microsoft | 简化 PPO,无 critic | -50% | 中-高 | 通用 |
| **GRPO** | DeepSeek | 群体相对优势,无 critic | -50% | 中 | 推理 |
| **RLOO** | Google | REINFORCE Leave-One-Out,无 critic | -50% | 中 | 通用 |
| **SimPO** | Princeton | 简化 DPO,无 reference | -30% | 高 | 通用 |
| **ORPO** | KAIST | 监督 + 偏好一体化 | -25% | 高 | 通用 |
| **KTO** | ETH | 行为经济学视角,无需偏好对 | -30% | 高 | 通用 |
| **PRM-DPO** | Princeton | 用 PRM 分数替代偏好 | -30% | 高 | 推理 |
| **RLVR** | 多团队 | 可验证奖励,无需 RM | -60% | 极高 | 数学/代码 |

---

## 四、Online DPO 详解

### 4.1 核心思想

传统 DPO 离线,数据来自固定偏好对。Online DPO 动态生成:
- 当前 policy 采样多个 response
- 用 reward model / 规则打分
- 选最佳 vs 最差作为偏好对
- 直接 DPO 更新

### 4.2 优势

- 无需 reference model(训完就丢)
- 探索更充分(随 policy 进化)
- 持续对齐(reward 变化时跟进)

### 4.3 实战

```python
from trl import OnlineDPOTrainer, OnlineDPOConfig

trainer = OnlineDPOTrainer(
    model=policy_model,
    ref_model=None,  # 关键:不传 reference
    reward_model=reward_model,
    args=OnlineDPOConfig(
        beta=0.1,
        learning_rate=1e-6,
        batch_size=8,
    ),
    train_dataset=dataset,
)
trainer.train()
```

### 4.4 论文

- "Direct Language Model Alignment from Online AI Feedback" [arxiv.org/abs/2402.04792](https://arxiv.org/abs/2402.04792)
- "Iterative Reasoning Preference Optimization" [arxiv.org/abs/2412.09438](https://arxiv.org/abs/2412.09438)

---

## 五、DAPO 详解(字节)

### 5.1 核心创新(4 项)

1. **Decoupled Clip**:策略 / 价值 clip 范围不同
2. **Dynamic Sampling**:按难度动态采样,跳过太易 / 太难
3. **Token-Level Policy Gradient**:token 级 loss,避免长 CoT 稀释
4. **Overlong Reward Shaping**:超长响应惩罚

### 5.2 显存节省

- 无 critic:50%
- 无 reference:30%
- 总可省 60-70%

### 5.3 实战

```bash
# 字节 verl 框架原生支持
git clone https://github.com/volcengine/verl
cd verl
pip install -e .

# 训练命令
python -m verl.trainer.main_dapo \
    --model Qwen/Qwen2.5-32B-Instruct \
    --dataset math-r1 \
    --algorithm dapo \
    --batch_size 64 \
    --lr 1e-6
```

### 5.4 论文

- "DAPO: An Open-Source LLM Reinforcement Learning System at Scale" [arxiv.org/abs/2503.14476](https://arxiv.org/abs/2503.14476)

---

## 六、Reinforce++ 详解(微软)

### 6.1 核心思想

简化 PPO:
- **去掉 critic**:用 REINFORCE + 滑动 baseline
- **PPO 风格 clip**:保留稳定性
- **简单实现**:200 行代码

### 6.2 优势

- 实现简单
- 显存省 50%(无 critic)
- 稳定性优于 REINFORCE
- 适合垂域微调

### 6.3 实战

```python
from trl import RLOOTrainer, RLOOConfig

trainer = RLOOTrainer(
    model=policy_model,
    args=RLOOConfig(
        num_return_sequences=4,  # 每个 prompt 采样 4 次
        kl_coef=0.05,
    ),
    train_dataset=dataset,
)
```

### 6.4 论文

- "Back to Basics: Revisiting REINFORCE Style Optimization for Learning from Human Feedback in LLMs" [arxiv.org/abs/2402.14740](https://arxiv.org/abs/2402.14740)

---

## 七、生产最佳实践

1. **首选 GRPO + RLVR**:R1/QwQ 验证,数学/代码 SOTA。
2. **长 CoT 用 DAPO**:字节验证,O(10K) token CoT 训练稳定。
3. **通用对齐用 Online DPO**:无需 reference,简单高效。
4. **显存紧张用 Reinforce++/RLOO**:省 50% 显存。
5. **数学/代码用 RLVR**:答案可验证,无需 RM。
6. **避免 PPO 默认**:复杂、难调、易崩。
7. **混合奖励模型**:RM(60%) + 规则(40%) 防止 reward hacking。
8. **难度感知采样**:不要让模型全学简单题。
9. **A/B 测试**:同一 base model,不同 RL 方案对比。
10. **Checkpoints 频繁保存**:RL 训练易崩,定期 save。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **GRPO** | DeepSeek R1 主力,开源 verl/huggingface trl 全支持 |
| **DAPO** | 字节开源,verl 框架首选,长 CoT 训练标配 |
| **Online DPO** | TRL/HuggingFace 原生,工业部署广泛 |
| **Reinforce++** | 微软,简洁,多框架集成 |
| **RLOO** | Google,RLHF 简化的代表 |
| **RLVR** | NVIDIA / 多团队,数学/代码场景事实标准 |
| **PRM-DPO** | 推理任务 SOTA,需 PRM 模型 |
| **基础框架** | TRL / Verl / OpenRLHF / LLaMA-Factory / swift |
| **企业 ARR** | RL 平台 ARR $200M+,年增速 200% |
| **主要论文** | arXiv 2024-2025 每月 10+ RL 算法论文 |

---

## 九、See Also(官方源)

### DAPO

- 论文 [arxiv.org/abs/2503.14476](https://arxiv.org/abs/2503.14476)
- verl 框架 [github.com/volcengine/verl](https://github.com/volcengine/verl)

### Online DPO

- TRL 实现 [github.com/huggingface/trl](https://github.com/huggingface/trl)
- 论文 [arxiv.org/abs/2402.04792](https://arxiv.org/abs/2402.04792)

### Reinforce++

- TRL RLOO [github.com/huggingface/trl](https://github.com/huggingface/trl)
- 论文 [arxiv.org/abs/2402.14740](https://arxiv.org/abs/2402.14740)

### GRPO

- DeepSeek 论文 [arxiv.org/abs/2402.03300](https://arxiv.org/abs/2402.03300)
- HuggingFace GRPO [huggingface.co/docs/trl/grpo_trainer](https://huggingface.co/docs/trl/grpo_trainer)

### 框架

- OpenRLHF [github.com/OpenRLHF/OpenRLHF](https://github.com/OpenRLHF/OpenRLHF)
- TRL [github.com/huggingface/trl](https://github.com/huggingface/trl)
- LLaMA-Factory [github.com/hiyouga/LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory)

---

## 十、相关概念卡

- [[概念/dpo|Dpo]]
- [[概念/grpo|Grpo]]
- [[概念/rlhf|Rlhf]]
- [[概念/rlvr|Rlvr]]
- [[概念/prm-process-reward-model|Prm Process Reward Model]]
- [[概念/reasoning-models|Reasoning Models]]
- [[概念/ppo|Ppo]]
- [[概念/reward-model|Reward Model]]
