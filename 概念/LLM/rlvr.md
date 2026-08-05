---
title: RLVR 可验证奖励强化学习(RL with Verifiable Rewards)
category: concepts
tags:
  - llm
  - reinforcement-learning
  - rlvr
  - grpo
  - reasoning
  - r1
aliases:
  - Reinforcement Learning with Verifiable Rewards
  - 可验证奖励强化学习
  - RLVR
  - GRPO
relationships:
  - target: "概念/chinchilla-scaling-laws"
    type: related_to
  - target: "概念/test-time-compute"
    type: related_to
  - target: "概念/reasoning-models"
    type: evolves_from
  - target: "概念/cot-react-reasoning-prompt"
    type: related_to
summary: **RLVR(Reinforcement Learning with Verifiable Rewards)** 用**可程序化验证的客观奖励**替代人类偏好,代表算法 **GRPO**(DeepSeekMath arXiv:2402.03300)+ **R1-Zero**(纯 RL 无 SFT)+ **Kimi k1.5** + **Qwen3**,在数学/代码/形式化证明等"对错可自动判定"任务上彻底超越 RLHF。DeepSeek-R1(Nature 2025)仅用 557 万美元训练成本 + 数千条冷启动数据就达到 OpenAI o1 水平,2025-2026 已成为 reasoning LLM 的**核心训练范式**。
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources:
  - DeepSeek-R1 arXiv:2501.12948(Nature 2025)
  - GRPO DeepSeekMath arXiv:2402.03300
  - Kimi k1.5 论文
  - Qwen3 论文
  - OpenAI o1 官方博客
  - 数据科学 RLVR 教材(rlvrbook.com)
name_zh: "RLVR 可验证奖励强化学习"
---

# RLVR 可验证奖励强化学习(RL with Verifiable Rewards)

> 中文简称：RLVR 可验证奖励强化学习

## 一句话总结

**RLVR(Reinforcement Learning with Verifiable Rewards)** 用**可程序化验证的客观奖励**(数学答案对错、代码测试通过、形式化证明可校验)替代 RLHF 的"人类偏好打分",代表算法 **GRPO**(DeepSeekMath)+ **R1-Zero**(纯 RL 无 SFT),在数学/代码/形式化证明等"对错可判定"任务上彻底超越 RLHF;**DeepSeek-R1** 仅 557 万美元训练成本 + 数千条冷启动数据,数学推理达到 OpenAI o1 水平,2025-2026 已成为 reasoning LLM 的**核心训练范式**。

---

## 1. 形式化定义

> **"对每个任务设计一个确定性的判定器(verifier),用规则或程序自动判断'对/错',返回二元奖励(1/0 或 pass/fail)。"**

### 1.1 与 RLHF 的对比

| 维度 | RLHF | **RLVR** |
|---|---|---|
| **奖励来源** | 人类/奖励模型偏好 | **程序自动验证** |
| **成本** | 高(人类标注) | 极低(自动) |
| **一致性** | 主观、有噪声 | **完全确定** |
| **适合任务** | 通用对话 / 风格 | **数学 / 代码 / 形式化证明 / 约束输出** |
| **对齐目标** | "让人觉得好" | **"在形式意义上正确"** |
| **可扩展性** | 中(人力瓶颈) | **极高(零边际成本)** |
| **解决 Goodhart** | ❌ 易奖励黑客 | ✅ 验证器不可被糊弄 |

### 1.2 核心哲学

> "RLHF 优化的是**代理目标**(人类偏好),而 RLVR 直接优化**真实目标**(任务正确性)。"
> — Diyi Yang 等

---

## 2. 主流可验证任务类型

| 任务 | 验证方式 | 奖励 |
|---|---|---|
| **数学推理**(GSM8K、MATH、AIME) | 提取最终答案 → 规范化 → 与标准答案对比 | 1/0 |
| **代码生成**(HumanEval、CodeContests) | 沙箱执行 → 跑公开+隐藏测试用例 | 1/0 |
| **形式化证明** | Lean/Coq 证明检查器 | 1/0 |
| **结构化输出**(JSON/Schema) | 字段名+类型+枚举+业务规则 | 1/0 |
| **SQL 生成** | 执行对比 + 结果一致性 | 1/0 |
| **多步 agent 任务** | 最终状态校验 + 工具调用审计 | 1/0 |

