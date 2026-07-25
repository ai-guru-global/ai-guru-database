---
title: "Hello-Agents L04：智能体经典范式构建（ReAct / Plan-and-Solve / Reflection）"
category: "05-nlp-llms-prompt-engineering"
tags:
  - ai-agents
  - react
  - plan-and-solve
  - reflection
  - tool-use
  - prompt-engineering
  - hello-agents
sources:
  - "原始/github-sources/hello-agents/docs/chapter4/第四章 智能体经典范式构建.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第四章笔记：从零实现 ReAct、Plan-and-Solve 与 Reflection 三种经典 Agent 范式，理解 Thought-Action-Observation 循环与自我纠错机制。"
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.84
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Hello Agents L04 React"
  - "Hello Agents L04 ReAct"
  - Hello_Agents_L04_ReAct

---
# Hello-Agents L04：智能体经典范式构建

> **一句话理解**: 本章通过原生 Python 代码（基于 HelloAgentsLLM 客户端）实现三种经典 Agent 范式——**ReAct**（边想边做）、**Plan-and-Solve**（先规划后执行）、**Reflection**（自我反思修正），帮助学习者穿透框架表象，理解 Agent 内部循环机制。

---

## 1. 环境准备

- Python 3.10+，安装 `openai` 与 `python-dotenv` ^[inferred]
- 通过 `.env` 配置 `LLM_API_KEY`、`LLM_MODEL_ID`、`LLM_BASE_URL`
- 封装 `HelloAgentsLLM.think()` 统一调用 OpenAI 兼容接口 ^[inferred]

---

## 2. ReAct（Reason + Act）

### 2.1 核心思想

ReAct 由 Shunyu Yao 于 2022 年提出 ^[extracted]，将 **推理（Reasoning）** 与 **行动（Acting）** 显式结合，形成 `Thought → Action → Observation` 循环：

- **Thought**: 智能体的内心独白，分析现状、分解任务、制定下一步计划
- **Action**: 调用外部工具，例如 `Search['华为最新款手机']`
- **Observation**: 工具返回的结果，作为下一轮推理的事实依据

### 2.2 形式化描述

在每个时间步 $t$，LLM 策略 $\pi$ 根据问题 $q$ 和历史轨迹 $((a_1,o_1),\dots,(a_{t-1},o_{t-1}))$ 生成思考 $th_t$ 与行动 $a_t$：

$$
(th_t, a_t) = \pi(q, (a_1,o_1), \ldots, (a_{t-1},o_{t-1}))
$$

环境工具 $T$ 执行行动并返回观察：

$$
o_t = T(a_t)
$$

循环持续直到模型判断任务完成 ^[extracted]。

### 2.3 与 CoT / 纯行动范式的对比

| 范式 | 优势 | 局限 |
|------|------|------|
| Chain-of-Thought (CoT) | 复杂推理 | 无法与外部世界交互，易幻觉 |
| 纯行动（Action-only） | 可调用工具 | 缺乏规划与纠错 |
| **ReAct** | 思考指导行动，行动修正思考 | 对提示工程和工具描述质量敏感 ^[inferred] |

### 2.4 工程注意点

- 输出格式解析：需从 LLM 输出中稳定抽取 Thought 与 Action
- 工具调用失败重试：网络/API 异常需优雅处理 ^[inferred]
- 防止死循环：设置最大步数或终止条件
- 提示中应包含少量示例（few-shot）以稳定输出结构 ^[inferred]

---

## 3. Plan-and-Solve

### 3.1 核心思想

“三思而后行”。智能体首先根据用户问题生成一个**完整的行动计划**，然后**严格按步骤执行**每个子任务 ^[extracted]。

### 3.2 适用场景

- 任务目标明确、可提前拆解为固定步骤
- 需要较高可解释性和可审计性
- 对执行效率要求高于动态应变能力 ^[inferred]

### 3.3 与 ReAct 的对比

- **ReAct**: 单步规划 + 即时反馈，适合动态、信息不完整的环境
- **Plan-and-Solve**: 全局规划 + 顺序执行，适合结构清晰、步骤可预见的任务 ^[inferred]

---

## 4. Reflection

### 4.1 核心思想

赋予智能体“反思”能力：生成初稿后，智能体以**批判者（Critic）**角色审视自身输出，识别错误、遗漏或不一致，并据此修正结果 ^[extracted]。

