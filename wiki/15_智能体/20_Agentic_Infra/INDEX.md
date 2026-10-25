---
title: "Agentic Infra"
type: index
created: 2026-10-14
updated: 2026-10-22
sources: []
name_zh: "智能体基础设施"
name_en: "Agentic Infra"
---

# Agentic Infra

> 中文简称：智能体基础设施 ｜ English Name: Agentic Infra

智能体基础设施（Agentic Infrastructure）子域索引：覆盖模型网关、工具协议、沙箱执行、记忆上下文、持久编排、可观测评估与安全治理七大层。

## 子域简介

本子域聚焦 2026 年成型的智能体专用基础设施栈：

- **模型接入层**: LLM/Agent 网关、路由、降级、成本控制
- **工具协议层**: MCP（Agent↔工具）、A2A（Agent↔Agent）
- **执行隔离层**: 沙箱与代码执行（E2B/Daytona/Modal）
- **记忆上下文层**: 跨会话记忆与上下文工程（Mem0/Letta/Zep）
- **持久编排层**: Durable execution（Temporal/Inngest/Restate）
- **可观测评估层**: Trace 与评测（Langfuse/LangSmith/Braintrust）
- **安全治理层**: 提示注入防护、权限模型、审计

## Files

- [[15_智能体/20_Agentic_Infra/01_Agentic_Infra_全景_2026|Agentic Infra 全景 2026]]
- [[15_智能体/20_Agentic_Infra/02_生产环境组件清单|生产环境组件清单]]
- [[15_智能体/20_Agentic_Infra/03_推理服务化与_PD_分离部署|推理服务化与 PD 分离部署]]
- [[15_智能体/20_Agentic_Infra/04_本地千问办公Agent实战|本地千问办公 Agent 实战]]
- [[15_智能体/20_Agentic_Infra/05_部署组合与迁移路径|Agent 部署组合与迁移路径]]
- [[15_智能体/20_Agentic_Infra/06_Mainstream_Selection_2026|主流选型 2026（每层最广泛默认项）]]
- [[15_智能体/20_Agentic_Infra/07_AgentScope_Runtime_生产部署实战|AgentScope Runtime 生产部署实战]]
- [[15_智能体/20_Agentic_Infra/08_Qwen_Agent_vs_AgentScope_Runtime|Qwen-Agent vs agentscope-runtime 对比]]
- [[15_智能体/20_Agentic_Infra/09_Sandbox_隔离技术与沙箱平台选型|Sandbox 隔离技术与沙箱平台选型（OpenSandbox 深度解析）]]
- [[15_智能体/20_Agentic_Infra/README|README]]

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|---------|------|
| 入门 | 01_Agentic_Infra_全景_2026.md 第 1 章 | 建立七层栈心智模型 |
| 进阶 | 各层「选型决策」小节 | 掌握 trade-off |
| 选型速查 | 06_Mainstream_Selection_2026 | 掌握每层采用面最大的默认项与口径辨析 |
| 对比辨析 | 08_Qwen_Agent_vs_AgentScope_Runtime | 分清框架层（写 agent）与运行时层（跑 agent），避免选型错位 |
| 选型深读 | 09_Sandbox_隔离技术与沙箱平台选型 | 拆清沙箱「隔离技术层 vs 平台层」，掌握 OpenSandbox 架构与威胁模型决策树 |
| 实战 | 02_生产环境组件清单 + 04_本地千问办公Agent实战 | 落地自己平台的架构（生产或本地） |
| 实战 | 05_部署组合与迁移路径 | 制定团队从 MVP 到完整版的演进计划与迁移清单 |
| 实战 | 07_AgentScope_Runtime_生产部署实战 | 用 agentscope-runtime 把 agent 服务化上线（K8s/Serverless/云托管） |

---
*Last updated: 2026-10-22*
