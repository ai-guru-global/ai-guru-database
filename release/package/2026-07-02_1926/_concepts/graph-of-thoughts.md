---
title: "GoT（Graph of Thoughts）"
category: -concepts
tags: [got, graph-of-thoughts, reasoning, llm, prompt-engineering, tot, agent-loop]
aliases:
  - "GoT"
  - "Graph of Thoughts"
  - "思维图"
relationships:
  - target: "_concepts/tot"
    type: extends
  - target: "_concepts/cot-react-reasoning-prompt"
    type: alternative
  - target: "_concepts/agent-loop"
    type: applied_in
sources:
  - 15_Agent_Production/Agent_Foundations/
summary: "GoT（Graph of Thoughts）是 ToT 的扩展，将推理过程建模为图（而非树），支持节点聚合、循环回溯、跨分支合并；适合创意写作、多文档摘要、复杂规划。"
lifecycle: reviewed
tier: supporting
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# GoT（Graph of Thoughts）

## 核心要点

- **提出**：Yao et al.（同一团队），2023-08（论文 "Graph of Thoughts: Solving Elaborate Problems with Efficient Reasoning"）
- **核心改进**：相比 ToT 的**树形结构**，GoT 用**图结构**：
  - **节点**：思考状态
  - **边**：思考之间的关系（可以合并、循环）
  - **聚合**：多个思考合并为一个
  - **回环**：思考可以回到之前的状态
- **核心优势**：
  - 比 ToT 更灵活（支持复杂推理路径）
  - 比 ToT 更高效（可聚合相似思考）
  - 适合需要**多分支综合**的任务

## 一句话解释

> GoT = "ToT 升级版，把树变图"；节点可以合并、循环，比树形更适合复杂推理。

## 与 CoT/ToT 的对比

| 方法 | 结构 | 分支 | 聚合 | 复杂度 |
|------|------|------|------|--------|
| **CoT** | 链 | 单链 | ❌ | 低 |
| **Self-Consistency** | 多链 | 多链 + 投票 | ❌ | 中 |
| **ToT** | 树 | 多分支 | ❌ | 高 |
| **GoT** | **图** | **多分支 + 合并 + 循环** | ✅ | **极高** |

## 工作示意

```
         [初始问题]
            │
     ┌──────┼──────┐
     ▼      ▼      ▼
   [思考A1][思考A2][思考A3]    ← 多个起点
     │      │      │
     ▼      ▼      ▼
   [思考B1][思考B2][思考B3]
     │      │      │
     └──────┼──────┘
            ▼
       [聚合思考]  ← GoT 特有：合并多个思考
            │
            ▼
       [思考C1]
            │
            ▼
       [最终答案]

vs ToT（树形）：
         [初始问题]
            │
     ┌──────┼──────┐
     ▼      ▼      ▼
   [思考A1][思考A2][思考A3]    ← 独立分支
     │      │      │
     ▼      ▼      ▼
   [思考B1][思考B2][思考B3]
     │      │      │
     ▼      ▼      ▼
   [思考C1][思考C2][思考C3]    ← 互不干扰
```

## GoT 五大操作

| 操作 | 说明 |
|------|------|
| **Generate（生成）**| 从现有节点生成新思考 |
| **Aggregate（聚合）**| 合并多个节点 → 一个综合节点 |
| **Score（评分）**| 评估节点价值 |
| **Refine（精炼）**| 在节点上改进 |
| **Loop（循环）**| 回到之前节点 |

## 典型使用

```python
# Microsoft Graph of Thoughts 框架
from got import GoT

class GoTAgent:
    def __init__(self, llm, k=3):
        self.llm = llm
        self.k = k
        self.graph = {}  # node_id -> state
        self.edges = []  # (from, to) edges

    def generate(self, state):
        """生成 k 个候选思考"""
        prompt = f"基于以下思考，生成 {self.k} 个不同的后续思考：\n{state}"
        return self.llm.generate(prompt, n=self.k)

    def aggregate(self, states):
        """聚合多个思考"""
        prompt = f"合并以下多个思考为一个综合思考：\n" + "\n".join(states)
        return self.llm.generate(prompt)

    def score(self, state):
        """评分"""
        prompt = f"评分（1-10）：\n{state}"
        return self.llm.score(prompt)

    def solve(self, problem, max_steps=10):
        # 1. 初始生成
        states = self.generate(problem)

        for step in range(max_steps):
            # 2. 评分 + 选择 top-k
            scored = [(s, self.score(s)) for s in states]
            states = [s for s, _ in sorted(scored, key=lambda x: -x[1])[:self.k]]

            # 3. 扩展 / 聚合 / 精炼
            new_states = []
            for s in states:
                # 决策：扩展、聚合、还是结束
                if self.should_aggregate(step):
                    new_states.append(self.aggregate([s for s in states]))
                else:
                    new_states.extend(self.generate(s))

            states = new_states

        return states[0]
```

## 何时使用

✅ **推荐**：
- 多文档摘要（需要合并多源信息）
- 创意写作（需要综合多个想法）
- 复杂规划（需要回溯和重新规划）
- 数学证明（多个引理合并）

⚠️ **不推荐**：
- 简单问答（CoT 足够）
- 实时性要求高（Token 消耗极大）
- 成本敏感（多次生成 + 评分 + 聚合）

## 性能对比

| 任务 | CoT | ToT | GoT |
|------|-----|-----|-----|
| 多文档摘要 | 中 | 中 | **强** |
| 创意写作 | 中 | 强 | **强** |
| 复杂规划 | 中 | 强 | **强** |
| Token 消耗 | 1x | 5-10x | **8-15x** |

## 主流框架

- **Microsoft Graph of Thoughts**：参考实现
- **LangGraph**：可用图结构实现类似思想
- **DSPy**：声明式编程

## Related

- [[_concepts/tot]] — ToT（树形前身）
- [[_concepts/cot-react-reasoning-prompt]] — CoT / ReAct
- [[_concepts/reflexion]] — Reflexion（自我反思）
- [[_concepts/agent-loop]] — Agent Loop
- [[_concepts/reasoning-models]] — 推理模型