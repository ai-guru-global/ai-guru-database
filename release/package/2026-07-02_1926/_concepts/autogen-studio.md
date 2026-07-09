---
title: "AutoGen Studio (多 Agent 可视化 IDE)"
category: -concepts
tags: ["multi-agent", "autogen", "microsoft", "visualization", "low-code"]
relationships:
  - target: "_concepts/autogen"
    type: related_to
  - target: "_concepts/crewai"
    type: related_to
  - target: "_concepts/agentops"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Microsoft 开源的 AutoGen 可视化 IDE，通过拖拽界面构建和测试多 Agent 工作流，降低 AutoGen 的使用门槛。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: supporting
---

# AutoGen Studio

[AutoGen Studio](https://github.com/microsoft/autogen-studio) 是 Microsoft 开源的 **AutoGen 可视化 IDE**，通过拖拽式界面构建、测试和运行多 Agent 工作流。它降低了 AutoGen 的使用门槛——无需编写复杂代码，即可创建功能强大的多 Agent 协作系统。

## 核心特性

### 1. 可视化 Agent 构建

- **拖拽 Agent**: 可视化创建和配置 Agent
- **Skill 库**: 预置工具/技能（代码执行、文件操作、Web 搜索）
- **Workflow 编辑器**: 可视化编排 Agent 间的协作流程
- **Team 管理**: 创建和管理多 Agent 团队

### 2. Agent 类型

```
支持的 Agent 类型:
- AssistantAgent: 通用对话 Agent
- UserProxyAgent: 人类代理
- GroupChat: 多 Agent 群聊
- 自定义 Agent: 通过代码扩展
```

### 3. Skill 系统

```json
{
  "name": "code_executor",
  "description": "Execute Python code",
  "content": "def execute(code):\n    exec(code)\n    return result",
  "secrets": [],
  "libraries": ["numpy", "pandas"]
}
```

### 4. Playground 模式

- **即时测试**: 在 Playground 中即时测试 Agent
- **会话历史**: 查看所有 Agent 的对话历史
- **文件管理**: 管理 Agent 生成的文件
- **Galleries**: 分享和导入 Agent 配置

## 架构

```
┌─────────────────────────────────────┐
│         Web UI (React)              │
│  Agent Builder | Workflow | Play    │
├─────────────────────────────────────┤
│         FastAPI Backend             │
├─────────────────────────────────────┤
│         AutoGen Core                │
│  Agent | GroupChat | Executor       │
├─────────────────────────────────────┤
│         LLM Backend                 │
│  OpenAI | Azure | Local Models      │
└─────────────────────────────────────┘
```

## 安装

```bash
pip install autogenstudio

# 启动
autogenstudio ui --port 8080
```

## 典型应用场景

- **快速原型**: 无需编码快速搭建多 Agent 系统
- **教育**: 学习 AutoGen 和多 Agent 模式
- **调试**: 可视化调试 Agent 行为
- **演示**: 向非技术人员展示 Agent 能力

## 参考资源

- [AutoGen Studio GitHub](https://github.com/microsoft/autogen-studio)
- [AutoGen 官方](https://microsoft.github.io/autogen/)

## 相关概念

- [[_concepts/autogen]] — AutoGen 多 Agent 对话框架
- [[_concepts/crewai]] — CrewAI 多 Agent 协作框架
- [[_concepts/crewai-tools]] — CrewAI 工具集
- [[_concepts/agentops]] — AgentOps Agent 可观测性
