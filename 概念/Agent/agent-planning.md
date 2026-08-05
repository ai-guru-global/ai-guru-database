---
title: "Agent 规划（Planning）"
category: -concepts
tags: ["agent", "planning", "plan-and-execute", "rewoo", "task-decomposition", "reasoning"]
relationships:
  - target: "概念/Agent/ai-agents"
    type: core_ability
  - target: "概念/Agent/agent-loop"
    type: precedes
  - target: "概念/Agent/agent-reflection"
    type: complementary
  - target: "概念/LLM/reasoning-models"
    type: benefits_from
sources:
  - "https://arxiv.org/abs/2305.14992"  # ReWOO
  - "https://arxiv.org/abs/2305.18323"  # Plan-and-Solve
summary: "Agent 规划是把复杂任务拆解为可执行子步骤的能力。从 ReAct 的'边想边做'到 Plan-and-Execute 的'先规划再执行'再到 ReWOO 的'一次性规划'，规划质量直接决定 Agent 能否完成多步任务。"
lifecycle: reviewed
tier: core
created: 2026-06-23
updated: 2026-07-21
aliases:
  - "Agent Planning"
  - "agent planning"
name_zh: "Agent 规划"
---

# Agent 规划（Planning）

> 中文简称：Agent 规划

## 核心要点

- **规划是 Agent 的"大脑前额叶"**：决定做什么、按什么顺序、何时停止
- **三种范式**：ReAct（交错推理-行动）、Plan-and-Execute（先规划全流程再执行）、ReWOO（一次性生成所有步骤再执行）
- **关键挑战**：任务拆解粒度、规划与现实的偏差、动态重规划

## 一句话理解

规划差 Agent 像"想到哪做到哪"易跑偏；规划好 Agent 像"项目经理"先列清单再逐项推进，遇到偏差还能调整。

## 三种规划范式详解

### 1. ReAct（交错式）

```
思考 → 行动 → 观察 → 思考 → 行动 → 观察 → ...
```

| 优势 | 劣势 |
|------|------|
| 灵活，能根据观察调整 | 每步都调 LLM，慢且贵 |
| 实现简单，无需预规划 | 中途出错会连锁 |
| 适合探索性任务 | 无全局视野，易局部最优 |

**适用场景**：探索性任务、信息不完整、需要动态调整

### 2. Plan-and-Execute（先规划后执行）

```
1. Planner LLM：生成完整步骤列表 [step1, step2, ..., stepN]
2. Executor LLM：逐个执行
3. Replanner：执行偏差大时重规划
```

| 优势 | 劣势 |
|------|------|
| 规划一次成本低 | 初始规划可能不切实际 |
| 步骤可并行 | 需要额外 Replanner |
| 全局视野，避免局部最优 | 对模型规划能力要求高 |

**适用场景**：多步骤复杂任务、可并行的子任务、项目管理类

### 3. ReWOO（一次规划，工具填充）

```
1. Planner：生成含占位符的计划（#E1, #E2 依赖 #E1）
2. Worker：并行填充占位符（调用工具）
3. Solver：综合所有结果给最终答案
```

| 优势 | 劣势 |
|------|------|
| LLM 调用最少（3 次） | 不适合顺序依赖强的任务 |
| 并行执行最快 | 规划错误无法中途修正 |
| Token 消耗最低 | 对工具描述质量要求高 |

**适用场景**：工具密集型、子任务独立、追求效率

### 范式对比总结

| 维度 | ReAct | Plan-and-Execute | ReWOO |
|------|-------|-----------------|-------|
| LLM 调用次数 | N（每步） | 2-3（规划+执行） | 3（固定） |
| 适应性 | 高 | 中（需 Replan） | 低 |
| 执行速度 | 慢 | 中 | 快 |
| Token 成本 | 高 | 中 | 低 |
| 全局视野 | 无 | 有 | 有 |
| 容错性 | 高 | 中 | 低 |

## 规划质量的决定因素

| 因素 | 影响 | 2026 最佳实践 |
|------|------|--------------|
| **模型推理力** | 弱模型规划粗糙 | 用 o3/R1 等推理模型做 Planner |
| **任务表示** | 自然语言计划易歧义 | 用结构化 JSON（步骤/依赖/验收） |
| **工具描述** | 描述不清导致误规划 | 工具 schema + 使用示例 |
| **反馈循环** | 无重规划=死板 | 执行后评估，偏差超阈值触发 replan |
| **任务复杂度** | 过复杂规划失效 | 分层规划（宏观→微观） |

## 结构化规划示例

```json
{
  "goal": "写一篇 AI Agent 技术博客",
  "steps": [
    {
      "id": 1,
      "action": "搜索相关资料",
      "tool": "web_search",
      "depends_on": [],
      "acceptance": "找到 5+ 篇高质量参考"
    },
    {
      "id": 2,
      "action": "提炼核心观点",
      "tool": "llm_analyze",
      "depends_on": [1],
      "acceptance": "3-5 个核心论点"
    },
    {
      "id": 3,
      "action": "撰写初稿",
      "tool": "llm_write",
      "depends_on": [2],
      "acceptance": "2000+ 字结构化文章"
    },
    {
      "id": 4,
      "action": "审校优化",
      "tool": "llm_review",
      "depends_on": [3],
      "acceptance": "无逻辑错误、表达流畅"
    }
  ]
}
```

## 动态重规划机制

```python
def execute_with_replan(plan, executor, max_replans=3):
    for attempt in range(max_replans):
        results = []
        for step in plan.steps:
            result = executor.run(step)
            results.append(result)
            
            # 检查偏差
            if not step.acceptance_check(result):
                # 触发重规划
                plan = replanner.replan(
                    original_goal=plan.goal,
                    completed=results[:len(results)-1],
                    failed_step=step,
                    error=result.error
                )
                break
        else:
            return results  # 所有步骤成功
    
    raise PlanningExhausted("Max replans reached")
```

## 2026 趋势：推理模型改变规划

推理模型（o3/DeepSeek-R1/Claude extended thinking）的"长链思考"本质上**内化了规划**——它们在输出前内部完成多步推理，使得传统显式 Plan-and-Execute 的价值下降。

**新范式分层：**

| 任务复杂度 | 策略 | 示例 |
|----------|------|------|
| 简单 | 推理模型直接做（隐式规划） | 单步问答、简单计算 |
| 中等 | 推理模型 + 工具调用 | 多步搜索、代码生成 |
| 复杂 | 显式规划 + 推理模型执行 | 多文件重构、研究项目 |
| 超复杂 | 分层规划 + 多 Agent | 企业级工作流 |

## 最佳实践

1. **任务分解粒度**：每个子步骤应可在 1-3 次工具调用内完成
2. **显式依赖声明**：用 DAG 表示步骤间依赖，支持并行
3. **验收标准前置**：每个步骤定义明确的完成条件
4. **渐进式规划**：复杂任务先粗规划，执行中逐步细化
5. **失败快速反馈**：步骤失败立即触发 replan，不要等到最后

## Related

- [[概念/Agent/ai-agents|AI Agent]] — Agent 基础
- [[概念/Agent/agent-loop|Agent Loop]] — 规划后的执行循环
- [[概念/Agent/agent-reflection|Agent 反思]] — 规划失败时的自我修正
- [[概念/Agent/agent-memory-systems|Agent 记忆]] — 规划依赖记忆中的经验
- [[概念/LLM/reasoning-models|推理模型]] — 内化规划的新范式
- [[15_智能体/01_Agent基础/16_AI_Agent|AI Agents 详解]]
