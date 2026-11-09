---
线索: Agent框架
主题: 智能体平台
别名: [LangGraph, AutoGen, Microsoft Agent Framework, CrewAI, MAF]
状态: 活跃
创建: 2026-08-03
更新: 2026-09-04
关键角色: [Microsoft, LangChain, CrewAI]
---

# Agent框架

> 构建多步骤、多智能体应用的编排框架生态，Agent 时代的「应用服务器」层。

## 概述

Agent 框架是连接大模型能力与实际应用的编排层：负责工具调用、记忆、多步规划、多 agent 协作。2024–2025 年头部框架包括 LangChain/LangGraph（社区生态最大）、Microsoft AutoGen（多 agent 对话）、CrewAI（角色化协作）、Semantic Kernel。

2026 年的关键事件是 Microsoft 将 AutoGen 与 Semantic Kernel 合并为统一的 Microsoft Agent Framework（MAF）并 GA，标志企业级 Agent 编排进入整合期。本线索追踪主流框架的版本演进与格局变化。

### 2026-10

- **2026-10-01** · [Modal 正式发布 VM Sandboxes：给 Agent 一台完整的 Linux 虚拟机](https://aihot.news/items/rdjmj3nqrje120k46r63xrth4)
  Modal 工程博客：VM Sandboxes + Modal Clusters（多节点 GPU 集群）+ Sidecars 三件套同日发布，Agent 推理基础设施从「容器化」过渡到「整机 + 集群」形态；与 Kimi K2.6 编码 Agent 服务（9-23 Modal 详解）等案例互证，AI Infra 主流路线回到「以整机为单位的 Agent VM」。
- **2026-10-01** · [Modal 推出 Sidecars，为 Sandboxes 提供低延迟信任边界](https://aihot.news/items/mxaja99ylejkngzxhp66laxfj)
  Modal 工程博客：Sidecars 让 Sandboxes 在低延迟信任边界内运行——Agent 推理基础设施从「容器化」过渡到「整机 + 集群 + 信任边界」三件套。

### 2026-09

- **2026-09-28** · [H Company 发布 Holo4 智能体模型系列，含 27B 与 35B-A3B 两个版本](https://aihot.news/items/y1thdkq6a9giiitpxb6e13hwo)
  Hugging Face Blog：非大厂开源智能体模型补位；与 DeepSeek Harness v0.1（08-13，MIT 许可、「一切皆为插件」元框架）构成 2026 下半年「开源智能体基础设施」双线。（更正登记：本条初稿误将 Harness v0.1 与 Holo4 写作「同日开源」，实际相隔 46 天，已按缓存快照日期改写。）

### 2026-08

- **2026-08-07** · [LangChain 推出 Managed Deep Agents 公开测试版](https://aihot.virxact.com/items/cmsj81yyp02cwroo5rcq20vke)
  LangChain 官方博客宣布托管版 Deep Agents 进入公测，把 LangGraph 系编排能力升级为托管运行时，对标 Anthropic Managed Agents——框架厂商从「卖 SDK」走向「卖托管智能体」。

### 2026-07

- **2026-07-16** · LangGraph v1.3.14
  持续迭代（LangGraph 1.0 GA 于 2025-10-22），仍是社区主流 agent 编排框架。

### 2026-06

- **2026-06-16** · [LangChain 发布 Open SWE：开源异步编码智能体](https://aihot.virxact.com/items/cms3x0dh603bgro82yht298zp)
  LangChain 官方开源异步编码智能体 Open SWE，把 LangGraph 编排能力下沉到编码场景，与 SWE-agent/Codex 类产品正面竞争，框架厂商向应用层延伸的标志。

### 2026-04

- **2026-04-15** · [OpenAI Agents SDK 下一代版本发布](https://aihot.virxact.com/items/cmo0b6k3000jesli2q2loyouq)
  OpenAI 官方推出 Agents SDK 新一代版本（openai-agents 0.14.0）：模型原生 agent 循环 + 原生沙盒执行环境，标准化集成 MCP 工具、skills、AGENTS.md 与 shell/补丁编辑，框架与计算分离、支持快照恢复，直接对标 Claude Agent SDK。
- **2026-04-07** · [AutoGen 进入维护模式](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/)
  不再加新功能，仅 bug 修复与安全补丁；提供迁移指南至 MAF。
- **2026-04-02/03** · [Microsoft Agent Framework (MAF) 1.0 GA](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-at-build-2026-announce/)
  AutoGen + Semantic Kernel 合并后的统一 SDK 正式发布，在 Build 2026 宣布。

### 2026-02

- **2026-02** · MAF Release Candidate
  API 锁定，面向生产使用。

## 分析

1. **整合是成熟信号**：AutoGen + Semantic Kernel 合并为 MAF，反映 Agent 框架从「百花齐放的研究原型」走向「企业级标准化平台」的拐点，正如当年 Web 框架的收敛。

2. **编排层 vs 工具层**：MCP 标准化了「模型-工具」连接（工具层），Agent 框架竞争的是其上的「多步编排/协作」（编排层）。两层正在分工清晰化。

3. **LangGraph 的护城河**：即便微软官方推 MAF，LangGraph 凭借开源社区惯性、模型无关性与丰富的教程生态，仍是创业团队与黑客的主流选择。

## 关联线索

- [[智能体平台/MCP协议]]
- [[智能体平台/ClaudeAgentSDK]]
- [[Agentic编码/ClaudeCode]]
