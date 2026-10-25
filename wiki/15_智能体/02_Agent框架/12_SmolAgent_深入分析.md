---
title: "SmolAgents: 轻量级 Agent 框架"
category: "15-agent-production-agent-frameworks"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: SmolAgents 是 Hugging Face 推出的轻量级 Agent 框架——用最少的代码实现 Tool Calling 和自主决策，让构建 Agent 变得简单高效。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Smolagents Deep Dive"
  - "SmolAgents Deep Dive"
  - SmolAgents_Deep_Dive
sources: []

name_zh: "SmolAgents: 轻量级 Agent 框架"
---
# SmolAgents: 轻量级 Agent 框架

> 中文简称：SmolAgents: 轻量级 Agent 框架

> **一句话理解**: SmolAgents 是 Hugging Face 推出的轻量级 Agent 框架——用最少的代码实现 Tool Calling 和自主决策，让构建 Agent 变得简单高效。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [代码示例](#4-代码示例)
5. [工具集成](#5-工具集成)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
SmolAgents: 轻量级 Agent 框架
═══════════════════════════════════════════════════════════════════

定位: Hugging Face 出品的极简 Agent 开发框架

核心理念:
───────────────────────────────────────────────────────────────────
• 轻量: 核心代码极少，易于理解和修改
• 集成: 原生集成 HuggingFace 生态
• 工具: 内置代码解释器和搜索工具
• 灵活: 轻松扩展自定义工具
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Code Agent** | 内置代码执行能力 |
| **HuggingFace 集成** | 直接使用 Hub 上的模型和数据集 |
| **多工具支持** | 搜索、代码执行、文件操作 |
| **本地模型支持** | 可连接 Ollama 等本地模型 |
| **流式输出** | 支持流式 Token 输出 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| smolagents 0.1 | 2024.5 | 首个版本，Code Agent |
| smolagents 0.2 | 2024.8 | 工具系统重构 |
| smolagents 0.3 | 2024.11 | 本地模型支持 |
| smolagents 0.4 | 2025.2 | 多模态工具 |
| smolagents 0.5 | 2025.4 | 生产就绪版本 |

---

## 2. 核心概念

### 2.1 架构概览

```
SmolAgents 核心架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        SmolAgents 架构                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                     Agent (核心)                        │   │
│   │  ┌──────────────────────────────────────────────────┐  │   │
│   │  │  CodeAgent / ReactAgent / ToolCallingAgent       │  │   │
│   │  └──────────────────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                     Tools (工具层)                      │   │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│   │  │ Code     │ │ Search   │ │hf_write  │ │ Custom   │  │   │
│   │  │ Executor │ │ Tool     │ │ Tool     │ │ Tool     │  │   │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  Model (模型层)                         │   │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│   │  │ HuggingFace│ │ Ollama  │ │ OpenAI  │ │ Anthropic│  │   │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Agent 类型

| Agent 类型 | 特点 | 适用场景 |
|------------|------|----------|
| **CodeAgent** | 生成代码执行 | 需要计算/数据处理 |
| **ReactAgent** | 思考-行动循环 | 复杂推理任务 |
| **ToolCallingAgent** | 直接调用工具 | 简单任务流 |

### 2.3 内置工具

```python
# SmolAgents 内置工具
built_in工具 = {
    # 代码执行
    "CodeInterpreter": "执行 Python 代码，返回结果",

    # 搜索
    "GoogleSearch": "搜索网络信息",
    "DuckDuckGoSearch": "隐私搜索",

    # HuggingFace
    "HuggingFaceDocsSearch": "搜索 HF 文档",
    "HubTool": "访问模型/数据集 Hub",

    # 文件操作
    "ReadFileTool": "读取本地文件",
    "WriteFileTool": "写入本地文件",
}
```

---

## 3. 架构设计

### 3.1 CodeAgent 执行流程

```
CodeAgent 执行流程
═══════════════════════════════════════════════════════════════════

用户: "计算 1 到 100 的和"

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 思考                                                     │
│ ───────────────────────────────────────────────────────────────  │
│ Agent 分析任务 → 需要代码执行计算                                │
│                                                                   │
│ 生成的代码:                                                       │
│ ```python                                                       │
│ result = sum(range(1, 101))                                      │
│ print(result)                                                    │
│ ```                                                              │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: 代码执行                                                 │
│ ───────────────────────────────────────────────────────────────  │
│ Python 解释器执行代码                                             │
│ → 输出: 5050                                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 结果返回                                                 │
│ ───────────────────────────────────────────────────────────────  │
│ "1 到 100 的和是 5050"                                           │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 工具调用协议

```
工具调用流程
═══════════════════════════════════════════════════════════════════

LLM 输出格式:
───────────────────────────────────────────────────────────────────

{
  "tool_calls": [
    {
      "name": "google_search",
      "arguments": {
        "query": "最新 AI Agent 技术趋势 2026"
      }
    }
  ]
}

→ 工具执行 → 返回结果 → LLM 整合 → 最终响应
```

---

## 4. 代码示例

### 4.1 基础 CodeAgent

```python
from smolagents import CodeAgent, GoogleSearchTool

# 创建 Agent
agent = CodeAgent(
    model=HuggingFaceModel(model_id="meta-llama/Meta-Llama-3-8B-Instruct"),
    tools=[GoogleSearchTool()],
    add_base_tools=True,  # 添加代码解释器
)

# 执行任务
result = agent.run("搜索 2026 年 AI Agent 发展趋势")
print(result)
```

### 4.2 本地模型 (Ollama)

```python
from smolagents import CodeAgent
from smolagents.local_models import OllamaModel

# 使用 Ollama 本地模型
model = OllamaModel(
    model_id="llama3",
    temperature=0.7,
)

agent = CodeAgent(
    model=model,
    tools=[],  # 可选工具
    add_base_tools=True,
)

result = agent.run("写一段 Python 代码快速排序")
```

### 4.3 自定义工具

```python
from smolagents import Tool, CodeAgent

# 定义自定义工具
class WeatherTool(Tool):
    name = "get_weather"
    description = "获取指定城市的天气信息"

    inputs = {
        "city": {"type": "string", "description": "城市名称"}
    }
    output_type = "string"

    def forward(self, city: str) -> str:
        # 实际实现调用天气 API
        return f"{city} 天气晴朗，25°C"

# 使用自定义工具
agent = CodeAgent(
    tools=[WeatherTool()],
    add_base_tools=True,
)

result = agent.run("北京今天的天气怎么样？")
```

### 4.4 多工具协作

```python
from smolagents import CodeAgent, GoogleSearchTool, ReadFileTool

agent = CodeAgent(
    tools=[
        GoogleSearchTool(),
        ReadFileTool(),
    ],
    add_base_tools=True,
)

# 多工具任务
task = """
1. 搜索最新的 LLM 推理性能基准
2. 读取本地的模型配置文档
3. 比较两者给出建议
"""

result = agent.run(task)
```

---

## 5. 工具集成

### 5.1 HuggingFace Hub 集成

```python
from smolagents import CodeAgent, HubTool

# 直接访问 HuggingFace Hub
agent = CodeAgent(
    tools=[HubTool()],
)

# 搜索模型
result = agent.run("搜索图像分类相关的 CLIP 模型")

# 加载数据集
agent.run("加载一个中文情感分析数据集")
```

### 5.2 文件操作

```python
from smolagents import ReadFileTool, WriteFileTool

agent = CodeAgent(
    tools=[ReadFileTool(), WriteFileTool()],
)

# 读取文件
content = agent.run("读取 ./config.json 文件")

# 写入文件
agent.run("创建一个 README.md，内容是项目说明")
```

### 5.3 代码执行安全

```python
from smolagents import CodeAgent, CodeExecutionTool

# 代码执行工具 (有安全限制)
agent = CodeAgent(
    tools=[CodeExecutionTool(
        timeout=30,           # 超时时间
        max_retries=2,        # 最大重试次数
        sandboxed=True,       # 沙箱执行
    )],
)
```

---

## 6. 对比与选择

### 6.1 与其他框架对比

| 维度 | SmolAgents | LangGraph | AutoGen | CrewAI |
|------|-------------|-----------|---------|--------|
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **轻量性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **HF 集成** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| **工具生态** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **生产就绪** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 适用场景

**✅ SmolAgents 最佳场景:**
- HuggingFace 生态用户
- 快速原型和实验
- 需要代码执行能力
- 本地模型部署
- 学习和教育目的

**❌ 不适合场景:**
- 复杂多 Agent 协作 (用 AutoGen/LangGraph)
- 企业级生产部署
- 需要复杂工作流编排

---

## 参考资源

- [SmolAgents GitHub](https://github.com/huggingface/smolagents)
- [SmolAgents 文档](https://smolagents.readthedocs.io/)
- [Hugging Face Agents 课程](https://huggingface.co/learn/agent-course/)

---

*Last updated: 2026-04-24*
*Version: 1.0.0*

## Related

- [[15_智能体/07_Agent评估/05_Agent_脚手架_完整_2026.md|Agent_Harness_Complete_2026]]
- [[15_智能体/07_Agent评估/08_Agent_红队测试_2026.md|Agent_Red_Teaming_2026]]
- [[15_智能体/07_Agent评估/Assessment/03_评估_工作流.md|Evaluation_Workflow]]
- [[15_智能体/07_Agent评估/Assessment/01_生产_Assessment.md|Production_Assessment]]
- [[15_智能体/07_Agent评估/Benchmarking/03_基准测试_Criteria.md|Benchmarking_Criteria]]
