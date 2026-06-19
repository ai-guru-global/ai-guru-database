---
title: Agent Harness 工程
category: 13-agent-production-agent-harness
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **核心公式**: Agent = Model + Harness。Harness 是围绕模型智能构建的一切工程系统——包括 System Prompt、工具、沙箱、编排逻辑、状态管理、验证回路。"
created: 2026-05-31
updated: 2026-05-31
---

# Agent Harness 工程

> **核心公式**: Agent = Model + Harness。Harness 是围绕模型智能构建的一切工程系统——包括 System Prompt、工具、沙箱、编排逻辑、状态管理、验证回路。

---

## 概述

Agent Harness 是将裸模型变为可工作 Agent 的工程基础设施。一个裸模型不是 Agent——当 Harness 赋予它状态、工具执行、反馈回路和可执行约束后，它才成为 Agent。

Harness 具体包含：

| 组件 | 描述 | 示例 |
|------|------|------|
| **System Prompts** | 引导模型行为的指令 | 角色设定、输出格式约束 |
| **Tools & MCPs** | 工具定义与描述 | 文件操作、搜索、代码执行 |
| **Bundled Infrastructure** | 绑定的基础设施 | 文件系统、沙箱、浏览器 |
| **Orchestration Logic** | 编排逻辑 | 子 Agent 派生、路由、Handoff |
| **Hooks & Middleware** | 确定性执行钩子 | 压缩、续写、Lint 检查 |
| **Memory & State** | 记忆与状态管理 | AGENTS.md、会话历史、工作记忆 |

---

## 📖 阅读路径

### 路径一：快速入门（30 分钟）

适合第一次接触 Agent Harness、想理解核心概念并动手搭建最小 Harness 的读者。

```
Harness-in-nutshell.md → 理解核心公式和 5 层架构
  → 按"快速启动"代码运行第一个 Harness
```

### 路径二：系统学习（2-3 小时）

适合需要全面理解 Harness 工程、掌握生产级架构设计的开发者。

```
Harness-in-nutshell.md（速览）
  → The_Anatomy_of_an_Agent_Harness.md（理论概念与组件推导）
  → Agent_Harness_Architecture_2026.md（技术架构与生产实践）
  → Harness_Implementation_Guide.md（完整实现案例与代码）
```

### 路径三：团队落地（1-2 天）

适合需要组织团队构建企业级 Harness 平台的 Leader。

```
Agent_Harness_Architecture_2026.md（架构选型与配置）
  → Harness_Implementation_Guide.md（实现与集成）
  → 16_Agent_Evaluation（评估体系建设）
  → Enterprise_Agent（企业级部署模式）
```

---

## 📚 文档清单

| 文档 | 定位 | 适合读者 | 预估阅读时间 |
|------|------|---------|-------------|
| **[Harness-in-nutshell.md](Harness-in-nutshell.md)** | 速览版 / 快速入门 | 所有接触 Harness 的人 | 30 分钟 |
| **[The Anatomy of an Agent Harness](The_Anatomy_of_an_Agent_Harness.md)** | 理论概念篇 | 架构师、设计师、研究者 | 1 小时 |
| **[Agent Harness 技术架构 2026](Agent_Harness_Architecture_2026.md)** | 技术架构大全 | 开发者、架构师、运维 | 2-3 小时 |
| **[Harness Implementation Guide](Harness_Implementation_Guide.md)** | 实战实现手册 | 需要动手搭建的开发者 | 2-4 小时 |
| **[Harness Security Guide](Harness_Security_Guide.md)** | 安全深度指南 | 安全工程师、架构师 | 1-2 小时 |
| **[Harness Deployment Guide](Harness_Deployment_Guide.md)** | 部署与运维 | DevOps、SRE | 1-2 小时 |
| **[Harness Testing Guide](Harness_Testing_Guide.md)** | 测试策略 | 测试工程师、开发者 | 1-2 小时 |
| **[Harness Ecosystem Catalog](Harness_Ecosystem_Catalog.md)** | 生态选型索引 | 需要选型的人 | 20 分钟 |
| **[Multi Agent Harness Design](Multi_Agent_Harness_Design.md)** | 多 Agent 设计模式 | 架构师、设计师 | 1-2 小时 |

---

## 🔗 与 Agent Skills 的关系

```
┌─────────────────────────────────────────┐
│           Agent（完整系统）              │
├─────────────────────────────────────────┤
│  Harness（工程基础设施）                 │
│  ├── 上下文层 ←── Agent Skills 注入此处  │
│  ├── 编排层                              │
│  ├── 执行层                              │
│  ├── 钩子层                              │
│  └── 观测层                              │
├─────────────────────────────────────────┤
│  Model（大语言模型）                     │
└─────────────────────────────────────────┘
```

**一句话关系**：
- **Harness** = 运行 Agent 的"操作系统"（怎么运行、怎么编排、怎么约束）
- **Agent Skills** = 注入 Harness 上下文层的"专业知识包"（告诉 Agent 特定任务怎么做）

