---
title: "The Anatomy of an Agent Harness"
url: "https://blog.langchain.com/the-anatomy-of-an-agent-harness/"
date: "2026-03-11"
author: "Vivek Trivedy"
tags:
  - agent
  - harness
  - harness-engineering
  - tools
  - orchestration
  - filesystem
  - sandbox
  - memory
  - context
  - verification
  - langchain
---

## TLDR

Agent = Model + Harness. Harness engineering is how we build systems around models to turn them into work engines. The model contains the intelligence and the harness makes that intelligence useful.

This document defines what a harness is and derives the core components agents need, working backwards from the behaviors we want.

## Can Someone Please Define a "Harness"?

$$
\text{Agent} = \text{Model} + \text{Harness}
$$

If you're not the model, you're the harness.

A harness is every piece of code, configuration, and execution logic that isn't the model itself. A raw model is not an agent. It becomes one when a harness gives it things like state, tool execution, feedback loops, and enforceable constraints.

Concretely, a harness includes:

- System prompts
- Tools, skills, MCPs, and their descriptions
- Bundled infrastructure (filesystem, sandbox, browser)
- Orchestration logic (subagent spawning, handoffs, model routing)
- Hooks and middleware for deterministic execution (compaction, continuation, lint checks)

There are many messy ways to split the boundaries of an agent system between the model and the harness, but this definition forces us to think about designing systems around model intelligence.

```
┌─────────────────────────────────────────┐
│              Agent                      │
├─────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────────┐ │
│  │   Model     │ + │    Harness      │ │
│  │  (智能)      │   │ (工程系统)       │ │
│  │             │   │ • System Prompt │ │
│  │ • 推理能力   │   │ • Tools & MCPs  │ │
│  │ • 知识理解   │   │ • 沙箱 & 文件系统│ │
│  │ • 文本生成   │   │ • 编排逻辑      │ │
│  │             │   │ • Hooks         │ │
│  │             │   │ • Memory        │ │
│  └─────────────┘   └─────────────────┘ │
└─────────────────────────────────────────┘
```

_Figure 1. Agent = Model + Harness_

## Why Do We Need Harnesses…From a Model's Perspective

There are things we want an agent to do that a model cannot do out of the box. This is where a harness comes in.

Models (mostly) take in data like text, images, audio, and video, and they output text. Out of the box they cannot:

- Maintain durable state across interactions
- Execute code
- Access realtime knowledge
- Setup environments and install packages to complete work

These are harness-level features. For example, to get a product UX like “chatting”, we wrap the model in a loop that tracks previous messages and appends new user messages. The main idea is to convert a desired agent behavior into an actual feature in the harness.

## Working Backwards from Desired Agent Behavior to Harness Engineering

Harness engineering helps humans inject useful priors to guide agent behavior. As models have gotten more capable, harnesses have been used to surgically extend and correct models to complete previously impossible tasks.

The goal is to derive a set of harness features from the starting point of helping models do useful work, following the pattern:

Behavior we want (or want to fix) → Harness design to help the model achieve this

```
期望行为                          Harness 设计
─────────────                    ─────────────
持久存储工作 →  文件系统抽象 + Git 版本控制
执行代码     →  Bash 工具 + 代码执行沙箱
获取新知识   →  Web 搜索 + MCP 工具集成
安全执行     →  Docker 沙箱 + 命令白名单
跨会话记忆   →  AGENTS.md + 向量存储
长程任务     →  Ralph Loop + 上下文压缩
```

_Figure 2. 期望行为 → Harness 设计_

## Filesystems for Durable Storage and Context Management

We want agents to have durable storage to interface with real data, offload information that doesn't fit in context, and persist work across sessions.

Models can only directly operate on knowledge within their context window. Before filesystems, users had to copy and paste content directly to the model. That’s clunky UX and doesn't work for autonomous agents. The world was already using filesystems to do work, so models were trained on billions of tokens showing how to use them. The natural solution became:

Harnesses ship with filesystem abstractions and tools for filesystem operations.

The filesystem is arguably the most foundational harness primitive because it unlocks:

- A workspace to read data, code, and documentation
- Incremental offloading of work instead of holding everything in context
- A natural collaboration surface for multiple agents and humans coordinating through shared files (for example, “Agent Teams”)

Git adds versioning so agents can track work, rollback errors, and branch experiments.

## Bash + Code as a General Purpose Tool

We want agents to autonomously solve problems without humans needing to pre-design every tool.

