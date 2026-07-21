---
title: "AgentOps (AI Agent 可观测性平台)"
category: -concepts
tags: ["agent", "observability", "tracing", "evaluation", "monitoring"]
relationships:
  - target: "概念/langsmith"
    type: related_to
  - target: "概念/langfuse"
    type: related_to
  - target: "概念/opik"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "专注于 AI Agent 的可观测性与评估平台，追踪 Agent 的决策链路、工具调用、成本和性能，是 Agent 生产环境的监控基础设施。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: supporting
created: 2026-06-26
updated: 2026-07-21
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# AgentOps

[AgentOps](https://github.com/AgentOps-AI/agentops) 是一个专注于 **AI Agent 可观测性**的平台，提供 Agent 决策链路追踪、工具调用监控、成本分析和性能评估。与 LangSmith/Langfuse 等通用 LLM 可观测性平台不同，AgentOps 特别关注 **Agent 特有的行为模式**——多步决策、工具使用、自我修正、Agent 间通信等。

## 核心特性

### 1. Agent 行为追踪

```python
import agentops

# 初始化
agentops.init(api_key="your-key")

# 自动追踪所有 Agent 活动
# - LLM 调用 (输入/输出/延迟/成本)
# - 工具调用 (输入/输出/耗时)
# - Agent 决策 (思考/规划/行动)
# - 错误和重试
# - Agent 间通信
```

### 2. 多 Agent 追踪

```python
# 追踪多 Agent 系统
agentops.init(api_key="your-key", tags=["multi-agent"])

# 每个 Agent 的独立 trace
# + Agent 间的消息传递
# + 协作/竞争模式分析
```

### 3. 会话回放

AgentOps 提供**会话级别的重放**能力：
- 完整记录 Agent 从启动到结束的每一步
- 可视化 Agent 的决策树
- 回溯错误路径和恢复过程

### 4. 成本分析

```python
# 自动追踪:
# - 每个 Agent 的 LLM API 调用成本
# - 每个工具的调用频率和延迟
# - Token 使用趋势
# - 成本异常告警
```

## 与通用 LLM 可观测性对比

| 维度 | AgentOps | LangSmith | Langfuse |
|------|----------|-----------|----------|
| **Agent 专属** | ✅ (核心) | 部分 | 部分 |
| **多 Agent** | ✅ (原生) | 部分 | 部分 |
| **决策树可视化** | ✅ | ❌ | ❌ |
| **工具调用分析** | 深度 | 基础 | 基础 |
| **会话回放** | ✅ | ❌ | ❌ |
| **开源** | ✅ | ❌ | ✅ |
| **自托管** | ✅ | ❌ | ✅ |

## 典型应用场景

- **Agent 调试**: 追踪 Agent 的决策错误和工具调用失败
- **生产监控**: 监控 Agent 的成本、延迟和成功率
- **多 Agent 系统**: 分析 Agent 间的协作和通信效率
- **A/B 测试**: 对比不同 Agent 配置的表现
- **合规审计**: 记录 Agent 的完整行为日志

## 安装

```bash
pip install agentops
```

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **当前版本** | AgentOps 2.x |
| **框架集成** | LangChain/CrewAI/AutoGen/OpenAI SDK 自动追踪 |
| **与 LangSmith 对比** | AgentOps 偏 Agent 行为，LangSmith 偏 LLM 调用链 |
| **与 Langfuse 对比** | AgentOps 商业 + 开源，Langfuse 纯开源 |
| **部署模式** | SaaS + 自托管 |

## 生产最佳实践

1. **从开发就接入**：不要等到生产才加监控，开发期即追踪
2. **设置成本告警**：每个 Agent 的 Token 消耗超阈即告警
3. **会话回放定位问题**：用决策树回放找到 Agent 走错的步骤
4. **与 CI/CD 集成**：每次发布后对比 Agent 行为变化
5. **多 Agent 系统必用**：单 Agent 可看日志，多 Agent 必须用追踪平台

## 参考资源

- [AgentOps GitHub](https://github.com/AgentOps-AI/agentops)
- [AgentOps 文档](https://docs.agentops.ai/)

## 相关概念

- [[概念/langsmith]] — LangSmith LLM 可观测性
- [[概念/langfuse]] — Langfuse 开源 LLM 可观测性
- [[概念/opik]] — Opik LLM 可观测性平台
- [[概念/phoenix-langsmith]] — Arize Phoenix LLM 可观测性
