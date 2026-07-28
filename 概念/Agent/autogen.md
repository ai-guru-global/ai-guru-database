---
title: "AutoGen"
category: -concepts
tags: ["autogen", "microsoft", "agent", "multi-agent", "llm", "framework", "conversation", "tool-use", "ag2"]
relationships:
  - target: "概念/Agent/agent-framework"
    type: extends
  - target: "概念/Agent/multi-agent-orchestration"
    type: enables
  - target: "概念/Agent/langchain"
    type: related_to
  - target: "概念/Agent/crewai"
    type: related_to
  - target: "概念/Agent/mcp"
    type: related_to
sources:
  - 15_智能体/02_Agent_Frameworks/AutoGen_Deep_Dive.md
  - "https://github.com/microsoft/autogen"
summary: "AutoGen 是微软开源的多 Agent 对话框架，通过 ConversableAgent 抽象让多个 LLM Agent 互相协作、调用工具、执行代码。2025 年重构为 AG2。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Autogen
  - "AG2"
  - "AutoGen Studio"

name_zh: "微软多智能体框架"
---
# AutoGen

> 中文简称：微软多智能体框架

> 多 Agent 协作的「会议室」——让多个大模型角色分工、讨论、执行代码，共同解决复杂问题。

## 1. 核心定义

**AutoGen** 是微软开源的**多 Agent 对话框架**，通过 `ConversableAgent` 抽象让多个 LLM Agent 互相协作、调用工具、执行代码。2025 年社区重构为 **AG2**，引入事件驱动架构。

## 2. 核心组件

| 组件 | 说明 | 作用 |
|------|------|------|
| **ConversableAgent** | 可对话的 Agent 基类 | 所有 Agent 的父类 |
| **AssistantAgent** | 基于 LLM 的助手 | 生成回复、调用工具 |
| **UserProxyAgent** | 代表人类用户 | 执行代码、调用工具、人机交互 |
| **GroupChat** | 多 Agent 群聊 | 协调多 Agent 讨论 |
| **GroupChatManager** | 群聊管理器 | 决定下一个发言者 |
| **代码执行器** | Docker/本地执行 | 安全运行生成代码 |

## 3. 代码示例

```python
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager

# 创建 Agent
coder = AssistantAgent(
    name="Coder",
    llm_config={"model": "gpt-4o"},
    system_message="你是一个 Python 专家，写高质量代码。"
)

executor = UserProxyAgent(
    name="Executor",
    code_execution_config={"work_dir": "output", "use_docker": True},
    human_input_mode="NEVER"
)

critic = AssistantAgent(
    name="Critic",
    llm_config={"model": "gpt-4o"},
    system_message="你是代码审查专家，找出 bug 和改进点。"
)

# 多 Agent 群聊
groupchat = GroupChat(
    agents=[coder, executor, critic],
    messages=[],
    max_round=10
)
manager = GroupChatManager(groupchat=groupchat)

# 启动任务
executor.initiate_chat(manager, message="写一个快速排序算法并测试")
```

## 4. 典型场景

| 场景 | Agent 组合 | 效果 |
|------|----------|------|
| 代码生成与调试 | Coder + Critic + Executor | 自动写代码、审查、执行 |
| 数据分析 | Cleaner + Modeler + Visualizer | 多步数据处理 |
| 多角色内容创作 | Writer + Editor + Reviewer | 协作生成文档 |
| 工具编排 | Planner + ToolAgent + Verifier | 多步 API 调用 |
| 研究助手 | Searcher + Summarizer + Writer | 自动调研 |

## 5. AutoGen vs 其他框架

| 维度 | AutoGen/AG2 | CrewAI | LangGraph | OpenAI Swarm |
|------|------------|--------|-----------|-------------|
| 核心抽象 | 对话 | 角色/任务 | 状态图 | Handoff |
| 多 Agent | 群聊模式 | 顺序/层级 | 图编排 | 轻量级 |
| 代码执行 | 内置 Docker | 无 | 无 | 无 |
| 学习曲线 | 中 | 低 | 高 | 低 |
| 生产就绪 | 中 | 中 | 高 | 低 |
| 维护方 | 微软/社区 | CrewAI Inc | LangChain | OpenAI |

## 6. 2026 生态进展

| 进展 | 说明 |
|------|------|
| **AG2 重构** | 事件驱动架构，更好的可观测性和控制流 |
| **AutoGen Studio** | 可视化拖拽构建多 Agent 工作流 |
| **MCP 集成** | Agent 可消费 MCP 服务器工具 |
| **Azure 集成** | 与 Azure OpenAI、Azure Functions 深度整合 |
| **多模态** | 支持图像、音频输入输出 |

