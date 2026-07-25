---
title: "CoT / ReAct / ToT — 推理时 Prompt 技巧"
category: -concepts
tags: ["prompt-engineering", "cot", "react", "tot", "reasoning", "agent-prompting", "chain-of-thought"]
relationships:
  - target: "概念/prompt-engineering"
    type: belongs_to
  - target: "概念/ai-agents"
    type: enables
  - target: "概念/reasoning-models"
    type: related_to
  - target: "概念/rag-systems"
    type: complements
sources:
  - 05_大模型/08_Prompt_Engineering/Prompt_Engineering.md
  - 05_大模型/09_Reasoning_Models/
summary: "CoT(思维链)引导模型'一步步想',ReAct(推理+行动)让模型边想边查工具,ToT(思维树)支持多路径探索。这些推理时 Prompt 技巧让 LLM 在不动参数的情况下解锁更复杂的推理能力,是 Agent 和 Reasoning Model 的核心技术基础。"
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.92
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Cot React Reasoning Prompt"
  - "cot react reasoning prompt"

---
# CoT / ReAct / ToT — 推理时 Prompt 技巧

> **一句话理解**：CoT 让模型"动笔算",ReAct 让模型"边想边用工具",ToT 让模型"试错回溯"——三个档位的"思考技巧",不动参数就能解锁推理能力。

---

## 1. 为什么需要这些技巧?

LLM 本身是"一口气答完"——问 1+1 答 2,但问"鸡兔同笼"就开始瞎蒙。

**根因**:Transformer 一次并行算所有 token,**没有"中间步骤"的概念**。

解决思路:**强制模型把思考过程写出来**,每一步基于上一步,出错可以早发现,也能用上思维链的"过程奖赏"。

---

## 2. CoT (Chain-of-Thought,思维链)

### 核心思想

让模型在给出最终答案前,**写出中间推理步骤**。

### 例子

**普通 Prompt**:
```
Q: 小明有 5 个苹果,吃了 2 个,妈妈又给了 3 个,现在有几个?
A: 6    ← 直觉猜的,容易错
```

**CoT Prompt**:
```
Q: 小明有 5 个苹果,吃了 2 个,妈妈又给了 3 个,现在有几个?
A: 让我一步步想。
   1. 小明有 5 个苹果
   2. 吃了 2 个,剩 5-2 = 3 个
   3. 妈妈又给了 3 个,3+3 = 6 个
   所以答案是 6。
```

### 触发方式

| 方式 | 操作 | 适用 |
|------|------|------|
| **Few-shot CoT** | 在 Prompt 里给 2-3 个"问题+推理过程"示例 | 任何模型 |
| **Zero-shot CoT** | 加一句 `Let's think step by step` | 100B+ 大模型 |
| **Self-Consistency** | 跑 N 次采样(8~16),投票选最多的答案 | 配合 Few-shot CoT |

### 适用边界

- ✅ 数学题、逻辑推理、多步问答
- ❌ 简单分类、情感分析(画蛇添足)
- ⚠️ **小模型(<10B)效果差**,CoT 主要在大模型上显著

---

## 3. ReAct (Reasoning + Acting,推理 + 行动)

### 核心思想

CoT 只能"想",ReAct 让模型**边想边干**——可以调用搜索引擎、查数据库、跑代码,中间根据结果调整思路。

### 工作循环

```
Thought 1: 用户问今天北京天气,我需要查一下
Action 1:  search("北京今天天气")
Observation 1:  晴,18°C,北风 3 级
Thought 2: 查到了,可以回答了
Action 2:  finish("今天北京晴,18°C,北风 3 级")
```

### Prompt 模板

```
回答用户问题时,请按以下格式循环:
Thought: 你在想什么,要做什么
Action: 你要调用的工具,例如 search[query] 或 finish[answer]
Observation: 工具返回的结果
...循环直到信息够了...
Thought: 信息够了,可以给出最终答案
Action: finish[完整答案]

可用工具:
- search[query]: 搜索互联网
- calculator[expression]: 计算数学表达式
- lookup[database]: 查询数据库

问题:{question}
```

### 关键技巧

1. **Few-shot 引导**:给 1-2 个完整 ReAct 示例
2. **工具描述要清晰**:每个工具的输入输出都要明确
3. **最大步数限制**:避免死循环,通常 5-10 步
4. **错误恢复**:允许模型看到 Observation 后修改 Plan

### ReAct vs 普通 Function Calling

| 维度 | ReAct | Function Calling |
|------|-------|-----------------|
| 推理透明 | ✅ Thought 可见 | ❌ 黑盒 |
| 多步规划 | ✅ | 部分支持 |
| 适用 | 复杂 Agent 任务 | 简单工具调用 |
| 实现 | Prompt 模板 | 框架级(OpenAI 等) |

---

