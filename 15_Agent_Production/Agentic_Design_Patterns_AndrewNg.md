---
title: "吴恩达：Agentic Design Patterns 深度解析 (含 Prompt 与代码实现)"
category: "15-agent-production"
tags: ["ai-agents", "agentic-design-patterns", "andrew-ng", "deeplearning-ai", "reflection", "planning", "code-implementation"]
summary: "> **一句话理解**: 吴恩达提出了推动 AI Agent 走向生产的四大核心模式：Reflection、Tool Use、Planning 和 Multi-agent。本文深入拆解这四大模式，并提供可以直接在内部环境运行的 Prompt 模板与 Python 控制流代码。"
created: "2026-06-12"
updated: "2026-06-12"
---

# 吴恩达：Agentic Design Patterns (智能体设计模式) 深度解析 (含 Prompt 与代码实现)

> **一句话理解**: 即使是大语言模型在“Zero-shot (零样本直出)”下也会犯错。吴恩达 (Andrew Ng) 提出，通过赋予模型“智能体工作流 (Agentic Workflow)”，旧模型（如 GPT-3.5）甚至能战胜新一代的大模型（如 GPT-4）。
> 本文不仅讲解理论，还提供了**具体的 Prompt 模板与 Python 控制流示例**，以便你在内部系统直接实现这四大模式。

---

## 目录

