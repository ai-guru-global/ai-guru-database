---

title: "Agent Harness (智能体驭具)"
tags: [agent-harness, production-engineering, system-architecture, agent-loop, guardrails]
created: 2026-06-17
tier: core
aliases:
  - "Agent Harness"
  - "agent harness"
category: -concepts
lifecycle: stable

relationships:
---

# Agent Harness (智能体驭具)

## 定义

Agent Harness 是包裹在 AI 模型外围的软件基础设施框架，负责模型推理之外的一切：工具执行、状态持久化、安全边界、错误恢复和生命周期管理。核心公式为 **Agent = LLM + Harness**——模型决定思维上限，Harness 决定工程下限。

"Harness"源自马具隐喻：不是给马匹增加力量，而是引导方向、分散风险、标准化协作。

## 核心机制

### 五大核心子系统

1. **运行时引擎**：维护 Agent Loop 主循环（感知 -> 推理 -> 决策 -> 执行 -> 学习 -> 判断），管理状态机（Initializing -> Executing -> Completed -> Stopped）
2. **工具层**：智能体与真实世界的连接点，负责工具注册、发现、参数验证、权限检查、执行隔离和结果标准化
3. **记忆子系统**：三层架构——工作记忆（上下文窗口）、短期记忆（会话级摘要）、长期记忆（向量索引 + 持久化知识）
4. **模型集成与输出治理**：管理与 LLM 的交互，四步防御流程——格式解析 -> 自愈修复 -> 语义验证 -> 安全检查
5. **编排引擎**：支持复杂多步任务和多智能体协作，工作流定义（顺序/条件/并行/循环）和依赖管理

### 两大基础保障

- **安全层**：梯度化权限模型、沙箱隔离、输入验证防注入、输出过滤、完整审计日志
- **可观测性层**：日志（详细事件序列）、追踪（单请求完整路径，OpenTelemetry 标准）、指标（吞吐量/延迟/错误率）

### 通用参考架构

```
接入层 (CLI / Web API / SDK)
  |
编排层 (任务分解 / 多智能体协调 / 工作流管理)
  |
智能体核心层 (运行时引擎 + 工具层 + 记忆 + 模型集成)
  |    -- 星型拓扑，运行时引擎是唯一协调者
横切关注点 (安全 / 可观测性 / 存储)
```

关键架构事实：模型调用、工具执行、记忆更新不是各自独立的层级，而是在运行时引擎的同一个循环中交替发生。

### 实证验证

Harness 层级改进的效果已被多方验证：
- OpenAI Codex 团队：引入 Harness 层后准确率提升 30-40 个百分点，零模型改进
- LangChain Deep Agents：纯 Harness 改进使 Terminal Bench 从 52.8% 提升到 66.5%
- Anthropic 反向验证：固定模型只改基础设施配置，成功率漂移 +6pp

## 关键设计决策

- **约束优先原则**：首先定义"不能做什么"，然后在约束内赋能。好的约束减少搜索空间、加快执行、提高成功率
- **可验证性原则**：每个行为可观察、可审计、可重放，对抗"暗码"（Dark Code，运行时生成后即消散的行为）
- **渐进信任原则**：从最低信任等级开始，基于量化证据（成功率、运行天数、无严重错误）逐步提升
- **故障假设原则**：主动假设每一步都可能失败，提前设计重试、降级、检查点恢复方案
- **智能体工学原则**：为 Agent（而非人类）设计软件，最小化使用摩擦、最大化信息密度

## 与其他概念的关系

- [[agent-loop]] -- Agent Loop 是 Harness 运行时引擎的核心执行机制
- [[context-engineering]] -- 上下文工程是 Harness 的子系统，决定模型每步"看到什么"
- [[mcp]] -- MCP 协议是 Harness 工具层的标准化接入方式
- [[guardrails]] -- 安全层和权限控制是 Harness 的核心保障
- [[a2a-protocol]] -- 编排引擎通过 A2A 等协议支持多智能体协作
- [[prompt-engineering]] -- Harness 包含提示词管理，但远超提示词工程的范围

## 深入阅读

- [[Agent/Agent_Harness/Harness_Engineering_Complete_Guide.md]] -- Harness 完整架构与五大设计原则
- [[Agent/Agent_Harness/Harness_Core_Subsystems.md]] -- 四大核心子系统的工程实现细节
- [[Agent/Agent_Workflow/AgentOps_Production_Guide.md]] -- Harness 在生产中的故障模式与反模式
- [[编程/Theory/Claude_Agent_Architecture.md]] -- Claude Code 的 Harness 设计模式
