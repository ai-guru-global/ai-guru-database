---
title: 'GRPO 训练深度解读 - 推理模型生产级训练指南'
category: '06-reinforcement-learning'
tags: ["reinforcement-learning", "grpo", "rlhf", "ppo", "dpo", "reasoning", "deepseek-r1", "qwen3", "large-model-training", "alignment"]
summary: '> **一句话理解**: GRPO 是一种去掉 Critic、用组内相对优势和可验证奖励训练推理模型的强化学习算法，是 DeepSeek-R1、Qwen3、o1-class 模型实现“长思维链”能力的核心工程范式。'
created: '2026-07-02'
updated: '2026-07-02'
tier: supporting
aliases:
  - "GRPO Training Deep Dive"
  - "GRPO_Training_Deep_Dive"
sources: []

name_zh: "GRPO 训练深度解读 - 推理模型生产级训练指南"
---

# GRPO 训练深度解读 - 推理模型生产级训练指南

> 中文简称：GRPO 训练深度解读 - 推理模型生产级训练指南

> **一句话理解**: GRPO 是一种去掉 Critic、用组内相对优势和可验证奖励训练推理模型的强化学习算法，是 DeepSeek-R1、Qwen3、o1-class 模型实现“长思维链”能力的核心工程范式。

---

## 目录

