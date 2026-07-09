---
title: "SmolAgents (HuggingFace 轻量级 Agent 框架)"
category: -concepts
tags: ["agent", "huggingface", "code-agent", "lightweight", "multi-agent"]
relationships:
  - target: "_concepts/crewai"
    type: related_to
  - target: "_concepts/autogen"
    type: related_to
  - target: "_concepts/crewai-tools"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "HuggingFace 开源的轻量级 Agent 框架，核心创新是 CodeAgent（用代码代替 JSON 调用工具），代码量仅 ~1000 行，支持多 Agent 编排。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
---

# SmolAgents

[SmolAgents](https://github.com/huggingface/smolagents)（原名 `smolagents`）是 HuggingFace 开源的**轻量级 Agent 框架**，核心代码仅约 1000 行。它的最大创新是引入了 **CodeAgent** 范式——Agent 通过编写 Python 代码（而非 JSON）来调用工具，这使得工具调用更加灵活、可组合、可调试。

## 核心创新: CodeAgent vs ToolAgent

### ToolAgent (传统)

```
用户: "Search for AI news"
Agent → JSON: {"tool": "search", "args": {"query": "AI news"}}
→ 工具执行 → 返回结果
```

### CodeAgent (SmolAgents)

```python
# Agent 直接写 Python 代码
from smolagents import CodeAgent, tool

@tool
def search(query: str) -> str:
    """Search the web for information."""
    return search_engine(query)

agent = CodeAgent(tools=[search], model=model)
result = agent.run("Search for AI news")

# Agent 生成的代码:
# result = search("AI news latest developments 2024")
# print(result)
```

**CodeAgent 优势**:
- **灵活**: 支持循环、条件、变量赋值等 Python 语法
- **可组合**: 多步操作可写入同一段代码
- **可调试**: 生成的代码可直接阅读和理解
- **可审计**: 执行步骤一目了然

## 核心特性

### 1. 极简 API

```python
from smolagents import CodeAgent, DuckDuckGoSearchTool, HfApiModel

# 3 行创建一个 Agent
model = HfApiModel()  # 使用 HuggingFace 模型
agent = CodeAgent(tools=[DuckDuckGoSearchTool()], model=model)
answer = agent.run("What is the capital of France?")
```

### 2. 自定义工具

```python
from smolagents import tool

@tool
def text_to_speech(text: str) -> str:
    """Convert text to speech audio."""
    audio = tts_model(text)
    return audio

@tool
def web_search(query: str, max_results: int = 5) -> list:
    """Search the web and return results."""
    return search_api(query, max_results)

agent = CodeAgent(tools=[text_to_speech, web_search], model=model)
```

### 3. 多 Agent 编排

```python
from smolagents import ManagedAgent

# 创建子 Agent
researcher = CodeAgent(tools=[search_tool], model=model)
writer = CodeAgent(tools=[write_tool], model=model)

# 编排为 ManagedAgent
managed_researcher = ManagedAgent(
    agent=researcher,
    name="researcher",
    description="Searches and analyzes information"
)

# 主 Agent 可以调用子 Agent
manager = CodeAgent(
    tools=[],
    managed_agents=[managed_researcher],
    model=model
)
manager.run("Research AI trends and write a summary")
```

### 4. MCP 集成

```python
from smolagents import CodeAgent, ToolCollection
from smolagents.mcp import MultiServerMCPClient

# 连接 MCP 服务器
with MultiServerMCPClient({
    "filesystem": {"url": "http://localhost:3000"},
    "github": {"url": "http://localhost:3001"},
}) as tools:
    agent = CodeAgent(tools=tools, model=model)
    agent.run("List files and check GitHub issues")
```

### 5. 多模型支持

```python
# HuggingFace
from smolagents import HfApiModel

# OpenAI
from smolagents import LiteLLMModel
model = LiteLLMModel(model_id="gpt-4o")

# Ollama (本地)
model = LiteLLMModel(model_id="ollama/llama3")

# 任意 OpenAI 兼容
model = LiteLLMModel(model_id="openai/gpt-4", api_base="http://localhost:8000")
```

## 与 CrewAI/AutoGen 对比

| 维度 | SmolAgents | CrewAI | AutoGen |
|------|-----------|--------|---------|
| **代码量** | ~1000 行 | 复杂 | 复杂 |
| **Agent 范式** | CodeAgent | Role-based | Conversation |
| **学习曲线** | 低 | 中 | 高 |
| **灵活性** | 高 (代码) | 中 | 高 |
| **多 Agent** | ManagedAgent | Crew | GroupChat |
| **MCP** | 原生支持 | 通过工具 | 通过工具 |
| **维护方** | HuggingFace | 社区 | Microsoft |

## 典型应用场景

- **轻量 Agent**: 不需要复杂框架的简单 Agent 任务
- **代码执行**: 需要 Agent 编写和执行代码
- **RAG Agent**: 搜索 + 总结的 RAG Agent
- **教育**: 学习 Agent 架构的入门框架

## 安装

```bash
pip install smolagents
```

## 参考资源

- [SmolAgents GitHub](https://github.com/huggingface/smolagents)
- [SmolAgents 文档](https://huggingface.co/docs/smolagents)
- [HuggingFace](https://huggingface.co/)

## 相关概念

- [[_concepts/crewai]] — CrewAI 多 Agent 协作框架
- [[_concepts/autogen]] — AutoGen 多 Agent 对话框架
- [[_concepts/crewai-tools]] — CrewAI 工具集
- [[_concepts/autogen-studio]] — AutoGen Studio 可视化 IDE
