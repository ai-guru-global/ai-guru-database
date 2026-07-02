---
title: 'RLHF / DPO / GRPO 深度解读 - 大模型对齐训练三大范式'
category: '06-reinforcement-learning'
tags: ["reinforcement-learning", "rlhf", "dpo", "grpo", "alignment", "preference-learning"]
summary: '> **一句话理解**: RLHF 用"奖励模型打分+强化学习优化"让模型学会人类偏好，DPO 把它简化成"直接比较两个回答谁更好"，GRPO 则去掉批评家、用组内相对优势让推理模型自己进化——三种范式分别代表对齐训练的过去、现在与未来。'
created: '2026-06-22'
updated: '2026-06-22'
tier: supporting
aliases:
  - "Rlhf Dpo Grpo Deep Dive"
  - "RLHF DPO GRPO Deep Dive"
  - RLHF_DPO_GRPO_Deep_Dive
sources: []

---
# RLHF / DPO / GRPO 深度解读 - 大模型对齐训练三大范式

> **一句话理解**: RLHF 用"奖励模型打分+强化学习优化"让模型学会人类偏好，DPO 把它简化成"直接比较两个回答谁更好"，GRPO 则去掉批评家、用组内相对优势让推理模型自己进化——三种范式分别代表对齐训练的过去、现在与未来。

---

## 0. 为什么需要对齐训练？

预训练后的基座模型只会"接龙"——给它"如何制造炸弹"，它会续写步骤。对齐训练（Alignment）就是让模型**遵循人类偏好**：有用（Helpful）、诚实（Honest）、无害（Harmless）。

```
预训练模型（只会接龙）
       │
       ▼  SFT（监督微调）：学会"指令-回答"格式
       │
指令模型（能对话，但可能啰嗦/有害/不诚实）
       │
       ▼  对齐训练：学会"人类偏好"
       │
对齐模型（有用·诚实·无害）
```

三种主流对齐范式：**RLHF（2017-2023）→ DPO（2023）→ GRPO（2024-2026）**，一条清晰的演进线。

---

## 1. RLHF：强化学习对齐（开山范式）

### 1.1 三阶段流程

RLHF（Reinforcement Learning from Human Feedback）由 InstructGPT/GPT-3.5 引入，是 ChatGPT 成功的关键。

```
阶段 1: SFT（监督微调）
  人类写高质量"指令-回答"对 → 微调基座模型
  输出：SFT 模型 π_SFT

阶段 2: 训练奖励模型（Reward Model）
  对同一问题，让 SFT 模型生成 K 个回答
  人类排序：回答A > 回答B > 回答C
  训练 RM：给"好的回答"高分，"差的回答"低分
  目标：r(x, y) 越大越好（y 排名越高，分数越高）
  损失：L = -log σ(r(x,y_w) - r(x,y_l))   # w=赢的, l=输的

阶段 3: PPO 强化学习优化
  用 RM 的分数当"奖励"，用 PPO 算法优化 SFT 模型
  目标：max E[r(x,y)] - β·KL(π || π_SFT)
                    ↑奖励最大化    ↑别偏离原模型太远（防"奖励黑客"）
```

### 1.2 关键技巧：KL 散度约束

没有 KL 约束，模型会"钻空子"——生成 RM 评分高但人类看不懂的内容（reward hacking）。

```
KL(π_θ || π_SFT) 衡量"当前模型离 SFT 多远"

β 太大 → 模型不敢变，等于没训练
β 太小 → 模型乱变，reward hacking
β 典型值：0.01 ~ 0.5（需调参）
```

### 1.3 RLHF 的痛点

| 痛点 | 说明 |
|------|------|
| **流程长** | SFT → RM → PPO 三阶段，任一阶段失败全盘崩 |
| **显存爆炸** | 同时驻留 4 个模型：Actor、Critic、Reward、Reference（SFT） |
| **训练不稳** | PPO 对超参敏感，奖励信号稀疏，容易崩溃 |
| **RM 偏差** | RM 学不好，PPO 优化的是"错误目标" |

> 这就是为什么 2023 年后社区拼命找"不需要 PPO"的方法——DPO 应运而生。

---

## 2. DPO：直接偏好优化（简化范式）

### 2.1 核心洞察：跳过 RM 和 PPO

DPO（Direct Preference Optimization）的数学洞见：**RLHF 的最优解有解析形式**，可以直接从偏好数据推导出策略，无需训练 RM，也无需 PPO。

