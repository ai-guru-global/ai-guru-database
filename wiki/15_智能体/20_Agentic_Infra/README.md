---
title: "Agentic Infra 子域导读"
category: -agents
tags: ["agentic-infra", "agent-infrastructure", "readme", "navigation"]
summary: "Agentic Infra（智能体基础设施）子域导航：模型网关、工具协议、沙箱执行、记忆上下文、持久编排、可观测评估、安全治理七大层的选型与架构。"
created: 2026-10-14
updated: 2026-10-22
tier: core
name_zh: "智能体基础设施"
---

# Agentic Infra（智能体基础设施）

> 中文简称：智能体基础设施

> **一句话理解**: 让 AI 智能体在生产环境「跑得稳、管得住、看得见、花得省」的那一整层基础设施——从模型网关到沙箱、记忆、编排、可观测与安全。

---

## 子域定位

Agent 从 demo 走向生产的 2026 年，围绕智能体的**专用基础设施栈**已经成型。本子域系统覆盖七层：

| 层 | 关键问题 | 代表技术 |
|----|---------|---------|
| L1 模型接入 | 多模型统一接入/路由/降级/成本 | LiteLLM、Portkey、Kong AI Gateway、Higress |
| L2 工具协议 | Agent↔工具、Agent↔Agent 互联 | MCP、A2A（已吸收 ACP） |
| L3 执行隔离 | 不可信代码/浏览的安全执行 | E2B、Daytona、Modal、Cloudflare Sandbox SDK |
| L4 记忆上下文 | 跨会话记忆、上下文漂移治理 | Mem0、Letta、Zep |
| L5 持久编排 | 长时任务、断点续跑、重放 | Temporal、Inngest、Restate |
| L6 可观测评估 | Trace、评测、回归 | Langfuse、LangSmith、Braintrust |
| L7 安全治理 | 提示注入、权限、审计 | OWASP Agentic Top 10、六层控制 |

## 文件导航

| 文件 | 内容 | 适用人群 |
|------|------|----------|
| [01_Agentic_Infra_全景_2026.md](./01_Agentic_Infra_全景_2026.md) | 七层栈全景深度长文（2026-10） | 平台/架构/后端工程师 |
| [02_生产环境组件清单.md](./02_生产环境组件清单.md) | 从 SLB 到沙箱的云资源组件清单 + 云厂商映射 | 上云/运维/SRE |
| [03_推理服务化与_PD_分离部署.md](./03_推理服务化与_PD_分离部署.md) | vLLM/SGLang 服务化四层演进 + PD 分离双池架构（GPU 推理层深读） | 推理运维/平台工程师 |
| [04_本地千问办公Agent实战.md](./04_本地千问办公Agent实战.md) | 七层清单的个人规模落地：M4 24GB 自建千问办公平替（Ollama + Dify + 混合架构） | 个人开发者/本地实践 |
| [05_部署组合与迁移路径.md](./05_部署组合与迁移路径.md) | 四阶段演进模型（Demo→MVP→混合态→完整版）+ 成本交叉点 + 逐组件迁移 playbook | 技术负责人/SRE |
| [06_Mainstream_Selection_2026.md](./06_Mainstream_Selection_2026.md) | 每层「采用面最大」的默认项（LiteLLM/MCP/E2B/Mem0/Temporal/Langfuse/OWASP）+ 口径辨析 + 面试快问快答 | 选型决策/面试准备 |
| [07_AgentScope_Runtime_生产部署实战.md](./07_AgentScope_Runtime_生产部署实战.md) | agentscope-runtime 九种部署目标逐路拆解：K8s/Serverless/云托管全参数 + Redis 状态外置 + Tracer 可观测 + 常见坑 | 后端/平台工程师 |
| [08_Qwen_Agent_vs_AgentScope_Runtime.md](./08_Qwen_Agent_vs_AgentScope_Runtime.md) | Qwen-Agent（框架层：写 agent）vs agentscope-runtime（运行时层：跑 agent）逐维度对比 + 分层拓扑 + 三种组合模式 + 选型决策 + 面试快问快答 10 题 | 选型决策/面试准备 |
| [09_Sandbox_隔离技术与沙箱平台选型.md](./09_Sandbox_隔离技术与沙箱平台选型.md) | 沙箱两层拆分（隔离技术层 vs 平台层）+ OpenSandbox 深度解析 + E2B/Daytona/Modal 对比 + 威胁模型决策树 + 平台层快问快答 | 平台/安全/后端工程师 |

## 相关章节

- [[12_架构基建/02_架构概览/02_AI_基础设施_2026|AI 基础设施 2026 完全指南]] — 底层 AI Infra（GPU/训练/推理）
- [[15_智能体/06_记忆基础设施/README|记忆基础设施]] — L4 层的深入展开
- [[15_智能体/16_Agent协议/README|Agent 协议]] — L2 层的协议细节
- [[15_智能体/07_Agent评估/README|Agent 评估]] — L6 层的评估方法学
- [[概念/Agent/agent-production-deployment|Agent 生产部署概念]] — 部署视角

---
*Last updated: 2026-10-22*
