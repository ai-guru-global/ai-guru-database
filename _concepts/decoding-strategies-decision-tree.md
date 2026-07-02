---
title: 解码策略选择决策树
category: concepts
tags:
  - llm
  - inference
  - decoding
  - decision-tree
  - best-practices
  - mermaid
aliases:
  - Decoding Strategy Decision Tree
  - 解码策略选择
  - 解码策略决策树
relationships:
  - target: "_concepts/decoding-strategies"
    type: derived_from
  - target: "_concepts/greedy-decoding"
    type: related_to
  - target: "_concepts/temperature-scaling"
    type: related_to
  - target: "_concepts/top-p-sampling"
    type: related_to
  - target: "_concepts/beam-search"
    type: related_to
summary: 本页通过决策树和场景矩阵，帮助根据任务类型、质量要求和延迟约束快速选择合适的 LLM 解码策略与超参数。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# 解码策略选择决策树

## 一句话总结

根据**任务类型**、**确定性要求**和**多样性需求**，选择最合适的解码策略与参数组合。

---

## 快速决策流程

```mermaid
flowchart TD
    Start([开始]) --> Q1{输出需要严格可复现?}
    
    Q1 -->|是| Q2{任务是否有明确最优解?}
    Q2 -->|是| A1[使用 Greedy Decoding]
    Q2 -->|否, 需要多候选比较| A2[使用 Beam Search]
    
    Q1 -->|否| Q3{是否需要高创造性?}
    Q3 -->|是| A3[使用 Sampling<br/>Temperature 0.8~1.3<br/>Top-p 0.9~0.95]
    Q3 -->|否| Q4{是否事实/知识密集型?}
    
    Q4 -->|是| A4[使用 Low Temperature<br/>Temperature 0.1~0.4<br/>Top-p 0.95]
    Q4 -->|否| A5[使用 Balanced Sampling<br/>Temperature 0.5~0.8<br/>Top-p 0.9]
    
    A1 --> Common[设置 Repetition Penalty 1.0~1.1]
    A2 --> Common
    A3 --> Common
    A4 --> Common
    A5 --> Common
    
    Common --> Eval{评估输出}
    Eval -->|重复严重| IncRep[提高 Repetition Penalty]
    Eval -->|不够多样| IncTemp[提高 Temperature 或 Top-p]
    Eval -->|事实错误多| DecTemp[降低 Temperature]
    Eval -->|满意| End([结束])
    
    IncRep --> Eval
    IncTemp --> Eval
    DecTemp --> Eval
```

---

## 按任务类型速查

| 任务 | 推荐策略 | 推荐参数 | 原因 |
|---|---|---|---|
| **代码生成** | Greedy 或 Low Temperature | `T=0.1~0.3`, `top_p=0.95` | 语法精确、可复现 |
| **数学推理** | Greedy | `T=0.0~0.2` | 追求唯一正确答案 |
| **知识问答** | Low Temperature + Top-p | `T=0.1~0.5`, `top_p=0.95` | 平衡准确性与自然度 |
| **文本摘要** | Beam Search 或 Low Temperature | `T=0.3~0.7`, `beam=4` | 忠实原文 |
| **机器翻译** | Beam Search | `beam=4~10` | 全局最优译文 |
| **对话聊天** | Medium Temperature | `T=0.6~0.9`, `top_p=0.9` | 自然流畅 |
| **创意写作** | High Temperature | `T=0.8~1.2`, `top_p=0.9` | 鼓励多样性 |
| **头脑风暴** | High Temperature | `T=1.0~1.3`, `top_p=0.95` | 最大化创造性 |
| **JSON/SQL 生成** | Greedy 或 Low Temperature | `T=0.0~0.3` | 格式严格 |

---

## 参数调节口诀

| 现象 | 调节方向 |
|---|---|
| 输出重复、单调 | 提高 `repetition_penalty`，或改用采样 |
| 输出不连贯、跑题 | 降低 `temperature`，或降低 `top_p` |
| 输出过于保守 | 提高 `temperature`，或提高 `top_p` |
| 出现幻觉/事实错误 | 降低 `temperature`，使用 Greedy |
| 同 prompt 输出不稳定 | 固定 `seed`，或使用 Greedy |
| 生成长文本后重复 | 提高 `frequency_penalty` 或 `presence_penalty` |

---

## 常见组合模板

### 模板 1：确定性输出

```python
model.generate(
    **inputs,
    do_sample=False,  # 或 temperature=0.0
    max_new_tokens=512,
    repetition_penalty=1.05
)
```

### 模板 2：平衡采样

```python
model.generate(
    **inputs,
    do_sample=True,
    temperature=0.7,
    top_p=0.9,
    top_k=50,
    repetition_penalty=1.1
)
```

### 模板 3：创意采样

```python
model.generate(
    **inputs,
    do_sample=True,
    temperature=1.0,
    top_p=0.95,
    top_k=100,
    repetition_penalty=1.15
)
```

---

## 延伸阅读

- [[_concepts/decoding-strategies|解码策略总览]]
- [[_concepts/greedy-decoding|贪心解码]]
- [[_concepts/beam-search|束搜索]]
- [[_concepts/temperature-scaling|温度缩放]]
- [[_concepts/top-p-sampling|Top-p 采样]]
- [[_concepts/top-k-sampling|Top-k 采样]]
- [[_concepts/repetition-penalty|重复惩罚]]