The main agent execution pattern today is a [ReAct loop](https://docs.langchain.com/oss/python/langchain/agents?ref=blog.langchain.com), where a model reasons, takes an action via a tool call, observes the result, and repeats in a loop. Harnesses can only execute tools they have logic for. Instead of forcing users to build tools for every possible action, a better solution is to give agents a general purpose tool like bash.

Harnesses ship with a bash tool so models can solve problems autonomously by writing and executing code.

Bash plus code execution is a big step toward giving models a computer and letting them figure out the rest autonomously. The model can design its own tools on the fly via code instead of being constrained to a fixed set of pre-configured tools.

## Sandboxes and Tools to Execute & Verify Work

Agents need an environment with the right defaults so they can safely act, observe results, and make progress.

We’ve given models storage and the ability to execute code, but all of that needs to happen somewhere. Running agent-generated code locally is risky, and a single local environment doesn’t scale to large agent workloads.

Sandboxes give agents safe operating environments. Instead of executing locally, the harness can connect to a sandbox to run code, inspect files, install dependencies, and complete tasks. This creates secure, isolated execution of code. For more security, harnesses can allow-list commands and enforce network isolation. Sandboxes also unlock scale because environments can be created on demand, fanned out across many tasks, and torn down when the work is done.

Good environments come with good default tooling. Harnesses are responsible for configuring tooling so agents can do useful work. This includes pre-installing language runtimes and packages, CLIs for git and testing, and [browsers](https://github.com/vercel-labs/agent-browser?ref=blog.langchain.com) for web interaction and verification.

Tools like browsers, logs, screenshots, and test runners give agents a way to observe and analyze their work. This enables self-verification loops where agents can write application code, run tests, inspect logs, and fix errors.

Deciding where the agent runs, what tools are available, what it can access, and how it verifies its work are harness-level design decisions.

## Memory & Search for Continual Learning

Agents should remember what they've seen and access information that didn't exist when they were trained.

Models have no additional knowledge beyond their weights and what's in their current context. Without access to edit model weights, the only way to add knowledge is via context injection.

For memory, the filesystem is again a core primitive. Harnesses support memory file standards like [AGENTS.md](http://agents.md/?ref=blog.langchain.com), which get injected into context on agent start. As agents add and edit this file, harnesses load the updated file into context. This is a form of [continual learning](https://www.ibm.com/think/topics/continual-learning?ref=blog.langchain.com) where agents durably store knowledge from one session and inject that knowledge into future sessions.

Knowledge cutoffs mean that models can't directly access new data like updated library versions without the user providing them directly. For up-to-date knowledge, web search and MCP tools like [Context7](https://context7.com/?ref=blog.langchain.com) help agents access information beyond the knowledge cutoff, such as new library versions or current data that didn't exist when training stopped.

Web search and tools for querying up-to-date context are useful primitives to bake into a harness.

## Battling Context Rot

Agent performance shouldn’t degrade over the course of work.

[Context Rot](https://research.trychroma.com/context-rot?ref=blog.langchain.com) describes how models become worse at reasoning and completing tasks as their context window fills up. Context is a precious and scarce resource, so harnesses need strategies to manage it.

Harnesses today are largely delivery mechanisms for good context engineering.

### Compaction

Compaction addresses what to do when the context window is close to filling up. Without compaction, what happens when a conversation exceeds the context window? One option is that the API errors, which is not acceptable. The harness needs a strategy to manage this case. Compaction intelligently offloads and summarizes the existing context so the agent can continue working.

### Tool Call Offloading

Tool call offloading reduces the impact of large tool outputs that can noisily clutter the context window without providing useful information. The harness keeps the head and tail tokens of tool outputs above a threshold number of tokens and offloads the full output to the filesystem so the model can access it if needed.

### Skills

Skills address the issue of too many tools or MCP servers loaded into context on agent start, which degrades performance before the agent can start working. Skills solve this via progressive disclosure. The model didn't choose to have skill front-matter loaded into context on start, but the harness can support this to protect the model against context rot.

## Long Horizon Autonomous Execution

We want agents to complete complex work, autonomously, correctly, over long time horizons.

Autonomous software creation is the holy grail for coding agents, but today's models suffer from early stopping, issues decomposing complex problems, and incoherence as work stretches across multiple context windows. A good harness has to design around all of this.

Long-horizon work requires durable state, planning, observation, and verification to keep working across multiple context windows.

### Filesystems and Git for Tracking Work Across Sessions

Agents produce millions of tokens over a long task, so the filesystem durably captures work to track progress over time. Adding git allows new agents to quickly get up to speed on the latest work and the history of the project. For multiple agents working together, the filesystem also acts as a shared ledger where agents can collaborate.

### Ralph Loops for Continuing Work

[The Ralph Loop](https://ghuntley.com/loop/?ref=blog.langchain.com) is a harness pattern that intercepts the model's exit attempt via a hook and reinjects the original prompt in a clean context window, forcing the agent to continue its work against a completion goal. The filesystem makes this possible because each iteration starts with fresh context but reads state from the previous iteration.

### Planning and Self-Verification to Stay on Track

Planning is when a model decomposes a goal into a series of steps. Harnesses support this via good prompting and injecting reminders for how to use a plan file in the filesystem.

After completing each step, agents benefit from checking correctness via self-verification. Hooks in harnesses can run a pre-defined test suite and loop back to the model on failure with the error message, or models can be prompted to self-evaluate their code independently. Verification grounds solutions in tests and creates a feedback signal for self-improvement.

## The Future of Harnesses

### The Coupling of Model Training and Harness Design

Today's agent products like Claude Code and Codex are post-trained with models and harnesses in the loop. This helps models improve at actions that harness designers want them to be natively good at, such as filesystem operations, bash execution, planning, or parallelizing work with subagents.

This creates a feedback loop: useful primitives are discovered, added to the harness, and then used when training the next generation of models. As this cycle repeats, models become more capable within the harness they were trained in.

But this co-evolution has interesting side effects for generalization. It shows up in ways like how changing tool logic leads to worse model performance. A concrete example is described in [the Codex-5.3 prompting guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide/?ref=blog.langchain.com#apply_patch) with the apply_patch tool logic for editing files. A truly intelligent model should have little trouble switching between patch methods, but training with a harness in the loop can create overfitting.

But this doesn't mean that the best harness for your task is the one a model was post-trained with. [The Terminal Bench 2.0 Leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0?ref=blog.langchain.com) is an example: Opus 4.6 in Claude Code scores far below Opus 4.6 in other harnesses. In a previous blog, LangChain showed how they improved their coding agent from Top 30 to Top 5 on Terminal Bench 2.0 by only changing the harness, suggesting there is significant leverage in optimizing the harness for a given task.

```
同一模型在不同 Harness 中的表现差异
═══════════════════════════════════════════

模型: Claude Opus 4.6

Harness A (基础)          Harness B (优化)
─────────────────         ─────────────────
SWE-bench: 45%            SWE-bench: 72%
GAIA L1:   78%            GAIA L1:   92%
平均步数:   15             平均步数:   8

优化点:
• 更好的 System Prompt (+5-15%)
• 文件系统访问 (+10-20%)
• 验证回路 (+15-25%)
• Ralph Loop 续写 (+20-30%)
```

_Figure 3. Harness 选择对基准测试结果的影响_
> 数据来源: [Terminal Bench 2.0 Leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0)_

### Where Harness Engineering is Going

As models get more capable, some of what lives in the harness today will get absorbed into the model. Models will get better at planning, self-verification, and long-horizon coherence natively, thus requiring less context injection.

This suggests harnesses should matter less over time, but just as prompt engineering continues to be valuable today, it’s likely that harness engineering will continue to be useful for building good agents.

Harnesses patch over model deficiencies, but they also engineer systems around model intelligence to make it more effective. A well-configured environment, the right tools, durable state, and verification loops make any model more efficient regardless of base intelligence.

Harness engineering is an active area of research in LangChain’s harness building library [deepagents](https://docs.langchain.com/oss/python/deepagents/overview?ref=blog.langchain.com). Open problems they mention include:

- Orchestrating hundreds of agents working in parallel on a shared codebase
- Agents that analyze their own traces to identify and fix harness-level failure modes
- Harnesses that dynamically assemble the right tools and context just-in-time for a given task instead of being pre-configured

This article was an exercise in defining what a harness is and how it’s shaped by the work we want models to do.

The model contains the intelligence and the harness is the system that makes that intelligence useful.

To more harness building, better systems, and better agents.

---

## 从概念到代码：下一步

本文从理论层面定义了 Harness 的核心概念和组件推导。如果你已经理解了这些概念，下一步是：

### 路径 A：快速搭建（30 分钟）

阅读 [Harness-in-nutshell.md](./Harness-in-nutshell.md) → 按"快速启动"代码运行第一个最小 Harness。

### 路径 B：完整实现（2-4 小时）

阅读 [Harness Implementation Guide](./Harness_Implementation_Guide.md) → 从零搭建一个包含 Docker 沙箱、验证回路、记忆系统的生产级 Harness。

### 路径 C：架构设计（1-2 小时）

阅读 [Agent Harness 技术架构 2026](./Agent_Harness_Architecture_2026.md) → 掌握 5 层架构、配置参数、性能基线和框架选型。

### 概念对照表

| 本文概念 | Implementation Guide 对应实现 |
|---------|------------------------------|
| 文件系统 | `FilesystemHarness` 类 |
| 沙箱 | `DockerSandbox` 类 |
| 上下文压缩 | `_compact_context()` 方法 |
| 工具输出裁剪 | `offload_large_output()` 函数 |
| 验证回路 | `VerificationHook` + `python_syntax_check` |
| Ralph Loop | `RalphLoopHarness` 类 |
| 记忆系统 | `MemoryManager` 类 |

---

## 原文链接

- [https://blog.langchain.com/the-anatomy-of-an-agent-harness/](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)

## 更新时间

- 2026-04-14