### 2.1 抗"投机解法"工程实践

| 风险 | 缓解 |
|---|---|
| 模型只输出最终答案跳过推理 | 强制 `<final>` 标签 + 格式奖励 |
| 多次猜答案 | 沙箱 + 隐藏测试 + 单元测试 |
| 数据集太简单 | 按模型 pass@k 过滤,只保留 30-70% 难度 |
| 奖励黑客 | 多样化验证器 + 语义级判定 |

---

## 3. GRPO:RLVR 的核心算法

### 3.1 从 PPO 到 GRPO

| 维度 | PPO | **GRPO** |
|---|---|---|
| **价值函数 Critic** | 必须(2× 模型显存) | **不需要** |
| **优势估计** | GAE(Generalized Advantage Estimation) | **组内 z-score 标准化** |
| **基线** | 价值网络 V(s) | **同问题 G 次采样的均值** |
| **稀疏奖励** | 价值估计困难 | **组内比较稳定** |
| **显存** | 高(2× 模型) | **低(仅策略模型)** |
| **论文** | Schulman 2017 | **DeepSeekMath 2024** |

### 3.2 GRPO 优势公式

$$
A_i = \frac{r_i - \text{mean}(r_1, \ldots, r_G)}{\text{std}(r_1, \ldots, r_G) + 10^{-4}}
$$

> **关键洞察**:对每个问题 q,采样 G 个回答,用**组内相对奖励**作为优势,无需训练 Critic。

### 3.3 GRPO 损失

$$
\mathcal{L}_{\text{GRPO}}(\theta) = \mathbb{E} \frac{1}{G} \sum_{i=1}^{G} \min\left(\frac{\pi_\theta(o_i|q)}{\pi_{\theta_{old}}(o_i|q)} A_i, \text{clip}\left(\frac{\pi_\theta(o_i|q)}{\pi_{\theta_{old}}(o_i|q)}, 1-\epsilon, 1+\epsilon\right) A_i\right) - \beta D_{KL}(\pi_\theta || \pi_{ref})
$$

### 3.4 Dr. GRPO 修正

> 标准 GRPO 存在**长度偏差**和**有偏梯度**(Liu et al. 2025):
> - 错误回答**越长**,惩罚越轻 → "越错越长"
> - 修正:移除 |o_i| 归一化和 std 归一化

---

## 4. DeepSeek-R1:RLVR 的工业巅峰(2025-01,Nature)

### 4.1 双阶段训练

```
阶段 1:DeepSeek-R1-Zero(纯 RL,无 SFT)
   DeepSeek-V3-Base
   ↓
   GRPO 训练
   ↓
   R1-Zero(自发涌现长 CoT + Aha Moment)

阶段 2:DeepSeek-R1(冷启动 + RL)
   DeepSeek-V3-Base
   ↓
   数千条冷启动长 CoT 数据 → SFT
   ↓
   DeepSeek-R1-Dev1
   ↓
   GRPO(规则奖励 + 语言一致性奖励)
   ↓
   DeepSeek-R1-Dev2
   ↓
   600K 推理 + 200K 通用 SFT
   ↓
   DeepSeek-R1-Dev3
   ↓
   第二轮 RL(规则奖励 + 偏好 RM 奖励)
   ↓
   DeepSeek-R1(Final)
```

### 4.2 R1-Zero 的"Aha Moment"

> 在训练中,模型突然开始高频使用"等等,让我重新审视……"这种**自我反思语言**,**没有人在 prompt 里教它**——纯粹 GRPO 涌现。

| 现象 | 表现 |
|---|---|
| **自我反思** | "等等,我算错了,重新尝试" |
| **延长思维链** | 难题自动增加推理步骤 |
| **多解策略** | 尝试不同方法,选最优 |
| **反向验证** | "如果 X 那么 Y;Y 不成立所以 X 也不对" |

### 4.3 性能

| 基准 | DeepSeek-R1 | OpenAI o1-mini | OpenAI o1-0912 |
|---|---|---|---|
| **AIME 2024** | 79.8% | 63.6% | 83.3% |
| **MATH-500** | 97.3% | 90.0% | 96.4% |
| **Codeforces 评分** | 2029 | 1820 | 2061 |
| **训练成本** | **$5.57M** | 估 >$100M | 估 >$100M |

