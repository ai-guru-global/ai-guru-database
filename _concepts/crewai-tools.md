---
title: "CrewAI Tools (Agent 工具集生态)"
category: -concepts
tags: ["agent-tools", "crewai", "tool-use", "function-calling", "ecosystem"]
relationships:
  - target: "_concepts/crewai"
    type: related_to
  - target: "_concepts/autogen"
    type: related_to
  - target: "_concepts/agentops"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "CrewAI 生态的官方工具集，提供 40+ 预置工具（文件/搜索/数据库/API），支持自定义扩展，让 Agent 具备实际操作能力。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: stable
tier: supporting
---

# CrewAI Tools

[CrewAI Tools](https://github.com/crewAIInc/crewAI-tools) 是 **CrewAI 生态的官方工具集**，为 AI Agent 提供 40+ 预置工具，覆盖文件操作、Web 搜索、数据库查询、API 调用等常见任务场景。它是 CrewAI Agent 的"手脚"——赋予 Agent 实际执行操作的能力。

## 工具分类

### 1. 文件与文档工具

| 工具 | 功能 |
|------|------|
| `FileReadTool` | 读取文件内容 |
| `FileWriterTool` | 写入文件 |
| `DirectoryReadTool` | 列出目录内容 |
| `PDFSearchTool` | 搜索 PDF 内容 |
| `DOCXSearchTool` | 搜索 Word 文档 |
| `CSVSearchTool` | 搜索 CSV 数据 |
| `JSONSearchTool` | 搜索 JSON 文件 |

### 2. Web 工具

| 工具 | 功能 |
|------|------|
| `SerperDevTool` | Google 搜索 (Serper API) |
| `ScrapeWebsiteTool` | 抓取网页内容 |
| `WebsiteSearchTool` | 搜索指定网站 |
| `SpiderTool` | 深度网页爬取 |
| `FirecrawlSearchTool` | Firecrawl 搜索 |

### 3. 数据库工具

| 工具 | 功能 |
|------|------|
| `PGSearchTool` | PostgreSQL 查询 |
| `MySQLSearchTool` | MySQL 查询 |
| `NL2SQLTool` | 自然语言转 SQL |

### 4. AI 集成工具

| 工具 | 功能 |
|------|------|
| `VisionTool` | 图像理解 |
| `CodeInterpreterTool` | 代码执行 |
| `DallETool` | 图像生成 |

## 使用示例

```python
from crewai_tools import (
    FileReadTool,
    SerperDevTool,
    ScrapeWebsiteTool,
    CodeInterpreterTool,
)

# 为 Agent 配置工具
researcher = Agent(
    role="Researcher",
    goal="Find information about AI trends",
    tools=[SerperDevTool(), ScrapeWebsiteTool()],
)

coder = Agent(
    role="Coder",
    goal="Write and execute Python code",
    tools=[CodeInterpreterTool(), FileReadTool(), FileWriterTool()],
)
```

## 自定义工具

```python
from crewai_tools import BaseTool

class MyCustomTool(BaseTool):
    name: str = "My Custom Tool"
    description: str = "Does something specific"

    def _run(self, argument: str) -> str:
        # 工具实现
        return f"Result for: {argument}"
```

## 典型应用场景

- **研究 Agent**: 搜索 + 抓取 + 总结信息
- **数据分析 Agent**: 数据库查询 + 代码执行
- **内容 Agent**: 文件读写 + 文档搜索
- **通用 Agent**: 组合多种工具完成任务

## 安装

```bash
pip install crewai-tools
```

## 参考资源

- [CrewAI Tools GitHub](https://github.com/crewAIInc/crewAI-tools)
- [CrewAI 文档](https://docs.crewai.com/)

## 相关概念

- [[_concepts/crewai]] — CrewAI 多 Agent 协作框架
- [[_concepts/autogen]] — AutoGen 多 Agent 框架
- [[_concepts/smolagents]] — HuggingFace SmolAgents 轻量 Agent
- [[_concepts/autogen-studio]] — AutoGen Studio 可视化 IDE
