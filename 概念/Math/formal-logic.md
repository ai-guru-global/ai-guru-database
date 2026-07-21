---
title: "形式逻辑 (Formal Logic)"
category: -concepts
tags: ["formal-logic", "reasoning", "symbolic-ai", "knowledge-representation"]
summary: "形式逻辑是 AI 推理能力的数学基础——从命题逻辑到一阶逻辑，再到现代 LLM 的神经符号推理。"
created: 2026-06-12
updated: 2026-07-21
tier: core
aliases:
  - "Formal Logic"
  - "formal logic"
lifecycle: reviewed
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.8
sources:
  - 大模型/Reasoning_Models/o1_Class_Reasoning_Models.md
  - 大模型/Reasoning_Models/Process_Reward_Models.md
relationships:
  - target: "概念/cot-react-reasoning-prompt"
    type: related_to
  - target: "概念/reasoning-models"
    type: related_to
---
# 形式逻辑 (Formal Logic)

> 形式逻辑是 AI 推理能力的数学基础——从命题逻辑到一阶逻辑，再到现代 LLM 的神经符号推理。

## 逻辑层次

```
命题逻辑 (Propositional Logic)
  → 一阶逻辑 (First-Order Logic)
    → 高阶逻辑 (Higher-Order Logic)
      → 模态逻辑 (Modal Logic)
        → 时序逻辑 (Temporal Logic)
```

## 与 AI 的关系

- **符号主义 AI**: 用逻辑规则表示知识（专家系统、知识图谱）
- **连接主义 AI**: 用神经网络隐式学习逻辑（LLM 推理）
- **神经符号融合**: 将逻辑约束嵌入神经网络训练

## LLM 推理与逻辑

```
Chain-of-Thought ≈ 自然语言化的逻辑推导
o1/R1 类推理模型 ≈ 内化的形式推理过程
Process Reward Model ≈ 逐步验证逻辑正确性
```

## 相关阅读

- [[大模型/Reasoning_Models/o1_Class_Reasoning_Models]] — o1 类推理模型
- [[大模型/Reasoning_Models/Process_Reward_Models]] — 过程奖励模型
- [[数学基础/Data_Structures_Algorithms/Data_Structures_Algorithms]] — 数据结构 与算法

---

## 2026 形式逻辑生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **CoT 推理** | 思维链推理，逻辑推理基础 | GA |
| **过程奖励模型** | 奖励推理过程而非结果 | GA |
| **逻辑编程** | Prolog 等逻辑编程语言 | GA |
| **形式验证** | 程序正确性形式验证 | GA |
| **神经符号 AI** | 神经网络 + 符号逻辑 | 研究 |

## 生产最佳实践

1. **CoT 提示**：复杂推理任务用 CoT 提示
2. **逻辑验证**：关键决策用形式验证
3. **过程奖励**：推理模型用过程奖励训练
4. **符号约束**：输出用符号逻辑约束
5. **可解释性**：逻辑推理提高可解释性
