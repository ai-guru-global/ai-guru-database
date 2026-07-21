---
title: "ToT（Tree of Thoughts）"
category: -concepts
tags: [tot, tree-of-thoughts, reasoning, llm, prompt-engineering, agent-loop]
aliases:
  - "ToT"
  - "Tree of Thoughts"
  - "思维树"
relationships:
  - target: "概念/cot-react-reasoning-prompt"
    type: alternative
  - target: "概念/reasoning-models"
    type: belongs_to
  - target: "概念/agent-loop"
    type: applied_in
sources:
  - 大模型/Reasoning_Models/
summary: "ToT（Tree of Thoughts）是 Chain-of-Thought 的扩展，将推理过程建模为树形搜索（BFS/DFS），结合 LLM 评估每个节点的可行性，适合复杂逻辑 / 规划 / 代码生成任务。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-07-21
---

# ToT（Tree of Thoughts）

## 核心要点

- **提出**：Yao et al., 2023-05（Princeton & Google DeepMind）
- **核心思想**：将推理过程建模为 **树形搜索**（BFS / DFS），结合 LLM 的"思考+评估"能力。
- **核心机制**：
  - **Thought decomposition**：把问题分解为中间思考步骤
  - **Thought generation**：每个状态生成多个候选思考（k 个）
  - **State evaluation**：用 LLM 评估每个候选的可行性 / 价值
  - **Search algorithm**：BFS（Tree of Thoughts）/ DFS（自顶向下）
- **核心优势**：
  - 比 CoT 更强大（可回溯）
  - 适合需要**探索 + 试错**的任务
  - 显著提升数学 / 逻辑 / 规划性能

## 一句话解释

> ToT = "CoT 升级版，把推理变树搜索"；每一步生成多个候选，LLM 自己评估哪个最好，能回头换条路。

## 与其他推理方法对比

| 方法 | 形式 | 可回溯 | 评估机制 | Token 消耗 |
|------|------|--------|---------|-----------|
| **CoT** | 线性链 | ❌ | 无 | 中 |
| **Self-Consistency** | 多链采样 | ❌ | 投票 | 高 |
| **ToT** | 树搜索 | ✅ | LLM 评估 | **极高** |
| **GoT** | 图搜索 | ✅ | LLM 评估 | 极高 |
| **ReAct** | 思考-行动 | 部分 | 观察反馈 | 中 |

## 工作示意

```
                  [起始问题]
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
    [思考 A1]   [思考 A2]   [思考 A3]    ← LLM 评估：评分排序
       │           │           │
   ┌───┼───┐       ▼       ┌───┼───┐
   ▼   ▼   ▼  [选中 B2]    ▼   ▼   ▼
  B1  B2  B3                C1  C2  C3
       │
   ┌───┼───┐
   ▼   ▼   ▼
  D1  D2  D3   ← DFS 深入 或 BFS 展开
```

## 算法实现

```python
from openai import OpenAI

class TreeOfThoughts:
    def __init__(self, client, model="gpt-4o"):
        self.client = client
        self.model = model

    def generate_thoughts(self, state, k=3):
        """生成 k 个候选思考"""
        prompt = f"当前状态：{state}\n请生成 {k} 个不同的下一步思考。"
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.split("\n")

    def evaluate_thoughts(self, state, thoughts):
        """评估每个思考的价值"""
        prompt = f"""当前状态：{state}
候选思考：
{chr(10).join(f'{i+1}. {t}' for i, t in enumerate(thoughts))}
请为每个候选打分（1-10）评估可行性：
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return parse_scores(response.choices[0].message.content)

    def bfs(self, problem, max_depth=5, branching=3, beam_size=2):
        states = [problem]
        for depth in range(max_depth):
            new_states = []
            for state in states:
                thoughts = self.generate_thoughts(state, k=branching)
                scored = self.evaluate_thoughts(state, thoughts)
                new_states.extend(sorted(scored, key=lambda x: -x[1])[:beam_size])
            states = new_states
        return states[0]  # 最优解
```

## 何时使用

✅ **推荐**：
- 复杂规划（旅行规划、日程安排）
- 逻辑推理（数学证明、谜题）
- 代码生成（多步调试）
- 决策树（游戏 / 棋类）

⚠️ **不推荐**：
- 简单问答（CoT 就够）
- 实时性要求高（Token 消耗极大）
- 成本敏感（每次评估都耗 token）

## 性能基准

| 任务 | CoT | ToT | 提升 |
|------|-----|-----|------|
| Game of 24 | 4% | **74%** | +70% |
| 24 点游戏（GPT-4）| 4% | **74%** | +70% |
| 创意写作 | 中 | **强** | 显著 |
| 数学推理 | 中 | **强** | 显著 |

## 主流框架

- **LangChain**：内置 ToT 实现
- **Guidance**：微软的约束生成
- **DSPy**：声明式编程
- **ReAct + 自定义搜索**：灵活但需自己实现

## Related

- [[概念/cot-react-reasoning-prompt]] — CoT / ReAct
- [[概念/reasoning-models]] — 推理模型
- [[概念/agent-loop]] — Agent Loop
- [[概念/graph-of-thoughts]] — GoT（图搜索扩展）

---

## 2026 Tree of Thoughts 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **ToT 框架** | 树搜索 + LLM 评估的多路径推理 | GA |
| **BFS/DFS 搜索** | 广度/深度优先策略探索思维树 | GA |
| **自评估剪枝** | LLM 评估中间步骤质量并剪枝 | GA |
| **与 Agent 融合** | ToT 作为 Agent 规划器的推理引擎 | GA |
| **GoT 扩展** | 图结构思维允许合并/循环推理 | 研究 |

## 生产最佳实践

1. **场景选择**：ToT 适合多步规划/创意生成，简单问答无需使用
2. **分支控制**：每层分支数 3-5 为宜，过多导致成本爆炸
3. **评估器质量**：自评估准确性决定搜索效果，必要时用外部评估
4. **深度限制**：设置最大搜索深度，避免无限展开
5. **结果聚合**：多条路径结果取最优或融合，而非只用第一条