### 4.4 蒸馏小模型:RL 也能蒸馏

R1 用 800K 推理数据 SFT Qwen2.5 / Llama,**蒸馏** 1.5B-70B 模型在数学上达到与 o1-mini 持平:

| 模型 | AIME 24 | MATH-500 |
|---|---|---|
| **DeepSeek-R1-Distill-Qwen-1.5B** | 28.9% | 83.9% |
| **DeepSeek-R1-Distill-Qwen-7B** | 55.5% | 92.0% |
| **DeepSeek-R1-Distill-Llama-70B** | 70.0% | 94.5% |
| OpenAI o1-mini | 63.6% | 90.0% |

---

## 5. Kimi k1.5(2025-01,Moonshot AI)

Kimi k1.5 与 R1 同期发布,RLVR 提供了不同视角:

| 维度 | R1 | **Kimi k1.5** |
|---|---|---|
| **算法** | GRPO | **Online Mirror Descent(自己变体)** |
| **长度控制** | 无 | **显式长度奖励(避免过度思考)** |
| **冷启动** | 数千条 | **精心设计的 long-CoT SFT** |
| **长 CoT 长度** | 自由 | **受控(由 reward shaping)** |
| **结果** | o1 水平 | **o1 水平(部分超越)** |

### 5.1 Kimi 长度控制公式

$$
\text{len\_reward}(i) = \begin{cases} \lambda & \text{if correct} \\ \min(0, \lambda) & \text{if incorrect} \end{cases}, \lambda = 0.5 - \frac{\text{len}(i) - \text{min\_len}}{\text{max\_len} - \text{min\_len}}
$$

> 答对时:**短答案奖励更高**;答错时:**长答案额外惩罚**(打破"越错越长")。

---

## 6. Qwen3 的"思考融合"(2025-04)

Qwen3 通过**单一模型融合"思考"和"非思考"两种模式**:

| 模式 | 触发方式 | 用途 |
|---|---|---|
| **思考模式** | 默认 | 复杂推理(math/code/agent) |
| **非思考模式** | `/no_think` 标记 | 快速问答 |

### 6.1 训练数据混合

```json
{
  "messages": [...],
  "think": "先一步步分析...",
  "answer": "答案是 42"
}
```

- 通过**特殊字符串早停**(用户预算耗尽时插入"我必须直接回答")
- 用户可通过 prompt 控制是否思考

### 6.2 训练流程

```text
Qwen3-32B-Base
  ↓
Long-CoT SFT(融合 thinking / no-thinking)
  ↓
按 pass@k 过滤难度
  ↓
GRPO 在 3995 个样本上 RL
  ↓
Qwen3-32B(融合版)
```

---

## 7. 2026 生态速览

| 流派 | 代表 | 关键贡献 |
|---|---|---|
| **纯 RL 涌现派** | DeepSeek-R1-Zero、o1 | 无 SFT,模型自发学会长 CoT |
| **冷启动派** | DeepSeek-R1、Qwen3 | 数千条冷启动数据 + RL |
| **长度控制派** | Kimi k1.5、L1(2025) | 显式 length reward |
| **过程奖励派** | OpenAI o1 PRM | PRM(Process Reward Model)+ RL |
| **小数据派** | s1(Stanford 1K)、LIMO(800) | 极致少量样本 + SFT |
| **GRPO 变体派** | Dr.GRPO、Hybrid-GRPO、MAPO、GMPO | 修正 GRPO 长度偏差 |

---

## 8. 生产最佳实践

### 8.1 何时选 RLVR 而非 RLHF?

| 场景 | 选型 |
|---|---|
| **数学/代码/证明/agent** | ✅ RLVR 必选 |
| **创意写作 / 风格迁移** | ❌ RLHF |
| **QA / 检索 / 摘要** | ⚠️ 混合 |
| **安全 / 价值观** | ❌ RLHF(主观,不能程序化) |
| **结构化输出(JSON/Schema)** | ✅ RLVR |
| **Tool use / 工具调用** | ✅ RLVR(可验证执行结果) |

### 8.2 RLVR 训练闭环

