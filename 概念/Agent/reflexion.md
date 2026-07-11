---
title: "Reflexion（自我反思）"
category: -concepts
tags: [reflexion, self-reflection, agent-loop, reasoning, llm, meta-learning]
aliases:
  - "Reflexion"
  - "Reflexion Framework"
  - "自我反思"
relationships:
  - target: "概念/agent-loop"
    type: belongs_to
  - target: "概念/reasoning-models"
    type: applied_in
  - target: "概念/cot-react-reasoning-prompt"
    type: alternative
sources:
  - Agent/Agent_Foundations/
summary: "Reflexion 是 Shinn et al. 2023 提出的 Agent 自我反思框架，通过"尝试-失败-反思-记忆注入"循环让 Agent 从错误中学习，无需额外训练即可显著提升性能。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-06-24
---

# Reflexion（自我反思）

## 核心要点

- **提出**：Shinn et al., 2023-03（论文 "Reflexion: Language Agents with Verbal Reinforcement Learning"）
- **核心思想**：Agent 在**多轮尝试**中，通过**自然语言反思**记录错误并注入下一轮 prompt，无需更新模型权重。
- **三组件**：
  - **Actor**：执行任务的 LLM Agent
  - **Evaluator**：评估任务结果的模块（规则 / LLM）
  - **Self-Reflection**：失败时生成"反思文字"并存入记忆
- **核心优势**：
  - **无需训练 / fine-tuning**
  - 比 ReAct 多轮性能显著提升（HumanEval 88% → 96%）
  - 反思经验可累积

## 一句话解释

> Reflexion = "Agent 写日记"；做错了就反思，把反思结果注入下一轮 prompt，下一次做得更好。

## 工作循环

```
第 1 轮:
  Actor 执行任务 → 失败
  Evaluator 评估 → "代码测试失败，期望 [1,2,3] 实际 [1,2]"
  Self-Reflection → "我应该检查边界情况，比如空列表..."

第 2 轮:
  Actor 读取反思 → 改进策略
  执行任务 → 仍可能失败
  Self-Reflection → "上次改了空列表，但没考虑负数..."

第 3 轮:
  Actor 读取反思 → 再次改进
  执行任务 → ✅ 成功
```

## 与 ReAct 对比

| 维度 | ReAct | Reflexion |
|------|-------|-----------|
| 单轮机制 | 思考-行动-观察 | 思考-行动-观察 |
| 多轮支持 | ❌（每轮独立）| ✅（带反思记忆）|
| 学习机制 | 无 | 反思注入 prompt |
| 训练需求 | 无 | 无 |
| 性能提升 | 基线 | 显著 |
| 适用 | 一次性任务 | **多轮迭代**任务 |

## 关键代码模式

```python
class ReflexionAgent:
    def __init__(self, llm, evaluator, max_trials=3):
        self.llm = llm
        self.evaluator = evaluator
        self.max_trials = max_trials
        self.reflections = []  # 反思记忆

    def run(self, task):
        for trial in range(self.max_trials):
            # 1. Actor 执行（含反思记忆）
            result = self.llm.generate(
                task=task,
                reflections=self.reflections  # 注入历史反思
            )

            # 2. Evaluator 评估
            success, feedback = self.evaluator(result)

            if success:
                return result

            # 3. Self-Reflection（LLM 自我批评）
            reflection = self.llm.reflect(
                task=task,
                result=result,
                feedback=feedback
            )
            self.reflections.append(reflection)

        return result  # 返回最后尝试
```

## 反思 Prompt 模板

```python
REFLECTION_PROMPT = """你刚才执行了一个任务，结果失败了。请反思：

任务：{task}
执行结果：{result}
失败反馈：{feedback}

请用 2-3 句话回答：
1. 为什么失败了？
2. 下次应该怎么做才能避免？
3. 有什么启发可以记住？

仅输出反思文字，不需要再次执行。
"""
```

## 性能基准

| 任务 | ReAct | Reflexion | 提升 |
|------|-------|-----------|------|
| HumanEval | 88.4% | **96.3%** | +8% |
| MBPP | 76.2% | **87.3%** | +11% |
| ALFWorld | 75.6% | **97.6%** | +22% |
| HotPotQA | 32.4% | **52.5%** | +20% |

## 何时使用

✅ **推荐**：
- 代码生成（错误可识别）
- 多步推理（错误可分析）
- 决策任务（可评估结果）
- 需要"试错学习"的任务

⚠️ **不推荐**：
- 单轮一次性任务（ReAct 足够）
- 反思成本高于价值（简单任务）
- 错误信号模糊（无法反思）

## 变种与扩展

- **Reflexion + CoT**：反思嵌入 CoT
- **Self-Refine**：每轮都反思-改进
- **CRITIC**：基于外部反馈而非 LLM 反思
- **Voyager**：Reflexion + Skill Library（技能累积）

## Related

- [[概念/agent-loop]] — Agent Loop 总览
- [[概念/cot-react-reasoning-prompt]] — CoT / ReAct
- [[概念/reasoning-models]] — 推理模型
- [[概念/tot]] — ToT（另一种推理增强）