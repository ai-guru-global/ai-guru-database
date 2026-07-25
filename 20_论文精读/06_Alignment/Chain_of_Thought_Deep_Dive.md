---
title: "论文深度解读: Chain-of-Thought — 让 LLM 逐步推理"
category: "20-papers"
tags: ["paper", "chain-of-thought", "reasoning", "prompting", "CoT", "few-shot", "Wei"]
summary: "Chain-of-Thought (Wei et al., 2022) 发现通过在 prompt 中加入推理步骤示例，可以让 LLM 在复杂推理任务上性能大幅提升，开创了推理链提示的整个研究方向。"
created: 2026-06-04
updated: 2026-06-04
tier: supporting
aliases:
  - "Chain Of Thought Deep Dive"
  - "Chain of Thought Deep Dive"
  - Chain_of_Thought_Deep_Dive
sources: []

---
# 论文深度解读: Chain-of-Thought — 让 LLM 逐步推理

> **论文**: *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models* (Wei et al., 2022, Google Brain)
> **重要性**: 开创推理链提示范式，是 GPT-4o1/DeepSeek-R1 等推理模型的思想源头
> **引用**: 8000+

---

## 1. 一句话理解

> **CoT 的核心发现: 在 few-shot 示例中加入「中间推理步骤」，LLM 就能像人类一样逐步推理——从直接猜答案变成先思考再回答，在数学/逻辑/常识推理任务上性能提升 10-40%。**

---

## 2. 研究背景

### 2.1 CoT 之前 LLM 的推理困境

```
标准 prompting vs CoT prompting:

标准 prompting (直接回答):
Q: Roger has 5 tennis balls. He buys 2 cans of tennis balls.
   Each can has 3 tennis balls. How many tennis balls does he have now?
A: 11  ← LLM 直接给出答案，经常算错

CoT prompting (逐步推理):
Q: Roger has 5 tennis balls. He buys 2 cans of tennis balls.
   Each can has 3 tennis balls. How many tennis balls does he have now?
A: Roger started with 5 balls. 2 cans of 3 balls each is 6 balls.
   5 + 6 = 11. The answer is 11.  ← 逐步推理，更准确
```

### 2.2 LLM 推理失败的模式

| 任务类型 | 标准 prompting 表现 | 失败原因 |
|----------|-------------------|----------|
| 多步算术 | 差 (~20-60%) | 一步算出答案容易出错 |
| 常识推理 | 中等 | 需要多步逻辑链 |
| 符号推理 | 差 | 需要跟踪中间状态 |
| 逻辑推理 | 差 | 需要演绎推理链 |

---

## 3. 核心方法

### 3.1 Chain-of-Thought Prompting

```
CoT Prompting 方法:

标准 few-shot:
  示例: Q→A (只有问题和答案)
  测试: Q→A

CoT few-shot:
  示例: Q→推理过程→A (包含中间推理步骤)
  测试: Q→推理过程→A

关键: 不需要微调模型，只需改变 prompt 格式
```

### 3.2 三种 prompting 方式对比

| 方式 | 格式 | 示例 | 效果 |
|------|------|------|------|
| **Zero-shot** | 直接提问 | "Q: ... A:" | 基线 |
| **Few-shot** | 给几个 Q→A 示例 | 标准 few-shot | 中等 |
| **CoT Few-shot** | 给几个 Q→推理→A 示例 | 包含推理链 | **最佳** |

### 3.3 Zero-shot CoT

**发现** (Kojima et al., 2022): 甚至不需要示例，只需加一句「Let's think step by step」就能触发推理。

```
Zero-shot CoT:

Q: [问题]
A: Let's think step by step.  ← 这一句话触发推理链

效果: GSM8K 从 17.7% → 78.7% (仅加这句话!)
```

---

## 4. 核心实验结果

### 4.1 数学推理 (GSM8K)

| 模型 | 标准 prompting | CoT prompting | 提升 |
|------|---------------|---------------|------|
| **PaLM 540B** | 56.5% | **81.3%** | +24.8% |
| **LaMDA 137B** | 18.0% | 43.1% | +25.1% |
| **GPT-3 175B** | 17.7% | 63.1% | +45.4% |
| **PaLM 62B** | 43.1% | 69.1% | +26.0% |

### 4.2 常识推理

| 基准 | 标准 | CoT | 提升 |
|------|------|-----|------|
| **CommonsenseQA** | 63.3% | 72.7% | +9.4% |
| **StrategyQA** | 63.5% | 72.0% | +8.5% |
| **ARC-Challenge** | 73.0% | 82.0% | +9.0% |

### 4.3 关键发现

1. **规模效应**: CoT 只在足够大的模型 (>100B) 上有效，小模型加 CoT 反而可能变差
2. **涌现能力**: CoT 推理是 LLM 的「涌现能力」——在模型规模超过阈值后突然出现
3. **不需要微调**: 纯粹通过 prompt 工程就能激活推理能力
4. **推理质量**: CoT 生成的推理步骤大多是正确的（人工评估 ~90% 准确率）