> 📄 Agent Skills 文档：[../Agent_Skills/Skills-in-nutshell.md](../Agent_Skills/Skills-in-nutshell.md)

---

## 文档导航

### 本目录文档

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Harness-in-nutshell.md](Harness-in-nutshell.md) | 30 分钟速览：核心公式、5 层架构、关键配置、快速启动代码 | 所有角色 |
| [The Anatomy of an Agent Harness](The_Anatomy_of_an_Agent_Harness.md) | LangChain 博客解读：Harness 工程定义与核心组件推导 | 设计师、架构师、开发者 |
| [Agent Harness 技术架构 2026](Agent_Harness_Architecture_2026.md) | Harness 技术架构详解：配置参数、性能指标、兼容性矩阵、多角色指南 | 全角色 |
| [Harness Implementation Guide](Harness_Implementation_Guide.md) | 从零搭建生产级 Harness：文件系统、Docker 沙箱、验证回路、Ralph Loop | 开发者 |

### 关联文档 (16_Agent_Evaluation)

Agent Harness 的**评估视角**内容位于 `16_Agent_Evaluation/`，与本目录的**生产视角**互补：

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Agent Harness 完整指南](../16_Agent_Evaluation/Agent_Harness_Complete_2026.md) | 评估框架全景：GAIA、OSWorld、SWE-bench、评估维度与指标 | 评估师、测试工程师 |
| [Agent Harness 深度探讨](../16_Agent_Evaluation/Agent_Harness_Deep_Dive.md) | 企业级架构、平台对比、MCP/A2A 协议测试 | 架构师、测试工程师 |
| [Agent Harness 综合补充](../16_Agent_Evaluation/Agent_Harness_Comprehensive_2026.md) | 安全评估、多 Agent 评估、行业基准 | 评估师、安全工程师 |
| [Ops Agent Harness](../16_Agent_Evaluation/Ops_Agent_Harness_2026.md) | 运维场景专项：监控、告警、诊断、自愈、变更执行 | 运维工程师、SRE |

---

## 角色快速入口

### Agent 设计师

- 从 [Harness-in-nutshell.md](Harness-in-nutshell.md) 理解 Harness 核心概念
- 阅读 [The Anatomy](The_Anatomy_of_an_Agent_Harness.md) 深入理解组件推导
- 阅读 [技术架构](Agent_Harness_Architecture_2026.md) 中的架构模式选型
- 参考 [16_Agent_Evaluation 评估指南](../16_Agent_Evaluation/Agent_Harness_Complete_2026.md) 理解评估标准

### 开发者

- 从 [Harness-in-nutshell.md](Harness-in-nutshell.md) 快速启动
- 阅读 [技术架构](Agent_Harness_Architecture_2026.md) 获取代码示例和集成指南
- 跟随 [Implementation Guide](Harness_Implementation_Guide.md) 从零搭建
- 查看框架适配器模式（LangChain、AutoGen 等）
- 参考 [Agentic Coding Tools](../Agentic_Coding_Tools/) 选择开发工具

### 产品经理

- 阅读 [Harness-in-nutshell.md](Harness-in-nutshell.md) 理解 Harness 能力边界
- 阅读 [技术架构](Agent_Harness_Architecture_2026.md) 中的功能规划与选型矩阵
- 参考 [16_Agent_Evaluation 评估维度](../16_Agent_Evaluation/Agent_Harness_Complete_2026.md#四评估维度与指标) 设定产品质量标准

### 集成测试工程师

- 从 [Harness-in-nutshell.md](Harness-in-nutshell.md) 了解调试排错方法
- 从 [技术架构](Agent_Harness_Architecture_2026.md) 获取测试策略与验证标准
- 深入 [16_Agent_Evaluation](../16_Agent_Evaluation/) 获取完整基准测试和评估方法

### 评估师

- 直接前往 [16_Agent_Evaluation](../16_Agent_Evaluation/) 获取评估框架与基准
- 参考本目录理解生产环境中的 Harness 工程实践

### 架构师

- 阅读 [The Anatomy](The_Anatomy_of_an_Agent_Harness.md) 理解 Harness 设计哲学
- 阅读 [技术架构](Agent_Harness_Architecture_2026.md) 中的系统设计和扩展性章节
- 结合 [Enterprise Agent](../Enterprise_Agent/) 了解企业级架构模式
- 参考 [Implementation Guide](Harness_Implementation_Guide.md) 验证技术可行性

---

*Last updated: 2026-05-07*

## Related
- [[15_Agent_Production/Agent_Harness/Multi_Agent_Harness_Design|多 Agent Harness 设计模式]]
- [[15_Agent_Production/Agent_Harness/README|Agent Harness 工程]]
- [[15_Agent_Production/Agent_Harness/Agent_Harness_Architecture_2026|Agent Harness 技术架构 2026]]
- [[15_Agent_Production/Agent_Harness/Harness_Security_Guide|Agent Harness 安全深度指南]]
- [[15_Agent_Production/Agent_Harness/Harness_Implementation_Guide|Agent Harness 实现指南]]

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)

