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

## 文档导航

### 本目录文档

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [The Anatomy of an Agent Harness](./The_Anatomy_of_an_Agent_Harness.md) | LangChain 博客解读：Harness 工程定义与核心组件推导 | 设计师、架构师、开发者 |
| [Agent Harness 技术架构 2026](./Agent_Harness_Architecture_2026.md) | Harness 技术架构详解：配置参数、性能指标、兼容性矩阵、多角色指南 | 全角色 |

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

- 从 [The Anatomy of an Agent Harness](./The_Anatomy_of_an_Agent_Harness.md) 理解 Harness 定义与核心组件
- 阅读 [技术架构](./Agent_Harness_Architecture_2026.md) 中的架构模式选型
- 参考 [16_Agent_Evaluation 评估指南](../16_Agent_Evaluation/Agent_Harness_Complete_2026.md) 理解评估标准

### 开发者

- 从 [技术架构](./Agent_Harness_Architecture_2026.md) 获取代码示例和集成指南
- 查看框架适配器模式（LangChain、AutoGen 等）
- 参考 [Agentic Coding Tools](../Agentic_Coding_Tools/) 选择开发工具

### 产品经理

- 阅读 [技术架构](./Agent_Harness_Architecture_2026.md) 中的功能规划与选型矩阵
- 参考 [16_Agent_Evaluation 评估维度](../16_Agent_Evaluation/Agent_Harness_Complete_2026.md#四评估维度与指标) 设定产品质量标准

### 集成测试工程师

- 从 [技术架构](./Agent_Harness_Architecture_2026.md) 获取测试策略与验证标准
- 深入 [16_Agent_Evaluation](../16_Agent_Evaluation/) 获取完整基准测试和评估方法

### 评估师

- 直接前往 [16_Agent_Evaluation](../16_Agent_Evaluation/) 获取评估框架与基准
- 参考本目录理解生产环境中的 Harness 工程实践

### 架构师

- 阅读 [技术架构](./Agent_Harness_Architecture_2026.md) 中的系统设计和扩展性章节
- 结合 [Enterprise Agent](../Enterprise_Agent/) 了解企业级架构模式

---

*Last updated: 2026-04-14*