```
RLHF 的目标：max E[r(x,y)] - β·KL(π || π_SFT)
              ─────────────  ──────────────────
              想要的          约束

数学推导：这个目标的最优解是
  π*(y|x) = π_SFT(y|x) · exp(r(x,y)/β) / Z(x)

反过来解出 r：
  r(x,y) = β·log(π*(y|x)/π_SFT(y|x)) + β·log Z(x)

代入 Bradley-Terry 偏好模型（P(y_w>y_l) = σ(r_w - r_l)），
Z(x) 在相减时消掉，得到：

  L_DPO = -log σ( β·log(π(y_w)/π_SFT(y_w)) - β·log(π(y_l)/π_SFT(y_l)) )
                       └─赢的回答────────────────└─输的回答──────────────┘
```

### 2.2 DPO 流程：极致简化

```
RLHF:  偏好数据 → 训练 RM → PPO 优化   （3 阶段，4 模型）
DPO:   偏好数据 → 直接算 DPO loss      （1 阶段，2 模型：π + π_SFT）
```

只需 **(问题, 赢的回答, 输的回答)** 三元组数据，一个损失函数，一次训练。

### 2.3 DPO vs RLHF 对比

| 维度 | RLHF | DPO |
|------|------|-----|
| 模型数 | 4（Actor+Critic+RM+Ref） | 2（π+Ref） |
| 阶段 | 3 | 1 |
| 显存 | 4× 模型 | 2× 模型 |
| 稳定性 | 难（PPO 脆弱） | 易（本质是分类损失） |
| 效果 | 略好（RM 可迭代） | 接近 RLHF |
| 上限 | 高（RM 可精调） | 受限于离线数据 |

### 2.4 DPO 的局限

- **离线数据**：只用现有偏好对，无法像 RLHF 那样"边采样边学习"
- **分布偏移**：训练中模型变了，但偏好数据是旧的
- **过拟合**：β 太小容易把"输的回答"概率压到 0（degenerate）

> 衍生方法：IPO（防止过拟合）、KTO（不需要成对数据，只要"好/坏"标签）、SimPO（去掉参考模型）。

---

## 3. GRPO：组相对策略优化（推理模型范式）

### 3.1 背景：为什么推理模型需要新方法？

2024 年 OpenAI o1、2025 年 DeepSeek-R1 证明：**用 RL 让模型学会"长链推理"** 比 SFT 更强。但 PPO 训练太重，DPO 又不适合"有明确对错"的数学/代码任务（无法简单排序"两个推理过程"）。

GRPO（Group Relative Policy Optimization，DeepSeek 提出）的关键创新：**去掉 Critic 网络，用组内相对优势**。

### 3.2 GRPO 核心机制

```
对每个问题 x：
  1. 当前模型 π_θ 采样一组 G 个回答 {y_1, y_2, ..., y_G}
  2. 用"可验证奖励"（规则/代码执行）给每个回答打分 {r_1,...,r_G}
  3. 计算组内相对优势（z-score 归一化）：
       A_i = (r_i - mean(r)) / std(r)
     → 高于均值的得正优势，低于均值得负优势
  4. PPO 式目标，但用组内优势替代 Critic 估计：
       L = -E[ min(ratio·A_i, clip(ratio)·A_i) ] - β·KL
```

### 3.3 GRPO 的两大突破

**突破一：去掉 Critic**

```
PPO 需要 Critic 网络估计 V(s)（状态价值），用于计算优势 A = R - V(s)
Critic 本身要训练、占显存、且估计不准会拖累 Actor

GRPO 用"同组兄弟的平均分"代替 Critic：
  "这题模型平均能拿 60 分，你这个回答拿 80 分 → 优势 +20"
  无需训练 Critic，显存省一半，且估计更准
```

**突破二：可验证奖励（Verifier-based Reward）**

```
数学题：  检查最终答案是否正确          → 0/1
代码题：  执行测试用例，看通过率        → 0~1
推理题：  检查推理步骤是否逻辑自洽       → 规则评分

这些奖励"客观、可重复、无偏差"，完全绕开了 RLHF 的 RM 训练难题
→ 这就是为什么 DeepSeek-R1 能用纯 RL（无 SFT 冷启动的 R1-Zero）学会推理
```

### 3.4 GRPO 训练示意

```
                    ┌─ y_1 (r=90) ── A=+1.2 ──┐
问题 x ──采样 G 个─→├─ y_2 (r=60) ── A=-0.3 ──┤── PPO 更新 ──→ π_θ'
                    ├─ y_3 (r=30) ── A=-1.5 ──┤   (用组内优势)
                    └─ y_4 (r=80) ── A=+0.6 ──┘

mean=65, std=18.9
z-score 归一化得优势 A_i
无需 Critic，无需 RM
```

---