---

## 5. CoT 的进化路线

### 5.1 CoT 方法族谱

```
CoT 方法进化:

Chain-of-Thought (Wei 2022)
│   few-shot + 推理步骤示例
│
├── Zero-shot CoT (Kojima 2022)
│   "Let's think step by step"
│
├── Self-Consistency (Wang 2022)
│   多次采样 CoT，多数投票取答案
│   GSM8K: 81.3% → 90.1%
│
├── Tree of Thoughts (Yao 2023)
│   探索多条推理路径，回溯搜索
│
├── Least-to-Most (Zhou 2022)
│   分解为子问题，从简到难
│
├── Complex CoT (Fu 2023)
│   使用更复杂的推理链示例
│
├── Automatic CoT (Zhang 2023)
│   自动生成 CoT 示例 (无需人工)
│
└── Step-back Prompting (Zheng 2023)
    先抽象问题，再具体推理
```

### 5.2 从 CoT 到推理模型

```
CoT 到推理模型的技术路线:

CoT Prompting (2022)
│   不改模型，只改 prompt
│
├── Self-Consistency (2022)
│   多次推理 + 投票
│
├── Process Reward Model (PRM, 2023)
│   对每步推理打分
│
├── GPT-4o1 (OpenAI, 2024)
│   内置推理链，强化学习训练
│   "思考" → "回答" 分离
│
├── o3 (OpenAI, 2024)
│   更强推理，可变思考时间
│
├── DeepSeek-R1 (2025)
│   开源推理模型
│   RL 训练自发产生 CoT
│
└── Qwen3/QwQ (2025-2026)
    开源推理模型家族
    混合思考模式
```

---

## 6. CoT 的理论理解

### 6.1 为什么 CoT 有效？

| 理论 | 解释 | 证据 |
|------|------|------|
| **计算时间假说** | CoT 让模型生成更多 token → 更多计算 | 长 CoT 通常更好 |
| **工作记忆假说** | CoT 将中间结果写入文本 → 缓解上下文窗口限制 | 符号推理任务验证 |
| **分布对齐假说** | CoT 示例引导模型进入「推理模式」的分布 | 少量示例就有效 |
| **规划假说** | CoT 迫使模型先规划再执行 | 复杂多步任务效果显著 |

### 6.2 CoT 的局限性

| 局限 | 说明 | 缓解方案 |
|------|------|----------|
| **幻觉推理** | 推理步骤看似合理但实际错误 | Self-Consistency + 验证 |
| **推理偏差** | 受示例中的推理模式偏差影响 | 多样化示例 |
| **小模型无效** | <100B 模型加 CoT 可能变差 | 模型蒸馏 |
| **不忠实** | 推理过程可能不是模型真实思考路径 | 可解释性研究 |
| **效率低** | 推理链增加 5-10× 生成 token | 推理模型（内置） |

---

## 7. CoT 对 LLM 生态的影响

| 影响领域 | 说明 |
|----------|------|
| **Prompt Engineering** | CoT 成为标准技巧，几乎所有 LLM 应用都在用 |
| **推理模型** | GPT-4o1/o3/R1 直接内置 CoT 能力 |
| **数学/代码** | CoT 让 LLM 在数学竞赛/编程中达到专家水平 |
| **Agent** | Agent 的规划和推理都依赖 CoT 范式 |
| **RLHF** | 过程奖励模型 (PRM) 对 CoT 每步打分 |

---

## 8. 工程实践

| 关注点 | 建议 |
|--------|------|
| **示例选择** | 选择推理步骤清晰、覆盖多种推理模式的示例 |
| **Self-Consistency** | 复杂任务多次采样 + 多数投票，可提升 5-10% |
| **Zero-shot 备选** | 无法构造示例时，用 "Let's think step by step" |
| **温度设置** | CoT 用较低温度 (0.0-0.3) 保证推理一致性 |
| **验证步骤** | 在 CoT 末尾加 "Let me verify" 可减少推理错误 |

---

## References

- Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (2022)
- Kojima et al., "Large Language Models are Zero-Shot Reasoners" (2022)
- Wang et al., "Self-Consistency Improves Chain of Thought Reasoning" (2022)
- Yao et al., "Tree of Thoughts: Deliberate Problem Solving" (2023)

---

## Related

- [[../../概念/LLM/cot-react-reasoning-prompt|CoT 推理概念卡]] — 思维链的概念定义
- [[../../05_大模型/09_Reasoning_Models|推理模型]] — 推理增强 LLM 架构
- [[../../05_大模型/05_LLM_Architectures/LLM_Internals_Inference|LLM 推理内部机制]] — 推理阶段技术细节
- [[../../03_深度学习/03_Optimization/Optimization|优化方法]] — 推理优化与解码策略
- [[../../15_智能体/01_Agent_Foundations|Agent 基础]] — CoT 在 Agent 推理中的应用