### 4.2 典型流程

1. **生成（Generate）**: 产生第一次输出
2. **反思（Reflect）**: 评估输出质量，指出问题
3. **优化（Refine）**: 基于反思结果改进输出
4. 可迭代多轮直至满足终止条件 ^[inferred]

### 4.3 与 ReAct 的关系

Reflection 可视为在 ReAct 循环之上增加了一层**元认知（Metacognition）**，既能修正最终答案，也能修正中间计划 ^[inferred]。

---

## 5. 为什么要“重复造轮子”

本章强调直接使用 LangChain、LlamaIndex 等高度抽象框架不利于理解底层机制。亲手实现的好处：

1. 理解输出解析、重试、死循环防护等工程细节
2. 暴露真实项目中的设计权衡
3. 从框架“使用者”转变为 Agent 应用“创造者” ^[extracted]

---

## 6. 关联阅读

- [[15_智能体/02_Agent_Frameworks/AutoGen_Deep_Dive]] — AutoGen 多 Agent 框架
- [[15_智能体/03_Agent_Workflow/Workflow-in-nutshell]] — Agent 工作流总览
- [[05_大模型/08_Prompt_Engineering/Prompt_Engineering]] — 提示工程基础
- [[05_大模型/08_Prompt_Engineering/GenAI_L05_Advanced_Prompts]] — 高级提示技术
- [[15_智能体/Hello_Agents_L06_Frameworks_AutoGen_LangGraph]] — 主流框架实践
- [[05_大模型/08_Prompt_Engineering/Hello_Agents_L09_Context_Engineering|上下文工程]]

## 7. 代码示例：ReAct 实现

```python
import re
from openai import OpenAI

client = OpenAI()

def react_agent(question: str, tools: dict, max_steps: int = 5):
    """ReAct Agent 简化实现"""
    trajectory = []
    
    for step in range(max_steps):
        # 构建提示
        prompt = f"问题：{question}\n\n历史轨迹：\n"
        for t in trajectory:
            prompt += f"Thought: {t['thought']}\nAction: {t['action']}\nObservation: {t['observation']}\n\n"
        prompt += "请继续思考并给出下一步行动（Thought/Action/Action Input）或最终答案（Final Answer）："
        
        # 调用 LLM
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        output = response.choices[0].message.content
        
        # 解析输出
        if "Final Answer:" in output:
            return output.split("Final Answer:")[1].strip()
        
        thought = re.search(r"Thought: (.+)", output)
        action = re.search(r"Action: (.+)", output)
        action_input = re.search(r"Action Input: (.+)", output)
        
        if action and action_input:
            tool_name = action.group(1).strip()
            tool_input = action_input.group(1).strip()
            observation = tools.get(tool_name, lambda x: "Tool not found")(tool_input)
            trajectory.append({
                "thought": thought.group(1) if thought else "",
                "action": f"{tool_name}[{tool_input}]",
                "observation": observation
            })
    
    return "达到最大步数，未得到答案"
```

## 8. 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 死循环 | 工具调用失败 | 设置最大步数 |
| 格式解析失败 | 输出不规范 | 增加 few-shot 示例 |
| 幻觉 | 缺乏事实依据 | 强制工具调用 |
| 效率低 | 步数太多 | 优化提示词 |

## 9. 生产检查清单

1. ✅ 设置最大步数防止死循环
2. ✅ 实现工具调用失败重试
3. ✅ 使用 few-shot 稳定输出格式
4. ✅ 记录完整轨迹用于调试
5. ✅ 实现超时机制
6. ✅ 对工具输入进行验证
7. ✅ 监控 Agent 执行成本
8. ✅ 建立评估基准

## 总结

ReAct、Plan-and-Solve 和 Reflection 是三种经典的 Agent 范式，分别适用于动态环境、结构化任务和需要自我修正的场景。亲手实现这些范式是理解 Agent 内部机制的最佳方式。2026 年，这些范式已被集成到 LangChain、AutoGen 等主流框架中，但理解底层原理仍是构建可靠 Agent 的基础。

> 💡 Agent 范式的核心：ReAct 是"边想边做"，Plan-and-Solve 是"三思而后行"，Reflection 是"吾日三省吾身"——三者结合，构建可靠的自主智能体。
