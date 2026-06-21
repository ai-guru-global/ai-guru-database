---
title: Agent Harness 生态目录
category: 13-agent-production-agent-harness
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 收录主流 Harness 平台、框架、工具链和观测系统，作为选型参考。"
created: 2026-05-31
updated: 2026-05-31
---

# Agent Harness 生态目录

> 收录主流 Harness 平台、框架、工具链和观测系统，作为选型参考。

---

## 一、生态概览

Agent Harness 生态可分为四大类：

| 类别 | 说明 | 代表产品 |
|------|------|---------|
| **框架层** | 构建 Harness 的开发框架 | LangChain、AutoGen、CrewAI |
| **平台层** | 托管 Harness 运行时 | E2B、Modal、AgentScope |
| **观测层** | Trace、评估、监控 | LangSmith、Phoenix、Braintrust |
| **沙箱层** | 安全执行环境 | Docker、Firecracker、gVisor、E2B |

---

## 二、框架层

### LangChain / LangGraph

| 属性 | 详情 |
|------|------|
| **定位** | 最成熟的 Agent 开发框架 |
| **核心能力** | LangGraph 状态机编排、内置记忆、MCP 原生支持 |
| **Harness 支持** | 文件系统、上下文压缩、Hooks/Callback |
| **观测集成** | LangSmith 原生 |
| **适用场景** | 复杂状态机、企业级生产 |
| **学习曲线** | 中等 |
| **许可** | MIT |
| **GitHub Stars** | 100k+ (LangChain) |

```python
# LangGraph 快速示例
from langgraph.graph import StateGraph, MessagesState
from langgraph.prebuilt import ToolNode

graph = StateGraph(MessagesState)
graph.add_node("agent", agent_node)
graph.add_node("tools", ToolNode(tools))
graph.add_edge("agent", "tools")
graph.add_edge("tools", "agent")
app = graph.compile()
```

### AutoGen

| 属性 | 详情 |
|------|------|
| **定位** | 微软出品的多 Agent 对话框架 |
| **核心能力** | Group Chat、Code Executor、Human-in-the-loop |
| **Harness 支持** | 内置 Docker 代码执行、自动代码生成 |
| **观测集成** | AutoGen Studio |
| **适用场景** | 多 Agent 协作、代码生成任务 |
| **学习曲线** | 低 |
| **许可** | MIT |
| **GitHub Stars** | 40k+ |

### CrewAI

| 属性 | 详情 |
|------|------|
| **定位** | 最低学习曲线的 Agent 团队框架 |
| **核心能力** | 角色定义（Agent + Task + Crew）、流程编排 |
| **Harness 支持** | 有限（主要依赖外部工具） |
| **观测集成** | 基础日志 |
| **适用场景** | 快速原型、简单工作流 |
| **学习曲线** | 低 |
| **许可** | MIT |
| **GitHub Stars** | 30k+ |

### AgentScope

| 属性 | 详情 |
|------|------|
| **定位** | 阿里云出品的大规模 Agent 编排框架 |
| **核心能力** | 100+ Agent 并发、Stage 编排、内置观测 |
| **Harness 支持** | 内置沙箱、分布式执行 |
| **观测集成** | 内置仪表盘 |
| **适用场景** | 大规模并发、中国云生态 |
| **学习曲线** | 中等 |
| **许可** | Apache 2.0 |

### 框架选型决策树

```
需要多 Agent 对话？
  ├─ 是 → AutoGen
  └─ 否 → 需要复杂状态机？
      ├─ 是 → LangGraph
      └─ 否 → 快速原型？
          ├─ 是 → CrewAI
          └─ 否 → 大规模并发？
              ├─ 是 → AgentScope
              └─ 否 → 自建 / LangChain
```

---

## 三、平台层（托管 Harness）

### E2B

| 属性 | 详情 |
|------|------|
| **定位** | 云端代码执行沙箱 |
| **核心能力** | 快速启动沙箱（<1s）、持久化文件系统、支持任何语言 |
| **Harness 集成** | SDK 支持 Python/JS，可直接作为执行层 |
| **定价** | 免费 tier + $0.01/沙箱时 |
| **适用场景** | 需要安全代码执行的 Agent 产品 |

```python
from e2b import Sandbox

with Sandbox() as sandbox:
    result = sandbox.commands.run("python -c 'print(1+1)'")
    print(result.stdout)
```

### Modal

| 属性 | 详情 |
|------|------|
| **定位** | 无服务器 GPU/CPU 计算平台 |
| **核心能力** | 按需启动容器、GPU 支持、持久化卷 |
| **Harness 集成** | 可作为远程沙箱 + 模型推理后端 |
| **定价** | 按秒计费，GPU $1-3/时 |
| **适用场景** | 需要 GPU 的 Agent 任务（图像生成、模型推理） |

### Fly.io

| 属性 | 详情 |
|------|------|
| **定位** | 边缘容器部署平台 |
| **核心能力** | 全球边缘部署、快速启动、低延迟 |
| **Harness 集成** | 部署 Harness 服务到边缘节点 |
| **定价** | $2-5/月/应用 + 按量 |
| **适用场景** | 需要低延迟响应的 Agent 服务 |

