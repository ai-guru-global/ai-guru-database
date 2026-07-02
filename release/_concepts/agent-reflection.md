---
title: "Agent 反思（Reflection）"
category: -concepts
tags: ["agent", "reflection", "self-refine", "reflexion", "self-improvement", "verification"]
relationships:
  - target: "_concepts/ai-agents"
    type: core_ability
  - target: "_concepts/agent-planning"
    type: improves
  - target: "_concepts/agent-loop"
    type: extends
sources:
  - 15_Agent_Production/Agent_Foundations/AI_Agents.md
  - 15_Agent_Production/README.md
summary: "Agent 反思是让 Agent 评估自身输出、发现错误并自我修正的能力。Reflexion（反思后重试）、Self-Refine（自我打磨）、Self-Verification（自我验证）让 Agent 从'一次性回答'进化为'迭代改进'，显著提升复杂任务成功率。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.79
lifecycle: stable
lifecycle_changed: 2026-06-23
tier: core
created: 2026-06-23
updated: 2026-06-23
aliases:
  - "Agent Reflection"
  - "agent reflection"

---
# Agent 反思（Reflection）

## 核心要点

- **反思 = 自我评估 + 改进**：Agent 不只执行，还评估"我做得对吗"，错了就修正。
- **三大机制**：Reflexion（失败后反思重来）、Self-Refine（生成-批评-修改循环）、Self-Verification（独立验证结果）。
- **价值**：无反思的 Agent 成功率遇瓶颈，加反思可提升 10-30%（尤其在代码、数学、推理任务）。

## 一句话理解

没有反思的 Agent 像"交完卷就走的学生"；有反思的 Agent 像"检查一遍发现错误再改"的好学生，越复杂的任务反思价值越大。

## 详细内容

### 三种反思机制

```
Reflexion（反思重试）：
  尝试任务 → 失败 → 反思"为什么失败" → 带着教训重试 → 成功
  适合：有明确成败信号的任务（代码编译、测试通过）

Self-Refine（自我打磨）：
  生成初稿 → 自我批评"哪里不好" → 修改 → 再批评 → ... → 满意
  适合：开放式任务（写作、翻译），无明确对错

Self-Verification（自我验证）：
  生成答案 → 用另一个 prompt 验证"这个答案对吗" → 交叉确认
  适合：事实性任务，需防幻觉
```

### 反思的实现模式

```python
# Reflexion 模式（简化）
def agent_with_reflection(task, max_attempts=3):
    memory = []  # 反思记忆
    for attempt in range(max_attempts):
        result = execute(task, reflections=memory)
        if verify_success(result):
            return result
        # 反思：分析失败原因
        critique = reflect(task, result, memory)
        memory.append(critique)  # 累积教训
    return result  # 最后一次尝试
```

### 反思的代价与边界

| 维度 | 评估 |
|------|------|
| **收益** | 复杂任务成功率 +10-30% |
| **成本** | 每次反思多 1-3 次 LLM 调用（token 翻倍） |
| **风险** | 过度反思（overthinking）反而引入错误 |
| **适用** | 有验证信号的任务（代码/数学/工具调用） |
| **不适用** | 纯创意/主观任务（反思无客观标准） |

### 2026 进展

- **推理模型减少反思需求**：o1/R1 内部已含自我验证，显式反思的边际收益下降
- **过程奖励（PRM）**：奖励模型的每一步推理，替代部分显式反思
- **反思 + 工具验证**：反思不只靠 LLM，结合代码执行/搜索交叉验证更可靠

## Related

- [[_concepts/ai-agents|AI Agent]] — Agent 基础
- [[_concepts/agent-planning|Agent 规划]] — 反思改进规划
- [[_concepts/agent-loop|Agent Loop]] — 反思在循环中的位置
- [[_concepts/agent-evaluation-benchmarks|Agent 评估基准]] — 评估反思效果
- [[15_Agent_Production/Agent_Foundations/AI_Agents|AI Agents 详解]]
