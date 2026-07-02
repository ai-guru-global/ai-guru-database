---
title: Test-Time Compute（测试时计算）
category: concepts
tags:
  - llm
  - test-time-compute
  - reasoning
  - scaling
  - o1
  - deepseek-r1
  - inference
aliases:
  - Test-Time Compute
  - TTC
  - 测试时计算
  - Inference-Time Compute
relationships:
  - target: "_concepts/reasoning-models"
    type: enables
  - target: "_concepts/deepseek-series"
    type: example_of
  - target: "_concepts/decoding-strategies"
    type: alternative_to
summary: Test-Time Compute 指在推理阶段投入更多计算资源（如更多采样、更长思考、自我修正）来提升模型输出质量，是突破预训练 Scaling Law 的重要方向。
lifecycle: stable
tier: core
created: 2026-06-25
updated: 2026-06-25
---

# Test-Time Compute（测试时计算）

## 一句话总结

**Test-Time Compute** 是在推理阶段通过增加计算（更多思考步骤、多次采样、验证修正）来提升模型性能的技术方向。

---

## 背景：两条 Scaling Law

传统大模型能力提升主要依赖：

1. **预训练 Scaling Law**：更多数据、更多参数、更多算力；
2. **Test-Time Compute**：固定模型，在推理时投入更多计算。

OpenAI 的 o1/o3 和 DeepSeek-R1 证明：**后者可以在不增加模型参数的情况下显著提升推理能力**。

---

## 主要方法

### 1. 延长思考链（Longer Chain-of-Thought）

让模型在回答前进行更多内部推理：

```
Question → Think step by step → ... → Final Answer
```

- 强制模型输出完整推理过程；
- 使用 `<think>...</think>` 等特殊 token 区分；
- 代表：o1、DeepSeek-R1。

### 2. 采样更多候选（Best-of-N）

生成 N 个候选答案，选择最优：

```
Answers = {a_1, a_2, ..., a_N}
Final = argmax Reward(a_i)
```

- 需要奖励模型或验证器；
- 计算成本随 N 线性增长。

### 3. 自我修正（Self-Correction）

模型生成答案后，再次检查并修正：

```mermaid
flowchart LR
    A[生成初稿] --> B[自我检查]
    B --> C{发现错误?}
    C -->|是| D[修正]
    C -->|否| E[输出]
    D --> B
```

### 4. 树搜索（Tree Search）

将推理建模为树搜索：

- **Monte Carlo Tree Search（MCTS）**：评估多条推理路径；
- **Process Reward Model（PRM）**：对每个推理步骤打分；
- **Beam Search over Reasoning**：保留 top-k 推理路径。

---

## Test-Time Compute vs 训练时计算

| 维度 | 训练时计算 | Test-Time Compute |
|---|---|---|
| **投入阶段** | 训练 | 推理 |
| **模型参数** | 可变 | 固定 |
| **适用场景** | 通用能力提升 | 复杂推理任务 |
| **成本模式** | 一次性高成本 | 每次请求可变成本 |
| **代表技术** | 预训练、SFT、RLHF | o1、R1、MCTS、PRM |

---

## 代价与权衡

| 优势 | 代价 |
|---|---|
| 不增加模型大小 | 推理延迟显著增加 |
| 可针对问题动态调整 | 需要更复杂的推理基础设施 |
| 在数学/代码任务上效果显著 | 简单任务可能过度思考 |

---

## 代表模型

| 模型 | 机制 |
|---|---|
| **OpenAI o1/o3** | 内部长思考链 + RL |
| **DeepSeek-R1** | GRPO + 长推理链 |
| **QwQ** | 阿里推理模型 |
| **Kimi k1.5** | 长上下文 + Test-Time 推理 |

---

## 实践建议

1. **复杂任务使用**：数学、代码、逻辑推理；
2. **延迟敏感场景慎用**：客服、实时对话；
3. **结合预算控制**：设置最大 thinking token 数；
4. **需要评估 ROI**：对比训练和推理投入的成本效益。

---

## 延伸阅读

- [[_concepts/deepseek-series|DeepSeek 系列]]
- [[_concepts/grpo|GRPO]]
- [[_concepts/reasoning-models|推理模型]]
- [[_concepts/decoding-strategies|解码策略]]