## 4. 三范式横向对比

| 维度 | RLHF | DPO | GRPO |
|------|------|-----|------|
| **提出** | 2017（OpenAI）/ 2022（InstructGPT） | 2023（Stanford） | 2024（DeepSeek） |
| **奖励来源** | 训练的 RM | 隐式（从偏好推导） | 可验证规则 |
| **是否需要 Critic** | ✅ 需要 | ❌ 不需要 | ❌ 不需要 |
| **是否需要 RM** | ✅ 需要 | ❌ 不需要 | ❌ 不需要 |
| **数据** | 偏好排序 | 成对偏好 (y_w, y_l) | 问题 + 可验证奖励 |
| **在线/离线** | 在线（边采样边学） | 离线（固定数据集） | 在线 |
| **显存** | 4× 模型 | 2× 模型 | 2~3× 模型 |
| **稳定性** | 差（PPO 脆弱） | 好（分类损失） | 中（需 KL 控制） |
| **擅长任务** | 开放对话、创意写作 | 通用对齐、安全 | 数学、代码、推理 |
| **代表模型** | GPT-3.5/4, Claude 早期 | Llama-3, Mistral | DeepSeek-R1, o1, Qwen3 |

### 选择决策树

```
你的任务是什么？
│
├─ 开放式对话/创意（无标准答案）
│   ├─ 有在线标注预算？→ RLHF（效果上限最高）
│   └─ 只有离线偏好数据？→ DPO（最简单）
│
├─ 数学/代码/推理（有标准答案）
│   └─ GRPO（可验证奖励，推理模型标配）
│
└─ 混合（通用助手）
    └─ SFT + DPO（对齐）+ GRPO（推理增强）← 2026 主流组合
```

---

## 5. 实践：如何选择与实现

### 5.1 工具链

| 方法 | 主流框架 | 一键脚本 |
|------|----------|----------|
| RLHF | trl（HuggingFace）、OpenRLHF | `trl rlhf_train.py` |
| DPO | trl、LLaMA-Factory、Unsloth | `trl dpo_train.py` |
| GRPO | verl（字节）、OpenRLHF、Unsloth | `verl train_grpo.sh` |

### 5.2 数据准备

```
RLHF/DPO 数据格式（JSONL）：
  {"prompt": "...", "chosen": "好回答", "rejected": "差回答"}

GRPO 数据格式（需配 reward function）：
  {"prompt": "求 23+47", "answer": "70"}
  + reward_func(output, answer) → 1.0 if correct else 0.0
```

### 5.3 常见坑

| 坑 | 症状 | 解法 |
|----|------|------|
| **奖励黑客（RLHF）** | 模型生成乱码但 RM 给高分 | 加大 KL 系数 β；RM 与 Actor 异步更新 |
| **DPO 退化** | rejected 概率压到 0，模型崩溃 | 加大 β；或用 IPO |
| **GRPO 奖励稀疏** | 全组回答都得 0 分，无法学 | 提高采样温度；加过程奖励（PRM） |
| **KL 系数过大** | 模型不学，等于没训 | 动态 KL（自适应）或减小 β |

---

## 6. 2026 趋势

1. **PRM（过程奖励模型）**：不只看最终答案，给每步推理打分，比 GRPO 的结果奖励更精细
2. **自我博弈 RL**：模型生成题目再自己解，无需人类数据（AlphaProof 路线）
3. **在线 DPO**（Online DPO / SPIN）：结合 DPO 的简单与 RLHF 的在线，动态采样
4. **多模态 GRPO**：把可验证奖励扩展到视觉（如"识别图中物体并计数"）
5. **RLVR（RL with Verifiable Rewards）**：GRPO 的泛化，成为推理模型训练事实标准

---

## Related

- [[06_Reinforcement_Learning/Deep_RL/PPO_Deep_Dive|PPO 深度解读]] — RLHF 和 GRPO 的基础算法
- [[_concepts/rlhf|RLHF 概念]] — 概念卡速查
- [[15_Agent_Production/Agent_Evaluation/README|Agent 评估]] — 评估对齐效果的方法
- [[07_Model_Training/README|模型训练]] — SFT 与对齐训练的工程实践
- [[08_Model_Evaluation/README|模型评估]] — 对齐模型的评估基准

---

> **参考文献**
> - InstructGPT (Ouyang et al., 2022) — RLHF 经典
> - DPO (Rafailov et al., 2023) — Direct Preference Optimization
> - DeepSeekMath / DeepSeek-R1 (2024-2025) — GRPO 与纯 RL 推理
> - Tulu 3 (Lambert et al., 2024) — 开源对齐训练配方