1. [从 PPO 到 GRPO：为什么需要它？](#1-从-ppo-到-grpo为什么需要它)
2. [GRPO 算法原理](#2-grpo-算法原理)
3. [GRPO vs PPO vs DPO 横向对比](#3-grpo-vs-ppo-vs-dpo-横向对比)
4. [Reward Function 设计](#4-reward-function-设计)
5. [KL 控制与训练稳定性](#5-kl-控制与训练稳定性)
6. [数据构造与课程学习](#6-数据构造与课程学习)
7. [显存优化与分布式训练配置](#7-显存优化与分布式训练配置)
8. [生产案例：复现 DeepSeek-R1-Zero / Qwen3](#8-生产案例复现-deepseek-r1-zero--qwen3)
9. [生产部署 Checklist](#9-生产部署-checklist)
10. [2026 趋势与落地建议](#10-2026-趋势与落地建议)

---

## 1. 从 PPO 到 GRPO：为什么需要它？

### 1.1 推理模型的训练困境

2024 年起，OpenAI o1、DeepSeek-R1、Qwen3 等模型证明：**让大模型在回答前“多想一想”**，可以显著提升数学、代码、逻辑推理能力。这种能力通常通过强化学习（RL）让模型自主生成长链推理（Chain-of-Thought, CoT）获得。

但传统 RLHF + PPO 在推理场景下存在几个工程痛点：

- **Critic 模型昂贵**：PPO 需要训练一个价值网络 Critic 来估计优势（Advantage），在 LLM 场景下等同于再维护一个完整模型，显存和训练成本翻倍。
- **奖励模型偏差大**：开放域的偏好奖励模型（RM）对“推理过程好不好”打分能力有限，容易把啰嗦、重复或格式讨巧的输出判为高奖励。
- **推理任务有客观答案**：数学、代码题存在可验证的正确性，不需要人类偏好排序，直接用规则奖励更稳定。

### 1.2 GRPO 的两大工程假设

GRPO（Group Relative Policy Optimization）由 DeepSeek 在 DeepSeekMath 中提出，核心假设非常直接：

1. **同组采样可替代 Critic**：对同一个问题采样一组回答，用组内平均奖励作为 baseline，高于平均的就是“好样本”，低于平均的就是“差样本”。
2. **可验证奖励优于学习奖励**：用规则或代码执行结果打分，避免训练 Reward Model，减少偏差和流程复杂度。

这两个假设让 GRPO 在推理模型训练中兼具 **稳定性** 与 **可扩展性**，成为 2024-2026 年推理模型 RL 训练的事实标准。

---

## 2. GRPO 算法原理

### 2.1 组采样与相对优势

对每个训练问题 \(x\)：

1. 当前策略模型 \(\pi_\theta\) 采样 \(G\) 个回答 \(\{y_1, y_2, ..., y_G\}\)。
2. 用奖励函数给每个回答打分 \(\{r_1, ..., r_G\}\)。
3. 计算组内相对优势（通常用 z-score 归一化）：

\[
   A_i = \frac{r_i - \text{mean}(r)}{\text{std}(r)}
   \]

4. 使用类似 PPO 的 clipped surrogate loss 更新策略，但 \(A_i\) 直接来自组内统计，而不是 Critic。

```text
问题 x
  │
  ▼  采样 G 个回答
  ├── y_1  r=1.0   A=+1.34
  ├── y_2  r=0.0   A=-0.45
  ├── y_3  r=0.5   A=+0.22
  └── y_4  r=0.0   A=-1.11

mean=0.375, std≈0.467
优势用 z-score 计算，无需 Critic
```

### 2.2 目标函数

GRPO 的目标函数与 PPO 高度相似，只是优势 \(A_i\) 的计算方式不同：

\[
\mathcal{L}^{\text{GRPO}}(\theta) = -\mathbb{E}_{x \sim \mathcal{D}, \{y_i\} \sim \pi_{\theta_{\text{old}}}} \left[ \frac{1}{G} \sum_{i=1}^{G} \min\left( r_i(\theta) A_i, \text{clip}(r_i(\theta), 1-\epsilon, 1+\epsilon) A_i \right) \right]
\]

其中概率比：

\[
r_i(\theta) = \frac{\pi_\theta(y_i | x)}{\pi_{\theta_{\text{old}}}(y_i | x)}
\]

### 2.3 KL 散度约束

为防止策略偏离参考模型（Reference Model，通常是 SFT 后的基座模型）太远，GRPO 通常加入 KL 惩罚项：

\[
\mathcal{L} = \mathcal{L}^{\text{GRPO}} - \beta \cdot \mathbb{E}[D_{\text{KL}}(\pi_\theta \|\| \pi_{\text{ref}})]
\]

KL 项既可以在 loss 中显式加入，也可以通过在奖励函数中减去 KL 惩罚实现。工程上常见写法：

```
reward = task_reward - beta * KL(pi_theta || pi_ref)
```

### 2.4 算法伪代码

```python
for batch in dataloader:
    prompts = batch["prompt"]
    answers = batch["answer"]

    # 1. 旧策略采样一组回答
    with torch.no_grad():
        outputs_old = sample_group(model_ref, prompts, group_size=G)
        old_logprobs = compute_logprob(model_ref, prompts, outputs_old)

    # 2. 计算奖励
    rewards = reward_fn(outputs_old, answers)

    # 3. 组内归一化优势
    mean_r = rewards.mean(dim=-1, keepdim=True)
    std_r = rewards.std(dim=-1, keepdim=True)
    advantages = (rewards - mean_r) / (std_r + 1e-8)

    for _ in range(ppo_epochs):
        # 4. 新策略 logprob
        new_logprobs = compute_logprob(model, prompts, outputs_old)
        ratio = torch.exp(new_logprobs - old_logprobs)

        # 5. Clipped surrogate loss
        surr1 = ratio * advantages
        surr2 = torch.clamp(ratio, 1 - eps, 1 + eps) * advantages
        policy_loss = -torch.min(surr1, surr2).mean()

        # 6. KL 惩罚
        kl = compute_kl(model, model_ref, prompts, outputs_old)
        loss = policy_loss + beta * kl

        loss.backward()
        optimizer.step()
```

---

## 3. GRPO vs PPO vs DPO 横向对比

| 维度 | PPO（RLHF） | DPO | GRPO |
|------|------------|-----|------|
| **Critic 网络** | ✅ 需要 | ❌ 不需要 | ❌ 不需要 |
| **奖励来源** | 训练 Reward Model | 成对偏好数据 | 规则 / 可验证奖励 |
| **采样方式** | 单样本 + Critic 估计优势 | 离线偏好对 | 同问题采样一组，组内相对比较 |
| **显存占用** | 4× 模型（Actor/Critic/RM/Ref） | 2× 模型（π + Ref） | 2~3× 模型（Actor/Ref/可选 RM） |
| **训练稳定性** | 中，对超参敏感 | 高，损失简单 | 中高，需要 KL 控制和奖励归一化 |
| **适用任务** | 开放对话、创意生成 | 通用对齐、安全、偏好学习 | 数学、代码、逻辑推理 |
| **代表模型** | GPT-3.5/4、Claude | Llama-3、Mistral | DeepSeek-R1、Qwen3、o1-class |
| **数据要求** | 偏好排序 + RM 训练数据 | 成对 (chosen, rejected) | 问题 + 标准答案 / 可执行验证器 |

**选择建议**：

- 任务有可验证答案（数学、代码、形式化推理）→ **GRPO**。
- 任务偏开放、需要人类审美或安全偏好 → **DPO / RLHF**。
- 2026 年主流配方：SFT → DPO（对齐）→ GRPO（推理增强）。

---

## 4. Reward Function 设计

奖励函数是 GRPO 训练的“方向盘”。设计不当会导致模型作弊、格式退化或只重结果不重过程。

### 4.1 规则奖励（Rule-based Reward）

最常见、最稳定的奖励形式，适合数学和代码：

```python
def math_reward(output: str, answer: str) -> float:
    extracted = extract_boxed_answer(output)
    if normalize(extracted) == normalize(answer):
        return 1.0
    return 0.0

def code_reward(output: str, test_cases: list) -> float:
    code = extract_code_block(output)
    passed = run_unit_tests(code, test_cases)
    return passed / len(test_cases)
```

优点：无偏差、可复现、零训练成本。  
缺点：只能覆盖“答案可精确判断”的任务；对中间推理步骤无反馈。

### 4.2 模型奖励（Outcome Reward Model, ORM）

对开放域推理题，可训练一个轻量 ORM 给最终答案打分：

- 输入：问题 + 模型输出
- 输出：标量奖励
- 训练数据：人工标注或自动构造的“正确/错误”样本

ORM 的陷阱：模型可能学会讨好 ORM 的某些表面特征（如长度、特定语气），需要与规则奖励混合使用。

### 4.3 过程奖励（Process Reward Model, PRM）

PRM 不仅看最终答案，还给推理的每一步打分：

```text
问题：求解方程 2x + 5 = 13

步骤 1: 2x = 13 - 5          PRM: +0.9
步骤 2: 2x = 8               PRM: +1.0
步骤 3: x = 4                PRM: +1.0
最终答案: 4                  ORM: +1.0
```

PRM 能提供更细粒度信号，减少“结果对但过程错”的样本。训练 PRM 需要步骤级标注，成本更高；OpenAI 的 o1 和 DeepSeek-R1 后续版本均加入了 PRM 或类似的步骤级监督。

### 4.4 奖励混合与 Reward Hacking 防御

生产环境通常采用多奖励加权：

\[
R = \alpha \cdot R_{\text{rule}} + \beta \cdot R_{\text{orm}} + \gamma \cdot R_{\text{format}} - \lambda \cdot R_{\text{kl}}
\]

常见 reward hacking 及防御：

| 现象 | 可能原因 | 解法 |
|------|---------|------|
| 模型输出冗长废话 | 长度被误奖励 | 加入长度惩罚或归一化 |
| 答案对但过程胡编 | 只看最终结果 | 引入 PRM / 过程一致性检查 |
| 频繁重复 `<think>` 标签 | 格式奖励过高 | 降低格式权重，增加多样性奖励 |
| 模型偏离基座太远 | KL 系数过小 | 增大 β 或使用自适应 KL |

---

## 5. KL 控制与训练稳定性

GRPO 虽然去掉了 Critic，但仍然是 online RL，训练稳定性是生产落地的核心挑战。

### 5.1 KL 系数调度

固定 KL 系数往往不够用，推荐以下策略：

- **Warm-up**：前 N 步 β 从 0 线性增长到目标值，让模型先学会任务格式。
- **自适应 KL**：根据当前 KL 值动态调整 β。
  - 若 KL > 阈值，增大 β；
  - 若 KL < 阈值，减小 β。
- **Clip 奖励**：对奖励做归一化，防止极端值导致优势爆炸。

### 5.2 Ratio 与 Clip

GRPO 继承 PPO 的 clipped surrogate objective：

```
ratio = exp(new_logprob - old_logprob)
clipped_ratio = clip(ratio, 1 - ε, 1 + ε)
```

典型参数：

- \(\epsilon = 0.2\)
- group size \(G = 8\text{--}16\)
- 每个 prompt 更新 epoch \(K = 2\text{--}4\)

### 5.3 熵奖励与温度控制

为防止模型迅速坍缩到少量固定模板，可加入熵奖励或在采样时保持较高温度：

```python
# 采样阶段保持探索
outputs = model.generate(
    prompts,
    temperature=0.6,
    top_p=0.95,
    do_sample=True,
)
```

熵奖励：

```python
entropy_bonus = -entropy_loss * entropy_coef
loss = policy_loss + beta * kl - entropy_bonus
```

### 5.4 训练崩溃排查流程

```text
训练 loss 突然增大 / reward 不升
    │
    ├── 检查 KL 是否爆炸 → 增大 β 或启用自适应 KL
    ├── 检查 reward 分布 → 是否存在极端值，做裁剪或 winsorize
    ├── 检查 group size → 是否过小导致优势估计方差大
    ├── 检查学习率 → RL 通常比 SFT 低 1~2 个数量级
    └── 检查生成温度 → 温度过低会导致探索不足，全组奖励相同
```

---

## 6. 数据构造与课程学习

### 6.1 Prompt 设计

GRPO 的 prompt 通常比 SFT 更强调“展示推理过程”：

```text
Solve the following math problem. Show your reasoning step by step.
Put your final answer in \boxed{}.

Problem: {problem}
```

关键设计原则：

- **格式统一**：要求模型使用固定分隔符（如 `<think>...</think>`）包裹推理过程。
- **答案可抽取**：最终答案必须能被规则解析器精确提取。
- **避免答案泄漏**：prompt 中不要包含答案或解题思路。

### 6.2 Answer / Solution 格式

训练数据每条通常包含：

```json
{
  "problem": "What is 23 * 47?",
  "answer": "1081",
  "difficulty": 2,
  "domain": "arithmetic",
  "test_cases": null
}
```

代码题则提供：

```json
{
  "problem": "Implement a function that returns the n-th Fibonacci number.",
  "answer": "...",
  "test_cases": [
    {"input": "5", "expected": "5"},
    {"input": "10", "expected": "55"}
  ]
}
```

### 6.3 课程学习（Curriculum Learning）

不要一开始就用最难的题目训练，否则模型很难获得正奖励，导致梯度信号过弱。推荐按难度分桶：

```text
阶段 1: 小学算术 / 简单字符串操作  (pass@1 > 70%)
阶段 2: 初中代数 / 基础代码题       (pass@1 > 50%)
阶段 3: 高中竞赛 / LeetCode 中等    (pass@1 > 30%)
阶段 4: 大学数学 / 高级算法         (逐步加入)
```

每阶段训练到奖励饱和后再提升难度。动态课程学习（根据当前模型准确率自动调整采样分布）在实践中效果更好。

### 6.4 数据质量 Checklist

- [ ] 所有题目都有明确、唯一、可验证的答案。
- [ ] 答案格式已标准化（大小写、空格、LaTeX 解析兼容）。
- [ ] 去重处理，避免训练集与评测集重叠。
- [ ] 难度标签准确，支持课程学习调度。
- [ ] 代码题测试用例覆盖边界条件，避免弱测试导致假阳性奖励。
- [ ] 每条数据都有领域标签，便于监控各维度奖励变化。

---

## 7. 显存优化与分布式训练配置

### 7.1 显存占用分析

GRPO 训练需要同时驻留：

1. **Actor 模型**：正在更新的策略模型。
2. **Reference 模型**：计算 KL 的参考模型，通常不更新。
3. **可选 Reward / PRM 模型**：如果使用模型奖励。
4. **Rollout 序列激活值**：推理阶段生成的长序列占用大量显存。

对于 32B 模型、序列长度 8K、group size 16，单节点 8×H100 通常需要：

- 模型参数 fp16/bf16：约 64 GB
- 优化器状态 + 梯度（ZeRO-3）：分散到多卡
- Rollout 激活：与 batch size、序列长度、group size 成正比

### 7.2 分布式配置示例

以下是一个面向 32B 模型的 GRPO 训练配置（基于 veRL / OpenRLHF 风格）：

```yaml
# grpo_32b_config.yaml
model:
  model_path: "./checkpoints/Qwen3-32B-SFT"
  trust_remote_code: true

rollout:
  # vLLM 加速采样
  engine: vllm
  tensor_model_parallel_size: 4
  temperature: 0.6
  top_p: 0.95
  max_new_tokens: 4096
  group_size: 16

training:
  per_device_train_batch_size: 1
  gradient_accumulation_steps: 8
  num_train_epochs: 1
  learning_rate: 1.0e-6
  lr_scheduler_type: cosine
  warmup_ratio: 0.03
  beta: 0.04
  epsilon: 0.2
  max_grad_norm: 1.0

parallelism:
  data_parallel_size: 4
  tensor_parallel_size: 4
  pipeline_parallel_size: 2
  zero_stage: 3

optimization:
  activation_checkpointing: true
  flash_attention: true
  offload_reference_model: false
```

### 7.3 关键优化手段

| 技术 | 作用 | 适用场景 |
|------|------|---------|
| **ZeRO-3 / FSDP** | 将模型参数、梯度、优化器状态分片到多卡 | 单节点显存不足 |
| **Tensor Parallelism (TP)** | 单 layer 内切分到多张卡 | 减少单卡激活峰值 |
| **Pipeline Parallelism (PP)** | 模型按层切分到多卡 | 长序列、大 batch |
| **Activation Checkpointing** | 重计算前向激活，换显存 | 序列长、group size 大 |
| **FlashAttention-2/3** | 降低 attention 显存与计算 | 任何 Transformer 训练 |
| **vLLM Rollout** | 用PagedAttention加速采样 | GRPO 采样阶段 |
| **Reference Model Offload** | 把参考模型权重放到 CPU | 显存极度紧张 |

### 7.4 训练吞吐调优

1. **采样与训练解耦**：vLLM 负责 rollout，训练进程负责 backward，减少互相阻塞。
2. **动态 batching**：按有效 token 数重新组 batch，避免 padding 浪费。
3. **Group size 不是越大越好**：增大 \(G\) 会提高优势估计质量，但线性增加显存；通常 8~16 是甜点。
4. **序列截断策略**：对过长推理轨迹做截断或惩罚，防止少数 bad case 拖慢整体吞吐。

---

## 8. 生产案例：复现 DeepSeek-R1-Zero / Qwen3

### 8.1 DeepSeek-R1-Zero 训练流程

DeepSeek-R1-Zero 是“纯 RL、无 SFT 冷启动”的标志性案例：

```text
基座模型: DeepSeek-V3-Base
算法: GRPO
奖励: 规则奖励（数学正确性 + 代码测试通过率）
训练目标: 让模型自主涌现长链推理能力
关键观察: 模型会自动学会“自我纠正”、“多路径探索”、“反思”
```

工程要点：

- 不使用任何人工标注的推理数据，完全依赖可验证奖励。
- 奖励函数只关心最终答案对错，但模型为了拿到奖励，会自发延长 CoT。
- 为了防止可读性差，R1 后续版本加入了“冷启动 SFT”和“语言一致性奖励”。

### 8.2 Qwen3 GRPO 配置

Qwen3 系列在 post-training 中广泛使用 GRPO 提升数学与代码能力。典型配置与 DeepSeek-R1 类似，但有以下差异：

- **基座模型**：通常基于 Qwen2.5-Math / Qwen2.5-Coder 进行 SFT 后再接 GRPO。
- **奖励混合**：除了规则奖励，还会加入代码执行奖励和格式奖励。
- **多阶段训练**：先用简单数学数据训练，再逐步加入高难度竞赛题和代码题。

```yaml
# qwen3_grpo_snippet.yaml
reward:
  components:
    - name: math_accuracy
      weight: 1.0
      type: rule
    - name: code_unit_test
      weight: 1.0
      type: rule
    - name: format
      weight: 0.1
      type: rule
    - name: kl_penalty
      weight: 0.04
      type: kl

curriculum:
  stages:
    - data: gsm8k+mawps
      ratio: 0.7
      difficulty: easy
    - data: math500
      ratio: 0.2
      difficulty: medium
    - data: olympiad
      ratio: 0.1
      difficulty: hard
```

### 8.3 训练曲线与 Checkpoint 选择

GRPO 训练通常关注以下指标：

- **Average Reward**：是否持续上升。
- **KL Divergence**：是否保持在安全区间（如 0.05~0.2）。
- **Response Length**：推理长度变化，可观察模型是否学会深度思考。
- **Pass@1 / Exact Match**：在 hold-out 评测集上的表现。

Checkpoint 选择不要只看训练 reward，要选 **KL 稳定、评测集表现最高** 的点。建议每 50~100 步保存一个 checkpoint，并在小型评测集上快速评估。

---

## 9. 生产部署 Checklist

- [ ] 奖励函数已通过独立单元测试，覆盖正确、错误、边界、格式异常四种情况。
- [ ] Reference Model 与 Actor 模型版本对应，避免 KL 计算口径不一致。
- [ ] 训练数据已去重，并与评测集无重叠。
- [ ] Group Size、Learning Rate、β、ε 已在小规模实验上完成网格搜索。
- [ ] 已启用梯度裁剪、FP16/BF16 混合精度、激活重计算。
- [ ] 已配置 checkpoint 自动保存与崩溃恢复策略。
- [ ] 训练过程已记录 reward、KL、response length、entropy 等关键指标。
- [ ] 已设置奖励分布监控告警，防止 reward hacking 导致指标虚高。
- [ ] 已准备 fallback 方案：当 GRPO 训练不稳定时，可回退到 SFT 或 DPO checkpoint。
- [ ] 推理服务已兼容模型输出的 `<think>` / `\boxed{}` 格式解析。

---

## 10. 2026 趋势与落地建议

1. **RLVR 成为主流术语**：RL with Verifiable Rewards（可验证奖励强化学习）已取代单纯的 GRPO 叫法，强调“可验证性”比“组相对优势”更本质。
2. **PRM + GRPO 组合**：过程奖励模型提供步骤级信号，GRPO 提供在线采样，两者结合是下一个性能高点。
3. **自我博弈数据合成**：模型自己生成题目并解答，例如 DeepSeek-Prover、AlphaProof 路线，进一步降低对人类标注的依赖。
4. **多模态 GRPO**：把可验证奖励扩展到视觉推理、机器人任务规划等场景。
5. **推理成本与训练目标的平衡**：长 CoT 提升准确率，但也增加推理成本，2026 年“短思维链 + 长思维链混合训练”和“测试时扩展策略”同样重要。

**落地建议**：

- 如果业务场景有可验证答案（SQL、代码、数学、规则校验），优先尝试 GRPO。
- 不要跳过 SFT 直接上 GRPO，除非你有充足的算力和清晰的目标。
- 奖励函数投入 50% 的精力，模型结构只决定上限，奖励函数决定方向。

---

## Related

- [[06_强化学习/RLHF_DPO_GRPO_Deep_Dive|RLHF / DPO / GRPO 深度解读]] — 三种对齐范式的全景对比
- [[06_强化学习/02_Deep_RL/PPO_Deep_Dive|PPO 深度解读]] — GRPO 继承的基础算法
- [[06_强化学习/RL-in-nutshell|强化学习速览]] — 从 MDP 到 GRPO 的全栈路线
- [[07_模型训练/README|模型训练]] — SFT、分布式训练与 FinOps 的工程实践
- [[08_模型评估/README|模型评估]] — 推理模型与对齐模型的评估方法

---

> **参考文献**
> - DeepSeekMath (Shao et al., 2024) — GRPO 原始提出
> - DeepSeek-R1 / R1-Zero (DeepSeek-AI, 2025) — 纯 RL 推理模型
> - Qwen3 Technical Report (Qwen Team, 2025) — 大规模推理模型训练实践
> - Proximal Policy Optimization (Schulman et al., 2017) — PPO 基础算法
> - Direct Preference Optimization (Rafailov et al., 2023) — DPO 数学框架