1. [什么是 Agentic Workflow (智能体工作流)？](#1-什么是-agentic-workflow-智能体工作流)
2. [模式一：Reflection (反思与自我纠错)](#2-模式一reflection-反思与自我纠错)
3. [模式二：Tool Use (工具调用)](#3-模式二tool-use-工具调用)
4. [模式三：Planning (任务规划)](#4-模式三planning-任务规划)
5. [模式四：Multi-agent Collaboration (多智能体协作)](#5-模式四multi-agent-collaboration-多智能体协作)

---

## 1. 什么是 Agentic Workflow (智能体工作流)？

传统的 LLM 交互模式是你问我答。就像让人不打草稿、不检查，一口气写完长篇论文，极易出错。

**Agentic Workflow** 倡导的是迭代式的工作流。让模型像人类一样：先打草稿 -> 查阅资料 -> 审查修改 -> 输出最终版本。以下是四大核心设计模式的实现级拆解。

---

## 2. 模式一：Reflection (反思与自我纠错)

> **核心思想**: 给大模型一个机会，让它扮演“审查者 (Critic)”，去检查自己刚刚生成的输出，并提出修改意见，从而实现质量跃升。

### 💻 内部实现逻辑与 Prompt 模板

你需要构建一个基于 `while` 循环的系统。

**1. Generator Prompt (生成者)**:
```text
你是一个资深的 Python 程序员。
请根据以下需求编写代码：
{user_task}
请只输出代码，不需要任何解释。
```

**2. Critic Prompt (审查者)**:
```text
你是一位严厉的代码安全与架构审查专家。
以下是另一位程序员针对需求："{user_task}" 写出的代码：
```python
{generated_code}
```
请仔细检查潜在的 Bug、越界异常和效率问题。
如果代码完美，请输出 "PASS"。
如果存在问题，请列出缺陷，并提供明确的修改建议（不要直接写出正确代码，只给建议）。
```

**3. Python 控制流实现**:
```python
def reflection_agent(user_task, max_retries=3):
    code = llm_call(GENERATOR_PROMPT.format(user_task=user_task))
    
    for i in range(max_retries):
        critic_feedback = llm_call(CRITIC_PROMPT.format(
            user_task=user_task, generated_code=code
        ))
        
        if "PASS" in critic_feedback:
            return code # 审查通过，返回结果
            
        # 组装修改意见再次生成
        revise_prompt = f"之前生成的代码存在以下问题：\n{critic_feedback}\n请修正代码并重新输出全量代码。"
        code = llm_call(revise_prompt)
        
    return code # 达到最大重试次数
```

---

## 3. 模式二：Tool Use (工具调用)

> **核心思想**: 赋予模型调用外部工具（API、数据库、本地 Python 解释器）的能力。

### 💻 内部实现逻辑与 Prompt 模板

在内网或离线环境中，通常无法使用 OpenAI 原生的 Function Calling API。你需要用 Prompt 指导模型输出可以被正则提取的标识符。

**Tool Calling 引导 Prompt**:
```text
你需要回答用户的问题。你可以使用以下工具：
1. [get_weather]: 获取指定城市的天气。参数格式：{"city": "城市名"}
2. [calculate]: 执行数学公式。参数格式：{"formula": "数学表达式"}

如果你决定使用工具，必须严格按照以下格式输出（前后必须有 ### 包裹）：
###CALL: <工具名称> <参数JSON>###
例如：###CALL: calculate {"formula": "25 * 4.5"}###

如果你已经收集够了信息可以回答，请直接输出最终答案。
```

**Python 控制流实现**:
```python
import re, json

def tool_calling_agent(user_query):
    messages = [{"role": "user", "content": user_query}]
    
    while True:
        response = llm_call(messages)
        
        # 使用正则提取调用模式
        match = re.search(r'###CALL: (.*?) ({.*?})###', response)
        if match:
            tool_name = match.group(1)
            tool_args = json.loads(match.group(2))
            
            # 在内网执行真正的本地函数
            if tool_name == "calculate":
                result = eval(tool_args["formula"]) # 注意安全风险
            
            # 将工具执行结果作为 Observation 塞回对话
            messages.append({"role": "assistant", "content": response})
            messages.append({"role": "user", "content": f"工具执行结果: {result}。请继续。"})
        else:
            return response # 没有找到工具调用，说明是最终回答
```

---

## 4. 模式三：Planning (任务规划)

> **核心思想**: 面对复杂的目标（如“写一份包含市场数据的研报”），单次操作无法完成，Agent 需要生成一个“步骤清单”，然后逐一打勾执行。

### 💻 内部实现逻辑与 Prompt 模板 (Plan-and-Solve 范式)

**Planner Prompt (制定计划)**:
```text
你是一个项目经理。你的最终目标是：{user_goal}
为了完成这个目标，请将其拆解为一个不超过 5 步的有序执行计划。
请严格以 JSON 数组格式输出，如：
["第一步：...", "第二步：..."]
```

**Python 控制流实现**:
```python
def planning_agent(user_goal):
    # 1. 生成计划
    plan_json = llm_call(PLANNER_PROMPT.format(user_goal=user_goal))
    steps = json.loads(plan_json)
    
    context = ""
    # 2. 逐步执行
    for step in steps:
        executor_prompt = f"""
        我们的最终目标是: {user_goal}
        我们已经知道的信息: {context}
        当前的任务是执行此步骤: {step}
        请输出执行结果。
        """
        step_result = llm_call(executor_prompt) # 这里可以嵌套 Tool Use 模式
        context += f"\n步骤【{step}】的结果：\n{step_result}"
        print(f"✅ 步骤完成: {step}")
        
    # 3. 最终总结
    final_prompt = f"基于以下收集到的所有信息，给出用户最终的交付物：\n{context}"
    return llm_call(final_prompt)
```

---

## 5. 模式四：Multi-agent Collaboration (多智能体协作)

> **核心思想**: 一个包揽所有的“全能 Agent”往往会因为 Prompt 太长、角色冲突而变笨。应该让多个扮演不同角色（程序员、产品经理）的 Agent 相互对话。

### 💻 内部实现逻辑 (状态机切换)

在内部开发中，多智能体本质上是**切换 System Prompt 和上下文的路由过程**。

```python
def multi_agent_team(user_request):
    chat_history = []
    
    # 角色定义
    prompts = {
        "PM": "你是产品经理。审查程序员的代码是否符合用户需求，如果不符合提出批评。",
        "Coder": "你是程序员。根据 PM 的反馈或用户需求编写 Python 代码。"
    }
    
    # User 委托给 Coder
    chat_history.append(f"User: {user_request}")
    
    current_speaker = "Coder"
    for turn in range(4): # 限制最多交锋 4 轮
        system_prompt = prompts[current_speaker]
        # 让当前发言者看着聊天记录继续说
        response = llm_call(f"{system_prompt}\n\n聊天记录:\n{chat_history}")
        
        chat_history.append(f"{current_speaker}: {response}")
        print(f"[{current_speaker}] 说: {response}\n")
        
        # 判断结束条件
        if "任务已完美完成" in response:
            break
            
        # 交出麦克风轮换
        current_speaker = "PM" if current_speaker == "Coder" else "Coder"
        
    return chat_history[-1]
```

---

## 相关阅读
- [[15_Agent_Production/Agent_Frameworks/AutoGen_Deep_Dive]]
- [[15_Agent_Production/Agent_Frameworks/SmolAgents_Practical_Guide]]
- [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_Principles_Ng]]
