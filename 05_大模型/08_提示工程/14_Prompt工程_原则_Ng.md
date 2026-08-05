---
title: "提示词工程的两大黄金法则 (吴恩达 & OpenAI 联合指南)"
category: "05-nlp-llms-prompt-engineering"
tags: ["prompt-engineering", "andrew-ng", "openai", "best-practices", "deeplearning-ai"]
summary: "> **一句话理解**: 抛开网上繁杂的“咒语大全”，吴恩达与 OpenAI 教员在 DLAI 课程中将 Prompt Engineering 总结为两条最底层的黄金法则：1. 写出清晰明确的指令；2. 给模型思考的时间。"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "Prompt Engineering Principles Ng"
  - Prompt_Engineering_Principles_Ng
sources: []

name_zh: "提示词工程的两大黄金法则"
---
# 提示词工程的两大黄金法则 (吴恩达 & OpenAI 联合指南)

> 中文简称：提示词工程的两大黄金法则

> **一句话理解**: 抛开网上繁杂玄学的“咒语大全”，吴恩达 (Andrew Ng) 与 OpenAI 教员 Isa Fulford 在 DLAI 经典课程《ChatGPT Prompt Engineering for Developers》中，将 Prompt Engineering 总结为两条最底层、最实用的黄金法则。

---

## 目录

