---
title: Neuro-Symbolic AI（神经符号 AI）
category: concepts
tags:
  - llm
  - neuro-symbolic
  - symbolic-ai
  - reasoning
  - knowledge-graph
  - logic
  - hybrid-ai
aliases:
  - Neuro-Symbolic AI
  - 神经符号 AI
  - Neural-Symbolic
  - 混合 AI
relationships:
  - target: "概念/reasoning-models"
    type: related_to
  - target: "概念/tool-use"
    type: related_to
summary: Neuro-Symbolic AI 结合神经网络的感知学习能力和符号系统的可解释推理能力，旨在解决纯神经网络在精确推理、可解释性和知识组合上的局限。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# Neuro-Symbolic AI（神经符号 AI）

## 一句话总结

**Neuro-Symbolic AI** 结合**神经网络**（感知、学习）和**符号系统**（逻辑、推理），让 AI 既能理解复杂输入，又能进行精确、可解释的推理。

---

## 为什么需要 Neuro-Symbolic AI？

### 纯神经网络的局限

| 局限 | 说明 |
|---|---|
| **幻觉** | 可能生成看似合理但错误的内容 |
| **缺乏精确推理** | 数学、逻辑推理容易出错 |
| **可解释性差** | 决策过程黑盒 |
| **知识更新困难** | 参数化知识难以快速更新 |
| **组合泛化弱** | 难以组合已有知识解决新问题 |

### 纯符号系统的局限

| 局限 | 说明 |
|---|---|
| **感知能力弱** | 难以处理图像、语音等非结构化数据 |
| **知识获取成本高** | 规则需要人工编写 |
| **灵活性差** | 难以处理模糊和不确定性 |

---

## 核心思想

```mermaid
flowchart LR
    A[非结构化输入] --> B[神经网络]
    B --> C[符号表示]
    C --> D[符号推理引擎]
    D --> E[可解释输出]
```

神经网络负责感知和特征提取，符号系统负责精确推理。

---

## 主要方法

### 1. 神经-符号混合架构

- 神经网络处理输入；
- 符号推理层（如 Prolog、SAT Solver、知识图谱）执行逻辑推理；
- 例如：视觉问答中，CNN 提取对象，知识图谱推理关系。

### 2. 将 LLM 与符号工具结合

```python
# LLM 生成逻辑表达式
logic_expr = llm("将问题转换为谓词逻辑")
# 符号求解器验证
result = prolog_solver(logic_expr)
# LLM 生成自然语言解释
answer = llm(f"基于结果 {result} 给出解释")
```

### 3. 知识图谱增强 LLM

- 将 LLM 输出链接到知识图谱实体和关系；
- 用图谱约束减少幻觉；
- 支持可解释的推理路径。

### 4. Neural Theorem Proving

- 神经网络辅助定理证明器；
- 在数学证明和形式化验证中应用。

---

## 典型应用

| 领域 | 应用 |
|---|---|
| **视觉推理** | 对象识别 + 空间关系推理 |
| **数学证明** | 神经网络提出引理，符号系统验证 |
| **法律推理** | 案例匹配 + 法条逻辑演绎 |
| **医疗诊断** | 症状识别 + 医学知识推理 |
| **数据库查询** | NL2SQL + 约束检查 |

---

## 与 Tool Use 的关系

Neuro-Symbolic AI 常通过 Tool Use 实现：

- LLM 作为“神经”部分理解问题；
- 符号求解器、数据库、知识图谱作为“符号”工具；
- Function Calling 连接两者。

---

## 代表工作

- **AlphaProof / AlphaGeometry**：DeepMind 的神经符号数学证明；
- **Logic-Enhanced Language Models**：将逻辑约束融入语言模型；
- **Neural Theorem Provers**：如 Holophrasm、GPT-f。

---

## 挑战

| 挑战 | 说明 |
|---|---|
| **桥接神经与符号表示** | 两者语义空间差异大 |
| **训练数据稀缺** | 带符号标注的数据少 |
| **可扩展性** | 符号推理在大规模问题上可能爆炸 |
| **端到端优化** | 两个系统联合训练困难 |

---

## 延伸阅读

- [[概念/reasoning-models|推理模型]]
- [[概念/tool-use|Tool Use]]
- [[概念/function-calling|Function Calling]]
- [[概念/test-time-compute|Test-Time Compute]]