---

## 四、观测层

### LangSmith

| 属性 | 详情 |
|------|------|
| **定位** | LangChain 官方观测平台 |
| **核心能力** | Trace、Eval、Prompt 版本管理、数据集 |
| **Harness 价值** | 可视化 Agent 执行流程、评估任务质量 |
| **部署** | SaaS |
| **定价** | 免费 tier + 按 Trace 计费 |

### Phoenix (Arize)

| 属性 | 详情 |
|------|------|
| **定位** | 开源 LLM 观测与评估平台 |
| **核心能力** | Trace、Eval、RAG 分析、漂移检测 |
| **Harness 价值** | 自部署观测、RAG 质量分析 |
| **部署** | 自部署 / SaaS |
| **定价** | 开源免费 |

### Braintrust

| 属性 | 详情 |
|------|------|
| **定位** | 企业级 AI 评估平台 |
| **核心能力** | 实验追踪、A/B 测试、回归检测、评分卡 |
| **Harness 价值** | 系统化评估 Agent 质量、追踪版本迭代 |
| **部署** | SaaS |
| **定价** | 按评估事件计费 |

### AgentOps

| 属性 | 详情 |
|------|------|
| **定位** | Agent 专用监控平台 |
| **核心能力** | Agent Trace、会话回放、性能监控 |
| **Harness 价值** | Agent 特定的观测需求 |
| **部署** | SaaS |
| **定价** | 按会话数计费 |

### 观测平台选型

| 需求 | 推荐 |
|------|------|
| LangChain 生态深度集成 | LangSmith |
| 自部署 + 开源 | Phoenix |
| 企业级评估体系 | Braintrust |
| Agent 专用监控 | AgentOps |
| 通用可观测性 | OpenTelemetry + Grafana |

---

## 五、沙箱层

| 方案 | 启动时间 | 隔离级别 | 适用场景 | 成本 |
|------|---------|---------|---------|------|
| **Docker** | 1-5s | 进程级 | 通用代码执行 | 低 |
| **Firecracker** | <1s | 内核级 | 高安全、多租户 | 中 |
| **gVisor** | <1s | 系统调用过滤 | 平衡安全与性能 | 中 |
| **WebAssembly** | <100ms | 内存隔离 | 轻量工具执行 | 极低 |
| **E2B** | <1s | 云端完全隔离 | 无需运维沙箱 | 按量 |
| **Modal** | 2-10s | 云端完全隔离 | GPU 任务 | 按量 |

---

## 六、工具与中间件

### MCP (Model Context Protocol)

| 属性 | 详情 |
|------|------|
| **定位** | 标准化工具连接协议 |
| ** Harness 价值** | 统一工具接入方式，解耦工具与 Harness |
| **生态规模** | 1000+ MCP servers |
| **GitHub** | github.com/modelcontextprotocol |

### A2A (Agent-to-Agent)

| 属性 | 详情 |
|------|------|
| **定位** | Agent 间通信协议（Google 提出） |
| ** Harness 价值** | 标准化多 Agent 协作接口 |
| **状态** | 早期，快速迭代中 |

### 其他关键工具

| 工具 | 功能 | Harness 用途 |
|------|------|-------------|
| **Git** | 版本控制 | 工作追踪、回滚、分支 |
| **Docker** | 容器化 | 沙箱环境 |
| **OpenTelemetry** | 分布式追踪 | 全链路观测 |
| **Prometheus** | 指标收集 | 性能监控 |
| **Grafana** | 可视化 | 仪表盘 |

---

## 七、企业级 Harness 方案

| 方案 | 提供商 | 特点 | 适用场景 |
|------|--------|------|---------|
| **Hermes Agent** | 自研/咨询 | 安全合规 + 定制编排 | 金融、医疗等高合规行业 |
| **Claude Code** | Anthropic | 官方 Harness，深度优化 | 通用编码任务 |
| **GitHub Copilot Workspace** | Microsoft | IDE 深度集成 | 开发者工作流 |
| **Cursor Composer** | Cursor | AI 原生 IDE | 前端/全栈开发 |
| **OpenAI Codex CLI** | OpenAI | 终端 Agent | 命令行工作流 |
| **Devin** | Cognition | 全自动软件工程师 | 端到端软件开发 |

---

## 🔗 相关主题

- [Agent Harness 技术架构 2026](./Agent_Harness_Architecture_2026.md) — 框架选型建议
- [Harness Implementation Guide](./Harness_Implementation_Guide.md) — 从零搭建
- [Harness Security Guide](./Harness_Security_Guide.md) — 安全加固
- [Harness Deployment Guide](./Harness_Deployment_Guide.md) — 容器化部署
- [Harness Testing Guide](./Harness_Testing_Guide.md) — 测试策略
- [Multi Agent Harness Design](./Multi_Agent_Harness_Design.md) — 多 Agent 设计
- [Agent Skills 生态目录](../Agent_Skills/Agent_Skills_Ecosystem_Catalog.md) — Skills 选型
- [Agent_Evaluation](../Agent_Evaluation/) — 评估体系

---

> 📅 **最后更新**：2026-05-07

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