1. [法则一：写出清晰明确的指令 (Clear and Specific Instructions)](#1-法则一写出清晰明确的指令-clear-and-specific-instructions)
2. [法则二：给模型思考的时间 (Give the Model Time to Think)](#2-法则二给模型思考的时间-give-the-model-time-to-think)
3. [开发范式：迭代式 Prompt 开发](#3-开发范式迭代式-prompt-开发)

---

## 1. 法则一：写出清晰明确的指令 (Clear and Specific Instructions)

清晰 (Clear) 并不等于简短 (Short)。在很多情况下，更长、更复杂的 Prompt 能提供更多的上下文，反而使得指令更清晰。

### 技巧 1: 使用分隔符 (Delimiters)
帮助模型明确区分“哪里是指示”，哪里是“需要被处理的数据”。
常用的分隔符有：`"""`, `---`, `###`, `< >`, `<tag> </tag>`。

**Bad Prompt**: 
> 总结下面这段文字。那是在一个阳光明媚的早晨...

**Good Prompt**:
> 请总结由三个反引号包裹的文本，提炼为一句话。
> \`\`\`那是在一个阳光明媚的早晨...\`\`\`

*(💡 安全提示：使用分隔符也是防止 **Prompt Injection (提示词注入)** 的有效手段。)*

### 技巧 2: 要求结构化输出 (Structured Output)
直接要求模型输出为 HTML, JSON, 或 XML 格式，这对于下游代码解析（如 Python `json.loads`）至关重要。

**Good Prompt**:
> 请生成三个虚构的书名及其作者和类型。以 JSON 格式输出，包含 key：book_id, title, author, genre。

### 技巧 3: 要求模型检查是否满足条件 (Check Constraints)
在让模型执行前，让它先评估输入数据是否满足执行条件。

**Good Prompt**:
> \`\`\`{text}\`\`\`
> 上面是一段文本。如果这段文本包含一系列指令，请把它们重写为以下格式：
> 第一步：...
> 第二步：...
> 
> 如果文本不包含指令，只需输出“未提供任何步骤”。

### 技巧 4: 提供少量示例 (Few-Shot Prompting)
在要求模型执行真正任务前，先给它看一两个成功的例子。

**Good Prompt**:
> 你的任务是以一致的风格回答问题。
> 
> <孩子>: 教我什么是耐心。
> <祖父母>: 雕刻最深的山谷的河流，也是经过了无数个日夜的冲刷。
> 
> <孩子>: 教我什么是韧性。
> <祖父母>: 

---

## 2. 法则二：给模型思考的时间 (Give the Model Time to Think)

如果大模型一上来就匆忙给出答案（尤其是数学题或复杂的逻辑推理），它很容易犯错（所谓的“幻觉 Hallucination”）。必须强制它先思考。

### 技巧 1: 明确指定完成任务的步骤 (Specify the Steps)
把复杂任务拆解，要求模型一步一步做。

**Good Prompt**:
> 请按照以下步骤执行：
> 1. 用一句话总结由 <> 包裹的文本。
> 2. 将总结翻译成法语。
> 3. 列出法语总结中每个名字。
> 4. 输出一个 JSON 对象，包含字段 `french_summary` 和 `num_names`。
> 
> <文本内容...>

### 技巧 2: 指导模型在得出结论前，先自己算一遍 (Instruct the Model to Work Out Its Own Solution Before Rushing to a Conclusion)
这是对抗大模型“懒惰”和“轻信”的杀手锏。

**Bad Prompt**:
> 检查以下学生的数学题答案对不对。学生答案：X = 5...

**Good Prompt**:
> 你的任务是判断学生的答案是否正确。
> 请按照以下步骤进行：
> 1. 首先，你自己独立解答这道题。不要看学生的答案。
> 2. 只有在你得出了自己的答案后，将你的答案与学生的答案进行对比。
> 3. 最后再得出结论：学生的答案是否正确？

*(这就是后来著名的 **Chain of Thought (CoT)** 和 **ReAct** 范式的理论源头。)*

---

## 3. 开发范式：迭代式 Prompt 开发

吴恩达强调，不要指望能写出一个一劳永逸的“完美 Prompt”。优秀的提示词工程是一个类似于软件敏捷开发的**迭代过程**：

1. **Idea (构思)**: 写下你希望模型做什么。
2. **Implementation (实现)**: 写下第一版 Prompt 并在少数数据上测试。
3. **Analyze (分析)**: 观察模型在哪方面搞砸了（例如：输出太长、格式不对、包含无关信息）。
4. **Refine (优化)**: 明确指令、增加分隔符、加上“只输出 JSON，不要说多余的话”等限制，然后再试。
5. **循环** 直到满意。当进入生产环境时，建立包含几十上百个测试用例的测试集，使用大模型裁判（LLM-as-a-Judge）自动化评估 Prompt 的修改是否导致了整体表现的退步。

---

## 4. 2026 年 Prompt Engineering 新趋势

随着 LLM 能力的提升，Prompt Engineering 也在不断演进：

| 趋势 | 说明 | 代表技术 |
|------|------|------|
| **推理模型** | 无需手动 CoT，模型自动思考 | o3, R1, QwQ |
| **结构化输出** | 原生 JSON Schema 约束 | Structured Outputs |
| **工具调用** | 函数调用成为标准 | Function Calling, MCP |
| **多模态** | 图文音视频统一提示 | GPT-4o, Gemini |
| **Agent** | 自主任务分解与执行 | ReAct, Plan-and-Execute |

## 5. 实战代码示例

```python
from openai import OpenAI

client = OpenAI()

# 法则一：清晰明确的指令 + 分隔符
prompt_clear = """
请总结由三个反引号包裹的文本，要求：
1. 不超过 50 字
2. 使用中文
3. 输出 JSON 格式：{"summary": "..."}

```{text}```
"""

# 法则二：给模型思考时间 (CoT)
prompt_cot = """
请按照以下步骤解决这个数学问题：
1. 首先，理解题目要求
2. 然后，列出已知条件
3. 接着，一步一步推导
4. 最后，给出答案并验证

问题：{question}
"""

# 迭代式开发：测试多个 Prompt 变体
def test_prompts(prompts, test_cases):
    results = []
    for prompt in prompts:
        score = evaluate(prompt, test_cases)
        results.append((prompt, score))
    return max(results, key=lambda x: x[1])
```

## 6. 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 输出不稳定 | 指令模糊 | 增加明确约束 |
| 格式错误 | 未指定格式 | 要求 JSON/XML 输出 |
| 幻觉 | 模型编造 | 要求引用来源 |
| 过长输出 | 未限制长度 | 指定字数/段落 |
| 忽略指令 | 指令冲突 | 简化并分层 |

## 7. 生产检查清单

1. ✅ 使用分隔符明确区分指令和数据
2. ✅ 指定输出格式和长度限制
3. ✅ 对复杂任务使用 CoT 分步
4. ✅ 建立测试集评估 Prompt 效果
5. ✅ 实现 Prompt 版本控制
6. ✅ 监控生产环境 Prompt 表现
7. ✅ 定期迭代优化 Prompt
8. ✅ 防范 Prompt Injection 攻击

---

## 相关阅读
- [[05_大模型/08_提示工程/16_Prompt工程]]
- [[15_智能体/01_Agent基础/13_Agentic_设计_模式_AndrewNg]]
- [[08_模型评估/04_评估工具/03_LLM_as_Judge_深入分析]]
- [[05_大模型/08_提示工程/Hello_Agents_L04_ReAct|ReAct 模式]]
- [[概念/prompt-engineering|提示工程概念]]

## 总结

吴恩达与 OpenAI 的两大黄金法则是 Prompt Engineering 的基石：清晰明确的指令确保模型理解任务，给模型思考时间确保推理质量。2026 年，随着推理模型的普及，手动 CoT 的需求减少，但这两条法则的核心思想——明确性和结构化思考——仍然是所有 Prompt 设计的基础。

> 💡 Prompt Engineering 的核心：不是写"咒语"，而是写"清晰的任务说明书"——像给一个聪明但缺乏上下文的新员工写工作指南一样。