## 7. 优势与局限

| 优势 | 局限 |
|------|------|
| 多 Agent 协作抽象清晰 | 多 Agent 对话 token 成本高 |
| 内置代码执行 | 调试复杂，对话流难预测 |
| 微软维护，Azure 集成好 | 简单场景过度设计 |
| 灵活的对话模式 | 版本迭代快，API 变动大 |

## 8. 生产最佳实践

1. **控制轮数**: GroupChat 设置 `max_round`，避免无限对话
2. **明确角色**: 每个 Agent 的 system_message 要精确，避免角色混淆
3. **Docker 执行**: 代码执行必须用 Docker 隔离，避免安全风险
4. **成本监控**: 多 Agent 对话 token 消耗是单 Agent 的 3-10×
5. **终止条件**: 设置明确的终止条件，避免无意义的继续对话
6. **状态持久化**: 长时任务使用外部存储保存对话状态
7. **可观测性**: 接入 AgentOps/LangSmith 追踪对话流程

## 9. 高级特性

### 嵌套对话

```python
# Agent 内部可以启动子对话
class ManagerAgent(AssistantAgent):
    def generate_reply(self, messages):
        # 复杂任务委派给子团队
        if is_complex(messages[-1]):
            sub_chat = GroupChat(agents=[...])
            result = sub_chat.run(messages[-1])
            return summarize(result)
        return super().generate_reply(messages)
```

### 自定义 Sprecher 选择

```python
def custom_speaker_selection(last_speaker, groupchat):
    """自定义下一个发言者选择逻辑"""
    messages = groupchat.messages
    
    # 代码写完后自动进入审查
    if last_speaker.name == "Coder":
        return groupchat.agent_by_name["Critic"]
    
    # 审查通过后执行
    if last_speaker.name == "Critic" and "approved" in messages[-1]["content"]:
        return groupchat.agent_by_name["Executor"]
    
    # 默认轮流
    return groupchat.next_agent(last_speaker)

groupchat = GroupChat(
    agents=[coder, critic, executor],
    speaker_selection_method=custom_speaker_selection
)
```

## 10. AutoGen → AG2 迁移指南

| AutoGen (旧) | AG2 (新) | 说明 |
|--------------|----------|------|
| `autogen` | `ag2` | 包名变更 |
| 同步执行 | 事件驱动 | 异步架构 |
| `llm_config` | `llm_config` + `model_client` | 更灵活的模型配置 |
| 无追踪 | 内置可观测性 | OpenTelemetry 支持 |
| `GroupChat` | `GroupChat` + `Team` | 更丰富的协作模式 |

```bash
# 迁移步骤
pip uninstall autogen
pip install ag2

# 代码修改
# from autogen import AssistantAgent
from ag2 import AssistantAgent
```

## 11. 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 无限循环 | 未设置 max_round | 配置最大轮次 |
| 角色混淆 | system_message 不清晰 | 明确定义职责和边界 |
| 代码执行失败 | Docker 未配置 | 启用 use_docker=True |
| 成本过高 | 多 Agent 重复调用 | 精简 Prompt + 小模型做子任务 |
| 版本兼容 | API 变动大 | 锁定版本 + 关注 CHANGELOG |

## Related

- [[15_智能体/02_Agent_Frameworks/AutoGen_Deep_Dive|AutoGen 深度解析]]
- [[概念/Agent/agent-framework|Agent 框架]]
- [[概念/Agent/multi-agent-orchestration|多 Agent 编排]]
- [[概念/Agent/langchain|LangChain]]
- [[概念/Agent/crewai|CrewAI]]
- [[概念/Agent/mcp|MCP]]

---

## 2026 AutoGen 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **AutoGen 0.4+** | 微软多 Agent 对话框架 | GA |
| **多 Agent 协作** | 多角色 Agent 协作完成任务 | GA |
| **代码执行** | 安全的代码执行环境 | GA |
| **人机协作** | 人类参与 Agent 决策 | GA |
| **分布式 Agent** | 分布式 Agent 部署 | GA |

## 生产最佳实践

1. **角色设计**：明确每个 Agent 的角色和职责边界
2. **对话管理**：设置最大对话轮数，避免无限循环
3. **代码安全**：代码执行在沙箱环境中
4. **错误处理**：Agent 失败时优雅降级
5. **成本控制**：监控 token 消耗，设置预算上限