## 4. ToT (Tree of Thought,思维树)

### 核心思想

CoT 是单路径推理,ToT 让模型**同时探索多条推理路径**,用评估器打分,**剪掉差路径,保留好路径**,最后选最佳。

### 例子:24 点游戏

```
            (1+2+3)*4 = 24  ✓
           /                \
   (1*2*3)+...  → 评估 0.6  → 剪掉
           \                /
            ...(评估 0.9)    → 保留
```

### 三个步骤

1. **Thought decomposition**:把问题分解成多个中间思维步骤
2. **Thought generation**:每个状态生成 K 个候选下一步
3. **State evaluation**:用评估器(可以 LLM 自己)打分,选 top-b 继续展开

### BFS / DFS 搜索

- **BFS**:每层选 top-b,适合"几步内能解出"的题
- **DFS**:深入一条路径,撞墙再回溯,适合"需要试错"的题

### 适用 vs CoT

| 场景 | 选 CoT | 选 ToT |
|------|--------|--------|
| 数学题 | ✅ | 杀鸡用牛刀 |
| 24 点 / 数独 | 弱 | ✅ |
| 策略游戏(国际象棋) | 弱 | ✅ |
| 多路径规划 | 弱 | ✅ |
| 普通问答 | ✅ | 浪费算力 |

---

## 5. 其他变体速览

| 技巧 | 一句话 | 用途 |
|------|--------|------|
| **Zero-shot CoT** | 加 `let's think step by step` | 偷懒激活推理 |
| **Self-Consistency** | 采 N 次投票 | 提升稳定性 |
| **Self-Refine** | 模型自己批判并改写 | 提升输出质量 |
| **Least-to-Most** | 把问题拆成子问题,逐步解 | 复杂多步推理 |
| **Reflection** | 显式让 Agent 反思"我刚才做错了什么" | Agent 自我纠错 |
| **Plan-and-Solve** | 先列计划,再逐步执行 | 多步任务 |

---

## 6. 实战配方

### 场景 1:客服多轮问答
→ ReAct + 工具(订单查询、物流、退款 API)

### 场景 2:数学题准确率
→ Few-shot CoT + Self-Consistency(N=8)

### 场景 3:复杂策略问题
→ ToT(深度 < 5 层,每层 ≤ 3 候选)

### 场景 4:Agent 多步任务
→ ReAct + Reflection(每 3 步反思一次)

### 场景 5:RAG 增强问答
→ ReAct(决定要不要检索)+ CoT(综合多个 chunk 推理)

---

## 7. 与 Reasoning Models 的关系

| 维度 | Prompt 技巧(CoT/ReAct) | Reasoning Models(o1/o3/R1) |
|------|------------------------|---------------------------|
| 推理位置 | 写在 Prompt 里(输入侧) | 模型内部"思考"(输出侧) |
| 成本 | 低(可以关) | 高(强制思考) |
| 可控性 | 高(Prompt 改就行) | 低(模型自己决定想多久) |
| 适用 | 通用 LLM | 强推理任务(数学/代码/竞赛) |

**两者可以叠加**:用 o1 这种 Reasoning Model + ReAct 框架,效果天花板最高。

---

## 8. 一句话总结

> - **CoT**:让模型"动笔算",一步步写过程
> - **ReAct**:让模型"边想边干",调用工具查资料
> - **ToT**:让模型"试错回溯",多条路同时探索
> 三者共同点:**不动模型参数,只改 Prompt,就能解锁推理能力**。

---

## Related

- [[概念/prompt-engineering]] — Prompt Engineering 基础
- [[概念/reasoning-models]] — 推理模型(o1/o3/R1)
- [[概念/ai-agents]] — AI Agent(ReAct 是 Agent 核心)
- [[概念/rag-systems]] — RAG(ReAct 决定何时检索)
- [[05_大模型/08_Prompt_Engineering]] — Prompt 详解
- [[05_大模型/09_Reasoning_Models/README]] — Reasoning Models 详解
- [[概念/reflexion]] — 自我反思

---

## 2026 CoT/ReAct 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **原生推理模型** | o3/R1 内置 CoT 无需 Prompt | GA |
| **ReAct 框架** | 推理+行动循环的 Agent 范式 | GA |
| **DSPy** | 编程式 Prompt 优化框架 | GA |
| **多步推理** | Tree-of-Thought/Graph-of-Thought | GA |
| **推理链监控** | 可观测思维链质量 | GA |

## 生产最佳实践

1. **模型选择**：强推理模型可省略显式 CoT Prompt
2. **ReAct 循环**：设置最大迭代次数，避免无限循环
3. **工具调用**：ReAct 中工具描述要精确，减少幻觉调用
4. **成本控制**：CoT 增加 token 消耗，简单任务无需 CoT
5. **质量监控**：跟踪推理链质量，发现异常及时干预
