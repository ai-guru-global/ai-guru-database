---
title: "Deep Agents (深度智能体)"
tags: [deep-agents, long-horizon, agentic-ai, planning, subagents]
created: 2026-11-09
updated: 2026-11-09
tier: core
aliases:
  - "Deep Agents"
  - "深度智能体"
  - "长时程智能体"
  - "Long-Horizon Agents"
category: -concepts
lifecycle: seed
review_by: 2027-02-09
relationships:
  - target: "概念/Agent/agent-harness"
    type: instance_of
  - target: "概念/LLM/context-engineering"
    type: depends_on
  - target: "概念/Agent/computer-use"
    type: often_combined_with
sources:
  - "LangChain deepagents (2025-07)"
name_zh: "深度智能体"
---

# Deep Agents (深度智能体)

> 中文简称：深度智能体

> **一句话理解**: Deep Agent 是能连续工作数小时、跨越上百步工具调用的智能体——靠「任务清单 + 文件系统外置记忆 + 子代理委派」三板斧对抗长时程下的上下文崩坏；2025-07 LangChain deepagents 定名，2026 已是 Agent 产品的主流架构形态。

---

## 定义

**Deep Agent**: 以**长时程（hours 级）、多阶段、可中断恢复**为特征的一类智能体架构模式。不是单一产品，而是一组工程共识的集合。

## 四件套架构

| 组件 | 解决什么 | 典型实现 |
|------|------|------|
| **详细系统提示** | 行为规范 + 任务方法论 | 数千 token 的指令（来自 Claude Code/Deep Research 实践反哺） |
| **规划工具（todos）** | 把长任务切成可见、可恢复的清单 | agent 主动写/勾 todo 列表，防「目标漂移」 |
| **文件系统作记忆** | 上下文窗外的工作记忆 | 把中间产物写盘（notes/facts/drafts），用时再读 |
| **子代理委派** | 上下文隔离 + 并行 | 主代理发任务书，子代理在独立窗口工作后交摘要 |

> 核心洞察：**上下文窗口是稀缺资源**——长时程失败的主因不是模型能力，而是上下文被中间产物撑爆后「遗忘目标/迷失细节」。四件套本质是 [[概念/LLM/context-engineering|上下文工程]] 在时间维度上的展开。

## 与相邻概念的关系

- **Deep Research**（[[15_智能体/17_Agent应用/02_Deep_Research_Agent|Deep Research Agent]]）: Deep Agent 在「研究」任务域的特化（搜索-阅读-综合循环）。
- **Computer Use**（[[概念/Agent/computer-use|Computer Use]]）: Deep Agent 的动作空间扩展到 GUI 时的组合形态。
- **Agent Harness**（[[概念/Agent/agent-harness|Agent Harness]]）: Deep Agent = harness 四件套 + 长时程工程。
- **多智能体系统**: 子代理委派是轻量级多智能体——不引入复杂协议，只靠「任务书 + 摘要回传」。

## 为什么 2026 主流化

1. **任务时长成为产品分水岭**：能干 4 小时的 agent（跑实验、写长报告、做多步迁移）商业价值远超 4 分钟问答。
2. **支撑技术到位**：长上下文模型 + 便宜沙箱 + 文件工具标准化（Agent Skills 渐进披露）。
3. **评测跟进**：长时程基准（Terminal-Bench、SWE 系列长任务）量化了「步数×可靠度」的复利衰减，倒逼架构改进。

## 面试快问快答

1. **Deep Agent 为什么必须外置记忆？** — 上下文窗口有限且长上下文有中间迷失（lost in the middle）问题；把中间产物写文件、按需读取，窗口只留目标与当前状态。
2. **todo 工具看似多余，为什么关键？** — 它把「目标和进度」常驻上下文，是长时程抗漂移的锚点；丢失目标的 agent 会在上百步后做出无关动作。
3. **子代理委派解决什么？** — 上下文隔离（探索过程不污染主窗口）+ 并行加速 + 失败局部化；代价是通信靠任务书/摘要，信息有损。
4. **长时程最大的失败模式？** — 复利错误：单步 98% 可靠度 × 100 步 ≈ 13% 成功率；所以需要验证点、可回滚与最小化步数。

## Related

- [[概念/Agent/agent-harness|Agent Harness]]
- [[概念/LLM/context-engineering|Context Engineering]]
- [[概念/Agent/computer-use|Computer Use]]
- [[概念/Agent/self-evolving-agents|Self-Evolving Agents]]
- [[15_智能体/README|15_智能体]]

---

*Last updated: 2026-11-09*