```text
问题输入 q
  ↓
模型多次采样(G 个回答, G=8~64)
  ↓
验证器 verifier(q, o_i) → r_i ∈ {0, 1}
  ↓
GRPO 优势 A_i = (r_i - mean) / std
  ↓
策略更新(PPO-clip + KL 约束)
  ↓
下一轮模型更倾向产生"可通过验证的回答"
```

### 8.3 关键设计

| 决策 | 推荐 |
|---|---|
| **G(组大小)** | 8-16(简单) / 32-64(困难) |
| **epsilon(clip)** | 0.1-0.2 |
| **beta(KL 系数)** | 0.01-0.04 |
| **奖励归一化** | 必做(防止方差爆炸) |
| **冷启动数据** | 1K-10K 长 CoT(质量 > 数量) |
| **长度奖励** | 必加(防过度思考) |
| **pass@k 过滤** | 30-70% 难度(易+难都不利) |

### 8.4 失败模式与缓解

| 失败 | 根因 | 缓解 |
|---|---|---|
| **GRPO 长度偏差** | 错误回答越长惩罚越轻 | 用 Dr.GRPO(去归一化) |
| **奖励黑客** | 验证器被糊弄 | 多样化验证 + 隐藏测试 |
| **Aha moment 失败** | base 模型无推理能力 | 冷启动 + 课程学习 |
| **训练不稳定** | 优势方差大 | 自适应 KL + 奖励归一化 |
| **可迁移性差** | 只在数学/代码上 | RLVR + SFT + RLHF 三段式 |

### 8.5 与 Test-Time Compute 协同

```
Pre-training
  ↓
SFT(冷启动 long-CoT)
  ↓
RLVR(GRPO + PRM, 训练时多算)
  ↓
Test-Time Compute(推理时多算:Best-of-N / Beam Search / DVTS)
  ↓
最终:1B 模型 + 强 RLVR + 强 TTS ≈ 70B 模型
```

---

## 9. See Also(官方源)

| 来源 | 链接 |
|---|---|
| **DeepSeek-R1 arXiv:2501.12948** | https://arxiv.org/abs/2501.12948 |
| **DeepSeek-R1 Nature 2025** | https://nature.com/articles/s41586-025-.....(待正式发表) |
| **GRPO DeepSeekMath arXiv:2402.03300** | https://arxiv.org/abs/2402.03300 |
| **Kimi k1.5 论文** | https://arxiv.org/abs/2501.12599 |
| **Qwen3 论文** | https://arxiv.org/abs/2505.09388 |
| **OpenAI o1 Blog** | https://openai.com/index/learning-to-reason-with-llms/ |
| **s1(Stanford 1K)** | https://arxiv.org/abs/2501.19393 |
| **LIMO(Less is More)** | https://arxiv.org/abs/2502.03387 |
| **Dr.GRPO 修正** | https://arxiv.org/abs/2503.20783 |
| **RLVR 教材** | https://www.rlvrbook.com/ |
| **datawhale RLVR 课程** | https://github.com/datawhalechina/diy-llm |
| **关键术语英中对照** | RLVR / GRPO / Verifiable Reward / Outcome Reward Model / Process Reward Model / Aha Moment / Cold Start / Length Reward / Group Relative |

---

## 10. 一句话结论(2026)

**RLVR 是 2025-2026 reasoning LLM 革命的"灵魂算法"——用 0 美元人类标注成本 + 客观验证器 + GRPO,即可在数学/代码/agent 任务上达到 o1 水平;DeepSeek-R1 用 557 万美元证明"小公司也能做出顶级 reasoning LLM",彻底改变了 AI 训练的**经济模型**;2026 主流观点:RLVR 不会取代 RLHF,但所有 reasoning LLM 都基于 RLVR;**"RLVR 之外,无 reasoning"**。**

## 相关链接

- [[05_大模型/09_推理模型/02_索引|DeepSeek R1 技术分析]] — RLVR 的代表应用
- [[概念/Training/rlhf|RLHF]] — RLVR 的基础方法
- [[概念/Training/grpo|GRPO]] — RLVR 常用的优化算法
- [[概念/LLM/reasoning-models|推理模型]] — RLVR 训练推理模型
- [[概念/LLM/test-time-compute|Test-Time Compute]] — RLVR 模型利用的推理时计算
