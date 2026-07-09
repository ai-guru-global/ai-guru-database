---
title: "Learn Claude Code L01：Agent Loop — 一个循环就够了"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - tool-use
  - agent-loop
sources:
  - "_raw/github-sources/learn-claude-code/s01_agent_loop/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第一课：用不到 30 行代码实现最小 Agent Harness 内核——一个 while True 循环，模型想调工具就继续，不想调就停。"
provenance:
  extracted: 0.85
  inferred: 0.12
  ambiguous: 0.03
base_confidence: 0.72
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Learn Claude Code L01 Agent Loop"
  - Learn_Claude_Code_L01_Agent_Loop

---
# Learn Claude Code L01：Agent Loop — 一个循环就够了

> **一句话理解**: Agent 的能动性来自模型，harness 只负责“循环”——模型举手要工具就执行并喂回结果，不举手就结束。

## 核心思想

作者观点：**"One loop & Bash is all you need"**。一个工具 + 一个循环 = 一个 Agent。

模型负责决策（要不要调工具、调哪个），harness 负责执行（调了就跑、结果喂回去）。

## 最小循环实现

```python
def agent_loop(messages):
    while True:
        response = client.messages.create(
            model=MODEL, system=SYSTEM, messages=messages,
            tools=TOOLS, max_tokens=8000,
        )
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason != "tool_use":
            return

        results = []
        for block in response.content:
            if block.type == "tool_use":
                output = run_bash(block.input["command"])
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
        messages.append({"role": "user", "content": results})
```

## 两个关键信号

| 信号 | 含义 | 循环动作 |
|------|------|---------|
| `stop_reason == "tool_use"` | 模型要调工具 | 执行 → 结果喂回去 → 继续 |
| `stop_reason != "tool_use"` | 模型做完了 | 退出循环 |

## 设计要点

- 循环本身始终不变，后续 19 个章节都在这个循环上叠加机制 ^[extracted]
- harness 不是智能本身，而是让模型能持续行动的最小运行框架 ^[inferred]
- 教学代码用 `bash` 作为示例工具，真实场景可替换为 read/write/edit/glob 等文件工具

## 关联阅读

- [[90_Learn/courses/share_ai/learn_claude_code]] — 完整 20 课映射
- [[_references/learn-claude-code]] — 仓库引用索引
- [[15_Agent_Production/Agent_Harness/The_Anatomy_of_an_Agent_Harness]] — Harness 工程定义
- [[15_Agent_Production/GenAI_L17_AI_Agents]] — AI 代理基础
